const CACHE_NAME = 'money-superapp-v1.3.9';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './dashboard.html',
  './rebalance.html',
  './months-slips.html',
  './tax-calculator-base.html',
  './tax-calculator.html',
  './remaining-money.html',
  './debt-calculator.html',
  './css/tailwind-lite.css',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Fetch in background to keep cache fresh (stale-while-revalidate for local origin)
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Offline fallback, cachedResponse handles it */});

        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // Fallback for HTML documents if offline and not in cache
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return caches.match('./index.html');
      }
    })
  );
});
