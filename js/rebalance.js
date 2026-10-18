// Language: read once from localStorage (shared origin with the shell nav's toggle).
const EN = {
  eyebrow: 'DCA TOOL',
  pageTitle: 'Monthly Top-up Calculator',
  subtitle:
    "Split this month's budget across Core / Ballast / Satellite, then work out how much to add to each asset so allocations move closest to target — without selling anything.",
  budgetPanelTitle: "This month's investment budget",
  budgetUnit: 'THB',
  lblDonutTitle: 'Current Portfolio Value',
  lblMinTrade: 'Min Trade Threshold:',
  lblMinTradeDesc: 'THB (warn if calculated trade is below this)',
  lblDriftTitle: 'Portfolio Drift & Tracking Error',
  lblPreDrift: 'Pre-DCA Tracking Error',
  lblPostDrift: 'Post-DCA Tracking Error',
  lblCurrencyExposureTitle: 'Currency Exposure Breakdown',
  lblHeatmapTitle: 'Portfolio Allocation Intensity Heatmap',
  lblLegendUnder: 'Underweight (Buy Target)',
  lblLegendAligned: 'Balanced (±1%)',
  lblLegendOver: 'Overweight (Trim/Hold)',
  howto:
    '<b>How it works</b> — The total budget is split by Core/Ballast/Satellite weights first. Within each group, the system tops up whichever asset lags its target weight the most. Anything already over target gets nothing this month (= 0), and its share goes to the laggards instead — nothing is ever sold.<br><br><b>Monthly routine</b> — Before buying each month, update every "Current value" with the real price, then check the new results.<br><br><b>Tip</b> — In "Current value" or the total budget, type <code>+10000</code> or <code>-5000</code> then press Enter/click away to add/subtract from the existing value without doing the math yourself.',
  lblRefreshPrices: 'Refresh Prices',
  lblAutoRefresh: 'Every 10 min',
  lblSettingsBtn: 'API Settings',
  lblModalTitle: 'Live Stock & ETF Price API Settings',
  lblModalDesc:
    '• <b>Crypto (BTC, ETH, etc.):</b> Live quotes via Coinbase API free (USD $)<br>• <b>Thai Gold Bar (GOLD, GOLDBAR):</b> Live quotes via Thai Gold Association API free (THB ฿)<br>• <b>YLG-GOLD (YLG Gold Fund):</b> Enter NAV per unit (฿) manually — fund NAV ≠ gold bar spot price<br>• <b>USD/THB FX:</b> Live exchange rate fetched via Open Exchange Rates<br>• <b>US Stocks (NVDA, SGOV) & Thai Stocks (GULF, PTT):</b> Enter free API key from Twelve Data or Finnhub<br>• <b>Thai Mutual Funds (K-WORLDX, SCBCE, etc.):</b> Unlisted funds have no open browser CORS API — enter daily NAV in THB (฿) and units directly. The calculator saves it and computes allocations automatically.',
  lblFinnhubKey: 'Finnhub API Key (Recommended):',
  lblTwelveDataKey: 'Twelve Data API Key (Alternative):',
  linkFinnhubFree: 'Get free key (Finnhub.io)',
  linkTwelveDataFree: 'Get free key (TwelveData)',
  btnTestApi: '🧪 Test Connection',
  btnCancelModal: 'Cancel',
  btnSaveModal: 'Save',
  lblUndo: 'Undo',
  lblDivTitle: '🌐 Asset Class Correlation & Risk Diversification',
  lblGoldTitle: 'Physical Thai Gold DCA & Weight Converter (96.5%)',
  lblGoldSubtitle: 'Average cost, block fee break-even, Gold Traders Association buyback price, and portfolio export',
  badgeGoldStatus: '96.5% Thai Gold',
  lblGoldType: 'Gold Product Type:',
  lblGoldWeight: 'Weight:',
  lblGoldCost: 'Purchase Cost (Cost/Baht):',
  lblGoldCostSub: 'per baht',
  lblGoldFee: 'Block / Craft Fee (Fee):',
  lblGoldFeeSub: 'per piece/total',
  lblGoldMarketPrice: 'Current Association Selling Price (Market Sell):',
  lblSyncGoldPrice: 'Fetch Association Price',
  lblEquivalentWeight: '⚖️ Standard Weight Equivalence:',
  lblCardGoldCost: 'Total Cost',
  lblCardGoldVal: 'Market Sell Value',
  lblCardGoldPL: 'Profit / Loss (P/L)',
  lblCardGoldLiq: 'Liquidation Buyback',
  lblAddGoldLot: 'Add to DCA Lots',
  lblExportGoldToPortfolio: 'Export Gold Value to Portfolio',
  lblGoldLotsTitle: '📜 Thai Gold DCA Lot History',
  lblClearGoldLots: 'Clear History',
  thGoldDate: 'Date',
  thGoldType: 'Type',
  thGoldWeight: 'Weight',
  thGoldCost: 'Cost',
  thGoldFee: 'Fee',
  thGoldAction: 'Action',
  lblGoldTaxTitle: 'Thai Gold Tax Law:',
  txtGoldTaxDesc:
    'Capital gains from buying and selling physical gold bullion and jewelry by individuals are exempt from Personal Income Tax under Section 42(9) of the Revenue Code (movable property acquired without commercial trade intent).',
  lblForeignTaxTitle: 'Foreign Investment & Crypto Repatriation Tax Advisor (Orders P.161 & P.162)',
  lblForeignTaxSubtitle:
    'Revenue Dept Orders P.161/2566 & P.162/2566 (Pre/Post-2024 exemption, 180-day residency, and DTA tax credit)',
  lblInpRemitAmt: 'Remittance Amount Brought into Thailand (THB)',
  lblInpPre2024Amt: 'Derived Before 2024 (P.162 100% Exempt)',
  lblInpPrincipalAmt: 'Original Principal Capital (Exempt from Assessable Income)',
  lblInpDaysInThai: 'Days Residing in Thailand in Tax Year (Days)',
  lblInpForeignTaxPaid: 'Foreign Tax Withheld Abroad (THB) - DTA Credit',
  lblInpOtherDomesticNet: 'Domestic Net Taxable Income in Thailand (THB)',
  btnPre2024Preset: '🛡️ Exempt All Pre-2024 Capital/Gains',
  lblCardForeignTaxable: 'Assessable Taxable Remittance',
  lblCardGrossThaiTax: 'Gross Thai PIT on Remittance',
  lblCardDtaCredit: 'DTA Foreign Tax Credit',
  lblCardNetThaiTax: 'Net Thai Tax Payable',
  lblForeignLawTitle: 'Statutory References:',
  txtForeignLawDesc:
    'Revenue Code Section 41 Paragraph 2, Revenue Department Orders Por. 161/2566 (effective 1 Jan 2024) & Por. 162/2566 (grandfathered pre-2024 income), and Royal Decree No. 300 (Foreign Tax Credit under DTA).',
  lblGlidepathTitle: 'Target Date Retirement Glidepath Planner',
  lblGlidepathSubtitle:
    'Automatically adjust Core / Ballast / Satellite weights based on age and target retirement year (GPF / Vanguard model)',
  lblInpGlideCurrentAge: 'Current Age (Years)',
  lblInpGlideRetireAge: 'Target Retirement Age (Years)',
  lblInpGlideRisk: 'Risk Tolerance Level',
  optRiskModerate: 'Moderate (Age-balanced - Recommended)',
  optRiskAggressive: 'Aggressive (High Growth Focus)',
  optRiskConservative: 'Conservative (Capital Preservation)',
  lblCohortPresets: '🎯 Select Target Retirement Cohort:',
  lblGlidepathBarTitle: '📊 Recommended Glidepath Allocation Split:',
  lblCardGlideHorizon: 'Investment Horizon',
  lblCardGlideCore: 'Recommended Core %',
  lblCardGlideBallast: 'Recommended Ballast %',
  lblCardGlideSat: 'Recommended Satellite %',
  lblApplyGlidepath: 'Apply to Portfolio Split',
  txtGlidepathSyncNote: '💡 Selected allocation split automatically syncs to Core / Ballast / Satellite targets above.',
  lblBudgetHeading: 'Investment Budget This Month',
  lblBucketsTitle: '💼 Portfolio Buckets & Investment Assets',
  lblBucketsSubtitle: 'Core (Growth) / Ballast (Stability) / Satellite (Thematic) Allocations & Top-up',
  lblHowtoTitle: '📖 How it Works & Tips',
  lblResetLayout: 'Reset Card Order',
};
if (LANG === 'en') {
  document.title = 'Monthly Top-up Calculator';
  [
    'eyebrow',
    'pageTitle',
    'subtitle',
    'budgetPanelTitle',
    'lblBudgetHeading',
    'lblBucketsTitle',
    'lblBucketsSubtitle',
    'lblHowtoTitle',
    'lblResetLayout',
    'budgetUnit',
    'lblDonutTitle',
    'lblMinTrade',
    'lblMinTradeDesc',
    'lblDriftTitle',
    'lblPreDrift',
    'lblPostDrift',
    'lblCurrencyExposureTitle',
    'lblHeatmapTitle',
    'lblLegendUnder',
    'lblLegendAligned',
    'lblLegendOver',
    'lblRefreshPrices',
    'lblAutoRefresh',
    'lblSettingsBtn',
    'lblModalTitle',
    'lblFinnhubKey',
    'lblTwelveDataKey',
    'linkFinnhubFree',
    'linkTwelveDataFree',
    'btnTestApi',
    'btnCancelModal',
    'btnSaveModal',
    'lblDivTitle',
    'lblGoldTitle',
    'lblGoldSubtitle',
    'badgeGoldStatus',
    'lblGoldType',
    'lblGoldWeight',
    'lblGoldCost',
    'lblGoldCostSub',
    'lblGoldFee',
    'lblGoldFeeSub',
    'lblGoldMarketPrice',
    'lblSyncGoldPrice',
    'lblEquivalentWeight',
    'lblCardGoldCost',
    'lblCardGoldVal',
    'lblCardGoldPL',
    'lblCardGoldLiq',
    'lblAddGoldLot',
    'lblExportGoldToPortfolio',
    'lblGoldLotsTitle',
    'lblClearGoldLots',
    'thGoldDate',
    'thGoldType',
    'thGoldWeight',
    'thGoldCost',
    'thGoldFee',
    'thGoldAction',
    'lblGoldTaxTitle',
    'txtGoldTaxDesc',
    'lblForeignTaxTitle',
    'lblForeignTaxSubtitle',
    'lblInpRemitAmt',
    'lblInpPre2024Amt',
    'lblInpPrincipalAmt',
    'lblInpDaysInThai',
    'lblInpForeignTaxPaid',
    'lblInpOtherDomesticNet',
    'btnPre2024Preset',
    'lblCardForeignTaxable',
    'lblCardGrossThaiTax',
    'lblCardDtaCredit',
    'lblCardNetThaiTax',
    'lblForeignLawTitle',
    'txtForeignLawDesc',
    'lblGlidepathTitle',
    'lblGlidepathSubtitle',
    'lblInpGlideCurrentAge',
    'lblInpGlideRetireAge',
    'lblInpGlideRisk',
    'optRiskModerate',
    'optRiskAggressive',
    'optRiskConservative',
    'lblCohortPresets',
    'lblGlidepathBarTitle',
    'lblCardGlideHorizon',
    'lblCardGlideCore',
    'lblCardGlideBallast',
    'lblCardGlideSat',
    'lblApplyGlidepath',
    'txtGlidepathSyncNote',
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el && EN[id]) el.textContent = EN[id];
  });
  if (document.getElementById('lblModalDesc')) document.getElementById('lblModalDesc').innerHTML = EN.lblModalDesc;
  document.getElementById('howto').innerHTML = EN.howto;
  document.getElementById('resetBtn').textContent = 'Clear saved data';
  const copyBtnLbl = document.getElementById('lblCopyPortfolio');
  if (copyBtnLbl) copyBtnLbl.textContent = 'Copy Summary';
  const printBtnLbl = document.getElementById('lblPrintRebalance');
  if (printBtnLbl) printBtnLbl.textContent = 'Print / Save PDF';
  const tradeBtnLbl = document.getElementById('lblCopyTrade');
  if (tradeBtnLbl) tradeBtnLbl.textContent = 'Copy Trade Orders';
  const csvBtnLbl = document.getElementById('lblExportCsv');
  if (csvBtnLbl) csvBtnLbl.textContent = 'Export CSV';
  const undoTopLbl = document.getElementById('lblUndo');
  if (undoTopLbl) undoTopLbl.textContent = EN.lblUndo;
  const undoBtmLbl = document.getElementById('lblUndoBottom');
  if (undoBtmLbl) undoBtmLbl.textContent = EN.lblUndo;

  const selGoldType = document.getElementById('selGoldType');
  if (selGoldType && selGoldType.options.length >= 2) {
    selGoldType.options[0].text = 'Gold Bar 96.5% (15.244 g/baht)';
    selGoldType.options[1].text = 'Gold Jewelry 96.5% (15.16 g/baht)';
  }
  const selGoldUnit = document.getElementById('selGoldUnit');
  if (selGoldUnit && selGoldUnit.options.length >= 3) {
    selGoldUnit.options[0].text = 'Baht Gold';
    selGoldUnit.options[1].text = 'Salung';
    selGoldUnit.options[2].text = 'Grams';
  }
  const btnSalung1 = document.getElementById('btnGoldSalung1');
  if (btnSalung1) btnSalung1.textContent = '1 Salung';
  const btnSalung2 = document.getElementById('btnGoldSalung2');
  if (btnSalung2) btnSalung2.textContent = '2 Salung';
  const btnBaht1 = document.getElementById('btnGoldBaht1');
  if (btnBaht1) btnBaht1.textContent = '1 Baht';
  const btnBaht2 = document.getElementById('btnGoldBaht2');
  if (btnBaht2) btnBaht2.textContent = '2 Baht';
  const btnBaht5 = document.getElementById('btnGoldBaht5');
  if (btnBaht5) btnBaht5.textContent = '5 Baht';
  const btnBaht10 = document.getElementById('btnGoldBaht10');
  if (btnBaht10) btnBaht10.textContent = '10 Baht';
}

// Small dict for text regenerated on every render (compute/renderSplit/renderBuckets).
const T = {
  th: {
    splitWarn: (pct) => `รวมสัดส่วน Core+Ballast+Satellite = ${pct}% (ระบบจะปรับให้เป็น 100% อัตโนมัติระหว่างคำนวณ)`,
    addAsset: (label) => `+ เพิ่มสินทรัพย์ใน ${label}`,
    assetDefaultName: (n) => `สินทรัพย์ ${n}`,
    remove: 'ลบ',
    fieldValue: 'มูลค่าปัจจุบัน (บาท)',
    fieldWeight: 'สัดส่วนเป้าหมาย (%)',
    fieldUnits: 'จำนวนหน่วย',
    fieldPrice: 'ราคา / NAV',
    priceFetching: 'กำลังดึงราคา...',
    priceFetchDone: (time, rate) => `อัปเดตราคาล่าสุด: ${time} • USD/THB: ${rate}`,
    priceFetchError: 'ดึงราคาไม่สำเร็จ (ใช้ราคาที่บันทึกไว้)',
    testSuccess: (prov, price) => `✓ เชื่อมต่อสำเร็จ! ราคา ${prov}: $${price}`,
    testFailed: '❌ เชื่อมต่อไม่สำเร็จ กรุณาตรวจสอบ API key',
    testCryptoOnly: '✓ Crypto และ FX พร้อมใช้งาน (ยังไม่ได้ระบุ Stock API key)',
    testCryptoAndGoldReady: '✓ Crypto และ FX พร้อมใช้งาน',
    testTesting: 'กำลังทดสอบการเชื่อมต่อ...',
    bucketStatus: (pct) => `รวมสัดส่วนในกลุ่มนี้ ${pct}% (ระบบจะปรับให้เป็น 100% อัตโนมัติ)`,
    amount: (n) => `${n} บาท`,
    rmeta: (cur, target) => `ปัจจุบัน ${cur} → เป้า ${target}%`,
    rnewpct: (pct) => `หลังเติม ${pct}%`,
    totalAdded: 'รวมที่เติม',
    cappedNote: (n) => `มี ${n} สินทรัพย์ในกลุ่มนี้ที่เกินเป้าหมายแล้ว จึงไม่เติมเดือนนี้ งบถูกกระจายไปตัวที่ตามหลังแทน`,
    lastSaved: (t) => `บันทึกล่าสุด ${t}`,
    resetConfirm: 'ล้างข้อมูลที่บันทึกไว้ในเบราว์เซอร์นี้ และกลับไปใช้ค่าตั้งต้น?',
    toggleAsset: 'รวม/ไม่รวมสินทรัพย์นี้ในการคำนวณ',
    assetExcluded: '🚫 ไม่รวมคำนวณ',
    toggleBucket: 'รวม/ไม่รวมทั้งกลุ่มนี้ในการคำนวณสัดส่วน',
    bucketExcluded: '🚫 กลุ่มนี้ไม่รวมคำนวณ',
    minBudgetSuggestion: (thb, usd) =>
      `💡 เติมเงินอย่างน้อย <span class="accent-amt">+${thb} บาท</span><span class="rusd">($${usd})</span> เพื่อปรับพอร์ตให้ตรงเป้าหมาย 100% โดยไม่ต้องขาย`,
    minBudgetBalanced: '✓ สัดส่วนพอร์ตตรงตามเป้าหมายแล้ว (ไม่ต้องเติมเงินเพิ่ม)',
    minBudgetApply: 'ใช้ยอดนี้',
  },
  en: {
    splitWarn: (pct) => `Core+Ballast+Satellite total = ${pct}% (auto-normalized to 100% during calculation)`,
    addAsset: (label) => `+ Add asset to ${label}`,
    assetDefaultName: (n) => `Asset ${n}`,
    remove: 'Remove',
    fieldValue: 'Current value (THB)',
    fieldWeight: 'Target weight (%)',
    fieldUnits: 'Units',
    fieldPrice: 'Price / NAV',
    priceFetching: 'Fetching prices...',
    priceFetchDone: (time, rate) => `Prices updated: ${time} • USD/THB: ${rate}`,
    priceFetchError: 'Fetch failed (using cached prices)',
    testSuccess: (prov, price) => `✓ Connected! ${prov} price: $${price}`,
    testFailed: '❌ Connection failed. Please check your API key.',
    testCryptoOnly: '✓ Crypto & FX ready (No stock API key set)',
    testCryptoAndGoldReady: '✓ Crypto & FX ready',
    testTesting: 'Testing connection...',
    bucketStatus: (pct) => `This group's weights total ${pct}% (auto-normalized to 100%)`,
    amount: (n) => `${n} THB`,
    rmeta: (cur, target) => `Current ${cur} → target ${target}%`,
    rnewpct: (pct) => `After top-up ${pct}%`,
    totalAdded: 'Total added',
    cappedNote: (n) =>
      `${n} asset(s) in this group are already over target, so they get nothing this month — budget redistributed to the others.`,
    lastSaved: (t) => `Last saved ${t}`,
    resetConfirm: 'Clear the data saved in this browser and go back to defaults?',
    toggleAsset: 'Include/exclude this asset from calculation',
    assetExcluded: '🚫 Excluded',
    toggleBucket: 'Include/exclude this whole group from calculation',
    bucketExcluded: '🚫 Group Excluded',
    minBudgetSuggestion: (thb, usd) =>
      `💡 Add at least <span class="accent-amt">+${thb} THB</span><span class="rusd">($${usd})</span> to reach 100% target weights without selling`,
    minBudgetBalanced: '✓ Portfolio is currently at target weights (0 THB needed)',
    minBudgetApply: 'Apply this budget',
  },
};
function t(key, ...args) {
  const fn = (T[LANG] || T.th)[key];
  const v = typeof fn === 'function' ? fn(...args) : fn;
  return v;
}

