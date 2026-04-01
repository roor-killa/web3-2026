<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CertificateController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| CertiChain API Routes for certificate management
|
*/

// Certificate routes
Route::prefix('certificates')->group(function () {
    // GET /api/certificates - List all certificates
    Route::get('/', [CertificateController::class, 'index']);
    
    // POST /api/certificates - Create a new certificate
    Route::post('/', [CertificateController::class, 'store']);
    
    // GET /api/certificates/verify/{hash} - Verify certificate by blockchain hash
    Route::get('/verify/{hash}', [CertificateController::class, 'verify']);
    
    // GET /api/certificates/{certificate} - Get a specific certificate
    Route::get('/{certificate}', [CertificateController::class, 'show']);
});
