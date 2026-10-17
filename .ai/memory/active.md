---
task_id: "FEAT-STORAGE-HEALTH-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Storage Health Check & Usage Inspector (Phase 12 Item 4.4)

#### 1. Goal & Scope Limits
- **Objective:** Provide users with transparency, diagnostics, and crash recovery for their offline financial data via a "Storage Health Check & Usage Inspector" in the Settings modal (`index.html`).
- **Features:**
  1. Inspects total `localStorage` footprint (KB and % of quota) used across all calculators.
  2. Diagnostic scanner checking JSON integrity and size per key across canonical app schemas.
  3. Safe one-click "Repair / Clean Malformed Keys" action that resets only corrupted entries to safe defaults while strictly preserving valid user records.
  4. Auto-diagnoses storage health every time the settings modal is opened.
- **Target Files (<= 5 files):**
  1. `index.html` (Storage Health section inside Settings modal `#settingsModal`, diagnostic functions, translations)
  2. `tests/financial-math.test.mjs` (Unit tests for storage schema verification, corruption detection, and repair)
  3. `.ai/memory/active.md`

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side inspection, no telemetry.
- **Safety Guarantee:** Repair only resets corrupted/unparseable keys; valid user entries are never overwritten.

#### 3. Verification & QA Status
- **Automated Tests:** 47/47 unit tests passing in `tests/financial-math.test.mjs` (~67ms).
- **Linter:** Biome check cleanly passed with 0 errors (`npm run lint`).
- **Security Audit:** Zero external runtime scripts; sanitization preserved; safe JSON handling preventing crashes.
