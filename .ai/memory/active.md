---
task_id: "SUPERWAVE-PHASE-63"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed in Phase 63 (v2.4.6):
- **Foreign Investment & Crypto Repatriation Tax Advisor (Orders P.161/2566 & P.162/2566):**
  1. Built pure financial math engine `calculateForeignRepatriationTax(params)` in `js/shared.js`:
     - 180-day Thai residency rule (Section 41 Paragraph 3: < 180 days is 100% tax-exempt non-resident).
     - Revenue Department Order Por. 162/2566 relief: 100% grandfathered exemption for pre-2024 earnings/capital.
     - Principal invested capital exemption: capital return is excluded from assessable taxable income.
     - Progressive Thai PIT computation on remitted income stacked on domestic taxable base.
     - Double Taxation Agreement (DTA) Foreign Tax Credit (FTC) under Royal Decree No. 300 offsetting foreign withholding taxes paid abroad.
  2. Implemented interactive advisor card `#panelForeignTaxAdvisor` in `rebalance.html` and controller logic in `js/rebalance.js`:
     - Quick preset buttons (100k, 500k, 1M, 3M, and full pre-2024 exemption).
     - Live KPI cards: Taxable remittance, Gross Thai tax, DTA credit, and Net Thai tax payable.
     - Dynamic strategic guidance banner offering bracket-spreading and audit-trail advice.
     - Statutory references citations.
  3. Created unit test suite `tests/foreign-tax-advisor.test.mjs` (6 unit tests) and added smoke test assertion in `tests/smoke.test.mjs`.
  4. 280 passing tests across 75 suites, 0 Biome errors, 100% localization symmetry.
