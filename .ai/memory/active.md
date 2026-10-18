---
task_id: "SDLC-PHASE-105-I18N-UNIVERSAL-COVERAGE"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 105 - Universal Declarative i18n & Exhaustive Coverage Suite)
1. **Diagnosis**:
   - In Phases 100-104, declarative `data-i18n` attributes were rolled out across all 7 interactive sub-tools (`dashboard`, `debt-calculator`, `remaining-money`, `rebalance`, `tax-calculator`, `tax-calculator-base`, `months-slips`).
   - `index.html` (the host shell, modals, quick tour, storage health, app lock, Google Drive sync, and offline QR sync) still relies almost exclusively on imperative DOM updates in `applyLang()` without declarative `data-i18n` markup on its modal controls.
   - We need an automated **Exhaustive Translation Coverage Test** (`tests/i18n-coverage.test.mjs`) that audits every single `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`, and `data-i18n-aria-label` attribute across all 8 core application HTML pages, verifying 100% presence and bidirectional symmetry in the respective translation dictionaries.
2. **Strategy & Slices**:
   - Slice 1: Decorate `index.html` with declarative `data-i18n` attributes across all modals, settings sections, and action buttons.
   - Slice 2: Synchronize and verify all keys in `js/app-shell.js` `translations.th` and `translations.en`.
   - Slice 3: Create `tests/i18n-coverage.test.mjs` verifying that 100% of declared `data-i18n*` attributes across all 8 HTML pages have corresponding entries in both `th` and `en`.
   - Slice 4: Add Phase 105 smoke test invariants in `tests/smoke.test.mjs`.
   - Slice 5: Quality Gates (`rtk npm run lint` 0 errors/warnings, `npm test` 100% passing across all suites), bump patch to `v2.5.48`, commit and push to `origin/master`.
