# CertiChain – Évaluation Web3

## Informations étudiant

* **Nom :** Salomon
* **Prénom :** Rudy
* **Numéro étudiant :** 22401895
* **Date :** 01/04/2026

---

## Partie 1 – Compréhension de l'architecture

### Question 1 – Rôle des technologies
Next.js :
Framework utilisé pour construire l’interface utilisateur.
Il permet de créer des pages dynamiques, gérer le rendu côté serveur et communiquer avec une API backend.
Laravel :
Framework PHP utilisé pour développer l’API backend.
Il gère la logique métier, les routes, la validation des données et les interactions avec la base de données.
PostgreSQL :
Système de gestion de base de données relationnelle.
DAns le cas de ce projet il sert à stocker les certificats de manière fiable et sécurisée.
Docker :
Outil de conteneurisation permettant de créer des environnements isolés.
Il facilite le déploiement et garantit que l’application fonctionne de la même manière sur toutes les machines.

### Question 2 – Architecture de l'application
Interface utilisateur : Next.js
Logique métier : Laravel
Stockage des données : PostgreSQL

Communication :
Next.js envoie des requêtes HTTP (API REST) vers Laravel.
Laravel traite les requêtes, interagit avec PostgreSQL, puis renvoie les données en JSON au frontend.

---

## Partie 2 – Modélisation fonctionnelle

### Question 3 – Table PostgreSQL

Table : certificates

Colonne            ; Type

id                 ; SERIAL
student_name       ; VARCHAR
certification_name ; VARCHAR
issued_at          ; DATE
blockchain_hash    ; VARCHAR

Clé primaire : id

### Question 4 – Routes API Laravel

1. Créer un certificat
Méthode : POST
URL : `/api/certificates`
Rôle : Ajouter un nouveau certificat dans la base de données

2. Récupérer les certificats
Méthode : GET
URL : `/api/certificates`
Rôle : Retourner la liste de tous les certificats

---

## Partie 3 – Docker et déploiement local

### Question 5 – Intérêt de Docker

Docker ^permet d’avoir un environnement identique pour tous les développeurs.
Facilite le déploiement et la configuration comme toutes les dépendances sont incluses dans les conteneurs).

### Question 6 – Services Docker

Frontend avec Next.js pour l'interface utilisateur
Backend avec Laravel pour l'API et la logique métier
Base de donnée avec PostgreSQL pour stocker les données

---

## Partie 4 – Exercice pratique

### Question 7 – Affichage Next.js ↔ Laravel

**Côté Laravel :**
Créer une route GET `/api/certificates`
Dans un contrôleur, récupérer les certificats depuis la base
Retourner les données en JSON

```php
public function index() {
    return response()->json(Certificate::all());
}
```

**Côté Next.js :**
Faire une requête fetch vers l’API Laravel

```javascript
export async function getServerSideProps() {
  const res = await fetch('http://localhost:8000/api/certificates');
  const data = await res.json();

  return { props: { certificates: data } };
}
```

**Côté affichage :**

```javascript
export default function Home({ certificates }) {
  return (
    <div>
      <h1>Liste des certificats</h1>
      <ul>
        {certificates.map(cert => (
          <li key={cert.id}>
            {cert.student_name} - {cert.certification_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Question 8 – PostgreSQL vs Blockchain

Je ne suis pas d’accord. PostgreSQL suffit pour stocker les données, mais il ne garantit pas leur immutabilité.
La blockchain apporte une preuve d’intégrité : une fois le certificat enregistré, il ne peut pas être modifié sans laisser de trace.
Dans CertiChain, PostgreSQL sert à gérer les données rapidement et efficacement, tandis que la blockchain sert à garantir l’authenticité des certificats.
Les deux technologies sont donc complémentaires je pense.