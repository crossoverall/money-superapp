import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadTaxWorksheet() {
  const code = readFileSync(resolve('js/engines/tax-worksheet.js'), 'utf8');
  const sandbox = {
    console,
    Date,
    Math,
    Number,
    String,
    parseFloat: Number.parseFloat,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.TaxWorksheet;
}

test('TaxWorksheet engine exports cleanly to MoneyApp namespace', () => {
  const ws = loadTaxWorksheet();
  assert.ok(ws, 'TaxWorksheet should be defined');
  assert.equal(typeof ws.formatReportDate, 'function');
  assert.equal(typeof ws.showCopyFeedback, 'function');
  assert.equal(typeof ws.copyEFilingField, 'function');
  assert.equal(typeof ws.copyAllEFilingSummary, 'function');
  assert.equal(typeof ws.updateDividendTaxCreditUI, 'function');
  assert.equal(typeof ws.updateEFilingWorksheetView, 'function');
  assert.equal(typeof ws.updatePrintReportView, 'function');
});

test('formatReportDate formats dates accurately for Thai (BE) and English (AD)', () => {
  const ws = loadTaxWorksheet();
  const d = new Date(2026, 9, 18, 14, 30); // 18 Oct 2026 14:30

  const enDate = ws.formatReportDate(d, 'en');
  assert.equal(enDate, '18 Oct 2026 14:30');

  const thDate = ws.formatReportDate(d, 'th');
  assert.equal(thDate, '18 ต.ค. 2569 14:30');
});

test('updateDividendTaxCreditUI updates preview factor, final tax and verdict properly', () => {
  const code = readFileSync(resolve('js/engines/tax-worksheet.js'), 'utf8');
  const domElements = {
    inpDividendAmount: { value: '100000' },
    selCitRate: { value: '0.2' },
    'lbl-credit-factor-preview': { textContent: '' },
    'val-opt-final-tax': { textContent: '' },
    'val-opt-claim-credit': { textContent: '', style: {} },
    divCreditVerdictBox: { textContent: '', innerHTML: '', style: {} },
    chkApplyDividendToTax: { checked: false },
    'badge-applied-status': { textContent: '', style: {} },
    netIncome: { textContent: '300000' },
    withheldTax: { value: '0' },
  };

  const fakeDocument = {
    getElementById(id) {
      return domElements[id] || null;
    },
  };

  const sandbox = {
    console,
    Date,
    document: fakeDocument,
    Math,
    Number,
    String,
    parseFloat: Number.parseFloat,
    window: {},
    MoneyApp: {
      calculateThaiDividendTaxCredit(_opts) {
        return {
          totalDividendWht: 10000,
          netTaxAdvantage: 5000,
          isClaimAdvantageous: true,
          optimalChoice: 'claim_credit',
          scenarioClaimCredit: { netPayableOrRefund: -5000 },
        };
      },
    },
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);

  const ws = sandbox.MoneyApp.TaxWorksheet;
  ws.updateDividendTaxCreditUI({
    LANG: 'th',
    formatMoney: (v) => String(v),
    parseNum: (v) => Number.parseFloat(v) || 0,
  });

  assert.equal(domElements['lbl-credit-factor-preview'].textContent, 'เครดิต 25% (x 20/80)');
  assert.equal(domElements['val-opt-final-tax'].textContent, '10000 บาท');
  assert.ok(domElements['val-opt-claim-credit'].textContent.includes('ขอคืน +5000 บาท'));
  assert.ok(domElements.divCreditVerdictBox.innerHTML.includes('แนะนำ: ยื่นเครดิตภาษีเงินปันผล'));
});

test('updateEFilingWorksheetView evaluates retirement pool and preflight compliance checklist', () => {
  const code = readFileSync(resolve('js/engines/tax-worksheet.js'), 'utf8');
  const domElements = {
    panelEFilingWorksheet: {},
    chkApplyDividendToTax: { checked: false },
    inpDividendAmount: { value: '0' },
    selCitRate: { value: '0.2' },
    salary: { value: '100000' },
    bonus: { value: '50000' },
    yearlyIncome: { value: '0' },
    yearlyBonus: { value: '0' },
    withheldTax: { value: '50000' },
    lblPool500kTitle: { textContent: '' },
    badgePoolStatus: { textContent: '', style: {} },
    valPoolCombinedText: { textContent: '', style: {} },
    barPoolProgress: { style: {} },
    valPoolPvd: { textContent: '' },
    valPoolRmf: { textContent: '' },
    valPoolHeadroomNotice: { style: {}, innerHTML: '' },
    valPoolHeadroom: { textContent: '' },
    alertPoolExcessCallout: { style: {} },
    valPoolExcessAmount: { textContent: '' },
    lblPoolExcessTitle: { textContent: '' },
    lblPoolExcessDesc: { innerHTML: '' },
    lblPreflightTitle: { textContent: '' },
    btnCheckAllPreflight: { textContent: '' },
    btnResetPreflight: { textContent: '' },
    'lbl-chk-50tawi': { textContent: '' },
    'sub-chk-50tawi': { textContent: '' },
    'lbl-chk-pool500k': { textContent: '' },
    'sub-chk-pool500k': { textContent: '' },
    'lbl-chk-thaiesg': { textContent: '' },
    'sub-chk-thaiesg': { textContent: '' },
    'lbl-chk-consent': { textContent: '' },
    'sub-chk-consent': { textContent: '' },
    'lbl-chk-promptpay': { textContent: '' },
    'sub-chk-promptpay': { textContent: '' },
    'chk-ef-50tawi': { checked: false },
    'chk-ef-pool500k': { checked: false, disabled: false },
    'chk-ef-thaiesg': { checked: false },
    'chk-ef-consent': { checked: false },
    'chk-ef-promptpay': { checked: false },
    badgeEfPreflightStatus: { textContent: '', style: {} },
    valEf401: { textContent: '', dataset: {} },
    valEf402: { textContent: '', dataset: {} },
    valEf404b: { textContent: '', dataset: {} },
    valEfExpense: { textContent: '' },
    valEfGroupA: { textContent: '', dataset: {} },
    valEfGroupB: { textContent: '', dataset: {} },
    valEfGroupC: { textContent: '', dataset: {} },
    valEfGroupD: { textContent: '', dataset: {} },
    valEfNetBalance: { textContent: '', style: {}, dataset: {} },
    descEfNetBalance: { textContent: '' },
  };

  const fakeDocument = {
    getElementById(id) {
      return domElements[id] || null;
    },
  };

  const sandbox = {
    console,
    Date,
    document: fakeDocument,
    Math,
    Number,
    String,
    parseFloat: Number.parseFloat,
    window: {},
    MoneyApp: {
      calculateThaiEFilingWorksheet() {
        return {
          income401: 1250000,
          income402: 0,
          income404b: 0,
          statutoryExpenseDeduction: 100000,
          deductions: {
            groupA: 60000,
            groupB: 350000,
            groupC: 50000,
            groupD: 0,
          },
          netTaxDueOrRefund: -12500,
          isRefund: true,
          isPayable: false,
          canInstallment: false,
          retirementPool: {
            pvd: 200000,
            rmf: 150000,
            ssf: 0,
            totalRaw: 350000,
            effectiveTotal: 350000,
            excess: 0,
            headroom: 150000,
            utilizationPct: 70,
            status: 'safe',
            isExceeded: false,
          },
        };
      },
      evaluateEFilingPreFlightChecklist() {
        return {
          isReady: true,
          completedCount: 5,
          hasRetirementExcess: false,
        };
      },
    },
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);

  const ws = sandbox.MoneyApp.TaxWorksheet;
  ws.updateEFilingWorksheetView({
    deductionsArg: { pvd: 200000, rawFund: 150000, insurance: 50000 },
    formatMoney: (v) => String(v),
    incomeMode: 'monthly',
    lang: 'th',
    lastCalculatedDeductions: {},
    preflightState: {
      doc50Tawi: true,
      pool500k: true,
      thaiEsg: true,
      consentRd: true,
      promptPayCitizen: true,
    },
  });

  assert.equal(domElements.badgePoolStatus.textContent, 'ปลอดภัย (Safe)');
  assert.equal(domElements.badgeEfPreflightStatus.textContent, '5/5 พร้อมยื่นแบบ 🚀');
  assert.equal(domElements.valEf401.textContent, '1250000');
  assert.ok(domElements.valEfNetBalance.textContent.includes('ขอคืนภาษี: -12500 บาท'));
});
