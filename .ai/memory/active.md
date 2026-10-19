---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 126 — Interactive Debt Payoff Visual SVG Comparison Timeline (v2.5.67)

#### 1. Goal & Scope Limits
- **Objective:**
  Elevate the debt payoff visualization in `debt-calculator.html` and `js/debt-calculator.js` from a static curve to a high-precision, interactive dual-line SVG comparison timeline:
  1. Interactive pointer scrubbing (`pointermove` / `touchmove`) with dynamic vertical crosshair `<line id="svgChartCrosshair">` tracking exact months across Avalanche and Snowball curves.
  2. Floating rich tooltip (`#debtChartTooltip`) displaying month, remaining principal for both Avalanche and Snowball, interest saved delta, and milestone loan payoff callouts (`🎉 Debt Paid Off!`).
  3. Interactive chart view modes (`#btnChartModeDual`, `#btnChartModeAvalanche`, `#btnChartModeSnowball`) and clickable legend toggles to quickly focus on individual strategies or compare side-by-side.
  4. Milestone inspection dots on both curves showing exactly when and where debts are eliminated.
  5. 100% offline-first, zero external chart libraries, touch-optimized for mobile.
- **Target Files (<= 5 files, ~200 lines):**
  1. `debt-calculator.html` (Add chart wrapper `#debtChartWrapper`, `#debtChartTooltip`, view mode selector buttons)
  2. `js/debt-calculator.js` (Implement `setupDebtChartInteractions()`, interactive crosshair scrubbing, and view mode filtering in `renderDebtChart()`)
  3. `js/i18n/th.js` (Add i18n keys for chart mode buttons and comparison tooltip)
  4. `js/i18n/en.js` (Add English parity keys)
  5. `tests/smoke.test.mjs` (Add Phase 126 interactive SVG debt comparison timeline contract tests)
- **Explicit Out of Scope:**
  - No external SVG/Canvas charting libraries (ADR-001).
  - No alteration of underlying debt simulation algorithms (`simulate` / `simulateMinOnly`).

#### 2. Architecture & Decision Alignment
- **Affected Components:** `debt-calculator.html`, `js/debt-calculator.js`, `js/i18n/*.js`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% client-side privacy)
  - ADR-002 (Modular iframe app shell)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `debt-calculator.html`:
  - Wrap SVG inside `#debtChartWrapper` with relative positioning.
  - Add floating tooltip container `#debtChartTooltip`.
  - Add view mode toggle buttons (`#btnChartModeDual`, `#btnChartModeAvalanche`, `#btnChartModeSnowball`) above the chart.
- **Step 2:** In `js/debt-calculator.js`:
  - Enhance `renderDebtChart()` to support `state.chartMode` ('dual', 'avalanche', 'snowball').
  - Render crosshair line `<line id="svgChartCrosshair">` and indicator dots.
  - Implement `setupDebtChartInteractions()` to bind pointer events (`pointermove`, `pointerleave`) on the chart wrapper, calculate month coordinate from clientX, and update tooltip and crosshair.
  - Implement clickable legend items allowing users to toggle active strategy or view mode.
- **Step 3:** In `js/i18n/th.js` and `en.js`:
  - Add `chartModeDual`, `chartModeAvalanche`, `chartModeSnowball`, `chartTooltipBalance`, `chartTooltipSaved`.
- **Step 4:** In `tests/smoke.test.mjs`:
  - Add assertions verifying `#debtChartWrapper`, `#debtChartTooltip`, `#svgChartCrosshair`, view mode buttons, and i18n keys.
- **Step 5:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 6:** Adversarial Code & Security Review.
- **Step 7:** Release & Docs (bump v2.5.67, lessons.md, commit, and push).

#### 4. Acceptance Criteria
- [x] User can scrub across `#svgDebtChart` with mouse or touch to see dynamic vertical crosshair and floating tooltip `#debtChartTooltip`.
- [x] Tooltip accurately reports Month, Avalanche Balance, Snowball Balance, and milestone payoff notifications.
- [x] View mode buttons (`#btnChartModeDual`, `#btnChartModeAvalanche`, `#btnChartModeSnowball`) toggle curve visibility cleanly.
- [x] Bilingual parity between `th.js` and `en.js`.
- [x] Zero Biome lint warnings/errors.
- [x] All tests pass in `npm test`.
- [x] Released, bumped to v2.5.67, and pushed to `origin/master`.
