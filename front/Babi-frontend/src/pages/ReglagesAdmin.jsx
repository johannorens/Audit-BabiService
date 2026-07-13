import { useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { apiGetMe, apiUpdateProfil, apiChangePassword } from '../services/api'

function ReglagesAdmin() {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('profil')

  const [profil, setProfil] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '' })
  const [savingProfil, setSavingProfil]   = useState(false)
  const [successProfil, setSuccessProfil] = useState('')
  const [errorProfil, setErrorProfil]     = useState('')

  const [password, setPassword] = useState({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', nouveau_mot_de_passe_confirmation: '' })
  const [savingPassword, setSavingPassword]   = useState(false)
  const [successPassword, setSuccessPassword] = useState('')
  const [errorPassword, setErrorPassword]     = useState('')

  useEffect(() => {
    apiGetMe().then((res) => {
      if (res.ok) {
        setUser(res.data)
        setProfil({
          nom:       res.data.nom       ?? '',
          prenom:    res.data.prenom    ?? '',
          email:     res.data.email     ?? '',
          telephone: res.data.telephone ?? '',
          adresse:   res.data.adresse   ?? '',
        })
      }
      setLoading(false)
    })
  }, [])

  async function handleSaveProfil(e) {
    e.preventDefault()
    setErrorProfil('')
    setSuccessProfil('')
    setSavingProfil(true)
    const res = await apiUpdateProfil(profil)
    setSavingProfil(false)
    if (res.ok) {
      setUser(res.data.user)
      setSuccessProfil('Profil mis à jour avec succès.')
      setTimeout(() => setSuccessProfil(''), 3000)
    } else {
      setErrorProfil(res.data?.message ?? 'Une erreur est survenue.')
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setErrorPassword('')
    setSuccessPassword('')
    setSavingPassword(true)
    const res = await apiChangePassword(password)
    setSavingPassword(false)
    if (res.ok) {
      setPassword({ ancien_mot_de_passe: '', nouveau_mot_de_passe: '', nouveau_mot_de_passe_confirmation: '' })
      setSuccessPassword('Mot de passe modifié avec succès.')
      setTimeout(() => setSuccessPassword(''), 3000)
    } else {
      setErrorPassword(res.data?.message ?? 'Une erreur est survenue.')
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-babi-green transition-colors text-sm'
  const labelCls = 'block text-sm font-semibold text-babi-dark mb-1.5'

  return (
    <AdminLayout
      active="Réglages"
      title="Réglages"
      subtitle="Gérer votre profil administrateur"
    >
      <div className="flex gap-6">
        {/* Onglets latéraux */}
        <div className="w-44 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-1">
            {[
              { key: 'profil',   label: 'Mon profil' },
              { key: 'securite', label: 'Sécurité' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`w-full text-left text-sm px-4 py-2.5 rounded-xl font-semibold transition ${
                  tab === t.key
                    ? 'bg-babi-green text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1">
          {tab === 'profil' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
                  {(user?.prenom?.[0] ?? '').toUpperCase()}{(user?.nom?.[0] ?? '').toUpperCase()}
                </div>
                <div>
                  <p className="font-extrabold text-babi-dark font-bricolage">{user?.prenom} {user?.nom}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 mt-1 inline-block">
                    {user?.role}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-11 rounded-xl animate-pulse bg-gray-100" />
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSaveProfil} className="flex flex-col gap-4">
                  {successProfil && (
                    <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                      ✓ {successProfil}
                    </p>
                  )}
                  {errorProfil && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                      {errorProfil}
                    </p>
                  )}

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className={labelCls}>Prénom</label>
                      <input type="text" className={inputCls} value={profil.prenom}
                        onChange={(e) => setProfil({ ...profil, prenom: e.target.value })} required />
                    </div>
                    <div className="flex-1">
                      <label className={labelCls}>Nom</label>
                      <input type="text" className={inputCls} value={profil.nom}
                        onChange={(e) => setProfil({ ...profil, nom: e.target.value })} required />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" className={inputCls} value={profil.email}
                      onChange={(e) => setProfil({ ...profil, email: e.target.value })} required />
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
                    <button type="submit" disabled={savingProfil}
                      className="bg-babi-green text-white font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60">
                      {savingProfil ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {tab === 'securite' && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-babi-dark mb-5">Changer le mot de passe</h2>

              <form onSubmit={handleChangePassword} className="flex flex-col gap-4 max-w-md">
                {successPassword && (
                  <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                    ✓ {successPassword}
                  </p>
                )}
                {errorPassword && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                    {errorPassword}
                  </p>
                )}

                <div>
                  <label className={labelCls}>Ancien mot de passe</label>
                  <input type="password" className={inputCls} placeholder="••••••••"
                    value={password.ancien_mot_de_passe}
                    onChange={(e) => setPassword({ ...password, ancien_mot_de_passe: e.target.value })} required />
                </div>

                <div>
                  <label className={labelCls}>Nouveau mot de passe</label>
                  <input type="password" className={inputCls} placeholder="••••••••"
                    value={password.nouveau_mot_de_passe}
                    onChange={(e) => setPassword({ ...password, nouveau_mot_de_passe: e.target.value })} required minLength={8} />
                </div>

                <div>
                  <label className={labelCls}>Confirmer le nouveau mot de passe</label>
                  <input type="password" className={inputCls} placeholder="••••••••"
                    value={password.nouveau_mot_de_passe_confirmation}
                    onChange={(e) => setPassword({ ...password, nouveau_mot_de_passe_confirmation: e.target.value })} required />
                </div>

                <div className="flex justify-end mt-2">
                  <button type="submit" disabled={savingPassword}
                    className="bg-babi-green text-white font-semibold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60">
                    {savingPassword ? 'Modification...' : 'Changer le mot de passe'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default ReglagesAdmin