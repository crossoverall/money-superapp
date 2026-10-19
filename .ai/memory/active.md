---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Phase 114 — Mobile Responsive Menu Wrapping & PVD Margin Alignment

#### 1. Goal & Scope Limits
- **Objective:**
  1. Fix mobile viewport clipping in `dashboard.html`: The Executive Financial Dossier header (`#lbl-dossier-panel-title`) contains a title, sync badge, and 3 action buttons (`btnTogglePrivacyMask`, `btnPrintDossier`, `btnShareDossier`). On viewports <= 640px / 375px, the buttons overflow horizontally past the right edge. Wrap and stack the title and button group gracefully with `flex: 1 1 auto` on buttons.
  2. Align side margins in `tax-calculator.html`: Replace the legacy 56px side margins (24px body padding + 32px card padding = 112px horizontal reduction) by aligning `body` and `.card` styling to the `remaining-money.html` standard (`padding: 26px 16px 70px; max-width: 520px; margin-inline: auto;` on `body` and `padding: 20px 16px 24px;` on `.card`), recovering 48px of usable horizontal screen space for mobile inputs and tables.
  3. Add regression smoke assertions in `tests/smoke.test.mjs` to protect these layout invariants permanently.
- **Target Files (<= 5 files, ~80 lines total change):**
  1. `dashboard.html` (~25 lines changed)
  2. `tax-calculator.html` (~20 lines changed)
  3. `tests/smoke.test.mjs` (~35 lines changed)
- **Explicit Out of Scope:**
  - No changes to financial math calculations or calculation engines (`js/engines/*`).
  - No changes to App Shell (`index.html`) tab switching or iframe bridging mechanisms.
  - No changes to other calculator pages (`debt-calculator.html`, `rebalance.html`, etc.) which already adhere to the standard container dimensions.

---

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `dashboard.html` (Executive Dossier panel header, `h1`, `.panel-title`, and `@media (max-width: 640px)`)
  - `tax-calculator.html` (`body` container and main `.card` styles)
  - `tests/smoke.test.mjs` (`Document & Core HTML Page Architecture` test suite)
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy):** Zero external dependencies, pure HTML5/CSS3.
  - **ADR-002 (Modular Multi-Tool Iframe App Shell Architecture):** Consistent viewport sizing and layout conventions across all 7 iframe tools.
  - **ADR-003 (Replacement of External CDN with Offline Tailwind-Lite & Embedded CSS):** Offline CSS styling without external CDN dependencies.

---

#### 3. Step-by-Step Implementation Plan

##### Step 1: Update `dashboard.html` CSS & Markup for Mobile Menu Wrapping
- **File:** `dashboard.html`
- **Action:**
  1. In `<style>`: Update global `.panel-title` and `h1` rules:
     - `h1`: Add `flex-wrap: wrap; gap: 8px;`.
     - `.panel-title`: Add `flex-wrap: wrap; gap: 8px;`.
  2. Add dedicated responsive CSS rules inside `<style>` under `@media (max-width: 640px)`:
     ```css
     @media (max-width: 640px) {
       h1 {
         flex-wrap: wrap;
         gap: 8px;
       }
       .panel-title {
         flex-wrap: wrap;
         gap: 8px;
       }
       #lbl-dossier-panel-title {
         flex-direction: column;
         align-items: stretch;
         gap: 8px;
       }
       #lbl-dossier-panel-title .dossier-title-group,
       #lbl-dossier-panel-title > div:first-child {
         display: flex;
         align-items: center;
         justify-content: space-between;
         flex-wrap: wrap;
         gap: 6px;
         width: 100%;
       }
       #lbl-dossier-panel-title .dossier-action-group,
       #lbl-dossier-panel-title > div.no-print {
         display: flex;
         flex-wrap: wrap;
         gap: 6px;
         width: 100%;
       }
       #lbl-dossier-panel-title .dossier-action-group .action-btn,
       #lbl-dossier-panel-title > div.no-print .action-btn {
         flex: 1 1 auto;
         justify-content: center;
         text-align: center;
         padding: 6px 8px;
         font-size: 11px;
       }
     }
     ```
  3. In markup: Add semantic class names `dossier-title-group` and `dossier-action-group` to the two direct children of `#lbl-dossier-panel-title` for clarity and clean CSS hook binding:
     ```html
     <div class="panel-title" id="lbl-dossier-panel-title">
       <div class="dossier-title-group" style="display:flex; align-items:center; gap:8px;">
         ...
       </div>
       <div class="dossier-action-group no-print" style="display:flex; gap:6px; align-items:center;">
         ...
       </div>
     </div>
     ```
- **Rationale:** Ensures that on mobile screens (<= 640px), the title group and the action button group cleanly stack vertically. The buttons wrap and stretch proportionally to fill available width (`flex: 1 1 auto`), completely eliminating horizontal clipping of "Print Dossier" and "Share Dossier".

##### Step 2: Update `tax-calculator.html` Container Margins & Padding
- **File:** `tax-calculator.html`
- **Action:**
  1. In `<style>`: Update `body` rule from:
     ```css
     body {
       font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", Helvetica, Arial, sans-serif;
       background: var(--bg);
       min-height: 100vh;
       display: flex;
       align-items: center;
       justify-content: center;
       padding: 24px;
     }
     ```
     to standard alignment matching `remaining-money.html` and `dashboard.html`:
     ```css
     body {
       font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", Helvetica, Arial, sans-serif;
       background: var(--bg);
       color: var(--ink);
       margin: 0;
       padding: 26px 16px 70px;
       max-width: 520px;
       margin-inline: auto;
     }
     ```
  2. Update `.card` rule from:
     ```css
     .card {
       background: var(--card-bg);
       border: 1px solid var(--line);
       border-radius: 16px;
       box-shadow: 0 4px 24px var(--card-shadow);
       width: 100%;
       max-width: 520px;
       padding: 28px 32px 32px;
     }
     ```
     to:
     ```css
     .card {
       background: var(--card-bg);
       border: 1px solid var(--line);
       border-radius: 16px;
       box-shadow: 0 4px 24px var(--card-shadow);
       width: 100%;
       padding: 20px 16px 24px;
     }
     @media (max-width: 480px) {
       .card {
         padding: 16px 12px 20px;
       }
     }
     ```
- **Rationale:** Aligns the PVD tax calculator with the exact container geometry used by all other calculators. Eliminates the excessive 56px side margins (112px total), freeing 48px of additional usable screen width on mobile viewports for 2-column input grids and results tables. Also removes vertical centering (`min-height: 100vh; display: flex; align-items: center;`) which caused awkward positioning within iframe hosts.

##### Step 3: Update `tests/smoke.test.mjs`
- **File:** `tests/smoke.test.mjs`
- **Action:**
  - Add two test cases to `describe('Document & Core HTML Page Architecture')`:
    1. `it('verifies dashboard.html declares responsive menu wrapping for h1, .panel-title, and #lbl-dossier-panel-title')`:
       - Asserts that `dashboard.html` defines `@media (max-width: 640px)`.
       - Asserts that `.panel-title` includes `flex-wrap: wrap`.
       - Asserts that `h1` includes `flex-wrap: wrap`.
       - Asserts that `#lbl-dossier-panel-title` includes `flex-direction: column` and `flex: 1 1 auto` on action buttons in mobile viewports.
    2. `it('verifies tax-calculator.html aligns container margins with remaining-money standard')`:
       - Asserts that `tax-calculator.html`'s `body` declares `padding: 26px 16px 70px; max-width: 520px; margin-inline: auto;`.
       - Asserts that `.card` declares `padding: 20px 16px 24px;`.
       - Asserts that legacy `padding: 24px` on body and `padding: 28px 32px 32px` on `.card` are no longer present.
- **Rationale:** Establishes permanent automated regression checks for mobile responsive menu wrapping and margin alignment.

---

#### 4. Acceptance Criteria
- [x] `dashboard.html` contains `@media (max-width: 640px)` with flex-wrap rules for `h1` and `.panel-title`.
- [x] On viewports <= 640px, `#lbl-dossier-panel-title` stacks vertically (`flex-direction: column; align-items: stretch;`).
- [x] All 3 action buttons (`btnTogglePrivacyMask`, `btnPrintDossier`, `btnShareDossier`) have `flex: 1 1 auto` under `@media (max-width: 640px)` and fit inside a 375px mobile viewport without horizontal clipping.
- [x] `tax-calculator.html` `body` padding is updated to `26px 16px 70px; max-width: 520px; margin-inline: auto;` matching `remaining-money.html`.
- [x] `tax-calculator.html` `.card` padding is updated to `20px 16px 24px` (with `16px 12px 20px` at `<= 480px`).
- [x] Legacy 56px margins (`body { padding: 24px; }` and `.card { padding: 28px 32px 32px; }`) in `tax-calculator.html` are completely removed.
- [x] `tests/smoke.test.mjs` executes cleanly with the new responsive and margin alignment assertions.
- [x] `npm test` passes 100% of tests (all 633 tests passing).
- [x] `npm run lint` passes with 0 errors across `js/`, `scripts/`, `tests/`.

---

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:**
  - Working tree status checked: clean.
  - Baseline tests: 631/631 passing.
  - Linting: 68/68 files clean.
- **Verification Commands:**
  ```bash
  # 1. Smoke test verification
  node --test tests/smoke.test.mjs

  # 2. Complete test suite
  npm test

  # 3. Biome linting verification
  npm run lint
  ```
- **Circuit Breaker:** Max 2 feedback loops between Coder, QA, and Reviewer. If mobile layout issues arise, verify exact CSS specificity and test against 320px, 360px, and 375px viewports.

---

### Code & Security Review Scorecard

**Verdict:** APPROVED

#### Summary of Findings:
- Comprehensive adversarial review of Phase 114 successfully completed.
- Verified 100% offline-first compliance, zero external runtime dependencies, zero telemetry/analytics trackers, and robust CSP compliance (ADR-001/002/003 invariants).
- Live CDP headless Chrome verification confirmed responsive mobile layout at 640px, 375px, and 320px: zero horizontal scroll overflow, all 3 dossier action buttons remain fully visible and wrap seamlessly without clipping.
- `tax-calculator.html` padding is perfectly standardized with `remaining-money.html` (recovering 48px of usable horizontal screen space) with all inputs, tabs, and calculations fully functional.
- Zero lint issues (`biome check`: 68 files passed clean), 633 unit/integration tests passing (100%), and 5/5 Playwright E2E browser journeys passing.

#### Blockers (Must Fix):
None.

#### Notes & Observations:
- In `dashboard.html`, the fallback button selector `#lbl-dossier-panel-title .action-btn` ensures backward compatibility with print styles (`.no-print` suppresses the action group cleanly in print media).

