import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import Navbar from '../components/Navbar';
import OutfitCard from '../components/OutfitCard';
import Loader from '../components/Loader'; // <-- NUEVO
import EmptyState from '../components/EmptyState'; // <-- NUEVO

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
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            setError('Error al cargar tus outfits.');
            setCargando(false);
        }
    };

    const eliminarOutfit = async (id) => {
        const confirmar = window.confirm('⚠️ ¿Seguro que quieres borrar este outfit? (No se borrará tu ropa, solo el conjunto).');
        if (!confirmar) return;

        try {
            await axios.delete(`/outfits/${id}`);
            setOutfits(outfits.filter(outfit => outfit.id !== id));
        } catch (err) {
            console.error('Error al eliminar', err);
            alert('Hubo un problema al intentar eliminar el outfit.');
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

    // USAMOS EL LOADER
    if (cargando) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={true} />
            <Loader mensaje="Cargando tu estilo..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            <Navbar isAuthenticated={true} />

            <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Mis Outfits Guardados</h2>
                    <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer">
                        ✨ Crear Nuevo Outfit
                    </button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                {/* USAMOS EL EMPTY STATE */}
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
            </main>
        </div>
    );
}