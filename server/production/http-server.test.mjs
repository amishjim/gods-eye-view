import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { createProductionHttpServer } from './http-server.js';

async function fixture() {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'gev-production-http-'),
  );

  await fs.mkdir(path.join(dir, 'assets'));

  await fs.writeFile(
    path.join(dir, 'index.html'),
    '<!doctype html><html><body>REAL HTTP PRODUCTION INDEX</body></html>',
  );

  await fs.writeFile(
    path.join(dir, 'assets', 'index-REALHTTP1.js'),
    'console.log("real-http-built");',
  );

  return dir;
}

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);

    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();

  return `http://127.0.0.1:${address.port}`;
}

async function close(server) {
  if (!server.listening) return;

  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
}

test('real HTTP server exposes build health', async (t) => {
  const dir = await fixture();
  const server = createProductionHttpServer({
    distDir: dir,
    commit: 'http123',
    environment: 'test',
  });

  t.after(async () => {
    await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  });

  const origin = await listen(server);
  const response = await fetch(`${origin}/healthz`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.app, 'signal-blotter');
  assert.equal(body.commit, 'http123');
  assert.equal(body.environment, 'test');
});

test('real HTTP server serves compiled asset bytes', async (t) => {
  const dir = await fixture();
  const server = createProductionHttpServer({ distDir: dir });

  t.after(async () => {
    await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  });

  const origin = await listen(server);
  const response = await fetch(
    `${origin}/assets/index-REALHTTP1.js`,
  );

  assert.equal(response.status, 200);
  assert.equal(
    await response.text(),
    'console.log("real-http-built");',
  );
  assert.match(
    response.headers.get('cache-control') || '',
    /immutable/,
  );
});

test('real HTTP unknown API returns JSON rather than SPA HTML', async (t) => {
  const dir = await fixture();
  const server = createProductionHttpServer({ distDir: dir });

  t.after(async () => {
    await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  });

  const origin = await listen(server);
  const response = await fetch(`${origin}/api/not-real`);
  const text = await response.text();

  assert.equal(response.status, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Unknown API route' },
  );
  assert.doesNotMatch(text, /REAL HTTP PRODUCTION INDEX/);
});

test('real HTTP Public Incidents route uses existing provider middleware', async (t) => {
  const dir = await fixture();
  const server = createProductionHttpServer({ distDir: dir });

  t.after(async () => {
    await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  });

  const origin = await listen(server);
  const response = await fetch(
    `${origin}/api/public-incidents/not-a-provider`,
  );

  assert.equal(response.status, 404);
  assert.deepEqual(
    await response.json(),
    { error: 'Unknown Public Incidents provider' },
  );
});

test('real HTTP browser route receives compiled SPA', async (t) => {
  const dir = await fixture();
  const server = createProductionHttpServer({ distDir: dir });

  t.after(async () => {
    await close(server);
    await fs.rm(dir, { recursive: true, force: true });
  });

  const origin = await listen(server);
  const response = await fetch(`${origin}/city/austin`);
  const text = await response.text();

  assert.equal(response.status, 200);
  assert.match(text, /REAL HTTP PRODUCTION INDEX/);
});