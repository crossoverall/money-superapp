---
task_id: "SDLC-BUGFIX-REBALANCE-BOTTOM-CARDS-CONTAINER"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Problem Diagnosis & Root Causes Resolved
1. **Unstyled `.card` on Bottom 3 Auxiliary Sub-Tools (`rebalance.html`):**
   - Added `.panel, .card:not(#panelBuckets)` box container rule (`background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 16px; margin-bottom: 16px;`).
   - Added `margin-bottom: 16px;` and `border-radius: 16px; padding: 16px;` to `.howto`.
   - Declared `class="panel card reorder-card"` on `#panelTargetDateGlidepath`, `#panelThaiGold`, and `#panelForeignTaxAdvisor`.
   - Added `cursor: pointer; user-select: none;` on `.reorder-card .card-header`.

### Verification
- 333 / 333 unit & integration smoke tests passing (`npm test`).
- 0 Biome linter errors (`npx @biomejs/biome check`).
- Headless Chrome CDP visual inspection: Both collapsed and expanded views verified. All 3 auxiliary sub-tools now match `#panelBudget` and `#howto` with identical background `#FFFFFF` / `#131E19`, 1px line border, 16px border radius, and 16px padding.
- Version bumped to `v2.5.13`.
