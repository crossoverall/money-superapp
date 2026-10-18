---
task_id: "SDLC-PHASE-73-PWA-UPDATE-TOAST"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes Resolved
1. **Uncontrolled PWA Cache Refresh & Version Mismatches:**
   - `sw.js` previously called `self.skipWaiting()` automatically upon `install`, updating assets while tabs remained active.
   - PWA users (especially mobile) had no indicator of new versions and could experience mismatched JS/HTML versions.
   - Updated `sw.js` to wait until user triggers update or all clients close.
   - Added `message` listener in `sw.js` for `{ type: 'SKIP_WAITING' }`.
   - Added `#pwaUpdateToast` with floating pill styling on desktop and responsive docked card above `.bottom-nav` on mobile (`calc(66px + env(safe-area-inset-bottom, 0px))`).
   - Added `showPwaUpdateToast()`, `dismissPwaUpdateToast()`, `applyPwaUpdate()` in `js/app-shell.js` with `controllerchange` handler reloading the top window.
   - Implemented 100% symmetric Thai and English translations (`pwaUpdateText`, `pwaUpdateBtn`).

### Verification
- 348 / 348 unit & integration smoke tests passing (`npm test`).
- 0 Biome linter errors (`npx @biomejs/biome check`).
- Headless Chrome CDP visual inspection: Verified Desktop Light, Desktop Dark, Mobile iPhone 12/13/14 Dark, and Mobile EN modes.
- Bumped version to `v2.5.16`.
