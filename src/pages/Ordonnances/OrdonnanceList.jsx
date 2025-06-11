import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { FaEye, FaPlus } from 'react-icons/fa';
import SearchBar from '../../components/common/SearchBar';

const OrdonnanceList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ordonnances, setOrdonnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });

  useEffect(() => {
    const fetchOrdonnances = async () => {
      try {
        setLoading(true);
        const response = await api.get('/ordonnances');
        console.log('Réponse API ordonnances:', response.data);
        if (!response.data || !response.data.data) {
          throw new Error('Format de réponse invalide');
        }
        const ordonnancesData = response.data.data;
        // Traiter les ordonnances
        const patientId = 1; // À remplacer par la vraie source (props, contexte, etc.)
        const processedOrdonnances = ordonnancesData.map(ord => {
          let processedContenu = ord.contenu;
          if (typeof ord.contenu === 'string') {
            try {
              processedContenu = JSON.parse(ord.contenu);
            } catch (parseError) {
              processedContenu = { type: 'texte', contenuBrut: ord.contenu };
            }
          } else if (!ord.contenu) {
            processedContenu = { type: 'vide', contenuBrut: '' };
          }
          return { ...ord, contenu: processedContenu, patientId: ord.patientId || patientId };
        });
        setOrdonnances(processedOrdonnances);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des ordonnances');
        toast.error('Erreur lors du chargement des ordonnances');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdonnances();
  }, [location]);

  const filteredOrdonnances = Array.isArray(ordonnances) ? ordonnances.filter(ordonnance => {
    const patientNom = ordonnance.patient?.nom || '';
    const patientPrenom = ordonnance.patient?.prenom || '';
    const matchesSearch = patientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patientPrenom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || ordonnance.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  // Fonction de tri
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fonction pour trier les ordonnances
  const sortedOrdonnances = React.useMemo(() => {
    let sortable = [...filteredOrdonnances];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        switch (sortConfig.key) {
          case 'date':
            aValue = new Date(a.createdAt || a.date);
            bValue = new Date(b.createdAt || b.date);
            break;
          case 'patient':
            aValue = `${a.patient?.nom || ''} ${a.patient?.prenom || ''}`.toLowerCase();
            bValue = `${b.patient?.nom || ''} ${b.patient?.prenom || ''}`.toLowerCase();
            break;
          case 'type':
            aValue = a.contenu?.type || '';
            bValue = b.contenu?.type || '';
            break;
          case 'status':
            aValue = a.status || '';
            bValue = b.status || '';
            break;
          default:
            aValue = '';
            bValue = '';
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredOrdonnances, sortConfig]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement des ordonnances...</div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  console.log('Ordonnances affichées:', ordonnances);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Ordonnances</h1>
        <button
          onClick={() => navigate('/ordonnances/nouvelle')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
        >
          <FaPlus /> Nouvelle Ordonnance
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom de patient..."
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

      {filteredOrdonnances.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Aucune ordonnance" className="w-24 h-24 mb-4 opacity-60" />
          <div className="text-gray-500 text-lg mb-4">Aucune ordonnance trouvée</div>
          <button
            onClick={() => navigate('/ordonnances/nouvelle')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
          >
            <FaPlus /> Créer une ordonnance
          </button>
        </div>
      ) : (
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                        onClick={() => requestSort('date')}
                      >
                        <div className="flex items-center">
                          Date
                          {sortConfig.key === 'date' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('patient')}
                      >
                        <div className="flex items-center">
                          Patient
                          {sortConfig.key === 'patient' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('type')}
                      >
                        <div className="flex items-center">
                          Type
                          {sortConfig.key === 'type' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('status')}
                      >
                        <div className="flex items-center">
                          Statut
                          {sortConfig.key === 'status' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {sortedOrdonnances.map((ordonnance) => (
                      <tr key={ordonnance.id} className="hover:bg-blue-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          {new Date(ordonnance.createdAt || ordonnance.date).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {ordonnance.patient?.nom} {ordonnance.patient?.prenom}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {ordonnance.contenu.type === 'texte' 
                            ? 'Ordonnance texte libre'
                            : ordonnance.contenu.type === 'vide'
                              ? 'Contenu non disponible'
                              : `${ordonnance.contenu.type || ''} ${ordonnance.contenu.medications?.[0]?.nom || ''}`
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            ordonnance.status === 'active' ? 'bg-green-100 text-green-800' :
                            ordonnance.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            ordonnance.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {ordonnance.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link
                            to={`/patients/${ordonnance.patientId}/ordonnances/${ordonnance.id}`}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdonnanceList;