const DEFAULT_FX_RATES = {
  THB: 1.0,
  USD: 33.39,
  EUR: 36.4,
  GBP: 43.5,
  JPY: 0.22,
  SGD: 25.6,
};

const CURRENCY_SYMBOLS = {
  THB: '฿',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  SGD: 'S$',
};

function getFxRate(currency) {
  if (!currency || currency === 'THB') return 1.0;
  const curr = String(currency).toUpperCase().trim();
  if (
    typeof state !== 'undefined' &&
    state &&
    state.fxRates &&
    typeof state.fxRates[curr] === 'number' &&
    state.fxRates[curr] > 0
  ) {
    return state.fxRates[curr];
  }
  if (
    typeof state !== 'undefined' &&
    state &&
    curr === 'USD' &&
    typeof state.usdThbRate === 'number' &&
    state.usdThbRate > 0
  ) {
    return state.usdThbRate;
  }
  return DEFAULT_FX_RATES[curr] || 1.0;
}

function getCurrencySymbol(currency) {
  const curr = String(currency || 'THB')
    .toUpperCase()
    .trim();
  return CURRENCY_SYMBOLS[curr] || curr;
}

const CURRENCY_COLORS = {
  THB: '#10b981',
  USD: '#3b82f6',
  EUR: '#8b5cf6',
  GBP: '#f59e0b',
  JPY: '#f43f5e',
  SGD: '#14b8a6',
  OTHER: '#64748b',
};

function computeCurrencyExposure(assets, totalVal) {
  if (!assets || !Array.isArray(assets) || assets.length === 0 || totalVal <= 0) {
    return {
      exposures: [],
      dominantCurrency: 'THB',
      dominantPct: 100,
    };
  }

  const map = {};
  for (const a of assets) {
    const curr = String(a.currency || 'THB')
      .toUpperCase()
      .trim();
    const val = Math.max(0, a.val ?? a.value ?? 0);
    if (!map[curr]) {
      map[curr] = {
        currency: curr,
        symbol: getCurrencySymbol(curr),
        color: CURRENCY_COLORS[curr] || CURRENCY_COLORS.OTHER,
        totalThb: 0,
      };
    }
    map[curr].totalThb += val;
  }

  const exposures = Object.values(map)
    .map((e) => ({
      ...e,
      sharePct: totalVal > 0 ? parseFloat(((e.totalThb / totalVal) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.totalThb - a.totalThb);

  const dominant = exposures[0] || { currency: 'THB', sharePct: 100 };

  return {
    exposures,
    dominantCurrency: dominant.currency,
    dominantPct: dominant.sharePct,
  };
}

function computeAllocationHeatmapCells(analyzedAssets) {
  if (!analyzedAssets || !Array.isArray(analyzedAssets)) return [];

  return analyzedAssets.map((a) => {
    const preDrift = typeof a.preDrift === 'number' ? a.preDrift : (a.currPct || 0) - (a.targetPct || 0);
    const absDrift = Math.abs(preDrift);
    const intensity = Math.min(1.0, parseFloat((absDrift / 5.0).toFixed(2)));

    let tone = 'aligned';
    let textColor = 'var(--ok)';
    let bgColor = 'rgba(16, 185, 129, 0.12)';
    let borderColor = 'rgba(16, 185, 129, 0.28)';

    if (preDrift > 1.0) {
      tone = 'overweight';
      textColor = 'var(--warn)';
      bgColor = `rgba(245, 158, 11, ${parseFloat((0.08 + intensity * 0.2).toFixed(2))})`;
      borderColor = `rgba(245, 158, 11, ${parseFloat((0.25 + intensity * 0.45).toFixed(2))})`;
    } else if (preDrift < -1.0) {
      tone = 'underweight';
      textColor = '#2563eb';
      bgColor = `rgba(37, 99, 235, ${parseFloat((0.08 + intensity * 0.2).toFixed(2))})`;
      borderColor = `rgba(37, 99, 235, ${parseFloat((0.25 + intensity * 0.45).toFixed(2))})`;
    }

    return {
      name: a.name,
      currency: a.currency || 'THB',
      currPct: a.currPct,
      targetPct: a.targetPct,
      preDrift: parseFloat(preDrift.toFixed(1)),
      absDrift: parseFloat(absDrift.toFixed(1)),
      intensity,
      tone,
      textColor,
      bgColor,
      borderColor,
    };
  });
}

const defaultState = {
  totalBudget: 200000,
  usdThbRate: 33.39,
  fxRates: { ...DEFAULT_FX_RATES },
  lastPriceFetch: 0,
  autoRefreshEnabled: true,
  buckets: [
    {
      id: 'core',
      label: 'Core',
      weight: 45,
      assets: [
        {
          name: 'K Global Equity (K-WORLDX)',
          ticker: 'K-WORLDX',
          units: 1000,
          lastPrice: 12.5,
          currency: 'THB',
          value: 12500,
          weight: 50,
        },
        {
          name: 'Short Treasury (SGOV)',
          ticker: 'SGOV',
          units: 10,
          lastPrice: 100.5,
          currency: 'USD',
          value: 33557,
          weight: 50,
        },
      ],
    },
    {
      id: 'ballast',
      label: 'Ballast',
      weight: 15,
      assets: [
        {
          name: 'YLG Gold Fund (YLG-GOLD)',
          ticker: 'YLG-GOLD',
          units: 1,
          lastPrice: 8919.09,
          currency: 'THB',
          value: 8919.09,
          weight: 70,
        },
        { name: 'Fixed Deposit / Cash', ticker: '', units: 0, lastPrice: 0, currency: 'THB', value: 30000, weight: 30 },
      ],
    },
    {
      id: 'satellite',
      label: 'Satellite',
      weight: 40,
      assets: [
        {
          name: 'Bitcoin (BTC)',
          ticker: 'BTC',
          units: 0.01,
          lastPrice: 65000,
          currency: 'USD',
          value: 21704,
          weight: 34,
        },
        { name: 'NVIDIA (NVDA)', ticker: 'NVDA', units: 5, lastPrice: 120, currency: 'USD', value: 20034, weight: 33 },
        {
          name: 'SCB China Equity (SCBCE)',
          ticker: 'SCBCE',
          units: 2500,
          lastPrice: 7.85,
          currency: 'THB',
          value: 19625,
          weight: 33,
        },
      ],
    },
  ],
};
const state = JSON.parse(JSON.stringify(defaultState));

const bucketsContainer = document.getElementById('bucketsContainer');
const totalBudgetEl = document.getElementById('totalBudget');
const splitBarEl = document.getElementById('splitBar');
const splitLegendEl = document.getElementById('splitLegend');
const splitWarnEl = document.getElementById('splitWarn');
const saveStatusEl = document.getElementById('saveStatus');
const resetBtn = document.getElementById('resetBtn');

function fmt(n) {
  return Math.round(n).toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH');
}
function fmtUSD(n) {
  return Math.round(n).toLocaleString('en-US');
}

// --- Quick math entry (+10000 / -5000 adds/subtracts from the field's current value) ---
const inputBaseValues = new WeakMap();

function isDeltaExpr(raw) {
  return /^\s*[+-]/.test(String(raw || ''));
}

// Resolves what a user typed into a numeric text field: a leading +/- is treated
// as a delta against `base` (e.g. "+10000" => base + 10000); anything else is a
// plain absolute number. Commas are tolerated so pasted "10,000" style text works.
function resolveNumericInput(raw, base) {
  if (raw == null) return 0;
  const trimmed = String(raw).trim().replace(/,/g, '');
  if (trimmed === '') return 0;
  const m = trimmed.match(/^([+-])\s*(\d*\.?\d*)$/);
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    const num = m[2] === '' ? 0 : parseFloat(m[2]);
    return (base || 0) + sign * (Number.isNaN(num) ? 0 : num);
  }
  const n = parseFloat(trimmed);
  return Number.isNaN(n) ? 0 : n;
}

function fmtPlain(n) {
  // Plain numeric string for writing back into an input (no thousands separators).
  return String(Math.round(n * 100) / 100);
}

function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Wires "type +N / -N to add/subtract from the current value" onto a text input.
// getBase() supplies the value to add/subtract from (snapshotted on focus, so a
// mid-typing string like "+1" doesn't recompute against its own live preview).
// onChange(newValue) fires live while typing, and once more on blur/Enter once
// the field is normalized back to a plain absolute number.
function enableDeltaInput(inputEl, getBase, onChange) {
  inputEl.addEventListener('focus', () => {
    inputBaseValues.set(inputEl, getBase());
    inputEl.select();
  });
  inputEl.addEventListener('input', () => {
    const raw = inputEl.value;
    const base = isDeltaExpr(raw) ? (inputBaseValues.has(inputEl) ? inputBaseValues.get(inputEl) : getBase()) : 0;
    onChange(resolveNumericInput(raw, base));
  });
  function finalize() {
    const raw = inputEl.value;
    if (isDeltaExpr(raw)) {
      const base = inputBaseValues.has(inputEl) ? inputBaseValues.get(inputEl) : getBase();
      const result = resolveNumericInput(raw, base);
      inputEl.value = fmtPlain(result);
      inputBaseValues.set(inputEl, result);
      onChange(result);
    } else if (raw.trim() !== '') {
      inputBaseValues.set(inputEl, resolveNumericInput(raw, 0));
    }
  }
  inputEl.addEventListener('blur', finalize);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      finalize();
      inputEl.blur();
    }
  });
}

// --- Autosave (localStorage) ---
const STORAGE_KEY = 'rebalanceCalculator.state.v1';

function saveState() {
  try {
    const minTrade = parseFloat(document.getElementById('minTradeThreshold')?.value) || 0;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        totalBudget: state.totalBudget,
        buckets: state.buckets,
        minTradeThreshold: minTrade,
        usdThbRate: state.usdThbRate || 33.39,
        fxRates: state.fxRates || DEFAULT_FX_RATES,
        lastPriceFetch: state.lastPriceFetch || 0,
        autoRefreshEnabled: state.autoRefreshEnabled !== false,
      }),
    );
    if (saveStatusEl) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      saveStatusEl.textContent = t('lastSaved', `${hh}:${mm}`);
    }
  } catch (e) {
    /* localStorage unavailable (private mode, etc.) — silently skip */
  }
}

function loadState() {
  try {
    const saved = MoneyApp.safeJsonParse(STORAGE_KEY, null);
    if (saved && typeof saved.totalBudget === 'number' && Array.isArray(saved.buckets)) {
      return saved;
    }
  } catch (e) {
    /* corrupted or unavailable — ignore, fall back to defaults */
  }
  return null;
}

const savedState = loadState();
if (savedState) {
  state.totalBudget = savedState.totalBudget;
  state.buckets = savedState.buckets;
  if (savedState.minTradeThreshold !== undefined && document.getElementById('minTradeThreshold')) {
    document.getElementById('minTradeThreshold').value = savedState.minTradeThreshold;
  }
  if (typeof savedState.usdThbRate === 'number') state.usdThbRate = savedState.usdThbRate;
  state.fxRates = Object.assign({}, DEFAULT_FX_RATES, savedState.fxRates || {});
  if (state.usdThbRate) state.fxRates.USD = state.usdThbRate;
  if (typeof savedState.lastPriceFetch === 'number') state.lastPriceFetch = savedState.lastPriceFetch;
  if (typeof savedState.autoRefreshEnabled === 'boolean') state.autoRefreshEnabled = savedState.autoRefreshEnabled;
  totalBudgetEl.value = state.totalBudget;
}

// --- Undo Subsystem ---
function captureSnapshot() {
  const minTrade = parseFloat(document.getElementById('minTradeThreshold')?.value) || 0;
  return {
    totalBudget: state.totalBudget,
    buckets: JSON.parse(JSON.stringify(state.buckets || [])),
    minTradeThreshold: minTrade,
    usdThbRate: state.usdThbRate || 33.39,
    fxRates: { ...(state.fxRates || DEFAULT_FX_RATES) },
  };
}

function restoreSnapshot(snap) {
  if (!snap) return;
  state.totalBudget = snap.totalBudget;
  state.buckets = JSON.parse(JSON.stringify(snap.buckets || []));
  if (snap.usdThbRate) state.usdThbRate = snap.usdThbRate;
  if (snap.fxRates) state.fxRates = { ...snap.fxRates };
  if (totalBudgetEl) totalBudgetEl.value = state.totalBudget;
  const minTradeEl = document.getElementById('minTradeThreshold');
  if (minTradeEl && snap.minTradeThreshold !== undefined) {
    minTradeEl.value = snap.minTradeThreshold;
  }
  renderSplit();
  renderBuckets();
  compute();
  saveState();
  updateUndoUI();
}

const undoMgr = MoneyApp.createUndoManager({
  maxDepth: 15,
  enableShortcuts: true,
  onUndo: (previousState) => {
    restoreSnapshot(previousState);
  },
});

function updateUndoUI() {
  const can = undoMgr.canUndo();
  const btnTop = document.getElementById('btnUndoTop');
  if (btnTop) btnTop.style.display = can ? 'inline-flex' : 'none';
  const btnBottom = document.getElementById('btnUndoBottom');
  if (btnBottom) btnBottom.style.display = can ? 'inline-block' : 'none';
}

function undoRebalanceChange() {
  undoMgr.undo();
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm(t('resetConfirm'))) {
      undoMgr.push(captureSnapshot());
      restoreSnapshot(defaultState);
      saveState();
      updateUndoUI();
    }
  });
}

// Water-filling allocation: buy-only rebalance toward target weights.
// Zero-weight assets are "frozen": they receive no new budget but their
// existing value is kept in lockedValue so T always reflects the full
// bucket portfolio, not just the active (non-frozen) slice.
function allocate(assets, budget) {
  const n = assets.length;
  const x = new Array(n).fill(0);
  const totalW = assets.reduce((s, a) => s + a.weight, 0) || 1;
  const w = assets.map((a) => a.weight / totalW);

  // Pre-eject zero-weight (frozen) assets; their value is locked into the total.
  let lockedValue = 0;
  let active = assets
    .map((_, i) => i)
    .filter((i) => {
      if (w[i] <= 0) {
        lockedValue += assets[i].value;
        return false;
      }
      return true;
    });

  let remaining = budget;
  let guard = 0;
  while (active.length > 0 && guard < 50) {
    guard++;
    const sumWActive = active.reduce((s, i) => s + w[i], 0);
    if (sumWActive <= 0) break;
    const sumVActive = active.reduce((s, i) => s + assets[i].value, 0);
    // T includes locked value so % targets stay proportional to the full bucket.
    const T = sumVActive + lockedValue + remaining;
    const target = {};
    // Active assets share only the non-locked portion of T.
    active.forEach((i) => {
      target[i] = (w[i] / sumWActive) * (T - lockedValue);
    });
    const over = active.filter((i) => target[i] < assets[i].value);
    if (over.length === 0) {
      active.forEach((i) => {
        x[i] = target[i] - assets[i].value;
      });
      break;
    } else {
      over.forEach((i) => {
        x[i] = 0;
        lockedValue += assets[i].value; // value stays in total, receives no budget
        active = active.filter((j) => j !== i);
      });
    }
  }
  return x;
}

// Rebalance budget across Core / Ballast / Satellite groups using buy-only water-filling
function allocateBuckets(totalBudget) {
  const activeIndices = [];
  state.buckets.forEach((b, idx) => {
    if (b.enabled !== false) activeIndices.push(idx);
  });
  const activeBucketAssets = activeIndices.map((idx) => {
    const b = state.buckets[idx];
    return {
      weight: b.weight || 0,
      value: b.assets.filter((a) => a.enabled !== false).reduce((s, a) => s + (a.value || 0), 0),
    };
  });
  const activeAlloc = allocate(activeBucketAssets, totalBudget);
  const x = new Array(state.buckets.length).fill(0);
  activeIndices.forEach((origIdx, activeIdx) => {
    x[origIdx] = activeAlloc[activeIdx];
  });
  return x;
}

