// Language: read once from localStorage (shared origin with the shell nav's toggle).
if (LANG === 'en') {
  document.title = 'Severance & PVD Tax Calculator';
  const EN = {
    'lbl-h1': 'Severance & PVD Tax Calculator',
    'lbl-subtitle': 'Choose the condition that matches your situation',
    'lbl-severance': 'Severance Pay',
    'lbl-severanceLegal': 'Statutory severance',
    'badge-severanceLegal': 'Exempt up to 600,000 THB',
    'lbl-severanceExtra': 'Extra severance (beyond statutory)',
    'badge-severanceExtra': 'Fully taxable',
    'badge-pvdEmpContrib': 'Exempt',
    'lbl-pvdSection': 'Provident Fund (PVD)',
    'lbl-pvdEmpContrib': "Accumulated contribution (employee's)",
    'lbl-pvdEmpReturn': 'Return on accumulated contribution',
    'lbl-pvdEmrContrib': "Contribution (employer's)",
    'lbl-pvdEmrReturn': 'Return on employer contribution',
    'lbl-years': 'Years of service',
    'btn-calc': 'Calculate Tax',
    'lbl-res-legal-excess': 'Statutory severance (excess)',
    'lbl-res-extra': 'Extra severance',
    'lbl-res-pvd': 'Taxable PVD',
    'lbl-res-taxable': 'Total taxable amount',
    'lbl-res-tax': 'Tax payable',
    'btn-reset': 'Clear',
    'tip-legal-excess':
      'Statutory severance minus the 600,000 THB exemption<br>= statutory severance − 600,000 (not below 0)',
    'tip-extra': 'Severance beyond statutory amount has no exemption<br>fully taxed',
    'tip-pvd':
      "= return on accumulated contribution + employer contribution<br>+ return on employer contribution<br>(excludes the employee's own accumulated contribution, which is exempt)",
    'tip-tax':
      'Calculated using progressive tax brackets<br>0–150k: 0% / 150k–300k: 5%<br>300k–500k: 10% / 500k–750k: 15% / 750k–1M: 20%<br>1M–2M: 25% / 2M–5M: 30% / &gt;5M: 35%',
    'btn-toggle-sev-calc': '🧮 Auto-calc by tenure',
    'lbl-sev-calc-title': 'Statutory Severance Calculator (Labor Act)',
    'lbl-last-wage': 'Last Monthly Wage (THB)',
    'lbl-tenure-bracket': 'Statutory Tenure Bracket',
    'lbl-sev-calc-result': 'Statutory Severance:',
    'btn-apply-sev': '✓ Apply to Statutory Severance',
    'lbl-res-net': 'Net payout after tax',
    'tip-net': '= Total severance + Total PVD − Tax payable',
    'lbl-export-remaining': 'Export Net Payout to Remaining Money',
    'lbl-rmf-opt-title': '🔄 Compare: Cash Lump-Sum vs Transfer to RMF',
    'lbl-rmf-opt-subtitle': 'Tax optimization for PVD members ≥ 5 yrs and age < 55',
    'lbl-opt-lump-title': 'Option A: Take Full Lump Sum',
    'lbl-reset-tax-layout': 'Reset Layout',
    'lbl-panel-sev-inputs': '1. Severance & PVD Inputs',
    'lbl-panel-sev-results': '2. Tax Results & RMF Rollover',
    'lbl-opt-lump-tax-lbl': 'Tax payable (Sec. 48(5)):',
    'lbl-opt-lump-net-lbl': 'Immediate net cash:',
    'lbl-opt-rmf-title': 'Option B: Transfer PVD to RMF',
    'lbl-opt-rmf-tax-lbl': 'Tax payable (severance only):',
    'lbl-opt-rmf-invested-lbl': 'Retained in RMF for growth:',
    'lbl-opt-rmf-total-lbl': 'Total retained net wealth:',
    'lbl-opt-note':
      '💡 <strong>Recommendation:</strong> Rolling over PVD into an RMF for PVD within 30 days keeps 100% of PVD funds tax-exempt, compounding tax-free until age 55 for tax-exempt withdrawals.',
    'lbl-sso-title': '🏥 Social Security Benefits &amp; Pension Simulator',
    'lbl-sso-subtitle': 'Section 33 (Regular Employee), Section 39 (Voluntary), Section 40 (Freelance)',
    'lbl-sso-sec': 'Section (มาตรา)',
    'opt-sso-33': 'Sec. 33 (Regular Employee)',
    'opt-sso-39': 'Sec. 39 (Voluntary Insured)',
    'opt-sso-40': 'Sec. 40 (Freelance / Self-employed)',
    'lbl-sso-wage': 'Avg. wage over last 60 months (THB)',
    'lbl-sso-years': 'Contribution period (Years)',
    'lbl-sso-res-pension': 'Lifetime Monthly Pension:',
    'lbl-sso-res-lump': 'Lump-sum (if < 15 yrs) / 20-Year Total:',
    'lbl-inher-title': '🏛️ Thai Inheritance &amp; Annual Gift Tax Simulator',
    'lbl-inher-subtitle': 'Inheritance Tax Act B.E. 2558 &amp; Revenue Code Sec. 42(26)-(28)',
    lblSubTabInher: 'Inheritance Tax',
    lblSubTabGift: 'Annual Gift Tax',
    lblSubTabStrategy: 'Wealth Transfer',
    lblEstateValue: 'Total Estate Value (THB)',
    lblHeirRel: 'Heir Relationship to Testator',
    optHeirChild: 'Ascendant / Descendant (5% tax on excess > 100M)',
    optHeirSpouse: 'Legally Registered Spouse (100% Tax-Exempt)',
    optHeirOther: 'Other Relatives / Beneficiaries (10% tax on excess > 100M)',
    lblHeirCount: 'Number of Equal Heirs',
    lblCardInherPortion: 'Portion per Heir:',
    lblCardInherTax: 'Total Inheritance Tax:',
    lblGiftType: 'Lifetime Gift Category',
    optGiftMovable: 'Sec. 42(27) Family cash / movable gift (Exempt 20M/yr)',
    optGiftRealestate: 'Sec. 42(26) Parent giving real estate to child (Exempt 20M/yr)',
    optGiftOther: 'Sec. 42(28) Other customary / moral gifts (Exempt 10M/yr)',
    lblAnnualGiftValue: 'Annual Gift Value in Tax Year (THB)',
    lblCardGiftExempt: 'Annual Statutory Exemption:',
    lblCardGiftTax: 'Gift Tax (5% Final Tax):',
    lblStrategyYears: 'Planned Lifetime Gifting Horizon (Years)',
    lblStrategyOptATitle: 'Option 1: Lump-Sum Inheritance',
    lblStrategyTaxALbl: 'Inheritance Tax Payable:',
    lblStrategyNetALbl: 'Net Wealth Received by Heirs:',
    lblStrategyOptBTitle: 'Option 2: Phased Gifting + Inheritance',
    lblStrategyGiftsBLbl: 'Total Tax-Free Gifts:',
    lblStrategyTaxBLbl: 'Tax on Residual Inheritance:',
    lblStrategySavingsTitle: '🎉 Maximum Tax Savings:',
    lblInherLawTitle: 'Statutory Legal Reference:',
    txtInherLawDesc:
      'The Inheritance Tax Act B.E. 2558 exempts the first 100M THB per heir. Excess is taxed at 5% for parents/children or 10% for others. Spouses are 100% exempt. Form P.M.1 must be filed within 150 days.',
    'lbl-land-title': '🏡 Thai Land &amp; Building Tax Simulator',
    'lbl-land-subtitle': 'Land &amp; Building Tax Act B.E. 2562 (Appraisal Value Based)',
    lblLandCategory: 'Land / Building Usage Category',
    optLandResPrimary: 'Primary Residence (Land & House with name in registry - Exempt 50M)',
    optLandResBldg: 'Primary Building Only (House with name in registry on leased land - Exempt 10M)',
    optLandResSecondary: 'Secondary Residence / Investment Condo (Taxed from 1st Baht)',
    optLandAgri: 'Agricultural (Individual owner exempt first 50M THB)',
    optLandComm: 'Commercial / Industrial / Other (0.3% - 0.7%)',
    optLandVacant: 'Vacant / Unused Land (+0.3% penalty every 3 yrs)',
    lblLandAppraisal: 'Treasury Dept Appraisal Value (THB)',
    lblVacantYears: 'Consecutive Years Left Vacant (Years)',
    txtVacantRule:
      '* If left vacant for 3+ consecutive years, tax increases by +0.3% every 3 years up to a maximum 3.0% cap',
    lblCardLandTaxableBase: 'Taxable Base Amount:',
    lblCardLandTotalTax: 'Annual Land & Building Tax:',
    lblLandInstallmentTitle: '💳 3-Month Installment Option (0% Interest):',
    txtLandInstallmentDesc:
      'Tax liabilities >= 3,000 THB can be paid in 3 equal monthly installments (April, May, June)',
    lblLandTiersHeader: 'Statutory Progressive Brackets Breakdown:',
    lblLandLawTitle: 'Statutory Legal Reference:',
    txtLandLawDesc:
      'Administered by Local Admin Orgs (BMA, Pattaya, Municipalities, SAO) based on Treasury Dept appraisal value (not market price). Tax notices (P.D.S. 6/7) issued Feb–Mar, payment due April 30 annually.',
  };
  Object.keys(EN).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = EN[id];
  });
  const bracketSelect = document.getElementById('tenureBracket');
  if (bracketSelect) {
    const enBrackets = [
      '< 120 days (0 days)',
      '120 days – < 1 yr (30 days / 1 mo)',
      '1 yr – < 3 yrs (90 days / 3 mos)',
      '3 yrs – < 6 yrs (180 days / 6 mos)',
      '6 yrs – < 10 yrs (240 days / 8 mos)',
      '10 yrs – < 20 yrs (300 days / 10 mos)',
      '≥ 20 yrs (400 days / 13.33 mos)',
    ];
    Array.from(bracketSelect.options).forEach((opt, idx) => {
      if (enBrackets[idx]) opt.textContent = enBrackets[idx];
    });
  }
  document.getElementById('tab0').innerHTML = 'Member<br>&lt; 5 yrs';
  document.getElementById('tab1').innerHTML = '≥ 5 yrs<br>age &lt; 55';
  document.getElementById('tab2').innerHTML = '≥ 5 yrs<br>age ≥ 55';
}

