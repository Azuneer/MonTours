import { db } from '../config/database';
import { companies, type NewCompany } from '../modules/companies/schema';
import { CompanyService } from '../modules/companies/service';

const companyService = new CompanyService();

// Données de test - Entreprises IT réelles et fictives de Tours
const seedCompanies: NewCompany[] = [
  // Startups
  {
    name: 'Kelindi',
    siret: '90123456700012',
    siren: '901234567',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'Web & Mobile',
    address: 'Tours Technopole, 16 Rue Léon Dierx',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3900474',
    longitude: '0.6889268',
    website: 'https://kelindi.fr',
    email: 'contact@kelindi.fr',
    description: 'Plateforme digitale de mise en relation pour les professionnels du bâtiment',
    employees: '1-10',
    foundedYear: '2023',
    technologies: JSON.stringify(['React', 'Node.js', 'MongoDB']),
  },
  {
    name: 'WiziFarm',
    siret: '85234567800013',
    siren: '852345678',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'AgriTech',
    address: '60 Rue du Plat d\'Étain',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3952257',
    longitude: '0.6895644',
    website: 'https://wizifarm.com',
    email: 'hello@wizifarm.com',
    description: 'Solution IoT pour optimiser la gestion agricole',
    employees: '11-50',
    foundedYear: '2019',
    technologies: JSON.stringify(['IoT', 'Python', 'AWS', 'Machine Learning']),
  },
  {
    name: 'Drone Studio',
    siret: '87345678900014',
    siren: '873456789',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'Audiovisuel & Tech',
    address: '15 Boulevard Béranger',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3929548',
    longitude: '0.6848958',
    website: 'https://drone-studio-tours.fr',
    email: 'contact@drone-studio.fr',
    description: 'Prises de vues aériennes par drone et post-production',
    employees: '1-10',
    foundedYear: '2020',
    technologies: JSON.stringify(['Drone', 'Video Editing', 'WebGL']),
  },
  
  // ESN (Entreprises de Services du Numérique)
  {
    name: 'Altran Tours',
    siret: '70234567800015',
    siren: '702345678',
    naf: '6202A',
    companyType: 'ESN',
    sector: 'Conseil IT',
    address: '10 Rue de la Dolve',
    postalCode: '37100',
    city: 'Tours',
    latitude: '47.4084648',
    longitude: '0.6916442',
    website: 'https://www.capgemini.com/fr-fr/',
    email: 'tours@altran.com',
    description: 'Conseil en ingénierie et services numériques (groupe Capgemini)',
    employees: '51-200',
    foundedYear: '2005',
    technologies: JSON.stringify(['Java', 'C++', 'Python', 'DevOps', 'Cloud']),
  },
  {
    name: 'Sopra Steria Tours',
    siret: '71345678900016',
    siren: '713456789',
    naf: '6202A',
    companyType: 'ESN',
    sector: 'Conseil & Services IT',
    address: '2 Rue Edmond Michelet',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3893428',
    longitude: '0.6930181',
    website: 'https://www.soprasteria.com',
    email: 'tours@soprasteria.com',
    description: 'Leader européen de la transformation numérique',
    employees: '201-500',
    foundedYear: '2000',
    technologies: JSON.stringify(['Java', '.NET', 'Angular', 'Azure', 'SAP']),
  },
  {
    name: 'CGI Tours',
    siret: '72456789000017',
    siren: '724567890',
    naf: '6202A',
    companyType: 'ESN',
    sector: 'Services IT',
    address: '1 Place Choiseul',
    postalCode: '37100',
    city: 'Tours',
    latitude: '47.4089157',
    longitude: '0.6864358',
    website: 'https://www.cgi.com/fr/fr-fr',
    email: 'tours@cgi.com',
    description: 'Services conseils en TI et gestion des processus d\'affaires',
    employees: '51-200',
    foundedYear: '2010',
    technologies: JSON.stringify(['Java', 'Oracle', 'Salesforce', 'Cloud']),
  },
  
  // PME - Web & Digital
  {
    name: 'Kaliop',
    siret: '73567890100018',
    siren: '735678901',
    naf: '6201Z',
    companyType: 'PME',
    sector: 'Agence Web',
    address: '33 Rue Nationale',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3956228',
    longitude: '0.6889268',
    website: 'https://www.kaliop.com',
    email: 'tours@kaliop.com',
    description: 'Agence digitale spécialisée en expérience utilisateur et plateformes web',
    employees: '51-200',
    foundedYear: '2001',
    technologies: JSON.stringify(['Symfony', 'React', 'eZ Platform', 'AWS']),
  },
  {
    name: 'Websio',
    siret: '74678901200019',
    siren: '746789012',
    naf: '6201Z',
    companyType: 'PME',
    sector: 'Développement Web',
    address: '12 Rue Baleschoux',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3922548',
    longitude: '0.6902358',
    website: 'https://websio.fr',
    email: 'contact@websio.fr',
    description: 'Création de sites web et applications sur-mesure',
    employees: '11-50',
    foundedYear: '2015',
    technologies: JSON.stringify(['WordPress', 'PHP', 'JavaScript', 'Vue.js']),
  },
  {
    name: 'Nealite',
    siret: '75789012300020',
    siren: '757890123',
    naf: '6201Z',
    companyType: 'PME',
    sector: 'Web & Mobile',
    address: '5 Rue des Tanneurs',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3945228',
    longitude: '0.6798958',
    website: 'https://nealite.com',
    email: 'hello@nealite.com',
    description: 'Développement d\'applications web et mobiles innovantes',
    employees: '1-10',
    foundedYear: '2018',
    technologies: JSON.stringify(['React Native', 'Node.js', 'Firebase']),
  },
  
  // Cybersécurité & Infrastructure
  {
    name: 'SecurIT Tours',
    siret: '76890123400021',
    siren: '768901234',
    naf: '6202A',
    companyType: 'PME',
    sector: 'Cybersécurité',
    address: '8 Avenue André Malraux',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3815228',
    longitude: '0.6945358',
    website: 'https://securit-tours.fr',
    email: 'contact@securit-tours.fr',
    description: 'Conseil et audit en cybersécurité pour les entreprises',
    employees: '11-50',
    foundedYear: '2016',
    technologies: JSON.stringify(['Pentesting', 'SIEM', 'Firewall', 'ISO 27001']),
  },
  {
    name: 'CloudOps France',
    siret: '77901234500022',
    siren: '779012345',
    naf: '6202A',
    companyType: 'PME',
    sector: 'Cloud & DevOps',
    address: '25 Boulevard Heurteloup',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3895228',
    longitude: '0.6875358',
    website: 'https://cloudops-france.fr',
    email: 'info@cloudops-france.fr',
    description: 'Expertise en infrastructure cloud et automatisation DevOps',
    employees: '11-50',
    foundedYear: '2017',
    technologies: JSON.stringify(['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Docker']),
  },
  
  // IA & Data Science
  {
    name: 'DataTech Valley',
    siret: '78012345600023',
    siren: '780123456',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'Intelligence Artificielle',
    address: '18 Rue Émile Zola',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3875228',
    longitude: '0.6825358',
    website: 'https://datatech-valley.fr',
    email: 'ai@datatech-valley.fr',
    description: 'Solutions d\'IA et de machine learning pour les entreprises',
    employees: '11-50',
    foundedYear: '2020',
    technologies: JSON.stringify(['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Spark']),
  },
  {
    name: 'Predictive Analytics Lab',
    siret: '79123456700024',
    siren: '791234567',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'Data Science',
    address: '7 Place Plumereau',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3955228',
    longitude: '0.6805358',
    website: 'https://pa-lab.fr',
    email: 'contact@pa-lab.fr',
    description: 'Analyses prédictives et visualisation de données',
    employees: '1-10',
    foundedYear: '2021',
    technologies: JSON.stringify(['R', 'Python', 'Tableau', 'Power BI']),
  },
  
  // Gaming & Multimedia
  {
    name: 'PixelCraft Studio',
    siret: '80234567800025',
    siren: '802345678',
    naf: '5821Z',
    companyType: 'startup',
    sector: 'Jeux Vidéo',
    address: '42 Rue du Commerce',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3935228',
    longitude: '0.6885358',
    website: 'https://pixelcraft-studio.fr',
    email: 'hello@pixelcraft.fr',
    description: 'Studio indépendant de création de jeux vidéo',
    employees: '1-10',
    foundedYear: '2022',
    technologies: JSON.stringify(['Unity', 'Unreal Engine', 'C#', 'Blender']),
  },
  
  // E-commerce & SaaS
  {
    name: 'ShopTech Solutions',
    siret: '81345678900026',
    siren: '813456789',
    naf: '6201Z',
    companyType: 'PME',
    sector: 'E-commerce',
    address: '14 Rue Colbert',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3965228',
    longitude: '0.6835358',
    website: 'https://shoptech-solutions.fr',
    email: 'contact@shoptech.fr',
    description: 'Développement de plateformes e-commerce sur-mesure',
    employees: '11-50',
    foundedYear: '2014',
    technologies: JSON.stringify(['Shopify', 'Magento', 'PrestaShop', 'WooCommerce']),
  },
  {
    name: 'SaaS Factory Tours',
    siret: '82456789000027',
    siren: '824567890',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'SaaS',
    address: '9 Rue Bretonneau',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3915228',
    longitude: '0.6865358',
    website: 'https://saas-factory-tours.fr',
    email: 'contact@saas-factory.fr',
    description: 'Création de logiciels SaaS pour les PME',
    employees: '11-50',
    foundedYear: '2019',
    technologies: JSON.stringify(['Laravel', 'Vue.js', 'PostgreSQL', 'Redis']),
  },
  
  // Formation & EdTech
  {
    name: 'CodeAcademy Tours',
    siret: '83567890100028',
    siren: '835678901',
    naf: '8559A',
    companyType: 'PME',
    sector: 'EdTech',
    address: '22 Rue des Halles',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3945228',
    longitude: '0.6825358',
    website: 'https://code-academy-tours.fr',
    email: 'info@code-academy-tours.fr',
    description: 'Formation intensive au développement web et mobile',
    employees: '11-50',
    foundedYear: '2017',
    technologies: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Python', 'SQL']),
  },
  {
    name: 'TechLearn Platform',
    siret: '84678901200029',
    siren: '846789012',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'EdTech',
    address: '3 Rue George Sand',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3905228',
    longitude: '0.6795358',
    website: 'https://techlearn.fr',
    email: 'support@techlearn.fr',
    description: 'Plateforme e-learning interactive pour apprendre la tech',
    employees: '1-10',
    foundedYear: '2021',
    technologies: JSON.stringify(['Next.js', 'Supabase', 'Stripe', 'Vercel']),
  },
  
  // IoT & Hardware
  {
    name: 'ConnectTech IoT',
    siret: '85789012300030',
    siren: '857890123',
    naf: '6201Z',
    companyType: 'startup',
    sector: 'IoT',
    address: '11 Avenue de Grammont',
    postalCode: '37000',
    city: 'Tours',
    latitude: '47.3855228',
    longitude: '0.6905358',
    website: 'https://connecttech-iot.fr',
    email: 'hello@connecttech.fr',
    description: 'Solutions IoT pour la ville intelligente et l\'industrie',
    employees: '11-50',
    foundedYear: '2018',
    technologies: JSON.stringify(['Arduino', 'Raspberry Pi', 'LoRaWAN', 'MQTT', 'Node-RED']),
  },
];

