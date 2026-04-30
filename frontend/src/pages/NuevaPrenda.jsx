import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../lib/axios';

export default function NuevaPrenda() {
    const navigate = useNavigate();
    const { id } = useParams(); // Si hay ID en la URL, estamos editando
    const isEdit = Boolean(id);
    
    // Estados para las Marcas
    const [marcas, setMarcas] = useState([]);
    const [marcaId, setMarcaId] = useState('');
    const [mostrarNuevaMarca, setMostrarNuevaMarca] = useState(false);
    const [nombreNuevaMarca, setNombreNuevaMarca] = useState('');

    // Estados para la Prenda
    const [categoria, setCategoria] = useState('');
    const [colorPrincipal, setColorPrincipal] = useState('');
    const [precioCompra, setPrecioCompra] = useState('');
    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    const categoriasPredefinidas = [
        "Camiseta",
        "Pantalón",
        "Sudadera",
        "Chaqueta",
        "Abrigo",
        "Vestido",
        "Zapatos",
        "Zapatillas",
        "Accesorios",
        "Ropa Interior"
    ];

    useEffect(() => {
        cargarMarcas();
        if (isEdit) {
            cargarPrenda();
        }
    }, [id]);

    const cargarMarcas = async () => {
        try {
            const res = await axios.get('/marcas');
            setMarcas(res.data);
            if (res.data.length > 0 && !isEdit) setMarcaId(res.data[0].id);
        } catch (err) {
            console.error("Error cargando marcas", err);
        }
    };

    // NUEVO: Función para rellenar los datos si estamos editando
    const cargarPrenda = async () => {
        try {
            const res = await axios.get(`/prendas/${id}`);
            const prenda = res.data;
            setCategoria(prenda.categoria || '');
            setColorPrincipal(prenda.color_principal || '');
            setPrecioCompra(prenda.precio_compra || '');
            setMarcaId(prenda.marca_id || '');
            
            if (prenda.foto_url) {
                setFotoPreview(`http://localhost:8000${prenda.foto_url}`);
            }
        } catch (err) {
            setError("Error al cargar la prenda para editar.");
        }
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setFotoPreview(URL.createObjectURL(file));
        }
    };

    const crearMarcaYDevolverId = async () => {
        const res = await axios.post('/marcas', { nombre: nombreNuevaMarca });
        return res.data.marca.id;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setCargando(true);

        try {
            let idMarcaFinal = marcaId;

            // Si el usuario decidió crear una marca nueva, la creamos primero
            if (mostrarNuevaMarca && nombreNuevaMarca) {
                idMarcaFinal = await crearMarcaYDevolverId();
            } else if (!idMarcaFinal) {
                throw new Error("Debes seleccionar o crear una marca.");
            }

            // Preparamos los datos con FormData porque vamos a enviar un archivo (la foto)
            const formData = new FormData();
            formData.append('marca_id', idMarcaFinal);
            formData.append('categoria', categoria);
            if (colorPrincipal) formData.append('color_principal', colorPrincipal);
            if (precioCompra) formData.append('precio_compra', precioCompra);
            if (foto) formData.append('foto', foto);

            // NUEVO: Truco para enviar una petición PUT en Laravel usando FormData
            if (isEdit) {
                formData.append('_method', 'PUT');
            }

            const url = isEdit ? `/prendas/${id}` : '/prendas';
            
            await axios.post(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Si todo va bien, volvemos al armario
            navigate('/armario');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al guardar la prenda');
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-8 py-6 bg-gray-900 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {isEdit ? 'Editar Prenda ✏️' : 'Añadir Nueva Prenda 👕'}
                    </h2>
                    <button onClick={() => navigate('/armario')} className="text-gray-300 hover:text-white font-medium">
                        Cancelar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                    {/* FOTO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto de la prenda</label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden relative">
                                {fotoPreview ? (
                                    <>
                                        <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white font-semibold shadow-sm">Cambiar foto</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span className="text-4xl mb-2">📸</span>
                                        <p className="text-sm text-gray-500 font-semibold">Haz clic para subir una foto</p>
                                    </div>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleFotoChange} />
                            </label>
                        </div>
                    </div>

                    {/* CATEGORÍA Y COLOR */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                            <select 
                                required 
                                value={categoria} 
                                onChange={(e) => setCategoria(e.target.value)} 
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="" disabled>Selecciona una categoría...</option>
                                {categoriasPredefinidas.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Color Principal</label>
                            <input type="text" placeholder="Ej: Rojo, Negro..." value={colorPrincipal} onChange={(e) => setColorPrincipal(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                    </div>

                    {/* MARCA */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Marca *</label>
                            <button type="button" onClick={() => setMostrarNuevaMarca(!mostrarNuevaMarca)} className="text-xs text-blue-600 font-semibold hover:underline">
                                {mostrarNuevaMarca ? 'Elegir existente' : '+ Crear nueva marca'}
                            </button>
                        </div>
                        
                        {mostrarNuevaMarca ? (
                            <input type="text" required={mostrarNuevaMarca} placeholder="Nombre de la nueva marca..." value={nombreNuevaMarca} onChange={(e) => setNombreNuevaMarca(e.target.value)} className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        ) : (
                            <select value={marcaId} onChange={(e) => setMarcaId(e.target.value)} disabled={marcas.length === 0} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                {marcas.length === 0 ? <option value="">No hay marcas (Crea una arriba)</option> : marcas.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
                            </select>
                        )}
                    </div>

                    {/* PRECIO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio de compra (€)</label>
                        <input type="number" step="0.01" placeholder="Ej: 29.99" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>

                    <button type="submit" disabled={cargando} className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50">
                        {cargando ? 'Guardando...' : (isEdit ? 'Actualizar Prenda' : 'Guardar Prenda')}
                    </button>
                </form>
            </div>
        </div>
    );
}