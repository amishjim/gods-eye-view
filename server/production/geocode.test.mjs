import test from 'node:test';
import assert from 'node:assert/strict';

import { createMiddlewareStack } from './middleware-stack.js';
import { geocodeProxy } from '../providers/regional/place.js';
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

test('production geocode route is mounted before unknown API fallback', async () => {
  const middlewares = createMiddlewareStack();

  const server = {
    middlewares,
    httpServer: null,
  };

  geocodeProxy().configureServer(server);
  apiNotFoundPlugin().configureServer(server);

  const req = {
    method: 'GET',
    url: '/api/geocode',
    socket: { remoteAddress: '127.0.0.1' },
    on() {},
  };

  const res = mockResponse();

  await middlewares.handle(req, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body, /place query/i);
});
