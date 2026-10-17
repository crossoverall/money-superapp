const translations = {
  th: {
    title: 'วางแผนปลดหนี้ (Debt Payoff)',
    subtitle: 'เปรียบเทียบวิธี Snowball (หนี้เล็กก่อน) และ Avalanche (ดอกสูงก่อน) เพื่อปลดหนี้เร็วที่สุด',
    importSavings: 'ดึงเงินออมจากหน้าคงเหลือ',
    copyPlan: '📋 คัดลอกแผน',
    copied: '✓ คัดลอกแล้ว!',
    printPlan: '🖨️ พิมพ์',
    kpiTotalDebt: 'ยอดหนี้รวมทั้งหมด',
    kpiDebtFreeDate: 'วันปลดหนี้สำเร็จ',
    kpiTotalInterest: 'ดอกเบี้ยรวมที่ต้องจ่าย',
    kpiInterestSaved: 'ประหยัดดอกเบี้ยได้',
    kpiTotalPaid: 'รวมจ่ายทั้งหมด',
    kpiMonthsSaved: 'เร็วขึ้น',
    kpiMonthsToFree: 'เดือน',
    strategyTitle: 'กลยุทธ์การปลดหนี้ (Strategy)',
    extraPay: 'เงินจ่ายเพิ่มรายเดือน (Extra Payment)',
    unitMonthly: 'บาท/เดือน',
    debtListTitle: 'รายการหนี้สิน (Debt Accounts)',
    btnAddDebt: '+ เพิ่มรายการหนี้',
    tdTotalLabel: 'รวมทุกรายการ',
    compareTitle: 'เปรียบเทียบผลลัพธ์ (Comparison)',
    cmpAvMonths: 'ระยะเวลา:',
    cmpAvInterest: 'ดอกเบี้ยรวม:',
    cmpAvSaved: 'ประหยัดดอกเบี้ย vs ขั้นต่ำ:',
    cmpSnMonths: 'ระยะเวลา:',
    cmpSnInterest: 'ดอกเบี้ยรวม:',
    cmpSnSaved: 'ประหยัดดอกเบี้ย vs ขั้นต่ำ:',
    scheduleTitle: '📅 ดูตารางกำหนดการปลดหนี้ (Timeline & Schedule)',
    thSchMonth: 'เดือนที่',
    thSchPayment: 'จ่ายรวม',
    thSchPrincipal: 'ตัดเงินต้น',
    thSchInterest: 'ดอกเบี้ย',
    thSchRemaining: 'คงเหลือ',
    btnResetDebts: 'รีเซ็ตค่าเริ่มต้น',
    avalancheExpl: '<strong>Avalanche Method:</strong> นำเงินส่วนเกินทั้งหมดไปโปะหนี้ที่มีอัตราดอกเบี้ยสูงสุด ช่วยประหยัดเงินได้มากที่สุด',
    snowballExpl: '<strong>Snowball Method:</strong> ชำระหนี้ที่ยอดน้อยที่สุดก่อน เพื่อสร้างกำลังใจและ momentum ในการปลดหนี้',
    stratAvSub: 'ดอกสูงสุดก่อน',
    stratSnSub: 'ยอดน้อยสุดก่อน',
    cmpAvSub: 'คุ้มค่าเงินที่สุด',
    cmpSnSub: 'สร้างกำลังใจ',
    avgRateLabel: 'ดอกเบี้ยเฉลี่ย',
    minPayLabel: 'ขั้นต่ำรวมต่อเดือน',
    colBalance: 'ยอดคงเหลือ',
    colRate: 'ดอกเบี้ย %',
    colMin: 'ขั้นต่ำ',
    rowItemsCount: 'รายการ',
    chartTitle: 'กราฟการลดลงของหนี้สิน (Payoff Trajectory)',
    legAvalanche: 'Avalanche (ดอกสูงสุดก่อน)',
    legSnowball: 'Snowball (ยอดน้อยสุดก่อน)',
    legMinOnly: 'จ่ายขั้นต่ำเท่านั้น (Minimum Only)',
    legMilestone: 'จุดปลดหนี้ (Milestone)',
    windfallTitle: '🎁 เงินก้อนโปะหนี้ครั้งเดียว (Lump-Sum / Bonus)',
    enableWindfall: 'เปิดใช้งาน',
    windfallAmt: 'จำนวนเงินก้อน (บาท)',
    windfallMonth: 'โปะในเดือนที่',
    legWindfall: 'โปะเงินก้อน (Windfall)',
    refinanceTitle: '🔄 จำลองรวมหนี้ & รีไฟแนนซ์ (Refinance Simulator)',
    enableRefinance: 'เปิดใช้งาน',
    currentRateRefinance: 'อัตราดอกเบี้ยเดิมเฉลี่ย:',
    refinanceRateLabel: 'ดอกเบี้ยใหม่ (% ต่อปี)',
    refinanceTermLabel: 'ระยะเวลาผ่อน (เดือน)',
    refinancePmtLabel: 'ค่างวดใหม่/เดือน',
    refinanceSavedLabel: 'ประหยัดดอกเบี้ย',
    refinanceReliefLabel: 'ภาระผ่อน/เดือน',
    milestoneRoadTitle: '🛣️ แผนที่สู่เสรีภาพทางการเงิน (Payoff Milestone Road)',
  },
  en: {
    title: 'Debt Payoff Calculator',
    subtitle: 'Compare Snowball and Avalanche to become debt-free fastest',
    importSavings: 'Import Savings',
    copyPlan: '📋 Copy Plan',
    copied: '✓ Copied!',
    printPlan: '🖨️ Print',
    kpiTotalDebt: 'Total Debt Balance',
    kpiDebtFreeDate: 'Debt-Free Date',
    kpiTotalInterest: 'Total Interest Payable',
    kpiInterestSaved: 'Interest Saved',
    kpiTotalPaid: 'Total Repayment',
    kpiMonthsSaved: 'Faster by',
    kpiMonthsToFree: 'months',
    strategyTitle: 'Payoff Strategy',
    extraPay: 'Extra Monthly Payment',
    unitMonthly: 'THB/month',
    debtListTitle: 'Your Debt Accounts',
    btnAddDebt: '+ Add Debt Account',
    tdTotalLabel: 'Total',
    compareTitle: 'Strategy Comparison',
    cmpAvMonths: 'Timeline:',
    cmpAvInterest: 'Total Interest:',
    cmpAvSaved: 'Saved vs Minimum:',
    cmpSnMonths: 'Timeline:',
    cmpSnInterest: 'Total Interest:',
    cmpSnSaved: 'Saved vs Minimum:',
    scheduleTitle: '📅 View Payoff Timeline & Schedule',
    thSchMonth: 'Month',
    thSchPayment: 'Total Paid',
    thSchPrincipal: 'Principal',
    thSchInterest: 'Interest',
    thSchRemaining: 'Remaining',
    btnResetDebts: 'Reset to Defaults',
    avalancheExpl:
      '<strong>Avalanche Method:</strong> Put all extra cash towards the debt with the highest interest rate. Mathematically saves the most money.',
    snowballExpl:
      '<strong>Snowball Method:</strong> Pay off the smallest balance first to build momentum and psychological wins.',
    stratAvSub: 'Highest Rate First',
    stratSnSub: 'Smallest Bal First',
    cmpAvSub: 'Mathematically Optimal',
    cmpSnSub: 'Psychological Wins',
    avgRateLabel: 'Avg Interest',
    minPayLabel: 'Total Min Payment',
    colBalance: 'Balance',
    colRate: 'Interest %',
    colMin: 'Min Pay',
    rowItemsCount: 'Accounts',
    chartTitle: 'Debt Payoff Trajectory',
    legAvalanche: 'Avalanche (Highest Rate First)',
    legSnowball: 'Snowball (Smallest Bal First)',
    legMinOnly: 'Minimum Payment Only',
    legMilestone: 'Debt-Free Milestone',
    windfallTitle: '🎁 One-Time Lump-Sum / Bonus Payoff',
    enableWindfall: 'Enable',
    windfallAmt: 'Lump-Sum Amount (THB)',
    windfallMonth: 'Inject in Month #',
    legWindfall: 'Lump-Sum (Windfall)',
    refinanceTitle: '🔄 Debt Consolidation & Refinance Simulator',
    enableRefinance: 'Enable',
    currentRateRefinance: 'Current Weighted APR:',
    refinanceRateLabel: 'New Interest APR (%)',
    refinanceTermLabel: 'Loan Term (Months)',
    refinancePmtLabel: 'New Payment / Mo',
    refinanceSavedLabel: 'Interest Saved',
    refinanceReliefLabel: 'Monthly Cash Flow',
    milestoneRoadTitle: '🛣️ Payoff Milestone Road & Financial Freedom',
  },
};

