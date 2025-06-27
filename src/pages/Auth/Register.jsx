import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { UserIcon, EnvelopeIcon, LockClosedIcon, ArrowLeftIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import logo from '../../assets/logo.svg';

// Déclaration du composant fonctionnel pour l'inscription des utilisateurs
const Register = () => {
  // Hook de navigation pour rediriger l'utilisateur après inscription
  const navigate = useNavigate();
  // Récupération de la fonction register depuis le contexte d'authentification
  const { register } = useAuth();
  
  // État pour stocker les données du formulaire d'inscription
  const [formData, setFormData] = useState({
    name: '',           // Nom complet de l'utilisateur
    email: '',          // Adresse email
    password: '',       // Mot de passe
    confirmPassword: '' // Confirmation du mot de passe
  });
  
  // État pour stocker les messages d'erreur de validation
  const [errors, setErrors] = useState({});
  // État pour indiquer si l'inscription est en cours
  const [loading, setLoading] = useState(false);
  // État pour calculer et afficher la force du mot de passe (0-100%)
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Fonction de validation complète du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation du nom : doit être non vide après suppression des espaces
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    // Validation de l'email : doit être présent et avoir un format valide
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation du mot de passe : doit être présent et avoir au moins 6 caractères
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    // Validation de la confirmation : doit être présente et correspondre au mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Met à jour l'état des erreurs et retourne true si aucune erreur
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour calculer la force du mot de passe (0-100%)
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    // +25% si le mot de passe fait au moins 8 caractères
    if (password.length >= 8) strength += 1;
    // +25% s'il contient au moins une majuscule
    if (/[A-Z]/.test(password)) strength += 1;
    // +25% s'il contient au moins un chiffre
    if (/[0-9]/.test(password)) strength += 1;
    // +25% s'il contient au moins un caractère spécial
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    // Retourne le pourcentage de force (0-100%)
    return (strength / 4) * 100;
  };

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Met à jour les données du formulaire
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si c'est le champ mot de passe, recalcule la force
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Efface l'erreur du champ modifié s'il y en avait une
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Fonction pour gérer la soumission du formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    // Réinitialise toutes les erreurs
    setErrors({});
    
    // Validation côté client : vérifie que tous les champs sont remplis
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        global: 'Tous les champs sont obligatoires'
      }));
      return;
    }
    
    // Validation : vérifie que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        password: 'Les mots de passe ne correspondent pas',
        confirmPassword: 'Les mots de passe ne correspondent pas'
      }));
      return;
    }
    
    // Active l'état de chargement
    setLoading(true);
    
    try {
      // Appelle la fonction d'inscription du contexte d'authentification
      const { success, error } = await register(formData);
      
      if (success) {
        // Si l'inscription réussit, affiche un message de succès et redirige
        toast.success('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        navigate('/login');
      } else {
        // Si l'inscription échoue, affiche l'erreur
        setErrors(prev => ({
          ...prev,
          global: error || 'Erreur lors de l\'inscription'
        }));
        toast.error(error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      // Gestion des erreurs inattendues
      console.error('Erreur lors de la soumission du formulaire:', error);
      setErrors(prev => ({
        ...prev,
        global: 'Une erreur est survenue. Veuillez réessayer.'
      }));
      toast.error('Une erreur est survenue lors de l\'inscription');
    } finally {
      // Désactive l'état de chargement dans tous les cas
      setLoading(false);
    }
  };

  // États pour afficher/masquer les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Rendu du composant d'inscription
  return (
    // Container principal avec fond dégradé
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        {/* En-tête avec logo et titre */}
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Logo" 
            className="mx-auto h-20 w-auto mb-4"
          />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inscrivez-vous pour accéder à votre espace personnel
          </p>
        </div>

        {/* Carte blanche contenant le formulaire */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Nom complet */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Icône utilisateur à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Dr. John Doe"
                />
              </div>
              {/* Affichage de l'erreur du nom si elle existe */}
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Icône email à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="votre@email.com"
                />
              </div>
              {/* Affichage de l'erreur de l'email si elle existe */}
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Icône cadenas à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                {/* Bouton pour afficher/masquer le mot de passe */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Indicateur de force du mot de passe */}
              {formData.password && (
                <div className="mt-2">
                  {/* Barre de progression de la force */}
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        passwordStrength <= 25 ? 'bg-red-500' : 
                        passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  {/* Texte indiquant la force */}
                  <p className="mt-1 text-xs text-gray-500">
                    {passwordStrength <= 25 ? 'Faible' : 
                     passwordStrength <= 75 ? 'Moyen' : 'Fort'}
                  </p>
                </div>
              )}
              {/* Affichage de l'erreur du mot de passe si elle existe */}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Champ Confirmation du mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Icône cadenas à gauche */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="••••••••"
                />
                {/* Bouton pour afficher/masquer la confirmation */}
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Affichage de l'erreur de confirmation si elle existe */}
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Bouton de soumission du formulaire */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                {loading ? 'Inscription en cours...' : 'Créer un compte'}
              </button>
            </div>
          </form>

          {/* Section de navigation vers la page de connexion */}
          <div className="mt-6">
            {/* Séparateur visuel */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Déjà inscrit ?
                </span>
              </div>
            </div>

            {/* Lien vers la page de connexion */}
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;