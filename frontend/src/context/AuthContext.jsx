import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Authentication context for managing user sessions
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Add axios interceptor for token expiration handling
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    const storedUser = localStorage.getItem('user');
                    const userData = storedUser ? JSON.parse(storedUser) : null;
                    const isPrivileged = ['Project Manager', 'Video Editing Head'].includes(userData?.role);
                    localStorage.removeItem('user');
                    window.location.href = isPrivileged ? '/admin/login' : '/login';
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
