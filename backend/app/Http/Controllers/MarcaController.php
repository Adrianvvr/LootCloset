<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;

class MarcaController extends Controller
{
    // Obtener todas las marcas
    public function index()
    {
        return response()->json(Marca::all(), 200);
    }

    // Crear una marca nueva
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|unique:marcas|max:255'
        ]);

        $marca = Marca::create([
            'nombre' => $request->nombre
        ]);

        return response()->json([
            'message' => 'Marca creada correctamente',
            'marca' => $marca
        ], 201);
    }
}