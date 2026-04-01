<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Ordinateur Portable',
                'description' => 'PC portable haut de gamme pour le gaming',
                'price' => 1500.00,
                'stock' => 10,
            ],
            [
                'name' => 'Smartphone',
                'description' => 'Smartphone dernière génération',
                'price' => 999.99,
                'stock' => 15,
            ],
            [
                'name' => 'Casque Audio',
                'description' => 'Casque sans fil avec réduction de bruit',
                'price' => 199.99,
                'stock' => 25,
            ],
            [
                'name' => 'Clavier Mécanique',
                'description' => 'Clavier mécanique RGB',
                'price' => 89.99,
                'stock' => 30,
            ],
            [
                'name' => 'Souris Gamer',
                'description' => 'Souris ergonomique pour gaming',
                'price' => 49.99,
                'stock' => 40,
            ],
            [
                'name' => 'Écran 27 pouces',
                'description' => 'Écran 4K UHD pour PC',
                'price' => 350.00,
                'stock' => 12,
            ],
            [
                'name' => 'Tablette',
                'description' => 'Tablette Android pour usage multimédia',
                'price' => 299.99,
                'stock' => 20,
            ],
            [
                'name' => 'Disque Dur SSD 1To',
                'description' => 'Stockage rapide pour PC',
                'price' => 120.00,
                'stock' => 18,
            ],
            [
                'name' => 'Webcam HD',
                'description' => 'Webcam pour streaming et visioconférences',
                'price' => 79.99,
                'stock' => 22,
            ],
            [
                'name' => 'Enceinte Bluetooth',
                'description' => 'Enceinte portable et puissante',
                'price' => 59.99,
                'stock' => 25,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}