<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::prefix('api')->group(function () {
    Route::get('certificates', [\App\Http\Controllers\CertificateController::class, 'index']);
    Route::post('certificates', [\App\Http\Controllers\CertificateController::class, 'store']);
});

require __DIR__.'/settings.php';
