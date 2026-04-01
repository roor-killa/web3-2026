# CertiChain – Évaluation Web3

Application de certificats numériques (**Next.js · Laravel · Docker · PostgreSQL**).  
**Total : 100 points** — travail individuel, notes de cours autorisées.

**Livrable :** ce fichier `README.md` contient l’ensemble de vos réponses. Pour le dépôt sur la plateforme, renommez-le selon la consigne : **`NOM_Prénom_web3.md`** (contenu inchangé).

---

## Informations étudiant

- **Nom :** &lt;Votre nom&gt;
- **Prénom :** &lt;Votre prénom&gt;
- **Numéro étudiant :** &lt;Votre numéro&gt;
- **Date :** 1er avril 2026 *(à ajuster si besoin)*

---

## Partie 1 – Compréhension de l’architecture (20 pts)

### Question 1 – Rôle des technologies (10 pts)

*Expliquez brièvement le rôle de chaque technologie dans le projet (2 à 4 lignes par technologie) : Next.js, Laravel, PostgreSQL, Docker.*

#### Next.js

Next.js sert de **framework front-end** (React) pour l’interface CertiChain : formulaires d’ajout de certificat, listes et pages de détail. Il peut rendre des pages côté serveur (SSR) ou client pour afficher les données et appelle l’API Laravel en HTTP (REST, JSON).

#### Laravel

Laravel est le **backend** : il expose une **API REST** (routes `/api`, contrôleurs, validation des entrées), applique les règles métier (qui peut créer un certificat, format des champs) et dialogue avec PostgreSQL via Eloquent ou le query builder.

#### PostgreSQL

PostgreSQL est le **SGBD relationnel** qui **persiste** les certificats (table `certificates`, requêtes SQL, intégrité référentielle, transactions). Il garantit une source de vérité interne structurée pour l’école, distincte de la preuve éventuelle sur chaîne.

#### Docker

Docker **empaquette** chaque partie (front, API, base) dans des **conteneurs** avec images reproductibles. Il unifie l’environnement de développement et facilite le démarrage local (Compose : services liés, réseaux, volumes) sans installer manuellement PHP, Node et PostgreSQL sur chaque machine.

### Question 2 – Architecture de l’application (10 pts)

*Précisez : quel composant gère l’interface utilisateur, la logique métier, le stockage des données, et comment les composants communiquent (texte ou schéma simple).*

- **Interface utilisateur :** application **Next.js** (navigateur), écrans et interactions.
- **Logique métier :** **API Laravel** (création, validation, règles d’accès, format des réponses JSON).
- **Stockage des données :** **PostgreSQL** (données métier des certificats).

**Communication :** le navigateur charge l’UI Next.js ; Next.js envoie des requêtes **HTTP** (souvent `fetch` ou équivalent) vers l’URL de l’API Laravel (`GET` liste/détail, `POST` création). Laravel exécute le code métier, interroge PostgreSQL, renvoie du JSON. Schéma logique :

`Utilisateur ↔ Next.js (front) —HTTP/JSON— Laravel (API) —SQL— PostgreSQL`

*(Optionnel : une preuve ou un hash peut en plus être ancré sur une blockchain ; l’école garde alors une base « off-chain » et une référence vérifiable « on-chain ».)*

---

## Partie 2 – Modélisation fonctionnelle (20 pts)

*Rappel : ajouter un certificat, liste, détail. Un certificat contient : identifiant, nom de l’étudiant, intitulé de la certification, date d’émission, hash blockchain ou identifiant de preuve.*

### Question 3 – Table PostgreSQL `certificates` (10 pts)

*Nom des colonnes, types, clé primaire.*

**Table :** `certificates`

| Colonne | Type PostgreSQL | Contraintes / remarques |
|--------|------------------|-------------------------|
| `id` | `SERIAL` ou `BIGSERIAL` | **Clé primaire** (identifiant technique auto-incrémenté). |
| `student_name` | `VARCHAR(255)` | Nom de l’étudiant (NOT NULL). |
| `certification_title` | `VARCHAR(500)` | Intitulé de la certification (NOT NULL). |
| `issued_at` | `DATE` | Date d’émission (NOT NULL). |
| `blockchain_hash` | `TEXT` | Hash ou identifiant de preuve sur chaîne (NULL autorisé si pas encore ancré). |

