import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRegister } from '../services/api'

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M15.8333 10H4.16667M4.16667 10L9.16667 15M4.16667 10L9.16667 5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M16.6667 17.5V15.8333C16.6667 14.0652 15.3334 12.5 13.5652 12.5H6.43478C4.66667 12.5 3.33333 14.0652 3.33333 15.8333V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#FBBF24">
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

const checklist = [
  '2 400+ prestataires vérifiés',
  'Paiement Mobile Money sécurisé',
  'Réservation en 2 clics'
]

function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', mot_de_passe: '', mot_de_passe_confirmation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.mot_de_passe !== form.mot_de_passe_confirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { ok, data } = await apiRegister(form)
    if (!ok) {
      setError(data.message || 'Inscription impossible, vérifiez vos informations.')
      setLoading(false)
      return
    }
    navigate('/connexion')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-gradient-to-br from-babi-green to-babi-green-light p-10 md:p-16 flex flex-col justify-between min-h-[400px] lg:min-h-screen">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
          <span className="text-xl font-extrabold font-bricolage">
            <span className="text-white">babi</span> <span className="text-white/70">services</span>
          </span>
        </div>

        <div className="my-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white font-bricolage leading-tight mb-8">
            Bienvenue sur la 1re plateforme de services d'Abidjan.
          </h1>
          <div className="flex flex-col gap-3">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                  <CheckIcon />
                </span>
                <span className="text-white font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 max-w-sm">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>
          <p className="text-babi-dark mb-4">
            "Trouvé une coiffeuse en 5 minutes pour mon mariage !"
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              CA
            </div>
            <p className="text-gray-500 text-sm">Christelle, Cocody</p>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 bg-babi-cream flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-babi-green transition-colors mb-8">
            <ArrowLeftIcon />
            Accueil
          </Link>

          <h2 className="text-3xl font-extrabold text-babi-dark font-bricolage mb-2">
            Créer un compte
          </h2>
          <p className="text-gray-500 mb-6">
            Rejoignez Babi Services en moins d'une minute.
          </p>

          <button className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-babi-green text-babi-green font-semibold py-3.5 rounded-2xl mb-6">
            <UserIcon />
            Je cherche un service
          </button>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
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
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-babi-dark mb-1.5">Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                value={form.mot_de_passe}
                onChange={handleChange}
                placeholder="········"
                required
                minLength={8}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-babi-dark mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                name="mot_de_passe_confirmation"
                value={form.mot_de_passe_confirmation}
                onChange={handleChange}
                placeholder="········"
                required
                minLength={8}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-babi-green to-babi-green-light text-white font-bold py-3.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all mt-2 disabled:opacity-60 disabled:hover:-translate-y-0"
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Déjà un compte ? <Link to="/connexion" className="text-babi-green font-semibold hover:underline">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp