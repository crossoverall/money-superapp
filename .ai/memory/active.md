---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 120 — Save Expense Tracking Data to Google Drive (CSV / PDF)

#### 1. Goal & Scope Limits
- **Objective:**
  Implement a dedicated "Save to Google Drive" feature in `remaining-money.html` allowing users to export their cash flow and expense tracking data to Google Drive as an expense-tracking CSV ledger (optimized for Google Sheets) or a PDF summary document.
  Support native Web Share API (`navigator.share({ files: [...] })`) for 1-tap mobile saving to Google Drive, automatic fallback to file download, and 1-click shortcuts to open Google Drive and Google Sheets.
- **Target Files (<= 5 files, ~150 lines):**
  1. `remaining-money.html` (Add `#btnSaveToDrive` button and `#driveExportModal` modal dialog)
  2. `js/remaining-money.js` (Add `generateExpenseLedgerCSV`, `saveToGoogleDrive`, `openDriveModal`, `closeDriveModal`)
  3. `js/i18n/th.js` (Add Thai i18n keys for Google Drive modal and actions)
  4. `js/i18n/en.js` (Add English i18n keys for Google Drive modal and actions)
  5. `tests/smoke.test.mjs` (Add contract and regression tests for Google Drive expense export)
- **Explicit Out of Scope:**
  - Zero external SDKs or remote scripts (strict adherence to ADR-001 100% offline-first privacy).
  - No changes to financial math formulas or income/expense calculation algorithms.

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `remaining-money.html`, `js/remaining-money.js`, `js/i18n/th.js`, `js/i18n/en.js`.
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy):** Zero server dependencies, zero external Google API SDKs. Uses browser-native Web Share API and standard file blobs.
  - **ADR-002 (Modular Multi-Tool Iframe App Shell):** Feature lives cleanly inside Remaining Money tool without side-effects on other tools.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `remaining-money.html`:
  - Add `#btnSaveToDrive` action button in the action toolbar.
  - Add `#driveExportModal` with format selector (CSV / PDF), action buttons, and direct shortcuts to Google Drive / Sheets.
- **Step 2:** In `js/i18n/th.js` and `js/i18n/en.js`:
  - Register bilingual translation keys for Google Drive export modal and actions.
- **Step 3:** In `js/remaining-money.js`:
  - Implement `generateExpenseLedgerCSV()` producing a structured expense ledger (`Date, Type, Category, Item, Amount, Note, Month`).
  - Implement `saveToGoogleDrive(format)` utilizing Web Share with file payload or fallback download, plus PDF print mode trigger.
  - Implement modal open/close handlers (`openDriveModal`, `closeDriveModal`).
- **Step 4:** In `tests/smoke.test.mjs`:
  - Assert existence of `#btnSaveToDrive`, `#driveExportModal`, `openDriveModal`, and `generateExpenseLedgerCSV`.
- **Step 5:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 6:** Code & Security Reviewer adversarial audit.
- **Step 7:** Release & Docs (bump version, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] User can click "📁 บันทึกไปยัง Google Drive" in `remaining-money.html` to open the Google Drive export modal.
- [x] Selecting CSV generates a structured expense-tracking ledger CSV with Date, Type, Category, Item, Amount, Note, and Month columns.
- [x] Selecting PDF triggers clean print-to-PDF statement view.
- [x] "แชร์ / บันทึกไฟล์" invokes `navigator.share` with file payload where supported, allowing direct selection of Google Drive on mobile/desktop, or falls back to direct download.
- [x] Quick shortcut buttons allow opening Google Drive (`drive.google.com`) and Google Sheets (`sheets.new`) in new tabs.
- [x] Full bilingual support (Thai & English) with 100% key symmetry in `js/i18n/th.js` and `js/i18n/en.js`.
- [x] Biome linter passes with 0 errors/warnings.
- [x] Smoke test and i18n test suites pass 100%.

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:** Clean git tree (`rtk git status`).
- **Verification Commands:**
  - `npm run lint`
  - `node --test tests/smoke.test.mjs`
  - `npm test`