if (LANG === 'en') {
  const t = translations.en;
  document.title = 'Debt Payoff Calculator — Money Superapp';

  const map = {
    'txt-title': t.title,
    'lbl-subtitle': t.subtitle,
    'lbl-import-savings': t.importSavings,
    'lbl-copy-plan': t.copyPlan,
    'lbl-print-plan': t.printPlan,
    'lbl-kpi-total-debt': t.kpiTotalDebt,
    'lbl-kpi-debtfree-date': t.kpiDebtFreeDate,
    'lbl-kpi-total-interest': t.kpiTotalInterest,
    'lbl-kpi-interest-saved': t.kpiInterestSaved,
    'lbl-strategy-title': t.strategyTitle,
    'lbl-extra-pay': t.extraPay,
    'lbl-unit-monthly': t.unitMonthly,
    'lbl-windfall-title': t.windfallTitle,
    'lbl-enable-windfall': t.enableWindfall,
    'lbl-windfall-amt': t.windfallAmt,
    'lbl-windfall-month': t.windfallMonth,
    'lbl-debt-list-title': t.debtListTitle,
    'lbl-btn-add-debt': t.btnAddDebt,
    'td-total-label': t.tdTotalLabel,
    'lbl-compare-title': t.compareTitle,
    'lbl-cmp-av-months': t.cmpAvMonths,
    'lbl-cmp-av-interest': t.cmpAvInterest,
    'lbl-cmp-av-saved': t.cmpAvSaved,
    'lbl-cmp-sn-months': t.cmpSnMonths,
    'lbl-cmp-sn-interest': t.cmpSnInterest,
    'lbl-cmp-sn-saved': t.cmpSnSaved,
    'lbl-schedule-title': t.scheduleTitle,
    'th-sch-month': t.thSchMonth,
    'th-sch-payment': t.thSchPayment,
    'th-sch-principal': t.thSchPrincipal,
    'th-sch-interest': t.thSchInterest,
    'th-sch-remaining': t.thSchRemaining,
    'btn-reset-debts': t.btnResetDebts,
    'strat-av-sub': t.stratAvSub,
    'strat-sn-sub': t.stratSnSub,
    'cmp-av-sub': t.cmpAvSub,
    'cmp-sn-sub': t.cmpSnSub,
    'lbl-avg-rate': t.avgRateLabel,
    'lbl-min-pay': t.minPayLabel,
    'lbl-chart-title': t.chartTitle,
    'lbl-leg-avalanche': t.legAvalanche,
    'lbl-leg-snowball': t.legSnowball,
    'lbl-leg-min': t.legMinOnly,
    'lbl-leg-milestone': t.legMilestone,
    'lbl-leg-windfall': t.legWindfall,
    'lbl-refinance-title': t.refinanceTitle,
    'lbl-enable-refinance': t.enableRefinance,
    'lbl-current-rate-refinance': t.currentRateRefinance,
    'lbl-refinance-rate': t.refinanceRateLabel,
    'lbl-refinance-term': t.refinanceTermLabel,
    'lbl-refinance-pmt': t.refinancePmtLabel,
    'lbl-refinance-interest-saved': t.refinanceSavedLabel,
    'lbl-refinance-cashflow-relief': t.refinanceReliefLabel,
    'lbl-milestone-road-title': t.milestoneRoadTitle,
    'lbl-print-debt-doc-sub': 'Debt Payoff Strategy & Freedom Horizon Simulation',
    'btn-wf-preset-1': '20K (Mo 1)',
    'btn-wf-preset-2': '50K (Mo 3)',
    'btn-wf-preset-3': '100K (Mo 6)',
    'btn-wf-preset-4': '200K (Mo 12)',
    'btn-refi-12': '12 Mo (1 Yr)',
    'btn-refi-24': '24 Mo (2 Yrs)',
    'btn-refi-36': '36 Mo (3 Yrs)',
    'btn-refi-48': '48 Mo (4 Yrs)',
    'btn-refi-60': '60 Mo (5 Yrs)',
  };
  for (let id in map) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = map[id];
  }
}

const STORAGE_KEY = 'moneySuperapp.debtCalculator.state.v1';

const defaultState = {
  strategy: 'avalanche',
  extraPayment: 5000,
  windfallEnabled: false,
  windfallAmount: 50000,
  windfallMonth: 1,
  refinanceEnabled: false,
  refinanceRate: 9.9,
  refinanceTerm: 36,
  debts: [
    { id: 1, name: LANG === 'en' ? 'Credit Card A' : 'บัตรเครดิต KBank', balance: 45000, rate: 16, minPayment: 2500 },
    { id: 2, name: LANG === 'en' ? 'Personal Loan' : 'สินเชื่อส่วนบุคคล', balance: 120000, rate: 18, minPayment: 4200 },
    { id: 3, name: LANG === 'en' ? 'Auto Loan' : 'ผ่อนรถยนต์', balance: 280000, rate: 4.5, minPayment: 7800 },
  ],
};

let state = JSON.parse(JSON.stringify(defaultState));

function syncWindfallInputs() {
  const chk = document.getElementById('chkEnableWindfall');
  const amt = document.getElementById('txtWindfallAmount');
  const m = document.getElementById('txtWindfallMonth');
  const box = document.getElementById('windfallInputsContainer');
  if (chk) chk.checked = Boolean(state.windfallEnabled);
  if (amt) amt.value = state.windfallAmount ?? 50000;
  if (m) m.value = state.windfallMonth ?? 1;
  if (box) box.style.display = state.windfallEnabled ? 'block' : 'none';
}

function syncRefinanceInputs() {
  const chk = document.getElementById('chkEnableRefinance');
  const rate = document.getElementById('txtRefinanceRate');
  const term = document.getElementById('txtRefinanceTerm');
  const box = document.getElementById('refinanceInputsContainer');
  if (chk) chk.checked = Boolean(state.refinanceEnabled);
  if (rate) rate.value = state.refinanceRate ?? 9.9;
  if (term) term.value = state.refinanceTerm ?? 36;
  if (box) box.style.display = state.refinanceEnabled ? 'block' : 'none';
}

const undoMgr = MoneyApp.createUndoManager({
  maxDepth: 15,
  enableShortcuts: true,
  onUndo: (previousState) => {
    state = JSON.parse(JSON.stringify(previousState));
    document.getElementById('txtExtraPayment').value = state.extraPayment;
    syncWindfallInputs();
    syncRefinanceInputs();
    renderTable();
    setStrategy(state.strategy);
    saveState();
    updateUndoUI();
  },
});

function updateUndoUI() {
  const btnUndo = document.getElementById('btn-undo-debt');
  if (btnUndo) {
    btnUndo.style.display = undoMgr.canUndo() ? 'inline-flex' : 'none';
  }
}

