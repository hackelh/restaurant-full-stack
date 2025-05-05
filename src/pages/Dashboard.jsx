import './Dashboard.css'
import { FaUtensils, FaUsers, FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa'

function Dashboard() {
  const stats = [
    {
      icon: FaUtensils,
      label: 'Produits',
      value: '45',
      color: '#ff4b3a'
    },
    {
      icon: FaUsers,
      label: 'Réservations',
      value: '12',
      color: '#2ecc71'
    },
    {
      icon: FaShoppingCart,
      label: 'Commandes',
      value: '28',
      color: '#3498db'
    },
    {
      icon: FaMoneyBillWave,
      label: 'Revenus',
      value: '158,450 F',
      color: '#f1c40f'
    }
  ]

  return (
    <div className="dashboard">
      <h1 className="page-title">Tableau de bord</h1>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <stat.icon />
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Commandes récentes</h2>
          <div className="orders-list">
            <div className="order-item">
              <span className="order-id">#1234</span>
              <span className="order-details">2x Pizza Margherita, 1x Coca</span>
              <span className="order-status pending">En attente</span>
            </div>
            <div className="order-item">
              <span className="order-id">#1233</span>
              <span className="order-details">1x Burger, 1x Frites</span>
              <span className="order-status completed">Complété</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Réservations du jour</h2>
          <div className="reservations-list">
            <div className="reservation-item">
              <span className="reservation-time">19:00</span>
              <span className="reservation-details">M. Dupont - 4 personnes</span>
              <span className="reservation-status">Confirmé</span>
            </div>
            <div className="reservation-item">
              <span className="reservation-time">20:30</span>
              <span className="reservation-details">Mme Martin - 2 personnes</span>
              <span className="reservation-status">En attente</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard