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
        $user = User::where('email', 'prueba@lootcloset.com')->first();

        // Buscamos prendas específicas del usuario para armar el outfit
        $camiseta = Prenda::where('usuario_id', $user->id)->where('categoria', 'Camiseta')->first();
        $pantalon = Prenda::where('usuario_id', $user->id)->where('categoria', 'Pantalón')->first();
        $zapatillas = Prenda::where('usuario_id', $user->id)->where('categoria', 'Zapatillas')->first();

        // Verificamos que encontró las prendas antes de crear el outfit
        if ($camiseta && $pantalon && $zapatillas) {
            
            // 1. Creamos el registro del Outfit
            $outfit = Outfit::create([
                'usuario_id' => $user->id,
                'fecha_planificada' => Carbon::tomorrow(), // Planeado para mañana
                'fue_usado' => false,
            ]);

            // 2. Vinculamos las prendas al outfit en la tabla pivote
            // (Asegúrate de que tu modelo Outfit.php tiene la relación public function prendas() { return $this->belongsToMany(Prenda::class); })
            $outfit->prendas()->attach([
                $camiseta->id,
                $pantalon->id,
                $zapatillas->id
            ]);
        }
    }
}