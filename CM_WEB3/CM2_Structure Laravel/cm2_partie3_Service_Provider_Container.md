# Cours Laravel L2 - Détails des Sessions

## 2. Structure Laravel (40 min)

---

### 🎯 Partie 3 : Service Providers et Container (13 min)

#### Concept du Container IoC (5 min)

**Analogie simple :**
*"Le Service Container est comme un gestionnaire de dépendances automatique. Au lieu de créer manuellement tous vos objets, Laravel le fait pour vous."*

```php
// ❌ SANS Container (ancien style)
class ProductController
{
    public function index()
    {
        $db = new Database('localhost', 'user', 'pass');
        $productRepo = new ProductRepository($db);
        $products = $productRepo->getAll();
    }
}

// ✅ AVEC Container (Laravel)
class ProductController
{
    public function index(ProductRepository $repo)
    {
        // Laravel injecte automatiquement $repo
        $products = $repo->getAll();
    }
}
```

#### Service Providers : Les configurateurs (5 min)

**Les providers configurent les services au démarrage de l'application.**

```php
// app/Providers/AppServiceProvider.php
class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Enregistrer des services dans le container
        $this->app->bind(PaymentInterface::class, StripePayment::class);
    }
    
    public function boot()
    {
        // Code exécuté quand l'app démarre
        // Ex: partager des données avec toutes les vues
    }
}
```

**Exemple pratique pour votre projet :**
```php
// Définir un service de paiement
interface PaymentInterface {
    public function charge($amount);
}

// Dans AppServiceProvider
public function register()
{
    $this->app->bind(PaymentInterface::class, function() {
        if (config('app.env') === 'testing') {
            return new FakePayment();
        }
        return new StripePayment();
    });
}

// Dans votre controller
class OrderController
{
    public function __construct(private PaymentInterface $payment) {}
    
    public function checkout()
    {
        // Laravel injecte automatiquement le bon service
        $this->payment->charge(100);
    }
}
```

#### Points clés pour L2 (3 min)

**Ce qu'il faut retenir :**
1. **Le Container** = gestionnaire automatique d'objets
2. **Les Providers** = configurent l'application au démarrage
3. **L'injection de dépendances** = Laravel crée automatiquement vos objets

**Pour l'instant, vous allez surtout :**
- Utiliser les providers existants
- Peut-être modifier `AppServiceProvider` pour des configs simples
- Le Container travaille en arrière-plan pour vous

---

### ✅ Récapitulatif & Questions (5 min)

**Quiz rapide :**
1. Où créer un nouveau contrôleur ? → `app/Http/Controllers/`
2. Quel fichier pour les routes API ? → `routes/api.php`
3. Que fait un Model ? → Interagit avec la base de données
4. À quoi sert le Service Container ? → Injection automatique de dépendances

---

## 3. Routes API (50 min)

### 📋 Objectifs d'apprentissage
- Créer des routes RESTful complètes
- Comprendre la différence entre routes web et API
- Implémenter la validation des requêtes
- Organiser les routes avec groupes et préfixes

---

### 🎯 Partie 1 : Web vs API (8 min)

#### Différences fondamentales

| Aspect | routes/web.php | routes/api.php |
|--------|---------------|---------------|
| **Middleware** | web (sessions, CSRF) | api (throttle, stateless) |
| **Préfixe** | / | /api/ |
| **Retour** | HTML (views) | JSON |
| **State** | Avec session | Sans état (token) |
| **Usage** | Pages web | Applications mobiles, SPA |

#### Exemples côte à côte

```php
// routes/web.php - Pour un site web classique
Route::get('/products', function () {
    $products = Product::all();
    return view('products.index', compact('products'));
});
// URL: http://monsite.com/products
// Retourne: une page HTML

// routes/api.php - Pour une API
Route::get('/products', function () {
    $products = Product::all();
    return response()->json($products);
});
// URL: http://monsite.com/api/products
// Retourne: {"data": [{...}]}
```

#### Quand utiliser quoi ?

```
┌─────────────────────────────────────┐
│  Votre application NextJS           │
│  (Front-end sur Netlify)            │
└───────────┬─────────────────────────┘
            │
            │ fetch('/api/products')
            │
            ▼
┌─────────────────────────────────────┐
│  Laravel API (routes/api.php)       │
│  (Back-end sur votre serveur)       │
└─────────────────────────────────────┘
```

*"Pour votre projet, vous allez UNIQUEMENT utiliser `routes/api.php` car NextJS consomme une API JSON."*

---

### 🎯 Partie 2 : Les verbes HTTP et routes RESTful (15 min)

#### Les 4 opérations CRUD

