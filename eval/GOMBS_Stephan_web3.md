
# CertiChain – Évaluation Web3

## Informations étudiant

- **Nom :** GOMBS

- **Prénom :** Stephan

- **Numéro étudiant :** 22004583

- **Date :** 01/04/2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies

Next.js est un framework frontend qui utilise JavaScript ou TypeScript pour créer des sites web interactifs et performants. Dans ce projet, il sera utilisé pour gérer l'interface utilisateur et les interactions avec l'application.

Laravel est un framework PHP qui sert de backend. Il gère les interactions entre l'utilisateur (via le frontend) et les différents services du backend, notamment les API et la base de données.

PostgreSQL est un système de gestion de base de données relationnelle SQL. Dans ce projet, il servira à stocker les certificats et à gérer leur distribution aux utilisateurs appropriés.

Docker est un programme de conteneurisation qui permet d'exécuter divers programmes dans des conteneurs isolés et distincts. Dans ce projet, il servira d'hôte pour chacun des composants (frontend avec Next.js, backend avec Laravel et base de données avec PostgreSQL).


### Question 2 – Architecture de l'application

Le frontend Next.js gère les interactions utilisateur et fait appel à des API pour communiquer avec le backend Laravel. Ce dernier gère la logique métier et fait appel à la base de données PostgreSQL pour stocker les informations nécessaires.


## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

Structure de la table `certificates` :

| Colonne             | Type         | Description                              |
|---------------------|--------------|------------------------------------------|
| id                  | SERIAL       | Clé primaire                             |
| student_name        | VARCHAR(255) | Nom de l'étudiant                        |
| certification_title | VARCHAR(255) | Intitulé de la certification             |
| issue_date          | DATE         | Date d'émission du certificat            |
| blockchain_hash     | VARCHAR(66)  | Hash blockchain ou identifiant de preuve |
| created_at          | TIMESTAMP    | Date de création de l'enregistrement     |
| updated_at          | TIMESTAMP    | Date de mise à jour                      |


### Question 4 – Routes API Laravel

GET:  /api/certificates         Liste tous les certificats
POST: /api/certificates        Crée un nouveau certificat

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

L'intérêt de Docker dans ce cas est de pouvoir lancer l'application avec une seule commande sur n'importe quel système grâce au docker-compose, sans avoir à préparer l'environnement manuellement.

Un autre avantage est l'isolation des différents services dans leurs propres conteneurs, ce qui permet la modification, l'arrêt et le redémarrage de chaque service individuellement sans gêner les autres services.

### Question 6 – Services Docker

Frontend: Conteneur Next.js qui héberge l'interface utilisateur sur le port 3000
Backend : Conteneur Laravel qui gère l'API REST et la logique métier sur le port 8000
Base de donnée : Conteneur PostgreSQL qui stocke les données des certificats sur le port 5432

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel
Laravel
Créer un modèle `Certificate` et un contrôleur `CertificateController`
Définir la route `GET /api/certificates` qui retourne les certificats en JSON
puis configurer les en-têtes CORS pour autoriser les requêtes du frontend

Next.js
Utiliser `fetch()` pour appeler l'API Laravel,Stocker les données dans un état React avec `useState` puis Parcourir le tableau avec `.map()` et afficher chaque certificat

### Question 8 – PostgreSQL vs Blockchain

La blockchain est utile car elle est immuable (non modifiable après sa création), alors qu'avec PostgreSQL un hacker pourrait modifier ou même supprimer les certificats.

PostgreSQL est nécessaire pour stocker les données complètes et permettre des recherches rapides, mais la blockchain apporte une preuve d'authenticité vérifiable par tous.