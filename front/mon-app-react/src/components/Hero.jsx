import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const avatars = [
  { initials: 'AT', bg: 'bg-violet-200 text-violet-700' },
  { initials: 'KE', bg: 'bg-amber-200 text-amber-700' },
  { initials: 'MC', bg: 'bg-sky-200 text-sky-700' },
  { initials: 'YA', bg: 'bg-emerald-200 text-emerald-700' },
]

const listings = [
  { initials: 'AT', bg: 'bg-violet-200 text-violet-700', nom: 'Awa Traoré', metier: 'Coiffeuse à domicile · Cocody', note: '4.9' },
  { initials: 'RG', bg: 'bg-emerald-200 text-emerald-700', nom: 'Rose Goré', metier: 'Esthéticienne · Deux-Plateaux', note: '4.9' },
]

function Hero() {
  const navigate = useNavigate()
  const [serviceQuery, setServiceQuery] = useState('')
  const [quartierQuery, setQuartierQuery] = useState('')

  const handleSearch = (event) => {
    event.preventDefault()

    const params = new URLSearchParams()
    const service = serviceQuery.trim()
    const quartier = quartierQuery.trim()

    if (service) params.set('search', service)
    if (quartier) params.set('quartier', quartier)

    navigate(`/services${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="relative py-16 px-8 overflow-hidden bg-babi-cream">
      <div className="absolute -top-24 -right-12 w-96 h-96 bg-gradient-to-br from-emerald-200/50 to-emerald-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-36 -left-24 w-80 h-80 bg-gradient-to-br from-green-200/40 to-green-300/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-8">
            <span className="bg-babi-green text-white text-xs font-bold px-2.5 py-1 rounded-full">Nouveau</span>
            <span className="text-sm text-gray-600">Paiement Mobile Money sécurisé</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-babi-dark mb-4 font-bricolage leading-tight">
            Le bon prestataire,<br />
            <span className="text-babi-green relative inline-block">
              près de chez vous.
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-emerald-200/30 -z-10 rounded"></span>
            </span>
          </h1>

          <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
            Plombiers, coiffeuses, ménagères, traiteurs... Trouvez un pro vérifié, réservez en 2 clics et payez en toute sécurité. Partout à Abidjan.
          </p>

          <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2 mb-8">
            <div className="flex items-center gap-2 px-4 py-3 flex-1">
              <span className="text-lg opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10.6673 13.333V2.66634C10.6673 1.93045 10.0699 1.33301 9.33398 1.33301H6.66732C5.93143 1.33301 5.33398 1.93045 5.33398 2.66634V13.333" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.66732 4H13.334C14.0699 4 14.6673 4.59745 14.6673 5.33333V12C14.6673 12.7359 14.0699 13.3333 13.334 13.3333H2.66732C1.93143 13.3333 1.33398 12.7359 1.33398 12V5.33333C1.33398 4.5975 1.93143 4 2.66732 4V4" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              <input type="text" value={serviceQuery} onChange={(event) => setServiceQuery(event.target.value)} placeholder="Quel service ?" className="bg-transparent border-none outline-none text-gray-700 w-full" />
            </div>
            <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
            <div className="flex items-center gap-2 px-4 py-3 flex-1">
              <span className="text-lg opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clip-path="url(#clip0_69_637)">
                    <path d="M13.3327 6.66634C13.3327 9.99501 9.64002 13.4617 8.40002 14.5323C8.16271 14.7108 7.83599 14.7108 7.59868 14.5323C6.35868 13.4617 2.66602 9.99501 2.66602 6.66634C2.66602 3.72279 5.0558 1.33301 7.99935 1.33301C10.9429 1.33301 13.3327 3.72279 13.3327 6.66634" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M6 6.66699C6 7.77082 6.89617 8.66699 8 8.66699C9.10383 8.66699 10 7.77082 10 6.66699C10 5.56316 9.10383 4.66699 8 4.66699C6.89617 4.66699 6 5.56316 6 6.66699V6.66699" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_69_637">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <input type="text" value={quartierQuery} onChange={(event) => setQuartierQuery(event.target.value)} placeholder="Quel quartier ?" className="bg-transparent border-none outline-none text-gray-700 w-full" />
            </div>
            <button type="submit" className="bg-babi-green text-white px-6 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all flex items-center gap-2 shrink-0">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333V7.33333" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.9995 14.0005L11.1328 11.1338" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
              Rechercher
            </button>
          </form>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((avatar, index) => (
                <span
                  key={index}
                  className={`w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${avatar.bg}`}
                >
                  {avatar.initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-bold text-babi-dark">2 400+ prestataires</span> vérifiés · note moyenne <span className="font-bold text-babi-dark">4,9/5</span>
            </p>
          </div>
        </div>

        <div className="relative">
          <span className="absolute -top-4 left-4 z-20 inline-flex items-center gap-1.5 bg-babi-dark text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.33301L13.3333 3.33301V7.33301C13.3333 10.833 10.6667 13.333 8 14.6663C5.33333 13.333 2.66667 10.833 2.66667 7.33301V3.33301L8 1.33301Z" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Profils vérifiés
          </span>

          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="ml-3 text-xs text-gray-400 font-mono">babi.ci/recherche</span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-50 shrink-0">
                  <path d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333V7.33333" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.9995 14.0005L11.1328 11.1338" stroke="#8A7A6E" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span className="text-sm text-gray-700 flex-1">Coiffeuse · Cocody</span>
                <button type="button" onClick={() => navigate('/services?search=Coiffeuse&quartier=Cocody')} className="bg-babi-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg">Rechercher</button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-babi-green text-white text-xs font-semibold px-3 py-1 rounded-full">Disponible</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">4,5+ ★</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">Vérifié</span>
              </div>

              <div className="flex flex-col gap-3">
                {listings.map((pro, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-xl">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${pro.bg}`}>
                      {pro.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-babi-dark text-sm truncate">{pro.nom}</p>
                      <p className="text-xs text-gray-500 truncate">{pro.metier}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-semibold text-babi-dark shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="#FBBF24">
                        <path d="M8 1.33301L9.92667 5.55301L14.6667 6.22634L11.3333 9.42634L12.16 14.0997L8 11.873L3.84 14.0997L4.66667 9.42634L1.33333 6.22634L6.07333 5.55301L8 1.33301Z"/>
                      </svg>
                      {pro.note}
                    </span>
                    <button type="button" onClick={() => navigate('/services')} className="bg-babi-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0">Réserver</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-4 z-20 bg-white rounded-xl shadow-xl p-3 flex items-center gap-3 max-w-[220px]">
            <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#059669" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold text-babi-dark leading-tight">Réservation confirmée</p>
              <p className="text-xs text-gray-500">Awa T. · demain 10:00</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero