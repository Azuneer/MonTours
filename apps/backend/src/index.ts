import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { env } from './config/env';
import { healthModule } from './modules/health';
import { companiesModule } from './modules/companies';
import { loggerPlugin } from './plugins/logger';

const app = new Elysia()
  // Métadonnées de l'app
  .state('version', env.APP_VERSION)
  .state('name', env.APP_NAME)

  // CORS
  .use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }))

  // Logger personnalisé
  .use(loggerPlugin)

  // Documentation Swagger
  .use(swagger({
    documentation: {
      info: {
        title: env.APP_NAME,
        version: env.APP_VERSION,
        description: 'API pour cartographier les entreprises IT/PME/Startups/ESN de Tours',
      },
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Companies', description: 'Company management endpoints' },
        { name: 'Statistics', description: 'Statistics endpoints' },
        { name: 'Geolocation', description: 'Geolocation endpoints' },
      ],
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Development server',
        },
      ],
    },
    path: '/docs',
  }))
  
  // Route racine
  .get('/', ({ store }) => ({
    message: `Welcome to ${store.name}!`,
    version: store.version,
    documentation: '/docs',
    health: '/health',
  }))
  
  // Modules
  .use(healthModule)
  .use(companiesModule)
  
  // Gestion d'erreur globale
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);
    
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        success: false,
        error: 'Route not found',
      };
    }
    
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        error: 'Validation error',
        details: error.message,
      };
    }
    
    set.status = 500;
    return {
      success: false,
      error: 'Internal server error',
    };
  })
  
  // Démarrage du serveur
  .listen(env.PORT);

console.log(`
🚀 ${env.APP_NAME} v${env.APP_VERSION}
📡 Server running at: http://localhost:${app.server?.port}
📚 API Documentation: http://localhost:${app.server?.port}/docs
🏥 Health Check: http://localhost:${app.server?.port}/health
🌍 Environment: ${env.NODE_ENV}
`);

// Export pour les tests
export { app };
export type App = typeof app;
