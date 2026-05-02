<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            MarcaSeeder::class,   // 1º Las marcas
            UserSeeder::class,    // 2º Los usuarios
            PrendaSeeder::class,  // 3º Las prendas (necesitan marcas y usuarios)
            OutfitSeeder::class,  // 4º Los outfits (necesitan prendas y usuarios)
        ]);
    }
}