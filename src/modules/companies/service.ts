import { eq, like, and, or, sql, SQL } from 'drizzle-orm';
import { db } from '../../config/database';
import { companies, type Company, type NewCompany, type CompanyUpdate } from './schema';

export class CompanyService {
  /**
   * Récupère toutes les entreprises avec filtres optionnels
   */
  async getAllCompanies(filters?: {
    companyType?: string;
    sector?: string;
    city?: string;
    postalCode?: string;
    search?: string;
  }): Promise<Company[]> {
    const conditions: SQL[] = [];
    
    // Filtre par type
    if (filters?.companyType) {
      conditions.push(eq(companies.companyType, filters.companyType));
    }
    
    // Filtre par secteur
    if (filters?.sector) {
      conditions.push(eq(companies.sector, filters.sector));
    }
    
    // Filtre par ville
    if (filters?.city) {
      conditions.push(like(companies.city, `%${filters.city}%`));
    }
    
    // Filtre par code postal
    if (filters?.postalCode) {
      conditions.push(eq(companies.postalCode, filters.postalCode));
    }
    
    // Recherche textuelle (nom, description)
    if (filters?.search) {
      conditions.push(
        or(
          like(companies.name, `%${filters.search}%`),
          like(companies.description, `%${filters.search}%`)
        )!
      );
    }

    return await db
      .select()
      .from(companies)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(companies.name);
  }

  /**
   * Récupère une entreprise par ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Récupère une entreprise par SIRET
   */
  async getCompanyBySiret(siret: string): Promise<Company | null> {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.siret, siret))
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Crée une nouvelle entreprise
   */
  async createCompany(data: NewCompany): Promise<Company> {
    const result = await db
      .insert(companies)
      .values(data)
      .returning();
    
    return result[0];
  }

  /**
   * Met à jour une entreprise
   */
  async updateCompany(id: string, data: CompanyUpdate): Promise<Company | null> {
    const result = await db
      .update(companies)
      .set({ 
        ...data, 
        updatedAt: new Date() 
      })
      .where(eq(companies.id, id))
      .returning();
    
    return result[0] || null;
  }

  /**
   * Supprime une entreprise
   */
  async deleteCompany(id: string): Promise<boolean> {
    const result = await db
      .delete(companies)
      .where(eq(companies.id, id))
      .returning();
    
    return result.length > 0;
  }

  /**
   * Compte le nombre d'entreprises (avec filtres optionnels)
   */
  async countCompanies(filters?: {
    companyType?: string;
    sector?: string;
    city?: string;
  }): Promise<number> {
    const conditions: SQL[] = [];
    
    if (filters?.companyType) {
      conditions.push(eq(companies.companyType, filters.companyType));
    }
    if (filters?.sector) {
      conditions.push(eq(companies.sector, filters.sector));
    }
    if (filters?.city) {
      conditions.push(like(companies.city, `%${filters.city}%`));
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(companies)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    return Number(result[0]?.count || 0);
  }

  /**
   * Récupère les entreprises dans un rayon géographique
   */
  async getCompaniesInRadius(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Company[]> {
    // Formule Haversine pour calculer la distance
    const result = await db.execute(sql`
      SELECT *,
        (
          6371 * acos(
            cos(radians(${latitude})) 
            * cos(radians(CAST(latitude AS FLOAT))) 
            * cos(radians(CAST(longitude AS FLOAT)) - radians(${longitude})) 
            + sin(radians(${latitude})) 
            * sin(radians(CAST(latitude AS FLOAT)))
          )
        ) AS distance
      FROM ${companies}
      WHERE latitude IS NOT NULL 
        AND longitude IS NOT NULL
      HAVING distance < ${radiusKm}
      ORDER BY distance
    `);
    
    return result as unknown as Company[];
  }
}
