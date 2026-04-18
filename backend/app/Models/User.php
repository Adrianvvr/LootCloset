<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // <-- ESTA ES LA MAGIA QUE FALTABA
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    // Y LA AÑADIMOS AQUÍ:
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // RELACIONES
    public function prendas(): HasMany
    {
        return $this->hasMany(Prenda::class, 'usuario_id');
    }

    public function outfits(): HasMany
    {
        return $this->hasMany(Outfit::class, 'usuario_id');
    }
}