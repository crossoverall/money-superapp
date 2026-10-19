---
task_id: "SDLC-PHASE-111-SIMULATION-WORKER"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

# Implementation Plan — Phase 111: Zero-Dependency Web Worker for Heavy Simulations

## 1. Executive Summary & Problem Diagnosis
Currently, `js/dashboard.js` runs a 500-trial Monte Carlo retirement longevity simulation (`simulateMonteCarloRetirement`) synchronously on the main thread during initial dashboard load and whenever the user toggles Safe Withdrawal Rate (SWR) or return scenario pills.
Running stochastic simulations synchronously with Box-Muller normal transforms and sorting passes blocks the browser UI rendering thread, causing frame drops and input lag on mobile devices.

### Architectural Goals:
1. **Dedicated Web Worker Offloading**: Move stochastic trials to a dedicated background Web Worker (`js/workers/simulation-worker.js`).
2. **Single Source of Truth Engine**: Extract the pure simulation math from `js/dashboard.js` into `js/engines/monte-carlo.js`, adhering to the modular engine design established across `js/engines/`.
3. **ADR-001 & `file://` Invariant Compatibility**: Browsers restrict Web Worker instantiation under `file://` protocol (`SecurityError`). The application must feature transparent, seamless synchronous fallback so the app works identically whether opened from static HTTP servers or via local `file://` double-click.
4. **Zero NPM Dependencies & Zero-Build**: Keep 100% vanilla JavaScript with strict CSP compliance (`script-src 'self' 'unsafe-inline'`), zero `eval()`, zero `new Function()`, and zero CDN calls.
5. **Offline PWA Precache**: Register both the new engine and worker in `sw.js` `ASSETS_TO_CACHE`.

---

## 2. Invariants & Constraints Checklist

| Invariant | Requirement | Verification Method |
|---|---|---|
| **ADR-001 Privacy & Client-Side Execution** | 100% client-side calculation; zero network requests or telemetry. | CSP tests in `tests/security.test.mjs` |
| **ADR-001 Dual-Protocol Compatibility** | Must function seamlessly on both `http(s)://` and `file://`. If worker fails or is blocked, synchronous fallback immediately computes results. | Automated fallback tests in `tests/simulation-worker.test.mjs` |
| **CSP Compliance** | Worker loaded strictly from `'self'`; no `blob:` or `data:` URLs for workers; no forbidden execution primitives. | `tests/security.test.mjs` assertions |
| **Zero Runtime Dependencies** | Vanilla JS only; no npm runtime packages. | Repository dependency inspection |
| **Idempotent UI & Race Condition Defense** | Asynchronous worker responses must not overwrite newer user interactions (e.g. rapid slider changes). | Request sequence tagging (`_latestSimulationSeq`) |
| **Offline-First PWA** | All new assets cached in Service Worker. | `sw.js` cache array + `tests/pwa-manifest.test.mjs` |

---

## 3. Risk Assessment & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| **SecurityError on `file://`** | Worker creation throws error when opening standalone HTML without HTTP server. | High | Wrap worker instantiation in `try/catch`. On error, set `_workerFailed = true` and transparently route through `MoneyApp.simulateMonteCarloRetirement` returning a resolved Promise. |
| **Worker Script Load Failure (404/Offline)** | Worker throws `onerror` if asset is missing or corrupted. | Low | Listen to `worker.onerror`; immediately flush any pending requests through the synchronous engine fallback and terminate the failing worker instance. |
| **Race Conditions on Rapid UI Changes** | User clicks SWR pill 3.5% then 4.0%; slow trial 1 finishes after trial 2, displaying wrong scenario. | Medium | Use monotonically increasing sequence IDs (`_latestSimulationSeq`). UI callback discards any response whose sequence does not match the latest request. |
| **Worker Hang / Unresponsive Thread** | Worker hangs or takes too long under heavy system load. | Low | 5,000ms timeout guard on pending requests. If timer fires, request falls back to synchronous execution. |
| **Worker Math Discrepancy** | Worker computes different percentiles than synchronous engine. | Low | Worker uses `importScripts('../engines/monte-carlo.js')` so both paths execute the exact same mathematical code. Tests assert bit-for-bit parity with fixed PRNG seed. |

---

## 4. Vertical Slices & Step-by-Step Implementation

