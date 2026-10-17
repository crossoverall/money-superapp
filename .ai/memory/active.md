---
task_id: "FEAT-SANKEY-CASHFLOW-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Cash Flow Sankey Stream & Visual Allocation Diagram (Phase 34 / v2.1.7)
- **Status:** Completed & Verified (131 automated unit tests passing, 0 Biome linter errors).
- **Summary:**
  1. Built deterministic mathematical coordinate solver `calculateSankeyFlows()` calculating node $X/Y$ geometries and slice heights across 3 sequential stages:
     - Stage 1 (Source): Gross Inflow (รายได้รวม)
     - Stage 2 (Intermediate Split): Statutory Deductions (หักตามกฎหมาย) and Take-Home Net Income (รับสุทธิ)
     - Stage 3 (Destination Allocations): Statutory Taxes & SSO, Living Needs (จำเป็น), Lifestyle Wants (ผันแปร), Savings & Investments (ออมและลงทุน), and Investable Net Surplus (คงเหลือลงทุน).
  2. Built `generateSankeyRibbonPath()` using cubic Bézier curves (`M ... C ... L ... C ... Z`) connecting source slices to destination slices with smooth width conservation and translucent linear gradients.
  3. Integrated 4th view mode (`🔀 สายธาร (Sankey)`) into the `.cashflow-view-switcher` toolbar with full `localStorage` persistence, responsive SVG scaling (`viewBox="0 0 600 240"`), and automatic deficit overspending warnings (`remaining < 0`).
  4. Added 4 automated unit tests in `tests/financial-math.test.mjs` verifying ribbon path syntax, 3-stage flow conservation, zero deductions/income edge cases, and deficit state detection (expanding test suite to 131 passing tests).
  5. Cleanly bumped project version to `v2.1.7` across all 11 tool manifests.

---

### Proposed Feature Specification: Multi-Year Personal Income Tax Scenario Comparator & Bracket Inflation Stress-Tester (Phase 35 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **Multi-Year PIT Scenario Comparator & Bracket Inflation Stress-Tester** to [`tax-calculator-base.html`](file:///home/l2okii/Document/money-superapp/tax-calculator-base.html).
- **Key Capabilities & Benefits:**
  1. **Side-by-Side Tax Scenario Comparison (Scenario A vs B):**
     - Compare current tax year vs prospective salary increase, bonus payout, or tax reform brackets.
     - Live delta comparison: Marginal tax rate shift, additional tax liability, and effective tax rate differential.
  2. **Bracket Inflation & Bracket Creep Stress-Tester:**
     - Simulates purchasing power erosion vs nominal bracket creep.
  3. **Zero External Dependencies (ADR-001):**
     - 100% offline client-side calculation, zero CDN or backend servers.
