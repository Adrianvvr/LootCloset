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
        } catch (err) {
            alert('Error al eliminar.');
        }
    };

    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            setPrendas(prendas.map(p => p.id === id ? { ...p, esta_limpia: true } : p));
        } catch (err) {
            alert('Error al lavar.');
        }
    };

    const prendasFiltradas = useMemo(() => {
        return prendas.filter(prenda => {
            const texto = `${prenda.categoria} ${prenda.marca?.nombre || ''}`.toLowerCase();
            const cumpleBusqueda = texto.includes(filtros.busqueda.toLowerCase());
            const cumpleEstado = !filtros.estado || 
                (filtros.estado === 'limpia' ? prenda.esta_limpia : !prenda.esta_limpia);
            return cumpleBusqueda && cumpleEstado;
        });
    }, [prendas, filtros]);

    if (cargando) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={true} />
            <Loader mensaje="Cargando armario..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
            <Navbar isAuthenticated={true} />
            <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
                {/* ... (Cabecera y Filtros se mantienen igual) ... */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900">Mi Armario</h2>
                </div>

                {prendas.length === 0 ? (
                    <EmptyState 
                        icono="🚪" titulo="Armario vacío" descripcion="Añade prendas para empezar."
                        textoBoton="+ Añadir prenda" onClickBoton={() => navigate('/nueva-prenda')}
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {prendasFiltradas.map((prenda) => (
                            <PrendaCard key={prenda.id} prenda={prenda} onLavar={lavarPrenda} onEliminar={eliminarPrenda} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}