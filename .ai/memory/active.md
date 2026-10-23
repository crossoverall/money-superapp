---
task_id: "phase-133-rebalance-apply-suggested-allocation"
status: "completed"
current_stage: "idle"
iteration_count: 1
pipeline:
  - stage: "spec"
    status: "completed"
  - stage: "planning"
    status: "completed"
  - stage: "human_approval"
    status: "completed"
  - stage: "coding"
    status: "completed"
  - stage: "qa_verification"
    status: "completed"
  - stage: "code_review"
    status: "completed"
  - stage: "release"
    status: "completed"
---

### Feature Specification: Phase 133 — Rebalance Quick-Apply Suggested Allocation & Budget Deduction

#### 1. Goal & Requirements
- **User Requirement:**
  In the Rebalance tool (`rebalance.html`), provide an inline action button (check button `[✓]`) on each asset's suggested top-up row.
  - When clicked:
    1. Adds the calculated suggested top-up amount directly into that asset's holding value (`a.value += appliedAmount`).
    2. If units and price are tracked (`a.units > 0 && a.lastPrice > 0`), proportionally increments `a.units` based on effective price in THB.
    3. Subtracts the applied amount from the top-up budget at the top of the page (`state.totalBudget -= appliedAmount`), updating the budget input field.
    4. Triggers re-computation (`compute()`), causing the applied asset's suggested top-up to disappear/adjust to 0 and redistributing remaining budget across remaining shortfalls.
    5. Saves state (`saveState()`) and pushes the previous state to the Undo manager (`undoMgr.push(captureSnapshot())`) so users can undo (`Ctrl+Z` / Undo button).
    6. Announces action to assistive technology via `MoneyApp.announce`.

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `rebalance.html`: Add `.btn-apply-suggestion` styles matching Core, Ballast, and Satellite theme accent colors with high-contrast hover and focus-visible states.
  - `js/rebalance.js`:
    - Add `btnApplySuggestion` bilingual translations to `th` and `en` (ensuring 100% key symmetry).
    - Implement `applySuggestedAllocation(bucketId, idx, amount)`.
    - In `compute()`, render the check button `[✓]` next to `radd` when `add > 0.5` and bind click handlers.
    - Expose `applySuggestedAllocation` on `window.MoneyApp` for modular testability.
  - `tests/rebalance-apply-suggestion.test.mjs`:
    - New dedicated test suite testing math invariants, budget deduction, units update, undo reversion, and DOM interactions.
- **Constraints & Out of Scope:**
  - Zero external npm libraries or runtime dependencies (ADR-001).
  - Never allow negative budgets (`Math.max(0, ...)`).
  - Maintain 100% translation symmetry in `js/rebalance.js`.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `rebalance.html`, add CSS styling for `.btn-apply-suggestion` adhering to the Core/Ballast/Satellite design tokens.
- **Step 2:** In `js/rebalance.js`:
  - Add bilingual translation keys `btnApplySuggestion` to `translations.th` and `translations.en`.
  - Implement `applySuggestedAllocation(bucketId, idx, amount)`.
  - In `compute()`, render `.btn-apply-suggestion` beside `radd` for non-excluded assets where `add > 0.5`.
  - Attach click event listener to invoke `applySuggestedAllocation`.
- **Step 3:** Create `tests/rebalance-apply-suggestion.test.mjs` verifying:
  - Applying suggestion increments asset value accurately.
  - Total budget is decremented by exact applied amount.
  - Subsequent `compute()` clears or recalculates the applied asset's suggested top-up.
  - Proportional units incrementation works when units and price are tracked.
  - Calling `undoMgr.undo()` reverts both asset value and total budget.
- **Step 4:** Run `npm test` and `npm run lint` across all 748+ tests to verify zero regressions.
- **Step 5:** Complete Code & Security Review, bump version, and update `.ai/memory/lessons.md`.
