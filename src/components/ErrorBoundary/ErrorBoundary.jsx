import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const ErrorBoundary = () => {
  const error = useRouteError();
  
  let title = 'Une erreur est survenue';
  let message = 'Désolé, une erreur inattendue s\'est produite.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page non trouvée';
      message = 'Désolé, la page que vous recherchez n\'existe pas.';
    } else if (error.status === 401) {
      title = 'Non autorisé';
      message = 'Vous devez être connecté pour accéder à cette page.';
    } else if (error.status === 503) {
      title = 'Service indisponible';
      message = 'Désolé, le service est temporairement indisponible.';
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto text-yellow-400 text-5xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="text-gray-600 mb-8">
            {message}
          </p>
          {error instanceof Error && (
            <pre className="mt-4 bg-gray-50 p-4 rounded-md text-sm text-gray-500 overflow-auto">
              {error.message}
            </pre>
          )}
          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
