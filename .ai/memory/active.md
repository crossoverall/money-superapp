---
task_id: "FEAT-PORTFOLIO-HEATMAP-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Iframe Loading Skeleton, Haptic Feedback & Keyboard Tab Transitions (Phase 21 / v2.0.4)
- **Status:** Completed & Verified (74 automated tests passing, 0 linter errors).
- **Summary:** Shimmer animation loading skeleton overlay, tactile mobile haptic feedback (`navigator.vibrate`), accessible skip-to-content link, and zero-flash frame transitions.

---

### Proposed Feature Specification: Portfolio Allocation Intensity Heatmap & Currency Exposure Matrix (Phase 22 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Enhance [`rebalance.html`](file:///home/l2okii/Document/money-superapp/rebalance.html) and [`js/rebalance.js`](file:///home/l2okii/Document/money-superapp/js/rebalance.js) with an SVG Portfolio Allocation Intensity Heatmap & Currency Exposure Matrix.
- **Key Capabilities & Benefits:**
  1. **Allocation Intensity Heatmap:**
     - Color-coded grid / matrix representing each asset's weight and deviation intensity (Emerald for perfectly aligned, Blue for underweight/buy priority, Amber/Coral for overweight).
     - Provides an instant visual density map of portfolio concentration and risk clusters across buckets.
  2. **Currency Exposure Breakdown Bar:**
     - Displays aggregate exposure across currencies (THB, USD, EUR, GBP, JPY, SGD) with proportional segments and currency badges.
     - Helps multi-currency investors instantly identify excessive FX risk or home-currency bias.
  3. **Zero Dependencies & Offline SVG (ADR-001):**
     - Pure client-side SVG generation, responsive on mobile and desktop, zero external charting libraries.
  4. **Bilingual Localization (TH/EN):**
     - Full translation in Thai and English.
- **Target Files (<= 5 files, ~120-150 lines total):**
  1. `rebalance.html` (heatmap & currency exposure container markup)
  2. `js/rebalance.js` (SVG heatmap matrix & currency distribution renderer)
  3. `tests/financial-math.test.mjs` (unit tests verifying currency aggregation and heatmap cell coordinate scales)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Modifying underlying water-filling DCA mathematical algorithms (preserves existing verified allocator).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side privacy, fully offline-functional.
- **Preserves Existing State:** Compatible with existing `rebalanceCalculator.tiers.v1` and currency rates.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Write unit tests for multi-currency asset aggregation (summing THB equivalents per currency) and allocation deviation intensity scaling.
2. **SVG Heatmap & Currency Matrix Renderer (`js/rebalance.js`):**
   - Implement `renderAllocationHeatmap(tiers, allocations)` and `renderCurrencyExposure(assets)`.
3. **Markup & Toggle Integration (`rebalance.html`):**
   - Embed heatmap & currency breakdown section with view toggle or complementary summary card.
4. **Verification & Quality Gate:**
   - Execute `npm test` and `npm run lint`.
5. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.5` via `node scripts/bump.mjs patch`.
