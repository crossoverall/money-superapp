import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { createContext, Script } from 'node:vm';

function loadRebalanceSubtools() {
  const code = readFileSync(resolve('js/engines/rebalance-subtools.js'), 'utf8');
  const storage = {};
  const sandbox = {
    console,
    Math,
    Number,
    Date,
    parseFloat: Number.parseFloat,
    parseInt: Number.parseInt,
    localStorage: {
      getItem(key) {
        return storage[key] || null;
      },
      setItem(key, val) {
        storage[key] = String(val);
      },
      removeItem(key) {
        delete storage[key];
      },
      clear() {
        for (const k of Object.keys(storage)) delete storage[k];
      },
    },
    MoneyApp: {
      formatMoney: (v) => String(v),
      escapeHtml: (v) => String(v),
      calculateThaiGoldMetrics: (params) => ({
        totalCost: (params.weight || 0) * (params.costPerBaht || 0) + (params.blockFee || 0),
        marketValue: (params.weight || 0) * (params.currentMarketPrice || 0),
        unrealizedGainLoss:
          (params.weight || 0) * (params.currentMarketPrice || 0) -
          ((params.weight || 0) * (params.costPerBaht || 0) + (params.blockFee || 0)),
        unrealizedGainLossPct: 5.0,
        liquidationValue: (params.weight || 0) * (params.currentMarketPrice || 0) * 0.98,
        liquidationGainLoss: 0,
        weightBaht: params.weight || 0,
        weightGrams: (params.weight || 0) * 15.244,
        weightSalung: (params.weight || 0) * 4,
        weightTroyOz: (params.weight || 0) * 0.4901,
        effectiveCostPerBaht: params.costPerBaht || 0,
        breakEvenMarketPrice: params.costPerBaht || 0,
        currentMarketPrice: params.currentMarketPrice || 0,
      }),
      calculateForeignRepatriationTax: (params) => ({
        isResident: params.daysInThailand >= 180,
        taxableRemittance: Math.max(0, params.remittanceAmount - params.pre2024Amount - params.principalAmount),
        totalExemptAmount: Math.min(params.remittanceAmount, params.pre2024Amount + params.principalAmount),
        grossThaiTaxOnRemittance: 25000,
        dtaForeignTaxCredit: 5000,
        netThaiTaxPayable: 20000,
        effectiveTaxRate: 4.0,
        netRetainedInThailand: params.remittanceAmount - 20000,
      }),
      calculateTargetDateGlidepath: (params) => ({
        yearsToRetire: Math.max(0, params.targetRetirementAge - params.currentAge),
        targetYear: 2026 + Math.max(0, params.targetRetirementAge - params.currentAge),
        split: { core: 75, ballast: 20, satellite: 5 },
        phaseNameTh: 'ระยะสะสมความมั่งคั่ง',
        phaseNameEn: 'Wealth Accumulation',
        adviceTh: 'เน้นสินทรัพย์เติบโตสูงเพื่อพลังดอกเบี้ยทบต้น',
        adviceEn: 'Focus on growth assets for compounding.',
        assetBreakdown: {
          coreDescriptionTh: 'หุ้นโลก, หุ้นไทย',
          coreDescriptionEn: 'Global/Thai equities',
          ballastDescriptionTh: 'พันธบัตร, กองทุนตราสารหนี้',
          ballastDescriptionEn: 'Govt bonds, fixed income',
          satelliteDescriptionTh: 'ทองคำ, คริปโต',
          satelliteDescriptionEn: 'Gold, digital assets',
        },
      }),
    },
    window: {},
  };
  sandbox.global = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  new Script(code).runInContext(context);
  return { subtools: sandbox.MoneyApp?.RebalanceSubtools, sandbox };
}

