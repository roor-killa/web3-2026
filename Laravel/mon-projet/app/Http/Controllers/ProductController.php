<?php

namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;

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