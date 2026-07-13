const STATUS_CONFIG = {
  en_attente: { label: "En attente", bg: "#FEF3E2", text: "#B8860B" },
  confirmee: { label: "Confirmée", bg: "#E6F4EC", text: "#0E9F6E" },
  terminee: { label: "Terminée", bg: "#EAF0FE", text: "#3D5AC9" },
  annulee: { label: "Annulée", bg: "#FBEAEA", text: "#C0392B" },
};

export default function StatusBadge({ statut }) {
  const config = STATUS_CONFIG[statut] || {
    label: statut || "Inconnu",
    bg: "#F0F7F4",
    text: "#3D5A50",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ backgroundColor: config.bg, color: config.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.text }}
      />
      {config.label}
    </span>
  );
}