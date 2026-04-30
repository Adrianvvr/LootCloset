<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Marca extends Model
{
    use HasFactory;

    // Campos que se pueden rellenar
    protected $fillable = [
        'nombre',
        'enlace',     // Para la imagen
        'sitio_web'   // Para la URL de la tienda
    ];

    // Si tenías la relación con prendas (una marca tiene muchas prendas), sería así:
    public function prendas()
    {
        return $this->hasMany(Prenda::class);
    }
}