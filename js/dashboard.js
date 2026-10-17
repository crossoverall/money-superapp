const translations = {
  th: {
    title: 'ภาพรวมการเงิน',
    subtitle: 'สรุปความมั่งคั่งและประวัติการเติบโต',
    refreshTitle: 'รีเฟรชข้อมูล',
    kpiNetworth: 'ความมั่งคั่งสุทธิ (Net Worth)',
    networthSub: 'สินทรัพย์ - หนี้สิน',
    kpiSavings: 'เงินออมต่อเดือน (Cash Flow)',
    kpiRunway: 'สายป่าน (Runway)',
    runwaySub: 'ฉุกเฉินอยู่รอด',
    kpiDebt: 'ยอดหนี้รวม (Debt)',
    taxBracket: 'ฐานภาษีปัจจุบัน',
    taxPayLabel: 'ประมาณการภาษีที่ต้องจ่าย',
    chartTitle: 'แนวโน้มการเติบโต (Trends)',
    btnSnapshot: '+ บันทึกเดือนนี้',
    btnChartNw: '💰 Net Worth',
    btnChartSav: '📈 อัตราการออม',
    btnChartEmg: '🛡️ เงินสำรอง',
    btnChartDebt: '📉 หนี้คงค้าง',
    lblTrajectoryGrowth: 'เติบโตทั้งหมด:',
    lblTrajectoryMom: 'MoM:',
    lblTrajectoryVsStart: '(เทียบจุดเริ่มต้น)',
    historyTitle: 'ประวัติที่บันทึกไว้ (History)',
    btnClearHistory: 'ลบประวัติทั้งหมด',
    emptyHistory: 'ยังไม่มีประวัติที่บันทึกไว้',
    quickLinksTitle: 'ไปหน้าเครื่องมือ (Tools)',
    qcRemTitle: '💰 คำนวณเงินคงเหลือ (Remaining)',
    qcRebalTitle: '📊 Rebalance พอร์ต',
    qcSlipTitle: '📄 จำลองสลิปเงินเดือน',
    qcTaxTitle: '🧾 คำนวณภาษีประจำปี',
    qcPvdTitle: '📈 ตารางบันทึก PVD',
    qcDebtTitle: '📉 วางแผนปลดหนี้ (Debt)',
    savedSuccess: '✓ บันทึกสำเร็จ',
    statusHealthy: 'สุขภาพการเงินดี',
    statusCaution: 'ต้องระวัง',
    deleteTitle: 'ลบ',
    eyebrow: 'ภาพรวม (DASHBOARD)',
    goalsTitle: '🎯 เป้าหมายทางการเงิน (Goals & Milestones)',
    btnEditGoals: '⚙️ ตั้งค่าเป้าหมาย',
    goalEmergencyTitle: '🛡️ เงินสำรองฉุกเฉิน (Emergency Fund)',
    goalNetWorthTitle: '💎 ความมั่งคั่งสุทธิ (Net Worth Milestone)',
    goalDebtTitle: '🚀 เป้าหมายปลดหนี้สิน (Debt-Free Goal)',
    lblGoalsModalTitle: '🎯 กำหนดเป้าหมายทางการเงิน',
    lblModalEmergency: '🛡️ เป้าหมายเงินสำรองฉุกเฉิน (เดือนของค่าใช้จ่าย)',
    lblModalNetWorth: '💎 เป้าหมายความมั่งคั่งสุทธิ (บาท)',
    lblGoalEmergencyHorizon: 'ความเร็วการสะสม:',
    lblGoalScenario: 'ผลตอบแทน:',
    lblModalReturnRate: '📈 ผลตอบแทนคาดหวังต่อปีสำหรับเป้าหมายความมั่งคั่ง (%)',
    btnResetGoalsText: 'รีเซ็ตค่าเริ่มต้น',
    btnCloseGoalsModal: 'ยกเลิก',
    btnSaveGoalsText: 'บันทึก',
    monthsUnit: 'เดือน',
    btnPrint: 'พิมพ์',
    printTitle: 'พิมพ์รายงานภาพรวมการเงิน',
    printDocTitle: 'Money Superapp — Financial Overview Report',
    printDocSub: 'รายงานสรุปภาพรวมสถานะการเงินและความมั่งคั่งสุทธิ',
    lblArchiveSnapshots: 'ย้ายข้อมูลเก่าไปคลัง (>1 ปี)',
    lblRestoreArchive: 'กู้คืนคลัง',
    archiveSuccess: (n) => `✓ ย้ายข้อมูลประวัติเก่า ${n} รายการไปจัดเก็บในคลัง IndexedDB สำเร็จ`,
    restoreSuccess: (n) => `✓ กู้คืนประวัติจากคลัง ${n} รายการเรียบร้อยแล้ว`,
    archiveEmpty: 'ไม่มีประวัติที่เก่ากว่า 1 ปีให้จัดเก็บ',
    compTitle: '⚖️ โครงสร้างความมั่งคั่งและสินทรัพย์ (Net Worth Composition)',
    compCash: 'เงินสด & สำรองฉุกเฉิน',
    compInvest: 'พอร์ตการลงทุน',
    compDebt: 'ภาระหนี้สินรวม',
    solvencyTitle: 'อัตราส่วนความมั่งคั่งสุทธิ (Solvency Ratio)',
    solvencyHealthy: 'มั่นคงสูง',
    solvencyModerate: 'ปานกลาง',
    solvencyCaution: 'หนี้สินสูง',
    solvencyDebtFree: 'ปลอดหนี้ 100% 🎉',
    grossAssetsLabel: 'สินทรัพย์รวม: ',
    debtRatioLabel: 'หนี้สินต่อสินทรัพย์ (D/A): ',
    donutCenterNetWorth: 'Net Worth',
    goalFireTitle: '🔥 อิสรภาพทางการเงิน (FIRE Number)',
    lblFireSwrPillsTitle: 'อัตราถอน (SWR):',
    lblFirePassiveIncome: '🛡️ Passive Income ปลอดภัย:',
    lblMcTitle: '🎲 จำลองโอกาสรอดพ้นความยากจน (Monte Carlo Ruin Probability)',
    lblMcP10Title: '📉 กรณีวิกฤต (10th %)',
    lblMcP50Title: '📊 ค่ามัธยฐาน (50th %)',
    lblMcP90Title: '📈 กรณีตลาดดี (90th %)',
    lblMcExpl:
      '💡 <strong>ลำดับผลตอบแทน (Sequence of Returns):</strong> จำลองผลตอบแทนแบบสุ่ม 500 สถานการณ์อิงความผันผวนตลาดจริง (SD 10%) โดยปรับอัตราการถอนตามเงินเฟ้อ 2.5%/ปี เพื่อทดสอบว่าเงินจะหมดก่อนครบ 30 ปีหรือไม่',
    lblModalAnnualExpenses: '🔥 ค่าใช้จ่ายรายปีสำหรับคำนวณ FIRE (บาท/ปี, 0 = ดึงอัตโนมัติ)',
    btnAutoExpenses: 'ดึงอัตโนมัติ (Auto)',
    deflatorTitle: '📉 ปรับลดเงินเฟ้อ &amp; อำนาจซื้อที่แท้จริง (Inflation Deflator &amp; Real Purchasing Power)',
    deflatorRateLabel: 'อัตราเงินเฟ้อเฉลี่ยต่อปี (Inflation Rate):',
    deflatorHorizonLabel: 'ระยะเวลาคาดการณ์ (Horizon Years):',
    cardNominalNW: 'ความมั่งคั่งสุทธิปัจจุบัน (Nominal)',
    cardRealPower: 'อำนาจซื้อที่แท้จริงในอนาคต (Real Power)',
    cardRequiredNominal: 'ยอดเงินที่ต้องมีเพื่อรักษาอำนาจซื้อ',
    deflatorTableTitle: '📊 ตารางเปรียบเทียบอำนาจซื้อลดทอนตามเวลา (Inflation Discount Schedule)',
    healthScoreTitle: '🎯 สุขภาพทางการเงินรอบด้าน 360° (Financial Health Score)',
    pillarRunway: '🛡️ สำรองฉุกเฉิน (Emergency Runway)',
    subPillarRunway: 'เป้าหมาย 6 เดือนขึ้นไป',
    pillarSavings: '💰 วินัยการออม (Savings Discipline)',
    subPillarSavings: 'อัตราการออมต่อรายรับ',
    pillarDebt: '📉 ภาระหนี้ & ความปลอดภัย (Debt Health)',
    subPillarDebt: 'สัดส่วนหนี้ต่อสินทรัพย์ (D/A)',
    pillarWealth: '💎 ความมั่งคั่ง & เกษียณ (FIRE Readiness)',
    subPillarWealth: 'ความก้าวหน้าสู่เป้าหมายเกษียณ',
    pillarTax: '🧾 ประสิทธิภาพการลดหย่อนภาษี (Tax Efficiency)',
    subPillarTax: 'การใช้สิทธิประโยชน์ทางภาษี',
    insPanelTitle: '🛡️ ความคุ้มครองและการประกันชีวิต (Life Insurance Adequacy)',
    insProfileTitle: '📋 สมมติฐานความต้องการความคุ้มครอง (Capital Needs Assumptions)',
    insSyncBtn: 'ดึงข้อมูลอัตโนมัติ',
    insDebtLabel: 'ภาระหนี้สินที่ต้องปิด (Debt):',
    insDebtSub: 'บ้าน/รถ/บัตร',
    insExpensesLabel: 'ค่าใช้จ่ายครอบครัวต่อปี (Expenses/yr):',
    insExpensesSub: 'รายเดือน x 12',
    insSupportYearsLabel: 'ระยะเวลาส่งเสียเลี้ยงดู (Support Years):',
    insChildLabel: 'กองทุนการศึกษาบุตร (Child Fund):',
    insChildSub: 'ค่าเล่าเรียน/เป้าหมาย',
    insEmergencyLabel: 'เงินสำรองฉุกเฉิน/จัดการศพ (Final Expenses):',
    insEmergencySub: 'ค่าใช้จ่ายช่วงเปลี่ยนผ่าน',
    insLiquidLabel: 'สินทรัพย์สภาพคล่องที่มี (Liquid Assets):',
    insLiquidSub: 'เงินสด + พอร์ต',
    insExistingLabel: 'ทุนประกันชีวิตเดิมที่มี (Existing Coverage):',
    insExistingSub: 'กรมธรรม์เดิมรวม',
    insMeterTitle: 'อัตราความคุ้มครองที่ครอบคลุม (Protection Adequacy):',
    cardInsNeeds: 'ทุนประกันที่จำเป็น',
    cardInsResources: 'ทรัพยากรที่มีอยู่เดิม',
    cardInsGap: 'ช่องว่างความคุ้มครอง',
    subInsNeeds: 'หนี้สิน + ค่าครองชีพ',
    subInsResources: 'สินทรัพย์ + ประกันเดิม',
    subInsAdequate: 'ครอบคลุมเพียงพอ',
    subInsShortfall: 'ขาดความคุ้มครอง',
    subInsSurplus: 'มีส่วนเกินความคุ้มครอง',
    insHlvTitle: 'มุมมองมูลค่าชีวิตมนุษย์ (Human Life Value - HLV):',
    insTaxTitle: '🧾 สิทธิประโยชน์ลดหย่อนภาษี (PIT Deduction)',
    insGotoTaxBtn: 'วางแผนภาษี ➔',
    threeBucketTitle: '📦 กลยุทธ์ 3 ถังเกษียณสุข & บำนาญประกันสังคม (Retirement 3-Bucket Strategy)',
    threeBucketAssumptions: '📋 สมมติฐานกระแสเงินสดวัยเกษียณ (Cash Flow Assumptions)',
    threeBucketSyncBtn: 'ดึงข้อมูลอัตโนมัติ',
    threeBucketExpenseLabel: 'ค่าใช้จ่ายยังชีพต่อปี (Living Expense/yr):',
    threeBucketExpenseSub: 'รายเดือน x 12',
    threeBucketSsoLabel: 'บำนาญประกันสังคมต่อเดือน (SSO Pension):',
    threeBucketSsoSub: 'ม.33/39',
    threeBucketElderlyLabel: 'เบี้ยผู้สูงอายุต่อเดือน (Elderly Allowance):',
    threeBucketElderlySub: '600–1,000 บ.',
    threeBucketAssetsLabel: 'มูลค่าพอร์ตเกษียณรวม (Total Assets):',
    threeBucketAssetsSub: 'สินทรัพย์ทั้งหมด',
    threeBucketB1YearsLabel: 'ถังที่ 1: เงินสดครอบคลุม (Cash Years):',
    threeBucketB2YearsLabel: 'ถังที่ 2: ตราสารหนี้ครอบคลุม (Bonds Years):',
    threeBucketBarTitle: 'สัดส่วนพอร์ต 3 ถังเกษียณสุข (Bucket Allocation Breakdown):',
    cardB1: 'ถัง 1: เงินสดสภาพคล่อง',
    cardB2: 'ถัง 2: ตราสารหนี้ & SSO',
    cardB3: 'ถัง 3: หุ้นเติบโตระยะยาว',
    cardBYield: 'ปันผล/ดอกเบี้ยต่อปี',
    subCardB1: 'คุ้มครอง 1-2 ปีแรก',
    subCardB2: 'คุ้มครองปีที่ 3-7',
    subCardB3: 'ลงทุนยาว 8+ ปี',
  },
  en: {
    title: 'Financial Dashboard',
    subtitle: 'Overview of Net Worth and Historical Growth',
    refreshTitle: 'Refresh Data',
    kpiNetworth: 'Net Worth',
    networthSub: 'Assets - Liabilities',
    kpiSavings: 'Monthly Cash Flow',
    kpiRunway: 'Emergency Runway',
    runwaySub: 'Liquid Survival',
    kpiDebt: 'Total Debt Balance',
    taxBracket: 'Current Tax Bracket',
    taxPayLabel: 'Estimated Tax Payable',
    chartTitle: 'Growth Trends',
    btnSnapshot: '+ Save Snapshot',
    btnChartNw: '💰 Net Worth',
    btnChartSav: '📈 Savings Rate',
    btnChartEmg: '🛡️ Emergency Reserve',
    btnChartDebt: '📉 Debt Balance',
    lblTrajectoryGrowth: 'Total Growth:',
    lblTrajectoryMom: 'MoM:',
    lblTrajectoryVsStart: '(vs start)',
    historyTitle: 'Saved History',
    btnClearHistory: 'Clear All History',
    emptyHistory: 'No snapshot history found',
    quickLinksTitle: 'Tools & Calculators',
    qcRemTitle: '💰 Remaining Money & Budget',
    qcRebalTitle: '📊 Rebalance Portfolio',
    qcSlipTitle: '📄 Payslip Simulator',
    qcTaxTitle: '🧾 Income Tax Estimation',
    qcPvdTitle: '📈 PVD & Severance Tax',
    qcDebtTitle: '📉 Debt Payoff Calculator',
    savedSuccess: '✓ Saved successfully',
    statusHealthy: 'Financially Healthy',
    statusCaution: 'Caution',
    deleteTitle: 'Delete',
    eyebrow: 'FINANCIAL DASHBOARD',
    goalsTitle: '🎯 Financial Goals & Milestones',
    btnEditGoals: '⚙️ Configure Goals',
    goalEmergencyTitle: '🛡️ Emergency Runway Goal',
    goalNetWorthTitle: '💎 Net Worth Milestone',
    goalDebtTitle: '🚀 Debt-Free Goal',
    lblGoalsModalTitle: '🎯 Configure Financial Goals',
    lblModalEmergency: '🛡️ Emergency Runway Target (months of expenses)',
    lblModalNetWorth: '💎 Net Worth Milestone Target (THB)',
    lblGoalEmergencyHorizon: 'Accumulation Velocity:',
    lblGoalScenario: 'Return Rate:',
    lblModalReturnRate: '📈 Expected Annual Return for Net Worth Goal (%)',
    btnResetGoalsText: 'Reset Defaults',
    btnCloseGoalsModal: 'Cancel',
    btnSaveGoalsText: 'Save Goals',
    monthsUnit: 'mos',
    btnPrint: 'Print',
    printTitle: 'Print Financial Summary Report',
    printDocTitle: 'Money Superapp — Financial Overview Report',
    printDocSub: 'Comprehensive Financial Health & Net Worth Summary',
    lblArchiveSnapshots: 'Archive Older Data (>1 yr)',
    lblRestoreArchive: 'Restore Archive',
    archiveSuccess: (n) => `✓ Archived ${n} historical snapshots to IndexedDB storage`,
    restoreSuccess: (n) => `✓ Restored ${n} snapshots from archive`,
    archiveEmpty: 'No snapshots older than 12 months to archive',
    compTitle: '⚖️ Net Worth & Asset Composition',
    compCash: 'Cash & Emergency Fund',
    compInvest: 'Investment Portfolio',
    compDebt: 'Total Liabilities & Debt',
    solvencyTitle: 'Solvency Ratio (Net Worth / Assets)',
    solvencyHealthy: 'Highly Solvent',
    solvencyModerate: 'Moderate Leverage',
    solvencyCaution: 'High Leverage',
    solvencyDebtFree: '100% Debt-Free 🎉',
    grossAssetsLabel: 'Gross Assets: ',
    debtRatioLabel: 'Debt-to-Asset (D/A): ',
    donutCenterNetWorth: 'Net Worth',
    goalFireTitle: '🔥 Financial Independence (FIRE Number)',
    lblFireSwrPillsTitle: 'Safe Withdrawal (SWR):',
    lblFirePassiveIncome: '🛡️ Safe Annual Passive Income:',
    lblMcTitle: '🎲 Monte Carlo Retirement Ruin Probability',
    lblMcP10Title: '📉 Bear Market (10th %)',
    lblMcP50Title: '📊 Median Path (50th %)',
    lblMcP90Title: '📈 Bull Market (90th %)',
    lblMcExpl:
      '💡 <strong>Sequence of Returns:</strong> Simulates 500 stochastic market scenarios (SD 10%) with 2.5% inflation-adjusted withdrawals over 30 years to quantify depletion risk.',
    lblModalAnnualExpenses: '🔥 Annual Expenses for FIRE (THB/yr, 0 = Auto)',
    btnAutoExpenses: 'Auto Sync',
    deflatorTitle: '📉 Inflation Deflator &amp; Real Purchasing Power',
    deflatorRateLabel: 'Annual Inflation Rate:',
    deflatorHorizonLabel: 'Projection Horizon:',
    cardNominalNW: 'Current Net Worth (Nominal)',
    cardRealPower: 'Future Real Purchasing Power',
    cardRequiredNominal: 'Target Needed to Preserve Real Wealth',
    deflatorTableTitle: '📊 Multi-Year Purchasing Power Discount Schedule',
    healthScoreTitle: '🎯 360° Financial Health Scorecard',
    pillarRunway: '🛡️ Emergency Runway',
    subPillarRunway: 'Benchmark: 6+ months of expenses',
    pillarSavings: '💰 Savings Discipline',
    subPillarSavings: 'Savings rate of total income',
    pillarDebt: '📉 Debt Health & Solvency',
    subPillarDebt: 'Debt-to-Asset ratio (D/A)',
    pillarWealth: '💎 Wealth & FIRE Readiness',
    subPillarWealth: 'Progress toward retirement target',
    pillarTax: '🧾 Tax Deduction Efficiency',
    subPillarTax: 'Utilization of tax optimization allowances',
    insPanelTitle: '🛡️ Life Insurance Adequacy & Protection Gap',
    insProfileTitle: '📋 Capital Needs Analysis Assumptions',
    insSyncBtn: 'Auto Sync Data',
    insDebtLabel: 'Outstanding Debt Clearance (Debt):',
    insDebtSub: 'Mortgage/Auto/Cards',
    insExpensesLabel: 'Annual Living Expenses (Expenses/yr):',
    insExpensesSub: 'Monthly exp x 12',
    insSupportYearsLabel: 'Support Duration (Support Years):',
    insChildLabel: 'Children Education Fund (Child Fund):',
    insChildSub: 'College / milestones',
    insEmergencyLabel: 'Emergency & Final Expenses:',
    insEmergencySub: 'Transition cushion',
    insLiquidLabel: 'Current Liquid Assets (Liquid Assets):',
    insLiquidSub: 'Cash + Portfolio',
    insExistingLabel: 'Existing Life Coverage (Existing Coverage):',
    insExistingSub: 'Current sum assured',
    insMeterTitle: 'Protection Adequacy Ratio:',
    cardInsNeeds: 'Total Capital Needed',
    cardInsResources: 'Existing Resources',
    cardInsGap: 'Protection Gap',
    subInsNeeds: 'Debt + living expenses',
    subInsResources: 'Liquid assets + insurance',
    subInsAdequate: 'Adequately Covered',
    subInsShortfall: 'Coverage Shortfall',
    subInsSurplus: 'Coverage Surplus',
    insHlvTitle: 'Human Life Value (HLV) Perspective:',
    insTaxTitle: '🧾 Tax Deduction Opportunity (PIT)',
    insGotoTaxBtn: 'Tax Planning ➔',
    threeBucketTitle: '📦 Retirement 3-Bucket Strategy & SSO Drawdown',
    threeBucketAssumptions: '📋 Retirement Cash Flow Assumptions',
    threeBucketSyncBtn: 'Auto-Sync Data',
    threeBucketExpenseLabel: 'Annual Living Expenses (Living Expense/yr):',
    threeBucketExpenseSub: 'Monthly x 12',
    threeBucketSsoLabel: 'Monthly Social Security Pension (SSO):',
    threeBucketSsoSub: 'Sec 33/39',
    threeBucketElderlyLabel: 'Monthly Senior Allowance (Elderly Allowance):',
    threeBucketElderlySub: '600–1,000 THB',
    threeBucketAssetsLabel: 'Total Accumulated Retirement Assets:',
    threeBucketAssetsSub: 'Total Portfolio',
    threeBucketB1YearsLabel: 'Bucket 1: Cash Horizon (Cash Years):',
    threeBucketB2YearsLabel: 'Bucket 2: Bonds Horizon (Bonds Years):',
    threeBucketBarTitle: '3-Bucket Portfolio Allocation Breakdown:',
    cardB1: 'Bucket 1: Cash Cushion',
    cardB2: 'Bucket 2: Bonds & SSO',
    cardB3: 'Bucket 3: Growth Equities',
    cardBYield: 'Annual Yield/Dividends',
    subCardB1: 'First 1-2 Years Buffer',
    subCardB2: 'Years 3-7 Income Engine',
    subCardB3: 'Long-term 8+ Years Growth',
  },
};

