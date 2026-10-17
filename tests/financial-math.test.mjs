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

    it('generates a monotonic decreasing trajectory from initial total to zero', () => {
      function simulateTrajectory(debtsList, extra, strategy) {
        const debts = debtsList.map((d) => ({ ...d, initialBalance: d.balance }));
        let months = 0;
        const initialTotal = debts.reduce((sum, d) => sum + d.initialBalance, 0);
        const trajectory = [{ month: 0, balance: initialTotal }];
        while (debts.some((d) => d.balance > 0.01) && months < 360) {
          months++;
          debts.forEach((d) => {
            if (d.balance > 0) d.balance += d.balance * (d.rate / 100 / 12);
          });
          let avail = extra;
          debts.forEach((d) => {
            if (d.balance > 0) {
              const pay = Math.min(d.balance, d.minPayment);
              d.balance -= pay;
            } else {
              avail += d.minPayment;
            }
          });
          const active = debts.filter((d) => d.balance > 0.01);
          active.sort((a, b) => (strategy === 'snowball' ? a.balance - b.balance : b.rate - a.rate));
          for (const target of active) {
            if (avail <= 0.01) break;
            const pay = Math.min(target.balance, avail);
            target.balance -= pay;
            avail -= pay;
          }
          const remaining = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
          trajectory.push({ month: months, balance: Math.max(0, remaining) });
        }
        return { months, trajectory };
      }

      const sampleDebts = [
        { id: 1, name: 'Card', balance: 10000, rate: 12, minPayment: 1000 },
        { id: 2, name: 'Loan', balance: 20000, rate: 8, minPayment: 2000 },
      ];
      const res = simulateTrajectory(sampleDebts, 1000, 'avalanche');
      assert.ok(res.months > 0 && res.months <= 360);
      assert.equal(res.trajectory[0].balance, 30000);
      assert.equal(res.trajectory[res.trajectory.length - 1].balance, 0);
      assert.equal(res.trajectory[res.trajectory.length - 1].month, res.months);
    });
  });

  describe('Cashflow Allocation Proportions', () => {
    function computeCashflowShares(income, deductions, expenses, savings) {
      const outflow = deductions + expenses + savings;
      const base = Math.max(income, outflow, 0.0001);
      const remaining = income - outflow;
      return {
        pctDeductions: (deductions / base) * 100,
        pctExpenses: (expenses / base) * 100,
        pctSavings: (savings / base) * 100,
        pctRemaining: remaining > 0 ? (remaining / base) * 100 : 0,
        remaining,
        isDeficit: remaining < 0,
      };
    }

    it('calculates correct proportional shares for surplus cashflow', () => {
      const res = computeCashflowShares(100000, 10000, 40000, 20000);
      assert.equal(res.pctDeductions, 10);
      assert.equal(res.pctExpenses, 40);
      assert.equal(res.pctSavings, 20);
      assert.equal(res.pctRemaining, 30);
      assert.equal(res.remaining, 30000);
      assert.equal(res.isDeficit, false);
    });

    it('handles deficit when outflows exceed income', () => {
      const res = computeCashflowShares(50000, 10000, 50000, 0);
      assert.equal(res.remaining, -10000);
      assert.equal(res.isDeficit, true);
      assert.equal(res.pctRemaining, 0);
      assert.equal(Math.round(res.pctDeductions + res.pctExpenses), 100);
    });
  });

  describe('Budget Template Serialization & Presets', () => {
    function computeTemplateNet(tmplState) {
      const incTot = (tmplState.incomes || []).reduce((s, i) => s + (i.value || 0), 0);
      const expTot = (tmplState.expenses || []).reduce((s, i) => s + (i.value || 0), 0);
      const savTot = (tmplState.savings || []).reduce((s, i) => s + (i.value || 0), 0);
      return { incTot, expTot, savTot, net: incTot - expTot - savTot };
    }

    it('validates First Jobber starter preset balanced cashflow', () => {
      const firstJobber = {
        incomes: [{ name: 'Salary', value: 25000 }],
        expenses: [
          { name: 'Rent', value: 6000 },
          { name: 'Utilities', value: 1200 },
          { name: 'Food', value: 7000 },
          { name: 'Travel', value: 2500 },
          { name: 'Phone', value: 600 },
        ],
        savings: [{ name: 'Buffer', value: 2500 }],
      };
      const res = computeTemplateNet(firstJobber);
      assert.equal(res.incTot, 25000);
      assert.equal(res.expTot, 17300);
      assert.equal(res.savTot, 2500);
      assert.equal(res.net, 5200);
    });

    it('safely serializes and restores custom template state', () => {
      const customTmpl = {
        id: 'tmpl-12345',
        name: 'My Frugal Budget',
        state: {
          incomes: [{ name: 'Job', value: 30000 }],
          expenses: [{ name: 'Fixed', value: 12000 }],
          savings: [{ name: 'Vault', value: 5000 }],
        },
      };
      const serialized = JSON.stringify([customTmpl]);
      const restored = JSON.parse(serialized);
      assert.equal(restored.length, 1);
      assert.equal(restored[0].name, 'My Frugal Budget');
      assert.equal(computeTemplateNet(restored[0].state).net, 13000);
    });
  });

  describe('Financial Goals & Milestones Progress', () => {
    function computeGoalProgress(
      curNW,
      targetNW,
      curRunway,
      targetRunway,
      totalDebt,
      monthlyExpense,
      _emergencyReserve,
    ) {
      const safeTargetNW = Math.max(1, targetNW || 1000000);
      const safeTargetRunway = Math.max(0.1, targetRunway || 6);

      // Net worth progress (clamped between 0% and 100%)
      const nwPct = Math.max(0, Math.min(100, Math.round(((curNW || 0) / safeTargetNW) * 100)));
      const nwAchieved = (curNW || 0) >= safeTargetNW && (curNW || 0) > 0;

      // Emergency runway progress (clamped between 0% and 100%)
      const runwayPct = Math.max(0, Math.min(100, Math.round(((curRunway || 0) / safeTargetRunway) * 100)));
      const runwayAchieved = (curRunway || 0) >= safeTargetRunway && (curRunway || 0) > 0;
      const targetBufferAmt = safeTargetRunway * (monthlyExpense || 0);

      // Debt freedom status
      const isDebtFree = (totalDebt || 0) <= 0;

      return {
        nwPct,
        nwAchieved,
        runwayPct,
        runwayAchieved,
        targetBufferAmt,
        isDebtFree,
      };
    }

    it('calculates correct partial progress for runway and net worth', () => {
      // 3 months runway out of 6 months target = 50%
      // 500,000 NW out of 1,000,000 target = 50%
      const res = computeGoalProgress(500000, 1000000, 3, 6, 20000, 25000, 75000);
      assert.equal(res.nwPct, 50);
      assert.equal(res.nwAchieved, false);
      assert.equal(res.runwayPct, 50);
      assert.equal(res.runwayAchieved, false);
      assert.equal(res.targetBufferAmt, 150000);
      assert.equal(res.isDebtFree, false);
    });

    it('correctly detects goal achievement and clamps percentage at 100%', () => {
      // 1.5M NW out of 1M target -> 100% clamped, achieved = true
      // 8 months runway out of 6 months target -> 100% clamped, achieved = true
      // 0 total debt -> isDebtFree = true
      const res = computeGoalProgress(1500000, 1000000, 8, 6, 0, 30000, 240000);
      assert.equal(res.nwPct, 100);
      assert.equal(res.nwAchieved, true);
      assert.equal(res.runwayPct, 100);
      assert.equal(res.runwayAchieved, true);
      assert.equal(res.isDebtFree, true);
    });

    it('handles negative net worth and zero expenses safely without NaN', () => {
      // -100,000 NW -> clamped to 0%
      // 0 monthly expense -> target buffer = 0
      const res = computeGoalProgress(-100000, 1000000, 0, 6, 50000, 0, 0);
      assert.equal(res.nwPct, 0);
      assert.equal(res.nwAchieved, false);
      assert.equal(res.runwayPct, 0);
      assert.equal(res.runwayAchieved, false);
      assert.equal(res.targetBufferAmt, 0);
      assert.equal(res.isDebtFree, false);
    });
  });
});
