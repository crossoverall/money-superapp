---
task_id: "phase-136-interactive-cashflow-waterfall"
status: "completed"
current_stage: "release"
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

### Feature Specification: Phase 136 — Interactive Cash Flow Waterfall & Category Filtering (Pillar 3.2)

#### 1. Goal & Requirements
- **Goal:** Transform the static cashflow waterfall chart in `remaining-money.html` into an interactive exploration tool:
  1. **Click-to-Highlight & Category Filtering:**
     - Enable clicking on any waterfall SVG bar (`income`, `deductions`, `expenses`, `savings`, `remaining`) or interactive category chips (`[All]`, `[Income]`, `[Deductions]`, `[Expenses]`, `[Savings]`, `[Surplus]`).
     - Selected bar receives distinct stroke glow / focus ring; other bars dim to 35% opacity.
     - Displays dynamic itemized drill-down panel below the chart:
       - Itemized rows with amount and percentage of income.
       - For expenses: classifies and highlights Needs vs Wants ratio.
       - For deductions: lists tax, SSO, PVD.
       - For savings: lists investment and savings goals.
  2. **Surplus Allocation Simulator:**
     - When monthly surplus > 0, provide an interactive 3-way surplus allocation simulator:
       - 1. 🛡️ Emergency Reserve Buffer (% / THB)
       - 2. 💳 Extra Debt Payoff (% / THB)
       - 3. 📈 DCA Investment Portfolio (% / THB)
     - Interactive slider distributes 100% of the surplus with instant visual feedback.
     - One-click action button to bridge allocated DCA surplus directly into the Rebalancer (`rebalance.html`).
  3. **Bilingual Parity:**
     - Full translation symmetry between Thai and English.
  4. **Automated Verification:**
     - Tests in `tests/cashflow-viz.test.mjs` verifying category filtering, drill-down generation, surplus distribution math, and headless Chrome click interactions.

#### 2. Architecture & Decision Alignment
- **Affected Files:**
  - `js/engines/cashflow-viz.js`: Add `filterCategory`, `getCategoryDrilldown`, and `calculateSurplusDistribution`.
  - `remaining-money.html`: Add filter chip bar, drill-down container, and surplus allocation simulator UI.
  - `js/remaining-money.js`: Wire up interactive click handlers, category state, and surplus simulator.
  - `tests/cashflow-viz.test.mjs`: Test drill-down data structures, surplus allocation math, and UI interactivity.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `js/engines/cashflow-viz.js`, implement `getCategoryDrilldown` and `calculateSurplusDistribution`.
- **Step 2:** In `remaining-money.html`, add markup for category chips, drill-down card, and surplus simulator.
- **Step 3:** In `js/remaining-money.js`, bind click events on SVG bars and filter chips, update drill-down UI, and wire surplus slider.
- **Step 4:** Author automated test assertions in `tests/cashflow-viz.test.mjs`.
- **Step 5:** Run `npm run lint` and `npm test` across all 785+ tests.
- **Step 6:** Code & security review, record lessons, bump version to `v2.5.77`, and git push.
