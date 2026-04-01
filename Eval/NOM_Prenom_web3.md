# CertiChain – Évaluation Web3

## Informations étudiant
- Nom : <Ton nom>
- Prénom : <Ton prénom>
- Numéro étudiant : <Numéro>
- Date : 2026-04-01

## Partie 1 – Compréhension de l'architecture
### Question 1 – Rôle des technologies
- Next.js : front-end React (rendu côté serveur / statique) qui affiche la liste des certificats et envoie des créations à l'API.
- Laravel : API backend gérant la logique métier et l'accès aux données via une table `certificates`.
- PostgreSQL : stockage des certificats et propriétés relationnelles.
- Docker : containerisation de l'application (postgres, backend PHP, frontend Node) pour environnement reproductible.

### Question 2 – Architecture de l'application
- UI : Next.js sur `http://localhost:3000`
- Logique métier : Laravel sur `http://localhost:8000`
- Stockage : PostgreSQL (conteneur `postgres`) et table `certificates`
- Communicaton : REST API via requêtes HTTP JSON (`/api/certificates` pour list/create)

## Partie 2 – Modélisation fonctionnelle
### Question 3 – Table PostgreSQL
Table `certificates`:
- `id` (primary key, serial bigint)
- `student_name` (text)
- `title` (text)
- `issued_at` (timestamp)
- `blockchain_hash` (text nullable)
- `created_at`, `updated_at`

### Question 4 – Routes API Laravel
- `GET /api/certificates` : retourne liste triée des certificats.
- `POST /api/certificates` : crée un certificat avec les champs `student_name`, `title`, `issued_at`, `blockchain_hash`.

## Partie 3 – Docker et déploiement local
### Question 5 – Intérêt de Docker
- Isolation des services et dépendances (PHP, Node, Postgres) sans installation locale lourde.
- Reproductibilité : même configuration pour chaque développeur/examinateur.

### Question 6 – Services Docker
- `frontend` : Next.js (3000) pour la WebUI.
- `backend` : Laravel (8000) pour API et logique métier.
- `postgres` : base de données (5432).

## Partie 4 – Exercice pratique
### Question 7 – Affichage des certificats Next.js ↔ Laravel
- Laravel expose API REST.
- Next.js consomme via `fetch(API_BASE/certificates)`.
- Affiche liste et formulaire de saisie.

### Question 8 – PostgreSQL vs Blockchain
- PostgreSQL suffit pour stockage opérationnel, recherche, tri et intégrité.
- Blockchain peut apporter preuve d'immutabilité et vérification décentralisée.
- Pour évaluation, on simule le hash blockchain (champ `blockchain_hash`) et on conserve les données principales dans PostgreSQL.

## Partie 5 – Livrables
- Ce fichier.
- Code dans les dossiers existants, migration, routes API et page intégrée.
