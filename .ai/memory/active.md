---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 124 — Universal Cloud Export (Dashboard & Tax Dossier to Google Drive / Sheets / PDF) (v2.5.65)

#### 1. Goal & Scope Limits
- **Objective:**
  Expand the Google Drive and Sheets cloud export feature (established in Phase 122) to:
  1. `dashboard.html` / `js/dashboard.js`: Export complete Net Worth evolution, asset allocation metrics, debt ratios, and financial health scores as an audit CSV dossier or printable PDF dossier.
  2. `tax-calculator-base.html` / `js/tax-calculator-base.js`: Export itemized tax deduction worksheet, PIT bracket breakdown, and e-filing checklist as a structured tax filing CSV dossier or printable PDF.
  Support 1-tap mobile Web Share API with file payload, fallback anchor download, and direct shortcuts to `drive.google.com` and `sheets.new`.
- **Target Files (<= 5 files, ~180 lines):**
  1. `dashboard.html` (Add `#btnSaveToDrive` button and `#driveExportModal` modal dialog)
  2. `js/dashboard.js` (Implement `generateDashboardDossierCSV`, `openDriveModal`, `closeDriveModal`, `saveToGoogleDrive`)
  3. `tax-calculator-base.html` (Add `#btnSaveToDrive` button and `#driveExportModal` modal dialog)
  4. `js/tax-calculator-base.js` (Implement `generateTaxDossierCSV`, `openDriveModal`, `closeDriveModal`, `saveToGoogleDrive`)
  5. `tests/smoke.test.mjs` (Add smoke tests asserting existence of modal triggers, CSV generators, and dialogs)
- **Explicit Out of Scope:**
  - Zero external SDKs or remote scripts (ADR-001 100% offline-first privacy).
  - No changes to underlying tax calculation formulas or net worth algorithms.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `dashboard.html`, `js/dashboard.js`, `tax-calculator-base.html`, `js/tax-calculator-base.js`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy)
  - ADR-002 (Modular Multi-Tool Iframe App Shell)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `dashboard.html`:
  - Add `#btnSaveToDrive` in dossier/executive toolbar.
  - Add `#driveExportModal` modal with format selector (CSV / PDF) and shortcuts to Google Drive / Sheets.
- **Step 2:** In `js/dashboard.js`:
  - Implement `generateDashboardDossierCSV()` producing structured Net Worth & Financial Health dossier CSV.
  - Implement `openDriveModal`, `closeDriveModal`, and `saveToGoogleDrive()`.
- **Step 3:** In `tax-calculator-base.html`:
  - Add `#btnSaveToDrive` in e-Filing actions bar.
  - Add `#driveExportModal` modal dialog.
- **Step 4:** In `js/tax-calculator-base.js`:
  - Implement `generateTaxDossierCSV()` producing itemized deduction & tax bracket CSV.
  - Implement `openDriveModal`, `closeDriveModal`, and `saveToGoogleDrive()`.
- **Step 5:** In `tests/smoke.test.mjs`:
  - Add contract tests asserting existence of `#btnSaveToDrive`, `#driveExportModal`, and CSV generation functions for both tools.
- **Step 6:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 7:** Code & Security Reviewer adversarial audit.
- **Step 8:** Release & Docs (bump v2.5.65, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] User can click `#btnSaveToDrive` in `dashboard.html` to open `#driveExportModal` and export Net Worth dossier to Google Drive (CSV or PDF).
- [x] User can click `#btnSaveToDrive` in `tax-calculator-base.html` to open `#driveExportModal` and export Tax Dossier to Google Drive (CSV or PDF).
- [x] CSV outputs contain valid UTF-8 BOM (`\uFEFF`) and parse cleanly into Google Sheets and Excel.
- [x] Web Share API with file payload operates on supported devices, with graceful fallback to download.
- [x] Zero Biome lint warnings/errors.
- [x] All tests pass in `npm test`.
- [x] Released, bumped to v2.5.65, and pushed to origin master.
