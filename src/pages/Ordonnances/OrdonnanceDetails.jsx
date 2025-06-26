import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaEdit, 
  FaTrash, 
  FaFilePdf, 
  FaCheck, 
  FaTimes,
  FaSpinner,
  FaArrowLeft,
  FaUser,
  FaPills
} from 'react-icons/fa';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const OrdonnanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ordonnance, setOrdonnance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchOrdonnance = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/ordonnances/${id}`);
        const data = response.data.data || response.data;
        let contenu = data.contenu;
        if (typeof contenu === 'string') {
          try {
            contenu = JSON.parse(contenu);
          } catch (e) {
            contenu = { type: 'texte', contenuBrut: contenu };
          }
        } else if (!contenu) {
          contenu = { type: 'vide', contenuBrut: '' };
        }
        setOrdonnance({ ...data, contenu });
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement de l\'ordonnance');
      } finally {
        setLoading(false);
      }
    };
    fetchOrdonnance();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette ordonnance ?')) {
      return;
    }

    setDeleting(true);
    try {
      console.log('Tentative de suppression de l\'ordonnance:', id);
      const response = await api.delete(`/ordonnances/${id}`);
      console.log('Réponse suppression:', response);
      if (response.data.success) {
        toast.success('Ordonnance supprimée avec succès');
        navigate('/ordonnances');
      } else {
        throw new Error(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGeneratingPdf(true);
    try {
      console.log('Tentative de génération PDF pour l\'ordonnance:', id);
      const response = await api.get(`/ordonnances/${id}/pdf`, { 
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      console.log('Réponse PDF:', response);
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ordonnance-${id}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      console.error('Détails de l\'erreur PDF:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Erreur lors de la génération du PDF';
      toast.error(errorMessage);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleStatusChange = async (status) => {
    try {
      await api.patch(`/ordonnances/${id}/status`, { status });
      toast.success('Statut mis à jour avec succès');
      const response = await api.get(`/ordonnances/${id}`);
      const data = response.data.data || response.data;
      let contenu = data.contenu;
      if (typeof contenu === 'string') {
        try {
          contenu = JSON.parse(contenu);
        } catch (e) {
          contenu = { type: 'texte', contenuBrut: contenu };
        }
      } else if (!contenu) {
        contenu = { type: 'vide', contenuBrut: '' };
      }
      setOrdonnance({ ...data, contenu });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement de l'ordonnance...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-red-500 text-xl mb-4">{error}</div>
      <button
        onClick={() => navigate('/ordonnances')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  if (!ordonnance) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-gray-500 text-xl mb-4">Ordonnance non trouvée</div>
      <button
        onClick={() => navigate('/ordonnances')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fonction pour traduire les statuts
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Normaliser l'accès aux données du patient (avec ou sans majuscule)
  const patient = ordonnance.Patient || ordonnance.patient || {};
  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/ordonnances')}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <FaArrowLeft /> Retour
        </button>
        <h1 className="text-2xl font-bold">Détails de l'ordonnance</h1>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Patient</p>
          <p className="font-medium">{patient.nom} {patient.prenom}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{formatDate(ordonnance.date)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Statut</p>
          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ordonnance.status)}`}>
            {getStatusLabel(ordonnance.status)}
          </span>
        </div>
        <div>
          <p className="text-sm text-gray-500">Type</p>
          <p className="font-medium">
            {ordonnance.contenu.type === 'texte'
              ? 'Ordonnance texte libre'
              : ordonnance.contenu.type === 'vide'
                ? 'Contenu non disponible'
                : `${ordonnance.contenu.type || ''} ${ordonnance.contenu.medications?.[0]?.nom || ''}`
            }
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Contenu</p>
          <pre className="bg-gray-50 rounded p-2 text-gray-700 whitespace-pre-wrap">
            {ordonnance.contenu.contenuBrut || JSON.stringify(ordonnance.contenu, null, 2)}
          </pre>
        </div>
        {ordonnance.notes && (
          <div>
            <p className="text-sm text-gray-500">Notes additionnelles</p>
            <p className="text-gray-700 whitespace-pre-wrap">{ordonnance.notes}</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/ordonnances/${id}/modifier`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={deleting || generatingPdf}
          >
            <FaEdit className="mr-2" /> Modifier
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={deleting || generatingPdf}
          >
            {deleting ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Suppression...
              </>
            ) : (
              <>
                <FaTrash className="mr-2" /> Supprimer
              </>
            )}
          </button>

          <button
            onClick={handleGeneratePDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={deleting || generatingPdf}
          >
            {generatingPdf ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Génération...
              </>
            ) : (
              <>
                <FaFilePdf className="mr-2" /> Télécharger PDF
              </>
            )}
          </button>
          
          {/* Boutons de statut selon l'état actuel */}
          {ordonnance.status === 'active' && (
            <>
              <button
                onClick={() => handleStatusChange('completed')}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={deleting || generatingPdf}
              >
                <FaCheck className="mr-2" /> Terminer
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className="flex items-center px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
                disabled={deleting || generatingPdf}
              >
                <FaTimes className="mr-2" /> Annuler
              </button>
            </>
          )}
          
          {ordonnance.status === 'completed' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={deleting || generatingPdf}
            >
              <FaCheck className="mr-2" /> Réactiver
            </button>
          )}
          
          {ordonnance.status === 'cancelled' && (
            <button
              onClick={() => handleStatusChange('active')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={deleting || generatingPdf}
            >
              <FaCheck className="mr-2" /> Réactiver
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdonnanceDetails;