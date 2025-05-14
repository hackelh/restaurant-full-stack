import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/appointments" className="nav-link">Rendez-vous</Link>
            <Link to="/patients" className="nav-link">Patients</Link>
            <Link to="/prescriptions" className="nav-link">Ordonnances</Link>
          </div>
          <div className="nav-auth">
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="nav-button">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
