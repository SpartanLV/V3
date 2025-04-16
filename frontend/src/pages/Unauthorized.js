import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="text-danger">403 - Access Denied</h1>
      <p>You don't have permission to view this page.</p>
      <Link to="/admin" className="btn btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;