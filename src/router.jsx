import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import PatientForm from './pages/Patients/PatientForm';
import PatientDetails from './pages/Patients/PatientDetails';
import AppointmentList from './pages/Appointments/AppointmentList';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import AppointmentForm from './pages/Appointments/AppointmentForm';
import OrdonnanceList from './pages/Ordonnances/OrdonnanceList';
import OrdonnanceForm from './pages/Ordonnances/OrdonnanceForm';
import CalendarView from './pages/Planning/CalendarView';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

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
            path: '/patients',
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
            path: '/calendar',
            element: <CalendarView />
          }
        ]
      }
    ]
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
