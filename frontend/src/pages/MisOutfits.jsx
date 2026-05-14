import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import OutfitCard from '../components/OutfitCard';
import Loader from '../components/Loader'; 
import EmptyState from '../components/EmptyState'; 

export default function MisOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerOutfits();
    }, []);

    const obtenerOutfits = async () => {
        try {
            const response = await axios.get('/outfits');
            setOutfits(response.data);
            setCargando(false);
        } catch (err) {
            setError('Error al cargar tus outfits.');
            setCargando(false);
        }
    };

    const eliminarOutfit = async (id) => {
        if (!window.confirm('⚠️ ¿Seguro que quieres borrar este outfit?')) return;
        try {
            await axios.delete(`/outfits/${id}`);
            setOutfits(outfits.filter(outfit => outfit.id !== id));
        } catch (err) {
            alert('Hubo un problema al eliminar.');
        }
    };

    const usarOutfit = async (id) => {
        try {
            const response = await axios.post(`/outfits/${id}/usar`);
            alert(response.data.message); 
            setOutfits(outfits.map(o => o.id === id ? { ...o, fue_usado: true } : o));
        } catch (err) {
            alert('Error al intentar usar el outfit.');
        }
    };

    if (cargando) return <Loader mensaje="Cargando tu estilo..." />;

    return (
        <div className="max-w-7xl w-full mx-auto px-8 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center sm:text-left">Mis Outfits Guardados</h2>
                <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer w-full sm:w-auto">
                    ✨ Crear Nuevo Outfit
                </button>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

            {outfits.length === 0 ? (
                <EmptyState 
                    icono="👗"
                    titulo="Aún no has creado ningún conjunto"
                    descripcion="¡Ve al Creador de Outfits y empieza a combinar tu ropa!"
                    textoBoton="Crear mi primer outfit"
                    onClickBoton={() => navigate('/crear-outfit')}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outfits.map((outfit) => (
                        <OutfitCard 
                            key={outfit.id} 
                            outfit={outfit} 
                            onUsar={usarOutfit} 
                            onEliminar={eliminarOutfit} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}