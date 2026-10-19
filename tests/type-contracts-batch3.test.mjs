import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadBatch3Engines() {
  const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
  const thaiPitCode = readFileSync(resolve(__dirname, '../js/engines/thai-pit.js'), 'utf8');
  const glidepathCode = readFileSync(resolve(__dirname, '../js/engines/glidepath.js'), 'utf8');
  const budgetImportCode = readFileSync(resolve(__dirname, '../js/engines/budget-import.js'), 'utf8');
  const cashflowVizCode = readFileSync(resolve(__dirname, '../js/engines/cashflow-viz.js'), 'utf8');
  const financialHealthCode = readFileSync(resolve(__dirname, '../js/engines/financial-health.js'), 'utf8');
  const i18nCoreCode = readFileSync(resolve(__dirname, '../js/engines/i18n-core.js'), 'utf8');
  const rebalanceSubtoolsCode = readFileSync(resolve(__dirname, '../js/engines/rebalance-subtools.js'), 'utf8');
  const taxWorksheetCode = readFileSync(resolve(__dirname, '../js/engines/tax-worksheet.js'), 'utf8');

  const storageMap = new Map();
  const mockStorage = {
    getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear(),
  };

  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: 'th', dataset: {} },
      getElementById: () => null,
      querySelectorAll: () => [],
    },
    localStorage: mockStorage,
    location: { pathname: '/dashboard.html' },
    navigator: {
      clipboard: {
        writeText: async () => {},
      },
    },
  };

  const script = [
    sharedCode,
    thaiPitCode,
    glidepathCode,
    budgetImportCode,
    cashflowVizCode,
    financialHealthCode,
    i18nCoreCode,
    rebalanceSubtoolsCode,
    taxWorksheetCode,
  ].join('\n;\n');

  const fn = new Function('window', 'globalThis', 'document', 'localStorage', 'location', 'navigator', script);
  fn(mockWindow, mockWindow, mockWindow.document, mockWindow.localStorage, mockWindow.location, mockWindow.navigator);

  return mockWindow;
}

