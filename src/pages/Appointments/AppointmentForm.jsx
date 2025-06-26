import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from '../../components/Card/Card';
import api from '../../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const AppointmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState([]);
  const [slotConflict, setSlotConflict] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Configuration de la durée des rendez-vous (en minutes)
  const APPOINTMENT_DURATION = 30;

  // Récupérer les paramètres d'URL pour la date et l'heure
  const searchParams = new URLSearchParams(location.search);
  const urlDate = searchParams.get('date');
  const urlHour = searchParams.get('hour');

  // Initialiser la date et l'heure avec les paramètres d'URL ou les valeurs par défaut
  const getInitialDate = () => {
    if (urlDate) {
      const dateFromUrl = new Date(urlDate);
      dateFromUrl.setHours(0, 0, 0, 0);
      return dateFromUrl;
    }
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  };

  const getInitialTime = () => {
    if (urlDate && urlHour) {
      const timeFromUrl = new Date(urlDate);
      timeFromUrl.setHours(parseInt(urlHour), 0, 0, 0);
      return timeFromUrl;
    }
    const now = new Date();
    // Initialiser à l'heure actuelle + 30 minutes pour être sûr d'être dans le futur
    now.setMinutes(now.getMinutes() + 30);
    now.setSeconds(0, 0);
    return now;
  };

  // Séparation date et heure
  const [selectedDate, setSelectedDate] = useState(getInitialDate);
  const [selectedTime, setSelectedTime] = useState(getInitialTime);

  const [formData, setFormData] = useState({
    patientId: '',
    type: '',
    notes: ''
  });

  // Effet pour mettre à jour la date et l'heure quand les paramètres d'URL changent
  useEffect(() => {
    if (urlDate) {
      const dateFromUrl = new Date(urlDate);
      dateFromUrl.setHours(0, 0, 0, 0);
      setSelectedDate(dateFromUrl);
    }
    
    if (urlDate && urlHour) {
      const timeFromUrl = new Date(urlDate);
      timeFromUrl.setHours(parseInt(urlHour), 0, 0, 0);
      setSelectedTime(timeFromUrl);
    }
  }, [urlDate, urlHour]);

  // Fonction pour vérifier les conflits de créneaux (côté frontend pour UX)
  const checkSlotAvailability = (date, time) => {
    if (!date || !time || existingAppointments.length === 0) return false;

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const slotStart = selectedDateTime;
    const slotEnd = addMinutes(selectedDateTime, APPOINTMENT_DURATION);

    // Vérifier si le créneau chevauche un rendez-vous existant
    const hasConflict = existingAppointments.some(appointment => {
      // Ignorer le rendez-vous en cours de modification
      if (id && appointment.id === parseInt(id)) {
        return false;
      }

      const appointmentStart = new Date(appointment.date);
      const appointmentEnd = addMinutes(appointmentStart, APPOINTMENT_DURATION);

      // Vérifier si les créneaux se chevauchent
      return (
        (slotStart < appointmentEnd && slotEnd > appointmentStart) ||
        (appointmentStart < slotEnd && appointmentEnd > slotStart)
      );
    });

    return hasConflict;
  };

  // Fonction pour gérer le changement de date avec rechargement des rendez-vous
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSlotConflict(false); // Réinitialiser le conflit quand la date change
  };

  // Fonction pour gérer le changement d'heure avec vérification immédiate
  const handleTimeChange = (time) => {
    setSelectedTime(time);
    
    // Vérifier si l'heure est dans le passé
    if (selectedDate && time) {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
      const now = new Date();
      
      if (selectedDateTime <= now) {
        window.alert('Impossible de créer un rendez-vous dans le passé. Veuillez sélectionner une heure future.');
        // Réinitialiser à l'heure actuelle + 30 minutes
        const futureTime = new Date();
        futureTime.setMinutes(futureTime.getMinutes() + 30);
        futureTime.setSeconds(0, 0);
        setSelectedTime(futureTime);
        setSlotConflict(false);
        return;
      }
      
      // Vérifier immédiatement si le créneau est disponible
      const hasConflict = checkSlotAvailability(selectedDate, time);
      setSlotConflict(hasConflict);
      
      if (hasConflict) {
        // Afficher une alerte immédiate
        const conflictMessage = `Ce créneau est déjà réservé. Veuillez sélectionner une autre heure.`;
        window.alert(conflictMessage);
        
        // Optionnel : réinitialiser l'heure à l'heure actuelle + 30 minutes
        const futureTime = new Date();
        futureTime.setMinutes(futureTime.getMinutes() + 30);
        futureTime.setSeconds(0, 0);
        setSelectedTime(futureTime);
        setSlotConflict(false);
      }
    }
  };

  // Fonction pour charger les rendez-vous existants pour une date donnée
  const fetchExistingAppointments = async (date) => {
    if (!date) return;

    try {
      setCheckingAvailability(true);
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Chargement des rendez-vous pour la date:', formattedDate);
      
      const response = await api.get(`/appointments?date=${formattedDate}`);
      const appointments = response.data?.data || [];
      
      console.log('Rendez-vous chargés:', appointments.length, appointments);
      setExistingAppointments(appointments);
    } catch (err) {
      console.error('Erreur lors du chargement des rendez-vous existants:', err);
      setExistingAppointments([]);
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Vérifier la disponibilité quand la date ou l'heure change
  useEffect(() => {
    if (selectedDate && selectedTime && existingAppointments.length >= 0) {
      console.log('Vérification de disponibilité déclenchée');
      const hasConflict = checkSlotAvailability(selectedDate, selectedTime);
      setSlotConflict(hasConflict);
    }
  }, [selectedDate, selectedTime, existingAppointments]);

  // Charger les rendez-vous existants quand la date change
  useEffect(() => {
    if (selectedDate) {
      fetchExistingAppointments(selectedDate);
    }
  }, [selectedDate]);

  const fetchAppointment = async () => {
    try {
      const response = await api.get(`/appointments/${id}`);
      const appointmentData = response.data?.data || response.data;
      if (!appointmentData) {
        throw new Error('Données du rendez-vous non trouvées');
      }
      // Récupérer la date et l'heure séparément
      const dateObj = new Date(appointmentData.date);
      const dateOnly = new Date(dateObj);
      dateOnly.setHours(0, 0, 0, 0);
      const timeOnly = new Date(0);
      timeOnly.setHours(dateObj.getHours(), dateObj.getMinutes(), 0, 0);
      setSelectedDate(dateOnly);
      setSelectedTime(timeOnly);
      setFormData({
        patientId: appointmentData.patient?._id,
        type: appointmentData.type || 'consultation',
        notes: appointmentData.notes || ''
      });
    } catch (err) {
      console.error('Erreur lors du chargement du rendez-vous:', err);
      setError('Erreur lors du chargement du rendez-vous');
      toast.error('Erreur lors du chargement du rendez-vous');
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/patients');
        const patientsData = response.data?.data || [];
        setPatients(patientsData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setError('Erreur lors du chargement des patients');
        setLoading(false);
      }
    };
    fetchPatients();
    if (id) {
      fetchAppointment();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier s'il y a un conflit avant de soumettre
    if (slotConflict) {
      toast.error('Ce créneau est déjà réservé pour un autre patient. Veuillez choisir une autre heure.');
      return;
    }

    setError(null);
    setIsSaving(true);
    try {
      // Combiner la date et l'heure sélectionnées
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      const appointmentData = {
        patientId: formData.patientId,
        date: combinedDate.toISOString(),
        type: formData.type || 'consultation',
        notes: formData.notes || ''
      };
      let response;
      if (id) {
        response = await api.put(`/appointments/${id}`, appointmentData);
        toast.success('Rendez-vous modifié avec succès');
      } else {
        response = await api.post('/appointments', appointmentData);
        toast.success('Rendez-vous créé avec succès');
      }
      navigate('/appointments');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      if (error.response?.status === 409) {
        const errorData = error.response.data;
        const message = errorData.error || 'Ce créneau est déjà pris. Veuillez choisir un autre horaire.';
        
        // Afficher une alerte de confirmation
        window.alert(message);
        
        // Afficher aussi une toast notification
        toast.error(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const message = error.response?.data?.message || `Erreur lors de ${id ? 'la modification' : 'la création'} du rendez-vous`;
        window.alert(message);
        toast.error(message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        {id ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
      </h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                className="input-field"
                value={formData.patientId}
                onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                required
              >
                <option value="">Sélectionner un patient</option>
                {Array.isArray(patients) && patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nom} {patient.prenom}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de rendez-vous
              </label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="consultation">Consultation</option>
                <option value="control">Contrôle</option>
                <option value="emergency">Urgence</option>
                <option value="cleaning">Nettoyage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="input-field w-full"
                required
                locale={fr}
                placeholderText="Choisir la date"
                minDate={new Date()}
                filterDate={(date) => {
                  // Bloquer seulement le dimanche
                  const day = date.getDay();
                  return day !== 0; // 0 = dimanche
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Heure
              </label>
              <DatePicker
                selected={selectedTime}
                onChange={handleTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={5}
                timeCaption="Heure"
                dateFormat="HH:mm"
                className={`input-field w-full ${slotConflict ? 'border-red-500 bg-red-50' : ''}`}
                required
                locale={fr}
                placeholderText="Choisir l'heure"
                minTime={selectedDate && selectedDate.toDateString() === new Date().toDateString() ? new Date() : new Date().setHours(0, 0, 0, 0)}
                maxTime={new Date().setHours(23, 59, 0, 0)}
                filterTime={(time) => {
                  const now = new Date();
                  const selectedDateOnly = selectedDate ? new Date(selectedDate) : new Date();
                  selectedDateOnly.setHours(0, 0, 0, 0);
                  const todayOnly = new Date();
                  todayOnly.setHours(0, 0, 0, 0);
                  
                  if (selectedDateOnly.getTime() === todayOnly.getTime()) {
                    return time > now;
                  }
                  
                  return true;
                }}
              />
              {slotConflict && (
                <p className="mt-1 text-sm text-red-600">
                  ⚠️ Ce créneau est déjà réservé
                </p>
              )}
            </div>
          </div>

          {/* Affichage des conflits de créneaux */}
          {slotConflict && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Créneau non disponible
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      Ce créneau est déjà réservé pour un autre patient. Veuillez choisir une autre heure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Indicateur de vérification */}
          {checkingAvailability && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Vérification de la disponibilité du créneau...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              className="input-field w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              rows="4"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
                slotConflict ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              disabled={isSaving || slotConflict}
            >
              {isSaving ? 'Enregistrement...' : (id ? 'Modifier le rendez-vous' : 'Créer le rendez-vous')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AppointmentForm;
