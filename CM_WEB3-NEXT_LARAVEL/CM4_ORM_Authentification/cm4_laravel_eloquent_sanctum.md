# CM3 - Eloquent ORM et Authentication avec Laravel Sanctum

## Informations du cours
- **Niveau:** L2 - Web3 (Backend Laravel)
- **Durée:** 4 heures (CM + TP)
- **Prérequis:** CM1 (Docker), CM2 (Structure Laravel)
- **Ratio:** 30% théorie / 70% pratique

---

## Objectifs pédagogiques

À l'issue de cette session, vous serez capable de:
1. Créer et gérer des migrations de base de données
2. Définir des modèles Eloquent avec leurs relations
3. Utiliser les relations entre modèles (One-to-Many, Many-to-Many, etc.)
4. Implémenter un système d'authentification avec Laravel Sanctum
5. Sécuriser une API REST avec des tokens

---

## Plan du cours

### Partie 1: Eloquent ORM (2h)
1. Introduction à Eloquent et aux migrations
2. Création de modèles et migrations
3. Relations entre modèles
4. Exercices pratiques progressifs

### Partie 2: Laravel Sanctum (2h)
1. Concept de l'authentication API
2. Installation et configuration de Sanctum
3. Endpoints d'authentification
4. Protection des routes API
5. Mini-projet intégré

---

# PARTIE 1: ELOQUENT ORM

## 1.1 Introduction à Eloquent

### Qu'est-ce qu'Eloquent?

Eloquent est l'ORM (Object-Relational Mapping) de Laravel qui permet de:
- Manipuler la base de données avec des objets PHP
- Éviter d'écrire du SQL directement
- Gérer les relations entre tables facilement
- Assurer la sécurité contre les injections SQL

**Exemple de comparaison SQL vs Eloquent:**

```php
// Avec du SQL brut
$users = DB::select('SELECT * FROM users WHERE active = 1');

// Avec Eloquent
$users = User::where('active', 1)->get();
```

### Les migrations: gérer le schéma de la base de données

Les migrations sont comme un "Git pour votre base de données":
- Versionnent la structure de la BDD
- Permettent de rollback des changements
- Facilitent le travail en équipe

---

## 1.2 Créer votre première migration et modèle

### Commandes essentielles

```bash
# Créer un modèle avec sa migration
php artisan make:model Product -m

# Créer uniquement une migration
php artisan make:migration create_products_table

# Exécuter les migrations
php artisan migrate

# Rollback de la dernière migration
php artisan migrate:rollback

# Reset complet et remigration
php artisan migrate:fresh
```

### Exemple pratique: Table Products

**Fichier de migration** `database/migrations/xxxx_create_products_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
            $table->string('name'); // VARCHAR(255)
            $table->text('description')->nullable();
            $table->decimal('price', 8, 2); // DECIMAL(8,2)
            $table->integer('stock')->default(0);
            $table->boolean('is_available')->default(true);
            $table->timestamps(); // created_at, updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

**Types de colonnes courants:**
- `string()` → VARCHAR(255)
- `text()` → TEXT
- `integer()` → INT
- `decimal(8, 2)` → DECIMAL avec précision
- `boolean()` → TINYINT(1)
- `date()`, `datetime()`, `timestamp()`
- `foreignId()` → Pour les clés étrangères

**Modificateurs:**
- `->nullable()` → Accepte NULL
- `->default(value)` → Valeur par défaut
- `->unique()` → Contrainte UNIQUE
- `->unsigned()` → Nombre positif uniquement

### Le modèle Product

**Fichier** `app/Models/Product.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Colonnes assignables en masse
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'is_available'
    ];

    // Casting automatique des types
    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
    ];
}
```

---

## 1.3 Utiliser Eloquent dans vos contrôleurs

### CRUD basique

```php
<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // CREATE - Créer un produit
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    // READ - Lister tous les produits
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // READ - Un seul produit
    public function show($id)
    {
        $product = Product::findOrFail($id); // 404 si introuvable
        return response()->json($product);
    }

    // UPDATE - Mettre à jour
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    // DELETE - Supprimer
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product deleted'], 200);
    }
}
```

### Requêtes avancées

```php
// WHERE avec conditions
$products = Product::where('price', '>', 100)
    ->where('is_available', true)
    ->get();

