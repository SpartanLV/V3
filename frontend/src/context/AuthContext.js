import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setupSocket, disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const res = await api.get('/auth/validate');
        setUser(res.data.user);
        setupSocket(res.data.user._id);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validate();
    return () => {
      disconnectSocket();
    };
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setupSocket(user._id);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
