import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadBudgetImport() {
  const code = readFileSync(resolve('js/engines/budget-import.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    parseFloat: Number.parseFloat,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.BudgetImport;
}

test('BudgetImport engine exports cleanly to MoneyApp namespace', () => {
  const importer = loadBudgetImport();
  assert.ok(importer, 'BudgetImport should be defined');
  assert.equal(typeof importer.parseCSVRows, 'function');
  assert.equal(typeof importer.detectColumns, 'function');
  assert.equal(typeof importer.cleanField, 'function');
  assert.equal(typeof importer.cleanAmount, 'function');
  assert.equal(typeof importer.isSubtotalRow, 'function');
  assert.equal(typeof importer.parseImportJSON, 'function');
  assert.equal(typeof importer.parseImportCSV, 'function');
});

test('BudgetImport.parseCSVRows parses standard and quoted RFC-4180 CSVs correctly', () => {
  const importer = loadBudgetImport();

  // Standard CSV with BOM
  const csvWithBom = '\uFEFFCategory,Item,Amount\r\nIncome,Salary,50000\nExpense,"Dinner, wine",1200\r\n';
  const rows = importer.parseCSVRows(csvWithBom);
  assert.equal(rows.length, 3);
  assert.deepEqual(Array.from(rows[0]), ['Category', 'Item', 'Amount']);
  assert.deepEqual(Array.from(rows[1]), ['Income', 'Salary', '50000']);
  assert.deepEqual(Array.from(rows[2]), ['Expense', 'Dinner, wine', '1200']);

  // Escaped double-quotes inside quotes: "He said ""Hello"""
  const csvEscaped = 'Item,Remark\n"Special ""Bonus""",Approved\n';
  const rowsEscaped = importer.parseCSVRows(csvEscaped);
  assert.equal(rowsEscaped.length, 2);
  assert.equal(rowsEscaped[1][0], 'Special "Bonus"');
  assert.equal(rowsEscaped[1][1], 'Approved');
});

test('BudgetImport.detectColumns identifies English and Thai header permutations', () => {
  const importer = loadBudgetImport();

  // English header
  const enCols = importer.detectColumns(['Category', 'Item Name', 'Amount (THB)', 'Remark']);
  assert.equal(enCols.catCol, 0);
  assert.equal(enCols.itemCol, 1);
  assert.equal(enCols.amtCol, 2);
  assert.equal(enCols.noteCol, 3);

  // Thai header
  const thCols = importer.detectColumns(['หมวดหมู่', 'ชื่อรายการ', 'จำนวนเงิน', 'หมายเหตุ']);
  assert.equal(thCols.catCol, 0);
  assert.equal(thCols.itemCol, 1);
  assert.equal(thCols.amtCol, 2);
  assert.equal(thCols.noteCol, 3);

  // Fallback defaults
  const fallback = importer.detectColumns(['ColA', 'ColB', 'ColC']);
  assert.equal(fallback.catCol, 0);
  assert.equal(fallback.itemCol, 1);
  assert.equal(fallback.amtCol, 2);
});

test('BudgetImport.cleanAmount parses currency numbers with commas and symbols', () => {
  const importer = loadBudgetImport();
  assert.equal(importer.cleanAmount(50000), 50000);
  assert.equal(importer.cleanAmount('1,250,000.50'), 1250000.5);
  assert.equal(importer.cleanAmount('฿ 3,500'), 3500);
  assert.equal(importer.cleanAmount("'1200"), 1200);
  assert.equal(importer.cleanAmount('invalid'), 0);
  assert.equal(importer.cleanAmount(-500), 0); // clamped to 0
});

test('BudgetImport.isSubtotalRow detects total and summary rows to exclude', () => {
  const importer = loadBudgetImport();
  assert.equal(importer.isSubtotalRow('Summary', 'Total Income'), true);
  assert.equal(importer.isSubtotalRow('สรุป', 'รวมค่าใช้จ่าย'), true);
  assert.equal(importer.isSubtotalRow('General', 'รวมทั้งสิ้น'), true);
  assert.equal(importer.isSubtotalRow('Category', 'Remaining for investment'), true);
  assert.equal(importer.isSubtotalRow('Expense', 'ค่าอาหาร'), false);
  assert.equal(importer.isSubtotalRow('Income', 'เงินเดือน'), false);
});

test('BudgetImport.parseImportJSON parses and normalizes backup JSON models', () => {
  const importer = loadBudgetImport();

  const payload = {
    version: '2.5.38',
    data: {
      incomes: [{ name: 'Salary', value: 80000, isSalary: true }],
      expenses: [
        { name: 'Rent', value: 15000 },
        { name: 'ภาษีหัก ณ ที่จ่าย', value: 4500, auto: true, autoType: 'tax' },
      ],
      savings: [{ name: 'Index Fund', value: 20000 }],
      pvdPercent: 5,
      currentEmergencyReserve: 100000,
      showEmergencyRunway: true,
    },
  };

  const candidate = importer.parseImportJSON(JSON.stringify(payload));
  assert.ok(candidate);
  assert.equal(candidate.incomes.length, 1);
  assert.equal(candidate.incomes[0].name, 'Salary');
  assert.equal(candidate.incomes[0].value, 80000);
  assert.equal(candidate.incomes[0].isSalary, true);

  // Auto-expenses (tax, sso, pvd) should be present
  assert.ok(candidate.expenses.some((e) => e.autoType === 'tax'));
  assert.ok(candidate.expenses.some((e) => e.autoType === 'sso'));
  assert.ok(candidate.expenses.some((e) => e.autoType === 'pvd'));

  assert.equal(candidate.savings.length, 1);
  assert.equal(candidate.savings[0].value, 20000);
  assert.equal(candidate.pvdPercent, 5);
  assert.equal(candidate.currentEmergencyReserve, 100000);
  assert.equal(candidate.showEmergencyRunway, true);
});

test('BudgetImport.parseImportCSV parses standard CSV into candidate budget', () => {
  const importer = loadBudgetImport();

  const csv = [
    'Category,Item,Amount,Note',
    'Income,Monthly Salary,70000,เงินเดือนประจำ',
    'Expense,Condo Rent,18000,Needs',
    'Expense,Groceries,8000,Food',
    'Saving,Provident Fund,3500,PVD 5%',
    'Runway,Emergency Reserve,120000,6 months',
    'Summary,Total Income,70000,',
  ].join('\n');

  const candidate = importer.parseImportCSV(csv, { fileName: 'my-budget.csv', defaultPvd: 3 });
  assert.ok(candidate);
  assert.equal(candidate.incomes.length, 1);
  assert.equal(candidate.incomes[0].name, 'Monthly Salary');
  assert.equal(candidate.incomes[0].value, 70000);
  assert.equal(candidate.incomes[0].isSalary, true);

  assert.equal(candidate.currentEmergencyReserve, 120000);
  assert.equal(candidate.showEmergencyRunway, true);
  assert.equal(candidate.pvdPercent, 5); // parsed from PVD 5% note
});
