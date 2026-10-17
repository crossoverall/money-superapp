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


### 2026-10-05: Google Cloud API Enablement Propagation Latency (403 Transient)

- **Date & Context:** 2026-10-05, Google Drive API 403 on newly created OAuth 2.0 Client ID.
- **Problem:** When enabling Google Drive API on a Google Cloud Console project for the first time, initial API requests may continue returning `403 Forbidden` (`Drive API error (403)` / `accessNotConfigured`).
- **Root Cause:** Google Cloud Console API enablement propagates across Google's edge authentication servers with a 1–2 minute delay. In addition, existing OAuth tokens requested prior to API enablement lack permission grants.
- **Resolution & Lesson:** Once Google Drive API is enabled, wait ~1–2 minutes for Google edge servers to synchronize. If necessary, sign out and sign back in to obtain an updated access token.


### 2026-10-06: Dynamic Asset Inclusion/Exclusion in Portfolio Allocation

- **Date & Context:** 2026-10-06, feature addition to `rebalance.html` (`v1.5.0`).
- **Problem:** Users needed a way to temporarily include or exclude individual assets from portfolio calculations (what-if analysis or tracking assets outside active rebalancing) without deleting the asset row or wiping historical inputs.
- **Solution — Active Index Mapping & Filtered Math:**
  1. **Data Model:** Added `a.enabled` boolean (default `true`). Unchecking sets `enabled: false`.
  2. **Active Indices Mapping:** Rather than mutating the underlying asset array, `compute()`, `copyTradeOrders()`, and `exportCSV()` extract `activeIndices = bucket.assets.map(...).filter(...)`. Only active assets are sent to `allocate(activeAssets, budget)`. Result allocations are remapped back to full asset indices, guaranteeing `0` allocation for disabled assets.
  3. **Visual Feedback:** Unchecked rows receive `.asset-row.excluded` styling (`opacity: 0.55`, strikethrough/dimmed title). In results, excluded items show an explicit `🚫 Excluded` / `🚫 ไม่รวมคำนวณ` badge and `—` for top-up amount.
  4. **Aggregations Filtered:** Bucket values (`currentTotal`), target weight totals (`totalAssetW`), and portfolio donut values (`totalVal`) filter only assets where `a.enabled !== false`.
- **Rule:** When adding toggleable entities to constrained optimizers (water-filling/rebalancers), preserve original array order by mapping active indices into an isolated sub-vector, and remap results back to the original index domain so all DOM rows maintain 1-to-1 parity.


### 2026-10-06: Dual-Currency Top-Up Equivalent in Constrained Rebalancers

- **Date & Context:** 2026-10-06, feature addition to `rebalance.html` (`v1.6.0`).
- **Problem:** Investors holding international assets (US ETFs, global equities, crypto) needed to see the USD equivalent amount alongside THB top-up amounts (e.g. `+33,390 ($1,000)`) both on-screen and across export workflows (Trade Orders and CSV) to place orders directly on foreign broker platforms without manual currency math.
- **Solution — Synchronized Dual-Currency Display & CSV Schema Extension:**
  1. **Helper & Rounding:** Implemented `fmtUSD(n) = Math.round(n).toLocaleString('en-US')`. Uses dynamic `state.usdThbRate` with fallback `33.39`.
  2. **Screen Rendering:** In `compute()`, when `add > 0.5` and the asset is not excluded, renders `+${fmt(add)}<span class="rusd">($${fmtUSD(usdAdd)})</span>` inside `.radd`. Excluded or zero top-up assets consistently render `—` without USD noise.
  3. **Export Parity:**
     - `copyTradeOrders()` outputs `Asset Name: +XXXX THB ($YYY) (Weight%)` (or `+XXXX บาท ($YYY)` in Thai).
     - `exportCSV()` adds a dedicated `Buy Amount (USD)` column in the header and rows: `"Group","Asset","Ticker",Units,Price,"Currency",Target %,Current Value (THB),Buy Amount (THB),Buy Amount (USD),"Status"`.
- **Rule:** Whenever multi-currency metrics are displayed alongside primary local currency values, maintain parity across all three channels: interactive UI card, clipboard text orders, and tabular CSV export.


### 2026-10-06: Dual-Currency Current Value in Results Card Subtitle

- **Date & Context:** 2026-10-06, feature addition to `rebalance.html` (`v1.6.1`).
- **Problem:** Users viewing asset rebalancing results needed to see both their current holding value in THB and its equivalent USD valuation in the `.rmeta` subtitle (e.g. `Current 12,500 ($374) → target 50%`) to assess positioning at a glance.
- **Solution:** In `compute()`, calculated `usdVal = Math.round(a.value / (state.usdThbRate || 33.39))` and formatted the first parameter of `t('rmeta', ...)` as `${fmt(a.value)} ($${fmtUSD(usdVal)})`.
- **Rule:** Re-use the existing localized string translation functions (`t('rmeta', cur, target)`) by enriching the formatted currency argument rather than hardcoding language templates in the render loop.


### 2026-10-06: Hierarchical Section-Level Exclusion in Multi-Tier Portfolio Rebalancers

