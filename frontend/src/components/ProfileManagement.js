// frontend/src/components/ProfileManagement.js

import React, { useState, useEffect, useContext } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './styling.css';

export default function ProfileManagement() {
  // 1) Hooks up front
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  // 2) Fetch profile once
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const { data } = await axios.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          profilePicture: null
        });
        setPreviewImage(data.profilePictureUrl || null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Could not load profile.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // 3) Handlers
  const handleChange = e =>
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(f => ({ ...f, profilePicture: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = new FormData();
      payload.append('name', formData.name);
      if (formData.profilePicture) {
        payload.append('profilePicture', formData.profilePicture);
      }

      const { data } = await axios.put('/api/users/profile', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Profile updated!');
      await refreshUser();
      navigate(`/${data.role}/profile`);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Update failed');
      setLoading(false);
    }
  };

  // 4) Single return: spinner if loading, otherwise form
  return loading ? (
    <Container className="d-flex justify-content-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading…</span>
      </Spinner>
    </Container>
  ) : (
    <Container className="profile-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="profile-card">
            <Card.Header as="h4" className="text-center">
              Profile Management
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-4 text-center">
                  <Col>
                    <div className="profile-image-container">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="profile-image"
                        />
                      ) : (
                        <div className="profile-image-placeholder">
                          {formData.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Form.Group controlId="profilePicture" className="mt-3">
                      <Form.Label className="btn btn-outline-primary">
                        Choose Profile Picture
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          hidden
                        />
                      </Form.Label>
                      </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Email cannot be changed.
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating…' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
