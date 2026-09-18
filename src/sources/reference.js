import { createUsgsEarthquakeSource } from '../layers/earthquakes/source.js';
import { createBundledCableSource } from '../layers/submarineCables/bundledSource.js';
import {
  createAustinFireIncidentSource,
  createSeattleFireIncidentSource,
  createCombinedPublicIncidentSource,
} from '../layers/publicIncidents/source.js';

/** Construct the existing reference feeds independently of application setup. */
export function createReferenceSources() {
  return {
    earthquakes: createUsgsEarthquakeSource(),
    cables: createBundledCableSource(),
    publicIncidents: createCombinedPublicIncidentSource([
      createAustinFireIncidentSource(),
      createSeattleFireIncidentSource(),
    ]),
  };
}
