import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import Navbar from '../components/Navbar';
import PrendaCard from '../components/PrendaCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

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

    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            setPrendas(prendas.map(p => p.id === id ? { ...p, esta_limpia: true } : p));
        } catch (err) {
            console.error('Error al lavar', err);
            alert('Hubo un error al intentar lavar la prenda.');
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

    // Uso del nuevo componente Loader
    if (cargando) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={true} />
            <Loader mensaje="Cargando tu armario..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
            <Navbar isAuthenticated={true} />

            <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
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

                {/* Uso del nuevo componente EmptyState para ARMARIO VACÍO */}
                {prendas.length === 0 && !error && (
                    <EmptyState 
                        icono="🚪"
                        titulo="Tu armario está vacío"
                        descripcion="Aún no tienes ninguna prenda guardada. ¡Es hora de darle vida! Empieza a construir tu armario digital añadiendo tus prendas favoritas."
                        textoBoton="+ Añadir mi primera prenda"
                        onClickBoton={() => navigate('/nueva-prenda')}
                    />
                )}

                {/* Uso del nuevo componente EmptyState para SIN RESULTADOS DE BÚSQUEDA */}
                {prendas.length > 0 && prendasFiltradas.length === 0 && (
                    <EmptyState 
                        icono="🕵️‍♂️"
                        titulo="No encontramos resultados"
                        descripcion="Ninguna de tus prendas coincide con los filtros de búsqueda actuales."
                        textoBoton="Limpiar filtros"
                        colorBoton="bg-transparent text-purple-600 hover:bg-purple-50 hover:text-purple-800 underline"
                        onClickBoton={() => setFiltros({ busqueda: '', categoria: '', marca: '', estado: '' })}
                    />
                )}

                {prendasFiltradas.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {prendasFiltradas.map((prenda) => (
                            <PrendaCard 
                                key={prenda.id} 
                                prenda={prenda} 
                                onLavar={lavarPrenda} 
                                onEliminar={eliminarPrenda} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}