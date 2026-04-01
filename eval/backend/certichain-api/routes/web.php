<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'CertiChain API',
        'version' => '1.0.0',
        'description' => 'API de gestion des certificats numériques',
        'endpoints' => [
            'GET /api/certificates' => 'Liste tous les certificats',
            'POST /api/certificates' => 'Créer un nouveau certificat',
            'GET /api/certificates/{id}' => 'Afficher un certificat',
            'GET /api/certificates/verify/{hash}' => 'Vérifier un certificat par hash',
        ],
        'status' => 'running'
    ]);
});
