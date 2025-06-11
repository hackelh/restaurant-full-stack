import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/patients/${id}`);
        const patientData = response.data.data || response.data;
        if (!Array.isArray(patientData.antecedentsMedicaux)) {
          patientData.antecedentsMedicaux = [];
        }
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
        setError(null);
      } catch (error) {
        setError('Erreur lors du chargement du patient');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <div className="text-blue-500 font-semibold">Chargement du patient...</div>
    </div>
  );

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

  const adresse = patient._parsedAdresse || {};

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
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
          {Array.isArray(patient.allergies) && patient.allergies.length > 0 && (
            <div>
              <p className="text-sm text-gray-500">Allergies</p>
              <p className="font-medium">{patient.allergies.join(', ')}</p>
            </div>
          )}
          {patient.profession && (
            <div>
              <p className="text-sm text-gray-500">Profession</p>
              <p className="font-medium">{patient.profession}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Fumeur</p>
            <p className="font-medium">{patient.fumeur ? 'Oui' : 'Non'}</p>
          </div>
          {/* Section Antécédents médicaux */}
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
          {/* Section Notes médicales */}
          {patient.notesMedicales && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Notes médicales</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{patient.notesMedicales}</p>
              </div>
            </div>
          )}
          {/* Section Remarques */}
          {patient.remarques && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Remarques</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{patient.remarques}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
