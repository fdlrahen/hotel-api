<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@hotel.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Resepsionis user
        User::create([
            'name' => 'Resepsionis Hotel',
            'email' => 'resepsionis@hotel.com',
            'password' => Hash::make('password'),
            'role' => 'resepsionis',
            'email_verified_at' => now(),
        ]);
    }
}
