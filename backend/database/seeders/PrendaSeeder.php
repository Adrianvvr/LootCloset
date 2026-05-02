<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prenda;
use App\Models\User;
use App\Models\Marca;

class PrendaSeeder extends Seeder
{
    public function run(): void
    {
        // IMPORTANTE: Buscamos el mismo email que en UserSeeder
        $user = User::where('email', 'test@example.com')->first();
        $marcasIds = Marca::pluck('id')->toArray();

        if (!$user || empty($marcasIds)) return;

        $prendasBase = [
            ['categoria' => 'Camiseta', 'color' => 'Blanco', 'precio' => 15.99],
            ['categoria' => 'Camiseta', 'color' => 'Negro', 'precio' => 19.99],
            ['categoria' => 'Pantalón', 'color' => 'Azul', 'precio' => 45.00],
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 89.90],
            ['categoria' => 'Sudadera', 'color' => 'Gris', 'precio' => 35.50],
        ];

        foreach ($prendasBase as $item) {
            Prenda::create([
                'usuario_id' => $user->id,
                'marca_id' => $marcasIds[array_rand($marcasIds)],
                'categoria' => $item['categoria'],
                'color_principal' => $item['color'],
                'precio_compra' => $item['precio'],
                'esta_limpia' => true,
                'contador_usos' => rand(0, 2),
            ]);
        }
    }
}