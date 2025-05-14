import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import OrdonnanceList from './pages/Ordonnances/OrdonnanceList';
import OrdonnanceForm from './pages/Ordonnances/OrdonnanceForm';
import OrdonnanceDetails from './pages/Ordonnances/OrdonnanceDetails';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const routes = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'ordonnances',
        element: <OrdonnanceList />,
      },
      {
        path: 'ordonnances/new',
        element: <OrdonnanceForm />,
      },
      {
        path: 'ordonnances/:id',
        element: <OrdonnanceDetails />,
      },
      {
        path: 'ordonnances/:id/modifier',
        element: <OrdonnanceForm />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export { router };
