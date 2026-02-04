<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'MacBook Pro M3',
                'price' => 2499.99,
                'description' => 'Laptop professionnel haute performance avec puce M3'
            ],
            [
                'name' => 'iPhone 15 Pro',
                'price' => 1199.99,
                'description' => 'Smartphone dernière génération avec titanium'
            ],
            [
                'name' => 'AirPods Pro',
                'price' => 249.99,
                'description' => 'Écouteurs sans fil avec réduction de bruit active'
            ],
            [
                'name' => 'iPad Air',
                'price' => 599.99,
                'description' => 'Tablette légère et performante avec écran Retina'
            ],
            [
                'name' => 'Apple Watch Series 9',
                'price' => 429.99,
                'description' => 'Montre connectée avec suivi santé avancé'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
