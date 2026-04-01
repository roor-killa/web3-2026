# CertiChain – Évaluation Web3 2026

## Informations étudiant

- **Nom :** Guindo
- **Prénom :** Ibrahim Ousseini **
- **Numéro étudiant :** 22507721 **
- **Date :** 01 avril 2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies

**Next.js**
Next.js est un framework React qui gère l'interface utilisateur de l'application. Il permet le rendu côté serveur (SSR) et côté client, ce qui améliore les performances et le référencement. Dans CertiChain, il affiche la liste des certificats et les détails de chaque certificat en appelant l'API Laravel.

**Laravel**
Laravel est un framework PHP qui constitue le backend de l'application. Il expose une API REST consommée par le frontend Next.js, gère la logique métier (validation, création, récupération des certificats) et communique avec la base de données PostgreSQL via son ORM Eloquent.

**PostgreSQL**
PostgreSQL est le système de gestion de base de données relationnelle (SGBDR) du projet. Il stocke de façon persistante toutes les données structurées de l'application : les certificats, leurs métadonnées (nom de l'étudiant, date d'émission, hash blockchain, etc.). Il garantit l'intégrité des données grâce aux contraintes SQL.

**Docker**
Docker est l'outil de conteneurisation qui encapsule chaque service de l'application (frontend, backend, base de données) dans des conteneurs isolés et reproductibles. Il permet à tous les développeurs de travailler dans un environnement identique, quelle que soit leur machine, et facilite le déploiement en production.

---

### Question 2 – Architecture de l'application

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                           │
│                   Frontend – Next.js                        │
│    (interface utilisateur, rendu des pages, appels API)     │
└──────────────────────────┬──────────────────────────────────┘
                           │  HTTP / REST (JSON)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend – Laravel (API)                     │
