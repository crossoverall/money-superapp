---
task_id: "SDLC-PHASE-76-TAX-ACCRUAL-AND-REFUND-CROSS-TOOL-BRIDGE"
status: "ready_for_release"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 76 - v2.5.19)
1. **Annual Tax Due Liquidity Shock:**
   - When taxpayers owe PIT in March/April, lack of proactive monthly accrual creates cash flow pinches.
   - Adding 1-click bridge to reserve 1/12th (or 3-month installments) in `remaining-money.html`.
2. **Underutilized Tax Refunds:**
   - 1-click bridge from PIT refund in `tax-calculator-base.html` to `debt-calculator.html` as a lump-sum windfall (Month 3) to knock out debt, or to `rebalance.html`.
3. **Verification & Delivery:**
   - 100% Thai/English translation symmetry.
   - Headless CDP verification (Light, Dark, Mobile).
   - Full test suite passing & Biome check clean.



