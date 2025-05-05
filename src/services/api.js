// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Points d'entrée de l'API
const API_ENDPOINTS = {
  // Produits
  products: {
    list: () => `${API_BASE_URL}/products`,
    detail: (id) => `${API_BASE_URL}/products/${id}`,
    create: () => `${API_BASE_URL}/products`,
    update: (id) => `${API_BASE_URL}/products/${id}`,
    delete: (id) => `${API_BASE_URL}/products/${id}`,
    upload: () => `${API_BASE_URL}/products/upload`
  },

  // Commandes
  orders: {
    list: () => `${API_BASE_URL}/orders`,
    detail: (id) => `${API_BASE_URL}/orders/${id}`,
    create: () => `${API_BASE_URL}/orders`,
    update: (id) => `${API_BASE_URL}/orders/${id}`,
    delete: (id) => `${API_BASE_URL}/orders/${id}`
  },

  // Réservations
  reservations: {
    list: () => `${API_BASE_URL}/reservations`,
    detail: (id) => `${API_BASE_URL}/reservations/${id}`,
    create: () => `${API_BASE_URL}/reservations`,
    update: (id) => `${API_BASE_URL}/reservations/${id}`,
    delete: (id) => `${API_BASE_URL}/reservations/${id}`,
    check: () => `${API_BASE_URL}/reservations/check`
  },

  // Authentification
  auth: {
    login: () => `${API_BASE_URL}/auth/login`,
    register: () => `${API_BASE_URL}/auth/register`,
    logout: () => `${API_BASE_URL}/auth/logout`,
    profile: () => `${API_BASE_URL}/auth/profile`
  },

  // Panier
  cart: {
    get: () => `${API_BASE_URL}/cart`,
    add: () => `${API_BASE_URL}/cart/add`,
    update: () => `${API_BASE_URL}/cart/update`,
    remove: () => `${API_BASE_URL}/cart/remove`,
    clear: () => `${API_BASE_URL}/cart/clear`
  }
}

// Fonction helper pour les appels API
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

// Exemple de fonctions d'API que vous implémenterez avec votre backend
export const api = {
  products: {
    list: async () => await apiCall(API_ENDPOINTS.products.list()),
    getById: async (id) => await apiCall(API_ENDPOINTS.products.detail(id)),
    create: async (data) => await apiCall(API_ENDPOINTS.products.create(), {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    update: async (id, data) => await apiCall(API_ENDPOINTS.products.update(id), {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    delete: async (id) => await apiCall(API_ENDPOINTS.products.delete(id), {
      method: 'DELETE'
    }),
    upload: async (formData) => await apiCall(API_ENDPOINTS.products.upload(), {
      method: 'POST',
      body: formData,
      headers: {} // Le Content-Type sera automatiquement défini pour FormData
    })
  },

  orders: {
    list: async () => await apiCall(API_ENDPOINTS.orders.list()),
    getById: async (id) => await apiCall(API_ENDPOINTS.orders.detail(id)),
    create: async (data) => await apiCall(API_ENDPOINTS.orders.create(), {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  reservations: {
    list: async () => await apiCall(API_ENDPOINTS.reservations.list()),
    create: async (data) => await apiCall(API_ENDPOINTS.reservations.create(), {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    checkAvailability: async (date, time, guests) => await apiCall(
      `${API_ENDPOINTS.reservations.check()}?date=${date}&time=${time}&guests=${guests}`
    )
  },

  auth: {
    login: async (credentials) => await apiCall(API_ENDPOINTS.auth.login(), {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: async (userData) => await apiCall(API_ENDPOINTS.auth.register(), {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

  cart: {
    get: async () => await apiCall(API_ENDPOINTS.cart.get()),
    addItem: async (item) => await apiCall(API_ENDPOINTS.cart.add(), {
      method: 'POST',
      body: JSON.stringify(item)
    }),
    updateItem: async (item) => await apiCall(API_ENDPOINTS.cart.update(), {
      method: 'PUT',
      body: JSON.stringify(item)
    }),
    removeItem: async (itemId) => await apiCall(API_ENDPOINTS.cart.remove(), {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    })
  }
}