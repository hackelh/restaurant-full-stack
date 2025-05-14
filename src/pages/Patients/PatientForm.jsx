import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/Card/Card';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: {
      rue: '',
      complementAdresse: '',
      codePostal: '',
      ville: '',
      pays: 'France'
    },
    numeroSecu: '',
    notesMedicales: '',
    groupeSanguin: '',
    allergies: [],
    antecedentsMedicaux: [],
    traitementEnCours: [],
    profession: '',
    fumeur: false,
    remarques: ''
  });

  const groupesSanguins = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/patients/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError('Erreur lors du chargement du patient');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      console.log('Données envoyées:', formData);
      
      if (id) {
        await api.put(`/patients/${id}`, formData);
      } else {
        const response = await api.post('/patients', formData);
        console.log('Réponse du serveur:', response.data);
      }
      
      navigate('/patients');
    } catch (err) {
      console.error('Erreur complète:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error ||
                          (id ? 'Erreur lors de la modification du patient' : 'Erreur lors de la création du patient');
      setError(errorMessage);
      
      if (err.response?.data?.errors) {
        console.log('Erreurs de validation:', err.response.data.errors);
        setError(err.response.data.errors.join('\n'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Modifier Patient' : 'Nouveau Patient'}</h1>
      
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">Chargement...</div>
      ) : (
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                className="input-field"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                className="input-field"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone</label>
              <input
                type="tel"
                className="input-field"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
              <input
                type="date"
                className="input-field"
                value={formData.dateNaissance}
                onChange={(e) => setFormData({...formData, dateNaissance: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Numéro de sécurité sociale</label>
              <input
                type="text"
                className="input-field"
                value={formData.numeroSecu}
                onChange={(e) => setFormData({...formData, numeroSecu: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Groupe sanguin</label>
              <select
                className="input-field"
                value={formData.groupeSanguin}
                onChange={(e) => setFormData({...formData, groupeSanguin: e.target.value})}
              >
                <option value="">Sélectionner</option>
                {groupesSanguins.map(groupe => (
                  <option key={groupe} value={groupe}>{groupe}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Profession</label>
              <input
                type="text"
                className="input-field"
                value={formData.profession}
                onChange={(e) => setFormData({...formData, profession: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <input
                type="text"
                className="input-field"
                placeholder="Séparez les allergies par des virgules"
                value={formData.allergies.join(', ')}
                onChange={(e) => setFormData({...formData, allergies: e.target.value.split(',').map(item => item.trim()).filter(item => item)})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Antécédents médicaux</label>
              <input
                type="text"
                className="input-field"
                placeholder="Séparez les antécédents par des virgules"
                value={formData.antecedentsMedicaux.join(', ')}
                onChange={(e) => setFormData({...formData, antecedentsMedicaux: e.target.value.split(',').map(item => item.trim()).filter(item => item)})}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Traitements en cours</label>
              <input
                type="text"
                className="input-field"
                placeholder="Séparez les traitements par des virgules"
                value={formData.traitementEnCours.join(', ')}
                onChange={(e) => setFormData({...formData, traitementEnCours: e.target.value.split(',').map(item => item.trim()).filter(item => item)})}
              />
            </div>

            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={formData.fumeur}
                onChange={(e) => setFormData({...formData, fumeur: e.target.checked})}
              />
              <label className="ml-2 block text-sm text-gray-900">Fumeur</label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rue</label>
              <input
                type="text"
                className="input-field"
                value={formData.adresse.rue}
                onChange={(e) => setFormData({
                  ...formData,
                  adresse: { ...formData.adresse, rue: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Complément d'adresse</label>
              <input
                type="text"
                className="input-field"
                value={formData.adresse.complementAdresse}
                onChange={(e) => setFormData({
                  ...formData,
                  adresse: { ...formData.adresse, complementAdresse: e.target.value }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                type="text"
                className="input-field"
                value={formData.adresse.codePostal}
                onChange={(e) => setFormData({
                  ...formData,
                  adresse: { ...formData.adresse, codePostal: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                className="input-field"
                value={formData.adresse.ville}
                onChange={(e) => setFormData({
                  ...formData,
                  adresse: { ...formData.adresse, ville: e.target.value }
                })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Pays</label>
              <input
                type="text"
                className="input-field"
                value={formData.adresse.pays}
                onChange={(e) => setFormData({
                  ...formData,
                  adresse: { ...formData.adresse, pays: e.target.value }
                })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes médicales</label>
            <textarea
              className="input-field"
              rows="4"
              value={formData.notesMedicales}
              onChange={(e) => setFormData({...formData, notesMedicales: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/patients')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </Card>
      )}
    </div>
  );
};

export default PatientForm;
