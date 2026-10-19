import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import vm from 'node:vm';

const ROOT_DIR = process.cwd();

describe('Phase 112: Advanced Service Worker Cache Lifecycle & Storage Quota Management', () => {
  const swPath = path.join(ROOT_DIR, 'sw.js');
  const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
  const appShellPath = path.join(ROOT_DIR, 'js/app-shell.js');
  const thPath = path.join(ROOT_DIR, 'js/i18n/th.js');
  const enPath = path.join(ROOT_DIR, 'js/i18n/en.js');

  const swContent = fs.readFileSync(swPath, 'utf8');
  const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');
  const appShellContent = fs.readFileSync(appShellPath, 'utf8');
  const thContent = fs.readFileSync(thPath, 'utf8');
  const enContent = fs.readFileSync(enPath, 'utf8');

  describe('1. Storage Byte Formatting Engine (formatStorageBytes)', () => {
    // Extract formatStorageBytes from app-shell.js or execute in sandbox
    const sandbox = {
      window: {},
      navigator: {},
      document: { getElementById: () => null },
      Number,
      Math,
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);

    // Evaluate formatStorageBytes definition
    const fnMatch = appShellContent.match(/function formatStorageBytes\([\s\S]*?\n\}/);
    assert.ok(fnMatch, 'formatStorageBytes function definition found in js/app-shell.js');
    vm.runInContext(fnMatch[0], sandbox);
    const { formatStorageBytes } = sandbox;

    it('gracefully formats 0 bytes and negative or invalid values as 0 B', () => {
      assert.equal(formatStorageBytes(0), '0 B');
      assert.equal(formatStorageBytes(-100), '0 B');
      assert.equal(formatStorageBytes(Number.NaN), '0 B');
      assert.equal(formatStorageBytes(null), '0 B');
      assert.equal(formatStorageBytes(undefined), '0 B');
      assert.equal(formatStorageBytes('not-a-number'), '0 B');
    });

    it('formats byte boundaries accurately (B, KB, MB, GB, TB)', () => {
      assert.equal(formatStorageBytes(500), '500 B');
      assert.equal(formatStorageBytes(1024), '1.0 KB');
      assert.equal(formatStorageBytes(1536), '1.5 KB');
      assert.equal(formatStorageBytes(1048576), '1.0 MB');
      assert.equal(formatStorageBytes(5242880), '5.0 MB');
      assert.equal(formatStorageBytes(1073741824), '1.0 GB');
      assert.equal(formatStorageBytes(1099511627776), '1.0 TB');
    });
  });

  describe('2. Service Worker Static Contracts & Invariants (sw.js)', () => {
    it('defines CACHE_NAME and extensive ASSETS_TO_CACHE list', () => {
      assert.match(swContent, /const CACHE_NAME\s*=\s*'money-superapp-v[\d.]+';/);
      assert.ok(swContent.includes('const ASSETS_TO_CACHE = ['));
      assert.ok(swContent.includes("'./index.html'"));
      assert.ok(swContent.includes("'./js/app-shell.js'"));
      assert.ok(swContent.includes("'./js/i18n/th.js'"));
      assert.ok(swContent.includes("'./js/i18n/en.js'"));
    });

    it('preserves CACHE_NAME and money-superapp-shared-payload during activate event', () => {
      assert.ok(swContent.includes("if (key !== CACHE_NAME && key !== 'money-superapp-shared-payload')"));
      assert.ok(swContent.includes('caches.delete(key).catch('), 'Cache deletion must handle errors resiliently');
    });

    it('implements message event handlers for GET_CACHE_STATUS, PURGE_STALE_CACHES, and REFRESH_CACHE', () => {
      assert.ok(swContent.includes("event.data.type === 'SKIP_WAITING'"));
      assert.ok(swContent.includes("event.data.type === 'GET_CACHE_STATUS'"));
      assert.ok(swContent.includes("event.data.type === 'PURGE_STALE_CACHES'"));
      assert.ok(swContent.includes("event.data.type === 'REFRESH_CACHE'"));
      assert.ok(swContent.includes('CACHE_STATUS_RESPONSE'));
      assert.ok(swContent.includes('PURGE_STALE_CACHES_RESPONSE'));
      assert.ok(swContent.includes('REFRESH_CACHE_RESPONSE'));
    });
  });

  describe('3. Service Worker Message Simulation in Mock VM', () => {
    const activeCacheMatch = swContent.match(/const CACHE_NAME\s*=\s*'([^']+)';/);
    const expectedActiveCacheName = activeCacheMatch ? activeCacheMatch[1] : 'money-superapp-v2.5.55';
    const expectedVersion = expectedActiveCacheName.replace('money-superapp-v', '');

    function setupSwSandbox() {
      const cacheStore = new Map();
      cacheStore.set(expectedActiveCacheName, new Map([['./index.html', new Response('<html></html>')]]));
      cacheStore.set('money-superapp-v2.5.50-old', new Map([['./index.html', new Response('old')]]));
      cacheStore.set('money-superapp-shared-payload', new Map([['./shared', new Response('shared')]]));

      const listeners = {};

      const mockCaches = {
        keys: async () => Array.from(cacheStore.keys()),
        open: async (name) => {
          if (!cacheStore.has(name)) cacheStore.set(name, new Map());
          const entries = cacheStore.get(name);
          return {
            keys: async () => Array.from(entries.keys()).map((k) => ({ url: k })),
            put: async (url, response) => {
              entries.set(url, response);
            },
            match: async (url) => entries.get(url) || null,
          };
        },
        delete: async (name) => cacheStore.delete(name),
      };

      const sandbox = {
        console,
        Date,
        Math,
        Promise,
        Response: class {
          constructor(body, init) {
            this.body = body;
            this.init = init;
            this.ok = true;
            this.status = 200;
          }
          clone() {
            return new sandbox.Response(this.body, this.init);
          }
        },
        fetch: async (_url) => new sandbox.Response('mock content'),
        caches: mockCaches,
        self: {
          addEventListener: (event, handler) => {
            listeners[event] = handler;
          },
          skipWaiting: () => {},
          clients: { claim: async () => {} },
        },
        cacheStore,
        listeners,
      };

      sandbox.self.caches = mockCaches;
      const context = vm.createContext(sandbox);
      vm.runInContext(swContent, context);

      return { sandbox, listeners, cacheStore };
    }

    it('GET_CACHE_STATUS responds with structured cache status payload via port', async () => {
      const { listeners } = setupSwSandbox();
      assert.ok(listeners.message, 'Service Worker must register message listener');

      let responsePayload = null;
      const mockPort = {
        postMessage: (data) => {
          responsePayload = data;
        },
      };

      const event = {
        data: { type: 'GET_CACHE_STATUS' },
        ports: [mockPort],
        waitUntil: (p) => p,
      };

      listeners.message(event);
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.ok(responsePayload, 'Must receive CACHE_STATUS_RESPONSE');
      assert.equal(responsePayload.type, 'CACHE_STATUS_RESPONSE');
      assert.equal(responsePayload.cacheName, expectedActiveCacheName);
      assert.equal(responsePayload.version, expectedVersion);
      assert.ok(Array.isArray(responsePayload.allCaches));
      assert.ok(responsePayload.allCaches.includes(expectedActiveCacheName));
      assert.ok(responsePayload.staleCaches.includes('money-superapp-v2.5.50-old'));
      assert.ok(!responsePayload.staleCaches.includes('money-superapp-shared-payload'));
    });

    it('PURGE_STALE_CACHES purges obsolete caches while preserving active version and shared-payload', async () => {
      const { listeners, cacheStore } = setupSwSandbox();

      let responsePayload = null;
      const mockPort = {
        postMessage: (data) => {
          responsePayload = data;
        },
      };

      const event = {
        data: { type: 'PURGE_STALE_CACHES' },
        ports: [mockPort],
        waitUntil: (p) => p,
      };

      listeners.message(event);
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.ok(responsePayload, 'Must receive PURGE_STALE_CACHES_RESPONSE');
      assert.equal(responsePayload.type, 'PURGE_STALE_CACHES_RESPONSE');
      assert.equal(responsePayload.success, true);
      assert.deepEqual([...responsePayload.purgedCaches], ['money-superapp-v2.5.50-old']);

      // Invariants check
      assert.ok(cacheStore.has(expectedActiveCacheName), 'Active cache must remain intact');
      assert.ok(cacheStore.has('money-superapp-shared-payload'), 'Shared payload cache must remain intact');
      assert.ok(!cacheStore.has('money-superapp-v2.5.50-old'), 'Old cache must be deleted');
    });

    it('REFRESH_CACHE re-fetches and updates cache assets returning progress count', async () => {
      const { listeners } = setupSwSandbox();

      let responsePayload = null;
      const mockPort = {
        postMessage: (data) => {
          responsePayload = data;
        },
      };

      const event = {
        data: { type: 'REFRESH_CACHE' },
        ports: [mockPort],
        waitUntil: (p) => p,
      };

      listeners.message(event);
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.ok(responsePayload, 'Must receive REFRESH_CACHE_RESPONSE');
      assert.equal(responsePayload.type, 'REFRESH_CACHE_RESPONSE');
      assert.equal(responsePayload.success, true);
      assert.ok(responsePayload.updatedCount > 0, 'Must report updated asset count');
      assert.ok(responsePayload.totalAssets > 0, 'Must report total asset count');
    });
  });

  describe('4. App Shell DOM Structure & Bilingual Attributes (index.html)', () => {
    it('defines Storage & Cache Quota card with required action elements and IDs', () => {
      assert.ok(indexContent.includes('id="lbl-cache-quota-title"'), 'Must have #lbl-cache-quota-title');
      assert.ok(indexContent.includes('data-i18n="cacheQuotaTitle"'), 'Must have data-i18n="cacheQuotaTitle"');
      assert.ok(indexContent.includes('id="lbl-cache-quota-desc"'), 'Must have #lbl-cache-quota-desc');
      assert.ok(indexContent.includes('id="btn-refresh-cache"'), 'Must have #btn-refresh-cache');
      assert.ok(indexContent.includes('onclick="refreshAppCache()"'), 'Refresh button must trigger refreshAppCache()');
      assert.ok(indexContent.includes('id="btn-purge-stale"'), 'Must have #btn-purge-stale');
      assert.ok(indexContent.includes('onclick="purgeStaleCaches()"'), 'Purge button must trigger purgeStaleCaches()');
      assert.ok(indexContent.includes('id="cache-version-badge"'), 'Must have #cache-version-badge');
      assert.ok(indexContent.includes('id="cache-stale-badge"'), 'Must have #cache-stale-badge');
      assert.ok(indexContent.includes('id="lbl-cache-quota-readout"'), 'Must have #lbl-cache-quota-readout');
      assert.ok(indexContent.includes('id="cache-quota-bar"'), 'Must have #cache-quota-bar');
      assert.ok(indexContent.includes('id="lbl-cache-status-text"'), 'Must have #lbl-cache-status-text');
    });
  });

  describe('5. Bilingual Dictionaries Symmetry (th.js & en.js)', () => {
    const quotaKeys = [
      'cacheQuotaTitle',
      'cacheQuotaDesc',
      'cacheVersionLabel',
      'cacheUsageLabel',
      'btnRefreshCache',
      'btnPurgeStale',
      'cacheStatusReady',
      'cacheRefreshing',
      'cacheRefreshed',
      'cachePurged',
    ];

    it('contains all 10 cache quota keys in both js/i18n/th.js and js/i18n/en.js', () => {
      for (const key of quotaKeys) {
        assert.ok(thContent.includes(`${key}:`), `th.js must define key "${key}"`);
        assert.ok(enContent.includes(`${key}:`), `en.js must define key "${key}"`);
      }
    });

    it('contains all 10 cache quota keys in app-shell.js translations object', () => {
      for (const key of quotaKeys) {
        assert.ok(appShellContent.includes(`${key}:`), `app-shell.js must define translation key "${key}"`);
      }
    });
  });

  describe('6. App Shell Controller API & Global Namespace Integration', () => {
    it('verifies js/app-shell.js defines and exports controller functions', () => {
      assert.ok(appShellContent.includes('function formatStorageBytes('));
      assert.ok(appShellContent.includes('async function updateStorageQuotaDisplay('));
      assert.ok(appShellContent.includes('async function refreshAppCache('));
      assert.ok(appShellContent.includes('async function purgeStaleCaches('));

      assert.ok(appShellContent.includes('window.MoneyApp.formatStorageBytes = formatStorageBytes'));
      assert.ok(appShellContent.includes('window.MoneyApp.updateStorageQuotaDisplay = updateStorageQuotaDisplay'));
      assert.ok(appShellContent.includes('window.MoneyApp.refreshAppCache = refreshAppCache'));
      assert.ok(appShellContent.includes('window.MoneyApp.purgeStaleCaches = purgeStaleCaches'));

      assert.ok(appShellContent.includes('window.formatStorageBytes = formatStorageBytes'));
      assert.ok(appShellContent.includes('window.updateStorageQuotaDisplay = updateStorageQuotaDisplay'));
      assert.ok(appShellContent.includes('window.refreshAppCache = refreshAppCache'));
      assert.ok(appShellContent.includes('window.purgeStaleCaches = purgeStaleCaches'));
    });

    it('invokes updateStorageQuotaDisplay() inside openSettingsModal()', () => {
      const match = appShellContent.match(/function openSettingsModal\(\)\s*\{([\s\S]*?)\}/);
      assert.ok(match, 'openSettingsModal definition found');
      assert.ok(
        match[1].includes('updateStorageQuotaDisplay()'),
        'openSettingsModal must invoke updateStorageQuotaDisplay()',
      );
    });

    it('wires cache quota labels in applyLang()', () => {
      const match = appShellContent.match(/function applyLang\(lang\)\s*\{([\s\S]*?)\n\}/);
      assert.ok(match, 'applyLang definition found');
      assert.ok(match[1].includes('lbl-cache-quota-title'));
      assert.ok(match[1].includes('lbl-cache-quota-desc'));
      assert.ok(match[1].includes('lbl-btn-refresh-cache'));
      assert.ok(match[1].includes('lbl-btn-purge-stale'));
      assert.ok(match[1].includes('lbl-cache-version-label'));
      assert.ok(match[1].includes('lbl-cache-usage-label'));
      assert.ok(match[1].includes('lbl-cache-status-text'));
    });
  });
});
