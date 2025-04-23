import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import { setupSocket, disconnectSocket } from '../services/socket';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Error parsing 'user' from localStorage:", e);
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Validate the token
          const res = await api.get('/auth/validate');
          setUser(res.data.user);
          setupSocket(res.data.user._id);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Token validation failed:', err);
        setUser(null); // Clear user data on failure
      } finally {
        setLoading(false); // End loading state
      }
    };

    validate();
    return () => {
      disconnectSocket();
    };
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token); // Store the token in localStorage
    localStorage.setItem('user', JSON.stringify(user)); // Store user info in localStorage
    setupSocket(user._id); // Setup socket connection
    setUser(user); // Update user in context
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    localStorage.removeItem('user'); // Remove user data from localStorage
    disconnectSocket(); // Disconnect the socket
    setUser(null); // Clear the user from context
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/validate');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
