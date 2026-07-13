import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AvisCard from "../components/avis/AvisCard";
import { apiGetService, apiGetServiceAvis, apiGetMe } from "../services/api";

export default function ServiceDetailPage() {
  const { id } = useParams();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [error, setError] = useState(null);

  const [avisList, setAvisList] = useState([]);
  const [loadingAvis, setLoadingAvis] = useState(true);

  const [currentUserId, setCurrentUserId] = useState(null);

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

  useEffect(() => {
    let active = true;
    apiGetServiceAvis(id)
      .then((res) => {
        if (active && res.ok) setAvisList(res.data);
      })
      .finally(() => {
        if (active) setLoadingAvis(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    apiGetMe().then((res) => {
      if (res.ok) setCurrentUserId(res.data.id_utilisateur);
    });
  }, []);

  function handleSignaled(idAvis) {
    setAvisList((prev) => prev.filter((a) => a.id_avis !== idAvis));
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

  const { nom_service, description, tarif, disponibilite, prestataire, categorie } = service;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-[#7A9C90] hover:text-[#0E9F6E] mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tous les services
          </Link>

          <div className="bg-[#F0F7F4] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center font-semibold text-xl text-[#0E9F6E] flex-shrink-0">
              {(prestataire?.prenom?.[0] || "?").toUpperCase()}
              {(prestataire?.nom?.[0] || "").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#0B2B26]">
                {prestataire?.prenom} {prestataire?.nom}
              </h1>
              <p className="text-sm text-[#3D5A50] mt-0.5">{nom_service}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#7A9C90]">
                {prestataire?.note_moyenne != null && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#F5A623] text-[#F5A623]" />
                    {prestataire.note_moyenne}
                  </span>
                )}
                {prestataire?.localisation && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {prestataire.localisation}
                  </span>
                )}
                {categorie?.nom_categorie && <span>{categorie.nom_categorie}</span>}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-semibold text-[#0B2B26]">
                {tarif ? `${Number(tarif).toLocaleString("fr-FR")} F` : "Sur devis"}
              </p>
              {disponibilite ? (
                <span className="inline-block mt-1 text-xs font-medium text-[#0E9F6E]">
                  Disponible
                </span>
              ) : (
                <span className="inline-block mt-1 text-xs font-medium text-[#7A9C90]">
                  Occupé
                </span>
              )}
              {disponibilite ? (
                <Link
                  to={`/services/${id}/reserver`}
                  className="block mt-3 bg-[#0E9F6E] text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#0C8A5F] transition-colors"
                >
                  Réserver
                </Link>
              ) : (
                <span className="block mt-3 bg-[#F0F7F4] text-[#7A9C90] text-sm font-medium px-5 py-2.5 rounded-full cursor-not-allowed">
                  Indisponible
                </span>
              )}
            </div>
          </div>

          {description && (
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#0B2B26] mb-2">Description</h2>
              <p className="text-sm text-[#3D5A50] leading-relaxed">{description}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-[#0B2B26] mb-4">
              Avis {avisList.length > 0 && `(${avisList.length})`}
            </h2>

            {loadingAvis && (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-[#F0F7F4] animate-pulse" />
                ))}
              </div>
            )}

            {!loadingAvis && avisList.length === 0 && (
              <p className="text-sm text-[#7A9C90] bg-[#F0F7F4] rounded-2xl p-5">
                Aucun avis pour ce service pour le moment.
              </p>
            )}

            {!loadingAvis && avisList.length > 0 && (
              <div className="space-y-3">
                {avisList.map((avis) => (
                  <AvisCard
                    key={avis.id_avis}
                    avis={avis}
                    currentUserId={currentUserId}
                    onSignaled={handleSignaled}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
