import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import Navbar from '../components/Navbar';
import OutfitCard from '../components/OutfitCard';
import Loader from '../components/Loader'; 
import EmptyState from '../components/EmptyState'; 

export default function MisOutfits() {
    const [outfits, setOutfits] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerOutfits();
    }, []);

    const obtenerOutfits = async () => {
        try {
            const response = await axios.get('/outfits');
            setOutfits(response.data);
        } finally {
            setCargando(false);
        }
    };

    const usarOutfit = async (id) => {
        try {
            const response = await axios.post(`/outfits/${id}/usar`);
            alert(response.data.message); 
            setOutfits(outfits.map(o => o.id === id ? { ...o, fue_usado: true } : o));
        } catch (err) { alert('Error al usar outfit'); }
    };

    if (cargando) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar isAuthenticated={true} />
            <Loader mensaje="Cargando outfits..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col text-gray-800">
            <Navbar isAuthenticated={true} />
            <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-10">
                {outfits.length === 0 ? (
                    <EmptyState icono="👗" titulo="Sin outfits" descripcion="Crea tu primer conjunto." />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {outfits.map(outfit => (
                            <OutfitCard key={outfit.id} outfit={outfit} onUsar={usarOutfit} onEliminar={(id) => {/* lógica eliminar */}} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}