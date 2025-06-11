import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);


  const checkAuth = async () => {
    try {
      console.log('Récupération des données utilisateur...');
      const response = await api.get('/auth/me');
      console.log('Réponse complète de /auth/me:', response);
      
      // Vérifier la structure des données
      const responseData = response.data;
      console.log('Données brutes de la réponse:', responseData);
      
      // Extraire les données utilisateur selon la structure de la réponse
      const userData = responseData.data || responseData;
      console.log('Données utilisateur extraites:', userData);
      
      // Créer un nouvel objet utilisateur avec des valeurs par défaut
      const normalizedUser = {
        id: userData.id,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'dentist',
        // Mapper name vers lastName pour la compatibilité
        lastName: userData.name || userData.lastName || 'Utilisateur',
        // Autres champs avec des valeurs par défaut
        phone: userData.phone || '',
        numeroSecu: userData.numeroSecu || ''
      };
      
      console.log('Utilisateur normalisé:', normalizedUser);
      setUser(normalizedUser);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Tentative de connexion avec:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Réponse de connexion:', response);
      
      const { token, user: userData } = response.data;
      console.log('Données utilisateur reçues:', userData);
      
      if (!token) {
        throw new Error('Aucun token reçu du serveur');
      }
      
      localStorage.setItem('token', token);
      
      // Normaliser les données utilisateur
      const normalizedUser = {
        id: userData.id,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'dentist',
        lastName: userData.name || userData.lastName || 'Utilisateur',
        phone: userData.phone || '',
        numeroSecu: userData.numeroSecu || ''
      };
      
      console.log('Utilisateur normalisé après connexion:', normalizedUser);
      setUser(normalizedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la connexion:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion: ' + error.message
      };
    }
  };

  const register = async (formData) => {
    try {
      console.log('Tentative d\'inscription avec les données:', formData);
      
      // Validation des champs requis côté client
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        return {
          success: false,
          error: 'Veuillez remplir tous les champs obligatoires'
        };
      }

      // Vérification de la correspondance des mots de passe
      if (formData.password !== formData.confirmPassword) {
        return {
          success: false,
          error: 'Les mots de passe ne correspondent pas'
        };
      }
      
      // Préparation des données pour l'API
      const { confirmPassword, ...userData } = formData;
      
      console.log('Données nettoyées pour l\'inscription:', userData);
      
      const response = await api.post('/auth/register', userData);
      console.log('Réponse d\'inscription:', response);
      
      const { token, user: userDataResponse } = response.data;
      
      if (!token || !userDataResponse) {
        throw new Error('Réponse du serveur invalide');
      }
      
      // Stocker le token
      localStorage.setItem('token', token);
      
      // Normaliser les données utilisateur
      const normalizedUser = {
        id: userDataResponse.id,
        name: userDataResponse.name || '',
        email: userDataResponse.email || '',
        role: userDataResponse.role || 'dentist'
      };
      
      console.log('Utilisateur normalisé après inscription:', normalizedUser);
      setUser(normalizedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      
      // Gestion des erreurs spécifiques
      let errorMessage = 'Une erreur est survenue lors de l\'inscription';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Network Error')) {
        errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'La requête a expiré. Veuillez réessayer.';
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
