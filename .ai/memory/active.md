---
task_id: "FEAT-HEALTH-SCORECARD-RADAR-01"
status: "in_progress"
current_stage: "coder"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Active Task: 360° Financial Health Scorecard & 5-Axis SVG Radar Chart (Phase 40 / v2.2.3)
- **Goal:** Provide an executive 360° Financial Health Scorecard & interactive SVG Spider/Radar Chart in `dashboard.html`.
- **5 Pillars (0–100 pts each):**
  1. `runway`: Emergency Runway (0–6+ months; >= 6 mos = 100 pts)
  2. `savingsRate`: Budget & Savings Discipline (0–50%+; >= 50% = 100 pts)
  3. `debtHealth`: Debt Health & Solvency (1 - Debt/Assets; 0 debt = 100 pts)
  4. `fireProgress`: Wealth Accumulation & FIRE Readiness (Net Worth / FIRE Target or Target NW)
  5. `taxEfficiency`: Tax Optimization & Deduction Capacity (Deductions utilization ratio)
- **Composite Score (0–100):** Weighted average of the 5 pillars with tier badge (`excellent`, `solid`, `moderate`, `critical`).
- **Interactive SVG Spider Chart:** 5-axis regular pentagon with concentric guideline rings (25%, 50%, 75%, 100%), radial spokes, shaded polygon area, data points, and localized labels.
- **Verification:** Unit tests in `tests/financial-math.test.mjs`, Biome linter, zero external CDNs, 100% offline (ADR-001).

