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
        $marcasIds = Marca::pluck('id')->toArray();
        if (empty($marcasIds)) return;

        $this->seedUsuario('test@example.com', $marcasIds);
        $this->seedUsuario2('test2@example.com', $marcasIds);
    }

    // -----------------------------------------------------------------------
    // USUARIO 1 – test@example.com
    // -----------------------------------------------------------------------
    private function seedUsuario(string $email, array $marcasIds): void
    {
        $user = User::where('email', $email)->first();
        if (!$user) return;

        $prendas = [
            // --- CAPA INTERIOR (Camisetas) ---
            ['categoria' => 'Camiseta', 'color' => 'Blanco',   'precio' => 15.99, 'limpia' => true,  'dias_uso' => 5,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Negro',    'precio' => 19.99, 'limpia' => true,  'dias_uso' => 30,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80'], // +3 semanas
            ['categoria' => 'Camiseta', 'color' => 'Azul',     'precio' => 17.50, 'limpia' => true,  'dias_uso' => 8,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Gris',     'precio' => 16.00, 'limpia' => true,  'dias_uso' => 3,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Rojo',     'precio' => 22.00, 'limpia' => false, 'dias_uso' => 2,   'dias_sucia' => 2,    'foto_url' => 'https://images.unsplash.com/photo-1530629673369-87a1b6de4f2e?w=400&q=80'], // sucia
            // --- CAPA INTERIOR (Vestidos) ---
            ['categoria' => 'Vestido',  'color' => 'Beige',    'precio' => 49.99, 'limpia' => true,  'dias_uso' => 35,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80'], // +3 semanas
            ['categoria' => 'Vestido',  'color' => 'Verde',    'precio' => 55.00, 'limpia' => true,  'dias_uso' => 10,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80'],
            // --- ABAJO (Pantalones y Faldas) ---
            ['categoria' => 'Pantalón', 'color' => 'Azul',     'precio' => 45.00, 'limpia' => true,  'dias_uso' => 10,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Negro',    'precio' => 52.00, 'limpia' => true,  'dias_uso' => 6,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Beige',    'precio' => 48.00, 'limpia' => true,  'dias_uso' => 4,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Gris',     'precio' => 40.00, 'limpia' => false, 'dias_uso' => 3,   'dias_sucia' => 3,    'foto_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80'], // sucia
            ['categoria' => 'Falda',    'color' => 'Negro',    'precio' => 35.00, 'limpia' => true,  'dias_uso' => 28,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=400&q=80'], // +3 semanas
            ['categoria' => 'Falda',    'color' => 'Blanco',   'precio' => 32.00, 'limpia' => true,  'dias_uso' => 7,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=400&q=80'],
            // --- CALZADO ---
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 89.90, 'limpia' => true,  'dias_uso' => 2,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80'],
            ['categoria' => 'Zapatillas', 'color' => 'Negro',  'precio' => 75.00, 'limpia' => true,  'dias_uso' => 7,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ['categoria' => 'Zapatos',  'color' => 'Marrón',   'precio' => 110.00,'limpia' => true,  'dias_uso' => 15,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ['categoria' => 'Zapatos',  'color' => 'Negro',    'precio' => 95.00, 'limpia' => true,  'dias_uso' => 40,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'], // +3 semanas
            // --- CAPA EXTERIOR ---
            ['categoria' => 'Sudadera', 'color' => 'Gris',     'precio' => 35.50, 'limpia' => true,  'dias_uso' => 35,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'], // +3 semanas
            ['categoria' => 'Sudadera', 'color' => 'Azul Marino','precio'=> 42.00,'limpia' => true,  'dias_uso' => 6,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80'],
            ['categoria' => 'Chaqueta', 'color' => 'Verde',    'precio' => 59.99, 'limpia' => false, 'dias_uso' => 4,   'dias_sucia' => 4,    'foto_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80'], // sucia 4 días
            ['categoria' => 'Chaqueta', 'color' => 'Beige',    'precio' => 75.00, 'limpia' => true,  'dias_uso' => 9,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80'],
            ['categoria' => 'Abrigo',   'color' => 'Camel',    'precio' => 130.00,'limpia' => true,  'dias_uso' => 20,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=80'],
            // --- ACCESORIOS ---
            ['categoria' => 'Accesorios','color' => 'Dorado',  'precio' => 25.00, 'limpia' => true,  'dias_uso' => 50,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'], // +3 semanas
            ['categoria' => 'Accesorios','color' => 'Plateado','precio' => 20.00, 'limpia' => true,  'dias_uso' => 12,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'],
            // --- ROPA INTERIOR ---
            ['categoria' => 'Ropa Interior','color' => 'Blanco','precio'=> 12.00, 'limpia' => true,  'dias_uso' => 1,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
        ];

        foreach ($prendas as $item) {
            Prenda::create([
                'usuario_id'       => $user->id,
                'marca_id'         => $marcasIds[array_rand($marcasIds)],
                'categoria'        => $item['categoria'],
                'color_principal'  => $item['color'],
                'precio_compra'    => $item['precio'],
                'foto_url'         => $item['foto_url'],
                'esta_limpia'      => $item['limpia'],
                'fecha_ensuciado'  => $item['dias_sucia'] ? now()->subDays($item['dias_sucia']) : null,
                'fecha_ultimo_uso' => $item['dias_uso'] ? now()->subDays($item['dias_uso']) : null,
                'contador_usos'    => rand(1, 20),
            ]);
        }
    }

    // -----------------------------------------------------------------------
    // USUARIO 2 – test2@example.com
    // -----------------------------------------------------------------------
    private function seedUsuario2(string $email, array $marcasIds): void
    {
        $user = User::where('email', $email)->first();
        if (!$user) return;

        $prendas = [
            // --- CAPA INTERIOR ---
            ['categoria' => 'Camiseta', 'color' => 'Blanco',   'precio' => 14.99, 'limpia' => true,  'dias_uso' => 3,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Azul',     'precio' => 22.99, 'limpia' => true,  'dias_uso' => 3,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80'],
            ['categoria' => 'Camiseta', 'color' => 'Rojo',     'precio' => 18.50, 'limpia' => true,  'dias_uso' => 28,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&q=80'], // +3 semanas
            ['categoria' => 'Camiseta', 'color' => 'Verde',    'precio' => 21.00, 'limpia' => false, 'dias_uso' => 4,   'dias_sucia' => 4,    'foto_url' => 'https://images.unsplash.com/photo-1530629673369-87a1b6de4f2e?w=400&q=80'], // sucia
            ['categoria' => 'Vestido',  'color' => 'Rosa',     'precio' => 60.00, 'limpia' => true,  'dias_uso' => 14,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&q=80'],
            // --- ABAJO ---
            ['categoria' => 'Pantalón', 'color' => 'Negro',    'precio' => 55.00, 'limpia' => true,  'dias_uso' => 7,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Azul',     'precio' => 48.00, 'limpia' => true,  'dias_uso' => 12,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80'],
            ['categoria' => 'Pantalón', 'color' => 'Gris',     'precio' => 44.00, 'limpia' => true,  'dias_uso' => 5,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80'],
            ['categoria' => 'Falda',    'color' => 'Beige',    'precio' => 38.00, 'limpia' => true,  'dias_uso' => 42,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=400&q=80'], // +3 semanas
            // --- CALZADO ---
            ['categoria' => 'Zapatillas', 'color' => 'Negro',  'precio' => 75.00, 'limpia' => true,  'dias_uso' => 1,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            ['categoria' => 'Zapatillas', 'color' => 'Blanco', 'precio' => 85.00, 'limpia' => true,  'dias_uso' => 9,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80'],
            ['categoria' => 'Zapatos',  'color' => 'Negro',    'precio' => 100.00,'limpia' => true,  'dias_uso' => 20,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80'],
            // --- CAPA EXTERIOR ---
            ['categoria' => 'Sudadera', 'color' => 'Azul Marino','precio'=> 42.00,'limpia' => true,  'dias_uso' => 36,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&q=80'], // +3 semanas
            ['categoria' => 'Sudadera', 'color' => 'Gris',     'precio' => 38.00, 'limpia' => true,  'dias_uso' => 8,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80'],
            ['categoria' => 'Chaqueta', 'color' => 'Marrón',   'precio' => 79.99, 'limpia' => false, 'dias_uso' => 5,   'dias_sucia' => 5,    'foto_url' => 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80'], // sucia 5 días
            ['categoria' => 'Chaqueta', 'color' => 'Negro',    'precio' => 85.00, 'limpia' => true,  'dias_uso' => 11,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80'],
            ['categoria' => 'Abrigo',   'color' => 'Gris',     'precio' => 145.00,'limpia' => true,  'dias_uso' => 25,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=400&q=80'],
            // --- ACCESORIOS ---
            ['categoria' => 'Accesorios','color' => 'Plateado','precio' => 18.00, 'limpia' => true,  'dias_uso' => 60,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'], // +3 semanas
            ['categoria' => 'Accesorios','color' => 'Dorado',  'precio' => 22.00, 'limpia' => true,  'dias_uso' => 15,  'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80'],
            // --- ROPA INTERIOR ---
            ['categoria' => 'Ropa Interior','color' => 'Negro','precio' => 10.00, 'limpia' => true,  'dias_uso' => 1,   'dias_sucia' => null, 'foto_url' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80'],
        ];

        foreach ($prendas as $item) {
            Prenda::create([
                'usuario_id'       => $user->id,
                'marca_id'         => $marcasIds[array_rand($marcasIds)],
                'categoria'        => $item['categoria'],
                'color_principal'  => $item['color'],
                'precio_compra'    => $item['precio'],
                'foto_url'         => $item['foto_url'],
                'esta_limpia'      => $item['limpia'],
                'fecha_ensuciado'  => $item['dias_sucia'] ? now()->subDays($item['dias_sucia']) : null,
                'fecha_ultimo_uso' => $item['dias_uso'] ? now()->subDays($item['dias_uso']) : null,
                'contador_usos'    => rand(1, 20),
            ]);
        }
    }
}