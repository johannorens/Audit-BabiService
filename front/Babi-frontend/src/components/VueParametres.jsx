import { useEffect, useState } from 'react'
import { apiUpdateProfil, apiChangePassword } from '../services/api'
import { initials } from './shared'

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors text-sm'
const labelCls = 'block text-sm font-semibold text-babi-dark mb-1.5'

function OngletProfil({ user, onUserUpdate }) {
  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) setProfil({
      nom: user.nom ?? '', prenom: user.prenom ?? '',
      email: user.email ?? '', telephone: user.telephone ?? '', adresse: user.adresse ?? '',
    })
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    const res = await apiUpdateProfil(profil)
    setSaving(false)
    if (res.ok) {
      onUserUpdate(res.data.user)
      setSuccess('Profil mis à jour avec succès.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(res.data?.message ?? 'Une erreur est survenue.')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg md:text-xl font-bold shrink-0">
          {initials(user?.prenom, user?.nom)}
        </div>
        <div>
          <p className="font-extrabold text-babi-dark font-bricolage">{user?.prenom} {user?.nom}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {success && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">✓ {success}</p>}
        {error   && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className={labelCls}>Prénom</label>
            <input type="text" className={inputCls} required value={profil.prenom}
              onChange={(e) => setProfil({ ...profil, prenom: e.target.value })} />
          </div>
          <div className="flex-1">
            <label className={labelCls}>Nom</label>
            <input type="text" className={inputCls} required value={profil.nom}
              onChange={(e) => setProfil({ ...profil, nom: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <input type="email" className={inputCls} required value={profil.email}
            onChange={(e) => setProfil({ ...profil, email: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Téléphone</label>
          <input type="tel" className={inputCls} value={profil.telephone}
            onChange={(e) => setProfil({ ...profil, telephone: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Adresse</label>
          <input type="text" className={inputCls} value={profil.adresse}
            onChange={(e) => setProfil({ ...profil, adresse: e.target.value })} />
        </div>
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={saving}
            className="bg-babi-green text-white font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 w-full sm:w-auto">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}

function OngletSecurite() {
  const [password, setPassword] = useState({
    ancien_mot_de_passe: '', nouveau_mot_de_passe: '', nouveau_mot_de_passe_confirmation: '',
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setSaving(true)
    const res = await apiChangePassword(password)
    setSaving(false)
    if (res.ok) {
      setPassword({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', nouveau_mot_de_passe_confirmation: '' })
      setSuccess('Mot de passe modifié avec succès.')
      setTimeout(() => setSuccess(''), 3000)
    } else {
      setError(res.data?.message ?? 'Une erreur est survenue.')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
      <h2 className="font-bold text-babi-dark mb-5">Changer le mot de passe</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {success && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">✓ {success}</p>}
        {error   && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>}
        <div>
          <label className={labelCls}>Ancien mot de passe</label>
          <input type="password" className={inputCls} placeholder="••••••••" required
            value={password.ancien_mot_de_passe}
            onChange={(e) => setPassword({ ...password, ancien_mot_de_passe: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Nouveau mot de passe</label>
          <input type="password" className={inputCls} placeholder="••••••••" required minLength={8}
            value={password.nouveau_mot_de_passe}
            onChange={(e) => setPassword({ ...password, nouveau_mot_de_passe: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>Confirmer</label>
          <input type="password" className={inputCls} placeholder="••••••••" required
            value={password.nouveau_mot_de_passe_confirmation}
            onChange={(e) => setPassword({ ...password, nouveau_mot_de_passe_confirmation: e.target.value })} />
        </div>
        <div className="flex justify-end mt-2">
          <button type="submit" disabled={saving}
            className="bg-babi-green text-white font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 w-full sm:w-auto">
            {saving ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  )
}

const TABS = [
  { key: 'profil',   label: 'Mon profil' },
  { key: 'securite', label: 'Sécurité'   },
]

export default function VueParametres({ user, onUserUpdate }) {
  const [tab, setTab] = useState('profil')

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-babi-dark font-bricolage mb-1">Paramètres</h1>
        <p className="text-gray-500 text-sm">Gérez votre compte</p>
      </div>

      {/* Onglets horizontaux sur mobile, vertical sur desktop */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-44 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 flex md:flex-col gap-1">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 md:flex-none text-sm px-4 py-2.5 rounded-xl font-semibold transition text-center md:text-left ${
                  tab === t.key ? 'bg-babi-green text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {tab === 'profil'   && <OngletProfil   user={user} onUserUpdate={onUserUpdate} />}
          {tab === 'securite' && <OngletSecurite />}
        </div>
      </div>
    </>
  )
}