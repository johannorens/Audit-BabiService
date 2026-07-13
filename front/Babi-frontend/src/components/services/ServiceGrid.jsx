import ServiceCard from "./ServiceCard";

export default function ServiceGrid({ services, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[340px] rounded-2xl bg-emerald-50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600 bg-red-50 rounded-xl p-4">
        Impossible de charger les services. Réessaie un peu plus tard.
      </p>
    );
  }

  if (!services.length) {
    return (
      <p className="text-sm text-gray-500 bg-emerald-50 rounded-xl p-6 text-center">
        Aucun prestataire ne correspond à ces critères.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {services.map((service) => (
        <ServiceCard key={service.id_service} service={service} />
      ))}
    </div>
  );
}