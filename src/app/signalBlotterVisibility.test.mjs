import test from 'node:test';
import assert from 'node:assert/strict';

import { applySignalBlotterLayerVisibility } from './constructCatalog.js';

function layers() {
  return [
    { id: 'flights' },
    { id: 'military' },
    { id: 'earthquakes' },
    { id: 'public-incidents' },
    { id: 'local-firms' },
    { id: 'ais-live-vessels' },
    { id: 'satellites' },
    { id: 'cctv' },
  ];
}

test('Signal Blotter exposes only public-safety layers in the toggle panel', () => {
  const result = applySignalBlotterLayerVisibility(
    layers(),
    'signalblotter.com',
  );

  const visible = result
    .filter((layer) => layer.showInTogglePanel !== false)
    .map((layer) => layer.id);

  assert.deepEqual(visible, [
    'earthquakes',
    'public-incidents',
    'local-firms',
  ]);
});

test('www Signal Blotter uses the same public-safety layer profile', () => {
  const result = applySignalBlotterLayerVisibility(
    layers(),
    'www.signalblotter.com',
  );

  assert.equal(
    result.find((layer) => layer.id === 'flights').showInTogglePanel,
    false,
  );

  assert.notEqual(
    result.find((layer) => layer.id === 'public-incidents').showInTogglePanel,
    false,
  );
});

test('normal GEV hosts retain the full layer catalog', () => {
  const original = layers();
  const result = applySignalBlotterLayerVisibility(
    original,
    'localhost',
  );

  assert.equal(result, original);

  for (const layer of result) {
    assert.equal(layer.showInTogglePanel, undefined);
  }
});
