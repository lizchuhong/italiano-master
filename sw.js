const PREFIX = 'italiano-master:';
const CACHE = PREFIX + 'v22';
const LEGACY = ["italiano-audited-v13", "italiano-final-audit-v9", "italiano-guided-v12", "italiano-plus-v10", "italiano-plus-v11", "italiano-release-v14"];
const ASSETS = [
  './', './index.html', './curriculum.js', './italian-deep-practice.js',
  './study-style.css', './manifest.webmanifest', './icon.svg', './travel-atlas.js',
  './learning-plus.js?v=22', './learning-plus.css', './guided-flow.css?v=18', './guided-flow.js?v=22',
  './italian-tour-day.js?v=22',
  './italian-study-lessons.js?v=20',
  './study-upgrade.js?v=17', './verified-italian-lessons.js?v=16',
];

const scope = new URL(self.registration.scope);
const versioned = new Set(ASSETS.filter(asset => asset.includes('?v='))
  .map(asset => new URL(asset, scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const requests = ASSETS.map(asset => new Request(new URL(asset, scope), { cache: 'reload' }));
    await cache.addAll(requests);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE &&
      (key.startsWith(PREFIX) || LEGACY.includes(key))).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (versioned.has(url.href)) {
      const saved = await cache.match(request);
      if (saved) return saved;
    }
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone()).catch(() => {});
      return response;
    } catch {
      return (await cache.match(request)) || Response.error();
    }
  })());
});
