/**
 * Minimal Connect-compatible middleware stack for the production Node server.
 *
 * Existing GEV provider plugins register themselves with:
 *
 *   server.middlewares.use('/api/example', handler)
 *
 * Vite normally supplies that middleware container. Production must not depend
 * on Vite, so this module supplies the small subset of mounting behavior the
 * provider modules require.
 *
 * A mounted handler receives req.url with the mount prefix removed, matching
 * Connect/Vite middleware semantics. The original URL is restored afterward
 * so later middleware sees the correct request.
 */

export function createMiddlewareStack() {
  const layers = [];

  function use(route, handler) {
    if (typeof route === 'function') {
      handler = route;
      route = '/';
    }

    if (typeof route !== 'string' || !route.startsWith('/')) {
      throw new TypeError('Middleware route must be an absolute path');
    }

    if (typeof handler !== 'function') {
      throw new TypeError('Middleware handler must be a function');
    }

    layers.push({
      route: route.length > 1 ? route.replace(/\/+$/, '') : '/',
      handler,
    });
  }

  async function handle(req, res) {
    const originalUrl = req.url || '/';
    const pathname = new URL(originalUrl, 'http://localhost').pathname;

    for (const layer of layers) {
      if (
        layer.route !== '/' &&
        pathname !== layer.route &&
        !pathname.startsWith(`${layer.route}/`)
      ) {
        continue;
      }

      const before = req.url;

      if (layer.route !== '/') {
        const parsed = new URL(before || '/', 'http://localhost');
        const remainder = parsed.pathname.slice(layer.route.length) || '/';
        req.url = `${remainder}${parsed.search}`;
      }

      let nextCalled = false;

      const next = () => {
        nextCalled = true;
      };

      try {
        await layer.handler(req, res, next);
      } finally {
        req.url = before;
      }

      if (res.writableEnded || res.headersSent) return true;
      if (!nextCalled) return true;
    }

    req.url = originalUrl;
    return false;
  }

  return {
    use,
    handle,
    get size() {
      return layers.length;
    },
  };
}