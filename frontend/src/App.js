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
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="courses" element={<ManageCourses />} />
                    <Route path="bookings" element={<ManageBookings />} />
                    <Route path="notifications" element={<SendNotification />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="*" element={<Navigate to="users" replace />} />
                  </Routes>
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