- **Date & Context:** 2026-10-06, feature addition to `rebalance.html` (`v1.7.0`).
- **Problem:** Investors dividing portfolios across macro-asset classes (Core / Ballast / Satellite) wanted to temporarily disable an entire section (e.g. freezing crypto/satellite or pausing ballast) while rebalancing only the remaining active groups with 100% of the monthly budget.
- **Solution — Top-Level Bucket Filter & Dynamic Split Normalization:**
  1. **Data Model:** Added `bucket.enabled` boolean (default `true`) stored with `saveState()`.
  2. **Allocation Layer:** In `allocateBuckets()`, mapped active bucket indices (`b.enabled !== false`), passing only active buckets to `allocate()`, and filled `0` budget for disabled groups so active buckets receive 100% of the total monthly cash injection.
  3. **Visual Feedback:** Unchecked bucket headers dim the entire panel (`.bucket-panel.excluded`, opacity `0.55`, strikethrough title), display `🚫 Excluded` on the group budget amount, and disable the weight input in the split legend bar.
  4. **Donut & Portfolio Totals:** `totalVal` and donut chart segments filter only active buckets, recalculating 100% donut proportions across the active subset.
  5. **Exports:** `copyTradeOrders()` skips disabled sections; `exportCSV()` records `Group Excluded`.
- **Rule:** In multi-tier hierarchical optimizers, exclusion switches must be applied symmetrically at both the macro-group level and the micro-asset level, with active-index vector remapping preserving state indices.


### 2026-10-06: Analytical Minimum Budget Suggestion for Zero-Drift DCA Rebalancing

- **Date & Context:** 2026-10-06, feature addition to `rebalance.html` (`v1.8.0`).
- **Problem:** Investors wanted to know the exact minimum amount of new cash needed to correct all portfolio drift to 100% target weights without selling any assets.
- **Solution — 2-Tier Hierarchical Bottleneck Solver:**
  1. **Asset Level:** For each active asset in bucket $b$, find $T_{b, a} = a.value / (a.weight / W_b)$. The required bucket total is $V_b^{\text{req}} = \max(\sum a.value, \max_a T_{b, a})$.
  2. **Group Level:** For each active bucket $b$, find $T_{\text{port}, b} = V_b^{\text{req}} / (b.weight / W_{\text{port}})$. The required portfolio total is $T^* = \max(\sum V_b, \max_b T_{\text{port}, b})$.
  3. **Minimum Budget:** $B_{\min} = \max(0, \text{Math.round}(T^* - V_{\text{total}}))$.
  4. **UI Banner:** Rendered directly below the budget row with THB and USD amounts and a 1-click "Apply" button (`applyMinBudget(amt)`). Applying this budget mathematically drives drift on all active assets and groups to $\le 0.05\%$.
- **Rule:** For buy-only water-filling rebalancers, avoid iterative search algorithms to find the zero-drift point; solve the bottleneck directly using the max-ratio projection $T^* = \max(V_i / w_i)$.


### 2026-10-16: Zero-Build Desktop Execution and `file://` CORS Constraint with ES Modules

- **Date & Context:** 2026-10-16, core shared utilities extraction (`v1.8.1`).
- **Problem:** When designing shared script modules in zero-build static applications, modern JavaScript ES modules (`<script type="module">` or `import ... from ...`) fail with CORS policy errors when users open `index.html` or tool files directly from local storage via `file://` (`xdg-open index.html` / `open index.html`).
- **Resolution:** Implement shared utilities using universal classic scripts (`<script src="js/shared.js"></script>`) wrapped in an IIFE that exports to `window.MoneyApp` as well as backwards-compatible globals (`window.LANG`, `window.formatMoney`, `window.parseNum`, `window.escapeHtml`). Classic script tags are completely immune to `file://` CORS restrictions across Chrome, Firefox, and Safari.
- **Rule:** For privacy-first zero-build static web applications supporting direct `file://` execution, always use classic browser scripts (`<script src="...">`) rather than ES modules (`<script type="module">`) for shared code.





### 2026-10-09: Non-Atomic Template Literal Edits Corrupt Inline Script Blocks

- **Date & Context:** 2026-10-09, adding reorder buttons to 
ebalance.html (1.8.1).
- **Problem:** A multi_replace_file_content edit replaced only the opening portion of a 40-line 
ow.innerHTML template literal, inadvertently closing the template early. The remaining HTML became disconnected raw strings, corrupting the JS. A git checkout -- rebalance.html recovery was required.
- **Rule:** Never split a template literal across multiple replacement chunks. Always replace the entire ariable = backtick...backtick block atomically. If an edit produces a parse error, immediately restore with git checkout -- <file> before further edits.

### 2026-10-09: SDLC Pipeline Was Skipped on Feature Addition

- **Date & Context:** 2026-10-09, reorder buttons feature (1.8.1).
- **Problem:** Agent shipped a feature without running the mandatory Plan -> Human Approval -> Code -> QA -> Security Review -> Release pipeline.
- **Rule Reinforced:** The SDLC pipeline is mandatory for ALL code changes. Level 2 tasks must pause for human approval after the Plan phase. QA must run after every edit.

### 2026-10-16: In-Memory Undo Stack & Safe JSON Deserialization

- **Date & Context:** 2026-10-16, implementing universal undo and crash recovery (`v1.8.5`).
- **Problem:**
  1. Users making accidental row removals, resets, or external JSON/CSV imports had no revert mechanism without manual re-entry.
  2. Malformed or truncated localStorage values could throw uncaught JSON syntax errors, breaking iframe initialization and rendering blank pages.
  3. Linter flagged `noInnerDeclarations` when declaring `var` inside `try`/`if` blocks in classic scripts.
- **Resolution:**
  1. Implemented `MoneyApp.createUndoManager({ maxDepth: 15, enableShortcuts: true, onUndo })` in `js/shared.js`. Keyboard shortcuts safely ignore active inputs (`INPUT`, `TEXTAREA`) to avoid interfering with native typing undo.
  2. Implemented `MoneyApp.safeJsonParse(key, fallback)` which safely intercepts `localStorage` and `JSON.parse` failures, warning to console and returning default state.
  3. Replaced `var` inside `if`/`try` blocks with block-scoped declarations or declared them at function roots to satisfy Biome rules.
