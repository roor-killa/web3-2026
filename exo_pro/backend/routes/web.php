<?php

use Illuminate\Support\Facades\Route;

// Route simple de test du backend.
Route::get('/', function () {
    return response()->json(['message' => 'Bienvenue sur l\'API E-Shop!']);
});

// Redirige vers la vraie route API des produits.
Route::redirect('/products', '/api/products');
Route::redirect('/Products', '/api/products');