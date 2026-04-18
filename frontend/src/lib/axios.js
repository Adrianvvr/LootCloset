import axios from 'axios';

// Creamos una instancia de Axios apuntando a nuestra API de Laravel
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// "Interceptor": Antes de que salga cualquier petición de React hacia Laravel,
// comprueba si tenemos un Token guardado y se lo inyecta automáticamente.
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;