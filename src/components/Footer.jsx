import { FaPhone, FaMapMarkerAlt, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ASY-RESTAURENT</h3>
          <p>Découvrez une expérience culinaire unique avec nos plats préparés avec passion et des ingrédients frais de qualité.</p>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>
              <FaPhone />
              <span>+221 77 123 45 67</span>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>123 Rue de la Paix, Dakar</span>
            </li>
            <li>
              <FaEnvelope />
              <span>contact@asy-restaurant.com</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Horaires</h3>
          <ul className="hours">
            <li>
              <span>Lundi - Vendredi:</span>
              <span>11h00 - 23h00</span>
            </li>
            <li>
              <span>Samedi - Dimanche:</span>
              <span>12h00 - 00h00</span>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook /> asyfood
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram /> asyfood
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter /> asyfood
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ASY-RESTAURENT. Tous droits réservés.</p>
      </div>
    </footer>
  )
}

export default Footer
