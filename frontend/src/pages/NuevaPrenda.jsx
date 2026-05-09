import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';
import Loader from '../components/Loader';

const categoriasPredefinidas = ["Camiseta", "Pantalón", "Sudadera", "Chaqueta", "Abrigo", "Vestido", "Zapatos", "Zapatillas", "Accesorios", "Ropa Interior"];

export default function NuevaPrenda() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [marcas, setMarcas] = useState([]);
    const [marcaId, setMarcaId] = useState('');
    const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false);
    const [nombreNuevaMarca, setNombreNuevaMarca] = useState('');
    const [categoria, setCategoria] = useState('');
    const [colorPrincipal, setColorPrincipal] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const [cargandoInicial, setCargandoInicial] = useState(true);

    useEffect(() => {
        const inicializar = async () => {
            try {
                const resMarcas = await axios.get('/marcas');
                setMarcas(resMarcas.data);
                if (resMarcas.data.length > 0 && !isEdit) setMarcaId(resMarcas.data[0].id);

                if (isEdit) {
                    const resPrenda = await axios.get(`/prendas/${id}`);
                    const p = resPrenda.data;
                    setCategoria(p.categoria || '');
                    setColorPrincipal(p.color_principal || '');
                    setPrecioCompra(p.precio_compra || '');
                    setMarcaId(p.marca_id || '');
                    if (p.foto_url) setFotoPreview(`http://localhost:8000${p.foto_url}`);
                }
            } finally { setCargandoInicial(false); }
        };
        inicializar();
    }, [id, isEdit]);

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) { setFoto(file); setFotoPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);
        try {
            let idMarcaFinal = marcaId;
            if (mostrarNuevaMarca && nombreNuevaMarca) {
                const res = await axios.post('/marcas', { nombre: nombreNuevaMarca });
                idMarcaFinal = res.data.marca.id;
            }
            const formData = new FormData();
            formData.append('marca_id', idMarcaFinal);
            formData.append('categoria', categoria);
            if (colorPrincipal) formData.append('color_principal', colorPrincipal);
            if (precioCompra) formData.append('precio_compra', precioCompra);
            if (foto) formData.append('foto', foto);
            if (isEdit) formData.append('_method', 'PUT');

            await axios.post(isEdit ? `/prendas/${id}` : '/prendas', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/armario');
        } catch (err) {
            setError('Error al guardar la prenda');
            setCargando(false);
        }
    };

    if (cargandoInicial) return <Loader mensaje="Preparando formulario..." />;

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center w-full">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-gray-900 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{isEdit ? 'Editar Prenda ✏️' : 'Nueva Prenda 👕'}</h2>
                    <button onClick={() => navigate('/armario')} className="text-gray-300 hover:text-white font-medium">Cerrar</button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            {mostrarNuevaMarca ? (
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Nombre nueva marca" value={nombreNuevaMarca} onChange={(e) => setNombreNuevaMarca(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required />
                                    <button type="button" onClick={() => { setMostrarNuevaMarca(false); setNombreNuevaMarca(''); }} className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Volver</button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required={!mostrarNuevaMarca}>
                                        <option value="">Selecciona marca</option>
                                        {marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                                    </select>
                                    <button type="button" onClick={() => { setMostrarNuevaMarca(true); setMarcaId(''); }} className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg">Nueva</button>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
                            <input type="number" step="0.01" min="0" placeholder="0.00" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative">
                            {fotoPreview ? <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-4xl">📸</span>}
                            <input type="file" className="hidden" accept="image/*" onChange={handleFotoChange} />
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select required value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                            <option value="">Categoría...</option>
                            {categoriasPredefinidas.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="text" placeholder="Color" value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <button type="submit" disabled={cargando} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all">
                        {cargando ? 'Guardando...' : 'Guardar Prenda'}
                    </button>
                </form>
            </div>
        </div>
    );
}