// src/App.js
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

import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import ProfileView from './pages/ProfileView';
import ProfileEdit from './pages/ProfileEdit';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const getDefaultRedirect = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/users';
    if (user.role === 'student') return '/student/dashboard';
    if (user.role === 'faculty') return '/faculty/dashboard';
    return '/unauthorized';
  };

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className="d-flex">
        {user && <Sidebar />}
        <div className="flex-grow-1 p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={user ? <Navigate to={getDefaultRedirect()} /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to={getDefaultRedirect()} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={getDefaultRedirect()} /> : <Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>}
            />
            <Route
              path="/admin/users/add"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers mode="add" /></ProtectedRoute>}
            />
            <Route
              path="/admin/users/edit/:userId"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers mode="edit" /></ProtectedRoute>}
            />
            <Route
              path="/admin/courses"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageCourses /></ProtectedRoute>}
            />
            <Route
              path="/admin/courses/add"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageCourses mode="add" /></ProtectedRoute>}
            />
            <Route
              path="/admin/courses/edit/:courseId"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageCourses mode="edit" /></ProtectedRoute>}
            />
            <Route
              path="/admin/bookings"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageBookings /></ProtectedRoute>}
            />
            <Route
              path="/admin/notifications"
              element={<ProtectedRoute allowedRoles={['admin']}><SendNotification /></ProtectedRoute>}
            />
            <Route
              path="/admin/reports"
              element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>}
            />

            {/* Student Routes */}
            <Route
              path="/student/dashboard"
              element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>}
            />
            <Route
              path="/student/profile"
              element={<ProtectedRoute allowedRoles={['student']}><ProfileView /></ProtectedRoute>}
            />
            <Route
              path="/student/profile/edit"
              element={<ProtectedRoute allowedRoles={['student']}><ProfileEdit /></ProtectedRoute>}
            />

            {/* Faculty Routes */}
            <Route
              path="/faculty/dashboard"
              element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard /></ProtectedRoute>}
            />
            <Route
              path="/faculty/profile"
              element={<ProtectedRoute allowedRoles={['faculty']}><ProfileView /></ProtectedRoute>}
            />
            <Route
              path="/faculty/profile/edit"
              element={<ProtectedRoute allowedRoles={['faculty']}><ProfileEdit /></ProtectedRoute>}
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
