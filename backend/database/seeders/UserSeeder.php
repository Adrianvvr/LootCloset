<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Creamos tu usuario principal de pruebas
        User::create([
            'name' => 'Usuario de Prueba',
            'email' => 'usuario@prueba.com', // ¡Usa esto para iniciar sesión!
            'password' => Hash::make('12345678'), // La contraseña será 'password'
        ]);

        // Opcional: Crear 2 usuarios aleatorios más usando el Factory que trae Laravel por defecto
        User::factory(2)->create();
    }
}