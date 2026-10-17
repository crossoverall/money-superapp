---
task_id: "FEAT-UNDO-RECOVERY-02"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Universal Undo Manager & Crash Recovery (Phase 4 Slice 2)

#### 1. Goal & Scope Limits
- **Objective:** Extend in-memory Undo management (`MoneyApp.createUndoManager`) and crash recovery (`MoneyApp.safeJsonParse`) to `rebalance.html` and `tax-calculator-base.html`.
- **Target Files (<= 5 files):**
  1. `rebalance.html` (Integrate undo on asset additions/removals/reorders/presets/resets, replace raw JSON.parse with safeJsonParse)
  2. `tax-calculator-base.html` (Integrate safeJsonParse and undo on severance resets and parameter changes)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Introducing any external state management libraries (100% zero-dependency vanilla JS).
  - Modifying financial calculation formulas.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Undo histories are kept strictly in-memory per session.
- **ADR-002 (Iframe Isolation):** Each iframe maintains its independent undo manager.
- **ADR-004 (Decoupled State):** Rebalancing and Tax calculators only modify their own scope.

#### 3. Step-by-Step Implementation Plan
1. **Analyze `rebalance.html`:**
   - Locate state storage key (`rebalanceCalculator.state.v1`), preset loaders, and reset button.
   - Replace raw `JSON.parse(localStorage.getItem(...))` with `MoneyApp.safeJsonParse(...)`.
   - Setup `undoMgr = MoneyApp.createUndoManager(...)` with snapshot capture and restore.
   - Attach undo captures before:
     - Adding asset / group
     - Deleting asset
     - Reordering assets (move up / move down)
     - Applying minimum budget suggestion
     - Checking / loading pending budget from Remaining Money tool
     - Resetting portfolio
   - Add visual `↩` undo button in header and bottom bar with keyboard shortcut `Ctrl+Z`.
2. **Analyze `tax-calculator-base.html`:**
   - Locate state storage key (`moneySuperapp.taxBase`).
   - Replace raw `JSON.parse` with `MoneyApp.safeJsonParse`.
   - Setup `undoMgr` for restoring state on reset or major edits.
   - Add visual `↩` undo button at top and bottom.
3. **Verify:**
   - Run `npm test` and `npm run lint`.
   - Bump version to `v1.8.6` via `node scripts/bump.mjs patch`.
   - Commit and push to `origin/master`.

#### 4. Acceptance Criteria
- [x] In `rebalance.html`, asset additions, deletions, reorderings, preset loads, and resets can be undone with 1 click or `Ctrl+Z`.
- [x] In `tax-calculator-base.html`, data clearing and resets can be undone.
- [x] Corrupted localStorage keys gracefully fallback without crashing the calculators.
- [x] `npm test` and `npm run lint` pass with 0 errors.

#### 5. Verification Strategy
- Run `npm test` to verify math integrity (27 tests passing).
- Run `npm run lint` with Biome (0 errors).
- Automated version bump to `v1.8.6` applied.
