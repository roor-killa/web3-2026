# Cours Laravel L2 - Détails des Sessions

## 2. Structure Laravel (40 min)

### 📋 Objectifs d'apprentissage
À la fin de cette session, les étudiants seront capables de :
- Naviguer efficacement dans l'arborescence d'un projet Laravel
- Comprendre le rôle de chaque dossier principal
- Expliquer le pattern MVC et son implémentation dans Laravel
- Identifier où placer leur code selon sa fonction

---

### 🎯 Partie 2 : Le pattern MVC dans Laravel (12 min)

#### Rappel MVC (3 min)
```
┌─────────────┐
│   ROUTE     │ ← Entrée (URL)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ CONTROLLER  │ ← Logique métier
└──────┬──────┘
       │
       ├────────────┐
       ▼            ▼
┌──────────┐  ┌──────────┐
│  MODEL   │  │   VIEW   │
│  (BDD)   │  │  (JSON)  │
└──────────┘  └──────────┘
```

#### Exemple complet CRUD (9 min)

**Scénario : API pour gérer une boutique en ligne**

```php
// routes/api.php - ROUTE
Route::get('/products', [ProductController::class, 'index']);

// app/Http/Controllers/ProductController.php - CONTROLLER
class ProductController extends Controller
{
    public function index()
    {
        // 1. Utilise le MODEL pour récupérer les données
        $products = Product::all();
        
        // 2. Retourne la VIEW (ici du JSON pour une API)
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}

// app/Models/Product.php - MODEL
class Product extends Model
{
    protected $fillable = ['name', 'price', 'description'];
    
    // Eloquent gère automatiquement la BDD
    // Product::all() → SELECT * FROM products
    // Product::find(1) → SELECT * FROM products WHERE id = 1
}
```

**Le flow complet :**
```
1. Client → GET /api/products
2. Route → Dirige vers ProductController@index
3. Controller → Demande au Model Product::all()
4. Model → Interroge la base de données
5. Model → Retourne les données au Controller
6. Controller → Formate en JSON et renvoie au Client
```

---