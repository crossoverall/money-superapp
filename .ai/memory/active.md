---
task_id: "SDLC-PHASE-71-NEXT-BEST-MOVE-ADVISOR"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes Resolved
1. **Actionable Financial Advice Deficit (`dashboard.html`):**
   - Implemented `generateNextBestMoves(profile, health, lang)` in `js/dashboard.js`, mapping multi-tool telemetry to prioritized, actionable intervention objects.
   - Priority 1: Emergency runway shortage (< 3 mo) -> `remaining-money`, debt burden drag -> `debt-calculator`.
   - Priority 2: Savings rate under 20% -> `remaining-money`, top marginal tax bracket >= 15% with unutilized deductions -> `tax-calculator-base`.
   - Priority 3: Monthly DCA surplus deployment -> `rebalance`, 3-bucket retirement resilience check.
   - Inserted `#healthNextBestMovesSection` and `#healthActionCardsContainer` inside `#panelFinancialHealthScoreBody` with full responsive CSS grid layout.
   - Rendered 1-click action buttons with robust cross-context bridge `jumpToTab(tabId)`.
   - Added complete bilingual dictionary entries in `translations.th` and `translations.en` with 100% key symmetry.

### Verification
- 341 / 341 unit & integration smoke tests passing (`npm test`).
- 0 Biome linter errors (`npx @biomejs/biome check`).
- Headless Chrome CDP visual inspection: Light, Dark, and Mobile (390x844) modes verified with 0 layout overflows.
- Bumped version to `v2.5.14`.
