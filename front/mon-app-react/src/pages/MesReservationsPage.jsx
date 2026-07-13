import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReservationCard from "../components/reservations/ReservationCard";
import { apiGetReservations, apiUpdateReservation, apiCreateAvis } from "../services/api";

const FILTERS = [
  { label: "Toutes", value: "toutes" },
  { label: "En attente", value: "en_attente" },
  { label: "Confirmées", value: "confirmee" },
  { label: "Terminées", value: "terminee" },
  { label: "Annulées", value: "annulee" },
];

export default function MesReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("toutes");

  useEffect(() => {
    let active = true;
    apiGetReservations()
      .then((res) => {
        if (!active) return;
        if (res.ok) setReservations(res.data);
        else setError(res.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "toutes") return reservations;
    return reservations.filter((r) => r.statut === activeFilter);
  }, [reservations, activeFilter]);

  async function handleCancel(id) {
    const confirmed = window.confirm("Annuler cette réservation ?");
    if (!confirmed) return;

    const res = await apiUpdateReservation(id, { statut: "annulee" });
    if (!res.ok) {
      alert("Impossible d'annuler la réservation pour le moment.");
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? res.data : r))
    );
  }

  async function handleMarkTerminee(id) {
    const confirmed = window.confirm("Confirmer que cette prestation est terminée ?");
    if (!confirmed) return;

    const res = await apiUpdateReservation(id, { statut: "terminee" });
    if (!res.ok) {
      alert("Impossible de mettre à jour la réservation pour le moment.");
      return;
    }
    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? res.data : r))
    );
  }

  async function handleRate(id, payload) {
    const res = await apiCreateAvis({ ...payload, id_reservation: id });
    if (!res.ok) return false;

    setReservations((prev) =>
      prev.map((r) => (r.id_reservation === id ? { ...r, avis: res.data } : r))
    );
    return true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#7A9C90] hover:text-[#0E9F6E] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Accueil
          </Link>

          <h1 className="text-3xl font-bold text-[#0B2B26] mb-6">
            Mes réservations
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {FILTERS.map(({ label, value }) => {
              const active = activeFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setActiveFilter(value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#0E9F6E] text-white"
                      : "bg-white border border-[#DCEBE3] text-[#3D5A50] hover:border-[#0E9F6E]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-[#F0F7F4] animate-pulse"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <p className="text-sm text-[#C0392B] bg-[#FBEAEA] rounded-xl p-4">
              Impossible de charger tes réservations. Réessaie un peu plus tard.
            </p>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="text-center bg-[#F0F7F4] rounded-2xl p-10">
              <p className="text-sm text-[#3D5A50] mb-4">
                Aucune réservation {activeFilter !== "toutes" ? "dans cette catégorie" : "pour le moment"}.
              </p>
              <Link
                to="/services"
                className="inline-block bg-[#0E9F6E] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#0C8A5F] transition-colors"
              >
                Trouver un prestataire
              </Link>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map((reservation) => (
                <ReservationCard
                  key={reservation.id_reservation}
                  reservation={reservation}
                  onCancel={handleCancel}
                  onMarkTerminee={handleMarkTerminee}
                  onRate={handleRate}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}