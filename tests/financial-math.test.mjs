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

    function simulateDebt(debtsList, extra, strategy, windfall = null) {
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

      const wfAmount = windfall && typeof windfall.amount === 'number' && windfall.amount > 0 ? windfall.amount : 0;
      const wfMonth =
        windfall && typeof windfall.month === 'number' && windfall.month >= 1 ? Math.floor(windfall.month) : 1;

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
        if (wfAmount > 0 && months === wfMonth) {
          avail += wfAmount;
        }

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

    it('accelerates debt payoff and reduces total interest when one-time windfall is applied', () => {
      const debts = [
        { id: 1, name: 'Card', balance: 40000, rate: 20, minPayment: 1500 },
        { id: 2, name: 'Loan', balance: 60000, rate: 12, minPayment: 2500 },
      ];
      const baseline = simulateDebt(debts, 2000, 'avalanche');
      const withWindfall = simulateDebt(debts, 2000, 'avalanche', { amount: 30000, month: 1 });

      assert.ok(withWindfall.months < baseline.months);
      assert.ok(withWindfall.totalInterest < baseline.totalInterest);
      assert.ok(withWindfall.totalPaid < baseline.totalPaid);
      // Windfall reduces balance at month 1
      assert.ok(withWindfall.trajectory[1].balance < baseline.trajectory[1].balance);
    });

    it('proves earlier windfall injection saves more interest than later injection', () => {
      const debts = [
        { id: 1, name: 'Credit Card', balance: 50000, rate: 24, minPayment: 2000 },
        { id: 2, name: 'Personal Loan', balance: 80000, rate: 15, minPayment: 3000 },
      ];
      const m1 = simulateDebt(debts, 2500, 'avalanche', { amount: 40000, month: 1 });
      const m6 = simulateDebt(debts, 2500, 'avalanche', { amount: 40000, month: 6 });

      // Month 1 windfall prevents more compound interest accrual than month 6 windfall
      assert.ok(m1.totalInterest < m6.totalInterest);
      assert.ok(m1.months <= m6.months);
    });

    it('handles windfall exceeding remaining debt balance safely without negative balance', () => {
      const debts = [{ id: 1, name: 'Small Debt', balance: 15000, rate: 18, minPayment: 1000 }];
      // Windfall 30,000 THB when only 15,000 THB remains
      const res = simulateDebt(debts, 1000, 'avalanche', { amount: 30000, month: 1 });

      assert.equal(res.months, 1);
      assert.equal(res.trajectory[1].balance, 0);
      assert.ok(res.trajectory.every((pt) => pt.balance >= 0));
    });

    it('routes windfall capital in accordance with active strategy (Snowball vs Avalanche)', () => {
      const debts = [
        { id: 1, name: 'Small Card', balance: 15000, rate: 10, minPayment: 1000 },
        { id: 2, name: 'High Card', balance: 20000, rate: 25, minPayment: 1000 },
      ];
      // 15,000 THB windfall at Month 1
      const av = simulateDebt(debts, 500, 'avalanche', { amount: 15000, month: 1 });
      const sb = simulateDebt(debts, 500, 'snowball', { amount: 15000, month: 1 });

      // In Snowball, Small Card (smallest balance) gets eliminated in month 1
      assert.equal(sb.payoffOrder[0].name, 'Small Card');
      assert.equal(sb.payoffOrder[0].month, 1);

      // In Avalanche, High Card (highest rate) gets attacked first and saves more total interest
      assert.ok(av.totalInterest < sb.totalInterest);
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

  describe('Interactive Financial Goal Projection & Compound Scenario Simulator', () => {
    function calculateGoalHorizonMonths(currentVal, targetVal, monthlyPmt, annualRate) {
      const cur = typeof currentVal === 'number' ? currentVal : 0;
      const tgt = typeof targetVal === 'number' ? targetVal : 0;
      const pmt = typeof monthlyPmt === 'number' ? monthlyPmt : 0;
      const rate = typeof annualRate === 'number' ? annualRate : 0;

      if (cur >= tgt) return 0;

      const r = rate / 12;

      if (Math.abs(r) < 1e-9) {
        if (pmt <= 0) return Infinity;
        const months = Math.ceil((tgt - cur) / pmt);
        return months > 600 ? Infinity : Math.max(0, months);
      }

      const num = tgt * r + pmt;
      const den = cur * r + pmt;

      if (den <= 0 || num <= 0) return Infinity;

      const ratio = num / den;
      if (ratio <= 1) return 0;

      const months = Math.ceil(Math.log(ratio) / Math.log(1 + r));
      return months > 600 ? Infinity : Math.max(0, months);
    }

    function getProjectedDateString(months, refDate = new Date(), lang = 'th') {
      const isEn = lang === 'en';
      if (!Number.isFinite(months) || months > 600) {
        return isEn ? '> 50 years' : '> 50 ปี';
      }
      if (months <= 0) {
        return isEn ? 'Achieved' : 'บรรลุแล้ว';
      }

      const d = refDate instanceof Date && !Number.isNaN(refDate.getTime()) ? new Date(refDate) : new Date(refDate);
      const targetMonth = d.getMonth() + months;
      const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
      const finalMonth = ((targetMonth % 12) + 12) % 12;

      const mEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const mTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

      const mName = isEn ? mEn[finalMonth] : mTh[finalMonth];
      const yName = isEn ? targetYear : targetYear + 543;
      const monthUnit = isEn ? 'mos' : 'เดือน';

      return `${mName} ${yName} (~${months} ${monthUnit})`;
    }

    it('calculates linear goal horizon correctly for zero return cash savings', () => {
      // 50k to 200k with 15k/mo = 150k / 15k = 10 months
      assert.equal(calculateGoalHorizonMonths(50000, 200000, 15000, 0), 10);
      // Already achieved -> 0 months
      assert.equal(calculateGoalHorizonMonths(200000, 200000, 15000, 0), 0);
      // No monthly contribution -> Infinity
      assert.equal(calculateGoalHorizonMonths(50000, 200000, 0, 0), Infinity);
      // Negative contribution -> Infinity
      assert.equal(calculateGoalHorizonMonths(50000, 200000, -5000, 0), Infinity);
    });

    it('calculates compound interest goal horizon with periodic monthly contributions', () => {
      // 100k PV, 1M FV, 10k PMT, 6% annual rate -> 72 months
      assert.equal(calculateGoalHorizonMonths(100000, 1000000, 10000, 0.06), 72);
      // Pure compound without additional PMT: 100k to 1M at 6% -> 462 months
      assert.equal(calculateGoalHorizonMonths(100000, 1000000, 0, 0.06), 462);
    });

    it('demonstrates realistic progression across Conservative, Moderate, and Aggressive scenarios', () => {
      const pv = 100000;
      const fv = 1000000;
      const pmt = 10000;

      const mCash = calculateGoalHorizonMonths(pv, fv, pmt, 0); // 0%
      const mCons = calculateGoalHorizonMonths(pv, fv, pmt, 0.03); // 3%
      const mMod = calculateGoalHorizonMonths(pv, fv, pmt, 0.06); // 6%
      const mAggr = calculateGoalHorizonMonths(pv, fv, pmt, 0.09); // 9%

      assert.equal(mCash, 90);
      assert.equal(mCons, 80);
      assert.equal(mMod, 72);
      assert.equal(mAggr, 66);

      // Higher expected return rate strictly shortens the time required to reach milestone
      assert.ok(mAggr < mMod);
      assert.ok(mMod < mCons);
      assert.ok(mCons < mCash);
    });

    it('handles negative net worth and unachievable deficit edge cases safely', () => {
      // Negative net worth (-50k) with 10k PMT at 6% reaching 100k
      assert.equal(calculateGoalHorizonMonths(-50000, 100000, 10000, 0.06), 15);

      // Deep deficit where interest decay exceeds tiny monthly contribution
      assert.equal(calculateGoalHorizonMonths(-500000, 1000000, 500, 0.06), Infinity);

      // Horizon exceeding 50 years (> 600 months)
      assert.equal(calculateGoalHorizonMonths(1000, 100000000, 100, 0.01), Infinity);
    });

    it('formats target projection dates accurately in Thai and English formats', () => {
      const refDate = new Date(2026, 9, 17); // Oct 17, 2026

      assert.equal(getProjectedDateString(12, refDate, 'th'), 'ต.ค. 2570 (~12 เดือน)');
      assert.equal(getProjectedDateString(12, refDate, 'en'), 'Oct 2027 (~12 mos)');

      assert.equal(getProjectedDateString(0, refDate, 'th'), 'บรรลุแล้ว');
      assert.equal(getProjectedDateString(0, refDate, 'en'), 'Achieved');

      assert.equal(getProjectedDateString(Infinity, refDate, 'th'), '> 50 ปี');
      assert.equal(getProjectedDateString(Infinity, refDate, 'en'), '> 50 years');
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

  describe('Portfolio Allocation Heatmap & Currency Exposure Matrix', () => {
    const CURRENCY_SYMBOLS = {
      THB: '฿',
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      SGD: 'S$',
    };

    const CURRENCY_COLORS = {
      THB: '#10b981',
      USD: '#3b82f6',
      EUR: '#8b5cf6',
      GBP: '#f59e0b',
      JPY: '#f43f5e',
      SGD: '#14b8a6',
      OTHER: '#64748b',
    };

    function computeCurrencyExposure(assets, totalVal) {
      if (!assets || !Array.isArray(assets) || assets.length === 0 || totalVal <= 0) {
        return {
          exposures: [],
          dominantCurrency: 'THB',
          dominantPct: 100,
        };
      }

      const map = {};
      for (const a of assets) {
        const curr = String(a.currency || 'THB')
          .toUpperCase()
          .trim();
        const val = Math.max(0, a.val ?? a.value ?? 0);
        if (!map[curr]) {
          map[curr] = {
            currency: curr,
            symbol: CURRENCY_SYMBOLS[curr] || curr,
            color: CURRENCY_COLORS[curr] || CURRENCY_COLORS.OTHER,
            totalThb: 0,
          };
        }
        map[curr].totalThb += val;
      }

      const exposures = Object.values(map)
        .map((e) => ({
          ...e,
          sharePct: parseFloat(((e.totalThb / totalVal) * 100).toFixed(1)),
        }))
        .sort((a, b) => b.totalThb - a.totalThb);

      const dominant = exposures[0] || { currency: 'THB', sharePct: 100 };

      return {
        exposures,
        dominantCurrency: dominant.currency,
        dominantPct: dominant.sharePct,
      };
    }

    function computeAllocationHeatmapCells(analyzedAssets) {
      if (!analyzedAssets || !Array.isArray(analyzedAssets)) return [];

      return analyzedAssets.map((a) => {
        const preDrift = typeof a.preDrift === 'number' ? a.preDrift : (a.currPct || 0) - (a.targetPct || 0);
        const absDrift = Math.abs(preDrift);
        const intensity = Math.min(1.0, parseFloat((absDrift / 5.0).toFixed(2)));

        let tone = 'aligned';
        let textColor = 'var(--ok)';
        let bgColor = 'rgba(16, 185, 129, 0.12)';
        let borderColor = 'rgba(16, 185, 129, 0.28)';

        if (preDrift > 1.0) {
          tone = 'overweight';
          textColor = 'var(--warn)';
          bgColor = `rgba(245, 158, 11, ${parseFloat((0.08 + intensity * 0.2).toFixed(2))})`;
          borderColor = `rgba(245, 158, 11, ${parseFloat((0.25 + intensity * 0.45).toFixed(2))})`;
        } else if (preDrift < -1.0) {
          tone = 'underweight';
          textColor = '#2563eb';
          bgColor = `rgba(37, 99, 235, ${parseFloat((0.08 + intensity * 0.2).toFixed(2))})`;
          borderColor = `rgba(37, 99, 235, ${parseFloat((0.25 + intensity * 0.45).toFixed(2))})`;
        }

        return {
          name: a.name,
          currency: a.currency || 'THB',
          currPct: a.currPct,
          targetPct: a.targetPct,
          preDrift: parseFloat(preDrift.toFixed(1)),
          absDrift: parseFloat(absDrift.toFixed(1)),
          intensity,
          tone,
          textColor,
          bgColor,
          borderColor,
        };
      });
    }

    it('correctly aggregates multi-currency assets into proportional exposure shares', () => {
      const assets = [
        { name: 'Thai Govt Bond', currency: 'THB', val: 50000 },
        { name: 'S&P 500 ETF', currency: 'USD', val: 30000 },
        { name: 'European Stoxx 50', currency: 'EUR', val: 15000 },
        { name: 'Thai Cash Deposit', currency: 'THB', val: 5000 },
      ];
      const totalVal = 100000;

      const res = computeCurrencyExposure(assets, totalVal);
      assert.equal(res.dominantCurrency, 'THB');
      assert.equal(res.dominantPct, 55.0);
      assert.equal(res.exposures.length, 3);

      assert.equal(res.exposures[0].currency, 'THB');
      assert.equal(res.exposures[0].totalThb, 55000);
      assert.equal(res.exposures[0].sharePct, 55.0);
      assert.equal(res.exposures[0].symbol, '฿');
      assert.equal(res.exposures[0].color, '#10b981');

      assert.equal(res.exposures[1].currency, 'USD');
      assert.equal(res.exposures[1].totalThb, 30000);
      assert.equal(res.exposures[1].sharePct, 30.0);
      assert.equal(res.exposures[1].symbol, '$');

      assert.equal(res.exposures[2].currency, 'EUR');
      assert.equal(res.exposures[2].totalThb, 15000);
      assert.equal(res.exposures[2].sharePct, 15.0);
      assert.equal(res.exposures[2].symbol, '€');
    });

    it('handles empty assets or zero portfolio value safely without division by zero', () => {
      const resEmpty = computeCurrencyExposure([], 0);
      assert.deepEqual(resEmpty.exposures, []);
      assert.equal(resEmpty.dominantCurrency, 'THB');
      assert.equal(resEmpty.dominantPct, 100);

      const resNull = computeCurrencyExposure(null, 0);
      assert.deepEqual(resNull.exposures, []);
    });

    it('maps allocation deviation intensity and color tones correctly across heatmap cells', () => {
      const analyzed = [
        { name: 'Overweight Asset', currPct: 45.0, targetPct: 40.0, preDrift: 5.0 },
        { name: 'Underweight Asset', currPct: 25.0, targetPct: 30.0, preDrift: -5.0 },
        { name: 'Aligned Asset', currPct: 30.0, targetPct: 30.0, preDrift: 0.0 },
      ];

      const cells = computeAllocationHeatmapCells(analyzed);
      assert.equal(cells.length, 3);

      // Overweight cell
      assert.equal(cells[0].tone, 'overweight');
      assert.equal(cells[0].intensity, 1.0); // 5.0 / 5.0 = 1.0
      assert.equal(cells[0].preDrift, 5.0);
      assert.ok(cells[0].bgColor.includes('245, 158, 11'));
      assert.equal(cells[0].textColor, 'var(--warn)');

      // Underweight cell
      assert.equal(cells[1].tone, 'underweight');
      assert.equal(cells[1].intensity, 1.0);
      assert.equal(cells[1].preDrift, -5.0);
      assert.ok(cells[1].bgColor.includes('37, 99, 235'));
      assert.equal(cells[1].textColor, '#2563eb');

      // Aligned cell
      assert.equal(cells[2].tone, 'aligned');
      assert.equal(cells[2].intensity, 0.0);
      assert.equal(cells[2].preDrift, 0.0);
      assert.ok(cells[2].bgColor.includes('16, 185, 129'));
      assert.equal(cells[2].textColor, 'var(--ok)');
    });
  });

  describe('Shell Navigation, Haptics & Skeleton State Engine', () => {
    function triggerHaptic(nav, ms = 10) {
      try {
        if (nav && 'vibrate' in nav && typeof nav.vibrate === 'function') {
          return nav.vibrate(ms);
        }
      } catch (_e) {}
      return false;
    }

    function createSkeletonManager(element, setTimeoutFn = setTimeout, clearTimeoutFn = clearTimeout) {
      let timer = null;
      return {
        show() {
          if (timer) clearTimeoutFn(timer);
          element.classList.remove('fade-out');
          element.style.display = 'flex';
        },
        hide(doneCallback) {
          element.classList.add('fade-out');
          timer = setTimeoutFn(() => {
            element.style.display = 'none';
            element.classList.remove('fade-out');
            if (doneCallback) doneCallback();
          }, 200);
        },
      };
    }

    it('triggerHaptic invokes navigator.vibrate when API is supported', () => {
      let patternPassed = 0;
      const mockNav = {
        vibrate(ms) {
          patternPassed = ms;
          return true;
        },
      };
      const result = triggerHaptic(mockNav, 15);
      assert.equal(result, true);
      assert.equal(patternPassed, 15);
    });

    it('triggerHaptic returns false safely when navigator has no vibrate or throws', () => {
      assert.equal(triggerHaptic(undefined, 10), false);
      assert.equal(triggerHaptic({}, 10), false);
      const throwingNav = {
        vibrate() {
          throw new Error('Permission denied');
        },
      };
      assert.equal(triggerHaptic(throwingNav, 10), false);
    });

    it('skeleton manager toggles display and fade-out classes smoothly', () => {
      const el = {
        style: { display: 'none' },
        classList: {
          classes: new Set(),
          add(c) {
            this.classes.add(c);
          },
          remove(c) {
            this.classes.delete(c);
          },
          contains(c) {
            return this.classes.has(c);
          },
        },
      };

      let timerCallback = null;
      const fakeSetTimeout = (cb) => {
        timerCallback = cb;
        return 123;
      };
      const fakeClearTimeout = () => {
        timerCallback = null;
      };

      const sm = createSkeletonManager(el, fakeSetTimeout, fakeClearTimeout);
      sm.show();
      assert.equal(el.style.display, 'flex');
      assert.equal(el.classList.contains('fade-out'), false);

      sm.hide();
      assert.equal(el.classList.contains('fade-out'), true);
      assert.ok(typeof timerCallback === 'function');
      timerCallback();
      assert.equal(el.style.display, 'none');
      assert.equal(el.classList.contains('fade-out'), false);
    });
  });

  describe('IndexedDB Storage Adapter & Snapshot Archival Engine', () => {
    function partitionSnapshots(snapshots, maxMonths = 12, referenceDate = new Date()) {
      if (!Array.isArray(snapshots) || snapshots.length <= 3) {
        return {
          active: snapshots || [],
          toArchive: [],
          cutoffDate: null,
        };
      }

      const cutoff = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - maxMonths, 1);
      const y = cutoff.getFullYear();
      const m = String(cutoff.getMonth() + 1).padStart(2, '0');
      const d = String(cutoff.getDate()).padStart(2, '0');
      const cutoffStr = `${y}-${m}-${d}`;

      const sorted = [...snapshots].sort((a, b) => new Date(a.date) - new Date(b.date));
      const active = [];
      const toArchive = [];

      for (const s of sorted) {
        if (s.date < cutoffStr) {
          toArchive.push(s);
        } else {
          active.push(s);
        }
      }

      // Safeguard: always retain at least the 3 most recent snapshots in active view
      while (active.length < 3 && toArchive.length > 0) {
        active.unshift(toArchive.pop());
      }

      return {
        active,
        toArchive,
        cutoffDate: cutoffStr,
      };
    }

    function createIndexedDBAdapter(options) {
      const opts = options || {};
      const customIDB = opts.indexedDB || null;
      const fallbackMemory = {};

      function get(key) {
        if (!customIDB) {
          return Promise.resolve(Object.hasOwn(fallbackMemory, key) ? fallbackMemory[key] : null);
        }
        return customIDB.get(key);
      }

      function set(key, value) {
        fallbackMemory[key] = value;
        if (!customIDB) {
          return Promise.resolve(true);
        }
        return customIDB.set(key, value);
      }

      function del(key) {
        delete fallbackMemory[key];
        if (!customIDB) {
          return Promise.resolve(true);
        }
        return customIDB.delete(key);
      }

      function keys() {
        if (!customIDB) {
          return Promise.resolve(Object.keys(fallbackMemory));
        }
        return customIDB.keys();
      }

      function formatBytes(bytes) {
        if (bytes == null || Number.isNaN(bytes) || bytes <= 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        i = Math.min(units.length - 1, Math.max(0, i));
        const val = bytes / 1024 ** i;
        return `${val < 10 && i > 0 ? val.toFixed(1) : Math.round(val)} ${units[i]}`;
      }

      return {
        get,
        set,
        delete: del,
        keys,
        formatBytes,
        isSupported: Boolean(customIDB),
      };
    }

    it('correctly partitions snapshots into active and archive sets based on age', () => {
      const refDate = new Date(2026, 9, 17); // Oct 17, 2026
      const sampleSnapshots = [
        { id: 1, date: '2024-05-01', netWorth: 100000 }, // 29 months old -> archive
        { id: 2, date: '2025-06-15', netWorth: 150000 }, // 16 months old -> archive
        { id: 3, date: '2025-09-30', netWorth: 180000 }, // 13 months old -> archive
        { id: 4, date: '2025-11-01', netWorth: 200000 }, // 11 months old -> active
        { id: 5, date: '2026-04-10', netWorth: 250000 }, // 6 months old -> active
        { id: 6, date: '2026-10-01', netWorth: 300000 }, // 0 months old -> active
      ];

      const res = partitionSnapshots(sampleSnapshots, 12, refDate);
      assert.equal(res.toArchive.length, 3);
      assert.equal(res.active.length, 3);
      assert.equal(res.toArchive[0].id, 1);
      assert.equal(res.toArchive[1].id, 2);
      assert.equal(res.toArchive[2].id, 3);
      assert.equal(res.active[0].id, 4);
      assert.equal(res.active[1].id, 5);
      assert.equal(res.active[2].id, 6);
    });

    it('preserves minimum 3 active snapshots even when all snapshots exceed age threshold', () => {
      const refDate = new Date(2026, 9, 17);
      const allOldSnapshots = [
        { id: 1, date: '2023-01-01', netWorth: 50000 },
        { id: 2, date: '2023-06-01', netWorth: 60000 },
        { id: 3, date: '2023-12-01', netWorth: 70000 },
        { id: 4, date: '2024-01-01', netWorth: 80000 },
      ];

      const res = partitionSnapshots(allOldSnapshots, 12, refDate);
      // Even though all 4 are older than 12 months, active must retain the 3 most recent
      assert.equal(res.active.length, 3);
      assert.equal(res.toArchive.length, 1);
      assert.equal(res.toArchive[0].id, 1);
      assert.equal(res.active[0].id, 2);
      assert.equal(res.active[1].id, 3);
      assert.equal(res.active[2].id, 4);
    });

    it('formats storage byte counts safely into human-readable units', () => {
      const adapter = createIndexedDBAdapter();
      assert.equal(adapter.formatBytes(0), '0 B');
      assert.equal(adapter.formatBytes(512), '512 B');
      assert.equal(adapter.formatBytes(1024), '1.0 KB');
      assert.equal(adapter.formatBytes(1536), '1.5 KB');
      assert.equal(adapter.formatBytes(1048576), '1.0 MB');
      assert.equal(adapter.formatBytes(5242880), '5.0 MB');
      assert.equal(adapter.formatBytes(1073741824), '1.0 GB');
      assert.equal(adapter.formatBytes(null), '0 B');
    });

    it('operates safely with in-memory fallback when native IndexedDB is unavailable', async () => {
      const adapter = createIndexedDBAdapter({ indexedDB: null });
      assert.equal(adapter.isSupported, false);

      await adapter.set('testKey', { hello: 'world' });
      const val = await adapter.get('testKey');
      assert.deepEqual(val, { hello: 'world' });

      const allKeys = await adapter.keys();
      assert.deepEqual(allKeys, ['testKey']);

      await adapter.delete('testKey');
      const valAfter = await adapter.get('testKey');
      assert.equal(valAfter, null);
    });
  });

  describe('Net Worth Composition, Asset Allocation & Solvency Engine', () => {
    function calculateNetWorthComposition({ cash = 0, investments = 0, debt = 0 } = {}) {
      const c = Math.max(0, Number(cash) || 0);
      const inv = Math.max(0, Number(investments) || 0);
      const d = Math.max(0, Number(debt) || 0);

      const grossAssets = c + inv;
      const netWorth = grossAssets - d;

      let cashPct = 0;
      let investPct = 0;
      let debtToAssetRatio = 0;
      let solvencyRatio = 100;

      if (grossAssets > 0) {
        cashPct = (c / grossAssets) * 100;
        investPct = (inv / grossAssets) * 100;
        debtToAssetRatio = (d / grossAssets) * 100;
        solvencyRatio = (netWorth / grossAssets) * 100;
      } else if (d > 0) {
        debtToAssetRatio = Infinity;
        solvencyRatio = -Infinity;
      }

      let solvencyStatus = 'debt_free';
      if (d > 0) {
        if (solvencyRatio >= 80) {
          solvencyStatus = 'healthy';
        } else if (solvencyRatio >= 50) {
          solvencyStatus = 'moderate';
        } else {
          solvencyStatus = 'caution';
        }
      }

      // Circumference for r=65
      const r = 65;
      const circ = 2 * Math.PI * r;
      const cashArc = (cashPct / 100) * circ;
      const investArc = (investPct / 100) * circ;

      return {
        cash: c,
        investments: inv,
        debt: d,
        grossAssets,
        netWorth,
        cashPct,
        investPct,
        debtToAssetRatio,
        solvencyRatio,
        solvencyStatus,
        donut: {
          radius: r,
          circumference: circ,
          cashStrokeDash: `${cashArc.toFixed(2)} ${(circ - cashArc).toFixed(2)}`,
          cashOffset: 0,
          investStrokeDash: `${investArc.toFixed(2)} ${(circ - investArc).toFixed(2)}`,
          investOffset: -cashArc,
        },
      };
    }

    it('calculates balanced composition for standard liquid cash and portfolio with zero debt', () => {
      const comp = calculateNetWorthComposition({ cash: 300000, investments: 700000, debt: 0 });
      assert.equal(comp.grossAssets, 1000000);
      assert.equal(comp.netWorth, 1000000);
      assert.equal(comp.cashPct, 30);
      assert.equal(comp.investPct, 70);
      assert.equal(comp.debtToAssetRatio, 0);
      assert.equal(comp.solvencyRatio, 100);
      assert.equal(comp.solvencyStatus, 'debt_free');
    });

    it('calculates solvency and leverage ratios accurately with active debt', () => {
      const comp = calculateNetWorthComposition({ cash: 200000, investments: 800000, debt: 250000 });
      assert.equal(comp.grossAssets, 1000000);
      assert.equal(comp.netWorth, 750000);
      assert.equal(comp.debtToAssetRatio, 25);
      assert.equal(comp.solvencyRatio, 75);
      assert.equal(comp.solvencyStatus, 'moderate'); // 50 <= solvency < 80
    });

    it('identifies highly leveraged or negative net worth status safely', () => {
      const comp = calculateNetWorthComposition({ cash: 50000, investments: 50000, debt: 150000 });
      assert.equal(comp.grossAssets, 100000);
      assert.equal(comp.netWorth, -50000);
      assert.equal(comp.debtToAssetRatio, 150);
      assert.equal(comp.solvencyRatio, -50);
      assert.equal(comp.solvencyStatus, 'caution');
    });

    it('handles zero assets and edge cases without NaN or division by zero', () => {
      const emptyComp = calculateNetWorthComposition({ cash: 0, investments: 0, debt: 0 });
      assert.equal(emptyComp.grossAssets, 0);
      assert.equal(emptyComp.netWorth, 0);
      assert.equal(emptyComp.solvencyRatio, 100);
      assert.equal(emptyComp.debtToAssetRatio, 0);
      assert.equal(emptyComp.solvencyStatus, 'debt_free');

      const debtOnlyComp = calculateNetWorthComposition({ cash: 0, investments: 0, debt: 50000 });
      assert.equal(debtOnlyComp.grossAssets, 0);
      assert.equal(debtOnlyComp.netWorth, -50000);
      assert.equal(debtOnlyComp.solvencyStatus, 'caution');
    });

    it('generates consistent SVG circle stroke-dasharray and stroke-dashoffset values', () => {
      const comp = calculateNetWorthComposition({ cash: 500000, investments: 500000, debt: 0 });
      const halfCirc = (comp.donut.circumference / 2).toFixed(2);
      assert.equal(comp.donut.cashStrokeDash, `${halfCirc} ${halfCirc}`);
      assert.equal(comp.donut.cashOffset, 0);
      assert.equal(comp.donut.investOffset, -(comp.donut.circumference / 2));
    });
  });

  describe('Annual Net Take-Home Pay & Bonus Distribution Stream Engine', () => {
    function calculateAnnualPayrollStream({
      salary = 0,
      allowance = 0,
      bonus = 0,
      pvdPercent = 0,
      ssoCapVal = 875,
      bonusMonth = 12,
    } = {}) {
      const sal = Math.max(0, Number(salary) || 0);
      const allow = Math.max(0, Number(allowance) || 0);
      const bon = Math.max(0, Number(bonus) || 0);
      const pvdPct = Math.max(0, Number(pvdPercent) || 0);
      const ssoCap = Math.max(0, Number(ssoCapVal) || 875);
      const bMonth = Number(bonusMonth) || 12;

      const monthlyEarnings = sal + allow;
      const sso = Math.min(sal * 0.05, ssoCap);
      const pvd = sal * (pvdPct / 100);

      const annualIncome = monthlyEarnings * 12 + bon;
      const annualSso = sso * 12;
      const annualPvd = pvd * 12;

      const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
      const personalDeduction = 60000;
      let netAnnualTaxable = annualIncome - (expenseDeduction + personalDeduction + annualSso + annualPvd);
      if (netAnnualTaxable < 0) netAnnualTaxable = 0;

      const brackets = [
        { limit: 150000, rate: 0 },
        { limit: 150000, rate: 0.05 },
        { limit: 200000, rate: 0.1 },
        { limit: 250000, rate: 0.15 },
        { limit: 250000, rate: 0.2 },
        { limit: 1000000, rate: 0.25 },
        { limit: 3000000, rate: 0.3 },
        { limit: Infinity, rate: 0.35 },
      ];

      let annualTax = 0;
      let rem = netAnnualTaxable;
      for (const b of brackets) {
        if (rem <= 0) break;
        const taxInBracket = Math.min(rem, b.limit);
        annualTax += taxInBracket * b.rate;
        rem -= taxInBracket;
      }

      const monthlyTax = annualTax / 12;
      const regularDeductions = sso + pvd + monthlyTax;
      const regularNet = monthlyEarnings - regularDeductions;

      const stream = [];
      let totalAnnualNet = 0;
      let maxMonthlyGross = 0;

      for (let m = 1; m <= 12; m++) {
        const isBonus = m === bMonth && bon > 0;
        const bonusAmt = isBonus ? bon : 0;
        const gross = monthlyEarnings + bonusAmt;
        const net = isBonus ? regularNet + bon : regularNet;

        totalAnnualNet += net;
        if (gross > maxMonthlyGross) maxMonthlyGross = gross;

        stream.push({
          month: m,
          gross,
          net,
          sso,
          pvd,
          tax: monthlyTax,
          bonus: bonusAmt,
          isBonus,
        });
      }

      const chartH = 140;
      const paddingBottom = 25;
      const spacing = 48;

      const coordinates = stream.map((item, idx) => {
        const x = 20 + idx * spacing;
        const scale = maxMonthlyGross > 0 ? (item.gross / maxMonthlyGross) * chartH : 0;
        const yBase = 180 - paddingBottom;
        const colY = yBase - scale;
        const netH = maxMonthlyGross > 0 ? (item.net / maxMonthlyGross) * chartH : 0;
        const bonusH = maxMonthlyGross > 0 && item.bonus > 0 ? (item.bonus / maxMonthlyGross) * chartH : 0;
        return {
          month: item.month,
          x,
          colY,
          colHeight: scale,
          netHeight: netH,
          bonusHeight: bonusH,
        };
      });

      return {
        annualIncome,
        annualTax,
        annualSso,
        annualPvd,
        netAnnualTaxable,
        monthlyTax,
        regularNet,
        totalAnnualNet,
        stream,
        coordinates,
      };
    }

    it('calculates 12-month stream with December bonus payout month correctly', () => {
      const res = calculateAnnualPayrollStream({
        salary: 50000,
        allowance: 5000,
        bonus: 100000,
        pvdPercent: 5,
        ssoCapVal: 875,
        bonusMonth: 12,
      });

      assert.equal(res.stream.length, 12);
      assert.equal(res.annualIncome, 760000); // (55000 * 12) + 100000
      assert.equal(res.stream[11].isBonus, true); // December is index 11
      assert.equal(res.stream[11].bonus, 100000);
      assert.equal(res.stream[0].isBonus, false);
      assert.equal(res.stream[0].bonus, 0);

      // Prove net pay in bonus month equals regular net + bonus
      assert.equal(res.stream[11].net, res.regularNet + 100000);
      assert.equal(Math.round(res.totalAnnualNet), Math.round(res.regularNet * 12 + 100000));
    });

    it('handles zero bonus or custom bonus month safely without negative values', () => {
      const zeroBonus = calculateAnnualPayrollStream({
        salary: 30000,
        allowance: 0,
        bonus: 0,
        pvdPercent: 3,
        ssoCapVal: 750,
        bonusMonth: 12,
      });

      assert.equal(zeroBonus.annualIncome, 360000);
      assert.equal(
        zeroBonus.stream.every((s) => !s.isBonus && s.bonus === 0),
        true,
      );
      assert.equal(
        zeroBonus.stream.every((s) => s.net > 0 && s.net === zeroBonus.regularNet),
        true,
      );

      // Custom March bonus month (Fiscal year)
      const marchBonus = calculateAnnualPayrollStream({
        salary: 40000,
        allowance: 2000,
        bonus: 80000,
        pvdPercent: 5,
        ssoCapVal: 875,
        bonusMonth: 3,
      });
      assert.equal(marchBonus.stream[2].isBonus, true); // Month 3 is index 2
      assert.equal(marchBonus.stream[11].isBonus, false);
    });

    it('proves total annual net equals exact sum of all 12 monthly nets', () => {
      const res = calculateAnnualPayrollStream({
        salary: 75000,
        allowance: 10000,
        bonus: 250000,
        pvdPercent: 10,
        ssoCapVal: 1150,
        bonusMonth: 12,
      });

      const summedNet = res.stream.reduce((acc, m) => acc + m.net, 0);
      assert.equal(Math.round(summedNet), Math.round(res.totalAnnualNet));
    });

    it('generates scaled SVG column coordinates without NaN or overflow', () => {
      const res = calculateAnnualPayrollStream({
        salary: 60000,
        allowance: 5000,
        bonus: 120000,
        pvdPercent: 6,
        ssoCapVal: 875,
        bonusMonth: 12,
      });

      assert.equal(res.coordinates.length, 12);
      for (const coord of res.coordinates) {
        assert.ok(!Number.isNaN(coord.x) && coord.x >= 0 && coord.x <= 600);
        assert.ok(!Number.isNaN(coord.colY) && coord.colY >= 0 && coord.colY <= 180);
        assert.ok(!Number.isNaN(coord.colHeight) && coord.colHeight > 0);
        assert.ok(!Number.isNaN(coord.netHeight) && coord.netHeight > 0);
      }
    });
  });

  describe('Tax Deduction Optimization Room & Marginal Tax Savings Engine', () => {
    function computeTax(net) {
      if (net <= 150000) return 0;
      const tiers = [
        { limit: 150000, rate: 0 },
        { limit: 150000, rate: 0.05 },
        { limit: 200000, rate: 0.1 },
        { limit: 250000, rate: 0.15 },
        { limit: 250000, rate: 0.2 },
        { limit: 1000000, rate: 0.25 },
        { limit: 3000000, rate: 0.3 },
        { limit: Infinity, rate: 0.35 },
      ];
      let rem = net;
      let tax = 0;
      for (const t of tiers) {
        if (rem <= 0) break;
        const taxable = Math.min(rem, t.limit);
        tax += taxable * t.rate;
        rem -= taxable;
      }
      return tax;
    }

    function calculateTaxOptimizationRoom({
      totalIncome = 0,
      netIncome = 0,
      pvdDeduction = 0,
      currentFund = 0,
      currentThaiEsg = 0,
      currentInsurance = 0,
      currentEasyReceipt = 0,
    } = {}) {
      const totInc = Math.max(0, Number(totalIncome) || 0);
      const net = Math.max(0, Number(netIncome) || 0);
      const pvd = Math.max(0, Number(pvdDeduction) || 0);
      const fund = Math.max(0, Number(currentFund) || 0);
      const esg = Math.max(0, Number(currentThaiEsg) || 0);
      const ins = Math.max(0, Number(currentInsurance) || 0);
      const receipt = Math.max(0, Number(currentEasyReceipt) || 0);

      const brackets = [
        { upper: 150000, lower: 0, rate: 0 },
        { upper: 300000, lower: 150000, rate: 0.05 },
        { upper: 500000, lower: 300000, rate: 0.1 },
        { upper: 750000, lower: 500000, rate: 0.15 },
        { upper: 1000000, lower: 750000, rate: 0.2 },
        { upper: 2000000, lower: 1000000, rate: 0.25 },
        { upper: 5000000, lower: 2000000, rate: 0.3 },
        { upper: Infinity, lower: 5000000, rate: 0.35 },
      ];

      let curBracket = brackets[0];
      for (const b of brackets) {
        if (net > b.lower) {
          curBracket = b;
        }
      }

      // 1. ThaiESG: up to 300k, capped at 30% of total income
      const maxEsg = Math.min(300000, totInc > 0 ? totInc * 0.3 : 300000);
      const usedEsg = Math.min(esg, maxEsg);
      const remEsg = Math.max(0, maxEsg - usedEsg);
      const pctEsg = maxEsg > 0 ? (usedEsg / maxEsg) * 100 : 0;

      // 2. Retirement Bundle: SSF + RMF + PVD combined max 500,000 THB
      const usedPvd = Math.min(pvd, 500000);
      const maxFund = Math.max(0, 500000 - usedPvd);
      const usedFund = Math.min(fund, maxFund);
      const usedRetirement = usedPvd + usedFund;
      const remRetirement = Math.max(0, 500000 - usedRetirement);
      const pctRetirement = (usedRetirement / 500000) * 100;

      // 3. Life & Health Insurance: combined max 100,000 THB
      const usedIns = Math.min(ins, 100000);
      const remIns = Math.max(0, 100000 - usedIns);
      const pctIns = (usedIns / 100000) * 100;

      // 4. Easy E-Receipt: max 50,000 THB
      const usedReceipt = Math.min(receipt, 50000);
      const remReceipt = Math.max(0, 50000 - usedReceipt);
      const pctReceipt = (usedReceipt / 50000) * 100;

      const totalRemainingRoom = remEsg + remRetirement + remIns + remReceipt;
      const currentTax = computeTax(net);

      function simulateExtraInvestment(extraAmt) {
        const extra = Math.max(0, Number(extraAmt) || 0);
        const effectiveExtra = Math.min(extra, totalRemainingRoom);
        const newNet = Math.max(0, net - effectiveExtra);
        const newTax = computeTax(newNet);
        const taxSaved = Math.max(0, currentTax - newTax);
        const effectiveRoiPct = effectiveExtra > 0 ? (taxSaved / effectiveExtra) * 100 : 0;

        let simBracket = brackets[0];
        for (const b of brackets) {
          if (newNet > b.lower) {
            simBracket = b;
          }
        }

        return {
          extraInvested: extra,
          effectiveExtra,
          newNetIncome: newNet,
          currentTax,
          newTax,
          taxSaved,
          effectiveRoiPct: Math.round(effectiveRoiPct * 10) / 10,
          newMarginalRate: simBracket.rate,
        };
      }

      return {
        marginalRate: curBracket.rate,
        marginalRatePct: Math.round(curBracket.rate * 100),
        currentTax,
        totalRemainingRoom,
        categories: {
          thaiEsg: {
            limit: maxEsg,
            used: usedEsg,
            remaining: remEsg,
            pctUsed: Math.min(100, Math.round(pctEsg * 10) / 10),
          },
          retirement: {
            limit: 500000,
            used: usedRetirement,
            pvdUsed: usedPvd,
            fundUsed: usedFund,
            remaining: remRetirement,
            pctUsed: Math.min(100, Math.round(pctRetirement * 10) / 10),
          },
          insurance: {
            limit: 100000,
            used: usedIns,
            remaining: remIns,
            pctUsed: Math.min(100, Math.round(pctIns * 10) / 10),
          },
          easyReceipt: {
            limit: 50000,
            used: usedReceipt,
            remaining: remReceipt,
            pctUsed: Math.min(100, Math.round(pctReceipt * 10) / 10),
          },
        },
        simulateExtraInvestment,
      };
    }

    it('correctly calculates remaining category capacity and percentages', () => {
      const room = calculateTaxOptimizationRoom({
        totalIncome: 1200000,
        netIncome: 800000,
        pvdDeduction: 60000,
        currentFund: 140000,
        currentThaiEsg: 100000,
        currentInsurance: 40000,
        currentEasyReceipt: 20000,
      });

      // ThaiESG: max 300k (30% of 1.2M is 360k -> capped at 300k), 100k used -> 200k remaining (33.3% used)
      assert.equal(room.categories.thaiEsg.limit, 300000);
      assert.equal(room.categories.thaiEsg.used, 100000);
      assert.equal(room.categories.thaiEsg.remaining, 200000);
      assert.equal(room.categories.thaiEsg.pctUsed, 33.3);

      // Retirement: PVD (60k) + Fund (140k) = 200k used out of 500k -> 300k remaining (40% used)
      assert.equal(room.categories.retirement.limit, 500000);
      assert.equal(room.categories.retirement.used, 200000);
      assert.equal(room.categories.retirement.remaining, 300000);
      assert.equal(room.categories.retirement.pctUsed, 40);

      // Insurance: 40k used out of 100k -> 60k remaining (40% used)
      assert.equal(room.categories.insurance.remaining, 60000);

      // Easy E-Receipt: 20k used out of 50k -> 30k remaining (40% used)
      assert.equal(room.categories.easyReceipt.remaining, 30000);

      // Total remaining room: 200k + 300k + 60k + 30k = 590,000 THB
      assert.equal(room.totalRemainingRoom, 590000);
    });

    it('identifies top marginal rate accurately and simulates tax ROI', () => {
      // Net income of 800,000 THB is in the 20% bracket (750,001 - 1,000,000)
      const room = calculateTaxOptimizationRoom({
        totalIncome: 1200000,
        netIncome: 800000,
        pvdDeduction: 50000,
        currentFund: 50000,
        currentThaiEsg: 50000,
      });

      assert.equal(room.marginalRate, 0.2);
      assert.equal(room.marginalRatePct, 20);

      // Simulating +50,000 THB investment within the 20% bracket (from 800k down to 750k)
      // Exactly 50,000 THB at 20% rate saves 10,000 THB in tax (20% ROI)
      const sim50k = room.simulateExtraInvestment(50000);
      assert.equal(sim50k.newNetIncome, 750000);
      assert.equal(sim50k.taxSaved, 10000);
      assert.equal(sim50k.effectiveRoiPct, 20);

      // Simulating +100,000 THB investment crosses bracket from 20% into 15%:
      // 50,000 THB at 20% = 10,000 THB saved
      // 50,000 THB at 15% = 7,500 THB saved
      // Total tax saved = 17,500 THB (17.5% effective ROI)
      const sim100k = room.simulateExtraInvestment(100000);
      assert.equal(sim100k.newNetIncome, 700000);
      assert.equal(sim100k.taxSaved, 17500);
      assert.equal(sim100k.effectiveRoiPct, 17.5);
      assert.equal(sim100k.newMarginalRate, 0.15);
    });

    it('handles statutory income-percentage caps (e.g. ThaiESG 30% of low income)', () => {
      // Low income: total income 400,000 THB -> 30% is 120,000 THB (< 300,000 THB)
      const room = calculateTaxOptimizationRoom({
        totalIncome: 400000,
        netIncome: 250000,
        currentThaiEsg: 50000,
      });

      assert.equal(room.categories.thaiEsg.limit, 120000);
      assert.equal(room.categories.thaiEsg.used, 50000);
      assert.equal(room.categories.thaiEsg.remaining, 70000);
    });

    it('clamps simulation when user requests more than total available deduction room', () => {
      // Fully utilized limits
      const room = calculateTaxOptimizationRoom({
        totalIncome: 1000000,
        netIncome: 500000,
        pvdDeduction: 200000,
        currentFund: 300000, // Retirement bundle full (500k)
        currentThaiEsg: 300000, // ThaiESG full (300k)
        currentInsurance: 100000, // Insurance full (100k)
        currentEasyReceipt: 50000, // Easy receipt full (50k)
      });

      assert.equal(room.totalRemainingRoom, 0);
      assert.equal(room.categories.retirement.remaining, 0);
      assert.equal(room.categories.thaiEsg.remaining, 0);

      // Even if user requests +50k simulation, effective extra is clamped to 0
      const sim = room.simulateExtraInvestment(50000);
      assert.equal(sim.effectiveExtra, 0);
      assert.equal(sim.taxSaved, 0);
      assert.equal(sim.effectiveRoiPct, 0);
    });
  });

  describe('50/30/20 Budget Rule Compliance Donut & Financial Runway Engine', () => {
    const NEEDS_KEYWORDS = [
      'บ้าน',
      'เช่า',
      'หอ',
      'คอนโด',
      'ผ่อน',
      'ไฟ',
      'น้ำ',
      'เน็ต',
      'โทร',
      'เดินทาง',
      'น้ำมัน',
      'รถ',
      'bts',
      'mrt',
      'อาหาร',
      'กับข้าว',
      'ยา',
      'ประกัน',
      'ดอกเบี้ย',
      'กู้',
      'บัตร',
      'rent',
      'mortgage',
      'utility',
      'electric',
      'water',
      'internet',
      'phone',
      'transport',
      'fuel',
      'grocery',
      'food',
      'insurance',
      'loan',
      'bill',
    ];

    const WANTS_KEYWORDS = [
      'เที่ยว',
      'กาแฟ',
      'คาเฟ่',
      'กินนอก',
      'ช้อป',
      'เสื้อผ้า',
      'เกม',
      'หนัง',
      'สตรีมมิ่ง',
      'ปาร์ตี้',
      'บุฟเฟต์',
      'ของเล่น',
      'dining',
      'coffee',
      'cafe',
      'shopping',
      'entertainment',
      'netflix',
      'game',
      'travel',
      'vacation',
      'hobby',
      'party',
    ];

    function classifyBudgetType(item, defaultType = 'expense') {
      if (!item) return 'want';
      if (item.budgetType === 'need' || item.budgetType === 'want' || item.budgetType === 'saving') {
        return item.budgetType;
      }
      if (defaultType === 'saving') return 'saving';
      const name = String(item.name || '').toLowerCase();
      if (name.includes('tax') || name.includes('ภาษี') || name.includes('sso') || name.includes('ประกันสังคม')) {
        return 'need';
      }
      if (name.includes('pvd') || name.includes('สำรองเลี้ยงชีพ') || name.includes('ออม') || name.includes('ลงทุน')) {
        return 'saving';
      }
      if (WANTS_KEYWORDS.some((kw) => name.includes(kw))) {
        return 'want';
      }
      if (NEEDS_KEYWORDS.some((kw) => name.includes(kw)) && !name.includes('นอกบ้าน')) {
        return 'need';
      }
      return 'want';
    }

    function calculateBudgetRule503020({ totalIncome = 0, expenses = [], savings = [], remaining = 0 } = {}) {
      let needsTotal = 0;
      let wantsTotal = 0;
      let savingsTotal = 0;

      for (const item of expenses) {
        const val = Math.max(0, Number(item.value) || 0);
        const bType = classifyBudgetType(item, 'expense');
        if (bType === 'need') needsTotal += val;
        else if (bType === 'saving') savingsTotal += val;
        else wantsTotal += val;
      }

      for (const item of savings) {
        const val = Math.max(0, Number(item.value) || 0);
        savingsTotal += val;
      }

      if (remaining > 0) {
        savingsTotal += remaining;
      }

      const totalBudget = needsTotal + wantsTotal + savingsTotal;
      const base = Math.max(Number(totalIncome) || 0, totalBudget, 0.0001);

      const needsPct = Math.round((needsTotal / base) * 100 * 10) / 10;
      const wantsPct = Math.round((wantsTotal / base) * 100 * 10) / 10;
      const savingsPct = Math.round((savingsTotal / base) * 100 * 10) / 10;

      let status = 'moderate';
      if (savingsPct >= 30) {
        status = 'excellent_savings';
      } else if (needsPct <= 55 && wantsPct <= 35 && savingsPct >= 18) {
        status = 'balanced';
      } else if (needsPct > 60) {
        status = 'high_needs';
      } else if (wantsPct > 40) {
        status = 'high_wants';
      } else if (savingsPct < 10) {
        status = 'low_savings';
      }

      const radius = 70;
      const circumference = 2 * Math.PI * radius; // ~439.82
      const needsArc = (needsPct / 100) * circumference;
      const wantsArc = (wantsPct / 100) * circumference;
      const savingsArc = (savingsPct / 100) * circumference;

      return {
        needsTotal,
        wantsTotal,
        savingsTotal,
        totalBudget,
        base,
        needsPct,
        wantsPct,
        savingsPct,
        status,
        donut: {
          radius,
          circumference: Math.round(circumference * 100) / 100,
          needsArc: Math.round(needsArc * 100) / 100,
          wantsArc: Math.round(wantsArc * 100) / 100,
          savingsArc: Math.round(savingsArc * 100) / 100,
          needsOffset: 0,
          wantsOffset: -Math.round(needsArc * 100) / 100,
          savingsOffset: -Math.round((needsArc + wantsArc) * 100) / 100,
        },
      };
    }

    function calculateEmergencyRunway({ reserve = 0, monthlyExpenses = 0 } = {}) {
      const res = Math.max(0, Number(reserve) || 0);
      const exp = Math.max(0, Number(monthlyExpenses) || 0);

      const months = exp > 0 ? res / exp : 0;
      const monthsClamped = Math.round(months * 10) / 10;

      let tier = 'danger';
      if (res <= 0 || exp <= 0) {
        tier = 'unspecified';
      } else if (monthsClamped < 3) {
        tier = 'danger';
      } else if (monthsClamped <= 6) {
        tier = 'healthy';
      } else {
        tier = 'solid';
      }

      const target3M = exp * 3;
      const target6M = exp * 6;
      const deficit6M = Math.max(0, target6M - res);

      return {
        reserve: res,
        monthlyExpenses: exp,
        months: monthsClamped,
        tier,
        target3M,
        target6M,
        deficit6M,
      };
    }

    it('classifies expenses accurately into Needs, Wants, and Savings', () => {
      const expenses = [
        { name: 'ค่าเช่าห้อง / คอนโด', value: 12000 }, // Need
        { name: 'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต', value: 2500 }, // Need
        { name: 'ค่าเดินทาง BTS / MRT', value: 2500 }, // Need
        { name: 'กินบุฟเฟต์ และคาเฟ่', value: 6000 }, // Want
        { name: 'ช้อปปิ้ง เสื้อผ้า', value: 4000 }, // Want
      ];
      const savings = [
        { name: 'กองทุนสำรองเลี้ยงชีพ PVD', value: 2500 },
        { name: 'DCA หุ้นปันผล', value: 5000 },
      ];

      const res = calculateBudgetRule503020({
        totalIncome: 40000,
        expenses,
        savings,
        remaining: 5500, // Surplus added to savings
      });

      // Needs: 12k + 2.5k + 2.5k = 17,000 (42.5%)
      assert.equal(res.needsTotal, 17000);
      assert.equal(res.needsPct, 42.5);

      // Wants: 6k + 4k = 10,000 (25%)
      assert.equal(res.wantsTotal, 10000);
      assert.equal(res.wantsPct, 25);

      // Savings: 2.5k + 5k + 5.5k surplus = 13,000 (32.5%)
      assert.equal(res.savingsTotal, 13000);
      assert.equal(res.savingsPct, 32.5);

      // Status: Savings >= 30% -> excellent_savings
      assert.equal(res.status, 'excellent_savings');
    });

    it('identifies balanced 50/30/20 budget state and generates valid SVG arcs', () => {
      const res = calculateBudgetRule503020({
        totalIncome: 50000,
        expenses: [
          { name: 'ค่าผ่อนบ้าน', value: 25000 }, // 50%
          { name: 'กินข้าวนอกบ้าน & ช้อปปิ้ง', value: 15000 }, // 30%
        ],
        savings: [
          { name: 'เงินออมฉุกเฉิน', value: 10000 }, // 20%
        ],
        remaining: 0,
      });

      assert.equal(res.needsPct, 50);
      assert.equal(res.wantsPct, 30);
      assert.equal(res.savingsPct, 20);
      assert.equal(res.status, 'balanced');

      // Check SVG arcs
      assert.ok(res.donut.circumference > 439 && res.donut.circumference < 440);
      assert.equal(Math.round(res.donut.needsArc), Math.round(res.donut.circumference * 0.5));
      assert.equal(Math.round(res.donut.wantsArc), Math.round(res.donut.circumference * 0.3));
      assert.equal(Math.round(res.donut.savingsArc), Math.round(res.donut.circumference * 0.2));
      assert.equal(res.donut.needsOffset, 0);
    });

    it('flags high needs or high wants imbalances accurately', () => {
      const highNeeds = calculateBudgetRule503020({
        totalIncome: 30000,
        expenses: [
          { name: 'ค่าผ่อนคอนโดและรถ', value: 22000 }, // 73.3%
          { name: 'กินดื่มทั่วไป', value: 5000 }, // 16.7%
        ],
        savings: [{ name: 'ออม', value: 3000 }],
        remaining: 0,
      });
      assert.equal(highNeeds.status, 'high_needs');

      const highWants = calculateBudgetRule503020({
        totalIncome: 30000,
        expenses: [
          { name: 'ค่าเช่าห้อง', value: 8000 }, // 26.7%
          { name: 'ช้อปปิ้ง ท่องเที่ยว และปาร์ตี้', value: 18000 }, // 60%
        ],
        savings: [{ name: 'ออม', value: 4000 }],
        remaining: 0,
      });
      assert.equal(highWants.status, 'high_wants');
    });

    it('calculates emergency runway duration and safety tiers safely', () => {
      // 1. Danger tier (< 3 months)
      const danger = calculateEmergencyRunway({
        reserve: 40000,
        monthlyExpenses: 20000,
      });
      assert.equal(danger.months, 2);
      assert.equal(danger.tier, 'danger');
      assert.equal(danger.target3M, 60000);
      assert.equal(danger.target6M, 120000);
      assert.equal(danger.deficit6M, 80000);

      // 2. Healthy tier (3-6 months)
      const healthy = calculateEmergencyRunway({
        reserve: 100000,
        monthlyExpenses: 25000,
      });
      assert.equal(healthy.months, 4);
      assert.equal(healthy.tier, 'healthy');
      assert.equal(healthy.deficit6M, 50000);

      // 3. Solid tier (> 6 months)
      const solid = calculateEmergencyRunway({
        reserve: 240000,
        monthlyExpenses: 30000,
      });
      assert.equal(solid.months, 8);
      assert.equal(solid.tier, 'solid');
      assert.equal(solid.deficit6M, 0);

      // 4. Zero expenses edge case
      const zeroExp = calculateEmergencyRunway({
        reserve: 50000,
        monthlyExpenses: 0,
      });
      assert.equal(zeroExp.months, 0);
      assert.equal(zeroExp.tier, 'unspecified');
    });
  });

  describe('Debt Consolidation & Refinance Interest Savings Engine', () => {
    function calculateDebtConsolidation({
      debts = [],
      currentTotalInterest = 0,
      currentTotalMinPayment = 0,
      refinanceRate = 9.9,
      refinanceTermMonths = 36,
    } = {}) {
      const validDebts = (debts || [])
        .map((d) => ({
          balance: Math.max(0, Number(d.balance) || 0),
          rate: Math.max(0, Number(d.rate) || 0),
          minPayment: Math.max(0, Number(d.minPayment) || 0),
        }))
        .filter((d) => d.balance > 0);

      const totalBalance = validDebts.reduce((sum, d) => sum + d.balance, 0);
      const totalMin =
        currentTotalMinPayment > 0 ? currentTotalMinPayment : validDebts.reduce((sum, d) => sum + d.minPayment, 0);

      if (totalBalance <= 0) {
        return {
          totalBalance: 0,
          weightedRate: 0,
          newMonthlyPayment: 0,
          totalRefinanceInterest: 0,
          totalRefinancePaid: 0,
          interestSaved: 0,
          monthlyPaymentDiff: 0,
          verdict: 'no_debt',
        };
      }

      const weightedRate = validDebts.reduce((sum, d) => sum + d.balance * d.rate, 0) / totalBalance;

      const n = Math.max(1, Math.floor(Number(refinanceTermMonths) || 36));
      const annualR = Math.max(0, Number(refinanceRate) || 0);
      const monthlyR = annualR / 100 / 12;

      let pmt = 0;
      if (monthlyR > 0) {
        pmt = (totalBalance * monthlyR) / (1 - Math.pow(1 + monthlyR, -n));
      } else {
        pmt = totalBalance / n;
      }

      const totalRefinancePaid = pmt * n;
      const totalRefinanceInterest = Math.max(0, totalRefinancePaid - totalBalance);
      const interestSaved = Math.round(currentTotalInterest - totalRefinanceInterest);
      const monthlyPaymentDiff = Math.round(totalMin - pmt);

      let verdict = 'optimal';
      if (interestSaved <= 0) {
        verdict = 'higher_interest';
      } else if (monthlyPaymentDiff < 0) {
        verdict = 'faster_payoff';
      }

      return {
        totalBalance: Math.round(totalBalance),
        weightedRate: parseFloat(weightedRate.toFixed(2)),
        refinanceRate: annualR,
        refinanceTermMonths: n,
        newMonthlyPayment: Math.round(pmt),
        totalRefinanceInterest: Math.round(totalRefinanceInterest),
        totalRefinancePaid: Math.round(totalRefinancePaid),
        interestSaved,
        monthlyPaymentDiff,
        verdict,
      };
    }

    it('calculates weighted average interest rate accurately across multiple debts', () => {
      const debts = [
        { balance: 50000, rate: 16, minPayment: 2500 },
        { balance: 150000, rate: 20, minPayment: 6000 },
      ];
      const res = calculateDebtConsolidation({
        debts,
        currentTotalInterest: 45000,
        refinanceRate: 9.9,
        refinanceTermMonths: 36,
      });

      assert.equal(res.totalBalance, 200000);
      assert.equal(res.weightedRate, 19.0);
    });

    it('computes monthly payment, interest savings, and optimal verdict for refinance loan', () => {
      const debts = [
        { balance: 50000, rate: 16, minPayment: 2500 },
        { balance: 150000, rate: 20, minPayment: 6000 },
      ];
      // 36 months at 9.9% APR
      const res = calculateDebtConsolidation({
        debts,
        currentTotalInterest: 50000,
        currentTotalMinPayment: 8500,
        refinanceRate: 9.9,
        refinanceTermMonths: 36,
      });

      // PMT ~ 6,445 THB
      assert.ok(res.newMonthlyPayment >= 6440 && res.newMonthlyPayment <= 6450);
      // Monthly savings: 8,500 - 6,445 ~ 2,055 THB
      assert.ok(res.monthlyPaymentDiff >= 2050 && res.monthlyPaymentDiff <= 2060);
      // Total interest: ~32,000 THB vs 50,000 THB = ~18,000 saved
      assert.ok(res.interestSaved >= 17900 && res.interestSaved <= 18100);
      assert.equal(res.verdict, 'optimal');
    });

    it('identifies faster-payoff verdict when higher monthly payment is required for shorter term', () => {
      const debts = [
        { balance: 50000, rate: 16, minPayment: 2500 },
        { balance: 150000, rate: 20, minPayment: 6000 },
      ];
      // 12 months at 9.9% APR (requires ~17,500/mo vs current 8,500 min)
      const res = calculateDebtConsolidation({
        debts,
        currentTotalInterest: 50000,
        currentTotalMinPayment: 8500,
        refinanceRate: 9.9,
        refinanceTermMonths: 12,
      });

      assert.ok(res.newMonthlyPayment > 17000);
      assert.ok(res.monthlyPaymentDiff < 0);
      assert.ok(res.interestSaved > 35000);
      assert.equal(res.verdict, 'faster_payoff');
    });

    it('identifies higher_interest warning when loan term is excessively stretched', () => {
      const debts = [{ balance: 100000, rate: 16, minPayment: 5000 }];
      // If current remaining interest under aggressive strategy is only 5,000 THB,
      // but refinancing at 10% for 60 months accrues ~27,482 THB interest:
      const res = calculateDebtConsolidation({
        debts,
        currentTotalInterest: 5000,
        currentTotalMinPayment: 5000,
        refinanceRate: 10.0,
        refinanceTermMonths: 60,
      });

      assert.ok(res.totalRefinanceInterest > 25000);
      assert.ok(res.interestSaved < 0);
      assert.equal(res.verdict, 'higher_interest');
    });

    it('handles zero balance or 0% interest promotion edge cases safely without NaN', () => {
      const zeroDebt = calculateDebtConsolidation({
        debts: [],
        currentTotalInterest: 0,
      });
      assert.equal(zeroDebt.totalBalance, 0);
      assert.equal(zeroDebt.verdict, 'no_debt');

      const zeroRate = calculateDebtConsolidation({
        debts: [{ balance: 120000, rate: 18, minPayment: 5000 }],
        currentTotalInterest: 20000,
        currentTotalMinPayment: 5000,
        refinanceRate: 0,
        refinanceTermMonths: 24,
      });
      assert.equal(zeroRate.newMonthlyPayment, 5000);
      assert.equal(zeroRate.totalRefinanceInterest, 0);
      assert.equal(zeroRate.interestSaved, 20000);
      assert.equal(zeroRate.verdict, 'optimal');
    });
  });

  describe('Financial Independence & Early Retirement (FIRE) Engine', () => {
    function calculateGoalHorizonMonths(currentVal, targetVal, monthlyPmt, annualRate) {
      const cur = typeof currentVal === 'number' ? currentVal : 0;
      const tgt = typeof targetVal === 'number' ? targetVal : 0;
      const pmt = typeof monthlyPmt === 'number' ? monthlyPmt : 0;
      const rate = typeof annualRate === 'number' ? annualRate : 0;

      if (cur >= tgt) return 0;
      const r = rate / 12;

      if (Math.abs(r) < 1e-9) {
        if (pmt <= 0) return Infinity;
        const months = Math.ceil((tgt - cur) / pmt);
        return months > 600 ? Infinity : Math.max(0, months);
      }

      const num = tgt * r + pmt;
      const den = cur * r + pmt;
      if (den <= 0 || num <= 0) return Infinity;

      const ratio = num / den;
      if (ratio <= 1) return 0;

      const months = Math.ceil(Math.log(ratio) / Math.log(1 + r));
      return months > 600 ? Infinity : Math.max(0, months);
    }

    function calculateFIREMetrics({
      netWorth = 0,
      annualExpenses = 0,
      swrRate = 0.04,
      monthlyContribution = 0,
      expectedReturnRate = 0.06,
    } = {}) {
      const nw = Math.max(0, Number(netWorth) || 0);
      const exp = Math.max(0, Number(annualExpenses) || 0);
      const swr = swrRate > 0 ? swrRate : 0.04;
      const pmt = Math.max(0, Number(monthlyContribution) || 0);
      const rAnnual = Math.max(0, Number(expectedReturnRate) || 0.06);

      const fireNumber = exp > 0 ? Math.round(exp / swr) : 0;
      const leanFireNumber = Math.round(fireNumber * 0.75);
      const fatFireNumber = Math.round(fireNumber * 1.25);

      const firePct = fireNumber > 0 ? Math.min(100, Math.round((nw / fireNumber) * 100)) : nw > 0 ? 100 : 0;
      const rawPct = fireNumber > 0 ? parseFloat(((nw / fireNumber) * 100).toFixed(1)) : nw > 0 ? 100 : 0;

      const currentSafePassiveIncome = Math.round(nw * swr);
      const expenseCoveragePct =
        exp > 0 ? Math.min(100, Math.round((currentSafePassiveIncome / exp) * 100)) : nw > 0 ? 100 : 0;

      let tier = 'accumulating';
      if (fireNumber > 0) {
        if (nw >= fatFireNumber) tier = 'fat_fire';
        else if (nw >= fireNumber) tier = 'standard_fire';
        else if (nw >= leanFireNumber) tier = 'lean_fire';
        else if (nw >= fireNumber * 0.5) tier = 'halfway_fire';
      } else if (nw > 0) {
        tier = 'standard_fire';
      }

      let monthsToFire = 0;
      if (nw < fireNumber) {
        monthsToFire = calculateGoalHorizonMonths(nw, fireNumber, pmt, rAnnual);
      }

      return {
        netWorth: nw,
        annualExpenses: exp,
        swrRate: swr,
        fireNumber,
        leanFireNumber,
        fatFireNumber,
        firePct,
        rawPct,
        currentSafePassiveIncome,
        expenseCoveragePct,
        tier,
        monthsToFire: Number.isFinite(monthsToFire) ? monthsToFire : Infinity,
      };
    }

    it('calculates standard 4% FIRE number and milestone brackets accurately', () => {
      const res = calculateFIREMetrics({
        netWorth: 3000000,
        annualExpenses: 480000, // 40,000 / mo
        swrRate: 0.04,
        monthlyContribution: 20000,
        expectedReturnRate: 0.06,
      });

      assert.equal(res.fireNumber, 12000000);
      assert.equal(res.leanFireNumber, 9000000);
      assert.equal(res.fatFireNumber, 15000000);
      assert.equal(res.firePct, 25);
      assert.equal(res.rawPct, 25.0);
      assert.equal(res.currentSafePassiveIncome, 120000);
      assert.equal(res.expenseCoveragePct, 25);
      assert.equal(res.tier, 'accumulating');
    });

    it('handles variable safe withdrawal rates (3.0%, 3.5%, 4.0%) correctly', () => {
      const annualExp = 480000;
      const fire4 = calculateFIREMetrics({ annualExpenses: annualExp, swrRate: 0.04 });
      const fire35 = calculateFIREMetrics({ annualExpenses: annualExp, swrRate: 0.035 });
      const fire30 = calculateFIREMetrics({ annualExpenses: annualExp, swrRate: 0.03 });

      assert.equal(fire4.fireNumber, 12000000);
      assert.equal(fire35.fireNumber, 13714286);
      assert.equal(fire30.fireNumber, 16000000);
    });

    it('classifies milestone tiers across accumulating, halfway, lean, standard, and fat FIRE', () => {
      const base = { annualExpenses: 400000, swrRate: 0.04 }; // FIRE Target = 10,000,000
      // 1. Accumulating (< 50%)
      assert.equal(calculateFIREMetrics({ ...base, netWorth: 2000000 }).tier, 'accumulating');
      // 2. Halfway (50% - 74%)
      assert.equal(calculateFIREMetrics({ ...base, netWorth: 5500000 }).tier, 'halfway_fire');
      // 3. Lean FIRE (75% - 99%)
      assert.equal(calculateFIREMetrics({ ...base, netWorth: 8000000 }).tier, 'lean_fire');
      // 4. Standard FIRE (100% - 124%)
      assert.equal(calculateFIREMetrics({ ...base, netWorth: 10500000 }).tier, 'standard_fire');
      // 5. Fat FIRE (125%+)
      assert.equal(calculateFIREMetrics({ ...base, netWorth: 13000000 }).tier, 'fat_fire');
    });

    it('computes months to FIRE using compound growth and zero-delta when reached', () => {
      const inProgress = calculateFIREMetrics({
        netWorth: 2000000,
        annualExpenses: 400000, // 10M target
        swrRate: 0.04,
        monthlyContribution: 25000,
        expectedReturnRate: 0.06,
      });
      assert.ok(inProgress.monthsToFire > 100 && inProgress.monthsToFire < 250);

      const achieved = calculateFIREMetrics({
        netWorth: 10000000,
        annualExpenses: 400000,
        swrRate: 0.04,
      });
      assert.equal(achieved.monthsToFire, 0);
    });

    it('handles zero annual expenses or zero net worth edge cases safely', () => {
      const zeroExp = calculateFIREMetrics({
        netWorth: 5000000,
        annualExpenses: 0,
      });
      assert.equal(zeroExp.fireNumber, 0);
      assert.equal(zeroExp.firePct, 100);
      assert.equal(zeroExp.tier, 'standard_fire');

      const zeroNw = calculateFIREMetrics({
        netWorth: 0,
        annualExpenses: 300000,
      });
      assert.equal(zeroNw.firePct, 0);
      assert.equal(zeroNw.currentSafePassiveIncome, 0);
      assert.equal(zeroNw.expenseCoveragePct, 0);
      assert.equal(zeroNw.tier, 'accumulating');
    });
  });

  describe('Annual Tax Withholding (50 Tawi) vs PIT Liability Refund Engine', () => {
    function calculateTaxRefundOrPayable({ calculatedTax = 0, withheldTax = 0 } = {}) {
      const calc = Math.max(0, Number(calculatedTax) || 0);
      const withheld = Math.max(0, Number(withheldTax) || 0);
      const netBalance = withheld - calc;
      const amount = Math.abs(netBalance);

      let status = 'exact';
      if (netBalance > 0) {
        status = 'refund';
      } else if (netBalance < 0) {
        status = 'payable';
      }

      const canInstallment = status === 'payable' && amount >= 3000;
      const installmentCount = canInstallment ? 3 : 1;
      const installmentAmount = canInstallment ? Math.ceil(amount / 3) : amount;

      return {
        calculatedTax: calc,
        withheldTax: withheld,
        netBalance,
        amount,
        status,
        canInstallment,
        installmentCount,
        installmentAmount,
        headlineTh: status === 'refund' ? 'ขอคืนภาษีได้' : status === 'payable' ? 'ต้องชำระภาษีเพิ่ม' : 'ภาษีพอดี (ไม่ต้องจ่ายเพิ่ม)',
        headlineEn:
          status === 'refund'
            ? 'Tax Refund Eligible'
            : status === 'payable'
              ? 'Additional Tax Payable'
              : 'Exact Balance (No Tax Due)',
      };
    }

    function calculateAnnualPayslipWithholding({
      salary = 0,
      allowance = 0,
      bonus = 0,
      pvdPercent = 0,
      ssoCap = 875,
    } = {}) {
      const sal = Math.max(0, Number(salary) || 0);
      const allow = Math.max(0, Number(allowance) || 0);
      const bon = Math.max(0, Number(bonus) || 0);
      const pvdPct = Math.max(0, Number(pvdPercent) || 0);
      const cap = Math.max(0, Number(ssoCap) || 875);

      const monthlyEarnings = sal + allow;
      const monthlySso = Math.min(sal * 0.05, cap);
      const annualSso = monthlySso * 12;
      const annualPvd = sal * (pvdPct / 100) * 12;
      const annualIncome = monthlyEarnings * 12 + bon;

      const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
      const personalDeduction = 60000;
      const netAnnualIncome = Math.max(
        0,
        annualIncome - (expenseDeduction + personalDeduction + annualSso + annualPvd),
      );

      return computeThaiTax(netAnnualIncome);
    }

    it('accurately identifies tax refund when withholding exceeds calculated liability', () => {
      const res = calculateTaxRefundOrPayable({
        calculatedTax: 8500,
        withheldTax: 15000,
      });

      assert.equal(res.status, 'refund');
      assert.equal(res.netBalance, 6500);
      assert.equal(res.amount, 6500);
      assert.equal(res.canInstallment, false);
      assert.equal(res.headlineTh, 'ขอคืนภาษีได้');
      assert.equal(res.headlineEn, 'Tax Refund Eligible');
    });

    it('identifies additional tax payable with 3-month interest-free installment for amounts >= 3,000 THB', () => {
      const res = calculateTaxRefundOrPayable({
        calculatedTax: 20000,
        withheldTax: 8000,
      });

      assert.equal(res.status, 'payable');
      assert.equal(res.netBalance, -12000);
      assert.equal(res.amount, 12000);
      assert.equal(res.canInstallment, true);
      assert.equal(res.installmentCount, 3);
      assert.equal(res.installmentAmount, 4000);
      assert.equal(res.headlineTh, 'ต้องชำระภาษีเพิ่ม');
      assert.equal(res.headlineEn, 'Additional Tax Payable');
    });

    it('disallows installment plan when additional payable amount is below 3,000 THB threshold', () => {
      const res = calculateTaxRefundOrPayable({
        calculatedTax: 5000,
        withheldTax: 3500,
      });

      assert.equal(res.status, 'payable');
      assert.equal(res.netBalance, -1500);
      assert.equal(res.amount, 1500);
      assert.equal(res.canInstallment, false);
      assert.equal(res.installmentCount, 1);
      assert.equal(res.installmentAmount, 1500);
    });

    it('identifies exact balanced state when withholding matches calculated tax exactly', () => {
      const res = calculateTaxRefundOrPayable({
        calculatedTax: 12500,
        withheldTax: 12500,
      });

      assert.equal(res.status, 'exact');
      assert.equal(res.netBalance, 0);
      assert.equal(res.amount, 0);
      assert.equal(res.canInstallment, false);
      assert.equal(res.headlineTh, 'ภาษีพอดี (ไม่ต้องจ่ายเพิ่ม)');
      assert.equal(res.headlineEn, 'Exact Balance (No Tax Due)');
    });

    it('correctly calculates employer withholding from payslip inputs and proves deduction tax savings refund', () => {
      // 50k/mo salary, 750 SSO cap, 0 allowance, 0 bonus, 0 PVD
      // Annual income = 600k. Deductions: 100k expense + 60k personal + 9k SSO = 169k.
      // Net taxable = 431k. Expected tax = 7.5k (5%) + 13.1k (10%) = 20,600 THB.
      const payslipTax = calculateAnnualPayslipWithholding({
        salary: 50000,
        allowance: 0,
        bonus: 0,
        pvdPercent: 0,
        ssoCap: 750,
      });
      assert.equal(payslipTax, 20600);

      // If user later invests in 100k SSF/RMF, taxable income drops to 331k.
      // New tax = 7.5k + 3.1k = 10,600 THB.
      // Net refund = 20,600 - 10,600 = 10,000 THB!
      const finalTax = 10600;
      const refundOutcome = calculateTaxRefundOrPayable({
        calculatedTax: finalTax,
        withheldTax: payslipTax,
      });
      assert.equal(refundOutcome.status, 'refund');
      assert.equal(refundOutcome.netBalance, 10000);
      assert.equal(refundOutcome.amount, 10000);
    });

    it('handles zero, negative, or invalid inputs safely without NaN or crashes', () => {
      const empty = calculateTaxRefundOrPayable({});
      assert.equal(empty.calculatedTax, 0);
      assert.equal(empty.withheldTax, 0);
      assert.equal(empty.netBalance, 0);
      assert.equal(empty.status, 'exact');

      const negativeInputs = calculateTaxRefundOrPayable({
        calculatedTax: -500,
        withheldTax: -100,
      });
      assert.equal(negativeInputs.calculatedTax, 0);
      assert.equal(negativeInputs.withheldTax, 0);
      assert.equal(negativeInputs.status, 'exact');

      const zeroSlip = calculateAnnualPayslipWithholding();
      assert.equal(zeroSlip, 0);
    });
  });

  describe('Recurring Budget Templates & Expense Category Presets Engine', () => {
    function validateBudgetTemplate(template) {
      if (!template || typeof template !== 'object') return { valid: false, reason: 'Template must be an object' };
      if (!template.id || typeof template.id !== 'string') return { valid: false, reason: 'Missing id' };
      const state = template.state;
      if (!state || typeof state !== 'object') return { valid: false, reason: 'Missing state' };
      if (!Array.isArray(state.incomes)) return { valid: false, reason: 'incomes must be an array' };
      if (!Array.isArray(state.expenses)) return { valid: false, reason: 'expenses must be an array' };
      if (!Array.isArray(state.savings)) return { valid: false, reason: 'savings must be an array' };

      const totalIncome = state.incomes.reduce((s, i) => s + Math.max(0, Number(i.value) || 0), 0);
      const totalExpense = state.expenses.reduce((s, e) => s + Math.max(0, Number(e.value) || 0), 0);
      const totalSavings = state.savings.reduce((s, sv) => s + Math.max(0, Number(sv.value) || 0), 0);
      const netRemaining = totalIncome - totalExpense - totalSavings;
      const savingsRatePct = totalIncome > 0 ? Math.round((totalSavings / totalIncome) * 100) : 0;

      return {
        valid: true,
        summary: {
          totalIncome,
          totalExpense,
          totalSavings,
          netRemaining,
          savingsRatePct,
        },
      };
    }

    function createCustomTemplate({ name, state }) {
      const cleanName = String(name || '').trim();
      if (!cleanName) throw new Error('Template name cannot be empty');
      return {
        id: `tmpl-${Date.now()}`,
        name: cleanName,
        createdAt: new Date().toISOString(),
        state: {
          incomes: (state?.incomes || []).map((i) => ({ ...i, value: Math.max(0, Number(i.value) || 0) })),
          expenses: (state?.expenses || []).map((e) => ({ ...e, value: Math.max(0, Number(e.value) || 0) })),
          savings: (state?.savings || []).map((s) => ({ ...s, value: Math.max(0, Number(s.value) || 0) })),
        },
      };
    }

    it('validates standard budget template schema and computes cash flow summaries', () => {
      const standardTemplate = {
        id: 'preset-standard',
        name: 'Standard Month',
        state: {
          incomes: [{ name: 'Salary', value: 40000, isSalary: true }],
          expenses: [
            { name: 'Rent', value: 10000 },
            { name: 'Food', value: 8000 },
            { name: 'Utilities', value: 2000 },
          ],
          savings: [{ name: 'Emergency Fund', value: 8000 }],
        },
      };

      const res = validateBudgetTemplate(standardTemplate);
      assert.equal(res.valid, true);
      assert.equal(res.summary.totalIncome, 40000);
      assert.equal(res.summary.totalExpense, 20000);
      assert.equal(res.summary.totalSavings, 8000);
      assert.equal(res.summary.netRemaining, 12000);
      assert.equal(res.summary.savingsRatePct, 20);
    });

    it('proves high savings rate in frugal template vs high wants in holiday template', () => {
      const frugal = {
        id: 'preset-frugal',
        state: {
          incomes: [{ name: 'Salary', value: 35000 }],
          expenses: [{ name: 'Basic Needs', value: 12000 }],
          savings: [{ name: 'Aggressive Investment', value: 15000 }],
        },
      };
      const frugalRes = validateBudgetTemplate(frugal);
      assert.ok(frugalRes.summary.savingsRatePct >= 40);

      const holiday = {
        id: 'preset-holiday',
        state: {
          incomes: [{ name: 'Salary', value: 45000 }],
          expenses: [
            { name: 'Fixed Needs', value: 10000 },
            { name: 'Travel & Dining (Wants)', value: 24000 },
          ],
          savings: [{ name: 'Reserved Savings', value: 5000 }],
        },
      };
      const holidayRes = validateBudgetTemplate(holiday);
      assert.equal(holidayRes.summary.totalExpense, 34000);
      assert.ok(holidayRes.summary.savingsRatePct < 15);
    });

    it('safely rejects malformed template schemas and handles empty arrays', () => {
      assert.equal(validateBudgetTemplate(null).valid, false);
      assert.equal(validateBudgetTemplate({ id: 'bad' }).valid, false);
      assert.equal(validateBudgetTemplate({ id: 'bad', state: { incomes: 'not-array' } }).valid, false);

      const emptyValid = validateBudgetTemplate({
        id: 'empty-tmpl',
        state: { incomes: [], expenses: [], savings: [] },
      });
      assert.equal(emptyValid.valid, true);
      assert.equal(emptyValid.summary.totalIncome, 0);
      assert.equal(emptyValid.summary.netRemaining, 0);
    });

    it('creates custom budget template with timestamp and sanitized numeric state', () => {
      const custom = createCustomTemplate({
        name: 'My Custom Plan',
        state: {
          incomes: [{ name: 'Salary', value: '30000' }],
          expenses: [{ name: 'Rent', value: '7500' }],
          savings: [{ name: 'Stocks', value: '5000' }],
        },
      });

      assert.ok(custom.id.startsWith('tmpl-'));
      assert.equal(custom.name, 'My Custom Plan');
      assert.equal(custom.state.incomes[0].value, 30000);
      assert.equal(custom.state.expenses[0].value, 7500);
      assert.equal(custom.state.savings[0].value, 5000);

      assert.throws(() => createCustomTemplate({ name: '' }), /cannot be empty/);
    });
  });

  describe('Cash Flow Sankey Multi-Stage Allocation Mathematical Engine', () => {
    function generateSankeyRibbonPath(x0, y0Top, y0Bot, x1, y1Top, y1Bot) {
      const dx = x1 - x0;
      const cx1 = x0 + dx * 0.5;
      const cx2 = x1 - dx * 0.5;
      return (
        `M ${x0.toFixed(1)} ${y0Top.toFixed(1)} ` +
        `C ${cx1.toFixed(1)} ${y0Top.toFixed(1)}, ${cx2.toFixed(1)} ${y1Top.toFixed(1)}, ${x1.toFixed(1)} ${y1Top.toFixed(1)} ` +
        `L ${x1.toFixed(1)} ${y1Bot.toFixed(1)} ` +
        `C ${cx2.toFixed(1)} ${y1Bot.toFixed(1)}, ${cx1.toFixed(1)} ${y0Bot.toFixed(1)}, ${x0.toFixed(1)} ${y0Bot.toFixed(1)} Z`
      );
    }

    function calculateSankeyFlows({
      totalIncome = 0,
      deductions = 0,
      needs = 0,
      wants = 0,
      savings = 0,
      remaining = 0,
      width = 600,
      height = 240,
    } = {}) {
      const hasData = totalIncome > 0 || deductions > 0 || needs > 0 || wants > 0 || savings > 0;
      if (!hasData) {
        return { hasData: false, nodes: [], links: [] };
      }

      const isDeficit = remaining < 0;
      const deficitAmount = isDeficit ? Math.abs(remaining) : 0;
      const surplus = Math.max(0, remaining);
      const takeHome = Math.max(0, totalIncome - deductions);

      const totalVolume = Math.max(totalIncome, deductions + needs + wants + savings, 0.0001);

      const padding = { top: 32, right: 140, bottom: 25, left: 100 };
      const plotWidth = width - padding.left - padding.right;
      const plotHeight = height - padding.top - padding.bottom;

      const colX = [padding.left, padding.left + plotWidth * 0.44, padding.left + plotWidth];
      const nodeWidth = 14;
      const nodeGap = 10;
      const maxGaps = 4;
      const availableBarHeight = Math.max(plotHeight - maxGaps * nodeGap, 40);
      const scale = availableBarHeight / totalVolume;

      const h = (val) => Math.max(val > 0 ? 3 : 0, val * scale);

      const hGross = h(totalIncome);
      const nodeGross = {
        id: 'gross',
        name: 'รายได้รวม',
        nameEn: 'Gross Income',
        x: colX[0],
        y: padding.top,
        width: nodeWidth,
        height: Math.max(hGross, 6),
        value: totalIncome,
        color: '#10b981',
      };

      const hDed = h(deductions);
      const hTakeHome = h(takeHome);

      const nodeDed = {
        id: 'deductions',
        name: 'หักตามกฎหมาย',
        nameEn: 'Deductions',
        x: colX[1],
        y: padding.top,
        width: nodeWidth,
        height: Math.max(hDed, deductions > 0 ? 4 : 0),
        value: deductions,
        color: '#8b5cf6',
      };

      const nodeTakeHome = {
        id: 'takeHome',
        name: 'รับสุทธิ',
        nameEn: 'Take-Home Pay',
        x: colX[1],
        y: nodeDed.y + nodeDed.height + (deductions > 0 ? nodeGap : 0),
        width: nodeWidth,
        height: Math.max(hTakeHome, takeHome > 0 ? 4 : 0),
        value: takeHome,
        color: '#0ea5e9',
      };

      const destSpecs = [
        {
          id: 'statutory',
          name: 'ภาษี & สังคม',
          nameEn: 'Tax & SSO',
          val: deductions,
          color: '#8b5cf6',
          from: 'deductions',
        },
        { id: 'needs', name: 'ค่าใช้จ่ายจำเป็น', nameEn: 'Living Needs', val: needs, color: '#f43f5e', from: 'takeHome' },
        {
          id: 'wants',
          name: 'ค่าใช้จ่ายผันแปร',
          nameEn: 'Lifestyle Wants',
          val: wants,
          color: '#ec4899',
          from: 'takeHome',
        },
        {
          id: 'savings',
          name: 'เงินออมและลงทุน',
          nameEn: 'Savings & Invest',
          val: savings,
          color: '#0284c7',
          from: 'takeHome',
        },
        {
          id: 'surplus',
          name: 'เงินคงเหลือสุทธิ',
          nameEn: 'Net Surplus',
          val: surplus,
          color: '#059669',
          from: 'takeHome',
        },
      ];

      let currDestY = padding.top;
      const rightNodes = [];
      for (const spec of destSpecs) {
        if (spec.val > 0) {
          const nodeH = Math.max(h(spec.val), 4);
          rightNodes.push({
            id: spec.id,
            name: spec.name,
            nameEn: spec.nameEn,
            x: colX[2],
            y: currDestY,
            width: nodeWidth,
            height: nodeH,
            value: spec.val,
            color: spec.color,
            from: spec.from,
          });
          currDestY += nodeH + nodeGap;
        }
      }

      const links = [];
      let grossSourceY = nodeGross.y;

      if (deductions > 0) {
        const linkH = nodeDed.height;
        links.push({
          source: 'gross',
          target: 'deductions',
          path: generateSankeyRibbonPath(
            nodeGross.x + nodeGross.width,
            grossSourceY,
            grossSourceY + linkH,
            nodeDed.x,
            nodeDed.y,
            nodeDed.y + nodeDed.height,
          ),
          color: '#8b5cf6',
          value: deductions,
        });
        grossSourceY += linkH;
      }

      if (takeHome > 0) {
        const linkH = Math.min(nodeTakeHome.height, nodeGross.y + nodeGross.height - grossSourceY);
        links.push({
          source: 'gross',
          target: 'takeHome',
          path: generateSankeyRibbonPath(
            nodeGross.x + nodeGross.width,
            grossSourceY,
            grossSourceY + linkH,
            nodeTakeHome.x,
            nodeTakeHome.y,
            nodeTakeHome.y + nodeTakeHome.height,
          ),
          color: '#0ea5e9',
          value: takeHome,
        });
      }

      const statutoryNode = rightNodes.find((n) => n.id === 'statutory');
      if (statutoryNode && deductions > 0) {
        links.push({
          source: 'deductions',
          target: 'statutory',
          path: generateSankeyRibbonPath(
            nodeDed.x + nodeDed.width,
            nodeDed.y,
            nodeDed.y + nodeDed.height,
            statutoryNode.x,
            statutoryNode.y,
            statutoryNode.y + statutoryNode.height,
          ),
          color: '#8b5cf6',
          value: deductions,
        });
      }

      let takeHomeSourceY = nodeTakeHome.y;
      for (const rNode of rightNodes.filter((n) => n.from === 'takeHome')) {
        const linkH = Math.min(rNode.height, nodeTakeHome.y + nodeTakeHome.height - takeHomeSourceY);
        links.push({
          source: 'takeHome',
          target: rNode.id,
          path: generateSankeyRibbonPath(
            nodeTakeHome.x + nodeTakeHome.width,
            takeHomeSourceY,
            takeHomeSourceY + linkH,
            rNode.x,
            rNode.y,
            rNode.y + rNode.height,
          ),
          color: rNode.color,
          value: rNode.value,
        });
        takeHomeSourceY += linkH;
      }

      const nodes = [nodeGross, nodeDed, nodeTakeHome, ...rightNodes];

      return {
        hasData: true,
        isDeficit,
        deficitAmount,
        totalVolume,
        nodes,
        links,
      };
    }

    it('generates valid closed SVG cubic Bézier ribbon paths', () => {
      const path = generateSankeyRibbonPath(50, 40, 80, 250, 60, 100);
      assert.ok(path.startsWith('M 50.0 40.0'));
      assert.ok(path.includes('C 150.0 40.0, 150.0 60.0, 250.0 60.0'));
      assert.ok(path.includes('L 250.0 100.0'));
      assert.ok(path.endsWith('Z'));
    });

    it('computes 3-stage multi-column flow coordinates with node conservation', () => {
      const budget = {
        totalIncome: 50000,
        deductions: 3500,
        needs: 20000,
        wants: 12000,
        savings: 8000,
        remaining: 6500,
      };

      const flow = calculateSankeyFlows(budget);
      assert.equal(flow.hasData, true);
      assert.equal(flow.isDeficit, false);
      assert.equal(flow.totalVolume, 50000);

      // Verify Nodes
      const grossNode = flow.nodes.find((n) => n.id === 'gross');
      const dedNode = flow.nodes.find((n) => n.id === 'deductions');
      const thNode = flow.nodes.find((n) => n.id === 'takeHome');
      const needsNode = flow.nodes.find((n) => n.id === 'needs');
      const surplusNode = flow.nodes.find((n) => n.id === 'surplus');

      assert.ok(grossNode);
      assert.ok(dedNode);
      assert.ok(thNode);
      assert.ok(needsNode);
      assert.ok(surplusNode);

      // Verify Column X positions
      assert.ok(grossNode.x < dedNode.x);
      assert.ok(dedNode.x === thNode.x);
      assert.ok(dedNode.x < needsNode.x);

      // Verify links
      assert.equal(flow.links.length, 7); // gross->ded, gross->th, ded->stat, th->needs, th->wants, th->savings, th->surplus
      for (const link of flow.links) {
        assert.ok(link.path.startsWith('M '));
        assert.ok(link.path.endsWith('Z'));
        assert.ok(link.value > 0);
      }
    });

    it('handles zero deductions and zero income edge cases safely', () => {
      const zeroFlow = calculateSankeyFlows({ totalIncome: 0 });
      assert.equal(zeroFlow.hasData, false);
      assert.equal(zeroFlow.nodes.length, 0);

      const noDedFlow = calculateSankeyFlows({
        totalIncome: 30000,
        deductions: 0,
        needs: 15000,
        wants: 5000,
        savings: 5000,
        remaining: 5000,
      });
      assert.equal(noDedFlow.hasData, true);
      const dedLink = noDedFlow.links.find((l) => l.target === 'deductions');
      assert.equal(dedLink, undefined);
    });

    it('detects deficit overspending states and flags negative cash flow', () => {
      const deficitBudget = {
        totalIncome: 30000,
        deductions: 2000,
        needs: 22000,
        wants: 10000,
        savings: 2000,
        remaining: -6000,
      };

      const flow = calculateSankeyFlows(deficitBudget);
      assert.equal(flow.hasData, true);
      assert.equal(flow.isDeficit, true);
      assert.equal(flow.deficitAmount, 6000);
      assert.equal(
        flow.nodes.find((n) => n.id === 'surplus'),
        undefined,
      );
    });
  });

  describe('Multi-Year Personal Income Tax Scenario Comparator & Bracket Creep Engine', () => {
    function computeStandardPit(totalIncome, otherDeductions = 0) {
      const gross = Math.max(0, Number(totalIncome) || 0);
      const expenseDed = Math.min(gross * 0.5, 100000);
      const personalDed = 60000;
      const totalDed = expenseDed + personalDed + Math.max(0, Number(otherDeductions) || 0);
      const netTaxable = Math.max(0, gross - totalDed);

      const brackets = [
        { max: 150000, rate: 0 },
        { max: 300000, rate: 0.05 },
        { max: 500000, rate: 0.1 },
        { max: 750000, rate: 0.15 },
        { max: 1000000, rate: 0.2 },
        { max: 2000000, rate: 0.25 },
        { max: 5000000, rate: 0.3 },
        { max: Infinity, rate: 0.35 },
      ];

      let tax = 0;
      let prev = 0;
      let topMarginalRate = 0;

      for (const b of brackets) {
        if (netTaxable > prev) {
          const taxableInBracket = Math.min(netTaxable - prev, b.max - prev);
          tax += taxableInBracket * b.rate;
          if (taxableInBracket > 0 && b.rate > 0) {
            topMarginalRate = Math.round(b.rate * 100);
          }
          prev = b.max;
        } else {
          break;
        }
      }

      const effectiveRate = gross > 0 ? (tax / gross) * 100 : 0;
      const takeHome = gross - tax;

      return {
        gross,
        totalDed,
        netTaxable,
        tax,
        effectiveRate: Math.round(effectiveRate * 100) / 100,
        topMarginalRate,
        takeHome,
      };
    }

    function compareTaxScenarios({
      baseIncome,
      baseDeductions = 0,
      scenarioIncome,
      scenarioDeductions = 0,
      inflationPct = 0,
    }) {
      const base = computeStandardPit(baseIncome, baseDeductions);
      const scenario = computeStandardPit(scenarioIncome, scenarioDeductions);

      const incomeDelta = scenario.gross - base.gross;
      const taxDelta = scenario.tax - base.tax;
      const takeHomeDelta = scenario.takeHome - base.takeHome;
      const marginalTaxOnDelta = incomeDelta > 0 ? Math.round((taxDelta / incomeDelta) * 100 * 100) / 100 : 0;
      const effectiveRateDelta = Math.round((scenario.effectiveRate - base.effectiveRate) * 100) / 100;
      const bracketShift = scenario.topMarginalRate !== base.topMarginalRate;

      const inflFactor = 1 + Math.max(0, Number(inflationPct) || 0) / 100;
      const realTakeHome = Math.round(scenario.takeHome / inflFactor);
      const realTakeHomeDelta = realTakeHome - base.takeHome;
      const bracketCreepLoss = scenario.gross >= base.gross && realTakeHomeDelta < 0 && inflationPct > 0;

      return {
        base,
        scenario,
        delta: {
          incomeDelta,
          taxDelta,
          takeHomeDelta,
          marginalTaxOnDelta,
          effectiveRateDelta,
          bracketShift,
        },
        bracketCreep: {
          inflationPct,
          realTakeHome,
          realTakeHomeDelta,
          bracketCreepLoss,
        },
      };
    }

    it('accurately compares standard salary raise scenarios and computes marginal tax on raise', () => {
      const res = compareTaxScenarios({
        baseIncome: 600000,
        baseDeductions: 0,
        scenarioIncome: 750000,
        scenarioDeductions: 0,
      });

      assert.equal(res.delta.incomeDelta, 150000);
      assert.ok(res.delta.taxDelta > 0);
      assert.equal(res.delta.takeHomeDelta, 150000 - res.delta.taxDelta);
      // Net taxable was 440k (in 10% bracket), rises to 590k (steps into 15% bracket)
      assert.equal(res.delta.bracketShift, true);
      assert.ok(res.delta.marginalTaxOnDelta >= 10);
    });

    it('identifies bracket creep loss when inflation outpaces nominal after-tax raise', () => {
      const res = compareTaxScenarios({
        baseIncome: 400000,
        baseDeductions: 0,
        scenarioIncome: 416000, // +4% nominal raise
        scenarioDeductions: 0,
        inflationPct: 5, // 5% inflation
      });

      assert.equal(res.delta.incomeDelta, 16000);
      assert.ok(res.delta.taxDelta > 0);
      assert.equal(res.bracketCreep.bracketCreepLoss, true);
      assert.ok(res.bracketCreep.realTakeHomeDelta < 0);
    });

    it('measures tax savings delta from additional tax deductions accurately', () => {
      const res = compareTaxScenarios({
        baseIncome: 800000,
        baseDeductions: 0,
        scenarioIncome: 800000,
        scenarioDeductions: 100000, // Extra ThaiESG
      });

      assert.equal(res.delta.incomeDelta, 0);
      assert.ok(res.delta.taxDelta < 0); // Negative tax delta = savings!
      assert.ok(res.delta.takeHomeDelta > 0); // Net take-home increases by tax savings!
      assert.equal(res.delta.takeHomeDelta, Math.abs(res.delta.taxDelta));
    });

    it('handles zero income and negative inputs gracefully without NaN', () => {
      const res = compareTaxScenarios({
        baseIncome: 0,
        scenarioIncome: 0,
      });

      assert.equal(res.base.tax, 0);
      assert.equal(res.scenario.tax, 0);
      assert.equal(res.delta.incomeDelta, 0);
      assert.equal(res.delta.taxDelta, 0);
      assert.equal(res.delta.marginalTaxOnDelta, 0);
      assert.equal(Number.isNaN(res.delta.effectiveRateDelta), false);
    });
  });

  describe('Debt Payoff Milestone Road & Interest Velocity Mathematical Engine', () => {
    function calculateDebtMilestoneRoad({ payoffOrder = [], totalDebt = 0, schedule = [], minOnlyMonths = 0 } = {}) {
      const totDebt = Math.max(0, Number(totalDebt) || 0);
      const initialMonthlyInterest = schedule.length > 0 ? schedule[0].interest || 0 : 0;
      let cumCleared = 0;

      const milestones = (payoffOrder || []).map((m, idx) => {
        const bal = Math.max(0, Number(m.balance) || 0);
        cumCleared += bal;
        const clearedPct = totDebt > 0 ? Math.min(100, Math.round((cumCleared / totDebt) * 100 * 10) / 10) : 100;
        const remainingDebt = Math.max(0, totDebt - cumCleared);
        const schedItem = schedule.find((s) => s.month === m.month) || schedule[schedule.length - 1] || { interest: 0 };
        const currentMonthlyInterest = schedItem.interest || 0;
        const velocityReductionPct =
          initialMonthlyInterest > 0
            ? Math.min(
                100,
                Math.round(((initialMonthlyInterest - currentMonthlyInterest) / initialMonthlyInterest) * 100),
              )
            : 100;

        return {
          step: idx + 1,
          name: m.name,
          month: m.month,
          balance: bal,
          clearedPct,
          remainingDebt,
          currentMonthlyInterest,
          velocityReductionPct,
          isFinal: idx === payoffOrder.length - 1,
        };
      });

      const finalMonth = milestones.length > 0 ? milestones[milestones.length - 1].month : 0;
      const monthsSavedVsMin = Math.max(0, minOnlyMonths - finalMonth);

      return {
        totalDebt: totDebt,
        initialMonthlyInterest,
        milestones,
        monthsSavedVsMin,
      };
    }

    it('computes chronological milestone checkpoints and proves 100% debt clearance on final milestone', () => {
      const payoffOrder = [
        { name: 'Credit Card A', month: 4, balance: 30000 },
        { name: 'Personal Loan B', month: 12, balance: 70000 },
      ];
      const schedule = [
        { month: 1, interest: 1600 },
        { month: 4, interest: 900 },
        { month: 12, interest: 0 },
      ];

      const road = calculateDebtMilestoneRoad({
        payoffOrder,
        totalDebt: 100000,
        schedule,
        minOnlyMonths: 24,
      });

      assert.equal(road.totalDebt, 100000);
      assert.equal(road.initialMonthlyInterest, 1600);
      assert.equal(road.milestones.length, 2);

      // Checkpoint 1
      assert.equal(road.milestones[0].step, 1);
      assert.equal(road.milestones[0].clearedPct, 30);
      assert.equal(road.milestones[0].remainingDebt, 70000);
      assert.ok(road.milestones[0].velocityReductionPct > 0);
      assert.equal(road.milestones[0].isFinal, false);

      // Final Checkpoint
      assert.equal(road.milestones[1].step, 2);
      assert.equal(road.milestones[1].clearedPct, 100);
      assert.equal(road.milestones[1].remainingDebt, 0);
      assert.equal(road.milestones[1].velocityReductionPct, 100);
      assert.equal(road.milestones[1].isFinal, true);
      assert.equal(road.monthsSavedVsMin, 12);
    });

    it('monitors interest velocity reduction across payoff progression', () => {
      const schedule = [
        { month: 1, interest: 2000 },
        { month: 6, interest: 1000 },
      ];
      const road = calculateDebtMilestoneRoad({
        payoffOrder: [{ name: 'Card', month: 6, balance: 50000 }],
        totalDebt: 50000,
        schedule,
        minOnlyMonths: 10,
      });

      assert.equal(road.initialMonthlyInterest, 2000);
      assert.equal(road.milestones[0].velocityReductionPct, 50); // 2000 -> 1000 is 50% reduction!
    });

    it('handles zero debts and empty schedules safely without NaN', () => {
      const emptyRoad = calculateDebtMilestoneRoad({});
      assert.equal(emptyRoad.totalDebt, 0);
      assert.equal(emptyRoad.milestones.length, 0);
      assert.equal(emptyRoad.monthsSavedVsMin, 0);
      assert.equal(emptyRoad.initialMonthlyInterest, 0);
    });
  });

  describe('Cross-Portfolio Asset Class Correlation Matrix & Diversification Engine', () => {
    const MACRO_CORRELATIONS = {
      equities_us: {
        equities_us: 1.0,
        equities_world: 0.88,
        bonds: 0.15,
        gold: 0.08,
        real_estate: 0.65,
        crypto: 0.45,
        cash: 0.0,
      },
      equities_world: {
        equities_us: 0.88,
        equities_world: 1.0,
        bonds: 0.2,
        gold: 0.12,
        real_estate: 0.6,
        crypto: 0.4,
        cash: 0.0,
      },
      bonds: {
        equities_us: 0.15,
        equities_world: 0.2,
        bonds: 1.0,
        gold: 0.22,
        real_estate: 0.25,
        crypto: -0.05,
        cash: 0.1,
      },
      gold: {
        equities_us: 0.08,
        equities_world: 0.12,
        bonds: 0.22,
        gold: 1.0,
        real_estate: 0.15,
        crypto: 0.18,
        cash: 0.0,
      },
      real_estate: {
        equities_us: 0.65,
        equities_world: 0.6,
        bonds: 0.25,
        gold: 0.15,
        real_estate: 1.0,
        crypto: 0.25,
        cash: 0.0,
      },
      crypto: {
        equities_us: 0.45,
        equities_world: 0.4,
        bonds: -0.05,
        gold: 0.18,
        real_estate: 0.25,
        crypto: 1.0,
        cash: 0.0,
      },
      cash: { equities_us: 0.0, equities_world: 0.0, bonds: 0.1, gold: 0.0, real_estate: 0.0, crypto: 0.0, cash: 1.0 },
    };

    function detectAssetClass(name, ticker = '') {
      const s = `${name} ${ticker}`.toLowerCase();
      if (s.includes('gold') || s.includes('ทอง') || s.includes('iau') || s.includes('gld')) return 'gold';
      if (
        s.includes('bond') ||
        s.includes('bnd') ||
        s.includes('พันธบัตร') ||
        s.includes('gov') ||
        s.includes('debt') ||
        s.includes('ตราสารหนี้')
      )
        return 'bonds';
      if (s.includes('reit') || s.includes('vnq') || s.includes('อสังหา')) return 'real_estate';
      if (s.includes('btc') || s.includes('eth') || s.includes('crypto') || s.includes('เหรียญ')) return 'crypto';
      if (s.includes('cash') || s.includes('เงินสด') || s.includes('saving')) return 'cash';
      if (s.includes('vt') || s.includes('acwi') || s.includes('world') || s.includes('โลก') || s.includes('eunl'))
        return 'equities_world';
      return 'equities_us';
    }

    function calculatePortfolioDiversification(buckets = []) {
      let totalVal = 0;
      const classWeights = {};

      for (const b of (buckets || []).filter((b) => b.enabled !== false)) {
        for (const a of (b.assets || []).filter((a) => a.enabled !== false)) {
          const val = Math.max(0, Number(a.value) || 0);
          if (val > 0) {
            totalVal += val;
            const cls = detectAssetClass(a.name || '', a.ticker || '');
            classWeights[cls] = (classWeights[cls] || 0) + val;
          }
        }
      }

      const activeClasses = Object.keys(classWeights);
      if (totalVal <= 0 || activeClasses.length === 0) {
        return {
          totalVal: 0,
          weightedCorrelation: 1.0,
          diversificationScore: 0,
          tier: 'concentrated',
          classWeights: {},
          activeClasses: [],
        };
      }

      const normWeights = {};
      for (const cls of activeClasses) {
        normWeights[cls] = classWeights[cls] / totalVal;
      }

      let weightedCorrSum = 0;
      for (const c1 of activeClasses) {
        const w1 = normWeights[c1];
        for (const c2 of activeClasses) {
          const w2 = normWeights[c2];
          const corr =
            MACRO_CORRELATIONS[c1] && typeof MACRO_CORRELATIONS[c1][c2] === 'number'
              ? MACRO_CORRELATIONS[c1][c2]
              : c1 === c2
                ? 1.0
                : 0.5;
          weightedCorrSum += w1 * w2 * corr;
        }
      }

      const weightedCorrelation = Math.round(weightedCorrSum * 100) / 100;
      const diversificationScore = Math.max(0, Math.min(100, Math.round((1 - weightedCorrelation) * 100)));

      let tier = 'balanced';
      if (weightedCorrelation <= 0.5) tier = 'excellent';
      else if (weightedCorrelation <= 0.75) tier = 'balanced';
      else tier = 'concentrated';

      return {
        totalVal,
        weightedCorrelation,
        diversificationScore,
        tier,
        classWeights,
        activeClasses,
      };
    }

    it('proves high diversification score for balanced multi-asset portfolio (Equities, Bonds, Gold)', () => {
      const buckets = [
        {
          id: 'b1',
          assets: [
            { name: 'S&P 500 ETF (VOO)', value: 50000 },
            { name: 'Total Bond Market (BND)', value: 30000 },
            { name: 'Physical Gold (GLD)', value: 20000 },
          ],
        },
      ];

      const res = calculatePortfolioDiversification(buckets);
      assert.equal(res.totalVal, 100000);
      assert.ok(res.weightedCorrelation < 0.5); // Multi-asset correlation is low!
      assert.ok(res.diversificationScore > 50);
      assert.equal(res.tier, 'excellent');
    });

    it('identifies high concentration risk in single-asset or highly correlated tech portfolios', () => {
      const buckets = [
        {
          id: 'b1',
          assets: [
            { name: 'US Equities (VOO)', value: 60000 },
            { name: 'US Tech (QQQ)', value: 40000 },
          ],
        },
      ];

      const res = calculatePortfolioDiversification(buckets);
      assert.equal(res.totalVal, 100000);
      assert.equal(res.weightedCorrelation, 1.0); // 100% same asset class!
      assert.equal(res.diversificationScore, 0);
      assert.equal(res.tier, 'concentrated');
    });

    it('proves macro correlation matrix symmetry (rho_ij == rho_ji and rho_ii == 1.0)', () => {
      const keys = Object.keys(MACRO_CORRELATIONS);
      for (const k1 of keys) {
        assert.equal(MACRO_CORRELATIONS[k1][k1], 1.0);
        for (const k2 of keys) {
          assert.equal(MACRO_CORRELATIONS[k1][k2], MACRO_CORRELATIONS[k2][k1]);
        }
      }
    });

    it('handles zero or empty portfolios safely without NaN or crashes', () => {
      const emptyRes = calculatePortfolioDiversification([]);
      assert.equal(emptyRes.totalVal, 0);
      assert.equal(emptyRes.weightedCorrelation, 1.0);
      assert.equal(emptyRes.diversificationScore, 0);
      assert.equal(emptyRes.tier, 'concentrated');
    });
  });

  describe('Annual Cumulative Payslip Withholding vs PIT Reconciliation Bridge Engine', () => {
    function computeStandardThaiTax(taxableIncome) {
      let remaining = Math.max(0, Number(taxableIncome) || 0);
      let tax = 0;
      const brackets = [
        { limit: 150000, rate: 0 },
        { limit: 150000, rate: 0.05 },
        { limit: 200000, rate: 0.1 },
        { limit: 250000, rate: 0.15 },
        { limit: 250000, rate: 0.2 },
        { limit: 1000000, rate: 0.25 },
        { limit: 3000000, rate: 0.3 },
        { limit: Infinity, rate: 0.35 },
      ];
      for (const b of brackets) {
        if (remaining <= 0) break;
        const taxable = Math.min(remaining, b.limit);
        tax += taxable * b.rate;
        remaining -= taxable;
      }
      return tax;
    }

    function reconcilePayslipTaxWithholding({
      annualGrossIncome = 0,
      annualSso = 0,
      annualPvd = 0,
      additionalDeductions = 0,
      cumulativeWithheld = 0,
      baseAnnualNetTakeHome = 0,
    } = {}) {
      const gross = Math.max(0, Number(annualGrossIncome) || 0);
      const sso = Math.max(0, Number(annualSso) || 0);
      const pvd = Math.max(0, Number(annualPvd) || 0);
      const extraDed = Math.max(0, Number(additionalDeductions) || 0);
      const withheld = Math.max(0, Number(cumulativeWithheld) || 0);
      const baseNet = Math.max(0, Number(baseAnnualNetTakeHome) || 0);

      const expense = Math.min(gross * 0.5, 100000);
      const personal = 60000;
      const baseTaxable = Math.max(0, gross - expense - personal - sso - pvd);
      const finalTaxable = Math.max(0, baseTaxable - extraDed);

      const finalPitLiability = computeStandardThaiTax(finalTaxable);
      const baseTaxWithoutExtra = computeStandardThaiTax(baseTaxable);
      const taxSavingsFromExtra = Math.max(0, baseTaxWithoutExtra - finalPitLiability);

      const netDelta = withheld - finalPitLiability;
      let status = 'exact';
      if (netDelta > 0.01) {
        status = 'refund';
      } else if (netDelta < -0.01) {
        status = 'payable';
      }

      const diffAmount = Math.abs(netDelta);
      const canInstallment = status === 'payable' && diffAmount >= 3000;
      const installmentMonths = canInstallment ? 3 : 1;
      const installmentMonthlyAmount = canInstallment ? Math.ceil(diffAmount / 3) : diffAmount;

      const adjustedAnnualTakeHome = status === 'refund' ? baseNet + diffAmount : Math.max(0, baseNet - diffAmount);

      return {
        gross,
        baseTaxable,
        finalTaxable,
        baseTaxWithoutExtra,
        finalPitLiability,
        taxSavingsFromExtra,
        cumulativeWithheld: withheld,
        netDelta,
        diffAmount,
        status,
        canInstallment,
        installmentMonths,
        installmentMonthlyAmount,
        adjustedAnnualTakeHome,
      };
    }

    it('identifies tax refund from additional year-end deductions and increases net take-home', () => {
      // Annual salary 600,000 THB + 100,000 bonus = 700,000 gross
      // SSO = 9,000, PVD (5%) = 30,000
      // Employer withheld ~35,000 THB throughout the year
      // User adds 100,000 THB in ThaiESG & Insurance deductions
      const res = reconcilePayslipTaxWithholding({
        annualGrossIncome: 700000,
        annualSso: 9000,
        annualPvd: 30000,
        additionalDeductions: 100000,
        cumulativeWithheld: 35000,
        baseAnnualNetTakeHome: 626000,
      });

      assert.equal(res.status, 'refund');
      assert.ok(res.diffAmount > 0);
      assert.ok(res.taxSavingsFromExtra > 0);
      assert.ok(res.adjustedAnnualTakeHome > 626000);
      assert.equal(res.canInstallment, false);
    });

    it('identifies additional tax payable with 3-month interest-free installment when liability exceeds withholding by >= 3,000 THB', () => {
      // Withheld: 10,000 THB, but true final tax is 25,000 THB -> payable = 15,000 THB
      const res = reconcilePayslipTaxWithholding({
        annualGrossIncome: 600000,
        annualSso: 9000,
        annualPvd: 0,
        additionalDeductions: 0,
        cumulativeWithheld: 10000,
        baseAnnualNetTakeHome: 581000,
      });

      assert.equal(res.status, 'payable');
      assert.ok(res.diffAmount >= 3000);
      assert.equal(res.canInstallment, true);
      assert.equal(res.installmentMonths, 3);
      assert.equal(res.installmentMonthlyAmount, Math.ceil(res.diffAmount / 3));
    });

    it('disallows installment plan when under-withheld tax difference is less than 3,000 THB', () => {
      const res = reconcilePayslipTaxWithholding({
        annualGrossIncome: 300000,
        annualSso: 9000,
        annualPvd: 0,
        additionalDeductions: 0,
        cumulativeWithheld: 1500,
        baseAnnualNetTakeHome: 290000,
      });

      // Taxable = 300,000 - 100,000 - 60,000 - 9,000 = 131,000 -> tax = 0 (under 150k bracket)
      // If withheld was 1500, that's actually a refund of 1500. Let's test a case where tax is ~2,000 and withheld is 0.
      const underPayRes = reconcilePayslipTaxWithholding({
        annualGrossIncome: 350000, // taxable = 350k - 100k - 60k - 9k = 181k -> tax = 31k * 5% = 1550 THB
        annualSso: 9000,
        annualPvd: 0,
        additionalDeductions: 0,
        cumulativeWithheld: 0, // difference = 1,550 THB (< 3,000)
        baseAnnualNetTakeHome: 341000,
      });

      assert.equal(underPayRes.status, 'payable');
      assert.equal(underPayRes.diffAmount, 1550);
      assert.equal(underPayRes.canInstallment, false);
      assert.equal(underPayRes.installmentMonths, 1);
    });

    it('handles exact withholding match and edge cases with zero inputs safely without NaN', () => {
      const exactRes = reconcilePayslipTaxWithholding({
        annualGrossIncome: 0,
        annualSso: 0,
        annualPvd: 0,
        additionalDeductions: 0,
        cumulativeWithheld: 0,
        baseAnnualNetTakeHome: 0,
      });

      assert.equal(exactRes.status, 'exact');
      assert.equal(exactRes.diffAmount, 0);
      assert.equal(exactRes.finalPitLiability, 0);
      assert.equal(exactRes.adjustedAnnualTakeHome, 0);
      assert.equal(Number.isNaN(exactRes.adjustedAnnualTakeHome), false);
    });
  });
});
