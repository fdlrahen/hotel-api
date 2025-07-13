import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './output.css';
import { Navigate } from 'react-router-dom';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register'; // Tambahkan ini

// Pages
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Venues from './pages/Venues';
import Reservations from './pages/Reservations';
import VenueReservations from './pages/VenueReservations';

//Navigasi
import HomeDashboard from './Navigasi/HomeDashboard'
import LayoutUmum from './Navigasi/component/Layout';

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

  return (
    <Routes>
     
      {/* Halaman publik */}
       <Route path="/" element={<LayoutUmum />}>
        <Route index element={<HomeDashboard />} />        
      </Route>
      
      <Route path="/login" element={
        !isAuthenticated ? <Login /> : <Navigate to="/dashboard" />
      } />

      <Route path="/register" element={
        !isAuthenticated ? <Register /> : <Navigate to="/dashboard" />
      } />

      {/* Halaman yang membutuhkan autentikasi */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/rooms" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <Rooms />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/venues" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <Venues />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/reservations" element={
        <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
          <Layout>
            <Reservations />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/venue-reservations" element={
        <ProtectedRoute allowedRoles={['admin', 'resepsionis']}>
          <Layout>
            <VenueReservations />
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
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
