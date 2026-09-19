import test from 'node:test';
import assert from 'node:assert/strict';

import { PUBLIC_INCIDENT_PROVIDERS } from './providers.js';

test('public incident provider registry has unique valid providers', () => {
  assert.ok(PUBLIC_INCIDENT_PROVIDERS.length >= 2);

  const ids = new Set();

  for (const provider of PUBLIC_INCIDENT_PROVIDERS) {
    assert.equal(typeof provider.id, 'string');
    assert.ok(provider.id.length > 0);
    assert.equal(
      ids.has(provider.id),
      false,
      `duplicate provider id: ${provider.id}`,
    );
    ids.add(provider.id);

    assert.ok(
      ['socrata', 'arcgis'].includes(provider.platform),
      `${provider.id} has invalid platform`,
    );

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
      'time',
    ]) {
      assert.equal(
        typeof provider.fields[fieldName],
        'string',
        `${provider.id} missing field mapping: ${fieldName}`,
      );
    }

    if (provider.platform === 'socrata') {
      assert.equal(
        typeof provider.fields.lat,
        'string',
        `${provider.id} missing latitude field mapping`,
      );
      assert.equal(
        typeof provider.fields.lon,
        'string',
        `${provider.id} missing longitude field mapping`,
      );
    } else if (provider.platform === 'arcgis') {
      assert.equal(
        provider.fields.lat,
        null,
        `${provider.id} ArcGIS latitude mapping should be null`,
      );
      assert.equal(
        provider.fields.lon,
        null,
        `${provider.id} ArcGIS longitude mapping should be null`,
      );
    }

    assert.ok(
      provider.fields.status === null ||
        typeof provider.fields.status === 'string',
      `${provider.id} has invalid status mapping`,
    );
  }
});