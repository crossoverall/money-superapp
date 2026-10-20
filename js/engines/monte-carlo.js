/**
 * Money Superapp - Monte Carlo Retirement Longevity Simulation Engine
 * Simulates portfolio survival probabilities, median/percentile trajectories (P10, P50, P90),
 * and longevity risk tiers using Gaussian normal distributions and Box-Muller transforms.
 * 100% offline & client-side compatible (file://, http(s)://, and Web Workers).
 */

((global) => {
  const parseNum = (val, fallback = 0) => {
    if (val === null || val === undefined || val === '') return fallback;
    if (global.MoneyApp && typeof global.MoneyApp.parseNum === 'function') {
      const parsed = global.MoneyApp.parseNum(val);
      return Number.isNaN(parsed) ? fallback : parsed;
    }
    if (typeof val === 'number') return Number.isNaN(val) ? fallback : val;
    const clean = String(val).replace(/,/g, '').trim();
    const n = Number.parseFloat(clean);
    return Number.isNaN(n) ? fallback : n;
  };

  /**
   * @typedef {'constant'|'guyton-klinger'|'variable-spending'} WithdrawalStrategy
   */

  /**
   * @typedef {'none'|'early-bear'|'late-bear'|'inflation-spike'} SequenceShock
   */

  /**
   * @typedef {Object} MonteCarloSimulationParams
   * @property {number|string} [initialPortfolio=10000000] - Starting portfolio capital in THB
   * @property {number|string} [annualWithdrawal=400000] - Initial annual retirement withdrawal in THB
   * @property {number|string} [years=30] - Simulation timeframe in years (1 - 50)
   * @property {number|string} [meanReturn=0.07] - Expected annual nominal investment return (e.g. 0.07 for 7%)
   * @property {number|string} [volatility=0.1] - Annualized portfolio volatility / standard deviation (e.g. 0.1 for 10%)
   * @property {number|string} [inflation=0.025] - Annual inflation rate for expense escalation (e.g. 0.025 for 2.5%)
   * @property {number|string} [trials=500] - Number of stochastic Monte Carlo iterations (10 - 2000)
   * @property {number|string} [seed=42] - PRNG seed for deterministic simulation runs
   * @property {WithdrawalStrategy} [withdrawalStrategy='constant'] - Dynamic withdrawal strategy rule
   * @property {SequenceShock} [sequenceShock='none'] - Sequence of returns risk (SRR) shock scenario
   * @property {number|string} [guardrailUpper=1.2] - Guyton-Klinger capital preservation upper guardrail multiplier
   * @property {number|string} [guardrailLower=0.8] - Guyton-Klinger prosperity lower guardrail multiplier
   * @property {number|string} [spendingFloor=0.75] - Variable spending minimum real withdrawal floor multiplier
   * @property {number|string} [spendingCeiling=1.25] - Variable spending maximum real withdrawal ceiling multiplier
   */

  /**
   * @typedef {Object} TrajectoryPercentilePoint
   * @property {number} year - Projection year (0 to years)
   * @property {number} p10 - 10th percentile conservative portfolio value in THB
   * @property {number} p50 - 50th percentile median portfolio value in THB
   * @property {number} p90 - 90th percentile optimistic portfolio value in THB
   */

  /**
   * @typedef {Object} MonteCarloSimulationResult
   * @property {number} survivalProbability - Portfolio survival probability (0.0 to 100.0%)
   * @property {'safe'|'moderate'|'fragile'|'critical'} tier - Risk classification tier
   * @property {number} finalP10 - Conservative final portfolio value at terminal year (THB)
   * @property {number} finalP50 - Median final portfolio value at terminal year (THB)
   * @property {number} finalP90 - Optimistic final portfolio value at terminal year (THB)
   * @property {TrajectoryPercentilePoint[]} trajectoryPercentiles - Annual percentile trajectories
   * @property {number} averageAnnualWithdrawal - Mean annual withdrawal across all simulated non-ruined years (THB)
   * @property {number} minWithdrawal - Minimum annual withdrawal observed (THB)
   * @property {number} maxWithdrawal - Maximum annual withdrawal observed (THB)
   * @property {boolean} srrShockApplied - True if sequence of returns shock scenario was active
   * @property {WithdrawalStrategy} withdrawalStrategy - Strategy utilized
   * @property {SequenceShock} sequenceShock - Sequence shock scenario evaluated
   */

  /**
   * Validates and sanitizes Monte Carlo simulation parameters
   *
   * @param {MonteCarloSimulationParams} [rawParams]
   * @returns {Required<MonteCarloSimulationParams>} Clean sanitized parameters
   */
  function validateMonteCarloParams(rawParams) {
    const p = rawParams || {};
    const years = Math.max(1, Math.min(50, Math.round(parseNum(p.years, 30))));
    const initialPortfolio = Math.max(0, parseNum(p.initialPortfolio, 10000000));
    const annualWithdrawal = Math.max(0, parseNum(p.annualWithdrawal, 400000));
    const meanReturn =
      p.meanReturn !== undefined && p.meanReturn !== null && p.meanReturn !== '' ? parseNum(p.meanReturn, 0.07) : 0.07;
    const volatility = Math.max(
      0,
      p.volatility !== undefined && p.volatility !== null && p.volatility !== '' ? parseNum(p.volatility, 0.1) : 0.1,
    );
    const inflation =
      p.inflation !== undefined && p.inflation !== null && p.inflation !== '' ? parseNum(p.inflation, 0.025) : 0.025;
    const trials = Math.max(10, Math.min(2000, Math.round(parseNum(p.trials, 500))));
    const seed = p.seed !== undefined && p.seed !== null ? Number(p.seed) || 12345 : 42;

    const validStrategies = ['constant', 'guyton-klinger', 'variable-spending'];
    const withdrawalStrategy = validStrategies.includes(p.withdrawalStrategy) ? p.withdrawalStrategy : 'constant';

    const validShocks = ['none', 'early-bear', 'late-bear', 'inflation-spike'];
    const sequenceShock = validShocks.includes(p.sequenceShock) ? p.sequenceShock : 'none';

    const parsedGuardrailUpper =
      p.guardrailUpper !== undefined && p.guardrailUpper !== null && p.guardrailUpper !== ''
        ? parseNum(p.guardrailUpper, 1.2)
        : 1.2;
    const guardrailUpper = parsedGuardrailUpper > 1.0 ? parsedGuardrailUpper : 1.2;

    const parsedGuardrailLower =
      p.guardrailLower !== undefined && p.guardrailLower !== null && p.guardrailLower !== ''
        ? parseNum(p.guardrailLower, 0.8)
        : 0.8;
    const guardrailLower = parsedGuardrailLower > 0 && parsedGuardrailLower < 1.0 ? parsedGuardrailLower : 0.8;

    const parsedSpendingFloor =
      p.spendingFloor !== undefined && p.spendingFloor !== null && p.spendingFloor !== ''
        ? parseNum(p.spendingFloor, 0.75)
        : 0.75;
    const spendingFloor = parsedSpendingFloor > 0 && parsedSpendingFloor < 1.0 ? parsedSpendingFloor : 0.75;

    const parsedSpendingCeiling =
      p.spendingCeiling !== undefined && p.spendingCeiling !== null && p.spendingCeiling !== ''
        ? parseNum(p.spendingCeiling, 1.25)
        : 1.25;
    const spendingCeiling = parsedSpendingCeiling > 1.0 ? parsedSpendingCeiling : 1.25;

    return {
      initialPortfolio,
      annualWithdrawal,
      years,
      meanReturn,
      volatility,
      inflation,
      trials,
      seed,
      withdrawalStrategy,
      sequenceShock,
      guardrailUpper,
      guardrailLower,
      spendingFloor,
      spendingCeiling,
    };
  }

  /**
   * Validates whether a result conforms to the MonteCarloSimulationResult schema
   *
   * @param {*} res
   * @returns {boolean} True if result conforms to schema
   */
  function validateMonteCarloResult(res) {
    if (!res || typeof res !== 'object') return false;
    if (typeof res.survivalProbability !== 'number' || Number.isNaN(res.survivalProbability)) return false;
    if (res.survivalProbability < 0 || res.survivalProbability > 100) return false;
    if (!['safe', 'moderate', 'fragile', 'critical'].includes(res.tier)) return false;
    if (typeof res.finalP10 !== 'number' || Number.isNaN(res.finalP10)) return false;
    if (typeof res.finalP50 !== 'number' || Number.isNaN(res.finalP50)) return false;
    if (typeof res.finalP90 !== 'number' || Number.isNaN(res.finalP90)) return false;
    if (!Array.isArray(res.trajectoryPercentiles) || res.trajectoryPercentiles.length === 0) return false;

    for (let i = 0; i < res.trajectoryPercentiles.length; i++) {
      const pt = res.trajectoryPercentiles[i];
      if (!pt || typeof pt !== 'object') return false;
      if (
        typeof pt.year !== 'number' ||
        typeof pt.p10 !== 'number' ||
        typeof pt.p50 !== 'number' ||
        typeof pt.p90 !== 'number'
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * Runs stochastic Monte Carlo simulation for retirement longevity and percentile trajectories
   *
   * @param {MonteCarloSimulationParams} [params]
   * @returns {MonteCarloSimulationResult}
   */
  function simulateMonteCarloRetirement(params) {
    const valid = validateMonteCarloParams(params);
    let s = valid.seed || 12345;

    function rand() {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    }

    function randomNormal() {
      let u1 = rand();
      const u2 = rand();
      while (u1 <= 1e-15) u1 = rand();
      return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    }

    const safeYears = valid.years;
    const safeInitPort = valid.initialPortfolio;
    const safeInitWithdrawal = valid.annualWithdrawal;
    const safeTrials = valid.trials;
    const meanReturn = valid.meanReturn;
    const volatility = valid.volatility;
    const inflation = valid.inflation;
    const withdrawalStrategy = valid.withdrawalStrategy;
    const sequenceShock = valid.sequenceShock;
    const guardrailUpper = valid.guardrailUpper;
    const guardrailLower = valid.guardrailLower;
    const spendingFloor = valid.spendingFloor;
    const spendingCeiling = valid.spendingCeiling;

    const initialRate = safeInitPort > 0 ? safeInitWithdrawal / safeInitPort : 0;

    let successfulTrials = 0;
    const yearlyPortfolios = Array.from({ length: safeYears + 1 }, () => []);

    let totalWithdrawalsSum = 0;
    let totalWithdrawalsCount = 0;
    let minWithdrawal = Infinity;
    let maxWithdrawal = 0;

    for (let t = 0; t < safeTrials; t++) {
      let portfolio = safeInitPort;
      let withdrawal = safeInitWithdrawal;
      let ruined = false;
      let prevReturn = 0;
      let cumulativeInflation = 1.0;

      yearlyPortfolios[0].push(portfolio);

      for (let yr = 1; yr <= safeYears; yr++) {
        if (!ruined) {
          let yrInflation = inflation;
          if (sequenceShock === 'inflation-spike' && yr <= 3) {
            yrInflation = 0.08;
          }

          if (yr > 1) {
            cumulativeInflation *= 1 + yrInflation;

            if (withdrawalStrategy === 'guyton-klinger') {
              // Guyton-Klinger Rule 1: Inflation Rule
              // If previous year return was negative, freeze inflation increase for current year
              if (prevReturn >= 0) {
                withdrawal *= 1 + yrInflation;
              }

              // Guyton-Klinger Rule 2 & 3: Guardrails
              if (portfolio > 0 && initialRate > 0) {
                const currRate = withdrawal / portfolio;
                if (currRate > initialRate * guardrailUpper) {
                  // Capital Preservation Rule: cut withdrawal by 10%
                  withdrawal *= 0.9;
                } else if (currRate < initialRate * guardrailLower) {
                  // Prosperity Rule: increase withdrawal by 10%
                  withdrawal *= 1.1;
                }
              }
            } else if (withdrawalStrategy === 'variable-spending') {
              // Variable Spending: Apply inflation
              withdrawal *= 1 + yrInflation;

              const realBase = safeInitWithdrawal * cumulativeInflation;
              const floor = realBase * spendingFloor;
              const ceiling = realBase * spendingCeiling;

              if (prevReturn < 0) {
                // If previous year return was negative, reduce by 10%, bounded by floor
                withdrawal = Math.max(floor, withdrawal * 0.9);
              } else if (prevReturn > 0 && portfolio >= safeInitPort) {
                // If previous year return was positive and portfolio >= initialPortfolio, restore towards base
                withdrawal = Math.min(ceiling, Math.max(withdrawal * 1.1, realBase));
              }

              withdrawal = Math.max(floor, Math.min(ceiling, withdrawal));
            } else {
              // 'constant': withdrawal scales with 1 + yrInflation
              withdrawal *= 1 + yrInflation;
            }
          }

          // Track strategy withdrawal
          totalWithdrawalsSum += withdrawal;
          totalWithdrawalsCount++;
          if (withdrawal < minWithdrawal) minWithdrawal = withdrawal;
          if (withdrawal > maxWithdrawal) maxWithdrawal = withdrawal;

          portfolio -= withdrawal;
          if (portfolio <= 0) {
            portfolio = 0;
            ruined = true;
          } else {
            const z = randomNormal();
            let annualRate = meanReturn + volatility * z;

            // Apply sequence shocks
            if (sequenceShock === 'early-bear') {
              if (yr === 1) annualRate = -0.2;
              else if (yr === 2) annualRate = -0.15;
              else if (yr === 3) annualRate = -0.1;
            } else if (sequenceShock === 'late-bear') {
              if (yr === safeYears - 2 && yr >= 1) annualRate = -0.2;
              else if (yr === safeYears - 1 && yr >= 1) annualRate = -0.15;
              else if (yr === safeYears && yr >= 1) annualRate = -0.1;
            }

            portfolio = Math.max(0, portfolio * (1 + annualRate));
            prevReturn = annualRate;
          }
        }
        yearlyPortfolios[yr].push(portfolio);
      }

      if (!ruined && portfolio > 0) {
        successfulTrials++;
      }
    }

    const survivalProbability = Math.round((successfulTrials / safeTrials) * 1000) / 10;

    const trajectoryPercentiles = [];
    for (let y = 0; y <= safeYears; y++) {
      const sorted = [...yearlyPortfolios[y]].sort((a, b) => a - b);
      const idx10 = Math.floor(safeTrials * 0.1);
      const idx50 = Math.floor(safeTrials * 0.5);
      const idx90 = Math.floor(safeTrials * 0.9);
      trajectoryPercentiles.push({
        year: y,
        p10: Math.round(sorted[idx10]),
        p50: Math.round(sorted[idx50]),
        p90: Math.round(sorted[idx90]),
      });
    }

    let tier = 'safe';
    if (survivalProbability < 50) tier = 'critical';
    else if (survivalProbability < 75) tier = 'fragile';
    else if (survivalProbability < 90) tier = 'moderate';

    const averageAnnualWithdrawal =
      totalWithdrawalsCount > 0 ? Math.round(totalWithdrawalsSum / totalWithdrawalsCount) : 0;
    const safeMinWithdrawal = Number.isFinite(minWithdrawal) ? Math.round(minWithdrawal) : 0;
    const safeMaxWithdrawal = Math.round(maxWithdrawal);
    const srrShockApplied = sequenceShock !== 'none';

    return {
      survivalProbability,
      tier,
      finalP10: trajectoryPercentiles[safeYears].p10,
      finalP50: trajectoryPercentiles[safeYears].p50,
      finalP90: trajectoryPercentiles[safeYears].p90,
      trajectoryPercentiles,
      averageAnnualWithdrawal,
      minWithdrawal: safeMinWithdrawal,
      maxWithdrawal: safeMaxWithdrawal,
      srrShockApplied,
      withdrawalStrategy,
      sequenceShock,
    };
  }

  /**
   * Finds the Safe Withdrawal Rate (SWR) achieving a target survival probability via binary search
   *
   * @param {MonteCarloSimulationParams} [params]
   * @param {number} [targetSurvival=90] - Target survival probability in % (e.g. 90)
   * @returns {{ safeWithdrawalRate: number, annualWithdrawal: number, survivalProbability: number, iterations: number }}
   */
  function findSafeWithdrawalRate(params, targetSurvival = 90) {
    const valid = validateMonteCarloParams(params);
    const target = typeof targetSurvival === 'number' && !Number.isNaN(targetSurvival) ? targetSurvival : 90;
    const initPort = valid.initialPortfolio;

    if (initPort <= 0) {
      return {
        safeWithdrawalRate: 0,
        annualWithdrawal: 0,
        survivalProbability: 0,
        iterations: 0,
      };
    }

    let lowRate = 0.01;
    let highRate = 0.15;
    let bestRate = lowRate;
    let bestSurvival = 0;
    let bestWithdrawal = Math.round(initPort * lowRate);
    let iterations = 0;

    const searchSeed = valid.seed || 42;
    const searchTrials = Math.max(100, Math.min(valid.trials, 300));

    while (highRate - lowRate > 0.001 && iterations < 20) {
      iterations++;
      const midRate = (lowRate + highRate) / 2;
      const trialWithdrawal = Math.round(initPort * midRate);

      const sim = simulateMonteCarloRetirement({
        ...valid,
        annualWithdrawal: trialWithdrawal,
        trials: searchTrials,
        seed: searchSeed,
      });

      if (sim.survivalProbability >= target) {
        bestRate = midRate;
        bestSurvival = sim.survivalProbability;
        bestWithdrawal = trialWithdrawal;
        lowRate = midRate;
      } else {
        highRate = midRate;
      }
    }

    const swrPercent = Number((bestRate * 100).toFixed(2));

    return {
      safeWithdrawalRate: swrPercent,
      annualWithdrawal: bestWithdrawal,
      survivalProbability: bestSurvival,
      iterations,
    };
  }

  /**
   * Compares all 3 withdrawal strategies under identical stochastic parameters and sequence shocks
   *
   * @param {MonteCarloSimulationParams} [params]
   * @returns {{ constant: MonteCarloSimulationResult, guytonKlinger: MonteCarloSimulationResult, variableSpending: MonteCarloSimulationResult, srrComparison: Object }}
   */
  function compareWithdrawalStrategies(params) {
    const valid = validateMonteCarloParams(params);
    const sharedSeed = valid.seed || 42;

    const constant = simulateMonteCarloRetirement({
      ...valid,
      withdrawalStrategy: 'constant',
      seed: sharedSeed,
    });

    const guytonKlinger = simulateMonteCarloRetirement({
      ...valid,
      withdrawalStrategy: 'guyton-klinger',
      seed: sharedSeed,
    });

    const variableSpending = simulateMonteCarloRetirement({
      ...valid,
      withdrawalStrategy: 'variable-spending',
      seed: sharedSeed,
    });

    let bestSurvivalStrategy = 'constant';
    let maxSurv = constant.survivalProbability;
    if (guytonKlinger.survivalProbability > maxSurv) {
      bestSurvivalStrategy = 'guyton-klinger';
      maxSurv = guytonKlinger.survivalProbability;
    }
    if (variableSpending.survivalProbability > maxSurv) {
      bestSurvivalStrategy = 'variable-spending';
      maxSurv = variableSpending.survivalProbability;
    }

    const srrComparison = {
      bestSurvivalStrategy,
      shockApplied: valid.sequenceShock !== 'none',
      sequenceShock: valid.sequenceShock,
      survivalRates: {
        constant: constant.survivalProbability,
        guytonKlinger: guytonKlinger.survivalProbability,
        variableSpending: variableSpending.survivalProbability,
      },
      averageWithdrawals: {
        constant: constant.averageAnnualWithdrawal,
        guytonKlinger: guytonKlinger.averageAnnualWithdrawal,
        variableSpending: variableSpending.averageAnnualWithdrawal,
      },
      diffGuytonVsConstant: Number((guytonKlinger.survivalProbability - constant.survivalProbability).toFixed(1)),
      diffVariableVsConstant: Number((variableSpending.survivalProbability - constant.survivalProbability).toFixed(1)),
    };

    return {
      constant,
      guytonKlinger,
      variableSpending,
      srrComparison,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  const MoneyApp = global.MoneyApp;
  MoneyApp.simulateMonteCarloRetirement = simulateMonteCarloRetirement;
  MoneyApp.validateMonteCarloParams = validateMonteCarloParams;
  MoneyApp.validateMonteCarloResult = validateMonteCarloResult;
  MoneyApp.findSafeWithdrawalRate = findSafeWithdrawalRate;
  MoneyApp.compareWithdrawalStrategies = compareWithdrawalStrategies;

  if (typeof global !== 'undefined') {
    if (typeof global.simulateMonteCarloRetirement === 'undefined') {
      global.simulateMonteCarloRetirement = simulateMonteCarloRetirement;
    }
    if (typeof global.findSafeWithdrawalRate === 'undefined') {
      global.findSafeWithdrawalRate = findSafeWithdrawalRate;
    }
    if (typeof global.compareWithdrawalStrategies === 'undefined') {
      global.compareWithdrawalStrategies = compareWithdrawalStrategies;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      simulateMonteCarloRetirement,
      validateMonteCarloParams,
      validateMonteCarloResult,
      findSafeWithdrawalRate,
      compareWithdrawalStrategies,
    };
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis);
