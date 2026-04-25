import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

function PrendaArrastrable({ prenda }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: prenda.id,
        data: prenda
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow">
            <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-2 pointer-events-none">
                {prenda.foto_url ? (
                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl">👕</span>
                )}
            </div>
            <p className="text-center font-semibold text-sm capitalize truncate">{prenda.categoria}</p>
        </div>
    );
}

function ZonaOutfit({ prendasOutfit, removerPrenda }) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'zona-outfit',
    });

    return (
        <div ref={setNodeRef} className={`min-h-[400px] border-4 border-dashed rounded-2xl p-6 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}>
            {prendasOutfit.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-5xl mb-4">📥</span>
                    <p className="text-lg font-medium">Arrastra prendas aquí para montar tu outfit</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    {prendasOutfit.map(prenda => (
                        <div key={prenda.id} onClick={() => removerPrenda(prenda.id)} className="relative group bg-gray-50 p-2 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:bg-red-50 transition-colors" title="Haz clic para quitar del outfit">
                            <div className="absolute inset-0 bg-red-500 bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center rounded-xl transition-all">
                                <span className="opacity-0 group-hover:opacity-100 text-red-600 font-bold text-xl drop-shadow-md">X</span>
                            </div>
                            <div className="h-32 rounded-lg flex items-center justify-center overflow-hidden mb-2">
                                {prenda.foto_url ? (
                                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl">👕</span>
                                )}
                            </div>
                            <p className="text-center font-semibold text-sm capitalize truncate">{prenda.categoria}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CreadorOutfits() {
    const { id } = useParams(); // NUEVO: Saber si estamos editando
    const isEdit = Boolean(id);

    const [prendasDisponibles, setPrendasDisponibles] = useState([]);
    const [prendasOutfit, setPrendasOutfit] = useState([]);
    const [fechaPlanificada, setFechaPlanificada] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const inicializarDatos = async () => {
            try {
                // 1. Cargamos todo el armario
                const resPrendas = await axios.get('/prendas');
                let todasLasPrendas = resPrendas.data;

                // 2. Si editamos, cargamos el outfit
                if (isEdit) {
                    const resOutfit = await axios.get(`/outfits/${id}`);
                    const outfit = resOutfit.data;
                    
                    setFechaPlanificada(outfit.fecha_planificada || '');
                    setPrendasOutfit(outfit.prendas || []);

                    // Filtramos las prendas disponibles para quitar las que ya están en el outfit
                    const idsOutfit = outfit.prendas.map(p => p.id);
                    todasLasPrendas = todasLasPrendas.filter(p => !idsOutfit.includes(p.id));
                }

                setPrendasDisponibles(todasLasPrendas);
            } catch (err) {
                console.error("Error inicializando creador", err);
                setError("Error al cargar los datos.");
            }
        };
        inicializarDatos();
    }, [id, isEdit]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && over.id === 'zona-outfit') {
            const prendaArrastrada = active.data.current;
            setPrendasDisponibles(prev => prev.filter(p => p.id !== prendaArrastrada.id));
            setPrendasOutfit(prev => [...prev, prendaArrastrada]);
        }
    };

    const removerDelOutfit = (idPrenda) => {
        const prendaQuitada = prendasOutfit.find(p => p.id === idPrenda);
        setPrendasOutfit(prev => prev.filter(p => p.id !== idPrenda));
        setPrendasDisponibles(prev => [...prev, prendaQuitada]);
    };

    const guardarOutfit = async () => {
        if (prendasOutfit.length === 0) {
            alert('¡El outfit está vacío! Añade al menos una prenda.');
            return;
        }

        setCargando(true);
        try {
            const idsPrendas = prendasOutfit.map(p => p.id);
            const payload = {
                fecha_planificada: fechaPlanificada || null,
                prendas: idsPrendas
            };

            // NUEVO: Dependiendo de si editamos o creamos, usamos PUT o POST
            if (isEdit) {
                await axios.put(`/outfits/${id}`, payload);
                alert('¡Outfit actualizado con éxito!');
            } else {
                await axios.post('/outfits', payload);
                alert('¡Outfit creado con éxito!');
            }
            
            // He cambiado la redirección a "Mis Outfits" para que vea el resultado
            navigate('/mis-outfits'); 
        } catch (err) {
            console.error(err);
            alert('Hubo un error al guardar el outfit.');
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            {isEdit ? 'Editando Outfit ✏️' : 'Creador de Outfits ✨'}
                        </h2>
                        <p className="text-gray-500 mt-2">Arrastra ropa desde tu armario al lienzo para planificar tu conjunto.</p>
                    </div>
                    <button onClick={() => navigate('/mis-outfits')} className="text-gray-600 hover:text-gray-900 font-medium">
                        Cancelar y volver
                    </button>
                </div>

                {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

                <DndContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg mb-4 text-gray-700">Prendas Disponibles</h3>
                            <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-2">
                                {prendasDisponibles.map(prenda => (
                                    <PrendaArrastrable key={prenda.id} prenda={prenda} />
                                ))}
                                {prendasDisponibles.length === 0 && (
                                    <p className="col-span-2 text-center text-sm text-gray-400 mt-10">No hay más ropa disponible.</p>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <ZonaOutfit prendasOutfit={prendasOutfit} removerPrenda={removerDelOutfit} />
                            
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-end gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">¿Para cuándo es este outfit? (Opcional)</label>
                                    <input type="date" value={fechaPlanificada} onChange={(e) => setFechaPlanificada(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <button onClick={guardarOutfit} disabled={cargando} className="px-8 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                                    {cargando ? 'Guardando...' : (isEdit ? 'Actualizar Outfit' : 'Guardar Outfit')}
                                </button>
                            </div>
                        </div>

                    </div>
                </DndContext>
            </div>
        </div>
    );
}