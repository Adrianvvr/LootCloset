import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import PrendaCard from '../components/PrendaCard';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

export default function Armario() {
    const navigate = useNavigate();
    const [prendas, setPrendas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [filtros, setFiltros] = useState({ busqueda: '', categoria: '', marca: '', estado: '' });

    useEffect(() => {
        obtenerPrendas();
    }, []);

    const obtenerPrendas = async () => {
        try {
            const response = await axios.get('/prendas');
            setPrendas(response.data);
        } catch (err) {
            setError('Error al cargar el armario.');
        } finally {
            setCargando(false);
        }
    };

    const eliminarPrenda = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta prenda?')) return;
        try {
            await axios.delete(`/prendas/${id}`);
            setPrendas(prendas.filter(p => p.id !== id));
        } catch (err) { alert('Error al eliminar.'); }
    };

    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            setPrendas(prendas.map(p => p.id === id ? { ...p, esta_limpia: true } : p));
        } catch (err) { alert('Error al lavar.'); }
    };

    const ensuciarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/ensuciar`);
            setPrendas(prendas.map(p => p.id === id ? { ...p, esta_limpia: false } : p));
        } catch (err) { alert('Error al ensuciar.'); }
    };

    const prendasFiltradas = useMemo(() => {
        return prendas.filter(prenda => {
            const texto = `${prenda.categoria} ${prenda.marca?.nombre || ''}`.toLowerCase();
            const cumpleBusqueda = texto.includes(filtros.busqueda.toLowerCase());
            const cumpleEstado = !filtros.estado || (filtros.estado === 'limpia' ? prenda.esta_limpia : !prenda.esta_limpia);
            return cumpleBusqueda && cumpleEstado;
        });
    }, [prendas, filtros]);

    if (cargando) return <Loader mensaje="Cargando armario..." />;

    return (
        <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center sm:text-left w-full sm:w-auto">Mi Armario</h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                        Crear Outfit
                    </button>
                    <button onClick={() => navigate('/nueva-prenda')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center w-full sm:w-auto">
                        + Añadir Prenda
                    </button>
                </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

            {prendas.length === 0 ? (
                <EmptyState icono={<svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} titulo="Armario vacío" descripcion="Añade prendas para empezar." textoBoton="+ Añadir prenda" onClickBoton={() => navigate('/nueva-prenda')} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {prendasFiltradas.map((prenda) => (
                        <PrendaCard key={prenda.id} prenda={prenda} onLavar={lavarPrenda} onEnsuciar={ensuciarPrenda} onEliminar={eliminarPrenda} />
                    ))}
                </div>
            )}
        </div>
    );
}
