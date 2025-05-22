import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    type: '',
    notes: ''
  });

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${id}`);
      const appointmentData = response.data?.data || response.data;
      
      if (!appointmentData) {
        throw new Error('Données du rendez-vous non trouvées');
      }

      // Convert ISO date to local date and time
      const date = new Date(appointmentData.date);
      const localDate = date.toISOString().split('T')[0];
      const localTime = date.toTimeString().slice(0, 5);

      setFormData({
        patientId: appointmentData.patient?._id,
        date: localDate,
        time: localTime,
        type: appointmentData.type || 'consultation',
        notes: appointmentData.notes || ''
      });
    } catch (err) {
      console.error('Erreur lors du chargement du rendez-vous:', err);
      setError('Erreur lors du chargement du rendez-vous');
      toast.error('Erreur lors du chargement du rendez-vous');
    }
  };

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
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const appointmentData = {
        patientId: formData.patientId,
        date: dateTime.toISOString(),
        type: formData.type || 'consultation',
        notes: formData.notes || ''
      };
      
      let response;
      if (id) {
        response = await api.put(`/appointments/${id}`, appointmentData);
        toast.success('Rendez-vous modifié avec succès');
      } else {
        response = await api.post('/appointments', appointmentData);
        toast.success('Rendez-vous créé avec succès');
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      
      if (error.response?.status === 409) {
        const message = 'Ce créneau est déjà pris. Veuillez choisir un autre horaire (25 minutes avant/après).';
        setError(message);
        toast.error(message);
      } else {
        const message = error.response?.data?.message || `Erreur lors de ${id ? 'la modification' : 'la création'} du rendez-vous`;
        setError(message);
        toast.error(message);
      }
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
      </h1>
      
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
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : (id ? 'Modifier le rendez-vous' : 'Créer le rendez-vous')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AppointmentForm;
