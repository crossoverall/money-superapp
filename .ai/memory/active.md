---
task_id: "FEAT-CASHFLOW-WATERFALL-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Debt Payoff Timeline SVG Amortization Curve Comparison (Phase 19 / v2.0.2)
- **Status:** Completed & Verified (68 automated tests passing, 0 linter errors).
- **Summary:** Multi-series SVG debt curve plotting Avalanche, Snowball, and Minimum-Only trajectories with active strategy highlighting, milestone payoff dots, dynamic strategy delta callout chip, and bilingual localization.

---

### Proposed Feature Specification: Cash Flow Inflow-Outflow Stream / Waterfall Diagram (Phase 20 / Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Upgrade the Cash Flow visualizer in [`remaining-money.html`](file:///home/l2okii/Document/money-superapp/remaining-money.html) / [`js/remaining-money.js`](file:///home/l2okii/Document/money-superapp/js/remaining-money.js) from a simple stacked proportion bar into an interactive SVG Stream / Waterfall diagram illustrating the step-down progression:
  `Total Gross Income -> Statutory Deductions -> Fixed Expenses -> Variable Expenses -> Monthly Savings -> Remaining Cashflow (Surplus/Deficit)`.
- **Key Capabilities & Benefits:**
  1. **Visual Stream / Waterfall Progression:**
     - Left-to-right or stepped waterfall blocks showing the journey of every earned Baht.
     - Green base for Gross Inflow (`#10b981`), red/coral step-downs for Deductions & Expenses (`#f43f5e`, `#ef4444`), indigo for Savings (`#6366f1`), and emerald/amber for final Remaining Money (`#059669` or `#d97706`).
  2. **Interactive Node Breakdown & Tooltips:**
     - Hover or tap any stream segment to see exact THB amount and percentage of income.
  3. **Deficit Indicator & Overflow Warning:**
     - If outflows exceed income, dynamically highlights the deficit gap in vibrant crimson with clear recovery advice.
  4. **Full Privacy & Offline SVG:**
     - 100% inline SVG rendering, zero external charting libraries or heavy canvas runtimes (ADR-001).
  5. **Bilingual Support (TH/EN):**
     - Full translation in both Thai and English.
- **Target Files (<= 5 files, ~150-180 lines total):**
  1. `remaining-money.html` (markup container for waterfall/stream visualization & legend)
  2. `js/remaining-money.js` (pure SVG waterfall rendering engine)
  3. `tests/financial-math.test.mjs` (unit tests verifying waterfall step coordinate calculations and deficit handling)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Changes to underlying budget calculations or storage schemas (preserves full backward compatibility).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Pure client-side SVG generation, zero dependencies, responsive on mobile and desktop.
- **Preserves Existing State:** Compatible with existing `remainingMoney.incomes.v1`, `expenses.v1`, etc.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Engine & Coordinates (`tests/financial-math.test.mjs`):**
   - Write unit tests for waterfall step nodes: starting level, intermediate deductions, expense subtotals, savings, and final remaining balance / deficit.
2. **SVG Stream Waterfall Renderer (`js/remaining-money.js`):**
   - Implement `renderCashflowWaterfall(summary, width, height)` generating responsive SVG with connecting flow connectors and labels.
3. **Container & Toggle Integration (`remaining-money.html`):**
   - Embed the waterfall chart above/alongside the proportion bar with view toggle or complementary layout.
4. **Verification & Quality Gate:**
   - Execute `npm test` and `npm run lint`.
5. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.3` via `node scripts/bump.mjs patch`.
