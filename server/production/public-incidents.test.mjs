import test from 'node:test';
import assert from 'node:assert/strict';

import { createMiddlewareStack } from './middleware-stack.js';
import { publicIncidentsProxy } from '../providers/public-incidents.js';
import { apiNotFoundPlugin } from '../standalone/api-not-found.js';

function responseFixture() {
  return {
    headersSent: false,
    writableEnded: false,
    statusCode: null,
    headers: {},
    body: '',

    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = { ...headers };
      this.headersSent = true;
    },

    end(body = '') {
      if (body !== undefined && body !== null) {
        this.body += String(body);
      }
      this.writableEnded = true;
    },
  };
}

function createProductionApiStack() {
  const middlewares = createMiddlewareStack();
  const server = { middlewares };

  publicIncidentsProxy().configureServer(server);
  apiNotFoundPlugin().configureServer(server);

  return middlewares;
}

async function request(stack, url, method = 'GET') {
  const req = { url, method };
  const res = responseFixture();

  const handled = await stack.handle(req, res);

  return { req, res, handled };
}

test('real Public Incidents middleware mounts through production adapter', async () => {
  const stack = createProductionApiStack();

  const { res, handled } = await request(
    stack,
    '/api/public-incidents',
  );

  assert.equal(handled, true);
  assert.equal(res.statusCode, 400);
  assert.deepEqual(
    JSON.parse(res.body),
    { error: 'Invalid Public Incidents provider' },
  );
});

test('unknown Public Incidents provider returns controlled 404', async () => {
  const stack = createProductionApiStack();

  const { res } = await request(
    stack,
    '/api/public-incidents/definitely-not-a-provider',
  );

  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(res.body),
    { error: 'Unknown Public Incidents provider' },
  );
});

test('Public Incidents rejects unsupported HTTP methods', async () => {
  const stack = createProductionApiStack();

  const { res } = await request(
    stack,
    '/api/public-incidents/austin-fire',
    'POST',
  );

  assert.equal(res.statusCode, 405);
  assert.deepEqual(
    JSON.parse(res.body),
    { error: 'Method Not Allowed' },
  );
});

test('unknown API routes terminate as JSON before SPA handling', async () => {
  const stack = createProductionApiStack();

  const { res, handled } = await request(
    stack,
    '/api/does-not-exist',
  );

  assert.equal(handled, true);
  assert.equal(res.statusCode, 404);
  assert.deepEqual(
    JSON.parse(res.body),
    { error: 'Unknown API route' },
  );
});

test('non-API requests remain available for static/SPA handling', async () => {
  const stack = createProductionApiStack();

  const { res, handled } = await request(
    stack,
    '/some/application/route',
  );

  assert.equal(handled, false);
  assert.equal(res.writableEnded, false);
});
