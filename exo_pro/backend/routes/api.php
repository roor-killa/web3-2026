<?php

// Fichier backend: commentaires simples en francais.
// Routes API CRUD complet pour les produits.
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// 📖 Lire tous les produits
Route::get('/products', [ProductController::class, 'index']);

// 📖 Lire UN produit spécifique
Route::get('/products/{id}', [ProductController::class, 'show']);

// ➕ Créer un nouveau produit
Route::post('/products', [ProductController::class, 'store']);

// ✏️ Modifier un produit
Route::put('/products/{id}', [ProductController::class, 'update']);

// 🗑️ Supprimer un produit
Route::delete('/products/{id}', [ProductController::class, 'destroy']);