- **Rule:** Never use raw `JSON.parse(localStorage.getItem(...))` in client tools; always route through `MoneyApp.safeJsonParse`. For destructive actions (clearing data, deleting items, or importing backups), always push snapshots to `undoMgr` beforehand.

### 2026-10-17: Half-Sum Portfolio Tracking Error Index & Buy-Only DCA Drift Convergence

- **Date & Context:** 2026-10-17, implementing Portfolio Drift & Allocation Deviation Visualizer (`v2.0.0`).
- **Problem:** Investors needed an objective, aggregate metric representing portfolio misallocation (drift) across all assets and tiers before and after monthly top-up injections, without resorting to asset liquidation.
- **Resolution:**
  1. Utilized the Half-Sum Tracking Error Index: $\text{Tracking Error} = \frac{1}{2} \sum_{i} |\text{Current\%}_i - \text{Target\%}_i|$. This measures the exact percentage of the portfolio that must be realigned to achieve target allocations (bounded between 0% and 100%).
  2. For hierarchical 2-tier structures (Buckets -> Assets), the global target allocation is derived via normalized weight tree multiplication: $\text{Target\%} = \frac{W_b}{\sum W} \times \frac{w_a}{\sum w_b} \times 100\%$.
  3. In buy-only DCA water-filling algorithms, the monthly cash top-up is routed strictly to lagging/underweight assets. Mathematically, this guarantees $\text{Post-Tracking Error} \le \text{Pre-Tracking Error}$, providing real-time verification of portfolio convergence.
- **Rule:** When displaying aggregate portfolio drift, use the normalized half-sum index and show both Pre-DCA and Post-DCA metrics to give users immediate feedback on how their monthly budget corrects allocation imbalances.

### 2026-10-17: Cross-Frame Touch Swipe Navigation & False-Positive Suppression

- **Date & Context:** 2026-10-17, implementing Touch Swipe Gesture Navigation across tools (`v2.0.1`).
- **Problem:**
  1. In multi-frame SPA architectures, touch events inside an iframe do not automatically bubble to the parent document, preventing shell navigation tab switches when users swipe on mobile screen content.
  2. Naive horizontal touch listeners trigger accidental tab switches during natural vertical scrolling, pinch-to-zoom, or dragging on range sliders, text inputs, and table cells.
- **Resolution:**
  1. Built a dual-surface listener: `js/shared.js` captures gestures in child iframes and posts `{ action: 'swipeTab', direction: 'next' | 'prev' }` to parent `index.html`, while `index.html` captures gestures directly on `#bottomNav` and shell elements.
  2. Suppressed false positives with a 5-point guardrail:
     - Minimum displacement: $|\Delta X| \ge 60\text{px}$.
     - Maximum perpendicular deviation: $|\Delta Y| \le 50\text{px}$.
     - Horizontal dominance ratio: $|\Delta X| / (|\Delta Y| + 1) \ge 1.7$.
     - Maximum duration: $\le 550\text{ms}$ (filters slow drags / resting fingers).
     - Interactive element exclusion: `input`, `textarea`, `select`, `button`, `[role="slider"]`, `.no-swipe`.
- **Rule:** For iframe-based SPAs, route child touch events via `postMessage` with strict perpendicular displacement filters and interactive element exclusions before triggering tab navigation.

### 2026-10-17: Multi-Series Debt Payoff Amortization Curves & Visual Hierarchy

- **Date & Context:** 2026-10-17, implementing Multi-Series Debt Payoff Amortization Comparison in `debt-calculator.html` (`v2.0.2`).
- **Problem:**
  1. Users could only view one strategy curve at a time, making it impossible to directly compare the payoff velocity and interest slope of Avalanche (interest-minimizing) versus Snowball (behavioral milestone-maximizing) versus Minimum-Only (baseline).
  2. Rendering multiple overlapping curves on mobile SVG viewports risked visual clutter and obscured milestone payoff markers.
- **Resolution:**
  1. Simulated Avalanche, Snowball, and Minimum-Only trajectories concurrently, deriving uniform X/Y bounds from the maximum timeline across all three simulations (`maxMonths = Math.max(simCurrent.months, simMinOnly.months, simAvalanche.months, simSnowball.months, 1)`).
  2. Applied clear visual hierarchy:
     - Primary/Selected strategy: Solid stroke (width 2.6) with shaded area gradient under the curve and prominent circular milestone markers for completed loans.
     - Secondary/Alternative strategy: Dashed stroke (width 1.8, dasharray `5,3`) for immediate visual comparison without conflicting color intensity.
     - Minimum-Only baseline: High-contrast amber dashed stroke (`4,4`, width 1.8, opacity 0.8) displaying the default cost of inaction.
  3. Added a dynamic payoff delta badge summarizing time and interest variance between Snowball and Avalanche based on actual extra payments.
- **Rule:** When comparing multi-trajectory financial curves, normalize axes to the union of all trajectories, highlight the user's active choice with filled gradients and milestone markers, and render counterfactuals with distinct dashed strokes.

### 2026-10-17: Cash Flow Waterfall Stream & Deficit Coordinate Normalization

