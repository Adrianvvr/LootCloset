<?php

namespace App\Http\Controllers;

use App\Models\Prenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrendaController extends Controller
{
    // 1. VER EL ARMARIO (Solo las prendas del usuario logueado)
    public function index(Request $request)
    {
        // Traemos las prendas y también el nombre de la marca asociada
        $prendas = $request->user()->prendas()->with('marca')->get();
        return response()->json($prendas, 200);
    }

    // 2. AÑADIR UNA PRENDA AL ARMARIO
    public function store(Request $request)
    {
        $request->validate([
            'marca_id' => 'required|exists:marcas,id',
            'categoria' => 'required|string|max:255',
            'color_principal' => 'nullable|string|max:50',
            'precio_compra' => 'nullable|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048' // Max 2MB
        ]);

        $rutaFoto = null;

        // Si el usuario sube una foto, la guardamos en la carpeta 'prendas'
        if ($request->hasFile('foto')) {
            $rutaFoto = $request->file('foto')->store('prendas', 'public');
        }

        // Creamos la prenda unida al usuario que hace la petición
        $prenda = $request->user()->prendas()->create([
            'marca_id' => $request->marca_id,
            'categoria' => $request->categoria,
            'color_principal' => $request->color_principal,
            'precio_compra' => $request->precio_compra,
            'foto_url' => $rutaFoto ? '/storage/' . $rutaFoto : null,
            'esta_limpia' => true,
            'contador_usos' => 0
        ]);

        return response()->json([
            'message' => '¡Prenda guardada en el armario!',
            'prenda' => $prenda
        ], 201);
    }

    // 3. ELIMINAR UNA PRENDA
    public function destroy(Request $request, $id)
    {
        // Buscamos la prenda, asegurándonos de que sea del usuario logueado
        $prenda = $request->user()->prendas()->find($id);

        if (!$prenda) {
            return response()->json(['message' => 'Prenda no encontrada o no te pertenece'], 404);
        }

        // Si la prenda tenía foto física, la borramos del disco del servidor
        if ($prenda->foto_url) {
            $rutaRelativa = str_replace('/storage/', '', $prenda->foto_url);
            Storage::disk('public')->delete($rutaRelativa);
        }

        $prenda->delete();

        return response()->json(['message' => 'Prenda tirada a la basura correctamente'], 200);
    }
}