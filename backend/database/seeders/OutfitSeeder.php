<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Outfit;
use App\Models\User;
use App\Models\Prenda;
use Carbon\Carbon;

class OutfitSeeder extends Seeder
{
    public function run(): void
    {
        // ----------------------------------------------------------------
        // USUARIO 1 – test@example.com
        // ----------------------------------------------------------------
        $user1 = User::where('email', 'test@example.com')->first();

        if ($user1) {
            $camiseta   = Prenda::where('usuario_id', $user1->id)->where('categoria', 'Camiseta')->first();
            $pantalon   = Prenda::where('usuario_id', $user1->id)->where('categoria', 'Pantalón')->first();
            $zapatillas = Prenda::where('usuario_id', $user1->id)->where('categoria', 'Zapatillas')->first();

            if ($camiseta && $pantalon && $zapatillas) {
                $outfit = Outfit::create([
                    'usuario_id'       => $user1->id,
                    'fecha_planificada' => Carbon::now(),
                    'fue_usado'        => false,
                ]);

                $outfit->prendas()->attach([
                    $camiseta->id,
                    $pantalon->id,
                    $zapatillas->id,
                ]);
            }

            // Segundo outfit: sudadera + pantalón (para el día siguiente)
            $sudadera = Prenda::where('usuario_id', $user1->id)->where('categoria', 'Sudadera')->first();

            if ($sudadera && $pantalon && $zapatillas) {
                $outfit2 = Outfit::create([
                    'usuario_id'       => $user1->id,
                    'fecha_planificada' => Carbon::now()->addDay(),
                    'fue_usado'        => false,
                ]);

                $outfit2->prendas()->attach([
                    $sudadera->id,
                    $pantalon->id,
                    $zapatillas->id,
                ]);
            }
        }

        // ----------------------------------------------------------------
        // USUARIO 2 – test2@example.com
        // ----------------------------------------------------------------
        $user2 = User::where('email', 'test2@example.com')->first();

        if ($user2) {
            $camiseta2   = Prenda::where('usuario_id', $user2->id)->where('categoria', 'Camiseta')->first();
            $pantalon2   = Prenda::where('usuario_id', $user2->id)->where('categoria', 'Pantalón')->first();
            $zapatillas2 = Prenda::where('usuario_id', $user2->id)->where('categoria', 'Zapatillas')->first();

            if ($camiseta2 && $pantalon2 && $zapatillas2) {
                $outfit3 = Outfit::create([
                    'usuario_id'       => $user2->id,
                    'fecha_planificada' => Carbon::now(),
                    'fue_usado'        => false,
                ]);

                $outfit3->prendas()->attach([
                    $camiseta2->id,
                    $pantalon2->id,
                    $zapatillas2->id,
                ]);
            }

            // Segundo outfit para user2
            $sudadera2 = Prenda::where('usuario_id', $user2->id)->where('categoria', 'Sudadera')->first();

            if ($sudadera2 && $pantalon2 && $zapatillas2) {
                $outfit4 = Outfit::create([
                    'usuario_id'       => $user2->id,
                    'fecha_planificada' => Carbon::now()->addDay(),
                    'fue_usado'        => false,
                ]);

                $outfit4->prendas()->attach([
                    $sudadera2->id,
                    $pantalon2->id,
                    $zapatillas2->id,
                ]);
            }
        }
    }
}