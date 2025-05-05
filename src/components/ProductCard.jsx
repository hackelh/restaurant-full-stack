import { FaEdit, FaTrash, FaShoppingCart } from 'react-icons/fa'
import './ProductCard.css'

function ProductCard({ product, onEdit, onDelete, onAddToCart }) {
  const { 
    name, 
    image, 
    category, 
    price, 
    description, 
    preparationTime,
    ingredients,
    allergens,
    isSpicy,
    isVegetarian,
    calories
  } = product

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image || '/placeholder-food.jpg'} alt={name} />
        <div className="product-actions">
          <button onClick={() => onEdit(product)} className="edit-button">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(product)} className="delete-button">
            <FaTrash />
          </button>
        </div>
        {isSpicy && <span className="badge spicy">Épicé</span>}
        {isVegetarian && <span className="badge vegetarian">Végétarien</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-category">{category}</p>
        <p className="product-price">{(price / 100).toFixed(0)} F</p>
        <p className="product-description">{description}</p>
        
        <div className="product-details">
          {preparationTime && (
            <div className="detail-item">
              <span className="detail-label">Temps de préparation:</span>
              <span>{preparationTime} min</span>
            </div>
          )}
          
          {calories && (
            <div className="detail-item">
              <span className="detail-label">Calories:</span>
              <span>{calories} kcal</span>
            </div>
          )}

          {ingredients && ingredients.length > 0 && (
            <div className="detail-item ingredients">
              <span className="detail-label">Ingrédients:</span>
              <span>{ingredients.join(', ')}</span>
            </div>
          )}

          {allergens && allergens.length > 0 && (
            <div className="detail-item allergens">
              <span className="detail-label">Allergènes:</span>
              <span>{allergens.join(', ')}</span>
            </div>
          )}
        </div>

        <button className="add-to-cart-button" onClick={() => onAddToCart(product)}>
          <FaShoppingCart />
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}

export default ProductCard