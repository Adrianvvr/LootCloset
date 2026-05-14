import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Inicio() {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/armario', { replace: true });
        }
    }, [navigate]);
    return (
        <div className="w-full">
            {/* SECCIÓN HERO */}
            <section className="w-full px-4 sm:px-8 lg:px-12 py-20 text-center">
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
            </section>

            {/* SECCIÓN DE CARACTERÍSTICAS */}
            <section className="bg-gray-50 py-16">
                <div className="w-full px-4 sm:px-8 lg:px-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">¿Qué puedes hacer en LootCloset?</h2>
                        <p className="mt-4 text-gray-500 text-lg">Descubre todas las herramientas para gestionar tu estilo.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Característica 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Armario Digital</h3>
                            <p className="text-gray-500">
                                Sube fotos de tus prendas, categorízalas por tipo, color y temporada. Encuentra lo que buscas en segundos.
                            </p>
                        </div>

                        {/* Característica 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Generador de Outfits</h3>
                            <p className="text-gray-500">
                                Crea combinaciones perfectas al instante. Nuestra lógica de color y temporada te ayudará a lucir increíble siempre.
                            </p>
                        </div>

                        {/* Característica 3 */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Planifica tus Looks</h3>
                            <p className="text-gray-500">
                                Utiliza el calendario integrado para organizar tus conjuntos para toda la semana. ¡No más estrés por las mañanas!
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
