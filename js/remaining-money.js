// ── Language ──────────────────────────────────────────────────────────────
const EN = {
  eyebrow: 'Money Manager',
  pageTitle: 'Remaining Money Calculator',
  subtitle:
    'Log income and expenses, then see how much is left each month — enter a salary and tax + social security are calculated automatically.',
  incomePanelTitle: 'Income',
  expensePanelTitle: 'Expenses',
  savingPanelTitle: 'Savings',
  scIncomeLabel: 'Total Income',
  scExpenseLabel: 'Total Expenses',
  scSavingLabel: 'Total Savings',
  scIncomeValue: '0 THB',
  scExpenseValue: '0 THB',
  scSavingValue: '0 THB',
  addIncome: '+ Add income',
  addExpense: '+ Add expense',
  addSaving: '+ Add savings',
  remainingLabel: 'Remaining for Investment',
  remainingNote: 'Income minus expenses and savings',
  remainingPositive: 'You have money left over for investment this month.',
  remainingNegative: 'Expenses and savings exceed income — review your spending.',
  remainingZero: 'Income, expenses, and savings are balanced.',
  resetBtn: 'Clear saved data',
  lastSaved: (t) => `Last saved ${t}`,
  resetConfirm: 'Clear the data saved in this browser and go back to defaults?',
  incomeDefaultName: (n) => `Income ${n}`,
  expenseDefaultName: (n) => `Expense ${n}`,
  savingDefaultName: (n) => `Savings ${n}`,
  autoTaxName: 'Estimated Income Tax',
  autoSSOName: 'Social Security (SSO)',
  autoPvdName: 'Provident Fund (PVD)',
  pvdLabel: 'PVD',
  pvdPlaceholder: 'e.g. 5',
  lblBridgeBtn: 'Send investable money to Rebalance',
  bridgeAlertDefault: '✓ Data imported successfully',
  runwayTitle: '🛡️ Calculate Emergency Runway',
  lblCurrentReserve: 'Current Accumulated Emergency Reserve (THB)',
  lblReserveUnit: 'THB',
  placeholderCurrentReserve: 'e.g. 100,000',
  runwayUnit: 'months',
  runwayWarning: '⚠️ Warning — Less than 3 months of buffer',
  runwayHealthy: '✅ Healthy — 3–6 months of buffer',
  runwaySolid: '💪 Solid — Over 6 months of buffer',
  lblCopySummary: 'Copy Summary',
  lblExportCsv: 'Download CSV',
  lblExportJson: 'Download JSON',
  lblPrint: 'Print / PDF',
  lblUndo: 'Undo',
  lblCashflowTitle: 'Cashflow Allocation',
  lblCfViewWaterfall: 'Waterfall Stream',
  lblCfViewBar: 'Proportions Bar',
  lblCfView503020: '50/30/20 Rule',
  lblDonutTitle: 'Rule 50/30/20',
  lbl503020Needs: 'Needs:',
  lbl503020Wants: 'Wants:',
  lbl503020Savings: 'Savings & Invest:',
  lbl503020Runway: '🛡️ Emergency Runway:',
  lblCfIncome: 'Gross Income:',
  lblCfDeductions: 'Statutory (Tax/SSO/PVD):',
  lblCfExpenses: 'Living Expenses:',
  lblCfSavings: 'Savings:',
  lblCfRemaining: 'Investable Surplus:',
  copiedSuccess: '✓ Copied!',
  lblImport: 'Import Data',
  importModalTitle: 'Import Data Preview',
  importModeReplace: 'Replace current data',
  importModeMerge: 'Merge with current data',
  btnConfirmImport: 'Confirm Import',
  btnCancelModal: 'Cancel',
  importSuccess: '✓ Data imported successfully',
  importError: 'Could not import file',
  importNoData: 'No income or expense data found',
  importFileLabel: '📄 File: ',
  importMethod: 'Import Method:',
  importSummaryIncome: 'Income',
  importSummaryExpense: 'Expenses',
  importSummarySaving: 'Savings',
  importSummaryNet: 'Net Cash Flow',
  importSummaryRunway: 'Emergency Reserve',
  lblTemplates: 'Templates',
  templateModalTitle: 'Budget Templates',
  lblSaveCurrentTitle: '💾 Save Current Budget as Template',
  placeholderTemplateName: 'e.g. Regular Month, Frugal Budget',
  btnSaveTemplate: 'Save',
  lblCustomTemplatesHeader: 'Your Saved Templates',
  lblPresetTemplatesHeader: 'Recommended Starter Templates',
  lblTemplateUndoNotice: '💡 After applying a template, you can press ↩ Undo (Ctrl+Z) anytime.',
  btnCloseTemplate: 'Close',
  btnApplyTemplate: 'Apply',
  btnDeleteTemplate: 'Delete',
  noCustomTemplates: 'No saved templates yet. Enter a name above to save your current budget.',
  txtPresetBarTitle: 'Budget Mode:',
  lblManageTemplates: 'Manage Templates...',
};

const T = {
  th: {
    scIncomeValue: (n) => `${n} บาท`,
    scExpenseValue: (n) => `${n} บาท`,
    scSavingValue: (n) => `${n} บาท`,
    remainingValue: (n) => `${n} บาท`,
    remainingPositive: 'เหลือเงินในเดือนนี้',
    remainingNegative: 'ใช้จ่ายเกินรายได้ — ลดค่าใช้จ่ายหรือเพิ่มรายได้',
    remainingZero: 'รายได้และค่าใช้จ่ายเท่ากันพอดี',
    autoTaxLabel: 'ภาษี',
    autoSSOLabel: 'SSO',
    autoPvdLabel: 'PVD',
    autoGenericLabel: 'อัตโนมัติ',
    metaAutoPrefix: 'คำนวณโดยอัตโนมัติ',
    metaTaxDesc: 'ภาษีเงินได้ (ประมาณการ)',
    metaSSODesc: 'ประกันสังคม 5% (สูงสุด 875 บาท/เดือน)',
    metaPvdDesc: 'กองทุนสำรองเลี้ยงชีพ (PVD) — ลดหย่อนภาษีได้',
    pvdLabel: 'PVD',
    remove: 'ลบ',
    cannotDeleteSalary: 'ไม่สามารถลบได้',
    autoCalculated: 'คำนวณโดยอัตโนมัติ',
    unit: 'บาท',
    lastSaved: (t) => `บันทึกล่าสุด ${t}`,
    incomeBreakdown: 'รายได้แต่ละรายการ',
    expenseBreakdown: 'ค่าใช้จ่ายแต่ละรายการ',
    savingBreakdown: 'เงินออมแต่ละรายการ',
    lblCopySummary: 'คัดลอกสรุป',
    lblExportCsv: 'ดาวน์โหลด CSV',
    lblExportJson: 'ดาวน์โหลด JSON',
    lblPrint: 'พิมพ์ / บันทึก PDF',
    copiedSuccess: '✓ คัดลอกแล้ว!',
    lblImport: 'นำเข้าข้อมูล',
    importModalTitle: 'ตรวจสอบข้อมูลที่นำเข้า',
    importModeReplace: 'แทนที่ข้อมูลปัจจุบัน',
    importModeMerge: 'รวมเข้ากับข้อมูลปัจจุบัน',
    btnConfirmImport: 'ยืนยันการนำเข้า',
    btnCancelModal: 'ยกเลิก',
    importSuccess: '✓ นำเข้าข้อมูลเรียบร้อยแล้ว',
    importError: 'เกิดข้อผิดพลาดในการนำเข้าไฟล์',
    importNoData: 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย',
    importFileLabel: '📄 ไฟล์: ',
    importMethod: 'วิธีการนำเข้า:',
    importSummaryIncome: 'รายได้',
    importSummaryExpense: 'ค่าใช้จ่าย',
    importSummarySaving: 'เงินออม',
    importSummaryNet: 'กระแสเงินสดสุทธิ',
    importSummaryRunway: 'เงินสำรองฉุกเฉิน',
  },
  en: {
    scIncomeValue: (n) => `${n} THB`,
    scExpenseValue: (n) => `${n} THB`,
    scSavingValue: (n) => `${n} THB`,
    remainingValue: (n) => `${n} THB`,
    remainingPositive: 'Money left over this month',
    remainingNegative: 'Expenses exceed income — review spending or boost income',
    remainingZero: 'Income and expenses are balanced',
    autoTaxLabel: 'TAX',
    autoSSOLabel: 'SSO',
    autoPvdLabel: 'PVD',
    autoGenericLabel: 'AUTO',
    metaAutoPrefix: 'Auto-calculated',
    metaTaxDesc: 'Estimated income tax (monthly)',
    metaSSODesc: 'Social Security 5% (max 875 THB/month)',
    metaPvdDesc: 'Provident Fund (PVD) — tax-deductible contribution',
    pvdLabel: 'PVD',
    remove: 'Delete',
    cannotDeleteSalary: 'Cannot be deleted',
    autoCalculated: 'Auto-calculated',
    unit: 'THB',
    lastSaved: (t) => `Last saved ${t}`,
    incomeBreakdown: 'Income breakdown',
    expenseBreakdown: 'Expense breakdown',
    savingBreakdown: 'Savings breakdown',
    lblCopySummary: 'Copy Summary',
    lblExportCsv: 'Download CSV',
    lblExportJson: 'Download JSON',
    lblPrint: 'Print / PDF',
    copiedSuccess: '✓ Copied!',
    lblImport: 'Import Data',
    importModalTitle: 'Import Data Preview',
    importModeReplace: 'Replace current data',
    importModeMerge: 'Merge with current data',
    btnConfirmImport: 'Confirm Import',
    btnCancelModal: 'Cancel',
    importSuccess: '✓ Data imported successfully',
    importError: 'Could not import file',
    importNoData: 'No income or expense data found',
    importFileLabel: '📄 File: ',
    importMethod: 'Import Method:',
    importSummaryIncome: 'Income',
    importSummaryExpense: 'Expenses',
    importSummarySaving: 'Savings',
    importSummaryNet: 'Net Cash Flow',
    importSummaryRunway: 'Emergency Reserve',
  },
};
function t(key, ...args) {
  const fn = (LANG === 'en' ? T.en : T.th)[key];
  const v = typeof fn === 'function' ? fn(...args) : fn;
  return v !== undefined ? v : '';
}

if (LANG === 'en') {
  document.title = 'Remaining Money Calculator';
  [
    'eyebrow',
    'pageTitle',
    'subtitle',
    'incomePanelTitle',
    'expensePanelTitle',
    'savingPanelTitle',
    'scIncomeLabel',
    'scExpenseLabel',
    'scSavingLabel',
    'remainingLabel',
    'remainingNote',
    'runwayTitle',
    'lblCurrentReserve',
    'lblReserveUnit',
    'lblCopySummary',
    'lblExportCsv',
    'lblExportJson',
    'lblPrint',
    'lblImport',
    'importModalTitle',
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el && EN[id]) el.textContent = EN[id];
  });
  const txtResInp = document.getElementById('txtCurrentReserve');
  if (txtResInp && EN.placeholderCurrentReserve) txtResInp.placeholder = EN.placeholderCurrentReserve;
  document.getElementById('incomeAddBtn').textContent = EN.addIncome;
  document.getElementById('expenseAddBtn').textContent = EN.addExpense;
  const savAddBtn = document.getElementById('savingAddBtn');
  if (savAddBtn) savAddBtn.textContent = EN.addSaving;
  document.getElementById('resetBtn').textContent = EN.resetBtn;
  document.getElementById('remainingNote').textContent = EN.remainingNote;
  document.getElementById('scIncomeValue').textContent = EN.scIncomeValue;
  document.getElementById('scExpenseValue').textContent = EN.scExpenseValue;
  const scSavVal = document.getElementById('scSavingValue');
  if (scSavVal) scSavVal.textContent = EN.scSavingValue;
  document.getElementById('remainingValue').textContent = EN.scIncomeValue;
  const bridgeLbl = document.getElementById('lblBridgeBtn');
  if (bridgeLbl) bridgeLbl.textContent = EN.lblBridgeBtn;
  const bridgeAlertEl = document.getElementById('bridgeAlertText');
  if (bridgeAlertEl) bridgeAlertEl.textContent = EN.bridgeAlertDefault;
  const flbl = document.getElementById('lblImportFile');
  if (flbl) flbl.textContent = EN.importFileLabel;
  const sMet = document.getElementById('lblImportMethod');
  if (sMet) sMet.textContent = EN.importMethod;
  const modeRepl = document.getElementById('lblModeReplace');
  if (modeRepl && EN.importModeReplace) modeRepl.textContent = EN.importModeReplace;
  const modeMrg = document.getElementById('lblModeMerge');
  if (modeMrg && EN.importModeMerge) modeMrg.textContent = EN.importModeMerge;
  const sInc = document.getElementById('lblImportSummaryIncome');
  if (sInc) sInc.textContent = EN.importSummaryIncome;
  const sExp = document.getElementById('lblImportSummaryExpense');
  if (sExp) sExp.textContent = EN.importSummaryExpense;
  const sSav = document.getElementById('lblImportSummarySaving');
  if (sSav) sSav.textContent = EN.importSummarySaving;
  const sNet = document.getElementById('lblImportSummaryNet');
  if (sNet) sNet.textContent = EN.importSummaryNet;
  const sRun = document.getElementById('lblImportSummaryRunway');
  if (sRun) sRun.textContent = EN.importSummaryRunway;
  const btnConf = document.getElementById('btnConfirmImport');
  if (btnConf && EN.btnConfirmImport) btnConf.textContent = EN.btnConfirmImport;
  const btnCanc = document.getElementById('btnCancelImportModal');
  if (btnCanc && EN.btnCancelModal) btnCanc.textContent = EN.btnCancelModal;
  const lblU = document.getElementById('lblUndo');
  if (lblU) lblU.textContent = EN.lblUndo;
  const lblUB = document.getElementById('lblUndoBottom');
  if (lblUB) lblUB.textContent = EN.lblUndo;
  const cfT = document.getElementById('lblCashflowTitle');
  if (cfT) cfT.textContent = EN.lblCashflowTitle;
  const cfVwW = document.getElementById('lblCfViewWaterfall');
  if (cfVwW) cfVwW.textContent = EN.lblCfViewWaterfall;
  const cfVwB = document.getElementById('lblCfViewBar');
  if (cfVwB) cfVwB.textContent = EN.lblCfViewBar;
  const cfVw50 = document.getElementById('lblCfView503020');
  if (cfVw50) cfVw50.textContent = EN.lblCfView503020;
  const dnT = document.getElementById('lblDonutTitle');
  if (dnT) dnT.textContent = EN.lblDonutTitle;
  const nL = document.getElementById('lbl503020Needs');
  if (nL) nL.textContent = EN.lbl503020Needs;
  const wL = document.getElementById('lbl503020Wants');
  if (wL) wL.textContent = EN.lbl503020Wants;
  const sL = document.getElementById('lbl503020Savings');
  if (sL) sL.textContent = EN.lbl503020Savings;
  const rL = document.getElementById('lbl503020Runway');
  if (rL) rL.textContent = EN.lbl503020Runway;
  const cfI = document.getElementById('lblCfIncome');
  if (cfI) cfI.textContent = EN.lblCfIncome;
  const cfD = document.getElementById('lblCfDeductions');
  if (cfD) cfD.textContent = EN.lblCfDeductions;
  const cfE = document.getElementById('lblCfExpenses');
  if (cfE) cfE.textContent = EN.lblCfExpenses;
  const cfS = document.getElementById('lblCfSavings');
  if (cfS) cfS.textContent = EN.lblCfSavings;
  const cfR = document.getElementById('lblCfRemaining');
  if (cfR) cfR.textContent = EN.lblCfRemaining;

  const tmplBtn = document.getElementById('lblTemplates');
  if (tmplBtn) tmplBtn.textContent = EN.lblTemplates;
  const tmplTitle = document.getElementById('lblTemplateTitle');
  if (tmplTitle) tmplTitle.textContent = EN.templateModalTitle;
  const tmplSaveTitle = document.getElementById('lblSaveCurrentTitle');
  if (tmplSaveTitle) tmplSaveTitle.textContent = EN.lblSaveCurrentTitle;
  const tmplNameInp = document.getElementById('txtNewTemplateName');
  if (tmplNameInp) tmplNameInp.placeholder = EN.placeholderTemplateName;
  const tmplSaveBtn = document.getElementById('btnSaveTemplate');
  if (tmplSaveBtn) tmplSaveBtn.textContent = EN.btnSaveTemplate;
  const tmplCustomHeader = document.getElementById('lblCustomTemplatesHeader');
  if (tmplCustomHeader) tmplCustomHeader.textContent = EN.lblCustomTemplatesHeader;
  const tmplPresetHeader = document.getElementById('lblPresetTemplatesHeader');
  if (tmplPresetHeader) tmplPresetHeader.textContent = EN.lblPresetTemplatesHeader;
  const tmplUndoNotice = document.getElementById('lblTemplateUndoNotice');
  if (tmplUndoNotice) tmplUndoNotice.textContent = EN.lblTemplateUndoNotice;
  const tmplCloseBtn = document.getElementById('btnCloseTemplate');
  if (tmplCloseBtn) tmplCloseBtn.textContent = EN.btnCloseTemplate;
  const pbTitle = document.getElementById('txtPresetBarTitle');
  if (pbTitle) pbTitle.textContent = EN.txtPresetBarTitle;
  const pbManage = document.getElementById('lblManageTemplates');
  if (pbManage) pbManage.textContent = EN.lblManageTemplates;
}

// ── Canonical names & Translation helper ──────────────────────────────────
const CANONICAL_NAMES = {
  เงินเดือน: { th: 'เงินเดือน', en: 'Salary' },
  Salary: { th: 'เงินเดือน', en: 'Salary' },
  'เงิน allowances / อื่นๆ': { th: 'เงิน allowances / อื่นๆ', en: 'Allowances / Other' },
  'Allowances / Other': { th: 'เงิน allowances / อื่นๆ', en: 'Allowances / Other' },
  'ภาษีเงินได้ (ประมาณการ)': { th: 'ภาษีเงินได้ (ประมาณการ)', en: 'Estimated Income Tax' },
  'Estimated income tax (monthly)': { th: 'ภาษีเงินได้ (ประมาณการ)', en: 'Estimated Income Tax' },
  'Estimated Income Tax': { th: 'ภาษีเงินได้ (ประมาณการ)', en: 'Estimated Income Tax' },
  'ประกันสังคม (SSO)': { th: 'ประกันสังคม (SSO)', en: 'Social Security (SSO)' },
  'Social Security (SSO)': { th: 'ประกันสังคม (SSO)', en: 'Social Security (SSO)' },
  'กองทุนสำรองเลี้ยงชีพ (PVD)': { th: 'กองทุนสำรองเลี้ยงชีพ (PVD)', en: 'Provident Fund (PVD)' },
  'Provident Fund (PVD)': { th: 'กองทุนสำรองเลี้ยงชีพ (PVD)', en: 'Provident Fund (PVD)' },
  'ค่าเช่า / ค่า condo': { th: 'ค่าเช่า / ค่า condo', en: 'Rent / Condo' },
  'Rent / Condo': { th: 'ค่าเช่า / ค่า condo', en: 'Rent / Condo' },
  ค่าไฟฟ้า: { th: 'ค่าไฟฟ้า', en: 'Electricity' },
  Electricity: { th: 'ค่าไฟฟ้า', en: 'Electricity' },
  ค่าน้ำ: { th: 'ค่าน้ำ', en: 'Water' },
  Water: { th: 'ค่าน้ำ', en: 'Water' },
  'เงินออมฉุกเฉิน / เงินสำรอง': { th: 'เงินออมฉุกเฉิน / เงินสำรอง', en: 'Emergency Savings / Reserve' },
  'Emergency Savings / Reserve': { th: 'เงินออมฉุกเฉิน / เงินสำรอง', en: 'Emergency Savings / Reserve' },
  'เงินชดเชยและ PVD สุทธิ': { th: 'เงินชดเชยและ PVD สุทธิ', en: 'Net Severance & PVD Payout' },
  'เงินชดเชย & PVD สุทธิ': { th: 'เงินชดเชยและ PVD สุทธิ', en: 'Net Severance & PVD Payout' },
  'Net Severance & PVD Payout': { th: 'เงินชดเชยและ PVD สุทธิ', en: 'Net Severance & PVD Payout' },
};

function getDisplayName(name) {
  if (!name) return '';
  const item = CANONICAL_NAMES[name];
  if (item) {
    return LANG === 'en' ? item.en : item.th;
  }
  return name;
}

function isSalaryRow(item, index) {
  if (!item) return false;
  if (item.isSalary === true) return true;
  if (index === 0) return true;
  return (
    item.name === 'เงินเดือน' ||
    item.name === 'Salary' ||
    (typeof item.name === 'string' && item.name.includes('เงินเดือน'))
  );
}

// ── Auto-row canonical names (Thai, always used as state name) ────────────
const AUTO_TAX_NAME_TH = 'ภาษีเงินได้ (ประมาณการ)',
  AUTO_SSO_NAME_TH = 'ประกันสังคม (SSO)',
  AUTO_PVD_NAME_TH = 'กองทุนสำรองเลี้ยงชีพ (PVD)';

function getAutoType(item) {
  if (!item) return null;
  if (item.autoType) return item.autoType;
  if (
    item.name === AUTO_TAX_NAME_TH ||
    item.name === 'Estimated Income Tax' ||
    item.name === 'Estimated income tax (monthly)'
  )
    return 'tax';
  if (item.name === AUTO_SSO_NAME_TH || item.name === 'Social Security (SSO)') return 'sso';
  if (item.name === AUTO_PVD_NAME_TH || item.name === 'Provident Fund (PVD)') return 'pvd';
  return null;
}

// ── State ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'remainingMoneyCalculator.state.v1';

const defaultState = {
  incomes: [
    { name: 'เงินเดือน', value: 10000, isSalary: true },
    { name: 'เงิน allowances / อื่นๆ', value: 1000 },
  ],
  expenses: [
    { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
    { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
    { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
    { name: 'ค่าเช่า / ค่า condo', value: 3000 },
    { name: 'ค่าไฟฟ้า', value: 500 },
    { name: 'ค่าน้ำ', value: 200 },
  ],
  savings: [{ name: 'เงินออมฉุกเฉิน / เงินสำรอง', value: 1000 }],
  manualOverrides: {
    tax: false,
    sso: false,
    pvd: false,
  },
  showEmergencyRunway: false,
  currentEmergencyReserve: 0,
};

const state = (() => {
  try {
    const saved = MoneyApp.safeJsonParse(STORAGE_KEY, null);
    if (saved && Array.isArray(saved.incomes) && Array.isArray(saved.expenses)) {
      // Ensure auto rows exist in loaded state (and update existing ones to have auto: true and autoType)
      const expenses = Array.isArray(saved.expenses) ? saved.expenses : defaultState.expenses.slice();
      if (!expenses.find((e) => getAutoType(e) === 'tax')) {
        expenses.unshift({ name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' });
      }
      if (!expenses.find((e) => getAutoType(e) === 'sso')) {
        expenses.unshift({ name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' });
      }
      if (!expenses.find((e) => getAutoType(e) === 'pvd')) {
        expenses.unshift({ name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' });
      }
      // Ensure all auto items have auto: true and correct autoType
      expenses.forEach((e) => {
        const aType = getAutoType(e);
        if (aType) {
          e.auto = true;
          e.autoType = aType;
        }
      });
      // Ensure income names are correct (safeguard against stale saved income names)
      if (saved.incomes.length > 0 && !isSalaryRow(saved.incomes[0], 0)) {
        saved.incomes[0].name = 'เงินเดือน';
        saved.incomes[0].isSalary = true;
      }
      const savings = Array.isArray(saved.savings)
        ? saved.savings
        : defaultState.savings
          ? defaultState.savings.map((s) => ({ ...s }))
          : [];
      const manualOverrides =
        saved.manualOverrides && typeof saved.manualOverrides === 'object'
          ? { tax: !!saved.manualOverrides.tax, sso: !!saved.manualOverrides.sso, pvd: !!saved.manualOverrides.pvd }
          : { tax: false, sso: false, pvd: false };
      const showEmergencyRunway = typeof saved.showEmergencyRunway === 'boolean' ? saved.showEmergencyRunway : false;
      const currentEmergencyReserve =
        Number(saved.currentEmergencyReserve) >= 0 ? Number(saved.currentEmergencyReserve) : 0;
      return {
        incomes: Array.isArray(saved.incomes) ? saved.incomes : defaultState.incomes,
        expenses,
        savings,
        manualOverrides,
        showEmergencyRunway,
        currentEmergencyReserve,
      };
    }
  } catch (e) {
    /* corrupted — fall back to defaults */
  }
  return JSON.parse(JSON.stringify(defaultState));
})();

const manualOverrides = state.manualOverrides;

// ── DOM refs ───────────────────────────────────────────────────────────────
const incomeContainer = document.getElementById('incomeContainer');
const expenseContainer = document.getElementById('expenseContainer');
const savingContainer = document.getElementById('savingContainer');
const incomeAddBtn = document.getElementById('incomeAddBtn');
const expenseAddBtn = document.getElementById('expenseAddBtn');
const savingAddBtn = document.getElementById('savingAddBtn');
const scIncomeValue = document.getElementById('scIncomeValue');
const scExpenseValue = document.getElementById('scExpenseValue');
const scSavingValue = document.getElementById('scSavingValue');
const remainingBox = document.getElementById('remainingBox');
const remainingValue = document.getElementById('remainingValue');
const remainingNote = document.getElementById('remainingNote');
const saveStatusEl = document.getElementById('saveStatus');
const resetBtn = document.getElementById('resetBtn');

// ── Formatting ─────────────────────────────────────────────────────────────
function fmt(n) {
  return Math.round(n).toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH');
}
function fmtCurrency(n) {
  return fmt(Math.round(n)) + ' ' + (LANG === 'en' ? 'THB' : 'บาท');
}

// ── Delta input ────────────────────────────────────────────────────────────
const inputBaseValues = new WeakMap();

function isDeltaExpr(raw) {
  return /^\s*[+-]/.test(String(raw || ''));
}

function resolveNumericInput(raw, base) {
  if (raw == null) return 0;
  const trimmed = String(raw).trim().replace(/,/g, '');
  if (trimmed === '') return 0;
  const m = trimmed.match(/^([+-])\s*(\d*\.?\d*)$/);
  if (m) {
    const sign = m[1] === '-' ? -1 : 1;
    const num = m[2] === '' ? 0 : parseFloat(m[2]);
    return (base || 0) + sign * (isNaN(num) ? 0 : num);
  }
  const n = parseFloat(trimmed);
  return isNaN(n) ? 0 : n;
}

function fmtPlain(n) {
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

// ── Tax & SSO calculation (annualized method, same as months-slips.html) ──
function calculateSSO(salary) {
  return Math.min(salary * 0.05, 875);
}

function calculatePVD(salary, percent) {
  return salary * (percent / 100);
}

const TAX_BRACKETS = [
  { limit: 150000, rate: 0.0 },
  { limit: 150000, rate: 0.05 },
  { limit: 200000, rate: 0.1 },
  { limit: 250000, rate: 0.15 },
  { limit: 250000, rate: 0.2 },
  { limit: 1000000, rate: 0.25 },
  { limit: 3000000, rate: 0.3 },
  { limit: Infinity, rate: 0.35 },
];

function progressiveTax(income) {
  if (income <= 0) return 0;
  let tax = 0,
    remaining = income;
  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, TAX_BRACKETS[i].limit);
    tax += taxable * TAX_BRACKETS[i].rate;
    remaining -= taxable;
  }
  return tax;
}

function calculateMonthlyTax(salary, pvdPercent) {
  const ssoMonthly = calculateSSO(salary);
  const pvdMonthly = calculatePVD(salary, pvdPercent);
  const annualIncome = salary * 12;
  const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
  const personalDeduction = 60000;
  const netAnnual = Math.max(
    0,
    annualIncome - expenseDeduction - personalDeduction - ssoMonthly * 12 - pvdMonthly * 12,
  );
  return progressiveTax(netAnnual) / 12;
}

// ── Auto-expense update ────────────────────────────────────────────────────
const PVD_PERCENT_KEY = 'remainingMoneyCalculator.pvdPercent.v1';
let pvdPercent = (() => {
  try {
    const saved = localStorage.getItem(PVD_PERCENT_KEY);
    if (saved !== null) {
      const n = parseFloat(saved);
      if (!isNaN(n) && n >= 0 && n <= 100) return n;
    }
  } catch (e) {}
  return 5;
})();

function getSalaryValue() {
  const sal = state.incomes.find((item, idx) => isSalaryRow(item, idx));
  return sal ? Number(sal.value) || 0 : 0;
}

function updateAutoExpenses(pvdPct) {
  pvdPct = pvdPct !== undefined ? pvdPct : pvdPercent;
  const salary = getSalaryValue();
  const tax = salary > 0 ? calculateMonthlyTax(salary, pvdPct) : 0;
  const sso = salary > 0 ? calculateSSO(salary) : 0;
  const pvd = salary > 0 ? calculatePVD(salary, pvdPct) : 0;

  let taxItem = state.expenses.find((e) => getAutoType(e) === 'tax');
  if (!taxItem) {
    taxItem = { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' };
    state.expenses.unshift(taxItem);
  }
  if (!manualOverrides.tax) {
    taxItem.value = tax;
  }

  let ssoItem = state.expenses.find((e) => getAutoType(e) === 'sso');
  if (!ssoItem) {
    ssoItem = { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' };
    const taxIdx = state.expenses.indexOf(taxItem);
    state.expenses.splice(taxIdx + 1, 0, ssoItem);
  }
  if (!manualOverrides.sso) {
    ssoItem.value = sso;
  }

  let pvdItem = state.expenses.find((e) => getAutoType(e) === 'pvd');
  if (!pvdItem) {
    pvdItem = { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' };
    const ssoIdx = state.expenses.indexOf(ssoItem);
    state.expenses.splice(ssoIdx + 1, 0, pvdItem);
  }
  if (!manualOverrides.pvd) {
    pvdItem.value = pvd;
  }

  // Sync DOM inputs for auto rows using data-auto attributes
  if (expenseContainer) {
    const taxInp = expenseContainer.querySelector('.value-input[data-auto="tax"]');
    const ssoInp = expenseContainer.querySelector('.value-input[data-auto="sso"]');
    const pvdInp = expenseContainer.querySelector('.value-input[data-auto="pvd"]');
    if (taxInp && document.activeElement !== taxInp && !manualOverrides.tax) {
      taxInp.value = fmtPlain(taxItem.value);
      inputBaseValues.set(taxInp, taxItem.value);
    }
    if (ssoInp && document.activeElement !== ssoInp && !manualOverrides.sso) {
      ssoInp.value = fmtPlain(ssoItem.value);
      inputBaseValues.set(ssoInp, ssoItem.value);
    }
    if (pvdInp && document.activeElement !== pvdInp && !manualOverrides.pvd) {
      pvdInp.value = fmtPlain(pvdItem.value);
      inputBaseValues.set(pvdInp, pvdItem.value);
    }
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (saveStatusEl) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      saveStatusEl.textContent = t('lastSaved', `${hh}:${mm}`);
    }
  } catch (e) {
    /* localStorage unavailable — silently skip */
  }
}

function showBridgeNotification(msg) {
  const banner = document.getElementById('bridgeAlertBanner');
  const textEl = document.getElementById('bridgeAlertText');
  if (banner && textEl) {
    textEl.textContent = msg;
    banner.style.display = 'flex';
    setTimeout(() => {
      banner.style.display = 'none';
    }, 5000);
  }
}

// ── Undo Subsystem ────────────────────────────────────────────────────────
function captureSnapshot() {
  return {
    incomes: JSON.parse(JSON.stringify(state.incomes || [])),
    expenses: JSON.parse(JSON.stringify(state.expenses || [])),
    savings: JSON.parse(JSON.stringify(state.savings || [])),
    manualOverrides: {
      tax: !!manualOverrides.tax,
      sso: !!manualOverrides.sso,
      pvd: !!manualOverrides.pvd,
    },
    pvdPercent: pvdPercent,
    showEmergencyRunway: !!state.showEmergencyRunway,
    currentEmergencyReserve: state.currentEmergencyReserve || 0,
    activeTemplateId: currentActiveTemplateId,
  };
}

function restoreSnapshot(snap) {
  if (!snap) return;
  currentActiveTemplateId = snap.activeTemplateId || null;
  state.incomes = snap.incomes ? JSON.parse(JSON.stringify(snap.incomes)) : [];
  state.expenses = snap.expenses ? JSON.parse(JSON.stringify(snap.expenses)) : [];
  state.savings = snap.savings ? JSON.parse(JSON.stringify(snap.savings)) : [];
  if (snap.manualOverrides) {
    manualOverrides.tax = !!snap.manualOverrides.tax;
    manualOverrides.sso = !!snap.manualOverrides.sso;
    manualOverrides.pvd = !!snap.manualOverrides.pvd;
  } else {
    manualOverrides.tax = false;
    manualOverrides.sso = false;
    manualOverrides.pvd = false;
  }
  if (snap.pvdPercent != null && !isNaN(snap.pvdPercent)) {
    pvdPercent = snap.pvdPercent;
  } else {
    pvdPercent = 5;
  }
  try {
    localStorage.setItem(PVD_PERCENT_KEY, String(pvdPercent));
  } catch (_e) {}
  const pvdInput = document.getElementById('pvdPctInput');
  if (pvdInput) pvdInput.value = pvdPercent;

  state.showEmergencyRunway = !!snap.showEmergencyRunway;
  state.currentEmergencyReserve = Number(snap.currentEmergencyReserve) || 0;

  const txtReserve = document.getElementById('txtCurrentReserve');
  if (txtReserve) txtReserve.value = state.currentEmergencyReserve || '';

  const chkRunway = document.getElementById('chkShowRunway');
  if (chkRunway) {
    chkRunway.checked = !!state.showEmergencyRunway;
    const runwayContent = document.getElementById('runwayContent');
    if (runwayContent) runwayContent.style.display = state.showEmergencyRunway ? '' : 'none';
  }

  updateAutoExpenses(pvdPercent);
  renderRows();
  renderPvdRow();
  compute();
  renderQuickPresetsBar();
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

function undoRemainingChange() {
  undoMgr.undo();
}

function checkPendingLumpSum() {
  try {
    const lump = MoneyApp.safeJsonParse('moneySuperapp.pendingLumpSum', null);
    if (lump && lump.value > 0) {
      undoMgr.push(captureSnapshot());
      let existing = state.incomes.find((item) => item.name === lump.name);
      if (existing) {
        existing.value = lump.value;
      } else {
        state.incomes.push({ name: lump.name, value: lump.value });
      }
      localStorage.removeItem('moneySuperapp.pendingLumpSum');
      renderRows();
      renderPvdRow();
      compute();
      saveState();
      updateUndoUI();
      showBridgeNotification(
        LANG === 'en'
          ? `✓ Imported ${getDisplayName(lump.name)}: ${fmtCurrency(lump.value)}`
          : `✓ นำเข้า${getDisplayName(lump.name)}: ${fmtCurrency(lump.value)} เรียบร้อยแล้ว`,
      );
    }
  } catch (e) {}
}

function checkPendingSlipImport() {
  try {
    const slip = MoneyApp.safeJsonParse('moneySuperapp.pendingSlipImport', null);
    if (slip && slip.salary > 0) {
      undoMgr.push(captureSnapshot());
      if (state.incomes.length > 0 && isSalaryRow(state.incomes[0])) {
        state.incomes[0].value = slip.salary;
      }
      if (slip.allowance !== undefined) {
        let allowRow = state.incomes.find((item) => item.name.includes('allowance') || item.name.includes('อื่น'));
        if (allowRow) {
          allowRow.value = slip.allowance;
        } else if (slip.allowance > 0) {
          state.incomes.push({ name: 'เงิน allowances / อื่นๆ', value: slip.allowance });
        }
      }
      if (slip.pvd !== undefined) {
        pvdPercent = slip.pvd;
        try {
          localStorage.setItem(PVD_PERCENT_KEY, String(slip.pvd));
        } catch (e) {}
        const pvdInput = document.getElementById('pvdPctInput');
        if (pvdInput) pvdInput.value = slip.pvd;
      }
      localStorage.removeItem('moneySuperapp.pendingSlipImport');
      manualOverrides.tax = false;
      manualOverrides.sso = false;
      manualOverrides.pvd = false;
      updateAutoExpenses(pvdPercent);
      renderRows();
      renderPvdRow();
      compute();
      saveState();
      updateUndoUI();
      showBridgeNotification(
        LANG === 'en'
          ? `✓ Synced salary (${fmtCurrency(slip.salary)}) and allowances from payslip simulator`
          : `✓ ซิงค์เงินเดือน (${fmtCurrency(slip.salary)}) และ allowances จากสลิปเงินเดือนเรียบร้อยแล้ว`,
      );
    }
  } catch (e) {}
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    if (confirm(LANG === 'en' ? EN.resetConfirm : 'ล้างข้อมูลที่บันทึกไว้ในเบราว์เซอร์นี้ และกลับไปใช้ค่าตั้งต้น?')) {
      undoMgr.push(captureSnapshot());
      restoreSnapshot(defaultState);
      saveState();
      updateUndoUI();
    }
  });
}

// ── Render helpers ─────────────────────────────────────────────────────────
function createRowContainer(items, type, container) {
  container.innerHTML = '';
  items.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'entry-row';
    const autoType = getAutoType(item);
    const isAuto = autoType !== null;
    const isTax = autoType === 'tax';
    const isSso = autoType === 'sso';
    const isPvd = autoType === 'pvd';

    const autoBadgeLabel = isTax
      ? t('autoTaxLabel')
      : isSso
        ? t('autoSSOLabel')
        : isPvd
          ? t('autoPvdLabel')
          : t('autoGenericLabel');

    const displayVal = getDisplayName(item.name);
    const safeDisplayVal = escapeAttr(displayVal);
    const typeLabel = type === 'income' ? (LANG === 'en' ? 'Income' : 'รายได้') : LANG === 'en' ? 'Expense' : 'รายจ่าย';
    const placeholder =
      type === 'income'
        ? LANG === 'en'
          ? `Income ${i + 1}`
          : `รายได้ ${i + 1}`
        : LANG === 'en'
          ? `Expense ${i + 1}`
          : `ค่าใช้จ่าย ${i + 1}`;
    const unitText = t('unit');
    const isSalary = type === 'income' && isSalaryRow(item, i);
    const cannotDelete = isAuto || isSalary;
    const deleteTitle = isAuto ? t('autoCalculated') : isSalary ? t('cannotDeleteSalary') : t('remove');
    const badgeTooltip = isAuto
      ? LANG === 'en'
        ? 'Click to recalculate from salary'
        : 'คลิกเพื่อคำนวณใหม่อัตโนมัติจากเงินเดือน'
      : '';

    row.innerHTML = `
      <input class="name-input" data-type="${type}" data-idx="${i}" data-field="name"
             value="${safeDisplayVal}"
             aria-label="${typeLabel} ${i + 1} name"
             ${isAuto ? 'readonly' : ''} placeholder="${placeholder}">
      <input class="value-input" type="text" inputmode="decimal" data-type="${type}" data-idx="${i}" data-field="value"
             ${isAuto ? `data-auto="${autoType}"` : ''}
             value="${item.value}" aria-label="${safeDisplayVal || typeLabel} amount">
      <span class="unit">${unitText}</span>
      ${isAuto ? `<span class="auto-badge" data-auto="${autoType}" title="${badgeTooltip}">${autoBadgeLabel}</span>` : ''}
      <button class="remove-btn ${cannotDelete ? 'disabled' : ''}"
              data-type="${type}" data-idx="${i}"
              aria-label="${t('remove')} ${safeDisplayVal}"
              title="${deleteTitle}">×</button>
    `;
    container.appendChild(row);
  });
}

// ── PVD % row (separate UI element appended to income container) ───────────
function renderPvdRow() {
  const pvdRow = document.createElement('div');
  pvdRow.className = 'pvd-row';
  pvdRow.innerHTML = `
    <input class="pvd-label" value="${
      LANG === 'en' ? 'PVD contribution (% of salary)' : 'กองทุนสำรองเลี้ยงชีพ (% ของเงินเดือน)'
    }" readonly aria-label="${LANG === 'en' ? 'PVD Contribution' : 'กองทุนสำรองเลี้ยงชีพ'}">
    <input class="pvd-pct-input" type="number" id="pvdPctInput"
           value="${pvdPercent}" min="0" max="100" step="0.5" inputmode="decimal"
           aria-label="${LANG === 'en' ? 'PVD contribution percentage' : 'อัตราร้อยละเงินสะสมกองทุนสำรองเลี้ยงชีพ'}">
    <span class="pvd-unit">%</span>
    <span class="pvd-badge">PVD</span>
  `;
  // Insert after salary (position 0), before any removable income rows
  const target = incomeContainer.children[1];
  if (target) incomeContainer.insertBefore(pvdRow, target);
  else incomeContainer.appendChild(pvdRow);

  const pvdInput = document.getElementById('pvdPctInput');

  pvdInput.addEventListener('input', () => {
    const val = parseFloat(pvdInput.value);
    if (!isNaN(val) && val >= 0 && val <= 100) {
      pvdPercent = val;
      try {
        localStorage.setItem(PVD_PERCENT_KEY, String(val));
      } catch (e) {}
      manualOverrides.pvd = false;
      updateAutoExpenses(pvdPercent);
      compute();
    }
  });

  pvdInput.addEventListener('blur', () => {
    let val = parseFloat(pvdInput.value);
    if (isNaN(val) || val < 0) {
      val = 0;
    }
    if (val > 100) {
      val = 100;
    }
    pvdPercent = val;
    pvdInput.value = val;
    try {
      localStorage.setItem(PVD_PERCENT_KEY, String(val));
    } catch (e) {}
    manualOverrides.pvd = false;
    updateAutoExpenses(pvdPercent);
    compute();
  });

  pvdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      pvdInput.blur();
    }
  });
}

function bindRows(container, type) {
  const items = type === 'income' ? state.incomes : type === 'expense' ? state.expenses : state.savings;

  // Name input (only editable for non-auto rows)
  container.querySelectorAll('input.name-input:not([readonly])').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      const defaultPlaceholder =
        type === 'income'
          ? LANG === 'en'
            ? `Income ${idx + 1}`
            : `รายได้ ${idx + 1}`
          : type === 'expense'
            ? LANG === 'en'
              ? `Expense ${idx + 1}`
              : `ค่าใช้จ่าย ${idx + 1}`
            : LANG === 'en'
              ? `Savings ${idx + 1}`
              : `เงินออม ${idx + 1}`;
      items[idx].name = e.target.value || defaultPlaceholder;
      compute();
    });
  });

  // Value input — with delta support (enabled for all rows, including editable auto rows)
  container.querySelectorAll('input.value-input').forEach((inp) => {
    const idx = parseInt(inp.dataset.idx);
    enableDeltaInput(
      inp,
      () => (items[idx] ? items[idx].value : 0),
      (val) => {
        if (items[idx]) items[idx].value = val;
        // If salary changed, reset manual overrides and update auto expenses
        if (type === 'income') {
          const item = items[idx];
          if (item && isSalaryRow(item, idx)) {
            manualOverrides.tax = false;
            manualOverrides.sso = false;
            manualOverrides.pvd = false;
            updateAutoExpenses(pvdPercent);
          }
        }
        // If user directly edits an auto-expense row
        if (type === 'expense' && inp.dataset.auto) {
          const autoType = inp.dataset.auto;
          manualOverrides[autoType] = true;
          if (autoType === 'pvd') {
            const salary = getSalaryValue();
            if (salary > 0) {
              const newPct = Math.round((val / salary) * 1000) / 10;
              if (newPct >= 0 && newPct <= 100) {
                pvdPercent = newPct;
                try {
                  localStorage.setItem(PVD_PERCENT_KEY, String(newPct));
                } catch (e) {}
                const pvdInpEl = document.getElementById('pvdPctInput');
                if (pvdInpEl) pvdInpEl.value = newPct;
                // If tax hasn't been manually overridden, update tax with the new PVD deduction
                if (!manualOverrides.tax) {
                  const taxItem = state.expenses.find((e) => getAutoType(e) === 'tax');
                  if (taxItem) {
                    const newTax = calculateMonthlyTax(salary, pvdPercent);
                    taxItem.value = newTax;
                    const taxInp = expenseContainer.querySelector('.value-input[data-auto="tax"]');
                    if (taxInp && document.activeElement !== taxInp) {
                      taxInp.value = fmtPlain(newTax);
                      inputBaseValues.set(taxInp, newTax);
                    }
                  }
                }
              }
            }
          }
        }
        compute();
      },
    );
  });

  // Auto badge click: recalculate that auto-field from salary on demand
  container.querySelectorAll('.auto-badge[data-auto]').forEach((badge) => {
    badge.addEventListener('click', () => {
      const autoType = badge.dataset.auto;
      manualOverrides[autoType] = false;
      const salary = getSalaryValue();
      if (autoType === 'tax') {
        const tax = salary > 0 ? calculateMonthlyTax(salary, pvdPercent) : 0;
        const taxItem = state.expenses.find((e) => getAutoType(e) === 'tax');
        if (taxItem) taxItem.value = tax;
        const taxInp = expenseContainer.querySelector('.value-input[data-auto="tax"]');
        if (taxInp) {
          taxInp.value = fmtPlain(tax);
          inputBaseValues.set(taxInp, tax);
        }
      } else if (autoType === 'sso') {
        const sso = salary > 0 ? calculateSSO(salary) : 0;
        const ssoItem = state.expenses.find((e) => getAutoType(e) === 'sso');
        if (ssoItem) ssoItem.value = sso;
        const ssoInp = expenseContainer.querySelector('.value-input[data-auto="sso"]');
        if (ssoInp) {
          ssoInp.value = fmtPlain(sso);
          inputBaseValues.set(ssoInp, sso);
        }
      } else if (autoType === 'pvd') {
        const pvd = salary > 0 ? calculatePVD(salary, pvdPercent) : 0;
        const pvdItem = state.expenses.find((e) => getAutoType(e) === 'pvd');
        if (pvdItem) pvdItem.value = pvd;
        const pvdInp = expenseContainer.querySelector('.value-input[data-auto="pvd"]');
        if (pvdInp) {
          pvdInp.value = fmtPlain(pvd);
          inputBaseValues.set(pvdInp, pvd);
        }
        if (!manualOverrides.tax) {
          const tax = salary > 0 ? calculateMonthlyTax(salary, pvdPercent) : 0;
          const taxItem = state.expenses.find((e) => getAutoType(e) === 'tax');
          if (taxItem) taxItem.value = tax;
          const taxInp = expenseContainer.querySelector('.value-input[data-auto="tax"]');
          if (taxInp) {
            taxInp.value = fmtPlain(tax);
            inputBaseValues.set(taxInp, tax);
          }
        }
      }
      compute();
    });
  });

  // Remove button (only for non-auto rows and non-protected rows)
  container.querySelectorAll('.remove-btn:not(.disabled)').forEach((btn) => {
    btn.addEventListener('click', () => {
      undoMgr.push(captureSnapshot());
      const idx = parseInt(btn.dataset.idx);
      if (type === 'income') {
        state.incomes.splice(idx, 1);
        // Safeguard: ensure salary row always exists
        if (!state.incomes.find((item, i) => isSalaryRow(item, i))) {
          state.incomes.unshift({ name: 'เงินเดือน', value: 0, isSalary: true });
        }
      } else if (type === 'expense') {
        state.expenses.splice(idx, 1);
      } else if (type === 'saving') {
        state.savings.splice(idx, 1);
      }
      const targetContainer =
        type === 'income' ? incomeContainer : type === 'expense' ? expenseContainer : savingContainer;
      createRowContainer(items, type, targetContainer);
      if (type === 'income') renderPvdRow();
      bindRows(targetContainer, type);
      compute();
      saveState();
      updateUndoUI();
    });
  });

  // Focus change on salary row triggers auto-expense update
  container.querySelectorAll('input.name-input').forEach((inp) => {
    inp.addEventListener('blur', () => {
      const idx = parseInt(inp.dataset.idx);
      const item = items[idx];
      if (item && isSalaryRow(item, idx)) {
        updateAutoExpenses(pvdPercent);
        compute();
      }
    });
  });
}

