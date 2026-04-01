<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    // GET /api/certificates — liste tous les certificats
    public function index()
    {
        $certificates = Certificate::orderBy('issued_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data'    => $certificates,
        ]);
    }

    // POST /api/certificates — crée un nouveau certificat
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_name'    => 'required|string|max:255',
            'title'           => 'required|string|max:255',
            'issued_at'       => 'required|date',
            'blockchain_hash' => 'required|string|unique:certificates,blockchain_hash',
        ]);

        $certificate = Certificate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certificat créé avec succès',
            'data'    => $certificate,
        ], 201);
    }

    // GET /api/certificates/{id} — détail d'un certificat
    public function show($id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificat non trouvé',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $certificate,
        ]);
    }

    // DELETE /api/certificates/{id} — supprime un certificat
    public function destroy($id)
    {
        $certificate = Certificate::find($id);

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificat non trouvé',
            ], 404);
        }

        $certificate->delete();

        return response()->json([
            'success' => true,
            'message' => 'Certificat supprimé avec succès',
        ]);
    }
}
