<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = ['student_name', 'title', 'issued_at', 'blockchain_hash'];

    protected $casts = [
        'issued_at' => 'date',
    ];
}
