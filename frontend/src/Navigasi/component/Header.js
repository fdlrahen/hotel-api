
import React from "react";
import { Link, NavLink } from 'react-router-dom';

const HeaderHome = ()=>{
    return(
        <>
        {/* Navbar Atas: Book Hotel */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand text-primary fw-bold" to="../BookHotel">
            <span style={{ fontFamily: 'var(--heading-font)' }}>Book Hotel</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link text-primary fw-bold' : 'nav-link text-text-color'
                  }
                  to="../../pages/Login"
                >
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'nav-link text-primary fw-bold' : 'nav-link text-text-color'
                  }
                  to="../HomeDashboard"
                >
                  Dashboard (General)
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
        </>
    );
};
export default HeaderHome