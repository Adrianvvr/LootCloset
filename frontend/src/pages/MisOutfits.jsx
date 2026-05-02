import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import Navbar from '../components/Navbar';

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

    if (cargando) return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">Cargando tu estilo... ⏳</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            {/* USAMOS LA NAVBAR */}
            <Navbar isAuthenticated={true} />

            <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Mis Outfits Guardados</h2>
                    <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer">
                        ✨ Crear Nuevo Outfit
                    </button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                {outfits.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <span className="text-5xl mb-4 block">👗</span>
                        <p className="text-gray-500 text-lg">Aún no has creado ningún conjunto.</p>
                        <p className="text-gray-400 mt-2">¡Ve al Creador de Outfits y empieza a combinar tu ropa!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outfits.map((outfit) => (
                            <div key={outfit.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all relative group flex flex-col justify-between">
                                
                                <div>
                                    <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => navigate(`/editar-outfit/${outfit.id}`)} className="text-gray-400 hover:text-amber-500 transition-colors" title="Editar">✏️</button>
                                        <button onClick={() => eliminarOutfit(outfit.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Borrar">🗑️</button>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                                            {outfit.fecha_planificada ? `📅 ${outfit.fecha_planificada}` : 'Outfit de diario'}
                                            {outfit.fue_usado && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">Usado</span>}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {outfit.prendas?.length || 0} prendas en este conjunto
                                        </p>
                                    </div>

                                    <div className="flex gap-3 overflow-x-auto pb-2 mb-6 custom-scrollbar">
                                        {outfit.prendas?.map(prenda => (
                                            <div key={prenda.id} className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                {prenda.foto_url ? (
                                                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-2xl">👕</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => usarOutfit(outfit.id)}
                                    className="w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white shadow-sm"
                                >
                                    🚶‍♂️ ¡Me lo pongo hoy!
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}