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

describe('Foreign Investment & Crypto Repatriation Tax Advisor (Orders P.161/2566 & P.162/2566) - Phase 63', () => {
  const { MoneyApp } = createEnvironment();
  const { calculateForeignRepatriationTax } = MoneyApp;

  it('correctly grants 100% tax exemption for Non-Residents (< 180 days in Thailand)', () => {
    // 2,000,000 THB remitted, but stayed in Thailand only 120 days
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 2000000,
      daysInThailand: 120,
      otherTaxableNetIncome: 500000,
    });
    assert.equal(res.isTaxResident, false);
    assert.equal(res.isExempt, true);
    assert.equal(res.taxableRemittance, 0);
    assert.equal(res.netThaiTaxPayable, 0);
    assert.equal(res.exemptionReason, 'non_resident_under_180_days');
  });

  it('correctly grants 100% Grandfathering exemption for pre-2024 earnings (Order P.162/2566)', () => {
    // 3,000,000 THB remitted, all derived before 1 Jan 2024
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 3000000,
      pre2024AccumulatedAmount: 3000000,
      daysInThailand: 200,
      otherTaxableNetIncome: 800000,
    });
    assert.equal(res.isTaxResident, true);
    assert.equal(res.pre2024ExemptAmount, 3000000);
    assert.equal(res.taxableRemittance, 0);
    assert.equal(res.netThaiTaxPayable, 0);
    assert.equal(res.isExempt, true);
    assert.equal(res.exemptionReason, 'pre_2024_grandfathered');
  });

  it('correctly calculates Thai PIT on post-2024 remitted foreign gains under Order P.161/2566', () => {
    // 1,000,000 THB remitted post-2024, other income = 500,000 (tax bracket starts at 15%)
    // Base PIT on 500k = 27,500 THB
    // Total PIT on 1.5M (500k + 1M) = 150k*0% + 150k*5%(7.5k) + 200k*10%(20k) + 250k*15%(37.5k) + 250k*20%(50k) + 500k*25%(125k) = 240,000 THB
    // Tax on remittance = 240,000 - 27,500 = 212,500 THB
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 1000000,
      pre2024AccumulatedAmount: 0,
      principalCapitalAmount: 0,
      daysInThailand: 250,
      otherTaxableNetIncome: 500000,
    });
    assert.equal(res.isTaxResident, true);
    assert.equal(res.taxableRemittance, 1000000);
    assert.equal(res.grossThaiTaxOnRemittance, 212500);
    assert.equal(res.netThaiTaxPayable, 212500);
    assert.equal(res.effectiveTaxRatePct, 21.25);
  });

  it('correctly deducts original principal capital from taxable assessable income', () => {
    // Remitted 2,000,000 THB total, where 1,500,000 was original capital principal and 500,000 was capital gains
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 2000000,
      principalCapitalAmount: 1500000,
      daysInThailand: 200,
      otherTaxableNetIncome: 300000,
    });
    assert.equal(res.capitalPrincipalExemptAmount, 1500000);
    assert.equal(res.taxableRemittance, 500000);
  });

  it('correctly credits DTA Foreign Tax Credit (FTC) to prevent double taxation', () => {
    // 500,000 THB dividend remittance with 75,000 THB (15%) US withholding tax paid abroad under US-Thai DTA
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 500000,
      foreignTaxPaidThb: 75000,
      daysInThailand: 300,
      otherTaxableNetIncome: 500000,
    });
    // Gross tax on 500k (from 500k to 1M: 250k@15% + 250k@20% = 37.5k + 50k = 87,500 THB)
    assert.equal(res.grossThaiTaxOnRemittance, 87500);
    assert.equal(res.allowableDtaCredit, 75000);
    assert.equal(res.netThaiTaxPayable, 12500); // 87,500 - 75,000
    assert.equal(res.dtaSavings, 75000);
  });

  it('gracefully handles 0, negative, or invalid parameters', () => {
    const resZero = calculateForeignRepatriationTax({ remittanceAmount: 0 });
    assert.equal(resZero.netThaiTaxPayable, 0);
    assert.equal(resZero.taxableRemittance, 0);

    const resNull = calculateForeignRepatriationTax(null);
    assert.equal(resNull.netThaiTaxPayable, 0);
    assert.equal(resNull.taxableRemittance, 0);
  });

  it('correctly accepts parameter aliases and provides backward-compatible return properties', () => {
    // Calling with alias parameters matching UI inputs
    const res = calculateForeignRepatriationTax({
      remittanceAmount: 1000000,
      pre2024Amount: 200000,
      principalAmount: 300000,
      daysInThailand: 200,
      foreignTaxPaid: 50000,
      otherDomesticNetIncome: 500000,
    });

    assert.equal(res.isResident, true);
    assert.equal(res.isTaxResident, true);
    assert.equal(res.totalExemptAmount, 500000); // 200k + 300k
    assert.equal(res.taxableRemittance, 500000); // 1M - 500k
    assert.equal(typeof res.effectiveTaxRate, 'number');
    assert.equal(res.effectiveTaxRate, res.effectiveTaxRatePct);
    assert.equal(res.dtaForeignTaxCredit, res.allowableDtaCredit);
    assert.equal(res.netRetainedInThailand, res.totalNetCashRetained);
    assert.ok(res.effectiveTaxRate >= 0 && res.effectiveTaxRate <= 100);
  });
});
