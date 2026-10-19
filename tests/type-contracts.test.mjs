import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadBatch1Engines() {
  const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
  const thaiPitCode = readFileSync(resolve(__dirname, '../js/engines/thai-pit.js'), 'utf8');
  const thaiTaxCalendarCode = readFileSync(resolve(__dirname, '../js/engines/thai-tax-calendar.js'), 'utf8');
  const insuranceCode = readFileSync(resolve(__dirname, '../js/engines/insurance.js'), 'utf8');
  const goldCode = readFileSync(resolve(__dirname, '../js/engines/gold.js'), 'utf8');
  const foreignTaxCode = readFileSync(resolve(__dirname, '../js/engines/foreign-tax.js'), 'utf8');
  const inheritanceTaxCode = readFileSync(resolve(__dirname, '../js/engines/inheritance-tax.js'), 'utf8');
  const glidepathCode = readFileSync(resolve(__dirname, '../js/engines/glidepath.js'), 'utf8');

  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: 'th', dataset: {} },
    },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
  };

  const script = [
    sharedCode,
    thaiPitCode,
    thaiTaxCalendarCode,
    insuranceCode,
    goldCode,
    foreignTaxCode,
    inheritanceTaxCode,
    glidepathCode,
    'return window.MoneyApp;',
  ].join('\n;\n');

  const fn = new Function('window', 'document', 'localStorage', script);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return MoneyApp;
}