**Clé primaire :** `id`.

*(On peut ajouter ultérieurement des index, `created_at`, clé étrangère vers une table `users`, etc.)*

### Question 4 – Routes API Laravel (10 pts)

*Deux routes : créer un certificat ; récupérer la liste des certificats. Pour chaque route : méthode HTTP, URL, rôle.*

**1) Créer un certificat**

- **Méthode HTTP :** `POST`
- **URL :** `/api/certificates` *(convention REST ; variante acceptée : `/api/certificate` si l’énoncé impose le singulier, mais le pluriel est courant pour la collection).*
- **Rôle :** recevoir le corps JSON (nom, intitulé, date, hash/preuve éventuel), **valider** les champs, enregistrer une ligne dans `certificates` et renvoyer le certificat créé (souvent `201 Created` + représentation JSON).

**2) Liste des certificats**

- **Méthode HTTP :** `GET`
- **URL :** `/api/certificates`
- **Rôle :** **retourner** la collection des certificats (sérialisation JSON), éventuellement avec pagination (`?page=`) ou tri selon les besoins du front.

*Déclaration typique dans `routes/api.php` :* `Route::get('/certificates', ...)` et `Route::post('/certificates', ...)`.

---

## Partie 3 – Approche Web3 (20 pts)

### Question 5 – Apport de la logique Web3 (10 pts)

*Par rapport à une application web classique, expliquez ce qu’apporte la logique Web3. Votre réponse doit mentionner au moins : la notion de preuve ou de traçabilité, le rôle possible de la blockchain, la différence entre une donnée stockée en base et une donnée vérifiable publiquement.*

Une appli web « classique » repose souvent sur un **modèle de confiance centralisé** (serveur et base de données) ; les données peuvent être modifiées par l’administrateur sans trace lisible par un tiers. La logique **Web3** introduit une **preuve** et une **traçabilité** : on peut **ancrer** un **engagement** (souvent un **hash** du certificat) sur une **blockchain**, horodaté et inclus dans une chaîne de blocs difficile à réécrire seul. La blockchain peut servir de **registre distribué** : plusieurs nœuds conservent une copie, ce qui renforce la résistance à la censure ou à la suppression unilatérale par un acteur. **Différence importante :** une donnée en **PostgreSQL** est surtout **vérifiable en interne** (accès contrôlé, politiques de l’école) ; une donnée **vérifiable publiquement** permet à un tiers (employeur, autres écoles) de **contrôler** qu’un document correspond bien à une ancre en chaîne **sans** nécessairement avoir accès à toute la base privée.

### Question 6 – Hash vs données complètes sur blockchain (10 pts)

*On ne stocke pas toujours le certificat complet sur la blockchain. Expliquez pourquoi il peut être préférable de stocker seulement un hash ou une preuve sur la blockchain, plutôt que toutes les données du certificat.*

Stocker **tout le certificat** sur chaîne est souvent **coûteux** (frais, taille des transactions) et **immuable** de façon peu pratique (corriger une coquille exige une nouvelle transaction). Cela **expose** aussi des **données personnelles** (RGPD) sur un registre public et permanent. En enregistrant seulement un **hash** (empreinte) ou une **preuve** (Merkle, zk-SNARK selon le contexte), on obtient une **ancrage léger** : toute modification du document change le hash, ce qui brise la correspondance avec la chaîne. Les **détails** restent dans **PostgreSQL** ou un stockage contrôlé par l’école, tandis que **l’intégrité** et l’**ordre temporel** peuvent être attestés par la blockchain.

---

## Partie 4 – Docker et déploiement local (20 pts)

### Question 7 – Intérêt de Docker (10 pts)

*Expliquez l’intérêt d’utiliser Docker dans ce projet. Au moins deux avantages concrets.*

**1) Reproductibilité** — chaque développeur et la CI peuvent lancer la **même image** (versions de PHP, Node, extensions, PostgreSQL), ce qui limite les bugs « ça marche sur ma machine ».

**2) Isolement et composition** — les services (front, Laravel, base) tournent dans des conteneurs **séparés** mais reliés par un réseau Docker ; on démarre toute la stack avec **Compose**, volumes pour la persistance des données, sans conflits de ports entre projets si on les mappe proprement.

