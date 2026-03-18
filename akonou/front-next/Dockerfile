FROM node:20-alpine

WORKDIR /app

# Installer git pour les dépendances GitHub si nécessaire
RUN apk add --no-cache git bash

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]