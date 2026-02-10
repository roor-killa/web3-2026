<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'titre' => 'Produit 1',
                'description' => 'Description du produit 1',
                'prix' => 10.99,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 2',
                'description' => 'Description du produit 2',
                'prix' => 15.50,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 3',
                'description' => 'Description du produit 3',
                'prix' => 7.99,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 4',
                'description' => 'Description du produit 4',
                'prix' => 25.00,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 5',
                'description' => 'Description du produit 5',
                'prix' => 5.49,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 6',
                'description' => 'Description du produit 6',
                'prix' => 99.99,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 7',
                'description' => 'Description du produit 7',
                'prix' => 45.00,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 8',
                'description' => 'Description du produit 8',
                'prix' => 12.00,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 9',
                'description' => 'Description du produit 9',
                'prix' => 18.75,
                'date_create' => now(),
                'date_update' => now(),
            ],
            [
                'titre' => 'Produit 10',
                'description' => 'Description du produit 10',
                'prix' => 60.00,
                'date_create' => now(),
                'date_update' => now(),
            ],
        ]);
    }
}