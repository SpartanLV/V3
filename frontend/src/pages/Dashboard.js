import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ManageUsers from '../components/ManageUsers';
import ManageCourses from '../components/ManageCourses';
import ManageBookings from '../components/ManageBookings';
import NotificationBell from '../components/NotificationBell';
import { AuthContext } from '../context/AuthContext';

// Sidebar Component
const Sidebar = ({ navigate }) => (
  <div className="sidebar">
    <Button variant="link" onClick={() => navigate('/admin/users')}>Users</Button>
    <Button variant="link" onClick={() => navigate('/admin/courses')}>Courses</Button>
    <Button variant="link" onClick={() => navigate('/admin/bookings')}>Bookings</Button>
  </div>
);

// Header Component
const Header = () => (
  <div className="page-header">
    <h2>Admin Panel</h2>
    <NotificationBell userId={JSON.parse(localStorage.getItem('user'))._id} />
  </div>
);

const Dashboard = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();  // clears token/user
    navigate('/LandingPage');  // 👈 redirect to landing page
  };

  return (
    <div className="dashboard-layout">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="sidebar-col">
          <Sidebar navigate={navigate} />
        </Col>

        {/* Main Content Area */}
        <Col md={9} className="main-content">
          <Header />
          <div className="main-content-body">
            <Routes>
              <Route path="users" element={<ManageUsers />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="bookings" element={<ManageBookings />} />
            </Routes>
          </div>
        </Col>
      </Row>

      {/* Logout Button */}
      <div className="logout-container">
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

export default Dashboard;
