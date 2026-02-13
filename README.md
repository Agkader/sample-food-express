# FoodExpress API

**Pour le professeur** : Un guide d'installation rapide est disponible à la fin de ce document.

Food Express est un projet académique développé dans le cadre du cursus SUPINFO Lille, consistant en une API RESTful pour une plateforme de commande de nourriture. Cette API permet aux utilisateurs de créer des comptes et de s'authentifier, de parcourir les restaurants et leurs menus. Développée avec Node.js, Express.js et MongoDB, cette solution gère la gestion des utilisateurs, l'enregistrement des restaurants et les modifications de menus grâce à un système d'authentification sécurisé basé sur JWT. Ce projet est intégralement disponible sur GitHub pour consultation.

##  Fonctionnalités
### Gestion des Utilisateurs (`user`)
-  Inscription d'utilisateur avec validation joi  (accès public)
-  Connexion utilisateur avec authentification JWT
-  Opérations CRUD pour les comptes utilisateurs
-  Contrôle d'accès basé sur les rôles (utilisateur/admin)
-  Les utilisateurs ne peuvent modifier que leurs propres comptes
-  Les administrateurs ont un contrôle total sur tous les utilisateurs

### Gestion des Restaurants (`restaurants`)
-   Accès en lecture public avec tri et pagination
-   Opérations de création, mise à jour, suppression (admin uniquement)

### Gestion des Menus (`menus`)
-  Accès en lecture public avec tri et pagination
-  Opérations de création, mise à jour, suppression (admin uniquement)
-  Filtrage des menus par restaurant

## Technologies Utilisées

- **Framework Backend :** Node.js, Express.js
- **Base de Données :** MongoDB Atlas (Cloud)
- **Authentification :** JWT (JSON Web Tokens)
- **Validation :** Joi
- **Hachage de Mot de Passe :** bcryptjs
- **Tests :** Jest, Supertest
- **Documentation :** Swagger/OpenAPI
- **Variables d'Environnement :** dotenv

##  Prérequis

Avant d'exécuter ce projet, assurez-vous d'avoir installé :

- ## Node.js 
- ## npm 
- ## Compte MongoDB Atlas conseiller pas obligatoire ( j'ai utilise la version en ligne de mongodb version gratuite) 

##  Installation

### Étape 1 : Extraire ou Cloner le Projet

- Extraire le fichier ZIP et naviguer vers le dossier  sample-food-express

### Étape 2 : Installer les Dépendances
```bash ou bien terminal  
npm install
```

##  Configuration de l'Environnement

### Étape 1 : Créer le Fichier `.env` 

### Étape 2 : Ajouter les Variables d'Environnement

Ouvrez le fichier `.env` et ajoutez la configuration suivante :
# Configuration MongoDB
# Remplacez <username>, <password> et <cluster-url> par vos identifiants MongoDB Atlas
DB_CONNECT = ici copier votre url mongodb
Note : N'oubliez pas de mettre à jour votre adresse IP
# Secret JWT 
TOKEN_SECRET= ici  votre_cle_secrete_jwt

##  Démarrage de l'Application

### Démarrer le Serveur
Dans le terminal de vs code  npm start

Vous devriez voir :

Server is running on http://localhost:3000
Connected to MongoDB database

Si vous voyez ces messages, l'application fonctionne correctement 

### Mode Développement (avec rechargement automatique)

**Note :** Si `nodemon` n'est pas installé, vous pouvez l'ajouter :
```bash
npm install --save-dev nodemon
```

### Accéder à l'API

Une fois l'application lancée, vous pouvez accéder à :
- **URL de Base de l'API :** `http://localhost:3000`
- **Documentation Swagger :** `http://localhost:3000/api-docs`

### Exécuter Tous les Tests
```bash
npm test
```

### Exécuter un Fichier de Test Spécifique
```bash
npm test user.test.js
npm test auth.test.js
npm test restaurant.test.js
npm test menu.test.js
```

### Résultats de Tests Attendus
```
Test Suites: 4 passed, 4 total
Tests:       51 passed, 51 total
Snapshots:   0 total
```

Note :Les tests utilisent des connexions de base de données simulées, donc MongoDB n'a pas besoin d'être en cours d'exécution pour les tests.

##  Documentation API

### La documentation complète de l'API est disponible à :
 Swagger UI : `http://localhost:3000/api-docs`

##  Authentification

Cette API utilise JWT pour l'authentification.

### Comment S'Authentifier
pour les test qui suivront ont utulisera postman mais d'autres alternatives sont possible 
1. S'inscrire ou se connecter ou bien pour obtenir un token :

 POST http://localhost:3000/api/user/registeroulogin  dans postam 


2. Inclure le token dans l'en-tête de la requête :

   auth-token: VOTRE_TOKEN_JWT_ICI

##  Compte Administrateur par Défaut

Pour créer un compte administrateur pour les tests, vous pouvez :

### S'inscrire et Mettre à Jour Manuellement la Base de Données

1. **Inscrivez un utilisateur normal :**

2. **Dans MongoDB Atlas**, allez dans votre base de données et mettez à jour l'utilisateur :
   - Trouvez l'utilisateur dans la collection `users`
   - Modifiez le champ : `isAdmin: true`


## Instructions pour le Professeur

### Démarrage Rapide

1. **Extraire le projet du dossier Zip**
```bash
   cd sample-food-express
```

2. **Installer les dépendances**
```bash
   npm install
```

3. **Configurer l'environnement**
   - Copier `.env.example` vers `.env`
   - Ajouter votre chaîne de connexion MongoDB Atlas
   - DB_CONNECT = ici copier votre url mongodb
    Note : N'oubliez pas de mettre à jour votre adresse IP
   - TOKEN_SECRET= ici  votre_cle_secrete_jwt

4. **Démarrer l'application**
```bash
   npm start
```

5. **Exécuter les tests**
```bash
   npm test
```

6. **Accéder à la documentation**
   - Ouvrir : `http://localhost:3000/api-docs`

### Compte de Test

**Utilisateur Normal :**
- Email : `user@test.com`
- Mot de passe : `Password123!`

**Administrateur :**
- Email : `admin@foodexpress.com`
- Mot de passe : `Admin123!`

Note = Créer manuellement via l'inscription, puis mettre à jour `isAdmin: true` dans MongoDB

## Auteur

**[Votre Nom]** Abdoul Ganiyou Kader
**Date :** 26/10/2025
**Cours :** Développement API - Node.js  
**Institution :** Supinfo Lille

## 📄 Licence

Ce projet est créé à des fins éducatives dans le cadre du cours **Développement API - Node.js**.


**Merci d'avoir examiné ce projet !**