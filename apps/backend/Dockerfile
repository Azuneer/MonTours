FROM oven/bun:1 as base

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json bun.lockb ./

# Installer les dépendances
RUN bun install --frozen-lockfile

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3000

# Commande par défaut
CMD ["bun", "run", "dev"]
