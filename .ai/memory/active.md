---
task_id: "none"
status: "idle"
current_stage: "idle"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 131 — WCAG 2.1 AA Accessibility Audit & Live Region Announcements (v2.5.72)

#### 1. Goal & Scope Limits
- **Objective:**
  Implement accessibility improvements conforming to WCAG 2.1 AA across Money Superapp:
  1. **Accessible Live Region Announcer (`MoneyApp.announce`):**
     - Global announcer in `js/shared.js` that dynamically manages a `.sr-only` `aria-live` region (`#a11y-announcer`).
     - Screen readers (NVDA, VoiceOver, JAWS) receive non-intrusive spoken updates for asynchronous and dynamic calculations.
  2. **Live Regions & ARIA Roles on Calculated Totals:**
     - Dynamic financial summary cards and KPI displays in `tax-calculator-base.html`, `remaining-money.html`, `debt-calculator.html`, and `dashboard.html` feature `aria-live="polite"` or `role="status"`.
  3. **Focus-Visible & Screen-Reader Tokens:**
     - Add universal `:focus-visible` ring styling in `css/theme.css` with 2px offset.
     - Add `.sr-only` utility class in `css/theme.css` for visually-hidden, screen-reader-accessible labels.
  4. **Automated WCAG 2.1 AA Static & Dynamic Test Suite:**
     - Create `tests/a11y-wcag.test.mjs` verifying document metadata (lang, title, viewport), form control labeling, live region declarations, and `MoneyApp.announce` functionality.
- **Target Files (<= 5 files, ~200 lines):**
  1. `css/theme.css` (Add `:focus-visible` styles & `.sr-only` utility)
  2. `js/shared.js` (Implement `MoneyApp.announce`)
  3. `remaining-money.html` & `tax-calculator-base.html` (Add ARIA live attributes)
  4. `tests/a11y-wcag.test.mjs` (Comprehensive WCAG 2.1 AA test suite)
  5. `tests/smoke.test.mjs` (Contract assertion for `MoneyApp.announce`)
- **Explicit Out of Scope:**
  - Zero external npm libraries or heavy DOM parser dependencies (pure node regex / mock DOM).
  - No alteration of visual styling for non-keyboard users.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `css/theme.css`, `js/shared.js`, `remaining-money.html`, `tax-calculator-base.html`, `tests/a11y-wcag.test.mjs`, `tests/smoke.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% offline-first privacy)
  - ADR-002 (Modular architecture across 8 HTML tools)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `css/theme.css`:
  - Add `:focus-visible` and interactive element focus rings (`outline: 2px solid var(--core, #2F8B76); outline-offset: 2px;`).
  - Add `.sr-only` class.
- **Step 2:** In `js/shared.js`:
  - Implement `MoneyApp.announce(message, priority = 'polite')`. Creates or retrieves `#a11y-announcer`, sets `aria-live`, and updates text content.
- **Step 3:** In HTML tools (`tax-calculator-base.html`, `remaining-money.html`):
  - Mark dynamic KPI summary cards with `aria-live="polite"` and `role="status"`.
- **Step 4:** Create `tests/a11y-wcag.test.mjs` with assertions for WCAG 2.1 AA invariants and announcer tests.
- **Step 5:** In `tests/smoke.test.mjs`:
  - Add contract tests for `MoneyApp.announce`.
- **Step 6:** QA & Debugger agent verification (`npm run lint`, `npm test`).
- **Step 7:** Code & Security Reviewer adversarial audit.
- **Step 8:** Release & Docs (bump v2.5.72, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] `css/theme.css` provides `:focus-visible` styles and `.sr-only` utility.
- [x] `MoneyApp.announce(message, priority)` provides screen-reader announcement capability across browser and node environments.
- [x] Dynamic KPI and tax calculation summary panels include `aria-live="polite"` or `role="status"`.
- [x] `tests/a11y-wcag.test.mjs` passes with 0 failures, verifying all 8 HTML tools.
- [x] `npm run lint` passes with 0 errors and 0 warnings.
- [x] `npm test` passes 100% green.
- [x] Released, bumped to v2.5.72, and pushed to `origin/master`.
