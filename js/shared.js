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

  // Auto-initialize document theme and shortcuts when running in browser
  initTheme();
  initShortcutForwarding();

  var MoneyApp = {
    LANG: LANG,
    THEME: THEME,
    unit: unit,
    formatMoney: formatMoney,
    parseNum: parseNum,
    escapeHtml: escapeHtml,
    initTheme: initTheme,
    initShortcutForwarding: initShortcutForwarding,
    safeJsonParse: safeJsonParse,
    createUndoManager: createUndoManager,
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
    if (typeof global.safeJsonParse === 'undefined') global.safeJsonParse = safeJsonParse;
    if (typeof global.createUndoManager === 'undefined') global.createUndoManager = createUndoManager;
  }
})(typeof window !== 'undefined' ? window : this);
