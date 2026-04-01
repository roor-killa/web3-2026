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