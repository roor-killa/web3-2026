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