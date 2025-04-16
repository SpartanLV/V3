import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManageUsers from '../components/ManageUsers';
import ManageCourses from '../components/ManageCourses';
import ManageBookings from '../components/ManageBookings';
import NotificationBell from '../components/NotificationBell';

const Dashboard = () => {
  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <NotificationBell userId={JSON.parse(localStorage.getItem('user'))._id} />
      </div>
      
      <Routes>
        <Route path="users" element={<ManageUsers />} />
        <Route path="courses" element={<ManageCourses />} />
        <Route path="bookings" element={<ManageBookings />} />
      </Routes>
    </div>
  );
};

export default Dashboard;