let activeTab = 0;

const condNotes = {
  th: [
    'สมาชิก PVD <strong>น้อยกว่า 5 ปี</strong> — PVD ส่วนที่ต้องเสียภาษีถูกนำมาคิดแบบปกติ ไม่ได้รับสิทธิ์หักค่าใช้จ่ายพิเศษ',
    'สมาชิก PVD <strong>5 ปีขึ้นไป อายุน้อยกว่า 55 ปี</strong> — ได้รับสิทธิ์คำนวณแบบพิเศษ (มาตรา 48(5)) แยกจากเงินได้อื่น',
    'สมาชิก PVD <strong>5 ปีขึ้นไป และอายุ 55 ปีบริบูรณ์ขึ้นไป</strong> — PVD ได้รับ<strong>ยกเว้นภาษีทั้งหมด</strong> คำนวณภาษีเฉพาะเงินชดเชยส่วนเกิน',
  ],
  en: [
    'PVD member <strong>less than 5 years</strong> — the taxable PVD portion is taxed normally, with no special expense deduction.',
    'PVD member <strong>5+ years, age under 55</strong> — eligible for the special calculation (Section 48(5)), separate from other income.',
    'PVD member <strong>5+ years and age 55 or over</strong> — PVD is <strong>fully tax-exempt</strong>; tax is calculated only on excess severance.',
  ],
};

const pvdTaxableIds = ['pvdEmpReturn', 'pvdEmrContrib', 'pvdEmrReturn'];
const pvdBadgeIds = ['badge2', 'badge3', 'badge4'];

