import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createProductionApp } from './application.js';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultDistDir = path.resolve(moduleDir, '../../dist');

export function createProductionHttpServer({
  distDir = defaultDistDir,
  commit = process.env.GEV_BUILD_COMMIT || 'unknown',
  environment = process.env.NODE_ENV || 'production',
} = {}) {
  const app = createProductionApp({
    distDir,
    commit,
    environment,
  });

  return http.createServer((req, res) => {
    void app.handle(req, res);
  });
}

export function startProductionServer({
  distDir = defaultDistDir,
  commit = process.env.GEV_BUILD_COMMIT || 'unknown',
  environment = process.env.NODE_ENV || 'production',
  host = process.env.HOST || '127.0.0.1',
  port = Number(process.env.PORT || 3000),
} = {}) {
  const server = createProductionHttpServer({
    distDir,
    commit,
    environment,
  });

  server.listen(port, host, () => {
    const address = server.address();
    const shownHost =
      typeof address === 'object' && address
        ? address.address
        : host;
    const shownPort =
      typeof address === 'object' && address
        ? address.port
        : port;

    console.log(
      `Signal Blotter production server listening on ${shownHost}:${shownPort}`,
    );
  });

  return server;
}