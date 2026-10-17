---
task_id: "FEAT-GOAL-PROJECTION-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Transparent IndexedDB Storage Adapter & High-Capacity Snapshot Archive (Phase 23 / v2.0.6)
- **Status:** Completed & Verified (81 automated tests passing, 0 linter errors).
- **Summary:**
  1. Promise-based lightweight native `IndexedDB` key-value adapter in `js/shared.js` (`MoneyApp.idbStorage`) with automatic schema versioning, transaction wrappers, and transparent in-memory/localStorage fallback.
  2. Dual-write background mirroring on snapshot saves without UI thread blocking.
  3. Snapshot archival engine in `dashboard.html` that partitions records older than 12 months, freeing up localStorage while retaining multi-gigabyte historical archive in IndexedDB, with one-click restore and live quota inspection (`navigator.storage.estimate()`).
  4. Full bilingual Thai/English localization and timezone-invariant local calendar formatting.

---

### Proposed Feature Specification: Interactive Financial Goal Projection & Compound Scenario Simulator (Phase 24 / Roadmap Item 3.1)

#### 1. Goal & Scope Limits
- **Objective:** Enhance the Financial Goals & Milestones section in [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html) with an interactive Compound Growth Projection & Target Date Estimator.
- **Key Capabilities & Benefits:**
  1. **Compound Growth & Target Payoff/Goal Horizon Engine:**
     - Computes estimated completion month/year for Emergency Runway, Net Worth Milestones, and Debt Payoff based on active monthly savings, investment contributions, and user-configurable expected annual return (0% to 15%, defaulting to 5%).
  2. **Scenario Comparison Toggle (Conservative / Moderate / Aggressive):**
     - Shows milestone achievement timelines across 3 preset risk return profiles (Conservative 3%, Moderate 6%, Aggressive 9%) alongside cash-only baseline.
  3. **Interactive Target Horizon Badge & Visual Timeline Progress:**
     - Renders an estimated "Goal Reached by: [Mon YYYY]" badge on each goal card.
  4. **Zero External Dependencies (ADR-001):**
     - Pure client-side closed-form annuity/compound formula ($FV = PV(1+r)^n + PMT \frac{(1+r)^n - 1}{r}$).
  5. **Bilingual Localization (TH/EN):**
     - Full translation in Thai and English.
- **Target Files (<= 5 files, ~120-150 lines total):**
  1. `dashboard.html` (interactive projection parameters and milestone target date badges)
  2. `tests/financial-math.test.mjs` (unit tests verifying target date calculations and compound growth projection formulas)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Complex Monte Carlo simulations or server-side forecasting.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side privacy, fully offline-functional.
- **Preserves Existing Storage:** Compatible with existing `moneySuperapp.financialGoals.v1` schema.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Write unit tests for closed-form compound goal horizon calculation and monthly iteration solvers.
2. **Goal Horizon & Projection Engine (`dashboard.html`):**
   - Implement `calculateGoalHorizonMonths(currentVal, targetVal, monthlyPmt, annualRate)` and integrate into `renderFinancialGoals()`.
3. **UI Badges & Scenario Controls (`dashboard.html`):**
   - Add target date chips and expected return selector in the Goals card and modal.
4. **Verification & Quality Gate:**
   - Execute `npm test` and `npm run lint`.
5. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.7` via `node scripts/bump.mjs patch`.
