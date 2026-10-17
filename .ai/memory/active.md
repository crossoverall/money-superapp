---
task_id: "FEAT-MODULARIZE-ALL-SCRIPTS-02"
status: "in_progress"
current_stage: "coder"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Active Task: Complete Architectural Script Modularization (Phase 44 / v2.2.7)
- **Goal:** Extract all remaining inline `<script>` blocks across the repository into dedicated standalone `.js` modules in `js/`, eliminating 4,000+ lines of HTML bloat, enabling full browser caching, and registering them in `sw.js`.
- **Target Files:**
  1. `tax-calculator-base.html` $\to$ `js/tax-calculator-base.js`
  2. `tax-calculator.html` $\to$ `js/tax-calculator.js`
  3. `months-slips.html` $\to$ `js/months-slips.js`
  4. `index.html` $\to$ `js/app-shell.js`
- **Cache Registration:** Update `sw.js` with `'./js/tax-calculator-base.js'`, `'./js/tax-calculator.js'`, `'./js/months-slips.js'`, and `'./js/app-shell.js'`.
- **Verification:** Run `npm test && npm run lint` to confirm 0 errors.
- **Compliance:** 100% offline-first PWA, zero runtime CDNs, zero telemetry, zero build step (ADR-001).
