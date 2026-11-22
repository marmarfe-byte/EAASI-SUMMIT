/**
 * EAASI Partners Summit — Service Worker (farewell page between summits)
 *
 * Replaces the 2026 event-app worker on attendees' phones: on activate it deletes
 * every older cache, and the old app reloads itself when this worker takes control,
 * so installed apps switch to the farewell page.
 *
 * Strategy: network-first for everything, cache fallback so the farewell page and
 * the game still open offline. PDFs are not precached.
 */

const CACHE_VERSION = "eaasi-summit-v63-farewell";

const PRECACHE_FILES = [
  "/",
  "/index.html",
  "/assets/farewell-2026.webp",
  "/play/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION);
      // One by one so a single missing file (e.g. "/play/" on the local dev server,
      // which has no directory index) does not abort the install.
      await Promise.allSettled(PRECACHE_FILES.map((u) => cache.add(new Request(u, { cache: "reload" }))));
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)));
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      try {
        const fresh = await fetch(request);
        if (fresh.ok && !request.url.endsWith(".pdf")) {
          const cache = await caches.open(CACHE_VERSION);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cached = (await caches.match(request)) || (request.mode === "navigate" && (await caches.match("/")));
        if (cached) return cached;
        throw err;
      }
    })()
  );
});