test('RebalanceSubtools engine exports cleanly to MoneyApp namespace', () => {
  const { subtools } = loadRebalanceSubtools();
  assert.ok(subtools, 'RebalanceSubtools should be defined');
  // Gold methods
  assert.equal(typeof subtools.getGoldState, 'function');
  assert.equal(typeof subtools.setGoldState, 'function');
  assert.equal(typeof subtools.loadGoldState, 'function');
  assert.equal(typeof subtools.saveGoldState, 'function');
  assert.equal(typeof subtools.updateGoldCalculator, 'function');
  assert.equal(typeof subtools.setGoldWeightPreset, 'function');
  assert.equal(typeof subtools.syncGoldMarketPrice, 'function');
  assert.equal(typeof subtools.addGoldLotToHistory, 'function');
  assert.equal(typeof subtools.removeGoldLot, 'function');
  assert.equal(typeof subtools.clearGoldLots, 'function');
  assert.equal(typeof subtools.exportGoldToPortfolio, 'function');
  assert.equal(typeof subtools.initGoldCalculator, 'function');

  // Foreign Tax methods
  assert.equal(typeof subtools.getForeignTaxState, 'function');
  assert.equal(typeof subtools.setForeignTaxState, 'function');
  assert.equal(typeof subtools.loadForeignTaxState, 'function');
  assert.equal(typeof subtools.saveForeignTaxState, 'function');
  assert.equal(typeof subtools.setRemittancePreset, 'function');
  assert.equal(typeof subtools.setRemittancePre2024Full, 'function');
  assert.equal(typeof subtools.updateForeignTaxUI, 'function');
  assert.equal(typeof subtools.initForeignTaxAdvisor, 'function');

  // Glidepath methods
  assert.equal(typeof subtools.getGlidepathState, 'function');
  assert.equal(typeof subtools.setGlidepathState, 'function');
  assert.equal(typeof subtools.loadGlidepathState, 'function');
  assert.equal(typeof subtools.saveGlidepathState, 'function');
  assert.equal(typeof subtools.setGlidepathCohortPreset, 'function');
  assert.equal(typeof subtools.calculateGlidepathData, 'function');
  assert.equal(typeof subtools.updateGlidepathUI, 'function');
  assert.equal(typeof subtools.applyGlidepathSplitToPortfolio, 'function');
  assert.equal(typeof subtools.bridgeDcaToBudget, 'function');
  assert.equal(typeof subtools.initTargetDateGlidepath, 'function');
});

test('Thai Gold sub-tool manages state and lot operations accurately', () => {
  const { subtools } = loadRebalanceSubtools();

  subtools.setGoldState({
    goldType: 'bar',
    weightUnit: 'baht',
    weight: 2,
    costPerBaht: 41000,
    blockFee: 150,
    marketPrice: 43000,
    lots: [{ id: 1, weight: 1, costPerBaht: 40000, goldType: 'bar' }],
  });

  const state = subtools.getGoldState();
  assert.equal(state.weight, 2);
  assert.equal(state.marketPrice, 43000);
  assert.equal(state.lots.length, 1);

  // Remove lot
  subtools.removeGoldLot(0);
  assert.equal(subtools.getGoldState().lots.length, 0);

  // Clear lots
  subtools.setGoldState({ lots: [{ id: 2 }, { id: 3 }] });
  assert.equal(subtools.getGoldState().lots.length, 2);
  subtools.clearGoldLots();
  assert.equal(subtools.getGoldState().lots.length, 0);
});

test('Foreign Investment Tax sub-tool manages state persistence and defaults', () => {
  const { subtools, sandbox } = loadRebalanceSubtools();

  subtools.setForeignTaxState({
    remittanceAmount: 800000,
    pre2024Amount: 300000,
    principalAmount: 200000,
    daysInThailand: 210,
    foreignTaxPaid: 15000,
    otherDomesticNetIncome: 600000,
  });

  subtools.saveForeignTaxState();
  const rawSaved = sandbox.localStorage.getItem('money_superapp_foreign_tax_v1');
  assert.ok(rawSaved, 'Should save foreign tax state to localStorage');
  const parsed = JSON.parse(rawSaved);
  assert.equal(parsed.remittanceAmount, 800000);
  assert.equal(parsed.pre2024Amount, 300000);
});

test('Target Date Glidepath sub-tool computes cohort data and lifecycle split', () => {
  const { subtools } = loadRebalanceSubtools();

  subtools.setGlidepathState({
    currentAge: 35,
    retireAge: 60,
    riskTolerance: 'moderate',
  });

  const glideData = subtools.calculateGlidepathData();
  assert.ok(glideData, 'Glidepath data should be computed');
  assert.equal(glideData.yearsToRetire, 25);
  assert.equal(glideData.split.core, 75);
  assert.equal(glideData.split.ballast, 20);
  assert.equal(glideData.split.satellite, 5);
});

test('applyGlidepathSplitToPortfolio updates bucket weights and pushes undo snapshot', () => {
  const { subtools } = loadRebalanceSubtools();

  let snapshotPushed = false;
  let computed = false;
  const mockUndoMgr = {
    push: () => {
      snapshotPushed = true;
    },
  };
  const mockState = {
    buckets: [
      { id: 'core', weight: 50 },
      { id: 'ballast', weight: 30 },
      { id: 'satellite', weight: 20 },
    ],
  };

  subtools.applyGlidepathSplitToPortfolio({
    state: mockState,
    undoMgr: mockUndoMgr,
    captureSnapshot: () => ({ test: true }),
    compute: () => {
      computed = true;
    },
    renderSplit: () => {},
    saveState: () => {},
    updateUndoUI: () => {},
  });

  assert.ok(snapshotPushed, 'Undo snapshot must be captured before updating weights');
  assert.ok(computed, 'Compute must be called after updating weights');
  const core = mockState.buckets.find((b) => b.id === 'core');
  const ballast = mockState.buckets.find((b) => b.id === 'ballast');
  const sat = mockState.buckets.find((b) => b.id === 'satellite');
  assert.equal(core.weight, 75);
  assert.equal(ballast.weight, 20);
  assert.equal(sat.weight, 5);
});
