import { Link } from 'react-router-dom'
import {
  CalendarIcon, ClockIcon, CheckCircleIcon, WalletIcon,
   PhoneIcon, PinIcon, MoneyIcon,
  initials, formatMontant, formatDateHeure,
  avatarBg, statutLabels, statutStyles,
} from './shared'

export default function VueApercu({ user, reservations, recommandes, loading }) {
  const aVenir      = reservations.filter((r) => ['en_attente', 'confirmee'].includes(r.statut))
  const terminees   = reservations.filter((r) => r.statut === 'terminee')
  const moisCourant = new Date().getMonth()
  const anneeCourante = new Date().getFullYear()
  const depenseCeMois = terminees
    .filter((r) => {
      const d = new Date(r.date_reservation)
      return d.getMonth() === moisCourant && d.getFullYear() === anneeCourante
    })
    .reduce((total, r) => total + Number(r.service?.tarif ?? 0), 0)

  const prochaine     = [...aVenir].sort((a, b) => new Date(a.date_reservation) - new Date(b.date_reservation))[0]
  const activiteRecente = reservations.slice(0, 5)

  const stats = [
    { icon: <ClockIcon />,       iconBg: 'bg-sky-50',     value: String(aVenir.length),       label: 'Réservations à venir' },
    { icon: <CheckCircleIcon />, iconBg: 'bg-emerald-50', value: String(terminees.length),     label: 'Missions terminées' },
    { icon: <CalendarIcon />,    iconBg: 'bg-violet-50',  value: String(reservations.length),  label: 'Total réservations' },
    { icon: <WalletIcon />,      iconBg: 'bg-amber-50',   value: formatMontant(depenseCeMois), label: 'Dépensé ce mois' },
  ]

  return (
    <>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-babi-dark font-bricolage">
            Bonjour, {user?.prenom ?? '...'} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Voici un aperçu de votre activité.</p>
        </div>
        <Link
          to="/services"
          className="bg-babi-green text-white px-5 py-3 rounded-full font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <span className="text-lg leading-none">+</span> Nouvelle réservation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
            <span className={`inline-flex p-2.5 rounded-xl mb-3 ${stat.iconBg}`}>{stat.icon}</span>
            <p className="text-xl md:text-2xl font-extrabold text-babi-dark font-bricolage">{loading ? '…' : stat.value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Prochaine réservation + Recommandés */}
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Prochaine réservation */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-babi-dark">Prochaine réservation</h2>
            {prochaine && (
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statutStyles[prochaine.statut]}`}>
                {statutLabels[prochaine.statut]}
              </span>
            )}
          </div>

          {prochaine ? (
            <>
              <div className="flex items-center gap-4 mb-5">
                <span className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${avatarBg(0)}`}>
                  {initials(prochaine.service?.prestataire?.prenom, prochaine.service?.prestataire?.nom)}
                </span>
                <div>
                  <p className="font-semibold text-babi-dark">
                    {prochaine.service?.prestataire?.prenom} {prochaine.service?.prestataire?.nom}
                  </p>
                  <p className="text-sm text-gray-500">{prochaine.service?.nom_service}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm text-gray-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon /> {formatDateHeure(prochaine.date_reservation, prochaine.heure_reservation)}
                </span>
                {prochaine.service?.prestataire?.localisation && (
                  <span className="flex items-center gap-1.5">
                    <PinIcon /> {prochaine.service.prestataire.localisation}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <MoneyIcon /> {formatMontant(prochaine.service?.tarif)}
                </span>
              </div>

              <div className="flex items-center gap-3">

                {prochaine.service?.prestataire?.telephone ? (
                  <a
                    href={`tel:${prochaine.service.prestataire.telephone}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-babi-green text-white font-semibold py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all text-sm"
                  >
                    <PhoneIcon /> Appeler
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-semibold py-3 rounded-xl cursor-not-allowed text-sm"
                  >
                    <PhoneIcon /> Numéro indisponible
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-3">{loading ? 'Chargement...' : 'Aucune réservation à venir.'}</p>
              {!loading && (
                <Link to="/services" className="text-sm font-semibold text-babi-green hover:underline">
                  Trouver un prestataire →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recommandés */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
          <h2 className="font-bold text-babi-dark mb-5">Recommandés pour vous</h2>
          <div className="flex flex-col gap-4">
            {recommandes.map((service, i) => (
              <div key={service.id_service} className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarBg(i)}`}>
                  {initials(service.prestataire?.prenom, service.prestataire?.nom)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-babi-dark text-sm truncate">
                    {service.prestataire?.prenom} {service.prestataire?.nom}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{service.nom_service}</p>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-babi-dark shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="#FBBF24">
                    <path d="M8 1.33301L9.92667 5.55301L14.6667 6.22634L11.3333 9.42634L12.16 14.0997L8 11.873L3.84 14.0997L4.66667 9.42634L1.33333 6.22634L6.07333 5.55301L8 1.33301Z"/>
                  </svg>
                  {service.prestataire?.note_moyenne ?? '—'}
                </span>
              </div>
            ))}
            {!loading && recommandes.length === 0 && (
              <p className="text-sm text-gray-500">Aucune recommandation.</p>
            )}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100">
        <h2 className="font-bold text-babi-dark mb-5">Activité récente</h2>
        <div className="overflow-x-auto -mx-5 md:mx-0 px-5 md:px-0">
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="font-semibold pb-3 pr-4">Réf.</th>
                <th className="font-semibold pb-3 pr-4">Prestataire</th>
                <th className="font-semibold pb-3 pr-4">Service</th>
                <th className="font-semibold pb-3 pr-4">Date</th>
                <th className="font-semibold pb-3 pr-4">Statut</th>
                <th className="font-semibold pb-3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {activiteRecente.map((r, i) => (
                <tr key={r.id_reservation} className="border-t border-gray-100">
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">BK-{String(r.id_reservation).padStart(4, '0')}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarBg(i)}`}>
                        {initials(r.service?.prestataire?.prenom, r.service?.prestataire?.nom)}
                      </span>
                      <span className="font-semibold text-babi-dark whitespace-nowrap">
                        {r.service?.prestataire?.prenom} {r.service?.prestataire?.nom}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{r.service?.nom_service}</td>
                  <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{formatDateHeure(r.date_reservation, r.heure_reservation)}</td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${statutStyles[r.statut]}`}>
                      {statutLabels[r.statut]}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-babi-dark whitespace-nowrap">{formatMontant(r.service?.tarif)}</td>
                </tr>
              ))}
              {!loading && activiteRecente.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">Aucune réservation.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}