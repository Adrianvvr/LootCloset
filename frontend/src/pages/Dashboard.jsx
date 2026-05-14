import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TopPrendasList from '../components/TopPrendasList';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import getImageUrl from '../lib/getImageUrl';

// Colores para las porciones del quesito
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
    const [datos, setDatos] = useState({
        top_rentables: [],
        top_menos_rentables: [],
        distribucion_categorias: [],
        recordatorios_lavado: [],
        recordatorios_uso: []
    });
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const respuesta = await axios.get('/dashboard');
                setDatos(respuesta.data);
            } catch (err) {
                console.error("Error obteniendo estadísticas", err);
                setError('Hubo un problema al cargar los datos del dashboard.');
            } finally {
                setCargando(false);
            }
        };

        obtenerDatos();
    }, []);

    const lavarPrenda = async (id) => {
        try {
            await axios.patch(`/prendas/${id}/lavar`);
            // Remove it from the local state
            setDatos(prev => ({
                ...prev,
                recordatorios_lavado: prev.recordatorios_lavado.filter(p => p.id !== id)
            }));
        } catch (err) {
            console.error("Error al lavar prenda", err);
            alert("No se pudo lavar la prenda.");
        }
    };

    // Si está cargando, el Loader se mostrará debajo de la Navbar (puesta por el Layout)
    if (cargando) return <Loader mensaje="Calculando estadísticas de tu armario..." />;

    if (error) return (
        <div className="flex-grow flex items-center justify-center p-8 text-red-500 font-medium text-center">
            {error}
        </div>
    );

    return (
        <div className="w-full px-4 sm:px-8 lg:px-12 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
                Dashboard y Estadísticas
            </h1>

            {/* AVISOS DE LAVADO */}
            {datos.recordatorios_lavado && datos.recordatorios_lavado.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-md shadow-sm">
                    <div className="flex items-center mb-2">
                        <span className="mr-2 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </span>
                        <h3 className="text-lg font-bold text-yellow-800">Recordatorio de Lavandería</h3>
                    </div>
                    <p className="text-yellow-700 mb-4">
                        Tienes prendas que llevan sucias más de 3 días. ¡Es hora de hacer la colada!
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {datos.recordatorios_lavado.map(prenda => (
                            <div key={prenda.id} className="bg-white p-3 rounded-lg flex items-center shadow-sm border border-yellow-200">
                                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-3">
                                    {prenda.foto_url ? (
                                        <img src={getImageUrl(prenda.foto_url)} alt={prenda.categoria} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">Sin foto</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{prenda.marca?.nombre || 'Sin marca'} - {prenda.categoria}</p>
                                    <p className="text-xs text-gray-500">Color: {prenda.color_principal || 'N/A'}</p>
                                </div>
                                <button
                                    onClick={() => lavarPrenda(prenda.id)}
                                    className="ml-2 px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-bold rounded-full transition-colors"
                                >
                                    ¡Lavada!
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AVISOS DE ROPA SIN USAR */}
            {datos.recordatorios_uso && datos.recordatorios_uso.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-md shadow-sm">
                    <div className="flex items-center mb-2">
                        <span className="mr-2 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                        <h3 className="text-lg font-bold text-blue-800">Ropa olvidada</h3>
                    </div>
                    <p className="text-blue-700 mb-4">
                        Tienes prendas que llevan más de 3 semanas sin usarse. ¡Anímate a ponértelas!
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {datos.recordatorios_uso.map(prenda => (
                            <div key={prenda.id} className="bg-white p-3 rounded-lg flex items-center shadow-sm border border-blue-200">
                                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden mr-3">
                                    {prenda.foto_url ? (
                                        <img src={getImageUrl(prenda.foto_url)} alt={prenda.categoria} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 font-medium">Sin foto</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm truncate">{prenda.marca?.nombre || 'Sin marca'} - {prenda.categoria}</p>
                                    <p className="text-xs text-gray-500">Color: {prenda.color_principal || 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Lista Top Rentables */}
                <TopPrendasList
                    titulo="Top 5: Más rentables"
                    icono={<svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    colorTexto="text-green-600"
                    prendas={datos.top_rentables}
                />

                {/* Lista Top Menos Rentables */}
                <TopPrendasList
                    titulo="Top 5: Menos rentables"
                    icono={<svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                    colorTexto="text-red-500"
                    prendas={datos.top_menos_rentables}
                />
            </div>

            {/* SECCIÓN DE LA GRÁFICA */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-10">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                    Distribución de categorías
                </h2>

                {datos.distribucion_categorias.length === 0 ? (
                    <EmptyState
                        icono={<svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>}
                        titulo="Sin datos"
                        descripcion="No hay suficientes prendas para generar la gráfica."
                    />
                ) : (
                    <div className="w-full h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={datos.distribucion_categorias}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={130}
                                    fill="#8884d8"
                                    dataKey="cantidad"
                                    nameKey="categoria"
                                >
                                    {datos.distribucion_categorias.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [`${value} prendas`, name]}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
