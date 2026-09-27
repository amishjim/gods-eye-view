import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { startProductionServer } from './server/production/http-server.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(root, 'dist');

const server = startProductionServer({
  distDir,
  commit: process.env.GEV_BUILD_COMMIT || 'unknown',
  environment: process.env.NODE_ENV || 'production',
  host: process.env.HOST || '0.0.0.0',
  port: Number(process.env.PORT || 3000),
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received; shutting down.`);

  server.closeAllConnections?.();

  server.close((error) => {
    if (error) {
      console.error(error);
      process.exitCode = 1;
    }
  });
}

process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));
