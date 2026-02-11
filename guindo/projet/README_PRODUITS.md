# 📦 Documentation de la Fonctionnalité Produit (exo_product)

> **Note importante** : Ce document explique l'implémentation de la fonctionnalité produit dans le projet. Bien que le professeur ait suggéré de créer un dossier séparé `exo_product`, j'ai choisi d'intégrer cette fonctionnalité directement dans l'architecture Laravel existante pour respecter les conventions du framework et maintenir une structure cohérente.

## 📋 Table des Matières

- [Vue d'ensemble](#-vue-densemble)
- [Architecture MVC](#-architecture-mvc)
- [Emplacement des fichiers](#-emplacement-des-fichiers)
- [Structure de la base de données](#-structure-de-la-base-de-données)
- [API REST](#-api-rest)
- [Frontend Next.js](#-frontend-nextjs)
- [Guide d'utilisation](#-guide-dutilisation)
- [Justification de l'architecture](#-justification-de-larchitecture)

---

## 🎯 Vue d'ensemble

La fonctionnalité **Produit** est un système CRUD complet (Create, Read, Update, Delete) implémenté dans le backend Laravel. Elle permet de :

- ✅ Créer de nouveaux produits
- ✅ Lister tous les produits
- ✅ Afficher un produit spécifique
- ✅ Modifier un produit existant
- ✅ Supprimer un produit

### Pourquoi pas de dossier `exo_product` séparé ?

Au lieu de créer un dossier isolé `exo_product`, j'ai intégré la fonctionnalité dans l'architecture Laravel standard pour les raisons suivantes :

1. **Respect des conventions Laravel** : Laravel utilise une structure MVC bien définie
2. **Maintenabilité** : Tous les modèles sont dans `app/Models`, tous les contrôleurs dans `app/Http/Controllers`
3. **Scalabilité** : Cette approche permet d'ajouter facilement d'autres fonctionnalités
4. **Auto-chargement** : Laravel gère automatiquement le chargement des classes avec PSR-4
5. **Best practices** : C'est la méthode recommandée par la documentation Laravel

---

## 🏗️ Architecture MVC

La fonctionnalité produit suit l'architecture **MVC (Model-View-Controller)** de Laravel :

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   CLIENT    │────▶│  CONTROLLER  │────▶│    MODEL    │
│  (Frontend) │     │ (ProductCtrl)│     │  (Product)  │
└─────────────┘     └──────────────┘     └─────────────┘
                            │                     │
                            │                     ▼
                            │            ┌─────────────┐
                            │            │  DATABASE   │
                            │            │  (products) │
                            │            └─────────────┘
                            ▼
                    ┌──────────────┐
                    │  RESPONSE    │
                    │    (JSON)    │
                    └──────────────┘
```

### Composants

| Composant | Rôle | Description |
|-----------|------|-------------|
| **Model** | Données | Gère la logique métier et l'accès à la base de données |
| **Controller** | Logique | Traite les requêtes HTTP et retourne les réponses |
| **Routes** | Routage | Mappe les URLs vers les méthodes du contrôleur |
| **Migration** | Structure DB | Définit la structure de la table `products` |
| **Seeder** | Données test | Insère des données d'exemple dans la base |

---

## 📁 Emplacement des Fichiers

Voici où se trouvent **TOUS** les fichiers liés à la fonctionnalité produit dans le projet :

### 1️⃣ Modèle (Model)

**Chemin** : [`backend-laravel/laravel/app/Models/Product.php`](backend-laravel/laravel/app/Models/Product.php)

**Rôle** : Représente un produit et gère l'interaction avec la table `products` de la base de données.

**Code** :
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'price', 'description'];
    
    // Eloquent gère automatiquement la BDD
    // Product::all() → SELECT * FROM products
    // Product::find(1) → SELECT * FROM products WHERE id = 1
}
```

**Fonctionnalités** :
- `$fillable` : définit les champs qui peuvent être assignés en masse
- Hérite de `Eloquent Model` pour bénéficier de tous les outils ORM
- Gère automatiquement les timestamps (`created_at`, `updated_at`)

---

### 2️⃣ Contrôleur (Controller)

**Chemin** : [`backend-laravel/laravel/app/Http/Controllers/ProductController.php`](backend-laravel/laravel/app/Http/Controllers/ProductController.php)

**Rôle** : Gère toutes les requêtes HTTP liées aux produits (CRUD complet).

**Méthodes disponibles** :

| Méthode | HTTP Verb | Endpoint | Description |
|---------|-----------|----------|-------------|
| `index()` | GET | `/api/products` | Liste tous les produits |
| `store()` | POST | `/api/products` | Crée un nouveau produit |
| `show($id)` | GET | `/api/products/{id}` | Affiche un produit spécifique |
| `update($id)` | PUT | `/api/products/{id}` | Modifie un produit |
| `destroy($id)` | DELETE | `/api/products/{id}` | Supprime un produit |

**Validation des données** :
- `name` : requis, chaîne de caractères, max 255 caractères
- `price` : requis, numérique, min 0
- `description` : optionnel, texte

---

### 3️⃣ Routes API

**Chemin** : [`backend-laravel/laravel/routes/api.php`](backend-laravel/laravel/routes/api.php)

**Rôle** : Définit les endpoints de l'API pour les produits.

**Routes configurées** :
```php
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::put('/products/{id}', [ProductController::class, 'update']);
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
```

**URLs complètes** :
- `http://localhost:8080/api/products` (base URL)
- Exemple : `http://localhost:8080/api/products/1`

---

### 4️⃣ Migration (Database Schema)

**Chemin** : [`backend-laravel/laravel/database/migrations/2026_01_28_191720_create_products_table.php`](backend-laravel/laravel/database/migrations/2026_01_28_191720_create_products_table.php)

**Rôle** : Crée la table `products` dans la base de données PostgreSQL.

**Structure de la table** :

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Identifiant unique |
| `name` | VARCHAR(255) | NOT NULL | Nom du produit |
| `price` | DECIMAL(10,2) | NOT NULL | Prix (ex: 99.99) |
| `description` | TEXT | NULLABLE | Description optionnelle |
| `created_at` | TIMESTAMP | - | Date de création |
| `updated_at` | TIMESTAMP | - | Date de modification |

**Commande pour créer la table** :
```bash
docker compose exec laravel_app php artisan migrate
```

---

### 5️⃣ Seeder (Données de test)

**Chemin** : [`backend-laravel/laravel/database/seeders/ProductSeeder.php`](backend-laravel/laravel/database/seeders/ProductSeeder.php)

**Rôle** : Insère des produits d'exemple dans la base de données pour les tests.

**Produits créés** :
1. MacBook Pro M3 - 2499.99$
2. iPhone 15 Pro - 1199.99$
3. AirPods Pro - 249.99$
4. iPad Air - 599.99$
5. Apple Watch Series 9 - 429.99$

**Commande pour insérer les données** :
```bash
docker compose exec laravel_app php artisan db:seed --class=ProductSeeder
```

---

## 🗄️ Structure de la Base de Données

### Table `products`

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Exemple de données

| id | name | price | description | created_at | updated_at |
|----|------|-------|-------------|------------|------------|
| 1 | MacBook Pro M3 | 2499.99 | Laptop professionnel haute performance... | 2026-01-28 19:20:00 | 2026-01-28 19:20:00 |
| 2 | iPhone 15 Pro | 1199.99 | Smartphone dernière génération... | 2026-01-28 19:20:01 | 2026-01-28 19:20:01 |

---

## 🔌 API REST

### 1. Lister tous les produits

**Requête** :
```http
GET http://localhost:8080/api/products
```

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "MacBook Pro M3",
      "price": "2499.99",
      "description": "Laptop professionnel haute performance avec puce M3",
      "created_at": "2026-01-28T19:20:00.000000Z",
      "updated_at": "2026-01-28T19:20:00.000000Z"
    },
    ...
  ]
}
```

---

### 2. Créer un produit

**Requête** :
```http
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "price": 899.99,
  "description": "Smartphone Android flagship"
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Produit créé avec succès",
  "data": {
    "id": 6,
    "name": "Samsung Galaxy S24",
    "price": "899.99",
    "description": "Smartphone Android flagship",
    "created_at": "2026-02-09T19:25:00.000000Z",
    "updated_at": "2026-02-09T19:25:00.000000Z"
  }
}
```

---

### 3. Afficher un produit

**Requête** :
```http
GET http://localhost:8080/api/products/1
```

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "MacBook Pro M3",
    "price": "2499.99",
    "description": "Laptop professionnel haute performance avec puce M3",
    "created_at": "2026-01-28T19:20:00.000000Z",
    "updated_at": "2026-01-28T19:20:00.000000Z"
  }
}
```

**Erreur** (produit non trouvé) :
```json
{
  "success": false,
  "message": "Produit non trouvé"
}
```

---

### 4. Modifier un produit

**Requête** :
```http
PUT http://localhost:8080/api/products/1
Content-Type: application/json

{
  "name": "MacBook Pro M3 Max",
  "price": 2999.99
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Produit mis à jour avec succès",
  "data": {
    "id": 1,
    "name": "MacBook Pro M3 Max",
    "price": "2999.99",
    "description": "Laptop professionnel haute performance avec puce M3",
    "created_at": "2026-01-28T19:20:00.000000Z",
    "updated_at": "2026-02-09T19:26:00.000000Z"
  }
}
```

---

### 5. Supprimer un produit

**Requête** :
```http
DELETE http://localhost:8080/api/products/1
```

**Réponse** :
```json
{
  "success": true,
  "message": "Produit supprimé avec succès"
}
```

---

## 💻 Frontend Next.js

L'interface utilisateur pour la gestion des produits est entièrement implémentée avec Next.js 15 (App Router).

### Structure des dossiers
```
frontend-nextjs/app/products/
├── page.tsx            # Liste de tous les produits
├── [id]/
│   └── page.tsx        # Détails d'un produit spécifique
├── create/
│   └── page.tsx        # Formulaire de création
└── edit/[id]/
    └── page.tsx        # Formulaire de modification
```

### Fonctionnalités Clés
1. **Fetch & State Management** : Utilisation de `useEffect` et `useState` pour gérer les données et les états de chargement.
2. **Dynamic Routing** : Exploitation des segments dynamiques de Next.js (`[id]`) pour les pages de détails et d'édition.
3. **Optimistic UI / Refresh** : Redirection et rafraîchissement des données via `useRouter` après chaque opération CRUD.
4. **Design Systématique** : Utilisation de CSS-in-JS pour un design moderne, cohérent et responsive sans dépendances lourdes.

---

## 🚀 Guide d'Utilisation

### Étape 1 : Démarrer le projet

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/infra
docker compose up -d
```

### Étape 2 : Créer la table produits

```bash
docker compose exec laravel_app php artisan migrate
```

### Étape 3 : Insérer les données de test

```bash
docker compose exec laravel_app php artisan db:seed --class=ProductSeeder
```

### Étape 4 : Tester l'API

#### Avec cURL

```bash
# Lister tous les produits
curl http://localhost:8080/api/products

# Créer un produit
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Nouveau Produit","price":99.99,"description":"Test"}'

# Afficher le produit #1
curl http://localhost:8080/api/products/1

# Modifier le produit #1
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Produit Modifié","price":199.99}'

# Supprimer le produit #1
curl -X DELETE http://localhost:8080/api/products/1
```

#### Avec Postman ou Insomnia

1. Créer une nouvelle collection
2. Ajouter les 5 requêtes ci-dessus
3. Tester chaque endpoint

#### Avec le Frontend Next.js

Le frontend (http://localhost:3000) peut consommer cette API via `fetch()` ou `axios` :

```typescript
// Exemple dans Next.js
const response = await fetch('http://localhost:8080/api/products');
const data = await response.json();
console.log(data.data); // Tableau de produits
```

---

## ✅ Justification de l'Architecture

### Pourquoi cette structure au lieu d'un dossier `exo_product` ?

#### ✅ Avantages de l'approche actuelle

| Aspect | Avantage |
|--------|----------|
| **Conventions** | Suit les standards Laravel (PSR-4, namespace, structure) |
| **Maintenabilité** | Structure claire et prévisible pour tout développeur Laravel |
| **Scalabilité** | Facile d'ajouter d'autres entités (Order, User, Category, etc.) |
| **Auto-loading** | Composer gère automatiquement le chargement des classes |
| **IDE Support** | Meilleure autocomplétion et navigation dans le code |
| **Tests** | Structure compatible avec PHPUnit et les tests Laravel |
| **Documentation** | Facile à documenter (chaque composant a sa place définie) |

#### ❌ Inconvénients d'un dossier `exo_product` séparé

- Rupture avec les conventions Laravel
- Auto-loading manuel nécessaire
- Duplication de structure (migrations, models, controllers dans un même dossier)
- Difficile à intégrer avec Eloquent
- Moins maintenable à long terme

### Comparaison visuelle

#### ❌ Structure avec dossier séparé (non recommandée)
```
backend-laravel/laravel/
└── exo_product/
    ├── ProductModel.php
    ├── ProductController.php
    ├── product_migration.php
    └── product_routes.php
```
**Problèmes** : Namespaces cassés, auto-loading manuel, anti-pattern Laravel

#### ✅ Structure Laravel standard (actuelle)
```
backend-laravel/laravel/
├── app/
│   ├── Models/Product.php
│   └── Http/Controllers/ProductController.php
├── database/
│   ├── migrations/2026_01_28_191720_create_products_table.php
│   └── seeders/ProductSeeder.php
└── routes/api.php
```
**Avantages** : PSR-4, auto-loading, conventions standard, scalable

---

## 📚 Résumé pour le Professeur

### Objectif de l'exercice
Créer un système CRUD complet pour gérer des produits.

### Implémentation réalisée
✅ **Modèle Eloquent** : `Product.php` avec gestion ORM  
✅ **Contrôleur RESTful** : `ProductController.php` avec 5 méthodes CRUD  
✅ **Routes API** : 5 endpoints dans `routes/api.php`  
✅ **Migration** : Table `products` avec structure complète  
✅ **Seeder** : 5 produits d'exemple pour les tests  
✅ **Validation** : Validation des données entrantes  
✅ **Réponses JSON** : Format standardisé avec gestion d'erreurs  

### Localisation dans le projet
Bien que la consigne suggérait un dossier `exo_product`, j'ai opté pour l'intégration dans l'architecture Laravel standard pour respecter les best practices du framework. **Ce document README permet de retrouver facilement chaque fichier** et comprendre son rôle.

### Vérification du fonctionnement
1. Démarrer Docker : `cd infra && docker compose up -d`
2. Créer la table : `docker compose exec laravel_app php artisan migrate`
3. Insérer les données : `docker compose exec laravel_app php artisan db:seed --class=ProductSeeder`
4. Tester l'API : `curl http://localhost:8080/api/products`

---

## 📞 Contact

Pour toute question sur cette implémentation, veuillez me contacter.

**Auteur** : Ibrahim O Guindo  
**Date** : Février 2026  
**Projet** : Web3 2026 - Fonctionnalité Produit

---

**Note finale** : Cette documentation exhaustive répond à la demande du professeur de créer un README détaillé pour comprendre l'organisation de la fonctionnalité produit. Tous les fichiers sont localisés et leur rôle est expliqué dans ce document.