function applyLocalization() {
  const t = translations[LANG] || translations.th;
  document.title = LANG === 'en' ? 'Financial Dashboard — Money Superapp' : 'ภาพรวมการเงิน — Money Superapp';

  const textMapping = {
    'lbl-eyebrow': t.eyebrow,
    'txt-title': t.title,
    'lbl-subtitle': t.subtitle,
    'lbl-kpi-networth': t.kpiNetworth,
    'lbl-kpi-nw-sub': t.networthSub,
    'lbl-kpi-savings': t.kpiSavings,
    'lbl-kpi-runway': t.kpiRunway,
    'lbl-kpi-rw-sub': t.runwaySub,
    'lbl-kpi-debt': t.kpiDebt,
    'lbl-tax-bracket': t.taxBracket,
    'lbl-tax-pay-label': t.taxPayLabel,
    'lbl-chart-title-txt': t.chartTitle,
    'lbl-btn-snapshot': t.btnSnapshot,
    'btn-chart-nw': t.btnChartNw,
    'btn-chart-sav': t.btnChartSav,
    'btn-chart-emg': t.btnChartEmg,
    'btn-chart-debt': t.btnChartDebt,
    'lbl-trajectory-growth-txt': t.lblTrajectoryGrowth,
    'lbl-trajectory-mom-txt': t.lblTrajectoryMom,
    'lbl-trajectory-vs-start': t.lblTrajectoryVsStart,
    'lbl-history-title': t.historyTitle,
    'btn-clear-history': t.btnClearHistory,
    'lbl-quick-links': t.quickLinksTitle,
    'qc-rem-title': t.qcRemTitle,
    'qc-rebal-title': t.qcRebalTitle,
    'qc-slip-title': t.qcSlipTitle,
    'qc-tax-title': t.qcTaxTitle,
    'qc-pvd-title': t.qcPvdTitle,
    'qc-debt-title': t.qcDebtTitle,
    'lbl-goals-title': t.goalsTitle,
    'lbl-btn-edit-goals': t.btnEditGoals,
    'lbl-goal-emergency-title': t.goalEmergencyTitle,
    'lbl-goal-networth-title': t.goalNetWorthTitle,
    'lbl-goal-debt-title': t.goalDebtTitle,
    'lbl-goal-fire-title': t.goalFireTitle,
    'lbl-fire-swr-pills-title': t.lblFireSwrPillsTitle,
    'lbl-fire-passive-income': t.lblFirePassiveIncome,
    lblGoalsModalTitle: t.lblGoalsModalTitle,
    lblModalEmergency: t.lblModalEmergency,
    lblModalNetWorth: t.lblModalNetWorth,
    lblModalAnnualExpenses: t.lblModalAnnualExpenses,
    btnAutoExpenses: t.btnAutoExpenses,
    'lbl-goal-emergency-horizon-title': t.lblGoalEmergencyHorizon,
    'lbl-scenario-title': t.lblGoalScenario,
    lblModalReturnRate: t.lblModalReturnRate,
    btnResetGoalsText: t.btnResetGoalsText,
    btnCloseGoalsModal: t.btnCloseGoalsModal,
    btnSaveGoalsText: t.btnSaveGoalsText,
    'lbl-btn-print': t.btnPrint,
    'lbl-print-doc-title': t.printDocTitle,
    'lbl-print-doc-sub': t.printDocSub,
    lblArchiveSnapshots: t.lblArchiveSnapshots,
    lblRestoreArchive: t.lblRestoreArchive,
    'lbl-composition-title': t.compTitle,
    'lbl-comp-cash': t.compCash,
    'lbl-comp-invest': t.compInvest,
    'lbl-comp-debt': t.compDebt,
    'lbl-solvency-title': t.solvencyTitle,
    'lbl-donut-center-title': t.donutCenterNetWorth,
    'lbl-deflator-title': t.deflatorTitle,
    'lbl-deflator-rate': t.deflatorRateLabel,
    'lbl-deflator-horizon': t.deflatorHorizonLabel,
    'lbl-card-nominal-nw': t.cardNominalNW,
    'lbl-card-real-power': t.cardRealPower,
    'lbl-card-required-nominal': t.cardRequiredNominal,
    'lbl-deflator-table-title': t.deflatorTableTitle,
    'lbl-health-score-title': t.healthScoreTitle,
    'lbl-pillar-runway': t.pillarRunway,
    'sub-pillar-runway': t.subPillarRunway,
    'lbl-pillar-savings': t.pillarSavings,
    'sub-pillar-savings': t.subPillarSavings,
    'lbl-pillar-debt': t.pillarDebt,
    'sub-pillar-debt': t.subPillarDebt,
    'lbl-pillar-wealth': t.pillarWealth,
    'sub-pillar-wealth': t.subPillarWealth,
    'lbl-pillar-tax': t.pillarTax,
    'sub-pillar-tax': t.subPillarTax,
    'lbl-mc-title': t.lblMcTitle,
    'lbl-mc-p10-title': t.lblMcP10Title,
    'lbl-mc-p50-title': t.lblMcP50Title,
    'lbl-mc-p90-title': t.lblMcP90Title,
    'lbl-ins-title': t.insPanelTitle,
    'lbl-ins-profile-title': t.insProfileTitle,
    lblSyncInsurance: t.insSyncBtn,
    'lbl-ins-debt': t.insDebtLabel,
    'lbl-ins-debt-sub': t.insDebtSub,
    'lbl-ins-expenses': t.insExpensesLabel,
    'lbl-ins-expenses-sub': t.insExpensesSub,
    'lbl-ins-support-years': t.insSupportYearsLabel,
    'lbl-ins-child': t.insChildLabel,
    'lbl-ins-child-sub': t.insChildSub,
    'lbl-ins-emergency': t.insEmergencyLabel,
    'lbl-ins-emergency-sub': t.insEmergencySub,
    'lbl-ins-liquid': t.insLiquidLabel,
    'lbl-ins-liquid-sub': t.insLiquidSub,
    'lbl-ins-existing': t.insExistingLabel,
    'lbl-ins-existing-sub': t.insExistingSub,
    'lbl-ins-meter-title': t.insMeterTitle,
    'lbl-card-ins-needs': t.cardInsNeeds,
    'lbl-card-ins-resources': t.cardInsResources,
    'lbl-card-ins-gap': t.cardInsGap,
    'sub-ins-needs-breakdown': t.subInsNeeds,
    'sub-ins-resources-breakdown': t.subInsResources,
    'lbl-ins-hlv-title': t.insHlvTitle,
    'lbl-ins-tax-title': t.insTaxTitle,
    'btn-ins-goto-tax': t.insGotoTaxBtn,
    'lbl-three-bucket-title': t.threeBucketTitle,
    'lbl-bucket-assumptions-title': t.threeBucketAssumptions,
    lblSyncThreeBuckets: t.threeBucketSyncBtn,
    'lbl-bucket-expense': t.threeBucketExpenseLabel,
    'lbl-bucket-expense-sub': t.threeBucketExpenseSub,
    'lbl-bucket-sso': t.threeBucketSsoLabel,
    'lbl-bucket-sso-sub': t.threeBucketSsoSub,
    'lbl-bucket-elderly': t.threeBucketElderlyLabel,
    'lbl-bucket-elderly-sub': t.threeBucketElderlySub,
    'lbl-bucket-assets': t.threeBucketAssetsLabel,
    'lbl-bucket-assets-sub': t.threeBucketAssetsSub,
    'lbl-bucket-b1-years': t.threeBucketB1YearsLabel,
    'lbl-bucket-b2-years': t.threeBucketB2YearsLabel,
    'lbl-bucket-bar-title': t.threeBucketBarTitle,
    'lbl-card-b1': t.cardB1,
    'lbl-card-b2': t.cardB2,
    'lbl-card-b3': t.cardB3,
    'lbl-card-b-yield': t.cardBYield,
    'sub-card-b1': t.subCardB1,
    'sub-card-b2': t.subCardB2,
    'sub-card-b3': t.subCardB3,
  };

  const mcExplEl = document.getElementById('lbl-mc-expl');
  if (mcExplEl) mcExplEl.innerHTML = t.lblMcExpl;

  Object.keys(textMapping).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = textMapping[id];
  });

  document.querySelectorAll('.lbl-months-unit').forEach((el) => {
    el.textContent = t.monthsUnit;
  });

  const btnRefresh = document.getElementById('btn-refresh');
  if (btnRefresh) btnRefresh.title = t.refreshTitle;

  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) btnPrint.title = t.printTitle;

  const btnHor5 = document.getElementById('btnHorPreset5');
  if (btnHor5) btnHor5.textContent = LANG === 'en' ? '5 Yrs' : '5 ปี';
  const btnHor10 = document.getElementById('btnHorPreset10');
  if (btnHor10) btnHor10.textContent = LANG === 'en' ? '10 Yrs' : '10 ปี';
  const btnHor20 = document.getElementById('btnHorPreset20');
  if (btnHor20) btnHor20.textContent = LANG === 'en' ? '20 Yrs' : '20 ปี';
  const btnHor30 = document.getElementById('btnHorPreset30');
  if (btnHor30) btnHor30.textContent = LANG === 'en' ? '30 Yrs' : '30 ปี';

  const btnIns3 = document.getElementById('btnInsYear3');
  if (btnIns3) btnIns3.textContent = LANG === 'en' ? '3 Yrs' : '3 ปี';
  const btnIns5 = document.getElementById('btnInsYear5');
  if (btnIns5) btnIns5.textContent = LANG === 'en' ? '5 Yrs' : '5 ปี';
  const btnIns10 = document.getElementById('btnInsYear10');
  if (btnIns10) btnIns10.textContent = LANG === 'en' ? '10 Yrs' : '10 ปี';
  const btnIns15 = document.getElementById('btnInsYear15');
  if (btnIns15) btnIns15.textContent = LANG === 'en' ? '15 Yrs' : '15 ปี';
  const btnIns20 = document.getElementById('btnInsYear20');
  if (btnIns20) btnIns20.textContent = LANG === 'en' ? '20 Yrs' : '20 ปี';
}

applyLocalization();

const SNAPSHOT_KEY = 'moneySuperapp.historicalSnapshots.v1';
let chartMode = 'networth';

/**
 * Read cross-calculator live state from localStorage
 */
function gatherFinancialProfile() {
  // 1. Rebalance
  let portfolioVal = 0;
  try {
    const raw = localStorage.getItem('rebalanceCalculator.state.v1');
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.buckets)) {
        portfolioVal = s.buckets.reduce(
          (bSum, b) => bSum + (b.assets || []).reduce((aSum, a) => aSum + parseNum(a.value), 0),
          0,
        );
      }
    }
  } catch (_e) {}

  // 2. Remaining Money & Cash Flow
  let monthlyIncome = 0;
  let monthlyExpense = 0;
  let monthlySavings = 0;
  let monthlyInvest = 0;
  let emergencyReserve = 0;
  let runwayMonths = 0;
  try {
    const raw = localStorage.getItem('remainingMoneyCalculator.state.v1');
    if (raw) {
      const s = JSON.parse(raw);
      if (s) {
        monthlyIncome = (s.incomes || []).reduce((sum, i) => sum + parseNum(i.value), 0);
        monthlyExpense = (s.expenses || []).reduce((sum, e) => sum + parseNum(e.value), 0);
        monthlySavings = (s.savings || []).reduce((sum, sa) => sum + parseNum(sa.value), 0);
        monthlyInvest = Math.max(0, monthlyIncome - monthlyExpense - monthlySavings);
        emergencyReserve = parseNum(s.currentEmergencyReserve);
        if (monthlyExpense > 0 && emergencyReserve > 0) {
          runwayMonths = emergencyReserve / monthlyExpense;
        }
      }
    }
  } catch (_e) {}

  // 3. Tax
  let estimatedTax = 0;
  let topMarginalRate = 0;
  try {
    const raw = localStorage.getItem('moneySuperapp.taxBase');
    if (raw) {
      const s = JSON.parse(raw);
      let pvd = 0;
      let sso = 0;
      let totalInc = 0;
      if (s?.incomeMode === 'yearly') {
        const yInc = parseNum(s?.yearlyIncome);
        const yBonus = parseNum(s?.yearlyBonus || s?.bonus);
        totalInc = yInc + yBonus;
        pvd =
          s?.yearlyPvd !== undefined && s?.yearlyPvd !== '' ? parseNum(s?.yearlyPvd) : yInc * (parseNum(s?.pvd) / 100);
        sso = s?.yearlySso !== undefined && s?.yearlySso !== '' ? parseNum(s?.yearlySso) : 0;
      } else {
        const salary = Math.max(0, parseNum(s?.salary));
        const bonus = Math.max(0, parseNum(s?.bonus));
        totalInc = salary * 12 + bonus;
        pvd = salary * 12 * (parseNum(s?.pvd) / 100);
        const ssoCapVal = parseNum(s?.ssoCap !== undefined ? s?.ssoCap : 875);
        sso = ssoCapVal > 0 ? Math.min(salary * 0.05, ssoCapVal) * 12 : 0;
      }
      if (totalInc > 0) {
        const expense = Math.min(totalInc * 0.5, 100000);
        const net = Math.max(
          0,
          totalInc - expense - 60000 - pvd - sso - parseNum(s?.fundDeduct) - parseNum(s?.thaiEsgDeduct),
        );

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
        let rem = net;
        for (const b of brackets) {
          if (rem <= 0) break;
          const taxable = Math.min(rem, b.limit);
          estimatedTax += taxable * b.rate;
          rem -= taxable;
        }

        if (net <= 150000) topMarginalRate = 0;
        else if (net <= 300000) topMarginalRate = 5;
        else if (net <= 500000) topMarginalRate = 10;
        else if (net <= 750000) topMarginalRate = 15;
        else if (net <= 1000000) topMarginalRate = 20;
        else if (net <= 2000000) topMarginalRate = 25;
        else if (net <= 5000000) topMarginalRate = 30;
        else topMarginalRate = 35;
      }
    }
  } catch (_e) {}

  // 4. Debt
  let totalDebt = 0;
  let debtFreeText = LANG === 'en' ? 'Debt Free 🎉' : 'ไม่มีหนี้สิน 🎉';
  try {
    const raw = localStorage.getItem('moneySuperapp.debtCalculator.state.v1');
    if (raw) {
      const s = JSON.parse(raw);
      if (s && Array.isArray(s.debts) && s.debts.length > 0) {
        totalDebt = s.debts.reduce((sum, d) => sum + parseNum(d.balance), 0);
        if (totalDebt > 0) {
          const totalMin = s.debts.reduce((sum, d) => sum + parseNum(d.minPayment), 0) + parseNum(s.extraPayment);
          if (totalMin > 0) {
            const approxMonths = Math.ceil(totalDebt / totalMin);
            const now = new Date();
            const targetDate = new Date(now.getFullYear(), now.getMonth() + approxMonths, 1);
            const mEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const mTh = [
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
            const mName = LANG === 'en' ? mEn[targetDate.getMonth()] : mTh[targetDate.getMonth()];
            const yName = LANG === 'en' ? targetDate.getFullYear() : targetDate.getFullYear() + 543;
            debtFreeText = (LANG === 'en' ? 'Target: ' : 'เป้าหมาย: ') + `${mName} ${yName}`;
          } else {
            debtFreeText = (LANG === 'en' ? 'Debts: ' : 'รายการ: ') + s.debts.length;
          }
        }
      }
    }
  } catch (_e) {}

  // Computed totals
  const netWorth = portfolioVal + emergencyReserve - totalDebt;
  const totalSavedAndInvested = monthlySavings + monthlyInvest;
  const savingsRate = monthlyIncome > 0 ? (totalSavedAndInvested / monthlyIncome) * 100 : 0;

  return {
    portfolioVal,
    monthlyIncome,
    monthlyExpense,
    monthlySavings,
    monthlyInvest,
    emergencyReserve,
    runwayMonths,
    totalDebt,
    netWorth,
    savingsRate,
    topMarginalRate,
    estimatedTax,
    debtFreeText,
    annualIncome: monthlyIncome * 12,
  };
}

function renderDashboardKPIs() {
  const p = gatherFinancialProfile();
  const t = translations[LANG] || translations.th;

  if (document.getElementById('kpi-networth-val'))
    document.getElementById('kpi-networth-val').textContent = formatMoney(p.netWorth) + ' ' + unit;
  if (document.getElementById('kpi-savings-rate-val'))
    document.getElementById('kpi-savings-rate-val').textContent =
      (LANG === 'en' ? 'Savings Rate: ' : 'อัตราการออม: ') + p.savingsRate.toFixed(1) + '%';
  if (document.getElementById('kpi-monthly-savings-val'))
    document.getElementById('kpi-monthly-savings-val').textContent =
      formatMoney(p.monthlySavings + p.monthlyInvest) + ' ' + unit;
  if (document.getElementById('kpi-runway-months'))
    document.getElementById('kpi-runway-months').textContent =
      p.runwayMonths > 0 ? p.runwayMonths.toFixed(1) + ' ' + (LANG === 'en' ? 'mos' : 'เดือน') : '-';
  if (document.getElementById('kpi-debt-val'))
    document.getElementById('kpi-debt-val').textContent = formatMoney(p.totalDebt) + ' ' + unit;
  if (document.getElementById('kpi-debtfree-date'))
    document.getElementById('kpi-debtfree-date').textContent = p.debtFreeText;
  if (document.getElementById('kpi-tax-bracket-val'))
    document.getElementById('kpi-tax-bracket-val').textContent = `${p.topMarginalRate}%`;
  if (document.getElementById('kpi-tax-amount'))
    document.getElementById('kpi-tax-amount').textContent = formatMoney(p.estimatedTax) + ' ' + unit;

  const deadlineEl = document.getElementById('kpi-tax-deadline-text');
  if (deadlineEl && typeof MoneyApp.calculateThaiTaxDeadlines === 'function') {
    const deadlines = MoneyApp.calculateThaiTaxDeadlines();
    if (deadlines && deadlines.nextDeadline) {
      const next = deadlines.nextDeadline;
      const isEn = LANG === 'en';
      const days = next.daysRemaining;
      deadlineEl.textContent = isEn
        ? `${next.badgeEn}: ${days === 0 ? 'Today' : days + 'd left'}`
        : `${next.badgeTh}: ${days === 0 ? 'วันนี้' : 'อีก ' + days + ' วัน'}`;
    }
  }

  if (document.getElementById('kpi-networth-badge'))
    document.getElementById('kpi-networth-badge').textContent = p.netWorth >= 0 ? t.statusHealthy : t.statusCaution;

  // Subtitles in quick cards
  if (document.getElementById('qc-rebal-sub'))
    document.getElementById('qc-rebal-sub').textContent =
      `${LANG === 'en' ? 'Portfolio: ' : 'พอร์ต: '}${formatMoney(p.portfolioVal)} ${unit}`;
  if (document.getElementById('qc-rem-sub'))
    document.getElementById('qc-rem-sub').textContent =
      `${LANG === 'en' ? 'Investable: ' : 'คงเหลือลงทุน: '}${formatMoney(p.monthlyInvest)} ${unit}`;
  if (document.getElementById('qc-debt-sub'))
    document.getElementById('qc-debt-sub').textContent =
      `${LANG === 'en' ? 'Debt: ' : 'ยอดหนี้: '}${formatMoney(p.totalDebt)} ${unit}`;

  renderNetWorthComposition(p, t);
  renderInflationDeflator(p.netWorth);
  renderFinancialHealthScorecard(p, t);
}

function calculateFinancialHealthScore({
  runwayMonths = 0,
  savingsRatePct = 0,
  debt = 0,
  assets = 0,
  netWorth = 0,
  fireTarget = 0,
  targetNetWorth = 0,
  annualExpenses = 0,
  taxDeductionsUtilizedPct = null,
} = {}) {
  const safeRunway = Math.max(0, runwayMonths || 0);
  const runwayScore = Math.min(100, Math.round((safeRunway / 6.0) * 100));

  const safeSavingsRate = Math.max(0, savingsRatePct || 0);
  const savingsScore = Math.min(100, Math.round((safeSavingsRate / 50.0) * 100));

  const safeDebt = Math.max(0, debt || 0);
  const safeAssets = Math.max(0, assets || 0);
  let debtScore = 100;
  if (safeDebt > 0) {
    if (safeAssets <= 0) {
      debtScore = 0;
    } else {
      const daRatio = safeDebt / safeAssets;
      debtScore = Math.max(0, Math.min(100, Math.round((1 - Math.min(1, daRatio)) * 100)));
    }
  }

  const safeNetWorth = Math.max(0, netWorth || 0);
  let wealthScore = 50;
  if (fireTarget > 0) {
    wealthScore = Math.min(100, Math.round((safeNetWorth / fireTarget) * 100));
  } else if (targetNetWorth > 0) {
    wealthScore = Math.min(100, Math.round((safeNetWorth / targetNetWorth) * 100));
  } else if (annualExpenses > 0) {
    wealthScore = Math.min(100, Math.round((safeNetWorth / (annualExpenses * 25)) * 100));
  } else if (safeAssets > 0) {
    wealthScore = Math.min(100, Math.max(10, Math.round((safeAssets / 5000000) * 100)));
  }

  let taxScore = 75;
  if (typeof taxDeductionsUtilizedPct === 'number' && !Number.isNaN(taxDeductionsUtilizedPct)) {
    taxScore = Math.max(0, Math.min(100, Math.round(taxDeductionsUtilizedPct)));
  }

  const pillars = {
    runway: runwayScore,
    savings: savingsScore,
    debt: debtScore,
    wealth: wealthScore,
    tax: taxScore,
  };

  const compositeScore = Math.round(
    (pillars.runway + pillars.savings + pillars.debt + pillars.wealth + pillars.tax) / 5,
  );

  let tier = 'moderate';
  if (compositeScore >= 80) tier = 'excellent';
  else if (compositeScore >= 65) tier = 'solid';
  else if (compositeScore < 50) tier = 'critical';

  return {
    compositeScore,
    tier,
    pillars,
  };
}

function renderFinancialHealthScorecard(p, _t) {
  const goals = getFinancialGoals();
  const grossAssets = (p.emergencyReserve || 0) + (p.portfolioVal || 0);
  const annualExp = (p.monthlyExpense || 0) * 12;

  const health = calculateFinancialHealthScore({
    runwayMonths: p.runwayMonths,
    savingsRatePct: p.savingsRate,
    debt: p.totalDebt,
    assets: grossAssets,
    netWorth: p.netWorth,
    fireTarget: 0,
    targetNetWorth: goals.netWorthTarget,
    annualExpenses: annualExp,
    taxDeductionsUtilizedPct: p.topMarginalRate === 0 && p.estimatedTax === 0 ? 100 : 75,
  });

  const badgeEl = document.getElementById('badge-health-score');
  const scoreRunwayEl = document.getElementById('score-pillar-runway');
  const scoreSavingsEl = document.getElementById('score-pillar-savings');
  const scoreDebtEl = document.getElementById('score-pillar-debt');
  const scoreWealthEl = document.getElementById('score-pillar-wealth');
  const scoreTaxEl = document.getElementById('score-pillar-tax');
  const calloutEl = document.getElementById('healthScoreVerdictCallout');

  if (scoreRunwayEl) scoreRunwayEl.textContent = `${health.pillars.runway}/100`;
  if (scoreSavingsEl) scoreSavingsEl.textContent = `${health.pillars.savings}/100`;
  if (scoreDebtEl) scoreDebtEl.textContent = `${health.pillars.debt}/100`;
  if (scoreWealthEl) scoreWealthEl.textContent = `${health.pillars.wealth}/100`;
  if (scoreTaxEl) scoreTaxEl.textContent = `${health.pillars.tax}/100`;

  const isEn = LANG === 'en';
  let tierLabel = isEn ? 'Solid & Balanced' : 'มั่นคงสมดุล';
  let tierColor = 'var(--core)';
  let tierBg = 'var(--ok-dim)';
  let tierBorder = 'var(--core)';

  if (health.tier === 'excellent') {
    tierLabel = isEn ? '🌟 Excellent Resilience' : '🌟 สุขภาพยอดเยี่ยม';
    tierColor = '#059669';
    tierBg = 'rgba(16,185,129,0.12)';
    tierBorder = '#059669';
  } else if (health.tier === 'solid') {
    tierLabel = isEn ? '🛡️ Solid & Well-Balanced' : '🛡️ มั่นคงสมดุล';
    tierColor = '#0284c7';
    tierBg = 'rgba(2,132,199,0.12)';
    tierBorder = '#0284c7';
  } else if (health.tier === 'moderate') {
    tierLabel = isEn ? '⚠️ Moderate Vulnerability' : '⚠️ พอใช้ — ควรระวัง';
    tierColor = '#d97706';
    tierBg = 'rgba(217,119,6,0.12)';
    tierBorder = '#d97706';
  } else {
    tierLabel = isEn ? '🚨 Critical Action Needed' : '🚨 ปรับปรุงเร่งด่วน';
    tierColor = 'var(--danger)';
    tierBg = 'var(--danger-dim)';
    tierBorder = 'var(--danger)';
  }

  if (badgeEl) {
    badgeEl.textContent = `${health.compositeScore}/100 (${tierLabel})`;
    badgeEl.style.color = tierColor;
    badgeEl.style.background = tierBg;
    badgeEl.style.borderColor = tierBorder;
  }

  if (calloutEl) {
    let advice = '';
    if (health.pillars.runway < 60) {
      advice = isEn
        ? 'Priority: Increase your emergency reserve to 6 months of living expenses.'
        : 'ข้อแนะนำเร่งด่วน: เติมเงินสำรองฉุกเฉินให้ครอบคลุมรายจ่ายอย่างน้อย 6 เดือน เพื่อความปลอดภัย';
    } else if (health.pillars.debt < 70) {
      advice = isEn
        ? 'Priority: Accelerate debt payoff using the Avalanche method to reduce interest drag.'
        : 'ข้อแนะนำเร่งด่วน: ทยอยโปะหนี้ดอกเบี้ยสูงเพื่อลดภาระดอกเบี้ยสะสมและเพิ่มความคล่องตัวทางการเงิน';
    } else if (health.pillars.savings < 60) {
      advice = isEn
        ? 'Good progress! Look for opportunities to boost your monthly savings rate above 20%.'
        : 'การเงินอยู่ในเกณฑ์ดี! มองหาโอกาสประหยัดรายจ่ายผันแปรเพื่อเพิ่มอัตราการออมให้เกิน 20%';
    } else {
      advice = isEn
        ? 'Outstanding! Your 5 financial pillars are exceptionally resilient and well-balanced.'
        : 'ยอดเยี่ยมมาก! เสาหลักทางการเงินทั้ง 5 ด้านของคุณแข็งแกร่งและสมดุลพร้อมรองรับเป้าหมายระยะยาว';
    }
    calloutEl.innerHTML = `💡 <strong>${isEn ? 'Advisor Insight:' : 'สรุปคำแนะนำการเงิน:'}</strong> ${advice}`;
  }

  renderRadarChartSVG(health.pillars);
}

