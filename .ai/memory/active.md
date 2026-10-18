---
task_id: "SDLC-PHASE-92-UNIFIED-BRIDGE-PROTOCOL"
status: "in_progress"
current_stage: "plan"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 92 - Unified Bridge Protocol & Topology)
1. **Diagnosis**:
   - Cross-tool data handoffs between the 7 tools rely on 11 ad-hoc `localStorage` keys (`pendingSlipImport`, `pendingTaxAccrual`, `pendingBudget`, `pendingDebtWindfall`, etc.).
   - Each tool implements its own ad-hoc consume-once logic and listener handlers, with no schema validation, payload versioning, or standardized telemetry.
2. **Strategy & Slices**:
   - Slice 1: Create `js/engines/bridge.js` defining `MoneyApp.Bridge` with envelope standardization, consume-once lifecycle, `BroadcastChannel` + `storage` event synchronization, and transparent legacy key mapping.
   - Slice 2: Register `js/engines/bridge.js` in `sw.js`, `tests/smoke.test.mjs`, `index.html`, all 7 sub-pages, and test harnesses.
   - Slice 3: Create `tests/bridge-protocol.test.mjs` unit testing send, receive, peek, clear, legacy compatibility, and schema validation.
   - Slice 4: Update `.ai/context/architecture.md` with the living Mermaid bridge topology diagram.
   - Slice 5: Full QA verification (`npm test`, `npm run lint`, bilingual parity) & Code/Security Review.
   - Slice 6: Bump version to `v2.5.35`, document lessons in `.ai/memory/lessons.md`, commit and push to `origin/master`.
