---
task_id: "SDLC-PHASE-112-SW-CACHE-LIFECYCLE-QUOTA"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Phase 112 — Advanced Service Worker Cache Lifecycle & Storage Quota Management

#### 1. Goal & Scope Limits
- **Objective:**
  Implement offline-first Service Worker cache lifecycle management and client-side storage quota visibility for Money Superapp. Users can inspect local storage and cache consumption, view the active Service Worker version and asset count, trigger safe offline cache refreshes, and purge stale caches without risking personal financial data or violating client-side privacy.
- **Target Files (Vertical Slices <= 3 files each):**
  - **Slice 1 (SW Lifecycle & i18n Dictionaries):** `sw.js`, `js/i18n/th.js`, `js/i18n/en.js`
  - **Slice 2 (App Shell Controller & UI):** `index.html`, `js/app-shell.js`
  - **Slice 3 (Testing & Smoke Suite):** `tests/sw-cache-quota.test.mjs` (New), `tests/smoke.test.mjs`
- **Explicit Out of Scope:**
  - No remote server sync or telemetry (ADR-001 invariant).
  - No alteration of existing financial calculators, tax engines, or localStorage bridge mechanisms.
  - No external npm dependencies or bundlers (Vanilla ES6+ offline standard).
  - No deletion of the active cache or `money-superapp-shared-payload` Web Share Target cache.

---

#### 2. Architecture & Decision Alignment
- **Affected Components:**
  - `sw.js` (Offline Cache & PWA Service Worker): Add message dispatch for `GET_CACHE_STATUS`, `PURGE_STALE_CACHES`, and `REFRESH_CACHE`. Add error resilience during `activate` cache eviction.
  - `index.html` (App Shell): Add Storage & Cache Quota card to `#settingsModal`.
  - `js/app-shell.js` (App Shell Controller): Implement `updateStorageQuotaDisplay()`, `refreshAppCache()`, `purgeStaleCaches()`, `formatStorageBytes()`, and bilingual binding in `applyLang()`.
  - `js/i18n/th.js` & `js/i18n/en.js`: Centralized bilingual dictionaries preserving 100% key symmetry.
  - `tests/`: Automated unit and integration test coverage.
- **Relevant ADRs:**
  - **ADR-001 (Zero-Build Static PWA & 100% Client-Side Privacy):** Storage estimation and cache management must execute 100% on-device using native `navigator.storage.estimate()` and `Cache` API.
  - **ADR-003 (Tailwind-Lite CSS & Offline Independence):** Reuse existing CSS custom properties and theme tokens without external CDN styles.
  - **ADR-005 (Automated Semantic Version Bumping & SW Invalidation):** Seamlessly align with `scripts/bump.mjs` versioning conventions (`money-superapp-vX.Y.Z`).

---

#### 3. Step-by-Step Implementation Plan

##### Slice 1: Service Worker Message Handlers & Bilingual Dictionaries
1. **Enhance Activation Resilience (`sw.js`)**:
   - In `self.addEventListener('activate')`, wrap each `caches.delete(key)` in a resilient try/catch / `.catch(() => false)` handler so any filesystem or cache lock failure does not abort activation or prevent `self.clients.claim()`.
   - Preserve `CACHE_NAME` and `'money-superapp-shared-payload'`.
2. **Add Service Worker Message Handlers (`sw.js`)**:
   - Add listener logic inside `self.addEventListener('message')` to support:
     - `GET_CACHE_STATUS`: Responds with `{ type: 'CACHE_STATUS_RESPONSE', cacheName: CACHE_NAME, version, assetCount, allCaches, staleCaches, timestamp }`.
     - `PURGE_STALE_CACHES`: Deletes all caches except `CACHE_NAME` and `'money-superapp-shared-payload'`. Responds with `{ type: 'PURGE_STALE_CACHES_RESPONSE', success: true, purgedCaches, activeCache: CACHE_NAME }`.
     - `REFRESH_CACHE`: Iterates through `ASSETS_TO_CACHE` using `fetch(url, { cache: 'reload' })` and updates `CACHE_NAME`. Responds with `{ type: 'REFRESH_CACHE_RESPONSE', success: true, updatedCount, totalAssets }`.
   - Reply via `event.ports[0].postMessage(...)` (if `MessageChannel` port is supplied) with fallback to `event.source.postMessage(...)`.
3. **Register Bilingual Dictionary Keys (`js/i18n/th.js` & `js/i18n/en.js`)**:
   - Add symmetric keys to both dictionaries:
     - `cacheQuotaTitle`: TH "โควต้าพื้นที่และแคชออฟไลน์ (Storage & Cache Quota)" / EN "Storage Quota & Offline Cache"
     - `cacheQuotaDesc`: TH "ตรวจสอบขนาดพื้นที่จัดเก็บในอุปกรณ์และสถานะแคชออฟไลน์ของระบบ" / EN "Monitor device storage quota usage and offline cache health"
     - `cacheVersionLabel`: TH "เวอร์ชันแคชที่ใช้งาน:" / EN "Active Cache Version:"
     - `cacheUsageLabel`: TH "พื้นที่ใช้งาน / โควต้าทั้งหมด:" / EN "Used Storage / Total Quota:"
     - `btnRefreshCache`: TH "🔄 อัปเดตแคช" / EN "🔄 Refresh Cache"
     - `btnPurgeStale`: TH "🧹 ล้างแคชเก่า" / EN "🧹 Purge Stale Caches"
     - `cacheStatusReady`: TH "พร้อมใช้งานออฟไลน์สมบูรณ์" / EN "Offline cache ready"
     - `cacheRefreshing`: TH "กำลังอัปเดตไฟล์แคช..." / EN "Refreshing cache assets..."
     - `cacheRefreshed`: TH "อัปเดตแคชออฟไลน์เรียบร้อยแล้ว" / EN "Offline cache refreshed successfully"
     - `cachePurged`: TH "ล้างแคชเก่าที่ตกค้างเรียบร้อยแล้ว" / EN "Stale caches purged successfully"
   - Validate 100% key symmetry with `tests/i18n-dictionaries.test.mjs`.

