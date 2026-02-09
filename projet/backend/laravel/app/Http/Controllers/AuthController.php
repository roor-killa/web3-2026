<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    /**
     * Traiter la requête de connexion
     */
    public function login(Request $request): JsonResponse
    {
        // Valider les données reçues
        $validated = $request->validate([
            'login' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        // Retourner un message de bienvenue avec les informations
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'login' => $validated['login'],
                'greeting' => 'Bonjour ' . $validated['login'] . '!',
            ]
        ]);
    }
}
