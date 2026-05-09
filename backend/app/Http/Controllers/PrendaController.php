<?php

namespace App\Http\Controllers;

use App\Models\Prenda;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PrendaController extends Controller
{
    public function index(Request $request)
    {
        $prendas = $request->user()->prendas()->with('marca')->get();
        return response()->json($prendas, 200);
    }

    public function show(Request $request, $id)
    {
        $prenda = $request->user()->prendas()->find($id);
        if (!$prenda) return response()->json(['message' => 'Prenda no encontrada'], 404);
        return response()->json($prenda, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'marca_id' => 'required|exists:marcas,id',
            'categoria' => 'required|string|in:Camiseta,Pantalón,Sudadera,Chaqueta,Abrigo,Vestido,Zapatos,Zapatillas,Accesorios,Ropa Interior',
            'color_principal' => 'required|string|in:Blanco,Negro,Gris,Azul,Rojo,Verde,Amarillo,Naranja,Marrón,Rosa,Morado,Beige,Multicolor',
            'precio_compra' => 'nullable|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        $rutaFoto = null;
        if ($request->hasFile('foto')) {
            $rutaFoto = $request->file('foto')->store('prendas', 'public');
        }

        $prenda = $request->user()->prendas()->create([
            'marca_id' => $request->marca_id,
            'categoria' => $request->categoria,
            'color_principal' => $request->color_principal,
            'precio_compra' => $request->precio_compra,
            'foto_url' => $rutaFoto ? '/storage/' . $rutaFoto : null,
            'esta_limpia' => true,
            'contador_usos' => 0
        ]);

        return response()->json(['message' => '¡Prenda guardada!', 'prenda' => $prenda], 201);
    }

    public function update(Request $request, $id)
    {
        $prenda = $request->user()->prendas()->find($id);
        if (!$prenda) return response()->json(['message' => 'Prenda no encontrada'], 404);

        $request->validate([
            'marca_id' => 'required|exists:marcas,id',
            'categoria' => 'required|string|in:Camiseta,Pantalón,Sudadera,Chaqueta,Abrigo,Vestido,Zapatos,Zapatillas,Accesorios,Ropa Interior',
            'color_principal' => 'required|string|in:Blanco,Negro,Gris,Azul,Rojo,Verde,Amarillo,Naranja,Marrón,Rosa,Morado,Beige,Multicolor',
            'precio_compra' => 'nullable|numeric',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'
        ]);

        if ($request->hasFile('foto')) {
            if ($prenda->foto_url) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $prenda->foto_url));
            }
            $rutaFoto = $request->file('foto')->store('prendas', 'public');
            $prenda->foto_url = '/storage/' . $rutaFoto;
        }

        $prenda->update([
            'marca_id' => $request->marca_id,
            'categoria' => $request->categoria,
            'color_principal' => $request->color_principal,
            'precio_compra' => $request->precio_compra,
        ]);

        return response()->json(['message' => 'Prenda actualizada', 'prenda' => $prenda], 200);
    }

    public function destroy(Request $request, $id)
    {
        $prenda = $request->user()->prendas()->find($id);
        if (!$prenda) return response()->json(['message' => 'Prenda no encontrada'], 404);

        if ($prenda->foto_url) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $prenda->foto_url));
        }

        $prenda->delete();
        return response()->json(['message' => 'Prenda eliminada'], 200);
    }

    // 👇 NUEVA FUNCIÓN: LAVAR PRENDA 👇
    public function lavar(Request $request, $id)
    {
        $prenda = $request->user()->prendas()->find($id);
        if (!$prenda) return response()->json(['message' => 'Prenda no encontrada'], 404);

        $prenda->update(['esta_limpia' => true]);

        return response()->json(['message' => '¡Prenda reluciente!', 'prenda' => $prenda], 200);
    }
}