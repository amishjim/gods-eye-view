import { createPublicIncidentsLayer } from '../../layers/publicIncidents/index.js';
import * as context from '../../data/contextStore.js';

/** Wire Public Incidents into the application layer catalog. */
export function createApplicationPublicIncidents(options) {
  return createPublicIncidentsLayer({
    ...options,
    services: { context },
  });
}