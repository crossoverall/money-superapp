/**
 * Money Superapp - Centralized Internationalization Core Engine (Roadmap Phase 100)
 * Handles:
 * 1. Unified translation registry (MoneyApp.I18n) for Thai ('th') and English ('en')
 * 2. Declarative localization of DOM elements ([data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria-label])
 * 3. Dynamic parameter interpolation ({name}, {amount}, {count})
 * 4. Fallback resolution and global translation helper t()
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  const DEFAULT_LANG = 'th';
  let currentLang = DEFAULT_LANG;

  // Base common dictionaries (shell, common actions, universal toolbar, dialogs)
  const dictionaries = {
    th: {
      // Common App Shell & Meta
      appName: 'Money Superapp',
      appTagline: 'วางแผนการเงินส่วนบุคคล 100% ออฟไลน์ ปลอดภัยสูงสุด',
      privacyBadge: '🔒 100% ออฟไลน์ ปลอดภัยในอุปกรณ์ของคุณ',
      printFooter:
        'Money Superapp (100% Offline & Client-Side Private) • https://crossoverall.github.io/money-superapp/',

      // Navigation Tabs
      tabDashboard: 'ภาพรวมพอร์ต (Dashboard)',
      tabRemaining: 'เงินเหลือแต่ละเดือน',
      tabDebt: 'จัดการหนี้สิน',
      tabTaxBase: 'ภาษีบุคคล (ภ.ง.ด. 90/91)',
      tabTaxPvd: 'ชดเชย & ภาษี PVD',
      tabMonthsSlips: 'สลิปเงินเดือน 12 เดือน',
      tabRebalance: 'ปรับพอร์ต & กองทุน',

      // Universal Card Layout Toolbar
      toolbarFoldAll: '▼ ย่อทั้งหมด',
      toolbarExpandAll: '▲ ขยายทั้งหมด',
      toolbarReset: '↺ รีเซ็ตตำแหน่ง',
      toolbarMoveUp: 'เลื่อนขึ้น',
      toolbarMoveDown: 'เลื่อนลง',
      toolbarFoldExpand: 'ย่อ / ขยาย',

      // Common Controls & Actions
      actionSave: 'บันทึก',
      actionCancel: 'ยกเลิก',
      actionReset: 'รีเซ็ตข้อมูล',
      actionConfirm: 'ยืนยัน',
      actionClose: 'ปิด',
      actionCopy: 'คัดลอก',
      actionCopied: '✓ คัดลอกแล้ว!',
      actionExport: 'สำรองข้อมูล (JSON)',
      actionImport: 'กู้คืนข้อมูล (JSON)',
      actionPrint: 'พิมพ์รายงาน',
      actionActive: 'เปิดใช้งาน',
      actionOff: 'ปิดอยู่',
      actionApply: 'ปรับใช้',

      // Common Units & Suffixes
      unitBaht: 'บาท',
      unitThb: 'THB',
      unitMonth: 'เดือน',
      unitYear: 'ปี',
      unitDays: 'วัน',
      unitPercent: '%',

      // Common Alerts & Statuses
      statusSafe: 'ปลอดภัย (Safe)',
      statusWarning: 'ใกล้เต็มสิทธิ์ (Warning)',
      statusExceeded: 'เกินเพดาน (Exceeded)',
      statusComplete: 'สมบูรณ์',
      statusIncomplete: 'ยังไม่พร้อม',
      statusReadyToFile: 'พร้อมยื่นแบบ 🚀',

      // Confirmations
      confirmResetDefaults: 'ต้องการล้างข้อมูลและคืนค่าเริ่มต้นหรือไม่?',
      confirmDeleteRecord: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    },
    en: {
      // Common App Shell & Meta
      appName: 'Money Superapp',
      appTagline: 'Personal Financial Planner 100% Offline & Privacy-First',
      privacyBadge: '🔒 100% Offline & Private on Your Device',
      printFooter:
        'Money Superapp (100% Offline & Client-Side Private) • https://crossoverall.github.io/money-superapp/',

      // Navigation Tabs
      tabDashboard: 'Portfolio Dashboard',
      tabRemaining: 'Monthly Cash Flow',
      tabDebt: 'Debt Freedom',
      tabTaxBase: 'Thai PIT (P.N.D. 90/91)',
      tabTaxPvd: 'Severance & PVD Tax',
      tabMonthsSlips: '12-Month Payslips',
      tabRebalance: 'Portfolio Rebalancer',

      // Universal Card Layout Toolbar
      toolbarFoldAll: '▼ Fold All',
      toolbarExpandAll: '▲ Expand All',
      toolbarReset: '↺ Reset Layout',
      toolbarMoveUp: 'Move Up',
      toolbarMoveDown: 'Move Down',
      toolbarFoldExpand: 'Fold / Expand',

      // Common Controls & Actions
      actionSave: 'Save',
      actionCancel: 'Cancel',
      actionReset: 'Reset Data',
      actionConfirm: 'Confirm',
      actionClose: 'Close',
      actionCopy: 'Copy',
      actionCopied: '✓ Copied!',
      actionExport: 'Backup (JSON)',
      actionImport: 'Restore (JSON)',
      actionPrint: 'Print Report',
      actionActive: 'ACTIVE',
      actionOff: 'OFF',
      actionApply: 'Apply',

      // Common Units & Suffixes
      unitBaht: 'THB',
      unitThb: 'THB',
      unitMonth: 'month',
      unitYear: 'year',
      unitDays: 'days',
      unitPercent: '%',

      // Common Alerts & Statuses
      statusSafe: 'Safe (<80%)',
      statusWarning: 'Near Limit (>=80%)',
      statusExceeded: 'Exceeded Cap',
      statusComplete: 'Complete',
      statusIncomplete: 'Incomplete',
      statusReadyToFile: 'Ready to File 🚀',

      // Confirmations
      confirmResetDefaults: 'Clear form data and reset to defaults?',
      confirmDeleteRecord: 'Are you sure you want to delete this record?',
    },
  };

  /**
   * Registers or extends translations for a specified language.
   * @param {string} lang - 'th' or 'en'
   * @param {Record<string, string>} dict - Dictionary key-value pairs
   */
  function register(lang, dict) {
    if (!lang || typeof dict !== 'object' || dict === null) return;
    const targetLang = lang.toLowerCase() === 'en' ? 'en' : 'th';
    dictionaries[targetLang] = dictionaries[targetLang] || {};
    Object.assign(dictionaries[targetLang], dict);
  }

  /**
   * Gets a read-only snapshot of the registered dictionary for a language.
   * @param {string} [lang] - Language code ('th' | 'en')
   * @returns {Record<string, string>}
   */
  function getDictionary(lang) {
    const l = (lang || currentLang || DEFAULT_LANG).toLowerCase() === 'en' ? 'en' : 'th';
    return Object.assign({}, dictionaries[l] || {});
  }

  /**
   * Sets the active language ('th' or 'en').
   * @param {string} lang
   */
  function setLanguage(lang) {
    currentLang = lang && lang.toLowerCase() === 'en' ? 'en' : 'th';
    if (typeof global.LANG !== 'undefined') {
      global.LANG = currentLang;
    }
  }

  /**
   * Gets the active language code.
   * @returns {string}
   */
  function getLanguage() {
    if (typeof global.LANG === 'string' && (global.LANG === 'en' || global.LANG === 'th')) {
      return global.LANG;
    }
    return currentLang;
  }

  /**
   * Resolves a translated string by key with parameter interpolation and fallbacks.
   * @param {string} key - Dictionary key
   * @param {string} [fallback] - Fallback string if key is not found
   * @param {Record<string, any>} [params] - Optional named interpolation values {key}
   * @param {string} [lang] - Optional explicit language override
   * @returns {string}
   */
  function t(key, fallback = '', params = null, lang = null) {
    if (!key) return fallback || '';
    const activeLang = (lang || getLanguage() || DEFAULT_LANG).toLowerCase() === 'en' ? 'en' : 'th';
    let text = dictionaries[activeLang]?.[key];

    // Fallback: look in alternative language or fallback argument
    if (typeof text !== 'string') {
      text = dictionaries[DEFAULT_LANG]?.[key];
    }
    if (typeof text !== 'string') {
      text = typeof fallback === 'string' && fallback.length > 0 ? fallback : key;
    }

    // Interpolate {paramName}
    if (params && typeof params === 'object') {
      text = text.replace(/\{([a-zA-Z0-9_-]+)\}/g, (_match, pName) => {
        return params[pName] !== undefined ? String(params[pName]) : `{${pName}}`;
      });
    }

    return text;
  }

  /**
   * Declaratively applies translations across a DOM subtree by querying:
   * 1. [data-i18n]: sets element textContent
   * 2. [data-i18n-placeholder]: sets input/textarea placeholder
   * 3. [data-i18n-title]: sets element title
   * 4. [data-i18n-aria-label]: sets aria-label attribute
   *
   * @param {HTMLElement|Document} [root=document] - Root DOM node to traverse
   * @param {string} [lang] - Language code ('th' | 'en')
   */
  function applyLocalization(root = null, lang = null) {
    const doc = root || (typeof document !== 'undefined' ? document : null);
    if (!doc || typeof doc.querySelectorAll !== 'function') return;

    const activeLang = lang || getLanguage();

    // 1. Text content
    const textEls = doc.querySelectorAll('[data-i18n]');
    for (let i = 0; i < textEls.length; i++) {
      const el = textEls[i];
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key, el.textContent, null, activeLang);
      }
    }

    // 2. Placeholders
    const placeholderEls = doc.querySelectorAll('[data-i18n-placeholder]');
    for (let i = 0; i < placeholderEls.length; i++) {
      const el = placeholderEls[i];
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = t(key, el.placeholder, null, activeLang);
      }
    }

    // 3. Titles / Tooltips
    const titleEls = doc.querySelectorAll('[data-i18n-title]');
    for (let i = 0; i < titleEls.length; i++) {
      const el = titleEls[i];
      const key = el.getAttribute('data-i18n-title');
      if (key) {
        el.title = t(key, el.title, null, activeLang);
      }
    }

    // 4. ARIA labels
    const ariaEls = doc.querySelectorAll('[data-i18n-aria-label]');
    for (let i = 0; i < ariaEls.length; i++) {
      const el = ariaEls[i];
      const key = el.getAttribute('data-i18n-aria-label');
      if (key) {
        el.setAttribute('aria-label', t(key, el.getAttribute('aria-label') || '', null, activeLang));
      }
    }
  }

  const I18n = {
    register,
    getDictionary,
    setLanguage,
    getLanguage,
    t,
    applyLocalization,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.I18n = I18n;

  if (typeof global !== 'undefined') {
    if (typeof global.I18n === 'undefined') {
      global.I18n = I18n;
    }
    // Global helper shorthand t()
    if (typeof global.t === 'undefined') {
      global.t = (key, fallback, params, lang) => I18n.t(key, fallback, params, lang);
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
