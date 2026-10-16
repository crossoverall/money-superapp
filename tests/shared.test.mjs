import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');

function createEnvironment(lang = 'th', theme = 'light') {
  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: '', dataset: {} },
    },
    localStorage: {
      getItem: (key) => {
        if (key === 'moneySuperapp.lang') return lang;
        if (key === 'moneySuperapp.theme') return theme;
        return null;
      },
    },
  };

  const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp, mockWindow };
}

describe('MoneyApp Shared Core Module', () => {
  it('correctly initializes language and theme from localStorage', () => {
    const { MoneyApp, mockWindow } = createEnvironment('en', 'dark');
    assert.equal(MoneyApp.LANG, 'en');
    assert.equal(MoneyApp.THEME, 'dark');
    assert.equal(MoneyApp.unit, 'THB');
    assert.equal(mockWindow.document.documentElement.lang, 'en');
    assert.equal(mockWindow.document.documentElement.dataset.theme, 'dark');
  });

  it('defaults to Thai language and light theme if localStorage empty', () => {
    const { MoneyApp } = createEnvironment(null, null);
    assert.equal(MoneyApp.LANG, 'th');
    assert.equal(MoneyApp.THEME, 'light');
    assert.equal(MoneyApp.unit, 'บาท');
  });

  describe('parseNum', () => {
    const { MoneyApp } = createEnvironment();

    it('parses formatted comma-separated numbers', () => {
      assert.equal(MoneyApp.parseNum('1,234,567.89'), 1234567.89);
      assert.equal(MoneyApp.parseNum('50,000'), 50000);
      assert.equal(MoneyApp.parseNum('  100  '), 100);
    });

    it('returns raw numbers if already a number', () => {
      assert.equal(MoneyApp.parseNum(42.5), 42.5);
      assert.equal(MoneyApp.parseNum(0), 0);
    });

    it('handles falsy or invalid values gracefully', () => {
      assert.equal(MoneyApp.parseNum(''), 0);
      assert.equal(MoneyApp.parseNum(null), 0);
      assert.equal(MoneyApp.parseNum(undefined), 0);
      assert.equal(MoneyApp.parseNum('not-a-number'), 0);
      assert.equal(MoneyApp.parseNum(NaN), 0);
    });
  });

  describe('formatMoney', () => {
    it('formats integer values in Thai locale', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(MoneyApp.formatMoney(1500000), '1,500,000');
      assert.equal(MoneyApp.formatMoney(0), '0');
    });

    it('formats with decimal precision when requested', () => {
      const { MoneyApp } = createEnvironment('en');
      assert.equal(MoneyApp.formatMoney(1234.56, 2), '1,234.56');
      assert.equal(MoneyApp.formatMoney(1234, 2), '1,234.00');
    });
  });

  describe('escapeHtml', () => {
    const { MoneyApp } = createEnvironment();

    it('escapes dangerous HTML characters', () => {
      const input = '<script>alert("XSS & fun")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; fun&quot;)&lt;/script&gt;';
      assert.equal(MoneyApp.escapeHtml(input), expected);
    });

    it('escapes single quotes correctly', () => {
      assert.equal(MoneyApp.escapeHtml("Tom's Debt"), 'Tom&#39;s Debt');
    });

    it('handles null and undefined gracefully', () => {
      assert.equal(MoneyApp.escapeHtml(null), '');
      assert.equal(MoneyApp.escapeHtml(undefined), '');
      assert.equal(MoneyApp.escapeHtml(''), '');
    });
  });

  describe('safeJsonParse', () => {
    it('returns parsed object for valid JSON', () => {
      const mockStorage = {
        'test.key': JSON.stringify({ a: 1, b: 'hello' }),
      };
      const mockEnv = {
        addEventListener: () => {},
        document: { documentElement: { lang: '', dataset: {} } },
        localStorage: { getItem: (k) => mockStorage[k] || null },
      };
      const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
      const app = fn(mockEnv, mockEnv.document, mockEnv.localStorage);

      const res = app.safeJsonParse('test.key', { fallback: true });
      assert.deepEqual(res, { a: 1, b: 'hello' });
    });

    it('returns fallback when key is not found or corrupted', () => {
      const mockStorage = {
        'corrupt.key': '{invalid_json...',
      };
      const mockEnv = {
        addEventListener: () => {},
        document: { documentElement: { lang: '', dataset: {} } },
        localStorage: { getItem: (k) => mockStorage[k] || null },
      };
      const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
      const app = fn(mockEnv, mockEnv.document, mockEnv.localStorage);

      assert.deepEqual(app.safeJsonParse('missing.key', { def: 1 }), { def: 1 });
      assert.deepEqual(app.safeJsonParse('corrupt.key', { def: 2 }), { def: 2 });
    });
  });

  describe('createUndoManager', () => {
    const { MoneyApp } = createEnvironment();

    it('pushes snapshots and restores previous state on undo', () => {
      let restored = null;
      const undoMgr = MoneyApp.createUndoManager({
        maxDepth: 5,
        onUndo: (state) => {
          restored = state;
        },
      });

      assert.equal(undoMgr.canUndo(), false);
      assert.equal(undoMgr.size(), 0);

      undoMgr.push({ step: 1 });
      assert.equal(undoMgr.canUndo(), true);
      assert.equal(undoMgr.size(), 1);

      undoMgr.push({ step: 2 });
      assert.equal(undoMgr.size(), 2);

      const popped = undoMgr.undo();
      assert.deepEqual(popped, { step: 2 });
      assert.deepEqual(restored, { step: 2 });
      assert.equal(undoMgr.size(), 1);

      undoMgr.undo();
      assert.deepEqual(restored, { step: 1 });
      assert.equal(undoMgr.canUndo(), false);
      assert.equal(undoMgr.undo(), null);
    });

    it('enforces maximum stack depth', () => {
      const undoMgr = MoneyApp.createUndoManager({ maxDepth: 3 });

      undoMgr.push({ i: 1 });
      undoMgr.push({ i: 2 });
      undoMgr.push({ i: 3 });
      undoMgr.push({ i: 4 });

      assert.equal(undoMgr.size(), 3);
      assert.deepEqual(undoMgr.undo(), { i: 4 });
      assert.deepEqual(undoMgr.undo(), { i: 3 });
      assert.deepEqual(undoMgr.undo(), { i: 2 });
      assert.equal(undoMgr.canUndo(), false);
    });
  });
});
