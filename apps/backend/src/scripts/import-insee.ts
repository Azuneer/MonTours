import { env } from '../config/env';
import { db } from '../config/database';
import { companies, type NewCompany } from '../modules/companies/schema';
import { eq } from 'drizzle-orm';

// Codes postaux de Tours et agglomération
const TOURS_POSTAL_CODES = [
  '37000', '37100', '37200', '37300', // Tours
  '37510', '37540', '37550', '37170', // Agglomération
];

interface InseeApiResponse {
  header: {
    statut: number;
    message: string;
    total?: number;
    debut?: number;
    nombre?: number;
  };
  etablissements?: any[];
}

async function fetchInseeData(query: string, nombre: number = 1000): Promise<any[]> {
  const API_KEY = env.INSEE_API_KEY;
  const baseUrl = 'https://api.insee.fr/api-sirene/3.11/siret';
  
  const url = `${baseUrl}?q=${encodeURIComponent(query)}&nombre=${nombre}`;
  
  const response = await fetch(url, {
    headers: {
      'X-INSEE-Api-Key-Integration': API_KEY,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  const data: InseeApiResponse = await response.json();
  return data.etablissements || [];
}

function mapInseeToCompany(etab: any): NewCompany {
  const uniteLegale = etab.uniteLegale || {};
  const adresse = etab.adresseEtablissement || {};
  const periode = etab.periodesEtablissement?.[0] || {};

  // Nom de l'entreprise
  const name = uniteLegale.denominationUniteLegale || 
               `${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim() ||
               'Entreprise sans nom';

  // Adresse complète
  const address = [
    adresse.numeroVoieEtablissement,
    adresse.typeVoieEtablissement,
    adresse.libelleVoieEtablissement
  ].filter(Boolean).join(' ') || null;

  // Code NAF
  const nafCode = periode.activitePrincipaleEtablissement || uniteLegale.activitePrincipaleUniteLegale || '';
  
  // Déterminer le type d'entreprise basé sur le code NAF
  let companyType = 'PME'; // Par défaut
  if (nafCode.startsWith('62.01')) {
    companyType = 'Startup'; // Programmation informatique
  } else if (nafCode.startsWith('62.02')) {
    companyType = 'ESN'; // Conseil en systèmes informatiques
  }

  // Déterminer le secteur basé sur le code NAF
  let sector = 'IT';
  if (nafCode.startsWith('62.01')) {
    sector = 'Web';
  } else if (nafCode.startsWith('62.02A')) {
    sector = 'Conseil IT';
  } else if (nafCode.startsWith('62.02B')) {
    sector = 'Maintenance IT';
  } else if (nafCode.startsWith('62.03')) {
    sector = 'Infrastructure';
  } else if (nafCode.startsWith('62.09')) {
    sector = 'Services IT';
  } else if (nafCode.startsWith('58.29')) {
    sector = 'Logiciel';
  } else if (nafCode.startsWith('63.11')) {
    sector = 'Cloud/Data';
  }

  // Année de création
  const foundedYear = etab.dateCreationEtablissement 
    ? etab.dateCreationEtablissement.substring(0, 4)
    : null;

  return {
    name: name.substring(0, 255), // Limite à 255 caractères
    siret: etab.siret,
    companyType,
    sector,
    address,
    postalCode: adresse.codePostalEtablissement || null,
    city: adresse.libelleCommuneEtablissement || null,
    latitude: null, // TODO: Géocodage ultérieur
    longitude: null, // TODO: Géocodage ultérieur
    website: null, // Pas disponible dans l'API INSEE
    email: null, // Pas disponible dans l'API INSEE
    phone: null, // Pas disponible dans l'API INSEE
    description: null,
    employees: null, // TODO: Pourrait être déduit de trancheEffectifsUniteLegale
    foundedYear,
    technologies: null,
  };
}

async function importInseeCompanies() {
  console.log('🚀 Import des entreprises IT de Tours vers PostgreSQL\n');
  
  const API_KEY = env.INSEE_API_KEY;
  if (!API_KEY) {
    console.error('❌ INSEE_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('✅ API Key found');
  
  // Test de connexion à la base de données
  try {
    await db.select().from(companies).limit(1);
    console.log('✅ Database connected\n');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }

  // Construction de la requête pour tous les codes postaux
  const postalQuery = TOURS_POSTAL_CODES.map(cp => `codePostalEtablissement:${cp}`).join(' OR ');
  
  // Recherche de TOUTES les entreprises IT (codes NAF 62*) actives
  console.log('📡 Récupération des données depuis l\'API INSEE...\n');
  
  const query = `(${postalQuery}) AND periode(activitePrincipaleEtablissement:62* AND etatAdministratifEtablissement:A)`;
  
  try {
    const etablissements = await fetchInseeData(query, 1000);
    
    console.log(`✅ ${etablissements.length} établissements récupérés depuis l'API\n`);

    if (etablissements.length === 0) {
      console.log('⚠️  Aucune entreprise trouvée avec ces critères');
      process.exit(0);
    }

    // Mapper les données vers le schéma companies
    console.log('🔄 Mapping des données vers le schéma PostgreSQL...\n');
    const companiesToInsert = etablissements.map(mapInseeToCompany);

    // Insertion dans la base de données avec gestion des doublons
    console.log('💾 Insertion dans la base de données...\n');
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const company of companiesToInsert) {
      try {
        // Vérifier si l'entreprise existe déjà (par SIRET)
        const existing = await db
          .select()
          .from(companies)
          .where(eq(companies.siret, company.siret!))
          .limit(1);

        if (existing.length > 0) {
          // Mise à jour de l'entreprise existante
          await db
            .update(companies)
            .set({
              ...company,
              updatedAt: new Date(),
            })
            .where(eq(companies.siret, company.siret!));
          updated++;
          
          if (updated % 50 === 0) {
            console.log(`   ⏳ ${updated} entreprises mises à jour...`);
          }
        } else {
          // Insertion d'une nouvelle entreprise
          await db.insert(companies).values(company);
          inserted++;
          
          if (inserted % 50 === 0) {
            console.log(`   ⏳ ${inserted} entreprises insérées...`);
          }
        }
      } catch (error) {
        errors++;
        console.error(`   ❌ Erreur pour SIRET ${company.siret}:`, error);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Résumé de l\'import:\n');
    console.log(`   ✅ ${inserted} nouvelles entreprises insérées`);
    console.log(`   🔄 ${updated} entreprises mises à jour`);
    console.log(`   ❌ ${errors} erreurs`);
    console.log(`   📈 Total traité: ${inserted + updated + errors}/${companiesToInsert.length}`);

    // Statistiques finales depuis la base de données
    console.log('\n📊 Statistiques dans la base de données:\n');
    
    const totalCompanies = await db.select().from(companies);
    console.log(`   Total d'entreprises en base: ${totalCompanies.length}`);

    // Distribution par type
    const byType: Record<string, number> = {};
    totalCompanies.forEach(c => {
      byType[c.companyType || 'Inconnu'] = (byType[c.companyType || 'Inconnu'] || 0) + 1;
    });
    
    console.log('\n   Distribution par type:');
    Object.entries(byType)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`     ${type}: ${count}`);
      });

    // Distribution par secteur
    const bySector: Record<string, number> = {};
    totalCompanies.forEach(c => {
      bySector[c.sector || 'Inconnu'] = (bySector[c.sector || 'Inconnu'] || 0) + 1;
    });
    
    console.log('\n   Distribution par secteur:');
    Object.entries(bySector)
      .sort(([, a], [, b]) => b - a)
      .forEach(([sector, count]) => {
        console.log(`     ${sector}: ${count}`);
      });

    // Distribution par ville
    const byCity: Record<string, number> = {};
    totalCompanies.forEach(c => {
      byCity[c.city || 'Inconnu'] = (byCity[c.city || 'Inconnu'] || 0) + 1;
    });
    
    console.log('\n   Distribution par ville (Top 5):');
    Object.entries(byCity)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .forEach(([city, count]) => {
        console.log(`     ${city}: ${count}`);
      });

    console.log('\n✅ Import terminé avec succès!\n');
    
    // Prochaines étapes
    console.log('💡 Prochaines étapes suggérées:\n');
    console.log('   1. Géocodage des adresses (ajouter lat/lng)');
    console.log('   2. Enrichissement avec données externes (site web, etc.)');
    console.log('   3. Scraping des sites web pour plus d\'infos');
    console.log('   4. Ajout des technologies utilisées\n');

  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  }
}

// Lancer l'import
importInseeCompanies();
