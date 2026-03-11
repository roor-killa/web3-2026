<?php

namespace Database\Seeders;

// Fichier backend: commentaires simples en francais.
// Seeder principal : crée un utilisateur de test et lance `ProductSeeder`.


use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $this->call(ProductSeeder::class);
    }
}


