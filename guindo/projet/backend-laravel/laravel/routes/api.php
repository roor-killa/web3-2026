<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ============================================
// Routes d'authentification (publiques)
// ============================================

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ============================================
// Routes publiques (pas d'authentification)
// ============================================

Route::get('/products', [ProductController::class, 'index']);        // Liste tous les produits

// ============================================
// Routes protégées (nécessitent un token)
// ============================================

Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/auth/tokens', [AuthController::class, 'tokens']);
    Route::delete('/auth/tokens/{tokenId}', [AuthController::class, 'revokeToken']);
    Route::post('/auth/logout-all', [AuthController::class, 'revokeAllTokens']);

    // Produits (CRUD - modification et suppression protégées)
    Route::post('/products', [ProductController::class, 'store']);        // Créer un produit
    Route::get('/products/{id}', [ProductController::class, 'show']);     // Afficher un produit
    Route::put('/products/{id}', [ProductController::class, 'update']);   // Modifier un produit
    Route::delete('/products/{id}', [ProductController::class, 'destroy']); // Supprimer un produit
});

// Route de compatibilité (ancienne)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');