---
task_id: "SDLC-PHASE-113-E2E-BROWSER-JOURNEYS"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Phase 113 - End-to-End Multi-Journey Browser Flow Test Suite

#### 1. Goal & Scope Limits
- **Objective:** Establish an automated, zero-dependency end-to-end (E2E) browser journey test suite using native Node.js HTTP server and Chrome DevTools Protocol (CDP) WebSocket driver, verifying 5 critical user workflows across the App Shell and iframe calculators.
- **Target Files (<= 5 files):**
  1. `tests/e2e-browser-journeys.test.mjs` (New file — CDP driver and 5 complete E2E journeys)
  2. `package.json` (Update — add `"test:e2e"` script for direct journey test execution)
  3. `tests/smoke.test.mjs` (Update — assert presence and contracts of Phase 113 test suite)
  4. `.ai/memory/active.md` (Update — state bus tracking)
- **Explicit Out of Scope:**
  - Zero external NPM runtime or testing dependencies (No Playwright, Puppeteer, Cypress, Selenium) adhering to ADR-001.
  - No alteration of financial calculation formulas or business logic in `js/engines/` or calculator tools.
  - No modifications to CSS design tokens or shared styling (`css/tailwind-lite.css`, `css/theme.css`).

---

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - App Shell Host (`index.html`, `js/app-shell.js`): Top and bottom navigation bars, iframe routing container (`#appFrame`), hash change listener, theme/language toggles, settings/backup modal, and storage diagnostics.
  - Calculator Iframe Pages (`remaining-money.html`, `rebalance.html`, `tax-calculator-base.html`, `dashboard.html`): Cross-frame postMessage listeners, ephemeral bridge consumer hooks (`checkPendingBudget()`), and isolated localStorage keys.
  - Shared Infrastructure (`js/shared.js`, `js/engines/bridge.js`): Theme/language DOM initialization and Bridge protocol envelopes.
- **Relevant ADRs:**
  - **ADR-001 (Zero NPM Runtime Dependencies):** E2E test harness leverages built-in Node.js `child_process.spawn`, `node:http`, and native `WebSocket` (Node 22+).
  - **ADR-002 (100% Client-Side Privacy):** All tests execute against an isolated local ephemeral HTTP server and disposable Chrome profile; zero external telemetry or cloud communication.
  - **ADR-005 (Decoupled State & Ephemeral Bridge Architecture):** Verification of consume-once semantics for cross-tool data hand-offs via `moneySuperapp.pendingBudget`.
  - **ADR-006 (Headless Chrome CDP WebSocket Driver):** Standardized CDP harness pattern established in `tests/bilingual-parity.test.mjs`.

---

#### 3. Step-by-Step Implementation Plan

