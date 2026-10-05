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

### 2026-09-28: CSV Formula Injection (CWE-1236), Cross-Browser Downloads & Clipboard Feedback

- **Date & Context:** 2026-09-28, during implementation of CSV, JSON, and Clipboard export features in `remaining-money.html` (`v1.3.29`).
- **Problem:**
  1. Exporting raw user inputs (e.g. custom income/expense item names or notes) directly into CSV cells without sanitization creates Formula Injection vulnerabilities (CWE-1236). Spreadsheets (Excel, LibreOffice, Google Sheets) execute cells starting with `=`, `+`, `-`, `@`, `\t`, or `\r` as formulas or DDE macro commands. However, naively quoting all fields prefixed with `-` breaks valid negative numbers (e.g., `-5000` deficit or cash outflow).
  2. In modern WebKit (Safari/iOS) and Gecko (Firefox) engines, programmatically creating an `<a>` element and triggering `.click()` without attaching it to `document.body`, or immediately calling `URL.revokeObjectURL(url)` in the same tick, causes the browser to abort or ignore the download.
  3. Clipboard copy buttons with temporary feedback (e.g., changing text to "✓ Copied!" for 1.8s) that capture the element's current `.textContent` on click can suffer from double-click race conditions: a second click during the 1.8s window captures "✓ Copied!" as the original label, permanently freezing the button with the success text.
- **Root Cause:**
  1. Spreadsheet engines interpret certain characters as formula triggers unless explicitly escaped with a text prefix (`'`).
  2. Browser security policies and asynchronous download managers require downloadable links to be part of the active DOM tree during dispatch, and asynchronous fetch of the Blob URL fails if revoked prematurely.
  3. Non-deterministic state capture from mutable DOM nodes rather than authoritative localization dictionaries.
- **Solution & Rule:**
  1. **Neutralize CSV Formula Injection (CWE-1236):** For any cell string starting with `=, +, -, @, \t, \r`, verify whether the string is numeric (`isNaN(Number(str))`). If non-numeric text, prepend a single quote `'` before standard CSV quote wrapping (`"..."`). Preserve legitimate numeric values (e.g., `-5000`, `50000`) untouched.
  2. **Reliable DOM Attachment & Object URL Revocation:** Always append dynamically created `<a>` download elements to `document.body` before calling `.click()`, remove them immediately after (`document.body.removeChild(link)`), and defer `URL.revokeObjectURL(url)` via `setTimeout(() => URL.revokeObjectURL(url), 1000)` to allow the browser's download manager sufficient time to acquire the blob.
  3. **Deterministic UI Feedback State:** When reverting temporary UI feedback on buttons (e.g., after copying to clipboard), never capture the current DOM text. Instead, resolve the restored label deterministically using localization lookups (e.g. `t('lblCopySummary') || (isEN ? 'Copy Summary' : 'คัดลอกสรุป')`).

### 2026-09-29: Robust CSV/JSON File Import Heuristics, Sanitization & Accessible Modals

- **Date & Context:** 2026-09-29, during implementation of JSON and CSV data import with interactive preview modal in `remaining-money.html` (`v1.3.30`).
- **Problem:**
  1. Arbitrary CSV structures often contain percentages across multiple rows (e.g. bonus percentages, interest rates, tax withholding). If regex matches percentages greedily, unrelated percentages overwrite the user's Provident Fund (PVD) rate.
  2. If the first encountered income entry is eagerly designated as base salary inside row iteration loops, users whose CSVs list secondary incomes or freelance stipends before primary salary end up with a misclassified salary baseline and incorrect social security deductions.
  3. Untrusted or malformed file imports containing negative values or absurd percentages can corrupt tax bracket calculations, runway estimations, or produce negative savings rates.
  4. Dynamic import modal overlays without full ARIA dialog attributes, backdrop dismissals, or Escape key handlers fail accessibility audits and trap keyboard/screen-reader users.
- **Root Cause:** Naive sequential parsing assumptions, lack of domain-scoped keyword heuristic filters, missing numeric boundary constraints on imported payloads, and incomplete modal dialog semantics.
- **Solution & Rule:**
  1. **Scoped Heuristics for Rate Extraction:** Strictly scope PVD percentage extraction to rows containing Provident Fund keywords (`pvd`, `provident`, `กองทุนสำรองเลี้ยงชีพ`) to prevent accidental overwriting from arbitrary percentage strings (interest, tax withholding, bonus).
  2. **Post-Loop Income Classification Fallback:** Avoid eagerly flagging the first parsed income row as salary inside row loops when users list secondary incomes before primary salary; scan for explicit salary keywords first, and only use post-loop fallbacks if no explicit salary row is identified.
  3. **Strict Input Sanitization & Clamping:** Always clamp numerical amounts to $\ge 0$ (`Math.max(0, val)`) and apply explicit upper bounds checks on rates and percentages (e.g. PVD rate 0–15%, tax rates, interest rates) on file imports to prevent corrupted tax bracket or runway math.
  4. **Accessible Modal Pattern:** Modal dialogs must specify `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="..."` alongside both backdrop click listeners and global Escape key dismissal (`keydown` handler).

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

### 2026-10-05: Water-fill allocate() — lockedValue pattern for frozen zero-weight assets

