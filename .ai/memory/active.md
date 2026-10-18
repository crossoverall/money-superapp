---
task_id: "SDLC-PHASE-79-TAX-BRACKET-STEPDOWN-HEADROOM-ANALYZER"
status: "ready_for_release"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 78 - v2.5.21)
1. **Redundant Nested Toggles & Card Folding:**
   - In `tax-calculator-base.html`, remove redundant inner toggle buttons in `panelTaxScenario` and `panelTaxCalendar` so expanding the card directly displays the tool.
   - Standardize `dividendTaxCreditCard` body with `dividendTaxCreditCardBody` and remove custom non-standard arrow.
   - Configure `defaultCollapsed: ['dividendTaxCreditCard', 'panelTaxScenario', 'panelTaxCalendar']` in `taxBaseLayoutManager`.
2. **Double Accordion in Months Slips:**
   - In `months-slips.html`, remove redundant `#compareToggleBtn` inside `panelJobCompareBody` and display comparison panel directly.
   - Configure `defaultCollapsed: ['panelJobCompare']` in `slipsLayoutManager`.
3. **Verification & Delivery:**
   - Headless CDP verification (Light, Dark, Mobile).
   - Biome check clean & full test suite passing.
