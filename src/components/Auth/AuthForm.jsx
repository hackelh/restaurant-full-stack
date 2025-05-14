import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';

const AuthForm = ({
  title,
  onSubmit,
  children,
  submitText,
  loading,
  footerText,
  footerLink,
  footerLinkText
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            🦷 Allo Dentiste - Portail professionnel
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Chargement...' : submitText}
          </button>

          {footerText && (
            <p className="mt-4 text-center text-sm text-gray-600">
              {footerText}{' '}
              <Link to={footerLink} className="font-medium text-primary hover:text-primary-dark">
                {footerLinkText}
              </Link>
            </p>
          )}
        </form>
      </Card>
    </div>
  );
};

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  submitText: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  footerText: PropTypes.string,
  footerLink: PropTypes.string,
  footerLinkText: PropTypes.string
};

export default AuthForm;
