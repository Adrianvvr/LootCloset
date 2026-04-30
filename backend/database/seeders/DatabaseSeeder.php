<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Aquí llamas a tu nuevo seeder
        $this->call([
            UserSeeder::class,
            MarcaSeeder::class,
            PrendaSeeder::class,
            OutfitSeeder::class,
        ]);
    }
}