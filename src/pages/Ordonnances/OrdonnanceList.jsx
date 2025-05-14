import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/Card/Card';
import api from '../../services/api';
import { FaEye } from 'react-icons/fa';

const OrdonnanceList = () => {
  const navigate = useNavigate();
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        setLoading(true);
        const response = await api.get('/ordonnances');
        console.log('Réponse ordonnances:', response.data);

        if (!response.data || !response.data.data) {
          throw new Error('Format de réponse invalide');
        }

        const ordonnancesData = response.data.data;
        
        // Vérifier et parser le contenu JSON si nécessaire
        const processedOrdonnances = ordonnancesData.map(ord => ({
          ...ord,
          contenu: typeof ord.contenu === 'string' ? JSON.parse(ord.contenu) : ord.contenu
        }));

        console.log('Ordonnances traitées:', processedOrdonnances);
        setOrdonnances(processedOrdonnances);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des ordonnances:', err);
        setError('Erreur lors du chargement des ordonnances');
        toast.error('Erreur lors du chargement des ordonnances');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdonnances();
  }, []);



  const filteredOrdonnances = Array.isArray(ordonnances) ? ordonnances.filter(ordonnance => {
    const contenuObj = typeof ordonnance.contenu === 'string' ? JSON.parse(ordonnance.contenu) : ordonnance.contenu;
    const patientNom = ordonnance.Patient?.nom || '';
    const patientPrenom = ordonnance.Patient?.prenom || '';
    const matchesSearch = patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patientPrenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || ordonnance.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ordonnances</h1>
        <Link to="/ordonnances/nouvelle" className="btn-primary">
          Nouvelle Ordonnance
        </Link>
      </div>

      <Card>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Rechercher par nom de patient..."
            className="input-field flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="input-field w-48"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Active</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
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
              {filteredOrdonnances.map((ordonnance) => (
                <tr key={ordonnance.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ordonnance.createdAt || ordonnance.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ordonnance.Patient?.nom} {ordonnance.Patient?.prenom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(() => {
                      try {
                        const contenuObj = typeof ordonnance.contenu === 'string' 
                          ? JSON.parse(ordonnance.contenu) 
                          : ordonnance.contenu;
                        return `${contenuObj.type} - ${contenuObj.medications?.[0]?.nom || ''}`;
                      } catch (e) {
                        return 'Contenu non disponible';
                      }
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${ordonnance.status === 'active' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {ordonnance.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link
                      to={`/ordonnances/${ordonnance.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                      title="Voir les détails"
                    >
                      <FaEye /> Voir
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

export default OrdonnanceList;
