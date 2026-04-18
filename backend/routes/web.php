<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => '¡API de Loot Closet funcionando al 100%!',
        'environment' => app()->environment(),
    ]);
});
