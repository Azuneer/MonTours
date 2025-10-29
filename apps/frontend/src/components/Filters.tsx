import { useState } from "react";
import type { CompanyFilters } from "../types";

interface FiltersProps {
  onFilterChange: (filters: CompanyFilters) => void;
  companiesCount: number;
}

export function Filters({ onFilterChange, companiesCount }: FiltersProps) {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof CompanyFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v);

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
      {/* Header */}
      <div className="p-4 bg-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">MonTours</h2>
            <p className="text-sm opacity-90">{companiesCount} entreprises IT</p>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-primary-700 rounded transition-colors"
            aria-label={isOpen ? "Fermer les filtres" : "Ouvrir les filtres"}
          >
            <svg
              className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Nom d'entreprise..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'entreprise
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les types</option>
              <option value="Startup">Startup</option>
              <option value="PME">PME</option>
              <option value="ESN">ESN</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secteur d'activité
            </label>
            <select
              value={filters.sector || ""}
              onChange={(e) => handleFilterChange("sector", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Tous les secteurs</option>
              <option value="Web">Développement Web</option>
              <option value="Mobile">Développement Mobile</option>
              <option value="Data">Data / IA</option>
              <option value="Cloud">Cloud / DevOps</option>
              <option value="Cybersecurity">Cybersécurité</option>
              <option value="Conseil">Conseil IT</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              placeholder="Ex: Tours"
              value={filters.city || ""}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Clear button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
