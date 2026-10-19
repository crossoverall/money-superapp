---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 123 — ThaiESG 2024–2026 Rules & SSO Progressive Ceiling Calibration (v2.5.64)

#### 1. Goal & Scope Limits
- **Objective:**
  Calibrate Thai Personal Income Tax (PIT) deduction engines and UI calculators to reflect current 2024–2026 Thailand Revenue Department rules:
  1. ThaiESG Fund: Support updated 2024+ statutory cap of 300,000 THB (capped at 30% of total income with 5-year holding period) alongside legacy 2023 rules (100,000 THB / 8-year holding). Expose explicit holding period metadata and validation in `MoneyApp.evaluateThaiEsgDeduction`.
  2. Social Security (SSO) Progressive Cap: Dynamically compute annual statutory cap (`ssoCap * 12`, ranging from 9,000 THB for 750/mo up to 13,800 THB for 1,150/mo) in yearly tax mode instead of hardcoded 13,800 THB, ensuring warning alerts trigger accurately.
- **Target Files (<= 5 files, ~150 lines):**
  1. `js/engines/thai-pit.js` (Add `evaluateThaiEsgDeduction` and enrich `calculateThaiEFilingWorksheet` with holding rule metadata)
  2. `js/tax-calculator-base.js` (Dynamic `maxYearlySso` validation based on selected `ssoCap`, update ThaiESG tooltip/holding badge)
  3. `js/i18n/th.js` (Add Thai translations for ThaiESG holding period and dynamic SSO cap)
  4. `js/i18n/en.js` (Add English translations for ThaiESG holding period and dynamic SSO cap)
  5. `tests/financial-math.test.mjs` (Add tests for `evaluateThaiEsgDeduction` and dynamic yearly SSO cap logic)
- **Explicit Out of Scope:**
  - Zero external dependencies (ADR-001).
  - No changes to progressive PIT tax brackets (0% - 35%).

#### 2. Architecture & Decision Alignment
- **Affected Components:** `js/engines/thai-pit.js`, `js/tax-calculator-base.js`, `js/i18n/th.js`, `js/i18n/en.js`, `tests/financial-math.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy)
  - ADR-002 (Modular Multi-Tool Iframe App Shell)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `js/engines/thai-pit.js`:
  - Implement `MoneyApp.evaluateThaiEsgDeduction(amount, totalIncome, taxYear = 2024)`.
  - Return `{ effectiveDeduction, statutoryCap, maxAllowed, isExceeded, excessAmount, holdingYears }`.
  - Wire into `calculateThaiEFilingWorksheet`.
- **Step 2:** In `js/tax-calculator-base.js`:
  - Use `evaluateThaiEsgDeduction` for ThaiESG cap evaluation.
  - Dynamically calculate `const maxYearlySso = (ssoCapVal > 0 ? ssoCapVal : 875) * 12;` so yearly warning reflects the active ceiling.
- **Step 3:** In `js/i18n/th.js` and `js/i18n/en.js`:
  - Maintain key symmetry for ThaiESG holding period badge and statutory cap messages.
- **Step 4:** In `tests/financial-math.test.mjs`:
  - Add comprehensive unit test coverage for `evaluateThaiEsgDeduction` across 2023 vs 2024+ rules and dynamic SSO annual caps.
- **Step 5:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 6:** Adversarial Code & Security Review.
- **Step 7:** Release & Docs (bump v2.5.64, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] `MoneyApp.evaluateThaiEsgDeduction` correctly calculates 2024+ caps (300k / 30% / 5-yr holding) and legacy 2023 rules (100k / 30% / 8-yr holding).
- [x] Yearly SSO cap warning in `tax-calculator-base.html` evaluates against `ssoCap * 12` accurately.
- [x] Bilingual parity maintained in `th.js` and `en.js`.
- [x] 100% test pass rate with 0 Biome lint errors/warnings.
- [x] Released, tagged/bumped to v2.5.64, and pushed to `master`.
