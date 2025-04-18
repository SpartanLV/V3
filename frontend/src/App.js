import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import ManageUsers from './components/ManageUsers';
import ManageCourses from './components/ManageCourses';
import ManageBookings from './components/ManageBookings';
import SendNotification from './components/SendNotification';
import Reports from './components/Reports';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Unauthorized from './pages/Unauthorized';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <BrowserRouter>
      {/* Show Navbar and Sidebar only if user is logged in */}
      {user && <Navbar />}
      <div className="d-flex">
        {user && <Sidebar />}
        <div className="flex-grow-1 p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to="/admin/users" /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to="/admin/users" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/admin/users" /> : <Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
            <Route path="/admin/users/add" element={<ProtectedRoute><ManageUsers mode="add" /></ProtectedRoute>} />
            <Route path="/admin/users/edit/:userId" element={<ProtectedRoute><ManageUsers mode="edit" /></ProtectedRoute>} />

            <Route path="/admin/courses" element={<ProtectedRoute><ManageCourses /></ProtectedRoute>} />
            <Route path="/admin/courses/add" element={<ProtectedRoute><ManageCourses mode="add" /></ProtectedRoute>} />
            <Route path="/admin/courses/edit/:courseId" element={<ProtectedRoute><ManageCourses mode="edit" /></ProtectedRoute>} />

            <Route path="/admin/bookings" element={<ProtectedRoute><ManageBookings /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute><SendNotification /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
