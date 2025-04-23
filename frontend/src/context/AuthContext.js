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
        console.error('Token validation failed:', err);  // Log the error for debugging
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

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
