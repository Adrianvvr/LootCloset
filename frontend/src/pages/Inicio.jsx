import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/axios';

export default function Inicio() {
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarMarcas = async () => {
            try {
                // CORRECCIÓN: Quitamos el /api porque axios.js ya lo incluye por defecto en la baseURL
                const respuesta = await axios.get('/marcas');
                setMarcas(respuesta.data);
            } catch (error) {
                console.error('Error al cargar las marcas:', error);
            } finally {
                setCargando(false);
            }
        };

        cargarMarcas();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* BARRA DE NAVEGACIÓN */}
            <nav className="bg-white shadow-sm p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold text-indigo-600">
                        LootCloset
                    </div>
                    <div className="space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                            Iniciar Sesión
                        </Link>
                        <Link to="/registro" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                            Registrarse
                        </Link>
                    </div>
                </div>
            </nav>

            {/* SECCIÓN HERO (BIENVENIDA) */}
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Tu armario, <span className="text-indigo-600">digitalizado</span>
                    </h1>
                    <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
                        Organiza tu ropa, crea outfits increíbles y lleva el control de lo que te pones. 
                        Únete a LootCloset y lleva tu estilo al siguiente nivel.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link to="/registro" className="px-8 py-3 text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all">
                            Empezar ahora
                        </Link>
                    </div>
                </div>

                {/* SECCIÓN DE MARCAS */}
                <div className="bg-white py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900">Marcas de tu interés</h2>
                            <p className="mt-4 text-gray-500 text-lg">Explora las tiendas oficiales y encuentra inspiración para tus próximos outfits.</p>
                        </div>

                        {cargando ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                                <span className="ml-3 text-indigo-600 font-medium">Cargando marcas...</span>
                            </div>
                        ) : marcas.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {marcas.map((marca) => (
                                    <a 
                                        key={marca.id} 
                                        href={marca.sitio_web} /* Aquí usamos el campo sitio_web para el enlace */
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center justify-center group text-center cursor-pointer"
                                    >
                                        {/* Contenedor del Logo */}
                                        <div className="h-24 w-24 mb-4 flex items-center justify-center bg-gray-50 rounded-full p-4 group-hover:bg-indigo-50 transition-colors duration-300">
                                            <img 
                                                src={marca.enlace} /* Aquí usamos el campo enlace para la foto */
                                                alt={`Logo ${marca.nombre}`} 
                                                className="max-h-full max-w-full object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                                            />
                                        </div>
                                        
                                        {/* Nombre de la marca */}
                                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                            {marca.nombre}
                                        </h3>
                                        
                                        {/* Textito animado de "Visitar Tienda" con un icono */}
                                        <span className="mt-3 text-sm text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0">
                                            Visitar Web
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                            </svg>
                                        </span>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">No hay marcas disponibles en este momento.</div>
                        )}
                    </div>
                </div>
            </main>

            {/* FOOTER SIMPLE */}
            <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
                <p>&copy; 2026 LootCloset. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}