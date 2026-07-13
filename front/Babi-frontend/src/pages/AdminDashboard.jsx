import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { apiGetAdminDashboard } from '../services/api'

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M6.66667 5.83333V4.16667C6.66667 3.24619 7.41286 2.5 8.33333 2.5H11.6667C12.5871 2.5 13.3333 3.24619 13.3333 4.16667V5.83333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33333 5.83333H16.6667C17.5871 5.83333 18.3333 6.57953 18.3333 7.5V15.8333C18.3333 16.7538 17.5871 17.5 16.6667 17.5H3.33333C2.41286 17.5 1.66667 16.7538 1.66667 15.8333V7.5C1.66667 6.57953 2.41286 5.83333 3.33333 5.83333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M13.3333 17.5V15.8333C13.3333 14.0652 11.9334 12.5 10.1652 12.5H4.16523C2.39709 12.5 1.66523 14.0652 1.66523 15.8333V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.16667 9.16667C9.00762 9.16667 10.5 7.67428 10.5 5.83333C10.5 3.99238 9.00762 2.5 7.16667 2.5C5.32572 2.5 3.83333 3.99238 3.83333 5.83333C3.83333 7.67428 5.32572 9.16667 7.16667 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1667 12.6667C15.5779 13.0699 16.6667 14.3441 16.6667 15.8333V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 2.6084C12.7144 3.06804 13.5833 4.23548 13.5833 5.625C13.5833 7.01452 12.7144 8.18196 11.5 8.6416" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M6.66667 3.33333H5C4.07953 3.33333 3.33333 4.07953 3.33333 5V16.6667C3.33333 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V5C16.6667 4.07953 15.9205 3.33333 15 3.33333H13.3333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 3.33333C6.66667 2.41286 7.41286 1.66667 8.33333 1.66667H11.6667C12.5871 1.66667 13.3333 2.41286 13.3333 3.33333C13.3333 4.25381 12.5871 5 11.6667 5H8.33333C7.41286 5 6.66667 4.25381 6.66667 3.33333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 6.66667H2.5M17.5 6.66667V14.1667C17.5 15.0871 16.7538 15.8333 15.8333 15.8333H4.16667C3.24619 15.8333 2.5 15.0871 2.5 14.1667V6.66667M17.5 6.66667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V6.66667" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M11.6667 17.5V15.8333C11.6667 14.0652 10.2668 12.5 8.49856 12.5H4.16523C2.39709 12.5 1.66667 14.0652 1.66667 15.8333V17.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.33333 9.16667C8.17428 9.16667 9.66667 7.67428 9.66667 5.83333C9.66667 3.99238 8.17428 2.5 6.33333 2.5C4.49238 2.5 3 3.99238 3 5.83333C3 7.67428 4.49238 9.16667 6.33333 9.16667Z" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.8333 6.66667V11.6667M13.3333 9.16667H18.3333" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CalendarIcon = ({ color = '#D97706' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M6.66667 1.66667V5M13.3333 1.66667V5M3.33333 8.33333H16.6667M5 3.33333H15C15.9205 3.33333 16.6667 4.07953 16.6667 5V16.6667C16.6667 17.5871 15.9205 18.3333 15 18.3333H5C4.07953 18.3333 3.33333 17.5871 3.33333 16.6667V5C3.33333 4.07953 4.07953 3.33333 5 3.33333Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StarIcon = ({ color = '#FBBF24' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill={color}>
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

const moisLabels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const moisNoms = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

function formatMontant(value) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} F`
}

function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 1) return "à l'instant"
  if (minutes < 60) return `il y a ${minutes} min`
  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `il y a ${heures} h`
  const jours = Math.floor(heures / 24)
  return `il y a ${jours} j`
}

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetAdminDashboard().then((res) => {
      if (res.ok) setData(res.data)
      setLoading(false)
    })
  }, [])

  const stats = data?.stats
  const aValider = data?.a_valider ?? []

  const chartParMois = moisLabels.map((_, index) => {
    const entry = data?.reservations_par_mois.find((m) => Number(m.mois) === index + 1)
    return entry ? Number(entry.total) : 0
  })
  const maxMission = Math.max(1, ...chartParMois)
  const moisCourant = new Date().getMonth()

  const activites = [
    ...(data?.activite_recente.derniers_utilisateurs ?? []).map((u) => ({
      icon: <UserPlusIcon />,
      label: `${u.prenom} ${u.nom} s'est inscrit·e`,
      date: u.created_at,
    })),
    ...(data?.activite_recente.dernieres_reservations ?? []).map((r) => ({
      icon: <CalendarIcon />,
      label: `Mission #${r.id_reservation} confirmée`,
      date: r.created_at,
    })),
    ...(data?.activite_recente.derniers_avis ?? []).map((a) => ({
      icon: <StarIcon />,
      label: `Nouvel avis ${a.note}★ reçu`,
      date: a.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <AdminLayout
      active="Tableau de bord"
      title="Tableau de bord"
      subtitle={`Vue d'ensemble de la plateforme · ${moisNoms[moisCourant]} ${new Date().getFullYear()}`}
      validationsCount={aValider.length}
      headerActions={
        <button className="bg-white border border-gray-200 text-babi-dark px-5 py-2.5 rounded-full font-semibold hover:border-babi-green transition-colors">
          Exporter
        </button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <span className="inline-flex p-2.5 rounded-xl mb-4 bg-violet-50 text-violet-600"><UsersIcon /></span>
          <p className="text-2xl font-extrabold text-babi-dark font-bricolage">{loading ? '…' : stats?.total_utilisateurs}</p>
          <p className="text-sm text-gray-500 mt-1">Utilisateurs</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <span className="inline-flex p-2.5 rounded-xl mb-4 bg-emerald-50 text-emerald-600"><BriefcaseIcon /></span>
          <p className="text-2xl font-extrabold text-babi-dark font-bricolage">{loading ? '…' : stats?.total_prestataires}</p>
          <p className="text-sm text-gray-500 mt-1">Prestataires actifs</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <span className="inline-flex p-2.5 rounded-xl mb-4 bg-amber-50 text-amber-600"><ClipboardIcon /></span>
          <p className="text-2xl font-extrabold text-babi-dark font-bricolage">{loading ? '…' : stats?.reservations_mois}</p>
          <p className="text-sm text-gray-500 mt-1">Missions ce mois</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <span className="inline-flex p-2.5 rounded-xl mb-4 bg-sky-50 text-sky-600"><WalletIcon /></span>
          <p className="text-2xl font-extrabold text-babi-dark font-bricolage">{loading ? '…' : formatMontant(stats?.volume_traite)}</p>
          <p className="text-sm text-gray-500 mt-1">Volume traité</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold text-babi-dark mb-6">Missions par mois</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {chartParMois.map((total, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full rounded-t-md ${index === moisCourant ? 'bg-babi-green' : 'bg-babi-green-light/40'}`}
                  style={{ height: `${(total / maxMission) * 100}%`, minHeight: total > 0 ? '4px' : 0 }}
                ></div>
                <span className="text-xs text-gray-400">{moisLabels[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-bold text-babi-dark mb-5">Activité récente</h2>
          <div className="flex flex-col gap-4">
            {activites.map((activite, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">{activite.icon}</span>
                <div>
                  <p className="text-sm text-babi-dark leading-tight">{activite.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{relativeTime(activite.date)}</p>
                </div>
              </div>
            ))}
            {!loading && activites.length === 0 && (
              <p className="text-sm text-gray-500">Aucune activité récente.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-babi-dark">À valider</h2>
            {aValider.length > 0 && (
              <span className="bg-babi-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {aValider.length}
              </span>
            )}
          </div>
          <Link to="/admin/validations" className="text-sm font-semibold text-babi-green hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          {aValider.slice(0, 3).map((prestataire) => (
            <div key={prestataire.id_prestataire} className="flex items-center gap-3 py-3">
              <span className="w-8 h-8 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                {initials(prestataire.prenom, prestataire.nom)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-babi-dark text-sm truncate">{prestataire.prenom} {prestataire.nom}</p>
                <p className="text-xs text-gray-500 truncate">{prestataire.categorie?.nom_categorie ?? '—'} · {prestataire.localisation ?? '—'}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{relativeTime(prestataire.created_at)}</span>
            </div>
          ))}
          {!loading && aValider.length === 0 && (
            <p className="text-sm text-gray-500 py-6 text-center">Aucun prestataire en attente de validation.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
