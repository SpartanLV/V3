// src/components/Sidebar.js
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useContext(AuthContext);

  let links = [];

  if (user?.role === 'admin') {
    links = [
      { path: '/admin/users', label: 'Users' },
      { path: '/admin/courses', label: 'Courses' },
      { path: '/admin/bookings', label: 'Bookings' },
      { path: '/admin/notifications', label: 'Send Notification' },
      { path: '/admin/reports', label: 'Reports' },
    ];
  } else if (user?.role === 'faculty') {
    links = [
      { path: '/faculty/dashboard', label: 'Dashboard' },
      { path: '/faculty/profile', label: 'Profile' },  // Added link for profile
    ];
  } else if (user?.role === 'student') {
    links = [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/profile', label: 'Profile' },  // Added link for profile
    ];
  }

  return (
    <Nav className="flex-column bg-light vh-100 p-3" style={{ width: 200 }}>
      {links.map(({ path, label }) => (
        <Nav.Item key={path} className="mb-2">
          <Nav.Link
            as={Link}
            to={path}
            active={pathname === path || pathname.startsWith(path + '/')}
          >
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
