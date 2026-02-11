<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// 1. LIRE tous les produits
Route::get('/products', [ProductController::class, 'index']);

// 2. LIRE un produit spécifique
Route::get('/products/{id}', [ProductController::class, 'show']);

// 3. CRÉER un nouveau produit
Route::post('/products', [ProductController::class, 'store']);

// 4. MODIFIER un produit
Route::put('/products/{id}', [ProductController::class, 'update']);

// 5. SUPPRIMER un produit
Route::delete('/products/{id}', [ProductController::class, 'destroy']);