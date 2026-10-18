---
task_id: "SDLC-PHASE-100-I18N-CORE-ENGINE"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 100 - Centralized Internationalization Core & Declarative data-i18n Engine)
1. **Diagnosis**:
   - Translations are scattered across per-file ad-hoc objects (`const translations = { th: {...}, en: {...} }` in `app-shell.js`, `dashboard.js`, `debt-calculator.js`) and imperative `if (LANG === 'en')` blocks in other tools.
   - Translation key drift is the #1 recurring defect (5 incidents in lessons log).
   - Dynamic localization requires manual DOM ID lookups (`document.getElementById('lbl-xxx').textContent = ...`).
2. **Strategy & Slices**:
   - Slice 1: Create `js/engines/i18n-core.js` (`MoneyApp.I18n`) containing:
     - `register(lang, dict)`: Deep/flat key dictionary registry
     - `t(key, fallback, params)`: Key resolver with parameter interpolation (e.g. `{name}`, `{amount}`)
     - `applyLocalization(root = document, lang = LANG)`: Declarative localization of `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-title]`, `[data-i18n-aria-label]`
     - Centralized common base dictionaries (shell, toolbar, reset, actions, confirmations, statuses) in `th` and `en`.
   - Slice 2: Register `js/engines/i18n-core.js` in `sw.js` and all 8 core HTML files.
   - Slice 3: Connect `MoneyApp.I18n` to `app-shell.js` and `initLanguage()` in `js/shared.js`, and support declarative `data-i18n` on `index.html`.
   - Slice 4: Create unit tests in `tests/i18n-core.test.mjs` verifying parameter interpolation, fallback, dictionary registry, and declarative DOM traversal.
   - Slice 5: Add Phase 100 smoke invariant in `tests/smoke.test.mjs`.
   - Slice 6: Full QA verification (`rtk npm run lint` 0 errors, `npm test` 100% pass across all 478+ tests).
   - Slice 7: Security review & release bump to `v2.5.43`, commit and push to `origin/master`.
