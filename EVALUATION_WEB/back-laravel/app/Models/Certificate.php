<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    protected $fillable = [
        'student_name',
        'certification_title',
        'issue_date',
        'blockchain_hash',
    ];
}