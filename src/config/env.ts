import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  APP_NAME: z.string().default('MonTours API'),
  APP_VERSION: z.string().default('1.0.0'),
});

export type Env = z.infer<typeof envSchema>;

// Valide les variables d'environnement au démarrage
export const env = envSchema.parse(process.env);

// Log pour vérifier
console.log('✅ Environment variables validated');