function renderRadarChartSVG(pillars) {
  const gridGroup = document.getElementById('radarGridGroup');
  const spokesGroup = document.getElementById('radarSpokesGroup');
  const polyEl = document.getElementById('radarDataPolygon');
  const pointsGroup = document.getElementById('radarPointsGroup');
  const labelsGroup = document.getElementById('radarLabelsGroup');
  if (!gridGroup || !spokesGroup || !polyEl || !pointsGroup || !labelsGroup) return;

  const centerX = 150;
  const centerY = 130;
  const maxR = 85;
  const isEn = LANG === 'en';

  const axes = [
    { key: 'runway', label: isEn ? 'Runway' : 'สำรอง' },
    { key: 'savings', label: isEn ? 'Savings' : 'การออม' },
    { key: 'debt', label: isEn ? 'Debt-Free' : 'ภาระหนี้' },
    { key: 'wealth', label: isEn ? 'Wealth' : 'มั่งคั่ง' },
    { key: 'tax', label: isEn ? 'Tax Opt' : 'ภาษี' },
  ];

  let gridHtml = '';
  const rings = [0.25, 0.5, 0.75, 1.0];
  rings.forEach((k) => {
    const r = maxR * k;
    const pts = [];
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    gridHtml += `<polygon points="${pts.join(' ')}" />`;
  });
  gridGroup.innerHTML = gridHtml;

  let spokesHtml = '';
  let labelsHtml = '';
  axes.forEach((ax, i) => {
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
    const xOuter = centerX + maxR * Math.cos(angle);
    const yOuter = centerY + maxR * Math.sin(angle);
    spokesHtml += `<line x1="${centerX}" y1="${centerY}" x2="${xOuter.toFixed(1)}" y2="${yOuter.toFixed(1)}" />`;

    const xLabel = centerX + (maxR + 20) * Math.cos(angle);
    const yLabel = centerY + (maxR + 18) * Math.sin(angle) + 4;
    labelsHtml += `<text x="${xLabel.toFixed(1)}" y="${yLabel.toFixed(1)}">${ax.label}</text>`;
  });
  spokesGroup.innerHTML = spokesHtml;
  labelsGroup.innerHTML = labelsHtml;

  const dataPts = [];
  let pointsHtml = '';
  axes.forEach((ax, i) => {
    const score = Math.max(5, Math.min(100, pillars[ax.key] || 0));
    const r = maxR * (score / 100);
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    dataPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    pointsHtml += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="var(--panel)" stroke="var(--core)" stroke-width="2" />`;
  });
  polyEl.setAttribute('points', dataPts.join(' '));
  pointsGroup.innerHTML = pointsHtml;
}

function renderNetWorthComposition(p, t) {
  const c = Math.max(0, p.emergencyReserve || 0);
  const inv = Math.max(0, p.portfolioVal || 0);
  const d = Math.max(0, p.totalDebt || 0);
  const grossAssets = c + inv;
  const nw = p.netWorth;

  let cashPct = 0;
  let investPct = 0;
  let debtRatio = 0;
  let solvencyRatio = 100;

  if (grossAssets > 0) {
    cashPct = (c / grossAssets) * 100;
    investPct = (inv / grossAssets) * 100;
    debtRatio = (d / grossAssets) * 100;
    solvencyRatio = (nw / grossAssets) * 100;
  } else if (d > 0) {
    debtRatio = 100;
    solvencyRatio = -100;
  }

  // DOM elements
  const donutCash = document.getElementById('donutSegCash');
  const donutInvest = document.getElementById('donutSegInvest');
  const donutCenter = document.getElementById('donutCenterNetWorth');
  const badgeSolvency = document.getElementById('badge-solvency-status');
  const valCash = document.getElementById('val-comp-cash');
  const pctCash = document.getElementById('pct-comp-cash');
  const valInvest = document.getElementById('val-comp-invest');
  const pctInvest = document.getElementById('pct-comp-invest');
  const valDebt = document.getElementById('val-comp-debt');
  const pctDebt = document.getElementById('pct-comp-debt');
  const txtSolvency = document.getElementById('txt-solvency-pct');
  const barSolvency = document.getElementById('bar-solvency');
  const txtGross = document.getElementById('txt-gross-assets');
  const txtDebtRatio = document.getElementById('txt-debt-ratio');

  if (donutCenter) donutCenter.textContent = formatMoney(nw) + ' ' + unit;
  if (valCash) valCash.textContent = formatMoney(c) + ' ' + unit;
  if (pctCash) pctCash.textContent = `(${cashPct.toFixed(1)}%)`;
  if (valInvest) valInvest.textContent = formatMoney(inv) + ' ' + unit;
  if (pctInvest) pctInvest.textContent = `(${investPct.toFixed(1)}%)`;
  if (valDebt) valDebt.textContent = formatMoney(d) + ' ' + unit;
  if (pctDebt)
    pctDebt.textContent =
      grossAssets > 0 ? `(${debtRatio.toFixed(1)}% ${LANG === 'en' ? 'of assets' : 'ของสินทรัพย์'})` : '';

  // SVG Donut calculation (r=60, C=2*PI*60 ≈ 376.99)
  const C = 2 * Math.PI * 60;
  if (donutCash && donutInvest) {
    if (grossAssets > 0) {
      const segCash = (cashPct / 100) * C;
      const segInvest = (investPct / 100) * C;
      donutCash.setAttribute('stroke-dasharray', `${segCash.toFixed(2)} ${(C - segCash).toFixed(2)}`);
      donutCash.setAttribute('stroke-dashoffset', '0');
      donutInvest.setAttribute('stroke-dasharray', `${segInvest.toFixed(2)} ${(C - segInvest).toFixed(2)}`);
      donutInvest.setAttribute('stroke-dashoffset', String(-segCash.toFixed(2)));
    } else {
      donutCash.setAttribute('stroke-dasharray', `0 ${C.toFixed(2)}`);
      donutInvest.setAttribute('stroke-dasharray', `0 ${C.toFixed(2)}`);
    }
  }

  // Solvency health status badge & progress bar
  const clampedSolvency = Math.max(0, Math.min(100, solvencyRatio));
  if (barSolvency) barSolvency.style.width = `${clampedSolvency.toFixed(1)}%`;
  if (txtSolvency) txtSolvency.textContent = `${solvencyRatio.toFixed(1)}%`;
  if (txtGross) txtGross.textContent = (t.grossAssetsLabel || 'สินทรัพย์รวม: ') + formatMoney(grossAssets) + ' ' + unit;
  if (txtDebtRatio) {
    txtDebtRatio.textContent =
      d <= 0
        ? LANG === 'en'
          ? 'Debt-to-Asset (D/A): 0% (Debt-Free)'
          : 'หนี้สินต่อสินทรัพย์ (D/A): 0% (ปลอดหนี้)'
        : (t.debtRatioLabel || 'หนี้สินต่อสินทรัพย์ (D/A): ') + `${debtRatio.toFixed(1)}%`;
  }

  if (badgeSolvency) {
    if (d <= 0) {
      badgeSolvency.style.background = 'var(--ok-dim)';
      badgeSolvency.style.color = 'var(--ok)';
      badgeSolvency.style.borderColor = 'var(--ok)';
      badgeSolvency.textContent = t.solvencyDebtFree || 'ปลอดหนี้ 100% 🎉';
    } else if (solvencyRatio >= 80) {
      badgeSolvency.style.background = 'var(--ok-dim)';
      badgeSolvency.style.color = 'var(--ok)';
      badgeSolvency.style.borderColor = 'var(--ok)';
      badgeSolvency.textContent = t.solvencyHealthy || 'มั่นคงสูง';
    } else if (solvencyRatio >= 50) {
      badgeSolvency.style.background = 'var(--blue-dim)';
      badgeSolvency.style.color = 'var(--blue)';
      badgeSolvency.style.borderColor = 'var(--blue)';
      badgeSolvency.textContent = t.solvencyModerate || 'ปานกลาง';
    } else {
      badgeSolvency.style.background = 'var(--danger-dim)';
      badgeSolvency.style.color = 'var(--danger)';
      badgeSolvency.style.borderColor = 'var(--danger)';
      badgeSolvency.textContent = t.solvencyCaution || 'หนี้สินสูง';
    }
  }
}

// --- Life Insurance Adequacy & Family Protection Gap Engine ---
const INSURANCE_STORAGE_KEY = 'moneySuperapp.insuranceAdequacy.v1';

let insuranceAdequacyState = {
  debtClearance: null,
  monthlyExpenses: null,
  supportYears: 10,
  childEducation: 0,
  emergencyCushion: 200000,
  liquidAssets: null,
  existingCoverage: 0,
};

function initInsuranceAdequacy() {
  try {
    const raw = localStorage.getItem(INSURANCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        insuranceAdequacyState = { ...insuranceAdequacyState, ...parsed };
      }
    }
  } catch (_e) {}

  const p = gatherFinancialProfile();

  const debtInput = document.getElementById('inpInsDebt');
  const expensesInput = document.getElementById('inpInsExpenses');
  const supportYearsInput = document.getElementById('inpInsSupportYears');
  const childInput = document.getElementById('inpInsChild');
  const emergencyInput = document.getElementById('inpInsEmergency');
  const liquidInput = document.getElementById('inpInsLiquid');
  const existingInput = document.getElementById('inpInsExisting');

  if (debtInput) {
    debtInput.value =
      insuranceAdequacyState.debtClearance !== null ? insuranceAdequacyState.debtClearance : p.totalDebt;
  }

  if (expensesInput) {
    expensesInput.value =
      insuranceAdequacyState.monthlyExpenses !== null
        ? insuranceAdequacyState.monthlyExpenses
        : Math.round(p.monthlyExpense * 12);
  }

  if (supportYearsInput) {
    supportYearsInput.value = insuranceAdequacyState.supportYears || 10;
  }

  if (childInput) {
    childInput.value = insuranceAdequacyState.childEducation || '';
  }

  if (emergencyInput) {
    emergencyInput.value =
      insuranceAdequacyState.emergencyCushion !== undefined ? insuranceAdequacyState.emergencyCushion : 200000;
  }

  if (liquidInput) {
    liquidInput.value =
      insuranceAdequacyState.liquidAssets !== null
        ? insuranceAdequacyState.liquidAssets
        : Math.round(p.portfolioVal + p.emergencyReserve);
  }

  if (existingInput) {
    existingInput.value = insuranceAdequacyState.existingCoverage || '';
  }

  updateInsuranceSupportPills(insuranceAdequacyState.supportYears || 10);
  updateInsuranceAdequacy();
}

function syncInsuranceFromTools() {
  const p = gatherFinancialProfile();
  const debtInput = document.getElementById('inpInsDebt');
  const expensesInput = document.getElementById('inpInsExpenses');
  const liquidInput = document.getElementById('inpInsLiquid');

  if (debtInput) debtInput.value = p.totalDebt;
  if (expensesInput) expensesInput.value = Math.round(p.monthlyExpense * 12);
  if (liquidInput) liquidInput.value = Math.round(p.portfolioVal + p.emergencyReserve);

  updateInsuranceAdequacy();
}

function setInsuranceSupportYears(years) {
  const input = document.getElementById('inpInsSupportYears');
  if (input) {
    input.value = years;
    updateInsuranceAdequacy();
  }
}

function updateInsuranceSupportPills(activeYears) {
  const pills = [
    { el: document.getElementById('btnInsYear3'), yr: 3 },
    { el: document.getElementById('btnInsYear5'), yr: 5 },
    { el: document.getElementById('btnInsYear10'), yr: 10 },
    { el: document.getElementById('btnInsYear15'), yr: 15 },
    { el: document.getElementById('btnInsYear20'), yr: 20 },
  ];
  pills.forEach(({ el, yr }) => {
    if (el) {
      if (yr === activeYears) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    }
  });
}

function updateInsuranceAdequacy() {
  const debtInput = document.getElementById('inpInsDebt');
  const expensesInput = document.getElementById('inpInsExpenses');
  const supportYearsInput = document.getElementById('inpInsSupportYears');
  const childInput = document.getElementById('inpInsChild');
  const emergencyInput = document.getElementById('inpInsEmergency');
  const liquidInput = document.getElementById('inpInsLiquid');
  const existingInput = document.getElementById('inpInsExisting');

  const p = gatherFinancialProfile();

  const debtClearance = debtInput ? parseNum(debtInput.value) : 0;
  const annualExpenses = expensesInput ? parseNum(expensesInput.value) : 0;
  const monthlyExpenses = annualExpenses / 12;
  const supportYears = supportYearsInput ? parseNum(supportYearsInput.value) : 10;
  const childEducation = childInput ? parseNum(childInput.value) : 0;
  const emergencyCushion = emergencyInput ? parseNum(emergencyInput.value) : 0;
  const liquidAssets = liquidInput ? parseNum(liquidInput.value) : 0;
  const existingCoverage = existingInput ? parseNum(existingInput.value) : 0;

  insuranceAdequacyState = {
    debtClearance,
    monthlyExpenses: annualExpenses,
    supportYears,
    childEducation,
    emergencyCushion,
    liquidAssets,
    existingCoverage,
  };
  try {
    localStorage.setItem(INSURANCE_STORAGE_KEY, JSON.stringify(insuranceAdequacyState));
  } catch (_e) {}

  const yrDisplay = document.getElementById('valInsSupportYearsDisplay');
  if (yrDisplay) {
    yrDisplay.textContent = `${supportYears} ${LANG === 'en' ? 'Yrs' : 'ปี'}`;
  }
  updateInsuranceSupportPills(supportYears);

  const calc = MoneyApp.calculateInsuranceAdequacy({
    debtClearance,
    monthlyExpenses,
    supportYears,
    childEducation,
    emergencyCushion,
    liquidAssets,
    existingCoverage,
    annualIncome: p.annualIncome || p.monthlyIncome * 12,
    marginalTaxRate: p.topMarginalRate,
  });

  const pctDisplay = document.getElementById('txt-ins-adequacy-pct');
  const progressBar = document.getElementById('bar-ins-adequacy');
  const badgeStatus = document.getElementById('badge-ins-status');

  const displayPct = Math.min(100, Math.round(calc.adequacyRatio));
  if (pctDisplay) {
    pctDisplay.textContent = `${calc.adequacyRatio.toFixed(1)}%`;
  }

  if (progressBar) {
    progressBar.style.width = `${displayPct}%`;
    if (calc.status === 'severe_shortfall') {
      progressBar.style.background = 'var(--danger)';
    } else if (calc.status === 'shortfall') {
      progressBar.style.background = 'var(--warn)';
    } else {
      progressBar.style.background = 'var(--ok)';
    }
  }

  if (badgeStatus) {
    if (calc.status === 'severe_shortfall') {
      badgeStatus.style.background = 'var(--danger-dim, rgba(239,68,68,0.12))';
      badgeStatus.style.color = 'var(--danger)';
      badgeStatus.style.borderColor = 'var(--danger)';
      badgeStatus.textContent =
        LANG === 'en'
          ? `⚠️ Shortfall -${formatMoney(calc.protectionGap)} THB`
          : `⚠️ ขาด -${formatMoney(calc.protectionGap)} บาท`;
    } else if (calc.status === 'shortfall') {
      badgeStatus.style.background = 'var(--warn-dim)';
      badgeStatus.style.color = 'var(--warn)';
      badgeStatus.style.borderColor = 'var(--warn)';
      badgeStatus.textContent =
        LANG === 'en' ? `⚠️ Covered ${calc.adequacyRatio.toFixed(0)}%` : `⚠️ ครอบคลุม ${calc.adequacyRatio.toFixed(0)}%`;
    } else if (calc.status === 'optimal') {
      badgeStatus.style.background = 'var(--ok-dim)';
      badgeStatus.style.color = 'var(--ok)';
      badgeStatus.style.borderColor = 'var(--ok)';
      badgeStatus.textContent = LANG === 'en' ? '✅ Adequately Protected' : '✅ คุ้มครองเพียงพอ';
    } else {
      badgeStatus.style.background = 'var(--ok-dim)';
      badgeStatus.style.color = 'var(--ok)';
      badgeStatus.style.borderColor = 'var(--ok)';
      badgeStatus.textContent =
        LANG === 'en' ? `🎉 Surplus +${formatMoney(calc.surplus)} THB` : `🎉 ส่วนเกิน +${formatMoney(calc.surplus)} บาท`;
    }
  }

  const resNote = document.getElementById('txt-ins-resources-note');
  const needsNote = document.getElementById('txt-ins-needs-note');
  if (resNote) {
    resNote.textContent = `${LANG === 'en' ? 'Resources: ' : 'ทรัพยากรที่มี: '}${formatMoney(calc.totalExistingResources)} ${unit}`;
  }
  if (needsNote) {
    needsNote.textContent = `${LANG === 'en' ? 'Total Needs: ' : 'ความต้องการทุนประกัน: '}${formatMoney(calc.totalCapitalNeeds)} ${unit}`;
  }

  const valNeeds = document.getElementById('val-ins-total-needs');
  const valResources = document.getElementById('val-ins-total-resources');
  const valGap = document.getElementById('val-ins-gap');
  const subGap = document.getElementById('sub-ins-gap-status');

  if (valNeeds) valNeeds.textContent = `${formatMoney(calc.totalCapitalNeeds)} ${unit}`;
  if (valResources) valResources.textContent = `${formatMoney(calc.totalExistingResources)} ${unit}`;

  if (valGap && subGap) {
    if (calc.protectionGap > 0) {
      valGap.textContent = `-${formatMoney(calc.protectionGap)} ${unit}`;
      valGap.style.color = calc.status === 'severe_shortfall' ? 'var(--danger)' : 'var(--warn)';
      subGap.textContent = LANG === 'en' ? 'Coverage Shortfall' : 'ขาดความคุ้มครอง';
      subGap.style.color = calc.status === 'severe_shortfall' ? 'var(--danger)' : 'var(--warn)';
    } else {
      valGap.textContent = calc.surplus > 0 ? `+${formatMoney(calc.surplus)} ${unit}` : `0 ${unit}`;
      valGap.style.color = 'var(--ok)';
      subGap.textContent =
        calc.surplus > 0
          ? LANG === 'en'
            ? 'Surplus Protection'
            : 'มีส่วนเกินความคุ้มครอง'
          : LANG === 'en'
            ? 'Adequately Covered'
            : 'ครอบคลุมเพียงพอ';
      subGap.style.color = 'var(--ok)';
    }
  }

  const hlvContent = document.getElementById('txt-ins-hlv-content');
  if (hlvContent) {
    const annualInc = p.annualIncome || p.monthlyIncome * 12;
    if (calc.hlvBenchmark > 0) {
      hlvContent.textContent =
        LANG === 'en'
          ? `Standard rule-of-thumb (7x annual income of ${formatMoney(annualInc)} THB) suggests life coverage of ~${formatMoney(calc.hlvBenchmark)} THB.`
          : `เกณฑ์มาตรฐาน 7 เท่าของรายได้ต่อปี (${formatMoney(annualInc)} บาท) แนะนำทุนประกันประมาณ ${formatMoney(calc.hlvBenchmark)} บาท`;
    } else {
      hlvContent.textContent =
        LANG === 'en'
          ? 'Enter monthly income in Remaining Money tool to view Human Life Value multiplier recommendation.'
          : 'บันทึกรายได้ในเครื่องมือ Remaining Money เพื่อประเมินมูลค่าชีวิตมนุษย์ (HLV)';
    }
  }

  const taxDesc = document.getElementById('txt-ins-tax-desc');
  if (taxDesc) {
    if (calc.protectionGap > 0 && p.topMarginalRate > 0) {
      taxDesc.innerHTML =
        LANG === 'en'
          ? `Under Section 47(1)(d), life insurance premiums are deductible up to 100,000 THB/yr. With your <strong>${p.topMarginalRate}%</strong> tax bracket, closing this gap can yield an estimated tax refund of up to <strong>${formatMoney(calc.potentialTaxSavings)} THB/year</strong>.`
          : `ตาม ม.47(1)(ง) เบี้ยประกันชีวิตทั่วไปหักลดหย่อนได้สูงสุด 100,000 บาท/ปี — ที่ฐานภาษี <strong>${p.topMarginalRate}%</strong> ของคุณ การทำประกันคุ้มครองความเสี่ยงนี้จะช่วยประหยัดภาษีคืนได้สูงสุดประมาณ <strong>${formatMoney(calc.potentialTaxSavings)} บาท/ปี</strong>`;
    } else {
      taxDesc.innerHTML =
        LANG === 'en'
          ? 'Life insurance premiums qualify for up to 100,000 THB statutory personal income tax deduction under Revenue Code Section 47(1)(d).'
          : 'เบี้ยประกันชีวิตทั่วไปสามารถนำมาหักลดหย่อนภาษีเงินได้บุคคลธรรมดาได้สูงสุด 100,000 บาท/ปี ตามมาตรา 47(1)(ง)';
    }
  }
}

// --- Retirement 3-Bucket Cash Flow & SSO Drawdown Simulator (Roadmap Phase 59) ---
const THREE_BUCKET_STORAGE_KEY = 'moneySuperapp.retirementThreeBuckets.state.v1';

let threeBucketState = {
  annualLivingExpense: null,
  monthlySsoPension: 4125,
  monthlyElderlyAllowance: 600,
  totalRetirementAssets: null,
  bucket1Years: 2,
  bucket2Years: 5,
};

function initThreeBucketsCalculator() {
  try {
    const raw = localStorage.getItem(THREE_BUCKET_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        threeBucketState = { ...threeBucketState, ...parsed };
      }
    }
  } catch (_e) {}

  const p = gatherFinancialProfile();
  const inpExpense = document.getElementById('inpBucketExpense');
  const inpSso = document.getElementById('inpBucketSsoPension');
  const inpElderly = document.getElementById('inpBucketElderly');
  const inpAssets = document.getElementById('inpBucketTotalAssets');
  const inpB1Y = document.getElementById('inpBucket1Years');
  const inpB2Y = document.getElementById('inpBucket2Years');

  if (inpExpense) {
    inpExpense.value =
      threeBucketState.annualLivingExpense !== null
        ? threeBucketState.annualLivingExpense
        : Math.round(p.monthlyExpense * 12 || 360000);
  }
  if (inpSso) {
    inpSso.value = threeBucketState.monthlySsoPension !== undefined ? threeBucketState.monthlySsoPension : 4125;
  }
  if (inpElderly) {
    inpElderly.value =
      threeBucketState.monthlyElderlyAllowance !== undefined ? threeBucketState.monthlyElderlyAllowance : 600;
  }
  if (inpAssets) {
    inpAssets.value =
      threeBucketState.totalRetirementAssets !== null
        ? threeBucketState.totalRetirementAssets
        : Math.round(p.portfolioVal + p.emergencyReserve || 6000000);
  }
  if (inpB1Y) inpB1Y.value = threeBucketState.bucket1Years || 2;
  if (inpB2Y) inpB2Y.value = threeBucketState.bucket2Years || 5;

  updateThreeBucketsCalculator();
}

function syncThreeBucketsFromTools() {
  const p = gatherFinancialProfile();
  const inpExpense = document.getElementById('inpBucketExpense');
  const inpAssets = document.getElementById('inpBucketTotalAssets');
  if (inpExpense) inpExpense.value = Math.round(p.monthlyExpense * 12 || 360000);
  if (inpAssets) inpAssets.value = Math.round(p.portfolioVal + p.emergencyReserve || 6000000);
  updateThreeBucketsCalculator();
}

function updateThreeBucketsCalculator() {
  const inpExpense = document.getElementById('inpBucketExpense');
  const inpSso = document.getElementById('inpBucketSsoPension');
  const inpElderly = document.getElementById('inpBucketElderly');
  const inpAssets = document.getElementById('inpBucketTotalAssets');
  const inpB1Y = document.getElementById('inpBucket1Years');
  const inpB2Y = document.getElementById('inpBucket2Years');

  const annualLivingExpense = inpExpense ? parseNum(inpExpense.value) : 360000;
  const monthlySsoPension = inpSso ? parseNum(inpSso.value) : 4125;
  const monthlyElderlyAllowance = inpElderly ? parseNum(inpElderly.value) : 600;
  const totalRetirementAssets = inpAssets ? parseNum(inpAssets.value) : 6000000;
  const bucket1Years = inpB1Y ? parseNum(inpB1Y.value) : 2;
  const bucket2Years = inpB2Y ? parseNum(inpB2Y.value) : 5;

  threeBucketState = {
    annualLivingExpense,
    monthlySsoPension,
    monthlyElderlyAllowance,
    totalRetirementAssets,
    bucket1Years,
    bucket2Years,
  };

  try {
    localStorage.setItem(THREE_BUCKET_STORAGE_KEY, JSON.stringify(threeBucketState));
  } catch (_e) {}

  const b1Display = document.getElementById('valBucket1YearsDisplay');
  const b2Display = document.getElementById('valBucket2YearsDisplay');
  if (b1Display) b1Display.textContent = `${bucket1Years} ${LANG === 'en' ? 'Yrs' : 'ปี'}`;
  if (b2Display) b2Display.textContent = `${bucket2Years} ${LANG === 'en' ? 'Yrs' : 'ปี'}`;

  const calc = MoneyApp.calculateRetirementThreeBuckets({
    annualLivingExpense,
    monthlySsoPension,
    monthlyElderlyAllowance,
    totalRetirementAssets,
    bucket1Years,
    bucket2Years,
  });

  const badgeRunway = document.getElementById('badge-three-bucket-runway');
  if (badgeRunway) {
    if (calc.isUnderfunded) {
      badgeRunway.style.background = 'var(--warn-dim)';
      badgeRunway.style.color = 'var(--warn)';
      badgeRunway.style.borderColor = 'var(--warn)';
      badgeRunway.textContent =
        LANG === 'en'
          ? `⚠️ Shortfall -${formatMoney(calc.shortfallAmount)} THB`
          : `⚠️ ขาดเงินสำรอง -${formatMoney(calc.shortfallAmount)} บาท`;
    } else {
      badgeRunway.style.background = 'var(--ok-dim)';
      badgeRunway.style.color = 'var(--ok)';
      badgeRunway.style.borderColor = 'var(--ok)';
      badgeRunway.textContent =
        LANG === 'en'
          ? `🛡️ Bear-Market Buffer: ${calc.bearMarketRunwayYears} Yrs`
          : `🛡️ เกราะกันตลาดหมี ${calc.bearMarketRunwayYears} ปี`;
    }
  }

  const txtSummary = document.getElementById('txt-bucket-runway-summary');
  if (txtSummary) {
    txtSummary.textContent =
      LANG === 'en'
        ? `Defensive Cushion: ${calc.bearMarketRunwayYears} Years Protected`
        : `ถังป้องกันวิกฤตครอบคลุม ${calc.bearMarketRunwayYears} ปี`;
  }

  const barB1 = document.getElementById('bar-bucket-1');
  const barB2 = document.getElementById('bar-bucket-2');
  const barB3 = document.getElementById('bar-bucket-3');
  const total = calc.totalRetirementAssets || 1;
  const pct1 = Math.min(100, Math.round((calc.bucket1Target / total) * 1000) / 10);
  const pct2 = Math.min(100 - pct1, Math.round((calc.bucket2Target / total) * 1000) / 10);
  const pct3 = Math.max(0, Math.round((calc.bucket3Target / total) * 1000) / 10);

  if (barB1) barB1.style.width = `${pct1}%`;
  if (barB2) barB2.style.width = `${pct2}%`;
  if (barB3) barB3.style.width = `${pct3}%`;

  const legB1 = document.getElementById('leg-bucket-1');
  const legB2 = document.getElementById('leg-bucket-2');
  const legB3 = document.getElementById('leg-bucket-3');
  if (legB1) {
    legB1.textContent =
      LANG === 'en'
        ? `Bucket 1: Cash ${formatMoney(calc.bucket1Target)} THB (${pct1}%)`
        : `ถัง 1: เงินสด ${formatMoney(calc.bucket1Target)} บาท (${pct1}%)`;
  }
  if (legB2) {
    legB2.textContent =
      LANG === 'en'
        ? `Bucket 2: Bonds ${formatMoney(calc.bucket2Target)} THB (${pct2}%)`
        : `ถัง 2: ตราสารหนี้ ${formatMoney(calc.bucket2Target)} บาท (${pct2}%)`;
  }
  if (legB3) {
    legB3.textContent =
      LANG === 'en'
        ? `Bucket 3: Equities ${formatMoney(calc.bucket3Target)} THB (${pct3}%)`
        : `ถัง 3: หุ้นเติบโต ${formatMoney(calc.bucket3Target)} บาท (${pct3}%)`;
  }

  const valB1 = document.getElementById('val-card-b1');
  const valB2 = document.getElementById('val-card-b2');
  const valB3 = document.getElementById('val-card-b3');
  const valYield = document.getElementById('val-card-b-yield');
  const subYield = document.getElementById('sub-card-b-yield');

  if (valB1) valB1.textContent = `${formatMoney(calc.bucket1Target)} ${LANG === 'en' ? 'THB' : 'บาท'}`;
  if (valB2) valB2.textContent = `${formatMoney(calc.bucket2Target)} ${LANG === 'en' ? 'THB' : 'บาท'}`;
  if (valB3) valB3.textContent = `${formatMoney(calc.bucket3Target)} ${LANG === 'en' ? 'THB' : 'บาท'}`;
  if (valYield) valYield.textContent = `${formatMoney(calc.annualYieldCashFlow)} ${LANG === 'en' ? 'THB/yr' : 'บาท/ปี'}`;
  if (subYield) {
    subYield.textContent =
      LANG === 'en' ? `Blended Yield: ${calc.blendedYieldPct}% p.a.` : `ผลตอบแทนเฉลี่ย ${calc.blendedYieldPct}% ต่อปี`;
  }

  const adviceEl = document.getElementById('box-bucket-advice');
  if (adviceEl) {
    const ssoAnnual = calc.annualGuaranteedIncome;
    const netDraw = calc.netAnnualDrawdown;
    if (calc.isUnderfunded) {
      adviceEl.innerHTML =
        LANG === 'en'
          ? `⚠️ <strong>Asset Shortfall:</strong> Current retirement net worth (${formatMoney(totalRetirementAssets)} THB) is less than the required ${bucket1Years + bucket2Years}-year defensive cushion (${formatMoney(calc.defensiveNeeds)} THB). Recommended to boost savings or extend working years.`
          : `⚠️ <strong>สินทรัพย์ไม่เพียงพอ:</strong> ทรัพย์สินที่มี (${formatMoney(totalRetirementAssets)} บาท) ยังน้อยกว่าเงินสำรองฉุกเฉิน ${bucket1Years + bucket2Years} ปีที่จำเป็น (${formatMoney(calc.defensiveNeeds)} บาท) แนะนำให้เพิ่มการออมหรือพิจารณาทำงานต่อเพื่อสะสมเงิน`;
    } else {
      adviceEl.innerHTML =
        LANG === 'en'
          ? `💡 <strong>Resilience Strategy:</strong> Social Security and elderly allowances cover ${formatMoney(ssoAnnual)} THB/year (${calc.guaranteedIncomeCoveragePct}%), leaving net drawdown of ${formatMoney(netDraw)} THB/year. Your ${calc.bearMarketRunwayYears}-year defensive buffer shields you from needing to liquidate stocks during market downturns.`
          : `💡 <strong>กลยุทธ์ความยืดหยุ่น:</strong> บำนาญประกันสังคมและเบี้ยผู้สูงอายุช่วยลดภาระได้ปีละ ${formatMoney(ssoAnnual)} บาท (${calc.guaranteedIncomeCoveragePct}%) เหลือถอนเงินจากพอร์ตเพียงปีละ ${formatMoney(netDraw)} บาท ด้วยเกราะกำบัง ${calc.bearMarketRunwayYears} ปี ทำให้ไม่ต้องขายหุ้นตัดขาดทุนยามตลาดขาลง`;
    }
  }
}

window.syncThreeBucketsFromTools = syncThreeBucketsFromTools;
window.updateThreeBucketsCalculator = updateThreeBucketsCalculator;
window.initThreeBucketsCalculator = initThreeBucketsCalculator;

// --- Inflation Deflator & Purchasing Power Engine ---
let deflatorState = {
  inflationRate: 2.5,
  horizonYears: 10,
  currentNetWorth: 0,
};

function setInflationRate(rate) {
  deflatorState.inflationRate = rate;
  const inp = document.getElementById('inpInflationRate');
  if (inp) inp.value = rate;
  const pills = [
    { id: 'btnInfPreset20', rate: 2.0 },
    { id: 'btnInfPreset25', rate: 2.5 },
    { id: 'btnInfPreset35', rate: 3.5 },
  ];
  pills.forEach((p) => {
    const btn = document.getElementById(p.id);
    if (btn) btn.classList.toggle('active', Math.abs(p.rate - rate) < 0.05);
  });
  updateInflationDeflator();
}

function setInflationHorizon(years) {
  deflatorState.horizonYears = years;
  const inp = document.getElementById('inpInflationHorizon');
  if (inp) inp.value = years;
  const pills = [
    { id: 'btnHorPreset5', years: 5 },
    { id: 'btnHorPreset10', years: 10 },
    { id: 'btnHorPreset20', years: 20 },
    { id: 'btnHorPreset30', years: 30 },
  ];
  pills.forEach((p) => {
    const btn = document.getElementById(p.id);
    if (btn) btn.classList.toggle('active', p.years === years);
  });
  updateInflationDeflator();
}

function updateInflationDeflator() {
  const inpRate = document.getElementById('inpInflationRate');
  const inpHori = document.getElementById('inpInflationHorizon');
  if (inpRate) deflatorState.inflationRate = parseFloat(inpRate.value) || 2.5;
  if (inpHori) deflatorState.horizonYears = parseInt(inpHori.value, 10) || 10;

  const rateDisplay = document.getElementById('valInflationRateDisplay');
  const horiDisplay = document.getElementById('valInflationHorizonDisplay');
  if (rateDisplay) rateDisplay.textContent = `${deflatorState.inflationRate.toFixed(1)}%`;
  if (horiDisplay) horiDisplay.textContent = `${deflatorState.horizonYears} ${LANG === 'en' ? 'yrs' : 'ปี'}`;

  renderInflationDeflator(deflatorState.currentNetWorth);
}

function calculateInflationMetrics({ nominalAmount = 0, inflationRatePct = 2.5, years = 10 } = {}) {
  const nominal = Math.max(0, Number(nominalAmount) || 0);
  const rate = Math.max(0, Number(inflationRatePct) || 0) / 100;
  const t = Math.max(0, Number(years) || 0);

  const growthFactor = (1 + rate) ** t;
  const deflatorMultiplier = growthFactor > 0 ? 1 / growthFactor : 1;
  const realValue = Math.round(nominal * deflatorMultiplier * 100) / 100;
  const purchasingPowerErosionPct = Math.round((1 - deflatorMultiplier) * 10000) / 100;
  const requiredNominalForTargetReal = Math.round(nominal * growthFactor * 100) / 100;

  return {
    nominalAmount: nominal,
    inflationRatePct: rate * 100,
    years: t,
    deflatorMultiplier: Math.round(deflatorMultiplier * 10000) / 10000,
    realValue,
    purchasingPowerErosionPct,
    requiredNominalForTargetReal,
  };
}

function renderInflationDeflator(netWorth) {
  deflatorState.currentNetWorth = Math.max(0, netWorth || 0);
  const metrics = calculateInflationMetrics({
    nominalAmount: deflatorState.currentNetWorth,
    inflationRatePct: deflatorState.inflationRate,
    years: deflatorState.horizonYears,
  });

  const isEn = LANG === 'en';
  const curUnit = isEn ? 'THB' : 'บาท';

  const badgeLoss = document.getElementById('badge-deflator-loss');
  if (badgeLoss) {
    badgeLoss.textContent = isEn
      ? `Purchasing Power: -${metrics.purchasingPowerErosionPct.toFixed(1)}%`
      : `อำนาจซื้อลดลง -${metrics.purchasingPowerErosionPct.toFixed(1)}%`;
    badgeLoss.style.background =
      metrics.purchasingPowerErosionPct > 35 ? 'var(--danger-dim, #fee2e2)' : 'var(--warn-dim, #fef3c7)';
    badgeLoss.style.color = metrics.purchasingPowerErosionPct > 35 ? 'var(--danger, #dc2626)' : 'var(--warn, #d97706)';
    badgeLoss.style.borderColor =
      metrics.purchasingPowerErosionPct > 35 ? 'var(--danger, #dc2626)' : 'var(--warn, #d97706)';
  }

  const txtNominal = document.getElementById('txtDeflatorNominalNW');
  const txtReal = document.getElementById('txtDeflatorRealPower');
  const txtReq = document.getElementById('txtDeflatorRequiredNominal');

  if (txtNominal) txtNominal.textContent = `${formatMoney(metrics.nominalAmount)} ${curUnit}`;
  if (txtReal) txtReal.textContent = `${formatMoney(metrics.realValue)} ${curUnit}`;
  if (txtReq) txtReq.textContent = `${formatMoney(metrics.requiredNominalForTargetReal)} ${curUnit}`;

  // Render Discount Schedule
  const schedContainer = document.getElementById('deflatorScheduleContainer');
  if (schedContainer) {
    const horizons = [1, 5, 10, 15, 20, 25, 30];
    schedContainer.innerHTML = horizons
      .map((h) => {
        const item = calculateInflationMetrics({
          nominalAmount: deflatorState.currentNetWorth,
          inflationRatePct: deflatorState.inflationRate,
          years: h,
        });
        const isSelected = h === deflatorState.horizonYears;
        return `
                    <div style="background:${isSelected ? 'rgba(37,99,235,0.08)' : 'var(--panel)'}; border:1px solid ${isSelected ? 'var(--blue, #2563eb)' : 'var(--line)'}; border-radius:8px; padding:8px 6px; text-align:center; transition:all 0.2s ease;">
                        <div style="font-weight:700; font-size:11px; color:${isSelected ? 'var(--blue, #2563eb)' : 'var(--ink)'};">${h} ${isEn ? 'Yrs' : 'ปี'}</div>
                        <div style="font-size:10px; font-weight:800; color:var(--warn, #d97706); margin-top:2px;">${formatMoney(item.realValue)}</div>
                        <div style="font-size:9.5px; color:var(--ink-faint); margin-top:1px;">-${item.purchasingPowerErosionPct.toFixed(0)}% ${isEn ? 'loss' : 'อำนาจซื้อ'}</div>
                    </div>
                `;
      })
      .join('');
  }
}

// --- Financial Goals & Milestones ---
const GOALS_KEY = 'moneySuperapp.financialGoals.v1';
const DEFAULT_GOALS = {
  emergencyMonths: 6,
  netWorthTarget: 1000000,
  expectedReturnRate: 0.06,
  fireSwrRate: 0.04,
  customAnnualExpenses: 0,
};

function getFinancialGoals() {
  const saved = safeJsonParse(GOALS_KEY, DEFAULT_GOALS);
  return {
    emergencyMonths: typeof saved.emergencyMonths === 'number' ? saved.emergencyMonths : DEFAULT_GOALS.emergencyMonths,
    netWorthTarget: typeof saved.netWorthTarget === 'number' ? saved.netWorthTarget : DEFAULT_GOALS.netWorthTarget,
    expectedReturnRate:
      typeof saved.expectedReturnRate === 'number' ? saved.expectedReturnRate : DEFAULT_GOALS.expectedReturnRate,
    fireSwrRate:
      typeof saved.fireSwrRate === 'number' && saved.fireSwrRate > 0 ? saved.fireSwrRate : DEFAULT_GOALS.fireSwrRate,
    customAnnualExpenses:
      typeof saved.customAnnualExpenses === 'number' ? saved.customAnnualExpenses : DEFAULT_GOALS.customAnnualExpenses,
  };
}

function saveFinancialGoals(goals) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch (_e) {}
}

/**
 * Financial Independence & Early Retirement (FIRE) Engine
 */
function calculateFIREMetrics({
  netWorth = 0,
  annualExpenses = 0,
  swrRate = 0.04,
  monthlyContribution = 0,
  expectedReturnRate = 0.06,
} = {}) {
  const nw = Math.max(0, Number(netWorth) || 0);
  const exp = Math.max(0, Number(annualExpenses) || 0);
  const swr = swrRate > 0 ? swrRate : 0.04;
  const pmt = Math.max(0, Number(monthlyContribution) || 0);
  const rAnnual = Math.max(0, Number(expectedReturnRate) || 0.06);

  const fireNumber = exp > 0 ? Math.round(exp / swr) : 0;
  const leanFireNumber = Math.round(fireNumber * 0.75);
  const fatFireNumber = Math.round(fireNumber * 1.25);

  const firePct = fireNumber > 0 ? Math.min(100, Math.round((nw / fireNumber) * 100)) : nw > 0 ? 100 : 0;
  const rawPct = fireNumber > 0 ? parseFloat(((nw / fireNumber) * 100).toFixed(1)) : nw > 0 ? 100 : 0;

  const currentSafePassiveIncome = Math.round(nw * swr);
  const expenseCoveragePct =
    exp > 0 ? Math.min(100, Math.round((currentSafePassiveIncome / exp) * 100)) : nw > 0 ? 100 : 0;

  let tier = 'accumulating';
  if (fireNumber > 0) {
    if (nw >= fatFireNumber) tier = 'fat_fire';
    else if (nw >= fireNumber) tier = 'standard_fire';
    else if (nw >= leanFireNumber) tier = 'lean_fire';
    else if (nw >= fireNumber * 0.5) tier = 'halfway_fire';
  } else if (nw > 0) {
    tier = 'standard_fire';
  }

  let monthsToFire = 0;
  if (nw < fireNumber) {
    monthsToFire = calculateGoalHorizonMonths(nw, fireNumber, pmt, rAnnual);
  }

  return {
    netWorth: nw,
    annualExpenses: exp,
    swrRate: swr,
    fireNumber,
    leanFireNumber,
    fatFireNumber,
    firePct,
    rawPct,
    currentSafePassiveIncome,
    expenseCoveragePct,
    tier,
    monthsToFire: Number.isFinite(monthsToFire) ? monthsToFire : Infinity,
  };
}

function calculateGoalHorizonMonths(currentVal, targetVal, monthlyPmt, annualRate) {
  const cur = typeof currentVal === 'number' ? currentVal : 0;
  const tgt = typeof targetVal === 'number' ? targetVal : 0;
  const pmt = typeof monthlyPmt === 'number' ? monthlyPmt : 0;
  const rate = typeof annualRate === 'number' ? annualRate : 0;

  if (cur >= tgt) return 0;

  const r = rate / 12;

  if (Math.abs(r) < 1e-9) {
    if (pmt <= 0) return Infinity;
    const months = Math.ceil((tgt - cur) / pmt);
    return months > 600 ? Infinity : Math.max(0, months);
  }

  const num = tgt * r + pmt;
  const den = cur * r + pmt;

  if (den <= 0 || num <= 0) return Infinity;

  const ratio = num / den;
  if (ratio <= 1) return 0;

  const months = Math.ceil(Math.log(ratio) / Math.log(1 + r));
  return months > 600 ? Infinity : Math.max(0, months);
}

function getProjectedDateString(months, refDate = new Date(), lang = 'th') {
  const isEn = lang === 'en';
  if (!Number.isFinite(months) || months > 600) {
    return isEn ? '> 50 years' : '> 50 ปี';
  }
  if (months <= 0) {
    return isEn ? 'Achieved' : 'บรรลุแล้ว';
  }

  const d = refDate instanceof Date && !Number.isNaN(refDate.getTime()) ? new Date(refDate) : new Date(refDate);
  const targetMonth = d.getMonth() + months;
  const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
  const finalMonth = ((targetMonth % 12) + 12) % 12;

  const mEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

  const mName = isEn ? mEn[finalMonth] : mTh[finalMonth];
  const yName = isEn ? targetYear : targetYear + 543;
  const monthUnit = isEn ? 'mos' : 'เดือน';

  return `${mName} ${yName} (~${months} ${monthUnit})`;
}

function computeGoalProgress(curNW, targetNW, curRunway, targetRunway, totalDebt, monthlyExpense, emergencyReserve) {
  const safeTargetNW = Math.max(1, targetNW || 1000000);
  const safeTargetRunway = Math.max(0.1, targetRunway || 6);

  // Net worth progress (clamped between 0% and 100%)
  const nwPct = Math.max(0, Math.min(100, Math.round(((curNW || 0) / safeTargetNW) * 100)));
  const nwAchieved = (curNW || 0) >= safeTargetNW && (curNW || 0) > 0;

  // Emergency runway progress (clamped between 0% and 100%)
  const runwayPct = Math.max(0, Math.min(100, Math.round(((curRunway || 0) / safeTargetRunway) * 100)));
  const runwayAchieved = (curRunway || 0) >= safeTargetRunway && (curRunway || 0) > 0;
  const targetBufferAmt = safeTargetRunway * (monthlyExpense || 0);

  // Debt freedom status
  const isDebtFree = (totalDebt || 0) <= 0;

  return {
    nwPct,
    nwAchieved,
    runwayPct,
    runwayAchieved,
    targetBufferAmt,
    isDebtFree,
  };
}

function renderFinancialGoals() {
  const p = gatherFinancialProfile();
  const g = getFinancialGoals();
  const isEn = LANG === 'en';
  const progress = computeGoalProgress(
    p.netWorth,
    g.netWorthTarget,
    p.runwayMonths,
    g.emergencyMonths,
    p.totalDebt,
    p.monthlyExpense,
    p.emergencyReserve,
  );

  const monthlySav = Math.max(0, p.monthlySavings);
  const totalMonthlyContrib = Math.max(0, p.monthlySavings + p.monthlyInvest);
  const returnRate = typeof g.expectedReturnRate === 'number' ? g.expectedReturnRate : 0.06;

  // 1. Emergency runway goal
  const emergBar = document.getElementById('goal-emergency-bar');
  const emergBadge = document.getElementById('goal-emergency-badge');
  const emergCurTxt = document.getElementById('goal-emergency-cur-txt');
  const emergTargetTxt = document.getElementById('goal-emergency-target-txt');
  const emergHorizonEl = document.getElementById('goal-emergency-horizon');

  if (emergBar) {
    emergBar.style.width = `${progress.runwayPct}%`;
    emergBar.style.background = progress.runwayAchieved ? 'var(--ok)' : 'var(--purple)';
  }
  if (emergBadge) {
    if (progress.runwayAchieved) {
      emergBadge.textContent = isEn ? '🎉 Goal Achieved!' : '🎉 บรรลุเป้าหมาย!';
      emergBadge.style.color = 'var(--ok)';
      emergBadge.style.borderColor = 'var(--ok)';
    } else {
      emergBadge.textContent = `${p.runwayMonths.toFixed(1)} / ${g.emergencyMonths} ${isEn ? 'mos' : 'เดือน'} (${progress.runwayPct}%)`;
      emergBadge.style.color = 'var(--ink)';
      emergBadge.style.borderColor = 'var(--line)';
    }
  }
  if (emergCurTxt)
    emergCurTxt.textContent = `${isEn ? 'Current: ' : 'ปัจจุบัน: '}${formatMoney(p.emergencyReserve)} ${unit}`;
  if (emergTargetTxt) {
    emergTargetTxt.textContent = `${isEn ? 'Target (' : 'เป้าหมาย ('}${g.emergencyMonths}${isEn ? ' mos): ' : ' เดือน): '}${formatMoney(progress.targetBufferAmt)} ${unit}`;
  }
  if (emergHorizonEl) {
    if (progress.runwayAchieved) {
      emergHorizonEl.textContent = isEn ? '🎉 Target Reached' : '🎉 ถึงเป้าหมายแล้ว';
      emergHorizonEl.style.color = 'var(--ok)';
    } else {
      const emergPmt = monthlySav > 0 ? monthlySav : totalMonthlyContrib;
      const emergMonths = calculateGoalHorizonMonths(p.emergencyReserve, progress.targetBufferAmt, emergPmt, 0);
      if (Number.isFinite(emergMonths)) {
        emergHorizonEl.textContent = `🎯 ${isEn ? 'ETA: ' : 'ประมาณการ: '}${getProjectedDateString(emergMonths, new Date(), LANG)}`;
        emergHorizonEl.style.color = 'var(--purple)';
      } else {
        emergHorizonEl.textContent = isEn ? '⚠️ Need Monthly Savings' : '⚠️ ต้องเพิ่มเงินออมต่อเดือน';
        emergHorizonEl.style.color = 'var(--warn)';
      }
    }
  }

  // 2. Net worth milestone
  const nwBar = document.getElementById('goal-networth-bar');
  const nwBadge = document.getElementById('goal-networth-badge');
  const nwCurTxt = document.getElementById('goal-networth-cur-txt');
  const nwTargetTxt = document.getElementById('goal-networth-target-txt');
  const nwHorizonEl = document.getElementById('goal-networth-horizon');

  if (nwBar) {
    nwBar.style.width = `${progress.nwPct}%`;
    nwBar.style.background = progress.nwAchieved ? 'var(--ok)' : 'var(--blue)';
  }
  if (nwBadge) {
    if (progress.nwAchieved) {
      nwBadge.textContent = isEn ? '🏆 Milestone Reached!' : '🏆 บรรลุเป้าหมาย!';
      nwBadge.style.color = 'var(--ok)';
      nwBadge.style.borderColor = 'var(--ok)';
    } else {
      nwBadge.textContent = `${progress.nwPct}%`;
      nwBadge.style.color = 'var(--blue)';
      nwBadge.style.borderColor = 'var(--line)';
    }
  }
  if (nwCurTxt) nwCurTxt.textContent = `${isEn ? 'Current: ' : 'ปัจจุบัน: '}${formatMoney(p.netWorth)} ${unit}`;
  if (nwTargetTxt)
    nwTargetTxt.textContent = `${isEn ? 'Target: ' : 'เป้าหมาย: '}${formatMoney(g.netWorthTarget)} ${unit}`;
  if (nwHorizonEl) {
    if (progress.nwAchieved) {
      nwHorizonEl.textContent = isEn ? '🏆 Milestone Reached' : '🏆 บรรลุเป้าหมายแล้ว';
      nwHorizonEl.style.color = 'var(--ok)';
    } else {
      const nwMonths = calculateGoalHorizonMonths(p.netWorth, g.netWorthTarget, totalMonthlyContrib, returnRate);
      if (Number.isFinite(nwMonths)) {
        nwHorizonEl.textContent = `🎯 ${isEn ? 'ETA: ' : 'ประมาณการ: '}${getProjectedDateString(nwMonths, new Date(), LANG)}`;
        nwHorizonEl.style.color = 'var(--blue)';
      } else {
        nwHorizonEl.textContent = isEn ? '⚠️ Need Growth/Contributions' : '⚠️ ต้องเพิ่มเงินลงทุน/ออม';
        nwHorizonEl.style.color = 'var(--warn)';
      }
    }
  }

  // 3. Debt-free goal
  const debtBar = document.getElementById('goal-debt-bar');
  const debtBadge = document.getElementById('goal-debt-badge');
  const debtCurTxt = document.getElementById('goal-debt-cur-txt');
  const debtTargetTxt = document.getElementById('goal-debt-target-txt');

  if (progress.isDebtFree) {
    if (debtBar) {
      debtBar.style.width = '100%';
      debtBar.style.background = 'var(--ok)';
    }
    if (debtBadge) {
      debtBadge.textContent = isEn ? '🎉 100% Debt Free!' : '🎉 ปลอดหนี้สิน 100%!';
      debtBadge.style.color = 'var(--ok)';
      debtBadge.style.borderColor = 'var(--ok)';
    }
    if (debtCurTxt) debtCurTxt.textContent = isEn ? 'No Outstanding Debt' : 'ไม่มีภาระหนี้คงค้าง';
    if (debtTargetTxt) debtTargetTxt.textContent = `0 ${unit}`;
  } else {
    if (debtBar) {
      debtBar.style.width = '50%';
      debtBar.style.background = 'var(--warn)';
    }
    if (debtBadge) {
      debtBadge.textContent = p.debtFreeText || (isEn ? 'In Progress' : 'กำลังดำเนินการ');
      debtBadge.style.color = 'var(--warn)';
      debtBadge.style.borderColor = 'var(--warn)';
    }
    if (debtCurTxt)
      debtCurTxt.textContent = `${isEn ? 'Remaining: ' : 'หนี้คงเหลือ: '}${formatMoney(p.totalDebt)} ${unit}`;
    if (debtTargetTxt) debtTargetTxt.textContent = `${isEn ? 'Goal: ' : 'เป้าหมาย: '}0 ${unit}`;
  }

  // 4. FIRE (Financial Independence, Retire Early) Milestone
  const fireSwr = typeof g.fireSwrRate === 'number' && g.fireSwrRate > 0 ? g.fireSwrRate : 0.04;
  const annualExp = g.customAnnualExpenses > 0 ? g.customAnnualExpenses : p.monthlyExpense * 12;
  const fireMetrics = calculateFIREMetrics({
    netWorth: p.netWorth,
    annualExpenses: annualExp,
    swrRate: fireSwr,
    monthlyContribution: totalMonthlyContrib,
    expectedReturnRate: returnRate,
  });

  const fireBar = document.getElementById('goal-fire-bar');
  const fireBadge = document.getElementById('goal-fire-badge');
  const fireCurTxt = document.getElementById('goal-fire-cur-txt');
  const fireTargetTxt = document.getElementById('goal-fire-target-txt');
  const fireHorizonEl = document.getElementById('goal-fire-horizon');
  const fireSwrTag = document.getElementById('lbl-fire-swr-tag');
  const firePassiveVal = document.getElementById('val-fire-passive-income');

  if (fireSwrTag) {
    fireSwrTag.textContent = `(SWR ${(fireSwr * 100).toFixed(1)}%)`;
  }

  if (fireBar) {
    fireBar.style.width = `${fireMetrics.firePct}%`;
    if (fireMetrics.tier === 'fat_fire' || fireMetrics.tier === 'standard_fire') {
      fireBar.style.background = 'var(--ok)';
    } else if (fireMetrics.tier === 'lean_fire') {
      fireBar.style.background = 'var(--purple)';
    } else {
      fireBar.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
    }
  }

  if (fireBadge) {
    if (fireMetrics.tier === 'fat_fire') {
      fireBadge.textContent = isEn ? '👑 Fat FIRE Reached!' : '👑 บรรลุ Fat FIRE!';
      fireBadge.style.color = '#8b5cf6';
      fireBadge.style.borderColor = '#8b5cf6';
    } else if (fireMetrics.tier === 'standard_fire') {
      fireBadge.textContent = isEn ? '🎉 100% FIRE Achieved!' : '🎉 อิสรภาพทางการเงิน 100%!';
      fireBadge.style.color = 'var(--ok)';
      fireBadge.style.borderColor = 'var(--ok)';
    } else if (fireMetrics.tier === 'lean_fire') {
      fireBadge.textContent = isEn
        ? `🌱 Lean FIRE (${fireMetrics.firePct}%)`
        : `🌱 Lean FIRE (${fireMetrics.firePct}%)`;
      fireBadge.style.color = '#059669';
      fireBadge.style.borderColor = 'var(--line)';
    } else {
      fireBadge.textContent = `${fireMetrics.firePct}%`;
      fireBadge.style.color = 'var(--ink)';
      fireBadge.style.borderColor = 'var(--line)';
    }
  }

  if (fireCurTxt) {
    fireCurTxt.textContent = `${isEn ? 'Current: ' : 'ปัจจุบัน: '}${formatMoney(p.netWorth)} ${unit}`;
  }
  if (fireTargetTxt) {
    const mult = Math.round(1 / fireSwr);
    fireTargetTxt.textContent = `${isEn ? 'Target (' : 'เป้าหมาย ('}${mult}x): ${formatMoney(fireMetrics.fireNumber)} ${unit}`;
  }

  if (fireHorizonEl) {
    if (p.netWorth >= fireMetrics.fireNumber && fireMetrics.fireNumber > 0) {
      fireHorizonEl.textContent = isEn ? '🎉 Financial Freedom Reached' : '🎉 บรรลุอิสรภาพทางการเงินแล้ว';
      fireHorizonEl.style.color = 'var(--ok)';
    } else {
      if (Number.isFinite(fireMetrics.monthsToFire) && fireMetrics.monthsToFire > 0) {
        fireHorizonEl.textContent = `🎯 ${isEn ? 'ETA: ' : 'ประมาณการ: '}${getProjectedDateString(fireMetrics.monthsToFire, new Date(), LANG)}`;
        fireHorizonEl.style.color = '#059669';
      } else {
        fireHorizonEl.textContent = isEn ? '⚠️ Need Growth/Contributions' : '⚠️ ต้องเพิ่มเงินลงทุน/ออม';
        fireHorizonEl.style.color = 'var(--warn)';
      }
    }
  }

  if (firePassiveVal) {
    firePassiveVal.textContent = `${formatMoney(fireMetrics.currentSafePassiveIncome)} ${unit}/${isEn ? 'yr' : 'ปี'} (${isEn ? 'covers ' : 'ครอบคลุม '}${fireMetrics.expenseCoveragePct}%)`;
  }

  // Update active SWR pill
  document.querySelectorAll('.swr-pill').forEach((pill) => {
    const rate = parseFloat(pill.dataset.swr);
    const isActive = Math.abs(rate - fireSwr) < 0.001;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // Update scenario pills
  document.querySelectorAll('.scenario-pill').forEach((pill) => {
    const rate = parseFloat(pill.dataset.rate);
    const isActive = Math.abs(rate - returnRate) < 0.001;
    pill.classList.toggle('active', isActive);
    pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });

  // 5. Monte Carlo Retirement Longevity Simulation
  const currentNetWorth = Math.max(0, p.netWorth);
  const withdrawalAmt = Math.max(0, annualExp);
  const mcRes = simulateMonteCarloRetirement({
    initialPortfolio: currentNetWorth > 0 ? currentNetWorth : fireMetrics.fireNumber,
    annualWithdrawal: withdrawalAmt,
    years: 30,
    meanReturn: returnRate,
    volatility: 0.1,
    inflation: 0.025,
    trials: 500,
    seed: 42,
  });

  const mcBadge = document.getElementById('badge-mc-survival');
  if (mcBadge) {
    mcBadge.textContent = `${isEn ? 'Survival: ' : 'โอกาสรอด: '}${mcRes.survivalProbability}%`;
    if (mcRes.survivalProbability >= 85) {
      mcBadge.style.color = 'var(--ok, #059669)';
      mcBadge.style.background = 'var(--ok-dim, #d1fae5)';
      mcBadge.style.borderColor = 'var(--ok, #059669)';
    } else if (mcRes.survivalProbability >= 65) {
      mcBadge.style.color = 'var(--warn, #d97706)';
      mcBadge.style.background = 'var(--warn-dim, #fef3c7)';
      mcBadge.style.borderColor = 'var(--warn, #d97706)';
    } else {
      mcBadge.style.color = 'var(--danger, #dc2626)';
      mcBadge.style.background = 'rgba(239, 68, 68, 0.12)';
      mcBadge.style.borderColor = 'var(--danger, #dc2626)';
    }
  }

  const p10El = document.getElementById('val-mc-p10');
  const p50El = document.getElementById('val-mc-p50');
  const p90El = document.getElementById('val-mc-p90');
  if (p10El) p10El.textContent = `${formatMoney(mcRes.finalP10)} ${unit}`;
  if (p50El) p50El.textContent = `${formatMoney(mcRes.finalP50)} ${unit}`;
  if (p90El) p90El.textContent = `${formatMoney(mcRes.finalP90)} ${unit}`;

  renderMonteCarloFanChart(mcRes.trajectoryPercentiles);
}

function simulateMonteCarloRetirement({
  initialPortfolio = 10000000,
  annualWithdrawal = 400000,
  years = 30,
  meanReturn = 0.07,
  volatility = 0.1,
  inflation = 0.025,
  trials = 500,
  seed = 42,
} = {}) {
  let s = seed || 12345;
  function rand() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  }

  function randomNormal() {
    let u1 = rand();
    const u2 = rand();
    while (u1 <= 1e-15) u1 = rand();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  }

  const safeYears = Math.max(1, Math.min(50, years || 30));
  const safeInitPort = Math.max(0, initialPortfolio || 0);
  const safeInitWithdrawal = Math.max(0, annualWithdrawal || 0);
  const safeTrials = Math.max(10, Math.min(2000, trials || 500));

  let successfulTrials = 0;
  const yearlyPortfolios = Array.from({ length: safeYears + 1 }, () => []);

  for (let t = 0; t < safeTrials; t++) {
    let portfolio = safeInitPort;
    let withdrawal = safeInitWithdrawal;
    let ruined = false;

    yearlyPortfolios[0].push(portfolio);

    for (let yr = 1; yr <= safeYears; yr++) {
      if (!ruined) {
        portfolio -= withdrawal;
        if (portfolio <= 0) {
          portfolio = 0;
          ruined = true;
        } else {
          const z = randomNormal();
          const annualRate = meanReturn + volatility * z;
          portfolio = Math.max(0, portfolio * (1 + annualRate));
        }
        withdrawal *= 1 + inflation;
      }
      yearlyPortfolios[yr].push(portfolio);
    }

    if (!ruined && portfolio > 0) {
      successfulTrials++;
    }
  }

  const survivalProbability = Math.round((successfulTrials / safeTrials) * 1000) / 10;

  const trajectoryPercentiles = [];
  for (let yr = 0; yr <= safeYears; yr++) {
    const sorted = [...yearlyPortfolios[yr]].sort((a, b) => a - b);
    const idx10 = Math.floor(safeTrials * 0.1);
    const idx50 = Math.floor(safeTrials * 0.5);
    const idx90 = Math.floor(safeTrials * 0.9);
    trajectoryPercentiles.push({
      year: yr,
      p10: Math.round(sorted[idx10]),
      p50: Math.round(sorted[idx50]),
      p90: Math.round(sorted[idx90]),
    });
  }

  let tier = 'safe';
  if (survivalProbability < 50) tier = 'critical';
  else if (survivalProbability < 75) tier = 'fragile';
  else if (survivalProbability < 90) tier = 'moderate';

  return {
    survivalProbability,
    tier,
    finalP10: trajectoryPercentiles[safeYears].p10,
    finalP50: trajectoryPercentiles[safeYears].p50,
    finalP90: trajectoryPercentiles[safeYears].p90,
    trajectoryPercentiles,
  };
}

function renderMonteCarloFanChart(trajectoryPercentiles) {
  const svg = document.getElementById('mc-fan-chart');
  if (!svg || !trajectoryPercentiles || trajectoryPercentiles.length === 0) return;

  const width = 400;
  const height = 130;
  const padL = 35;
  const padR = 15;
  const padT = 15;
  const padB = 25;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const n = trajectoryPercentiles.length - 1;
  let maxVal = 1000;
  for (let i = 0; i <= n; i++) {
    const pt = trajectoryPercentiles[i];
    if (pt.p90 > maxVal) maxVal = pt.p90;
  }

  function getX(yr) {
    return padL + (yr / n) * chartW;
  }
  function getY(val) {
    const clamped = Math.max(0, Math.min(maxVal, val));
    return padT + chartH - (clamped / maxVal) * chartH;
  }

  const upperPoints = [];
  const lowerPoints = [];
  const medianPoints = [];

  for (let yr = 0; yr <= n; yr++) {
    const pt = trajectoryPercentiles[yr];
    const x = getX(yr);
    upperPoints.push(`${x},${getY(pt.p90)}`);
    lowerPoints.unshift(`${x},${getY(pt.p10)}`);
    medianPoints.push(`${x},${getY(pt.p50)}`);
  }

  const fanAreaPath = `${upperPoints.join(' ')} ${lowerPoints.join(' ')}`;
  const medianPath = medianPoints.join(' ');
  const zeroY = getY(0);

  const maxValLabel = maxVal >= 1000000 ? `${(maxVal / 1000000).toFixed(1)}M` : `${Math.round(maxVal / 1000)}k`;

  svg.innerHTML = `
    <!-- Zero Line -->
    <line x1="${padL}" y1="${zeroY}" x2="${padL + chartW}" y2="${zeroY}" stroke="var(--danger, #ef4444)" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.6" />
    <text x="${padL - 4}" y="${zeroY + 3}" font-size="9" fill="var(--danger, #ef4444)" text-anchor="end" font-weight="600">0</text>
    
    <!-- Max label -->
    <text x="${padL - 4}" y="${padT + 8}" font-size="9" fill="var(--ink-faint)" text-anchor="end">${maxValLabel}</text>

    <!-- Year 0 and Year N labels -->
    <text x="${padL}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="start">Yr 0</text>
    <text x="${padL + chartW / 2}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="middle">Yr ${Math.round(n / 2)}</text>
    <text x="${padL + chartW}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="end">Yr ${n}</text>

    <!-- 10th-90th Percentile Confidence Fan Area -->
    <polygon points="${fanAreaPath}" fill="rgba(59, 130, 246, 0.18)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="0.8" />

    <!-- 50th Percentile Median Path -->
    <polyline points="${medianPath}" fill="none" stroke="var(--accent, #3b82f6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  `;
}

function toggleMonteCarloDetails() {
  const panel = document.getElementById('mc-details-panel');
  if (!panel) return;
  const isHidden = panel.style.display === 'none';
  panel.style.display = isHidden ? 'block' : 'none';
  const btn = document.getElementById('btn-toggle-mc');
  if (btn) {
    btn.textContent = isHidden
      ? LANG === 'en'
        ? '▲ Hide Analysis'
        : '▲ ซ่อนผลวิเคราะห์'
      : LANG === 'en'
        ? '📊 View 1,000 Trials Analysis'
        : '📊 ดูผลวิเคราะห์ 1,000 การทดลอง';
  }
}

function openGoalsModal() {
  const goals = getFinancialGoals();
  const inpEmerg = document.getElementById('inpGoalEmergencyMonths');
  const inpNW = document.getElementById('inpGoalNetWorth');
  const inpRate = document.getElementById('inpGoalReturnRate');
  const inpExp = document.getElementById('inpGoalAnnualExpenses');
  if (inpEmerg) inpEmerg.value = goals.emergencyMonths;
  if (inpNW) inpNW.value = goals.netWorthTarget;
  if (inpRate) inpRate.value = ((goals.expectedReturnRate ?? 0.06) * 100).toFixed(1);
  if (inpExp) inpExp.value = goals.customAnnualExpenses ?? 0;
  const modal = document.getElementById('goalsModal');
  if (modal) modal.style.display = 'flex';
}

function closeGoalsModal() {
  const modal = document.getElementById('goalsModal');
  if (modal) modal.style.display = 'none';
}

function setGoalEmergencyPreset(val) {
  const inp = document.getElementById('inpGoalEmergencyMonths');
  if (inp) inp.value = val;
}

function setGoalNetWorthPreset(val) {
  const inp = document.getElementById('inpGoalNetWorth');
  if (inp) inp.value = val;
}

function setGoalReturnRatePreset(val) {
  const inp = document.getElementById('inpGoalReturnRate');
  if (inp) inp.value = val;
}

function setGoalAnnualExpensesPreset(val) {
  const inp = document.getElementById('inpGoalAnnualExpenses');
  if (inp) inp.value = val;
}

function setGoalScenarioRate(rate) {
  const goals = getFinancialGoals();
  goals.expectedReturnRate = rate;
  saveFinancialGoals(goals);
  renderFinancialGoals();
}

function setFireSwrRate(rate) {
  const goals = getFinancialGoals();
  goals.fireSwrRate = rate;
  saveFinancialGoals(goals);
  renderFinancialGoals();
}

function resetGoalsToDefault() {
  const inpEmerg = document.getElementById('inpGoalEmergencyMonths');
  const inpNW = document.getElementById('inpGoalNetWorth');
  const inpRate = document.getElementById('inpGoalReturnRate');
  const inpExp = document.getElementById('inpGoalAnnualExpenses');
  if (inpEmerg) inpEmerg.value = DEFAULT_GOALS.emergencyMonths;
  if (inpNW) inpNW.value = DEFAULT_GOALS.netWorthTarget;
  if (inpRate) inpRate.value = (DEFAULT_GOALS.expectedReturnRate * 100).toFixed(1);
  if (inpExp) inpExp.value = DEFAULT_GOALS.customAnnualExpenses;
}

function saveGoalsFromModal() {
  const goals = getFinancialGoals();
  const inpEmerg = document.getElementById('inpGoalEmergencyMonths');
  const inpNW = document.getElementById('inpGoalNetWorth');
  const inpRate = document.getElementById('inpGoalReturnRate');
  const inpExp = document.getElementById('inpGoalAnnualExpenses');
  const emerg = Math.max(1, parseNum(inpEmerg ? inpEmerg.value : DEFAULT_GOALS.emergencyMonths));
  const nw = Math.max(1000, parseNum(inpNW ? inpNW.value : DEFAULT_GOALS.netWorthTarget));
  const rate =
    Math.max(0, Math.min(25, parseNum(inpRate ? inpRate.value : DEFAULT_GOALS.expectedReturnRate * 100))) / 100;
  const customExp = Math.max(0, parseNum(inpExp ? inpExp.value : 0));
  saveFinancialGoals({
    ...goals,
    emergencyMonths: emerg,
    netWorthTarget: nw,
    expectedReturnRate: rate,
    customAnnualExpenses: customExp,
  });
  closeGoalsModal();
  renderFinancialGoals();
}

function jumpToTab(tabId) {
  try {
    window.parent.postMessage({ action: 'switchToTab', target: tabId }, '*');
  } catch (_e) {}
}

// --- Historical Snapshots & SVG Charting (Task 1) ---

function getSnapshots() {
  try {
    const raw = localStorage.getItem(SNAPSHOT_KEY);
    if (raw !== null) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch (_e) {}

  // If no snapshots, seed realistic past 3 months based on current profile
  const cur = gatherFinancialProfile();
  const now = new Date();
  const seed = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 28);
    const factor = 1 - i * 0.05; // growth
    seed.push({
      id: d.getTime(),
      date: d.toISOString().slice(0, 10),
      netWorth: Math.round(cur.netWorth * factor),
      portfolioVal: Math.round(cur.portfolioVal * factor),
      emergencyReserve: Math.round(cur.emergencyReserve * factor),
      totalDebt: Math.round(cur.totalDebt * (1 + i * 0.04)),
      savingsRate: Math.max(10, Math.round(cur.savingsRate + i * 2)),
      savings: Math.round(cur.monthlySavings + cur.monthlyInvest),
      runwayMonths: parseFloat((cur.runwayMonths * factor).toFixed(1)),
    });
  }
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(seed));
  } catch (_e) {}
  return seed;
}

