import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Allo Dentiste — Tous droits réservés</p>
    </footer>
  );
};

export default Footer;
