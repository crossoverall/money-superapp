// Language: read once from localStorage (shared origin with the shell nav's toggle).
if (LANG === 'en') {
  document.title = 'Payslip Simulator (with bonus)';
  const EN = {
    'lbl-setup': 'Income settings',
    'lbl-salary': 'Basic salary (THB/month)',
    'lbl-allowance': 'Allowance / Other (THB/month)',
    'lbl-bonus': 'Annual bonus (THB/year)',
    'lbl-pvd': 'Provident Fund (PVD %)',
    'lbl-pvd-note': '* Deducted from base salary only',
    'lbl-sso-ceiling': 'Social Security (SSO) Cap',
    'opt-sso-750': '750 THB (15k wage cap)',
    'opt-sso-875': '875 THB (17.5k new cap)',
    'opt-sso-1000': '1,000 THB (20k wage cap)',
    'opt-sso-1150': '1,150 THB (23k wage cap)',
    'lbl-taxnote':
      '<strong>How tax is calculated:</strong> the bonus is added to annual income to get the total taxable base, then divided by 12 to spread the monthly withholding (annualized method).',
    'lbl-earnings': 'Earnings',
    'lbl-deductions': 'Deductions',
    'lbl-annual': 'Annual Estimate',
    'lbl-ytd-income': 'Total annual income:',
    'lbl-ytd-tax': 'Total annual tax:',
    'lbl-ytd-pvd': 'Total annual PVD:',
    'lbl-ytd-taxable': 'Net taxable base:',
    'lbl-payslip': 'PAYSLIP',
    'lbl-basicSalary': 'Basic Salary',
    'lbl-slipAllowance': 'Allowance',
    'lbl-taxPeriod': 'Tax this period',
    'lbl-ssoAmount': 'Social Security Contrib. (SSO)',
    'lbl-pvdAmount': 'PF Contrib. (Employee)',
    'lbl-totalGross': 'Total Gross',
    'lbl-totalDedns': 'Total Deductions',
    'lbl-netPayment': 'NET PAYMENT',
    'lbl-breakdownTitle': 'Tax breakdown by bracket (annual)',
    'lbl-copy-text': '📋 Copy Payslip Summary',
    'lbl-export-slip': '📤 Export to Remaining Money',
    'lbl-print-slip': '🖨️ Print / Save PDF',
    lblCompareToggle: '⚖️ Compare Job Offers',
    lblCompareTitle: '📊 Compare Scenario A vs B',
    lblScenarioA: 'Scenario A',
    lblScenarioB: 'Scenario B',
    'lbl-bonus-month': 'Bonus payout month',
    'opt-bm-12': 'December (Year-end / Dec)',
    'opt-bm-1': 'January (Jan)',
    'opt-bm-2': 'February (Feb)',
    'opt-bm-3': 'March (Mar - Fiscal Year-end)',
    'opt-bm-4': 'April (Apr)',
    'opt-bm-6': 'June (Mid-year / Jun)',
    'opt-bm-0': 'None / Evenly divided',
    'lbl-stream-title': '📅 12-Month Net Cashflow &amp; Bonus Stream',
    'lbl-stream-sub': 'Monthly visual breakdown of Net Pay, Tax, Social Security, PVD, and Bonus payout',
    'leg-stream-net': 'Net Pay',
    'leg-stream-bonus': 'Bonus Spike',
    'leg-stream-pvd': 'PVD',
    'leg-stream-sso': 'SSO',
    'leg-stream-tax': 'Tax',
    'lbl-reconcile-title': '🔄 Year-End PIT Reconciliation &amp; Refund Tracker',
    'lbl-reconcile-sub':
      'Compare annual payroll withholding (50 Tawi) against final tax liability with additional deductions and simulate PromptPay direct deposit refund',
    'lbl-recon-withheld': 'Cumulative Annual Withholding (50 Tawi):',
    'btn-recon-sync': '🔄 Use 12-Month Payslip Sum',
    'lbl-recon-withheld-hint': 'Total tax withheld by employer reported to the Revenue Department',
    'lbl-recon-extraded': 'Additional Year-End Deductions (Extra):',
    'lbl-recon-ded-save': 'Tax Savings: 0.00 THB',
    'lbl-recon-extraded-hint': 'e.g. Life &amp; Health Insurance, ThaiESG, SSF/RMF, Home loan interest, Donations',
    'lbl-recon-unit1': 'THB',
    'lbl-recon-unit2': 'THB',
    'lbl-recon-card-withheld': 'Total Withheld (50 Tawi)',
    'lbl-recon-card-liability': 'Final Tax Liability',
    'lbl-recon-card-settlement': 'Reconciliation Result',
  };
  Object.keys(EN).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = EN[id];
  });
  const placeholders = {
    salary: 'e.g. 50000',
    allowance: 'e.g. 7000',
    bonus: 'e.g. 100000',
    pvd: 'e.g. 15',
    reconExtraDeductionsInput: 'e.g. 50000',
    cmpSalaryA: 'e.g. 60000',
    cmpBonusA: 'e.g. 2 (months)',
    cmpPvdA: 'e.g. 5',
    cmpSalaryB: 'e.g. 70000',
    cmpBonusB: 'e.g. 1 (month)',
    cmpPvdB: 'e.g. 7',
  };
  Object.keys(placeholders).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = placeholders[id];
  });
}

const STORAGE_KEY = 'moneySuperapp.monthsSlips';
let isWithheldUserEdited = false;
let lastAnnualIncome = 0;
let lastNetAnnualIncome = 0;
let lastAnnualTax = 0;
let lastTotalAnnualNet = 0;

