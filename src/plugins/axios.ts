import axios from 'axios';

// Instancia base de Axios para tu API NestJS
// URL de API adaptativa (funciona en localhost y desde el celular en la misma red)
const apiBaseUrl = typeof window !== 'undefined'
    ? `http://${window.location.hostname}:3000`
    : 'http://localhost:3000';

const api = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
});

export function setAuthToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function clearAuthToken() {
    delete api.defaults.headers.common['Authorization'];
}

// Manejo global de errores 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        // Puedes redirigir al login o limpiar token
        localStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
    }
);
export default api;