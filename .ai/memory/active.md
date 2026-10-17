---
task_id: "FEAT-TAX-OPTIMIZER-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Annual Net Take-Home Pay & Bonus Distribution Stream Visualizer (Phase 27 / v2.1.0)
- **Status:** Completed & Verified (99 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built pure SVG 12-month stacked column stream visualizer in `months-slips.html` modeling base salary, allowances, SSO, PVD, Thai PIT withholding, and bonus disbursement spikes.
  2. Implemented customizable bonus payout month selector (`#bonusMonth`) with persistence in `localStorage`.
  3. Interactive hover tooltips with dynamic boundary clamping preventing horizontal overflow on mobile viewports.
  4. Added bilingual Thai/English localization and total annual net take-home pay KPI badge.
  5. Added 4 automated unit tests in `tests/financial-math.test.mjs` verifying stream array generation, fiscal year payouts, tax reconciliation, and SVG coordinate bounds.

---

### Proposed Feature Specification: Tax Deduction Optimization Room & Marginal Tax Savings Simulator (Phase 28 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **Tax Deduction Optimization Room & Marginal Tax Savings Simulator** to [`tax-calculator-base.html`](file:///home/l2okii/Document/money-superapp/tax-calculator-base.html) and [`tests/financial-math.test.mjs`](file:///home/l2okii/Document/money-superapp/tests/financial-math.test.mjs).
- **Key Capabilities & Benefits:**
  1. **Unused Deduction Capacity Meters (Remaining Allowance Room):**
     - Computes and visualizes remaining legal deduction room across key Thai tax-saving categories:
       - **ThaiESG:** Up to 300,000 THB (capped at 30% of income).
       - **Retirement Savings Bundle (SSF + RMF + PVD + GPF):** Combined ceiling of 500,000 THB (subject to individual sub-caps like SSF 200,000 THB / 30% and RMF 30%).
       - **Life & Health Insurance:** Combined 100,000 THB ceiling (Health ins. sub-cap 25,000 THB).
       - **Easy E-Receipt / Shopping:** Up to 50,000 THB.
  2. **Marginal Tax Rate & ROI Visualizer:**
     - Displays the user's current marginal tax bracket (e.g. 10%, 15%, 20%, 25%, 30%, 35%).
     - Calculates the immediate guaranteed tax return on investment (ROI): e.g., "At your 20% marginal bracket, investing 50,000 THB in ThaiESG immediately saves 10,000 THB in tax (20% instant return)!"
  3. **Interactive Deduction Slider / "What-If" Simulator:**
     - A quick slider or preset buttons (+10k, +30k, +50k, +100k) showing in real-time how additional investments reduce total tax payable and move the taxpayer closer to a lower bracket.
  4. **Zero External Dependencies (ADR-001):**
     - Pure client-side calculation using native DOM and SVG progress meters.
  5. **Bilingual Localization (TH/EN):**
     - Seamless bilingual support for all category badges, tooltips, and savings callouts.
- **Target Files (<= 5 files, ~160-190 lines total):**
  1. `tax-calculator-base.html` (Optimization panel, capacity meters, what-if simulator)
  2. `tests/financial-math.test.mjs` (unit tests validating remaining capacity calculations, marginal tax rate detection, and simulated savings)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Automated tax e-filing submission to the Thai Revenue Department portal.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side calculation; zero external network requests.
- **Design Tokens:** Follows CSS styling variables from `css/theme.css`.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Engine Verification (`tests/financial-math.test.mjs`):**
   - Unit tests validating `calculateTaxDeductionRoom()`: category remaining caps, combined 500k retirement bundle cap, marginal bracket determination, and delta tax reduction calculation.
2. **UI & Capacity Meters (`tax-calculator-base.html`):**
   - Add "Tax Optimization & Savings Room" (`#tax-optimization-card`) below the calculation summary.
   - Add category capacity visual bars (ThaiESG, Retirement Bundle, Insurance).
   - Add Marginal Tax Savings callout with interactive +10k / +50k simulation buttons.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 100+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.1` via `node scripts/bump.mjs patch`.