// Calculate the minimum budget needed to reach 100% target weights across all active assets and groups
function calcMinBudget() {
  const activeBuckets = state.buckets.filter((b) => b.enabled !== false);
  const totalBucketW = activeBuckets.reduce((s, b) => s + b.weight, 0);
  if (activeBuckets.length === 0 || totalBucketW <= 0) return 0;

  const requiredPortTotals = [];
  let curTotalVal = 0;

  activeBuckets.forEach((b) => {
    const activeAssets = b.assets.filter((a) => a.enabled !== false);
    const totalAssetW = activeAssets.reduce((s, a) => s + a.weight, 0);
    const curBucketVal = activeAssets.reduce((s, a) => s + (a.value || 0), 0);
    curTotalVal += curBucketVal;

    let minBucketVal = curBucketVal;
    if (totalAssetW > 0) {
      activeAssets.forEach((a) => {
        if (a.weight > 0 && a.value > 0) {
          const normAssetW = a.weight / totalAssetW;
          const needed = a.value / normAssetW;
          if (needed > minBucketVal) minBucketVal = needed;
        }
      });
    }

    if (b.weight > 0) {
      const normBucketW = b.weight / totalBucketW;
      const portNeeded = minBucketVal / normBucketW;
      requiredPortTotals.push(portNeeded);
    }
  });

  const minPortTotal = Math.max(...requiredPortTotals, curTotalVal);
  return Math.max(0, Math.round(minPortTotal - curTotalVal));
}

