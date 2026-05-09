import { useNavigate } from 'react-router-dom';
import getImageUrl from '../lib/getImageUrl';

export default function PrendaCard({ prenda, onLavar, onEliminar }) {
    const navigate = useNavigate();

    return (
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
            {/* BOTONES FLOTANTES */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                {(!prenda.esta_limpia || prenda.esta_limpia === 0) && (
                    <button 
                        onClick={() => onLavar(prenda.id)} 
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md" 
                        title="Echar a lavar"
                    >
                        🧼
                    </button>
                )}
                <button 
                    onClick={() => navigate(`/editar-prenda/${prenda.id}`)} 
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-md" 
                    title="Editar"
                >
                    ✏️
                </button>
                <button 
                    onClick={() => onEliminar(prenda.id)} 
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md" 
                    title="Eliminar"
                >
                    🗑️
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
                    <span className="text-4xl">👕</span>
                )}
            </div>
            
            <div className="p-4">
                <h3 className="font-bold text-lg capitalize">{prenda.categoria}</h3>
                <p className="text-sm text-gray-500 mb-2 capitalize">{prenda.marca?.nombre || 'Sin marca'}</p>
                <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prenda.esta_limpia ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {prenda.esta_limpia ? 'Limpia ✨' : 'Sucia 🧺'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{prenda.contador_usos} usos</span>
                </div>
            </div>
        </div>
    );
}