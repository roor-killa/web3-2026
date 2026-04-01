# Certichain
Evaluation Web3

# Informartion étudiant
Prénom: Medhy
Nom: CHEVALIER CORAIN
Numéro étudiant : 
Date : 01/04/2026

# Question 1: Rôle des technologies

1. Next.js : Framework React utilisé pour développer l'interface utilisateur (frontend). Il gère le rendu des pages et permet une navigation fluide pour consulter ou ajouter des certificats.

2. Laravel : Framework PHP servant d'API backend. Il contient la logique métier, gère les requêtes du frontend et communique avec la base de données pour sécuriser les échanges.

3. PostgreSQL : Système de gestion de base de données relationnelle. Il est utilisé pour le stockage persistant des informations relatives aux certificats (noms, dates, hashs)

4. Docker : Plateforme de conteneurisation qui permet d'isoler et de déployer l'application et ses services de manière cohérente sur n'importe quelle machine.

## Question 2: Architecture de l'application

1. Interface Utilisateur (Next.js) : Le frontend gère l'affichage dynamique et l'interaction avec l'utilisateur (formulaire d'ajout, liste des certificats).

2. Logique Métier (Laravel) : Le backend agit comme une API REST. Il reçoit les requêtes du frontend, valide les données, gère l'authentification et communique avec la base de données.

3. Stockage des données (PostgreSQL) : Cette base de données relationnelle assure la persistance des informations des certificats (nom, date, hash).

4. Communication : Les composants communiquent via le protocole HTTP. Le frontend Next.js envoie des requêtes JSON à l'API Laravel, qui interroge ensuite PostgreSQL via des requêtes SQL avant de renvoyer la réponse au format JSON.

## Partie 2 Modélisation fonctionnelle
# Question 3 : Table PostgreSQL

Structure proposée pour la table certificates:
| Nom de la colonne | Type | Description |
| :--- | :--- | :--- |
| id | SERIAL / UUID | Clé primaire. Identifiant unique. |
| student_name | VARCHAR(255) | Nom de l'étudiant. |
| certification_title| VARCHAR(255) | Intitulé de la certification. |
| issue_date | DATE / TIMESTAMP| Date d'émission du certificat. |
| blockchain_hash | TEXT / VARCHAR | Hash blockchain ou identifiant de preuve. |

# Question 4 : Routes API Laravel
Créer un certificat :
Méthode : POST
URL : /api/certificates
Rôle : Recevoir les données du formulaire et enregistrer un nouveau certificat en base de données

Récupérer la liste :
Méthode : GET
URL : /api/certificates
Rôle : Extraire tous les certificats de la table PostgreSQL et les renvoyer au format JSON.

###  Partie 3 : Docker et déploiement local

# Question 5 : Intérêt de Docker
L'utilisation de Docker dans ce projet présente deux avantages majeurs:
1. Uniformité de l'environnement : Il garantit que l'application fonctionne de la même manière sur l'ordinateur de l'étudiant et celui du correcteur, évitant les conflits de versions (ex: version de PHP ou Node.js).

2. Facilité de déploiement : Il permet de lancer l'intégralité de l'infrastructure (frontend, backend, BDD) avec une seule commande, sans installation manuelle complexe sur le système hôte

# Question 6 : Services Docker
Services à mettre en place:
frontend : Exécute l'application Next.js pour l'interface utilisateur.
backend : Exécute l'API Laravel pour traiter les requêtes et la logique.
database : Héberge l'instance PostgreSQL pour le stockage des données.

#### Partie 4 : Exercice pratique

# Question 7 : Affichage Next.js Laravel
1. Côté Laravel : Création d'un contrôleur qui récupère les données via le modèle Certificate et retourne une réponse JSON via la route GET /api/certificates.

2. Côté Next.js : Utilisation de fetch ou d'une bibliothèque comme Axios dans un composant (ex: useEffect ou Server Component) pour appeler l'URL de l'API Laravel.

3. Côté affichage : Parcours du tableau de données reçu (via une boucle .map()) pour générer dynamiquement des composants HTML (cartes ou lignes de tableau) affichant les détails de chaque certificat.

# Question 8 : PostgreSQL vs Blockchain
Je ne suis pas d'accord avec cet étudiant. Bien que PostgreSQL soit excellent pour stocker et indexer des données de manière performante, il est centralisé et modifiable par toute personne ayant accès à la base.
Dans le cadre de CertiChain, la blockchain apporte une couche indispensable d'immutabilité et de confiance. Le "hash blockchain" stocké permet de prouver qu'un certificat n'a pas été falsifié après son émission, offrant ainsi une valeur légale et vérifiable que PostgreSQL seul ne peut garantir.

