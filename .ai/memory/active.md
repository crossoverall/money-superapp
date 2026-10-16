---
task_id: "FEAT-UNDO-RECOVERY-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Universal Undo Manager & Crash Recovery (Phase 4 Slice 1)

#### 1. Goal & Scope Limits
- **Objective:** Provide safety against accidental edits, resets, or data imports by introducing an in-memory Undo manager (`MoneyApp.createUndoManager`) and safe JSON parser (`MoneyApp.safeJsonParse`) in `js/shared.js`, piloted in `debt-calculator.html` and `remaining-money.html`.
- **Target Files (<= 5 files):**
  1. `js/shared.js` (Expose `safeJsonParse` and `createUndoManager` with `Ctrl+Z` shortcut listener)
  2. `tests/shared.test.mjs` (Automated unit tests for undo stack depth, push, pop, and corrupted JSON handling)
  3. `debt-calculator.html` (Integrate undo on debt deletions/resets/imports)
  4. `remaining-money.html` (Integrate undo on row deletions/resets/imports)
- **Explicit Out of Scope:**
  - Migrating all remaining tools in this single slice (will be done in Slice 2).
  - External state libraries (retains 100% zero-dependency vanilla JS).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** All undo history is kept purely in-memory in the client's current session.
- **ADR-002 (Iframe Isolation):** Each calculator has an isolated undo stack in its own frame context.
- **ADR-004 (Decoupled State):** Undo actions only affect the active tool's state.

#### 3. Step-by-Step Implementation Plan
1. **Enhance `js/shared.js`:**
   - Add `MoneyApp.safeJsonParse(key, fallback)`: safely deserializes localStorage with try/catch, returning fallback if corrupted or missing.
   - Add `MoneyApp.createUndoManager(options)`:
     - Maintains in-memory history stack (max 15 items).
     - Provides `.push(state)`, `.undo()`, `.canUndo()`.
     - Supports optional `Ctrl+Z` / `Cmd+Z` keyboard shortcut.
2. **Author Unit Tests in `tests/shared.test.mjs`:**
   - Test corrupted JSON string parsing with fallback.
   - Test undo stack overflow past max depth.
   - Test restoration sequence.
3. **Integrate into `debt-calculator.html`:**
   - Protect state loading with `safeJsonParse`.
   - Record undo state before `resetDefaults()`, `importFromRemainingMoney()`, and debt account deletions.
   - Display undo button when history is available.
4. **Integrate into `remaining-money.html`:**
   - Protect state loading with `safeJsonParse`.
   - Record undo state before clearing or importing.
5. **Run Biome and Test Suite:**
   - Verify `npm test` and `npm run lint`.

#### 4. Acceptance Criteria
- [x] `safeJsonParse` returns valid parsed object for valid JSON, and fallback for null/corrupted JSON.
- [x] `createUndoManager` supports `push`, `undo`, and enforces maximum stack depth.
- [x] In `debt-calculator.html`, clicking reset or importing allows immediate undo.
- [x] In `remaining-money.html`, data imports or resets can be reverted.
- [x] All automated tests pass (`npm test`) and Biome linter passes (`npm run lint`).

#### 5. Verification Strategy
- Run `npm test` for automated unit assertions (27 tests passing).
- Run `npm run lint` for code style and syntax checks (0 errors).
- Automated version bump to `v1.8.5` applied via `node scripts/bump.mjs patch`.
