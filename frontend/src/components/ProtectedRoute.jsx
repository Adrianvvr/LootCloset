import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    // Comprobamos si existe el token de autenticación
    const token = localStorage.getItem('token');

    // Si no hay token, redirigimos al login inmediatamente y reemplazamos el historial
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, renderizamos la ruta protegida (el componente hijo)
    return <Outlet />;
}
