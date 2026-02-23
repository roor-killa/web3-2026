# Projet Fullstack – Laravel + Next.js

## Description

Ce projet est une application fullstack composée de :

- Backend : Laravel (API REST)
- Frontend : Next.js
- Base de données : PostgreSQL
- Environnement : Docker

L'application affiche une liste de produits avec un système de panier.

---

## Installation

### 1️⃣ Cloner le projet

git clone <url-du-repo>
cd projet-docker-laravel

---

## Backend (Laravel avec Docker)

Lancer le backend :

docker-compose up --build

Le backend sera accessible sur :
http://localhost:8000

Exemple d’API :
http://localhost:8000/api/hello

---

## Frontend (Next.js)

Aller dans le dossier frontend :

cd frontend

Installer les dépendances :

npm install

Lancer le serveur :

npm run dev

Le frontend sera accessible sur :
http://localhost:3000

---

## Fonctionnalités

- Affichage des produits
- Ajout au panier
- Suppression du panier
- Calcul automatique du total
- Communication Frontend / Backend

---

## Auteur

Projet réalisé dans le cadre du cours de développement web (L2 Informatique).

