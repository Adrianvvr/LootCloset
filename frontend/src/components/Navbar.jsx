import { Link, useNavigate } from 'react-router-dom';
import axios from '../lib/axios';

export default function Navbar({ isAuthenticated }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error al cerrar sesión', err);
            // Por seguridad, aunque el backend falle, limpiamos el token local y redirigimos
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white shadow-sm p-4 flex justify-between items-center w-full z-50">
            {/* Logo / Nombre - Clicable solo si está autenticado */}
            <div 
                className={`text-2xl font-bold tracking-tight ${isAuthenticated ? 'cursor-pointer text-gray-900' : 'text-indigo-600'}`} 
                onClick={() => isAuthenticated && navigate('/armario')}
            >
                {isAuthenticated ? 'Loot Closet 👕' : 'LootCloset'}
            </div>

            {/* Enlaces dinámicos según el estado de autenticación */}
            <div className="flex gap-4 items-center">
                {isAuthenticated ? (
                    // VISTA: USUARIO LOGUEADO
                    <>
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Dashboard 📊
                        </button>
                        <button 
                            onClick={() => navigate('/armario')} 
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Mi Armario
                        </button>
                        <button 
                            onClick={() => navigate('/mis-outfits')} 
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Mis Outfits
                        </button>
                        <button 
                            onClick={handleLogout} 
                            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors ml-2"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    // VISTA: USUARIO NO LOGUEADO (Página de Inicio)
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