// ORDER BY
$products = Product::orderBy('price', 'desc')->get();

// LIMIT et OFFSET
$products = Product::take(10)->skip(20)->get();

// Pagination
$products = Product::paginate(15);

// Recherche
$products = Product::where('name', 'LIKE', "%$search%")->get();

// Comptage
$count = Product::where('stock', '>', 0)->count();

// Agrégation
$average = Product::avg('price');
$total = Product::sum('stock');
```

---

## 1.4 Relations entre modèles

### Relation One-to-Many: Catégories et Produits

**Migration: categories**

```php
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description')->nullable();
    $table->timestamps();
});
```

**Migration: Ajouter category_id à products**

```bash
php artisan make:migration add_category_id_to_products_table
```

```php
public function up(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->foreignId('category_id')
            ->nullable()
            ->constrained()
            ->onDelete('set null');
    });
}

public function down(): void
{
    Schema::table('products', function (Blueprint $table) {
        $table->dropForeign(['category_id']);
        $table->dropColumn('category_id');
    });
}
```

**Modèle Category:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description'];

    // Une catégorie a plusieurs produits
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
```

**Modèle Product (ajout):**

```php
class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'is_available',
        'category_id' // Ajout
    ];

    // Un produit appartient à une catégorie
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
```

**Utilisation:**

```php
// Récupérer tous les produits d'une catégorie
$category = Category::find(1);
$products = $category->products;

// Récupérer la catégorie d'un produit
$product = Product::find(1);
$categoryName = $product->category->name;

// Eager Loading (éviter le N+1 problem)
$products = Product::with('category')->get();

// Créer un produit dans une catégorie
$category = Category::find(1);
$category->products()->create([
    'name' => 'Nouveau produit',
    'price' => 99.99,
    'stock' => 10
]);
```

### Relation Many-to-Many: Produits et Tags

**Migrations:**

