---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 128 — Mobile Pull-to-Refresh Gesture & Web App Badging API (v2.5.69)

#### 1. Goal & Scope Limits
- **Objective:**
  Deliver native-grade mobile PWA polish to Money Superapp through:
  1. **Pull-to-Refresh Gesture (`initPullToRefresh`):**
     - Smooth top-edge pull-down gesture on touch devices with visual progress indicator (`#pullToRefreshBar`).
     - Triggers bridge cache revalidation and cross-tool sync across all active frames with haptic feedback (`navigator.vibrate(15)`).
  2. **Web App Badging API (`navigator.setAppBadge` / `navigator.clearAppBadge`):**
     - Computes ambient financial indicators:
       - Annual tax filing countdown during Q1 (days until April 8 e-Filing deadline).
       - Budget deficit / urgent financial warnings count (negative remaining balance or unallocated funds).
     - Graceful fallback for non-supported browsers via document title badge `(N) Money Superapp` and `#pwaStatusDot` badge dot.
     - Child iframe tools can trigger badge refreshes via postMessage (`action: 'updateBadge'`).
  3. 100% offline-first, zero runtime external libraries, zero layout shifts.
- **Target Files (<= 5 files, ~180 lines):**
  1. `index.html` (Add `#pullToRefreshBar` pull-down visual indicator element)
  2. `js/app-shell.js` (Implement `initPullToRefresh`, `MoneyApp.updateAppBadge`, `MoneyApp.clearAppBadge`, and message listener)
  3. `js/shared.js` (Add `MoneyApp.requestAppBadgeUpdate()` bridge postMessage helper)
  4. `tests/smoke.test.mjs` (Add Phase 128 contract tests for badging and pull-to-refresh)
- **Explicit Out of Scope:**
  - No external mobile gesture libraries (ADR-001).
  - No background push notification servers (strictly client-side Badging API).

#### 2. Architecture & Decision Alignment
- **Affected Components:** `index.html`, `js/app-shell.js`, `js/shared.js`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% client-side privacy)
  - ADR-002 (Modular iframe app shell)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `index.html`:
  - Add `#pullToRefreshBar` visual indicator above `<main id="mainContainer">`.
- **Step 2:** In `js/app-shell.js`:
  - Implement `initPullToRefresh()` tracking touch gestures when `scrollTop === 0`.
  - Implement `MoneyApp.computeBadgeCount()` and `MoneyApp.updateAppBadge()`.
  - Implement `MoneyApp.clearAppBadge()`.
  - Handle `updateBadge` postMessage action from child iframes.
- **Step 3:** In `js/shared.js`:
  - Add `MoneyApp.requestAppBadgeUpdate()` dispatching `updateBadge` action to parent window.
- **Step 4:** In `tests/smoke.test.mjs`:
  - Add tests validating `#pullToRefreshBar`, `updateAppBadge`, fallback title badging, and postMessage forwarding.
- **Step 5:** Run full QA verification (`npm run lint`, `npm test`).
- **Step 6:** Code & Security Reviewer adversarial audit.
- **Step 7:** Release & Docs (bump v2.5.69, lessons.md, commit, and push).

#### 4. Acceptance Criteria
- [x] Pull-down gesture from top of screen reveals `#pullToRefreshBar` and refreshes bridge data on release.
- [x] `MoneyApp.updateAppBadge()` correctly invokes `navigator.setAppBadge()` on supported environments.
- [x] Unsupported environments fall back cleanly to title badge `(N) Money Superapp`.
- [x] Child iframe tools can request badge updates via postMessage.
- [x] Zero Biome lint warnings/errors.
- [x] All tests pass in `npm test`.
- [x] Released, bumped to v2.5.69, and pushed to `origin/master`.
