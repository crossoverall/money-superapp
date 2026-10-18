---
task_id: "SDLC-PHASE-103-DECLARATIVE-I18N-REMAINING-REBALANCE"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 103 - Declarative data-i18n Localization Migration for Remaining Money & Rebalance Tools)
1. **Diagnosis**:
   - `remaining-money.html` and `rebalance.html` previously relied primarily on hardcoded element ID lookups in English mode inside `js/remaining-money.js` and `js/rebalance.js`.
   - Migrating to declarative `data-i18n` attributes aligns these 2 major tools with `MoneyApp.I18n.applyLocalization(document, LANG)` and centralized dictionaries.
   - Symmetrical `translations = { th: {...}, en: {...} }` in both controllers protects against future key drift and enables automated symmetry validation in `tests/bilingual-parity.test.mjs`.
2. **Strategy & Slices**:
   - Slice 1: Decorate `remaining-money.html` with declarative `data-i18n` attributes across headers, summary cards, 50/30/20 breakdown, stress tester, and modals.
   - Slice 2: Decorate `rebalance.html` with declarative `data-i18n` attributes across headers, asset allocation cards, glidepath planner, Thai gold calculator, foreign tax advisor, and API settings modal.
   - Slice 3: Refactor `js/remaining-money.js` and `js/rebalance.js` to establish symmetrical `translations = { th: {...}, en: {...} }`, register with `MoneyApp.I18n`, and invoke `applyLocalization(document, LANG)`.
   - Slice 4: Promote both modules to `LOCALIZED_MODULES` in `tests/bilingual-parity.test.mjs` and add Phase 103 regression test to `tests/smoke.test.mjs`.
   - Slice 5: Quality gates (`rtk npm run lint` 0 errors/0 warnings, `npm test` 100% passing).
   - Slice 6: Release & docs: bump patch to `v2.5.46`, append lessons to `.ai/memory/lessons.md`, commit and push to `origin/master`.
