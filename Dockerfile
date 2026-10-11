# On utilise "slim" au lieu de "alpine" pour une compatibilité parfaite
FROM node:18-slim

WORKDIR /app

# On copie d'abord les fichiers de dépendances
COPY package*.json ./

# Nouvelle syntaxe Node 18+ pour installer sans les dépendances de dev
RUN npm install --omit=dev

# On copie le reste du code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]