import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { createProductionApp } from './application.js';

function responseFixture() {
  return {
    headersSent: false,
    writableEnded: false,
    statusCode: null,
    headers: {},
    body: Buffer.alloc(0),

    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = { ...headers };
      this.headersSent = true;
    },

    write(chunk) {
      const bytes = Buffer.isBuffer(chunk)
        ? chunk
        : Buffer.from(String(chunk));

      this.body = Buffer.concat([this.body, bytes]);
      return true;
    },

    end(chunk) {
      if (chunk !== undefined) this.write(chunk);
      this.writableEnded = true;
      this.emit?.('finish');
    },

    on() {},
    once() {},
    emit() {},
  };
}

async function fixture() {
  const dir = await fs.mkdtemp(
    path.join(os.tmpdir(), 'gev-production-'),
  );

  await fs.mkdir(path.join(dir, 'assets'));

  await fs.writeFile(
    path.join(dir, 'index.html'),
    '<!doctype html><html><body>PRODUCTION INDEX</body></html>',
  );

  await fs.writeFile(
    path.join(dir, 'assets', 'index-ABC12345.js'),
    'console.log("built");',
  );

  return dir;
}

async function request(app, url, method = 'GET') {
  const req = { url, method };
  const res = responseFixture();

  await app.handle(req, res);

  return {
    req,
    res,
    text: res.body.toString('utf8'),
  };
}

test('health endpoint identifies the running build', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({
    distDir: dir,
    commit: 'abc1234',
    environment: 'production',
  });

  const { res, text } = await request(app, '/healthz');
  const body = JSON.parse(text);

  assert.equal(res.statusCode, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.app, 'signal-blotter');
  assert.equal(body.commit, 'abc1234');
  assert.equal(body.environment, 'production');
});

test('serves compiled static assets', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/assets/index-ABC12345.js',
  );

  assert.equal(res.statusCode, 200);
  assert.match(res.headers['Cache-Control'], /immutable/);
  assert.equal(text, 'console.log("built");');
});

test('browser routes fall back to compiled index.html', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/some/browser/route',
  );

  assert.equal(res.statusCode, 200);
  assert.match(text, /PRODUCTION INDEX/);
});

test('unknown API never falls through to SPA', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/api/not-real',
  );

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Unknown API route' },
  );
  assert.doesNotMatch(text, /PRODUCTION INDEX/);
});

test('real Public Incidents plugin is mounted', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/api/public-incidents/not-a-real-provider',
  );

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Unknown Public Incidents provider' },
  );
});

test('missing build produces controlled 503', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  await fs.rm(path.join(dir, 'index.html'));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/application-route',
  );

  assert.equal(res.statusCode, 503);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Production frontend is not built' },
  );
});
test('API routing uses an exact path boundary', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(app, '/apix');

  assert.equal(res.statusCode, 200);
  assert.match(text, /PRODUCTION INDEX/);
});

test('missing compiled assets return 404 instead of SPA HTML', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/assets/does-not-exist.js',
  );

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Static resource not found' },
  );
  assert.doesNotMatch(text, /PRODUCTION INDEX/);
});

test('missing Cesium resources return 404 instead of SPA HTML', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/cesium/Workers/does-not-exist.js',
  );

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Static resource not found' },
  );
  assert.doesNotMatch(text, /PRODUCTION INDEX/);
});

test('file-like missing paths do not receive SPA HTML', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(app, '/logo-missing.svg');

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(text),
    { error: 'Static resource not found' },
  );
});

test('encoded traversal cannot escape the production build root', async (t) => {
  const root = await fs.mkdtemp(
    path.join(os.tmpdir(), 'gev-production-traversal-'),
  );

  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const dir = path.join(root, 'dist');
  await fs.mkdir(dir);

  await fs.writeFile(
    path.join(dir, 'index.html'),
    '<!doctype html><html><body>SAFE INDEX</body></html>',
  );

  await fs.writeFile(
    path.join(root, 'secret.txt'),
    'OUTSIDE DIST SECRET',
  );

  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/%2e%2e%2fsecret.txt',
  );

  assert.equal(res.statusCode, 400);
  assert.doesNotMatch(text, /OUTSIDE DIST SECRET/);
});

test('malformed encoded paths are rejected', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({ distDir: dir });

  const { res } = await request(app, '/%E0%A4%A');

  assert.equal(res.statusCode, 400);
});

test('HEAD health returns headers without a response body', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const app = createProductionApp({
    distDir: dir,
    commit: 'head-test',
  });

  const { res, text } = await request(
    app,
    '/healthz',
    'HEAD',
  );

  const expectedLength = Buffer.byteLength(
    JSON.stringify({
      status: 'ok',
      app: 'signal-blotter',
      commit: 'head-test',
      environment: 'production',
    }),
  );

  assert.equal(res.statusCode, 200);
  assert.equal(
    Number(res.headers['Content-Length']),
    expectedLength,
  );
  assert.equal(text, '');
});

test('HEAD static asset returns metadata without asset bytes', async (t) => {
  const dir = await fixture();
  t.after(() => fs.rm(dir, { recursive: true, force: true }));

  const assetPath = path.join(
    dir,
    'assets',
    'index-ABC12345.js',
  );

  const info = await fs.stat(assetPath);
  const app = createProductionApp({ distDir: dir });

  const { res, text } = await request(
    app,
    '/assets/index-ABC12345.js',
    'HEAD',
  );

  assert.equal(res.statusCode, 200);
  assert.equal(
    Number(res.headers['Content-Length']),
    info.size,
  );
  assert.match(
    res.headers['Content-Type'],
    /^text\/javascript\b/,
  );
  assert.equal(text, '');
});