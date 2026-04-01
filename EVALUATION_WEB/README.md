# CertiChain – Évaluation Web3

## Informations étudiant
- **Nom :** ROSAMBERT
- **Prénom :** LUCAS
- **Numéro étudiant :** 22402318
- **Date :** 01/04/2026

NOUVEAUX PORTS POUR NE PAS AVOIR DE CONFLICS DOCKER
Nginx	8005
Laravel	8002
Next.js	3001
PostgreSQL	5433

http://localhost:8005/api/products
http://127.0.0.1:8005/api/certificates

pgadmin pour l'affichage 
http://localhost:8081
mail:  http://localhost:8081
mdp : admin

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies


 
Next.js sert à créer l’interface utilisateur de l’application. Il permet d’afficher les pages, la liste des certificats et les détails d’un certificat. Il communique avec le backend via des requêtes HTTP vers l’API Laravel.


Laravel sert à développer le backend de l’application. Il gère les routes API, la validation des données et les échanges avec la base PostgreSQL. C’est lui qui reçoit les requêtes du frontend et renvoie les données au format JSON.

  
PostgreSQL est la base de données relationnelle du projet. Elle stock les informations des certificats, par exemple l’identifiant, le nom de l’étudiant, l’intitulé de la certification, la date d’émission et le hash de preuve. Elle permet de conserver les données de manière fiable.


Docker permet de lancer l’application dans un environnement conteneurisé. Chaque service, comme le frontend, le backend, la base de données et Nginx, fonctionne dans son propre conteneur. Cela facilite l’installation, évite les conflits d’environnement et rend le projet plus simple à déployer localement.

### Question 2 – Architecture de l'application

L’interface utilisateur est gérée par **Next.js**. C’est le frontend de l’application, chargé d’afficher les pages, les formulaires et la liste des certificats.

La logique métier est gérée par **Laravel**. Le backend reçoit les requêtes du frontend, valide les données, applique les traitements nécessaires et interagit avec la base de données.

Le stockage des données est assuré par **PostgreSQL**. Cette base contient les certificats et leurs informations, comme le nom de l’étudiant, le titre de la certification, la date d’émission et le hash de preuve.

Les composants communiquent de la façon suivante : l’utilisateur interagit avec l’interface Next.js, Next.js envoie des requêtes HTTP à l’API Laravel, puis Laravel lit ou enregistre les données dans PostgreSQL avant de renvoyer une réponse au frontend.

---

## Partie 2 – Modélisation fonctionnelle


### Question 3 – Table PostgreSQL

Une structure simple pour la table `certificates` peut être la suivante :

- `id` : `BIGSERIAL`  
  clé primaire de la table

- `student_name` : `VARCHAR(255)`  
  nom de l’étudiant

- `certification_title` : `VARCHAR(255)`  
  intitulé de la certification

- `issue_date` : `DATE`  
  date d’émission du certificat

- `blockchain_hash` : `VARCHAR(255)`  
  hash blockchain ou identifiant de preuve

- `created_at` : `TIMESTAMP`  
  date de création de l’enregistrement

- `updated_at` : `TIMESTAMP`  
  date de dernière modification

La clé primaire est `id`.


### Question 4 – Routes API Laravel

Une première route permet de créer un certificat :

- Méthode HTTP : POST  
- URL : /api/certificates  
- Rôle : cette route permet d’ajouter un nouveau certificat dans la base de données en envoyant les informations nécessaires (nom de l’étudiant, certification, date, hash).

Une deuxième route permet de récupérer la liste des certificats :

- Méthode HTTP : GET  
- URL : /api/certificates  
- Rôle : cette route permet de récupérer tous les certificats enregistrés dans la base afin de les afficher dans l’application.

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Un premier avantage concret est la **reproductibilité** : le projet fonctionne de la même manière sur toutes les machines. Un second avantage est la **facilité de déploiement local** : il suffit de lancer les conteneurs pour disposer d’un environnement complet sans installer manuellement tous les outils. Docker permet aussi une meilleure organisation du projet en séparant clairement les rôles de chaque service.

### Question 6 – Services Docker

Le projet utilise plusieurs services Docker, chacun ayant un rôle précis.

Le service **frontend (Next.js)** sert à afficher l’interface utilisateur. Il permet à l’utilisateur de consulter les certificats et d’interagir avec l’application.

Le service **backend (Laravel)** gère la logique métier et les routes API. Il reçoit les requêtes du frontend, traite les données et communique avec la base de données.

Le service **PostgreSQL (bd)** est la base de données. Il stocke les certificats et leurs informations de manière structurée.

Le service **Nginx** joue le rôle de reverse proxy. Il sert de point d’entrée unique pour l’application et redirige les requêtes vers le backend ou le frontend selon le besoin.

Ces services communiquent entre eux via un réseau Docker interne, ce qui permet une architecture claire et modulaire.

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

Pour afficher la liste des certificats dans Next.js, le frontend doit envoyer une requête HTTP vers l’API Laravel.

Dans Next.js, on peut utiliser `fetch` :

```javascript
fetch("http://localhost:8005/api/certificates")
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

### Question 8 – PostgreSQL vs Blockchain
*Votre réponse ici...*