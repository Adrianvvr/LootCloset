<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prenda;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $usuarioId = $request->user()->id;

        // Obtenemos las prendas del usuario que tengan un precio asignado
        $prendas = Prenda::where('usuario_id', $usuarioId)
            ->whereNotNull('precio_compra')
            ->get();

        // Calculamos el coste por uso al vuelo
        $prendas->map(function ($prenda) {
            // Si no se ha usado nunca, dividimos entre 1 para evitar error matemático
            $usos = $prenda->contador_usos > 0 ? $prenda->contador_usos : 1; 
            $prenda->coste_por_uso = round($prenda->precio_compra / $usos, 2);
            return $prenda;
        });

        // Ordenamos y sacamos los Top 5
        $topRentables = $prendas->sortBy('coste_por_uso')->take(5)->values();
        $topMenosRentables = $prendas->sortByDesc('coste_por_uso')->take(5)->values();

        // Datos para la gráfica de quesito: ¿Cuántas prendas hay por categoría?
        $categorias = Prenda::where('usuario_id', $usuarioId)
            ->selectRaw('categoria, count(*) as cantidad')
            ->groupBy('categoria')
            ->get();

        return response()->json([
            'top_rentables' => $topRentables,
            'top_menos_rentables' => $topMenosRentables,
            'distribucion_categorias' => $categorias
        ]);
    }
}