describe('Pillar 6 Type Contracts Verification Suite (Core Engines Batch 1)', () => {
  const MoneyApp = loadBatch1Engines();

  describe('js/engines/thai-pit.js Type Contracts', () => {
    it('computeThaiPitTax conforms to contract signature (number -> integer number)', () => {
      assert.strictEqual(typeof MoneyApp.computeThaiPitTax, 'function');
      assert.strictEqual(MoneyApp.computeThaiPitTax(0), 0);
      assert.strictEqual(MoneyApp.computeThaiPitTax(150000), 0);
      assert.strictEqual(MoneyApp.computeThaiPitTax(300000), 7500);
      assert.strictEqual(MoneyApp.computeThaiPitTax(500000), 27500);
      assert.strictEqual(MoneyApp.computeThaiPitTax('300,000'), 7500);
      assert.strictEqual(MoneyApp.computeThaiPitTax(-50000), 0);
      assert.strictEqual(MoneyApp.computeThaiPitTax(NaN), 0);
    });

    it('calculateTaxBracketStepDown conforms to ThaiPITBracketStepDownResult schema', () => {
      const res = MoneyApp.calculateTaxBracketStepDown(650000);
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.netTaxableIncome, 'number');
      assert.strictEqual(typeof res.currentRate, 'number');
      assert.strictEqual(typeof res.currentRatePct, 'number');
      assert.strictEqual(typeof res.currentTierIndex, 'number');
      assert.strictEqual(typeof res.isTaxFree, 'boolean');
      assert.strictEqual(typeof res.lowerThreshold, 'number');
      assert.strictEqual(typeof res.nextLowerRate, 'number');
      assert.strictEqual(typeof res.nextLowerRatePct, 'number');
      assert.strictEqual(typeof res.amountToStepDown, 'number');
      assert.strictEqual(typeof res.taxSavedAtStepDown, 'number');
      assert.strictEqual(typeof res.stepDownRoiPct, 'number');
      assert.strictEqual(typeof res.amountToTaxFree, 'number');
      assert.strictEqual(typeof res.taxSavedToTaxFree, 'number');
      assert.strictEqual(typeof res.progressInCurrentTierPct, 'number');
      assert.strictEqual(typeof res.totalCurrentTax, 'number');

      // Verify numerical invariants
      assert.strictEqual(res.currentRate, 0.15);
      assert.strictEqual(res.currentRatePct, 15);
      assert.strictEqual(res.lowerThreshold, 500000);
      assert.strictEqual(res.amountToStepDown, 150000);
      assert.strictEqual(res.taxSavedAtStepDown, 22500);
      assert.strictEqual(res.isTaxFree, false);
    });

    it('calculateRetirementCeilingPool conforms to ThaiRetirementPoolResult schema', () => {
      const res = MoneyApp.calculateRetirementCeilingPool({
        pvd: 200000,
        rmf: 200000,
        ssf: 150000,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.pvd, 'number');
      assert.strictEqual(typeof res.rmf, 'number');
      assert.strictEqual(typeof res.ssf, 'number');
      assert.strictEqual(typeof res.gpf, 'number');
      assert.strictEqual(typeof res.nsf, 'number');
      assert.strictEqual(typeof res.pensionInsurance, 'number');
      assert.strictEqual(typeof res.totalRaw, 'number');
      assert.strictEqual(typeof res.effectiveTotal, 'number');
      assert.strictEqual(typeof res.excess, 'number');
      assert.strictEqual(typeof res.headroom, 'number');
      assert.strictEqual(typeof res.utilizationPct, 'number');
      assert.strictEqual(typeof res.status, 'string');
      assert.strictEqual(typeof res.isExceeded, 'boolean');

      assert.strictEqual(res.totalRaw, 550000);
      assert.strictEqual(res.effectiveTotal, 500000);
      assert.strictEqual(res.excess, 50000);
      assert.strictEqual(res.status, 'exceeded');
      assert.strictEqual(res.isExceeded, true);
    });

    it('evaluateEFilingPreFlightChecklist conforms to ThaiEFilingPreFlightChecklistResult schema', () => {
      const res = MoneyApp.evaluateEFilingPreFlightChecklist({
        checks: {
          doc50Tawi: true,
          pool500k: true,
          thaiEsg: true,
          consentRd: true,
          promptPayCitizen: true,
        },
        retirementPool: { isExceeded: false },
      });
      assert.ok(res && typeof res === 'object');
      assert.ok(Array.isArray(res.checklist));
      assert.strictEqual(typeof res.completedCount, 'number');
      assert.strictEqual(typeof res.totalCount, 'number');
      assert.strictEqual(typeof res.completionPct, 'number');
      assert.strictEqual(typeof res.isReady, 'boolean');
      assert.strictEqual(typeof res.hasRetirementExcess, 'boolean');
      assert.strictEqual(res.isReady, true);
      assert.strictEqual(res.completionPct, 100);
    });

    it('calculateThaiEFilingWorksheet conforms to ThaiEFilingWorksheetResult schema', () => {
      const res = MoneyApp.calculateThaiEFilingWorksheet({
        salary: 50000,
        bonus: 100000,
        sso: 9000,
        taxWithheld50Tawi: 30000,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.income401, 'number');
      assert.strictEqual(typeof res.income402, 'number');
      assert.strictEqual(typeof res.income404b, 'number');
      assert.strictEqual(typeof res.dividendCredit, 'number');
      assert.strictEqual(typeof res.totalAssessableIncome, 'number');
      assert.strictEqual(typeof res.statutoryExpenseDeduction, 'number');
      assert.strictEqual(typeof res.incomeAfterExpense, 'number');
      assert.ok(res.deductions && typeof res.deductions === 'object');
      assert.strictEqual(typeof res.deductions.groupA, 'number');
      assert.strictEqual(typeof res.deductions.groupB, 'number');
      assert.strictEqual(typeof res.deductions.groupC, 'number');
      assert.strictEqual(typeof res.deductions.groupD, 'number');
      assert.strictEqual(typeof res.deductions.totalDeductions, 'number');
      assert.strictEqual(typeof res.netTaxableIncome, 'number');
      assert.strictEqual(typeof res.taxBracketPct, 'number');
      assert.strictEqual(typeof res.grossCalculatedTax, 'number');
      assert.strictEqual(typeof res.taxAfterDividendCredit, 'number');
      assert.strictEqual(typeof res.taxWithheld50Tawi, 'number');
      assert.strictEqual(typeof res.netTaxDueOrRefund, 'number');
      assert.strictEqual(typeof res.isRefund, 'boolean');
      assert.strictEqual(typeof res.isPayable, 'boolean');
      assert.strictEqual(typeof res.canInstallment, 'boolean');
      assert.strictEqual(typeof res.installment3Months, 'number');
      assert.ok(res.retirementPool && typeof res.retirementPool === 'object');
      assert.ok(res.thaiEsg && typeof res.thaiEsg === 'object');
    });

    it('evaluateThaiEsgDeduction conforms to ThaiEsgDeductionResult schema', () => {
      const res = MoneyApp.evaluateThaiEsgDeduction(150000, 500000, 2024);
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.effectiveDeduction, 'number');
      assert.strictEqual(typeof res.statutoryCap, 'number');
      assert.strictEqual(typeof res.maxAllowed, 'number');
      assert.strictEqual(typeof res.isExceeded, 'boolean');
      assert.strictEqual(typeof res.excessAmount, 'number');
      assert.strictEqual(typeof res.holdingYears, 'number');
    });

    it('calculateThaiDividendTaxCredit conforms to ThaiDividendTaxCreditResult schema', () => {
      const res = MoneyApp.calculateThaiDividendTaxCredit({
        dividends: 100000,
        corporateTaxRate: 0.2,
        otherTaxableNetIncome: 300000,
        regularTaxWithheld: 7500,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.totalDividends, 'number');
      assert.strictEqual(typeof res.totalDividendWht, 'number');
      assert.strictEqual(typeof res.totalTaxCredit, 'number');
      assert.strictEqual(typeof res.totalGrossedUp, 'number');
      assert.strictEqual(typeof res.otherTaxableNetIncome, 'number');
      assert.strictEqual(typeof res.combinedNetIncome, 'number');
      assert.ok(res.scenarioFinalTax && typeof res.scenarioFinalTax === 'object');
      assert.ok(res.scenarioClaimCredit && typeof res.scenarioClaimCredit === 'object');
      assert.ok(['claim_credit', 'final_tax', 'equivalent'].includes(res.optimalChoice));
      assert.strictEqual(typeof res.netTaxAdvantage, 'number');
      assert.strictEqual(typeof res.isClaimAdvantageous, 'boolean');
      assert.ok(Array.isArray(res.lotsDetail));
    });
  });

  describe('js/engines/thai-tax-calendar.js Type Contracts', () => {
    it('calculateThaiTaxDeadlines conforms to ThaiTaxDeadlinesResult schema', () => {
      const res = MoneyApp.calculateThaiTaxDeadlines(new Date(2026, 0, 15));
      assert.ok(res && typeof res === 'object');
      assert.ok(res.referenceDate instanceof Date);
      assert.ok(res.nextDeadline && typeof res.nextDeadline === 'object');
      assert.strictEqual(typeof res.nextDeadline.id, 'string');
      assert.strictEqual(typeof res.nextDeadline.titleTh, 'string');
      assert.strictEqual(typeof res.nextDeadline.titleEn, 'string');
      assert.strictEqual(typeof res.nextDeadline.descTh, 'string');
      assert.strictEqual(typeof res.nextDeadline.descEn, 'string');
      assert.strictEqual(typeof res.nextDeadline.targetDateTh, 'string');
      assert.strictEqual(typeof res.nextDeadline.targetDateEn, 'string');
      assert.strictEqual(typeof res.nextDeadline.badgeTh, 'string');
      assert.strictEqual(typeof res.nextDeadline.badgeEn, 'string');
      assert.strictEqual(typeof res.nextDeadline.targetYear, 'number');
      assert.ok(res.nextDeadline.targetDate instanceof Date);
      assert.strictEqual(typeof res.nextDeadline.daysRemaining, 'number');
      assert.strictEqual(typeof res.nextDeadline.isPassedThisYear, 'boolean');
      assert.ok(Array.isArray(res.deadlines));
      assert.ok(res.deadlines.length >= 6);
    });
  });

  describe('js/engines/insurance.js Type Contracts', () => {
    it('calculateInsuranceAdequacy conforms to InsuranceAdequacyResult schema', () => {
      const res = MoneyApp.calculateInsuranceAdequacy({
        debtClearance: 1000000,
        monthlyExpenses: 30000,
        supportYears: 10,
        childEducation: 500000,
        emergencyCushion: 200000,
        liquidAssets: 500000,
        existingCoverage: 1000000,
        annualIncome: 600000,
        marginalTaxRate: 15,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.debtClearance, 'number');
      assert.strictEqual(typeof res.livingNeeds, 'number');
      assert.strictEqual(typeof res.monthlyExpenses, 'number');
      assert.strictEqual(typeof res.supportYears, 'number');
      assert.strictEqual(typeof res.childEducation, 'number');
      assert.strictEqual(typeof res.emergencyCushion, 'number');
      assert.strictEqual(typeof res.totalCapitalNeeds, 'number');
      assert.strictEqual(typeof res.liquidAssets, 'number');
      assert.strictEqual(typeof res.existingCoverage, 'number');
      assert.strictEqual(typeof res.totalExistingResources, 'number');
      assert.strictEqual(typeof res.protectionGap, 'number');
      assert.strictEqual(typeof res.surplus, 'number');
      assert.strictEqual(typeof res.adequacyRatio, 'number');
      assert.ok(['severe_shortfall', 'shortfall', 'optimal', 'surplus', 'adequate'].includes(res.status));
      assert.strictEqual(typeof res.hlvBenchmark, 'number');
      assert.strictEqual(typeof res.estimatedAnnualPremium, 'number');
      assert.strictEqual(typeof res.deductibleAmount, 'number');
      assert.strictEqual(typeof res.potentialTaxSavings, 'number');
    });

    it('calculateTermLifePremiumEstimate conforms to TermLifePremiumResult schema', () => {
      const res = MoneyApp.calculateTermLifePremiumEstimate(3800000, {
        ratePerMillion: 3000,
        marginalTaxRate: 15,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.hasShortfall, 'boolean');
      assert.strictEqual(typeof res.coverageGap, 'number');
      assert.strictEqual(typeof res.annualPremium, 'number');
      assert.strictEqual(typeof res.monthlyPremium, 'number');
      assert.strictEqual(typeof res.potentialTaxSavings, 'number');
      assert.strictEqual(typeof res.netAnnualCost, 'number');
      assert.strictEqual(typeof res.netMonthlyCost, 'number');
      assert.strictEqual(typeof res.ratePerMillion, 'number');
      assert.strictEqual(typeof res.marginalTaxRate, 'number');
    });
  });

  describe('js/engines/gold.js Type Contracts', () => {
    it('calculateThaiGoldMetrics conforms to ThaiGoldMetricsResult schema', () => {
      const res = MoneyApp.calculateThaiGoldMetrics({
        goldType: 'bar',
        weightUnit: 'baht',
        weight: 5,
        costPerBaht: 40000,
        blockFee: 500,
        currentMarketPrice: 42000,
        currentBuybackPrice: 41900,
      });
      assert.ok(res && typeof res === 'object');
      assert.ok(['bar', 'jewelry'].includes(res.goldType));
      assert.ok(['baht', 'salung', 'gram'].includes(res.weightUnit));
      assert.strictEqual(typeof res.weightBaht, 'number');
      assert.strictEqual(typeof res.weightGrams, 'number');
      assert.strictEqual(typeof res.weightSalung, 'number');
      assert.strictEqual(typeof res.weightTroyOz, 'number');
      assert.strictEqual(typeof res.gramsPerBaht, 'number');
      assert.strictEqual(typeof res.totalCost, 'number');
      assert.strictEqual(typeof res.effectiveCostPerBaht, 'number');
      assert.strictEqual(typeof res.currentMarketPrice, 'number');
      assert.strictEqual(typeof res.currentBuybackPrice, 'number');
      assert.strictEqual(typeof res.marketValue, 'number');
      assert.strictEqual(typeof res.liquidationValue, 'number');
      assert.strictEqual(typeof res.unrealizedGainLoss, 'number');
      assert.strictEqual(typeof res.unrealizedGainLossPct, 'number');
      assert.strictEqual(typeof res.liquidationGainLoss, 'number');
      assert.strictEqual(typeof res.liquidationGainLossPct, 'number');
      assert.strictEqual(typeof res.breakEvenMarketPrice, 'number');
      assert.strictEqual(typeof res.breakEvenBuybackPrice, 'number');
      assert.ok(Array.isArray(res.processedTranches));
    });
  });

  describe('js/engines/foreign-tax.js Type Contracts', () => {
    it('calculateForeignRepatriationTax conforms to ForeignRepatriationResult schema', () => {
      const res = MoneyApp.calculateForeignRepatriationTax({
        remittanceAmount: 1000000,
        daysInThailand: 200,
        pre2024AccumulatedAmount: 200000,
        principalCapitalAmount: 300000,
        foreignTaxPaidThb: 50000,
        otherTaxableNetIncome: 500000,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.remittanceAmount, 'number');
      assert.strictEqual(typeof res.daysInThailand, 'number');
      assert.strictEqual(typeof res.isTaxResident, 'boolean');
      assert.strictEqual(typeof res.isResident, 'boolean');
      assert.strictEqual(typeof res.isExempt, 'boolean');
      assert.strictEqual(typeof res.exemptionReason, 'string');
      assert.strictEqual(typeof res.pre2024ExemptAmount, 'number');
      assert.strictEqual(typeof res.capitalPrincipalExemptAmount, 'number');
      assert.strictEqual(typeof res.totalExemptAmount, 'number');
      assert.strictEqual(typeof res.taxableRemittance, 'number');
      assert.strictEqual(typeof res.grossThaiTaxOnRemittance, 'number');
      assert.strictEqual(typeof res.allowableDtaCredit, 'number');
      assert.strictEqual(typeof res.dtaForeignTaxCredit, 'number');
      assert.strictEqual(typeof res.netThaiTaxPayable, 'number');
      assert.strictEqual(typeof res.dtaSavings, 'number');
      assert.strictEqual(typeof res.effectiveTaxRatePct, 'number');
      assert.strictEqual(typeof res.effectiveTaxRate, 'number');
      assert.strictEqual(typeof res.totalNetCashRetained, 'number');
      assert.strictEqual(typeof res.netRetainedInThailand, 'number');
    });
  });

  describe('js/engines/inheritance-tax.js Type Contracts', () => {
    it('calculateThaiInheritanceAndGiftTax conforms to ThaiInheritanceAndGiftTaxResult schema', () => {
      const res = MoneyApp.calculateThaiInheritanceAndGiftTax({
        estateValue: 150000000,
        heirRelationship: 'ascendant_descendant',
        numberOfHeirs: 1,
        annualGiftValue: 25000000,
        giftType: 'family_movable',
        giftingYears: 3,
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.estateValue, 'number');
      assert.strictEqual(typeof res.heirRelationship, 'string');
      assert.strictEqual(typeof res.numberOfHeirs, 'number');
      assert.strictEqual(typeof res.portionPerHeir, 'number');
      assert.strictEqual(typeof res.statutoryExemptionPerHeir, 'number');
      assert.strictEqual(typeof res.exemptionPerHeir, 'number');
      assert.strictEqual(typeof res.taxablePerHeir, 'number');
      assert.strictEqual(typeof res.taxRate, 'number');
      assert.strictEqual(typeof res.taxPerHeir, 'number');
      assert.strictEqual(typeof res.totalInheritanceTax, 'number');
      assert.strictEqual(typeof res.netLegacyReceived, 'number');
      assert.strictEqual(typeof res.annualGiftValue, 'number');
      assert.strictEqual(typeof res.giftType, 'string');
      assert.strictEqual(typeof res.annualGiftExemption, 'number');
      assert.strictEqual(typeof res.taxableAnnualGift, 'number');
      assert.strictEqual(typeof res.annualGiftTaxRate, 'number');
      assert.strictEqual(typeof res.annualGiftTax, 'number');
      assert.strictEqual(typeof res.netAnnualGift, 'number');
      assert.strictEqual(typeof res.giftingYears, 'number');
      assert.strictEqual(typeof res.plannedLifetimeGifts, 'number');
      assert.strictEqual(typeof res.residualEstateForInheritance, 'number');
      assert.strictEqual(typeof res.strategyTaxOnResidual, 'number');
      assert.strictEqual(typeof res.strategyTaxSavings, 'number');
      assert.strictEqual(typeof res.strategyTaxSavingsPct, 'number');
    });
  });

  describe('js/engines/glidepath.js Type Contracts', () => {
    it('calculateTargetDateGlidepath conforms to TargetDateGlidepathResult schema', () => {
      const res = MoneyApp.calculateTargetDateGlidepath({
        currentAge: 35,
        targetRetirementAge: 60,
        riskTolerance: 'moderate',
      });
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.currentAge, 'number');
      assert.strictEqual(typeof res.targetRetirementAge, 'number');
      assert.strictEqual(typeof res.yearsToRetire, 'number');
      assert.strictEqual(typeof res.targetYear, 'number');
      assert.strictEqual(typeof res.riskTolerance, 'string');
      assert.ok(res.split && typeof res.split === 'object');
      assert.strictEqual(typeof res.split.core, 'number');
      assert.strictEqual(typeof res.split.ballast, 'number');
      assert.strictEqual(typeof res.split.satellite, 'number');
      assert.strictEqual(res.split.core + res.split.ballast + res.split.satellite, 100);
      assert.strictEqual(typeof res.phaseKey, 'string');
      assert.strictEqual(typeof res.phaseNameTh, 'string');
      assert.strictEqual(typeof res.phaseNameEn, 'string');
      assert.strictEqual(typeof res.adviceTh, 'string');
      assert.strictEqual(typeof res.adviceEn, 'string');
      assert.ok(res.assetBreakdown && typeof res.assetBreakdown === 'object');
      assert.strictEqual(typeof res.assetBreakdown.coreDescriptionTh, 'string');
      assert.strictEqual(typeof res.assetBreakdown.coreDescriptionEn, 'string');
      assert.strictEqual(typeof res.assetBreakdown.ballastDescriptionTh, 'string');
      assert.strictEqual(typeof res.assetBreakdown.ballastDescriptionEn, 'string');
      assert.strictEqual(typeof res.assetBreakdown.satelliteDescriptionTh, 'string');
      assert.strictEqual(typeof res.assetBreakdown.satelliteDescriptionEn, 'string');
    });
  });
});
