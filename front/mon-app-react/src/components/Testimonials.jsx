const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#FBBF24">
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

const testimonials = [
  {
    text: "J'ai trouvé une coiffeuse en 5 minutes pour un mariage. Elle est venue à l'heure, travail impeccable. Babi Services m'a sauvée !",
    avatarColor: 'bg-emerald-100 text-emerald-700',
    initials: 'CA',
    name: 'Christelle A.',
    role: 'Cliente · Cocody'
  },
  {
    text: 'Plombier appelé à 21h pour une fuite, intervention en 40 minutes. Le paiement Mobile Money est super pratique.',
    avatarColor: 'bg-amber-100 text-amber-700',
    initials: 'MD',
    name: 'Moussa D.',
    role: 'Client · Marcory'
  },
  {
    text: "Depuis que je suis sur la plateforme, j'ai doublé ma clientèle. Les notifications de demandes arrivent direct sur mon téléphone.",
    avatarColor: 'bg-blue-100 text-blue-700',
    initials: 'AK',
    name: 'Aya K.',
    role: 'Prestataire · Couturière'
  }
]

function Testimonials() {
  return (
    <section className="py-16 px-8 bg-babi-cream">
      <div className="max-w-7xl mx-auto text-center">
        <span className="text-xs font-bold text-babi-green uppercase tracking-wider relative pl-10 inline-block mb-4">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-babi-green to-babi-green-light rounded"></span>
          ILS NOUS FONT CONFIANCE
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-babi-dark mb-8 font-bricolage">
          Plus de 18 000 missions réussies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${testimonial.avatarColor}`}>
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-bold text-babi-dark text-sm">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
