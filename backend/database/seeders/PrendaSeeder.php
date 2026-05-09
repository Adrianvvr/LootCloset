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
            ['categoria' => 'Camiseta', 'color' => 'Blanco', 'precio' => 15.99, 'sucia_desde' => null, 'foto_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Negro', 'precio' => 19.99, 'sucia_desde' => null, 'foto_url' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Azul', 'precio' => 45.00, 'sucia_desde' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'],
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 89.90, 'sucia_desde' => null, 'foto_url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80'],
            ['categoria' => 'Sudadera', 'color' => 'Gris', 'precio' => 35.50, 'sucia_desde' => null, 'foto_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'],
            // Item that is dirty for 4 days
            ['categoria' => 'Chaqueta', 'color' => 'Verde', 'precio' => 59.99, 'sucia_desde' => now()->subDays(4), 'foto_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80'],
        ];

        foreach ($prendasBase as $item) {
            Prenda::create([
                'usuario_id' => $user->id,
                'marca_id' => $marcasIds[array_rand($marcasIds)],
                'categoria' => $item['categoria'],
                'color_principal' => $item['color'],
                'precio_compra' => $item['precio'],
                'foto_url' => $item['foto_url'],
                'esta_limpia' => is_null($item['sucia_desde']),
                'fecha_ensuciado' => $item['sucia_desde'],
                'contador_usos' => rand(0, 2),
            ]);
        }
    }
}