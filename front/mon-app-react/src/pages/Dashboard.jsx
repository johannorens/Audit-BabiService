import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiGetMe, apiGetReservations, apiGetServices, apiLogout, apiUpdateReservation, apiCreateAvis } from '../services/api'

import VueApercu       from '../components/VueApercu'
import VueReservations from '../components/VueReservations'
import VueParametres   from '../components/VueParametres'
import {
  GridIcon, CalendarIcon, SettingsIcon, LogoutIcon, SearchIcon, BellIcon,
  initials,
} from '../components/shared'

const NAV_ITEMS = [
  { key: 'apercu',       icon: <GridIcon />,     label: 'Aperçu' },
  { key: 'reservations', icon: <CalendarIcon />, label: 'Réservations' },
  { key: 'parametres',   icon: <SettingsIcon />, label: 'Paramètres' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [vue, setVue]                   = useState('apercu')
  const [user, setUser]                 = useState(null)
  const [reservations, setReservations] = useState([])
  const [recommandes, setRecommandes]   = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    Promise.all([apiGetMe(), apiGetReservations(), apiGetServices()]).then(
      ([me, reservationsRes, servicesRes]) => {
        if (me.ok) setUser(me.data)

        if (reservationsRes.ok) {
          setReservations(Array.isArray(reservationsRes.data) ? reservationsRes.data : [])
        }

        if (servicesRes.ok) {
          const parPrestataire = new Map()
          servicesRes.data.forEach((s) => {
            if (s.prestataire && !parPrestataire.has(s.id_prestataire)) {
              parPrestataire.set(s.id_prestataire, s)
            }
          })
          setRecommandes([...parPrestataire.values()].slice(0, 3))
        }

        setLoading(false)
      }
    )
  }, [])

  async function handleLogout() {
    await apiLogout()
    localStorage.removeItem('token')
    navigate('/')
  }

  async function handleCancel(id) {
    if (!confirm('Annuler cette réservation ?')) return
    const res = await apiUpdateReservation(id, { statut: 'annulee' })
    if (res.ok) {
      setReservations((prev) => prev.map((r) => (r.id_reservation === id ? res.data : r)))
    } else {
      alert("Impossible d'annuler la réservation.")
    }
  }

  async function handleMarkTerminee(id) {
    if (!confirm('Confirmer que cette prestation est terminée ?')) return
    const res = await apiUpdateReservation(id, { statut: 'terminee' })
    if (res.ok) {
      setReservations((prev) => prev.map((r) => (r.id_reservation === id ? res.data : r)))
    } else {
      alert('Impossible de mettre à jour la réservation pour le moment.')
    }
  }

  async function handleRate(id, payload) {
    const res = await apiCreateAvis({ ...payload, id_reservation: id })
    if (!res.ok) return false
    setReservations((prev) => prev.map((r) => (r.id_reservation === id ? { ...r, avis: res.data } : r)))
    return true
  }

  const aVenir = reservations.filter((r) => ['en_attente', 'confirmee'].includes(r.statut))

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-babi-cream">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col justify-between p-4 md:p-6 shrink-0">

        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6 md:mb-10">
            <span className="w-2.5 h-2.5 bg-babi-green rounded-full" />
            <span className="text-lg md:text-xl font-extrabold font-bricolage text-babi-dark">
              babi <span className="text-babi-green">services</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-row md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setVue(item.key)}
                className={`flex items-center gap-3 px-3 md:px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors text-left whitespace-nowrap md:w-full ${
                  vue === item.key ? 'bg-babi-green text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.key === 'reservations' && aVenir.length > 0 && (
                  <span className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-babi-green text-white">
                    {aVenir.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer sidebar */}
        <div className="mt-6">
          <Link
            to="/services"
            className="flex items-center gap-2 text-gray-400 text-sm px-4 mb-4 hover:text-babi-green transition-colors"
          >
            <SearchIcon /> Chercher un service
          </Link>

          <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
              {initials(user?.prenom, user?.nom)}
            </span>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-babi-dark text-sm truncate">
                {user ? `${user.prenom} ${user.nom}` : '—'}
              </p>
              <p className="text-xs text-gray-400 capitalize">{user?.role ?? 'Client'}</p>
            </div>

            <button onClick={handleLogout} className="text-gray-400 hover:text-babi-dark transition-colors">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">

        {/* Topbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 md:mb-8 gap-4">

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 w-full md:max-w-sm">
            <SearchIcon />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
            />
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4">
            <button className="relative text-gray-500 hover:text-babi-dark transition-colors">
              <BellIcon />
            </button>

            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {initials(user?.prenom, user?.nom)}
            </span>
          </div>
        </div>

        {/* Vues */}
        {vue === 'apercu' && (
          <VueApercu
            user={user}
            reservations={reservations}
            recommandes={recommandes}
            loading={loading}
          />
        )}

        {vue === 'reservations' && (
          <VueReservations
            reservations={reservations}
            loading={loading}
            onCancel={handleCancel}
            onMarkTerminee={handleMarkTerminee}
            onRate={handleRate}
          />
        )}

        {vue === 'parametres' && (
          <VueParametres user={user} onUserUpdate={setUser} />
        )}
      </main>
    </div>
  )
}