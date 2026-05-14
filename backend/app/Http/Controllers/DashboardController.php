<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prenda;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        \App\Models\Outfit::actualizarOutfitsPendientes($request->user());
        
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

        // Recordatorios de lavado: prendas sucias desde hace más de 3 días
        $recordatoriosLavado = Prenda::where('usuario_id', $usuarioId)
            ->where('esta_limpia', false)
            ->whereNotNull('fecha_ensuciado')
            ->where('fecha_ensuciado', '<=', now()->subDays(3))
            ->with('marca')
            ->get();

        // Recordatorios de uso: prendas sin usar hace más de 3 semanas (o nunca usadas y creadas hace >3 semanas)
        $recordatoriosUso = Prenda::where('usuario_id', $usuarioId)
            ->where(function($query) {
                $query->where('fecha_ultimo_uso', '<=', now()->subWeeks(3))
                      ->orWhere(function($q) {
                          $q->whereNull('fecha_ultimo_uso')
                            ->where('created_at', '<=', now()->subWeeks(3));
                      });
            })
            ->with('marca')
            ->get();

        return response()->json([
            'top_rentables' => $topRentables,
            'top_menos_rentables' => $topMenosRentables,
            'distribucion_categorias' => $categorias,
            'recordatorios_lavado' => $recordatoriosLavado,
            'recordatorios_uso' => $recordatoriosUso
        ]);
    }
}