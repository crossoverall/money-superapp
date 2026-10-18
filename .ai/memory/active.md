---
task_id: "SDLC-PHASE-80-PWA-WEB-SHARE-TARGET-AND-NATIVE-SHARE-INTEGRATION"
status: "ready_for_release"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Scope (Phase 80 - v2.5.23)
1. **PWA Web Share Target API Integration (`manifest.json` & `sw.js`):**
   - Enable mobile OS share sheets to send files directly to Money Superapp by declaring `share_target` in `manifest.json` for `.csv`, `.txt`, `.json`, and `.vault`.
   - Intercept incoming multipart/form-data `POST` in Service Worker `sw.js` offline, persist temporarily in Cache API (`money-superapp-shared-payload`), and redirect with `?incoming_share=1`.
2. **Inbound Share Handler & Cross-Tool Bridge (`js/app-shell.js` & `js/remaining-money.js`):**
   - On load with `?incoming_share=1`, retrieve cached file payload.
   - If bank statement (CSV/TXT), forward to `remaining-money.html` via `localStorage.moneySuperapp.pendingBankStatement` and auto-trigger `MoneyApp.detectAndParseThaiBankStatement()`.
   - If backup file (`.vault` or `.json`), trigger restore prompt directly.
3. **Outbound Native Share Sheet Integration (`navigator.share`):**
   - In `js/app-shell.js`: Use `navigator.share({ files: [file] })` for vault/backup exports with seamless fallback to file download.
   - In `dashboard.html` & `js/dashboard.js`: Add `#btnShareDossier` to Executive Dossier card to share clean executive summary text via `navigator.share` (or clipboard copy fallback), respecting privacy mask.
4. **Verification & Delivery:**
   - Unit & smoke tests in `tests/`.
   - Headless CDP script with screenshots (Dossier share, share target handling, light/dark/mobile).
   - Biome check & bump to `v2.5.23`.
