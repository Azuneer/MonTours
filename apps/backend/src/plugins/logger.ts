import { Elysia } from 'elysia';

// Plugin de logging global
export const loggerPlugin = new Elysia({ name: 'logger' })
  .onRequest(({ request }) => {
    console.log(`📨 ${request.method} ${new URL(request.url).pathname}`);
  })
  .onAfterHandle(({ request, response }) => {
    const url = new URL(request.url);
    console.log(`✅ ${request.method} ${url.pathname}`);
  })
  .onError(({ code, error }) => {
    console.error(`💥 Error [${code}]:`, error.message);
    
    return {
      success: false,
      error: {
        code,
        message: error.message,
      },
      timestamp: new Date().toISOString(),
    };
  });
