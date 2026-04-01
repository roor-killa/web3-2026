<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \DB::table('products')->insert([
            ['titre' => 'Monitor 24 inch', 'prix' => 150.00],
            ['titre' => 'Wireless Mouse', 'prix' => 25.99],
            ['titre' => 'Gaming Headset', 'prix' => 75.50],
            ['titre' => 'USB-C Cable', 'prix' => 12.00],
            ['titre' => 'Laptop Stand', 'prix' => 45.00],
            ['titre' => 'External SSD', 'prix' => 110.00],
            ['titre' => 'Webcam HD', 'prix' => 60.00],
            ['titre' => 'Desk Mat', 'prix' => 15.00],
            ['titre' => 'Smart Speaker', 'prix' => 49.99]
        ]);
    }
}
