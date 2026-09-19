import test from 'node:test';
import assert from 'node:assert/strict';

import { PUBLIC_INCIDENT_PROVIDERS } from './providers.js';

test('public incident provider registry has unique valid providers', () => {
  assert.ok(PUBLIC_INCIDENT_PROVIDERS.length >= 2);

  const ids = new Set();

  for (const provider of PUBLIC_INCIDENT_PROVIDERS) {
    assert.equal(typeof provider.id, 'string');
    assert.ok(provider.id.length > 0);
    assert.equal(ids.has(provider.id), false, `duplicate provider id: ${provider.id}`);
    ids.add(provider.id);

    assert.equal(provider.platform, 'socrata');

    assert.equal(typeof provider.cadenceMinutes, 'number');
    assert.ok(
      Number.isFinite(provider.cadenceMinutes) &&
        provider.cadenceMinutes > 0,
      `${provider.id} has invalid cadence`,
    );

    assert.ok(
      ['live', 'recent', 'historical'].includes(provider.freshnessClass),
      `${provider.id} has invalid freshness class`,
    );
    assert.equal(typeof provider.agency, 'string');
    assert.ok(provider.agency.length > 0);

    assert.equal(typeof provider.label, 'string');
    assert.ok(provider.label.length > 0);

    assert.equal(typeof provider.endpoint, 'string');
    assert.match(provider.endpoint, /^https:\/\//);

    assert.equal(typeof provider.sourceUrl, 'string');
    assert.match(provider.sourceUrl, /^https:\/\//);

    assert.equal(typeof provider.fields, 'object');

    for (const fieldName of [
      'sourceId',
      'type',
      'title',
      'description',
      'lat',
      'lon',
      'time',
    ]) {
      assert.equal(
        typeof provider.fields[fieldName],
        'string',
        `${provider.id} missing field mapping: ${fieldName}`,
      );
    }

    assert.ok(
      provider.fields.status === null ||
        typeof provider.fields.status === 'string',
      `${provider.id} has invalid status mapping`,
    );
  }
});