*(Autre avantage possible : déploiement plus simple vers un environnement qui exécute des conteneurs.)*

### Question 8 – Services Docker du projet (10 pts)

*Citez les conteneurs ou services que vous mettriez en place. Pour chacun : une phrase sur son rôle (ex. frontend, backend, base de données, etc.).*

- **`db` (PostgreSQL)** — héberge la base relationnelle `certificates` et les données métier avec persistance sur volume.
- **`backend` (Laravel / PHP-FPM)** — exécute l’API REST, valide les requêtes et accède à PostgreSQL.
- **`frontend` (Next.js)** — sert l’interface utilisateur (développement souvent avec `npm run dev` dans le conteneur).
- **`nginx` (optionnel mais utile)** — reverse proxy unique vers le navigateur : route `/api` vers Laravel et le reste vers Next.js.
- *(Optionnel)* **`worker` ou service d’ancrage** — pour pousser un hash sur la blockchain ou traiter des files d’attente d’événements sans bloquer l’API.

---

## Partie 5 – Exercice pratique / Réflexion technique (20 pts)

### Question 9 – Affichage des certificats Next.js ↔ Laravel (10 pts)

*Décrivez les grandes étapes pour afficher dans Next.js la liste des certificats récupérés depuis Laravel : côté Laravel, côté Next.js, côté affichage. Aucun code complet requis, réponse structurée.*

**Côté Laravel** — exposer une route **GET** `/api/certificates` (contrôleur + modèle `Certificate`) qui lit PostgreSQL et renvoie un **tableau JSON** homogène (id, noms, dates, hash). Gérer CORS si le front et l’API sont sur des origines différentes ; renvoyer codes HTTP et messages d’erreur clairs.

**Côté Next.js** — selon le mode (Server Component, route handler, ou `useEffect` côté client), **appeler l’URL** de l’API (variable d’environnement `NEXT_PUBLIC_API_URL` ou fetch serveur vers l’hôte interne Docker). Parser la réponse JSON et **stocker** le résultat dans l’état React ou les props de page.

**Côté affichage** — dans un composant (liste), **itérer** sur les certificats et afficher les champs importants (titre, étudiant, date) sous forme de cartes ou tableau ; liens vers `/certificates/[id]` pour le détail. Prévoir chargement et message d’erreur si l’API est indisponible.

### Question 10 – PostgreSQL vs Blockchain – analyse critique (10 pts)

*« PostgreSQL suffit, la blockchain ne sert à rien dans CertiChain. » Êtes-vous d’accord ? Justifiez en 5 à 8 lignes.*

Je ne suis **pas entièrement d’accord**. **PostgreSQL suffit** pour gérer le **quotidien** de l’école : CRUD rapide, recherche, sauvegardes, contrôle d’accès, coût maîtrisé. En revanche, **affirmer que la blockchain ne sert à rien** ignore l’**objectif de confiance** vis-à-vis des **tiers** : un diplôme stocké seulement en base reste **modifiable** facilement pour quiconque contrôle le serveur ou les sauvegardes, sans preuve publique.

Un **ancrage** (hash) sur une blockchain apporte une **horodatation** et une **résistance accrue** à la réécriture **unilatérale**, utile pour qu’un employeur vérifie l’**intégrité** du document. La blockchain n’est pas obligatoire pour tous les cas d’usage, mais elle **complète** PostgreSQL lorsqu’on veut une **attestation vérifiable** indépendamment de l’infrastructure de l’école. Un bon compromis reste **données sensibles en base** + **preuve courte sur chaîne**.

---

## Arborescence du dossier `evaluation_web3`

| Élément | Rôle |
|--------|------|
| `README.md` | Livrable / réponses (questions 1 à 10) |
| `reference/SUJET_EVALUATION.md` | Énoncé officiel aligné sur la séance |
| `backend/` | API Laravel (CertiChain) — optionnel, voir cours / `bokaynou/` |
| `frontend/` | **Next.js** — formulaire de création de certificat + liste (→ API) |
| `infra/` | Docker Compose (PostgreSQL, API, etc.) |
| `api-fastapi/` | API FastAPI + PostgreSQL (prototype technique ; le sujet attend Laravel à l’écrit) |

*Aucun code complet n’est exigé pour l’évaluation écrite — les réponses doivent montrer la compréhension des concepts et de l’architecture.*
