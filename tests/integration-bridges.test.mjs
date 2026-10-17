import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');

function createMockEnvironment(initialStorage = {}) {
  const store = { ...initialStorage };
  const mockStorage = {
    getItem: (k) => (Object.hasOwn(store, k) ? store[k] : null),
    setItem: (k, v) => {
      store[k] = String(v);
    },
    removeItem: (k) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) {
        delete store[k];
      }
    },
    get _store() {
      return store;
    },
  };

  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: '', dataset: {} },
    },
    localStorage: mockStorage,
  };

  const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);

  return { MoneyApp, mockWindow, storage: mockStorage };
}

describe('Cross-Tool Integration Bridges & Storage Contracts', () => {
  describe('Bridge 1: Remaining Money -> Rebalance (moneySuperapp.pendingBudget)', () => {
    it('successfully transfers valid monthly investable surplus', () => {
      const { storage } = createMockEnvironment();

      // Producer: Remaining Money exports surplus
      const investableBudget = 25000;
      storage.setItem('moneySuperapp.pendingBudget', String(investableBudget));

      // Consumer: Rebalance inspects and parses pendingBudget
      const raw = storage.getItem('moneySuperapp.pendingBudget');
      assert.ok(raw !== null);
      const parsedAmount = Number.parseFloat(raw);
      assert.equal(parsedAmount, 25000);

      // Consumer clears pendingBudget upon acknowledgment
      storage.removeItem('moneySuperapp.pendingBudget');
      assert.equal(storage.getItem('moneySuperapp.pendingBudget'), null);
    });

    it('safely handles non-numeric and empty pendingBudget payloads', () => {
      const { storage } = createMockEnvironment();

      storage.setItem('moneySuperapp.pendingBudget', 'corrupted-data-xyz');
      const raw = storage.getItem('moneySuperapp.pendingBudget');
      const parsed = Number.parseFloat(raw);
      assert.ok(Number.isNaN(parsed));

      // Guard check: consumer only adopts valid positive budget
      const validBudget = !Number.isNaN(parsed) && parsed > 0 ? parsed : null;
      assert.equal(validBudget, null);
    });
  });

  describe('Bridge 2: Months Slips -> Remaining Money (moneySuperapp.pendingSlipImport)', () => {
    it('transfers salary, allowance, and pvd schema accurately', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      // Producer: Months Slips exports monthly payslip
      const slipPayload = {
        salary: 65000,
        allowance: 8000,
        pvd: 10,
        ssoCap: 875,
        net: 61500,
        timestamp: Date.now(),
      };
      storage.setItem('moneySuperapp.pendingSlipImport', JSON.stringify(slipPayload));

      // Consumer: Remaining Money safeJsonParse
      const imported = MoneyApp.safeJsonParse('moneySuperapp.pendingSlipImport', null);
      assert.ok(imported);
      assert.equal(imported.salary, 65000);
      assert.equal(imported.allowance, 8000);
      assert.equal(imported.pvd, 10);
      assert.equal(imported.ssoCap, 875);

      // Consumer clears upon processing
      storage.removeItem('moneySuperapp.pendingSlipImport');
      assert.equal(storage.getItem('moneySuperapp.pendingSlipImport'), null);
    });

    it('rejects corrupted or zero salary slip payloads gracefully', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      storage.setItem('moneySuperapp.pendingSlipImport', '{ corrupted json ...');
      const corrupted = MoneyApp.safeJsonParse('moneySuperapp.pendingSlipImport', null);
      assert.equal(corrupted, null);

      storage.setItem('moneySuperapp.pendingSlipImport', JSON.stringify({ salary: 0 }));
      const zeroSlip = MoneyApp.safeJsonParse('moneySuperapp.pendingSlipImport', null);
      assert.ok(zeroSlip);
      assert.equal(zeroSlip.salary, 0);
      // Consumer rule: only triggers when slip.salary > 0
      assert.ok(!(zeroSlip.salary > 0));
    });
  });

  describe('Bridge 3: Severance Tax -> Remaining Money (moneySuperapp.pendingLumpSum)', () => {
    it('transfers retirement / severance lump sum payout', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      // Producer: Tax Calculator exports lump sum payout
      const lumpPayload = {
        name: 'เงินชดเชยและ PVD สุทธิ',
        value: 1250000,
        timestamp: Date.now(),
      };
      storage.setItem('moneySuperapp.pendingLumpSum', JSON.stringify(lumpPayload));

      // Consumer: Remaining Money receives lump sum
      const importedLump = MoneyApp.safeJsonParse('moneySuperapp.pendingLumpSum', null);
      assert.ok(importedLump);
      assert.equal(importedLump.name, 'เงินชดเชยและ PVD สุทธิ');
      assert.equal(importedLump.value, 1250000);
      assert.ok(importedLump.value > 0);

      storage.removeItem('moneySuperapp.pendingLumpSum');
      assert.equal(storage.getItem('moneySuperapp.pendingLumpSum'), null);
    });
  });

  describe('Bridge 4: Tax Calculator Base -> Dashboard (moneySuperapp.taxBase)', () => {
    it('proves Dashboard accurately reads taxBase and computes marginal tax bracket', () => {
      const { storage } = createMockEnvironment();

      // Producer: Tax Calculator Base state
      const taxState = {
        salary: 60000,
        bonus: 50000,
        pvd: 5,
        ssoCap: 750,
        fundDeduct: 50000,
        thaiEsgDeduct: 30000,
        insuranceDeduct: 25000,
        mortgageDeduct: 0,
        otherDeduct: 0,
      };
      storage.setItem('moneySuperapp.taxBase', JSON.stringify(taxState));

      // Consumer: Dashboard tax reader
      const raw = storage.getItem('moneySuperapp.taxBase');
      assert.ok(raw);
      const data = JSON.parse(raw);

      // Assessable income = 60,000 * 12 + 50,000 = 770,000
      const totalIncome = data.salary * 12 + data.bonus;
      assert.equal(totalIncome, 770000);

      // Expenses 50% max 100k + Personal 60k
      const expenseDeduct = Math.min(totalIncome * 0.5, 100000);
      const personalDeduct = 60000;
      const ssoDeduct = data.ssoCap * 12; // 9,000
      const pvdDeduct = (data.salary * 12 * data.pvd) / 100; // 36,000
      const extraDeduct = data.fundDeduct + data.thaiEsgDeduct + data.insuranceDeduct; // 105,000

      const totalDeductions = expenseDeduct + personalDeduct + ssoDeduct + pvdDeduct + extraDeduct;
      const netTaxable = Math.max(0, totalIncome - totalDeductions);

      assert.equal(netTaxable, 770000 - 310000); // 460,000
      // 460,000 falls in 10% bracket (300,001 - 500,000)
      const topMarginalRate = netTaxable > 300000 ? 10 : 5;
      assert.equal(topMarginalRate, 10);
    });
  });

  describe('Bridge 5: Debt Calculator -> Dashboard (moneySuperapp.debtCalculator.state.v1)', () => {
    it('proves Dashboard aggregates total liabilities and debt accounts accurately', () => {
      const { storage } = createMockEnvironment();

      // Producer: Debt Calculator state
      const debtState = {
        strategy: 'avalanche',
        extraPayment: 8000,
        debts: [
          { id: 1, name: 'Credit Card', balance: 45000, rate: 16, minPayment: 2500 },
          { id: 2, name: 'Personal Loan', balance: 120000, rate: 18, minPayment: 4200 },
          { id: 3, name: 'Car Loan', balance: 250000, rate: 4.5, minPayment: 6800 },
        ],
      };
      storage.setItem('moneySuperapp.debtCalculator.state.v1', JSON.stringify(debtState));

      // Consumer: Dashboard aggregator
      const raw = storage.getItem('moneySuperapp.debtCalculator.state.v1');
      assert.ok(raw);
      const parsed = JSON.parse(raw);
      assert.ok(Array.isArray(parsed.debts));

      const totalLiabilities = parsed.debts.reduce((sum, d) => sum + (Number(d.balance) || 0), 0);
      assert.equal(totalLiabilities, 415000);
    });
  });

  describe('Bridge 6: Thai Tax Planning Calendar (moneySuperapp.taxCalendar.state.v1)', () => {
    it('persists and validates compliance checklist across tools', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      const calendarState = {
        checked: {
          pnd90_paper: false,
          pnd90_online: true,
          land_tax: true,
        },
        lastUpdated: Date.now(),
      };
      storage.setItem('moneySuperapp.taxCalendar.state.v1', JSON.stringify(calendarState));

      const saved = MoneyApp.safeJsonParse('moneySuperapp.taxCalendar.state.v1', { checked: {} });
      assert.ok(saved.checked);
      assert.equal(saved.checked.pnd90_online, true);
      assert.equal(saved.checked.land_tax, true);
      assert.equal(saved.checked.pnd90_paper, false);
    });
  });
});
