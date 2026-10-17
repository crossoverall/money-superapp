---
task_id: "FEAT-TAX-PRINT-REPORT-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Print-Optimized Annual Tax Filing Report & Deduction Summary (Phase 14 Item 3.5)

#### 1. Goal & Scope Limits
- **Objective:** Add an official, print-optimized Annual Personal Income Tax Filing & Deduction Summary Report in [`tax-calculator-base.html`](file:///home/l2okii/Document/money-superapp/tax-calculator-base.html) tailored for Thai P.N.D.91 / P.N.D.90 filing preparation.
- **Key Capabilities:**
  1. Print-only executive report header (`#taxPrintHeader`) with bilingual document title, filing year (Buddhist 2569 / Gregorian 2026), generation timestamp, and privacy disclaimer.
  2. Structured tabular print summary:
     - Part 1: Assessable Income (Salary, Bonus, Other Variable Income).
     - Part 2: Deductions & Allowances (Standard 50% allowance, Personal allowance, SSO, PVD, SSF/RMF, ThaiESG, Insurance, Mortgage, Donations).
     - Part 3: Net Taxable Income, Progressive Tax Computation by Brackets, Total Tax Payable, and Effective Tax Rate.
     - Part 4: Bracket Headroom & Tax Optimization Notes.
  3. Clean CSS print rules:
     - Form inputs are formatted cleanly as crisp report text.
     - Interactive controls, buttons, tooltips, and tab switchers hidden via `.no-print`.
     - Page breaks and margins calibrated for standard A4 portrait output.
  4. Unit tests in `tests/financial-math.test.mjs` verifying tax report data structure assembly, deduction categorization, and bilingual formatting.
- **Target Files (<= 5 files):**
  1. `tax-calculator-base.html`
  2. `tests/financial-math.test.mjs`
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - External PDF generation libraries (PDFKit/jsPDF) — keeps ADR-001 zero-dependency with native browser print-to-PDF.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Pure client-side calculations and native CSS `@media print`.
- **Localization:** Auto-adapts to `LANG === 'en'` or `LANG === 'th'` with Thai Buddhist calendar year support.

#### 3. Step-by-Step Implementation Plan
1. **Report Header & Structure (`tax-calculator-base.html`):**
   - Inject `#taxPrintHeader` and printable summary tables styled with `.print-only` and clean print table styling.
   - Populate print data dynamically during `calculateTax()`.
2. **Print CSS Styles (`@media print`):**
   - Add comprehensive `@media print` rules: high-contrast black/white ink, bordered report tables, page break preservation, hidden interactive elements.
3. **Automated Unit Testing (`tests/financial-math.test.mjs`):**
   - Add unit test suite verifying tax report data structure generation, deduction grouping, and effective rate calculations.
4. **Verification & Quality Gate:**
   - Run `npx @biomejs/biome check js/ scripts/ tests/` and `npm test`.
5. **Release & Bump:**
   - Bump version to `v1.9.7`.
