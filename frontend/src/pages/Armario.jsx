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
        if (!window.confirm('⚠️ ¿Seguro que quieres eliminar esta prenda?')) return;
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
        <div className="max-w-7xl mx-auto px-8 py-10 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Mi Armario</h2>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/crear-outfit')} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                        ✨ Crear Outfit
                    </button>
                    <button onClick={() => navigate('/nueva-prenda')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors">
                        + Añadir Prenda
                    </button>
                </div>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

            {prendas.length === 0 ? (
                <EmptyState icono="🚪" titulo="Armario vacío" descripcion="Añade prendas para empezar." textoBoton="+ Añadir prenda" onClickBoton={() => navigate('/nueva-prenda')} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {prendasFiltradas.map((prenda) => (
                        <PrendaCard key={prenda.id} prenda={prenda} onLavar={lavarPrenda} onEliminar={eliminarPrenda} />
                    ))}
                </div>
            )}
        </div>
    );
}