function renderRows() {
  createRowContainer(state.incomes, 'income', incomeContainer);
  createRowContainer(state.expenses, 'expense', expenseContainer);
  if (savingContainer) {
    if (!Array.isArray(state.savings)) state.savings = [];
    createRowContainer(state.savings, 'saving', savingContainer);
    bindRows(savingContainer, 'saving');
  }
  bindRows(incomeContainer, 'income');
  bindRows(expenseContainer, 'expense');
}

// ── Add row ────────────────────────────────────────────────────────────────
function addRow(type) {
  undoMgr.push(captureSnapshot());
  const items = type === 'income' ? state.incomes : type === 'expense' ? state.expenses : state.savings;
  const container = type === 'income' ? incomeContainer : type === 'expense' ? expenseContainer : savingContainer;
  const idx = items.length;
  const defaultName =
    LANG === 'en'
      ? type === 'income'
        ? `Income ${idx + 1}`
        : type === 'expense'
          ? `Expense ${idx + 1}`
          : `Savings ${idx + 1}`
      : type === 'income'
        ? `รายได้ ${idx + 1}`
        : type === 'expense'
          ? `ค่าใช้จ่าย ${idx + 1}`
          : `เงินออม ${idx + 1}`;
  items.push({ name: defaultName, value: 0 });
  createRowContainer(items, type, container);
  // Re-add PVD % row after container rebuild (createRowContainer wipes it)
  if (type === 'income') renderPvdRow();
  bindRows(container, type);
  const nameInput = container.querySelector(`input.name-input[data-idx="${idx}"]`);
  if (nameInput) {
    nameInput.focus();
    nameInput.select();
  }
  compute();
  saveState();
  updateUndoUI();
}

incomeAddBtn.addEventListener('click', () => addRow('income'));
expenseAddBtn.addEventListener('click', () => addRow('expense'));
if (savingAddBtn) savingAddBtn.addEventListener('click', () => addRow('saving'));

