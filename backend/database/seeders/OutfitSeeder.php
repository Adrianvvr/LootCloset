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
        $user = User::where('email', 'test@example.com')->first();
        if (!$user) return;

        // Obtenemos una prenda de cada categoría necesaria para el outfit
        $camiseta = Prenda::where('usuario_id', $user->id)->where('categoria', 'Camiseta')->first();
        $pantalon = Prenda::where('usuario_id', $user->id)->where('categoria', 'Pantalón')->first();
        $zapatillas = Prenda::where('usuario_id', $user->id)->where('categoria', 'Zapatillas')->first();

        if ($camiseta && $pantalon && $zapatillas) {
            // Creamos el Outfit
            $outfit = Outfit::create([
                'usuario_id' => $user->id,
                'fecha_planificada' => Carbon::now(), // Para hoy
                'fue_usado' => false,
            ]);

            // ESTO RELLENA LA TABLA PIVOTE (outfit_prenda)
            // Asegúrate de que el modelo Outfit tiene la relación prendas() definida
            $outfit->prendas()->attach([
                $camiseta->id,
                $pantalon->id,
                $zapatillas->id
            ]);
        }
    }
}