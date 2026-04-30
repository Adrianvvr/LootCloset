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
        // Buscamos al usuario de prueba
        $user = User::where('email', 'prueba@lootcloset.com')->first();
        
        // Obtenemos todos los IDs de las marcas disponibles
        $marcasIds = Marca::pluck('id')->toArray();

        // Si por algún motivo no hay marcas, no podemos crear prendas
        if (empty($marcasIds)) {
            echo "⚠️ No hay marcas en la base de datos. Asegúrate de correr MarcaSeeder primero.\n";
            return;
        }

        // Definimos un armario básico realista
        $prendasBase = [
            ['categoria' => 'Camiseta', 'color' => 'Blanco', 'precio' => 15.99],
            ['categoria' => 'Camiseta', 'color' => 'Negro', 'precio' => 19.99],
            ['categoria' => 'Sudadera', 'color' => 'Gris', 'precio' => 35.50],
            ['categoria' => 'Pantalón', 'color' => 'Azul', 'precio' => 45.00],
            ['categoria' => 'Pantalón', 'color' => 'Negro', 'precio' => 39.99],
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 89.90],
            ['categoria' => 'Zapatillas', 'color' => 'Negro', 'precio' => 65.00],
            ['categoria' => 'Chaqueta', 'color' => 'Marrón', 'precio' => 120.00],
        ];

        foreach ($prendasBase as $item) {
            Prenda::create([
                'usuario_id' => $user->id,
                'marca_id' => $marcasIds[array_rand($marcasIds)], // Elige una marca al azar
                'categoria' => $item['categoria'],
                'color_principal' => $item['color'],
                'precio_compra' => $item['precio'],
                'esta_limpia' => true,
                'contador_usos' => rand(0, 5),
            ]);
        }
    }
}