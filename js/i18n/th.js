/**
 * Money Superapp - Centralized Thai Translation Dictionary (Roadmap Phase 101)
 * 100% offline & client-side compatible (file:// and http(s)://).
 */
((global) => {
  const th = {
    // Common App Shell & Global Controls
    appName: 'Money Superapp',
    appTagline: 'วางแผนการเงินส่วนบุคคล 100% ออฟไลน์ ปลอดภัยสูงสุด',
    privacyBadge: '🔒 100% ออฟไลน์ ปลอดภัยในอุปกรณ์ของคุณ',
    privacyFooter: '🔒 100% Client-Side Privacy — ทุกการคำนวณและข้อมูลถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีการส่งข้อมูลสู่เซิร์ฟเวอร์',
    printFooter: 'Money Superapp (100% Offline & Client-Side Private) • https://crossoverall.github.io/money-superapp/',
    skipLink: 'ข้ามไปยังเนื้อหาหลัก (Skip to content)',
    pwaInstallBtn: 'ติดตั้งแอป',
    pwaInstallTitle: 'ติดตั้ง Money Superapp ลงในอุปกรณ์',
    pwaOfflineReady: 'พร้อมใช้งานออฟไลน์',
    pwaOfflineMode: 'โหมดออฟไลน์',

    // Navigation Tabs
    tabDashboard: 'ภาพรวมพอร์ต (Dashboard)',
    tabRemaining: 'เงินเหลือแต่ละเดือน',
    tabDebt: 'จัดการหนี้สิน',
    tabTaxBase: 'ภาษีบุคคล (ภ.ง.ด. 90/91)',
    tabTaxPvd: 'ชดเชย & ภาษี PVD',
    tabMonthsSlips: 'สลิปเงินเดือน 12 เดือน',
    tabRebalance: 'ปรับพอร์ต & กองทุน',

    // Card Layout Toolbar
    toolbarFoldAll: '▼ ย่อทั้งหมด',
    toolbarExpandAll: '▲ ขยายทั้งหมด',
    toolbarReset: '↺ รีเซ็ตตำแหน่ง',
    toolbarMoveUp: 'เลื่อนขึ้น',
    toolbarMoveDown: 'เลื่อนลง',
    toolbarFoldExpand: 'ย่อ / ขยาย',

    // Common Action Controls
    actionSave: 'บันทึก',
    actionCancel: 'ยกเลิก',
    actionReset: 'รีเซ็ตข้อมูล',
    actionConfirm: 'ยืนยัน',
    actionClose: 'ปิด',
    actionCopy: 'คัดลอก',
    actionCopied: '✓ คัดลอกแล้ว!',
    actionExport: 'สำรองข้อมูล (JSON)',
    actionImport: 'กู้คืนข้อมูล (JSON)',
    actionPrint: 'พิมพ์รายงาน',
    actionActive: 'เปิดใช้งาน',
    actionOff: 'ปิดอยู่',
    actionApply: 'ปรับใช้',
    actionCalculate: 'คำนวณผลลัพธ์',
    actionClear: 'ล้างข้อมูล',
    actionAdd: '+ เพิ่มรายการ',
    actionDelete: 'ลบ',
    actionEdit: 'แก้ไข',

    // Common Units & Currencies
    unitBaht: 'บาท',
    unitThb: 'THB',
    unitMonth: 'เดือน',
    unitYear: 'ปี',
    unitDays: 'วัน',
    unitPercent: '%',
    unitPerMonth: 'บาท/เดือน',

    // Common Status Badges & Alerts
    statusSafe: 'ปลอดภัย (Safe)',
    statusWarning: 'ใกล้เต็มสิทธิ์ (Warning)',
    statusExceeded: 'เกินเพดาน (Exceeded)',
    statusComplete: 'สมบูรณ์',
    statusIncomplete: 'ยังไม่พร้อม',
    statusReadyToFile: 'พร้อมยื่นแบบ 🚀',
    statusHealthy: 'สุขภาพการเงินดี',
    statusCaution: 'ต้องระวัง',
    statusCritical: 'วิกฤต',

    // Dashboard Domain
    dashTitle: 'ภาพรวมการเงิน',
    dashSubtitle: 'สรุปความมั่งคั่งและประวัติการเติบโต',
    dashKpisTitle: '📊 สรุปภาพรวมทางการเงิน (Key Financial Indicators)',
    dashKpiNetworth: 'ความมั่งคั่งสุทธิ (Net Worth)',
    dashNetworthSub: 'สินทรัพย์ - หนี้สิน',
    dashKpiSavings: 'เงินออมต่อเดือน (Cash Flow)',
    dashKpiRunway: 'สายป่าน (Runway)',
    dashRunwaySub: 'ฉุกเฉินอยู่รอด',
    dashKpiDebt: 'ยอดหนี้รวม (Debt)',
    dashTaxBracket: 'ฐานภาษีปัจจุบัน',
    dashTaxPayLabel: 'ประมาณการภาษีที่ต้องจ่าย',
    dashChartTitle: 'แนวโน้มการเติบโต (Trends)',
    dashBtnSnapshot: '+ บันทึกเดือนนี้',
    dashHistoryTitle: 'ประวัติที่บันทึกไว้ (History)',
    dashQuickLinksTitle: 'ไปหน้าเครื่องมือ (Tools)',
    dashGoalsTitle: '🎯 เป้าหมายทางการเงิน (Goals & Milestones)',

    // Debt Freedom Domain
    debtTitle: 'วางแผนปลดหนี้ (Debt Payoff Planner)',
    debtSubtitle: 'เปรียบเทียบกลยุทธ์ Snowball vs Avalanche เพื่อค้นหาเส้นทางสู่การปลดหนี้ที่เร็วและประหยัดที่สุด',
    debtSecInput: '1. ข้อมูลหนี้สินของคุณ (Your Debts)',
    debtSecExtra: '2. แผนการโปะหนี้เพิ่มต่อเดือน (Extra Monthly Payment)',
    debtSecComparison: '3. เปรียบเทียบผลลัพธ์กลยุทธ์ (Strategy Comparison)',
    debtSecTimeline: '4. ตารางและกราฟ Timeline การปลดหนี้',
    debtSnowballName: 'กลยุทธ์ Snowball (หนี้น้อยหมดก่อน)',
    debtAvalancheName: 'กลยุทธ์ Avalanche (ดอกเบี้ยสูงหมดก่อน)',

    // Tax Planning Domain
    taxBaseTitle: 'คำนวณภาษีเงินได้บุคคลธรรมดา (ภ.ง.ด. 90/91)',
    taxBaseSubtitle: 'วางแผนลดหย่อนภาษี คำนวณอัตราก้าวหน้า และตรวจสอบเพดานลดหย่อนตามประมวลรัษฎากร',
    taxPvdTitle: 'คำนวณภาษีเงินชดเชยและกองทุนสำรองเลี้ยงชีพ (PVD)',
    taxPvdSubtitle: 'แยกยื่นใบแนบ ภ.ง.ด. 90/91 เพื่อประหยัดภาษีสูงสุดตามเกณฑ์อายุงาน 5 ปี',
    taxEfilingTitle: 'แบบแสดงรายการภาษีเงินได้บุคคลธรรมดา (e-Filing Worksheet)',
    taxRetirementPoolTitle: 'เพดานลดหย่อนกลุ่มเกษียณ 500,000 บาท (ม.47)',
    taxPreflightTitle: 'รายการตรวจสอบก่อนยื่นแบบออนไลน์ (Pre-Flight Checklist)',

    // Remaining Money & Budget Domain
    budgetTitle: 'วางแผนงบประมาณและเงินคงเหลือ (Remaining Money)',
    budgetSubtitle: 'ติดตามกระแสเงินสด จัดสรรเงินออมฉุกเฉิน และส่งเงินส่วนเกินไปลงทุน',
    budgetIncomeSec: '1. รายรับประจำและรายได้เสริม',
    budgetExpenseSec: '2. รายจ่ายคงที่และผันแปร',
    budgetSavingsSec: '3. การจัดสรรเงินออมและการลงทุน',

    // Portfolio Rebalance Domain
    rebalTitle: 'ปรับพอร์ตการลงทุน (Portfolio Rebalance)',
    rebalSubtitle: 'จัดสรรสินทรัพย์ตามเป้าหมาย คำนวณเงินเติม DCA แบบ Zero-Drift',
    rebalTargetSec: '1. สัดส่วนสินทรัพย์เป้าหมาย (Target Allocation)',
    rebalCurrentSec: '2. พอร์ตการลงทุนปัจจุบัน (Current Holdings)',
    rebalDcaSec: '3. แผนเติมเงินลงทุน (DCA Cash Flow)',

    // Months Slips Domain
    slipsTitle: 'จำลองและบันทึกสลิปเงินเดือน 12 เดือน',
    slipsSubtitle: 'วิเคราะห์รายได้สะสมทั้งปี ภาษีหัก ณ ที่จ่าย และเงินสมทบ ปกส. / กองทุนสำรองเลี้ยงชีพ',

    // Storage Quota & Offline Cache Lifecycle Domain (Roadmap Phase 112)
    cacheQuotaTitle: 'โควต้าพื้นที่และแคชออฟไลน์ (Storage & Cache Quota)',
    cacheQuotaDesc: 'ตรวจสอบขนาดพื้นที่จัดเก็บในอุปกรณ์และสถานะแคชออฟไลน์ของระบบ',
    cacheVersionLabel: 'เวอร์ชันแคชที่ใช้งาน:',
    cacheUsageLabel: 'พื้นที่ใช้งาน / โควต้าทั้งหมด:',
    btnRefreshCache: '🔄 อัปเดตแคช',
    btnPurgeStale: '🧹 ล้างแคชเก่า',
    cacheStatusReady: 'พร้อมใช้งานออฟไลน์สมบูรณ์',
    cacheRefreshing: 'กำลังอัปเดตไฟล์แคช...',
    cacheRefreshed: 'อัปเดตแคชออฟไลน์เรียบร้อยแล้ว',
    cachePurged: 'ล้างแคชเก่าที่ตกค้างเรียบร้อยแล้ว',

    // Google Drive Expense Export (Phase 120)
    btnSaveToDrive: 'บันทึกไปยัง Google Drive',
    driveModalTitle: 'บันทึกข้อมูลไปยัง Google Drive',
    driveModalSub: 'ส่งออกข้อมูลรายรับ-รายจ่ายไปยัง Google Drive เพื่อเปิดใน Google Sheets หรือเก็บบันทึกประวัติ',
    driveFormatLabel: 'เลือกรูปแบบไฟล์ที่ต้องการส่งออก:',
    driveFormatCsv: 'CSV (เหมาะสำหรับ Google Sheets / บันทึกรายจ่ายต่อเนื่อง)',
    driveFormatPdf: 'PDF (เหมาะสำหรับพิมพ์ / บันทึกเอกสารสรุป)',
    btnDriveShareOrSave: 'แชร์ / บันทึกไฟล์',
    btnOpenDrive: 'เปิด Google Drive',
    btnOpenSheets: 'เปิด Google Sheets',
    driveGuide:
      '💡 เคล็ดลับ: เมื่อเลือก CSV ระบบจะเตรียมไฟล์ที่พร้อมเปิดด้วย Google Sheets ได้ทันที หากเปิดบนมือถือสามารถกดบันทึกลง Google Drive ได้โดยตรง',

    // Debt Visual SVG Comparison Timeline (Phase 126)
    chartModeDual: 'เปรียบเทียบทั้งคู่',
    chartModeAvalanche: '⚡ Avalanche',
    chartModeSnowball: '⛄ Snowball',
    chartTooltipBalance: 'คงเหลือ',
    chartTooltipSaved: 'ประหยัดดอกเบี้ย',

    // Confirmations & Prompts
    confirmResetDefaults: 'ต้องการล้างข้อมูลและคืนค่าเริ่มต้นหรือไม่?',
    confirmDeleteRecord: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
  };

  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.i18n = global.MoneyApp.i18n || {};
  global.MoneyApp.i18n.th = th;

  // Auto-register with MoneyApp.I18n engine if present
  if (global.MoneyApp.I18n && typeof global.MoneyApp.I18n.register === 'function') {
    global.MoneyApp.I18n.register('th', th);
  }
})(typeof window !== 'undefined' ? window : globalThis);