```php
// Tags
Schema::create('tags', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();
    $table->timestamps();
});

// Table pivot product_tag
Schema::create('product_tag', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_id')->constrained()->onDelete('cascade');
    $table->foreignId('tag_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

**Modèle Tag:**

```php
class Tag extends Model
{
    protected $fillable = ['name'];

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}
```

**Modèle Product (ajout):**

```php
class Product extends Model
{
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

**Utilisation:**

```php
// Attacher des tags à un produit
$product = Product::find(1);
$product->tags()->attach([1, 2, 3]); // IDs des tags

// Détacher
$product->tags()->detach([2]);

// Synchroniser (remplace tous les tags)
$product->tags()->sync([1, 3, 4]);

// Récupérer les tags d'un produit
$tags = $product->tags;

// Récupérer les produits d'un tag
$tag = Tag::find(1);
$products = $tag->products;
```

---

## 🛠️ EXERCICE PRATIQUE 1 (45 min)

### Contexte: Système de gestion d'événements campus

Créez une API pour gérer les événements du campus avec:
- Des événements (Event)
- Des catégories d'événements (EventCategory)
- Des participants (User - déjà existant)

### Étapes:

1. **Créer les modèles et migrations:**
   - EventCategory (name, description)
   - Event (title, description, date, location, max_participants, category_id)
   - Table pivot event_user (event_id, user_id, registered_at)

2. **Définir les relations:**
   - Une catégorie a plusieurs événements
   - Un événement appartient à une catégorie
   - Un événement a plusieurs participants (Many-to-Many avec User)

3. **Créer un contrôleur EventController avec:**
   - `index()`: Liste tous les événements avec leurs catégories
   - `store()`: Créer un événement
   - `show($id)`: Afficher un événement avec ses participants
   - `register($eventId)`: Inscrire l'utilisateur authentifié à un événement

4. **Routes dans `routes/api.php`:**
   ```php
   Route::get('/events', [EventController::class, 'index']);
   Route::post('/events', [EventController::class, 'store']);
   Route::get('/events/{id}', [EventController::class, 'show']);
   Route::post('/events/{id}/register', [EventController::class, 'register']);
   ```

### Solution attendue (à faire en groupe):

Chaque groupe travaille sur une branche Git dédiée. Vous devrez:
- Créer les migrations correctement
- Implémenter les relations Eloquent
- Valider les données entrantes
- Tester avec Postman/Thunder Client

---

# PARTIE 2: LARAVEL SANCTUM

## 2.1 Introduction à l'authentication API

### Différence entre Session et Token

**Authentication par session (web classique):**
- Cookie de session stocké côté client
- État maintenu côté serveur
- Parfait pour les applications monolithiques

**Authentication par token (API):**
- Token envoyé dans les headers HTTP
- Stateless (sans état serveur)
- Idéal pour les SPA, mobile apps, APIs publiques

### Pourquoi Laravel Sanctum?

Sanctum est la solution officielle Laravel pour:
- ✅ Authentification d'API simples et sécurisées
- ✅ SPA (Single Page Applications) et applications mobiles
- ✅ Gestion de tokens multiples (différents appareils)
- ✅ Révocation de tokens
- ✅ Permissions par token (scopes)

---

## 2.2 Installation et configuration

### Étape 1: Installer Sanctum

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Étape 2: Configuration du modèle User

**Fichier `app/Models/User.php`:**

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens; // ← IMPORTANT

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}
```

### Étape 3: Middleware API

**Fichier `app/Http/Kernel.php` ou `bootstrap/app.php` (Laravel 11+):**

Vérifiez que le middleware `auth:sanctum` est disponible:

```php
// Dans config si Laravel 10
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

---

## 2.3 Créer les endpoints d'authentification

### Contrôleur AuthController

```bash
php artisan make:controller AuthController
```

