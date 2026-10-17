---
task_id: "FEAT-DEBT-WINDFALL-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Interactive Financial Goal Projection & Compound Scenario Simulator (Phase 24 / v2.0.7)
- **Status:** Completed & Verified (86 automated tests passing, 0 linter errors).
- **Summary:**
  1. Closed-form logarithmic compound horizon solver ($n = \lceil \ln((FV \cdot r + PMT)/(PV \cdot r + PMT)) / \ln(1+r) \rceil$) with linear fallback ($n = \lceil (FV - PV)/PMT \rceil$) when $r \approx 0$.
  2. Guarded non-positive denominators and mathematical edge cases, clamping horizons at 600 months (50 years) or returning `Infinity` with helpful UI warnings.
  3. Interactive scenario toggle pills (0% Cash, 3% Conservative, 6% Moderate, 9% Aggressive) with real-time recalculation directly on the Net Worth milestone card.
  4. Customizable expected return rate input in `#goalsModal` with quick preset buttons.
  5. Localized projected completion dates with bilingual Thai Buddhist and English Gregorian calendar representations (`ต.ค. 2570 (~12 เดือน)` / `Oct 2027 (~12 mos)`).

---

### Proposed Feature Specification: Accelerated Debt Payoff Lump-Sum / Bonus Windfall Simulator (Phase 25 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive Lump-Sum / Bonus Windfall Injection Simulator to the Debt Payoff Calculator ([`debt-calculator.html`](file:///home/l2okii/Document/money-superapp/debt-calculator.html)).
- **Key Capabilities & Benefits:**
  1. **One-Time Lump-Sum / Windfall Injection:**
     - Allows users to model applying an irregular windfall (e.g. annual bonus, tax refund, severance, asset sale) of an arbitrary amount (e.g. 20,000 to 200,000 THB) at a specific month milestone (e.g. Month 1, Month 3, Month 6).
  2. **Accelerated Savings & Interest Reduction Engine:**
     - Quantifies the exact financial impact in real time:
       - **Months shaved off debt sentence** (e.g. "Debt-free 14 months earlier").
       - **Total interest expense saved in Baht** (e.g. "Saves 34,800 THB in interest").
       - **Effective return on debt capital**.
  3. **Visual Timeline & Comparison Overlay:**
     - Overlays the windfall acceleration curve directly onto the existing SVG payoff amortization chart (dashed green trajectory showing faster slope to zero).
  4. **Strategy Compatibility (Snowball & Avalanche):**
     - Windfall is automatically directed to the priority target account dictated by the active strategy (smallest balance first for Snowball, highest interest rate first for Avalanche).
  5. **Zero External Dependencies (ADR-001):**
     - Pure client-side discrete amortization loop simulation.
  6. **Bilingual Localization (TH/EN):**
     - Full Thai and English translations.
- **Target Files (<= 5 files, ~150-180 lines total):**
  1. `debt-calculator.html` (interactive windfall input controls, impact KPI chip, and SVG trajectory overlay)
  2. `tests/financial-math.test.mjs` (unit tests validating windfall amortized interest and month reductions)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Automated bank API syncing or recurring dynamic interest adjustments.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% offline-functional and client-side private.
- **Preserves Existing Storage:** Windfall simulation state stored non-destructively in `moneySuperapp.debtCalculator.state.v1`.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Unit tests verifying discrete monthly amortization with one-time windfall injection at month $k$, calculating delta months and delta interest for both Snowball and Avalanche orderings.
2. **Simulation Engine & UI Controls (`debt-calculator.html`):**
   - Add windfall input card (Amount THB and Month Injection slider/input).
   - Integrate windfall into `computePayoff()` and compute impact comparison metrics (time saved, interest saved).
   - Overlay windfall curve on the multi-strategy SVG payoff chart.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 90+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.8` via `node scripts/bump.mjs patch`.