function setTab(n) {
  activeTab = n;
  document.querySelectorAll('.tab').forEach((t, i) => {
    const isActive = i === n;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  document.getElementById('condNote').innerHTML = (condNotes[LANG] || condNotes.th)[n];

  const pvdExempt = n === 2;
  pvdTaxableIds.forEach((id) => {
    document.getElementById(id).classList.toggle('dimmed', pvdExempt);
  });
  pvdBadgeIds.forEach((id) => {
    const el = document.getElementById(id);
    if (pvdExempt) {
      el.textContent = LANG === 'en' ? 'Exempt' : 'ยกเว้นภาษี';
      el.className = 'badge-exempt';
    } else {
      el.textContent = LANG === 'en' ? 'Taxable' : 'ต้องเสียภาษี';
      el.className = 'badge-taxable';
    }
  });

  document.getElementById('results').classList.remove('show');
  const rmfOptEl = document.getElementById('rmf-optimizer-card');
  if (rmfOptEl) rmfOptEl.style.display = 'none';
  document.getElementById('errorMsg').style.display = 'none';
}

// Sync the default tab's condition note and PVD badges to the current language —
// setTab() is otherwise only called on click, so without this the initial badges
// (badge2/3/4) stay in whatever language was hardcoded in the markup (Thai).
setTab(0);

function fmt(n) {
  return (
    n.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
    ' ' +
    unit
  );
}

// Standard PIT progressive rates (with 0-150k @ 0% exemption) for Tab 0 (< 5 years)
function progressiveTaxPIT(income) {
  if (income <= 0) return 0;
  if (income <= 150000) return 0;
  if (income <= 300000) return (income - 150000) * 0.05;
  if (income <= 500000) return 150000 * 0.05 + (income - 300000) * 0.1;
  if (income <= 750000) return 150000 * 0.05 + 200000 * 0.1 + (income - 500000) * 0.15;
  if (income <= 1000000) return 150000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + (income - 750000) * 0.2;
  if (income <= 2000000) return 150000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + (income - 1000000) * 0.25;
  if (income <= 5000000)
    return 150000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + 1000000 * 0.25 + (income - 2000000) * 0.3;
  return (
    150000 * 0.05 +
    200000 * 0.1 +
    250000 * 0.15 +
    250000 * 0.2 +
    1000000 * 0.25 +
    3000000 * 0.3 +
    (income - 5000000) * 0.35
  );
}

// Section 48(5) separate calculation rates (no 0-150k exemption; starts at 5% from 0 to 300k)
function progressiveTax48_5(income) {
  if (income <= 0) return 0;
  if (income <= 300000) return income * 0.05;
  if (income <= 500000) return 300000 * 0.05 + (income - 300000) * 0.1;
  if (income <= 750000) return 300000 * 0.05 + 200000 * 0.1 + (income - 500000) * 0.15;
  if (income <= 1000000) return 300000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + (income - 750000) * 0.2;
  if (income <= 2000000) return 300000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + (income - 1000000) * 0.25;
  if (income <= 5000000)
    return 300000 * 0.05 + 200000 * 0.1 + 250000 * 0.15 + 250000 * 0.2 + 1000000 * 0.25 + (income - 2000000) * 0.3;
  return (
    300000 * 0.05 +
    200000 * 0.1 +
    250000 * 0.15 +
    250000 * 0.2 +
    1000000 * 0.25 +
    3000000 * 0.3 +
    (income - 5000000) * 0.35
  );
}

const STORAGE_KEY = 'moneySuperapp.pvdTax';
const inputIds = [
  'severanceLegal',
  'severanceExtra',
  'pvdEmpContrib',
  'pvdEmpReturn',
  'pvdEmrContrib',
  'pvdEmrReturn',
  'years',
  'lastMonthlyWage',
  'tenureBracket',
];

function getSeveranceDays(bracket) {
  switch (String(bracket)) {
    case '0':
      return 0;
    case '1':
      return 30;
    case '2':
      return 90;
    case '3':
      return 180;
    case '4':
      return 240;
    case '5':
      return 300;
    case '6':
      return 400;
    default:
      return 0;
  }
}

function calculateSeveranceAmount(wage, bracket) {
  const days = getSeveranceDays(bracket);
  if (days === 0) return 0;
  if (days === 30) return wage * 1;
  if (days === 90) return wage * 3;
  if (days === 180) return wage * 6;
  if (days === 240) return wage * 8;
  if (days === 300) return wage * 10;
  if (days === 400) return Math.round((wage / 30) * 400 * 100) / 100;
  return 0;
}

function updateSeveranceCalc() {
  const wage = parseFloat(document.getElementById('lastMonthlyWage').value) || 0;
  const bracket = document.getElementById('tenureBracket').value;
  const days = getSeveranceDays(bracket);
  const amount = calculateSeveranceAmount(wage, bracket);
  const previewEl = document.getElementById('sev-calc-preview');
  if (previewEl) {
    previewEl.textContent = fmt(amount) + ` (${days} ` + (LANG === 'en' ? 'days' : 'วัน') + `)`;
  }
  return amount;
}

function applySeveranceCalc() {
  const amount = updateSeveranceCalc();
  document.getElementById('severanceLegal').value = amount > 0 ? amount : '';
  saveState();
  if (parseFloat(document.getElementById('years').value) > 0) {
    calculate();
  }
}

function syncBracketFromYears(yrs) {
  const bracketEl = document.getElementById('tenureBracket');
  if (!bracketEl) return;
  if (yrs >= 20) bracketEl.value = '6';
  else if (yrs >= 10) bracketEl.value = '5';
  else if (yrs >= 6) bracketEl.value = '4';
  else if (yrs >= 3) bracketEl.value = '3';
  else if (yrs >= 1) bracketEl.value = '2';
  else if (yrs >= 0.33) bracketEl.value = '1';
  else bracketEl.value = '0';
  updateSeveranceCalc();
}

function toggleSeveranceCalc() {
  const panel = document.getElementById('severance-calc-panel');
  const isHidden = panel.style.display === 'none';
  panel.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    const yrs = parseFloat(document.getElementById('years').value);
    if (!Number.isNaN(yrs) && yrs > 0) {
      syncBracketFromYears(yrs);
    }
    if (!document.getElementById('lastMonthlyWage').value) {
      try {
        const base = JSON.parse(localStorage.getItem('moneySuperapp.taxBase') || '{}');
        const slip = JSON.parse(localStorage.getItem('moneySuperapp.monthsSlips') || '{}');
        const defaultWage = base.salary || slip.salary;
        if (defaultWage) {
          document.getElementById('lastMonthlyWage').value = defaultWage;
        }
      } catch (_e) {}
    }
    updateSeveranceCalc();
  }
}

function saveState() {
  const data = { activeTab };
  inputIds.forEach((id) => {
    data[id] = document.getElementById(id).value;
  });
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {}
}

function calculate() {
  const severanceLegal = parseFloat(document.getElementById('severanceLegal').value) || 0;
  const severanceExtra = parseFloat(document.getElementById('severanceExtra').value) || 0;
  const pvdEmpReturn = parseFloat(document.getElementById('pvdEmpReturn').value) || 0;
  const pvdEmrContrib = parseFloat(document.getElementById('pvdEmrContrib').value) || 0;
  const pvdEmrReturn = parseFloat(document.getElementById('pvdEmrReturn').value) || 0;
  const years = parseFloat(document.getElementById('years').value) || 0;

  const errorEl = document.getElementById('errorMsg');
  if (years <= 0) {
    errorEl.textContent = LANG === 'en' ? 'Please enter years of service' : 'กรุณากรอกจำนวนปีที่ทำงาน';
    errorEl.style.display = 'block';
    return;
  }
  errorEl.style.display = 'none';

  saveState();

  const legalExcess = Math.max(0, severanceLegal - 600000);
  const pvdTaxable = pvdEmpReturn + pvdEmrContrib + pvdEmrReturn;
  const totalExcess = legalExcess + severanceExtra;

  let taxable,
    tax,
    pvdDisplay,
    pvdClass = '';

  const tipTaxable = {
    th: [
      '= เงินชดเชยส่วนเกิน + เงินชดเชยพิเศษ + PVD ส่วนที่ต้องเสียภาษี<br>(ไม่มีสิทธิ์หักค่าใช้จ่ายพิเศษตาม ม.48(5))',
      '= (เงินชดเชยส่วนเกิน + PVD − ค่าใช้จ่าย) × 0.5<br>ค่าใช้จ่าย = 7,000 × จำนวนปีที่ทำงาน',
      '= (เงินชดเชยส่วนเกิน − ค่าใช้จ่าย) × 0.5<br>PVD ได้รับยกเว้นภาษีทั้งหมด',
    ],
    en: [
      '= excess severance + extra severance + taxable PVD<br>(no special expense deduction under Sec. 48(5))',
      '= (excess severance + PVD − expense) × 0.5<br>expense = 7,000 × years of service',
      '= (excess severance − expense) × 0.5<br>PVD is fully tax-exempt',
    ],
  };

  const tipTax = {
    th: [
      'อัตราภาษีเงินได้บุคคลธรรมดาปกติ (รวมส่วนยกเว้น 0–150,000 บาทแรก 0%)<br>0–150k: 0% / 150k–300k: 5%<br>300k–500k: 10% / 500k–750k: 15%<br>750k–1M: 20% / 1M–2M: 25%<br>2M–5M: 30% / >5M: 35%',
      'อัตราภาษีแยกคำนวณตามมาตรา 48(5)<br><strong>ไม่ได้รับยกเว้น 150,000 บาทแรก</strong><br>0–300k: 5% / 300k–500k: 10%<br>500k–750k: 15% / 750k–1M: 20%<br>1M–2M: 25% / 2M–5M: 30% / >5M: 35%',
      'อัตราภาษีแยกคำนวณตามมาตรา 48(5)<br><strong>ไม่ได้รับยกเว้น 150,000 บาทแรก</strong><br>0–300k: 5% / 300k–500k: 10%<br>500k–750k: 15% / 750k–1M: 20%<br>1M–2M: 25% / 2M–5M: 30% / >5M: 35%',
    ],
    en: [
      'Standard progressive PIT brackets (with 0-150k @ 0% exemption)<br>0–150k: 0% / 150k–300k: 5%<br>300k–500k: 10% / 500k–750k: 15%<br>750k–1M: 20% / 1M–2M: 25%<br>2M–5M: 30% / >5M: 35%',
      'Section 48(5) separate calculation rates<br><strong>(No 150,000 THB initial exemption)</strong><br>0–300k: 5% / 300k–500k: 10%<br>500k–750k: 15% / 750k–1M: 20%<br>1M–2M: 25% / 2M–5M: 30% / >5M: 35%',
      'Section 48(5) separate calculation rates<br><strong>(No 150,000 THB initial exemption)</strong><br>0–300k: 5% / 300k–500k: 10%<br>500k–750k: 15% / 750k–1M: 20%<br>1M–2M: 25% / 2M–5M: 30% / >5M: 35%',
    ],
  };

  const exemptLabel = LANG === 'en' ? 'Exempt' : 'ยกเว้นภาษี';

  if (activeTab === 0) {
    // Tab 0: member < 5 yrs; totalExcess (legalExcess + severanceExtra) and taxable PVD are taxed at regular rates
    taxable = pvdTaxable + totalExcess;
    tax = progressiveTaxPIT(taxable);
    pvdDisplay = fmt(pvdTaxable);
    document.getElementById('tip-taxable').innerHTML = (tipTaxable[LANG] || tipTaxable.th)[0];
    document.getElementById('tip-tax').innerHTML = (tipTax[LANG] || tipTax.th)[0];
  } else if (activeTab === 1) {
    // Tab 1: >= 5 yrs, age < 55; Section 48(5) separate calculation
    taxable = Math.max(0, (totalExcess + pvdTaxable - 7000 * years) * 0.5);
    tax = progressiveTax48_5(taxable);
    pvdDisplay = fmt(pvdTaxable);
    document.getElementById('tip-taxable').innerHTML = (tipTaxable[LANG] || tipTaxable.th)[1];
    document.getElementById('tip-tax').innerHTML = (tipTax[LANG] || tipTax.th)[1];
  } else {
    // Tab 2: >= 5 yrs, age >= 55; PVD is fully exempt; severance excess taxed under Sec. 48(5)
    taxable = Math.max(0, (totalExcess - 7000 * years) * 0.5);
    tax = progressiveTax48_5(taxable);
    pvdDisplay = exemptLabel;
    pvdClass = 'exempt-badge';
    document.getElementById('tip-taxable').innerHTML = (tipTaxable[LANG] || tipTaxable.th)[2];
    document.getElementById('tip-tax').innerHTML = (tipTax[LANG] || tipTax.th)[2];
  }

  document.getElementById('res-legal-excess').textContent = fmt(legalExcess);
  document.getElementById('res-extra').textContent = fmt(severanceExtra);
  const pvdEl = document.getElementById('res-pvd');
  pvdEl.textContent = pvdDisplay;
  pvdEl.className = 'result-value' + (pvdClass ? ' ' + pvdClass : '');
  document.getElementById('res-taxable').textContent = fmt(taxable);
  document.getElementById('res-tax').textContent = fmt(tax);

  const pvdEmpContrib = parseFloat(document.getElementById('pvdEmpContrib').value) || 0;
  const totalGrossPayout =
    severanceLegal + severanceExtra + pvdEmpContrib + pvdEmpReturn + pvdEmrContrib + pvdEmrReturn;
  const netPayout = Math.max(0, totalGrossPayout - tax);
  currentNetPayout = netPayout;
  document.getElementById('res-net').textContent = fmt(netPayout);

  const rmfOptEl = document.getElementById('rmf-optimizer-card');
  if (activeTab === 1 && pvdTaxable > 0) {
    const lumpTax = tax;
    const lumpNet = netPayout;
    const rmfTaxable = Math.max(0, (totalExcess - 7000 * years) * 0.5);
    const rmfTax = progressiveTax48_5(rmfTaxable);
    const rmfInvested = pvdEmpContrib + pvdTaxable;
    const rmfImmediateCash = Math.max(0, severanceLegal + severanceExtra - rmfTax);
    const rmfTotalWealth = rmfImmediateCash + rmfInvested;
    const taxSaved = Math.max(0, lumpTax - rmfTax);

    document.getElementById('opt-lump-tax').textContent = fmt(lumpTax);
    document.getElementById('opt-lump-net').textContent = fmt(lumpNet);
    document.getElementById('opt-rmf-tax').textContent = fmt(rmfTax);
    document.getElementById('opt-rmf-invested').textContent = fmt(rmfInvested);
    document.getElementById('opt-rmf-total').textContent = fmt(rmfTotalWealth);

    const badgeEl = document.getElementById('opt-savings-badge');
    if (taxSaved > 0) {
      badgeEl.textContent = (LANG === 'en' ? 'Save ' : 'ประหยัดภาษี ') + fmt(taxSaved);
    } else {
      badgeEl.textContent = LANG === 'en' ? 'Equal Tax' : 'ภาษีเท่ากัน';
    }
    if (rmfOptEl) rmfOptEl.style.display = 'block';
  } else if (rmfOptEl) {
    rmfOptEl.style.display = 'none';
  }

  document.getElementById('results').classList.add('show');
}

let currentNetPayout = 0;

function exportPayoutToRemaining() {
  if (currentNetPayout <= 0) return;
  const lump = {
    name: LANG === 'en' ? 'Net Severance & PVD Payout' : 'เงินชดเชยและ PVD สุทธิ',
    value: Math.round(currentNetPayout),
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem('moneySuperapp.pendingLumpSum', JSON.stringify(lump));
  } catch (_e) {}
  if (window.parent && typeof window.parent.switchToTab === 'function') {
    window.parent.switchToTab('remaining-money');
  } else {
    window.parent.postMessage({ action: 'switchToTab', target: 'remaining-money' }, '*');
  }
}

function reset() {
  currentNetPayout = 0;
  inputIds.forEach((id) => {
    document.getElementById(id).value = '';
  });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_e) {}
  document.getElementById('results').classList.remove('show');
  const rmfOptEl = document.getElementById('rmf-optimizer-card');
  if (rmfOptEl) rmfOptEl.style.display = 'none';
  document.getElementById('errorMsg').style.display = 'none';
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (typeof data.activeTab === 'number' && data.activeTab >= 0 && data.activeTab <= 2) {
      setTab(data.activeTab);
    }
    inputIds.forEach((id) => {
      if (data[id] !== undefined && data[id] !== '') {
        document.getElementById(id).value = data[id];
      }
    });
    if (parseFloat(document.getElementById('years').value) > 0) {
      calculate();
    }
  } catch (_e) {}
}

inputIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => saveState());
    el.addEventListener('change', () => saveState());
  }
});

document.getElementById('years').addEventListener('input', (e) => {
  const yrs = parseFloat(e.target.value);
  if (!Number.isNaN(yrs) && yrs > 0) {
    syncBracketFromYears(yrs);
  }
});

function toggleSsoSimulator() {
  const panel = document.getElementById('sso-panel-body');
  const arrow = document.getElementById('sso-toggle-arrow');
  const btn = document.getElementById('btn-toggle-sso');
  if (!panel) return;
  const isHidden = panel.style.display === 'none';
  panel.style.display = isHidden ? 'block' : 'none';
  if (arrow) arrow.textContent = isHidden ? '▲' : '▼';
  if (btn) btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
  if (isHidden) {
    calculateSsoBenefits();
  }
}

function onSsoSectionChange() {
  const sec = document.getElementById('ssoSectionSelect')?.value || '33';
  const wageGroup = document.getElementById('ssoWageGroup');
  const wageInput = document.getElementById('txtSsoWage');
  if (sec === '39') {
    if (wageInput) wageInput.value = 4800;
    if (wageGroup) wageGroup.style.display = 'block';
  } else if (sec === '40') {
    if (wageGroup) wageGroup.style.display = 'none';
  } else {
    if (wageGroup) wageGroup.style.display = 'block';
    if (wageInput && (wageInput.value === '4800' || !wageInput.value)) wageInput.value = 15000;
  }
  calculateSsoBenefits();
}

