---
task_id: "SDLC-PHASE-82-UNIVERSAL-CARD-TOOLBAR-AND-RESPONSIVE-GRID"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 82 - v2.5.25)
1. **Universal Card Toolbar API (`js/shared.js`):**
   - Add `collapseAll()`, `expandAll()`, `toggleAll()` to `initCardLayoutManager`.
   - Support `options.toolbarContainer` or auto-detection of `#cardLayoutToolbar` across pages.
   - Render compact accessible buttons: `▼ พับทั้งหมด (Fold All)`, `▲ ขยายทั้งหมด (Expand All)`, `↺ รีเซ็ตลำดับ (Reset Order)`.
2. **Page Integration:**
   - Add `#cardLayoutToolbar` container and wire `initCardLayoutManager` in `dashboard.html`, `rebalance.html`, `tax-calculator-base.html`, `months-slips.html`, `remaining-money.html`, `debt-calculator.html`.
3. **Responsive Grid Utilities (`css/tailwind-lite.css`):**
   - Support `.sm:grid-cols-2`, `.md:grid-cols-2` for tablets and foldable devices (640px - 1024px).
4. **Verification & Delivery:**
   - Unit tests in `tests/shared.test.mjs` and smoke assertions in `tests/smoke.test.mjs`.
   - Headless Chrome CDP script capturing Fold All, Expand All, Dark, and Tablet/Mobile.
   - Biome audit & bump to `v2.5.25`.
