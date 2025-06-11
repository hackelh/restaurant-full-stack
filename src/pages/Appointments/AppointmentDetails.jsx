import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../../services/api';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/appointments/${id}`);
        setAppointment(response.data.data || response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement du rendez-vous');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement du rendez-vous...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-red-500 text-xl mb-4">{error}</div>
      <button
        onClick={() => navigate('/appointments')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  if (!appointment) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-gray-500 text-xl mb-4">Rendez-vous non trouvé</div>
      <button
        onClick={() => navigate('/appointments')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/appointments')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <FaArrowLeft /> Retour
        </button>
        <h1 className="text-2xl font-bold">Détails du rendez-vous</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Patient</p>
          <p className="font-medium">{appointment.patient?.nom} {appointment.patient?.prenom}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{new Date(appointment.date).toLocaleString('fr-FR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Téléphone</p>
          <p className="font-medium">{appointment.patient?.telephone || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{appointment.patient?.email || '-'}</p>
        </div>
        {appointment.description && (
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-gray-700 whitespace-pre-wrap">{appointment.description}</p>
          </div>
        )}
        {appointment.status && (
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${appointment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {appointment.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
