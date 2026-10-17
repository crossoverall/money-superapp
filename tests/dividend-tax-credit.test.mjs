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

describe('Thai Stock Dividend Tax Credit Calculator (Section 47 bis) - Phase 60', () => {
  const { MoneyApp } = createEnvironment();
  const { calculateThaiDividendTaxCredit } = MoneyApp;

  it('correctly calculates dividend tax credit for standard 20% CIT Thai corporate rate', () => {
    const res = calculateThaiDividendTaxCredit({
      dividends: 100000,
      corporateTaxRate: 0.2,
      otherTaxableNetIncome: 0,
      regularTaxWithheld: 0,
    });

    assert.equal(res.totalDividends, 100000);
    assert.equal(res.totalDividendWht, 10000); // 10% withholding tax
    assert.equal(res.totalTaxCredit, 25000); // 100,000 * (0.20 / 0.80) = 25,000
    assert.equal(res.totalGrossedUp, 125000);
    assert.equal(res.combinedNetIncome, 125000);
    assert.equal(res.optimalChoice, 'claim_credit');
    assert.equal(res.isClaimAdvantageous, true);
    assert.equal(res.netTaxAdvantage, 35000); // 10k WHT refund + 25k tax credit refund
    assert.equal(res.scenarioClaimCredit.netPayableOrRefund, -35000);
  });

  it('advises Final Tax when taxpayer is in highest 35% personal income tax bracket', () => {
    const res = calculateThaiDividendTaxCredit({
      dividends: 100000,
      corporateTaxRate: 0.2,
      otherTaxableNetIncome: 5000000, // Top 35% bracket
      regularTaxWithheld: 1260000,
    });

    assert.equal(res.totalDividends, 100000);
    assert.equal(res.totalDividendWht, 10000);
    assert.equal(res.totalTaxCredit, 25000);
    assert.equal(res.optimalChoice, 'final_tax');
    assert.equal(res.isClaimAdvantageous, false);
    assert.equal(res.netTaxAdvantage, 8750); // Final tax saves 8,750 THB
  });

  it('handles multi-lot portfolio with different CIT rates including 0% BOI exempt shares', () => {
    const lots = [
      { name: 'PTT', amount: 100000, corporateTaxRate: 0.2 }, // Credit: 25,000, WHT: 10,000
      { name: 'EA (BOI)', amount: 50000, corporateTaxRate: 0 }, // Credit: 0, WHT: 5,000
      { name: 'SME Co', amount: 30000, corporateTaxRate: 0.15 }, // Credit: 30,000 * (0.15/0.85) = 5,294, WHT: 3,000
    ];

    const res = calculateThaiDividendTaxCredit({
      dividends: lots,
      otherTaxableNetIncome: 200000, // 5% bracket
      regularTaxWithheld: 2500,
    });

    assert.equal(res.totalDividends, 180000);
    assert.equal(res.totalDividendWht, 18000);
    assert.equal(res.lotsDetail.length, 3);
    assert.equal(res.lotsDetail[0].taxCredit, 25000);
    assert.equal(res.lotsDetail[1].taxCredit, 0);
    assert.equal(res.lotsDetail[2].taxCredit, 5294);
    assert.equal(res.totalTaxCredit, 30294);
    assert.equal(res.isClaimAdvantageous, true);
    assert.equal(res.optimalChoice, 'claim_credit');
  });

  it('handles zero or negative inputs gracefully without crashing', () => {
    const res = calculateThaiDividendTaxCredit({
      dividends: 0,
      corporateTaxRate: -0.2,
      otherTaxableNetIncome: -50000,
    });

    assert.equal(res.totalDividends, 0);
    assert.equal(res.totalDividendWht, 0);
    assert.equal(res.totalTaxCredit, 0);
    assert.equal(res.totalGrossedUp, 0);
    assert.equal(res.optimalChoice, 'equivalent');
    assert.equal(res.netTaxAdvantage, 0);
  });

  it('correctly calculates breakeven when marginal personal tax rate equals corporate tax rate (20%)', () => {
    // 750,001 - 1,000,000 is 20% bracket
    const res = calculateThaiDividendTaxCredit({
      dividends: 100000,
      corporateTaxRate: 0.2,
      otherTaxableNetIncome: 800000, // Within 20% bracket
      regularTaxWithheld: 75000,
    });

    // When personal tax rate (20%) equals CIT rate (20%), grossed-up income (125k) is taxed at 20% = 25k.
    // Tax credit is 25k. So net tax on dividend in return = 25k - 25k = 0.
    // Total credits also refund 10k WHT!
    // Meanwhile Final Tax costs 10k WHT.
    // Result: Claiming credit still refunds the 10,000 THB withholding tax!
    assert.equal(res.optimalChoice, 'claim_credit');
    assert.equal(res.netTaxAdvantage, 10000);
  });
});
