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

### 2026-10-29: Goal-Based Savings Planner UI & Cash Flow Surplus Bridge (Phase 145 / v2.6.6)
- **Date & Context:** 2026-10-29, Pillar 2.1 Goal-Based Savings Planner UI & Cross-Tool Bridge (`v2.6.6`).
- **Problem:**
  - Following the creation of the mathematical calculation engine (`MoneyApp.SavingsGoals`), users required an interactive UI in `dashboard.html` to visualize their goals, add/edit target accounts, and simulate multi-goal monthly surplus allocation.
  - Users calculating monthly cash flow surplus in `remaining-money.html` had no explicit, decoupled mechanism to bridge investable remaining funds into their savings targets without manual typing.
- **Solution & Invariants:**
  1. **Dashboard Goal Tracker (`#savingsGoalsSection`):**
     - Renders active sinking-fund goals with category emojis, priority tags, progress percentage, current vs target amounts, timeline horizon, and required monthly contributions.
     - Implemented `#goalEditorModal` supporting add, edit, and delete operations with live persistence to `moneySuperapp.savingsGoals.v1`.
     - Integrated interactive strategy selector (`priority`, `proportional`, `balanced`) and allocation simulator with strict capital conservation feedback.
  2. **Cross-Tool Decoupled Bridge (Bridge 13):**
     - Registered `savings_goals_budget` in `js/engines/bridge.js` `LEGACY_ACTION_MAP` targeting `dashboard` and key `moneySuperapp.pendingGoalsBudget`.
     - Added `#btnBridgeSurplusGoals` in `remaining-money.html` dispatching available cash flow surplus via `MoneyApp.Bridge.send('dashboard', 'savings_goals_budget', amount)` and switching tab to `dashboard`.
     - `dashboard.js` automatically consumes incoming budget via `MoneyApp.Bridge.receive('savings_goals_budget')` and simulates allocation across goals.
  3. **Quality Gates & Parity:**
     - 100% dictionary key symmetry between Thai and English in `js/dashboard.js` and `js/remaining-money.js`.
     - Unit and integration tests added in `tests/integration-bridges.test.mjs` and `tests/smoke.test.mjs`. All 843 tests pass. Version bumped to `v2.6.6`.

### 2026-10-29: Goal-Based Savings Planner Engine & Annuity Sinking Fund Math (Phase 144 / v2.6.5)
- **Date & Context:** 2026-10-29, Pillar 2.1 Goal-Based Savings Planner Engine (`v2.6.5`).
- **Problem:**
  - Users lacked an analytical framework to model named financial targets (e.g. down payments, emergency reserves, wedding funds) accounting for compound interest, target deadlines, and multiple priority levels.
  - Multi-goal monthly surplus allocations risked capital leaks, over-funding, or floating-point rounding anomalies if unconstrained.
- **Solution & Invariants:**
  1. **Annuity Sinking Fund Compounding Formula (`computeRequiredMonthlyContribution`):**
     - When interest rate $r > 0$, discounts the future compounding value of current balance $PV \cdot (1+r)^n$, then solves for payment $PMT = \frac{(FV - PV(1+r)^n) \cdot r}{(1+r)^n - 1}$.
     - Clamps to 0 if the goal is already fully funded or if the initial balance compounded alone achieves the target.
     - Provides linear fallback $PMT = \max(0, FV - PV) / n$ when $r = 0$.
  2. **Capital Conservation in Multi-Goal Surplus Allocation (`allocateMonthlySurplus`):**
     - Implements `'priority'`, `'proportional'`, and `'balanced'` allocation strategies.
     - Enforces strict capital conservation: $\sum \text{allocated} \le \text{surplus}$, caps allocations at remaining shortfall, and redistributes excess funds when higher-priority goals are saturated.
  3. **Trajectory Generation & Identity Invariant:**
     - Computes monthly schedule where each period satisfies `totalBalance == principalSaved + interestEarned` within $0.01$ Baht precision.
  4. **Quality Gates:**
     - Added 28 unit tests in `tests/savings-goals.test.mjs` including a 100-iteration random fuzzer.
     - Precaching verified in `sw.js` and `tests/smoke.test.mjs`. Version bumped to `v2.6.5`.

### 2026-10-29: First-Time Onboarding Wizard & Financial Archetype Templates (Phase 143 / v2.6.4)
- **Date & Context:** 2026-10-29, Pillar 3.1 First-Time User Onboarding Wizard & Archetypes (`v2.6.4`).
- **Problem:**
  - First-time visitors facing 7 standalone tools had no clear starting path tailored to their employment and financial situation, increasing user drop-off.
  - Adding archetype buttons and tabs without rigorous bilingual synchronization and screen reader announcements would violate WCAG 2.1 AA and headless DOM parity invariants.
- **Solution & Invariants:**
  1. Implemented `#onboardingArchetypes` (`role="tablist"`) with 3 selectable financial archetypes:
     - `Salaried Employee` (`#btn-archetype-salaried` -> defaults to Payslip Simulator and Tax).
     - `Freelancer / Creator` (`#btn-archetype-freelance` -> defaults to Remaining Money Cash Flow and ภ.ง.ด. 90 Tax).
     - `Investor & Debt-Free` (`#btn-archetype-investor` -> defaults to Portfolio Rebalance and Debt Amortization).
  2. Implemented `selectOnboardingArchetype(type, announce)`:
     - Toggles active borders and backgrounds dynamically.
     - Highlights matching step cards in the 5-step workflow.
     - Updates primary CTA `#btn-onboarding-main-cta` text with dynamic formatter `btnStartWithArchetype(name)`.
     - Directs `startOnboardingWithArchetype()` to open the chosen tool directly.
     - Announces archetype selection politely to screen readers via `MoneyApp.announce`.
  3. Added complete dictionary parity across `translations.th` and `translations.en` in `js/app-shell.js`.
  4. Registered `moneySuperapp.onboardingComplete` in `CANONICAL_STORAGE_SCHEMAS`.
  5. Added contract and sandboxed state machine tests in `tests/smoke.test.mjs`. All 812 tests pass. Version bumped to `v2.6.4`.

### 2026-10-29: Unified GitHub Actions CI Pipeline (Phase 142 / v2.6.3)
- **Date & Context:** 2026-10-29, Pillar 6.2 Unified GitHub Actions CI Pipeline (`v2.6.3`).
- **Problem:**
  - Automated CI workflows on GitHub Actions previously only ran `npm test` and Lighthouse CI, omitting the asset size & zero-dependency budget gate (`npm run test:budget`) and the native test coverage reporting (`npm run test:coverage`).
  - Without running `test:budget` in CI, unintended CDN references or payload budget breaches could pass unnoticed on pull requests.
- **Solution & Invariants:**
  1. Updated `.github/workflows/ci.yml` across the Node 20 & 22 matrix to execute `npm run test:budget` and `npm run test:coverage` on every push and PR.
  2. Added contract assertions in `tests/smoke.test.mjs` verifying the workflow configuration.
  3. All 807 tests passed cleanly with 0 Biome linter errors. Version bumped to `v2.6.3`.

### 2026-10-29: Native Zero-Dependency Code Coverage Reporting (Phase 141 / v2.6.2)
- **Date & Context:** 2026-10-29, Pillar 6.1 Native Zero-Dependency Code Coverage Reporting (`v2.6.2`).
- **Problem:**
  - Traditional JavaScript coverage tools like `nyc` or `c8` introduce heavy external npm dependencies and violate ADR-001 as well as `tests/asset-budget.test.mjs`.
  - Developers needed a single standard command to inspect code, branch, and function coverage across the 25 domain engines without breaking CI budget gates.
- **Solution & Invariants:**
  1. Configured `"test:coverage": "node --test --experimental-test-coverage tests/**/*.test.mjs"` natively in `package.json`.
  2. Preserved zero runtime dependencies in `package.json` (`dependencies` empty, `devDependencies` strictly `@biomejs/biome`).
  3. Added contract assertions in `tests/smoke.test.mjs` verifying the coverage command structure.
  4. All 807 tests pass across 227 test suites with 0 lint violations. Version bumped to `v2.6.2`.

### 2026-10-29: Roadmap Plan v3.0 Synchronization & Invariant Hardening (Phase 140 / v2.6.1)
- **Date & Context:** 2026-10-29, Phase 140 Next-Generation Roadmap Synchronization (`v2.6.1`).
- **Problem:**
  - Proposing external devDependencies (e.g. `c8`, `terser`, `playwright`, `stryker`) violates the strict invariant tested in `tests/asset-budget.test.mjs` which requires devDependencies to contain only `@biomejs/biome`.
  - Proposing browser ES module dynamic `import()` breaks direct `file://` execution due to browser null-origin CORS restrictions, violating ADR-001 and ADR-002.
  - Adding features to HTML files without prior size reduction risks exceeding the `MAX_HTML_PAGE_BYTES` (150KB) budget.
- **Solution & Invariants:**
  1. Synchronized the audited v3.0 roadmap (Phases 140–163) across 7 pillars into `plan.md`.
  2. Mandated zero-dependency native tooling: Node.js `--experimental-test-coverage`, zero-dep CDP E2E runner.
  3. Preserved strict ADR-001 offline privacy and ADR-004 decoupled explicit user data sync.
  4. Updated active state machine and bumped version to `v2.6.1`.

### 2026-10-23: Multi-Profile Partition Architecture (Phase 139 / v2.6.0 Milestone)
- **Date & Context:** 2026-10-23, Pillar 5.1 Multi-Profile Switching & Partition Architecture (`v2.6.0`).
- **Problem:**
  - Users managing personal finances alongside freelance/business cash flow or family budgets had no isolation mechanism without manually exporting/importing JSON files.
  - Naive prefixing of all storage keys breaks existing tools that query raw `localStorage` directly (e.g. `remainingMoneyCalculator.state.v1`, `rebalanceCalculator.state.v1`).
- **Solution & Invariants:**
  1. **Partition Snapshot & Swap Engine (`js/engines/profile-partition.js`):**
     - Manages built-in profiles (`personal`, `family`, `freelance`) and custom profiles with deep-copy cloning.
     - Preserves global user settings (`theme`, `lang`, `activeTab`, `appLock`) while atomically swapping domain data keys (`remainingMoneyCalculator.*`, `rebalanceCalculator.*`, `moneySuperapp.*`) into/out of active storage and partition archives (`moneySuperapp.partition.<id>`).
     - Backwards compatibility: Existing single-profile user data automatically snapshots into the `personal` partition on boot without any migration loss.
  2. **StorageDB Integration (`js/engines/storage-db.js`):**
     - Added `createPartitionedStorage(profileId)` and included `profile.` in allowed application prefixes.
  3. **App Shell UI & Dropdown (`index.html` & `js/app-shell.js`):**
     - Topbar profile switcher button `#btn-profile-switcher` with `#activeProfileIcon` and dynamic `#activeProfileName`.
     - Dropdown menu `#profileDropdownMenu` with active indicators and quick navigation.
     - Mobile layout invariant: `.profile-name-label` and `.profile-caret` are hidden on `<= 768px` viewports, preserving 0 horizontal blowout on 375x667 and 320x568.
     - Settings Modal `#profileManagerCard` for adding, cloning, switching, and deleting profiles.
  4. **Quality Gates & Invariants:**
     - 100% bilingual symmetry between `translations.th` and `translations.en`.
     - Unit tests in `tests/profile-partition.test.mjs` (9/9 passing).
     - Full test suite passed across all 806 tests with 0 failures. Milestone `v2.6.0` achieved!

### 2026-10-23: Joint Tax Filing & Spousal Exemption Optimizer (Phase 138 / v2.5.79)
- **Date & Context:** 2026-10-23, Pillar 5.2 Joint Tax Filing & Spousal Exemption Optimizer (`v2.5.79`).
- **Problem:**
  - Under Section 57 ter of the Thai Revenue Code, married couples can choose between separate filing and joint filing.
  - When both spouses have significant income, progressive PIT brackets make separate filing substantially more tax-advantageous due to dual standard expense deductions (50% max 100k each) and dual 0% brackets (150,000 THB each).
  - Conversely, when one spouse has no or minimal income, joint filing unlocks the 60,000 THB spousal allowance and deduction transfers (life insurance, parent care, etc.), reducing the working spouse's net taxable income.
  - Users lacked a side-by-side comparative simulation and actionable filing guidance.
- **Solution & Invariants:**
  1. **Statutory Optimization Engine (`optimizeSpousalTaxFiling` in `js/engines/thai-pit.js`):**
     - Computes separate filing total PIT: `tax(SpouseA) + tax(SpouseB)`.
     - Computes joint filing PIT: `tax(combinedGross - combinedExpenses - combinedAllowances)`.
     - Determines recommendation (`separate`, `joint`, or `equal`) with exact Baht savings and bilingual rationale.
  2. **UI & Accessibility (`tax-calculator-base.html` & `js/tax-calculator-base.js`):**
     - Interactive spousal card `#spousalTaxOptimizerCard` with toggle, inputs for spouse income/deductions, side-by-side comparison grid, and dynamic recommendation verdict box.
     - 100% key symmetry between Thai and English in `translations.th` and `translations.en`.
  3. **Quality Gates & Invariants:**
     - Preserved `defaultCollapsed` literal array in `js/tax-calculator-base.js` to satisfy `tests/smoke.test.mjs` line 892 contract.
     - Wrapped VM engine returns in `Array.from()` to prevent prototype realm mismatches.
     - Added 4 unit tests in `tests/joint-tax-optimizer.test.mjs`. All 797 tests pass with 0 failures.

### 2026-10-23: Native Barcode / QR Camera Scanner for P2P Device Migration (Phase 137 / v2.5.78)
- **Date & Context:** 2026-10-23, Pillar 1.3 Native Barcode / QR Camera Scanner for P2P Sync (`v2.5.78`).
- **Problem:**
  - P2P offline transfer relied on camera streams with no camera flip, no torch support, and no image file upload fallback for devices with camera access restrictions or legacy browser environments.
  - In unit tests loaded in `node:vm` contexts, timer APIs (`setTimeout`, `clearTimeout`) and global audio constructors must be explicitly mapped on the sandbox object to prevent silent catch failures.
- **Solution & Invariants:**
  1. **Native Barcode & Image Decoder Engine (`js/engines/p2p-sync.js`):**
     - Implemented `isBarcodeDetectorSupported()`, `createBarcodeDetector()`, and `scanQrFromSource(detector, source)` supporting video elements, canvas elements, Image elements, and ImageBitmaps.
     - Added native zero-dependency audio feedback via `playScanFeedbackChime()` using Web Audio API oscillator synthesis (sine wave ramp, 0 external audio assets).
  2. **Camera Controls & Image File Ingestion (`index.html` & `js/app-shell.js`):**
     - Added rear/front camera toggle (`toggleQrCameraFacing`) and flashlight toggle (`toggleQrCameraTorch`).
     - Added native image file picker (`handleQrImageUpload`) to decode QR screenshots directly using `createImageBitmap` and `BarcodeDetector`.
     - Multi-sensory capture feedback: green flash border on `#qrCameraOverlay`, audio chime, and haptic vibration (`navigator.vibrate?.(50)`).
  3. **Quality Gates & Invariants:**
     - 100% key symmetry between Thai and English in `translations.th` and `translations.en`.
     - Added unit tests in `tests/p2p-scanner.test.mjs` (5/5 passing).
     - Full test suite passed across all 793 tests (0 failures).


### 2026-10-23: Interactive Cash Flow Waterfall & Category Filtering (Phase 136 / v2.5.77)
- **Date & Context:** 2026-10-23, Pillar 3.2 Interactive Cash Flow Waterfall & Category Filtering (`v2.5.77`).
- **Problem:**
  - The static cashflow waterfall chart provided a top-level macro overview but offered no way to inspect itemized components (Needs vs Wants ratio, specific statutory deductions, savings breakdown) or simulate surplus allocation.
  - Adding interactive filter chips and dynamic breakdown cards without strict bilingual translation synchronization and clean initial empty values triggers headless Chrome live DOM bilingual parity test failures.
- **Solution & Invariants:**
  1. **Interactive Category Filtering & Focus States (`js/engines/cashflow-viz.js`):**
     - Enhanced `renderCashflowWaterfall` with `selectedCategory` parameter, applying `data-category="${step.id}"`, focus ring / border stroke (`stroke="var(--core, #10b981)" stroke-width="2.5"`), and dimmed opacity (`0.35`) to non-selected bars.
     - Implemented `getCategoryDrilldown` providing itemized amounts, percentage of gross income, and Needs vs Wants classification.
  2. **3-Way Surplus Allocation Simulator & Capital Conservation:**
     - Implemented `calculateSurplusDistribution({ surplus, reservePct, debtPct, dcaPct })` guaranteeing exact conservation of surplus down to integer baht (`reserveAmount + debtAmount + dcaAmount === surplus`).
     - Added 3 interactive percentage sliders (Emergency Reserve, Debt Payoff, DCA Investment) with instant Baht feedback.
     - Added one-click bridge button (`btnBridgeSurplusDca`) saving allocated DCA surplus to `localStorage` under `moneySuperapp.pendingBudget` and switching directly to `rebalance.html`.
  3. **Quality Gates & Invariants:**
     - 100% key symmetry between Thai and English in `translations.th` and `translations.en`.
     - Added unit tests in `tests/cashflow-viz.test.mjs` (11/11 passing).
     - Headless Chrome live DOM parity verified across all 8 tools with 0 untranslated Thai elements in English mode.


### 2026-10-23: Easy E-Receipt & Tax Invoice Deduction Tracker (Phase 135 / v2.5.76)
- **Date & Context:** 2026-10-23, Pillar 2.3 Easy E-Receipt & e-Tax Invoice Deduction Tracker (`v2.5.76`).
- **Problem:**
  - Thai government tax stimulus ("Easy E-Receipt") allows up to 50,000 THB total deduction, but imposes a strict 20,000 THB sub-cap on Non-VAT electronic receipts (books, e-books, OTOP).
  - Taxpayers manually grouping receipts often over-claim non-VAT receipts or miscalculate remaining headroom for VAT purchases.
  - Adding hardcoded Thai strings in HTML without `data-i18n` triggers bilingual parity failures in English mode (`tests/bilingual-parity.test.mjs`).
- **Solution & Invariants:**
  1. **Dual Sub-Cap Statutory Engine (`evaluateEasyEReceiptDeduction`):**
     - `effectiveNonVat = Math.min(nonVat, 20000)`.
     - `effectiveVat = Math.min(vat, 50000 - effectiveNonVat)`.
     - `totalEffective = effectiveVat + effectiveNonVat` (strictly <= 50,000 THB).
     - Returns utilization percentage, remaining headroom, and marginal tax savings estimate.
  2. **Interactive UI & Visual Quota Meter:**
     - Dynamic progress bar in `tax-calculator-base.html` showing real-time utilization % and remaining quota.
     - Synchronized sub-inputs for VAT vs Non-VAT stores that auto-aggregate into the main deduction field.
  3. **Strict Bilingual DOM Parity:**
     - Dynamic text containers start empty in HTML so English mode headless tests find zero untranslated Thai elements.

### 2026-10-23: Automated Asset Size & Zero-Dependency Budget Gate (Phase 134 / v2.5.75)
- **Date & Context:** 2026-10-23, Pillar 6.2 Architectural Resilience & Zero-Dependency Budget Gate (`v2.5.75`).
- **Problem:**
  - As features expand across 23 domain engines and 8 standalone tools, without automated budget gating, unmonitored file growth, accidental CDN links, or runtime NPM dependencies can creep into the codebase unnoticed.
- **Solution & Invariants:**
  1. **Strict ADR-001 Invariant:** `package.json` must declare 0 runtime dependencies (`dependencies` is empty or undefined). Only approved developer lint/format tooling (`@biomejs/biome`) is allowed.
  2. **100% Offline-First Self-Containment:** All 8 HTML tools are verified to contain zero external stylesheet or script CDN references (`http://`, `https://`, `//`).
  3. **Dual Payload Budget:** Enforced per-tool ceilings of <950KB uncompressed total and <220KB gzipped over-the-wire transfer budget.
  4. **SW Freshness:** `sw.js` `CACHE_NAME` must strictly match `package.json` version and every listed asset in `ASSETS_TO_CACHE` must exist on disk.
  5. **Continuous CI Script:** Added `npm run test:budget` running `tests/asset-budget.test.mjs`.

### 2026-10-23: Rebalance Suggested Allocation Quick-Apply & Budget Deduction (Phase 133 / v2.5.74)
- **Date & Context:** 2026-10-23, Portfolio Rebalancer Quick-Apply Suggested Allocation & Budget Deduction (`v2.5.74`).
- **Problem:**
  - In `rebalance.html`, users calculating top-up allocations for multi-asset portfolios had to manually read suggested allocation numbers (e.g. `+1,500 ฿`) and manually re-type them into the asset's holding value input field (`5,000` -> `6,500`), then manually subtract that amount from the top-up budget field at the top of the page (`10,000` -> `8,500`).
  - This manual process was error-prone, friction-heavy, and failed to recalculate remaining budget redistribution across shortfalls automatically.
- **Root Cause & Nuances:**
  - Portfolio assets may track units and last prices in addition to total THB value. Updating `a.value` alone causes a mismatch between `a.value` and `a.units * a.lastPrice * fxRate`.
  - Rebalancer uses an undo manager (`MoneyApp.createUndoManager`). Failing to snapshot state before applying the suggestion breaks `Ctrl+Z` / Undo button functionality.
  - When snapshots are restored via `JSON.parse(JSON.stringify(snap.buckets))`, tests holding stale array references will see un-reverted objects unless querying the fresh `state.buckets` reference.
- **Solution & Rule:**
  1. **Atomic Allocation Application (`applySuggestedAllocation`):**
     - First push to undo stack: `undoMgr.push(captureSnapshot())`.
     - Increment `a.value += applyVal`.
     - Proportionally increment `a.units` when `units > 0 && lastPrice > 0`: `addedUnits = applyVal / (a.lastPrice * fxRate)`.
     - Deduct from budget clamped at 0: `state.totalBudget = Math.max(0, Math.round((state.totalBudget || 0) - applyVal))`.
     - Re-render asset rows (`renderBuckets()`), re-calculate allocations (`compute()`), persist state (`saveState()`), update undo UI (`updateUndoUI()`), and announce change to assistive tech (`MoneyApp.announce(...)`).
  2. **Clean Dynamic Affordance:**
     - Render check button `[✓]` (`.btn-apply-suggestion`) beside `radd` only when `!isExcluded && add > 0.5`.
     - Once applied, subsequent `compute()` clears the shortfall (`add <= 0.5`), removing the button naturally and redistributing remaining budget across remaining shortfalls.
  3. **Bilingual Parity & Accessibility:**
     - Both `th` and `en` dictionaries define `btnApplySuggestion`.
     - Semantic `<button type="button">` with descriptive `aria-label`, `title`, and `:focus-visible` focus ring.

### 2026-10-23: Mobile Modal Viewport Centering & Flexbox Overflow Trapping (Phase 132 / v2.5.73)
- **Date & Context:** 2026-10-23, Mobile Settings & Data Management Modal Viewport Overflow Fix (`v2.5.73`).
- **Problem:**
  - On mobile viewports (e.g. 375x667, 320x568), opening the Settings & Data Management modal (`#settingsModal`) pushed the modal completely out of screen.
  - The top 464px (including the header, title, and close button) was pushed above the screen (`top: -463px`), and the bottom 464px was pushed below the screen (`bottom: 1130px`).
  - Because Flexbox vertical centering (`align-items: center; justify-content: center;`) was used without an explicit `max-height` or `overflow-y: auto`, the modal was unscrollable, trapping the user with no way to see the settings or click close.
- **Root Cause:**
  - The intrinsic height of the modal content was ~1,600px–1,850px across its 9 configuration cards.
  - `#settingsModal > div` lacked `max-height` and had `overflow-y: visible` by default. In CSS Flexbox, centering an item taller than its container causes symmetric negative top and positive bottom coordinates, making top content permanently unscrollable.
  - Backdrop click-to-close handler (`onclick="if(event.target===this)closeSettingsModal()"`) was also absent on `#settingsModal`.
- **Solution & Rule:**
  1. **Strict Modal Bounds Rule:**
     - Every overlay dialog container in the application MUST declare `max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px); overflow-y: auto; -webkit-overflow-scrolling: touch;`.
  2. **Sticky Header & Backdrop Escape:**
     - The modal header containing the title and close button MUST use `position: sticky; top: -20px; z-index: 10;` so the close affordance is perpetually visible and clickable regardless of how far down the user scrolls.
     - Always include backdrop click detection `onclick="if(event.target===this)closeModal()"` so users are never trapped.
  3. **Automated Visual Layout Invariant:**
     - Added automated layout assertions in `tests/visual-regression.test.mjs` verifying `cardTop >= 0`, `cardBottom <= viewport.height`, `cardHeight <= viewport.height`, `overflow-y: auto`, and non-zero scrollability at both 375x667 and 320x568 viewports.

### 2026-10-20: WCAG 2.1 AA Focus-Visible Rings & Screen Reader Live Region Announcer (v2.5.72)
- **Date & Context:** 2026-10-20, Phase 131 WCAG 2.1 AA Accessibility & Screen Reader Live Regions (`v2.5.72`).
- **Problem:**
  1. **Focus Indicator Invisibility & Clipping:** Standard browser outline overrides (e.g. `outline: none;` without replacement) remove keyboard navigation affordances, failing WCAG 2.1 SC 2.4.7 (Focus Visible) and SC 1.4.11 (Non-text Contrast). Furthermore, tight outlines with `outline-offset: 0` blend into button borders and card edges.
  2. **Screen Reader Notification Latency & XSS Risk in Dynamic Live Regions:** Single-page applications and financial tools update dynamic KPI calculations (tax liabilities, emergency funds, SWR projections) purely through visual DOM rewrites. Assistive technology (screen readers like NVDA, VoiceOver, JAWS) fails to announce updated figures unless aria live regions are employed. Naively injecting dynamic user-controlled strings into live regions via `innerHTML` opens XSS vulnerabilities.
  3. **Headless & Non-DOM Node.js Environment Crashes:** Utilities calling `document.getElementById` or `document.createElement` throw `ReferenceError: document is not defined` when executed in CLI scripts, background workers, or server-side test runners.
- **Root Cause:**
  - Inconsistent focus styling across form controls, links, and buttons.
  - Absence of centralized ARIA live region management for calculation state updates.
  - Direct DOM assumptions without environment guards.