function calculateSocialSecurityPensionAndBenefits({
  section = '33',
  wage = 15000,
  contributionYears = 20,
  section40Option = 2,
}) {
  const yrs = Math.max(0, Number(contributionYears) || 0);
  const totalMonths = Math.round(yrs * 12);
  let effectiveWage = 0;
  let pensionEligible = false;
  let pensionMonthly = 0;
  let pensionRatePct = 0;
  let lumpSumEstimate = 0;

  if (section === '33') {
    effectiveWage = Math.min(15000, Math.max(1650, Number(wage) || 15000));
    if (totalMonths >= 180) {
      pensionEligible = true;
      const extraYears = Math.floor((totalMonths - 180) / 12);
      pensionRatePct = 20.0 + extraYears * 1.5;
      pensionMonthly = Math.round((pensionRatePct / 100) * effectiveWage * 100) / 100;
    } else {
      pensionEligible = false;
      lumpSumEstimate = Math.round(effectiveWage * 0.06 * totalMonths * 100) / 100;
    }
  } else if (section === '39') {
    effectiveWage = 4800;
    if (totalMonths >= 180) {
      pensionEligible = true;
      const extraYears = Math.floor((totalMonths - 180) / 12);
      pensionRatePct = 20.0 + extraYears * 1.5;
      pensionMonthly = Math.round((pensionRatePct / 100) * effectiveWage * 100) / 100;
    } else {
      pensionEligible = false;
      lumpSumEstimate = Math.round(effectiveWage * 0.06 * totalMonths * 100) / 100;
    }
  } else if (section === '40') {
    const monthlySaving = section40Option === 3 ? 200 : section40Option === 2 ? 50 : 0;
    pensionEligible = false;
    lumpSumEstimate = monthlySaving * totalMonths;
    pensionMonthly = 0;
    pensionRatePct = 0;
  }

  const unemploymentVoluntaryMonthly = section === '33' ? Math.round(effectiveWage * 0.3) : 0;
  const unemploymentInvoluntaryMonthly = section === '33' ? Math.round(effectiveWage * 0.5) : 0;
  const maternityLumpSum = section === '33' || section === '39' ? 15000 : 0;
  const maternityLeaveAllowance = section === '33' ? Math.round(effectiveWage * 0.5 * (90 / 30)) : 0;
  const childSupportMonthly = section === '33' || section === '39' ? 800 : 0;

  const cumulativeAt10Yrs = Math.round(pensionMonthly * 12 * 10);
  const cumulativeAt20Yrs = Math.round(pensionMonthly * 12 * 20);
  const cumulativeAt30Yrs = Math.round(pensionMonthly * 12 * 30);

  return {
    section,
    effectiveWage,
    contributionYears: yrs,
    contributionMonths: totalMonths,
    pensionEligible,
    pensionRatePct,
    pensionMonthly,
    lumpSumEstimate,
    cumulativeAt10Yrs,
    cumulativeAt20Yrs,
    cumulativeAt30Yrs,
    unemploymentVoluntaryMonthly,
    unemploymentInvoluntaryMonthly,
    maternityLumpSum,
    maternityLeaveAllowance,
    childSupportMonthly,
  };
}

function calculateSsoBenefits() {
  const sec = document.getElementById('ssoSectionSelect')?.value || '33';
  const wage = parseFloat(document.getElementById('txtSsoWage')?.value || '15000');
  const years = parseFloat(document.getElementById('txtSsoYears')?.value || '20');

  const res = calculateSocialSecurityPensionAndBenefits({
    section: sec,
    wage: wage,
    contributionYears: years,
  });

  const pensionEl = document.getElementById('valSsoPension');
  const formulaEl = document.getElementById('valSsoPensionFormula');
  const cumulativeEl = document.getElementById('valSsoCumulative');
  const cumDescEl = document.getElementById('valSsoCumulativeDesc');
  const badgeEl = document.getElementById('ssoStatutoryAllowances');

  const isEn = LANG === 'en';

  if (pensionEl) {
    pensionEl.textContent = res.pensionEligible
      ? `${formatMoney(res.pensionMonthly, 2)} ${isEn ? 'THB/month' : 'บาท/เดือน'}`
      : isEn
        ? 'Not eligible for monthly pension (< 15 years contributed)'
        : 'ยังไม่เข้าเกณฑ์บำนาญ (ส่ง < 15 ปี)';
  }

  if (formulaEl) {
    if (res.pensionEligible) {
      const extraYrs = Math.max(0, Math.floor(res.contributionYears - 15));
      formulaEl.textContent = isEn
        ? `Rate ${res.pensionRatePct.toFixed(1)}% (Base 20% + ${(extraYrs * 1.5).toFixed(1)}% from ${extraYrs} extra years)`
        : `อัตรา ${res.pensionRatePct.toFixed(1)}% (ฐาน 20% + เพิ่ม ${(extraYrs * 1.5).toFixed(1)}% จาก ${extraYrs} ปีส่วนเกิน)`;
    } else {
      formulaEl.textContent = isEn
        ? `Contributed ${res.contributionMonths} months (${Math.max(0, 180 - res.contributionMonths)} months remaining for monthly pension)`
        : `ส่งแล้ว ${res.contributionMonths} เดือน (ขาดอีก ${Math.max(0, 180 - res.contributionMonths)} เดือนเพื่อรับบำนาญรายเดือน)`;
    }
  }

  if (cumulativeEl) {
    cumulativeEl.textContent = res.pensionEligible
      ? `${formatMoney(res.cumulativeAt20Yrs, 2)} ${isEn ? 'THB' : 'บาท'}`
      : `${formatMoney(res.lumpSumEstimate, 2)} ${isEn ? 'THB (Lump Sum)' : 'บาท (บำเหน็จ)'}`;
  }

  if (cumDescEl) {
    cumDescEl.textContent = res.pensionEligible
      ? isEn
        ? 'Estimated 20-year cumulative pension payout after retirement'
        : 'ประมาณการรับบำนาญสะสมรวม 20 ปีหลังเกษียณ'
      : isEn
        ? 'One-time lump-sum retirement refund (Employee + Employer contributions)'
        : 'เงินออมชราภาพบำเหน็จก้อนเดียว (เงินสะสมผู้ประกันตน + นายจ้าง)';
  }

  if (badgeEl) {
    if (sec === '33') {
      badgeEl.innerHTML = isEn
        ? `🛡️ <strong>Other Sec. 33 Statutory Benefits:</strong> Voluntary resignation <strong>${formatMoney(res.unemploymentVoluntaryMonthly)} THB/mo</strong> (3 mos) • Layoff <strong>${formatMoney(res.unemploymentInvoluntaryMonthly)} THB/mo</strong> (6 mos) • Maternity <strong>${formatMoney(res.maternityLumpSum)} THB</strong> + leave allowance <strong>${formatMoney(res.maternityLeaveAllowance)} THB</strong> • Child support <strong>${formatMoney(res.childSupportMonthly)} THB/mo</strong> (up to age 6)`
        : `🛡️ <strong>สิทธิประโยชน์อื่นๆ ม.33:</strong> ว่างงานลาออกรับ <strong>${formatMoney(res.unemploymentVoluntaryMonthly)} บ./ด.</strong> (3 ด.) • เลิกจ้างรับ <strong>${formatMoney(res.unemploymentInvoluntaryMonthly)} บ./ด.</strong> (6 ด.) • คลอดบุตร <strong>${formatMoney(res.maternityLumpSum)} บ.</strong> + ค่าหยุดงาน <strong>${formatMoney(res.maternityLeaveAllowance)} บ.</strong> • สงเคราะห์บุตร <strong>${formatMoney(res.childSupportMonthly)} บ./ด.</strong> (จนถึง 6 ปี)`;
    } else if (sec === '39') {
      badgeEl.innerHTML = isEn
        ? `🛡️ <strong>Other Sec. 39 Statutory Benefits:</strong> Free healthcare • Maternity <strong>${formatMoney(res.maternityLumpSum)} THB</strong> • Child support <strong>${formatMoney(res.childSupportMonthly)} THB/mo</strong> (up to age 6) • Disability and death benefits per regulations`
        : `🛡️ <strong>สิทธิประโยชน์อื่นๆ ม.39:</strong> รักษาพยาบาลฟรี • คลอดบุตร <strong>${formatMoney(res.maternityLumpSum)} บ.</strong> • สงเคราะห์บุตร <strong>${formatMoney(res.childSupportMonthly)} บ./ด.</strong> (จนถึง 6 ปี) • ทุพพลภาพและเสียชีวิตตามเกณฑ์`;
    } else {
      badgeEl.innerHTML = isEn
        ? `🛡️ <strong>Other Sec. 40 Statutory Benefits:</strong> Sickness/hospitalization income compensation • Funeral allowance • Old-age lump-sum payout at age 60`
        : `🛡️ <strong>สิทธิประโยชน์อื่นๆ ม.40:</strong> เงินทดแทนการขาดรายได้เมื่อเจ็บป่วย/นอน รพ. • ค่าทำศพ • เงินออมชราภาพบำเหน็จเมื่ออายุครบ 60 ปี`;
    }
  }
}

// ==========================================
// Thai Inheritance & Annual Gift Tax Simulator
// ==========================================

const INHER_STORAGE_KEY = 'moneySuperapp.inheritanceTax.state.v1';

let inherState = {
  estateValue: 160000000,
  heirRelationship: 'ascendant_descendant',
  numberOfHeirs: 1,
  giftType: 'family_movable',
  annualGiftValue: 25000000,
  giftingYears: 3,
  activeSubTab: 'inher',
  isExpanded: false,
};

function toggleInheritanceTaxCard() {
  const panel = document.getElementById('inher-panel-body');
  const arrow = document.getElementById('inher-toggle-arrow');
  const btn = document.getElementById('btn-toggle-inher');
  if (!panel || !arrow) return;

  const willShow = panel.style.display === 'none';
  panel.style.display = willShow ? 'block' : 'none';
  arrow.textContent = willShow ? '▲' : '▼';
  if (btn) btn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
  inherState.isExpanded = willShow;
  saveInherState();
  if (willShow) {
    updateInheritanceTaxUI();
  }
}

