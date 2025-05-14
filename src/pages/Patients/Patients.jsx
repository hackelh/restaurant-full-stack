import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaUserPlus, FaEdit, FaArchive, FaEye, FaUserMinus } from 'react-icons/fa';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients');
      // La réponse contient les données dans response.data.data
      setPatients(Array.isArray(response.data.data) ? response.data.data : []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
      toast.error('Erreur lors du chargement des patients');
      setLoading(false);
      // En cas d'erreur, initialiser avec un tableau vide
      setPatients([]);
    }
  };

  const navigate = useNavigate();

  const handleArchive = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      toast.success('Patient archivé avec succès');
      fetchPatients();
    } catch (error) {
      console.error('Erreur lors de l\'archivage du patient:', error);
      toast.error('Erreur lors de l\'archivage du patient');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Liste des patients</h1>
        <Link
          to="/patients/nouveau"
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded flex items-center gap-2"
        >
          <FaUserPlus /> Nouveau patient
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
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
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.nom} {patient.prenom}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.telephone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/patients/${patient.id}`}
                    className="text-primary hover:text-primary-dark mr-4"
                  >
                    Voir
                  </Link>
                  <Link
                    to={`/patients/${patient.id}/modifier`}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
