---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "level_1"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Phase 116 — Secondary Page Decomposition: Dashboard Visualizations Modularization

#### 1. Goal & Scope Limits
- **Objective:**
  Decompose `js/dashboard.js` (currently 4,146 LOC) by extracting SVG chart generation and visualization rendering logic into a standalone engine module: `js/engines/dashboard-viz.js` (`window.MoneyApp.DashboardViz`).
  Extract:
  1. `renderHistoricalChart()`: SVG spline/area chart, dynamic gradient definitions, axis ticks, interactive data points, and tooltip lifecycle.
  2. `buildSmoothSvgPath()`: Catmull-Rom or cubic bezier spline curve coordinate calculation.
  3. `renderMonteCarloFanChart()`: 10th-90th percentile confidence fan polygon, median polyline, zero baseline, and year tick rendering.
  4. `renderDonutComposition()`: 3-segment SVG Donut arc dasharray/dashoffset calculations and solvency state.
- **Target Files (<= 5 files, ~250 lines):**
  1. `js/engines/dashboard-viz.js` (New file)
  2. `js/dashboard.js` (Delegate chart rendering to `window.MoneyApp.DashboardViz`)
  3. `dashboard.html` (Include script tag for `js/engines/dashboard-viz.js`)
  4. `sw.js` (Add `js/engines/dashboard-viz.js` to `ASSETS_TO_CACHE`)
  5. `tests/dashboard-viz.test.mjs` (New unit test suite verifying visualizer functions)
- **Explicit Out of Scope:**
  - No changes to financial math calculations (`js/engines/financial-health.js`, `monte-carlo.js`, etc.).
  - No changes to child iframe layouts or other calculators.
  - No changes to DOM element IDs or class names in `dashboard.html`.

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `js/dashboard.js`, `js/engines/dashboard-viz.js`, `dashboard.html`, `sw.js`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA Architecture):** Pure vanilla JavaScript, export to `window.MoneyApp.DashboardViz` via IIFE, zero npm runtime dependencies.
  - **ADR-002 (Modular Multi-Tool Iframe App Shell Architecture):** Protects clean separation of concerns within `dashboard.html`.
  - **ADR-005 (Automated Semantic Version Bumping & SW Cache Invalidation):** Include new asset in `sw.js` manifest and bump version atomically.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Create `js/engines/dashboard-viz.js` under `window.MoneyApp.DashboardViz` with JSDoc annotations.
- **Step 2:** Update `dashboard.html` to load `<script src="js/engines/dashboard-viz.js"></script>` before `js/dashboard.js`.
- **Step 3:** Update `sw.js` `ASSETS_TO_CACHE` to include `'js/engines/dashboard-viz.js'`.
- **Step 4:** Refactor `js/dashboard.js` to delegate chart rendering calls cleanly to `window.MoneyApp.DashboardViz`.
- **Step 5:** Create `tests/dashboard-viz.test.mjs` verifying curve generation, percentile geometry, and SVG Donut math.
- **Step 6:** Run smoke, lint, and full test suite verification.

#### 4. Acceptance Criteria
- [x] `js/engines/dashboard-viz.js` is created and exports `window.MoneyApp.DashboardViz` cleanly.
- [x] Historical SVG spline area chart, Monte Carlo fan chart, and Net Worth Donut render identically without visual regressions.
- [x] `dashboard.html` includes `js/engines/dashboard-viz.js` script tag.
- [x] `sw.js` includes `js/engines/dashboard-viz.js` in `ASSETS_TO_CACHE`.
- [x] `tests/dashboard-viz.test.mjs` passes all tests.
- [x] `npm run lint` passes with 0 errors and 0 warnings.
- [x] `npm test` passes 100% across all suites (654 tests passing).
- [x] Smoke test passes with 0 errors (84 tests passing).

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:** Working tree clean, baseline tests passing.
- **Verification Commands:**
  - `npm run lint`
  - `node --test tests/smoke.test.mjs`
  - `node --test tests/dashboard-viz.test.mjs`
  - `node tests/e2e-browser-journeys.test.mjs`
  - `npm test`
