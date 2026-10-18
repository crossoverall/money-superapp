---
task_id: "SDLC-PHASE-81-INSURANCE-COVERAGE-GAP-BUDGET-BRIDGE"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 81 - v2.5.24)
1. **Protection Gap to Budget Bridge (`dashboard.html` & `js/dashboard.js`):**
   - When `calc.protectionGap > 0`, calculate realistic Term Life Insurance premium estimate using `MoneyApp.calculateTermLifePremiumEstimate(coverageGap)`.
   - Add `#box-ins-premium-bridge` inside `#panelInsuranceAdequacy` with estimated monthly/annual premiums, tax savings, and `#btnBridgeInsuranceToBudget`.
   - Dispatch `moneySuperapp.pendingInsurancePremium` and route to `remaining-money.html`.
2. **Inbound Expense Bridge in Remaining Money (`remaining-money.html` & `js/remaining-money.js`):**
   - Add `#insurancePremiumBridgeAlert` banner in `remaining-money.html`.
   - Implement `checkPendingInsurancePremium()` in `js/remaining-money.js` to insert/update the term life insurance premium into `state.expenses`.
   - Recompute cash flow, trigger undo snapshot, and show notification toast.
3. **Shared Math Engine & Localized Symmetry (`js/shared.js`):**
   - Build `MoneyApp.calculateTermLifePremiumEstimate(coverageGap, options)`.
   - Unit tests in `tests/shared.test.mjs` and smoke tests in `tests/smoke.test.mjs`.
4. **Verification & Delivery:**
   - Headless CDP script capturing screenshots (gap active, adequate protected, budget bridge alert, dark/mobile).
   - Biome check & bump to `v2.5.24`.
