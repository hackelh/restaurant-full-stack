import axios from 'axios';

// Créer une instance d'Axios avec une URL de base
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    // Récupérer le token du localStorage
    const token = localStorage.getItem('token');

    // Vérifier si la route nécessite une authentification
    const publicRoutes = ['/auth/login', '/auth/register'];
    const isPublicRoute = publicRoutes.some(route => config.url.includes(route));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    // Log pour le débogage
    console.log('Réponse reçue:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erreur de réponse:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    // Gérer les différents codes d'erreur
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Erreur d\'authentification');
          // Supprimer les informations d'authentification
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;

        case 403:
          console.log('Accès refusé');
          break;

        case 404:
          console.log('Ressource non trouvée');
          break;

        case 500:
          console.log('Erreur serveur');
          break;

        default:
          console.log('Erreur non gérée:', error.response.status);
      }
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      console.log('Erreur de connexion au serveur');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.log('Erreur de configuration de la requête:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

