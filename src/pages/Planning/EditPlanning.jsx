import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import api from '../../services/api';

const EditPlanning = () => {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const defaultTimeSlots = {
    morning: { start: '09:00', end: '12:00' },
    afternoon: { start: '14:00', end: '18:00' }
  };

  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await api.get('/planning/availability');
        const availabilityData = response.data;
        
        // Si pas de données, initialiser avec les horaires par défaut
        if (Object.keys(availabilityData).length === 0) {
          const defaultAvailability = {};
          daysOfWeek.forEach(day => {
            defaultAvailability[day] = {
              isWorking: true,
              slots: [
                { ...defaultTimeSlots.morning },
                { ...defaultTimeSlots.afternoon }
              ]
            };
          });
          setAvailability(defaultAvailability);
        } else {
          setAvailability(availabilityData);
        }
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des disponibilités');
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  const handleDayToggle = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isWorking: !prev[day].isWorking
      }
    }));
  };

  const handleSlotChange = (day, slotIndex, field, value) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, idx) =>
          idx === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleAddSlot = (day) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: '', end: '' }]
      }
    }));
  };

  const handleRemoveSlot = (day, slotIndex) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, idx) => idx !== slotIndex)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/planning/availability', availability);
      setSuccessMessage('Disponibilités mises à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour des disponibilités');
    }
  };

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer les disponibilités</h1>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {daysOfWeek.map(day => (
            <Card key={day}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{day}</h3>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-primary"
                    checked={availability[day]?.isWorking}
                    onChange={() => handleDayToggle(day)}
                  />
                  <span className="ml-2 text-sm">Jour travaillé</span>
                </label>
              </div>

              {availability[day]?.isWorking && (
                <div className="space-y-4">
                  {availability[day]?.slots.map((slot, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Créneau {index + 1}</span>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSlot(day, index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-700">Début</label>
                          <input
                            type="time"
                            className="input-field"
                            value={slot.start}
                            onChange={(e) => handleSlotChange(day, index, 'start', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700">Fin</label>
                          <input
                            type="time"
                            className="input-field"
                            value={slot.end}
                            onChange={(e) => handleSlotChange(day, index, 'end', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddSlot(day)}
                    className="text-primary hover:text-secondary text-sm"
                  >
                    + Ajouter un créneau
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn-primary">
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlanning;
