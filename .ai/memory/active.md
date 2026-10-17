---
task_id: "FEAT-SLIP-STREAM-01"
status: "planning"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Asset Allocation & Net Worth Composition Donut / Solvency Ratio Visualizer (Phase 26 / v2.0.9)
- **Status:** Completed & Verified (95 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built a zero-dependency SVG donut chart using native `<circle>` elements with geometric `stroke-dasharray` and `stroke-dashoffset` representing Liquid Cash vs Invested Portfolio proportions.
  2. Integrated cross-tool data synthesis across `remaining-money.html` (Cash & Emergency Fund), `rebalance.html` (Portfolio), and `debt-calculator.html` (Liabilities).
  3. Implemented dynamic solvency ratio ($NW / A \times 100\%$) and debt-to-asset leverage ($D / A \times 100\%$) with contextual health status badges (`ปลอดหนี้ 100% 🎉`, `มั่นคงสูง`, `ปานกลาง`, `หนี้สินสูง`).
  4. Added 5 automated unit tests in `tests/financial-math.test.mjs` verifying solvency and leverage ratios, debt-free edge cases, and zero-asset bounds.

---

### Proposed Feature Specification: Annual Net Take-Home Pay & Bonus Distribution Stream Visualizer (Phase 27 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive SVG Annual Net Take-Home Pay & Bonus Distribution Stream Visualizer to [`months-slips.html`](file:///home/l2okii/Document/money-superapp/months-slips.html).
- **Key Capabilities & Benefits:**
  1. **12-Month Cashflow Trajectory (Jan - Dec):**
     - Models month-by-month cashflow with base salary, fixed allowances, monthly deductions (SSO, PVD, withholding tax), and highlight spikes during the user-selected bonus payout month.
  2. **Interactive Stacked SVG Column / Stream Chart:**
     - Pure SVG stacked bars for each month (Jan..Dec) displaying:
       - 🟢 **Net Take-Home Pay** (Green `--ok`)
       - 🔵 **PVD Savings Contribution** (Blue `--core`)
       - 🟡 **Social Security (SSO)** (Amber `--warn`)
       - 🔴 **Withholding Tax** (Rose `--danger`)
       - 🎁 **Bonus Spike** (Purple `--purple` on bonus payout month)
  3. **Bonus Month Selector & Annual Cash Flow Insight:**
     - Allows users to select bonus payout month (e.g. Dec, Mar, or None) and instantly observe annual take-home distribution, identifying cash surplus peaks for DCA or lump-sum debt payoff planning.
  4. **Zero External Dependencies (ADR-001):**
     - Pure zero-build SVG coordinate mapping with responsive viewBox.
  5. **Bilingual Localization (TH/EN):**
     - Complete Thai and English support for months, legends, and stream tooltips.
- **Target Files (<= 5 files, ~150-180 lines total):**
  1. `months-slips.html` (SVG stream chart container, bonus month selector, render function)
  2. `tests/financial-math.test.mjs` (unit tests validating 12-month payroll stream allocation and tax distribution)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Automated company payroll integrations or non-standard progressive tax schemes outside Thai revenue code.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side private, offline-first.
- **Design Tokens:** Inherits CSS variables from `css/theme.css`.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Unit tests verifying 12-month net take-home array generation, bonus month injection, annual tax proration, and SVG column coordinates.
2. **UI & SVG Rendering Engine (`months-slips.html`):**
   - Add annual distribution stream card with SVG stacked bars, bonus month picker, and interactive tooltips.
   - Integrate with `calc()` in `months-slips.html`.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 95+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.0` via `node scripts/bump.mjs minor`.


