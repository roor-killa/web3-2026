<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'price', 'description'];
    
    // Eloquent gère automatiquement la BDD
    // Product::all() → SELECT * FROM products
    // Product::find(1) → SELECT * FROM products WHERE id = 1
}
