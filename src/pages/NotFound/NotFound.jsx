import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6 py-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.5,
            times: [0, 0.2, 0.4, 0.6, 0.8],
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="inline-block mb-6 text-yellow-500"
        >
          <FaExclamationTriangle size={50} />
        </motion.div>
        
        <h1 className="text-7xl font-bold text-primary mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page non trouvée
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Page précédente
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
