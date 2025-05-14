import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const OrdonnanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    patientId: '',
    contenu: '',
    status: 'active',
    notes: ''
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Charger les données de l'ordonnance si on est en mode édition
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchOrdonnance = async () => {
        try {
          const response = await api.get(`/ordonnances/${id}`);
          const ordonnance = response.data.data;
          setFormData({
            patientId: ordonnance.patientId,
            contenu: typeof ordonnance.contenu === 'string' 
              ? ordonnance.contenu 
              : JSON.stringify(ordonnance.contenu, null, 2),
            status: ordonnance.status,
            notes: ordonnance.notes || ''
          });
        } catch (error) {
          console.error('Erreur lors du chargement de l\'ordonnance:', error);
          toast.error('Erreur lors du chargement de l\'ordonnance');
          navigate('/ordonnances');
        }
      };
      fetchOrdonnance();
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        // S'assurer que nous avons un tableau de patients
        const patientsData = response.data?.data || [];
        console.log('Patients data:', patientsData);
        setPatients(patientsData);
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setError('Erreur lors du chargement des patients');
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/ordonnances/${id}`, formData);
        toast.success('Ordonnance mise à jour avec succès');
      } else {
        response = await api.post('/ordonnances', formData);
        toast.success('Ordonnance créée avec succès');
      }
      navigate('/ordonnances');
    } catch (error) {
      console.error('Erreur lors de l\'opération sur l\'ordonnance:', error);
      setError(error.response?.data?.message || 'Une erreur est survenue');
      toast.error(error.response?.data?.message || `Erreur lors de ${isEditing ? 'la modification' : 'la création'} de l\'ordonnance`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Nouvelle Ordonnance</h1>
      
      <Card>
        <h2 className="text-2xl font-bold mb-6">
          {isEditing ? 'Modifier l\'ordonnance' : 'Nouvelle ordonnance'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                className="input-field"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                required
              >
                <option value="">Sélectionner un patient</option>
                {Array.isArray(patients) && patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nom} {patient.prenom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenu
              </label>
              <textarea
                className="input-field"
                rows="4"
                value={formData.contenu}
                onChange={(e) => setFormData({...formData, contenu: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes additionnelles
            </label>
            <textarea
              className="input-field"
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'ordonnance')}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/ordonnances')}
            >
              Annuler
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default OrdonnanceForm;
