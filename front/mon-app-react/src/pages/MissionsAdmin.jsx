import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiGetAdminMissions } from '../services/api'

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

function formatMontant(value) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} F`
}

const statutStyles = {
  en_attente: 'bg-amber-50 text-amber-700',
  confirmee:  'bg-emerald-50 text-emerald-700',
  annulee:    'bg-rose-50 text-rose-700',
  terminee:   'bg-sky-50 text-sky-700',
}

const statutLabels = {
  en_attente: 'en attente',
  confirmee:  'confirmée',
  annulee:    'annulée',
  terminee:   'terminée',
}

function MissionsAdmin() {
  const [missions, setMissions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')

  useEffect(() => {
    apiGetAdminMissions().then((res) => {
      if (res.ok) setMissions(Array.isArray(res.data) ? res.data : res.data.data ?? [])
      setLoading(false)
    })
  }, [])

  const filtered = missions.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      m.service?.toLowerCase().includes(q) ||
      m.client?.toLowerCase().includes(q) ||
      m.prestataire?.toLowerCase().includes(q)
    const matchStatut = filterStatut === 'tous' || m.statut === filterStatut
    return matchSearch && matchStatut
  })

  const statuts = ['tous', 'en_attente', 'confirmee', 'terminee', 'annulee']

  return (
    <AdminLayout
      active="Missions"
      title="Missions"
      subtitle="Suivi de toutes les réservations de la plateforme"
      headerActions={
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333Z" stroke="#9CA3AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 14L11.1333 11.1333" stroke="#9CA3AF" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-700 w-40"
          />
        </div>
      }
    >
      {/* Onglets statut */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {statuts.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatut(s)}
            className={`text-sm px-4 py-1.5 rounded-full font-semibold transition border ${
              filterStatut === s
                ? 'bg-babi-dark text-white border-babi-dark'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {s === 'tous' ? 'Toutes' : statutLabels[s]}
            <span className="ml-1.5 opacity-60 text-xs">
              {s === 'tous'
                ? missions.length
                : missions.filter((m) => m.statut === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="font-semibold pb-3 pr-4">#</th>
                <th className="font-semibold pb-3 pr-4">Service</th>
                <th className="font-semibold pb-3 pr-4">Client</th>
                <th className="font-semibold pb-3 pr-4">Prestataire</th>
                <th className="font-semibold pb-3 pr-4">Date</th>
                <th className="font-semibold pb-3 pr-4">Montant</th>
                <th className="font-semibold pb-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-t border-gray-100">
                  <td className="py-3 pr-4 text-gray-400 font-mono text-xs">#{m.id}</td>
                  <td className="py-3 pr-4 font-semibold text-babi-dark">{m.service}</td>
                  <td className="py-3 pr-4 text-gray-500">{m.client}</td>
                  <td className="py-3 pr-4 text-gray-500">{m.prestataire}</td>
                  <td className="py-3 pr-4 text-gray-500">{relativeTime(m.date)}</td>
                  <td className="py-3 pr-4 font-semibold text-babi-dark">{formatMontant(m.montant)}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statutStyles[m.statut] ?? 'bg-gray-50 text-gray-600'}`}>
                      {statutLabels[m.statut] ?? m.statut}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Aucune mission trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default MissionsAdmin