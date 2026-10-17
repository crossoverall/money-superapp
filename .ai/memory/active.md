---
task_id: "REFACTOR-DECOMPOSE-REBALANCE-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Progressive Script Decomposition for Portfolio Rebalancer (Phase 16 Item 4.1)

#### 1. Goal & Scope Limits
- **Objective:** Extract the massive inline JavaScript logic from [`rebalance.html`](file:///home/l2okii/Document/money-superapp/rebalance.html) (~2,100 lines) into a dedicated, lint-checked script [`js/rebalance.js`](file:///home/l2okii/Document/money-superapp/js/rebalance.js).
- **Key Capabilities & Benefits:**
  1. Reduces `rebalance.html` from ~2,109 lines down to clean HTML markup & styling.
  2. Brings the entire portfolio rebalancer, multi-currency conversion engine, and SVG donut chart generator under Biome linter coverage (`npm run lint`).
  3. Registers `js/rebalance.js` into [`sw.js`](file:///home/l2okii/Document/money-superapp/sw.js) for full offline PWA precaching.
  4. Preserves 100% runtime compatibility, global functions, event listeners, and localStorage persistence.
- **Target Files (<= 5 files):**
  1. `rebalance.html` (replaces inline script with `<script src="js/rebalance.js"></script>`)
  2. `js/rebalance.js` (new extracted script file)
  3. `sw.js` (adds `js/rebalance.js` to offline precache assets)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Modifying portfolio state schemas (`rebalanceCalculator.state.v1`).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Pure native ES/vanilla script loaded via standard `<script>` tag with zero bundling or transpile steps.
- **Service Worker Caching:** Explicitly precached in `CACHE_NAME` to ensure instant offline availability.

#### 3. Step-by-Step Implementation Plan
1. **Script Extraction:**
   - Locate the main `<script>` tag in `rebalance.html`.
   - Extract cleanly into `js/rebalance.js`.
   - Replace with `<script src="js/rebalance.js"></script>`.
2. **Service Worker Precache Integration:**
   - Add `'./js/rebalance.js'` to `ASSETS_TO_CACHE` in `sw.js`.
3. **Automated Verification:**
   - Run `npx @biomejs/biome check --write js/ scripts/ tests/` and verify formatting/lint compliance.
   - Run `npm test` (all 55 tests passing).
4. **Release & Bump:**
   - Update `.ai/memory/active.md` to stage `release`, `status: "completed"`.
   - Bump version to `v1.9.9`.
