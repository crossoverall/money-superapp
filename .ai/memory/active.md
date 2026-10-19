---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 125 — Universal Cloud Export (Debt Payoff & Rebalance Orders to Google Drive / Sheets / PDF) (v2.5.66)

#### 1. Goal & Scope Limits
- **Objective:**
  Complete the Universal Cloud Export initiative across the entire Money Superapp financial suite by adding Google Drive and Sheets export to:
  1. `debt-calculator.html` / `js/debt-calculator.js`: Export debt freedom amortization schedule, payment breakdown (Principal vs Interest), and strategy comparison (Snowball vs Avalanche) as an actionable CSV ledger or printable PDF plan.
  2. `rebalance.html` / `js/rebalance.js`: Export asset allocation rebalance orders, buy/sell shortfall calculations, and DCA execution plans as an investment CSV order sheet or printable PDF report.
  Apply strict CWE-1236 CSV formula injection defense (`csvSafe`), UTF-8 BOM (`\uFEFF`), Web Share API with file payload, fallback download, and direct shortcuts to `drive.google.com` and `sheets.new`.
- **Target Files (<= 5 files, ~180 lines):**
  1. `debt-calculator.html` (Add `#btnSaveToDrive` button and `#driveExportModal` modal dialog)
  2. `js/debt-calculator.js` (Implement `generateDebtAmortizationCSV`, `openDriveModal`, `closeDriveModal`, `saveToGoogleDrive`)
  3. `rebalance.html` (Add `#btnSaveToDrive` button and `#driveExportModal` modal dialog)
  4. `js/rebalance.js` (Implement `generateRebalanceOrdersCSV`, `openDriveModal`, `closeDriveModal`, `saveToGoogleDrive`)
  5. `tests/smoke.test.mjs` (Add smoke tests asserting existence of modal triggers, CSV generators, and CWE-1236 escaping)
- **Explicit Out of Scope:**
  - Zero external SDKs or remote scripts (ADR-001 100% offline-first privacy).
  - No changes to debt payoff formulas or asset rebalance mathematical calculations.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `debt-calculator.html`, `js/debt-calculator.js`, `rebalance.html`, `js/rebalance.js`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy)
  - ADR-002 (Modular Multi-Tool Iframe App Shell)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `debt-calculator.html`:
  - Add `#btnSaveToDrive` in toolbar.
  - Add `#driveExportModal` modal with format selector (CSV / PDF) and shortcuts to Google Drive / Sheets.
- **Step 2:** In `js/debt-calculator.js`:
  - Implement `generateDebtAmortizationCSV()` producing structured debt amortization schedule with UTF-8 BOM and CWE-1236 formula neutralization.
  - Implement `openDriveModal`, `closeDriveModal`, and `saveToGoogleDrive()`.
- **Step 3:** In `rebalance.html`:
  - Add `#btnSaveToDrive` in action toolbar.
  - Add `#driveExportModal` modal dialog.
- **Step 4:** In `js/rebalance.js`:
  - Implement `generateRebalanceOrdersCSV()` producing asset allocation orders with UTF-8 BOM and CWE-1236 formula neutralization.
  - Implement `openDriveModal`, `closeDriveModal`, and `saveToGoogleDrive()`.
- **Step 5:** In `tests/smoke.test.mjs`:
  - Add contract tests asserting existence of `#btnSaveToDrive`, `#driveExportModal`, and CSV generation functions with CWE-1236 escaping tests for both tools.
- **Step 6:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 7:** Code & Security Reviewer adversarial audit.
- **Step 8:** Release & Docs (bump v2.5.66, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] User can click `#btnSaveToDrive` in `debt-calculator.html` to open `#driveExportModal` and export Debt Amortization schedule to Google Drive (CSV or PDF).
- [x] User can click `#btnSaveToDrive` in `rebalance.html` to open `#driveExportModal` and export Portfolio Rebalance orders to Google Drive (CSV or PDF).
- [x] CSV outputs contain valid UTF-8 BOM (`\uFEFF`) and parse cleanly into Google Sheets and Excel.
- [x] CWE-1236 CSV formula injection is fully neutralized (`'` prefix for formula characters) across both tools.
- [x] Web Share API with file payload operates on supported devices, with graceful fallback to download.
- [x] Zero Biome lint warnings/errors.
- [x] All tests pass in `npm test`.
- [x] Released, bumped to v2.5.66, and pushed to origin master.
