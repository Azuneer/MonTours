import indexHTML from "../index.html";
import testMapHTML from "../test-map.html";

const PORT = process.env.PORT || 3001;

Bun.serve({
  port: PORT,
  routes: {
    "/": indexHTML,
    "/test-map.html": testMapHTML,
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`
🎨 MonTours Frontend
📡 Server running at: http://localhost:${PORT}
`);
