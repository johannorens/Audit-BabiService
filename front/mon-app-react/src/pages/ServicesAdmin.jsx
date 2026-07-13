import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import {
  API_URL,
  apiGetServices,
  apiGetPrestataires,
  apiGetCategories,
  apiCreateService,
  apiUpdateService,
  apiDeleteService,
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

const emptyForm = { nom_service: '', description: '', tarif: '', disponibilite: true, id_prestataire: '', id_categorie: '' }

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

function formatMontant(value) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} F`
}

function ServicesAdmin() {
  const [services, setServices] = useState([])
  const [prestataires, setPrestataires] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')

  useEffect(() => {
    Promise.all([apiGetServices(), apiGetPrestataires(), apiGetCategories()]).then(
      ([servicesRes, prestatairesRes, categoriesRes]) => {
        if (servicesRes.ok) setServices(servicesRes.data)
        if (prestatairesRes.ok) setPrestataires(prestatairesRes.data)
        if (categoriesRes.ok) setCategories(categoriesRes.data)
        setLoading(false)
      }
    )
  }, [])

  function openCreateModal() {
    setEditingId(null)
    setForm(emptyForm)
    setPhotoFile(null)
    setPhotoPreview('')
    setError('')
    setModalOpen(true)
  }

  function openEditModal(service) {
    setEditingId(service.id_service)
    setForm({
      nom_service: service.nom_service,
      description: service.description ?? '',
      tarif: service.tarif,
      disponibilite: Boolean(service.disponibilite),
      id_prestataire: service.id_prestataire,
      id_categorie: service.id_categorie,
    })
    setPhotoFile(null)
    setPhotoPreview(service.photo_path ? (service.photo_path.startsWith('http') ? service.photo_path : `${API_URL}${service.photo_path}`) : '')
    setError('')
    setModalOpen(true)
  }

  function handleChange(e) {
    const { name, type, checked, value } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const formData = new FormData()
    formData.append('nom_service', form.nom_service)
    formData.append('description', form.description ?? '')
    formData.append('tarif', String(form.tarif))
    formData.append('disponibilite', form.disponibilite ? '1' : '0')
    formData.append('id_prestataire', String(form.id_prestataire))
    formData.append('id_categorie', String(form.id_categorie))

    if (photoFile) {
      formData.append('photo', photoFile)
    }

    const { ok, data } = editingId
      ? await apiUpdateService(editingId, formData)
      : await apiCreateService(formData)

    setSaving(false)

    if (!ok) {
      setError(data.message || 'Une erreur est survenue.')
      return
    }

    if (editingId) {
      setServices((prev) => prev.map((s) => (s.id_service === editingId ? data : s)))
    } else {
      setServices((prev) => [data, ...prev])
    }
    setModalOpen(false)
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer cette annonce ?')) return
    const res = await apiDeleteService(id)
    if (res.ok) {
      setServices((prev) => prev.filter((s) => s.id_service !== id))
    }
  }

  return (
    <AdminLayout
      active="Services"
      title="Services"
      subtitle="Gérer les annonces proposées par les prestataires"
      headerActions={
        <button
          onClick={openCreateModal}
          className="bg-babi-green text-white px-5 py-2.5 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <PlusIcon /> Ajouter une annonce
        </button>
      }
    >
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="font-semibold pb-3 pr-4">Annonce</th>
                <th className="font-semibold pb-3 pr-4">Prestataire</th>
                <th className="font-semibold pb-3 pr-4">Catégorie</th>
                <th className="font-semibold pb-3 pr-4">Tarif</th>
                <th className="font-semibold pb-3 pr-4">Disponible</th>
                <th className="font-semibold pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id_service} className="border-t border-gray-100">
                  <td className="py-3 pr-4 font-semibold text-babi-dark">{service.nom_service}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-violet-200 text-violet-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {initials(service.prestataire?.prenom, service.prestataire?.nom)}
                      </span>
                      <span className="text-gray-600">{service.prestataire?.prenom} {service.prestataire?.nom}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{service.categorie?.nom_categorie ?? '—'}</td>
                  <td className="py-3 pr-4 text-gray-500">{formatMontant(service.tarif)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${service.disponibilite ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {service.disponibilite ? 'oui' : 'non'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="w-8 h-8 rounded-lg bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id_service)}
                        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && services.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Aucune annonce pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-3">
              <h2 className="text-xl font-extrabold text-babi-dark font-bricolage">
                {editingId ? "Modifier l'annonce" : 'Ajouter une annonce'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-6 flex flex-col gap-4">
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

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Prestataire</label>
                <select
                  name="id_prestataire"
                  value={form.id_prestataire}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors bg-white"
                >
                  <option value="" disabled>Choisir un prestataire</option>
                  {prestataires.map((prestataire) => (
                    <option key={prestataire.id_prestataire} value={prestataire.id_prestataire}>
                      {prestataire.prenom} {prestataire.nom}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Photo de la prestation</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors bg-white"
                />
                {photoPreview && (
                  <div className="mt-2">
                    <img src={photoPreview} alt="Aperçu de la prestation" className="h-28 w-full object-cover rounded-xl border border-gray-100" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Disponibilité</label>
                <select
                  name="disponibilite"
                  value={String(form.disponibilite)}
                  onChange={(e) => setForm({ ...form, disponibilite: e.target.value === 'true' })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors bg-white"
                >
                  <option value="true">Oui, disponible</option>
                  <option value="false">Non, indisponible</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-2 sticky bottom-0 bg-white pt-2">
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

export default ServicesAdmin
