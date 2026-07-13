import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import ServicesPage from './pages/ServicesPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import PrestatairesAdmin from './pages/PrestatairesAdmin'
import CategoriesAdmin from './pages/CategoriesAdmin'
import ServicesAdmin from './pages/ServicesAdmin'
import ValidationsAdmin from './pages/ValidationsAdmin'
import UtilisateursAdmin from './pages/UtilisateursAdmin'
import MissionsAdmin from './pages/MissionsAdmin'
import ReglagesAdmin from './pages/ReglagesAdmin'
import ProtectedRoute from './components/ProtectedRoute'
import ReservationFormPage from './pages/ReservationFormPage'
import MesReservationsPage from './pages/MesReservationsPage'
import DevenirPrestataire from './pages/DevenirPrestataire'
import ServiceDetailPage from './pages/ServiceDetailPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/inscription" element={<SignUp />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/connexion" element={<Login />} />
      <Route path="/devenir-prestataire" element={<DevenirPrestataire />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/validations"
        element={
          <ProtectedRoute adminOnly>
            <ValidationsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/prestataires"
        element={
          <ProtectedRoute adminOnly>
            <PrestatairesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute adminOnly>
            <CategoriesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute adminOnly>
            <ServicesAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs"
        element={
          <ProtectedRoute adminOnly>
            <UtilisateursAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/missions"
        element={
          <ProtectedRoute adminOnly>
            <MissionsAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reglages"
        element={
          <ProtectedRoute adminOnly>
            <ReglagesAdmin />
          </ProtectedRoute>
        }
      />
      <Route path="/services/:id" element={<ServiceDetailPage />} />
      <Route
        path="/services/:id/reserver"
        element={
          <ProtectedRoute>
            <ReservationFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <MesReservationsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App


