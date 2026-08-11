/**
 * EAASI Partners Summit 2026 — Service Worker
 *
 * Strategy:
 * - App shell (HTML/CSS/JS): cache-first, populated on install
 * - content/*.json (agenda, venue, speakers, etc.): network-first,
 *   falling back to cache so the app works offline once content has
 *   been fetched at least once.
 *
 * This is a plain static build (no bundler), so the shell file list
 * below is the real, final set of files — update it if files are
 * added/renamed.
 */

const CACHE_VERSION = "eaasi-summit-v12";
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;

const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/styles.css",
  "/js/main.js",
  "/js/data.js",
  "/js/icons.js",
  "/js/utils.js",
  "/js/components/home.js",
  "/js/components/venue.js",
  "/js/components/agenda.js",
  "/js/components/speakers.js",
  "/js/components/social.js",
  "/js/components/additional.js",
  "/js/components/sponsors.js",
  "/js/components/committees.js",
  "/js/components/practical.js",
  "/js/components/tickets.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/assets/eaasi-logo.png",
  "/assets/sponsors/hexagon.avif",
  "/assets/sponsors/esri.avif",
  "/assets/sponsors/riegl.avif",
  "/assets/sponsors/flai.avif",
  "/assets/sponsors/pointly.avif",
  "/assets/sponsors/dielmo3d.avif",
  "/assets/sponsors/vexcel.avif",
  "/assets/sponsors/diamond-aircraft.png",
  "/assets/sponsors/xeos.avif",
  "/assets/sponsors/teledyne.png",
  "/assets/sponsors/phaseone.avif",
  "/assets/sponsors/simactive.avif",
  "/assets/venue/hotel-1.avif",
  "/assets/practical/vista-alicante.avif",
];

const CONTENT_FILES = [
  "/content/home.json",
  "/content/tickets.json",
  "/content/venue.json",
  "/content/agenda.json",
  "/content/speakers.json",
  "/content/social_activities.json",
  "/content/additional_activities.json",
  "/content/sponsors.json",
  "/content/committees.json",
  "/content/practical_info.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const shellCache = await caches.open(APP_SHELL_CACHE);
      await shellCache.addAll(APP_SHELL_FILES);
      const contentCache = await caches.open(CONTENT_CACHE);
      await contentCache.addAll(CONTENT_FILES);
      self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      );
      self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Content JSON: network-first, cache fallback (keeps content fresh
  // when online, still works offline).
  if (url.pathname.startsWith("/content/")) {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CONTENT_CACHE);
          cache.put(request, fresh.clone());
          return fresh;
        } catch (err) {
          const cached = await caches.match(request);
          if (cached) return cached;
          throw err;
        }
      })()
    );
    return;
  }

  // App shell: cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      return cached || fetch(request);
    })()
  );
});
