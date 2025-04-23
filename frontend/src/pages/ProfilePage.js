// src/pages/ProfilePage.js
import React from 'react';
import ProfileManagement from '../components/ProfileManagement';

function ProfilePage() {
  return (
    <div className="profile-page-container">
      <h1>Your Profile</h1>
      <ProfileManagement />
    </div>
  );
}

export default ProfilePage;
