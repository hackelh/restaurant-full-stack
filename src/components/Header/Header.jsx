import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <Link to="/" className="header-logo">🦷 Allo Dentiste</Link>
      <div className="header-user">
        {user ? (
          <>
            <span>Bienvenue, {user.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Connexion
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
