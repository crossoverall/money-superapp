---
task_id: "phase-135-easy-e-receipt-tracker"
status: "completed"
current_stage: "idle"
iteration_count: 1
pipeline:
  - stage: "spec"
    status: "completed"
  - stage: "planning"
    status: "completed"
  - stage: "human_approval"
    status: "completed"
  - stage: "coding"
    status: "completed"
  - stage: "qa_verification"
    status: "completed"
  - stage: "code_review"
    status: "completed"
  - stage: "release"
    status: "completed"
---

### Feature Specification: Phase 135 — Easy E-Receipt & Tax Invoice Deduction Tracker (Pillar 2.3)

#### 1. Goal & Requirements
- **Goal:** Implement comprehensive Thai Easy E-Receipt & e-Tax Invoice deduction engine and interactive tracker:
  1. `js/engines/thai-pit.js`: Implement `evaluateEasyEReceiptDeduction({ vatAmount, nonVatAmount })` with strict statutory limits:
     - Combined maximum ceiling: 50,000 THB.
     - Non-VAT store ceiling (books, e-books, OTOP e-receipts): 20,000 THB max.
     - VAT store ceiling (e-Tax Invoice): up to 50,000 THB (capped at remaining headroom).
     - Returns utilization percentage, allowable deduction, non-deductible excess, and remaining room.
  2. Integrate into `calculateThaiEFilingWorksheet` in `js/engines/thai-pit.js` under stimulus deductions.
  3. `tax-calculator-base.html` & `js/tax-calculator-base.js`:
     - Provide dual breakdown inputs (e-Tax Invoice VAT vs e-Receipt Non-VAT) alongside the aggregate input.
     - Interactive deduction progress meter with 20k non-VAT sub-cap and 50k total cap markers.
     - Marginal tax bracket savings calculation.
  4. Bilingual translations in `translations.th` and `translations.en`.
  5. Dedicated test suite `tests/easy-e-receipt.test.mjs` + type contract verification.

#### 2. Architecture & Decision Alignment
- **Affected Files:**
  - `js/engines/thai-pit.js`: Implement `evaluateEasyEReceiptDeduction` and export via `MoneyApp`.
  - `tax-calculator-base.html`: Add sub-inputs for VAT vs Non-VAT e-receipts and visual progress meter.
  - `js/tax-calculator-base.js`: Wire input synchronization, progress meter rendering, and translations.
  - `tests/easy-e-receipt.test.mjs`: Dedicated test suite testing mathematical boundaries, sub-cap rules, and UI synchronization.
  - `tests/type-contracts.test.mjs`: Type contract verification for `evaluateEasyEReceiptDeduction`.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Implement `evaluateEasyEReceiptDeduction` and update `calculateThaiEFilingWorksheet` in `js/engines/thai-pit.js`.
- **Step 2:** Update `tax-calculator-base.html` with dual breakdown fields and visual ceiling meter.
- **Step 3:** Update `js/tax-calculator-base.js` with calculation logic, input handlers, and bilingual translations.
- **Step 4:** Author `tests/easy-e-receipt.test.mjs` and update `tests/type-contracts.test.mjs`.
- **Step 5:** Run `npm run lint` and `npm test` across all 776+ tests.
- **Step 6:** Review code and security, document lessons in `.ai/memory/lessons.md`, bump version to `v2.5.76`, and git push.