##### Slice 2: Storage Quota UI & App Shell Controller
4. **Add Storage & Cache Quota Card in `#settingsModal` (`index.html`)**:
   - Insert dedicated section before the Reset section in `#settingsModal`.
   - Elements:
     - Header with title (`lbl-cache-quota-title`), description (`lbl-cache-quota-desc`), Refresh button (`btn-refresh-cache`), and Purge Stale button (`btn-purge-stale`).
     - Active Cache Version readout: `#cache-version-badge`.
     - Storage Quota Readout (`#lbl-cache-quota-readout`) and animated progress bar (`#cache-quota-bar`).
     - Status readout line (`#lbl-cache-status-text`) and stale cache counter badge (`#cache-stale-badge`).
5. **Implement Storage & Cache Controller (`js/app-shell.js`)**:
   - Add helper `formatStorageBytes(bytes)`: Formats numbers into B, KB, MB, GB with boundary precision and graceful fallback on non-numbers/negatives.
   - Add `updateStorageQuotaDisplay()`:
     - Invokes `navigator.storage?.estimate()`. Computes `usage`, `quota`, and `percentUsed`.
     - Updates `#cache-quota-bar` style width and `#lbl-cache-quota-readout`.
     - Sends `GET_CACHE_STATUS` to Service Worker controller via `MessageChannel` (with fallback to `window.caches` direct access).
     - Updates `#cache-version-badge` and `#cache-stale-badge`.
     - Returns Promise resolving to quota status details.
   - Add `refreshAppCache()`:
     - Sets loading state in `#lbl-cache-status-text`.
     - Calls SW `REFRESH_CACHE` (or falls back to `caches.open()`) and `registration.update()`.
     - Re-invokes `updateStorageQuotaDisplay()` and alerts user of completion.
   - Add `purgeStaleCaches()`:
     - Sends `PURGE_STALE_CACHES` to SW or deletes stale caches directly via `caches.delete`.
     - Re-invokes `updateStorageQuotaDisplay()` and alerts user of purged cache count.
   - Update `openSettingsModal()` to invoke `updateStorageQuotaDisplay()`.
   - Update `applyLang()`: Wire new dictionary keys to DOM elements and copy keys into `translations.th` and `translations.en`.
   - Expose `formatStorageBytes`, `updateStorageQuotaDisplay`, `refreshAppCache`, and `purgeStaleCaches` on `window.MoneyApp` and `window`.

##### Slice 3: Automated Test Suite & Smoke Verification
6. **Author Test Suite (`tests/sw-cache-quota.test.mjs`)**:
   - Test 1: Byte formatting logic (`formatStorageBytes` across 0 B, KB, MB, GB, invalid/null).
   - Test 2: `sw.js` static contract inspection (`CACHE_NAME`, message types, activation delete guard).
   - Test 3: `sw.js` message execution simulation in Node VM with mock Cache API (verifying `GET_CACHE_STATUS` response contract and `PURGE_STALE_CACHES` preserving active cache + share payload).
   - Test 4: App Shell DOM structure and bilingual attributes in `index.html`.
   - Test 5: Bilingual symmetry between `th.js` and `en.js` for all cache quota keys.
   - Test 6: App Shell controller API exports and functions in `js/app-shell.js`.
7. **Update Smoke Assertions (`tests/smoke.test.mjs`)**:
   - Add Phase 112 validation block verifying test suite disk existence, Service Worker contracts, and App Shell integration.
8. **Execute Full Test & Lint Verification**:
   - Run `npm test` (all tests passing).
   - Run `npm run lint` (Biome clean, zero errors).

---

#### 4. Acceptance Criteria
- [x] `sw.js` activation handles cache deletion errors gracefully and preserves `CACHE_NAME` and `money-superapp-shared-payload`.
- [x] `sw.js` handles `GET_CACHE_STATUS`, `PURGE_STALE_CACHES`, and `REFRESH_CACHE` message types returning structured response contracts.
- [x] `index.html` displays the Storage & Cache Quota card inside `#settingsModal` with progress bar, readout, active version badge, and action buttons.
- [x] `js/app-shell.js` implements `updateStorageQuotaDisplay()`, `refreshAppCache()`, `purgeStaleCaches()`, and `formatStorageBytes()`.
- [x] `js/i18n/th.js` and `js/i18n/en.js` contain all quota keys with 100% symmetry verified by `tests/i18n-dictionaries.test.mjs`.
- [x] `applyLang()` updates all cache quota UI labels dynamically when switching TH/EN.
- [x] `tests/sw-cache-quota.test.mjs` runs in `npm test` and passes 100%.
- [x] `tests/smoke.test.mjs` validates Phase 112 components.
- [x] `npm run lint` passes without formatting or syntax errors.

---

#### 5. Verification Strategy
- **Automated Tests:**
  ```bash
  # Run full automated test suite
  npm test

  # Run specific Phase 112 test suite
  node --test tests/sw-cache-quota.test.mjs

  # Verify i18n symmetry
  node --test tests/i18n-dictionaries.test.mjs

  # Code quality and formatting
  npm run lint
  ```
- **Circuit Breaker Guardrails:**
  - Maximum 2 feedback loops between Coder and QA. If any contract fails, halt and inspect root cause.
  - Zero external npm packages installed.
  - Invariant protection: Active cache `CACHE_NAME` and `money-superapp-shared-payload` must never be purged.
