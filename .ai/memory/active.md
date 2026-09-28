---
task_id: "none"
complexity: "none"
current_stage: "idle"
assigned_agent: "none"
iteration_count: 0
max_iterations: 2
status: "idle"
target_files: []
---

# Active Task State Bus

> Centralized state machine and working scratchpad for the Multi-Agent SDLC pipeline.

## 1. Task Objective & Context
- **Description:** Add comprehensive data export feature to the Remaining Money page (`remaining-money.html`).
- **User Request:** *"Add export data feature to the remaining money page."*
- **Page Data Model Analysis:**
  1. **Incomes (`state.incomes`):** List of income entries (`name`, `value`, `isSalary`). Primary salary row computes baseline for auto deductions.
  2. **Expenses (`state.expenses`):** List of expense entries (`name`, `value`, `auto`, `autoType`). Includes auto-calculated tax, social security (SSO), and provident fund (PVD), plus customizable recurring expenses.
  3. **Savings (`state.savings`):** List of monthly savings/investing reserve entries (`name`, `value`).
  4. **Summary & Net Cash Flow:** Total Income, Total Expenses, Total Savings, Net Remaining Cash Flow (`Total Income − Total Expenses − Total Savings`).
  5. **PVD Contribution:** Saved in `remainingMoneyCalculator.pvdPercent.v1` (e.g., 5%).
  6. **Emergency Reserve & Runway:** `state.currentEmergencyReserve`, `state.showEmergencyRunway`, and calculated `runwayMonths = reserve / totalExpense`.

## 2. Working Plan & Acceptance Criteria

### Feature / Task Specification: Export Data in Remaining Money Page

#### 1. Goal & Scope Limits
- **Objective:** Provide users with versatile, spreadsheet-compatible, and shareable export options (Download CSV with UTF-8 BOM, Copy Formatted Summary to Clipboard, Download JSON, and Print/Save PDF) matching the established UX in `rebalance.html`.
- **Target Files (<= 5 files):**
  - `remaining-money.html`
- **Explicit Out of Scope:**
  - Modifying financial calculation formulas or tax deduction engine.
  - Adding server-side export endpoints (violates ADR-001 100% Client-Side Privacy).

#### 2. Architecture & Decision Alignment
- **Affected Components:** `remaining-money.html` (Tool 6: Remaining Money & Emergency Runway).
- **Relevant ADRs:**
  - ADR-001 (Zero-Build Static PWA & 100% Client-Side Privacy).
  - ADR-002 (Modular Multi-Tool Iframe App Shell).
  - ADR-003 (Tailwind-Lite & Local CSS offline).
  - ADR-004 (Decoupled state, explicit user actions).

#### 3. Step-by-Step Implementation Plan
1. **Update UI Toolbar in `.save-status` (`remaining-money.html` lines 330–334):**
   - Replace the standalone reset button with a unified action toolbar container:
     - `copySummaryBtn`: "📋 คัดลอกสรุป" / "Copy Summary"
     - `exportCsvBtn`: "📥 ดาวน์โหลด CSV" / "Download CSV"
     - `exportJsonBtn`: "💾 ดาวน์โหลด JSON" / "Download JSON"
     - `printBtn`: "🖨️ พิมพ์ / บันทึก PDF" / "Print / PDF"
     - `resetBtn`: "ล้างข้อมูลที่บันทึกไว้" / "Clear saved data"
2. **Add CSS Styles (`remaining-money.html` lines 177–186 & print styles):**
   - Ensure action buttons have clean hover styling (`color: var(--core)`) and `#resetBtn:hover` retains `color: var(--danger)`.
   - Add `@media print` styling to hide toolbar and action buttons when printing or saving as PDF.
3. **Add Dual-Language Localization Keys (`remaining-money.html` lines 342–472):**
   - Add labels for `lblCopySummary`, `lblExportCsv`, `lblExportJson`, `lblPrint`, and `copiedSuccess` in `EN` and `T.th` / `T.en`.
   - Wire up dynamic label assignment in the language initialization block.