function updateMinBudgetBanner() {
  const bannerEl = document.getElementById('minBudgetBanner');
  if (!bannerEl) return;

  const minBudget = calcMinBudget();
  const rate = state.usdThbRate || 33.39;
  const usdMin = Math.round(minBudget / rate);

  if (minBudget <= 0) {
    bannerEl.style.display = 'flex';
    bannerEl.innerHTML = `<span>${t('minBudgetBalanced')}</span>`;
  } else {
    bannerEl.style.display = 'flex';
    bannerEl.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
        <span>${t('minBudgetSuggestion', fmt(minBudget), fmtUSD(usdMin))}</span>
      </div>
      <button class="min-budget-apply-btn" onclick="applyMinBudget(${minBudget})">${t('minBudgetApply')}</button>
    `;
  }
}

function applyMinBudget(amt) {
  undoMgr.push(captureSnapshot());
  state.totalBudget = amt;
  totalBudgetEl.value = fmtPlain(amt);
  compute();
  saveState();
  updateUndoUI();
}

function renderSplit() {
  splitBarEl.innerHTML = '';
  splitLegendEl.innerHTML = '';
  const activeBuckets = state.buckets.filter((b) => b.enabled !== false);
  const totalW = activeBuckets.reduce((s, b) => s + b.weight, 0);

  state.buckets.forEach((b) => {
    const isEx = b.enabled === false;
    const seg = document.createElement('div');
    seg.style.background = `var(--${b.id})`;
    seg.style.flex = isEx ? 0 : Math.max(b.weight, 0.0001);
    if (isEx) seg.style.display = 'none';
    splitBarEl.appendChild(seg);

    const item = document.createElement('span');
    if (isEx) item.style.opacity = '0.5';
    item.innerHTML = `<span class="dot" style="background:var(--${b.id})"></span>${escapeAttr(b.label)}${isEx ? ` <span style="font-size:10px;color:var(--ink-faint);">(${t('assetExcluded')})</span>` : ''}<input type="number" data-bucket="${b.id}" value="${b.weight}" min="0" max="100" step="1" aria-label="${escapeAttr(b.label)} weight (%)" ${isEx ? 'disabled style="opacity:0.6;"' : ''}>%`;
    splitLegendEl.appendChild(item);
  });

  splitLegendEl.querySelectorAll('input:not([disabled])').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const bucket = state.buckets.find((b) => b.id === e.target.dataset.bucket);
      bucket.weight = parseFloat(e.target.value) || 0;
      compute();
    });
  });

  if (Math.abs(totalW - 100) > 0.5) {
    splitWarnEl.className = 'split-warn';
    splitWarnEl.textContent = t('splitWarn', totalW.toFixed(0));
  } else {
    splitWarnEl.className = 'split-warn ok';
  }
}

function renderBuckets() {
  bucketsContainer.innerHTML = '';
  state.buckets.forEach((bucket) => {
    const isExcluded = bucket.enabled === false;
    const panel = document.createElement('div');
    panel.className = `bucket-panel ${bucket.id}${isExcluded ? ' excluded' : ''}`;
    panel.innerHTML = `
      <div class="bucket-head">
        <div style="display:flex; align-items:center; gap:8px;">
          <input type="checkbox" class="bucket-enable-cb" data-bucket="${bucket.id}" ${!isExcluded ? 'checked' : ''} title="${t('toggleBucket')}" aria-label="${t('toggleBucket')} - ${escapeAttr(bucket.label)}">
          <div class="name">${escapeAttr(bucket.label)}</div>
        </div>
        <div class="amount" id="amt-${bucket.id}">—</div>
      </div>
      <div class="bucket-body">
        <div class="rows" id="rows-${bucket.id}"></div>
        <button class="add-btn" data-bucket="${bucket.id}">${t('addAsset', escapeAttr(bucket.label))}</button>
        <div class="weight-status" id="status-${bucket.id}"></div>
        <div class="results" id="results-${bucket.id}"></div>
        <div class="capped-note" id="capped-${bucket.id}" style="display:none;"></div>
        <div class="total-check" id="total-${bucket.id}"></div>
      </div>
    `;
    bucketsContainer.appendChild(panel);

    const cb = panel.querySelector('.bucket-enable-cb');
    if (cb) {
      cb.addEventListener('change', (e) => {
        const b = state.buckets.find((bk) => bk.id === e.target.dataset.bucket);
        if (b) {
          b.enabled = e.target.checked;
          panel.classList.toggle('excluded', !e.target.checked);
          renderSplit();
          compute();
        }
      });
    }

    renderAssetRows(bucket);

    panel.querySelector('.add-btn').addEventListener('click', () => {
      undoMgr.push(captureSnapshot());
      const newIdx = bucket.assets.length;
      bucket.assets.push({
        name: t('assetDefaultName', newIdx + 1),
        ticker: '',
        units: 0,
        lastPrice: 0,
        currency: 'USD',
        value: 0,
        weight: 0,
        enabled: true,
      });
      renderAssetRows(bucket);
      compute();
      saveState();
      updateUndoUI();
      const rowsEl = document.getElementById(`rows-${bucket.id}`);
      const nameInput = rowsEl.querySelectorAll('.asset-row-top input.name')[newIdx];
      if (nameInput) {
        nameInput.focus();
        nameInput.select();
      }
    });
  });
}

// --- Symbol & Currency Classification Helpers ---
const CRYPTO_SET = new Set([
  'BTC',
  'BITCOIN',
  'ETH',
  'ETHEREUM',
  'SOL',
  'SOLANA',
  'BNB',
  'XRP',
  'ADA',
  'DOGE',
  'AVAX',
  'DOT',
  'LINK',
  'MATIC',
  'LTC',
  'BCH',
  'NEAR',
  'SUI',
  'ATOM',
  'XLM',
  'ALGO',
  'UNI',
  'SHIB',
  'PEPE',
  'USDT',
  'USDC',
]);

const THAI_GOLD_SET = new Set(['GOLD-TH', 'GOLDTH', 'TH-GOLD', 'GOLD_BAR', 'GOLD-BAR', 'GOLDBAR', 'GOLD']);

// NOTE: YLG-GOLD and YLG are mutual fund tickers (YLG Gold Fund NAV per unit).
// They are classified as isThaiFundSymbol so users enter the NAV manually.
// THAI_GOLD_SET is reserved for physical gold bar spot price tracking.
function isThaiGoldSymbol(sym) {
  if (!sym) return false;
  const s = sym.toUpperCase().trim();
  return THAI_GOLD_SET.has(s) || s.startsWith('GOLD-TH') || s === 'THAI-GOLD';
}

const SET_STOCK_SET = new Set([
  'GULF',
  'PTT',
  'CPALL',
  'ADVANC',
  'AOT',
  'DELTA',
  'SCB',
  'KBANK',
  'BBL',
  'KTB',
  'BDMS',
  'BEM',
  'BTS',
  'TRUE',
  'INTUCH',
  'MINT',
  'EA',
  'CPF',
  'TOP',
  'IVL',
  'OR',
  'TISCO',
  'CRC',
  'HMPRO',
  'GPSC',
  'BGRIM',
  'SAWAD',
  'MTC',
  'KTC',
  'LH',
]);

function isSetStockSymbol(sym) {
  if (!sym) return false;
  const s = sym.toUpperCase().trim();
  return SET_STOCK_SET.has(s) || s.endsWith('.BK') || s.endsWith(':SET') || s.endsWith(':XBKK');
}

function isThaiFundSymbol(sym) {
  if (!sym) return false;
  const s = sym.toUpperCase().trim();
  return /^(K-|KF[A-Z0-9]|SCB|B-|KT-|TMB|TTB|ONE-|PRINCIPAL|LHPF|LHABS|UOB|ASP|DAOL|KKP|TISCO-|YLG)/i.test(s);
}

function isThaiAssetSymbol(sym) {
  if (!sym) return false;
  const s = sym.toUpperCase().trim();
  return isThaiGoldSymbol(s) || isThaiFundSymbol(s) || isSetStockSymbol(s) || s.endsWith('.BK') || s.endsWith('-THB');
}

// Known US equity / ETF tickers — used to prevent these from hitting Coinbase fallback
const KNOWN_US_EQUITIES =
  /^(MSFT|AMZN|GOOGL|GOOG|AAPL|NVDA|TSLA|META|AMD|INTC|NFLX|SPY|QQQ|VTI|VGT|SGOV|IVV|VOO|AGG|BND|GLD|SLV|IAU|TLT|HYG|LQD|XLK|XLF|XLE|XLV|XLY|XLI|VNQ|ARKK|SCHB|SCHA|SCHD|SCHX|VUG|VTV|VB|VO|VV|VXF)$/;

function isCryptoSymbol(sym) {
  if (!sym) return false;
  const s = sym.toUpperCase().trim();
  return CRYPTO_SET.has(s) || s.endsWith('-USD') || s.endsWith('-THB') || s.endsWith('USDT');
}

function renderAssetRows(bucket) {
  const rowsEl = document.getElementById(`rows-${bucket.id}`);
  rowsEl.innerHTML = '';
  bucket.assets.forEach((a, i) => {
    const row = document.createElement('div');
    const isExcluded = a.enabled === false;
    row.className = 'asset-row' + (isExcluded ? ' excluded' : '');
    const safeName = escapeAttr(a.name);
    const safeBucket = escapeAttr(bucket.label);
    const defName = escapeAttr(t('assetDefaultName', i + 1));
    const safeTicker = escapeAttr(a.ticker || '');
    const safeUnits = a.units != null && a.units !== 0 ? a.units : '';
    const safePrice = a.lastPrice != null && a.lastPrice !== 0 ? a.lastPrice : '';
    const approxTHB = a.lastPrice > 0 && a.units > 0 ? `~${fmt(a.value)} ฿` : '';

    let badgeHint = '';
    if (a.ticker) {
      const sym = a.ticker.toUpperCase().trim();
      if (isThaiFundSymbol(sym)) {
        badgeHint = `<span title="${LANG === 'en' ? 'Mutual fund: enter NAV manually (no open-CORS public API)' : 'กองทุนรวม: ระบุราคา NAV เอง (ไม่มี API สดสาธารณะ)'}" style="color:var(--ink-dim); font-size:9px; background:var(--panel-2); padding:1px 4px; border-radius:4px; border:1px solid var(--line); font-weight:600;">${LANG === 'en' ? 'NAV' : 'ระบุ NAV'}</span>`;
      } else if (isThaiGoldSymbol(sym)) {
        badgeHint = `<span title="${LANG === 'en' ? 'Live price from Thai Gold Association' : 'ราคาขายออกสดจากสมาคมค้าทองคำ'}" style="color:var(--core); font-size:9px; background:rgba(47,139,118,0.12); padding:1px 4px; border-radius:4px; font-weight:700;">${LANG === 'en' ? 'Live Gold ฿' : 'สดทอง ฿'}</span>`;
      } else if (isCryptoSymbol(sym)) {
        badgeHint = `<span title="${LANG === 'en' ? 'Live price from Coinbase' : 'ราคาตลาดสดจาก Coinbase'}" style="color:var(--core); font-size:9px; background:rgba(47,139,118,0.12); padding:1px 4px; border-radius:4px; font-weight:700;">${LANG === 'en' ? 'Live $' : 'สด $'}</span>`;
      } else if (isSetStockSymbol(sym)) {
        const hasKey = !!getApiSettings().twelveDataKey;
        badgeHint = hasKey
          ? `<span title="${LANG === 'en' ? 'Twelve Data SET live price' : 'ดึงราคาหุ้นไทยผ่าน Twelve Data'}" style="color:var(--core); font-size:9px; background:rgba(47,139,118,0.12); padding:1px 4px; border-radius:4px; font-weight:700;">SET ฿</span>`
          : `<span title="${LANG === 'en' ? 'SET stock: add Twelve Data API key or enter price manually' : 'หุ้นไทย: ใส่คีย์ Twelve Data ในตั้งค่า หรือระบุราคาเอง'}" style="color:var(--ink-dim); font-size:9px; background:var(--panel-2); padding:1px 4px; border-radius:4px; border:1px solid var(--line); font-weight:600;">${LANG === 'en' ? 'SET (Key req)' : 'หุ้นไทย'}</span>`;
      }
    }

    const isFirst = i === 0;
    const isLast = i === bucket.assets.length - 1;
    row.innerHTML = `
      <div class="asset-row-top">
        <input type="checkbox" class="asset-enable-cb" data-bucket="${bucket.id}" data-idx="${i}" data-field="enabled" ${!isExcluded ? 'checked' : ''} title="${t('toggleAsset')}" aria-label="${t('toggleAsset')} - ${safeName || defName}">
        <input class="name" data-bucket="${bucket.id}" data-idx="${i}" data-field="name" value="${safeName}" aria-label="${defName} - ${safeBucket}">
        <div style="display:flex;flex-direction:column;gap:2px;flex-shrink:0;">
          <button class="reorder-btn move-up-btn" data-bucket="${bucket.id}" data-idx="${i}" title="Move up" ${isFirst ? 'disabled' : ''}>&#9650;</button>
          <button class="reorder-btn move-down-btn" data-bucket="${bucket.id}" data-idx="${i}" title="Move down" ${isLast ? 'disabled' : ''}>&#9660;</button>
        </div>
        <button class="remove-btn" data-bucket="${bucket.id}" data-idx="${i}" title="${t('remove')}" aria-label="${t('remove')} ${safeName || defName}">&times;</button>
      </div>
      <div class="field-grid">
        <div class="field">
          <label>${t('fieldValue')}</label>
          <input type="text" inputmode="decimal" data-bucket="${bucket.id}" data-idx="${i}" data-field="value" value="${a.value}" aria-label="${t('fieldValue')} - ${safeName || defName}">
        </div>
        <div class="field">
          <label>${t('fieldWeight')}</label>
          <input type="number" data-bucket="${bucket.id}" data-idx="${i}" data-field="weight" value="${a.weight}" min="0" max="100" step="1" aria-label="${t('fieldWeight')} - ${safeName || defName}">
        </div>
      </div>
      <div class="live-fields-row" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:6px; margin-top:8px; padding-top:6px; border-top:1px dashed var(--line); font-size:11px;">
        <div style="display:flex; align-items:center; gap:4px;">
          <label style="color:var(--ink-faint); font-weight:600;" title="Ticker / Symbol">Ticker:</label>
          <input type="text" class="ticker-input" data-bucket="${bucket.id}" data-idx="${i}" data-field="ticker" value="${safeTicker}" placeholder="BTC / NVDA / K-WORLDX" style="width:82px; text-transform:uppercase; padding:3px 6px; border:1px solid var(--line); border-radius:5px; background:var(--panel-2); color:var(--ink); font-size:11px; font-family:monospace; font-weight:600;">
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <label style="color:var(--ink-faint); font-weight:600;">${t('fieldUnits')}:</label>
          <input type="number" step="any" min="0" class="units-input" data-bucket="${bucket.id}" data-idx="${i}" data-field="units" value="${safeUnits}" placeholder="0" style="width:64px; padding:3px 6px; border:1px solid var(--line); border-radius:5px; background:var(--panel-2); color:var(--ink); font-size:11px;">
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          <label style="color:var(--ink-faint); font-weight:600;">${t('fieldPrice')}:</label>
          <input type="number" step="any" min="0" class="price-input" data-bucket="${bucket.id}" data-idx="${i}" data-field="lastPrice" value="${safePrice}" placeholder="0.00" style="width:70px; padding:3px 6px; border:1px solid var(--line); border-radius:5px; background:var(--panel-2); color:var(--ink); font-size:11px;">
          <select class="currency-select" data-bucket="${bucket.id}" data-idx="${i}" data-field="currency" title="Currency / สกุลเงิน" style="padding:2px 3px; border:1px solid var(--line); border-radius:5px; background:var(--panel); color:var(--ink); font-size:10px; font-weight:700; cursor:pointer;">
            <option value="THB"${a.currency === 'THB' || (!a.currency && isThaiAssetSymbol(a.ticker)) ? ' selected' : ''}>฿ THB</option>
            <option value="USD"${a.currency === 'USD' || (!a.currency && !isThaiAssetSymbol(a.ticker)) ? ' selected' : ''}>$ USD</option>
            <option value="EUR"${a.currency === 'EUR' ? ' selected' : ''}>€ EUR</option>
            <option value="GBP"${a.currency === 'GBP' ? ' selected' : ''}>£ GBP</option>
            <option value="JPY"${a.currency === 'JPY' ? ' selected' : ''}>¥ JPY</option>
            <option value="SGD"${a.currency === 'SGD' ? ' selected' : ''}>S$ SGD</option>
          </select>
        </div>
        <div id="price-status-${bucket.id}-${i}" style="display:flex; align-items:center; gap:4px; color:var(--ink-dim); font-size:10px; font-weight:600;">
          <span>${approxTHB}</span>
          ${badgeHint}
        </div>
      </div>
    `;
    rowsEl.appendChild(row);
  });

  rowsEl.querySelectorAll('input.asset-enable-cb').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const b = state.buckets.find((bk) => bk.id === e.target.dataset.bucket);
      const idx = parseInt(e.target.dataset.idx);
      b.assets[idx].enabled = e.target.checked;
      const parentRow = e.target.closest('.asset-row');
      if (parentRow) parentRow.classList.toggle('excluded', !e.target.checked);
      compute();
    });
  });

  rowsEl
    .querySelectorAll('input[data-field="name"], input[data-field="weight"], input[data-field="ticker"]')
    .forEach((inp) => {
      inp.addEventListener('input', (e) => {
        const b = state.buckets.find((bk) => bk.id === e.target.dataset.bucket);
        const idx = parseInt(e.target.dataset.idx);
        const field = e.target.dataset.field;
        if (field === 'name') {
          b.assets[idx].name = e.target.value || t('assetDefaultName', idx + 1);
        } else if (field === 'ticker') {
          const sym = e.target.value.toUpperCase().trim();
          b.assets[idx].ticker = sym;
          if (isThaiAssetSymbol(sym)) {
            b.assets[idx].currency = 'THB';
            const currSel = rowsEl.querySelector(`select[data-field="currency"][data-idx="${idx}"]`);
            if (currSel) currSel.value = 'THB';
          } else if (isCryptoSymbol(sym) || sym.length > 0) {
            b.assets[idx].currency = 'USD';
            const currSel = rowsEl.querySelector(`select[data-field="currency"][data-idx="${idx}"]`);
            if (currSel) currSel.value = 'USD';
          }
        } else {
          b.assets[idx][field] = parseFloat(e.target.value) || 0;
        }
        compute();
      });
    });

  rowsEl.querySelectorAll('select[data-field="currency"]').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const b = state.buckets.find((bk) => bk.id === e.target.dataset.bucket);
      const idx = parseInt(e.target.dataset.idx);
      b.assets[idx].currency = e.target.value;
      const a = b.assets[idx];
      if (a.units > 0 && a.lastPrice > 0) {
        const rate = getFxRate(a.currency);
        a.value = Math.round(a.units * a.lastPrice * rate);
        const valInput = rowsEl.querySelector(`input[data-field="value"][data-idx="${idx}"]`);
        if (valInput) valInput.value = fmtPlain(a.value);
        const statusEl = document.getElementById(`price-status-${b.id}-${idx}`);
        if (statusEl) statusEl.textContent = `~${fmt(a.value)} ฿`;
      }
      compute();
    });
  });

  rowsEl.querySelectorAll('input[data-field="units"], input[data-field="lastPrice"]').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const b = state.buckets.find((bk) => bk.id === e.target.dataset.bucket);
      const idx = parseInt(e.target.dataset.idx);
      const field = e.target.dataset.field;
      const val = parseFloat(e.target.value);
      b.assets[idx][field] = Number.isNaN(val) ? 0 : val;

      const a = b.assets[idx];
      if (a.units > 0 && a.lastPrice > 0) {
        const curr = a.currency || (isThaiAssetSymbol(a.ticker) ? 'THB' : 'USD');
        const rate = getFxRate(curr);
        a.value = Math.round(a.units * a.lastPrice * rate);
        const valInput = rowsEl.querySelector(`input[data-field="value"][data-idx="${idx}"]`);
        if (valInput) valInput.value = fmtPlain(a.value);
        const statusEl = document.getElementById(`price-status-${b.id}-${idx}`);
        if (statusEl) statusEl.textContent = `~${fmt(a.value)} ฿`;
      }
      compute();
    });
  });

  rowsEl.querySelectorAll('input[data-field="value"]').forEach((inp) => {
    const bucketId = inp.dataset.bucket;
    const idx = parseInt(inp.dataset.idx);
    enableDeltaInput(
      inp,
      () => {
        const b = state.buckets.find((bk) => bk.id === bucketId);
        return b && b.assets[idx] ? b.assets[idx].value : 0;
      },
      (val) => {
        const b = state.buckets.find((bk) => bk.id === bucketId);
        if (b && b.assets[idx]) b.assets[idx].value = val;
        compute();
      },
    );
  });
  rowsEl.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      undoMgr.push(captureSnapshot());
      const b = state.buckets.find((bk) => bk.id === btn.dataset.bucket);
      const idx = parseInt(btn.dataset.idx);
      b.assets.splice(idx, 1);
      renderAssetRows(b);
      compute();
      saveState();
      updateUndoUI();
    });
  });

  rowsEl.querySelectorAll('.move-up-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const b = state.buckets.find((bk) => bk.id === btn.dataset.bucket);
      const idx = parseInt(btn.dataset.idx);
      if (idx <= 0) return;
      undoMgr.push(captureSnapshot());
      [b.assets[idx - 1], b.assets[idx]] = [b.assets[idx], b.assets[idx - 1]];
      renderAssetRows(b);
      saveState();
      updateUndoUI();
      compute();
    });
  });

  rowsEl.querySelectorAll('.move-down-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const b = state.buckets.find((bk) => bk.id === btn.dataset.bucket);
      const idx = parseInt(btn.dataset.idx);
      if (idx >= b.assets.length - 1) return;
      undoMgr.push(captureSnapshot());
      [b.assets[idx], b.assets[idx + 1]] = [b.assets[idx + 1], b.assets[idx]];
      renderAssetRows(b);
      saveState();
      updateUndoUI();
      compute();
    });
  });
}

function renderDonutChart() {
  const activeBuckets = state.buckets.filter((b) => b.enabled !== false);
  const totalVal = activeBuckets.reduce(
    (acc, b) => acc + b.assets.filter((a) => a.enabled !== false).reduce((sum, a) => sum + a.value, 0),
    0,
  );
  const totalBudget = state.totalBudget || 0;
  const newTotalVal = totalVal + totalBudget;

  const totalValEl = document.getElementById('donutTotalVal');
  const afterValEl = document.getElementById('donutAfterVal');
  if (totalValEl) totalValEl.textContent = t('amount', fmt(totalVal));
  if (afterValEl) {
    afterValEl.textContent = (LANG === 'en' ? 'After top-up: ' : 'หลังเติมเงิน: ') + t('amount', fmt(newTotalVal));
  }

  const C = 238.761;
  const bCore = state.buckets.find((b) => b.id === 'core');
  const bBallast = state.buckets.find((b) => b.id === 'ballast');
  const bSatellite = state.buckets.find((b) => b.id === 'satellite');

  const vCore =
    bCore && bCore.enabled !== false
      ? bCore.assets.filter((a) => a.enabled !== false).reduce((s, a) => s + a.value, 0)
      : 0;
  const vBallast =
    bBallast && bBallast.enabled !== false
      ? bBallast.assets.filter((a) => a.enabled !== false).reduce((s, a) => s + a.value, 0)
      : 0;
  const vSatellite =
    bSatellite && bSatellite.enabled !== false
      ? bSatellite.assets.filter((a) => a.enabled !== false).reduce((s, a) => s + a.value, 0)
      : 0;

  const pCore = totalVal > 0 ? (vCore / totalVal) * 100 : 0;
  const pBallast = totalVal > 0 ? (vBallast / totalVal) * 100 : 0;
  const pSatellite = totalVal > 0 ? (vSatellite / totalVal) * 100 : 0;

  const statCore = document.getElementById('donutCoreStat');
  const statBallast = document.getElementById('donutBallastStat');
  const statSatellite = document.getElementById('donutSatelliteStat');
  if (statCore) {
    statCore.textContent =
      bCore && bCore.enabled === false ? `Core: ${t('assetExcluded')}` : `Core: ${pCore.toFixed(1)}% (${fmt(vCore)})`;
  }
  if (statBallast) {
    statBallast.textContent =
      bBallast && bBallast.enabled === false
        ? `Ballast: ${t('assetExcluded')}`
        : `Ballast: ${pBallast.toFixed(1)}% (${fmt(vBallast)})`;
  }
  if (statSatellite) {
    statSatellite.textContent =
      bSatellite && bSatellite.enabled === false
        ? `Satellite: ${t('assetExcluded')}`
        : `Satellite: ${pSatellite.toFixed(1)}% (${fmt(vSatellite)})`;
  }

  const segCore = (pCore / 100) * C;
  const segBallast = (pBallast / 100) * C;
  const segSatellite = (pSatellite / 100) * C;

  const elCore = document.getElementById('donutCore');
  const elBallast = document.getElementById('donutBallast');
  const elSatellite = document.getElementById('donutSatellite');

  if (elCore) {
    elCore.setAttribute('stroke-dasharray', `${segCore} ${C - segCore}`);
    elCore.setAttribute('stroke-dashoffset', '0');
  }
  if (elBallast) {
    elBallast.setAttribute('stroke-dasharray', `${segBallast} ${C - segBallast}`);
    elBallast.setAttribute('stroke-dashoffset', String(-segCore));
  }
  if (elSatellite) {
    elSatellite.setAttribute('stroke-dasharray', `${segSatellite} ${C - segSatellite}`);
    elSatellite.setAttribute('stroke-dashoffset', String(-(segCore + segBallast)));
  }
}

function calculatePortfolioDrift(buckets, totalBudget = 0, tradeOrders = {}) {
  const activeBuckets = (buckets || []).filter((b) => b.enabled !== false);
  const totalBucketWeight = activeBuckets.reduce((sum, b) => sum + (b.weight || 0), 0) || 1;

  let totalVal = 0;
  const flatAssets = [];

  for (const b of activeBuckets) {
    const normBucketWeight = (b.weight || 0) / totalBucketWeight;
    const activeAssets = (b.assets || []).filter((a) => a.enabled !== false);
    const totalAssetWeightInBucket = activeAssets.reduce((sum, a) => sum + (a.weight || 0), 0) || 1;

    for (const a of activeAssets) {
      const normAssetWeightInBucket = (a.weight || 0) / totalAssetWeightInBucket;
      const targetPct = normBucketWeight * normAssetWeightInBucket * 100;
      const val = Math.max(0, a.value || 0);
      totalVal += val;

      const buyAmt = Math.max(0, (tradeOrders && (tradeOrders[a.id || a.name] ?? tradeOrders[a.name])) || 0);
      const currency = a.currency || (isThaiAssetSymbol(a.ticker) ? 'THB' : a.ticker ? 'USD' : 'THB');

      flatAssets.push({
        id: a.id || a.name,
        name: a.name,
        currency,
        bucketId: b.id,
        val,
        buyAmt,
        targetPct,
      });
    }
  }

  const postTotalVal = totalVal + totalBudget;
  let totalPreAbsDrift = 0;
  let totalPostAbsDrift = 0;

  const analyzedAssets = flatAssets.map((a) => {
    const currPct = totalVal > 0 ? (a.val / totalVal) * 100 : 0;
    const preDrift = currPct - a.targetPct;
    totalPreAbsDrift += Math.abs(preDrift);

    const postVal = a.val + a.buyAmt;
    const postPct = postTotalVal > 0 ? (postVal / postTotalVal) * 100 : a.targetPct;
    const postDrift = postPct - a.targetPct;
    totalPostAbsDrift += Math.abs(postDrift);

    let status = 'aligned';
    if (preDrift > 1.5) status = 'overweight';
    else if (preDrift < -1.5) status = 'underweight';

    return {
      name: a.name,
      currency: a.currency,
      val: a.val,
      buyAmt: a.buyAmt,
      currPct: parseFloat(currPct.toFixed(1)),
      targetPct: parseFloat(a.targetPct.toFixed(1)),
      preDrift: parseFloat(preDrift.toFixed(1)),
      postPct: parseFloat(postPct.toFixed(1)),
      postDrift: parseFloat(postDrift.toFixed(1)),
      status,
    };
  });

  const preTrackingError = parseFloat((totalPreAbsDrift / 2).toFixed(1));
  const postTrackingError = parseFloat((totalPostAbsDrift / 2).toFixed(1));

  let reductionPct = 0;
  if (preTrackingError > 0) {
    reductionPct = parseFloat((((preTrackingError - postTrackingError) / preTrackingError) * 100).toFixed(1));
  }

  return {
    totalVal,
    postTotalVal,
    preTrackingError,
    postTrackingError,
    reductionPct: Math.max(0, reductionPct),
    assets: analyzedAssets,
  };
}

function renderCurrencyExposure(assets, totalVal) {
  const barEl = document.getElementById('barCurrencyExposure');
  const chipsEl = document.getElementById('currencyChipsContainer');
  const shareEl = document.getElementById('txtPrimaryCurrencyShare');
  if (!barEl || !chipsEl) return;

  const res = computeCurrencyExposure(assets, totalVal);
  if (res.exposures.length === 0) {
    barEl.innerHTML = '';
    chipsEl.innerHTML = '';
    return;
  }

  if (shareEl) {
    shareEl.textContent = `${res.dominantCurrency} ${res.dominantPct.toFixed(1)}%`;
  }

  let barHtml = '';
  let chipsHtml = '';

  for (const exp of res.exposures) {
    barHtml += `<div style="width:${exp.sharePct}%; height:100%; background:${exp.color}; transition:width 0.3s ease;" title="${exp.currency} ${exp.sharePct}% (${fmt(exp.totalThb)} ฿)"></div>`;
    chipsHtml += `
      <span style="display:inline-flex; align-items:center; gap:4px; background:var(--panel-2); border:1px solid var(--line); border-radius:6px; padding:2px 7px;">
        <span style="width:6px; height:6px; border-radius:50%; background:${exp.color};"></span>
        <strong style="color:var(--ink);">${exp.symbol} ${exp.currency}</strong>
        <span style="color:var(--ink-dim);">${exp.sharePct.toFixed(1)}%</span>
        <span style="color:var(--ink-faint); font-size:9.5px;">(${fmt(exp.totalThb)} ฿)</span>
      </span>
    `;
  }

  barEl.innerHTML = barHtml;
  chipsEl.innerHTML = chipsHtml;
}

function renderAllocationHeatmap(analyzedAssets) {
  const gridEl = document.getElementById('heatmapGridContainer');
  if (!gridEl) return;

  const cells = computeAllocationHeatmapCells(analyzedAssets);
  if (cells.length === 0) {
    gridEl.innerHTML = '';
    return;
  }

  let html = '';
  for (const c of cells) {
    const sign = c.preDrift > 0 ? '+' : '';
    const arrow = c.tone === 'overweight' ? '🔼' : c.tone === 'underweight' ? '🔽' : '✓';
    html += `
      <div style="background:${c.bgColor}; border:1px solid ${c.borderColor}; border-radius:8px; padding:7px 8px; display:flex; flex-direction:column; justify-content:space-between; min-width:0; transition:border-color 0.2s ease;" title="${escapeAttr(c.name)}: ${LANG === 'en' ? 'Current' : 'ปัจจุบัน'} ${c.currPct.toFixed(1)}% | ${LANG === 'en' ? 'Target' : 'เป้า'} ${c.targetPct.toFixed(1)}%">
        <div style="font-weight:700; font-size:11px; color:var(--ink); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px;" title="${escapeAttr(c.name)}">${escapeAttr(c.name)}</div>
        <div style="display:flex; align-items:baseline; justify-content:space-between; font-size:10px;">
          <span style="color:var(--ink-dim);">${c.currPct.toFixed(1)}% <span style="color:var(--ink-faint);">/ ${c.targetPct.toFixed(1)}%</span></span>
          <span style="font-weight:700; color:${c.textColor}; font-size:10.5px;">${arrow} ${sign}${c.preDrift.toFixed(1)}%</span>
        </div>
      </div>
    `;
  }

  gridEl.innerHTML = html;
}

function updatePortfolioDriftUI(tradeOrders = {}) {
  const container = document.getElementById('portfolioDriftContainer');
  if (!container) return;

  const totalBudget = state.totalBudget || 0;
  const driftData = calculatePortfolioDrift(state.buckets, totalBudget, tradeOrders);

  if (driftData.totalVal <= 0 || driftData.assets.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  const valPreEl = document.getElementById('valPreDrift');
  const barPreEl = document.getElementById('barPreDrift');
  const valPostEl = document.getElementById('valPostDrift');
  const barPostEl = document.getElementById('barPostDrift');
  const badgeEl = document.getElementById('badgePortfolioHealth');
  const txtReductionEl = document.getElementById('txtDriftReduction');
  const extremesEl = document.getElementById('driftExtremesContainer');

  const preErr = driftData.preTrackingError;
  const postErr = driftData.postTrackingError;

  if (valPreEl) valPreEl.textContent = `${preErr.toFixed(1)}%`;
  if (barPreEl) {
    barPreEl.style.width = `${Math.min(100, preErr * 5)}%`;
    barPreEl.style.background = preErr <= 2 ? 'var(--ok)' : preErr <= 5 ? 'var(--warn)' : 'var(--bad)';
  }

  if (valPostEl) valPostEl.textContent = `${postErr.toFixed(1)}%`;
  if (barPostEl) {
    barPostEl.style.width = `${Math.min(100, postErr * 5)}%`;
    barPostEl.style.background = postErr <= 2 ? 'var(--ok)' : postErr <= 5 ? 'var(--warn)' : 'var(--bad)';
  }

  if (badgeEl) {
    if (preErr <= 2) {
      badgeEl.textContent = LANG === 'en' ? '✓ Well-Balanced' : '✓ สมดุลดี';
      badgeEl.style.background = 'var(--ok-dim)';
      badgeEl.style.color = 'var(--ok)';
    } else if (preErr <= 5) {
      badgeEl.textContent = LANG === 'en' ? '⚠️ Mild Drift' : '⚠️ เบี่ยงเบนเล็กน้อย';
      badgeEl.style.background = 'rgba(217, 119, 6, 0.15)';
      badgeEl.style.color = 'var(--warn)';
    } else {
      badgeEl.textContent = LANG === 'en' ? '🚨 High Drift' : '🚨 เบี่ยงเบนสูง';
      badgeEl.style.background = 'rgba(220, 38, 38, 0.15)';
      badgeEl.style.color = 'var(--bad)';
    }
  }

  if (txtReductionEl) {
    if (totalBudget > 0) {
      if (driftData.reductionPct > 0) {
        txtReductionEl.textContent =
          LANG === 'en'
            ? `DCA reduces tracking error by ${driftData.reductionPct.toFixed(1)}%`
            : `การเติมเงินช่วยลดความเบี่ยงเบนลง ${driftData.reductionPct.toFixed(1)}%`;
        txtReductionEl.style.color = 'var(--ok)';
      } else {
        txtReductionEl.textContent = LANG === 'en' ? 'Allocations steady after DCA' : 'สัดส่วนคงที่หลังเติมเงิน';
        txtReductionEl.style.color = 'var(--ink-dim)';
      }
    } else {
      txtReductionEl.textContent =
        LANG === 'en' ? 'Enter budget to project drift reduction' : 'ระบุงบลงทุนเพื่อดูผลลัพธ์การลดความเบี่ยงเบน';
      txtReductionEl.style.color = 'var(--ink-dim)';
    }
  }

  if (extremesEl) {
    extremesEl.innerHTML = '';
    const sorted = [...driftData.assets].sort((a, b) => b.preDrift - a.preDrift);
    const over = sorted.filter((a) => a.preDrift > 1.5);
    const under = sorted.filter((a) => a.preDrift < -1.5).reverse();

    const chips = [];
    over.slice(0, 2).forEach((a) => {
      chips.push(
        `<span style="background:rgba(217,119,6,0.12); color:var(--warn); border:1px solid rgba(217,119,6,0.25); border-radius:6px; padding:2px 7px; font-size:10.5px; display:inline-flex; align-items:center; gap:4px;">` +
          `<strong>${escapeAttr(a.name)}</strong>: +${a.preDrift.toFixed(1)}% 🔼 (${LANG === 'en' ? 'target' : 'เป้า'} ${a.targetPct.toFixed(1)}%)` +
          `</span>`,
      );
    });
    under.slice(0, 2).forEach((a) => {
      chips.push(
        `<span style="background:rgba(37,99,235,0.12); color:#2563eb; border:1px solid rgba(37,99,235,0.25); border-radius:6px; padding:2px 7px; font-size:10.5px; display:inline-flex; align-items:center; gap:4px;">` +
          `<strong>${escapeAttr(a.name)}</strong>: ${a.preDrift.toFixed(1)}% 🔽 (${LANG === 'en' ? 'target' : 'เป้า'} ${a.targetPct.toFixed(1)}%)` +
          `</span>`,
      );
    });

    if (chips.length > 0) {
      extremesEl.innerHTML = chips.join('');
    } else {
      extremesEl.innerHTML = `<span style="color:var(--ok); font-size:11px;">✓ ${LANG === 'en' ? 'All active assets are within target tolerance (±1.5%)' : 'สินทรัพย์ทั้งหมดอยู่ในกรอบเป้าหมาย (±1.5%)'}</span>`;
    }
  }

  renderCurrencyExposure(driftData.assets, driftData.totalVal);
  renderAllocationHeatmap(driftData.assets);
  renderPortfolioDiversification();
}

const MACRO_CORRELATIONS = {
  equities_us: {
    equities_us: 1.0,
    equities_world: 0.88,
    bonds: 0.15,
    gold: 0.08,
    real_estate: 0.65,
    crypto: 0.45,
    cash: 0.0,
  },
  equities_world: {
    equities_us: 0.88,
    equities_world: 1.0,
    bonds: 0.2,
    gold: 0.12,
    real_estate: 0.6,
    crypto: 0.4,
    cash: 0.0,
  },
  bonds: {
    equities_us: 0.15,
    equities_world: 0.2,
    bonds: 1.0,
    gold: 0.22,
    real_estate: 0.25,
    crypto: -0.05,
    cash: 0.1,
  },
  gold: { equities_us: 0.08, equities_world: 0.12, bonds: 0.22, gold: 1.0, real_estate: 0.15, crypto: 0.18, cash: 0.0 },
  real_estate: {
    equities_us: 0.65,
    equities_world: 0.6,
    bonds: 0.25,
    gold: 0.15,
    real_estate: 1.0,
    crypto: 0.25,
    cash: 0.0,
  },
  crypto: {
    equities_us: 0.45,
    equities_world: 0.4,
    bonds: -0.05,
    gold: 0.18,
    real_estate: 0.25,
    crypto: 1.0,
    cash: 0.0,
  },
  cash: { equities_us: 0.0, equities_world: 0.0, bonds: 0.1, gold: 0.0, real_estate: 0.0, crypto: 0.0, cash: 1.0 },
};

function detectAssetClass(name, ticker = '') {
  const s = `${name} ${ticker}`.toLowerCase();
  if (s.includes('gold') || s.includes('ทอง') || s.includes('iau') || s.includes('gld')) return 'gold';
  if (
    s.includes('bond') ||
    s.includes('bnd') ||
    s.includes('พันธบัตร') ||
    s.includes('gov') ||
    s.includes('debt') ||
    s.includes('ตราสารหนี้')
  )
    return 'bonds';
  if (s.includes('reit') || s.includes('vnq') || s.includes('อสังหา')) return 'real_estate';
  if (s.includes('btc') || s.includes('eth') || s.includes('crypto') || s.includes('เหรียญ')) return 'crypto';
  if (s.includes('cash') || s.includes('เงินสด') || s.includes('saving')) return 'cash';
  if (s.includes('vt') || s.includes('acwi') || s.includes('world') || s.includes('โลก') || s.includes('eunl'))
    return 'equities_world';
  return 'equities_us';
}

function calculatePortfolioDiversification(buckets = []) {
  let totalVal = 0;
  const classWeights = {};

  for (const b of (buckets || []).filter((b) => b.enabled !== false)) {
    for (const a of (b.assets || []).filter((a) => a.enabled !== false)) {
      const val = Math.max(0, Number(a.value) || 0);
      if (val > 0) {
        totalVal += val;
        const cls = detectAssetClass(a.name || '', a.ticker || '');
        classWeights[cls] = (classWeights[cls] || 0) + val;
      }
    }
  }

  const activeClasses = Object.keys(classWeights);
  if (totalVal <= 0 || activeClasses.length === 0) {
    return {
      totalVal: 0,
      weightedCorrelation: 1.0,
      diversificationScore: 0,
      tier: 'concentrated',
      classWeights: {},
      activeClasses: [],
    };
  }

  const normWeights = {};
  for (const cls of activeClasses) {
    normWeights[cls] = classWeights[cls] / totalVal;
  }

  let weightedCorrSum = 0;
  for (const c1 of activeClasses) {
    const w1 = normWeights[c1];
    for (const c2 of activeClasses) {
      const w2 = normWeights[c2];
      const corr =
        MACRO_CORRELATIONS[c1] && typeof MACRO_CORRELATIONS[c1][c2] === 'number'
          ? MACRO_CORRELATIONS[c1][c2]
          : c1 === c2
            ? 1.0
            : 0.5;
      weightedCorrSum += w1 * w2 * corr;
    }
  }

  const weightedCorrelation = Math.round(weightedCorrSum * 100) / 100;
  const diversificationScore = Math.max(0, Math.min(100, Math.round((1 - weightedCorrelation) * 100)));

  let tier = 'balanced';
  if (weightedCorrelation <= 0.5) tier = 'excellent';
  else if (weightedCorrelation <= 0.75) tier = 'balanced';
  else tier = 'concentrated';

  return {
    totalVal,
    weightedCorrelation,
    diversificationScore,
    tier,
    classWeights,
    activeClasses,
  };
}

function renderPortfolioDiversification() {
  const container = document.getElementById('diversificationContainer');
  const badgeEl = document.getElementById('badgeDiversificationScore');
  const gridEl = document.getElementById('diversificationMatrixGrid');
  const adviceEl = document.getElementById('diversificationAdvice');
  if (!container || !badgeEl || !gridEl) return;

  const res = calculatePortfolioDiversification(state.buckets);
  if (res.totalVal <= 0 || res.activeClasses.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  const isEn = LANG === 'en';
  const CLASS_LABELS = {
    equities_us: isEn ? 'US Stocks' : 'หุ้นสหรัฐฯ',
    equities_world: isEn ? 'World Stocks' : 'หุ้นโลก',
    bonds: isEn ? 'Fixed Income' : 'ตราสารหนี้',
    gold: isEn ? 'Gold' : 'ทองคำ',
    real_estate: isEn ? 'Real Estate' : 'อสังหาฯ',
    crypto: isEn ? 'Crypto' : 'คริปโต',
    cash: isEn ? 'Cash' : 'เงินสด',
  };

  let badgeColor = '#059669';
  let badgeBg = 'rgba(16,185,129,0.12)';
  let verdictText = isEn ? 'Excellent Diversification' : 'กระจายความเสี่ยงยอดเยี่ยม';

  if (res.tier === 'balanced') {
    badgeColor = '#0284c7';
    badgeBg = 'rgba(2,132,199,0.12)';
    verdictText = isEn ? 'Balanced Portfolio' : 'กระจายความเสี่ยงสมดุล';
  } else if (res.tier === 'concentrated') {
    badgeColor = '#d97706';
    badgeBg = 'rgba(217,119,6,0.12)';
    verdictText = isEn ? 'High Concentration' : 'กระจุกตัวสูง';
  }

  badgeEl.textContent = `🛡️ ${res.diversificationScore}/100 (${verdictText})`;
  badgeEl.style.color = badgeColor;
  badgeEl.style.background = badgeBg;

  let html = '';
  for (const cls of res.activeClasses) {
    const wPct = ((res.classWeights[cls] / res.totalVal) * 100).toFixed(1);
    const label = CLASS_LABELS[cls] || cls;
    html += `
      <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:6px; padding:5px 7px;">
        <div style="font-weight:700; color:var(--ink); font-size:10px;">${label}</div>
        <div style="color:var(--core); font-size:10.5px; font-weight:700; margin-top:2px;">${wPct}%</div>
      </div>
    `;
  }
  gridEl.innerHTML = html;

  if (adviceEl) {
    adviceEl.innerHTML = `
      <span>💡 ${
        isEn
          ? `Effective cross-asset correlation: <strong>${res.weightedCorrelation.toFixed(2)}</strong> (Lower correlation creates a smoother portfolio ride during market drawdowns).`
          : `ค่าสหสัมพันธ์ถ่วงน้ำหนักรวม: <strong>${res.weightedCorrelation.toFixed(2)}</strong> (ยิ่งต่ำ ยิ่งช่วยดูดซับแรงกระแทกเมื่อตลาดหุ้นผันผวน)`
      }</span>
    `;
  }
}

function compute() {
  const totalBudget = state.totalBudget || 0;
  renderSplit();
  renderDonutChart();
  updateMinBudgetBanner();

  const activeBuckets = state.buckets.filter((b) => b.enabled !== false);
  const totalVal = activeBuckets.reduce(
    (acc, b) => acc + b.assets.filter((a) => a.enabled !== false).reduce((sum, a) => sum + (a.value || 0), 0),
    0,
  );
  const bucketBudgets = allocateBuckets(totalBudget);
  const tradeOrders = {};

  state.buckets.forEach((bucket, bi) => {
    const isBucketExcluded = bucket.enabled === false;
    const bucketBudget = isBucketExcluded ? 0 : bucketBudgets[bi] || 0;
    const amtEl = document.getElementById(`amt-${bucket.id}`);
    if (amtEl) {
      amtEl.textContent = isBucketExcluded ? t('assetExcluded') : t('amount', fmt(bucketBudget));
    }

    const activeIndices = [];
    bucket.assets.forEach((a, idx) => {
      if (a.enabled !== false && !isBucketExcluded) activeIndices.push(idx);
    });
    const activeAssets = activeIndices.map((idx) => bucket.assets[idx]);

    const totalAssetW = activeAssets.reduce((s, a) => s + a.weight, 0);
    const statusEl = document.getElementById(`status-${bucket.id}`);
    if (isBucketExcluded) {
      statusEl.className = 'weight-status ok';
    } else if (Math.abs(totalAssetW - 100) < 0.5) {
      statusEl.className = 'weight-status ok';
    } else {
      statusEl.className = 'weight-status';
      statusEl.textContent = t('bucketStatus', totalAssetW.toFixed(0));
    }

    const activeAlloc = isBucketExcluded ? [] : allocate(activeAssets, bucketBudget);
    const x = new Array(bucket.assets.length).fill(0);
    activeIndices.forEach((origIdx, activeIdx) => {
      x[origIdx] = activeAlloc[activeIdx];
    });

    const currentTotal = activeAssets.reduce((s, a) => s + a.value, 0);
    const newTotal = currentTotal + bucketBudget;

    const resultsEl = document.getElementById(`results-${bucket.id}`);
    resultsEl.innerHTML = '';
    let cappedCount = 0;

    bucket.assets.forEach((a, i) => {
      const isExcluded = isBucketExcluded || a.enabled === false;
      const add = isExcluded ? 0 : x[i];
      if (!isExcluded) {
        tradeOrders[a.id || a.name] = add;
      }
      const newValue = isExcluded ? a.value : a.value + add;
      const newPct = !isExcluded && newTotal > 0 ? (newValue / newTotal) * 100 : 0;
      // Only count as "capped" if the asset is active and the bucket has budget
      if (!isExcluded && bucketBudget > 0 && add <= 0.5 && a.value > 0 && a.weight > 0) cappedCount++;

      const currPct = !isExcluded && currentTotal > 0 ? (a.value / currentTotal) * 100 : 0;
      let driftClass, driftText;
      if (isExcluded) {
        driftClass = 'drift-ok';
        driftText = t('assetExcluded');
      } else if (a.weight === 0) {
        // Intentionally frozen: no drift concept applies; surface a neutral badge.
        driftClass = 'drift-ok';
        driftText = LANG === 'en' ? '🔒 frozen' : '🔒 ตรึง';
      } else {
        const drift = currPct - a.weight;
        driftClass = 'drift-ok';
        driftText = `✓ ${drift >= 0 ? '+' : ''}${drift.toFixed(1)}%`;
        if (drift > 2) {
          driftClass = 'drift-over';
          driftText = `+${drift.toFixed(1)}% 🔼`;
        } else if (drift < -2) {
          driftClass = 'drift-under';
          driftText = `${drift.toFixed(1)}% 🔽`;
        }
      }

      const minTrade = parseFloat(document.getElementById('minTradeThreshold')?.value) || 0;
      const isBelowMin = !isExcluded && minTrade > 0 && add > 0 && add < minTrade;

      const rate = state.usdThbRate || 33.39;
      const usdAdd = Math.round(add / rate);
      const usdVal = Math.round(a.value / rate);
      const addText = !isExcluded && add > 0.5 ? `+${fmt(add)}<span class="rusd">($${fmtUSD(usdAdd)})</span>` : '—';

      const row = document.createElement('div');
      row.className = 'result-row' + (isExcluded ? ' excluded' : '');
      if (isExcluded) row.style.opacity = '0.55';
      row.innerHTML = `
        <div class="result-left">
          <div class="rname" style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span>${escapeAttr(a.name)}</span>
            <span class="drift-badge ${driftClass}" title="${isExcluded ? t('assetExcluded') : LANG === 'en' ? 'Drift from target' : 'ส่วนต่างจากเป้าหมาย'}">${driftText}</span>
          </div>
          <div class="rmeta">${isExcluded ? `(${t('assetExcluded')})` : `${t('rmeta', `${fmt(a.value)} ($${fmtUSD(usdVal)})`, a.weight)} (${LANG === 'en' ? 'Current' : 'ปัจจุบัน'}: ${currPct.toFixed(1)}%)`}</div>
        </div>
        <div class="result-right">
          <div class="radd ${add <= 0.5 ? 'zero' : ''}">${addText}</div>
          ${isBelowMin ? `<div class="below-min-badge" title="${LANG === 'en' ? 'Below minimum trade threshold' : 'ต่ำกว่ายอดซื้อขั้นต่ำ'}">⚠️ &lt; ${fmt(minTrade)}</div>` : ''}
          <div class="rnewpct">${isExcluded ? '—' : t('rnewpct', newPct.toFixed(1))}</div>
        </div>
      `;
      resultsEl.appendChild(row);
    });

    const totalAllocated = x.reduce((s, v) => s + Math.max(v, 0), 0);
    const totalCheckEl = document.getElementById(`total-${bucket.id}`);
    if (totalCheckEl) {
      totalCheckEl.innerHTML = isBucketExcluded
        ? `<span>${t('totalAdded')}</span><strong>—</strong>`
        : `<span>${t('totalAdded')}</span><strong>${t('amount', `${fmt(totalAllocated)} / ${fmt(bucketBudget)}`)}</strong>`;
    }

    const cappedEl = document.getElementById(`capped-${bucket.id}`);
    if (isBucketExcluded) {
      cappedEl.style.display = 'block';
      cappedEl.textContent = t('bucketExcluded');
    } else if (totalBudget > 0 && bucketBudget <= 0.5 && currentTotal > 0 && bucket.weight > 0) {
      cappedEl.style.display = 'block';
      const curPct = totalVal > 0 ? ((currentTotal / totalVal) * 100).toFixed(1) : '0';
      cappedEl.textContent =
        LANG === 'en'
          ? `This group is already over its target weight (${curPct}% vs target ${bucket.weight}%), so it receives 0 this month — budget redistributed to other groups.`
          : `กลุ่มนี้มีสัดส่วนเกินเป้าหมายแล้ว (${curPct}% จากเป้า ${bucket.weight}%) จึงไม่ได้รับงบเติมเงินเดือนนี้ (งบถูกกระจายไปกลุ่มอื่นที่ตามหลังแทน)`;
    } else if (cappedCount > 0) {
      cappedEl.style.display = 'block';
      cappedEl.textContent = t('cappedNote', cappedCount);
    } else {
      cappedEl.style.display = 'none';
    }
  });

  updatePortfolioDriftUI(tradeOrders);
  saveState();
}

enableDeltaInput(
  totalBudgetEl,
  () => state.totalBudget,
  (val) => {
    state.totalBudget = val;
    compute();
  },
);

function checkPendingBudget() {
  try {
    const raw = localStorage.getItem('moneySuperapp.pendingBudget');
    if (raw) {
      const budget = parseFloat(raw);
      if (!Number.isNaN(budget) && budget > 0) {
        undoMgr.push(captureSnapshot());
        state.totalBudget = budget;
        totalBudgetEl.value = fmtPlain(budget);
        localStorage.removeItem('moneySuperapp.pendingBudget');
        saveState();
        updateUndoUI();
        const source = localStorage.getItem('moneySuperapp.pendingRebalanceSource');
        localStorage.removeItem('moneySuperapp.pendingRebalanceSource');
        const alertEl = document.getElementById('pendingBudgetAlert');
        const textEl = document.getElementById('pendingBudgetText');
        if (alertEl && textEl) {
          if (source === 'refinance') {
            textEl.textContent =
              LANG === 'en'
                ? `✓ Loaded monthly debt refinance savings (+${fmt(budget)} THB/mo) as investment DCA budget!`
                : `✓ ดึงเงินประหยัดจากการรีไฟแนนซ์หนี้ (+${fmt(budget)} บาท/เดือน) มาเป็นงบ DCA ลงทุนจัดพอร์ตแล้ว!`;
          } else {
            textEl.textContent =
              LANG === 'en'
                ? `✓ Loaded remaining money (${fmt(budget)} THB) as investment budget!`
                : `✓ ดึงยอดเงินคงเหลือ (${fmt(budget)} บาท) มาเป็นงบลงทุนแล้ว!`;
          }
          alertEl.style.display = 'flex';
        }
      }
    }
  } catch (_e) {}
}

function dismissPendingBudget() {
  const alertEl = document.getElementById('pendingBudgetAlert');
  if (alertEl) alertEl.style.display = 'none';
}

function copyPortfolioSummary() {
  let lines = [
    LANG === 'en'
      ? `Portfolio DCA Top-up Plan (Budget: ${fmt(state.totalBudget)} THB):`
      : `แผนเติมเงิน DCA (งบ: ${fmt(state.totalBudget)} บาท):`,
  ];
  state.buckets.forEach((b) => {
    const isBucketEx = b.enabled === false;
    lines.push(`\n[${b.label}]${isBucketEx ? (LANG === 'en' ? ' [Group Excluded]' : ' [กลุ่มนี้ไม่รวมคำนวณ]') : ''}`);
    b.assets.forEach((a) => {
      const isEx = isBucketEx || a.enabled === false;
      lines.push(
        `- ${a.name}: ${LANG === 'en' ? 'Current' : 'ปัจจุบัน'} ${fmt(a.value)} (${a.weight}%)${isEx ? (LANG === 'en' ? ' [Excluded]' : ' [ไม่รวมคำนวณ]') : ''}`,
      );
    });
  });
  navigator.clipboard
    .writeText(lines.join('\n'))
    .then(() => {
      const lbl = document.getElementById('lblCopyPortfolio');
      if (lbl) {
        const orig = lbl.innerText;
        lbl.innerText = LANG === 'en' ? '✓ Copied!' : '✓ คัดลอกแล้ว!';
        setTimeout(() => {
          lbl.innerText = orig;
        }, 1800);
      }
    })
    .catch(() => {});
}

function copyTradeOrders() {
  const totalBudget = state.totalBudget || 0;
  const isEN = LANG === 'en';
  let lines = [
    isEN ? `📋 Trade Orders (Budget: ${fmt(totalBudget)} THB)` : `📋 รายการสั่งซื้อ (งบ: ${fmt(totalBudget)} บาท)`,
    '',
  ];
  const bucketBudgets = allocateBuckets(totalBudget);
  const rate = state.usdThbRate || 33.39;
  state.buckets.forEach((bucket, bi) => {
    if (bucket.enabled === false) return;
    const bucketBudget = bucketBudgets[bi] || 0;
    const activeIndices = [];
    bucket.assets.forEach((a, idx) => {
      if (a.enabled !== false) activeIndices.push(idx);
    });
    const activeAssets = activeIndices.map((idx) => bucket.assets[idx]);
    const activeAlloc = allocate(activeAssets, bucketBudget);
    const x = new Array(bucket.assets.length).fill(0);
    activeIndices.forEach((origIdx, activeIdx) => {
      x[origIdx] = activeAlloc[activeIdx];
    });
    lines.push(`[${bucket.label}]`);
    bucket.assets.forEach((a, i) => {
      if (a.enabled === false) return;
      const add = Math.round(x[i]);
      if (add > 0) {
        const usdAdd = Math.round(add / rate);
        lines.push(`  ${a.name}: +${fmt(add)} ${isEN ? 'THB' : 'บาท'} ($${fmtUSD(usdAdd)}) (${a.weight}%)`);
      }
    });
    lines.push('');
  });
  navigator.clipboard
    .writeText(lines.join('\n'))
    .then(() => {
      const lbl = document.getElementById('lblCopyTrade');
      if (lbl) {
        const orig = lbl.innerText;
        lbl.innerText = isEN ? '✓ Copied!' : '✓ คัดลอกแล้ว!';
        setTimeout(() => {
          lbl.innerText = orig;
        }, 1800);
      }
    })
    .catch(() => {});
}

function exportCSV() {
  const totalBudget = state.totalBudget || 0;
  let rows = [
    'Group,Asset,Ticker,Units,Price,Currency,Target %,Current Value (THB),Buy Amount (THB),Buy Amount (USD),Status',
  ];
  const bucketBudgets = allocateBuckets(totalBudget);
  const rate = state.usdThbRate || 33.39;
  state.buckets.forEach((bucket, bi) => {
    const isBucketEx = bucket.enabled === false;
    const bucketBudget = isBucketEx ? 0 : bucketBudgets[bi] || 0;
    const activeIndices = [];
    bucket.assets.forEach((a, idx) => {
      if (a.enabled !== false && !isBucketEx) activeIndices.push(idx);
    });
    const activeAssets = activeIndices.map((idx) => bucket.assets[idx]);
    const activeAlloc = isBucketEx ? [] : allocate(activeAssets, bucketBudget);
    const x = new Array(bucket.assets.length).fill(0);
    activeIndices.forEach((origIdx, activeIdx) => {
      x[origIdx] = activeAlloc[activeIdx];
    });
    bucket.assets.forEach((a, i) => {
      const isEx = isBucketEx || a.enabled === false;
      const add = isEx ? 0 : Math.round(x[i]);
      const usdAdd = isEx ? 0 : Math.round(add / rate);
      const curr = a.currency || (isThaiAssetSymbol(a.ticker) ? 'THB' : 'USD');
      const status = isBucketEx ? 'Group Excluded' : isEx ? 'Excluded' : 'Active';
      rows.push(
        `"${bucket.label}","${a.name}","${a.ticker || ''}",${a.units || 0},${a.lastPrice || 0},"${curr}",${a.weight},${a.value},${add},${usdAdd},"${status}"`,
      );
    });
  });
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `rebalance_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// --- Live Asset Price Fetching & API Integration ---

// Wraps fetch() with an AbortController timeout to prevent requests hanging indefinitely.
// Default: 10 seconds. Throws DOMException on abort.
function fetchWithTimeout(url, timeoutMs = 10000, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(id));
}

async function fetchThaiGoldPrice() {
  try {
    const res = await fetchWithTimeout('https://api.chnwt.dev/thai-gold-api/latest');
    if (!res.ok) throw new Error('Thai Gold HTTP ' + res.status);
    const data = await res.json();
    const rawPrice = data?.response?.price?.gold_bar?.sell || data?.response?.price?.gold?.sell;
    if (rawPrice) {
      const num = parseFloat(String(rawPrice).replace(/,/g, ''));
      if (!Number.isNaN(num) && num > 0) {
        return { price: num, currency: 'THB' };
      }
    }
  } catch (err) {
    console.warn('Thai Gold API fetch failed:', err);
  }
  return null;
}

function getApiSettings() {
  return MoneyApp.safeJsonParse('moneySuperapp.apiSettings', {});
}

function saveApiSettingsToStorage(settings) {
  try {
    localStorage.setItem('moneySuperapp.apiSettings', JSON.stringify(settings));
  } catch (_e) {}
}

function calculateCrossRates(rates) {
  if (!rates || typeof rates.THB !== 'number') return null;
  const thb = rates.THB;
  const result = { THB: 1.0, USD: thb };
  ['EUR', 'GBP', 'JPY', 'SGD'].forEach((c) => {
    if (typeof rates[c] === 'number' && rates[c] > 0) {
      result[c] = parseFloat((thb / rates[c]).toFixed(4));
    } else {
      result[c] = DEFAULT_FX_RATES[c];
    }
  });
  return result;
}

async function fetchFxRates() {
  try {
    const res = await fetchWithTimeout('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('FX HTTP ' + res.status);
    const data = await res.json();
    if (data && data.rates && typeof data.rates.THB === 'number') {
      return calculateCrossRates(data.rates);
    }
  } catch (err) {
    console.warn('FX fetch failed:', err);
  }
  return null;
}

async function fetchUsdThbRate() {
  const fx = await fetchFxRates();
  return fx ? fx.USD : null;
}

async function fetchAssetPrice(rawSymbol, apiSettings) {
  if (!rawSymbol) return null;
  const sym = rawSymbol.toUpperCase().trim();

  // 1. Try Thai Gold API for Thai Gold / Bullion (e.g. YLG-GOLD)
  if (isThaiGoldSymbol(sym)) {
    const gold = await fetchThaiGoldPrice();
    if (gold) return gold;
  }

  // 2. Try Coinbase for known Crypto symbols (e.g. BTC, ETH)
  if (isCryptoSymbol(sym)) {
    const cleanSym = sym.replace(/-USD$|-THB$|USDT$/, '');
    try {
      const res = await fetchWithTimeout(`https://api.coinbase.com/v2/prices/${encodeURIComponent(cleanSym)}-USD/spot`);
      if (res.ok) {
        const data = await res.json();
        const amt = parseFloat(data?.data?.amount);
        if (!Number.isNaN(amt) && amt > 0) {
          return { price: amt, currency: 'USD' };
        }
      }
    } catch (_e) {}
  }

  // 2b. Short-circuit Thai mutual funds — no open-CORS public NAV API exists.
  //     User must enter NAV manually. Prevents spurious 404s to Twelve Data / Coinbase
  //     for tickers like K-WORLDX, KFCSI300-A, SCBCE, B-INNOTECH, etc.
  if (isThaiFundSymbol(sym)) {
    return null;
  }

  // 3. Try Finnhub for US Stocks & ETFs (or .BK SET stocks)
  if (apiSettings.finnhubKey) {
    const isThai = isSetStockSymbol(sym);
    const querySym = isThai && !sym.includes('.') ? `${sym}.BK` : sym;
    try {
      const res = await fetchWithTimeout(
        `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(querySym)}&token=${encodeURIComponent(apiSettings.finnhubKey)}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.c === 'number' && data.c > 0) {
          const isTHB = isThai || querySym.endsWith('.BK');
          return { price: data.c, currency: isTHB ? 'THB' : 'USD' };
        }
      }
    } catch (_e) {}
  }

  // 4. Try Twelve Data for US Stocks & ETFs and Thai SET Stocks
  if (apiSettings.twelveDataKey) {
    const isThai = isSetStockSymbol(sym);
    // Normalise the base symbol (strip any existing exchange suffix) then build clean variants
    const baseSym = sym
      .replace(/\.BK$/i, '')
      .replace(/:SET$/i, '')
      .replace(/:XBKK$/i, '');
    const querySymbols = isThai ? [...new Set([baseSym, `${baseSym}:SET`, `${baseSym}.BK`])] : [sym];
    for (const qSym of querySymbols) {
      try {
        const res = await fetchWithTimeout(
          `https://api.twelvedata.com/price?symbol=${encodeURIComponent(qSym)}&apikey=${encodeURIComponent(apiSettings.twelveDataKey)}`,
        );
        if (res.ok) {
          const data = await res.json();
          const p = parseFloat(data?.price);
          if (!Number.isNaN(p) && p > 0) {
            const isTHB = isThai || qSym.includes(':SET') || qSym.endsWith('.BK');
            return { price: p, currency: isTHB ? 'THB' : 'USD' };
          }
        }
      } catch (_e) {}
    }
  }

  // 5. Coinbase fallback — only for short unknown tickers that might be crypto.
  //    Explicitly skip US equities/ETFs so they don't hit Coinbase and return 404.
  const looksLikeCrypto =
    !isThaiAssetSymbol(sym) &&
    !sym.includes('.') &&
    !sym.includes(':') &&
    sym.length <= 6 &&
    !KNOWN_US_EQUITIES.test(sym);
  if (looksLikeCrypto) {
    try {
      const res = await fetchWithTimeout(`https://api.coinbase.com/v2/prices/${encodeURIComponent(sym)}-USD/spot`);
      if (res.ok) {
        const data = await res.json();
        const amt = parseFloat(data?.data?.amount);
        if (!Number.isNaN(amt) && amt > 0) {
          return { price: amt, currency: 'USD' };
        }
      }
    } catch (_e) {}
  }

  return null;
}

let isFetchingPrices = false;

async function fetchAllPrices() {
  if (isFetchingPrices) return;
  isFetchingPrices = true;

  const btn = document.getElementById('btnRefreshPrices');
  const tsEl = document.getElementById('priceFetchTimestamp');
  if (btn) {
    btn.classList.add('loading');
    btn.disabled = true;
  }
  if (tsEl) tsEl.textContent = t('priceFetching');

  const apiSettings = getApiSettings();

  try {
    // 1. Fetch live FX rates (USD, EUR, GBP, JPY, SGD)
    const fxRates = await fetchFxRates();
    if (fxRates) {
      state.fxRates = fxRates;
      state.usdThbRate = fxRates.USD;
    }

    // 2. Collect all assets that have a ticker and CAN be auto-fetched.
    //    Thai mutual funds (isThaiFundSymbol) return null immediately — skip them
    //    so we don't waste a delay slot or show a spurious "loading" state.
    const fetchTargets = [];
    state.buckets.forEach((bucket) => {
      bucket.assets.forEach((a) => {
        const sym = (a.ticker || '').toUpperCase().trim();
        if (sym && !isThaiFundSymbol(sym)) {
          fetchTargets.push(a);
        }
      });
    });

    // 3. Cap to prevent indefinitely-long refresh runs (50 assets × 2s = 100s max)
    const MAX_FETCH = 50;
    if (fetchTargets.length > MAX_FETCH) {
      fetchTargets.length = MAX_FETCH;
    }

    // 3. Clear old fetched prices before starting so the UI shows "—" while loading,
    //    giving the user clear visual feedback that a refresh is in progress.
    //    We preserve lastPrice so that manual NAV entries (mutual funds) are untouched.
    fetchTargets.forEach((a) => {
      // Only wipe if the price was previously auto-fetched (lastFetched exists)
      if (a.lastFetched) {
        a._prevPrice = a.lastPrice; // stash for rollback on total failure
        a.lastPrice = null;
        a.lastFetched = null;
      }
    });
    renderBuckets(); // show "—" immediately

    // 4. Fetch sequentially with a per-request delay to respect Twelve Data free tier
    //    (8 req/min). 2 s gap means max 30 req/min — well within any free-tier limit
    //    while still completing a typical 6-asset portfolio in ~12 s.
    const FETCH_DELAY_MS = 2000;
    for (let idx = 0; idx < fetchTargets.length; idx++) {
      const a = fetchTargets[idx];
      const res = await fetchAssetPrice(a.ticker, apiSettings);
      if (res && res.price > 0) {
        a.lastPrice = res.price;
        a.currency = res.currency || (isThaiAssetSymbol(a.ticker) ? 'THB' : 'USD');
        a.lastFetched = Date.now();
        delete a._prevPrice;
        if (a.units != null && a.units > 0) {
          const effectiveRate = getFxRate(a.currency);
          a.value = Math.round(a.units * a.lastPrice * effectiveRate);
        }
      } else {
        // Restore stashed price so the asset still shows a value
        if (a._prevPrice != null) {
          a.lastPrice = a._prevPrice;
          delete a._prevPrice;
        }
        if (a.units != null && a.units > 0 && a.lastPrice > 0) {
          const effectiveRate = getFxRate(a.currency);
          a.value = Math.round(a.units * a.lastPrice * effectiveRate);
        }
      }
      // Render after each individual asset so the user sees prices fill in one by one
      renderBuckets();
      compute();

      // Delay before next request (skip delay after the last one)
      if (idx < fetchTargets.length - 1) {
        await new Promise((r) => setTimeout(r, FETCH_DELAY_MS));
      }
    }

    state.lastPriceFetch = Date.now();
    // Cleanup: ensure no stash properties persist across sessions
    fetchTargets.forEach((a) => {
      delete a._prevPrice;
    });
    saveState();
    renderBuckets();
    compute();
    updatePriceTimestampUI();
  } catch (err) {
    console.error('Price refresh error:', err);
    if (tsEl) tsEl.textContent = t('priceFetchError');
  } finally {
    isFetchingPrices = false;
    if (btn) {
      btn.classList.remove('loading');
      btn.disabled = false;
    }
  }
}

function updatePriceTimestampUI() {
  const tsEl = document.getElementById('priceFetchTimestamp');
  const fxEl = document.getElementById('fxRateBadge');
  if (fxEl) {
    const usdRate = (state.usdThbRate || getFxRate('USD')).toFixed(2);
    const eurRate = getFxRate('EUR').toFixed(2);
    fxEl.textContent = `USD: ${usdRate} | EUR: ${eurRate}`;
    fxEl.title = `USD: ${usdRate}฿ | EUR: ${eurRate}฿ | GBP: ${getFxRate('GBP').toFixed(2)}฿ | JPY: ${getFxRate('JPY').toFixed(2)}฿ | SGD: ${getFxRate('SGD').toFixed(2)}฿`;
  }
  if (!tsEl) return;
  if (!state.lastPriceFetch) {
    tsEl.textContent = LANG === 'en' ? 'Prices not fetched yet' : 'ยังไม่ได้ดึงราคาล่าสุด';
    return;
  }
  const d = new Date(state.lastPriceFetch);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const timeStr = `${hh}:${mm}:${ss}`;
  const rateStr = state.usdThbRate ? state.usdThbRate.toFixed(2) : '33.39';
  tsEl.textContent = t('priceFetchDone', timeStr, rateStr);
}

let autoRefreshTimer = null;

function initAutoRefresh() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);
  const chk = document.getElementById('chkAutoRefresh');
  if (chk) chk.checked = state.autoRefreshEnabled !== false;

  // 10-minute recurring auto-refresh (600,000 ms)
  autoRefreshTimer = setInterval(
    () => {
      if (state.autoRefreshEnabled !== false && document.visibilityState === 'visible') {
        const hasTickers = state.buckets.some((b) => b.assets.some((a) => a.ticker && a.ticker.trim()));
        if (hasTickers) {
          fetchAllPrices();
        }
      }
    },
    10 * 60 * 1000,
  );
}

function toggleAutoRefresh(enabled) {
  state.autoRefreshEnabled = enabled;
  saveState();
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && state.autoRefreshEnabled !== false) {
    const elapsed = Date.now() - (state.lastPriceFetch || 0);
    if (elapsed >= 10 * 60 * 1000) {
      const hasTickers = state.buckets.some((b) => b.assets.some((a) => a.ticker && a.ticker.trim()));
      if (hasTickers) {
        fetchAllPrices();
      }
    }
  }
});

// Modal Management
function openApiSettingsModal() {
  const modal = document.getElementById('apiSettingsModal');
  const finnhubInput = document.getElementById('inputFinnhubKey');
  const twelveDataInput = document.getElementById('inputTwelveDataKey');
  const statusEl = document.getElementById('apiTestStatus');

  const settings = getApiSettings();
  if (finnhubInput) finnhubInput.value = settings.finnhubKey || '';
  if (twelveDataInput) twelveDataInput.value = settings.twelveDataKey || '';
  if (statusEl) statusEl.style.display = 'none';

  if (modal) modal.style.display = 'flex';
}

function closeApiSettingsModal() {
  const modal = document.getElementById('apiSettingsModal');
  if (modal) modal.style.display = 'none';
}

function saveApiSettings() {
  const finnhubKey = document.getElementById('inputFinnhubKey').value.trim();
  const twelveDataKey = document.getElementById('inputTwelveDataKey').value.trim();

  saveApiSettingsToStorage({ finnhubKey, twelveDataKey });
  closeApiSettingsModal();
  fetchAllPrices();
}

