// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Welcome to the Booking Portal</h1>
      <div style={{ display: 'inline-block', marginTop: '20px' }}>
        <Link to="/login">
          <button style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Login
          </button>
        </Link>
        <Link to="/register">
          <button style={{
            margin: '10px',
            padding: '10px 20px',
            backgroundColor: '#16A34A',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
