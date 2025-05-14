import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn, MdPerson, MdNotes } from 'react-icons/md';
import { BsCalendarCheck } from 'react-icons/bs';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    type: 'Consultation de routine',
    notes: ''
  });
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState(null);

  useEffect(() => {
    fetchPatient();
    fetchAppointments();
  }, [id]);

  useEffect(() => {
    if (patient) {
      setEditedPatient({
        ...patient,
        adresse: patient.adresse ? { ...patient.adresse } : {
          rue: '',
          complementAdresse: '',
          codePostal: '',
          ville: '',
          pays: ''
        }
      });
    }
  }, [patient]);

  const initializePatientData = (data) => {
    return {
      nom: data.nom || '',
      prenom: data.prenom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      numeroSecu: data.numeroSecu || '',
      dateNaissance: data.dateNaissance || '',
      notesMedicales: data.notesMedicales || '',
      groupeSanguin: data.groupeSanguin || '',
      allergies: data.allergies || '',
      antecedents: data.antecedents || '',
      traitementEnCours: data.traitementEnCours || '',
      poids: data.poids || '',
      taille: data.taille || '',
      adresse: {
        rue: data.adresse?.rue || '',
        complementAdresse: data.adresse?.complementAdresse || '',
        codePostal: data.adresse?.codePostal || '',
        ville: data.adresse?.ville || '',
        pays: data.adresse?.pays || ''
      }
    };
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get(`/appointments/patient/${id}`);
      if (!response.data.data) {
        setAppointments([]);
        return;
      }

      // Vérifier et formater chaque rendez-vous
      const validAppointments = response.data.data
        .filter(apt => apt && apt.dateTime) // Filtrer les rendez-vous invalides
        .map(apt => ({
          ...apt,
          dateTime: new Date(apt.dateTime)
        }))
        .sort((a, b) => a.dateTime - b.dateTime)
        .filter(apt => apt.dateTime >= new Date());

      setAppointments(validAppointments);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      setAppointments([]);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        await api.delete(`/appointments/${appointmentId}`);
        toast.success('Rendez-vous supprimé avec succès');
        fetchAppointments();
      } catch (error) {
        console.error('Erreur lors de la suppression du rendez-vous:', error);
        toast.error('Erreur lors de la suppression du rendez-vous');
      }
    }
  };

  const validateAppointmentData = () => {
    if (!newAppointment.date || !newAppointment.time) {
      toast.error('Veuillez sélectionner une date et une heure');
      return false;
    }

    const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
    if (appointmentDateTime < new Date()) {
      toast.error('La date du rendez-vous ne peut pas être dans le passé');
      return false;
    }

    return true;
  };

  const handleAddAppointment = async () => {
    try {
      const appointmentData = {
        ...newAppointment,
        patientId: id,
        dateTime: `${newAppointment.date}T${newAppointment.time}`
      };
      
      await api.post('/appointments', appointmentData);
      toast.success('Rendez-vous ajouté avec succès');
      setShowAppointmentForm(false);
      setNewAppointment({
        date: '',
        time: '',
        type: 'Consultation de routine',
        notes: ''
      });
      fetchAppointments();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du rendez-vous:', error);
      toast.error('Erreur lors de l\'ajout du rendez-vous');
    }
  };

  const fetchPatient = async () => {
    try {
      const response = await api.get(`/patients/${id}`);
      const patientData = initializePatientData(response.data.data);
      setPatient(patientData);
      setEditedPatient({ ...patientData });
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement du patient:', error);
      toast.error('Erreur lors du chargement du patient');
      setError('Erreur lors du chargement du patient');
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      await api.delete(`/patients/${id}`);
      toast.success(`Patient ${patient.status === 'archive' ? 'désarchivé' : 'archivé'} avec succès`);
      fetchPatient();
    } catch (error) {
      console.error('Erreur lors de l\'archivage du patient:', error);
      toast.error('Erreur lors de l\'archivage du patient');
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedPatient({ ...patient });
    } else {
      setIsEditing(true);
      setEditedPatient({ ...patient });
    }
  };

  const handleChange = (field, value) => {
    if (!editedPatient) {
      setEditedPatient({
        ...patient,
        [field]: value
      });
      return;
    }

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedPatient({
        ...editedPatient,
        [parent]: {
          ...editedPatient[parent],
          [child]: value
        }
      });
    } else {
      setEditedPatient({
        ...editedPatient,
        [field]: value
      });
    }
  };

  const handleSave = async () => {
    try {
      if (!editedPatient) {
        throw new Error('Aucune modification à sauvegarder');
      }

      const response = await api.put(`/patients/${id}`, editedPatient);
      if (response.data && response.data.data) {
        const updatedPatient = response.data.data;
        setPatient(updatedPatient);
        setEditedPatient(updatedPatient);
        setIsEditing(false);
        toast.success('Patient mis à jour avec succès');
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour du patient');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedPatient({ ...patient });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl text-gray-600">Patient non trouvé</p>
          <button
            onClick={() => navigate('/patients')}
            className="mt-4 text-primary hover:text-primary-dark flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Patient non trouvé</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/patients')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Retour à la liste
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {patient?.nom || ''} {patient?.prenom || ''}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={toggleEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaEdit className="-ml-1 mr-2 h-5 w-5" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
          <button
            onClick={handleArchive}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaTrash className="-ml-1 mr-2 h-5 w-5" />
            Archiver
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations personnelles */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MdPerson className="text-blue-500" />
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nom</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient?.nom || ''}
                    onChange={(e) => handleChange('nom', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.nom || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Prénom</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient?.prenom || ''}
                    onChange={(e) => handleChange('prenom', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.prenom || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedPatient?.dateNaissance || ''}
                    onChange={(e) => handleChange('dateNaissance', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.dateNaissance || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedPatient?.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.email || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedPatient?.telephone || ''}
                    onChange={(e) => handleChange('telephone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.telephone || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Numéro de sécurité sociale</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedPatient?.numeroSecu || ''}
                    onChange={(e) => handleChange('numeroSecu', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                ) : (
                  <p className="text-gray-900">{patient?.numeroSecu || 'Non renseigné'}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Informations médicales */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MdNotes className="text-blue-500" />
              Informations médicales
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Groupe sanguin</p>
                {isEditing ? (
                  <select
                    value={editedPatient?.groupeSanguin || ''}
                    onChange={(e) => handleChange('groupeSanguin', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="text-gray-900">{patient?.groupeSanguin || 'Non renseigné'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Allergies</p>
                {isEditing ? (
                  <textarea
                    value={editedPatient?.allergies || ''}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{patient?.allergies || 'Aucune allergie connue'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Antécédents médicaux</p>
                {isEditing ? (
                  <textarea
                    value={editedPatient?.antecedents || ''}
                    onChange={(e) => handleChange('antecedents', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{patient?.antecedents || 'Aucun antécédent connu'}</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Traitement en cours</p>
                {isEditing ? (
                  <textarea
                    value={editedPatient?.traitementEnCours || ''}
                    onChange={(e) => handleChange('traitementEnCours', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-900">{patient?.traitementEnCours || 'Aucun traitement en cours'}</p>
                )}
              </div>
            </div>
          </div>
        </Card>


        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MdNotes className="text-blue-500" />
              Notes médicales
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              {isEditing ? (
                <textarea
                  value={editedPatient?.notesMedicales || ''}
                  onChange={(e) => setEditedPatient({ ...editedPatient, notesMedicales: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {patient.notesMedicales || 'Aucune note médicale'}
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BsCalendarCheck className="text-blue-500" />
                Rendez-vous
              </h2>
              <button
                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
              >
                {showAppointmentForm ? 'Annuler' : 'Nouveau rendez-vous'}
              </button>
            </div>

            {showAppointmentForm && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de rendez-vous</label>
                  <select
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Consultation de routine">Consultation de routine</option>
                    <option value="Urgence">Urgence</option>
                    <option value="Suivi">Suivi</option>
                    <option value="Examen">Examen</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  onClick={handleAddAppointment}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Ajouter le rendez-vous
                </button>
              </div>
            )}

            <div className="space-y-4">
              {appointments.length > 0 ? (
                <>
                  <h3 className="text-md font-medium text-gray-700 mb-3">Prochains rendez-vous</h3>
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-blue-50 rounded-lg p-4 relative group">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{appointment.type}</span>
                            {new Date(appointment.dateTime).toDateString() === new Date().toDateString() && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Aujourd'hui
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(new Date(appointment.dateTime), 'EEEE dd MMMM yyyy - HH:mm', { locale: fr })}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Supprimer le rendez-vous"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Aucun rendez-vous prévu pour ce patient</p>
                  <button
                    onClick={() => setShowAppointmentForm(true)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Planifier un rendez-vous
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>


      </div>

      {isEditing && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800 flex items-center gap-2"
          >
            <FaEdit /> Sauvegarder
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
