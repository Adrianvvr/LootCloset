<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Prenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'marca_id',
        'foto_url',
        'categoria',
        'color_principal',
        'precio_compra',
        'esta_limpia',
        'fecha_ensuciado',
        'fecha_ultimo_uso',
        'contador_usos'
    ];

    // RELACIONES
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function marca(): BelongsTo
    {
        return $this->belongsTo(Marca::class, 'marca_id');
    }

    public function outfits(): BelongsToMany
    {
        return $this->belongsToMany(Outfit::class, 'outfit_prenda', 'prenda_id', 'outfit_id')->withTimestamps();
    }
}