<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Laptop Dell XPS 13',
                'description' => 'Ultrabook haute performance avec écran 13 pouces FHD',
                'price' => 999.99,
                'quantity' => 15,
                'sku' => 'DELL-XPS-13-001',
            ],
            [
                'name' => 'iPhone 15 Pro',
                'description' => 'Smartphone dernière génération Apple avec caméra 48MP',
                'price' => 1299.99,
                'quantity' => 30,
                'sku' => 'APPLE-IP15-PRO-001',
            ],
            [
                'name' => 'AirPods Pro Max',
                'description' => 'Casque audio sans fil avec annulation active du bruit',
                'price' => 549.99,
                'quantity' => 25,
                'sku' => 'APPLE-AIRPODS-MAX-001',
            ],
            [
                'name' => 'Samsung Galaxy S24',
                'description' => 'Téléphone Android avec écran AMOLED 120Hz',
                'price' => 999.99,
                'quantity' => 40,
                'sku' => 'SAMSUNG-S24-001',
            ],
            [
                'name' => 'iPad Air',
                'description' => 'Tablette polyvalente avec processeur M2',
                'price' => 799.99,
                'quantity' => 20,
                'sku' => 'APPLE-IPAD-AIR-001',
            ],
            [
                'name' => 'Sony WH-1000XM5',
                'description' => 'Casque Bluetooth haut de gamme avec ANC premium',
                'price' => 379.99,
                'quantity' => 35,
                'sku' => 'SONY-WH-1000XM5-001',
            ],
            [
                'name' => 'GoPro Hero 12',
                'description' => 'Caméra d\'action 4K pour sports extrêmes',
                'price' => 449.99,
                'quantity' => 18,
                'sku' => 'GOPRO-HERO12-001',
            ],
            [
                'name' => 'DJI Mini 4 Pro',
                'description' => 'Drone compact et performant pour la photographie aérienne',
                'price' => 759.99,
                'quantity' => 12,
                'sku' => 'DJI-MINI4-PRO-001',
            ],
        ];

        foreach ($products as $product) {
            // ✅ Update or create pour éviter les doublons sur le SKU
            Product::updateOrCreate(
                ['sku' => $product['sku']], // clé unique
                [
                    'name' => $product['name'],
                    'description' => $product['description'],
                    'price' => $product['price'],
                    'quantity' => $product['quantity'],
                ]
            );
        }
    }
}
