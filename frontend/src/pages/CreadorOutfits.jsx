import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import Loader from '../components/Loader';

const mapaZonas = { "Camiseta": "capa_interior", "Vestido": "capa_interior", "Sudadera": "capa_exterior", "Chaqueta": "capa_exterior", "Abrigo": "capa_exterior", "Pantalón": "abajo", "Falda": "abajo", "Zapatos": "calzado", "Zapatillas": "calzado", "Accesorios": "accesorios", "Ropa Interior": "interior" };
const nombresZonas = { "capa_interior": "Interior", "capa_exterior": "Exterior", "abajo": "Parte de Abajo", "calzado": "Calzado", "accesorios": "Accesorios" };

function PrendaArrastrable({ prenda }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: prenda.id, data: prenda });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`, zIndex: 50 } : undefined;
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing">
            <div className="h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-2 pointer-events-none">
                {prenda.foto_url ? <img src={`http://localhost:8000${prenda.foto_url}`} className="w-full h-full object-cover" /> : <span className="text-3xl">👕</span>}
            </div>
            <p className="text-center font-semibold text-xs capitalize truncate">{prenda.categoria}</p>
        </div>
    );
}

function SlotOutfit({ zonaId, titulo, prenda, removerPrenda }) {
    const { isOver, setNodeRef } = useDroppable({ id: zonaId });
    return (
        <div className="flex flex-col items-center">
            <h4 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wide">{titulo}</h4>
            <div ref={setNodeRef} className={`w-full h-40 border-4 border-dashed rounded-2xl flex items-center justify-center p-2 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                {!prenda ? <span className="text-gray-400 text-xs">Arrastra aquí</span> : (
                    <div className="relative w-full h-full bg-white rounded-xl shadow-sm border border-gray-200">
                        <button onClick={(e) => { e.stopPropagation(); removerPrenda(zonaId, prenda); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-md z-20">✕</button>
                        <div className="h-full w-full rounded-lg overflow-hidden flex items-center justify-center">
                            {prenda.foto_url ? <img src={`http://localhost:8000${prenda.foto_url}`} className="w-full h-full object-cover" /> : <span className="text-4xl">👕</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CreadorOutfits() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [prendasDisponibles, setPrendasDisponibles] = useState([]);
    const [outfitSlots, setOutfitSlots] = useState({ capa_interior: null, capa_exterior: null, abajo: null, calzado: null, accesorios: null });
    const [fechaPlanificada, setFechaPlanificada] = useState('');
    const [cargandoInicial, setCargandoInicial] = useState(true);
    const [cargandoGuardar, setCargandoGuardar] = useState(false);

    useEffect(() => {
        const cargar = async () => {
            try {
                const resP = await axios.get('/prendas');
                let todas = resP.data;
                if (isEdit) {
                    const resO = await axios.get(`/outfits/${id}`);
                    setFechaPlanificada(resO.data.fecha_planificada || '');
                    const slots = { capa_interior: null, capa_exterior: null, abajo: null, calzado: null, accesorios: null };
                    resO.data.prendas.forEach(p => { const z = mapaZonas[p.categoria]; if (z) slots[z] = p; });
                    setOutfitSlots(slots);
                    const idsO = resO.data.prendas.map(p => p.id);
                    todas = todas.filter(p => !idsO.includes(p.id));
                }
                setPrendasDisponibles(todas);
            } finally { setCargandoInicial(false); }
        };
        cargar();
    }, [id, isEdit]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;
        const p = active.data.current;
        const zDest = over.id;
        if (mapaZonas[p.categoria] !== zDest) { alert(`Categoría incorrecta para esta zona`); return; }
        setPrendasDisponibles(prev => prev.filter(item => item.id !== p.id));
        setOutfitSlots(prev => {
            if (prev[zDest]) setPrendasDisponibles(dis => [...dis, prev[zDest]]);
            return { ...prev, [zDest]: p };
        });
    };

    const removerDelOutfit = (z, p) => { setOutfitSlots(prev => ({ ...prev, [z]: null })); setPrendasDisponibles(prev => [...prev, p]); };

    const guardar = async () => {
        const activas = Object.values(outfitSlots).filter(Boolean);
        if (activas.length === 0) return alert('Outfit vacío');
        setCargandoGuardar(true);
        try {
            const payload = { fecha_planificada: fechaPlanificada || null, prendas: activas.map(p => p.id) };
            if (isEdit) await axios.put(`/outfits/${id}`, payload);
            else await axios.post('/outfits', payload);
            navigate('/mis-outfits');
        } catch (err) { setCargandoGuardar(false); }
    };

    if (cargandoInicial) return <Loader mensaje="Cargando creador..." />;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">{isEdit ? 'Editando Outfit' : 'Creador de Outfits'}</h2>
                <button onClick={() => navigate('/mis-outfits')} className="text-gray-500 hover:text-gray-800">Cancelar</button>
            </div>
            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
                        <h3 className="font-bold text-xl mb-4 border-b pb-2">Tu Armario</h3>
                        <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
                            {Object.keys(nombresZonas).map(z => {
                                const ps = prendasDisponibles.filter(p => mapaZonas[p.categoria] === z);
                                if (ps.length === 0) return null;
                                return (
                                    <div key={z}>
                                        <h4 className="font-semibold text-gray-400 text-xs mb-3 uppercase">{nombresZonas[z]}</h4>
                                        <div className="grid grid-cols-3 gap-3">
                                            {ps.map(p => <PrendaArrastrable key={p.id} prenda={p} />)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <SlotOutfit zonaId="capa_exterior" titulo="Exterior" prenda={outfitSlots.capa_exterior} removerPrenda={removerDelOutfit} />
                                <SlotOutfit zonaId="capa_interior" titulo="Interior" prenda={outfitSlots.capa_interior} removerPrenda={removerDelOutfit} />
                                <SlotOutfit zonaId="accesorios" titulo="Accesorios" prenda={outfitSlots.accesorios} removerPrenda={removerDelOutfit} />
                                <SlotOutfit zonaId="abajo" titulo="Abajo" prenda={outfitSlots.abajo} removerPrenda={removerDelOutfit} />
                                <SlotOutfit zonaId="calzado" titulo="Calzado" prenda={outfitSlots.calzado} removerPrenda={removerDelOutfit} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-end gap-4 mt-auto">
                            <div className="flex-1 w-full text-left">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (opcional)</label>
                                <input type="date" value={fechaPlanificada} onChange={(e) => setFechaPlanificada(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none" />
                            </div>
                            <button onClick={guardar} disabled={cargandoGuardar} className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {cargandoGuardar ? 'Guardando...' : 'Guardar Outfit'}
                            </button>
                        </div>
                    </div>
                </div>
            </DndContext>
        </div>
    );
}