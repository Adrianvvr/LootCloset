import { useState, useEffect } from 'react';
import axios from '../lib/axios';

export default function Perfil() {
    const [user, setUser] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    // Estados para el formulario
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        obtenerPerfil();
    }, []);

    const obtenerPerfil = async () => {
        try {
            const response = await axios.get('/profile');
            setUser(response.data);
            setName(response.data.name);
            setCargando(false);
        } catch (err) {
            setError('Error al cargar el perfil.');
            setCargando(false);
        }
    };

    const actualizarPerfil = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (newPassword && newPassword !== confirmPassword) {
            setError('La nueva contraseña y su confirmación no coinciden.');
            return;
        }

        try {
            const response = await axios.put('/profile', {
                name,
                current_password: currentPassword || null,
                new_password: newPassword || null,
                new_password_confirmation: confirmPassword || null,
            });

            setMensajeExito(response.data.message);
            // Limpiar campos de contraseña
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Actualizar el objeto user localmente por si acaso
            setUser(response.data.user);
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al actualizar el perfil.';
            setError(msg);
        }
    };

    if (cargando) return <div className="p-10 text-center">Cargando perfil...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold border-2 border-white/50">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="opacity-80 text-sm">{user.email}</p>
                </div>

                <div className="p-8">
                    {mensajeExito && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            {mensajeExito}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={actualizarPerfil} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Seguridad / Cambiar Contraseña</h3>
                                <p className="text-sm text-gray-500 mb-6">Deja estos campos vacíos si no deseas cambiar tu contraseña.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña actual</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="••••"
                                />
                            </div>

                            <div className="hidden md:block"></div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nueva contraseña</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar nueva contraseña</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Confirmar contraseña"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95"
                            >
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
