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