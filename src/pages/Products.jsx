import { useState } from 'react'
import './Products.css'
import ProductCard from '../components/ProductCard'
import Modal from '../components/Modal'
import Form from '../components/Form'
import { FaPlus } from 'react-icons/fa'

function Products() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Pizza Margherita',
      category: 'Pizzas',
      price: 8500,
      description: 'La classique pizza italienne avec sauce tomate, mozzarella et basilic frais',
      image: '/images/pizza-margherita.jpg',
      preparationTime: 20,
      ingredients: ['Sauce tomate', 'Mozzarella', 'Basilic frais', 'Huile d\'olive'],
      allergens: ['Gluten', 'Lactose'],
      isVegetarian: true,
      calories: 850
    },
    {
      id: 2,
      name: 'Burger Classic',
      category: 'Burgers',
      price: 6500,
      description: 'Notre burger signature avec steak de bœuf, fromage, salade, tomate et sauce maison',
      image: '/images/burger-classic.jpg',
      preparationTime: 15,
      ingredients: ['Steak de bœuf', 'Cheddar', 'Salade', 'Tomate', 'Oignon', 'Sauce maison'],
      allergens: ['Gluten', 'Lactose', 'Œuf'],
      isSpicy: false,
      calories: 950
    },
    {
      id: 3,
      name: 'Salade César',
      category: 'Salades',
      price: 5500,
      description: 'Salade fraîche avec poulet grillé, parmesan, croûtons et notre sauce césar maison',
      image: '/images/salade-cesar.jpg',
      preparationTime: 10,
      ingredients: ['Laitue romaine', 'Poulet grillé', 'Parmesan', 'Croûtons', 'Sauce césar'],
      allergens: ['Gluten', 'Lactose', 'Œuf'],
      isVegetarian: false,
      calories: 450
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [cart, setCart] = useState([])

  const formFields = [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { 
      name: 'category', 
      label: 'Catégorie', 
      type: 'select',
      required: true,
      options: [
        { value: 'Pizzas', label: 'Pizzas' },
        { value: 'Burgers', label: 'Burgers' },
        { value: 'Salades', label: 'Salades' },
        { value: 'Desserts', label: 'Desserts' },
        { value: 'Boissons', label: 'Boissons' }
      ]
    },
    { name: 'price', label: 'Prix (F)', type: 'number', required: true, min: 0 },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'image', label: 'URL de l\'image', type: 'text' },
    { name: 'preparationTime', label: 'Temps de préparation (min)', type: 'number', min: 1 },
    { name: 'ingredients', label: 'Ingrédients (séparés par des virgules)', type: 'textarea' },
    { name: 'allergens', label: 'Allergènes (séparés par des virgules)', type: 'textarea' },
    { name: 'calories', label: 'Calories', type: 'number', min: 0 },
    { name: 'isSpicy', label: 'Épicé', type: 'checkbox' },
    { name: 'isVegetarian', label: 'Végétarien', type: 'checkbox' }
  ]

  const handleAdd = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = (product) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== product.id))
    }
  }

  const handleSubmit = (values) => {
    const processedValues = {
      ...values,
      ingredients: values.ingredients ? values.ingredients.split(',').map(i => i.trim()) : [],
      allergens: values.allergens ? values.allergens.split(',').map(a => a.trim()) : []
    }

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...processedValues, id: p.id } : p
      ))
    } else {
      setProducts([...products, { ...processedValues, id: Date.now() }])
    }
    setIsModalOpen(false)
  }

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }

    // Afficher une notification
    const notification = document.createElement('div')
    notification.className = 'cart-notification'
    notification.textContent = 'Produit ajouté au panier'
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add('show')
      setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 2000)
    }, 100)
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="page-title">Produits</h1>
        <button className="add-button" onClick={handleAdd}>
          <FaPlus />
          Ajouter un produit
        </button>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
      >
        <Form
          fields={formFields}
          values={editingProduct ? {
            ...editingProduct,
            ingredients: editingProduct.ingredients?.join(', '),
            allergens: editingProduct.allergens?.join(', ')
          } : {}}
          onChange={setEditingProduct}
          onSubmit={handleSubmit}
          submitText={editingProduct ? 'Modifier' : 'Ajouter'}
        />
      </Modal>
    </div>
  )
}

export default Products