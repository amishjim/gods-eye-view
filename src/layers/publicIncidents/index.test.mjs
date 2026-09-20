import test from 'node:test';
import assert from 'node:assert/strict';

import { createPublicIncidentsLayer } from './index.js';

test('labels the Public Incidents count as a global total', () => {
  const layer = createPublicIncidentsLayer({
    source: {
      async getSnapshot() {
        return [];
      },
    },
  });

  assert.deepEqual(layer.getStats(), {
    count: 0,
    countLabel: '0 total',
    lastUpdate: null,
    error: null,
  });
});
