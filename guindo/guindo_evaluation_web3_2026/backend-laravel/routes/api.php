<?php

use App\Http\Controllers\CertificateController;
use Illuminate\Support\Facades\Route;

// Toutes les routes certificates sont publiques (projet évaluation)
Route::get('/certificates',          [CertificateController::class, 'index']);
Route::get('/certificates/{id}',     [CertificateController::class, 'show']);
Route::post('/certificates',         [CertificateController::class, 'store']);
Route::delete('/certificates/{id}',  [CertificateController::class, 'destroy']);
