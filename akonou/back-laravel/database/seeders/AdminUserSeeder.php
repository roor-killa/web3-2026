<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create or update admin user
        $admin = User::updateOrCreate(
            ['email' => 'admin@kiprix.local'],
            [
                'name' => 'Admin Kiprix',
                'email' => 'admin@kiprix.local',
                'password' => Hash::make('admin123456'),
                'is_admin' => true,
            ]
        );

        // Generate Sanctum token
        $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;

        echo "\n\n";
        echo "✅ Admin user created:\n";
        echo "   Email: admin@kiprix.local\n";
        echo "   Password: admin123456\n";
        echo "   Token: $token\n";
        echo "\n⚠️  Save this token (it only shows once)\n";
        echo "\n";
    }
}