function undoDebtChange() {
  undoMgr.undo();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

function loadState() {
  const parsed = MoneyApp.safeJsonParse(STORAGE_KEY, null);
  if (parsed && Array.isArray(parsed.debts)) {
    state = Object.assign({}, defaultState, parsed);
  }
}

function onToggleWindfall(checked) {
  state.windfallEnabled = checked;
  syncWindfallInputs();
  saveState();
  computePayoff();
}

function onWindfallChange() {
  const amt = Math.max(0, parseNum(document.getElementById('txtWindfallAmount').value));
  const m = Math.max(1, parseNum(document.getElementById('txtWindfallMonth').value));
  state.windfallAmount = amt;
  state.windfallMonth = m;
  saveState();
  computePayoff();
}

function onToggleRefinance(checked) {
  undoMgr.push(state);
  state.refinanceEnabled = checked;
  syncRefinanceInputs();
  saveState();
  computePayoff();
  updateUndoUI();
}

function onRefinanceChange() {
  const rate = Math.max(0, Math.min(36, parseNum(document.getElementById('txtRefinanceRate').value)));
  const term = Math.max(1, Math.min(120, parseNum(document.getElementById('txtRefinanceTerm').value)));
  state.refinanceRate = rate;
  state.refinanceTerm = term;
  saveState();
  computePayoff();
}

function setRefinanceTerm(term) {
  undoMgr.push(state);
  state.refinanceTerm = term;
  const input = document.getElementById('txtRefinanceTerm');
  if (input) input.value = term;
  saveState();
  computePayoff();
  updateUndoUI();
}

function setWindfallPreset(amount, month) {
  state.windfallAmount = amount;
  state.windfallMonth = month;
  syncWindfallInputs();
  saveState();
  computePayoff();
}

function setStrategy(strat) {
  state.strategy = strat;
  const btnAv = document.getElementById('btn-strat-avalanche');
  const btnSn = document.getElementById('btn-strat-snowball');
  if (btnAv) {
    btnAv.classList.toggle('active', strat === 'avalanche');
    btnAv.setAttribute('aria-selected', strat === 'avalanche' ? 'true' : 'false');
  }
  if (btnSn) {
    btnSn.classList.toggle('active', strat === 'snowball');
    btnSn.setAttribute('aria-selected', strat === 'snowball' ? 'true' : 'false');
  }
  const explEl = document.getElementById('strategy-explanation');
  const t = translations[LANG] || translations.th;
  explEl.innerHTML = strat === 'avalanche' ? t.avalancheExpl : t.snowballExpl;
  computePayoff();
  saveState();
}

function onExtraPaymentChange(val) {
  state.extraPayment = Math.max(0, parseNum(val));
  computePayoff();
  saveState();
}

function addDebtRow() {
  undoMgr.push(state);
  const newId = Date.now();
  state.debts.push({
    id: newId,
    name: (LANG === 'en' ? 'Debt Account ' : 'หนี้สิน ') + (state.debts.length + 1),
    balance: 30000,
    rate: 15,
    minPayment: 1500,
  });
  renderTable();
  computePayoff();
  saveState();
  updateUndoUI();
  const row = document.getElementById(`debt-row-${newId}`);
  if (row) {
    const nameInput = row.querySelector('.name-input');
    if (nameInput) {
      nameInput.focus();
      nameInput.select();
    }
  }
}

function removeDebtRow(id) {
  undoMgr.push(state);
  state.debts = state.debts.filter((d) => d.id !== id);
  renderTable();
  computePayoff();
  saveState();
  updateUndoUI();
}

function onDebtChange(id, field, value) {
  const debt = state.debts.find((d) => d.id === id);
  if (!debt) return;
  if (field === 'name') {
    debt.name = value;
  } else {
    debt[field] = parseNum(value);
  }
  computePayoff();
  saveState();
}

function renderTable() {
  const tbody = document.getElementById('debtTableBody');
  tbody.innerHTML = '';

  const t = translations[LANG] || translations.th;

  // Order calculation based on strategy
  const sorted = [...state.debts].sort((a, b) => {
    if (state.strategy === 'snowball') return a.balance - b.balance;
    return b.rate - a.rate;
  });

  state.debts.forEach((debt) => {
    const orderIndex = sorted.findIndex((s) => s.id === debt.id) + 1;

    const tr = document.createElement('div');
    tr.className = 'entry-row';
    tr.id = `debt-row-${debt.id}`;
    tr.innerHTML = `
                <div style="display:flex; width:100%; align-items:center; gap:8px;">
                    <span id="debt-badge-${debt.id}" style="font-size:10px; font-weight:700; color:#fff; padding:2px 6px; border-radius:10px; ${orderIndex === 1 ? 'background:var(--ok);' : 'background:var(--ink-faint);'}">#${orderIndex}</span>
                    <input type="text" value="${escapeHtml(debt.name)}" oninput="onDebtChange(${debt.id}, 'name', this.value)" class="name-input">
                    <button onclick="removeDebtRow(${debt.id})" class="remove-btn" title="${LANG === 'en' ? 'Delete' : 'ลบ'}">&times;</button>
                </div>
                <div class="val-group" style="flex-basis:100%;">
                    <label>${t.colBalance}</label>
                    <input type="number" value="${debt.balance}" step="1000" min="0" inputmode="decimal" oninput="onDebtChange(${debt.id}, 'balance', this.value)" class="value-input">
                </div>
                <div class="val-group">
                    <label>${t.colRate}</label>
                    <input type="number" value="${debt.rate}" step="0.1" min="0" inputmode="decimal" oninput="onDebtChange(${debt.id}, 'rate', this.value)" class="value-input" style="color:var(--warn);">
                </div>
                <div class="val-group">
                    <label>${t.colMin}</label>
                    <input type="number" value="${debt.minPayment}" step="100" min="0" inputmode="decimal" oninput="onDebtChange(${debt.id}, 'minPayment', this.value)" class="value-input" style="color:var(--blue);">
                </div>
            `;
    tbody.appendChild(tr);
  });
}

function updateOrderBadges() {
  const sorted = [...state.debts].sort((a, b) => {
    if (state.strategy === 'snowball') return a.balance - b.balance;
    return b.rate - a.rate;
  });

  state.debts.forEach((debt) => {
    const orderIndex = sorted.findIndex((s) => s.id === debt.id) + 1;
    const badge = document.getElementById(`debt-badge-${debt.id}`);
    if (badge) {
      badge.textContent = `#${orderIndex}`;
      badge.style.background = orderIndex === 1 ? 'var(--ok)' : 'var(--ink-faint)';
    }
  });
}

/**
 * Run simulation for a given debt list, extra monthly payment, and strategy
 */
function simulate(debtsList, extra, strategy, windfall = null) {
  let debts = debtsList
    .map((d) => ({
      id: d.id,
      name: d.name,
      balance: parseNum(d.balance),
      rate: parseNum(d.rate),
      minPayment: parseNum(d.minPayment),
      initialBalance: parseNum(d.balance),
      paidOffMonth: null,
    }))
    .filter((d) => d.balance > 0);

  if (debts.length === 0) {
    return { months: 0, totalInterest: 0, totalPaid: 0, schedule: [], payoffOrder: [], trajectory: [] };
  }

  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;
  const schedule = [];
  const payoffOrder = [];
  const initialTotal = debts.reduce((sum, d) => sum + d.initialBalance, 0);
  const trajectory = [{ month: 0, balance: initialTotal }];

  const wfAmount = windfall && typeof windfall.amount === 'number' && windfall.amount > 0 ? windfall.amount : 0;
  const wfMonth =
    windfall && typeof windfall.month === 'number' && windfall.month >= 1 ? Math.floor(windfall.month) : 1;

  const MAX_MONTHS = 360; // 30 years safety limit

  while (debts.some((d) => d.balance > 0.01) && months < MAX_MONTHS) {
    months++;
    let monthInterest = 0;
    let monthPayment = 0;
    let monthPrincipal = 0;

    // 1. Accrue interest
    debts.forEach((d) => {
      if (d.balance > 0) {
        const interest = d.balance * (d.rate / 100 / 12);
        d.balance += interest;
        monthInterest += interest;
        totalInterest += interest;
      }
    });

    // 2. Pay minimums
    let totalAvailableBudget = extra;
    if (wfAmount > 0 && months === wfMonth) {
      totalAvailableBudget += wfAmount;
    }

    debts.forEach((d) => {
      if (d.balance > 0) {
        const pay = Math.min(d.balance, d.minPayment);
        d.balance -= pay;
        monthPayment += pay;
        monthPrincipal += pay - (d.balance === 0 ? 0 : 0);
      } else {
        // Rollover minimum payment from already paid-off debt!
        totalAvailableBudget += d.minPayment;
      }
    });

    // 3. Allocate extra budget according to strategy
    let activeDebts = debts.filter((d) => d.balance > 0.01);
    activeDebts.sort((a, b) => {
      if (strategy === 'snowball') return a.balance - b.balance;
      return b.rate - a.rate;
    });

    for (let target of activeDebts) {
      if (totalAvailableBudget <= 0.01) break;
      const extraPay = Math.min(target.balance, totalAvailableBudget);
      target.balance -= extraPay;
      monthPayment += extraPay;
      totalAvailableBudget -= extraPay;

      if (target.balance <= 0.01 && target.paidOffMonth === null) {
        target.paidOffMonth = months;
        payoffOrder.push({ name: target.name, month: months });
      }
    }

    // Check if remaining active debts got paid off in step 2
    debts.forEach((d) => {
      if (d.balance <= 0.01 && d.paidOffMonth === null) {
        d.paidOffMonth = months;
        payoffOrder.push({ name: d.name, month: months });
      }
    });

    const remainingBalance = debts.reduce((sum, d) => sum + Math.max(0, d.balance), 0);
    totalPaid += monthPayment;
    trajectory.push({ month: months, balance: Math.max(0, remainingBalance) });

    if (months <= 60 || remainingBalance <= 0 || months % 6 === 0) {
      schedule.push({
        month: months,
        payment: monthPayment,
        interest: monthInterest,
        principal: monthPayment - monthInterest,
        remaining: remainingBalance,
      });
    }
  }

  return { months, totalInterest, totalPaid, schedule, payoffOrder, trajectory };
}

function computePayoff() {
  const debts = state.debts;
  const totalDebt = debts.reduce((sum, d) => sum + parseNum(d.balance), 0);
  const totalMin = debts.reduce((sum, d) => sum + parseNum(d.minPayment), 0);
  const avgRate =
    totalDebt > 0 ? debts.reduce((sum, d) => sum + parseNum(d.balance) * parseNum(d.rate), 0) / totalDebt : 0;

  if (document.getElementById('footTotalBalance'))
    document.getElementById('footTotalBalance').textContent = formatMoney(totalDebt) + ' ' + unit;
  if (document.getElementById('footTotalMin'))
    document.getElementById('footTotalMin').textContent = formatMoney(totalMin) + ' ' + unit;
  if (document.getElementById('footAvgRate'))
    document.getElementById('footAvgRate').textContent = avgRate > 0 ? avgRate.toFixed(1) + '%' : '-';

  if (document.getElementById('kpi-total-debt'))
    document.getElementById('kpi-total-debt').textContent = formatMoney(totalDebt) + ' ' + unit;
  if (document.getElementById('kpi-debt-count'))
    document.getElementById('kpi-debt-count').textContent = debts.length + (LANG === 'en' ? ' accounts' : ' รายการ');

  const windfall =
    state.windfallEnabled && state.windfallAmount > 0
      ? { amount: state.windfallAmount, month: Math.max(1, state.windfallMonth) }
      : null;

  // Simulations
  const simCurrent = simulate(debts, state.extraPayment, state.strategy, windfall);
  const simBaseline = simulate(debts, state.extraPayment, state.strategy, null);
  const simAvalanche = simulate(debts, state.extraPayment, 'avalanche', windfall);
  const simSnowball = simulate(debts, state.extraPayment, 'snowball', windfall);
  const simMinOnly = simulate(debts, 0, 'avalanche', null);

  // Windfall Impact badge
  const wfImpact = document.getElementById('windfallImpactBadge');
  if (wfImpact) {
    if (windfall) {
      const monthsSavedWf = Math.max(0, simBaseline.months - simCurrent.months);
      const interestSavedWf = Math.max(0, simBaseline.totalInterest - simCurrent.totalInterest);
      wfImpact.innerHTML =
        LANG === 'en'
          ? `✨ <strong>Windfall Impact:</strong> Injecting <strong>${formatMoney(windfall.amount)} ${unit}</strong> in Month ${windfall.month} frees you <strong>${monthsSavedWf} months sooner</strong> and saves <strong>${formatMoney(interestSavedWf)} ${unit}</strong> in interest!`
          : `✨ <strong>ผลลัพธ์เงินก้อน:</strong> โปะ <strong>${formatMoney(windfall.amount)} ${unit}</strong> ในเดือนที่ ${windfall.month} ช่วยปลดหนี้เร็วขึ้น <strong>${monthsSavedWf} เดือน</strong> และประหยัดดอกเบี้ยได้ <strong>${formatMoney(interestSavedWf)} ${unit}</strong>!`;
      wfImpact.style.display = 'block';
    } else {
      wfImpact.style.display = 'none';
    }
  }

  // Current strategy outputs
  const now = new Date();
  const freeDate = new Date(now.getFullYear(), now.getMonth() + simCurrent.months, 1);
  const monthNamesTh = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateStr =
    totalDebt <= 0
      ? LANG === 'en'
        ? 'Zero Debt!'
        : 'ไม่มีหนี้สิน!'
      : LANG === 'en'
        ? `${monthNamesEn[freeDate.getMonth()]} ${freeDate.getFullYear()}`
        : `${monthNamesTh[freeDate.getMonth()]} ${freeDate.getFullYear() + 543}`;

  if (document.getElementById('kpi-debtfree-date')) document.getElementById('kpi-debtfree-date').textContent = dateStr;
  if (document.getElementById('kpi-months-to-free'))
    document.getElementById('kpi-months-to-free').textContent =
      totalDebt <= 0 ? '0' : `${simCurrent.months} ${LANG === 'en' ? 'months' : 'เดือน'}`;

  if (document.getElementById('kpi-total-interest'))
    document.getElementById('kpi-total-interest').textContent = formatMoney(simCurrent.totalInterest) + ' ' + unit;
  if (document.getElementById('kpi-total-paid'))
    document.getElementById('kpi-total-paid').textContent =
      (LANG === 'en' ? 'Total paid: ' : 'รวมจ่ายทั้งหมด ') + formatMoney(simCurrent.totalPaid) + ' ' + unit;

  const interestSaved = Math.max(0, simMinOnly.totalInterest - simCurrent.totalInterest);
  const monthsSaved = Math.max(0, simMinOnly.months - simCurrent.months);

  if (document.getElementById('kpi-interest-saved'))
    document.getElementById('kpi-interest-saved').textContent = formatMoney(interestSaved) + ' ' + unit;
  if (document.getElementById('kpi-months-saved'))
    document.getElementById('kpi-months-saved').textContent =
      (LANG === 'en' ? 'Faster by ' : 'เร็วขึ้น ') + monthsSaved + (LANG === 'en' ? ' mos' : ' เดือน');

  // Comparison cards
  if (document.getElementById('cmp-av-months'))
    document.getElementById('cmp-av-months').textContent =
      `${simAvalanche.months} ${LANG === 'en' ? 'months' : 'เดือน'}`;
  if (document.getElementById('cmp-av-interest'))
    document.getElementById('cmp-av-interest').textContent = `${formatMoney(simAvalanche.totalInterest)} ${unit}`;
  if (document.getElementById('cmp-av-saved'))
    document.getElementById('cmp-av-saved').textContent =
      `+${formatMoney(Math.max(0, simMinOnly.totalInterest - simAvalanche.totalInterest))} ${unit}`;

  if (document.getElementById('cmp-sn-months'))
    document.getElementById('cmp-sn-months').textContent = `${simSnowball.months} ${LANG === 'en' ? 'months' : 'เดือน'}`;
  if (document.getElementById('cmp-sn-interest'))
    document.getElementById('cmp-sn-interest').textContent = `${formatMoney(simSnowball.totalInterest)} ${unit}`;
  if (document.getElementById('cmp-sn-saved'))
    document.getElementById('cmp-sn-saved').textContent =
      `+${formatMoney(Math.max(0, simMinOnly.totalInterest - simSnowball.totalInterest))} ${unit}`;

  // Milestones
  const milestonesEl = document.getElementById('payoffMilestones');
  if (simCurrent.payoffOrder.length > 0) {
    milestonesEl.innerHTML = simCurrent.payoffOrder
      .map((m) => {
        const pDate = new Date(now.getFullYear(), now.getMonth() + m.month, 1);
        const pDateStr =
          LANG === 'en'
            ? `${monthNamesEn[pDate.getMonth()]} ${pDate.getFullYear()}`
            : `${monthNamesTh[pDate.getMonth()]} ${pDate.getFullYear() + 543}`;
        return `<div class="p-2 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 flex justify-between items-center">
                    <span>🎉 <strong>${m.name}</strong> ${LANG === 'en' ? 'paid off in month ' : 'ปลดหนี้สำเร็จในเดือนที่ '} <strong>${m.month}</strong></span>
                    <span class="font-bold text-emerald-700">${pDateStr}</span>
                </div>`;
      })
      .join('');
  } else {
    milestonesEl.innerHTML = '';
  }

  // Schedule table
  const schedBody = document.getElementById('scheduleTableBody');

  schedBody.innerHTML = simCurrent.schedule
    .map(
      (s) => `
            <tr>
                <td>${s.month}</td>
                <td>${formatMoney(s.payment)}</td>
                <td style="color:var(--ok);">${formatMoney(s.principal)}</td>
                <td style="color:var(--warn);">${formatMoney(s.interest)}</td>
                <td style="font-weight:600;">${formatMoney(s.remaining)}</td>
            </tr>
        `,
    )
    .join('');

  updateOrderBadges();
  renderPayoffChart(simCurrent, simMinOnly, totalDebt, simAvalanche, simSnowball, windfall, simBaseline);
  updateRefinanceVisual(totalDebt, totalMin, avgRate, simCurrent);
  renderDebtMilestoneRoad(simCurrent, simMinOnly, totalDebt, now);
}

function renderDebtMilestoneRoad(simCurrent, simMinOnly, totalDebt, now) {
  const container = document.getElementById('debtMilestoneRoadPanel');
  const checkList = document.getElementById('milestoneRoadCheckpoints');
  const velocityBox = document.getElementById('interestVelocityBox');
  const badgeDrop = document.getElementById('badge-velocity-drop');
  if (!container || !checkList) return;

  if (!simCurrent || !simCurrent.payoffOrder || simCurrent.payoffOrder.length === 0 || totalDebt <= 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = 'block';

  const isEn = LANG === 'en';
  const unit = isEn ? 'THB' : 'บาท';
  const initialMonthlyInterest =
    simCurrent.schedule && simCurrent.schedule.length > 0 ? simCurrent.schedule[0].interest : 0;
  let cumCleared = 0;

  let html = '';
  simCurrent.payoffOrder.forEach((m, idx) => {
    cumCleared += m.balance || 0;
    const clearedPct = totalDebt > 0 ? Math.min(100, Math.round((cumCleared / totalDebt) * 100 * 10) / 10) : 100;
    const pDate = new Date(now.getFullYear(), now.getMonth() + m.month, 1);
    const pDateStr = isEn
      ? `${monthNamesEn[pDate.getMonth()]} ${pDate.getFullYear()}`
      : `${monthNamesTh[pDate.getMonth()]} ${pDate.getFullYear() + 543}`;

    const schedItem = (simCurrent.schedule || []).find((s) => s.month === m.month) || { interest: 0 };
    const curInterest = schedItem.interest || 0;
    const dropPct =
      initialMonthlyInterest > 0
        ? Math.min(100, Math.round(((initialMonthlyInterest - curInterest) / initialMonthlyInterest) * 100))
        : 100;

    const isFinal = idx === simCurrent.payoffOrder.length - 1;
    const icon = isFinal ? '🏆' : idx === 0 ? '🚀' : '🎉';
    const borderColor = isFinal ? 'var(--ok, #10b981)' : 'var(--line)';
    const bg = isFinal ? 'rgba(16,185,129,0.08)' : 'var(--panel-2)';

    html += `
                <div style="background:${bg}; border:1px solid ${borderColor}; border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:16px;">${icon}</span>
                        <div>
                            <div style="font-weight:700; color:var(--ink); font-size:12px;">
                                ${m.name} ${isFinal ? (isEn ? '— 100% Debt Free!' : '— ปลดหนี้หมดสิ้น 100%!') : ''}
                            </div>
                            <div style="font-size:10px; color:var(--ink-dim); margin-top:2px;">
                                ${isEn ? 'Cleared:' : 'ปลดได้แล้ว:'} <strong>${clearedPct}%</strong> (${formatMoney(cumCleared)} ${unit}) • ${isEn ? 'Month' : 'เดือนที่'} ${m.month}
                            </div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:700; color:${isFinal ? '#059669' : 'var(--ink)'}; font-size:12px;">${pDateStr}</div>
                        <div style="font-size:10px; color:#059669; font-weight:600; margin-top:2px;">
                            🔻 ${isEn ? 'Interest drop' : 'ดอกเบี้ยลดลง'} -${dropPct}%
                        </div>
                    </div>
                </div>
            `;
  });
  checkList.innerHTML = html;

  if (velocityBox) {
    const totalMonthsSaved = Math.max(0, (simMinOnly ? simMinOnly.months : 0) - simCurrent.months);
    const interestSaved = Math.max(0, (simMinOnly ? simMinOnly.totalInterest : 0) - simCurrent.totalInterest);

    if (badgeDrop) {
      badgeDrop.textContent = isEn ? `⚡ ${totalMonthsSaved} Months Faster` : `⚡ ปลดหนี้เร็วขึ้น ${totalMonthsSaved} เดือน`;
    }

    velocityBox.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <span style="font-weight:700; color:var(--ink);">📉 ${isEn ? 'Monthly Interest Velocity:' : 'อัตราการเผาผลาญดอกเบี้ยรายเดือน:'}</span>
                    <span style="color:#059669; font-weight:700;">${isEn ? 'Total Saved:' : 'ประหยัดดอกเบี้ยสะสม:'} ${formatMoney(interestSaved)} ${unit}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; font-size:10.5px; color:var(--ink-dim);">
                    <span>${isEn ? 'Start:' : 'เดือนแรก:'} <b style="color:var(--danger);">${formatMoney(initialMonthlyInterest)} ${unit}${isEn ? '/mo' : '/ด.'}</b></span>
                    <span>→</span>
                    <span>${isEn ? 'Final Month:' : 'เดือนสุดท้าย:'} <b style="color:var(--ok);">0 ${unit} ${isEn ? '(Freedom 🎉)' : '(เสรีภาพ 🎉)'}</b></span>
                </div>
            `;
  }
}

/**
 * Debt Consolidation & Refinancing Calculation Engine
 */
function calculateDebtConsolidation({
  debts = [],
  currentTotalInterest = 0,
  currentTotalMinPayment = 0,
  refinanceRate = 9.9,
  refinanceTermMonths = 36,
} = {}) {
  const validDebts = (debts || [])
    .map((d) => ({
      balance: Math.max(0, parseNum(d.balance)),
      rate: Math.max(0, parseNum(d.rate)),
      minPayment: Math.max(0, parseNum(d.minPayment)),
    }))
    .filter((d) => d.balance > 0);

  const totalBalance = validDebts.reduce((sum, d) => sum + d.balance, 0);
  const totalMin =
    currentTotalMinPayment > 0 ? currentTotalMinPayment : validDebts.reduce((sum, d) => sum + d.minPayment, 0);

  if (totalBalance <= 0) {
    return {
      totalBalance: 0,
      weightedRate: 0,
      refinanceRate: Math.max(0, Number(refinanceRate) || 0),
      refinanceTermMonths: Math.max(1, Math.floor(Number(refinanceTermMonths) || 36)),
      newMonthlyPayment: 0,
      totalRefinanceInterest: 0,
      totalRefinancePaid: 0,
      interestSaved: 0,
      monthlyPaymentDiff: 0,
      verdict: 'no_debt',
    };
  }

  const weightedRate = validDebts.reduce((sum, d) => sum + d.balance * d.rate, 0) / totalBalance;
  const n = Math.max(1, Math.floor(Number(refinanceTermMonths) || 36));
  const annualR = Math.max(0, Number(refinanceRate) || 0);
  const monthlyR = annualR / 100 / 12;

  let pmt = 0;
  if (monthlyR > 0) {
    pmt = (totalBalance * monthlyR) / (1 - Math.pow(1 + monthlyR, -n));
  } else {
    pmt = totalBalance / n;
  }

  const totalRefinancePaid = pmt * n;
  const totalRefinanceInterest = Math.max(0, totalRefinancePaid - totalBalance);
  const interestSaved = Math.round(currentTotalInterest - totalRefinanceInterest);
  const monthlyPaymentDiff = Math.round(totalMin - pmt);

  let verdict = 'optimal';
  if (interestSaved <= 0) {
    verdict = 'higher_interest';
  } else if (monthlyPaymentDiff < 0) {
    verdict = 'faster_payoff';
  }

  return {
    totalBalance: Math.round(totalBalance),
    weightedRate: parseFloat(weightedRate.toFixed(2)),
    refinanceRate: annualR,
    refinanceTermMonths: n,
    newMonthlyPayment: Math.round(pmt),
    totalRefinanceInterest: Math.round(totalRefinanceInterest),
    totalRefinancePaid: Math.round(totalRefinancePaid),
    interestSaved,
    monthlyPaymentDiff,
    verdict,
  };
}

function updateRefinanceVisual(totalDebt, totalMin, avgRate, simCurrent) {
  if (!state.refinanceEnabled) return;
  const debts = state.debts;
  const curInterest = simCurrent ? simCurrent.totalInterest : 0;
  const rRate = state.refinanceRate ?? 9.9;
  const rTerm = state.refinanceTerm ?? 36;

  const res = calculateDebtConsolidation({
    debts,
    currentTotalInterest: curInterest,
    currentTotalMinPayment: totalMin,
    refinanceRate: rRate,
    refinanceTermMonths: rTerm,
  });

  const elW = document.getElementById('valCurrentWeightedRate');
  if (elW) elW.textContent = (avgRate || res.weightedRate || 0).toFixed(1) + '%';

  const elPmt = document.getElementById('valRefinancePmt');
  if (elPmt) elPmt.textContent = formatMoney(res.newMonthlyPayment) + ' ' + unit;

  const elSaved = document.getElementById('valRefinanceInterestSaved');
  if (elSaved) {
    if (res.interestSaved >= 0) {
      elSaved.textContent = '+' + formatMoney(res.interestSaved) + ' ' + unit;
      elSaved.style.color = 'var(--ok)';
    } else {
      elSaved.textContent = '-' + formatMoney(Math.abs(res.interestSaved)) + ' ' + unit;
      elSaved.style.color = 'var(--warn)';
    }
  }

  const elRelief = document.getElementById('valRefinanceCashflowRelief');
  if (elRelief) {
    if (res.monthlyPaymentDiff > 0) {
      elRelief.textContent = '-' + formatMoney(res.monthlyPaymentDiff) + (LANG === 'en' ? ' /mo' : ' /ด.');
      elRelief.style.color = 'var(--ok)';
      elRelief.title = LANG === 'en' ? 'Monthly payment decreases' : 'ผ่อนลดลงต่อเดือน';
    } else if (res.monthlyPaymentDiff < 0) {
      elRelief.textContent = '+' + formatMoney(Math.abs(res.monthlyPaymentDiff)) + (LANG === 'en' ? ' /mo' : ' /ด.');
      elRelief.style.color = 'var(--ink)';
      elRelief.title = LANG === 'en' ? 'Monthly payment increases for faster payoff' : 'ต้องผ่อนเพิ่มต่อเดือนเพื่อให้หมดไว';
    } else {
      elRelief.textContent = '0 ' + unit;
      elRelief.style.color = 'var(--ink)';
    }
  }

  const elBadge = document.getElementById('refinanceVerdictBadge');
  if (elBadge) {
    if (res.verdict === 'no_debt') {
      elBadge.style.display = 'none';
    } else if (res.verdict === 'optimal') {
      elBadge.style.display = 'block';
      elBadge.style.background = 'var(--ok-dim)';
      elBadge.style.border = '1px solid var(--ok)';
      elBadge.style.color = 'var(--ok)';
      elBadge.innerHTML =
        LANG === 'en'
          ? `🎉 <strong>High Value:</strong> Consolidating saves <strong>${formatMoney(res.interestSaved)} ${unit}</strong> in interest and lowers payments by <strong>${formatMoney(res.monthlyPaymentDiff)} ${unit}/mo</strong>!`
          : `🎉 <strong>คุ้มค่ามาก:</strong> รวมหนี้รีไฟแนนซ์ช่วยประหยัดดอกเบี้ย <strong>${formatMoney(res.interestSaved)} ${unit}</strong> และลดภาระผ่อนลง <strong>${formatMoney(res.monthlyPaymentDiff)} ${unit}/เดือน</strong>!`;
    } else if (res.verdict === 'faster_payoff') {
      elBadge.style.display = 'block';
      elBadge.style.background = 'rgba(59, 130, 246, 0.1)';
      elBadge.style.border = '1px solid rgba(59, 130, 246, 0.4)';
      elBadge.style.color = '#2563eb';
      elBadge.innerHTML =
        LANG === 'en'
          ? `⚡ <strong>Fast Debt Elimination:</strong> Saves <strong>${formatMoney(res.interestSaved)} ${unit}</strong> interest, requiring <strong>+${formatMoney(Math.abs(res.monthlyPaymentDiff))} ${unit}/mo</strong> higher payment.`
          : `⚡ <strong>ปลดหนี้ไว:</strong> ประหยัดดอกเบี้ย <strong>${formatMoney(res.interestSaved)} ${unit}</strong> แลกกับการผ่อนเพิ่ม <strong>+${formatMoney(Math.abs(res.monthlyPaymentDiff))} ${unit}/เดือน</strong> เพื่อให้จบใน ${res.refinanceTermMonths} เดือน`;
    } else {
      elBadge.style.display = 'block';
      elBadge.style.background = 'rgba(239, 68, 68, 0.1)';
      elBadge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
      elBadge.style.color = '#dc2626';
      elBadge.innerHTML =
        LANG === 'en'
          ? `⚠️ <strong>Caution:</strong> Stretching the term to ${res.refinanceTermMonths} months costs <strong>${formatMoney(Math.abs(res.interestSaved))} ${unit} more</strong> in total interest despite a lower rate.`
          : `⚠️ <strong>ควรระวัง:</strong> การยืดเวลาผ่อนเป็น ${res.refinanceTermMonths} เดือน ทำให้เสียดอกเบี้ยรวมเพิ่มขึ้น <strong>${formatMoney(Math.abs(res.interestSaved))} ${unit}</strong> แม้ดอกเบี้ยจะต่ำลง`;
    }
  }
}

/**
 * Render SVG Debt Payoff Trajectory Chart offline without external libraries
 * Comparing Avalanche, Snowball, and Minimum Payments Only
 */
function renderPayoffChart(
  simCurrent,
  simMinOnly,
  totalDebt,
  simAvalanche,
  simSnowball,
  windfall = null,
  simBaseline = null,
) {
  const svg = document.getElementById('svgDebtChart');
  if (!svg) return;

  const deltaBadge = document.getElementById('debtStrategyDeltaBadge');
  const legWf = document.getElementById('leg-windfall');
  if (legWf) legWf.style.display = windfall ? 'inline-flex' : 'none';

  if (!totalDebt || totalDebt <= 0 || !simCurrent || simCurrent.months === 0) {
    if (deltaBadge) deltaBadge.style.display = 'none';
    const emptyMsg =
      LANG === 'en' ? 'No debt balance to display — You are debt-free! 🎉' : 'ไม่มีภาระหนี้คงค้าง — ปลอดหนี้แล้ว! 🎉';
    svg.innerHTML = `<text x="300" y="110" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="inherit">${emptyMsg}</text>`;
    return;
  }

  // 1. Strategy Delta Callout Badge
  if (deltaBadge && simAvalanche && simSnowball) {
    deltaBadge.style.display = 'block';
    const interestDiff = Math.max(0, simSnowball.totalInterest - simAvalanche.totalInterest);
    const monthsDiff = simSnowball.months - simAvalanche.months;
    const isAvActive = state.strategy === 'avalanche';

    if (interestDiff > 10 || monthsDiff !== 0) {
      if (isAvActive) {
        deltaBadge.style.background = 'var(--ok-dim)';
        deltaBadge.style.borderColor = 'var(--ok)';
        deltaBadge.innerHTML =
          LANG === 'en'
            ? `💡 <strong>Avalanche Method:</strong> Saves <strong>${formatMoney(interestDiff)} ${unit}</strong> more in total interest than Snowball${monthsDiff > 0 ? ` and finishes ${monthsDiff} mos sooner` : ''}.`
            : `💡 วิธี <strong>Avalanche:</strong> ช่วยประหยัดดอกเบี้ยได้มากกว่า Snowball <strong>${formatMoney(interestDiff)} ${unit}</strong>${monthsDiff > 0 ? ` และปลดหนี้เร็วกว่า ${monthsDiff} เดือน` : ''}`;
      } else {
        deltaBadge.style.background = 'var(--blue-dim)';
        deltaBadge.style.borderColor = 'var(--blue)';
        deltaBadge.innerHTML =
          LANG === 'en'
            ? `💡 <strong>Snowball Method:</strong> Maximizes early momentum and quick psychological wins (total interest is +${formatMoney(interestDiff)} ${unit} vs Avalanche).`
            : `💡 วิธี <strong>Snowball:</strong> เน้นสร้างกำลังใจปลดหนี้ก้อนแรกเร็วที่สุด (ดอกเบี้ยรวมมากกว่า Avalanche +${formatMoney(interestDiff)} ${unit})`;
      }
    } else {
      deltaBadge.style.background = 'var(--panel-2)';
      deltaBadge.style.borderColor = 'var(--line)';
      deltaBadge.innerHTML =
        LANG === 'en'
          ? '💡 Both Snowball and Avalanche produce identical timeline and interest savings for this debt structure.'
          : '💡 ทั้งวิธี Snowball และ Avalanche ให้ผลลัพธ์ระยะเวลาและดอกเบี้ยเท่ากันสำหรับรายการหนี้ชุดนี้';
    }
  }

  const width = 600;
  const height = 220;
  const padding = { top: 22, right: 30, bottom: 35, left: 65 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const maxMonths = Math.max(
    simCurrent.months,
    simMinOnly ? simMinOnly.months : 0,
    simAvalanche ? simAvalanche.months : 0,
    simSnowball ? simSnowball.months : 0,
    simBaseline ? simBaseline.months : 0,
    1,
  );
  const maxBalance = totalDebt > 0 ? totalDebt : 1;

  const mapX = (m) => padding.left + (m / maxMonths) * plotWidth;
  const mapY = (b) => padding.top + plotHeight - (Math.max(0, b) / maxBalance) * plotHeight;
  const xBaseY = padding.top + plotHeight;

  const isSnowball = state.strategy === 'snowball';
  const primaryColor = isSnowball ? '#3b82f6' : '#10b981';
  const secondaryColor = isSnowball ? '#10b981' : '#3b82f6';
  const secondarySim = isSnowball ? simAvalanche : simSnowball;
  const secondaryName = isSnowball
    ? LANG === 'en'
      ? 'Avalanche'
      : 'Avalanche (ดอกสูงสุดก่อน)'
    : LANG === 'en'
      ? 'Snowball'
      : 'Snowball (ยอดน้อยสุดก่อน)';
  const primaryName = isSnowball
    ? LANG === 'en'
      ? 'Snowball (Active)'
      : 'Snowball (กำลังเลือก)'
    : LANG === 'en'
      ? 'Avalanche (Active)'
      : 'Avalanche (กำลังเลือก)';

  let svgHtml = '';

  // Gradients
  svgHtml += `
          <defs>
            <linearGradient id="debtCurrentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${primaryColor}" stop-opacity="0.22" />
              <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.01" />
            </linearGradient>
          </defs>
        `;

  // Horizontal Grid Lines & Y-axis balance labels (4 steps: 0%, 33%, 66%, 100%)
  const ySteps = 3;
  for (let i = 0; i <= ySteps; i++) {
    const ratio = i / ySteps;
    const val = ratio * maxBalance;
    const y = padding.top + plotHeight - ratio * plotHeight;
    svgHtml += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="var(--line, rgba(148,163,184,0.25))" stroke-width="1" stroke-dasharray="3,3" />`;

    let labelText = '';
    if (val >= 1000000) {
      labelText = (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      labelText = Math.round(val / 1000) + 'k';
    } else {
      labelText = Math.round(val);
    }
    svgHtml += `<text x="${padding.left - 10}" y="${y + 4}" fill="#94a3b8" font-size="11" text-anchor="end" font-family="inherit">${labelText}</text>`;
  }

  // X-axis baseline & labels
  svgHtml += `<line x1="${padding.left}" y1="${xBaseY}" x2="${width - padding.right}" y2="${xBaseY}" stroke="var(--line, rgba(148,163,184,0.4))" stroke-width="1.5" />`;

  const xTicksCount = Math.min(maxMonths, 5);
  const xInterval = Math.max(1, Math.round(maxMonths / xTicksCount));
  const xTicks = [0];
  for (let m = xInterval; m < maxMonths; m += xInterval) {
    xTicks.push(m);
  }
  if (!xTicks.includes(maxMonths)) xTicks.push(maxMonths);

  xTicks.forEach((m) => {
    const x = mapX(m);
    svgHtml += `<line x1="${x}" y1="${xBaseY}" x2="${x}" y2="${xBaseY + 4}" stroke="#94a3b8" stroke-width="1" />`;
    const lbl = m === 0 ? '0' : `${m}${LANG === 'en' ? 'm' : 'ด'}`;
    svgHtml += `<text x="${x}" y="${xBaseY + 18}" fill="#94a3b8" font-size="11" text-anchor="middle" font-family="inherit">${lbl}</text>`;
  });

  // 1. Plot Minimum-Only Trajectory (Benchmark dashed amber line)
  if (simMinOnly && Array.isArray(simMinOnly.trajectory) && simMinOnly.trajectory.length > 0) {
    const minPathD = simMinOnly.trajectory
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.month).toFixed(1)} ${mapY(p.balance).toFixed(1)}`)
      .join(' ');
    svgHtml += `<path d="${minPathD}" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="4,4" opacity="0.8">
              <title>${LANG === 'en' ? 'Minimum Payments Only: ' + simMinOnly.months + ' months' : 'จ่ายขั้นต่ำเท่านั้น: ' + simMinOnly.months + ' เดือน'}</title>
            </path>`;
  }

  // 1.5. Plot Baseline Trajectory (Dashed slate line when windfall is active)
  if (windfall && simBaseline && Array.isArray(simBaseline.trajectory) && simBaseline.trajectory.length > 0) {
    const baseLinePathD = simBaseline.trajectory
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.month).toFixed(1)} ${mapY(p.balance).toFixed(1)}`)
      .join(' ');
    svgHtml += `<path d="${baseLinePathD}" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="3,3" opacity="0.75">
              <title>${LANG === 'en' ? 'Baseline without windfall: ' + simBaseline.months + ' months' : 'เส้นทางปกติก่อนโปะเงินก้อน: ' + simBaseline.months + ' เดือน'}</title>
            </path>`;
  }

  // 2. Plot Secondary Strategy Trajectory (Alternative comparative line)
  if (secondarySim && Array.isArray(secondarySim.trajectory) && secondarySim.trajectory.length > 0) {
    const secPathD = secondarySim.trajectory
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.month).toFixed(1)} ${mapY(p.balance).toFixed(1)}`)
      .join(' ');
    svgHtml += `<path d="${secPathD}" fill="none" stroke="${secondaryColor}" stroke-width="1.8" stroke-dasharray="5,3" opacity="0.85">
              <title>${secondaryName}: ${secondarySim.months} ${LANG === 'en' ? 'months' : 'เดือน'}</title>
            </path>`;
  }

  // 3. Plot Primary (Active) Strategy Trajectory (Solid line with shaded area)
  if (simCurrent && Array.isArray(simCurrent.trajectory) && simCurrent.trajectory.length > 0) {
    const traj = simCurrent.trajectory;
    const linePathD = traj
      .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${mapX(p.month).toFixed(1)} ${mapY(p.balance).toFixed(1)}`)
      .join(' ');

    const firstX = mapX(traj[0].month).toFixed(1);
    const lastX = mapX(traj[traj.length - 1].month).toFixed(1);
    const areaPathD = `${linePathD} L ${lastX} ${xBaseY} L ${firstX} ${xBaseY} Z`;

    svgHtml += `<path d="${areaPathD}" fill="url(#debtCurrentGrad)" />`;
    svgHtml += `<path d="${linePathD}" fill="none" stroke="${primaryColor}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
              <title>${primaryName}: ${simCurrent.months} ${LANG === 'en' ? 'months' : 'เดือน'}</title>
            </path>`;

    // 4. Milestone dots for paid-off loans along the active curve
    if (Array.isArray(simCurrent.payoffOrder) && simCurrent.payoffOrder.length > 0) {
      simCurrent.payoffOrder.forEach((po) => {
        const pt = traj.find((p) => p.month === po.month) || { month: po.month, balance: 0 };
        const cx = mapX(pt.month);
        const cy = mapY(pt.balance);
        const tipText =
          LANG === 'en'
            ? `🎉 ${po.name} paid off in month ${po.month}!`
            : `🎉 ปลดหนี้ ${po.name} สำเร็จในเดือนที่ ${po.month}!`;
        svgHtml += `
                      <g class="milestone-marker">
                        <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="${primaryColor}" stroke="#ffffff" stroke-width="2" style="cursor:pointer;">
                          <title>${tipText}</title>
                        </circle>
                      </g>
                    `;
      });
    }

    // 5. Windfall Injection Marker along the active trajectory
    if (windfall && Array.isArray(simCurrent.trajectory) && simCurrent.trajectory.length > 0) {
      const wfPt =
        simCurrent.trajectory.find((p) => p.month === windfall.month) ||
        simCurrent.trajectory.reduce(
          (prev, curr) => (Math.abs(curr.month - windfall.month) < Math.abs(prev.month - windfall.month) ? curr : prev),
          simCurrent.trajectory[0],
        );
      if (wfPt) {
        const cx = mapX(wfPt.month);
        const cy = mapY(wfPt.balance);
        const tipText =
          LANG === 'en'
            ? `🎁 Lump-sum windfall +${formatMoney(windfall.amount)} ${unit} injected in month ${windfall.month}`
            : `🎁 โปะเงินก้อน +${formatMoney(windfall.amount)} ${unit} ในเดือนที่ ${windfall.month}`;
        const labelY = cy - 10 < padding.top ? cy + 18 : cy - 10;
        svgHtml += `
                      <g class="windfall-marker">
                        <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="7" fill="#8b5cf6" stroke="#ffffff" stroke-width="2.5" style="cursor:pointer;">
                          <title>${tipText}</title>
                        </circle>
                        <text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" fill="#8b5cf6" font-size="11" font-weight="bold" text-anchor="middle" font-family="inherit">🎁 +${formatMoney(windfall.amount)}</text>
                      </g>
                    `;
      }
    }
  }

  svg.innerHTML = svgHtml;

  // Update milestone legend dot color to match active strategy
  const mDot = document.getElementById('milestoneLegendDot');
  if (mDot) mDot.style.background = primaryColor;
}

