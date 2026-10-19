---
task_id: "SDLC-PHASE-110-PWA-MANIFEST-AUDIT"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Phase 110 - Web App Manifest & Lighthouse PWA 100 Polish

#### 1. Goal & Scope Limits
- **Objective:** Upgrade Web App Manifest and App Shell to achieve 100% PWA installability and compliance with modern W3C PWA standards, including app shortcuts, rich screenshot descriptors (`wide`, `narrow`), PWA install banner handling (`beforeinstallprompt` / `appinstalled`), offline readiness badge, and automated verification tests.
- **Target Files (Sliced across 2 atomic slices):**
  - **Slice 1 (Manifest & Asset Layer - 5 files):**
    1. `manifest.json`
    2. `screenshots/desktop.svg`
    3. `screenshots/mobile.svg`
    4. `sw.js`
    5. `js/i18n/th.js` & `js/i18n/en.js`
  - **Slice 2 (UI & Verification Layer - 4 files):**
    1. `index.html`
    2. `js/app-shell.js`
    3. `tests/pwa-manifest.test.mjs`
    4. `tests/smoke.test.mjs`
- **Explicit Out of Scope:**
  - No changes to financial calculation engines or formula logic in `js/engines/`.
  - No changes to existing Google Drive sync or P2P QR protocols.
  - No addition of external npm runtime dependencies (ADR-001 Zero-Build, Zero-Dependency invariant).

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `manifest.json`: Web App Manifest specification, OS shortcut entry points, rich install dialog previews.
  - `sw.js`: Precache asset manifest consistency (`ASSETS_TO_CACHE`).
  - `index.html` & `js/app-shell.js`: Shell topbar action controls, offline badge in privacy footer, install lifecycle listeners.
- **Relevant ADRs:**
  - `ADR-001`: Zero-Build Static PWA Architecture with 100% Client-Side Privacy.
  - `ADR-002`: Modular Multi-Tool Iframe App Shell Architecture.
  - `ADR-003`: Offline-First Assets and Zero External CDN Dependencies.
  - `ADR-005`: Automated Semantic Version Bumping & Service Worker Cache Invalidation.

#### 3. Step-by-Step Implementation Plan

##### Slice 1: Manifest, Screenshot Assets, Service Worker & Bilingual Invariants
1. **Enrich `manifest.json`:**
   - Add identity, orientation, and language attributes: `"id": "money-superapp"`, `"lang": "th-TH"`, `"dir": "ltr"`, `"orientation": "any"`.
   - Add 4 App Shortcuts pointing to major tools with matching icons:
     - Dashboard (`./index.html#dashboard`)
     - Remaining Money (`./index.html#remaining-money`)
     - Rebalance & DCA (`./index.html#rebalance`)
     - Income Tax (`./index.html#tax-calculator-base`)
   - Add Screenshot descriptors with `form_factor`:
     - Wide preview: `"src": "screenshots/desktop.svg"`, `"sizes": "1280x720"`, `"type": "image/svg+xml"`, `"form_factor": "wide"`.
     - Narrow preview: `"src": "screenshots/mobile.svg"`, `"sizes": "390x844"`, `"type": "image/svg+xml"`, `"form_factor": "narrow"`.
2. **Create SVG Screenshot Assets:**
   - Create `screenshots/desktop.svg` (1280x720 crisp vector preview of desktop dashboard & charts).
   - Create `screenshots/mobile.svg` (390x844 crisp vector preview of mobile layout & bottom nav).
3. **Update `sw.js` Precache List:**
   - Add `'./screenshots/desktop.svg'` and `'./screenshots/mobile.svg'` to `ASSETS_TO_CACHE`.
4. **Update Bilingual Dictionaries (`js/i18n/th.js` and `js/i18n/en.js`):**
   - Add matching translation keys for install button and offline readiness badge (`pwaInstallBtn`, `pwaInstallTitle`, `pwaOfflineReady`, `pwaOfflineMode`) to guarantee 100% symmetry.

##### Slice 2: UI Controls, App Shell Lifecycle & Verification Suites
1. **Update `index.html`:**
   - In `.topbar-actions`, add `#btn-pwa-install` button (hidden by default via `display: none;`).
   - In `.privacy-bar`, add `#pwaOfflineBadge` with status indicator dot and label `#lbl-pwa-offline-badge`.
   - Add CSS for `.btn-pwa-install`, `.pwa-offline-badge`, and `.pwa-status-dot`.
2. **Update `js/app-shell.js`:**
   - Add `beforeinstallprompt` event listener to capture event, prevent default, and unhide `#btn-pwa-install`.
   - Add `appinstalled` event listener to reset prompt and hide `#btn-pwa-install`.
   - Implement `installPwa()` triggering `deferredInstallPrompt.prompt()`.
   - Implement `updateNetworkStatus()` reacting to `online` / `offline` events and SW controller activation, updating `#pwaOfflineBadge`.
   - Update `translations.th`, `translations.en`, and `applyLang()` to update badge and button text/titles dynamically.
3. **Create `tests/pwa-manifest.test.mjs`:**
   - Verify `manifest.json` JSON validity, required fields (`id`, `name`, `short_name`, `start_url`, `scope`, `display`, `theme_color`, `background_color`, `lang`, `dir`, `orientation`).
   - Verify 4 shortcuts structure, hash URLs, and icon file existence.
   - Verify screenshot items (`wide`, `narrow`), dimension formats, and file disk existence.
   - Verify `sw.js` `ASSETS_TO_CACHE` includes manifest, icons, and screenshots.
   - Verify `index.html` and `js/app-shell.js` declare install event listeners, button ID, and offline badge ID.
4. **Update `tests/smoke.test.mjs`:**
   - Add assertions verifying manifest shortcuts, screenshots, install button, and offline indicator in shell.

#### 4. Acceptance Criteria
- [x] `manifest.json` contains `id: "money-superapp"`, `lang: "th-TH"`, `dir: "ltr"`, `orientation: "any"`, 4 shortcuts, and 2 screenshots (`wide` and `narrow`).
- [x] Screenshot SVG files exist on disk and are valid SVG vector drawings.
- [x] `sw.js` precaches screenshots without errors; all `ASSETS_TO_CACHE` paths exist on disk.
- [x] `#btn-pwa-install` is present in `index.html` (hidden by default) and shown upon `beforeinstallprompt`.
- [x] `#pwaOfflineBadge` is present in `index.html` and dynamically reflects online/offline status with TH/EN localization.
- [x] Dictionaries in `th.js`, `en.js`, and `app-shell.js` maintain 100% key symmetry and 0 untranslated Thai elements in EN mode.
- [x] `tests/pwa-manifest.test.mjs` passes with 100% assertions.
- [x] `npm test` passes all tests (591 tests, 0 failures).
- [x] `npm run lint` passes with 0 warnings/errors.

#### 5. Verification Strategy & Commands
- Unit & Invariant Testing: `npm test`
- Dedicated Manifest Test: `node --test tests/pwa-manifest.test.mjs`
- Linting: `npm run lint`
- Biome Formatting: `npm run format`
