import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env';
import * as schema from '../modules/companies/schema';

// Création de la connexion PostgreSQL
const queryClient = postgres(env.DATABASE_URL);

// Instance Drizzle avec le schéma
export const db = drizzle(queryClient, { schema });

// Fonction de health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Fermeture propre de la connexion
export async function closeDatabaseConnection(): Promise<void> {
  await queryClient.end();
}
