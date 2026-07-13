import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiGetAdminUtilisateurs, apiDeleteUtilisateur, apiDeleteAdminPrestataire } from '../services/api'

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 5H17.5M7.5 5V3.33333C7.5 2.8731 7.8731 2.5 8.33333 2.5H11.6667C12.1269 2.5 12.5 2.8731 12.5 3.33333V5M15.8333 5V16.6667C15.8333 17.1269 15.4602 17.5 15 17.5H5C4.53976 17.5 4.16667 17.1269 4.16667 16.6667V5H15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="#FBBF24">
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
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

const statutStyles = {
  en_attente: 'bg-amber-50 text-amber-700',
  valide:     'bg-emerald-50 text-emerald-700',
  rejete:     'bg-rose-50 text-rose-700',
}

const statutLabels = {
  en_attente: 'en attente',
  valide:     'validé',
  rejete:     'rejeté',
}

function UtilisateursAdmin() {
  const [utilisateurs, setUtilisateurs] = useState([])
  const [prestataires, setPrestataires] = useState([])
  const [loading, setLoading]           = useState(true)
  const [tab, setTab]                   = useState('clients')
  const [search, setSearch]             = useState('')

  useEffect(() => {
    apiGetAdminUtilisateurs().then((res) => {
      if (res.ok) {
        setUtilisateurs(Array.isArray(res.data.utilisateurs) ? res.data.utilisateurs : [])
        setPrestataires(Array.isArray(res.data.prestataires) ? res.data.prestataires : [])
      }
      setLoading(false)
    })
  }, [])

  // Sépare les utilisateurs par rôle
  const clients = utilisateurs.filter((u) => u.role === 'client')
  const admins  = utilisateurs.filter((u) => u.role === 'admin')

  const filterBySearch = (list) => {
    const q = search.toLowerCase()
    return !q ? list : list.filter((u) =>
      u.nom?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  }

  const filterPrestataires = () => {
    const q = search.toLowerCase()
    return !q ? prestataires : prestataires.filter((p) =>
      p.nom?.toLowerCase().includes(q) ||
      p.prenom?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q)
    )
  }

  async function handleDeleteUtilisateur(id) {
    if (!confirm('Supprimer cet utilisateur ?')) return
    const res = await apiDeleteUtilisateur(id)
    if (res.ok) {
      setUtilisateurs((prev) => prev.filter((u) => u.id_utilisateur !== id))
    } else {
      alert(res.data?.message ?? 'Impossible de supprimer cet utilisateur.')
    }
  }

  async function handleDeletePrestataire(id) {
    if (!confirm('Supprimer ce prestataire ?')) return
    const res = await apiDeleteAdminPrestataire(id)
    if (res.ok) {
      setPrestataires((prev) => prev.filter((p) => p.id_prestataire !== id))
    } else {
      alert(res.data?.message ?? 'Impossible de supprimer ce prestataire.')
    }
  }

  const tabs = [
    { key: 'clients',      label: 'Clients',      count: clients.length },
    { key: 'prestataires', label: 'Prestataires',  count: prestataires.length },
    { key: 'admins',       label: 'Admins',        count: admins.length },
  ]

  return (
    <AdminLayout
      active="Utilisateurs"
      title="Utilisateurs"
      subtitle="Gérer tous les comptes inscrits sur la plateforme"
      topbarSearch={
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-700 w-full"
        />
      }
    >
      {/* Onglets */}
      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
              tab === t.key
                ? 'bg-babi-dark text-white border-babi-dark'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {t.label}
            <span className="ml-1.5 opacity-60 text-xs">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">

          {/* ── Clients ── */}
          {tab === 'clients' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                  <th className="font-semibold pb-3 pr-4">Utilisateur</th>
                  <th className="font-semibold pb-3 pr-4">Email</th>
                  <th className="font-semibold pb-3 pr-4">Téléphone</th>
                  <th className="font-semibold pb-3 pr-4">Inscrit</th>
                  <th className="font-semibold pb-3 pr-4">Réservations</th>
                  <th className="font-semibold pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterBySearch(clients).map((u) => (
                  <tr key={u.id_utilisateur} className="border-t border-gray-100">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials(u.prenom, u.nom)}
                        </span>
                        <span className="font-semibold text-babi-dark">{u.prenom} {u.nom}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                    <td className="py-3 pr-4 text-gray-500">{u.telephone ?? '—'}</td>
                    <td className="py-3 pr-4 text-gray-500">{relativeTime(u.created_at)}</td>
                    <td className="py-3 pr-4 font-semibold text-babi-dark">{u.reservations_count ?? 0}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeleteUtilisateur(u.id_utilisateur)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filterBySearch(clients).length === 0 && (
                  <tr><td colSpan={6} className="py-6 text-center text-gray-500">Aucun client trouvé.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Prestataires ── */}
          {tab === 'prestataires' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                  <th className="font-semibold pb-3 pr-4">Prestataire</th>
                  <th className="font-semibold pb-3 pr-4">Catégorie</th>
                  <th className="font-semibold pb-3 pr-4">Quartier</th>
                  <th className="font-semibold pb-3 pr-4">Contact</th>
                  <th className="font-semibold pb-3 pr-4">Note</th>
                  <th className="font-semibold pb-3 pr-4">Statut</th>
                  <th className="font-semibold pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterPrestataires().map((p) => (
                  <tr key={p.id_prestataire} className="border-t border-gray-100">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials(p.prenom, p.nom)}
                        </span>
                        <span className="font-semibold text-babi-dark">{p.prenom} {p.nom}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{p.categorie?.nom_categorie ?? '—'}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.localisation ?? '—'}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.telephone ?? p.email}</td>
                    <td className="py-3 pr-4">
                      <span className="flex items-center gap-1 font-semibold text-babi-dark">
                        <StarIcon /> {p.note_moyenne ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statutStyles[p.statut] ?? 'bg-gray-50 text-gray-500'}`}>
                        {statutLabels[p.statut] ?? p.statut}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleDeletePrestataire(p.id_prestataire)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && filterPrestataires().length === 0 && (
                  <tr><td colSpan={7} className="py-6 text-center text-gray-500">Aucun prestataire trouvé.</td></tr>
                )}
              </tbody>
            </table>
          )}

          {/* ── Admins ── */}
          {tab === 'admins' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                  <th className="font-semibold pb-3 pr-4">Administrateur</th>
                  <th className="font-semibold pb-3 pr-4">Email</th>
                  <th className="font-semibold pb-3 pr-4">Téléphone</th>
                  <th className="font-semibold pb-3 pr-4">Inscrit</th>
                </tr>
              </thead>
              <tbody>
                {filterBySearch(admins).map((u) => (
                  <tr key={u.id_utilisateur} className="border-t border-gray-100">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {initials(u.prenom, u.nom)}
                        </span>
                        <div>
                          <p className="font-semibold text-babi-dark">{u.prenom} {u.nom}</p>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">admin</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                    <td className="py-3 pr-4 text-gray-500">{u.telephone ?? '—'}</td>
                    <td className="py-3 pr-4 text-gray-500">{relativeTime(u.created_at)}</td>
                  </tr>
                ))}
                {!loading && filterBySearch(admins).length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-gray-500">Aucun administrateur trouvé.</td></tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </AdminLayout>
  )
}

export default UtilisateursAdmin