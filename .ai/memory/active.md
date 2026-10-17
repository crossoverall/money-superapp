---
task_id: "FEAT-BUDGET-TEMPLATES-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Annual Tax Withholding (50 Tawi) vs PIT Liability Refund & Additional Payable Estimator (Phase 32 / v2.1.5)
- **Status:** Completed & Verified (123 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built `calculateTaxRefundOrPayable()` computing:
     $$\text{Net Balance} = \text{Withheld Tax (50 Tawi)} - \text{Calculated PIT Liability}$$
     with automated detection of `refund` (> 0), `payable` (< 0), and `exact` (= 0) states.
  2. Implemented Revenue Department 3-month interest-free installment scheduler ($\text{Installment} = \lceil\text{Amount} / 3\rceil$) for payable amounts $\ge 3,000$ THB.
  3. Added Withholding Tax at Source (ใบ 50 ทวิ) input field with one-click inter-tool bridge (`importWithholdingFromPayslip()`) auto-calculating annual cumulative tax withheld from `moneySuperapp.monthsSlips`.
  4. Built high-visibility dynamic verdict card (`#taxRefundCard`) with bilingual status badges, breakdown metrics, PromptPay National ID readiness tips, and full integration into the print-ready Form P.N.D. 90/91 summary table.
  5. Added 6 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying refund math, payable installment thresholds, zero/edge cases, and payslip payroll withholding integration.

---

### Proposed Feature Specification: Recurring Budget Templates & Monthly Expense Category Profile Presets (Phase 33 / Roadmap Item 3.3)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **Recurring Budget Templates & Monthly Expense Category Profile Presets Engine** to [`remaining-money.html`](file:///home/l2okii/Document/money-superapp/remaining-money.html) and [`js/remaining-money.js`](file:///home/l2okii/Document/money-superapp/js/remaining-money.js).
- **Key Capabilities & Benefits:**
  1. **Template Preset Switcher & Custom Templates:**
     - Quick preset buttons for realistic life scenarios:
       - **Standard Month (เดือนปกติทั่วไป):** Balanced baseline configuration.
       - **Frugal / Savings Sprint (ประหยัดเข้มงวด / เน้นออม):** Scaled down discretionary/wants expenses.
       - **High Discretionary / Holiday Season (เดือนท่องเที่ยว / เทศกาล):** Seasonal adjustment for gifts, flights, dining.
     - **"Save Current as Template" (บันทึกเป็นเทมเพลตใหม่):** Custom user-named budget profiles saved in local storage.
  2. **One-Click Apply with Instant Recalculation:**
     - Applying a template immediately updates fixed expenses, daily food allowance, discretionary expenses, runs 50/30/20 compliance calculation, and captures an undo snapshot (`undoMgr.push(captureSnapshot())`).
  3. **Zero External Dependencies (ADR-001):**
     - 100% offline client-side storage, zero server-side dependencies.
- **Target Files (<= 5 files, ~160-200 lines total):**
  1. `remaining-money.html` (Template selector toolbar & modal)
  2. `js/remaining-money.js` (Preset logic, template storage, and application)
  3. `tests/financial-math.test.mjs` (Unit tests for template schemas, preset mathematical validations, and profile transitions)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Cloud server profile synchronization (preserves ADR-001 100% client-side privacy).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** All budget template state resides in `localStorage`.
- **Conventions:** Follows existing patterns in `js/remaining-money.js` (`MoneyApp.safeJsonParse()`, `createUndoManager()`, bilingual `t()`).

#### 3. Step-by-Step Implementation Plan
1. **Mathematical & Schema Verification (`tests/financial-math.test.mjs`):**
   - Write unit tests for template presets, validation of schema invariants, and 50/30/20 compliance delta across templates.
2. **Template Switcher & Preset Toolbar (`remaining-money.html` / `js/remaining-money.js`):**
   - Implement built-in presets (Standard, Frugal, Holiday) and custom template persistence (`moneySuperapp.budgetTemplates.v1`).
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 125+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.6` via `node scripts/bump.mjs patch`.