**Fichier `app/Http/Controllers/AuthController.php`:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Inscription d'un nouvel utilisateur
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    /**
     * Connexion d'un utilisateur
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        // Supprimer les anciens tokens (optionnel)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    /**
     * Déconnexion (révocation du token actuel)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Informations de l'utilisateur connecté
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
```

### Routes API

**Fichier `routes/api.php`:**

```php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Routes publiques (sans authentification)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées (nécessitent un token valide)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Vos routes de ressources
    Route::apiResource('products', ProductController::class);
});
```

---

## 2.4 Tester l'authentification

### Avec Postman/Thunder Client

**1. Register (Inscription):**

```http
POST http://localhost:8000/api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Réponse:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "access_token": "1|abcdef123456...",
  "token_type": "Bearer"
}
```

**2. Login (Connexion):**

```http
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**3. Accéder à une route protégée:**

```http
GET http://localhost:8000/api/products
Authorization: Bearer 1|abcdef123456...
```

**4. Obtenir les infos utilisateur:**

```http
GET http://localhost:8000/api/user
Authorization: Bearer 1|abcdef123456...
```

**5. Logout (Déconnexion):**

```http
POST http://localhost:8000/api/logout
Authorization: Bearer 1|abcdef123456...
```

---

## 2.5 Gestion avancée des tokens

### Tokens avec permissions (scopes)

```php
// Créer un token avec des permissions spécifiques
$token = $user->createToken('mobile-app', ['products:read', 'orders:create'])->plainTextToken;

// Vérifier les permissions dans le contrôleur
if ($request->user()->tokenCan('products:delete')) {
    // Autoriser la suppression
}
```

### Expiration des tokens

**Fichier `config/sanctum.php`:**

```php
'expiration' => 60 * 24, // 24 heures
```

### Révoquer tous les tokens d'un utilisateur

```php
$user->tokens()->delete();
```

---

## 🛠️ EXERCICE PRATIQUE 2 (60 min)

### Mini-projet: API d'événements avec authentification

**Objectif:** Créer une API complète pour le système d'événements avec Sanctum.

### Fonctionnalités à implémenter:

1. **Authentication:**
   - Inscription
   - Connexion
   - Déconnexion
   - Profil utilisateur

2. **Events (routes protégées):**
   - Lister les événements (accessible à tous les utilisateurs connectés)
   - Créer un événement (seulement les admins - utilisez un champ `is_admin` dans users)
   - S'inscrire à un événement
   - Voir ses inscriptions

3. **Validation et règles métier:**
   - Un utilisateur ne peut pas s'inscrire 2 fois au même événement
   - Vérifier que l'événement n'est pas complet (max_participants)
   - L'événement doit être dans le futur

### Structure attendue:

```php
// Routes publiques
POST /api/register
POST /api/login

// Routes authentifiées
POST /api/logout
GET /api/user
GET /api/events
GET /api/events/{id}
POST /api/events/{id}/register
DELETE /api/events/{id}/unregister
GET /api/my-events

// Routes admin uniquement
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
```

### Middleware pour vérifier si admin:

```bash
php artisan make:middleware IsAdmin
```

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}
```

**Enregistrer dans `bootstrap/app.php` ou `Kernel.php`:**

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\IsAdmin::class,
    ]);
})
```

**Utilisation:**

```php
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
});
```

---

## 📚 Ressources et documentation

### Documentation officielle:
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Migrations](https://laravel.com/docs/migrations)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)

### Commandes utiles:

```bash
# Eloquent & Migrations
php artisan make:model ModelName -m
php artisan make:migration create_table_name
php artisan migrate
php artisan migrate:rollback
php artisan migrate:fresh --seed

# Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Controllers
php artisan make:controller ControllerName
php artisan make:controller ControllerName --resource --api

# Middleware
php artisan make:middleware MiddlewareName
```

---

## ✅ Checklist de compétences acquises

À la fin de ce CM, vous devriez être capable de:

- [ ] Créer des migrations avec différents types de colonnes
- [ ] Définir des modèles Eloquent avec fillable et casts
- [ ] Utiliser les méthodes CRUD d'Eloquent (create, find, update, delete)
- [ ] Créer des relations One-to-Many entre modèles
- [ ] Créer des relations Many-to-Many avec tables pivot
- [ ] Utiliser Eager Loading pour optimiser les requêtes
- [ ] Installer et configurer Laravel Sanctum
- [ ] Créer des endpoints d'inscription et connexion
- [ ] Protéger des routes avec le middleware auth:sanctum
- [ ] Gérer les tokens d'authentification
- [ ] Créer des middlewares personnalisés
- [ ] Tester une API avec Postman/Thunder Client

---

## 🎯 Projet de groupe (à continuer)

### Thème: Plateforme entrepreneuriale du campus

Chaque groupe continue de développer son module avec Eloquent et Sanctum:

**Groupe 1:** Gestion des événements
**Groupe 2:** Marketplace de produits étudiants
**Groupe 3:** Réservation de salles/ressources
**Groupe 4:** Forum d'entraide et tutorat

### Livrables pour la prochaine session:
1. Modèles avec relations fonctionnels
2. API avec authentication Sanctum
3. Documentation Postman de vos endpoints
4. Code sur votre branche Git avec PR vers develop

---

## 📝 Évaluation continue (40% de la note)

**Critères:**
- Qualité des migrations et relations (25%)
- Implémentation correcte de Sanctum (25%)
- Validation des données (20%)
- Qualité du code et commentaires (15%)
- Documentation API (15%)

**Note:** Tout code copié d'une IA doit être expliqué ligne par ligne lors de la défense.

---

Bon courage! 🚀