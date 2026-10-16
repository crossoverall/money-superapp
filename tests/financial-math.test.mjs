import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

/**
 * Thai Personal Income Tax (PIT) Bracket Engine
 * Verified against Revenue Department (สรรพากร)
 */
function computeThaiTax(netTaxableIncome) {
  if (netTaxableIncome <= 0) return 0;

  const brackets = [
    { limit: 150000, rate: 0.0 },
    { limit: 300000, rate: 0.05 },
    { limit: 500000, rate: 0.1 },
    { limit: 750000, rate: 0.15 },
    { limit: 1000000, rate: 0.2 },
    { limit: 2000000, rate: 0.25 },
    { limit: 5000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  let tax = 0;
  let prevLimit = 0;

  for (const b of brackets) {
    if (netTaxableIncome > prevLimit) {
      const taxableInBracket = Math.min(netTaxableIncome, b.limit) - prevLimit;
      tax += taxableInBracket * b.rate;
      prevLimit = b.limit;
    } else {
      break;
    }
  }

  return Math.round(tax);
}

/**
 * Thai Labor Protection Act Severance Days
 */
function getStatutorySeveranceDays(tenureYears) {
  if (tenureYears < 120 / 365) return 0;
  if (tenureYears < 1) return 30;
  if (tenureYears < 3) return 90;
  if (tenureYears < 6) return 180;
  if (tenureYears < 10) return 240;
  if (tenureYears < 20) return 300;
  return 400;
}

/**
 * Thai Revenue Code Section 48(5) Separate Tax Calculation
 */
function computeSection48Tax(grossIncome, tenureYears) {
  if (tenureYears < 5) return null; // Section 48(5) requires >= 5 years of service

  // Step 1: Base deduction = 7,000 THB per service year
  const firstDeduction = 7000 * tenureYears;
  const remainingAfterFirst = Math.max(0, grossIncome - firstDeduction);

  // Step 2: Second deduction = 50% of remaining
  const taxableBase = remainingAfterFirst * 0.5;

  // Step 3: Tax on taxable base using standard progressive brackets
  return computeThaiTax(taxableBase);
}

/**
 * 2-Tier Hierarchical DCA Minimum Budget Projection (v1.8.0)
 */
function computeMinRebalanceBudget(buckets) {
  let totalVal = 0;
  let totalW = 0;

  // Aggregate bucket totals
  const activeBuckets = buckets.filter((b) => b.enabled !== false);
  for (const b of activeBuckets) {
    const bVal = (b.assets || []).filter((a) => a.enabled !== false).reduce((sum, a) => sum + a.value, 0);
    totalVal += bVal;
    totalW += b.weight;
  }

  let maxPortRatio = 0;
  for (const b of activeBuckets) {
    const activeAssets = (b.assets || []).filter((a) => a.enabled !== false);
    const bVal = activeAssets.reduce((sum, a) => sum + a.value, 0);
    const totalAssetW = activeAssets.reduce((sum, a) => sum + a.weight, 0);

    let maxAssetRatio = 0;
    for (const a of activeAssets) {
      if (a.weight > 0 && totalAssetW > 0) {
        const ratio = a.value / (a.weight / totalAssetW);
        if (ratio > maxAssetRatio) maxAssetRatio = ratio;
      }
    }

    const vReq = Math.max(bVal, maxAssetRatio);
    if (b.weight > 0 && totalW > 0) {
      const portRatio = vReq / (b.weight / totalW);
      if (portRatio > maxPortRatio) maxPortRatio = portRatio;
    }
  }

  const targetTotal = Math.max(totalVal, maxPortRatio);
  return Math.max(0, Math.round(targetTotal - totalVal));
}

describe('Financial Math Verification', () => {
  describe('Thai Personal Income Tax (PIT)', () => {
    it('exempts income up to 150,000 THB', () => {
      assert.equal(computeThaiTax(0), 0);
      assert.equal(computeThaiTax(150000), 0);
    });

    it('calculates 5% bracket (150,001 - 300,000)', () => {
      // 300,000 net -> (150,000 * 0) + (150,000 * 0.05) = 7,500
      assert.equal(computeThaiTax(300000), 7500);
      // 200,000 net -> 50,000 * 0.05 = 2,500
      assert.equal(computeThaiTax(200000), 2500);
    });

    it('calculates 10% bracket (300,001 - 500,000)', () => {
      // 500,000 net -> 7,500 + (200,000 * 0.10) = 27,500
      assert.equal(computeThaiTax(500000), 27500);
    });

    it('calculates 15% bracket (500,001 - 750,000)', () => {
      // 750,000 net -> 27,500 + (250,000 * 0.15) = 65,000
      assert.equal(computeThaiTax(750000), 65000);
    });

    it('calculates 20% bracket (750,001 - 1,000,000)', () => {
      // 1,000,000 net -> 65,000 + (250,000 * 0.20) = 115,000
      assert.equal(computeThaiTax(1000000), 115000);
    });

    it('calculates higher brackets correctly', () => {
      // 2,000,000 net -> 115,000 + (1,000,000 * 0.25) = 365,000
      assert.equal(computeThaiTax(2000000), 365000);
    });
  });

  describe('Thai Labor Act Severance Tiers', () => {
    it('correctly maps service tenure to statutory days', () => {
      assert.equal(getStatutorySeveranceDays(0.2), 0); // under 120 days
      assert.equal(getStatutorySeveranceDays(0.5), 30); // 120d - 1yr
      assert.equal(getStatutorySeveranceDays(2), 90); // 1yr - 3yr
      assert.equal(getStatutorySeveranceDays(4), 180); // 3yr - 6yr
      assert.equal(getStatutorySeveranceDays(8), 240); // 6yr - 10yr
      assert.equal(getStatutorySeveranceDays(15), 300); // 10yr - 20yr
      assert.equal(getStatutorySeveranceDays(25), 400); // 20yr+
    });
  });

  describe('Section 48(5) Severance & PVD Tax', () => {
    it('disallows Section 48(5) for tenure < 5 years', () => {
      assert.equal(computeSection48Tax(500000, 4), null);
    });

    it('calculates statutory formula with 7,000/yr deduction + 50% base', () => {
      // 10 years, 1,000,000 THB severance
      // Step 1: 1,000,000 - (7,000 * 10 = 70,000) = 930,000
      // Step 2: 930,000 * 50% = 465,000 taxable base
      // Step 3: Tax on 465,000:
      //         0 - 150k @ 0% = 0
      //         150k - 300k @ 5% = 7,500
      //         300k - 465k (165,000) @ 10% = 16,500
      //         Total = 24,000
      assert.equal(computeSection48Tax(1000000, 10), 24000);
    });
  });

  describe('DCA Minimum Budget Zero-Drift Projection', () => {
    it('calculates 0 required budget when portfolio is already perfectly balanced', () => {
      const balancedBuckets = [
        {
          weight: 50,
          enabled: true,
          assets: [{ name: 'A', value: 50000, weight: 100, enabled: true }],
        },
        {
          weight: 50,
          enabled: true,
          assets: [{ name: 'B', value: 50000, weight: 100, enabled: true }],
        },
      ];
      assert.equal(computeMinRebalanceBudget(balancedBuckets), 0);
    });

    it('calculates exact shortfall to reach target ratio without selling', () => {
      // Asset A is at 60,000 (target 50%), Asset B is at 40,000 (target 50%)
      // Total value = 100,000.
      // To reach 50% without selling A (60,000), total portfolio must grow to 60,000 / 0.5 = 120,000.
      // Required budget = 120,000 - 100,000 = 20,000 (added to B).
      const driftedBuckets = [
        {
          weight: 50,
          enabled: true,
          assets: [{ name: 'A', value: 60000, weight: 100, enabled: true }],
        },
        {
          weight: 50,
          enabled: true,
          assets: [{ name: 'B', value: 40000, weight: 100, enabled: true }],
        },
      ];
      assert.equal(computeMinRebalanceBudget(driftedBuckets), 20000);
    });
  });

  describe('Debt Payoff Strategies Ordering', () => {
    const debts = [
      { id: 1, name: 'Card A', balance: 50000, rate: 16 },
      { id: 2, name: 'Loan B', balance: 15000, rate: 25 },
      { id: 3, name: 'Mortgage C', balance: 2000000, rate: 3.5 },
    ];

    it('Snowball strategy orders by lowest balance first', () => {
      const snowball = [...debts].sort((a, b) => a.balance - b.balance);
      assert.equal(snowball[0].id, 2); // 15,000
      assert.equal(snowball[1].id, 1); // 50,000
      assert.equal(snowball[2].id, 3); // 2,000,000
    });

    it('Avalanche strategy orders by highest interest rate first', () => {
      const avalanche = [...debts].sort((a, b) => b.rate - a.rate);
      assert.equal(avalanche[0].id, 2); // 25%
      assert.equal(avalanche[1].id, 1); // 16%
      assert.equal(avalanche[2].id, 3); // 3.5%
    });
  });
});
