import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import TopPrendasList from '../components/TopPrendasList';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export default function Dashboard() {
  const [datos, setDatos] = useState({ top_rentables: [], top_menos_rentables: [], distribucion_categorias: [] });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const respuesta = await axios.get('/dashboard');
        setDatos(respuesta.data);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  if (cargando) return <Loader mensaje="Calculando estadísticas..." />;

  return (
    <div className="container mx-auto p-4 md:p-8 w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <TopPrendasList titulo="Más rentables" icono="🏆" colorTexto="text-green-600" prendas={datos.top_rentables} />
          <TopPrendasList titulo="Menos rentables" icono="💸" colorTexto="text-red-500" prendas={datos.top_menos_rentables} />
        </div>
        {/* Gráfica... */}
    </div>
  );
}