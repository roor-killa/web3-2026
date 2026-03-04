<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProductController;

Route::get('/test', function () {
    return response()->json(['message' => 'API Laravel fonctionne']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events/{id}/register', [EventController::class, 'register']);
    Route::delete('/events/{id}/unregister', [EventController::class, 'unregister']);
    Route::get('/my-events', [EventController::class, 'myEvents']);

    Route::apiResource('products', ProductController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
});
