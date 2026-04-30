import axios from 'axios';

const apiBaseUrl =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');

// Configure Axios instance with base URL and auth token interceptor
const api = axios.create({
    baseURL: apiBaseUrl,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token || localStorage.getItem('token');

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