function saveState() {
  const data = {
    salary: document.getElementById('salary').value,
    allowance: document.getElementById('allowance').value,
    bonus: document.getElementById('bonus').value,
    pvd: document.getElementById('pvd').value,
    ssoCap: document.getElementById('ssoCap').value,
    bonusMonth: document.getElementById('bonusMonth') ? document.getElementById('bonusMonth').value : '12',
    reconWithheld: document.getElementById('reconWithheldInput')
      ? document.getElementById('reconWithheldInput').value
      : '',
    reconExtraDeductions: document.getElementById('reconExtraDeductionsInput')
      ? document.getElementById('reconExtraDeductionsInput').value
      : '',
    isWithheldUserEdited: Boolean(isWithheldUserEdited),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {}
}

let currentStreamData = null;

function calculateSlip() {
  const salary = parseNum(document.getElementById('salary').value);
  const allowance = parseNum(document.getElementById('allowance').value);
  const bonus = parseNum(document.getElementById('bonus').value);
  const pvdPercent = parseNum(document.getElementById('pvd').value);
  const ssoCapVal = parseNum(document.getElementById('ssoCap').value) || 875;
  const bonusMonthVal = document.getElementById('bonusMonth')
    ? parseInt(document.getElementById('bonusMonth').value, 10)
    : 12;

  saveState();

  const monthlyEarnings = salary + allowance;

  // ประกันสังคม (5% ของเงินเดือนพื้นฐาน สูงสุดตามเพดานที่เลือก)
  let sso = salary * 0.05;
  if (sso > ssoCapVal) sso = ssoCapVal;

  // กองทุนสำรองเลี้ยงชีพ (คิดจากฐานเงินเดือนเพียวๆ ไม่รวม Allowance)
  const pvd = salary * (pvdPercent / 100);

  // คำนวณรายได้ทั้งปี (รวมโบนัส)
  const annualIncome = monthlyEarnings * 12 + bonus;
  const annualSso = sso * 12;
  const annualPvd = pvd * 12;

  const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
  const personalDeduction = 60000;

  // ฐานภาษีสุทธิ (Taxable Income)
  let netAnnualIncome = annualIncome - (expenseDeduction + personalDeduction + annualSso + annualPvd);
  if (netAnnualIncome < 0) netAnnualIncome = 0;

  const brackets = [
    { limit: 150000, rate: 0, labelTh: '0 - 150,000', labelEn: '0 - 150,000' },
    { limit: 150000, rate: 0.05, labelTh: '150,001 - 300,000', labelEn: '150,001 - 300,000' },
    { limit: 200000, rate: 0.1, labelTh: '300,001 - 500,000', labelEn: '300,001 - 500,000' },
    { limit: 250000, rate: 0.15, labelTh: '500,001 - 750,000', labelEn: '500,001 - 750,000' },
    { limit: 250000, rate: 0.2, labelTh: '750,001 - 1,000,000', labelEn: '750,001 - 1,000,000' },
    { limit: 1000000, rate: 0.25, labelTh: '1,000,001 - 2,000,000', labelEn: '1,000,001 - 2,000,000' },
    { limit: 3000000, rate: 0.3, labelTh: '2,000,001 - 5,000,000', labelEn: '2,000,001 - 5,000,000' },
    { limit: Infinity, rate: 0.35, labelTh: '5,000,001 ขึ้นไป', labelEn: 'Over 5,000,000' },
  ];

  let annualTax = 0;
  let remaining = netAnnualIncome;
  const breakdown = [];

  for (let i = 0; i < brackets.length; i++) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, brackets[i].limit);
    const taxAtThisBracket = taxable * brackets[i].rate;
    annualTax += taxAtThisBracket;
    remaining -= taxable;
    breakdown.push({ bracket: brackets[i], tax: taxAtThisBracket });
  }

  const unit = LANG === 'en' ? 'THB' : 'บาท';
  document.getElementById('taxBreakdown').innerHTML = breakdown
    .map((b) => {
      const label = LANG === 'en' ? b.bracket.labelEn : b.bracket.labelTh;
      return `<div class="flex justify-between"><span>${label} (${(b.bracket.rate * 100).toFixed(0)}%)</span><span class="font-medium">${b.tax.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}</span></div>`;
    })
    .join('');

  // เฉลี่ยภาษีเป็นรายเดือน (ระบบ Payroll ส่วนใหญ่จะเกลี่ยภาษีโบนัสหาร 12 เดือน เพื่อไม่ให้พนักงานจ่ายหนักเดือนเดียว)
  const monthlyTax = annualTax / 12;

  const totalDeductions = sso + pvd + monthlyTax;
  const netPayout = monthlyEarnings - totalDeductions;

  const fmt = (num) =>
    num.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // อัปเดตยอดรายเดือน (Monthly Slip)
  document.getElementById('out-salary').innerText = fmt(salary);
  document.getElementById('out-allowance').innerText = fmt(allowance);
  document.getElementById('out-tax').innerText = fmt(monthlyTax);
  document.getElementById('out-sso').innerText = fmt(sso);
  document.getElementById('out-pvd').innerText = fmt(pvd);
  document.getElementById('out-total-income').innerText = fmt(monthlyEarnings);
  document.getElementById('out-total-deduct').innerText = fmt(totalDeductions);
  document.getElementById('out-net').innerText = fmt(netPayout);

  // อัปเดตยอดประเมินทั้งปี (YTD Estimate)
  document.getElementById('ytd-income').innerText = fmt(annualIncome);
  document.getElementById('ytd-tax').innerText = fmt(annualTax);
  document.getElementById('ytd-pvd').innerText = fmt(annualPvd);
  document.getElementById('ytd-taxable').innerText = fmt(netAnnualIncome);

  // คำนวณกราฟกระแสเงินสด 12 เดือน (12-Month Stream Data)
  const stream = [];
  let totalAnnualNet = 0;
  let maxMonthlyGross = 0;

  for (let m = 1; m <= 12; m++) {
    const isBonus = m === bonusMonthVal && bonus > 0;
    const bonusAmt = isBonus ? bonus : 0;
    const gross = monthlyEarnings + bonusAmt;
    const net = isBonus ? netPayout + bonus : netPayout;

    totalAnnualNet += net;
    if (gross > maxMonthlyGross) maxMonthlyGross = gross;

    stream.push({
      month: m,
      gross,
      net,
      regularNet: netPayout,
      sso,
      pvd,
      tax: monthlyTax,
      bonus: bonusAmt,
      isBonus,
    });
  }

  currentStreamData = {
    stream,
    maxMonthlyGross,
    totalAnnualNet,
  };

  lastAnnualIncome = annualIncome;
  lastNetAnnualIncome = netAnnualIncome;
  lastAnnualTax = annualTax;
  lastTotalAnnualNet = totalAnnualNet;

  const withheldInput = document.getElementById('reconWithheldInput');
  if (withheldInput && (!isWithheldUserEdited || withheldInput.value === '')) {
    withheldInput.value = Math.round(annualTax);
  }

  renderStreamChart(currentStreamData);
  runReconciliation();
}

