import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, loading, checkAuth } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!user && !loading) {
        try {
          await checkAuth();
        } catch (error) {
          console.error('Erreur lors de la vérification de l\'authentification:', error);
        } finally {
          setIsCheckingAuth(false);
        }
      } else {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [user, loading, checkAuth]);

  if (loading || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
