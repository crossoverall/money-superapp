---
task_id: "FEAT-LOADING-SKELETON-HAPTIC-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Cash Flow Inflow-Outflow Stream / Waterfall Diagram (Phase 20 / v2.0.3)
- **Status:** Completed & Verified (71 automated tests passing, 0 linter errors).
- **Summary:** Interactive SVG Step-Down Waterfall Diagram with zero-baseline deficit normalization, floating bars, connecting bridge lines, view switcher (Waterfall vs Bar), and expanded income legend.

---

### Proposed Feature Specification: Iframe Loading Skeleton, Haptic Feedback & Keyboard Tab Transitions (Phase 21 / Roadmap Item 2.2)

#### 1. Goal & Scope Limits
- **Objective:** Eliminate visual tab-switch flashes and improve tactile feel when navigating between the 7 tools in the shell ([`index.html`](file:///home/l2okii/Document/money-superapp/index.html)).
- **Key Capabilities & Benefits:**
  1. **Shimmer / Loading Skeleton Placeholder:**
     - Displays an animated shimmer skeleton (header, KPI cards, table blocks) inside `#mainFrame` container while an iframe tool is loading, completely eliminating white/empty frame flashes.
     - Automatically fades out when the child tool emits or finishes `onload`.
  2. **Tactile Haptic Feedback (Mobile):**
     - Triggers subtle vibration (`navigator.vibrate(10)`) when changing tabs via swipe or bottom nav taps (with feature detection and error guards).
  3. **Skip to Main Content Link (WCAG a11y):**
     - Adds a hidden skip-link (`<a href="#mainFrame" class="skip-link">Skip to main content</a>`) that becomes visible on keyboard focus for screen readers and power users.
  4. **Smooth Cross-Tab Transition:**
     - Adds subtle opacity fade transition (`0.15s ease-out`) between tool loads for a native app feel.
- **Target Files (<= 5 files, ~100-120 lines total):**
  1. `index.html` (skeleton markup, load listener, haptic trigger, skip link)
  2. `css/theme.css` (skeleton shimmer keyframes, skip-link styles)
  3. `tests/financial-math.test.mjs` (unit tests verifying transition timing & haptic safety guards)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Modifying child tool internal logic (preserves existing clean tools).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% pure CSS and vanilla JS, zero external UI libraries, offline-ready.
- **Hardware Resilience:** Safely checks `if ('vibrate' in navigator)` so non-supporting desktop browsers execute seamlessly.

#### 3. Step-by-Step Implementation Plan
1. **Skeleton & Shimmer Styles (`css/theme.css`):**
   - Add `.app-skeleton`, `.skeleton-bone`, `@keyframes shimmer`, and `.skip-link` styles matching system theme variables.
2. **Shell Integration (`index.html`):**
   - Embed skeleton overlay above `#mainFrame`.
   - Update `switchTab()` to show skeleton, trigger `navigator.vibrate(10)`, and hide skeleton on `iframe.onload`.
   - Add skip-to-content anchor.
3. **Automated Unit Testing (`tests/financial-math.test.mjs`):**
   - Unit test skeleton display states and haptic detection logic.
4. **Verification & Quality Gate:**
   - Execute `npm test` and `npm run lint`.
5. **Release & Bump:**
   - Append lessons to `.ai/memory/lessons.md`.
   - Bump version to `v2.0.4` via `node scripts/bump.mjs patch`.