- **Date & Context:** 2026-10-17, implementing interactive Cash Flow Waterfall Stream diagram in `remaining-money.html` and `js/remaining-money.js` (`v2.0.3`).
- **Problem:**
  1. A simple stacked horizontal bar failed to show the step-down sequence of how gross income gets depleted across deductions, living expenses, and savings before reaching net remaining surplus or deficit.
  2. When living expenses and deductions exceed income (deficit), simple proportions clip or distort, failing to clearly show how far below zero the household budget drops.
- **Resolution:**
  1. Built a closed-loop SVG step-down waterfall engine: Gross Inflow $\to$ Statutory Deductions $\to$ Living Expenses $\to$ Monthly Savings $\to$ Net Surplus/Deficit, connecting consecutive stages with dashed bridge lines at matching balance levels.
  2. Normalized vertical coordinates across both positive and negative ranges: `valMax = Math.max(income, totalOutflow, 1)` and `valMin = Math.min(0, remaining)`. When `valMin < 0`, a prominent dashed zero baseline is rendered with deficit bars extending downward into crimson territory.
  3. Clamped minimum bar height safely (`drawY = Math.min(yTop, height - padding.bottom - barHeight)`) preventing SVG out-of-bounds overflow on zero-delta items.
- **Rule:** For waterfall charts that support deficit scenarios, always include zero in the domain (`valMin = Math.min(0, net)`), render an explicit zero baseline, and clamp minimum-height bars so they do not breach the plot's bottom padding.

### 2026-10-17: Iframe Loading Skeleton, Haptic Feedback & Tab Transition Polish

- **Date & Context:** 2026-10-17, implementing Iframe Loading Skeleton, Haptic Feedback & Keyboard Tab Transitions in `index.html` and `css/theme.css` (`v2.0.4`).
- **Problem:**
  1. Switching between the 7 calculator tools in the shell caused sudden visual flashes while the new iframe rendered its DOM.
  2. Mobile users lacked tactile confirmation when tapping bottom navigation tabs or swiping between screens.
  3. Power users and screen readers had no quick skip-to-content mechanism to bypass the top bar.
- **Resolution:**
  1. Built an animated shimmer loading skeleton overlay inside `.app-viewport` matching system theme tokens (`--panel-2`, `--line`), which automatically activates on tab navigation and fades out smoothly on `frame.onload`.
  2. Wrapped `navigator.vibrate(10)` with safe capability checks (`'vibrate' in navigator`) ensuring subtle haptic feedback on supported mobile devices while failing safely on desktop.
  3. Added an accessible skip-link (`.skip-link`) positioned off-screen that appears cleanly on keyboard `focus`.
- **Rule:** When orchestrating multi-tool iframe shells, always overlay an animated skeleton during frame transitions and guard hardware APIs (like vibration) with feature detection.

### 2026-10-17: Portfolio Allocation Heatmap & Multi-Currency Exposure Matrix

- **Date & Context:** 2026-10-17, implementing Portfolio Allocation Intensity Heatmap & Currency Exposure Matrix in `rebalance.html` and `js/rebalance.js` (`v2.0.5`).
- **Problem:**
  1. Investors with multi-currency assets (e.g. THB cash/bonds, USD global equities, EUR/SGD international funds) could only see aggregate tracking error without insight into foreign exchange risk or home-currency bias.
  2. Text-only drift extreme lists only highlighted the 2 most extreme assets, making it difficult to see overall portfolio balance and concentration clusters at a glance.
- **Resolution:**
  1. Built a multi-segmented stacked currency exposure bar and currency badge breakdown summing THB equivalent values per currency (THB, USD, EUR, GBP, JPY, SGD), highlighting the dominant currency share percentage.
  2. Implemented an adaptive allocation intensity heatmap grid where each asset's tile reflects its deviation intensity (0% to 5%+ deviation scaled to color opacity) and directional status: emerald/ok for balanced (±1%), blue for underweight (priority DCA buy targets), and amber/warn for overweight (over-allocated / paused).
  3. Sanitized all dynamic tooltips and asset names via `escapeAttr()` to maintain strict offline XSS safety.
- **Rule:** When visualizing multi-asset rebalancing states, pair aggregate tracking error metrics with a full-portfolio intensity heatmap and FX currency exposure matrix to provide holistic risk visibility before executing DCA orders.

### 2026-10-17: IndexedDB Storage Adapter, Quota Estimation & Archival Timezones

- **Date & Context:** 2026-10-17, implementing Transparent IndexedDB Storage Adapter & High-Capacity Snapshot Archive in `js/shared.js` and `dashboard.html` (`v2.0.6`).
- **Problem:**
  1. `localStorage` 5MB quota exhaustion looms as users accumulate years of monthly snapshots, debt histories, and calculator states.
  2. In private browsing or sandboxed environments, `window.indexedDB` can throw security errors or be disabled entirely.
  3. When calculating cutoff dates for snapshot archival (e.g. 12 months prior), calling `new Date(year, month - 12, 1).toISOString().slice(0, 10)` in positive timezone offsets (like GMT+7) shifted the UTC date backward by 1 day (e.g. `2025-10-01` local time turned into `2025-09-30` UTC), prematurely moving boundary-day snapshots into the archive.
- **Resolution:**
  1. Built a zero-dependency Promise-based key-value adapter `createIndexedDBAdapter()` in `js/shared.js` with automatic schema versioning, transaction wrapping, and a synchronous in-memory/localStorage fallback layer.
  2. Implemented dual-write background mirroring on `saveSnapshots()` without blocking UI thread rendering.
  3. Formatted cutoff strings using local calendar components (`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`) rather than `.toISOString()`, eliminating timezone boundary shifts.
  4. Enforced an invariant that at least 3 active snapshots remain in primary view even if all snapshots exceed the age cutoff.