function copySlipSummary() {
  const net = document.getElementById('out-net').innerText;
  const gross = document.getElementById('out-total-income').innerText;
  const ded = document.getElementById('out-total-deduct').innerText;
  const tax = document.getElementById('out-tax').innerText;
  const sso = document.getElementById('out-sso').innerText;
  const pvd = document.getElementById('out-pvd').innerText;

  const text =
    LANG === 'en'
      ? `Payslip Summary:\nTotal Gross: ${gross} THB\n- Tax: ${tax} THB\n- SSO: ${sso} THB\n- PVD: ${pvd} THB\nTotal Deductions: ${ded} THB\nNet Payment: ${net} THB`
      : `สรุปสลิปเงินเดือน:\nรายได้รวม: ${gross} บาท\n- ภาษี: ${tax} บาท\n- ประกันสังคม: ${sso} บาท\n- กองทุนสำรองเลี้ยงชีพ: ${pvd} บาท\nรวมรายการหัก: ${ded} บาท\nเงินได้สุทธิ: ${net} บาท`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const btnLabel = document.getElementById('lbl-copy-text');
      const orig = btnLabel.innerHTML;
      btnLabel.innerHTML = LANG === 'en' ? '✓ Copied!' : '✓ คัดลอกแล้ว!';
      setTimeout(() => {
        btnLabel.innerHTML = orig;
      }, 1800);
    })
    .catch(() => {});
}

function exportSlipToRemaining() {
  const salary = parseFloat(document.getElementById('salary').value) || 0;
  const allowance = parseFloat(document.getElementById('allowance').value) || 0;
  const pvd = parseFloat(document.getElementById('pvd').value) || 0;
  const ssoCap = parseFloat(document.getElementById('ssoCap').value) || 875;
  const net = parseFloat(document.getElementById('out-net').innerText.replace(/,/g, '')) || 0;

  const slipData = {
    salary,
    allowance,
    pvd,
    ssoCap,
    net,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem('moneySuperapp.pendingSlipImport', JSON.stringify(slipData));
  } catch (_e) {}
  if (window.parent && typeof window.parent.switchToTab === 'function') {
    window.parent.switchToTab('remaining-money');
  } else {
    window.parent.postMessage({ action: 'switchToTab', target: 'remaining-money' }, '*');
  }
}

