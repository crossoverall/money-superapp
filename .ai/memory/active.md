---
task_id: "SDLC-PHASE-102-DECLARATIVE-I18N-DASHBOARD-DEBT"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 102 - Declarative data-i18n Localization Migration for Dashboard & Debt Tools)
1. **Diagnosis**:
   - `dashboard.html` and `debt-calculator.html` used manual ID-based DOM text manipulation for localization.
   - Migrating to declarative `data-i18n` attributes simplifies views and leverages `MoneyApp.I18n.applyLocalization(document, LANG)`.
   - Must preserve 100% backward compatibility with existing tests and headless Chrome DOM parity.
2. **Strategy & Slices**:
   - Slice 1: Decorate `dashboard.html` with `data-i18n` attributes on headers, KPIs, and executive dossier cards.
   - Slice 2: Decorate `debt-calculator.html` with `data-i18n` attributes on headers, strategy toggles, debts list, comparison cards, and simulators.
   - Slice 3: Connect `js/dashboard.js` and `js/debt-calculator.js` to `MoneyApp.I18n.register()` and `applyLocalization()`.
   - Slice 4: Add Phase 102 smoke invariant in `tests/smoke.test.mjs`.
   - Slice 5: Full QA verification (`rtk npm run lint` 0 errors, `npm test` 491/491 tests passing).
   - Slice 6: Bump version to `v2.5.45`, update lessons, commit and push to `origin/master`.
