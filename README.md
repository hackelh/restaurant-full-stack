# Allo Dentiste - Application de Gestion de Cabinet Dentaire

## Description

Allo Dentiste est une application web full-stack conçue pour simplifier la gestion d'un cabinet dentaire. Elle permet de gérer les rendez-vous, les patients et les traitements de manière efficace et intuitive.

## Fonctionnalités

- Gestion des rendez-vous (création, modification, suppression)
- Gestion des patients
- Interface utilisateur moderne et responsive
- Système d'authentification sécurisé
- Filtrage des rendez-vous (tous, aujourd'hui, à venir, passés)

## Technologies Utilisées

### Frontend
- React.js
- React Router pour la navigation
- Tailwind CSS pour le style
- Axios pour les requêtes API

### Backend
- Node.js
- Express.js
- MongoDB
- JWT pour l'authentification

## Installation

1. Clonez le dépôt :
```bash
git clone [URL_DU_REPO]
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Démarrez l'application en mode développement :
```bash
npm start
```

## Structure du Projet

```
src/
├── components/         # Composants réutilisables
├── pages/             # Pages de l'application
├── services/          # Services (API, auth, etc.)
├── styles/            # Styles globaux
└── App.jsx           # Point d'entrée de l'application
```

## Scripts Disponibles

- `npm start` : Lance l'application en mode développement
- `npm test` : Lance les tests
- `npm run build` : Crée une version de production

## Déploiement

Pour déployer l'application en production :

1. Créez une version de production :
```bash
npm run build
```

2. Les fichiers de production seront générés dans le dossier `build/`

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT.
