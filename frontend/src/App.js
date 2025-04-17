import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={
          <ProtectedRoute>
            <Dashboard /> {/* or <Navigate to="/admin" /> */}
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;