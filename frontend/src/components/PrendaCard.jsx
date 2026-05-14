import { useNavigate } from 'react-router-dom';
import getImageUrl from '../lib/getImageUrl';

export default function PrendaCard({ prenda, onLavar, onEnsuciar, onEliminar }) {
    const navigate = useNavigate();

    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            {/* BOTONES FLOTANTES */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {(!prenda.esta_limpia || prenda.esta_limpia === 0) ? (
                    <button
                        onClick={() => onLavar(prenda.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
                        title="Echar a lavar"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </button>
                ) : (
                    <button
                        onClick={() => onEnsuciar(prenda.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow-md"
                        title="Marcar como sucia"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </button>
                )}
                <button
                    onClick={() => navigate(`/editar-prenda/${prenda.id}`)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-md"
                    title="Editar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button
                    onClick={() => onEliminar(prenda.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
                    title="Eliminar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>

            <div className="h-48 bg-gray-200 flex items-center justify-center">
                {prenda.foto_url ? (
                    <img
                        src={getImageUrl(prenda.foto_url)}
                        alt={prenda.categoria}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-gray-400 font-medium">Sin foto</span>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-bold text-lg capitalize">{prenda.categoria}</h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">{prenda.marca?.nombre || 'Sin marca'}</p>
                <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prenda.esta_limpia ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {prenda.esta_limpia ? 'Limpia' : 'Sucia'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{prenda.contador_usos} usos</span>
                </div>
            </div>
        </div>
    );
}
