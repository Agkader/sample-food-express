```markdown
# FoodExpress API

API de gestion de commandes pour un service de livraison de repas.  
Développée dans le cadre d'un projet d'étude avec Node.js, Express et MongoDB.

Auteur : Abdoul Ganiyou Kader  
Cours : Développement API - Supinfo Lille

---

## Lien vers l'API

L'API est déployée sur Google Cloud Run.

- **URL :** https://sample-food-express-936178906996.europe-west9.run.app/api-docs/

*Le premier appel peut être lent (cold start).*

---

## Stack utilisée

- **Backend :** Node.js, Express
- **Base de données :** MongoDB Atlas
- **Authentification :** JWT, bcrypt
- **Validation :** Joi
- **Documentation :** Swagger (OpenAPI 3.0)
- **Conteneurisation :** Docker
- **Déploiement :** Google Cloud Run, Cloud Build, Artifact Registry

---

## Lancer le projet en local

### Prérequis

- Node.js et npm installés
- (Optionnel) Docker installé

### Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DB_CONNECT=url_mongodb_atlas
TOKEN_SECRET=clé_jwt
```

### Avec Node.js

```bash
npm install
npm start
```

### Avec Docker

```bash
docker build -t food-express-api .
docker run -p 3000:3000 --env-file .env food-express-api
```

---

## Tests

Tests unitaires et d'intégration avec Jest et Supertest.

```bash
npm test
```

---

## Comptes de test


| Admin : `admin@foodexpress.com`  password :  `Admin123!` 
| User : `user@test.com`  password : `Password123!` 

---

## Fonctionnalités principales

- Inscription / connexion
- Gestion du profil utilisateur
- Gestion des restaurants et menus (CRUD réservé aux admins)
- Consultation publique avec filtres et pagination
- Routes protégées par JWT
```