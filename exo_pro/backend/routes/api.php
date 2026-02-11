<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

// API Routes - Retourne du JSON
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'apiIndex']);
    Route::get('/{id}', [ProductController::class, 'apiShow']);
});
