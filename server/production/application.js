import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

import { createMiddlewareStack } from './middleware-stack.js';
import { publicIncidentsProxy } from '../providers/public-incidents.js';
import { apiNotFoundPlugin } from '../standalone/api-not-found.js';

const MIME_TYPES = Object.freeze({
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
});

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);

  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });

  res.end(body);
}

function safeFilePath(root, pathname) {
  let decoded;

  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decoded.includes('\0')) return null;

  const relative = decoded.replace(/^\/+/, '');
  const candidate = path.resolve(root, relative);
  const normalizedRoot = path.resolve(root);

  if (
    candidate !== normalizedRoot &&
    !candidate.startsWith(`${normalizedRoot}${path.sep}`)
  ) {
    return null;
  }

  return candidate;
}

async function regularFile(filepath) {
  try {
    const info = await stat(filepath);
    return info.isFile() ? info : null;
  } catch {
    return null;
  }
}

function staticHeaders(filepath) {
  const extension = path.extname(filepath).toLowerCase();
  const basename = path.basename(filepath);

  const headers = {
    'Content-Type':
      MIME_TYPES[extension] || 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  };

  if (
    filepath.includes(`${path.sep}assets${path.sep}`) &&
    /-[A-Za-z0-9_-]{6,}\./.test(basename)
  ) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else if (extension === '.html') {
    headers['Cache-Control'] = 'no-cache';
  } else {
    headers['Cache-Control'] = 'public, max-age=3600';
  }

  return headers;
}

async function sendFile(req, res, filepath, info) {
  const headers = {
    ...staticHeaders(filepath),
    'Content-Length': info.size,
  };

  res.writeHead(200, headers);

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  await new Promise((resolve, reject) => {
    const stream = createReadStream(filepath);

    stream.on('error', reject);
    stream.on('end', resolve);
    stream.pipe(res);
  });
}

function productionPlugins() {
  /*
   * Deliberately narrow public allowlist.
   *
   * Do NOT replace this with localProviderPlugins().
   * Local development includes credential-backed and operator-only services
   * that are not automatically appropriate for anonymous Internet exposure.
   */
  return [
    publicIncidentsProxy(),
    apiNotFoundPlugin(),
  ];
}

export function createProductionApp({
  distDir,
  commit = process.env.GEV_BUILD_COMMIT || 'unknown',
  environment = process.env.NODE_ENV || 'production',
} = {}) {
  if (!distDir) {
    throw new TypeError('Production application requires distDir');
  }

  const absoluteDist = path.resolve(distDir);
  const middlewares = createMiddlewareStack();

  const providerServer = {
    middlewares,
    httpServer: null,
  };

  for (const plugin of productionPlugins()) {
    plugin.configureServer?.(providerServer);
  }

  async function handle(req, res) {
    try {
      const requestUrl = new URL(req.url || '/', 'http://localhost');
      const pathname = requestUrl.pathname;

      if (pathname === '/healthz') {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          sendJson(res, 405, { error: 'Method Not Allowed' });
          return;
        }

        const body = {
          status: 'ok',
          app: 'signal-blotter',
          commit,
          environment,
        };

        if (req.method === 'HEAD') {
          const encoded = JSON.stringify(body);
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(encoded),
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
          });
          res.end();
          return;
        }

        sendJson(res, 200, body);
        return;
      }

      const isApiPath =
        pathname === '/api' ||
        pathname.startsWith('/api/');

      if (isApiPath) {
        const handled = await middlewares.handle(req, res);

        if (!handled && !res.writableEnded) {
          sendJson(res, 404, { error: 'Unknown API route' });
        }

        return;
      }

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendJson(res, 405, { error: 'Method Not Allowed' });
        return;
      }

      const requestedPath = pathname === '/' ? '/index.html' : pathname;
      const candidate = safeFilePath(absoluteDist, requestedPath);

      if (!candidate) {
        sendJson(res, 400, { error: 'Invalid path' });
        return;
      }

      const candidateInfo = await regularFile(candidate);

      if (candidateInfo) {
        await sendFile(req, res, candidate, candidateInfo);
        return;
      }

      /*
       * Requests that clearly target static resources must terminate here.
       * Returning index.html for a missing JavaScript/CSS/Cesium resource
       * produces misleading MIME and parsing failures in the browser.
       */
      const basename = path.basename(pathname);
      const isStaticRequest =
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/cesium/') ||
        path.extname(basename) !== '';

      if (isStaticRequest) {
        sendJson(res, 404, { error: 'Static resource not found' });
        return;
      }

      /*
       * Browser-side application route:
       * serve the compiled SPA entry point.
       *
       * API requests have already terminated above and can never reach this
       * fallback.
       */
      const indexPath = path.join(absoluteDist, 'index.html');
      const indexInfo = await regularFile(indexPath);

      if (!indexInfo) {
        sendJson(res, 503, {
          error: 'Production frontend is not built',
        });
        return;
      }

      await sendFile(req, res, indexPath, indexInfo);
    } catch (error) {
      console.error(
        '[Production Server]',
        error?.stack || error?.message || String(error),
      );

      if (!res.headersSent) {
        sendJson(res, 500, { error: 'Internal Server Error' });
      } else if (!res.writableEnded) {
        res.end();
      }
    }
  }

  return {
    handle,
    middlewares,
  };
}