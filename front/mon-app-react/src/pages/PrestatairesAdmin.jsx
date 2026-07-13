import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  apiGetPrestataires,
  apiGetCategories,
  apiCreatePrestataire,
  apiUpdatePrestataire,
  apiDeletePrestataire,
} from '../services/api'

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M10 4.16667V15.8333M4.16667 10H15.8333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M14.1667 2.5L17.5 5.83333L7.08333 16.25L2.5 17.5L3.75 12.9167L14.1667 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

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

const statutStyles = {
  en_attente: 'bg-amber-50 text-amber-700',
  valide: 'bg-emerald-50 text-emerald-700',
  rejete: 'bg-rose-50 text-rose-700',
}

const statutLabels = {
  en_attente: 'en attente',
  valide: 'validé',
  rejete: 'rejeté',
}

const emptyForm = { nom: '', prenom: '', email: '', telephone: '', localisation: '', id_categorie: '' }

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

function PrestatairesAdmin() {
  const [prestataires, setPrestataires] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([apiGetPrestataires(), apiGetCategories()]).then(([prestatairesRes, categoriesRes]) => {
      if (prestatairesRes.ok) setPrestataires(prestatairesRes.data)
      if (categoriesRes.ok) setCategories(categoriesRes.data)
      setLoading(false)
    })
  }, [])

  function openCreateModal() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEditModal(prestataire) {
    setEditingId(prestataire.id_prestataire)
    setForm({
      nom: prestataire.nom,
      prenom: prestataire.prenom,
      email: prestataire.email,
      telephone: prestataire.telephone ?? '',
      localisation: prestataire.localisation ?? '',
      id_categorie: prestataire.id_categorie,
    })
    setError('')
    setModalOpen(true)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const { ok, data } = editingId
      ? await apiUpdatePrestataire(editingId, form)
      : await apiCreatePrestataire(form)

    setSaving(false)

    if (!ok) {
      setError(data.message || 'Une erreur est survenue.')
      return
    }

    if (editingId) {
      setPrestataires((prev) => prev.map((p) => (p.id_prestataire === editingId ? data : p)))
    } else {
      setPrestataires((prev) => [data, ...prev])
    }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce prestataire ?')) return
    const res = await apiDeletePrestataire(id)
    if (res.ok) {
      setPrestataires((prev) => prev.filter((p) => p.id_prestataire !== id))
    }
  }

  return (
    <AdminLayout
      active="Prestataires"
      title="Prestataires"
      subtitle="Gérer les prestataires inscrits sur la plateforme"
      headerActions={
        <button
          onClick={openCreateModal}
          className="bg-babi-green text-white px-5 py-2.5 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusIcon /> Ajouter un prestataire
        </button>
      }
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">
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
              {prestataires.map((prestataire) => (
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
                  <td className="py-3 pr-4">
                    <span className="flex items-center gap-1 text-babi-dark font-semibold">
                      <StarIcon /> {prestataire.note_moyenne ?? '—'}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statutStyles[prestataire.statut]}`}>
                      {statutLabels[prestataire.statut]}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(prestataire)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(prestataire.id_prestataire)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && prestataires.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">Aucun prestataire pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-extrabold text-babi-dark font-bricolage mb-4">
              {editingId ? 'Modifier le prestataire' : 'Ajouter un prestataire'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-babi-dark mb-1.5">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-babi-dark mb-1.5">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Quartier</label>
                <input
                  type="text"
                  name="localisation"
                  value={form.localisation}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Catégorie</label>
                <select
                  name="id_categorie"
                  value={form.id_categorie}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors bg-white"
                >
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id_categorie} value={categorie.id_categorie}>
                      {categorie.nom_categorie}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-200 text-babi-dark font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-babi-green text-white font-semibold py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:hover:-translate-y-0"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default PrestatairesAdmin
