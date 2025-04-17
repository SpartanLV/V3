import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner'; // Create this component

const ProtectedRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState({
    isValid: null,
    error: null
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get('/auth/validate');
        setAuthStatus({ isValid: true, error: null });
      } catch (err) {
        setAuthStatus({ isValid: false, error: err.response?.data?.message || 'Unauthorized' });
      }
    };
    
    validateToken();
    
    // Cleanup function
    return () => {
      // Cancel any pending requests if needed
    };
  }, []);

  if (authStatus.isValid === null) {
    return <LoadingSpinner />;
  }

  if (!authStatus.isValid) {
    // Optional: Store the attempted location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;