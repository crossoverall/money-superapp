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

  describe('escapeAttr', () => {
    const { MoneyApp } = createEnvironment();

    it('escapes double quotes in HTML attributes', () => {
      assert.equal(MoneyApp.escapeAttr('Hello "World"'), 'Hello &quot;World&quot;');
    });

    it('handles null and undefined gracefully', () => {
      assert.equal(MoneyApp.escapeAttr(null), '');
      assert.equal(MoneyApp.escapeAttr(undefined), '');
      assert.equal(MoneyApp.escapeAttr(''), '');
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

  describe('Onboarding State Management', () => {
    it('detects first-run state when flag is missing in localStorage', () => {
      const store = {};
      const hasSeen = (s) => s['moneySuperapp.hasSeenOnboarding'] === 'true';
      assert.equal(hasSeen(store), false);
      store['moneySuperapp.hasSeenOnboarding'] = 'true';
      assert.equal(hasSeen(store), true);
    });
  });

  describe('Touch Swipe Gesture Navigation', () => {
    const { MoneyApp } = createEnvironment();

    it('detects valid left swipe (navigates to next tab)', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 200,
        startY: 100,
        endX: 80,
        endY: 110,
        startTime: 1000,
        endTime: 1250,
      });
      assert.notEqual(res, null);
      assert.equal(res.direction, 'next');
      assert.equal(res.deltaX, -120);
      assert.equal(res.deltaY, 10);
      assert.equal(res.duration, 250);
    });

    it('detects valid right swipe (navigates to prev tab)', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 100,
        startY: 150,
        endX: 220,
        endY: 145,
        startTime: 1000,
        endTime: 1200,
      });
      assert.notEqual(res, null);
      assert.equal(res.direction, 'prev');
      assert.equal(res.deltaX, 120);
      assert.equal(res.deltaY, -5);
      assert.equal(res.duration, 200);
    });

    it('rejects swipe when horizontal distance is below threshold (< 60px)', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 100,
        startY: 100,
        endX: 55, // delta = -45px (< 60)
        endY: 102,
        startTime: 1000,
        endTime: 1150,
      });
      assert.equal(res, null);
    });

    it('rejects predominantly vertical scrolling gestures', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 100,
        startY: 100,
        endX: 80, // deltaX = -20
        endY: 250, // deltaY = +150
        startTime: 1000,
        endTime: 1200,
      });
      assert.equal(res, null);
    });

    it('rejects diagonal movements where vertical displacement exceeds limit', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 100,
        startY: 100,
        endX: 190, // deltaX = 90
        endY: 160, // deltaY = 60 (> 50)
        startTime: 1000,
        endTime: 1200,
      });
      assert.equal(res, null);
    });

    it('rejects slow drags exceeding max duration (> 550ms)', () => {
      const res = MoneyApp.detectSwipeGesture({
        startX: 100,
        startY: 100,
        endX: 220,
        endY: 105,
        startTime: 1000,
        endTime: 1600, // duration = 600ms (> 550)
      });
      assert.equal(res, null);
    });

    it('correctly clamps tab index progression across ordered tab list', () => {
      const tabs = [
        'dashboard',
        'rebalance',
        'months-slips',
        'tax-calculator-base',
        'tax-calculator',
        'remaining-money',
        'debt-calculator',
      ];

      function computeTargetIndex(currentIndex, direction) {
        if (currentIndex < 0 || currentIndex >= tabs.length) return currentIndex;
        if (direction === 'next') return Math.min(tabs.length - 1, currentIndex + 1);
        if (direction === 'prev') return Math.max(0, currentIndex - 1);
        return currentIndex;
      }

      // Clamped at start
      assert.equal(computeTargetIndex(0, 'prev'), 0);
      assert.equal(computeTargetIndex(0, 'next'), 1);

      // Middle progression
      assert.equal(computeTargetIndex(3, 'prev'), 2);
      assert.equal(computeTargetIndex(3, 'next'), 4);

      // Clamped at end
      assert.equal(computeTargetIndex(6, 'prev'), 5);
      assert.equal(computeTargetIndex(6, 'next'), 6);
    });
  });

  describe('AES-GCM Encrypted Vault Storage', () => {
    const { MoneyApp } = createEnvironment();

    it('encrypts payload into valid money-superapp-vault-v1 envelope with Base64 salt, iv, and ciphertext', async () => {
      const secretData = JSON.stringify({ key: 'super-secret-balance', amount: 500000 });
      const vaultStr = await MoneyApp.encryptVaultData(secretData, 'MyMasterPassphrase!123');

      assert.equal(typeof vaultStr, 'string');
      const envelope = JSON.parse(vaultStr);
      assert.equal(envelope.format, 'money-superapp-vault-v1');
      assert.ok(envelope.createdAt);
      assert.ok(envelope.salt);
      assert.ok(envelope.iv);
      assert.ok(envelope.ciphertext);
      assert.notEqual(envelope.ciphertext, secretData);
    });

    it('successfully decrypts encrypted vault payload with correct passphrase', async () => {
      const originalPayload = JSON.stringify({
        'moneySuperapp.dashboard.goals.v1': { netWorthTarget: 10000000 },
        'moneySuperapp.rebalance.state': { totalBudget: 25000 },
      });
      const passphrase = 'SecurePassphrase$2026';

      const encrypted = await MoneyApp.encryptVaultData(originalPayload, passphrase);
      const decrypted = await MoneyApp.decryptVaultData(encrypted, passphrase);

      assert.equal(decrypted, originalPayload);
      const parsed = JSON.parse(decrypted);
      assert.equal(parsed['moneySuperapp.dashboard.goals.v1'].netWorthTarget, 10000000);
    });

    it('rejects decryption with wrong passphrase via AEAD authentication tag check', async () => {
      const original = JSON.stringify({ secret: 'private-financials' });
      const encrypted = await MoneyApp.encryptVaultData(original, 'CorrectPassword99');

      await assert.rejects(
        async () => {
          await MoneyApp.decryptVaultData(encrypted, 'WrongPassword00');
        },
        (err) => {
          assert.ok(err);
          return true;
        },
      );
    });

    it('rejects decryption on tampered ciphertext', async () => {
      const original = JSON.stringify({ balance: 1000000 });
      const encrypted = await MoneyApp.encryptVaultData(original, 'VaultPassKey1');
      const envelope = JSON.parse(encrypted);

      // Tamper ciphertext
      envelope.ciphertext = envelope.ciphertext.slice(0, -4) + 'AAAA';

      await assert.rejects(
        async () => {
          await MoneyApp.decryptVaultData(envelope, 'VaultPassKey1');
        },
        (err) => {
          assert.ok(err);
          return true;
        },
      );
    });

    it('safely throws when passphrase is empty or payload format is invalid', async () => {
      await assert.rejects(async () => {
        await MoneyApp.encryptVaultData('data', '');
      });

      await assert.rejects(async () => {
        await MoneyApp.encryptVaultData('data', null);
      });

      await assert.rejects(async () => {
        await MoneyApp.decryptVaultData({}, 'pass');
      });

      await assert.rejects(async () => {
        await MoneyApp.decryptVaultData('{ "format": "invalid" }', 'pass');
      });
    });
  });

  describe('Command Palette & Omnisearch Filter Engine', () => {
    const sampleCommands = [
      {
        id: 'nav-dashboard',
        titleTh: '🏠 ภาพรวมการเงิน',
        titleEn: '🏠 Financial Dashboard',
        descTh: 'สรุปความมั่งคั่งสุทธิ และอัตราการออม',
        descEn: 'Net worth overview and savings rate',
        category: 'tools',
        keywords: ['networth', 'fire', 'goals', 'ความมั่งคั่ง', 'เกษียณ'],
      },
      {
        id: 'nav-pvd',
        titleTh: '📈 คำนวณภาษีเงินชดเชย & PVD',
        titleEn: '📈 Severance & PVD Tax',
        descTh: 'คำนวณภาษี ม.48(5) และเปรียบเทียบโอนเข้า RMF',
        descEn: 'Section 48(5) and RMF rollover optimizer',
        category: 'tools',
        keywords: ['rmf', 'severance', 'pvd', '48(5)', 'ชดเชย', 'เลิกจ้าง'],
      },
      {
        id: 'act-theme',
        titleTh: '🌗 สลับธีม (Light / Dark)',
        titleEn: '🌗 Toggle Theme (Light / Dark)',
        descTh: 'สลับระหว่างโหมดสว่างและโหมดมืด',
        descEn: 'Switch between light and dark themes',
        category: 'actions',
        keywords: ['theme', 'dark', 'light', 'ธีม', 'สี'],
      },
      {
        id: 'act-vault',
        titleTh: '🔐 ส่งออกคลังนิรภัย (Export Vault)',
        titleEn: '🔐 Export Encrypted Vault',
        descTh: 'สำรองข้อมูลเข้ารหัส AES-GCM 100% ปลอดภัย',
        descEn: 'AES-GCM client-side encrypted backup',
        category: 'actions',
        keywords: ['backup', 'vault', 'export', 'security', 'สำรอง'],
      },
    ];

    function filterCommands(items, query, lang = 'th') {
      const q = (query || '').trim().toLowerCase();
      if (!q) return items;

      return items.filter((item) => {
        const title = (lang === 'en' ? item.titleEn : item.titleTh).toLowerCase();
        const desc = (lang === 'en' ? item.descEn : item.descTh).toLowerCase();
        const matchTitle = title.includes(q);
        const matchDesc = desc.includes(q);
        const matchKeyword = item.keywords.some((kw) => kw.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchKeyword;
      });
    }

    it('returns all items when query is empty', () => {
      const res = filterCommands(sampleCommands, '', 'th');
      assert.equal(res.length, 4);
    });

    it('filters items correctly by English keyword', () => {
      const res = filterCommands(sampleCommands, 'rmf', 'en');
      assert.equal(res.length, 1);
      assert.equal(res[0].id, 'nav-pvd');
    });

    it('filters items correctly by Thai keyword', () => {
      const res = filterCommands(sampleCommands, 'สำรอง', 'th');
      // matches dashboard (desc/keywords: เงินสำรอง) and vault (desc: สำรองข้อมูล)
      assert.ok(res.length >= 1);
      assert.ok(res.some((i) => i.id === 'act-vault'));
    });

    it('performs case-insensitive fuzzy matching', () => {
      const res = filterCommands(sampleCommands, 'VAULT', 'en');
      assert.equal(res.length, 1);
      assert.equal(res[0].id, 'act-vault');
    });

    it('returns empty array when query does not match any items', () => {
      const res = filterCommands(sampleCommands, 'nonexistent-crypto-future-xyz', 'en');
      assert.equal(res.length, 0);
    });
  });

  describe('MoneyApp.calculateThaiTaxDeadlines', () => {
    const { MoneyApp } = createEnvironment();

    it('is exported on MoneyApp and returns structured statutory deadlines', () => {
      assert.equal(typeof MoneyApp.calculateThaiTaxDeadlines, 'function');
      const res = MoneyApp.calculateThaiTaxDeadlines(new Date(2025, 1, 1)); // Feb 1, 2025
      assert.ok(res);
      assert.ok(res.nextDeadline);
      assert.equal(res.deadlines.length, 6);
      assert.equal(res.nextDeadline.id, 'pnd90_paper');
    });

    it('exports TAX_DEADLINE_MILESTONES with Thai and English titles', () => {
      assert.ok(Array.isArray(MoneyApp.TAX_DEADLINE_MILESTONES));
      assert.equal(MoneyApp.TAX_DEADLINE_MILESTONES.length, 6);
      MoneyApp.TAX_DEADLINE_MILESTONES.forEach((m) => {
        assert.ok(m.id && m.titleTh && m.titleEn && m.targetDateTh && m.targetDateEn);
      });
    });
  });

  describe('MoneyApp.calculateReorderLayout (Card Layout Reordering Engine)', () => {
    const { MoneyApp } = createEnvironment();

    it('moves an element up in the array', () => {
      const initial = ['cardA', 'cardB', 'cardC', 'cardD'];
      const res = MoneyApp.calculateReorderLayout(initial, 'cardC', 'up');
      assert.deepEqual(res, ['cardA', 'cardC', 'cardB', 'cardD']);
    });

    it('does not move an element up if it is already first', () => {
      const initial = ['cardA', 'cardB', 'cardC'];
      const res = MoneyApp.calculateReorderLayout(initial, 'cardA', 'up');
      assert.deepEqual(res, ['cardA', 'cardB', 'cardC']);
    });

    it('moves an element down in the array', () => {
      const initial = ['cardA', 'cardB', 'cardC', 'cardD'];
      const res = MoneyApp.calculateReorderLayout(initial, 'cardB', 'down');
      assert.deepEqual(res, ['cardA', 'cardC', 'cardB', 'cardD']);
    });

    it('does not move an element down if it is already last', () => {
      const initial = ['cardA', 'cardB', 'cardC'];
      const res = MoneyApp.calculateReorderLayout(initial, 'cardC', 'down');
      assert.deepEqual(res, ['cardA', 'cardB', 'cardC']);
    });

    it('gracefully handles missing item or non-array input', () => {
      assert.deepEqual(MoneyApp.calculateReorderLayout(null, 'cardA', 'up'), []);
      assert.deepEqual(MoneyApp.calculateReorderLayout(['cardA'], 'unknown', 'up'), ['cardA']);
    });

    it('exports initCardLayoutManager on MoneyApp', () => {
      assert.equal(typeof MoneyApp.initCardLayoutManager, 'function');
    });

    it('manages card folding and reordering with multi-child support and default options', () => {
      const storage = {};
      const mockStorage = {
        getItem: (k) => storage[k] || null,
        setItem: (k, v) => {
          storage[k] = v;
        },
        removeItem: (k) => {
          delete storage[k];
        },
      };

      function createMockElement(tag, id = '', className = '') {
        const classListSet = new Set(className ? className.split(' ') : []);
        const children = [];
        const el = {
          tagName: tag.toUpperCase(),
          id,
          className,
          classList: {
            add: (c) => {
              classListSet.add(c);
              el.className = Array.from(classListSet).join(' ');
            },
            remove: (c) => {
              classListSet.delete(c);
              el.className = Array.from(classListSet).join(' ');
            },
            contains: (c) => classListSet.has(c),
            toggle: (c, force) => {
              if (force === undefined) {
                if (classListSet.has(c)) classListSet.delete(c);
                else classListSet.add(c);
              } else if (force) classListSet.add(c);
              else classListSet.delete(c);
              el.className = Array.from(classListSet).join(' ');
            },
          },
          children,
          parentNode: null,
          style: {},
          getAttribute: (attr) => (attr === 'data-card-id' ? el.id : null),
          setAttribute: () => {},
          querySelector: (sel) => {
            if (sel.includes('.card-header') || sel.includes('.panel-header')) {
              return (
                children.find((c) => c.className.includes('card-header') || c.className.includes('panel-header')) ||
                null
              );
            }
            if (sel.includes('.btn-card-up')) {
              return children.find((c) => c.className.includes('btn-card-up')) || null;
            }
            if (sel.includes('.btn-card-down')) {
              return children.find((c) => c.className.includes('btn-card-down')) || null;
            }
            if (sel.includes('.btn-card-toggle')) {
              return children.find((c) => c.className.includes('btn-card-toggle')) || null;
            }
            if (sel.includes('.card-reorder-controls')) {
              return children.find((c) => c.className.includes('card-reorder-controls')) || null;
            }
            return null;
          },
          querySelectorAll: () => [],
          appendChild: (c) => {
            c.parentNode = el;
            children.push(c);
          },
          insertBefore: (c, ref) => {
            c.parentNode = el;
            const idx = children.indexOf(ref);
            if (idx !== -1) children.splice(idx, 0, c);
            else children.push(c);
          },
        };
        Object.defineProperty(el, 'firstElementChild', {
          get: () => children[0] || null,
        });
        return el;
      }

      const container = createMockElement('div', 'mainContainer');
      const card1 = createMockElement('div', 'card1', 'reorder-card');
      const header1 = createMockElement('div', 'hdr1', 'card-header');
      const bodyChild1 = createMockElement('div', 'b1');
      const bodyChild2 = createMockElement('div', 'b2');
      card1.appendChild(header1);
      card1.appendChild(bodyChild1);
      card1.appendChild(bodyChild2);

      const card2 = createMockElement('div', 'card2', 'reorder-card');
      const header2 = createMockElement('div', 'hdr2', 'card-header');
      const bodyChild3 = createMockElement('div', 'b3');
      card2.appendChild(header2);
      card2.appendChild(bodyChild3);

      container.appendChild(card1);
      container.appendChild(card2);

      container.querySelectorAll = (sel) => {
        if (sel.includes('.reorder-card')) return [card1, card2];
        return [];
      };

      const mockDoc = {
        querySelector: (sel) => (sel === '#mainContainer' ? container : null),
        getElementById: (id) => (id === 'card1' ? card1 : id === 'card2' ? card2 : null),
        createElement: (tag) => createMockElement(tag),
      };

      const mockWin = {
        document: mockDoc,
        localStorage: mockStorage,
        addEventListener: () => {},
      };

      const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
      const app = fn(mockWin, mockDoc, mockStorage);

      const mgr = app.initCardLayoutManager({
        container: container,
        cardSelector: '.reorder-card',
        storageKey: 'test.layout.v1',
        defaultCollapsed: ['card1'],
        defaultOrder: ['card2', 'card1'],
      });

      assert.ok(mgr, 'initCardLayoutManager must return manager object');
      // Verify card1 defaulted to collapsed, hiding ALL its non-header children
      assert.ok(bodyChild1.classList.contains('card-collapsed-hidden'), 'child 1 of card1 must be collapsed');
      assert.ok(bodyChild2.classList.contains('card-collapsed-hidden'), 'child 2 of card1 must also be collapsed');
      // Verify card2 is not collapsed
      assert.ok(!bodyChild3.classList.contains('card-collapsed-hidden'), 'card2 child must not be collapsed');

      // Toggle card1 open
      mgr.toggleCard('card1');
      assert.ok(!bodyChild1.classList.contains('card-collapsed-hidden'), 'child 1 of card1 must be expanded');
      assert.ok(!bodyChild2.classList.contains('card-collapsed-hidden'), 'child 2 of card1 must also be expanded');

      // Test collapseAll
      mgr.collapseAll();
      assert.ok(mgr.areAllCollapsed(), 'all cards must be reported collapsed');
      assert.ok(bodyChild1.classList.contains('card-collapsed-hidden'));
      assert.ok(bodyChild2.classList.contains('card-collapsed-hidden'));
      assert.ok(bodyChild3.classList.contains('card-collapsed-hidden'));

      // Test expandAll
      mgr.expandAll();
      assert.ok(mgr.areAllExpanded(), 'all cards must be reported expanded');
      assert.ok(!bodyChild1.classList.contains('card-collapsed-hidden'));
      assert.ok(!bodyChild2.classList.contains('card-collapsed-hidden'));
      assert.ok(!bodyChild3.classList.contains('card-collapsed-hidden'));

      // Test toggleAll
      mgr.toggleAll(); // since all are expanded, should collapse all
      assert.ok(mgr.areAllCollapsed(), 'toggleAll from expanded must collapse all');
      mgr.toggleAll(); // since all are collapsed, should expand all
      assert.ok(mgr.areAllExpanded(), 'toggleAll from collapsed must expand all');
    });
  });

  describe('MoneyApp.generateExecutiveDossier (Phase 65 Wealth Dossier)', () => {
    const { MoneyApp } = createEnvironment();

    it('synthesizes full multi-domain financial state into executive summary', () => {
      const sampleData = {
        dashboardState: {
          netWorth: 2500000,
          assets: 3000000,
          debts: 500000,
          monthlySavings: 35000,
          runway: 12.5,
          financialHealthScore: 88,
          emergencyFund: 600000,
        },
        portfolioState: {
          totalValue: 1800000,
          monthlyBudget: 25000,
        },
        debtState: {
          totalDebt: 500000,
          monthlyPayment: 20000,
          monthsToFreedom: 28,
          strategy: 'avalanche',
        },
        taxBaseState: {
          totalIncome: 1200000,
          totalDeductions: 400000,
          netTax: 75000,
          withholding50Tawi: 90000,
        },
        insuranceState: {
          totalNeed: 3000000,
          existingCoverage: 2000000,
          protectionGap: 1000000,
        },
        retire3bState: {
          bucket1: 600000,
          bucket2: 1200000,
          bucket3: 2000000,
          ssoPension: 7500,
        },
        glidepathState: {
          equityPct: 75,
        },
        isMasked: false,
      };

      const res = MoneyApp.generateExecutiveDossier(sampleData);
      assert.ok(res.timestamp);
      assert.equal(res.isMasked, false);

      // Summary
      assert.equal(res.summary.netWorth, 2500000);
      assert.equal(res.summary.grossAssets, 3000000);
      assert.equal(res.summary.totalDebts, 500000);
      assert.equal(res.summary.solvencyRatioPct, 83.3);
      assert.equal(res.summary.runwayMonths, 12.5);
      assert.equal(res.summary.healthScore, 88);

      // Pillars
      assert.equal(res.pillars.runway.status, 'healthy');
      assert.equal(res.pillars.investments.portfolioValue, 1800000);
      assert.equal(res.pillars.investments.monthlyDca, 25000);
      assert.equal(res.pillars.investments.glidepathEquityPct, 75);
      assert.equal(res.pillars.debts.monthsToFreedom, 28);
      assert.equal(res.pillars.debts.isDebtFree, false);
      assert.equal(res.pillars.insurance.protectionGap, 1000000);
      assert.equal(res.pillars.insurance.adequacyPct, 67);
      assert.equal(res.pillars.tax.refundOrPayable, 15000); // 90000 - 75000 = 15000 refund
      assert.equal(res.pillars.retirement.monthlySsoPension, 7500);
    });

    it('gracefully handles missing or empty states with safe defaults', () => {
      const res = MoneyApp.generateExecutiveDossier({});
      assert.ok(res.summary);
      assert.equal(res.summary.netWorth, 0);
      assert.equal(res.summary.totalDebts, 0);
      assert.equal(res.summary.solvencyRatioPct, 100); // 0 debt = 100% solvent
      assert.equal(res.pillars.debts.isDebtFree, true);
      assert.equal(res.pillars.runway.status, 'critical');
    });

    it('formats masked amounts when privacy mode is active', () => {
      assert.equal(MoneyApp.formatMaskedAmount(150000, true), '฿ ••••••');
      assert.equal(MoneyApp.formatMaskedAmount(150000, true, 'THB'), 'THB ••••••');
      assert.equal(MoneyApp.formatMaskedAmount(150000, false), '150,000');
      assert.equal(MoneyApp.formatMaskedAmount(150000, false, 'บาท'), '150,000 บาท');
    });
  });

  describe('MoneyApp.calculateThaiEFilingWorksheet (Phase 66 ภ.ง.ด. 90/91 e-Filing)', () => {
    const { MoneyApp } = createEnvironment();

    it('correctly maps 40(1) salary, deductions, and computes tax refund', () => {
      const res = MoneyApp.calculateThaiEFilingWorksheet({
        salary: 50000, // 600,000/yr
        bonus: 100000, // total 40(1) = 700,000
        pvd: 35000,
        sso: 9000,
        lifeInsurance: 50000,
        thaiEsg: 50000,
        taxWithheld50Tawi: 40000,
      });

      assert.equal(res.income401, 700000);
      assert.equal(res.statutoryExpenseDeduction, 100000); // 50% max 100k
      assert.equal(res.incomeAfterExpense, 600000);

      // Deductions: Group A = 60,000. Group B = 9,000 (sso) + 50,000 (life) + 35,000 (pvd) + 50,000 (thaiEsg) = 144,000
      assert.equal(res.deductions.groupA, 60000);
      assert.equal(res.deductions.groupB, 144000);
      assert.equal(res.deductions.totalDeductions, 204000);

      // Net Taxable = 600,000 - 204,000 = 396,000
      assert.equal(res.netTaxableIncome, 396000);

      // Tax brackets:
      // 0 - 150k @ 0% = 0
      // 150k - 300k @ 5% = 7,500
      // 300k - 396k @ 10% (96,000 * 0.10) = 9,600
      // Total tax = 17,100
      assert.equal(res.grossCalculatedTax, 17100);
      assert.equal(res.taxBracketPct, 10);

      // 50 Tawi withheld = 40,000 -> Refund = 40,000 - 17,100 = 22,900
      assert.equal(res.taxWithheld50Tawi, 40000);
      assert.equal(res.netTaxDueOrRefund, 22900);
      assert.equal(res.isRefund, true);
      assert.equal(res.isPayable, false);
    });

    it('handles additional tax payable and 3-month installment calculation', () => {
      const res = MoneyApp.calculateThaiEFilingWorksheet({
        salary: 100000, // 1,200,000/yr
        bonus: 300000, // total 40(1) = 1,500,000
        taxWithheld50Tawi: 50000, // under-withheld
      });

      assert.equal(res.income401, 1500000);
      assert.equal(res.isPayable, true);
      assert.ok(res.netTaxDueOrRefund < 0);
      assert.ok(res.canInstallment); // payable >= 3000
      assert.ok(res.installment3Months > 0);
    });

    it('calculates Section 40(4)(b) dividend tax credit offset correctly', () => {
      const res = MoneyApp.calculateThaiEFilingWorksheet({
        salary: 30000, // 360,000
        dividend404b: 100000,
        dividendCitRate: 0.2,
        applyDividendCredit: true,
        taxWithheld50Tawi: 10000,
      });

      // Credit = 100,000 * (0.20 / 0.80) = 25,000
      assert.equal(res.dividendCredit, 25000);
      assert.ok(res.totalAssessableIncome > res.income401);
    });
  });

  describe('MoneyApp.calculateIncomeShockStressTest (Phase 67 Income Shock Stress-Tester)', () => {
    const { MoneyApp } = createEnvironment();

    it('models sudden layoff shock with Section 33 unemployment and severance buffer', () => {
      const res = MoneyApp.calculateIncomeShockStressTest({
        liquidReserve: 120000,
        severanceBuffer: 60000, // total 180,000
        monthlyNeeds: 18000,
        monthlyWants: 12000,
        monthlyDebtService: 7000,
        shockType: 'layoff', // 7,500/mo for 6 months
      });

      assert.equal(res.totalAvailableLiquidity, 180000);
      assert.equal(res.barebonesMonthlyExpense, 25000); // 18000 + 7000
      assert.equal(res.standardMonthlyExpense, 37000); // 18000 + 12000 + 7000
      assert.equal(res.ssoMonthlyBenefit, 7500);
      assert.equal(res.ssoBenefitMonths, 6);

      // Barebones without SSO: 180,000 / 25,000 = 7.2 months
      assert.equal(res.scenarios.barebones.runwayMonths, 7.2);

      // Standard without SSO: 180,000 / 37,000 = 4.9 months
      assert.equal(res.scenarios.standard.runwayMonths, 4.9);

      // With SSO Layoff Benefit:
      // First 6 mos: drain = 25,000 - 7,500 = 17,500/mo * 6 = 105,000 spent
      // Remainder at month 6 = 180,000 - 105,000 = 75,000
      // Months 7+: drain = 25,000/mo -> 75,000 / 25,000 = 3.0 mos
      // Total with SSO = 6 + 3.0 = 9.0 mos
      assert.equal(res.scenarios.withSsoOffset.runwayMonths, 9.0);
      assert.equal(res.scenarios.withSsoOffset.extendedMonths, 1.8);
      assert.equal(res.riskLevel, 'moderate'); // >= 6 months
      assert.ok(Array.isArray(res.liquidityLadder));
      assert.equal(res.liquidityLadder.length, 4);
      assert.equal(res.liquidityLadder[0].step, 1);
    });

    it('evaluates critical risk when reserves are low under total shock scenario', () => {
      const res = MoneyApp.calculateIncomeShockStressTest({
        liquidReserve: 30000,
        severanceBuffer: 0,
        monthlyNeeds: 20000,
        monthlyWants: 5000,
        monthlyDebtService: 5000,
        shockType: 'total_shock',
      });

      assert.equal(res.barebonesMonthlyExpense, 25000);
      assert.equal(res.scenarios.barebones.runwayMonths, 1.2);
      assert.equal(res.riskLevel, 'critical'); // < 3 months
    });

    it('gracefully handles zero or missing parameters without throwing', () => {
      const res = MoneyApp.calculateIncomeShockStressTest({});
      assert.ok(res.scenarios);
      assert.equal(res.totalAvailableLiquidity, 0);
      assert.equal(res.scenarios.barebones.runwayMonths, 0);
    });
  });

  describe('MoneyApp.calculateChildEducationFund (Phase 68 Child Education Sinking Fund)', () => {
    const { MoneyApp } = createEnvironment();

    it('calculates Thai public university pathway with inflation and monthly sinking fund DCA', () => {
      const res = MoneyApp.calculateChildEducationFund({
        currentAge: 3,
        targetAge: 18, // 15 years to college
        educationTrack: 'thai_public', // 60,000 THB/yr
        tuitionInflationRate: 5.0, // 5%
        expectedInvestmentReturn: 6.0, // 6%
        existingEducationSavings: 50000,
        degreeDurationYears: 4,
      });

      assert.equal(res.yearsToCollege, 15);
      assert.equal(res.baseAnnualTuition, 60000);
      assert.equal(res.yearlyProjections.length, 4);

      // Total future tuition > present base * 4 (due to inflation compounding)
      assert.ok(res.totalFutureTuitionNeeded > 60000 * 4);

      // Future value of 50,000 over 15 years at 6% = 50,000 * 1.06^15 ~ 119,828
      assert.ok(res.fvExistingSavings > 100000);
      assert.ok(res.netFundShortfall > 0);
      assert.ok(res.monthlyDcaNeeded > 0);
      assert.ok(res.fundedRatioPct > 0 && res.fundedRatioPct < 100);
    });

    it('models international overseas pathway with high tuition and zero existing savings', () => {
      const res = MoneyApp.calculateChildEducationFund({
        currentAge: 8,
        targetAge: 18, // 10 years to college
        educationTrack: 'inter_overseas', // 1,800,000 THB/yr
        tuitionInflationRate: 5.0,
        expectedInvestmentReturn: 7.0,
        existingEducationSavings: 0,
        degreeDurationYears: 4,
      });

      assert.equal(res.yearsToCollege, 10);
      assert.equal(res.existingSavings, 0);
      assert.equal(res.fvExistingSavings, 0);
      assert.equal(res.netFundShortfall, res.totalFutureTuitionNeeded);
      assert.equal(res.fundedRatioPct, 0);
      assert.ok(res.monthlyDcaNeeded > 0);
    });

    it('handles zero years to college (child already at target age)', () => {
      const res = MoneyApp.calculateChildEducationFund({
        currentAge: 18,
        targetAge: 18,
        educationTrack: 'bilingual',
        existingEducationSavings: 0,
      });

      assert.equal(res.yearsToCollege, 0);
      assert.equal(res.monthlyDcaNeeded, res.netFundShortfall);
    });

    it('gracefully handles missing or empty parameters without throwing', () => {
      const res = MoneyApp.calculateChildEducationFund({});
      assert.ok(res.totalFutureTuitionNeeded >= 0);
      assert.ok(Array.isArray(res.yearlyProjections));
      assert.equal(res.yearlyProjections.length, 4);
    });
  });

  describe('MoneyApp QR Sync & Chunking Engine (Phase 69 Encrypted Offline QR Sync)', () => {
    const { MoneyApp } = createEnvironment();

    it('generates valid SVG QR code string with crispEdges and proper viewBox', () => {
      const svg = MoneyApp.generateQrSvg('https://crossoverall.github.io/money-superapp/', {
        size: 200,
        margin: 2,
      });

      assert.ok(typeof svg === 'string');
      assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
      assert.ok(svg.includes('viewBox="0 0 '));
      assert.ok(svg.includes('width="200"'));
      assert.ok(svg.includes('height="200"'));
      assert.ok(svg.includes('<rect width="100%" height="100%" fill="#ffffff"/>'));
      assert.ok(svg.includes('<g fill="#000000">'));
      assert.ok(svg.includes('</svg>'));
    });

    it('splits large payloads into structured sequential chunks', () => {
      const payload = 'TEST_VAULT_PAYLOAD_'.repeat(20); // 380 chars
      const chunks = MoneyApp.chunkPayload(payload, 100, 'test_transfer_123');

      assert.equal(chunks.length, 4);
      assert.equal(chunks[0].c, 1);
      assert.equal(chunks[0].t, 4);
      assert.equal(chunks[0].id, 'test_transfer_123');
      assert.equal(chunks[3].c, 4);
    });

    it('reassembles complete chunk set back into original payload', () => {
      const payload = 'ENCRYPTED_VAULT_CIPHERTEXT_1234567890'.repeat(15);
      const chunks = MoneyApp.chunkPayload(payload, 150, 'session_abc');

      // Shuffle chunks to simulate random scanning order
      const shuffled = chunks.slice().reverse();
      const res = MoneyApp.assembleChunks(shuffled);

      assert.equal(res.complete, true);
      assert.equal(res.received, chunks.length);
      assert.equal(res.total, chunks.length);
      assert.deepEqual(res.missing, []);
      assert.equal(res.payload, payload);
    });

    it('detects incomplete chunk sets and reports missing chunk indexes', () => {
      const chunks = [
        { c: 1, t: 3, d: 'part1', id: 'session_xyz' },
        { c: 3, t: 3, d: 'part3', id: 'session_xyz' },
      ];

      const res = MoneyApp.assembleChunks(chunks);
      assert.equal(res.complete, false);
      assert.equal(res.received, 2);
      assert.equal(res.total, 3);
      assert.deepEqual(res.missing, [2]);
      assert.equal(res.payload, null);
    });

    it('gracefully handles empty or invalid inputs', () => {
      const emptySvg = MoneyApp.generateQrSvg('');
      assert.ok(emptySvg.includes('<svg'));

      const emptyChunks = MoneyApp.chunkPayload('', 100);
      assert.equal(emptyChunks.length, 1);

      const invalidAssemble = MoneyApp.assembleChunks([]);
      assert.equal(invalidAssemble.complete, false);
    });
  });

  describe('MoneyApp App Lock & Cryptographic PIN Engine (Phase 70 Biometric / PIN Lock)', () => {
    const { MoneyApp } = createEnvironment();

    it('generates random hex salt strings of specified byte length', () => {
      const salt16 = MoneyApp.generateSalt(16);
      assert.equal(typeof salt16, 'string');
      assert.equal(salt16.length, 32); // 16 bytes = 32 hex chars

      const salt32 = MoneyApp.generateSalt(32);
      assert.equal(salt32.length, 64); // 32 bytes = 64 hex chars

      // Distinct calls produce different random values
      const saltA = MoneyApp.generateSalt(16);
      const saltB = MoneyApp.generateSalt(16);
      assert.notEqual(saltA, saltB);
    });

    it('hashes PIN with salt and verifies matching vs non-matching PINs', async () => {
      const pin = '123456';
      const salt = MoneyApp.generateSalt(16);

      const hash = await MoneyApp.hashPin(pin, salt);
      assert.ok(typeof hash === 'string');
      assert.ok(hash.length >= 8);

      const isMatch = await MoneyApp.verifyPin('123456', salt, hash);
      assert.equal(isMatch, true);

      const isWrong = await MoneyApp.verifyPin('654321', salt, hash);
      assert.equal(isWrong, false);

      const isWrongSalt = await MoneyApp.verifyPin('123456', 'diff_salt', hash);
      assert.equal(isWrongSalt, false);
    });

    it('formats auto-lock timeouts into bilingual human readable text', () => {
      assert.equal(MoneyApp.formatAppLockTimeout(0, 'th'), 'ล็อกทันทีเมื่อสลับหน้าต่าง');
      assert.equal(MoneyApp.formatAppLockTimeout(0, 'en'), 'Immediately when switching apps');

      assert.equal(MoneyApp.formatAppLockTimeout(60, 'th'), '1 นาที');
      assert.equal(MoneyApp.formatAppLockTimeout(60, 'en'), '1 minute');

      assert.equal(MoneyApp.formatAppLockTimeout(300, 'th'), '5 นาที (แนะนำ)');
      assert.equal(MoneyApp.formatAppLockTimeout(300, 'en'), '5 minutes (Recommended)');

      assert.equal(MoneyApp.formatAppLockTimeout(-1, 'th'), 'ไม่ล็อกอัตโนมัติ (ล็อกด้วยตนเองเท่านั้น)');
      assert.equal(MoneyApp.formatAppLockTimeout(-1, 'en'), 'Never (Manual lock only)');
    });

    it('safely throws on invalid or empty PIN input', async () => {
      await assert.rejects(async () => {
        await MoneyApp.hashPin('', 'salt');
      });

      await assert.rejects(async () => {
        await MoneyApp.hashPin(null, 'salt');
      });

      const badVerify = await MoneyApp.verifyPin('', '', '');
      assert.equal(badVerify, false);
    });
  });

  describe('MoneyApp Retirement Ceiling Pool & Pre-Flight Checklist (Phase 74 Section 47 Warning)', () => {
    it('exports calculateRetirementCeilingPool and calculates pools accurately', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.calculateRetirementCeilingPool, 'function');

      const safe = MoneyApp.calculateRetirementCeilingPool({ pvd: 150000, rmf: 100000 });
      assert.equal(safe.totalRaw, 250000);
      assert.equal(safe.effectiveTotal, 250000);
      assert.equal(safe.excess, 0);
      assert.equal(safe.headroom, 250000);
      assert.equal(safe.status, 'safe');
      assert.equal(safe.isExceeded, false);

      const warn = MoneyApp.calculateRetirementCeilingPool({ pvd: 250000, ssf: 180000 });
      assert.equal(warn.totalRaw, 430000);
      assert.equal(warn.status, 'warning');
      assert.equal(warn.headroom, 70000);

      const overflow = MoneyApp.calculateRetirementCeilingPool({ pvd: 350000, rmf: 200000, ssf: 50000 });
      assert.equal(overflow.totalRaw, 600000);
      assert.equal(overflow.effectiveTotal, 500000);
      assert.equal(overflow.excess, 100000);
      assert.equal(overflow.headroom, 0);
      assert.equal(overflow.status, 'exceeded');
      assert.equal(overflow.isExceeded, true);
    });

    it('exports evaluateEFilingPreFlightChecklist and evaluates checklist state', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.evaluateEFilingPreFlightChecklist, 'function');

      const empty = MoneyApp.evaluateEFilingPreFlightChecklist({ checks: {} });
      assert.equal(empty.completedCount, 0);
      assert.equal(empty.completionPct, 0);
      assert.equal(empty.isReady, false);

      const ready = MoneyApp.evaluateEFilingPreFlightChecklist({
        checks: {
          doc50Tawi: true,
          pool500k: true,
          thaiEsg: true,
          consentRd: true,
          promptPayCitizen: true,
        },
        retirementPool: { isExceeded: false },
      });
      assert.equal(ready.completedCount, 5);
      assert.equal(ready.completionPct, 100);
      assert.equal(ready.isReady, true);
      assert.equal(ready.hasRetirementExcess, false);

      const blockedByExcess = MoneyApp.evaluateEFilingPreFlightChecklist({
        checks: {
          doc50Tawi: true,
          pool500k: true,
          thaiEsg: true,
          consentRd: true,
          promptPayCitizen: true,
        },
        retirementPool: { isExceeded: true, excess: 50000 },
      });
      assert.equal(blockedByExcess.isReady, false);
      assert.equal(blockedByExcess.hasRetirementExcess, true);
    });

    it('calculateThaiEFilingWorksheet automatically embeds retirementPool in return object', () => {
      const { MoneyApp } = createEnvironment('th');
      const ws = MoneyApp.calculateThaiEFilingWorksheet({
        salary: 50000,
        pvd: 50000,
        rmf: 100000,
      });
      assert.ok(ws.retirementPool, 'Worksheet must embed retirementPool');
      assert.equal(ws.retirementPool.totalRaw, 150000);
      assert.equal(ws.retirementPool.effectiveTotal, 150000);
      assert.equal(ws.retirementPool.isExceeded, false);
    });
  });

  describe('MoneyApp Debt Payoff & Visual Velocity Engine (Phase 75 Snowball vs Avalanche)', () => {
    it('exports simulateDebtPayoff and accurately models minimum payments and rollover', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.simulateDebtPayoff, 'function');

      const debts = [
        { id: 'cc', name: 'Credit Card', balance: 50000, rate: 16, minPayment: 2500 },
        { id: 'loan', name: 'Personal Loan', balance: 100000, rate: 12, minPayment: 3000 },
      ];

      const simAv = MoneyApp.simulateDebtPayoff(debts, 5000, 'avalanche');
      assert.ok(simAv.months > 0, 'Months must be greater than zero');
      assert.ok(simAv.totalInterest > 0, 'Total interest must be calculated');
      assert.equal(simAv.payoffOrder.length, 2, 'Both debts must be paid off');
      // Credit card has higher rate (16%), so Avalanche pays Credit Card first
      assert.equal(simAv.payoffOrder[0].id, 'cc');
      assert.equal(simAv.firstDebtCleared.name, 'Credit Card');
    });

    it('exports compareDebtVelocity and models head-to-head metrics and recommendations', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.compareDebtVelocity, 'function');

      const debts = [
        { id: 'd1', name: 'Micro Loan', balance: 10000, rate: 8, minPayment: 200 },
        { id: 'd2', name: 'High APR Card', balance: 15000, rate: 28, minPayment: 300 },
      ];

      const cmp = MoneyApp.compareDebtVelocity({
        debts,
        extraPayment: 3000,
      });

      assert.ok(cmp.baseline.months > cmp.avalanche.months, 'Extra payment must accelerate payoff vs baseline');
      assert.ok(cmp.avalanche.totalInterest <= cmp.snowball.totalInterest, 'Avalanche interest must be <= Snowball');
      // In Snowball, Micro Loan (10k) clears earlier than High APR Card
      assert.equal(cmp.snowball.payoffOrder[0].id, 'd1');
      assert.equal(cmp.avalanche.payoffOrder[0].id, 'd2');
      assert.ok(cmp.firstWinMonthDelta > 0, 'Snowball should achieve the first win earlier than Avalanche');
      assert.ok(['avalanche', 'snowball', 'equal'].includes(cmp.recommended));
      assert.ok(cmp.reasonTh.length > 0);
      assert.ok(cmp.reasonEn.length > 0);
    });

    it('gracefully handles empty debts and zero balances', () => {
      const { MoneyApp } = createEnvironment('th');
      const empty = MoneyApp.compareDebtVelocity({ debts: [], extraPayment: 5000 });
      assert.equal(empty.avalanche.months, 0);
      assert.equal(empty.snowball.months, 0);
      assert.equal(empty.recommended, 'equal');
    });
  });

  describe('MoneyApp Tax Accrual & Refund Windfall Bridge (Phase 76)', () => {
    it('correctly calculates monthly accrual and installment metrics for tax payable', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.calculateTaxAccrualAndRefundPlan, 'function');

      const planPayable = MoneyApp.calculateTaxAccrualAndRefundPlan({
        calculatedTax: 45000,
        withheldTax: 30000,
      });

      assert.equal(planPayable.status, 'payable');
      assert.equal(planPayable.amount, 15000);
      assert.equal(planPayable.monthlyAccrual, 1250); // 15,000 / 12
      assert.equal(planPayable.canInstallment, true); // >= 3000
      assert.equal(planPayable.installmentAmount, 5000); // 15,000 / 3
      assert.equal(planPayable.recommendedWindfall, 0);
    });

    it('correctly models refund windfall for debt payoff and rebalancing', () => {
      const { MoneyApp } = createEnvironment('th');
      const planRefund = MoneyApp.calculateTaxAccrualAndRefundPlan({
        calculatedTax: 12000,
        withheldTax: 36000,
      });

      assert.equal(planRefund.status, 'refund');
      assert.equal(planRefund.amount, 24000);
      assert.equal(planRefund.monthlyAccrual, 0);
      assert.equal(planRefund.canInstallment, false);
      assert.equal(planRefund.recommendedWindfall, 24000);
    });

    it('handles exact tax balance and edge case zero inputs without throwing', () => {
      const { MoneyApp } = createEnvironment('th');
      const balanced = MoneyApp.calculateTaxAccrualAndRefundPlan({
        calculatedTax: 20000,
        withheldTax: 20000,
      });
      assert.equal(balanced.status, 'balanced');
      assert.equal(balanced.amount, 0);
      assert.equal(balanced.monthlyAccrual, 0);

      const empty = MoneyApp.calculateTaxAccrualAndRefundPlan({});
      assert.equal(empty.status, 'balanced');
      assert.equal(empty.amount, 0);
    });
  });

  describe('MoneyApp Debt Consolidation & Refinance Simulator (Phase 77)', () => {
    it('correctly calculates optimal refinancing with cash flow relief and interest savings', () => {
      const { MoneyApp } = createEnvironment('th');
      assert.equal(typeof MoneyApp.calculateDebtConsolidation, 'function');

      const debts = [
        { balance: 60000, rate: 18, minPayment: 2500 },
        { balance: 40000, rate: 24, minPayment: 2000 },
      ];
      // Total balance: 100,000. Total min: 4,500. Weighted rate: (60k*18 + 40k*24)/100k = 20.4%
      // Refinance at 9.9% for 36 months:
      // monthly payment ~ 3,222.
      // monthlyPaymentDiff = 4500 - 3222 = +1,278 (cash flow relief)
      const res = MoneyApp.calculateDebtConsolidation({
        debts,
        currentTotalInterest: 35000,
        currentTotalMinPayment: 4500,
        refinanceRate: 9.9,
        refinanceTermMonths: 36,
      });

      assert.equal(res.totalBalance, 100000);
      assert.equal(res.weightedRate, 20.4);
      assert.equal(res.refinanceTermMonths, 36);
      assert.ok(res.newMonthlyPayment > 3000 && res.newMonthlyPayment < 3500);
      assert.ok(res.monthlyPaymentDiff > 1000, 'monthly payment diff should be positive');
      assert.ok(res.interestSaved > 0, 'interest saved should be positive');
      assert.equal(res.verdict, 'optimal');
    });

    it('correctly detects faster payoff when new term shortens and payment increases', () => {
      const { MoneyApp } = createEnvironment('th');
      const debts = [{ balance: 100000, rate: 18, minPayment: 3000 }];
      // 12 months at 9.9% -> payment ~ 8,787 > 3,000 min payment
      const res = MoneyApp.calculateDebtConsolidation({
        debts,
        currentTotalInterest: 40000,
        currentTotalMinPayment: 3000,
        refinanceRate: 9.9,
        refinanceTermMonths: 12,
      });

      assert.ok(res.monthlyPaymentDiff < 0, 'payment should increase (diff < 0)');
      assert.ok(res.interestSaved > 0, 'interest saved should be positive');
      assert.equal(res.verdict, 'faster_payoff');
    });

    it('correctly detects higher interest when refinancing rate or term causes loss', () => {
      const { MoneyApp } = createEnvironment('th');
      const debts = [{ balance: 50000, rate: 8, minPayment: 2000 }];
      // Refinance at 25% for 60 months
      const res = MoneyApp.calculateDebtConsolidation({
        debts,
        currentTotalInterest: 5000,
        currentTotalMinPayment: 2000,
        refinanceRate: 25,
        refinanceTermMonths: 60,
      });

      assert.ok(res.interestSaved <= 0, 'interest saved should be negative or zero');
      assert.equal(res.verdict, 'higher_interest');
    });

    it('gracefully handles empty debts and zero balance without throwing', () => {
      const { MoneyApp } = createEnvironment('th');
      const empty = MoneyApp.calculateDebtConsolidation({ debts: [] });
      assert.equal(empty.totalBalance, 0);
      assert.equal(empty.newMonthlyPayment, 0);
      assert.equal(empty.interestSaved, 0);
      assert.equal(empty.monthlyPaymentDiff, 0);
      assert.equal(empty.verdict, 'no_debt');

      const nullInput = MoneyApp.calculateDebtConsolidation(null);
      assert.equal(nullInput.verdict, 'no_debt');
    });
  });

  describe('MoneyApp.calculateTaxBracketStepDown (Phase 79)', () => {
    it('correctly handles tax-free income (<= 150,000 THB)', () => {
      const { MoneyApp } = createEnvironment('th');
      const res = MoneyApp.calculateTaxBracketStepDown(120000);
      assert.equal(res.netTaxableIncome, 120000);
      assert.equal(res.currentRate, 0);
      assert.equal(res.currentRatePct, 0);
      assert.equal(res.isTaxFree, true);
      assert.equal(res.amountToStepDown, 0);
      assert.equal(res.taxSavedAtStepDown, 0);
      assert.equal(res.amountToTaxFree, 0);
      assert.equal(res.totalCurrentTax, 0);
    });

    it('correctly calculates step-down metrics for 620,000 THB (15% bracket -> 10% bracket)', () => {
      const { MoneyApp } = createEnvironment('th');
      const res = MoneyApp.calculateTaxBracketStepDown(620000);
      assert.equal(res.netTaxableIncome, 620000);
      assert.equal(res.currentRate, 0.15);
      assert.equal(res.currentRatePct, 15);
      assert.equal(res.currentTierIndex, 3);
      assert.equal(res.isTaxFree, false);
      assert.equal(res.lowerThreshold, 500000);
      assert.equal(res.nextLowerRate, 0.1);
      assert.equal(res.nextLowerRatePct, 10);
      assert.equal(res.amountToStepDown, 120000); // 620k - 500k
      assert.equal(res.taxSavedAtStepDown, 18000); // 120k * 15%
      assert.equal(res.stepDownRoiPct, 15);
      assert.equal(res.amountToTaxFree, 470000); // 620k - 150k
      // 0-150k: 0, 150k-300k (150k*5%=7.5k), 300k-500k (200k*10%=20k), 500k-620k (120k*15%=18k) = 45.5k
      assert.equal(res.totalCurrentTax, 45500);
      assert.equal(res.taxSavedToTaxFree, 45500);
      assert.equal(res.progressInCurrentTierPct, 48); // 120k / 250k = 48%
    });

    it('correctly calculates step-down for high bracket (> 5,000,000 THB at 35%)', () => {
      const { MoneyApp } = createEnvironment('th');
      const res = MoneyApp.calculateTaxBracketStepDown(6000000);
      assert.equal(res.currentRate, 0.35);
      assert.equal(res.currentRatePct, 35);
      assert.equal(res.lowerThreshold, 5000000);
      assert.equal(res.nextLowerRate, 0.3);
      assert.equal(res.amountToStepDown, 1000000);
      assert.equal(res.taxSavedAtStepDown, 350000);
      assert.equal(res.stepDownRoiPct, 35);
    });

    it('gracefully handles empty, negative, or invalid inputs', () => {
      const { MoneyApp } = createEnvironment('th');
      const resZero = MoneyApp.calculateTaxBracketStepDown(0);
      assert.equal(resZero.isTaxFree, true);
      assert.equal(resZero.amountToStepDown, 0);

      const resNeg = MoneyApp.calculateTaxBracketStepDown(-50000);
      assert.equal(resNeg.isTaxFree, true);
      assert.equal(resNeg.netTaxableIncome, 0);

      const resNull = MoneyApp.calculateTaxBracketStepDown(null);
      assert.equal(resNull.isTaxFree, true);
      assert.equal(resNull.netTaxableIncome, 0);
    });
  });

  describe('MoneyApp.formatExecutiveDossierSummaryText (Phase 80 Native Share Summary)', () => {
    const { MoneyApp } = createEnvironment('th');

    const sampleDossier = MoneyApp.generateExecutiveDossier({
      dashboardState: {
        netWorth: 2500000,
        assets: 3000000,
        debts: 500000,
        monthlyExpenses: 40000,
        monthlySavings: 20000,
        emergencyFund: 240000,
        runway: 6,
        investments: 1200000,
      },
      debtState: {
        totalDebt: 500000,
        monthsToFreedom: 24,
        strategy: 'avalanche',
      },
      insuranceState: {
        totalNeed: 3000000,
        existingCoverage: 2000000,
        protectionGap: 1000000,
      },
      taxBaseState: {
        netTax: 75000,
        withholding50Tawi: 90000,
      },
    });

    it('formats unmasked executive summary with 6 pillars in Thai', () => {
      const text = MoneyApp.formatExecutiveDossierSummaryText(sampleDossier, { isMasked: false, lang: 'th' });
      assert.ok(text.includes('📋 Money Superapp — แฟ้มสรุปการเงินฉบับผู้บริหาร'));
      assert.ok(text.includes('ความมั่งคั่งสุทธิ: 2,500,000 บาท'));
      assert.ok(text.includes('หนี้สินรวม: 500,000 บาท'));
      assert.ok(text.includes('เงินสำรองฉุกเฉิน: 240,000 บาท (6 เดือน)'));
      assert.ok(text.includes('AVALANCHE'));
      assert.ok(text.includes('ขอคืน: 15,000 บาท'));
      assert.ok(text.includes('ความเป็นส่วนตัวสมบูรณ์'));
    });

    it('masks numbers with •••••• when isMasked is true', () => {
      const text = MoneyApp.formatExecutiveDossierSummaryText(sampleDossier, { isMasked: true, lang: 'th' });
      assert.ok(text.includes('ความมั่งคั่งสุทธิ: ฿ ••••••'));
      assert.ok(text.includes('เงินสำรองฉุกเฉิน: ฿ ••••••'));
      assert.ok(!text.includes('2,500,000'));
      assert.ok(!text.includes('240,000'));
    });

    it('formats executive summary in English when lang is en', () => {
      const text = MoneyApp.formatExecutiveDossierSummaryText(sampleDossier, { isMasked: false, lang: 'en' });
      assert.ok(text.includes('📋 Money Superapp — Executive Financial Dossier'));
      assert.ok(text.includes('Net Worth: 2,500,000 THB'));
      assert.ok(text.includes('Total Debts: 500,000 THB'));
      assert.ok(text.includes('Refund: 15,000 THB'));
    });

    it('returns empty string for null or undefined dossier', () => {
      assert.equal(MoneyApp.formatExecutiveDossierSummaryText(null), '');
      assert.equal(MoneyApp.formatExecutiveDossierSummaryText(undefined), '');
    });
  });

  describe('MoneyApp.validateShareTargetPayload (Phase 80 Web Share Target)', () => {
    const { MoneyApp } = createEnvironment('th');

    it('correctly identifies .vault and encrypted vault JSON payload', () => {
      const resVaultFile = MoneyApp.validateShareTargetPayload({
        name: 'backup-2026.vault',
        content: 'raw_encrypted_bytes',
      });
      assert.equal(resVaultFile.isValid, true);
      assert.equal(resVaultFile.kind, 'vault');

      const resVaultJson = MoneyApp.validateShareTargetPayload({
        name: 'shared.json',
        content: JSON.stringify({ format: 'money-superapp-vault-v1', data: 'xyz' }),
      });
      assert.equal(resVaultJson.isValid, true);
      assert.equal(resVaultJson.kind, 'vault');
    });

    it('correctly identifies backup JSON payload', () => {
      const resBackup = MoneyApp.validateShareTargetPayload({
        name: 'backup.json',
        content: JSON.stringify({ appName: 'Money Superapp', data: { 'moneySuperapp.key': 'val' } }),
      });
      assert.equal(resBackup.isValid, true);
      assert.equal(resBackup.kind, 'backup');
    });

    it('correctly identifies Thai bank statements', () => {
      const kbankCsv = 'Date,Description,Withdrawal,Deposit,Balance\n2026-10-01,Salary,,50000,100000';
      const resKbank = MoneyApp.validateShareTargetPayload({
        name: 'kbank_statement.csv',
        content: kbankCsv,
      });
      assert.equal(resKbank.isValid, true);
      assert.equal(resKbank.kind, 'statement');
      assert.equal(resKbank.bankCode, 'kbank');
    });

    it('correctly identifies generic CSV statement and plain text', () => {
      const genericCsv = 'Item,Amount\nGroceries,1500\nUtilities,800';
      const resCsv = MoneyApp.validateShareTargetPayload({
        name: 'expenses.csv',
        content: genericCsv,
      });
      assert.equal(resCsv.isValid, true);
      assert.equal(resCsv.kind, 'statement');

      const resText = MoneyApp.validateShareTargetPayload({
        name: 'note.txt',
        content: 'Remember to pay electricity bill by Friday',
      });
      assert.equal(resText.isValid, true);
      assert.equal(resText.kind, 'text');
    });

    it('rejects empty or missing payload safely', () => {
      assert.equal(MoneyApp.validateShareTargetPayload(null).isValid, false);
      assert.equal(MoneyApp.validateShareTargetPayload({}).isValid, false);
      assert.equal(MoneyApp.validateShareTargetPayload({ content: '   ' }).isValid, false);
    });
  });

  describe('MoneyApp.calculateTermLifePremiumEstimate (Phase 81 Insurance Gap Bridge)', () => {
    const { MoneyApp } = createEnvironment('th');

    it('accurately estimates annual and monthly term life premiums for a 1M gap', () => {
      const res = MoneyApp.calculateTermLifePremiumEstimate(1000000);
      assert.equal(res.hasShortfall, true);
      assert.equal(res.coverageGap, 1000000);
      assert.equal(res.annualPremium, 3000);
      assert.equal(res.monthlyPremium, 250);
      assert.equal(res.potentialTaxSavings, 0);
      assert.equal(res.netAnnualCost, 3000);
      assert.equal(res.netMonthlyCost, 250);
    });

    it('accounts for marginal tax deduction savings under Section 47', () => {
      const res = MoneyApp.calculateTermLifePremiumEstimate(2500000, { marginalTaxRate: 15 });
      assert.equal(res.hasShortfall, true);
      assert.equal(res.coverageGap, 2500000);
      assert.equal(res.annualPremium, 7500); // 2.5 * 3,000
      assert.equal(res.monthlyPremium, 625); // 7,500 / 12
      assert.equal(res.potentialTaxSavings, 1125); // 7,500 * 15%
      assert.equal(res.netAnnualCost, 6375); // 7,500 - 1,125
      assert.equal(res.netMonthlyCost, 531); // 6,375 / 12 round
      assert.equal(res.marginalTaxRate, 15);
    });

    it('caps Section 47 tax deduction savings at the statutory 100,000 THB ceiling', () => {
      // 40M coverage gap -> 40 * 3,000 = 120,000 THB annual premium
      const res = MoneyApp.calculateTermLifePremiumEstimate(40000000, { marginalTaxRate: 20 });
      assert.equal(res.annualPremium, 120000);
      assert.equal(res.monthlyPremium, 10000);
      // Tax deduction capped at 100,000 -> 100,000 * 20% = 20,000 THB
      assert.equal(res.potentialTaxSavings, 20000);
      assert.equal(res.netAnnualCost, 100000);
      assert.equal(res.netMonthlyCost, 8333);
    });

    it('respects custom benchmark rate per million', () => {
      const res = MoneyApp.calculateTermLifePremiumEstimate(3000000, { ratePerMillion: 2000 });
      assert.equal(res.annualPremium, 6000);
      assert.equal(res.monthlyPremium, 500);
    });

    it('applies a minimum 100 THB monthly floor for small coverage gaps', () => {
      const res = MoneyApp.calculateTermLifePremiumEstimate(100000);
      assert.equal(res.annualPremium, 300);
      assert.equal(res.monthlyPremium, 100); // floored at 100
    });

    it('returns zero values when coverage gap is zero, negative, or invalid', () => {
      const resZero = MoneyApp.calculateTermLifePremiumEstimate(0);
      assert.equal(resZero.hasShortfall, false);
      assert.equal(resZero.annualPremium, 0);
      assert.equal(resZero.monthlyPremium, 0);

      const resNeg = MoneyApp.calculateTermLifePremiumEstimate(-500000);
      assert.equal(resNeg.hasShortfall, false);
      assert.equal(resNeg.coverageGap, 0);

      const resNull = MoneyApp.calculateTermLifePremiumEstimate(null);
      assert.equal(resNull.hasShortfall, false);
      assert.equal(resNull.coverageGap, 0);
    });
  });
});
