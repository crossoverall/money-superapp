# Architecture

> Verified architecture of Money Superapp. Source code is the ultimate source of truth.

---

## 1. System Overview

- **Archetype:** Client-Side Single-Page Application (SPA) / Progressive Web App (PWA) / Multi-Tool Suite.
- **Purpose:** All-in-one personal finance calculator and planning suite specifically adapted for Thai financial regulations (Revenue Department tax brackets, Thai Labor Protection Act severance tiers, Social Security SSO ceilings, Provident Fund PVD limits, ThaiESG/SSF/RMF investments, Snowball/Avalanche debt payoff).
- **Core Philosophy:** 100% Offline-First & Client-Side Privacy. No backend server, no database, no third-party CDNs, and no network transmission of user financial data.
- **Evidence:** [`README.md`](file:///home/l2okii/Documents/money-superapp/README.md), [`manifest.json`](file:///home/l2okii/Documents/money-superapp/manifest.json), [`sw.js`](file:///home/l2okii/Documents/money-superapp/sw.js).
- **Confidence:** `HIGH`

---

## 2. Component Architecture & Topology

Money Superapp uses a decoupled **Iframe Shell & Multi-Document Architecture**:

```
+--------------------------------------------------------------------------------+
|                        App Shell (index.html)                                  |
|  - Desktop Top Navigation (.top-nav) & Mobile Bottom Navigation (.bottom-nav)   |
|  - Language Switcher (TH / EN) & Theme Switcher (Light / Dark)                 |
|  - Settings & Privacy Modal (JSON Backup Export / Import / Master Reset)        |
|  - Service Worker Registration & URL Hash Sync                                 |
+--------------------------------------------------------------------------------+
                                       |
                   <iframe> embeds active tool (?v=1.3.15)
                                       v
+--------------------------------------------------------------------------------+
|  1. Financial Dashboard             (dashboard.html)          [KPIs, Trend SVG] |
|  2. Rebalance Calculator            (rebalance.html)          [DCA Donut Chart] |
|  3. Payslip Simulator               (months-slips.html)       [PDF / Print]     |
|  4. Personal Income Tax             (tax-calculator-base.html)[Bracket Advisor] |
|  5. Severance & PVD Tax             (tax-calculator.html)     [Sec 48(5)]       |
|  6. Remaining Money (Cash Flow)     (remaining-money.html)    [Runway & Bridge] |
|  7. Debt Payoff Planner             (debt-calculator.html)    [Amortization]    |
+--------------------------------------------------------------------------------+
                                       |
                   Reads / Writes decoupled state & bridges
                                       v
+--------------------------------------------------------------------------------+
|                          Browser localStorage                                  |
|  Global: moneySuperapp.lang, moneySuperapp.theme, moneySuperapp.activeTab      |
|  Tools:  *.state.v1, moneySuperapp.taxBase, moneySuperapp.monthsSlips, etc.   |
|  Bridge: moneySuperapp.pendingBudget, pendingSlipImport, pendingLumpSum       |
+--------------------------------------------------------------------------------+
```

### Major Building Blocks

1. **App Shell (`index.html`)**
   - Renders top navigation for desktop ($\ge 769\text{px}$) and bottom navigation for mobile ($\le 768\text{px}$).
   - Controls global settings (language `TH`/`EN`, theme `light`/`dark`).
   - Hosts tool pages within `<iframe id="app" src="dashboard.html">`.
   - Listens for child `postMessage` calls to switch tabs or handle keyboard shortcuts.
   - Provides global JSON data backup export, restore import, and master data wipe.

2. **Unified Dashboard (`dashboard.html`)**
   - Read-only aggregation engine: pulls state from `rebalanceCalculator.state.v1`, `remainingMoneyCalculator.state.v1`, `moneySuperapp.taxBase`, and `moneySuperapp.debtCalculator.state.v1`.
   - Calculates consolidated KPIs: Net Worth (`(Portfolio + Reserve) - Debt`), Savings Rate %, Emergency Runway months, Debt balance, Top Marginal Tax bracket.
   - Saves historical monthly snapshots to `moneySuperapp.historicalSnapshots.v1`.
   - Renders interactive multi-metric trend charts via native inline `<svg>`.

3. **Portfolio Rebalancing Calculator (`rebalance.html`)**
   - Manages asset allocation buckets (e.g. Core, Ballast, Satellite) and target percentages.
   - Calculates monthly DCA distribution and rebalance shortfalls.
   - Renders target vs actual portfolio distribution using SVG donut charts.
   - Persists state in `rebalanceCalculator.state.v1`.
   - Listens for bridged investment amounts from `moneySuperapp.pendingBudget`.

4. **Payslip Simulator (`months-slips.html`)**
   - Simulates monthly payroll: gross salary, taxable allowances, bonus, withholding tax, Social Security (SSO) with selectable caps (750 / 875 / 1000 / 1150 THB), and Provident Fund (PVD).
   - Includes side-by-side job offer compensation comparison.
   - Provides print-friendly stylesheet for payslip generation.
   - Persists in `moneySuperapp.monthsSlips`.
   - Offers explicit bridge button to export net salary & deductions to Remaining Money (`moneySuperapp.pendingSlipImport`).

5. **Personal Income Tax Estimation (`tax-calculator-base.html`)**
   - Implements full Thai Revenue Department progressive PIT brackets (0% up to 35%).
   - Supports Monthly mode or Yearly income mode (with 12-month breakdown input grid).
   - Deductions: Personal expense (50% max 100k), personal allowance (60k), PVD, SSO, ThaiESG (max 300k), SSF/RMF (max 500k combined), Easy E-Receipt (50k), insurance, mortgage interest.
   - Tax Optimization Advisor: computes exact additional investment needed in ThaiESG/SSF/RMF to drop down one tax bracket and calculates tax savings ROI.
   - Persists state in `moneySuperapp.taxBase`.

6. **Severance & PVD Tax Calculator (`tax-calculator.html`)**
   - Labor Protection Act severance calculation based on service tenure (30, 90, 180, 240, 300, 400 days).
   - Special Section 48(5) Thai Revenue Code tax calculation for employment termination lump sums separate from regular income.
   - Persists state in `moneySuperapp.pvdTax`.
   - Offers explicit bridge button to transfer net severance payout into Remaining Money (`moneySuperapp.pendingLumpSum`).

7. **Remaining Money & Cash Flow (`remaining-money.html`)**
   - Monthly cash flow budgeting: Incomes, Fixed Expenses, Variable Expenses, Dedicated Savings, and Investable Remaining Surplus.
   - Emergency runway calculator (months of expenses covered by reserve).
   - Bidirectional data portability:
     - **Export:** CSV download (with UTF-8 BOM and CWE-1236 neutralization), pretty-printed JSON download, formatted clipboard cash flow summary, and print/PDF view.
     - **Import:** JSON and CSV file import with interactive preview modal supporting both "Replace" and "Merge" modes, keyword heuristics, non-negative clamping, rate boundary validation, and full ARIA accessibility.
   - Persists state in `remainingMoneyCalculator.state.v1` and `remainingMoneyCalculator.pvdPercent`.
   - Ingests incoming bridges (`pendingSlipImport` from Payslip, `pendingLumpSum` from PVD).
   - Offers bridge button to send remaining surplus into Rebalance DCA budget (`moneySuperapp.pendingBudget`).

8. **Debt Payoff Calculator (`debt-calculator.html`)**
   - Simulates debt elimination using Snowball (smallest balance first) and Avalanche (highest interest rate first).
   - Implements minimum payment rollover: when an account is cleared, its minimum payment automatically rolls into the payoff pool for remaining debts.
   - Month-by-month 30-year amortization schedule, interest saved comparison, and debt-free milestone dates.
   - Persists state in `moneySuperapp.debtCalculator.state.v1`.
   - Includes explicit "Import Savings" button to pull monthly savings from `remainingMoneyCalculator.state.v1`.

9. **Offline CSS & Assets (`css/tailwind-lite.css`, `icon.svg`, `manifest.json`)**
   - Standalone utility CSS eliminating external CDN dependencies.
   - Manifest and vector SVG icons enabling installable PWA behavior across platforms.

10. **Service Worker (`sw.js`)**
    - Intercepts GET requests, precaches all application files during install, cleans old caches on activation, and serves cached responses using stale-while-revalidate for local assets.

- **Confidence:** `HIGH` (Directly verified across all 8 HTML files and assets)

---

## 3. Runtime Architecture & Execution Model

- **Process Model:** Pure client-side browser runtime. Zero background daemons, zero Node.js server processes, zero API backend.
- **Packaging & Delivery:** Static asset delivery via HTTP/HTTPS or local `file://` scheme.
- **Navigation Lifecycle:**
  1. User accesses `index.html`.
  2. Shell initializes global language and theme from `localStorage`.
  3. Active tab is resolved from URL hash (`#dashboard`, `#rebalance`, etc.), falling back to `moneySuperapp.activeTab` or default `'dashboard'`.
  4. The shell sets `iframe.src = targetSrc + '?v=' + versionMeta` (query string cache-busting).
  5. URL hash updates dynamically to enable browser back/forward history navigation.
- **Inter-Component Communication (Shell $\leftrightarrow$ Iframe):**
  - **Child $\to$ Parent:** Tools communicate with the shell via `window.parent.postMessage({ action: 'switchToTab', target: ... }, '*')` or `{ action: 'shortcutKey', key: ... }`.
  - **Keyboard Shortcuts:** Alt+1 through Alt+7 trigger tab switching globally; keydown events inside iframes are intercepted and forwarded to the parent shell.
- **Service Worker Lifecycle:**
  - Registered on page load.
  - Updates triggered on navigation; `skipWaiting()` and `clients.claim()` activate new versions immediately.
  - Controller change triggers parent shell iframe reload.
- **Confidence:** `HIGH` (Verified in `index.html` lines 574-684 and tool scripts)

---

## 4. Primary Execution / Data Flow

### 4.1 Application Initialization Flow
```
User navigates to index.html
       │
       ▼
Read localStorage ('moneySuperapp.lang', 'moneySuperapp.theme', 'moneySuperapp.activeTab')
       │
       ▼
Apply theme to shell DOM & update navigation labels
       │
       ▼
Set <iframe id="app" src="[tool].html?v=[version]">
       │
       ▼
Register Service Worker (sw.js)
       │
       ▼
Iframe loads tool HTML:
  1. Reads 'moneySuperapp.lang' & 'moneySuperapp.theme' from localStorage
  2. Applies data-theme attribute on <html> and localized text strings
  3. Reads tool-specific state key from localStorage (e.g. 'rebalanceCalculator.state.v1')
  4. Runs calculation engine and updates DOM / SVG charts
```

### 4.2 Decoupled Cross-Tool Data Bridge Flow
```
[ Payslip Simulator ]                [ Severance / PVD ]
         │                                    │
(User clicks "Send to Remaining")    (User clicks "Send Lump-Sum")
         │                                    │
         ▼                                    ▼
localStorage.setItem                 localStorage.setItem
('moneySuperapp.pendingSlipImport')  ('moneySuperapp.pendingLumpSum')
         │                                    │
         └─────────────────┬──────────────────┘
                           ▼
               [ Remaining Money Tool ]
             - Ingests pending keys on load
             - Removes pending keys from localStorage
             - Updates monthly budget & savings
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
(User clicks "Send to DCA")             [ Debt Payoff Planner ]
       │                                       │
localStorage.setItem                     (User clicks "Import Savings")
('moneySuperapp.pendingBudget')                 │
       │                                       ▼
       ▼                                 Reads 'remainingMoneyCalculator.state.v1'
[ Rebalance Calculator ]                 Injects extra monthly payment into payoff pool
- Ingests budget into DCA input
- Removes pendingBudget key
```

### 4.3 Consolidated Dashboard Flow
```
dashboard.html loads
       │
       ▼
gatherFinancialProfile() reads (Read-Only):
  - 'rebalanceCalculator.state.v1' (Portfolio Value)
  - 'remainingMoneyCalculator.state.v1' (Incomes, Expenses, Savings, Runway)
  - 'moneySuperapp.taxBase' (Taxable Income, Top Marginal Bracket)
  - 'moneySuperapp.debtCalculator.state.v1' (Total Debt Balance)
       │
       ▼
Calculates Net Worth, Total Savings Rate, Emergency Runway
       │
       ▼
Renders KPI Cards & SVG Historical Growth Trends
       │
       ▼
(Optional) User clicks "Take Snapshot" ──► Appends to 'moneySuperapp.historicalSnapshots.v1'
```

- **Confidence:** `HIGH` (Directly verified in `dashboard.html`, `debt-calculator.html`, `remaining-money.html`, `rebalance.html`)

---

## 5. Security, Authentication & Authorization

- **Authentication / Authorization:** `N/A - Standalone / No Auth Required`.
- **Privacy Boundary:** 100% Client-Side. No telemetry, tracking beacons, analytics scripts, or remote logging. All calculations execute locally.
- **Input Sanitization & XSS Mitigation:**
  - Input fields use `parseFloat(clean) || 0` after stripping commas.
  - Dynamic user-supplied strings (such as debt account names) are sanitized using `escapeHtml()` prior to insertion into innerHTML templates.
  - Inline scripts and resources are completely self-hosted, avoiding third-party script tampering.
- **Confidence:** `HIGH` (Verified in all HTML tool files)

---

## 6. Data Architecture & Persistence

### Persistence Mechanism
Browser `localStorage` storing JSON-serialized string values.

### Storage Key Registry

| Key | Format | Owner / Usage |
|---|---|---|
| `moneySuperapp.lang` | String (`"th"` \| `"en"`) | Shell: Global language setting |
| `moneySuperapp.theme` | String (`"light"` \| `"dark"`) | Shell: Global color scheme |
| `moneySuperapp.activeTab` | String (`"dashboard"`, `"rebalance"`, etc.) | Shell: Last active navigation tab |
| `moneySuperapp.historicalSnapshots.v1` | JSON Array of snapshot objects | Dashboard: Monthly net worth & savings records |
| `rebalanceCalculator.state.v1` | JSON Object (`monthlyBudget`, `buckets`) | Rebalance: DCA portfolio allocation |
| `moneySuperapp.monthsSlips` | JSON Object (`salary`, `allowance`, `bonus`, `pvd`, `ssoCap`) | Payslips: Payroll simulation state |
| `moneySuperapp.taxBase` | JSON Object (income, deductions, modes, breakdown) | Income Tax: PIT simulation state |
| `moneySuperapp.pvdTax` | JSON Object (tenure, severance, PVD contributions) | PVD Tax: Section 48(5) simulation |
| `remainingMoneyCalculator.state.v1` | JSON Object (`incomes`, `expenses`, `savings`, `emergencyReserve`) | Remaining: Cash flow budget state |
| `remainingMoneyCalculator.pvdPercent` | Number / String | Remaining: Cached PVD contribution rate |
| `moneySuperapp.debtCalculator.state.v1` | JSON Object (`strategy`, `extraPayment`, `debts`) | Debt: Payoff accounts & strategy |
| `moneySuperapp.pendingBudget` | Number / String | Ephemeral Bridge: Remaining $\to$ Rebalance |
| `moneySuperapp.pendingSlipImport` | JSON Object | Ephemeral Bridge: Payslip $\to$ Remaining |
| `moneySuperapp.pendingLumpSum` | JSON Object | Ephemeral Bridge: PVD $\to$ Remaining |

### Backup, Restore & Reset
- Implemented in `index.html` modal:
  - **Export:** Serializes all keys prefixed with `moneySuperapp.`, `remainingMoneyCalculator.`, or `rebalanceCalculator.` into a downloadable JSON file.
  - **Import:** Reads JSON backup, populates `localStorage`, and reloads the iframe.
  - **Master Reset:** Clears all matching application keys and resets defaults.
- **Confidence:** `HIGH` (Verified in `index.html` lines 499-566)

---

## 7. External Integrations & Boundary Interfaces

- **External Services / APIs:** `N/A - Fully Self-Contained`. Zero external network calls.
- **Browser APIs Utilized:**
  - `localStorage` (Persistent state)
  - `ServiceWorker` & `CacheStorage` (Offline caching and PWA installation)
  - `navigator.clipboard.writeText` (Copy plan summary to clipboard)
  - `window.print` (Printable payslip export)
  - `window.postMessage` (Cross-frame coordination)
  - `FileReader` & `Blob` / Object URL (Backup JSON import/export, Remaining Money JSON/CSV import/export)
- **Confidence:** `HIGH` (Directly verified in source code)

---

## 8. Deployment Architecture

- **Hosting:** Any static file server or CDN (GitHub Pages, Cloudflare Pages, Vercel Static, Nginx, Apache, or local `python3 -m http.server`).
- **Cache Invalidation:**
  - Automated version bumping via `scripts/bump.mjs`.
  - Service Worker cache name is versioned (`const CACHE_NAME = 'money-superapp-v' + newVersion`).
  - Shell appends `?v=<version>` query parameter to child iframe URLs to prevent browser-level iframe caching.
- **Confidence:** `HIGH` (Verified in `scripts/bump.mjs`, `sw.js`, and `index.html`)

---

## 9. Important Dependencies & Tooling

- **Runtime Dependencies:** 0 (Zero external libraries; no React, Vue, jQuery, Chart.js, or lodash).
- **Styling:** Custom offline utility classes (`css/tailwind-lite.css`).
- **Maintenance Tooling:**
  - `scripts/bump.mjs`: Node.js ES module script for semantic version bumping across HTML meta tags, badges, SW cache names, and `README.md`.
- **Confidence:** `HIGH` (Verified via repository scan)

---

## 10. Known Unknowns

- **Automated Test Suite:** `UNKNOWN`. There are no automated unit or integration test configurations (`package.json`, Jest, Vitest, Playwright, or Cypress) in the repository. Testing is currently performed via manual browser verification.
- **Linter / Formatter Configuration:** `UNKNOWN`. No `.eslintrc`, `biome.json`, or `.prettierrc` files exist.

---

## Evidence & Confidence Index

| Aspect | Verification Source | Confidence |
|---|---|---|
| SPA & PWA Archetype | [`index.html`](file:///home/l2okii/Documents/money-superapp/index.html), [`sw.js`](file:///home/l2okii/Documents/money-superapp/sw.js), [`manifest.json`](file:///home/l2okii/Documents/money-superapp/manifest.json) | `HIGH` |
| Zero-build Vanilla JS Stack | Directory layout, absence of `package.json`, source files | `HIGH` |
| 7 Independent Tools | [`dashboard.html`](file:///home/l2okii/Documents/money-superapp/dashboard.html), [`rebalance.html`](file:///home/l2okii/Documents/money-superapp/rebalance.html), [`months-slips.html`](file:///home/l2okii/Documents/money-superapp/months-slips.html), [`tax-calculator-base.html`](file:///home/l2okii/Documents/money-superapp/tax-calculator-base.html), [`tax-calculator.html`](file:///home/l2okii/Documents/money-superapp/tax-calculator.html), [`remaining-money.html`](file:///home/l2okii/Documents/money-superapp/remaining-money.html), [`debt-calculator.html`](file:///home/l2okii/Documents/money-superapp/debt-calculator.html) | `HIGH` |
| Decoupled Bridge Architecture | Commit `84b16d5`, button event listeners in tool files | `HIGH` |
| LocalStorage Schema | Storage calls across all 8 HTML files | `HIGH` |
| Version Bumping Script | [`scripts/bump.mjs`](file:///home/l2okii/Documents/money-superapp/scripts/bump.mjs) | `HIGH` |
| Automated Test Runner | Absense of test files/scripts | `UNKNOWN` |