- **Rule:** For client-side storage adapters, always pair IndexedDB with a synchronous fallback layer, and never use `.toISOString()` on local midnight dates for temporal boundary partitioning.

### 2026-10-17: Closed-Form Compound Goal Projection & Risk Scenario Simulation

- **Date & Context:** 2026-10-17, implementing Interactive Financial Goal Projection & Compound Scenario Simulator in `dashboard.html` (`v2.0.7`).
- **Problem:**
  1. Financial goal progress bars previously displayed only static percentage completion without indicating estimated time-to-achievement (ETA). Users could not ascertain whether their current savings rate was sufficient to reach their targets.
  2. Wealth milestones grow from both regular contributions and compound investment yields. Using naive linear division $n = (FV - PV) / PMT$ significantly underestimates progress for compound-yielding assets ($r > 0$).
  3. Mathematical edge cases like zero contribution ($PMT = 0$), negative net worth ($PV < 0$), interest decay exceeding savings ($PV \cdot r + PMT \le 0$), or extreme horizons (> 50 years) could produce `NaN`, negative durations, or division-by-zero errors.
- **Resolution:**
  1. Implemented a closed-form compound growth horizon solver:
     $n = \lceil \ln((FV \cdot r + PMT)/(PV \cdot r + PMT)) / \ln(1+r) \rceil$ for $r > 0$, and graceful linear fallback $n = \lceil (FV - PV)/PMT \rceil$ for $r \approx 0$.
  2. Guarded non-positive denominators and logarithmic boundaries, returning `Infinity` when contributions cannot overcome compounding debt or capping horizons at 600 months (50 years).
  3. Added one-click scenario toggle pills (0% Cash, 3% Conservative, 6% Moderate, 9% Aggressive) with live on-card recalculation, alongside custom rate configuration in `#goalsModal`.
  4. Formatted projected completion dates with bilingual Thai Buddhist and English Gregorian calendars (`ต.ค. 2570 (~12 เดือน)` / `Oct 2027 (~12 mos)`).
### 2026-10-17: Accelerated Debt Payoff Lump-Sum Windfall Simulator & Dynamic Visual Overlays

- **Date & Context:** 2026-10-17, implementing Lump-Sum / Bonus Windfall Simulator & Comparative Payoff Visual Overlays in `debt-calculator.html` (`v2.0.8`).
- **Problem:**
  1. Borrowers often receive one-off capital injections (such as annual work bonuses, tax refunds, asset liquidation, or inheritance) and need to simulate how directing this windfall toward debt accelerates their debt-free horizon and saves interest.
  2. Without a baseline comparison curve, users cannot visually perceive the difference between standard monthly payments and the accelerated trajectory resulting from the capital injection.
  3. When injecting a large windfall, the capital may exceed the highest-priority debt's balance. Without cascading logic, excess funds would either be wasted or drive balances into negative numbers.
- **Resolution:**
  1. Enhanced `simulateDebt()` / `simulate()` to accept an optional `windfall = { amount, month }` parameter. When `months === wfMonth`, the windfall amount is added to `totalAvailableBudget` and cascades cleanly across debts sorted by the active strategy (Snowball or Avalanche), preventing negative balances.
  2. Simulated both `simCurrent` (with windfall) and `simBaseline` (without windfall) simultaneously to calculate exact time saved (`monthsSavedWf`) and interest saved (`interestSavedWf`), presenting them in a prominent bilingual impact callout badge.
  3. Extended SVG trajectory rendering to include `simBaseline.months` in coordinate scaling, plot a dashed slate comparative baseline path, and display an interactive purple gift marker (`🎁 +${amount}`) at the exact injection point.
  4. Synchronized windfall inputs on page load (`syncWindfallInputs()`), undo operations (`undoMgr.onUndo`), and state resets (`resetDefaults()`).
- **Rule:** When simulating one-off financial capital injections (windfalls/bonuses), always run comparative dual simulations (with and without windfall) to compute marginal savings, ensure surplus capital cascades properly through the prioritization strategy without negative balances, and render the comparative baseline trajectory on chart overlays.

### 2026-10-17: Asset Allocation & Net Worth Composition Donut / Solvency Ratio Engine

- **Date & Context:** 2026-10-17, implementing Asset Allocation & Net Worth Composition Donut / Solvency Ratio Visualizer in `dashboard.html` (`v2.0.9`).
- **Problem:**
  1. The master dashboard aggregated net worth as a single scalar KPI without visualizing how assets (liquid cash vs investment portfolio) and liabilities (debt) interact.
  2. Users lacked visibility into structural solvency ($NW / A$) and debt leverage ($D / A$), making it difficult to judge whether wealth expansion was accompanied by excessive debt exposure.
  3. Drawing complex SVG charts typically invites hefty external charting libraries, violating ADR-001 (zero-build, zero-CDN privacy architecture).
- **Resolution:**
  1. Built a zero-dependency SVG donut chart using standard `<circle>` elements with geometric `stroke-dasharray` and `stroke-dashoffset` calculated from cash and investment proportions relative to gross assets ($A = C + I$).
  2. Implemented solvency ratio calculation ($NW / A \times 100\%$) and debt-to-asset leverage ($D / A \times 100\%$) alongside dynamic health badges (`ปลอดหนี้ 100% 🎉` / `มั่นคงสูง` / `ปานกลาง` / `หนี้สินสูง`).
  3. Guarded zero gross asset edge cases ($A = 0$) and negative net worth ($NW < 0$) without generating `NaN`, `-0`, or division-by-zero layout bugs.
  4. Added 5 unit tests verifying composition ratios and arc offsets across healthy, leveraged, debt-free, and zero-asset scenarios in `tests/financial-math.test.mjs`.
