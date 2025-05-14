import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await api.get(`/appointments/${id}`);
        setAppointment(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des détails du rendez-vous');
        setLoading(false);
      }
    };
    fetchAppointmentDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/appointments/${id}`, { status: newStatus });
      setAppointment({ ...appointment, status: newStatus });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!appointment) return <div className="p-6">Rendez-vous non trouvé</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Rendez-vous du {new Date(appointment.date).toLocaleDateString()}
        </h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate(`/appointments/edit/${id}`)}
            className="btn-secondary"
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
                {new Date(appointment.date).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">{appointment.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <div className="flex items-center space-x-4 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold
                    ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`
                  }
                >
                  {appointment.status}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusUpdate('confirmed')}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Confirmer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('cancelled')}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Annuler
                  </button>
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
                {appointment.patient.firstName} {appointment.patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{appointment.patient.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p>{appointment.patient.phone}</p>
            </div>
            <Link
              to={`/patients/${appointment.patient._id}`}
              className="text-primary hover:text-secondary block mt-4"
            >
              Voir la fiche patient
            </Link>
          </div>
        </Card>

        {appointment.notes && (
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
