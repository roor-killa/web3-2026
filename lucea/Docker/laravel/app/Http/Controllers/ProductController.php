<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
    $products = \App\Models\Product::all();
    return view('products.index', compact('products'));
    }

    public function indexJson()
    {
    $products = \App\Models\Product::all();
    return response()->json($products);
    }
    public function apiIndex()
    {
    $products = \App\Models\Product::all();
    return response()->json($products);
    }

}
