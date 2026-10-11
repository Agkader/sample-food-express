FROM node:18-slim

WORKDIR /app

# On va chercher le package.json DANS ton dossier local "app/"
COPY app/package*.json ./

RUN npm install --omit=dev

# On copie tout le contenu de ton dossier "app/" local vers le conteneur
COPY app/ .

EXPOSE 3000

CMD ["npm", "start"]