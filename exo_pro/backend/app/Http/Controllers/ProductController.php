<?php

namespace App\Http\Controllers;

// Contrôleur CRUD complet pour gérer les produits.
// Chaque méthode correspond à une opération (index, show, store, update, destroy).

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // 📖 GET /api/products - Lire tous les produits
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // 📖 GET /api/products/{id} - Lire UN produit spécifique
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // ➕ POST /api/products - Créer un nouveau produit
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        $product = Product::create($validated);
        return response()->json($product, 201);
    }

    // ✏️ PUT /api/products/{id} - Modifier un produit
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

    // 🗑️ DELETE /api/products/{id} - Supprimer un produit
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(null, 204);
    }
}


