import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* La Navbar se renderiza una sola vez para toda la app */}
            <Navbar /> 
            
            <main className="flex-grow flex flex-col">
                {/* Aquí se inyectará el contenido de cada página */}
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-400 text-xs">
                &copy; 2026 LootCloset. Tu armario inteligente.
            </footer>
        </div>
    );
}
