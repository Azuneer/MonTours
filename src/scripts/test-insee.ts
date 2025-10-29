import { env } from '../config/env';

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

interface Company {
  siret: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  nafCode: string;
  createdAt?: string;
  isActive: boolean;
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
      // Aucun résultat trouvé
      return [];
    }
    const error = await response.text();
    throw new Error(`API Error: ${response.status} - ${error}`);
  }

  const data: InseeApiResponse = await response.json();
  return data.etablissements || [];
}

function parseCompany(etab: any): Company {
  const uniteLegale = etab.uniteLegale || {};
  const adresse = etab.adresseEtablissement || {};
  const periode = etab.periodesEtablissement?.[0] || {};

  // Nom de l'entreprise
  const name = uniteLegale.denominationUniteLegale || 
               `${uniteLegale.prenomUsuelUniteLegale || ''} ${uniteLegale.nomUniteLegale || ''}`.trim() ||
               'Entreprise sans nom';

  // Adresse
  const address = [
    adresse.numeroVoieEtablissement,
    adresse.typeVoieEtablissement,
    adresse.libelleVoieEtablissement
  ].filter(Boolean).join(' ') || 'Adresse non renseignée';

  return {
    siret: etab.siret,
    name,
    address,
    postalCode: adresse.codePostalEtablissement || '',
    city: adresse.libelleCommuneEtablissement || '',
    nafCode: periode.activitePrincipaleEtablissement || uniteLegale.activitePrincipaleUniteLegale || '',
    createdAt: etab.dateCreationEtablissement,
    isActive: periode.etatAdministratifEtablissement === 'A',
  };
}

async function importInseeCompanies() {
  console.log('🚀 Import des entreprises IT de Tours depuis l\'API INSEE\n');
  
  const API_KEY = env.INSEE_API_KEY;
  if (!API_KEY) {
    console.error('❌ INSEE_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('✅ API Key found\n');

  // Construction de la requête pour tous les codes postaux
  const postalQuery = TOURS_POSTAL_CODES.map(cp => `codePostalEtablissement:${cp}`).join(' OR ');
  
  // Recherche de TOUTES les entreprises IT (codes NAF 62*) sur l'agglomération
  console.log('📡 Recherche de toutes les entreprises IT (NAF 62*) actives...\n');
  
  // On utilise periode() avec wildcard 62* et filtre sur établissements actifs
  const query = `(${postalQuery}) AND periode(activitePrincipaleEtablissement:62* AND etatAdministratifEtablissement:A)`;
  
  console.log('🔍 Query:', query);
  console.log();

  try {
    // L'API limite à 1000 résultats par requête
    // Il faudra faire de la pagination si on veut tout récupérer
    const etablissements = await fetchInseeData(query, 1000);
    
    console.log(`✅ Trouvé ${etablissements.length} établissements IT actifs\n`);

    if (etablissements.length === 0) {
      console.log('⚠️  Aucune entreprise trouvée avec ces critères');
      process.exit(0);
    }

    // Parser les données
    const companies = etablissements.map(parseCompany);
    
    // Statistiques
    console.log('📊 Statistiques:\n');
    console.log(`   Total d'établissements: ${companies.length}`);
    console.log(`   Établissements uniques (SIRET): ${new Set(companies.map(c => c.siret)).size}`);
    console.log(`   Établissements actifs: ${companies.filter(c => c.isActive).length}`);
    
    // Distribution par code postal
    const byPostalCode = companies.reduce((acc, company) => {
      acc[company.postalCode] = (acc[company.postalCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📍 Distribution par code postal:');
    Object.entries(byPostalCode)
      .sort(([, a], [, b]) => b - a)
      .forEach(([cp, count]) => {
        const city = TOURS_POSTAL_CODES.includes(cp) ? 
          (cp.startsWith('370') ? 'Tours' : 'Agglomération') : 
          'Autre';
        console.log(`   ${cp} (${city}): ${count} établissements`);
      });

    // Distribution par code NAF
    const byNafCode = companies.reduce((acc, company) => {
      acc[company.nafCode] = (acc[company.nafCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n💼 Distribution par code NAF:');
    Object.entries(byNafCode)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10
      .forEach(([naf, count]) => {
        console.log(`   ${naf}: ${count} établissements`);
      });

    // Afficher quelques exemples
    console.log('\n📋 Exemples d\'entreprises trouvées:\n');
    companies.slice(0, 15).forEach((company, index) => {
      console.log(`${index + 1}. ${company.name}`);
      console.log(`   ${company.address}`);
      console.log(`   ${company.postalCode} ${company.city}`);
      console.log(`   NAF: ${company.nafCode} | SIRET: ${company.siret}`);
      console.log(`   Actif: ${company.isActive ? '✅' : '❌'}`);
      console.log();
    });

    // Note sur la pagination
    if (etablissements.length === 1000) {
      console.log('⚠️  ATTENTION : La limite de 1000 résultats a été atteinte !');
      console.log('   Il y a probablement plus d\'entreprises à récupérer.');
      console.log('   Pour tout récupérer, il faudra implémenter la pagination avec le paramètre "curseur".\n');
    }

    console.log('✅ Import terminé!\n');
    
    // TODO: Insérer dans la base de données
    console.log('💡 Prochaine étape: Insérer les données dans PostgreSQL');
    console.log('   - Créer une table "companies"');
    console.log('   - Mapper les données vers le schéma');
    console.log('   - Gérer les doublons (upsert sur SIRET)');
    console.log('   - Ajouter la géolocalisation (lat/lng)\n');

    // Retourner les données pour utilisation ultérieure
    return companies;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    process.exit(1);
  }
}

// Lancer l'import
importInseeCompanies();
