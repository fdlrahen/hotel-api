import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Venues from './pages/Venues';
import Reservations from './pages/Reservations';
import VenueReservations from './pages/VenueReservations';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/venue-reservations" element={<VenueReservations />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
