import { useState, useEffect } from "react";
import type { Company, CompanyFilters } from "../types";

const API_BASE_URL = "http://localhost:3000";

export function useCompanies(filters?: CompanyFilters) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters?.type) params.append("type", filters.type);
        if (filters?.sector) params.append("sector", filters.sector);
        if (filters?.city) params.append("city", filters.city);
        if (filters?.postalCode) params.append("postalCode", filters.postalCode);
        if (filters?.search) params.append("search", filters.search);

        const queryString = params.toString();
        const url = `${API_BASE_URL}/companies${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch companies: ${response.statusText}`);
        }

        const data = await response.json();

        // Handle both direct array and wrapped response
        const companiesData = Array.isArray(data) ? data : data.data || [];
        setCompanies(companiesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [filters?.type, filters?.sector, filters?.city, filters?.postalCode, filters?.search]);

  return { companies, loading, error };
}
