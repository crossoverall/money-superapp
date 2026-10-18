---
task_id: "SDLC-BUGFIX-REMAINING-EXPENSE-MOBILE-OVERFLOW"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes Resolved
1. **Loose Flex Children Without Enclosing Group (`remaining-money.html` & `js/remaining-money.js`):**
   - Wrapped `.value-input`, `.unit`, `.auto-badge`, and `.remove-btn` in `<div class="entry-controls">`.
   - `.name-input` styled with `flex: 1 1 0%; min-width: 0; width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`.
2. **Absence of Overflow Barrier:**
   - Added `overflow: hidden;` to `.entry-row`, `.panel`, and `.pvd-row`.
3. **Responsive Mobile Calibrations:**
   - Calibrated `@media (max-width: 480px)` with 74px value inputs, 4px/3px gaps, and 18px delete buttons.

### Verification
- 333 unit & smoke tests passing (87 suites).
- 0 Biome linter errors.
- Headless Chrome CDP bounding-box visual audit across 320px, 360px, 375px, 390px, and 412px viewports in both English and Thai: 0 overflows, 0 exceptions, all controls aligned.
- Version bumped to `v2.5.12`.