- **Rule:** When presenting holistic net worth, pair scalar balances with an asset-mix donut and solvency/leverage ratio ($NW / A$ and $D / A$) using native SVG dasharray circles to maintain 100% client-side privacy without external libraries.

### 2026-10-17: Annual Net Take-Home Pay & Bonus Distribution Stream Visualizer

- **Date & Context:** 2026-10-17, implementing 12-Month Net Take-Home Pay & Bonus Distribution Stream Visualizer in `months-slips.html` (`v2.1.0`).
- **Problem:**
  1. Thai payslip calculations are typically computed as isolated monthly static snapshots. Users could not easily visualize how annual bonuses, progressive PIT brackets, Provident Fund (PVD), and Social Security (SSO) distribute throughout the calendar/fiscal year.
  2. Bonuses are paid in specific months (commonly December or custom fiscal months like March or April), causing major net cashflow spikes that impact personal budgeting and tax withholding planning.
  3. SVG bar charts with stacked segments (Net Pay, Bonus, PVD, SSO, Tax) require coordinate precision and clean mobile-friendly tooltips without layout overflow.
- **Resolution:**
  1. Created `calculateAnnualPayrollStream()` engine that calculates 12-month payroll streams with customizable bonus disbursement months, accounting for progressive Thai Personal Income Tax (PIT) withholding, Social Security caps, and PVD deductions.
  2. Implemented a zero-dependency SVG stacked column chart in `months-slips.html` with color-coded segments: Emerald for regular net take-home, Purple for bonus surge, Blue for PVD, Amber for SSO, and Rose for Tax.
  3. Added interactive hover tooltips that clamp coordinates dynamically within the SVG container width (`Math.min(rect.width - 200, Math.max(10, x - 80))`), preventing horizontal overflow on mobile viewports.
  4. Added prominent Total Annual Net Take-Home Pay KPI badge with full bilingual Thai/English localization and state persistence in `localStorage`.
  5. Added 4 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying 12-month stream allocation, December and custom fiscal-year bonus payout months, total annual net reconciliation, and SVG coordinate bounds.
- **Rule:** When calculating payroll slips, complement the single-month snapshot with a 12-month stacked net cashflow stream that highlights annual bonus distribution and full-year net take-home pay, ensuring stacked SVG columns correctly scale to the peak monthly gross income.

### 2026-10-17: Tax Deduction Capacity Room & Marginal Tax Savings Simulator

- **Date & Context:** 2026-10-17, implementing Tax Deduction Optimization Capacity Room & What-If Marginal Savings Simulator in `tax-calculator-base.html` (`v2.1.1`).
- **Problem:**
  1. Thai taxpayers often underutilize available tax-saving allowances (ThaiESG, SSF/RMF, Life Insurance, Easy E-Receipt) because legal rules have complex overlapping sub-caps (e.g. 500k combined retirement pool with PVD; ThaiESG 300k capped at 30% of income).
  2. Users lack intuitive visibility into their marginal tax bracket return (guaranteed tax ROI on investment) and cannot easily test "what-if" amounts before committing funds.
  3. When applying simulated optimizations, changing one field could overwrite existing inputs without the ability to cleanly revert to original numbers or undo via the global undo manager.
- **Resolution:**
  1. Implemented `calculateTaxOptimizationRoom()` engine computing utilized and remaining legal capacity across 4 statutory categories: ThaiESG (300k / 30% cap), Retirement Bundle (500k combined ceiling with PVD), Life & Health Insurance (100k cap), and Easy E-Receipt (50k cap).
  2. Built visual capacity progress meters with percentage fills, clear utilized/limit readouts, and remaining quota badges in `tax-calculator-base.html`.
  3. Added an interactive What-If simulation playground with quick simulation pills (+10k, +30k, +50k, +100k, Max Room) dynamically calculating new taxable net income, tax savings, and guaranteed tax ROI percentage.
  4. Implemented `applyCurrentSimulation()` distributing extra funds prioritized by ThaiESG -> SSF/RMF -> Insurance -> Easy E-Receipt, with full snapshot state capture for undo (`Ctrl+Z`) and dedicated revert button.
  5. Added 4 unit tests in `tests/financial-math.test.mjs` verifying category capacity limits, income percentage capping, marginal ROI, and total room bounds.
- **Rule:** When advising on progressive personal income tax deductions, pair remaining legal allowance meters with an interactive What-If simulator and marginal ROI badge, ensuring extra funds cascade through statutory priority buckets and original user inputs can be safely reverted.

### 2026-10-17: 50/30/20 Budget Rule Compliance Donut & Financial Runway Health Score Visualizer

- **Date & Context:** 2026-10-17, implementing 50/30/20 Budget Rule Compliance Donut & Financial Runway Visualizer in `remaining-money.html` (`v2.1.2`).
- **Problem:**
  1. The Remaining Money / Monthly Cashflow tool provided a raw waterfall and proportion bar of gross income versus expenses, but lacked high-level strategic financial hygiene benchmarks like the classic 50/30/20 budget framework (50% Needs, 30% Wants, 20% Savings/Investments).
  2. Expenses in personal budgeting are often recorded with Thai or English natural names (e.g. `ผ่อนบ้าน`, `ค่าไฟ`, `กินข้าวนอกบ้าน`, `กาแฟ`). Thai keyword collisions (such as `กินข้าวนอกบ้าน` containing `บ้าน` / home) can cause dining out to be erroneously classified as a basic Need rather than a discretionary Want.
  3. Visualizing 3 contiguous circular segments in a native zero-dependency SVG donut chart requires exact trigonometry and cumulative stroke-dashoffsets to prevent gaps or overlapping strokes.
