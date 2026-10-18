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
        hex += ('00' + bytes[i].toString(16)).slice(-2);
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
    if (cryptoObj && cryptoObj.subtle && typeof cryptoObj.subtle.digest === 'function') {
      enc = new TextEncoder();
      data = enc.encode(saltStr + ':' + pin);
      hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
      hashArray = Array.from(new Uint8Array(hashBuffer));
      hex = hashArray
        .map(function (b) {
          return ('00' + b.toString(16)).slice(-2);
        })
        .join('');
      return hex;
    }
    h = 0x811c9dc5;
    str = saltStr + ':' + pin;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return ('00000000' + (h >>> 0).toString(16)).slice(-8);
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
    return isEn ? sec + ' seconds' : sec + ' วินาที';
  }

  var TAX_DEADLINE_MILESTONES = [
    {
      id: 'pnd90_paper',
      titleTh: 'ภ.ง.ด. 90/91 (ยื่นแบบกระดาษ)',
      titleEn: 'P.N.D. 90/91 (Paper Filing)',
      descTh: 'ภาษีเงินได้บุคคลธรรมดาประจำปี สำหรับผู้มีเงินได้ทุกประเภท',
      descEn: 'Annual Personal Income Tax Return for all assessable income types',
      targetDateTh: '31 มี.ค.',
      targetDateEn: 'March 31',
      month: 3,
      day: 31,
      audienceTh: 'พนักงานประจำ, ฟรีแลนซ์, ค้าขาย (ม.40(1)-(8))',
      audienceEn: 'Salaried employees, freelancers, business owners',
      badgeTh: 'ยื่นภาษีประจำปี',
      badgeEn: 'Annual PIT',
    },
    {
      id: 'pnd90_online',
      titleTh: 'ภ.ง.ด. 90/91 (ออนไลน์ e-Filing)',
      titleEn: 'P.N.D. 90/91 (Online e-Filing)',
      descTh: 'ยื่นผ่านระบบ e-Filing กรมสรรพากร ได้สิทธิขยายเวลา 8 วัน ขอคืนภาษีผ่านพร้อมเพย์',
      descEn: 'File online via RD e-Filing (+8 days extension) with PromptPay refund',
      targetDateTh: '8 เม.ย.',
      targetDateEn: 'April 8',
      month: 4,
      day: 8,
      audienceTh: 'ผู้ยื่นแบบออนไลน์ทุกคน (แนะนำ สะดวกและรวดเร็ว)',
      audienceEn: 'All online taxpayers (recommended, fastest refunds)',
      badgeTh: 'e-Filing แนะนำ',
      badgeEn: 'Recommended',
    },
    {
      id: 'land_tax',
      titleTh: 'ภาษีที่ดินและสิ่งปลูกสร้าง',
      titleEn: 'Land and Building Tax',
      descTh: 'ชำระภาษีตามหนังสือแจ้งประเมิน (ภ.ด.ส.6/7/8) ณ เทศบาล / อบต. / สนง.เขต',
      descEn: 'Pay annual property assessment at local district office / municipality / TAO',
      targetDateTh: '30 เม.ย.',
      targetDateEn: 'April 30',
      month: 4,
      day: 30,
      audienceTh: 'เจ้าของที่ดิน บ้าน คอนโด หรือสิ่งปลูกสร้างที่เข้าเกณฑ์ประเมิน',
      audienceEn: 'Owners of taxable land, residences, condos, or buildings',
      badgeTh: 'ภาษีทรัพย์สิน',
      badgeEn: 'Property Tax',
    },
    {
      id: 'pnd94_paper',
      titleTh: 'ภ.ง.ด. 94 ครึ่งปี (ยื่นแบบกระดาษ)',
      titleEn: 'P.N.D. 94 Mid-Year (Paper Filing)',
      descTh: 'ยื่นภาษีเงินได้ครึ่งปีแรก (ม.ค. - มิ.ย.) สำหรับผู้มีเงินได้ตาม ม.40(5) ถึง (8)',
      descEn: 'Mid-year PIT return on income earned Jan-Jun under Sections 40(5)-(8)',
      targetDateTh: '30 ก.ย.',
      targetDateEn: 'September 30',
      month: 9,
      day: 30,
      audienceTh: 'ผู้มีรายได้ค่าเช่า (40(5)), วิชาชีพอิสระ (40(6)), รับเหมา (40(7)), พาณิชย์ (40(8))',
      audienceEn: 'Rental income (40(5)), liberal professions (40(6)), contract work, commercial',
      badgeTh: 'ภาษีครึ่งปี',
      badgeEn: 'Mid-Year PIT',
    },
    {
      id: 'pnd94_online',
      titleTh: 'ภ.ง.ด. 94 ครึ่งปี (ออนไลน์ e-Filing)',
      titleEn: 'P.N.D. 94 Mid-Year (Online e-Filing)',
      descTh: 'ยื่นแบบครึ่งปีออนไลน์ผ่านระบบ e-Filing กรมสรรพากร ได้สิทธิขยายเวลาถึง 8 ต.ค.',
      descEn: 'Online mid-year e-Filing with statutory extension to October 8',
      targetDateTh: '8 ต.ค.',
      targetDateEn: 'October 8',
      month: 10,
      day: 8,
      audienceTh: 'ฟรีแลนซ์/ธุรกิจ ม.40(5)-(8) ยื่นออนไลน์สะดวกและปลอดภัย',
      audienceEn: 'Freelance & business taxpayers filing online',
      badgeTh: 'e-Filing ครึ่งปี',
      badgeEn: 'Online Mid-Year',
    },
    {
      id: 'deduction_window',
      titleTh: 'วันสุดท้ายลงทุนลดหย่อนภาษีปีปัจจุบัน',
      titleEn: 'Year-End Deduction Investment Deadline',
      descTh: 'ซื้อกองทุน SSF, RMF, ThaiESG และประกันชีวิต/สุขภาพ ให้เสร็จสิ้นเพื่อลดหย่อนภาษีปีนี้',
      descEn: 'Deadline to purchase SSF, RMF, ThaiESG funds & qualifying insurance for this tax year',
      targetDateTh: '31 ธ.ค.',
      targetDateEn: 'December 31',
      month: 12,
      day: 31,
      audienceTh: 'ผู้เสียภาษีทุกคนที่ต้องการลดหย่อนภาษีและประหยัดเงิน',
      audienceEn: 'All taxpayers looking to reduce tax liability and maximize savings',
      badgeTh: 'โค้งสุดท้ายลดหย่อน',
      badgeEn: 'Deduction Window',
    },
  ];

  function calculateThaiTaxDeadlines(refDate) {
    var current = refDate ? new Date(refDate) : new Date();
    var currentYear = current.getFullYear();
    var startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate());

    var computedEvents = TAX_DEADLINE_MILESTONES.map(function (ev) {
      var targetYear = currentYear;
      var targetDate = new Date(targetYear, ev.month - 1, ev.day);
      if (targetDate < startOfDay) {
        targetYear += 1;
        targetDate = new Date(targetYear, ev.month - 1, ev.day);
      }
      var diffMs = targetDate.getTime() - startOfDay.getTime();
      var daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return {
        id: ev.id,
        titleTh: ev.titleTh,
        titleEn: ev.titleEn,
        descTh: ev.descTh,
        descEn: ev.descEn,
        targetDateTh: ev.targetDateTh,
        targetDateEn: ev.targetDateEn,
        audienceTh: ev.audienceTh,
        audienceEn: ev.audienceEn,
        badgeTh: ev.badgeTh,
        badgeEn: ev.badgeEn,
        targetYear: targetYear,
        targetDate: targetDate,
        daysRemaining: daysRemaining,
        isPassedThisYear: targetDate.getFullYear() > currentYear,
      };
    });

    computedEvents.sort(function (a, b) {
      return a.daysRemaining - b.daysRemaining;
    });

    return {
      referenceDate: current,
      nextDeadline: computedEvents[0],
      deadlines: computedEvents,
    };
  }

  /**
   * Calculate Life Insurance Adequacy & Family Protection Gap
   * (Capital Needs Analysis + Human Life Value perspective)
   *
   * @param {Object} params
   * @param {number} [params.debtClearance=0] - Outstanding debts to clear (THB)
   * @param {number} [params.monthlyExpenses=0] - Monthly family living expenses (THB)
   * @param {number} [params.supportYears=10] - Number of years of family living expense support
   * @param {number} [params.childEducation=0] - Future education / milestone fund (THB)
   * @param {number} [params.emergencyCushion=0] - Transition / funeral / final expense reserve (THB)
   * @param {number} [params.liquidAssets=0] - Existing cash, savings, and liquid investments (THB)
   * @param {number} [params.existingCoverage=0] - Current death benefit / sum assured of policies (THB)
   * @param {number} [params.annualIncome=0] - Annual net income for HLV comparison (THB)
   * @param {number} [params.marginalTaxRate=0] - Marginal tax rate (%) for deduction savings
   * @returns {Object} Adequacy metrics, shortfall, HLV benchmark, and tax deduction estimates
   */
  function calculateInsuranceAdequacy(params) {
    params = params || {};
    var debtClearance = Math.max(0, parseNum(params.debtClearance));
    var monthlyExpenses = Math.max(0, parseNum(params.monthlyExpenses));
    var supportYears = params.supportYears !== undefined ? Math.max(0, parseNum(params.supportYears)) : 10;
    var childEducation = Math.max(0, parseNum(params.childEducation));
    var emergencyCushion = Math.max(0, parseNum(params.emergencyCushion));
    var liquidAssets = Math.max(0, parseNum(params.liquidAssets));
    var existingCoverage = Math.max(0, parseNum(params.existingCoverage));
    var annualIncome = Math.max(0, parseNum(params.annualIncome));
    var marginalTaxRate = Math.max(0, parseNum(params.marginalTaxRate));

    var livingNeeds = monthlyExpenses * 12 * supportYears;
    var totalCapitalNeeds = debtClearance + livingNeeds + childEducation + emergencyCushion;
    var totalExistingResources = liquidAssets + existingCoverage;

    var protectionGap = Math.max(0, totalCapitalNeeds - totalExistingResources);
    var surplus = Math.max(0, totalExistingResources - totalCapitalNeeds);

    var adequacyRatio = 100;
    if (totalCapitalNeeds > 0) {
      adequacyRatio = (totalExistingResources / totalCapitalNeeds) * 100;
    } else if (totalExistingResources === 0) {
      adequacyRatio = 100;
    }

    var status = 'adequate';
    if (totalCapitalNeeds > 0) {
      if (adequacyRatio < 50) {
        status = 'severe_shortfall';
      } else if (adequacyRatio < 100) {
        status = 'shortfall';
      } else if (adequacyRatio <= 130) {
        status = 'optimal';
      } else {
        status = 'surplus';
      }
    }

    // Human Life Value (HLV) standard multiplier: 7x annual income
    var hlvBenchmark = annualIncome > 0 ? annualIncome * 7 : 0;

    // Thai Personal Income Tax Section 47(1)(d):
    // General life insurance premiums deductible up to 100,000 THB/yr.
    // Estimated pure term/protection premium: ~1.5% of protection gap.
    var estimatedAnnualPremium = Math.round(protectionGap * 0.015);
    var deductibleAmount = Math.min(estimatedAnnualPremium, 100000);
    var potentialTaxSavings = Math.round(deductibleAmount * (marginalTaxRate / 100));

    return {
      debtClearance: debtClearance,
      livingNeeds: livingNeeds,
      monthlyExpenses: monthlyExpenses,
      supportYears: supportYears,
      childEducation: childEducation,
      emergencyCushion: emergencyCushion,
      totalCapitalNeeds: totalCapitalNeeds,
      liquidAssets: liquidAssets,
      existingCoverage: existingCoverage,
      totalExistingResources: totalExistingResources,
      protectionGap: protectionGap,
      surplus: surplus,
      adequacyRatio: Math.min(1000, Math.round(adequacyRatio * 10) / 10),
      status: status,
      hlvBenchmark: hlvBenchmark,
      estimatedAnnualPremium: estimatedAnnualPremium,
      deductibleAmount: deductibleAmount,
      potentialTaxSavings: potentialTaxSavings,
    };
  }

  /**
   * Thai Gold Bar & Jewelry DCA P/L & Baht Weight Calculator
   * Official Thai Standards:
   * 1 บาททองคำแท่ง (96.5% Gold Bar) = 15.244 grams
   * 1 บาททองคำรูปพรรณ (96.5% Gold Jewelry) = 15.16 grams
   * 1 สลึง = 0.25 บาททองคำ = 3.811g (Bar) / 3.79g (Jewelry)
   * 1 Troy Ounce = 31.1034768 grams
   *
   * @param {Object} params
   * @param {'bar'|'jewelry'} [params.goldType='bar'] - Gold product type
   * @param {'baht'|'salung'|'gram'} [params.weightUnit='baht'] - Input weight unit
   * @param {number} [params.weight=0] - Input weight quantity
   * @param {number} [params.costPerBaht=0] - Purchase price per baht weight (THB)
   * @param {number} [params.blockFee=0] - Block fee (ค่าบล็อก) or craft fee (ค่ากำเหน็จ) (THB)
   * @param {number} [params.currentMarketPrice=0] - Current selling price of Gold Traders Assoc (THB/baht)
   * @param {number} [params.currentBuybackPrice=0] - Current buyback price of Gold Traders Assoc (THB/baht)
   * @param {Array<Object>} [params.tranches=[]] - Optional array of multiple DCA purchase lots
   * @returns {Object} Comprehensive weight conversions, cost basis, valuation, and P/L
   */
  function calculateThaiGoldMetrics(params) {
    params = params || {};
    var goldType = params.goldType === 'jewelry' ? 'jewelry' : 'bar';
    var weightUnit = params.weightUnit || 'baht';
    var rawWeight = Math.max(0, parseNum(params.weight));
    var costPerBaht = Math.max(0, parseNum(params.costPerBaht));
    var blockFee = Math.max(0, parseNum(params.blockFee));
    var currentMarketPrice = Math.max(0, parseNum(params.currentMarketPrice));
    var currentBuybackPrice = Math.max(0, parseNum(params.currentBuybackPrice));

    var gramsPerBaht = goldType === 'jewelry' ? 15.16 : 15.244;

    var weightBaht = 0;
    if (weightUnit === 'salung') {
      weightBaht = rawWeight * 0.25;
    } else if (weightUnit === 'gram') {
      weightBaht = gramsPerBaht > 0 ? rawWeight / gramsPerBaht : 0;
    } else {
      weightBaht = rawWeight;
    }

    var weightGrams = weightBaht * gramsPerBaht;
    var weightSalung = weightBaht * 4;
    var weightTroyOz = weightGrams / 31.1034768;

    var tranches = Array.isArray(params.tranches) ? params.tranches : [];
    var totalTrancheBaht = 0;
    var totalTrancheCost = 0;
    var processedTranches = [];
    var i;
    var tr;
    var trType;
    var trGramsPerBaht;
    var trUnit;
    var trRawWeight;
    var trBaht;
    var trCostPerBaht;
    var trFee;
    var trTotalCost;

    if (tranches.length > 0) {
      for (i = 0; i < tranches.length; i++) {
        tr = tranches[i] || {};
        trType = tr.goldType === 'jewelry' ? 'jewelry' : 'bar';
        trGramsPerBaht = trType === 'jewelry' ? 15.16 : 15.244;
        trUnit = tr.weightUnit || 'baht';
        trRawWeight = Math.max(0, parseNum(tr.weight));
        trBaht =
          trUnit === 'salung'
            ? trRawWeight * 0.25
            : trUnit === 'gram'
              ? trGramsPerBaht > 0
                ? trRawWeight / trGramsPerBaht
                : 0
              : trRawWeight;
        trCostPerBaht = Math.max(0, parseNum(tr.costPerBaht));
        trFee = Math.max(0, parseNum(tr.blockFee));
        trTotalCost = trBaht * trCostPerBaht + trFee;

        totalTrancheBaht += trBaht;
        totalTrancheCost += trTotalCost;

        processedTranches.push({
          id: tr.id || 'tranche_' + i,
          date: tr.date || '',
          goldType: trType,
          weightBaht: Math.round(trBaht * 10000) / 10000,
          weightGrams: Math.round(trBaht * trGramsPerBaht * 100) / 100,
          costPerBaht: trCostPerBaht,
          blockFee: trFee,
          totalCost: trTotalCost,
        });
      }
    }

    var activeWeightBaht = tranches.length > 0 ? totalTrancheBaht : weightBaht;
    var activeWeightGrams = activeWeightBaht * gramsPerBaht;
    var activeWeightSalung = activeWeightBaht * 4;
    var activeWeightTroyOz = activeWeightGrams / 31.1034768;

    var totalCost = tranches.length > 0 ? totalTrancheCost : activeWeightBaht * costPerBaht + blockFee;
    var effectiveCostPerBaht = activeWeightBaht > 0 ? totalCost / activeWeightBaht : 0;

    var effectiveBuybackPrice = currentBuybackPrice;
    if (effectiveBuybackPrice <= 0 && currentMarketPrice > 0) {
      if (goldType === 'bar') {
        effectiveBuybackPrice = Math.max(0, currentMarketPrice - 100);
      } else {
        effectiveBuybackPrice = Math.round(currentMarketPrice * 0.95);
      }
    }

    var marketValue = activeWeightBaht * currentMarketPrice;
    var liquidationValue = activeWeightBaht * effectiveBuybackPrice;

    var unrealizedGainLoss = marketValue - totalCost;
    var unrealizedGainLossPct = totalCost > 0 ? (unrealizedGainLoss / totalCost) * 100 : 0;

    var liquidationGainLoss = liquidationValue - totalCost;
    var liquidationGainLossPct = totalCost > 0 ? (liquidationGainLoss / totalCost) * 100 : 0;

    var breakEvenMarketPrice = effectiveCostPerBaht;
    var breakEvenBuybackPrice = goldType === 'bar' ? effectiveCostPerBaht + 100 : effectiveCostPerBaht / 0.95;

    return {
      goldType: goldType,
      weightUnit: weightUnit,
      weightBaht: Math.round(activeWeightBaht * 10000) / 10000,
      weightGrams: Math.round(activeWeightGrams * 100) / 100,
      weightSalung: Math.round(activeWeightSalung * 100) / 100,
      weightTroyOz: Math.round(activeWeightTroyOz * 1000) / 1000,
      gramsPerBaht: gramsPerBaht,
      totalCost: Math.round(totalCost),
      effectiveCostPerBaht: Math.round(effectiveCostPerBaht),
      currentMarketPrice: currentMarketPrice,
      currentBuybackPrice: effectiveBuybackPrice,
      marketValue: Math.round(marketValue),
      liquidationValue: Math.round(liquidationValue),
      unrealizedGainLoss: Math.round(unrealizedGainLoss),
      unrealizedGainLossPct: Math.round(unrealizedGainLossPct * 10) / 10,
      liquidationGainLoss: Math.round(liquidationGainLoss),
      liquidationGainLossPct: Math.round(liquidationGainLossPct * 10) / 10,
      breakEvenMarketPrice: Math.round(breakEvenMarketPrice),
      breakEvenBuybackPrice: Math.round(breakEvenBuybackPrice),
      processedTranches: processedTranches,
    };
  }

  /**
   * Calculates Thai Inheritance Tax (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558)
   * and Annual Gift Tax (ประมวลรัษฎากร มาตรา 42(26)-(28) & 48(6)).
   *
   * @param {Object} params
   * @param {number} [params.estateValue=0] - Total legacy asset value (THB)
   * @param {'spouse'|'ascendant_descendant'|'other'} [params.heirRelationship='ascendant_descendant'] - Heir relationship to testator
   * @param {number} [params.numberOfHeirs=1] - Number of equal heirs sharing the estate
   * @param {number} [params.annualGiftValue=0] - Annual gift amount during lifetime (THB)
   * @param {'parent_to_child_realestate'|'family_movable'|'other_customary'} [params.giftType='family_movable'] - Gift classification
   * @param {number} [params.giftingYears=3] - Planned years for phased lifetime gifting
   * @returns {Object} Comprehensive inheritance tax, gift tax, and phased gifting strategy optimization
   */
  function calculateThaiInheritanceAndGiftTax(params) {
    params = params || {};
    var estateValue = Math.max(0, parseNum(params.estateValue));
    var heirRelationship = params.heirRelationship || 'ascendant_descendant';
    var numberOfHeirs = Math.max(1, Math.floor(parseNum(params.numberOfHeirs) || 1));
    var annualGiftValue = Math.max(0, parseNum(params.annualGiftValue));
    var giftType = params.giftType || 'family_movable';
    var giftingYears = Math.max(1, Math.floor(parseNum(params.giftingYears) || 3));

    // 1. Inheritance Tax Computation (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558)
    var portionPerHeir = estateValue / numberOfHeirs;
    var statutoryExemptionPerHeir = 100000000; // 100 Million THB per heir per testator
    var taxRate = 0;
    var exemptionPerHeir = 0;
    var taxablePerHeir = 0;
    var taxPerHeir = 0;
    var totalInheritanceTax = 0;
    var netLegacyReceived = 0;

    if (heirRelationship === 'spouse') {
      exemptionPerHeir = portionPerHeir;
      taxablePerHeir = 0;
      taxRate = 0;
      taxPerHeir = 0;
      totalInheritanceTax = 0;
    } else if (heirRelationship === 'ascendant_descendant') {
      exemptionPerHeir = Math.min(portionPerHeir, statutoryExemptionPerHeir);
      taxablePerHeir = Math.max(0, portionPerHeir - statutoryExemptionPerHeir);
      taxRate = 0.05;
      taxPerHeir = taxablePerHeir * taxRate;
      totalInheritanceTax = taxPerHeir * numberOfHeirs;
    } else {
      exemptionPerHeir = Math.min(portionPerHeir, statutoryExemptionPerHeir);
      taxablePerHeir = Math.max(0, portionPerHeir - statutoryExemptionPerHeir);
      taxRate = 0.1;
      taxPerHeir = taxablePerHeir * taxRate;
      totalInheritanceTax = taxPerHeir * numberOfHeirs;
    }

    netLegacyReceived = estateValue - totalInheritanceTax;

    // 2. Annual Gift Tax Computation (ประมวลรัษฎากร ม.42(26)-(28))
    var annualGiftExemption = 20000000;
    if (giftType === 'other_customary') {
      annualGiftExemption = 10000000;
    } else {
      annualGiftExemption = 20000000;
    }

    var taxableAnnualGift = Math.max(0, annualGiftValue - annualGiftExemption);
    var annualGiftTaxRate = 0.05; // 5% Final Tax option under Section 48(6)
    var annualGiftTax = taxableAnnualGift * annualGiftTaxRate;
    var netAnnualGift = annualGiftValue - annualGiftTax;

    // 3. Phased Wealth Transfer Strategy Optimization
    var phasedAnnualExemptionPerHeir = heirRelationship === 'other' ? 10000000 : 20000000;
    var maxTaxFreeGiftingPerYear = phasedAnnualExemptionPerHeir * numberOfHeirs;
    var plannedLifetimeGifts = Math.min(estateValue, maxTaxFreeGiftingPerYear * giftingYears);
    var residualEstateForInheritance = Math.max(0, estateValue - plannedLifetimeGifts);
    var residualPortionPerHeir = residualEstateForInheritance / numberOfHeirs;
    var residualTaxablePerHeir = Math.max(0, residualPortionPerHeir - statutoryExemptionPerHeir);
    var strategyTaxOnResidual = heirRelationship === 'spouse' ? 0 : residualTaxablePerHeir * taxRate * numberOfHeirs;
    var strategyTaxSavings = Math.max(0, totalInheritanceTax - strategyTaxOnResidual);
    var strategyTaxSavingsPct = totalInheritanceTax > 0 ? (strategyTaxSavings / totalInheritanceTax) * 100 : 0;

    return {
      estateValue: estateValue,
      heirRelationship: heirRelationship,
      numberOfHeirs: numberOfHeirs,
      portionPerHeir: Math.round(portionPerHeir),
      statutoryExemptionPerHeir: statutoryExemptionPerHeir,
      exemptionPerHeir: Math.round(exemptionPerHeir),
      taxablePerHeir: Math.round(taxablePerHeir),
      taxRate: taxRate,
      taxPerHeir: Math.round(taxPerHeir),
      totalInheritanceTax: Math.round(totalInheritanceTax),
      netLegacyReceived: Math.round(netLegacyReceived),
      annualGiftValue: annualGiftValue,
      giftType: giftType,
      annualGiftExemption: annualGiftExemption,
      taxableAnnualGift: Math.round(taxableAnnualGift),
      annualGiftTaxRate: annualGiftTaxRate,
      annualGiftTax: Math.round(annualGiftTax),
      netAnnualGift: Math.round(netAnnualGift),
      giftingYears: giftingYears,
      plannedLifetimeGifts: Math.round(plannedLifetimeGifts),
      residualEstateForInheritance: Math.round(residualEstateForInheritance),
      strategyTaxOnResidual: Math.round(strategyTaxOnResidual),
      strategyTaxSavings: Math.round(strategyTaxSavings),
      strategyTaxSavingsPct: Math.round(strategyTaxSavingsPct * 10) / 10,
    };
  }

  /**
   * Calculates Retirement 3-Bucket Cash Flow Allocation and Drawdown Schedule
   *
   * @param {Object} params
   * @param {number} [params.annualLivingExpense=360000] - Annual retirement living expense (THB)
   * @param {number} [params.monthlySsoPension=4125] - Monthly Social Security (ประกันสังคม) or guaranteed pension (THB)
   * @param {number} [params.monthlyElderlyAllowance=600] - Monthly government elderly allowance (เบี้ยผู้สูงอายุ) (THB)
   * @param {number} [params.totalRetirementAssets=6000000] - Total accumulated retirement net worth (THB)
   * @param {number} [params.bucket1Years=2] - Cash bucket coverage horizon (years, typically 1-2)
   * @param {number} [params.bucket2Years=5] - Income/Bonds bucket coverage horizon (years, typically 3-7)
   * @param {number} [params.bucket1YieldPct=1.5] - Annual return on cash/money market (%)
   * @param {number} [params.bucket2YieldPct=3.5] - Annual return on fixed income/bonds (%)
   * @param {number} [params.bucket3YieldPct=7.0] - Annual return on global equities/growth (%)
   * @returns {Object} 3-Bucket targets, net drawdowns, runway, and cash cushion resilience metrics
   */
  function calculateRetirementThreeBuckets(params) {
    params = params || {};
    var annualLivingExpense = Math.max(0, parseNum(params.annualLivingExpense));
    var monthlySsoPension = Math.max(0, parseNum(params.monthlySsoPension));
    var monthlyElderlyAllowance = Math.max(0, parseNum(params.monthlyElderlyAllowance));
    var totalRetirementAssets = Math.max(0, parseNum(params.totalRetirementAssets));
    var bucket1Years = Math.max(0.5, parseNum(params.bucket1Years) || 2);
    var bucket2Years = Math.max(1, parseNum(params.bucket2Years) || 5);
    var bucket1YieldPct = parseNum(params.bucket1YieldPct) || 1.5;
    var bucket2YieldPct = parseNum(params.bucket2YieldPct) || 3.5;
    var bucket3YieldPct = parseNum(params.bucket3YieldPct) || 7.0;

    var annualGuaranteedIncome = (monthlySsoPension + monthlyElderlyAllowance) * 12;
    var netAnnualDrawdown = Math.max(0, annualLivingExpense - annualGuaranteedIncome);
    var guaranteedIncomeCoveragePct =
      annualLivingExpense > 0 ? (annualGuaranteedIncome / annualLivingExpense) * 100 : 0;

    var bucket1Target = Math.round(netAnnualDrawdown * bucket1Years);
    var bucket2Target = Math.round(netAnnualDrawdown * bucket2Years);
    var defensiveNeeds = bucket1Target + bucket2Target;

    var bucket3Target = Math.max(0, totalRetirementAssets - defensiveNeeds);
    var isUnderfunded = totalRetirementAssets < defensiveNeeds;
    var shortfallAmount = isUnderfunded ? defensiveNeeds - totalRetirementAssets : 0;

    var bearMarketRunwayYears =
      netAnnualDrawdown > 0 ? Math.round(((bucket1Target + bucket2Target) / netAnnualDrawdown) * 10) / 10 : 99;

    var b1CashFlow = bucket1Target * (bucket1YieldPct / 100);
    var b2CashFlow = bucket2Target * (bucket2YieldPct / 100);
    var b3CashFlow = bucket3Target * (bucket3YieldPct / 100);
    var annualYieldCashFlow = Math.round(b1CashFlow + b2CashFlow + b3CashFlow);

    var blendedYieldPct =
      totalRetirementAssets > 0 ? Math.round((annualYieldCashFlow / totalRetirementAssets) * 10000) / 100 : 0;
    var isYieldSelfSustaining = annualYieldCashFlow >= netAnnualDrawdown && netAnnualDrawdown > 0;

    return {
      annualLivingExpense: Math.round(annualLivingExpense),
      annualGuaranteedIncome: Math.round(annualGuaranteedIncome),
      netAnnualDrawdown: Math.round(netAnnualDrawdown),
      guaranteedIncomeCoveragePct: Math.round(guaranteedIncomeCoveragePct * 10) / 10,
      bucket1Years: bucket1Years,
      bucket2Years: bucket2Years,
      bucket1Target: bucket1Target,
      bucket2Target: bucket2Target,
      bucket3Target: bucket3Target,
      totalRetirementAssets: Math.round(totalRetirementAssets),
      defensiveNeeds: defensiveNeeds,
      isUnderfunded: isUnderfunded,
      shortfallAmount: Math.round(shortfallAmount),
      bearMarketRunwayYears: bearMarketRunwayYears,
      annualYieldCashFlow: annualYieldCashFlow,
      blendedYieldPct: blendedYieldPct,
      isYieldSelfSustaining: isYieldSelfSustaining,
    };
  }

  var THAI_PIT_TAX_BRACKETS = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  function computeThaiPitTax(netIncome) {
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
  }

  /**
   * Calculates Thai Stock Dividend Tax Credit (เครดิตภาษีเงินปันผล มาตรา 47 ทวิ)
   *
   * @param {Object} params
   * @param {number|Array<Object>} [params.dividends] - Cash dividend amount or array of dividend lots
   * @param {number} [params.corporateTaxRate=0.20] - Default corporate income tax rate (CIT, typically 0.20)
   * @param {number} [params.otherTaxableNetIncome=0] - Taxpayer's regular net taxable income before dividends
   * @param {number} [params.regularTaxWithheld=0] - Regular tax already withheld at source (50 Tawi)
   * @returns {Object} Dividend tax credit metrics, scenarios, and optimal filing recommendation
   */
  function calculateThaiDividendTaxCredit(params) {
    params = params || {};
    var defaultCitRate = params.corporateTaxRate !== undefined ? parseNum(params.corporateTaxRate) : 0.2;
    var otherTaxableNetIncome = Math.max(0, parseNum(params.otherTaxableNetIncome));
    var regularTaxWithheld = Math.max(0, parseNum(params.regularTaxWithheld));

    var lots = [];
    var singleAmt;
    if (Array.isArray(params.dividends)) {
      lots = params.dividends.map(function (lot) {
        var amt = Math.max(0, parseNum(lot.amount !== undefined ? lot.amount : lot.dividend));
        var cit = lot.corporateTaxRate !== undefined ? parseNum(lot.corporateTaxRate) : defaultCitRate;
        var whtRate = lot.withholdingRate !== undefined ? parseNum(lot.withholdingRate) : 0.1;
        return {
          name: lot.name || '',
          amount: amt,
          corporateTaxRate: cit,
          withholdingRate: whtRate,
        };
      });
    } else {
      singleAmt = Math.max(0, parseNum(params.dividends !== undefined ? params.dividends : params.dividendAmount));
      if (singleAmt > 0) {
        lots.push({
          name: 'Dividends',
          amount: singleAmt,
          corporateTaxRate: defaultCitRate,
          withholdingRate: 0.1,
        });
      }
    }

    var totalDividends = 0;
    var totalDividendWht = 0;
    var totalTaxCredit = 0;
    var totalGrossedUp = 0;
    var lotsDetail = [];
    var i;
    var item;
    var d;
    var t;
    var whtRate;
    var wht;
    var creditFactor;
    var credit;
    var grossed;

    for (i = 0; i < lots.length; i++) {
      item = lots[i];
      d = item.amount;
      t = item.corporateTaxRate;
      whtRate = item.withholdingRate;
      wht = Math.round(d * whtRate);

      creditFactor = t > 0 && t < 1 ? t / (1 - t) : 0;
      credit = Math.round(d * creditFactor);
      grossed = d + credit;

      totalDividends += d;
      totalDividendWht += wht;
      totalTaxCredit += credit;
      totalGrossedUp += grossed;

      lotsDetail.push({
        name: item.name,
        amount: d,
        corporateTaxRate: t,
        creditFactor: Math.round(creditFactor * 10000) / 10000,
        taxCredit: credit,
        grossedUp: grossed,
        withholdingTax: wht,
      });
    }

    var regularTaxLiability = computeThaiPitTax(otherTaxableNetIncome);
    var regularNetPayable = regularTaxLiability - regularTaxWithheld;

    var scenarioFinalTax = {
      method: 'final_tax',
      regularTaxLiability: regularTaxLiability,
      regularWithheld: regularTaxWithheld,
      dividendWithheld: totalDividendWht,
      dividendCreditClaimed: 0,
      totalTaxCost: regularTaxLiability + totalDividendWht,
      netPayableOrRefund: regularNetPayable + totalDividendWht,
    };

    var combinedNetIncome = otherTaxableNetIncome + totalGrossedUp;
    var combinedTaxLiability = computeThaiPitTax(combinedNetIncome);
    var totalCredits = regularTaxWithheld + totalDividendWht + totalTaxCredit;
    var combinedNetPayable = combinedTaxLiability - totalCredits;
    var combinedTaxCost = combinedTaxLiability - totalTaxCredit;

    var scenarioClaimCredit = {
      method: 'claim_credit',
      combinedNetIncome: combinedNetIncome,
      combinedTaxLiability: combinedTaxLiability,
      regularWithheld: regularTaxWithheld,
      dividendWithheld: totalDividendWht,
      dividendCreditClaimed: totalTaxCredit,
      totalCredits: totalCredits,
      totalTaxCost: combinedTaxCost,
      netPayableOrRefund: combinedNetPayable,
    };

    var netTaxAdvantage = scenarioFinalTax.totalTaxCost - scenarioClaimCredit.totalTaxCost;

    var optimalChoice = 'equivalent';
    if (netTaxAdvantage > 0) {
      optimalChoice = 'claim_credit';
    } else if (netTaxAdvantage < 0) {
      optimalChoice = 'final_tax';
    }

    return {
      totalDividends: totalDividends,
      totalDividendWht: totalDividendWht,
      totalTaxCredit: totalTaxCredit,
      totalGrossedUp: totalGrossedUp,
      otherTaxableNetIncome: otherTaxableNetIncome,
      combinedNetIncome: combinedNetIncome,
      scenarioFinalTax: scenarioFinalTax,
      scenarioClaimCredit: scenarioClaimCredit,
      optimalChoice: optimalChoice,
      netTaxAdvantage: Math.abs(netTaxAdvantage),
      isClaimAdvantageous: optimalChoice === 'claim_credit',
      lotsDetail: lotsDetail,
    };
  }

  /**
   * Calculates Thai Land and Building Tax (ภาษีที่ดินและสิ่งปลูกสร้าง พ.ร.บ. 2562)
   *
   * @param {Object} params
   * @param {string} [params.landCategory='residential_primary'] - Land classification
   * @param {number} [params.appraisalValue=0] - Official government appraisal value (THB)
   * @param {number} [params.vacantConsecutiveYears=0] - Consecutive years left unutilized (for vacant land penalty)
   * @returns {Object} Tax liability, brackets breakdown, effective rate, and installment options
   */
  function calculateThaiLandAndBuildingTax(params) {
    params = params || {};
    var landCategory = params.landCategory || 'residential_primary';
    var appraisalValue = Math.max(0, parseNum(params.appraisalValue));
    var vacantConsecutiveYears = Math.max(0, parseNum(params.vacantConsecutiveYears));

    var exemptionAmount = 0;
    var rawTiers = [];
    var vacantSurcharge = 0;
    var periods = 0;

    if (landCategory === 'agricultural') {
      exemptionAmount = 50000000;
      rawTiers = [
        { limit: 75000000, rate: 0.0001, labelTh: '0 - 75 ล้านบาท (0.01%)', labelEn: '0 - 75M THB (0.01%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '75 - 100 ล้านบาท (0.03%)', labelEn: '75 - 100M THB (0.03%)' },
        { limit: 400000000, rate: 0.0005, labelTh: '100 - 500 ล้านบาท (0.05%)', labelEn: '100 - 500M THB (0.05%)' },
        { limit: 500000000, rate: 0.0007, labelTh: '500 - 1,000 ล้านบาท (0.07%)', labelEn: '500 - 1,000M THB (0.07%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 1,000 ล้านบาท (0.10%)', labelEn: 'Over 1,000M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_primary') {
      exemptionAmount = 50000000;
      rawTiers = [
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_building_only') {
      exemptionAmount = 10000000;
      rawTiers = [
        { limit: 40000000, rate: 0.0002, labelTh: '10 - 50 ล้านบาท (0.02%)', labelEn: '10 - 50M THB (0.02%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_secondary') {
      exemptionAmount = 0;
      rawTiers = [
        { limit: 50000000, rate: 0.0002, labelTh: '0 - 50 ล้านบาท (0.02%)', labelEn: '0 - 50M THB (0.02%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else {
      // commercial or vacant
      exemptionAmount = 0;
      if (landCategory === 'vacant' && vacantConsecutiveYears >= 3) {
        periods = Math.floor(vacantConsecutiveYears / 3);
        vacantSurcharge = periods * 0.003; // +0.3% every 3 years
      }
      rawTiers = [
        {
          limit: 50000000,
          rate: Math.min(0.03, 0.003 + vacantSurcharge),
          labelTh: '0 - 50 ล้านบาท',
          labelEn: '0 - 50M THB',
        },
        {
          limit: 150000000,
          rate: Math.min(0.03, 0.004 + vacantSurcharge),
          labelTh: '50 - 200 ล้านบาท',
          labelEn: '50 - 200M THB',
        },
        {
          limit: 800000000,
          rate: Math.min(0.03, 0.005 + vacantSurcharge),
          labelTh: '200 - 1,000 ล้านบาท',
          labelEn: '200 - 1,000M THB',
        },
        {
          limit: 4000000000,
          rate: Math.min(0.03, 0.006 + vacantSurcharge),
          labelTh: '1,000 - 5,000 ล้านบาท',
          labelEn: '1,000 - 5,000M THB',
        },
        {
          limit: Infinity,
          rate: Math.min(0.03, 0.007 + vacantSurcharge),
          labelTh: 'เกิน 5,000 ล้านบาท',
          labelEn: 'Over 5,000M THB',
        },
      ];
    }

    var taxableBase = Math.max(0, appraisalValue - exemptionAmount);
    var remaining = taxableBase;
    var totalTax = 0;
    var tiers = [];
    var marginalRatePct = 0;
    var i;
    var t;
    var taxableInTier;
    var taxInTier;

    for (i = 0; i < rawTiers.length; i++) {
      if (remaining <= 0 && tiers.length > 0) break;
      t = rawTiers[i];
      taxableInTier = Math.min(remaining, t.limit);
      taxInTier = Math.round(taxableInTier * t.rate);
      totalTax += taxInTier;
      remaining -= taxableInTier;
      marginalRatePct = Math.round(t.rate * 10000) / 100;

      tiers.push({
        labelTh: t.labelTh,
        labelEn: t.labelEn,
        ratePct: Math.round(t.rate * 10000) / 100,
        taxableInTier: taxableInTier,
        taxInTier: taxInTier,
      });
    }

    var effectiveRatePct = appraisalValue > 0 ? Math.round((totalTax / appraisalValue) * 10000) / 100 : 0;
    var canInstallment = totalTax >= 3000;
    var installmentMonthly = canInstallment ? Math.round((totalTax / 3) * 100) / 100 : 0;

    return {
      landCategory: landCategory,
      appraisalValue: appraisalValue,
      exemptionAmount: exemptionAmount,
      taxableBase: taxableBase,
      totalTax: totalTax,
      effectiveRatePct: effectiveRatePct,
      marginalRatePct: marginalRatePct,
      tiers: tiers,
      canInstallment: canInstallment,
      installmentMonthly: installmentMonthly,
      statutoryDeadline: '30 เมษายน (April 30)',
    };
  }

  /**
   * Auto-detects and parses Thai Mobile Banking CSV Statements (KBank, SCB, Krungthai, KKP, etc.)
   *
   * @param {string} csvText - Raw CSV text
   * @param {string} [fileName=''] - File name for bank brand heuristics
   * @returns {Object} Structured bank statement data or { isBankStatement: false }
   */
  function detectAndParseThaiBankStatement(csvText, fileName) {
    if (typeof csvText !== 'string' || !csvText.trim()) {
      return { isBankStatement: false };
    }
    fileName = (fileName || '').toLowerCase();

    // Strip BOM
    if (csvText.charCodeAt(0) === 0xfeff) {
      csvText = csvText.slice(1);
    }

    var rows = [];
    var currentRow = [];
    var currentVal = '';
    var inQuotes = false;
    var i = 0;
    var len = csvText.length;
    var char;

    while (i < len) {
      char = csvText[i];
      if (inQuotes) {
        if (char === '"') {
          if (i + 1 < len && csvText[i + 1] === '"') {
            currentVal += '"';
            i += 2;
          } else {
            inQuotes = false;
            i++;
          }
        } else {
          currentVal += char;
          i++;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
          i++;
        } else if (char === ',') {
          currentRow.push(currentVal.trim());
          currentVal = '';
          i++;
        } else if (char === '\r') {
          if (i + 1 < len && csvText[i + 1] === '\n') {
            i++;
          }
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
        } else if (char === '\n') {
          currentRow.push(currentVal.trim());
          rows.push(currentRow);
          currentRow = [];
          currentVal = '';
          i++;
        } else {
          currentVal += char;
          i++;
        }
      }
    }
    if (currentVal.length > 0 || currentRow.length > 0) {
      currentRow.push(currentVal.trim());
      rows.push(currentRow);
    }

    if (rows.length < 2) {
      return { isBankStatement: false };
    }

    var headerIdx = -1;
    var headerRow = null;
    var r;
    var rStr;
    var isDate;
    var isDesc;
    var isCashFlow;

    for (r = 0; r < Math.min(10, rows.length); r++) {
      rStr = rows[r].join(' ').toLowerCase();
      isDate = rStr.includes('date') || rStr.includes('วัน');
      isDesc =
        rStr.includes('description') ||
        rStr.includes('detail') ||
        rStr.includes('รายการ') ||
        rStr.includes('รายละเอียด') ||
        rStr.includes('transaction');
      isCashFlow =
        rStr.includes('withdrawal') ||
        rStr.includes('deposit') ||
        rStr.includes('debit') ||
        rStr.includes('credit') ||
        rStr.includes('ถอน') ||
        rStr.includes('ฝาก') ||
        rStr.includes('amount') ||
        rStr.includes('จำนวนเงิน');

      if (
        isDate &&
        (isDesc || isCashFlow) &&
        (rStr.includes('withdraw') ||
          rStr.includes('deposit') ||
          rStr.includes('debit') ||
          rStr.includes('credit') ||
          rStr.includes('ถอน') ||
          rStr.includes('ฝาก') ||
          rStr.includes('balance') ||
          rStr.includes('คงเหลือ') ||
          rStr.includes('amount') ||
          rStr.includes('จำนวนเงิน'))
      ) {
        headerIdx = r;
        headerRow = rows[r];
        break;
      }
    }

    if (headerIdx === -1 || !headerRow) {
      return { isBankStatement: false };
    }

    // Determine bank brand
    var fullHeaderStr = (headerRow.join(' ') + ' ' + fileName).toLowerCase();
    var bankCode = 'generic_bank';
    var bankName = 'Bank Statement';

    if (
      fullHeaderStr.includes('kbank') ||
      fullHeaderStr.includes('k plus') ||
      fullHeaderStr.includes('kasikorn') ||
      (fullHeaderStr.includes('channel') && fullHeaderStr.includes('outstanding balance'))
    ) {
      bankCode = 'kbank';
      bankName = 'Kasikornbank (KBank)';
    } else if (
      fullHeaderStr.includes('scb') ||
      fullHeaderStr.includes('siam commercial') ||
      fullHeaderStr.includes('easy net') ||
      fullHeaderStr.includes('จำนวนเงินที่ถอน')
    ) {
      bankCode = 'scb';
      bankName = 'Siam Commercial Bank (SCB)';
    } else if (
      fullHeaderStr.includes('krungthai') ||
      fullHeaderStr.includes('ktb') ||
      fullHeaderStr.includes('next') ||
      (fullHeaderStr.includes('debit') && fullHeaderStr.includes('credit') && fullHeaderStr.includes('balance'))
    ) {
      bankCode = 'krungthai';
      bankName = 'Krungthai Bank (KTB)';
    } else if (fullHeaderStr.includes('kkp') || fullHeaderStr.includes('dime') || fullHeaderStr.includes('kiatnakin')) {
      bankCode = 'kkp';
      bankName = 'KKP Mobile / Dime';
    }

    // Map columns
    var dateCol = -1;
    var descCol = -1;
    var withdrawCol = -1;
    var depositCol = -1;
    var amountCol = -1;
    var c;
    var colLower;

    for (c = 0; c < headerRow.length; c++) {
      colLower = headerRow[c].toLowerCase();
      if (dateCol === -1 && (colLower.includes('date') || colLower.includes('วัน'))) {
        dateCol = c;
      } else if (
        colLower.includes('description') ||
        colLower.includes('รายละเอียด') ||
        colLower.includes('particulars') ||
        colLower.includes('narrative') ||
        (descCol === -1 &&
          (colLower.includes('detail') || colLower.includes('รายการ') || colLower.includes('transaction')) &&
          !colLower.includes('type') &&
          !colLower.includes('ประเภท'))
      ) {
        descCol = c;
      } else if (
        withdrawCol === -1 &&
        (colLower.includes('withdrawal') ||
          colLower.includes('debit') ||
          colLower.includes('ถอน') ||
          colLower.includes('จ่าย'))
      ) {
        withdrawCol = c;
      } else if (
        depositCol === -1 &&
        (colLower.includes('deposit') ||
          colLower.includes('credit') ||
          colLower.includes('ฝาก') ||
          colLower.includes('รับ'))
      ) {
        depositCol = c;
      } else if (
        amountCol === -1 &&
        (colLower.includes('amount') || colLower.includes('จำนวนเงิน') || colLower.includes('ยอดเงิน'))
      ) {
        amountCol = c;
      }
    }

    // If description wasn't found, find first non-amount non-date column
    if (descCol === -1) {
      for (c = 0; c < headerRow.length; c++) {
        if (c !== dateCol && c !== withdrawCol && c !== depositCol && c !== amountCol) {
          descCol = c;
          break;
        }
      }
    }

    var transactions = [];
    var incomes = [];
    var expenses = [];
    var totalInflow = 0;
    var totalOutflow = 0;
    var row;
    var dateVal;
    var descVal;
    var withdrawVal;
    var depositVal;
    var amountVal;
    var txAmt;

    for (r = headerIdx + 1; r < rows.length; r++) {
      row = rows[r];
      if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

      dateVal = dateCol >= 0 && row[dateCol] ? row[dateCol].trim() : '';
      descVal = descCol >= 0 && row[descCol] ? row[descCol].trim() : '';
      withdrawVal = withdrawCol >= 0 && row[withdrawCol] ? parseNum(row[withdrawCol]) : 0;
      depositVal = depositCol >= 0 && row[depositCol] ? parseNum(row[depositCol]) : 0;
      amountVal = amountCol >= 0 && row[amountCol] ? parseNum(row[amountCol]) : 0;

      if (!descVal && withdrawVal === 0 && depositVal === 0 && amountVal === 0) continue;

      if (withdrawCol >= 0 && depositCol >= 0) {
        if (withdrawVal > 0) {
          expenses.push({
            name: descVal || 'Expense',
            value: Math.round(withdrawVal * 100) / 100,
            date: dateVal,
          });
          totalOutflow += withdrawVal;
          transactions.push({ type: 'debit', amount: withdrawVal, description: descVal, date: dateVal });
        }
        if (depositVal > 0) {
          incomes.push({
            name: descVal || 'Income',
            value: Math.round(depositVal * 100) / 100,
            date: dateVal,
          });
          totalInflow += depositVal;
          transactions.push({ type: 'credit', amount: depositVal, description: descVal, date: dateVal });
        }
      } else if (amountCol >= 0) {
        if (amountVal < 0) {
          txAmt = Math.abs(amountVal);
          expenses.push({
            name: descVal || 'Expense',
            value: Math.round(txAmt * 100) / 100,
            date: dateVal,
          });
          totalOutflow += txAmt;
          transactions.push({ type: 'debit', amount: txAmt, description: descVal, date: dateVal });
        } else if (amountVal > 0) {
          incomes.push({
            name: descVal || 'Income',
            value: Math.round(amountVal * 100) / 100,
            date: dateVal,
          });
          totalInflow += amountVal;
          transactions.push({ type: 'credit', amount: amountVal, description: descVal, date: dateVal });
        }
      }
    }

    if (transactions.length === 0) {
      return { isBankStatement: false };
    }

    return {
      isBankStatement: true,
      bankCode: bankCode,
      bankName: bankName,
      summary: {
        totalInflow: Math.round(totalInflow * 100) / 100,
        totalOutflow: Math.round(totalOutflow * 100) / 100,
        transactionCount: transactions.length,
      },
      candidate: {
        incomes: incomes,
        expenses: expenses,
        savings: [],
        manualOverrides: { tax: false, sso: false, pvd: false },
        showEmergencyRunway: false,
        currentEmergencyReserve: 0,
      },
      transactions: transactions,
    };
  }

  /**
   * Calculates Thai Foreign Investment & Crypto Repatriation Tax (คำสั่งกรมสรรพากร ป.161/2566 & ป.162/2566)
   *
   * @param {Object} params
   * @param {number} [params.remittanceAmount=0] - Total foreign funds remitted into Thailand (THB)
   * @param {number} [params.pre2024AccumulatedAmount=0] - Portion derived abroad before 1 Jan 2024 (exempt under P.162/2566)
   * @param {number} [params.principalCapitalAmount=0] - Portion representing original invested capital (exempt from assessable income)
   * @param {number} [params.daysInThailand=180] - Number of days residing in Thailand in the remittance tax year
   * @param {number} [params.foreignTaxPaidThb=0] - Foreign tax paid abroad eligible for DTA tax credit (THB)
   * @param {number} [params.otherTaxableNetIncome=0] - Domestic net taxable income in Thailand before remittance (THB)
   * @returns {Object} Tax liability, DTA credits, exemptions, and strategic repatriation guidance
   */
  function calculateForeignRepatriationTax(params) {
    params = params || {};
    var remittanceAmount = Math.max(0, parseNum(params.remittanceAmount));
    var pre2024AccumulatedAmount = Math.max(0, parseNum(params.pre2024AccumulatedAmount));
    var principalCapitalAmount = Math.max(0, parseNum(params.principalCapitalAmount));
    var daysInThailand = params.daysInThailand !== undefined ? parseNum(params.daysInThailand) : 180;
    var foreignTaxPaidThb = Math.max(0, parseNum(params.foreignTaxPaidThb));
    var otherTaxableNetIncome = Math.max(0, parseNum(params.otherTaxableNetIncome));

    var isTaxResident = daysInThailand >= 180;
    var isExempt = false;
    var exemptionReason = 'none';

    if (!isTaxResident) {
      isExempt = true;
      exemptionReason = 'non_resident_under_180_days';
      return {
        remittanceAmount: remittanceAmount,
        daysInThailand: daysInThailand,
        isTaxResident: false,
        isExempt: true,
        exemptionReason: exemptionReason,
        pre2024ExemptAmount: 0,
        capitalPrincipalExemptAmount: 0,
        taxableRemittance: 0,
        grossThaiTaxOnRemittance: 0,
        allowableDtaCredit: 0,
        netThaiTaxPayable: 0,
        dtaSavings: 0,
        effectiveTaxRatePct: 0,
        totalNetCashRetained: remittanceAmount,
      };
    }

    var pre2024ExemptAmount = Math.min(remittanceAmount, pre2024AccumulatedAmount);
    var remainingAfterPre2024 = Math.max(0, remittanceAmount - pre2024ExemptAmount);

    var capitalPrincipalExemptAmount = Math.min(remainingAfterPre2024, principalCapitalAmount);
    var taxableRemittance = Math.max(0, remainingAfterPre2024 - capitalPrincipalExemptAmount);

    if (remittanceAmount > 0 && taxableRemittance === 0) {
      isExempt = true;
      exemptionReason = pre2024ExemptAmount >= remittanceAmount ? 'pre_2024_grandfathered' : 'principal_capital_return';
    }

    var baseTax = computeThaiPitTax(otherTaxableNetIncome);
    var totalTaxWithRemittance = computeThaiPitTax(otherTaxableNetIncome + taxableRemittance);
    var grossThaiTaxOnRemittance = Math.max(0, totalTaxWithRemittance - baseTax);

    var allowableDtaCredit = Math.min(foreignTaxPaidThb, grossThaiTaxOnRemittance);
    var netThaiTaxPayable = Math.max(0, grossThaiTaxOnRemittance - allowableDtaCredit);

    var effectiveTaxRatePct =
      remittanceAmount > 0 ? Math.round((netThaiTaxPayable / remittanceAmount) * 10000) / 100 : 0;
    var totalNetCashRetained = remittanceAmount - netThaiTaxPayable;

    return {
      remittanceAmount: remittanceAmount,
      daysInThailand: daysInThailand,
      isTaxResident: true,
      isExempt: isExempt,
      exemptionReason: exemptionReason,
      pre2024ExemptAmount: pre2024ExemptAmount,
      capitalPrincipalExemptAmount: capitalPrincipalExemptAmount,
      taxableRemittance: taxableRemittance,
      grossThaiTaxOnRemittance: grossThaiTaxOnRemittance,
      allowableDtaCredit: allowableDtaCredit,
      netThaiTaxPayable: netThaiTaxPayable,
      dtaSavings: allowableDtaCredit,
      effectiveTaxRatePct: effectiveTaxRatePct,
      totalNetCashRetained: totalNetCashRetained,
    };
  }

  /**
   * Target Date Fund (TDF) Glidepath Allocation Engine (Roadmap Phase 64)
   *
   * Dynamically shifts Core (Equities/Growth) vs Ballast (Fixed Income/Cash) vs Satellite
   * based on years to target retirement and risk profile, modeling after GPF (กบข. แผนสมดุลตามอายุ)
   * and international Target Date Fund standards.
   *
   * @param {Object} params
   * @param {number} [params.currentAge=30]
   * @param {number} [params.targetRetirementAge=60]
   * @param {number} [params.targetYear]
   * @param {number} [params.currentYear]
   * @param {string} [params.riskTolerance='moderate'] 'conservative' | 'moderate' | 'aggressive'
   * @returns {Object}
   */
  function calculateTargetDateGlidepath(params) {
    if (!params) params = {};

    var currentAge = parseInt(params.currentAge, 10);
    var targetRetirementAge = parseInt(params.targetRetirementAge, 10);
    var targetYear = parseInt(params.targetYear, 10);
    var currentYear = parseInt(params.currentYear, 10);
    var riskTolerance = params.riskTolerance || 'moderate';

    var nowYear = !isNaN(currentYear) && currentYear > 1900 ? currentYear : new Date().getFullYear();

    if (isNaN(currentAge) || currentAge < 15) currentAge = 30;
    if (isNaN(targetRetirementAge) || targetRetirementAge < 40) targetRetirementAge = 60;

    var yearsToRetire;
    if (!isNaN(targetYear) && targetYear > nowYear) {
      yearsToRetire = targetYear - nowYear;
      targetRetirementAge = currentAge + yearsToRetire;
    } else {
      yearsToRetire = targetRetirementAge - currentAge;
      targetYear = nowYear + yearsToRetire;
    }

    var youngCore;
    var youngBallast;
    var youngSat;
    var matureCore;
    var matureBallast;
    var matureSat;

    if (riskTolerance === 'aggressive') {
      youngCore = 85;
      youngBallast = 5;
      youngSat = 10;
      matureCore = 35;
      matureBallast = 60;
      matureSat = 5;
    } else if (riskTolerance === 'conservative') {
      youngCore = 70;
      youngBallast = 25;
      youngSat = 5;
      matureCore = 20;
      matureBallast = 75;
      matureSat = 5;
    } else {
      youngCore = 80;
      youngBallast = 15;
      youngSat = 5;
      matureCore = 25;
      matureBallast = 70;
      matureSat = 5;
    }

    var t;
    if (yearsToRetire >= 25) {
      t = 1.0;
    } else if (yearsToRetire <= 0) {
      t = 0.0;
    } else {
      t = yearsToRetire / 25.0;
    }

    var corePct = Math.round(matureCore + t * (youngCore - matureCore));
    var satPct = Math.round(matureSat + t * (youngSat - matureSat));
    var ballastPct = 100 - corePct - satPct;

    var phaseKey;
    var phaseNameTh;
    var phaseNameEn;
    var adviceTh;
    var adviceEn;

    if (yearsToRetire > 20) {
      phaseKey = 'early_accumulation';
      phaseNameTh = 'ระยะสะสมความมั่งคั่งเชิงรุก (Early Accumulation)';
      phaseNameEn = 'Early Wealth Accumulation';
      adviceTh =
        'ระยะเวลาลงทุนมากกว่า 20 ปี ควรเน้นสินทรัพย์เติบโตสูง (หุ้นไทย/หุ้นโลก) เป็นหลักเพื่อพลังผลตอบแทนทบต้น ความผันผวนระยะสั้นมีเวลาฟื้นตัวได้เต็มที่';
      adviceEn =
        'With 20+ years until retirement, maximize exposure to growth assets (Global/Thai equities) for compounding growth. Short-term market dips have ample time to recover.';
    } else if (yearsToRetire > 10) {
      phaseKey = 'mid_transition';
      phaseNameTh = 'ระยะเติบโตสมดุล (Mid-Career Transition)';
      phaseNameEn = 'Mid-Career Balanced Growth';
      adviceTh =
        'เหลือเวลา 10-20 ปี ควรเริ่มสร้างกันชนพอร์ต (Ballast) ด้วยตราสารหนี้คุณภาพดีและพันธบัตรรัฐบาล ควบคู่กับหุ้นแกนหลัก เพื่อลดความเสี่ยงก่อนถึงช่วงเปลี่ยนผ่าน';
      adviceEn =
        'With 10-20 years remaining, introduce fixed-income stabilizers (Ballast) alongside core equities to smooth portfolio volatility as retirement nears.';
    } else if (yearsToRetire > 0) {
      phaseKey = 'pre_retirement';
      phaseNameTh = 'ระยะเตรียมพร้อมเกษียณ (Pre-Retirement Capital Preservation)';
      phaseNameEn = 'Pre-Retirement Capital Preservation';
      adviceTh =
        'เหลือเวลาไม่ถึง 10 ปี ต้องเน้นรักษาเงินต้น (Capital Preservation) เพิ่มสัดส่วนตราสารหนี้และสภาพคล่องเป็นหลัก เพื่อป้องกันความเสี่ยง Sequence of Returns Risk';
      adviceEn =
        'Within 10 years of retirement, prioritize capital preservation. Increase high-quality fixed income to protect against Sequence of Returns Risk.';
    } else {
      phaseKey = 'distribution';
      phaseNameTh = 'ระยะเกษียณอายุ/สร้างกระแสเงินสด (Retirement Distribution)';
      phaseNameEn = 'Retirement Distribution & Income';
      adviceTh =
        'เข้าสู่วัยเกษียณแล้ว พอร์ตเน้นสร้างกระแสเงินสดสม่ำเสมอ (พันธบัตร/เงินฝากดอกเบี้ยสูง) 65-75% และคงหุ้นปันผลคุณภาพดี 20-25% เพื่อสู้กับเงินเฟ้อ';
      adviceEn =
        'In retirement: focus on steady income and capital protection (65-75% fixed income) while retaining 20-25% dividend growth equities to hedge inflation.';
    }

    return {
      currentAge: currentAge,
      targetRetirementAge: targetRetirementAge,
      yearsToRetire: yearsToRetire,
      targetYear: targetYear,
      riskTolerance: riskTolerance,
      split: {
        core: corePct,
        ballast: ballastPct,
        satellite: satPct,
      },
      phaseKey: phaseKey,
      phaseNameTh: phaseNameTh,
      phaseNameEn: phaseNameEn,
      adviceTh: adviceTh,
      adviceEn: adviceEn,
      assetBreakdown: {
        coreDescriptionTh: 'หุ้นโลก (Global Equities), หุ้นไทย (SET50/100), กองทุนอสังหาฯ/REITs',
        coreDescriptionEn: 'Global Equities, Thai Equities, REITs & Infrastructure',
        ballastDescriptionTh: 'พันธบัตรรัฐบาล, กองทุนตราสารหนี้ระยะกลาง, เงินฝากประจำ/สภาพคล่อง',
        ballastDescriptionEn: 'Govt Bonds, High-Quality Corporate Bonds, Liquid Cash',
        satelliteDescriptionTh: 'ทองคำแท่ง (96.5%), สินทรัพย์ดิจิทัล, ธีมการลงทุนเฉพาะตัว',
        satelliteDescriptionEn: 'Physical Gold, Digital Assets, Thematic Opportunities',
      },
    };
  }

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
        card.querySelector('.card-header, .panel-header, .panel-title, [data-card-header]') ||
        card.firstElementChild
      );
    }

    function getCardBodies(card) {
      const explicit = Array.prototype.slice.call(
        card.querySelectorAll('.card-body, .panel-body, [data-card-body]')
      );
      if (explicit.length > 0) return explicit;

      const cardId = getCardId(card);
      const namedBody =
        document.getElementById(`${cardId}Body`) ||
        document.getElementById(
          `${cardId
            .replace(/^panel/, '')
            .toLowerCase()}PanelBody`,
        ) ||
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

      return order;
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
      resetLayout: () => {
        try {
          localStorage.removeItem(storageKey);
        } catch (_e) {}
        if (typeof window !== 'undefined') window.location.reload();
      },
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
      return (currency ? `${currency} ` : '฿ ') + '••••••';
    }
    return formatMoney(amount) + (currency ? ` ${currency}` : '');
  }

  /**
   * Phase 66: Thai Revenue Department (ภ.ง.ด. 90/91) e-Filing Form Pre-fill Worksheet Engine.
   * Maps taxable incomes (40(1), 40(2), 40(4)(b)), statutory standard 50% expenses,
   * 4-group tax deductions, progressive PIT tax brackets, dividend tax credit,
   * and 50 Tawi withholding into statutory RD online e-filing boxes.
   */
  function calculateThaiEFilingWorksheet(params) {
    var p = params || {};
    var salary = Number(p.salary) || 0;
    var bonus = Number(p.bonus) || 0;
    var yearlyIncome = Number(p.yearlyIncome) || 0;
    var income401 = salary * 12 + bonus + yearlyIncome;
    var income402 = Number(p.freelance402) || 0;
    var dividend404b = Number(p.dividend404b) || 0;
    var citRate = typeof p.dividendCitRate === 'number' ? p.dividendCitRate : 0.2;
    var applyDividendCredit = Boolean(p.applyDividendCredit);

    // Standard 50% statutory expenses capped at 100,000 THB for 40(1) + 40(2)
    var combinedEarned = income401 + income402;
    var statutoryExpense = Math.min(100000, combinedEarned * 0.5);

    // Dividend tax credit
    var dividendCredit = 0;
    if (applyDividendCredit && dividend404b > 0 && citRate < 1 && citRate > 0) {
      dividendCredit = Math.round(dividend404b * (citRate / (1 - citRate)));
    }

    var assessableTotal = combinedEarned + (applyDividendCredit ? dividend404b + dividendCredit : 0);
    var incomeAfterExpense =
      Math.max(0, combinedEarned - statutoryExpense) + (applyDividendCredit ? dividend404b + dividendCredit : 0);

    // Group A: Personal & Family
    var selfDeduction = 60000;
    var spouse = Number(p.spouseDeduction) || 0;
    var children = (Number(p.childrenCount) || 0) * 30000;
    var parents = (Number(p.parentCount) || 0) * 30000;
    var disabled = (Number(p.disabledCount) || 0) * 60000;
    var antenatal = Math.min(60000, Number(p.antenatalDeduction) || 0);
    var groupA = selfDeduction + spouse + children + parents + disabled + antenatal;

    // Group B: Insurance & Retirement Funds
    var sso = Math.min(10500, Number(p.sso) || 0);
    var lifeIns = Math.min(100000, Number(p.lifeInsurance) || 0);
    var healthIns = Math.min(25000, Number(p.healthInsurance) || 0);
    var combinedLifeHealth = Math.min(100000, lifeIns + healthIns);
    var parentHealth = Math.min(15000, Number(p.parentHealthInsurance) || 0);

    // 500k retirement bundle
    var rmf = Number(p.rmf) || 0;
    var ssf = Number(p.ssf) || 0;
    var pvd = Number(p.pvd) || 0;
    var gpf = Number(p.gpf) || 0;
    var nsf = Number(p.nsf) || 0;
    var pensionIns = Number(p.pensionInsurance) || 0;
    var retirementBundle = Math.min(500000, rmf + ssf + pvd + gpf + nsf + pensionIns);

    var thaiEsg = Math.min(300000, Number(p.thaiEsg) || 0);
    var groupB = sso + combinedLifeHealth + parentHealth + retirementBundle + thaiEsg;

    // Group C: Real estate & mortgage interest
    var mortgageInterest = Math.min(100000, Number(p.homeLoanInterest) || 0);
    var groupC = mortgageInterest;

    // Group D: Donations
    var netBeforeDonation = Math.max(0, incomeAfterExpense - (groupA + groupB + groupC));
    var maxDonationCap = netBeforeDonation * 0.1;
    var donationEdu = (Number(p.donationEdu) || 0) * 2; // 2x allowance
    var donationGeneral = Number(p.donationGeneral) || 0;
    var totalDonationAllowable = Math.min(maxDonationCap, donationEdu + donationGeneral);
    var groupD = totalDonationAllowable;

    var totalDeductions = groupA + groupB + groupC + groupD;
    var netTaxableIncome = Math.max(0, incomeAfterExpense - totalDeductions);

    // Progressive Tax Calculation
    var tiers = [
      { limit: 150000, rate: 0.0 },
      { limit: 150000, rate: 0.05 },
      { limit: 200000, rate: 0.1 },
      { limit: 250000, rate: 0.15 },
      { limit: 250000, rate: 0.2 },
      { limit: 1000000, rate: 0.25 },
      { limit: 3000000, rate: 0.3 },
      { limit: Infinity, rate: 0.35 },
    ];

    var remaining = netTaxableIncome;
    var grossTax = 0;
    var topRatePct = 0;
    var i;
    var t;
    var taxableInTier;
    for (i = 0; i < tiers.length; i++) {
      if (remaining <= 0) break;
      t = tiers[i];
      taxableInTier = Math.min(remaining, t.limit);
      grossTax += Math.round(taxableInTier * t.rate);
      remaining -= taxableInTier;
      if (t.rate > 0 && taxableInTier > 0) {
        topRatePct = Math.round(t.rate * 100);
      }
    }

    var taxAfterDividendCredit = Math.max(0, grossTax - dividendCredit);
    var taxWithheld = Number(p.taxWithheld50Tawi) || 0;

    // Net outcome: positive = refund, negative = payable
    var netOutcome = taxWithheld + dividendCredit - grossTax;

    var isRefund = netOutcome > 0;
    var isPayable = netOutcome < 0;
    var payableAmount = Math.max(0, -netOutcome);
    var canInstallment = payableAmount >= 3000;
    var installmentAmount = canInstallment ? Math.ceil(payableAmount / 3) : 0;

    return {
      income401: income401,
      income402: income402,
      income404b: dividend404b,
      dividendCredit: dividendCredit,
      totalAssessableIncome: assessableTotal,
      statutoryExpenseDeduction: statutoryExpense,
      incomeAfterExpense: incomeAfterExpense,
      deductions: {
        groupA: groupA,
        groupB: groupB,
        groupC: groupC,
        groupD: groupD,
        totalDeductions: totalDeductions,
      },
      netTaxableIncome: netTaxableIncome,
      taxBracketPct: topRatePct,
      grossCalculatedTax: grossTax,
      taxAfterDividendCredit: taxAfterDividendCredit,
      taxWithheld50Tawi: taxWithheld,
      netTaxDueOrRefund: netOutcome,
      isRefund: isRefund,
      isPayable: isPayable,
      canInstallment: canInstallment,
      installment3Months: installmentAmount,
    };
  }

  /**
   * Phase 67: Emergency Fund & Income Shock Stress-Tester.
   * Simulates sudden loss of income (layoff, resignation, illness, or total shock),
   * compares Barebones survival vs Standard lifestyle drain, and models Section 33
   * Social Security unemployment benefit offsets and severance buffers.
   */
  function calculateIncomeShockStressTest(params) {
    var p = params || {};
    var liquidReserve = Math.max(0, Number(p.liquidReserve) || 0);
    var severanceBuffer = Math.max(0, Number(p.severanceBuffer) || 0);
    var totalLiquidity = liquidReserve + severanceBuffer;

    var monthlyNeeds = Math.max(0, Number(p.monthlyNeeds) || 0);
    var monthlyWants = Math.max(0, Number(p.monthlyWants) || 0);
    var monthlyDebt = Math.max(0, Number(p.monthlyDebtService) || 0);

    var barebonesMonthly = monthlyNeeds + monthlyDebt;
    var standardMonthly = monthlyNeeds + monthlyWants + monthlyDebt;

    var shockType = p.shockType || 'layoff';
    var ssoMonthly = 0;
    var ssoDurationMonths = 0;

    if (shockType === 'layoff') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 7500;
      ssoDurationMonths = 6;
    } else if (shockType === 'resignation') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 4500;
      ssoDurationMonths = 3;
    } else if (shockType === 'medical') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 7500;
      ssoDurationMonths = 3;
    } else {
      // total_shock
      ssoMonthly = 0;
      ssoDurationMonths = 0;
    }

    // Calculate Barebones Runway without SSO
    var barebonesRunway = barebonesMonthly > 0 ? totalLiquidity / barebonesMonthly : totalLiquidity > 0 ? 999 : 0;

    // Calculate Standard Runway without SSO
    var standardRunway = standardMonthly > 0 ? totalLiquidity / standardMonthly : totalLiquidity > 0 ? 999 : 0;

    // Calculate Runway with SSO offset (month-by-month simulation)
    var rem = totalLiquidity;
    var ssoRunway = 0;
    var m;
    var maxMonths = 360; // 30 years cap
    var benefit = 0;
    var netDrain = 0;
    if (barebonesMonthly <= 0) {
      ssoRunway = totalLiquidity > 0 ? 999 : 0;
    } else {
      for (m = 1; m <= maxMonths; m++) {
        benefit = m <= ssoDurationMonths ? ssoMonthly : 0;
        netDrain = Math.max(0, barebonesMonthly - benefit);
        if (netDrain === 0) {
          ssoRunway += 1;
          continue;
        }
        if (rem >= netDrain) {
          rem -= netDrain;
          ssoRunway += 1;
        } else {
          ssoRunway += rem / netDrain;
          rem = 0;
          break;
        }
      }
    }

    var extendedMonths = Math.max(0, ssoRunway - barebonesRunway);

    // Risk Level Verdict
    var riskLevel = 'critical';
    if (ssoRunway >= 12) {
      riskLevel = 'safe';
    } else if (ssoRunway >= 6) {
      riskLevel = 'moderate';
    } else if (ssoRunway >= 3) {
      riskLevel = 'high_risk';
    } else {
      riskLevel = 'critical';
    }

    var ladder = [
      {
        step: 1,
        titleTh: 'เงินสดและเงินฝากออมทรัพย์ฉุกเฉิน (Cash First)',
        titleEn: 'Emergency Cash & Liquid Savings (Cash First)',
        amount: liquidReserve,
        noteTh: 'ใช้สภาพคล่องส่วนนี้ก่อนเป็นลำดับแรกเพื่อหลีกเลี่ยงการขายสินทรัพย์ขาดทุน',
        noteEn: 'Draw down pure liquid cash first to prevent forced asset fire-sales.',
      },
      {
        step: 2,
        titleTh: 'สิทธิประโยชน์ว่างงาน ปกส. ม.33 และเงินชดเชยเลิกจ้าง',
        titleEn: 'Section 33 SSO Unemployment & Severance Buffer',
        amount: severanceBuffer + ssoMonthly * ssoDurationMonths,
        noteTh:
          ssoMonthly > 0
            ? 'ยื่นเงินชดเชยว่างงาน ปกส. ม.33 ภายใน 30 วัน ได้รับ ' +
              formatMoney(ssoMonthly) +
              ' บ./ด. นาน ' +
              ssoDurationMonths +
              ' เดือน'
            : 'ไม่ได้รับเงินชดเชยว่างงานในสถานการณ์นี้',
        noteEn:
          ssoMonthly > 0
            ? 'Claim SSO benefit within 30 days: ' +
              formatMoney(ssoMonthly) +
              ' THB/mo for ' +
              ssoDurationMonths +
              ' months.'
            : 'No unemployment offset available under this scenario.',
      },
      {
        step: 3,
        titleTh: 'กองทุนรวมตลาดเงิน (MMF) และทองคำแท่งสภาพคล่องสูง',
        titleEn: 'Money Market Funds (MMF) & High-Liquidity Gold',
        noteTh: 'แปลงสินทรัพย์ความเสี่ยงต่ำเป็นเงินสดเมื่อเงินสำรองหลักเหลือน้อยกว่า 2 เดือน',
        noteEn: 'Liquidate low-risk defensive holdings when cash buffer drops below 2 months.',
      },
      {
        step: 4,
        titleTh: 'มาตรการพักชำระหนี้หรือเจรจาปรับโครงสร้างหนี้ฉุกเฉิน',
        titleEn: 'Debt Moratorium & Emergency Restructuring',
        noteTh: 'ติดต่อสถาบันการเงินทันทีก่อนเกิดการค้างชำระเพื่อขอลดค่างวดหรือพักเงินต้น',
        noteEn: 'Proactively contact lenders for loan restructuring or interest pause before default.',
      },
    ];

    return {
      totalAvailableLiquidity: totalLiquidity,
      liquidReserve: liquidReserve,
      severanceBuffer: severanceBuffer,
      barebonesMonthlyExpense: barebonesMonthly,
      standardMonthlyExpense: standardMonthly,
      shockType: shockType,
      ssoMonthlyBenefit: ssoMonthly,
      ssoBenefitMonths: ssoDurationMonths,
      scenarios: {
        barebones: {
          monthlyDrain: barebonesMonthly,
          runwayMonths: Math.round(barebonesRunway * 10) / 10,
          survivalDays: Math.round(barebonesRunway * 30),
        },
        standard: {
          monthlyDrain: standardMonthly,
          runwayMonths: Math.round(standardRunway * 10) / 10,
          survivalDays: Math.round(standardRunway * 30),
        },
        withSsoOffset: {
          runwayMonths: Math.round(ssoRunway * 10) / 10,
          survivalDays: Math.round(ssoRunway * 30),
          extendedMonths: Math.round(extendedMonths * 10) / 10,
        },
      },
      riskLevel: riskLevel,
      liquidityLadder: ladder,
    };
  }

  /**
   * Phase 68: Child Education & Higher Learning Sinking Fund Planner.
   * Models education tuition inflation (typically 4-7% p.a., exceeding headline CPI),
   * evaluates future values across major Thai education pathways (Government, Bilingual,
   * Private, Inter-Thai, and Overseas Degrees), factors existing dedicated savings,
   * and computes required monthly investment DCA to bridge the education gap.
   */
  function calculateChildEducationFund(params) {
    var p = params || {};
    var currentAge = Math.max(0, Math.min(25, Number(p.currentAge) || 0));
    var targetAge = Math.max(currentAge, Math.min(30, Number(p.targetAge) || 18));
    var yearsToCollege = Math.max(0, targetAge - currentAge);
    var degreeDuration = Math.max(1, Math.min(10, Number(p.degreeDurationYears) || 4));

    // Preset base annual tuition estimates (present value THB)
    var trackTuitionDefaults = {
      thai_public: 60000, // Thai Government University ~60,000 THB/yr
      bilingual: 200000, // Thai English Program / Bilingual ~200,000 THB/yr
      private: 120000, // Private Thai University ~120,000 THB/yr
      inter_thai: 650000, // International University in Thailand ~650,000 THB/yr
      inter_overseas: 1800000, // Overseas University (Tuition + Living) ~1,800,000 THB/yr
    };

    var track = p.educationTrack || 'thai_public';
    var baseTuition =
      typeof p.customAnnualTuition === 'number' && p.customAnnualTuition > 0
        ? p.customAnnualTuition
        : trackTuitionDefaults[track] || trackTuitionDefaults.thai_public;

    var inflationRate =
      typeof p.tuitionInflationRate === 'number' && p.tuitionInflationRate >= 0
        ? p.tuitionInflationRate / 100
        : 0.05; // default 5.0% annual tuition inflation

    var returnRate =
      typeof p.expectedInvestmentReturn === 'number' && p.expectedInvestmentReturn >= 0
        ? p.expectedInvestmentReturn / 100
        : 0.06; // default 6.0% expected annual portfolio growth

    var existingSavings = Math.max(0, Number(p.existingEducationSavings) || 0);

    // Sum inflated tuition over degree duration
    var totalFutureTuitionNeeded = 0;
    var y;
    var elapsed = 0;
    var tuitionInYear = 0;
    var yearlyProjections = [];

    for (y = 0; y < degreeDuration; y++) {
      elapsed = yearsToCollege + y;
      tuitionInYear = Math.round(baseTuition * Math.pow(1 + inflationRate, elapsed));
      totalFutureTuitionNeeded += tuitionInYear;
      yearlyProjections.push({
        degreeYear: y + 1,
        childAge: targetAge + y,
        tuitionCost: tuitionInYear,
      });
    }

    // Future value of existing dedicated savings at the start of college (compounded over yearsToCollege)
    var fvExistingSavings = Math.round(existingSavings * Math.pow(1 + returnRate, yearsToCollege));

    // Net education shortfall needed in future
    var netFundShortfall = Math.max(0, totalFutureTuitionNeeded - fvExistingSavings);

    // Monthly DCA investment needed:
    var monthlyDcaNeeded = 0;
    var totalMonths = yearsToCollege * 12;
    var monthlyRate = 0;
    var compoundFactor = 0;

    if (netFundShortfall > 0 && totalMonths > 0) {
      if (returnRate > 0) {
        monthlyRate = returnRate / 12;
        // Sinking Fund Annuity Formula: PMT = FV * (r / ((1 + r)^n - 1))
        compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
        monthlyDcaNeeded = Math.round(netFundShortfall * (monthlyRate / (compoundFactor - 1)));
      } else {
        monthlyDcaNeeded = Math.round(netFundShortfall / totalMonths);
      }
    } else if (netFundShortfall > 0 && totalMonths === 0) {
      monthlyDcaNeeded = netFundShortfall;
    }

    // Progress percentage
    var fundedRatio =
      totalFutureTuitionNeeded > 0
        ? Math.min(100, Math.round((fvExistingSavings / totalFutureTuitionNeeded) * 1000) / 10)
        : 100;

    return {
      currentAge: currentAge,
      targetAge: targetAge,
      yearsToCollege: yearsToCollege,
      degreeDurationYears: degreeDuration,
      educationTrack: track,
      baseAnnualTuition: baseTuition,
      tuitionInflationRate: Math.round(inflationRate * 1000) / 10,
      expectedInvestmentReturn: Math.round(returnRate * 1000) / 10,
      existingSavings: existingSavings,
      fvExistingSavings: fvExistingSavings,
      totalFutureTuitionNeeded: totalFutureTuitionNeeded,
      netFundShortfall: netFundShortfall,
      monthlyDcaNeeded: monthlyDcaNeeded,
      fundedRatioPct: fundedRatio,
      yearlyProjections: yearlyProjections,
    };
  }

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
    glog: function (n) {
      if (n < 1) throw new Error('glog(' + n + ')');
      return QRMath.LOG_TABLE[n];
    },
    gexp: function (n) {
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
    if (num.length === undefined) throw new Error(num.length + '/' + shift);
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

  QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
    var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
    var length = 0;
    var list = [];
    var i = 0;
    var j = 0;
    var count = 0;
    var totalCount = 0;
    var dataCount = 0;
    if (rsBlock === undefined) {
      throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectLevel:' + errorCorrectLevel);
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

  QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
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
    getBCHTypeInfo: function (data) {
      var d = data << 10;
      while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
        d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15));
      }
      return ((data << 10) | d) ^ QRUtil.G15_MASK;
    },
    getBCHDigit: function (data) {
      var digit = 0;
      var d = data;
      while (d !== 0) {
        digit++;
        d >>>= 1;
      }
      return digit;
    },
    getPatternPosition: function (typeNumber) {
      return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1] || [];
    },
    getMask: function (maskPattern, i, j) {
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
          throw new Error('bad maskPattern:' + maskPattern);
      }
    },
    getErrorCorrectPolynomial: function (errorCorrectLength) {
      var a = new QRPolynomial([1], 0);
      var i = 0;
      for (i = 0; i < errorCorrectLength; i++) {
        a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
      }
      return a;
    },
    getLengthInBits: function (mode, type) {
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
            throw new Error('mode:' + mode);
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
            throw new Error('mode:' + mode);
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
        throw new Error(row + ',' + col);
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

  QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
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

  QRCodeModel.createBytes = function (buffer, rsBlocks) {
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
          rects.push('<rect x="' + (c + margin) + '" y="' + (r + margin) + '" width="1" height="1"/>');
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
    var id = transferId || 'v_' + Math.random().toString(36).substring(2, 8);
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
    if (typeof global.createIndexedDBAdapter === 'undefined')
      global.createIndexedDBAdapter = createIndexedDBAdapter;
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
    if (typeof global.formatAppLockTimeout === 'undefined')
      global.formatAppLockTimeout = formatAppLockTimeout;
  }
})(typeof window !== 'undefined' ? window : this);
