import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('opsmind_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('opsmind_token');
      const storedUser = localStorage.getItem('opsmind_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
    const payload = res.data.data || res.data;
    const receivedToken = payload.token || res.data.token;
    const receivedUser = payload.user || payload;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('opsmind_token', receivedToken);
    localStorage.setItem('opsmind_user', JSON.stringify(receivedUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

    return receivedUser;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    const payload = res.data.data || res.data;
    const receivedToken = payload.token || res.data.token;
    const receivedUser = payload.user || payload;

    setToken(receivedToken);
    setUser(receivedUser);

    localStorage.setItem('opsmind_token', receivedToken);
    localStorage.setItem('opsmind_user', JSON.stringify(receivedUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

    return receivedUser;
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('opsmind_token');
    localStorage.removeItem('opsmind_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'Admin',
    isManager: user?.role === 'Manager' || user?.role === 'Admin',
    isEmployee: true,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
