/**
 * Money Superapp - Thai Inheritance Tax & Annual Gift Tax Engine
 * Computes inheritance tax (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558),
 * annual gift tax exemptions (ประมวลรัษฎากร มาตรา 42(26)-(28) & 48(6)),
 * and multi-year phased lifetime gifting optimization.
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
   * Calculates Thai Inheritance Tax (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558)
   * and Annual Gift Tax (ประมวลรัษฎากร มาตรา 42(26)-(28) & 48(6)).
   *
   * @param {Object} params
   * @param {number} [params.estateValue=0] - Total legacy asset value (THB)
   * @param {'spouse'|'ascendant_descendant'|'other'} [params.heirRelationship='ascendant_descendant'] - Heir relationship to testator
   * @param {number} [params.numberOfHeirs=1] - Number of equal heirs sharing the estate
   * @param {number} [params.annualGiftValue=0] - Annual gift amount during lifetime (THB)
   * @param {'parent_to_child_realestate'|'family_movable'|'other_customary'} [params.giftType='family_movable'] - Gift classification
   * @param {number} [params.giftingYears=3] - Planned years for phased lifetime gifting
   * @returns {Object} Comprehensive inheritance tax, gift tax, and phased gifting strategy optimization
   */
  function calculateThaiInheritanceAndGiftTax(params) {
    params = params || {};
    var estateValue = Math.max(0, parseNum(params.estateValue));
    var heirRelationship = params.heirRelationship || 'ascendant_descendant';
    var numberOfHeirs = Math.max(1, Math.floor(parseNum(params.numberOfHeirs) || 1));
    var annualGiftValue = Math.max(0, parseNum(params.annualGiftValue));
    var giftType = params.giftType || 'family_movable';
    var giftingYears = Math.max(1, Math.floor(parseNum(params.giftingYears) || 3));

    // 1. Inheritance Tax Computation (พ.ร.บ. ภาษีการรับมรดก พ.ศ. 2558)
    var portionPerHeir = estateValue / numberOfHeirs;
    var statutoryExemptionPerHeir = 100000000; // 100 Million THB per heir per testator
    var taxRate = 0;
    var exemptionPerHeir = 0;
    var taxablePerHeir = 0;
    var taxPerHeir = 0;
    var totalInheritanceTax = 0;

    if (heirRelationship === 'spouse') {
      exemptionPerHeir = portionPerHeir;
      taxablePerHeir = 0;
      taxRate = 0;
      taxPerHeir = 0;
      totalInheritanceTax = 0;
    } else if (heirRelationship === 'ascendant_descendant') {
      exemptionPerHeir = Math.min(portionPerHeir, statutoryExemptionPerHeir);
      taxablePerHeir = Math.max(0, portionPerHeir - statutoryExemptionPerHeir);
      taxRate = 0.05;
      taxPerHeir = taxablePerHeir * taxRate;
      totalInheritanceTax = taxPerHeir * numberOfHeirs;
    } else {
      exemptionPerHeir = Math.min(portionPerHeir, statutoryExemptionPerHeir);
      taxablePerHeir = Math.max(0, portionPerHeir - statutoryExemptionPerHeir);
      taxRate = 0.1;
      taxPerHeir = taxablePerHeir * taxRate;
      totalInheritanceTax = taxPerHeir * numberOfHeirs;
    }

    var netLegacyReceived = estateValue - totalInheritanceTax;

    // 2. Annual Gift Tax Computation (ประมวลรัษฎากร ม.42(26)-(28))
    var annualGiftExemption = 20000000;
    if (giftType === 'other_customary') {
      annualGiftExemption = 10000000;
    } else {
      annualGiftExemption = 20000000;
    }

    var taxableAnnualGift = Math.max(0, annualGiftValue - annualGiftExemption);
    var annualGiftTaxRate = 0.05; // 5% Final Tax option under Section 48(6)
    var annualGiftTax = taxableAnnualGift * annualGiftTaxRate;
    var netAnnualGift = annualGiftValue - annualGiftTax;

    // 3. Phased Wealth Transfer Strategy Optimization
    var phasedAnnualExemptionPerHeir = heirRelationship === 'other' ? 10000000 : 20000000;
    var maxTaxFreeGiftingPerYear = phasedAnnualExemptionPerHeir * numberOfHeirs;
    var plannedLifetimeGifts = Math.min(estateValue, maxTaxFreeGiftingPerYear * giftingYears);
    var residualEstateForInheritance = Math.max(0, estateValue - plannedLifetimeGifts);
    var residualPortionPerHeir = residualEstateForInheritance / numberOfHeirs;
    var residualTaxablePerHeir = Math.max(0, residualPortionPerHeir - statutoryExemptionPerHeir);
    var strategyTaxOnResidual = heirRelationship === 'spouse' ? 0 : residualTaxablePerHeir * taxRate * numberOfHeirs;
    var strategyTaxSavings = Math.max(0, totalInheritanceTax - strategyTaxOnResidual);
    var strategyTaxSavingsPct = totalInheritanceTax > 0 ? (strategyTaxSavings / totalInheritanceTax) * 100 : 0;

    return {
      estateValue: estateValue,
      heirRelationship: heirRelationship,
      numberOfHeirs: numberOfHeirs,
      portionPerHeir: Math.round(portionPerHeir),
      statutoryExemptionPerHeir: statutoryExemptionPerHeir,
      exemptionPerHeir: Math.round(exemptionPerHeir),
      taxablePerHeir: Math.round(taxablePerHeir),
      taxRate: taxRate,
      taxPerHeir: Math.round(taxPerHeir),
      totalInheritanceTax: Math.round(totalInheritanceTax),
      netLegacyReceived: Math.round(netLegacyReceived),
      annualGiftValue: annualGiftValue,
      giftType: giftType,
      annualGiftExemption: annualGiftExemption,
      taxableAnnualGift: Math.round(taxableAnnualGift),
      annualGiftTaxRate: annualGiftTaxRate,
      annualGiftTax: Math.round(annualGiftTax),
      netAnnualGift: Math.round(netAnnualGift),
      giftingYears: giftingYears,
      plannedLifetimeGifts: Math.round(plannedLifetimeGifts),
      residualEstateForInheritance: Math.round(residualEstateForInheritance),
      strategyTaxOnResidual: Math.round(strategyTaxOnResidual),
      strategyTaxSavings: Math.round(strategyTaxSavings),
      strategyTaxSavingsPct: Math.round(strategyTaxSavingsPct * 10) / 10,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateThaiInheritanceAndGiftTax = calculateThaiInheritanceAndGiftTax;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateThaiInheritanceAndGiftTax === 'undefined') {
      global.calculateThaiInheritanceAndGiftTax = calculateThaiInheritanceAndGiftTax;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
