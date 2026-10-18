import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
const insuranceCode = readFileSync(resolve(__dirname, '../js/engines/insurance.js'), 'utf8');

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

  const fn = new Function(
    'window',
    'document',
    'localStorage',
    `${insuranceCode}; ${sharedCode}; return window.MoneyApp;`,
  );
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp };
}

describe('MoneyApp.calculateInsuranceAdequacy (Capital Needs & HLV)', () => {
  const { MoneyApp } = createEnvironment();

  it('correctly calculates capital needs and severe protection shortfall (<50% covered)', () => {
    // Scenario: High debt (2M), living expense 30k/mo for 10 yrs, child fund 500k, emergency 200k.
    // Total Needs = 2,000,000 + (30,000 * 12 * 10) + 500,000 + 200,000 = 6,300,000 THB.
    // Existing Resources = 500,000 liquid + 1,000,000 existing policy = 1,500,000 THB.
    // Gap = 4,800,000 THB. Adequacy = (1,500,000 / 6,300,000) * 100 = 23.8%.
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: 2000000,
      monthlyExpenses: 30000,
      supportYears: 10,
      childEducation: 500000,
      emergencyCushion: 200000,
      liquidAssets: 500000,
      existingCoverage: 1000000,
      annualIncome: 600000,
      marginalTaxRate: 15,
    });

    assert.equal(result.livingNeeds, 3600000);
    assert.equal(result.totalCapitalNeeds, 6300000);
    assert.equal(result.totalExistingResources, 1500000);
    assert.equal(result.protectionGap, 4800000);
    assert.equal(result.surplus, 0);
    assert.equal(result.adequacyRatio, 23.8);
    assert.equal(result.status, 'severe_shortfall');
    assert.equal(result.hlvBenchmark, 4200000); // 7x 600k
    assert.equal(result.deductibleAmount, 72000); // min(4,800,000 * 0.015 = 72,000, 100,000)
    assert.equal(result.potentialTaxSavings, 10800); // 72,000 * 15%
  });

  it('correctly handles moderate shortfall (50% to 99% covered)', () => {
    // Total Needs = 4,000,000 THB.
    // Resources = 1,000,000 liquid + 2,000,000 coverage = 3,000,000 THB (75%).
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: 1000000,
      monthlyExpenses: 20000,
      supportYears: 10, // 2,400,000
      childEducation: 400000,
      emergencyCushion: 200000,
      liquidAssets: 1000000,
      existingCoverage: 2000000,
      annualIncome: 500000,
      marginalTaxRate: 10,
    });

    assert.equal(result.totalCapitalNeeds, 4000000);
    assert.equal(result.totalExistingResources, 3000000);
    assert.equal(result.protectionGap, 1000000);
    assert.equal(result.adequacyRatio, 75);
    assert.equal(result.status, 'shortfall');
    assert.equal(result.deductibleAmount, 15000); // 1,000,000 * 0.015 = 15,000
    assert.equal(result.potentialTaxSavings, 1500); // 15,000 * 10%
  });

  it('correctly detects optimal coverage (100% to 130% covered)', () => {
    // Total Needs = 3,000,000 THB.
    // Existing = 1,000,000 liquid + 2,200,000 coverage = 3,200,000 THB (106.7%).
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: 500000,
      monthlyExpenses: 20000,
      supportYears: 10,
      childEducation: 0,
      emergencyCushion: 100000,
      liquidAssets: 1000000,
      existingCoverage: 2200000,
      annualIncome: 480000,
      marginalTaxRate: 10,
    });

    assert.equal(result.totalCapitalNeeds, 3000000);
    assert.equal(result.totalExistingResources, 3200000);
    assert.equal(result.protectionGap, 0);
    assert.equal(result.surplus, 200000);
    assert.equal(result.adequacyRatio, 106.7);
    assert.equal(result.status, 'optimal');
    assert.equal(result.potentialTaxSavings, 0);
  });

  it('correctly identifies surplus protection (>130% covered)', () => {
    // Total Needs = 2,000,000 THB.
    // Resources = 2,000,000 liquid + 2,000,000 coverage = 4,000,000 THB (200%).
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: 0,
      monthlyExpenses: 15000,
      supportYears: 10, // 1,800,000
      childEducation: 0,
      emergencyCushion: 200000,
      liquidAssets: 2000000,
      existingCoverage: 2000000,
      annualIncome: 400000,
      marginalTaxRate: 5,
    });

    assert.equal(result.protectionGap, 0);
    assert.equal(result.surplus, 2000000);
    assert.equal(result.adequacyRatio, 200);
    assert.equal(result.status, 'surplus');
  });

  it('gracefully handles zero debt, zero living expenses, and edge cases', () => {
    const result = MoneyApp.calculateInsuranceAdequacy({});
    assert.equal(result.totalCapitalNeeds, 0);
    assert.equal(result.totalExistingResources, 0);
    assert.equal(result.protectionGap, 0);
    assert.equal(result.surplus, 0);
    assert.equal(result.adequacyRatio, 100);
    assert.equal(result.status, 'adequate');
    assert.equal(result.hlvBenchmark, 0);
    assert.equal(result.potentialTaxSavings, 0);
  });

  it('caps statutory PIT life insurance deduction at 100,000 THB', () => {
    // Enormous gap: 10,000,000 THB. Premium ~ 150,000 THB.
    // Statutory max deduction in Thailand is 100,000 THB.
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: 10000000,
      monthlyExpenses: 50000,
      supportYears: 10,
      liquidAssets: 0,
      existingCoverage: 0,
      annualIncome: 1200000,
      marginalTaxRate: 20,
    });

    assert.ok(result.estimatedAnnualPremium > 100000);
    assert.equal(result.deductibleAmount, 100000);
    assert.equal(result.potentialTaxSavings, 20000); // 100,000 * 20%
  });

  it('handles negative or invalid string input values defensively', () => {
    const result = MoneyApp.calculateInsuranceAdequacy({
      debtClearance: '-500000',
      monthlyExpenses: 'abc',
      supportYears: -5,
      childEducation: null,
      emergencyCushion: undefined,
      liquidAssets: '100,000',
      existingCoverage: '200,000',
    });

    assert.equal(result.debtClearance, 0);
    assert.equal(result.monthlyExpenses, 0);
    assert.equal(result.supportYears, 0);
    assert.equal(result.liquidAssets, 100000);
    assert.equal(result.existingCoverage, 200000);
    assert.equal(result.totalExistingResources, 300000);
  });
});
