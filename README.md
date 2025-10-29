# 🗺️ MonTours

**Carte interactive des entreprises IT/Tech de Tours et ses environs**

MonTours est une application web permettant de visualiser et filtrer les entreprises IT, startups, PME, et ESN actives sur Tours et son agglomération. Les données sont récupérées via l'API INSEE et enrichies pour offrir une expérience interactive et informative.

---

## ✨ Fonctionnalités

- 🏢 **Cartographie interactive** des entreprises IT/Tech de Tours
- 🔍 **Filtres avancés** : type d'entreprise, secteur, ville, code postal
- 📍 **Géolocalisation** : recherche d'entreprises dans un rayon donné
- 📊 **Statistiques** : distribution par type, secteur, ville
- 🔄 **Import automatique** des données depuis l'API INSEE
- 📚 **API REST complète** avec documentation OpenAPI (Swagger)
- 🐳 **Déploiement Docker** simplifié

---

## 🏗️ Architecture

### Backend
- **Runtime** : [Bun](https://bun.sh) - Runtime JavaScript ultra-rapide
- **Framework** : [Elysia](https://elysiajs.com) - Framework web TypeScript performant
- **Base de données** : PostgreSQL 16
- **ORM** : [Drizzle ORM](https://orm.drizzle.team) - ORM TypeScript type-safe
- **Validation** : Zod via Elysia
- **Documentation** : OpenAPI/Swagger

### Frontend _(À venir)_
- Carte interactive avec filtres dynamiques
- Interface utilisateur moderne et responsive

---

## 📦 Dépendances principales

### Runtime & Framework
- `bun` - Runtime JavaScript
- `elysia` - Framework web
- `typescript` - Support TypeScript

### Base de données
- `drizzle-orm` - ORM TypeScript
- `drizzle-kit` - CLI pour migrations
- `postgres` - Client PostgreSQL

### API & Documentation
- `@elysiajs/cors` - Support CORS
- `@elysiajs/openapi` - Génération OpenAPI
- `@elysiajs/swagger` - Interface Swagger UI
- `zod` - Validation de schémas

### Utilitaires
- `dotenv` - Gestion des variables d'environnement

---

## 🚀 Installation

### Prérequis
- [Bun](https://bun.sh) v1.0.0 ou supérieur
- [Docker](https://www.docker.com) & Docker Compose (optionnel mais recommandé)
- Clé API INSEE (gratuite) - [Obtenir une clé](https://api.insee.fr/catalogue/)

### Installation des dépendances

```bash
bun install
```

### Configuration

1. Copiez le fichier `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Configurez vos variables d'environnement dans `.env` :
```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME=MonTours API
APP_VERSION=1.0.0

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/montours
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=montours
DB_PORT=5432

# API
CORS_ORIGIN=http://localhost:5173
INSEE_API_KEY=votre_cle_api_insee
```

---

## 🎯 Démarrage

### Option 1 : Avec Docker (recommandé)

```bash
# Démarrer tous les services (PostgreSQL + API)
bun run docker:up

# Voir les logs
bun run docker:logs

# Redémarrer les services
bun run docker:restart

# Arrêter les services
bun run docker:down

# Nettoyer complètement (supprime les volumes)
bun run docker:clean
```

### Option 2 : En local

```bash
# Démarrer PostgreSQL (via Docker)
docker-compose up -d postgres

# Appliquer les migrations
bun run db:migrate

# Démarrer l'API en mode développement
bun run dev
```

L'API sera accessible sur `http://localhost:3000`

---

## 📊 Import des données

### Importer les entreprises IT depuis l'API INSEE

```bash
# Importer toutes les entreprises IT de Tours et environs
bun run db:import-insee
```

Cette commande :
- ✅ Récupère les entreprises avec code NAF 62* (secteur IT)
- ✅ Filtre les entreprises actives uniquement
- ✅ Couvre Tours et son agglomération (codes postaux 37000, 37100, 37200, etc.)
- ✅ Gère automatiquement les doublons (upsert par SIRET)
- ✅ Affiche des statistiques détaillées post-import

### Tester la connexion à l'API INSEE

```bash
bun run db:test-insee
```

---

## 📚 Documentation API

Une fois l'application lancée, accédez à :

- **Swagger UI** : `http://localhost:3000/docs`
- **API Root** : `http://localhost:3000/`
- **Health Check** : `http://localhost:3000/health`

### Endpoints principaux

#### Companies
- `GET /companies` - Liste toutes les entreprises (avec filtres)
- `GET /companies/:id` - Détails d'une entreprise par UUID
- `GET /companies/siret/:siret` - Recherche par SIRET
- `POST /companies` - Créer une entreprise
- `PUT /companies/:id` - Mettre à jour une entreprise
- `DELETE /companies/:id` - Supprimer une entreprise

#### Statistics
- `GET /companies/stats/count` - Nombre d'entreprises (avec filtres)

#### Geolocation
- `GET /companies/nearby/:lat/:lng?radius=10` - Entreprises dans un rayon

### Exemples de requêtes

```bash
# Liste toutes les entreprises
curl http://localhost:3000/companies

# Filtrer par type
curl "http://localhost:3000/companies?type=Startup"

# Filtrer par secteur
curl "http://localhost:3000/companies?sector=Web"

# Filtrer par ville
curl "http://localhost:3000/companies?city=TOURS"

# Recherche textuelle
curl "http://localhost:3000/companies?search=informatique"

# Entreprises dans un rayon de 5km
curl "http://localhost:3000/companies/nearby/47.3941/0.6848?radius=5"

# Statistiques
curl "http://localhost:3000/companies/stats/count?type=ESN"
```

---

## 🗄️ Gestion de la base de données

```bash
# Générer les migrations
bun run db:generate

# Appliquer les migrations
bun run db:migrate

# Interface Drizzle Studio (GUI web)
bun run db:studio

# Supprimer les migrations
bun run db:drop

# Seed avec des données de test
bun run db:seed
```

---

## 🧪 Tests

```bash
bun test
```

---

## 📋 TODO

### 🎨 Frontend
- [ ] Créer l'interface utilisateur avec React
- [ ] Intégrer une bibliothèque de cartes (Leaflet, Mapbox, Google Maps)
- [ ] Implémenter les filtres dynamiques
- [ ] Ajouter une barre de recherche avec autocomplétion
- [ ] Créer des fiches détaillées pour chaque entreprise
- [ ] Design responsive (mobile, tablet, desktop)
- [ ] Thème clair/sombre

### 📍 Géolocalisation
- [ ] Géocoder les adresses existantes (API Gouv, OpenStreetMap)
- [ ] Ajouter coordonnées GPS (latitude/longitude) pour toutes les entreprises
- [ ] Implémenter la recherche par rayon fonctionnelle
- [ ] Ajouter un clustering des marqueurs sur la carte
- [ ] Optimiser les requêtes géospatiales (index PostGIS)
- [ ] Géolocalisation de l'utilisateur (trouver les entreprises proches)

### 📊 Enrichissement des données
- [ ] Scraper les sites web des entreprises pour extraire :
  - [ ] Description détaillée de l'activité
  - [ ] Technologies utilisées (stack technique)
  - [ ] Taille de l'équipe
  - [ ] Offres d'emploi disponibles
- [ ] Enrichir avec des données LinkedIn/Crunchbase
- [ ] Récupérer les logos des entreprises
- [ ] Ajouter les réseaux sociaux (Twitter, LinkedIn, GitHub)
- [ ] Intégrer les avis Google/Glassdoor
- [ ] Historique de croissance (évolution effectifs)

### 🔌 Exposition des données
- [ ] Ajouter la pagination sur l'API (limit/offset)
- [ ] Implémenter le rate limiting
- [ ] Créer des endpoints d'agrégation avancés
- [ ] Export des données (CSV, JSON, GeoJSON)
- [ ] API GraphQL (alternative à REST)
- [ ] WebSocket pour mises à jour temps réel
- [ ] Cache Redis pour performances
- [ ] CDN pour les assets statiques

### 🔐 Sécurité & Performance
- [ ] Authentification JWT (si ajout de fonctionnalités utilisateur)
- [ ] Rate limiting par IP
- [ ] Validation renforcée des inputs
- [ ] Audit de sécurité (OWASP)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Logs structurés (Winston, Pino)

### 📱 Fonctionnalités avancées
- [ ] Système de favoris (sauvegarde locale ou compte)
- [ ] Comparateur d'entreprises
- [ ] Alertes sur nouvelles entreprises IT
- [ ] Carte de chaleur de la densité IT
- [ ] Timeline des créations d'entreprises
- [ ] Graphiques de statistiques interactifs

---

## 🛠️ Scripts disponibles

```bash
# Développement
bun run dev              # Démarrer en mode développement avec hot-reload
bun run start            # Démarrer en production

# Base de données
bun run db:generate      # Générer les migrations
bun run db:migrate       # Appliquer les migrations
bun run db:studio        # Interface web Drizzle Studio
bun run db:drop          # Supprimer les migrations
bun run db:seed          # Peupler avec des données de test
bun run db:import-insee  # Importer depuis l'API INSEE
bun run db:test-insee    # Tester la connexion INSEE

# Docker
bun run docker:up        # Démarrer les conteneurs
bun run docker:down      # Arrêter les conteneurs
bun run docker:logs      # Voir les logs
bun run docker:restart   # Redémarrer les conteneurs
bun run docker:rebuild   # Reconstruire et redémarrer
bun run docker:clean     # Nettoyer (supprime les volumes)

# Tests & Qualité
bun test                 # Lancer les tests
bun run lint             # Linter le code
bun run format           # Formater le code
```

---

## 📁 Structure du projet

```
MonTours/
├── src/
│   ├── config/           # Configuration (DB, env)
│   │   ├── database.ts
│   │   └── env.ts
│   ├── modules/          # Modules métier
│   │   ├── companies/    # Module entreprises
│   │   │   ├── schema.ts # Schéma Drizzle
│   │   │   ├── service.ts
│   │   │   └── index.ts  # Routes
│   │   └── health/       # Health check
│   ├── plugins/          # Plugins Elysia
│   │   └── logger.ts
│   ├── scripts/          # Scripts utilitaires
│   │   ├── seed.ts
│   │   ├── import-insee.ts
│   │   └── test-insee.ts
│   └── index.ts          # Point d'entrée
├── drizzle/              # Migrations Drizzle
├── docker/               # Configuration Docker
├── .env                  # Variables d'environnement
├── docker-compose.yml    # Stack Docker
├── drizzle.config.ts     # Config Drizzle Kit
├── tsconfig.json         # Config TypeScript
└── package.json          # Dépendances
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

---

## 📝 Licence

ISC

---

## 👨‍💻 Auteur

Développé avec ❤️ pour la ville de Tours

---

## 🔗 Liens utiles

- [Documentation Bun](https://bun.sh/docs)
- [Documentation Elysia](https://elysiajs.com/introduction.html)
- [Documentation Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [API INSEE](https://api.insee.fr/catalogue/)
- [PostgreSQL](https://www.postgresql.org/docs/)
