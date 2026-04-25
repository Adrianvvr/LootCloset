<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use Illuminate\Http\Request;

class OutfitController extends Controller
{
    public function index(Request $request)
    {
        $outfits = $request->user()->outfits()->with('prendas')->orderBy('created_at', 'desc')->get();
        return response()->json($outfits, 200);
    }

    public function show(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->with('prendas')->find($id);
        if (!$outfit) return response()->json(['message' => 'Outfit no encontrado'], 404);
        return response()->json($outfit, 200);
    }

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

    public function update(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->find($id);
        if (!$outfit) return response()->json(['message' => 'Outfit no encontrado'], 404);

        $request->validate([
            'fecha_planificada' => 'nullable|date',
            'prendas' => 'required|array|min:1',
            'prendas.*' => 'exists:prendas,id'
        ]);

        $outfit->update(['fecha_planificada' => $request->fecha_planificada]);
        $outfit->prendas()->sync($request->prendas);

        return response()->json([
            'message' => '¡Outfit actualizado con éxito!',
            'outfit' => $outfit->load('prendas')
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->find($id);
        if (!$outfit) return response()->json(['message' => 'Outfit no encontrado'], 404);

        $outfit->delete();
        return response()->json(['message' => 'Outfit eliminado correctamente'], 200);
    }

    // 👇 NUEVA FUNCIÓN: USAR OUTFIT 👇
    public function usar(Request $request, $id)
    {
        $outfit = $request->user()->outfits()->with('prendas')->find($id);
        if (!$outfit) return response()->json(['message' => 'Outfit no encontrado'], 404);

        // Marcamos el outfit como usado (ya lo tenías en tu modelo)
        $outfit->update(['fue_usado' => true]);

        // Recorremos su ropa para ensuciarla y sumarle 1 uso
        foreach ($outfit->prendas as $prenda) {
            $prenda->esta_limpia = false;
            $prenda->contador_usos += 1;
            $prenda->save();
        }

        return response()->json([
            'message' => '¡Outfit usado! La ropa se ha ensuciado.', 
            'outfit' => $outfit->load('prendas')
        ], 200);
    }
}