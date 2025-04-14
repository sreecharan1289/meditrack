import '../App.css'
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/images/m_logo.jpeg';

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
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </li>
          <li
            className={`nav-item ${location.pathname === '/appointmentspatient' ? 'active' : ''}`}
          >
            <Link to="/appointmentspatient" className="nav-link">Appointments</Link>
          </li>
          <li
            className={`nav-item ${location.pathname === '/feedback' ? 'active' : ''}`}
          >
            <Link to="/feedback" className="nav-link">Feedback</Link>
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
