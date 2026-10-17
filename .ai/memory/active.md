---
task_id: "FEAT-NETWORTH-CHART-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Net Worth Historical Trend SVG Visualization (Phase 13 Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Enhance [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html) by adding a native, zero-dependency SVG area / line chart visualization that graphs monthly historical Net Worth snapshots over time.
- **Features:**
  1. Responsive SVG curve with gradient fill below the line.
  2. Automatic min/max scaling with nice grid lines.
  3. Interactive data point dots with localized date and amount tooltips.
  4. Growth rate indicator (e.g. `+12.4% vs initial` or delta from previous month).
  5. Empty state illustration when fewer than 2 snapshots exist.
- **Target Files (<= 5 files):**
  1. `dashboard.html` (SVG chart component, SVG rendering function, responsive layout)
  2. `tests/financial-math.test.mjs` (Unit tests for chart point mapping, aspect ratio bounding, and delta calculation)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Heavy 3rd-party charting libraries (Chart.js / D3) — keeps ADR-001 zero-build & zero-CDN.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Pure inline SVG, 100% client-side rendering.
- **Data Source:** Pulls directly from existing `moneySuperapp.dashboardSnapshots.v1`.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Coordinate Mapper (`generateNetWorthChartSvg`):**
   - Pure function taking snapshot records `[{ date, netWorth }]` and returning `<svg>` path data (`M... L...`).
   - Normalizes points into `0..width` and `0..height` with padding for labels and tooltips.
2. **Dashboard UI Integration:**
   - Add chart container `#netWorthChartContainer` above or alongside the snapshots table.
   - Bilingual support for axis labels and month formatting.
3. **Automated Verification:**
   - Add unit tests in `tests/financial-math.test.mjs`.
   - Run `npm test` and `npm run lint`.
