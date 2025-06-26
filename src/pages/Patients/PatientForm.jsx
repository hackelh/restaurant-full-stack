import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: {
      rue: '',
      complementAdresse: '',
      codePostal: '',
      ville: '',
      pays: 'France'
    },
    dateNaissance: '',
    numeroSecu: '',
    dentisteId: user?.id,
    groupeSanguin: '',
    allergies: [],
    profession: '',
    fumeur: false,
    remarques: '',
    notesMedicales: '',
    traitementEnCours: [],
    status: 'actif',
    antecedentsMedicaux: []
  });

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          console.log('Chargement du patient avec id:', id);
          const response = await api.get(`/patients/${id}`);
          console.log('Réponse API patient:', response.data);
          const data = response.data.data;
          const defaultAdresse = {
            rue: '',
            complementAdresse: '',
            codePostal: '',
            ville: '',
            pays: 'France'
          };
          let adresse = defaultAdresse;
          if (typeof data.adresse === 'string') {
            try {
              adresse = { ...defaultAdresse, ...JSON.parse(data.adresse) };
            } catch {
              adresse = defaultAdresse;
            }
          } else if (typeof data.adresse === 'object' && data.adresse !== null) {
            adresse = { ...defaultAdresse, ...data.adresse };
          }
          let dateNaissance = '';
          if (data.dateNaissance) {
            const d = new Date(data.dateNaissance);
            if (!isNaN(d)) {
              dateNaissance = d.toISOString().slice(0, 10);
            }
          }
          setFormData({
            nom: data.nom || '',
            prenom: data.prenom || '',
            email: data.email || '',
            telephone: data.telephone || '',
            adresse,
            dateNaissance,
            numeroSecu: data.numeroSecu || '',
            dentisteId: data.dentisteId || user?.id,
            groupeSanguin: data.groupeSanguin || '',
            allergies: Array.isArray(data.allergies)
              ? data.allergies
              : (typeof data.allergies === 'string' && data.allergies.trim() !== ''
                  ? (() => { 
                      try { 
                        const parsed = JSON.parse(data.allergies);
                        return Array.isArray(parsed) ? parsed : [];
                      } catch { 
                        return []; 
                      } 
                    })()
                  : []),
            profession: data.profession || '',
            fumeur: typeof data.fumeur === 'boolean' ? data.fumeur : false,
            remarques: data.remarques || '',
            notesMedicales: data.notesMedicales || '',
            traitementEnCours: Array.isArray(data.traitementEnCours)
              ? data.traitementEnCours
              : (typeof data.traitementEnCours === 'string' && data.traitementEnCours.trim() !== ''
                  ? (() => { 
                      try { 
                        const parsed = JSON.parse(data.traitementEnCours);
                        return Array.isArray(parsed) ? parsed : [];
                      } catch { 
                        return []; 
                      } 
                    })()
                  : []),
            status: data.status || 'actif',
            antecedentsMedicaux: Array.isArray(data.antecedentsMedicaux)
              ? data.antecedentsMedicaux
              : (typeof data.antecedentsMedicaux === 'string' && data.antecedentsMedicaux.trim() !== ''
                  ? (() => { 
                      try { 
                        const parsed = JSON.parse(data.antecedentsMedicaux);
                        return Array.isArray(parsed) ? parsed : [];
                      } catch { 
                        return []; 
                      } 
                    })()
                  : []),
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const validateForm = () => {
    if (!formData.nom || !formData.prenom || !formData.telephone || !formData.dateNaissance || !user?.id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (!formData.adresse || 
        !formData.adresse.rue || 
        !formData.adresse.codePostal || 
        !formData.adresse.ville || 
        !formData.adresse.pays) {
      toast.error('Veuillez remplir tous les champs d\'adresse obligatoires');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      const patientData = {
        ...formData,
        dentisteId: parseInt(formData.dentisteId) || null,
        dateNaissance: formData.dateNaissance ? new Date(formData.dateNaissance).toISOString() : null
      };

      console.log('Sending patient data:', patientData);
      
      if (id) {
        await api.put(`/patients/${id}`, patientData);
        toast.success('Patient mis à jour avec succès');
      } else {
        await api.post('/patients', patientData);
        toast.success('Patient créé avec succès');
      }
      
      navigate('/patients');
    } catch (err) {
      console.error('Erreur complète:', err);
      console.error('Response data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                       err.response?.data?.error?.message ||
                       (id ? 'Erreur lors de la mise à jour' : 'Erreur lors de la création');
      toast.error(errorMessage);
      
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          toast.error(error);
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id ? 'Modifier le patient' : 'Nouveau patient'}
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="inline-block h-5 w-5 mr-2" />
            Retour
          </button>
          {id && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="inline-block h-5 w-5 mr-2" />
              Supprimer
            </button>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Téléphone <span className="text-red-500">*</span></label>
          <input
            type="tel"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rue <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="adresse.rue"
                value={formData.adresse.rue}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Complément d'adresse</label>
              <input
                type="text"
                name="adresse.complementAdresse"
                value={formData.adresse.complementAdresse}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="adresse.codePostal"
                  value={formData.adresse.codePostal}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="adresse.ville"
                  value={formData.adresse.ville}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pays <span className="text-red-500">*</span></label>
              <select
                name="adresse.pays"
                value={formData.adresse.pays || 'France'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                required
              >
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Luxembourg">Luxembourg</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date de naissance <span className="text-red-500">*</span></label>
          <input
            type="date"
            name="dateNaissance"
            value={formData.dateNaissance}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro de sécurité sociale</label>
          <input
            type="text"
            name="numeroSecu"
            value={formData.numeroSecu}
            onChange={handleChange}
            placeholder="1 23 45 67 890 123 45"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Groupe sanguin</label>
          <select
            name="groupeSanguin"
            value={formData.groupeSanguin}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="">Sélectionner</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ajouter une allergie"
              value={formData._allergyInput || ''}
              onChange={e => setFormData(prev => ({ ...prev, _allergyInput: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
            <button type="button" onClick={() => {
              if (formData._allergyInput && formData._allergyInput.trim() !== '') {
                setFormData(prev => ({
                  ...prev,
                  allergies: [...(Array.isArray(prev.allergies) ? prev.allergies : []), prev._allergyInput],
                  _allergyInput: ''
                }));
              }
            }} className="bg-blue-500 text-white px-3 py-1 rounded">Ajouter</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(formData.allergies) ? formData.allergies : []).map((allergy, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {allergy}
                <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  allergies: (Array.isArray(prev.allergies) ? prev.allergies : []).filter((_, i) => i !== idx)
                }))} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Profession</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fumeur</label>
          <select
            name="fumeur"
            value={formData.fumeur ? 'true' : 'false'}
            onChange={e => setFormData(prev => ({ ...prev, fumeur: e.target.value === 'true' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="false">Non</option>
            <option value="true">Oui</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Remarques</label>
          <textarea
            name="remarques"
            value={formData.remarques}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes médicales</label>
          <textarea
            name="notesMedicales"
            value={formData.notesMedicales}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Traitement en cours</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Ajouter un traitement"
              value={formData._traitementInput || ''}
              onChange={e => setFormData(prev => ({ ...prev, _traitementInput: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
            <button type="button" onClick={() => {
              if (formData._traitementInput && formData._traitementInput.trim() !== '') {
                setFormData(prev => ({
                  ...prev,
                  traitementEnCours: [...(Array.isArray(prev.traitementEnCours) ? prev.traitementEnCours : []), prev._traitementInput],
                  _traitementInput: ''
                }));
              }
            }} className="bg-blue-500 text-white px-3 py-1 rounded">Ajouter</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(formData.traitementEnCours) ? formData.traitementEnCours : []).map((trait, idx) => (
              <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                {trait}
                <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  traitementEnCours: (Array.isArray(prev.traitementEnCours) ? prev.traitementEnCours : []).filter((_, i) => i !== idx)
                }))} className="ml-1 text-red-500">&times;</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          >
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="archive">Archivé</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Antécédents médicaux</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Type (ex: diabète)"
              value={formData._antType || ''}
              onChange={e => setFormData(prev => ({ ...prev, _antType: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
            <input
              type="text"
              placeholder="Description"
              value={formData._antDesc || ''}
              onChange={e => setFormData(prev => ({ ...prev, _antDesc: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
            <button type="button" onClick={() => {
              if (formData._antType && formData._antType.trim() !== '') {
                setFormData(prev => ({
                  ...prev,
                  antecedentsMedicaux: [...(Array.isArray(prev.antecedentsMedicaux) ? prev.antecedentsMedicaux : []), {
                    type: prev._antType,
                    description: prev._antDesc || ''
                  }],
                  _antType: '',
                  _antDesc: ''
                }));
              }
            }} className="bg-blue-500 text-white px-3 py-1 rounded">Ajouter</button>
          </div>
          <div className="flex flex-col gap-2">
            {(Array.isArray(formData.antecedentsMedicaux) ? formData.antecedentsMedicaux : []).map((ant, idx) => (
              <div key={idx} className="bg-gray-100 px-3 py-2 rounded flex items-center justify-between">
                <div>
                  <span className="font-medium">{ant.type}</span> : <span className="text-gray-700">{ant.description}</span>
                </div>
                <button type="button" onClick={() => setFormData(prev => ({
                  ...prev,
                  antecedentsMedicaux: (Array.isArray(prev.antecedentsMedicaux) ? prev.antecedentsMedicaux : []).filter((_, i) => i !== idx)
                }))} className="ml-2 text-red-500">&times;</button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSubmitting ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Créer le patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;