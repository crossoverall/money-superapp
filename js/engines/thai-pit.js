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

  /**
   * Computes statutory Thai Personal Income Tax using progressive brackets.
   * @param {number|string} netIncome - Annual net taxable income in THB
   * @returns {number} Calculated PIT tax amount in THB (rounded to nearest integer)
   */
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
   * @typedef {Object} ThaiPITBracketStepDownResult
   * @property {number} netTaxableIncome - Annual net taxable income in THB
   * @property {number} currentRate - Active marginal tax rate (e.g. 0.20)
   * @property {number} currentRatePct - Active marginal tax rate percentage (e.g. 20)
   * @property {number} currentTierIndex - Index of current tier in THAI_PIT_TIERS (0-7)
   * @property {boolean} isTaxFree - True if in the 0% tax-free tier (<= 150,000 THB)
   * @property {number} lowerThreshold - Lower income boundary of current tier
   * @property {number} nextLowerRate - Marginal rate of next lower tier
   * @property {number} nextLowerRatePct - Percentage marginal rate of next lower tier
   * @property {number} amountToStepDown - Additional deduction needed to step down into lower bracket
   * @property {number} taxSavedAtStepDown - Tax saved at the marginal rate by stepping down
   * @property {number} stepDownRoiPct - Immediate guaranteed tax savings ROI percentage
   * @property {number} amountToTaxFree - Additional deduction needed to reach 0% bracket
   * @property {number} taxSavedToTaxFree - Total tax saved if reduced to 0% bracket
   * @property {number} progressInCurrentTierPct - Percentage progress through current tier span
   * @property {number} totalCurrentTax - Total PIT tax liability under current income
   */

  /**
   * Computes Thai Personal Income Tax Bracket Boundary Headroom & Step-Down Targets.
   * Calculates the exact deduction needed to drop into the next lower tax bracket,
   * the immediate guaranteed tax return ROI, and distance to reach the tax-free 0% threshold.
   *
   * @param {number|string} netTaxableIncome - Annual net taxable income after legal expenses and deductions
   * @returns {ThaiPITBracketStepDownResult} Tax bracket boundary metrics, step-down targets, and guaranteed savings
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
   * @typedef {Object} ThaiRetirementPoolParams
   * @property {number|string} [pvd=0] - Provident Fund contribution (THB)
   * @property {number|string} [rmf=0] - Retirement Mutual Fund investment (THB)
   * @property {number|string} [ssf=0] - Super Savings Fund investment (THB)
   * @property {number|string} [gpf=0] - Government Pension Fund contribution (THB)
   * @property {number|string} [nsf=0] - National Savings Fund contribution (THB)
   * @property {number|string} [pensionInsurance=0] - Annuity Life Insurance premium (THB)
   */

  /**
   * @typedef {Object} ThaiRetirementPoolResult
   * @property {number} pvd - Sanitized PVD amount
   * @property {number} rmf - Sanitized RMF amount
   * @property {number} ssf - Sanitized SSF amount
   * @property {number} gpf - Sanitized GPF amount
   * @property {number} nsf - Sanitized NSF amount
   * @property {number} pensionInsurance - Sanitized annuity insurance amount
   * @property {number} totalRaw - Total uncapped retirement investment sum
   * @property {number} effectiveTotal - Statutory effective deduction capped at 500,000 THB
   * @property {number} excess - Disallowed amount exceeding statutory 500,000 THB ceiling
   * @property {number} headroom - Remaining tax allowance capacity before reaching 500,000 THB
   * @property {number} utilizationPct - Percentage utilization of 500,000 THB ceiling
   * @property {'safe'|'warning'|'exceeded'} status - Compliance status
   * @property {boolean} isExceeded - True if total raw contributions exceed 500,000 THB
   */

  /**
   * Statutory 500k Retirement Deductions Pool Warning Engine (Section 47 Thai Revenue Code).
   * Combines PVD (Provident Fund), RMF, SSF, GPF, NSF, and Annuity Life Insurance under the statutory 500,000 THB ceiling.
   *
   * @param {ThaiRetirementPoolParams} [params]
   * @returns {ThaiRetirementPoolResult}
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
   * @typedef {Object} ThaiEsgDeductionResult
   * @property {number} effectiveDeduction - Statutory allowable deduction amount
   * @property {number} statutoryCap - Absolute statutory fund limit (100,000 for <2024, 300,000 for >=2024)
   * @property {number} maxAllowed - Max allowable considering 30% assessable income ceiling
   * @property {boolean} isExceeded - True if amount exceeds statutory or income limit
   * @property {number} excessAmount - Amount invested exceeding statutory allowance
   * @property {number} holdingYears - Required investment holding period (8 for <2024, 5 for >=2024)
   */

  /**
   * Evaluates Thailand ESG (ThaiESG) Fund statutory tax deduction allowance.
   * Statutory rules:
   * - 2024 onwards: Max 300,000 THB, capped at 30% of total assessable income, 5 years holding period.
   * - 2023: Max 100,000 THB, capped at 30% of total assessable income, 8 years holding period.
   *
   * @param {number|string} amount - Invested ThaiESG amount
   * @param {number|string} totalIncome - Total assessable income
   * @param {number|string} [taxYear=2024] - Tax year (e.g. 2023 vs 2024+)
   * @returns {ThaiEsgDeductionResult}
   */
  function evaluateThaiEsgDeduction(amount, totalIncome, taxYear) {
    var amt = Math.max(0, Number(amount) || 0);
    var inc = Math.max(0, Number(totalIncome) || 0);
    var year = Number(taxYear) > 0 ? Number(taxYear) : 2024;

    var statutoryCap = year < 2024 ? 100000 : 300000;
    var holdingYears = year < 2024 ? 8 : 5;
    var maxAllowed = Math.min(statutoryCap, inc > 0 ? inc * 0.3 : statutoryCap);
    var effectiveDeduction = Math.min(amt, maxAllowed);
    var isExceeded = amt > maxAllowed && inc > 0;
    var excessAmount = isExceeded ? amt - maxAllowed : 0;

    return {
      effectiveDeduction: effectiveDeduction,
      statutoryCap: statutoryCap,
      maxAllowed: maxAllowed,
      isExceeded: isExceeded,
      excessAmount: excessAmount,
      holdingYears: holdingYears,
    };
  }

  /**
   * @typedef {Object} ThaiEFilingChecklistItem
   * @property {string} id - Checklist requirement identifier
   * @property {boolean} completed - True if requirement is verified
   * @property {boolean} [isExceeded] - Excess flag for statutory pools
   */

  /**
   * @typedef {Object} ThaiEFilingPreFlightChecklistParams
   * @property {Object} [checks]
   * @property {boolean} [checks.doc50Tawi]
   * @property {boolean} [checks.pool500k]
   * @property {boolean} [checks.thaiEsg]
   * @property {boolean} [checks.consentRd]
   * @property {boolean} [checks.promptPayCitizen]
   * @property {Object} [retirementPool]
   * @property {boolean} [retirementPool.isExceeded]
   */

  /**
   * @typedef {Object} ThaiEFilingPreFlightChecklistResult
   * @property {Array<ThaiEFilingChecklistItem>} checklist - Pre-flight milestone checks
   * @property {number} completedCount - Number of satisfied requirements
   * @property {number} totalCount - Total number of requirements
   * @property {number} completionPct - Percentage of checklist completed
   * @property {boolean} isReady - True if 100% compliant and ready for filing
   * @property {boolean} hasRetirementExcess - True if retirement pool ceiling is violated
   */

  /**
   * Statutory ภ.ง.ด. 90/91 e-Filing Pre-Flight Checklist Evaluator.
   * Evaluates 5 statutory compliance milestones before filing on efiling.rd.go.th.
   *
   * @param {ThaiEFilingPreFlightChecklistParams} [params]
   * @returns {ThaiEFilingPreFlightChecklistResult}
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
   * @typedef {Object} ThaiEFilingWorksheetParams
   * @property {number|string} [salary=0] - Monthly salary (Section 40(1))
   * @property {number|string} [bonus=0] - Annual bonus (Section 40(1))
   * @property {number|string} [yearlyIncome=0] - Other annual employment income (Section 40(1))
   * @property {number|string} [freelance402=0] - Freelance/service income (Section 40(2))
   * @property {number|string} [dividend404b=0] - Domestic stock dividends (Section 40(4)(b))
   * @property {number} [dividendCitRate=0.2] - Corporate income tax rate of dividend paying company
   * @property {boolean} [applyDividendCredit=false] - Whether to include dividends and claim tax credit
   * @property {number|string} [spouseDeduction=0] - Non-earning spouse deduction (up to 60,000 THB)
   * @property {number|string} [childrenCount=0] - Number of qualifying children (30,000 THB each)
   * @property {number|string} [parentCount=0] - Number of qualifying elderly parents (30,000 THB each)
   * @property {number|string} [disabledCount=0] - Number of disabled dependents (60,000 THB each)
   * @property {number|string} [antenatalDeduction=0] - Antenatal and childbirth care expense (up to 60,000 THB)
   * @property {number|string} [sso=0] - Social Security contributions (up to 10,500 THB)
   * @property {number|string} [lifeInsurance=0] - General life insurance premium (up to 100,000 THB)
   * @property {number|string} [healthInsurance=0] - Health insurance premium (up to 25,000 THB)
   * @property {number|string} [parentHealthInsurance=0] - Parents' health insurance premium (up to 15,000 THB)
   * @property {number|string} [rmf=0] - RMF investment
   * @property {number|string} [ssf=0] - SSF investment
   * @property {number|string} [pvd=0] - PVD contribution
   * @property {number|string} [gpf=0] - GPF contribution
   * @property {number|string} [nsf=0] - NSF contribution
   * @property {number|string} [pensionInsurance=0] - Annuity life insurance premium
   * @property {number|string} [thaiEsg=0] - Thailand ESG fund investment
   * @property {number|string} [taxYear=2024] - Tax year for statutory rule evaluation (2023 vs 2024+)
   * @property {number|string} [homeLoanInterest=0] - Residential mortgage interest (up to 100,000 THB)
   * @property {number|string} [donationEdu=0] - Education / public hospital donations (2x allowance)
   * @property {number|string} [donationGeneral=0] - General charitable donations
   * @property {number|string} [taxWithheld50Tawi=0] - Total withholding tax deducted at source (50 Tawi)
   */

  /**
   * @typedef {Object} ThaiEFilingWorksheetDeductions
   * @property {number} groupA - Personal & Family allowances total
   * @property {number} groupB - Insurance & Retirement savings total
   * @property {number} groupC - Real estate & mortgage interest total
   * @property {number} groupD - Allowable charitable donations total
   * @property {number} totalDeductions - Sum of all statutory deductions
   */

  /**
   * @typedef {Object} ThaiEFilingWorksheetResult
   * @property {number} income401 - Total employment income (Section 40(1))
   * @property {number} income402 - Total freelance income (Section 40(2))
   * @property {number} income404b - Total dividend income (Section 40(4)(b))
   * @property {number} dividendCredit - Computed Section 47 ทวิ dividend tax credit
   * @property {number} totalAssessableIncome - Gross assessable income
   * @property {number} statutoryExpenseDeduction - 50% standard expense deduction (max 100,000 THB)
   * @property {number} incomeAfterExpense - Income after statutory expenses
   * @property {ThaiEFilingWorksheetDeductions} deductions - Deductions breakdown by groups A-D
   * @property {number} netTaxableIncome - Final net taxable income
   * @property {number} taxBracketPct - Top marginal tax rate reached (%)
   * @property {number} grossCalculatedTax - Progressive tax before credits
   * @property {number} taxAfterDividendCredit - Tax liability after dividend credit offset
   * @property {number} taxWithheld50Tawi - Tax already withheld at source (50 Tawi)
   * @property {number} netTaxDueOrRefund - Positive = refund receivable, negative = additional tax payable
   * @property {boolean} isRefund - True if taxpayer is owed a refund from Revenue Department
   * @property {boolean} isPayable - True if additional tax payment is required
   * @property {boolean} canInstallment - True if payable amount is >= 3,000 THB (eligible for 3-month installment)
   * @property {number} installment3Months - Monthly installment amount (3 equal payments)
   * @property {ThaiRetirementPoolResult} retirementPool - Retirement deductions pool metrics
   * @property {ThaiEsgDeductionResult} thaiEsg - ThaiESG deduction evaluation and holding rules
   */

  /**
   * Thai Revenue Department (ภ.ง.ด. 90/91) e-Filing Form Pre-fill Worksheet Engine.
   * Maps taxable incomes (40(1), 40(2), 40(4)(b)), statutory standard 50% expenses,
   * 4-group tax deductions, progressive PIT tax brackets, dividend tax credit,
   * and 50 Tawi withholding into statutory RD online e-filing boxes.
   *
   * @param {ThaiEFilingWorksheetParams} [params]
   * @returns {ThaiEFilingWorksheetResult}
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

    var taxYear = p.taxYear || 2024;
    var thaiEsgEval = evaluateThaiEsgDeduction(p.thaiEsg, assessableTotal, taxYear);
    var thaiEsg = thaiEsgEval.effectiveDeduction;
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
      thaiEsg: thaiEsgEval,
    };
  }

  /**
   * @typedef {Object} ThaiDividendLotInput
   * @property {string} [name=''] - Stock symbol or company name
   * @property {number|string} [amount] - Cash dividend amount in THB
   * @property {number|string} [dividend] - Alias for amount
   * @property {number|string} [corporateTaxRate=0.20] - Corporate tax rate paid by company (CIT)
   * @property {number|string} [withholdingRate=0.10] - Withholding tax rate at source (default 10%)
   */

  /**
   * @typedef {Object} ThaiDividendLotDetail
   * @property {string} name - Stock name/symbol
   * @property {number} amount - Net cash dividend received
   * @property {number} corporateTaxRate - CIT rate paid by issuing company
   * @property {number} creditFactor - Tax credit multiplier (t / (1 - t))
   * @property {number} taxCredit - Section 47 ทวิ dividend tax credit amount
   * @property {number} grossedUp - Grossed-up dividend income (dividend + credit)
   * @property {number} withholdingTax - Withholding tax deducted at source
   */

  /**
   * @typedef {Object} ThaiDividendScenarioResult
   * @property {'final_tax'|'claim_credit'} method - Filing scenario method
   * @property {number} [combinedNetIncome] - Taxable income including grossed-up dividends
   * @property {number} [combinedTaxLiability] - PIT tax on combined income
   * @property {number} [regularTaxLiability] - PIT tax on ordinary income excluding dividends
   * @property {number} regularWithheld - Tax withheld on ordinary income
   * @property {number} dividendWithheld - Withholding tax deducted from dividends
   * @property {number} dividendCreditClaimed - Total dividend tax credits claimed
   * @property {number} [totalCredits] - Total tax credits (regular withheld + dividend withheld + credit)
   * @property {number} totalTaxCost - Effective net tax liability for scenario
   * @property {number} netPayableOrRefund - Net cash due or refund
   */

  /**
   * @typedef {Object} ThaiDividendTaxCreditParams
   * @property {number|string|Array<ThaiDividendLotInput>} [dividends] - Cash dividend amount or array of dividend lots
   * @property {number|string} [dividendAmount] - Alias for dividends amount
   * @property {number|string} [corporateTaxRate=0.20] - Default corporate income tax rate (CIT, typically 0.20)
   * @property {number|string} [otherTaxableNetIncome=0] - Taxpayer's regular net taxable income before dividends
   * @property {number|string} [regularTaxWithheld=0] - Regular tax already withheld at source (50 Tawi)
   */

  /**
   * @typedef {Object} ThaiDividendTaxCreditResult
   * @property {number} totalDividends - Total net cash dividends
   * @property {number} totalDividendWht - Total 10% withholding tax deducted at source
   * @property {number} totalTaxCredit - Total Section 47 ทวิ dividend tax credit
   * @property {number} totalGrossedUp - Total grossed-up dividend income
   * @property {number} otherTaxableNetIncome - Domestic taxable net income before dividends
   * @property {number} combinedNetIncome - Combined taxable income under claim credit method
   * @property {ThaiDividendScenarioResult} scenarioFinalTax - Scenario A: 10% Final Tax without filing
   * @property {ThaiDividendScenarioResult} scenarioClaimCredit - Scenario B: Claim tax credit in ภ.ง.ด. 90
   * @property {'claim_credit'|'final_tax'|'equivalent'} optimalChoice - Statutorily optimal filing choice
   * @property {number} netTaxAdvantage - Net monetary advantage of optimal choice over alternative
   * @property {boolean} isClaimAdvantageous - True if claiming credit yields higher refund or lower tax
   * @property {Array<ThaiDividendLotDetail>} lotsDetail - Itemized breakdown per dividend lot
   */

  /**
   * Calculates Thai Stock Dividend Tax Credit (เครดิตภาษีเงินปันผล มาตรา 47 ทวิ)
   *
   * @param {ThaiDividendTaxCreditParams} [params]
   * @returns {ThaiDividendTaxCreditResult} Dividend tax credit metrics, scenarios, and optimal filing recommendation
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
  MoneyApp.evaluateThaiEsgDeduction = evaluateThaiEsgDeduction;
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
    if (typeof global.evaluateThaiEsgDeduction === 'undefined') {
      global.evaluateThaiEsgDeduction = evaluateThaiEsgDeduction;
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
