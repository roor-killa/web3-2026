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