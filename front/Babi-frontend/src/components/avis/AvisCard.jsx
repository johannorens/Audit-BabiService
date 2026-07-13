import { useState } from "react";
import { Star, Flag } from "lucide-react";
import { apiSignalerAvis } from "../../services/api";

export default function AvisCard({ avis, currentUserId, onSignaled }) {
  const [showForm, setShowForm] = useState(false);
  const [motif, setMotif] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const { note, commentaire, date_avis, utilisateur } = avis;
  const isOwnAvis = currentUserId && utilisateur?.id_utilisateur === currentUserId;

  const dateLabel = date_avis
    ? new Date(date_avis).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!motif.trim()) return;
    setSubmitting(true);
    setError(null);

    const res = await apiSignalerAvis(avis.id_avis, motif.trim());
    setSubmitting(false);

    if (!res.ok) {
      setError(res.data?.message || "Impossible de signaler cet avis pour le moment.");
      return;
    }
    onSignaled(avis.id_avis);
  }

  return (
    <div className="bg-white border border-[#E3EFE9] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F0F7F4] flex items-center justify-center font-semibold text-[#0E9F6E] flex-shrink-0">
            {(utilisateur?.prenom?.[0] || "?").toUpperCase()}
            {(utilisateur?.nom?.[0] || "").toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#0B2B26] text-sm">
              {utilisateur?.prenom} {utilisateur?.nom}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < note ? "fill-[#F5A623] text-[#F5A623]" : "text-[#DCEBE3]"
                  }`}
                />
              ))}
              {dateLabel && <span className="text-xs text-[#7A9C90] ml-1">{dateLabel}</span>}
            </div>
          </div>
        </div>

        {!isOwnAvis && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 text-xs text-[#7A9C90] hover:text-[#C0392B] transition-colors flex-shrink-0"
          >
            <Flag className="w-3.5 h-3.5" />
            Signaler
          </button>
        )}
      </div>

      {commentaire && (
        <p className="text-sm text-[#3D5A50] mt-3 leading-relaxed">{commentaire}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 bg-[#F0F7F4] rounded-xl p-4 space-y-3">
          <label className="block text-xs font-medium text-[#0B2B26]">
            Pourquoi signalez-vous cet avis ?
          </label>
          <textarea
            required
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={2}
            placeholder="Propos injurieux, faux avis, hors sujet..."
            className="w-full px-3 py-2 rounded-lg border border-[#DCEBE3] text-sm text-[#0B2B26] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30 focus:border-[#0E9F6E]"
          />
          {error && <p className="text-xs text-[#C0392B]">{error}</p>}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#C0392B] text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-[#A93226] transition-colors disabled:opacity-60"
            >
              {submitting ? "Envoi..." : "Confirmer le signalement"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
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
