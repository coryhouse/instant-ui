/*
 * Service worker for the "Service worker cache" demo. Plain JS, no Workbox.
 *
 * Safety: it is registered with scope "/caching/sw" so it only controls that page,
 * and it only intercepts same-origin GET requests to two path prefixes.
 * Everything else (Next.js assets, HMR, other APIs, non-GET) goes straight to the network.
 */
const CACHE = "sw-demo-v1";
const STATIC_ASSETS = ["/sw-demo/badge.svg"];

self.addEventListener("install", (event) => {
  // Precache static assets, then activate immediately instead of waiting for old tabs to close.
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  // Delete old cache versions and take control of open pages in scope right away.
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("sw-demo-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never touch mutations
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/caching/sw/")) {
    event.respondWith(staleWhileRevalidate(event));
  } else if (url.pathname.startsWith("/sw-demo/")) {
    event.respondWith(cacheFirst(request));
  }
  // Anything else: no respondWith → the browser handles it normally.
});

/** API data: answer from cache instantly, refresh the cache in the background. */
async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(event.request);
  const network = fetch(event.request).then(async (res) => {
    if (res.ok) {
      const headers = new Headers(res.headers);
      headers.set("x-sw-cached-at", new Date().toISOString());
      await cache.put(event.request, new Response(await res.clone().blob(), { status: res.status, statusText: res.statusText, headers }));
    }
    return res;
  });

  if (cached) {
    event.waitUntil(network.catch(() => {})); // offline? keep serving the cached copy
    return withHeader(cached, "x-sw-cache", "hit");
  }
  try {
    return withHeader(await network, "x-sw-cache", "miss");
  } catch {
    return Response.json({ error: "Offline and nothing cached yet" }, { status: 503, headers: { "x-sw-cache": "offline" } });
  }
}

/** Static assets: if it's in the cache, never hit the network. */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res.ok) await cache.put(request, res.clone());
  return res;
}

function withHeader(res, name, value) {
  const headers = new Headers(res.headers);
  headers.set(name, value);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
