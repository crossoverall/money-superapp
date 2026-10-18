---
task_id: "SDLC-BUGFIX-FOREIGN-TAX-RUNTIME-AND-LAYOUT-CONTROLS"
status: "completed"
current_stage: "completed"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes (Browser Inspection)
1. **Uncaught Runtime Exception in `updateForeignTaxUI` (`js/rebalance.js:3118`):**
   - Headless Chrome DevTools Protocol (CDP) live inspection revealed:
     `TypeError: Cannot read properties of undefined (reading 'toFixed')` at `updateForeignTaxUI` during initial script execution (`initForeignTaxAdvisor()` at line 3453).
   - Root cause: `calculateForeignRepatriationTax` in `js/shared.js` returns `effectiveTaxRatePct`, whereas `updateForeignTaxUI` accessed `calc.effectiveTaxRate.toFixed(1)`. Parameter names and exemption fields also had key discrepancies (`pre2024Amount` vs `pre2024AccumulatedAmount`, etc.).
2. **Cascade Breakdown of Card Layout Initialization:**
   - Because the uncaught exception halted `rebalance.js` at line 3453:
     - Line 3454: `initTargetDateGlidepath()` was never executed.
     - Line 3456: `MoneyApp.initCardLayoutManager(...)` was never reached.
   - As a result, no card reordering controls (`card-reorder-controls` with `↑`, `↓`, `▲`/`▼`) were injected into any card header, and the 3 bottom auxiliary cards were never collapsed by default (`cardsWithControls = 0`, `cardsCollapsed = 0`).

### Atomic SDLC Action Plan
- **Slice 1: Bridge Parameter & Return Object Contract (`js/shared.js`, `js/rebalance.js`)**
  - In `js/shared.js` (`calculateForeignRepatriationTax`):
    - Support both input parameter naming conventions (`pre2024Amount` / `pre2024AccumulatedAmount`, `principalAmount` / `principalCapitalAmount`, `foreignTaxPaid` / `foreignTaxPaidThb`, `otherDomesticNetIncome` / `otherTaxableNetIncome`).
    - Add backward-compatible return properties (`effectiveTaxRate: effectiveTaxRatePct`, `totalExemptAmount`, `isResident`, `dtaForeignTaxCredit`, `netRetainedInThailand`).
  - In `js/rebalance.js` (`updateForeignTaxUI`):
    - Safe-guard numeric access: `((calc.effectiveTaxRate ?? calc.effectiveTaxRatePct) || 0).toFixed(1)`.
    - Harmonize input mapping and fallback object to match shared contracts.
    - Wrap auxiliary initializers (`initForeignTaxAdvisor()`, `initTargetDateGlidepath()`) in defensive `try/catch` blocks so a calculation quirk never impedes layout manager initialization.
- **Slice 2: Automated Verification & Smoke Regression Test (`tests/smoke.test.mjs`)**
  - Add end-to-end DOM test simulating full `rebalance.js` execution in JSDOM, asserting:
    1. Zero uncaught exceptions on load.
    2. All 6 `.reorder-card` elements have `.card-reorder-controls` attached.
    3. The 3 auxiliary panels (`#panelTargetDateGlidepath`, `#panelThaiGold`, `#panelForeignTaxAdvisor`) are collapsed with `.card-collapsed-hidden` on clean load.
  - Run full test suite (`npm test`) and Biome linter.
- **Slice 3: Live Chrome CDP Headless Inspection**
  - Execute `diagnose_browser.mjs` against local HTTP server to verify live Chrome execution produces:
    - 0 browser exceptions.
    - `cardsWithControls: 6`.
    - `cardsCollapsed: 3`.
    - Fresh full-page screenshot confirming visual folding and reorder button rendering.
- **Slice 4: Independent Security & Review Audit (`reviewer.md`)**
  - Verify ADR-001 offline invariance, zero telemetry, no CDN.
- **Slice 5: Release & Version Bump (`release.md`)**
  - Bump patch version (`v2.5.7`), update `.ai/memory/lessons.md`, commit and push one-by-one to `origin/master`.
