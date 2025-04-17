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
import Unauthorized from './pages/Unauthorized';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <BrowserRouter>
      {user && <Navbar />}
      <div className="d-flex">
        {user && <Sidebar />}
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/admin/users" /> : <Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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

            <Route path="*" element={<Navigate to={user ? "/admin/users" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
