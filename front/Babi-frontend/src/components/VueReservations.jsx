import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarIcon, MoneyIcon, StarIcon,
  formatMontant, formatDateHeure,
  avatarBg, initials, statutLabels, statutStyles,
  FILTERS, FILTER_LABELS,
} from './shared'

function RatingForm({ onSubmit, onCancel }) {
  const [note, setNote] = useState(0)
  const [commentaire, setCommentaire] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (note < 1) {
      setError('Choisis une note entre 1 et 5 étoiles.')
      return
    }
    setSubmitting(true)
    setError(null)
    const ok = await onSubmit({ note, commentaire: commentaire.trim() || null })
    setSubmitting(false)
    if (!ok) setError("Impossible d'enregistrer ton avis pour le moment.")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 bg-gray-50 rounded-xl p-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-babi-dark mb-2">Quelle note donnes-tu au prestataire ?</p>
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1
            return (
              <button key={value} type="button" onClick={() => setNote(value)} aria-label={`${value} étoile${value > 1 ? 's' : ''}`}>
                <StarIcon filled={value <= note} />
              </button>
            )
          })}
        </div>
      </div>

      <textarea
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        rows={2}
        placeholder="Un commentaire sur la prestation (optionnel)"
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-babi-dark focus:outline-none focus:ring-2 focus:ring-babi-green/30 focus:border-babi-green"
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-babi-green text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-babi-green/90 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Envoi...' : 'Envoyer mon avis'}
        </button>
        <button type="button" onClick={onCancel} className="text-xs font-semibold text-gray-500 hover:underline">
          Annuler
        </button>
      </div>
    </form>
  )
}

export default function VueReservations({ reservations, loading, onCancel, onMarkTerminee, onRate }) {
  const [filtre, setFiltre] = useState('toutes')
  const [ratingId, setRatingId] = useState(null)

  const filtered = useMemo(() => {
    if (filtre === 'toutes') return reservations
    return reservations.filter((r) => r.statut === filtre)
  }, [reservations, filtre])

  const today = new Date().toISOString().split('T')[0]

  async function handleRate(id, payload) {
    const ok = await onRate(id, { ...payload, date_avis: today })
    if (ok) setRatingId(null)
    return ok
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-babi-dark font-bricolage mb-1">Mes réservations</h1>
        <p className="text-gray-500 text-sm">Gérez toutes vos réservations</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltre(f)}
            className={`text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-full font-semibold transition border ${
              filtre === f
                ? 'bg-babi-green text-white border-babi-green'
                : 'bg-white text-gray-600 border-gray-200 hover:border-babi-green'
            }`}
          >
            {FILTER_LABELS[f]}
            <span className="ml-1.5 opacity-60 text-xs">
              {f === 'toutes' ? reservations.length : reservations.filter((r) => r.statut === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white animate-pulse border border-gray-100" />
          ))}
        </div>
      )}

      {/* État vide */}
      {!loading && filtered.length === 0 && (
        <div className="text-center bg-white rounded-2xl p-10 border border-gray-100">
          <p className="text-sm text-gray-500 mb-4">
            Aucune réservation {filtre !== 'toutes' ? 'dans cette catégorie' : 'pour le moment'}.
          </p>
          <Link to="/services" className="text-sm font-semibold text-babi-green hover:underline">
            Trouver un prestataire →
          </Link>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-4">
        {filtered.map((r, i) => {
          const canMarkTerminee = r.statut === 'confirmee' && r.date_reservation && r.date_reservation <= today
          const canRate = r.statut === 'terminee' && !r.avis

          return (
            <div key={r.id_reservation} className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarBg(i)}`}>
                    {initials(r.service?.prestataire?.prenom, r.service?.prestataire?.nom)}
                  </span>
                  <div>
                    <p className="font-semibold text-babi-dark text-sm md:text-base">
                      {r.service?.prestataire?.prenom} {r.service?.prestataire?.nom}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">{r.service?.nom_service}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 md:px-3 py-1 rounded-full shrink-0 ${statutStyles[r.statut]}`}>
                  {statutLabels[r.statut]}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs md:text-sm text-gray-500 mt-3 pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon /> {formatDateHeure(r.date_reservation, r.heure_reservation)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MoneyIcon /> {formatMontant(r.service?.tarif)}
                </span>
                <span className="text-xs text-gray-400">BK-{String(r.id_reservation).padStart(4, '0')}</span>

                <div className="ml-auto flex items-center gap-3">
                  {['en_attente', 'confirmee'].includes(r.statut) && (
                    <button
                      onClick={() => onCancel(r.id_reservation)}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Annuler
                    </button>
                  )}
                  {canMarkTerminee && (
                    <button
                      onClick={() => onMarkTerminee(r.id_reservation)}
                      className="text-xs font-semibold text-babi-green hover:underline"
                    >
                      Marquer comme terminé
                    </button>
                  )}
                  {canRate && ratingId !== r.id_reservation && (
                    <button
                      onClick={() => setRatingId(r.id_reservation)}
                      className="text-xs font-semibold text-babi-green hover:underline"
                    >
                      Noter le prestataire
                    </button>
                  )}
                </div>
              </div>

              {r.avis && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                  <span>Ton avis :</span>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarIcon key={idx} filled={idx < r.avis.note} />
                  ))}
                </div>
              )}

              {ratingId === r.id_reservation && (
                <RatingForm
                  onSubmit={(payload) => handleRate(r.id_reservation, payload)}
                  onCancel={() => setRatingId(null)}
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}