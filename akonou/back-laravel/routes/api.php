<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

Route::get('/test', function () {
    return response()->json(['message' => 'API Laravel fonctionne']);
});

Route::apiResource('products', ProductController::class);
