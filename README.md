# CertiChain – Évaluation Web3

## Informations étudiant

- **Nom :** <Votre nom>
- **Prénom :** <Votre prénom>
- **Numéro étudiant :** <Votre numéro>
- **Date :** 01/04/2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies

**Next.js**
Next.js c'est la partie que l'utilisateur voit directement dans son navigateur. C'est lui qui affiche les pages, les listes de certificats, les formulaires. Quand on clique sur un bouton ou qu'on navigue c'est Next.js qui gère ça et il va chercher les données dont il a besoin auprès du backend Laravel.

**Laravel**
Laravel c'est le moteur caché derrière l'application. L'utilisateur ne le voit pas mais c'est lui qui fait tout le travail sérieux: vérifier que les données sont correctes, enregistrer un certificat, répondre aux demandes du frontend. Il fonctionne comme un serveur qui attend des requêtes et renvoie des réponses en JSON.

**PostgreSQL**
PostgreSQL c'est là où toutes les données sont sauvegardées. Sans lui, tout disparaîtrait à chaque redémarrage. C'est une base de données relationnelle, ce qui veut dire qu'on organise les informations dans des tableaux avec des colonnes bien définies comme un tableur mais beaucoup plus puissant.

**Docker**
Docker permet de faire tourner toute l'application dans des boîtes isolées qu'on appelle des conteneurs. L'avantage c'est que peu importe la machine sur laquelle on travaille le projet se lance exactement de la même façon. Plus besoin de passer des heures à configurer son environnement un simple docker compose up et tout démarre.

---

### Question 2 – Architecture de l'application

| Rôle | Composant |
|---|---|
| Interface utilisateur | Next.js |
| Logique métier | Laravel |
| Stockage des données | PostgreSQL |

```
[Navigateur]
     ↓ HTTP
  [Next.js]
     ↓ JSON (API REST)
  [Laravel]
     ↓ SQL
  [PostgreSQL]
```

Next.js envoie des requêtes HTTP vers l'API Laravel. Laravel traite la requête interroge PostgreSQL via Eloquent puis retourne une réponse JSON que Next.js reçoit et affiche à l'utilisateur.

---

## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

Structure de la table `certificates` :

```sql
CREATE TABLE certificates (
    id               SERIAL        PRIMARY KEY,
    student_name     VARCHAR(255)  NOT NULL,
    title            VARCHAR(255)  NOT NULL,
    issued_at        DATE          NOT NULL,
    blockchain_hash  VARCHAR(255)  NOT NULL
);
```

| Colonne | Type | Rôle |
|---|---|---|
| `id` | SERIAL | Clé primaire, auto-incrémentée |
| `student_name` | VARCHAR(255) | Nom complet de l'étudiant |
| `title` | VARCHAR(255) | Intitulé de la certification |
| `issued_at` | DATE | Date d'émission du certificat |
| `blockchain_hash` | VARCHAR(255) | Hash ou identifiant de preuve blockchain |

---

### Question 4 – Routes API Laravel

**Route 1 — Créer un certificat**

- **Méthode HTTP :** `POST`
- **URL :** `/api/certificates`
- **Rôle :** Reçoit les données d'un nouveau certificat dans le corps de la requête (JSON), les valide, puis les insère dans la table `certificates` en base de données.

**Route 2 — Récupérer la liste des certificats**

- **Méthode HTTP :** `GET`
- **URL :** `/api/certificates`
- **Rôle :** Interroge la base de données et retourne la liste complète des certificats au format JSON.

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Docker présente deux avantages concrets majeurs dans ce projet :

1. **Reproductibilité de l'environnement :** Avec Docker, chaque développeur ou serveur utilise exactement le même environnement (même version de PHP, Node.js, PostgreSQL). On élimine le problème classique *"ça marche sur ma machine mais pas sur la tienne"*. Il suffit d'une commande (`docker compose up`) pour lancer l'ensemble du projet.

2. **Isolation des services :** Chaque composant (frontend, backend, base de données) tourne dans son propre conteneur indépendant. Ils ne s'interfèrent pas, et on peut les démarrer, arrêter ou mettre à jour séparément sans impacter les autres services.

---

### Question 6 – Services Docker

| Service | Rôle |
|---|---|
| `frontend` | Héberge l'application Next.js et sert l'interface utilisateur dans le navigateur |
| `backend` | Héberge l'API Laravel qui contient la logique métier et répond aux requêtes du frontend |
| `database` | Héberge le serveur PostgreSQL qui stocke de façon persistante tous les certificats |
| `nginx` *(optionnel)* | Sert de reverse proxy pour router les requêtes HTTP vers le bon service |

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

**Côté Laravel :**
1. Définir la route `GET /api/certificates` dans le fichier `routes/api.php`
2. Créer un `CertificateController` avec une méthode `index()`
3. Cette méthode interroge la table `certificates` via le modèle Eloquent et retourne les résultats encodés en JSON

**Côté Next.js :**
1. Dans une page (ex. `app/certificates/page.tsx`), effectuer un appel HTTP vers `http://backend/api/certificates` au chargement du composant
2. Stocker les données reçues dans un état local (`useState`) ou les récupérer directement côté serveur avec un Server Component
3. Gérer les états de chargement et d'erreur pour une meilleure expérience utilisateur

**Côté affichage :**
1. Boucler sur la liste des certificats reçus
2. Afficher pour chaque certificat : le nom de l'étudiant, l'intitulé, la date d'émission et le hash blockchain
3. Rendre chaque élément cliquable pour naviguer vers la page de détail du certificat

---

### Question 8 – PostgreSQL vs Blockchain

Je ne suis pas d'accord avec cet étudiant. PostgreSQL est très utile pour stocker et retrouver les données rapidement mais le problème c'est qu'on est obligé de faire confiance à celui qui gère la base. Si l'école modifie ou supprime un certificat personne ne pourra le détecter. La blockchain règle exactement ce problème une fois qu'un certificat y est enregistré il devient impossible à falsifier et n'importe qui peut vérifier son authenticité sans contacter l'école. Les deux technologies ne font donc pas la même chose et sont complémentaires. CertiChain sans blockchain ne serait qu'une application web classique, pas une application Web3.