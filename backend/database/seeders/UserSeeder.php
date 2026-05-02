<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Creamos el usuario principal de pruebas con un email fijo
        User::create([
            'name' => 'Usuario de Prueba',
            'email' => 'test@example.com', 
            'password' => Hash::make('12345678'),
        ]);

        User::factory(2)->create();
    }
}