async function testApiKeys() {
  const statusEl = document.getElementById('apiTestStatus');
  if (!statusEl) return;
  statusEl.style.display = 'block';
  statusEl.style.background = 'var(--panel-2)';
  statusEl.style.color = 'var(--ink)';
  statusEl.textContent = t('testTesting');

  const finnhubKey = document.getElementById('inputFinnhubKey').value.trim();
  const twelveDataKey = document.getElementById('inputTwelveDataKey').value.trim();

  let cryptoOk = false;
  try {
    const cb = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    cryptoOk = cb.ok;
  } catch (_e) {}

  let goldOk = false;
  try {
    const gold = await fetchThaiGoldPrice();
    goldOk = !!(gold && gold.price > 0);
  } catch (_e) {}

  if (finnhubKey) {
    try {
      const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=NVDA&token=${encodeURIComponent(finnhubKey)}`);
      const data = await res.json();
      if (data && typeof data.c === 'number' && data.c > 0) {
        statusEl.style.background = 'rgba(47, 139, 118, 0.15)';
        statusEl.style.color = 'var(--core)';
        statusEl.textContent = t('testSuccess', 'NVDA (Finnhub)', data.c.toFixed(2));
        return;
      }
    } catch (_e) {}
  }

  if (twelveDataKey) {
    try {
      const res = await fetch(
        `https://api.twelvedata.com/price?symbol=NVDA&apikey=${encodeURIComponent(twelveDataKey)}`,
      );
      const data = await res.json();
      if (data && data.price) {
        statusEl.style.background = 'rgba(47, 139, 118, 0.15)';
        statusEl.style.color = 'var(--core)';
        statusEl.textContent = t('testSuccess', 'NVDA (Twelve Data)', parseFloat(data.price).toFixed(2));
        return;
      }
    } catch (_e) {}
  }

  if (!finnhubKey && !twelveDataKey) {
    if (cryptoOk && goldOk) {
      statusEl.style.background = 'rgba(47, 139, 118, 0.15)';
      statusEl.style.color = 'var(--core)';
      statusEl.textContent = t('testCryptoAndGoldReady');
    } else if (cryptoOk || goldOk) {
      statusEl.style.background = 'rgba(47, 139, 118, 0.15)';
      statusEl.style.color = 'var(--core)';
      statusEl.textContent = t('testCryptoOnly');
    } else {
      statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
      statusEl.style.color = 'var(--danger)';
      statusEl.textContent = t('testFailed');
    }
  } else {
    statusEl.style.background = 'rgba(239, 68, 68, 0.15)';
    statusEl.style.color = 'var(--danger)';
    statusEl.textContent = t('testFailed');
  }
}

