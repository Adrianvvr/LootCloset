<?php

namespace App\Http\Controllers;

use App\Models\Outfit;
use Illuminate\Http\Request;

class OutfitController extends Controller
{
    public function index(Request $request)
    {
        $outfits = $request->user()->outfits()->with('prendas')->orderBy('created_at', 'desc')->get();
        
        $today = now()->format('Y-m-d');
        $updatedAny = false;

        foreach ($outfits as $outfit) {
            if ($outfit->fecha_planificada === $today && !$outfit->fue_usado) {
                $outfit->update(['fue_usado' => true]);
                foreach ($outfit->prendas as $prenda) {
                    $prenda->esta_limpia = false;
                    $prenda->contador_usos += 1;
                    $prenda->save();
                }
                $updatedAny = true;
            }
        }

        if ($updatedAny) {
            $outfits = $request->user()->outfits()->with('prendas')->orderBy('created_at', 'desc')->get();
        }

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

        if ($request->fecha_planificada === now()->format('Y-m-d')) {
            $outfit->update(['fue_usado' => true]);
            foreach ($outfit->prendas as $prenda) {
                $prenda->esta_limpia = false;
                $prenda->contador_usos += 1;
                $prenda->save();
            }
        }

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

        if ($request->fecha_planificada === now()->format('Y-m-d') && !$outfit->fue_usado) {
            $outfit->update(['fue_usado' => true]);
            foreach ($outfit->prendas as $prenda) {
                $prenda->esta_limpia = false;
                $prenda->contador_usos += 1;
                $prenda->save();
            }
        }

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

    // 👇 NUEVA FUNCIÓN: GENERAR ALEATORIO 👇
    public function generarAleatorio(Request $request)
    {
        $prendasLimpias = $request->user()->prendas()->with('marca')->where('esta_limpia', true)->get();

        $mapaZonas = [
            "Camiseta" => "capa_interior", "Vestido" => "capa_interior", 
            "Sudadera" => "capa_exterior", "Chaqueta" => "capa_exterior", "Abrigo" => "capa_exterior", 
            "Pantalón" => "abajo", "Falda" => "abajo", 
            "Zapatos" => "calzado", "Zapatillas" => "calzado", 
            "Accesorios" => "accesorios", "Ropa Interior" => "interior"
        ];

        $coloresNeutros = ['Blanco', 'Negro', 'Gris', 'Beige'];

        $interiores = [];
        $exteriores = [];
        $abajos = [];
        $calzados = [];
        $accesorios = [];

        foreach ($prendasLimpias as $p) {
            $zona = $mapaZonas[$p->categoria] ?? null;
            if ($zona === 'capa_interior') $interiores[] = $p;
            elseif ($zona === 'capa_exterior') $exteriores[] = $p;
            elseif ($zona === 'abajo') $abajos[] = $p;
            elseif ($zona === 'calzado') $calzados[] = $p;
            elseif ($zona === 'accesorios') $accesorios[] = $p;
        }

        if (empty($interiores) || empty($calzados)) {
            return response()->json(['message' => 'No hay suficientes prendas limpias (faltan partes superiores o calzado).'], 400);
        }

        $outfit = [];

        // 1. Elegir interior
        $interiorElegido = $interiores[array_rand($interiores)];
        $outfit[] = $interiorElegido;

        // 2. Elegir abajo (Si no es vestido)
        if ($interiorElegido->categoria !== 'Vestido') {
            if (empty($abajos)) {
                return response()->json(['message' => 'No hay pantalones/faldas limpias.'], 400);
            }

            $interiorEsLlamativo = !in_array($interiorElegido->color_principal, $coloresNeutros) && $interiorElegido->color_principal !== null;
            
            $abajosFiltrados = $abajos;
            if ($interiorEsLlamativo) {
                // Intentar buscar un abajo neutro
                $neutros = array_filter($abajos, function($p) use ($coloresNeutros) {
                    return in_array($p->color_principal, $coloresNeutros);
                });
                if (!empty($neutros)) {
                    $abajosFiltrados = $neutros;
                }
            }

            // array_rand con un solo elemento u otro
            $abajoElegido = $abajosFiltrados[array_rand($abajosFiltrados)];
            $outfit[] = $abajoElegido;
        }

        // 3. Elegir calzado
        $outfit[] = $calzados[array_rand($calzados)];

        // 4. Exterior opcional (50% prob si hay)
        if (!empty($exteriores) && rand(0, 1) === 1) {
            $outfit[] = $exteriores[array_rand($exteriores)];
        }

        // 5. Accesorio opcional (30% prob si hay)
        if (!empty($accesorios) && rand(1, 10) <= 3) {
            $outfit[] = $accesorios[array_rand($accesorios)];
        }

        return response()->json(['prendas' => $outfit], 200);
    }
}