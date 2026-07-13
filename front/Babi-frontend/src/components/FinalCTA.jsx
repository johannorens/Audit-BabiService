import { Link } from 'react-router-dom'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function FinalCTA() {
  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-babi-dark rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-babi-green/30 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-bricolage">
              Prêt à trouver votre pro ?
            </h2>
            <p className="text-white/70 mb-8">
              Des milliers de prestataires vous attendent, partout à Abidjan.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services" className="inline-flex items-center gap-2 bg-gradient-to-r from-babi-green to-babi-green-light text-white px-8 py-4 rounded-2xl font-bold hover:-translate-y-1 hover:shadow-xl transition-all">
                <SearchIcon />
                Chercher un service
              </Link>
              <Link to="/devenir-prestataire" className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
                Proposer mes services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCTA
