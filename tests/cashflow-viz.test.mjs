import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadCashflowViz() {
  const code = readFileSync(resolve('js/engines/cashflow-viz.js'), 'utf8');
  const sandbox = {
    console,
    Math,
    document: {
      getElementById: () => null,
    },
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return sandbox.MoneyApp?.CashflowViz;
}

test('CashflowViz engine exports cleanly to MoneyApp namespace', () => {
  const viz = loadCashflowViz();
  assert.ok(viz, 'CashflowViz should be defined');
  assert.equal(typeof viz.classifyBudgetType, 'function');
  assert.equal(typeof viz.calculateBudgetRule503020, 'function');
  assert.equal(typeof viz.calculateEmergencyRunway, 'function');
  assert.equal(typeof viz.generateSankeyRibbonPath, 'function');
  assert.equal(typeof viz.calculateSankeyFlows, 'function');
  assert.equal(typeof viz.renderCashflowWaterfall, 'function');
  assert.equal(typeof viz.renderCashflowSankey, 'function');
});

test('CashflowViz.classifyBudgetType handles explicit and keyword classification', () => {
  const viz = loadCashflowViz();
  // Explicit budgetType overrides
  assert.equal(viz.classifyBudgetType({ budgetType: 'need', name: 'Coffee' }), 'need');
  assert.equal(viz.classifyBudgetType({ budgetType: 'want', name: 'Rent' }), 'want');
  assert.equal(viz.classifyBudgetType({ budgetType: 'saving', name: 'Food' }), 'saving');

  // Statutory & savings keyword heuristics
  assert.equal(viz.classifyBudgetType({ name: 'ภาษีหัก ณ ที่จ่าย' }), 'need');
  assert.equal(viz.classifyBudgetType({ name: 'SSO ประกันสังคม' }), 'need');
  assert.equal(viz.classifyBudgetType({ name: 'กองทุนสำรองเลี้ยงชีพ PVD' }), 'saving');
  assert.equal(viz.classifyBudgetType({ name: 'เงินออมฉุกเฉิน' }), 'saving');

  // Wants vs Needs keywords
  assert.equal(viz.classifyBudgetType({ name: 'ค่ากาแฟ Starbucks' }), 'want');
  assert.equal(viz.classifyBudgetType({ name: 'Netflix Subscription' }), 'want');
  assert.equal(viz.classifyBudgetType({ name: 'ค่าเช่าห้องพัก' }), 'need');
  assert.equal(viz.classifyBudgetType({ name: 'ค่าน้ำมันรถ' }), 'need');

  // Fallbacks
  assert.equal(viz.classifyBudgetType(null), 'want');
  assert.equal(viz.classifyBudgetType({ name: 'สุ่มรายการ' }, 'saving'), 'saving');
  assert.equal(viz.classifyBudgetType({ name: 'สุ่มรายการ' }, 'expense'), 'want');
});

test('CashflowViz.calculateBudgetRule503020 calculates 50/30/20 proportions accurately', () => {
  const viz = loadCashflowViz();

  // Test standard 50/30/20 balanced budget: 50,000 income, 25,000 needs, 15,000 wants, 10,000 savings
  const res = viz.calculateBudgetRule503020({
    totalIncome: 50000,
    expenses: [
      { name: 'ค่าเช่าคอนโด', value: 25000, budgetType: 'need' },
      { name: 'กินดื่มเที่ยว', value: 15000, budgetType: 'want' },
    ],
    savings: [{ name: 'กองทุน ETF', value: 10000, budgetType: 'saving' }],
    remaining: 0,
  });

  assert.equal(res.needsTotal, 25000);
  assert.equal(res.wantsTotal, 15000);
  assert.equal(res.savingsTotal, 10000);
  assert.equal(res.needsPct, 50);
  assert.equal(res.wantsPct, 30);
  assert.equal(res.savingsPct, 20);
  assert.equal(res.status, 'balanced');

  // Test donut geometry
  assert.equal(res.donut.radius, 70);
  assert.ok(res.donut.circumference > 439 && res.donut.circumference < 440);
  assert.ok(res.donut.needsArc > 219 && res.donut.needsArc < 221);
});

test('CashflowViz.calculateBudgetRule503020 correctly flags abnormal status tiers', () => {
  const viz = loadCashflowViz();

  // Super Saver: savings >= 30%
  const superSaver = viz.calculateBudgetRule503020({
    totalIncome: 100000,
    expenses: [{ name: 'Needs', value: 40000, budgetType: 'need' }],
    savings: [{ name: 'Invest', value: 60000, budgetType: 'saving' }],
  });
  assert.equal(superSaver.status, 'excellent_savings');

  // High Needs: needs > 60%
  const highNeeds = viz.calculateBudgetRule503020({
    totalIncome: 50000,
    expenses: [
      { name: 'Debt & Rent', value: 35000, budgetType: 'need' },
      { name: 'Food', value: 5000, budgetType: 'want' },
    ],
    savings: [{ name: 'Save', value: 10000, budgetType: 'saving' }],
  });
  assert.equal(highNeeds.status, 'high_needs');

  // Low Savings: savings < 10%
  const lowSavings = viz.calculateBudgetRule503020({
    totalIncome: 50000,
    expenses: [
      { name: 'Living', value: 26000, budgetType: 'need' },
      { name: 'Party', value: 20000, budgetType: 'want' },
    ],
    savings: [{ name: 'Leftover', value: 4000, budgetType: 'saving' }],
  });
  assert.equal(lowSavings.status, 'low_savings');
});

test('CashflowViz.calculateEmergencyRunway determines runway months and safety tiers', () => {
  const viz = loadCashflowViz();

  // Danger: < 3 months
  const danger = viz.calculateEmergencyRunway({ reserve: 30000, monthlyExpenses: 20000 });
  assert.equal(danger.months, 1.5);
  assert.equal(danger.tier, 'danger');
  assert.equal(danger.target3M, 60000);
  assert.equal(danger.target6M, 120000);
  assert.equal(danger.deficit6M, 90000);

  // Healthy: 3 - 6 months
  const healthy = viz.calculateEmergencyRunway({ reserve: 80000, monthlyExpenses: 20000 });
  assert.equal(healthy.months, 4);
  assert.equal(healthy.tier, 'healthy');

  // Solid: > 6 months
  const solid = viz.calculateEmergencyRunway({ reserve: 150000, monthlyExpenses: 20000 });
  assert.equal(solid.months, 7.5);
  assert.equal(solid.tier, 'solid');
  assert.equal(solid.deficit6M, 0);

  // Unspecified: reserve or monthlyExpenses zero
  const unspec = viz.calculateEmergencyRunway({ reserve: 0, monthlyExpenses: 0 });
  assert.equal(unspec.tier, 'unspecified');
});

test('CashflowViz.generateSankeyRibbonPath generates valid SVG cubic bezier string', () => {
  const viz = loadCashflowViz();
  const path = viz.generateSankeyRibbonPath(100, 50, 70, 300, 60, 80);
  assert.ok(path.startsWith('M 100.0 50.0'));
  assert.ok(path.includes('C'));
  assert.ok(path.includes('L 300.0 80.0'));
  assert.ok(path.endsWith('Z'));
});

test('CashflowViz.calculateSankeyFlows constructs multi-stage conservation graph', () => {
  const viz = loadCashflowViz();

  // Zero / empty data
  const empty = viz.calculateSankeyFlows({ totalIncome: 0 });
  assert.equal(empty.hasData, false);

  // Flow scenario: Gross 100,000, Deductions 10,000, Needs 40,000, Wants 20,000, Savings 20,000, Surplus 10,000
  const flow = viz.calculateSankeyFlows({
    totalIncome: 100000,
    deductions: 10000,
    needs: 40000,
    wants: 20000,
    savings: 20000,
    remaining: 10000,
    width: 600,
    height: 240,
  });

  assert.equal(flow.hasData, true);
  assert.equal(flow.isDeficit, false);
  assert.equal(flow.deficitAmount, 0);

  // Stage 1 Gross node
  const grossNode = flow.nodes.find((n) => n.id === 'gross');
  assert.ok(grossNode);
  assert.equal(grossNode.value, 100000);

  // Stage 2 Intermediate nodes
  const dedNode = flow.nodes.find((n) => n.id === 'deductions');
  const takeHomeNode = flow.nodes.find((n) => n.id === 'takeHome');
  assert.equal(dedNode.value, 10000);
  assert.equal(takeHomeNode.value, 90000);

  // Stage 3 Terminal destination nodes
  const needsNode = flow.nodes.find((n) => n.id === 'needs');
  const wantsNode = flow.nodes.find((n) => n.id === 'wants');
  const savingsNode = flow.nodes.find((n) => n.id === 'savings');
  const surplusNode = flow.nodes.find((n) => n.id === 'surplus');
  assert.equal(needsNode.value, 40000);
  assert.equal(wantsNode.value, 20000);
  assert.equal(savingsNode.value, 20000);
  assert.equal(surplusNode.value, 10000);

  // Verify Links
  const grossToDed = flow.links.find((l) => l.source === 'gross' && l.target === 'deductions');
  const grossToTakeHome = flow.links.find((l) => l.source === 'gross' && l.target === 'takeHome');
  assert.ok(grossToDed);
  assert.ok(grossToTakeHome);
  assert.equal(grossToDed.value, 10000);
  assert.equal(grossToTakeHome.value, 90000);
});

test('CashflowViz.calculateSankeyFlows flags deficit scenarios accurately', () => {
  const viz = loadCashflowViz();
  const deficitFlow = viz.calculateSankeyFlows({
    totalIncome: 30000,
    deductions: 3000,
    needs: 25000,
    wants: 10000,
    savings: 0,
    remaining: -8000,
  });

  assert.equal(deficitFlow.isDeficit, true);
  assert.equal(deficitFlow.deficitAmount, 8000);
});