- **Solution & Rule:**
  1. **WCAG 2.1 AA Focus-Visible Design System Contract:**
     - Enforce `:focus-visible` styling across all interactive elements (`button`, `a`, `input`, `select`, `textarea`, `[tabindex]`).
     - Use a high-contrast accent ring (`outline: 2px solid var(--accent, #10b981)`) with `outline-offset: 2px` to ensure the focus ring never collides with or clips inside adjacent element borders.
     - Verify non-text contrast against light and dark backgrounds exceeds the 3:1 WCAG 2.1 AA threshold.
     - Implement standard `.sr-only` utility with `position: absolute; width: 1px; height: 1px; clip: rect(0, 0, 0, 0); overflow: hidden;` for screen-reader-only labels.
  2. **Screen Reader Live Region Announcer (`MoneyApp.announce`):**
     - Expose `MoneyApp.announce(message, priority = 'polite')` in `js/shared.js`.
     - Strictly assign text via `.textContent = text` (never `innerHTML`) to eliminate potential XSS vectors when echoing user-provided figures.
     - Clamp priority strings strictly to `'polite'` or `'assertive'`, defaulting to `'polite'` to avoid interrupting in-progress screen reader speech.
     - Re-use a single, singleton announcer element `#a11y-announcer` with `role="status"` and `aria-live="polite"` inside the document body.
  3. **Graceful Degradation in Headless & Non-DOM Environments:**
     - Guard all DOM accesses with `typeof document !== 'undefined' && typeof window !== 'undefined'`.
     - In headless Node.js unit test or batch CLI environments, `MoneyApp.announce` gracefully returns the sanitized message without throwing runtime exceptions.
  4. **Quality Gates & Automated Verification:**
     - Created `tests/a11y-wcag.test.mjs` verifying 15 automated test cases across landmarks, metadata, focus-visible styles, `.sr-only` contracts, `MoneyApp.announce` live region updates, and KPI aria-live markup.

### 2026-10-20: Sequence of Returns Risk (SRR) Modeling, Guyton-Klinger Guardrails & Bounded SWR Convergence (v2.5.71)
- **Date & Context:** 2026-10-20, Phase 130 Sequence of Returns Risk & Dynamic SWR Retirement Simulator (`v2.5.71`).
- **Problem:**
  1. **Sequence of Returns Risk (SRR) Asymmetry:** Traditional retirement planning relies on average annual returns (e.g. 7% real). However, under fixed constant inflation-adjusted withdrawals, market return order matters drastically: early market crashes in years 1–3 permanently deplete the compounding asset base, leading to early portfolio ruin even if long-term average returns equal historical medians, whereas identical crashes occurring late in retirement have minimal impact.
  2. **Rigidity of Fixed 4% Rule:** In severe early bear markets (such as 1973 stagflation, 2000 dot-com, or 2008 GFC), adhering blindly to fixed inflation adjustments forces continuous liquidations at distressed market troughs, driving failure rates upwards of 30-40%.
  3. **Floating-Point Lockup in SWR Binary Search Solvers:** Naive binary search loops solving for the Safe Withdrawal Rate (`findSafeWithdrawalRate`) matching a target survival probability (e.g. 90%) risk infinite iteration or precision oscillation around floating-point boundaries if not strictly bounded.
- **Root Cause:**
  - Standard Monte Carlo or linear compounding fails to expose sequence order vulnerabilities.
  - Lack of dynamic spending rules that adapt withdrawals to market state.
  - Unbounded binary search while-loops lacking an iteration guard.
- **Solution & Rule:**
  1. **Explicit Sequence of Returns Risk (SRR) Stress Scenarios:**
     - Implement dedicated sequence shock presets: `early_bear` (severe crash in years 1–3), `late_bear` (crash in final years), and `inflation_spike` (high inflation early in retirement).
     - Under fixed constant withdrawals, early-bear survival probability is mathematically lower than late-bear survival, demonstrating the necessity of dynamic rules.
  2. **Guyton-Klinger Dynamic Guardrail Rules:**
     - **Capital Preservation Rule:** When the current withdrawal rate rises above 1.2x the initial withdrawal rate (`currentRate > initialRate * 1.2`), apply a 10% cut to the nominal withdrawal amount.
     - **Prosperity Rule:** When the current withdrawal rate drops below 0.8x the initial rate, increase spending by 10%.
     - **Inflation Freeze Rule:** Following a year with negative total portfolio returns, freeze inflation adjustment for the subsequent year's withdrawal.
     - Enforce `spendingFloor` (default 70% of initial real spending) and `spendingCeiling` (default 130%) to prevent excessive lifestyle degradation or unconstrained spending.
  3. **Bounded Binary Search for SWR Convergence:**
     - Restrict the binary search interval `[low, high]` (typically `[0.01, 0.15]`) with a hard cap on iterations (`iterations < 20`) and tolerance `tolerance = 0.001` (0.1% SWR precision).
     - Guarantees deterministic convergence in ~8 iterations while preventing infinite loops or floating-point precision lockup.
  4. **Quality Gates & Automated Verification:**
     - Created `tests/sequence-risk.test.mjs` verifying 9 unit and mathematical invariant tests across parameter defaults, SRR asymmetry, Guyton-Klinger outperformance, spending floors/ceilings, and SWR solver convergence; all 718 tests passing with 0 Biome linter errors.

### 2026-10-20: Tiered Storage Engine: Prototype Pollution Defense, Heap Memory Hygiene & IDB Transaction Lifecycles (v2.5.70)
- **Date & Context:** 2026-10-20, Phase 129 IndexedDB Tiered Persistence Engine (`v2.5.70`).
- **Problem:**
  1. **Prototype Poisoning in Client Storage:** Client-side JSON backup import and in-memory fallback key-value maps can inadvertently expose the global `Object.prototype` to malicious poisoning payloads (e.g., payloads containing `__proto__`, `constructor`, or `prototype` keys). If untrusted or exported JSON files are restored directly without structural prototype defenses, attackers can compromise application invariants.
  2. **Heap Memory Leak in Multi-Tier Storage:** When an application maintains an in-memory fallback cache alongside IndexedDB, storing items in both tiers without pruning causes large multi-megabyte datasets (such as parsed bank statement line items, encrypted tax dossiers, or historical payslips) to persist unnecessarily in the JavaScript heap, wasting V8 memory.
  3. **Premature Promise Resolution in IndexedDB Writes:** In IndexedDB `IDBObjectStore.put()` / `delete()` operations, resolving a Promise on `request.onsuccess` fires before the underlying `IDBTransaction` has durably committed to disk. If disk quota is exceeded or the transaction is aborted downstream, `request.onsuccess` triggers anyway, resulting in false positive success states and silent data loss.
- **Root Cause:**
  - Standard JavaScript `{}` object maps inherit from `Object.prototype` and are vulnerable to prototype tampering on key assignment.
  - Failure to prune volatile in-memory fallback dictionaries once data has been confirmed stored in durable storage.
  - Relying on `IDBRequest.onsuccess` instead of the enclosing `IDBTransaction.oncomplete` lifecycle event for transactional write durability.
- **Solution & Rule:**
  1. **Prototype Pollution Prevention in Client Storage:**
     - All in-memory storage fallback dictionaries and deserialized import maps must be initialized with `Object.create(null)` (or use a native `Map`).
     - Explicitly reject and skip any keys matching `__proto__`, `constructor`, or `prototype` during `setItem`, `importAll`, and legacy migration to prevent prototype poisoning attacks.
  2. **Heap Memory Hygiene in Tiered Storage:**
     - When a write to IndexedDB succeeds, explicitly prune `delete fallbackMemory[key]` so that large multi-megabyte datasets reside strictly in disk storage rather than duplicating RAM usage in the JavaScript heap. In-memory storage should be retained only as a last-resort fallback when durable storage is unavailable or fails.
  3. **Strict IndexedDB Transaction Lifecycle Listening:**
     - Promises for write operations (`setItem`, `removeItem`, `clear`, `importAll`) must listen to `tx.oncomplete` for resolution, and listen to both `tx.onerror` and `tx.onabort` (as well as `req.onerror`) to guarantee durable commits and catch storage quota errors (`QuotaExceededError`) and transaction rollbacks.
  4. **Critical Key Mirroring & Dual Persistence:**
     - Synchronously mirror critical UI configuration keys (e.g. `theme`, `lang`, `activeTab`) to `localStorage` while persisting primary application data in IndexedDB, preventing FOUC (flash of unstyled content) and language flicker on page initialization.
  5. **Quality Gates & Automated Verification:**
     - Created `tests/storage-db.test.mjs` verifying 13 distinct unit and integration invariants across CRUD, fallback modes, critical key mirroring, legacy migration, export/import, quota estimation, prototype pollution rejection, and heap memory pruning.

### 2026-10-19: Mobile Pull-to-Refresh Gesture & Multi-Tier Web App Badging API Fallbacks (v2.5.69)
- **Date & Context:** 2026-10-19, Phase 128 Mobile Pull-to-Refresh & Web App Badging API (`v2.5.69`).
- **Problem:**
  1. On installed standalone mobile PWAs (display: standalone), users expect native touch pull-to-refresh to reload active sub-tool frames and re-sync offline data without having to search for a reload button in settings. However, naive `touchstart`/`touchmove` implementations conflict with natural page scrolling or horizontal swipe gestures used for switching tool tabs.
  2. The W3C Badging API (`navigator.setAppBadge`, `navigator.clearAppBadge`) is only supported on Chromium-based browsers in installed PWA mode. Standard browser tabs, Firefox, Safari iOS, and desktop browsers fail silently without ambient badge notification indicating urgent financial action items (overdue tax filing, excessive debt velocity, or budget deficits).
- **Root Cause:**
  - Lack of multi-axis touch angle discrimination during drag gestures.
  - Relying exclusively on standard `navigator.setAppBadge` without cross-browser UI and title fallback mechanisms.
- **Solution & Rule:**
  1. **Strict Touch Gesture Angle Discrimination:**
     - Pull-to-refresh requires vertical dominance discrimination (`deltaY > 15 && Math.abs(deltaX) < 40`) and initial scroll position guarding (`window.scrollY <= 0`) to prevent interference with horizontal swipe tab switching.
     - Smooth spring-damper drag resistance (`Math.min(deltaY * 0.45, 75)`) ensures natural haptic feedback before firing reload trigger.
  2. **Multi-Tier Web App Badging Fallbacks:**
     - Primary tier: Native `navigator.setAppBadge(count)` when supported.
     - Secondary tier: Graceful document title prefixing `(N) Title` (sanitizing count and restoring pristine title upon clearance).
     - Tertiary tier: Visual in-app status dot `#pwaStatusDot.has-badge` with pulsing CSS glow in the App Shell header.
     - Bridge protocol integration via `MoneyApp.requestAppBadgeUpdate()` and `MoneyApp.requestAppBadgeClear()` across iframe sub-tools.
  3. **Quality Gates & Smoke Test:**
     - Added 4 contract assertions in `tests/smoke.test.mjs` verifying DOM markup, function exports, title fallbacks, and count sanitization; all 99 smoke tests passing with 0 Biome linter errors.

### 2026-10-19: Zero-Dependency Financial Math Fuzzing & Mathematical Invariant Testing (v2.5.68)
- **Date & Context:** 2026-10-19, Phase 127 Financial Math Invariant & Fuzz Testing Suite (`v2.5.68`).
- **Problem:**
  1. Traditional unit test suites only evaluate deterministic, fixed example inputs (e.g. 50,000 THB income, specific 2-debt configurations). Boundary anomalies such as subtle floating-point precision leaks, negative zero (`-0`), bracket boundary overlaps, or order allocation drift could slip past static tests under random user portfolios.
  2. Heavy external property-based fuzz testing tools (e.g., fast-check, jsverify) violate ADR-001 by introducing significant npm dependency weight and complex test runtimes.
- **Root Cause:**
  - Reliance exclusively on handcrafted example cases rather than property-based automated invariant fuzzing across millions of possible financial states.
- **Solution & Rule:**
  1. **Zero-Dependency Deterministic Fuzz Engine (`tests/fuzz-math.test.mjs`):**
     - Built a pure, zero-dependency pseudo-random generator using a deterministic 32-bit Linear Congruential Generator (LCG, `state = (state * 1664525 + 1013904223) >>> 0`) with static seeds.
     - Generates 10,000 combinatorial permutations across PIT progressive brackets, ThaiESG caps, debt payoff strategies (Avalanche/Snowball), and portfolio rebalancing in ~125 ms in pure Node.js without any external libraries, fully complying with ADR-001.
  2. **Mathematical Invariant Verification:**
     - **Monotonicity Invariant:** Higher assessable income strictly never yields lower tax payable (`tax(A) <= tax(B)` for A < B).
     - **Conservation of Debt Capital:** Total debt payments strictly equal total initial principal plus total interest paid across entire payoff lifecycles (`|totalPaid - (principal + totalInterest)| < 0.01`).
     - **Conservation of Investment Capital:** Post-rebalance portfolio total strictly equals initial asset value plus invested new budget (`|postTotal - (preTotal + budget)| < 0.01`).
     - **Sanitization Invariants:** Guaranteed zero `NaN`, zero `Infinity`, zero negative zero (`-0`), and non-negative buy-only rebalance orders.
  3. **Quality Gates & Smoke Test:**
     - Added 4 comprehensive fuzz test suites verifying 10,000 randomized permutations; all tests passing with 0 Biome linter errors.

### 2026-10-19: Interactive Debt Payoff SVG Timeline, SVG `<title>` XSS Defense & Dynamic Coordinate Cleanup (v2.5.67)
- **Date & Context:** 2026-10-19, Phase 126 Interactive Debt Payoff Timeline & SVG Security (`v2.5.67`).
- **Problem:**
  1. The debt reduction comparison in `debt-calculator.html` rendered a static trajectory comparison chart without interactive month-by-month scrubbing, strategy delta crosshairs, or view mode filters (Both Strategies vs Active Strategy vs Payoff Delta).
  2. In zero-dependency SVG visualization builders, inserting user-controlled strings (e.g., custom debt or loan names like `Personal Loan <script>alert(1)</script>`) into SVG `<title>` tooltip nodes poses an XSS vulnerability if unescaped: when the SVG string is injected into the DOM via `innerHTML`, the browser's HTML parser closes the `<title>` tag on unescaped child tags and evaluates malicious markup immediately.
  3. When users cleared debts or achieved debt-free status, residual coordinate contexts (`window._debtChartContext`) remained populated, causing dangling event listener calculations or stale crosshair snap math if subsequent pointer events fired before the next calculation.
- **Root Cause:**
  - Common misconception that SVG `<title>` elements treat their inner contents purely as plaintext during DOM `innerHTML` string parsing.
  - Absence of explicit lifecycle context invalidation when debt simulation results yielded zero active obligations.
- **Solution & Rule:**
  1. **Strict SVG `<title>` XSS Defense:**
     - Always sanitize all user-controlled text inserted into SVG elements with `escapeHtml()`, including within `<title>`, `<text>`, and `data-*` attributes.
  2. **Dynamic Chart Coordinate Cleanup:**
     - In `renderPayoffChart()`, when active debts are empty or simulation indicates immediate freedom, explicitly reset `window._debtChartContext = null` and clear crosshair overlays.
  3. **Interactive Multi-Mode Payoff SVG Timeline:**
     - Implemented interactive SVG timeline featuring smooth quadratic Bézier curves, monthly cursor snapping, strategy difference visual fill, and interactive view mode selector (Both / Active Only / Savings Delta).
     - Full keyboard accessibility and bilingual localization support across Thai and English.
  4. **Quality Gates & Smoke Test:**
     - Added 5 dedicated contract and invariant assertions in `tests/smoke.test.mjs`; 95 smoke tests passing with 0 Biome linter errors.

### 2026-10-19: Universal Cloud Export for Debt & Portfolio Rebalance Tools & Full Suite CWE-1236 Defense (v2.5.66)
- **Date & Context:** 2026-10-19, Phase 125 Universal Cloud Export & Defense-in-Depth Completion (`v2.5.66`).
- **Problem:**
  1. The Debt Freedom Calculator (`debt-calculator.html`) and Asset Allocation Rebalance Tool (`rebalance.html`) previously lacked cloud export capabilities to Google Drive and Google Sheets, requiring users to copy raw clipboard text or download local files manually.
  2. With export endpoints proliferating across the application suite, ensuring uniform CSV Formula Injection (CWE-1236) sanitization across all tools was required so that malicious user input (e.g. debt account names or custom asset symbols starting with `=cmd|`, `@SUM`, `+`, or `-`) cannot execute arbitrary formulas in spreadsheet applications.
- **Root Cause:**
  - Remaining legacy tools had not yet received the standardized cloud export modal (`#driveExportModal`) and Web Share integration introduced in Phases 120 and 124.
  - Potential formula injection vectors in custom debt titles and user-entered asset class labels.
- **Solution & Rule:**
  1. **Universal Cloud Export Implementation (`debt-calculator.html` & `rebalance.html`):**
     - Integrated `#driveExportModal` and `#btnSaveToDrive` into both tools with CSV and PDF statement export options.
     - Implemented `generateDebtAmortizationCSV()` and `generateRebalanceOrdersCSV()` prepending `\uFEFF` UTF-8 BOM for spreadsheet encoding compatibility.
     - Provided 1-tap native Web Share API (`navigator.share({ files: [...] })`), fallback blob download, and 1-click shortcuts to `drive.google.com` and `sheets.new`.
  2. **Suite-Wide CWE-1236 Neutralization Complete:**
     - Standardized `csvSafe(val)` helper across all 5 export-capable tools (`remaining-money`, `dashboard`, `tax-calculator-base`, `debt-calculator`, and `rebalance`).
     - Any non-numeric string starting with `=`, `+`, `-`, or `@` has a single quote `'` prepended prior to quote escaping, systematically eliminating formula execution risks across the entire app.
  3. **Quality Gates & Smoke Test:**
     - Verified with dedicated regression tests in `tests/smoke.test.mjs` running in Node.js VM context; 90 smoke tests passing with 0 Biome linter errors.

### 2026-10-19: Universal Cloud Export (Google Drive/Sheets/PDF) & CWE-1236 CSV Formula Neutralization (v2.5.65)
- **Date & Context:** 2026-10-19, Phase 124 Universal Cloud Export & Security Hardening (`v2.5.65`).
- **Problem:**
  1. While `remaining-money.html` had a Google Drive / Sheets / PDF export modal (Phase 120), `dashboard.html` (Executive Financial Dossier) and `tax-calculator-base.html` (ภ.ง.ด. 90/91 Tax Dossier) lacked equivalent cloud export capabilities, forcing users to rely only on raw prints or copy-pasting.
  2. Exporting structured tabular data to CSV formats opens a vector for CSV Formula Injection (CWE-1236) if user-provided strings (such as debt names, custom expense items, or tax notes) begin with formula characters (`=`, `+`, `-`, `@`), which could execute unintended commands when opened in Microsoft Excel or Google Sheets.
- **Root Cause:**
  - Fragmented export interfaces across sub-tools without a standardized client-side cloud export workflow.
  - Naive CSV string serialization that enclosed values in quotes but failed to escape initial spreadsheet formula trigger prefixes.
- **Solution & Rule:**
  1. **Universal Cloud Export Integration (`dashboard.html`, `tax-calculator-base.html`):**
     - Unified modal (`#driveExportModal`) with format toggle (CSV / PDF), native Web Share API (`navigator.share({ files: [...] })`) with fallback to direct download, and 1-click links to Google Drive (`drive.google.com`) and Google Sheets (`sheets.new`).
     - Added UTF-8 BOM (`\uFEFF`) to exported CSVs for seamless Thai character rendering in Google Sheets and Excel.
     - Implemented `generateDashboardDossierCSV` and `generateTaxDossierCSV` emitting clean, standardized tabular financial ledgers.
  2. **Standardized CSV Formula Injection (CWE-1236) Neutralization:**
     - Standardized `csvSafe(val)` helper across all CSV generators: for any string starting with `=`, `+`, `-`, or `@` that is not a pure negative number, prepend a single quote `'` before standard CSV quote-escaping.
  3. **Quality Gates & Smoke Test:**
     - Verified in `tests/smoke.test.mjs` with DOM invariants and Node.js VM execution tests for both CSV generators and injection sanitization.
     - 0 Biome linter errors/warnings.

### 2026-10-19: ThaiESG 2024–2026 Statutory Rules Calibration & Dynamic SSO Annual Ceiling (v2.5.64)
- **Date & Context:** 2026-10-19, Phase 123 ThaiESG 2024–2026 Statutory Calibration & Dynamic SSO Ceiling (`v2.5.64`).
- **Problem:**
  1. The Thai Personal Income Tax (PIT) deduction engine previously capped ThaiESG investments at 100,000 THB with an 8-year holding period under obsolete 2023 ministerial regulations, failing to support the updated 2024–2026 Thailand Revenue Department statutory rules (300,000 THB cap up to 30% of assessable income with a 5-year holding period).
  2. In the tax calculator base UI (`js/tax-calculator-base.js`), the Social Security (SSO) deduction ceiling warning in yearly mode was statically pegged or hardcoded to 13,800 THB (`1,150 * 12`), generating false-positive warning messages or allowing out-of-bounds inputs when users selected lower progressive monthly SSO contribution tiers (e.g. 750 THB/month capped at 9,000 THB/year, or 875 THB/month capped at 10,500 THB/year).
- **Root Cause:**
  - Static deduction limits in tax calculation utilities that lacked parameterization for evolving Thai tax statutes (2024–2026 ThaiESG revision).
  - Hardcoded maximum threshold checks in the UI layer decoupled from the selected SSO monthly progressive tier.
- **Solution & Rule:**
  1. **Dual-Statutory ThaiESG Engine (`MoneyApp.evaluateThaiEsgDeduction` in `js/engines/thai-pit.js`):**
     - Parameterized `evaluateThaiEsgDeduction(amount, totalIncome, taxYear = 2024)`.
     - For `taxYear >= 2024`: Statutory cap is 300,000 THB, limited to min(300,000, 30% of total income), requiring a 5-year holding period.
     - For legacy `taxYear < 2024`: Statutory cap is 100,000 THB, limited to min(100,000, 30% of total income), requiring an 8-year holding period.
     - Returns `{ effectiveDeduction, statutoryCap, maxAllowed, isExceeded, excessAmount, holdingYears }` and integrates into e-filing worksheets.
  2. **Dynamic Annual SSO Ceiling Formula:**
     - Computed dynamic annual ceiling using `const maxYearlySso = (ssoCapVal > 0 ? ssoCapVal : 875) * 12;`.
     - Validates yearly deductions dynamically against the active tier (e.g., 9,000 THB for 750, 10,500 THB for 875, 12,000 THB for 1,000, and 13,800 THB for 1,150), preventing false-positive or missed warning states.
  3. **Quality Gates & Smoke Test:**
     - Full mathematical verification and type contract test coverage added in `tests/financial-math.test.mjs` and `tests/type-contracts.test.mjs`.
     - All 685 unit and integration tests passing across 186 test suites; 0 Biome linter errors.

### 2026-10-19: Lighthouse CI Quality Gate & Automated PWA Performance Checks (v2.5.61)
- **Date & Context:** 2026-10-19, Phase 118 Lighthouse CI & PWA Quality Gate (`v2.5.61`).
- **Problem:**
  1. While unit, smoke, and CDP browser tests verified functionality, there was no declarative Lighthouse CI configuration ensuring ongoing audit readiness across PWA installability, accessibility standards, best practices, and performance budgets.
  2. In an iframe-hosted multi-document app shell (ADR-002), default Lighthouse CI configurations assume single-page applications with history fallback servers (`isSinglePageApplication: true`), which fails when auditing multi-HTML file distributions statically.
  3. Automated PWA assertions in test runners could mistakenly look for `navigator.serviceWorker.register` directly in `index.html` rather than in the modularized `js/app-shell.js` controller.
- **Root Cause:**
  - Absence of root `.lighthouserc.json` and CI workflow integration.
  - Architecture decoupling of static HTML shell from JavaScript lifecycle controllers.
- **Solution & Rule:**
  1. **Declarative Lighthouse CI Configuration (`.lighthouserc.json`):** Configured zero-build static distribution auditing (`staticDistDir: "./"`, `isSinglePageApplication: false`, `numberOfRuns: 1`) with strict assertion thresholds for PWA (0.90), Accessibility (0.90), Best Practices (0.90), and Performance (0.85).
  2. **Secure GitHub Actions CI Integration (`.github/workflows/ci.yml`):** Added `treosh/lighthouse-ci-action@v12` with `uploadArtifacts: false` and `temporaryPublicStorage: false` under `permissions: contents: read` to prevent external telemetry or asset leaks.
  3. **PWA & Cache Invariant Validation (`tests/performance.test.mjs` & `tests/smoke.test.mjs`):** Added `./js/engines/dashboard-viz.js` to `expectedAssets` in the Service Worker cache verification test and added comprehensive assertions verifying `.lighthouserc.json` schemas, PWA metadata, theme-color, icon presence, and Service Worker registration.
  4. **Quality Gates & Smoke Test:** Phase 118 assertions verified in `tests/smoke.test.mjs`, 666/666 tests passing across 180 suites, 0 Biome errors/warnings.

### 2026-10-19: Automated Zero-Dependency Visual Regression Suite & Headless SVG Geometry Resolution (v2.5.60)
- **Date & Context:** 2026-10-19, Phase 117 Visual Regression & Layout Invariant Suite (`v2.5.60`).
- **Problem:**
  1. Automated layout and responsive overflow testing previously relied on ad-hoc scratch scripts or manual browser resizing. Regressions like mobile header blowout or side margin asymmetries could slip past standard DOM unit tests because DOM unit tests don't simulate real rendering engines or layout computation.
  2. Heavy external testing frameworks (Playwright, Puppeteer, Cypress) violate ADR-001 by introducing hundreds of megabytes of npm dependencies and complex build chains.
  3. In headless Chromium via Chrome DevTools Protocol (CDP), querying `svg.getBoundingClientRect()` on an SVG element during dynamic DOM evaluation can return `{ width: 0, height: 0 }` before a paint frame or when default SVG display is `inline`, even though the parent container has `width: 454px` and computed styles reflect `454px`.
- **Root Cause:**
  - Standard unit tests run in jsdom or Node vm environments without a real CSS rendering tree or layout engine.
  - SVG layout bounding box calculation in headless Chromium requires layout rasterization or computed style introspection.
- **Solution & Rule:**
  1. **Zero-Dependency Native CDP Architecture (`tests/visual-regression.test.mjs`):** Built a native, zero-dependency visual regression runner using Node.js built-in `http`, `child_process`, and native `WebSocket` CDP client (`Emulation.setDeviceMetricsOverride`, `Page.navigate`, `Runtime.evaluate`, `Page.captureScreenshot`).
  2. **Comprehensive Viewport Invariant Suites:**
     - Verified mobile (375x667) and ultra-narrow mobile (320x568) have 0px horizontal scroll (`scrollWidth <= innerWidth`), zero topbar action clipping (`rect.right <= innerWidth`), and docked bottom nav.
     - Verified tablet (768x1024) and desktop (1024x768, 1280x800) responsive transitions.
     - Verified child page container margin parity (`tax-calculator.html` PVD tax and `dashboard.html`).
     - Verified CDP headless PNG screenshot generation matches valid PNG magic bytes.
  3. **Robust SVG Layout Geometry Fallback:** In headless Chromium layout assertions, resolve SVG element dimensions using:
     `(svgRect && svgRect.width > 0) ? svgRect.width : (svg ? parseFloat(window.getComputedStyle(svg).width) || svg.clientWidth : 0)`.
  4. **Quality Gates & Smoke Test:** Phase 117 assertions verified in `tests/smoke.test.mjs`, registered `"test:visual"` in `package.json`, 663/663 tests passing across 179 suites, 0 Biome errors/warnings.

