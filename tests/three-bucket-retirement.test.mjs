import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
const engineCode = readFileSync(resolve(__dirname, '../js/engines/retirement-buckets.js'), 'utf8');

function createEnvironment() {
  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: '', dataset: {} },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
  };

  const fn = new Function(
    'window',
    'document',
    'localStorage',
    `${engineCode}; ${sharedCode}; return window.MoneyApp;`,
  );
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp };
}

describe('MoneyApp.calculateRetirementThreeBuckets (3-Bucket Retirement Cash Flow)', () => {
  const { MoneyApp } = createEnvironment();
  const { calculateRetirementThreeBuckets } = MoneyApp;

  it('correctly calculates 3-bucket allocation and Social Security offset', () => {
    // Annual living expense: 360,000 THB (30k/mo)
    // SSO Pension: 4,125 THB/mo (49,500/yr), Elderly Allowance: 600 THB/mo (7,200/yr) -> Total Guaranteed: 56,700/yr
    // Net Drawdown: 360,000 - 56,700 = 303,300 THB/yr
    // Total Assets: 6,000,000 THB
    // Bucket 1 (2 yrs cash): 303,300 * 2 = 606,600 THB
    // Bucket 2 (5 yrs bonds): 303,300 * 5 = 1,516,500 THB
    // Bucket 3 (Equities): 6,000,000 - 606,600 - 1,516,500 = 3,876,900 THB
    const res = calculateRetirementThreeBuckets({
      annualLivingExpense: 360000,
      monthlySsoPension: 4125,
      monthlyElderlyAllowance: 600,
      totalRetirementAssets: 6000000,
      bucket1Years: 2,
      bucket2Years: 5,
      bucket1YieldPct: 1.5,
      bucket2YieldPct: 3.5,
      bucket3YieldPct: 7.0,
    });

    assert.equal(res.annualLivingExpense, 360000);
    assert.equal(res.annualGuaranteedIncome, 56700);
    assert.equal(res.netAnnualDrawdown, 303300);
    assert.equal(res.bucket1Target, 606600);
    assert.equal(res.bucket2Target, 1516500);
    assert.equal(res.bucket3Target, 3876900);
    assert.equal(res.bearMarketRunwayYears, 7); // 2 + 5 years
    assert.ok(res.guaranteedIncomeCoveragePct > 15);
  });

  it('handles scenario where guaranteed pension fully covers living expenses (zero net drawdown)', () => {
    const res = calculateRetirementThreeBuckets({
      annualLivingExpense: 60000, // 5k/mo
      monthlySsoPension: 5000, // 60k/yr
      monthlyElderlyAllowance: 1000, // 12k/yr
      totalRetirementAssets: 2000000,
    });

    assert.equal(res.netAnnualDrawdown, 0);
    assert.equal(res.bucket1Target, 0);
    assert.equal(res.bucket2Target, 0);
    assert.equal(res.bucket3Target, 2000000);
    assert.equal(res.guaranteedIncomeCoveragePct, 120);
  });

  it('detects asset shortfall when total assets are less than Bucket 1 + Bucket 2 targets', () => {
    const res = calculateRetirementThreeBuckets({
      annualLivingExpense: 600000, // 50k/mo
      monthlySsoPension: 0,
      monthlyElderlyAllowance: 0,
      totalRetirementAssets: 1000000, // Only 1M
      bucket1Years: 2, // Needs 1.2M
      bucket2Years: 5, // Needs 3.0M
    });

    assert.equal(res.netAnnualDrawdown, 600000);
    assert.equal(res.bucket1Target, 1200000);
    assert.equal(res.bucket2Target, 3000000);
    assert.equal(res.bucket3Target, 0);
    assert.equal(res.isUnderfunded, true);
    assert.equal(res.shortfallAmount, 3200000);
  });

  it('computes blended portfolio yield and annual yield cash flow', () => {
    const res = calculateRetirementThreeBuckets({
      annualLivingExpense: 300000,
      monthlySsoPension: 0,
      monthlyElderlyAllowance: 0,
      totalRetirementAssets: 10000000,
      bucket1Years: 2, // 600,000 @ 1.5% = 9,000
      bucket2Years: 4, // 1,200,000 @ 3.5% = 42,000
      bucket1YieldPct: 1.5,
      bucket2YieldPct: 3.5,
      bucket3YieldPct: 7.0, // 8,200,000 @ 7.0% = 574,000
    });

    // Total yield cash flow = 9,000 + 42,000 + 574,000 = 625,000 THB/yr
    assert.equal(res.annualYieldCashFlow, 625000);
    assert.equal(res.blendedYieldPct, 6.25);
    // Yield cash flow (625k) > annual living expense (300k) -> Sustainable purely from yield!
    assert.equal(res.isYieldSelfSustaining, true);
  });

  it('gracefully handles empty, negative, or invalid inputs', () => {
    const res = calculateRetirementThreeBuckets({});
    assert.equal(res.annualLivingExpense, 0);
    assert.equal(res.netAnnualDrawdown, 0);
    assert.equal(res.bucket1Target, 0);
    assert.equal(res.bucket2Target, 0);
    assert.equal(res.bucket3Target, 0);
  });
});
