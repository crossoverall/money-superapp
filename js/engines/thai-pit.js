/**
 * Money Superapp - Thai Personal Income Tax (PIT) Calculation Engine
 * Thai Revenue Department (กรมสรรพากร) ภ.ง.ด. 90/91 e-Filing Worksheet,
 * Section 47 500k statutory retirement pool evaluator, tax bracket step-down,
 * and Section 47 ทวิ dividend tax credit calculator.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var parseNum = (val) => {
    if (global.MoneyApp && typeof global.MoneyApp.parseNum === 'function') {
      return global.MoneyApp.parseNum(val);
    }
    if (typeof val === 'number') return Number.isNaN(val) ? 0 : val;
    var clean = String(val || '')
      .replace(/,/g, '')
      .trim();
    var n = Number.parseFloat(clean);
    return Number.isNaN(n) ? 0 : n;
  };

  var THAI_PIT_TAX_BRACKETS = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  var THAI_PIT_TIERS = [
    { min: 0, max: 150000, rate: 0 },
    { min: 150000, max: 300000, rate: 0.05 },
    { min: 300000, max: 500000, rate: 0.1 },
    { min: 500000, max: 750000, rate: 0.15 },
    { min: 750000, max: 1000000, rate: 0.2 },
    { min: 1000000, max: 2000000, rate: 0.25 },
    { min: 2000000, max: 5000000, rate: 0.3 },
    { min: 5000000, max: Infinity, rate: 0.35 },
  ];

  function computeThaiPitTax(netIncome) {
    var remaining = Math.max(0, parseNum(netIncome));
    var totalTax = 0;
    var i;
    var b;
    var taxable;
    for (i = 0; i < THAI_PIT_TAX_BRACKETS.length; i++) {
      if (remaining <= 0) break;
      b = THAI_PIT_TAX_BRACKETS[i];
      taxable = Math.min(remaining, b.limit);
      totalTax += taxable * b.rate;
      remaining -= taxable;
    }
    return Math.round(totalTax);
  }

  /**
   * Computes Thai Personal Income Tax Bracket Boundary Headroom & Step-Down Targets.
   * Calculates the exact deduction needed to drop into the next lower tax bracket,
   * the immediate guaranteed tax return ROI, and distance to reach the tax-free 0% threshold.
   *
   * @param {number} netTaxableIncome - Annual net taxable income after legal expenses and deductions
   * @returns {Object} Tax bracket boundary metrics, step-down targets, and guaranteed savings
   */
  function calculateTaxBracketStepDown(netTaxableIncome) {
    var net = Math.max(0, parseNum(netTaxableIncome));
    var totalTax = computeThaiPitTax(net);

    // Identify current active tier
    var tierIndex = 0;
    var i;
    for (i = 0; i < THAI_PIT_TIERS.length; i++) {
      if (net > THAI_PIT_TIERS[i].min) {
        tierIndex = i;
      }
    }

    var currentTier = THAI_PIT_TIERS[tierIndex];
    var currentRate = currentTier.rate;
    var currentRatePct = Math.round(currentRate * 100);
    var isTaxFree = tierIndex === 0;

    var lowerThreshold = currentTier.min;
    var nextLowerRate = 0;
    var nextLowerRatePct = 0;
    if (tierIndex > 0) {
      nextLowerRate = THAI_PIT_TIERS[tierIndex - 1].rate;
      nextLowerRatePct = Math.round(nextLowerRate * 100);
    }

    var amountToStepDown = isTaxFree ? 0 : Math.max(0, net - lowerThreshold);
    var taxSavedAtStepDown = Math.round(amountToStepDown * currentRate);
    var stepDownRoiPct = currentRatePct;

    var amountToTaxFree = Math.max(0, net - 150000);
    var taxSavedToTaxFree = totalTax;

    var tierSpan = currentTier.max - currentTier.min;
    var progressInCurrentTierPct = 0;
    if (isTaxFree) {
      progressInCurrentTierPct = net > 0 ? Math.min(100, Math.round((net / 150000) * 1000) / 10) : 0;
    } else if (tierSpan !== Infinity) {
      progressInCurrentTierPct = Math.min(
        100,
        Math.max(0, Math.round(((net - currentTier.min) / tierSpan) * 1000) / 10),
      );
    } else {
      progressInCurrentTierPct = 100;
    }

    return {
      netTaxableIncome: net,
      currentRate: currentRate,
      currentRatePct: currentRatePct,
      currentTierIndex: tierIndex,
      isTaxFree: isTaxFree,
      lowerThreshold: lowerThreshold,
      nextLowerRate: nextLowerRate,
      nextLowerRatePct: nextLowerRatePct,
      amountToStepDown: amountToStepDown,
      taxSavedAtStepDown: taxSavedAtStepDown,
      stepDownRoiPct: stepDownRoiPct,
      amountToTaxFree: amountToTaxFree,
      taxSavedToTaxFree: taxSavedToTaxFree,
      progressInCurrentTierPct: progressInCurrentTierPct,
      totalCurrentTax: totalTax,
    };
  }

  /**
   * Statutory 500k Retirement Deductions Pool Warning Engine (Section 47 Thai Revenue Code).
   * Combines PVD (Provident Fund), RMF, SSF, GPF, NSF, and Annuity Life Insurance under the statutory 500,000 THB ceiling.
   */
  function calculateRetirementCeilingPool(params) {
    var p = params || {};
    var pvd = Math.max(0, Number(p.pvd) || 0);
    var rmf = Math.max(0, Number(p.rmf) || 0);
    var ssf = Math.max(0, Number(p.ssf) || 0);
    var gpf = Math.max(0, Number(p.gpf) || 0);
    var nsf = Math.max(0, Number(p.nsf) || 0);
    var pensionInsurance = Math.max(0, Number(p.pensionInsurance) || 0);

    var totalRaw = pvd + rmf + ssf + gpf + nsf + pensionInsurance;
    var CEILING = 500000;
    var effectiveTotal = Math.min(totalRaw, CEILING);
    var excess = Math.max(0, totalRaw - CEILING);
    var headroom = Math.max(0, CEILING - totalRaw);
    var utilizationPct = Number(Math.min(100, (totalRaw / CEILING) * 100).toFixed(1));

    var status = 'safe';
    if (totalRaw > CEILING) {
      status = 'exceeded';
    } else if (totalRaw >= 400000) {
      status = 'warning';
    }

    return {
      pvd: pvd,
      rmf: rmf,
      ssf: ssf,
      gpf: gpf,
      nsf: nsf,
      pensionInsurance: pensionInsurance,
      totalRaw: totalRaw,
      effectiveTotal: effectiveTotal,
      excess: excess,
      headroom: headroom,
      utilizationPct: utilizationPct,
      status: status,
      isExceeded: totalRaw > CEILING,
    };
  }

  /**
   * Statutory ภ.ง.ด. 90/91 e-Filing Pre-Flight Checklist Evaluator.
   * Evaluates 5 statutory compliance milestones before filing on efiling.rd.go.th.
   */
  function evaluateEFilingPreFlightChecklist(params) {
    var p = params || {};
    var checks = p.checks || {};
    var pool = p.retirementPool || {};

    var hasExcess = Boolean(pool.isExceeded);
    var item50Tawi = Boolean(checks.doc50Tawi);
    var itemPool500k = !hasExcess && Boolean(checks.pool500k);
    var itemThaiEsg = Boolean(checks.thaiEsg);
    var itemConsent = Boolean(checks.consentRd);
    var itemPromptPay = Boolean(checks.promptPayCitizen);

    var checklist = [
      { id: 'doc50Tawi', completed: item50Tawi },
      { id: 'pool500k', completed: itemPool500k, isExceeded: hasExcess },
      { id: 'thaiEsg', completed: itemThaiEsg },
      { id: 'consentRd', completed: itemConsent },
      { id: 'promptPayCitizen', completed: itemPromptPay },
    ];

    var completedCount = checklist.filter((item) => item.completed).length;
    var totalCount = checklist.length;
    var completionPct = Math.round((completedCount / totalCount) * 100);
    var isReady = completedCount === totalCount && !hasExcess;

    return {
      checklist: checklist,
      completedCount: completedCount,
      totalCount: totalCount,
      completionPct: completionPct,
      isReady: isReady,
      hasRetirementExcess: hasExcess,
    };
  }

  /**
   * Thai Revenue Department (ภ.ง.ด. 90/91) e-Filing Form Pre-fill Worksheet Engine.
   * Maps taxable incomes (40(1), 40(2), 40(4)(b)), statutory standard 50% expenses,
   * 4-group tax deductions, progressive PIT tax brackets, dividend tax credit,
   * and 50 Tawi withholding into statutory RD online e-filing boxes.
   */
  function calculateThaiEFilingWorksheet(params) {
    var p = params || {};
    var salary = Number(p.salary) || 0;
    var bonus = Number(p.bonus) || 0;
    var yearlyIncome = Number(p.yearlyIncome) || 0;
    var income401 = salary * 12 + bonus + yearlyIncome;
    var income402 = Number(p.freelance402) || 0;
    var dividend404b = Number(p.dividend404b) || 0;
    var citRate = typeof p.dividendCitRate === 'number' ? p.dividendCitRate : 0.2;
    var applyDividendCredit = Boolean(p.applyDividendCredit);

    // Standard 50% statutory expenses capped at 100,000 THB for 40(1) + 40(2)
    var combinedEarned = income401 + income402;
    var statutoryExpense = Math.min(100000, combinedEarned * 0.5);

    // Dividend tax credit
    var dividendCredit = 0;
    if (applyDividendCredit && dividend404b > 0 && citRate < 1 && citRate > 0) {
      dividendCredit = Math.round(dividend404b * (citRate / (1 - citRate)));
    }

    var assessableTotal = combinedEarned + (applyDividendCredit ? dividend404b + dividendCredit : 0);
    var incomeAfterExpense =
      Math.max(0, combinedEarned - statutoryExpense) + (applyDividendCredit ? dividend404b + dividendCredit : 0);

    // Group A: Personal & Family
    var selfDeduction = 60000;
    var spouse = Number(p.spouseDeduction) || 0;
    var children = (Number(p.childrenCount) || 0) * 30000;
    var parents = (Number(p.parentCount) || 0) * 30000;
    var disabled = (Number(p.disabledCount) || 0) * 60000;
    var antenatal = Math.min(60000, Number(p.antenatalDeduction) || 0);
    var groupA = selfDeduction + spouse + children + parents + disabled + antenatal;

    // Group B: Insurance & Retirement Funds
    var sso = Math.min(10500, Number(p.sso) || 0);
    var lifeIns = Math.min(100000, Number(p.lifeInsurance) || 0);
    var healthIns = Math.min(25000, Number(p.healthInsurance) || 0);
    var combinedLifeHealth = Math.min(100000, lifeIns + healthIns);
    var parentHealth = Math.min(15000, Number(p.parentHealthInsurance) || 0);

    // 500k retirement bundle (Section 47 Thai Revenue Code)
    var rmf = Number(p.rmf) || 0;
    var ssf = Number(p.ssf) || 0;
    var pvd = Number(p.pvd) || 0;
    var gpf = Number(p.gpf) || 0;
    var nsf = Number(p.nsf) || 0;
    var pensionIns = Number(p.pensionInsurance) || 0;
    var retirementPool = calculateRetirementCeilingPool({
      pvd: pvd,
      rmf: rmf,
      ssf: ssf,
      gpf: gpf,
      nsf: nsf,
      pensionInsurance: pensionIns,
    });
    var retirementBundle = retirementPool.effectiveTotal;

    var thaiEsg = Math.min(300000, Number(p.thaiEsg) || 0);
    var groupB = sso + combinedLifeHealth + parentHealth + retirementBundle + thaiEsg;

    // Group C: Real estate & mortgage interest
    var mortgageInterest = Math.min(100000, Number(p.homeLoanInterest) || 0);
    var groupC = mortgageInterest;

    // Group D: Donations
    var netBeforeDonation = Math.max(0, incomeAfterExpense - (groupA + groupB + groupC));
    var maxDonationCap = netBeforeDonation * 0.1;
    var donationEdu = (Number(p.donationEdu) || 0) * 2; // 2x allowance
    var donationGeneral = Number(p.donationGeneral) || 0;
    var totalDonationAllowable = Math.min(maxDonationCap, donationEdu + donationGeneral);
    var groupD = totalDonationAllowable;

    var totalDeductions = groupA + groupB + groupC + groupD;
    var netTaxableIncome = Math.max(0, incomeAfterExpense - totalDeductions);

    // Progressive Tax Calculation
    var tiers = [
      { limit: 150000, rate: 0.0 },
      { limit: 150000, rate: 0.05 },
      { limit: 200000, rate: 0.1 },
      { limit: 250000, rate: 0.15 },
      { limit: 250000, rate: 0.2 },
      { limit: 1000000, rate: 0.25 },
      { limit: 3000000, rate: 0.3 },
      { limit: Infinity, rate: 0.35 },
    ];

    var remaining = netTaxableIncome;
    var grossTax = 0;
    var topRatePct = 0;
    var i;
    var t;
    var taxableInTier;
    for (i = 0; i < tiers.length; i++) {
      if (remaining <= 0) break;
      t = tiers[i];
      taxableInTier = Math.min(remaining, t.limit);
      grossTax += Math.round(taxableInTier * t.rate);
      remaining -= taxableInTier;
      if (t.rate > 0 && taxableInTier > 0) {
        topRatePct = Math.round(t.rate * 100);
      }
    }

    var taxAfterDividendCredit = Math.max(0, grossTax - dividendCredit);
    var taxWithheld = Number(p.taxWithheld50Tawi) || 0;

    // Net outcome: positive = refund, negative = payable
    var netOutcome = taxWithheld + dividendCredit - grossTax;

    var isRefund = netOutcome > 0;
    var isPayable = netOutcome < 0;
    var payableAmount = Math.max(0, -netOutcome);
    var canInstallment = payableAmount >= 3000;
    var installmentAmount = canInstallment ? Math.ceil(payableAmount / 3) : 0;

    return {
      income401: income401,
      income402: income402,
      income404b: dividend404b,
      dividendCredit: dividendCredit,
      totalAssessableIncome: assessableTotal,
      statutoryExpenseDeduction: statutoryExpense,
      incomeAfterExpense: incomeAfterExpense,
      deductions: {
        groupA: groupA,
        groupB: groupB,
        groupC: groupC,
        groupD: groupD,
        totalDeductions: totalDeductions,
      },
      netTaxableIncome: netTaxableIncome,
      taxBracketPct: topRatePct,
      grossCalculatedTax: grossTax,
      taxAfterDividendCredit: taxAfterDividendCredit,
      taxWithheld50Tawi: taxWithheld,
      netTaxDueOrRefund: netOutcome,
      isRefund: isRefund,
      isPayable: isPayable,
      canInstallment: canInstallment,
      installment3Months: installmentAmount,
      retirementPool: retirementPool,
    };
  }

  /**
   * Calculates Thai Stock Dividend Tax Credit (เครดิตภาษีเงินปันผล มาตรา 47 ทวิ)
   *
   * @param {Object} params
   * @param {number|Array<Object>} [params.dividends] - Cash dividend amount or array of dividend lots
   * @param {number} [params.corporateTaxRate=0.20] - Default corporate income tax rate (CIT, typically 0.20)
   * @param {number} [params.otherTaxableNetIncome=0] - Taxpayer's regular net taxable income before dividends
   * @param {number} [params.regularTaxWithheld=0] - Regular tax already withheld at source (50 Tawi)
   * @returns {Object} Dividend tax credit metrics, scenarios, and optimal filing recommendation
   */
  function calculateThaiDividendTaxCredit(params) {
    params = params || {};
    var defaultCitRate = params.corporateTaxRate !== undefined ? parseNum(params.corporateTaxRate) : 0.2;
    var otherTaxableNetIncome = Math.max(0, parseNum(params.otherTaxableNetIncome));
    var regularTaxWithheld = Math.max(0, parseNum(params.regularTaxWithheld));

    var lots = [];
    var singleAmt;
    if (Array.isArray(params.dividends)) {
      lots = params.dividends.map((lot) => {
        var amt = Math.max(0, parseNum(lot.amount !== undefined ? lot.amount : lot.dividend));
        var cit = lot.corporateTaxRate !== undefined ? parseNum(lot.corporateTaxRate) : defaultCitRate;
        var whtRate = lot.withholdingRate !== undefined ? parseNum(lot.withholdingRate) : 0.1;
        return {
          name: lot.name || '',
          amount: amt,
          corporateTaxRate: cit,
          withholdingRate: whtRate,
        };
      });
    } else {
      singleAmt = Math.max(0, parseNum(params.dividends !== undefined ? params.dividends : params.dividendAmount));
      if (singleAmt > 0) {
        lots.push({
          name: 'Dividends',
          amount: singleAmt,
          corporateTaxRate: defaultCitRate,
          withholdingRate: 0.1,
        });
      }
    }

    var totalDividends = 0;
    var totalDividendWht = 0;
    var totalTaxCredit = 0;
    var totalGrossedUp = 0;
    var lotsDetail = [];
    var i;
    var item;
    var d;
    var t;
    var whtRate;
    var wht;
    var creditFactor;
    var credit;
    var grossed;

    for (i = 0; i < lots.length; i++) {
      item = lots[i];
      d = item.amount;
      t = item.corporateTaxRate;
      whtRate = item.withholdingRate;
      wht = Math.round(d * whtRate);

      creditFactor = t > 0 && t < 1 ? t / (1 - t) : 0;
      credit = Math.round(d * creditFactor);
      grossed = d + credit;

      totalDividends += d;
      totalDividendWht += wht;
      totalTaxCredit += credit;
      totalGrossedUp += grossed;

      lotsDetail.push({
        name: item.name,
        amount: d,
        corporateTaxRate: t,
        creditFactor: Math.round(creditFactor * 10000) / 10000,
        taxCredit: credit,
        grossedUp: grossed,
        withholdingTax: wht,
      });
    }

    var regularTaxLiability = computeThaiPitTax(otherTaxableNetIncome);
    var regularNetPayable = regularTaxLiability - regularTaxWithheld;

    var scenarioFinalTax = {
      method: 'final_tax',
      regularTaxLiability: regularTaxLiability,
      regularWithheld: regularTaxWithheld,
      dividendWithheld: totalDividendWht,
      dividendCreditClaimed: 0,
      totalTaxCost: regularTaxLiability + totalDividendWht,
      netPayableOrRefund: regularNetPayable + totalDividendWht,
    };

    var combinedNetIncome = otherTaxableNetIncome + totalGrossedUp;
    var combinedTaxLiability = computeThaiPitTax(combinedNetIncome);
    var totalCredits = regularTaxWithheld + totalDividendWht + totalTaxCredit;
    var combinedNetPayable = combinedTaxLiability - totalCredits;
    var combinedTaxCost = combinedTaxLiability - totalTaxCredit;

    var scenarioClaimCredit = {
      method: 'claim_credit',
      combinedNetIncome: combinedNetIncome,
      combinedTaxLiability: combinedTaxLiability,
      regularWithheld: regularTaxWithheld,
      dividendWithheld: totalDividendWht,
      dividendCreditClaimed: totalTaxCredit,
      totalCredits: totalCredits,
      totalTaxCost: combinedTaxCost,
      netPayableOrRefund: combinedNetPayable,
    };

    var netTaxAdvantage = scenarioFinalTax.totalTaxCost - scenarioClaimCredit.totalTaxCost;

    var optimalChoice = 'equivalent';
    if (netTaxAdvantage > 0) {
      optimalChoice = 'claim_credit';
    } else if (netTaxAdvantage < 0) {
      optimalChoice = 'final_tax';
    }

    return {
      totalDividends: totalDividends,
      totalDividendWht: totalDividendWht,
      totalTaxCredit: totalTaxCredit,
      totalGrossedUp: totalGrossedUp,
      otherTaxableNetIncome: otherTaxableNetIncome,
      combinedNetIncome: combinedNetIncome,
      scenarioFinalTax: scenarioFinalTax,
      scenarioClaimCredit: scenarioClaimCredit,
      optimalChoice: optimalChoice,
      netTaxAdvantage: Math.abs(netTaxAdvantage),
      isClaimAdvantageous: optimalChoice === 'claim_credit',
      lotsDetail: lotsDetail,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.THAI_PIT_TAX_BRACKETS = THAI_PIT_TAX_BRACKETS;
  MoneyApp.THAI_PIT_TIERS = THAI_PIT_TIERS;
  MoneyApp.computeThaiPitTax = computeThaiPitTax;
  MoneyApp.calculateTaxBracketStepDown = calculateTaxBracketStepDown;
  MoneyApp.calculateRetirementCeilingPool = calculateRetirementCeilingPool;
  MoneyApp.evaluateEFilingPreFlightChecklist = evaluateEFilingPreFlightChecklist;
  MoneyApp.calculateThaiEFilingWorksheet = calculateThaiEFilingWorksheet;
  MoneyApp.calculateThaiDividendTaxCredit = calculateThaiDividendTaxCredit;

  if (typeof global !== 'undefined') {
    if (typeof global.THAI_PIT_TAX_BRACKETS === 'undefined') {
      global.THAI_PIT_TAX_BRACKETS = THAI_PIT_TAX_BRACKETS;
    }
    if (typeof global.THAI_PIT_TIERS === 'undefined') {
      global.THAI_PIT_TIERS = THAI_PIT_TIERS;
    }
    if (typeof global.computeThaiPitTax === 'undefined') {
      global.computeThaiPitTax = computeThaiPitTax;
    }
    if (typeof global.calculateTaxBracketStepDown === 'undefined') {
      global.calculateTaxBracketStepDown = calculateTaxBracketStepDown;
    }
    if (typeof global.calculateRetirementCeilingPool === 'undefined') {
      global.calculateRetirementCeilingPool = calculateRetirementCeilingPool;
    }
    if (typeof global.evaluateEFilingPreFlightChecklist === 'undefined') {
      global.evaluateEFilingPreFlightChecklist = evaluateEFilingPreFlightChecklist;
    }
    if (typeof global.calculateThaiEFilingWorksheet === 'undefined') {
      global.calculateThaiEFilingWorksheet = calculateThaiEFilingWorksheet;
    }
    if (typeof global.calculateThaiDividendTaxCredit === 'undefined') {
      global.calculateThaiDividendTaxCredit = calculateThaiDividendTaxCredit;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
