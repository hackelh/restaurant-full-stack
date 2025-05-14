import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../components/Card/Card';
import api from '../../services/api';
import { FaEdit, FaTrash, FaFilePdf, FaCheck, FaTimes } from 'react-icons/fa';

const OrdonnanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordonnance, setOrdonnance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrdonnanceDetails = async () => {
      try {
        const response = await api.get(`/ordonnances/${id}`);
        setOrdonnance(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des détails de l\'ordonnance');
        setLoading(false);
      }
    };
    fetchOrdonnanceDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) {
      try {
        await api.delete(`/ordonnances/${id}`);
        toast.success('Ordonnance supprimée avec succès');
        navigate('/ordonnances');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'ordonnance');
      }
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await api.get(`/ordonnances/${id}/pdf`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ordonnance_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('PDF généré avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors de la génération du PDF');
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await api.patch(`/ordonnances/${id}`, { status });
      toast.success('Statut mis à jour avec succès');
      navigate('/ordonnances');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!ordonnance) return <div className="p-6">Ordonnance non trouvée</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Ordonnance du {new Date(ordonnance.date).toLocaleDateString()}
        </h1>
        <div className="flex justify-between items-center mt-6">
          <div className="space-x-2">
            <button
              onClick={() => navigate(`/ordonnances/${id}/modifier`)}
              className="btn-primary"
            >
              <FaEdit className="inline mr-2" /> Modifier
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              <FaTrash className="inline mr-2" /> Supprimer
            </button>
            <button
              onClick={handleGeneratePDF}
              className="btn-secondary"
            >
              <FaFilePdf className="inline mr-2" /> Générer PDF
            </button>
            {ordonnance.status === 'active' && (
              <>
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="btn-success"
                >
                  <FaCheck className="inline mr-2" /> Terminer
                </button>
                <button
                  onClick={() => handleStatusChange('cancelled')}
                  className="btn-warning"
                >
                  <FaTimes className="inline mr-2" /> Annuler
                </button>
              </>
            )}
          </div>
          <button
            onClick={() => navigate('/ordonnances')}
            className="btn-secondary"
          >
            Retour à la liste
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Informations générales">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date de création</p>
              <p className="font-medium">
                {new Date(ordonnance.date).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`px-2 py-1 rounded-full text-sm font-semibold
                ${ordonnance.status === 'active' ? 'bg-green-100 text-green-800' : 
                  ordonnance.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'}`}>
                {ordonnance.status === 'active' ? 'Active' :
                 ordonnance.status === 'completed' ? 'Terminée' : 'Annulée'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Patient">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="font-medium">
                {ordonnance.Patient?.nom} {ordonnance.Patient?.prenom}
              </p>
            </div>
            {ordonnance.Patient?.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{ordonnance.Patient.email}</p>
              </div>
            )}
            {ordonnance.Patient?.telephone && (
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p>{ordonnance.Patient.telephone}</p>
              </div>
            )}
          </div>
        </Card>

        <Card title="Contenu de l'ordonnance" className="col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">
              {typeof ordonnance.contenu === 'string'
                ? ordonnance.contenu
                : JSON.stringify(ordonnance.contenu, null, 2)}
            </pre>
          </div>
        </Card>

        {ordonnance.notes && (
          <Card title="Notes additionnelles" className="col-span-2">
            <p className="text-gray-600 whitespace-pre-wrap">
              {ordonnance.notes}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrdonnanceDetails;
