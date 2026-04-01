<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CertificateController extends Controller
{
    /**
     * Display a listing of all certificates.
     * GET /api/certificates
     */
    public function index(): JsonResponse
    {
        $certificates = Certificate::all();
        return response()->json([
            'success' => true,
            'data' => $certificates
        ]);
    }

    /**
     * Store a newly created certificate.
     * POST /api/certificates
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_name' => 'required|string|max:255',
            'certification_title' => 'required|string|max:255',
            'issue_date' => 'required|date',
            'blockchain_hash' => 'required|string|max:66',
        ]);

        $certificate = Certificate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Certificate created successfully',
            'data' => $certificate
        ], 201);
    }

    /**
     * Display the specified certificate.
     * GET /api/certificates/{id}
     */
    public function show(Certificate $certificate): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $certificate
        ]);
    }

    /**
     * Verify a certificate by its blockchain hash.
     * GET /api/certificates/verify/{hash}
     */
    public function verify(string $hash): JsonResponse
    {
        $certificate = Certificate::where('blockchain_hash', $hash)->first();

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'message' => 'Certificate not found',
                'verified' => false
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Certificate verified successfully',
            'verified' => true,
            'data' => $certificate
        ]);
    }
}
