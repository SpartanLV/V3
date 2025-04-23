// src/pages/ProfilePage.js
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import ProfileView from './ProfileView';

function ProfilePage() {
  useEffect(() => {
    document.title = "Your Profile | University System";
  }, []);

  return (
    <Container className="profile-page-container">
      <h1 className="mb-4">Your Profile</h1>
      <ProfileView />
    </Container>
  );
}

export default ProfilePage;