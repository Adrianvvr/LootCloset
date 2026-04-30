<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Marca;

class MarcaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $marcas = [
            [
                'nombre' => 'Nike', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
                'sitio_web' => 'https://www.nike.com'
            ],
            [
                'nombre' => 'Adidas', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg',
                'sitio_web' => 'https://www.adidas.es'
            ],
            [
                'nombre' => 'Zara', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg',
                'sitio_web' => 'https://www.zara.com'
            ],
            [
                'nombre' => 'H&M', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
                'sitio_web' => 'https://www2.hm.com'
            ],
            [
                'nombre' => 'Vans', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/9/90/Vans_logo.svg',
                'sitio_web' => 'https://www.vans.es'
            ],
            [
                'nombre' => 'Puma', 
                'enlace' => 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.svg',
                'sitio_web' => 'https://eu.puma.com'
            ]
        ];

        foreach ($marcas as $marca) {
            Marca::create($marca);
        }
    }
}