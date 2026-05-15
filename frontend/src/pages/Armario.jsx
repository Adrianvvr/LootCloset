import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import PrendaCard from '../components/PrendaCard';
import FiltrosPrendas from '../components/FiltrosPrendas';
import Paginacion from '../components/Paginacion';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const FILTROS_INICIALES = { busqueda: '', categoria: '', marca: '', estado: '', orden: '' };
const PRENDAS_POR_PAGINA = 12;

export default function Armario() {
    const navigate = useNavigate();
    const [prendas, setPrendas]       = useState([]);
    const [marcas, setMarcas]         = useState([]);
    const [cargando, setCargando]     = useState(true);
    const [error, setError]           = useState('');
    const [filtros, setFiltros]       = useState(FILTROS_INICIALES);
    const [paginaActual, setPagina]   = useState(1);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [resPrendas, resMarcas] = await Promise.all([
                    axios.get('/prendas'),
                    axios.get('/marcas'),
                ]);
                setPrendas(resPrendas.data);
                setMarcas(resMarcas.data);
            } catch (err) {
                setError('Error al cargar el armario.');
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, []);

    // Volver a página 1 cada vez que cambian los filtros
    const handleFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        setPagina(1);
    };

    const eliminarPrenda = async (id) => {
        if (!window.confirm('¿Seguro que quieres eliminar esta prenda?')) return;
        try {
            await axios.delete(`/prendas/${id}`);
            setPrendas(prev => prev.filter(p => p.id !== id));
        } catch (err) { alert('Error al eliminar.'); }
    };

    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            setPrendas(prev => prev.map(p => p.id === id ? { ...p, esta_limpia: true } : p));
        } catch (err) { alert('Error al lavar.'); }
    };

    const ensuciarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/ensuciar`);
            setPrendas(prev => prev.map(p => p.id === id ? { ...p, esta_limpia: false } : p));
        } catch (err) { alert('Error al ensuciar.'); }
    };

    // --- Filtrado + Ordenación ---
    const prendasFiltradas = useMemo(() => {
        let resultado = prendas.filter(prenda => {
            const texto = `${prenda.categoria} ${prenda.marca?.nombre || ''} ${prenda.color_principal || ''}`.toLowerCase();
            const cumpleBusqueda  = !filtros.busqueda  || texto.includes(filtros.busqueda.toLowerCase());
            const cumpleCategoria = !filtros.categoria || prenda.categoria === filtros.categoria;
            const cumpleMarca     = !filtros.marca     || String(prenda.marca_id) === String(filtros.marca);
            const cumpleEstado    = !filtros.estado
                || (filtros.estado === 'limpia' ? prenda.esta_limpia : !prenda.esta_limpia);
            return cumpleBusqueda && cumpleCategoria && cumpleMarca && cumpleEstado;
        });

        switch (filtros.orden) {
            case 'usos_desc':   resultado.sort((a, b) => b.contador_usos - a.contador_usos); break;
            case 'usos_asc':    resultado.sort((a, b) => a.contador_usos - b.contador_usos); break;
            case 'precio_desc': resultado.sort((a, b) => b.precio_compra - a.precio_compra); break;
            case 'precio_asc':  resultado.sort((a, b) => a.precio_compra - b.precio_compra); break;
            case 'reciente':    resultado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
            default: break;
        }
        return resultado;
    }, [prendas, filtros]);

    // --- Paginación ---
    const totalPaginas   = Math.ceil(prendasFiltradas.length / PRENDAS_POR_PAGINA);
    const paginaSegura   = Math.min(paginaActual, totalPaginas || 1);
    const inicio         = (paginaSegura - 1) * PRENDAS_POR_PAGINA;
    const prendasPagina  = prendasFiltradas.slice(inicio, inicio + PRENDAS_POR_PAGINA);

    const irAPagina = (n) => {
        setPagina(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (cargando) return <Loader mensaje="Cargando armario..." />;

    return (
        <div className="w-full px-4 sm:px-8 lg:px-12 py-10">
            {/* CABECERA */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center sm:text-left w-full sm:w-auto">
                    Mi Armario
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={() => navigate('/crear-outfit')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        Crear Outfit
                    </button>
                    <button
                        onClick={() => navigate('/nueva-prenda')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center w-full sm:w-auto"
                    >
                        + Añadir Prenda
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            {prendas.length === 0 ? (
                <EmptyState
                    icono={
                        <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                    titulo="Armario vacío"
                    descripcion="Añade prendas para empezar."
                    textoBoton="+ Añadir prenda"
                    onClickBoton={() => navigate('/nueva-prenda')}
                />
            ) : (
                <>
                    {/* FILTROS */}
                    <FiltrosPrendas
                        filtros={filtros}
                        onChange={handleFiltros}
                        marcas={marcas}
                        totalPrendas={prendas.length}
                        totalFiltradas={prendasFiltradas.length}
                    />

                    {/* GRID O ESTADO VACÍO */}
                    {prendasFiltradas.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <p className="text-lg font-medium">Sin resultados</p>
                            <p className="text-sm mt-1">Prueba a cambiar los filtros.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {prendasPagina.map((prenda) => (
                                    <PrendaCard
                                        key={prenda.id}
                                        prenda={prenda}
                                        onLavar={lavarPrenda}
                                        onEnsuciar={ensuciarPrenda}
                                        onEliminar={eliminarPrenda}
                                    />
                                ))}
                            </div>

                            {/* PAGINACIÓN */}
                            <Paginacion
                                paginaActual={paginaSegura}
                                totalPaginas={totalPaginas}
                                onChange={irAPagina}
                            />

                            {/* Indicador de página en móvil */}
                            {totalPaginas > 1 && (
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    Página {paginaSegura} de {totalPaginas}
                                </p>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
