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
    if (typeof global.TAX_DEADLINE_MILESTONES === 'undefined') global.TAX_DEADLINE_MILESTONES = TAX_DEADLINE_MILESTONES;
    if (typeof global.calculateThaiTaxDeadlines === 'undefined')
      global.calculateThaiTaxDeadlines = calculateThaiTaxDeadlines;
    if (typeof global.calculateInsuranceAdequacy === 'undefined')
      global.calculateInsuranceAdequacy = calculateInsuranceAdequacy;
    if (typeof global.calculateThaiGoldMetrics === 'undefined')
      global.calculateThaiGoldMetrics = calculateThaiGoldMetrics;
  }
})(typeof window !== 'undefined' ? window : this);
