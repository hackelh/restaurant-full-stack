import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { UserIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, IdentificationIcon, BriefcaseIcon, ExclamationCircleIcon, XMarkIcon, CheckCircleIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({firstName: '',lastName: '',email: '', phone: '',dateOfBirth: '', gender: '',address: { street: '',additional: '',postalCode: '',city: '',country: ''},
    numeroSecu: '',
    bloodType: '',
    allergies: [],
    medicalHistory: '',
    currentTreatments: '',
    profession: '',
    isSmoker: false,
    notes: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    status: 'actif'
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'unknown', label: 'Non spécifié' }
  ];
  
  const relationships = [
    { value: 'spouse', label: 'Conjoint(e)' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Enfant' },
    { value: 'sibling', label: 'Frère/Soeur' },
    { value: 'friend', label: 'Ami(e)' },
    { value: 'other', label: 'Autre' }
  ];

  // Charger les données du patient si en mode édition
  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/patients/${id}`);
          const patientData = response.data.data || response.data;
          
          // Formater les données pour le formulaire
          setFormData({
            ...patientData,
            // Assurer que les champs optionnels ont des valeurs par défaut
            allergies: Array.isArray(patientData.allergies) ? patientData.allergies : [],
            address: {
              street: patientData.address?.street || '',
              additional: patientData.address?.additional || '',
              postalCode: patientData.address?.postalCode || '',
              city: patientData.address?.city || '',
              country: patientData.address?.country || ''
            },
            emergencyContact: {
              name: patientData.emergencyContact?.name || '',
              relationship: patientData.emergencyContact?.relationship || '',
              phone: patientData.emergencyContact?.phone || ''
            }
          });
        } catch (err) {
          console.error('Erreur lors du chargement du patient:', err);
          toast.error('Impossible de charger les données du patient');
          navigate('/patients');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPatient();
    }
  }, [id, navigate]);
  
  // Gestion des changements de champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Gestion des champs imbriqués (ex: address.street)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Effacer les erreurs lors de la saisie
    if (error) setError(null);
  };
  
  // Gestion de l'ajout d'une allergie
  const handleAddAllergy = (e) => {
    e.preventDefault();
    const allergy = e.target.elements.allergy?.value.trim();
    if (allergy) {
      setFormData(prev => ({
        ...prev,
        allergies: Array.isArray(prev.allergies) ? [...prev.allergies, allergy] : [allergy]
      }));
      e.target.reset();
    }
  };
  
  // Suppression d'une allergie
  const handleRemoveAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: Array.isArray(prev.allergies) ? prev.allergies.filter((_, i) => i !== index) : []
    }));
  };
  
  // Validation du formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!formData.lastName.trim()) errors.lastName = 'Le nom est requis';
    if (!formData.firstName.trim()) errors.firstName = 'Le prénom est requis';
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Adresse email invalide';
    }
    
    if (formData.phone && !/^[0-9+\s-]{10,20}$/.test(formData.phone)) {
      errors.phone = 'Numéro de téléphone invalide';
    }
    
    if (formData.numeroSecu && !/^[0-9]{13,15}$/.test(formData.numeroSecu.replace(/\s/g, ''))) {
      errors.numeroSecu = 'Numéro de sécurité sociale invalide';
    }
    
    if (formData.emergencyContact.phone && !/^[0-9+\s-]{10,20}$/.test(formData.emergencyContact.phone)) {
      errors.emergencyPhone = 'Numéro de téléphone d\'urgence invalide';
    }
    
    setError(Object.keys(errors).length > 0 ? errors : null);
    return Object.keys(errors).length === 0;
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Préparer les données pour l'API
      const patientData = {
        ...formData,
        // Nettoyer les numéros de téléphone
        phone: formData.phone.replace(/\s/g, ''),
        numeroSecu: formData.numeroSecu.replace(/\s/g, ''),
        emergencyContact: {
          ...formData.emergencyContact,
          phone: formData.emergencyContact.phone.replace(/\s/g, '')
        }
      };
      
      if (id) {
        await api.put(`/patients/${id}`, patientData);
        toast.success('Patient mis à jour avec succès');
      } else {
        await api.post('/patients', patientData);
        toast.success('Patient créé avec succès');
      }
      
      navigate('/patients');
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error ||
                         (id ? 'Erreur lors de la mise à jour du patient' : 'Erreur lors de la création du patient');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Gestion de la suppression du patient
  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      await api.delete(`/patients/${id}`);
      toast.success('Patient supprimé avec succès');
      navigate('/patients');
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression du patient');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Fonction pour afficher les erreurs de formulaire
  const renderFieldError = (fieldName) => {
    if (!error || typeof error !== 'object' || !error[fieldName]) return null;
    return <p className="mt-1 text-sm text-red-600">{error[fieldName]}</p>;
  };

  // Rendu de l'interface utilisateur
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {id ? 'Modifier le patient' : 'Nouveau patient'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {id ? 'Mettez à jour les informations du patient.' : 'Remplissez les informations pour créer un nouveau patient.'}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
              Retour à la liste
            </button>
            {id && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
                Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informations {id ? 'du patient' : 'du nouveau patient'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Renseignez les informations personnelles du patient.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
                {renderFieldError('nom')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  className="input-field"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {renderFieldError('firstName')}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                />
                {renderFieldError('email')}
              </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  {renderFieldError('phone')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="input-field"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                  {renderFieldError('dateOfBirth')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de sécurité sociale</label>
                  <input
                    type="text"
                    name="numeroSecu"
                    className="input-field"
                    value={formData.numeroSecu}
                    onChange={handleChange}
                    required
                  />
                  {renderFieldError('numeroSecu')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Groupe sanguin</label>
                  <select
                    name="bloodType"
                    className="input-field"
                    value={formData.bloodType}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    className="input-field"
                    value={formData.profession}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Allergies</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="allergy"
                      className="flex-1 min-w-0 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Ajouter une allergie"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy(e)}
                    />
                    <button
                      type="button"
                      onClick={handleAddAllergy}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ajouter
                    </button>
                  </div>
                  {Array.isArray(formData.allergies) && formData.allergies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.allergies.map((allergy, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {allergy}
                          <button
                            type="button"
                            onClick={() => handleRemoveAllergy(index)}
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                          >
                            <span className="sr-only">Supprimer</span>
                            <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                              <path fillRule="evenodd" d="M4 3.293l2.146-2.147a.5.5 0 01.708.708L4.707 4l2.147 2.146a.5.5 0 01-.708.708L4 4.707l-2.146 2.147a.5.5 0 01-.708-.708L3.293 4 1.146 1.854a.5.5 0 01.708-.708L4 3.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Antécédents médicaux</label>
                  <textarea
                    name="medicalHistory"
                    className="input-field"
                    rows="3"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    placeholder="Décrivez les antécédents médicaux du patient"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Traitements en cours</label>
                  <textarea
                    name="currentTreatments"
                    className="input-field"
                    rows="3"
                    value={formData.currentTreatments}
                    onChange={handleChange}
                    placeholder="Décrivez les traitements en cours"
                  />
                </div>

                <div className="col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    name="isSmoker"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={formData.isSmoker}
                    onChange={handleChange}
                  />
                  <label className="ml-2 block text-sm text-gray-900">Fumeur</label>
                </div>

                {/* Section Adresse */}
                <div className="col-span-2 mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Adresse</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Rue</label>
                      <input
                        type="text"
                        name="address.street"
                        className="input-field"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Complément d'adresse</label>
                      <input
                        type="text"
                        name="address.additional"
                        className="input-field"
                        value={formData.address.additional}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Code postal</label>
                      <input
                        type="text"
                        name="address.postalCode"
                        className="input-field"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ville</label>
                      <input
                        type="text"
                        name="address.city"
                        className="input-field"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pays</label>
                      <input
                        type="text"
                        name="address.country"
                        className="input-field"
                        value={formData.address.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section Notes médicales */}
                <div className="col-span-2 pt-6">
                  <label className="block text-sm font-medium text-gray-700">Notes médicales</label>
                  <textarea
                    name="medicalNotes"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows="4"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    placeholder="Ajoutez des notes médicales supplémentaires"
                  />
                </div>

                {/* Boutons d'action */}
                <div className="col-span-2 flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/patients')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
