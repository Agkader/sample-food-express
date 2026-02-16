```markdown
# FoodExpress API - Cloud-Native Microservice

![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

Une API RESTful scalable et sécurisée pour la gestion de commandes de restauration. Conçue avec une approche **DevOps**, cette application est conteneurisée via **Docker** et déployée sur une infrastructure Serverless **Google Cloud Run**.

## Démo Live (Déploiement Cloud)

L'application est déployée en production et accessible publiquement.

- **🌐 URL de l'API :** [https://[COLLER_TON_URL_CLOUD_RUN_ICI].a.run.app](https://[COLLER_TON_URL_CLOUD_RUN_ICI].a.run.app)
- **📄 Documentation Swagger :** [https://[COLLER_TON_URL_CLOUD_RUN_ICI].a.run.app/api-docs](https://[COLLER_TON_URL_CLOUD_RUN_ICI].a.run.app/api-docs)

Note : Le premier chargement peut prendre quelques secondes (Cold Start du Serverless).

---

## Architecture Cloud & DevOps

Ce projet démontre une chaîne de déploiement moderne (CI/CD) et une architecture Cloud-Native :

1.  **Dockerisation :** L'application est packagée dans un conteneur léger (image `node:alpine`) pour garantir la portabilité et la consistance entre dev et prod.
2.  **Serverless Computing :** Hébergement sur **Google Cloud Run** (Region Europe-West9) pour assurer l'auto-scaling (mise à l'échelle automatique selon le trafic).
3.  **CI/CD Pipeline :** Intégration continue via GitHub connecté à **Google Cloud Build** (Build automatique de l'image Docker -> Push vers Artifact Registry -> Déploiement).
4.  **Sécurité  :**
    * Authentification via **JWT** (JSON Web Tokens).
    * Gestion des secrets (URI MongoDB, clés API) via les **Variables d'Environnement** sécurisées du Cloud.



---

## 🛠 Stack Technique

### Backend & Data
- **Runtime :** Node.js & Express.js
- **Base de Données :** MongoDB Atlas (Cluster Cloud)
- **Validation & Sécurité :** Joi (Validation des entrées), Bcrypt (Hachage MDP)
- **Documentation :** Swagger / OpenAPI 3.0

### DevOps & Infrastructure
- **Container :** Docker & Dockerfile optimisé
- **Cloud Provider :** Google Cloud Platform (GCP)
- **Orchestration :** Cloud Run (Managed Serverless)

---

## 💻 Installation & Démarrage (Local)

### Prérequis
- Node.js & npm
- Docker (Optionnel, pour tester le conteneur)
- Un fichier `.env` à la racine

### Configuration (.env)
Créez un fichier `.env` à la racine du projet :
```env
DB_CONNECT=votre_url_mongodb_atlas
TOKEN_SECRET=votre_cle_secrete_jwt
# PORT=3000 (Optionnel, géré automatiquement par Cloud Run)

```

### Option A : Démarrage classique (Node.js)

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur (avec nodemon si installé)
npm start

```

### Option B : Démarrage avec Docker (Recommandé)

```bash
# 1. Construire l'image Docker
docker build -t food-express-api .

# 2. Lancer le conteneur (en injectant les variables d'env)
docker run -p 3000:3000 --env-file .env food-express-api

```

---

##  Tests Unitaires & Intégration

Le projet inclut une suite de tests complète avec **Jest** et **Supertest**.

```bash
# Lancer tous les tests
npm test

# Lancer un test spécifique
npm test user.test.js

```

---

## Contexte Académique & Instructions (Professeur)

**Auteur :** Abdoul Ganiyou Kader
**Cours :** Développement API - Node.js (Supinfo Lille)

### Identifiants de Test (Admin & User)

Pour tester les fonctionnalités protégées sans créer de compte :

| Rôle | Email | Mot de Passe |
| --- | --- | --- |
| **Admin** | `admin@foodexpress.com` | `Admin123!` |
| **User** | `user@test.com` | `Password123!` |

*(Note : Le compte Admin a été configuré manuellement via MongoDB Atlas en passant le champ `isAdmin: true`).*

### Fonctionnalités Clés

* **User :** Inscription, Login, CRUD profil.
* **Restaurant/Menu :** CRUD (Admin seulement), Lecture publique avec filtres et pagination.
* **Sécurité :** Middleware de vérification de token JWT sur les routes protégées.

```

```