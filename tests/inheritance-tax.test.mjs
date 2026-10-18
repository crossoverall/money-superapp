import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
const engineCode = readFileSync(resolve(__dirname, '../js/engines/inheritance-tax.js'), 'utf8');

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
    `${engineCode}; ${sharedCode}; return window.MoneyApp;`,
  );
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return { MoneyApp };
}

describe('Thai Inheritance & Annual Gift Tax Calculator (Phase 58)', () => {
  const { MoneyApp } = createEnvironment();
  const { calculateThaiInheritanceAndGiftTax } = MoneyApp;

  it('calculates zero inheritance tax when estate is within 100M THB exemption for children', () => {
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 80000000,
      heirRelationship: 'ascendant_descendant',
      numberOfHeirs: 1,
    });

    assert.equal(res.estateValue, 80000000);
    assert.equal(res.portionPerHeir, 80000000);
    assert.equal(res.exemptionPerHeir, 80000000);
    assert.equal(res.taxablePerHeir, 0);
    assert.equal(res.taxRate, 0.05);
    assert.equal(res.totalInheritanceTax, 0);
    assert.equal(res.netLegacyReceived, 80000000);
  });

  it('calculates 5% inheritance tax on excess above 100M THB for ascendants/descendants', () => {
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 160000000,
      heirRelationship: 'ascendant_descendant',
      numberOfHeirs: 1,
    });

    assert.equal(res.portionPerHeir, 160000000);
    assert.equal(res.exemptionPerHeir, 100000000);
    assert.equal(res.taxablePerHeir, 60000000);
    assert.equal(res.taxRate, 0.05);
    assert.equal(res.taxPerHeir, 3000000); // 60M * 5% = 3,000,000 THB
    assert.equal(res.totalInheritanceTax, 3000000);
    assert.equal(res.netLegacyReceived, 157000000);
  });

  it('guarantees 100% tax exemption for legally registered spouse', () => {
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 500000000,
      heirRelationship: 'spouse',
      numberOfHeirs: 1,
    });

    assert.equal(res.portionPerHeir, 500000000);
    assert.equal(res.exemptionPerHeir, 500000000);
    assert.equal(res.taxablePerHeir, 0);
    assert.equal(res.taxRate, 0);
    assert.equal(res.totalInheritanceTax, 0);
    assert.equal(res.netLegacyReceived, 500000000);
  });

  it('calculates 10% inheritance tax on excess above 100M THB for other beneficiaries', () => {
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 150000000,
      heirRelationship: 'other',
      numberOfHeirs: 1,
    });

    assert.equal(res.portionPerHeir, 150000000);
    assert.equal(res.exemptionPerHeir, 100000000);
    assert.equal(res.taxablePerHeir, 50000000);
    assert.equal(res.taxRate, 0.1);
    assert.equal(res.taxPerHeir, 5000000); // 50M * 10% = 5,000,000 THB
    assert.equal(res.totalInheritanceTax, 5000000);
    assert.equal(res.netLegacyReceived, 145000000);
  });

  it('correctly calculates per-heir statutory exemptions when multiple co-heirs share estate', () => {
    // 250M THB divided among 2 children = 125M each
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 250000000,
      heirRelationship: 'ascendant_descendant',
      numberOfHeirs: 2,
    });

    assert.equal(res.portionPerHeir, 125000000);
    assert.equal(res.exemptionPerHeir, 100000000);
    assert.equal(res.taxablePerHeir, 25000000);
    assert.equal(res.taxPerHeir, 1250000); // 25M * 5% = 1.25M
    assert.equal(res.totalInheritanceTax, 2500000); // 1.25M * 2 = 2.5M
    assert.equal(res.netLegacyReceived, 247500000);
  });

  it('calculates annual gift tax under Sections 42(26), 42(27), and 42(28)', () => {
    // Family movable gift: 25M THB (20M exempt, 5M excess * 5% = 250k tax)
    const giftFamily = calculateThaiInheritanceAndGiftTax({
      annualGiftValue: 25000000,
      giftType: 'family_movable',
    });
    assert.equal(giftFamily.annualGiftExemption, 20000000);
    assert.equal(giftFamily.taxableAnnualGift, 5000000);
    assert.equal(giftFamily.annualGiftTax, 250000);
    assert.equal(giftFamily.netAnnualGift, 24750000);

    // Other / customary gift: 15M THB (10M exempt, 5M excess * 5% = 250k tax)
    const giftOther = calculateThaiInheritanceAndGiftTax({
      annualGiftValue: 15000000,
      giftType: 'other_customary',
    });
    assert.equal(giftOther.annualGiftExemption, 10000000);
    assert.equal(giftOther.taxableAnnualGift, 5000000);
    assert.equal(giftOther.annualGiftTax, 250000);
    assert.equal(giftOther.netAnnualGift, 14750000);
  });

  it('optimizes phased lifetime gifting strategy to eliminate inheritance tax', () => {
    // 160M THB estate transferred to 1 child over 3 years:
    // Strategy A (Inheritance upon death): 3,000,000 THB tax.
    // Strategy B (Gift 20M/yr * 3 yrs = 60M tax-free, residual 100M tax-free): 0 THB tax.
    const res = calculateThaiInheritanceAndGiftTax({
      estateValue: 160000000,
      heirRelationship: 'ascendant_descendant',
      numberOfHeirs: 1,
      giftingYears: 3,
    });

    assert.equal(res.totalInheritanceTax, 3000000);
    assert.equal(res.plannedLifetimeGifts, 60000000);
    assert.equal(res.residualEstateForInheritance, 100000000);
    assert.equal(res.strategyTaxOnResidual, 0);
    assert.equal(res.strategyTaxSavings, 3000000); // 100% tax savings!
    assert.equal(res.strategyTaxSavingsPct, 100);
  });

  it('gracefully handles empty, negative, or invalid inputs', () => {
    const res = calculateThaiInheritanceAndGiftTax({});
    assert.equal(res.estateValue, 0);
    assert.equal(res.totalInheritanceTax, 0);
    assert.equal(res.netLegacyReceived, 0);
    assert.equal(res.annualGiftTax, 0);
    assert.equal(res.strategyTaxSavings, 0);
  });
});
