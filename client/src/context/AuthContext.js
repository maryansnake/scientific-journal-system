import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Завантаження користувача при ініціалізації
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.token}`;
        try {
          const res = await api.get('/api/v1/auth/me');
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setError(err.response.data.message || 'Помилка автентифікації');
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Реєстрація користувача
  const register = async (formData) => {
    try {
      const res = await api.post('/api/v1/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response.data.message || 'Помилка реєстрації');
      return false;
    }
  };

  // Вхід користувача
  const login = async (formData) => {
    try {
      const res = await api.post('/api/v1/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.data);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response.data.message || 'Помилка входу');
      return false;
    }
  };

  // Вихід користувача
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};