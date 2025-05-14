import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Card from '../../components/Card/Card';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    todayAppointmentsCount: 0,
    totalPatients: 0,
    monthlyPrescriptions: 0,
    todayAppointments: []
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Charger les données initiales
    fetchDashboardData();

    // Mettre à jour les données toutes les 30 secondes
    const interval = setInterval(fetchDashboardData, 30000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchDashboardData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await api.get('/stats/dashboard');
      const statsData = response.data?.data || {};
      
      setStats({
        todayAppointmentsCount: statsData.todayAppointmentsCount || 0,
        totalPatients: statsData.totalPatients || 0,
        monthlyPrescriptions: statsData.monthlyPrescriptions || 0,
        todayAppointments: statsData.todayAppointments || []
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setStats({
        todayAppointments: 0,
        totalPatients: 0,
        monthlyPrescriptions: 0
      });
      setTodayAppointments([]);
      toast.error('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <h3 className="text-lg text-gray-600">Rendez-vous aujourd'hui</h3>
          <div className="text-3xl font-bold text-primary">{stats.todayAppointmentsCount}</div>
        </Card>
        <Card>
          <h3 className="text-lg text-gray-600">Patients total</h3>
          <div className="text-3xl font-bold text-primary">{stats.totalPatients}</div>
        </Card>
        <Card>
          <h3 className="text-lg text-gray-600">Prescriptions ce mois</h3>
          <div className="text-3xl font-bold text-primary">{stats.monthlyPrescriptions}</div>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rendez-vous d'aujourd'hui</h2>
          <div className="flex items-center gap-4">
            {refreshing && (
              <span className="text-sm text-gray-500">Actualisation...</span>
            )}
            <button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="text-primary hover:text-primary-dark disabled:opacity-50"
            >
              Actualiser
            </button>
            <Link to="/appointments" className="text-primary hover:text-primary-dark">
              Voir tout
            </Link>
          </div>
        </div>

        {stats.todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.todayAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(appointment.date), 'HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patient?.nom} {appointment.patient?.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-col">
                        <span>{appointment.patient?.telephone}</span>
                        <span className="text-xs text-gray-500">{appointment.patient?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        to={`/appointments/${appointment.id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">
            Aucun rendez-vous aujourd'hui
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
