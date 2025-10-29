# 🚀 Guide de démarrage rapide

## Problèmes résolus

Le backend ne démarrait pas car le `package.json` de l'application backend ne contenait aucune dépendance. Les problèmes suivants ont été corrigés :

1. ✅ Ajout de toutes les dépendances manquantes au backend
2. ✅ Remplacement de `@elysiajs/openapi` par `@elysiajs/swagger`
3. ✅ Ajout du package `zod` nécessaire pour la validation
4. ✅ Correction du port du frontend (3001 au lieu de 5173)

## Dépendances installées

### Backend
- `elysia` - Framework web
- `@elysiajs/cors` - Support CORS
- `@elysiajs/swagger` - Documentation API
- `drizzle-orm` - ORM TypeScript
- `postgres` - Client PostgreSQL
- `zod` - Validation de schémas
- `drizzle-kit` - CLI pour migrations

### Frontend
- `react` + `react-dom` - Framework UI
- `leaflet` + `react-leaflet` - Cartographie
- `tailwindcss` - Framework CSS

## Démarrer l'application

### Option 1 : Lancer les deux serveurs séparément

**Terminal 1 - Backend:**
```bash
cd apps/backend
bun run dev
```
Backend accessible sur `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
bun run dev
```
Frontend accessible sur `http://localhost:3001`

### Option 2 : Lancer depuis la racine (recommandé)

**Terminal 1 - Backend:**
```bash
bun run dev:backend
```

**Terminal 2 - Frontend:**
```bash
bun run dev:frontend
```

## URLs importantes

- 🎨 **Frontend:** http://localhost:3001
- 📡 **Backend API:** http://localhost:3000
- 📚 **Documentation API:** http://localhost:3000/docs
- 🏥 **Health Check:** http://localhost:3000/health

## Proxy API

Le frontend proxifie automatiquement toutes les requêtes `/api/*` vers le backend.

Exemple :
- Frontend: `http://localhost:3001/api/companies` → Backend: `http://localhost:3000/companies`

## Prochaines étapes

1. **Importer les données** depuis l'API INSEE :
   ```bash
   cd apps/backend
   bun run db:import-insee
   ```

2. **Tester l'API** via Swagger UI :
   http://localhost:3000/docs

3. **Accéder à l'application** :
   http://localhost:3001

Tout devrait maintenant fonctionner correctement ! 🎉
