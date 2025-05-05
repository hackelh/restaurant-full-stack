import { useState } from 'react'
import './Orders.css'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import Form from '../components/Form'

function Orders() {
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      customerName: 'John Doe',
      items: 'Pizza Margherita (2x), Coca Cola (1x)',
      total: 18500,
      status: 'pending',
      address: '123 Rue de la Paix',
      phone: '77 123 45 67'
    },
    { 
      id: 2, 
      customerName: 'Jane Smith',
      items: 'Burger Classic (1x), Frites (1x)',
      total: 8000,
      status: 'completed',
      address: '456 Avenue des Champs',
      phone: '77 890 12 34'
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState(null)

  const columns = [
    { field: 'customerName', header: 'Client' },
    { field: 'items', header: 'Articles' },
    { 
      field: 'total', 
      header: 'Total',
      render: (value) => `${(value / 100).toFixed(0)} F`
    },
    { 
      field: 'status', 
      header: 'Statut',
      render: (value) => (
        <span className={`status-badge ${value}`}>
          {value === 'pending' ? 'En attente' : 'Complété'}
        </span>
      )
    }
  ]

  const formFields = [
    { name: 'customerName', label: 'Nom du client', type: 'text', required: true },
    { name: 'phone', label: 'Téléphone', type: 'tel', required: true },
    { name: 'address', label: 'Adresse de livraison', type: 'text', required: true },
    { name: 'items', label: 'Articles', type: 'textarea', required: true },
    { name: 'total', label: 'Total (F)', type: 'number', required: true, min: 0 },
    { 
      name: 'status', 
      label: 'Statut', 
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'En attente' },
        { value: 'completed', label: 'Complété' }
      ]
    }
  ]

  const handleAdd = () => {
    setEditingOrder(null)
    setIsModalOpen(true)
  }

  const handleEdit = (order) => {
    setEditingOrder(order)
    setIsModalOpen(true)
  }

  const handleDelete = (order) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      setOrders(orders.filter(o => o.id !== order.id))
    }
  }

  const handleSubmit = (values) => {
    if (editingOrder) {
      setOrders(orders.map(o => 
        o.id === editingOrder.id ? { ...values, id: o.id } : o
      ))
    } else {
      setOrders([...orders, { ...values, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="orders-page">
      <h1 className="page-title">Commandes</h1>
      
      <DataTable
        title="Liste des commandes"
        columns={columns}
        data={orders}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOrder ? 'Modifier la commande' : 'Ajouter une commande'}
      >
        <Form
          fields={formFields}
          values={editingOrder || {}}
          onChange={setEditingOrder}
          onSubmit={handleSubmit}
          submitText={editingOrder ? 'Modifier' : 'Ajouter'}
        />
      </Modal>
    </div>
  )
}

export default Orders