---
task_id: "SDLC-PHASE-99-TAX-WORKSHEET-DECOMPOSITION"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 99 - Decompose tax-calculator-base.js: E-Filing Worksheet & Tax Dossier Engine)
1. **Diagnosis**:
   - `js/tax-calculator-base.js` is 3,101 lines long.
   - Over 700 lines contain e-filing worksheet calculation coordination, 500k statutory retirement pool warning evaluation, preflight compliance checklist management, clipboard copy formatting, dividend tax credit Section 47 bis UI, and print report dossier rendering.
2. **Strategy & Slices**:
   - Slice 1: Create `js/engines/tax-worksheet.js` (`MoneyApp.TaxWorksheet`) containing:
     - `updateEFilingWorksheetView(context)`
     - `copyEFilingField(valElementId, btnEl)`
     - `copyAllEFilingSummary(context)`
     - `formatReportDate(d, lang)`
     - `updatePrintReportView(data, context)`
     - `updateDividendTaxCreditUI(context)`
   - Slice 2: Register `js/engines/tax-worksheet.js` in `sw.js` and all 8 core HTML files.
   - Slice 3: Refactor `js/tax-calculator-base.js` to delegate worksheet, dividend credit, and dossier rendering cleanly to `MoneyApp.TaxWorksheet`.
   - Slice 4: Create unit tests in `tests/tax-worksheet.test.mjs`.
   - Slice 5: Add Phase 99 smoke invariant in `tests/smoke.test.mjs`.
   - Slice 6: Full QA verification (`rtk npm run lint` 0 errors, `npm test` 100% pass).
   - Slice 7: Security review & release bump to `v2.5.42`, commit and push to `origin/master`.
