import { Elysia } from 'elysia';

// Plugin de logging global
export const loggerPlugin = new Elysia({
  name: 'logger',
})
  .onRequest(({ request }) => {
    console.log(`📨 ${request.method} ${new URL(request.url).pathname}`);
  })
  .onResponse(({ request, set }) => {
    const url = new URL(request.url);
    const status = set.status || 200;
    const statusEmoji = status >= 400 ? '❌' : status >= 300 ? '↩️' : '✅';
    
    console.log(
      `${statusEmoji} ${request.method} ${url.pathname} - ${status} - ${Date.now()}ms`
    );
  })
  .onError(({ code, error, set }) => {
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
