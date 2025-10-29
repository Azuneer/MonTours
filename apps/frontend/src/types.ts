export interface Company {
  id: string;
  siret: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  sector?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyFilters {
  type?: string;
  sector?: string;
  city?: string;
  postalCode?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Stats {
  total: number;
  byType?: Record<string, number>;
  bySector?: Record<string, number>;
  byCity?: Record<string, number>;
}
