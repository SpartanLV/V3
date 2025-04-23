// src/components/ProtectedRoute.js
import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, loading: userLoading } = useContext(AuthContext); // Get user directly from context
  const [authStatus, setAuthStatus] = useState({
    isValid: null,
    error: null,
  });

  // If the user data is still loading, show a spinner (could be set in context)
  if (userLoading) {
    return <LoadingSpinner />;
  }

  // If there's no user (not logged in)
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the token is valid on the first render (if user is present)
  useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get('/auth/validate');
        setAuthStatus({ isValid: true, error: null });
      } catch (err) {
        setAuthStatus({
          isValid: false,
          error: err.response?.data?.message || 'Unauthorized',
        });
      }
    };

    if (user && authStatus.isValid === null) {
      validateToken(); // Only validate token if not already validated
    }
  }, [authStatus.isValid, user]);

  // Loading spinner while validating token
  if (authStatus.isValid === null) {
    return <LoadingSpinner />;
  }

  // If the token is invalid, redirect to login
  if (!authStatus.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated but not authorized by role, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, return the children (protected route content)
  return children;
};

export default ProtectedRoute;