// Fonction principale de seed
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Vérifier la connexion
    const testQuery = await db.execute('SELECT 1');
    console.log('✅ Database connection successful\n');

    let successCount = 0;
    let errorCount = 0;

    // Insérer chaque entreprise
    for (const companyData of seedCompanies) {
      try {
        // Vérifier si l'entreprise existe déjà (par SIRET)
        if (companyData.siret) {
          const existing = await companyService.getCompanyBySiret(companyData.siret);
          if (existing) {
            console.log(`⏭️  Skipping "${companyData.name}" (already exists)`);
            continue;
          }
        }

        // Insérer la nouvelle entreprise
        await companyService.createCompany(companyData);
        console.log(`✅ Created: ${companyData.name} (${companyData.companyType} - ${companyData.sector})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating "${companyData.name}":`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`🎉 Seeding completed!`);
    console.log(`✅ Successfully created: ${successCount} companies`);
    console.log(`⏭️  Skipped (duplicates): ${seedCompanies.length - successCount - errorCount}`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount}`);
    }
    console.log('='.repeat(60) + '\n');

    // Afficher quelques stats
    const totalCompanies = await companyService.countCompanies();
    const startups = await companyService.countCompanies({ companyType: 'startup' });
    const esn = await companyService.countCompanies({ companyType: 'ESN' });
    const pme = await companyService.countCompanies({ companyType: 'PME' });

    console.log('📊 Database Statistics:');
    console.log(`   Total companies: ${totalCompanies}`);
    console.log(`   Startups: ${startups}`);
    console.log(`   ESN: ${esn}`);
    console.log(`   PME: ${pme}`);
    console.log('');

  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Exécuter le seed
seedDatabase();
