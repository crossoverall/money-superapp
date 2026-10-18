import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadFinancialHealth() {
  const code = readFileSync(resolve('js/engines/financial-health.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    Number,
    parseFloat: Number.parseFloat,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.FinancialHealth;
}

test('FinancialHealth engine exports cleanly to MoneyApp namespace', () => {
  const fh = loadFinancialHealth();
  assert.ok(fh, 'FinancialHealth should be defined');
  assert.equal(typeof fh.calculateFinancialHealthScore, 'function');
  assert.equal(typeof fh.generateNextBestMoves, 'function');
  assert.equal(typeof fh.calculateRadarCoordinates, 'function');
  assert.equal(typeof fh.renderRadarChartSVG, 'function');
  assert.equal(typeof fh.calculateNetWorthComposition, 'function');
});

test('calculateFinancialHealthScore computes 5-pillar scores and tier correctly', () => {
  const fh = loadFinancialHealth();

  // Test 1: Excellent tier
  const excellent = fh.calculateFinancialHealthScore({
    runwayMonths: 6.0,
    savingsRatePct: 50.0,
    debt: 0,
    assets: 5000000,
    netWorth: 5000000,
    fireTarget: 5000000,
    taxDeductionsUtilizedPct: 100,
  });
  assert.equal(excellent.compositeScore, 100);
  assert.equal(excellent.tier, 'excellent');
  assert.equal(excellent.pillars.runway, 100);
  assert.equal(excellent.pillars.savings, 100);
  assert.equal(excellent.pillars.debt, 100);
  assert.equal(excellent.pillars.wealth, 100);
  assert.equal(excellent.pillars.tax, 100);

  // Test 2: Critical tier (runway 0, savings 0, high debt, low assets)
  const critical = fh.calculateFinancialHealthScore({
    runwayMonths: 0.5,
    savingsRatePct: 5,
    debt: 1000000,
    assets: 200000,
    netWorth: -800000,
    taxDeductionsUtilizedPct: 20,
  });
  assert.ok(critical.compositeScore < 50, `Composite score ${critical.compositeScore} should be < 50`);
  assert.equal(critical.tier, 'critical');
  assert.equal(critical.pillars.debt, 0); // debt > assets -> debt score 0

  // Test 3: Solid tier (65 <= compositeScore < 80)
  const solid = fh.calculateFinancialHealthScore({
    runwayMonths: 4.5, // 75
    savingsRatePct: 35, // 70
    debt: 200000,
    assets: 1000000, // debt/asset = 0.2 -> debt score = 80
    netWorth: 800000,
    targetNetWorth: 1200000, // 800k/1.2M -> 67
    taxDeductionsUtilizedPct: 70, // 70
  });
  assert.ok(solid.compositeScore >= 65 && solid.compositeScore < 80);
  assert.equal(solid.tier, 'solid');
});

test('generateNextBestMoves returns ranked recommendations up to max 3 items', () => {
  const fh = loadFinancialHealth();

  // Profile with emergency runway shortfall (< 3 months) and high debt drag
  const profileCritical = {
    runwayMonths: 1.2,
    totalDebt: 500000,
    savingsRate: 10,
    topMarginalRate: 10,
    monthlyInvest: 0,
    monthlyExpense: 30000,
  };
  const healthCritical = fh.calculateFinancialHealthScore({
    runwayMonths: 1.2,
    savingsRatePct: 10,
    debt: 500000,
    assets: 100000,
  });

  const movesTh = fh.generateNextBestMoves(profileCritical, healthCritical, false, (v) => `${v.toLocaleString()} ฿`);
  assert.ok(movesTh.length <= 3);
  assert.equal(movesTh[0].priority, 1);
  assert.equal(movesTh[0].id, 'runway-shortfall');
  assert.equal(movesTh[1].priority, 1);
  assert.equal(movesTh[1].id, 'debt-drag');
  assert.equal(movesTh[2].priority, 2);
  assert.equal(movesTh[2].id, 'savings-boost');

  // Verify English locale bilingual strings
  const movesEn = fh.generateNextBestMoves(profileCritical, healthCritical, true, (v) => `${v.toLocaleString()} ฿`);
  assert.equal(movesEn[0].badge, 'Priority 1 (Defense)');
  assert.equal(movesEn[0].title, 'Build Emergency Liquid Reserve');
  assert.equal(movesEn[0].actionLabel, 'Allocate Cash Flow ➔');

  // Profile with strong foundations: triggers DCA and wealth resilience
  const profileStrong = {
    runwayMonths: 8.0,
    totalDebt: 0,
    savingsRate: 40,
    topMarginalRate: 20,
    monthlyInvest: 25000,
    monthlyExpense: 40000,
  };
  const healthStrong = fh.calculateFinancialHealthScore({
    runwayMonths: 8.0,
    savingsRatePct: 40,
    debt: 0,
    assets: 3000000,
    netWorth: 3000000,
    fireTarget: 5000000,
    taxDeductionsUtilizedPct: 80,
  });
  const movesStrong = fh.generateNextBestMoves(profileStrong, healthStrong, true, (v) => `${v.toLocaleString()} ฿`);
  assert.ok(movesStrong.some((m) => m.id === 'deploy-dca'));
  assert.ok(movesStrong.some((m) => m.id === 'wealth-resilience'));
});

test('calculateRadarCoordinates produces correct polygon points and axes trigonometry', () => {
  const fh = loadFinancialHealth();
  const pillars = {
    runway: 100,
    savings: 80,
    debt: 60,
    wealth: 40,
    tax: 20,
  };

  const coords = fh.calculateRadarCoordinates(pillars, { centerX: 150, centerY: 130, maxR: 85, isEn: true });
  assert.equal(coords.gridRings.length, 4);
  assert.equal(coords.spokes.length, 5);
  assert.equal(coords.pointCoordinates.length, 5);

  // First axis (runway) is at angle -PI/2 (top: x = 150, y = centerY - maxR = 130 - 85 = 45)
  const runwayPt = coords.pointCoordinates[0];
  assert.equal(runwayPt.key, 'runway');
  assert.equal(runwayPt.label, 'Runway');
  assert.equal(runwayPt.x, 150);
  assert.equal(runwayPt.y, 45);

  // Polygon string should contain 5 pairs of coordinates
  const pts = coords.dataPointsString.split(' ');
  assert.equal(pts.length, 5);
});

test('calculateNetWorthComposition calculates asset breakdowns and solvency ratios', () => {
  const fh = loadFinancialHealth();

  const profile = {
    emergencyReserve: 300000, // 30%
    portfolioVal: 500000, // 50%
    goldVal: 200000, // 20%
    totalDebt: 200000, // 20% debt ratio
    netWorth: 800000, // 80% solvency ratio
  };

  const comp = fh.calculateNetWorthComposition(profile);
  assert.equal(comp.grossAssets, 1000000);
  assert.equal(comp.cashPct, 30);
  assert.equal(comp.investPct, 50);
  assert.equal(comp.goldPct, 20);
  assert.equal(comp.debtRatio, 20);
  assert.equal(comp.solvencyRatio, 80);

  // Edge case: Insolvent (0 assets, debt > 0)
  const insolvent = fh.calculateNetWorthComposition({
    emergencyReserve: 0,
    portfolioVal: 0,
    goldVal: 0,
    totalDebt: 100000,
    netWorth: -100000,
  });
  assert.equal(insolvent.grossAssets, 0);
  assert.equal(insolvent.debtRatio, 100);
  assert.equal(insolvent.solvencyRatio, -100);
});

test('renderRadarChartSVG safely updates DOM mock elements without throwing', () => {
  const fh = loadFinancialHealth();

  const mockElements = {
    gridGroup: { innerHTML: '' },
    spokesGroup: { innerHTML: '' },
    polyEl: {
      points: '',
      setAttribute(attr, val) {
        if (attr === 'points') this.points = val;
      },
    },
    pointsGroup: { innerHTML: '' },
    labelsGroup: { innerHTML: '' },
  };

  const pillars = { runway: 60, savings: 70, debt: 80, wealth: 90, tax: 100 };
  fh.renderRadarChartSVG(mockElements, pillars, { isEn: false });

  assert.ok(mockElements.gridGroup.innerHTML.includes('<polygon points='));
  assert.ok(mockElements.spokesGroup.innerHTML.includes('<line x1='));
  assert.ok(mockElements.labelsGroup.innerHTML.includes('<text x='));
  assert.ok(mockElements.polyEl.points.length > 0);
  assert.ok(mockElements.pointsGroup.innerHTML.includes('<circle cx='));
});
