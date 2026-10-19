/**
 * Money Superapp - Thai Land and Building Tax Engine
 * Computes statutory land and building property taxes (ภาษีที่ดินและสิ่งปลูกสร้าง พ.ร.บ. 2562)
 * for Agricultural, Primary Residential, Building-Only, Secondary Residential, Commercial,
 * and Vacant categories (including 3-year recurring unutilized land penalty surcharges).
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
   * @typedef {Object} ThaiPropertyTaxTierDetail
   * @property {string} labelTh - Thai bracket label
   * @property {string} labelEn - English bracket label
   * @property {number} ratePct - Applied statutory tax rate (%)
   * @property {number} taxableInTier - Assessable base subject to this tier (THB)
   * @property {number} taxInTier - Property tax calculated in this tier (THB)
   */

  /**
   * @typedef {Object} ThaiPropertyTaxParams
   * @property {'agricultural'|'residential_primary'|'residential_building_only'|'residential_secondary'|'commercial'|'vacant'} [landCategory='residential_primary'] - Land classification
   * @property {number|string} [appraisalValue=0] - Official government appraisal value (THB)
   * @property {number|string} [vacantConsecutiveYears=0] - Consecutive years left unutilized (for vacant land penalty)
   */

  /**
   * @typedef {Object} ThaiPropertyTaxResult
   * @property {'agricultural'|'residential_primary'|'residential_building_only'|'residential_secondary'|'commercial'|'vacant'} landCategory - Land category evaluated
   * @property {number} appraisalValue - Government appraisal value in THB
   * @property {number} exemptionAmount - Statutory value exemption applied in THB
   * @property {number} taxableBase - Net taxable property base after exemption in THB
   * @property {number} totalTax - Total annual land and building tax liability in THB
   * @property {number} effectiveRatePct - Effective property tax rate relative to appraisal value (%)
   * @property {number} marginalRatePct - Highest marginal statutory tax rate reached (%)
   * @property {Array<ThaiPropertyTaxTierDetail>} tiers - Progressive bracket breakdown
   * @property {boolean} canInstallment - True if eligible for 3-month installment payment (>= 3,000 THB)
   * @property {number} installmentMonthly - Monthly installment amount for 3 payments
   * @property {string} statutoryDeadline - Statutory payment deadline description
   */

  /**
   * Calculates Thai Land and Building Tax (ภาษีที่ดินและสิ่งปลูกสร้าง พ.ร.บ. 2562)
   *
   * @param {ThaiPropertyTaxParams} [params]
   * @returns {ThaiPropertyTaxResult} Tax liability, brackets breakdown, effective rate, and installment options
   */
  function calculateThaiLandAndBuildingTax(params) {
    params = params || {};
    var landCategory = params.landCategory || 'residential_primary';
    var appraisalValue = Math.max(0, parseNum(params.appraisalValue));
    var vacantConsecutiveYears = Math.max(0, parseNum(params.vacantConsecutiveYears));

    var exemptionAmount = 0;
    var rawTiers = [];
    var vacantSurcharge = 0;
    var periods = 0;

    if (landCategory === 'agricultural') {
      exemptionAmount = 50000000;
      rawTiers = [
        { limit: 75000000, rate: 0.0001, labelTh: '0 - 75 ล้านบาท (0.01%)', labelEn: '0 - 75M THB (0.01%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '75 - 100 ล้านบาท (0.03%)', labelEn: '75 - 100M THB (0.03%)' },
        { limit: 400000000, rate: 0.0005, labelTh: '100 - 500 ล้านบาท (0.05%)', labelEn: '100 - 500M THB (0.05%)' },
        { limit: 500000000, rate: 0.0007, labelTh: '500 - 1,000 ล้านบาท (0.07%)', labelEn: '500 - 1,000M THB (0.07%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 1,000 ล้านบาท (0.10%)', labelEn: 'Over 1,000M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_primary') {
      exemptionAmount = 50000000;
      rawTiers = [
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_building_only') {
      exemptionAmount = 10000000;
      rawTiers = [
        { limit: 40000000, rate: 0.0002, labelTh: '10 - 50 ล้านบาท (0.02%)', labelEn: '10 - 50M THB (0.02%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else if (landCategory === 'residential_secondary') {
      exemptionAmount = 0;
      rawTiers = [
        { limit: 50000000, rate: 0.0002, labelTh: '0 - 50 ล้านบาท (0.02%)', labelEn: '0 - 50M THB (0.02%)' },
        { limit: 25000000, rate: 0.0003, labelTh: '50 - 75 ล้านบาท (0.03%)', labelEn: '50 - 75M THB (0.03%)' },
        { limit: 25000000, rate: 0.0005, labelTh: '75 - 100 ล้านบาท (0.05%)', labelEn: '75 - 100M THB (0.05%)' },
        { limit: Infinity, rate: 0.001, labelTh: 'เกิน 100 ล้านบาท (0.10%)', labelEn: 'Over 100M THB (0.10%)' },
      ];
    } else {
      // commercial or vacant
      exemptionAmount = 0;
      if (landCategory === 'vacant' && vacantConsecutiveYears >= 3) {
        periods = Math.floor(vacantConsecutiveYears / 3);
        vacantSurcharge = periods * 0.003; // +0.3% every 3 years
      }
      rawTiers = [
        {
          limit: 50000000,
          rate: Math.min(0.03, 0.003 + vacantSurcharge),
          labelTh: '0 - 50 ล้านบาท',
          labelEn: '0 - 50M THB',
        },
        {
          limit: 150000000,
          rate: Math.min(0.03, 0.004 + vacantSurcharge),
          labelTh: '50 - 200 ล้านบาท',
          labelEn: '50 - 200M THB',
        },
        {
          limit: 800000000,
          rate: Math.min(0.03, 0.005 + vacantSurcharge),
          labelTh: '200 - 1,000 ล้านบาท',
          labelEn: '200 - 1,000M THB',
        },
        {
          limit: 4000000000,
          rate: Math.min(0.03, 0.006 + vacantSurcharge),
          labelTh: '1,000 - 5,000 ล้านบาท',
          labelEn: '1,000 - 5,000M THB',
        },
        {
          limit: Infinity,
          rate: Math.min(0.03, 0.007 + vacantSurcharge),
          labelTh: 'เกิน 5,000 ล้านบาท',
          labelEn: 'Over 5,000M THB',
        },
      ];
    }

    var taxableBase = Math.max(0, appraisalValue - exemptionAmount);
    var remaining = taxableBase;
    var totalTax = 0;
    var tiers = [];
    var marginalRatePct = 0;
    var i;
    var t;
    var taxableInTier;
    var taxInTier;

    for (i = 0; i < rawTiers.length; i++) {
      if (remaining <= 0 && tiers.length > 0) break;
      t = rawTiers[i];
      taxableInTier = Math.min(remaining, t.limit);
      taxInTier = Math.round(taxableInTier * t.rate);
      totalTax += taxInTier;
      remaining -= taxableInTier;
      marginalRatePct = Math.round(t.rate * 10000) / 100;

      tiers.push({
        labelTh: t.labelTh,
        labelEn: t.labelEn,
        ratePct: Math.round(t.rate * 10000) / 100,
        taxableInTier: taxableInTier,
        taxInTier: taxInTier,
      });
    }

    var effectiveRatePct = appraisalValue > 0 ? Math.round((totalTax / appraisalValue) * 10000) / 100 : 0;
    var canInstallment = totalTax >= 3000;
    var installmentMonthly = canInstallment ? Math.round((totalTax / 3) * 100) / 100 : 0;

    return {
      landCategory: landCategory,
      appraisalValue: appraisalValue,
      exemptionAmount: exemptionAmount,
      taxableBase: taxableBase,
      totalTax: totalTax,
      effectiveRatePct: effectiveRatePct,
      marginalRatePct: marginalRatePct,
      tiers: tiers,
      canInstallment: canInstallment,
      installmentMonthly: installmentMonthly,
      statutoryDeadline: '30 เมษายน (April 30)',
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateThaiLandAndBuildingTax = calculateThaiLandAndBuildingTax;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateThaiLandAndBuildingTax === 'undefined') {
      global.calculateThaiLandAndBuildingTax = calculateThaiLandAndBuildingTax;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
