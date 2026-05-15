<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\PrendaController;
use App\Http\Controllers\OutfitController;
use App\Http\Controllers\DashboardController; // <-- AÑADIDO: Importamos el nuevo controlador

/*
|--------------------------------------------------------------------------
| RUTAS PÚBLICAS (Cualquiera puede entrar)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Marcas, Colores y Categorías públicos (Movido aquí fuera)
Route::get('/marcas', [MarcaController::class, 'index']);
Route::get('/colores', function () {
    return response()->json(["Blanco", "Negro", "Gris", "Azul", "Rojo", "Verde", "Amarillo", "Naranja", "Marrón", "Rosa", "Morado", "Beige", "Multicolor"]);
});
Route::get('/categorias', function () {
    return response()->json(["Camiseta", "Pantalón", "Sudadera", "Chaqueta", "Abrigo", "Vestido", "Zapatos", "Zapatillas", "Accesorios", "Ropa Interior"]);
});

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Solo usuarios con Token válido)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Perfil y Seguridad
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Marcas (Solo crear está protegido)
    Route::post('/marcas', [MarcaController::class, 'store']);

    // Prendas del Armario
    Route::get('/prendas', [PrendaController::class, 'index']);
    Route::post('/prendas', [PrendaController::class, 'store']);
    Route::get('/prendas/{id}', [PrendaController::class, 'show']);
    Route::put('/prendas/{id}', [PrendaController::class, 'update']);
    Route::delete('/prendas/{id}', [PrendaController::class, 'destroy']);
    Route::patch('/prendas/{id}/lavar', [PrendaController::class, 'lavar']);
    Route::patch('/prendas/{id}/ensuciar', [PrendaController::class, 'ensuciar']);
    
    // Outfits
    Route::get('/outfits/generar-aleatorio', [OutfitController::class, 'generarAleatorio']);
    Route::get('/outfits', [OutfitController::class, 'index']);
    Route::post('/outfits', [OutfitController::class, 'store']);
    Route::get('/outfits/{id}', [OutfitController::class, 'show']);
    Route::put('/outfits/{id}', [OutfitController::class, 'update']);
    Route::delete('/outfits/{id}', [OutfitController::class, 'destroy']);
    Route::post('/outfits/{id}/usar', [OutfitController::class, 'usar']);
    
    // Dashboard / Estadísticas
    Route::get('/dashboard', [DashboardController::class, 'index']); // <-- NUEVA: Ruta para las estadísticas
});