### 2026-10-19: Secondary Page Decomposition: Dashboard Visualizations Modularization & Test VM Context Isolation (v2.5.59)
- **Date & Context:** 2026-10-19, Phase 116 Dashboard Visualizations Modularization (`v2.5.59`).
- **Problem:**
  1. `js/dashboard.js` exceeded 4,140 LOC, combining DOM state with complex SVG spline Bézier geometry, Monte Carlo fan chart coordinates, Net Worth Donut stroke offsets, and growth delta calculations.
  2. When extracting visualization logic into `js/engines/dashboard-viz.js`, unit tests executing inside Node's `vm.createContext` or `new Function` test runners threw `ReferenceError: escapeHtml is not defined` during top-level dashboard initialization (`renderChart()`), because `escapeHtml` was attached to `window.escapeHtml` via an IIFE rather than declared as a bare lexical variable.
  3. Node.js `assert.deepEqual` between objects returned from `vm.runInContext` and literals in the outer runner context failed due to prototype mismatch (`Object [Object] vs Object`).
  4. In SVG stroke-dashoffset calculations, `(-segCash).toFixed(2)` emitted `"-0.00"` when cash was 0, creating invalid or non-standard SVG attribute representations.
- **Root Cause:**
  - Inline invocation of visualizer functions during script evaluation without guarding bare function names against window-scoped dependencies in mock environments.
  - V8 VM context separation across execution realms.
- **Solution & Rule:**
  1. **Modular Engine Extraction (`js/engines/dashboard-viz.js`):** Modularized Catmull-Rom to cubic Bézier spline calculation (`buildSmoothSvgPath`), Donut arc geometry (`calculateDonutSegments`), Monte Carlo confidence fan geometries (`generateFanChartGeometry`, `renderMonteCarloFanChart`), and growth metrics (`calculateGrowthMetrics`).
  2. **Safe Dependency Fallback Invariant:** When delegating to utility functions that may be window-scoped (such as `escapeHtml`), use `typeof window !== 'undefined' && typeof window.escapeHtml === 'function' ? window.escapeHtml : typeof escapeHtml === 'function' ? escapeHtml : (s) => String(s ?? '')`.
  3. **SVG Coordinate Sanitization:** Normalize `-0.00` offsets to `'0'` with `String(-segCash.toFixed(2)) === '-0.00' ? '0' : String(-segCash.toFixed(2))`.
  4. **Cross-Realm Unit Test Assertions:** In Node `vm` test runners, assert primitive properties individually or shallow clone objects across context boundaries instead of performing raw prototype-dependent `assert.deepEqual`.
  5. **Quality Gates & Smoke Test:** Phase 116 assertions verified in `tests/smoke.test.mjs`, 654/654 tests passing across 173 suites, 0 Biome errors/warnings.

### 2026-10-19: Mobile Topbar Action Overflow Resolution & Responsive Action Button Compaction (v2.5.58)
- **Date & Context:** 2026-10-19, Phase 115 Mobile Topbar Action Overflow Resolution (`v2.5.58`).
- **Problem:**
  On mobile viewports ($\le 414\text{px}$ down to $320\text{px}$), the top navigation header in the App Shell (`index.html`) broke off the screen horizontally. The combined width of `.topbar-brand` (💰 Money Superapp = 135px) and `.topbar-actions` (TH/EN language toggle 69px + Light/Dark theme toggle 57px + 🔍 Search button 69px + ❓ Help button 32px + ⚙️ Settings button 32px + flex gaps) required over 440px. Because `.topbar-inner` is an unwrapped flex row, the rightmost actions (`#btn-help-modal` and `#btn-settings-modal`) were shoved completely off the right edge of the screen, leaving `#btn-cmd-palette` ("Search") as the last visible element in the mobile header.
- **Root Cause:**
  1. Desktop keyboard shortcut indicator (`.cmd-k-badge` "Ctrl+K") was displayed unconditionally inside `#btn-cmd-palette` even on mobile touchscreens where physical Ctrl keys do not exist, adding ~35px of unnecessary width.
  2. The full brand title text (`.brand-title` "Money Superapp") was rendered on narrow mobile viewports, consuming 110px.
  3. Action buttons had loose horizontal paddings and gaps that failed to compact on smartphone screens $\le 480\text{px}$ and ultra-narrow viewports $\le 380\text{px}$.
- **Solution & Rule:**
  1. **Tiered Responsive Topbar CSS Rules (`index.html`):**
     - At `@media (max-width: 768px)`: Hide `.cmd-k-badge` and `#lbl-pwa-install` with `display: none !important;`. Apply compact pill styling to `.btn-cmd-palette` (`padding: 4px 7px; border-radius: 999px; font-size: 13px;`). Compact `.topbar-actions` to `gap: 3px; padding: 0;` and reduce language/theme toggle paddings.
     - At `@media (max-width: 480px)`: Hide `.brand-title` with `display: none !important;` while preserving the prominent `💰` icon. This saves ~110px of width with zero brand loss.
     - At `@media (max-width: 380px)`: Set `.topbar-actions { gap: 2px; }` and apply micro-compact padding (`3px 5px` on toggles, `3px 6px` on icon buttons).
  2. **Deterministic Verification via Headless CDP:**
     - Verified across all viewports (480px, 414px, 390px, 375px, 360px, 320px). At 320px, total topbar inner width is reduced to ~238px with the rightmost button `#btn-settings-modal` ending at 315px, leaving 5px of comfortable margin and strictly 0px horizontal overflow (`scrollWidth === clientWidth`).
     - Verified desktop viewports (> 768px) remain 100% unaltered with desktop tabs, brand title, and "Ctrl+K" badges visible.
  3. **Automated Regression Defense (`tests/smoke.test.mjs`):**
     - Added permanent smoke tests asserting responsive media queries and element hiding rules for `.cmd-k-badge`, `#lbl-pwa-install`, and `.brand-title`.

### 2026-10-19: Mobile Responsive Menu Wrapping & PVD Tax Container Margin Harmonization (v2.5.57)
- **Date & Context:** 2026-10-19, Phase 114 Mobile Responsive Menu Wrapping & PVD Margin Alignment (`v2.5.57`).
- **Problem:**
  1. On mobile viewports ($\le 414\text{px} / 375\text{px} / 320\text{px}$), the Executive Financial Dossier card header (`#lbl-dossier-panel-title`) in `dashboard.html` overflowed horizontally offscreen. The header row contained a title, sync status badge, and 3 action buttons (`btnTogglePrivacyMask`, `btnPrintDossier`, `btnShareDossier`) totaling over 600px width without flex wrapping, causing the 3rd button ("แชร์รายงาน / Share Dossier") to clip outside the viewport so that "พิมพ์รายงาน / Print Dossier" appeared as the last menu item on screen.
  2. In `tax-calculator.html` (PVD & Severance Tax), legacy standalone styles (`body { display: flex; align-items: center; justify-content: center; padding: 24px; }` and `.card { padding: 28px 32px 32px; }`) introduced 56px margins on both sides (112px total reduction), severely cramping 2-column input fields and calculation tables on mobile devices compared to `remaining-money.html`. Furthermore, `min-height: 100vh; display: flex; align-items: center;` caused unnatural vertical centering when embedded in iframe hosts.
- **Root Cause:** Absence of `flex-wrap: wrap` on multi-button card headers, and legacy pre-standard styling in `tax-calculator.html` that failed to follow the standardized container geometry established across the other iframe tools.
- **Solution & Rule:**
  1. **Mobile Multi-Action Header Wrapping (`dashboard.html`):**
     - Declare `flex-wrap: wrap; gap: 8px;` on `h1` and `.panel-title`.
     - In `@media (max-width: 640px)`, switch `#lbl-dossier-panel-title` to column stacking (`flex-direction: column; align-items: stretch; gap: 10px;`) with a full-width action button group (`.dossier-action-group` with `width: 100%; flex-wrap: wrap; gap: 8px;` and `flex: 1 1 auto` on all buttons), guaranteeing zero horizontal clipping and accessible tap targets down to 320px viewports.
  2. **Harmonized Container Padding Standard (`tax-calculator.html`):**
     - Replace legacy body and card padding with the canonical tool standard: `body { margin: 0; padding: 26px 16px 70px; max-width: 520px; margin-inline: auto; }` and `.card { padding: 20px 16px 24px; }` (with `@media (max-width: 480px) { .card { padding: 16px 12px 20px; } }`).
     - This recovers 48px of usable horizontal screen real estate for mobile inputs and tables and eliminates jarring vertical displacement inside iframe shells.
  3. **Automated Regression Defense (`tests/smoke.test.mjs`):**
     - Added permanent smoke assertions asserting `@media (max-width: 640px)` header flex-wrap rules and verifying that legacy 56px margins in `tax-calculator.html` remain absent.

### 2026-10-19: W3C Web App Manifest Polish, Rich Install Prompts & Offline Readiness Indicator (v2.5.53)
- **Date & Context:** 2026-10-19, Phase 110 Web App Manifest & Lighthouse PWA 100 Polish (`v2.5.53`).
- **Problem:**
  1. The Web App Manifest lacked modern W3C identification, internationalization metadata (`id`, `lang`, `dir`, `orientation`), App Shortcuts, and form-factor differentiated screenshot previews (`wide` and `narrow`), preventing Chromium and mobile browsers from presenting rich install UI dialogs.
  2. Install promotions relied on default browser ambient badges without an explicit in-app install action trigger or install lifecycle telemetry.
  3. Users lacked visual feedback on offline readiness and network connectivity transitions in the shell footer.
- **Root Cause:** Incomplete manifest metadata relative to modern W3C PWA Installability specifications, and unhandled `beforeinstallprompt` / `appinstalled` browser lifecycle events.
- **Solution & Rule:**
  1. **W3C Web App Manifest Standards for Rich Install Prompts:**
     - Always provide unique application identifier `"id": "money-superapp"` distinct from `start_url` to prevent app identity fragmentation.
     - Specify `"lang": "th-TH"`, `"dir": "ltr"`, and `"orientation": "any"` in `manifest.json`.
     - Include quick App Shortcuts (`shortcuts`) pointing to major core tools (`#dashboard`, `#remaining-money`, `#rebalance`, `#tax-calculator-base`) with valid icon sizes.
     - Provide responsive vector screenshot descriptors with explicit `form_factor` (`"wide"` for desktop viewports $\ge 1280\times 720$ and `"narrow"` for mobile viewports $\le 390\times 844$) and precache screenshot assets in Service Worker (`sw.js`).
  2. **Install Lifecycle Event Handling (`beforeinstallprompt` & `appinstalled`):**
     - Capture `beforeinstallprompt`, call `e.preventDefault()`, store deferred prompt event, and reveal custom `#btn-pwa-install` action button in the topbar.
     - On user click, invoke `deferredPrompt.prompt()` and await `userChoice`.
     - Listen to `appinstalled` to immediately hide the install trigger, clear deferred prompt reference, and dispatch telemetry/notification.
  3. **Dual Offline Readiness & Connectivity Monitoring:**
     - Provide an offline status indicator (`#pwaOfflineBadge`) in the shell privacy bar with an active status dot.
     - Monitor both `window.addEventListener('online')` / `offline` and `navigator.serviceWorker.controller` readiness.
     - When offline or disconnected, update the badge text to "โหมดออฟไลน์ (ใช้งานได้)" / "Offline mode (ready)" with appropriate styling, reassuring users that all calculations run locally without network access.
  4. **Quality Gates & Automated Verification:**
     - Created `tests/pwa-manifest.test.mjs` verifying manifest schema, shortcuts, screenshot form factors, disk file presence, SW cache integrity, and DOM element contracts.
     - Ensured 100% dictionary symmetry in `th.js` and `en.js` for all PWA UI strings.

### 2026-10-19: Performance Optimizations: Preload Hints, Speculative Prefetch & CSS Content-Visibility (v2.5.52)
- **Date & Context:** 2026-10-19, Phase 109 Tier 3 Performance & Optimization Initiative (`v2.5.52`).
- **Problem:**
  1. Standalone tool navigation inside the app-shell iframe incurred cold-fetch roundtrips before displaying iframe content, causing brief skeleton loader flashes.
  2. Long, multi-section tools (`dashboard.html`, `rebalance.html`, `tax-calculator-base.html`) rendered offscreen accordion card bodies and tables on initial load, consuming unnecessary layout and composite calculation cycles on mobile devices.
  3. Nav button clicks were reactive rather than speculative, missing the ~100-300ms window between user hover/touch and click.
- **Root Cause:** Absence of resource hints (`preload`/`prefetch`), absence of CSS `content-visibility: auto`, and purely click-triggered navigation.
- **Solution & Rule:**
  1. **Resource Hints in Shell (`index.html`):** Added `<link rel="preload" href="css/theme.css" as="style">` for instantaneous FCP, and prefetch hints for high-frequency destination pages (`dashboard.html`, `remaining-money.html`, `css/tailwind-lite.css`).
  2. **Speculative Tab Prefetching (`js/app-shell.js`):** Implemented `prefetchTabUrl(src)` triggered on `pointerenter` and `touchstart` with `{ passive: true }`, ensuring destination tool pages are warm in browser cache before click completion.
  3. **CSS Content-Visibility Optimization (`css/theme.css`):** Introduced `.content-visibility-auto` with `contain-intrinsic-size: 1px 280px;` for `.panel.reorder-card:not(:first-child)`, allowing modern browsers to skip layout and painting for offscreen cards until scrolled into view without layout shift.
  4. **Automated Performance Test Suite (`tests/performance.test.mjs`):** Created 5 automated tests validating resource hints, content-visibility rules, speculative prefetch listeners, complete service worker cache manifest coverage, and 100-iteration calculation speed benchmarks (<50ms).
  5. **Quality Gates & Smoke Test:** Phase 109 assertions verified in `tests/smoke.test.mjs`, 583/583 tests passing across 148 suites, 0 Biome errors/warnings.


### 2026-10-19: Zero-Build JSDoc Type Annotations & Contract Verification Suite - Batch 3 (v2.5.51)
- **Date & Context:** 2026-10-19, Phase 108 Pillar 6 Type Safety Initiative (`v2.5.51`).
- **Problem:**
  1. The remaining 6 modularized engines in `js/engines/` (`budget-import.js`, `cashflow-viz.js`, `financial-health.js`, `i18n-core.js`, `rebalance-subtools.js`, `tax-worksheet.js`) lacked formal JSDoc `@typedef` schemas.
  2. In `cashflow-viz.js`, `classifyBudgetType(item)` evaluates keywords such as `pvd`, `สำรองเลี้ยงชีพ`, `ออม`, `ลงทุน`, but arbitrary asset descriptions like "กองทุน ThaiESG" without an explicit `budgetType: 'saving'` fallback to 'want', leading to contract test assertion mismatches if not explicitly annotated with `budgetType`.
  3. `calculateSankeyFlows` returns `totalVolume`, `isDeficit`, `deficitAmount`, `nodes`, `links` rather than echoing gross breakdown values directly on the root object, which needed exact schema alignment in the contract definitions.
- **Root Cause:** Absence of JSDoc typedef annotations on Batch 3 engines, and slight disparity between internal Sankey flow layout properties and external caller assumptions.
- **Solution & Rule:**
  1. **Comprehensive JSDoc Type Schemas (Batch 3):** Annotated all 6 remaining engines:
     - `budget-import.js`: `BudgetImportIncome`, `BudgetImportExpense`, `BudgetImportSaving`, `BudgetImportCandidate`, `BudgetDetectedColumns`
     - `cashflow-viz.js`: `Budget503020Params`, `BudgetRuleDonutArcs`, `BudgetRule503020Result`, `EmergencyRunwayResult`, `SankeyNode`, `SankeyLink`, `SankeyFlowResult`
     - `financial-health.js`: `FinancialPillars`, `FinancialHealthScoreResult`, `NextBestMoveItem`, `RadarSpoke`, `RadarPointCoordinate`, `RadarCoordinatesResult`, `NetWorthCompositionResult`
     - `i18n-core.js`: `SupportedLanguage`, `I18nDictionary`, `I18nInterpolationParams`
     - `rebalance-subtools.js`: `ThaiGoldLot`, `ThaiGoldSubtoolState`, `ForeignTaxSubtoolState`, `GlidepathSubtoolState`
     - `tax-worksheet.js`: `TaxWorksheetReportContext`, `TaxWorksheetDividendContext`, `TaxWorksheetEFilingContext`
  2. **Automated Batch 3 Contract Test Suite (`tests/type-contracts-batch3.test.mjs`):** Built 16 tests verifying all 6 engines conform to declared schemas, bounds, and behaviors.
  3. **100% Core Engine Type Safety Milestone Reached:** All 21 modularized calculation and domain engines in `js/engines/` are now 100% typed with zero-build JSDoc and verified by 43 automated contract test fixtures across 3 test suites (`tests/type-contracts*.test.mjs`).
  4. **Quality Gates & Smoke Test:** Phase 108 assertions verified in `tests/smoke.test.mjs`, 577/577 tests passing across 142 suites, 0 Biome errors/warnings.


### 2026-10-19: Zero-Build JSDoc Type Annotations & Contract Verification Suite - Batch 2 (v2.5.50)
- **Date & Context:** 2026-10-19, Phase 107 Pillar 6 Type Safety Initiative (`v2.5.50`).
- **Problem:**
  1. Core financial modeling, bank statement parsing, offline cryptographic vault, and P2P synchronization engines in `js/engines/` (`retirement-buckets.js`, `property-tax.js`, `bank-parser.js`, `refinance.js`, `stress-test.js`, `vault-crypto.js`, `p2p-sync.js`, `bridge.js`) lacked formal JSDoc `@typedef` schemas.
  2. In `p2p-sync.js`, `chunkPayload(payload, maxChunkSize, transferId)` has an internal safety clamp `Math.max(50, maxChunkSize || 200)`. Any unit test attempting to test chunking with payloads shorter than 50 characters produced only 1 chunk regardless of requested `maxChunkSize`, causing subtle contract test assertion surprises.
- **Root Cause:** Absence of JSDoc typedef annotations on Batch 2 engines, and undocumented minimum threshold constraint in P2P payload chunking.
- **Solution & Rule:**
  1. **Comprehensive JSDoc Type Schemas (Batch 2):** Annotated all 8 engines with `@typedef`, `@param`, and `@returns` schemas:
     - `retirement-buckets.js`: `RetirementThreeBucketsParams`, `RetirementThreeBucketsResult`
     - `property-tax.js`: `ThaiPropertyTaxTierDetail`, `ThaiPropertyTaxParams`, `ThaiPropertyTaxResult`
     - `bank-parser.js`: `ThaiBankParsedTransaction`, `ThaiBankLineItem`, `ThaiBankSummary`, `ThaiBankCandidate`, `ThaiBankStatementParsedResult`
     - `refinance.js`: `DebtPayoffSimulationResult`, `DebtVelocityComparisonResult`, `TaxAccrualPlanResult`, `DebtConsolidationResult`
     - `stress-test.js`: `IncomeShockStressTestResult`, `ChildEducationFundResult`
     - `vault-crypto.js`: `VaultEnvelope`, async PIN hashing and salt generation contracts
     - `p2p-sync.js`: `QrSvgOptions`, `P2PPayloadChunk`, `P2PAssemblyResult`
     - `bridge.js`: `BridgeEnvelope`, `BridgePeekResult`, `BridgeSendOptions`, `BridgeTargetOptions`
  2. **Automated Batch 2 Contract Test Suite (`tests/type-contracts-batch2.test.mjs`):** Implemented 14 exhaustive contract validation tests ensuring runtime return objects match declared types, number ranges, and structural keys.
  3. **P2P Chunking Invariant:** Verified test fixtures supply payloads >50 characters when testing multi-chunk assembly logic.
  4. **Quality Gates & Smoke Test:** Phase 107 assertions verified in `tests/smoke.test.mjs`, 560/560 tests passing across 135 suites, 0 Biome errors/warnings.


### 2026-10-19: Zero-Build JSDoc Type Annotations & Automated Type Contract Test Suite (v2.5.49)
- **Date & Context:** 2026-10-19, Phase 106 Pillar 6 Type Safety Initiative (`v2.5.49`).
- **Problem:**
  1. The money-superapp repository strictly enforces ADR-001 (zero-build, 100% offline-first, client-side private, zero NPM runtime dependencies). Migrating to TypeScript is prohibited as it would introduce a mandatory build/transpilation step or breaking runtime dependencies.
  2. However, core financial calculation engines in `js/engines/` lacked formal type schemas, leading to occasional silent schema mismatches (e.g. the historical v2.5.7 `effectiveTaxRatePct` vs `effectiveTaxRate` bug).
  3. Running `npx tsc` can stall waiting for interactive network prompts if TypeScript is not locally installed.
- **Root Cause:** Absence of a zero-build type-checking configuration and automated contract verification test suite for core calculation engine functions.
- **Solution & Rule:**
  1. **Zero-Build Type Safety via `jsconfig.json`:** Created root `jsconfig.json` configuring `checkJs: true`, `target: "ES2022"`, `moduleResolution: "NodeNext"`, and `include: ["js/engines/**/*"]`, delivering IDE and editor type diagnostics with zero compilation build steps.
  2. **Comprehensive JSDoc Type Contracts (Batch 1 Core Engines):** Annotated 7 core mathematical/statutory engines (`thai-pit.js`, `thai-tax-calendar.js`, `insurance.js`, `gold.js`, `foreign-tax.js`, `inheritance-tax.js`, `glidepath.js`) with exhaustive `@typedef`, `@param`, `@returns`, and `@property` annotations.
  3. **Automated Type Contract Test Suite (`tests/type-contracts.test.mjs`):** Built 13 comprehensive unit tests validating runtime output schemas, property types, numerical bounds, and edge cases (NaN, string numbers, negative values) across all 7 Batch 1 engines.
  4. **Quality Gates & Smoke Test:** Added Phase 106 smoke assertions in `tests/smoke.test.mjs`, verified 545/545 tests passing across 126 suites (0 failures), and 0 Biome lint errors/warnings.


### 2026-10-19: Subagent Timeout & 1-Minute Heartbeat Monitoring Protocol
- **Date & Context:** 2026-10-19, Multi-Agent SDLC Operations & Process Enforcement.
- **Problem:**
  1. Long-running or delegated subagent tasks can silently hang or stall without proactive oversight, delaying SDLC pipeline velocity.
