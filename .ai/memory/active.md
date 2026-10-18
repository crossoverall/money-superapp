---
task_id: "SDLC-PHASE-95-CASHFLOW-VIZ-EXTRACTION"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Completed SDLC Task (Phase 95 - Decompose remaining-money.js: Cash Flow Visualization Engine)
- **Delivered**:
  - Extracted pure SVG flow math and visualizers into `js/engines/cashflow-viz.js` (`MoneyApp.CashflowViz`):
    - `classifyBudgetType(item, defaultType)`
    - `calculateBudgetRule503020(options)`
    - `calculateEmergencyRunway(options)`
    - `generateSankeyRibbonPath(x0, y0Top, y0Bot, x1, y1Top, y1Bot)`
    - `calculateSankeyFlows(options)`
    - `renderCashflowWaterfall(svgEl, options)`
    - `renderCashflowSankey(svgEl, options)`
  - Registered `js/engines/cashflow-viz.js` in `sw.js` and all 8 core HTML files.
  - Refactored `js/remaining-money.js` into clean forwarders, shrinking it by >600 lines while preserving 100% backward compatibility.
  - Added unit test suite in `tests/cashflow-viz.test.mjs` (8 tests).
  - Added smoke invariant in `tests/smoke.test.mjs` (63 tests).
  - Verified 100% test pass rate (452 tests across 109 suites) and 0 Biome warnings/errors.
  - Released and bumped to `v2.5.38`.
