/**
 * Money Superapp - IndexedDB Tiered Storage Engine (Phase 129)
 * High-capacity client-side persistence breaking the 5MB browser localStorage ceiling.
 * Features transparent fallback to localStorage / memory, synchronous boot mirroring
 * for critical UI keys (theme, lang, activeTab), and storage telemetry.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  const DEFAULT_DB_NAME = 'moneySuperapp_idb';
  const DEFAULT_STORE_NAME = 'keyvalue';
  const DEFAULT_VERSION = 1;

  /**
   * Keys that are mirrored to localStorage for synchronous 0ms boot paint.
   */
  const SYNC_MIRROR_KEYS = new Set(['moneySuperapp.theme', 'moneySuperapp.lang', 'moneySuperapp.activeTab']);

  /**
   * Allowed app prefixes for localStorage scoping and clean origin isolation.
   */
  const APP_PREFIXES = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.', 'profile.'];

  function isAppKey(key) {
    if (typeof key !== 'string') return false;
    for (let i = 0; i < APP_PREFIXES.length; i++) {
      if (key.startsWith(APP_PREFIXES[i])) return true;
    }
    return false;
  }

  /**
   * Formats numeric byte counts into human-readable strings.
   * @param {number|string} bytes
   * @returns {string} E.g., '1.5 MB', '500 B'
   */
  function formatBytes(bytes) {
    const b = Number(bytes) || 0;
    if (b === 0) return '0 B';
    if (b < 1024) return `${b} B`;
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    const val = (b / k ** i).toFixed(1);
    return `${val} ${sizes[i]}`;
  }

  /**
   * Factory function creating an asynchronous tiered storage engine instance.
   * @param {Object} [options]
   * @param {string} [options.dbName='moneySuperapp_idb']
   * @param {string} [options.storeName='keyvalue']
   * @param {number} [options.version=1]
   * @param {IDBFactory} [options.indexedDB]
   * @param {Storage} [options.localStorage]
   * @param {Set<string>|Array<string>} [options.mirrorKeys]
   * @param {boolean} [options.mirrorToLocalStorage=false]
   * @returns {Object} Tiered storage engine API
   */
  function createStorageDB(options) {
    const opts = options || {};
    const dbName = opts.dbName || DEFAULT_DB_NAME;
    const storeName = opts.storeName || DEFAULT_STORE_NAME;
    const version = opts.version || DEFAULT_VERSION;
    const customIDB =
      opts.indexedDB !== undefined
        ? opts.indexedDB
        : typeof window !== 'undefined' && 'indexedDB' in window
          ? window.indexedDB
          : typeof indexedDB !== 'undefined'
            ? indexedDB
            : null;

    const customLocalStorage =
      opts.localStorage !== undefined
        ? opts.localStorage
        : typeof window !== 'undefined' && 'localStorage' in window
          ? window.localStorage
          : typeof localStorage !== 'undefined'
            ? localStorage
            : null;

    const mirrorKeys = new Set(opts.mirrorKeys || SYNC_MIRROR_KEYS);
    const fallbackMemory = Object.create(null);
    let dbPromise = null;

    function openDB() {
      if (dbPromise) return dbPromise;
      if (!customIDB || typeof customIDB.open !== 'function') {
        return Promise.resolve(null);
      }

      dbPromise = new Promise((resolve) => {
        try {
          const req = customIDB.open(dbName, version);
          req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName);
            }
          };
          req.onsuccess = (e) => resolve(e.target.result);
          req.onerror = () => resolve(null);
          req.onblocked = () => resolve(null);
        } catch (_e) {
          resolve(null);
        }
      });

      return dbPromise;
    }

    function safeLocalStorageGet(key) {
      try {
        if (customLocalStorage) {
          const raw = customLocalStorage.getItem(key);
          if (raw !== null && raw !== undefined) {
            try {
              return JSON.parse(raw);
            } catch (_e) {
              return raw;
            }
          }
        }
      } catch (_e) {}
      return key in fallbackMemory ? fallbackMemory[key] : null;
    }

    function safeLocalStorageSet(key, value) {
      try {
        if (customLocalStorage) {
          const str = typeof value === 'string' ? value : JSON.stringify(value);
          customLocalStorage.setItem(key, str);
          return true;
        }
      } catch (_e) {}
      return false;
    }

    function safeLocalStorageRemove(key) {
      delete fallbackMemory[key];
      try {
        if (customLocalStorage) {
          customLocalStorage.removeItem(key);
          return true;
        }
      } catch (_e) {}
      return false;
    }

    async function getItem(key) {
      const db = await openDB();
      if (db) {
        const idbResult = await new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result !== undefined ? req.result : undefined);
            req.onerror = () => resolve(undefined);
          } catch (_e) {
            resolve(undefined);
          }
        });

        if (idbResult !== undefined) {
          return idbResult;
        }
      }

      return safeLocalStorageGet(key);
    }

    async function setItem(key, value) {
      let idbSuccess = false;
      const db = await openDB();

      if (db) {
        idbSuccess = await new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.put(value, key);
            let settled = false;
            const finish = (ok) => {
              if (settled) return;
              settled = true;
              resolve(ok);
            };
            req.onsuccess = () => {
              queueMicrotask(() => finish(true));
            };
            req.onerror = () => finish(false);
            tx.oncomplete = () => finish(true);
            tx.onerror = () => finish(false);
            tx.onabort = () => finish(false);
          } catch (_e) {
            resolve(false);
          }
        });
      }

      if (idbSuccess) {
        delete fallbackMemory[key];
        if (mirrorKeys.has(key) || opts.mirrorToLocalStorage) {
          safeLocalStorageSet(key, value);
        }
      } else {
        const lsSuccess = safeLocalStorageSet(key, value);
        if (!lsSuccess) {
          fallbackMemory[key] = value;
        } else {
          delete fallbackMemory[key];
        }
      }

      return true;
    }

    async function removeItem(key) {
      const db = await openDB();
      if (db) {
        await new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.delete(key);
            let settled = false;
            const finish = (ok) => {
              if (settled) return;
              settled = true;
              resolve(ok);
            };
            req.onsuccess = () => {
              queueMicrotask(() => finish(true));
            };
            req.onerror = () => finish(false);
            tx.oncomplete = () => finish(true);
            tx.onerror = () => finish(false);
            tx.onabort = () => finish(false);
          } catch (_e) {
            resolve(false);
          }
        });
      }

      safeLocalStorageRemove(key);
      return true;
    }

    async function clear() {
      const db = await openDB();
      if (db) {
        await new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.clear();
            let settled = false;
            const finish = (ok) => {
              if (settled) return;
              settled = true;
              resolve(ok);
            };
            req.onsuccess = () => {
              queueMicrotask(() => finish(true));
            };
            req.onerror = () => finish(false);
            tx.oncomplete = () => finish(true);
            tx.onerror = () => finish(false);
            tx.onabort = () => finish(false);
          } catch (_e) {
            resolve(false);
          }
        });
      }

      for (const k of Object.keys(fallbackMemory)) {
        delete fallbackMemory[k];
      }

      try {
        if (customLocalStorage) {
          const toRemove = [];
          for (let i = 0; i < customLocalStorage.length; i++) {
            const k = customLocalStorage.key(i);
            if (k && isAppKey(k)) {
              toRemove.push(k);
            }
          }
          for (const k of toRemove) {
            customLocalStorage.removeItem(k);
          }
        }
      } catch (_e) {}

      return true;
    }

    async function keys() {
      const keySet = new Set();
      const db = await openDB();

      if (db) {
        await new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            if (typeof store.getAllKeys === 'function') {
              const req = store.getAllKeys();
              req.onsuccess = () => {
                if (Array.isArray(req.result)) {
                  for (const k of req.result) keySet.add(String(k));
                }
                resolve(true);
              };
              req.onerror = () => resolve(false);
            } else if (typeof store.openKeyCursor === 'function') {
              const req = store.openKeyCursor();
              req.onsuccess = (e) => {
                const cursor = e.target.result;
                if (cursor) {
                  keySet.add(String(cursor.key));
                  cursor.continue();
                } else {
                  resolve(true);
                }
              };
              req.onerror = () => resolve(false);
            } else {
              resolve(false);
            }
          } catch (_e) {
            resolve(false);
          }
        });
      }

      try {
        if (customLocalStorage) {
          for (let i = 0; i < customLocalStorage.length; i++) {
            const k = customLocalStorage.key(i);
            if (k && isAppKey(k)) keySet.add(k);
          }
        }
      } catch (_e) {}

      for (const k of Object.keys(fallbackMemory)) {
        keySet.add(k);
      }

      return Array.from(keySet);
    }

    async function hasItem(key) {
      const val = await getItem(key);
      return val !== null && val !== undefined;
    }

    async function estimate() {
      const isIDBAvailable = Boolean(customIDB);
      if (isIDBAvailable && typeof navigator !== 'undefined' && navigator.storage?.estimate) {
        try {
          const est = await navigator.storage.estimate();
          const usage = est.usage || 0;
          const quota = est.quota || 0;
          const pct = quota > 0 ? Number.parseFloat(((usage / quota) * 100).toFixed(2)) : 0;
          return {
            usage: usage,
            quota: quota,
            usagePct: pct,
            formattedUsage: formatBytes(usage),
            formattedQuota: formatBytes(quota),
            backend: 'indexeddb',
          };
        } catch (_e) {}
      }

      let bytes = 0;
      try {
        if (customLocalStorage) {
          for (let i = 0; i < customLocalStorage.length; i++) {
            const k = customLocalStorage.key(i);
            const v = customLocalStorage.getItem(k);
            bytes += (k ? k.length : 0) + (v ? v.length : 0);
          }
        }
      } catch (_e) {}

      for (const [k, v] of Object.entries(fallbackMemory)) {
        const vStr = typeof v === 'string' ? v : JSON.stringify(v);
        bytes += k.length + (vStr ? vStr.length : 0);
      }

      const approxBytes = bytes * 2;
      const defaultQuota = 5 * 1024 * 1024;
      const pct = Number.parseFloat(((approxBytes / defaultQuota) * 100).toFixed(2));
      return {
        usage: approxBytes,
        quota: defaultQuota,
        usagePct: pct,
        formattedUsage: formatBytes(approxBytes),
        formattedQuota: formatBytes(defaultQuota),
        backend: isIDBAvailable ? 'indexeddb' : 'localstorage',
      };
    }

    async function migrateFromLocalStorage(filterPrefix = 'moneySuperapp.') {
      const migratedKeys = [];
      let bytes = 0;

      if (!customLocalStorage) {
        return { migratedKeys, count: 0, bytes: 0 };
      }

      const keysToMigrate = [];
      try {
        for (let i = 0; i < customLocalStorage.length; i++) {
          const k = customLocalStorage.key(i);
          if (k && (!filterPrefix || k.startsWith(filterPrefix))) {
            keysToMigrate.push(k);
          }
        }
      } catch (_e) {}

      for (const k of keysToMigrate) {
        try {
          const raw = customLocalStorage.getItem(k);
          if (raw !== null) {
            let parsed;
            try {
              parsed = JSON.parse(raw);
            } catch (_e) {
              parsed = raw;
            }
            await setItem(k, parsed);
            migratedKeys.push(k);
            bytes += (k.length + raw.length) * 2;
          }
        } catch (_e) {}
      }

      return {
        migratedKeys,
        count: migratedKeys.length,
        bytes,
      };
    }

    async function exportAll() {
      const allKeys = await keys();
      const records = Object.create(null);
      for (const key of allKeys) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        const val = await getItem(key);
        if (val !== null && val !== undefined) {
          records[key] = val;
        }
      }
      return records;
    }

    async function importAll(recordMap, options = {}) {
      const overwrite = options.overwrite !== false;
      const map = recordMap && typeof recordMap === 'object' ? recordMap : {};
      const importedKeys = [];

      for (const [key, val] of Object.entries(map)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          continue;
        }
        if (!overwrite && (await hasItem(key))) {
          continue;
        }
        await setItem(key, val);
        importedKeys.push(key);
      }

      return {
        importedCount: importedKeys.length,
        keys: importedKeys,
      };
    }

    function createPartitionedStorage(profileId) {
      const pid = profileId || 'personal';
      const prefix = `profile.${pid}.`;
      return {
        getItem: (k) => getItem(prefix + k),
        setItem: (k, v) => setItem(prefix + k, v),
        removeItem: (k) => removeItem(prefix + k),
        hasItem: (k) => hasItem(prefix + k),
        profileId: pid,
      };
    }

    return {
      getItem,
      setItem,
      removeItem,
      clear,
      keys,
      hasItem,
      estimate,
      migrateFromLocalStorage,
      exportAll,
      importAll,
      formatBytes,
      createPartitionedStorage,
      isIndexedDBSupported: Boolean(customIDB),
      _fallbackMemory: fallbackMemory,
    };
  }

  const defaultStorage = createStorageDB();

  // Phase 147: Automated Rolling Backup Ring Buffer & Schema Migration Subsystems
  const ROLLING_BACKUP_STORAGE_KEY = 'moneySuperapp.rollingSnapshots.v1';
  const ROLLING_BACKUP_LAST_RUN_KEY = 'moneySuperapp.lastAutoBackupRun';
  const MAX_ROLLING_SNAPSHOTS = 5;

  const RollingBackup = {
    STORAGE_KEY: ROLLING_BACKUP_STORAGE_KEY,
    LAST_RUN_KEY: ROLLING_BACKUP_LAST_RUN_KEY,
    MAX_SNAPSHOTS: MAX_ROLLING_SNAPSHOTS,

    listSnapshots: (storage = typeof localStorage !== 'undefined' ? localStorage : null) => {
      if (!storage) return [];
      try {
        const raw =
          typeof storage.getItem === 'function'
            ? storage.getItem(ROLLING_BACKUP_STORAGE_KEY)
            : storage[ROLLING_BACKUP_STORAGE_KEY];
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (_e) {
        return [];
      }
    },

    createSnapshot: (storage = typeof localStorage !== 'undefined' ? localStorage : null, label = null) => {
      if (!storage) return null;
      const snapshots = RollingBackup.listSnapshots(storage);
      const now = new Date();
      const iso = now.toISOString();
      const id = `snap_${now.getTime()}`;

      const data = {};
      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
      if (typeof storage.length === 'number' && typeof storage.key === 'function') {
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key && allowedPrefixes.some((p) => key.startsWith(p)) && key !== ROLLING_BACKUP_STORAGE_KEY) {
            const val = storage.getItem(key);
            if (typeof val === 'string') data[key] = val;
          }
        }
      } else {
        Object.keys(storage).forEach((k) => {
          if (k && allowedPrefixes.some((p) => k.startsWith(p)) && k !== ROLLING_BACKUP_STORAGE_KEY) {
            if (typeof storage[k] === 'string') data[k] = storage[k];
          }
        });
      }

      const keyCount = Object.keys(data).length;
      const snapshot = {
        id,
        timestamp: iso,
        label: label || `Snapshot ${now.toLocaleDateString()}`,
        version:
          typeof storage.getItem === 'function'
            ? storage.getItem('moneySuperapp.schemaVersion') || '1'
            : storage['moneySuperapp.schemaVersion'] || '1',
        keyCount,
        data,
      };

      snapshots.unshift(snapshot);
      if (snapshots.length > MAX_ROLLING_SNAPSHOTS) {
        snapshots.splice(MAX_ROLLING_SNAPSHOTS);
      }

      const serialized = JSON.stringify(snapshots);
      if (typeof storage.setItem === 'function') {
        storage.setItem(ROLLING_BACKUP_STORAGE_KEY, serialized);
        storage.setItem(ROLLING_BACKUP_LAST_RUN_KEY, iso);
      } else {
        storage[ROLLING_BACKUP_STORAGE_KEY] = serialized;
        storage[ROLLING_BACKUP_LAST_RUN_KEY] = iso;
      }

      return snapshot;
    },

    restoreSnapshot: (snapshotId, storage = typeof localStorage !== 'undefined' ? localStorage : null) => {
      if (!storage || !snapshotId) return false;
      const snapshots = RollingBackup.listSnapshots(storage);
      const target = snapshots.find((s) => s.id === snapshotId);
      if (!target?.data) return false;

      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
      Object.keys(target.data).forEach((key) => {
        if (allowedPrefixes.some((p) => key.startsWith(p)) && key !== ROLLING_BACKUP_STORAGE_KEY) {
          if (typeof storage.setItem === 'function') {
            storage.setItem(key, target.data[key]);
          } else {
            storage[key] = target.data[key];
          }
        }
      });
      return true;
    },

    deleteSnapshot: (snapshotId, storage = typeof localStorage !== 'undefined' ? localStorage : null) => {
      if (!storage || !snapshotId) return false;
      const snapshots = RollingBackup.listSnapshots(storage);
      const filtered = snapshots.filter((s) => s.id !== snapshotId);
      const serialized = JSON.stringify(filtered);
      if (typeof storage.setItem === 'function') {
        storage.setItem(ROLLING_BACKUP_STORAGE_KEY, serialized);
      } else {
        storage[ROLLING_BACKUP_STORAGE_KEY] = serialized;
      }
      return filtered.length !== snapshots.length;
    },

    checkAndTriggerAutoBackup: (
      storage = typeof localStorage !== 'undefined' ? localStorage : null,
      minIntervalMs = 24 * 3600 * 1000,
    ) => {
      if (!storage) return null;
      const lastRun =
        typeof storage.getItem === 'function'
          ? storage.getItem(ROLLING_BACKUP_LAST_RUN_KEY)
          : storage[ROLLING_BACKUP_LAST_RUN_KEY];
      const now = Date.now();
      if (!lastRun || now - new Date(lastRun).getTime() >= minIntervalMs) {
        return RollingBackup.createSnapshot(storage, 'Automated Daily Snapshot');
      }
      return null;
    },
  };

  const CURRENT_SCHEMA_VERSION = 3;
  const SCHEMA_VERSION_KEY = 'moneySuperapp.schemaVersion';

  const SchemaMigration = {
    CURRENT_VERSION: CURRENT_SCHEMA_VERSION,
    VERSION_KEY: SCHEMA_VERSION_KEY,

    getStoredVersion: (storage = typeof localStorage !== 'undefined' ? localStorage : null) => {
      if (!storage) return 1;
      const v =
        typeof storage.getItem === 'function' ? storage.getItem(SCHEMA_VERSION_KEY) : storage[SCHEMA_VERSION_KEY];
      const parsed = parseInt(v, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
    },

    migrate: (
      storage = typeof localStorage !== 'undefined' ? localStorage : null,
      targetVersion = CURRENT_SCHEMA_VERSION,
    ) => {
      if (!storage) return { fromVersion: 1, toVersion: 1, appliedMigrations: [], migratedKeysCount: 0 };
      const fromVersion = SchemaMigration.getStoredVersion(storage);
      if (fromVersion >= targetVersion) {
        return { fromVersion, toVersion: fromVersion, appliedMigrations: [], migratedKeysCount: 0 };
      }

      const appliedMigrations = [];
      let migratedKeysCount = 0;

      // Migration v1 -> v2: Standardize multi-profile & activeProfile
      if (fromVersion < 2 && targetVersion >= 2) {
        const activeProfile =
          typeof storage.getItem === 'function'
            ? storage.getItem('moneySuperapp.activeProfile')
            : storage['moneySuperapp.activeProfile'];
        if (!activeProfile) {
          if (typeof storage.setItem === 'function') {
            storage.setItem('moneySuperapp.activeProfile', 'default');
          } else {
            storage['moneySuperapp.activeProfile'] = 'default';
          }
          migratedKeysCount++;
        }
        appliedMigrations.push('v1_to_v2_active_profile');
      }

      // Migration v2 -> v3: Standardize savings goals sinking fund annuity metadata
      if (fromVersion < 3 && targetVersion >= 3) {
        const goalsRaw =
          typeof storage.getItem === 'function'
            ? storage.getItem('moneySuperapp.financialGoals.v1')
            : storage['moneySuperapp.financialGoals.v1'];
        if (goalsRaw) {
          try {
            const parsed = JSON.parse(goalsRaw);
            let modified = false;
            if (Array.isArray(parsed.goals)) {
              parsed.goals = parsed.goals.map((g) => {
                if (g && typeof g === 'object') {
                  if (typeof g.sinkingFundEnabled === 'undefined') {
                    g.sinkingFundEnabled = true;
                    modified = true;
                  }
                  if (typeof g.expectedReturnAnnual === 'undefined') {
                    g.expectedReturnAnnual = 0.015;
                    modified = true;
                  }
                }
                return g;
              });
            }
            if (modified) {
              const updatedStr = JSON.stringify(parsed);
              if (typeof storage.setItem === 'function') {
                storage.setItem('moneySuperapp.financialGoals.v1', updatedStr);
              } else {
                storage['moneySuperapp.financialGoals.v1'] = updatedStr;
              }
              migratedKeysCount++;
            }
          } catch (_e) {}
        }
        appliedMigrations.push('v2_to_v3_savings_goals_sinking_fund');
      }

      if (typeof storage.setItem === 'function') {
        storage.setItem(SCHEMA_VERSION_KEY, String(targetVersion));
      } else {
        storage[SCHEMA_VERSION_KEY] = String(targetVersion);
      }

      return {
        fromVersion,
        toVersion: targetVersion,
        appliedMigrations,
        migratedKeysCount,
      };
    },
  };

  global.MoneyApp = global.MoneyApp || {};
  const MoneyApp = global.MoneyApp;
  MoneyApp.createStorageDB = createStorageDB;
  MoneyApp.Storage = defaultStorage;
  MoneyApp.StorageDB = defaultStorage;
  MoneyApp.RollingBackup = RollingBackup;
  MoneyApp.SchemaMigration = SchemaMigration;

  if (typeof global !== 'undefined') {
    if (typeof global.createStorageDB === 'undefined') {
      global.createStorageDB = createStorageDB;
    }
    if (typeof global.RollingBackup === 'undefined') {
      global.RollingBackup = RollingBackup;
    }
    if (typeof global.SchemaMigration === 'undefined') {
      global.SchemaMigration = SchemaMigration;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
