import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizePublicIncident,
  normalizePublicIncidentSnapshot,
} from './records.js';

test('normalizes a valid provider record', () => {
  const incident = normalizePublicIncident({
    sourceId: 'ABC-123',
    provider: 'test-provider',
    type: 'Structure Fire',
    title: 'Structure Fire',
    description: '100 Main St',
    lat: '30.2672',
    lon: '-97.7431',
    time: 1789761600000,
    status: 'ACTIVE',
    source: 'Test Fire Department',
    url: 'https://example.test/incidents/ABC-123',
  });

  assert.deepEqual(incident, {
    stableId: 'test-provider:ABC-123',
    sourceId: 'ABC-123',
    provider: 'test-provider',
    type: 'Structure Fire',
    title: 'Structure Fire',
    description: '100 Main St',
    lat: 30.2672,
    lon: -97.7431,
    time: 1789761600000,
    status: 'ACTIVE',
    source: 'Test Fire Department',
    url: 'https://example.test/incidents/ABC-123',
  });

  assert.equal(Object.isFrozen(incident), true);
});

test('rejects records without a source ID', () => {
  assert.equal(
    normalizePublicIncident({
      provider: 'test-provider',
      lat: 30,
      lon: -97,
    }),
    null,
  );
});

test('rejects invalid or out-of-range coordinates', () => {
  const invalidCoordinates = [
    { lat: 'not-a-number', lon: -97 },
    { lat: 30, lon: 'not-a-number' },
    { lat: 91, lon: -97 },
    { lat: -91, lon: -97 },
    { lat: 30, lon: 181 },
    { lat: 30, lon: -181 },
  ];

  for (const coordinates of invalidCoordinates) {
    assert.equal(
      normalizePublicIncident({
        sourceId: 'ABC-123',
        provider: 'test-provider',
        ...coordinates,
      }),
      null,
    );
  }
});

test('preserves a missing or null timestamp as unknown', () => {
  const missing = normalizePublicIncident({
    sourceId: 'missing-time',
    provider: 'test-provider',
    lat: 30,
    lon: -97,
  });

  const explicitNull = normalizePublicIncident({
    sourceId: 'null-time',
    provider: 'test-provider',
    lat: 30,
    lon: -97,
    time: null,
  });

  assert.equal(missing.time, null);
  assert.equal(explicitNull.time, null);
});

test('creates provider-qualified stable IDs', () => {
  const first = normalizePublicIncident({
    sourceId: '42',
    provider: 'provider-a',
    lat: 30,
    lon: -97,
  });

  const second = normalizePublicIncident({
    sourceId: '42',
    provider: 'provider-b',
    lat: 30,
    lon: -97,
  });

  assert.equal(first.stableId, 'provider-a:42');
  assert.equal(second.stableId, 'provider-b:42');
  assert.notEqual(first.stableId, second.stableId);
});

test('snapshot normalization filters invalid records', () => {
  const snapshot = normalizePublicIncidentSnapshot([
    {
      sourceId: 'good-1',
      provider: 'test-provider',
      lat: 30,
      lon: -97,
    },
    {
      sourceId: '',
      provider: 'test-provider',
      lat: 30,
      lon: -97,
    },
    {
      sourceId: 'bad-location',
      provider: 'test-provider',
      lat: 500,
      lon: -97,
    },
    {
      sourceId: 'good-2',
      provider: 'test-provider',
      lat: 31,
      lon: -98,
    },
  ]);

  assert.equal(snapshot.length, 2);
  assert.deepEqual(
    snapshot.map((incident) => incident.sourceId),
    ['good-1', 'good-2'],
  );
});

test('snapshot normalization returns an empty array for non-arrays', () => {
  assert.deepEqual(normalizePublicIncidentSnapshot(null), []);
  assert.deepEqual(normalizePublicIncidentSnapshot({}), []);
});
