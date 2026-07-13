const VerifiedBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 10L9.16667 11.6667L12.5 8.33333M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 6.66667H4.16667C3.24619 6.66667 2.5 7.41286 2.5 8.33333V15C2.5 15.9205 3.24619 16.6667 4.16667 16.6667H17.5C18.4205 16.6667 19.1667 15.9205 19.1667 15V8.33333C19.1667 7.41286 18.4205 6.66667 17.5 6.66667Z" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1667 3.33333L4.16667 6.66667" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12.5H15.0083" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 5V10L13.3333 11.6667" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 9.16667C17.5031 10.2474 17.2516 11.3141 16.7667 12.2833C16.1925 13.4501 15.2944 14.4316 14.1822 15.1056C13.07 15.7796 11.7905 16.1188 10.4917 16.0833C9.41087 16.0865 8.34418 15.835 7.375 15.35L2.5 16.6667L3.81667 11.7917C3.33165 10.8225 3.08019 9.75582 3.08333 8.675C3.04781 7.37615 3.38704 6.09665 4.06103 4.98444C4.73502 3.87224 5.71653 2.97414 6.88333 2.4C7.85249 1.91512 8.91924 1.66359 10 1.66667H10.4167C12.1217 1.75636 13.7345 2.46491 14.9404 3.6608C16.1462 4.85669 16.8548 6.46951 16.9444 8.175L17.5 9.16667Z" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const benefits = [
  {
    icon: <VerifiedBadgeIcon />,
    title: 'Prestataires vérifiés',
    description: "Pièce d'identité et compétences contrôlées avant validation."
  },
  {
    icon: <WalletIcon />,
    title: 'Paiement Mobile Money',
    description: 'Orange Money, MTN, Wave ou espèces — au choix, sécurisé.'
  },
  {
    icon: <ClockIcon />,
    title: 'Réponse rapide',
    description: 'La majorité des demandes sont acceptées en moins de 30 minutes.'
  },
  {
    icon: <ChatIcon />,
    title: 'Messagerie intégrée',
    description: "Échangez, partagez photos et adresse directement dans l'app."
  }
]

function TrustSection() {
  return (
    <section className="py-16 px-8 bg-babi-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 w-full">
            <span className="text-xs font-bold text-babi-green uppercase tracking-wider relative pl-10 inline-block mb-4">
              POURQUOI BABI SERVICES
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-babi-green to-babi-green-light rounded"></span>
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-babi-dark mb-8 font-bricolage leading-tight">
              La tranquillité d'esprit,<br />
              à chaque mission.
            </h2>

            <div className="flex flex-col gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <span className="bg-emerald-100 p-3 rounded-xl shrink-0 flex items-center justify-center">
                    {benefit.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-babi-dark mb-1">{benefit.title}</h3>
                    <p className="text-gray-500">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full relative">
            <div className="bg-emerald-50 rounded-3xl h-[450px] flex items-center justify-center">
              <span className="bg-white text-emerald-300 text-sm font-mono px-4 py-2 rounded-lg">
                photo : client satisfait + prestataire
              </span>
            </div>
            <div className="absolute -bottom-6 right-6 bg-white rounded-2xl shadow-xl p-6 text-center">
              <p className="text-3xl font-extrabold text-babi-green font-bricolage">30 min</p>
              <p className="text-gray-500 text-sm mt-1">délai moyen de réponse</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrustSection
