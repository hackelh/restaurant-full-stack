import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const CalendarView = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('day'); // 'day' ou 'week'

  // Heures de travail
  const workHours = Array.from({ length: 9 }, (_, i) => i + 9); // 9h à 17h

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const startDate = new Date(currentDate);
        const endDate = new Date(currentDate);
        
        if (viewType === 'week') {
          startDate.setDate(currentDate.getDate() - currentDate.getDay());
          endDate.setDate(startDate.getDate() + 6);
        }

        const response = await api.get('/appointments', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        });

        // Vérifier la structure de la réponse
        console.log('Réponse API appointments:', response.data);

        // S'assurer que nous avons un tableau
        const appointmentsData = response.data?.data || [];
        
        if (!Array.isArray(appointmentsData)) {
          console.error('Les données reçues ne sont pas un tableau:', appointmentsData);
          setAppointments([]);
        } else {
          // Formater les rendez-vous pour correspondre à la structure attendue
          const formattedAppointments = appointmentsData.map(apt => ({
            id: apt._id || apt.id,
            date: new Date(apt.date),
            type: apt.type,
            status: apt.status,
            patient: {
              firstName: apt.patientName?.split(' ')[0] || '',
              lastName: apt.patientName?.split(' ')[1] || ''
            },
            notes: apt.notes,
            duration: apt.duree
          }));

          setAppointments(formattedAppointments);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des rendez-vous:', err);
        setError('Erreur lors du chargement des rendez-vous');
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [currentDate, viewType]);

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (viewType === 'day') {
      newDate.setDate(currentDate.getDate() + direction);
    } else {
      newDate.setDate(currentDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
  };

  const getDayAppointments = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getAppointmentForTimeSlot = (date, hour) => {
    return appointments.find(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString() &&
             aptDate.getHours() === hour;
    });
  };

  const renderDayView = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Heure
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Rendez-vous
              </th>
            </tr>
          </thead>
          <tbody>
            {workHours.map(hour => {
              const appointment = getAppointmentForTimeSlot(currentDate, hour);
              const isPastTime = isTimeInPast(currentDate, hour);
              
              return (
                <tr key={hour} className="border-b">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {hour}:00
                  </td>
                  <td className="px-6 py-4">
                    {appointment ? (
                      <div className="bg-primary bg-opacity-10 p-2 rounded">
                        <p className="font-medium">
                          {appointment.patient.firstName} {appointment.patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    ) : isPastTime ? (
                      <span className="text-gray-400 text-sm">Heure passée</span>
                    ) : (
                      <Link
                        to={`/appointments/new?date=${currentDate.toISOString()}&hour=${hour}`}
                        className="text-primary hover:text-secondary text-sm"
                      >
                        + Nouveau rendez-vous
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(currentDate);
      day.setDate(currentDate.getDate() - currentDate.getDay() + i);
      return day;
    });

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                Heure
              </th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                  {day.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workHours.map(hour => (
              <tr key={hour} className="border-b">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {hour}:00
                </td>
                {weekDays.map(day => {
                  const appointment = getAppointmentForTimeSlot(day, hour);
                  const isPastTime = isTimeInPast(day, hour);
                  const isWeekend = day.getDay() === 0; // Dimanche
                  
                  return (
                    <td key={day.toISOString()} className="px-6 py-4">
                      {appointment ? (
                        <div className="bg-primary bg-opacity-10 p-2 rounded">
                          <p className="font-medium text-sm">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </p>
                          <p className="text-xs text-gray-600">{appointment.type}</p>
                        </div>
                      ) : isPastTime ? (
                        <span className="text-gray-400 text-xs">Passé</span>
                      ) : isWeekend ? (
                        <span className="text-gray-400 text-xs">Fermé</span>
                      ) : (
                        <Link
                          to={`/appointments/new?date=${day.toISOString()}&hour=${hour}`}
                          className="text-primary hover:text-secondary text-sm"
                        >
                          +
                        </Link>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Fonction pour vérifier si une heure est dans le passé
  const isTimeInPast = (date, hour) => {
    const now = new Date();
    const checkDate = new Date(date);
    checkDate.setHours(hour, 0, 0, 0);
    
    return checkDate <= now;
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Planning</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewType('day')}
            className={`px-4 py-2 rounded-md ${
              viewType === 'day' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Jour
          </button>
          <button
            onClick={() => setViewType('week')}
            className={`px-4 py-2 rounded-md ${
              viewType === 'week' ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            Semaine
          </button>
        </div>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateDate(-1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {viewType === 'day' 
              ? currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
              : `Semaine du ${new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())).toLocaleDateString()}`
            }
          </h2>
          <button
            onClick={() => navigateDate(1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            →
          </button>
        </div>

        {viewType === 'day' ? renderDayView() : renderWeekView()}
      </Card>
    </div>
  );
};

export default CalendarView;
