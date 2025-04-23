// frontend/src/pages/ProfileEdit.js
import React, { useEffect } from 'react';
import ProfileManagement from '../components/ProfileManagement';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProfileEdit() {
  useEffect(() => {
    document.title = "Edit Profile | University System";
  }, []);

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Edit Your Profile</h1>
        <Link to="/profile" className="btn btn-outline-secondary">Back to Profile</Link>
      </div>
      <ProfileManagement />
    </Container>
  );
}