
Application CertiChain - Certificats Numeriques 


## Informations étudiant

- **Nom :** TOMA

- **Prénom :** Randi

- **Numéro étudiant :** <Votre numéro>

- **Date :** 01/04/2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies


Stack technologique 
Next.js : Frontend 
Laravel : Gerer la partie logique 
PostgreSQL : Va stocker les données
Docker : Permet de communiquer entre les differents composants
Nginx : Sa servir le frontend Next.js

### Question 2 – Architecture de l'application

Structure du projet :
    root
    |- backend : Laravel
    |-- fichiers laravel
    |-- Dockerfile
    |- frontend : Next.js
    |-- fichiers next.js
    |-- Dockerfile
    |- infra : 
    |-- docker-compose.yml
    |-|-nginx
    |-|-- default.conf

---

## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

  id: number; Clé primaire
  identifiant: string;
  nom_etudiant: string;
  intitule: string;
  date_emission: date;
  hash_blockchain: string;

### Question 4 – Routes API Laravel

*Votre réponse ici...*

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Permet de facilement transferer des projects de PC a un autre, facilite le deploiment de projet 

### Question 6 – Services Docker


---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

*Votre réponse ici...*

### Question 8 – PostgreSQL vs Blockchain

*Votre réponse ici...*