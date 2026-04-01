<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index()
    {
        return response()->json(Certificate::orderBy('issued_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'issued_at' => 'required|date',
            'blockchain_hash' => 'nullable|string|max:255',
        ]);

        $certificate = Certificate::create($validated);

        return response()->json($certificate, 201);
    }
}
