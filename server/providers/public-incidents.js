import { readResponseTextCapped } from './common/http.js';
import { PUBLIC_INCIDENT_PROVIDERS } from '../../src/layers/publicIncidents/providers.js';

const PUBLIC_INCIDENTS_PROXY_TIMEOUT_MS = 15000;
const PUBLIC_INCIDENTS_MAX_BODY_BYTES = 10 * 1024 * 1024;

function getProvider(providerId) {
  return PUBLIC_INCIDENT_PROVIDERS.find(
    (provider) => provider.id === providerId,
  );
}

function contentTypeForProvider(provider, upstream) {
  const upstreamType = upstream.headers.get('content-type');

  if (upstreamType) return upstreamType;

  if (provider.platform === 'rss' || provider.platform === 'atom') {
    return 'application/xml; charset=utf-8';
  }

  return 'application/json; charset=utf-8';
}

/**
 * Fetch one registered Public Incidents provider server-side.
 *
 * The browser never supplies an upstream URL. It supplies only a provider ID,
 * which is resolved against PUBLIC_INCIDENT_PROVIDERS. Redirects are refused
 * so an authoritative endpoint cannot redirect the proxy to an unregistered
 * destination.
 */
export async function fetchPublicIncidentUpstream(
  provider,
  {
    fetchImpl = fetch,
    timeoutMs = PUBLIC_INCIDENTS_PROXY_TIMEOUT_MS,
    maxBytes = PUBLIC_INCIDENTS_MAX_BODY_BYTES,
  } = {},
) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  let upstream;

  try {
    upstream = await fetchImpl(provider.endpoint, {
      method: 'GET',
      headers: {
        Accept:
          provider.platform === 'rss' || provider.platform === 'atom'
            ? 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
            : 'application/json, application/geo+json, */*',
        'User-Agent':
          'gods-eye-view-public-incidents-proxy/1.0 (+https://github.com/bilawalsidhu/gods-eye-view)',
      },
      redirect: 'manual',
      signal: controller.signal,
    });

    if (upstream.status >= 300 && upstream.status < 400) {
      try {
        void upstream.body?.cancel().catch(() => {});
      } catch {
        /* no-op */
      }

      const error = new Error(
        `${provider.label} upstream redirect refused`,
      );
      error.code = 'PUBLIC_INCIDENTS_REDIRECT';
      throw error;
    }

    const body = await readResponseTextCapped(
      upstream,
      maxBytes,
      controller.signal,
    );

    return {
      status: upstream.status,
      contentType: contentTypeForProvider(provider, upstream),
      body,
    };
  } catch (error) {
    controller.abort();

    if (upstream?.body && !upstream.body.locked) {
      void upstream.body.cancel().catch(() => {});
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Vite plugin: allowlisted Public Incidents upstream proxy.
 *
 * GET /api/public-incidents/<provider-id>
 *
 * Only providers registered in PUBLIC_INCIDENT_PROVIDERS can be fetched.
 * Arbitrary upstream URLs are never accepted from the browser.
 */
export function publicIncidentsProxy() {
  const installMiddleware = (server) => {
    server.middlewares.use('/api/public-incidents', async (req, res) => {
      const sendJson = (status, payload) => {
        if (res.headersSent) return;

        res.writeHead(status, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        });
        res.end(JSON.stringify(payload));
      };

      try {
        if (req.method !== 'GET') {
          sendJson(405, { error: 'Method Not Allowed' });
          return;
        }

        const url = new URL(req.url || '/', 'http://localhost');
        const providerId = decodeURIComponent(
          url.pathname.replace(/^\/+/, '').split('/')[0] || '',
        );

        if (!providerId || !/^[a-z0-9-]+$/i.test(providerId)) {
          sendJson(400, { error: 'Invalid Public Incidents provider' });
          return;
        }

        const provider = getProvider(providerId);

        if (!provider) {
          sendJson(404, { error: 'Unknown Public Incidents provider' });
          return;
        }

        const upstream = await fetchPublicIncidentUpstream(provider);

        if (res.headersSent) return;

        res.writeHead(upstream.status, {
          'Content-Type': upstream.contentType,
          'Cache-Control': 'no-store',
          'X-Public-Incidents-Provider': provider.id,
        });
        res.end(upstream.body);
      } catch (error) {
        if (error?.name === 'AbortError') {
          sendJson(504, { error: 'Public Incidents upstream timeout' });
          return;
        }

        if (error?.code === 'PUBLIC_INCIDENTS_REDIRECT') {
          sendJson(502, { error: 'Public Incidents upstream redirect refused' });
          return;
        }

        if (error?.code === 'RESPONSE_TOO_LARGE') {
          sendJson(502, {
            error: 'Public Incidents upstream response too large',
          });
          return;
        }

        console.error(
          '[Public Incidents Proxy]',
          error?.message || String(error),
        );
        sendJson(502, { error: 'Public Incidents proxy error' });
      }
    });
  };

  return {
    name: 'public-incidents-proxy',
    configureServer: installMiddleware,
    configurePreviewServer: installMiddleware,
  };
}