---
task_id: "SDLC-BUGFIX-THEME-HARMONIZATION-AND-UI-CRASHES"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes Resolved (Automated Browser Audit)
1. **Shell Theme Toggle Disconnected From Tools (`js/app-shell.js`):**
   - Added direct frame document theme/lang mutation + `postMessage({ type: 'THEME_CHANGE', theme })` / `LANG_CHANGE`.
   - Added frame `load` event synchronization.
2. **Hardcoded Dark Navigation in Shell (`index.html`):**
   - Replaced `#131E19`, `#24352C`, `#8FA69C`, `#0E1512` with semantic theme tokens `var(--panel)`, `var(--line)`, `var(--ink)`, `var(--ink-dim)`, `var(--bg)`, `var(--core)`.
3. **Three Uncaught Runtime ReferenceErrors Fixed:**
   - `js/dashboard.js`: Fixed `calculateFinancialHealthScore` call and hoisted `dashboardLayoutManager`.
   - `js/remaining-money.js`: Hoisted `remainingLayoutManager`.
   - `js/debt-calculator.js`: Hoisted `MONTH_NAMES_TH`, `MONTH_NAMES_EN`, and `debtLayoutManager`.
4. **Stale Theme Closure in Core Module (`js/shared.js`):**
   - Dynamically reads live `localStorage` in `initTheme()`.
   - Reacts to `message` and `storage` events.
5. **FOUC in HTML `<head>`:**
   - Early synchronous inline theme script added to all 8 HTML files.

### Verification
- 331 unit & smoke tests passing (87 suites).
- 0 Biome linter errors.
- Chrome CDP headless inspection across all 8 tools: 0 unhandled exceptions, 0 horizontal overflow, 0 contrast flaws.
- Version bumped to `v2.5.9`.

