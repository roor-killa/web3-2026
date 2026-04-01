
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

GET http://localhost:8001/api/certificats  : retourne un json avec tous les certificats
POST http://localhost:8001/api/certificats : permet de creer les certificats

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Permet de facilement transferer des projects de PC a un autre, facilite le deploiment de projet, permet de regler les problemes de compabilité, permet d'enfermer le projet donc sa ne va pas affecter les autres

### Question 6 – Services Docker

    nginx : Permet de servir le frontend dans le port https 80
    postgres : Permet de stocker les informations 5434/5432
    nextjs : Permet de gerer/creer le frontend de l'application 
    laravel : Permet de gerer le backend dont les routes, models, appel base de donnée; controllers 8001/8000

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

côté Laravel
    On fait appel au route http://localhost:8001/api/certificats qui appel la base de donnée, prend les données et le retourne en format json 

côté Next.js 
    On fetch la donnée retournée par la route http://localhost:8001/api/certificats
    et on le stocke dans une variable useState 'certificats'

côté affichage
    On prend la variable 'certificats' puis on l'affiche utlisant .map qui permet de prendre chaque certfications/enfants et affiche ses données dans le tableau utilisant 
    <td>{certificats.{clé}}</td>


### Question 8 – PostgreSQL vs Blockchain

*Votre réponse ici...*