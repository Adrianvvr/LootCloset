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
            ['categoria' => 'Camiseta', 'color' => 'Blanco', 'precio' => 15.99, 'sucia_desde' => null],
            ['categoria' => 'Camiseta', 'color' => 'Negro', 'precio' => 19.99, 'sucia_desde' => null],
            ['categoria' => 'Pantalón', 'color' => 'Azul', 'precio' => 45.00, 'sucia_desde' => null],
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 89.90, 'sucia_desde' => null],
            ['categoria' => 'Sudadera', 'color' => 'Gris', 'precio' => 35.50, 'sucia_desde' => null],
            // Item that is dirty for 4 days
            ['categoria' => 'Chaqueta', 'color' => 'Verde', 'precio' => 59.99, 'sucia_desde' => now()->subDays(4)],
        ];

        foreach ($prendasBase as $item) {
            Prenda::create([
                'usuario_id' => $user->id,
                'marca_id' => $marcasIds[array_rand($marcasIds)],
                'categoria' => $item['categoria'],
                'color_principal' => $item['color'],
                'precio_compra' => $item['precio'],
                'esta_limpia' => is_null($item['sucia_desde']),
                'fecha_ensuciado' => $item['sucia_desde'],
                'contador_usos' => rand(0, 2),
            ]);
        }
    }
}