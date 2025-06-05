# 📢 Docker forum — Projet de Formation

## 📑 Description

Ce projet est un forum anonyme permettant aux utilisateurs de publier et consulter des messages sous pseudonyme sans système d’inscription. Il est composé de plusieurs services conteneurisés via Docker et orchestrés à l’aide de Docker Compose.

## 📦 Technologies utilisées

- **Node.js** / **Express** (API)
- **Vue.js** (Thread & Sender)
- **PostgreSQL** (Base de données)
- **Docker**
- **Docker Compose**

## 🗺️ Architecture des services

- **DB** : Base de données PostgreSQL
- **API** : Service Node.js / Express pour gérer les messages
- **Thread** : Front Vue.js affichant les messages via API (port 80)
- **Sender** : Front Vue.js pour poster des messages via API (port 8080)

## 📚 Installation et utilisation

### 1️⃣ Prérequis
- Docker
- Docker Compose

### 2️⃣ Cloner le dépôt
```bash
git clone <URL_DU_DEPOT>
cd forum-anonyme
```

### 3️⃣ Lancer les conteneurs
```bash
docker-compose up --build
```

### 4️⃣ Accéder aux services
```bash
docker-compose up --build
```
