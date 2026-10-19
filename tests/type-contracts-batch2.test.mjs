import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadBatch2Engines() {
  const sharedCode = readFileSync(resolve(__dirname, '../js/shared.js'), 'utf8');
  const retirementBucketsCode = readFileSync(resolve(__dirname, '../js/engines/retirement-buckets.js'), 'utf8');
  const propertyTaxCode = readFileSync(resolve(__dirname, '../js/engines/property-tax.js'), 'utf8');
  const bankParserCode = readFileSync(resolve(__dirname, '../js/engines/bank-parser.js'), 'utf8');
  const refinanceCode = readFileSync(resolve(__dirname, '../js/engines/refinance.js'), 'utf8');
  const stressTestCode = readFileSync(resolve(__dirname, '../js/engines/stress-test.js'), 'utf8');
  const vaultCryptoCode = readFileSync(resolve(__dirname, '../js/engines/vault-crypto.js'), 'utf8');
  const p2pSyncCode = readFileSync(resolve(__dirname, '../js/engines/p2p-sync.js'), 'utf8');
  const bridgeCode = readFileSync(resolve(__dirname, '../js/engines/bridge.js'), 'utf8');

  const storageMap = new Map();
  const mockStorage = {
    getItem: (k) => (storageMap.has(k) ? storageMap.get(k) : null),
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: (k) => storageMap.delete(k),
    clear: () => storageMap.clear(),
  };

  const mockWindow = {
    addEventListener: () => {},
    document: {
      documentElement: { lang: 'th', dataset: {} },
    },
    localStorage: mockStorage,
    location: { pathname: '/remaining-money.html' },
  };

  const script = [
    sharedCode,
    retirementBucketsCode,
    propertyTaxCode,
    bankParserCode,
    refinanceCode,
    stressTestCode,
    vaultCryptoCode,
    p2pSyncCode,
    bridgeCode,
    'return window.MoneyApp;',
  ].join('\n;\n');

  const fn = new Function('window', 'document', 'localStorage', script);
  const MoneyApp = fn(mockWindow, mockWindow.document, mockWindow.localStorage);
  return MoneyApp;
}

