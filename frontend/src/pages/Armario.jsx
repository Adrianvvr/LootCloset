import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function Armario() {
    const [prendas, setPrendas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [filtros, setFiltros] = useState({ busqueda: '', categoria: '', marca: '', estado: '' });

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

    // NUEVO: Función para lavar una prenda sucia
    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            // Actualizamos la prenda en el frontend sin tener que recargar la página entera
            setPrendas(prendas.map(p => p.id === id ? { ...p, esta_limpia: true } : p));
        } catch (err) {
            console.error('Error al lavar', err);
            alert('Hubo un error al intentar lavar la prenda.');
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

    const categoriasUnicas = useMemo(() => [...new Set(prendas.map(p => p.categoria).filter(Boolean))], [prendas]);
    const marcasUnicas = useMemo(() => [...new Set(prendas.map(p => p.marca?.nombre).filter(Boolean))], [prendas]);

    const prendasFiltradas = useMemo(() => {
        return prendas.filter(prenda => {
            const textoPrenda = `${prenda.categoria} ${prenda.marca?.nombre || ''}`.toLowerCase();
            const cumpleBusqueda = textoPrenda.includes(filtros.busqueda.toLowerCase());
            const cumpleCategoria = filtros.categoria ? prenda.categoria === filtros.categoria : true;
            const cumpleMarca = filtros.marca ? prenda.marca?.nombre === filtros.marca : true;
            let cumpleEstado = true;
            if (filtros.estado === 'limpia') cumpleEstado = prenda.esta_limpia === true || prenda.esta_limpia === 1;
            if (filtros.estado === 'sucia') cumpleEstado = prenda.esta_limpia === false || prenda.esta_limpia === 0;
            return cumpleBusqueda && cumpleCategoria && cumpleMarca && cumpleEstado;
        });
    }, [prendas, filtros]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    if (cargando) return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">Cargando tu armario... ⏳</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => navigate('/armario')}>
                    Loot Closet 👕
                </h1>
                <div className="flex gap-6 items-center">
                    {/* NUEVO BOTÓN: Enlace al Dashboard */}
                    <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                        Dashboard 📊
                    </button>
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
                        <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                            ✨ Crear Outfit
                        </button>
                        <button onClick={() => navigate('/nueva-prenda')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                            + Añadir Prenda
                        </button>
                    </div>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

                
                {prendas.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
                        <input type="text" name="busqueda" placeholder="Buscar categoría o marca..." value={filtros.busqueda} onChange={handleFiltroChange} className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                        <select name="categoria" value={filtros.categoria} onChange={handleFiltroChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 capitalize">
                            <option value="">Todas las categorías</option>
                            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <select name="marca" value={filtros.marca} onChange={handleFiltroChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 capitalize">
                            <option value="">Todas las marcas</option>
                            {marcasUnicas.map(marca => <option key={marca} value={marca}>{marca}</option>)}
                        </select>
                        <select name="estado" value={filtros.estado} onChange={handleFiltroChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700">
                            <option value="">Cualquier estado</option>
                            <option value="limpia">Solo Limpias ✨</option>
                            <option value="sucia">Solo Sucias 🧺</option>
                        </select>
                    </div>
                )}

                
                {prendas.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center mt-4">
                        <span className="text-6xl mb-4">🚪</span>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tu armario está vacío</h3>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Aún no tienes ninguna prenda guardada. ¡Es hora de darle vida! Empieza a construir tu armario digital añadiendo tus prendas favoritas.
                        </p>
                        <button 
                            onClick={() => navigate('/nueva-prenda')} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                            + Añadir mi primera prenda
                        </button>
                    </div>
                )}

                
                {prendas.length > 0 && prendasFiltradas.length === 0 && (
                    <div className="flex flex-col items-center justify-center bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center mt-4">
                        <span className="text-5xl mb-4">🕵️‍♂️</span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                        <p className="text-gray-500 mb-6">
                            Ninguna de tus prendas coincide con los filtros de búsqueda actuales.
                        </p>
                        <button 
                            onClick={() => setFiltros({ busqueda: '', categoria: '', marca: '', estado: '' })} 
                            className="text-purple-600 hover:text-purple-800 font-medium transition-colors underline"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}

                
                {prendasFiltradas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {prendasFiltradas.map((prenda) => (
                            <div key={prenda.id} className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                                
                                
                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    
                                    {(!prenda.esta_limpia || prenda.esta_limpia === 0) && (
                                        <button onClick={() => lavarPrenda(prenda.id)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md" title="Echar a lavar">
                                            🧼
                                        </button>
                                    )}
                                    
                                    <button onClick={() => navigate(`/editar-prenda/${prenda.id}`)} className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full shadow-md" title="Editar">
                                        ✏️
                                    </button>
                                    <button onClick={() => eliminarPrenda(prenda.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md" title="Eliminar">
                                        🗑️
                                    </button>
                                </div>

                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {prenda.foto_url ? (
                                        <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
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
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}