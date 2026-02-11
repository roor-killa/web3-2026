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
}
