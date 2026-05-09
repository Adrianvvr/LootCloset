import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import getImageUrl from '../lib/getImageUrl';
import Loader from '../components/Loader';

export default function GeneradorOutfit() {
    const navigate = useNavigate();
    const [prendas, setPrendas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [fechaPlanificada, setFechaPlanificada] = useState('');
    const [guardando, setGuardando] = useState(false);

    const generar = async () => {
        setCargando(true);
        setError('');
        setPrendas([]);
        try {
            const res = await axios.get('/outfits/generar-aleatorio');
            setPrendas(res.data.prendas);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al generar el outfit');
        } finally {
            setCargando(false);
        }
    };

    const guardarOutfit = async () => {
        if (prendas.length === 0) return;
        setGuardando(true);
        try {
            await axios.post('/outfits', {
                fecha_planificada: fechaPlanificada || null,
                prendas: prendas.map(p => p.id)
            });
            navigate('/mis-outfits');
        } catch (err) {
            alert('Error al guardar el outfit');
            setGuardando(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 w-full flex flex-col items-center">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Generador Aleatorio 🎲</h2>
            <p className="text-gray-500 mb-8 text-center max-w-lg text-lg">
                ¿No sabes qué ponerte? Deja que el algoritmo elija por ti prendas limpias que combinan entre sí.
            </p>

            <button 
                onClick={generar} 
                disabled={cargando}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-4 px-10 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
                {cargando ? 'Generando...' : '¡Generar Outfit! ✨'}
            </button>

            {error && (
                <div className="mt-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl max-w-md text-center">
                    {error}
                </div>
            )}

            {prendas.length > 0 && (
                <div className="mt-12 w-full transition-all duration-500 ease-in-out opacity-100 translate-y-0">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Tu Outfit Sugerido</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                            {prendas.map(prenda => (
                                <div key={prenda.id} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                    <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden mb-3 bg-white flex items-center justify-center border border-gray-100">
                                        {prenda.foto_url ? (
                                            <img src={getImageUrl(prenda.foto_url)} alt={prenda.categoria} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-5xl">👕</span>
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-800 uppercase tracking-wide text-xs">{prenda.categoria}</span>
                                    <span className="text-gray-500 text-xs mt-1 capitalize">{prenda.color_principal || 'Sin color'}</span>
                                    <span className="text-gray-400 text-[10px] mt-1 capitalize">{prenda.marca?.nombre || 'Sin marca'}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 border border-gray-200">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Planificar uso (opcional)</label>
                                <input 
                                    type="date" 
                                    value={fechaPlanificada} 
                                    onChange={(e) => setFechaPlanificada(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>
                            <button 
                                onClick={guardarOutfit} 
                                disabled={guardando} 
                                className="w-full sm:w-auto px-8 py-3 mt-6 sm:mt-0 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors shadow-md"
                            >
                                {guardando ? 'Guardando...' : '💾 Guardar Outfit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