function renderStreamChart(streamData) {
  const svg = document.getElementById('svgStreamChart');
  if (!svg) return;

  const { stream, maxMonthlyGross, totalAnnualNet } = streamData;
  const badge = document.getElementById('badge-total-annual-net');
  const unit = LANG === 'en' ? 'THB' : 'บาท';
  if (badge) {
    badge.textContent = (LANG === 'en' ? 'Annual Net Pay: ' : 'รับสุทธิทั้งปี: ') + formatMoney(totalAnnualNet) + ' ' + unit;
  }

  if (!stream || stream.length === 0 || maxMonthlyGross <= 0) {
    svg.innerHTML = `<text x="300" y="90" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="inherit">${LANG === 'en' ? 'Enter salary to view 12-month cashflow stream' : 'กรอกเงินเดือนเพื่อดูแนวโน้มรายรับสุทธิ 12 เดือน'}</text>`;
    return;
  }

  const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  const chartH = 120;
  const baseY = 145;
  const colWidth = 26;
  const spacing = 46;
  const startX = 24;

  let svgHtml = '';

  // Draw baseline
  svgHtml += `<line x1="16" y1="${baseY}" x2="584" y2="${baseY}" stroke="var(--line, #e2e8f0)" stroke-width="1.5" />`;

  stream.forEach((item, idx) => {
    const x = startX + idx * spacing;
    const mLabel = LANG === 'en' ? enMonths[idx] : thMonths[idx];

    // Heights
    const netH = maxMonthlyGross > 0 ? (item.regularNet / maxMonthlyGross) * chartH : 0;
    const bonusH = maxMonthlyGross > 0 && item.bonus > 0 ? (item.bonus / maxMonthlyGross) * chartH : 0;
    const pvdH = maxMonthlyGross > 0 ? (item.pvd / maxMonthlyGross) * chartH : 0;
    const ssoH = maxMonthlyGross > 0 ? (item.sso / maxMonthlyGross) * chartH : 0;
    const taxH = maxMonthlyGross > 0 ? (item.tax / maxMonthlyGross) * chartH : 0;

    let curY = baseY;

    // 1. Regular Net Pay (Bottom bar, Emerald)
    const netY = curY - netH;
    svgHtml += `<rect x="${x}" y="${netY.toFixed(1)}" width="${colWidth}" height="${netH.toFixed(1)}" fill="var(--ok, #10b981)" rx="2" style="cursor:pointer;" onmouseover="showStreamTip(event, ${idx})" onmouseout="hideStreamTip()"></rect>`;
    curY = netY;

    // 2. Bonus if present (Purple)
    if (bonusH > 0) {
      const bonY = curY - bonusH;
      svgHtml += `<rect x="${x}" y="${bonY.toFixed(1)}" width="${colWidth}" height="${bonusH.toFixed(1)}" fill="var(--purple, #8b5cf6)" rx="2" style="cursor:pointer;" onmouseover="showStreamTip(event, ${idx})" onmouseout="hideStreamTip()"></rect>`;
      svgHtml += `<text x="${(x + colWidth / 2).toFixed(1)}" y="${(bonY - 5).toFixed(1)}" fill="var(--purple, #8b5cf6)" font-size="10" font-weight="bold" text-anchor="middle" font-family="inherit">🎁</text>`;
      curY = bonY;
    }

    // 3. PVD (Blue)
    if (pvdH > 0) {
      const pvdY = curY - pvdH;
      svgHtml += `<rect x="${x}" y="${pvdY.toFixed(1)}" width="${colWidth}" height="${pvdH.toFixed(1)}" fill="var(--core, #3b82f6)" opacity="0.85" rx="1" style="cursor:pointer;" onmouseover="showStreamTip(event, ${idx})" onmouseout="hideStreamTip()"></rect>`;
      curY = pvdY;
    }

    // 4. SSO (Amber)
    if (ssoH > 0) {
      const ssoY = curY - ssoH;
      svgHtml += `<rect x="${x}" y="${ssoY.toFixed(1)}" width="${colWidth}" height="${ssoH.toFixed(1)}" fill="var(--warn, #f59e0b)" opacity="0.85" rx="1" style="cursor:pointer;" onmouseover="showStreamTip(event, ${idx})" onmouseout="hideStreamTip()"></rect>`;
      curY = ssoY;
    }

    // 5. Tax (Rose)
    if (taxH > 0) {
      const taxY = curY - taxH;
      svgHtml += `<rect x="${x}" y="${taxY.toFixed(1)}" width="${colWidth}" height="${taxH.toFixed(1)}" fill="var(--danger, #ef4444)" opacity="0.85" rx="1" style="cursor:pointer;" onmouseover="showStreamTip(event, ${idx})" onmouseout="hideStreamTip()"></rect>`;
      curY = taxY;
    }

    // Month text below baseline
    const isSelectedBonusMonth = item.isBonus;
    const fontColor = isSelectedBonusMonth ? 'var(--purple, #8b5cf6)' : 'var(--ink-faint, #64748b)';
    const fontWeight = isSelectedBonusMonth ? 'bold' : 'normal';
    svgHtml += `<text x="${(x + colWidth / 2).toFixed(1)}" y="${baseY + 16}" fill="${fontColor}" font-weight="${fontWeight}" font-size="11" text-anchor="middle" font-family="inherit">${mLabel}</text>`;
  });

  svg.innerHTML = svgHtml;
}

function showStreamTip(e, monthIdx) {
  const tip = document.getElementById('streamTooltip');
  if (!tip || !currentStreamData || !currentStreamData.stream[monthIdx]) return;
  const item = currentStreamData.stream[monthIdx];
  const enMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const thMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม',
  ];
  const mName = LANG === 'en' ? enMonths[monthIdx] : thMonths[monthIdx];
  const unit = LANG === 'en' ? 'THB' : 'บาท';

  let html = `<div class="font-bold mb-1">${mName}</div>`;
  html += `<div class="flex justify-between gap-3 text-emerald-400"><span>${LANG === 'en' ? 'Net Take-Home:' : 'เงินได้สุทธิ:'}</span><span class="font-bold">${formatMoney(item.net)} ${unit}</span></div>`;
  if (item.bonus > 0) {
    html += `<div class="flex justify-between gap-3 text-purple-300"><span>${LANG === 'en' ? '🎁 Bonus Included:' : '🎁 โบนัส:'}</span><span class="font-bold">+${formatMoney(item.bonus)} ${unit}</span></div>`;
  }
  html += `<div class="flex justify-between gap-3" style="color:var(--core);"><span>PVD:</span><span>-${formatMoney(item.pvd)} ${unit}</span></div>`;
  html += `<div class="flex justify-between gap-3 text-amber-300"><span>SSO:</span><span>-${formatMoney(item.sso)} ${unit}</span></div>`;
  html += `<div class="flex justify-between gap-3 text-red-300"><span>Tax:</span><span>-${formatMoney(item.tax)} ${unit}</span></div>`;
  html += `<div class="flex justify-between gap-3 border-t border-gray-700 pt-1 mt-1 text-gray-300"><span>${LANG === 'en' ? 'Gross Total:' : 'รายได้รวม:'}</span><span class="font-bold">${formatMoney(item.gross)} ${unit}</span></div>`;

  tip.innerHTML = html;
  tip.style.display = 'block';
  tip.style.opacity = '1';

  const container = tip.parentElement;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  tip.style.left = `${Math.min(rect.width - 200, Math.max(10, x - 80))}px`;
  tip.style.top = `${Math.max(10, y - 120)}px`;
}

