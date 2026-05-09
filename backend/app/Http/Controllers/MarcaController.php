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
        // Validamos los campos
        $request->validate([
            'nombre' => 'required|string|unique:marcas|max:255',
            'enlace' => 'nullable|string|url|max:255', // Ahora es opcional
            'sitio_web' => 'nullable|string|url|max:255' // Opcional y formato URL para la tienda
        ]);

        // Creamos la marca con todos sus datos
        $marca = Marca::create([
            'nombre' => $request->nombre,
            'enlace' => $request->enlace ?? 'https://via.placeholder.com/400x400.png?text=Sin+Logo', // Valor por defecto si no se pasa
            'sitio_web' => $request->sitio_web
        ]);

        return response()->json([
            'message' => 'Marca creada correctamente',
            'marca' => $marca
        ], 201);
    }
}