import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AccessControl = ({ allowedRoles, children }) => {
  const [hasAccess, setHasAccess] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await api.get('/auth/validate');
        if (allowedRoles.includes(res.data.user.role)) {
          setHasAccess(true);
        } else {
          navigate('/unauthorized');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAccess();
  }, [allowedRoles, navigate]);

  if (loading) return <div>Checking permissions...</div>;
  return hasAccess ? children : null;
};

export default AccessControl;