<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products'; // nom de ta table
    protected $fillable = ['titre', 'description', 'prix', 'date_create', 'date_update'];
    public $timestamps = false; // car tu as tes propres colonnes date_create/date_update
}