// ── Compute & display ──────────────────────────────────────────────────────
function compute() {
  const totalIncome = state.incomes.reduce((s, item) => s + (item.value || 0), 0);
  const totalExpense = state.expenses.reduce((s, item) => s + (item.value || 0), 0);
  const totalSavings = (state.savings || []).reduce((s, item) => s + (item.value || 0), 0);
  const remaining = totalIncome - totalExpense - totalSavings;

  scIncomeValue.textContent = fmtCurrency(totalIncome);
  scExpenseValue.textContent = fmtCurrency(totalExpense);
  if (scSavingValue) scSavingValue.textContent = fmtCurrency(totalSavings);

  const resultsEl = document.getElementById('resultsContainer');
  resultsEl.innerHTML = '';

  // Income breakdown
  if (state.incomes.length > 0) {
    const incHeader = document.createElement('div');
    incHeader.style.cssText =
      'font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-faint);font-weight:700;margin:14px 0 6px;';
    incHeader.textContent = t('incomeBreakdown');
    resultsEl.appendChild(incHeader);

    state.incomes.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML = `
        <div class="result-left">
          <div class="rname">${escapeAttr(getDisplayName(item.name))}</div>
        </div>
        <div class="result-right">
          <div class="rval" style="color:var(--core)">+ ${fmtCurrency(item.value)}</div>
        </div>
      `;
      resultsEl.appendChild(row);
    });
  }

  // Expense breakdown
  if (state.expenses.length > 0) {
    const expHeader = document.createElement('div');
    expHeader.style.cssText =
      'font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-faint);font-weight:700;margin:14px 0 6px;';
    expHeader.textContent = t('expenseBreakdown');
    resultsEl.appendChild(expHeader);

    state.expenses.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'result-row';
      const autoType = getAutoType(item);
      const isAuto = autoType !== null;
      const isTax = autoType === 'tax';
      const isSso = autoType === 'sso';
      const isPvd = autoType === 'pvd';
      const signColor = isAuto ? 'var(--danger)' : 'var(--warn)';
      row.innerHTML = `
        <div class="result-left">
          <div class="rname">${escapeAttr(getDisplayName(item.name))}</div>
          ${isAuto ? `<div class="rmeta" style="color:var(--ink-faint)">${t('metaAutoPrefix')} • ${isTax ? t('metaTaxDesc') : isSso ? t('metaSSODesc') : isPvd ? t('metaPvdDesc') : ''}</div>` : ''}
        </div>
        <div class="result-right">
          <div class="rval" style="color:${signColor}">− ${fmtCurrency(item.value)}</div>
        </div>
      `;
      resultsEl.appendChild(row);
    });
  }

  // Savings breakdown (not in expenses, deducted before rebalance)
  if (state.savings && state.savings.length > 0) {
    const savHeader = document.createElement('div');
    savHeader.style.cssText =
      'font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-faint);font-weight:700;margin:14px 0 6px;';
    savHeader.textContent = t('savingBreakdown');
    resultsEl.appendChild(savHeader);

    state.savings.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'result-row';
      row.innerHTML = `
        <div class="result-left">
          <div class="rname">${escapeAttr(getDisplayName(item.name))}</div>
        </div>
        <div class="result-right">
          <div class="rval" style="color:#2563eb">− ${fmtCurrency(item.value)}</div>
        </div>
      `;
      resultsEl.appendChild(row);
    });
  }

  // Remaining box
  remainingValue.textContent = fmtCurrency(Math.round(remaining));
  remainingValue.className = 'rvalue ' + (remaining > 0.5 ? 'positive' : remaining < -0.5 ? 'negative' : 'zero');

  const remLabelEl = document.getElementById('remainingLabel');
  if (remLabelEl) {
    remLabelEl.textContent =
      totalSavings > 0
        ? LANG === 'en'
          ? 'Remaining for Investment (Rebalance)'
          : 'เงินคงเหลือสำหรับลงทุน (Rebalance)'
        : LANG === 'en'
          ? 'Remaining Money'
          : 'เงินคงเหลือ';
  }

  if (remaining > 0.5) {
    remainingNote.textContent =
      totalSavings > 0
        ? LANG === 'en'
          ? `Income (${fmt(totalIncome)}) − Expenses (${fmt(totalExpense)}) − Savings (${fmt(totalSavings)}) = ${fmt(remaining)} THB for investment`
          : `รายได้ (${fmt(totalIncome)}) − ค่าใช้จ่าย (${fmt(totalExpense)}) − เงินออม (${fmt(totalSavings)}) = เหลือลงทุน ${fmt(remaining)} บาท`
        : LANG === 'en'
          ? 'Money left over this month'
          : 'เหลือเงินในเดือนนี้';
  } else if (remaining < -0.5) {
    remainingNote.textContent =
      totalSavings > 0
        ? LANG === 'en'
          ? `Expenses and savings exceed income by ${fmt(Math.abs(remaining))} THB`
          : `รายจ่ายและเงินออมเกินรายได้ ${fmt(Math.abs(remaining))} บาท`
        : LANG === 'en'
          ? 'Expenses exceed income — review spending or boost income'
          : 'ใช้จ่ายเกินรายได้ — ลดค่าใช้จ่ายหรือเพิ่มรายได้';
  } else {
    remainingNote.textContent =
      LANG === 'en' ? 'Income, expenses, and savings are balanced' : 'รายได้ ค่าใช้จ่าย และเงินออมเท่ากันพอดี';
  }

  const bridgeBtn = document.getElementById('bridgeToRebalanceBtn');
  if (bridgeBtn) {
    bridgeBtn.style.display = remaining > 0.5 ? 'inline-flex' : 'none';
    const bridgeLbl = document.getElementById('lblBridgeBtn');
    if (bridgeLbl) {
      bridgeLbl.textContent =
        LANG === 'en'
          ? `Send investable money (${fmt(remaining)} THB) to Rebalance`
          : `นำเงินเหลือลงทุน (${fmt(remaining)} บาท) ไป Rebalance`;
    }
  }

  saveState();

  // ── Emergency Runway Gauge ──
  const runwayContent = document.getElementById('runwayContent');
  const isEN = LANG === 'en';

  if (state.showEmergencyRunway && runwayContent) {
    runwayContent.style.display = '';
    const reserve = Math.max(0, Number(state.currentEmergencyReserve) || 0);
    const monthsEl = document.getElementById('runwayMonths');
    const unitEl = document.getElementById('runwayUnit');
    const badgeEl = document.getElementById('runwayBadge');
    const barFill = document.getElementById('runwayBarFill');
    const noteEl = document.getElementById('runwayTargetNote');

    if (totalExpense <= 0) {
      if (monthsEl) monthsEl.textContent = '—';
      if (unitEl)
        unitEl.innerHTML = (isEN ? 'months' : 'เดือน') + '<br><span style="font-size:11px; opacity:0.7;">—</span>';
      if (badgeEl) {
        badgeEl.textContent = isEN ? 'Please enter monthly expenses first' : 'กรุณากรอกค่าใช้จ่ายเพื่อคำนวณเงินสำรอง';
        badgeEl.style.background = 'var(--panel-3, rgba(0,0,0,0.06))';
        badgeEl.style.color = 'var(--ink-dim)';
      }
      if (barFill) {
        barFill.style.width = '0%';
        barFill.style.background = 'transparent';
      }
      if (noteEl) noteEl.innerHTML = '';
    } else {
      const runwayRaw = reserve > 0 ? reserve / totalExpense : 0;
      const runwayVal = Math.round(runwayRaw * 10) / 10;

      if (monthsEl) monthsEl.textContent = runwayVal.toFixed(1);
      if (unitEl) {
        unitEl.innerHTML =
          (isEN ? 'months' : 'เดือน') +
          '<br><span style="font-size:11px; opacity:0.7;">' +
          `${fmt(reserve)} ÷ ${fmt(totalExpense)}` +
          '</span>';
      }

      let color, bg, label, pct;
      if (reserve <= 0) {
        color = '#ef4444';
        bg = 'rgba(239,68,68,0.12)';
        label = isEN ? '⚠️ No reserve entered yet' : '⚠️ ยังไม่ได้ระบุเงินสำรองฉุกเฉิน';
        pct = 0;
      } else if (runwayVal < 3) {
        color = '#ef4444';
        bg = 'rgba(239,68,68,0.12)';
        label = isEN ? EN.runwayWarning : '⚠️ อันตราย — สำรองไม่ถึง 3 เดือน';
        pct = Math.min((runwayVal / 3) * 33, 33);
      } else if (runwayVal <= 6) {
        color = '#eab308';
        bg = 'rgba(234,179,8,0.12)';
        label = isEN ? EN.runwayHealthy : '✅ ปลอดภัย — สำรอง 3–6 เดือน';
        pct = 33 + ((runwayVal - 3) / 3) * 34;
      } else {
        color = '#22c55e';
        bg = 'rgba(34,197,94,0.12)';
        label = isEN ? EN.runwaySolid : '💪 มั่นคง — สำรองมากกว่า 6 เดือน';
        pct = Math.min(67 + ((runwayVal - 6) / 6) * 33, 100);
      }

      if (barFill) {
        barFill.style.width = pct + '%';
        barFill.style.background = color;
      }
      if (badgeEl) {
        badgeEl.textContent = label;
        badgeEl.style.background = bg;
        badgeEl.style.color = color;
      }

      if (noteEl) {
        const target3M = Math.round(totalExpense * 3);
        const target6M = Math.round(totalExpense * 6);
        const targetText = isEN
          ? `🎯 <strong>Target Buffers:</strong> 3-Month Min = <strong>${fmt(target3M)} THB</strong> | 6-Month Recommended = <strong>${fmt(target6M)} THB</strong>`
          : `🎯 <strong>เป้าหมายแนะนำ:</strong> ขั้นต่ำ 3 เดือน = <strong>${fmt(target3M)} บาท</strong> | มั่นคง 6 เดือน = <strong>${fmt(target6M)} บาท</strong>`;

        let paceText = '';
        if (reserve < target6M) {
          const deficit = target6M - reserve;
          if (totalSavings > 0) {
            const monthsToGoal = Math.ceil(deficit / totalSavings);
            paceText = isEN
              ? `<div style="margin-top:4px;">🌱 Need <strong>${fmt(deficit)} THB</strong> more for 6-month safety — at your current savings rate (<strong>${fmt(totalSavings)} THB/mo</strong>), you will reach it in <strong>${monthsToGoal} months</strong>.</div>`
              : `<div style="margin-top:4px;">🌱 ยังขาดอีก <strong>${fmt(deficit)} บาท</strong> ถึงเป้าหมาย 6 เดือน — ด้วยเงินออมปัจจุบัน (<strong>${fmt(totalSavings)} บาท/เดือน</strong>) จะถึงเป้าหมายในอีก <strong>${monthsToGoal} เดือน</strong></div>`;
          } else {
            paceText = isEN
              ? `<div style="margin-top:4px; color:var(--ink-faint);">💡 Allocate funds into the <strong>Savings</strong> section above to start accumulating towards your 6-month reserve.</div>`
              : `<div style="margin-top:4px; color:var(--ink-faint);">💡 เริ่มจัดสรรเงินในหมวด <strong>"เงินออม"</strong> ด้านบน เพื่อสะสมเงินสำรองฉุกเฉินให้ครบ 6 เดือน</div>`;
          }
        } else {
          paceText = isEN
            ? `<div style="margin-top:4px; color:#16a34a;">🎉 <strong>Congratulations!</strong> You have fully covered the recommended 6-month emergency buffer.</div>`
            : `<div style="margin-top:4px; color:#16a34a;">🎉 <strong>ยอดเยี่ยมมาก!</strong> คุณมีเงินสำรองฉุกเฉินครบตามเป้าหมาย 6 เดือนแล้ว สามารถนำเงินส่วนเกินไปลงทุนได้อย่างสบายใจ</div>`;
        }

        noteEl.innerHTML = targetText + paceText;
      }
    }
  } else if (runwayContent) {
    runwayContent.style.display = 'none';
  }

  updateCashflowVisual(totalIncome, totalExpense, totalSavings, remaining);
}

// ── Visual Cashflow Allocation Bar & Waterfall ─────────────────────────────
function updateCashflowVisual(totalIncome, totalExpense, totalSavings, remaining) {
  const panel = document.getElementById('cashflowPanel');
  if (!panel) return;

  let deductions = 0;
  let generalExpenses = 0;
  (state.expenses || []).forEach((item) => {
    const val = item.value || 0;
    if (getAutoType(item) !== null) {
      deductions += val;
    } else {
      generalExpenses += val;
    }
  });

  const isEN = LANG === 'en';
  const base = Math.max(totalIncome, deductions + generalExpenses + totalSavings, 0.0001);

  // 1. Proportions Bar segments
  const segDeductions = document.getElementById('cfSegDeductions');
  const segExpenses = document.getElementById('cfSegExpenses');
  const segSavings = document.getElementById('cfSegSavings');
  const segRemaining = document.getElementById('cfSegRemaining');

  const hasData = totalIncome > 0 || deductions > 0 || generalExpenses > 0 || totalSavings > 0;
  const pctDeductions = hasData ? ((deductions / base) * 100).toFixed(1) : '0';
  const pctExpenses = hasData ? ((generalExpenses / base) * 100).toFixed(1) : '0';
  const pctSavings = hasData ? ((totalSavings / base) * 100).toFixed(1) : '0';
  const pctRemaining = hasData && remaining > 0 ? ((remaining / base) * 100).toFixed(1) : '0';

  if (segDeductions) segDeductions.style.width = `${pctDeductions}%`;
  if (segExpenses) segExpenses.style.width = `${pctExpenses}%`;
  if (segSavings) segSavings.style.width = `${pctSavings}%`;
  if (segRemaining) segRemaining.style.width = `${pctRemaining}%`;

  // 2. Legend values
  const valIncome = document.getElementById('cfValIncome');
  const valDeductions = document.getElementById('cfValDeductions');
  const valExpenses = document.getElementById('cfValExpenses');
  const valSavings = document.getElementById('cfValSavings');
  const valRemaining = document.getElementById('cfValRemaining');

  const incBase = totalIncome > 0 ? totalIncome : deductions + generalExpenses + totalSavings || 1;
  const incPct = (v) => (totalIncome > 0 || v > 0 ? `${((v / incBase) * 100).toFixed(1)}%` : '0%');

  if (valIncome) valIncome.textContent = `${fmtCurrency(totalIncome)} (100%)`;
  if (valDeductions) valDeductions.textContent = `${fmtCurrency(deductions)} (${incPct(deductions)})`;
  if (valExpenses) valExpenses.textContent = `${fmtCurrency(generalExpenses)} (${incPct(generalExpenses)})`;
  if (valSavings) valSavings.textContent = `${fmtCurrency(totalSavings)} (${incPct(totalSavings)})`;
  if (valRemaining) valRemaining.textContent = `${fmtCurrency(remaining)} (${incPct(remaining)})`;

  const legendDotRemaining = document.getElementById('cfLegendDotRemaining');
  if (legendDotRemaining) {
    legendDotRemaining.style.background = remaining > 0 ? '#059669' : remaining === 0 ? '#64748b' : '#dc2626';
  }

  // 3. Cashflow Surplus / Deficit Badge
  const badge = document.getElementById('cashflowSurplusBadge');
  if (badge) {
    if (remaining > 0) {
      badge.textContent = isEN ? `+${fmt(remaining)} THB Surplus` : `+${fmt(remaining)} บาท กระแสเงินสดบวก`;
      badge.style.background = 'rgba(16, 185, 129, 0.12)';
      badge.style.color = '#059669';
    } else if (remaining === 0) {
      badge.textContent = isEN ? '0 THB Balanced' : '0 บาท สมดุลพอดี';
      badge.style.background = 'rgba(100, 116, 139, 0.12)';
      badge.style.color = 'var(--ink-faint)';
    } else {
      badge.textContent = isEN ? `${fmt(remaining)} THB Deficit` : `${fmt(remaining)} บาท ติดลบ`;
      badge.style.background = 'rgba(239, 68, 68, 0.12)';
      badge.style.color = '#dc2626';
    }
  }

  // 4. Render SVG Waterfall
  renderCashflowWaterfall(totalIncome, deductions, generalExpenses, totalSavings, remaining);

  // 5. Render 50/30/20 Budget Rule Donut & Runway
  renderBudgetRule503020(totalIncome, totalExpense, totalSavings, remaining);
}

/**
 * Render interactive SVG Cashflow Waterfall Diagram
 * Gross Inflow -> Deductions -> Expenses -> Savings -> Net Remaining Surplus/Deficit
 */
function renderCashflowWaterfall(totalIncome, deductions, generalExpenses, totalSavings, remaining) {
  const svg = document.getElementById('svgCashflowWaterfall');
  if (!svg) return;

  const isEN = LANG === 'en';
  const hasData = totalIncome > 0 || deductions > 0 || generalExpenses > 0 || totalSavings > 0;
  if (!hasData) {
    const msg = isEN
      ? 'Enter income and expenses to visualize cashflow waterfall'
      : 'ระบุรายได้และค่าใช้จ่ายเพื่อดูกระแสเงินสดสายธารน้ำตก';
    svg.innerHTML = `<text x="300" y="115" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="inherit">${msg}</text>`;
    return;
  }

  const steps = [
    {
      id: 'income',
      name: isEN ? 'Gross Income' : 'รายได้รวม',
      sub: isEN ? 'Inflow' : 'รับเข้า',
      start: 0,
      end: totalIncome,
      delta: totalIncome,
      type: 'inflow',
      color: '#10b981',
    },
    {
      id: 'deductions',
      name: isEN ? 'Deductions' : 'หักกฎหมาย',
      sub: isEN ? 'Tax/SSO/PVD' : 'ภาษี/SSO/PVD',
      start: totalIncome,
      end: totalIncome - deductions,
      delta: -deductions,
      type: 'outflow',
      color: '#8b5cf6',
    },
    {
      id: 'expenses',
      name: isEN ? 'Expenses' : 'ค่าใช้จ่าย',
      sub: isEN ? 'Living cost' : 'ค่าใช้จ่ายทั่วไป',
      start: totalIncome - deductions,
      end: totalIncome - deductions - generalExpenses,
      delta: -generalExpenses,
      type: 'outflow',
      color: '#f43f5e',
    },
    {
      id: 'savings',
      name: isEN ? 'Savings' : 'เงินออม',
      sub: isEN ? 'Invest/Fund' : 'ออม/ลงทุน',
      start: totalIncome - deductions - generalExpenses,
      end: remaining,
      delta: -totalSavings,
      type: 'outflow',
      color: '#0284c7',
    },
    {
      id: 'remaining',
      name: remaining >= 0 ? (isEN ? 'Net Surplus' : 'คงเหลือสุทธิ') : isEN ? 'Deficit' : 'ขาดดุล (ติดลบ)',
      sub: remaining >= 0 ? (isEN ? 'Investable' : 'ส่วนเกินลงทุน') : isEN ? 'Negative' : 'เงินไม่พอ',
      start: 0,
      end: remaining,
      delta: remaining,
      type: 'net',
      color: remaining > 0 ? '#059669' : remaining === 0 ? '#64748b' : '#dc2626',
    },
  ];

  const valMax = Math.max(totalIncome, deductions + generalExpenses + totalSavings, 1);
  const valMin = Math.min(0, remaining);
  const valRange = Math.max(valMax - valMin, 1);

  const width = 600;
  const height = 230;
  const padding = { top: 32, right: 25, bottom: 42, left: 60 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const mapY = (v) => padding.top + plotHeight - ((v - valMin) / valRange) * plotHeight;
  const zeroY = mapY(0);

  let svgHtml = '';

  // 1. Gridlines
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const ratio = i / gridSteps;
    const v = valMin + ratio * valRange;
    const y = mapY(v);
    svgHtml += `<line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" stroke="var(--line, rgba(148,163,184,0.22))" stroke-width="1" stroke-dasharray="3,3" />`;

    let lbl = '';
    const absV = Math.abs(v);
    if (absV >= 1000000) lbl = `${(v / 1000000).toFixed(1)}M`;
    else if (absV >= 1000) lbl = `${(v / 1000).toFixed(0)}K`;
    else lbl = Math.round(v).toString();

    svgHtml += `<text x="${padding.left - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="var(--ink-faint, #94a3b8)" font-size="10" font-family="inherit">${lbl}</text>`;
  }

  // 2. Zero Baseline (if valMin < 0, render prominent line)
  if (valMin < 0) {
    svgHtml += `<line x1="${padding.left}" y1="${zeroY.toFixed(1)}" x2="${width - padding.right}" y2="${zeroY.toFixed(1)}" stroke="var(--ink-faint, #64748b)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.8" />`;
  }

  // 3. Connectors & Bars
  const colWidth = plotWidth / steps.length;
  const barWidth = 54;

  steps.forEach((step, idx) => {
    const cx = padding.left + (idx + 0.5) * colWidth;
    const bx = cx - barWidth / 2;
    const yTop = mapY(Math.max(step.start, step.end));
    const yBottom = mapY(Math.min(step.start, step.end));
    const rawHeight = Math.abs(yBottom - yTop);
    const barHeight = rawHeight === 0 ? 2 : Math.max(2, rawHeight);
    const drawY = Math.min(yTop, height - padding.bottom - barHeight);

    // Connecting bridge line to next step
    if (idx < steps.length - 1) {
      const nextCx = padding.left + (idx + 1.5) * colWidth;
      const nextBx = nextCx - barWidth / 2;
      const bridgeLevel = idx === 3 ? remaining : step.end;
      const bridgeY = mapY(bridgeLevel);
      svgHtml += `<line x1="${(bx + barWidth).toFixed(1)}" y1="${bridgeY.toFixed(1)}" x2="${nextBx.toFixed(1)}" y2="${bridgeY.toFixed(1)}" stroke="var(--line, rgba(148,163,184,0.45))" stroke-width="1.5" stroke-dasharray="3,3" />`;
    }

    // Bar Rect
    const incBase = totalIncome > 0 ? totalIncome : valMax;
    const pctVal = Math.abs((step.delta / incBase) * 100);
    const tip = `${step.name}: ${step.delta >= 0 ? '+' : ''}${fmtCurrency(step.delta)} (${pctVal.toFixed(1)}%)`;
    svgHtml += `
      <g class="waterfall-bar" style="cursor:pointer;">
        <rect x="${bx.toFixed(1)}" y="${drawY.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="4" fill="${step.color}" opacity="0.9">
          <title>${tip}</title>
        </rect>
      </g>
    `;

    // Value label above/below bar
    const pctStr = pctVal > 0 ? `${pctVal.toFixed(0)}%` : '0%';
    const valSign = step.delta > 0 ? '+' : step.delta < 0 ? '-' : '';
    const absAmt = Math.abs(step.delta);
    let shortAmt = '';
    if (absAmt >= 1000000) shortAmt = `${(absAmt / 1000000).toFixed(1)}M`;
    else if (absAmt >= 1000) shortAmt = `${(absAmt / 1000).toFixed(0)}K`;
    else shortAmt = Math.round(absAmt).toString();

    const lblY = step.delta < 0 && step.type === 'net' ? drawY + barHeight + 13 : drawY - 6;
    svgHtml += `<text x="${cx.toFixed(1)}" y="${lblY.toFixed(1)}" text-anchor="middle" fill="var(--ink, #1e293b)" font-size="10.5" font-weight="700" font-family="inherit">${valSign}${shortAmt} <tspan font-weight="400" fill="var(--ink-dim, #64748b)" font-size="9.5">(${pctStr})</tspan></text>`;

    // Category X-axis labels
    svgHtml += `<text x="${cx.toFixed(1)}" y="${(height - padding.bottom + 16).toFixed(1)}" text-anchor="middle" fill="var(--ink, #334155)" font-size="11" font-weight="600" font-family="inherit">${step.name}</text>`;
    svgHtml += `<text x="${cx.toFixed(1)}" y="${(height - padding.bottom + 29).toFixed(1)}" text-anchor="middle" fill="var(--ink-dim, #94a3b8)" font-size="9" font-family="inherit">${step.sub}</text>`;
  });

  svg.innerHTML = svgHtml;
}