### Slice 1: Pure Monte Carlo Engine (`js/engines/monte-carlo.js`)
- **Action**: Create new file `js/engines/monte-carlo.js`.
- **Contents**:
  - Pure simulation engine encapsulated in standard IIFE `((global) => { ... })(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : globalThis));`.
  - Linear Congruential Generator (LCG) PRNG with seed support (`seed = 42` default) for deterministic runs.
  - Box-Muller transform for Gaussian normal distribution: `meanReturn + volatility * z`.
  - Annual inflation compounding: `withdrawal *= (1 + inflation)`.
  - Full JSDoc type contracts:
    - `@typedef {Object} MonteCarloSimulationParams`
    - `@typedef {Object} TrajectoryPercentilePoint`
    - `@typedef {Object} MonteCarloSimulationResult`
  - Input sanitizer/validator `validateMonteCarloParams(params)`:
    - Clamps `years` between 1 and 50.
    - Clamps `trials` between 10 and 2000 (safe ceiling).
    - Ensures non-negative `initialPortfolio`, `annualWithdrawal`, and `volatility`.
  - Output validator `validateMonteCarloResult(result)`.
  - Risk tier classifier: `< 50%` (`critical`), `< 75%` (`fragile`), `< 90%` (`moderate`), `≥ 90%` (`safe`).
  - Namespace export: `MoneyApp.simulateMonteCarloRetirement`, `MoneyApp.validateMonteCarloParams`, `MoneyApp.validateMonteCarloResult`.
  - Global backwards-compatible fallback: `global.simulateMonteCarloRetirement`.

### Slice 2: Dedicated Web Worker (`js/workers/simulation-worker.js`)
- **Action**: Create new file `js/workers/simulation-worker.js`.
- **Contents**:
  - Guarded engine import:
    ```javascript
    if (typeof importScripts === 'function' && (!self.MoneyApp || !self.MoneyApp.simulateMonteCarloRetirement)) {
      try {
        importScripts('../engines/monte-carlo.js');
      } catch (e) {
        // Handled via message error if simulator missing
      }
    }
    ```
  - Standard message protocol listener `self.onmessage`:
    - Handles `{ id, type: 'PING' }` $\to$ `{ id, type: 'PONG' }`.
    - Handles `{ id, type: 'SIMULATE_MONTE_CARLO', payload }`:
      - Resolves engine from `self.MoneyApp.simulateMonteCarloRetirement` or `self.simulateMonteCarloRetirement`.
      - Computes simulation result.
      - Responds with `{ id, type: 'SIMULATE_MONTE_CARLO_SUCCESS', payload: result }`.
      - Catches errors and responds with `{ id, type: 'SIMULATE_MONTE_CARLO_ERROR', error: message }`.
    - Handles unknown types with `{ id, type: 'UNKNOWN_TYPE_ERROR', error: '...' }`.

### Slice 3: Dashboard Client Orchestration & Asynchronous UI (`js/dashboard.js`, `dashboard.html`)
- **Action 3.1 (`js/dashboard.js`)**:
  - Implement `MoneyApp.simulateMonteCarloAsync(params)`:
    - Lazy singleton worker instantiation.
    - Protocol check: if `window.location.protocol === 'file:'` or `typeof Worker === 'undefined'`, immediately invoke synchronous engine and return `Promise.resolve(result)`.
    - Worker pool error handler: if worker encounters error, mark `_workerFailed = true`, drain pending queue via synchronous fallback, and terminate worker.
    - 5,000ms timeout per request with synchronous fallback.
    - Map of pending requests `_pendingRequests.set(id, { resolve, reject, timeoutTimer, params })`.
  - Implement `updateMonteCarloUI(mcRes)`:
    - Updates `badge-mc-survival` with survival probability and color coding (green $\ge 85\%$, amber $\ge 65\%$, red $< 65\%$).
    - Updates `val-mc-p10`, `val-mc-p50`, `val-mc-p90`.
    - Renders confidence fan chart `renderMonteCarloFanChart(mcRes.trajectoryPercentiles)`.
  - Refactor `renderFinancialGoals()`:
    - Calculate `p.netWorth`, `annualExp`, `fireMetrics`.
    - Increment `_latestSimulationSeq`.
    - Dispatch `MoneyApp.simulateMonteCarloAsync(params)`.
    - In Promise `.then(mcRes)`: check sequence ID, call `updateMonteCarloUI(mcRes)`.
  - Refactor existing inline `simulateMonteCarloRetirement`:
    - Delegate body to `(MoneyApp.simulateMonteCarloRetirement || ...)` for complete backward compatibility.
- **Action 3.2 (`dashboard.html`)**:
  - Add `<script src="js/engines/monte-carlo.js"></script>` before `js/shared.js` and `js/dashboard.js`.

