import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TopPrendasList from '../components/TopPrendasList';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

// Colores para las porciones del quesito
const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function Dashboard() {
    const [datos, setDatos] = useState({ 
        top_rentables: [], 
        top_menos_rentables: [], 
        distribucion_categorias: [] 
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

    // Si está cargando, el Loader se mostrará debajo de la Navbar (puesta por el Layout)
    if (cargando) return <Loader mensaje="Calculando estadísticas de tu armario..." />;

    if (error) return (
        <div className="flex-grow flex items-center justify-center p-8 text-red-500 font-medium text-center">
            {error}
        </div>
    );

    return (
        <div className="container mx-auto p-4 md:p-8 w-full max-w-7xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
                Dashboard y Estadísticas 📊
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Lista Top Rentables */}
                <TopPrendasList 
                    titulo="Top 5: Más rentables" 
                    icono="🏆" 
                    colorTexto="text-green-600" 
                    prendas={datos.top_rentables} 
                />

                {/* Lista Top Menos Rentables */}
                <TopPrendasList 
                    titulo="Top 5: Menos rentables" 
                    icono="💸" 
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
                        icono="📊"
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