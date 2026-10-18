const CACHE_NAME = 'money-superapp-v2.5.30';
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
  './js/shared.js',
  './js/app-shell.js',
  './js/dashboard.js',
  './js/remaining-money.js',
  './js/rebalance.js',
  './js/debt-calculator.js',
  './js/tax-calculator-base.js',
  './js/tax-calculator.js',
  './js/months-slips.js',
  './css/tailwind-lite.css',
  './css/theme.css',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        ASSETS_TO_CACHE.map(url => {
          return fetch(url, { cache: 'reload' }).then(response => {
            if (response.ok) return cache.put(url, response);
            return Promise.reject(new Error(`Failed to cache ${url}: ${response.status}`));
          });
        })
      );
    })
  );
});

// Phase 73: Listen for SKIP_WAITING message from App Shell update toast
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== 'money-superapp-shared-payload') {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Phase 80: Intercept Web Share Target POST requests
  if (event.request.method === 'POST') {
    const url = new URL(event.request.url);
    if (url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
      event.respondWith((async () => {
        try {
          const formData = await event.request.formData();
          const file = formData.get('statement_files') || formData.get('file');
          const title = formData.get('title') || '';
          const text = formData.get('text') || '';
          const shareUrl = formData.get('url') || '';

          let payload = null;
          if (file && typeof file.text === 'function') {
            const content = await file.text();
            payload = {
              name: file.name || 'shared_statement.csv',
              type: file.type || 'text/plain',
              size: file.size || content.length,
              content: content,
              title: title,
              text: text,
              timestamp: Date.now()
            };
          } else if (text || title || shareUrl) {
            payload = {
              name: 'shared_text.txt',
              type: 'text/plain',
              size: (text || shareUrl).length,
              content: text || shareUrl || title,
              title: title,
              text: text,
              url: shareUrl,
              timestamp: Date.now()
            };
          }

          if (payload) {
            const shareCache = await caches.open('money-superapp-shared-payload');
            const response = new Response(JSON.stringify(payload), {
              headers: { 'Content-Type': 'application/json' }
            });
            await shareCache.put('./api/shared-target-payload', response);
          }
        } catch (_err) {
          // Fall through to redirect
        }
        return Response.redirect('./index.html?incoming_share=1', 303);
      })());
      return;
    }
  }

  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
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
