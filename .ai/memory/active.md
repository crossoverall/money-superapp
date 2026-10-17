---
task_id: "SUPERWAVE-PHASE-57"
status: "in_progress"
current_stage: "planner"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed in Phase 56 (v2.3.9):
- **Life Insurance Adequacy & Family Protection Gap Calculator:**
  1. Pure calculation engine `calculateInsuranceAdequacy(params)` implemented in `js/shared.js` and exposed on `MoneyApp`.
  2. Built interactive Capital Needs Analysis & Human Life Value (HLV $7\times$ income) panel (`panelInsuranceAdequacy`) in `dashboard.html`.
  3. Integrated automatic pre-hydration from `moneySuperapp.debtCalculator.state.v1` and `remainingMoneyCalculator.state.v1`.
  4. Added PIT Section 47(1)(d) statutory life insurance tax deduction benefit estimator (up to 100,000 THB) linked to `tax-calculator-base.html`.
  5. 230 tests passing across 68 suites, 0 Biome errors, 100% TH/EN localization symmetry.

### Active Task: Phase 57 (v2.4.0) — Thai Gold Bar & Jewelry DCA P/L & Baht Weight Calculator
- **Goal:** Implement dedicated Thai Gold physical bullion & jewelry weight conversion and DCA profit/loss calculator in `rebalance.html` / `js/rebalance.js`:
  1. Unit conversion: 1 บาททองคำ = 15.244g (แท่ง 96.5%), 15.16g (รูปพรรณ 96.5%), 1 สลึง = 3.811g.
  2. Block fee (ค่ากำเหน็จ/ค่าบล็อก) deduction and Gold Traders Association (สมาคมค้าทองคำ) bid-ask spread simulator.
  3. Weighted average cost basis tracking and unrealized/realized P/L calculation.
  4. Compliance guidance: Thai Revenue Code exemption for individual physical gold capital gains tax.
- **Verification:** Native Node tests (`tests/gold-calculator.test.mjs`) + Biome lint.
- **Invariants:** 100% offline-first PWA, zero runtime CDNs, zero telemetry, zero build step (ADR-001).

