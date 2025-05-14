import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/appointments');
        const appointmentsData = response.data?.data || [];
        
        if (!Array.isArray(appointmentsData)) {
          console.error('Les données reçues ne sont pas un tableau:', appointmentsData);
          setAppointments([]);
        } else {
          setAppointments(appointmentsData);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des rendez-vous:', err);
        setError('Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filtered = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'today':
          return appointmentDate.getTime() === today.getTime();
        case 'upcoming':
          return appointmentDate >= today;
        default:
          return true;
      }
    });

    setFilteredAppointments(filtered);
  }, [filter, appointments]);

  const getFilterButtonClass = (buttonFilter) => {
    const baseClass = 'px-4 py-2 rounded-md ';
    return baseClass + (filter === buttonFilter ? 'bg-primary text-white' : 'bg-gray-100');
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Rendez-vous</h1>
        <Link to="/appointments/new" className="btn-primary">
          Nouveau Rendez-vous
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            className={getFilterButtonClass('all')}
            onClick={() => setFilter('all')}
          >
            Tous
          </button>
          <button
            className={getFilterButtonClass('today')}
            onClick={() => setFilter('today')}
          >
            Aujourd'hui
          </button>
          <button
            className={getFilterButtonClass('upcoming')}
            onClick={() => setFilter('upcoming')}
          >
            À venir
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(appointment.date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {appointment.Patient?.nom} {appointment.Patient?.prenom}
                      </div>
                      <div className="text-gray-500">
                        {appointment.Patient?.telephone}
                      </div>
                      <div className="text-gray-500">
                        {appointment.Patient?.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/appointments/${appointment.id}`}
                      className="text-primary hover:text-secondary mr-4"
                    >
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentList;