const ARCHIVE_KEY = 'moneySuperapp.archivedSnapshots.v1';

function saveSnapshots(snapshots) {
  try {
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshots));
  } catch (_e) {}
  if (typeof MoneyApp !== 'undefined' && MoneyApp.idbStorage) {
    MoneyApp.idbStorage.set(SNAPSHOT_KEY, snapshots).catch(() => {});
  }
}

async function updateStorageQuotaDisplay() {
  const badgeEl = document.getElementById('badgeStorageStatus');
  const txtEl = document.getElementById('txtStorageQuota');
  const btnArchive = document.getElementById('btnArchiveSnapshots');
  const btnRestore = document.getElementById('btnRestoreArchive');

  if (!badgeEl || !txtEl) return;

  let isIDB = false;
  let quotaInfo = null;

  if (typeof MoneyApp !== 'undefined' && MoneyApp.idbStorage) {
    isIDB = MoneyApp.idbStorage.isSupported;
    try {
      quotaInfo = await MoneyApp.idbStorage.estimate();
    } catch (_e) {}
  }

  if (isIDB) {
    badgeEl.textContent = '💾 IndexedDB';
    badgeEl.style.background = 'var(--ok-dim)';
    badgeEl.style.color = 'var(--ok)';
  } else {
    badgeEl.textContent = '💾 LocalStorage';
    badgeEl.style.background = 'rgba(217, 119, 6, 0.15)';
    badgeEl.style.color = 'var(--warn)';
  }

  if (quotaInfo) {
    txtEl.textContent = `${LANG === 'en' ? 'Usage' : 'ความจุ'}: ${quotaInfo.formattedUsage} / ${quotaInfo.formattedQuota}`;
  }

  const snapshots = getSnapshots();
  if (typeof MoneyApp !== 'undefined' && MoneyApp.partitionSnapshots) {
    const part = MoneyApp.partitionSnapshots(snapshots, 12);
    if (btnArchive) {
      if (part.toArchive.length > 0) {
        btnArchive.style.display = 'inline-block';
        btnArchive.title = `${LANG === 'en' ? 'Archive' : 'ย้ายไปคลัง'} ${part.toArchive.length} ${LANG === 'en' ? 'older records' : 'รายการเก่า'}`;
      } else {
        btnArchive.style.display = 'none';
      }
    }
  }

  if (btnRestore) {
    let archived = [];
    if (typeof MoneyApp !== 'undefined' && MoneyApp.idbStorage) {
      try {
        archived = await MoneyApp.idbStorage.get(ARCHIVE_KEY);
      } catch (_e) {}
    }
    if (!archived || !archived.length) {
      try {
        const raw = localStorage.getItem(ARCHIVE_KEY);
        if (raw) archived = JSON.parse(raw);
      } catch (_e) {}
    }
    if (Array.isArray(archived) && archived.length > 0) {
      btnRestore.style.display = 'inline-block';
      btnRestore.innerHTML = `📂 <span id="lblRestoreArchive">${LANG === 'en' ? 'Restore Archive' : 'กู้คืนคลัง'}</span> (${archived.length})`;
    } else {
      btnRestore.style.display = 'none';
    }
  }
}

