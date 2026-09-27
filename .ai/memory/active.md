---
task_id: "feat-thai-assets-support"
complexity: "level_2"
current_stage: "release"
assigned_agent: "release"
iteration_count: 0
max_iterations: 2
status: "completed"
target_files:
  - "rebalance.html"
  - "sw.js"
---

# Active Task State Bus

> This file is the centralized state machine and working scratchpad for the Multi-Agent SDLC pipeline.

## 1. Task Objective & Context
- **Description:** Add support for Thai assets in the Rebalance Calculator (`rebalance.html`), specifically Thai Mutual Funds (e.g. `K-WORLDX`, `SCBCE`), Thai Gold (e.g. `YLG-GOLD`), and Thai SET stocks.
- **Problem & Requirements:**
  1. Currently, asset unit prices are assumed to be in USD ($) and multiplied by the USD/THB exchange rate.
  2. Thai assets (`K-WORLDX`, `SCBCE`, `YLG-GOLD`, SET stocks) are priced in **Thai Baht (THB)** natively (NAV or Baht of gold).
  3. `YLG-GOLD` (Thai Gold Bar) can be fetched live in real time via the open CORS Thai Gold API (`https://api.chnwt.dev/thai-gold-api/latest`).
  4. Thai Mutual Funds (`K-WORLDX`, `SCBCE`) need currency set to `THB`, with dedicated NAV inputs and automatic asset value computation ($\text{Value} = \text{Units} \times \text{NAV}$).
  5. Asset row UI needs a clean currency switch/indicator (`$` vs `฿`) with smart auto-detection based on ticker prefix.

## 2. Working Plan & Acceptance Criteria

### Phase 1: Planning & Design
- [x] Investigate Thai Gold API (`api.chnwt.dev`) and Thai Mutual Fund data constraints.
- [x] Design multi-currency asset schema (`currency: 'USD' | 'THB'`).
- [x] Design smart auto-detection:
  - Crypto (`BTC`, `ETH`) $\to$ `USD`
  - US Equities (`NVDA`, `SGOV`, `VOO`) $\to$ `USD`
  - Thai Gold (`YLG-GOLD`, `GOLD`, `ทองคำ`) $\to$ `THB` (Live API)
  - Thai Mutual Funds (`K-`, `SCB`, `B-`, `KT-`, `ONE-`, `T-`) $\to$ `THB` (NAV)
  - Thai SET Stocks $\to$ `THB`

### Phase 2: Implementation (`rebalance.html`)
- [x] Add live Thai Gold price fetching (`fetchThaiGoldPrice()`).
- [x] Update `fetchAssetPrice()` to route `YLG-GOLD` / `GOLD` to the Thai Gold API.
- [x] Add currency toggle/badge (`$` / `฿`) per asset row.
- [x] Update asset value computation formula:
  - If `currency === 'THB'`: $\text{Value} = \text{Units} \times \text{Price}$
  - If `currency === 'USD'`: $\text{Value} = \text{Units} \times \text{Price} \times \text{USD/THB Rate}$
- [x] Update default state to include `K-WORLDX`, `SCBCE`, and `YLG-GOLD` as requested.
- [x] Update CSV export and copy order functions to display the correct currency symbol.

### Phase 3: QA Verification (`qa_debugger`)
- [x] Validate syntax and DOM elements.
- [x] Verify Thai Gold API response parsing.
- [x] Verify calculation accuracy for THB assets vs USD assets.
- [x] Verify legacy state migration.

### Phase 4: Adversarial Security & Code Review (`security_reviewer`)
- [x] Audit XSS escaping for currency selectors and Thai asset names.
- [x] Verify network timeout and error resilience for the Thai Gold API.
- [x] Verify client-side privacy (zero API telemetry).

### Phase 5: Release & Version Bump (`release`)
- [x] Bump version to `v1.3.21`, update `sw.js` cache, update `README.md` and `.ai/memory/lessons.md`.
- [x] Create PR and merge into master upon passing all checks.
