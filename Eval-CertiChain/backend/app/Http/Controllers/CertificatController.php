<?php

namespace App\Http\Controllers;

use App\Models\Certificat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CertificatController extends Controller
{
    public function index()
    {
        $certificats = DB::table('certificats')->get();
        
        return response()->json($certificats);
    }

    // GET /api/certificats/{chiffre}
    public function show($id)
    {
        $certificat = Certificat::findOrFail($id);
        return response()->json($certificat);
    }
    
    // POST /api/certificats
    public function store(Request $request)
    {
        $validated = $request->validate([
            'identifiant' => 'required|string|max:255|unique:certificats,identifiant',
            'nom_etudiant' => 'required|string|max:255',
            'intitule' => 'required|string|max:255',
            'date_emission' => 'required|date',
            'hash_blockchain' => 'required|string|max:255',
        ]);
        
        $certificat = Certificat::create($validated);
        return response()->json($certificat, 201);
    }
    
    // PUT /api/certificats/{chiffre}
    public function update(Request $request, $id)
    {
        $certificat = Certificat::findOrFail($id);
        
        $validated = $request->validate([
            'identifiant' => 'sometimes|required|string|max:255|unique:certificats,identifiant,' . $certificat->id,
            'nom_etudiant' => 'sometimes|required|string|max:255',
            'intitule' => 'sometimes|required|string|max:255',
            'date_emission' => 'sometimes|required|date',
            'hash_blockchain' => 'sometimes|required|string|max:255',
        ]);
        
        $certificat->update($validated);
        
        return response()->json($certificat);
    }
    
    // DELETE /api/certificats/5
    public function destroy($id)
    {
        $certificat = Certificat::findOrFail($id);
        $certificat->delete();
        
        return response()->json(null, 204);
    }
}
