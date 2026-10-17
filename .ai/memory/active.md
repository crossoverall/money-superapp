---
task_id: "FEAT-TAX-WATERFALL-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: Interactive Tax Bracket Waterfall Visualization (Phase 9 Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Upgrade the static numeric tax bracket breakdown in `tax-calculator-base.html` into an interactive, visual **Tax Bracket Waterfall Bar** with per-tier progress indicators, marginal headroom cues, and instant tax savings context.
- **Target Files (<= 5 files):**
  1. `tax-calculator-base.html` (Waterfall visual bar, per-tier fill indicators, room to next bracket alert, localization)
  2. `tests/financial-math.test.mjs` (Unit tests for tier allocation breakdown, headroom calculations, and marginal tax tier math)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Third-party chart libraries (D3, Chart.js).
  - External server or cloud components (100% offline client-side per ADR-001).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% offline, calculated entirely in client browser.
- **ADR-002 (Iframe Isolation):** Self-contained within `tax-calculator-base.html`.
- **Visual Design:** Uses project color hierarchy:
  - 0% Exempt: Emerald (`#10b981`)
  - 5% Tier: Cyan (`#06b6d4`)
  - 10% Tier: Blue (`#3b82f6`)
  - 15% Tier: Indigo (`#6366f1`)
  - 20% Tier: Purple (`#8b5cf6`)
  - 25% Tier: Amber (`#f59e0b`)
  - 30% Tier: Orange (`#f97316`)
  - 35% Tier: Red (`#ef4444`)

#### 3. Step-by-Step Implementation Summary
1. **Segmented Waterfall Bar (`#waterfallBarContainer`):**
   - Visual proportional bar displaying each active bracket's taxable portion relative to total net taxable income with accessible tooltips.
2. **Headroom & Next Bracket Alert (`#bracketHeadroomBanner`):**
   - Informs users of remaining room in current bracket before exceeding into higher rate: e.g. "💡 เหลือเงินได้อีก **฿X** ในขั้น **Y%** ก่อนก้าวขึ้นสู่ขั้น **Z%**".
   - Celebrates tax-exempt income (0-150k THB) with green alert banner.
3. **Tier-by-Tier Breakdown Cards (`#taxBreakdown`):**
   - Color-coded rate badges, taxable amount, mini progress fill bar, and tax generated in that tier.
4. **Effective Tax Rate (`#txt-effective-tax-rate`):**
   - Displays real effective tax rate percentage relative to total annual income.
5. **Bilingual Localization:**
   - Full Thai and English translations for labels, headroom prompts, and bracket rate badges.
6. **Verification & Tests:**
   - Unit tests added in `tests/financial-math.test.mjs` (39 total tests passing).
   - Biome linter passes with 0 errors.
   - Bumped to `v1.9.2` via `node scripts/bump.mjs patch`.

#### 4. Acceptance Criteria
- [x] Segmented Tax Bracket Waterfall bar renders smoothly with proportional tier colors.
- [x] Marginal headroom alert displays room before next tax bracket.
- [x] Per-tier cards render with individual progress fill bars and tax contributions.
- [x] Effective tax rate displayed dynamically.
- [x] Full bilingual support (TH / EN).
- [x] 39/39 automated unit tests pass and Biome check passes cleanly.
