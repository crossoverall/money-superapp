/**
 * Money Superapp - Retirement 3-Bucket Cash Flow Allocation Engine
 * Computes Bucket 1 (Cash / 1-2 yrs), Bucket 2 (Income & Bonds / 3-7 yrs),
 * and Bucket 3 (Growth / Equities) targets, drawdown runway, Social Security offset,
 * and portfolio self-sustainability metrics.
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
   * Calculates Retirement 3-Bucket Cash Flow Allocation and Drawdown Schedule
   *
   * @param {Object} params
   * @param {number} [params.annualLivingExpense=360000] - Annual retirement living expense (THB)
   * @param {number} [params.monthlySsoPension=4125] - Monthly Social Security (ประกันสังคม) or guaranteed pension (THB)
   * @param {number} [params.monthlyElderlyAllowance=600] - Monthly government elderly allowance (เบี้ยผู้สูงอายุ) (THB)
   * @param {number} [params.totalRetirementAssets=6000000] - Total accumulated retirement net worth (THB)
   * @param {number} [params.bucket1Years=2] - Cash bucket coverage horizon (years, typically 1-2)
   * @param {number} [params.bucket2Years=5] - Income/Bonds bucket coverage horizon (years, typically 3-7)
   * @param {number} [params.bucket1YieldPct=1.5] - Annual return on cash/money market (%)
   * @param {number} [params.bucket2YieldPct=3.5] - Annual return on fixed income/bonds (%)
   * @param {number} [params.bucket3YieldPct=7.0] - Annual return on global equities/growth (%)
   * @returns {Object} 3-Bucket targets, net drawdowns, runway, and cash cushion resilience metrics
   */
  function calculateRetirementThreeBuckets(params) {
    params = params || {};
    var annualLivingExpense = Math.max(0, parseNum(params.annualLivingExpense));
    var monthlySsoPension = Math.max(0, parseNum(params.monthlySsoPension));
    var monthlyElderlyAllowance = Math.max(0, parseNum(params.monthlyElderlyAllowance));
    var totalRetirementAssets = Math.max(0, parseNum(params.totalRetirementAssets));
    var bucket1Years = Math.max(0.5, parseNum(params.bucket1Years) || 2);
    var bucket2Years = Math.max(1, parseNum(params.bucket2Years) || 5);
    var bucket1YieldPct = parseNum(params.bucket1YieldPct) || 1.5;
    var bucket2YieldPct = parseNum(params.bucket2YieldPct) || 3.5;
    var bucket3YieldPct = parseNum(params.bucket3YieldPct) || 7.0;

    var annualGuaranteedIncome = (monthlySsoPension + monthlyElderlyAllowance) * 12;
    var netAnnualDrawdown = Math.max(0, annualLivingExpense - annualGuaranteedIncome);
    var guaranteedIncomeCoveragePct =
      annualLivingExpense > 0 ? (annualGuaranteedIncome / annualLivingExpense) * 100 : 0;

    var bucket1Target = Math.round(netAnnualDrawdown * bucket1Years);
    var bucket2Target = Math.round(netAnnualDrawdown * bucket2Years);
    var defensiveNeeds = bucket1Target + bucket2Target;

    var bucket3Target = Math.max(0, totalRetirementAssets - defensiveNeeds);
    var isUnderfunded = totalRetirementAssets < defensiveNeeds;
    var shortfallAmount = isUnderfunded ? defensiveNeeds - totalRetirementAssets : 0;

    var bearMarketRunwayYears =
      netAnnualDrawdown > 0 ? Math.round(((bucket1Target + bucket2Target) / netAnnualDrawdown) * 10) / 10 : 99;

    var b1CashFlow = bucket1Target * (bucket1YieldPct / 100);
    var b2CashFlow = bucket2Target * (bucket2YieldPct / 100);
    var b3CashFlow = bucket3Target * (bucket3YieldPct / 100);
    var annualYieldCashFlow = Math.round(b1CashFlow + b2CashFlow + b3CashFlow);

    var blendedYieldPct =
      totalRetirementAssets > 0 ? Math.round((annualYieldCashFlow / totalRetirementAssets) * 10000) / 100 : 0;
    var isYieldSelfSustaining = annualYieldCashFlow >= netAnnualDrawdown && netAnnualDrawdown > 0;

    return {
      annualLivingExpense: Math.round(annualLivingExpense),
      annualGuaranteedIncome: Math.round(annualGuaranteedIncome),
      netAnnualDrawdown: Math.round(netAnnualDrawdown),
      guaranteedIncomeCoveragePct: Math.round(guaranteedIncomeCoveragePct * 10) / 10,
      bucket1Years: bucket1Years,
      bucket2Years: bucket2Years,
      bucket1Target: bucket1Target,
      bucket2Target: bucket2Target,
      bucket3Target: bucket3Target,
      totalRetirementAssets: Math.round(totalRetirementAssets),
      defensiveNeeds: defensiveNeeds,
      isUnderfunded: isUnderfunded,
      shortfallAmount: Math.round(shortfallAmount),
      bearMarketRunwayYears: bearMarketRunwayYears,
      annualYieldCashFlow: annualYieldCashFlow,
      blendedYieldPct: blendedYieldPct,
      isYieldSelfSustaining: isYieldSelfSustaining,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateRetirementThreeBuckets = calculateRetirementThreeBuckets;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateRetirementThreeBuckets === 'undefined') {
      global.calculateRetirementThreeBuckets = calculateRetirementThreeBuckets;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
