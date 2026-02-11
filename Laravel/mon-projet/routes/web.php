<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// Route d'accueil
Route::get('/', function () {
    return response()->json(['message' => 'Bienvenue sur l\'API E-Shop!']);
});

// Routes Web (HTML)
Route::get('/Products', [ProductController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);

// API routes (exposées sous /api/* pour le frontend Next.js)
Route::get('/api/products', [ProductController::class, 'apiIndex']);
Route::get('/api/products/{id}', [ProductController::class, 'apiShow']);
