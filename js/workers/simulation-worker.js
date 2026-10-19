/**
 * Money Superapp - Dedicated Monte Carlo Simulation Web Worker
 * Offloads compute-heavy stochastic simulations off the main browser UI thread.
 * 100% offline, zero external dependencies, CSP-compliant.
 */

/* global importScripts, self */

if (
  typeof importScripts === 'function' &&
  (!self.MoneyApp || typeof self.MoneyApp.simulateMonteCarloRetirement !== 'function')
) {
  try {
    importScripts('../engines/monte-carlo.js');
  } catch (err) {
    // If importScripts fails (e.g. offline fallback or path resolution), error will be surfaced on simulation invocation
  }
}

self.onmessage = (e) => {
  const data = e.data || {};
  const { id, type, payload } = data;

  if (type === 'PING') {
    self.postMessage({ id, type: 'PONG', success: true });
    return;
  }

  if (type === 'SIMULATE_MONTE_CARLO') {
    try {
      const simulateFn = self.MoneyApp?.simulateMonteCarloRetirement || self.simulateMonteCarloRetirement;

      if (typeof simulateFn !== 'function') {
        throw new Error('Monte Carlo simulation engine not loaded in worker environment');
      }

      const result = simulateFn(payload);
      self.postMessage({
        id,
        type: 'SIMULATE_MONTE_CARLO_SUCCESS',
        success: true,
        payload: result,
        result: result,
      });
    } catch (err) {
      self.postMessage({
        id,
        type: 'SIMULATE_MONTE_CARLO_ERROR',
        success: false,
        error: err?.message ? err.message : String(err),
      });
    }
    return;
  }

  self.postMessage({
    id,
    type: 'UNKNOWN_TYPE_ERROR',
    success: false,
    error: `Unknown message type: ${type}`,
  });
};
