import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import SearchBar from '../../components/common/SearchBar';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/appointments');
        setAppointments(response.data.data || response.data || []);
      } catch (error) {
        setError('Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce rendez-vous ?')) {
      try {
        await api.delete(`/appointments/${id}`);
        setAppointments(appointments.filter(app => app.id !== id));
      } catch (error) {
        alert('Erreur lors de la suppression du rendez-vous');
      }
    }
  };

  const filteredAppointments = appointments.filter(app => {
    const nom = app.patient?.nom?.toLowerCase() || '';
    const prenom = app.patient?.prenom?.toLowerCase() || '';
    return (
      nom.includes(searchTerm.toLowerCase()) ||
      prenom.includes(searchTerm.toLowerCase())
    );
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement des rendez-vous...</div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Liste des Rendez-vous</h2>
        <button
          onClick={() => navigate('/appointments/new')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
        >
          <FaPlus /> Nouveau Rendez-vous
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom de patient..."
        />
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Aucun rendez-vous" className="w-24 h-24 mb-4 opacity-60" />
          <div className="text-gray-500 text-lg mb-4">Aucun rendez-vous trouvé</div>
          <button
            onClick={() => navigate('/appointments/new')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
          >
            <FaPlus /> Créer un rendez-vous
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-t hover:bg-blue-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {appointment.patient?.nom} {appointment.patient?.prenom}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>{appointment.patient?.telephone || '-'}</div>
                    <div className="text-gray-500 text-sm">{appointment.patient?.email || '-'}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {new Date(appointment.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-sm transition-colors"
                      title="Modifier"
                    >
                      <FaEdit /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-sm transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;