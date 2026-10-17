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
  }
})(typeof window !== 'undefined' ? window : this);