function importFromRemainingMoney() {
  try {
    const raw = localStorage.getItem('remainingMoneyCalculator.state.v1');
    if (!raw) {
      alert(LANG === 'en' ? 'No data found in Remaining Money calculator.' : 'ไม่พบข้อมูลในเครื่องมือคำนวณเงินคงเหลือ');
      return;
    }
    const remState = JSON.parse(raw);
    let monthlySaving = 0;
    if (remState && Array.isArray(remState.savings)) {
      monthlySaving = remState.savings.reduce((sum, s) => sum + parseNum(s.value), 0);
    }
    if (monthlySaving <= 0) {
      // Check if remaining money itself has surplus
      const totalIncome = (remState.incomes || []).reduce((sum, i) => sum + parseNum(i.value), 0);
      const totalExpense = (remState.expenses || []).reduce((sum, e) => sum + parseNum(e.value), 0);
      monthlySaving = Math.max(0, totalIncome - totalExpense);
    }

    if (monthlySaving > 0) {
      undoMgr.push(state);
      state.extraPayment = monthlySaving;
      document.getElementById('txtExtraPayment').value = monthlySaving;
      computePayoff();
      saveState();
      updateUndoUI();
      const banner = document.getElementById('bridgeAlertBanner');
      if (document.getElementById('bridgeAlertText'))
        document.getElementById('bridgeAlertText').textContent =
          LANG === 'en'
            ? `✓ Successfully imported ${formatMoney(monthlySaving)} THB monthly savings from Remaining Money calculator!`
            : `✓ ดึงเงินออมจำนวน ${formatMoney(monthlySaving)} บาท/เดือน จากหน้าคำนวณเงินคงเหลือสำเร็จ!`;
      banner.style.display = 'flex';
      setTimeout(() => {
        banner.style.display = 'none';
      }, 4000);
    } else {
      alert(
        LANG === 'en'
          ? 'No monthly savings amount available in Remaining Money calculator.'
          : 'ไม่มียอดเงินออมรายเดือนในหน้าคำนวณเงินคงเหลือ',
      );
    }
  } catch (e) {
    alert(LANG === 'en' ? 'Could not read data from Remaining Money.' : 'เกิดข้อผิดพลาดในการดึงข้อมูล');
  }
}

