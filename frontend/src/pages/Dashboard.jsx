import { useEffect, useState } from 'react';
import axios from '../lib/axios'; // Usamos tu instancia de axios
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Colores para la gráfica de quesito
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
        // CORRECCIÓN APLICADA: Quitamos el /api/ porque axios.js ya lo incluye
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

  if (cargando) return <div className="p-8 text-center text-gray-500 font-semibold animate-pulse">Calculando estadísticas de tu armario...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard y Estadísticas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        
        {/* Top 5 Rentables */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
            🏆 Top 5: Más rentables
          </h2>
          <ul className="space-y-4">
            {datos.top_rentables.length === 0 && <p className="text-gray-500 text-sm">No hay prendas con precio registrado.</p>}
            {datos.top_rentables.map((prenda, index) => (
              <li key={prenda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-400 w-4">{index + 1}</span>
                  {prenda.foto_url ? (
                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-12 h-12 object-cover rounded-md shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">Sin foto</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-700 capitalize">{prenda.categoria}</p>
                    <p className="text-xs text-gray-500">Usos: {prenda.contador_usos}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{prenda.coste_por_uso} €</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">por uso</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top 5 Menos Rentables */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
            💸 Top 5: Menos rentables
          </h2>
          <ul className="space-y-4">
            {datos.top_menos_rentables.length === 0 && <p className="text-gray-500 text-sm">No hay prendas con precio registrado.</p>}
            {datos.top_menos_rentables.map((prenda, index) => (
              <li key={prenda.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-400 w-4">{index + 1}</span>
                  {prenda.foto_url ? (
                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-12 h-12 object-cover rounded-md shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">Sin foto</div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-700 capitalize">{prenda.categoria}</p>
                    <p className="text-xs text-gray-500">Usos: {prenda.contador_usos}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">{prenda.coste_por_uso} €</p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">por uso</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Gráfica de Categorías */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Distribución de tu Armario</h2>
        {datos.distribucion_categorias.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Todavía no tienes prendas registradas para mostrar la gráfica.</p>
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
    </div>
  );
}

export default Dashboard;