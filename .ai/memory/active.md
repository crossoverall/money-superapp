---
task_id: "SUPERWAVE-PHASE-61"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed in Phase 61 (v2.4.4):
- **Thai Land & Building Tax Calculator (ภาษีที่ดินและสิ่งปลูกสร้าง พ.ร.บ. 2562):**
  1. Pure calculation engine `calculateThaiLandAndBuildingTax(params)` in `js/shared.js` implementing all 4 statutory categories:
     - Agricultural: 50M THB statutory individual exemption per district, 0.01% - 0.10% progressive tiers.
     - Primary Residence (Land + House): 50M THB statutory exemption for registered owners, 0.03% - 0.10% tiers.
     - Primary Building Only: 10M THB statutory exemption on leased land, 0.02% - 0.10% tiers.
     - Secondary Home / Investment Condo: 0 THB exemption (taxed from 1st baht), 0.02% - 0.10% tiers.
     - Commercial / Other: 0.3% - 0.7% progressive brackets.
     - Vacant Land: Base commercial rates + statutory punitive escalation (+0.3% every 3 consecutive years of non-use, capped at 3.0%).
  2. Full installment calculation: 3 equal monthly installments for taxes $\ge 3,000$ THB with 0% interest.
  3. Interactive `#land-building-tax-card` in `tax-calculator.html` with preset appraisal buttons, vacant land penalty toggle, progressive tier breakdown accordion, and statutory guidance notes.
  4. State persistence and hydration via `saveLandState()` and `loadLandState()`.
  5. Bilingual localization keys in `EN` dictionary in `js/tax-calculator.js`.
  6. Added test suite `tests/land-building-tax.test.mjs` (7 tests) and smoke assertion in `tests/smoke.test.mjs`.
  7. 266 passing tests across 73 suites, 0 Biome errors, 100% localization symmetry.
