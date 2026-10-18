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
      try {
        LANG = (typeof localStorage !== 'undefined' && localStorage.getItem('moneySuperapp.lang')) || 'th';
        THEME = (typeof localStorage !== 'undefined' && localStorage.getItem('moneySuperapp.theme')) || 'light';
        unit = LANG === 'en' ? 'THB' : 'บาท';
      } catch (_e) {}
      document.documentElement.lang = LANG;
      document.documentElement.dataset.theme = THEME;
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'THEME_CHANGE' && e.data.theme) {
        THEME = e.data.theme;
        try {
          if (typeof localStorage !== 'undefined') localStorage.setItem('moneySuperapp.theme', THEME);
        } catch (_e) {}
        if (document.documentElement) {
          document.documentElement.dataset.theme = THEME;
        }
      }
      if (e.data && e.data.type === 'LANG_CHANGE' && e.data.lang) {
        LANG = e.data.lang;
        unit = LANG === 'en' ? 'THB' : 'บาท';
        try {
          if (typeof localStorage !== 'undefined') localStorage.setItem('moneySuperapp.lang', LANG);
        } catch (_e) {}
        if (document.documentElement) {
          document.documentElement.lang = LANG;
        }
      }
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'moneySuperapp.theme' && e.newValue) {
        THEME = e.newValue;
        if (document.documentElement) {
          document.documentElement.dataset.theme = THEME;
        }
      }
      if (e.key === 'moneySuperapp.lang' && e.newValue) {
        LANG = e.newValue;
        unit = LANG === 'en' ? 'THB' : 'บาท';
        if (document.documentElement) {
          document.documentElement.lang = LANG;
        }
      }
    });
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
    if (!cryptoObj?.subtle) {
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
    if (!cryptoObj?.subtle) {
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
    if (envelope?.format !== 'money-superapp-vault-v1' || !envelope.salt || !envelope.iv || !envelope.ciphertext) {
      throw new Error('Invalid vault envelope format');
    }

    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    if (!cryptoObj?.subtle) {
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

  /**
   * Phase 70: Biometric & PIN App Lock Engine.
   * Provides salted SHA-256 PIN hashing, verification, and timeout formatting.
   */
  function generateSalt(byteLength) {
    var len = Number(byteLength) || 16;
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    var bytes;
    var hex = '';
    var i;
    if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
      bytes = cryptoObj.getRandomValues(new Uint8Array(len));
      for (i = 0; i < bytes.length; i++) {
        hex += `00${bytes[i].toString(16)}`.slice(-2);
      }
      return hex;
    }
    for (i = 0; i < len * 2; i++) {
      hex += Math.floor(Math.random() * 16).toString(16);
    }
    return hex;
  }

  async function hashPin(pin, salt) {
    if (!pin || typeof pin !== 'string') {
      throw new Error('PIN must be a non-empty string');
    }
    var saltStr = salt || '';
    var cryptoObj = typeof crypto !== 'undefined' ? crypto : typeof window !== 'undefined' ? window.crypto : null;
    var enc;
    var data;
    var hashBuffer;
    var hashArray;
    var hex;
    var h;
    var str;
    var i;
    if (cryptoObj?.subtle && typeof cryptoObj.subtle.digest === 'function') {
      enc = new TextEncoder();
      data = enc.encode(`${saltStr}:${pin}`);
      hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
      hashArray = Array.from(new Uint8Array(hashBuffer));
      hex = hashArray.map((b) => `00${b.toString(16)}`.slice(-2)).join('');
      return hex;
    }
    h = 0x811c9dc5;
    str = `${saltStr}:${pin}`;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return `00000000${(h >>> 0).toString(16)}`.slice(-8);
  }

  async function verifyPin(pin, salt, expectedHash) {
    if (!pin || !expectedHash) return false;
    var computed = await hashPin(pin, salt);
    return computed === expectedHash;
  }

  function formatAppLockTimeout(seconds, lang) {
    var sec = Number(seconds);
    var isEn = lang === 'en';
    if (sec === 0) return isEn ? 'Immediately when switching apps' : 'ล็อกทันทีเมื่อสลับหน้าต่าง';
    if (sec === 60) return isEn ? '1 minute' : '1 นาที';
    if (sec === 300) return isEn ? '5 minutes (Recommended)' : '5 นาที (แนะนำ)';
    if (sec === 900) return isEn ? '15 minutes' : '15 นาที';
    if (sec === -1) return isEn ? 'Never (Manual lock only)' : 'ไม่ล็อกอัตโนมัติ (ล็อกด้วยตนเองเท่านั้น)';
    return isEn ? `${sec} seconds` : `${sec} วินาที`;
  }

  // Batch 1 Engines (Modularized in js/engines/)
  var _ext = global?.MoneyApp || {};

  var TAX_DEADLINE_MILESTONES = _ext.TAX_DEADLINE_MILESTONES || [];
  var calculateThaiTaxDeadlines =
    _ext.calculateThaiTaxDeadlines ||
    ((refDate) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiTaxDeadlines === 'function' &&
        global.MoneyApp.calculateThaiTaxDeadlines !== calculateThaiTaxDeadlines
      ) {
        return global.MoneyApp.calculateThaiTaxDeadlines(refDate);
      }
    });

  var calculateInsuranceAdequacy =
    _ext.calculateInsuranceAdequacy ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateInsuranceAdequacy === 'function' &&
        global.MoneyApp.calculateInsuranceAdequacy !== calculateInsuranceAdequacy
      ) {
        return global.MoneyApp.calculateInsuranceAdequacy(params);
      }
    });

  var calculateThaiGoldMetrics =
    _ext.calculateThaiGoldMetrics ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiGoldMetrics === 'function' &&
        global.MoneyApp.calculateThaiGoldMetrics !== calculateThaiGoldMetrics
      ) {
        return global.MoneyApp.calculateThaiGoldMetrics(params);
      }
    });

  /**
   * Calculates Thai Inheritance Tax (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558)
   * and Annual Gift Tax (ประมวลรัษฎากร มาตรา 42(26)-(28) & 48(6)).
   */
  var calculateThaiInheritanceAndGiftTax =
    _ext.calculateThaiInheritanceAndGiftTax ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiInheritanceAndGiftTax === 'function' &&
        global.MoneyApp.calculateThaiInheritanceAndGiftTax !== calculateThaiInheritanceAndGiftTax
      ) {
        return global.MoneyApp.calculateThaiInheritanceAndGiftTax(params);
      }
    });

  /**
   * Calculates Retirement 3-Bucket Cash Flow Allocation and Drawdown Schedule
   */
  var calculateRetirementThreeBuckets =
    _ext.calculateRetirementThreeBuckets ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateRetirementThreeBuckets === 'function' &&
        global.MoneyApp.calculateRetirementThreeBuckets !== calculateRetirementThreeBuckets
      ) {
        return global.MoneyApp.calculateRetirementThreeBuckets(params);
      }
    });

  var THAI_PIT_TAX_BRACKETS = _ext.THAI_PIT_TAX_BRACKETS || [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  var THAI_PIT_TIERS = _ext.THAI_PIT_TIERS || [
    { min: 0, max: 150000, rate: 0 },
    { min: 150000, max: 300000, rate: 0.05 },
    { min: 300000, max: 500000, rate: 0.1 },
    { min: 500000, max: 750000, rate: 0.15 },
    { min: 750000, max: 1000000, rate: 0.2 },
    { min: 1000000, max: 2000000, rate: 0.25 },
    { min: 2000000, max: 5000000, rate: 0.3 },
    { min: 5000000, max: Infinity, rate: 0.35 },
  ];

  var computeThaiPitTax =
    _ext.computeThaiPitTax ||
    ((netIncome) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.computeThaiPitTax === 'function' &&
        global.MoneyApp.computeThaiPitTax !== computeThaiPitTax
      ) {
        return global.MoneyApp.computeThaiPitTax(netIncome);
      }
      var remaining = Math.max(0, parseNum(netIncome));
      var totalTax = 0;
      var i;
      var b;
      var taxable;
      for (i = 0; i < THAI_PIT_TAX_BRACKETS.length; i++) {
        if (remaining <= 0) break;
        b = THAI_PIT_TAX_BRACKETS[i];
        taxable = Math.min(remaining, b.limit);
        totalTax += taxable * b.rate;
        remaining -= taxable;
      }
      return Math.round(totalTax);
    });

  var calculateTaxBracketStepDown =
    _ext.calculateTaxBracketStepDown ||
    ((netTaxableIncome) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateTaxBracketStepDown === 'function' &&
        global.MoneyApp.calculateTaxBracketStepDown !== calculateTaxBracketStepDown
      ) {
        return global.MoneyApp.calculateTaxBracketStepDown(netTaxableIncome);
      }
    });

  var calculateThaiDividendTaxCredit =
    _ext.calculateThaiDividendTaxCredit ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiDividendTaxCredit === 'function' &&
        global.MoneyApp.calculateThaiDividendTaxCredit !== calculateThaiDividendTaxCredit
      ) {
        return global.MoneyApp.calculateThaiDividendTaxCredit(params);
      }
    });

  /**
   * Calculates Thai Land and Building Tax (ภาษีที่ดินและสิ่งปลูกสร้าง พ.ร.บ. 2562)
   */
  var calculateThaiLandAndBuildingTax =
    _ext.calculateThaiLandAndBuildingTax ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiLandAndBuildingTax === 'function' &&
        global.MoneyApp.calculateThaiLandAndBuildingTax !== calculateThaiLandAndBuildingTax
      ) {
        return global.MoneyApp.calculateThaiLandAndBuildingTax(params);
      }
    });

  /**
   * Auto-detects and parses Thai Mobile Banking CSV Statements (KBank, SCB, Krungthai, KKP, etc.)
   */
  var detectAndParseThaiBankStatement =
    _ext.detectAndParseThaiBankStatement ||
    ((csvText, fileName) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.detectAndParseThaiBankStatement === 'function' &&
        global.MoneyApp.detectAndParseThaiBankStatement !== detectAndParseThaiBankStatement
      ) {
        return global.MoneyApp.detectAndParseThaiBankStatement(csvText, fileName);
      }
    });

  var calculateForeignRepatriationTax =
    _ext.calculateForeignRepatriationTax ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateForeignRepatriationTax === 'function' &&
        global.MoneyApp.calculateForeignRepatriationTax !== calculateForeignRepatriationTax
      ) {
        return global.MoneyApp.calculateForeignRepatriationTax(params);
      }
    });

  /**
   * Target Date Fund (TDF) Glidepath Allocation Engine (Roadmap Phase 64)
   */
  var calculateTargetDateGlidepath =
    _ext.calculateTargetDateGlidepath ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateTargetDateGlidepath === 'function' &&
        global.MoneyApp.calculateTargetDateGlidepath !== calculateTargetDateGlidepath
      ) {
        return global.MoneyApp.calculateTargetDateGlidepath(params);
      }
    });

  function calculateReorderLayout(orderList, idToMove, direction) {
    if (!Array.isArray(orderList)) return [];
    const list = orderList.slice();
    const idx = list.indexOf(idToMove);
    if (idx === -1) return list;
    if (direction === 'up' && idx > 0) {
      const prev = list[idx - 1];
      list[idx - 1] = list[idx];
      list[idx] = prev;
    } else if (direction === 'down' && idx < list.length - 1) {
      const next = list[idx + 1];
      list[idx + 1] = list[idx];
      list[idx] = next;
    }
    return list;
  }

  function initCardLayoutManager(options) {
    if (typeof document === 'undefined' || !options || !options.storageKey) return null;
    const container =
      typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container || document.querySelector('.content') || document.body;
    if (!container) return null;

    const cardSelector = options.cardSelector || '.reorder-card, .card[id], .panel[id]';
    const storageKey = options.storageKey;
    const onReorder = typeof options.onReorder === 'function' ? options.onReorder : null;
    const onToggle = typeof options.onToggle === 'function' ? options.onToggle : null;

    function getStorageData() {
      let data = { order: [], collapsed: {} };
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            data = {
              order: Array.isArray(parsed.order) ? parsed.order : [],
              collapsed: parsed.collapsed && typeof parsed.collapsed === 'object' ? parsed.collapsed : {},
            };
          }
        }
      } catch (_e) {}
      if (Array.isArray(options.defaultCollapsed)) {
        options.defaultCollapsed.forEach((id) => {
          if (data.collapsed[id] === undefined) {
            data.collapsed[id] = true;
          }
        });
      }
      return data;
    }

    function saveStorageData(data) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (_e) {}
    }

    function getCardId(el) {
      return el.getAttribute('data-card-id') || el.id;
    }

    function getCards() {
      const all = Array.prototype.slice.call(container.querySelectorAll(cardSelector));
      return all.filter((el) => {
        return (el.id || el.getAttribute('data-card-id')) && el.parentNode === container;
      });
    }

    function getCardHeader(card) {
      return (
        card.querySelector('.card-header, .panel-header, .panel-title, [data-card-header]') || card.firstElementChild
      );
    }

    function getCardBodies(card) {
      const explicit = Array.prototype.slice.call(card.querySelectorAll('.card-body, .panel-body, [data-card-body]'));
      if (explicit.length > 0) return explicit;

      const cardId = getCardId(card);
      const namedBody =
        document.getElementById(`${cardId}Body`) ||
        document.getElementById(`${cardId.replace(/^panel/, '').toLowerCase()}PanelBody`) ||
        card.querySelector('[id$="Body"], [id$="PanelBody"]');
      if (namedBody && (namedBody.parentNode === card || namedBody.closest('.reorder-card') === card)) {
        return [namedBody];
      }

      const header = getCardHeader(card);
      const bodies = [];
      for (let i = 0; i < card.children.length; i++) {
        const child = card.children[i];
        if (child !== header && !child.classList.contains('card-reorder-controls')) {
          bodies.push(child);
        }
      }
      return bodies;
    }

    function updateControlStates() {
      const currentCards = getCards();
      const data = getStorageData();
      const order = [];

      currentCards.forEach((card, index) => {
        const id = getCardId(card);
        order.push(id);
        const upBtn = card.querySelector('.btn-card-up');
        const downBtn = card.querySelector('.btn-card-down');
        const toggleBtn = card.querySelector('.btn-card-toggle');
        if (upBtn) upBtn.disabled = index === 0;
        if (downBtn) downBtn.disabled = index === currentCards.length - 1;

        const isCollapsed = Boolean(data.collapsed[id]);
        if (toggleBtn) {
          toggleBtn.textContent = isCollapsed ? '▼' : '▲';
          toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
        }
        const bodies = getCardBodies(card);
        bodies.forEach((body) => {
          if (isCollapsed) {
            body.classList.add('card-collapsed-hidden');
          } else {
            body.classList.remove('card-collapsed-hidden');
          }
        });
      });

      updateToolbarButtonStates();
      return order;
    }

    function areAllCollapsed() {
      const currentCards = getCards();
      if (currentCards.length === 0) return false;
      const data = getStorageData();
      return currentCards.every((c) => Boolean(data.collapsed[getCardId(c)]));
    }

    function areAllExpanded() {
      const currentCards = getCards();
      if (currentCards.length === 0) return false;
      const data = getStorageData();
      return currentCards.every((c) => !data.collapsed[getCardId(c)]);
    }

    function collapseAll() {
      const currentCards = getCards();
      const data = getStorageData();
      currentCards.forEach((c) => {
        data.collapsed[getCardId(c)] = true;
      });
      saveStorageData(data);
      updateControlStates();
      if (onToggle) {
        currentCards.forEach((c) => {
          onToggle(getCardId(c), true);
        });
      }
    }

    function expandAll() {
      const currentCards = getCards();
      const data = getStorageData();
      currentCards.forEach((c) => {
        data.collapsed[getCardId(c)] = false;
      });
      saveStorageData(data);
      updateControlStates();
      if (onToggle) {
        currentCards.forEach((c) => {
          onToggle(getCardId(c), false);
        });
      }
    }

    function toggleAll() {
      if (areAllCollapsed()) {
        expandAll();
      } else {
        collapseAll();
      }
    }

    function resetLayout() {
      try {
        localStorage.removeItem(storageKey);
      } catch (_e) {}
      if (typeof window !== 'undefined') window.location.reload();
    }

    function getToolbarElement() {
      if (options.toolbarContainer) {
        return typeof options.toolbarContainer === 'string'
          ? document.querySelector(options.toolbarContainer)
          : options.toolbarContainer;
      }
      return (
        container.querySelector('#cardLayoutToolbar, .card-layout-toolbar') ||
        document.getElementById('cardLayoutToolbar') ||
        document.querySelector('.card-layout-toolbar')
      );
    }

    function updateToolbarButtonStates(tbEl) {
      const tb = tbEl || getToolbarElement();
      if (!tb) return;
      const foldBtn = tb.querySelector('.btn-fold-all');
      const expandBtn = tb.querySelector('.btn-expand-all');
      if (foldBtn) foldBtn.disabled = areAllCollapsed();
      if (expandBtn) expandBtn.disabled = areAllExpanded();
    }

    function renderToolbar() {
      const tb = getToolbarElement();
      if (!tb) return;

      tb.classList.add('card-layout-toolbar');
      tb.innerHTML = '';

      const isEn = typeof LANG !== 'undefined' && LANG === 'en';

      const foldBtn = document.createElement('button');
      foldBtn.type = 'button';
      foldBtn.className = 'btn-card-toolbar btn-fold-all';
      foldBtn.id = 'btnFoldAllCards';
      foldBtn.title = isEn ? 'Fold all cards' : 'พับการ์ดทั้งหมด';
      foldBtn.setAttribute('aria-label', foldBtn.title);
      foldBtn.innerHTML = `▼ <span>${isEn ? 'Fold All' : 'พับทั้งหมด'}</span>`;
      foldBtn.onclick = (e) => {
        e.preventDefault();
        collapseAll();
      };

      const expandBtn = document.createElement('button');
      expandBtn.type = 'button';
      expandBtn.className = 'btn-card-toolbar btn-expand-all';
      expandBtn.id = 'btnExpandAllCards';
      expandBtn.title = isEn ? 'Expand all cards' : 'ขยายการ์ดทั้งหมด';
      expandBtn.setAttribute('aria-label', expandBtn.title);
      expandBtn.innerHTML = `▲ <span>${isEn ? 'Expand All' : 'ขยายทั้งหมด'}</span>`;
      expandBtn.onclick = (e) => {
        e.preventDefault();
        expandAll();
      };

      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'btn-card-toolbar btn-reset-layout';
      resetBtn.id = 'btnResetCardsLayout';
      resetBtn.title = isEn ? 'Reset card order and state' : 'รีเซ็ตลำดับการ์ดและสถานะ';
      resetBtn.setAttribute('aria-label', resetBtn.title);
      resetBtn.innerHTML = `↺ <span>${isEn ? 'Reset' : 'รีเซ็ตลำดับ'}</span>`;
      resetBtn.onclick = (e) => {
        e.preventDefault();
        resetLayout();
      };

      tb.appendChild(foldBtn);
      tb.appendChild(expandBtn);
      tb.appendChild(resetBtn);
      updateToolbarButtonStates(tb);
    }

    function moveCard(cardEl, direction) {
      const currentCards = getCards();
      const idx = currentCards.indexOf(cardEl);
      if (idx === -1) return;

      if (direction === 'up' && idx > 0) {
        const prevCard = currentCards[idx - 1];
        container.insertBefore(cardEl, prevCard);
      } else if (direction === 'down' && idx < currentCards.length - 1) {
        const nextCard = currentCards[idx + 1];
        container.insertBefore(cardEl, nextCard.nextSibling);
      }

      const newOrder = updateControlStates();
      const data = getStorageData();
      data.order = newOrder;
      saveStorageData(data);
      if (onReorder) onReorder(newOrder);
    }

    function toggleCard(cardEl) {
      const id = getCardId(cardEl);
      const data = getStorageData();
      const isNowCollapsed = !data.collapsed[id];
      data.collapsed[id] = isNowCollapsed;
      saveStorageData(data);
      updateControlStates();
      if (onToggle) onToggle(id, isNowCollapsed);
    }

    // Apply saved order on initialization
    const initialData = getStorageData();
    const initialCards = getCards();
    if (initialData.order && initialData.order.length > 0) {
      const cardMap = {};
      initialCards.forEach((c) => {
        cardMap[getCardId(c)] = c;
      });
      initialData.order.forEach((id) => {
        if (cardMap[id]) {
          container.appendChild(cardMap[id]);
        }
      });
      initialCards.forEach((c) => {
        if (initialData.order.indexOf(getCardId(c)) === -1) {
          container.appendChild(c);
        }
      });
    } else if (Array.isArray(options.defaultOrder) && options.defaultOrder.length > 0) {
      const cardMap = {};
      initialCards.forEach((c) => {
        cardMap[getCardId(c)] = c;
      });
      options.defaultOrder.forEach((id) => {
        if (cardMap[id]) {
          container.appendChild(cardMap[id]);
        }
      });
      initialCards.forEach((c) => {
        if (options.defaultOrder.indexOf(getCardId(c)) === -1) {
          container.appendChild(c);
        }
      });
    }

    // Attach control clusters
    const currentCards = getCards();
    currentCards.forEach((card) => {
      card.classList.add('reorder-card');
      const cluster = card.querySelector('.card-reorder-controls');
      if (!cluster) {
        const newCluster = document.createElement('div');
        newCluster.className = 'card-reorder-controls';
        newCluster.setAttribute('role', 'group');
        newCluster.setAttribute('aria-label', 'Card order and toggle actions');

        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'btn-card-ctrl btn-card-up';
        upBtn.title = LANG === 'en' ? 'Move Up' : 'เลื่อนขึ้น';
        upBtn.setAttribute('aria-label', upBtn.title);
        upBtn.textContent = '↑';
        upBtn.onclick = (e) => {
          e.stopPropagation();
          moveCard(card, 'up');
        };

        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'btn-card-ctrl btn-card-down';
        downBtn.title = LANG === 'en' ? 'Move Down' : 'เลื่อนลง';
        downBtn.setAttribute('aria-label', downBtn.title);
        downBtn.textContent = '↓';
        downBtn.onclick = (e) => {
          e.stopPropagation();
          moveCard(card, 'down');
        };

        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'btn-card-ctrl btn-card-toggle';
        toggleBtn.title = LANG === 'en' ? 'Fold / Expand' : 'ย่อ / ขยาย';
        toggleBtn.setAttribute('aria-label', toggleBtn.title);
        toggleBtn.textContent = '▲';
        toggleBtn.onclick = (e) => {
          e.stopPropagation();
          toggleCard(card);
        };

        newCluster.appendChild(upBtn);
        newCluster.appendChild(downBtn);
        newCluster.appendChild(toggleBtn);

        const header = getCardHeader(card);
        if (header) {
          if (typeof window !== 'undefined' && window.getComputedStyle) {
            const disp = window.getComputedStyle(header).display;
            if (disp.indexOf('flex') === -1) {
              header.style.display = 'flex';
              header.style.justifyContent = 'space-between';
              header.style.alignItems = 'center';
            }
          }
          header.appendChild(newCluster);
        } else {
          card.insertBefore(newCluster, card.firstChild);
        }
      } else {
        const upBtn2 = cluster.querySelector('.btn-card-up');
        const downBtn2 = cluster.querySelector('.btn-card-down');
        const toggleBtn2 = cluster.querySelector('.btn-card-toggle');
        if (upBtn2) {
          upBtn2.onclick = (e) => {
            e.stopPropagation();
            moveCard(card, 'up');
          };
        }
        if (downBtn2) {
          downBtn2.onclick = (e) => {
            e.stopPropagation();
            moveCard(card, 'down');
          };
        }
        if (toggleBtn2) {
          toggleBtn2.onclick = (e) => {
            e.stopPropagation();
            toggleCard(card);
          };
        }
      }
    });

    updateControlStates();
    renderToolbar();

    return {
      getOrder: () => getCards().map(getCardId),
      moveCard: (id, direction) => {
        const card = getCards().find((c) => getCardId(c) === id);
        if (card) moveCard(card, direction);
      },
      toggleCard: (id) => {
        const card = getCards().find((c) => getCardId(c) === id);
        if (card) toggleCard(card);
      },
      collapseAll: collapseAll,
      expandAll: expandAll,
      toggleAll: toggleAll,
      areAllCollapsed: areAllCollapsed,
      areAllExpanded: areAllExpanded,
      resetLayout: resetLayout,
      reset: resetLayout,
      updateToolbar: renderToolbar,
    };
  }

  /**
   * Phase 65: Synthesizes high-level cross-domain financial metrics into an
   * Executive Dossier data structure across Net Worth, Runway, Investments,
   * Debts, Insurance, and Taxes.
   */
  function generateExecutiveDossier(params) {
    var p = params || {};
    var dash = p.dashboardState || {};
    var port = p.portfolioState || {};
    var debt = p.debtState || {};
    var tax = p.taxBaseState || {};
    var slips = p.slipsState || {};
    var rem = p.remainingState || {};
    var ins = p.insuranceState || {};
    var ret3b = p.retire3bState || {};
    var glide = p.glidepathState || {};
    var isMasked = Boolean(p.isMasked);

    // 1. Executive Summary & Net Worth
    var netWorth = typeof dash.netWorth === 'number' ? dash.netWorth : (dash.assets || 0) - (dash.debts || 0);
    var grossAssets = typeof dash.assets === 'number' ? dash.assets : netWorth + (dash.debts || 0);
    var totalDebts = typeof dash.debts === 'number' ? dash.debts : debt.totalDebt || 0;
    if (grossAssets < netWorth + totalDebts) {
      grossAssets = Math.max(0, netWorth + totalDebts);
    }
    var solvencyRatioPct =
      grossAssets > 0
        ? Math.min(100, Math.max(0, Math.round((netWorth / grossAssets) * 1000) / 10))
        : totalDebts === 0
          ? 100
          : 0;

    var monthlyIncome = rem.monthlyIncome || slips.monthlySalary || 0;
    var monthlyExpense = rem.monthlyExpense || dash.monthlyExpenses || 0;
    var monthlySavings = rem.monthlySavings || dash.monthlySavings || Math.max(0, monthlyIncome - monthlyExpense);
    var emergencyFunds = dash.emergencyFund || rem.emergencyFund || 0;
    var runwayMonths =
      typeof dash.runway === 'number'
        ? dash.runway
        : monthlyExpense > 0
          ? Math.round((emergencyFunds / monthlyExpense) * 10) / 10
          : 0;
    var healthScore = typeof dash.financialHealthScore === 'number' ? dash.financialHealthScore : 75;

    // 2. Pillars
    var runwayStatus = runwayMonths >= 6 ? 'healthy' : runwayMonths >= 3 ? 'caution' : 'critical';

    var portfolioValue = port.totalValue || dash.investments || 0;
    var monthlyDca = port.monthlyBudget || 0;
    var glidepathEquityPct = typeof glide.equityPct === 'number' ? glide.equityPct : 0;

    var debtPayoffMonths =
      debt.monthsToFreedom ||
      (debt.totalDebt > 0 && debt.monthlyPayment > 0 ? Math.ceil(debt.totalDebt / debt.monthlyPayment) : 0);
    var debtStrategy = debt.strategy || 'avalanche';
    var isDebtFree = totalDebts <= 0;

    var insNeed = ins.totalNeed || 0;
    var insCoverage = ins.existingCoverage || 0;
    var insGap = typeof ins.protectionGap === 'number' ? ins.protectionGap : Math.max(0, insNeed - insCoverage);
    var insAdequacyPct = insNeed > 0 ? Math.round((insCoverage / insNeed) * 100) : insCoverage > 0 ? 100 : 0;

    var assessableIncome = tax.totalIncome || slips.annualTotalIncome || 0;
    var taxDeductions = tax.totalDeductions || slips.annualDeductions || 0;
    var projectedTax = tax.netTax || slips.annualProjectedTax || 0;
    var taxWithheld = tax.withholding50Tawi || slips.annualTaxWithheld || 0;
    var taxBalance = taxWithheld - projectedTax; // > 0: refund, < 0: payable

    var b1 = ret3b.bucket1 || 0;
    var b2 = ret3b.bucket2 || 0;
    var b3 = ret3b.bucket3 || 0;
    var ssoPension = ret3b.ssoPension || 0;

    return {
      timestamp: Date.now(),
      isMasked: isMasked,
      summary: {
        netWorth: netWorth,
        grossAssets: grossAssets,
        totalDebts: totalDebts,
        solvencyRatioPct: solvencyRatioPct,
        monthlyIncome: monthlyIncome,
        monthlyExpense: monthlyExpense,
        monthlySavings: monthlySavings,
        runwayMonths: runwayMonths,
        healthScore: healthScore,
      },
      pillars: {
        runway: {
          emergencyFunds: emergencyFunds,
          monthlyExpenses: monthlyExpense,
          runwayMonths: runwayMonths,
          status: runwayStatus,
        },
        investments: {
          portfolioValue: portfolioValue,
          monthlyDca: monthlyDca,
          glidepathEquityPct: glidepathEquityPct,
        },
        debts: {
          totalDebt: totalDebts,
          monthsToFreedom: debtPayoffMonths,
          strategy: debtStrategy,
          isDebtFree: isDebtFree,
        },
        insurance: {
          totalNeed: insNeed,
          existingCoverage: insCoverage,
          protectionGap: insGap,
          adequacyPct: insAdequacyPct,
        },
        tax: {
          assessableIncome: assessableIncome,
          deductions: taxDeductions,
          projectedTax: projectedTax,
          withheld50Tawi: taxWithheld,
          refundOrPayable: taxBalance,
        },
        retirement: {
          bucket1Cash: b1,
          bucket2FixedIncome: b2,
          bucket3Equities: b3,
          monthlySsoPension: ssoPension,
        },
      },
    };
  }

  function formatMaskedAmount(amount, isMasked, currency) {
    if (isMasked) {
      return `${currency ? `${currency} ` : '฿ '}••••••`;
    }
    return formatMoney(amount) + (currency ? ` ${currency}` : '');
  }

  /**
   * Phase 80: Formats Executive Dossier into clean, shareable plain text summary
   *
   * @param {Object} dossier - Object returned by generateExecutiveDossier
   * @param {Object} [options]
   * @param {boolean} [options.isMasked=false]
   * @param {string} [options.lang='th']
   * @returns {string} Plain text formatted summary
   */
  function formatExecutiveDossierSummaryText(dossier, options) {
    if (!dossier) return '';
    options = options || {};
    var isMasked = options.isMasked !== undefined ? Boolean(options.isMasked) : Boolean(dossier.isMasked);
    var isEn = options.lang === 'en';

    var s = dossier.summary || {};
    var p = dossier.pillars || {};
    var runway = p.runway || {};
    var inv = p.investments || {};
    var debt = p.debts || {};
    var ins = p.insurance || {};
    var tax = p.tax || {};

    var fmt = (val) => {
      if (isMasked) {
        return isEn ? 'THB ••••••' : '฿ ••••••';
      }
      return formatMaskedAmount(val, false, isEn ? 'THB' : 'บาท');
    };

    var dateStr = new Date(dossier.timestamp || Date.now()).toLocaleDateString(isEn ? 'en-US' : 'th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    var debtStatusStr = debt.isDebtFree
      ? isEn
        ? 'Debt-Free 🎉'
        : 'ปลอดหนี้แล้ว 🎉'
      : isEn
        ? `Payoff in ${debt.monthsToFreedom} months`
        : `ปลอดหนี้ใน ${debt.monthsToFreedom} เดือน`;

    var taxStatusStr =
      (tax.refundOrPayable || 0) >= 0
        ? (isEn ? 'Refund: ' : 'ขอคืน: ') + fmt(tax.refundOrPayable || 0)
        : (isEn ? 'Payable: ' : 'จ่ายเพิ่ม: ') + fmt(Math.abs(tax.refundOrPayable || 0));

    var insStatusStr =
      ins.adequacyPct >= 100
        ? isEn
          ? 'Adequate (100%)'
          : 'เพียงพอ (100%)'
        : (isEn ? 'Shortfall: ' : 'ยังขาด: ') + fmt(ins.protectionGap || 0);

    var lines = [
      isEn ? '📋 Money Superapp — Executive Financial Dossier' : '📋 Money Superapp — แฟ้มสรุปการเงินฉบับผู้บริหาร',
      (isEn ? '📅 Date: ' : '📅 วันที่สรุป: ') + dateStr,
      '',
      isEn ? '💰 1. Net Worth & Liabilities' : '💰 1. ความมั่งคั่งสุทธิ & หนี้สิน',
      `   • ${isEn ? 'Net Worth: ' : 'ความมั่งคั่งสุทธิ: '}${fmt(s.netWorth || 0)}`,
      `   • ${isEn ? 'Gross Assets: ' : 'สินทรัพย์รวม: '}${fmt(s.grossAssets || 0)}`,
      `   • ${isEn ? 'Total Debts: ' : 'หนี้สินรวม: '}${fmt(s.totalDebts || 0)}`,
      `   • ${isEn ? 'Solvency: ' : 'ความมั่นคง: '}${s.solvencyRatioPct || 0}%`,
      '',
      isEn ? '🛡️ 2. Emergency Runway & Savings' : '🛡️ 2. สายป่านฉุกเฉิน & การออม',
      '   • ' +
        (isEn ? 'Runway Reserve: ' : 'เงินสำรองฉุกเฉิน: ') +
        fmt(runway.emergencyFunds || 0) +
        ' (' +
        (runway.runwayMonths || 0) +
        (isEn ? ' mos)' : ' เดือน)'),
      `   • ${isEn ? 'Monthly Savings: ' : 'เงินออม/เดือน: '}${fmt(s.monthlySavings || 0)}`,
      '',
      isEn ? '📈 3. Investment & Portfolio' : '📈 3. พอร์ตลงทุน & DCA',
      `   • ${isEn ? 'Portfolio Value: ' : 'มูลค่าพอร์ต: '}${fmt(inv.portfolioValue || 0)}`,
      `   • ${isEn ? 'Monthly DCA: ' : 'DCA/เดือน: '}${fmt(inv.monthlyDca || 0)}`,
      '',
      isEn ? '🚀 4. Debt Elimination' : '🚀 4. แผนปลดหนี้สิน',
      `   • ${isEn ? 'Strategy: ' : 'กลยุทธ์: '}${(debt.strategy || 'avalanche').toUpperCase()}`,
      `   • ${isEn ? 'Status: ' : 'สถานะ: '}${debtStatusStr}`,
      '',
      isEn ? '🛡️ 5. Life Insurance Protection' : '🛡️ 5. ความคุ้มครองประกันชีวิต',
      `   • ${isEn ? 'Current Coverage: ' : 'ทุนประกันปัจจุบัน: '}${fmt(ins.existingCoverage || 0)}`,
      `   • ${isEn ? 'Status: ' : 'สถานะ: '}${insStatusStr}`,
      '',
      isEn ? '🧾 6. Tax Forecast & Withholding' : '🧾 6. ภาษีเงินได้ & ขอคืน 50 ทวิ',
      `   • ${isEn ? 'Annual Tax: ' : 'ภาษีทั้งปี: '}${fmt(tax.projectedTax || 0)}`,
      `   • ${isEn ? 'Tax Balance: ' : 'ยอดสุทธิ: '}${taxStatusStr}`,
      '',
      isEn
        ? '🔒 100% Client-Side Private • Generated by Money Superapp'
        : '🔒 ความเป็นส่วนตัวสมบูรณ์ ข้อมูลไม่ส่งออกนอกเครื่อง • สร้างโดย Money Superapp',
    ];

    return lines.join('\n');
  }

  /**
   * Phase 80: Validates and categorizes incoming Web Share Target payloads
   *
   * @param {Object} payload - { name: string, content: string, type?: string }
   * @returns {Object} { isValid: boolean, kind: 'vault' | 'backup' | 'statement' | 'text' | 'unknown', reason?: string }
   */
  function validateShareTargetPayload(payload) {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, kind: 'unknown', reason: 'Missing payload object' };
    }
    if (typeof payload.content !== 'string' || !payload.content.trim()) {
      return { isValid: false, kind: 'unknown', reason: 'Payload content is empty' };
    }

    var fileName = (payload.name || '').toLowerCase();
    var content = payload.content.trim();
    var bankRes;
    var parsed;

    // 1. Vault check
    if (fileName.endsWith('.vault')) {
      return { isValid: true, kind: 'vault' };
    }
    try {
      parsed = JSON.parse(content);
      if (parsed && parsed.format === 'money-superapp-vault-v1') {
        return { isValid: true, kind: 'vault' };
      }
      if (parsed && (parsed.appName === 'Money Superapp' || parsed.data)) {
        return { isValid: true, kind: 'backup' };
      }
    } catch (_ignore) {}

    // 2. Bank statement check (CSV or bank-like content)
    if (fileName.endsWith('.csv') || fileName.endsWith('.txt')) {
      bankRes = detectAndParseThaiBankStatement(content, fileName);
      if (bankRes?.isBankStatement) {
        return { isValid: true, kind: 'statement', bankCode: bankRes.bankCode, bankName: bankRes.bankName };
      }
      if (content.includes(',') || content.includes('\t') || content.includes('\n')) {
        return { isValid: true, kind: 'statement', bankCode: 'generic_csv', bankName: 'CSV Statement' };
      }
    }

    // 3. Fallback text
    return { isValid: true, kind: 'text' };
  }

  /**
   * Phase 81: Estimates affordable Term Life Insurance premium to bridge protection shortfall
   *
   * @param {number} coverageGap - Protection shortfall amount in THB
   * @param {Object} [options]
   * @param {number} [options.ratePerMillion=3000] - Benchmark pure term annual premium per 1M THB (default: 3,000 THB)
   * @param {number} [options.marginalTaxRate=0] - Marginal tax bracket (%) for Section 47 tax deduction savings
   * @returns {Object} Structured premium estimate
   */
  var calculateTermLifePremiumEstimate =
    _ext.calculateTermLifePremiumEstimate ||
    ((coverageGap, options) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateTermLifePremiumEstimate === 'function' &&
        global.MoneyApp.calculateTermLifePremiumEstimate !== calculateTermLifePremiumEstimate
      ) {
        return global.MoneyApp.calculateTermLifePremiumEstimate(coverageGap, options);
      }
    });

  var calculateRetirementCeilingPool =
    _ext.calculateRetirementCeilingPool ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateRetirementCeilingPool === 'function' &&
        global.MoneyApp.calculateRetirementCeilingPool !== calculateRetirementCeilingPool
      ) {
        return global.MoneyApp.calculateRetirementCeilingPool(params);
      }
    });

  var evaluateEFilingPreFlightChecklist =
    _ext.evaluateEFilingPreFlightChecklist ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.evaluateEFilingPreFlightChecklist === 'function' &&
        global.MoneyApp.evaluateEFilingPreFlightChecklist !== evaluateEFilingPreFlightChecklist
      ) {
        return global.MoneyApp.evaluateEFilingPreFlightChecklist(params);
      }
    });

  var calculateThaiEFilingWorksheet =
    _ext.calculateThaiEFilingWorksheet ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateThaiEFilingWorksheet === 'function' &&
        global.MoneyApp.calculateThaiEFilingWorksheet !== calculateThaiEFilingWorksheet
      ) {
        return global.MoneyApp.calculateThaiEFilingWorksheet(params);
      }
    });

  /**
   * Phase 75: Client-side Debt Payoff Simulation Engine.
   */
  var simulateDebtPayoff =
    _ext.simulateDebtPayoff ||
    ((debtsList, extraMonthly, strategy, windfall) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.simulateDebtPayoff === 'function' &&
        global.MoneyApp.simulateDebtPayoff !== simulateDebtPayoff
      ) {
        return global.MoneyApp.simulateDebtPayoff(debtsList, extraMonthly, strategy, windfall);
      }
    });

  var compareDebtVelocity =
    _ext.compareDebtVelocity ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.compareDebtVelocity === 'function' &&
        global.MoneyApp.compareDebtVelocity !== compareDebtVelocity
      ) {
        return global.MoneyApp.compareDebtVelocity(params);
      }
    });

  var calculateTaxAccrualAndRefundPlan =
    _ext.calculateTaxAccrualAndRefundPlan ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateTaxAccrualAndRefundPlan === 'function' &&
        global.MoneyApp.calculateTaxAccrualAndRefundPlan !== calculateTaxAccrualAndRefundPlan
      ) {
        return global.MoneyApp.calculateTaxAccrualAndRefundPlan(params);
      }
    });

  var calculateDebtConsolidation =
    _ext.calculateDebtConsolidation ||
    ((options) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateDebtConsolidation === 'function' &&
        global.MoneyApp.calculateDebtConsolidation !== calculateDebtConsolidation
      ) {
        return global.MoneyApp.calculateDebtConsolidation(options);
      }
    });

  /**
   * Phase 67: Emergency Fund & Income Shock Stress-Tester.
   */
  var calculateIncomeShockStressTest =
    _ext.calculateIncomeShockStressTest ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateIncomeShockStressTest === 'function' &&
        global.MoneyApp.calculateIncomeShockStressTest !== calculateIncomeShockStressTest
      ) {
        return global.MoneyApp.calculateIncomeShockStressTest(params);
      }
    });

  /**
   * Phase 68: Child Education & Higher Learning Sinking Fund Planner.
   */
  var calculateChildEducationFund =
    _ext.calculateChildEducationFund ||
    ((params) => {
      if (
        global.MoneyApp &&
        typeof global.MoneyApp.calculateChildEducationFund === 'function' &&
        global.MoneyApp.calculateChildEducationFund !== calculateChildEducationFund
      ) {
        return global.MoneyApp.calculateChildEducationFund(params);
      }
    });

  /**
   * Phase 69: Encrypted Offline QR Code P2P Device Sync Engine.
   * Pure client-side zero-dependency QR code matrix generator (Kazuhiko Arase Model)
   * and chunked payload transmission for air-gapped device-to-device transfers.
   */
  var QRMode = { MODE_NUMBER: 1, MODE_ALPHA_NUM: 2, MODE_8BIT_BYTE: 4, MODE_KANJI: 8 };
  var QRErrorCorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
  var QRMaskPattern = {
    PATTERN000: 0,
    PATTERN001: 1,
    PATTERN010: 2,
    PATTERN011: 3,
    PATTERN100: 4,
    PATTERN101: 5,
    PATTERN110: 6,
    PATTERN111: 7,
  };

  var QRMath = {
    glog: (n) => {
      if (n < 1) throw new Error(`glog(${n})`);
      return QRMath.LOG_TABLE[n];
    },
    gexp: (n) => {
      var val = n;
      while (val < 0) val += 255;
      while (val >= 256) val -= 255;
      return QRMath.EXP_TABLE[val];
    },
    EXP_TABLE: new Array(256),
    LOG_TABLE: new Array(256),
  };

  var qrMathInitIdx = 0;
  for (qrMathInitIdx = 0; qrMathInitIdx < 8; qrMathInitIdx++) {
    QRMath.EXP_TABLE[qrMathInitIdx] = 1 << qrMathInitIdx;
  }
  for (qrMathInitIdx = 8; qrMathInitIdx < 256; qrMathInitIdx++) {
    QRMath.EXP_TABLE[qrMathInitIdx] =
      QRMath.EXP_TABLE[qrMathInitIdx - 4] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 5] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 6] ^
      QRMath.EXP_TABLE[qrMathInitIdx - 8];
  }
  for (qrMathInitIdx = 0; qrMathInitIdx < 255; qrMathInitIdx++) {
    QRMath.LOG_TABLE[QRMath.EXP_TABLE[qrMathInitIdx]] = qrMathInitIdx;
  }

  function QRPolynomial(num, shift) {
    var offset = 0;
    var i = 0;
    if (num.length === undefined) throw new Error(`${num.length}/${shift}`);
    while (offset < num.length && num[offset] === 0) offset++;
    this.num = new Array(num.length - offset + shift);
    for (i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
  }

  QRPolynomial.prototype = {
    get: function (index) {
      return this.num[index];
    },
    getLength: function () {
      return this.num.length;
    },
    multiply: function (e) {
      var num = new Array(this.getLength() + e.getLength() - 1);
      var i = 0;
      var j = 0;
      for (i = 0; i < this.getLength(); i++) {
        for (j = 0; j < e.getLength(); j++) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
        }
      }
      return new QRPolynomial(num, 0);
    },
    mod: function (e) {
      var ratio = 0;
      var num = null;
      var i = 0;
      if (this.getLength() - e.getLength() < 0) return this;
      ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0));
      num = new Array(this.getLength());
      for (i = 0; i < this.getLength(); i++) num[i] = this.get(i);
      for (i = 0; i < e.getLength(); i++) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
      }
      return new QRPolynomial(num, 0).mod(e);
    },
  };

  function QRRSBlock(totalCount, dataCount) {
    this.totalCount = totalCount;
    this.dataCount = dataCount;
  }

  QRRSBlock.RS_BLOCK_TABLE = [
    [1, 26, 19],
    [1, 26, 16],
    [1, 26, 13],
    [1, 26, 9],
    [1, 44, 34],
    [1, 44, 28],
    [1, 44, 22],
    [1, 44, 16],
    [1, 70, 55],
    [1, 70, 44],
    [2, 35, 17],
    [2, 35, 13],
    [1, 100, 80],
    [2, 50, 32],
    [2, 50, 24],
    [4, 25, 9],
    [1, 134, 108],
    [2, 67, 43],
    [2, 33, 15, 2, 34, 16],
    [2, 33, 11, 2, 34, 12],
    [2, 86, 68],
    [4, 43, 27],
    [4, 43, 19],
    [4, 43, 15],
    [2, 98, 78],
    [4, 49, 31],
    [2, 32, 14, 4, 33, 15],
    [4, 39, 13, 1, 40, 14],
    [2, 121, 97],
    [2, 60, 38, 2, 61, 39],
    [4, 40, 18, 2, 41, 19],
    [4, 40, 14, 2, 41, 15],
    [2, 146, 116],
    [3, 58, 36, 2, 59, 37],
    [4, 36, 16, 4, 37, 17],
    [4, 36, 12, 4, 37, 13],
    [2, 86, 68, 2, 87, 69],
    [4, 69, 43, 1, 70, 44],
    [6, 43, 19, 2, 44, 20],
    [6, 43, 15, 2, 44, 16],
  ];

  QRRSBlock.getRSBlocks = (typeNumber, errorCorrectLevel) => {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    var length = 0;
    var list = [];
    var i = 0;
    var j = 0;
    var count = 0;
    var totalCount = 0;
    var dataCount = 0;
    if (rsBlock === undefined) {
      throw new Error(`bad rs block @ typeNumber:${typeNumber}/errorCorrectLevel:${errorCorrectLevel}`);
    }
    length = rsBlock.length / 3;
    for (i = 0; i < length; i++) {
      count = rsBlock[i * 3 + 0];
      totalCount = rsBlock[i * 3 + 1];
      dataCount = rsBlock[i * 3 + 2];
      for (j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
    }
    return list;
  };

  QRRSBlock.getRsBlockTable = (typeNumber, errorCorrectLevel) => {
    switch (errorCorrectLevel) {
      case QRErrorCorrectLevel.L:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectLevel.M:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectLevel.Q:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectLevel.H:
        return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default:
        return undefined;
    }
  };

  function QRBitBuffer() {
    this.buffer = [];
    this.length = 0;
  }

  QRBitBuffer.prototype = {
    get: function (index) {
      var bufIndex = Math.floor(index / 8);
      return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1;
    },
    put: function (num, length) {
      var i = 0;
      for (i = 0; i < length; i++) {
        this.putBit(((num >>> (length - i - 1)) & 1) === 1);
      }
    },
    putBit: function (bit) {
      var bufIndex = Math.floor(this.length / 8);
      if (this.buffer.length <= bufIndex) this.buffer.push(0);
      if (bit) this.buffer[bufIndex] |= 0x80 >>> (this.length % 8);
      this.length++;
    },
  };

  function QR8bitByte(data) {
    this.mode = QRMode.MODE_8BIT_BYTE;
    this.data = data;
  }

  QR8bitByte.prototype = {
    getLength: function () {
      return this.data.length;
    },
    write: function (buffer) {
      var i = 0;
      for (i = 0; i < this.data.length; i++) buffer.put(this.data.charCodeAt(i), 8);
    },
  };

  var QRUtil = {
    PATTERN_POSITION_TABLE: [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
    ],
    G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
    G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
    getBCHTypeInfo: (data) => {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15));
      }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHDigit: (data) => {
      var digit = 0;
      var d = data;
      while (d !== 0) {
        digit++;
        d >>>= 1;
      }
      return digit;
    },
    getPatternPosition: (typeNumber) => QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [],
    getMask: (maskPattern, i, j) => {
      switch (maskPattern) {
        case QRMaskPattern.PATTERN000:
          return (i + j) % 2 === 0;
        case QRMaskPattern.PATTERN001:
          return i % 2 === 0;
        case QRMaskPattern.PATTERN010:
          return j % 3 === 0;
        case QRMaskPattern.PATTERN011:
          return (i + j) % 3 === 0;
        case QRMaskPattern.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case QRMaskPattern.PATTERN101:
          return ((i * j) % 2) + ((i * j) % 3) === 0;
        case QRMaskPattern.PATTERN110:
          return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0;
        case QRMaskPattern.PATTERN111:
          return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0;
        default:
          throw new Error(`bad maskPattern:${maskPattern}`);
      }
    },
    getErrorCorrectPolynomial: (errorCorrectLength) => {
      var a = new QRPolynomial([1], 0);
      var i = 0;
      for (i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: (mode, type) => {
      if (1 <= type && type < 10) {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 10;
          case QRMode.MODE_ALPHA_NUM:
            return 9;
          case QRMode.MODE_8BIT_BYTE:
            return 8;
          case QRMode.MODE_KANJI:
            return 8;
          default:
            throw new Error(`mode:${mode}`);
        }
      } else {
        switch (mode) {
          case QRMode.MODE_NUMBER:
            return 14;
          case QRMode.MODE_ALPHA_NUM:
            return 11;
          case QRMode.MODE_8BIT_BYTE:
            return 16;
          case QRMode.MODE_KANJI:
            return 12;
          default:
            throw new Error(`mode:${mode}`);
        }
      }
    },
  };

  function QRCodeModel(typeNumber, errorCorrectLevel) {
    this.typeNumber = typeNumber;
    this.errorCorrectLevel = errorCorrectLevel;
    this.modules = null;
    this.moduleCount = 0;
    this.dataCache = null;
    this.dataList = [];
  }

  QRCodeModel.prototype = {
    addData: function (data) {
      var byteData = new QR8bitByte(data);
      this.dataList.push(byteData);
      this.dataCache = null;
    },
    isDark: function (row, col) {
      if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
        throw new Error(`${row},${col}`);
      }
      return this.modules[row][col];
    },
    getModuleCount: function () {
      return this.moduleCount;
    },
    make: function () {
      this.makeImpl(false, 0);
    },
    makeImpl: function (test, maskPattern) {
      var row = 0;
      var col = 0;
      this.moduleCount = this.typeNumber * 4 + 17;
      this.modules = new Array(this.moduleCount);
      for (row = 0; row < this.moduleCount; row++) {
        this.modules[row] = new Array(this.moduleCount);
        for (col = 0; col < this.moduleCount; col++) {
          this.modules[row][col] = null;
        }
      }
      this.setupPositionProbePattern(0, 0);
      this.setupPositionProbePattern(this.moduleCount - 7, 0);
      this.setupPositionProbePattern(0, this.moduleCount - 7);
      this.setupPositionAdjustPattern();
      this.setupTimingPattern();
      this.setupTypeInfo(test, maskPattern);
      if (this.dataCache == null) {
        this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList);
      }
      this.mapData(this.dataCache, maskPattern);
    },
    setupPositionProbePattern: function (row, col) {
      var r = 0;
      var c = 0;
      for (r = -1; r <= 7; r++) {
        if (row + r <= -1 || this.moduleCount <= row + r) continue;
        for (c = -1; c <= 7; c++) {
          if (col + c <= -1 || this.moduleCount <= col + c) continue;
          if (
            (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
            (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
            (2 <= r && r <= 4 && 2 <= c && c <= 4)
          ) {
            this.modules[row + r][col + c] = true;
          } else {
            this.modules[row + r][col + c] = false;
          }
        }
      }
    },
    setupTimingPattern: function () {
      var r = 0;
      var c = 0;
      for (r = 8; r < this.moduleCount - 8; r++) {
        if (this.modules[r][6] !== null) continue;
        this.modules[r][6] = r % 2 === 0;
      }
      for (c = 8; c < this.moduleCount - 8; c++) {
        if (this.modules[6][c] !== null) continue;
        this.modules[6][c] = c % 2 === 0;
      }
    },
    setupPositionAdjustPattern: function () {
      var pos = QRUtil.getPatternPosition(this.typeNumber);
      var i = 0;
      var j = 0;
      var row = 0;
      var col = 0;
      var r = 0;
      var c = 0;
      for (i = 0; i < pos.length; i++) {
        for (j = 0; j < pos.length; j++) {
          row = pos[i];
          col = pos[j];
          if (this.modules[row][col] !== null) continue;
          for (r = -2; r <= 2; r++) {
            for (c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                this.modules[row + r][col + c] = true;
              } else {
                this.modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    },
    setupTypeInfo: function (test, maskPattern) {
      var data = (this.errorCorrectLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);
      var i = 0;
      var mod = false;
      for (i = 0; i < 15; i++) {
        mod = !test && ((bits >> i) & 1) === 1;
        if (i < 6) this.modules[i][8] = mod;
        else if (i < 8) this.modules[i + 1][8] = mod;
        else this.modules[this.moduleCount - 15 + i][8] = mod;
        if (i < 8) this.modules[8][this.moduleCount - i - 1] = mod;
        else if (i < 9) this.modules[8][15 - i - 1 + 1] = mod;
        else this.modules[8][15 - i - 1] = mod;
      }
      this.modules[this.moduleCount - 8][8] = !test;
    },
    mapData: function (data, maskPattern) {
      var inc = -1;
      var row = this.moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var col = 0;
      var c = 0;
      var dark = false;
      var mask = false;
      for (col = this.moduleCount - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (c = 0; c < 2; c++) {
            if (this.modules[row][col - c] === null) {
              dark = false;
              if (byteIndex < data.length) {
                dark = ((data[byteIndex] >>> bitIndex) & 1) === 1;
              }
              mask = QRUtil.getMask(maskPattern, row, col - c);
              if (mask) dark = !dark;
              this.modules[row][col - c] = dark;
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || this.moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    },
  };

  QRCodeModel.createData = (typeNumber, errorCorrectLevel, dataList) => {
    var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel);
    var buffer = new QRBitBuffer();
    var i = 0;
    var totalDataCount = 0;
    var data = null;
    for (i = 0; i < dataList.length; i++) {
      data = dataList[i];
      buffer.put(data.mode, 4);
      buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber));
      data.write(buffer);
    }
    for (i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
    if (buffer.length + 4 <= totalDataCount * 8) buffer.put(0, 4);
    while (buffer.length % 8 !== 0) buffer.putBit(false);
    while (true) {
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0xec, 8);
      if (buffer.length >= totalDataCount * 8) break;
      buffer.put(0x11, 8);
    }
    return QRCodeModel.createBytes(buffer, rsBlocks);
  };

  QRCodeModel.createBytes = (buffer, rsBlocks) => {
    var offset = 0;
    var maxDcCount = 0;
    var maxEcCount = 0;
    var dcdata = new Array(rsBlocks.length);
    var ecdata = new Array(rsBlocks.length);
    var r = 0;
    var i = 0;
    var dcCount = 0;
    var ecCount = 0;
    var rsPoly = null;
    var rawPoly = null;
    var modPoly = null;
    var modIndex = 0;
    var totalCodeCount = 0;
    var data = null;
    var index = 0;

    for (r = 0; r < rsBlocks.length; r++) {
      dcCount = rsBlocks[r].dataCount;
      ecCount = rsBlocks[r].totalCount - dcCount;
      maxDcCount = Math.max(maxDcCount, dcCount);
      maxEcCount = Math.max(maxEcCount, ecCount);
      dcdata[r] = new Array(dcCount);
      for (i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 0xff & buffer.buffer[i + offset];
      offset += dcCount;
      rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
      rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1);
      modPoly = rawPoly.mod(rsPoly);
      ecdata[r] = new Array(rsPoly.getLength() - 1);
      for (i = 0; i < ecdata[r].length; i++) {
        modIndex = i + modPoly.getLength() - ecdata[r].length;
        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
      }
    }
    for (i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
    data = new Array(totalCodeCount);
    for (i = 0; i < maxDcCount; i++) {
      for (r = 0; r < rsBlocks.length; r++) {
        if (i < dcdata[r].length) data[index++] = dcdata[r][i];
      }
    }
    for (i = 0; i < maxEcCount; i++) {
      for (r = 0; r < rsBlocks.length; r++) {
        if (i < ecdata[r].length) data[index++] = ecdata[r][i];
      }
    }
    return data;
  };

  function renderQrSvg(text, options) {
    var opt = options || {};
    var size = opt.size || 256;
    var margin = typeof opt.margin === 'number' ? opt.margin : 2;
    var fg = opt.color || '#000000';
    var bg = opt.background || '#ffffff';
    var capacities = [0, 17, 32, 53, 78, 106, 134, 154, 192, 230, 271];
    var typeNumber = 1;
    var v = 1;
    var str = String(text || '');
    var qr = null;
    var count = 0;
    var viewBoxSize = 0;
    var rects = [];
    var r = 0;
    var c = 0;

    for (v = 1; v <= 10; v++) {
      if (str.length <= capacities[v]) {
        typeNumber = v;
        break;
      }
    }
    if (str.length > capacities[10]) typeNumber = 10;

    qr = new QRCodeModel(typeNumber, QRErrorCorrectLevel.L);
    qr.addData(str);
    qr.make();

    count = qr.getModuleCount();
    viewBoxSize = count + margin * 2;

    for (r = 0; r < count; r++) {
      for (c = 0; c < count; c++) {
        if (qr.isDark(r, c)) {
          rects.push(`<rect x="${c + margin}" y="${r + margin}" width="1" height="1"/>`);
        }
      }
    }

    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      viewBoxSize +
      ' ' +
      viewBoxSize +
      '" width="' +
      size +
      '" height="' +
      size +
      '" shape-rendering="crispEdges">' +
      '<rect width="100%" height="100%" fill="' +
      bg +
      '"/>' +
      '<g fill="' +
      fg +
      '">' +
      rects.join('') +
      '</g>' +
      '</svg>'
    );
  }

  function chunkPayload(payload, maxChunkSize, transferId) {
    var size = Math.max(50, maxChunkSize || 200);
    var str = String(payload || '');
    var id = transferId || `v_${Math.random().toString(36).substring(2, 8)}`;
    var totalChunks = Math.ceil(str.length / size) || 1;
    var chunks = [];
    var i = 0;
    var chunkStr = '';

    for (i = 0; i < totalChunks; i++) {
      chunkStr = str.substring(i * size, (i + 1) * size);
      chunks.push({
        c: i + 1,
        t: totalChunks,
        d: chunkStr,
        id: id,
      });
    }
    return chunks;
  }

  function assembleChunks(chunkArray) {
    var id = '';
    var total = 0;
    var receivedMap = {};
    var receivedCount = 0;
    var i = 0;
    var ch = null;
    var m = 0;
    var missing = [];
    var fullData = '';
    var k = 0;

    if (!Array.isArray(chunkArray) || chunkArray.length === 0) {
      return { complete: false, received: 0, total: 0, missing: [], payload: null };
    }

    id = chunkArray[0].id;
    total = chunkArray[0].t;

    for (i = 0; i < chunkArray.length; i++) {
      ch = chunkArray[i];
      if (ch && ch.id === id && typeof ch.c === 'number' && !receivedMap[ch.c]) {
        receivedMap[ch.c] = ch.d;
        receivedCount++;
      }
    }

    if (receivedCount < total) {
      for (m = 1; m <= total; m++) {
        if (!receivedMap[m]) missing.push(m);
      }
      return {
        complete: false,
        received: receivedCount,
        total: total,
        missing: missing,
        payload: null,
      };
    }

    for (k = 1; k <= total; k++) {
      fullData += receivedMap[k] || '';
    }

    return {
      complete: true,
      received: total,
      total: total,
      missing: [],
      payload: fullData,
    };
  }

  // Auto-initialize document theme, shortcuts, and swipe navigation when running in browser
  initTheme();
  initShortcutForwarding();
  initTouchSwipeNavigation();

  var MoneyApp = Object.assign(global.MoneyApp || {}, {
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
    TAX_DEADLINE_MILESTONES: TAX_DEADLINE_MILESTONES,
    calculateThaiTaxDeadlines: calculateThaiTaxDeadlines,
    calculateInsuranceAdequacy: calculateInsuranceAdequacy,
    calculateThaiGoldMetrics: calculateThaiGoldMetrics,
    calculateThaiInheritanceAndGiftTax: calculateThaiInheritanceAndGiftTax,
    calculateRetirementThreeBuckets: calculateRetirementThreeBuckets,
    calculateThaiDividendTaxCredit: calculateThaiDividendTaxCredit,
    calculateThaiLandAndBuildingTax: calculateThaiLandAndBuildingTax,
    detectAndParseThaiBankStatement: detectAndParseThaiBankStatement,
    calculateForeignRepatriationTax: calculateForeignRepatriationTax,
    calculateTargetDateGlidepath: calculateTargetDateGlidepath,
    calculateReorderLayout: calculateReorderLayout,
    initCardLayoutManager: initCardLayoutManager,
    generateExecutiveDossier: generateExecutiveDossier,
    formatMaskedAmount: formatMaskedAmount,
    calculateThaiEFilingWorksheet: calculateThaiEFilingWorksheet,
    calculateIncomeShockStressTest: calculateIncomeShockStressTest,
    calculateChildEducationFund: calculateChildEducationFund,
    generateQrSvg: renderQrSvg,
    chunkPayload: chunkPayload,
    assembleChunks: assembleChunks,
    generateSalt: generateSalt,
    hashPin: hashPin,
    verifyPin: verifyPin,
    formatAppLockTimeout: formatAppLockTimeout,
    calculateRetirementCeilingPool: calculateRetirementCeilingPool,
    evaluateEFilingPreFlightChecklist: evaluateEFilingPreFlightChecklist,
    simulateDebtPayoff: simulateDebtPayoff,
    compareDebtVelocity: compareDebtVelocity,
    calculateTaxAccrualAndRefundPlan: calculateTaxAccrualAndRefundPlan,
    calculateDebtConsolidation: calculateDebtConsolidation,
    calculateTaxBracketStepDown: calculateTaxBracketStepDown,
    formatExecutiveDossierSummaryText: formatExecutiveDossierSummaryText,
    validateShareTargetPayload: validateShareTargetPayload,
    calculateTermLifePremiumEstimate: calculateTermLifePremiumEstimate,
    THAI_PIT_TIERS: THAI_PIT_TIERS,
  });

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
    if (typeof global.createIndexedDBAdapter === 'undefined') global.createIndexedDBAdapter = createIndexedDBAdapter;
    if (typeof global.idbStorage === 'undefined') global.idbStorage = idbStorage;
    if (typeof global.encryptVaultData === 'undefined') global.encryptVaultData = encryptVaultData;
    if (typeof global.decryptVaultData === 'undefined') global.decryptVaultData = decryptVaultData;
    if (typeof global.TAX_DEADLINE_MILESTONES === 'undefined') global.TAX_DEADLINE_MILESTONES = TAX_DEADLINE_MILESTONES;
    if (typeof global.calculateThaiTaxDeadlines === 'undefined')
      global.calculateThaiTaxDeadlines = calculateThaiTaxDeadlines;
    if (typeof global.calculateInsuranceAdequacy === 'undefined')
      global.calculateInsuranceAdequacy = calculateInsuranceAdequacy;
    if (typeof global.calculateThaiGoldMetrics === 'undefined')
      global.calculateThaiGoldMetrics = calculateThaiGoldMetrics;
    if (typeof global.calculateThaiInheritanceAndGiftTax === 'undefined')
      global.calculateThaiInheritanceAndGiftTax = calculateThaiInheritanceAndGiftTax;
    if (typeof global.calculateRetirementThreeBuckets === 'undefined')
      global.calculateRetirementThreeBuckets = calculateRetirementThreeBuckets;
    if (typeof global.calculateThaiDividendTaxCredit === 'undefined')
      global.calculateThaiDividendTaxCredit = calculateThaiDividendTaxCredit;
    if (typeof global.calculateThaiLandAndBuildingTax === 'undefined')
      global.calculateThaiLandAndBuildingTax = calculateThaiLandAndBuildingTax;
    if (typeof global.detectAndParseThaiBankStatement === 'undefined')
      global.detectAndParseThaiBankStatement = detectAndParseThaiBankStatement;
    if (typeof global.calculateForeignRepatriationTax === 'undefined')
      global.calculateForeignRepatriationTax = calculateForeignRepatriationTax;
    if (typeof global.calculateTargetDateGlidepath === 'undefined')
      global.calculateTargetDateGlidepath = calculateTargetDateGlidepath;
    if (typeof global.generateExecutiveDossier === 'undefined')
      global.generateExecutiveDossier = generateExecutiveDossier;
    if (typeof global.formatMaskedAmount === 'undefined') global.formatMaskedAmount = formatMaskedAmount;
    if (typeof global.formatExecutiveDossierSummaryText === 'undefined')
      global.formatExecutiveDossierSummaryText = formatExecutiveDossierSummaryText;
    if (typeof global.validateShareTargetPayload === 'undefined')
      global.validateShareTargetPayload = validateShareTargetPayload;
    if (typeof global.calculateTermLifePremiumEstimate === 'undefined')
      global.calculateTermLifePremiumEstimate = calculateTermLifePremiumEstimate;
    if (typeof global.calculateThaiEFilingWorksheet === 'undefined')
      global.calculateThaiEFilingWorksheet = calculateThaiEFilingWorksheet;
    if (typeof global.calculateIncomeShockStressTest === 'undefined')
      global.calculateIncomeShockStressTest = calculateIncomeShockStressTest;
    if (typeof global.calculateChildEducationFund === 'undefined')
      global.calculateChildEducationFund = calculateChildEducationFund;
    if (typeof global.generateQrSvg === 'undefined') global.generateQrSvg = renderQrSvg;
    if (typeof global.chunkPayload === 'undefined') global.chunkPayload = chunkPayload;
    if (typeof global.assembleChunks === 'undefined') global.assembleChunks = assembleChunks;
    if (typeof global.generateSalt === 'undefined') global.generateSalt = generateSalt;
    if (typeof global.hashPin === 'undefined') global.hashPin = hashPin;
    if (typeof global.verifyPin === 'undefined') global.verifyPin = verifyPin;
    if (typeof global.formatAppLockTimeout === 'undefined') global.formatAppLockTimeout = formatAppLockTimeout;
    if (typeof global.calculateRetirementCeilingPool === 'undefined')
      global.calculateRetirementCeilingPool = calculateRetirementCeilingPool;
    if (typeof global.evaluateEFilingPreFlightChecklist === 'undefined')
      global.evaluateEFilingPreFlightChecklist = evaluateEFilingPreFlightChecklist;
    if (typeof global.simulateDebtPayoff === 'undefined') global.simulateDebtPayoff = simulateDebtPayoff;
    if (typeof global.compareDebtVelocity === 'undefined') global.compareDebtVelocity = compareDebtVelocity;
    if (typeof global.calculateTaxAccrualAndRefundPlan === 'undefined')
      global.calculateTaxAccrualAndRefundPlan = calculateTaxAccrualAndRefundPlan;
    if (typeof global.calculateDebtConsolidation === 'undefined')
      global.calculateDebtConsolidation = calculateDebtConsolidation;
    if (typeof global.calculateTaxBracketStepDown === 'undefined')
      global.calculateTaxBracketStepDown = calculateTaxBracketStepDown;
  }
})(typeof window !== 'undefined' ? window : this);
