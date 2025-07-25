// Importation des dépendances React, hooks, services et icônes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FaUserPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import SearchBar from '../../components/common/SearchBar';

// Nombre de patients par page pour la pagination
const PATIENTS_PER_PAGE = 7;

// Composant principal pour la gestion et l'affichage de la liste des patients
const Patients = () => {
  const navigate = useNavigate(); // Hook pour la navigation
  // États pour la gestion des patients, chargement, erreurs, recherche, tri, pagination
  const [patients, setPatients] = useState([]); // Liste complète des patients
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Message d'erreur éventuel
  const [searchTerm, setSearchTerm] = useState(''); // Terme de recherche
  const [sortConfig, setSortConfig] = useState({ key: 'nom', direction: 'asc' }); // Configuration du tri
  const [currentPage, setCurrentPage] = useState(1); // Page courante pour la pagination

  // Chargement initial des patients depuis l'API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await api.get('/patients');
        if (!response.data || !response.data.data) {
          throw new Error('Format de réponse invalide');
        }
        setPatients(response.data.data); // Stocke la liste complète
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des patients');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Filtrage des patients selon le terme de recherche (nom, prénom, email)
  const filteredPatients = Array.isArray(patients)
    ? patients.filter(patient => {
        const nom = patient.nom || '';
        const prenom = patient.prenom || '';
        const email = patient.email || '';
        return (
          nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  // Fonction pour changer la colonne de tri ou l'ordre
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Tri des patients selon la colonne choisie
  const sortedPatients = React.useMemo(() => {
    let sortable = [...filteredPatients];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key] || '';
        let bValue = b[sortConfig.key] || '';
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [filteredPatients, sortConfig]);

  // Pagination : calcul du nombre total de pages et découpage de la liste
  const totalPages = Math.ceil(sortedPatients.length / PATIENTS_PER_PAGE);
  const paginatedPatients = sortedPatients.slice(
    (currentPage - 1) * PATIENTS_PER_PAGE,
    currentPage * PATIENTS_PER_PAGE
  );

  // Remettre la page à 1 si la recherche ou le tri change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  // Suppression d'un patient (avec confirmation et gestion d'erreur)
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce patient ?')) return;
    try {
      await api.delete(`/patients/${id}`);
      setPatients((prev) => prev.filter((p) => p.id !== id)); // Met à jour la liste locale
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression du patient';
      alert(errorMessage);
    }
  };

  // Affichage d'un loader pendant le chargement
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-blue-500 font-semibold">Chargement des patients...</div>
      </div>
    );
  // Affichage d'une erreur si besoin
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  // Rendu principal du composant
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* En-tête et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        <button
          onClick={() => navigate('/patients/nouveau')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
        >
          <FaUserPlus /> Nouveau patient
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-4 mb-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher par nom, prénom ou email..."
        />
      </div>

      {/* Affichage si aucun patient trouvé */}
      {filteredPatients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Aucun patient" className="w-24 h-24 mb-4 opacity-60" />
          <div className="text-gray-500 text-lg mb-4">Aucun patient trouvé</div>
          <button
            onClick={() => navigate('/patients/nouveau')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow transition-colors"
          >
            <FaUserPlus /> Créer un patient
          </button>
        </div>
      ) : (
        // Tableau des patients paginés
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* Colonnes triables : nom, prénom, email, téléphone */}
                      <th
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                        onClick={() => requestSort('nom')}
                      >
                        <div className="flex items-center">
                          Nom
                          {sortConfig.key === 'nom' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('prenom')}
                      >
                        <div className="flex items-center">
                          Prénom
                          {sortConfig.key === 'prenom' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('email')}
                      >
                        <div className="flex items-center">
                          Email
                          {sortConfig.key === 'email' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                        onClick={() => requestSort('telephone')}
                      >
                        <div className="flex items-center">
                          Téléphone
                          {sortConfig.key === 'telephone' && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {paginatedPatients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-blue-50">
                        {/* Cellules d'information patient */}
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 font-medium text-gray-900">{patient.nom}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{patient.prenom}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{patient.email || '-'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{patient.telephone || '-'}</td>
                        {/* Actions : voir, éditer, supprimer */}
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-2 text-sm font-medium">
                          <div className="flex items-center gap-2 justify-start">
                            <button
                              onClick={() => navigate(`/patients/${patient.id}`)}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              title="Voir les détails"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => navigate(`/patients/${patient.id}/modifier`)}
                              className="text-yellow-500 hover:text-yellow-700 flex items-center gap-1"
                              title="Éditer"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(patient.id)}
                              className="text-red-600 hover:text-red-800 flex items-center gap-1"
                              title="Supprimer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Pagination (boutons précédent/suivant et info page) */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="mx-2 text-gray-700">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