│  (logique métier, validation, contrôleurs, routes /api/*)   │
└──────────────────────────┬──────────────────────────────────┘
                           │  Requêtes SQL (via Eloquent ORM)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Base de données – PostgreSQL                    │
│         (stockage persistant des certificats)               │
└─────────────────────────────────────────────────────────────┘
```

- **Interface utilisateur** : Next.js — affiche les pages, envoie des requêtes HTTP vers l'API.
- **Logique métier** : Laravel — reçoit les requêtes, applique les règles de validation, interroge la BDD.
- **Stockage des données** : PostgreSQL — conserve les enregistrements de façon persistante.
- **Communication** : Next.js ↔ Laravel via des appels REST HTTP (JSON) ; Laravel ↔ PostgreSQL via l'ORM Eloquent (PDO/SQL). L'ensemble est orchestré par Docker Compose.

---

## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

```sql
CREATE TABLE certificates (
    id          SERIAL          PRIMARY KEY,
    student_name    VARCHAR(255)    NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    issued_at       DATE            NOT NULL,
    blockchain_hash VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMP       DEFAULT NOW(),
    updated_at      TIMESTAMP       DEFAULT NOW()
);
```

| Colonne          | Type          | Contrainte      | Rôle                                          |
|------------------|---------------|-----------------|-----------------------------------------------|
| `id`             | SERIAL        | PRIMARY KEY     | Identifiant unique auto-incrémenté            |
| `student_name`   | VARCHAR(255)  | NOT NULL        | Nom complet de l'étudiant                     |
| `title`          | VARCHAR(255)  | NOT NULL        | Intitulé de la certification                  |
| `issued_at`      | DATE          | NOT NULL        | Date d'émission du certificat                 |
| `blockchain_hash`| VARCHAR(255)  | NOT NULL        | Hash ou identifiant de preuve blockchain      |
| `created_at`     | TIMESTAMP     | DEFAULT NOW()   | Date de création de l'enregistrement          |
| `updated_at`     | TIMESTAMP     | DEFAULT NOW()   | Date de dernière modification                 |

---

### Question 4 – Routes API Laravel

**Route 1 – Créer un certificat**

| Propriété       | Valeur                        |
|-----------------|-------------------------------|
| Méthode HTTP    | `POST`                        |
| URL             | `/api/certificates`           |
| Rôle            | Reçoit les données du certificat (nom étudiant, intitulé, date, hash) dans le corps de la requête, les valide, puis les enregistre en base de données. Retourne le certificat créé avec son `id` en réponse JSON (HTTP 201). |

**Route 2 – Récupérer la liste des certificats**

| Propriété       | Valeur                        |
|-----------------|-------------------------------|
| Méthode HTTP    | `GET`                         |
| URL             | `/api/certificates`           |
| Rôle            | Interroge la table `certificates`, récupère tous les enregistrements et les retourne sous forme de tableau JSON (HTTP 200). Peut éventuellement gérer la pagination. |

Dans `routes/api.php` Laravel :

```php
Route::post('/certificates',  [CertificateController::class, 'store']);
Route::get('/certificates',   [CertificateController::class, 'index']);
```

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Docker présente plusieurs avantages concrets dans ce projet :

1. **Reproductibilité de l'environnement** : chaque développeur lance exactement les mêmes versions de PHP, Node.js et PostgreSQL grâce aux images Docker, ce qui élimine le problème classique « ça marche sur ma machine ». Il n'est plus nécessaire d'installer manuellement les dépendances sur le poste local.

2. **Isolation des services** : chaque composant (frontend, backend, base de données) tourne dans son propre conteneur cloisonné. Un problème dans le conteneur Laravel n'affecte pas le conteneur PostgreSQL, ce qui facilite le débogage et la maintenance.

3. **Déploiement simplifié** : avec un simple `docker compose up`, l'ensemble de l'application est démarré en quelques secondes, tant en développement qu'en production, sans configuration supplémentaire du serveur hôte.

---

### Question 6 – Services Docker

Le fichier `docker-compose.yml` du projet comprendrait les services suivants :

| Service      | Image de base        | Rôle                                                                 |
|--------------|----------------------|----------------------------------------------------------------------|
| `frontend`   | `node:20-alpine`     | Exécute l'application Next.js, sert l'interface utilisateur sur le port 3000. |
| `backend`    | `php:8.2-fpm` + Nginx | Héberge l'API Laravel, traite les requêtes HTTP entrantes sur le port 8000. |
| `database`   | `postgres:15`        | Fournit le serveur PostgreSQL et stocke les données persistantes du projet. |
| `pgadmin`    | `dpage/pgadmin4`     | Interface d'administration graphique pour inspecter la base de données (optionnel, utile en développement). |

Les services communiquent via un réseau Docker interne (`certichain_network`), et les données PostgreSQL sont sauvegardées dans un volume nommé (`postgres_data`) pour persister entre les redémarrages.

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

**Côté Laravel (API)**

1. Définir la route `GET /api/certificates` dans `routes/api.php`.
2. Créer un `CertificateController` avec une méthode `index()` qui interroge le modèle `Certificate` (Eloquent) et retourne `response()->json($certificates)`.
3. S'assurer que les en-têtes CORS sont configurés (middleware `cors` de Laravel) pour autoriser les requêtes provenant du domaine Next.js.

**Côté Next.js (récupération des données)**

1. Dans une page ou un composant (ex. `app/certificates/page.tsx`), utiliser la fonction `fetch()` ou une librairie comme `axios` pour appeler `http://backend:8000/api/certificates`.
2. En Next.js App Router, on peut utiliser un **Server Component** et `async/await` directement dans la fonction de page pour récupérer les données côté serveur avant le rendu, sans exposer l'appel API au navigateur.
3. Gérer les cas d'erreur (réseau indisponible, réponse non-OK) et l'état de chargement.

**Côté affichage**

1. Mapper le tableau JSON retourné par l'API sur des composants React (ex. une liste `<ul>` ou des cartes `<CertificateCard />`).
2. Afficher pour chaque certificat : le nom de l'étudiant, l'intitulé, la date d'émission et le hash blockchain (éventuellement tronqué).
3. Ajouter un lien vers la page de détail (`/certificates/[id]`) pour permettre la consultation individuelle.

---

### Question 8 – PostgreSQL vs Blockchain

Je ne suis **pas d'accord** avec cet étudiant.

PostgreSQL est efficace pour stocker et interroger les données structurées de l'application, et il est indispensable au fonctionnement quotidien de CertiChain. Cependant, il ne répond pas aux besoins spécifiques des certificats numériques en matière de **confiance et de vérification externe**.

Un certificat stocké uniquement en base de données peut être modifié ou supprimé par un administrateur malveillant ou en cas de compromission du serveur : son authenticité est donc entièrement dépendante de la fiabilité de l'école. À l'inverse, en ancrant un **hash du certificat** sur une blockchain publique (Ethereum, Polygon, etc.), on crée une preuve d'existence immuable et horodatée. N'importe qui — employeur, autre établissement — peut vérifier l'authenticité du diplôme sans avoir à faire confiance à l'école émettrice.

La blockchain n'a pas vocation à remplacer PostgreSQL (qui reste nécessaire pour les recherches, les filtrages, la gestion des utilisateurs), mais elle lui est **complémentaire** : PostgreSQL stocke les données, la blockchain garantit leur intégrité et leur opposabilité. C'est précisément cette combinaison qui justifie le suffixe « Chain » dans le nom CertiChain.
