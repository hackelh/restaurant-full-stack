import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserGroupIcon, CalendarIcon, DocumentTextIcon, ArrowPathIcon, ClockIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Clock from '../../components/common/Clock';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingStatusId, setEditingStatusId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

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

  // Fonction pour mettre à jour le statut
  const handleStatusUpdate = async (appointmentId) => {
    if (!newStatus) return;
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      setEditingStatusId(null);
      setNewStatus('');
      fetchDashboardData();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Fonction utilitaire pour traduire les statuts
  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'done': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <motion.div className="p-6 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <motion.div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <motion.h1 className="text-4xl font-extrabold text-gray-800 tracking-tight text-center md:text-left">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-400 drop-shadow-lg">
            Tableau de bord
          </span>
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Clock />
        </motion.div>
      </motion.div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
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
                {stats.todayAppointments.map((appointment) => {
                  const now = new Date();
                  const rdvDate = new Date(appointment.date);
                  const diffMinutes = (rdvDate - now) / 60000;
                  let rowClass = '';
                  if (rdvDate < now) rowClass = 'bg-red-50 text-gray-400';
                  else if (diffMinutes <= 20) rowClass = 'bg-yellow-50';
                  return (
                    <tr key={appointment.id} className={`hover:bg-blue-50 ${rowClass}`}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-700">
                        {rdvDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-base text-gray-900 font-semibold">
                          {appointment.patient?.prenom || 'Inconnu'} {appointment.patient?.nom}
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
                          appointment.status === 'done' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>{getStatusLabel(appointment.status)}</span>
                        {/* Formulaire inline pour modifier le statut si l'heure est passée */}
                        {rdvDate < now && (
                          editingStatusId === appointment.id ? (
                            <span className="ml-2 flex items-center gap-2">
                              <select
                                className="border rounded px-2 py-1 text-xs"
                                value={newStatus}
                                onChange={e => setNewStatus(e.target.value)}
                              >
                                <option value="">Choisir...</option>
                                <option value="done">Terminé</option>
                                <option value="cancelled">Annulé</option>
                                <option value="confirmed">Confirmé</option>
                              </select>
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded text-xs font-semibold hover:bg-green-600"
                                onClick={() => handleStatusUpdate(appointment.id)}
                                type="button"
                              >Valider</button>
                              <button
                                className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-400"
                                onClick={() => { setEditingStatusId(null); setNewStatus(''); }}
                                type="button"
                              >Annuler</button>
                            </span>
                          ) : (
                            <button
                              className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 rounded text-xs font-semibold hover:bg-blue-300 transition"
                              onClick={() => { setEditingStatusId(appointment.id); setNewStatus(''); }}
                              type="button"
                            >
                              Modifier statut
                            </button>
                          )
                        )}
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
                  );
                })}
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
