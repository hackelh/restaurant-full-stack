import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const HistoriqueComponent = ({ onBack }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/appointments/history?page=${page}&limit=10`);
      setHistory(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(page);
    // eslint-disable-next-line
  }, [page]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/appointments');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Historique des rendez-vous</h2>
        <button onClick={handleBack} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Retour</button>
      </div>
      {loading ? (
        <div className="text-center text-blue-500">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center text-gray-500">Aucun rendez-vous passé.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(appt.date).toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.patient?.prenom} {appt.patient?.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{appt.status || appt.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Précédent</button>
          <span className="px-3 py-1">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Suivant</button>
        </div>
      )}
    </div>
  );
};

export default HistoriqueComponent; 