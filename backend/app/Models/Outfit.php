<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Outfit extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'fecha_planificada',
        'fue_usado'
    ];

    // RELACIONES
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function prendas(): BelongsToMany
    {
        return $this->belongsToMany(Prenda::class, 'outfit_prenda', 'outfit_id', 'prenda_id')->withTimestamps();
    }
}