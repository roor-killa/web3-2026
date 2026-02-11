<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the products table.
     */
    public function run(): void
    {
        Product::create([
            'name' => 'Laptop Dell XPS',
            'price' => 999.99,
            'description' => 'Ordinateur portable haute performance'
        ]);

        Product::create([
            'name' => 'iPhone 15 Pro',
            'price' => 1199.99,
            'description' => 'Smartphone dernière génération'
        ]);

        Product::create([
            'name' => 'Casque Sony WH-1000XM5',
            'price' => 349.99,
            'description' => 'Casque audio avec réduction de bruit'
        ]);

        Product::create([
            'name' => 'Monitor LG 27 pouces',
            'price' => 299.99,
            'description' => 'Écran 4K ultra HD 144Hz'
        ]);

        Product::create([
            'name' => 'Clavier Mécanique RGB',
            'price' => 139.99,
            'description' => 'Clavier gaming avec switches mécaniques'
        ]);
    }
}
