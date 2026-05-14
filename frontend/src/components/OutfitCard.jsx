import { useNavigate } from 'react-router-dom';
import getImageUrl from '../lib/getImageUrl';

export default function OutfitCard({ outfit, onEliminar, onUsar }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all relative group flex flex-col justify-between">
            <div>
                {/* BOTONES FLOTANTES (Se muestran al hacer hover) */}
                <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => navigate(`/editar-outfit/${outfit.id}`)}
                        className="text-gray-400 hover:text-amber-500 transition-colors"
                        title="Editar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                        onClick={() => onEliminar(outfit.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Borrar"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>

                {/* INFO DEL OUTFIT */}
                <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                        {outfit.fecha_planificada ? `Plan: ${outfit.fecha_planificada}` : 'Outfit de diario'}
                        {outfit.fue_usado ? (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                                Usado
                            </span>
                        ) : null}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {outfit.prendas?.length || 0} prendas en este conjunto
                    </p>
                </div>

                {/* MINIATURAS DE LAS PRENDAS */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-6 custom-scrollbar">
                    {outfit.prendas?.map(prenda => (
                        <div key={prenda.id} className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {prenda.foto_url ? (
                                <img
                                    src={getImageUrl(prenda.foto_url)}
                                    alt={prenda.categoria}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-400">Sin foto</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* BOTÓN PARA USAR EL OUTFIT */}
            <button
                onClick={() => onUsar(outfit.id)}
                className="w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
            >
                ¡Me lo pongo hoy!
            </button>
        </div>
    );
}