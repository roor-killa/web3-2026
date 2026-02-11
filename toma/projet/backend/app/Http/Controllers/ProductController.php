<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index()
    {
        // This is the logic you had in the route
        $products = DB::table('products')->get();
        
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
            'titre' => 'required|max:255', // Matches migration
            'prix' => 'required|numeric|min:0', // Matches migration
            'description' => 'nullable|string'
        ]);
        
        $product = Product::create($validated);
        return response()->json($product, 201);
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
