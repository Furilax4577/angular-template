import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import crypto from 'crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

// === Middleware pour générer un nonce ===
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('hex');
  res.locals['nonce'] = nonce;

  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; script-src-attr 'unsafe-inline'; style-src 'self' 'unsafe-inline'; object-src 'none'; report-uri /csp-violation-report-endpoint;`
  );

  next();
});

app.post(
  '/csp-violation-report-endpoint',
  express.json({ type: '*/*' }),
  (req, res) => {
    console.warn('CSP VIOLATION:', JSON.stringify(req.body, null, 2));
    res.status(204).end();
  }
);

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('*', async (req, res, next) => {
  if (/\.[a-zA-Z0-9]+$/.test(req.url)) return next();

  const nonce = res.locals['nonce'];

  try {
    const html = await commonEngine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });

    const htmlWithNonce = html
      .replace(
        /<script(?![^>]*src=)(?![^>]*nonce=)([^>]*)>/g,
        `<script nonce="${nonce}"$1>`
      )
      .replace(/nonce="[^"]*"/g, `nonce="${nonce}"`);

    res.send(htmlWithNonce);
  } catch (err) {
    next(err);
  }
});

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
    redirect: false, // <== Permet d'éviter la redirection 301
  })
);

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
