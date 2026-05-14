import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../lib/axios';
import logoUrl from '../assets/logo.png';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            navigate('/');
        } catch (err) {
            console.error('Error al cerrar sesión', err);
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const navLinkClass = (path) => `block md:inline-block px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === path ? 'text-indigo-600 bg-indigo-50 md:bg-transparent' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 md:hover:bg-transparent'}`;

    return (
        <nav className="bg-white shadow-sm w-full z-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div
                        className={`flex items-center gap-2 text-2xl font-bold tracking-tight cursor-pointer ${isAuthenticated ? 'text-gray-900' : 'text-indigo-600'}`}
                        onClick={() => navigate(isAuthenticated ? '/armario' : '/')}
                    >
                        <span>{isAuthenticated ? 'Loot Closet' : 'LootCloset'}</span>
                        {isAuthenticated && <img src={logoUrl} alt="Loot Closet Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain drop-shadow-sm" />}
                    </div>

                    {/* Hamburger button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-2 lg:gap-4 items-center">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => navigate('/dashboard')} className={navLinkClass('/dashboard')}>Dashboard 📊</button>
                                <button onClick={() => navigate('/armario')} className={navLinkClass('/armario')}>Mi Armario</button>
                                <button onClick={() => navigate('/mis-outfits')} className={navLinkClass('/mis-outfits')}>Mis Outfits</button>
                                <button onClick={() => navigate('/calendario')} className={navLinkClass('/calendario')}>Calendario</button>
                                <button onClick={() => navigate('/generar-outfit')} className={navLinkClass('/generar-outfit')}>Generador 🎲</button>
                                <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:text-red-800 transition-colors ml-2">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">Iniciar Sesión</Link>
                                <Link to="/registro" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {isAuthenticated ? (
                            <>
                                <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} className={`w-full text-left ${navLinkClass('/dashboard')}`}>Dashboard 📊</button>
                                <button onClick={() => { navigate('/armario'); setMenuOpen(false); }} className={`w-full text-left ${navLinkClass('/armario')}`}>Mi Armario</button>
                                <button onClick={() => { navigate('/mis-outfits'); setMenuOpen(false); }} className={`w-full text-left ${navLinkClass('/mis-outfits')}`}>Mis Outfits</button>
                                <button onClick={() => { navigate('/calendario'); setMenuOpen(false); }} className={`w-full text-left ${navLinkClass('/calendario')}`}>Calendario</button>
                                <button onClick={() => { navigate('/generar-outfit'); setMenuOpen(false); }} className={`w-full text-left ${navLinkClass('/generar-outfit')}`}>Generador 🎲</button>
                                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left block px-3 py-2 text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">Iniciar Sesión</Link>
                                <Link to="/registro" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mt-2 text-center">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}