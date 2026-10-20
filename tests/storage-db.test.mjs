import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import '../js/engines/storage-db.js';

const { createStorageDB } = globalThis.MoneyApp;

/**
 * Creates an in-memory mock IDBFactory compliant with the subset of IDB APIs
 * used by createStorageDB.
 */
function createMockIndexedDB() {
  const databases = new Map();

  return {
    open(dbName, version) {
      let db = databases.get(dbName);
      let isUpgradeNeeded = false;

      if (!db) {
        db = {
          name: dbName,
          version: version || 1,
          stores: new Map(),
        };
        databases.set(dbName, db);
        isUpgradeNeeded = true;
      }

      const req = {
        result: {
          name: dbName,
          version: db.version,
          objectStoreNames: {
            contains(storeName) {
              return db.stores.has(storeName);
            },
          },
          createObjectStore(storeName) {
            if (!db.stores.has(storeName)) {
              db.stores.set(storeName, new Map());
            }
          },
          transaction(storeName, _mode) {
            const storeMap = db.stores.get(storeName) || new Map();
            db.stores.set(storeName, storeMap);

            const tx = {
              oncomplete: null,
              onerror: null,
              onabort: null,
              objectStore(_s) {
                return {
                  get(key) {
                    const r = {};
                    setTimeout(() => {
                      r.result = storeMap.get(key);
                      r.onsuccess?.({ target: r });
                    }, 0);
                    return r;
                  },
                  put(val, key) {
                    storeMap.set(key, val);
                    const r = {};
                    setTimeout(() => {
                      r.result = key;
                      r.onsuccess?.({ target: r });
                      queueMicrotask(() => {
                        tx.oncomplete?.({ target: tx });
                      });
                    }, 0);
                    return r;
                  },
                  delete(key) {
                    storeMap.delete(key);
                    const r = {};
                    setTimeout(() => {
                      r.onsuccess?.({ target: r });
                      queueMicrotask(() => {
                        tx.oncomplete?.({ target: tx });
                      });
                    }, 0);
                    return r;
                  },
                  clear() {
                    storeMap.clear();
                    const r = {};
                    setTimeout(() => {
                      r.onsuccess?.({ target: r });
                      queueMicrotask(() => {
                        tx.oncomplete?.({ target: tx });
                      });
                    }, 0);
                    return r;
                  },
                  getAllKeys() {
                    const r = {};
                    setTimeout(() => {
                      r.result = Array.from(storeMap.keys());
                      r.onsuccess?.({ target: r });
                    }, 0);
                    return r;
                  },
                };
              },
            };
            return tx;
          },
        },
      };

      setTimeout(() => {
        if (isUpgradeNeeded) {
          req.onupgradeneeded?.({ target: req });
        }
        req.onsuccess?.({ target: req });
      }, 0);

      return req;
    },
  };
}

/**
 * Creates a mock Web Storage (localStorage) interface.
 */
function createMockLocalStorage() {
  const store = new Map();
  return {
    getItem(k) {
      return store.get(k) ?? null;
    },
    setItem(k, v) {
      store.set(k, String(v));
    },
    removeItem(k) {
      store.delete(k);
    },
    clear() {
      store.clear();
    },
    key(i) {
      return Array.from(store.keys())[i] ?? null;
    },
    get length() {
      return store.size;
    },
  };
}

