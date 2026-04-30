import axios from 'axios';
import { apiBaseUrl } from './config';

// Configure Axios instance with base URL and auth token interceptor
const api = axios.create({
    baseURL: apiBaseUrl,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || localStorage.getItem('token');
        const baseUrl = config.baseURL || '';

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (typeof config.url === 'string' && baseUrl.endsWith('/api') && config.url.startsWith('/api/')) {
            config.url = config.url.replace(/^\/api/, '');
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
