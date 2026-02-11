<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Instead of the function, we point to the Controller class
Route::get('/products', [ProductController::class, 'index']);

// 2. LIRE un produit spécifique
Route::get('/products/{id}', [ProductController::class, 'show']);

// 3. CRÉER un nouveau produit
Route::post('/products', [ProductController::class, 'store']);

// 4. MODIFIER un produit
Route::put('/products/{id}', [ProductController::class, 'update']);

// 5. SUPPRIMER un produit
Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// ✨ RACCOURCI : Laravel peut générer tout ça automatiquement
Route::apiResource('products', ProductController::class);