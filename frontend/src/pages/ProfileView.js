// frontend/src/pages/ProfileView.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ProfileView() {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userString = localStorage.getItem('user');
  
        if (!userString || userString === 'undefined') {
          // Handle invalid or missing user data
          setError('No user data found.');
          return;
        }
  
        const user = JSON.parse(userString); // Safe parse of user data
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        setUser(data);
      } catch (err) {
        setError('Failed to load profile.');
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
        <Card.Header as="h4">Your Profile</Card.Header>
        <Card.Body>
          <div className="text-center mb-3">
          {user.profilePic ? (
            <img
              src={`http://localhost:5000/uploads/${user.profilePic}`}
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
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <div className="d-grid">
            <Button
              variant="primary"
              onClick={() => navigate('edit')}
            >
              Edit Profile
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
