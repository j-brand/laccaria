/**
 * Plesk / Phusion Passenger entry point ("Anwendungsstartdatei").
 *
 * Passenger requires a startup file it can `require()`, so this is CommonJS
 * (`.cjs`, because package.json sets "type": "module"). It boots the Next.js
 * production server programmatically — run `npm run build` first.
 * Passenger intercepts `listen()`, so the port only matters when running
 * this file directly (e.g. `node server.cjs` for a local smoke test).
 */
const http = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const app = next({dev: false, dir: __dirname});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`laccaria ready on http://localhost:${port}`);
  });
});
