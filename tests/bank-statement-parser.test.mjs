import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');

function createEnvironment() {
  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: '', dataset: {} },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
  };

  const fn = new Function('window', 'document', 'localStorage', `${sharedCode}; return window.MoneyApp;`);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp };
}

describe('Thai Mobile Banking Statement Auto-Parser (Phase 62)', () => {
  const { MoneyApp } = createEnvironment();
  const { detectAndParseThaiBankStatement } = MoneyApp;

  it('correctly detects and parses KBank (K PLUS) statement CSV', () => {
    const kbankCsv = `Date,Time,Transaction Type,Withdrawal,Deposit,Outstanding Balance,Channel,Description
01/10/2026,08:30:15,Transfer,,"55,000.00",62500.00,K PLUS,Salary Payroll October
02/10/2026,12:15:00,PromptPay,120.00,,62380.00,K PLUS,GrabFood Delivery
03/10/2026,18:45:20,Payment,1850.50,,60529.50,K PLUS,PEA Electricity Bill
05/10/2026,14:20:10,Transfer,,1500.00,62029.50,K PLUS,Transfer from Friend
`;
    const res = detectAndParseThaiBankStatement(kbankCsv, 'kbank_statement_oct2026.csv');
    assert.equal(res.isBankStatement, true);
    assert.equal(res.bankCode, 'kbank');
    assert.equal(res.bankName, 'Kasikornbank (KBank)');
    assert.equal(res.summary.transactionCount, 4);
    assert.equal(res.summary.totalInflow, 56500); // 55000 + 1500
    assert.equal(res.summary.totalOutflow, 1970.5); // 120 + 1850.5

    // Incomes
    assert.equal(res.candidate.incomes.length, 2);
    assert.equal(res.candidate.incomes[0].name.includes('Salary Payroll'), true);
    assert.equal(res.candidate.incomes[0].value, 55000);

    // Expenses with category keywords
    assert.equal(res.candidate.expenses.length, 2);
    assert.equal(res.candidate.expenses[0].name.includes('GrabFood'), true);
    assert.equal(res.candidate.expenses[0].value, 120);
    assert.equal(res.candidate.expenses[1].name.includes('PEA Electricity'), true);
    assert.equal(res.candidate.expenses[1].value, 1850.5);
  });

  it('correctly detects and parses SCB Easy statement CSV with Thai headers', () => {
    const scbCsv = `วันที่ทำรายการ,เวลา,รายละเอียด,จำนวนเงินที่ถอน (บาท),จำนวนเงินที่ฝาก (บาท),ยอดเงินคงเหลือ (บาท)
01/10/2026,09:00:00,เงินเดือน SCB Payroll,,65000.00,75000.00
02/10/2026,13:10:00,ShopeePay 7-Eleven,245.00,,74755.00
03/10/2026,15:20:00,PTT Station Gas Oil,1200.00,,73555.00
`;
    const res = detectAndParseThaiBankStatement(scbCsv, 'scb_statement.csv');
    assert.equal(res.isBankStatement, true);
    assert.equal(res.bankCode, 'scb');
    assert.equal(res.bankName, 'Siam Commercial Bank (SCB)');
    assert.equal(res.summary.transactionCount, 3);
    assert.equal(res.summary.totalInflow, 65000);
    assert.equal(res.summary.totalOutflow, 1445);
    assert.equal(res.candidate.incomes.length, 1);
    assert.equal(res.candidate.expenses.length, 2);
  });

  it('correctly detects and parses Krungthai NEXT statement CSV', () => {
    const ktbCsv = `Date/Time,Transaction Description,Debit,Credit,Balance
10/10/2026 10:00,Interest Deposit,,32.50,15032.50
11/10/2026 11:30,True Internet Bill,640.93,,14391.57
`;
    const res = detectAndParseThaiBankStatement(ktbCsv, 'krungthai_next.csv');
    assert.equal(res.isBankStatement, true);
    assert.equal(res.bankCode, 'krungthai');
    assert.equal(res.bankName, 'Krungthai Bank (KTB)');
    assert.equal(res.summary.transactionCount, 2);
    assert.equal(res.summary.totalInflow, 32.5);
    assert.equal(res.summary.totalOutflow, 640.93);
  });

  it('correctly detects and parses KKP Mobile / Dime statement with single signed amount', () => {
    const kkpCsv = `Date,Transaction,Amount,Balance
01/10/2026,Monthly Salary,48000.00,50000.00
02/10/2026,Netflix Subscription,-419.00,49581.00
04/10/2026,Coffee Cafe Amazon,-75.00,49506.00
`;
    const res = detectAndParseThaiBankStatement(kkpCsv, 'kkp_dime_statement.csv');
    assert.equal(res.isBankStatement, true);
    assert.equal(res.bankCode, 'kkp');
    assert.equal(res.summary.totalInflow, 48000);
    assert.equal(res.summary.totalOutflow, 494);
    assert.equal(res.candidate.incomes.length, 1);
    assert.equal(res.candidate.expenses.length, 2);
  });

  it('gracefully returns isBankStatement: false for generic Money Superapp CSV', () => {
    const genericCsv = `Category,Item,Amount,Note
Income,Salary,50000,Base
Expense,Rent,12000,Condo
`;
    const res = detectAndParseThaiBankStatement(genericCsv, 'remaining_money_export.csv');
    assert.equal(res.isBankStatement, false);
  });

  it('gracefully handles empty, corrupted, or non-string CSV input', () => {
    assert.equal(detectAndParseThaiBankStatement('').isBankStatement, false);
    assert.equal(detectAndParseThaiBankStatement(null).isBankStatement, false);
    assert.equal(detectAndParseThaiBankStatement('random words without structure').isBankStatement, false);
  });
});
