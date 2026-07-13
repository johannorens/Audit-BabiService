import { useState } from "react";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ReservationCard({ reservation, onCancel, onMarkTerminee, onRate }) {
  const { date_reservation, heure_reservation, statut, service, avis } = reservation;

  const [showRatingForm, setShowRatingForm] = useState(false);
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const dateLabel = date_reservation
    ? new Date(date_reservation).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Date non précisée";

  const canCancel = statut === "en_attente" || statut === "confirmee";
  const today = new Date().toISOString().split("T")[0];
  const canMarkTerminee = statut === "confirmee" && date_reservation && date_reservation <= today;
  const canRate = statut === "terminee" && !avis;

  async function handleRatingSubmit(e) {
    e.preventDefault();
    if (note < 1) {
      setError("Choisis une note entre 1 et 5 étoiles.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const ok = await onRate(reservation.id_reservation, {
      note,
      commentaire: commentaire.trim() || null,
      date_avis: today,
    });
    setSubmitting(false);

    if (!ok) {
      setError("Impossible d'enregistrer ton avis pour le moment.");
      return;
    }
    setShowRatingForm(false);
  }

  return (
    <div className="bg-white border border-[#E3EFE9] rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#F0F7F4] flex items-center justify-center font-semibold text-[#0E9F6E] flex-shrink-0">
          {(service?.prestataire?.nom_prestataire || service?.prestataire?.nom || "?")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-[#0B2B26] truncate">
              {service?.nom_service || "Service"}
            </p>
            <StatusBadge statut={statut} />
          </div>
          <p className="text-sm text-[#3D5A50] truncate">
            {service?.prestataire?.nom_prestataire || service?.prestataire?.nom}
          </p>
          <div className="flex items-center gap-4 mt-1.5 text-xs text-[#7A9C90]">
            <span className="flex items-center gap-1 capitalize">
              <Calendar className="w-3.5 h-3.5" />
              {dateLabel}
            </span>
            {heure_reservation && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {heure_reservation}
              </span>
            )}
            {service?.prestataire?.quartier && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {service.prestataire.quartier}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-semibold text-[#0B2B26]">
            {service?.tarif
              ? `${Number(service.tarif).toLocaleString("fr-FR")} F`
              : "Sur devis"}
          </span>
          {canCancel && (
            <button
              onClick={() => onCancel(reservation.id_reservation)}
              className="text-sm font-medium text-[#C0392B] hover:underline ml-3"
            >
              Annuler
            </button>
          )}
          {canMarkTerminee && (
            <button
              onClick={() => onMarkTerminee(reservation.id_reservation)}
              className="text-sm font-medium text-[#0E9F6E] hover:underline ml-3"
            >
              Marquer comme terminé
            </button>
          )}
          {canRate && !showRatingForm && (
            <button
              onClick={() => setShowRatingForm(true)}
              className="text-sm font-medium text-[#0E9F6E] hover:underline ml-3"
            >
              Noter le prestataire
            </button>
          )}
        </div>
      </div>

      {avis && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-[#7A9C90]">
          <span>Ton avis :</span>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < avis.note ? "fill-[#F5A623] text-[#F5A623]" : "text-[#DCEBE3]"
              }`}
            />
          ))}
        </div>
      )}

      {showRatingForm && (
        <form
          onSubmit={handleRatingSubmit}
          className="mt-4 bg-[#F0F7F4] rounded-xl p-4 space-y-3"
        >
          <div>
            <label className="block text-xs font-medium text-[#0B2B26] mb-2">
              Quelle note donnes-tu au prestataire ?
            </label>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setNote(value)}
                    aria-label={`${value} étoile${value > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        value <= note ? "fill-[#F5A623] text-[#F5A623]" : "text-[#DCEBE3]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            rows={2}
            placeholder="Un commentaire sur la prestation (optionnel)"
            className="w-full px-3 py-2 rounded-lg border border-[#DCEBE3] text-sm text-[#0B2B26] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30 focus:border-[#0E9F6E]"
          />

          {error && <p className="text-xs text-[#C0392B]">{error}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#0E9F6E] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#0C8A5F] transition-colors disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Envoyer mon avis"}
            </button>
            <button
              type="button"
              onClick={() => setShowRatingForm(false)}
              className="text-xs font-medium text-[#3D5A50] hover:underline"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