##### Step 1: Create `tests/e2e-browser-journeys.test.mjs`
- **Action:**
  - Implement a self-contained test file importing `node:test`, `node:assert/strict`, `node:child_process`, `node:http`, `node:fs`, and `node:path`.
  - Implement modular CDP helper routines:
    1. `resolveChromeBinary()`: Checks `google-chrome`, `chromium`, `chromium-browser` via `which`. Returns binary path or null with graceful test skip if unavailable.
    2. `startStaticServer(rootDir)`: Creates Node.js HTTP server on port 0 (dynamic port) serving static assets with proper MIME types (`.html`, `.js`, `.css`, `.svg`, `.json`).
    3. `launchHeadlessChrome(chromeBin, serverPort)`: Spawns Chrome with `--headless=new`, `--no-sandbox`, `--disable-gpu`, `--disable-dev-shm-usage`, `--remote-debugging-port=<random>`, and `--user-data-dir=/tmp/chrome-e2e-<timestamp>`.
    4. `connectCdp(cdpPort)`: Queries `http://127.0.0.1:${cdpPort}/json/list`, acquires `webSocketDebuggerUrl`, and establishes native `WebSocket` connection with request/response correlation (`msgId`).
    5. `sendCdp(method, params)`: Sends CDP command and returns Promise resolving to result or rejecting on error.
    6. Teardown hook in `after()`: Closes WebSocket connection, kills Chrome process tree (`SIGKILL`), cleans up temp directory, and shuts down HTTP server.
  - Implement the 5 distinct Journey test suites:
    - **Journey 1: Tab Navigation & Iframe URL Hash Synchronization:**
      - Navigate to `index.html`.
      - Test clicking `#nav-remaining` / `button[data-tab="remaining-money"]`: verify URL hash updates to `#remaining-money`, `#appFrame` src updates to `remaining-money.html?v=...`, and active class reflects selection.
      - Test direct URL hash navigation: set `location.hash = '#tax-calculator-base'`, dispatch hashchange, verify `#appFrame` src switches to `tax-calculator-base.html?v=...`.
      - Test global shortcut / programmatic tab switch: evaluate `window.switchToTab('rebalance')`, verify hash updates to `#rebalance` and `#appFrame` updates accordingly.
    - **Journey 2: Theme and Language Reload Persistence:**
      - Test initial state.
      - Click `button[data-lang="en"]`: verify `document.documentElement.lang === 'en'`, `localStorage.getItem('moneySuperapp.lang') === 'en'`, and `.active` class on EN button.
      - Click `#btn-theme-dark` / `button[data-theme-btn="dark"]`: verify `document.documentElement.dataset.theme === 'dark'`, `localStorage.getItem('moneySuperapp.theme') === 'dark'`, and `.active` class on dark button.
      - Trigger page reload (`location.reload()`) and wait for DOM readiness.
      - Verify that after full reload, `document.documentElement.lang` remains `'en'`, `document.documentElement.dataset.theme` remains `'dark'`, and UI buttons retain active styling.
      - Toggle back to 'th' / 'light' and verify symmetric persistence.
    - **Journey 3: Cross-Tool Bridge Protocol End-to-End Hand-off:**
      - Navigate to `index.html#remaining-money`.
      - Simulate positive disposable cash flow in `remaining-money.html` and trigger `sendToRebalance()`.
      - Verify `localStorage.getItem('moneySuperapp.pendingBudget')` is populated with the surplus amount.
      - Verify App Shell responds to child `switchToTab` event and transitions `#appFrame` to `rebalance.html`.
      - Wait for `rebalance.html` initialization and verify `checkPendingBudget()` execution:
        - `state.totalBudget` and `#totalBudget` input field reflect the transferred amount.
        - `moneySuperapp.pendingBudget` is purged from `localStorage` (consume-once guarantee).
        - `#pendingBudgetAlert` banner is visible with confirmation message.
    - **Journey 4: JSON Backup Export, Master Reset & Restore Round-Trip:**
      - Navigate to `index.html`.
      - Seed known test keys in `localStorage`:
        - `moneySuperapp.activeTab = 'dashboard'`
        - `moneySuperapp.testUserData = JSON.stringify({ salary: 85000, profile: 'senior' })`
        - `remainingMoneyCalculator.budget = JSON.stringify({ income: 85000, fixed: 25000 })`
        - `rebalanceCalculator.portfolio = JSON.stringify([{ asset: 'VOO', ratio: 70 }])`
      - Invoke `exportBackupData()` and verify exported JSON object conforms to Money Superapp backup schema (`appName`, `version`, `exportedAt`, `data`).
      - Invoke `resetAllData()` with stubbed dialog confirmation (`window.confirm = () => true`, `window.alert = () => {}`).
      - Verify all calculator state keys starting with `moneySuperapp.`, `remainingMoneyCalculator.`, `rebalanceCalculator.` are purged.
      - Restore data from the backup payload (simulating `handleImportFile` / restoration parser).
      - Verify 100% of the seeded keys are restored into `localStorage` with matching contents.
    - **Journey 5: Settings Modal Storage Diagnostics & Cache Controls:**
      - Navigate to `index.html`.
      - Click `#btn-settings-modal` to open settings modal.
      - Verify `#settingsModal` becomes visible (`style.display !== 'none'`).
      - Verify `#cache-version-badge` is populated with current semantic version.
      - Verify `#lbl-cache-quota-readout` displays formatted storage metrics.
      - Verify `#cache-quota-bar` has a computed width.
      - Verify `#btn-refresh-cache` and `#btn-purge-stale` are active and responsive.
      - Click `#btn-close-settings` and verify `#settingsModal` closes (`style.display === 'none'`).
