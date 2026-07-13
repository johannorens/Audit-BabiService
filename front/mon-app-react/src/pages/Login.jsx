import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiLogin } from '../services/api'

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

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#FBBF24">
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M18.1711 8.36791H9.99106V11.8189H14.7011C14.2811 13.9889 12.4111 15.2689 9.99106 15.2689C7.14106 15.2689 4.85106 13.0089 4.85106 10.0689C4.85106 7.12891 7.14106 4.86891 9.99106 4.86891C11.2511 4.86891 12.3911 5.32891 13.2711 6.07891L15.8511 3.49891C14.2711 2.07891 12.2411 1.21891 9.99106 1.21891C5.16106 1.21891 1.25106 5.12891 1.25106 9.95891C1.25106 14.7889 5.16106 18.6989 9.99106 18.6989C14.3411 18.6989 18.4011 15.5689 18.4011 9.95891C18.4011 9.41891 18.3411 8.88891 18.1711 8.36791Z" fill="currentColor"/>
  </svg>
)

const checklist = [
  '2 400+ prestataires vérifiés',
  'Paiement Mobile Money sécurisé',
  'Réservation en 2 clics'
]

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', mot_de_passe: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { ok, data } = await apiLogin(form)
    if (!ok) {
      setError(data.message || 'Identifiants incorrects.')
      setLoading(false)
      return
    }
    localStorage.setItem('token', data.token)
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
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
            Content de vous revoir
          </h2>
          <p className="text-gray-500 mb-6">
            Connectez-vous pour gérer vos réservations.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
            )}
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
              <label className="block text-sm font-semibold text-babi-dark mb-1.5">Mot de passe</label>
              <input
                type="password"
                name="mot_de_passe"
                value={form.mot_de_passe}
                onChange={handleChange}
                placeholder="········"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-babi-green transition-colors bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-babi-green to-babi-green-light text-white font-bold py-3.5 rounded-2xl hover:-translate-y-1 hover:shadow-xl transition-all mt-2 disabled:opacity-60 disabled:hover:-translate-y-0"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-babi-dark font-semibold py-3.5 rounded-2xl hover:border-babi-green transition-colors">
            <GoogleIcon />
            Continuer avec Google
          </button>

          <p className="text-center text-gray-500 mt-6">
            Pas encore de compte ? <Link to="/inscription" className="text-babi-green font-semibold hover:underline">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
