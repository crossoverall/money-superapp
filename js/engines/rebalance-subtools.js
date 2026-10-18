/**
 * Money Superapp - Portfolio Auxiliary Sub-tools Engine (Roadmap Phase 98)
 * Encapsulates controllers, state persistence, UI sync, and presets for:
 * 1. Thai Gold Bar & Jewelry DCA Calculator & P/L Optimizer
 * 2. Foreign Investment & Crypto Repatriation Tax Advisor (Orders P.161 & P.162)
 * 3. Target Date Fund Glidepath Model & Lifecycle Allocation
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  // ==========================================
  // Storage Keys & Constants
  // ==========================================
  const GOLD_STORAGE_KEY = 'moneySuperapp.thaiGold.state.v1';
  const FOREIGN_TAX_STORAGE_KEY = 'money_superapp_foreign_tax_v1';
  const GLIDEPATH_STORAGE_KEY = 'money_superapp_glidepath_v1';

  // ==========================================
  // 1. Thai Gold Bar & Jewelry DCA Sub-tool
  // ==========================================
  let goldState = {
    isOpen: false,
    goldType: 'bar',
    weightUnit: 'baht',
    weight: 1,
    costPerBaht: 40000,
    blockFee: 150,
    marketPrice: 42000,
    lots: [],
  };

  function loadGoldState() {
    try {
      const saved =
        typeof global.MoneyApp?.safeJsonParse === 'function'
          ? global.MoneyApp.safeJsonParse(GOLD_STORAGE_KEY, null)
          : JSON.parse(localStorage.getItem(GOLD_STORAGE_KEY) || 'null');
      if (saved && typeof saved === 'object') {
        goldState = Object.assign({}, goldState, saved);
      }
    } catch (_e) {}
    return goldState;
  }

  function saveGoldState() {
    try {
      localStorage.setItem(GOLD_STORAGE_KEY, JSON.stringify(goldState));
    } catch (_e) {}
  }

  function toggleThaiGoldCalculator(layoutManager) {
    if (layoutManager) {
      layoutManager.toggleCard('panelThaiGold');
    } else if (typeof document !== 'undefined') {
      const panel = document.getElementById('goldPanelBody');
      if (!panel) return;
      const isHidden = panel.classList.contains('card-collapsed-hidden');
      panel.classList.toggle('card-collapsed-hidden', !isHidden);
    }
    updateGoldCalculator();
  }

  function updateGoldCalculator(save = true, context = {}) {
    if (typeof document === 'undefined') return;

    const typeEl = document.getElementById('selGoldType');
    const unitEl = document.getElementById('selGoldUnit');
    const weightEl = document.getElementById('inpGoldWeight');
    const costEl = document.getElementById('inpGoldCost');
    const feeEl = document.getElementById('inpGoldFee');
    const marketPriceEl = document.getElementById('inpGoldMarketPrice');

    if (!typeEl || !unitEl || !weightEl) return;

    const goldType = typeEl.value || 'bar';
    const weightUnit = unitEl.value || 'baht';
    const weight = Number.parseFloat(weightEl.value) || 0;
    const costPerBaht = Number.parseFloat(costEl?.value) || 0;
    const blockFee = Number.parseFloat(feeEl?.value) || 0;
    const marketPrice = Number.parseFloat(marketPriceEl?.value) || 0;

    goldState.goldType = goldType;
    goldState.weightUnit = weightUnit;
    goldState.weight = weight;
    goldState.costPerBaht = costPerBaht;
    goldState.blockFee = blockFee;
    goldState.marketPrice = marketPrice;

    const params = {
      goldType,
      weightUnit,
      weight,
      costPerBaht,
      blockFee,
      currentMarketPrice: marketPrice,
    };

    if (goldState.lots && goldState.lots.length > 0) {
      params.tranches = goldState.lots.map((lot) => ({
        goldType: lot.goldType || goldType,
        weightUnit: lot.weightUnit || 'baht',
        weight: lot.weight,
        costPerBaht: lot.costPerBaht,
        blockFee: lot.blockFee || 0,
      }));
    }

    const metrics = global.MoneyApp?.calculateThaiGoldMetrics?.(params) ?? {
      totalCost: weight * costPerBaht + blockFee,
      marketValue: weight * marketPrice,
      unrealizedGainLoss: weight * marketPrice - (weight * costPerBaht + blockFee),
      unrealizedGainLossPct: 0,
      liquidationValue: weight * marketPrice,
      liquidationGainLoss: 0,
      weightBaht: weight,
      weightGrams: weight * 15.244,
      weightSalung: weight * 4,
      weightTroyOz: weight * 0.4901,
      effectiveCostPerBaht: costPerBaht,
      breakEvenMarketPrice: costPerBaht,
      currentMarketPrice: marketPrice,
    };

    const isEn = (context.lang || global.LANG) === 'en';
    const formatMoney = context.formatMoney || global.MoneyApp?.formatMoney || ((v) => String(v));

    // Update Weight conversions bar
    const equivEl = document.getElementById('txtGoldWeightEquiv');
    if (equivEl) {
      if (isEn) {
        equivEl.textContent = `${metrics.weightBaht} Baht = ${metrics.weightGrams} g = ${metrics.weightSalung} Salung = ${metrics.weightTroyOz} oz`;
      } else {
        equivEl.textContent = `${metrics.weightBaht} บาท = ${metrics.weightGrams} กรัม = ${metrics.weightSalung} สลึง = ${metrics.weightTroyOz} ออนซ์`;
      }
    }

    // Cards
    const valCostEl = document.getElementById('valGoldTotalCost');
    const subCostEl = document.getElementById('subGoldAvgCost');
    const valMarketEl = document.getElementById('valGoldMarketVal');
    const subBreakEvenEl = document.getElementById('subGoldBreakEven');
    const valPLEl = document.getElementById('valGoldPL');
    const subPLPctEl = document.getElementById('subGoldPLPct');
    const valLiqEl = document.getElementById('valGoldLiquidation');
    const subLiqPLEl = document.getElementById('subGoldLiqPL');

    const unitStr = isEn ? 'THB' : 'บาท';

    if (valCostEl) valCostEl.textContent = `${formatMoney(metrics.totalCost)} ${unitStr}`;
    if (subCostEl) {
      subCostEl.textContent = isEn
        ? `Avg ${formatMoney(metrics.effectiveCostPerBaht)} THB/Baht`
        : `เฉลี่ย ${formatMoney(metrics.effectiveCostPerBaht)} บาท/บาท`;
    }
    if (valMarketEl) valMarketEl.textContent = `${formatMoney(metrics.marketValue)} ${unitStr}`;
    if (subBreakEvenEl) {
      subBreakEvenEl.textContent = isEn
        ? `Breakeven ${formatMoney(metrics.breakEvenMarketPrice)} THB/Baht`
        : `คุ้มทุน ${formatMoney(metrics.breakEvenMarketPrice)} บาท/บาท`;
    }

    if (valPLEl) {
      const isGain = metrics.unrealizedGainLoss >= 0;
      valPLEl.textContent = `${isGain ? '+' : ''}${formatMoney(metrics.unrealizedGainLoss)} ${unitStr}`;
      valPLEl.style.color = isGain ? 'var(--ok, #10b981)' : 'var(--danger, #ef4444)';
    }
    if (subPLPctEl) {
      const isGain = metrics.unrealizedGainLossPct >= 0;
      subPLPctEl.textContent = `${isGain ? '+' : ''}${metrics.unrealizedGainLossPct.toFixed(1)}%`;
      subPLPctEl.style.color = isGain ? 'var(--ok, #10b981)' : 'var(--danger, #ef4444)';
    }

    if (valLiqEl) valLiqEl.textContent = `${formatMoney(metrics.liquidationValue)} ${unitStr}`;
    if (subLiqPLEl) {
      const isGain = metrics.liquidationGainLoss >= 0;
      subLiqPLEl.textContent = isEn
        ? `Buyback P/L: ${isGain ? '+' : ''}${formatMoney(metrics.liquidationGainLoss)} ${unitStr}`
        : `ขายคืนวันนี้: ${isGain ? '+' : ''}${formatMoney(metrics.liquidationGainLoss)} บาท`;
    }

    if (save) {
      saveGoldState();
    }
  }

  function setGoldWeightPreset(weight, unit = 'baht') {
    if (typeof document === 'undefined') return;
    const weightEl = document.getElementById('inpGoldWeight');
    const unitEl = document.getElementById('selGoldUnit');
    if (weightEl) weightEl.value = weight;
    if (unitEl) unitEl.value = unit;

    document.querySelectorAll('.gold-pill').forEach((btn) => {
      btn.classList.remove('active');
    });
    const presetIdMap = {
      0.25: 'btnGoldSalung1',
      0.5: 'btnGoldSalung2',
      1: 'btnGoldBaht1',
      2: 'btnGoldBaht2',
      5: 'btnGoldBaht5',
      10: 'btnGoldBaht10',
    };
    const targetId = presetIdMap[weight];
    if (targetId) {
      const targetBtn = document.getElementById(targetId);
      if (targetBtn) targetBtn.classList.add('active');
    }

    updateGoldCalculator();
  }

  async function syncGoldMarketPrice(fetchFn) {
    if (typeof document === 'undefined') return;
    const btn = document.getElementById('btnSyncGoldPrice');
    const inp = document.getElementById('inpGoldMarketPrice');
    if (btn) btn.disabled = true;
    try {
      const fetcher = fetchFn || global.fetchThaiGoldPrice;
      if (typeof fetcher === 'function') {
        const data = await fetcher();
        if (data && data.price > 0) {
          if (inp) inp.value = Math.round(data.price);
          updateGoldCalculator();
        }
      }
    } catch (e) {
      console.warn('Failed to fetch gold price:', e);
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  function renderGoldLotsTable(context = {}) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('goldLotsContainer');
    const tbody = document.getElementById('goldLotsTableBody');
    if (!container || !tbody) return;

    if (!goldState.lots || goldState.lots.length === 0) {
      container.style.display = 'none';
      tbody.innerHTML = '';
      return;
    }

    const isEn = (context.lang || global.LANG) === 'en';
    const formatMoney = context.formatMoney || global.MoneyApp?.formatMoney || ((v) => String(v));
    const escapeHtml = context.escapeHtml || global.MoneyApp?.escapeHtml || ((v) => String(v));

    container.style.display = 'block';
    tbody.innerHTML = goldState.lots
      .map((lot, idx) => {
        const typeLabel = lot.goldType === 'jewelry' ? (isEn ? 'Jewelry' : 'รูปพรรณ') : isEn ? 'Bar' : 'แท่ง';
        let unitLabel = isEn ? 'Baht' : 'บาท';
        if (lot.weightUnit === 'salung') unitLabel = isEn ? 'Salung' : 'สลึง';
        else if (lot.weightUnit === 'gram') unitLabel = isEn ? 'g' : 'กรัม';

        return `
        <tr style="border-bottom:1px solid var(--line);">
          <td style="padding:4px 6px; color:var(--ink-dim);">${escapeHtml(lot.date || '-')}</td>
          <td style="padding:4px 6px; font-weight:600;">${typeLabel}</td>
          <td style="padding:4px 6px; text-align:right;">${lot.weight} ${unitLabel}</td>
          <td style="padding:4px 6px; text-align:right;">${formatMoney(lot.costPerBaht)}</td>
          <td style="padding:4px 6px; text-align:right;">${formatMoney(lot.blockFee || 0)}</td>
          <td style="padding:4px 6px; text-align:right;">
            <button type="button" onclick="removeGoldLot(${idx})" style="background:none; border:none; color:var(--warn); cursor:pointer; font-size:11px;" aria-label="Remove lot">&times;</button>
          </td>
        </tr>
      `;
      })
      .join('');
  }

  function addGoldLotToHistory() {
    if (typeof document === 'undefined') return;
    const typeEl = document.getElementById('selGoldType');
    const unitEl = document.getElementById('selGoldUnit');
    const weightEl = document.getElementById('inpGoldWeight');
    const costEl = document.getElementById('inpGoldCost');
    const feeEl = document.getElementById('inpGoldFee');

    const weight = Number.parseFloat(weightEl?.value) || 0;
    const cost = Number.parseFloat(costEl?.value) || 0;
    if (weight <= 0 || cost <= 0) return;

    const lot = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      goldType: typeEl?.value || 'bar',
      weightUnit: unitEl?.value || 'baht',
      weight,
      costPerBaht: cost,
      blockFee: Number.parseFloat(feeEl?.value) || 0,
    };

    if (!goldState.lots) goldState.lots = [];
    goldState.lots.push(lot);
    saveGoldState();
    renderGoldLotsTable();
    updateGoldCalculator();
  }

  function removeGoldLot(idx) {
    if (goldState.lots?.[idx]) {
      goldState.lots.splice(idx, 1);
      saveGoldState();
      renderGoldLotsTable();
      updateGoldCalculator();
    }
  }

  function clearGoldLots() {
    goldState.lots = [];
    saveGoldState();
    renderGoldLotsTable();
    updateGoldCalculator();
  }

  function exportGoldToPortfolio(context = {}) {
    if (typeof document === 'undefined') return;
    const typeEl = document.getElementById('selGoldType');
    const unitEl = document.getElementById('selGoldUnit');
    const weightEl = document.getElementById('inpGoldWeight');
    const costEl = document.getElementById('inpGoldCost');
    const feeEl = document.getElementById('inpGoldFee');
    const marketPriceEl = document.getElementById('inpGoldMarketPrice');

    const params = {
      goldType: typeEl?.value || 'bar',
      weightUnit: unitEl?.value || 'baht',
      weight: Number.parseFloat(weightEl?.value) || 0,
      costPerBaht: Number.parseFloat(costEl?.value) || 0,
      blockFee: Number.parseFloat(feeEl?.value) || 0,
      currentMarketPrice: Number.parseFloat(marketPriceEl?.value) || 0,
    };

    if (goldState.lots && goldState.lots.length > 0) {
      params.tranches = goldState.lots.map((lot) => ({
        goldType: lot.goldType || 'bar',
        weightUnit: lot.weightUnit || 'baht',
        weight: lot.weight,
        costPerBaht: lot.costPerBaht,
        blockFee: lot.blockFee || 0,
      }));
    }

    const metrics = global.MoneyApp?.calculateThaiGoldMetrics?.(params);
    if (!metrics || metrics.marketValue <= 0) return;

    const portfolioState = context.state || global.state;
    if (!portfolioState?.buckets) return;

    let foundAsset = null;
    for (const b of portfolioState.buckets) {
      if (!b.assets) continue;
      foundAsset = b.assets.find((a) => a.ticker === 'GOLD' || a.ticker === 'GOLDBAR');
      if (foundAsset) break;
    }

    const isEn = (context.lang || global.LANG) === 'en';

    if (foundAsset) {
      foundAsset.value = metrics.marketValue;
      foundAsset.units = metrics.weightBaht;
      foundAsset.lastPrice = metrics.currentMarketPrice;
      foundAsset.currency = 'THB';
    } else {
      const targetBucket = portfolioState.buckets.find((b) => b.id === 'ballast') || portfolioState.buckets[0];
      if (targetBucket) {
        if (!targetBucket.assets) targetBucket.assets = [];
        targetBucket.assets.push({
          name: isEn ? 'Physical Thai Gold (96.5%)' : 'ทองคำแท่ง/รูปพรรณ (96.5%)',
          ticker: 'GOLD',
          units: metrics.weightBaht,
          lastPrice: metrics.currentMarketPrice,
          currency: 'THB',
          value: metrics.marketValue,
          weight: 10,
        });
      }
    }

    if (typeof context.saveState === 'function') context.saveState();
    else if (typeof global.saveState === 'function') global.saveState();

    if (typeof context.renderBuckets === 'function') context.renderBuckets();
    else if (typeof global.renderBuckets === 'function') global.renderBuckets();

    if (typeof context.compute === 'function') context.compute();
    else if (typeof global.compute === 'function') global.compute();

    const exportBtn = document.getElementById('lblExportGoldToPortfolio');
    if (exportBtn) {
      const originalText = exportBtn.textContent;
      exportBtn.textContent = isEn ? '✓ Exported!' : '✓ ส่งข้อมูลแล้ว!';
      setTimeout(() => {
        exportBtn.textContent = originalText;
      }, 2000);
    }
  }

  function initGoldCalculator(context = {}) {
    loadGoldState();

    if (typeof document !== 'undefined') {
      const typeEl = document.getElementById('selGoldType');
      const unitEl = document.getElementById('selGoldUnit');
      const weightEl = document.getElementById('inpGoldWeight');
      const costEl = document.getElementById('inpGoldCost');
      const feeEl = document.getElementById('inpGoldFee');
      const marketPriceEl = document.getElementById('inpGoldMarketPrice');

      if (typeEl && goldState.goldType) typeEl.value = goldState.goldType;
      if (unitEl && goldState.weightUnit) unitEl.value = goldState.weightUnit;
      if (weightEl && goldState.weight != null) weightEl.value = goldState.weight;
      if (costEl && goldState.costPerBaht != null) costEl.value = goldState.costPerBaht;
      if (feeEl && goldState.blockFee != null) feeEl.value = goldState.blockFee;
      if (marketPriceEl && goldState.marketPrice != null) marketPriceEl.value = goldState.marketPrice;

      renderGoldLotsTable(context);
      updateGoldCalculator(false, context);

      if (!goldState.marketPrice || goldState.marketPrice === 42000) {
        syncGoldMarketPrice(context.fetchThaiGoldPrice);
      }
    }
  }

  // ==========================================
  // 2. Foreign Investment & Crypto Repatriation Tax Advisor
  // ==========================================
  let foreignTaxState = {
    isOpen: false,
    remittanceAmount: 500000,
    pre2024Amount: 0,
    principalAmount: 0,
    daysInThailand: 200,
    foreignTaxPaid: 0,
    otherDomesticNetIncome: 500000,
  };

  function loadForeignTaxState() {
    try {
      const raw = localStorage.getItem(FOREIGN_TAX_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          foreignTaxState = { ...foreignTaxState, ...parsed };
        }
      }
    } catch (_e) {}
    return foreignTaxState;
  }

  function saveForeignTaxState() {
    try {
      localStorage.setItem(FOREIGN_TAX_STORAGE_KEY, JSON.stringify(foreignTaxState));
    } catch (_e) {}
  }

  function toggleForeignTaxAdvisor(layoutManager) {
    if (layoutManager) {
      layoutManager.toggleCard('panelForeignTaxAdvisor');
    } else if (typeof document !== 'undefined') {
      const panel = document.getElementById('foreignTaxPanelBody');
      if (!panel) return;
      const isHidden = panel.classList.contains('card-collapsed-hidden');
      panel.classList.toggle('card-collapsed-hidden', !isHidden);
    }
    updateForeignTaxUI();
  }

  function setRemittancePreset(amt) {
    if (typeof document === 'undefined') return;
    const inp = document.getElementById('inpRemittanceAmount');
    if (inp) {
      inp.value = amt;
      updateForeignTaxUI();
    }
  }

  function setRemittancePre2024Full() {
    if (typeof document === 'undefined') return;
    const remitEl = document.getElementById('inpRemittanceAmount');
    const preEl = document.getElementById('inpPre2024Amount');
    if (remitEl && preEl) {
      preEl.value = remitEl.value;
      updateForeignTaxUI();
    }
  }

  function updateForeignTaxUI(context = {}) {
    if (typeof document === 'undefined') return;
    const remitEl = document.getElementById('inpRemittanceAmount');
    const pre2024El = document.getElementById('inpPre2024Amount');
    const principalEl = document.getElementById('inpPrincipalAmount');
    const daysEl = document.getElementById('inpDaysInThailand');
    const foreignTaxEl = document.getElementById('inpForeignTaxPaid');
    const domesticNetEl = document.getElementById('inpOtherDomesticNet');

    if (!remitEl) return;

    const remittanceAmount = Math.max(0, Number.parseFloat(remitEl.value) || 0);
    const pre2024Amount = Math.max(0, Number.parseFloat(pre2024El ? pre2024El.value : 0) || 0);
    const principalAmount = Math.max(0, Number.parseFloat(principalEl ? principalEl.value : 0) || 0);
    const daysInThailand = Math.max(0, Number.parseInt(daysEl ? daysEl.value : 180, 10) || 0);
    const foreignTaxPaid = Math.max(0, Number.parseFloat(foreignTaxEl ? foreignTaxEl.value : 0) || 0);
    const otherDomesticNetIncome = Math.max(0, Number.parseFloat(domesticNetEl ? domesticNetEl.value : 0) || 0);

    foreignTaxState.remittanceAmount = remittanceAmount;
    foreignTaxState.pre2024Amount = pre2024Amount;
    foreignTaxState.principalAmount = principalAmount;
    foreignTaxState.daysInThailand = daysInThailand;
    foreignTaxState.foreignTaxPaid = foreignTaxPaid;
    foreignTaxState.otherDomesticNetIncome = otherDomesticNetIncome;
    saveForeignTaxState();

    const calc = global.MoneyApp?.calculateForeignRepatriationTax?.({
      remittanceAmount,
      pre2024Amount,
      principalAmount,
      daysInThailand,
      foreignTaxPaid,
      otherDomesticNetIncome,
    }) ?? {
      isResident: daysInThailand >= 180,
      taxableRemittance: Math.max(0, remittanceAmount - pre2024Amount - principalAmount),
      totalExemptAmount: Math.min(remittanceAmount, pre2024Amount + principalAmount),
      grossThaiTaxOnRemittance: 0,
      dtaForeignTaxCredit: 0,
      netThaiTaxPayable: 0,
      effectiveTaxRate: 0,
      netRetainedInThailand: remittanceAmount,
      notes: [],
    };

    const isEn = (context.lang || global.LANG) === 'en';
    const formatMoney = context.formatMoney || global.MoneyApp?.formatMoney || ((v) => String(v));
    const currencyUnit = isEn ? 'THB' : 'บาท';

    const valTaxable = document.getElementById('valForeignTaxableRemit');
    const subExempt = document.getElementById('subForeignExemptTotal');
    const valGross = document.getElementById('valForeignGrossTax');
    const subEff = document.getElementById('subForeignEffectiveRate');
    const valDta = document.getElementById('valForeignDtaCredit');
    const subDta = document.getElementById('subForeignDtaStatus');
    const valNet = document.getElementById('valForeignNetTax');
    const subRetained = document.getElementById('subForeignNetRetained');
    const boxAdvice = document.getElementById('boxForeignTaxAdvice');

    const effRate =
      Number(
        calc.effectiveTaxRate != null
          ? calc.effectiveTaxRate
          : calc.effectiveTaxRatePct != null
            ? calc.effectiveTaxRatePct
            : 0,
      ) || 0;

    if (valTaxable) valTaxable.textContent = `${formatMoney(calc.taxableRemittance)} ${currencyUnit}`;
    if (subExempt) {
      const totalExempt =
        calc.totalExemptAmount != null
          ? calc.totalExemptAmount
          : (calc.pre2024ExemptAmount || 0) + (calc.capitalPrincipalExemptAmount || 0);
      subExempt.textContent = isEn
        ? `Total Exempt: ${formatMoney(totalExempt)} ${currencyUnit}`
        : `ได้รับยกเว้น: ${formatMoney(totalExempt)} ${currencyUnit}`;
    }

    if (valGross) valGross.textContent = `${formatMoney(calc.grossThaiTaxOnRemittance)} ${currencyUnit}`;
    if (subEff) {
      subEff.textContent = isEn ? `Effective Rate: ${effRate.toFixed(1)}%` : `อัตราภาษีเฉลี่ย: ${effRate.toFixed(1)}%`;
    }

    const dtaCredit = calc.dtaForeignTaxCredit != null ? calc.dtaForeignTaxCredit : calc.allowableDtaCredit || 0;
    if (valDta) valDta.textContent = `${formatMoney(dtaCredit)} ${currencyUnit}`;
    if (subDta) {
      if (foreignTaxPaid > 0) {
        subDta.textContent = isEn ? 'DTA relief applied' : 'หักลดหย่อนภาษีซ้ำซ้อนแล้ว';
      } else {
        subDta.textContent = isEn ? 'No foreign tax claimed' : 'ไม่มีการขอเครดิตภาษีต่างประเทศ';
      }
    }

    if (valNet) {
      valNet.textContent = `${formatMoney(calc.netThaiTaxPayable)} ${currencyUnit}`;
      valNet.style.color = calc.netThaiTaxPayable > 0 ? 'var(--warn)' : 'var(--ok)';
    }
    if (subRetained) {
      const netRetained =
        calc.netRetainedInThailand != null ? calc.netRetainedInThailand : calc.totalNetCashRetained || 0;
      subRetained.textContent = isEn
        ? `Net Retained: ${formatMoney(netRetained)} ${currencyUnit}`
        : `เงินเหลือเข้าไทยสุทธิ: ${formatMoney(netRetained)} ${currencyUnit}`;
    }

    if (boxAdvice) {
      let adviceHtml = '';
      const isResident = calc.isResident !== undefined ? calc.isResident : calc.isTaxResident;
      if (!isResident) {
        adviceHtml = isEn
          ? `🟢 <strong>Non-Resident Exemption (Section 41 Paragraph 3):</strong> Since your stay in Thailand is under 180 days (${daysInThailand} days), you are a tax non-resident. Remittances of foreign capital or gains into Thailand are <strong>100% exempt from Thai Personal Income Tax</strong> regardless of when earned.`
          : `🟢 <strong>สิทธิประโยชน์ผู้ไม่อยู่ในไทยถึง 180 วัน (มาตรา 41 วรรคสาม):</strong> เนื่องจากคุณพำนักในไทยไม่ถึง 180 วันในปีภาษี (${daysInThailand} วัน) ถือเป็นผู้ไม่มีถิ่นที่อยู่ทางภาษีในไทย เงินได้หรือกำไรจากการลงทุนต่างประเทศที่นำเข้าไทย<strong>ได้รับการยกเว้นภาษีเงินได้ 100%</strong> โดยไม่ต้องคำนวณภาษี`;
      } else if (calc.taxableRemittance === 0) {
        adviceHtml = isEn
          ? '🛡️ <strong>Fully Tax-Exempt Remittance:</strong> 100% of the remitted amount is shielded from Thai PIT via Pre-2024 grandfathering (Order P.162/2566) or original principal return. <em>Tip: Ensure you retain broker transfer slips and holding statements as statutory audit proof.</em>'
          : '🛡️ <strong>ได้รับการยกเว้นภาษีทั้งจำนวน:</strong> เงินที่นำเข้าไทยทั้ง 100% ได้รับยกเว้นภาษีเงินได้บุคคลธรรมดา จากสิทธิประโยชน์เงินได้ก่อนปี 2567 (คำสั่ง ป.162/2566) หรือการถอนเงินต้นลงทุนเดิม <em>คำแนะนำ: ควรเก็บหลักฐานใบโอนเงิน บัญชีโบรกเกอร์ต่างประเทศ และ Bank Statement ไว้เป็นหลักฐานตรวจสอบ</em>';
      } else {
        const topBracketRate = effRate > 20 ? '30-35%' : effRate > 10 ? '15-20%' : '5-10%';
        adviceHtml = isEn
          ? `💡 <strong>Strategic Repatriation Advice (Orders P.161 & P.162):</strong><br>
           • Remitted taxable assessable income is <strong>${formatMoney(calc.taxableRemittance)} THB</strong>, incurring net Thai tax of <strong>${formatMoney(calc.netThaiTaxPayable)} THB</strong> (effective ~${effRate.toFixed(1)}%).<br>
           • <strong>Bracket Management:</strong> If feasible, consider spreading remittances across multiple calendar years to stay within lower PIT brackets (5% - 15%).<br>
           • <strong>DTA Foreign Tax Credit:</strong> If foreign withholding taxes (e.g. US 15% dividend WHT under Thai-US DTA) were deducted, retain IRS Form 1042-S / broker proof to claim full credit under Royal Decree No. 300.`
          : `💡 <strong>กลยุทธ์การบริหารภาษีนำเงินกลับไทย (คำสั่ง ป.161 & ป.162):</strong><br>
           • ยอดเงินได้ที่ต้องเสียภาษีสุทธิคือ <strong>${formatMoney(calc.taxableRemittance)} บาท</strong> มีภาษีต้องชำระสุทธิ <strong>${formatMoney(calc.netThaiTaxPayable)} บาท</strong> (อัตราภาษีเฉลี่ย ~${effRate.toFixed(1)}%)<br>
           • <strong>การกระจายปีภาษี (Tranche Spreading):</strong> หากไม่จำเป็นต้องใช้เงินก้อนทันที ควรพิจารณาแบ่งยอดนำเงินกลับไทยข้ามปีปฏิทินเพื่อรักษาระดับฐานภาษีบุคคลธรรมดาไม่ให้กระโดดขึ้นไปขั้น ${topBracketRate}<br>
           • <strong>เครดิตภาษีซ้อน (DTA):</strong> หากถูกหักภาษี ณ ต่างประเทศไว้แล้ว (เช่น ภาษีปันผลหุ้นสหรัฐฯ 15% ตามอนุสัญญา DTA) ให้เตรียมเอกสารรับรองการหักภาษี (เช่น Form 1042-S) เพื่อขอลดหย่อนภาษีตาม พ.ร.ฎ. ฉบับที่ 300`;
      }
      boxAdvice.innerHTML = adviceHtml;
    }
  }

  function initForeignTaxAdvisor(context = {}) {
    loadForeignTaxState();

    if (typeof document !== 'undefined') {
      const remitEl = document.getElementById('inpRemittanceAmount');
      const pre2024El = document.getElementById('inpPre2024Amount');
      const principalEl = document.getElementById('inpPrincipalAmount');
      const daysEl = document.getElementById('inpDaysInThailand');
      const foreignTaxEl = document.getElementById('inpForeignTaxPaid');
      const domesticNetEl = document.getElementById('inpOtherDomesticNet');

      if (remitEl && foreignTaxState.remittanceAmount != null) remitEl.value = foreignTaxState.remittanceAmount;
      if (pre2024El && foreignTaxState.pre2024Amount != null) pre2024El.value = foreignTaxState.pre2024Amount;
      if (principalEl && foreignTaxState.principalAmount != null) principalEl.value = foreignTaxState.principalAmount;
      if (daysEl && foreignTaxState.daysInThailand != null) daysEl.value = foreignTaxState.daysInThailand;
      if (foreignTaxEl && foreignTaxState.foreignTaxPaid != null) foreignTaxEl.value = foreignTaxState.foreignTaxPaid;
      if (domesticNetEl && foreignTaxState.otherDomesticNetIncome != null)
        domesticNetEl.value = foreignTaxState.otherDomesticNetIncome;

      updateForeignTaxUI(context);
    }
  }

  // ==========================================
  // 3. Target Date Fund Glidepath Model Sub-tool
  // ==========================================
  let glidepathState = {
    isOpen: false,
    currentAge: 30,
    retireAge: 60,
    targetYear: null,
    riskTolerance: 'moderate',
  };

  function loadGlidepathState() {
    try {
      const raw = localStorage.getItem(GLIDEPATH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          glidepathState = { ...glidepathState, ...parsed };
        }
      }
    } catch (_e) {}
    return glidepathState;
  }

  function saveGlidepathState() {
    try {
      localStorage.setItem(GLIDEPATH_STORAGE_KEY, JSON.stringify(glidepathState));
    } catch (_e) {}
  }

  function toggleTargetDateGlidepath(layoutManager) {
    if (layoutManager) {
      layoutManager.toggleCard('panelTargetDateGlidepath');
    } else if (typeof document !== 'undefined') {
      const panel = document.getElementById('glidepathPanelBody');
      if (!panel) return;
      const isHidden = panel.classList.contains('card-collapsed-hidden');
      panel.classList.toggle('card-collapsed-hidden', !isHidden);
    }
    updateGlidepathUI();
  }

  function setGlidepathCohortPreset(year) {
    if (typeof document === 'undefined') return;
    const ageEl = document.getElementById('inpGlideCurrentAge');
    const retireAgeEl = document.getElementById('inpGlideRetireAge');
    const curYear = new Date().getFullYear();
    const curAge = Math.max(18, Number.parseInt(ageEl ? ageEl.value : 30, 10) || 30);
    const yearsToRetire = Math.max(0, year - curYear);
    const derivedRetireAge = curAge + yearsToRetire;

    if (retireAgeEl) {
      retireAgeEl.value = derivedRetireAge;
    }
    glidepathState.targetYear = year;
    updateGlidepathUI();
  }

  function calculateGlidepathData() {
    if (typeof document === 'undefined') {
      return (
        global.MoneyApp?.calculateTargetDateGlidepath?.({
          currentAge: glidepathState.currentAge,
          targetRetirementAge: glidepathState.retireAge,
          riskTolerance: glidepathState.riskTolerance,
        }) ?? {
          yearsToRetire: 30,
          targetYear: 2056,
          split: { core: 80, ballast: 15, satellite: 5 },
          phaseNameTh: 'ระยะสะสมความมั่งคั่ง',
          phaseNameEn: 'Wealth Accumulation',
          adviceTh: 'เน้นสินทรัพย์เติบโตสูงเพื่อพลังดอกเบี้ยทบต้น',
          adviceEn: 'Focus on growth assets for compounding.',
          assetBreakdown: {
            coreDescriptionTh: 'หุ้นโลก, หุ้นไทย, อสังหาฯ',
            coreDescriptionEn: 'Global/Thai equities, REITs',
            ballastDescriptionTh: 'พันธบัตร, กองทุนตราสารหนี้, สภาพคล่อง',
            ballastDescriptionEn: 'Govt bonds, fixed income, cash',
            satelliteDescriptionTh: 'ทองคำ, คริปโต',
            satelliteDescriptionEn: 'Gold, digital assets',
          },
        }
      );
    }

    const ageEl = document.getElementById('inpGlideCurrentAge');
    const retireAgeEl = document.getElementById('inpGlideRetireAge');
    const riskEl = document.getElementById('selGlideRisk');

    const currentAge = Math.max(15, Number.parseInt(ageEl ? ageEl.value : 30, 10) || 30);
    const targetRetirementAge = Math.max(30, Number.parseInt(retireAgeEl ? retireAgeEl.value : 60, 10) || 60);
    const riskTolerance = riskEl ? riskEl.value : 'moderate';

    glidepathState.currentAge = currentAge;
    glidepathState.retireAge = targetRetirementAge;
    glidepathState.riskTolerance = riskTolerance;
    saveGlidepathState();

    if (typeof global.MoneyApp?.calculateTargetDateGlidepath === 'function') {
      return global.MoneyApp.calculateTargetDateGlidepath({
        currentAge,
        targetRetirementAge,
        riskTolerance,
      });
    }

    return {
      yearsToRetire: Math.max(0, targetRetirementAge - currentAge),
      targetYear: new Date().getFullYear() + Math.max(0, targetRetirementAge - currentAge),
      split: { core: 80, ballast: 15, satellite: 5 },
      phaseNameTh: 'ระยะสะสมความมั่งคั่ง',
      phaseNameEn: 'Wealth Accumulation',
      adviceTh: 'เน้นสินทรัพย์เติบโตสูงเพื่อพลังดอกเบี้ยทบต้น',
      adviceEn: 'Focus on growth assets for compounding.',
      assetBreakdown: {
        coreDescriptionTh: 'หุ้นโลก, หุ้นไทย, อสังหาฯ',
        coreDescriptionEn: 'Global/Thai equities, REITs',
        ballastDescriptionTh: 'พันธบัตร, กองทุนตราสารหนี้, สภาพคล่อง',
        ballastDescriptionEn: 'Govt bonds, fixed income, cash',
        satelliteDescriptionTh: 'ทองคำ, คริปโต',
        satelliteDescriptionEn: 'Gold, digital assets',
      },
    };
  }

  function updateGlidepathUI(context = {}) {
    if (typeof document === 'undefined') return;
    const calc = calculateGlidepathData();
    if (!calc?.split) return;

    const isEn = (context.lang || global.LANG) === 'en';

    const barCore = document.getElementById('glideBarCore');
    const barBallast = document.getElementById('glideBarBallast');
    const barSat = document.getElementById('glideBarSat');

    if (barCore) barCore.style.width = `${calc.split.core}%`;
    if (barBallast) barBallast.style.width = `${calc.split.ballast}%`;
    if (barSat) barSat.style.width = `${calc.split.satellite}%`;

    const badgePhase = document.getElementById('badgeGlidePhase');
    if (badgePhase) {
      badgePhase.textContent = isEn ? calc.phaseNameEn : calc.phaseNameTh;
    }

    const txtCore = document.getElementById('txtGlideCorePct');
    const txtBallast = document.getElementById('txtGlideBallastPct');
    const txtSat = document.getElementById('txtGlideSatPct');

    if (txtCore) {
      txtCore.textContent = isEn ? `Core (Growth): ${calc.split.core}%` : `Core (หุ้นเติบโต): ${calc.split.core}%`;
    }
    if (txtBallast) {
      txtBallast.textContent = isEn
        ? `Ballast (Bonds): ${calc.split.ballast}%`
        : `Ballast (ตราสารหนี้/กันชน): ${calc.split.ballast}%`;
    }
    if (txtSat) {
      txtSat.textContent = isEn
        ? `Satellite (Alts/Gold): ${calc.split.satellite}%`
        : `Satellite (ทางเลือก/ทอง): ${calc.split.satellite}%`;
    }

    const valHorizon = document.getElementById('valGlideHorizonYears');
    const subTarget = document.getElementById('subGlideTargetYear');
    const valCore = document.getElementById('valGlideCore');
    const valBallast = document.getElementById('valGlideBallast');
    const valSat = document.getElementById('valGlideSat');
    const boxAdvice = document.getElementById('boxGlidepathAdvice');

    if (valHorizon) {
      valHorizon.textContent = isEn ? `${calc.yearsToRetire} Years` : `${calc.yearsToRetire} ปี`;
    }
    if (subTarget) {
      subTarget.textContent = isEn
        ? `Retirement Year: ${calc.targetYear}`
        : `ปีเกษียณ ค.ศ. ${calc.targetYear} (พ.ศ. ${calc.targetYear + 543})`;
    }

    if (valCore) valCore.textContent = `${calc.split.core}%`;
    if (valBallast) valBallast.textContent = `${calc.split.ballast}%`;
    if (valSat) valSat.textContent = `${calc.split.satellite}%`;

    if (boxAdvice) {
      const adviceText = isEn ? calc.adviceEn : calc.adviceTh;
      const coreDesc = isEn ? calc.assetBreakdown.coreDescriptionEn : calc.assetBreakdown.coreDescriptionTh;
      const ballastDesc = isEn ? calc.assetBreakdown.ballastDescriptionEn : calc.assetBreakdown.ballastDescriptionTh;
      const satDesc = isEn ? calc.assetBreakdown.satelliteDescriptionEn : calc.assetBreakdown.satelliteDescriptionTh;

      boxAdvice.innerHTML = `
        💡 <strong>${isEn ? 'Target Date Allocation Guidance:' : 'คำแนะนำกลยุทธ์การจัดพอร์ตตามเส้นทาง Glidepath:'}</strong> ${adviceText}<br>
        <div style="margin-top:6px; font-size:10px; color:var(--ink-dim); display:flex; flex-direction:column; gap:2px;">
          <span>• <strong>Core (${calc.split.core}%):</strong> ${coreDesc}</span>
          <span>• <strong>Ballast (${calc.split.ballast}%):</strong> ${ballastDesc}</span>
          <span>• <strong>Satellite (${calc.split.satellite}%):</strong> ${satDesc}</span>
        </div>
      `;
    }
  }

  function applyGlidepathSplitToPortfolio(context = {}) {
    const calc = calculateGlidepathData();
    if (!calc?.split) return;

    const undoMgr = context.undoMgr || global.undoMgr;
    const captureSnapshot = context.captureSnapshot || global.captureSnapshot;
    if (undoMgr && captureSnapshot) {
      undoMgr.push(captureSnapshot());
    }

    const portfolioState = context.state || global.state;
    if (!portfolioState?.buckets) return;

    const coreBucket = portfolioState.buckets.find((b) => b.id === 'core');
    const ballastBucket = portfolioState.buckets.find((b) => b.id === 'ballast');
    const satBucket = portfolioState.buckets.find((b) => b.id === 'satellite');

    if (coreBucket) coreBucket.weight = calc.split.core;
    if (ballastBucket) ballastBucket.weight = calc.split.ballast;
    if (satBucket) satBucket.weight = calc.split.satellite;

    if (typeof context.renderSplit === 'function') context.renderSplit();
    else if (typeof global.renderSplit === 'function') global.renderSplit();

    if (typeof context.compute === 'function') context.compute();
    else if (typeof global.compute === 'function') global.compute();

    if (typeof context.saveState === 'function') context.saveState();
    else if (typeof global.saveState === 'function') global.saveState();

    if (typeof context.updateUndoUI === 'function') context.updateUndoUI();
    else if (typeof global.updateUndoUI === 'function') global.updateUndoUI();

    if (typeof document !== 'undefined') {
      const applyBtn = document.getElementById('lblApplyGlidepath');
      if (applyBtn) {
        const isEn = (context.lang || global.LANG) === 'en';
        const originalText = applyBtn.textContent;
        applyBtn.textContent = isEn ? '✓ Applied to Portfolio!' : '✓ นำไปใช้กับพอร์ตแล้ว!';
        setTimeout(() => {
          applyBtn.textContent = originalText;
        }, 2000);
      }
    }
  }

  function bridgeDcaToBudget(source, context = {}) {
    if (typeof document === 'undefined') return;
    const budgetInput = document.getElementById('totalBudget');
    const portfolioState = context.state || global.state;
    const budgetVal = budgetInput
      ? Number.parseFloat(budgetInput.value.replace(/,/g, '')) || 0
      : portfolioState?.budget || 0;
    if (budgetVal <= 0) return;

    const glideData = typeof calculateGlidepathData === 'function' ? calculateGlidepathData() : null;

    try {
      localStorage.setItem(
        'moneySuperapp.pendingDcaBudget',
        JSON.stringify({
          amount: budgetVal,
          source: source || 'rebalance_budget',
          targetYear: glideData ? glideData.targetYear : null,
          split: glideData ? glideData.split : null,
          timestamp: Date.now(),
        }),
      );
    } catch (_e) {}

    if (typeof global.parent !== 'undefined' && global.parent !== global) {
      global.parent.postMessage({ action: 'switchToTab', target: 'remaining-money' }, '*');
    } else {
      global.location.href = 'remaining-money.html';
    }
  }

  function initTargetDateGlidepath(context = {}) {
    loadGlidepathState();
    if (typeof document !== 'undefined') {
      const ageEl = document.getElementById('inpGlideCurrentAge');
      const retireAgeEl = document.getElementById('inpGlideRetireAge');
      const riskEl = document.getElementById('selGlideRisk');
      if (ageEl && glidepathState.currentAge != null) ageEl.value = glidepathState.currentAge;
      if (retireAgeEl && glidepathState.retireAge != null) retireAgeEl.value = glidepathState.retireAge;
      if (riskEl && glidepathState.riskTolerance) riskEl.value = glidepathState.riskTolerance;

      updateGlidepathUI(context);
    }
  }

  const RebalanceSubtools = {
    // Gold
    getGoldState: () => goldState,
    setGoldState: (s) => {
      goldState = { ...goldState, ...s };
    },
    loadGoldState,
    saveGoldState,
    toggleThaiGoldCalculator,
    updateGoldCalculator,
    setGoldWeightPreset,
    syncGoldMarketPrice,
    renderGoldLotsTable,
    addGoldLotToHistory,
    removeGoldLot,
    clearGoldLots,
    exportGoldToPortfolio,
    initGoldCalculator,

    // Foreign Tax
    getForeignTaxState: () => foreignTaxState,
    setForeignTaxState: (s) => {
      foreignTaxState = { ...foreignTaxState, ...s };
    },
    loadForeignTaxState,
    saveForeignTaxState,
    toggleForeignTaxAdvisor,
    setRemittancePreset,
    setRemittancePre2024Full,
    updateForeignTaxUI,
    initForeignTaxAdvisor,

    // Glidepath
    getGlidepathState: () => glidepathState,
    setGlidepathState: (s) => {
      glidepathState = { ...glidepathState, ...s };
    },
    loadGlidepathState,
    saveGlidepathState,
    toggleTargetDateGlidepath,
    setGlidepathCohortPreset,
    calculateGlidepathData,
    updateGlidepathUI,
    applyGlidepathSplitToPortfolio,
    bridgeDcaToBudget,
    initTargetDateGlidepath,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.RebalanceSubtools = RebalanceSubtools;

  if (typeof global !== 'undefined') {
    if (typeof global.RebalanceSubtools === 'undefined') {
      global.RebalanceSubtools = RebalanceSubtools;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
