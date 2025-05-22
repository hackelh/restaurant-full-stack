import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/Card/Card';
import api from '../../services/api';
import 'react-toastify/dist/ReactToastify.css';

const statusConfig = {
  pending: { text: 'En attente', color: 'yellow', icon: '⌛' },
  confirmed: { text: 'Confirmé', color: 'green', icon: '✓' },
  cancelled: { text: 'Annulé', color: 'red', icon: '✕' },
  completed: { text: 'Terminé', color: 'blue', icon: '✔' },
  missed: { text: 'Manqué', color: 'gray', icon: '⚠' }
};



const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        console.log('Chargement des détails du rendez-vous:', id);
        const response = await api.get(`/appointments/${id}`);
        console.log('Réponse API:', response.data);

        const data = response.data?.data || response.data;
        if (!data) {
          throw new Error('Format de données invalide - données manquantes');
        }

        console.log('Données du rendez-vous:', data);
        setAppointment(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err.message || 'Erreur lors du chargement des détails du rendez-vous');
        setLoading(false);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    if (isUpdating) return;
    
    try {
      setIsUpdating(true);
      console.log('Mise à jour du statut:', { id, newStatus });
      
      // Mettre à jour directement avec l'endpoint de mise à jour standard
      const response = await api.put(`/appointments/${id}`, {
        status: newStatus
      });

      if (!response.data) {
        throw new Error('Format de réponse invalide');
      }
      
      console.log('Réponse de mise à jour:', response.data);
      
      if (!response.data) {
        throw new Error('Aucune donnée reçue de l\'API');
      }
      
      // Mettre à jour l'état local
      setAppointment(prev => ({
        ...prev,
        status: newStatus
      }));
      
      toast.success(`Statut mis à jour : ${statusConfig[newStatus].text}`);

    } catch (error) {
      console.error('Erreur détaillée lors de la mise à jour du statut:', error);
      console.error('Message d\'erreur:', error.message);
      console.error('Détails de l\'erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!appointment) return <div className="p-6">Rendez-vous non trouvé</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Rendez-vous du {new Date(appointment?.date || new Date()).toLocaleDateString('fr-FR')}
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/appointments/${id}/edit`)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Modifier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Informations du rendez-vous">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date et heure</p>
              <p className="font-medium">
                {new Date(appointment?.date || new Date()).toLocaleString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{appointment?.type || 'Consultation'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <div className="flex flex-col space-y-4 mt-2">
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold inline-flex items-center justify-center w-fit
                    bg-${statusConfig[appointment?.status || 'pending'].color}-100 
                    text-${statusConfig[appointment?.status || 'pending'].color}-800`}
                >
                  {statusConfig[appointment?.status || 'pending'].icon} 
                  <span className="ml-2">{statusConfig[appointment?.status || 'pending'].text}</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusConfig).map(([status, { text, color, icon }]) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={isUpdating || appointment?.status === status}
                      className={`px-3 py-1.5 text-sm rounded-md inline-flex items-center
                        ${appointment?.status === status
                          ? `bg-${color}-100 text-${color}-800 cursor-default`
                          : `bg-${color}-500 text-white hover:bg-${color}-600 focus:ring-2 focus:ring-${color}-500 focus:ring-offset-2`
                        } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150`}
                    >
                      {icon}
                      <span className="ml-2">{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Patient">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom</p>
              <p className="font-medium">
                {appointment?.patient?.firstName || 'Non spécifié'} {appointment?.patient?.lastName || ''}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{appointment?.patient?.email || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p>{appointment?.patient?.phone || 'Non spécifié'}</p>
            </div>
            {appointment?.patient?._id && appointment.patient._id !== 'unknown' && (
              <Link
                to={`/patients/${appointment.patient._id}`}
                className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Voir la fiche patient
              </Link>
            )}
          </div>
        </Card>

        {appointment?.notes && (
          <Card title="Notes">
            <p className="text-gray-600 whitespace-pre-wrap">
              {appointment.notes}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetails;
