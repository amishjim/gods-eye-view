import assert from 'node:assert/strict';

import { createProductionHttpServer } from './http-server.js';

const server = createProductionHttpServer({
  distDir: './dist',
  commit: 'local-real-build',
  environment: 'production-smoke',
});

let failure = null;

try {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });

  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  const health = await fetch(`${origin}/healthz`, {
    headers: { Connection: 'close' },
  });

  assert.equal(health.status, 200);

  const healthBody = await health.json();

  assert.equal(healthBody.status, 'ok');
  assert.equal(healthBody.app, 'signal-blotter');
  assert.equal(healthBody.commit, 'local-real-build');
  assert.equal(healthBody.environment, 'production-smoke');

  console.log('PASS: health');

  const root = await fetch(`${origin}/`, {
    headers: { Connection: 'close' },
  });

  assert.equal(root.status, 200);

  const html = await root.text();

  assert.doesNotMatch(html, /\/src\/main\.js/);
  assert.match(html, /\/assets\/index-[^"' ]+\.js/);
  assert.match(html, /\/assets\/index-[^"' ]+\.css/);

  console.log('PASS: built frontend');
  console.log('PASS: no raw source entry');
  console.log('PASS: hashed JS/CSS references');

  const jsMatch = html.match(/\/assets\/index-[^"' ]+\.js/);
  const cssMatch = html.match(/\/assets\/index-[^"' ]+\.css/);

  assert.ok(jsMatch);
  assert.ok(cssMatch);

  const js = await fetch(`${origin}${jsMatch[0]}`, {
    headers: { Connection: 'close' },
  });

  assert.equal(js.status, 200);
  assert.match(
    js.headers.get('content-type') || '',
    /^text\/javascript\b/,
  );

  await js.arrayBuffer();

  console.log('PASS: built JS asset');

  const css = await fetch(`${origin}${cssMatch[0]}`, {
    headers: { Connection: 'close' },
  });

  assert.equal(css.status, 200);
  assert.match(
    css.headers.get('content-type') || '',
    /^text\/css\b/,
  );

  await css.arrayBuffer();

  console.log('PASS: built CSS asset');

  const cesiumJs = await fetch(`${origin}/cesium/Cesium.js`, {
    headers: { Connection: 'close' },
  });

  assert.equal(cesiumJs.status, 200);
  await cesiumJs.arrayBuffer();

  const cesiumCss = await fetch(
    `${origin}/cesium/Widgets/widgets.css`,
    {
      headers: { Connection: 'close' },
    },
  );

  assert.equal(cesiumCss.status, 200);
  await cesiumCss.arrayBuffer();

  console.log('PASS: Cesium public assets');

  const incident = await fetch(
    `${origin}/api/public-incidents/not-a-provider`,
    {
      headers: { Connection: 'close' },
    },
  );

  assert.equal(incident.status, 404);
  assert.match(
    incident.headers.get('content-type') || '',
    /^application\/json\b/,
  );

  assert.deepEqual(
    await incident.json(),
    { error: 'Unknown Public Incidents provider' },
  );

  console.log('PASS: Public Incidents middleware');

  const unknownApi = await fetch(`${origin}/api/not-real`, {
    headers: { Connection: 'close' },
  });

  assert.equal(unknownApi.status, 404);

  assert.match(
    unknownApi.headers.get('content-type') || '',
    /^application\/json\b/,
  );

  assert.deepEqual(
    await unknownApi.json(),
    { error: 'Unknown API route' },
  );

  console.log('PASS: unknown API isolation');

  const browserRoute = await fetch(
    `${origin}/city/austin`,
    {
      headers: { Connection: 'close' },
    },
  );

  assert.equal(browserRoute.status, 200);

  const browserHtml = await browserRoute.text();

  assert.doesNotMatch(browserHtml, /\/src\/main\.js/);
  assert.match(browserHtml, /\/assets\/index-/);

  console.log('PASS: SPA browser-route fallback');
} catch (error) {
  failure = error;
} finally {
  if (server.listening) {
    server.closeAllConnections?.();

    await new Promise((resolve) => {
      server.close(() => resolve());
    });
  }
}

if (failure) {
  console.error(failure);
  process.exitCode = 1;
} else {
  console.log('');
  console.log('REAL BUILD PRODUCTION SMOKE: PASS');
}