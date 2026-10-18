---
task_id: "SDLC-PHASE-77-DEBT-REFINANCE-SAVINGS-BRIDGE"
status: "ready_for_release"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 77 - v2.5.20)
1. **Refinancing Cash Flow Relief Capture:**
   - Debt refinancing frees up monthly cash flow (`monthlyPaymentDiff > 0`).
   - Add 1-click bridge buttons in `debt-calculator.html` to direct freed cash into `remaining-money.html` (household budget) or `rebalance.html` (DCA investing).
2. **Accelerated Elimination Budgeting:**
   - When term shortening increases monthly payment (`monthlyPaymentDiff < 0`), bridge extra expense into `remaining-money.html`.
3. **Core Math Normalization:**
   - Standardize `calculateDebtConsolidation` into `js/shared.js` (`MoneyApp.calculateDebtConsolidation`).
4. **Verification & Delivery:**
   - Unit tests in `tests/shared.test.mjs`.
   - Headless CDP verification (Light, Dark, Mobile).
   - Biome clean & 0 errors.
