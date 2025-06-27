// Importation des dépendances React, hooks, services et icônes
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

// Composant principal pour l'affichage détaillé d'un patient
const PatientDetails = () => {
  const { id } = useParams(); // Récupère l'id du patient depuis l'URL
  const navigate = useNavigate(); // Hook pour la navigation
  // États pour la gestion du patient, des suivis médicaux, du chargement et des erreurs
  const [patient, setPatient] = useState(null); // Données du patient
  const [suivisMedicaux, setSuivisMedicaux] = useState([]); // Liste des suivis médicaux
  const [loading, setLoading] = useState(true); // Indicateur de chargement
  const [error, setError] = useState(null); // Message d'erreur éventuel

  // Chargement des données du patient et de ses suivis médicaux
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/patients/${id}`);
        const patientData = response.data.data || response.data;
        // Sécurise le format des antécédents médicaux
        if (!Array.isArray(patientData.antecedentsMedicaux)) {
          patientData.antecedentsMedicaux = [];
        }
        // Parse l'adresse si besoin
        let adresse = patientData.adresse;
        if (typeof adresse === 'string') {
          try {
            adresse = JSON.parse(adresse);
          } catch (e) {
            adresse = {};
          }
        }
        patientData._parsedAdresse = adresse;
        setPatient(patientData);
        
        // Récupère les suivis médicaux du patient
        try {
          const suivisResponse = await api.get(`/suivi-medical/patient/${id}`);
          setSuivisMedicaux(suivisResponse.data.data || suivisResponse.data || []);
        } catch (suivisError) {
          console.log('Aucun suivi médical trouvé ou erreur:', suivisError);
          setSuivisMedicaux([]);
        }
        
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement du patient');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  // Affichage d'un loader pendant le chargement
  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement du patient...</div>
    </div>
  );

  // Affichage d'une erreur si besoin
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-red-500 text-xl mb-4">{error}</div>
      <button
        onClick={() => navigate('/patients')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  // Affichage si aucun patient trouvé
  if (!patient) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-gray-500 text-xl mb-4">Patient non trouvé</div>
      <button
        onClick={() => navigate('/patients')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <FaArrowLeft /> Retour
      </button>
    </div>
  );

  // Récupère l'adresse parsée
  const adresse = patient._parsedAdresse || {};

  // Rendu principal des détails du patient
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* En-tête et bouton modifier */}
      <div className="mb-6 flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/patients')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Retour
          </button>
          <h1 className="text-2xl font-bold">Détails du patient</h1>
        </div>
        <button
          onClick={() => navigate(`/patients/${patient.id}/modifier`)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors"
        >
          <FaEdit /> Modifier
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Informations de base du patient */}
          <div>
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="font-medium">{patient.nom} {patient.prenom}</p>
          </div>
          {patient.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{patient.email}</p>
            </div>
          )}
          {patient.telephone && (
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium">{patient.telephone}</p>
            </div>
          )}
          {patient.numeroSecu && (
            <div>
              <p className="text-sm text-gray-500">Numéro de sécurité sociale</p>
              <p className="font-medium">{patient.numeroSecu}</p>
            </div>
          )}
          {patient.dateNaissance && (
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="font-medium">{new Date(patient.dateNaissance).toLocaleDateString()}</p>
            </div>
          )}
          {/* Adresse complète */}
          {adresse && (adresse.rue || adresse.ville || adresse.codePostal || adresse.pays) && (
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium">
                {adresse.rue}
                {adresse.complementAdresse && `, ${adresse.complementAdresse}`}
                <br />
                {adresse.codePostal} {adresse.ville}
                <br />
                {adresse.pays}
              </p>
            </div>
          )}
          {patient.groupeSanguin && (
            <div>
              <p className="text-sm text-gray-500">Groupe sanguin</p>
              <p className="font-medium">{patient.groupeSanguin}</p>
            </div>
          )}
          {/* Traitements en cours (badges) */}
          {Array.isArray(patient.traitementEnCours) && patient.traitementEnCours.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Traitements en cours</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.traitementEnCours.map((trait, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Statut du patient (badge coloré) */}
          {patient.status && (
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                patient.status === 'actif' ? 'bg-green-100 text-green-800' :
                patient.status === 'inactif' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {patient.status === 'actif' ? 'Actif' :
                 patient.status === 'inactif' ? 'Inactif' :
                 patient.status === 'archive' ? 'Archivé' : patient.status}
              </span>
            </div>
          )}
          {/* Allergies (badges) */}
          {Array.isArray(patient.allergies) && patient.allergies.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.allergies.map((allergy, idx) => (
                  <span key={idx} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
          {patient.profession && (
            <div>
              <p className="text-sm text-gray-500">Profession</p>
              <p className="font-medium">{patient.profession}</p>
            </div>
          )}
          {/* Fumeur */}
          <div>
            <p className="text-sm text-gray-500">Fumeur</p>
            <p className="font-medium">{patient.fumeur ? 'Oui' : 'Non'}</p>
          </div>
          {/* Antécédents médicaux (liste détaillée) */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Antécédents médicaux</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {Array.isArray(patient.antecedentsMedicaux) && patient.antecedentsMedicaux.length > 0 ? (
                <div className="space-y-3">
                  {patient.antecedentsMedicaux.map((antecedent, index) => (
                    <div key={index} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <p className="font-medium">{antecedent.type || 'Sans type'}</p>
                      <p className="text-gray-700">{antecedent.description || 'Aucune description'}</p>
                      {antecedent.date && (
                        <p className="text-sm text-gray-500">
                          {new Date(antecedent.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun antécédent médical enregistré</p>
              )}
            </div>
          </div>
          {/* Notes médicales */}
          {patient.notesMedicales && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notes médicales</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{patient.notesMedicales}</p>
              </div>
            </div>
          )}
          {/* Remarques */}
          {patient.remarques && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Remarques</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{patient.remarques}</p>
              </div>
            </div>
          )}
          {/* Suivis médicaux (liste détaillée) */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Suivis médicaux</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              {suivisMedicaux.length > 0 ? (
                <div className="space-y-6">
                  {suivisMedicaux.map((suivi, index) => (
                    <div key={suivi.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-blue-600">
                          Suivi du {new Date(suivi.date).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(suivi.date).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {suivi.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 font-medium mb-1">Description</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{suivi.description}</p>
                        </div>
                      )}
                      
                      {suivi.traitement && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 font-medium mb-1">Traitement</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{suivi.traitement}</p>
                        </div>
                      )}
                      
                      {suivi.ordonnance && suivi.ordonnance.medicaments && suivi.ordonnance.medicaments.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 font-medium mb-2">Médicaments prescrits</p>
                          <div className="flex flex-wrap gap-2">
                            {suivi.ordonnance.medicaments.map((med, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {suivi.notes && (
                        <div>
                          <p className="text-sm text-gray-600 font-medium mb-1">Notes</p>
                          <p className="text-gray-700 whitespace-pre-wrap text-sm">{suivi.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun suivi médical enregistré</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
