---
task_id: "FEAT-BUDGET-TEMPLATES-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Recurring Budget Profiles & Templates (Phase 7 Item 3.3)

#### 1. Goal & Scope Limits
- **Objective:** Add customizable recurring budget templates ("Save as Template" / "Load Template") and curated financial presets (First Jobber, Mid-Career, Freelancer) in `remaining-money.html` to streamline monthly budgeting without tedious data re-entry.
- **Target Files (<= 5 files):**
  1. `remaining-money.html` (Template modal, preset loader, custom template persistence, undo snapshot integration)
  2. `tests/financial-math.test.mjs` (Unit test for budget template serialization/hydration and preset schema integrity)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Complex multi-month recurring scheduling or external calendar sync.
  - Third-party template libraries.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% offline, stored in client-side `localStorage.getItem('moneySuperapp.budgetTemplates.v1')`.
- **ADR-002 (Iframe Isolation):** Self-contained in `remaining-money.html`.
- **Undo Integration:** Loading any template captures an in-memory snapshot in `undoMgr` first for instant rollback (`Ctrl+Z`).

#### 3. Step-by-Step Implementation Summary
1. **Curated Starter Presets:**
   - 💼 **First Jobber**: Salary 25k, Rent 6k, Utilities 1.2k, Food 7k, Travel 2.5k, Emergency Fund 2.5k.
   - 👨‍👩‍👧 **Family & Mid-Career**: Salary 60k, Allowance 5k, Mortgage 15k, Utilities 3.5k, Groceries 12k, Insurance 3k, Savings 10k.
   - 🌴 **Freelancer / Variable**: Project Income 45k, Withholding Tax 3%, Tech Tools 3k, Rent 8k, Living 9k, Health 2.5k, Safety Fund 10k.
2. **Custom User Templates:**
   - Saved in `localStorage.getItem('moneySuperapp.budgetTemplates.v1')`.
   - Name input, quick save, item summary badges (incomes, expenses, net cashflow).
   - "นำไปใช้ (Apply)" and "🗑️ (Delete)" with user confirmation.
3. **Undo Integration:**
   - Automatic snapshot capture in `undoMgr` prior to applying any template, allowing one-key rollback via `Ctrl+Z` or ↩ Undo.
4. **Bilingual Localization:**
   - Complete Thai and English strings for modal header, placeholders, buttons, and preset descriptions.
5. **Verification & Tests:**
   - Added unit test `Budget Template Serialization & Presets` in `tests/financial-math.test.mjs`.
   - All 33 unit tests pass in 61ms.
   - Biome linter passes with 0 errors.
   - Bumped to `v1.9.0` via `node scripts/bump.mjs minor`.

#### 4. Acceptance Criteria
- [x] Users can save their current custom budget under any custom name.
- [x] Users can load starter presets or saved custom templates with 1 click.
- [x] Instant rollback via `Ctrl+Z` undo is preserved.
- [x] Both Thai and English languages are fully supported.
- [x] All 33 automated tests pass and Biome check passes cleanly.
