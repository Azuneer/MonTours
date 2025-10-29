import { pgTable, uuid, varchar, text, timestamp, decimal, index } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Informations de base
  name: varchar('name', { length: 255 }).notNull(),
  siret: varchar('siret', { length: 14 }).unique(),
  siren: varchar('siren', { length: 9 }),
  naf: varchar('naf', { length: 10 }),
  
  // Type d'entreprise
  companyType: varchar('company_type', { length: 50 }), // startup, PME, ESN, etc.
  sector: varchar('sector', { length: 100 }), // AI, Web, Mobile, Cybersécurité, etc.
  
  // Adresse
  address: text('address'),
  postalCode: varchar('postal_code', { length: 5 }),
  city: varchar('city', { length: 100 }),
  
  // Coordonnées géographiques (pour la carte)
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  
  // Informations complémentaires
  website: varchar('website', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  description: text('description'),
  employees: varchar('employees', { length: 50 }), // "1-10", "11-50", "51-200", etc.
  foundedYear: varchar('founded_year', { length: 4 }),
  
  // Technologies/Stack (JSON array as text)
  technologies: text('technologies'), // JSON stringified array
  
  // Métadonnées
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  // Index pour optimiser les recherches
  siretIdx: index('siret_idx').on(table.siret),
  cityIdx: index('city_idx').on(table.city),
  companyTypeIdx: index('company_type_idx').on(table.companyType),
  sectorIdx: index('sector_idx').on(table.sector),
  postalCodeIdx: index('postal_code_idx').on(table.postalCode),
}));

// Types TypeScript inférés automatiquement
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyUpdate = Partial<NewCompany>;
