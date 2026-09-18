import test from 'node:test';
import assert from 'node:assert/strict';

import { createAustinFireIncidentSource } from './source.js';

test('adapts Austin Fire records into Public Incident records', async () => {
  let requestedUrl;
  let requestedOptions;

  const source = createAustinFireIncidentSource({
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      requestedOptions = options;

      return {
        ok: true,
        async json() {
          return [
            {
              traffic_report_id: 'AFD-123',
              published_date: '2026-09-18T21:30:00.000',
              issue_reported: 'Structure Fire',
              address: '100 Congress Ave',
              latitude: '30.2672',
              longitude: '-97.7431',
              traffic_report_status: 'ACTIVE',
            },
          ];
        },
      };
    },
  });

  const controller = new AbortController();
  const snapshot = await source.getSnapshot({
    signal: controller.signal,
  });

  assert.match(
    requestedUrl,
    /data\.austintexas\.gov\/resource\/wpu4-x69d\.json/,
  );
  assert.match(
    requestedUrl,
    /traffic_report_status='ACTIVE'/,
  );
  assert.equal(requestedOptions.signal, controller.signal);

  assert.equal(snapshot.length, 1);

  const incident = snapshot[0];

  assert.equal(incident.stableId, 'austin-fire:AFD-123');
  assert.equal(incident.sourceId, 'AFD-123');
  assert.equal(incident.provider, 'austin-fire');
  assert.equal(incident.type, 'Structure Fire');
  assert.equal(incident.title, 'Structure Fire');
  assert.equal(incident.description, '100 Congress Ave');
  assert.equal(incident.lat, 30.2672);
  assert.equal(incident.lon, -97.7431);
  assert.equal(incident.status, 'ACTIVE');
  assert.equal(incident.source, 'Austin Fire Department');
  assert.equal(
    incident.url,
    'https://data.austintexas.gov/d/wpu4-x69d',
  );
  assert.equal(
    incident.time,
    Date.parse('2026-09-18T21:30:00.000'),
  );
});

test('invalid Austin records are filtered by normalization', async () => {
  const source = createAustinFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return [
          {
            traffic_report_id: 'GOOD',
            issue_reported: 'Fire Alarm',
            latitude: '30',
            longitude: '-97',
            traffic_report_status: 'ACTIVE',
          },
          {
            traffic_report_id: 'BAD-LOCATION',
            issue_reported: 'Fire Alarm',
            latitude: 'not-a-coordinate',
            longitude: '-97',
            traffic_report_status: 'ACTIVE',
          },
          {
            issue_reported: 'Missing ID',
            latitude: '30',
            longitude: '-97',
            traffic_report_status: 'ACTIVE',
          },
        ];
      },
    }),
  });

  const snapshot = await source.getSnapshot();

  assert.equal(snapshot.length, 1);
  assert.equal(snapshot[0].sourceId, 'GOOD');
  assert.equal(snapshot[0].time, null);
});

test('throws a useful error for an Austin HTTP failure', async () => {
  const source = createAustinFireIncidentSource({
    fetchImpl: async () => ({
      ok: false,
      status: 503,
    }),
  });

  await assert.rejects(
    () => source.getSnapshot(),
    /Austin Fire HTTP 503/,
  );
});

test('rejects a malformed Austin snapshot', async () => {
  const source = createAustinFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return { not: 'an array' };
      },
    }),
  });

  await assert.rejects(
    () => source.getSnapshot(),
    /Austin Fire returned an invalid snapshot/,
  );
});

test('does not fetch when already aborted', async () => {
  let fetchCalled = false;

  const source = createAustinFireIncidentSource({
    fetchImpl: async () => {
      fetchCalled = true;

      return {
        ok: true,
        async json() {
          return [];
        },
      };
    },
  });

  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    () => source.getSnapshot({ signal: controller.signal }),
    (error) => error?.name === 'AbortError',
  );

  assert.equal(fetchCalled, false);
});

test('does not publish a response aborted while fetching', async () => {
  const controller = new AbortController();

  const source = createAustinFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        controller.abort();

        return [
          {
            traffic_report_id: 'TOO-LATE',
            issue_reported: 'Fire Alarm',
            latitude: '30',
            longitude: '-97',
            traffic_report_status: 'ACTIVE',
          },
        ];
      },
    }),
  });

  await assert.rejects(
    () => source.getSnapshot({ signal: controller.signal }),
    (error) => error?.name === 'AbortError',
  );
});

test('requires a fetch implementation', () => {
  assert.throws(
    () =>
      createAustinFireIncidentSource({
        fetchImpl: null,
      }),
    /Austin Fire source requires fetch/,
  );
});
