---
task_id: "FEAT-DEBT-REFINANCE-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: 50/30/20 Budget Rule Compliance Donut & Financial Runway Health Score Visualizer (Phase 29 / v2.1.2)
- **Status:** Completed & Verified (107 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built `classifyBudgetType()` engine with keyword matching (addressing Thai keyword collision like `กินข้าวนอกบ้าน`) to categorize expenses into Needs, Wants, and Savings.
  2. Implemented `calculateBudgetRule503020()` calculating breakdown percentages, compliance state (`balanced`, `high_needs`, `high_wants`, `low_savings`), and pure SVG Donut chart arcs with negative cumulative stroke offsets.
  3. Integrated Emergency Runway health indicator directly with color-coded safety tiers (< 3 mos Danger, 3–6 mos Healthy, > 6 mos Solid).
  4. Added view mode toggle (`#btnCfView503020`) alongside Waterfall and Bar views with `localStorage` persistence.
  5. Added 4 unit tests in `tests/financial-math.test.mjs` verifying classification, arc math, balance alerts, and runway duration.

---

### Proposed Feature Specification: Interactive Debt Consolidation & Refinance Interest Savings Engine (Phase 30 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **Debt Consolidation & Refinance Optimizer & Interest Savings Visualizer** to [`debt-calculator.html`](file:///home/l2okii/Document/money-superapp/debt-calculator.html).
- **Key Capabilities & Benefits:**
  1. **Blended Weighted Average APR Calculation:**
     - Computes the true baseline interest rate across all active debts:
       $$\bar{r} = \frac{\sum (B_i \cdot r_i)}{\sum B_i}$$
     - Highlights current combined debt load, total monthly minimum commitments, and total projected interest under current strategy.
  2. **Interactive Refinance Simulator:**
     - Customizable Refinance APR (e.g. 7.9% – 13.9% vs current 16%–25% credit cards/personal loans) and Refinance Term (12, 24, 36, 48, 60 months).
     - Standard amortization payment calculation:
       $$PMT = \frac{B \cdot (r/12)}{1 - (1 + r/12)^{-n}}$$
  3. **Comparative Savings & Cash Flow Relief Metrics:**
     - Total Interest Saved: $\Delta I = I_{\text{current}} - I_{\text{refinanced}}$.
     - Monthly Cash Flow Relief: $\Delta PMT = \sum \text{MinPay}_i - PMT_{\text{refinanced}}$.
     - Payoff Horizon Comparison (months saved or extended).
  4. **Visual Comparison & Verdict Card:**
     - Visual side-by-side or stacked comparative meters (Current Total Interest vs Refinanced Total Interest).
     - Actionable verdict badge: "คุ้มค่ามาก: ประหยัดดอกเบี้ย X บาท และผ่อนลดลง Y บาท/เดือน" / "ควรระวัง: ยืดระยะเวลานานเกินไปแม้ดอกเบี้ยต่ำ".
  5. **Zero External Dependencies (ADR-001):**
     - Pure client-side financial formulas, 100% offline privacy, zero third-party scripts.
  6. **Bilingual Localization (TH/EN):**
     - Seamless integration with existing Thai/English toggle and persistent user preferences.
- **Target Files (<= 5 files, ~160-200 lines total):**
  1. `debt-calculator.html` (Refinance simulator UI, sliders/inputs, savings cards)
  2. `tests/financial-math.test.mjs` (Unit tests for weighted APR, amortization PMT, and consolidation savings)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Bank loan application forms or external affiliate links (preserves pure neutral user privacy).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** All amortization math runs in browser memory; no backend required.
- **Conventions:** Follows established patterns in `debt-calculator.html` (undo support, `formatMoney()`, bilingual `t()`).

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Implement and test `calculateDebtConsolidation()`: weighted APR, new PMT, total interest, savings deltas, and edge cases ($B = 0$, $r = 0$).
2. **Refinance UI & Calculation Engine (`debt-calculator.html`):**
   - Add Refinance Simulation Section with toggleable panel.
   - Interactive term buttons (24m, 36m, 48m, 60m) and APR input.
   - Render comparative impact cards (interest saved, monthly payment diff, payoff speed).
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 110+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.3` via `node scripts/bump.mjs patch`.
