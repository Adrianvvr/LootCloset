import Axios from 'axios';

const axios = Axios.create({
    // Ajusta esta URL si tu backend de Laravel está en otro puerto
    baseURL: 'http://localhost:8000/api', 
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    // withCredentials: true, // Descomenta esto si usas cookies de sesión con Laravel Sanctum
});

// INTERCEPTOR DE PETICIONES (REQUEST)
// Añade automáticamente el token a todas las peticiones si existe
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// INTERCEPTOR DE RESPUESTAS (RESPONSE)
// Atrapa los errores globalmente
axios.interceptors.response.use(
    response => response,
    error => {
        // Si el backend nos dice que no estamos autorizados (token caducado o inválido)
        if (error.response?.status === 401) {
            console.warn("Sesión expirada o no autorizada. Redirigiendo al login...");
            localStorage.removeItem('token');
            window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

export default axios;