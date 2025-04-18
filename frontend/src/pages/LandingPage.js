// src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../components/styling.css';  // External CSS file for styling

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to the Booking Portal</h1>
      <div className="button-container">
        <Link to="/login">
          <button className="btn btn-login">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn btn-register">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