function setInherSubTab(tab) {
  inherState.activeSubTab = tab;
  ['inher', 'gift', 'strategy'].forEach((t) => {
    const subpanel = document.getElementById(`subpanel-${t}`);
    const tabBtn = document.getElementById(`btnSubTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (subpanel) subpanel.style.display = t === tab ? 'block' : 'none';
    if (tabBtn) tabBtn.classList.toggle('active', t === tab);
  });
  saveInherState();
  updateInheritanceTaxUI();
}

function setEstatePreset(val) {
  const inp = document.getElementById('txtEstateValue');
  if (inp) {
    inp.value = val;
    updateInheritanceTaxUI();
  }
}

function loadInherState() {
  try {
    const saved = MoneyApp.safeJsonParse(INHER_STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      inherState = Object.assign({}, inherState, saved);
    }
  } catch (_e) {}
}

function saveInherState() {
  try {
    localStorage.setItem(INHER_STORAGE_KEY, JSON.stringify(inherState));
  } catch (_e) {}
}

function updateInheritanceTaxUI() {
  const estateValEl = document.getElementById('txtEstateValue');
  const heirRelEl = document.getElementById('selHeirRel');
  const heirCountEl = document.getElementById('txtHeirCount');
  const giftTypeEl = document.getElementById('selGiftType');
  const giftValEl = document.getElementById('txtAnnualGiftValue');
  const stratYearsEl = document.getElementById('txtStrategyYears');

  const estateValue = parseFloat(estateValEl?.value) || 0;
  const heirRel = heirRelEl?.value || 'ascendant_descendant';
  const heirCount = parseInt(heirCountEl?.value, 10) || 1;
  const giftType = giftTypeEl?.value || 'family_movable';
  const annualGiftValue = parseFloat(giftValEl?.value) || 0;
  const giftingYears = parseInt(stratYearsEl?.value, 10) || 3;

  inherState.estateValue = estateValue;
  inherState.heirRelationship = heirRel;
  inherState.numberOfHeirs = heirCount;
  inherState.giftType = giftType;
  inherState.annualGiftValue = annualGiftValue;
  inherState.giftingYears = giftingYears;

  const res = MoneyApp.calculateThaiInheritanceAndGiftTax({
    estateValue: estateValue,
    heirRelationship: heirRel,
    numberOfHeirs: heirCount,
    annualGiftValue: annualGiftValue,
    giftType: giftType,
    giftingYears: giftingYears,
  });

  const isEn = LANG === 'en';
  const unitStr = isEn ? 'THB' : 'บาท';

  // 1. Inheritance outputs
  const valPortionEl = document.getElementById('valInherPortion');
  const valExemptEl = document.getElementById('valInherExempt');
  const valTotalTaxEl = document.getElementById('valInherTotalTax');
  const valNetEl = document.getElementById('valInherNet');

  if (valPortionEl) valPortionEl.textContent = `${formatMoney(res.portionPerHeir, 2)} ${unitStr}`;
  if (valExemptEl) {
    if (res.heirRelationship === 'spouse') {
      valExemptEl.textContent = isEn ? 'Spouse 100% Tax-Exempt' : 'คู่สมรสยกเว้นภาษี 100%';
    } else {
      valExemptEl.textContent = isEn
        ? `Exempt: ${formatMoney(res.exemptionPerHeir, 2)} ${unitStr}`
        : `ยกเว้น: ${formatMoney(res.exemptionPerHeir, 2)} บาท`;
    }
  }
  if (valTotalTaxEl) valTotalTaxEl.textContent = `${formatMoney(res.totalInheritanceTax, 2)} ${unitStr}`;
  if (valNetEl) {
    valNetEl.textContent = isEn
      ? `Net Legacy: ${formatMoney(res.netLegacyReceived, 2)} ${unitStr}`
      : `มรดกสุทธิ: ${formatMoney(res.netLegacyReceived, 2)} บาท`;
  }

  // 2. Gift outputs
  const valGiftExemptEl = document.getElementById('valGiftExempt');
  const valGiftTaxableEl = document.getElementById('valGiftTaxable');
  const valGiftTaxEl = document.getElementById('valGiftTax');
  const valGiftNetEl = document.getElementById('valGiftNet');

  if (valGiftExemptEl) valGiftExemptEl.textContent = `${formatMoney(res.annualGiftExemption, 2)} ${unitStr}`;
  if (valGiftTaxableEl) {
    valGiftTaxableEl.textContent = isEn
      ? `Taxable excess: ${formatMoney(res.taxableAnnualGift, 2)} ${unitStr}`
      : `ส่วนเกินเสียภาษี: ${formatMoney(res.taxableAnnualGift, 2)} บาท`;
  }
  if (valGiftTaxEl) valGiftTaxEl.textContent = `${formatMoney(res.annualGiftTax, 2)} ${unitStr}`;
  if (valGiftNetEl) {
    valGiftNetEl.textContent = isEn
      ? `Net received: ${formatMoney(res.netAnnualGift, 2)} ${unitStr}`
      : `ยอดรับสุทธิ: ${formatMoney(res.netAnnualGift, 2)} บาท`;
  }

  // 3. Strategy outputs
  const valTaxAEl = document.getElementById('valStrategyTaxA');
  const valNetAEl = document.getElementById('valStrategyNetA');
  const valGiftsBEl = document.getElementById('valStrategyGiftsB');
  const valTaxBEl = document.getElementById('valStrategyTaxB');
  const valSavingsEl = document.getElementById('valStrategySavings');

  if (valTaxAEl) valTaxAEl.textContent = `${formatMoney(res.totalInheritanceTax, 2)} ${unitStr}`;
  if (valNetAEl) valNetAEl.textContent = `${formatMoney(res.netLegacyReceived, 2)} ${unitStr}`;
  if (valGiftsBEl) valGiftsBEl.textContent = `${formatMoney(res.plannedLifetimeGifts, 2)} ${unitStr}`;
  if (valTaxBEl) valTaxBEl.textContent = `${formatMoney(res.strategyTaxOnResidual, 2)} ${unitStr}`;
  if (valSavingsEl) {
    valSavingsEl.textContent = isEn
      ? `${formatMoney(res.strategyTaxSavings, 2)} ${unitStr} (-${res.strategyTaxSavingsPct.toFixed(1)}%)`
      : `${formatMoney(res.strategyTaxSavings, 2)} บาท (ลดลง ${res.strategyTaxSavingsPct.toFixed(1)}%)`;
  }

  saveInherState();
}

function initInheritanceTaxCard() {
  loadInherState();
  const estateValEl = document.getElementById('txtEstateValue');
  const heirRelEl = document.getElementById('selHeirRel');
  const heirCountEl = document.getElementById('txtHeirCount');
  const giftTypeEl = document.getElementById('selGiftType');
  const giftValEl = document.getElementById('txtAnnualGiftValue');
  const stratYearsEl = document.getElementById('txtStrategyYears');

  if (estateValEl && inherState.estateValue != null) estateValEl.value = inherState.estateValue;
  if (heirRelEl && inherState.heirRelationship) heirRelEl.value = inherState.heirRelationship;
  if (heirCountEl && inherState.numberOfHeirs) heirCountEl.value = inherState.numberOfHeirs;
  if (giftTypeEl && inherState.giftType) giftTypeEl.value = inherState.giftType;
  if (giftValEl && inherState.annualGiftValue != null) giftValEl.value = inherState.annualGiftValue;
  if (stratYearsEl && inherState.giftingYears) stratYearsEl.value = inherState.giftingYears;

  if (inherState.activeSubTab) {
    setInherSubTab(inherState.activeSubTab);
  }
  if (inherState.isExpanded) {
    toggleInheritanceTaxCard();
  }
}

// ==========================================
// Thai Land & Building Tax Simulator (Phase 61)
// ==========================================

const LAND_STORAGE_KEY = 'moneySuperapp.landBuildingTax.state.v1';

let landState = {
  landCategory: 'residential_primary',
  appraisalValue: 5000000,
  vacantConsecutiveYears: 0,
  isExpanded: false,
};

function toggleLandTaxCard() {
  const panel = document.getElementById('land-panel-body');
  const arrow = document.getElementById('land-toggle-arrow');
  const btn = document.getElementById('btn-toggle-land');
  if (!panel || !arrow) return;

  const willShow = panel.style.display === 'none';
  panel.style.display = willShow ? 'block' : 'none';
  arrow.textContent = willShow ? '▲' : '▼';
  if (btn) btn.setAttribute('aria-expanded', willShow ? 'true' : 'false');
  landState.isExpanded = willShow;
  saveLandState();
  if (willShow) {
    updateLandTaxUI();
  }
}

function setLandPreset(val) {
  const inp = document.getElementById('txtLandAppraisalValue');
  if (inp) {
    inp.value = val;
    updateLandTaxUI();
  }
}

function loadLandState() {
  try {
    const saved = MoneyApp.safeJsonParse(LAND_STORAGE_KEY, null);
    if (saved && typeof saved === 'object') {
      landState = Object.assign({}, landState, saved);
    }
  } catch (_e) {}
}

function saveLandState() {
  try {
    localStorage.setItem(LAND_STORAGE_KEY, JSON.stringify(landState));
  } catch (_e) {}
}

function updateLandTaxUI() {
  const catEl = document.getElementById('selLandCategory');
  const valEl = document.getElementById('txtLandAppraisalValue');
  const vacantRow = document.getElementById('rowVacantYears');
  const vacantYrsEl = document.getElementById('txtVacantYears');
  const badgeExempt = document.getElementById('badgeLandExemption');
  const badgeVacant = document.getElementById('badgeVacantSurcharge');

  const valTaxableBaseEl = document.getElementById('valLandTaxableBase');
  const valExemptSummaryEl = document.getElementById('valLandExemptSummary');
  const valTotalTaxEl = document.getElementById('valLandTotalTax');
  const valEffectiveRateEl = document.getElementById('valLandEffectiveRate');
  const boxInstallment = document.getElementById('boxLandInstallment');
  const valInstallmentMonthly = document.getElementById('valLandInstallmentMonthly');
  const tiersListEl = document.getElementById('landTaxTiersList');

  const isEn = LANG === 'en';
  const unitStr = isEn ? 'THB' : 'บาท';

  const category = catEl ? catEl.value : landState.landCategory;
  const appraisal = valEl ? parseNum(valEl.value) : landState.appraisalValue;
  const vacantYears = vacantYrsEl ? parseNum(vacantYrsEl.value) : landState.vacantConsecutiveYears;

  landState.landCategory = category;
  landState.appraisalValue = appraisal;
  landState.vacantConsecutiveYears = vacantYears;

  if (vacantRow) {
    vacantRow.style.display = category === 'vacant' ? 'block' : 'none';
  }

  const res = MoneyApp.calculateThaiLandAndBuildingTax({
    landCategory: category,
    appraisalValue: appraisal,
    vacantConsecutiveYears: vacantYears,
  });

  if (badgeExempt) {
    if (res.exemptionAmount > 0) {
      badgeExempt.style.display = 'inline-block';
      badgeExempt.textContent = isEn
        ? `Exempt first ${formatMoney(res.exemptionAmount)} THB`
        : `ยกเว้น ${formatMoney(res.exemptionAmount)} บาท`;
    } else {
      badgeExempt.style.display = 'inline-block';
      badgeExempt.textContent = isEn ? 'No Exemption (0 THB)' : 'ไม่มีสิทธิยกเว้น';
      badgeExempt.style.color = 'var(--ink-dim)';
      badgeExempt.style.borderColor = 'var(--line)';
    }
  }

  if (badgeVacant && category === 'vacant') {
    if (vacantYears >= 3) {
      const periods = Math.floor(vacantYears / 3);
      const surcharge = periods * 0.3;
      badgeVacant.textContent = isEn
        ? `+${surcharge.toFixed(1)}% Vacant Penalty`
        : `+${surcharge.toFixed(1)}% โทษรกร้าง`;
      badgeVacant.style.color = 'var(--danger)';
    } else {
      badgeVacant.textContent = isEn ? 'Standard Rate' : 'อัตราปกติ';
      badgeVacant.style.color = 'var(--ok)';
    }
  }

  if (valTaxableBaseEl) valTaxableBaseEl.textContent = `${formatMoney(res.taxableBase, 2)} ${unitStr}`;
  if (valExemptSummaryEl) {
    valExemptSummaryEl.textContent = isEn
      ? `Exemption: ${formatMoney(res.exemptionAmount, 2)} ${unitStr}`
      : `ยกเว้น: ${formatMoney(res.exemptionAmount, 2)} บาท`;
  }
  if (valTotalTaxEl) {
    valTotalTaxEl.textContent = `${formatMoney(res.totalTax, 2)} ${unitStr}`;
    valTotalTaxEl.style.color = res.totalTax > 0 ? 'var(--accent)' : 'var(--ok)';
  }
  if (valEffectiveRateEl) {
    valEffectiveRateEl.textContent = isEn
      ? `Effective rate: ${res.effectiveRatePct.toFixed(3)}%`
      : `อัตราเฉลี่ย: ${res.effectiveRatePct.toFixed(3)}%`;
  }

  if (boxInstallment && valInstallmentMonthly) {
    if (res.canInstallment) {
      boxInstallment.style.display = 'block';
      valInstallmentMonthly.textContent = `${formatMoney(res.installmentMonthly, 2)} ${unitStr}/${isEn ? 'mo' : 'งวด'}`;
    } else {
      boxInstallment.style.display = 'none';
    }
  }

  if (tiersListEl) {
    if (res.tiers && res.tiers.length > 0) {
      tiersListEl.innerHTML = res.tiers
        .map((tier) => {
          const label = isEn ? tier.labelEn : tier.labelTh;
          return `<div style="display:flex; justify-content:space-between; align-items:center; padding:3px 0; border-bottom:1px dashed var(--line);">
            <span style="color:var(--ink-dim);">${label} (${formatMoney(tier.taxableInTier, 0)} ${unitStr}):</span>
            <span style="font-weight:600; color:var(--ink);">${formatMoney(tier.taxInTier, 2)} ${unitStr}</span>
          </div>`;
        })
        .join('');
    } else {
      tiersListEl.innerHTML = `<div style="color:var(--ok); font-weight:600;">${isEn ? '🎉 100% Tax Exempt — 0.00 THB' : '🎉 ได้รับยกเว้นภาษีทั้งจำนวน — 0.00 บาท'}</div>`;
    }
  }

  saveLandState();
}

function initLandTaxCard() {
  loadLandState();
  const catEl = document.getElementById('selLandCategory');
  const valEl = document.getElementById('txtLandAppraisalValue');
  const vacantYrsEl = document.getElementById('txtVacantYears');

  if (catEl && landState.landCategory) catEl.value = landState.landCategory;
  if (valEl && landState.appraisalValue != null) valEl.value = landState.appraisalValue;
  if (vacantYrsEl && landState.vacantConsecutiveYears != null) vacantYrsEl.value = landState.vacantConsecutiveYears;

  if (landState.isExpanded) {
    toggleLandTaxCard();
  } else {
    updateLandTaxUI();
  }
}

// Expose functions called by HTML onclick handlers
window.setTab = setTab;
window.toggleSeveranceCalc = toggleSeveranceCalc;
window.applySeveranceCalc = applySeveranceCalc;
window.calculate = calculate;
window.exportPayoutToRemaining = exportPayoutToRemaining;
window.reset = reset;
window.toggleSsoSimulator = toggleSsoSimulator;
window.onSsoSectionChange = onSsoSectionChange;
window.calculateSsoBenefits = calculateSsoBenefits;
window.calculateSocialSecurityPensionAndBenefits = calculateSocialSecurityPensionAndBenefits;
window.toggleInheritanceTaxCard = toggleInheritanceTaxCard;
window.setInherSubTab = setInherSubTab;
window.setEstatePreset = setEstatePreset;
window.updateInheritanceTaxUI = updateInheritanceTaxUI;
window.toggleLandTaxCard = toggleLandTaxCard;
window.setLandPreset = setLandPreset;
window.updateLandTaxUI = updateLandTaxUI;

// Restore state if available
loadState();
initInheritanceTaxCard();
initLandTaxCard();

// Universal Card Layout Manager
const taxLayoutManager =
  typeof MoneyApp !== 'undefined' && MoneyApp.initCardLayoutManager
    ? MoneyApp.initCardLayoutManager({
        container: document.getElementById('taxPanelsContainer'),
        cardSelector: '.reorder-card',
        storageKey: 'moneySuperapp.layout.taxcalc.v1',
        defaultOrder: [
          'panelSeveranceInputs',
          'panelSeveranceResults',
          'sso-simulator-card',
          'inheritance-tax-card',
          'land-building-tax-card',
        ],
      })
    : null;

window.resetTaxLayout = function () {
  if (taxLayoutManager) {
    taxLayoutManager.resetLayout();
  }
};
