// src/components/Navbar.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styling.css'; // Assuming your custom styles

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                          // Clears auth data
    navigate('/');                      // Redirect to landing page
  };

  // Determine role-specific dashboard path and title
  const rolePathMap = {
    admin: '/admin/users',
    faculty: '/faculty/dashboard',  // Corrected the path
    student: '/student/dashboard'   // Corrected the path
  };

  const dashboardPath = rolePathMap[user?.role] || '/';
  const brandLabel = {
    admin: 'Admin Panel',
    faculty: 'Faculty Dashboard',
    student: 'Student Dashboard'
  }[user?.role] || 'Dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href={dashboardPath} className="navbar-brand">{brandLabel}</a>
        <div className="navbar-right">
          {user ? (
            <>
              <span className="navbar-text">Welcome, {user?.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span className="navbar-text">Welcome, Guest</span>
          )}
        </div>
      </div>
    </nav>
  );
}
