# CertiChain - Evaluation Web3

## Informations etudiant
- **Nom :** SADI
- **Prenom :** MOHAND
- **Date :** 01/04/2026

---

## Partie 1 - Comprehension de l'architecture

### Question 1 - Role des technologies

#### Nexe.js
Next.js est un framework Frontend basé sur React.
Il sert à construire l’interface utilisateur de l’application.

Dans ce projet a pour but d’afficher les certificats et de permettre aux utilisateurs d’interagir avec le système.

#### Laravel
Laravel est un framework PHP pour le backend.
Il permet de gérer la logique métier et d'exposer des API.
Dans ce projet, il a pour but de traiter les données des certificats et de communiquer avec la base de données.

#### PostgreSQL
PostgreSQL est un système de gestion de bases de données relationnelles.
Il permet de stocker les données de façon structurée.
Ce projet stocke les informations des certificats (nom, date, hash, etc.).

#### Docker
Docker est un outil de **conteneurisation**.
Il permet de créer un environnement de développement isolé et reproductible.
Dans ce projet, il facilite le déploiement et permet de lancer facilement le frontend, le backend et la base de données.

### Question 2 - Application architecture
L’application CertiChain se compose de trois parties principales :


Next.js s’occupe de l’interface utilisateur,  (frontend). Il permet aux utilisateurs de lire les certificats.
Laravel gère la logique métier (backend) et expose des API pour créer et récupérer les certificats.
PostgreSQL conserve dans une base de données les données des certificats.

Le frontend Next.js échange avec le backend Laravel à travers des requêtes HTTP (API REST).
Le backend Laravel utilise PostgreSQL pour stocker et lire les données.
---

## Partie 2 - Modelisation fonctionnelle

### Question 3 - Table PostgreSQL

```sql
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    student_name VARCHAR(255),
    certification_title VARCHAR(255),
    issue_date DATE,
    blockchain_hash VARCHAR(255)
);
```

- id : identifiant unique du certificat (cle primaire)
- student_name : nom de l’étudiant
- certification_title : titre de la certification
- issue_date : date de délivrance 
- blockchain_hash : hash du certificat sur la blockchain

### Question 4 - Routes API Laravel

#### Route 1 - Creer un certificat
- Methode HTTP : POST
- URL : /api/certificates
- Role : cette route permet de creer un nouveau certificat en envoyant les donnees (nom, certification, date, hash) au serveur.

#### Route 2 - Recuperer les certificats
- Methode HTTP : GET
- URL : /api/certificates
- Role : cette route permet d'obtenir la liste de tous les certificats stockés dans la base de données.

---

## Partie 3 - Docker et deploiement local

### Question 5 - Docker’s Benefit
Docker permet de créer un environnement de développement isolé et reproductible.
Il évite les problèmes dus aux différences de configuration entre les machines.

Il permet également de déployer plus facilement l'application en regroupant tous les services (frontend, backend, base de données) dans des conteneurs.

Enfin, Docker permet de lancer simplement tous les services du projet avec une seule commande.

#### Question 6 — Docker services
Dans ce projet, on peut déployer plusieurs services Docker :

- Frontend (Next.js) : Affiche l'interface utilisateur et gère les interactions côté client.
- Backend (Laravel) : gère la logique métier et expose les API de gestion des certificats.
- Base de données (PostgreSQL) : stockage des informations des certificats.
- Serveur web (Nginx ou Apache) : héberge l'application et traite les requêtes HTTP.

---

## Partie 4 - Exercice pratique

### Question 7 - Affichage Next.js <-> Laravel

#### Cote Laravel
En Laravel, on définit une route API qui renvoie la liste des certificats depuis la base de données.

```php
Route::get('/certificates', [CertificateController::class, 'index']);
```

Dans le controleur :

```php
public function index() {
    return response()->json(Certificate::all());
}
```

Cette API sert à transmettre les données des certificats vers le frontend.

#### Cote Next.js
Dans Next.js, on obtient les données à partir de l'API Laravel à travers une requête HTTP.

```tsx
import { useEffect, useState } from 'react';

export default function Home() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/certificates')
      .then(res => res.json())
      .then(data => setCertificates(data));
  }, []);
```

#### Cote affichage
On affiche ensuite les certificats dans la page :

```tsx
  return (
    <div>
      <h1>Liste des certificats</h1>
      <ul>
        {certificates.map(cert => (
          <li key={cert.id}>
            {cert.student_name} - {cert.certification_title}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

De ce fait, la page présente de manière dynamique la liste des certificats récupérés à partir de Laravel.

### Question 8 - PostgreSQL vs Blockchain
Je ne suis pas totalement d'accord avec cette affirmation.
PostgreSQL offre la possibilité de conserver les données de façon efficace et rapide, ce qui est adéquat pour la gestion des certificats.
Toutefois, la blockchain offre un bénéfice majeur : l'inaltérabilité des données. Après l'enregistrement d'un certificat sur la blockchain, il est impossible de le modifier, ce qui assure sa véracité.
Un administrateur peut apporter des modifications à PostgreSQL, alors que la blockchain procure une sécurité et une transparence supérieures.
Ainsi, PostgreSQL est bénéfique pour le stockage, cependant la blockchain est essentielle pour assurer la fiabilité et la validation des certificats.