window.addEventListener('focus', () => {
  checkPendingBudget();
  compute();
});

// ==========================================
// Thai Gold Bar & Jewelry DCA & P/L Calculator
// ==========================================

const GOLD_STORAGE_KEY = 'moneySuperapp.thaiGold.state.v1';

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
    const saved = MoneyApp.safeJsonParse(GOLD_STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      goldState = Object.assign({}, goldState, saved);
    }
  } catch (_e) {}
}

function saveGoldState() {
  try {
    localStorage.setItem(GOLD_STORAGE_KEY, JSON.stringify(goldState));
  } catch (_e) {}
}

function toggleThaiGoldCalculator() {
  if (rebalanceLayoutManager) {
    rebalanceLayoutManager.toggleCard('panelThaiGold');
  } else {
    const panel = document.getElementById('goldPanelBody');
    if (!panel) return;
    const isHidden = panel.classList.contains('card-collapsed-hidden');
    panel.classList.toggle('card-collapsed-hidden', !isHidden);
  }
  updateGoldCalculator();
}

function updateGoldCalculator(save = true) {
  const typeEl = document.getElementById('selGoldType');
  const unitEl = document.getElementById('selGoldUnit');
  const weightEl = document.getElementById('inpGoldWeight');
  const costEl = document.getElementById('inpGoldCost');
  const feeEl = document.getElementById('inpGoldFee');
  const marketPriceEl = document.getElementById('inpGoldMarketPrice');

  if (!typeEl || !unitEl || !weightEl) return;

  const goldType = typeEl.value || 'bar';
  const weightUnit = unitEl.value || 'baht';
  const weight = parseFloat(weightEl.value) || 0;
  const costPerBaht = parseFloat(costEl?.value) || 0;
  const blockFee = parseFloat(feeEl?.value) || 0;
  const marketPrice = parseFloat(marketPriceEl?.value) || 0;

  goldState.goldType = goldType;
  goldState.weightUnit = weightUnit;
  goldState.weight = weight;
  goldState.costPerBaht = costPerBaht;
  goldState.blockFee = blockFee;
  goldState.marketPrice = marketPrice;

  const params = {
    goldType: goldType,
    weightUnit: weightUnit,
    weight: weight,
    costPerBaht: costPerBaht,
    blockFee: blockFee,
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

  const metrics = MoneyApp.calculateThaiGoldMetrics(params);

  // Update Weight conversions bar
  const equivEl = document.getElementById('txtGoldWeightEquiv');
  if (equivEl) {
    if (LANG === 'en') {
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

  const unitStr = LANG === 'en' ? 'THB' : 'บาท';

  if (valCostEl) valCostEl.textContent = `${MoneyApp.formatMoney(metrics.totalCost)} ${unitStr}`;
  if (subCostEl) {
    subCostEl.textContent =
      LANG === 'en'
        ? `Avg ${MoneyApp.formatMoney(metrics.effectiveCostPerBaht)} THB/Baht`
        : `เฉลี่ย ${MoneyApp.formatMoney(metrics.effectiveCostPerBaht)} บาท/บาท`;
  }
  if (valMarketEl) valMarketEl.textContent = `${MoneyApp.formatMoney(metrics.marketValue)} ${unitStr}`;
  if (subBreakEvenEl) {
    subBreakEvenEl.textContent =
      LANG === 'en'
        ? `Breakeven ${MoneyApp.formatMoney(metrics.breakEvenMarketPrice)} THB/Baht`
        : `คุ้มทุน ${MoneyApp.formatMoney(metrics.breakEvenMarketPrice)} บาท/บาท`;
  }

  if (valPLEl) {
    const isGain = metrics.unrealizedGainLoss >= 0;
    valPLEl.textContent = `${isGain ? '+' : ''}${MoneyApp.formatMoney(metrics.unrealizedGainLoss)} ${unitStr}`;
    valPLEl.style.color = isGain ? 'var(--ok, #10b981)' : 'var(--danger, #ef4444)';
  }
  if (subPLPctEl) {
    const isGain = metrics.unrealizedGainLossPct >= 0;
    subPLPctEl.textContent = `${isGain ? '+' : ''}${metrics.unrealizedGainLossPct.toFixed(1)}%`;
    subPLPctEl.style.color = isGain ? 'var(--ok, #10b981)' : 'var(--danger, #ef4444)';
  }

  if (valLiqEl) valLiqEl.textContent = `${MoneyApp.formatMoney(metrics.liquidationValue)} ${unitStr}`;
  if (subLiqPLEl) {
    const isGain = metrics.liquidationGainLoss >= 0;
    subLiqPLEl.textContent =
      LANG === 'en'
        ? `Buyback P/L: ${isGain ? '+' : ''}${MoneyApp.formatMoney(metrics.liquidationGainLoss)} ${unitStr}`
        : `ขายคืนวันนี้: ${isGain ? '+' : ''}${MoneyApp.formatMoney(metrics.liquidationGainLoss)} บาท`;
  }

  if (save) {
    saveGoldState();
  }
}

function setGoldWeightPreset(weight, unit = 'baht') {
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

async function syncGoldMarketPrice() {
  const btn = document.getElementById('btnSyncGoldPrice');
  const inp = document.getElementById('inpGoldMarketPrice');
  if (btn) btn.disabled = true;
  try {
    const data = await fetchThaiGoldPrice();
    if (data && data.price > 0) {
      if (inp) inp.value = Math.round(data.price);
      updateGoldCalculator();
    }
  } catch (e) {
    console.warn('Failed to fetch gold price:', e);
  } finally {
    if (btn) btn.disabled = false;
  }
}

function renderGoldLotsTable() {
  const container = document.getElementById('goldLotsContainer');
  const tbody = document.getElementById('goldLotsTableBody');
  if (!container || !tbody) return;

  if (!goldState.lots || goldState.lots.length === 0) {
    container.style.display = 'none';
    tbody.innerHTML = '';
    return;
  }

  container.style.display = 'block';
  tbody.innerHTML = goldState.lots
    .map((lot, idx) => {
      const typeLabel =
        lot.goldType === 'jewelry' ? (LANG === 'en' ? 'Jewelry' : 'รูปพรรณ') : LANG === 'en' ? 'Bar' : 'แท่ง';
      let unitLabel = LANG === 'en' ? 'Baht' : 'บาท';
      if (lot.weightUnit === 'salung') unitLabel = LANG === 'en' ? 'Salung' : 'สลึง';
      else if (lot.weightUnit === 'gram') unitLabel = LANG === 'en' ? 'g' : 'กรัม';

      return `
      <tr style="border-bottom:1px solid var(--line);">
        <td style="padding:4px 6px; color:var(--ink-dim);">${MoneyApp.escapeHtml(lot.date || '-')}</td>
        <td style="padding:4px 6px; font-weight:600;">${typeLabel}</td>
        <td style="padding:4px 6px; text-align:right;">${lot.weight} ${unitLabel}</td>
        <td style="padding:4px 6px; text-align:right;">${MoneyApp.formatMoney(lot.costPerBaht)}</td>
        <td style="padding:4px 6px; text-align:right;">${MoneyApp.formatMoney(lot.blockFee || 0)}</td>
        <td style="padding:4px 6px; text-align:right;">
          <button type="button" onclick="removeGoldLot(${idx})" style="background:none; border:none; color:var(--warn); cursor:pointer; font-size:11px;" aria-label="Remove lot">&times;</button>
        </td>
      </tr>
    `;
    })
    .join('');
}

function addGoldLotToHistory() {
  const typeEl = document.getElementById('selGoldType');
  const unitEl = document.getElementById('selGoldUnit');
  const weightEl = document.getElementById('inpGoldWeight');
  const costEl = document.getElementById('inpGoldCost');
  const feeEl = document.getElementById('inpGoldFee');

  const weight = parseFloat(weightEl?.value) || 0;
  const cost = parseFloat(costEl?.value) || 0;
  if (weight <= 0 || cost <= 0) return;

  const lot = {
    id: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    goldType: typeEl?.value || 'bar',
    weightUnit: unitEl?.value || 'baht',
    weight: weight,
    costPerBaht: cost,
    blockFee: parseFloat(feeEl?.value) || 0,
  };

  if (!goldState.lots) goldState.lots = [];
  goldState.lots.push(lot);
  saveGoldState();
  renderGoldLotsTable();
  updateGoldCalculator();
}

function removeGoldLot(idx) {
  if (goldState.lots && goldState.lots[idx]) {
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

function exportGoldToPortfolio() {
  const typeEl = document.getElementById('selGoldType');
  const unitEl = document.getElementById('selGoldUnit');
  const weightEl = document.getElementById('inpGoldWeight');
  const costEl = document.getElementById('inpGoldCost');
  const feeEl = document.getElementById('inpGoldFee');
  const marketPriceEl = document.getElementById('inpGoldMarketPrice');

  const params = {
    goldType: typeEl?.value || 'bar',
    weightUnit: unitEl?.value || 'baht',
    weight: parseFloat(weightEl?.value) || 0,
    costPerBaht: parseFloat(costEl?.value) || 0,
    blockFee: parseFloat(feeEl?.value) || 0,
    currentMarketPrice: parseFloat(marketPriceEl?.value) || 0,
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

  const metrics = MoneyApp.calculateThaiGoldMetrics(params);
  if (!metrics || metrics.marketValue <= 0) return;

  let foundAsset = null;
  for (const b of state.buckets) {
    if (!b.assets) continue;
    foundAsset = b.assets.find((a) => a.ticker === 'GOLD' || a.ticker === 'GOLDBAR');
    if (foundAsset) break;
  }

  if (foundAsset) {
    foundAsset.value = metrics.marketValue;
    foundAsset.units = metrics.weightBaht;
    foundAsset.lastPrice = metrics.currentMarketPrice;
    foundAsset.currency = 'THB';
  } else {
    const targetBucket = state.buckets.find((b) => b.id === 'ballast') || state.buckets[0];
    if (targetBucket) {
      if (!targetBucket.assets) targetBucket.assets = [];
      targetBucket.assets.push({
        name: LANG === 'en' ? 'Physical Thai Gold (96.5%)' : 'ทองคำแท่ง/รูปพรรณ (96.5%)',
        ticker: 'GOLD',
        units: metrics.weightBaht,
        lastPrice: metrics.currentMarketPrice,
        currency: 'THB',
        value: metrics.marketValue,
        weight: 10,
      });
    }
  }

  saveState();
  renderBuckets();
  compute();

  const exportBtn = document.getElementById('lblExportGoldToPortfolio');
  if (exportBtn) {
    const originalText = exportBtn.textContent;
    exportBtn.textContent = LANG === 'en' ? '✓ Exported!' : '✓ ส่งข้อมูลแล้ว!';
    setTimeout(() => {
      exportBtn.textContent = originalText;
    }, 2000);
  }
}

function initGoldCalculator() {
  loadGoldState();

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

  renderGoldLotsTable();
  updateGoldCalculator(false);

  // If market price is default or 0, trigger price sync
  if (!goldState.marketPrice || goldState.marketPrice === 42000) {
    syncGoldMarketPrice();
  }
}

// ==========================================
// Foreign Investment & Crypto Repatriation Tax Advisor (Roadmap Phase 63)
// ==========================================
const FOREIGN_TAX_STORAGE_KEY = 'money_superapp_foreign_tax_v1';
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
  } catch (_e) {
    // Graceful fallback to default state
  }
}

function saveForeignTaxState() {
  try {
    localStorage.setItem(FOREIGN_TAX_STORAGE_KEY, JSON.stringify(foreignTaxState));
  } catch (_e) {
    // Storage quota or disabled fallback
  }
}

function toggleForeignTaxAdvisor() {
  if (rebalanceLayoutManager) {
    rebalanceLayoutManager.toggleCard('panelForeignTaxAdvisor');
  } else {
    const panel = document.getElementById('foreignTaxPanelBody');
    if (!panel) return;
    const isHidden = panel.classList.contains('card-collapsed-hidden');
    panel.classList.toggle('card-collapsed-hidden', !isHidden);
  }
  updateForeignTaxUI();
}

function setRemittancePreset(amt) {
  const inp = document.getElementById('inpRemittanceAmount');
  if (inp) {
    inp.value = amt;
    updateForeignTaxUI();
  }
}

function setRemittancePre2024Full() {
  const remitEl = document.getElementById('inpRemittanceAmount');
  const preEl = document.getElementById('inpPre2024Amount');
  if (remitEl && preEl) {
    preEl.value = remitEl.value;
    updateForeignTaxUI();
  }
}

function updateForeignTaxUI() {
  const remitEl = document.getElementById('inpRemittanceAmount');
  const pre2024El = document.getElementById('inpPre2024Amount');
  const principalEl = document.getElementById('inpPrincipalAmount');
  const daysEl = document.getElementById('inpDaysInThailand');
  const foreignTaxEl = document.getElementById('inpForeignTaxPaid');
  const domesticNetEl = document.getElementById('inpOtherDomesticNet');

  if (!remitEl) return;

  const remittanceAmount = Math.max(0, parseFloat(remitEl.value) || 0);
  const pre2024Amount = Math.max(0, parseFloat(pre2024El ? pre2024El.value : 0) || 0);
  const principalAmount = Math.max(0, parseFloat(principalEl ? principalEl.value : 0) || 0);
  const daysInThailand = Math.max(0, parseInt(daysEl ? daysEl.value : 180, 10) || 0);
  const foreignTaxPaid = Math.max(0, parseFloat(foreignTaxEl ? foreignTaxEl.value : 0) || 0);
  const otherDomesticNetIncome = Math.max(0, parseFloat(domesticNetEl ? domesticNetEl.value : 0) || 0);

  foreignTaxState.remittanceAmount = remittanceAmount;
  foreignTaxState.pre2024Amount = pre2024Amount;
  foreignTaxState.principalAmount = principalAmount;
  foreignTaxState.daysInThailand = daysInThailand;
  foreignTaxState.foreignTaxPaid = foreignTaxPaid;
  foreignTaxState.otherDomesticNetIncome = otherDomesticNetIncome;
  saveForeignTaxState();

  const calc =
    typeof MoneyApp !== 'undefined' && MoneyApp.calculateForeignRepatriationTax
      ? MoneyApp.calculateForeignRepatriationTax({
          remittanceAmount,
          pre2024Amount,
          principalAmount,
          daysInThailand,
          foreignTaxPaid,
          otherDomesticNetIncome,
        })
      : {
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

  const currencyUnit = LANG === 'en' ? 'THB' : 'บาท';

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
    subExempt.textContent =
      LANG === 'en'
        ? `Total Exempt: ${formatMoney(totalExempt)} ${currencyUnit}`
        : `ได้รับยกเว้น: ${formatMoney(totalExempt)} ${currencyUnit}`;
  }

  if (valGross) valGross.textContent = `${formatMoney(calc.grossThaiTaxOnRemittance)} ${currencyUnit}`;
  if (subEff) {
    subEff.textContent =
      LANG === 'en' ? `Effective Rate: ${effRate.toFixed(1)}%` : `อัตราภาษีเฉลี่ย: ${effRate.toFixed(1)}%`;
  }

  const dtaCredit = calc.dtaForeignTaxCredit != null ? calc.dtaForeignTaxCredit : calc.allowableDtaCredit || 0;
  if (valDta) valDta.textContent = `${formatMoney(dtaCredit)} ${currencyUnit}`;
  if (subDta) {
    if (foreignTaxPaid > 0) {
      subDta.textContent = LANG === 'en' ? 'DTA relief applied' : 'หักลดหย่อนภาษีซ้ำซ้อนแล้ว';
    } else {
      subDta.textContent = LANG === 'en' ? 'No foreign tax claimed' : 'ไม่มีการขอเครดิตภาษีต่างประเทศ';
    }
  }

  if (valNet) {
    valNet.textContent = `${formatMoney(calc.netThaiTaxPayable)} ${currencyUnit}`;
    valNet.style.color = calc.netThaiTaxPayable > 0 ? 'var(--warn)' : 'var(--ok)';
  }
  if (subRetained) {
    const netRetained =
      calc.netRetainedInThailand != null ? calc.netRetainedInThailand : calc.totalNetCashRetained || 0;
    subRetained.textContent =
      LANG === 'en'
        ? `Net Retained: ${formatMoney(netRetained)} ${currencyUnit}`
        : `เงินเหลือเข้าไทยสุทธิ: ${formatMoney(netRetained)} ${currencyUnit}`;
  }

  if (boxAdvice) {
    let adviceHtml = '';
    const isResident = calc.isResident !== undefined ? calc.isResident : calc.isTaxResident;
    if (!isResident) {
      adviceHtml =
        LANG === 'en'
          ? `🟢 <strong>Non-Resident Exemption (Section 41 Paragraph 3):</strong> Since your stay in Thailand is under 180 days (${daysInThailand} days), you are a tax non-resident. Remittances of foreign capital or gains into Thailand are <strong>100% exempt from Thai Personal Income Tax</strong> regardless of when earned.`
          : `🟢 <strong>สิทธิประโยชน์ผู้ไม่อยู่ในไทยถึง 180 วัน (มาตรา 41 วรรคสาม):</strong> เนื่องจากคุณพำนักในไทยไม่ถึง 180 วันในปีภาษี (${daysInThailand} วัน) ถือเป็นผู้ไม่มีถิ่นที่อยู่ทางภาษีในไทย เงินได้หรือกำไรจากการลงทุนต่างประเทศที่นำเข้าไทย<strong>ได้รับการยกเว้นภาษีเงินได้ 100%</strong> โดยไม่ต้องคำนวณภาษี`;
    } else if (calc.taxableRemittance === 0) {
      adviceHtml =
        LANG === 'en'
          ? '🛡️ <strong>Fully Tax-Exempt Remittance:</strong> 100% of the remitted amount is shielded from Thai PIT via Pre-2024 grandfathering (Order P.162/2566) or original principal return. <em>Tip: Ensure you retain broker transfer slips and holding statements as statutory audit proof.</em>'
          : '🛡️ <strong>ได้รับการยกเว้นภาษีทั้งจำนวน:</strong> เงินที่นำเข้าไทยทั้ง 100% ได้รับยกเว้นภาษีเงินได้บุคคลธรรมดา จากสิทธิประโยชน์เงินได้ก่อนปี 2567 (คำสั่ง ป.162/2566) หรือการถอนเงินต้นลงทุนเดิม <em>คำแนะนำ: ควรเก็บหลักฐานใบโอนเงิน บัญชีโบรกเกอร์ต่างประเทศ และ Bank Statement ไว้เป็นหลักฐานตรวจสอบ</em>';
    } else {
      const topBracketRate = effRate > 20 ? '30-35%' : effRate > 10 ? '15-20%' : '5-10%';
      adviceHtml =
        LANG === 'en'
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

function initForeignTaxAdvisor() {
  loadForeignTaxState();
  const remitEl = document.getElementById('inpRemittanceAmount');
  const pre2024El = document.getElementById('inpPre2024Amount');
  const principalEl = document.getElementById('inpPrincipalAmount');
  const daysEl = document.getElementById('inpDaysInThailand');
  const foreignTaxEl = document.getElementById('inpForeignTaxPaid');
  const domesticNetEl = document.getElementById('inpOtherDomesticNet');
  const panel = document.getElementById('foreignTaxPanelBody');
  const arrow = document.getElementById('foreignTaxToggleArrow');
  const btn = document.getElementById('btnToggleForeignTax');

  if (remitEl && foreignTaxState.remittanceAmount != null) remitEl.value = foreignTaxState.remittanceAmount;
  if (pre2024El && foreignTaxState.pre2024Amount != null) pre2024El.value = foreignTaxState.pre2024Amount;
  if (principalEl && foreignTaxState.principalAmount != null) principalEl.value = foreignTaxState.principalAmount;
  if (daysEl && foreignTaxState.daysInThailand != null) daysEl.value = foreignTaxState.daysInThailand;
  if (foreignTaxEl && foreignTaxState.foreignTaxPaid != null) foreignTaxEl.value = foreignTaxState.foreignTaxPaid;
  if (domesticNetEl && foreignTaxState.otherDomesticNetIncome != null)
    domesticNetEl.value = foreignTaxState.otherDomesticNetIncome;

  updateForeignTaxUI();
}

// ==========================================
// Target Date Fund Glidepath Model (Roadmap Phase 64)
// ==========================================
const GLIDEPATH_STORAGE_KEY = 'money_superapp_glidepath_v1';
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
  } catch (_e) {
    // Graceful fallback to default state
  }
}

function saveGlidepathState() {
  try {
    localStorage.setItem(GLIDEPATH_STORAGE_KEY, JSON.stringify(glidepathState));
  } catch (_e) {
    // Storage quota or disabled fallback
  }
}

function toggleTargetDateGlidepath() {
  if (rebalanceLayoutManager) {
    rebalanceLayoutManager.toggleCard('panelTargetDateGlidepath');
  } else {
    const panel = document.getElementById('glidepathPanelBody');
    if (!panel) return;
    const isHidden = panel.classList.contains('card-collapsed-hidden');
    panel.classList.toggle('card-collapsed-hidden', !isHidden);
  }
  updateGlidepathUI();
}

function setGlidepathCohortPreset(year) {
  const ageEl = document.getElementById('inpGlideCurrentAge');
  const retireAgeEl = document.getElementById('inpGlideRetireAge');
  const curYear = new Date().getFullYear();
  const curAge = Math.max(18, parseInt(ageEl ? ageEl.value : 30, 10) || 30);
  const yearsToRetire = Math.max(0, year - curYear);
  const derivedRetireAge = curAge + yearsToRetire;

  if (retireAgeEl) {
    retireAgeEl.value = derivedRetireAge;
  }
  glidepathState.targetYear = year;
  updateGlidepathUI();
}

function calculateGlidepathData() {
  const ageEl = document.getElementById('inpGlideCurrentAge');
  const retireAgeEl = document.getElementById('inpGlideRetireAge');
  const riskEl = document.getElementById('selGlideRisk');

  const currentAge = Math.max(15, parseInt(ageEl ? ageEl.value : 30, 10) || 30);
  const targetRetirementAge = Math.max(30, parseInt(retireAgeEl ? retireAgeEl.value : 60, 10) || 60);
  const riskTolerance = riskEl ? riskEl.value : 'moderate';

  glidepathState.currentAge = currentAge;
  glidepathState.retireAge = targetRetirementAge;
  glidepathState.riskTolerance = riskTolerance;
  saveGlidepathState();

  if (typeof MoneyApp !== 'undefined' && MoneyApp.calculateTargetDateGlidepath) {
    return MoneyApp.calculateTargetDateGlidepath({
      currentAge,
      targetRetirementAge,
      riskTolerance,
    });
  }

  // Fallback
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

function updateGlidepathUI() {
  const calc = calculateGlidepathData();
  if (!calc || !calc.split) return;

  const barCore = document.getElementById('glideBarCore');
  const barBallast = document.getElementById('glideBarBallast');
  const barSat = document.getElementById('glideBarSat');

  if (barCore) barCore.style.width = `${calc.split.core}%`;
  if (barBallast) barBallast.style.width = `${calc.split.ballast}%`;
  if (barSat) barSat.style.width = `${calc.split.satellite}%`;

  const badgePhase = document.getElementById('badgeGlidePhase');
  if (badgePhase) {
    badgePhase.textContent = LANG === 'en' ? calc.phaseNameEn : calc.phaseNameTh;
  }

  const txtCore = document.getElementById('txtGlideCorePct');
  const txtBallast = document.getElementById('txtGlideBallastPct');
  const txtSat = document.getElementById('txtGlideSatPct');

  if (txtCore) {
    txtCore.textContent = LANG === 'en' ? `Core (Growth): ${calc.split.core}%` : `Core (หุ้นเติบโต): ${calc.split.core}%`;
  }
  if (txtBallast) {
    txtBallast.textContent =
      LANG === 'en' ? `Ballast (Bonds): ${calc.split.ballast}%` : `Ballast (ตราสารหนี้/กันชน): ${calc.split.ballast}%`;
  }
  if (txtSat) {
    txtSat.textContent =
      LANG === 'en'
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
    valHorizon.textContent = LANG === 'en' ? `${calc.yearsToRetire} Years` : `${calc.yearsToRetire} ปี`;
  }
  if (subTarget) {
    subTarget.textContent =
      LANG === 'en'
        ? `Retirement Year: ${calc.targetYear}`
        : `ปีเกษียณ ค.ศ. ${calc.targetYear} (พ.ศ. ${calc.targetYear + 543})`;
  }

  if (valCore) valCore.textContent = `${calc.split.core}%`;
  if (valBallast) valBallast.textContent = `${calc.split.ballast}%`;
  if (valSat) valSat.textContent = `${calc.split.satellite}%`;

  if (boxAdvice) {
    const adviceText = LANG === 'en' ? calc.adviceEn : calc.adviceTh;
    const coreDesc = LANG === 'en' ? calc.assetBreakdown.coreDescriptionEn : calc.assetBreakdown.coreDescriptionTh;
    const ballastDesc =
      LANG === 'en' ? calc.assetBreakdown.ballastDescriptionEn : calc.assetBreakdown.ballastDescriptionTh;
    const satDesc =
      LANG === 'en' ? calc.assetBreakdown.satelliteDescriptionEn : calc.assetBreakdown.satelliteDescriptionTh;

    boxAdvice.innerHTML = `
      💡 <strong>${LANG === 'en' ? 'Target Date Allocation Guidance:' : 'คำแนะนำกลยุทธ์การจัดพอร์ตตามเส้นทาง Glidepath:'}</strong> ${adviceText}<br>
      <div style="margin-top:6px; font-size:10px; color:var(--ink-dim); display:flex; flex-direction:column; gap:2px;">
        <span>• <strong>Core (${calc.split.core}%):</strong> ${coreDesc}</span>
        <span>• <strong>Ballast (${calc.split.ballast}%):</strong> ${ballastDesc}</span>
        <span>• <strong>Satellite (${calc.split.satellite}%):</strong> ${satDesc}</span>
      </div>
    `;
  }
}

function applyGlidepathSplitToPortfolio() {
  const calc = calculateGlidepathData();
  if (!calc || !calc.split) return;

  undoMgr.push(captureSnapshot());

  const coreBucket = state.buckets.find((b) => b.id === 'core');
  const ballastBucket = state.buckets.find((b) => b.id === 'ballast');
  const satBucket = state.buckets.find((b) => b.id === 'satellite');

  if (coreBucket) coreBucket.weight = calc.split.core;
  if (ballastBucket) ballastBucket.weight = calc.split.ballast;
  if (satBucket) satBucket.weight = calc.split.satellite;

  renderSplit();
  compute();
  saveState();
  updateUndoUI();

  const applyBtn = document.getElementById('lblApplyGlidepath');
  if (applyBtn) {
    const originalText = applyBtn.textContent;
    applyBtn.textContent = LANG === 'en' ? '✓ Applied to Portfolio!' : '✓ นำไปใช้กับพอร์ตแล้ว!';
    setTimeout(() => {
      applyBtn.textContent = originalText;
    }, 2000);
  }
}

function initTargetDateGlidepath() {
  loadGlidepathState();
  const ageEl = document.getElementById('inpGlideCurrentAge');
  const retireAgeEl = document.getElementById('inpGlideRetireAge');
  const riskEl = document.getElementById('selGlideRisk');
  if (ageEl && glidepathState.currentAge != null) ageEl.value = glidepathState.currentAge;
  if (retireAgeEl && glidepathState.retireAge != null) retireAgeEl.value = glidepathState.retireAge;
  if (riskEl && glidepathState.riskTolerance) riskEl.value = glidepathState.riskTolerance;

  updateGlidepathUI();
}

// Global window exposure for inline handlers
if (typeof window !== 'undefined') {
  window.toggleThaiGoldCalculator = toggleThaiGoldCalculator;
  window.setGoldWeightPreset = setGoldWeightPreset;
  window.updateGoldCalculator = updateGoldCalculator;
  window.syncGoldMarketPrice = syncGoldMarketPrice;
  window.addGoldLotToHistory = addGoldLotToHistory;
  window.removeGoldLot = removeGoldLot;
  window.clearGoldLots = clearGoldLots;
  window.exportGoldToPortfolio = exportGoldToPortfolio;
  window.toggleForeignTaxAdvisor = toggleForeignTaxAdvisor;
  window.setRemittancePreset = setRemittancePreset;
  window.setRemittancePre2024Full = setRemittancePre2024Full;
  window.updateForeignTaxUI = updateForeignTaxUI;
  window.toggleTargetDateGlidepath = toggleTargetDateGlidepath;
  window.setGlidepathCohortPreset = setGlidepathCohortPreset;
  window.updateGlidepathUI = updateGlidepathUI;
  window.applyGlidepathSplitToPortfolio = applyGlidepathSplitToPortfolio;
  window.resetRebalanceLayout = resetRebalanceLayout;
}

let rebalanceLayoutManager = null;

function resetRebalanceLayout() {
  if (rebalanceLayoutManager) {
    rebalanceLayoutManager.resetLayout();
  } else {
    try {
      localStorage.removeItem('moneySuperapp.layout.rebalance.v1');
    } catch (_e) {}
    window.location.reload();
  }
}

renderSplit();
renderBuckets();
checkPendingBudget();
compute();
updatePriceTimestampUI();
initAutoRefresh();
try {
  initGoldCalculator();
} catch (e) {
  console.warn('initGoldCalculator failed:', e);
}
try {
  initForeignTaxAdvisor();
} catch (e) {
  console.warn('initForeignTaxAdvisor failed:', e);
}
try {
  initTargetDateGlidepath();
} catch (e) {
  console.warn('initTargetDateGlidepath failed:', e);
}

if (typeof MoneyApp !== 'undefined' && MoneyApp.initCardLayoutManager) {
  rebalanceLayoutManager = MoneyApp.initCardLayoutManager({
    container: document.querySelector('.content') || document.body,
    cardSelector: '.reorder-card',
    storageKey: 'moneySuperapp.layout.rebalance.v1',
    defaultCollapsed: ['panelTargetDateGlidepath', 'panelThaiGold', 'panelForeignTaxAdvisor'],
    defaultOrder: [
      'panelBudget',
      'panelBuckets',
      'howto',
      'panelTargetDateGlidepath',
      'panelThaiGold',
      'panelForeignTaxAdvisor',
    ],
    onToggle: (id, isCollapsed) => {
      if (!isCollapsed) {
        if (id === 'panelThaiGold') updateGoldCalculator();
        else if (id === 'panelForeignTaxAdvisor') updateForeignTaxUI();
        else if (id === 'panelTargetDateGlidepath') updateGlidepathUI();
      }
    },
  });
}
