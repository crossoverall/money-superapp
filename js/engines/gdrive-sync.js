/**
 * Money Superapp - Google Drive Cloud Sync & Conflict Resolution Engine
 * Pure client-side zero-dependency snapshot comparator and intelligent merger.
 * Compatible with offline browser storage (file:// and http(s)://) and Node.js test runners.
 */

((global) => {
  const ALLOWED_PREFIXES = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];

  /**
   * Checks if a localStorage key belongs to the Money Superapp domain
   * @param {string} key
   * @returns {boolean}
   */
  function isAllowedKey(key) {
    if (!key || typeof key !== 'string') return false;
    return ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
  }

  /**
   * Generates a canonical snapshot payload from local storage or mock storage
   * @param {Storage|Object} storage - localStorage or plain object
   * @param {Object} [metadata={}] - additional optional metadata
   * @returns {Object} Structured backup snapshot
   */
  function createSnapshot(storage, metadata = {}) {
    const data = {};
    if (!storage) {
      return {
        version: '1.1.0',
        appName: 'Money Superapp',
        exportedAt: new Date().toISOString(),
        data: {},
      };
    }

    if (typeof storage.length === 'number' && typeof storage.key === 'function') {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (isAllowedKey(key)) {
          const val = storage.getItem(key);
          if (typeof val === 'string') {
            data[key] = val;
          }
        }
      }
    } else {
      // Plain object storage (e.g. in test fixtures or mock environments)
      Object.keys(storage).forEach((key) => {
        if (isAllowedKey(key) && typeof storage[key] === 'string') {
          data[key] = storage[key];
        }
      });
    }

    return {
      version: '1.1.0',
      appName: 'Money Superapp',
      exportedAt: metadata.exportedAt || new Date().toISOString(),
      activeProfile: metadata.activeProfile || data['moneySuperapp.activeProfile'] || 'default',
      data,
    };
  }

  /**
   * Compares local and remote snapshots to identify sync state, timing differences, and key changes
   * @param {Object} localSnapshot
   * @param {Object} remoteSnapshot
   * @returns {Object} Comparison report
   */
  function compareSnapshots(localSnapshot, remoteSnapshot) {
    const localData = localSnapshot?.data || {};
    const remoteData = remoteSnapshot?.data || {};

    const localTime = localSnapshot?.exportedAt ? new Date(localSnapshot.exportedAt).getTime() : 0;
    const remoteTime = remoteSnapshot?.exportedAt ? new Date(remoteSnapshot.exportedAt).getTime() : 0;

    const allKeys = new Set([...Object.keys(localData), ...Object.keys(remoteData)]);
    const localOnlyKeys = [];
    const remoteOnlyKeys = [];
    const modifiedKeys = [];
    const matchingKeys = [];

    allKeys.forEach((key) => {
      const hasLocal = Object.hasOwn(localData, key);
      const hasRemote = Object.hasOwn(remoteData, key);

      if (hasLocal && !hasRemote) {
        localOnlyKeys.push(key);
      } else if (!hasLocal && hasRemote) {
        remoteOnlyKeys.push(key);
      } else {
        if (localData[key] === remoteData[key]) {
          matchingKeys.push(key);
        } else {
          modifiedKeys.push(key);
        }
      }
    });

    const isIdentical = localOnlyKeys.length === 0 && remoteOnlyKeys.length === 0 && modifiedKeys.length === 0;

    let status = 'synced';
    if (!isIdentical) {
      if (modifiedKeys.length > 0) {
        // Any shared keys having different values represents an active modification conflict
        status = 'conflict';
      } else if (localOnlyKeys.length > 0 && remoteOnlyKeys.length === 0) {
        status = 'local_ahead';
      } else if (remoteOnlyKeys.length > 0 && localOnlyKeys.length === 0) {
        status = 'cloud_ahead';
      } else {
        // Both localOnly and remoteOnly keys exist
        status = 'conflict';
      }
    }

    return {
      status, // 'synced' | 'cloud_ahead' | 'local_ahead' | 'conflict'
      isIdentical,
      localTime,
      remoteTime,
      timeDifferenceMs: remoteTime - localTime,
      totalLocalKeys: Object.keys(localData).length,
      totalRemoteKeys: Object.keys(remoteData).length,
      localOnlyKeys,
      remoteOnlyKeys,
      modifiedKeys,
      matchingKeys,
    };
  }

  /**
   * Intelligently merges JSON values (arrays merged by unique property or item equivalence; objects shallow merged)
   * @param {string} localStr
   * @param {string} remoteStr
   * @param {boolean} preferRemoteOnScalarConflict
   * @returns {string} Merged serialized JSON
   */
  function mergeSerializedValues(localStr, remoteStr, preferRemoteOnScalarConflict = true) {
    if (localStr === remoteStr) return localStr;

    try {
      const localParsed = JSON.parse(localStr);
      const remoteParsed = JSON.parse(remoteStr);

      // 1. Array merger: deduplicate items by id/key/json equivalence
      if (Array.isArray(localParsed) && Array.isArray(remoteParsed)) {
        const mergedArray = [...localParsed];
        const seen = new Set(
          mergedArray.map((item) =>
            item && typeof item === 'object' ? item.id || item.month || item.name || JSON.stringify(item) : item,
          ),
        );

        remoteParsed.forEach((item) => {
          const key =
            item && typeof item === 'object' ? item.id || item.month || item.name || JSON.stringify(item) : item;
          if (!seen.has(key)) {
            seen.add(key);
            mergedArray.push(item);
          }
        });
        return JSON.stringify(mergedArray);
      }

      // 2. Object merger: combine properties, picking newer or non-undefined
      if (
        localParsed &&
        typeof localParsed === 'object' &&
        remoteParsed &&
        typeof remoteParsed === 'object' &&
        !Array.isArray(localParsed) &&
        !Array.isArray(remoteParsed)
      ) {
        const mergedObj = { ...localParsed };
        Object.keys(remoteParsed).forEach((k) => {
          if (mergedObj[k] === undefined) {
            mergedObj[k] = remoteParsed[k];
          } else if (preferRemoteOnScalarConflict) {
            mergedObj[k] = remoteParsed[k];
          }
        });
        return JSON.stringify(mergedObj);
      }
    } catch (_e) {
      // Fall through if not valid JSON
    }

    return preferRemoteOnScalarConflict ? remoteStr : localStr;
  }

  /**
   * Merges local and remote snapshots based on the chosen strategy
   * @param {Object} localSnapshot
   * @param {Object} remoteSnapshot
   * @param {'cloud'|'local'|'merge'} [strategy='merge']
   * @returns {Object} { data: Object, strategy: string, resolvedCount: number, exportedAt: string }
   */
  function mergeSnapshots(localSnapshot, remoteSnapshot, strategy = 'merge') {
    const localData = localSnapshot?.data || {};
    const remoteData = remoteSnapshot?.data || {};

    if (strategy === 'cloud') {
      const cleanData = {};
      Object.keys(remoteData).forEach((k) => {
        if (isAllowedKey(k)) cleanData[k] = remoteData[k];
      });
      return {
        strategy: 'cloud',
        data: cleanData,
        resolvedCount: Object.keys(cleanData).length,
        exportedAt: remoteSnapshot?.exportedAt || new Date().toISOString(),
      };
    }

    if (strategy === 'local') {
      const cleanData = {};
      Object.keys(localData).forEach((k) => {
        if (isAllowedKey(k)) cleanData[k] = localData[k];
      });
      return {
        strategy: 'local',
        data: cleanData,
        resolvedCount: Object.keys(cleanData).length,
        exportedAt: localSnapshot?.exportedAt || new Date().toISOString(),
      };
    }

    // Default: 'merge' (Smart 3-way/differential merge)
    const mergedData = {};
    const allKeys = new Set([...Object.keys(localData), ...Object.keys(remoteData)]);
    let resolvedConflicts = 0;

    const localTime = localSnapshot?.exportedAt ? new Date(localSnapshot.exportedAt).getTime() : 0;
    const remoteTime = remoteSnapshot?.exportedAt ? new Date(remoteSnapshot.exportedAt).getTime() : 0;
    const preferRemote = remoteTime >= localTime;

    allKeys.forEach((key) => {
      if (!isAllowedKey(key)) return;

      const hasLocal = Object.hasOwn(localData, key);
      const hasRemote = Object.hasOwn(remoteData, key);

      if (hasLocal && !hasRemote) {
        mergedData[key] = localData[key];
      } else if (!hasLocal && hasRemote) {
        mergedData[key] = remoteData[key];
      } else {
        // Both have key
        if (localData[key] === remoteData[key]) {
          mergedData[key] = localData[key];
        } else {
          resolvedConflicts++;
          mergedData[key] = mergeSerializedValues(localData[key], remoteData[key], preferRemote);
        }
      }
    });

    return {
      strategy: 'merge',
      data: mergedData,
      resolvedCount: Object.keys(mergedData).length,
      conflictsResolved: resolvedConflicts,
      exportedAt: new Date().toISOString(),
    };
  }

  /**
   * Applies snapshot dataset into storage (localStorage or target object)
   * @param {Object} dataDict - Map of key/values to write
   * @param {Storage|Object} storage - Target storage
   * @returns {number} Count of keys applied
   */
  function applySnapshot(dataDict, storage) {
    if (!dataDict || typeof dataDict !== 'object' || !storage) return 0;
    let applied = 0;

    Object.keys(dataDict).forEach((key) => {
      if (isAllowedKey(key) && typeof dataDict[key] === 'string') {
        if (typeof storage.setItem === 'function') {
          storage.setItem(key, dataDict[key]);
        } else {
          storage[key] = dataDict[key];
        }
        applied++;
      }
    });

    return applied;
  }

  /**
   * Helper to format a friendly human-readable timestamp in TH or EN
   * @param {string|Date|number} timestamp
   * @param {'th'|'en'} [lang='th']
   * @returns {string}
   */
  function formatSyncTimestamp(timestamp, lang = 'th') {
    if (!timestamp) return lang === 'en' ? 'Never' : 'ไม่เคย';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return lang === 'en' ? 'Unknown' : 'ไม่ทราบ';

    return date.toLocaleString(lang === 'en' ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  // Export to MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.GoogleDrive = {
    ALLOWED_PREFIXES,
    isAllowedKey,
    createSnapshot,
    compareSnapshots,
    mergeSnapshots,
    applySnapshot,
    formatSyncTimestamp,
  };
})(typeof window !== 'undefined' ? window : globalThis);
