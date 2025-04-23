import React from 'react';
import { Container } from 'react-bootstrap';
import ProfileManagement from '../components/profile/ProfileManagement';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ProfilePage = () => {
  return (
    <>
      <Header />
      <Container className="py-5">
        <h2 className="text-center mb-4">My Profile</h2>
        <ProfileManagement />
      </Container>
      <Footer />
    </>
  );
};

export default ProfilePage;