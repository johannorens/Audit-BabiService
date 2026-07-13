import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { apiGetCategories, apiCandidaterPrestataire } from '../services/api'

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const checklist = [
  "Inscription gratuite, validée sous 24h",
  "Recevez des demandes près de chez vous",
  "Payé en Mobile Money, sans tracas",
]

const emptyForm = { prenom: '', nom: '', email: '', telephone: '', localisation: '', id_categorie: '' }

function DevenirPrestataire() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    apiGetCategories().then((res) => {
      if (res.ok) setCategories(res.data)
    })
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { ok, data } = await apiCandidaterPrestataire(form)
    setLoading(false)
    if (!ok) {
      setError(data.message || 'Impossible d\'envoyer votre candidature, vérifiez vos informations.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 bg-babi-cream">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-babi-green transition-colors mb-6">
            ← Accueil
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold text-babi-dark font-bricolage mb-3">
            Devenez prestataire Babi
          </h1>
          <p className="text-gray-600 mb-8 max-w-xl">
            Remplissez ce formulaire, notre équipe valide votre profil sous 24h et vous contacte pour la suite.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <CheckIcon />
                </span>
                <span className="text-sm text-babi-dark font-medium">{item}</span>
              </div>
            ))}
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <p className="text-2xl mb-3">🎉</p>
              <h2 className="text-xl font-bold text-babi-dark font-bricolage mb-2">Candidature envoyée !</h2>
              <p className="text-gray-600 mb-6">
                On revient vers vous par email ou téléphone sous 24h une fois votre profil validé.
              </p>
              <Link to="/" className="inline-block bg-babi-green text-white px-6 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all">
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 flex flex-col gap-4">
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
                    placeholder="Awa"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-babi-dark mb-1.5">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    placeholder="Koné"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors"
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
                  placeholder="awa@example.com"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Quartier</label>
                <input
                  type="text"
                  name="localisation"
                  value={form.localisation}
                  onChange={handleChange}
                  placeholder="Cocody"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-babi-dark mb-1.5">Catégorie de service</label>
                <select
                  name="id_categorie"
                  value={form.id_categorie}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
                >
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories.map((categorie) => (
                    <option key={categorie.id_categorie} value={categorie.id_categorie}>
                      {categorie.nom_categorie}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-babi-green to-babi-green-light text-white font-bold py-3.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all mt-2 disabled:opacity-60 disabled:hover:-translate-y-0"
              >
                {loading ? 'Envoi...' : 'Envoyer ma candidature'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DevenirPrestataire
