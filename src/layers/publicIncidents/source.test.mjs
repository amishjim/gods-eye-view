import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAustinFireIncidentSource,
  createSeattleFireIncidentSource,
  createCombinedPublicIncidentSource,
} from './source.js';

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

test('adapts Seattle Fire records into Public Incident records', async () => {
  let requestedUrl;
  let requestedOptions;

  const source = createSeattleFireIncidentSource({
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      requestedOptions = options;

      return {
        ok: true,
        async json() {
          return [{
            address: '2853 Nw Market St',
            type: 'Aid Response',
            datetime: '2026-09-18T15:35:00.000',
            latitude: '47.668648',
            longitude: '-122.394595',
            incident_number: 'F260133632',
          }];
        },
      };
    },
  });

  const controller = new AbortController();
  const snapshot = await source.getSnapshot({ signal: controller.signal });

  assert.match(
    requestedUrl,
    /data\.seattle\.gov\/resource\/kzjm-xkqj\.json/,
  );
  assert.match(requestedUrl, /\$order=datetime%20DESC/);
  assert.equal(requestedOptions.signal, controller.signal);

  assert.equal(snapshot.length, 1);

  const incident = snapshot[0];

  assert.equal(incident.stableId, 'seattle-fire:F260133632');
  assert.equal(incident.sourceId, 'F260133632');
  assert.equal(incident.provider, 'seattle-fire');
  assert.equal(incident.type, 'Aid Response');
  assert.equal(incident.title, 'Aid Response');
  assert.equal(incident.description, '2853 Nw Market St');
  assert.equal(incident.lat, 47.668648);
  assert.equal(incident.lon, -122.394595);
  assert.equal(incident.status, '');
  assert.equal(incident.source, 'Seattle Fire Department');
  assert.equal(
    incident.url,
    'https://data.seattle.gov/d/kzjm-xkqj',
  );

  assert.equal(
    incident.time,
    Date.parse('2026-09-18T22:35:00.000Z'),
  );
});

test('Seattle keeps unknown status blank rather than inventing one', async () => {
  const source = createSeattleFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return [{
          address: '25th Ave Ne / Ne 55th St',
          type: 'Medic Response',
          datetime: '2026-09-18T15:24:00.000',
          latitude: '47.668526',
          longitude: '-122.300619',
          incident_number: 'F260133627',
        }];
      },
    }),
  });

  const [incident] = await source.getSnapshot();

  assert.equal(incident.status, '');
});

test('invalid Seattle records are filtered by normalization', async () => {
  const source = createSeattleFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return [
          {
            address: 'Good',
            type: 'Aid Response',
            datetime: '2026-09-18T15:35:00.000',
            latitude: '47.6',
            longitude: '-122.3',
            incident_number: 'GOOD',
          },
          {
            address: 'Bad location',
            type: 'Aid Response',
            datetime: '2026-09-18T15:35:00.000',
            latitude: 'not-a-coordinate',
            longitude: '-122.3',
            incident_number: 'BAD',
          },
          {
            address: 'Missing id',
            type: 'Aid Response',
            datetime: '2026-09-18T15:35:00.000',
            latitude: '47.6',
            longitude: '-122.3',
          },
        ];
      },
    }),
  });

  const snapshot = await source.getSnapshot();

  assert.equal(snapshot.length, 1);
  assert.equal(snapshot[0].sourceId, 'GOOD');
});

test('throws a useful error for a Seattle HTTP failure', async () => {
  const source = createSeattleFireIncidentSource({
    fetchImpl: async () => ({
      ok: false,
      status: 503,
    }),
  });

  await assert.rejects(
    () => source.getSnapshot(),
    /Seattle Fire HTTP 503/,
  );
});

test('rejects a malformed Seattle snapshot', async () => {
  const source = createSeattleFireIncidentSource({
    fetchImpl: async () => ({
      ok: true,
      async json() {
        return { not: 'an array' };
      },
    }),
  });

  await assert.rejects(
    () => source.getSnapshot(),
    /Seattle Fire returned an invalid snapshot/,
  );
});

test('Seattle source requires a fetch implementation', () => {
  assert.throws(
    () => createSeattleFireIncidentSource({ fetchImpl: null }),
    /Seattle Fire source requires fetch/,
  );
});

test('combined source merges provider snapshots', async () => {
  const source = createCombinedPublicIncidentSource([
    {
      async getSnapshot() {
        return [{ stableId: 'austin-fire:A1' }];
      },
    },
    {
      async getSnapshot() {
        return [
          { stableId: 'seattle-fire:S1' },
          { stableId: 'seattle-fire:S2' },
        ];
      },
    },
  ]);

  const snapshot = await source.getSnapshot();

  assert.deepEqual(
    snapshot.map((incident) => incident.stableId),
    [
      'austin-fire:A1',
      'seattle-fire:S1',
      'seattle-fire:S2',
    ],
  );
});

test('combined source requires valid provider sources', () => {
  assert.throws(
    () => createCombinedPublicIncidentSource([]),
    /requires snapshot sources/,
  );

  assert.throws(
    () => createCombinedPublicIncidentSource([{}]),
    /requires snapshot sources/,
  );
});
