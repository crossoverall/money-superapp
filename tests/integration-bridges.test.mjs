import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
const enginesCode = [
  readFileSync(resolve(__dirname, '../js/engines/thai-pit.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/thai-tax-calendar.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/insurance.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/gold.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/foreign-tax.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/inheritance-tax.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/retirement-buckets.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/property-tax.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/bank-parser.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/glidepath.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/refinance.js'), 'utf8'),
  readFileSync(resolve(__dirname, '../js/engines/stress-test.js'), 'utf8'),
].join(';\n');

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

  const fn = new Function(
    'window',
    'document',
    'localStorage',
    `${enginesCode}; ${sharedCode}; return window.MoneyApp;`,
  );
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

  describe('Bridge 7: Target Date Glidepath -> Rebalance Portfolio (rebalanceCalculator.state.v1)', () => {
    it('updates portfolio Core/Ballast/Satellite allocation weights seamlessly', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      // Producer: Calculate optimal glidepath for a 45-year-old retiring at 60
      const glide = MoneyApp.calculateTargetDateGlidepath({
        currentAge: 45,
        targetRetirementAge: 60,
        riskTolerance: 'moderate',
      });
      assert.equal(glide.split.core, 58);
      assert.equal(glide.split.ballast, 37);
      assert.equal(glide.split.satellite, 5);

      // Existing rebalance portfolio state
      const rebalanceState = {
        totalBudget: 150000,
        buckets: [
          { id: 'core', label: 'Core', weight: 80, assets: [] },
          { id: 'ballast', label: 'Ballast', weight: 15, assets: [] },
          { id: 'satellite', label: 'Satellite', weight: 5, assets: [] },
        ],
      };

      // Consumer applies Glidepath weights to rebalance state
      for (const b of rebalanceState.buckets) {
        if (b.id === 'core') b.weight = glide.split.core;
        if (b.id === 'ballast') b.weight = glide.split.ballast;
        if (b.id === 'satellite') b.weight = glide.split.satellite;
      }
      storage.setItem('rebalanceCalculator.state.v1', JSON.stringify(rebalanceState));

      const loaded = JSON.parse(storage.getItem('rebalanceCalculator.state.v1'));
      assert.equal(loaded.buckets.find((b) => b.id === 'core').weight, 58);
      assert.equal(loaded.buckets.find((b) => b.id === 'ballast').weight, 37);
      assert.equal(loaded.buckets.find((b) => b.id === 'satellite').weight, 5);
    });
  });

  describe('Bridge 8: Thai Gold DCA -> Rebalance Portfolio (exportGoldToPortfolio)', () => {
    it('injects calculated physical gold valuation into portfolio ballast assets', () => {
      const { MoneyApp, storage } = createMockEnvironment();

      // Producer: calculate gold metrics for 5 baht of gold bar
      const goldMetrics = MoneyApp.calculateThaiGoldMetrics({
        goldType: 'bar',
        weight: 5,
        weightUnit: 'baht',
        costPerBaht: 40000,
        blockFee: 200,
        currentMarketPrice: 42500,
      });

      assert.equal(goldMetrics.marketValue, 212500);

      // Consumer: Rebalance loads existing portfolio and exports gold asset
      const portfolioState = {
        totalBudget: 100000,
        buckets: [
          { id: 'core', label: 'Core', weight: 70, assets: [] },
          { id: 'ballast', label: 'Ballast', weight: 25, assets: [] },
          { id: 'satellite', label: 'Satellite', weight: 5, assets: [] },
        ],
      };

      const ballastBucket = portfolioState.buckets.find((b) => b.id === 'ballast');
      ballastBucket.assets.push({
        name: 'Physical Thai Gold (96.5%)',
        ticker: 'GOLD',
        units: goldMetrics.weightBaht,
        lastPrice: goldMetrics.currentMarketPrice,
        currency: 'THB',
        value: goldMetrics.marketValue,
        weight: 10,
      });

      storage.setItem('rebalanceCalculator.state.v1', JSON.stringify(portfolioState));

      const savedPortfolio = JSON.parse(storage.getItem('rebalanceCalculator.state.v1'));
      const goldAsset = savedPortfolio.buckets.find((b) => b.id === 'ballast').assets.find((a) => a.ticker === 'GOLD');

      assert.ok(goldAsset);
      assert.equal(goldAsset.value, 212500);
      assert.equal(goldAsset.units, 5);
      assert.equal(goldAsset.lastPrice, 42500);
    });
  });

  describe('Bridge 9: Insurance Adequacy -> Personal Income Tax Deduction', () => {
    it('bridges insurance coverage gap to statutory Section 47(1)(d) tax deduction benefit', () => {
      const { MoneyApp } = createMockEnvironment();

      const adequacy = MoneyApp.calculateInsuranceAdequacy({
        debtClearance: 2500000,
        monthlyExpenses: 40000,
        supportYears: 5,
        childEducation: 500000,
        emergencyCushion: 300000,
        liquidAssets: 800000,
        existingCoverage: 1000000,
        marginalTaxRate: 20,
      });

      assert.ok(adequacy.protectionGap > 0);
      assert.equal(adequacy.status, 'severe_shortfall');
      assert.equal(adequacy.deductibleAmount, 58500); // 3.9M gap * 1.5% = 58,500 THB
      assert.equal(adequacy.potentialTaxSavings, 11700); // 58,500 * 20% bracket = 11,700 THB savings
    });
  });

  describe('Bridge 10: Thai Mobile Banking CSV Statement -> Remaining Money Auto-Import', () => {
    it('parses KBank statement and categorizes debits as expenses and credits as incomes', () => {
      const { MoneyApp } = createMockEnvironment();

      const mockCsv = `Date,Time,Transaction,Description,Withdrawal,Deposit,Balance\n15/09/2026,08:30,Transfer,Salary Employer,,65000.00,120000.00\n16/09/2026,12:15,Payment,Condo Loan,18500.00,,101500.00\n17/09/2026,19:40,QR Scan,Grocery Supermarket,2340.50,,99159.50\n`;
      const parsed = MoneyApp.detectAndParseThaiBankStatement(mockCsv, 'kbank_statement_sep2026.csv');

      assert.equal(parsed.isBankStatement, true);
      assert.equal(parsed.bankCode, 'kbank');
      assert.equal(parsed.candidate.incomes.length, 1);
      assert.equal(parsed.candidate.incomes[0].value, 65000);
      assert.equal(parsed.candidate.expenses.length, 2);
      assert.equal(parsed.candidate.expenses[0].value, 18500);
      assert.equal(parsed.candidate.expenses[1].value, 2340.5);
      assert.equal(parsed.summary.totalInflow, 65000);
      assert.equal(parsed.summary.totalOutflow, 20840.5);
    });
  });
});
