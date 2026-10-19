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
   * @typedef {Object} MonteCarloSimulationParams
   * @property {number|string} [initialPortfolio=10000000] - Starting portfolio capital in THB
   * @property {number|string} [annualWithdrawal=400000] - Initial annual retirement withdrawal in THB
   * @property {number|string} [years=30] - Simulation timeframe in years (1 - 50)
   * @property {number|string} [meanReturn=0.07] - Expected annual nominal investment return (e.g. 0.07 for 7%)
   * @property {number|string} [volatility=0.1] - Annualized portfolio volatility / standard deviation (e.g. 0.1 for 10%)
   * @property {number|string} [inflation=0.025] - Annual inflation rate for expense escalation (e.g. 0.025 for 2.5%)
   * @property {number|string} [trials=500] - Number of stochastic Monte Carlo iterations (10 - 2000)
   * @property {number|string} [seed=42] - PRNG seed for deterministic simulation runs
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

    return {
      initialPortfolio,
      annualWithdrawal,
      years,
      meanReturn,
      volatility,
      inflation,
      trials,
      seed,
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

    let successfulTrials = 0;
    const yearlyPortfolios = Array.from({ length: safeYears + 1 }, () => []);

    for (let t = 0; t < safeTrials; t++) {
      let portfolio = safeInitPort;
      let withdrawal = safeInitWithdrawal;
      let ruined = false;

      yearlyPortfolios[0].push(portfolio);

      for (let yr = 1; yr <= safeYears; yr++) {
        if (!ruined) {
          portfolio -= withdrawal;
          if (portfolio <= 0) {
            portfolio = 0;
            ruined = true;
          } else {
            const z = randomNormal();
            const annualRate = meanReturn + volatility * z;
            portfolio = Math.max(0, portfolio * (1 + annualRate));
          }
          withdrawal *= 1 + inflation;
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

    return {
      survivalProbability,
      tier,
      finalP10: trajectoryPercentiles[safeYears].p10,
      finalP50: trajectoryPercentiles[safeYears].p50,
      finalP90: trajectoryPercentiles[safeYears].p90,
      trajectoryPercentiles,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  const MoneyApp = global.MoneyApp;
  MoneyApp.simulateMonteCarloRetirement = simulateMonteCarloRetirement;
  MoneyApp.validateMonteCarloParams = validateMonteCarloParams;
  MoneyApp.validateMonteCarloResult = validateMonteCarloResult;

  if (typeof global !== 'undefined') {
    if (typeof global.simulateMonteCarloRetirement === 'undefined') {
      global.simulateMonteCarloRetirement = simulateMonteCarloRetirement;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      simulateMonteCarloRetirement,
      validateMonteCarloParams,
      validateMonteCarloResult,
    };
  }
})(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : globalThis);
