import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function Armario() {
    const [prendas, setPrendas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerPrendas();
    }, []);

    const obtenerPrendas = async () => {
        try {
            const response = await axios.get('/prendas');
            setPrendas(response.data);
            setCargando(false);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            setError('Error al cargar el armario. Inténtalo de nuevo.');
            setCargando(false);
        }
    };

    const eliminarPrenda = async (id) => {
        const confirmar = window.confirm('⚠️ ¿Seguro que quieres tirar esta prenda a la basura?');
        if (!confirmar) return;

        try {
            await axios.delete(`/prendas/${id}`);
            setPrendas(prendas.filter(prenda => prenda.id !== id));
        } catch (err) {
            console.error('Error al eliminar', err);
            alert('Hubo un problema al intentar eliminar la prenda.');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al cerrar sesión', err);
        }
    };

    if (cargando) return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">Cargando tu armario... ⏳</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* 👇 ESTA ES LA BARRA DE NAVEGACIÓN ACTUALIZADA 👇 */}
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/armario')}>
                    Loot Closet 👕
                </h1>
                <div className="flex gap-6 items-center">
                    <button onClick={() => navigate('/mis-outfits')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Mis Outfits
                    </button>
                    <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                        Cerrar Sesión
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-extrabold text-gray-900">Mi Armario</h2>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => navigate('/crear-outfit')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                        >
                            ✨ Crear Outfit
                        </button>
                        <button 
                            onClick={() => navigate('/nueva-prenda')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm cursor-pointer"
                        >
                            + Añadir Prenda
                        </button>
                    </div>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                {prendas.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">Tu armario está vacío. ¡Es hora de ir de compras o añadir tu primera prenda!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {prendas.map((prenda) => (
                            <div key={prenda.id} className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                <button 
                                    onClick={() => eliminarPrenda(prenda.id)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                    title="Tirar a la basura"
                                >
                                    🗑️
                                </button>
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {prenda.foto_url ? (
                                        <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">👕</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg capitalize">{prenda.categoria}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{prenda.marca?.nombre || 'Sin marca'}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {prenda.esta_limpia ? 'Limpia ✨' : 'Sucia 🧺'}
                                        </span>
                                        <span className="text-sm font-medium text-gray-900">{prenda.contador_usos} usos</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}