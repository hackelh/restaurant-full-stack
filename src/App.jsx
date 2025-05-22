import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import PatientForm from './pages/Patients/PatientForm';
import PatientDetails from './pages/Patients/PatientDetails';
import AppointmentList from './pages/Appointments/AppointmentList';
import AppointmentDetails from './pages/Appointments/AppointmentDetails';
import AppointmentForm from './pages/Appointments/AppointmentForm';
import OrdonnanceList from './pages/Ordonnances/OrdonnanceList';
import OrdonnanceForm from './pages/Ordonnances/OrdonnanceForm';
import OrdonnanceDetails from './pages/Ordonnances/OrdonnanceDetails';
import CalendarView from './pages/Planning/CalendarView';
import EditPlanning from './pages/Planning/EditPlanning';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Layout from './components/Layout/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/nouveau" element={<PatientForm />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/patients/:id/modifier" element={<PatientForm />} />
              
              {/* Routes Rendez-vous */}
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/appointments/:id" element={<AppointmentDetails />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />
              <Route path="/appointments/:id/edit" element={<AppointmentForm />} />
              
              {/* Routes Ordonnances */}
              <Route path="/ordonnances" element={<OrdonnanceList />} />
              <Route path="/ordonnances/nouvelle" element={<OrdonnanceForm />} />
              <Route path="/ordonnances/:id" element={<OrdonnanceDetails />} />
              <Route path="/ordonnances/:id/modifier" element={<OrdonnanceForm />} />
              
              {/* Routes Planning */}
              <Route path="/planning" element={<CalendarView />} />
              <Route path="/planning/edit" element={<EditPlanning />} />
            </Route>
          </Route>

          {/* Routes d'erreur */}
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" />
    </AuthProvider>
  );
}

export default App;
