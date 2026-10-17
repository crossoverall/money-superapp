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

  describe('Tax Bracket Waterfall Allocation & Headroom', () => {
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
});
