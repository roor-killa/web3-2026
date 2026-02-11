<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;

   class ProductController extends Controller
{
    // Vue Web - Retourne HTML
    public function index()
    {
        $products = Product::all();
        return view('products.index', compact('products'));
    }

    // API - Retourne JSON (liste)
    public function apiIndex()
    {
        $products = Product::all();
        return response()->json($products);
    }

    // API - Retourne JSON (détail)
    public function apiShow($id)
    {
        $product = Product::find($id);
        
        if (!$product) {
            return response()->json(['error' => 'Produit non trouvé'], 404);
        }
        
        return response()->json($product);
    }
}