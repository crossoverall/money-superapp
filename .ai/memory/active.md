---
task_id: "SDLC-PHASE-104-DECLARATIVE-I18N-TAX-TOOLS"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 104 - Declarative data-i18n Localization Migration for Tax & Payslip Tools)
1. **Diagnosis**:
   - `tax-calculator.html`, `tax-calculator-base.html`, and `months-slips.html` currently use one-way imperative `EN` dictionary lookups in `js/tax-calculator.js`, `js/tax-calculator-base.js`, and `js/months-slips.js`.
   - Migrating to declarative `data-i18n` attributes completes the declarative localization rollout across the entire suite of 7 interactive tools.
   - Symmetrical `translations = { th: {...}, en: {...} }` enables adding all remaining tool scripts to `LOCALIZED_MODULES` in `tests/bilingual-parity.test.mjs`.
2. **Strategy & Slices**:
   - Slice 1: Decorate `tax-calculator.html` with declarative `data-i18n` attributes (severance, PVD, RMF rollover, SSO simulator, inheritance & gift tax, land & building tax).
   - Slice 2: Decorate `tax-calculator-base.html` with declarative `data-i18n` attributes (income, deductions, waterfall results, scenario stress-tester, tax calendar, dividend tax credit, e-filing worksheet, bracket step-down analyzer, pre-flight checklist).
   - Slice 3: Decorate `months-slips.html` with declarative `data-i18n` attributes (income setup, payslip summary, 12-month stream, year-end PIT reconciliation & refund tracker, job offer comparison).
   - Slice 4: Define symmetrical `translations = { th: {...}, en: {...} }` in `js/tax-calculator.js`, `js/tax-calculator-base.js`, and `js/months-slips.js`, register with `MoneyApp.I18n`, call `MoneyApp.I18n.applyLocalization(document, LANG)`, and retain `const EN = translations.en` for 100% backward compatibility.
   - Slice 5: Add `'js/tax-calculator.js'`, `'js/tax-calculator-base.js'`, and `'js/months-slips.js'` to `LOCALIZED_MODULES` in `tests/bilingual-parity.test.mjs` and add Phase 104 smoke invariants to `tests/smoke.test.mjs`.
   - Slice 6: QA Verification (`rtk npm run lint` 0 errors/0 warnings, `npm test` 100% passing across all 494+ tests), Security Review, bump patch to `v2.5.47`, commit and push to `origin/master`.
