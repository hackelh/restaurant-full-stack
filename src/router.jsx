import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages de gestion des patients
import Patients from './pages/Patients/Patients';
import PatientForm from './pages/Patients/PatientForm';
import PatientDetails from './pages/Patients/PatientDetails';

// Pages de gestion des rendez-vous
import AppointmentList from './pages/Appointments/AppointmentList';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import AppointmentForm from './pages/Appointments/AppointmentForm';

// Pages de gestion des ordonnances
import OrdonnanceList from './pages/Ordonnances/OrdonnanceList';
import OrdonnanceForm from './pages/Ordonnances/OrdonnanceForm';

// Pages de planning
import CalendarView from './pages/Planning/CalendarView';
import EditPlanning from './pages/Planning/EditPlanning';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <Dashboard />
          },
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: 'patients',
            children: [
              {
                index: true,
                element: <Patients />
              },
              {
                path: 'nouveau',
                element: <PatientForm />
              },
              {
                path: ':id',
                element: <PatientDetails />
              },
              {
                path: ':id/modifier',
                element: <PatientForm />
              },
              {
                path: ':id/edit',
                element: <PatientForm />
              }
            ]
          },
          {
            path: '/appointments',
            children: [
              {
                index: true,
                element: <AppointmentList />
              },
              {
                path: ':id',
                element: <AppointmentDetails />
              },
              {
                path: 'new',
                element: <AppointmentForm />
              },
              {
                path: ':id/edit',
                element: <AppointmentForm />
              }
            ]
          },
          {
            path: '/ordonnances',
            children: [
              {
                index: true,
                element: <OrdonnanceList />
              },
              {
                path: 'nouvelle',
                element: <OrdonnanceForm />
              },
              {
                path: ':id/modifier',
                element: <OrdonnanceForm />
              }
            ]
          },
          {
            path: '/planning',
            children: [
              {
                index: true,
                element: <CalendarView />
              },
              {
                path: 'edit',
                element: <EditPlanning />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/error',
    element: <ErrorPage />
  },
  {
    path: '*',
    element: <NotFound />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
