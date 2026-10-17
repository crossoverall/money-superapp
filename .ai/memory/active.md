---
task_id: "FEAT-FIRE-SIMULATOR-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Interactive Debt Consolidation & Refinance Interest Savings Engine (Phase 30 / v2.1.3)
- **Status:** Completed & Verified (112 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built `calculateDebtConsolidation()` engine computing combined debt balance, weighted average baseline APR, monthly installment $PMT$ via standard amortization formula $PMT = \frac{B \cdot (r/12)}{1 - (1 + r/12)^{-n}}$, total refinance interest, and net savings deltas.
  2. Implemented intelligent multi-tier financial verdicts:
     - `optimal`: Both saves total interest ($\Delta I > 0$) and lowers monthly payment ($\Delta PMT \ge 0$).
     - `faster_payoff`: Saves substantial interest ($\Delta I > 0$) by paying slightly more each month ($\Delta PMT < 0$) over a compressed timeline.
     - `higher_interest`: Warns when stretching the loan term results in higher total interest despite a lower nominal rate.
  3. Integrated dedicated UI panel in `debt-calculator.html` with toggle switch, weighted APR readout, quick-select term pills (12m, 24m, 36m, 48m, 60m), real-time comparison cards, and full undo stack integration (`Ctrl+Z`).
  4. Added 5 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying weighted rate math, amortization payments, monthly cash flow differences, and term-stretching warnings.

---

### Proposed Feature Specification: Financial Independence & Early Retirement (FIRE) Safe Withdrawal & Target Net Worth Visualizer (Phase 31 / Roadmap Item 3.1)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **FIRE (Financial Independence, Retire Early) Safe Withdrawal & Target Net Worth Visualizer** to [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html).
- **Key Capabilities & Benefits:**
  1. **FIRE Target Net Worth Calculation:**
     - Computes the target wealth threshold based on the classic Safe Withdrawal Rate (SWR) rule:
       $$\text{FIRE Number} = \frac{\text{Annual Living Expenses}}{\text{SWR (e.g. 4\%)}} = \text{Annual Expenses} \times 25$$
     - Seamlessly reads and links monthly living expenses from `remainingMoneyCalculator.state.v1` (with manual override option).
  2. **Multi-Tier FIRE Milestone Spectrum:**
     - **Lean FIRE (75%):** Covers essential baseline survival needs.
     - **Standard FIRE (100%):** Covers 100% of current lifestyle expenses via 4% rule.
     - **Fat FIRE (125%+):** Generous buffer with lifestyle upgrades.
     - **Coast FIRE:** Projected retirement portfolio that will compound to target FIRE number without further savings.
  3. **Interactive FIRE Progress & Freedom Horizon:**
     - Progress bar displaying current Net Worth vs FIRE target.
     - SWR coverage gauge (how much of annual expenses can currently be funded safely).
     - Projected years to FIRE based on monthly investment top-up / savings rate.
  4. **Zero External Dependencies (ADR-001):**
     - Pure native SVG gauges and responsive HTML/CSS cards.
  5. **Bilingual Localization (TH/EN):**
     - Complete Thai and English support with `localStorage` state persistence.
- **Target Files (<= 5 files, ~160-200 lines total):**
  1. `dashboard.html` (FIRE visualizer panel, milestone progress meter, SWR controls)
  2. `tests/financial-math.test.mjs` (Unit tests for FIRE number, SWR coverage, and milestone brackets)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Complex stochastic Monte Carlo simulation across 10,000 historical paths (keeps computation lightweight and instant).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** All formulas run locally in browser memory; zero backend or cloud dependencies.
- **Inter-Tool Bridge:** Reads existing cached state from `remaining-money.html` without tight coupling.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Implement and test `calculateFIREMetrics()`: FIRE target, SWR percentages, milestone brackets, and zero-expense guards.
2. **Dashboard UI & Visualization Engine (`dashboard.html`):**
   - Add FIRE visualizer section with toggleable SWR pills (3%, 3.5%, 4%).
   - Render milestone progress bar and freedom horizon timeline.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 115+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.4` via `node scripts/bump.mjs patch`.
