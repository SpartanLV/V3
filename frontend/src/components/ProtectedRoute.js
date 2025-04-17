// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();            // ← pull the current location
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
        setAuthStatus({
          isValid: false,
          error: err.response?.data?.message || 'Unauthorized'
        });
      }
    };

    validateToken();

    // (optionally) return a cleanup to cancel in‑flight requests
    return () => {
      // e.g. abortController.abort()
    };
  }, []);

  // show spinner while validating
  if (authStatus.isValid === null) {
    return <LoadingSpinner />;
  }

  // redirect to login, preserving attempted URL
  if (!authStatus.isValid) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // authorized: render the protected children
  return children;
};

export default ProtectedRoute;
