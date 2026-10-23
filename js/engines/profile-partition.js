/**
 * Money Superapp - Multi-Profile Partition Engine (Phase 139 / Pillar 5.1 / v2.6.0)
 * Provides first-class multi-profile data isolation across Personal, Family/Household,
 * and Freelance/Business financial domains.
 *
 * Implements atomic partition snapshotting, key prefixing, deep-copy cloning,
 * profile bundle export/import, and active profile state switching.
 * 100% offline-first, client-side, zero runtime dependencies (ADR-001).
 */

((global) => {
  const REGISTRY_KEY = 'moneySuperapp.profiles.list';
  const ACTIVE_PROFILE_KEY = 'moneySuperapp.profiles.active';
  const PARTITION_PREFIX = 'moneySuperapp.partition.';

  /**
   * System default profiles available out of the box.
   */
  const DEFAULT_PROFILES = [
    {
      id: 'personal',
      name: 'Personal',
      nameTh: 'ส่วนตัว',
      icon: '👤',
      type: 'personal',
      isDefault: true,
      description: 'Personal salary, tax, and individual investments',
      descriptionTh: 'พอร์ตการเงินส่วนบุคคล เงินเดือน ภาษี และเงินลงทุน',
      createdAt: 1700000000000,
    },
    {
      id: 'family',
      name: 'Family / Household',
      nameTh: 'ครอบครัว',
      icon: '👨‍👩‍👧‍👦',
      type: 'family',
      isDefault: false,
      description: 'Shared household budget, emergency fund, and family care',
      descriptionTh: 'งบประมาณครอบครัว ค่าใช้จ่ายในบ้าน และกองทุนฉุกเฉินรวม',
      createdAt: 1700000000001,
    },
    {
      id: 'freelance',
      name: 'Freelance / Business',
      nameTh: 'ธุรกิจ / ฟรีแลนซ์',
      icon: '💼',
      type: 'freelance',
      isDefault: false,
      description: 'Freelance revenue, withholding tax, and commercial cash flow',
      descriptionTh: 'รายได้ฟรีแลนซ์ ภาษีหัก ณ ที่จ่าย และกระแสเงินสดธุรกิจ',
      createdAt: 1700000000002,
    },
  ];

  /**
   * Global keys that persist identically across all profiles (theme, lang, security, metadata).
   */
  const GLOBAL_KEYS = new Set([
    'moneySuperapp.theme',
    'moneySuperapp.lang',
    'moneySuperapp.activeTab',
    'moneySuperapp.activeProfile',
    'moneySuperapp.profiles.list',
    'moneySuperapp.profiles.active',
    'moneySuperapp.pwaDismissed',
    'moneySuperapp.hasSeenOnboarding',
    'moneySuperapp.appLock',
    'moneySuperapp.googleClientId',
    'moneySuperapp.googleUser',
    'moneySuperapp.lastGoogleSync',
    'moneySuperapp.pendingGoogleRestore',
  ]);

  /**
   * Allowed app domain key prefixes subject to partitioning.
   */
  const APP_DATA_PREFIXES = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];

  function getStorage(customStorage) {
    if (customStorage) return customStorage;
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
    if (typeof localStorage !== 'undefined') return localStorage;
    return null;
  }

  function isGlobalKey(key) {
    if (!key || typeof key !== 'string') return true;
    if (GLOBAL_KEYS.has(key)) return true;
    if (key.startsWith(PARTITION_PREFIX)) return true;
    return false;
  }

  function isAppDataKey(key) {
    if (!key || typeof key !== 'string') return false;
    if (isGlobalKey(key)) return false;
    for (let i = 0; i < APP_DATA_PREFIXES.length; i++) {
      if (key.startsWith(APP_DATA_PREFIXES[i])) return true;
    }
    return false;
  }

  function safeStorageGet(storage, key) {
    try {
      if (!storage) return null;
      const raw = storage.getItem(key);
      if (raw === null || raw === undefined) return null;
      try {
        return JSON.parse(raw);
      } catch (_e) {
        return raw;
      }
    } catch (_e) {
      return null;
    }
  }

  function safeStorageSet(storage, key, val) {
    try {
      if (!storage) return false;
      const str = typeof val === 'string' ? val : JSON.stringify(val);
      storage.setItem(key, str);
      return true;
    } catch (_e) {
      return false;
    }
  }

  function safeStorageRemove(storage, key) {
    try {
      if (!storage) return false;
      storage.removeItem(key);
      return true;
    } catch (_e) {
      return false;
    }
  }

  function getStorageKeys(storage) {
    const keys = [];
    if (!storage) return keys;
    try {
      if (typeof storage.length === 'number' && typeof storage.key === 'function') {
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (k) keys.push(k);
        }
      } else if (storage._keys && Array.isArray(storage._keys)) {
        return [...storage._keys];
      } else {
        return Object.keys(storage);
      }
    } catch (_e) {}
    return keys;
  }

  /**
   * Initializes profile registry and active profile pointer.
   * Auto-snapshots existing un-partitioned data to 'personal' profile partition.
   * @param {Object} [customStorage]
   * @returns {{ activeProfile: Object, profiles: Array<Object> }}
   */
  function initProfiles(customStorage) {
    const storage = getStorage(customStorage);
    let profiles = safeStorageGet(storage, REGISTRY_KEY);

    if (!Array.isArray(profiles) || profiles.length === 0) {
      profiles = JSON.parse(JSON.stringify(DEFAULT_PROFILES));
      safeStorageSet(storage, REGISTRY_KEY, profiles);
    }

    let activeId = safeStorageGet(storage, ACTIVE_PROFILE_KEY);
    if (!activeId || typeof activeId !== 'string' || !profiles.some((p) => p.id === activeId)) {
      activeId = 'personal';
      safeStorageSet(storage, ACTIVE_PROFILE_KEY, activeId);
    }

    // Migration safeguard: if personal partition doesn't exist yet, snapshot current active keys
    const personalPartitionKey = `${PARTITION_PREFIX}personal`;
    const existingPersonalPartition = safeStorageGet(storage, personalPartitionKey);
    if (!existingPersonalPartition && storage) {
      const activeData = captureActiveData(storage);
      if (Object.keys(activeData).length > 0) {
        safeStorageSet(storage, personalPartitionKey, activeData);
      } else {
        safeStorageSet(storage, personalPartitionKey, {});
      }
    }

    // Ensure family and freelance partitions exist
    for (const p of profiles) {
      const partKey = PARTITION_PREFIX + p.id;
      if (!safeStorageGet(storage, partKey)) {
        safeStorageSet(storage, partKey, {});
      }
    }

    const activeProfile = profiles.find((p) => p.id === activeId) || profiles[0];
    return { activeProfile, profiles };
  }

  /**
   * Lists all registered profiles.
   * @param {Object} [customStorage]
   * @returns {Array<Object>}
   */
  function listProfiles(customStorage) {
    const storage = getStorage(customStorage);
    const profiles = safeStorageGet(storage, REGISTRY_KEY);
    return Array.isArray(profiles) ? profiles : JSON.parse(JSON.stringify(DEFAULT_PROFILES));
  }

  /**
   * Returns currently active profile descriptor.
   * @param {Object} [customStorage]
   * @returns {Object}
   */
  function getActiveProfile(customStorage) {
    const storage = getStorage(customStorage);
    const profiles = listProfiles(storage);
    const activeId = safeStorageGet(storage, ACTIVE_PROFILE_KEY) || 'personal';
    return profiles.find((p) => p.id === activeId) || profiles[0];
  }

  /**
   * Finds profile by identifier.
   * @param {string} profileId
   * @param {Object} [customStorage]
   * @returns {Object|null}
   */
  function getProfileById(profileId, customStorage) {
    if (!profileId) return null;
    const profiles = listProfiles(customStorage);
    return profiles.find((p) => p.id === profileId) || null;
  }

  /**
   * Captures all non-global app domain keys from storage as a snapshot dictionary.
   * @param {Object} [customStorage]
   * @returns {Object}
   */
  function captureActiveData(customStorage) {
    const storage = getStorage(customStorage);
    const result = Object.create(null);
    if (!storage) return result;

    const keys = getStorageKeys(storage);
    for (const key of keys) {
      if (isAppDataKey(key)) {
        try {
          const raw = storage.getItem(key);
          if (raw !== null && raw !== undefined) {
            result[key] = raw;
          }
        } catch (_e) {}
      }
    }
    return result;
  }

  /**
   * Restores a snapshot dictionary into active storage.
   * @param {Object} dataObj
   * @param {Object} [customStorage]
   * @returns {number} Count of restored keys
   */
  function restoreActiveData(dataObj, customStorage) {
    const storage = getStorage(customStorage);
    if (!storage || !dataObj || typeof dataObj !== 'object') return 0;

    let count = 0;
    for (const [k, v] of Object.entries(dataObj)) {
      if (k === '__proto__' || k === 'constructor' || k === 'prototype') continue;
      try {
        const str = typeof v === 'string' ? v : JSON.stringify(v);
        storage.setItem(k, str);
        count++;
      } catch (_e) {}
    }
    return count;
  }

  /**
   * Clears all active app domain keys from storage without touching global keys or partition snapshots.
   * @param {Object} [customStorage]
   * @returns {number} Count of removed keys
   */
  function clearActiveData(customStorage) {
    const storage = getStorage(customStorage);
    if (!storage) return 0;

    const keys = getStorageKeys(storage);
    const toRemove = [];
    for (const key of keys) {
      if (isAppDataKey(key)) {
        toRemove.push(key);
      }
    }

    for (const k of toRemove) {
      try {
        storage.removeItem(k);
      } catch (_e) {}
    }
    return toRemove.length;
  }

  /**
   * Creates a new profile and initializes its partition.
   * @param {Object} options
   * @param {string} options.name
   * @param {string} [options.nameTh]
   * @param {string} [options.icon='👤']
   * @param {string} [options.type='custom']
   * @param {string} [options.description]
   * @param {string} [options.descriptionTh]
   * @param {Object} [customStorage]
   * @returns {Object} Newly created profile descriptor
   */
  function createProfile(options, customStorage) {
    const storage = getStorage(customStorage);
    const opts = options || {};
    const name = String(opts.name || '').trim();
    if (!name) {
      throw new Error('Profile name is required');
    }

    const profiles = listProfiles(storage);
    const slugBase =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'profile';

    let id = slugBase;
    let counter = 1;
    while (profiles.some((p) => p.id === id)) {
      id = `${slugBase}-${counter++}`;
    }

    const newProfile = {
      id,
      name,
      nameTh: opts.nameTh || name,
      icon: opts.icon || '📁',
      type: opts.type || 'custom',
      isDefault: false,
      description: opts.description || '',
      descriptionTh: opts.descriptionTh || '',
      createdAt: Date.now(),
    };

    profiles.push(newProfile);
    safeStorageSet(storage, REGISTRY_KEY, profiles);
    safeStorageSet(storage, PARTITION_PREFIX + id, {});

    return newProfile;
  }

  /**
   * Updates an existing profile's metadata.
   * @param {string} profileId
   * @param {Object} updates
   * @param {Object} [customStorage]
   * @returns {Object} Updated profile
   */
  function updateProfile(profileId, updates, customStorage) {
    const storage = getStorage(customStorage);
    const profiles = listProfiles(storage);
    const idx = profiles.findIndex((p) => p.id === profileId);
    if (idx === -1) {
      throw new Error(`Profile ${profileId} not found`);
    }

    const u = updates || {};
    const profile = profiles[idx];

    if (u.name) profile.name = String(u.name).trim();
    if (u.nameTh) profile.nameTh = String(u.nameTh).trim();
    if (u.icon) profile.icon = String(u.icon).trim();
    if (u.description !== undefined) profile.description = String(u.description);
    if (u.descriptionTh !== undefined) profile.descriptionTh = String(u.descriptionTh);

    profiles[idx] = profile;
    safeStorageSet(storage, REGISTRY_KEY, profiles);
    return profile;
  }

  /**
   * Deletes a profile and its partition storage.
   * Safeguards:
   * 1. Cannot delete default profile.
   * 2. Cannot delete currently active profile (must switch first).
   * 3. Cannot delete if only 1 profile remains.
   * @param {string} profileId
   * @param {Object} [customStorage]
   * @returns {{ success: boolean, deletedId: string }}
   */
  function deleteProfile(profileId, customStorage) {
    const storage = getStorage(customStorage);
    const profiles = listProfiles(storage);
    const activeProfile = getActiveProfile(storage);

    if (activeProfile.id === profileId) {
      throw new Error('Cannot delete currently active profile. Switch to another profile first.');
    }

    const target = profiles.find((p) => p.id === profileId);
    if (!target) {
      throw new Error(`Profile ${profileId} not found`);
    }

    if (target.isDefault) {
      throw new Error('Cannot delete default system profile.');
    }

    if (profiles.length <= 1) {
      throw new Error('Cannot delete the last remaining profile.');
    }

    const updated = profiles.filter((p) => p.id !== profileId);
    safeStorageSet(storage, REGISTRY_KEY, updated);
    safeStorageRemove(storage, PARTITION_PREFIX + profileId);

    return { success: true, deletedId: profileId };
  }

  /**
   * Clones a profile partition producing an independent deep copy.
   * @param {string} sourceProfileId
   * @param {Object} options
   * @param {string} options.name
   * @param {string} [options.nameTh]
   * @param {string} [options.icon]
   * @param {Object} [customStorage]
   * @returns {Object} New cloned profile descriptor
   */
  function cloneProfile(sourceProfileId, options, customStorage) {
    const storage = getStorage(customStorage);
    const source = getProfileById(sourceProfileId, storage);
    if (!source) {
      throw new Error(`Source profile ${sourceProfileId} not found`);
    }

    const activeProfile = getActiveProfile(storage);
    let sourceData = {};

    if (activeProfile.id === sourceProfileId) {
      sourceData = captureActiveData(storage);
    } else {
      sourceData = safeStorageGet(storage, PARTITION_PREFIX + sourceProfileId) || {};
    }

    const opts = options || {};
    const newName = opts.name || `${source.name} (Copy)`;
    const newNameTh = opts.nameTh || `${source.nameTh || source.name} (สำเนา)`;
    const newIcon = opts.icon || source.icon;

    const created = createProfile(
      {
        name: newName,
        nameTh: newNameTh,
        icon: newIcon,
        type: source.type,
        description: `Cloned from ${source.name}`,
        descriptionTh: `คัดลอกจาก ${source.nameTh || source.name}`,
      },
      storage,
    );

    safeStorageSet(storage, PARTITION_PREFIX + created.id, JSON.parse(JSON.stringify(sourceData)));
    return created;
  }

  /**
   * Switches the active profile:
   * 1. Captures current active data into current profile's partition snapshot.
   * 2. Clears current active data keys from storage.
   * 3. Restores target profile's partition snapshot into active keys.
   * 4. Updates active profile pointer.
   * @param {string} targetProfileId
   * @param {Object} [customStorage]
   * @returns {{ success: boolean, unchanged?: boolean, from: string, to: string, restoredKeyCount: number }}
   */
  function switchProfile(targetProfileId, customStorage) {
    const storage = getStorage(customStorage);
    if (!targetProfileId) {
      throw new Error('Target profile ID is required');
    }

    const profiles = listProfiles(storage);
    const target = profiles.find((p) => p.id === targetProfileId);
    if (!target) {
      throw new Error(`Target profile ${targetProfileId} not found`);
    }

    const currentActiveId = safeStorageGet(storage, ACTIVE_PROFILE_KEY) || 'personal';
    if (currentActiveId === targetProfileId) {
      return {
        success: true,
        unchanged: true,
        from: currentActiveId,
        to: targetProfileId,
        restoredKeyCount: 0,
      };
    }

    // 1. Snapshot current active keys
    const currentData = captureActiveData(storage);
    safeStorageSet(storage, PARTITION_PREFIX + currentActiveId, currentData);

    // 2. Clear active keys
    clearActiveData(storage);

    // 3. Retrieve target partition data
    const targetData = safeStorageGet(storage, PARTITION_PREFIX + targetProfileId) || {};

    // 4. Restore target keys
    const restoredKeyCount = restoreActiveData(targetData, storage);

    // 5. Update active pointer
    safeStorageSet(storage, ACTIVE_PROFILE_KEY, targetProfileId);

    return {
      success: true,
      from: currentActiveId,
      to: targetProfileId,
      restoredKeyCount,
    };
  }

  /**
   * Exports an individual profile and its partition data as a portable bundle.
   * @param {string} profileId
   * @param {Object} [customStorage]
   * @returns {Object} Export bundle
   */
  function exportProfile(profileId, customStorage) {
    const storage = getStorage(customStorage);
    const profile = getProfileById(profileId, storage);
    if (!profile) {
      throw new Error(`Profile ${profileId} not found`);
    }

    const activeProfile = getActiveProfile(storage);
    let data = {};
    if (activeProfile.id === profileId) {
      data = captureActiveData(storage);
    } else {
      data = safeStorageGet(storage, PARTITION_PREFIX + profileId) || {};
    }

    return {
      version: '2.6.0',
      schema: 'moneySuperapp.profileExport.v1',
      exportedAt: new Date().toISOString(),
      profile: { ...profile },
      data: { ...data },
      keyCount: Object.keys(data).length,
    };
  }

  /**
   * Exports all profiles and partitions in a single multi-profile backup bundle.
   * @param {Object} [customStorage]
   * @returns {Object} Master backup bundle
   */
  function exportAllProfiles(customStorage) {
    const storage = getStorage(customStorage);
    const profiles = listProfiles(storage);
    const activeProfile = getActiveProfile(storage);

    // Snapshot current active state first
    const activeData = captureActiveData(storage);
    safeStorageSet(storage, PARTITION_PREFIX + activeProfile.id, activeData);

    const partitions = Object.create(null);
    for (const p of profiles) {
      partitions[p.id] = safeStorageGet(storage, PARTITION_PREFIX + p.id) || {};
    }

    return {
      version: '2.6.0',
      schema: 'moneySuperapp.multiProfileBundle.v1',
      exportedAt: new Date().toISOString(),
      activeProfileId: activeProfile.id,
      profiles: [...profiles],
      partitions,
    };
  }

  /**
   * Imports an individual profile package.
   * @param {Object} pkg
   * @param {Object} [options]
   * @param {boolean} [options.overwrite=false]
   * @param {Object} [customStorage]
   * @returns {Object} Imported profile
   */
  function importProfile(pkg, options, customStorage) {
    const storage = getStorage(customStorage);
    if (!pkg || typeof pkg !== 'object' || !pkg.profile || !pkg.data) {
      throw new Error('Invalid profile export package format');
    }

    const opts = options || {};
    const incomingProfile = pkg.profile;
    const incomingData = pkg.data;
    const profiles = listProfiles(storage);

    let targetProfile = profiles.find((p) => p.id === incomingProfile.id);

    if (targetProfile && !opts.overwrite) {
      // Create with new unique ID
      targetProfile = createProfile(
        {
          name: `${incomingProfile.name} (Imported)`,
          nameTh: `${incomingProfile.nameTh || incomingProfile.name} (นำเข้า)`,
          icon: incomingProfile.icon || '📥',
          type: incomingProfile.type || 'custom',
          description: incomingProfile.description || 'Imported profile',
          descriptionTh: incomingProfile.descriptionTh || 'โปรไฟล์ที่นำเข้า',
        },
        storage,
      );
    } else if (!targetProfile) {
      profiles.push({ ...incomingProfile });
      safeStorageSet(storage, REGISTRY_KEY, profiles);
      targetProfile = incomingProfile;
    }

    safeStorageSet(storage, PARTITION_PREFIX + targetProfile.id, incomingData);

    const activeProfile = getActiveProfile(storage);
    if (activeProfile.id === targetProfile.id) {
      restoreActiveData(incomingData, storage);
    }

    return targetProfile;
  }

  /**
   * Computes partition metrics for a given profile.
   * @param {string} profileId
   * @param {Object} [customStorage]
   * @returns {{ keyCount: number, byteSize: number, formattedSize: string }}
   */
  function getProfileMetrics(profileId, customStorage) {
    const storage = getStorage(customStorage);
    const activeProfile = getActiveProfile(storage);
    let data = {};

    if (activeProfile.id === profileId) {
      data = captureActiveData(storage);
    } else {
      data = safeStorageGet(storage, PARTITION_PREFIX + profileId) || {};
    }

    const keys = Object.keys(data);
    let bytes = 0;
    for (const [k, v] of Object.entries(data)) {
      const vStr = typeof v === 'string' ? v : JSON.stringify(v);
      bytes += (k.length + (vStr ? vStr.length : 0)) * 2;
    }

    function formatB(b) {
      if (b === 0) return '0 B';
      if (b < 1024) return `${b} B`;
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(b) / Math.log(k));
      return `${(b / k ** i).toFixed(1)} ${sizes[i]}`;
    }

    return {
      keyCount: keys.length,
      byteSize: bytes,
      formattedSize: formatB(bytes),
    };
  }

  const ProfilePartition = {
    DEFAULT_PROFILES,
    GLOBAL_KEYS,
    REGISTRY_KEY,
    ACTIVE_PROFILE_KEY,
    PARTITION_PREFIX,
    initProfiles,
    listProfiles,
    getActiveProfile,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    cloneProfile,
    switchProfile,
    captureActiveData,
    restoreActiveData,
    clearActiveData,
    exportProfile,
    exportAllProfiles,
    importProfile,
    getProfileMetrics,
    isGlobalKey,
    isAppDataKey,
  };

  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.ProfilePartition = ProfilePartition;

  if (typeof global !== 'undefined') {
    if (typeof global.ProfilePartition === 'undefined') {
      global.ProfilePartition = ProfilePartition;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
