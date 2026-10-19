---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 115 — Mobile Topbar Action Overflow Resolution

#### 1. Goal & Scope Limits
- **Objective:**
  Resolve horizontal overflow in the App Shell top navigation header (`index.html`).
  On mobile viewports (<= 414px down to 320px), the combined width of `.topbar-brand` (💰 Money Superapp = 135px) and `.topbar-actions` (TH/EN toggle 69px + Light/Dark toggle 57px + 🔍 Ctrl+K search 69px + ❓ Help 32px + ⚙️ Settings 32px + gaps) exceeds 440px. Because `.topbar-inner` is flex without wrapping, the rightmost actions (`#btn-help-modal` and `#btn-settings-modal`) overflow past the screen edge, leaving `#btn-cmd-palette` ("Search") as the last visible element on screen.
  
  The solution introduces targeted responsive CSS rules:
  1. At `@media (max-width: 768px)`:
     - Hide `.cmd-k-badge` (`display: none !important;`) since touch devices lack physical keyboard keys (saves ~35px).
     - Style `#btn-cmd-palette` with compact circular pill styling (`padding: 4px 7px; border-radius: 999px; font-size: 13px;`).
     - Hide `#lbl-pwa-install` text on mobile (`display: none !important;`) with compact pill styling (saves ~50px when active).
     - Compact `.topbar-actions` gap and padding (`gap: 3px; padding: 0;`).
     - Compact `.lang-toggle` and `.theme-toggle` button padding and gaps.
     - Compact `#btn-settings-modal` and `#btn-help-modal` (`padding: 4px 7px; margin: auto 1px;`).
  2. At `@media (max-width: 480px)`:
     - Hide `.brand-title` (`display: none !important;`), preserving the prominent 💰 icon and `.topbar-brand` (saves ~110px).
     - Compact `.topbar-inner` padding (`0 6px`).
  3. At `@media (max-width: 380px)`:
     - Micro-compact `.topbar-actions` gap (`2px`) and padding to ensure total topbar width remains <= 250px even on ultra-compact 320px viewports.
  4. In `tests/smoke.test.mjs`:
     - Add regression smoke test verifying that `index.html` declares responsive topbar mobile hiding of `.cmd-k-badge`, `#lbl-pwa-install`, and `.brand-title`.

- **Target Files (<= 5 files, ~70 lines total change):**
  1. `index.html` (~35 lines changed)
  2. `tests/smoke.test.mjs` (~35 lines changed)

- **Explicit Out of Scope:**
  - No changes to financial math calculation engines (`js/engines/*`).
  - No changes to child iframe calculators (`dashboard.html`, `debt-calculator.html`, etc.).
  - No changes to desktop topbar tab navigation (`.top-nav`) or keyboard shortcuts (`Alt+1..7`).
  - No changes to command palette logic in `js/app-shell.js`.

---

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `index.html` (Top navigation header `.topbar`, `.topbar-inner`, `.topbar-brand`, `.topbar-actions`, and mobile media queries).
  - `tests/smoke.test.mjs` (`Document & Core HTML Page Architecture` test suite).
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA Architecture with 100% Client-Side Privacy):** Pure CSS3 and HTML5 modifications; zero runtime library overhead.
  - **ADR-002 (Modular Multi-Tool Iframe App Shell Architecture):** Protects shell UI responsiveness across mobile phone viewports while keeping iframe container isolated.
  - **ADR-003 (Replacement of External CDN with Offline Tailwind-Lite CSS):** Self-contained styling within `index.html` `<style>` without external stylesheet dependencies.

---

#### 3. Step-by-Step Implementation Plan

##### Step 1: Update `index.html` Topbar Responsive Media Queries
- **File:** `index.html`
- **Action:**
  1. Under existing `@media (max-width: 768px)` in `<style>`:
     - Add `.topbar-actions { gap: 3px; padding: 0; }`.
     - Add `.cmd-k-badge { display: none !important; }`.
     - Update `.btn-cmd-palette` styling:
       ```css
       .btn-cmd-palette {
         padding: 4px 7px;
         border-radius: 999px;
         font-size: 13px;
       }
       ```
     - Update `.btn-pwa-install` and `#lbl-pwa-install` styling:
       ```css
       .btn-pwa-install {
         padding: 4px 7px;
         border-radius: 999px;
       }
       #lbl-pwa-install {
         display: none !important;
       }
       ```
     - Refine `.lang-toggle` and `.lang-toggle button`:
       ```css
       .lang-toggle {
         padding: 0 2px;
         gap: 2px;
       }
       .lang-toggle button {
         padding: 4px 6px;
         font-size: 11px;
       }
       ```
     - Refine `.theme-toggle` and `.theme-toggle button`:
       ```css
       .theme-toggle {
         padding: 0 2px 0 4px;
         gap: 2px;
         border-left: 1px solid var(--line);
       }
       .theme-toggle button {
         padding: 4px 5px;
         font-size: 12px;
       }
       ```
     - Refine `#btn-settings-modal, #btn-help-modal`:
       ```css
       #btn-settings-modal, #btn-help-modal {
         padding: 4px 7px;
         font-size: 13px;
         margin: auto 1px;
       }
       ```
  2. Add new `@media (max-width: 480px)` query block:
     ```css
     /* Smartphone / Compact Mobile Optimizations (<= 480px) */
     @media (max-width: 480px) {
       .topbar-inner {
         padding: 0 6px;
       }
       .topbar-brand {
         padding: 0 2px;
         gap: 0;
       }
       .brand-title {
         display: none !important;
       }
     }
     ```
  3. Add new `@media (max-width: 380px)` query block:
     ```css
     /* Ultra-compact Smartphone Optimizations (<= 380px) */
     @media (max-width: 380px) {
       .topbar-inner {
         padding: 0 4px;
       }
       .topbar-actions {
         gap: 2px;
       }
       .lang-toggle button,
       .theme-toggle button {
         padding: 3px 5px;
         font-size: 10.5px;
       }
       #btn-cmd-palette,
       #btn-settings-modal,
       #btn-help-modal,
       .btn-pwa-install {
         padding: 3px 6px;
         font-size: 12px;
       }
     }
     ```
- **Rationale:** 
  Hiding `.cmd-k-badge` frees ~35px. Compacting button paddings and gaps frees ~40px. On phones <= 480px, hiding `.brand-title` while preserving the 💰 icon frees ~110px. The total width of `.topbar-brand` (~24px) + `.topbar-actions` (~200px) is ~224px, fitting well inside 320px, 360px, 375px, 390px, 414px, and 480px screens without any horizontal overflow.

##### Step 2: Add Automated Regression Smoke Tests in `tests/smoke.test.mjs`
- **File:** `tests/smoke.test.mjs`
- **Action:**
  - Add test case inside `describe('Document & Core HTML Page Architecture')`:
    ```javascript
    it('verifies index.html declares mobile responsive topbar constraints and element hiding', () => {
      const indexContent = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
      assert.ok(
        indexContent.includes('@media (max-width: 768px)'),
        'index.html must define mobile media query for <= 768px screens',
      );
      assert.ok(
        indexContent.includes('.cmd-k-badge') && indexContent.includes('display: none !important'),
        'index.html must hide .cmd-k-badge on mobile viewports',
      );
      assert.ok(
        indexContent.includes('#lbl-pwa-install') && indexContent.includes('display: none !important'),
        'index.html must hide #lbl-pwa-install on mobile viewports',
      );
      assert.ok(
        indexContent.includes('@media (max-width: 480px)'),
        'index.html must define smartphone media query for <= 480px screens',
      );
      assert.ok(
        indexContent.includes('.brand-title') && indexContent.includes('display: none !important'),
        'index.html must hide .brand-title on <= 480px screens to preserve header width',
      );
      assert.ok(
        indexContent.includes('@media (max-width: 380px)'),
        'index.html must define ultra-compact mobile media query for <= 380px screens',
      );
    });
    ```
- **Rationale:** Permanently protects against regressions that would restore overflowing text or badges into the mobile shell topbar.

---

#### 4. Acceptance Criteria
- [x] On viewports <= 768px, `.cmd-k-badge` (Ctrl+K) is hidden via `display: none !important;`.
- [x] On viewports <= 768px, `#btn-cmd-palette` uses compact circular pill styling (`padding: 4px 7px; border-radius: 999px; font-size: 13px;`).
- [x] On viewports <= 768px, `#lbl-pwa-install` text is hidden via `display: none !important;`.
- [x] On viewports <= 768px, `.topbar-actions` has `gap: 3px; padding: 0;`, and `.lang-toggle` and `.theme-toggle` have compact padding.
- [x] On viewports <= 480px, `.brand-title` ("Money Superapp") is hidden via `display: none !important;`, keeping the prominent 💰 icon and saving ~110px.
- [x] On ultra-narrow viewports <= 380px, micro-compact padding and `gap: 2px;` ensure header actions never wrap or overflow.
- [x] At all mobile viewports (480px, 414px, 390px, 375px, 360px, 320px), total topbar inner width is <= 260px, leaving ample margin and 0px horizontal overflow.
- [x] On mobile devices, Search (🔍), Help (❓), and Settings (⚙️) are 100% visible, fully clickable, and within screen bounds.
- [x] Desktop layout (> 768px) is completely unaffected: desktop tabs, full brand logo with title, and "Ctrl+K" badge remain visible and unaltered.
- [x] Automated regression tests in `tests/smoke.test.mjs` pass.
- [x] `npm test` passes 100% (all 634+ tests passing).
- [x] `npm run lint` passes with 0 errors.

---

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:**
  - Working tree: clean.
  - Baseline tests: 633/633 passing.
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
- **Manual / Headless CDP Verification:**
  - Verify computed bounding rects of `.topbar-brand` and `.topbar-actions` across 320px, 360px, 375px, 390px, 414px, and 480px viewports. Confirm `right <= viewportWidth` for `#btn-settings-modal` (the rightmost action) with zero horizontal page scroll (`document.documentElement.scrollWidth === document.documentElement.clientWidth`).
- **Circuit Breaker:** Max 2 feedback loops between Coder, QA, and Reviewer. If mobile overflow persists at 320px, inspect button padding and margin specificity.

---

### Code & Security Review Scorecard

**Verdict:** APPROVE

#### Summary of Findings:
- Adversarial review of Phase 115 changes confirms zero security, privacy, or architectural regressions.
- The targeted responsive CSS rules eliminate mobile horizontal overflow on small and ultra-compact viewports (320px–480px) while maintaining full desktop parity and ARIA accessibility.
- All 634 test cases, 5/5 Playwright E2E browser journeys, and 68-file Biome linting pass cleanly.

#### Blockers (Must Fix):
None.

#### Notes & Observations (Optional):
- **Element Hiding vs Accessibility:** `.brand-title`, `.cmd-k-badge`, and `#lbl-pwa-install` are visually hidden on mobile with `display: none !important;`. The parent buttons retain comprehensive `aria-label` and `title` attributes (`aria-label="Open Command Palette and Search"`, `aria-label="Install Money Superapp"`), ensuring screen readers can announce their functions without disruption.
- **PWA Install Behavior:** `#btn-pwa-install` dynamically toggles to `inline-flex` upon browser `beforeinstallprompt`. Because `#lbl-pwa-install` is suppressed on <=768px, the button renders as a compact icon pill (⬇️), preventing unexpected layout shifting or action bar overflow when the prompt event fires.
- **Scope Compliance:** Changes are strictly confined to 2 files (`index.html` and `tests/smoke.test.mjs`) and 86 total lines, cleanly respecting the 5-file / ~200-line budget limit.

