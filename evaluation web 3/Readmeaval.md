# CertiChain – Évaluation Web3

## Informations étudiant

- Nom : Marie-Catherine
- Prénom : Charley
- Numéro étudiant : 22301009
- Date : 01/04/2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies

Next.js gère le frontend et l’interface utilisateur avec rendu optimisé (SSR/SSG), en consommant l’API Laravel.

Laravel constitue le backend et expose une API REST pour la logique métier et la gestion des certificats.

PostgreSQL stocke les données de manière fiable et structurée (certificats, métadonnées, hashs).

Docker permet de conteneuriser chaque service pour un déploiement stable et reproductible.

---

### Question 2 – Architecture de l'application

Le frontend (Next.js) gère l’interface utilisateur et affiche les certificats.

Le backend (Laravel) gère la logique métier et traite les requêtes.

PostgreSQL stocke les données des certificats.

Les composants communiquent via des requêtes HTTP : Next.js envoie des requêtes à l’API Laravel, qui interagit avec PostgreSQL et renvoie les données.

---

## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

Table : certificates

- id : SERIAL PRIMARY KEY
- student_name : VARCHAR(255)
- certification_title : VARCHAR(255)
- issued_at : DATE
- blockchain_hash : TEXT

---

### Question 4 – Routes API Laravel

1. Création d’un certificat  
- Méthode : POST  
- URL : /api/certificates  
- Rôle : créer un nouveau certificat en base de données  

2. Liste des certificats  
- Méthode : GET  
- URL : /api/certificates  
- Rôle : récupérer tous les certificats  

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Docker permet de garantir que l’application fonctionne de manière identique sur toutes les machines.

Il simplifie le déploiement en isolant chaque service et évite les problèmes liés aux différences d’environnement.

---

### Question 6 – Services Docker

- frontend : exécute l’application Next.js  
- backend : exécute l’API Laravel  
- database : héberge PostgreSQL  

Chaque service est isolé dans un conteneur.

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

Côté Laravel :
Créer une route API qui retourne la liste des certificats depuis la base de données.

Côté Next.js :
Faire une requête HTTP (fetch/axios) vers l’API Laravel pour récupérer les certificats.

Côté affichage :
Stocker les données dans un state et afficher la liste avec une boucle (map).

---

### Question 8 – PostgreSQL vs Blockchain

PostgreSQL est suffisant pour stocker les certificats et gérer les données efficacement.

Cependant, il ne garantit pas une vérification indépendante des certificats.

Un administrateur peut modifier les données sans preuve externe.

La blockchain permet de vérifier publiquement l’authenticité via un hash.

Les deux technologies sont complémentaires : PostgreSQL pour le stockage et la blockchain pour la confiance.
