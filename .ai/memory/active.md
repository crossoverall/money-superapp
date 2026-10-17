---
task_id: "SUPERWAVE-PHASE-60"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed in Phase 60 (v2.4.3):
- **Thai Stock Dividend Tax Credit Calculator (เครดิตภาษีเงินปันผล มาตรา 47 ทวิ แห่งประมวลรัษฎากร):**
  1. Pure math function `calculateThaiDividendTaxCredit(params)` and `computeThaiPitTax(netIncome)` in `js/shared.js` implementing statutory credit factors ($t / [1 - t]$ for CIT 20%, 25%, 15%, 0% BOI).
  2. Dual-scenario comparison: Scenario A (10% Withholding Tax Final Tax) vs Scenario B (Claim Section 47 bis Corporate Tax Credit).
  3. Interactive `#dividendTaxCreditCard` in `tax-calculator-base.html` with collapsible panel, quick preset pills (10k-500k), CIT rate selector, side-by-side comparison grid, verdict guidance callout, and "Apply to Total Tax" integration checkbox.
  4. Fully wired into Form P.N.D. 90 annual tax waterfall in `js/tax-calculator-base.js`, grossing up assessable income and crediting both dividend WHT and corporate tax credit against annual PIT liability.
  5. State persistence and hydration via `saveState()` and `loadState()`.
  6. Added test suite `tests/dividend-tax-credit.test.mjs` (5 tests) and smoke assertion in `tests/smoke.test.mjs`.
  7. 258 passing tests across 72 suites, 0 Biome errors, 100% localization symmetry.
