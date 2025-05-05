import { Link } from 'react-router-dom'
import './Header.css'
import { FaBars, FaShoppingCart, FaUser } from 'react-icons/fa'

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          <FaBars />
        </button>
        <Link to="/" className="logo">
          ASY-RESTAURENT
        </Link>
      </div>
      <div className="header-right">
        <button className="icon-button">
          <FaShoppingCart />
          <span className="badge">3</span>
        </button>
        <button className="icon-button">
          <FaUser />
        </button>
      </div>
    </header>
  )
}

export default Header