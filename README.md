# web3-2026

Projet de cours de Programmation Web (2026), organise en architecture full-stack avec:

- un backend API en Laravel
- un frontend en Next.js
- une infrastructure Docker (PostgreSQL, Nginx, services applicatifs)

## Apercu

Ce depot contient une application web orientee authentification utilisateur, gestion de produits et gestion d'evenements campus.

Le projet est structure autour d'un espace de travail `akonou/` qui regroupe:

- `back-laravel/`: API REST Laravel (auth, produits, evenements, admin)
- `front-next/`: interface utilisateur Next.js (login, register, catalogue produits)
- `infra/`: orchestration Docker Compose + proxy Nginx

## Fonctionnalites principales

- Authentification API (inscription, connexion, deconnexion) via tokens
- Recuperation de l'utilisateur connecte
- CRUD produits (routes API proteges)
- Gestion des evenements (inscription, desinscription, mes evenements)
- Routes admin pour creer/modifier/supprimer des evenements
- Frontend avec redirection selon l'etat de connexion et consommation de l'API

## Stack technique

- Backend: Laravel (PHP), Eloquent ORM, Laravel Sanctum
- Frontend: Next.js (App Router) + TypeScript
- Base de donnees: PostgreSQL
- Infra: Docker Compose + Nginx

## Demarrage rapide (Docker)

Prerequis:

- Docker
- Docker Compose

Depuis la racine du projet:

```bash
cd akonou/infra
docker compose up --build
```

Services accessibles:

- Frontend Next.js: `http://localhost:3000`
- API Laravel via Nginx: `http://localhost:8000/api`
- FastAPI (Docs): `http://localhost:8002/docs`
- PostgreSQL: `localhost:15432`

Commandes utiles (dans un autre terminal):

```bash
docker exec -it laravel_backend php artisan migrate
docker exec -it laravel_backend php artisan db:seed
```

## Differentes etapes

### 1. Preparation de l'environnement

- Cloner le depot
- Verifier Docker et Docker Compose
- Se placer dans `akonou/infra`

### 2. Lancement de l'infrastructure

- Executer `docker compose up --build`
- Attendre que les 4 services soient demarres (`db`, `backend`, `frontend`, `nginx`)

### 3. Initialisation de la base

- Lancer les migrations Laravel
- (Optionnel) peupler la base avec les seeders

### 4. Acces a l'application

- Ouvrir le frontend sur `http://localhost:3000`
- Utiliser l'API sur `http://localhost:8000/api`

### 5. Parcours utilisateur

- S'inscrire ou se connecter
- Consulter la liste des produits
- Modifier / supprimer un produit (selon les droits)
- Consulter et gerer les evenements

### 6. Administration

- Se connecter avec un compte admin
- Creer, modifier et supprimer des evenements via les routes admin

### 7. Arret de l'environnement

- Arreter les conteneurs avec `docker compose down`

## Structure du depot

```text
web3-2026/
	README.md
	AKONOU.md
	akonou/
		back-laravel/
		front-next/
		infra/
```

## Contexte

Projet realise dans le cadre du cours de programmation web 2026.
