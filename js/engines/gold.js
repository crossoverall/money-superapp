/**
 * Money Superapp - Thai Gold Bar & Jewelry DCA Metrics Engine
 * Computes weight conversions (Baht, Salung, Gram, Troy Oz), cost basis, market valuation, and P/L.
 * Official Thai Gold Standards:
 * 1 บาททองคำแท่ง (96.5% Gold Bar) = 15.244 grams
 * 1 บาททองคำรูปพรรณ (96.5% Gold Jewelry) = 15.16 grams
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
   * @typedef {Object} ThaiGoldTrancheInput
   * @property {string} [id] - Tranche lot unique identifier
   * @property {string} [date] - Purchase date string
   * @property {'bar'|'jewelry'} [goldType='bar'] - Gold product type
   * @property {'baht'|'salung'|'gram'} [weightUnit='baht'] - Input weight unit
   * @property {number|string} [weight=0] - Lot weight quantity
   * @property {number|string} [costPerBaht=0] - Purchase price per baht weight (THB)
   * @property {number|string} [blockFee=0] - Block or craftsmanship fee (THB)
   */

  /**
   * @typedef {Object} ThaiGoldTrancheProcessed
   * @property {string} id - Lot ID
   * @property {string} date - Purchase date
   * @property {'bar'|'jewelry'} goldType - Standardized product type
   * @property {number} weightBaht - Weight normalized to Thai baht
   * @property {number} weightGrams - Weight normalized to grams
   * @property {number} costPerBaht - Cost per baht weight
   * @property {number} blockFee - Block fee
   * @property {number} totalCost - Total cost for this tranche
   */

  /**
   * @typedef {Object} ThaiGoldParams
   * @property {'bar'|'jewelry'} [goldType='bar'] - Gold product type ('bar' 15.244g or 'jewelry' 15.16g)
   * @property {'baht'|'salung'|'gram'} [weightUnit='baht'] - Input weight unit
   * @property {number|string} [weight=0] - Input weight quantity
   * @property {number|string} [costPerBaht=0] - Purchase price per baht weight (THB)
   * @property {number|string} [blockFee=0] - Block fee (ค่าบล็อก) or craft fee (ค่ากำเหน็จ) (THB)
   * @property {number|string} [currentMarketPrice=0] - Current selling price of Gold Traders Assoc (THB/baht)
   * @property {number|string} [currentBuybackPrice=0] - Current buyback price of Gold Traders Assoc (THB/baht)
   * @property {Array<ThaiGoldTrancheInput>} [tranches=[]] - Optional array of multiple DCA purchase lots
   */

  /**
   * @typedef {Object} ThaiGoldMetricsResult
   * @property {'bar'|'jewelry'} goldType - Active product type
   * @property {'baht'|'salung'|'gram'} weightUnit - Input unit
   * @property {number} weightBaht - Total holdings weight in Thai Baht
   * @property {number} weightGrams - Total holdings weight in Grams
   * @property {number} weightSalung - Total holdings weight in Salung
   * @property {number} weightTroyOz - Total holdings weight in Troy Ounces
   * @property {number} gramsPerBaht - Gram conversion factor applied (15.244 or 15.16)
   * @property {number} totalCost - Total acquisition cost basis in THB
   * @property {number} effectiveCostPerBaht - Average weighted break-even acquisition cost per Baht
   * @property {number} currentMarketPrice - GTA selling benchmark price (THB/baht)
   * @property {number} currentBuybackPrice - Effective GTA buyback price (THB/baht)
   * @property {number} marketValue - Portfolio market value at selling price (THB)
   * @property {number} liquidationValue - Immediate cash-in value at buyback price (THB)
   * @property {number} unrealizedGainLoss - Unrealized P/L vs market value (THB)
   * @property {number} unrealizedGainLossPct - Unrealized P/L percentage (%)
   * @property {number} liquidationGainLoss - Net liquidation P/L at buyback price (THB)
   * @property {number} liquidationGainLossPct - Net liquidation P/L percentage (%)
   * @property {number} breakEvenMarketPrice - Required market price to break even
   * @property {number} breakEvenBuybackPrice - Required buyback price to break even
   * @property {Array<ThaiGoldTrancheProcessed>} processedTranches - Itemized lot calculations
   */

  /**
   * Thai Gold Bar & Jewelry DCA P/L & Baht Weight Calculator
   *
   * @param {ThaiGoldParams} [params]
   * @returns {ThaiGoldMetricsResult} Comprehensive weight conversions, cost basis, valuation, and P/L
   */
  function calculateThaiGoldMetrics(params) {
    params = params || {};
    var goldType = params.goldType === 'jewelry' ? 'jewelry' : 'bar';
    var weightUnit = params.weightUnit || 'baht';
    var rawWeight = Math.max(0, parseNum(params.weight));
    var costPerBaht = Math.max(0, parseNum(params.costPerBaht));
    var blockFee = Math.max(0, parseNum(params.blockFee));
    var currentMarketPrice = Math.max(0, parseNum(params.currentMarketPrice));
    var currentBuybackPrice = Math.max(0, parseNum(params.currentBuybackPrice));

    var gramsPerBaht = goldType === 'jewelry' ? 15.16 : 15.244;

    var weightBaht = 0;
    if (weightUnit === 'salung') {
      weightBaht = rawWeight * 0.25;
    } else if (weightUnit === 'gram') {
      weightBaht = gramsPerBaht > 0 ? rawWeight / gramsPerBaht : 0;
    } else {
      weightBaht = rawWeight;
    }

    var weightGrams = weightBaht * gramsPerBaht;
    var weightSalung = weightBaht * 4;
    var weightTroyOz = weightGrams / 31.1034768;

    var tranches = Array.isArray(params.tranches) ? params.tranches : [];
    var totalTrancheBaht = 0;
    var totalTrancheCost = 0;
    var processedTranches = [];
    var i;
    var tr;
    var trType;
    var trGramsPerBaht;
    var trUnit;
    var trRawWeight;
    var trBaht;
    var trCostPerBaht;
    var trFee;
    var trTotalCost;

    if (tranches.length > 0) {
      for (i = 0; i < tranches.length; i++) {
        tr = tranches[i] || {};
        trType = tr.goldType === 'jewelry' ? 'jewelry' : 'bar';
        trGramsPerBaht = trType === 'jewelry' ? 15.16 : 15.244;
        trUnit = tr.weightUnit || 'baht';
        trRawWeight = Math.max(0, parseNum(tr.weight));
        trBaht =
          trUnit === 'salung'
            ? trRawWeight * 0.25
            : trUnit === 'gram'
              ? trGramsPerBaht > 0
                ? trRawWeight / trGramsPerBaht
                : 0
              : trRawWeight;
        trCostPerBaht = Math.max(0, parseNum(tr.costPerBaht));
        trFee = Math.max(0, parseNum(tr.blockFee));
        trTotalCost = trBaht * trCostPerBaht + trFee;

        totalTrancheBaht += trBaht;
        totalTrancheCost += trTotalCost;

        processedTranches.push({
          id: tr.id || `tranche_${i}`,
          date: tr.date || '',
          goldType: trType,
          weightBaht: Math.round(trBaht * 10000) / 10000,
          weightGrams: Math.round(trBaht * trGramsPerBaht * 100) / 100,
          costPerBaht: trCostPerBaht,
          blockFee: trFee,
          totalCost: trTotalCost,
        });
      }
    }

    var activeWeightBaht = tranches.length > 0 ? totalTrancheBaht : weightBaht;
    var activeWeightGrams = activeWeightBaht * gramsPerBaht;
    var activeWeightSalung = activeWeightBaht * 4;
    var activeWeightTroyOz = activeWeightGrams / 31.1034768;

    var totalCost = tranches.length > 0 ? totalTrancheCost : activeWeightBaht * costPerBaht + blockFee;
    var effectiveCostPerBaht = activeWeightBaht > 0 ? totalCost / activeWeightBaht : 0;

    var effectiveBuybackPrice = currentBuybackPrice;
    if (effectiveBuybackPrice <= 0 && currentMarketPrice > 0) {
      if (goldType === 'bar') {
        effectiveBuybackPrice = Math.max(0, currentMarketPrice - 100);
      } else {
        effectiveBuybackPrice = Math.round(currentMarketPrice * 0.95);
      }
    }

    var marketValue = activeWeightBaht * currentMarketPrice;
    var liquidationValue = activeWeightBaht * effectiveBuybackPrice;

    var unrealizedGainLoss = marketValue - totalCost;
    var unrealizedGainLossPct = totalCost > 0 ? (unrealizedGainLoss / totalCost) * 100 : 0;

    var liquidationGainLoss = liquidationValue - totalCost;
    var liquidationGainLossPct = totalCost > 0 ? (liquidationGainLoss / totalCost) * 100 : 0;

    var breakEvenMarketPrice = effectiveCostPerBaht;
    var breakEvenBuybackPrice = goldType === 'bar' ? effectiveCostPerBaht + 100 : effectiveCostPerBaht / 0.95;

    return {
      goldType: goldType,
      weightUnit: weightUnit,
      weightBaht: Math.round(activeWeightBaht * 10000) / 10000,
      weightGrams: Math.round(activeWeightGrams * 100) / 100,
      weightSalung: Math.round(activeWeightSalung * 100) / 100,
      weightTroyOz: Math.round(activeWeightTroyOz * 1000) / 1000,
      gramsPerBaht: gramsPerBaht,
      totalCost: Math.round(totalCost),
      effectiveCostPerBaht: Math.round(effectiveCostPerBaht),
      currentMarketPrice: currentMarketPrice,
      currentBuybackPrice: effectiveBuybackPrice,
      marketValue: Math.round(marketValue),
      liquidationValue: Math.round(liquidationValue),
      unrealizedGainLoss: Math.round(unrealizedGainLoss),
      unrealizedGainLossPct: Math.round(unrealizedGainLossPct * 10) / 10,
      liquidationGainLoss: Math.round(liquidationGainLoss),
      liquidationGainLossPct: Math.round(liquidationGainLossPct * 10) / 10,
      breakEvenMarketPrice: Math.round(breakEvenMarketPrice),
      breakEvenBuybackPrice: Math.round(breakEvenBuybackPrice),
      processedTranches: processedTranches,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateThaiGoldMetrics = calculateThaiGoldMetrics;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateThaiGoldMetrics === 'undefined') {
      global.calculateThaiGoldMetrics = calculateThaiGoldMetrics;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
