// src/components/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: 'users', label: 'Users' },
  { to: 'courses', label: 'Courses' },
  { to: 'bookings', label: 'Bookings' },
  { to: 'notifications', label: 'Send Notification' },
  { to: 'reports', label: 'Reports' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <Nav className="flex-column bg-light vh-100 p-3" style={{ width: 200 }}>
      {links.map(({ to, label }) => (
        <Nav.Item key={to} className="mb-2">
          <Nav.Link
            as={Link}
            to={`/admin/${to}`}
            active={pathname.startsWith(`/admin/${to}`)}
          >
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
}