### Slice 4: Service Worker & Smoke Precache Alignment (`sw.js`, `tests/smoke.test.mjs`)
- **Action 4.1 (`sw.js`)**:
  - Add `'./js/engines/monte-carlo.js'` and `'./js/workers/simulation-worker.js'` to `ASSETS_TO_CACHE`.
- **Action 4.2 (`tests/smoke.test.mjs`)**:
  - Add `'js/engines/monte-carlo.js'` to `CORE_JS_SCRIPTS`.

### Slice 5: Automated Test Suite (`tests/simulation-worker.test.mjs`)
- **Action**: Create new automated test suite `tests/simulation-worker.test.mjs` covering:
  1. **Engine Math & Determinism**:
     - Reproducibility test: identical results with same seed across runs.
     - Parity test: verify output against legacy inline simulator.
     - Percentile monotonicity: $p10 \le p50 \le p90$ across all years.
     - Parameter boundary clamping (negative numbers, extreme years, trial bounds).
     - Financial edge cases (0 net worth, 0 withdrawal, market boom, inflation shock).
  2. **Worker Protocol & Dispatch**:
     - PING / PONG protocol response.
     - SIMULATE_MONTE_CARLO protocol response format and payload schema.
     - Error response on unknown message type or invalid payload.
  3. **ADR-001 Invariant & Fallback**:
     - Verify `MoneyApp.simulateMonteCarloAsync` completes successfully when `Worker` is undefined or throws `SecurityError` (simulating `file://`).
     - Verify mock worker execution resolves correctly.
     - Verify timeout and worker crash error recovery triggers fallback.
  4. **PWA & CSP Integrity**:
     - Verify files exist on disk, are precached in `sw.js`, and contain zero `eval` or `new Function`.

---

## 5. Verification Commands

1. **Test Execution**:
   ```bash
   node --test tests/simulation-worker.test.mjs
   npm test
   ```
2. **Linting & Formatting**:
   ```bash
   npm run lint
   npm run format
   ```
3. **Security Audit**:
   ```bash
   node --test tests/security.test.mjs
   ```
4. **PWA Precache Verification**:
   ```bash
   node --test tests/pwa-manifest.test.mjs
   ```

---

## 6. Rollback & Contingency Plan
If any breaking issue occurs during implementation:
- Target files are isolated to `js/engines/monte-carlo.js`, `js/workers/simulation-worker.js`, `js/dashboard.js`, `dashboard.html`, `sw.js`, and `tests/simulation-worker.test.mjs`.
- Targeted rollback command:
  ```bash
  git checkout -- js/dashboard.js dashboard.html sw.js tests/smoke.test.mjs
  rm -f js/engines/monte-carlo.js js/workers/simulation-worker.js tests/simulation-worker.test.mjs
  ```
- No user data or database migration is involved; state remains 100% in browser `localStorage`.

---

## 7. Implementation Execution Log
- **Slice 1**: Created [`js/engines/monte-carlo.js`](file:///home/l2okii/Document/money-superapp/js/engines/monte-carlo.js) pure simulation engine with full JSDoc annotations, deterministic LCG PRNG, Box-Muller Gaussian transforms, and parameter/result schema validators.
- **Slice 2**: Created [`js/workers/simulation-worker.js`](file:///home/l2okii/Document/money-superapp/js/workers/simulation-worker.js) zero-dependency dedicated Web Worker supporting PING and SIMULATE_MONTE_CARLO protocol with error capture.
- **Slice 3**: Refactored [`js/dashboard.js`](file:///home/l2okii/Document/money-superapp/js/dashboard.js) to dispatch simulations through `MoneyApp.simulateMonteCarloAsync()` with singleton worker creation, 5s timeout, sequence tagging (`_latestSimulationSeq`), and immediate synchronous fallback on `file://` or Worker SecurityError. Added script tag to [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html).
- **Slice 4**: Updated [`sw.js`](file:///home/l2okii/Document/money-superapp/sw.js) precache list (`ASSETS_TO_CACHE`) and aligned [`tests/smoke.test.mjs`](file:///home/l2okii/Document/money-superapp/tests/smoke.test.mjs).
- **Slice 5**: Created comprehensive automated test suite [`tests/simulation-worker.test.mjs`](file:///home/l2okii/Document/money-superapp/tests/simulation-worker.test.mjs) (19/19 tests passing).
- **Quality Gates**:
  - `npm run lint`: Biome check passed across 66 files (0 errors, 0 warnings).
  - `npm test`: Full test suite passed (610/610 tests across 154 suites).
  - `node --test tests/security.test.mjs`: Security & CSP audit passed (20/20 tests).
  - Ready for QA & Debugger verification.
