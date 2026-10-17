---
task_id: "FEAT-VISUALIZATION-02"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Debt Payoff Trajectory SVG Amortization Curve (Phase 5 Slice 2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive, zero-dependency SVG visualization to `debt-calculator.html` displaying the debt balance amortization trajectory over time.
- **Target Files (<= 5 files):**
  1. `debt-calculator.html` (Add SVG chart container, `renderPayoffChart()` rendering dual curves: current strategy vs minimum-only, axes, markers, and localized legend)
  2. `tests/financial-math.test.mjs` (Add unit test for simulation schedule points)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Third-party chart libraries (No Chart.js, No D3).
  - Heavy canvas rendering.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side offline SVG, zero telemetry.
- **ADR-002 (Iframe Isolation):** Self-contained within `debt-calculator.html`.
- **Consistent Theme:** Reuses CSS variables (`--core`, `--ok`, `--warn`, `--panel`, `--line`, etc.) for seamless light/dark mode support.

#### 3. Step-by-Step Implementation Summary
1. **HTML & CSS Structure:**
   - Added `#debtChartPanel` between strategy comparison cards and the detailed monthly table.
   - Pure SVG viewport (`viewBox="0 0 600 220"`, `preserveAspectRatio="none"`).
   - Localized legend with visual indicators for Current Strategy, Minimum Only, and Milestones.
2. **Chart Rendering Function (`renderPayoffChart`):**
   - Tracks monthly balance progression in `simulate()` via `trajectory` array (`[{ month, balance }]`).
   - Maps coordinates `(x, y)` based on max debt balance and max months across strategies.
   - Plots dual trajectories:
     - 🟢 **Current Strategy** (with extra payment): Solid emerald green line with subtle vertical gradient area fill.
     - 🟠 **Minimum Only**: Dashed amber line (`#f59e0b`) illustrating baseline interest drag.
   - Plots milestone marker circles at exact payoff months for each debt account.
   - Shows empty-state banner when debt balance is zero.
3. **Bilingual Localization:**
   - English and Thai strings for chart title, legend items, milestone tooltips, and axis labels.
4. **Verification & Tests:**
   - Added `simulateTrajectory` unit test in `tests/financial-math.test.mjs`.
   - 30 unit tests pass in 63ms.
   - Biome check passes with 0 errors.
   - Bumped to `v1.8.8` via `node scripts/bump.mjs patch`.

#### 4. Acceptance Criteria
- [x] SVG curve accurately reflects balance reduction across months for both current strategy and minimum-only.
- [x] Milestone dots mark exact months where specific loans are paid off.
- [x] Fully responsive on mobile, desktop, and print.
- [x] Bilingual support (TH / EN).
- [x] Zero build step and passes `npm test` and `npm run lint`.