4. **Implement `exportCSV()` (`remaining-money.html`):**
   - Build a structured CSV file prefixed with UTF-8 BOM (`\uFEFF`) to prevent character encoding issues in Excel on Thai Windows.
   - Column layout: `หมวดหมู่ / Category,รายการ / Item,จำนวนเงิน (บาท) / Amount (THB),หมายเหตุ / Note`.
   - Populate Income line items & Subtotal, Expense line items (with auto-deduction labels) & Subtotal, Savings line items & Subtotal, Net Remaining Money, and Emergency Runway metrics (if enabled).
   - Generate Blob (`text/csv;charset=utf-8;`) and trigger download with filename `remaining_money_YYYY-MM-DD.csv`.
5. **Implement `copySummary()` (`remaining-money.html`):**
   - Construct a clean, human-readable text summary of monthly cash flow in current language (TH or EN).
   - Use `navigator.clipboard.writeText(...)` with fallback and temporary button text feedback (`✓ คัดลอกแล้ว!` / `✓ Copied!` for 1.8s).
6. **Implement `exportJSON()` (`remaining-money.html`):**
   - Export full calculator state and computed summary numbers as a pretty-printed JSON file `remaining_money_YYYY-MM-DD.json`.
7. **Expose Aliases on `window`:**
   - Attach `window.exportCSV`, `window.copySummary`, `window.exportJSON` for external or testing access.

#### 4. Acceptance Criteria
- [x] Export toolbar is rendered in `.save-status` at the bottom of `remaining-money.html` with Copy Summary, Download CSV, Download JSON, Print/PDF, and Reset buttons.
- [x] Clicking **"ดาวน์โหลด CSV" / "Download CSV"** triggers a download of `remaining_money_YYYY-MM-DD.csv` encoded in UTF-8 with BOM.
- [x] The downloaded CSV includes all individual income, expense, and savings items, subtotals, net remaining money, and emergency fund runway (if active), matching current page numbers.
- [x] Clicking **"คัดลอกสรุป" / "Copy Summary"** copies the clean formatted cash flow summary to clipboard and shows temporary button feedback (`✓ คัดลอกแล้ว!` / `✓ Copied!`).
- [x] Clicking **"ดาวน์โหลด JSON" / "Download JSON"** triggers a download of `remaining_money_YYYY-MM-DD.json` containing the structured state and totals.
- [x] All new buttons and text are fully localized in Thai and English according to current `LANG`.
- [x] The feature works 100% client-side with 0 external network requests (ADR-001) and adheres to dark/light theme styling.

#### 6. Code Review Remediation
- [x] **CWE-1236 Neutralization:** Updated `csvSafe()` to prefix non-numeric formula triggers (`=`, `+`, `-`, `@`, `\t`, `\r`) with a single quote (`'`).
- [x] **DOM Attachment & Revoke Cleanup:** Appended anchor tags to `document.body` before programmatic click and deferred `URL.revokeObjectURL(url)` via `setTimeout(..., 1000)` in both `exportCSV()` and `exportJSON()`.
- [x] **Double-Click State Safety:** Fixed label reset in `copySummary()` to reference `t('lblCopySummary') || (isEN ? 'Copy Summary' : 'คัดลอกสรุป')` rather than dynamically reading existing text at click time.
- [x] **Print Styling Enhancement:** Extended `@media print` rule with `body { background: #fff !important; color: #000 !important; }` and hid `#bridgeAlertBanner`.

#### 7. QA Verification (Remediation Iteration 1)
- [x] **CWE-1236 Neutralization:** Validated `csvSafe()` against injection payloads (`=cmd|...`, `+alert()`, `@SUM()`, `\t=test`, `-10% discount`) and valid numbers (`50000`, `-500`). All injections neutralized with `'` prefix, while numeric values preserved without single quotes.
- [x] **DOM Attachment & Revoke:** Validated `exportCSV()` and `exportJSON()` attach `<a>` tags to `document.body` prior to `.click()`, detach immediately, and defer `URL.revokeObjectURL(url)` via `setTimeout` (1000ms).
- [x] **Double-Click Label Reset:** Validated rapid double-clicks on `copySummary()` in both TH and EN properly show temporary feedback and reset cleanly to localized labels without state lock.
- [x] **Print Styles & Headless Browser:** Validated `@media print` rules in headless Chrome via CDP: white background, black text, and hidden UI action buttons/banners. Verified headless PDF generation.

