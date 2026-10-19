---
task_id: "SDLC-PHASE-108-JSDOC-TYPE-ANNOTATIONS-BATCH-3"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 108 - JSDoc Type Annotations & Type Contracts for Core Engines - Batch 3)
1. **Diagnosis**:
   - Following Phase 106 (Batch 1: 7 core tax/investment engines) and Phase 107 (Batch 2: 8 banking/refinance/p2p/bridge engines), we complete Pillar 6 type contracts for the final Batch 3 engines (6 files):
     1. `budget-import.js` (RFC-4180 tokenizer, column detection, candidate budget normalization)
     2. `cashflow-viz.js` (Budget rule 50/30/20, emergency runway, Sankey stream flows & coordinates)
     3. `financial-health.js` (5-pillar composite scoring, Next Best Move ranking, radar chart trigonometry, net worth composition)
     4. `i18n-core.js` (Translation registry, declarative DOM injection, interpolation engine)
     5. `rebalance-subtools.js` (Gold DCA, foreign tax repatriation, target date lifecycle glidepath state & UI)
     6. `tax-worksheet.js` (ภ.ง.ด. 90/91 e-filing worksheet, Sec 47 500k ceiling pool, Sec 47 ทวิ dividend tax credit, printable tax dossier)
   - With Batch 3, 100% of all 21 modularized engines in `js/engines/` will have comprehensive JSDoc `@typedef`, `@param`, `@returns` annotations and automated type contract verification test suites.
2. **Strategy & Slices (Batch 3 - 6 Engines)**:
   - Slice 1: JSDoc type annotations across `budget-import.js`, `cashflow-viz.js`, and `financial-health.js`.
   - Slice 2: JSDoc type annotations across `i18n-core.js`, `rebalance-subtools.js`, and `tax-worksheet.js`.
   - Slice 3: Create automated type contract test suite `tests/type-contracts-batch3.test.mjs` verifying contract conformance for all 6 engines.
   - Slice 4: Update `tests/smoke.test.mjs` with Phase 108 assertions.
   - Slice 5: Quality Gates (`rtk npm run lint` 0 errors/warnings, `npm test` 100% passing across all suites), Security Review, bump patch to `v2.5.51`, update lessons, commit and push to `origin/master`.
