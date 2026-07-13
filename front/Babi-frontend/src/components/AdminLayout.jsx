import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiGetMe, apiLogout } from '../services/api'

// --- ICONS (Inchangés) ---
const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M2.5 3.33333C2.5 2.8731 2.8731 2.5 3.33333 2.5H8.33333C8.79357 2.5 9.16667 2.8731 9.16667 3.33333V8.33333C9.16667 8.79357 8.79357 9.16667 8.33333 9.16667H3.33333C2.8731 9.16667 2.5 8.79357 2.5 8.33333V3.33333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8333 3.33333C10.8333 2.8731 11.2064 2.5 11.6667 2.5H16.6667C17.1269 2.5 17.5 2.8731 17.5 3.33333V8.33333C17.5 8.79357 17.1269 9.16667 16.6667 9.16667H11.6667C11.2064 9.16667 10.8333 8.79357 10.8333 8.33333V3.33333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.5 11.6667C2.5 11.2064 2.8731 10.8333 3.33333 10.8333H8.33333C8.79357 10.8333 9.16667 11.2064 9.16667 11.6667V16.6667C9.16667 17.1269 8.79357 17.5 8.33333 17.5H3.33333C2.8731 17.5 2.5 17.1269 2.5 16.6667V11.6667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8333 11.6667C10.8333 11.2064 11.2064 10.8333 11.6667 10.8333H16.6667C17.1269 10.8333 17.5 11.2064 17.5 11.6667V16.6667C17.5 17.1269 17.1269 17.5 16.6667 17.5H11.6667C11.2064 17.5 10.8333 17.1269 10.8333 16.6667V11.6667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M10 1.66667L16.6667 4.16667V9.16667C16.6667 13.3333 13.3333 16.6667 10 18.3333C6.66667 16.6667 3.33333 13.3333 3.33333 9.16667V4.16667L10 1.66667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M6.66667 5.83333V4.16667C6.66667 3.24619 7.41286 2.5 8.33333 2.5H11.6667C12.5871 2.5 13.3333 3.24619 13.3333 4.16667V5.83333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.33333 5.83333H16.6667C17.5871 5.83333 18.3333 6.57953 18.3333 7.5V15.8333C18.3333 16.7538 17.5871 17.5 16.6667 17.5H3.33333C2.41286 17.5 1.66667 16.7538 1.66667 15.8333V7.5C1.66667 6.57953 2.41286 5.83333 3.33333 5.83333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M13.3333 17.5V15.8333C13.3333 14.0652 11.9334 12.5 10.1652 12.5H4.16523C2.39709 12.5 1.66523 14.0652 1.66523 15.8333V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.16667 9.16667C9.00762 9.16667 10.5 7.67428 10.5 5.83333C10.5 3.99238 9.00762 2.5 7.16667 2.5C5.32572 2.5 3.83333 3.99238 3.83333 5.83333C3.83333 7.67428 5.32572 9.16667 7.16667 9.16667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.1667 12.6667C15.5779 13.0699 16.6667 14.3441 16.6667 15.8333V17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 2.6084C12.7144 3.06804 13.5833 4.23548 13.5833 5.625C13.5833 7.01452 12.7144 8.18196 11.5 8.6416" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M6.66667 3.33333H5C4.07953 3.33333 3.33333 4.07953 3.33333 5V16.6667C3.33333 17.5871 4.07953 18.3333 5 18.3333H15C15.9205 18.3333 16.6667 17.5871 16.6667 16.6667V5C16.6667 4.07953 15.9205 3.33333 15 3.33333H13.3333" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 3.33333C6.66667 2.41286 7.41286 1.66667 8.33333 1.66667H11.6667C12.5871 1.66667 13.3333 2.41286 13.3333 3.33333C13.3333 4.25381 12.5871 5 11.6667 5H8.33333C7.41286 5 6.66667 4.25381 6.66667 3.33333Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M8.43417 2.5H11.5658C11.7421 2.5 11.8939 2.62325 11.9252 2.79667L12.2433 4.55667C12.6884 4.71591 13.1064 4.93883 13.485 5.21583L15.1717 4.6075C15.3382 4.5475 15.5237 4.61417 15.6133 4.7675L17.1792 7.4825C17.2683 7.63583 17.2333 7.83 17.0958 7.94L15.7042 9.0625C15.7375 9.295 15.755 9.5325 15.755 9.775C15.755 10.0175 15.7375 10.255 15.7042 10.4875L17.0958 11.61C17.2333 11.72 17.2683 11.9142 17.1792 12.0675L15.6133 14.7825C15.5237 14.9358 15.3382 15.0025 15.1717 14.9425L13.485 14.3342C13.1064 14.6112 12.6884 14.8341 12.2433 14.9933L11.9252 16.7533C11.8939 16.9267 11.7421 17.05 11.5658 17.05H8.43417C8.25792 17.05 8.10608 16.9267 8.07475 16.7533L7.75667 14.9933C7.3116 14.8341 6.89364 14.6112 6.515 14.3342L4.82833 14.9425C4.66183 15.0025 4.47633 14.9358 4.38667 14.7825L2.82083 12.0675C2.73167 11.9142 2.76667 11.72 2.90417 11.61L4.29583 10.4875C4.2625 10.255 4.245 10.0175 4.245 9.775C4.245 9.5325 4.2625 9.295 4.29583 9.0625L2.90417 7.94C2.76667 7.83 2.73167 7.63583 2.82083 7.4825L4.38667 4.7675C4.47633 4.61417 4.66183 4.5475 4.82833 4.6075L6.515 5.21583C6.89364 4.93883 7.3116 4.71591 7.75667 4.55667L8.07475 2.79667C8.10608 2.62325 8.25792 2.5 8.43417 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 17.5H4.16667C3.24619 17.5 2.5 16.7538 2.5 15.8333V4.16667C2.5 3.24619 3.24619 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 7.33333C2 10.2769 4.38979 12.6667 7.33333 12.6667C10.2769 12.6667 12.6667 10.2769 12.6667 7.33333C12.6667 4.38979 10.2769 2 7.33333 2C4.38979 2 2 4.38979 2 7.33333V7.33333" stroke="#8A7A6E" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.9995 14.0005L11.1328 11.1338" stroke="#8A7A6E" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M15 6.66667C15 5.34058 14.4732 4.0688 13.5355 3.13112C12.5979 2.19344 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19344 6.46447 3.13112C5.52679 4.0688 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.4417 17.5C11.2952 17.7526 11.0849 17.9622 10.8319 18.1079C10.579 18.2536 10.2922 18.3304 10 18.3304C9.70782 18.3304 9.42102 18.2536 9.16804 18.1079C8.91505 17.9622 8.70477 17.7526 8.55833 17.5" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M9.41667 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V9.41667C2.5 9.85870 2.67559 10.2826 2.98816 10.5952L11.0048 18.6118C11.6566 19.2636 12.7184 19.2636 13.3702 18.6118L18.6118 13.3702C19.2636 12.7184 19.2636 11.6566 18.6118 11.0048L10.5952 2.98816C10.2826 2.67559 9.8587 2.5 9.41667 2.5Z" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 6.66667H6.675" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 5H17.5M7.5 10H17.5M7.5 15H17.5M2.5 5H2.50833M2.5 10H2.50833M2.5 15H2.50833" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// Menu burger Icon
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

