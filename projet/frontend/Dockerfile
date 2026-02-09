# Frontend Next.js
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer le serveur de développement
CMD ["npm", "run", "dev"]
