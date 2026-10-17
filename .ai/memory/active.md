---
task_id: "FEAT-INDEXEDDB-STORAGE-01"
status: "pending_approval"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Portfolio Allocation Intensity Heatmap & Currency Exposure Matrix (Phase 22 / v2.0.5)
- **Status:** Completed & Verified (77 automated tests passing, 0 linter errors).
- **Summary:**
  1. Multi-segmented currency exposure bar and currency badges (THB, USD, EUR, GBP, JPY, SGD) with THB proportional totals and dominant currency metrics.
  2. Portfolio allocation intensity heatmap grid color-coded by deviation intensity (emerald for balanced within ±1%, blue for underweight DCA buy targets, amber for overweight).
  3. Strict XSS sanitization and full bilingual Thai/English localization.

---

### Proposed Feature Specification: Transparent IndexedDB Storage Adapter & High-Capacity Snapshot Archive (Phase 23 / Roadmap Item 4.3)

#### 1. Goal & Scope Limits
- **Objective:** Introduce a lightweight, zero-dependency `IndexedDB` storage bridge in [`js/shared.js`](file:///home/l2okii/Document/money-superapp/js/shared.js) and [`dashboard.html`](file:///home/l2okii/Document/money-superapp/dashboard.html) that transparently mirrors snapshots and high-volume calculator data, preventing localStorage 5MB quota exhaustion without breaking synchronous readers.
- **Key Capabilities & Benefits:**
  1. **Dual Storage Engine with Transparent Fallback:**
     - `IndexedDB` provides multi-gigabyte capacity for historical snapshots, multi-year net worth tracking, and backup archives.
     - Maintains synchronous fallback to `localStorage` for privacy mode / restricted sandboxes where IndexedDB is blocked.
  2. **Storage Quota & Archival Manager in Dashboard:**
     - Displays actual storage quota usage (using `navigator.storage.estimate()` when available) alongside existing localStorage diagnostics.
     - Provides an automated archive and seamless restore mechanism for snapshots older than 12 months.
  3. **Zero External Dependencies (ADR-001):**
     - Native browser `window.indexedDB` API with Promise-wrapped transaction helpers.
  4. **Bilingual Localization (TH/EN):**
     - Full translation in Thai and English for all diagnostic and archival dialogs.
- **Target Files (<= 5 files, ~150-180 lines total):**
  1. `js/shared.js` (IndexedDB Promise-based key-value storage adapter `idbStorage`)
  2. `dashboard.html` (Storage capacity inspection & archive management UI)
  3. `tests/financial-math.test.mjs` (unit tests verifying indexedDB storage adapter abstraction and fallback logic)
  4. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Breaking existing `localStorage` keys or data formats (backwards compatibility strictly preserved).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side privacy, fully offline-functional, zero third-party libraries.
- **Preserves Existing Storage:** All existing data in `localStorage` remains intact and immediately accessible.

#### 3. Step-by-Step Implementation Plan
1. **Mathematical & Abstraction Verification (`tests/financial-math.test.mjs`):**
   - Write tests for storage adapter interface, schema versioning, serialization, and quota calculation.
2. **IndexedDB Key-Value Adapter (`js/shared.js`):**
   - Implement lightweight Promise-based `initDB()`, `idbGet()`, `idbSet()`, and `idbKeys()`.
3. **Dashboard Archival & Capacity UI (`dashboard.html`):**
   - Integrate storage estimate metrics and archival controls in the storage health modal.
4. **Verification & Quality Gate:**
   - Execute `npm test` and `npm run lint`.
5. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.0.6` via `node scripts/bump.mjs patch`.
