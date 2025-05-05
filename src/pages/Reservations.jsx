import { useState } from 'react'
import './Reservations.css'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Form from '../components/Form'

function Reservations() {
  const [reservations, setReservations] = useState([
    { 
      id: 1, 
      customerName: 'Pierre Martin',
      date: '2025-05-05',
      time: '19:00',
      guests: 4,
      phone: '77 234 56 78',
      notes: 'Table près de la fenêtre',
      status: 'confirmed'
    },
    { 
      id: 2, 
      customerName: 'Marie Dupont',
      date: '2025-05-05',
      time: '20:30',
      guests: 2,
      phone: '77 345 67 89',
      notes: 'Anniversaire',
      status: 'pending'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)

  const columns = [
    { field: 'customerName', header: 'Client' },
    { field: 'date', header: 'Date' },
    { field: 'time', header: 'Heure' },
    { field: 'guests', header: 'Personnes' },
    { 
      field: 'status', 
      header: 'Statut',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value === 'pending' ? 'En attente' : 'Confirmé'}
        </span>
      )
    }
  ]

  const formFields = [
    { name: 'customerName', label: 'Nom du client', type: 'text', required: true },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'time', label: 'Heure', type: 'time', required: true },
    { name: 'guests', label: 'Nombre de personnes', type: 'number', required: true, min: 1 },
    { name: 'notes', label: 'Notes', type: 'textarea' },
    { 
      name: 'status', 
      label: 'Statut', 
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'En attente' },
        { value: 'confirmed', label: 'Confirmé' }
      ]
    }
  ]

  const handleAdd = () => {
    setEditingReservation(null)
    setIsModalOpen(true)
  }

  const handleEdit = (reservation) => {
    setEditingReservation(reservation)
    setIsModalOpen(true)
  }

  const handleDelete = (reservation) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      setReservations(reservations.filter(r => r.id !== reservation.id))
    }
  }

  const handleSubmit = (values) => {
    if (editingReservation) {
      setReservations(reservations.map(r => 
        r.id === editingReservation.id ? { ...values, id: r.id } : r
      ))
    } else {
      setReservations([...reservations, { ...values, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="reservations-page">
      <h1 className="page-title">Réservations</h1>
      
      <DataTable
        title="Liste des réservations"
        columns={columns}
        data={reservations}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReservation ? 'Modifier la réservation' : 'Ajouter une réservation'}
      >
        <Form
          fields={formFields}
          values={editingReservation || {}}
          onChange={setEditingReservation}
          onSubmit={handleSubmit}
          submitText={editingReservation ? 'Modifier' : 'Ajouter'}
        />
      </Modal>
    </div>
  )
}

export default Reservations