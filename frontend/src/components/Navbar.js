// src/components/Navbar.js
import React, { useContext } from 'react';
import { Navbar as BsNav, Container, Nav, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <BsNav bg="primary" variant="dark" className="mb-3">
      <Container fluid>
        <BsNav.Brand href="/admin/users">Admin Panel</BsNav.Brand>
        <Nav className="ms-auto">
          <span className="navbar-text me-3">Welcome, {user?.name}</span>
          <Button variant="outline-light" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </BsNav>
  );
}
