import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styling.css'; // Assuming custom CSS file

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // clears token/user
    navigate('/LandingPage');  // 👈 redirect to landing page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/admin/users" className="navbar-brand">Admin Panel</a>
        <div className="navbar-right">
          <span className="navbar-text">Welcome, {user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