// ── 50/30/20 Budget Rule Compliance Donut & Runway Engine ───────────────────
const NEEDS_KEYWORDS = [
  'บ้าน',
  'เช่า',
  'หอ',
  'คอนโด',
  'ผ่อน',
  'ไฟ',
  'น้ำ',
  'เน็ต',
  'โทร',
  'เดินทาง',
  'น้ำมัน',
  'รถ',
  'bts',
  'mrt',
  'อาหาร',
  'กับข้าว',
  'ยา',
  'ประกัน',
  'ดอกเบี้ย',
  'กู้',
  'บัตร',
  'rent',
  'mortgage',
  'utility',
  'electric',
  'water',
  'internet',
  'phone',
  'transport',
  'fuel',
  'grocery',
  'food',
  'insurance',
  'loan',
  'bill',
];

const WANTS_KEYWORDS = [
  'เที่ยว',
  'กาแฟ',
  'คาเฟ่',
  'กินนอก',
  'ช้อป',
  'เสื้อผ้า',
  'เกม',
  'หนัง',
  'สตรีมมิ่ง',
  'ปาร์ตี้',
  'บุฟเฟต์',
  'ของเล่น',
  'dining',
  'coffee',
  'cafe',
  'shopping',
  'entertainment',
  'netflix',
  'game',
  'travel',
  'vacation',
  'hobby',
  'party',
];

function classifyBudgetType(item, defaultType = 'expense') {
  if (!item) return 'want';
  if (item.budgetType === 'need' || item.budgetType === 'want' || item.budgetType === 'saving') {
    return item.budgetType;
  }
  if (defaultType === 'saving') return 'saving';
  const name = String(item.name || '').toLowerCase();
  if (name.includes('tax') || name.includes('ภาษี') || name.includes('sso') || name.includes('ประกันสังคม')) {
    return 'need';
  }
  if (name.includes('pvd') || name.includes('สำรองเลี้ยงชีพ') || name.includes('ออม') || name.includes('ลงทุน')) {
    return 'saving';
  }
  if (WANTS_KEYWORDS.some((kw) => name.includes(kw))) {
    return 'want';
  }
  if (NEEDS_KEYWORDS.some((kw) => name.includes(kw)) && !name.includes('นอกบ้าน')) {
    return 'need';
  }
  return 'want';
}

