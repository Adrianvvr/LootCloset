<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\PrendaController;
use App\Http\Controllers\OutfitController;

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Cualquiera puede entrar)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Solo usuarios con Token válido)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Seguridad
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Marcas
    Route::get('/marcas', [MarcaController::class, 'index']);
    Route::post('/marcas', [MarcaController::class, 'store']);

    // Prendas del Armario
    Route::get('/prendas', [PrendaController::class, 'index']);
    Route::post('/prendas', [PrendaController::class, 'store']);
    Route::get('/prendas/{id}', [PrendaController::class, 'show']);     // <-- NUEVA: Para cargar los datos en React
    Route::put('/prendas/{id}', [PrendaController::class, 'update']);   // <-- NUEVA: Para guardar los cambios
    Route::delete('/prendas/{id}', [PrendaController::class, 'destroy']);
    
    // Outfits
    Route::get('/outfits', [OutfitController::class, 'index']);
    Route::post('/outfits', [OutfitController::class, 'store']);
    Route::get('/outfits/{id}', [OutfitController::class, 'show']);
    Route::put('/outfits/{id}', [OutfitController::class, 'update']);
    Route::delete('/outfits/{id}', [OutfitController::class, 'destroy']);
});