describe('Pillar 6 Type Contracts Verification Suite (Core Engines Batch 3)', () => {
  const env = loadBatch3Engines();
  const MoneyApp = env.MoneyApp;

  describe('js/engines/budget-import.js Type Contracts', () => {
    it('parseCSVRows conforms to string[][] return type signature', () => {
      const csv = 'Category,Item,Amount,Note\nIncome,Salary,"60,000",Monthly\nExpense,Rent,12000,Condo';
      const rows = MoneyApp.BudgetImport.parseCSVRows(csv);

      assert.strictEqual(Array.isArray(rows), true);
      assert.strictEqual(rows.length, 3);
      assert.deepStrictEqual(rows[0], ['Category', 'Item', 'Amount', 'Note']);
      assert.deepStrictEqual(rows[1], ['Income', 'Salary', '60,000', 'Monthly']);
      assert.deepStrictEqual(rows[2], ['Expense', 'Rent', '12000', 'Condo']);
    });

    it('detectColumns conforms to BudgetDetectedColumns schema', () => {
      const header = ['หมวดหมู่', 'รายการ', 'จำนวนเงิน (บาท)', 'หมายเหตุ'];
      const cols = MoneyApp.BudgetImport.detectColumns(header);

      assert.strictEqual(typeof cols.catCol, 'number');
      assert.strictEqual(typeof cols.itemCol, 'number');
      assert.strictEqual(typeof cols.amtCol, 'number');
      assert.strictEqual(typeof cols.noteCol, 'number');
      assert.strictEqual(cols.catCol, 0);
      assert.strictEqual(cols.itemCol, 1);
      assert.strictEqual(cols.amtCol, 2);
      assert.strictEqual(cols.noteCol, 3);
    });

    it('cleanField, cleanAmount, isSubtotalRow, and getAutoType conform to type contracts', () => {
      assert.strictEqual(MoneyApp.BudgetImport.cleanField(" 'Salary "), 'Salary');
      assert.strictEqual(MoneyApp.BudgetImport.cleanAmount(" '1,250.50 THB "), 1250.5);
      assert.strictEqual(MoneyApp.BudgetImport.cleanAmount(-50), 0);
      assert.strictEqual(MoneyApp.BudgetImport.cleanAmount(NaN), 0);

      assert.strictEqual(MoneyApp.BudgetImport.isSubtotalRow('Summary', 'Total Income'), true);
      assert.strictEqual(MoneyApp.BudgetImport.isSubtotalRow('Expense', 'Internet'), false);

      assert.strictEqual(MoneyApp.BudgetImport.getAutoType({ name: 'ภาษีหัก ณ ที่จ่าย' }), 'tax');
      assert.strictEqual(MoneyApp.BudgetImport.getAutoType({ name: 'ประกันสังคม SSO' }), 'sso');
      assert.strictEqual(MoneyApp.BudgetImport.getAutoType({ name: 'กองทุนสำรองเลี้ยงชีพ PVD' }), 'pvd');
      assert.strictEqual(MoneyApp.BudgetImport.getAutoType({ name: 'ค่าน้ำค่าไฟ' }), null);
    });

    it('parseImportJSON conforms to BudgetImportCandidate schema', () => {
      const json = JSON.stringify({
        incomes: [{ name: 'เงินเดือน', value: 75000, isSalary: true }],
        expenses: [
          { name: 'ผ่อนบ้าน', value: 20000 },
          { name: 'ภาษีหัก ณ ที่จ่าย', value: 4500, auto: true },
        ],
        savings: [{ name: 'DCA S&P500', value: 15000 }],
        manualOverrides: { tax: true, sso: false, pvd: false },
        showEmergencyRunway: true,
        currentEmergencyReserve: 250000,
        pvdPercent: 5,
      });

      const res = MoneyApp.BudgetImport.parseImportJSON(json);
      assert.ok(res !== null);
      assert.strictEqual(Array.isArray(res.incomes), true);
      assert.strictEqual(Array.isArray(res.expenses), true);
      assert.strictEqual(Array.isArray(res.savings), true);
      assert.strictEqual(typeof res.manualOverrides.tax, 'boolean');
      assert.strictEqual(res.showEmergencyRunway, true);
      assert.strictEqual(res.currentEmergencyReserve, 250000);
      assert.strictEqual(res.pvdPercent, 5);
    });

    it('parseImportCSV conforms to BudgetImportCandidate schema', () => {
      const csv = 'หมวด,รายการ,จำนวน\nรายได้,เงินเดือน,65000\nรายจ่าย,ค่าไฟ,2500\nเงินออม,กองทุนรวม,10000';
      const res = MoneyApp.BudgetImport.parseImportCSV(csv);

      assert.ok(res !== null);
      assert.strictEqual(Array.isArray(res.incomes), true);
      assert.strictEqual(Array.isArray(res.expenses), true);
      assert.strictEqual(Array.isArray(res.savings), true);
      assert.ok(res.incomes.length >= 1);
      assert.ok(res.expenses.length >= 1);
      assert.ok(res.savings.length >= 1);
    });
  });

  describe('js/engines/cashflow-viz.js Type Contracts', () => {
    it('classifyBudgetType returns valid budget taxonomy', () => {
      assert.strictEqual(MoneyApp.CashflowViz.classifyBudgetType({ name: 'ค่าเช่าห้อง' }), 'need');
      assert.strictEqual(MoneyApp.CashflowViz.classifyBudgetType({ name: 'บุฟเฟต์ปิ้งย่าง' }), 'want');
      assert.strictEqual(MoneyApp.CashflowViz.classifyBudgetType({ name: 'เงินออมฉุกเฉิน' }), 'saving');
      assert.strictEqual(
        MoneyApp.CashflowViz.classifyBudgetType({ name: 'กองทุน ThaiESG', budgetType: 'saving' }),
        'saving',
      );
      assert.strictEqual(MoneyApp.CashflowViz.classifyBudgetType({ name: 'ลงทุน DCA' }), 'saving');
    });

    it('calculateBudgetRule503020 conforms to BudgetRule503020Result schema', () => {
      const res = MoneyApp.calculateBudgetRule503020({
        totalIncome: 100000,
        expenses: [
          { name: 'ค่าผ่อนบ้าน', value: 30000, budgetType: 'need' },
          { name: 'ร้านอาหาร & ช้อปปิ้ง', value: 25000, budgetType: 'want' },
        ],
        savings: [{ name: 'DCA World ETF', value: 20000 }],
        remaining: 25000,
      });

      assert.strictEqual(typeof res.needsTotal, 'number');
      assert.strictEqual(typeof res.wantsTotal, 'number');
      assert.strictEqual(typeof res.savingsTotal, 'number');
      assert.strictEqual(typeof res.needsPct, 'number');
      assert.strictEqual(typeof res.wantsPct, 'number');
      assert.strictEqual(typeof res.savingsPct, 'number');
      assert.strictEqual(typeof res.status, 'string');
      assert.strictEqual(typeof res.donut.radius, 'number');
      assert.strictEqual(typeof res.donut.circumference, 'number');
      assert.strictEqual(typeof res.donut.needsArc, 'number');
      assert.strictEqual(typeof res.donut.wantsArc, 'number');
      assert.strictEqual(typeof res.donut.savingsArc, 'number');
    });

    it('calculateEmergencyRunway conforms to EmergencyRunwayResult schema', () => {
      const res = MoneyApp.calculateEmergencyRunway({
        reserve: 180000,
        monthlyExpenses: 45000,
      });

      assert.strictEqual(typeof res.reserve, 'number');
      assert.strictEqual(typeof res.monthlyExpenses, 'number');
      assert.strictEqual(typeof res.months, 'number');
      assert.strictEqual(res.months, 4.0);
      assert.strictEqual(res.tier, 'healthy');
      assert.strictEqual(res.target3M, 135000);
      assert.strictEqual(res.target6M, 270000);
      assert.strictEqual(res.deficit6M, 90000);
    });

    it('generateSankeyRibbonPath and calculateSankeyFlows conform to SankeyFlowResult schema', () => {
      const path = MoneyApp.CashflowViz.generateSankeyRibbonPath(50, 20, 50, 200, 30, 70);
      assert.strictEqual(typeof path, 'string');
      assert.ok(path.startsWith('M 50.0 20.0'));
      assert.ok(path.endsWith('Z'));

      const flow = MoneyApp.calculateSankeyFlows({
        totalIncome: 80000,
        deductions: 5000,
        needs: 35000,
        wants: 20000,
        savings: 15000,
        remaining: 5000,
        width: 600,
        height: 240,
      });

      assert.strictEqual(typeof flow.hasData, 'boolean');
      assert.strictEqual(flow.hasData, true);
      assert.strictEqual(flow.isDeficit, false);
      assert.strictEqual(flow.deficitAmount, 0);
      assert.strictEqual(flow.totalVolume, 80000);
      assert.strictEqual(Array.isArray(flow.nodes), true);
      assert.strictEqual(Array.isArray(flow.links), true);

      for (const node of flow.nodes) {
        assert.strictEqual(typeof node.id, 'string');
        assert.strictEqual(typeof node.x, 'number');
        assert.strictEqual(typeof node.y, 'number');
        assert.strictEqual(typeof node.value, 'number');
        assert.strictEqual(typeof node.color, 'string');
      }

      for (const link of flow.links) {
        assert.strictEqual(typeof link.source, 'string');
        assert.strictEqual(typeof link.target, 'string');
        assert.strictEqual(typeof link.value, 'number');
        assert.strictEqual(typeof link.path, 'string');
      }
    });
  });

  describe('js/engines/financial-health.js Type Contracts', () => {
    it('calculateFinancialHealthScore conforms to FinancialHealthScoreResult schema', () => {
      const res = MoneyApp.calculateFinancialHealthScore({
        runwayMonths: 6,
        savingsRatePct: 25,
        debt: 200000,
        assets: 1000000,
        netWorth: 800000,
        taxDeductionsUtilizedPct: 80,
      });

      assert.strictEqual(typeof res.compositeScore, 'number');
      assert.strictEqual(typeof res.tier, 'string');
      assert.strictEqual(typeof res.pillars.runway, 'number');
      assert.strictEqual(typeof res.pillars.savings, 'number');
      assert.strictEqual(typeof res.pillars.debt, 'number');
      assert.strictEqual(typeof res.pillars.wealth, 'number');
      assert.strictEqual(typeof res.pillars.tax, 'number');
      assert.ok(res.compositeScore >= 0 && res.compositeScore <= 100);
    });

    it('generateNextBestMoves conforms to NextBestMoveItem schema', () => {
      const moves = MoneyApp.generateNextBestMoves(
        { runwayMonths: 1.5, totalDebt: 300000, savingsRate: 10, topMarginalRate: 20 },
        { pillars: { runway: 25, savings: 20, debt: 40, wealth: 50, tax: 60 } },
        true,
      );

      assert.strictEqual(Array.isArray(moves), true);
      assert.ok(moves.length > 0 && moves.length <= 3);

      for (const m of moves) {
        assert.strictEqual(typeof m.id, 'string');
        assert.strictEqual(typeof m.priority, 'number');
        assert.strictEqual(typeof m.badge, 'string');
        assert.strictEqual(typeof m.title, 'string');
        assert.strictEqual(typeof m.description, 'string');
        assert.strictEqual(typeof m.impact, 'string');
        assert.strictEqual(typeof m.actionLabel, 'string');
        assert.strictEqual(typeof m.targetTab, 'string');
      }
    });

    it('calculateRadarCoordinates and calculateNetWorthComposition conform to type schemas', () => {
      const radar = MoneyApp.FinancialHealth.calculateRadarCoordinates({
        runway: 80,
        savings: 70,
        debt: 90,
        wealth: 65,
        tax: 75,
      });

      assert.strictEqual(typeof radar.dataPointsString, 'string');
      assert.strictEqual(Array.isArray(radar.pointCoordinates), true);
      assert.strictEqual(Array.isArray(radar.gridRings), true);
      assert.strictEqual(Array.isArray(radar.spokes), true);
      assert.strictEqual(radar.spokes.length, 5);

      const nw = MoneyApp.FinancialHealth.calculateNetWorthComposition({
        emergencyReserve: 300000,
        portfolioVal: 1200000,
        goldVal: 200000,
        totalDebt: 500000,
      });

      assert.strictEqual(typeof nw.grossAssets, 'number');
      assert.strictEqual(nw.grossAssets, 1700000);
      assert.strictEqual(typeof nw.cashPct, 'number');
      assert.strictEqual(typeof nw.investPct, 'number');
      assert.strictEqual(typeof nw.goldPct, 'number');
      assert.strictEqual(typeof nw.debtRatio, 'number');
      assert.strictEqual(typeof nw.solvencyRatio, 'number');
    });
  });

  describe('js/engines/i18n-core.js Type Contracts', () => {
    it('register, getDictionary, setLanguage, and t conform to type signatures', () => {
      const I18n = MoneyApp.I18n;

      I18n.register('en', { testGreeting: 'Hello {name}!' });
      I18n.register('th', { testGreeting: 'สวัสดี {name}!' });

      I18n.setLanguage('en');
      assert.strictEqual(I18n.getLanguage(), 'en');
      assert.strictEqual(I18n.t('testGreeting', '', { name: 'Alice' }), 'Hello Alice!');

      I18n.setLanguage('th');
      assert.strictEqual(I18n.getLanguage(), 'th');
      assert.strictEqual(I18n.t('testGreeting', '', { name: 'สมชาย' }), 'สวัสดี สมชาย!');

      const dictTh = I18n.getDictionary('th');
      assert.strictEqual(typeof dictTh, 'object');
      assert.strictEqual(dictTh.testGreeting, 'สวัสดี {name}!');

      // Fallback
      assert.strictEqual(I18n.t('nonExistentKey', 'Default Fallback'), 'Default Fallback');
    });
  });

  describe('js/engines/rebalance-subtools.js Type Contracts', () => {
    it('loadGoldState, loadForeignTaxState, and loadGlidepathState conform to state schemas', () => {
      const Sub = MoneyApp.RebalanceSubtools;

      const gold = Sub.loadGoldState();
      assert.strictEqual(typeof gold.goldType, 'string');
      assert.strictEqual(typeof gold.weight, 'number');
      assert.strictEqual(typeof gold.costPerBaht, 'number');
      assert.strictEqual(Array.isArray(gold.lots), true);

      const fTax = Sub.loadForeignTaxState();
      assert.strictEqual(typeof fTax.remittanceAmount, 'number');
      assert.strictEqual(typeof fTax.daysInThailand, 'number');

      const glide = Sub.loadGlidepathState();
      assert.strictEqual(typeof glide.currentAge, 'number');
      assert.strictEqual(typeof glide.retireAge, 'number');
      assert.strictEqual(typeof glide.riskTolerance, 'string');

      const glideData = Sub.calculateGlidepathData();
      assert.strictEqual(typeof glideData.yearsToRetire, 'number');
      assert.strictEqual(typeof glideData.split.core, 'number');
      assert.strictEqual(typeof glideData.split.ballast, 'number');
      assert.strictEqual(typeof glideData.split.satellite, 'number');
    });
  });

  describe('js/engines/tax-worksheet.js Type Contracts', () => {
    it('formatReportDate conforms to timestamp formatting contract', () => {
      const testDate = new Date('2026-10-19T08:30:00Z');
      const thStr = MoneyApp.TaxWorksheet.formatReportDate(testDate, 'th');
      const enStr = MoneyApp.TaxWorksheet.formatReportDate(testDate, 'en');

      assert.strictEqual(typeof thStr, 'string');
      assert.strictEqual(typeof enStr, 'string');
      assert.ok(thStr.includes('2569')); // Buddhist Era year
      assert.ok(enStr.includes('2026')); // Gregorian year
    });

    it('TaxWorksheet exports declared UI controller interfaces', () => {
      const TW = MoneyApp.TaxWorksheet;
      assert.strictEqual(typeof TW.formatReportDate, 'function');
      assert.strictEqual(typeof TW.showCopyFeedback, 'function');
      assert.strictEqual(typeof TW.copyEFilingField, 'function');
      assert.strictEqual(typeof TW.copyAllEFilingSummary, 'function');
      assert.strictEqual(typeof TW.updateDividendTaxCreditUI, 'function');
      assert.strictEqual(typeof TW.updateEFilingWorksheetView, 'function');
      assert.strictEqual(typeof TW.updatePrintReportView, 'function');
    });
  });
});
