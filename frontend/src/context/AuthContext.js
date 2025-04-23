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
        // Check if token exists in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          // Try to validate the token with the backend
          const res = await api.get('/auth/validate');
          setUser(res.data.user);
          setupSocket(res.data.user._id);
        } else {
          setUser(null); // No token found, clear user data
        }
      } catch (err) {
        setUser(null); // Token is invalid or expired, clear user data
      } finally {
        setLoading(false);
      }
    };

    validate();
    return () => {
      disconnectSocket(); // Clean up the socket connection when the component unmounts
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
