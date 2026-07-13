import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-2xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A9C90]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un métier, un nom, un mot-clé..."
        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#DCEBE3] bg-white text-sm text-[#0B2B26] placeholder:text-[#7A9C90] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30 focus:border-[#0E9F6E]"
      />
    </div>
  );
}