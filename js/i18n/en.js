/**
 * Money Superapp - Centralized English Translation Dictionary (Roadmap Phase 101)
 * 100% offline & client-side compatible (file:// and http(s)://).
 */
((global) => {
  const en = {
    // Common App Shell & Global Controls
    appName: 'Money Superapp',
    appTagline: 'Personal Financial Planner 100% Offline & Privacy-First',
    privacyBadge: '🔒 100% Offline & Private on Your Device',
    privacyFooter: '🔒 100% Client-Side Privacy — ทุกการคำนวณและข้อมูลถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีการส่งข้อมูลสู่เซิร์ฟเวอร์',
    printFooter: 'Money Superapp (100% Offline & Client-Side Private) • https://crossoverall.github.io/money-superapp/',
    skipLink: 'ข้ามไปยังเนื้อหาหลัก (Skip to content)',
    pwaInstallBtn: 'Install App',
    pwaInstallTitle: 'Install Money Superapp to your device',
    pwaOfflineReady: 'Offline Ready',
    pwaOfflineMode: 'Offline Mode',

    // Navigation Tabs
    tabDashboard: 'Portfolio Dashboard',
    tabRemaining: 'Monthly Cash Flow',
    tabDebt: 'Debt Freedom',
    tabTaxBase: 'Thai PIT (P.N.D. 90/91)',
    tabTaxPvd: 'Severance & PVD Tax',
    tabMonthsSlips: '12-Month Payslips',
    tabRebalance: 'Portfolio Rebalancer',

    // Card Layout Toolbar
    toolbarFoldAll: '▼ Fold All',
    toolbarExpandAll: '▲ Expand All',
    toolbarReset: '↺ Reset Layout',
    toolbarMoveUp: 'Move Up',
    toolbarMoveDown: 'Move Down',
    toolbarFoldExpand: 'Fold / Expand',

    // Common Action Controls
    actionSave: 'Save',
    actionCancel: 'Cancel',
    actionReset: 'Reset Data',
    actionConfirm: 'Confirm',
    actionClose: 'Close',
    actionCopy: 'Copy',
    actionCopied: '✓ Copied!',
    actionExport: 'Backup (JSON)',
    actionImport: 'Restore (JSON)',
    actionPrint: 'Print Report',
    actionActive: 'ACTIVE',
    actionOff: 'OFF',
    actionApply: 'Apply',
    actionCalculate: 'Calculate Results',
    actionClear: 'Clear Data',
    actionAdd: '+ Add Item',
    actionDelete: 'Delete',
    actionEdit: 'Edit',

    // Common Units & Currencies
    unitBaht: 'THB',
    unitThb: 'THB',
    unitMonth: 'month',
    unitYear: 'year',
    unitDays: 'days',
    unitPercent: '%',
    unitPerMonth: 'THB/month',

    // Common Status Badges & Alerts
    statusSafe: 'Safe (<80%)',
    statusWarning: 'Near Limit (>=80%)',
    statusExceeded: 'Exceeded Cap',
    statusComplete: 'Complete',
    statusIncomplete: 'Incomplete',
    statusReadyToFile: 'Ready to File 🚀',
    statusHealthy: 'Healthy Financial State',
    statusCaution: 'Caution Advised',
    statusCritical: 'Critical Status',

    // Dashboard Domain
    dashTitle: 'Financial Overview',
    dashSubtitle: 'Wealth summary and growth trajectory',
    dashKpisTitle: '📊 Key Financial Indicators',
    dashKpiNetworth: 'Net Worth',
    dashNetworthSub: 'Assets - Liabilities',
    dashKpiSavings: 'Monthly Cash Flow (Savings)',
    dashKpiRunway: 'Runway',
    dashRunwaySub: 'Emergency Survival Months',
    dashKpiDebt: 'Total Outstanding Debt',
    dashTaxBracket: 'Current Marginal Tax Bracket',
    dashTaxPayLabel: 'Estimated Annual Tax Liability',
    dashChartTitle: 'Wealth Trends & Growth Trajectory',
    dashBtnSnapshot: '+ Record This Month',
    dashHistoryTitle: 'Historical Records',
    dashQuickLinksTitle: 'Direct Tool Links',
    dashGoalsTitle: '🎯 Financial Goals & Milestones',

    // Debt Freedom Domain
    debtTitle: 'Debt Payoff Planner',
    debtSubtitle: 'Compare Snowball vs Avalanche strategies to discover your fastest debt-free path',
    debtSecInput: '1. Your Debts & Loan Profiles',
    debtSecExtra: '2. Extra Monthly Payoff Acceleration',
    debtSecComparison: '3. Strategy Comparison & Metrics',
    debtSecTimeline: '4. Payoff Timeline & Interactive Schedules',
    debtSnowballName: 'Snowball Method (Lowest Balance First)',
    debtAvalancheName: 'Avalanche Method (Highest Interest First)',

    // Tax Planning Domain
    taxBaseTitle: 'Personal Income Tax Calculator (P.N.D. 90/91)',
    taxBaseSubtitle:
      'Optimize statutory deductions, compute progressive tax brackets, and verify Revenue Department ceilings',
    taxPvdTitle: 'Severance & Provident Fund (PVD) Tax Optimizer',
    taxPvdSubtitle: 'File separate tax return attachment to maximize tax savings with 5+ years of service',
    taxEfilingTitle: 'Personal Income Tax e-Filing Worksheet',
    taxRetirementPoolTitle: 'Section 47 Statutory Retirement Ceiling 500,000 THB',
    taxPreflightTitle: 'Online Filing Pre-Flight Checklist',

    // Remaining Money & Budget Domain
    budgetTitle: 'Monthly Cash Flow & Budgeting (Remaining Money)',
    budgetSubtitle: 'Track discretionary cash flow, build emergency buffers, and bridge surplus into investments',
    budgetIncomeSec: '1. Fixed & Variable Income Streams',
    budgetExpenseSec: '2. Fixed Living & Discretionary Expenses',
    budgetSavingsSec: '3. Savings Goals & Investment Allocations',

    // Portfolio Rebalance Domain
    rebalTitle: 'Portfolio Rebalance & Allocation Optimizer',
    rebalSubtitle: 'Maintain target asset allocation with zero-drift smart cash DCA optimization',
    rebalTargetSec: '1. Target Portfolio Asset Allocation',
    rebalCurrentSec: '2. Current Asset Holdings & Portfolio Balances',
    rebalDcaSec: '3. DCA Cash Inflow Rebalance Schedule',

    // Months Slips Domain
    slipsTitle: '12-Month Payslip Simulator & Tax Withholding Tracker',
    slipsSubtitle: 'Simulate cumulative gross wages, 50 Tawi withholding tax, and Social Security / PVD deductions',

    // Storage Quota & Offline Cache Lifecycle Domain (Roadmap Phase 112)
    cacheQuotaTitle: 'Storage Quota & Offline Cache',
    cacheQuotaDesc: 'Monitor device storage quota usage and offline cache health',
    cacheVersionLabel: 'Active Cache Version:',
    cacheUsageLabel: 'Used Storage / Total Quota:',
    btnRefreshCache: '🔄 Refresh Cache',
    btnPurgeStale: '🧹 Purge Stale Caches',
    cacheStatusReady: 'Offline cache ready',
    cacheRefreshing: 'Refreshing cache assets...',
    cacheRefreshed: 'Offline cache refreshed successfully',
    cachePurged: 'Stale caches purged successfully',

    // Confirmations & Prompts
    confirmResetDefaults: 'Clear form data and reset to defaults?',
    confirmDeleteRecord: 'Are you sure you want to delete this record?',
  };

  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.i18n = global.MoneyApp.i18n || {};
  global.MoneyApp.i18n.en = en;

  // Auto-register with MoneyApp.I18n engine if present
  if (global.MoneyApp.I18n && typeof global.MoneyApp.I18n.register === 'function') {
    global.MoneyApp.I18n.register('en', en);
  }
})(typeof window !== 'undefined' ? window : globalThis);
