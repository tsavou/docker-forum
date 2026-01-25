# 📢 Docker Forum — Projet de Formation

## 📑 Description

Ce projet est un forum anonyme permettant aux utilisateurs de publier et consulter des messages sous pseudonyme sans système d'inscription. Il est composé de plusieurs services conteneurisés via Docker et orchestrés à l'aide de Docker Compose pour le développement et Docker Stack pour la production.

## 📦 Technologies utilisées

### Backend & Frontend
- **Node.js** / **Express** (API REST)
- **Vue.js 3** (Frontend avec Vite)
- **PostgreSQL 15** (Base de données)

### DevOps & CI/CD
- **Docker** & **Docker Compose** (Développement local)
- **Docker Stack** (Déploiement en production)
- **GitLab CI/CD** (Pipeline d'intégration continue)
- **Docker Registry** (Stockage des images)

### Qualité de code & Tests
- **ESLint** & **Prettier** (Linting et formatage)
- **Vitest** (Tests unitaires)
- **Playwright** (Tests end-to-end)
- **Commitizen** & **Husky** (Commits conventionnels)

## 🗺️ Architecture des services

### Services

- **DB** : Base de données PostgreSQL (port 5432)
- **API** : Service Node.js / Express pour gérer les messages (port 3000)
- **Front** : Interface Vue.js pour afficher et publier des messages (port 80)

### Réseaux Docker

#### Développement (docker-compose.yml)
- **data_layer** : Réseau privé pour la communication entre l'API et la base de données
- **frontend** : Réseau pour la communication entre le frontend et l'API

#### Production (docker-stack.yml)
- **app-net** : Réseau overlay pour tous les services dans Docker Swarm

## 📚 Installation et utilisation

### 1️⃣ Prérequis

- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Node.js 20+ (pour le développement local)

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

### 4️⃣ Lancer les conteneurs (Développement)

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

## 🧪 Tests

### Tests unitaires

Les tests unitaires sont écrits avec **Vitest** pour l'API et le Frontend.

```bash
# Tests API
docker exec forum_api npm test
# ou localement
cd api && npm test

# Tests Frontend
docker exec forum_front npm test
# ou localement
cd front && npm test

# Mode watch pour le développement
docker exec forum_front npm run test:watch
```

### Tests end-to-end (E2E)

Les tests E2E sont réalisés avec **Playwright** pour tester l'application complète.

```bash
# Lancer les tests E2E
docker exec forum_front npm run test:e2e

# Interface UI pour déboguer les tests
docker exec forum_front npm run test:e2e:ui

# Localement (nécessite que les services soient démarrés)
cd front && npm run test:e2e
```

Les rapports Playwright sont générés dans `front/playwright-report/` et peuvent être visualisés avec :

```bash
# Dans le conteneur
docker exec forum_front npx playwright show-report

# Ou ouvrir directement le fichier HTML
open front/playwright-report/index.html
```

## 🚀 CI/CD avec GitLab

Le projet utilise **GitLab CI/CD** pour automatiser la validation, les tests, la construction et le déploiement.

### Pipeline GitLab CI/CD

Le pipeline se compose de 4 étapes :

1. **Validation** (`validation`)
   - `lint-api` : Vérification du linting de l'API
   - `lint-front` : Vérification du linting et formatage du Frontend

2. **Tests** (`test`)
   - `test-api` : Tests unitaires de l'API
   - `test-front` : Tests unitaires du Frontend
   - `test-e2e` : Tests end-to-end avec Playwright

3. **Build** (`build`)
   - `build-api` : Construction de l'image Docker de l'API
   - `build-front` : Construction de l'image Docker du Frontend
   - Les images sont taguées avec le SHA du commit et `latest`
   - Les images sont poussées vers le GitLab Container Registry

4. **Déploiement** (`deploy`)
   - `deploy-production` : Déploiement automatique sur le serveur de production
   - Utilise Docker Stack pour orchestrer les services
   - Déclenché uniquement sur la branche `main`

### Variables d'environnement GitLab

Pour que le pipeline fonctionne, configurez les variables suivantes dans GitLab CI/CD :

- `CI_REGISTRY_USER` : Utilisateur du registre Docker
- `CI_REGISTRY_PASSWORD` : Mot de passe du registre Docker
- `CI_REGISTRY` : URL du registre Docker (généralement `registry.gitlab.com`)
- `SSH_PRIVATE_KEY` : Clé SSH privée pour se connecter au serveur de production
- `SSH_HOST` : Adresse IP ou hostname du serveur de production

**Note** : Le pipeline utilise actuellement l'utilisateur `root` pour les connexions SSH. Assurez-vous que l'utilisateur root a les permissions nécessaires sur le serveur.

### Déploiement en production

Le déploiement utilise **Docker Stack** (Docker Swarm) pour orchestrer les services en production.

#### Prérequis serveur de production

- Docker avec Swarm activé
- Accès SSH configuré
- Variables d'environnement GitLab configurées

#### Processus de déploiement

1. Le pipeline construit les images Docker
2. Les images sont poussées vers le registre
3. Le job `deploy-production` :
   - Se connecte au serveur via SSH
   - Copie le fichier `docker-stack.yml` (avec substitution de variables)
   - Copie le script d'initialisation de la base de données
   - Se connecte au registre Docker
   - Déploie la stack avec `docker stack deploy`
   - Nettoie les images Docker inutilisées

#### Commandes Docker Stack (sur le serveur)

```bash
# Voir les services déployés
docker stack services forum-stack

# Voir les logs d'un service
docker service logs forum-stack_api
docker service logs forum-stack_front

# Mettre à jour la stack manuellement
docker stack deploy -c docker-stack.yml forum-stack

# Supprimer la stack
docker stack rm forum-stack
```

## 📁 Structure du projet

```
docker-forum/
├── api/                      # Service API Express
│   ├── index.js              # Point d'entrée de l'API
│   ├── package.json
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── vitest.config.js
│   └── tests/
│       └── index.test.js     # Tests unitaires
├── front/                    # Application Vue.js
│   ├── src/
│   │   ├── App.vue           # Composant principal
│   │   └── main.js           # Point d'entrée Vue
│   ├── package.json
│   ├── Dockerfile
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── playwright.config.js  # Configuration Playwright
│   ├── .prettierrc
│   ├── tests/
│   │   ├── App.test.js       # Tests unitaires
│   │   └── setup.js
│   └── e2e/
│       └── app.spec.js       # Tests E2E
├── database/
│   └── init.sql              # Script d'initialisation de la DB
├── docker-compose.yml         # Configuration Docker Compose (dev)
├── docker-stack.yml          # Configuration Docker Stack (prod)
├── .gitlab-ci.yml            # Pipeline GitLab CI/CD
├── package.json              # Scripts racine (Husky, Commitizen)
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

## 📝 Commits conventionnels

Le projet utilise **Commitizen** et **Husky** pour standardiser les messages de commit selon les conventions.

### Utilisation

```bash
# Au lieu de git commit, utilisez :
npm run commit
# ou
npx cz
```

### Format des commits

Les commits suivent le format [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` : Nouvelle fonctionnalité
- `fix:` : Correction de bug
- `docs:` : Documentation
- `style:` : Formatage, point-virgules manquants, etc.
- `refactor:` : Refactoring du code
- `test:` : Ajout de tests
- `chore:` : Maintenance, dépendances, etc.

Exemple :
```bash
feat: ajout de la fonctionnalité de recherche
fix: correction du bug d'affichage des messages
docs: mise à jour du README
```

## 🚀 Fonctionnalités

### Application
- ✅ Publication de messages avec pseudo
- ✅ Affichage des messages récents
- ✅ Interface moderne et responsive
- ✅ Hot reload pour le développement

### Qualité de code
- ✅ Validation et formatage du code (ESLint + Prettier)
- ✅ Tests unitaires avec Vitest
- ✅ Tests end-to-end avec Playwright
- ✅ Commits conventionnels avec Commitizen

### DevOps
- ✅ Architecture microservices avec Docker
- ✅ CI/CD automatisé avec GitLab
- ✅ Déploiement automatique en production
- ✅ Docker Stack pour l'orchestration en production
- ✅ Nettoyage automatique des images Docker

## 📝 Notes importantes

### Développement vs Production

- **Développement** (`docker-compose.yml`) :
  - Hot reload activé pour le frontend grâce au volume monté
  - Les `node_modules` sont préservés dans le conteneur pour éviter les conflits
  - Réseaux bridge pour la communication entre services
  - Volumes locaux pour le développement

- **Production** (`docker-stack.yml`) :
  - Images Docker pré-construites depuis le registre
  - Réseau overlay pour Docker Swarm
  - Configuration avec variables d'environnement CI/CD
  - Déploiement avec réplication et rollback automatique
  - Nettoyage automatique des images inutilisées

### Base de données

- La base de données utilise un volume persistant pour conserver les données
- Le script `init.sql` est exécuté automatiquement au premier démarrage
- En production, le script est copié via Docker configs

### Cache GitLab CI/CD

- Les dépendances npm sont mises en cache pour accélérer les pipelines
- Le cache est basé sur les fichiers `package-lock.json`
- Les artefacts Playwright sont conservés pendant 1 semaine

## 👤 Auteur

Projet réalisé dans le cadre d'une formation DevSecOps / Docker.
