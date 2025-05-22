import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Card from '../../components/Card/Card';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {UserGroupIcon,CalendarIcon,DocumentTextIcon,PlusIcon,ArrowPathIcon,ClockIcon,UserIcon,CheckCircleIcon,PencilIcon,EyeIcon} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointmentsCount: 0,
    totalPatients: 0,
    monthlyPrescriptions: 0,
    todayAppointments: [],
    upcomingAppointments: [],
    statsByStatus: {},
    statsByType: {}
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const response = await api.get('/dashboard');
      const dashboardData = response.data?.data;
      if (dashboardData) {
        setStats(dashboardData);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
      setLoading(false);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Mettre à jour les données toutes les 30 secondes
    const interval = setInterval(fetchDashboardData, 30000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      className="p-6 bg-gray-50"
      initial="initial"
      animate="animate"
      variants={containerVariants}>
      <motion.h1 
        className="text-4xl font-bold mb-8 text-gray-800 relative"
        variants={fadeInUp}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Tableau de bord
        </span>
      </motion.h1>
      
      {/* Actions rapides */}
      <div className="mb-8">
        <div className="flex gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/patients/nouveau"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>Nouveau patient</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/appointments/new"
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary-dark transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>Nouveau rendez-vous</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div variants={fadeInUp}>
          <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <CalendarIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stats.todayAppointmentsCount}</div>
              <h3 className="text-lg font-semibold text-gray-700">Rendez-vous aujourd'hui</h3>
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {stats.todayAppointments.length} rendez-vous prévus
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <div className="flex flex-col items-center p-6">
              <div className="bg-secondary/10 p-4 rounded-full mb-4">
                <UserGroupIcon className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-4xl font-bold text-secondary mb-2">{stats.totalPatients}</div>
              <h3 className="text-lg font-semibold text-gray-700">Patients total</h3>
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                {stats.totalPatients} patients actifs
              </div>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={fadeInUp}>
          <Card className="transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
            <div className="flex flex-col items-center p-6">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <DocumentTextIcon className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{stats.monthlyPrescriptions}</div>
              <h3 className="text-lg font-semibold text-gray-700">Prescriptions ce mois</h3>
              <div className="text-sm text-gray-500 mt-2 flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                {stats.monthlyPrescriptions} prescriptions émises
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Statistiques par statut</h3>
          <div className="space-y-3">
            {Object.entries(stats.statsByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600">{status}</span>
                <span className="text-primary font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4">Statistiques par type</h3>
          <div className="space-y-3">
            {Object.entries(stats.statsByType || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-600">{type}</span>
                <span className="text-primary font-medium">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rendez-vous d'aujourd'hui */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Rendez-vous d'aujourd'hui</h2>
          <div className="flex items-center gap-4">
            {refreshing && (
              <span className="text-sm text-gray-500">Actualisation...</span>
            )}
            <motion.button
              onClick={fetchDashboardData}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-lg hover:bg-primary/20 disabled:opacity-50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Actualiser</span>
            </motion.button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.todayAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(appointment.date), 'HH:mm', { locale: fr })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.patient?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/appointments/${appointment._id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          <span className="text-sm">Détails</span>
                        </Link>
                        <Link
                          to={`/appointments/${appointment._id}/edit`}
                          className="text-secondary hover:text-secondary-dark"
                        >
                          <span className="text-sm">Modifier</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Aucun rendez-vous aujourd'hui
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
