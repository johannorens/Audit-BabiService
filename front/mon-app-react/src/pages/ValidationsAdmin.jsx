import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  apiGetAdminDashboard,
  apiValiderPrestataire,
  apiRejeterPrestataire,
  apiCreateService,
} from '../services/api'

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

const emptyForm = { nom_service: '', description: '', tarif: '', disponibilite: true }

function ValidationsAdmin() {
  const [aValider, setAValider] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalPrestataire, setModalPrestataire] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiGetAdminDashboard().then((res) => {
      if (res.ok) setAValider(res.data.a_valider)
      setLoading(false)
    })
  }, [])

  function openModal(prestataire) {
    setModalPrestataire(prestataire)
    setForm(emptyForm)
    setError('')
  }

  function handleChange(e) {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleRejeter(id) {
    const res = await apiRejeterPrestataire(id)
    if (res.ok) {
      setAValider((prev) => prev.filter((p) => p.id_prestataire !== id))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const valider = await apiValiderPrestataire(modalPrestataire.id_prestataire)
    if (!valider.ok) {
      setSaving(false)
      setError('Impossible de valider ce prestataire.')
      return
    }

    const service = await apiCreateService({
      ...form,
      id_prestataire: modalPrestataire.id_prestataire,
      id_categorie: modalPrestataire.id_categorie,
    })
    setSaving(false)

    if (!service.ok) {
      setError(service.data.message || "Le prestataire est validé mais l'annonce n'a pas pu être créée.")
      return
    }

    setAValider((prev) => prev.filter((p) => p.id_prestataire !== modalPrestataire.id_prestataire))
    setModalPrestataire(null)
  }

  return (
    <AdminLayout
      active="Validations"
      title="Validations"
      subtitle="Prestataires en attente : validez leur profil et publiez leur première annonce"
      validationsCount={aValider.length}
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="font-semibold pb-3 pr-4">Prestataire</th>
                <th className="font-semibold pb-3 pr-4">Métier</th>
                <th className="font-semibold pb-3 pr-4">Quartier</th>
                <th className="font-semibold pb-3 pr-4">Contact</th>
                <th className="font-semibold pb-3 pr-4">Demande</th>
                <th className="font-semibold pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {aValider.map((prestataire) => (
                <tr key={prestataire.id_prestataire} className="border-t border-gray-100">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(prestataire.prenom, prestataire.nom)}
                      </span>
                      <span className="font-semibold text-babi-dark">{prestataire.prenom} {prestataire.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{prestataire.categorie?.nom_categorie ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-500">{prestataire.localisation ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-500">{prestataire.telephone ?? prestataire.email}</td>
                  <td className="py-3 pr-4 text-gray-500">{relativeTime(prestataire.created_at)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(prestataire)}
                        className="bg-babi-green text-white text-xs font-semibold px-3 py-2 rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-1.5"
                      >
                        <CheckIcon /> Valider et publier l'annonce
                      </button>
                      <button
                        onClick={() => handleRejeter(prestataire.id_prestataire)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Rejeter"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && aValider.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Aucun prestataire en attente de validation.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalPrestataire && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-extrabold text-babi-dark font-bricolage mb-1">
              Valider {modalPrestataire.prenom} {modalPrestataire.nom}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {modalPrestataire.categorie?.nom_categorie} · {modalPrestataire.localisation ?? '—'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Nom de l'annonce</label>
                <input
                  type="text"
                  name="nom_service"
                  value={form.nom_service}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Tarif (F CFA)</label>
                <input
                  type="number"
                  name="tarif"
                  value={form.tarif}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-babi-dark">
                <input
                  type="checkbox"
                  name="disponibilite"
                  checked={form.disponibilite}
                  onChange={handleChange}
                  className="w-4 h-4 accent-babi-green"
                />
                Disponible immédiatement
              </label>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModalPrestataire(null)}
                  className="flex-1 border border-gray-200 text-babi-dark font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-babi-green text-white font-semibold py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:hover:-translate-y-0"
                >
                  {saving ? 'Publication...' : 'Valider et publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default ValidationsAdmin
