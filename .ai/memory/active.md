---
task_id: "FEAT-NETWORTH-COMPOSITION-01"
status: "planning"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Accelerated Debt Payoff Lump-Sum / Bonus Windfall Simulator (Phase 25 / v2.0.8)
- **Status:** Completed & Verified (90 automated tests passing, 0 linter errors).
- **Summary:**
  1. Enhanced discrete amortization engine `simulateDebt()` / `simulate()` to model one-off capital injections (`windfall = { amount, month }`) cascading across active debts sorted by active strategy (Snowball or Avalanche).
  2. Dynamic comparative calculations yielding exact timeline advancement (`monthsSavedWf`) and interest savings (`interestSavedWf`) highlighted in an impact callout badge.
  3. Interactive input card with quick presets (`20K`, `50K`, `100K`, `200K`) and synchronization on load, undo, and reset.
  4. Dynamic multi-strategy SVG payoff chart overlay featuring comparative baseline trajectory and interactive windfall gift marker (`🎁 +${amount}`).

---

### Proposed Feature Specification: Asset Allocation & Net Worth Composition Donut / Solvency Ratio Visualizer (Phase 26 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive SVG Asset Allocation & Net Worth Composition Donut / Solvency Ratio Visualizer to [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html).
- **Key Capabilities & Benefits:**
  1. **Comprehensive Asset vs. Liability Composition Breakdown:**
     - Integrates data across all three financial pillars:
       - 🟢 **Liquid Cash & Emergency Fund** ($C$ from `remaining-money.html`).
       - 🔵 **Invested Portfolio Assets** ($I$ from `rebalance.html`).
       - 🔴 **Liabilities & Debt** ($D$ from `debt-calculator.html`).
     - Calculates Gross Assets ($A = C + I$), Net Worth ($NW = A - D$), and proportional shares.
  2. **Interactive SVG Donut / Segmented Composition Visualizer:**
     - Pure zero-build SVG donut chart with smooth arc segments, central Net Worth callout, and interactive hover / focus tooltips showing exact values and percentages.
  3. **Key Financial Health & Leverage Metrics:**
     - **Solvency Ratio:** $(NW / A) \times 100\%$ with health status badge (Healthy $\ge 80\%$, Moderate $50\text{--}80\%$, High Leverage $< 50\%$).
     - **Debt-to-Asset ($D/A$) Ratio:** $(D / A) \times 100\%$, or "100% Debt-Free 🎉" badge when $D = 0$.
     - **Liquidity Ratio:** Cash share vs Invested capital share.
  4. **Zero External Dependencies (ADR-001):**
     - Pure vanilla trigonometric SVG arc generation (`M ... A ... L ... Z` or `stroke-dasharray` donut pattern).
  5. **Bilingual Localization (TH/EN):**
     - Full Thai and English translations for labels, ratios, tooltips, and empty states.
- **Target Files (<= 5 files, ~150-180 lines total):**
  1. `dashboard.html` (SVG composition donut container, ratio badges, and render function)
  2. `tests/financial-math.test.mjs` (unit tests validating composition proportions, solvency ratios, and zero-debt/zero-asset edge cases)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Manual asset entry on the dashboard (data flows dynamically from the existing tools).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% offline-functional and client-side private.
- **Consistent Design Tokens:** Uses system theme variables (`--ok`, `--core`, `--danger`, `--panel`, `--line`).

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Unit tests verifying calculation of gross assets, solvency ratio, debt-to-asset ratio, and donut arc coordinate mapping under normal, zero-debt, and negative-net-worth scenarios.
2. **UI & SVG Rendering Engine (`dashboard.html`):**
   - Add composition card with SVG donut chart, central KPI, and financial ratio badges.
   - Implement `renderNetWorthComposition()` called inside `renderDashboardKPIs()`.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 90+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.9` via `node scripts/bump.mjs patch`.

