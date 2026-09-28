# Lessons Learned & Quirks

> This file records non-obvious lessons, gotchas, recurring bug patterns, and repository quirks.
> Future agents should review these lessons to avoid repeating past mistakes.

## Formatting Guidelines

When adding a lesson, include:
- **Date & Context:** When and where did this issue occur?
- **Problem:** What unexpected behavior or failure was observed?
- **Root Cause:** Why did it happen?
- **Solution & Rule:** What is the rule or fix for future agents?

---

## Log

### 2026-09-27: Centralized Theme System & PWA Offline Integrity

- **Date & Context:** 2026-09-27, during theme unification across all 7 calculators and `index.html`.
- **Problem:**
  1. The app shell and multiple pages had visual discordance: four calculators used a minimalist Sage/Emerald palette, one used cool slate/indigo, and two used generic Tailwind blue/gray classes.
  2. Switching tabs caused jarring background flashes and inconsistent form controls/buttons.
  3. Two pages (`tax-calculator-base.html` and `months-slips.html`) contained external `<link href="https://fonts.googleapis.com/css2?...">` links, breaking offline PWA operation when running disconnected.
- **Root Cause:** Independent evolution of pages where CSS variables were embedded inline in `<style>` blocks in each file rather than imported from a single shared stylesheet.
- **Solution & Rule:**
  1. Centralized shared CSS custom properties into [`css/theme.css`](file:///home/l2okii/Documents/money-superapp/css/theme.css) and added `'./css/theme.css'` to `ASSETS_TO_CACHE` in [`sw.js`](file:///home/l2okii/Documents/money-superapp/sw.js).
  2. Rely strictly on system font stacks (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", sans-serif`) to ensure zero external CDN dependencies for offline PWA compliance.
  3. Whenever a new tool or shared styling is created, link `css/theme.css` and always run `node scripts/bump.mjs patch` so client service workers immediately fetch the updated asset cache.

### 2026-09-27: Stored XSS Guard & Shell Root Dataset Theme Binding

- **Date & Context:** 2026-09-27, during adversarial security and code review of theme unification.
- **Problem:**
  1. In `dashboard.html`, snapshot dates and IDs were directly interpolated into `innerHTML` and inline `onclick="deleteSnapshot(${s.id})"`. Since snapshots can be loaded from external backup JSON files, an attacker could inject malicious scripts.
  2. In `index.html`, `applyTheme()` toggled active classes on buttons but neglected to set `document.documentElement.dataset.theme = theme`. Consequently, the shell root never evaluated dark mode variables, causing light flashes during tab navigation.
  3. Five child calculators forwarded only `Alt+1..5` shortcuts instead of `Alt+1..7`, breaking shortcuts for Remaining Money (`Alt+6`) and Debt Calculator (`Alt+7`).
- **Root Cause:** Incomplete event delegation, lack of textContent sanitization for imported data, and legacy hardcoded shortcut boundaries.
- **Solution & Rule:**
  1. Always set dynamic data from storage via `.textContent` or sanitized DOM nodes, and bind event handlers using `.addEventListener()` with explicit type casting (`Number(s.id)`).
  2. In root shell files, ensure `document.documentElement.dataset.theme = theme` is called so child and parent CSS `:root[data-theme="dark"]` rules trigger predictably.
  3. Always forward all valid application tab shortcuts (`e.key >= '1' && e.key <= '7'`).

### 2026-09-27: SVG Tooltip XSS via Inline Attributes & Date Rollover Month-Skipping

- **Date & Context:** 2026-09-27, during adversarial audit of dashboard localization fixes.
- **Problem:**
  1. SVG chart point dots were dynamically built with stringified inline attributes `onmouseover="showChartTooltip(event, '${p.date}', ...)"`. A malicious date in `localStorage` executed arbitrary JavaScript.
  2. Target debt payoff date used `targetDate = new Date(); targetDate.setMonth(targetDate.getMonth() + approxMonths);`. When calculated on the 29th, 30th, or 31st of a month, dates rolling into shorter months (e.g. February or 30-day months) overflowed and skipped an extra month.
- **Root Cause:** Inlined JavaScript event handlers instead of event delegation, and failing to pin day of month to `1` prior to month arithmetic.
- **Solution & Rule:**
  1. Never construct inline event handlers (`onmouseover="..."`) inside dynamic SVG/HTML strings. Use `data-*` attributes with `escapeHtml()` and attach delegated event listeners on the SVG container.
  2. Always sanitize tooltip content via `escapeHtml()`.
  3. When calculating future month milestones, always pin to the 1st of the target month: `new Date(now.getFullYear(), now.getMonth() + months, 1)`.

### 2026-09-27: Client-Side CORS Market Data Fetching & Tab Visibility Auto-Refresh

- **Date & Context:** 2026-09-27, during implementation of real-time price fetching in `rebalance.html` (`v1.3.20`).
- **Problem:**
  1. Browser-based client-side SPA architectures cannot use standard server-to-server stock APIs because major US stock exchanges require licensed data and providers (Yahoo Finance, standard endpoints) block direct browser calls via CORS policies (`Access-Control-Allow-Origin` missing).
  2. Public CORS proxies (e.g. `allorigins.win`, `corsproxy.io`) are fragile, frequently trigger anti-bot HTML challenge pages, and introduce security/privacy risks.
  3. Recurring `setInterval` auto-refreshers run continuously even when browser tabs are hidden or minimized, draining device battery and exhausting third-party API quotas.
- **Root Cause:** Fundamental architectural differences between open crypto exchanges (Coinbase/Binance) vs licensed equities, and unmanaged background timer lifecycles in single-page apps.
- **Solution & Rule:**
  1. For Crypto (BTC, ETH, etc.), use public CORS-enabled endpoints (Coinbase spot price) that require zero API keys and zero backend.
  2. For Forex (USD/THB), use free open CORS endpoints (Open Exchange Rates / ER-API) without API keys.
  3. For US Stocks/ETFs (NVDA, SGOV), support CORS-friendly providers (Finnhub, Twelve Data) by allowing users to store their own free API key in client `localStorage`, while providing manual price fallback.
  4. Always gate recurring auto-refreshers with `document.visibilityState === 'visible'` and attach a `visibilitychange` listener to catch up only when the tab regains focus if the refresh interval has elapsed.

### 2026-09-27: Multi-Currency Portfolio Normalization & Local Thai Asset Valuation

- **Date & Context:** 2026-09-27, during implementation of Thai assets support (`v1.3.21`) including `K-WORLDX`, `SCBCE`, and `YLG-GOLD`.
- **Problem:**
  1. Prior implementation assumed all assets with price and units were denominated in USD and multiplied by `usdThbRate`. Domestic Thai assets (`K-WORLDX`, `SCBCE`, `YLG-GOLD`) are denominated natively in Thai Baht (THB). Applying the FX rate inflated their portfolio value by ~33.4x.
  2. Thai mutual funds are unlisted OTC funds without open browser CORS APIs, requiring smooth manual NAV entry that integrates seamlessly with DCA allocation.
  3. Thai Gold (`YLG-GOLD`) trades in "Baht of Gold" (บาททองคำ), requiring live integration with Thai Gold Association quotes.
- **Root Cause:** Uniform single-currency assumption in asset modeling and lack of per-asset currency selector and ticker-prefix classification.
- **Solution & Rule:**
### 2026-09-27: Automated Full-Script Syntax Validation in Single-File Tools

- **Date & Context:** 2026-09-27, during syntax crash resolution in `rebalance.html` (`v1.3.22`).
- **Problem:** When editing inline `<script>` tags, an accidental omission of a closing brace `}` inside `renderBuckets()` caused an `Unexpected end of input` syntax error, completely halting page hydration in the browser.
- **Root Cause:** QA unit tests inspected extracted helper functions in isolation rather than parsing the complete verbatim `<script>` block from the HTML file.
- **Solution & Rule:**
  1. For single-file HTML tools with inline scripts, QA must always extract and compile the entire `<script>` block using `new vm.Script(scriptContent)` to guarantee zero syntax or parser errors.
  2. Perform a headless Chrome smoke check (`google-chrome --headless=new --remote-debugging-port`) to verify that the live browser environment boots with zero uncaught runtime exceptions and hydrates the DOM completely before signing off.

### 2026-09-28: Distinguishing Uninitialized vs User-Cleared Collections in `localStorage`

- **Date & Context:** 2026-09-28, during bug fix for dashboard snapshot clearing and individual deletion (`v1.3.28`).
- **Problem:**
  1. Users could not delete snapshots down to 0 or use "Clear All History" (`clearAllSnapshots()`); upon deletion of the last item or clearing the collection, the dashboard immediately regenerated 3 seed snapshots.
  2. Refreshing the browser after clearing always restored seed data.
- **Root Cause:**
  1. **Premature seeding fallback:** `getSnapshots()` checked `if (Array.isArray(arr) && arr.length > 0) return arr;`. When the collection was legitimately emptied by the user (`arr = []`), `arr.length > 0` evaluated to false and fell through to the default seed data generator.
  2. **Improper removal in clear action:** `clearAllSnapshots()` invoked `localStorage.removeItem(SNAPSHOT_KEY)`. When getters treat a missing key (`raw === null`) as a brand-new user requiring sample/seed data, removing the key makes the collection appear uninitialized rather than intentionally cleared.
  3. **Loose vs Strict ID comparison:** Snapshot deletion used strict inequality `s.id !== id` while event listeners passed `Number(s.id)`. If IDs were persisted as strings (e.g. from imported backups or timestamp strings), deletion failed silently.
- **Solution & Rule:**
  1. **Distinguish uninitialized (`null`) from empty (`[]`):** Check `if (raw !== null)` and return `arr` whenever `Array.isArray(arr)` is true, even if `arr.length === 0`. Only fall back to seed generation if `raw === null`.
  2. **Persist empty state on clear:** In clear/reset actions where default seeds exist on first boot, do NOT use `localStorage.removeItem(KEY)`. Explicitly persist the empty collection (`saveSnapshots([])` / `localStorage.setItem(KEY, '[]')`).
  3. **Robust ID matching:** Always coerce IDs to consistent types (e.g. `String(s.id) !== String(id)`) when filtering collections to avoid type mismatch bugs between numbers and strings.

---

## Lesson: Always run the full SDLC loop — QA alone is not enough (2026-09-27)

**Context:** Three consecutive bug-fix commits (v1.3.24–v1.3.26) were shipped with only syntax-check + test suite (QA) but without the Security Review or Release stages.

**What the Security Reviewer found:**
1. **Stored XSS (CRITICAL):** `a.name` was rendered unescaped inside a results `innerHTML` template (`${a.name}` in compute results panel). The same `escapeAttr()` helper used in `renderAssetRows()` was missing in the results row. A user could store `<img src=x onerror=alert(1)>` as an asset name in localStorage and trigger arbitrary JS execution.
2. **`bucket.label` unescaped** in two innerHTML spots (also via localStorage input).
3. **`_prevPrice` crash persistence:** Stash could survive to localStorage if the browser crashed mid-fetch.
4. **DoS / lock starvation:** No max asset cap or per-request timeout meant 100-asset portfolios could hold the `isFetchingPrices` lock for 3+ minutes.
5. **`KNOWN_US_EQUITIES` regex compiled per-call** instead of at module scope.

**Fixes applied:**
- `escapeAttr()` applied to `a.name` and `bucket.label` everywhere in innerHTML templates.
- `fetchWithTimeout(10s)` wrapper using `AbortController` added for all price fetch calls.
- `MAX_FETCH = 50` cap prevents unbounded sequential loops.
- `delete a._prevPrice` cleanup added before `saveState()`.
- `KNOWN_US_EQUITIES` moved to module-level constant.

**Rule reinforced:** The AGENTS.md rule "Mandatory Full SDLC for All Fixes" exists precisely because QA verifies correctness but not security. The Security Reviewer catches XSS, key exposure, and DoS patterns that tests can't see. Never skip it.
