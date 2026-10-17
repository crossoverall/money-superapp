---
task_id: "FIX-I18N-LANGUAGE-MISMATCH"
status: "in_progress"
current_stage: "coder"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Active Task: Comprehensive i18n Audit & Language Mismatch Fixes
- **Goal:** Fix all missing translation mappings and hardcoded language strings identified in the user audit:
  1. `debt-calculator.html`: Add `lbl-milestone-road-title` translation, fix velocity `/mo` and `(Freedom 🎉)` labels.
  2. `tax-calculator-base.html`: Add Scenario Comparator translations (`lbl-toggle-scenario`, `lbl-compare-header`, `lbl-copy-curr-b`, `lbl-scen-income`, `lbl-scen-ded`, `lbl-scen-infl`), input placeholders.
  3. `rebalance.html` / `js/rebalance.js`: Add `lblDivTitle` translation and element registration.
  4. `months-slips.html`: Fix `Inst 1, 2, 3` labels in PIT reconciliation banner.
- **Verification:** Run `npm test` and `npm run lint`.

