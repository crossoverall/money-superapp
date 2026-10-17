/**
 * Money Superapp - Shared Core Utilities
 * Lightweight, zero-dependency helper functions shared across all tools.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var LANG = (() => {
    try {
      return (typeof localStorage !== 'undefined' && localStorage.getItem('moneySuperapp.lang')) || 'th';
    } catch (_e) {
      return 'th';
    }
  })();

  var THEME = (() => {
    try {
      return (typeof localStorage !== 'undefined' && localStorage.getItem('moneySuperapp.theme')) || 'light';
    } catch (_e) {
      return 'light';
    }
  })();

  var unit = LANG === 'en' ? 'THB' : 'บาท';

  function initTheme() {
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = LANG;
      document.documentElement.dataset.theme = THEME;
    }
  }

  function formatMoney(amount, decimals) {
    var dec = typeof decimals === 'number' ? decimals : 0;
    var num = Number(amount) || 0;
    return num.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  function parseNum(val) {
    if (typeof val === 'number') return Number.isNaN(val) ? 0 : val;
    if (!val) return 0;
    var clean = String(val).replace(/,/g, '').trim();
    return parseFloat(clean) || 0;
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(
      /[&<>"']/g,
      (m) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[m],
    );
  }

  function escapeAttr(str) {
    if (str == null) return '';
    return String(str).replace(/"/g, '&quot;');
  }

  function initShortcutForwarding() {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('keydown', (e) => {
        if (e.altKey && e.key >= '1' && e.key <= '7') {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ action: 'shortcutKey', key: e.key }, '*');
            }
          } catch (_err) {}
        }
      });
    }
  }

  function safeJsonParse(key, fallback) {
    if (typeof localStorage === 'undefined') return fallback;
    var raw;
    var parsed;
    try {
      raw = localStorage.getItem(key);
      if (!raw) return fallback;
      parsed = JSON.parse(raw);
      return parsed != null ? parsed : fallback;
    } catch (_e) {
      console.warn('[MoneySuperapp] Corrupted localStorage key:', key);
      return fallback;
    }
  }

  function createUndoManager(options) {
    var opts = options || {};
    var maxDepth = opts.maxDepth || 15;
    var onUndo = opts.onUndo || (() => {});
    var stack = [];

    function push(state) {
      if (state == null) return;
      var clone;
      try {
        clone = JSON.parse(JSON.stringify(state));
        stack.push(clone);
        if (stack.length > maxDepth) {
          stack.shift();
        }
      } catch (_e) {}
    }

    function undo() {
      if (stack.length === 0) return null;
      var previous = stack.pop();
      try {
        onUndo(previous);
      } catch (_e) {}
      return previous;
    }

    function canUndo() {
      return stack.length > 0;
    }

    function size() {
      return stack.length;
    }

    function clear() {
      stack = [];
    }

    if (opts.enableShortcuts && typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
          const tag = e.target?.tagName;
          if (tag === 'INPUT' || tag === 'TEXTAREA') return;
          if (canUndo()) {
            e.preventDefault();
            undo();
          }
        }
      });
    }

    return {
      push: push,
      undo: undo,
      canUndo: canUndo,
      size: size,
      clear: clear,
    };
  }

  function detectSwipeGesture(params) {
    if (!params) return null;
    var startX = params.startX;
    var startY = params.startY;
    var endX = params.endX;
    var endY = params.endY;
    var startTime = params.startTime || 0;
    var endTime = params.endTime || 0;
    var minDistance = params.minDistance || 60;
    var maxPerpendicular = params.maxPerpendicular || 50;
    var maxDuration = params.maxDuration || 550;

    if (typeof startX !== 'number' || typeof endX !== 'number') return null;
    if (typeof startY !== 'number' || typeof endY !== 'number') return null;

    var duration = endTime - startTime;
    if (duration > maxDuration) return null;

    var deltaX = endX - startX;
    var deltaY = endY - startY;
    var absX = Math.abs(deltaX);
    var absY = Math.abs(deltaY);

    if (absX < minDistance) return null;
    if (absY > maxPerpendicular) return null;
    if (absX / (absY + 1) < 1.7) return null;

    return {
      direction: deltaX < 0 ? 'next' : 'prev',
      deltaX: deltaX,
      deltaY: deltaY,
      duration: duration,
    };
  }

  function isInteractiveElement(target) {
    if (!target?.closest) return false;
    return Boolean(
      target.closest(
        'input, textarea, select, button, [contenteditable="true"], .no-swipe, [role="slider"], [role="scrollbar"]',
      ),
    );
  }

  function initTouchSwipeNavigation() {
    if (typeof window === 'undefined' || !window.addEventListener) return;
    var touchStartX = 0;
    var touchStartY = 0;
    var touchStartTime = 0;
    var isIgnored = false;

    window.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches?.length !== 1) {
          isIgnored = true;
          return;
        }
        isIgnored = isInteractiveElement(e.target);
        if (isIgnored) return;

        var touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
      },
      { passive: true },
    );

    window.addEventListener(
      'touchend',
      (e) => {
        if (isIgnored || !e.changedTouches?.length) return;
        var touch = e.changedTouches[0];
        var swipe = detectSwipeGesture({
          startX: touchStartX,
          startY: touchStartY,
          endX: touch.clientX,
          endY: touch.clientY,
          startTime: touchStartTime,
          endTime: Date.now(),
        });
        if (swipe) {
          try {
            if (window.parent && window.parent !== window) {
              window.parent.postMessage({ action: 'swipeTab', direction: swipe.direction }, '*');
            }
          } catch (_err) {}
        }
      },
      { passive: true },
    );
  }

  function formatBytes(bytes) {
    if (bytes == null || Number.isNaN(bytes) || bytes <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let i = Math.floor(Math.log(bytes) / Math.log(1024));
    i = Math.min(units.length - 1, Math.max(0, i));
    const val = bytes / 1024 ** i;
    return `${val < 10 && i > 0 ? val.toFixed(1) : Math.round(val)} ${units[i]}`;
  }

  function partitionSnapshots(snapshots, maxMonths, referenceDate) {
    const months = typeof maxMonths === 'number' ? maxMonths : 12;
    const ref = referenceDate instanceof Date ? referenceDate : new Date();
    if (!Array.isArray(snapshots) || snapshots.length <= 3) {
      return {
        active: snapshots || [],
        toArchive: [],
        cutoffDate: null,
      };
    }

    const cutoff = new Date(ref.getFullYear(), ref.getMonth() - months, 1);
    const y = cutoff.getFullYear();
    const m = String(cutoff.getMonth() + 1).padStart(2, '0');
    const d = String(cutoff.getDate()).padStart(2, '0');
    const cutoffStr = `${y}-${m}-${d}`;

    const sorted = snapshots.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const active = [];
    const toArchive = [];

    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      if (s.date < cutoffStr) {
        toArchive.push(s);
      } else {
        active.push(s);
      }
    }

    while (active.length < 3 && toArchive.length > 0) {
      active.unshift(toArchive.pop());
    }

    return {
      active: active,
      toArchive: toArchive,
      cutoffDate: cutoffStr,
    };
  }

  function createIndexedDBAdapter(options) {
    const opts = options || {};
    const dbName = opts.dbName || 'moneySuperapp_idb';
    const storeName = opts.storeName || 'keyvalue';
    const version = opts.version || 1;
    const customIDB =
      opts.indexedDB || (typeof window !== 'undefined' && 'indexedDB' in window ? window.indexedDB : null);
    const fallbackMemory = {};
    let dbPromise = null;

    function openDB() {
      if (dbPromise) return dbPromise;
      if (!customIDB) {
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
        } catch (_e) {
          resolve(null);
        }
      });
      return dbPromise;
    }

    function get(key) {
      return openDB().then((db) => {
        if (!db) {
          return Object.hasOwn(fallbackMemory, key) ? fallbackMemory[key] : null;
        }
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const req = store.get(key);
            req.onsuccess = () => resolve(req.result != null ? req.result : null);
            req.onerror = () => resolve(null);
          } catch (_e) {
            resolve(null);
          }
        });
      });
    }

    function set(key, value) {
      return openDB().then((db) => {
        fallbackMemory[key] = value;
        if (!db) {
          return Promise.resolve(true);
        }
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.put(value, key);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
          } catch (_e) {
            resolve(false);
          }
        });
      });
    }

    function del(key) {
      return openDB().then((db) => {
        delete fallbackMemory[key];
        if (!db) {
          return Promise.resolve(true);
        }
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const req = store.delete(key);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
          } catch (_e) {
            resolve(false);
          }
        });
      });
    }

    function keys() {
      return openDB().then((db) => {
        if (!db) {
          return Promise.resolve(Object.keys(fallbackMemory));
        }
        return new Promise((resolve) => {
          try {
            const tx = db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            if (store.getAllKeys) {
              const req = store.getAllKeys();
              req.onsuccess = () => resolve(req.result || []);
              req.onerror = () => resolve(Object.keys(fallbackMemory));
            } else {
              resolve(Object.keys(fallbackMemory));
            }
          } catch (_e) {
            resolve(Object.keys(fallbackMemory));
          }
        });
      });
    }

    function estimate() {
      if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
        return navigator.storage
          .estimate()
          .then((est) => {
            const usage = est.usage || 0;
            const quota = est.quota || 0;
            const pct = quota > 0 ? parseFloat(((usage / quota) * 100).toFixed(2)) : 0;
            return {
              supported: true,
              usage: usage,
              quota: quota,
              usagePct: pct,
              formattedUsage: formatBytes(usage),
              formattedQuota: formatBytes(quota),
            };
          })
          .catch(() => fallbackEstimate());
      }
      return Promise.resolve(fallbackEstimate());
    }

    function fallbackEstimate() {
      let bytes = 0;
      try {
        if (typeof localStorage !== 'undefined') {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            const v = localStorage.getItem(k);
            bytes += (k ? k.length : 0) + (v ? v.length : 0);
          }
        }
      } catch (_e) {}
      const approxBytes = bytes * 2;
      const defaultQuota = 5 * 1024 * 1024;
      return {
        supported: false,
        usage: approxBytes,
        quota: defaultQuota,
        usagePct: parseFloat(((approxBytes / defaultQuota) * 100).toFixed(2)),
        formattedUsage: formatBytes(approxBytes),
        formattedQuota: '5.0 MB (localStorage limit)',
      };
    }

    return {
      get: get,
      set: set,
      delete: del,
      keys: keys,
      estimate: estimate,
      formatBytes: formatBytes,
      isSupported: Boolean(customIDB),
    };
  }

  var idbStorage = createIndexedDBAdapter();

  function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    var i = 0;
    for (i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    var i = 0;
    for (i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function deriveVaultKey(passphrase, saltUint8, usage) {
    var enc = new TextEncoder();
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj || !cryptoObj.subtle) {
      throw new Error('Web Cryptography API is not supported in this environment');
    }
    var keyMaterial = await cryptoObj.subtle.importKey('raw', enc.encode(passphrase), { name: 'PBKDF2' }, false, [
      'deriveKey',
    ]);
    return cryptoObj.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltUint8,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      usage,
    );
  }

  async function encryptVaultData(plainText, passphrase) {
    if (!passphrase || typeof passphrase !== 'string' || passphrase.trim() === '') {
      throw new Error('Passphrase cannot be empty');
    }
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj || !cryptoObj.subtle) {
      throw new Error('Web Cryptography API is not supported');
    }
    var salt = cryptoObj.getRandomValues(new Uint8Array(16));
    var iv = cryptoObj.getRandomValues(new Uint8Array(12));
    var key = await deriveVaultKey(passphrase, salt, ['encrypt']);
    var enc = new TextEncoder();
    var cipherBuffer = await cryptoObj.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, enc.encode(plainText));

    return JSON.stringify(
      {
        format: 'money-superapp-vault-v1',
        createdAt: new Date().toISOString(),
        salt: arrayBufferToBase64(salt),
        iv: arrayBufferToBase64(iv),
        ciphertext: arrayBufferToBase64(cipherBuffer),
      },
      null,
      2,
    );
  }

  async function decryptVaultData(vaultPayloadOrString, passphrase) {
    if (!passphrase || typeof passphrase !== 'string') {
      throw new Error('Passphrase cannot be empty');
    }
    var envelope = vaultPayloadOrString;
    if (typeof vaultPayloadOrString === 'string') {
      envelope = JSON.parse(vaultPayloadOrString);
    }
    if (
      !envelope ||
      envelope.format !== 'money-superapp-vault-v1' ||
      !envelope.salt ||
      !envelope.iv ||
      !envelope.ciphertext
    ) {
      throw new Error('Invalid vault envelope format');
    }

    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj || !cryptoObj.subtle) {
      throw new Error('Web Cryptography API is not supported');
    }

    var salt = new Uint8Array(base64ToArrayBuffer(envelope.salt));
    var iv = new Uint8Array(base64ToArrayBuffer(envelope.iv));
    var cipherBuffer = base64ToArrayBuffer(envelope.ciphertext);

    var key = await deriveVaultKey(passphrase, salt, ['decrypt']);
    var decBuffer = await cryptoObj.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, cipherBuffer);

    var dec = new TextDecoder();
    return dec.decode(decBuffer);
  }

  // Auto-initialize document theme, shortcuts, and swipe navigation when running in browser
  initTheme();
  initShortcutForwarding();
  initTouchSwipeNavigation();

  var MoneyApp = {
    LANG: LANG,
    THEME: THEME,
    unit: unit,
    formatMoney: formatMoney,
    parseNum: parseNum,
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    formatBytes: formatBytes,
    initTheme: initTheme,
    initShortcutForwarding: initShortcutForwarding,
    safeJsonParse: safeJsonParse,
    createUndoManager: createUndoManager,
    detectSwipeGesture: detectSwipeGesture,
    initTouchSwipeNavigation: initTouchSwipeNavigation,
    partitionSnapshots: partitionSnapshots,
    createIndexedDBAdapter: createIndexedDBAdapter,
    idbStorage: idbStorage,
    encryptVaultData: encryptVaultData,
    decryptVaultData: decryptVaultData,
  };

  // Expose on global window object
  if (typeof global !== 'undefined') {
    global.MoneyApp = MoneyApp;
    // Backwards-compatible globals
    if (typeof global.LANG === 'undefined') global.LANG = LANG;
    if (typeof global.THEME === 'undefined') global.THEME = THEME;
    if (typeof global.unit === 'undefined') global.unit = unit;
    if (typeof global.formatMoney === 'undefined') global.formatMoney = formatMoney;
    if (typeof global.parseNum === 'undefined') global.parseNum = parseNum;
    if (typeof global.escapeHtml === 'undefined') global.escapeHtml = escapeHtml;
    if (typeof global.escapeAttr === 'undefined') global.escapeAttr = escapeAttr;
    if (typeof global.safeJsonParse === 'undefined') global.safeJsonParse = safeJsonParse;
    if (typeof global.createUndoManager === 'undefined') global.createUndoManager = createUndoManager;
    if (typeof global.detectSwipeGesture === 'undefined') global.detectSwipeGesture = detectSwipeGesture;
    if (typeof global.formatBytes === 'undefined') global.formatBytes = formatBytes;
    if (typeof global.partitionSnapshots === 'undefined') global.partitionSnapshots = partitionSnapshots;
    if (typeof global.idbStorage === 'undefined') global.idbStorage = idbStorage;
    if (typeof global.encryptVaultData === 'undefined') global.encryptVaultData = encryptVaultData;
    if (typeof global.decryptVaultData === 'undefined') global.decryptVaultData = decryptVaultData;
  }
})(typeof window !== 'undefined' ? window : this);
