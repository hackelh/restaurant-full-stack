import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card/Card';
import api from '../../services/api'; // Importer le fichier API
import { FaEdit, FaTrash, FaEye, FaUserPlus } from 'react-icons/fa';

const PatientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients'); // Utilisation de l'API pour récupérer les patients
      setPatients(response.data.data); // Le backend renvoie { success, data, pagination }
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des patients');
      setLoading(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        await api.delete(`/patients/${patientId}`);
        fetchPatients(); // Recharger la liste après suppression
      } catch (err) {
        setError('Erreur lors de la suppression du patient');
      }
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Link to="/patients/new" className="btn-primary inline-flex items-center space-x-2">
          <FaUserPlus className="w-5 h-5" />
          <span>Nouveau Patient</span>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un patient..."
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {`${patient.firstName} ${patient.lastName}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/patients/${patient._id}`}
                        className="action-button-view"
                        title="Voir les détails du patient"
                      >
                        <FaEye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/patients/edit/${patient._id}`}
                        className="action-button-edit"
                        title="Modifier les informations du patient"
                      >
                        <FaEdit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="action-button-delete"
                        title="Supprimer le patient"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
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

export default PatientList;
