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

    // NUEVO: VER UN OUTFIT CONCRETO (Para editar)
    public function show(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->with('prendas')->find($id);

        if (!$outfit) {
            return response()->json(['message' => 'Outfit no encontrado'], 404);
        }

        return response()->json($outfit, 200);
    }

    // 2. CREAR UN NUEVO OUTFIT
    public function store(Request $request)
    {
        $request->validate([
            'fecha_planificada' => 'nullable|date',
            'prendas' => 'required|array|min:1',
            'prendas.*' => 'exists:prendas,id'
        ]);

        $outfit = $request->user()->outfits()->create([
            'fecha_planificada' => $request->fecha_planificada,
            'fue_usado' => false
        ]);

        $outfit->prendas()->attach($request->prendas);

        return response()->json([
            'message' => '¡Outfit creado con éxito!',
            'outfit' => $outfit->load('prendas')
        ], 201);
    }

    // NUEVO: ACTUALIZAR OUTFIT
    public function update(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->find($id);

        if (!$outfit) {
            return response()->json(['message' => 'Outfit no encontrado'], 404);
        }

        $request->validate([
            'fecha_planificada' => 'nullable|date',
            'prendas' => 'required|array|min:1',
            'prendas.*' => 'exists:prendas,id'
        ]);

        // Actualizamos los datos básicos
        $outfit->update([
            'fecha_planificada' => $request->fecha_planificada
        ]);

        // SYNC: Esta maravilla de Laravel borra las prendas viejas de la tabla intermedia y mete las nuevas automáticamente
        $outfit->prendas()->sync($request->prendas);

        return response()->json([
            'message' => '¡Outfit actualizado con éxito!',
            'outfit' => $outfit->load('prendas')
        ], 200);
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