import { createUsgsEarthquakeSource } from '../layers/earthquakes/source.js';
import { createBundledCableSource } from '../layers/submarineCables/bundledSource.js';
import {
  createPublicIncidentSource,
  createCombinedPublicIncidentSource,
} from '../layers/publicIncidents/source.js';
import { PUBLIC_INCIDENT_PROVIDERS } from '../layers/publicIncidents/providers.js';

/** Construct the existing reference feeds independently of application setup. */
export function createReferenceSources() {
  return {
    earthquakes: createUsgsEarthquakeSource(),
    cables: createBundledCableSource(),
      publicIncidents: createCombinedPublicIncidentSource(
      PUBLIC_INCIDENT_PROVIDERS.map((provider) =>
        createPublicIncidentSource(provider.id),
      ),
    ),
  };
}
