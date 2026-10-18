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
   * Thai Gold Bar & Jewelry DCA P/L & Baht Weight Calculator
   *
   * @param {Object} params
   * @param {'bar'|'jewelry'} [params.goldType='bar'] - Gold product type
   * @param {'baht'|'salung'|'gram'} [params.weightUnit='baht'] - Input weight unit
   * @param {number} [params.weight=0] - Input weight quantity
   * @param {number} [params.costPerBaht=0] - Purchase price per baht weight (THB)
   * @param {number} [params.blockFee=0] - Block fee (ค่าบล็อก) or craft fee (ค่ากำเหน็จ) (THB)
   * @param {number} [params.currentMarketPrice=0] - Current selling price of Gold Traders Assoc (THB/baht)
   * @param {number} [params.currentBuybackPrice=0] - Current buyback price of Gold Traders Assoc (THB/baht)
   * @param {Array<Object>} [params.tranches=[]] - Optional array of multiple DCA purchase lots
   * @returns {Object} Comprehensive weight conversions, cost basis, valuation, and P/L
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
