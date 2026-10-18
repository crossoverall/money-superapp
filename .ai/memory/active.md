---
task_id: "SDLC-PHASE-83-GLIDEPATH-DCA-TO-BUDGET-BRIDGE"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 83 - v2.5.26)
1. **Outbound Investment DCA Bridge in Rebalance (`rebalance.html` & `js/rebalance.js`):**
   - Add `#btnBridgeDcaToBudget` in `#panelBudget` and `#btnBridgeGlidepathToBudget` in `#panelTargetDateGlidepath`.
   - Implement `bridgeDcaToBudget(source)` setting `moneySuperapp.pendingDcaBudget` and switching tab to `remaining-money`.
2. **Inbound Savings Bridge in Remaining Money (`remaining-money.html` & `js/remaining-money.js`):**
   - Add `#dcaBudgetBridgeAlert` banner in `remaining-money.html`.
   - Implement `checkPendingDcaBudget()` in `js/remaining-money.js` to upsert into `state.savings`.
   - Recompute cash flow, push undo snapshot, and show notification toast.
3. **Verification & Delivery:**
   - Unit and smoke tests in `tests/shared.test.mjs` and `tests/smoke.test.mjs`.
   - Headless CDP script capturing screenshots.
   - Biome check & bump to `v2.5.26`.
