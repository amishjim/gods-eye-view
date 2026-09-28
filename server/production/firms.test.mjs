import test from 'node:test';
import assert from 'node:assert/strict';

import { createMiddlewareStack } from './middleware-stack.js';
import { firmsProxy } from '../providers/firms.js';
import { apiNotFoundPlugin } from '../standalone/api-not-found.js';

function mockResponse() {
  const headers = new Map();

  return {
    statusCode: null,
    body: '',
    headersSent: false,
    writableEnded: false,

    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), String(value));
    },

    writeHead(status, values = {}) {
      this.statusCode = status;
      this.headersSent = true;

      for (const [name, value] of Object.entries(values)) {
        headers.set(String(name).toLowerCase(), String(value));
      }
    },

    end(value = '') {
      this.body += String(value);
      this.writableEnded = true;
    },

    on() {},

    header(name) {
      return headers.get(String(name).toLowerCase());
    },
  };
}

test('production FIRMS status route is mounted before unknown API fallback', async () => {
  const middlewares = createMiddlewareStack();

  const server = {
    middlewares,
    httpServer: null,
  };

  firmsProxy().configureServer(server);
  apiNotFoundPlugin().configureServer(server);

  const req = {
    method: 'GET',
    url: '/api/firms/status',
    socket: { remoteAddress: '127.0.0.1' },
    on() {},
  };

  const res = mockResponse();

  await middlewares.handle(req, res);

  assert.equal(res.statusCode, 200);

  const payload = JSON.parse(res.body);

  assert.equal(typeof payload.hasKey, 'boolean');
  assert.ok('ttlMs' in payload);
});