- **Date & Context:** 2026-10-05, fix for `rebalance.html` `allocate()` (`v1.3.31`).
- **Problem:** The water-filling algorithm ejected assets from `active` when their target fell below their current value. On ejection, the asset's value disappeared from `sumVActive` in subsequent iterations, causing `T = sumVActive + remaining` to shrink. For zero-weight (frozen) assets like a "Cash" position the user no longer tops up, this meant Gold and SGOV computed their targets against a shrunken bucket total — producing inflated top-up amounts and incorrect after-top-up percentages.
- **Root Cause:** `T` was computed purely from `sumVActive` (only currently-active assets). Assets ejected mid-loop as "over target" silently dropped out of the denominator, leaving remaining active assets to fill a smaller-than-real pool.
- **Solution — `lockedValue` pattern:**
  1. Pre-eject zero-weight assets before the loop; add their value to `lockedValue`.
  2. Every iteration: `T = sumVActive + lockedValue + remaining` — locked value always present.
  3. Active asset targets: `target[i] = (w[i] / sumWActive) * (T - lockedValue)` — only the distributable (non-locked) slice is allocated.
  4. When any active asset is ejected mid-loop (it's over target), add its value to `lockedValue` before removing from `active`.
- **Display side effects fixed:**
  - Zero-weight assets now show `🔒 frozen` badge (EN) / `🔒 ตรึง` (TH) instead of `🔼 over target`.
  - `cappedCount` now excludes zero-weight assets (`a.weight > 0` guard added) so the "X assets capped" note only fires for real rebalancing overflows, not intentional freezes.
- **Security note:** `driftText` for frozen path is a hardcoded emoji literal — not derived from user input — so no XSS surface is introduced.
- **Rule:** Any time a water-fill or quota-allocation algorithm ejects a participant, preserve that participant's current value in the running total (via a `lockedValue` accumulator or equivalent) so percentage targets for remaining participants stay proportional to the real portfolio.


### 2026-10-05: Hierarchical Water-filling Rebalancing (Bucket level and Asset level)

- **Date & Context:** 2026-10-05, fix for top-level bucket budget split in `rebalance.html` (`v1.3.32`).
- **Problem:** While assets *within* each bucket were rebalanced using buy-only water-filling, the top-level budget split across buckets (Core / Ballast / Satellite) was performed via a naive proportional division (`bucket.weight / totalBucketW * totalBudget`). If an entire bucket was already over its target weight (e.g. Ballast holding 30% of total portfolio value vs a 15% target), it still received its naive percentage slice of the monthly top-up budget instead of 0.
- **Root Cause:** Rebalancing was hierarchical in concept, but only the leaf layer (assets inside buckets) implemented water-filling. The group layer used static proportional allocation, ignoring current bucket portfolio values.
- **Solution — `allocateBuckets()`:**
  1. Map each bucket to an entity with its target weight and total current value (`sum of asset values`).
  2. Run `allocate()` across buckets to determine how much new budget each bucket actually needs to progress toward its group-level target weight without selling.
  3. Over-allocated buckets receive 0 budget, and their shares are automatically redirected to lagging buckets.
  4. Synchronized `compute()`, `copyTradeOrders()`, and `exportCSV()` to use `allocateBuckets()`.
  5. Enhanced group-level feedback: when a bucket receives 0 budget because it is over target, display an explicit banner explaining that the group is over target and its share has been redistributed to lagging groups.
- **Rule:** In multi-tier portfolio allocators, every hierarchy tier (group level down to asset level) must execute the same water-filling constraint solver so that overweight branches are capped and freed budget bubbles to underweight branches.


### 2026-10-05: 100% Client-Side Google Sign-In & Google Drive AppData Cloud Sync

- **Date & Context:** 2026-10-05, implementation of Google OAuth 2.0 Sign-In and Google Drive Cloud Backup/Restore in `index.html` (`v1.4.0`).
- **Problem:** Users needed seamless cross-device backup and restore without violating ADR-001 (100% client-side privacy, zero server-side storage, zero custom backends). Asking users to copy/paste developer tokens or configure complex backends creates friction.
- **Solution — Direct GIS Token Client & Google Drive REST API v3:**
  1. **Google Identity Services (GIS):** Used `google.accounts.oauth2.initTokenClient` with scope `https://www.googleapis.com/auth/drive.appdata email profile`.
  2. **Dedicated AppData Isolation:** Files are written to Google Drive's hidden `appDataFolder` (`money-superapp-backup.json`). This folder is private to the application, invisible in the user's regular Google Drive file list, and cannot be accessed by other third-party apps.
  3. **Multipart/related Upload:** Implemented `uploadType=multipart` for creation and `uploadType=media` with `PATCH` for existing file updates, bypassing any intermediate proxy.
  4. **Strict Token Security:** Access tokens are stored exclusively in memory and `sessionStorage`, never in `localStorage` or external storage.
  5. **Prefix Whitelisting on Restore:** When restoring from Drive, the payload is parsed and sanitized against strict allowed prefixes (`moneySuperapp.`, `remainingMoneyCalculator.`, `rebalanceCalculator.`), preventing arbitrary key injection.
- **Rule:** When adding cloud synchronization to privacy-first, zero-backend SPAs, leverage direct OAuth token flows to user-owned storage (such as Google Drive `appDataFolder` or iCloud/Dropbox) with memory-only token storage and strict JSON schema / prefix verification on import.

