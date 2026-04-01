# CertiChain - Evaluation Web3
# Information étudiant.

- **Nom :** Lucea
- **Prénom :** Boni
- **Numéro étudiant :** 22404673
- **Date :** 01/04/2026

---

## Partie 1

### Question 1 - Role des technologies :

1. Next.js : Il joue le rôle de framework front-end pour construire l'interface utilisateur de l'application. Il consomme l'API fournie par Laravel, récupère les données et les affiche aux utilisateurs.

2. Laravel : Il sert de framework back-end pour créer l'API qui gère les données de l'application. Il traite les requêtes, interagit avec la base de données et fournit les données nécessaires à Next.js.

3. PostgreSQL : C'est le système de gestion de base de données utilisé pour stocker et organiser les données de l'application. Il permet à Laravel d'enregistrer, de modifier et de récupérer ces données pour les transmettre ensuite au front-end développé avec Next.js.

4. Docker : Docker permet de faire fonctionner toute l'application (Next.js, Laravel et PostgreSQL) dans des conteneurs isolés et reproductibles. 

### Question 2 - Architecture de l’application :

Next.js gère l'interface utilisateur et communique avec l'API.
Laravel gère la logique métier et traite les requêtes.
PostgreSQL stocke et organise les données.
Docker permet de faire fonctionner toutes ces technologies ensemble dans un environnement identique sur n’importe quelle machine.

---

## Partie 3

### Question 5 - Intérêt de Docker :

L'utilisation de Docker dans ce projet permet de conteneuriser les différentes technologies de l'application comme Next.js, Laravel et PostgreSQL afin qu'elles fonctionnent ensemble dans un environnement contrôlé.

Avantage de l'utilisation de Docker dans ce projet :

- Docker permet de faire fonctionner l'application sur n'importe quelle machine sans se soucier des différences d'environnement, ce qui facilite le développement et le déploiement.

- Grâce à Docker, il n'est pas nécessaire d’installer manuellement toutes les technologies (Next.js, Laravel, PostgreSQL) sur l'ordinateur. Tout est déjà configuré dans les conteneurs et peut être lancé rapidement.

### Question 6 - Services Docker du projet :

Dans cet environnement avec Docker, on peut mettre en place les services (conteneurs) suivants :

1. Frontend - Next.js :
- Conteneur qui gère l'interface utilisateur et affiche les données de l'application dans le navigateur.

2. Backend - Laravel :
- Conteneur qui fournit l'API, traite les requêtes du front-end et applique la logique métier de l'application.

3. Base de données - PostgreSQL :
- Conteneur qui stocke et organise les données de l'application (utilisateurs, produits, etc.).

4. Serveur web - Nginx :
- Conteneur qui sert d'intermédiaire pour gérer les requêtes HTTP et rediriger les demandes vers le backend ou le frontend.

---

## Partie 4

### Question 7 - Affichage des certificats Next.js <-> Laravel :

1. Côté Laravel :
- Créer un modèle et une migration pour les certificats afin de définir la structure de la table dans la base de données.

- Créer un contrôleur qui récupère la liste des certificats depuis la base de données.

- Créer une route API qui permet d'accéder à ces données.

- Le contrôleur renvoie les certificats au format JSON pour qu'ils puissent être utilisés par le front-end.

2. Côté Next.js
- Créer une page ou un composant qui va afficher les certificats.

- Faire une requête HTTP vers l'API Laravel pour récupérer la liste des certificats.

- Stocker les données récupérées dans un state (ou une variable d'état) du composant.

3. Côté affichage
- Parcourir la liste des certificats récupérés.

- Afficher les informations de chaque certificat (par exemple : titre, description, date).

- Présenter les certificats dans l'interface utilisateur sous forme de liste ou de cartes.

### Question 8 - PostgreSQL vs Blockchain - analyse critique :

Je ne suis pas entièrement d'accord avec cet étudiant. PostgreSQL est effectivement un SGBD robuste qui peut gérer la persistance et la cohérence des données dans CertiChain. Cependant, la blockchain apporte des garanties supplémentaires que PostgreSQL seul ne peut fournir : elle assure l'immutabilité, la traçabilité et la vérifiabilité des certificats sans avoir besoin de faire confiance à une autorité centrale. Dans un contexte où la certification et la preuve d'intégrité sont critiques, la blockchain peut donc jouer un rôle complémentaire utile. Par contre, si l'application reste interne et que la confiance entre les parties est déjà assurée, PostgreSQL peut suffire, et la blockchain peut alors sembler redondante.