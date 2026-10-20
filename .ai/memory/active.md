---
task_id: "none"
status: "idle"
current_stage: "idle"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 130 — Sequence of Returns Risk (SRR) & Dynamic SWR Retirement Simulator (v2.5.71)

#### 1. Goal & Scope Limits
- **Objective:**
  Upgrade the Monte Carlo retirement simulation engine (`js/engines/monte-carlo.js`) with Sequence of Returns Risk (SRR) stress-testing and dynamic Safe Withdrawal Rate (SWR) rules:
  1. **Dynamic Withdrawal Rules (`withdrawalStrategy`):**
     - `'constant'`: Traditional fixed real withdrawal (Bengen 4% rule adjusted for inflation).
     - `'guyton-klinger'`: Dynamic guardrails with Capital Preservation Rule (cut spending by 10% when withdrawal rate exceeds upper guardrail), Prosperity Rule (increase spending by 10% when withdrawal rate drops below lower guardrail), and Portfolio Management Rule (skip inflation escalation following negative return years).
     - `'variable-spending'`: Spending floor and ceiling guardrails with dynamic belt-tightening during bear markets.
  2. **Sequence Shock Presets (`sequenceShock`):**
     - `'none'`: Standard stochastic Gaussian simulation.
     - `'early-bear'`: Stress-tests market downturn in years 1–3 (-20%, -15%, -10%).
     - `'late-bear'`: Market downturn in final years (proves SRR mathematical asymmetry).
     - `'inflation-spike'`: Stagflation scenario (inflation surges to 7–9% in years 1–3).
  3. **Optimal SWR Solver (`findSafeWithdrawalRate`):**
     - Computes the maximum safe initial withdrawal rate that preserves $\ge 90\%$ portfolio survival under selected sequence shocks and dynamic rules.
  4. 100% offline-first, pure client-side math (ADR-001), zero breaking changes to existing `simulateMonteCarloRetirement` interface.
- **Target Files (<= 5 files, ~200 lines):**
  1. `js/engines/monte-carlo.js` (Implement dynamic withdrawal rules, sequence shocks, and `findSafeWithdrawalRate`)
  2. `tests/sequence-risk.test.mjs` (New test suite for SRR and dynamic SWR rules)
  3. `tests/smoke.test.mjs` (Contract assertions for new simulator APIs)
- **Explicit Out of Scope:**
  - No external statistical libraries (ADR-001).
  - No alteration of existing baseline Monte Carlo results when default parameters are passed.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `js/engines/monte-carlo.js`, `tests/sequence-risk.test.mjs`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% offline-first privacy)
  - ADR-002 (Modular domain engine architecture)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `js/engines/monte-carlo.js`:
  - Extend `MonteCarloSimulationParams` with `withdrawalStrategy`, `sequenceShock`, `guardrailUpper`, `guardrailLower`, `spendingFloor`, `spendingCeiling`.
  - In `simulateMonteCarloRetirement`: implement year-by-year shock overrides and dynamic withdrawal recalculations (Guyton-Klinger & variable spending).
  - Implement `MoneyApp.findSafeWithdrawalRate(params, targetSurvival)`.
  - Implement `MoneyApp.compareWithdrawalStrategies(params)` returning side-by-side comparison.
- **Step 2:** Create `tests/sequence-risk.test.mjs`:
  - Assert that `early-bear` produces significantly lower survival than `late-bear` under constant withdrawals (SRR mathematical invariant).
  - Assert that Guyton-Klinger and variable-spending significantly increase survival during early-bear shocks.
  - Assert that `findSafeWithdrawalRate` converges to valid rate in `[0.01, 0.15]`.
  - Assert zero `NaN`, `Infinity`, or negative zero across all outputs.
- **Step 3:** In `tests/smoke.test.mjs`:
  - Add smoke assertions for `findSafeWithdrawalRate` and `compareWithdrawalStrategies`.
- **Step 4:** QA & Debugger verification (`npm run lint`, `npm test`).
- **Step 5:** Code & Security Reviewer adversarial audit.
- **Step 6:** Release & Docs (bump v2.5.71, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] `simulateMonteCarloRetirement` supports `'constant'`, `'guyton-klinger'`, and `'variable-spending'` withdrawal rules.
- [x] `simulateMonteCarloRetirement` supports `'early-bear'`, `'late-bear'`, and `'inflation-spike'` sequence shocks.
- [x] Mathematical invariant verified: `early-bear` survival rate < `late-bear` survival rate under constant withdrawals.
- [x] Guyton-Klinger guardrails mitigate early bear sequence risk, boosting survival probability.
- [x] `findSafeWithdrawalRate` computes optimal initial SWR for a given confidence target.
- [x] 100% backward compatible with existing calls; zero dependencies.
- [x] All tests pass in `npm test` with 0 Biome linter errors/warnings.
- [x] Released, bumped to v2.5.71, and pushed to `origin/master`.
