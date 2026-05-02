import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import Navbar from '../components/Navbar';

const mapaZonas = {
    "Camiseta": "capa_interior",
    "Vestido": "capa_interior",
    "Sudadera": "capa_exterior",
    "Chaqueta": "capa_exterior",
    "Abrigo": "capa_exterior",
    "Pantalón": "abajo",
    "Falda": "abajo",
    "Zapatos": "calzado",
    "Zapatillas": "calzado",
    "Accesorios": "accesorios",
    "Ropa Interior": "interior"
};

const nombresZonas = {
    "capa_interior": "Parte de Arriba (Interior)",
    "capa_exterior": "Parte de Arriba (Exterior)",
    "abajo": "Parte de Abajo",
    "calzado": "Calzado",
    "accesorios": "Accesorios"
};

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
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-2 pointer-events-none">
                {prenda.foto_url ? (
                    <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl">👕</span>
                )}
            </div>
            <p className="text-center font-semibold text-xs capitalize truncate">{prenda.categoria}</p>
        </div>
    );
}

function SlotOutfit({ zonaId, titulo, prenda, removerPrenda }) {
    const { isOver, setNodeRef } = useDroppable({
        id: zonaId,
    });

    return (
        <div className="flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide text-center h-8 flex items-end">{titulo}</h4>
            <div ref={setNodeRef} className={`w-full h-40 border-4 border-dashed rounded-2xl flex items-center justify-center p-2 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                {!prenda ? (
                    <span className="text-gray-400 font-medium text-xs text-center">Arrastra aquí</span>
                ) : (
                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-gray-200">
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                removerPrenda(zonaId, prenda);
                            }} 
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition-colors z-20"
                            title="Quitar prenda"
                        >
                            ✕
                        </button>
                        <div className="h-full w-full rounded-lg flex flex-col items-center justify-center overflow-hidden">
                            {prenda.foto_url ? (
                                <img src={`http://localhost:8000${prenda.foto_url}`} alt={prenda.categoria} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl mb-1">👕</span>
                            )}
                        </div>
                        <span className="absolute bottom-0 left-0 right-0 text-center bg-white bg-opacity-90 text-[10px] font-bold py-1 truncate rounded-b-lg border-t border-gray-100">{prenda.categoria}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CreadorOutfits() {
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [prendasDisponibles, setPrendasDisponibles] = useState([]);
    
    const [outfitSlots, setOutfitSlots] = useState({
        capa_interior: null,
        capa_exterior: null,
        abajo: null,
        calzado: null,
        accesorios: null
    });

    const [fechaPlanificada, setFechaPlanificada] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const inicializarDatos = async () => {
            try {
                const resPrendas = await axios.get('/prendas');
                let todasLasPrendas = resPrendas.data;

                if (isEdit) {
                    const resOutfit = await axios.get(`/outfits/${id}`);
                    const outfit = resOutfit.data;
                    
                    setFechaPlanificada(outfit.fecha_planificada || '');
                    
                    const outfitInicial = { capa_interior: null, capa_exterior: null, abajo: null, calzado: null, accesorios: null };
                    outfit.prendas.forEach(p => {
                        const zona = mapaZonas[p.categoria];
                        if (zona) outfitInicial[zona] = p;
                    });
                    setOutfitSlots(outfitInicial);

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
        if (!over) return;

        const prendaArrastrada = active.data.current;
        const zonaDestino = over.id; 
        const zonaCorrecta = mapaZonas[prendaArrastrada.categoria];

        if (zonaCorrecta !== zonaDestino) {
            alert(`No puedes poner una prenda de tipo '${prendaArrastrada.categoria}' en la sección de '${nombresZonas[zonaDestino] || zonaDestino}'.`);
            return;
        }

        setPrendasDisponibles(prev => prev.filter(p => p.id !== prendaArrastrada.id));

        setOutfitSlots(prev => {
            const prendaAnterior = prev[zonaDestino];
            if (prendaAnterior) {
                setPrendasDisponibles(disponibles => [...disponibles, prendaAnterior]);
            }
            return { ...prev, [zonaDestino]: prendaArrastrada };
        });
    };

    const removerDelOutfit = (zonaId, prendaQuitada) => {
        setOutfitSlots(prev => ({ ...prev, [zonaId]: null }));
        setPrendasDisponibles(prev => [...prev, prendaQuitada]);
    };

    const guardarOutfit = async () => {
        const prendasActivas = Object.values(outfitSlots).filter(Boolean);
        
        if (prendasActivas.length === 0) {
            alert('¡El outfit está vacío! Añade al menos una prenda.');
            return;
        }

        setCargando(true);
        try {
            const idsPrendas = prendasActivas.map(p => p.id);
            const payload = {
                fecha_planificada: fechaPlanificada || null,
                prendas: idsPrendas
            };

            if (isEdit) {
                await axios.put(`/outfits/${id}`, payload);
                alert('¡Outfit actualizado con éxito!');
            } else {
                await axios.post('/outfits', payload);
                alert('¡Outfit creado con éxito!');
            }
            
            navigate('/mis-outfits'); 
        } catch (err) {
            console.error(err);
            alert('Hubo un error al guardar el outfit.');
            setCargando(false);
        }
    };

    const agruparPrendasPorZona = (zona) => {
        return prendasDisponibles.filter(p => mapaZonas[p.categoria] === zona);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={true} />

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                {isEdit ? 'Editando Outfit ✏️' : 'Creador de Outfits ✨'}
                            </h2>
                            <p className="text-gray-500 mt-2">Arrastra ropa desde tu armario a su lugar correspondiente.</p>
                        </div>
                        <button onClick={() => navigate('/mis-outfits')} className="text-gray-600 hover:text-gray-900 font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100">
                            Cancelar y volver
                        </button>
                    </div>

                    {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

                    <DndContext onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            
                            {/* LADO IZQUIERDO: Armario */}
                            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[750px] flex flex-col">
                                <h3 className="font-bold text-xl mb-4 text-gray-800 border-b pb-2">Tu Armario</h3>
                                
                                <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
                                    {Object.keys(nombresZonas).map(zona => {
                                        const prendasDeEstaZona = agruparPrendasPorZona(zona);
                                        if (prendasDeEstaZona.length === 0) return null;

                                        return (
                                            <div key={zona}>
                                                <h4 className="font-semibold text-gray-600 mb-3 bg-gray-100 p-2 rounded-md">{nombresZonas[zona]}</h4>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {prendasDeEstaZona.map(prenda => (
                                                        <PrendaArrastrable key={prenda.id} prenda={prenda} />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {prendasDisponibles.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 mt-20">
                                            <span className="text-5xl mb-4">📭</span>
                                            <p>No tienes ropa disponible para añadir.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* LADO DERECHO: El creador del Outfit */}
                            <div className="lg:col-span-7 space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                                        <div className="col-span-1">
                                            <SlotOutfit zonaId="capa_exterior" titulo="Capa Exterior (Sudaderas/Abrigos)" prenda={outfitSlots.capa_exterior} removerPrenda={removerDelOutfit} />
                                        </div>
                                        <div className="col-span-1">
                                            <SlotOutfit zonaId="capa_interior" titulo="Capa Interior (Camisetas/Tops)" prenda={outfitSlots.capa_interior} removerPrenda={removerDelOutfit} />
                                        </div>
                                        <div className="col-span-1">
                                            <SlotOutfit zonaId="accesorios" titulo="Accesorios" prenda={outfitSlots.accesorios} removerPrenda={removerDelOutfit} />
                                        </div>
                                        <div className="col-span-1 md:col-start-1 md:col-span-1">
                                            <SlotOutfit zonaId="abajo" titulo="Parte de Abajo" prenda={outfitSlots.abajo} removerPrenda={removerDelOutfit} />
                                        </div>
                                        <div className="col-span-1 md:col-span-1">
                                            <SlotOutfit zonaId="calzado" titulo="Calzado" prenda={outfitSlots.calzado} removerPrenda={removerDelOutfit} />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-end gap-4">
                                    <div className="flex-1 w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">¿Para cuándo es este outfit? (Opcional)</label>
                                        <input type="date" value={fechaPlanificada} onChange={(e) => setFechaPlanificada(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <button onClick={guardarOutfit} disabled={cargando} className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-md">
                                        {cargando ? 'Guardando...' : (isEdit ? 'Actualizar Outfit' : 'Guardar Outfit')}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </DndContext>
                </div>
            </main>
        </div>
    );
}