function calculateBudgetRule503020({ totalIncome = 0, expenses = [], savings = [], remaining = 0 } = {}) {
  let needsTotal = 0;
  let wantsTotal = 0;
  let savingsTotal = 0;

  for (const item of expenses) {
    const val = Math.max(0, Number(item.value) || 0);
    const bType = classifyBudgetType(item, 'expense');
    if (bType === 'need') needsTotal += val;
    else if (bType === 'saving') savingsTotal += val;
    else wantsTotal += val;
  }

  for (const item of savings) {
    const val = Math.max(0, Number(item.value) || 0);
    savingsTotal += val;
  }

  if (remaining > 0) {
    savingsTotal += remaining;
  }

  const totalBudget = needsTotal + wantsTotal + savingsTotal;
  const base = Math.max(Number(totalIncome) || 0, totalBudget, 0.0001);

  const needsPct = Math.round((needsTotal / base) * 100 * 10) / 10;
  const wantsPct = Math.round((wantsTotal / base) * 100 * 10) / 10;
  const savingsPct = Math.round((savingsTotal / base) * 100 * 10) / 10;

  let status = 'moderate';
  if (savingsPct >= 30) {
    status = 'excellent_savings';
  } else if (needsPct <= 55 && wantsPct <= 35 && savingsPct >= 18) {
    status = 'balanced';
  } else if (needsPct > 60) {
    status = 'high_needs';
  } else if (wantsPct > 40) {
    status = 'high_wants';
  } else if (savingsPct < 10) {
    status = 'low_savings';
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82
  const needsArc = (needsPct / 100) * circumference;
  const wantsArc = (wantsPct / 100) * circumference;
  const savingsArc = (savingsPct / 100) * circumference;

  return {
    needsTotal,
    wantsTotal,
    savingsTotal,
    totalBudget,
    base,
    needsPct,
    wantsPct,
    savingsPct,
    status,
    donut: {
      radius,
      circumference: Math.round(circumference * 100) / 100,
      needsArc: Math.round(needsArc * 100) / 100,
      wantsArc: Math.round(wantsArc * 100) / 100,
      savingsArc: Math.round(savingsArc * 100) / 100,
      needsOffset: 0,
      wantsOffset: -Math.round(needsArc * 100) / 100,
      savingsOffset: -Math.round((needsArc + wantsArc) * 100) / 100,
    },
  };
}

function calculateEmergencyRunway({ reserve = 0, monthlyExpenses = 0 } = {}) {
  const res = Math.max(0, Number(reserve) || 0);
  const exp = Math.max(0, Number(monthlyExpenses) || 0);

  const months = exp > 0 ? res / exp : 0;
  const monthsClamped = Math.round(months * 10) / 10;

  let tier = 'danger';
  if (res <= 0 || exp <= 0) {
    tier = 'unspecified';
  } else if (monthsClamped < 3) {
    tier = 'danger';
  } else if (monthsClamped <= 6) {
    tier = 'healthy';
  } else {
    tier = 'solid';
  }

  const target3M = exp * 3;
  const target6M = exp * 6;
  const deficit6M = Math.max(0, target6M - res);

  return {
    reserve: res,
    monthlyExpenses: exp,
    months: monthsClamped,
    tier,
    target3M,
    target6M,
    deficit6M,
  };
}

function renderBudgetRule503020(totalIncome, totalExpense, totalSavings, remaining) {
  const container = document.getElementById('cashflow503020Container');
  if (!container) return;

  const b = calculateBudgetRule503020({
    totalIncome,
    expenses: state.expenses || [],
    savings: state.savings || [],
    remaining,
  });

  const isEN = LANG === 'en';
  const unit = isEN ? 'THB' : 'บาท';

  // 1. Update SVG Donut Circles
  const cNeeds = document.getElementById('donutCircleNeeds');
  const cWants = document.getElementById('donutCircleWants');
  const cSavings = document.getElementById('donutCircleSavings');

  if (cNeeds) {
    cNeeds.setAttribute('stroke-dasharray', `${b.donut.needsArc} ${b.donut.circumference}`);
    cNeeds.setAttribute('stroke-dashoffset', String(b.donut.needsOffset));
  }
  if (cWants) {
    cWants.setAttribute('stroke-dasharray', `${b.donut.wantsArc} ${b.donut.circumference}`);
    cWants.setAttribute('stroke-dashoffset', String(b.donut.wantsOffset));
  }
  if (cSavings) {
    cSavings.setAttribute('stroke-dasharray', `${b.donut.savingsArc} ${b.donut.circumference}`);
    cSavings.setAttribute('stroke-dashoffset', String(b.donut.savingsOffset));
  }

  // 2. Status Badge
  const badge = document.getElementById('badge503020Status');
  if (badge) {
    let text = isEN ? 'Balanced 50/30/20 🎉' : 'สมดุล 50/30/20 🎉';
    let bg = 'rgba(16, 185, 129, 0.12)';
    let color = '#059669';

    if (b.status === 'excellent_savings') {
      text = isEN ? 'Super Saver 💎' : 'ออมดีเยี่ยม 💎';
      bg = 'rgba(16, 185, 129, 0.15)';
      color = '#047857';
    } else if (b.status === 'high_needs') {
      text = isEN ? 'High Needs ⚠️' : 'จำเป็นสูงเกิน ⚠️';
      bg = 'rgba(245, 158, 11, 0.12)';
      color = '#d97706';
    } else if (b.status === 'high_wants') {
      text = isEN ? 'High Wants ⚠️' : 'ตามใจสูงเกิน ⚠️';
      bg = 'rgba(239, 68, 68, 0.12)';
      color = '#dc2626';
    } else if (b.status === 'low_savings') {
      text = isEN ? 'Low Savings ⚠️' : 'ออมน้อยเกิน ⚠️';
      bg = 'rgba(239, 68, 68, 0.12)';
      color = '#dc2626';
    } else if (b.status === 'moderate') {
      text = isEN ? 'Moderate' : 'ปานกลาง';
      bg = 'rgba(100, 116, 139, 0.12)';
      color = 'var(--ink-faint)';
    }

    badge.textContent = text;
    badge.style.background = bg;
    badge.style.color = color;
  }

  // 3. Category Value labels & Mini Progress bars
  const vNeeds = document.getElementById('val503020Needs');
  const bNeeds = document.getElementById('bar503020Needs');
  if (vNeeds) vNeeds.textContent = `${fmt(b.needsTotal)} ${unit} (${b.needsPct}%)`;
  if (bNeeds) bNeeds.style.width = `${Math.min(100, (b.needsPct / 50) * 100)}%`;

  const vWants = document.getElementById('val503020Wants');
  const bWants = document.getElementById('bar503020Wants');
  if (vWants) vWants.textContent = `${fmt(b.wantsTotal)} ${unit} (${b.wantsPct}%)`;
  if (bWants) bWants.style.width = `${Math.min(100, (b.wantsPct / 30) * 100)}%`;

  const vSavings = document.getElementById('val503020Savings');
  const bSavings = document.getElementById('bar503020Savings');
  if (vSavings) vSavings.textContent = `${fmt(b.savingsTotal)} ${unit} (${b.savingsPct}%)`;
  if (bSavings) bSavings.style.width = `${Math.min(100, (b.savingsPct / 20) * 100)}%`;

  // 4. Mini Runway Callout inside 50/30/20
  const vRunway = document.getElementById('val503020Runway');
  if (vRunway) {
    const reserve = Number(state.currentEmergencyReserve) || 0;
    const expBase = b.needsTotal > 0 ? b.needsTotal : totalExpense;
    const r = calculateEmergencyRunway({ reserve, monthlyExpenses: expBase });
    const monthsText = `${r.months.toFixed(1)} ${isEN ? 'months' : 'เดือน'}`;

    let color = 'var(--ink-dim)';
    if (r.tier === 'danger') color = '#dc2626';
    else if (r.tier === 'healthy') color = '#d97706';
    else if (r.tier === 'solid') color = '#059669';

    vRunway.textContent = monthsText;
    vRunway.style.color = color;
  }
}

// ── Cashflow View Mode Toggle (Waterfall vs Bar vs 50/30/20) ────────────────
const btnCfWaterfall = document.getElementById('btnCfViewWaterfall');
const btnCfBar = document.getElementById('btnCfViewBar');
const btnCf503020 = document.getElementById('btnCfView503020');
const cfWaterfallContainer = document.getElementById('cashflowWaterfallContainer');
const cfBarContainer = document.getElementById('cashflowBarContainer');
const cf503020Container = document.getElementById('cashflow503020Container');

function setCashflowView(view) {
  const isWf = view === 'waterfall';
  const isBar = view === 'bar';
  const is50 = view === '503020';

  if (btnCfWaterfall) btnCfWaterfall.classList.toggle('active', isWf);
  if (btnCfBar) btnCfBar.classList.toggle('active', isBar);
  if (btnCf503020) btnCf503020.classList.toggle('active', is50);

  if (cfWaterfallContainer) cfWaterfallContainer.style.display = isWf ? 'block' : 'none';
  if (cfBarContainer) cfBarContainer.style.display = isBar ? 'flex' : 'none';
  if (cf503020Container) cf503020Container.style.display = is50 ? 'block' : 'none';

  try {
    localStorage.setItem('moneySuperapp.cashflowView', view);
  } catch (_e) {}
}

if (btnCfWaterfall) {
  btnCfWaterfall.addEventListener('click', () => setCashflowView('waterfall'));
}
if (btnCfBar) {
  btnCfBar.addEventListener('click', () => setCashflowView('bar'));
}
if (btnCf503020) {
  btnCf503020.addEventListener('click', () => setCashflowView('503020'));
}

const savedCfView = (() => {
  try {
    return localStorage.getItem('moneySuperapp.cashflowView') || 'waterfall';
  } catch (_e) {
    return 'waterfall';
  }
})();
setCashflowView(savedCfView);

function onToggleRunway(checked) {
  state.showEmergencyRunway = !!checked;
  const content = document.getElementById('runwayContent');
  if (content) {
    content.style.display = checked ? '' : 'none';
  }
  if (checked) {
    const input = document.getElementById('txtCurrentReserve');
    if (input && state.currentEmergencyReserve > 0) {
      input.value = state.currentEmergencyReserve;
    }
  }
  compute();
  saveState();
}

function onCurrentReserveChange(val) {
  const num = Math.max(0, parseFloat(val) || 0);
  state.currentEmergencyReserve = num;
  compute();
  saveState();
}

function sendToRebalance() {
  const totalIncome = state.incomes.reduce((s, item) => s + (item.value || 0), 0);
  const totalExpense = state.expenses.reduce((s, item) => s + (item.value || 0), 0);
  const totalSavings = (state.savings || []).reduce((s, item) => s + (item.value || 0), 0);
  const remaining = Math.round(totalIncome - totalExpense - totalSavings);
  if (remaining > 0) {
    try {
      localStorage.setItem('moneySuperapp.pendingBudget', String(remaining));
    } catch (e) {}
    if (window.parent && typeof window.parent.switchToTab === 'function') {
      window.parent.switchToTab('rebalance');
    } else {
      const targetOrigin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '*';
      window.parent.postMessage({ action: 'switchToTab', target: 'rebalance' }, targetOrigin);
    }
  }
}

// ── Export Features (CSV, JSON, Clipboard Summary) ────────────────────────
function csvSafe(val) {
  let str = String(val == null ? '' : val);
  if (/^\s*[\t\r=+\-@]/.test(str)) {
    if (isNaN(Number(str))) {
      str = "'" + str;
    }
  }
  if (/[",\r\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function exportCSV() {
  const isEN = LANG === 'en';
  const totalIncome = state.incomes.reduce((s, item) => s + (item.value || 0), 0);
  const totalExpense = state.expenses.reduce((s, item) => s + (item.value || 0), 0);
  const totalSavings = (state.savings || []).reduce((s, item) => s + (item.value || 0), 0);
  const remaining = Math.round(totalIncome - totalExpense - totalSavings);

  const header = isEN
    ? 'Category,Item,Amount (THB),Note'
    : 'หมวดหมู่ / Category,รายการ / Item,จำนวนเงิน (บาท) / Amount (THB),หมายเหตุ / Note';

  const rows = [header];

  function addRow(cat, item, amount, note = '') {
    rows.push(
      [csvSafe(cat), csvSafe(item), typeof amount === 'number' ? amount : csvSafe(amount), csvSafe(note)].join(','),
    );
  }

  // 1. Income rows
  const catIncome = isEN ? 'Income' : 'รายได้';
  state.incomes.forEach((item, idx) => {
    const isSal = isSalaryRow(item, idx);
    const note = isSal ? (isEN ? 'Primary Salary' : 'เงินเดือนหลัก') : '';
    addRow(catIncome, getDisplayName(item.name), Math.round(item.value || 0), note);
  });
  addRow(catIncome, isEN ? 'Total Income' : 'รวมรายได้', Math.round(totalIncome), '');

  // 2. Expense rows
  const catExpense = isEN ? 'Expense' : 'ค่าใช้จ่าย';
  state.expenses.forEach((item) => {
    const autoType = getAutoType(item);
    let note = '';
    if (autoType === 'tax') note = isEN ? 'Estimated Tax' : 'ภาษีเงินได้ (ประมาณการ)';
    else if (autoType === 'sso') note = isEN ? 'Social Security (SSO)' : 'ประกันสังคม (SSO)';
    else if (autoType === 'pvd') note = isEN ? `Provident Fund (${pvdPercent}%)` : `กองทุนสำรองเลี้ยงชีพ (${pvdPercent}%)`;
    addRow(catExpense, getDisplayName(item.name), Math.round(item.value || 0), note);
  });
  addRow(catExpense, isEN ? 'Total Expenses' : 'รวมค่าใช้จ่าย', Math.round(totalExpense), '');

  // 3. Savings rows
  if (state.savings && state.savings.length > 0) {
    const catSaving = isEN ? 'Savings' : 'เงินออม';
    state.savings.forEach((item) => {
      addRow(catSaving, getDisplayName(item.name), Math.round(item.value || 0), '');
    });
    addRow(catSaving, isEN ? 'Total Savings' : 'รวมเงินออม', Math.round(totalSavings), '');
  }

  // 4. Net Remaining Money
  const catSummary = isEN ? 'Summary' : 'สรุป';
  const remLabel =
    totalSavings > 0
      ? isEN
        ? 'Remaining for Investment'
        : 'เงินคงเหลือสำหรับลงทุน'
      : isEN
        ? 'Remaining Money'
        : 'เงินคงเหลือ';
  const remNote =
    remaining > 0
      ? isEN
        ? 'Surplus'
        : 'เหลือเงิน'
      : remaining < 0
        ? isEN
          ? 'Deficit'
          : 'เกินงบ'
        : isEN
          ? 'Balanced'
          : 'สมดุล';
  addRow(catSummary, remLabel, remaining, remNote);

  // 5. Emergency Reserve & Runway
  if (state.showEmergencyRunway) {
    const catRunway = isEN ? 'Emergency Runway' : 'เงินสำรองฉุกเฉิน';
    const reserve = Number(state.currentEmergencyReserve) || 0;
    const runwayMonths = totalExpense > 0 ? Math.round((reserve / totalExpense) * 10) / 10 : 0;
    const note =
      totalExpense > 0
        ? isEN
          ? `${runwayMonths.toFixed(1)} months buffer`
          : `สำรองได้ ${runwayMonths.toFixed(1)} เดือน`
        : '';
    addRow(catRunway, isEN ? 'Current Emergency Reserve' : 'เงินสำรองฉุกเฉินปัจจุบัน', Math.round(reserve), note);
    addRow(
      catRunway,
      isEN ? 'Runway (Months)' : 'ระยะเวลาเงินสำรอง (เดือน)',
      totalExpense > 0 ? runwayMonths.toFixed(1) : 0,
      '',
    );
  }

  const bom = '\uFEFF';
  const csvContent = bom + rows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `remaining_money_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function fallbackCopyText(text, onSuccess) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (typeof onSuccess === 'function') onSuccess();
  } catch (e) {}
}

function copySummary() {
  const isEN = LANG === 'en';
  const totalIncome = state.incomes.reduce((s, item) => s + (item.value || 0), 0);
  const totalExpense = state.expenses.reduce((s, item) => s + (item.value || 0), 0);
  const totalSavings = (state.savings || []).reduce((s, item) => s + (item.value || 0), 0);
  const remaining = Math.round(totalIncome - totalExpense - totalSavings);

  const lines = [
    isEN ? '📊 Monthly Cash Flow Summary' : '📊 สรุปกระแสเงินสดรายเดือน',
    '==============================',
    (isEN ? 'Total Income: ' : 'รวมรายได้: ') + fmtCurrency(totalIncome),
  ];

  if (state.incomes.length > 0) {
    state.incomes.forEach((item) => {
      const name = getDisplayName(item.name);
      lines.push(`  + ${name}: ${fmtCurrency(item.value || 0)}`);
    });
  }

  lines.push('');
  lines.push((isEN ? 'Total Expenses: ' : 'รวมค่าใช้จ่าย: ') + fmtCurrency(totalExpense));
  if (state.expenses.length > 0) {
    state.expenses.forEach((item) => {
      const name = getDisplayName(item.name);
      const aType = getAutoType(item);
      const note =
        aType === 'tax'
          ? ` (${isEN ? 'Estimated Tax' : 'ภาษีเงินได้'})`
          : aType === 'sso'
            ? ` (${isEN ? 'Social Security' : 'ประกันสังคม'})`
            : aType === 'pvd'
              ? ` (PVD ${pvdPercent}%)`
              : '';
      lines.push(`  - ${name}${note}: ${fmtCurrency(item.value || 0)}`);
    });
  }

  if (state.savings && state.savings.length > 0) {
    lines.push('');
    lines.push((isEN ? 'Total Savings: ' : 'รวมเงินออม: ') + fmtCurrency(totalSavings));
    state.savings.forEach((item) => {
      const name = getDisplayName(item.name);
      lines.push(`  - ${name}: ${fmtCurrency(item.value || 0)}`);
    });
  }

  lines.push('------------------------------');
  const remLabel =
    totalSavings > 0
      ? isEN
        ? 'Remaining for Investment: '
        : 'เงินคงเหลือสำหรับลงทุน: '
      : isEN
        ? 'Remaining Money: '
        : 'เงินคงเหลือ: ';
  lines.push(remLabel + fmtCurrency(remaining));

  if (state.showEmergencyRunway && state.currentEmergencyReserve > 0) {
    const reserve = Number(state.currentEmergencyReserve) || 0;
    const runwayMonths = totalExpense > 0 ? (Math.round((reserve / totalExpense) * 10) / 10).toFixed(1) : '—';
    lines.push('');
    lines.push(
      isEN
        ? `🛡️ Emergency Reserve: ${fmtCurrency(reserve)} (Runway: ${runwayMonths} months)`
        : `🛡️ เงินสำรองฉุกเฉิน: ${fmtCurrency(reserve)} (อยู่รอดได้ ${runwayMonths} เดือน)`,
    );
  }

  const text = lines.join('\n');
  const doFeedback = () => {
    const lbl = document.getElementById('lblCopySummary');
    if (lbl) {
      lbl.textContent = t('copiedSuccess') || (isEN ? '✓ Copied!' : '✓ คัดลอกแล้ว!');
      setTimeout(() => {
        lbl.textContent = t('lblCopySummary') || (isEN ? 'Copy Summary' : 'คัดลอกสรุป');
      }, 1800);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(doFeedback)
      .catch(() => {
        fallbackCopyText(text, doFeedback);
      });
  } else {
    fallbackCopyText(text, doFeedback);
  }
}

function exportJSON() {
  const totalIncome = state.incomes.reduce((s, item) => s + (item.value || 0), 0);
  const totalExpense = state.expenses.reduce((s, item) => s + (item.value || 0), 0);
  const totalSavings = (state.savings || []).reduce((s, item) => s + (item.value || 0), 0);
  const remaining = Math.round(totalIncome - totalExpense - totalSavings);
  const reserve = Number(state.currentEmergencyReserve) || 0;
  const runwayMonths = totalExpense > 0 ? Math.round((reserve / totalExpense) * 10) / 10 : 0;

  const payload = {
    version: '1.0.0',
    app: 'Money Superapp - Remaining Money Calculator',
    exportedAt: new Date().toISOString(),
    currency: 'THB',
    data: state,
    summary: {
      totalIncome,
      totalExpense,
      totalSavings,
      remaining,
      runwayMonths,
    },
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `remaining_money_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Import Features (CSV, JSON, Preview & Apply) ──────────────────────────
let pendingImportData = null;

function parseCSVRows(csvText) {
  if (csvText.charCodeAt(0) === 0xfeff) {
    csvText = csvText.slice(1);
  }
  const rows = [];
  let currentRow = [];
  let currentVal = '';
  let inQuotes = false;
  let i = 0;
  const len = csvText.length;

  while (i < len) {
    const char = csvText[i];
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < len && csvText[i + 1] === '"') {
          currentVal += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        currentVal += char;
        i++;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
      } else if (char === ',') {
        currentRow.push(currentVal.trim());
        currentVal = '';
        i++;
      } else if (char === '\r') {
        if (i + 1 < len && csvText[i + 1] === '\n') {
          i++;
        }
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
        i++;
      } else if (char === '\n') {
        currentRow.push(currentVal.trim());
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
        i++;
      } else {
        currentVal += char;
        i++;
      }
    }
  }
  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    rows.push(currentRow);
  }
  return rows;
}

function detectColumns(headerRow) {
  let catCol = -1,
    itemCol = -1,
    amtCol = -1,
    noteCol = -1;
  headerRow.forEach((col, idx) => {
    const c = col.toLowerCase().trim();
    if (c.includes('category') || c.includes('หมวด') || c.includes('ประเภท')) {
      if (catCol === -1) catCol = idx;
    } else if (c.includes('item') || c.includes('รายการ') || c.includes('ชื่อ') || c.includes('name')) {
      if (itemCol === -1) itemCol = idx;
    } else if (
      c.includes('amount') ||
      c.includes('จำนวน') ||
      c.includes('value') ||
      c.includes('thb') ||
      c.includes('บาท')
    ) {
      if (amtCol === -1) amtCol = idx;
    } else if (c.includes('note') || c.includes('หมายเหตุ') || c.includes('remark') || c.includes('comment')) {
      if (noteCol === -1) noteCol = idx;
    }
  });
  if (catCol === -1) catCol = 0;
  if (itemCol === -1) itemCol = 1;
  if (amtCol === -1) amtCol = 2;
  if (noteCol === -1) noteCol = 3;
  return { catCol, itemCol, amtCol, noteCol };
}

function cleanField(val) {
  if (typeof val !== 'string') return '';
  let s = val.trim();
  if (s.startsWith("'")) {
    s = s.slice(1).trim();
  }
  return s;
}

function cleanAmount(val) {
  if (typeof val === 'number') return isNaN(val) ? 0 : Math.max(0, val);
  if (typeof val !== 'string') return 0;
  let s = val.trim();
  if (s.startsWith("'")) s = s.slice(1).trim();
  s = s.replace(/,/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(s);
  return isNaN(num) ? 0 : Math.max(0, num);
}

function isSubtotalRow(cat, item) {
  const c = cat.toLowerCase();
  const it = item.toLowerCase();
  if (c === 'summary' || c === 'สรุป') return true;
  if (it === 'total' || it === 'รวม') return true;
  if (it.startsWith('total income') || it.startsWith('รวมรายได้')) return true;
  if (it.startsWith('total expense') || it.startsWith('รวมค่าใช้จ่าย')) return true;
  if (it.startsWith('total saving') || it.startsWith('รวมเงินออม')) return true;
  if (it.includes('subtotal') || it.includes('รวมทั้งสิ้น')) return true;
  if (
    it.includes('remaining money') ||
    it.includes('remaining for investment') ||
    it.includes('เงินคงเหลือสำหรับลงทุน') ||
    it.includes('เงินคงเหลือ')
  )
    return true;
  return false;
}

function handleImportFile(inputEl) {
  if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
  const file = inputEl.files[0];
  const fileName = file.name || 'import';
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const text = e.target.result;
      if (typeof text !== 'string' || !text.trim()) {
        showBridgeNotification(
          t('importNoData') || (LANG === 'en' ? 'No income or expense data found' : 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย'),
        );
        return;
      }
      const trimmed = text.trim();
      const isJson =
        file.name.toLowerCase().endsWith('.json') ||
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'));

      if (isJson) {
        parseImportJSON(trimmed, fileName);
      } else {
        parseImportCSV(text, fileName);
      }
    } catch (err) {
      console.error('Import error:', err);
      showBridgeNotification(
        t('importError') || (LANG === 'en' ? 'Could not import file' : 'เกิดข้อผิดพลาดในการนำเข้าไฟล์'),
      );
    } finally {
      inputEl.value = '';
    }
  };

  reader.onerror = () => {
    showBridgeNotification(t('importError') || (LANG === 'en' ? 'Could not import file' : 'เกิดข้อผิดพลาดในการนำเข้าไฟล์'));
    inputEl.value = '';
  };

  reader.readAsText(file);
}

function parseImportJSON(text, fileName = 'data.json') {
  let parsed;
  try {
    parsed = typeof text === 'string' ? JSON.parse(text) : text;
  } catch (e) {
    showBridgeNotification(t('importError') || (LANG === 'en' ? 'Could not import file' : 'เกิดข้อผิดพลาดในการนำเข้าไฟล์'));
    return null;
  }
  if (!parsed || typeof parsed !== 'object') {
    showBridgeNotification(t('importError') || (LANG === 'en' ? 'Could not import file' : 'เกิดข้อผิดพลาดในการนำเข้าไฟล์'));
    return null;
  }

  let dataObj = null;
  let detectedPvd = null;

  if (parsed.data && typeof parsed.data === 'object' && parsed.data[STORAGE_KEY]) {
    try {
      dataObj =
        typeof parsed.data[STORAGE_KEY] === 'string' ? JSON.parse(parsed.data[STORAGE_KEY]) : parsed.data[STORAGE_KEY];
    } catch (e) {}
    if (parsed.data[PVD_PERCENT_KEY]) {
      const p = parseFloat(parsed.data[PVD_PERCENT_KEY]);
      if (!isNaN(p) && p >= 0 && p <= 100) detectedPvd = p;
    }
  } else if (parsed[STORAGE_KEY]) {
    try {
      dataObj = typeof parsed[STORAGE_KEY] === 'string' ? JSON.parse(parsed[STORAGE_KEY]) : parsed[STORAGE_KEY];
    } catch (e) {}
    if (parsed[PVD_PERCENT_KEY]) {
      const p = parseFloat(parsed[PVD_PERCENT_KEY]);
      if (!isNaN(p) && p >= 0 && p <= 100) detectedPvd = p;
    }
  } else if (
    parsed.data &&
    typeof parsed.data === 'object' &&
    (Array.isArray(parsed.data.incomes) || Array.isArray(parsed.data.expenses))
  ) {
    dataObj = parsed.data;
  } else if (Array.isArray(parsed.incomes) || Array.isArray(parsed.expenses)) {
    dataObj = parsed;
  }

  if (!dataObj || (!Array.isArray(dataObj.incomes) && !Array.isArray(dataObj.expenses))) {
    showBridgeNotification(
      t('importNoData') || (LANG === 'en' ? 'No income or expense data found' : 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย'),
    );
    return null;
  }

  if (detectedPvd === null) {
    if (
      typeof dataObj.pvdPercent === 'number' &&
      !isNaN(dataObj.pvdPercent) &&
      dataObj.pvdPercent >= 0 &&
      dataObj.pvdPercent <= 100
    ) {
      detectedPvd = dataObj.pvdPercent;
    } else if (
      typeof parsed.pvdPercent === 'number' &&
      !isNaN(parsed.pvdPercent) &&
      parsed.pvdPercent >= 0 &&
      parsed.pvdPercent <= 100
    ) {
      detectedPvd = parsed.pvdPercent;
    }
  }

  const incomes = Array.isArray(dataObj.incomes)
    ? dataObj.incomes.map((it, idx) => ({
        name: String(it.name || (LANG === 'en' ? `Income ${idx + 1}` : `รายได้ ${idx + 1}`)),
        value: Math.max(0, parseFloat(it.value) || 0),
        isSalary: !!it.isSalary || idx === 0,
      }))
    : [];

  let expenses = Array.isArray(dataObj.expenses)
    ? dataObj.expenses.map((it, idx) => {
        const aType = getAutoType(it);
        return {
          name: String(it.name || (LANG === 'en' ? `Expense ${idx + 1}` : `ค่าใช้จ่าย ${idx + 1}`)),
          value: Math.max(0, parseFloat(it.value) || 0),
          auto: !!aType || !!it.auto,
          autoType: aType || undefined,
        };
      })
    : [];

  if (!expenses.some((e) => getAutoType(e) === 'tax')) {
    expenses.unshift({ name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' });
  }
  if (!expenses.some((e) => getAutoType(e) === 'sso')) {
    expenses.unshift({ name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' });
  }
  if (!expenses.some((e) => getAutoType(e) === 'pvd')) {
    expenses.unshift({ name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' });
  }
  expenses.forEach((e) => {
    const aType = getAutoType(e);
    if (aType) {
      e.auto = true;
      e.autoType = aType;
      e.name = aType === 'tax' ? AUTO_TAX_NAME_TH : aType === 'sso' ? AUTO_SSO_NAME_TH : AUTO_PVD_NAME_TH;
    }
  });

  const savings = Array.isArray(dataObj.savings)
    ? dataObj.savings.map((it, idx) => ({
        name: String(it.name || (LANG === 'en' ? `Savings ${idx + 1}` : `เงินออม ${idx + 1}`)),
        value: Math.max(0, parseFloat(it.value) || 0),
      }))
    : [];

  const manualOverrides =
    dataObj.manualOverrides && typeof dataObj.manualOverrides === 'object'
      ? { tax: !!dataObj.manualOverrides.tax, sso: !!dataObj.manualOverrides.sso, pvd: !!dataObj.manualOverrides.pvd }
      : { tax: false, sso: false, pvd: false };

  const showEmergencyRunway = typeof dataObj.showEmergencyRunway === 'boolean' ? dataObj.showEmergencyRunway : false;
  const currentEmergencyReserve =
    Number(dataObj.currentEmergencyReserve) >= 0 ? Number(dataObj.currentEmergencyReserve) : 0;

  const candidate = {
    incomes,
    expenses,
    savings,
    manualOverrides,
    showEmergencyRunway,
    currentEmergencyReserve,
    pvdPercent: detectedPvd !== null ? detectedPvd : pvdPercent,
  };

  showImportPreview(candidate, fileName, 'JSON');
  return candidate;
}

function parseImportCSV(text, fileName = 'data.csv') {
  if (typeof text !== 'string' || !text.trim()) {
    showBridgeNotification(
      t('importNoData') || (LANG === 'en' ? 'No income or expense data found' : 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย'),
    );
    return null;
  }
  const rows = parseCSVRows(text);
  if (rows.length === 0) {
    showBridgeNotification(
      t('importNoData') || (LANG === 'en' ? 'No income or expense data found' : 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย'),
    );
    return null;
  }

  let headerIdx = -1;
  let colMap = null;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    const row = rows[i];
    const rowStr = row.join(' ').toLowerCase();
    if (
      rowStr.includes('category') ||
      rowStr.includes('หมวด') ||
      rowStr.includes('item') ||
      rowStr.includes('รายการ') ||
      rowStr.includes('amount') ||
      rowStr.includes('จำนวน')
    ) {
      headerIdx = i;
      colMap = detectColumns(row);
      break;
    }
  }

  if (!colMap) {
    colMap = { catCol: 0, itemCol: 1, amtCol: 2, noteCol: 3 };
  }

  const startIdx = headerIdx >= 0 ? headerIdx + 1 : 0;
  const candidate = {
    incomes: [],
    expenses: [],
    savings: [],
    manualOverrides: { tax: false, sso: false, pvd: false },
    showEmergencyRunway: false,
    currentEmergencyReserve: 0,
    pvdPercent: pvdPercent,
  };

  for (let i = startIdx; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

    const cat = cleanField(row[colMap.catCol] || '');
    const item = cleanField(row[colMap.itemCol] || '');
    const amount = cleanAmount(row[colMap.amtCol]);
    const note = cleanField(row[colMap.noteCol] || '');

    if (!item && amount === 0) continue;

    const isRunwayCat = cat.toLowerCase().includes('runway') || cat.includes('เงินสำรอง') || cat.includes('สำรองฉุกเฉิน');
    if (isRunwayCat) {
      if (item.toLowerCase().includes('runway') || item.includes('ระยะเวลา')) {
        if (amount > 0) candidate.showEmergencyRunway = true;
      } else if (
        item.toLowerCase().includes('reserve') ||
        item.includes('เงินสำรองฉุกเฉิน') ||
        item.includes('สำรองฉุกเฉิน') ||
        item.includes('เงินสำรอง')
      ) {
        candidate.currentEmergencyReserve = amount;
        if (amount > 0) candidate.showEmergencyRunway = true;
      }
      continue;
    }

    if (isSubtotalRow(cat, item)) continue;

    const combinedText = item + ' ' + note;
    const isPvdText = /(?:pvd|provident\s*fund|กองทุนสำรองเลี้ยงชีพ)/i.test(combinedText);
    if (isPvdText) {
      const pvdMatch =
        combinedText.match(/(?:pvd|provident\s*fund|กองทุนสำรองเลี้ยงชีพ).*?\(?(\d+(?:\.\d+)?)\s*%\)?/i) ||
        combinedText.match(/(\d+(?:\.\d+)?)\s*%/);
      if (pvdMatch) {
        const pct = parseFloat(pvdMatch[1]);
        if (!isNaN(pct) && pct >= 0 && pct <= 100) {
          candidate.pvdPercent = pct;
        }
      }
    }

    const isIncomeCat = cat.toLowerCase().includes('income') || cat.includes('รายได้');
    const isExpenseCat = cat.toLowerCase().includes('expense') || cat.includes('ค่าใช้จ่าย') || cat.includes('รายจ่าย');
    const isSavingCat = cat.toLowerCase().includes('saving') || cat.includes('เงินออม') || cat.includes('ออม');

    if (isIncomeCat) {
      const isSal =
        note.toLowerCase().includes('salary') ||
        note.includes('เงินเดือน') ||
        item.toLowerCase().includes('salary') ||
        item.includes('เงินเดือน');
      candidate.incomes.push({ name: item, value: amount, isSalary: isSal });
    } else if (isExpenseCat) {
      const aType =
        getAutoType({ name: item }) ||
        (note.toLowerCase().includes('tax') || note.includes('ภาษี')
          ? 'tax'
          : note.toLowerCase().includes('sso') || note.includes('ประกันสังคม')
            ? 'sso'
            : note.toLowerCase().includes('pvd') || note.includes('กองทุนสำรองเลี้ยงชีพ')
              ? 'pvd'
              : null);
      candidate.expenses.push({
        name: item,
        value: amount,
        auto: !!aType,
        autoType: aType || undefined,
      });
    } else if (isSavingCat) {
      candidate.savings.push({ name: item, value: amount });
    } else {
      if (
        item.toLowerCase().includes('salary') ||
        item.includes('เงินเดือน') ||
        note.toLowerCase().includes('salary') ||
        note.includes('เงินเดือน')
      ) {
        candidate.incomes.push({ name: item, value: amount, isSalary: true });
      } else if (item.toLowerCase().includes('saving') || item.includes('เงินออม') || item.includes('สำรอง')) {
        candidate.savings.push({ name: item, value: amount });
      } else {
        const aType = getAutoType({ name: item });
        candidate.expenses.push({
          name: item,
          value: amount,
          auto: !!aType,
          autoType: aType || undefined,
        });
      }
    }
  }

  if (!candidate.expenses.some((e) => getAutoType(e) === 'tax')) {
    candidate.expenses.unshift({ name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' });
  }
  if (!candidate.expenses.some((e) => getAutoType(e) === 'sso')) {
    candidate.expenses.unshift({ name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' });
  }
  if (!candidate.expenses.some((e) => getAutoType(e) === 'pvd')) {
    candidate.expenses.unshift({ name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' });
  }
  candidate.expenses.forEach((e) => {
    const aType = getAutoType(e);
    if (aType) {
      e.auto = true;
      e.autoType = aType;
      e.name = aType === 'tax' ? AUTO_TAX_NAME_TH : aType === 'sso' ? AUTO_SSO_NAME_TH : AUTO_PVD_NAME_TH;
    }
  });

  if (candidate.incomes.length > 0 && !candidate.incomes.some((i) => i.isSalary)) {
    candidate.incomes[0].isSalary = true;
  }

  const nonAutoExp = candidate.expenses.filter((e) => !getAutoType(e));
  if (candidate.incomes.length === 0 && nonAutoExp.length === 0 && candidate.savings.length === 0) {
    showBridgeNotification(
      t('importNoData') || (LANG === 'en' ? 'No income or expense data found' : 'ไม่พบข้อมูลรายได้หรือค่าใช้จ่าย'),
    );
    return null;
  }

  showImportPreview(candidate, fileName, 'CSV');
  return candidate;
}

function showImportPreview(candidate, fileName, format) {
  pendingImportData = candidate;
  if (typeof document === 'undefined') return;

  const isEN = LANG === 'en';
  const nameEl = document.getElementById('importFileName');
  if (nameEl) nameEl.textContent = fileName || '—';

  const badgeEl = document.getElementById('importFormatBadge');
  if (badgeEl) badgeEl.textContent = format || 'FILE';

  const incCount = (candidate.incomes || []).length;
  const incTotal = (candidate.incomes || []).reduce((s, it) => s + (Number(it.value) || 0), 0);

  const salary = ((candidate.incomes || []).find((it, idx) => isSalaryRow(it, idx)) || {}).value || 0;
  const candPvdPct = candidate.pvdPercent != null && !isNaN(candidate.pvdPercent) ? candidate.pvdPercent : pvdPercent;

  let expCount = 0;
  let expTotal = 0;
  (candidate.expenses || []).forEach((it) => {
    const aType = getAutoType(it);
    let v = Number(it.value) || 0;
    if (aType) {
      if (v === 0 && salary > 0) {
        if (aType === 'tax') v = calculateMonthlyTax(salary, candPvdPct);
        else if (aType === 'sso') v = calculateSSO(salary);
        else if (aType === 'pvd') v = calculatePVD(salary, candPvdPct);
      }
      if (v > 0) expCount++;
    } else {
      expCount++;
    }
    expTotal += v;
  });

  const savCount = (candidate.savings || []).length;
  const savTotal = (candidate.savings || []).reduce((s, it) => s + (Number(it.value) || 0), 0);
  const remaining = Math.round(incTotal - expTotal - savTotal);

  const incSummaryEl = document.getElementById('importIncomeSummary');
  if (incSummaryEl) incSummaryEl.textContent = `${fmtCurrency(incTotal)} (${incCount} ${isEN ? 'items' : 'รายการ'})`;

  const expSummaryEl = document.getElementById('importExpenseSummary');
  if (expSummaryEl) expSummaryEl.textContent = `${fmtCurrency(expTotal)} (${expCount} ${isEN ? 'items' : 'รายการ'})`;

  const savSummaryEl = document.getElementById('importSavingSummary');
  if (savSummaryEl) savSummaryEl.textContent = `${fmtCurrency(savTotal)} (${savCount} ${isEN ? 'items' : 'รายการ'})`;

  const remSummaryEl = document.getElementById('importRemainingSummary');
  if (remSummaryEl) {
    remSummaryEl.textContent = fmtCurrency(remaining);
    remSummaryEl.style.color = remaining > 0 ? 'var(--core)' : remaining < 0 ? 'var(--warn)' : 'var(--ink)';
  }

  const runwayRow = document.getElementById('importRunwayRow');
  const runwaySummaryEl = document.getElementById('importRunwaySummary');
  if (candidate.showEmergencyRunway || candidate.currentEmergencyReserve > 0) {
    const reserve = Number(candidate.currentEmergencyReserve) || 0;
    const runwayMonths = expTotal > 0 ? (reserve / expTotal).toFixed(1) : '—';
    if (runwaySummaryEl) {
      runwaySummaryEl.textContent = `${fmtCurrency(reserve)} (${runwayMonths} ${isEN ? 'months' : 'เดือน'})`;
    }
    if (runwayRow) runwayRow.style.display = 'flex';
  } else {
    if (runwayRow) runwayRow.style.display = 'none';
  }

  const rReplace = document.getElementById('importModeReplace');
  if (rReplace) rReplace.checked = true;

  const modal = document.getElementById('importModal');
  if (modal) modal.style.display = 'flex';
}

function confirmImport() {
  if (!pendingImportData) {
    closeImportModal();
    return;
  }

  const isEN = LANG === 'en';
  const modeReplaceEl = document.getElementById('importModeReplace');
  const isReplace = modeReplaceEl ? modeReplaceEl.checked : true;

  const candidate = pendingImportData;
  undoMgr.push(captureSnapshot());

  if (isReplace) {
    state.incomes = candidate.incomes.map((item) => ({ ...item }));
    if (state.incomes.length === 0) state.incomes.push({ name: 'เงินเดือน', value: 0, isSalary: true });
    state.expenses = candidate.expenses.map((item) => ({ ...item }));
    state.savings = (candidate.savings || []).map((item) => ({ ...item }));

    if (candidate.manualOverrides) {
      manualOverrides.tax = !!candidate.manualOverrides.tax;
      manualOverrides.sso = !!candidate.manualOverrides.sso;
      manualOverrides.pvd = !!candidate.manualOverrides.pvd;
    } else {
      manualOverrides.tax = false;
      manualOverrides.sso = false;
      manualOverrides.pvd = false;
    }

    if (candidate.pvdPercent != null && !isNaN(candidate.pvdPercent)) {
      pvdPercent = candidate.pvdPercent;
      try {
        localStorage.setItem(PVD_PERCENT_KEY, String(pvdPercent));
      } catch (e) {}
    }

    state.showEmergencyRunway = !!candidate.showEmergencyRunway;
    state.currentEmergencyReserve = Number(candidate.currentEmergencyReserve) || 0;
  } else {
    // Merge mode
    (candidate.incomes || []).forEach((candInc) => {
      const isSal = isSalaryRow(candInc);
      if (isSal) {
        const sal = state.incomes.find((it, idx) => isSalaryRow(it, idx));
        if (sal) {
          if (candInc.value > 0) sal.value = candInc.value;
        } else {
          state.incomes.unshift({ ...candInc });
        }
      } else {
        const existing = state.incomes.find(
          (it) =>
            !isSalaryRow(it) &&
            String(it.name || '')
              .trim()
              .toLowerCase() ===
              String(candInc.name || '')
                .trim()
                .toLowerCase(),
        );
        if (existing) {
          existing.value = candInc.value;
        } else {
          state.incomes.push({ ...candInc });
        }
      }
    });

    (candidate.expenses || []).forEach((candExp) => {
      const aType = getAutoType(candExp);
      if (aType) {
        const autoExp = state.expenses.find((it) => getAutoType(it) === aType);
        if (autoExp && candExp.value > 0) {
          autoExp.value = candExp.value;
        }
      } else {
        const existing = state.expenses.find(
          (it) =>
            !getAutoType(it) &&
            String(it.name || '')
              .trim()
              .toLowerCase() ===
              String(candExp.name || '')
                .trim()
                .toLowerCase(),
        );
        if (existing) {
          existing.value = candExp.value;
        } else {
          state.expenses.push({ ...candExp });
        }
      }
    });

    if (!Array.isArray(state.savings)) state.savings = [];
    (candidate.savings || []).forEach((candSav) => {
      const existing = state.savings.find(
        (it) =>
          String(it.name || '')
            .trim()
            .toLowerCase() ===
          String(candSav.name || '')
            .trim()
            .toLowerCase(),
      );
      if (existing) {
        existing.value = candSav.value;
      } else {
        state.savings.push({ ...candSav });
      }
    });

    if (candidate.manualOverrides) {
      if (candidate.manualOverrides.tax) manualOverrides.tax = true;
      if (candidate.manualOverrides.sso) manualOverrides.sso = true;
      if (candidate.manualOverrides.pvd) manualOverrides.pvd = true;
    }

    if (candidate.pvdPercent != null && !isNaN(candidate.pvdPercent)) {
      pvdPercent = candidate.pvdPercent;
      try {
        localStorage.setItem(PVD_PERCENT_KEY, String(pvdPercent));
      } catch (e) {}
    }

    if (candidate.showEmergencyRunway) {
      state.showEmergencyRunway = true;
    }
    if (candidate.currentEmergencyReserve > 0) {
      state.currentEmergencyReserve = candidate.currentEmergencyReserve;
    }
  }

  const txtReserve = document.getElementById('txtCurrentReserve');
  if (txtReserve) {
    txtReserve.value = state.currentEmergencyReserve || '';
  }

  const chkRunway = document.getElementById('chkShowRunway');
  if (chkRunway) {
    chkRunway.checked = !!state.showEmergencyRunway;
    const runwayContent = document.getElementById('runwayContent');
    if (runwayContent) runwayContent.style.display = state.showEmergencyRunway ? '' : 'none';
  }

  const pvdInp = document.getElementById('pvdPctInput');
  if (pvdInp) {
    pvdInp.value = pvdPercent;
  }

  updateAutoExpenses(pvdPercent);
  renderRows();
  renderPvdRow();
  compute();
  saveState();
  updateUndoUI();

  closeImportModal();

  const incCount = state.incomes.length;
  const expCount = state.expenses.filter((e) => !getAutoType(e) || e.value > 0).length;
  const savCount = (state.savings || []).length;
  const summaryMsg =
    (t('importSuccess') || (LANG === 'en' ? '✓ Data imported successfully' : '✓ นำเข้าข้อมูลเรียบร้อยแล้ว')) +
    (LANG === 'en'
      ? ` (${incCount} incomes, ${expCount} expenses, ${savCount} savings)`
      : ` (รายได้ ${incCount}, ค่าใช้จ่าย ${expCount}, เงินออม ${savCount} รายการ)`);
  showBridgeNotification(summaryMsg);
}

function closeImportModal() {
  const modal = document.getElementById('importModal');
  if (modal) modal.style.display = 'none';
  pendingImportData = null;
}

// ── Budget Templates & Starter Presets ────────────────────────────────────
const BUDGET_PRESETS = [
  {
    id: 'preset-first-jobber',
    nameTh: '💼 พนักงานเริ่มทำงานใหม่ (First Jobber)',
    nameEn: '💼 First Jobber',
    descTh: 'เงินเดือน 25k, หัก ปกส./ภาษี, ค่าเช่า 6k, น้ำไฟ 1.2k, อาหาร 7k, ออม 2.5k',
    descEn: 'Salary 25k, Rent 6k, Utilities 1.2k, Food 7k, Savings 2.5k',
    state: {
      incomes: [{ name: 'เงินเดือน', value: 25000, isSalary: true }],
      expenses: [
        { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
        { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
        { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
        { name: 'ค่าเช่าห้อง / ที่พัก', value: 6000 },
        { name: 'ค่าน้ำ + ค่าไฟฟ้า', value: 1200 },
        { name: 'ค่าอาหารและเครื่องดื่ม', value: 7000 },
        { name: 'ค่าเดินทาง / BTS / น้ำมัน', value: 2500 },
        { name: 'ค่าโทรศัพท์ / อินเทอร์เน็ต', value: 600 },
      ],
      savings: [{ name: 'เงินออมฉุกเฉิน (Emergency Buffer)', value: 2500 }],
    },
  },
  {
    id: 'preset-mid-career',
    nameTh: '👨‍👩‍👧 ครอบครัว / วัยทำงาน (Family & Mid-Career)',
    nameEn: '👨‍👩‍👧 Family & Mid-Career',
    descTh: 'เงินเดือน 60k, ผ่อนบ้าน/คอนโด 15k, น้ำไฟเน็ต 3.5k, อุปโภคบริโภค 12k, ออม 10k',
    descEn: 'Salary 60k, Mortgage 15k, Utilities 3.5k, Groceries 12k, Savings 10k',
    state: {
      incomes: [
        { name: 'เงินเดือน', value: 60000, isSalary: true },
        { name: 'เงิน allowances / อื่นๆ', value: 5000 },
      ],
      expenses: [
        { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
        { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
        { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
        { name: 'ผ่อนบ้าน / คอนโด', value: 15000 },
        { name: 'ค่าน้ำ + ค่าไฟฟ้า + เน็ต', value: 3500 },
        { name: 'ค่ากินอยู่และของใช้ในบ้าน', value: 12000 },
        { name: 'ประกันชีวิต / ประกันสุขภาพ', value: 3000 },
        { name: 'ค่าใช้จ่ายส่วนตัว / สันทนาการ', value: 4000 },
      ],
      savings: [{ name: 'เงินออมฉุกเฉิน / สำรองเลี้ยงชีพ', value: 10000 }],
    },
  },
  {
    id: 'preset-freelancer',
    nameTh: '🌴 ฟรีแลนซ์ / รายได้ไม่ประจำ (Freelancer)',
    nameEn: '🌴 Freelancer / Variable',
    descTh: 'รายได้โปรเจกต์ 45k, หักภาษี 3%, ค่าเครื่องมือ 3k, ค่าเช่า 8k, อาหาร 9k, ออม 10k',
    descEn: 'Project income 45k, Biz expense 3k, Rent 8k, Living 9k, Safety fund 10k',
    state: {
      incomes: [{ name: 'รายได้จากงานฟรีแลนซ์ / สัญญาจ้าง', value: 45000 }],
      expenses: [
        { name: 'ภาษีหัก ณ ที่จ่าย 3% (ประมาณการ)', value: 1350 },
        { name: 'ประกันสังคม มาตรา 39/40', value: 432 },
        { name: 'ค่าเครื่องมือ / ซอฟต์แวร์ทำงาน', value: 3000 },
        { name: 'ค่าเช่าและสาธารณูปโภค', value: 8000 },
        { name: 'ค่าอาหารและครองชีพ', value: 9000 },
        { name: 'ประกันสุขภาพส่วนบุคคล', value: 2500 },
      ],
      savings: [{ name: 'กองทุนสำรองฉุกเฉิน 6-12 เดือน', value: 10000 }],
    },
  },
  {
    id: 'preset-frugal',
    nameTh: '🥦 ประหยัดเข้มงวด / เน้นสร้างตัว (Frugal & High Savings)',
    nameEn: '🥦 Frugal & High Savings',
    descTh: 'เงินเดือน 35k, ค่าใช้จ่ายจำเป็น 13k, ลดสิ่งฟุ่มเฟือยเหลือ 3k, ออม/ลงทุนหนัก 15k (~43%)',
    descEn: 'Salary 35k, Fixed 13k, Minimal wants 3k, High savings 15k (~43% savings rate)',
    state: {
      incomes: [{ name: 'เงินเดือน', value: 35000, isSalary: true }],
      expenses: [
        { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
        { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
        { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
        { name: 'ค่าเช่าห้อง / ที่พัก', value: 5500 },
        { name: 'ค่าน้ำ + ค่าไฟ + เน็ต', value: 1200 },
        { name: 'ค่าอาหารปรุงเองและของใช้จำเป็น', value: 5000 },
        { name: 'ค่าเดินทางประหยัด', value: 1500 },
        { name: 'ค่าสันทนาการจำกัดงบ', value: 1500 },
      ],
      savings: [{ name: 'เงินออมฉุกเฉิน & พอร์ตลงทุน', value: 15000 }],
    },
  },
  {
    id: 'preset-holiday',
    nameTh: '✈️ เดือนท่องเที่ยว / เทศกาล (Holiday & Travel)',
    nameEn: '✈️ Holiday & Travel',
    descTh: 'เงินเดือน 45k, งบเที่ยว/ตั๋ว/โรงแรม 12k, กินเลี้ยงสังสรรค์ 7k, ของขวัญ 3k, ออม 5k',
    descEn: 'Salary 45k, Travel/hotel 12k, Dining/social 7k, Gifts 3k, Savings 5k',
    state: {
      incomes: [{ name: 'เงินเดือน', value: 45000, isSalary: true }],
      expenses: [
        { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
        { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
        { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
        { name: 'ค่าที่พัก & สาธารณูปโภค', value: 7500 },
        { name: 'ตั๋วเครื่องบิน & โรงแรมที่พัก', value: 12000 },
        { name: 'กินข้าวนอกบ้าน & สังสรรค์ปาร์ตี้', value: 7000 },
        { name: 'ของฝาก & ช้อปปิ้งเทศกาล', value: 3500 },
        { name: 'ค่าเดินทางท่องเที่ยว', value: 2500 },
      ],
      savings: [{ name: 'เงินออมสำรองประจำเดือน', value: 5000 }],
    },
  },
  {
    id: 'preset-503020',
    nameTh: '🎯 สมดุลทองคำ 50/30/20 (Golden Rule)',
    nameEn: '🎯 Golden 50/30/20 Rule',
    descTh: 'เงินเดือน 50k, Needs 50% (25k), Wants 30% (15k), Savings 20% (10k) ตามสัดส่วนเป๊ะ',
    descEn: 'Salary 50k, 50% Needs (25k), 30% Wants (15k), 20% Savings (10k)',
    state: {
      incomes: [{ name: 'เงินเดือน', value: 50000, isSalary: true }],
      expenses: [
        { name: AUTO_TAX_NAME_TH, value: 0, auto: true, autoType: 'tax' },
        { name: AUTO_SSO_NAME_TH, value: 0, auto: true, autoType: 'sso' },
        { name: AUTO_PVD_NAME_TH, value: 0, auto: true, autoType: 'pvd' },
        { name: 'ผ่อนคอนโด / ค่าเช่า (Needs)', value: 14000 },
        { name: 'ค่าเดินทาง & สาธารณูปโภค (Needs)', value: 4500 },
        { name: 'ค่าอาหารพื้นฐาน (Needs)', value: 5000 },
        { name: 'กินข้าวนอกบ้าน & บุฟเฟต์ (Wants)', value: 6500 },
        { name: 'ช้อปปิ้ง & เสื้อผ้า (Wants)', value: 5000 },
        { name: 'สตรีมมิ่ง & สันทนาการ (Wants)', value: 2500 },
      ],
      savings: [{ name: 'เงินออม & DCA กองทุนดัชนี (Savings)', value: 10000 }],
    },
  },
];

const TEMPLATES_STORAGE_KEY = 'moneySuperapp.budgetTemplates.v1';
let currentActiveTemplateId = null;

function renderQuickPresetsBar() {
  const container = document.getElementById('quickPresetsGroup');
  if (!container) return;
  const isEN = LANG === 'en';

  const quickPills = [
    { id: 'preset-first-jobber', icon: '💼', shortTh: 'เริ่มทำงาน (25k)', shortEn: 'First Jobber (25k)' },
    { id: 'preset-frugal', icon: '🥦', shortTh: 'เน้นออม (35k)', shortEn: 'Frugal (35k)' },
    { id: 'preset-holiday', icon: '✈️', shortTh: 'ท่องเที่ยว (45k)', shortEn: 'Holiday (45k)' },
    { id: 'preset-503020', icon: '🎯', shortTh: 'สมดุล 50/30/20', shortEn: '50/30/20 Rule' },
    { id: 'preset-mid-career', icon: '👨‍👩‍👧', shortTh: 'ครอบครัว (60k)', shortEn: 'Mid-Career (60k)' },
  ];

  container.innerHTML = quickPills
    .map((p) => {
      const preset = BUDGET_PRESETS.find((x) => x.id === p.id);
      if (!preset) return '';
      const label = isEN ? p.shortEn : p.shortTh;
      const fullName = isEN ? preset.nameEn : preset.nameTh;
      const isActive = currentActiveTemplateId === p.id;
      const activeStyle = isActive
        ? 'background:rgba(5,150,105,0.18); border-color:var(--brand, #059669); color:var(--core); font-weight:700; box-shadow:0 0 0 1px var(--brand, #059669);'
        : 'background:var(--panel-2); border-color:var(--line); color:var(--ink-dim); font-weight:500;';
      return `
      <button type="button" onclick="selectQuickPreset('${p.id}')" title="${escapeAttr(fullName)}" style="font-size:11px; padding:4px 9px; border-radius:999px; border:1px solid; cursor:pointer; display:inline-flex; align-items:center; gap:4px; transition:all 0.15s; font-family:inherit; ${activeStyle}">
        <span>${p.icon}</span> <span>${escapeAttr(label)}</span>
      </button>
    `;
    })
    .join('');
}

function selectQuickPreset(id) {
  const preset = BUDGET_PRESETS.find((x) => x.id === id);
  if (!preset) return;
  const name = LANG === 'en' ? preset.nameEn : preset.nameTh;
  applyBudgetTemplate(preset.state, name, id);
}

function getCustomTemplates() {
  return MoneyApp.safeJsonParse(TEMPLATES_STORAGE_KEY, []);
}

function saveCustomTemplates(list) {
  try {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(list));
  } catch (_e) {}
}

function openTemplateModal() {
  renderTemplatesModal();
  const modal = document.getElementById('templateModal');
  if (modal) modal.style.display = 'flex';
  const inp = document.getElementById('txtNewTemplateName');
  if (inp) inp.focus();
}

function closeTemplateModal() {
  const modal = document.getElementById('templateModal');
  if (modal) modal.style.display = 'none';
}

function saveCurrentBudgetAsTemplate() {
  const inp = document.getElementById('txtNewTemplateName');
  const name = inp ? inp.value.trim() : '';
  if (!name) {
    alert(LANG === 'en' ? 'Please enter a template name.' : 'กรุณาระบุชื่อแม่แบบ');
    if (inp) inp.focus();
    return;
  }
  const templates = getCustomTemplates();
  const newTmpl = {
    id: `tmpl-${Date.now()}`,
    name: name,
    createdAt: new Date().toISOString(),
    state: {
      incomes: JSON.parse(JSON.stringify(state.incomes || [])),
      expenses: JSON.parse(JSON.stringify(state.expenses || [])),
      savings: JSON.parse(JSON.stringify(state.savings || [])),
    },
  };
  templates.push(newTmpl);
  saveCustomTemplates(templates);
  if (inp) inp.value = '';
  renderTemplatesModal();
  showBridgeNotification(LANG === 'en' ? `✓ Template "${name}" saved!` : `✓ บันทึกแม่แบบ "${name}" เรียบร้อยแล้ว`);
}

function deleteCustomTemplate(id) {
  const isEN = LANG === 'en';
  if (!confirm(isEN ? 'Delete this template?' : 'ต้องการลบแม่แบบนี้หรือไม่?')) return;
  const templates = getCustomTemplates().filter((t) => t.id !== id);
  saveCustomTemplates(templates);
  renderTemplatesModal();
}

function applyBudgetTemplate(tmplState, tmplName, tmplId) {
  if (!tmplState) return;
  undoMgr.push(captureSnapshot());

  currentActiveTemplateId = tmplId || null;

  state.incomes = JSON.parse(JSON.stringify(tmplState.incomes || []));
  state.expenses = JSON.parse(JSON.stringify(tmplState.expenses || []));
  state.savings = JSON.parse(JSON.stringify(tmplState.savings || []));

  updateAutoExpenses(pvdPercent);
  renderRows();
  renderPvdRow();
  compute();
  renderQuickPresetsBar();
  saveState();
  updateUndoUI();
  closeTemplateModal();

  const msg =
    LANG === 'en'
      ? `✓ Applied template "${tmplName}" (Press Ctrl+Z to undo)`
      : `✓ นำแม่แบบ "${tmplName}" มาใช้แล้ว (กด Ctrl+Z เพื่อเลิกทำ)`;
  showBridgeNotification(msg);
}

function renderTemplatesModal() {
  const isEN = LANG === 'en';
  const customContainer = document.getElementById('customTemplatesContainer');
  const presetsContainer = document.getElementById('starterPresetsContainer');

  // 1. Render Custom Templates
  if (customContainer) {
    const templates = getCustomTemplates();
    if (templates.length === 0) {
      customContainer.innerHTML = `<div style="font-size:12px; color:var(--ink-faint); padding:10px; text-align:center; background:var(--panel-2); border-radius:8px;">${isEN ? EN.noCustomTemplates : 'ยังไม่มีแม่แบบที่คุณบันทึกไว้ ระบุชื่อด้านบนเพื่อบันทึกงบประมาณปัจจุบัน'}</div>`;
    } else {
      customContainer.innerHTML = templates
        .map((t) => {
          const incTot = (t.state.incomes || []).reduce((s, i) => s + (i.value || 0), 0);
          const expTot = (t.state.expenses || []).reduce((s, i) => s + (i.value || 0), 0);
          const savTot = (t.state.savings || []).reduce((s, i) => s + (i.value || 0), 0);
          const rem = incTot - expTot - savTot;
          return `
          <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
            <div style="flex:1; min-width:0;">
              <div style="font-weight:700; font-size:13px; color:var(--ink);">${escapeAttr(t.name)}</div>
              <div style="font-size:11px; color:var(--ink-dim); margin-top:2px;">
                ${isEN ? 'Income' : 'รายได้'}: <strong>${fmt(incTot)}</strong> | ${isEN ? 'Expense' : 'จ่าย'}: <strong>${fmt(expTot)}</strong> | ${isEN ? 'Net' : 'คงเหลือ'}: <strong style="color:${rem >= 0 ? 'var(--core)' : 'var(--danger)'};">${fmt(rem)} ${unit}</strong>
              </div>
            </div>
            <div style="display:flex; gap:6px; flex-shrink:0;">
              <button type="button" onclick="applyBudgetTemplate(getCustomTemplates().find(x=>x.id==='${t.id}').state, '${escapeAttr(t.name)}', '${t.id}')" style="background:var(--brand, #059669); color:#fff; border:none; padding:5px 10px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer;">${isEN ? EN.btnApplyTemplate : 'นำไปใช้'}</button>
              <button type="button" onclick="deleteCustomTemplate('${t.id}')" style="background:none; border:1px solid var(--line); color:var(--danger); padding:5px 8px; border-radius:6px; font-size:11.5px; cursor:pointer;" title="${isEN ? EN.btnDeleteTemplate : 'ลบแม่แบบ'}">🗑️</button>
            </div>
          </div>
        `;
        })
        .join('');
    }
  }

  // 2. Render Starter Presets
  if (presetsContainer) {
    presetsContainer.innerHTML = BUDGET_PRESETS.map((p, idx) => {
      const name = isEN ? p.nameEn : p.nameTh;
      const desc = isEN ? p.descEn : p.descTh;
      return `
        <div style="background:var(--panel-2); border:1px solid var(--line); border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
          <div style="flex:1; min-width:0;">
            <div style="font-weight:700; font-size:13px; color:var(--ink);">${name}</div>
            <div style="font-size:11px; color:var(--ink-dim); margin-top:2px;">${desc}</div>
          </div>
          <button type="button" onclick="applyBudgetTemplate(BUDGET_PRESETS[${idx}].state, '${escapeAttr(name)}', BUDGET_PRESETS[${idx}].id)" style="background:rgba(5, 150, 105, 0.12); border:1px solid var(--brand, #059669); color:var(--core); padding:5px 12px; border-radius:6px; font-size:11.5px; font-weight:600; cursor:pointer; flex-shrink:0;">${isEN ? EN.btnApplyTemplate : 'นำไปใช้'}</button>
        </div>
      `;
    }).join('');
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const importMod = document.getElementById('importModal');
    if (importMod && importMod.style.display !== 'none') {
      closeImportModal();
    }
    const tmplMod = document.getElementById('templateModal');
    if (tmplMod && tmplMod.style.display !== 'none') {
      closeTemplateModal();
    }
  }
});

// Expose on window
window.exportCSV = exportCSV;
window.copySummary = copySummary;
window.exportJSON = exportJSON;
window.handleImportFile = handleImportFile;
window.confirmImport = confirmImport;
window.closeImportModal = closeImportModal;
window.parseImportJSON = parseImportJSON;
window.parseImportCSV = parseImportCSV;
window.openTemplateModal = openTemplateModal;
window.closeTemplateModal = closeTemplateModal;
window.saveCurrentBudgetAsTemplate = saveCurrentBudgetAsTemplate;
window.deleteCustomTemplate = deleteCustomTemplate;
window.applyBudgetTemplate = applyBudgetTemplate;
window.selectQuickPreset = selectQuickPreset;
window.renderQuickPresetsBar = renderQuickPresetsBar;

// ── Init ───────────────────────────────────────────────────────────────────
checkPendingLumpSum();
checkPendingSlipImport();
updateAutoExpenses(pvdPercent);
renderRows();
renderPvdRow();

const chkShowRunway = document.getElementById('chkShowRunway');
const txtCurrentReserve = document.getElementById('txtCurrentReserve');
const runwayContentEl = document.getElementById('runwayContent');
if (chkShowRunway) chkShowRunway.checked = !!state.showEmergencyRunway;
if (runwayContentEl) runwayContentEl.style.display = state.showEmergencyRunway ? '' : 'none';
if (txtCurrentReserve && state.currentEmergencyReserve > 0) txtCurrentReserve.value = state.currentEmergencyReserve;

compute();
renderQuickPresetsBar();

window.addEventListener('storage', (e) => {
  if (e.key === 'moneySuperapp.pendingLumpSum') {
    checkPendingLumpSum();
  }
  if (e.key === 'moneySuperapp.pendingSlipImport') {
    checkPendingSlipImport();
  }
});
window.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'importPendingData') {
    checkPendingLumpSum();
    checkPendingSlipImport();
  }
});
