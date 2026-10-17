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

describe('calculateThaiLandAndBuildingTax (Land & Building Tax Act B.E. 2562)', () => {
  const { MoneyApp } = createEnvironment();
  const { calculateThaiLandAndBuildingTax } = MoneyApp;

  it('correctly calculates Agricultural land tax with 50M THB statutory exemption', () => {
    // Under 50M -> 0 THB tax
    const exemptRes = calculateThaiLandAndBuildingTax({
      landCategory: 'agricultural',
      appraisalValue: 45000000,
    });
    assert.equal(exemptRes.appraisalValue, 45000000);
    assert.equal(exemptRes.exemptionAmount, 50000000);
    assert.equal(exemptRes.taxableBase, 0);
    assert.equal(exemptRes.totalTax, 0);
    assert.equal(exemptRes.effectiveRatePct, 0);

    // 80M -> 50M exempt, 30M taxable in 0-75M bracket (0.01% = 0.0001) -> 3,000 THB
    const excessRes = calculateThaiLandAndBuildingTax({
      landCategory: 'agricultural',
      appraisalValue: 80000000,
    });
    assert.equal(excessRes.exemptionAmount, 50000000);
    assert.equal(excessRes.taxableBase, 30000000);
    assert.equal(excessRes.totalTax, 3000); // 30,000,000 * 0.0001
  });

  it('correctly calculates Primary Residence (Land + Building) with 50M THB exemption', () => {
    // 30M house -> completely exempt
    const resUnder = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_primary',
      appraisalValue: 30000000,
    });
    assert.equal(resUnder.exemptionAmount, 50000000);
    assert.equal(resUnder.taxableBase, 0);
    assert.equal(resUnder.totalTax, 0);

    // 70M house -> 50M exempt, 20M taxable at 0.03% (0.0003) -> 6,000 THB
    const resOver = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_primary',
      appraisalValue: 70000000,
    });
    assert.equal(resOver.taxableBase, 20000000);
    assert.equal(resOver.totalTax, 6000); // 20M * 0.03% = 6,000
    assert.equal(resOver.canInstallment, true); // Tax >= 3,000
    assert.equal(resOver.installmentMonthly, 2000); // 6,000 / 3
  });

  it('correctly calculates Primary Building Only with 10M THB statutory exemption', () => {
    // 8M building -> completely exempt
    const resUnder = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_building_only',
      appraisalValue: 8000000,
    });
    assert.equal(resUnder.exemptionAmount, 10000000);
    assert.equal(resUnder.taxableBase, 0);
    assert.equal(resUnder.totalTax, 0);

    // 25M building -> 10M exempt, 15M taxable at 0.02% (0.0002) -> 3,000 THB
    const resOver = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_building_only',
      appraisalValue: 25000000,
    });
    assert.equal(resOver.taxableBase, 15000000);
    assert.equal(resOver.totalTax, 3000);
    assert.equal(resOver.canInstallment, true);
    assert.equal(resOver.installmentMonthly, 1000);
  });

  it('correctly calculates Secondary Residence / Investment Condo with 0 THB exemption', () => {
    // 5M investment condo -> 0 exemption, taxed from 1st baht at 0.02% -> 1,000 THB
    const res5M = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_secondary',
      appraisalValue: 5000000,
    });
    assert.equal(res5M.exemptionAmount, 0);
    assert.equal(res5M.taxableBase, 5000000);
    assert.equal(res5M.totalTax, 1000); // 5M * 0.02%
    assert.equal(res5M.canInstallment, false); // < 3,000 THB

    // 60M luxury secondary residence -> first 50M at 0.02% (10,000 THB) + 10M at 0.03% (3,000 THB) = 13,000 THB
    const res60M = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_secondary',
      appraisalValue: 60000000,
    });
    assert.equal(res60M.taxableBase, 60000000);
    assert.equal(res60M.totalTax, 13000);
    assert.equal(res60M.canInstallment, true);
    assert.equal(res60M.installmentMonthly, 4333.33);
  });

  it('correctly calculates Commercial property progressive brackets and installments', () => {
    // 30M commercial building -> 0-50M at 0.3% (0.003) -> 90,000 THB
    const resComm = calculateThaiLandAndBuildingTax({
      landCategory: 'commercial',
      appraisalValue: 30000000,
    });
    assert.equal(resComm.exemptionAmount, 0);
    assert.equal(resComm.taxableBase, 30000000);
    assert.equal(resComm.totalTax, 90000); // 30M * 0.3%
    assert.equal(resComm.effectiveRatePct, 0.3);
    assert.equal(resComm.canInstallment, true);
    assert.equal(resComm.installmentMonthly, 30000); // 90,000 / 3
  });

  it('correctly escalates Vacant Land penalty rate after 3+ consecutive years', () => {
    // Year 0 (0-2 years vacant): base commercial rate (0.3% on 10M = 30,000 THB)
    const res0 = calculateThaiLandAndBuildingTax({
      landCategory: 'vacant',
      appraisalValue: 10000000,
      vacantConsecutiveYears: 0,
    });
    assert.equal(res0.totalTax, 30000);
    assert.equal(res0.marginalRatePct, 0.3);

    // Year 3 (3-5 years vacant): +0.3% surcharge -> 0.6% on 10M = 60,000 THB
    const res3 = calculateThaiLandAndBuildingTax({
      landCategory: 'vacant',
      appraisalValue: 10000000,
      vacantConsecutiveYears: 3,
    });
    assert.equal(res3.totalTax, 60000);
    assert.equal(res3.marginalRatePct, 0.6);

    // Year 6 (6-8 years vacant): +0.6% surcharge -> 0.9% on 10M = 90,000 THB
    const res6 = calculateThaiLandAndBuildingTax({
      landCategory: 'vacant',
      appraisalValue: 10000000,
      vacantConsecutiveYears: 6,
    });
    assert.equal(res6.totalTax, 90000);
    assert.equal(res6.marginalRatePct, 0.9);
  });

  it('gracefully handles 0, negative or invalid appraisal inputs', () => {
    const resZero = calculateThaiLandAndBuildingTax({
      landCategory: 'residential_primary',
      appraisalValue: 0,
    });
    assert.equal(resZero.totalTax, 0);
    assert.equal(resZero.taxableBase, 0);

    const resNegative = calculateThaiLandAndBuildingTax({
      landCategory: 'commercial',
      appraisalValue: -500000,
    });
    assert.equal(resNegative.totalTax, 0);
    assert.equal(resNegative.taxableBase, 0);

    const resNull = calculateThaiLandAndBuildingTax(null);
    assert.equal(resNull.totalTax, 0);
    assert.equal(resNull.taxableBase, 0);
  });
});
