---
task_id: "SUPERWAVE-PHASE-56"
status: "in_progress"
current_stage: "planner"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed in Phase 55 (v2.3.8):
- **Design System Re-alignment & Theme Harmonization:**
  1. Semantic tokens added in `css/theme.css`: `--surface`, `--surface-2`, `--card-bg`, `--accent`, `--accent-hover`, `--label`.
  2. Eliminated all rogue Tailwind colors (`indigo-*`, `dark:bg-slate-*`, `focus:ring-blue-500`, `bg-blue-50`, `text-blue-800`, `text-blue-600`, `border-blue-200`) across `tax-calculator-base.html`, `months-slips.html`, `tax-calculator.html`, `js/tax-calculator-base.js`, and `js/months-slips.js`.
  3. Mapped all results cards, tax refund badges, headroom banners, deduction progress meters, and payslip buttons directly to theme CSS variables.
  4. Added automated regression assertions to `tests/smoke.test.mjs` verifying 0 rogue classes remain.
  5. 222 tests passing, 0 failing, 0 Biome errors.

### Active Task: Phase 56 (v2.3.9) — Life Insurance Adequacy & Family Protection Gap Calculator
- **Goal:** Build the Human Life Value (HLV) & Capital Needs Analysis engine:
  1. Add dedicated Life Insurance Adequacy calculator panel to `dashboard.html` / `js/dashboard.js`.
  2. Formula: $\text{Required Protection} = \text{Debt Clearance} + (\text{Monthly Living Expenses} \times 12 \times \text{Years to Support}) + \text{Emergency Fund Cushion} - \text{Current Liquid Assets} - \text{Existing Life Policy Coverage}$.
  3. Pre-populate debt clearance automatically from `debtCalculator.state.v1` and living expenses from `remaining-money`.
  4. Provide bridge link to `tax-calculator-base.html` statutory PIT life (100,000 THB) & health (25,000 THB) insurance deduction caps.
  5. Full bilingual (TH/EN) support and dark mode theme alignment.
- **Verification:** Native Node tests (`tests/insurance-adequacy.test.mjs`) + Biome lint.
- **Invariants:** 100% offline-first PWA, zero runtime CDNs, zero telemetry, zero build step (ADR-001).