// Close Icon
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const navItems = [
  { icon: <GridIcon />,        label: 'Tableau de bord', to: '/admin' },
  { icon: <ShieldCheckIcon />, label: 'Validations',     to: '/admin/validations' },
  { icon: <BriefcaseIcon />,   label: 'Prestataires',    to: '/admin/prestataires' },
  { icon: <TagIcon />,         label: 'Catégories',      to: '/admin/categories' },
  { icon: <ListIcon />,        label: 'Services',        to: '/admin/services' },
  { icon: <UsersIcon />,       label: 'Utilisateurs',    to: '/admin/utilisateurs' },
  { icon: <ClipboardIcon />,   label: 'Missions',        to: '/admin/missions' },
  { icon: <SettingsIcon />,    label: 'Réglages',        to: '/admin/reglages' },
]

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

function AdminLayout({ active, title, subtitle, headerActions, topbarSearch, validationsCount = 0, children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [denied, setDenied] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Gestion responsive

  useEffect(() => {
    apiGetMe().then((me) => {
      if (!me.ok || me.data.role !== 'admin') {
        setDenied(true)
        return
      }
      setUser(me.data)
    })
  }, [])

  async function handleLogout() {
    await apiLogout()
    localStorage.removeItem('token')
    navigate('/')
  }

  if (denied) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-babi-cream">
        <p className="text-gray-600">Accès réservé aux administrateurs.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-babi-cream relative">
      
      {/* --- OVERLAY MOBILE --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR RESPONSIVE --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-babi-dark flex flex-col justify-between p-6 shrink-0
        transform transition-transform duration-300 ease-in-out
        md:relative md:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-babi-green rounded-full"></span>
              <span className="text-xl font-extrabold font-bricolage text-white">
                babi <span className="text-babi-green">admin</span>
              </span>
            </div>
            {/* Bouton fermeture sur Mobile uniquement */}
            <button 
              className="text-white md:hidden hover:text-babi-green transition-colors"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)} // Ferme la sidebar sur clic mobile
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                  item.label === active ? 'bg-babi-green text-white' : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {item.label === 'Validations' && validationsCount > 0 && (
                  <span className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-babi-green text-white">
                    {validationsCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
            {initials(user?.prenom, user?.nom)}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{user ? `${user.prenom} ${user.nom}` : '—'}</p>
            <p className="text-xs text-gray-400">Administrateur</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
            <LogoutIcon />
          </button>
        </div>
      </aside>

      {/* --- CONTEXTE PRINCIPAL (MAIN) --- */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-full">
        
        {/* Topbar */}
        <div className="flex items-center justify-between mb-8 gap-4 bg-white/50 md:bg-transparent p-3 rounded-2xl md:p-0">
          
          {/* Bouton burger visible sur mobile uniquement */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-babi-dark md:hidden hover:text-babi-green transition-colors"
          >
            <MenuIcon />
          </button>

          {/* Barre de recherche — responsive width */}
          {topbarSearch ? (
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 w-full max-w-[200px] sm:max-w-sm">
              <SearchIcon />
              <div className="w-full text-sm">
                {topbarSearch}
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-4 shrink-0">
            <button className="relative text-gray-500 hover:text-babi-dark transition-colors">
              <BellIcon />
              {validationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              )}
            </button>
            <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm hidden sm:flex">
              {initials(user?.prenom, user?.nom)}
            </span>
          </div>
        </div>

        {/* Titre + actions de page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-babi-dark font-bricolage">{title}</h1>
            {subtitle && <p className="text-gray-500 text-sm md:text-base mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div className="shrink-0 w-full sm:w-auto">{headerActions}</div>}
        </div>

        {/* Contenu des enfants */}
        <div className="w-full overflow-x-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout