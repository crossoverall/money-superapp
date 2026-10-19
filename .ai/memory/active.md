---
task_id: "SDLC-PHASE-109-PERFORMANCE-OPTIMIZATIONS"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 109 - Performance Audit & Resource Preloading)
1. **Diagnosis**:
   - Following the successful completion of Pillar 6 Type Contracts across all 21 modularized engines in `js/engines/` (Phases 106-108), the improvement plan calls for Tier 3 Strategic Performance Optimizations (Phase 109+).
   - In a zero-build, offline-first client architecture (ADR-001):
     1. Navigating between standalone tool pages (`dashboard.html`, `remaining-money.html`, `rebalance.html`, etc.) inside the iframe currently incurs cold-fetch overhead and brief skeleton loading if not already cached in memory.
     2. Large pages with multiple auxiliary panels (e.g. `rebalance.html` with Gold DCA, Foreign Tax, Glidepath; `tax-calculator-base.html` with e-Filing Worksheet; `dashboard.html` with Dossier and Stress Testing) perform full layout and DOM rendering calculations on offscreen hidden card elements.
     3. Nav tab interactions lack speculative prefetching on `pointerenter` / `touchstart`.
2. **Strategy & Slices (Phase 109)**:
   - Slice 1: CSS Rendering Performance & Content-Visibility:
     - Add `.content-visibility-auto` utility and apply `content-visibility: auto; contain-intrinsic-size: 1px 300px;` to offscreen accordion card bodies and auxiliary tools in `css/theme.css`.
   - Slice 2: Resource Hints & Hover Prefetching:
     - Add `<link rel="preload">` for `css/theme.css` in `index.html`.
     - Add `<link rel="prefetch">` for high-frequency destination pages (`dashboard.html`, `remaining-money.html`).
     - Add speculative hover/touch prefetcher in `js/app-shell.js` (`prefetchTab(targetSrc)`) on nav button `pointerenter` and `touchstart`.
   - Slice 3: Automated Performance & Integrity Test Suite:
     - Create `tests/performance.test.mjs` verifying resource hints, prefetch mechanics, CSS content-visibility declarations, service worker cache consistency, and engine calculation benchmarks (<50ms).
   - Slice 4: Update `tests/smoke.test.mjs` with Phase 109 assertions.
   - Slice 5: Quality Gates (`rtk npm run lint` 0 errors/warnings, `npm test` 100% passing across all suites), Security Review, bump patch to `v2.5.52`, update lessons, commit and push to `origin/master`.
