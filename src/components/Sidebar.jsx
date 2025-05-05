import { NavLink } from 'react-router-dom'
import './Sidebar.css'
import {
  FaHome,
  FaShoppingBag,
  FaUtensils,
  FaCalendarAlt,
  FaBoxes,
  FaChartBar
} from 'react-icons/fa'

function Sidebar({ isOpen }) {
  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/orders', icon: FaShoppingBag, label: 'Commandes' },
    { path: '/products', icon: FaUtensils, label: 'Produits' },
    { path: '/reservations', icon: FaCalendarAlt, label: 'Réservations' },
    { path: '/stock', icon: FaBoxes, label: 'Stock' },
    { path: '/reports', icon: FaChartBar, label: 'Rapports' }
  ]

  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar