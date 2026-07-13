import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  apiGetCategories,
  apiCreateCategorie,
  apiUpdateCategorie,
  apiDeleteCategorie,
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

const emptyForm = { nom_categorie: '', description: '' }

function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    apiGetCategories().then((res) => {
      if (res.ok) setCategories(res.data)
      setLoading(false)
    })
  }, [])

  function openCreateModal() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setModalOpen(true)
  }

  function openEditModal(categorie) {
    setEditingId(categorie.id_categorie)
    setForm({ nom_categorie: categorie.nom_categorie, description: categorie.description ?? '' })
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
      ? await apiUpdateCategorie(editingId, form)
      : await apiCreateCategorie(form)

    setSaving(false)

    if (!ok) {
      setError(data.message || 'Une erreur est survenue.')
      return
    }

    if (editingId) {
      setCategories((prev) => prev.map((c) => (c.id_categorie === editingId ? data : c)))
    } else {
      setCategories((prev) => [data, ...prev])
    }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    const res = await apiDeleteCategorie(id)
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id_categorie !== id))
    }
  }

  return (
    <AdminLayout
      active="Catégories"
      title="Catégories"
      subtitle="Gérer les catégories de services de la plateforme"
      headerActions={
        <button
          onClick={openCreateModal}
          className="bg-babi-green text-white px-5 py-2.5 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusIcon /> Ajouter une catégorie
        </button>
      }
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="font-semibold pb-3 pr-4">Nom</th>
                <th className="font-semibold pb-3 pr-4">Description</th>
                <th className="font-semibold pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((categorie) => (
                <tr key={categorie.id_categorie} className="border-t border-gray-100">
                  <td className="py-3 pr-4 font-semibold text-babi-dark">{categorie.nom_categorie}</td>
                  <td className="py-3 pr-4 text-gray-500">{categorie.description ?? '—'}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(categorie)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(categorie.id_categorie)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-500">Aucune catégorie pour le moment.</td>
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
              {editingId ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
              )}

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Nom</label>
                <input
                  type="text"
                  name="nom_categorie"
                  value={form.nom_categorie}
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

export default CategoriesAdmin
