import test from 'node:test';
import assert from 'node:assert/strict';

import { createMiddlewareStack } from './middleware-stack.js';

function responseFixture() {
  return {
    headersSent: false,
    writableEnded: false,
    statusCode: null,
    headers: null,
    body: '',
    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      this.headers = headers;
      this.headersSent = true;
    },
    end(body = '') {
      this.body += body;
      this.writableEnded = true;
    },
  };
}

test('mounted middleware receives the route prefix stripped', async () => {
  const stack = createMiddlewareStack();
  let seenUrl = null;

  stack.use('/api/public-incidents', (req, res) => {
    seenUrl = req.url;
    res.writeHead(200);
    res.end('ok');
  });

  const req = {
    url: '/api/public-incidents/austin-fire',
    method: 'GET',
  };
  const res = responseFixture();

  const handled = await stack.handle(req, res);

  assert.equal(handled, true);
  assert.equal(seenUrl, '/austin-fire');
  assert.equal(req.url, '/api/public-incidents/austin-fire');
  assert.equal(res.statusCode, 200);
  assert.equal(res.body, 'ok');
});

test('mounted middleware preserves the query string', async () => {
  const stack = createMiddlewareStack();
  let seenUrl = null;

  stack.use('/api/example', (req, res) => {
    seenUrl = req.url;
    res.end();
  });

  const req = {
    url: '/api/example/item?q=test&limit=5',
    method: 'GET',
  };
  const res = responseFixture();

  await stack.handle(req, res);

  assert.equal(seenUrl, '/item?q=test&limit=5');
});

test('unmatched requests fall through', async () => {
  const stack = createMiddlewareStack();

  stack.use('/api/example', (_req, res) => {
    res.end('unexpected');
  });

  const req = {
    url: '/different/path',
    method: 'GET',
  };
  const res = responseFixture();

  const handled = await stack.handle(req, res);

  assert.equal(handled, false);
  assert.equal(res.writableEnded, false);
});

test('next continues to later middleware', async () => {
  const stack = createMiddlewareStack();
  const calls = [];

  stack.use('/api', (_req, _res, next) => {
    calls.push('first');
    next();
  });

  stack.use('/api/example', (_req, res) => {
    calls.push('second');
    res.end('done');
  });

  const req = {
    url: '/api/example',
    method: 'GET',
  };
  const res = responseFixture();

  const handled = await stack.handle(req, res);

  assert.equal(handled, true);
  assert.deepEqual(calls, ['first', 'second']);
  assert.equal(res.body, 'done');
});

test('middleware that neither ends the response nor calls next stops the chain', async () => {
  const stack = createMiddlewareStack();
  const calls = [];

  stack.use('/api', () => {
    calls.push('first');
  });

  stack.use('/api/example', (_req, res) => {
    calls.push('second');
    res.end('done');
  });

  const req = {
    url: '/api/example',
    method: 'GET',
  };
  const res = responseFixture();

  const handled = await stack.handle(req, res);

  assert.equal(handled, true);
  assert.deepEqual(calls, ['first']);
  assert.equal(res.writableEnded, false);
});