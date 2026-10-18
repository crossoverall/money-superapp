---
task_id: "SDLC-PHASE-96-BUDGET-IMPORT-EXTRACTION"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Completed SDLC Task (Phase 96 - Decompose remaining-money.js: Budget Data Importer & Parser Engine)
- **Delivered**:
  - Extracted pure RFC-4180 CSV parsing, column detection, subtotal filtering, and JSON/CSV data extraction into `js/engines/budget-import.js` (`MoneyApp.BudgetImport`):
    - `parseCSVRows(csvText)`
    - `detectColumns(headerRow)`
    - `cleanField(val)`
    - `cleanAmount(val)`
    - `isSubtotalRow(cat, item)`
    - `parseImportJSON(text, options)`
    - `parseImportCSV(text, options)`
  - Registered `js/engines/budget-import.js` in `sw.js` and all 8 core HTML files.
  - Refactored `js/remaining-money.js` into clean forwarders, shrinking it from 3,832 LOC to 3,445 LOC (total 1,000 LOC reduced across Phases 95 and 96).
  - Added unit test suite in `tests/budget-import.test.mjs` (7 tests).
  - Added smoke invariant in `tests/smoke.test.mjs` (64 smoke tests).
  - Verified 100% test pass rate (460 tests across 109 suites) and 0 Biome warnings/errors.
  - Released and bumped to `v2.5.39`.
