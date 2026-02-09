<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Route de connexion
Route::post('/login', [AuthController::class, 'login']);

// Routes CRUD pour les produits
Route::get('/products', [ProductController::class, 'index']);        // Liste tous les produits
Route::post('/products', [ProductController::class, 'store']);        // Créer un produit
Route::get('/products/{id}', [ProductController::class, 'show']);     // Afficher un produit
Route::put('/products/{id}', [ProductController::class, 'update']);   // Modifier un produit
Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Supprimer un produit