- **Rationale:** Proves live browser DOM integration, cross-frame boundaries, storage reactivity, and user journeys without third-party frameworks.

##### Step 2: Update `package.json`
- **Action:**
  - Add `"test:e2e": "node --test tests/e2e-browser-journeys.test.mjs"` to `scripts`.
- **Rationale:** Enables direct targeted execution for developers and CI pipelines while preserving `"test": "node --test tests/**/*.test.mjs"` glob discovery.

##### Step 3: Update `tests/smoke.test.mjs`
- **Action:**
  - Append a new verification block: `verifies Phase 113 End-to-End Multi-Journey Browser Flow Test Suite presence and contracts`.
  - Assert that `tests/e2e-browser-journeys.test.mjs` exists.
  - Assert that `package.json` declares `"test:e2e"`.
  - Assert that `tests/e2e-browser-journeys.test.mjs` declares all 5 journeys:
    1. Tab Navigation & Iframe URL Hash Sync
    2. Theme and Language Reload Persistence
    3. Cross-Tool Bridge Protocol End-to-End Hand-off
    4. JSON Backup Export, Master Reset & Restore Round-Trip
    5. Settings Modal Storage Diagnostics & Cache Controls
- **Rationale:** Maintains our zero-regression smoke invariant and guarantees structural test file integrity.

---

#### 4. Acceptance Criteria
- [x] `tests/e2e-browser-journeys.test.mjs` executes cleanly with Node.js native test runner (`node --test tests/e2e-browser-journeys.test.mjs`).
- [x] Headless Chrome CDP WebSocket driver launches and tears down cleanly without orphaned processes or leaked ports.
- [x] Gracefully skips when Chrome/Chromium binary is not available.
- [x] Journey 1 passes: Tab navigation correctly switches `#appFrame` src and synchronizes URL hash (`#dashboard`, `#remaining-money`, `#rebalance`, `#tax-calculator-base`).
- [x] Journey 2 passes: Theme (dark/light) and language (th/en) toggles persist across full browser reload.
- [x] Journey 3 passes: Cross-tool budget bridge from Remaining Money smoothly transfers data to Rebalance, updates input value, clears pending key, and shows notification alert.
- [x] Journey 4 passes: Exported JSON backup captures all calculator keys, master reset wipes them cleanly, and restore reconstitutes the exact state.
- [x] Journey 5 passes: Settings modal correctly opens, displays storage quota & version diagnostics, handles cache controls, and closes cleanly.
- [x] Smoke test suite in `tests/smoke.test.mjs` validates Phase 113 presence and contracts.
- [x] `npm test` passes 100% of tests (all existing 625+ unit/integration tests + new E2E suite).
- [x] `npm run lint` passes with 0 errors across `js/`, `scripts/`, `tests/`.

---

#### 5. Verification Strategy & Guardrails
- **Pre-flight Check:**
  - Working tree status checked: clean.
  - Baseline tests: 625/625 passing.
  - Linting: 67/67 files clean.
- **Verification Commands:**
  ```bash
  # 1. Targeted E2E test verification
  npm run test:e2e

  # 2. Smoke test verification
  node --test tests/smoke.test.mjs

  # 3. Complete regression suite
  npm test

  # 4. Biome linting verification
  npm run lint
  ```
- **Circuit Breaker:** Max 2 feedback loops between Coder, QA, and Reviewer. If CDP connection or timing issues arise, review timeout parameters and DOM readyState waiting logic before escalating.
