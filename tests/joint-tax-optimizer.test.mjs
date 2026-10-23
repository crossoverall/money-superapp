import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadThaiPitEngine() {
  const code = readFileSync(resolve('js/engines/thai-pit.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    String,
    Array,
    Object,
    Number,
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp;
}

test('thai-pit engine exports optimizeSpousalTaxFiling', () => {
  const pit = loadThaiPitEngine();
  assert.ok(pit, 'MoneyApp should be defined');
  assert.equal(typeof pit.optimizeSpousalTaxFiling, 'function');
  assert.equal(typeof pit.computeThaiPitTax, 'function');
});

test('optimizeSpousalTaxFiling identifies separate filing advantage for dual-income spouses', () => {
  const pit = loadThaiPitEngine();

  // Dual-income household: both Spouse A and B earn 600,000 THB/year
  const res = pit.optimizeSpousalTaxFiling({
    spouseA: { income: 600000, deductions: 0 },
    spouseB: { income: 600000, deductions: 0, hasIncome: true },
    isEN: false,
  });

  assert.equal(res.recommendedOption, 'separate');
  assert.equal(res.separateBreakdown.spouseA.taxPayable, 21500);
  assert.equal(res.separateBreakdown.spouseB.taxPayable, 21500);
  assert.equal(res.totalTaxSeparate, 43000);

  // Joint filing pushes combined taxable to 880,000 THB (20% bracket)
  assert.equal(res.jointBreakdown.combinedIncome, 1200000);
  assert.equal(res.jointBreakdown.taxableIncome, 880000);
  assert.equal(res.totalTaxJoint, 91000);

  // Separate filing saves 48,000 THB
  assert.equal(res.taxSavings, 48000);
  assert.ok(res.advisoryNoteTh.includes('แนะนำ: ยื่นแยกประหยัดกว่า 48,000 บาท'));
});

test('optimizeSpousalTaxFiling identifies joint filing advantage when non-working spouse has unused deductions', () => {
  const pit = loadThaiPitEngine();

  // Spouse A earns 1,200,000 THB.
  // Spouse B has 0 income, but holds 100,000 THB of deductions (e.g. parent care + life insurance)
  const res = pit.optimizeSpousalTaxFiling({
    spouseA: { income: 1200000, deductions: 50000 },
    spouseB: { income: 0, deductions: 100000, hasIncome: false },
    isEN: true,
  });

  // Separate filing: Spouse B's 100k deduction is wasted because Spouse B has no income.
  // Joint filing: Spouse B's 100k deduction is fully deducted against Spouse A's income.
  assert.equal(res.recommendedOption, 'joint');
  assert.ok(res.totalTaxJoint < res.totalTaxSeparate);
  assert.ok(res.taxSavings > 0);
  assert.ok(res.advisoryNoteEn.includes('Recommended: Joint filing saves'));
});

test('optimizeSpousalTaxFiling handles zero-tax or equal threshold gracefully', () => {
  const pit = loadThaiPitEngine();

  // Low income earners where neither owes any tax
  const res = pit.optimizeSpousalTaxFiling({
    spouseA: { income: 150000, deductions: 0 },
    spouseB: { income: 150000, deductions: 0, hasIncome: true },
  });

  assert.equal(res.recommendedOption, 'equal');
  assert.equal(res.totalTaxSeparate, 0);
  assert.equal(res.totalTaxJoint, 0);
  assert.equal(res.taxSavings, 0);
});