describe('Phase 129: IndexedDB Tiered Storage Engine (storage-db.js)', () => {
  let mockIDB;
  let mockLocalStorage;
  let storage;

  beforeEach(() => {
    mockIDB = createMockIndexedDB();
    mockLocalStorage = createMockLocalStorage();
    storage = createStorageDB({
      dbName: 'test_superapp_db',
      storeName: 'test_keyvalue',
      version: 1,
      indexedDB: mockIDB,
      localStorage: mockLocalStorage,
    });
  });

  describe('1. Basic CRUD Operations (IndexedDB Active)', () => {
    it('sets, gets, checks, and removes primitive and object values', async () => {
      // String
      await storage.setItem('userName', 'Somchai');
      assert.equal(await storage.getItem('userName'), 'Somchai');
      assert.equal(await storage.hasItem('userName'), true);

      // Object
      const profile = { salary: 65000, pvdPercent: 7, taxYear: 2024 };
      await storage.setItem('userProfile', profile);
      const retrieved = await storage.getItem('userProfile');
      assert.deepEqual(retrieved, profile);

      // Non-existent key returns null
      assert.equal(await storage.getItem('nonExistent'), null);
      assert.equal(await storage.hasItem('nonExistent'), false);

      // Remove item
      await storage.removeItem('userName');
      assert.equal(await storage.getItem('userName'), null);
      assert.equal(await storage.hasItem('userName'), false);
      // Profile still exists
      assert.deepEqual(await storage.getItem('userProfile'), profile);
    });

    it('lists keys and clears all stored data in object store', async () => {
      await storage.setItem('keyA', 1);
      await storage.setItem('keyB', 2);
      await storage.setItem('keyC', 3);

      const keysList = await storage.keys();
      assert.ok(keysList.includes('keyA'));
      assert.ok(keysList.includes('keyB'));
      assert.ok(keysList.includes('keyC'));

      await storage.clear();
      assert.equal(await storage.getItem('keyA'), null);
      assert.equal(await storage.getItem('keyB'), null);
      assert.equal(await storage.getItem('keyC'), null);
      const postClearKeys = await storage.keys();
      assert.equal(postClearKeys.length, 0);
    });
  });

  describe('2. Transparent Fallback (IDB Unavailable / Blocked)', () => {
    it('seamlessly falls back to localStorage when indexedDB is null', async () => {
      const fallbackStorage = createStorageDB({
        indexedDB: null,
        localStorage: mockLocalStorage,
      });

      assert.equal(fallbackStorage.isIndexedDBSupported, false);

      await fallbackStorage.setItem('moneySuperapp.testKey', { score: 95 });
      // Stored as JSON string in mock localStorage
      assert.equal(mockLocalStorage.getItem('moneySuperapp.testKey'), JSON.stringify({ score: 95 }));

      // Auto-deserialized on getItem
      const retrieved = await fallbackStorage.getItem('moneySuperapp.testKey');
      assert.deepEqual(retrieved, { score: 95 });

      assert.equal(await fallbackStorage.hasItem('moneySuperapp.testKey'), true);

      // List keys from fallback
      const kList = await fallbackStorage.keys();
      assert.ok(kList.includes('moneySuperapp.testKey'));

      // Remove from fallback
      await fallbackStorage.removeItem('moneySuperapp.testKey');
      assert.equal(await fallbackStorage.getItem('moneySuperapp.testKey'), null);
      assert.equal(mockLocalStorage.getItem('moneySuperapp.testKey'), null);
    });

    it('operates purely in memory when both IDB and localStorage are unavailable', async () => {
      const memStorage = createStorageDB({
        indexedDB: null,
        localStorage: null,
      });

      await memStorage.setItem('inMemKey', 'inMemVal');
      assert.equal(await memStorage.getItem('inMemKey'), 'inMemVal');
      assert.equal(await memStorage.hasItem('inMemKey'), true);

      const kList = await memStorage.keys();
      assert.deepEqual(kList, ['inMemKey']);

      await memStorage.clear();
      assert.equal(await memStorage.getItem('inMemKey'), null);
      assert.equal(await memStorage.hasItem('inMemKey'), false);
    });
  });

  describe('3. Critical UI Key Mirroring & Dual Persistence', () => {
    it('mirrors critical UI keys (theme, lang, activeTab) to localStorage synchronously', async () => {
      // Critical keys should be written to localStorage
      await storage.setItem('moneySuperapp.theme', 'dark');
      await storage.setItem('moneySuperapp.lang', 'th');
      await storage.setItem('moneySuperapp.activeTab', 'rebalance');

      assert.equal(mockLocalStorage.getItem('moneySuperapp.theme'), 'dark');
      assert.equal(mockLocalStorage.getItem('moneySuperapp.lang'), 'th');
      assert.equal(mockLocalStorage.getItem('moneySuperapp.activeTab'), 'rebalance');

      // Non-mirrored data should stay in IDB and not clutter localStorage
      await storage.setItem('moneySuperapp.bankStatementsArchive', { large: true });
      assert.equal(mockLocalStorage.getItem('moneySuperapp.bankStatementsArchive'), null);
      assert.deepEqual(await storage.getItem('moneySuperapp.bankStatementsArchive'), { large: true });
    });

    it('mirrors all keys when mirrorToLocalStorage flag is enabled', async () => {
      const mirrorStorage = createStorageDB({
        indexedDB: mockIDB,
        localStorage: mockLocalStorage,
        mirrorToLocalStorage: true,
      });

      await mirrorStorage.setItem('customKey', { abc: 123 });
      assert.equal(mockLocalStorage.getItem('customKey'), JSON.stringify({ abc: 123 }));
      assert.deepEqual(await mirrorStorage.getItem('customKey'), { abc: 123 });
    });
  });

  describe('4. Legacy LocalStorage Migration', () => {
    it('migrates matching keys from localStorage into IndexedDB', async () => {
      // Seed mock localStorage with legacy keys
      mockLocalStorage.setItem('moneySuperapp.taxBase', JSON.stringify({ income: 500000 }));
      mockLocalStorage.setItem('moneySuperapp.remaining', JSON.stringify({ runway: 6 }));
      mockLocalStorage.setItem('unrelatedApp.token', 'secret123');

      const result = await storage.migrateFromLocalStorage('moneySuperapp.');
      assert.equal(result.count, 2);
      assert.ok(result.migratedKeys.includes('moneySuperapp.taxBase'));
      assert.ok(result.migratedKeys.includes('moneySuperapp.remaining'));
      assert.ok(!result.migratedKeys.includes('unrelatedApp.token'));
      assert.ok(result.bytes > 0);

      // Verify data is now readable via IDB storage
      assert.deepEqual(await storage.getItem('moneySuperapp.taxBase'), { income: 500000 });
      assert.deepEqual(await storage.getItem('moneySuperapp.remaining'), { runway: 6 });
    });
  });

  describe('5. Batch Export and Import Utilities', () => {
    it('exports all stored records into a single serializable map and imports them', async () => {
      await storage.setItem('doc_1', { title: 'Dossier 2024' });
      await storage.setItem('doc_2', { title: 'Tax 2025' });

      const exported = await storage.exportAll();
      assert.deepEqual(exported.doc_1, { title: 'Dossier 2024' });
      assert.deepEqual(exported.doc_2, { title: 'Tax 2025' });

      // Create new storage instance
      const newMockIDB = createMockIndexedDB();
      const newStorage = createStorageDB({
        dbName: 'imported_db',
        indexedDB: newMockIDB,
        localStorage: createMockLocalStorage(),
      });

      const importResult = await newStorage.importAll(exported);
      assert.equal(importResult.importedCount, 2);
      assert.deepEqual(await newStorage.getItem('doc_1'), { title: 'Dossier 2024' });
      assert.deepEqual(await newStorage.getItem('doc_2'), { title: 'Tax 2025' });

      // Test overwrite: false does not clobber existing keys
      await newStorage.setItem('doc_1', { title: 'Original Value' });
      await newStorage.importAll({ doc_1: { title: 'New Value' }, doc_3: { title: 'Doc 3' } }, { overwrite: false });
      assert.deepEqual(await newStorage.getItem('doc_1'), { title: 'Original Value' });
      assert.deepEqual(await newStorage.getItem('doc_3'), { title: 'Doc 3' });
    });
  });

  describe('6. Telemetry & Quota Estimation', () => {
    it('formats byte strings accurately via formatBytes helper', () => {
      const { formatBytes } = storage;
      assert.equal(formatBytes(0), '0 B');
      assert.equal(formatBytes(512), '512 B');
      assert.equal(formatBytes(1024), '1.0 KB');
      assert.equal(formatBytes(1048576), '1.0 MB');
      assert.equal(formatBytes(5242880), '5.0 MB');
      assert.equal(formatBytes(1073741824), '1.0 GB');
    });

    it('returns structured quota estimates in fallback mode', async () => {
      mockLocalStorage.setItem('testData', 'x'.repeat(1000));
      const est = await storage.estimate();
      assert.ok(est.quota > 0);
      assert.ok(typeof est.usage === 'number');
      assert.ok(typeof est.usagePct === 'number');
      assert.ok(est.formattedUsage.includes('B'));
      assert.ok(est.formattedQuota.includes('MB') || est.formattedQuota.includes('GB'));
      assert.ok(est.backend === 'indexeddb' || est.backend === 'localstorage');
    });
  });

  describe('7. Security, Memory Pruning & Multi-Prefix Isolation', () => {
    it('prevents prototype pollution via __proto__, constructor, and prototype keys', async () => {
      // Attempt importing malicious prototype payload
      const maliciousPayload = {
        doc_normal: { val: 123 },
        __proto__: { polluted: 'evil_string' },
        constructor: { evil: 'constructor_polluted' },
        prototype: { evil: 'prototype_polluted' },
      };

      const res = await storage.importAll(maliciousPayload);
      assert.equal(res.importedCount, 1);
      assert.deepEqual(res.keys, ['doc_normal']);

      // Prototype of plain Object must be clean
      assert.equal({}.polluted, undefined);
      assert.equal({}.evil, undefined);

      // exportAll returns null-prototype object and excludes prototype keys
      const exported = await storage.exportAll();
      assert.equal(Object.getPrototypeOf(exported), null);
      assert.deepEqual(exported.doc_normal, { val: 123 });
      assert.equal(Object.hasOwn(exported, '__proto__'), false);
      assert.equal(Object.hasOwn(exported, 'constructor'), false);
      assert.equal(Object.hasOwn(exported, 'prototype'), false);
    });

    it('prunes fallbackMemory when IndexedDB write succeeds, storing in RAM only upon total failure', async () => {
      // 1. With IDB active, setItem should NOT retain object in fallbackMemory
      await storage.setItem('largePayload', { big: 'data'.repeat(100) });
      assert.deepEqual(await storage.getItem('largePayload'), { big: 'data'.repeat(100) });
      assert.equal(
        storage._fallbackMemory.largePayload,
        undefined,
        'fallbackMemory must not hold RAM when IDB succeeds',
      );

      // 2. When both IDB and localStorage fail, fallbackMemory stores the value
      const brokenStorage = createStorageDB({
        indexedDB: null,
        localStorage: {
          getItem() {
            throw new Error('quota error');
          },
          setItem() {
            throw new Error('quota error');
          },
        },
      });

      await brokenStorage.setItem('memoryOnlyKey', { fallback: true });
      assert.deepEqual(brokenStorage._fallbackMemory.memoryOnlyKey, { fallback: true });
      assert.deepEqual(await brokenStorage.getItem('memoryOnlyKey'), { fallback: true });
    });

    it('isolates and purges only declared APP_PREFIXES in clear() and keys()', async () => {
      // Populate localStorage directly with app keys and external foreign keys
      mockLocalStorage.setItem('moneySuperapp.theme', 'dark');
      mockLocalStorage.setItem('remainingMoneyCalculator.budget', '50000');
      mockLocalStorage.setItem('rebalanceCalculator.orders', '[]');
      mockLocalStorage.setItem('unrelatedApp.authToken', 'secret_xyz');
      mockLocalStorage.setItem('google_analytics_id', 'UA-12345');

      const fallbackStorage = createStorageDB({
        indexedDB: null,
        localStorage: mockLocalStorage,
      });

      const discoveredKeys = await fallbackStorage.keys();
      // App keys should be present
      assert.ok(discoveredKeys.includes('moneySuperapp.theme'));
      assert.ok(discoveredKeys.includes('remainingMoneyCalculator.budget'));
      assert.ok(discoveredKeys.includes('rebalanceCalculator.orders'));
      // Foreign origin keys must NOT be leaked
      assert.ok(!discoveredKeys.includes('unrelatedApp.authToken'));
      assert.ok(!discoveredKeys.includes('google_analytics_id'));

      // Now clear() should only purge app keys
      await fallbackStorage.clear();
      assert.equal(mockLocalStorage.getItem('moneySuperapp.theme'), null);
      assert.equal(mockLocalStorage.getItem('remainingMoneyCalculator.budget'), null);
      assert.equal(mockLocalStorage.getItem('rebalanceCalculator.orders'), null);
      // Foreign keys must remain untouched!
      assert.equal(mockLocalStorage.getItem('unrelatedApp.authToken'), 'secret_xyz');
      assert.equal(mockLocalStorage.getItem('google_analytics_id'), 'UA-12345');
    });
  });
});
