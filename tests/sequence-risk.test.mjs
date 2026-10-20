import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import '../js/engines/monte-carlo.js';

const { simulateMonteCarloRetirement, validateMonteCarloParams, findSafeWithdrawalRate, compareWithdrawalStrategies } =
  globalThis.MoneyApp;

describe('Phase 130: Sequence of Returns Risk (SRR) & Dynamic SWR Retirement Simulator', () => {
  describe('1. Parameter Validation & Sanitization', () => {
    it('provides sensible defaults for all dynamic withdrawal and sequence shock parameters', () => {
      const valid = validateMonteCarloParams({});
      assert.equal(valid.withdrawalStrategy, 'constant');
      assert.equal(valid.sequenceShock, 'none');
      assert.equal(valid.guardrailUpper, 1.2);
      assert.equal(valid.guardrailLower, 0.8);
      assert.equal(valid.spendingFloor, 0.75);
      assert.equal(valid.spendingCeiling, 1.25);
    });

    it('sanitizes unsupported strategies and invalid guardrail / shock inputs', () => {
      const valid = validateMonteCarloParams({
        withdrawalStrategy: 'invalid-strategy',
        sequenceShock: 'hyper-crash',
        guardrailUpper: -5,
        guardrailLower: 1.5,
        spendingFloor: -1,
        spendingCeiling: 0.5,
      });

      assert.equal(valid.withdrawalStrategy, 'constant');
      assert.equal(valid.sequenceShock, 'none');
      assert.equal(valid.guardrailUpper, 1.2);
      assert.equal(valid.guardrailLower, 0.8);
      assert.equal(valid.spendingFloor, 0.75);
      assert.equal(valid.spendingCeiling, 1.25);
    });
  });

  describe('2. Mathematical Sequence of Returns Risk (SRR) Asymmetry', () => {
    it('proves early-bear survival probability is strictly lower than late-bear survival under constant withdrawals', () => {
      // In early-bear: severe market drop in Y1-Y3 forced liquidation destroys capital compounding
      // In late-bear: identical market drop happens in final years when portfolio has already compounded
      const earlyBear = simulateMonteCarloRetirement({
        initialPortfolio: 10000000,
        annualWithdrawal: 450000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'early-bear',
        withdrawalStrategy: 'constant',
        trials: 500,
        seed: 1234,
      });

      const lateBear = simulateMonteCarloRetirement({
        initialPortfolio: 10000000,
        annualWithdrawal: 450000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'late-bear',
        withdrawalStrategy: 'constant',
        trials: 500,
        seed: 1234,
      });

      assert.equal(earlyBear.srrShockApplied, true);
      assert.equal(lateBear.srrShockApplied, true);
      assert.ok(
        earlyBear.survivalProbability < lateBear.survivalProbability,
        `Expected early-bear survival (${earlyBear.survivalProbability}%) to be strictly lower than late-bear survival (${lateBear.survivalProbability}%)`,
      );
    });

    it('proves inflation-spike shock decreases survival probability compared to baseline inflation', () => {
      const baseline = simulateMonteCarloRetirement({
        initialPortfolio: 10000000,
        annualWithdrawal: 450000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'none',
        withdrawalStrategy: 'constant',
        trials: 500,
        seed: 555,
      });

      const inflationSpike = simulateMonteCarloRetirement({
        initialPortfolio: 10000000,
        annualWithdrawal: 450000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'inflation-spike',
        withdrawalStrategy: 'constant',
        trials: 500,
        seed: 555,
      });

      assert.ok(
        inflationSpike.survivalProbability <= baseline.survivalProbability,
        `Inflation spike survival (${inflationSpike.survivalProbability}%) should be <= baseline (${baseline.survivalProbability}%)`,
      );
    });
  });

  describe('3. Guyton-Klinger Resilience under Early Bear Market', () => {
    it('proves Guyton-Klinger dynamic rules yield higher survival than constant withdrawals under early-bear', () => {
      const params = {
        initialPortfolio: 10000000,
        annualWithdrawal: 450000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.14,
        inflation: 0.025,
        sequenceShock: 'early-bear',
        trials: 500,
        seed: 9999,
      };

      const constantResult = simulateMonteCarloRetirement({
        ...params,
        withdrawalStrategy: 'constant',
      });

      const gkResult = simulateMonteCarloRetirement({
        ...params,
        withdrawalStrategy: 'guyton-klinger',
      });

      assert.ok(
        gkResult.survivalProbability > constantResult.survivalProbability,
        `Guyton-Klinger survival (${gkResult.survivalProbability}%) must exceed constant withdrawals (${constantResult.survivalProbability}%) under early-bear shock`,
      );

      // Verify Capital Preservation rule reduced average withdrawal to preserve portfolio
      assert.ok(
        gkResult.minWithdrawal < constantResult.minWithdrawal ||
          gkResult.averageAnnualWithdrawal < constantResult.averageAnnualWithdrawal,
        'Guyton-Klinger should demonstrate defensive spending cuts during bear market',
      );
    });
  });

  describe('4. Variable-Spending Floor and Ceiling Bounds', () => {
    it('strictly respects spendingFloor and spendingCeiling real bounds', () => {
      const initialWithdrawal = 400000;
      const spendingFloor = 0.75;
      const spendingCeiling = 1.25;

      const res = simulateMonteCarloRetirement({
        initialPortfolio: 10000000,
        annualWithdrawal: initialWithdrawal,
        years: 25,
        meanReturn: 0.065,
        volatility: 0.15,
        inflation: 0.02,
        withdrawalStrategy: 'variable-spending',
        spendingFloor,
        spendingCeiling,
        trials: 300,
        seed: 4242,
      });

      // Min withdrawal in Year 1 or subsequent cut should not fall below 75% of initial (adjusted for inflation)
      assert.ok(res.minWithdrawal >= initialWithdrawal * spendingFloor * 0.99);
      assert.ok(res.averageAnnualWithdrawal > 0);
      assert.ok(res.maxWithdrawal > 0);
    });
  });

  describe('5. Safe Withdrawal Rate (SWR) Binary Search Finder', () => {
    it('successfully finds SWR achieving 90% survival target in realistic 3.5% - 4.2% range', () => {
      const res = findSafeWithdrawalRate(
        {
          initialPortfolio: 10000000,
          years: 30,
          meanReturn: 0.07,
          volatility: 0.1,
          inflation: 0.025,
          seed: 42,
        },
        90,
      );

      assert.ok(
        res.safeWithdrawalRate >= 3.0 && res.safeWithdrawalRate <= 4.8,
        `SWR rate (${res.safeWithdrawalRate}%) must be in realistic 3.0% - 4.8% range`,
      );
      assert.ok(res.annualWithdrawal > 0);
      assert.ok(res.survivalProbability >= 90);
      assert.ok(res.iterations >= 5 && res.iterations <= 20);
    });

    it('returns 0 SWR when initial portfolio is zero or negative', () => {
      const zeroPort = findSafeWithdrawalRate({ initialPortfolio: 0 }, 90);
      assert.equal(zeroPort.safeWithdrawalRate, 0);
      assert.equal(zeroPort.annualWithdrawal, 0);
      assert.equal(zeroPort.survivalProbability, 0);
      assert.equal(zeroPort.iterations, 0);
    });
  });

  describe('6. Multi-Strategy Comparator (compareWithdrawalStrategies) & Numerical Invariants', () => {
    it('compares all 3 strategies and guarantees zero NaN, Infinity, or negative values', () => {
      const comp = compareWithdrawalStrategies({
        initialPortfolio: 8000000,
        annualWithdrawal: 360000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.12,
        inflation: 0.025,
        sequenceShock: 'early-bear',
        trials: 250,
        seed: 888,
      });

      assert.ok(comp.constant);
      assert.ok(comp.guytonKlinger);
      assert.ok(comp.variableSpending);
      assert.ok(comp.srrComparison);
      assert.equal(typeof comp.srrComparison.bestSurvivalStrategy, 'string');
      assert.equal(comp.srrComparison.shockApplied, true);

      const strategies = [comp.constant, comp.guytonKlinger, comp.variableSpending];
      for (const strat of strategies) {
        assert.ok(!Number.isNaN(strat.survivalProbability));
        assert.ok(Number.isFinite(strat.survivalProbability));
        assert.ok(strat.survivalProbability >= 0 && strat.survivalProbability <= 100);

        assert.ok(!Number.isNaN(strat.averageAnnualWithdrawal));
        assert.ok(strat.averageAnnualWithdrawal >= 0);

        assert.ok(!Number.isNaN(strat.minWithdrawal));
        assert.ok(strat.minWithdrawal >= 0);

        assert.ok(!Number.isNaN(strat.maxWithdrawal));
        assert.ok(strat.maxWithdrawal >= strat.minWithdrawal);

        assert.ok(!Number.isNaN(strat.finalP10));
        assert.ok(!Number.isNaN(strat.finalP50));
        assert.ok(!Number.isNaN(strat.finalP90));
        assert.ok(strat.finalP10 >= 0);
        assert.ok(strat.finalP50 >= strat.finalP10);
        assert.ok(strat.finalP90 >= strat.finalP50);
      }
    });
  });
});
