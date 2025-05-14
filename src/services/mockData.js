export const mockAppointments = [
  {
    _id: '1',
    patientName: 'John Doe',
    date: '2025-05-14',
    time: '09:00',
    duration: 30,
    type: 'consultation',
    status: 'confirmed',
    notes: 'Première consultation'
  },
  {
    _id: '2',
    patientName: 'Jane Smith',
    date: '2025-05-14',
    time: '10:00',
    duration: 45,
    type: 'suivi',
    status: 'pending',
    notes: 'Suivi traitement'
  },
  {
    _id: '3',
    patientName: 'Robert Johnson',
    date: '2025-05-15',
    time: '14:00',
    duration: 60,
    type: 'urgence',
    status: 'confirmed',
    notes: 'Douleur intense'
  }
];

export const mockPatients = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'M',
    email: 'john.doe@example.com',
    phone: '0123456789',
    birthDate: '1990-01-01',
    address: '123 Main St',
    postalCode: '75001',
    city: 'Paris',
    bloodType: 'A+',
    allergies: ['Pénicilline', 'Latex'],
    chronicDiseases: ['Diabète type 2'],
    currentMedications: ['Metformine 1000mg'],
    dentalNotes: [
      {
        date: '2025-05-01',
        note: 'Patient anxieux lors des soins, prévoir sédation légère si nécessaire'
      },
      {
        date: '2025-05-10',
        note: 'Douleur persistante sur molaire 36, à surveiller'
      }
    ],
    appointments: [
      {
        _id: 'apt1',
        date: '2025-05-14',
        type: 'Détartrage',
        status: 'Confirmé',
        notes: 'Détartrage complet + polissage',
        duration: 30
      },
      {
        _id: 'apt2',
        date: '2025-05-28',
        type: 'Traitement de carie',
        status: 'En attente',
        notes: 'Carie sur dent 36',
        duration: 45
      }
    ],
    prescriptions: [
      {
        _id: 'pres1',
        date: '2025-05-14',
        treatments: [
          {
            medication: 'Amoxicilline',
            dosage: '1g',
            frequency: '3x/jour',
            duration: '7 jours'
          },
          {
            medication: 'Ibuprofène',
            dosage: '400mg',
            frequency: 'Si douleur',
            duration: '5 jours'
          }
        ],
        pdfUrl: '/ordonnances/ord-123.pdf'
      }
    ],
    documents: [
      {
        _id: 'doc1',
        title: 'Radiographie panoramique',
        type: 'XRAY',
        date: '2025-05-14',
        url: '/documents/pano-123.jpg',
        notes: 'Contrôle annuel'
      },
      {
        _id: 'doc2',
        title: 'Scanner 3D molaire 36',
        type: 'SCAN',
        date: '2025-05-10',
        url: '/documents/scan-124.pdf',
        notes: 'Évaluation pré-traitement'
      }
    ],
    dentalSummary: {
      lastVisit: {
        date: '2025-05-01',
        type: 'Consultation'
      },
      totalVisits: 8,
      nextAppointment: {
        date: '2025-05-14',
        type: 'Détartrage'
      },
      treatedTeeth: [
        {
          number: 36,
          treatments: ['Carie', 'Dévitalisation'],
          dates: ['2025-04-15', '2025-04-22']
        },
        {
          number: 14,
          treatments: ['Carie'],
          dates: ['2025-03-10']
        }
      ]
    }
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'F',
    email: 'jane.smith@example.com',
    phone: '0987654321',
    birthDate: '1985-05-15',
    address: '456 Oak Ave',
    postalCode: '69001',
    city: 'Lyon',
    bloodType: 'O-',
    allergies: [],
    chronicDiseases: [],
    currentMedications: [],
    dentalNotes: [
      {
        date: '2025-05-01',
        note: 'Préfère les rendez-vous matinaux'
      }
    ],
    appointments: [
      {
        _id: 'apt3',
        date: '2025-05-15',
        type: 'Traitement de canal',
        status: 'Confirmé',
        notes: 'Canal sur dent 24',
        duration: 60
      }
    ],
    prescriptions: [
      {
        _id: 'pres2',
        date: '2025-05-01',
        treatments: [
          {
            medication: 'Paracétamol',
            dosage: '1000mg',
            frequency: '3x/jour',
            duration: '3 jours'
          }
        ],
        pdfUrl: '/ordonnances/ord-124.pdf'
      }
    ],
    documents: [
      {
        _id: 'doc3',
        title: 'Radio dent 24',
        type: 'XRAY',
        date: '2025-05-01',
        url: '/documents/xray-125.jpg',
        notes: 'Pré-traitement canal'
      }
    ],
    dentalSummary: {
      lastVisit: {
        date: '2025-05-01',
        type: 'Consultation'
      },
      totalVisits: 3,
      nextAppointment: {
        date: '2025-05-15',
        type: 'Traitement de canal'
      },
      treatedTeeth: [
        {
          number: 24,
          treatments: ['Canal en cours'],
          dates: ['2025-05-15']
        }
      ]
    }
  }
];

export const mockOrdonnances = [
  {
    _id: '1',
    date: '2025-05-14',
    patient: {
      _id: '1',
      name: 'John Doe'
    },
    prescriptions: [
      {
        medicament: 'Paracétamol',
        dosage: '1000mg',
        frequence: '3 fois par jour',
        duree: '5 jours'
      }
    ],
    notes: 'Prendre pendant les repas'
  },
  {
    _id: '2',
    date: '2025-05-14',
    patient: {
      _id: '2',
      name: 'Jane Smith'
    },
    prescriptions: [
      {
        medicament: 'Amoxicilline',
        dosage: '500mg',
        frequence: '2 fois par jour',
        duree: '7 jours'
      }
    ],
    notes: 'Prendre à jeun'
  }
];
