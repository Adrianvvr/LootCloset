import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import getImageUrl from '../lib/getImageUrl';
import Loader from '../components/Loader';

// Función para obtener el lunes de la semana actual
const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay() || 7; // Si es domingo (0), hacemos que sea 7
    if (day !== 1) {
        date.setHours(-24 * (day - 1));
    }
    return date;
};

// Formatear a YYYY-MM-DD local
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const diasNombres = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function Calendario() {
    const navigate = useNavigate();
    const [outfits, setOutfits] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [currentDate, setCurrentDate] = useState(getMonday(new Date()));

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const response = await axios.get('/outfits');
                setOutfits(response.data);
            } catch (err) {
                console.error("Error cargando outfits", err);
            } finally {
                setCargando(false);
            }
        };
        fetchOutfits();
    }, []);

    const nextWeek = () => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + 7);
        setCurrentDate(next);
    };

    const prevWeek = () => {
        const prev = new Date(currentDate);
        prev.setDate(currentDate.getDate() - 7);
        setCurrentDate(prev);
    };

    // Generar array de días de la semana actual
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(currentDate);
        d.setDate(currentDate.getDate() + i);
        return d;
    });

    const mesAno = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase());

    if (cargando) return <Loader mensaje="Cargando calendario..." />;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Calendario de Outfits</h2>
            <p className="text-gray-500 mb-8">Planifica tus looks de la semana</p>

            <div className="flex justify-between items-center mb-6 px-2">
                <button 
                    onClick={prevWeek}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    &larr; Anterior
                </button>
                <h3 className="text-xl font-bold text-gray-800 capitalize">{mesAno}</h3>
                <button 
                    onClick={nextWeek}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    Siguiente &rarr;
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 flex-grow">
                {weekDays.map((day, i) => {
                    const dateStr = formatDate(day);
                    const outfit = outfits.find(o => o.fecha_planificada === dateStr);
                    const isToday = dateStr === formatDate(new Date());

                    return (
                        <div key={dateStr} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[300px]">
                            {/* Cabecera del día */}
                            <div className={`py-3 flex flex-col items-center justify-center border-b border-gray-100 ${isToday ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-600'}`}>
                                <span className="text-xs font-semibold uppercase tracking-wider">{diasNombres[i]}</span>
                                <span className={`text-xl font-bold ${isToday ? 'text-indigo-700' : 'text-gray-900'}`}>{day.getDate()}</span>
                            </div>

                            {/* Contenido */}
                            <div className="flex-grow flex flex-col items-center p-3">
                                {outfit ? (
                                    <>
                                        <div className="flex-grow flex flex-col gap-2 w-full mb-3 justify-center">
                                            {/* Mostrar prendas en miniatura, ordenadas un poco visualmente */}
                                            {/* Priorizamos: capa_interior o exterior, abajo, calzado */}
                                            {outfit.prendas.slice(0, 4).map(prenda => (
                                                <div key={prenda.id} className="w-full h-12 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden" title={prenda.categoria}>
                                                    {prenda.foto_url ? (
                                                        <img src={getImageUrl(prenda.foto_url)} alt={prenda.categoria} className="h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xl">👕</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/editar-outfit/${outfit.id}`)}
                                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-colors mt-auto"
                                        >
                                            Editar
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex-grow flex flex-col items-center justify-center w-full group">
                                        <button 
                                            onClick={() => navigate(`/crear-outfit?fecha=${dateStr}`)}
                                            className="w-full h-full min-h-[150px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border-2 border-transparent border-dashed hover:border-indigo-200"
                                        >
                                            <span className="text-3xl">+</span>
                                            <span className="text-sm font-medium">Añadir outfit</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-indigo-800 text-sm mt-0.5">
                    <strong>Consejo:</strong> Planifica tus outfits con antelación para ahorrar tiempo por las mañanas
                </p>
            </div>
        </div>
    );
}