- **Root Cause:** Absence of a mandatory heartbeat schedule and timeout enforcement mechanism for subagent dispatches.
- **Solution & Rule:**
  1. **Mandatory Timeout Setting:** Whenever subagents are invoked (`invoke_subagent`), explicit operational timeouts must be set based on task complexity.
  2. **1-Minute Heartbeat Schedule:** Use the `schedule` tool (e.g. `DurationSeconds=60` / cron) to proactively re-check subagent status every 1 minute via `manage_subagents list`.
  3. **Liveness & Action:** If a subagent is running normally, monitor; if finished or idle, consume results; if stalled or unresponsive past timeout, inspect logs, terminate with `manage_subagents kill`, and escalate.
  4. **Codified in SDLC Team Guidelines:** Formally added to `AGENTS.md` (Rule #6), `.ai/routing.yaml` (`guardrails.subagent_monitoring`), and `.ai/agents/orchestrator.md` (Section 5).

### 2026-10-18: Universal Declarative i18n & Exhaustive Coverage Suite (v2.5.48)
- **Date & Context:** 2026-10-18, Phase 105 Universal Declarative i18n & Coverage Test (`v2.5.48`).
- **Problem:**
  1. While Phases 100–104 rolled out `data-i18n` attributes across all 7 tool sub-pages, the host `index.html` shell (85+ modal and settings controls, quick tour, storage health, PWA toast, Google Drive sync, and offline QR sync) still relied on manual imperative DOM text assignments.
  2. Without an automated, exhaustive crawler verifying that every `data-i18n` key referenced in HTML actually resolves to both languages, latent typos or missing keys could slip into production (as discovered during the audit where 5 action buttons in `rebalance.html` and `lblPool500kTitle` in `tax-calculator-base.html` were missing from dictionaries).
- **Root Cause:** Transition to declarative `data-i18n` lacked an automated static verification suite that cross-checks HTML AST against dictionary registrations.
- **Solution & Rule:**
  1. **Complete Declarative Coverage on `index.html`:** Added 85+ declarative `data-i18n` attributes across all modals, panels, and tooltips in `index.html`.
  2. **Audit & Reconciliation:** Added missing action buttons (`lblCopyPortfolio`, `lblCopyTrade`, `lblExportCsv`, `lblPrintRebalance`, `resetBtn`) to `js/rebalance.js` and `lblPool500kTitle` to `js/tax-calculator-base.js`.
  3. **Permanent Exhaustive Coverage Test (`tests/i18n-coverage.test.mjs`):** Built automated test suite auditing all 8 HTML files and all 728 `data-i18n*` attributes, verifying 100% key existence in both Thai and English, non-empty text, and parameter placeholder (`{param}`) consistency.
  4. **Quality Gates & Invariants:** Added Phase 105 smoke assertions in `tests/smoke.test.mjs`, achieved 531/531 tests passing across 118 test suites (0 failures), 0 Biome lint errors/warnings, and zero CSP/offline violations.

### 2026-10-18: Declarative data-i18n Localization Migration for Tax & Payslip Tools (v2.5.47)
- **Date & Context:** 2026-10-18, Phase 104 Declarative data-i18n Migration (`v2.5.47`).
- **Problem:**
  1. `tax-calculator.html`, `tax-calculator-base.html`, and `months-slips.html` possessed huge amounts of static and dynamic UI markup (withholding tax, dividend tax credits, e-filing worksheets, severance & PVD tax tiers, 12-month payslip streams, PromptPay refund trackers, and job scenario comparisons) that were partially localized through ad-hoc `EN` dictionaries and manual DOM replacements.
  2. One-way `EN` dictionaries in `js/tax-calculator.js`, `js/tax-calculator-base.js`, and `js/months-slips.js` prevented key symmetry auditing and could not leverage the new `MoneyApp.I18n` declarative engine.
- **Root Cause:** Legacy per-page scripts written with unidirectional English overrides before the unified i18n engine was introduced.
- **Solution & Rule:**
  1. **Declarative DOM Localization (`data-i18n`):** Decorated all static section headings, subtitles, card headers, helper notes, and button controls across `tax-calculator.html`, `tax-calculator-base.html`, and `months-slips.html` with declarative `data-i18n` attributes.
  2. **Bidirectional Translation Symmetry:** Converted one-way `const EN` in all three scripts into symmetrical `const translations = { th: {...}, en: {...} }` containing 102 keys (tax-calculator-base), 66 keys (months-slips), and 40+ keys (tax-calculator), registering them with `MoneyApp.I18n.register()` and applying with `MoneyApp.I18n.applyLocalization()`.
  3. **Backward Compatibility Preservation:** Retained `const EN = translations.en` in all three files to ensure legacy runtime references and tests continue functioning without regressions.
  4. **Quality Gates & Test Integration:** Added all three files to `LOCALIZED_MODULES` in `tests/bilingual-parity.test.mjs`, added Phase 104 smoke invariants in `tests/smoke.test.mjs`, and verified 498/498 passing tests (0 failures), 0 Biome warnings, and 0 headless Chrome live DOM bilingual discrepancies across all 8 core application pages.

### 2026-10-18: Declarative data-i18n Localization Migration for Remaining Money & Rebalance Tools (v2.5.46)
- **Date & Context:** 2026-10-18, Phase 103 Declarative data-i18n Migration (`v2.5.46`).
- **Problem:**
  1. `remaining-money.html` and `rebalance.html` previously relied solely on hardcoded `const EN = {...}` objects and manual `document.getElementById(...)` lookups in `applyLang()`.
  2. The translation structure was unidirectional (only English keys were defined, relying on the static HTML for Thai text), which prevented automated bidirectional symmetry verification and required repetitive imperative DOM mutations.
- **Root Cause:** Legacy architecture built before the centralized `MoneyApp.I18n` engine (`Phase 100`) was available.
- **Solution & Rule:**
  1. **Declarative DOM Localization (`data-i18n`):** Decorated all static UI elements (eyebrows, titles, subtitles, summary cards, cashflow toggle buttons, 50/30/20 labels, stress tester controls, modal dialogues, glidepath planners, physical gold calculators, and foreign tax advisor panels) with declarative `data-i18n` attributes.
  2. **Bidirectional Translation Symmetry:** Converted one-way `const EN` in `js/remaining-money.js` and `js/rebalance.js` into bidirectional `const translations = { th: {...}, en: {...} }` with 100% symmetrical keys, registering both with `MoneyApp.I18n.register()` and applying via `MoneyApp.I18n.applyLocalization()`.
  3. **Backward Compatibility:** Retained `const EN = translations.en` for any legacy dynamic string references, ensuring zero runtime breakage.
  4. **Quality Gates & Test Integration:** Added both modules to `LOCALIZED_MODULES` in `tests/bilingual-parity.test.mjs`, added Phase 103 smoke invariants in `tests/smoke.test.mjs`, and verified 494/494 passing tests (0 failures), 0 Biome warnings, and 0 headless Chrome live DOM bilingual discrepancies.


### 2026-10-18: Declarative data-i18n Localization Migration for Dashboard & Debt Tools (v2.5.45)
- **Date & Context:** 2026-10-18, Phase 102 Declarative data-i18n Migration (`v2.5.45`).
- **Problem:**
  1. `dashboard.html` and `debt-calculator.html` used heavy manual ID-based text replacement in `applyLocalization()`, mapping dozens of individual DOM element IDs (`lbl-kpi-networth`, `lbl-strategy-title`, etc.) imperatively.
  2. Any newly added card or label required manual wiring in two places: the HTML element ID and the JS dictionary mapping, which historically resulted in missed translations and live DOM bilingual parity failures.
- **Root Cause:** Transition from legacy imperative localization to the new declarative `MoneyApp.I18n` engine needed to be rolled out per module.
- **Solution & Rule:**
  1. **Declarative DOM Attributes (`data-i18n`):** Decorated headers, subheaders, KPI labels, velocity comparisons, refinance/mortgage simulators, and schedule headings across `dashboard.html` and `debt-calculator.html` with declarative `data-i18n` attributes.
  2. **Coordinated Dual-Engine Localization:** Both `js/dashboard.js` and `js/debt-calculator.js` register their locale dictionaries with `MoneyApp.I18n.register()` and invoke `MoneyApp.I18n.applyLocalization(document, LANG)`, while retaining the legacy `translations` object for 100% backward compatibility with structural parity tests.
  3. **Quality Gates & Invariants:** Added Phase 102 regression smoke assertions in `tests/smoke.test.mjs`, verified 491 tests passing (109 test suites), 0 Biome lint errors/warnings, and 0 headless Chrome live DOM bilingual parity discrepancies.

### 2026-10-18: Centralized Domain Dictionaries & Automated Key Symmetry (v2.5.44)
- **Date & Context:** 2026-10-18, Phase 101 Centralized Domain Dictionaries (`v2.5.44`).
- **Problem:**
  1. Translation strings were fragmented across individual JavaScript files, preventing holistic auditing and making it easy for one language to get out of sync with another during feature development.
  2. Developers had no single source of truth for standard domain terms (financial indicators, tax terms, loan terminology, budget categories).
- **Root Cause:** Domain dictionaries grew organically within separate tool scripts without a shared repository.
- **Solution & Rule:**
  1. **Dedicated Dictionary Modules (`js/i18n/th.js` & `js/i18n/en.js`):** Extracted comprehensive domain dictionaries spanning common controls, dashboard, debt freedom, tax planning, cash flow budgeting, portfolio rebalancing, and payslip simulation.
  2. **Automated Registration:** Both modules auto-register with `MoneyApp.I18n` on initialization and export to `MoneyApp.i18n.th` and `MoneyApp.i18n.en`.
  3. **Strict Parameter Consistency:** Validated that named parameter placeholders (`{param}`) match 100% symmetrically between Thai and English.
  4. **Quality Gates & Invariants:** Added `tests/i18n-dictionaries.test.mjs` (5 unit tests), updated `tests/smoke.test.mjs` (69 smoke tests), verified full test suite (490 tests passing across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Centralized Internationalization Core & Declarative data-i18n (v2.5.43)
- **Date & Context:** 2026-10-18, Phase 100 i18n Architecture Overhaul (`v2.5.43`).
- **Problem:**
  1. Translations were scattered across ad-hoc per-file objects and imperative `if (LANG === 'en')` blocks across multiple tools, making translation key drift the single most recurring defect pattern in the repository (5 separate incidents in the lessons log).
  2. Dynamic localization required repetitive imperative DOM mutations (`document.getElementById(...).textContent = ...`) prone to missed element IDs.
- **Root Cause:** Absence of a centralized translation registry and declarative DOM binding engine.
- **Solution & Rule:**
  1. **Centralized I18n Core (`js/engines/i18n-core.js`):** Implemented `MoneyApp.I18n` with `register(lang, dict)`, `getDictionary(lang)`, `setLanguage(lang)`, `getLanguage()`, `t(key, fallback, params, lang)`, and `applyLocalization(root, lang)`.
  2. **Declarative DOM Localization:** Supported `[data-i18n]`, `[data-i18n-placeholder]`, `[data-i18n-title]`, and `[data-i18n-aria-label]` attributes, automatically localizing subtrees without manual ID wiring.
  3. **Parameter Interpolation:** Built-in template variable interpolation (`{name}`, `{amount}`, `{count}`) with safe stringification.
  4. **Strict Symmetry:** Enforced 100% key symmetry between Thai and English base dictionaries with zero drift.
  5. **Quality Gates & Invariants:** Added `tests/i18n-core.test.mjs` (5 unit tests), updated `tests/smoke.test.mjs` (68 smoke tests), full test suite (484 tests passing across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Decompose tax-calculator-base.js: E-Filing Worksheet & Tax Dossier Engine (v2.5.42)
- **Date & Context:** 2026-10-18, Phase 99 Engine Modularization (`v2.5.42`).
- **Problem:**
  1. `js/tax-calculator-base.js` was 3,101 lines long, mixing tax bracket stepping and deduction models with over 700 lines of e-filing worksheet coordinate logic (ภ.ง.ด. 90/91 field mapping, Section 47 500k statutory retirement pool warnings, preflight compliance checklists, clipboard synchronizers, Section 47 bis dividend tax credit UI, and formal tax dossier print rendering).
  2. The e-filing worksheet and dossier generation logic was tightly bound to the tax calculator DOM controller, preventing headless integration and unit testing.
- **Root Cause:** E-filing synchronization and printable tax dossier reporting were appended directly into `tax-calculator-base.js` across multiple feature phases.
- **Solution & Rule:**
  1. **Modular Worksheet & Dossier Engine (`js/engines/tax-worksheet.js`):** Extracted `MoneyApp.TaxWorksheet` providing `formatReportDate`, `showCopyFeedback`, `copyEFilingField`, `copyAllEFilingSummary`, `updateDividendTaxCreditUI`, `updateEFilingWorksheetView`, and `updatePrintReportView`.
  2. **Clean Tax Controller Delegation:** Delegated dividend tax credit UI, worksheet coordinate rendering, and print dossier reporting in `js/tax-calculator-base.js` to `MoneyApp.TaxWorksheet`, shrinking `tax-calculator-base.js` from 3,101 down to 2,470 lines (shrunk by 631 lines).
  3. **Backward-Compatible Global Exposure:** Preserved global function attachments (`window.copyEFilingField`, `window.copyAllEFilingSummary`, `window.updateDividendTaxCreditUI`) for unbroken onclick handler execution from `tax-calculator-base.html`.
  4. **Quality Gates & Invariants:** Added `tests/tax-worksheet.test.mjs` (4 unit tests), updated `tests/smoke.test.mjs` (67 smoke tests), verified full test suite (478 passing tests across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Decompose rebalance.js: Portfolio Auxiliary Sub-tools Engine (v2.5.41)
- **Date & Context:** 2026-10-18, Phase 98 Engine Modularization (`v2.5.41`).
- **Problem:**
  1. `js/rebalance.js` was bloated at 3,558 lines, mixing the core portfolio rebalancer and asset allocation logic with over 800 lines of auxiliary sub-tools: Thai Gold Bar & Jewelry DCA Calculator & P/L Optimizer, Foreign Investment & Crypto Repatriation Tax Advisor (Orders P.161 & P.162), and Target Date Retirement Glidepath Calculator.
  2. Auxiliary sub-tool logic was tightly coupled to rebalance page lifecycle, making independent unit testing cumbersome.
- **Root Cause:** Auxiliary calculators were appended directly to `rebalance.js` as roadmap features expanded without dedicated domain sub-tool engines.
- **Solution & Rule:**
  1. **Modular Sub-tools Engine (`js/engines/rebalance-subtools.js`):** Extracted `MoneyApp.RebalanceSubtools` providing dedicated state management, persistence, calculations, and UI coordinators for Gold, Foreign Tax, and Glidepath.
  2. **Zero-Breaking Rebalance Delegation:** Delegated all auxiliary methods in `js/rebalance.js` to `MoneyApp.RebalanceSubtools` while preserving backward-compatible global function exposure (`toggleThaiGoldCalculator`, `setGoldWeightPreset`, `updateGoldCalculator`, `syncGoldMarketPrice`, etc.), reducing `rebalance.js` from 3,558 down to 2,912 lines (shrunk by 646 lines).
  3. **Bridge Persistence Invariants:** Preserved explicit cross-tool bridge storage keys (e.g. `moneySuperapp.pendingDcaBudget`) in both the engine and controller to maintain unbroken cross-module communications.
  4. **Quality Gates & Invariants:** Added `tests/rebalance-subtools.test.mjs` (5 unit tests), updated `tests/smoke.test.mjs` (66 smoke tests), achieved 100% test pass rate (473 tests across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Decompose dashboard.js: Financial Health & Advisor Engine (v2.5.40)
- **Date & Context:** 2026-10-18, Phase 97 Engine Modularization (`v2.5.40`).
- **Problem:**
  1. `js/dashboard.js` was the largest monolithic file in the codebase at 4,152 lines, mixing overview charts with 450+ lines of pure advisory scoring (5-pillar composite health scores, priority-ranked Next Best Moves heuristics, 5-axis spider chart geometry, and net worth solvency math).
  2. The financial advisory algorithms were trapped inside the dashboard DOM controller, preventing them from being independently tested or utilized in summary reports.
- **Root Cause:** Financial advisory heuristics and SVG radar trigonometry grew directly inside the dashboard lifecycle handlers without domain modularization.
- **Solution & Rule:**
  1. **Modular Advisory Engine (`js/engines/financial-health.js`):** Extracted `MoneyApp.FinancialHealth` exporting `calculateFinancialHealthScore`, `generateNextBestMoves`, `calculateRadarCoordinates`, `renderRadarChartSVG`, and `calculateNetWorthComposition`.
  2. **Clean Dashboard Delegation:** Delegated scoring, next moves, radar SVG rendering, and solvency math in `js/dashboard.js` to `MoneyApp.FinancialHealth`, reducing `dashboard.js` size by ~250 lines while preserving complete backward compatibility.
  3. **Quality Gates & Invariants:** Added `tests/financial-health.test.mjs` (6 unit tests), updated `tests/smoke.test.mjs` (65 smoke tests), achieved 100% test pass rate (467 tests across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Decompose remaining-money.js: Budget Data Importer & Parser Engine (v2.5.39)
- **Date & Context:** 2026-10-18, Phase 96 Engine Modularization (`v2.5.39`).
- **Problem:**
  1. `js/remaining-money.js` contained ~500 lines of low-level CSV character scanning, quote escaping, column heuristic detection, and JSON backup parsing tightly coupled to the UI controller.
  2. In unit test suites loaded via `node:vm` scripts, arrays returned from the engine have prototype descriptors bound to the VM realm rather than the test runner's global realm, which causes Node's `assert.deepStrictEqual` to fail on structural array comparisons even when elements are identical.
- **Root Cause:** Ingestion logic was mixed directly with modal preview DOM logic; Node.js assert strictly compares `Array.prototype` across realms.
- **Solution & Rule:**
  1. **Modular Ingestion Engine (`js/engines/budget-import.js`):** Extracted `MoneyApp.BudgetImport` exporting `parseCSVRows`, `detectColumns`, `cleanField`, `cleanAmount`, `isSubtotalRow`, `parseImportJSON`, and `parseImportCSV`.
  2. **Realm-Safe Test Assertions:** In VM-loaded test harnesses, wrap VM array outputs in `Array.from(vmArray)` before passing to `assert.deepEqual` to ensure prototype consistency across realms.
  3. **Backward Compatible Delegation:** Retained backward-compatible wrapper functions in `remaining-money.js`, shrinking the file by another ~387 lines to 3,445 LOC (reduced by 1,000 LOC total from original 4,442 LOC).
  4. **Quality Gates:** Added `tests/budget-import.test.mjs` (7 tests), updated `tests/smoke.test.mjs` (64 smoke tests), achieved 100% test pass rate (460 tests across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: Decompose remaining-money.js: Cash Flow Visualization Engine (v2.5.38)
- **Date & Context:** 2026-10-18, Phase 95 Engine Modularization (`v2.5.38`).
- **Problem:**
  1. `js/remaining-money.js` was bloated at 4,442 LOC, mixing high-level budgeting CRUD and transaction tables with 650+ lines of low-level SVG visualization math: Sankey ribbon cubic bezier generators, 3-column node flow conservation, Waterfall step connectors, and 50/30/20 budget compliance donut arc geometry.
  2. The SVG visualization logic was tightly coupled to page-specific DOM structures, preventing other modules (such as the executive dossier or monthly slips) from easily reusing or rendering flow diagrams.
- **Root Cause:** Visualization algorithms evolved directly inside the monolithic page controller without modular separation of pure flow math from DOM rendering.
- **Solution & Rule:**
  1. **Pure Engine Modularization (`js/engines/cashflow-viz.js`):** Extracted `MoneyApp.CashflowViz` exporting `classifyBudgetType`, `calculateBudgetRule503020`, `calculateEmergencyRunway`, `generateSankeyRibbonPath`, `calculateSankeyFlows`, `renderCashflowWaterfall`, and `renderCashflowSankey`.
  2. **Backward Compatible Delegation:** Retained identical function signatures in `js/remaining-money.js` delegating to `MoneyApp.CashflowViz`, shrinking `remaining-money.js` by over 600 lines while maintaining 100% API stability.
  3. **Multi-File Safe Replacements:** For large contiguous blocks in sprawling legacy controllers, decompose into targeted sub-sections (e.g. waterfall, budget rule, sankey) to guarantee deterministic, zero-offset diffs.
  4. **Quality Gates:** Added `tests/cashflow-viz.test.mjs` (8 unit tests), updated `tests/smoke.test.mjs` (63 smoke tests), achieved 100% test pass rate (452 tests across 109 suites), zero Biome errors/warnings, and zero CSP violations.

### 2026-10-18: safeHTML Tagged Template Sanitizer & Attribute Hardening (v2.5.37)
- **Date & Context:** 2026-10-18, Phase 94 safeHTML & XSS Hardening (`v2.5.37`).
- **Problem:**
  1. Relying on manual calls to `escapeHtml()` when generating dynamic `.innerHTML` templates is error-prone; missing a single interpolation can introduce an XSS vulnerability.
  2. `escapeAttr()` previously only escaped double-quotes (`"`), leaving attributes vulnerable if single-quoted or unquoted.
- **Root Cause:** Absence of a declarative tagged template sanitizer that automatically sanitizes dynamic string variables while leaving static template markup intact.
- **Solution & Rule:**
  1. **Native safeHTML Tagged Template Literal (`js/shared.js`):** Implemented `MoneyApp.safeHTML(strings, ...values)` which automatically sanitizes string interpolations with `escapeHtml()`, preserves numbers/booleans without conversion corruption, flattens arrays, and only permits bypass when values are explicitly wrapped in `MoneyApp.rawHTML(markup)`.
  2. **Comprehensive Attribute Sanitization (`escapeAttr`):** Hardened `escapeAttr()` to sanitize `&`, `"`, `'`, `<`, and `>` across all attribute contexts.
  3. **Verified Quality Gates:** 100% test pass (443 tests across 109 suites) and 0 Biome warnings.

### 2026-10-18: Content Security Policy (CSP) & Automated Security Regression Suite (v2.5.36)
- **Date & Context:** 2026-10-18, Phase 93 Security Hardening & CSP (`v2.5.36`).
- **Problem:**
  1. The 8 HTML files lacked declarative `<meta http-equiv="Content-Security-Policy">` tags, meaning browser defense-in-depth against unauthorized remote scripts, exfiltration, clickjacking, and rogue object plugins was not declaratively enforced.
  2. There was no dedicated automated security regression test suite scanning all production JS files for dangerous execution primitives (`eval()`, `document.write()`, `new Function()`) and banned telemetry trackers.
- **Root Cause:** Security posture previously relied solely on convention and architectural rules without automated continuous verification or declarative browser CSP meta tags.
- **Solution & Rule:**
  1. **Declarative CSP Meta Tags:** Implemented strict CSP meta tags on all 8 core HTML files:
     - Sub-tools: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self';`
     - Application Shell (`index.html`): Scoped to allow local iframes and opt-in user GDrive vault backup.
  2. **Automated Security Test Suite (`tests/security.test.mjs`):** Built 15 unit/smoke assertions proving 100% CSP tag coverage, 0 `eval()`, 0 `document.write()`, 0 `new Function()`, 0 banned telemetry domains, and testing `MoneyApp.escapeHtml` sanitization contracts.
  3. **Architecture Context:** Documented CSP policies and security guarantees in `.ai/context/architecture.md`.
  4. Verified 100% test pass (434 tests across 108 suites) and 0 Biome warnings.

### 2026-10-18: Cross-Tool Unified Bridge Protocol Engine & Node BroadcastChannel Unref (v2.5.35)
- **Date & Context:** 2026-10-18, Phase 92 Unified Bridge Protocol & Topology (`v2.5.35`).
- **Problem:**
  1. Cross-tool handoffs were using 11 disparate, ad-hoc `localStorage` keys without versioned envelopes, consume-once semantics, or schema validation.
  2. Running test files that instantiated `new BroadcastChannel('xxx')` caused Node.js test processes to hang indefinitely without exiting.
- **Root Cause:**
  1. Inter-tool bridges evolved organically across different feature phases without a centralized dispatcher.
  2. Node.js 15+ includes a global `BroadcastChannel` implementation which retains an active handle on the Node event loop by default, blocking process exit until explicitly closed or unreferenced.
- **Solution & Rule:**
  1. **Unified Bridge Engine (`js/engines/bridge.js`):** Created `MoneyApp.Bridge` providing `send()`, `receive()`, `peek()`, `clear()`, `listen()`, `listPending()`, and `clearAll()` with standardized envelope v1, consume-once lifecycle, and backward-compatible legacy key mapping.
  2. **Node Event Loop Unref (`channel.unref()`):** In Node environments where `typeof channel.unref === 'function'`, always invoke `channel.unref()` immediately upon `new BroadcastChannel(...)` creation. Also provide `Bridge.closeChannel()` for explicit teardown.
  3. **Architecture Topology:** Documented the living cross-tool bridge topology with a Mermaid graph in `.ai/context/architecture.md`.
  4. Verified 100% test pass (418 tests across 103 suites) and 0 Biome warnings.

### 2026-10-18: GitHub Actions CI Matrix Pipeline Quality Gate (v2.5.34)
- **Date & Context:** 2026-10-18, Phase 91 GitHub Actions CI Pipeline (`v2.5.34`).
- **Problem:** While local pre-commit hooks prevented broken commits locally, remote pull requests and pushes lacked automated verification against multiple Node.js LTS versions in cloud CI.
- **Root Cause:** Absence of a standardized GitHub Actions workflow file in `.github/workflows/`.
- **Solution & Rule:**
  1. **Multi-Node CI Matrix (`.github/workflows/ci.yml`):** Implemented an automated quality gate executing across Node.js 20 and 22 LTS on `ubuntu-latest`.
  2. **End-to-End Validation:** Automatically runs `npm run lint` (Biome 0 errors, 0 warnings) and `npm test` (all 411 unit, integration, smoke, and headless Chrome CDP bilingual parity tests).
  3. **Regression Smoke Invariant:** Added a smoke assertion verifying `.github/workflows/ci.yml` configuration and Node matrix integrity.

### 2026-10-18: Offline P2P QR Engine & Vault Crypto Extraction (v2.5.33)
- **Date & Context:** 2026-10-18, Phase 90 P2P Sync & Vault Crypto Engine Extraction (`v2.5.33`).
- **Problem:**
  1. `js/shared.js` still housed ~840 lines of non-core utilities: the entire Kazuhiko Arase QR Code Model generator / chunked P2P sync engine and Web Crypto AES-GCM vault encryption.
  2. `index.html` contained the P2P Sync and Vault Encryption UI modals handled by `js/app-shell.js`, but was missing script dependencies for `shared.js`, `vault-crypto.js`, and `p2p-sync.js`.
- **Root Cause:** P2P device transfer and vault security tools were originally placed directly in `shared.js`.
- **Solution & Rule:**
  1. **Modular Engine Extraction (`js/engines/`):** Extracted `js/engines/vault-crypto.js` (~170 LOC) and `js/engines/p2p-sync.js` (~670 LOC) into isolated, self-registering IIFEs attaching cleanly to `global.MoneyApp`.
  2. **Monolith Shrinkage:** Trimmed `js/shared.js` down to 1,722 lines (a cumulative 63% reduction from its original 4,654 lines).
  3. **App Shell Independence:** Explicitly loaded `vault-crypto.js`, `p2p-sync.js`, and `shared.js` in `index.html` before `app-shell.js`, fixing potential unhandled exceptions when exporting encrypted vaults or scanning transfer QR codes from the shell.
  4. Verified 100% test pass (410 tests) and 0 Biome warnings.

### 2026-10-18: Core Engine Modularization Batch 2 & Monolith Shrinkage (v2.5.32)
- **Date & Context:** 2026-10-18, Phase 89 Core Engine Modularization Batch 2 (`v2.5.32`).
- **Problem:**
  1. `js/shared.js` remained overly large (~3,810 lines) harboring 7 distinct calculation domains: Inheritance Tax, 3-Bucket Retirement, Land & Building Tax, Bank Statement CSV Parser, Target-Date Glidepath, Refinance & Debt Payoff, and Income Shock / Child Education Stress Tests.
  2. Test harnesses and sub-pages needed to support both modular engine inclusion and backwards-compatible monolithic namespaces without order-dependence or recursive forwarder loops.
- **Root Cause:** Historical accretion of specialized tools in a monolithic `js/shared.js` file before modular engine directories were established.
- **Solution & Rule:**
  1. **Clean Modular Extraction (`js/engines/`):** Extracted all 7 engines (`inheritance-tax.js`, `retirement-buckets.js`, `property-tax.js`, `bank-parser.js`, `glidepath.js`, `refinance.js`, `stress-test.js`) into zero-build self-registering IIFEs attaching cleanly to `global.MoneyApp`.
  2. **Safe Forwarder Delegation:** Replaced monolithic bodies in `js/shared.js` with re-entrancy protected delegation stubs (`global.MoneyApp.fn !== fn`), cutting `js/shared.js` from 3,810 lines down to 2,480 lines (35% reduction).
  3. **Universal Asset Registration:** Added all 7 modular engines to `sw.js` cache manifest, `tests/smoke.test.mjs`, all 7 HTML sub-pages, and test harnesses (`shared.test.mjs`, `integration-bridges.test.mjs`, etc.).
  4. Verified 100% test pass (410 tests) and 0 Biome lint errors/warnings.


- **Date & Context:** 2026-10-18, implementing Phase 87 Developer Tooling & Git Hooks (`v2.5.30`).
- **Problem:**
  1. Developers and agents lacked a zero-friction live-reload server, relying on manual browser reloads via static HTTP servers.
  2. Committing broken code was possible without automated local pre-commit enforcement.
- **Root Cause:**
  1. Traditional tooling solutions (e.g. `browser-sync`, `husky`, `lefthook`) introduce heavy external npm packages, violating the zero-runtime/minimal-toolchain invariant of ADR-001.
- **Solution & Rule:**
  1. **Zero-Dependency Dev Server (`scripts/dev.mjs`):** Built natively with `node:http`, `node:fs`, and Server-Sent Events (SSE) live-reload on `/__live_reload_stream`. Auto-injects a lightweight listener on loopback hostnames with debounce.
  2. **Native Git Hooks (`.githooks/pre-commit`):** Configured via `git config core.hooksPath .githooks`, executing `npm run lint` and `npm test` deterministically before any commit.
  3. Preserved 0 external runtime dependencies while scaling test suite to 410 passing checks.

### 2026-10-18: Headless Chrome CDP Bilingual Parity Regression Gate (v2.5.29)
- **Date & Context:** 2026-10-18, implementing Phase 86 Bilingual Parity CI Test (`v2.5.29`).
- **Problem:**
  1. Bilingual parity regression checks previously depended on disposable scratch scripts, meaning future additions could accidentally introduce Thai text into English mode without failing CI.
  2. Input placeholders (`qrManualChunkInput` in `index.html`, Finnhub and Twelve Data API key inputs in `rebalance.html`) were not being inspected by existing dictionary symmetry tests because placeholder attributes live directly in HTML.
- **Root Cause:**
  1. Text node checks overlooked input and textarea `placeholder` attributes.
  2. Static dictionary symmetry tests verify keys between `.th` and `.en` objects in JS, but cannot assert that all static HTML markup is dynamically bound and rewritten at runtime.
- **Solution & Rule:**
  1. Formalize `tests/bilingual-parity.test.mjs` as a permanent CI test using native Node.js test runner and headless Chrome CDP.
  2. Inspect both text nodes via TreeWalker and input/textarea `placeholder` attributes for Thai Unicode ranges (`/[\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59]/`).
  3. Expand test suite from 398 to 409 passing tests with 0 Biome warnings.

### 2026-10-18: Automated Lint Warning Elimination & Arguments Rest Parameters (v2.5.28)
- **Date & Context:** 2026-10-18, implementing Phase 85 Lint Warning Elimination (`v2.5.28`).
- **Problem:**
  1. The codebase had accumulated 101 Biome warnings across 9 JS files and 2 test files (72 `useOptionalChain`, 21 `useArrowFunction`, 4 `noGlobalIsNan`, 3 `noUnusedFunctionParameters`, 1 `noArguments`).
  2. In `js/tax-calculator-base.js`, `updateTaxAdvisor` used `arguments.length <= 6` to determine whether legacy 6-arg or full 8-arg signatures were invoked.
- **Root Cause:**
  1. Safe assist transforms were postponed during feature expansion.
  2. Legacy function signatures relied on ES5 `arguments` object rather than ES6 rest parameters.
- **Solution & Rule:**
  1. Use Biome's safe & assisted transforms to upgrade to optional chaining `?.` and lexical arrow functions across all controllers.
  2. Replace `arguments` in `updateTaxAdvisor` with `...extraArgs` rest parameter (`extraArgs.length <= 1`), maintaining 100% backward compatibility.
  3. Achieved 0 warnings and 0 errors across all 23 files with all 398 tests passing.

### 2026-10-18: Bilingual Parity, TDZ Hoisting & Translation Symmetry (v2.5.27)
- **Date & Context:** 2026-10-18, implementing Phase 84 Bilingual Parity & Mismatch Resolution (`v2.5.27`).
- **Problem:**
  1. Automated live DOM audit detected untranslated Thai elements remaining in English mode across all tools (Executive Dossier subtitles, DCA-to-Budget bridge buttons, P.N.D. 90/91 e-Filing worksheet checklists, windfall bridge alerts, and onboarding modal badges).
  2. `dashboard.html` in EN mode failed to render KPIs and charts, reporting 90+ untranslated elements and throwing `ReferenceError: Cannot access 'deflatorState' before initialization`.
  3. Default dynamic badge states (e.g., Dividend Tax Credit `badge-applied-status`) remained in Thai ("ปิดอยู่") in EN mode until clicked.
- **Root Cause:**
  1. `applyLocalization()` in `js/dashboard.js` accessed `deflatorState.horizonYears`, but `deflatorState` was declared using `let` later in the file (~line 2276). In EN mode, `applyLocalization()` was invoked during page load before `deflatorState` was initialized, triggering a Temporal Dead Zone (TDZ) ReferenceError and halting script execution.
  2. Modals and bridge banners added in Phases 75–83 had hardcoded Thai text in HTML templates without corresponding `.en` translation keys.
  3. Dynamic UI state handlers were not triggered during initial page bootstrap.
- **Solution & Rule:**
  1. **Hoisting & State Initialization:** Declare all state models (e.g. `deflatorState`) before localization or view rendering routines. Guard against uninitialized state with defensive defaults: `(deflatorState?.horizonYears || 10)`.
  2. **Default Dynamic Badge Localization:** Trigger dynamic UI initialization functions (e.g. `updateDividendTaxCreditUI()`) immediately upon script bootstrap so default OFF/ACTIVE states adhere to `window.LANG`.
  3. **100% Translation Key Symmetry:** Always update both `.th` and `.en` dictionaries symmetrically in `js/app-shell.js`, `js/dashboard.js`, and `js/debt-calculator.js` to satisfy the automated dictionary symmetry smoke tests.
  4. **Dead Element Cleanup:** Remove obsolete element IDs from deduction maps and ensure Biome `noDuplicateObjectKeys` checks pass.
  5. **Verification:** Live DOM audit confirmed 0 untranslated Thai elements across all 8 core pages (`dashboard.html`, `rebalance.html`, `months-slips.html`, `tax-calculator-base.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, and `index.html`) in English mode, with 398 automated tests passing.

### 2026-10-18: Target Date Retirement Glidepath Monthly DCA to Living Budget Bridge (v2.5.26)
- **Date & Context:** 2026-10-18, implementing Phase 83 Glidepath DCA to Living Budget Bridge (`v2.5.26`).
- **Problem:**
  1. In `rebalance.html`, users determine their monthly investment budget (`#totalBudget`) or plan their Target Date Retirement Glidepath asset allocation split (e.g. 80% Core / 15% Ballast / 5% Satellite), but there was no direct integration to transfer the planned monthly investment amount into their living budget in `remaining-money.html`.
  2. Users had to remember the amount and manually re-enter it as a savings/investment item in `remaining-money.html`, creating friction and risking misallocation of monthly cash flow.
- **Root Cause:**
  1. DCA and Glidepath investment plans in `rebalance.js` were isolated from the cashflow budgeting state bus in `remaining-money.js`.
  2. `remaining-money.html` lacked an incoming listener or alert banner for DCA budget bridges.
- **Solution & Rule:**
  1. **Rebalance DCA Budget Outbound Bridge:** In `rebalance.html` and `js/rebalance.js`, implement `bridgeDcaToBudget(source)`:
     - Read `#totalBudget` or derive monthly glidepath investment budget.
     - Validate amount (> 0) and persist into `localStorage['moneySuperapp.pendingDcaBudget']` with payload `{ amount, source, timestamp }`.
     - Route user cleanly to `remaining-money.html`.
  2. **Remaining Money Inbound Savings Bridge:** In `remaining-money.html` & `js/remaining-money.js`:
     - Implement `checkPendingDcaBudget()` listening on `DOMContentLoaded`, `window.storage`, and cross-window `message` events.
     - Upsert item into `state.savings` (id: `'dca-glidepath-investment'`, name: `'ออมลงทุน DCA ตามแผนพอร์ต'`, amount: `payload.amount`).
     - Trigger reactive recalculation (`renderTotals()`, `renderAllocationChart()`, `renderWaterfallChart()`, `saveState()`, `pushUndo()`).
     - Display `#dcaBudgetBridgeAlert` with `#dcaBudgetBridgeAlertText` and 5.5s auto-dismiss.
  3. **Full SDLC Verification:** Validate via 398 automated passing tests, clean Biome audit, and headless Chrome CDP captures in light, dark, and mobile viewports.

### 2026-10-18: Universal Card Layout Toolbar & Tablet Responsive Grid Scaling (v2.5.25)
- **Date & Context:** 2026-10-18, implementing Phase 82 Universal Card Toolbar and Tablet Grid Optimization (`v2.5.25`).
- **Problem:**
  1. As tool pages expanded to support comprehensive financial domains (5–12 cards per page), navigating or scanning long vertical pages required repetitive scrolling or manually clicking individual card toggle chevrons (`▲` / `▼`) one by one.
  2. `initCardLayoutManager` in `js/shared.js` lacked global batch state modifiers (`collapseAll()`, `expandAll()`, `toggleAll()`) and automatic toolbar generation.
  3. Medium viewports (tablets, foldables 640px–1024px) were missing `.sm:grid-cols-2` utility classes in `css/tailwind-lite.css`.
- **Root Cause:**
  1. Layout manager was designed around per-card DOM manipulations without container-level state tracking (`areAllCollapsed`, `areAllExpanded`).
  2. Toolbar containers were absent from top tool headers.
- **Solution & Rule:**
  1. **Universal Toolbar Methods:** Add `collapseAll()`, `expandAll()`, `toggleAll()`, `areAllCollapsed()`, and `areAllExpanded()` to `initCardLayoutManager`.
  2. **Automated Accessible Toolbar:** Automatically detect `#cardLayoutToolbar` or `options.toolbarContainer` and render accessible `[▼ Fold All | ▲ Expand All | ↺ Reset]` buttons with dynamic disabled states and bilingual symmetry.
  3. **Multi-Page Harmony:** Standardize `#cardLayoutToolbar` across all 7 core pages (`dashboard.html`, `rebalance.html`, `tax-calculator-base.html`, `months-slips.html`, `remaining-money.html`, `debt-calculator.html`, `tax-calculator.html`).
  4. **Tablet Grid Scaling:** Include `.sm:grid-cols-2` inside `@media (min-width: 640px)` in `tailwind-lite.css`.
  5. **Verification:** Validate via 397 automated passing tests, clean Biome audit, and headless Chrome CDP captures across expanded, collapsed, tablet, and dark states.

### 2026-10-18: Life Insurance Adequacy Coverage Gap to Budget Bridge (v2.5.24)
- **Date & Context:** 2026-10-18, implementing Phase 81 Life Insurance Adequacy Coverage Gap to Budget Bridge (`v2.5.24`).
- **Problem:**
  1. In `dashboard.html`, when the Life Insurance Adequacy panel diagnosed a large protection shortfall (e.g. 1,000,000–3,000,000 THB to cover outstanding debt, family support, and child education), users often felt overwhelmed. In Thailand, life insurance is culturally conflated with expensive endowment/savings policies (saving 30,000–50,000 THB/year), discouraging users from closing their coverage gap.
  2. Users lacked an actionable step to translate a multi-million baht protection shortfall into an affordable pure Term Life policy (~3,000 THB/year or ~250 THB/month per 1M THB coverage) and incorporate it into their living budget in `remaining-money.html`.
- **Root Cause:**
  1. Insurance calculations in `dashboard.js` only displayed the capital shortfall without translating the shortfall into an estimated market premium.
  2. `remaining-money.html` had no inbound listener or storage key for life insurance premium bridges.
- **Solution & Rule:**
  1. **Pure Term Life Engine:** Implement `MoneyApp.calculateTermLifePremiumEstimate(coverageGap, options)` in `js/shared.js`, modeling benchmark pure term life premiums (~3,000 THB/year per 1,000,000 THB face value, min 100 THB/month floor). Support Section 47 tax deduction savings capped at the 100,000 THB statutory ceiling based on the user's marginal PIT bracket.
  2. **Dashboard Bridge UI:** In `dashboard.html`, add `#box-ins-premium-bridge` that automatically appears when `calc.protectionGap > 0`. Display estimated monthly premium, annual premium, tax savings, and an action button `#btnBridgeInsuranceToBudget` that persists `moneySuperapp.pendingInsurancePremium` and routes to `remaining-money.html`.
  3. **Inbound Expense Bridge in Remaining Money:** In `remaining-money.html` & `js/remaining-money.js`, implement `checkPendingInsurancePremium()` to upsert the monthly term life premium into `state.expenses`, recompute cash flow, push undo snapshots, and display `#insurancePremiumBridgeAlert` with a 5.5s auto-dismiss.
  4. **Full SDLC & Verification:** Validate via 396 passing tests, 0 Biome errors, and headless Chrome CDP captures across Light, Dark, and Mobile viewports.

### 2026-10-18: Card Reorder & Fold Layout Parity across Tax and Slips Tools (v2.5.21)
- **Date & Context:** 2026-10-18, implementing Phase 78 Card Reorder & Fold Layout Parity across Tax and Slips Tools (`v2.5.21`).
- **Problem:**
  1. `tax-calculator-base.html` and `months-slips.html` lacked card reordering and folding parity with `rebalance.html` and `dashboard.html`. Cards had redundant internal accordion toggle buttons (e.g. `#btn-toggle-scenario-compare`, `#btn-toggle-tax-calendar`, `#compareToggleBtn`) wrapped inside cards, requiring double clicks or awkward nested accordions.
  2. In `tax-calculator-base.html`, an unclosed `<div>` in `panelTaxIncome` caused all subsequent cards to become nested descendants of `panelTaxIncome` rather than direct children of `#taxCardsContainer`. Consequently, `getCards()` in `initCardLayoutManager` omitted them, breaking reordering and `defaultCollapsed` folding.
- **Root Cause:**
  1. Early iteration of tools created manual accordion buttons instead of using `initCardLayoutManager`'s injected control cluster.
  2. Imbalanced HTML div tags inside complex multi-mode input cards prevented the layout manager's direct-child filter (`el.parentNode === container`) from detecting sibling cards.
- **Solution & Rule:**
  1. **Enforce Direct Child Div Balancing:** Always verify that every card in a reorderable container is a direct child of the container (`el.parentNode === container`). Use automated scripts or AST checks to ensure zero unclosed `<div>` tags across complex cards.
  2. **Eliminate Redundant Nested Accordions:** Remove internal expand/collapse buttons inside cards; expose tool content directly in the card body (`${cardId}Body`) and configure `defaultCollapsed: ['cardId']` in `initCardLayoutManager`.
  3. **Lazy Sub-Tool Evaluation via `onToggle`:** For cards containing heavy calculations, DOM generations, or comparisons (such as scenario comparison or statutory calendars), trigger calculation and rendering inside `onToggle(cardId, isCollapsed)` so heavy operations run only when the card is expanded, avoiding startup lag.
  4. **Explicit Global Window Exposure:** Always attach layout managers (`window.taxBaseLayoutManager = ...;`, `window.slipsLayoutManager = ...;`) so DevTools consoles, tests, and cross-tool bridge actions have clean access.

### 2026-10-18: Debt Refinance Monthly Savings & Faster Payoff Outbound Bridge (v2.5.20)
- **Date & Context:** 2026-10-18, implementing Phase 77 Debt Refinance Monthly Savings & Faster Payoff Outbound Bridge (`v2.5.20`).
- **Problem:**
  1. In `debt-calculator.html`, when debt consolidation or refinancing lowered monthly payments (`monthlyPaymentDiff > 0`), the cash flow relief was only shown as a passive figure. Users had no automated bridge to lock in those savings into their budget in `remaining-money.html` or DCA investment plan in `rebalance.html`, allowing freed cash flow to be easily absorbed into lifestyle creep.
  2. Conversely, when users chose shorter terms to save massive interest (`monthlyPaymentDiff < 0`), their required monthly payment increased, but they lacked an automated bridge to budget for the extra loan expense in `remaining-money.html`.
  3. `calculateDebtConsolidation` was previously trapped inside `js/debt-calculator.js` rather than exported via `js/shared.js`.
- **Root Cause:**
  1. The refinance simulator lacked an outbound bridge action container and inter-tool state hand-off keys (`moneySuperapp.pendingRefinanceSavings`, `moneySuperapp.pendingRebalanceSource`).
  2. `remaining-money.html` and `rebalance.html` only handled generic budget or tax accrual inputs without recognizing refinance savings or extra payment payloads.
- **Solution & Rule:**
  1. **Standardized Engine:** Migrate and export `MoneyApp.calculateDebtConsolidation` in `js/shared.js`, returning `newMonthlyPayment`, `interestSaved`, `monthlyPaymentDiff`, and `verdict` ('optimal', 'faster_payoff', 'higher_interest', 'no_debt').
  2. **Bi-Directional Refinance Bridges:** In `debt-calculator.html`, dynamically display `#refinanceBridgeActionsContainer`. For positive relief (`monthlyPaymentDiff > 0`), offer buttons to send savings to budget or to DCA investing. For accelerated payoff (`monthlyPaymentDiff < 0`), offer a button to send the extra loan payment to budget.
  3. **Targeted Inbound Handlers:** In `remaining-money.html`, implement `checkPendingRefinanceSavings()` to append/update savings or expenses with defensive snapshots and clear feedback banners. In `rebalance.html`, tailor `pendingBudgetAlert` when `pendingRebalanceSource === 'refinance'`.


### 2026-10-18: Annual Tax Due Monthly Accrual & Tax Refund Windfall Cross-Tool Bridge (v2.5.19)
- **Date & Context:** 2026-10-18, implementing Phase 76 Annual Tax Due Monthly Accrual & Tax Refund Windfall Cross-Tool Bridge (`v2.5.19`).
- **Problem:**
  1. In `tax-calculator-base.html`, users calculating their annual ภ.ง.ด. 90/91 tax payable or tax refund had no automated integration with their household budget in `remaining-money.html` or debt plan in `debt-calculator.html`.
  2. Large annual tax dues (e.g. 80k+ THB) often caught users off guard without a monthly accrual sinking fund reserve or knowledge of the Revenue Department's 3-installment 0% e-Filing facility (available for tax payable $\ge$ 3,000 THB).
  3. Tax refund recipients had to manually remember to direct windfall lump-sums toward debt payoff in `debt-calculator.html` or portfolio capital injection in `rebalance.html`.
- **Root Cause:**
  1. Tax calculation results were siloed in `tax-calculator-base.js` without domain math modeling for sinking funds, installment eligibility, or cross-tool communication.
  2. `remaining-money.html` lacked inbound accrual ingestion, and `debt-calculator.html` only accepted extra monthly cash without a pre-populated lump-sum windfall bridge for tax season (Month 3).
- **Solution & Rule:**
  1. **Accrual & Windfall Engine:** Implement `MoneyApp.calculateTaxAccrualAndRefundPlan` in `js/shared.js`. Calculate status (`payable`, `refund`, `balanced`), monthly sinking fund reserve (`amount / 12`), 3-installment eligibility (`amount >= 3000`, `amount / 3`), and debt windfall suggestions.
  2. **Tax Bridge UI & Actions:** In `tax-calculator-base.html`, display `#taxPayableBridgeGroup` or `#taxRefundBridgeGroup` based on tax calculation verdict. Provide buttons to bridge monthly reserve or 3 installments into `remaining-money.html`, or bridge refund into `debt-calculator.html` or `rebalance.html`.
  3. **Inbound Sinking Fund Ingestion:** In `remaining-money.html`, listen for `moneySuperapp.pendingTaxAccrual`, add/update expense line item, recalculate budget, display `#taxAccrualAlert`, and sync via storage events. Guard against duplicated currency units (`fmt(val)` instead of `fmtCurrency(val) + " บาท/เดือน"`).
  4. **Inbound Windfall Injection:** In `debt-calculator.html`, read `moneySuperapp.pendingDebtWindfall`, enable windfall toggle, populate amount and month (Month 3 for tax season), recalculate payoff timeline, and display confirmation banner.
  5. **ES5 Variable Scoping:** Biome rule `lint/correctness/noInnerDeclarations` forbids `var` declarations inside `if/else` blocks; always declare helper variables at the function top level in ES5 files.


### 2026-10-18: Debt Payoff Visual Velocity Comparator, Multi-Strategy Knockout & Cross-Tool Surplus Bridge (v2.5.18)
- **Date & Context:** 2026-10-18, implementing Phase 75 Debt Payoff Snowball vs. Avalanche Visual Velocity Comparator & Remaining Money 1-Click Payoff Bridge (`v2.5.18`).
- **Problem:**
  1. Users comparing Snowball vs. Avalanche strategies in `debt-calculator.html` only saw raw final payoff months and total interest figures. They had no intuitive visual sense of the timeline reduction velocity compared to paying only minimum payments, nor did they see psychological milestone differences (such as when the first debt is completely knocked out).
  2. Users with calculated monthly surplus in `remaining-money.html` had a one-click button to send investable money to `rebalance.html`, but had no direct bridge to direct that surplus towards accelerating debt elimination in `debt-calculator.html`.
  3. In `remaining-money.html`, `compute()` previously threw `TypeError: Cannot set properties of null (setting 'textContent')` if `#remainingNote` was missing or unrendered, halting downstream bridge updates.
- **Root Cause:**
  1. The simulation math lacked a standardized comparator method that computes minimum payment baseline, head-to-head interest delta, first-debt knockout month difference, and automated psychological vs mathematical recommendation heuristics.
  2. The remaining money controller lacked a companion bridge button (`#bridgeToDebtBtn`) and inter-tool state hand-off (`moneySuperapp.pendingDebtExtra`).
  3. Direct DOM property assignments in `compute()` lacked defensive `if (element)` null guards.
- **Solution & Rule:**
  1. **Core Velocity Comparator Engine:** Export `MoneyApp.simulateDebtPayoff()` and `MoneyApp.compareDebtVelocity()` in `js/shared.js`. Normalize all 3 scenarios (Baseline, Snowball, Avalanche) against total portfolio balance and max payoff duration.
  2. **Multi-Track Velocity Timeline UI:** Render 3 horizontal progress bars (`#barVelBaseline`, `#barVelSnowball`, `#barVelAvalanche`) with dynamic percentage widths, contextual tags (`#tagVelSnowballFirst`, `#tagVelAvalancheSaved`), and strategic advisor badge (`#badgeVelocityAdvisor`).
  3. **Bi-Directional Cross-Tool Surplus Bridge:** In `remaining-money.html`, provide `#bridgeToDebtBtn` next to `#bridgeToRebalanceBtn`. When clicked, store `moneySuperapp.pendingDebtExtra` and dispatch tab switch. In `debt-calculator.html`, read `pendingDebtExtra` or `?extra=...` query param, update extra monthly payment, and display inbound bridge confirmation banner.
  4. **Strict DOM Null Safety:** Always guard all DOM element property mutations with `if (el)` inside rendering loops and calculation controllers.

### 2026-10-18: Non-Intrusive PWA Update Toast & Controlled Background Cache Refresh (v2.5.16)
- **Date & Context:** 2026-10-18, implementing Phase 73 PWA cache update banner & refresh toast in `index.html`, `js/app-shell.js`, and `sw.js` (`v2.5.16`).
- **Problem:** When service worker assets were updated, `sw.js` was previously invoking `self.skipWaiting()` automatically inside the `install` event. This caused background cache replacement while user tabs remained open, risking code-version mismatches and unnotified stale state, particularly for mobile PWA users who rarely close the browser window.
- **Root Cause:** Without a two-phase update handshake (installing $\to$ waiting $\to$ explicit user-triggered activation), users had no visual indicator that a new release was available, nor an atomic way to refresh their app session.
- **Solution & Rule:**
  1. **Controlled SW Waiting State:** Remove immediate `self.skipWaiting()` from `install` in `sw.js`. Let new versions transition to the `waiting` (`installed`) state.
  2. **Inter-Process SKIP_WAITING Message Protocol:** In `sw.js`, listen for `message` event with `{ type: 'SKIP_WAITING' }` to invoke `self.skipWaiting()`.
  3. **Non-Intrusive Floating Toast UI:** Add `#pwaUpdateToast` with role `alert` and `aria-live="polite"`. Use pill-shaped elevation on desktop (`bottom: 24px; left: 50%; transform: translateX(-50%)`) and docked card elevation above bottom navigation on mobile (`bottom: calc(66px + env(safe-area-inset-bottom, 0px))`).
  4. **Atomic Controller Change Reload:** In `js/app-shell.js`, listen to `reg.waiting` upon load and `updatefound` + `statechange === 'installed'` when a controller exists. On user confirmation, post `SKIP_WAITING` and trigger clean top-level `window.location.reload()` guarded by a `refreshing` boolean latch.

### 2026-10-18: Inter-Tool Gold & Physical Asset Net Worth Synchronization (v2.5.15)
- **Date & Context:** 2026-10-18, integrating Thai Gold DCA & physical asset holdings from `rebalance.html` into `dashboard.html` Net Worth & Composition (`v2.5.15`).
- **Problem:** When users logged physical gold holdings (bars/jewelry/lots) in `rebalance.html` (`moneySuperapp.thaiGold.state.v1`), their physical asset wealth was completely ignored in `dashboard.html`. Net Worth, Gross Assets, Donut composition, Insurance Adequacy, and 3-Bucket retirement calculations omitted physical asset reserves.
- **Root Cause:** `gatherFinancialProfile()` in `js/dashboard.js` only ingested `rebalanceCalculator.state.v1` and `remainingMoneyCalculator.state.v1`, assuming total assets only consisted of liquid cash and financial portfolio buckets.
- **Solution & Rule:**
  1. **Dual Asset Ingestion:** Read `moneySuperapp.thaiGold.state.v1`, parse tranches/weights/current market price, compute market value via `MoneyApp.calculateThaiGoldMetrics`, and aggregate into `grossAssets = portfolioVal + emergencyReserve + goldVal` and `netWorth = grossAssets - totalDebt`.
  2. **Tri-Asset SVG Donut Arc Layout:** Add a 3rd arc `#donutSegGold` with amber `#f59e0b` styling. Compute cumulative dashoffsets: Cash at `0`, Investment at `-segCash`, and Gold at `-(segCash + segInvest)`.
  3. **Zero-Clutter Progressive Disclosure:** Default `#row-comp-gold` to `display: none;` and only set `display: flex;` when `goldVal > 0`. Users without gold continue to see the standard clean 2-asset card layout.
  4. **Downstream Cross-Tool Sync:** Pass `(p.goldVal || 0)` into Insurance Adequacy liquid assets (`syncInsuranceFromTools`) and Retirement 3-Bucket total assets (`syncThreeBucketsFromTools`).

### 2026-10-18: Next Best Move Action Engine & Cross-Tool 1-Click Navigation Bridges (v2.5.14)
- **Date & Context:** 2026-10-18, implementing Phase 71 Visual Financial Health "Next Best Move" Advisor Cards & 1-Click Action Bridges in `dashboard.html` (`v2.5.14`).
- **Problem:** `dashboard.html` provided a 5-pillar radar health score (Runway, Savings, Debt, Wealth, Tax), but actionable guidance was limited to a single static text verdict callout. Users discovering weak pillars or opportunities lacked personalized, prioritized actions and had to manually locate relevant sub-tools.
- **Root Cause:** Dashboard lacked an evaluation engine to map the gathered multi-tool financial profile (`runwayMonths`, `savingsRate`, `totalDebt`, `topMarginalRate`, `monthlyInvest`) into prioritized, actionable intervention objects with interactive bridges.
- **Solution & Rule:**
  1. **Heuristic Priority Engine (`generateNextBestMoves`):** Classify recommendations into 3 explicit urgency tiers:
     - *Priority 1 (Defense / Red)*: Emergency runway $< 3$ mo (`remaining-money`), or high-interest debt burden (`debt-calculator`).
     - *Priority 2 (Velocity & Tax / Blue)*: Savings rate $< 20\%$ (`remaining-money`), or top marginal tax bracket $\ge 15\%$ with unutilized deductions (`tax-calculator-base`).
     - *Priority 3 (Growth & Freedom / Green)*: Monthly DCA investable surplus deployment (`rebalance`), or retirement 3-bucket resilience check.
  2. **Top-3 Capped & Deduplicated Grid:** Auto-sort by priority ascending, guarantee at least 1 and at most 3 cards, rendered in an auto-fitting responsive grid (`grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`).
  3. **Multi-Context Navigation Bridge (`jumpToTab`):** Implement defensive fallback logic: check for iframe parent `window.parent.postMessage({ action: 'switchToTab', target: tabId }, '*')`, then `window.switchToTab(tabId)`, and finally `window.location.href = tabId + '.html'`.
  4. **Strict Localization Symmetry:** Always add matching keys in both `translations.th` and `translations.en` and verify against automated key symmetry tests.

### 2026-10-18: Sub-Tool Box Container Harmonization & Card Selector Alignment (v2.5.13)
- **Date & Context:** 2026-10-18, harmonizing auxiliary sub-tool cards (`#panelTargetDateGlidepath`, `#panelThaiGold`, `#panelForeignTaxAdvisor`) in `rebalance.html` (`v2.5.13`).
- **Problem:** In `rebalance.html`, the bottom 3 collapsible auxiliary tools appeared without any box container, floating naked on the page background unlike `#panelBudget` and `#howto`.
- **Root Cause:** The bottom 3 cards were introduced with `class="card reorder-card"`. However, `.card` was never defined in `rebalance.html` (only `.panel` and `.howto` were styled).
- **Solution & Rule:**
  1. **Dual Container Rule:** Define `.panel, .card:not(#panelBuckets)` with standard box styling (`background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 16px; margin-bottom: 16px;`).
  2. **Harmonized HTML Classes:** Always assign `class="panel card reorder-card"` to collapsible auxiliary cards to ensure backward compatibility with both layout manager `.reorder-card` selectors and `.panel` box rules.
  3. **Header Affordance:** Add `cursor: pointer; user-select: none;` on `.reorder-card .card-header` across all card tools.

### 2026-10-18: WebKit Flex Control Grouping, Overflow Barriers & Mobile Suffix Breakout (v2.5.12)
- **Date & Context:** 2026-10-18, eliminating mobile expense row breakout ("THB x" overflowing outside expense box) in `remaining-money.html` (`v2.5.12`).
- **Problem:** On mobile screens (especially WebKit / iOS Safari, devices with system font scaling > 1.0x, or narrow viewports $\le 390\text{px}$), the text following the expense amount input—specifically `"THB"` and the delete button `"×"` (plus auto-badges)—broke through and protruded past the right border of `.entry-row` and `.panel`.
- **Root Cause:**
  1. **Ungrouped Trailing Flex Children:** `.entry-row` contained 5 loose sibling items (`.name-input`, `.value-input`, `.unit`, `.auto-badge`, `.remove-btn`). Because `.name-input` had `flex-basis: auto`, WebKit and mobile browsers refused to compress the input below its intrinsic placeholder/text width, shoving trailing items past the right edge.
  2. **No Overflow Containment:** Neither `.entry-row` nor `.panel` declared `overflow: hidden;`, allowing uncontained flex items to visually penetrate past the card borders.
  3. **Loose Spacing on Small Screens:** 82px value input + 6px gaps left insufficient clearance on <= 360px devices.
- **Solution & Rule:**
  1. **Dedicated Flex Grouping Container (`.entry-controls`):** Wrap trailing controls (`.value-input`, `.unit`, `.auto-badge`, `.remove-btn`) inside a dedicated container:
     `<div class="entry-controls">...</div>`. Set `.entry-controls { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; margin-left: auto; }`.
  2. **Truncate Name Inputs Fully:** Set `.entry-row .name-input { flex: 1 1 0%; min-width: 0; width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }`. This prevents the name from ever pushing the right-side controls out of view.
  3. **Hard Overflow Barriers:** Always declare `overflow: hidden;` on `.entry-row`, `.panel`, and `.pvd-row`.
  4. **Compact Mobile Calibration (`@media (max-width: 480px)`):** Set `.value-input` to `flex: 0 0 74px; width: 74px; padding: 4px 5px; font-size: 13.5px;`, `.remove-btn` to `width: 18px; font-size: 16px; padding: 0; text-align: center;`, and gaps to `3px`/`4px`.
  5. **Cache Invalidation:** Always increment `CACHE_NAME` in `sw.js` (via `node scripts/bump.mjs patch`) so mobile PWAs purge stale cached HTML.

### 2026-10-18: Flexbox `min-width: auto` Input Overflow & Mobile Row Calibration (v2.5.11)
- **Date & Context:** 2026-10-18, resolving mobile text breakout and flex overflow bugs in `remaining-money.html` (`v2.5.11`).
- **Problem:** On mobile viewports ($\le 480\text{px}$, especially 360px–390px devices), budget item inputs (`.value-input`), unit text, badges, and delete buttons burst out past the right boundary of `.entry-row` and `.panel`. In `.pvd-row`, the long label `กองทุนสำรองเลี้ยงชีพ (% ของเงินเดือน)` pushed inputs off-screen. In `#cashflowPanel`, the header flex container forced the title and the 4-button view toggle group into an unwrapped 550px row, spilling off-screen.
- **Root Cause:**
  1. In HTML and CSS Flexbox, `<input>` elements default to `min-width: auto;` based on their browser default `size="20"` attribute (~160px–200px). Without `min-width: 0;`, `flex: 1;` cannot shrink below this intrinsic width, forcing the row to overflow small mobile containers.
  2. Fixed amount inputs (`width: 110px`) combined with 64px of cumulative padding left only 287px on a 360px device.
  3. The `#cashflowPanel` title flex container lacked `flex-wrap: wrap;`.
- **Solution & Rule:**
  1. **Universal Flex Input Safety:** Always declare `min-width: 0; width: 0; flex: 1 1 auto;` on inputs and labels inside flex rows to override `min-width: auto;` and enable proper shrinking.
  2. **Mobile Row Spacing (`@media (max-width: 480px)`):**
     - Adjust `body` padding to `18px 10px 70px` and `.panel` to `12px 10px`.
     - Calibrate `.entry-row` to `gap: 6px; padding: 8px 8px; width: 100%; box-sizing: border-box;`.
     - Calibrate `.value-input` to `width: 82px; flex: 0 0 82px;` and `.pvd-pct-input` to `width: 55px; flex: 0 0 55px;`.
  3. **Header Wrapping:** Ensure `.cashflow-panel .panel-title > div` and `.view-toggle-group` declare `flex-wrap: wrap;` and set `#svgCashflowWaterfall` min-width to 300px.
  4. **Multi-Viewport Headless Audits:** Verify responsive layouts across 360px, 375px, and 390px viewports to guarantee 0 element overflows.

### 2026-10-18: Multi-Card Container Sizing & Responsive Padding Harmonization (v2.5.10)
- **Date & Context:** 2026-10-18, resolving narrow container width and cramped multi-column financial layouts on Income Tax estimation tool (`tax-calculator-base.html`) (`v2.5.10`).
- **Problem:** The Income Tax estimation tool was constrained by `max-w-md` (448px) with 32px padding (`p-8`), restricting usable content width to only 384px. On desktop viewports, 65%+ of the screen was empty space, while multi-column financial tables (8-tier progressive tax waterfall table, ภ.ง.ด. 90/91 e-Filing worksheet, dual-scenario comparison cards, and statutory calendar) suffered from cramped typography and awkward multi-line text wrapping. Additionally, `<body>` centered the long card vertically (`flex items-center justify-center`).
- **Root Cause:** Legacy container classes from early minimal mobile mockups were retained even after adding 8 complex sub-panels and financial worksheets across feature releases.
- **Solution & Rule:**
  1. **Container Width Harmonization:** Standardize multi-card and tabular tools to `w-full max-w-4xl` (896px), matching `months-slips.html`.
  2. **Responsive Padding:** Apply `p-4 sm:p-6 md:p-8` so mobile viewports gain +32px usable width while desktop viewports retain clean 32px borders. Add `.sm:p-6` and `.md:p-8` to `css/tailwind-lite.css`.
  3. **Top-to-Bottom Flow:** Use `flex-col items-center justify-start p-4 md:py-8` on `<body>` for scrollable tools and bind colors directly to `var(--bg)` and `var(--ink)`.
  4. **Strict Regression Assertions:** Enforce container size assertions in `tests/smoke.test.mjs` to prevent future regressions to `max-w-md`.

### 2026-10-18: Cross-Frame Theme Propagation, TDZ Hoisting & Shell Variable Harmonization (v2.5.9)
- **Date & Context:** 2026-10-18, comprehensive UI theme harmonization and runtime exception eradication across all 8 tools (`v2.5.9`).
- **Problem:**
  1. Toggling theme or language in the app shell (`index.html`) did not reflect in embedded iframe tools, leaving them in outdated theme states.
  2. The app shell topbar, bottom nav, and privacy banner used hardcoded dark colors (`#131E19`, `#24352C`, `#8FA69C`), producing jarring contrast in Light mode.
  3. Three uncaught runtime `ReferenceError` crashes completely halted page initialization:
     - `dashboard.js`: Calling undefined `calculateHealthScoreMetrics` and TDZ on `dashboardLayoutManager`.
     - `remaining-money.js`: TDZ on `remainingLayoutManager`.
     - `debt-calculator.js`: TDZ on `debtLayoutManager` and undefined `monthNamesTh`.
  4. FOUC occurred during cold page visits because theme was resolved late after CSS had already painted.
- **Root Cause:**
  1. Iframes have isolated DOM trees. Mutating parent `document.documentElement.dataset.theme` does not penetrate child iframes without explicit cross-document synchronization or postMessage dispatch.
  2. App shell elements relied on hardcoded hex colors instead of semantic design tokens (`var(--panel)`, `var(--line)`, `var(--ink)`, `var(--bg)`).
  3. ES6 `let` declarations are not hoisted with initial values and remain in the Temporal Dead Zone (TDZ). Invoking initializers (`init*Layout()`) before `let *LayoutManager = null;` throws an uncaught fatal `ReferenceError`.
- **Solution & Rule:**
  1. **Dual Cross-Frame Synchronization:** In `app-shell.js`, mutate `frame.contentDocument.documentElement.dataset.theme` directly, dispatch `postMessage({ type: 'THEME_CHANGE', theme })`, and sync in `frame.addEventListener('load')`. In `shared.js`, listen to both `message` and `storage` events to update child DOM reactively.
  2. **Strict Semantic Variables in Shell:** Never use hardcoded hex values in shell containers (`.topbar`, `.bottom-nav`). Bind strictly to theme tokens (`var(--panel)`, `var(--line)`, `var(--ink)`).
  3. **Lexical Declaration Order:** Always declare module-level variables (`let *LayoutManager = null;`, constants) before executing setup functions that assign or reference them.
  4. **Synchronous Head Theme Script:** Place an inline `<script>` in `<head>` before `<link rel="stylesheet">` in every HTML file to synchronously assign `dataset.theme` from `localStorage` prior to layout/paint.

### 2026-10-18: Statutory Retirement 500k Ceiling Bridge & Direct Deduction Parameter Passing (v2.5.17)
- **Date & Context:** 2026-10-18, implementing Phase 74 ภ.ง.ด. 90/91 Statutory Pre-Flight Checklist & 500k Ceiling Pool Warning Bridge in `tax-calculator-base.html` and `js/tax-calculator-base.js`.
- **Problem:** Attempting to extract Provident Fund (PVD) deductions from DOM innerText (`"- 36,000.00 บาท"`) using regex stripping `/[^0-9.-]/g` produced negative numbers (`-36000`), causing `Math.max(0, pvd)` to evaluate to `0`. Furthermore, reading effective/capped retirement deductions prevented the statutory pool monitor from detecting raw contributions exceeding the Section 47 500k ceiling.
- **Root Cause:** Scraping rendered UI text with negative formatting prefixes instead of passing structured numeric calculation snapshots (`lastCalculatedDeductions`) directly between controller routines, combined with confusing raw contributions with capped effective deductions.
- **Solution & Rule:**
  1. **Direct Parameter Snapshots:** Always capture and pass raw calculation snapshots (`lastCalculatedDeductions = { pvd, sso, rawFund, fund, ... }`) directly to downstream worksheet and view rendering routines rather than parsing formatted UI text from DOM nodes.
  2. **Raw vs Effective Separation:** Always maintain separate fields for raw user contributions (for statutory ceiling excess warnings) and effective deductible amounts (for actual tax reduction math).
  3. **Multi-State Verification:** Verify both safe (<500k) and exceeded (>500k) states across Light, Dark, and Mobile viewports via headless Chrome CDP.

### 2026-10-18: CSS Grid Responsive Column Spanning & Implicit Track Synthesis (v2.5.8)
- **Date & Context:** 2026-10-18, resolving broken layout on the payslip simulator (`months-slips.html`) on both desktop and mobile viewports.
- **Problem:**
  1. On desktop ($\ge 768\text{px}$), lower cards (`#panelCashflowStream`, `#pitReconciliationCard`, `#panelJobCompare`) collapsed into narrow $\approx 74\text{px}$ columns sharing a single row instead of spanning 100% full width.
  2. On mobile ($< 768\text{px}$), cards appeared crushed into narrow slivers with multiple empty ghost columns.
- **Root Cause:**
  1. `tailwind-lite.css` was missing `.md:col-span-12` and `.col-span-12` utility definitions. In CSS Grid with `md:grid-cols-12`, cards missing column span defaults to 1 column out of 12.
  2. If a rule like `.md\:col-span-12, .col-span-12 { grid-column: span 12 / span 12 !important; }` is applied outside `@media (min-width: 768px)`, it forces a 12-column span on 1-column mobile grids (`grid-cols-1`). According to the CSS Grid specification, when an item requests `span 12` inside a container with only 1 explicit column, CSS Grid synthesizes 11 implicit auto tracks, compressing container width into 12 slivers across the mobile screen!
- **Solution & Rule:**
  1. **Complete CSS Utilities:** Always ensure `tailwind-lite.css` defines `.col-span-12`, `.md:col-span-12`, `.gap-2`, `.gap-3`, `.flex-wrap`, and corresponding spacing utilities.
  2. **Strict Breakpoint Scoping:** Never define responsive utility overrides (e.g. `.md:col-span-12`) outside media query wrappers. Responsive column spans MUST live strictly inside `@media (min-width: 768px)`.
  3. **Visual & Responsive Verification:** Always verify changes under both desktop (1280px) and mobile (390px) viewports with headless Chrome CDP screenshots to guarantee zero layout regression.

### 2026-10-18: Runtime Calculation Contract Integrity & Defensive UI Initialization (v2.5.7)
- **Date & Context:** 2026-10-18, debugging and resolving browser render failure in `rebalance.html` where card reordering controls and collapsed state failed to appear.
- **Problem:** When `rebalance.html` loaded in Chrome, neither card reorder controls (`↑`, `↓`, `▲`) nor default collapsed states were applied to auxiliary cards, leaving cards uncollapsible on initial load.
- **Root Cause:** A property naming discrepancy between `calculateForeignRepatriationTax` (`js/shared.js`, which returns `effectiveTaxRatePct`) and `updateForeignTaxUI` (`js/rebalance.js`, which accessed `calc.effectiveTaxRate.toFixed(1)`) triggered an uncaught `TypeError: Cannot read properties of undefined (reading 'toFixed')` during initial load. Because component initializers were called synchronously without defensive isolation, the uncaught exception halted the script before `MoneyApp.initCardLayoutManager(...)` could execute.
- **Solution & Rule:**
  1. **Contract Invariance:** Ensure shared core functions support property aliases bidirectionally (`effectiveTaxRate: effectiveTaxRatePct`, etc.) and UI formatting guards all numerical accesses (`((calc.effectiveTaxRate ?? calc.effectiveTaxRatePct) || 0).toFixed(1)`).
  2. **Defensive Component Initialization:** Always isolate individual sub-calculator and tool initializers (`initGoldCalculator()`, `initForeignTaxAdvisor()`, `initTargetDateGlidepath()`) with defensive `try/catch` blocks so an isolated error in an optional sub-tool never prevents core page layout managers or other cards from mounting.
  3. **Headless Chrome CDP Verification:** Verify real browser execution using Chrome DevTools Protocol to capture unhandled console errors and verify DOM class attachment in a live V8 environment.

### 2026-10-18: Card Layout Multi-Child Collapsing & Single Source of Truth for Panel Folding (v2.5.6)
- **Date & Context:** 2026-10-18, fixing card folding bugs and auxiliary panel positioning in `rebalance.html` and `js/shared.js`.
- **Problem:** Cards lacking a single enclosing `.card-body` wrapper (e.g. cards having 3-6 direct sibling children such as inputs, summaries, tables, action buttons) only hid `card.children[1]` when collapsed, leaving all remaining children visible and breaking layout. Simultaneously, auxiliary panels had legacy inline toggle click handlers (`onclick="toggle..."`) and chevron arrow icons (`▼`) manipulating inline `style.display`, which collided and desynchronized with the Card Layout Manager's injected toggle button and `.card-collapsed-hidden` class.
- **Root Cause:** Assuming every card has a single `.card-body` container or at most 2 direct children, and failing to harmonize pre-existing local toggle controls with the newly introduced universal layout manager.
- **Solution & Rule:**
  1. In `initCardLayoutManager` (`js/shared.js`), implement `getCardBodies(card)` to return ALL direct non-header child elements of a card when no single body wrapper exists. Toggling collapsed state applies `.card-collapsed-hidden` to every child in the collection.
  2. Single Source of Truth for visibility: Remove conflicting legacy toggle arrow spans and inline `style="display:none"`. Wire panel toggle actions directly to `rebalanceLayoutManager.toggleCard(id)`.
  3. Support `defaultCollapsed` and `defaultOrder` options in `initCardLayoutManager` to allow tools to specify default bottom positioning and folded states out of the box.

### 2026-10-18: Atomic Commit-and-Push Workflow Policy
- **Date & Context:** 2026-10-18, following delivery of Wave 4 Suite (v2.4.9 - v2.5.5).
- **Problem:** Batching multiple feature phases locally before pushing can lead to divergence between local and remote states, delaying live deployment for users.
- **Solution & Rule:** **Always commit and push one-by-one immediately.**
  For every individual task, feature phase, or fix:
  1. Complete implementation and verify all tests pass (`npm test`, 0 Biome errors).
  2. Bump version if applicable (`node scripts/bump.mjs patch`).
  3. `rtk git add . && rtk git commit -m "..."`.
  4. Immediately push to upstream: `rtk git push origin master`.
  Never leave finished commits stacked locally without pushing.

### 2026-10-18: Target Date Retirement Glidepath Planner & Comprehensive E2E Expansion (v2.4.7)

- **Date & Context:** 2026-10-18, during implementation of Target Date Glidepath Model and comprehensive E2E test suite expansion across all 8 tools (`v2.4.7`).
- **Problem:** Investors frequently struggle to set and rebalance their Core/Ballast/Satellite portfolio targets over time, either remaining excessively aggressive near retirement (exposing their life savings to catastrophic drawdown) or overly conservative in youth (losing decades of compounding growth). Additionally, sub-page themes occasionally contained unmapped utility classes (e.g. `bg-emerald-50`, unharmonized tooltips) that caused off-theme flashes in dark mode.
- **Root Cause:** Standard portfolio rebalancers treat target weights as static constants rather than a dynamic life-cycle function of time-to-retirement. Furthermore, utility CSS classes from Tailwind need strict variable-based overrides for complete WCAG-compliant dark/light mode consistency.
- **Solution & Rule:**
  1. Implement `calculateTargetDateGlidepath(params)` in `js/shared.js`, modeling GPF (กบข. แผนสมดุลตามอายุ) and Vanguard Target Retirement glidepaths:
     - Shift from aggressive wealth accumulation (80-85% Core, 5-15% Ballast, 5-10% Satellite) when $> 20$ years out, smoothly down to capital preservation and income distribution (20-25% Core, 70-75% Ballast, 5% Satellite) at or in retirement.
     - Support risk tolerance profiles ('moderate', 'aggressive', 'conservative') and target retirement year cohorts (2035, 2040, 2045, 2050, 2055, 2060).
  2. Implement `#panelTargetDateGlidepath` with dynamic segmented glidepath bar, interactive KPI metrics, strategic advice, and a 1-click `applyGlidepathSplitToPortfolio()` action that directly synchronizes the portfolio's Core/Ballast/Satellite weights and triggers auto-recomputation with full undo history.
  3. Harmonize all remaining off-theme badges and tooltips (mapping `.bg-emerald-50`, `.border-emerald-200`, `.text-emerald-800`, and `#streamTooltip` directly to semantic Forest Sage tokens `var(--ok-dim)`, `var(--ok)`, and `var(--ink)`).
  4. Expand test suite to 291 automated passing tests across 80 suites, covering 10 cross-tool integration bridges, bilingual symmetry, zero telemetry, and headless smoke audits.

### 2026-10-17: Foreign Investment & Crypto Repatriation Tax Advisor (v2.4.6)

- **Date & Context:** 2026-10-17, during implementation of Foreign Investment & Crypto Repatriation Tax Advisor in `rebalance.html` / `js/rebalance.js` / `js/shared.js` (`v2.4.6`).
- **Problem:** Following the Revenue Department's major shift under Orders Por. 161/2566 and Por. 162/2566, Thai investors bringing offshore investment capital, stock gains, or crypto proceeds into Thailand face confusing tax rules and risk accidental double taxation or excessive PIT liability.
- **Root Cause:** Prior to 2024, Section 41 Paragraph 2 was interpreted using the "different tax year" loophole (remitting in a subsequent year was non-taxable). Order P.161 revoked this loophole from 1 Jan 2024 onwards, but Order P.162 grandfathered all pre-2024 earnings and capital. Furthermore, original principal capital returns are not assessable income, and DTA tax credits under Royal Decree No. 300 can offset foreign withholding taxes.
- **Solution & Rule:**
  1. Implement `calculateForeignRepatriationTax(params)` in `js/shared.js`:
     - Test 180-day Thai residency rule (Section 41 Paragraph 3: $< 180$ days is 100% tax-exempt non-resident).
     - Separate pre-2024 earnings (Order P.162: 100% grandfathered exemption) and original principal capital return (not taxable income).
     - Compute progressive Thai PIT liability on post-2024 taxable remittances over existing domestic net taxable income base.
     - Compute Double Taxation Agreement (DTA) foreign tax credit cap under Royal Decree No. 300 to offset foreign taxes paid (e.g. US 15% dividend WHT).
  2. Implement interactive advisor card `#panelForeignTaxAdvisor` with quick preset buttons, real-time metrics, strategic guidance, and statutory legal citations.
  3. Validate with unit tests in `tests/foreign-tax-advisor.test.mjs` and smoke test in `tests/smoke.test.mjs`.

### 2026-10-17: Retirement 3-Bucket Cash Flow & SSO Drawdown Simulator (v2.4.2)

- **Date & Context:** 2026-10-17, during implementation of Retirement 3-Bucket Cash Flow Allocation & Social Security Offset Simulator in `dashboard.html` / `js/dashboard.js` (`v2.4.2`).
- **Problem:** Conventional retirement planning relies exclusively on the 4% Safe Withdrawal Rate (SWR) rule, which fails to account for statutory guaranteed income in Thailand (Social Security Section 33/39 pension and Senior Citizen allowances) and does not protect against Sequence of Returns Risk (forced equity liquidations during bear markets).
- **Root Cause:** SWR treats the portfolio as a monolithic block, ignoring the psychological and financial necessity of cash and bond cushions during market drawdowns.
- **Solution & Rule:**
  1. Implement Harold Evensky's 3-Bucket Allocation Architecture in `js/shared.js`:
     - **Bucket 1 (Cash / Liquid 1–2 yrs):** Cash & money-market funds guaranteeing immediate living expense drawdown.
     - **Bucket 2 (Fixed Income 3–7 yrs):** Government bonds and fixed-income assets that continuously replenish Bucket 1.
     - **Bucket 3 (Equities / Growth 8+ yrs):** Long-term equity index/REITs harvested only during bull markets.
  2. Offset living expenses with guaranteed Thai public pensions: $\text{Net Drawdown} = \max(0, \text{Annual Living Expenses} - (\text{Monthly SSO} + \text{Elderly Allowance}) \times 12)$.
  3. Compute bear market runway years: $\frac{\text{Bucket 1} + \text{Bucket 2}}{\text{Net Annual Drawdown}}$ (typically 7 years).
  4. Integrate automatic hydration from `gatherFinancialProfile()` and enforce 100% bilingual translation symmetry and zero Biome linter errors.

### 2026-10-17: Thai Inheritance & Annual Gift Tax Simulator (v2.4.1)

- **Date & Context:** 2026-10-17, during implementation of Thai Inheritance Tax Act B.E. 2558 and Annual Gift Tax under Revenue Code Sections 42(26)-(28) in `tax-calculator.html` / `js/tax-calculator.js` (`v2.4.1`).
- **Problem:** Thai high-net-worth individuals and families had no client-side simulator to calculate statutory inheritance tax, evaluate the 100M THB per-heir exemption, or compare testamentary distribution against multi-year lifetime gifting strategies.
- **Root Cause:** Inheritance tax calculations in Thailand have specific statutory nuances (spousal 100% exemption, 5% rate for ascendants/descendants vs 10% for non-relatives, separate 20M/10M annual gift exemptions) that were not modeled anywhere in the app.
- **Solution & Rule:**
  1. Implement `calculateThaiInheritanceAndGiftTax(params)` in `js/shared.js` covering both Inheritance Tax Act B.E. 2558 and Revenue Code Sec. 42(26)-(28).
  2. Implement wealth transfer optimizer modeling a multi-year phased gift strategy ($\text{Years} \times \text{Exemption}$) to reduce the final estate below the 100M threshold.
  3. Validate with unit tests in `tests/inheritance-tax.test.mjs` and preserve offline-first privacy.

### 2026-10-17: Thai Gold Bar & Jewelry DCA Calculator (v2.4.0)

- **Date & Context:** 2026-10-17, during implementation of Thai 96.5% Gold Bar & Jewelry DCA Calculator in `rebalance.html` / `js/rebalance.js` (`v2.4.0`).
- **Problem:** Gold is one of the most popular savings and investment assets in Thailand, but standard DCA calculators use metric grams or troy ounces instead of the traditional Thai Baht-weight standard (1 บาททอง = 15.244g for bars, 15.16g for jewelry) and ignore block/craft fees (ค่าบล็อก / ค่ากำเหน็จ).
- **Root Cause:** Global financial models do not account for local Thai Gold Traders Association (สมาคมค้าทองคำ) conventions or Revenue Code Section 42(9) capital gains tax exemptions.
- **Solution & Rule:**
  1. Implement `calculateThaiGoldMetrics(params)` in `js/shared.js` supporting both 96.5% gold bars (15.244g) and jewelry (15.16g) with block/craft fee modeling.
  2. Provide live Association quote fetching with fallback manual entry and a direct export bridge to portfolio rebalancing buckets.
  3. Display legal guidance banner on Revenue Code Section 42(9) capital gains PIT exemption.

### 2026-10-17: Life Insurance Adequacy & Family Protection Gap Analysis (v2.3.9)

- **Date & Context:** 2026-10-17, during implementation of Life Insurance Adequacy & Family Protection Gap Calculator in `dashboard.html` / `js/dashboard.js` (`v2.3.9`).
- **Problem:** Users had forward projections for net worth accumulation and FIRE retirement, but zero quantitative insight into family downside protection and capital needs shortfall in the event of untimely demise or disability. Moreover, statutory Thai Personal Income Tax Section 47(1)(d) insurance deductions were decoupled from actual protection gaps.
- **Root Cause:** Wealth tools often focus exclusively on asset accumulation while omitting risk management, leading to under-insured families where outstanding debts and living expenses would wipe out dependent financial security.
- **Solution & Rule:**
  1. Implement pure financial math engine `calculateInsuranceAdequacy(params)` in `js/shared.js`, computing $\text{Total Needs} = \text{Debt} + (\text{Monthly Expenses} \times 12 \times \text{Years}) + \text{Child Fund} + \text{Emergency Cushion}$ and $\text{Gap} = \max(0, \text{Total Needs} - \text{Liquid Assets} - \text{Existing Coverage})$.
  2. Provide dual perspectives: Capital Needs Analysis alongside the classic Human Life Value (HLV: $7\times$ annual net income) benchmark.
  3. Bridge protection gaps directly to statutory PIT tax incentives: estimate annual tax refund ($\min(\text{Gap} \times 1.5\%, 100000) \times \text{Marginal Bracket}$) and provide one-click navigation to `tax-calculator-base.html`.
  4. Auto-populate inputs from live calculator stores (`moneySuperapp.debtCalculator.state.v1`, `remainingMoneyCalculator.state.v1`) with full bilingual (TH/EN) symmetry and unit test coverage in `tests/insurance-adequacy.test.mjs`.

### 2026-10-17: Design System Re-alignment & Sub-Page Theme Harmonization (v2.3.8)

- **Date & Context:** 2026-10-17, during design audit and sub-page theme synchronization across `tax-calculator-base.html`, `months-slips.html`, and `tax-calculator.html` (`v2.3.8`).
- **Problem:** Sub-pages contained legacy Tailwind utility color classes (`bg-blue-50`, `text-blue-800`, `focus:ring-blue-500`, `dark:bg-slate-900`, `dark:border-slate-800`) that clashed with the Forest Sage design system and created jarring navy/blue flashes in dark mode.
- **Root Cause:** Legacy templates created before `css/theme.css` was unified were never migrated to semantic theme variables, relying instead on incomplete or fragile CSS overrides.
- **Solution & Rule:**
  1. Add semantic token aliases to `css/theme.css` (`--surface: var(--panel-2);`, `--surface-2: var(--bg);`, `--card-bg: var(--panel);`, `--accent: var(--core);`, `--label: var(--ink-dim);`).
  2. Map all sub-page panels, cards, inputs, and badges directly to CSS variables (`var(--panel)`, `var(--panel-2)`, `var(--line)`, `var(--core)`, `var(--ink)`, `var(--ok-dim)`, `var(--warn-dim)`).
  3. Prohibit `dark:bg-slate-*` and hardcoded `focus:ring-blue-500` in HTML markup; enforce via automated regression assertions in `tests/smoke.test.mjs`.

### 2026-10-17: Cross-Tool Integration Bridges & Unit Testing Verification (v2.3.7)

- **Date & Context:** 2026-10-17, during implementation of cross-tool storage contracts and automated integration test suites (`v2.3.7`).
- **Problem:** Cross-calculator bridges relied on localStorage conventions (`moneySuperapp.pendingBudget`, `pendingSlipImport`, `pendingLumpSum`, `taxBase`, `debtCalculator.state.v1`, `taxCalendar.state.v1`) that could silently drift between releases without build-time integration verification.
- **Root Cause:** Unit tests evaluated math helper functions in isolation rather than end-to-end data serialization and deserialization across producer and consumer modules.
- **Solution & Rule:**
  1. Create `tests/integration-bridges.test.mjs` executing simulated producer/consumer contracts using Node's native test runner (`node:test`).
  2. Test both happy-path transfers and corrupt/unparseable payload recovery to ensure calculators never crash when encountering malformed state.
  3. Adhere to Biome rules: use `Object.hasOwn(obj, prop)` instead of `Object.prototype.hasOwnProperty.call`, and avoid returning values in `.forEach()` loops.

### 2026-10-17: Accessibility ARIA Landmarks & WCAG Contrast Calibration (v2.3.6)

- **Date & Context:** 2026-10-17, during accessibility audit and color token calibration (`v2.3.6`).
- **Problem:** Sub-pages (`rebalance.html` and `months-slips.html`) lacked explicit ARIA landmark roles (`role="main"`, `role="region"`, `aria-label`), while the muted ink token `--ink-faint` had a 3.8:1 contrast ratio against `--paper`, failing WCAG 2.1 AA requirements (minimum 4.5:1).
- **Root Cause:** Legacy CSS used softer sage/gray tones (`#7A8E85`) optimized visually on desktop OLEDs but lacking sufficient photometric contrast for low-vision accessibility.
- **Solution & Rule:**
  1. Recalibrate `--ink-faint` in `css/theme.css`: light mode `#5E7169` (5.12:1) and dark mode `#7F968B` (5.52:1), both passing WCAG AA.
  2. Verify all modal dialogs declare `role="dialog"` or `aria-modal="true"`.
  3. Validate semantic ARIA structure via automated smoke test assertions in `tests/smoke.test.mjs`.

### 2026-10-17: Thai Statutory Tax Calendar & Deadline Compliance Tracker (v2.3.5)

- **Date & Context:** 2026-10-17, during integration of statutory tax deadline calculation in `js/shared.js`, `tax-calculator-base.html`, and `dashboard.html` (`v2.3.5`).
- **Problem:** Users frequently miss statutory filing deadlines (ภ.ง.ด.90/91 e-filing cutoff of April 8 vs paper filing cutoff of March 31, ภ.ง.ด.94 mid-year installment on Oct 8, and year-end deduction investment windows on Dec 31).
- **Root Cause:** Financial calculations were static and lacked dynamic time-awareness or proactive deadline countdowns.
- **Solution & Rule:**
  1. Provide `MoneyApp.calculateThaiTaxDeadlines(now)` in `js/shared.js` calculating days remaining, elapsed status, and urgent badges ($\le 14$ days, $\le 30$ days).
  2. Synchronize interactive compliance checklists across tools via `moneySuperapp.taxCalendar.state.v1`.
  3. Export structured calendar events with bilingual descriptions and official Revenue Department e-filing links.

### 2026-10-17: Script Modularization & Decomposition (v2.2.6)

- **Date & Context:** 2026-10-17, during modularization of inline scripts in `debt-calculator.html` and `dashboard.html` (`v2.2.6`).
- **Problem:** `dashboard.html` (~2,760 lines) and `debt-calculator.html` (~1,720 lines) contained enormous blocks of inline JavaScript. This made HTML files bloated, prevented efficient browser script caching across visits, and bypassed dedicated JavaScript linting.
- **Root Cause:** Legacy architecture kept calculator script logic inline within the respective HTML files.
- **Solution & Rule:**
  1. Extract script blocks into dedicated standalone modules: `js/debt-calculator.js` and `js/dashboard.js`.
  2. Include the new scripts into Service Worker cache list (`sw.js`) to guarantee 100% offline standalone operation (ADR-001).
  3. In Biome linter, avoid returning values from `.forEach()` callbacks (e.g. `map.set()` returns `this`). Wrap callback body in braces `{ map.set(...); }` to prevent lint errors (`lint/suspicious/useIterableCallbackReturn`).

### 2026-10-17: Section 48(5) Retirement Lump-Sum vs Transfer-to-RMF Tax Optimization Engine (v2.2.5)

- **Date & Context:** 2026-10-17, during implementation of Section 48(5) vs RMF Rollover optimizer in `tax-calculator.html` (`v2.2.5`).
- **Problem:** Employees leaving an employer after $\ge 5$ years of service but under age 55 face a huge tax burden if they take their Provident Fund (PVD) as a cash lump sum. Under Section 48(5), taxable PVD is taxed at progressive rates (5%–35%). However, rolling over PVD into an RMF for PVD within 30 days keeps 100% of PVD funds tax-exempt. Users had no interactive way to calculate their exact immediate tax savings.
- **Root Cause:** Severance calculator only computed full lump sum tax, without providing comparative rollover tax optimization.
- **Solution & Rule:**
  1. In Tab 1 ($\ge 5$ yrs, age $< 55$), compute side-by-side comparison:
     - Option A (Full Lump Sum): Tax on $\text{severanceExcess} + \text{taxablePVD}$.
     - Option B (Transfer to RMF): PVD is tax-exempt; Section 48(5) tax applies only to severance excess.
  2. Display immediate tax savings badge, net immediate cash, and retained RMF wealth.
  3. Ensure all text and labels are bilingual (Thai and English).

### 2026-10-17: AES-GCM Encrypted Offline Backup Vault (v2.2.4)

- **Date & Context:** 2026-10-17, during implementation of AES-GCM encrypted offline backup vault in `js/shared.js` and `index.html` (`v2.2.4`).
- **Problem:** Users exporting plaintext JSON backups faced privacy risks if files were stored on unencrypted USB drives or cloud sync folders.
- **Root Cause:** Standard JSON serialization lacks confidentiality and tamper protection.
- **Solution & Rule:**
  1. Use standard W3C Web Cryptography API (`crypto.subtle`) for 100% offline client-side security (zero CDN, zero external libraries).
  2. PBKDF2 key derivation with 100,000 iterations SHA-256 and 16-byte random salt.
  3. AES-GCM 256-bit encryption with 12-byte random IV providing AEAD authenticated ciphertext integrity.
  4. Standardized `.superapp.vault` envelope format: `{ format: 'money-superapp-vault-v1', salt, iv, ciphertext, createdAt }`.

### 2026-10-17: 360° Financial Health Scorecard & 5-Axis Spider/Radar Chart Engine (v2.2.3)

- **Date & Context:** 2026-10-17, during implementation of 360° Financial Health Scorecard in `dashboard.html` (`v2.2.3`).
- **Problem:** Users had separate metrics (emergency runway, savings rate, debt-to-asset, FIRE progress, tax efficiency) without a single unified index of overall financial health.
- **Root Cause:** Metrics were displayed across disconnected widgets without a holistic diagnostic model.
- **Solution & Rule:**
  1. Implement 5 core financial pillars: Emergency Runway (target 6+ mos), Savings Rate (target 50%+), Debt Safety (Debt/Assets ratio), Wealth Accumulation (FIRE / NW target progress), and Tax Optimization.
  2. Render lightweight SVG spider/radar chart using native `<polygon>` coordinates without external charting libraries.
  3. Dynamically assign overall health tier (Excellent, Solid, Moderate, Needs Attention, Critical) with personalized actionable improvement tips.

### 2026-10-17: Net Worth Real-Value Inflation Deflator & Purchasing Power Projection Engine (v2.2.2)

- **Date & Context:** 2026-10-17, during implementation of net worth real-value inflation deflator & purchasing power projection engine in `dashboard.html` (`v2.2.2`).
- **Problem:** Over multi-decade financial horizons (10–30 years), nominal targets create a severe money illusion: at 2.5% inflation, a 10M THB net worth target has only ~6.1M THB of real purchasing power after 20 years (38.97% purchasing power erosion). Users planning for retirement or long-term wealth goals had no way to quantify real inflation-discounted value vs required nominal targets.
- **Root Cause:** Dashboard goal and net worth metrics tracked nominal THB amounts exclusively, omitting compound inflation discounting.
- **Solution & Rule:**
  1. Implement deflation discount multiplier $\text{Multiplier} = (1 + r)^{-t}$, computing Real Present Value = $\text{Nominal} \times \text{Multiplier}$ and Purchasing Power Erosion % = $(1 - \text{Multiplier}) \times 100\%$.
  2. Compute required future nominal savings to preserve today's real purchasing power: $\text{Required Nominal} = \text{Target} \times (1 + r)^t$.
  3. Render dynamic multi-year discount schedules (1, 5, 10, 15, 20, 25, 30 years) with interactive inflation rate and horizon sliders.
  4. Use isolated CSS pill classes (`.deflator-pill`) instead of existing `.swr-pill` or `.scenario-pill` to prevent pill querySelector collisions and dataset attribute bugs.



### 2026-10-17: Annual Cumulative Payslip Withholding vs PIT Reconciliation Bridge (v2.2.1)

- **Date & Context:** 2026-10-17, during implementation of annual cumulative payslip withholding vs statutory PIT reconciliation bridge with PromptPay direct deposit refund simulation in `months-slips.html` (`v2.2.1`).
- **Problem:** Monthly payslip estimates calculate average monthly withholding based strictly on base salary and bonus, but employees file ภ.ง.ด.91 with additional year-end deductions (insurance, ThaiESG, SSF/RMF, mortgage interest, donations) or have actual 50 Tawi certificates differing from annualized estimates. Users had no bridge connecting monthly payroll withholding to year-end tax refunds or installment liabilities.
- **Root Cause:** Monthly payroll calculation and annual PIT reconciliation were treated as disconnected lifecycle stages.
- **Solution & Rule:**
  1. Add Year-End PIT Reconciliation & Refund Tracker (`runReconciliation()`) computing true statutory liability after extra deductions and comparing it against cumulative withholding.
  2. Simulate PromptPay direct deposit refund eligibility when withheld > liability, displaying adjusted annual net income (`payroll net + refund`).
  3. Offer 3-month interest-free installment schedule when liability > withheld by $\ge 3,000$ THB (March/April/May deadlines).
  4. Preserve user state in localStorage with dirty-checking (`isWithheldUserEdited`) so custom 50 Tawi inputs are not overwritten by monthly slider recalculations unless explicitly requested via "🔄 Use 12-Month Payslip Sum".



### 2026-10-17: Cross-Portfolio Asset Allocation Correlation Matrix & Risk Diversification (v2.2.0)

- **Date & Context:** 2026-10-17, during implementation of cross-portfolio asset allocation correlation matrix and risk diversification visualizer in `rebalance.html` (`v2.2.0`).
- **Problem:** Users with rebalancing portfolios spanning diverse asset classes (US equities, world equities, government bonds, gold, REITs, crypto, cash) had no quantitative visibility into real portfolio correlation or concentration risk. Portfolios consisting of 100% US equities or 90% tech ETFs appeared "diversified" by count of tickers despite having ~0.90+ cross-asset correlation.
- **Root Cause:** Rebalancing algorithms optimize towards user-specified percentage weights without analyzing the underlying macro covariance/correlation between asset classes.
- **Solution & Rule:**
  1. Implement modern portfolio macro correlation matrix (`MACRO_CORRELATIONS`) classifying assets via keyword heuristics (`detectAssetClass()`).
  2. Compute weighted portfolio correlation $\rho = \sum_i \sum_j w_i w_j \rho_{ij}$ and diversification score $S = \text{clamp}(0, 100, (1 - \rho) \times 100)$.
  3. Tier portfolio risk: Excellent ($\rho \le 0.50$, multi-asset uncorrelated ballast like Gold & Bonds), Balanced ($0.50 < \rho \le 0.75$), or Concentrated ($\rho > 0.75$).
  4. Ensure HTML rendering sanitizes ticker/name outputs, handles empty/single-class portfolios gracefully without NaN, and displays actionable asset class distribution breakdown.



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


### 2026-10-17: Multi-Stage Cash Flow Sankey Stream & Visual Allocation Diagram

- **Date & Context:** 2026-10-17, implementing interactive Cash Flow Sankey Stream in `remaining-money.html` and `js/remaining-money.js` (`v2.1.7`).
- **Problem:**
  1. Personal budgeting users often struggle to grasp multi-stage money movement — specifically how Gross Income is first reduced by statutory deductions (Tax, Social Security, Provident Fund) to produce Net Disposable Income, and how that Disposable Income is subsequently distributed across Living Needs, Lifestyle Wants, Savings, and Investable Free Cash Flow.
  2. While Waterfall and Proportions Bar charts show 1-dimensional stacks, personal finance enthusiasts rely on Sankey flow streams to visualize branch-level volume conservation.
- **Resolution:**
  1. Implemented a deterministic mathematical coordinate solver `calculateSankeyFlows()` calculating node $X/Y$ geometries and slice heights across 3 sequential stages:
     - Stage 1 (Source): Gross Inflow (รายได้รวม)
     - Stage 2 (Intermediate Split): Statutory Deductions (หักตามกฎหมาย) and Take-Home Net Income (รับสุทธิ)
     - Stage 3 (Destination Allocations): Statutory Taxes & SSO, Living Needs (จำเป็น), Lifestyle Wants (ผันแปร), Savings & Investments (ออมและลงทุน), and Investable Net Surplus (คงเหลือลงทุน).
  2. Built `generateSankeyRibbonPath()` using cubic Bézier curves (`M ... C ... L ... C ... Z`) connecting source slices to destination slices with smooth, symmetric width conservation and translucent linear gradients.
  3. Integrated a 4th view mode (`🔀 สายธาร (Sankey)`) into the `.cashflow-view-switcher` toolbar with full `localStorage` persistence, responsive SVG scaling (`viewBox="0 0 600 240"`), and automatic deficit overspending warnings (`remaining < 0`).
  4. Added 4 unit tests in `tests/financial-math.test.mjs` verifying ribbon path syntax, 3-stage flow conservation, zero deductions/income edge cases, and deficit state detection (**131 automated unit tests passing, 0 Biome linter errors**).
- **Rule:** When implementing client-side Sankey flow visualizers without heavy 3rd-party graph libraries (ADR-001), use a 3-stage vertical slice solver with cubic Bézier ribbon paths, enforce strict node height conservation ($H_{\text{source}} = \sum H_{\text{dest}}$), and gracefully render negative net cash flow as a dedicated deficit indicator.


### 2026-10-17: Multi-Year Personal Income Tax Scenario Comparator & Bracket Inflation Stress-Tester

- **Date & Context:** 2026-10-17, implementing Tax Scenario Comparator & Inflation Bracket Creep Engine in `tax-calculator-base.html` (`v2.1.8`).
- **Problem:**
  1. Taxpayers exploring job offers, salary raises, or additional tax-saving investments lacked a side-by-side comparison to see marginal tax impact on raises vs effective tax rate shift.
  2. Taxpayers frequently suffer from "Bracket Creep" during inflationary periods, where a nominal salary increase matches inflation on paper, but pushes taxable income into a higher statutory tax bracket, resulting in a net decrease in real purchasing power.
- **Resolution:**
  1. Built an interactive **Scenario A vs Scenario B Comparator** in `tax-calculator-base.html` with one-click current state replication (`copyCurrentToScenarioB()`).
  2. Built `compareTaxScenarios()` calculating delta income, delta tax, marginal tax on the raise, effective tax rate change, and real purchasing power:
     $$\text{Real Take-Home} = \frac{\text{Scenario Take-Home}}{1 + \text{Inflation Rate} / 100}$$
  3. Added dynamic **Bracket Creep Alert** flagging scenarios where inflation exceeds nominal net returns, and real purchasing power declines despite a higher nominal salary.
  4. Added 4 unit tests in `tests/financial-math.test.mjs` verifying standard raise marginal rates, bracket creep losses, extra deduction tax savings, and zero-state stability (**135 automated unit tests passing, 0 Biome linter errors**).
- **Rule:** When presenting tax scenarios for salary raises or annual bonuses, always calculate both nominal take-home delta and inflation-adjusted real purchasing power to expose bracket creep where nominal income gains are eroded by progressive tax brackets.


### 2026-10-17: Debt Payoff Visual Milestone Road & Interest Velocity Comparison

- **Date & Context:** 2026-10-17, implementing Payoff Milestone Road & Interest Velocity in `debt-calculator.html` (`v2.1.9`).
- **Problem:**
  1. Users with multiple debts often struggle to maintain repayment momentum over long multi-year horizons when only viewing static tables.
  2. Borrowers rarely see how their monthly interest drain decays over time, missing the psychological boost of seeing monthly interest drop to zero.
- **Resolution:**
  1. Built an interactive **Payoff Milestone Road** (`#debtMilestoneRoadPanel`) in `debt-calculator.html` that dynamically maps every debt payoff event as a milestone checkpoint showing cumulative debt percentage cleared, remaining balance, and date.
  2. Implemented monthly **Interest Velocity Decay Tracker** calculating the percentage drop in monthly interest drain from initial month to final debt freedom day.
  3. Added dynamic speedup badge displaying exact months saved vs minimum-only payment schedule.
  4. Added 3 automated unit tests in `tests/financial-math.test.mjs` verifying milestone progression, cumulative clearance, interest velocity decay, and zero-debt resilience (**138 automated unit tests passing, 0 Biome linter errors**).
- **Rule:** When displaying debt payoff schedules, visualize individual debt closures as progressive milestone nodes with cumulative percentage cleared and monthly interest velocity drop to maximize borrower motivation.

### 2026-10-17: Thai Gold Purity Standards, Buyback Spread Discounts & PIT Exemption (Section 42(9))

- **Date & Context:** 2026-10-17, implementing Thai Gold Bar & Jewelry DCA P/L & Baht Weight Calculator in `rebalance.html` (`v2.4.0`).
- **Problem:**
  1. Thai gold weight and purity standards differ fundamentally from international troy ounce standards (99.99%). In Thailand, 96.5% purity is statutory standard: Gold Bar (ทองคำแท่ง) is 15.244g/baht, whereas Gold Jewelry (ทองคำรูปพรรณ) is 15.16g/baht due to soldering allowance.
  2. Buyback pricing mechanisms differ: Gold Bars trade with a statutory spread of 100 THB/baht below selling price with small block fees (100–350 THB, often waived for $\ge 5$ baht). Gold Jewelry experiences an immediate statutory melting/refining loss discount (~5% below gold bar spot) plus craft fees (500–2,000 THB/baht) that are lost upon purchase.
  3. Individual retail investors in Thailand frequently inquire about taxation on gold capital gains.
- **Resolution:**
  1. Built `MoneyApp.calculateThaiGoldMetrics(params)` standardizing exact conversion constants: 1 baht bar = 15.244g, 1 baht jewelry = 15.16g, 1 salung = 0.25 baht, 1 Troy Ounce = 31.1034768g.
  2. Implemented multi-tranche weighted average cost basis engine incorporating block/craft fees and real-time buyback liquidation value vs market selling valuation.
  3. Linked physical gold portfolio valuation directly into portfolio DCA rebalancing under Ballast bucket (`ticker: 'GOLD'`).
  4. Added prominent tax guidance banner clarifying that under **Section 42(9) of the Thai Revenue Code (ประมวลรัษฎากร มาตรา 42(9))**, capital gains from individual buying and selling of physical gold bullion and jewelry for personal investment are 100% exempt from Thai Personal Income Tax.
  5. Added comprehensive test suite (`tests/gold-calculator.test.mjs`) and smoke tests (**237 tests passing, 0 Biome errors**).
- **Rule:** When modeling Thai physical gold, never use a single flat gram weight or standard spot price: always bifurcate 96.5% bar (15.244g) vs jewelry (15.16g with 5% melting loss discount), factor in block/craft fees, and note PIT exemption under Section 42(9).

### 2026-10-17: Thai Inheritance Tax Act B.E. 2558 & Annual Lifetime Gifting Optimization

- **Date & Context:** 2026-10-17, implementing Thai Inheritance & Annual Gift Tax Simulator in `tax-calculator.html` (`v2.4.1`).
- **Problem:**
  1. Wealthy Thai families and estate planners frequently default to transferring large estates as a lump sum upon death, incurring substantial 5% to 10% statutory inheritance tax on portions exceeding 100M THB per heir.
  2. Users lack clarity regarding the per-heir nature of the 100M THB exemption and the 100% statutory exemption granted to legally registered spouses under Section 3(2) of the Inheritance Tax Act B.E. 2558.
  3. Taxpayers underutilize annual gift tax exemptions under Revenue Code Section 42(26)-(28) (20M THB/year for family movable/real estate, 10M THB/year for others) with the 5% Final Tax option under Section 48(6).
- **Resolution:**
  1. Built `MoneyApp.calculateThaiInheritanceAndGiftTax(params)` modeling the exact Thai statutory rules:
     - 100M THB exemption per heir per testator.
     - 5% tax on excess for ascendants/descendants, 10% for other beneficiaries, 0% (100% exempt) for legal spouses.
     - Annual gift tax with 20M/10M THB exemptions and 5% Final Tax on excess.
  2. Built **Wealth Transfer Strategy Optimizer** comparing Option 1 (Lump-Sum Inheritance) vs Option 2 (Phased Lifetime Gifting over $N$ years + Residual Inheritance), calculating exact legal tax savings (e.g. eliminating 3,000,000 THB tax on 160M THB estate).
  3. Integrated interactive `#inheritance-tax-card` in `tax-calculator.html` with preset pills, heir count scaling, and statutory compliance guidance (150-day filing deadline, 5-year installment rules).
  4. Added test suite (`tests/inheritance-tax.test.mjs`) and smoke tests (**246 tests passing, 0 Biome errors**).
- **Rule:** In Thai estate planning, calculate tax at the per-heir level (not aggregate estate), account for 100% spouse exemption, and leverage phased multi-year lifetime gifting (20M/yr family allowance) to legally minimize or eliminate inheritance tax liabilities.

### 2026-10-17: Retirement 3-Bucket Cash Flow Allocation & Statutory Social Security Offset

- **Date & Context:** 2026-10-17, implementing Retirement 3-Bucket Cash Flow & SSO Drawdown Simulator in `dashboard.html` (`v2.4.2`).
- **Problem:**
  1. Retirees and FIRE planners often face Sequence of Returns Risk (SRR) during early retirement if forced to liquidate growth equities during market drawdowns.
  2. Traditional flat withdrawal models fail to integrate Thai statutory guaranteed safety nets—such as Section 33/39 Social Security monthly pensions (typically 3,000–5,000+ THB/month) and elderly living allowances (600–1,000 THB/month)—which directly offset living expenses and significantly reduce required portfolio drawdowns.
- **Resolution:**
  1. Built `MoneyApp.calculateRetirementThreeBuckets(params)` implementing Harold Evensky's time-segmented 3-bucket architecture:
     - **Bucket 1 (Cash / Liquid Buffer):** 1–2 years of net living expenses in money market/high-yield savings.
     - **Bucket 2 (Fixed Income / Bonds):** 3–7 years in government/corporate bonds to generate stable yield and refill Bucket 1.
     - **Bucket 3 (Growth Equities / Global Assets):** Residual accumulated wealth invested long-term (8+ years horizon) with zero pressure to liquidate in bear markets.
  2. Factored in net annual drawdown after guaranteed income offset ($\text{Net Drawdown} = \max(0, \text{Living Expenses} - \text{Guaranteed Income})$).
  3. Calculated bear market runway years buffer ($(\text{Bucket 1} + \text{Bucket 2}) / \text{Net Drawdown}$), warning users if defensive cushion is underfunded.
  4. Added test suite (`tests/three-bucket-retirement.test.mjs`) and smoke tests (**252 tests passing, 0 Biome errors**).
- **Rule:** When designing retirement drawdown plans, always subtract statutory guaranteed income (SSO pension + elderly allowance) from gross expenses first to determine true portfolio withdrawal pressure, and allocate 5–8 years into defensive cash/bonds (Buckets 1 & 2) to neutralize sequence of returns risk.

### 2026-10-17: Thai Stock Dividend Tax Credit Optimization (ม.47 ทวิ แห่งประมวลรัษฎากร)

- **Date & Context:** 2026-10-17, implementing Thai Stock Dividend Tax Credit Calculator in `tax-calculator-base.html` (`v2.4.3`).
- **Problem:**
  1. Thai individual equity investors receiving stock dividends (Section 40(4)(b)) face a critical filing decision: either accept a 10% Withholding Tax as a Final Tax (หักภาษี ณ ที่จ่าย 10% จบ), or gross up the dividend and claim corporate tax credit under Section 47 bis of the Revenue Code.
  2. Under Thai statutory law, claiming dividend credit is an **all-or-none** rule: taxpayers cannot cherry-pick advantageous dividend receipts; they must include ALL dividends received in that tax year or none.
  3. Investors in lower personal income tax brackets (0%, 5%, 10%, 15%) frequently forfeit tens or hundreds of thousands of baht in statutory tax refunds because they assume the 10% withholding is optimal. Conversely, investors in high tax brackets (25%, 30%, 35%) accidentally increase their tax liability if they file without comparing.
- **Resolution:**
  1. Implemented `MoneyApp.calculateThaiDividendTaxCredit(params)`:
     - Multi-tier corporate income tax credit factor: $\text{Credit Factor} = \frac{t}{1 - t}$, yielding 25% credit for 20% CIT, 33.33% for 25% CIT, 17.65% for 15% CIT, and 0% for BOI-exempt dividends.
     - Grossed-up assessable income: $D \times (1 + \text{factor})$.
     - Dual-scenario evaluation: Scenario A (10% Final Tax) vs Scenario B (Full Claim under Section 47 bis).
     - Net tax advantage calculation identifying the optimal strategy with zero ambiguity.
  2. Integrated `#dividendTaxCreditCard` in `tax-calculator-base.html` with collapsible panel, quick preset pills, live comparative analysis cards, and "Apply to Total Tax Return" toggle.
  3. Connected credits directly into Form P.N.D. 90 annual tax waterfall, deducting both 10% WHT and corporate credit from annual tax liability.
- **Rule:** For Thai stock dividends, evaluate the marginal tax threshold against the corporate tax rate: taxpayers with marginal rates $\le 15\%$ should always claim Section 47 bis credit for refunds, while taxpayers with marginal rates $\ge 25\%$ should retain the 10% Final Tax to avoid higher tax liabilities.

### 2026-10-17: Thai Land & Building Tax Act B.E. 2562 (ภาษีที่ดินและสิ่งปลูกสร้าง)

- **Date & Context:** 2026-10-17, implementing Thai Land & Building Tax Calculator in `tax-calculator.html` (`v2.4.4`).
- **Problem:**
  1. Property owners, real estate investors, and heirs in Thailand often misunderstand the 4 statutory categories under the Land & Building Tax Act B.E. 2562 (พ.ร.บ. ภาษีที่ดินและสิ่งปลูกสร้าง พ.ศ. 2562):
     - Agricultural: 50M THB individual statutory exemption per local district.
     - Primary Residence (Land + House): 50M THB exemption if owner's name is in the house registration (ทะเบียนบ้าน).
     - Primary Building Only: 10M THB exemption on leased or family land.
     - Secondary Home / Investment Condo: Taxed from the very first baht (no exemption).
     - Vacant Land: Subject to punitive escalation (+0.3% every 3 consecutive years of non-use, capped at 3.0%).
  2. Taxpayers often do not know that tax liabilities of 3,000 THB or more can be paid in 3 equal monthly installments without any statutory interest penalty.
- **Resolution:**
  1. Built `MoneyApp.calculateThaiLandAndBuildingTax(params)` implementing exact progressive brackets for all 4 categories and vacant land penalty escalation.
  2. Integrated `#land-building-tax-card` in `tax-calculator.html` with preset appraisal buttons, vacant land penalty toggle, progressive tier breakdown accordion, and 3-month installment calculation banner.
- **Rule:** When modeling Thai real estate taxation, base calculations strictly on official Treasury Department appraisal values (not market transactions), check house registration status for 50M/10M residential exemptions, and enforce the 3-year +0.3% penalty progression on vacant parcels up to the 3.0% legal cap.

### 2026-10-17: Thai Mobile Banking CSV Statement Offline Auto-Parser (KBank, SCB, Krungthai, KKP)

- **Date & Context:** 2026-10-17, implementing Thai Mobile Banking Statement Auto-Parser in `remaining-money.html` and `js/shared.js` (`v2.4.5`).
- **Problem:**
  1. Users exporting CSV bank statements from Thai mobile banking apps (K PLUS, SCB Easy, Krungthai NEXT, KKP Mobile/Dime) could not import them directly into Remaining Money because each bank uses distinct column naming conventions (e.g. `Withdrawal` vs `จำนวนเงินที่ถอน` vs `Debit`, or single signed amounts).
  2. Manual reformatting of banking statements into Money Superapp's `[Category, Item, Amount, Note]` format is tedious, frustrating, and prone to copy-paste errors.
- **Resolution:**
  1. Built `MoneyApp.detectAndParseThaiBankStatement(csvText, fileName)` in `js/shared.js`:
     - Tokenizes RFC 4180 CSVs with embedded quotes and comma delimiters without any external dependencies.
     - Auto-detects Thai bank brands (Kasikornbank KBank, Siam Commercial Bank SCB, Krungthai KTB, KKP Mobile/Dime) via filename and header keyword fingerprints.
     - Dynamically maps Date, Description, Debit/Withdrawal, and Credit/Deposit columns.
     - Separates debits into `expenses` and credits into `incomes`, auto-populating candidates with net inflow/outflow summaries.
  2. Wired seamlessly into `parseImportCSV()` in `js/remaining-money.js`, automatically popping the interactive preview modal with detected bank format badges (`[Kasikornbank (KBank) CSV]`).
  3. Added comprehensive test suite (`tests/bank-statement-parser.test.mjs`) and smoke test assertions (**273 tests passing, 0 Biome errors**).
- **Rule:** Never force users to format bank statements manually; inspect header rows for known banking debit/credit signatures and auto-bifurcate inflows and outflows with bank brand detection prior to standard CSV parsing.

### 2026-10-18: Thai PIT Marginal Tax Bracket Boundary Step-Down Headroom Analyzer & DCA Rebalance Bridge

- **Date & Context:** 2026-10-18, implementing Thai PIT Bracket Boundary & Marginal Rate Step-Down Headroom Analyzer in `tax-calculator-base.html`, `js/tax-calculator-base.js`, `js/shared.js`, and `js/rebalance.js` (`v2.5.22`).
- **Problem:**
  1. Pre-existing bracket headroom banners only computed headroom *upward* ("how much more income before entering the next higher bracket"). However, taxpayers and financial planners during year-end tax season specifically seek *downward* optimization: "How much additional tax deduction (SSF, RMF, Thai ESG, life insurance) do I need to step down into a lower marginal tax bracket and what will my immediate guaranteed tax return be?".
  2. Users often feel overwhelmed by large lump-sum year-end deduction recommendations (e.g. 49,500 THB). Without a seamless bridge to long-term DCA execution, users fail to take action.
- **Resolution:**
  1. Built `MoneyApp.calculateTaxBracketStepDown(netTaxableIncome)` in `js/shared.js`:
     - Identifies the current progressive tier and immediate lower tier based on statutory Revenue Department brackets (0% to 35%).
     - Calculates exact `amountToStepDown` (net income minus lower threshold), `taxSavedAtStepDown`, `stepDownRoiPct` (guaranteed return equal to current marginal rate), `amountToTaxFree`, `taxSavedToTaxFree`, and `progressInCurrentTierPct`.
  2. Built interactive `#boxTaxBracketStepDown` in `tax-calculator-base.html` and `js/tax-calculator-base.js`:
     - Displays current and target bracket badges, a 4-metric grid, a visual progress bar, strategic callout advice, and one-click copy button.
     - Added `#btnBridgeStepDownToRebalance` that converts the annual target into a monthly DCA budget (`amountToStepDown / 12`), sets `moneySuperapp.pendingRebalanceSource = 'tax_stepdown'`, and jumps to `rebalance.html`.
  3. Enhanced `rebalance.js` `checkPendingBudget()` to recognize `'tax_stepdown'` with a tailored bilingual toast notification.
- **Rule:** When advising on tax brackets, always present downward marginal step-down targets alongside upward headroom, highlight the guaranteed tax savings ROI equal to the current marginal tax rate, and provide an automated monthly DCA bridge to make tax deductions manageable.

### 2026-10-18: PWA Web Share Target & Native Share Sheet Integration

- **Date & Context:** 2026-10-18, implementing PWA Web Share Target API & Native Share Sheet Integration across `manifest.json`, `sw.js`, `js/app-shell.js`, `dashboard.html`, `js/dashboard.js`, and `js/remaining-money.js` (`v2.5.23`).
- **Problem:**
  1. On mobile devices (iOS, iPadOS, Android), users who download bank statements from mobile banking apps or receive backups from email/chat had to manually open file pickers and navigate complex directory trees to import files into Money Superapp.
  2. Native system share sheets on mobile provide a far superior user experience than classic file downloads, allowing direct export to iCloud Drive, Google Drive, AirDrop, LINE, or messaging apps.
  3. Exporting the Executive Financial Dossier was restricted to printing/PDF, missing a quick, formatted plain-text sharing option that respects privacy masking.
- **Resolution:**
  1. Declared W3C `share_target` in `manifest.json` for `.csv`, `.txt`, `.json`, and `.vault` files with `POST multipart/form-data`.
  2. Intercepted share target `POST` requests in Service Worker `sw.js` completely offline without any network server, caching payloads temporarily under a protected `'money-superapp-shared-payload'` cache and redirecting to `index.html?incoming_share=1`.
  3. Built `checkIncomingShareTarget()` in `js/app-shell.js` which detects incoming payload, prompts for backup restoration if `.vault` / JSON, or forwards statement files to `remaining-money.html` where `checkPendingBankStatement()` automatically parses with bank detection and opens the preview modal.
  4. Built `shareOrDownloadFile()` in `js/app-shell.js` for seamless native file sharing with graceful fallback to download, and added `#btnShareDossier` in `dashboard.html` / `js/dashboard.js` with `MoneyApp.formatExecutiveDossierSummaryText()` supporting privacy masks.
- **Rule:** For offline-first PWAs, implement Web Share Target by intercepting `POST` requests inside the Service Worker fetch event and persisting payloads in a dedicated Cache API bucket; always provide seamless fallbacks to anchor downloads and clipboard copy when native sharing APIs are unavailable.

### 2026-10-18: Modular Calculation Engine Architecture & Script Load Order Independence (Phase 88)

- **Date & Context:** 2026-10-18, modularizing large monolithic calculation domains from `js/shared.js` into self-contained `js/engines/` (`thai-pit.js`, `thai-tax-calendar.js`, `insurance.js`, `gold.js`, `foreign-tax.js`) (`v2.5.31`).
- **Problem:**
  1. `js/shared.js` grew to ~4,650 lines, conjoining application shell lifecycle, DOM helpers, and 15+ disparate calculation engines. This bloated bundle size, hampered code navigation, and created risk of circular/order dependencies.
  2. Under ADR-001 (Zero-Build, 100% offline, `file://` compatibility), ES module `import`/`export` is prohibited due to browser CORS policies on `file://`.
  3. Simple object overwrites (`global.MoneyApp = { ... }`) risk clobbering engines if loaded in different orders, while self-referencing delegation wrappers risk infinite recursion stack overflows if not guarded against identity match (`global.MoneyApp.fn !== fn`).
- **Resolution:**
  1. Extracted 5 pure domain calculation engines into `js/engines/` using self-registering IIFEs that safely initialize and attach to `global.MoneyApp = global.MoneyApp || {}`.
  2. In `js/shared.js`, unified namespace extension with non-destructive `var MoneyApp = Object.assign(global.MoneyApp || {}, { ... })`, eliminating clobbering regardless of whether engines are loaded before or after `shared.js`.
  3. Implemented re-entrancy guarded forwarders in `js/shared.js` to ensure backward compatibility and prevent recursive loops: `if (global.MoneyApp.fn && global.MoneyApp.fn !== fn) return global.MoneyApp.fn(args)`.
  4. Registered all new engine files in `sw.js` (`ASSETS_TO_CACHE`), `tests/smoke.test.mjs` (`CORE_JS_SCRIPTS`), and all dependent HTML pages (`tax-calculator-base.html`, `dashboard.html`, `rebalance.html`, `remaining-money.html`, `debt-calculator.html`, `tax-calculator.html`, `months-slips.html`).
- **Rule:** When modularizing zero-build offline-first codebases under `file://`, use self-registering IIFEs on the shared global namespace and merge with `Object.assign(global.App || {}, { ... })`, and always guard delegation wrappers with identity checks against recursion.


### 2026-10-19: Zero-Dependency Web Worker for Heavy Simulations with Dual file:// and http(s):// Compatibility (Phase 111)

- **Date & Context:** 2026-10-19, extracting Monte Carlo simulation engine and offloading heavy iterative simulations to a dedicated Web Worker (`js/engines/monte-carlo.js`, `js/workers/simulation-worker.js`, `js/dashboard.js`, `dashboard.html`) (`v2.5.54`).
- **Problem:**
  1. Heavy Monte Carlo simulations (up to 2,000 iterations over 40+ years with annual inflation adjustments and percentile ranking) ran synchronously on the main thread during dashboard initialization, freezing UI interactions and degrading First Input Delay (FID) / Interaction to Next Paint (INP).
  2. In zero-build offline-first PWAs supporting dual execution modes (`file://` protocol without a web server vs. `http(s)://` PWA), instantiating a Web Worker under `file://` fails with browser `SecurityError` due to local origin restrictions.
  3. Rapid user adjustments to slider inputs or financial goals can trigger overlapping concurrent simulation dispatches, risking race conditions where stale simulation results overwrite fresher user state.
  4. Unmanaged worker instances or dangling promises from worker hangs/crashes can cause memory leaks and stalled UI states.
- **Resolution:**
  1. **Dual Protocol Compatibility & Graceful Fallback**: Built `MoneyApp.simulateMonteCarloAsync(params)` in `js/dashboard.js` with protocol sniffing (`window.location.protocol === 'file:'` or `typeof Worker === 'undefined'`) and try-catch around `new Worker()`. When in `file://` mode or worker instantiation fails, it seamlessly falls back to synchronous execution on the main thread without failing or blocking.
  2. **Monotonic Sequence Counters**: Implemented `_latestSimulationSeq` counter in `js/dashboard.js`. Every dispatched simulation request is stamped with an incremented sequence ID. When asynchronous results resolve, any result whose sequence ID is older than `_latestSimulationSeq` is discarded, preventing race conditions from out-of-order execution.
  3. **Singleton Worker Pool & Request Drainage**: Maintained a lazy singleton worker instance (`_simulationWorkerInstance`) rather than spawning a new Worker per simulation run. Managed inflight requests via a Map (`_pendingRequests`) with unique message IDs, 5,000ms safety timeout timers, and a crash handler (`_onWorkerFailure`) that marks the worker as failed, cleans up timers, drains pending requests via the synchronous engine fallback, and terminates the faulty worker.
  4. **Modular Architecture & Precache Registration**: Extracted pure deterministic simulation math to `js/engines/monte-carlo.js` using self-registering IIFE, loaded in worker via `importScripts('../engines/monte-carlo.js')`, added to `dashboard.html`, registered in `sw.js` (`ASSETS_TO_CACHE`), and verified via `tests/simulation-worker.test.mjs`.
- **Rule:** For compute-intensive tasks in zero-build offline-first PWAs, offload to dedicated Web Workers using a lazy singleton pool with fallback to synchronous execution for `file://` environments, prevent out-of-order rendering with monotonic sequence counters, and ensure robust memory/error hygiene with request map drainage and safety timeouts.


### 2026-10-19: Advanced Service Worker Cache Lifecycle & Storage Quota Diagnostics (Phase 112)

- **Date & Context:** 2026-10-19, implementing offline cache lifecycle management and client-side storage quota diagnostics (`sw.js`, `js/app-shell.js`, `index.html`, `js/i18n/th.js`, `js/i18n/en.js`) (`v2.5.55`).
- **Problem:**
  1. Users and developers lacked client-side visibility into local storage quota consumption and offline Service Worker cache status, making it difficult to verify whether all PWA assets were fully pre-cached or whether stale caches were accumulating over version updates.
  2. Cache purge operations risk accidentally deleting active runtime caches or Web Share Target payload stores (`money-superapp-shared-payload`), causing app breakage or loss of incoming file shares.
  3. Direct communication between the App Shell and Service Worker (`postMessage`) can fail or hang when responses are routed blindly without dedicated bi-directional reply channels, especially across differing browser environments or headless test runners where `event.source` may be null or detached.
  4. In restricted browsing contexts (such as private/incognito windows or older web engines), `navigator.storage.estimate()` may be unsupported, throw errors, or report zero values.
- **Resolution:**
  1. **Dual-Tier Storage Estimation with Cache API Fallback:** Implemented `updateStorageQuotaDisplay()` in `js/app-shell.js` leveraging `navigator.storage?.estimate()` to calculate device storage usage, total quota, and percentage consumption. When `navigator.storage.estimate` is unavailable or returns 0, the controller falls back to directly querying `window.caches.open()` and enumerating cached request sizes to ensure accurate offline diagnostics.
  2. **Bi-Directional MessageChannel Communication with event.source Fallback:** Standardized Service Worker messaging protocol (`GET_CACHE_STATUS`, `PURGE_STALE_CACHES`, `REFRESH_CACHE`) in `sw.js` and `js/app-shell.js`. Messages are sent using `new MessageChannel()`, allowing the worker to respond directly via `event.ports[0].postMessage(...)`. If no port is transferred, the worker gracefully falls back to `event.source.postMessage(...)` or client broadcasting, with fallback to direct `window.caches` DOM APIs when the Service Worker is not yet active.
  3. **Safe Cache Lifecycle & Invariant Protection:** Hardened cache activation eviction in `sw.js` and explicit purge routines (`PURGE_STALE_CACHES`):
     - Protected active `CACHE_NAME` and Web Share Target store (`money-superapp-shared-payload`) from accidental eviction.
     - Wrapped each `caches.delete(key)` in resilient error handling (`.catch(() => false)`) so cache lock contention never aborts SW activation or delays `self.clients.claim()`.
  4. **Quality Gates & Automated Verification:** Created comprehensive test suite `tests/sw-cache-quota.test.mjs` (byte formatting, SW message contracts, Node VM mock cache execution, DOM structure, and i18n dictionary symmetry) and updated `tests/smoke.test.mjs`.
- **Rule:** When managing offline PWA cache lifecycles, always protect active application cache and Web Share Target stores from eviction, use bi-directional `MessageChannel` ports with `event.source` fallback for reliable SW messaging, provide native Cache API fallbacks for storage estimation, and wrap cache deletion operations in resilient error handlers to prevent activation hangs.


### 2026-10-19: Zero-Dependency Headless Chrome CDP E2E Multi-Journey Test Suite (Phase 113)

- **Date & Context:** 2026-10-19, implementing zero-dependency headless Chrome DevTools Protocol (CDP) multi-journey browser test suite (`tests/e2e-browser-journeys.test.mjs`, `package.json`, `tests/smoke.test.mjs`) (`v2.5.56`).
- **Problem:**
  1. Unit tests running in Node.js `node:vm` or mock DOM environments cannot verify true multi-window/cross-iframe browser behaviors: URL hash routing synchronization (`#appFrame` src), iframe parent-child `postMessage` event propagation, cross-tool Bridge lifecycle execution (`moneySuperapp.pendingBudget`), and browser localStorage/theme/language reload persistence.
  2. Introducing heavyweight testing frameworks (Puppeteer, Playwright, Cypress) introduces hundreds of NPM runtime/dev dependencies, violating ADR-001 (Zero NPM runtime dependencies, minimal toolchain footprint).
  3. Headless Chrome processes spawned directly in Node.js test suites can leak background processes, lock temporary user-data directories, or hang test execution if process lifecycle and CDP WebSocket connections are not gracefully terminated.
- **Resolution:**
  1. **Zero-Dependency Headless Chrome CDP Driver (`tests/e2e-browser-journeys.test.mjs`):** Built a self-contained CDP WebSocket client using native Node.js 22 `WebSocket`, `node:http`, and `node:child_process`:
     - Spawns Chrome/Chromium (`--headless=new`, `--remote-debugging-port=0`, `--user-data-dir=<temp-dir>`) discovered via `resolveChromeBinary()`.
     - Starts an ephemeral static HTTP loopback server on dynamic port (`port: 0`) to serve application assets without external dependencies or cross-origin restrictions.
     - Implements robust lifecycle teardown: closes CDP WebSocket, sends graceful `Browser.close` command via CDP, issues fallback process termination (`SIGTERM` / `SIGKILL`), and recursively removes temporary profile directories with retry logic.
  2. **End-to-End Cross-Iframe Multi-Journey Verification:** Created 5 comprehensive journey suites executing against real browser DOM:
     - **Journey 1 (Tab & Hash Sync):** Verifies app shell tab button clicks, programmatic `window.switchToTab()`, and `window.location.hash` changes properly synchronize iframe URL and active UI classes.
     - **Journey 2 (Theme & Language Persistence):** Validates dark/light theme switching and Thai/English bilingual toggles persist across full browser page reloads (`location.reload()`) with matching DOM attributes (`lang`, `data-theme`).
     - **Journey 3 (Cross-Tool Bridge Protocol):** Validates end-to-end data transfer from `remaining-money.html` to `rebalance.html` via `moneySuperapp.pendingBudget`, verifying single-use consumption, budget input injection, and UI alert banner display.
     - **Journey 4 (Backup, Reset & Restore Round-Trip):** Validates full-app JSON export, master data purge across all tool namespaces, and exact state reconstitution from exported backup payload.
     - **Journey 5 (Settings & Storage Diagnostics):** Validates opening settings modal, inspecting storage quota readout, dynamic cache version display, and clean modal dismissal.
  3. **Automated Quality Gates:** Added `npm run test:e2e` to `package.json`, integrated regression contract assertions in `tests/smoke.test.mjs`, and verified zero-dependency compatibility across all test runs.
- **Rule:** When creating end-to-end browser tests in zero-dependency architectures, use native Node.js `WebSocket` and CDP over an ephemeral loopback HTTP server, always enforce strict process lifecycle management (graceful `Browser.close`, fallback `SIGKILL`, and temp dir removal), and verify cross-frame contracts end-to-end against live DOM and `localStorage`.


### 2026-10-19: Responsive Container Width Standardization (896px / max-w-4xl) Across Sub-Tools (Phase 119)

- **Date & Context:** 2026-10-19, standardizing child tool layout container widths across `rebalance.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, and `dashboard.html` to align with `tax-calculator-base.html` and `months-slips.html` (`v2.5.62`).
- **Problem:**
  1. Previously, five standalone tools (`rebalance.html`, `tax-calculator.html`, `remaining-money.html`, `debt-calculator.html`, and `dashboard.html`) were constrained to an ultra-narrow mobile container width of `max-width: 520px; margin-inline: auto;`.
  2. In contrast, `tax-calculator-base.html` and `months-slips.html` used `max-w-4xl` (`896px` / `56rem`), resulting in an inconsistent visual presentation on desktop/tablet viewports where users with widescreen monitors experienced jarring width collapses when switching between tools.
  3. When widening container boundaries to 896px, care had to be taken not to induce horizontal layout overflow or edge blowout on narrow mobile devices (down to 320px/375px), and not to alter print stylesheets which rely on unconstrained `max-width: 100% !important`.
- **Resolution:**
  1. **Container Alignment Parity:** Standardized `body { max-width: 896px; margin-inline: auto; }` across all 5 child tools, matching Tailwind `max-w-4xl` (`896px`) used by Income Tax and Payslips.
  2. **Mobile Progressive Side Padding:** Applied responsive media queries (`@media (max-width: 640px)` / `@media (max-width: 480px)`) ensuring compact inner card padding (12px to 16px) with zero horizontal blowout (`scrollWidth <= innerWidth`).
  3. **Print Stylesheet Isolation:** Preserved `@media print { body { max-width: 100% !important; ... } }` ensuring unclipped full-width A4 printing across all pages.
  4. **Adversarial Audit & Regression Fix:** During review, caught an accidental overwrite of `.undo-btn:hover` in `rebalance.html` and immediately restored interactive button hover styling.
  5. **Automated Verification:** Enhanced `tests/smoke.test.mjs` contract assertions and expanded `tests/visual-regression.test.mjs` CDP tests asserting that all tools expand beyond 520px up to 896px on desktop (1024x768) and maintain strictly 0px overflow on mobile (375x667).
- **Rule:** When harmonizing responsive layout widths across multi-tool suites, always unify desktop max-width constraints (896px / `max-w-4xl`) while enforcing mobile responsive paddings, preserve dedicated print stylesheet overrides (`max-width: 100% !important`), and guard interactive button pseudo-classes during media query insertions.

### 2026-10-19: Privacy-Preserving Expense Tracking Export to Google Drive (CSV Ledger & PDF) (Phase 120)

- **Date & Context:** 2026-10-19, implementing Save Expense Tracking Data to Google Drive in `remaining-money.html` (`v2.5.63`).
- **Problem:**
  1. Users calculating monthly budgets in `remaining-money.html` needed a seamless method to export their expense and cash flow data into Google Drive / Google Sheets to maintain recurring monthly expense tracking over time.
  2. Integrating external third-party SDKs (such as Google Drive REST API, Google Identity Services OAuth, or external webhook relays) would directly violate ADR-001 (Zero-Build Static PWA, 100% Client-Side Privacy, zero remote scripts or telemetry trackers).
  3. Exported CSV data opened in spreadsheet software (Google Sheets, Microsoft Excel) is vulnerable to CSV Formula Injection attacks (`=cmd|'`, `+`, `-`, `@`) and UTF-8 encoding corruption (mojibake) if not sanitized and BOM-prefixed properly.
- **Resolution:**
  1. **Zero-SDK Web Share API Level 2 Integration:** Implemented `#btnSaveToDrive` and `#driveExportModal` utilizing native `navigator.share({ files: [file] })`. On mobile (Android/iOS) and supported desktop operating systems, users can directly select "Save to Drive" / "Google Drive" from the native OS share sheet. For unsupported environments or desktop clicks, it automatically triggers a direct file download (`remaining_expense_ledger_YYYY-MM-DD.csv`).
  2. **Standardized 7-Column Expense Tracking Ledger:** Engineered `generateExpenseLedgerCSV()` returning `Date,Type,Category,Item,Amount (THB),Note,Month`. Formats ISO dates and months (`YYYY-MM-DD`, `YYYY-MM`), auto-categorizes line items (Income, Expense, Savings, Summary), and includes a summary KPI footer ready for Google Sheets pivot tables and expense analysis.
  3. **CSV Formula Injection Safeguard & UTF-8 BOM:** Routed all text cells through `csvSafe()` to escape formula triggers with a leading single quote (`'`), escaped quotes and delimiters via RFC-4180 (`""`), and prepended UTF-8 BOM (`\uFEFF`) to prevent spreadsheet garbling.
  4. **Direct Navigation Shortcuts:** Included safe outbound shortcuts (`target="_blank" rel="noopener noreferrer"`) to Google Drive (`drive.google.com`) and Google Sheets (`sheets.new`) alongside clear usage guidance.
  5. **Automated Quality Gates:** Added contract checks in `tests/smoke.test.mjs`, verified 100% bilingual dictionary symmetry (10 Phase 120 keys in `js/i18n/th.js` and `js/i18n/en.js`), and proved 100% pass across all 670 automated test suites.
- **Rule:** For cloud storage exports in zero-build client-side PWAs, leverage browser-native Web Share Level 2 file sharing and direct download fallbacks instead of external third-party SDKs, always sanitize CSV cells against formula injection with UTF-8 BOM encoding, and provide secure `rel="noopener noreferrer"` shortcuts to destination web applications.




