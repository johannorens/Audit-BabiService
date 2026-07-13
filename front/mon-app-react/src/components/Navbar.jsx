import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiGetMe, apiLogout } from '../services/api'

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setLoading(false)
      return
    }
    apiGetMe().then((res) => {
      if (res.ok) setUser(res.data)
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await apiLogout()
    localStorage.removeItem('token')
    setUser(null)
    setIsOpen(false)
    navigate('/')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gradient-to-r from-babi-green to-babi-green-light rounded-full"></div>
          <span className="text-xl font-extrabold text-babi-dark font-bricolage">babi</span>
          <span className="text-xs font-semibold font-hanken text-babi-green uppercase tracking-wider">services</span>
        </Link>
        <div className="hidden md:flex gap-8">
          <Link to="/services" className="text-gray-700 font-medium hover:text-babi-green transition-colors">Services</Link>
          <a href="#how-it-works" className="text-gray-700 font-medium hover:text-babi-green transition-colors">Comment ça marche</a>
          <Link to="/devenir-prestataire" className="text-gray-700 font-medium hover:text-babi-green transition-colors">Devenir prestataire</Link>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          {loading ? null : user ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="text-gray-700 font-semibold hover:text-babi-green transition-colors"
              >
                {isAdmin ? 'Tableau de bord' : 'Mon compte'}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-babi-green text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="text-gray-700 font-semibold hover:text-babi-green transition-colors">Connexion</Link>
              <Link to="/inscription" className="bg-babi-green text-white px-5 py-2 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                S'inscrire
              </Link>
            </>
          )}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-babi-dark focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-4 shadow-inner">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/services" 
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium hover:text-babi-green py-1 transition-colors"
            >
              Services
            </Link>
            <a 
              href="#how-it-works" 
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium hover:text-babi-green py-1 transition-colors"
            >
              Comment ça marche
            </a>
            <Link 
              to="/devenir-prestataire" 
              onClick={() => setIsOpen(false)}
              className="text-gray-700 font-medium hover:text-babi-green py-1 transition-colors"
            >
              Devenir prestataire
            </Link>
          </div>
          <hr className="border-gray-100" />
          <div className="flex flex-col gap-3 pt-2">
            {loading ? null : user ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 font-semibold text-center hover:text-babi-green py-2 transition-colors"
                >
                  {isAdmin ? 'Tableau de bord' : 'Mon compte'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full bg-babi-green text-white px-5 py-2.5 rounded-full font-semibold text-center hover:shadow-lg transition-all"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/connexion" 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 font-semibold text-center hover:text-babi-green py-2 transition-colors"
                >
                  Connexion
                </Link>
                <Link 
                  to="/inscription" 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-babi-green text-white px-5 py-2.5 rounded-full font-semibold text-center hover:shadow-lg transition-all"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar