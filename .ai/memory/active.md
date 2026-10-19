---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 119 — Responsive Container Width Alignment (896px / max-w-4xl)

#### 1. Goal & Scope Limits
- **Objective:**
  Expand the container width of `rebalance.html` (Rebalance), `tax-calculator.html` (PVD & Severance Tax), `remaining-money.html` (Remaining Money), `debt-calculator.html` (Debt Payoff), and `dashboard.html` (Dashboard) from the narrow `520px` column up to `896px` (`56rem` / `max-w-4xl`), aligning them uniformly with `tax-calculator-base.html` (Income Tax) and `months-slips.html` (Payslips).
  Preserve narrow, progressive responsive margins on mobile screens ($\le 480\text{px}$ and $\le 640\text{px}$) with strictly zero horizontal blowout (`scrollWidth <= innerWidth`).
- **Target Files (<= 7 files, ~180 lines):**
  1. `rebalance.html` (Update body max-width: 896px and responsive mobile padding)
  2. `tax-calculator.html` (Update body max-width: 896px and responsive card scaling)
  3. `remaining-money.html` (Update body max-width: 896px and responsive mobile padding)
  4. `debt-calculator.html` (Update body max-width: 896px and responsive mobile padding)
  5. `dashboard.html` (Update body max-width: 896px and responsive mobile padding)
  6. `tests/smoke.test.mjs` (Update container width contract assertions)
  7. `tests/visual-regression.test.mjs` (Verify multi-viewport width parity across all tools)
- **Explicit Out of Scope:**
  - Zero NPM runtime dependencies (strict adherence to ADR-001).
  - No changes to financial calculation logic, formulas, or DOM IDs.

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `rebalance.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, `dashboard.html`.
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA Architecture):** Pure CSS styling adjustments using existing utility and CSS custom property structures.
  - **ADR-002 (Modular Multi-Tool Iframe App Shell Architecture):** Each tool runs in an `<iframe>` hosted by `index.html`. On desktop viewports (>1024px), expanding width from 520px to 896px utilizes desktop monitor real estate consistently across tools.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `rebalance.html`:
  - Update `body { max-width: 896px; margin-inline: auto; }`.
  - Add `@media (max-width: 640px) { body { padding: 16px 12px 70px; } .panel { padding: 14px 12px; } }`.
- **Step 2:** In `tax-calculator.html`:
  - Update `body { max-width: 896px; margin-inline: auto; }`.
  - Add `@media (min-width: 640px) { .card { padding: 24px 20px 28px; } }`.
- **Step 3:** In `remaining-money.html`:
  - Update `body { max-width: 896px; margin-inline: auto; }`.
- **Step 4:** In `debt-calculator.html`:
  - Update `body { max-width: 896px; margin-inline: auto; }`.
- **Step 5:** In `dashboard.html`:
  - Update `body { max-width: 896px; margin-inline: auto; }`.
- **Step 6:** In `tests/smoke.test.mjs`:
  - Update lines 140-147 to assert `max-width: 896px` standard alignment for `tax-calculator.html` and other sub-tools.
- **Step 7:** In `tests/visual-regression.test.mjs`:
  - Expand visual regression suite to verify responsive width invariants (mobile <= 375px with 0 overflow, and desktop 1024px expanding > 520px up to 896px) across `rebalance.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, and `dashboard.html`.
- **Step 8:** Run linting, visual regression tests, smoke tests, and full test suite verification.

#### 4. Acceptance Criteria
- [x] `rebalance.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, and `dashboard.html` have `max-width: 896px` matching income tax `max-w-4xl`.
- [x] On mobile viewports ($\le 375\text{px}$ and $\le 320\text{px}$), all 5 pages retain compact side margins with strictly 0px horizontal overflow (`scrollWidth <= innerWidth`).
- [x] On desktop viewports ($\ge 1024\text{px}$), all 5 pages expand up to 896px width with centered `margin-inline: auto`.
- [x] `tests/smoke.test.mjs` and `tests/visual-regression.test.mjs` pass 100%.
- [x] `npm run lint` passes with 0 errors and 0 warnings.
- [x] Full `npm test` passes 100% across all suites.

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:** Clean git tree (`rtk git status`).
- **Verification Commands:**
  - `npm run lint`
  - `node --test tests/visual-regression.test.mjs`
  - `node --test tests/smoke.test.mjs`
  - `npm test`
