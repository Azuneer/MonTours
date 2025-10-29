import { Elysia } from 'elysia';
import { checkDatabaseConnection } from '../../config/database';
import { env } from '../../config/env';

export const healthModule = new Elysia({ 
  prefix: '/health',
  name: 'health',
  tags: ['Health']
})
  // Health check simple
  .get('/', () => ({
    status: 'ok',
    service: env.APP_NAME,
    version: env.APP_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }), {
    detail: {
      summary: 'Basic health check',
      tags: ['Health']
    }
  })
  
  // Health check avec base de données
  .get('/db', async () => {
    const isConnected = await checkDatabaseConnection();
    
    return {
      status: isConnected ? 'ok' : 'error',
      database: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }, {
    detail: {
      summary: 'Database health check',
      tags: ['Health']
    }
  })
  
  // Health check complet
  .get('/full', async () => {
    const dbStatus = await checkDatabaseConnection();
    
    return {
      status: dbStatus ? 'ok' : 'degraded',
      service: env.APP_NAME,
      version: env.APP_VERSION,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: dbStatus ? 'healthy' : 'unhealthy',
      },
      environment: env.NODE_ENV,
    };
  }, {
    detail: {
      summary: 'Full health check',
      description: 'Complete health check including all dependencies',
      tags: ['Health']
    }
  });
