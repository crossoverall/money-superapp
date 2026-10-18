---
task_id: "SDLC-BUGFIX-CARD-LAYOUT-AND-AUXILIARY"
status: "completed"
current_stage: "completed"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes
1. **Multi-Child Collapsing Bug in `initCardLayoutManager` (`js/shared.js`):**
   - `getCardBody(card)` fell back to `card.children[1]`.
   - Cards without an explicit `.card-body` wrapper have multiple direct child elements (inputs, tables, summaries, actions).
   - Toggling `.card-collapsed-hidden` only hid the second element, leaving all other children visible underneath the collapsed header.
   - **Fix:** Update `initCardLayoutManager` to toggle `.card-collapsed-hidden` on ALL non-header child elements of a card (or all elements in `getCardBodies(card)`), ensuring complete collapse.
2. **Duplicate Toggle Controls & State Desynchronization in `rebalance.html`:**
   - `#panelTargetDateGlidepath`, `#panelThaiGold`, and `#panelForeignTaxAdvisor` had legacy inline toggles (`glidepathToggleArrow`, `goldToggleArrow`, `foreignTaxToggleArrow`, custom `onclick` handlers, and inline `style="display:none"`).
   - When `initCardLayoutManager` injected its own `▲`/`▼` toggle button, two independent arrows appeared side-by-side, causing conflicting click events and broken collapse/expand states.
   - **Fix:** Retire legacy conflicting toggle arrows and inline handlers. Wire panels to use the unified Card Layout Manager folding mechanism.
3. **Auxiliary Panels Ordering in `rebalance.html`:**
   - In HTML markup, `#panelTargetDateGlidepath` was positioned above `#panelThaiGold`, `#panelForeignTaxAdvisor`, and `#howto`.
   - The user requested moving all 3 auxiliary sub-tools ("Target Date Retirement", "Thai Gold DCA", and "Foreign Investment & Crypto Tax") to the bottom of the page.
   - **Fix:** Relocate the 3 auxiliary card DOM blocks to the bottom of `rebalance.html` (after `#panelBuckets` and `#howto`, above the action buttons), and initialize them as collapsed by default.

### Atomic SDLC Action Plan
- **Slice 1: Card Layout Engine Core Fix (`js/shared.js`)**
  - Make `initCardLayoutManager` manage all non-header child elements when collapsing cards without a single wrapper.
  - Support `defaultCollapsed` option for specific card IDs so sub-tools can start folded.
- **Slice 2: Rebalance HTML & Controller Harmonization (`rebalance.html`, `js/rebalance.js`)**
  - Move `#panelTargetDateGlidepath`, `#panelThaiGold`, and `#panelForeignTaxAdvisor` to the bottom of `rebalance.html`.
  - Harmonize header structures and remove redundant duplicate toggle arrows/handlers.
  - Pass `defaultCollapsed: ['panelTargetDateGlidepath', 'panelThaiGold', 'panelForeignTaxAdvisor']` to `initCardLayoutManager`.
- **Slice 3: QA Verification & Smoke Test Expansion (`tests/smoke.test.mjs`)**
  - Add headless DOM assertions testing multi-child collapsing behavior and DOM position order in `rebalance.html`.
  - Run full test suite (`npm test`) and linter (`npx @biomejs/biome lint`).
- **Slice 4: Independent Security & Adversarial Review (`reviewer.md`)**
  - Verify ADR-001 offline invariance, zero external network requests, keyboard accessibility, and bilingual parity.
- **Slice 5: Release & Memory Consolidation (`release.md`)**
  - Bump patch version, append lessons to `.ai/memory/lessons.md`, commit and push one-by-one to `origin/master`.

