/**
 * Money Superapp - Debt Acceleration, Consolidation & Refinance Engine
 * Simulates Avalanche vs Snowball debt payoff schedules with windfalls,
 * evaluates debt velocity comparison metrics, tax accrual & refund planning,
 * and computes personal loan debt consolidation & refinancing savings.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var formatMoney = (val) => {
    if (global.MoneyApp && typeof global.MoneyApp.formatMoney === 'function') {
      return global.MoneyApp.formatMoney(val);
    }
    return Number(val || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  /**
   * @typedef {Object} DebtPayoffItemInput
   * @property {string} [id] - Debt unique ID
   * @property {string} [name] - Debt descriptive name
   * @property {number|string} [balance=0] - Outstanding balance in THB
   * @property {number|string} [rate=0] - Annual interest rate (%)
   * @property {number|string} [minPayment=0] - Contractual minimum monthly payment in THB
   */

  /**
   * @typedef {Object} DebtPayoffWindfallInput
   * @property {number} amount - Windfall injection amount in THB
   * @property {number} month - Target month for lump-sum injection (1-based index)
   */

  /**
   * @typedef {Object} DebtPayoffMilestone
   * @property {string} id - Debt identifier
   * @property {string} name - Debt name
   * @property {number} month - Month when principal reached zero
   */

  /**
   * @typedef {Object} DebtTrajectoryPoint
   * @property {number} month - Month index
   * @property {number} balance - Aggregate remaining debt balance
   */

  /**
   * @typedef {Object} DebtPayoffSimulationResult
   * @property {number} months - Total months required to achieve debt-free status
   * @property {number} totalInterest - Cumulative interest accrued and paid (THB)
   * @property {number} totalPaid - Total cash paid out (principal + interest)
   * @property {Array<DebtPayoffMilestone>} payoffOrder - Chronological sequence of eliminated debts
   * @property {DebtPayoffMilestone|null} firstDebtCleared - First eliminated debt milestone
   * @property {Array<DebtTrajectoryPoint>} trajectory - Month-by-month debt balance trajectory
   */

  /**
   * Client-side Debt Payoff Simulation Engine.
   * Simulates month-by-month debt schedule under Avalanche or Snowball strategies,
   * accounting for minimum payments, interest accrual, rolled-over payments, and optional lump-sum windfalls.
   *
   * @param {Array<DebtPayoffItemInput>} debtsList - Active debt portfolio
   * @param {number|string} [extraMonthly=0] - Additional monthly debt acceleration budget (THB)
   * @param {'avalanche'|'snowball'} [strategy='avalanche'] - Acceleration allocation strategy
   * @param {DebtPayoffWindfallInput|null} [windfall] - Optional lump-sum cash injection
   * @returns {DebtPayoffSimulationResult} Payoff duration, total interest, and trajectory
   */
  function simulateDebtPayoff(debtsList, extraMonthly, strategy, windfall) {
    var rawDebts = Array.isArray(debtsList) ? debtsList : [];
    var extra = Math.max(0, Number(extraMonthly) || 0);
    var strat = strategy === 'snowball' ? 'snowball' : 'avalanche';
    var wf =
      windfall && windfall.amount > 0
        ? {
            amount: Math.max(0, Number(windfall.amount) || 0),
            month: Math.max(1, Math.round(Number(windfall.month) || 1)),
          }
        : null;

    var debts = rawDebts.map((d, idx) => ({
      id: d.id || `debt_${idx}`,
      name: d.name || `Debt ${idx + 1}`,
      balance: Math.max(0, Number(d.balance) || 0),
      rate: Math.max(0, Number(d.rate) || 0),
      minPayment: Math.max(0, Number(d.minPayment) || 0),
      paidOffMonth: null,
    }));

    var totalInitialDebt = debts.reduce((sum, d) => sum + d.balance, 0);
    if (totalInitialDebt <= 0) {
      return {
        months: 0,
        totalInterest: 0,
        totalPaid: 0,
        payoffOrder: [],
        firstDebtCleared: null,
        trajectory: [],
      };
    }

    var months = 0;
    var totalInterest = 0;
    var totalPaid = 0;
    var payoffOrder = [];
    var trajectory = [{ month: 0, balance: totalInitialDebt }];
    var MAX_MONTHS = 600; // 50-year circuit breaker

    while (months < MAX_MONTHS) {
      const remainingDebts = debts.filter((d) => d.balance > 0.001);
      if (remainingDebts.length === 0) break;

      months++;
      let monthPayment = 0;
      let totalAvailableBudget = extra;

      // 1. Lump-sum windfall injection in specified month
      if (wf && wf.month === months) {
        totalAvailableBudget += wf.amount;
      }

      // 2. Accrue interest & pay minimum payment
      for (let i = 0; i < debts.length; i++) {
        const d = debts[i];
        if (d.balance > 0.001) {
          const monthInterest = d.balance * (d.rate / 100 / 12);
          totalInterest += monthInterest;
          d.balance += monthInterest;

          const minPay = Math.min(d.balance, d.minPayment);
          d.balance -= minPay;
          monthPayment += minPay;

          if (d.balance <= 0.001 && d.paidOffMonth === null) {
            d.paidOffMonth = months;
            payoffOrder.push({ name: d.name, month: months, id: d.id });
          }
        } else {
          // Rollover minimum payment from paid-off debt
          totalAvailableBudget += d.minPayment;
        }
      }

      // 3. Allocate extra budget according to chosen strategy
      const activeDebts = debts.filter((d) => d.balance > 0.001);
      activeDebts.sort((a, b) => {
        if (strat === 'snowball') {
          return a.balance - b.balance || b.rate - a.rate;
        }
        return b.rate - a.rate || a.balance - b.balance;
      });

      for (let j = 0; j < activeDebts.length; j++) {
        if (totalAvailableBudget <= 0.001) break;
        const target = activeDebts[j];
        const extraPay = Math.min(target.balance, totalAvailableBudget);
        target.balance -= extraPay;
        monthPayment += extraPay;
        totalAvailableBudget -= extraPay;

        if (target.balance <= 0.001 && target.paidOffMonth === null) {
          target.paidOffMonth = months;
          payoffOrder.push({ name: target.name, month: months, id: target.id });
        }
      }

      totalPaid += monthPayment;
      const curTotal = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
      trajectory.push({ month: months, balance: Math.max(0, curTotal) });
    }

    var firstDebtCleared = payoffOrder.length > 0 ? payoffOrder[0] : null;

    return {
      months: months,
      totalInterest: Math.round(totalInterest),
      totalPaid: Math.round(totalPaid),
      payoffOrder: payoffOrder,
      firstDebtCleared: firstDebtCleared,
      trajectory: trajectory,
    };
  }

  /**
   * @typedef {Object} DebtVelocityParams
   * @property {Array<DebtPayoffItemInput>} [debts] - Active debt portfolio
   * @property {number|string} [extraPayment=0] - Extra monthly payment amount
   * @property {DebtPayoffWindfallInput|null} [windfall] - Optional windfall injection
   */

  /**
   * @typedef {Object} DebtVelocityComparisonResult
   * @property {DebtPayoffSimulationResult} baseline - Baseline schedule with minimum payments only
   * @property {DebtPayoffSimulationResult} avalanche - Accelerated schedule using mathematical Avalanche (highest interest first)
   * @property {DebtPayoffSimulationResult} snowball - Accelerated schedule using psychological Snowball (lowest balance first)
   * @property {number} interestDelta - Interest saved by Avalanche over Snowball in THB
   * @property {number} monthDelta - Additional months required by Snowball compared to Avalanche
   * @property {number} firstWinMonthDelta - Months earlier Snowball eliminates its first debt compared to Avalanche
   * @property {number} avMonthsSaved - Months saved by Avalanche relative to baseline
   * @property {number} snMonthsSaved - Months saved by Snowball relative to baseline
   * @property {number} avInterestSaved - Interest saved by Avalanche relative to baseline (THB)
   * @property {number} snInterestSaved - Interest saved by Snowball relative to baseline (THB)
   * @property {'avalanche'|'snowball'|'equal'} recommended - Recommended strategy based on mathematical & behavioral heuristics
   * @property {string} reasonTh - Thai recommendation rationale
   * @property {string} reasonEn - English recommendation rationale
   */

  /**
   * Snowball vs. Avalanche Visual Velocity Comparator Engine.
   *
   * @param {DebtVelocityParams} [params]
   * @returns {DebtVelocityComparisonResult} Comparative metrics, interest savings, and strategy recommendation
   */
  function compareDebtVelocity(params) {
    var p = params || {};
    var debts = Array.isArray(p.debts) ? p.debts : [];
    var extra = Math.max(0, Number(p.extraPayment) || 0);
    var windfall = p.windfall || null;

    var baseline = simulateDebtPayoff(debts, 0, 'avalanche', null);
    var avalanche = simulateDebtPayoff(debts, extra, 'avalanche', windfall);
    var snowball = simulateDebtPayoff(debts, extra, 'snowball', windfall);

    var interestDelta = Math.max(0, snowball.totalInterest - avalanche.totalInterest);
    var monthDelta = snowball.months - avalanche.months;

    var avFirstMonth = avalanche.firstDebtCleared ? avalanche.firstDebtCleared.month : 0;
    var snFirstMonth = snowball.firstDebtCleared ? snowball.firstDebtCleared.month : 0;
    var firstWinMonthDelta = avFirstMonth - snFirstMonth; // positive = snowball clears first debt faster

    var avMonthsSaved = Math.max(0, baseline.months - avalanche.months);
    var snMonthsSaved = Math.max(0, baseline.months - snowball.months);
    var avInterestSaved = Math.max(0, baseline.totalInterest - avalanche.totalInterest);
    var snInterestSaved = Math.max(0, baseline.totalInterest - snowball.totalInterest);

    // Recommendation logic
    var recommended = 'avalanche';
    var reasonTh = '';
    var reasonEn = '';

    if (debts.length <= 1) {
      recommended = 'equal';
      reasonTh = 'หนี้มีเพียงรายการเดียว ทั้ง Avalanche และ Snowball ให้ผลลัพธ์เท่ากันทุกประการ';
      reasonEn = 'Single debt item: Avalanche and Snowball strategies produce identical results.';
    } else if (interestDelta >= 2000) {
      recommended = 'avalanche';
      reasonTh = `แนะนำ Avalanche: ช่วยประหยัดดอกเบี้ยได้มากกว่า Snowball ถึง ${formatMoney(interestDelta)} บาท`;
      reasonEn = `Avalanche Recommended: Saves ${formatMoney(interestDelta)} THB more in interest than Snowball.`;
    } else if (firstWinMonthDelta >= 2) {
      recommended = 'snowball';
      reasonTh = `แนะนำ Snowball: ช่วยปิดหนี้ก้อนแรกได้เร็วกว่า ${firstWinMonthDelta} เดือน สร้างกำลังใจในการปลดหนี้ (ดอกเบี้ยต่างกันเพียง ${formatMoney(interestDelta)} บาท)`;
      reasonEn = `Snowball Recommended: Eliminates first debt ${firstWinMonthDelta} months earlier for quick momentum (interest difference is only ${formatMoney(interestDelta)} THB).`;
    } else {
      recommended = interestDelta > 0 ? 'avalanche' : 'equal';
      reasonTh =
        interestDelta > 0
          ? `Avalanche ประหยัดดอกเบี้ยกว่าเล็กน้อย (${formatMoney(interestDelta)} บาท)`
          : 'ทั้งสองวิธีให้ระยะเวลาและดอกเบี้ยใกล้เคียงกัน';
      reasonEn =
        interestDelta > 0
          ? `Avalanche saves slightly more interest (${formatMoney(interestDelta)} THB).`
          : 'Both strategies yield nearly identical duration and interest.';
    }

    return {
      baseline: baseline,
      avalanche: avalanche,
      snowball: snowball,
      interestDelta: interestDelta,
      monthDelta: monthDelta,
      firstWinMonthDelta: firstWinMonthDelta,
      avMonthsSaved: avMonthsSaved,
      snMonthsSaved: snMonthsSaved,
      avInterestSaved: avInterestSaved,
      snInterestSaved: snInterestSaved,
      recommended: recommended,
      reasonTh: reasonTh,
      reasonEn: reasonEn,
    };
  }

  /**
   * @typedef {Object} TaxAccrualPlanParams
   * @property {number|string} [calculatedTax=0] - Total annual PIT liability calculated
   * @property {number|string} [withheldTax=0] - Total tax withheld at source (50 Tawi)
   */

  /**
   * @typedef {Object} TaxAccrualPlanResult
   * @property {'payable'|'refund'|'balanced'} status - Net tax status
   * @property {number} amount - Absolute monetary amount (payable or refund)
   * @property {number} monthlyAccrual - Recommended monthly accrual reserve for next filing
   * @property {boolean} canInstallment - True if eligible for 3-month installment payment (>= 3,000 THB)
   * @property {number} installmentAmount - Payment per installment (3 payments)
   * @property {number} recommendedWindfall - Refund deployable towards debt payoff or investing
   */

  /**
   * Calculates Annual Tax Due Accrual & Tax Refund Windfall Planning Metrics.
   * Amortizes tax due into monthly reserves (12-month provision or 3-installment 0% plan),
   * or calculates refund windfall deployment amount for debt payoff or rebalancing.
   *
   * @param {TaxAccrualPlanParams} [params]
   * @returns {TaxAccrualPlanResult} Tax outcome status, amounts, monthly provisions, and windfall recommendation
   */
  function calculateTaxAccrualAndRefundPlan(params) {
    var p = params || {};
    var calc = Math.max(0, Number(p.calculatedTax) || 0);
    var wht = Math.max(0, Number(p.withheldTax) || 0);
    var net = calc - wht;
    var monthlyAccrual;
    var canInstallment;
    var installmentAmount;
    var refund;

    if (net > 0) {
      monthlyAccrual = Math.round(net / 12);
      canInstallment = net >= 3000;
      installmentAmount = canInstallment ? Math.round(net / 3) : net;
      return {
        status: 'payable',
        amount: net,
        monthlyAccrual: monthlyAccrual,
        canInstallment: canInstallment,
        installmentAmount: installmentAmount,
        recommendedWindfall: 0,
      };
    }
    if (net < 0) {
      refund = Math.abs(net);
      return {
        status: 'refund',
        amount: refund,
        monthlyAccrual: 0,
        canInstallment: false,
        installmentAmount: 0,
        recommendedWindfall: refund,
      };
    }
    return {
      status: 'balanced',
      amount: 0,
      monthlyAccrual: 0,
      canInstallment: false,
      installmentAmount: 0,
      recommendedWindfall: 0,
    };
  }

  /**
   * @typedef {Object} DebtConsolidationOptions
   * @property {Array<{balance?: number|string, rate?: number|string, minPayment?: number|string}>} [debts=[]] - Debts to consolidate
   * @property {number|string} [currentTotalInterest=0] - Current total interest projected across debts
   * @property {number|string} [currentTotalMinPayment=0] - Current combined monthly minimum payment
   * @property {number|string} [refinanceRate=9.9] - Offered consolidation loan APR (%)
   * @property {number|string} [refinanceTermMonths=36] - Consolidation loan term in months
   */

  /**
   * @typedef {Object} DebtConsolidationResult
   * @property {number} totalBalance - Aggregate balance consolidated (THB)
   * @property {number} weightedRate - Weighted average APR of original debts (%)
   * @property {number} refinanceRate - Offered APR of consolidation facility (%)
   * @property {number} refinanceTermMonths - Term duration (months)
   * @property {number} newMonthlyPayment - New fixed monthly payment under consolidation loan (THB)
   * @property {number} totalRefinanceInterest - Total interest payable under consolidated facility (THB)
   * @property {number} totalRefinancePaid - Total cash paid over consolidated loan term (THB)
   * @property {number} interestSaved - Net interest saved vs current debt trajectory (THB)
   * @property {number} monthlyPaymentDiff - Monthly cashflow relief (positive = freed cashflow, negative = extra required)
   * @property {'optimal'|'higher_interest'|'faster_payoff'|'no_debt'} verdict - Financial assessment verdict
   */

  /**
   * Debt Consolidation & Refinance Calculation Engine.
   * Calculates new monthly payment, total interest, interest savings, and monthly cash flow differential (relief or extra payment).
   *
   * @param {DebtConsolidationOptions} [options]
   * @returns {DebtConsolidationResult} Consolidation metrics including newMonthlyPayment, interestSaved, monthlyPaymentDiff, and verdict
   */
  function calculateDebtConsolidation(options) {
    var opts = options || {};
    var debts = opts.debts || [];
    var currentTotalInterest = Math.max(0, Number(opts.currentTotalInterest) || 0);
    var currentTotalMinPayment = Math.max(0, Number(opts.currentTotalMinPayment) || 0);
    var refinanceRate = opts.refinanceRate !== undefined ? Math.max(0, Number(opts.refinanceRate) || 0) : 9.9;
    var refinanceTermMonths =
      opts.refinanceTermMonths !== undefined ? Math.max(1, Math.floor(Number(opts.refinanceTermMonths) || 36)) : 36;

    var validDebts = [];
    var totalBalance = 0;
    var weightedSum = 0;
    var calculatedMin = 0;
    var i;
    var d;
    var bal;
    var rate;
    var min;

    for (i = 0; i < debts.length; i++) {
      d = debts[i];
      bal = Math.max(0, Number(d?.balance) || 0);
      rate = Math.max(0, Number(d?.rate) || 0);
      min = Math.max(0, Number(d?.minPayment) || 0);
      if (bal > 0) {
        validDebts.push({ balance: bal, rate: rate, minPayment: min });
        totalBalance += bal;
        weightedSum += bal * rate;
        calculatedMin += min;
      }
    }

    var totalMin = currentTotalMinPayment > 0 ? currentTotalMinPayment : calculatedMin;

    if (totalBalance <= 0) {
      return {
        totalBalance: 0,
        weightedRate: 0,
        refinanceRate: refinanceRate,
        refinanceTermMonths: refinanceTermMonths,
        newMonthlyPayment: 0,
        totalRefinanceInterest: 0,
        totalRefinancePaid: 0,
        interestSaved: 0,
        monthlyPaymentDiff: 0,
        verdict: 'no_debt',
      };
    }

    var weightedRate = weightedSum / totalBalance;
    var n = refinanceTermMonths;
    var monthlyR = refinanceRate / 100 / 12;

    var pmt = 0;
    if (monthlyR > 0) {
      pmt = (totalBalance * monthlyR) / (1 - (1 + monthlyR) ** -n);
    } else {
      pmt = totalBalance / n;
    }

    var totalRefinancePaid = pmt * n;
    var totalRefinanceInterest = Math.max(0, totalRefinancePaid - totalBalance);
    var interestSaved = Math.round(currentTotalInterest - totalRefinanceInterest);
    var monthlyPaymentDiff = Math.round(totalMin - pmt);

    var verdict = 'optimal';
    if (interestSaved <= 0) {
      verdict = 'higher_interest';
    } else if (monthlyPaymentDiff < 0) {
      verdict = 'faster_payoff';
    }

    return {
      totalBalance: Math.round(totalBalance),
      weightedRate: parseFloat(weightedRate.toFixed(2)),
      refinanceRate: refinanceRate,
      refinanceTermMonths: n,
      newMonthlyPayment: Math.round(pmt),
      totalRefinanceInterest: Math.round(totalRefinanceInterest),
      totalRefinancePaid: Math.round(totalRefinancePaid),
      interestSaved: interestSaved,
      monthlyPaymentDiff: monthlyPaymentDiff,
      verdict: verdict,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.simulateDebtPayoff = simulateDebtPayoff;
  MoneyApp.compareDebtVelocity = compareDebtVelocity;
  MoneyApp.calculateTaxAccrualAndRefundPlan = calculateTaxAccrualAndRefundPlan;
  MoneyApp.calculateDebtConsolidation = calculateDebtConsolidation;

  if (typeof global !== 'undefined') {
    if (typeof global.simulateDebtPayoff === 'undefined') {
      global.simulateDebtPayoff = simulateDebtPayoff;
    }
    if (typeof global.compareDebtVelocity === 'undefined') {
      global.compareDebtVelocity = compareDebtVelocity;
    }
    if (typeof global.calculateTaxAccrualAndRefundPlan === 'undefined') {
      global.calculateTaxAccrualAndRefundPlan = calculateTaxAccrualAndRefundPlan;
    }
    if (typeof global.calculateDebtConsolidation === 'undefined') {
      global.calculateDebtConsolidation = calculateDebtConsolidation;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
