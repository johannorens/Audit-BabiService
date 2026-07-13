import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Star, MapPin, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiGetService, apiCreateReservation } from "../services/api";

export default function ReservationFormPage() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [error, setError] = useState(null);

  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let active = true;
    apiGetService(id)
      .then((res) => {
        if (!active) return;
        if (res.ok) setService(res.data);
        else setError(res.data);
      })
      .finally(() => {
        if (active) setLoadingService(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const res = await apiCreateReservation({
      date_reservation: date,
      heure_reservation: heure,
      id_service: Number(id),
    });
    setSubmitting(false);

    if (!res.ok) {
      setSubmitError(res.data);
      return;
    }
    setSuccess(true);
  }

  if (loadingService) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
          <div className="h-72 rounded-2xl bg-[#F0F7F4] animate-pulse" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
          <p className="text-sm text-[#C0392B] bg-[#FBEAEA] rounded-xl p-4">
            Impossible de charger ce service. Réessaie un peu plus tard.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const { nom_service, tarif, prestataire, categorie, disponibilite } = service;

  if (!disponibilite) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full">
          <p className="text-sm text-[#7A9C90] bg-[#F0F7F4] rounded-xl p-4">
            Ce service n'est plus disponible actuellement.
          </p>
          <Link
            to={`/services/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#0E9F6E] mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4EC] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-7 h-7 text-[#0E9F6E]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0B2B26] mb-2">
              Réservation confirmée
            </h1>
            <p className="text-sm text-[#3D5A50] mb-6">
              Ta réservation pour <strong>{nom_service}</strong> le{" "}
              {new Date(date).toLocaleDateString("fr-FR")} à {heure} est confirmée.
              Le prestataire te contactera pour convenir du lieu du rendez-vous.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                to="/reservations"
                className="bg-[#0E9F6E] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#0C8A5F] transition-colors"
              >
                Voir mes réservations
              </Link>
              <Link
                to="/services"
                className="text-sm font-medium text-[#0B2B26] hover:text-[#0E9F6E] transition-colors"
              >
                Retour aux services
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link
            to={`/services/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#7A9C90] hover:text-[#0E9F6E] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au profil
          </Link>

          <h1 className="text-3xl font-bold text-[#0B2B26] mb-6">
            Réserver ce service
          </h1>

          {/* Récap du service */}
          <div className="bg-[#F0F7F4] rounded-2xl p-5 flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center font-semibold text-[#0E9F6E] flex-shrink-0">
              {(prestataire?.nom_prestataire || prestataire?.nom || "?")
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#0B2B26] truncate">
                {prestataire?.nom_prestataire || prestataire?.nom}
              </p>
              <p className="text-sm text-[#3D5A50]">{nom_service}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-[#7A9C90]">
                {prestataire?.note_moyenne != null && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                    {prestataire.note_moyenne}
                  </span>
                )}
                {prestataire?.quartier && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {prestataire.quartier}
                  </span>
                )}
                {categorie?.nom_categorie && <span>{categorie.nom_categorie}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-semibold text-[#0B2B26]">
                {tarif ? `${Number(tarif).toLocaleString("fr-FR")} F` : "Sur devis"}
              </p>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#0B2B26] mb-2">
                Date souhaitée
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9C90]" />
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCEBE3] text-sm text-[#0B2B26] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30 focus:border-[#0E9F6E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0B2B26] mb-2">
                Heure souhaitée
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9C90]" />
                <input
                  type="time"
                  required
                  value={heure}
                  onChange={(e) => setHeure(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCEBE3] text-sm text-[#0B2B26] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30 focus:border-[#0E9F6E]"
                />
              </div>
            </div>

            {submitError && (
              <p className="text-sm text-[#C0392B] bg-[#FBEAEA] rounded-xl p-3">
                Impossible d'envoyer la réservation. Vérifie les informations et
                réessaie.
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#0E9F6E] text-white font-medium py-3.5 rounded-full hover:bg-[#0C8A5F] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Envoi en cours..." : "Confirmer la réservation"}
            </button>

            <p className="text-xs text-[#7A9C90] text-center">
              Le paiement se fait après confirmation du prestataire, en toute
              sécurité.
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}