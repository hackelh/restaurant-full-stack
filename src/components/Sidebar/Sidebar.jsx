import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';

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
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white min-h-screen p-4 flex flex-col shadow-xl">
      <motion.div 
        className="mb-8 p-4 border-b border-blue-700/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-blue-900"></div>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {user?.nom ? `Dr. ${user.nom}` : 'Administrateur'}
            </h2>
            <p className="text-sm text-blue-300">
              {user?.specialite || 'Dentiste'}
            </p>
          </div>
        </div>
      </motion.div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          <motion.li whileHover={{ scale: 1.02 }}>
            <Link 
              to="/dashboard" 
              className={`flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all ${isActive('/dashboard') ? 'bg-blue-700 shadow-lg' : ''}`}
            >
              <HomeIcon className="w-5 h-5 mr-3" />
              <span>Dashboard</span>
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.02 }}>
            <Link 
              to="/appointments" 
              className={`flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all ${isActive('/appointments') ? 'bg-blue-700 shadow-lg' : ''}`}
            >
              <CalendarIcon className="w-5 h-5 mr-3" />
              <span>Rendez-vous</span>
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.02 }}>
            <Link 
              to="/patients" 
              className={`flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all ${isActive('/patients') ? 'bg-blue-700 shadow-lg' : ''}`}
            >
              <UserGroupIcon className="w-5 h-5 mr-3" />
              <span>Patients</span>
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.02 }}>
            <Link 
              to="/ordonnances" 
              className={`flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all ${isActive('/ordonnances') ? 'bg-blue-700 shadow-lg' : ''}`}
            >
              <DocumentTextIcon className="w-5 h-5 mr-3" />
              <span>Ordonnances</span>
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.02 }}>
            <Link 
              to="/planning" 
              className={`flex items-center p-3 rounded-lg hover:bg-blue-700/50 transition-all ${isActive('/calendar') ? 'bg-blue-700 shadow-lg' : ''}`}
            >
              <ClipboardDocumentListIcon className="w-5 h-5 mr-3" />
              <span>Planning</span>
            </Link>
          </motion.li>
        </ul>
      </nav>
      {user && (
        <div className="pt-4 border-t border-blue-700/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="text-gray-300 hover:bg-red-500/20 hover:text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center w-full transition-all"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span>Se déconnecter</span>
          </motion.button>
        </div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
