import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import TopPrendasList from '../components/TopPrendasList';
import Loader from '../components/Loader'; // <-- NUEVO
import EmptyState from '../components/EmptyState'; // <-- NUEVO

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

function Dashboard() {
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

  // USAMOS EL LOADER
  if (cargando) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAuthenticated={true} />
        <Loader mensaje="Calculando estadísticas de tu armario..." />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar isAuthenticated={true} />
        <div className="flex-grow p-8 flex justify-center items-center text-red-500">
            {error}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isAuthenticated={true} />

      <main className="flex-grow container mx-auto p-4 md:p-8 w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard y Estadísticas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <TopPrendasList 
            titulo="Top 5: Más rentables" 
            icono="🏆" 
            colorTexto="text-green-600" 
            prendas={datos.top_rentables} 
          />
          <TopPrendasList 
            titulo="Top 5: Menos rentables" 
            icono="💸" 
            colorTexto="text-red-500" 
            prendas={datos.top_menos_rentables} 
          />
        </div>

        {/* Gráfica de Categorías */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Distribución de tu Armario</h2>
          
          {/* USAMOS EL EMPTY STATE SI NO HAY DATOS PARA LA GRÁFICA */}
          {datos.distribucion_categorias.length === 0 ? (
            <EmptyState 
                icono="📊"
                titulo="Sin datos suficientes"
                descripcion="Todavía no tienes prendas registradas para mostrar la gráfica."
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
                    formatter={(value, name) => [`${value} prendas`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;