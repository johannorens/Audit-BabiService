const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M13.3333 2.5H11.6667C10.3406 2.5 9.0688 3.02678 8.11859 3.96447C7.16839 4.90215 6.66667 6.15942 6.66667 7.5V9.16667H5V12.5H6.66667V17.5H10V12.5H11.6667L12.5 9.16667H10V7.5C10 7.05797 10.1756 6.63405 10.4882 6.32149C10.8008 6.00893 11.2246 5.83333 11.6667 5.83333H13.3333V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <rect x="2.5" y="2.5" width="15" height="15" rx="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M13.3333 9.49967C13.4216 10.1135 13.3179 10.7396 13.0359 11.2918C12.7539 11.844 12.307 12.297 11.7568 12.5912C11.2067 12.8854 10.5803 13.0073 9.96 12.9412C9.3397 12.875 8.75356 12.6238 8.27928 12.2196C7.80501 11.8154 7.46396 11.2778 7.30002 10.6738C7.13608 10.0698 7.15724 9.42993 7.36077 8.83792C7.5643 8.24591 7.94054 7.73277 8.44089 7.36974C8.94123 7.00672 9.5429 6.81059 10.1666 6.80967C10.7843 6.81206 11.3786 7.02103 11.8676 7.39903C12.3567 7.77703 12.7172 8.30437 12.8944 8.89967" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1667 5.83301H14.175" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M18.3333 1.66699L9.16667 10.8337M18.3333 1.66699L12.5 18.3337L9.16667 10.8337M18.3333 1.66699L1.66667 7.50033L9.16667 10.8337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

import { Link } from 'react-router-dom'

const footerColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Plomberie', to: '/services?search=plomberie' },
      { label: 'Ménage', to: '/services?search=menage' },
      { label: 'Coiffure & Beauté', to: '/services?search=coiffure' },
      { label: 'Climatisation', to: '/services?search=climatisation' },
      { label: 'Voir tout', to: '/services' }
    ]
  },
  {
    title: 'Babi Services',
    links: [
      { label: 'À propos', to: '/' },
      { label: 'Comment ça marche', to: '/#how-it-works' },
      { label: 'Devenir prestataire', to: '/devenir-prestataire' },
      { label: 'Tarifs', to: '/services' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: "Centre d'aide", to: '/services' },
      { label: 'Nous contacter', to: '/devenir-prestataire' },
      { label: 'Sécurité', to: '/services' },
      { label: 'Conditions', to: '/services' }
    ]
  }
]

const paymentMethods = ['Orange Money', 'MTN MoMo', 'Wave', 'Espèces']

function Footer() {
  return (
    <footer className="bg-babi-dark py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10 pb-8 border-b border-white/10">
          <div className="flex-1 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-babi-green to-babi-green-light rounded-full"></div>
              <span className="text-xl font-extrabold font-bricolage">
                <span className="text-white">babi</span> <span className="text-babi-green">services</span>
              </span>
            </div>
            <p className="text-white/50 mb-4">
              La plateforme qui relie les Abidjanais aux meilleurs prestataires de services, près de chez eux.
            </p>
            <div className="flex items-center gap-3">
              <a href="" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-babi-green rounded-lg text-white transition-colors">
                <FacebookIcon />
              </a>
              <a href="" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-babi-green rounded-lg text-white transition-colors">
                <InstagramIcon />
              </a>
              <a href="" target="_blank" rel="noreferrer" className="w-9 h-9 flex items-center justify-center bg-white/10 hover:bg-babi-green rounded-lg text-white transition-colors">
                <SendIcon />
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 flex-1 justify-end">
            {footerColumns.map((column, index) => (
              <div key={index} className="flex flex-col gap-3">
                <h4 className="text-white font-bold mb-1">{column.title}</h4>
                {column.links.map((link, i) => (
                  <Link key={i} to={link.to} className="text-white/50 hover:text-babi-green transition-colors">{link.label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 Babi Services — Abidjan, Côte d'Ivoire 🇨🇮</p>
          <div className="flex items-center gap-2">
            <span>Paiements :</span>
            {paymentMethods.map((method, index) => (
              <span key={index} className="bg-white/10 px-3 py-1 rounded-full text-white/60 text-xs">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
