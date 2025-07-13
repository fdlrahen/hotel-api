// src/components/Layout/LayoutUmum.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import HeaderHome from '../component/Header';
import Footer from '../component/Footer';
import { Link, NavLink } from 'react-router-dom';


const LayoutUmum = () => {
  const location = useLocation();

  // Tentukan halaman mana yang ingin kamu tampilkan header-nya
  const showHeaderHome = ['/', '/hotel', '/review', '/fasilitas', '/offer'].includes(location.pathname);

  return (
    <>
      {showHeaderHome && <HeaderHome />}
      <main style={{ marginTop: '80px' }}>
	<div style={{ marginTop: '70px' }}>
        {showHeaderHome && <HeaderHome />}
      </div>
      {/* Black Card Section Below Navbar */}
      <div className="card bg-black text-white rounded-0">
        <div className="card-body d-flex flex-column flex-md-row align-items-center justify-content-between container py-4">
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <img src="/logo.png" alt="Seraton Logo" width="60" height="60" className="me-3" />
            <div>
              <h4 className="mb-1">Seraton Surabaya Hotel</h4>
              <small>Jl. Embong Malang 25-31, Surabaya</small><br />
              <small><a className="text-white text-decoration-none" href="tel:+62315468000">Tel: +62 31 5468000</a></small><br />
              <span className="text-warning">★★★★★</span>
            </div>
          </div>
          <div>
            <a href="#book" className="btn btn-warning btn-lg px-4">Book Now</a>
          </div>
        </div>
        {/* Link section */}
        <div className="container pb-3">
          <ul className="nav nav-pills justify-content-center gap-3">
            <li className="nav-item">
              {/* Ubah <a> menjadi NavLink/Link */}
              <NavLink className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} to="/hotel">Rooms & Suites</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} to="/fasilitas">Fasilitas</NavLink>
            </li>
             <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} to="/review">Review</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => isActive ? "nav-link text-white active" : "nav-link text-white"} to="/offer">Offer</NavLink>
            </li>
          </ul>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
};

export default LayoutUmum;