describe('Pillar 6 Type Contracts Verification Suite (Core Engines Batch 2)', () => {
  const MoneyApp = loadBatch2Engines();

  describe('js/engines/retirement-buckets.js Type Contracts', () => {
    it('calculateRetirementThreeBuckets conforms to RetirementThreeBucketsResult schema', () => {
      const res = MoneyApp.calculateRetirementThreeBuckets({
        annualLivingExpense: 480000,
        monthlySsoPension: 5000,
        monthlyElderlyAllowance: 600,
        totalRetirementAssets: 8000000,
        bucket1Years: 2,
        bucket2Years: 5,
      });

      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.annualLivingExpense, 'number');
      assert.strictEqual(typeof res.annualGuaranteedIncome, 'number');
      assert.strictEqual(typeof res.netAnnualDrawdown, 'number');
      assert.strictEqual(typeof res.guaranteedIncomeCoveragePct, 'number');
      assert.strictEqual(typeof res.bucket1Years, 'number');
      assert.strictEqual(typeof res.bucket2Years, 'number');
      assert.strictEqual(typeof res.bucket1Target, 'number');
      assert.strictEqual(typeof res.bucket2Target, 'number');
      assert.strictEqual(typeof res.bucket3Target, 'number');
      assert.strictEqual(typeof res.totalRetirementAssets, 'number');
      assert.strictEqual(typeof res.defensiveNeeds, 'number');
      assert.strictEqual(typeof res.isUnderfunded, 'boolean');
      assert.strictEqual(typeof res.shortfallAmount, 'number');
      assert.strictEqual(typeof res.bearMarketRunwayYears, 'number');
      assert.strictEqual(typeof res.annualYieldCashFlow, 'number');
      assert.strictEqual(typeof res.blendedYieldPct, 'number');
      assert.strictEqual(typeof res.isYieldSelfSustaining, 'boolean');

      assert.strictEqual(res.annualGuaranteedIncome, (5000 + 600) * 12);
      assert.strictEqual(res.defensiveNeeds, res.bucket1Target + res.bucket2Target);
      assert.strictEqual(res.isUnderfunded, false);
    });
  });

  describe('js/engines/property-tax.js Type Contracts', () => {
    it('calculateThaiLandAndBuildingTax conforms to ThaiPropertyTaxResult schema', () => {
      const categories = [
        'agricultural',
        'residential_primary',
        'residential_building_only',
        'residential_secondary',
        'commercial',
        'vacant',
      ];

      for (const cat of categories) {
        const res = MoneyApp.calculateThaiLandAndBuildingTax({
          landCategory: cat,
          appraisalValue: 60000000,
          vacantConsecutiveYears: cat === 'vacant' ? 4 : 0,
        });

        assert.ok(res && typeof res === 'object');
        assert.strictEqual(res.landCategory, cat);
        assert.strictEqual(typeof res.appraisalValue, 'number');
        assert.strictEqual(typeof res.exemptionAmount, 'number');
        assert.strictEqual(typeof res.taxableBase, 'number');
        assert.strictEqual(typeof res.totalTax, 'number');
        assert.strictEqual(typeof res.effectiveRatePct, 'number');
        assert.strictEqual(typeof res.marginalRatePct, 'number');
        assert.ok(Array.isArray(res.tiers));
        assert.strictEqual(typeof res.canInstallment, 'boolean');
        assert.strictEqual(typeof res.installmentMonthly, 'number');
        assert.strictEqual(typeof res.statutoryDeadline, 'string');

        for (const tier of res.tiers) {
          assert.strictEqual(typeof tier.labelTh, 'string');
          assert.strictEqual(typeof tier.labelEn, 'string');
          assert.strictEqual(typeof tier.ratePct, 'number');
          assert.strictEqual(typeof tier.taxableInTier, 'number');
          assert.strictEqual(typeof tier.taxInTier, 'number');
        }
      }
    });
  });

  describe('js/engines/bank-parser.js Type Contracts', () => {
    it('detectAndParseThaiBankStatement conforms to ThaiBankStatementParsedResult schema', () => {
      const invalid = MoneyApp.detectAndParseThaiBankStatement('');
      assert.strictEqual(invalid.isBankStatement, false);

      const kbankCsv = [
        'Date/Time,Transaction,Withdrawal,Deposit,Outstanding Balance,Channel',
        '15/01/2026 10:30,Payroll,,50000.00,120000.00,K PLUS',
        '16/01/2026 12:15,Grab Food,350.00,,119650.00,K PLUS',
        '17/01/2026 19:40,BTS Skytrain,120.00,,119530.00,K PLUS',
      ].join('\n');

      const res = MoneyApp.detectAndParseThaiBankStatement(kbankCsv, 'kbank_statement.csv');
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(res.isBankStatement, true);
      assert.strictEqual(typeof res.bankCode, 'string');
      assert.strictEqual(typeof res.bankName, 'string');
      assert.ok(res.summary && typeof res.summary === 'object');
      assert.strictEqual(typeof res.summary.totalInflow, 'number');
      assert.strictEqual(typeof res.summary.totalOutflow, 'number');
      assert.strictEqual(typeof res.summary.transactionCount, 'number');
      assert.ok(res.candidate && typeof res.candidate === 'object');
      assert.ok(Array.isArray(res.candidate.incomes));
      assert.ok(Array.isArray(res.candidate.expenses));
      assert.ok(Array.isArray(res.transactions));
      assert.strictEqual(res.transactions.length, 3);
    });
  });

  describe('js/engines/refinance.js Type Contracts', () => {
    const testDebts = [
      { id: 'cc1', name: 'Credit Card A', balance: 50000, rate: 16, minPayment: 2500 },
      { id: 'pl1', name: 'Personal Loan B', balance: 100000, rate: 24, minPayment: 4000 },
    ];

    it('simulateDebtPayoff conforms to DebtPayoffSimulationResult schema', () => {
      const res = MoneyApp.simulateDebtPayoff(testDebts, 3000, 'avalanche');
      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.months, 'number');
      assert.strictEqual(typeof res.totalInterest, 'number');
      assert.strictEqual(typeof res.totalPaid, 'number');
      assert.ok(Array.isArray(res.payoffOrder));
      assert.ok(res.firstDebtCleared !== null);
      assert.ok(Array.isArray(res.trajectory));
      assert.ok(res.months > 0);
    });

    it('compareDebtVelocity conforms to DebtVelocityComparisonResult schema', () => {
      const res = MoneyApp.compareDebtVelocity({ debts: testDebts, extraPayment: 3000 });
      assert.ok(res && typeof res === 'object');
      assert.ok(res.baseline && typeof res.baseline === 'object');
      assert.ok(res.avalanche && typeof res.avalanche === 'object');
      assert.ok(res.snowball && typeof res.snowball === 'object');
      assert.strictEqual(typeof res.interestDelta, 'number');
      assert.strictEqual(typeof res.monthDelta, 'number');
      assert.strictEqual(typeof res.firstWinMonthDelta, 'number');
      assert.ok(['avalanche', 'snowball', 'equal'].includes(res.recommended));
      assert.strictEqual(typeof res.reasonTh, 'string');
      assert.strictEqual(typeof res.reasonEn, 'string');
    });

    it('calculateTaxAccrualAndRefundPlan conforms to TaxAccrualPlanResult schema', () => {
      const resPayable = MoneyApp.calculateTaxAccrualAndRefundPlan({ calculatedTax: 30000, withheldTax: 20000 });
      assert.ok(resPayable && typeof resPayable === 'object');
      assert.strictEqual(resPayable.status, 'payable');
      assert.strictEqual(resPayable.amount, 10000);
      assert.strictEqual(typeof resPayable.monthlyAccrual, 'number');
      assert.strictEqual(resPayable.canInstallment, true);

      const resRefund = MoneyApp.calculateTaxAccrualAndRefundPlan({ calculatedTax: 15000, withheldTax: 25000 });
      assert.strictEqual(resRefund.status, 'refund');
      assert.strictEqual(resRefund.amount, 10000);
      assert.strictEqual(resRefund.recommendedWindfall, 10000);
    });

    it('calculateDebtConsolidation conforms to DebtConsolidationResult schema', () => {
      const res = MoneyApp.calculateDebtConsolidation({
        debts: testDebts,
        currentTotalInterest: 25000,
        currentTotalMinPayment: 6500,
        refinanceRate: 9.9,
        refinanceTermMonths: 36,
      });

      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.totalBalance, 'number');
      assert.strictEqual(typeof res.weightedRate, 'number');
      assert.strictEqual(typeof res.refinanceRate, 'number');
      assert.strictEqual(typeof res.refinanceTermMonths, 'number');
      assert.strictEqual(typeof res.newMonthlyPayment, 'number');
      assert.strictEqual(typeof res.totalRefinanceInterest, 'number');
      assert.strictEqual(typeof res.totalRefinancePaid, 'number');
      assert.strictEqual(typeof res.interestSaved, 'number');
      assert.strictEqual(typeof res.monthlyPaymentDiff, 'number');
      assert.ok(['optimal', 'higher_interest', 'faster_payoff', 'no_debt'].includes(res.verdict));
    });
  });

  describe('js/engines/stress-test.js Type Contracts', () => {
    it('calculateIncomeShockStressTest conforms to IncomeShockStressTestResult schema', () => {
      const res = MoneyApp.calculateIncomeShockStressTest({
        liquidReserve: 200000,
        severanceBuffer: 100000,
        monthlyNeeds: 25000,
        monthlyWants: 10000,
        monthlyDebtService: 5000,
        shockType: 'layoff',
      });

      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.totalAvailableLiquidity, 'number');
      assert.strictEqual(typeof res.liquidReserve, 'number');
      assert.strictEqual(typeof res.severanceBuffer, 'number');
      assert.strictEqual(typeof res.barebonesMonthlyExpense, 'number');
      assert.strictEqual(typeof res.standardMonthlyExpense, 'number');
      assert.strictEqual(typeof res.ssoMonthlyBenefit, 'number');
      assert.strictEqual(typeof res.ssoBenefitMonths, 'number');
      assert.ok(res.scenarios && typeof res.scenarios === 'object');
      assert.ok(res.scenarios.barebones && typeof res.scenarios.barebones === 'object');
      assert.ok(res.scenarios.standard && typeof res.scenarios.standard === 'object');
      assert.ok(res.scenarios.withSsoOffset && typeof res.scenarios.withSsoOffset === 'object');
      assert.ok(['safe', 'moderate', 'high_risk', 'critical'].includes(res.riskLevel));
      assert.ok(Array.isArray(res.liquidityLadder));
      assert.strictEqual(res.liquidityLadder.length, 4);
    });

    it('calculateChildEducationFund conforms to ChildEducationFundResult schema', () => {
      const res = MoneyApp.calculateChildEducationFund({
        currentAge: 3,
        targetAge: 18,
        degreeDurationYears: 4,
        educationTrack: 'bilingual',
        existingEducationSavings: 100000,
      });

      assert.ok(res && typeof res === 'object');
      assert.strictEqual(typeof res.currentAge, 'number');
      assert.strictEqual(typeof res.targetAge, 'number');
      assert.strictEqual(typeof res.yearsToCollege, 'number');
      assert.strictEqual(typeof res.degreeDurationYears, 'number');
      assert.strictEqual(typeof res.baseAnnualTuition, 'number');
      assert.strictEqual(typeof res.tuitionInflationRate, 'number');
      assert.strictEqual(typeof res.expectedInvestmentReturn, 'number');
      assert.strictEqual(typeof res.existingSavings, 'number');
      assert.strictEqual(typeof res.fvExistingSavings, 'number');
      assert.strictEqual(typeof res.totalFutureTuitionNeeded, 'number');
      assert.strictEqual(typeof res.netFundShortfall, 'number');
      assert.strictEqual(typeof res.monthlyDcaNeeded, 'number');
      assert.strictEqual(typeof res.fundedRatioPct, 'number');
      assert.ok(Array.isArray(res.yearlyProjections));
      assert.strictEqual(res.yearlyProjections.length, 4);
    });
  });

  describe('js/engines/vault-crypto.js Type Contracts', () => {
    it('generateSalt and formatAppLockTimeout conform to type signatures', () => {
      const salt = MoneyApp.generateSalt(16);
      assert.strictEqual(typeof salt, 'string');
      assert.strictEqual(salt.length, 32); // 16 bytes = 32 hex chars

      const timeoutTh = MoneyApp.formatAppLockTimeout(300, 'th');
      assert.ok(timeoutTh.includes('5 นาที'));

      const timeoutEn = MoneyApp.formatAppLockTimeout(300, 'en');
      assert.ok(timeoutEn.includes('5 minutes'));
    });

    it('hashPin and verifyPin conform to async Promise type contracts', async () => {
      const salt = MoneyApp.generateSalt(16);
      const hash = await MoneyApp.hashPin('123456', salt);
      assert.strictEqual(typeof hash, 'string');
      assert.ok(hash.length > 0);

      const isValid = await MoneyApp.verifyPin('123456', salt, hash);
      assert.strictEqual(isValid, true);

      const isInvalid = await MoneyApp.verifyPin('999999', salt, hash);
      assert.strictEqual(isInvalid, false);
    });
  });

  describe('js/engines/p2p-sync.js Type Contracts', () => {
    it('renderQrSvg conforms to type signature', () => {
      const svg = MoneyApp.renderQrSvg('HELLO MONEY SUPERAPP', { size: 128, margin: 2 });
      assert.strictEqual(typeof svg, 'string');
      assert.ok(svg.includes('<svg'));
      assert.ok(svg.includes('</svg>'));
    });

    it('chunkPayload and assembleChunks conform to P2PPayloadChunk and P2PAssemblyResult schemas', () => {
      const payload = JSON.stringify({
        app: 'money-superapp',
        accounts: [1, 2, 3, 4, 5],
        note: 'P2P Offline Encrypted Sync Chunk Verification Test String For Multi-Frame Generation',
      });
      const chunks = MoneyApp.chunkPayload(payload, 50, 'test_tx');

      assert.ok(Array.isArray(chunks));
      assert.ok(chunks.length >= 2);
      for (const ch of chunks) {
        assert.strictEqual(typeof ch.c, 'number');
        assert.strictEqual(typeof ch.t, 'number');
        assert.strictEqual(typeof ch.d, 'string');
        assert.strictEqual(ch.id, 'test_tx');
      }

      const assembly = MoneyApp.assembleChunks(chunks);
      assert.ok(assembly && typeof assembly === 'object');
      assert.strictEqual(assembly.complete, true);
      assert.strictEqual(assembly.received, chunks.length);
      assert.strictEqual(assembly.total, chunks.length);
      assert.deepStrictEqual(assembly.missing, []);
      assert.strictEqual(assembly.payload, payload);
    });
  });

  describe('js/engines/bridge.js Type Contracts', () => {
    it('Bridge API conforms to BridgeEnvelope and BridgePeekResult schemas', () => {
      assert.strictEqual(typeof MoneyApp.Bridge, 'object');
      assert.strictEqual(typeof MoneyApp.Bridge.send, 'function');
      assert.strictEqual(typeof MoneyApp.Bridge.peek, 'function');
      assert.strictEqual(typeof MoneyApp.Bridge.receive, 'function');
      assert.strictEqual(typeof MoneyApp.Bridge.clear, 'function');

      const envelope = MoneyApp.Bridge.send('rebalance', 'budget', { amount: 15000 }, { source: 'remaining-money' });
      assert.ok(envelope && typeof envelope === 'object');
      assert.strictEqual(envelope.version, 1);
      assert.strictEqual(envelope.source, 'remaining-money');
      assert.strictEqual(envelope.target, 'rebalance');
      assert.strictEqual(envelope.action, 'budget');
      assert.deepStrictEqual(envelope.payload, { amount: 15000 });
      assert.strictEqual(typeof envelope.timestamp, 'number');

      const peeked = MoneyApp.Bridge.peek('budget', { target: 'rebalance' });
      assert.ok(peeked && typeof peeked === 'object');
      assert.deepStrictEqual(peeked.payload, { amount: 15000 });
      assert.strictEqual(peeked.envelope.target, 'rebalance');

      let receivedPayload = null;
      const consumed = MoneyApp.Bridge.receive(
        'budget',
        (payload) => {
          receivedPayload = payload;
        },
        { target: 'rebalance' },
      );

      assert.strictEqual(consumed, true);
      assert.deepStrictEqual(receivedPayload, { amount: 15000 });

      // After consume, peek should be null
      const peekedAfter = MoneyApp.Bridge.peek('budget', { target: 'rebalance' });
      assert.strictEqual(peekedAfter, null);
    });
  });
});
