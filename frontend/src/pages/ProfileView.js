// frontend/src/pages/ProfileView.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Header as="h4">Profile Information</Card.Header>
        <Card.Body>
          <div className="text-center mb-3">
            {user.profilePictureUrl ? (
              <img
                src={user.profilePictureUrl}
                alt="Profile"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  lineHeight: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#ddd',
                  fontSize: '2rem',
                  margin: '0 auto'
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
          </div>

          <Row className="mb-3">
            <Col sm={3} className="fw-bold">Name:</Col>
            <Col>{user.name}</Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} className="fw-bold">Email:</Col>
            <Col>{user.email}</Col>
          </Row>

          <Row className="mb-3">
            <Col sm={3} className="fw-bold">Role:</Col>
            <Col>{user.role}</Col>
          </Row>

          <div className="d-grid mt-4">
            <Link to="/profile/edit" className="btn btn-primary d-block">
              Edit Profile
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}