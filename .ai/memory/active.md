---
task_id: "SDLC-PHASE-101-CENTRALIZED-I18N-DICTIONARIES"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 101 - Centralized Domain Dictionaries js/i18n/{th,en}.js & Automated Symmetry Suite)
1. **Diagnosis**:
   - While Phase 100 introduced `MoneyApp.I18n` engine, translation dictionaries across all 7 tools remain fragmented across disparate files.
   - Translation keys need a centralized, structured domain organization (`common`, `dashboard`, `debt`, `tax`, `remaining`, `rebalance`, `slips`).
   - Must guarantee 100% key symmetry between Thai and English files to prevent translation drift.
2. **Strategy & Slices**:
   - Slice 1: Create `js/i18n/th.js` with structured domain dictionaries.
   - Slice 2: Create `js/i18n/en.js` mirroring `js/i18n/th.js` with 100% key symmetry.
   - Slice 3: Register `js/i18n/th.js` and `js/i18n/en.js` in `sw.js` and all 8 core HTML files.
   - Slice 4: Create `tests/i18n-dictionaries.test.mjs` verifying 100% dictionary symmetry, zero orphan keys, and proper namespace registration with `MoneyApp.I18n`.
   - Slice 5: Add Phase 101 smoke invariant in `tests/smoke.test.mjs`.
   - Slice 6: Full QA verification (`rtk npm run lint` 0 errors, `npm test` 100% pass).
   - Slice 7: Security review & release bump to `v2.5.44`, commit and push to `origin/master`.
