/**
 * Money Superapp - Life Insurance Adequacy & Term Life Premium Engine
 * Capital Needs Analysis, Human Life Value (HLV), and Pure Term Premium estimation.
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

  /**
   * Calculate Life Insurance Adequacy & Family Protection Gap
   * (Capital Needs Analysis + Human Life Value perspective)
   *
   * @param {Object} params
   * @param {number} [params.debtClearance=0] - Outstanding debts to clear (THB)
   * @param {number} [params.monthlyExpenses=0] - Monthly family living expenses (THB)
   * @param {number} [params.supportYears=10] - Number of years of family living expense support
   * @param {number} [params.childEducation=0] - Future education / milestone fund (THB)
   * @param {number} [params.emergencyCushion=0] - Transition / funeral / final expense reserve (THB)
   * @param {number} [params.liquidAssets=0] - Existing cash, savings, and liquid investments (THB)
   * @param {number} [params.existingCoverage=0] - Current death benefit / sum assured of policies (THB)
   * @param {number} [params.annualIncome=0] - Annual net income for HLV comparison (THB)
   * @param {number} [params.marginalTaxRate=0] - Marginal tax rate (%) for deduction savings
   * @returns {Object} Adequacy metrics, shortfall, HLV benchmark, and tax deduction estimates
   */
  function calculateInsuranceAdequacy(params) {
    params = params || {};
    var debtClearance = Math.max(0, parseNum(params.debtClearance));
    var monthlyExpenses = Math.max(0, parseNum(params.monthlyExpenses));
    var supportYears = params.supportYears !== undefined ? Math.max(0, parseNum(params.supportYears)) : 10;
    var childEducation = Math.max(0, parseNum(params.childEducation));
    var emergencyCushion = Math.max(0, parseNum(params.emergencyCushion));
    var liquidAssets = Math.max(0, parseNum(params.liquidAssets));
    var existingCoverage = Math.max(0, parseNum(params.existingCoverage));
    var annualIncome = Math.max(0, parseNum(params.annualIncome));
    var marginalTaxRate = Math.max(0, parseNum(params.marginalTaxRate));

    var livingNeeds = monthlyExpenses * 12 * supportYears;
    var totalCapitalNeeds = debtClearance + livingNeeds + childEducation + emergencyCushion;
    var totalExistingResources = liquidAssets + existingCoverage;

    var protectionGap = Math.max(0, totalCapitalNeeds - totalExistingResources);
    var surplus = Math.max(0, totalExistingResources - totalCapitalNeeds);

    var adequacyRatio = 100;
    if (totalCapitalNeeds > 0) {
      adequacyRatio = (totalExistingResources / totalCapitalNeeds) * 100;
    } else if (totalExistingResources === 0) {
      adequacyRatio = 100;
    }

    var status = 'adequate';
    if (totalCapitalNeeds > 0) {
      if (adequacyRatio < 50) {
        status = 'severe_shortfall';
      } else if (adequacyRatio < 100) {
        status = 'shortfall';
      } else if (adequacyRatio <= 130) {
        status = 'optimal';
      } else {
        status = 'surplus';
      }
    }

    // Human Life Value (HLV) standard multiplier: 7x annual income
    var hlvBenchmark = annualIncome > 0 ? annualIncome * 7 : 0;

    // Thai Personal Income Tax Section 47(1)(d):
    // General life insurance premiums deductible up to 100,000 THB/yr.
    // Estimated pure term/protection premium: ~1.5% of protection gap.
    var estimatedAnnualPremium = Math.round(protectionGap * 0.015);
    var deductibleAmount = Math.min(estimatedAnnualPremium, 100000);
    var potentialTaxSavings = Math.round(deductibleAmount * (marginalTaxRate / 100));

    return {
      debtClearance: debtClearance,
      livingNeeds: livingNeeds,
      monthlyExpenses: monthlyExpenses,
      supportYears: supportYears,
      childEducation: childEducation,
      emergencyCushion: emergencyCushion,
      totalCapitalNeeds: totalCapitalNeeds,
      liquidAssets: liquidAssets,
      existingCoverage: existingCoverage,
      totalExistingResources: totalExistingResources,
      protectionGap: protectionGap,
      surplus: surplus,
      adequacyRatio: Math.min(1000, Math.round(adequacyRatio * 10) / 10),
      status: status,
      hlvBenchmark: hlvBenchmark,
      estimatedAnnualPremium: estimatedAnnualPremium,
      deductibleAmount: deductibleAmount,
      potentialTaxSavings: potentialTaxSavings,
    };
  }

  /**
   * Phase 81: Calculate pure Term Life insurance market premium estimate
   *
   * @param {number} coverageGap - Protection shortfall in THB
   * @param {Object} [options]
   * @param {number} [options.ratePerMillion=3000] - Benchmark pure term annual premium per 1M THB (default: 3,000 THB)
   * @param {number} [options.marginalTaxRate=0] - Marginal tax bracket (%) for Section 47 tax deduction savings
   * @returns {Object} Structured premium estimate
   */
  function calculateTermLifePremiumEstimate(coverageGap, options) {
    var gap = Math.max(0, parseNum(coverageGap));
    options = options || {};
    var ratePerMillion = Math.max(1000, parseNum(options.ratePerMillion) || 3000);
    var marginalTaxRate = Math.max(0, Math.min(35, parseNum(options.marginalTaxRate) || 0));

    if (gap <= 0) {
      return {
        hasShortfall: false,
        coverageGap: 0,
        annualPremium: 0,
        monthlyPremium: 0,
        potentialTaxSavings: 0,
        netAnnualCost: 0,
        netMonthlyCost: 0,
        ratePerMillion: ratePerMillion,
      };
    }

    var annualPremium = Math.round((gap / 1000000) * ratePerMillion);
    var monthlyPremium = Math.max(100, Math.round(annualPremium / 12));
    var potentialTaxSavings = Math.round(Math.min(annualPremium, 100000) * (marginalTaxRate / 100));
    var netAnnualCost = Math.max(0, annualPremium - potentialTaxSavings);
    var netMonthlyCost = Math.max(0, Math.round(netAnnualCost / 12));

    return {
      hasShortfall: true,
      coverageGap: gap,
      annualPremium: annualPremium,
      monthlyPremium: monthlyPremium,
      potentialTaxSavings: potentialTaxSavings,
      netAnnualCost: netAnnualCost,
      netMonthlyCost: netMonthlyCost,
      marginalTaxRate: marginalTaxRate,
      ratePerMillion: ratePerMillion,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateInsuranceAdequacy = calculateInsuranceAdequacy;
  MoneyApp.calculateTermLifePremiumEstimate = calculateTermLifePremiumEstimate;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateInsuranceAdequacy === 'undefined') {
      global.calculateInsuranceAdequacy = calculateInsuranceAdequacy;
    }
    if (typeof global.calculateTermLifePremiumEstimate === 'undefined') {
      global.calculateTermLifePremiumEstimate = calculateTermLifePremiumEstimate;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