async function archiveOldSnapshots() {
  const snapshots = getSnapshots();
  if (typeof MoneyApp === 'undefined' || !MoneyApp.partitionSnapshots) return;
  const part = MoneyApp.partitionSnapshots(snapshots, 12);
  if (part.toArchive.length === 0) {
    alert(translations[LANG].archiveEmpty);
    return;
  }

  let existingArchive = [];
  if (MoneyApp.idbStorage) {
    try {
      existingArchive = (await MoneyApp.idbStorage.get(ARCHIVE_KEY)) || [];
    } catch (_e) {}
  }
  if (!existingArchive || !existingArchive.length) {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY);
      if (raw) existingArchive = JSON.parse(raw) || [];
    } catch (_e) {}
  }

  const archiveMap = new Map();
  existingArchive.forEach((s) => {
    archiveMap.set(s.date || s.id, s);
  });
  part.toArchive.forEach((s) => {
    archiveMap.set(s.date || s.id, s);
  });
  const mergedArchive = Array.from(archiveMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  if (MoneyApp.idbStorage) {
    await MoneyApp.idbStorage.set(ARCHIVE_KEY, mergedArchive);
  }
  try {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(mergedArchive));
  } catch (_e) {}

  saveSnapshots(part.active);
  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();

  alert(translations[LANG].archiveSuccess(part.toArchive.length));
}

