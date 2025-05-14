import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const AppointmentForm = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        console.log('Réponse patients:', response.data);
        // S'assurer que nous avons un tableau de patients
        const patientsData = response.data?.data || [];
        setPatients(patientsData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setError('Erreur lors du chargement des patients');
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const appointmentData = {
        patientId: formData.patientId,
        date: dateTime.toISOString(),
        type: formData.type || 'consultation',
        notes: formData.notes || ''
      };
      
      const response = await api.post('/appointments', appointmentData);
      navigate('/appointments');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      
      if (error.response?.status === 409) {
        setError('Ce créneau est déjà pris. Veuillez choisir un autre horaire (25 minutes avant/après).');
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la création du rendez-vous');
      }
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Nouveau Rendez-vous</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
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
                Type de rendez-vous
              </label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="consultation">Consultation</option>
                <option value="control">Contrôle</option>
                <option value="emergency">Urgence</option>
                <option value="cleaning">Nettoyage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                className="input-field"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Heure
              </label>
              <input
                type="time"
                className="input-field"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              className="input-field w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Créer le rendez-vous
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AppointmentForm;
