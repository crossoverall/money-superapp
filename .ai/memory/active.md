---
task_id: "REFACTOR-DECOMPOSE-REMAINING-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Progressive Script Decomposition for Remaining Money (Phase 15 Item 4.1)

#### 1. Goal & Scope Limits
- **Objective:** Extract the massive inline JavaScript logic from [`remaining-money.html`](file:///home/l2okii/Document/money-superapp/remaining-money.html) into a dedicated, lint-checked script [`js/remaining-money.js`](file:///home/l2okii/Document/money-superapp/js/remaining-money.js).
- **Key Capabilities & Benefits:**
  1. Reduces `remaining-money.html` from ~3,080 lines down to clean HTML markup & inline styles.
  2. Brings the core budget, template preset, and cashflow engine under Biome linter coverage (`npm run lint`).
  3. Registers `js/remaining-money.js` into [`sw.js`](file:///home/l2okii/Document/money-superapp/sw.js) for full offline PWA caching.
  4. Preserves 100% runtime compatibility, global functions, event listeners, and localStorage persistence.
- **Target Files (<= 5 files):**
  1. `remaining-money.html` (replaces inline script with `<script src="js/remaining-money.js"></script>`)
  2. `js/remaining-money.js` (new extracted script file)
  3. `sw.js` (adds `js/remaining-money.js` to offline precache assets)
  4. `package.json` / scripts if needed
  5. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Changing budget data structure or localStorage schema (`remainingMoneyCalculator.state.v1`).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** Native ES/vanilla script loaded via standard `<script>` tag with zero bundling or transpile steps.
- **Service Worker Caching:** Explicitly precached in `CACHE_NAME` to ensure instant offline availability.

#### 3. Step-by-Step Implementation Plan
1. **Script Extraction:**
   - Locate the main `<script>` tag in `remaining-money.html`.
   - Extract cleanly into `js/remaining-money.js`.
   - Replace with `<script src="js/remaining-money.js"></script>`.
2. **Service Worker Precache Integration:**
   - Add `'./js/remaining-money.js'` to `PRECACHE_ASSETS` in `sw.js`.
3. **Automated Verification:**
   - Run `npx @biomejs/biome check --write js/ scripts/ tests/` and verify formatting/lint compliance.
   - Run `npm test` (all 55 tests passing).
4. **Release & Bump:**
   - Update `.ai/memory/active.md` to stage `release`, `status: "completed"`.
   - Bump version to `v1.9.8`.
