<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

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
            'product_name' => 'required|max:255',
            'product_price' => 'required|numeric|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json($product, 201); // 201 = Created
    }

    // PUT /api/products/5
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'product_name' => 'sometimes|required|max:255',
            'product_price' => 'sometimes|required|numeric|min:0',
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

