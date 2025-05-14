import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiLogOut, FiLogIn } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? 'bg-blue-700' : '';
  };

  return (
    <aside className="w-64 bg-blue-800 text-white min-h-screen p-4 flex flex-col">
      <nav className="flex-grow">
        <ul className="space-y-2">
          <li>
            <Link to="/dashboard" className={`block p-2 rounded hover:bg-blue-700 transition-colors ${isActive('/dashboard')}`}>
              🏠 Dashboard
            </Link>
          </li>

          <li>
            <Link to="/appointments" className={`block p-2 rounded hover:bg-blue-700 transition-colors ${isActive('/appointments')}`}>
              📅 Rendez-vous
            </Link>
          </li>
          <li>
            <Link to="/patients" className={`block p-2 rounded hover:bg-blue-700 transition-colors ${isActive('/patients')}`}>
              👤 Patients
            </Link>
          </li>
          <li>
            <Link to="/ordonnances" className={`block p-2 rounded hover:bg-blue-700 transition-colors ${isActive('/ordonnances')}`}>
              🧾 Ordonnances
            </Link>
          </li>
          <li>
            <Link to="/calendar" className={`block p-2 rounded hover:bg-blue-700 transition-colors ${isActive('/calendar')}`}>
              📆 Planning
            </Link>
          </li>
        </ul>
      </nav>
      {user && (
        <div className="pt-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center w-full"
          >
            <FiLogOut className="mr-2" />
            Se déconnecter
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
