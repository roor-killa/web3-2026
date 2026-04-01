# Certichain

## Informations de l'étudiant

* Nom : BOUTANT 
Prénom : Axel
Date : 1er avril 2026

---
### Partie 1

#### Question 1

Next.js : Framework frontend permettant de construire l’interface utilisateur.
Laravel : Framework backend permettant de gérer la logique métier et les API.
PostgreSQL : Base de données relationnelle pour stocker les certificats.
Docker : Outil permettant de créer un environnement de développement isolé.

---

#### Question 2

Interface utilisateur : Next.js
Logique métier : Laravel
Stockage des données : PostgreSQL

Communication :

* Next.js envoie des requêtes HTTP à Laravel
* Laravel communique avec PostgreSQL

---

### Partie 2

#### Question 3

Table : certificates

* id : BIGINT, clé primaire
* student_name : VARCHAR
* certification_title : VARCHAR
* issued_at : DATE
* blockchain_hash : VARCHAR

---

#### Question 4

GET /api/certificates
Permet de récupérer la liste des certificats

POST /api/certificates
Permet de créer un certificat

---

### Partie 3

#### Question 5

Le Web3 permet d’ajouter une couche de vérification grâce à la blockchain.
Les certificats peuvent être associés à une preuve immuable.
Contrairement à une base classique, la blockchain permet une vérification publique et garantit l’intégrité des données.

---

#### Question 6

Stocker uniquement un hash permet de réduire les coûts et de protéger les données sensibles.
Cela permet également de conserver une preuve vérifiable sans exposer toutes les informations.

---

### Partie 4

#### Question 7

Docker permet de standardiser l’environnement de développement.
Il facilite le déploiement et garantit que l’application fonctionne de la même manière sur toutes les machines.

---

#### Question 8

frontend : interface utilisateur
backend : API Laravel
db : base de données PostgreSQL

---

### Partie 5

#### Question 9

Côté Laravel : création d’une route API pour récupérer les certificats
Côté Next.js : appel de l’API avec fetch
Côté affichage : affichage des données dans une liste

---

#### Question 10

PostgreSQL permet de stocker les données efficacement mais ne garantit pas leur intégrité publique.
La blockchain permet d’ajouter une preuve infalsifiable et une transparence.
Les deux technologies sont complémentaires.

---

## Conclusion

Ce projet montre la mise en place d’une architecture moderne combinant Web2 et Web3, avec une séparation claire entre frontend, backend et base de données.
