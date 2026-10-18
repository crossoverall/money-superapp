/**
 * Money Superapp - Thai Foreign Investment & Crypto Repatriation Tax Engine
 * Evaluates Revenue Department Orders P.161/2566 & P.162/2566 (Section 41 Paragraph 2).
 * Computes 180-day tax residency, pre-2024 grandfathering, principal capital exemptions,
 * and Double Tax Agreement (DTA) foreign tax credit offsets.
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
    { limit: 150000, rate: 0.0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  function computeThaiPitTax(netIncome) {
    if (global.MoneyApp && typeof global.MoneyApp.computeThaiPitTax === 'function') {
      return global.MoneyApp.computeThaiPitTax(netIncome);
    }
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
   * Evaluates Thai Foreign Investment Repatriation Tax (Revenue Dept Orders P.161/P.162)
   *
   * @param {Object} params
   * @param {number} [params.remittanceAmount=0] - Total foreign capital remitted into Thailand (THB)
   * @param {number} [params.pre2024AccumulatedAmount=0] - Funds earned prior to Jan 1, 2024 (100% grandfathered tax-exempt)
   * @param {number} [params.principalCapitalAmount=0] - Initial investment capital/principal (not taxable income)
   * @param {number} [params.daysInThailand=180] - Number of days residing in Thailand in the remittance tax year
   * @param {number} [params.foreignTaxPaidThb=0] - Foreign tax paid abroad eligible for DTA tax credit (THB)
   * @param {number} [params.otherTaxableNetIncome=0] - Domestic net taxable income in Thailand before remittance (THB)
   * @returns {Object} Tax liability, DTA credits, exemptions, and strategic repatriation guidance
   */
  function calculateForeignRepatriationTax(params) {
    params = params || {};
    var remittanceAmount = Math.max(0, parseNum(params.remittanceAmount));
    var pre2024AccumulatedAmount = Math.max(
      0,
      parseNum(params.pre2024AccumulatedAmount !== undefined ? params.pre2024AccumulatedAmount : params.pre2024Amount),
    );
    var principalCapitalAmount = Math.max(
      0,
      parseNum(params.principalCapitalAmount !== undefined ? params.principalCapitalAmount : params.principalAmount),
    );
    var daysInThailand = params.daysInThailand !== undefined ? parseNum(params.daysInThailand) : 180;
    var foreignTaxPaidThb = Math.max(
      0,
      parseNum(params.foreignTaxPaidThb !== undefined ? params.foreignTaxPaidThb : params.foreignTaxPaid),
    );
    var otherTaxableNetIncome = Math.max(
      0,
      parseNum(
        params.otherTaxableNetIncome !== undefined ? params.otherTaxableNetIncome : params.otherDomesticNetIncome,
      ),
    );

    var isTaxResident = daysInThailand >= 180;
    var isExempt = false;
    var exemptionReason = 'none';

    if (!isTaxResident) {
      isExempt = true;
      exemptionReason = 'non_resident_under_180_days';
      return {
        remittanceAmount: remittanceAmount,
        daysInThailand: daysInThailand,
        isTaxResident: false,
        isResident: false,
        isExempt: true,
        exemptionReason: exemptionReason,
        pre2024ExemptAmount: 0,
        capitalPrincipalExemptAmount: 0,
        totalExemptAmount: remittanceAmount,
        taxableRemittance: 0,
        grossThaiTaxOnRemittance: 0,
        allowableDtaCredit: 0,
        dtaForeignTaxCredit: 0,
        netThaiTaxPayable: 0,
        dtaSavings: 0,
        effectiveTaxRatePct: 0,
        effectiveTaxRate: 0,
        totalNetCashRetained: remittanceAmount,
        netRetainedInThailand: remittanceAmount,
      };
    }

    var pre2024ExemptAmount = Math.min(remittanceAmount, pre2024AccumulatedAmount);
    var remainingAfterPre2024 = Math.max(0, remittanceAmount - pre2024ExemptAmount);

    var capitalPrincipalExemptAmount = Math.min(remainingAfterPre2024, principalCapitalAmount);
    var taxableRemittance = Math.max(0, remainingAfterPre2024 - capitalPrincipalExemptAmount);

    if (remittanceAmount > 0 && taxableRemittance === 0) {
      isExempt = true;
      exemptionReason = pre2024ExemptAmount >= remittanceAmount ? 'pre_2024_grandfathered' : 'principal_capital_return';
    }

    var baseTax = computeThaiPitTax(otherTaxableNetIncome);
    var totalTaxWithRemittance = computeThaiPitTax(otherTaxableNetIncome + taxableRemittance);
    var grossThaiTaxOnRemittance = Math.max(0, totalTaxWithRemittance - baseTax);

    var allowableDtaCredit = Math.min(foreignTaxPaidThb, grossThaiTaxOnRemittance);
    var netThaiTaxPayable = Math.max(0, grossThaiTaxOnRemittance - allowableDtaCredit);

    var effectiveTaxRatePct =
      remittanceAmount > 0 ? Math.round((netThaiTaxPayable / remittanceAmount) * 10000) / 100 : 0;
    var totalNetCashRetained = remittanceAmount - netThaiTaxPayable;

    return {
      remittanceAmount: remittanceAmount,
      daysInThailand: daysInThailand,
      isTaxResident: true,
      isResident: true,
      isExempt: isExempt,
      exemptionReason: exemptionReason,
      pre2024ExemptAmount: pre2024ExemptAmount,
      capitalPrincipalExemptAmount: capitalPrincipalExemptAmount,
      totalExemptAmount: pre2024ExemptAmount + capitalPrincipalExemptAmount,
      taxableRemittance: taxableRemittance,
      grossThaiTaxOnRemittance: grossThaiTaxOnRemittance,
      allowableDtaCredit: allowableDtaCredit,
      dtaForeignTaxCredit: allowableDtaCredit,
      netThaiTaxPayable: netThaiTaxPayable,
      dtaSavings: allowableDtaCredit,
      effectiveTaxRatePct: effectiveTaxRatePct,
      effectiveTaxRate: effectiveTaxRatePct,
      totalNetCashRetained: totalNetCashRetained,
      netRetainedInThailand: totalNetCashRetained,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateForeignRepatriationTax = calculateForeignRepatriationTax;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateForeignRepatriationTax === 'undefined') {
      global.calculateForeignRepatriationTax = calculateForeignRepatriationTax;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
