import React from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = React.useState(null);

  React.useEffect(() => {
    const validateToken = async () => {
      try {
        await api.get('/auth/validate');
        setIsValid(true);
      } catch (err) {
        setIsValid(false);
      }
    };
    validateToken();
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;