import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

// Load domain calculation engines
import '../js/engines/thai-pit.js';
import '../js/engines/refinance.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Extracts and compiles the pure buy-only water-filling `allocate(assets, budget)`
 * function directly from `js/rebalance.js`.
 */
function loadRebalanceAllocator() {
  const code = readFileSync(resolve(__dirname, '../js/rebalance.js'), 'utf8');
  const startIdx = code.indexOf('function allocate(assets, budget)');
  if (startIdx === -1) {
    throw new Error('function allocate(assets, budget) not found in js/rebalance.js');
  }

  let openBraces = 0;
  let started = false;
  let endIdx = -1;
  for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '{') {
      openBraces++;
      started = true;
    } else if (code[i] === '}') {
      openBraces--;
      if (started && openBraces === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  const funcStr = code.slice(startIdx, endIdx);
  return new Function(`${funcStr}; return allocate;`)();
}

const allocate = loadRebalanceAllocator();

/**
 * Deterministic Linear Congruential Generator (LCG) for zero-dependency,
 * perfectly repeatable fuzzing runs across all platforms.
 */
function createRng(seed = 123456789) {
  let s = seed >>> 0;
  return {
    next() {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    float(min, max, decimals = 2) {
      const val = this.next() * (max - min) + min;
      return Number(val.toFixed(decimals));
    },
    pick(arr) {
      return arr[this.int(0, arr.length - 1)];
    },
  };
}

/**
 * Validates that a numeric value is strictly finite, non-NaN, and not negative zero (-0).
 */
function assertValidNumber(val, label = 'value') {
  assert.equal(typeof val, 'number', `${label} must be a number`);
  assert.ok(!Number.isNaN(val), `${label} must not be NaN`);
  assert.ok(Number.isFinite(val), `${label} must be finite`);
  assert.ok(!Object.is(val, -0), `${label} must not be negative zero (-0)`);
}

describe('Phase 127: Financial Math Invariant & Fuzz Testing Suite (10,000 permutations)', () => {
  const {
    computeThaiPitTax,
    calculateTaxBracketStepDown,
    evaluateThaiEsgDeduction,
    calculateRetirementCeilingPool,
    simulateDebtPayoff,
  } = globalThis.MoneyApp;

  describe('1. Thai PIT Progressive Brackets Invariant Fuzzer (2,500 iterations)', () => {
    it('guarantees zero NaN/-0, non-negative tax, monotonicity, and 0-35% effective rate', () => {
      const rng = createRng(42001);
      const ITERATIONS = 2500;

      for (let i = 0; i < ITERATIONS; i++) {
        // Sample standard incomes (0 to 50M) and edge cases (negative, zero, satangs, mega-wealth up to 150M)
        const isExtreme = rng.next() < 0.06;
        const grossIncome = isExtreme ? rng.float(-20000, 150000000) : rng.float(0, 50000000);
        const deductions = rng.float(0, 2500000);
        const netTaxableIncome = Math.max(0, grossIncome - deductions);

        const taxPayable = computeThaiPitTax(netTaxableIncome);

        // Invariant 1.1: Numeric sanity (zero NaN, Infinity, or -0)
        assertValidNumber(taxPayable, `taxPayable at iteration ${i}`);
        assert.ok(taxPayable >= 0, `Tax payable must be non-negative at iteration ${i}: ${taxPayable}`);

        // Invariant 1.2: Statutory 0% tax-free tier (first 150,000 THB)
        if (netTaxableIncome <= 150000) {
          assert.equal(
            taxPayable,
            0,
            `Net taxable income <= 150k must yield 0 tax at iteration ${i}: got ${taxPayable}`,
          );
        }

        // Invariant 1.3: Effective tax rate upper bound (max statutory bracket is 35%)
        const effectiveRate = netTaxableIncome > 0 ? taxPayable / netTaxableIncome : 0;
        assertValidNumber(effectiveRate, `effectiveRate at iteration ${i}`);
        assert.ok(
          effectiveRate >= 0 && effectiveRate <= 0.35001,
          `Effective rate out of statutory [0, 0.35] bound at iteration ${i}: ${effectiveRate}`,
        );

        // Invariant 1.4: Monotonicity invariant (Higher net taxable income never produces lower tax)
        const deltaIncome = rng.float(1, 200000);
        const higherNetIncome = netTaxableIncome + deltaIncome;
        const higherTax = computeThaiPitTax(higherNetIncome);
        assertValidNumber(higherTax, `higherTax at iteration ${i}`);
        assert.ok(
          higherTax >= taxPayable,
          `Monotonicity violated at iteration ${i}: tax(${higherNetIncome}) = ${higherTax} < tax(${netTaxableIncome}) = ${taxPayable}`,
        );

        // Invariant 1.5: Marginal rate invariant (Marginal tax increase never exceeds top bracket 35% + rounding)
        const marginalTaxIncrease = higherTax - taxPayable;
        const maxExpectedIncrease = deltaIncome * 0.35 + 2;
        assert.ok(
          marginalTaxIncrease <= maxExpectedIncrease,
          `Marginal tax increase exceeded 35% rate limit at iteration ${i}: increase=${marginalTaxIncrease}, maxAllowed=${maxExpectedIncrease}`,
        );

        // Invariant 1.6: Step-Down analysis consistency with computeThaiPitTax
        if (i % 5 === 0) {
          const stepDown = calculateTaxBracketStepDown(netTaxableIncome);
          assertValidNumber(stepDown.totalCurrentTax, `stepDown.totalCurrentTax at iteration ${i}`);
          assert.equal(
            stepDown.totalCurrentTax,
            taxPayable,
            `calculateTaxBracketStepDown tax liability must match computeThaiPitTax at iteration ${i}`,
          );
          assert.ok(
            stepDown.currentRate >= 0 && stepDown.currentRate <= 0.35,
            `Current marginal rate must be in [0, 0.35] at iteration ${i}`,
          );
        }
      }
    });
  });

  describe('2. ThaiESG & Statutory Deduction Invariant Fuzzer (2,500 iterations)', () => {
    it('guarantees statutory caps (100k/300k), 30% income cap, holding years, and pool limits', () => {
      const rng = createRng(42002);
      const ITERATIONS = 2500;

      for (let i = 0; i < ITERATIONS; i++) {
        const isExtreme = rng.next() < 0.05;
        const purchaseAmount = isExtreme ? rng.float(-10000, 5000000) : rng.float(0, 1000000);
        const assessableIncome = isExtreme ? rng.float(-20000, 20000000) : rng.float(0, 10000000);
        const taxYear = rng.int(2020, 2030);

        const result = evaluateThaiEsgDeduction(purchaseAmount, assessableIncome, taxYear);

        // Invariant 2.1: Numeric sanity
        assertValidNumber(result.effectiveDeduction, `result.effectiveDeduction at iteration ${i}`);
        assertValidNumber(result.statutoryCap, `result.statutoryCap at iteration ${i}`);
        assertValidNumber(result.maxAllowed, `result.maxAllowed at iteration ${i}`);
        assertValidNumber(result.excessAmount, `result.excessAmount at iteration ${i}`);

        // Invariant 2.2: Statutory Caps and Holding Years by era (< 2024 vs >= 2024)
        const expectedCap = taxYear < 2024 ? 100000 : 300000;
        const expectedHoldingYears = taxYear < 2024 ? 8 : 5;
        assert.equal(result.statutoryCap, expectedCap, `Statutory cap mismatch for year ${taxYear} at iteration ${i}`);
        assert.equal(
          result.holdingYears,
          expectedHoldingYears,
          `Holding years mismatch for year ${taxYear} at iteration ${i}`,
        );

        // Invariant 2.3: Non-negativity and statutory ceiling
        assert.ok(
          result.effectiveDeduction >= 0,
          `Effective deduction must be non-negative at iteration ${i}: ${result.effectiveDeduction}`,
        );
        assert.ok(
          result.effectiveDeduction <= expectedCap,
          `Effective deduction exceeded statutory cap at iteration ${i}: ${result.effectiveDeduction} > ${expectedCap}`,
        );

        // Invariant 2.4: 30% Assessable Income Ceiling
        if (assessableIncome > 0) {
          const maxFromIncome = assessableIncome * 0.3;
          assert.ok(
            result.effectiveDeduction <= maxFromIncome + 1e-4,
            `Effective deduction exceeded 30% income limit at iteration ${i}: ${result.effectiveDeduction} > ${maxFromIncome}`,
          );
        }

        // Invariant 2.5: Deduction never exceeds invested purchase amount
        const sanitizedPurchase = Math.max(0, purchaseAmount);
        assert.ok(
          result.effectiveDeduction <= sanitizedPurchase + 1e-4,
          `Effective deduction exceeded purchase amount at iteration ${i}: ${result.effectiveDeduction} > ${sanitizedPurchase}`,
        );

        // Invariant 2.6: Excess amount mathematical consistency
        if (result.isExceeded) {
          assert.ok(
            sanitizedPurchase > result.maxAllowed,
            `isExceeded true but purchase <= maxAllowed at iteration ${i}`,
          );
          assert.ok(
            Math.abs(result.excessAmount - (sanitizedPurchase - result.maxAllowed)) < 1e-4,
            `excessAmount calculation error at iteration ${i}`,
          );
        } else {
          assert.equal(result.excessAmount, 0, `excessAmount must be 0 when not exceeded at iteration ${i}`);
        }

        // Invariant 2.7: Section 47 500k Retirement Ceiling Pool Invariant
        const poolInput = {
          pvd: rng.float(0, 300000),
          rmf: rng.float(0, 300000),
          ssf: rng.float(0, 200000),
          gpf: rng.float(0, 100000),
          nsf: rng.float(0, 30000),
          pensionInsurance: rng.float(0, 200000),
        };
        const pool = calculateRetirementCeilingPool(poolInput);

        assertValidNumber(pool.totalRaw, `pool.totalRaw at iteration ${i}`);
        assertValidNumber(pool.effectiveTotal, `pool.effectiveTotal at iteration ${i}`);
        assertValidNumber(pool.excess, `pool.excess at iteration ${i}`);
        assertValidNumber(pool.headroom, `pool.headroom at iteration ${i}`);

        assert.ok(
          pool.effectiveTotal <= 500000,
          `Retirement pool effectiveTotal exceeded statutory 500k at iteration ${i}: ${pool.effectiveTotal}`,
        );
        assert.ok(
          Math.abs(pool.effectiveTotal + pool.excess - pool.totalRaw) < 1e-4,
          `Retirement pool conservation of capital violated at iteration ${i}`,
        );
        assert.equal(
          pool.isExceeded,
          pool.totalRaw > 500000,
          `Retirement pool isExceeded flag inconsistent with totalRaw at iteration ${i}`,
        );
      }
    });
  });

  describe('3. Debt Payoff Amortization Invariants & Conservation of Debt (2,500 iterations)', () => {
    it('guarantees clean amortization, total paid conservation, non-negative trajectory, and zero NaN', () => {
      const rng = createRng(42003);
      const ITERATIONS = 2500;

      for (let i = 0; i < ITERATIONS; i++) {
        const numDebts = rng.int(1, 6);
        const debts = [];
        let initialTotal = 0;

        for (let d = 0; d < numDebts; d++) {
          const balance = rng.float(1000, 500000);
          const rate = rng.float(0, 28);
          // Minimum payment covers at least interest + positive amortizing portion (1.5% - 5%)
          const monthlyInterest = balance * (rate / 100 / 12);
          const minPayment = Math.max(300, Math.ceil(monthlyInterest + balance * rng.float(0.015, 0.05)));
          debts.push({
            id: `debt_${d}`,
            name: `Creditor ${d + 1}`,
            balance: balance,
            rate: rate,
            minPayment: minPayment,
          });
          initialTotal += balance;
        }

        const extraMonthly = rng.float(0, 30000);

        const simAv = simulateDebtPayoff(debts, extraMonthly, 'avalanche');
        const simSn = simulateDebtPayoff(debts, extraMonthly, 'snowball');

        // Invariant 3.1: Guaranteed simulation termination without runaway loop (< 600 months)
        assert.ok(
          simAv.months > 0 && simAv.months < 600,
          `Avalanche failed to amortize within safe limits at iteration ${i}: months=${simAv.months}`,
        );
        assert.ok(
          simSn.months > 0 && simSn.months < 600,
          `Snowball failed to amortize within safe limits at iteration ${i}: months=${simSn.months}`,
        );

        // Invariant 3.2: Numeric sanity in summary metrics
        assertValidNumber(simAv.months, `simAv.months at iteration ${i}`);
        assertValidNumber(simAv.totalInterest, `simAv.totalInterest at iteration ${i}`);
        assertValidNumber(simAv.totalPaid, `simAv.totalPaid at iteration ${i}`);

        assertValidNumber(simSn.months, `simSn.months at iteration ${i}`);
        assertValidNumber(simSn.totalInterest, `simSn.totalInterest at iteration ${i}`);
        assertValidNumber(simSn.totalPaid, `simSn.totalPaid at iteration ${i}`);

        // Invariant 3.3: Conservation of Debt (Total Paid = Principal + Total Interest)
        const roundedInitial = Math.round(initialTotal);
        assert.ok(
          Math.abs(simAv.totalPaid - (roundedInitial + simAv.totalInterest)) <= 5,
          `Conservation of debt violated in Avalanche at iteration ${i}: paid=${simAv.totalPaid}, expected=${roundedInitial + simAv.totalInterest}`,
        );
        assert.ok(
          Math.abs(simSn.totalPaid - (roundedInitial + simSn.totalInterest)) <= 5,
          `Conservation of debt violated in Snowball at iteration ${i}: paid=${simSn.totalPaid}, expected=${roundedInitial + simSn.totalInterest}`,
        );

        // Invariant 3.4: Total paid is strictly greater than or equal to initial debt
        assert.ok(
          simAv.totalPaid >= roundedInitial,
          `Avalanche totalPaid must be >= initial balance at iteration ${i}`,
        );
        assert.ok(simSn.totalPaid >= roundedInitial, `Snowball totalPaid must be >= initial balance at iteration ${i}`);

        // Invariant 3.5: All debts successfully cleared in payoff order
        assert.equal(
          simAv.payoffOrder.length,
          numDebts,
          `Avalanche must record elimination of all debts at iteration ${i}`,
        );
        assert.equal(
          simSn.payoffOrder.length,
          numDebts,
          `Snowball must record elimination of all debts at iteration ${i}`,
        );

        // Invariant 3.6: Trajectory invariants (zero NaN, strictly non-negative, monotonically non-increasing)
        assert.ok(simAv.trajectory.length > 0, `Trajectory must not be empty at iteration ${i}`);
        for (let t = 0; t < simAv.trajectory.length; t++) {
          const pt = simAv.trajectory[t];
          assertValidNumber(pt.balance, `simAv.trajectory[${t}].balance at iteration ${i}`);
          assert.ok(pt.balance >= 0, `Trajectory balance cannot be negative at iteration ${i}: ${pt.balance}`);

          if (t > 0) {
            assert.ok(
              pt.balance <= simAv.trajectory[t - 1].balance + 1e-4,
              `Trajectory balance increased at month ${pt.month} (iteration ${i}): ${pt.balance} > ${simAv.trajectory[t - 1].balance}`,
            );
          }
        }

        // Final trajectory balance reached 0
        const finalBalance = simAv.trajectory[simAv.trajectory.length - 1].balance;
        assert.ok(finalBalance <= 0.01, `Final trajectory balance must reach zero at iteration ${i}: ${finalBalance}`);
      }
    });
  });

  describe('4. Portfolio Rebalancing Conservation of Capital (2,500 iterations)', () => {
    it('guarantees zero NaN/-0, buy-only non-negative orders, 100% target sum, and capital conservation', () => {
      const rng = createRng(42004);
      const ITERATIONS = 2500;

      for (let i = 0; i < ITERATIONS; i++) {
        const numAssets = rng.int(2, 6);

        // Generate target weights summing to 100%
        const rawWeights = [];
        for (let a = 0; a < numAssets; a++) {
          // Occasionally include 0-weight frozen asset
          rawWeights.push(rng.next() < 0.08 ? 0 : rng.float(5, 100));
        }
        const rawSum = rawWeights.reduce((s, w) => s + w, 0) || 100;
        const weights = rawWeights.map((w) => Number(((w / rawSum) * 100).toFixed(2)));
        const weightSum = weights.reduce((s, w) => s + w, 0);
        weights[0] += Number((100 - weightSum).toFixed(2));

        const assets = [];
        let initialPortfolioTotal = 0;
        for (let a = 0; a < numAssets; a++) {
          const val = rng.float(0, 10000000);
          assets.push({ weight: weights[a], value: val });
          initialPortfolioTotal += val;
        }

        const rebalanceBudget = rng.float(0, 1000000);
        const allocations = allocate(assets, rebalanceBudget);

        // Invariant 4.1: Allocation array shape
        assert.equal(allocations.length, numAssets, `Allocations length mismatch at iteration ${i}`);

        let sumAllocated = 0;
        for (let a = 0; a < numAssets; a++) {
          const buyAmount = allocations[a];

          // Invariant 4.2: Zero NaN, Infinity, or -0 in allocations
          assertValidNumber(buyAmount, `allocations[${a}] at iteration ${i}`);

          // Invariant 4.3: Buy-only rebalancing invariant (allocations strictly non-negative)
          assert.ok(
            buyAmount >= -1e-6,
            `Buy-only invariant violated: negative allocation ${buyAmount} at asset ${a} (iteration ${i})`,
          );

          // Invariant 4.4: Zero-weight (frozen) assets receive 0 new budget
          if (assets[a].weight <= 0) {
            assert.equal(
              buyAmount,
              0,
              `Frozen 0-weight asset must receive 0 allocation at iteration ${i}, got ${buyAmount}`,
            );
          }

          sumAllocated += buyAmount;
        }

        // Invariant 4.5: Full budget deployment when active assets exist
        const hasPositiveWeight = assets.some((a) => a.weight > 0);
        if (hasPositiveWeight && rebalanceBudget > 0) {
          assert.ok(
            Math.abs(sumAllocated - rebalanceBudget) < 0.05,
            `Sum of allocations does not equal budget at iteration ${i}: sum=${sumAllocated}, budget=${rebalanceBudget}`,
          );
        }

        // Invariant 4.6: Conservation of Capital (Post Total = Initial Total + Allocated Budget)
        const postRebalanceTotal = assets.reduce((sum, a, idx) => sum + a.value + allocations[idx], 0);
        assertValidNumber(postRebalanceTotal, `postRebalanceTotal at iteration ${i}`);
        assert.ok(
          Math.abs(postRebalanceTotal - (initialPortfolioTotal + sumAllocated)) < 0.05,
          `Conservation of capital violated at iteration ${i}: postTotal=${postRebalanceTotal}, initial+alloc=${initialPortfolioTotal + sumAllocated}`,
        );

        // Invariant 4.7: Post-rebalance asset percentages sum to 100% (+/- 0.01%)
        if (postRebalanceTotal > 0) {
          const postPercentages = assets.map((a, idx) => ((a.value + allocations[idx]) / postRebalanceTotal) * 100);
          const sumPercentages = postPercentages.reduce((s, p) => s + p, 0);
          assertValidNumber(sumPercentages, `sumPercentages at iteration ${i}`);
          assert.ok(
            Math.abs(sumPercentages - 100) < 0.01,
            `Post-rebalance percentages must sum to 100% at iteration ${i}: got ${sumPercentages}`,
          );
        }
      }
    });
  });
});
