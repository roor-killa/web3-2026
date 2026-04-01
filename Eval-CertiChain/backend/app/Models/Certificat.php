<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificat extends Model
{
    use HasFactory;

    protected $fillable = [
        'identifiant',
        'nom_etudiant',
        'intitule',
        'date_emission',
        'hash_blockchain',
    ];

    protected $casts = [
        'date_emission' => 'date',
    ];

}