- **Resolution:**
  1. Built `classifyBudgetType(item, defaultType)` with explicit keyword priority: checking discretionary Wants keywords first before essential Needs keywords, and guarding substring overlaps like `'บ้าน'` with `!name.includes('นอกบ้าน')`.
  2. Implemented `calculateBudgetRule503020()` computing total and percentage allocations across Needs, Wants, and Savings relative to total net income, alongside health compliance classifications (`balanced`, `high_needs`, `high_wants`, `low_savings`).
  3. Created native SVG donut chart with three `<circle>` elements using radius $r = 70$ (circumference $C \approx 439.82$) and negative cumulative offsets (`needsOffset = 0`, `wantsOffset = -needsArc`, `savingsOffset = -(needsArc + wantsArc)`), paired with a central dynamic compliance badge and 3 category benchmark progress cards.
  4. Integrated emergency runway duration directly into the 50/30/20 visualizer with color-coded safety tiers (< 3 mos Danger, 3–6 mos Healthy, > 6 mos Solid).
  5. Added 4 automated unit tests in `tests/financial-math.test.mjs` verifying classification accuracy, balanced/unbalanced states, SVG arc math, and runway safety tiers.
- **Rule:** When auto-classifying natural language expenses into financial planning categories (Needs vs. Wants), prioritize specific discretionary/entertainment keywords before broad basic-need keywords, and construct multi-segment SVG donuts with negative cumulative stroke offsets to ensure seamless circular arcs without external libraries.

### 2026-10-17: Interactive Debt Consolidation & Refinance Interest Savings Engine

- **Date & Context:** 2026-10-17, implementing Interactive Debt Consolidation & Refinance Simulator in `debt-calculator.html` (`v2.1.3`).
- **Problem:**
  1. Borrowers managing multiple debts (such as credit cards at 16% and personal loans at 18–25%) lack clarity on their true blended APR ($\bar{r} = \sum B_i r_i / \sum B_i$) and often struggle to evaluate whether refinancing into a single consolidated personal/installment loan saves money.
  2. Simply comparing interest rates can mislead borrowers: refinancing to a lower APR (e.g., 9.9% vs 18%) but stretching the amortization term excessively (e.g., to 60 months) can paradoxically increase the *total interest paid* over the life of the loan.
  3. Borrowers need immediate visibility into two distinct financial dimensions: long-term total interest savings ($\Delta I$) and short-term monthly cash flow relief ($\Delta PMT$).
- **Resolution:**
  1. Built `calculateDebtConsolidation()` engine computing combined debt balance, weighted average baseline APR, monthly installment $PMT$ via standard amortization formula $PMT = \frac{B \cdot (r/12)}{1 - (1 + r/12)^{-n}}$, total refinance interest, and net savings deltas.
  2. Implemented intelligent multi-tier financial verdicts:
     - `optimal`: Both saves total interest ($\Delta I > 0$) and lowers monthly payment ($\Delta PMT \ge 0$).
     - `faster_payoff`: Saves substantial interest ($\Delta I > 0$) by paying slightly more each month ($\Delta PMT < 0$) over a compressed timeline.
     - `higher_interest`: Warns when stretching the loan term results in higher total interest despite a lower nominal rate.
  3. Integrated dedicated UI panel in `debt-calculator.html` with toggle switch, weighted APR readout, quick-select term pills (12m, 24m, 36m, 48m, 60m), real-time comparison cards, and full undo stack integration (`Ctrl+Z`).
  4. Added 5 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying weighted rate math, amortization payments, monthly cash flow differences, and term-stretching warnings.
- **Rule:** When modeling debt consolidation loans, always evaluate both total lifetime interest savings ($\Delta I$) and monthly cash flow delta ($\Delta PMT$), and provide an explicit warning badge if an extended repayment duration inflates total interest despite a lower headline interest rate.

### 2026-10-17: Financial Independence & Early Retirement (FIRE) Safe Withdrawal & Target Net Worth Visualizer

- **Date & Context:** 2026-10-17, implementing FIRE Safe Withdrawal & Target Net Worth Visualizer in `dashboard.html` (`v2.1.4`).
- **Problem:**
  1. The master financial dashboard tracked individual wealth goals (Emergency Fund, static Net Worth milestone, and Debt-Free countdown), but lacked a holistic milestone metric for Financial Independence and Early Retirement (FIRE) based on real-world living expenses.
  2. Users adjust to different risk tolerances regarding Safe Withdrawal Rates (SWR): conservative retirees prefer 3.0%–3.5% (28.6x–33.3x expenses), while classic Trinity Study adherents use 4.0% (25x expenses). Hardcoding a single rate restricts personalization.
  3. Achieving full financial independence is a multi-year journey; without sub-milestones (such as Lean FIRE at 75% or Fat FIRE at 125%), users lack psychological momentum during the accumulation phase.
