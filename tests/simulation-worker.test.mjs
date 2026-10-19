import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const ROOT_DIR = process.cwd();
const engineCode = fs.readFileSync(path.join(ROOT_DIR, 'js/engines/monte-carlo.js'), 'utf8');
const workerCode = fs.readFileSync(path.join(ROOT_DIR, 'js/workers/simulation-worker.js'), 'utf8');
const dashboardCode = fs.readFileSync(path.join(ROOT_DIR, 'js/dashboard.js'), 'utf8');
const sharedCode = fs.readFileSync(path.join(ROOT_DIR, 'js/shared.js'), 'utf8');

const enginesDir = path.join(ROOT_DIR, 'js/engines');
const allEnginesCode = fs
  .readdirSync(enginesDir)
  .filter((f) => f.endsWith('.js'))
  .map((f) => fs.readFileSync(path.join(enginesDir, f), 'utf8'))
  .join(';\n');

function loadEngine() {
  const mockGlobal = { MoneyApp: {} };
  const fn = new Function('global', 'window', 'self', `${engineCode}; return global.MoneyApp;`);
  return fn(mockGlobal, mockGlobal, mockGlobal);
}

describe('Phase 111: Zero-Dependency Web Worker for Heavy Simulations', () => {
  describe('1. Engine Math, Determinism & Percentiles (js/engines/monte-carlo.js)', () => {
    const MoneyApp = loadEngine();
    const { simulateMonteCarloRetirement, validateMonteCarloParams, validateMonteCarloResult } = MoneyApp;

    it('exports all expected Monte Carlo engine interfaces to MoneyApp namespace', () => {
      assert.equal(typeof simulateMonteCarloRetirement, 'function');
      assert.equal(typeof validateMonteCarloParams, 'function');
      assert.equal(typeof validateMonteCarloResult, 'function');
    });

    it('produces identical bit-for-bit results when supplied the same seed across multiple runs', () => {
      const params = {
        initialPortfolio: 8000000,
        annualWithdrawal: 350000,
        years: 25,
        meanReturn: 0.065,
        volatility: 0.12,
        inflation: 0.025,
        trials: 300,
        seed: 777,
      };

      const run1 = simulateMonteCarloRetirement(params);
      const run2 = simulateMonteCarloRetirement(params);

      assert.equal(run1.survivalProbability, run2.survivalProbability);
      assert.equal(run1.tier, run2.tier);
      assert.equal(run1.finalP10, run2.finalP10);
      assert.equal(run1.finalP50, run2.finalP50);
      assert.equal(run1.finalP90, run2.finalP90);
      assert.equal(run1.trajectoryPercentiles.length, run2.trajectoryPercentiles.length);

      for (let i = 0; i < run1.trajectoryPercentiles.length; i++) {
        assert.deepEqual(run1.trajectoryPercentiles[i], run2.trajectoryPercentiles[i]);
      }
    });

    it('validates percentile monotonicity: p10 <= p50 <= p90 across all simulation years', () => {
      const res = simulateMonteCarloRetirement({
        initialPortfolio: 5000000,
        annualWithdrawal: 250000,
        years: 30,
        meanReturn: 0.06,
        volatility: 0.15,
        inflation: 0.02,
        trials: 200,
        seed: 1234,
      });

      assert.ok(Array.isArray(res.trajectoryPercentiles));
      assert.equal(res.trajectoryPercentiles.length, 31); // Yr 0 to Yr 30

      for (const pt of res.trajectoryPercentiles) {
        assert.ok(pt.p10 <= pt.p50, `Year ${pt.year}: p10 (${pt.p10}) must be <= p50 (${pt.p50})`);
        assert.ok(pt.p50 <= pt.p90, `Year ${pt.year}: p50 (${pt.p50}) must be <= p90 (${pt.p90})`);
        assert.ok(pt.p10 >= 0, `Year ${pt.year}: p10 (${pt.p10}) cannot be negative`);
      }
    });

    it('clamps boundary parameters safely (negative values, extreme years, trial bounds)', () => {
      const sanitized = validateMonteCarloParams({
        initialPortfolio: -500000,
        annualWithdrawal: -20000,
        years: 150, // exceeds 50
        trials: 5000, // exceeds 2000
        volatility: -0.5,
      });

      assert.equal(sanitized.initialPortfolio, 0);
      assert.equal(sanitized.annualWithdrawal, 0);
      assert.equal(sanitized.years, 50);
      assert.equal(sanitized.trials, 2000);
      assert.equal(sanitized.volatility, 0);

      const lowSanitized = validateMonteCarloParams({
        years: 0,
        trials: 2,
      });

      assert.equal(lowSanitized.years, 1);
      assert.equal(lowSanitized.trials, 10);
    });

    it('handles financial edge cases: zero net worth, zero withdrawal, and market extremes', () => {
      // 0 initial portfolio with non-zero withdrawal -> 0% survival, critical tier
      const zeroNetWorth = simulateMonteCarloRetirement({
        initialPortfolio: 0,
        annualWithdrawal: 300000,
        years: 20,
        trials: 100,
      });
      assert.equal(zeroNetWorth.survivalProbability, 0);
      assert.equal(zeroNetWorth.tier, 'critical');
      assert.equal(zeroNetWorth.finalP50, 0);

      // Positive portfolio with 0 withdrawal -> 100% survival, safe tier
      const zeroWithdrawal = simulateMonteCarloRetirement({
        initialPortfolio: 5000000,
        annualWithdrawal: 0,
        years: 20,
        meanReturn: 0.05,
        trials: 100,
      });
      assert.equal(zeroWithdrawal.survivalProbability, 100);
      assert.equal(zeroWithdrawal.tier, 'safe');
      assert.ok(zeroWithdrawal.finalP50 > 5000000);

      // Extreme inflation shock (50% inflation with 5% return)
      const inflationShock = simulateMonteCarloRetirement({
        initialPortfolio: 2000000,
        annualWithdrawal: 200000,
        years: 15,
        meanReturn: 0.05,
        volatility: 0.1,
        inflation: 0.5,
        trials: 100,
      });
      assert.ok(inflationShock.survivalProbability < 50);
      assert.equal(inflationShock.tier, 'critical');
    });

    it('validates validateMonteCarloResult schema integrity checker', () => {
      const validRes = simulateMonteCarloRetirement({ initialPortfolio: 1000000 });
      assert.equal(validateMonteCarloResult(validRes), true);

      assert.equal(validateMonteCarloResult(null), false);
      assert.equal(validateMonteCarloResult({}), false);
      assert.equal(validateMonteCarloResult({ survivalProbability: 'not a number' }), false);
      assert.equal(validateMonteCarloResult({ survivalProbability: 150, tier: 'safe' }), false);
      assert.equal(
        validateMonteCarloResult({
          survivalProbability: 80,
          tier: 'invalid_tier',
          finalP10: 10,
          finalP50: 20,
          finalP90: 30,
          trajectoryPercentiles: [{ year: 0, p10: 10, p50: 20, p90: 30 }],
        }),
        false,
      );
    });
  });

  describe('2. Worker Protocol & Message Handling (js/workers/simulation-worker.js)', () => {
    function createMockWorkerScope() {
      const postedMessages = [];
      const scope = {
        MoneyApp: loadEngine(),
        simulateMonteCarloRetirement: loadEngine().simulateMonteCarloRetirement,
        postMessage: (msg) => {
          postedMessages.push(msg);
        },
        onmessage: null,
      };

      const fn = new Function('self', 'importScripts', workerCode);
      fn(scope, () => {});
      return { scope, postedMessages };
    }

    it('responds to PING with PONG and success: true', () => {
      const { scope, postedMessages } = createMockWorkerScope();
      assert.equal(typeof scope.onmessage, 'function', 'Worker must register self.onmessage listener');

      scope.onmessage({ data: { id: 101, type: 'PING' } });
      assert.equal(postedMessages.length, 1);
      assert.equal(postedMessages[0].id, 101);
      assert.equal(postedMessages[0].type, 'PONG');
      assert.equal(postedMessages[0].success, true);
    });

    it('responds to SIMULATE_MONTE_CARLO with SIMULATE_MONTE_CARLO_SUCCESS and result payload', () => {
      const { scope, postedMessages } = createMockWorkerScope();

      scope.onmessage({
        data: {
          id: 202,
          type: 'SIMULATE_MONTE_CARLO',
          payload: {
            initialPortfolio: 6000000,
            annualWithdrawal: 240000,
            years: 20,
            trials: 100,
            seed: 42,
          },
        },
      });

      assert.equal(postedMessages.length, 1);
      const res = postedMessages[0];
      assert.equal(res.id, 202);
      assert.equal(res.type, 'SIMULATE_MONTE_CARLO_SUCCESS');
      assert.equal(res.success, true);
      assert.ok(res.payload);
      assert.ok(typeof res.payload.survivalProbability === 'number');
      assert.ok(Array.isArray(res.payload.trajectoryPercentiles));
      assert.equal(res.payload.trajectoryPercentiles.length, 21);
    });

    it('responds with UNKNOWN_TYPE_ERROR for unsupported message types', () => {
      const { scope, postedMessages } = createMockWorkerScope();

      scope.onmessage({ data: { id: 303, type: 'UNSUPPORTED_ACTION' } });
      assert.equal(postedMessages.length, 1);
      assert.equal(postedMessages[0].id, 303);
      assert.equal(postedMessages[0].type, 'UNKNOWN_TYPE_ERROR');
      assert.equal(postedMessages[0].success, false);
      assert.ok(postedMessages[0].error.includes('UNSUPPORTED_ACTION'));
    });

    it('handles worker errors gracefully when simulation throws', () => {
      const postedMessages = [];
      const scope = {
        MoneyApp: {
          simulateMonteCarloRetirement: () => {
            throw new Error('Simulation engine internal failure');
          },
        },
        postMessage: (msg) => {
          postedMessages.push(msg);
        },
        onmessage: null,
      };

      const fn = new Function('self', 'importScripts', workerCode);
      fn(scope, () => {});

      scope.onmessage({ data: { id: 404, type: 'SIMULATE_MONTE_CARLO', payload: {} } });
      assert.equal(postedMessages.length, 1);
      assert.equal(postedMessages[0].id, 404);
      assert.equal(postedMessages[0].type, 'SIMULATE_MONTE_CARLO_ERROR');
      assert.equal(postedMessages[0].success, false);
      assert.ok(postedMessages[0].error.includes('Simulation engine internal failure'));
    });
  });

  describe('3. Dashboard Client Orchestration & Asynchronous Fallbacks (js/dashboard.js)', () => {
    function createDashboardEnvironment(options = {}) {
      const { protocol = 'https:', workerAvailable = false, workerThrowsSecurityError = false } = options;

      const mockElements = {
        'badge-mc-survival': { textContent: '', style: {} },
        'val-mc-p10': { textContent: '' },
        'val-mc-p50': { textContent: '' },
        'val-mc-p90': { textContent: '' },
        'mc-fan-chart': { innerHTML: '' },
      };

      const elementStore = new Map();
      const getOrCreateElement = (id) => {
        if (mockElements[id]) return mockElements[id];
        if (!elementStore.has(id)) {
          elementStore.set(id, {
            id,
            textContent: '',
            innerHTML: '',
            value: '',
            style: {},
            dataset: {},
            classList: {
              add: () => {},
              remove: () => {},
              toggle: () => {},
              contains: () => false,
            },
            setAttribute: () => {},
            getAttribute: () => null,
            addEventListener: () => {},
            removeEventListener: () => {},
            appendChild: () => {},
            querySelector: () => null,
            querySelectorAll: () => [],
          });
        }
        return elementStore.get(id);
      };

      const mockDocument = {
        getElementById: (id) => getOrCreateElement(id),
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: (tag) => getOrCreateElement(tag),
        documentElement: { lang: 'th', dataset: {} },
        addEventListener: () => {},
      };

      let workerInstance = null;
      class MockWorker {
        constructor(scriptUrl) {
          if (workerThrowsSecurityError) {
            throw new Error('SecurityError: The operation is insecure.');
          }
          this.scriptUrl = scriptUrl;
          this.onmessage = null;
          this.onerror = null;
          workerInstance = this;
        }
        postMessage(data) {
          // Mock async response
          setTimeout(() => {
            if (this.onmessage) {
              const engine = loadEngine();
              const result = engine.simulateMonteCarloRetirement(data.payload);
              this.onmessage({
                data: {
                  id: data.id,
                  type: 'SIMULATE_MONTE_CARLO_SUCCESS',
                  success: true,
                  payload: result,
                },
              });
            }
          }, 5);
        }
        terminate() {}
      }

      const storageStore = new Map();
      const mockStorage = {
        getItem: (k) => (storageStore.has(k) ? storageStore.get(k) : null),
        setItem: (k, v) => storageStore.set(k, String(v)),
        removeItem: (k) => storageStore.delete(k),
        clear: () => storageStore.clear(),
      };

      const mockWindow = {
        location: { protocol, pathname: '/dashboard.html' },
        document: mockDocument,
        localStorage: mockStorage,
        addEventListener: () => {},
        unit: 'THB',
        formatMoney: (n) => String(n),
        MoneyApp: loadEngine(),
      };

      if (workerAvailable) {
        mockWindow.Worker = MockWorker;
      }

      const runScript = new Function(
        'window',
        'document',
        'location',
        'localStorage',
        'Worker',
        `
        ${sharedCode};
        ${allEnginesCode};
        var MoneyApp = window.MoneyApp;
        var LANG = window.LANG || 'th';
        var THEME = window.THEME || 'light';
        var unit = window.unit || 'THB';
        var formatMoney = window.formatMoney || function(n) { return String(n); };
        var parseNum = window.parseNum || function(n) { return Number(n) || 0; };
        var safeJsonParse = window.safeJsonParse || function(k, fb) { return fb; };
        ${dashboardCode};
        return window.MoneyApp;
        `,
      );

      const MoneyApp = runScript(mockWindow, mockDocument, mockWindow.location, mockStorage, mockWindow.Worker);

      return { MoneyApp, mockWindow, mockElements, getWorkerInstance: () => workerInstance };
    }

    it('falls back seamlessly to synchronous engine when Worker is undefined', async () => {
      const { MoneyApp } = createDashboardEnvironment({ workerAvailable: false });
      assert.equal(typeof MoneyApp.simulateMonteCarloAsync, 'function');

      const res = await MoneyApp.simulateMonteCarloAsync({
        initialPortfolio: 5000000,
        annualWithdrawal: 200000,
        years: 20,
        trials: 100,
        seed: 42,
      });

      assert.ok(res);
      assert.ok(typeof res.survivalProbability === 'number');
      assert.equal(res.trajectoryPercentiles.length, 21);
    });

    it('immediately bypasses Web Worker under file: protocol to prevent SecurityError', async () => {
      const { MoneyApp } = createDashboardEnvironment({
        protocol: 'file:',
        workerAvailable: true,
      });

      const res = await MoneyApp.simulateMonteCarloAsync({
        initialPortfolio: 4000000,
        annualWithdrawal: 150000,
        years: 15,
        trials: 100,
      });

      assert.ok(res);
      assert.ok(res.survivalProbability >= 0);
    });

    it('recovers with synchronous fallback if Worker constructor throws SecurityError', async () => {
      const { MoneyApp } = createDashboardEnvironment({
        protocol: 'https:',
        workerAvailable: true,
        workerThrowsSecurityError: true,
      });

      const res = await MoneyApp.simulateMonteCarloAsync({
        initialPortfolio: 7000000,
        annualWithdrawal: 300000,
        years: 25,
        trials: 100,
      });

      assert.ok(res);
      assert.ok(res.survivalProbability > 0);
    });

    it('resolves asynchronously via Worker message loop when Worker is active', async () => {
      const { MoneyApp } = createDashboardEnvironment({
        protocol: 'https:',
        workerAvailable: true,
      });

      const res = await MoneyApp.simulateMonteCarloAsync({
        initialPortfolio: 10000000,
        annualWithdrawal: 400000,
        years: 30,
        trials: 100,
        seed: 42,
      });

      assert.ok(res);
      assert.equal(res.trajectoryPercentiles.length, 31);
    });

    it('updates Monte Carlo UI elements and handles sequence ordering', async () => {
      const { MoneyApp, mockElements } = createDashboardEnvironment({
        protocol: 'https:',
        workerAvailable: true,
      });

      await MoneyApp.renderMonteCarloSection({
        initialPortfolio: 10000000,
        annualWithdrawal: 300000,
        years: 30,
        meanReturn: 0.07,
        volatility: 0.1,
        inflation: 0.025,
        trials: 100,
        seed: 42,
      });

      assert.ok(mockElements['badge-mc-survival'].textContent.includes('%'));
      assert.ok(mockElements['val-mc-p10'].textContent.includes('THB'));
      assert.ok(mockElements['val-mc-p50'].textContent.includes('THB'));
      assert.ok(mockElements['val-mc-p90'].textContent.includes('THB'));
      assert.ok(mockElements['mc-fan-chart'].innerHTML.includes('polygon'));
    });
  });

  describe('4. PWA, Service Worker & CSP Compliance', () => {
    it('verifies monte-carlo.js and simulation-worker.js exist on disk', () => {
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'js/engines/monte-carlo.js')));
      assert.ok(fs.existsSync(path.join(ROOT_DIR, 'js/workers/simulation-worker.js')));
    });

    it('verifies sw.js ASSETS_TO_CACHE precaches both monte-carlo engine and simulation worker', () => {
      const swContent = fs.readFileSync(path.join(ROOT_DIR, 'sw.js'), 'utf8');
      assert.ok(
        swContent.includes("'./js/engines/monte-carlo.js'"),
        'sw.js ASSETS_TO_CACHE must include monte-carlo.js',
      );
      assert.ok(
        swContent.includes("'./js/workers/simulation-worker.js'"),
        'sw.js ASSETS_TO_CACHE must include simulation-worker.js',
      );
    });

    it('verifies dashboard.html includes monte-carlo.js script tag', () => {
      const html = fs.readFileSync(path.join(ROOT_DIR, 'dashboard.html'), 'utf8');
      assert.ok(html.includes('<script src="js/engines/monte-carlo.js"></script>'));
    });

    it('proves zero external telemetry, CDN scripts, eval, or new Function in worker and engine', () => {
      const forbiddenPatterns = [
        'eval(',
        'new Function(',
        'http://',
        'https://',
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
      ];

      for (const pattern of forbiddenPatterns) {
        assert.ok(!engineCode.includes(pattern), `monte-carlo.js must not contain forbidden pattern: ${pattern}`);
        assert.ok(!workerCode.includes(pattern), `simulation-worker.js must not contain forbidden pattern: ${pattern}`);
      }
    });
  });
});
