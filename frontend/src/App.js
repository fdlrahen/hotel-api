import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './output.css';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import Login from './pages/Login';

// Pages
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Venues from './pages/Venues';
import Reservations from './pages/Reservations';
import VenueReservations from './pages/VenueReservations';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading, canAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (allowedRoles.length > 0 && !canAccess(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  return children;
};

// Main App Content
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/rooms" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Rooms />
          </ProtectedRoute>
        } />
        
        <Route path="/venues" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Venues />
          </ProtectedRoute>
        } />
        
        <Route path="/reservations" element={
          <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
            <Reservations />
          </ProtectedRoute>
        } />
        
        <Route path="/venue-reservations" element={
          <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
            <VenueReservations />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