async function restoreArchivedSnapshots() {
  let archived = [];
  if (typeof MoneyApp !== 'undefined' && MoneyApp.idbStorage) {
    try {
      archived = await MoneyApp.idbStorage.get(ARCHIVE_KEY);
    } catch (_e) {}
  }
  if (!archived || !archived.length) {
    try {
      const raw = localStorage.getItem(ARCHIVE_KEY);
      if (raw) archived = JSON.parse(raw);
    } catch (_e) {}
  }
  if (!Array.isArray(archived) || archived.length === 0) return;

  const current = getSnapshots();
  const map = new Map();
  archived.forEach((s) => {
    map.set(s.date || s.id, s);
  });
  current.forEach((s) => {
    map.set(s.date || s.id, s);
  });
  const restored = Array.from(map.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  saveSnapshots(restored);

  if (typeof MoneyApp !== 'undefined' && MoneyApp.idbStorage) {
    await MoneyApp.idbStorage.delete(ARCHIVE_KEY);
  }
  try {
    localStorage.removeItem(ARCHIVE_KEY);
  } catch (_e) {}

  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();

  alert(translations[LANG].restoreSuccess(archived.length));
}

function takeSnapshot() {
  const cur = gatherFinancialProfile();
  const snapshots = getSnapshots();
  const todayStr = new Date().toISOString().slice(0, 10);

  // Check if snapshot exists for today; if so, update it
  const existingIdx = snapshots.findIndex((s) => s.date === todayStr);
  const newSnap = {
    id: Date.now(),
    date: todayStr,
    netWorth: cur.netWorth,
    portfolioVal: cur.portfolioVal,
    emergencyReserve: cur.emergencyReserve,
    totalDebt: cur.totalDebt,
    savingsRate: parseFloat(cur.savingsRate.toFixed(1)),
    savings: Math.round(cur.monthlySavings + cur.monthlyInvest),
    runwayMonths: parseFloat(cur.runwayMonths.toFixed(1)),
  };

  if (existingIdx >= 0) {
    snapshots[existingIdx] = newSnap;
  } else {
    snapshots.push(newSnap);
  }

  snapshots.sort((a, b) => new Date(a.date) - new Date(b.date));
  saveSnapshots(snapshots);

  renderDashboardKPIs();
  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();

  const banner = document.getElementById('snapshotAlertBanner');
  if (document.getElementById('snapshotAlertText'))
    document.getElementById('snapshotAlertText').textContent =
      LANG === 'en' ? translations.en.savedSuccess : translations.th.savedSuccess;
  if (banner) banner.style.display = 'flex';
  setTimeout(() => {
    if (banner) banner.style.display = 'none';
  }, 3500);
}

function deleteSnapshot(id) {
  let snapshots = getSnapshots();
  snapshots = snapshots.filter((s) => String(s.id) !== String(id));
  saveSnapshots(snapshots);
  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();
}

function clearAllSnapshots() {
  const msg = LANG === 'en' ? 'Clear all historical snapshot data?' : 'ต้องการล้างประวัติสแนปช็อตทั้งหมดหรือไม่?';
  if (!confirm(msg)) return;
  saveSnapshots([]);
  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();
}

function setChartMode(mode) {
  chartMode = mode;
  const modes = ['nw', 'sav', 'emg', 'debt'];
  const modeMap = {
    networth: 'nw',
    savings: 'sav',
    emergency: 'emg',
    debt: 'debt',
  };
  modes.forEach((m) => {
    const btn = document.getElementById(`btn-chart-${m}`);
    if (btn) {
      const isActive = modeMap[mode] === m;
      btn.className = `chart-mode-pill ${isActive ? `active mode-${m}` : ''}`;
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  });
  renderChart();
}

function renderSnapshotsTable() {
  const snapshots = getSnapshots();
  const tbody = document.getElementById('historyListContainer');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (document.getElementById('lbl-snapshot-count')) {
    const count = snapshots.length;
    document.getElementById('lbl-snapshot-count').textContent =
      LANG === 'en' ? `${count} ${count === 1 ? 'snapshot' : 'snapshots'}` : `${count} บันทึก`;
  }

  const t = translations[LANG] || translations.th;

  if (snapshots.length === 0) {
    tbody.innerHTML = `<div style="text-align:center; padding:16px; color:var(--ink-faint); font-size:12px;">${t.emptyHistory || (LANG === 'en' ? 'No snapshot history found' : 'ยังไม่มีประวัติที่บันทึกไว้')}</div>`;
    return;
  }

  [...snapshots].reverse().forEach((s) => {
    const tr = document.createElement('div');
    tr.className = 'history-row';
    tr.innerHTML = `
                <div class="date-badge"></div>
                <div class="h-stats">
                    <span style="color:var(--ok);">NW: ${formatMoney(s.netWorth)}</span>
                    <span style="color:var(--blue);">Port: ${formatMoney(s.portfolioVal)}</span>
                    <span style="color:var(--purple);">Res: ${formatMoney(s.emergencyReserve)}</span>
                    <span style="color:var(--warn);">Debt: ${formatMoney(s.totalDebt)}</span>
                </div>
                <div class="h-side">
                    <span style="font-size:14px; font-weight:700; color:var(--ink);">${parseFloat(s.savingsRate) || 0}%</span>
                    <span style="font-size:10px; color:var(--ink-dim); font-weight:400;">${formatMoney(s.savings || 0)}/${LANG === 'en' ? 'mo' : 'ด'}</span>
                    <button class="h-del" title="${t.deleteTitle}">&times;</button>
                </div>
            `;
    const dateBadge = tr.querySelector('.date-badge');
    if (dateBadge) dateBadge.textContent = String(s.date || '');
    const delBtn = tr.querySelector('.h-del');
    if (delBtn) {
      delBtn.addEventListener('click', () => deleteSnapshot(s.id));
    }
    tbody.appendChild(tr);
  });
}

// Expose aliases to avoid runtime reference errors
window.takeSnapshot = takeSnapshot;
window.saveSnapshot = takeSnapshot;
window.clearAllSnapshots = clearAllSnapshots;
window.clearHistory = clearAllSnapshots;

/**
 * Mathematical Coordinate & Growth Metrics Engine
 */
function calculateGrowthMetrics(snapshots, mode = 'networth') {
  if (!snapshots || snapshots.length === 0) {
    return { firstVal: 0, lastVal: 0, totalDelta: 0, totalPct: 0, momDelta: 0, momPct: 0, count: 0 };
  }

  const values = snapshots.map((s) => {
    if (mode === 'savings') return s.savingsRate || 0;
    if (mode === 'emergency') return s.emergencyReserve || 0;
    if (mode === 'debt') return s.totalDebt || 0;
    return s.netWorth || 0;
  });

  const firstVal = values[0];
  const lastVal = values[values.length - 1];
  const totalDelta = lastVal - firstVal;
  const totalPct = firstVal !== 0 ? parseFloat(((totalDelta / Math.abs(firstVal)) * 100).toFixed(1)) : 0;

  let momDelta = 0;
  let momPct = 0;
  if (values.length >= 2) {
    const prevVal = values[values.length - 2];
    momDelta = lastVal - prevVal;
    momPct = prevVal !== 0 ? parseFloat(((momDelta / Math.abs(prevVal)) * 100).toFixed(1)) : 0;
  }

  return {
    firstVal,
    lastVal,
    totalDelta,
    totalPct,
    momDelta,
    momPct,
    count: values.length,
  };
}

function buildSmoothSvgPath(points) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${Math.round(cp1x * 10) / 10} ${Math.round(cp1y * 10) / 10}, ${Math.round(cp2x * 10) / 10} ${Math.round(cp2y * 10) / 10}, ${p2.x} ${p2.y}`;
  }
  return path;
}

function updateTrajectoryUI(metrics, mode, isCurrency) {
  const banner = document.getElementById('chartTrajectoryBanner');
  const totalEl = document.getElementById('txt-trajectory-total');
  const momEl = document.getElementById('txt-trajectory-mom');
  if (!banner || !totalEl || !momEl) return;

  if (!metrics || metrics.count === 0) {
    banner.style.display = 'none';
    return;
  }

  banner.style.display = 'flex';
  const isDebt = mode === 'debt';
  const isGoodTotal = isDebt ? metrics.totalDelta <= 0 : metrics.totalDelta >= 0;
  const totalColor = isGoodTotal ? 'var(--ok)' : 'var(--danger)';
  const totalSign = metrics.totalDelta > 0 ? '+' : '';

  const totalAmtStr = isCurrency
    ? `${totalSign}${formatMoney(metrics.totalDelta)} ${unit}`
    : `${totalSign}${metrics.totalDelta.toFixed(1)}%`;
  const totalPctStr = `${metrics.totalPct > 0 ? '+' : ''}${metrics.totalPct.toFixed(1)}%`;
  totalEl.textContent = `${totalAmtStr} (${totalPctStr})`;
  totalEl.style.color = totalColor;

  const isGoodMoM = isDebt ? metrics.momDelta <= 0 : metrics.momDelta >= 0;
  const momColor = isGoodMoM ? 'var(--ok)' : 'var(--danger)';
  const momSign = metrics.momDelta > 0 ? '+' : '';
  const momAmtStr = isCurrency
    ? `${momSign}${formatMoney(metrics.momDelta)} ${unit}`
    : `${momSign}${metrics.momDelta.toFixed(1)}%`;
  momEl.textContent = `${momAmtStr} (${metrics.momPct > 0 ? '+' : ''}${metrics.momPct.toFixed(1)}%)`;
  momEl.style.color = momColor;
}

/**
 * Render SVG chart offline without any external library
 */
function renderChart() {
  const svg = document.getElementById('svgChart');
  const legend = document.getElementById('chartLegend');
  const snapshots = getSnapshots();

  if (snapshots.length === 0) {
    svg.innerHTML = `<text x="300" y="110" text-anchor="middle" fill="var(--ink-faint)" font-size="14">${LANG === 'en' ? 'No snapshot data available yet' : 'ยังไม่มีข้อมูลประวัติสแนปช็อต'}</text>`;
    if (legend) legend.innerHTML = '';
    updateTrajectoryUI(null, chartMode, true);
    return;
  }

  const width = 600;
  const height = 220;
  const padding = { top: 25, right: 30, bottom: 35, left: 65 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  let values = [];
  let strokeColor = '#2563eb';
  let gradientColor = '#2563eb';
  let valueLabel = LANG === 'en' ? 'Net Worth' : 'ความมั่งคั่งสุทธิ';
  let isCurrency = true;

  if (chartMode === 'networth') {
    values = snapshots.map((s) => s.netWorth || 0);
    strokeColor = '#2563eb';
    gradientColor = '#2563eb';
    valueLabel = LANG === 'en' ? 'Net Worth (THB)' : 'ความมั่งคั่งสุทธิ (บาท)';
    isCurrency = true;
  } else if (chartMode === 'savings') {
    values = snapshots.map((s) => s.savingsRate || 0);
    strokeColor = '#2F8B76';
    gradientColor = '#2F8B76';
    valueLabel = LANG === 'en' ? 'Savings Rate (%)' : 'อัตราการออม (%)';
    isCurrency = false;
  } else if (chartMode === 'debt') {
    values = snapshots.map((s) => s.totalDebt || 0);
    strokeColor = '#A9762F';
    gradientColor = '#A9762F';
    valueLabel = LANG === 'en' ? 'Total Debt (THB)' : 'หนี้คงค้าง (บาท)';
    isCurrency = true;
  } else {
    values = snapshots.map((s) => s.emergencyReserve || 0);
    strokeColor = '#7e22ce';
    gradientColor = '#7e22ce';
    valueLabel = LANG === 'en' ? 'Emergency Reserve (THB)' : 'เงินสำรองฉุกเฉิน (บาท)';
    isCurrency = true;
  }

  // Update trajectory banner
  const metrics = calculateGrowthMetrics(snapshots, chartMode);
  updateTrajectoryUI(metrics, chartMode, isCurrency);

  // Check if all values are zero
  const nonZero = values.some((v) => v !== 0);
  if (!nonZero && values.every((v) => v === 0)) {
    svg.innerHTML = `<text x="300" y="110" text-anchor="middle" fill="var(--ink-faint)" font-size="14">${LANG === 'en' ? 'No data to display — save a snapshot to see trends' : 'ยังไม่มีข้อมูลสำหรับแสดง — บันทึกสแนปช็อตเพื่อดูแนวโน้ม'}</text>`;
    if (legend) legend.innerHTML = '';
    return;
  }

  let minVal = Math.min(...values);
  let maxVal = Math.max(...values);
  if (minVal === maxVal) {
    minVal = Math.max(0, minVal * 0.8);
    maxVal = maxVal * 1.2 || 100;
  }
  const range = maxVal - minVal || 1;

  const points = snapshots.map((s, idx) => {
    const x = padding.left + (snapshots.length === 1 ? plotWidth / 2 : (idx / (snapshots.length - 1)) * plotWidth);
    const y = padding.top + plotHeight - ((values[idx] - minVal) / range) * plotHeight;
    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
      val: values[idx],
      date: s.date,
    };
  });

  // Grid lines & Y-axis labels
  let gridHtml = '';
  const gridSteps = 4;
  for (let i = 0; i <= gridSteps; i++) {
    const yVal = minVal + range * (i / gridSteps);
    const yPos = padding.top + plotHeight - (i / gridSteps) * plotHeight;
    const labelStr = isCurrency ? formatMoney(yVal) : yVal.toFixed(0) + '%';
    gridHtml += `
                <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="var(--line)" stroke-dasharray="3,3" />
                <text x="${padding.left - 8}" y="${yPos + 4}" text-anchor="end" fill="var(--ink-faint)" font-size="10">${labelStr}</text>
            `;
  }

  // X-axis dates
  let xHtml = '';
  points.forEach((p, i) => {
    if (points.length <= 6 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0) {
      const shortDate = p.date.slice(5);
      xHtml += `<text x="${p.x}" y="${height - 12}" text-anchor="middle" fill="var(--ink-faint)" font-size="10">${shortDate}</text>`;
    }
  });

  // Defs for smooth gradient fill
  const defsHtml = `
            <defs>
                <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${gradientColor}" stop-opacity="0.32" />
                    <stop offset="100%" stop-color="${gradientColor}" stop-opacity="0.0" />
                </linearGradient>
            </defs>
        `;

  // Smooth spline path
  const linePath = buildSmoothSvgPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`;

  // Interactive point dots
  let dotsHtml = '';
  points.forEach((p) => {
    const valStr = isCurrency ? formatMoney(p.val) + ' ' + unit : p.val + '%';
    dotsHtml += `
                <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${strokeColor}" stroke="var(--panel)" stroke-width="2.5" class="cursor-pointer chart-dot"
                    data-date="${escapeHtml(p.date)}" data-val="${escapeHtml(valStr)}" />
            `;
  });

  svg.innerHTML = `
            ${defsHtml}
            ${gridHtml}
            ${xHtml}
            <path d="${areaPath}" fill="url(#chartAreaGrad)" />
            <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            ${dotsHtml}
        `;

  // Delegated tooltip listeners
  svg.onmouseover = (e) => {
    const dot = e.target.closest('.chart-dot');
    if (dot) {
      showChartTooltip(e, dot.dataset.date, dot.dataset.val);
    }
  };
  svg.onmouseout = (e) => {
    if (e.target.closest('.chart-dot')) {
      hideChartTooltip();
    }
  };

  if (legend) {
    const latestVal = values[values.length - 1];
    const latestStr = isCurrency ? formatMoney(latestVal) + ' ' + unit : latestVal + '%';
    legend.innerHTML = `
                <div class="flex items-center gap-1.5">
                    <span class="inline-block w-3 h-3 rounded-full" style="background:${strokeColor};"></span>
                    <span class="font-medium" style="color:var(--ink)">${escapeHtml(valueLabel)}</span>
                </div>
                <span style="color:var(--ink-faint); margin-left:8px;">|</span>
                <span style="font-size:11px; color:var(--ink-dim);">${LANG === 'en' ? 'Latest: ' : 'ล่าสุด: '} <strong>${latestStr}</strong></span>
            `;
  }
}

function showChartTooltip(e, date, valStr) {
  const tip = document.getElementById('chartTooltip');
  if (!tip) return;
  const chartContainer = tip.parentElement;
  const rect = chartContainer.getBoundingClientRect();
  tip.innerHTML = `<strong>${escapeHtml(date)}</strong><br>${escapeHtml(valStr)}`;
  tip.style.opacity = '1';
  tip.style.left = `${e.clientX - rect.left + 10}px`;
  tip.style.top = `${e.clientY - rect.top - 30}px`;
}

function hideChartTooltip() {
  const tip = document.getElementById('chartTooltip');
  tip.style.opacity = '0';
}

// Initialize
renderDashboardKPIs();
renderFinancialGoals();
initInsuranceAdequacy();
initThreeBucketsCalculator();
renderSnapshotsTable();
renderChart();
updateStorageQuotaDisplay();

function refreshDashboard() {
  applyLocalization();
  renderDashboardKPIs();
  renderFinancialGoals();
  updateInsuranceAdequacy();
  updateThreeBucketsCalculator();
  renderSnapshotsTable();
  renderChart();
  updateStorageQuotaDisplay();
}

function printDashboardReport() {
  const now = new Date();
  const tsEl = document.getElementById('print-timestamp');
  if (tsEl) {
    const formatted = formatReportDate(now, LANG);
    tsEl.textContent = `${LANG === 'en' ? 'Generated: ' : 'สร้างเมื่อ: '}${formatted}`;
  }
  window.print();
}

function formatReportDate(d, lang) {
  const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const day = d.getDate();
  const m = lang === 'en' ? enMonths[d.getMonth()] : thMonths[d.getMonth()];
  const y = lang === 'en' ? d.getFullYear() : d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${m} ${y} ${hh}:${mm}`;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeGoalsModal();
  }
});
