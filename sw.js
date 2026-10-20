const CACHE_NAME = 'money-superapp-v2.5.70';
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
  './js/engines/thai-pit.js',
  './js/engines/thai-tax-calendar.js',
  './js/engines/insurance.js',
  './js/engines/gold.js',
  './js/engines/foreign-tax.js',
  './js/engines/inheritance-tax.js',
  './js/engines/retirement-buckets.js',
  './js/engines/property-tax.js',
  './js/engines/bank-parser.js',
  './js/engines/glidepath.js',
  './js/engines/refinance.js',
  './js/engines/stress-test.js',
  './js/engines/storage-db.js',
  './js/engines/vault-crypto.js',
  './js/engines/p2p-sync.js',
  './js/engines/bridge.js',
  './js/engines/cashflow-viz.js',
  './js/engines/budget-import.js',
  './js/engines/financial-health.js',
  './js/engines/rebalance-subtools.js',
  './js/engines/tax-worksheet.js',
  './js/engines/i18n-core.js',
  './js/engines/monte-carlo.js',
  './js/engines/dashboard-viz.js',
  './js/i18n/th.js',
  './js/i18n/en.js',
  './js/app-shell.js',
  './js/dashboard.js',
  './js/remaining-money.js',
  './js/rebalance.js',
  './js/debt-calculator.js',
  './js/tax-calculator-base.js',
  './js/tax-calculator.js',
  './js/months-slips.js',
  './js/workers/simulation-worker.js',
  './css/tailwind-lite.css',
  './css/theme.css',
  './manifest.json',
  './icon.svg',
  './screenshots/desktop.svg',
  './screenshots/mobile.svg'
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

// Phase 73 & Phase 112: Listen for messages from App Shell (SKIP_WAITING, GET_CACHE_STATUS, PURGE_STALE_CACHES, REFRESH_CACHE)
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data.type === 'GET_CACHE_STATUS') {
    const respond = payload => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(payload);
      } else if (event.source && typeof event.source.postMessage === 'function') {
        event.source.postMessage(payload);
      }
    };

    const promise = (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        const allCaches = await caches.keys();
        const staleCaches = allCaches.filter(k => k !== CACHE_NAME && k !== 'money-superapp-shared-payload');
        const versionMatch = CACHE_NAME.match(/v(\d+\.\d+\.\d+)/);
        const version = versionMatch ? versionMatch[1] : CACHE_NAME;

        respond({
          type: 'CACHE_STATUS_RESPONSE',
          cacheName: CACHE_NAME,
          version: version,
          assetCount: keys.length,
          allCaches: allCaches,
          staleCaches: staleCaches,
          timestamp: Date.now()
        });
      } catch (err) {
        respond({
          type: 'CACHE_STATUS_RESPONSE',
          error: err.message,
          cacheName: CACHE_NAME,
          timestamp: Date.now()
        });
      }
    })();

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(promise);
    }
    return;
  }

  if (event.data.type === 'PURGE_STALE_CACHES') {
    const respond = payload => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(payload);
      } else if (event.source && typeof event.source.postMessage === 'function') {
        event.source.postMessage(payload);
      }
    };

    const promise = (async () => {
      try {
        const allCaches = await caches.keys();
        const purgedCaches = [];
        for (const key of allCaches) {
          if (key !== CACHE_NAME && key !== 'money-superapp-shared-payload') {
            try {
              const deleted = await caches.delete(key);
              if (deleted) purgedCaches.push(key);
            } catch (_e) {}
          }
        }

        respond({
          type: 'PURGE_STALE_CACHES_RESPONSE',
          success: true,
          purgedCaches: purgedCaches,
          activeCache: CACHE_NAME
        });
      } catch (err) {
        respond({
          type: 'PURGE_STALE_CACHES_RESPONSE',
          success: false,
          error: err.message,
          activeCache: CACHE_NAME
        });
      }
    })();

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(promise);
    }
    return;
  }

  if (event.data.type === 'REFRESH_CACHE') {
    const respond = payload => {
      if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(payload);
      } else if (event.source && typeof event.source.postMessage === 'function') {
        event.source.postMessage(payload);
      }
    };

    const promise = (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        let updatedCount = 0;
        await Promise.all(
          ASSETS_TO_CACHE.map(async url => {
            try {
              const response = await fetch(url, { cache: 'reload' });
              if (response && response.ok) {
                await cache.put(url, response);
                updatedCount++;
              }
            } catch (_err) {}
          })
        );

        respond({
          type: 'REFRESH_CACHE_RESPONSE',
          success: true,
          updatedCount: updatedCount,
          totalAssets: ASSETS_TO_CACHE.length
        });
      } catch (err) {
        respond({
          type: 'REFRESH_CACHE_RESPONSE',
          success: false,
          error: err.message
        });
      }
    })();

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(promise);
    }
    return;
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME && key !== 'money-superapp-shared-payload') {
            return caches.delete(key).catch(() => false);
          }
          return Promise.resolve(false);
        })
      );
    }).catch(() => {
      // Graceful fallback for cache inspection error
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
