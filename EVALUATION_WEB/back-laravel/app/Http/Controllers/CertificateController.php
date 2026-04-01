<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index()
    {
        return response()->json(Certificate::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_name' => 'required|max:255',
            'certification_title' => 'required|max:255',
            'issue_date' => 'required|date',
            'blockchain_hash' => 'required|max:255',
        ]);

        $certificate = Certificate::create($validated);

        return response()->json($certificate, 201);
    }
}