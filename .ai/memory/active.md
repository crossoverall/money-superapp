---
task_id: "FEAT-VISUALIZATION-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Interactive Cashflow Visual Breakdown (Phase 5 Slice 1)

#### 1. Goal & Scope Limits
- **Objective:** Add an elegant, responsive, zero-dependency visual cashflow breakdown in `remaining-money.html` showing proportional allocation of gross income across statutory deductions (tax, SSO, PVD), living expenses, savings, and remaining investable money.
- **Target Files (<= 5 files):**
  1. `remaining-money.html` (Render cashflow proportional bar / breakdown visual, responsive styling, localized legend)
  2. `tests/financial-math.test.mjs` (Added unit tests for cashflow share proportions)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - External charting libraries like Chart.js or D3 (must remain 100% zero-dependency vanilla JS & SVG/CSS per ADR-001).
  - Heavy canvas animations that drain mobile batteries.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% offline, pure SVG/CSS rendered client-side.
- **ADR-002 (Iframe Isolation):** Self-contained within `remaining-money.html`.
- **Theme & Design Consistency:** Uses CSS custom properties from `css/theme.css` (`--brand`, `--core`, `--panel`, `--line`, `--danger`, etc.). Dark-mode and print-media responsive.

#### 3. Step-by-Step Implementation Summary
1. **Design Component:**
   - Positioned directly below `.summary-strip`.
   - Rendered segmented proportional bar representing Gross Income:
     - Statutory Deductions (Tax + SSO + PVD): `#8b5cf6` (purple)
     - Living Expenses: `#f43f5e` (rose/red)
     - Savings / Emergency Reserves: `#0284c7` (sky/blue)
     - Remaining Surplus for Investment: `#10b981` (emerald green)
   - Real-time surplus/deficit pill badge:
     - Surplus: green badge (`+X THB Surplus`)
     - Balanced: neutral slate badge (`0 THB Balanced`)
     - Deficit: red badge (`-X THB Deficit`)
2. **Interactive Legend & Metrics:**
   - Shows formatted amount and exact share of income for all four segments.
   - Smooth CSS transitions (`transition: width 0.3s ease`).
3. **Responsive & Print:**
   - Graceful flex wrap on small mobile screens.
4. **Verification & Tests:**
   - Added unit test suite `Cashflow Allocation Proportions` in `tests/financial-math.test.mjs`.
   - 29 unit tests pass in 62ms.
   - Biome check passes with 0 errors.
   - Bumped to `v1.8.7` via `node scripts/bump.mjs patch`.

#### 4. Acceptance Criteria
- [x] Proportional cashflow bar reflects real-time input changes.
- [x] Percentages sum to 100% of income (or flag deficit when negative).
- [x] Thai and English localization supported.
- [x] Looks great in both light and dark modes.
- [x] All automated tests pass (`npm test`) and Biome linter passes (`npm run lint`).
