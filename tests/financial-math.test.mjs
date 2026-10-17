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
 * Tax Bracket Waterfall Allocation Engine
 */
function computeTaxWaterfall(netIncome) {
  const brackets = [
    { limit: 150000, rate: 0, color: '#10b981', labelTh: '0 - 150,000', labelEn: '0 - 150,000' },
    { limit: 150000, rate: 0.05, color: '#06b6d4', labelTh: '150,001 - 300,000', labelEn: '150,001 - 300,000' },
    { limit: 200000, rate: 0.1, color: '#3b82f6', labelTh: '300,001 - 500,000', labelEn: '300,001 - 500,000' },
    { limit: 250000, rate: 0.15, color: '#6366f1', labelTh: '500,001 - 750,000', labelEn: '500,001 - 750,000' },
    { limit: 250000, rate: 0.2, color: '#8b5cf6', labelTh: '750,001 - 1,000,000', labelEn: '750,001 - 1,000,000' },
    {
      limit: 1000000,
      rate: 0.25,
      color: '#f59e0b',
      labelTh: '1,000,001 - 2,000,000',
      labelEn: '1,000,001 - 2,000,000',
    },
    {
      limit: 3000000,
      rate: 0.3,
      color: '#f97316',
      labelTh: '2,000,001 - 5,000,000',
      labelEn: '2,000,001 - 5,000,000',
    },
    { limit: Infinity, rate: 0.35, color: '#ef4444', labelTh: '5,000,001 ขึ้นไป', labelEn: 'Over 5,000,000' },
  ];

  let remaining = Math.max(0, netIncome);
  let totalTax = 0;
  const tiers = [];
  let topMarginalRate = 0;
  let headroom = 0;
  let nextBracketRate = 0;

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (remaining <= 0 && tiers.length > 0) break;

    const taxable = Math.min(remaining, b.limit);
    const tax = taxable * b.rate;
    totalTax += tax;
    remaining -= taxable;

    const isFull = taxable === b.limit;
    const pctOfTier = b.limit === Infinity ? 100 : Math.min(100, Math.round((taxable / b.limit) * 100));
    const pctOfNet = netIncome > 0 ? (taxable / netIncome) * 100 : 0;

    topMarginalRate = Math.round(b.rate * 100);
    headroom = b.limit === Infinity ? Infinity : Math.max(0, b.limit - taxable);
    nextBracketRate = i + 1 < brackets.length ? Math.round(brackets[i + 1].rate * 100) : 35;

    tiers.push({
      index: i,
      rate: b.rate,
      ratePct: Math.round(b.rate * 100),
      labelTh: b.labelTh,
      labelEn: b.labelEn,
      color: b.color,
      limit: b.limit,
      taxable,
      tax,
      isFull,
      pctOfTier,
      pctOfNet,
      headroom,
    });
  }

  return {
    netIncome,
    totalTax,
    topMarginalRate,
    headroom,
    nextBracketRate,
    tiers,
  };
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

    function simulateDebt(debtsList, extra, strategy) {
      const debts = debtsList.map((d) => ({
        ...d,
        initialBalance: d.balance,
        paidOffMonth: null,
      }));
      let months = 0;
      let totalInterest = 0;
      let totalPaid = 0;
      const payoffOrder = [];
      const initialTotal = debts.reduce((sum, d) => sum + d.initialBalance, 0);
      const trajectory = [{ month: 0, balance: initialTotal }];

      while (debts.some((d) => d.balance > 0.01) && months < 360) {
        months++;
        let monthPayment = 0;

        debts.forEach((d) => {
          if (d.balance > 0) {
            const interest = d.balance * (d.rate / 100 / 12);
            d.balance += interest;
            totalInterest += interest;
          }
        });

        let avail = extra;
        debts.forEach((d) => {
          if (d.balance > 0) {
            const pay = Math.min(d.balance, d.minPayment);
            d.balance -= pay;
            monthPayment += pay;
          } else {
            avail += d.minPayment;
          }
        });

        const active = debts.filter((d) => d.balance > 0.01);
        active.sort((a, b) => (strategy === 'snowball' ? a.balance - b.balance : b.rate - a.rate));

        for (const target of active) {
          if (avail <= 0.01) break;
          const extraPay = Math.min(target.balance, avail);
          target.balance -= extraPay;
          monthPayment += extraPay;
          avail -= extraPay;

          if (target.balance <= 0.01 && target.paidOffMonth === null) {
            target.paidOffMonth = months;
            payoffOrder.push({ name: target.name, month: months });
          }
        }

        debts.forEach((d) => {
          if (d.balance <= 0.01 && d.paidOffMonth === null) {
            d.paidOffMonth = months;
            payoffOrder.push({ name: d.name, month: months });
          }
        });

        totalPaid += monthPayment;
        const remaining = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
        trajectory.push({ month: months, balance: Math.max(0, remaining) });
      }
      return { months, totalInterest, totalPaid, payoffOrder, trajectory };
    }

    it('generates a monotonic decreasing trajectory from initial total to zero', () => {
      const sampleDebts = [
        { id: 1, name: 'Card', balance: 10000, rate: 12, minPayment: 1000 },
        { id: 2, name: 'Loan', balance: 20000, rate: 8, minPayment: 2000 },
      ];
      const res = simulateDebt(sampleDebts, 1000, 'avalanche');
      assert.ok(res.months > 0 && res.months <= 360);
      assert.equal(res.trajectory[0].balance, 30000);
      assert.equal(res.trajectory[res.trajectory.length - 1].balance, 0);
      assert.equal(res.trajectory[res.trajectory.length - 1].month, res.months);
      for (let i = 1; i < res.trajectory.length; i++) {
        assert.ok(res.trajectory[i].balance <= res.trajectory[i - 1].balance + 1e-4);
      }
    });

    it('proves Avalanche yields less or equal total interest than Snowball and Minimum-Only', () => {
      const complexDebts = [
        { id: 1, name: 'High Rate Card', balance: 35000, rate: 22, minPayment: 1200 },
        { id: 2, name: 'Small Balance Loan', balance: 12000, rate: 9, minPayment: 800 },
        { id: 3, name: 'Personal Loan', balance: 60000, rate: 14, minPayment: 2500 },
      ];
      const av = simulateDebt(complexDebts, 3000, 'avalanche');
      const sb = simulateDebt(complexDebts, 3000, 'snowball');
      const minOnly = simulateDebt(complexDebts, 0, 'avalanche');

      // Avalanche must save more or equal interest compared to Snowball
      assert.ok(av.totalInterest <= sb.totalInterest);
      // Both extra-payment strategies must substantially outperform min-only
      assert.ok(sb.totalInterest < minOnly.totalInterest);
      assert.ok(av.months <= minOnly.months);
      assert.ok(sb.months <= minOnly.months);
    });

    it('Snowball strategy pays off the smallest balance account earlier than or equal to Avalanche', () => {
      const debts = [
        { id: 1, name: 'High Card', balance: 40000, rate: 24, minPayment: 1500 },
        { id: 2, name: 'Small Loan', balance: 8000, rate: 8, minPayment: 600 },
      ];
      const sb = simulateDebt(debts, 2000, 'snowball');
      const av = simulateDebt(debts, 2000, 'avalanche');

      const sbFirst = sb.payoffOrder.find((p) => p.name === 'Small Loan');
      const avFirst = av.payoffOrder.find((p) => p.name === 'Small Loan');
      assert.ok(sbFirst !== undefined);
      assert.ok(avFirst !== undefined);
      // Small Loan gets eliminated sooner or at the same time in Snowball
      assert.ok(sbFirst.month <= avFirst.month);
    });

    it('correctly maps multi-series trajectories onto SVG coordinate bounds without NaN or overflow', () => {
      const debts = [
        { id: 1, name: 'Debt 1', balance: 25000, rate: 18, minPayment: 1000 },
        { id: 2, name: 'Debt 2', balance: 15000, rate: 12, minPayment: 800 },
      ];
      const av = simulateDebt(debts, 1500, 'avalanche');
      const sb = simulateDebt(debts, 1500, 'snowball');

      const width = 600;
      const height = 220;
      const padding = { top: 22, right: 30, bottom: 35, left: 65 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;

      const maxMonths = Math.max(av.months, sb.months, 1);
      const maxBalance = 40000;

      const mapX = (m) => padding.left + (m / maxMonths) * plotWidth;
      const mapY = (b) => padding.top + plotHeight - (Math.max(0, b) / maxBalance) * plotHeight;

      [av.trajectory, sb.trajectory].forEach((traj) => {
        traj.forEach((pt) => {
          const x = mapX(pt.month);
          const y = mapY(pt.balance);
          assert.ok(!Number.isNaN(x) && Number.isFinite(x));
          assert.ok(!Number.isNaN(y) && Number.isFinite(y));
          assert.ok(x >= padding.left - 1e-4 && x <= width - padding.right + 1e-4);
          assert.ok(y >= padding.top - 1e-4 && y <= height - padding.bottom + 1e-4);
        });
      });
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

    function computeCashflowWaterfallSteps(income, deductions, expenses, savings) {
      const remaining = income - deductions - expenses - savings;
      const steps = [
        { id: 'income', name: 'Gross Income', start: 0, end: income, delta: income, type: 'inflow' },
        {
          id: 'deductions',
          name: 'Deductions',
          start: income,
          end: income - deductions,
          delta: -deductions,
          type: 'outflow',
        },
        {
          id: 'expenses',
          name: 'Living Expenses',
          start: income - deductions,
          end: income - deductions - expenses,
          delta: -expenses,
          type: 'outflow',
        },
        {
          id: 'savings',
          name: 'Savings & Invest',
          start: income - deductions - expenses,
          end: remaining,
          delta: -savings,
          type: 'outflow',
        },
        { id: 'remaining', name: 'Net Cashflow', start: 0, end: remaining, delta: remaining, type: 'net' },
      ];
      const valMax = Math.max(income, deductions + expenses + savings, 1);
      const valMin = Math.min(0, remaining);
      return { steps, remaining, isDeficit: remaining < 0, valMax, valMin };
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

    it('computeCashflowWaterfallSteps calculates closed-loop waterfall stages from gross income to net surplus', () => {
      const wf = computeCashflowWaterfallSteps(60000, 4000, 32000, 8000);
      assert.equal(wf.remaining, 16000);
      assert.equal(wf.isDeficit, false);
      assert.equal(wf.valMin, 0);
      assert.equal(wf.valMax, 60000);
      assert.equal(wf.steps.length, 5);

      // Verify strict step-down progression
      assert.equal(wf.steps[0].end, wf.steps[1].start); // 60,000 -> 60,000
      assert.equal(wf.steps[1].end, 56000); // 60,000 - 4,000
      assert.equal(wf.steps[1].end, wf.steps[2].start); // 56,000 -> 56,000
      assert.equal(wf.steps[2].end, 24000); // 56,000 - 32,000
      assert.equal(wf.steps[2].end, wf.steps[3].start); // 24,000 -> 24,000
      assert.equal(wf.steps[3].end, 16000); // 24,000 - 8,000
      assert.equal(wf.steps[3].end, wf.steps[4].end); // Final outflow ends at remaining balance (16,000)
      assert.equal(wf.steps[4].start, 0);
    });

    it('handles deficit correctly in waterfall with negative remaining balance and zero-crossing bounds', () => {
      const wf = computeCashflowWaterfallSteps(40000, 3000, 42000, 5000);
      assert.equal(wf.remaining, -10000);
      assert.equal(wf.isDeficit, true);
      assert.equal(wf.valMin, -10000);
      assert.equal(wf.valMax, 50000); // Deductions + Expenses + Savings = 50,000
      assert.equal(wf.steps[4].delta, -10000);
      assert.equal(wf.steps[4].end, -10000);
    });

    it('maps all waterfall bar coordinates safely within SVG canvas bounds without NaN or overflow', () => {
      const testCases = [
        { inc: 100000, ded: 8000, exp: 45000, sav: 20000 }, // Normal surplus
        { inc: 30000, ded: 2500, exp: 35000, sav: 4000 }, // Deficit
        { inc: 50000, ded: 0, exp: 50000, sav: 0 }, // Exactly balanced
      ];

      const width = 600;
      const height = 230;
      const padding = { top: 32, right: 25, bottom: 42, left: 60 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;

      testCases.forEach((tc) => {
        const wf = computeCashflowWaterfallSteps(tc.inc, tc.ded, tc.exp, tc.sav);
        const valRange = Math.max(wf.valMax - wf.valMin, 1);
        const mapY = (v) => padding.top + plotHeight - ((v - wf.valMin) / valRange) * plotHeight;
        const colWidth = plotWidth / wf.steps.length;
        const barWidth = 54;

        wf.steps.forEach((step, idx) => {
          const cx = padding.left + (idx + 0.5) * colWidth;
          const bx = cx - barWidth / 2;
          const yTop = mapY(Math.max(step.start, step.end));
          const yBottom = mapY(Math.min(step.start, step.end));
          const rawHeight = Math.abs(yBottom - yTop);
          const barHeight = rawHeight === 0 ? 2 : Math.max(2, rawHeight);
          const drawY = Math.min(yTop, height - padding.bottom - barHeight);

          assert.ok(!Number.isNaN(bx) && Number.isFinite(bx));
          assert.ok(!Number.isNaN(drawY) && Number.isFinite(drawY));
          assert.ok(!Number.isNaN(barHeight) && Number.isFinite(barHeight));
          assert.ok(bx >= padding.left - 1e-4 && bx + barWidth <= width - padding.right + 1e-4);
          assert.ok(drawY >= padding.top - 1e-4 && drawY + barHeight <= height - padding.bottom + 1e-4);
        });
      });
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

  describe('Tax Bracket Waterfall Allocation & Headroom', () => {
    it('allocates 0 THB net income into exempt tier with full headroom', () => {
      const wf = computeTaxWaterfall(0);
      assert.equal(wf.totalTax, 0);
      assert.equal(wf.topMarginalRate, 0);
      assert.equal(wf.headroom, 150000);
      assert.equal(wf.tiers.length, 1);
      assert.equal(wf.tiers[0].taxable, 0);
    });

    it('calculates correct multi-tier waterfall and marginal headroom', () => {
      // 250,000 THB net income:
      // Tier 0 (0%): 150,000 THB full, 0 tax
      // Tier 1 (5%): 100,000 THB, 5,000 tax, 50,000 headroom
      const wf = computeTaxWaterfall(250000);
      assert.equal(wf.totalTax, 5000);
      assert.equal(wf.topMarginalRate, 5);
      assert.equal(wf.headroom, 50000);
      assert.equal(wf.nextBracketRate, 10);
      assert.equal(wf.tiers.length, 2);
      assert.equal(wf.tiers[0].isFull, true);
      assert.equal(wf.tiers[1].isFull, false);
      assert.equal(wf.tiers[1].taxable, 100000);
      assert.equal(wf.tiers[1].tax, 5000);
    });

    it('detects bracket ceiling saturation and highest 35% tier infinity headroom', () => {
      // 1,000,000 THB net income: exactly fills 20% bracket (headroom = 0)
      const wf1m = computeTaxWaterfall(1000000);
      assert.equal(wf1m.totalTax, 115000);
      assert.equal(wf1m.topMarginalRate, 20);
      assert.equal(wf1m.headroom, 0);
      assert.equal(wf1m.nextBracketRate, 25);

      // 6,000,000 THB net income: top 35% tier
      const wf6m = computeTaxWaterfall(6000000);
      assert.equal(wf6m.topMarginalRate, 35);
      assert.equal(wf6m.headroom, Infinity);
    });
  });

  describe('Printable Financial Report Serialization & Timestamps', () => {
    function formatReportDate(d, lang) {
      const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const thMonths = [
        'ม.ค.',
        'ก.พ.',
        'มี.ค.',
        'เม.ย.',
        'พ.ค.',
        'มิ.ย.',
        'ก.ค.',
        'ส.ค.',
        'ก.ย.',
        'ต.ค.',
        'พ.ย.',
        'ธ.ค.',
      ];
      const day = d.getDate();
      const m = lang === 'en' ? enMonths[d.getMonth()] : thMonths[d.getMonth()];
      const y = lang === 'en' ? d.getFullYear() : d.getFullYear() + 543;
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${m} ${y} ${hh}:${mm}`;
    }

    function buildPrintableExecutiveSummary(profile, goals) {
      return {
        timestamp: formatReportDate(new Date(2026, 9, 17, 10, 30), 'en'),
        metrics: {
          netWorth: profile.netWorth,
          runwayMonths: profile.runwayMonths,
          savingsRate: profile.savingsRate,
          totalDebt: profile.totalDebt,
        },
        goalsProgress: {
          emergencyMet: profile.runwayMonths >= goals.emergencyMonths,
          netWorthMet: profile.netWorth >= goals.netWorthTarget,
          debtFree: profile.totalDebt <= 0,
        },
      };
    }

    it('formats report date correctly in Thai and English Buddhist/Gregorian years', () => {
      const sampleDate = new Date(2026, 9, 17, 9, 5); // 17 Oct 2026, 09:05
      assert.equal(formatReportDate(sampleDate, 'en'), '17 Oct 2026 09:05');
      assert.equal(formatReportDate(sampleDate, 'th'), '17 ต.ค. 2569 09:05');
    });

    it('builds executive summary report structure with verified goal criteria', () => {
      const profile = {
        netWorth: 1200000,
        runwayMonths: 8.5,
        savingsRate: 35.2,
        totalDebt: 0,
      };
      const goals = {
        emergencyMonths: 6,
        netWorthTarget: 1000000,
      };
      const report = buildPrintableExecutiveSummary(profile, goals);
      assert.equal(report.metrics.netWorth, 1200000);
      assert.equal(report.goalsProgress.emergencyMet, true);
      assert.equal(report.goalsProgress.netWorthMet, true);
      assert.equal(report.goalsProgress.debtFree, true);
    });
  });

  describe('Multi-Currency Cross-Rate Conversion & Portfolio Valuation', () => {
    const DEFAULT_FX_RATES = {
      THB: 1.0,
      USD: 33.39,
      EUR: 36.4,
      GBP: 43.5,
      JPY: 0.22,
      SGD: 25.6,
    };

    function calculateCrossRates(rates) {
      if (!rates || typeof rates.THB !== 'number') return null;
      const thb = rates.THB;
      const result = { THB: 1.0, USD: thb };
      ['EUR', 'GBP', 'JPY', 'SGD'].forEach((c) => {
        if (typeof rates[c] === 'number' && rates[c] > 0) {
          result[c] = parseFloat((thb / rates[c]).toFixed(4));
        } else {
          result[c] = DEFAULT_FX_RATES[c];
        }
      });
      return result;
    }

    function getFxRate(currency, customFxRates = {}) {
      if (!currency || currency === 'THB') return 1.0;
      const curr = String(currency).toUpperCase().trim();
      if (typeof customFxRates[curr] === 'number' && customFxRates[curr] > 0) {
        return customFxRates[curr];
      }
      return DEFAULT_FX_RATES[curr] || 1.0;
    }

    function calculateAssetValueTHB(units, lastPrice, currency, customFxRates = {}) {
      const rate = getFxRate(currency, customFxRates);
      return Math.round(units * lastPrice * rate);
    }

    it('calculates cross-rates relative to THB correctly from USD base rates', () => {
      const mockApiRates = {
        USD: 1.0,
        THB: 35.0,
        EUR: 0.92,
        GBP: 0.78,
        JPY: 155.0,
        SGD: 1.35,
      };
      const cross = calculateCrossRates(mockApiRates);
      assert.equal(cross.THB, 1.0);
      assert.equal(cross.USD, 35.0);
      assert.equal(cross.EUR, 38.0435);
      assert.equal(cross.GBP, 44.8718);
      assert.equal(cross.JPY, 0.2258);
      assert.equal(cross.SGD, 25.9259);
    });

    it('falls back to default FX rates when API rates are missing or offline', () => {
      assert.equal(getFxRate('USD'), 33.39);
      assert.equal(getFxRate('EUR'), 36.4);
      assert.equal(getFxRate('GBP'), 43.5);
      assert.equal(getFxRate('JPY'), 0.22);
      assert.equal(getFxRate('SGD'), 25.6);
      assert.equal(getFxRate('THB'), 1.0);
      assert.equal(getFxRate('UNKNOWN_CURRENCY'), 1.0);
    });

    it('correctly calculates THB asset values across multiple currencies', () => {
      // 10 units at 100 EUR @ 36.40 THB/EUR = 36,400 THB
      assert.equal(calculateAssetValueTHB(10, 100, 'EUR'), 36400);

      // 5 units at 200 GBP @ 43.50 THB/GBP = 43,500 THB
      assert.equal(calculateAssetValueTHB(5, 200, 'GBP'), 43500);

      // 10,000 units at 500 JPY @ 0.22 THB/JPY = 1,100,000 THB
      assert.equal(calculateAssetValueTHB(10000, 500, 'JPY'), 1100000);

      // 200 units at 50 SGD @ 25.60 THB/SGD = 256,000 THB
      assert.equal(calculateAssetValueTHB(200, 50, 'SGD'), 256000);

      // 1,000 units at 12.50 THB = 12,500 THB
      assert.equal(calculateAssetValueTHB(1000, 12.5, 'THB'), 12500);

      // Custom live rate override
      const customRates = { EUR: 38.0 };
      assert.equal(calculateAssetValueTHB(10, 100, 'EUR', customRates), 38000);
    });
  });

  describe('Storage Health Diagnostic & Repair Verification', () => {
    const SCHEMAS = {
      'rebalanceCalculator.state.v1': { label: 'พอร์ต Rebalance', isJson: true, defaultVal: '{}' },
      'moneySuperapp.financialGoals.v1': { label: 'เป้าหมายการเงิน (Goals)', isJson: true, defaultVal: '{}' },
      'moneySuperapp.monthsSlips': { label: 'ประวัติสลิปเงินเดือน', isJson: true, defaultVal: '[]' },
      'moneySuperapp.lang': { label: 'ภาษา (Language)', isJson: false, defaultVal: 'th' },
    };

    function inspectStorageHealth(storageMap, schemas) {
      let totalBytes = 0;
      let appBytes = 0;
      let corruptedCount = 0;
      const items = [];
      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];

      const keys = Object.keys(storageMap);
      for (const k of keys) {
        const rawVal = storageMap[k] != null ? String(storageMap[k]) : '';
        const keySize = k.length + rawVal.length;
        totalBytes += keySize;

        const isAppKey = allowedPrefixes.some((p) => k.startsWith(p));
        if (isAppKey) {
          appBytes += keySize;
          const schema = schemas?.[k];
          const shouldBeJson = schema ? schema.isJson : rawVal.trim().startsWith('{') || rawVal.trim().startsWith('[');
          let isCorrupted = false;

          if (shouldBeJson) {
            try {
              JSON.parse(rawVal);
            } catch {
              isCorrupted = true;
              corruptedCount++;
            }
          }

          items.push({
            key: k,
            label: schema ? schema.label : k,
            sizeBytes: keySize,
            isCorrupted,
          });
        }
      }

      items.sort((a, b) => {
        if (a.isCorrupted !== b.isCorrupted) return a.isCorrupted ? -1 : 1;
        return b.sizeBytes - a.sizeBytes;
      });

      return {
        totalBytes,
        appBytes,
        appKb: parseFloat((appBytes / 1024).toFixed(2)),
        percentUsed: parseFloat(Math.min(100, (appBytes / (5 * 1024 * 1024)) * 100).toFixed(2)),
        corruptedCount,
        items,
      };
    }

    function repairStorageItems(storageMap, schemas) {
      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
      const repairedKeys = [];
      const keys = Object.keys(storageMap);

      for (const k of keys) {
        const isAppKey = allowedPrefixes.some((p) => k.startsWith(p));
        if (!isAppKey) continue;

        const rawVal = storageMap[k] != null ? String(storageMap[k]) : '';
        const schema = schemas?.[k];
        const shouldBeJson = schema ? schema.isJson : rawVal.trim().startsWith('{') || rawVal.trim().startsWith('[');

        if (shouldBeJson) {
          try {
            JSON.parse(rawVal);
          } catch {
            if (schema && schema.defaultVal !== undefined) {
              storageMap[k] = schema.defaultVal;
            } else {
              delete storageMap[k];
            }
            repairedKeys.push(k);
          }
        }
      }

      return repairedKeys;
    }

    it('reports 100% healthy status when all app keys have valid JSON or strings', () => {
      const mockStorage = {
        'rebalanceCalculator.state.v1': JSON.stringify({ totalBudget: 200000 }),
        'moneySuperapp.financialGoals.v1': JSON.stringify({ emergencyMonths: 6 }),
        'moneySuperapp.lang': 'th',
        unrelatedKey: 'some other value',
      };
      const report = inspectStorageHealth(mockStorage, SCHEMAS);
      assert.equal(report.corruptedCount, 0);
      assert.equal(report.items.length, 3);
      assert.equal(
        report.items.every((it) => !it.isCorrupted),
        true,
      );
      assert.ok(report.appBytes > 0);
    });

    it('identifies corrupted JSON keys accurately and flags them', () => {
      const mockStorage = {
        'rebalanceCalculator.state.v1': '{"totalBudget": 200000',
        'moneySuperapp.financialGoals.v1': JSON.stringify({ emergencyMonths: 6 }),
        'moneySuperapp.monthsSlips': 'Corrupted String [Not JSON',
        'moneySuperapp.lang': 'th',
      };
      const report = inspectStorageHealth(mockStorage, SCHEMAS);
      assert.equal(report.corruptedCount, 2);
      assert.equal(report.items[0].isCorrupted, true);
      assert.equal(report.items[1].isCorrupted, true);
      assert.equal(report.items[2].isCorrupted, false);
      assert.equal(report.items[3].isCorrupted, false);
    });

    it('repairs corrupted storage keys to safe default values without wiping intact data', () => {
      const mockStorage = {
        'rebalanceCalculator.state.v1': '{"corrupt',
        'moneySuperapp.financialGoals.v1': JSON.stringify({ emergencyMonths: 6, netWorthTarget: 1000000 }),
        'moneySuperapp.monthsSlips': '[invalid array',
      };
      const repaired = repairStorageItems(mockStorage, SCHEMAS);
      assert.deepEqual(repaired.sort(), ['moneySuperapp.monthsSlips', 'rebalanceCalculator.state.v1'].sort());

      assert.equal(mockStorage['rebalanceCalculator.state.v1'], '{}');
      assert.equal(mockStorage['moneySuperapp.monthsSlips'], '[]');

      assert.deepEqual(JSON.parse(mockStorage['moneySuperapp.financialGoals.v1']), {
        emergencyMonths: 6,
        netWorthTarget: 1000000,
      });

      const freshReport = inspectStorageHealth(mockStorage, SCHEMAS);
      assert.equal(freshReport.corruptedCount, 0);
    });
  });

  describe('Net Worth Trend Chart Coordinate Mapping & Growth Metrics', () => {
    function calculateGrowthMetrics(snapshots, mode = 'networth') {
      if (!snapshots || snapshots.length === 0) {
        return { firstVal: 0, lastVal: 0, totalDelta: 0, totalPct: 0, momDelta: 0, momPct: 0, count: 0 };
      }

      const values = snapshots.map((s) => {
        if (mode === 'savings') return s.savingsRate || 0;
        if (mode === 'emergency') return s.emergencyReserve || 0;
        if (mode === 'debt') return s.totalDebt || 0;
        return s.netWorth || 0;
      });

      const firstVal = values[0];
      const lastVal = values[values.length - 1];
      const totalDelta = lastVal - firstVal;
      const totalPct = firstVal !== 0 ? parseFloat(((totalDelta / Math.abs(firstVal)) * 100).toFixed(1)) : 0;

      let momDelta = 0;
      let momPct = 0;
      if (values.length >= 2) {
        const prevVal = values[values.length - 2];
        momDelta = lastVal - prevVal;
        momPct = prevVal !== 0 ? parseFloat(((momDelta / Math.abs(prevVal)) * 100).toFixed(1)) : 0;
      }

      return {
        firstVal,
        lastVal,
        totalDelta,
        totalPct,
        momDelta,
        momPct,
        count: values.length,
      };
    }

    function buildSmoothSvgPath(points) {
      if (!points || points.length === 0) return '';
      if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
      if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

      let path = `M ${points[0].x} ${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? i : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || p2;

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        path += ` C ${Math.round(cp1x * 10) / 10} ${Math.round(cp1y * 10) / 10}, ${Math.round(cp2x * 10) / 10} ${Math.round(cp2y * 10) / 10}, ${p2.x} ${p2.y}`;
      }
      return path;
    }

    function calculateChartCoordinates(snapshots, mode = 'networth', width = 600, height = 220) {
      const padding = { top: 25, right: 30, bottom: 35, left: 65 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;

      const values = snapshots.map((s) => {
        if (mode === 'savings') return s.savingsRate || 0;
        if (mode === 'emergency') return s.emergencyReserve || 0;
        if (mode === 'debt') return s.totalDebt || 0;
        return s.netWorth || 0;
      });

      let minVal = Math.min(...values);
      let maxVal = Math.max(...values);
      if (minVal === maxVal) {
        minVal = Math.max(0, minVal * 0.8);
        maxVal = maxVal * 1.2 || 100;
      }
      const range = maxVal - minVal || 1;

      return snapshots.map((s, idx) => {
        const x = padding.left + (snapshots.length === 1 ? plotWidth / 2 : (idx / (snapshots.length - 1)) * plotWidth);
        const y = padding.top + plotHeight - ((values[idx] - minVal) / range) * plotHeight;
        return {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          val: values[idx],
          date: s.date,
        };
      });
    }

    it('returns zeroed growth metrics for empty or missing snapshots', () => {
      const empty = calculateGrowthMetrics([]);
      assert.equal(empty.count, 0);
      assert.equal(empty.totalDelta, 0);
      assert.equal(empty.totalPct, 0);
      assert.equal(empty.momDelta, 0);
      assert.equal(empty.momPct, 0);

      const nil = calculateGrowthMetrics(null);
      assert.equal(nil.count, 0);
    });

    it('calculates total growth and MoM deltas correctly for multiple snapshots', () => {
      const sampleSnapshots = [
        { date: '2026-01-15', netWorth: 1000000, savingsRate: 20, emergencyReserve: 150000, totalDebt: 500000 },
        { date: '2026-02-15', netWorth: 1100000, savingsRate: 25, emergencyReserve: 180000, totalDebt: 450000 },
        { date: '2026-03-15', netWorth: 1300000, savingsRate: 30, emergencyReserve: 210000, totalDebt: 380000 },
      ];

      // Net worth mode
      const nw = calculateGrowthMetrics(sampleSnapshots, 'networth');
      assert.equal(nw.count, 3);
      assert.equal(nw.firstVal, 1000000);
      assert.equal(nw.lastVal, 1300000);
      assert.equal(nw.totalDelta, 300000);
      assert.equal(nw.totalPct, 30.0);
      assert.equal(nw.momDelta, 200000);
      assert.equal(nw.momPct, 18.2);

      // Debt reduction mode (reduction is negative delta)
      const debt = calculateGrowthMetrics(sampleSnapshots, 'debt');
      assert.equal(debt.firstVal, 500000);
      assert.equal(debt.lastVal, 380000);
      assert.equal(debt.totalDelta, -120000);
      assert.equal(debt.totalPct, -24.0);
      assert.equal(debt.momDelta, -70000);
      assert.equal(debt.momPct, -15.6);

      // Verify debt financial progress polarity: debt reduction is good
      const isGoodDebt = debt.totalDelta <= 0;
      assert.equal(isGoodDebt, true);
    });

    it('handles single snapshot edge-case without NaN or division by zero', () => {
      const single = [{ date: '2026-01-01', netWorth: 500000 }];
      const res = calculateGrowthMetrics(single, 'networth');
      assert.equal(res.count, 1);
      assert.equal(res.totalDelta, 0);
      assert.equal(res.totalPct, 0);
      assert.equal(res.momDelta, 0);
      assert.equal(res.momPct, 0);

      // Coordinate mapping for single snapshot centers point
      const coords = calculateChartCoordinates(single, 'networth', 600, 220);
      assert.equal(coords.length, 1);
      // plotWidth = 600 - 65 - 30 = 505. centerX = 65 + 505/2 = 317.5
      assert.equal(coords[0].x, 317.5);
    });

    it('generates SVG paths correctly for 0, 1, 2, and 3+ points using Catmull-Rom cubic Bezier', () => {
      assert.equal(buildSmoothSvgPath([]), '');
      assert.equal(buildSmoothSvgPath([{ x: 50, y: 100 }]), 'M 50 100');
      assert.equal(
        buildSmoothSvgPath([
          { x: 50, y: 100 },
          { x: 150, y: 80 },
        ]),
        'M 50 100 L 150 80',
      );

      const threePoints = [
        { x: 50, y: 100 },
        { x: 150, y: 50 },
        { x: 250, y: 120 },
      ];
      const splinePath = buildSmoothSvgPath(threePoints);
      assert.ok(splinePath.startsWith('M 50 100'));
      assert.ok(splinePath.includes(' C '));
      // Contains coordinates ending at the final point
      assert.ok(splinePath.endsWith(' 250 120'));
    });

    it('scales coordinates safely within chart viewBox even when all values are equal', () => {
      const flatSnapshots = [
        { date: '2026-01-01', netWorth: 200000 },
        { date: '2026-02-01', netWorth: 200000 },
        { date: '2026-03-01', netWorth: 200000 },
      ];
      const coords = calculateChartCoordinates(flatSnapshots, 'networth', 600, 220);
      assert.equal(coords.length, 3);
      coords.forEach((pt) => {
        assert.ok(!Number.isNaN(pt.x));
        assert.ok(!Number.isNaN(pt.y));
        assert.ok(pt.x >= 65 && pt.x <= 600 - 30);
        assert.ok(pt.y >= 25 && pt.y <= 220 - 35);
      });
      // Start is at leftmost padding (65), end is at rightmost boundary (570)
      assert.equal(coords[0].x, 65);
      assert.equal(coords[2].x, 570);
    });
  });

  describe('Annual Tax Filing Report & Deduction Summary Generation', () => {
    function buildTaxFilingSummary(inputs, lang = 'th', date = new Date(2026, 9, 17, 10, 45)) {
      const isEn = lang === 'en';
      const isYearly = inputs.incomeMode === 'yearly';

      const salary = isYearly ? inputs.yearlyIncome || 0 : (inputs.monthlySalary || 0) * 12;
      const bonus = isYearly ? inputs.yearlyBonus || 0 : inputs.bonus || 0;
      const totalIncome = salary + bonus;

      const expenseDeduction = Math.min(totalIncome * 0.5, 100000);
      const personalDeduction = 60000;

      // PVD & SSO
      let pvdVal = 0;
      let ssoVal = 0;
      if (isYearly) {
        const maxPvd = totalIncome > 0 ? totalIncome * 0.15 : Infinity;
        pvdVal = Math.min(inputs.yearlyPvd || 0, maxPvd);
        ssoVal = Math.min(inputs.yearlySso || 0, 13800);
      } else {
        const pvdPct = inputs.pvdPercent || 0;
        pvdVal = salary * (pvdPct / 100);
        const ssoCap = inputs.ssoCap !== undefined ? inputs.ssoCap : 750;
        if (ssoCap > 0) {
          const ssoMonthly = Math.min((inputs.monthlySalary || 0) * 0.05, ssoCap);
          ssoVal = ssoMonthly * 12;
        }
      }

      // Voluntary & Capped Deductions
      const effectiveMortgage = Math.min(inputs.mortgageDeduct || 0, 100000);
      const effectiveInsurance = Math.min(inputs.insuranceDeduct || 0, 100000);
      const maxThaiEsg = Math.min(300000, totalIncome > 0 ? totalIncome * 0.3 : 300000);
      const effectiveThaiEsg = Math.min(inputs.thaiEsgDeduct || 0, maxThaiEsg);
      const maxFundAllowed = Math.max(0, 500000 - pvdVal);
      const effectiveFund = Math.min(inputs.fundDeduct || 0, maxFundAllowed);
      const effectiveEasyReceipt = Math.min(inputs.easyReceiptDeduct || 0, 50000);
      const otherDeduct = inputs.otherDeduct || 0;

      const totalDeductions =
        expenseDeduction +
        personalDeduction +
        pvdVal +
        ssoVal +
        effectiveFund +
        effectiveThaiEsg +
        effectiveInsurance +
        effectiveMortgage +
        effectiveEasyReceipt +
        otherDeduct;

      const netIncome = Math.max(0, totalIncome - totalDeductions);
      const wf = computeTaxWaterfall(netIncome);
      const totalTax = wf.totalTax;
      const effectiveRate = totalIncome > 0 ? parseFloat(((totalTax / totalIncome) * 100).toFixed(1)) : 0;

      const taxYearStr = isEn
        ? `Tax Year ${date.getFullYear()}`
        : `ปีภาษี ${date.getFullYear() + 543} (พ.ศ. ${date.getFullYear() + 543})`;

      const formName = isYearly ? (isEn ? 'Form P.N.D.90' : 'แบบ ภ.ง.ด.90') : isEn ? 'Form P.N.D.91' : 'แบบ ภ.ง.ด.91';

      return {
        taxYear: taxYearStr,
        formName,
        income: { salary, bonus, totalIncome },
        deductions: {
          expenseDeduction,
          personalDeduction,
          sso: ssoVal,
          pvd: pvdVal,
          retirementFund: effectiveFund,
          thaiEsg: effectiveThaiEsg,
          insurance: effectiveInsurance,
          mortgage: effectiveMortgage,
          easyReceipt: effectiveEasyReceipt,
          other: otherDeduct,
          totalDeductions,
        },
        computation: {
          netIncome,
          totalTax,
          effectiveRate,
          topMarginalRate: wf.topMarginalRate,
          headroom: wf.headroom,
          tierCount: wf.tiers.length,
        },
      };
    }

    it('generates standard salaried P.N.D.91 tax report with statutory deductions and legal caps', () => {
      const salariedInputs = {
        incomeMode: 'monthly',
        monthlySalary: 60000, // 720,000 / yr
        bonus: 80000, // Total = 800,000
        pvdPercent: 5, // 5% of 720,000 = 36,000
        ssoCap: 750, // 9,000 / yr
        fundDeduct: 100000, // SSF/RMF
        thaiEsgDeduct: 50000,
        insuranceDeduct: 150000, // Exceeds 100k -> capped at 100k
        mortgageDeduct: 120000, // Exceeds 100k -> capped at 100k
        easyReceiptDeduct: 60000, // Exceeds 50k -> capped at 50k
        otherDeduct: 0,
      };

      const report = buildTaxFilingSummary(salariedInputs, 'th');
      assert.equal(report.formName, 'แบบ ภ.ง.ด.91');
      assert.equal(report.taxYear, 'ปีภาษี 2569 (พ.ศ. 2569)');
      assert.equal(report.income.salary, 720000);
      assert.equal(report.income.bonus, 80000);
      assert.equal(report.income.totalIncome, 800000);

      // Verify deduction caps
      assert.equal(report.deductions.expenseDeduction, 100000); // 50% capped at 100k
      assert.equal(report.deductions.personalDeduction, 60000);
      assert.equal(report.deductions.sso, 9000);
      assert.equal(report.deductions.pvd, 36000);
      assert.equal(report.deductions.insurance, 100000); // Capped from 150k
      assert.equal(report.deductions.mortgage, 100000); // Capped from 120k
      assert.equal(report.deductions.easyReceipt, 50000); // Capped from 60k
      assert.equal(report.deductions.retirementFund, 100000);
      assert.equal(report.deductions.thaiEsg, 50000);

      // Total deductions = 100k + 60k + 9k + 36k + 100k + 50k + 100k + 100k + 50k = 605,000
      assert.equal(report.deductions.totalDeductions, 605000);
      // Net income = 800,000 - 605,000 = 195,000
      assert.equal(report.computation.netIncome, 195000);
      // Tax on 195,000:
      // 0-150k @ 0% = 0
      // 150k-195k (45,000) @ 5% = 2,250 THB
      assert.equal(report.computation.totalTax, 2250);
      assert.equal(report.computation.topMarginalRate, 5);
      assert.equal(report.computation.effectiveRate, 0.3); // 2,250 / 800,000 = 0.28% -> 0.3%
    });

    it('generates freelance / annual P.N.D.90 report with bilingual labels and retirement pool caps', () => {
      const freelanceInputs = {
        incomeMode: 'yearly',
        yearlyIncome: 1200000,
        yearlyBonus: 300000, // Total = 1,500,000
        yearlyPvd: 150000, // Capped at 15% (180k) -> 150k used
        yearlySso: 15000, // Exceeds 13,800 statutory cap -> capped at 13,800
        fundDeduct: 400000, // Combined with PVD (150k) = 550k > 500k cap -> capped at 350k
        thaiEsgDeduct: 350000, // Exceeds 300k cap -> capped at 300k
        insuranceDeduct: 80000,
        mortgageDeduct: 50000,
        easyReceiptDeduct: 0,
        otherDeduct: 10000,
      };

      const reportEn = buildTaxFilingSummary(freelanceInputs, 'en');
      assert.equal(reportEn.formName, 'Form P.N.D.90');
      assert.equal(reportEn.taxYear, 'Tax Year 2026');
      assert.equal(reportEn.income.totalIncome, 1500000);

      // Verify retirement pool combined cap (PVD 150k + Fund 350k = 500k)
      assert.equal(reportEn.deductions.pvd, 150000);
      assert.equal(reportEn.deductions.retirementFund, 350000);
      assert.equal(reportEn.deductions.pvd + reportEn.deductions.retirementFund, 500000);

      // Verify SSO capped at 13,800
      assert.equal(reportEn.deductions.sso, 13800);

      // ThaiESG capped at 300k
      assert.equal(reportEn.deductions.thaiEsg, 300000);

      assert.ok(reportEn.computation.netIncome > 0);
      assert.ok(reportEn.computation.totalTax > 0);
      assert.ok(reportEn.computation.effectiveRate > 0);
    });

    it('handles zero income and tax-exempt filing thresholds safely', () => {
      const zeroInputs = {
        incomeMode: 'monthly',
        monthlySalary: 0,
        bonus: 0,
      };
      const report = buildTaxFilingSummary(zeroInputs, 'th');
      assert.equal(report.income.totalIncome, 0);
      assert.equal(report.computation.netIncome, 0);
      assert.equal(report.computation.totalTax, 0);
      assert.equal(report.computation.effectiveRate, 0);
      assert.equal(report.computation.topMarginalRate, 0);
    });
  });

  describe('Portfolio Drift & Allocation Deviation Mathematical Engine', () => {
    function calculatePortfolioDrift(buckets, totalBudget = 0, tradeOrders = {}) {
      const activeBuckets = (buckets || []).filter((b) => b.enabled !== false);
      const totalBucketWeight = activeBuckets.reduce((sum, b) => sum + (b.weight || 0), 0) || 1;

      let totalVal = 0;
      const flatAssets = [];

      for (const b of activeBuckets) {
        const normBucketWeight = (b.weight || 0) / totalBucketWeight;
        const activeAssets = (b.assets || []).filter((a) => a.enabled !== false);
        const totalAssetWeightInBucket = activeAssets.reduce((sum, a) => sum + (a.weight || 0), 0) || 1;

        for (const a of activeAssets) {
          const normAssetWeightInBucket = (a.weight || 0) / totalAssetWeightInBucket;
          const targetPct = normBucketWeight * normAssetWeightInBucket * 100;
          const val = Math.max(0, a.value || 0);
          totalVal += val;

          const buyAmt = Math.max(0, tradeOrders[a.id || a.name] || 0);

          flatAssets.push({
            id: a.id || a.name,
            name: a.name,
            bucketId: b.id,
            val,
            buyAmt,
            targetPct,
          });
        }
      }

      const postTotalVal = totalVal + totalBudget;
      let totalPreAbsDrift = 0;
      let totalPostAbsDrift = 0;

      const analyzedAssets = flatAssets.map((a) => {
        const currPct = totalVal > 0 ? (a.val / totalVal) * 100 : 0;
        const preDrift = currPct - a.targetPct;
        totalPreAbsDrift += Math.abs(preDrift);

        const postVal = a.val + a.buyAmt;
        const postPct = postTotalVal > 0 ? (postVal / postTotalVal) * 100 : a.targetPct;
        const postDrift = postPct - a.targetPct;
        totalPostAbsDrift += Math.abs(postDrift);

        let status = 'aligned';
        if (preDrift > 1.5) status = 'overweight';
        else if (preDrift < -1.5) status = 'underweight';

        return {
          name: a.name,
          val: a.val,
          buyAmt: a.buyAmt,
          currPct: parseFloat(currPct.toFixed(1)),
          targetPct: parseFloat(a.targetPct.toFixed(1)),
          preDrift: parseFloat(preDrift.toFixed(1)),
          postPct: parseFloat(postPct.toFixed(1)),
          postDrift: parseFloat(postDrift.toFixed(1)),
          status,
        };
      });

      // Half-sum turnover/drift index
      const preTrackingError = parseFloat((totalPreAbsDrift / 2).toFixed(1));
      const postTrackingError = parseFloat((totalPostAbsDrift / 2).toFixed(1));

      let reductionPct = 0;
      if (preTrackingError > 0) {
        reductionPct = parseFloat((((preTrackingError - postTrackingError) / preTrackingError) * 100).toFixed(1));
      }

      return {
        totalVal,
        postTotalVal,
        preTrackingError,
        postTrackingError,
        reductionPct: Math.max(0, reductionPct),
        assets: analyzedAssets,
      };
    }

    it('reports zero tracking error and aligned status for a perfectly balanced portfolio', () => {
      const balanced = [
        {
          id: 'core',
          weight: 60,
          enabled: true,
          assets: [{ id: 'a1', name: 'Global Equity', value: 60000, weight: 100, enabled: true }],
        },
        {
          id: 'ballast',
          weight: 40,
          enabled: true,
          assets: [{ id: 'a2', name: 'Gov Bonds', value: 40000, weight: 100, enabled: true }],
        },
      ];

      const res = calculatePortfolioDrift(balanced, 0, {});
      assert.equal(res.totalVal, 100000);
      assert.equal(res.preTrackingError, 0);
      assert.equal(res.postTrackingError, 0);
      assert.equal(res.reductionPct, 0);
      assert.equal(res.assets[0].status, 'aligned');
      assert.equal(res.assets[1].status, 'aligned');
    });

    it('accurately detects overweight and underweight assets and proves DCA drift reduction', () => {
      // Portfolio with 100,000 THB total. Target is 50/50.
      // Asset A is 70,000 (70% vs 50% target = +20% overweight)
      // Asset B is 30,000 (30% vs 50% target = -20% underweight)
      const drifted = [
        {
          id: 'core',
          weight: 50,
          enabled: true,
          assets: [{ id: 'a1', name: 'Asset A', value: 70000, weight: 100, enabled: true }],
        },
        {
          id: 'ballast',
          weight: 50,
          enabled: true,
          assets: [{ id: 'a2', name: 'Asset B', value: 30000, weight: 100, enabled: true }],
        },
      ];

      // Top up 20,000 THB exclusively into underweight Asset B
      const tradeOrders = { a1: 0, a2: 20000 };
      const res = calculatePortfolioDrift(drifted, 20000, tradeOrders);

      assert.equal(res.preTrackingError, 20.0);
      assert.equal(res.assets[0].status, 'overweight');
      assert.equal(res.assets[0].preDrift, 20.0);
      assert.equal(res.assets[1].status, 'underweight');
      assert.equal(res.assets[1].preDrift, -20.0);

      // Post-DCA: Total = 120k. A = 70k (58.3%), B = 50k (41.7%). Drift narrowed to 8.3%
      assert.equal(res.postTrackingError, 8.3);
      assert.ok(res.postTrackingError < res.preTrackingError);
      // Reduction = (20 - 8.3)/20 * 100 = 58.5%
      assert.equal(res.reductionPct, 58.5);
    });

    it('correctly handles multi-asset 3-tier weighting trees and zero portfolio edge cases', () => {
      const threeTiers = [
        {
          id: 'core',
          weight: 60,
          enabled: true,
          assets: [
            { id: 'c1', name: 'US ETF', value: 30000, weight: 50, enabled: true }, // target 30%
            { id: 'c2', name: 'World ETF', value: 30000, weight: 50, enabled: true }, // target 30%
          ],
        },
        {
          id: 'ballast',
          weight: 30,
          enabled: true,
          assets: [{ id: 'b1', name: 'Thai Bond', value: 30000, weight: 100, enabled: true }], // target 30%
        },
        {
          id: 'satellite',
          weight: 10,
          enabled: true,
          assets: [{ id: 's1', name: 'Gold', value: 10000, weight: 100, enabled: true }], // target 10%
        },
      ];

      const res = calculatePortfolioDrift(threeTiers, 0, {});
      assert.equal(res.totalVal, 100000);
      assert.equal(res.assets.length, 4);
      assert.equal(res.assets[0].targetPct, 30.0);
      assert.equal(res.assets[1].targetPct, 30.0);
      assert.equal(res.assets[2].targetPct, 30.0);
      assert.equal(res.assets[3].targetPct, 10.0);
      assert.equal(res.preTrackingError, 0);

      // Zero-portfolio initialization edge case
      const emptyTiers = [
        {
          id: 'core',
          weight: 100,
          enabled: true,
          assets: [{ id: 'c1', name: 'ETF', value: 0, weight: 100, enabled: true }],
        },
      ];
      const emptyRes = calculatePortfolioDrift(emptyTiers, 50000, { c1: 50000 });
      assert.equal(emptyRes.totalVal, 0);
      assert.equal(emptyRes.postTotalVal, 50000);
      assert.equal(emptyRes.postTrackingError, 0);
    });
  });
});
