// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import CourseSearch from './components/CourseSearch';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AvailableSlots from './components/AvailableSlots'; // Import AvailableSlots

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
import PaymentPage from './components/payment'; // Add this import

import Messages from './pages/Messages'; // Import Messages page
import ChatBox from './components/ChatBox'; // Import ChatBox component

import CourseDetail from './pages/CourseDetail'; // Import CourseDetail page
import ReviewForm from './pages/ReviewForm'; // Import ReviewForm page  
import Gradesheet from './pages/Gradesheet'; // Import Gradesheet page
import CourseList from './pages/CourseList'; // Import CourseList page


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
            <Route
              path="/available-slots"
              element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><AvailableSlots /></ProtectedRoute>}
            />
            <Route path="/" element={user ? <Navigate to={getDefaultRedirect()} /> : <LandingPage />} />
            <Route path="/login" element={user ? <Navigate to={getDefaultRedirect()} /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to={getDefaultRedirect()} /> : <Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/payment" element={<PaymentPage />} /> {/* Public payment route */}
            <Route path="/messages" element={<Messages />} /> {/* Messages route */}
            <Route path="/chat/:recipientId" element={<ChatBox />} /> {/* ChatBox route */}
            <Route
              path="/courses/search"
              element={<ProtectedRoute allowedRoles={['student', 'faculty', 'admin']}><CourseSearch /></ProtectedRoute>}
            />
            {/* Protected Routes */}
            {/* Admin Routes */}
            <Route
              path="/admin/users"
              element={<ProtectedRoute allowedRoles={['admin']}><ManageUsers /></ProtectedRoute>}
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
            {/* ... other admin routes ... */}

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
            <Route
              path="/student/courses/:courseId"
              element={<ProtectedRoute allowedRoles={['student']}><CourseDetail /></ProtectedRoute>}
            />
            <Route
              path="/student/courses/:courseId/review"
              element={<ProtectedRoute allowedRoles={['student']}><ReviewForm /></ProtectedRoute>}
            />
            <Route
              path="/student/courses/:courseId/gradesheet"
              element={<ProtectedRoute allowedRoles={['student']}><Gradesheet /></ProtectedRoute>}
            />
            <Route
              path="/student/courses"
              element={<ProtectedRoute allowedRoles={['student']}><CourseList /></ProtectedRoute>}
            />
            {/* Add Payment Page route for students */}


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
            {/* Add Payment Page route for faculty if needed */}
            <Route
              path="/faculty/payment"
              element={<ProtectedRoute allowedRoles={['faculty']}><PaymentPage /></ProtectedRoute>}
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