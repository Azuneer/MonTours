import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/modules/*/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://postgres:postgres@localhost:5432/montours',  // ← en dur
  },
  verbose: true,
  strict: true,
});