| Opération | Verbe HTTP | Route | Action |
|-----------|------------|-------|--------|
| **C**reate | POST | /products | Créer un produit |
| **R**ead | GET | /products | Lister tous |
| **R**ead | GET | /products/{id} | Voir un produit |
| **U**pdate | PUT/PATCH | /products/{id} | Modifier |
| **D**elete | DELETE | /products/{id} | Supprimer |

#### Implémentation complète

```php
// routes/api.php

// 1. LIRE tous les produits
Route::get('/products', [ProductController::class, 'index']);

// 2. LIRE un produit spécifique
Route::get('/products/{id}', [ProductController::class, 'show']);

// 3. CRÉER un nouveau produit
Route::post('/products', [ProductController::class, 'store']);

// 4. MODIFIER un produit
Route::put('/products/{id}', [ProductController::class, 'update']);

// 5. SUPPRIMER un produit
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ✨ RACCOURCI : Laravel peut générer tout ça automatiquement
Route::apiResource('products', ProductController::class);
```

#### Le contrôleur correspondant

```php
// app/Http/Controllers/ProductController.php

class ProductController extends Controller
{
    // GET /api/products
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }
    
    // GET /api/products/5
    public function show($id)
    {
        $product = Product::findOrFail($id);
        // findOrFail = retourne 404 si non trouvé
        return response()->json($product);
    }
    
    // POST /api/products
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);
        
        $product = Product::create($validated);
        
        return response()->json($product, 201); // 201 = Created
    }
    
    // PUT /api/products/5
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string'
        ]);
        
        $product->update($validated);
        
        return response()->json($product);
    }
    
    // DELETE /api/products/5
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        
        return response()->json(null, 204); // 204 = No Content
    }
}
```

#### Codes de statut HTTP importants

```php
return response()->json($data, 200);  // ✅ OK
return response()->json($data, 201);  // ✅ Created
return response()->json(null, 204);   // ✅ No Content (après DELETE)
return response()->json($error, 400); // ❌ Bad Request
return response()->json($error, 404); // ❌ Not Found
return response()->json($error, 422); // ❌ Validation Error
return response()->json($error, 500); // ❌ Server Error
```

---

### 🎯 Partie 3 : Organisation avancée (12 min)

#### Groupes de routes avec préfixes

```php
// Regrouper des routes similaires
Route::prefix('v1')->group(function () {
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('orders', OrderController::class);
});

// URLs générées:
// /api/v1/products
// /api/v1/categories
// /api/v1/orders
```

#### Middleware sur groupes

```php
// Protéger plusieurs routes à la fois
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

// Accessible sans authentification
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
```

#### Nommage des routes

```php
Route::get('/products', [ProductController::class, 'index'])
    ->name('products.index');

Route::get('/products/{id}', [ProductController::class, 'show'])
    ->name('products.show');

// Utilisation dans le code
return redirect()->route('products.show', ['id' => 1]);
// Génère: /api/products/1
```

#### Organisation pour un gros projet

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    
    // Routes publiques
    Route::prefix('public')->group(function () {
        Route::get('/products', [ProductController::class, 'index']);
        Route::get('/categories', [CategoryController::class, 'index']);
    });
    
    // Routes authentifiées
    Route::middleware('auth:sanctum')->group(function () {
        
        // Routes admin
        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::apiResource('products', ProductController::class)
                ->except(['index', 'show']);
            Route::apiResource('users', UserController::class);
        });
        
        // Routes utilisateur
        Route::prefix('user')->group(function () {
            Route::get('/orders', [OrderController::class, 'index']);
            Route::post('/orders', [OrderController::class, 'store']);
        });
    });
});
```

---

### 🎯 Partie 4 : Paramètres et validation (10 min)

#### Types de paramètres

```php
// 1. Paramètres d'URL (Route Parameters)
Route::get('/products/{id}', function ($id) {
    return "Produit #$id";
});

// 2. Paramètres optionnels
Route::get('/products/{category?}', function ($category = null) {
    if ($category) {
        return "Catégorie: $category";
    }
    return "Tous les produits";
});

// 3. Contraintes sur paramètres
Route::get('/products/{id}', function ($id) {
    //...
})->where('id', '[0-9]+'); // Uniquement des chiffres

// 4. Paramètres multiples
Route::get('/categories/{category}/products/{id}', function ($category, $id) {
    return "Produit #$id dans catégorie $category";
});
```

#### Query Parameters (dans l'URL)

```php
// URL: /api/products?search=laptop&min_price=500&sort=price

Route::get('/products', function (Request $request) {
    $search = $request->query('search');
    $minPrice = $request->query('min_price', 0); // Valeur par défaut: 0
    $sort = $request->query('sort', 'name');
    
    $products = Product::query();
    
    if ($search) {
        $products->where('name', 'like', "%$search%");
    }
    
    if ($minPrice) {
        $products->where('price', '>=', $minPrice);
    }
    
    $products->orderBy($sort);
    
    return response()->json($products->get());
});
```

#### Validation avancée

```php
// Créer une Form Request pour validation réutilisable
php artisan make:request StoreProductRequest

// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize()
    {
        return true; // ou logique d'autorisation
    }
    
    public function rules()
    {
        return [
            'name' => 'required|string|max:255|unique:products',
            'price' => 'required|numeric|min:0|max:999999.99',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'image|max:2048', // Max 2MB par image
            'stock' => 'required|integer|min:0',
            'description' => 'nullable|string|max:1000',
        ];
    }
    
    public function messages()
    {
        return [
            'name.required' => 'Le nom du produit est obligatoire',
            'name.unique' => 'Ce produit existe déjà',
            'price.min' => 'Le prix ne peut pas être négatif',
            'category_id.exists' => 'Cette catégorie n\'existe pas',
        ];
    }
}

// Dans le contrôleur
public function store(StoreProductRequest $request)
{
    // Si on arrive ici, les données sont valides !
    $product = Product::create($request->validated());
    return response()->json($product, 201);
}
```

#### Règles de validation courantes

```php
'required'              // Obligatoire
'nullable'              // Peut être null
'string'                // Chaîne de caractères
'numeric'               // Nombre
'integer'               // Entier
'email'                 // Email valide
'min:5'                 // Minimum 5 (caractères ou valeur)
'max:255'               // Maximum 255
'between:1,100'         // Entre 1 et 100
'unique:products,name'  // Unique dans la table products, colonne name
'exists:categories,id'  // Doit exister dans categories.id
'in:small,medium,large' // Doit être parmi ces valeurs
'regex:/pattern/'       // Expression régulière
'date'                  // Date valide
'after:today'           // Date après aujourd'hui
'image'                 // Fichier image
'mimes:pdf,docx'        // Types de fichiers autorisés
```

---

### 🎯 Partie 5 : Exercice pratique (10 min)

**Créer une API complète pour un système de blog**

```php
// À faire en live-coding avec les étudiants:

// 1. Créer le modèle
php artisan make:model Article -m

// 2. Définir la migration
Schema::create('articles', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->string('author');
    $table->boolean('published')->default(false);
    $table->timestamps();
});

// 3. Créer le contrôleur
php artisan make:controller ArticleController --api

// 4. Définir les routes
Route::prefix('v1')->group(function () {
    Route::apiResource('articles', ArticleController::class);
    
    // Route custom pour articles publiés
    Route::get('articles/published', [ArticleController::class, 'published']);
});

// 5. Implémenter les méthodes dans le contrôleur
// Les étudiants codent:
// - index() avec filtres (published, author)
// - store() avec validation
// - show()
// - update()
// - destroy()
// - published() méthode custom
```

---

### ✅ Récapitulatif & Best Practices (5 min)

#### Checklist pour créer une API

- [ ] Utiliser `routes/api.php`
- [ ] Suivre la convention RESTful
- [ ] Utiliser `apiResource` pour les CRUD standards
- [ ] Valider toutes les entrées utilisateur
- [ ] Retourner les bons codes HTTP
- [ ] Grouper les routes logiquement
- [ ] Protéger les routes sensibles avec middleware
- [ ] Documenter vos endpoints (postman/swagger)

#### Pattern de réponse standardisée

```php
// Succès
return response()->json([
    'success' => true,
    'data' => $products,
    'message' => 'Produits récupérés avec succès'
], 200);

// Erreur
return response()->json([
    'success' => false,
    'message' => 'Produit non trouvé',
    'errors' => []
], 404);
```

#### Pour le projet de semestre

```markdown
Votre API devra:
1. Gérer au moins 3 ressources (ex: produits, catégories, commandes)
2. Implémenter l'authentification (Laravel Sanctum)
3. Avoir des routes protégées et publiques
4. Valider toutes les données entrantes
5. Retourner des erreurs cohérentes
6. Être testée avec Postman
7. Être documentée
```

---

## 📚 Ressources complémentaires

**Documentation officielle:**
- Structure Laravel: https://laravel.com/docs/structure
- Routing: https://laravel.com/docs/routing
- Controllers: https://laravel.com/docs/controllers
- Validation: https://laravel.com/docs/validation

**Exercices pour la semaine:**
1. Créer une API complète pour gérer une bibliothèque (livres, auteurs, emprunts)
2. Implémenter des filtres et recherche
3. Ajouter des validations personnalisées
4. Tester avec Postman et documenter

**Prochaine session:** 
- Eloquent ORM et relations entre modèles
- Authentication avec Laravel Sanctum

---

*Bokaynou ! Des questions ?* 🚀