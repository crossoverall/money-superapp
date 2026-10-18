---
task_id: "SDLC-PHASE-98-REBALANCE-SUBTOOLS-DECOMPOSITION"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 98 - Decompose rebalance.js: Portfolio Auxiliary Sub-tools Engine)
1. **Diagnosis**:
   - `js/rebalance.js` was 3,558 lines, mixing core rebalancing with ~900 lines of auxiliary sub-tools (Gold DCA, Foreign Tax Advisor, Target Date Glidepath).
2. **Strategy & Slices Executed**:
   - Slice 1: Created `js/engines/rebalance-subtools.js` (`MoneyApp.RebalanceSubtools`) encapsulating Gold, Foreign Tax, and Glidepath controllers, states, and UI coordinators.
   - Slice 2: Registered `js/engines/rebalance-subtools.js` in `sw.js` and all 8 core HTML files.
   - Slice 3: Refactored `js/rebalance.js` to delegate auxiliary sub-tool operations cleanly to `MoneyApp.RebalanceSubtools`, reducing `rebalance.js` from 3,558 to 2,912 LOC (shrunk by 646 lines).
   - Slice 4: Created unit tests in `tests/rebalance-subtools.test.mjs` (5 unit tests, all passing).
   - Slice 5: Added Phase 98 smoke invariant in `tests/smoke.test.mjs`.
   - Slice 6: Full QA verification (`rtk npm run lint` 0 errors, 473 tests across 109 suites pass 100%).
   - Slice 7: Released patch `v2.5.41`, updated lessons.md and active.md.
