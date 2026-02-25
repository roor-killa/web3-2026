# Utilise une image Node stable
FROM node:20-alpine

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers
COPY . .

# Expose le port utilisé par Next.js/Vite
EXPOSE 3000

# Lance le serveur de développement
CMD ["npm", "run", "dev"]