function hideStreamTip() {
  const tip = document.getElementById('streamTooltip');
  if (tip) {
    tip.style.opacity = '0';
    tip.style.display = 'none';
  }
}

function onWithheldManualInput() {
  isWithheldUserEdited = true;
  saveState();
  runReconciliation();
}

function syncWithholdingFromStream() {
  isWithheldUserEdited = false;
  const withheldInput = document.getElementById('reconWithheldInput');
  if (withheldInput) {
    withheldInput.value = Math.round(lastAnnualTax);
  }
  saveState();
  runReconciliation();
}

function computeTaxFromBrackets(taxableIncome) {
  let rem = Math.max(0, Number(taxableIncome) || 0);
  let tax = 0;
  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];
  for (let i = 0; i < brackets.length; i++) {
    if (rem <= 0) break;
    const cur = Math.min(rem, brackets[i].limit);
    tax += cur * brackets[i].rate;
    rem -= cur;
  }
  return tax;
}

function runReconciliation() {
  const withheldEl = document.getElementById('reconWithheldInput');
  const extraDedEl = document.getElementById('reconExtraDeductionsInput');
  const badgeEl = document.getElementById('badgeReconcileStatus');
  const cardWithheldEl = document.getElementById('reconCardWithheld');
  const cardLiabilityEl = document.getElementById('reconCardLiability');
  const cardSettlementBox = document.getElementById('reconCardSettlementBox');
  const cardSettlementEl = document.getElementById('reconCardSettlement');
  const bannerEl = document.getElementById('reconSettlementBanner');
  const dedSaveEl = document.getElementById('lbl-recon-ded-save');

  if (!withheldEl || !cardWithheldEl || !cardLiabilityEl) return;

  const isEN = LANG === 'en';
  const curUnit = isEN ? 'THB' : 'บาท';
  const fmt = (n) =>
    Number(n).toLocaleString(isEN ? 'en-US' : 'th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const withheld = Math.max(0, parseNum(withheldEl.value));
  const extraDed = Math.max(0, parseNum(extraDedEl ? extraDedEl.value : 0));

  // Recompute final taxable income after extra deductions
  const finalTaxable = Math.max(0, lastNetAnnualIncome - extraDed);
  const finalTaxLiability = computeTaxFromBrackets(finalTaxable);
  const taxSavings = Math.max(0, lastAnnualTax - finalTaxLiability);

  if (dedSaveEl) {
    dedSaveEl.innerText = isEN ? `Tax Savings: ${fmt(taxSavings)} ${curUnit}` : `ประหยัดภาษีได้: ${fmt(taxSavings)} บาท`;
  }

  cardWithheldEl.innerText = `${fmt(withheld)} ${curUnit}`;
  cardLiabilityEl.innerText = `${fmt(finalTaxLiability)} ${curUnit}`;

  const delta = withheld - finalTaxLiability;
  const absDelta = Math.abs(delta);

  if (delta > 0.01) {
    // Refund
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="py-1 px-3 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1">
                        🎉 ${isEN ? 'Tax Refund' : 'ได้รับเงินคืนภาษี'}: +${fmt(absDelta)} ${curUnit}
                    </span>`;
    }
    if (cardSettlementBox) {
      cardSettlementBox.className =
        'p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 shadow-sm';
    }
    if (cardSettlementEl) {
      cardSettlementEl.className = 'text-sm font-black text-emerald-600 dark:text-emerald-400';
      cardSettlementEl.innerText = `+${fmt(absDelta)} ${curUnit} (${isEN ? 'Refund' : 'ขอคืน'})`;
    }
    const adjAnnualNet = lastTotalAnnualNet + absDelta;
    if (bannerEl) {
      bannerEl.className =
        'p-3.5 rounded-lg border bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-xs leading-relaxed text-emerald-900 dark:text-emerald-200';
      bannerEl.innerHTML = `
                        <div class="flex items-start gap-2.5">
                            <span class="text-xl">💳</span>
                            <div class="flex-1">
                                <div class="font-bold text-sm mb-1 text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5 flex-wrap">
                                    <span>${isEN ? 'Direct Deposit via PromptPay Ready' : 'พร้อมรับเงินคืนภาษีตรงผ่าน PromptPay (เลขบัตรประชาชน)'}</span>
                                    <span class="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded font-semibold">${isEN ? 'AUTO REFUND' : 'โอนคืนไว'}</span>
                                </div>
                                <p class="mb-1.5">
                                    ${
                                      isEN
                                        ? `Your employer withheld <strong>${fmt(withheld)} ${curUnit}</strong>, but your true liability is only <strong>${fmt(finalTaxLiability)} ${curUnit}</strong>. The Revenue Department will refund <strong>${fmt(absDelta)} ${curUnit}</strong> directly to your ID-linked PromptPay bank account.`
                                        : `ภาษีที่ถูกหัก ณ ที่จ่ายสะสม <strong>${fmt(withheld)} บาท</strong> สูงกว่าภาษีที่ต้องจ่ายจริงหลังหักลดหย่อน <strong>${fmt(finalTaxLiability)} บาท</strong> คุณจะได้รับเงินคืนภาษี <strong>+${fmt(absDelta)} บาท</strong> จากกรมสรรพากรโดยตรง`
                                    }
                                </p>
                                <div class="pt-1.5 border-t border-emerald-200 dark:border-emerald-800/60 text-[11.5px] font-medium text-emerald-800 dark:text-emerald-300">
                                    💰 ${isEN ? 'Adjusted Total Annual Take-Home' : 'รายรับสุทธิรวมทั้งปีสุทธิหลังคืนภาษี'}: <strong>${fmt(adjAnnualNet)} ${curUnit}</strong> (${isEN ? 'Payroll Net' : 'เงินเดือนสุทธิ'} + ${isEN ? 'Refund' : 'เงินคืนภาษี'})
                                </div>
                            </div>
                        </div>
                    `;
    }
  } else if (delta < -0.01) {
    // Additional Tax Payable
    const canInstallment = absDelta >= 3000;
    const installmentAmt = canInstallment ? Math.ceil(absDelta / 3) : absDelta;

    if (badgeEl) {
      badgeEl.innerHTML = `<span class="py-1 px-3 bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold rounded-lg flex items-center gap-1">
                        ⚠️ ${isEN ? 'Tax Payable' : 'ต้องชำระเพิ่ม'}: ${fmt(absDelta)} ${curUnit}
                    </span>`;
    }
    if (cardSettlementBox) {
      cardSettlementBox.className =
        'p-3 rounded-lg border bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 shadow-sm';
    }
    if (cardSettlementEl) {
      cardSettlementEl.className = 'text-sm font-black text-rose-600 dark:text-rose-400';
      cardSettlementEl.innerText = `-${fmt(absDelta)} ${curUnit} (${isEN ? 'Payable' : 'ชำระเพิ่ม'})`;
    }
    const adjAnnualNet = Math.max(0, lastTotalAnnualNet - absDelta);
    if (bannerEl) {
      bannerEl.className =
        'p-3.5 rounded-lg border bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-xs leading-relaxed text-rose-900 dark:text-rose-200';
      bannerEl.innerHTML = `
                        <div class="flex items-start gap-2.5">
                            <span class="text-xl">⚠️</span>
                            <div class="flex-1">
                                <div class="font-bold text-sm mb-1 text-rose-800 dark:text-rose-200 flex items-center gap-1.5 flex-wrap">
                                    <span>${isEN ? 'Additional Tax Payment Required' : 'มียอดภาษีที่ต้องชำระเพิ่มเติม'}</span>
                                    ${canInstallment ? `<span class="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded font-semibold">${isEN ? '0% 3-MONTH INSTALLMENT ELIGIBLE' : 'ผ่อนได้ 3 งวด ดอกเบี้ย 0%'}</span>` : ''}
                                </div>
                                <p class="mb-1.5">
                                    ${
                                      isEN
                                        ? `Your employer withheld <strong>${fmt(withheld)} ${curUnit}</strong>, but your true annual tax is <strong>${fmt(finalTaxLiability)} ${curUnit}</strong>. You need to pay an additional <strong>${fmt(absDelta)} ${curUnit}</strong> upon filing ภ.ง.ด.91.`
                                        : `นายจ้างหักภาษีไว้ <strong>${fmt(withheld)} บาท</strong> แต่มียอดภาษีจริง <strong>${fmt(finalTaxLiability)} บาท</strong> คุณจะต้องชำระภาษีเพิ่มเติม <strong>${fmt(absDelta)} บาท</strong>`
                                    }
                                </p>
                                ${
                                  canInstallment
                                    ? `
                                    <div class="mt-2 p-2 rounded border text-[11px]" style="background:var(--panel-2); border-color:var(--line); color:var(--ink);">
                                        💳 <strong>${isEN ? '3-Month Interest-Free Installment Option:' : 'สิทธิเลือกผ่อนชำระ 3 งวด (ดอกเบี้ย 0%):'}</strong>
                                        <div class="grid grid-cols-3 gap-2 mt-1 text-center font-semibold">
                                            <div class="p-1 rounded border" style="background:var(--warn-dim); border-color:var(--warn); color:var(--ink);">${isEN ? 'Inst 1:' : 'งวด 1:'} ${fmt(installmentAmt)} ${curUnit}<div class="text-[9.5px] font-normal" style="color:var(--ink-dim);">${isEN ? 'By Apr 8' : 'ภายใน 8 เม.ย.'}</div></div>
                                            <div class="p-1 rounded border" style="background:var(--warn-dim); border-color:var(--warn); color:var(--ink);">${isEN ? 'Inst 2:' : 'งวด 2:'} ${fmt(installmentAmt)} ${curUnit}<div class="text-[9.5px] font-normal" style="color:var(--ink-dim);">${isEN ? 'By May 8' : 'ภายใน 8 พ.ค.'}</div></div>
                                            <div class="p-1 rounded border" style="background:var(--warn-dim); border-color:var(--warn); color:var(--ink);">${isEN ? 'Inst 3:' : 'งวด 3:'} ${fmt(absDelta - installmentAmt * 2)} ${curUnit}<div class="text-[9.5px] font-normal" style="color:var(--ink-dim);">${isEN ? 'By Jun 8' : 'ภายใน 8 มิ.ย.'}</div></div>
                                        </div>
                                    </div>
                                `
                                    : ''
                                }
                                <div class="pt-1.5 mt-2 border-t text-[11.5px] font-medium" style="border-top-color:var(--line); color:var(--ink);">
                                    💰 ${isEN ? 'Adjusted Net Annual Income' : 'รายรับสุทธิรวมทั้งปีหลังหักภาษีส่วนเพิ่ม'}: <strong>${fmt(adjAnnualNet)} ${curUnit}</strong>
                                </div>
                            </div>
                        </div>
                    `;
    }
  } else {
    // Exact Match
    if (badgeEl) {
      badgeEl.innerHTML = `<span class="py-1 px-3 border text-xs font-bold rounded-lg flex items-center gap-1" style="background:var(--panel-2); border-color:var(--line); color:var(--ink);">
                        ✅ ${isEN ? 'Exact Balance' : 'ภาษีหักไว้พอดี'}
                    </span>`;
    }
    if (cardSettlementBox) {
      cardSettlementBox.className = 'p-3 rounded-lg border shadow-xs';
      cardSettlementBox.style.background = 'var(--panel-2)';
      cardSettlementBox.style.borderColor = 'var(--line)';
    }
    if (cardSettlementEl) {
      cardSettlementEl.className = 'text-sm font-black';
      cardSettlementEl.style.color = 'var(--ink)';
      cardSettlementEl.innerText = `0.00 ${curUnit}`;
    }
    if (bannerEl) {
      bannerEl.className = 'p-3 rounded-lg border text-xs leading-relaxed';
      bannerEl.style.background = 'var(--panel-2)';
      bannerEl.style.borderColor = 'var(--line)';
      bannerEl.style.color = 'var(--ink-dim)';
      bannerEl.innerHTML = `
                        <div class="flex items-center gap-2">
                            <span>✅</span>
                            <span>${isEN ? 'Employer withholding matches your calculated annual PIT liability exactly. No additional payment or refund needed.' : 'ยอดภาษีหัก ณ ที่จ่ายสะสมตรงกับภาษีที่ต้องชำระจริงสิ้นปีพอดี ไม่มียอดต้องจ่ายเพิ่มหรือขอคืน'}</span>
                        </div>
                    `;
    }
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;

    const salary = data?.salary || '';
    const allowance = data?.allowance || '';
    const bonus = data?.bonus || '';
    const pvd = data?.pvd || '';
    const ssoCap = data?.ssoCap || '875';
    const bonusMonth = data?.bonusMonth ?? '12';

    if (salary !== '') document.getElementById('salary').value = salary;
    if (allowance !== '') document.getElementById('allowance').value = allowance;
    if (bonus !== '') document.getElementById('bonus').value = bonus;
    if (pvd !== '') document.getElementById('pvd').value = pvd;
    if (ssoCap !== '') document.getElementById('ssoCap').value = ssoCap;
    if (document.getElementById('bonusMonth')) document.getElementById('bonusMonth').value = bonusMonth;

    if (data?.reconWithheld !== undefined && data.reconWithheld !== '') {
      const rwh = document.getElementById('reconWithheldInput');
      if (rwh) rwh.value = data.reconWithheld;
    }
    if (data?.reconExtraDeductions !== undefined && data.reconExtraDeductions !== '') {
      const red = document.getElementById('reconExtraDeductionsInput');
      if (red) red.value = data.reconExtraDeductions;
    }
    if (data?.isWithheldUserEdited !== undefined) {
      isWithheldUserEdited = Boolean(data.isWithheldUserEdited);
    }

    calculateSlip();
  } catch (_e) {}
}

function toggleCompare() {
  const panel = document.getElementById('comparePanel');
  if (!panel) return;
  const isHidden = panel.style.display === 'none' || panel.style.display === '';
  panel.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    // Pre-fill Scenario A from current inputs if empty
    const curSal = document.getElementById('salary')?.value || '';
    const curBon = document.getElementById('bonus')?.value || '';
    const curPvd = document.getElementById('pvd')?.value || '';
    const cmpA = document.getElementById('cmpSalaryA');
    if (cmpA && !cmpA.value && curSal) cmpA.value = curSal;
    const bonA = document.getElementById('cmpBonusA');
    if (bonA && (!bonA.value || bonA.value === '0') && curBon) bonA.value = curBon;
    const pvdA = document.getElementById('cmpPvdA');
    if (pvdA && (!pvdA.value || pvdA.value === '0') && curPvd) pvdA.value = curPvd;
    runCompare();
  }
}

function calcScenario(salary, bonus, pvdPercent, ssoCapVal) {
  if (!salary || salary <= 0) return null;
  const bonusTHB = bonus <= 24 && bonus > 0 ? bonus * salary : bonus;
  const annualIncome = salary * 12 + bonusTHB;
  const monthlySso = Math.min(salary * 0.05, ssoCapVal);
  const annualSso = monthlySso * 12;
  const monthlyPvd = salary * (pvdPercent / 100);
  const annualPvd = monthlyPvd * 12;

  const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
  const personalDeduction = 60000;
  let netTaxable = annualIncome - (expenseDeduction + personalDeduction + annualSso + annualPvd);
  if (netTaxable < 0) netTaxable = 0;

  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];
  let annualTax = 0;
  let rem = netTaxable;
  for (let i = 0; i < brackets.length; i++) {
    if (rem <= 0) break;
    const cur = Math.min(rem, brackets[i].limit);
    annualTax += cur * brackets[i].rate;
    rem -= cur;
  }
  const monthlyTax = annualTax / 12;
  const monthlyNet = salary - monthlySso - monthlyPvd - monthlyTax;
  const annualNet = annualIncome - annualSso - annualPvd - annualTax;
  return {
    salary,
    bonusTHB,
    annualIncome,
    monthlySso,
    annualSso,
    monthlyPvd,
    annualPvd,
    annualTax,
    monthlyTax,
    monthlyNet,
    annualNet,
  };
}

function runCompare() {
  const ssoCapVal = parseFloat(document.getElementById('ssoCap').value) || 875;
  const salA = parseFloat(document.getElementById('cmpSalaryA').value) || 0;
  const bonA = parseFloat(document.getElementById('cmpBonusA').value) || 0;
  const pvdA = parseFloat(document.getElementById('cmpPvdA').value) || 0;

  const salB = parseFloat(document.getElementById('cmpSalaryB').value) || 0;
  const bonB = parseFloat(document.getElementById('cmpBonusB').value) || 0;
  const pvdB = parseFloat(document.getElementById('cmpPvdB').value) || 0;

  const resA = calcScenario(salA, bonA, pvdA, ssoCapVal);
  const resB = calcScenario(salB, bonB, pvdB, ssoCapVal);

  const out = document.getElementById('compareResult');
  if (!out) return;
  if (!resA && !resB) {
    out.style.display = 'none';
    return;
  }
  out.style.display = 'block';

  const isEN = LANG === 'en';
  const curUnit = isEN ? 'THB' : 'บาท';
  const fmt = (n) => Math.round(n).toLocaleString(isEN ? 'en-US' : 'th-TH');

  const diffMonthly = (resB ? resB.monthlyNet : 0) - (resA ? resA.monthlyNet : 0);
  const diffAnnual = (resB ? resB.annualNet : 0) - (resA ? resA.annualNet : 0);

  let verdict = '';
  if (resA && resB) {
    if (Math.abs(diffMonthly) < 1) {
      verdict = `<div class="p-2 rounded text-center font-bold" style="background:var(--panel-2); border:1px solid var(--line); color:var(--ink);">
                        ${isEN ? '🤝 Both scenarios provide equal net monthly pay' : '🤝 ทั้งสองข้อเสนอให้เงินได้สุทธิต่อเดือนเท่ากัน'}
                    </div>`;
    } else if (diffMonthly > 0) {
      verdict = `<div class="p-2 rounded text-center font-bold" style="background:var(--ok-dim); color:var(--ok); border:1px solid var(--line);">
                        ${isEN ? `🎉 Scenario B gives +${fmt(diffMonthly)} ${curUnit}/mo (+${fmt(diffAnnual)} ${curUnit}/yr net)` : `🎉 Scenario B ให้เงินได้สุทธิมากกว่า +${fmt(diffMonthly)} ${curUnit}/เดือน (+${fmt(diffAnnual)} ${curUnit}/ปี)`}
                    </div>`;
    } else {
      verdict = `<div class="p-2 rounded text-center font-bold" style="background:var(--core-dim); color:var(--core); border:1px solid var(--line);">
                        ${isEN ? `💡 Scenario A gives +${fmt(Math.abs(diffMonthly))} ${curUnit}/mo (+${fmt(Math.abs(diffAnnual))} ${curUnit}/yr net)` : `💡 Scenario A ให้เงินได้สุทธิมากกว่า +${fmt(Math.abs(diffMonthly))} ${curUnit}/เดือน (+${fmt(Math.abs(diffAnnual))} ${curUnit}/ปี)`}
                    </div>`;
    }
  }

  out.innerHTML = `
                <div class="grid grid-cols-2 gap-2 pb-2 mb-2" style="border-bottom:1px solid var(--line);">
                    <div>
                        <div class="font-bold mb-1" style="color:var(--ink);">${isEN ? 'Scenario A' : 'ข้อเสนอ A'}</div>
                        <div>${isEN ? 'Net / Month:' : 'สุทธิ / เดือน:'} <span class="font-bold" style="${diffMonthly <= 0 && resB ? 'color:var(--core);' : ''}">${resA ? fmt(resA.monthlyNet) : '-'}</span> ${curUnit}</div>
                        <div>${isEN ? 'Net / Year:' : 'สุทธิ / ทั้งปี:'} <span class="font-medium">${resA ? fmt(resA.annualNet) : '-'}</span> ${curUnit}</div>
                        <div class="text-[11px]" style="color:var(--ink-faint);">${isEN ? 'Tax / Year:' : 'ภาษีทั้งปี:'} ${resA ? fmt(resA.annualTax) : '-'} | PVD: ${resA ? fmt(resA.annualPvd) : '-'}</div>
                    </div>
                    <div>
                        <div class="font-bold mb-1" style="color:var(--ink);">${isEN ? 'Scenario B' : 'ข้อเสนอ B'}</div>
                        <div>${isEN ? 'Net / Month:' : 'สุทธิ / เดือน:'} <span class="font-bold" style="${diffMonthly > 0 ? 'color:var(--ok);' : ''}">${resB ? fmt(resB.monthlyNet) : '-'}</span> ${curUnit}</div>
                        <div>${isEN ? 'Net / Year:' : 'สุทธิ / ทั้งปี:'} <span class="font-medium">${resB ? fmt(resB.annualNet) : '-'}</span> ${curUnit}</div>
                        <div class="text-[11px]" style="color:var(--ink-faint);">${isEN ? 'Tax / Year:' : 'ภาษีทั้งปี:'} ${resB ? fmt(resB.annualTax) : '-'} | PVD: ${resB ? fmt(resB.annualPvd) : '-'}</div>
                    </div>
                </div>
                ${verdict}
            `;
}

loadState();
