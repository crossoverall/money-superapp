---
task_id: "FEAT-BUDGET-RUNWAY-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Tax Deduction Optimization Room & Marginal Tax Savings Simulator (Phase 28 / v2.1.1)
- **Status:** Completed & Verified (103 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built comprehensive `calculateTaxOptimizationRoom()` engine determining used vs remaining capacity across Thai statutory deduction categories (ThaiESG 300k / 30% income cap, Retirement bundle 500k ceiling with PVD, Insurance 100k cap, Easy E-Receipt 50k cap).
  2. Implemented dynamic visual capacity progress meters with percentage fills and quota badges in `tax-calculator-base.html`.
  3. Built interactive What-If simulation playground with quick simulation pills (+10k, +30k, +50k, +100k, Max Room), real-time tax savings readout, guaranteed marginal tax ROI percentage, and one-click application to active deduction fields.
  4. Added full undo snapshot integration and revert button restoring original user deduction numbers.
  5. Added 4 automated unit tests in `tests/financial-math.test.mjs` verifying capacity limits, income capping, marginal ROI, and total room bounds.

---

### Proposed Feature Specification: 50/30/20 Budget Rule Donut & Financial Runway Health Score Visualizer (Phase 29 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **50/30/20 Budget Rule Compliance Donut & Financial Runway Health Score Visualizer** to [`remaining-money.html`](file:///home/l2okii/Document/money-superapp/remaining-money.html) and [`js/remaining-money.js`](file:///home/l2okii/Document/money-superapp/js/remaining-money.js).
- **Key Capabilities & Benefits:**
  1. **50/30/20 Budget Compliance Donut:**
     - Evaluates income breakdown against the classic financial guideline:
       - **Needs (50%):** Fixed essential expenses (rent/mortgage, utilities, food basics, transport).
       - **Wants (30%):** Variable / discretionary expenses (entertainment, dining out, shopping).
       - **Savings & Debt (20%):** Emergency savings, investments (PVD, DCA), debt principal reduction.
     - Pure zero-dependency SVG donut displaying actual proportion vs target benchmark with compliance status badges (`สมดุลยอดเยี่ยม` / `รายจ่ายจำเป็นสูงเกินเกณฑ์` / `ออมเงินได้ดีเยี่ยม`).
  2. **Emergency Runway Months Indicator:**
     - Computes months of financial survival if income halts: $\text{Runway} = \text{Current Cash Balance} / \text{Monthly Fixed Essential Expenses}$.
     - Displays visual runway health gauge with color-coded safety tiers:
       - 🔴 `< 3 months`: Danger / Low runway.
       - 🟡 `3 - 6 months`: Standard healthy emergency cushion.
       - 🟢 `> 6 months`: Strong / Highly resilient buffer.
  3. **Zero External Dependencies (ADR-001):**
     - Pure SVG geometric math and native HTML/CSS styling.
  4. **Bilingual Localization (TH/EN):**
     - Complete Thai and English support for categories, rule descriptions, and health status tips.
- **Target Files (<= 5 files, ~160-190 lines total):**
  1. `remaining-money.html` (Donut container, runway gauge card)
  2. `js/remaining-money.js` (50/30/20 categorization, runway calculation, SVG rendering)
  3. `tests/financial-math.test.mjs` (unit tests validating 50/30/20 splits, runaway ratios, zero expense guards)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Automatic bank account statement sync (keeps 100% offline client-side privacy).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Pure client-side calculations; zero external CDN libraries.
- **Design Tokens:** Inherits CSS variables from `css/theme.css`.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Unit tests validating `calculateBudgetRule503020()` and `calculateEmergencyRunway()`.
2. **Core Logic & SVG Donut (`js/remaining-money.js` & `remaining-money.html`):**
   - Implement budget rule classification from expense tags/types.
   - Render native SVG donut and runway health gauge.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 105+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.2` via `node scripts/bump.mjs patch`.
