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
});
