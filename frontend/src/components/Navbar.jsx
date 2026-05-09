import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../lib/axios';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Escucha cambios de URL
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Cada vez que la URL cambie (location), revisamos el token
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, [location]);

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al cerrar sesión', err);
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center w-full z-50">
            {/* Logo - Si estás logueado te lleva al armario, si no al inicio */}
            <div 
                className={`text-2xl font-bold tracking-tight cursor-pointer ${isAuthenticated ? 'text-gray-900' : 'text-indigo-600'}`} 
                onClick={() => navigate(isAuthenticated ? '/armario' : '/')}
            >
                {isAuthenticated ? 'Loot Closet 👕' : 'LootCloset'}
            </div>

            {/* Enlaces dinámicos */}
            <div className="flex gap-4 items-center">
                {isAuthenticated ? (
                    <>
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Dashboard 📊
                        </button>
                        <button 
                            onClick={() => navigate('/armario')} 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/armario' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Mi Armario
                        </button>
                        <button 
                            onClick={() => navigate('/mis-outfits')} 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/mis-outfits' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Mis Outfits
                        </button>
                        <button 
                            onClick={() => navigate('/calendario')} 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/calendario' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Calendario
                        </button>
                        <button 
                            onClick={() => navigate('/generar-outfit')} 
                            className={`text-sm font-medium transition-colors ${location.pathname === '/generar-outfit' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            Generador 🎲
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors ml-2 font-bold"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
                            Iniciar Sesión
                        </Link>
                        <Link to="/registro" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}