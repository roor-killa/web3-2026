<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    // Allow these fields to be filled via Product::create()
    protected $fillable = ['titre', 'description', 'prix'];
}