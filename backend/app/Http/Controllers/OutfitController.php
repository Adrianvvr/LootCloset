<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use Illuminate\Http\Request;

class OutfitController extends Controller
{
    // 1. VER LOS OUTFITS
    public function index(Request $request)
    {
        // Traemos los outfits y también toda la ropa (prendas) que tienen dentro
        $outfits = $request->user()->outfits()->with('prendas')->orderBy('created_at', 'desc')->get();
        return response()->json($outfits, 200);
    }

    // 2. CREAR UN NUEVO OUTFIT
    public function store(Request $request)
    {
        $request->validate([
            'fecha_planificada' => 'nullable|date',
            'prendas' => 'required|array|min:1', // Exigimos que llegue un array con los IDs de la ropa
            'prendas.*' => 'exists:prendas,id' // Comprobamos que esos IDs sean prendas reales
        ]);

        // Creamos el Outfit (la "caja" vacía)
        $outfit = $request->user()->outfits()->create([
            'fecha_planificada' => $request->fecha_planificada,
            'fue_usado' => false
        ]);

        // ATTACH: Esta función guarda automáticamente las relaciones en la tabla intermedia (outfit_prenda)
        $outfit->prendas()->attach($request->prendas);

        return response()->json([
            'message' => '¡Outfit creado con éxito!',
            'outfit' => $outfit->load('prendas')
        ], 201);
    }

    // 3. ELIMINAR OUTFIT
    public function destroy(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->find($id);

        if (!$outfit) {
            return response()->json(['message' => 'Outfit no encontrado'], 404);
        }

        $outfit->delete();

        return response()->json(['message' => 'Outfit eliminado correctamente'], 200);
    }
}