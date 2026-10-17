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

describe('MoneyApp.calculateThaiGoldMetrics (Thai Gold Bar & Jewelry DCA)', () => {
  const { MoneyApp } = createEnvironment();

  it('correctly calculates Thai 96.5% Gold Bar weight conversions and P/L', () => {
    // 1 Baht Gold Bar at 40,000 THB, block fee 150 THB. Current market sell 42,000 THB.
    const result = MoneyApp.calculateThaiGoldMetrics({
      goldType: 'bar',
      weightUnit: 'baht',
      weight: 1,
      costPerBaht: 40000,
      blockFee: 150,
      currentMarketPrice: 42000,
    });

    assert.equal(result.goldType, 'bar');
    assert.equal(result.weightBaht, 1);
    assert.equal(result.weightGrams, 15.24); // 15.244 rounded
    assert.equal(result.weightSalung, 4);
    assert.equal(result.gramsPerBaht, 15.244);
    assert.equal(result.totalCost, 40150);
    assert.equal(result.effectiveCostPerBaht, 40150);
    assert.equal(result.marketValue, 42000);
    assert.equal(result.unrealizedGainLoss, 1850);
    assert.equal(result.unrealizedGainLossPct, 4.6);
    // Automatic 100 THB buyback spread
    assert.equal(result.currentBuybackPrice, 41900);
    assert.equal(result.liquidationValue, 41900);
    assert.equal(result.liquidationGainLoss, 1750);
    assert.equal(result.liquidationGainLossPct, 4.4);
    assert.equal(result.breakEvenMarketPrice, 40150);
  });

  it('correctly calculates Thai 96.5% Gold Jewelry weight conversions and craft fee', () => {
    // 2 Salung (0.5 Baht) Gold Jewelry at 42,000 THB, craft fee 1,200 THB. Current market 44,000 THB.
    const result = MoneyApp.calculateThaiGoldMetrics({
      goldType: 'jewelry',
      weightUnit: 'salung',
      weight: 2,
      costPerBaht: 42000,
      blockFee: 1200,
      currentMarketPrice: 44000,
    });

    assert.equal(result.goldType, 'jewelry');
    assert.equal(result.weightBaht, 0.5);
    assert.equal(result.weightGrams, 7.58); // 0.5 * 15.16
    assert.equal(result.weightSalung, 2);
    assert.equal(result.gramsPerBaht, 15.16);
    assert.equal(result.totalCost, 22200); // (0.5 * 42000) + 1200
    assert.equal(result.effectiveCostPerBaht, 44400); // 22200 / 0.5
    assert.equal(result.marketValue, 22000); // 0.5 * 44000
    assert.equal(result.unrealizedGainLoss, -200);
    assert.equal(result.unrealizedGainLossPct, -0.9);
  });

  it('correctly converts weight in Grams to Baht weight', () => {
    // 30.488 grams of 96.5% Gold Bar = exactly 2.0 baht
    const result = MoneyApp.calculateThaiGoldMetrics({
      goldType: 'bar',
      weightUnit: 'gram',
      weight: 30.488,
      costPerBaht: 41000,
      currentMarketPrice: 43000,
    });

    assert.equal(result.weightBaht, 2);
    assert.equal(result.weightSalung, 8);
    assert.equal(result.totalCost, 82000);
    assert.equal(result.marketValue, 86000);
    assert.equal(result.unrealizedGainLoss, 4000);
  });

  it('correctly aggregates multi-tranche DCA purchases with weighted average cost basis', () => {
    // Tranche 1: 1 baht at 38,000 THB (fee 100) -> 38,100 THB
    // Tranche 2: 2 baht at 41,000 THB (fee 200) -> 82,200 THB
    // Total: 3 baht. Total Cost = 120,300 THB. Average cost/baht = 40,100 THB.
    const tranches = [
      { date: '2026-01-15', goldType: 'bar', weightUnit: 'baht', weight: 1, costPerBaht: 38000, blockFee: 100 },
      { date: '2026-05-20', goldType: 'bar', weightUnit: 'baht', weight: 2, costPerBaht: 41000, blockFee: 200 },
    ];

    const result = MoneyApp.calculateThaiGoldMetrics({
      tranches,
      currentMarketPrice: 43000,
    });

    assert.equal(result.weightBaht, 3);
    assert.equal(result.weightGrams, 45.73); // 3 * 15.244 rounded
    assert.equal(result.totalCost, 120300);
    assert.equal(result.effectiveCostPerBaht, 40100);
    assert.equal(result.marketValue, 129000); // 3 * 43,000
    assert.equal(result.unrealizedGainLoss, 8700);
    assert.equal(result.unrealizedGainLossPct, 7.2);
    assert.equal(result.processedTranches.length, 2);
  });

  it('handles explicit buyback price correctly', () => {
    const result = MoneyApp.calculateThaiGoldMetrics({
      goldType: 'bar',
      weight: 1,
      costPerBaht: 40000,
      currentMarketPrice: 42000,
      currentBuybackPrice: 41850, // Custom shop quote
    });

    assert.equal(result.currentBuybackPrice, 41850);
    assert.equal(result.liquidationValue, 41850);
    assert.equal(result.liquidationGainLoss, 1850);
  });

  it('defensively handles zeroes, nulls, and negative inputs', () => {
    const result = MoneyApp.calculateThaiGoldMetrics({});
    assert.equal(result.weightBaht, 0);
    assert.equal(result.weightGrams, 0);
    assert.equal(result.totalCost, 0);
    assert.equal(result.effectiveCostPerBaht, 0);
    assert.equal(result.marketValue, 0);
    assert.equal(result.unrealizedGainLoss, 0);
    assert.equal(result.unrealizedGainLossPct, 0);
  });
});
