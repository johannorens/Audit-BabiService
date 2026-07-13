import { Link } from "react-router-dom"
import { API_URL } from "../../services/api"

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M9.41667 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V9.41667C2.5 9.8587 2.67559 10.2826 2.98816 10.5952L11.0048 18.6118C11.6566 19.2636 12.7184 19.2636 13.3702 18.6118L18.6118 13.3702C19.2636 12.7184 19.2636 11.6566 18.6118 11.0048L10.5952 2.98816C10.2826 2.67559 9.8587 2.5 9.41667 2.5Z" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 6.66667H6.675" stroke="#047857" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
    <path d="M7.5 10L9.16667 11.6667L12.5 8.33333M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#FF7A45" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const StarRatingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="#FBBF24">
    <path d="M10 1.66602L12.5729 6.87928L18.3333 7.7202L14.1667 11.7793L15.1459 17.5152L10 14.8127L4.85413 17.5152L5.83333 11.7793L1.66667 7.7202L7.42706 6.87928L10 1.66602Z"/>
  </svg>
)

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="none">
    <path d="M17.5 8.33333C17.5 13.3333 10 18.3333 10 18.3333C10 18.3333 2.5 13.3333 2.5 8.33333C2.5 4.65143 5.85786 1.66667 10 1.66667C14.1421 1.66667 17.5 4.65143 17.5 8.33333Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 10.8333C11.3807 10.8333 12.5 9.71404 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71404 8.61929 10.8333 10 10.8333Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AVATAR_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-amber-100 text-amber-700',
  'bg-sky-100 text-sky-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
]

function avatarColor(id) {
  return AVATAR_COLORS[(id ?? 0) % AVATAR_COLORS.length]
}

function initials(prenom, nom) {
  return `${(prenom?.[0] ?? '').toUpperCase()}${(nom?.[0] ?? '').toUpperCase()}`
}

function formatMontant(value) {
  return value ? `${Number(value).toLocaleString('fr-FR')} F` : 'Sur devis'
}

export default function ServiceCard({ service }) {
  const { id_service, nom_service, description, tarif, disponibilite, prestataire, categorie } = service
  const imageSrc = service.photo_path?.startsWith('http') ? service.photo_path : `${API_URL}${service.photo_path ?? ''}`

  const tags = (description || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 3)

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all">
      <div className="bg-emerald-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs font-semibold text-babi-dark">
            <TagIcon />
            {categorie?.nom_categorie ?? 'Service'}
          </span>
          {disponibilite ? (
            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Dispo
            </span>
          ) : (
            <span className="bg-white text-gray-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200">
              Occupé
            </span>
          )}
        </div>
        {service.photo_path ? (
          <img
            src={imageSrc}
            alt={nom_service}
            className="h-32 w-full object-cover rounded-xl border border-emerald-200"
          />
        ) : (
          <div className="h-32 flex items-center justify-center border border-dashed border-emerald-200 rounded-xl text-emerald-300 text-sm font-mono">
            photo prestation
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${avatarColor(prestataire?.id_prestataire)}`}>
            {initials(prestataire?.prenom, prestataire?.nom)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-babi-dark text-sm truncate">{prestataire?.prenom} {prestataire?.nom}</h3>
              <VerifiedIcon />
            </div>
            <p className="text-gray-500 text-sm truncate">{nom_service}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <StarRatingIcon />
            <span className="font-bold text-babi-dark">{prestataire?.note_moyenne ?? '—'}</span>
          </div>
          {prestataire?.localisation && (
            <div className="flex items-center gap-1 text-gray-500">
              <LocationIcon />
              <span>{prestataire.localisation}</span>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <p className="font-bold text-babi-green text-sm leading-tight">{formatMontant(tarif)}</p>
          <div className="flex items-center gap-2">
            <Link
              to={`/services/${id_service}`}
              className="text-sm font-semibold text-babi-dark hover:text-babi-green transition-colors px-3 py-2"
            >
              Voir le profil
            </Link>
            <Link
              to={`/services/${id_service}/reserver`}
              className="bg-babi-green text-white text-sm font-semibold px-4 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap"
            >
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
