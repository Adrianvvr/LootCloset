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

    // LÓGICA DE ACTUALIZACIÓN DE OUTFITS PLANIFICADOS
    public static function actualizarOutfitsPendientes($user)
    {
        $today = now()->format('Y-m-d');
        $outfitsPendientes = $user->outfits()
            ->with('prendas')
            ->where('fue_usado', false)
            ->whereNotNull('fecha_planificada')
            ->where('fecha_planificada', '<=', $today)
            ->get();

        foreach ($outfitsPendientes as $outfit) {
            $outfit->update(['fue_usado' => true]);
            foreach ($outfit->prendas as $prenda) {
                if (!in_array($prenda->categoria, ['Zapatos', 'Zapatillas'])) {
                    $prenda->esta_limpia = false;
                    $prenda->fecha_ensuciado = now();
                }
                $prenda->fecha_ultimo_uso = now();
                $prenda->contador_usos += 1;
                $prenda->save();
            }
        }
    }
}