- **Resolution:**
  1. Built `calculateFIREMetrics()` engine computing target FIRE wealth thresholds: $\text{FIRE Number} = \text{Annual Expenses} / \text{SWR}$, auto-linking annual living expenses from `remainingMoneyCalculator.state.v1` ($12 \times \text{monthlyExpense}$) with optional manual override in `#goalsModal`.
  2. Defined clear milestone spectrum tiers:
     - `accumulating`: Building foundation (< 50% of target).
     - `halfway_fire`: 50% to 74% of target.
     - `lean_fire`: 75% to 99% of target (covers basic living needs).
     - `standard_fire`: 100% to 124% of target (full current lifestyle covered indefinitely by 4% rule).
     - `fat_fire`: 125%+ of target (abundant lifestyle buffer).
  3. Integrated interactive SWR selection pills (3.0%, 3.5%, 4.0%) with live recalculation, dual-gradient progress bar, Safe Annual Passive Income readout ($NW \times \text{SWR}$), and projected years-to-freedom timeline (ETA) calculated via logarithmic compound growth.
  4. Added 5 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying milestone brackets, SWR sensitivity, compound horizon solver, and zero-expense edge cases.
- **Rule:** When visualizing financial independence (FIRE), calculate target net worth directly from annualized living expenses across selectable Safe Withdrawal Rates (3.0%–4.0%), pair the primary target with interim milestone brackets (Lean vs Standard vs Fat FIRE), and calculate projected completion timelines using compound yield on monthly investment contributions.


### 2026-10-17: Annual Tax Withholding (50 Tawi) vs PIT Liability Refund & Additional Payable Estimator

- **Date & Context:** 2026-10-17, implementing Withholding Tax (50 Tawi) & Net Balance Estimator in `tax-calculator-base.html` (`v2.1.5`).
- **Problem:**
  1. Personal Income Tax (PIT) calculators calculate annual tax liability, but users file taxes by comparing their calculated liability against the tax already withheld at source throughout the year (ภาษีหัก ณ ที่จ่าย / ใบ 50 ทวิ).
  2. Salaried taxpayers often find that additional deductions (SSF, RMF, ThaiESG, life insurance, home loan interest, Easy E-Receipt) reduce their final tax liability below what their employer withheld on monthly payslips, entitling them to a tax refund (ขอคืนภาษี). Without an explicit Withholding Tax input and refund breakdown, users had to calculate their expected refund manually.
  3. Taxpayers owing additional tax (ชำระภาษีเพิ่ม) often do not know that the Thai Revenue Department allows interest-free 3-month installments when outstanding tax is 3,000 THB or higher.
- **Resolution:**
  1. Added Withholding Tax at Source (ใบ 50 ทวิ) input field with one-click inter-tool bridge (`importWithholdingFromPayslip()`) auto-calculating annual cumulative tax withheld from `moneySuperapp.monthsSlips`.
  2. Built `calculateTaxRefundOrPayable()` computing:
     $$\text{Net Balance} = \text{Withheld Tax (50 Tawi)} - \text{Calculated PIT Liability}$$
     - `refund` ($\text{Net Balance} > 0$): Renders green badge and card with PromptPay 13-digit National ID advice for direct deposit refund.
     - `payable` ($\text{Net Balance} < 0$): Renders amber badge and card with 3-month interest-free installment schedule ($\text{Installment} = \lceil\text{Amount} / 3\rceil$) when $\ge 3,000$ THB.
     - `exact` ($\text{Net Balance} = 0$): Confirms balanced state.
  3. Integrated Withholding Tax and Net Return Balance directly into the print-ready Form P.N.D. 90/91 table and full undo/redo state preservation.
  4. Added 6 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying refund, payable, 3-installment rules, edge cases, and payslip integration (expanding test suite to 123 passing tests).
- **Rule:** In tax planning tools, always pair calculated gross tax liability with tax withheld at source (50 Tawi) to reveal the actual filing outcome (Refund vs Payable), bridge cumulative withholding from payroll records, and provide actionable localized compliance guidance (PromptPay direct deposit vs 3-month interest-free installment plans).


### 2026-10-17: Recurring Budget Templates & Monthly Expense Category Profile Presets

- **Date & Context:** 2026-10-17, implementing Budget Presets & Quick Template Switcher in `remaining-money.html` and `js/remaining-money.js` (`v2.1.6`).
- **Problem:**
  1. Users frequently re-entered or manually adjusted repetitive monthly expenses across changing real-world life scenarios (such as an ultra-frugal savings sprint month vs a high-discretionary holiday/vacation month vs standard baseline).
  2. Switching whole budget states without immediate visual feedback or undo safety risked overriding carefully tuned personal budgeting entries.
- **Resolution:**
  1. Built a responsive **Quick Budget Template Presets Bar** directly above the summary strip in `remaining-money.html`, offering one-click scenario switching (`First Jobber 25k`, `Frugal 35k`, `Holiday 45k`, `50/30/20 Rule 50k`, `Family 60k`) with active pill highlighting.
  2. Expanded `BUDGET_PRESETS` with specialized life scenarios (`preset-frugal` with 43% savings rate, `preset-holiday` with realistic vacation allowances, and `preset-503020` hitting mathematically balanced Needs/Wants/Savings).
  3. Linked active template state (`activeTemplateId`) into `captureSnapshot` and `restoreSnapshot`, ensuring full Ctrl+Z undo/redo fidelity across template transitions.
  4. Added 4 automated unit tests in `tests/financial-math.test.mjs` verifying schema validation, savings rate assertions, edge cases, and custom template serialization (**127 automated tests passing, 0 Biome linter errors**).
- **Rule:** When adding template/preset profile switchers to budgeting applications, provide a persistent top-level quick switcher for primary scenarios, bind template IDs into undo snapshots so reverting preserves active highlights, and mathematically validate template category distributions against budgeting benchmarks (e.g. 50/30/20).





