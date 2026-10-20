---
task_id: "none"
status: "idle"
current_stage: "idle"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 129 — IndexedDB Tiered Storage Engine (`js/engines/storage-db.js`) (v2.5.70)

#### 1. Goal & Scope Limits
- **Objective:**
  Implement an enterprise-grade, asynchronous IndexedDB tiered storage engine (`js/engines/storage-db.js`) under `MoneyApp.Storage` with transparent fallback to `localStorage`:
  1. Break past the 5MB `localStorage` browser ceiling to support large multi-year bank statements, payslip archives, and snapshot histories without quota exhaustion.
  2. Implement unified asynchronous API: `getItem(key)`, `setItem(key, val)`, `removeItem(key)`, `clear()`, `keys()`, `hasItem(key)`.
  3. Tiered persistence & synchronous mirroring:
     - Critical UI preferences (`moneySuperapp.theme`, `moneySuperapp.lang`, `moneySuperapp.activeTab`) mirrored to `localStorage` for synchronous 0ms boot paint.
     - Large payloads, vaults, and document history stored in IndexedDB (`moneySuperapp_idb` / `keyvalue`).
  4. Migration & Bulk Utilities:
     - `migrateFromLocalStorage()`: automatically imports legacy `localStorage` keys into IndexedDB.
     - `exportAll()` and `importAll()`: backup, restore, and transfer utilities.
     - `estimate()`: storage quota telemetry via `navigator.storage.estimate()`.
  5. 100% offline-first, zero external libraries (ADR-001), works in all browsers and iframe contexts.
- **Target Files (<= 5 files, ~200 lines):**
  1. `js/engines/storage-db.js` (New core tiered storage engine)
  2. `sw.js` (Add `storage-db.js` to offline precache manifest)
  3. `index.html` (Include `<script src="js/engines/storage-db.js"></script>`)
  4. `js/shared.js` (Bind `MoneyApp.Storage` and expose across iframe contexts)
  5. `tests/storage-db.test.mjs` (Comprehensive unit & invariant test suite)
- **Explicit Out of Scope:**
  - No Dexie.js or third-party IDB wrappers (ADR-001).
  - No breaking changes to existing synchronous `localStorage.getItem` reads in legacy tools.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `js/engines/storage-db.js`, `sw.js`, `index.html`, `js/shared.js`, `tests/storage-db.test.mjs`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% offline-first client-side privacy)
  - ADR-002 (Modular engine architecture)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Create `js/engines/storage-db.js`:
  - Implement `createStorageDB(options)` and export as `MoneyApp.Storage` & `MoneyApp.StorageDB`.
  - Provide complete async CRUD: `getItem`, `setItem`, `removeItem`, `clear`, `keys`, `hasItem`.
  - Provide telemetry & migration: `estimate()`, `migrateFromLocalStorage()`, `exportAll()`, `importAll()`.
  - Provide transparent fallback to `localStorage` and memory when IDB is unavailable or blocked.
- **Step 2:** In `sw.js`:
  - Add `'./js/engines/storage-db.js'` to `PRECACHE_ASSETS`.
- **Step 3:** In `index.html`:
  - Add `<script src="js/engines/storage-db.js"></script>` before `js/engines/vault-crypto.js`.
- **Step 4:** In `js/shared.js`:
  - Wire `MoneyApp.Storage = global.MoneyApp?.Storage || ...` for iframe child windows.
- **Step 5:** Create `tests/storage-db.test.mjs` and add smoke tests in `tests/smoke.test.mjs`:
  - Test all CRUD methods with mock IDB and fallback localStorage.
  - Test quota estimation, batch export/import, and migration.
- **Step 6:** QA & Debugger verification (`npm run lint`, `npm test`).
- **Step 7:** Code & Security Reviewer adversarial audit.
- **Step 8:** Release & Docs (bump v2.5.70, update lessons.md, commit, push).

#### 4. Acceptance Criteria
- [x] `MoneyApp.Storage` provides `getItem`, `setItem`, `removeItem`, `clear`, `keys`, `hasItem`, `estimate`, `migrateFromLocalStorage`, `exportAll`, `importAll`.
- [x] Operates in IndexedDB with graceful fallback to `localStorage` and memory when IDB is unavailable.
- [x] Critical bootstrap keys (`theme`, `lang`, `activeTab`) are mirrored for 0ms sync boot.
- [x] Precached in `sw.js` and included in `index.html`.
- [x] All tests pass in `npm test` with 0 Biome linter errors/warnings.
- [x] Released, bumped to v2.5.70, and pushed to `origin/master`.
