---
task_id: "feat-rebalance-live-prices"
complexity: "level_2"
current_stage: "release"
assigned_agent: "release"
iteration_count: 1
max_iterations: 2
status: "completed"
target_files:
  - "rebalance.html"
  - "sw.js"
  - "index.html"
  - "dashboard.html"
  - "months-slips.html"
  - "tax-calculator-base.html"
  - "tax-calculator.html"
  - "remaining-money.html"
  - "debt-calculator.html"
  - "README.md"
  - ".ai/memory/lessons.md"
---

# Active Task State Bus

> This file is the centralized state machine and working scratchpad for the Multi-Agent SDLC pipeline.

## 1. Task Objective & Context
- **Description:** Implement real-time asset price fetching, 10-minute auto-refresh, manual refresh button, and timestamp tracking in the Rebalance page (`rebalance.html`).
- **Feature Scope:**
  1. **Crypto Price Engine (e.g. Bitcoin / BTC):** Direct browser fetch via Coinbase API (`https://api.coinbase.com/v2/prices/{SYMBOL}-USD/spot`) with open CORS, zero API key required.
  2. **Forex Currency Engine (USD to THB):** Direct browser fetch via Open Exchange Rates API (`https://open.er-api.com/v6/latest/USD`) with open CORS, zero API key required, to convert USD asset prices to THB.
  3. **US Stock & ETF Engine (e.g. NVDA, SGOV):** Configurable Finnhub / Twelve Data client-side API integration (CORS-enabled with free user API key stored in `localStorage`), with graceful fallback to manual price entry.
  4. **Asset Data Model Enhancement:** Support optional `ticker`, `units` (quantity), `price` (unit price), and `currency` (USD/THB) alongside existing `value` (THB) and `weight` (%). Auto-calculate `value = units * price * fxRate`. Ensure 100% backward compatibility with existing saved states.
  5. **Live Refresh Controls & Timestamp:**
     - Manual refresh button (🔄) with loading spinner and disabled state while fetching.
     - Visible timestamp showing last update time (`HH:MM:SS`) and effective USD/THB rate.
     - 10-minute auto-refresh timer (`setInterval(600000)`), with auto-pause when tab is hidden or blurred (`document.visibilityState === 'hidden'`).
  6. **API Settings Modal:** Clean modal in the toolbar to configure optional Finnhub / Twelve Data API keys, test connection, and toggle auto-refresh.
  7. **Offline-First & Security Guardrails:** Strict XSS prevention (DOM textContent & escapeAttr), graceful offline fallback using cached prices, zero telemetry.
  8. **Localization:** Full Thai and English translations for all new elements.

## 2. Working Plan & Acceptance Criteria

### Phase 1: Planning & Architectural Design
- [x] Analyze CORS and public APIs (Coinbase, Open Exchange Rates, Finnhub, Twelve Data).
- [x] Design backward-compatible asset schema and price calculation formulas.
- [x] Obtain user approval (HITL Gate).

### Phase 2: Implementation (`rebalance.html`)
- [x] Add live price bar UI (Refresh button, timestamp, USD/THB badge, API key config button).
- [x] Add API settings modal (Finnhub API key, Twelve Data API key, Auto-refresh toggle).
- [x] Update asset row rendering to support Ticker (`BTC`, `NVDA`, etc.), Units, Price, and auto-computed Value.
- [x] Implement `fetchCryptoPrice(symbol)` (Coinbase API).
- [x] Implement `fetchUsdThbRate()` (Open Exchange Rates API).
- [x] Implement `fetchStockPrice(symbol)` (Finnhub / Twelve Data API with user key).
- [x] Implement `fetchAllPrices()` coordinator with loading indicators and error resilience.
- [x] Implement 10-minute interval auto-refresh with `document.visibilityState` lifecycle handling.
- [x] Add TH/EN translations in `T.th` and `T.en`.

### Phase 3: QA & Build Verification (`qa_debugger`)
- [x] Validate syntax, DOM elements, localization keys, and formula accuracy.
- [x] Execute automated test suite across mock data, network failure simulations, and edge cases (49 tests passed, 0 failed).

### Phase 4: Adversarial Security & Code Review (`security_reviewer`)
- [x] Audit for DOM XSS, API key leakage, error boundary integrity, and schema migration safety (16 security checks passed, 0 failed, verdict: APPROVE).

### Phase 5: Release & Version Bump (`release`)
- [x] Bump version to `v1.3.20`, update `sw.js` cache, update `README.md` and `.ai/memory/lessons.md`.
- [x] Commit, push branch, open PR, and merge into master upon passing all checks.
