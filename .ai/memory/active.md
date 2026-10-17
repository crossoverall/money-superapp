---
task_id: "FEAT-PVD-RMF-OPTIMIZER-01"
status: "in_progress"
current_stage: "coder"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Active Task: Section 48(5) Retirement Lump-Sum vs Transfer-to-RMF Tax Optimization Engine (Phase 42 / v2.2.5)
- **Goal:** Empower Thai employees facing termination/resignation with $\ge 5$ years tenure and age $< 55$ to compare taking a cash lump sum vs transferring their Provident Fund (PVD) to an RMF for PVD.
- **Specifications:**
  - Option A (Full Lump Sum): Calculate Section 48(5) tax on statutory severance excess + taxable PVD using 7,000 THB/yr deduction + 50% deduction and progressive rates.
  - Option B (Transfer to RMF): PVD is 100% tax-exempt. Section 48(5) tax applies only to severance excess.
  - Tax Savings Analysis: Displays immediate tax saved, immediate cash payout, and wealth retained in RMF.
  - Bilingual UI (Thai / English) in `tax-calculator.html`.
  - Comprehensive unit tests in `tests/financial-math.test.mjs`.
- **Compliance:** 100% offline-first PWA, zero runtime CDNs, zero telemetry, zero build step (ADR-001).
