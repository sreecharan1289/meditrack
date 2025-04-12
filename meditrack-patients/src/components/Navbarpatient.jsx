import '../App.css'
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/m_logo.jpeg';
import Dashboard from './Dashboardpatient';


const NavbarPatient = ({ navbarColor, logoUrl }) => {
  const location = useLocation(); // Get current path

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img className="m_logo" src={logo} alt="Logo" />
      </div>
      <div className="nav-links">
        <ul className="navlist">
          <li
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>
          <li
            className={`nav-item ${location.pathname === '/appointments' ? 'active' : ''}`}
          >
            <Link to="/appointments" className="nav-link">Appointments</Link>
          </li>
          <li
            className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

NavbarPatient.propTypes = {
  navbarColor: PropTypes.string,  // Allows the user to customize the navbar color
  logoUrl: PropTypes.string,      // Allows the user to specify a custom logo
};

export default NavbarPatient;
