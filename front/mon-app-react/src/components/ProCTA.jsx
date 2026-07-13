import { Link } from 'react-router-dom'

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M4.16667 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const stats = [
  { value: '+45%', label: 'de revenus en moyenne' },
  { value: '0 F', label: "frais d'inscription" },
  { value: '24h', label: 'pour être validé' }
]

function ProCTA() {
  return (
    <section className="py-16 px-8" id="become-pro">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-babi-green to-babi-green-light rounded-3xl p-10 md:p-12 flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1">
            <span className="text-xs font-bold text-white/80 uppercase tracking-wider relative pl-10 inline-block mb-4">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-white/60 rounded"></span>
              VOUS ÊTES UN PRO ?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-bricolage leading-tight">
              Développez votre<br />activité avec Babi.
            </h2>
            <p className="text-white/90 mb-8 max-w-md leading-relaxed">
              Inscrivez-vous gratuitement, recevez des demandes près de chez vous et soyez payé sans tracas.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/devenir-prestataire" className="inline-flex items-center gap-2 bg-babi-dark text-white px-6 py-3.5 rounded-full font-bold hover:-translate-y-1 hover:shadow-xl transition-all">
                Devenir prestataire
                <ArrowRightIcon />
              </Link>
              <Link to="/services" className="bg-transparent border border-white/40 text-white px-6 py-3.5 rounded-full font-bold hover:bg-white/10 transition-all">
                En savoir plus
              </Link>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 w-full">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/15 backdrop-blur-sm p-5 rounded-2xl">
                <p className="text-3xl font-extrabold text-white font-bricolage">{stat.value}</p>
                <p className="text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProCTA
