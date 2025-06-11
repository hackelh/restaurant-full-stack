import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserGroupIcon, CalendarIcon, DocumentTextIcon, ArrowPathIcon, ClockIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await api.get('/stats/dashboard');
      setStats(response.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <motion.div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <motion.h1 className="text-4xl font-extrabold mb-10 text-gray-800 tracking-tight text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-400 drop-shadow-lg">
          Tableau de bord
        </span>
      </motion.h1>
      {/* Actions rapides */}
      <div className="mb-10 flex flex-col md:flex-row justify-center gap-6">
        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
          <Link to="/patients/nouveau" className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-3 text-lg font-semibold">
            <UserGroupIcon className="w-7 h-7" />
            <span>Nouveau patient</span>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
          <Link to="/appointments/new" className="bg-green-500 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-green-600 transition-all flex items-center space-x-3 text-lg font-semibold">
            <CalendarIcon className="w-7 h-7" />
            <span>Nouveau rendez-vous</span>
          </Link>
        </motion.div>
      </div>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <motion.div>
          <Card className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center border-t-4 border-blue-500">
            <div className="bg-blue-100 p-5 rounded-full mb-5">
              <CalendarIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div className="text-5xl font-extrabold text-blue-600 mb-2 drop-shadow">{stats.todayAppointmentsCount}</div>
            <h3 className="text-xl font-semibold text-gray-700">Rendez-vous aujourd'hui</h3>
            <div className="text-base text-gray-500 mt-2 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2" />
              {stats.todayAppointments?.length || 0} prévus
            </div>
          </Card>
        </motion.div>
        <motion.div>
          <Card className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center border-t-4 border-green-500">
            <div className="bg-green-100 p-5 rounded-full mb-5">
              <UserGroupIcon className="w-10 h-10 text-green-600" />
            </div>
            <div className="text-5xl font-extrabold text-green-600 mb-2 drop-shadow">{stats.totalPatients}</div>
            <h3 className="text-xl font-semibold text-gray-700">Patients total</h3>
            <div className="text-base text-gray-500 mt-2 flex items-center">
              <UserIcon className="w-5 h-5 mr-2" />
              {stats.totalPatients} actifs
            </div>
          </Card>
        </motion.div>
        <motion.div>
          <Card className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-center border-t-4 border-purple-500">
            <div className="bg-purple-100 p-5 rounded-full mb-5">
              <DocumentTextIcon className="w-10 h-10 text-purple-600" />
            </div>
            <div className="text-5xl font-extrabold text-purple-600 mb-2 drop-shadow">{stats.monthlyPrescriptions}</div>
            <h3 className="text-xl font-semibold text-gray-700">Prescriptions ce mois</h3>
            <div className="text-base text-gray-500 mt-2 flex items-center">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              {stats.monthlyPrescriptions} émises
            </div>
          </Card>
        </motion.div>
      </div>
      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <Card className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-blue-700">Statistiques par statut</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.statsByStatus || {}).map(([status, count]) => (
              <span key={status} className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm shadow">
                {status} : <span className="ml-2 text-blue-900 font-bold">{count}</span>
              </span>
            ))}
          </div>
        </Card>
        <Card className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-green-700">Statistiques par type</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.statsByType || {}).map(([type, count]) => (
              <span key={type} className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm shadow">
                {type} : <span className="ml-2 text-green-900 font-bold">{count}</span>
              </span>
            ))}
          </div>
        </Card>
      </div>
      {/* Rendez-vous d'aujourd'hui */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Rendez-vous d'aujourd'hui</h2>
          <div className="flex items-center gap-4">
            {refreshing && (
              <span className="text-sm text-gray-500">Actualisation...</span>
            )}
            <motion.button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-200 disabled:opacity-50 transition-all font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Actualiser</span>
            </motion.button>
            <Link to="/appointments" className="text-blue-600 hover:text-blue-800 font-semibold">
              Voir tout
            </Link>
          </div>
        </div>
        {stats.todayAppointments && stats.todayAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {stats.todayAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-700">
                      {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-base text-gray-900 font-semibold">
                        {appointment.patient?.prenom} {appointment.patient?.nom}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-700">
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/appointments/${appointment.id}`}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          Détails
                        </Link>
                        <Link
                          to={`/appointments/${appointment.id}/edit`}
                          className="text-green-600 hover:text-green-800 font-semibold"
                        >
                          Modifier
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-lg font-semibold">
            Aucun rendez-vous aujourd'hui
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
