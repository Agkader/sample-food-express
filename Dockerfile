# On part d'une version légère de Node
FROM node:18-alpine

# On crée le dossier dans le conteneur
WORKDIR /app

# On copie les fichiers de config d'abord (pour le cache)
COPY package*.json ./

# On installe UNIQUEMENT les dépendances de prod )
RUN npm install --only=production

# On copie tout le reste de ton code
COPY . .

# On dit à Docker que l'app écoute sur un port (informatif)
EXPOSE 3000

# La commande de démarrage
CMD ["npm", "start"]