function copyPayoffPlan() {
  const total = document.getElementById('kpi-total-debt').textContent;
  const date = document.getElementById('kpi-debtfree-date').textContent;
  const saved = document.getElementById('kpi-interest-saved').textContent;
  const stratName = state.strategy === 'avalanche' ? 'Avalanche (Highest Interest)' : 'Snowball (Smallest Balance)';

  const text =
    LANG === 'en'
      ? `Debt Payoff Plan:\nStrategy: ${stratName}\nTotal Debt: ${total}\nDebt-Free Date: ${date}\nExtra Monthly Payment: ${formatMoney(state.extraPayment)} THB\nTotal Interest Saved: ${saved}`
      : `แผนการปลดหนี้ (Debt Payoff):\nกลยุทธ์: ${state.strategy === 'avalanche' ? 'Avalanche (ดอกเบี้ยสูงสุดก่อน)' : 'Snowball (หนี้น้อยสุดก่อน)'}\nยอดหนี้รวม: ${total}\nวันปลดหนี้สำเร็จ: ${date}\nเงินจ่ายเพิ่มต่อเดือน: ${formatMoney(state.extraPayment)} บาท\nประหยัดดอกเบี้ยได้: ${saved}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const btn = document.getElementById('lbl-copy-plan');
      const orig = btn.innerText;
      btn.innerText = LANG === 'en' ? '✓ Copied!' : '✓ คัดลอกแล้ว!';
      setTimeout(() => {
        btn.innerText = orig;
      }, 1800);
    })
    .catch(() => {});
}

function resetDefaults() {
  const confirmMsg =
    LANG === 'en' ? 'Reset all debt accounts to default values?' : 'คุณต้องการรีเซ็ตรายการหนี้สินทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?';
  if (!confirm(confirmMsg)) return;
  undoMgr.push(state);
  state = JSON.parse(JSON.stringify(defaultState));
  document.getElementById('txtExtraPayment').value = state.extraPayment;
  syncWindfallInputs();
  syncRefinanceInputs();
  renderTable();
  setStrategy(state.strategy);
  saveState();
  updateUndoUI();
}

function printDebtPlan() {
  const now = new Date();
  const tsEl = document.getElementById('print-debt-timestamp');
  if (tsEl) {
    const day = now.getDate();
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const m = LANG === 'en' ? enMonths[now.getMonth()] : thMonths[now.getMonth()];
    const y = LANG === 'en' ? now.getFullYear() : now.getFullYear() + 543;
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    tsEl.textContent = `${LANG === 'en' ? 'Generated: ' : 'สร้างเมื่อ: '}${day} ${m} ${y} ${hh}:${mm}`;
  }
  window.print();
}

// Initialize
loadState();
document.getElementById('txtExtraPayment').value = state.extraPayment;
syncWindfallInputs();
syncRefinanceInputs();
renderTable();
setStrategy(state.strategy);
