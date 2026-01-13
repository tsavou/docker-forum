# 📢 Docker Forum — Projet de Formation

## 📑 Description

Ce projet est un forum anonyme permettant aux utilisateurs de publier et consulter des messages sous pseudonyme sans système d'inscription. Il est composé de plusieurs services conteneurisés via Docker et orchestrés à l'aide de Docker Compose.

## 📦 Technologies utilisées

- **Node.js** / **Express** (API REST)
- **Vue.js 3** (Frontend avec Vite)
- **PostgreSQL 15** (Base de données)
- **Docker** & **Docker Compose**
- **ESLint** & **Prettier** (Qualité de code)

## 🗺️ Architecture des services

- **DB** : Base de données PostgreSQL (port 5432)
- **API** : Service Node.js / Express pour gérer les messages (port 3000)
- **Front** : Interface Vue.js pour afficher et publier des messages (port 80)

### Réseaux Docker

- **data_layer** : Réseau privé pour la communication entre l'API et la base de données
- **frontend** : Réseau pour la communication entre le frontend et l'API

## 📚 Installation et utilisation

### 1️⃣ Prérequis

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

### 2️⃣ Cloner le dépôt

```bash
git clone https://github.com/tsavou/docker-forum.git
cd docker-forum
```

### 3️⃣ Configuration

Créez un fichier `.env` à la racine du projet avec la configuration de la base de données :

```env
DATABASE_URL=postgresql://user:password@db:5432/forumdb
PORT=3000
```

### 4️⃣ Lancer les conteneurs

```bash
# Lancer tous les services
docker-compose up --build

# Ou en mode détaché (en arrière-plan)
docker-compose up -d --build
```

### 5️⃣ Accéder aux services

- **Frontend** : http://localhost
- **API** : http://localhost:3000
- **Base de données** : localhost:5432
  - User: `user`
  - Password: `password`
  - Database: `forumdb`

## 🛠️ Commandes de développement

### Dans les conteneurs

#### Frontend

```bash
# Linter et corriger automatiquement
docker exec forum_front npm run lint

# Vérifier le linting sans corriger
docker exec forum_front npm run lint:check

# Formater le code avec Prettier
docker exec forum_front npm run format

# Vérifier le formatage
docker exec forum_front npm run format:check
```

#### API

```bash
# Linter et corriger automatiquement
docker exec forum_api npm run lint

# Vérifier le linting sans corriger
docker exec forum_api npm run lint:check
```

### Localement (si node_modules installé)

```bash
# Frontend
cd front
npm run lint
npm run format

# API
cd api
npm run lint
```

## 📁 Structure du projet

```
docker-forum/
├── api/                 # Service API Express
│   ├── index.js         # Point d'entrée de l'API
│   ├── package.json
│   ├── Dockerfile
│   └── eslint.config.mjs
├── front/               # Application Vue.js
│   ├── src/
│   │   ├── App.vue      # Composant principal
│   │   └── main.js      # Point d'entrée Vue
│   ├── package.json
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── .prettierrc
├── database/
│   └── init.sql         # Script d'initialisation de la DB
├── docker-compose.yml    # Configuration Docker Compose
└── README.md
```

## 🔧 Commandes Docker utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f api
docker-compose logs -f front

# Redémarrer un service
docker-compose restart api

# Rebuild un service spécifique
docker-compose build --no-cache front
```

## 🗄️ Base de données

La base de données est initialisée automatiquement avec la table `messages` :

```sql
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Connexion à la base de données

Vous pouvez vous connecter à la base de données avec un client SQL (TablePlus, pgAdmin, etc.) :

- **Host** : `localhost`
- **Port** : `5432`
- **User** : `user`
- **Password** : `password`
- **Database** : `forumdb`

## 🚀 Fonctionnalités

- ✅ Publication de messages avec pseudo
- ✅ Affichage des messages récents
- ✅ Interface moderne et responsive
- ✅ Hot reload pour le développement
- ✅ Validation et formatage du code (ESLint + Prettier)
- ✅ Architecture microservices avec Docker

## 📝 Notes

- Le hot reload est activé pour le frontend grâce au volume monté
- Les `node_modules` sont préservés dans le conteneur pour éviter les conflits
- La base de données utilise un volume persistant pour conserver les données

## 👤 Auteur

Projet réalisé dans le cadre d'une formation DevSecOps / Docker.
