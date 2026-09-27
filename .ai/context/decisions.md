# Architecture Decisions

> Verified architectural decisions discovered in the Money Superapp codebase.
> Only deliberate architectural choices and trade-offs are recorded here.

---

## Decisions Index

- [ADR-001: Zero-Build Static PWA Architecture with 100% Client-Side Privacy](#adr-001--zero-build-static-pwa-architecture-with-100-client-side-privacy)
- [ADR-002: Modular Multi-Tool Iframe App Shell Architecture](#adr-002--modular-multi-tool-iframe-app-shell-architecture)
- [ADR-003: Replacement of External CDN with Offline Tailwind-Lite CSS](#adr-003--replacement-of-external-cdn-with-offline-tailwind-lite-css)
- [ADR-004: Decoupling Automatic Cross-Page Data Synchronization in Favor of Explicit User Actions](#adr-004--decoupling-automatic-cross-page-data-synchronization-in-favor-of-explicit-user-actions)
- [ADR-005: Automated Semantic Version Bumping & Service Worker Cache Invalidation](#adr-005--automated-semantic-version-bumping--service-worker-cache-invalidation)

---

### ADR-001 — Zero-Build Static PWA Architecture with 100% Client-Side Privacy

**Status:** Accepted

**Context:**
Personal financial planning applications involve highly confidential user data (monthly salaries, debt accounts, retirement balances, and tax brackets). Traditional SaaS models require user accounts, databases, and network transmission, creating compliance overhead and user trust friction.

**Decision:**
Build Money Superapp as a zero-build, static Progressive Web App (PWA) with 100% client-side execution. Eliminate all server-side dependencies, APIs, and background databases. Persist all state in browser `localStorage`.

**Reason:**
- Guarantees complete data privacy by construction: sensitive financial numbers never traverse a network.
- Eliminates hosting and database infrastructure costs.
- Allows immediate zero-setup execution by opening `index.html` directly in any web browser or installing as a PWA.

**Consequences:**
- **Positive:** Zero server running cost; 100% offline availability; instant load times; maximum user trust.
- **Negative:** No cross-device automatic sync out of the box (requires manual JSON export/import via the shell settings modal).

**Evidence:**
- [`README.md`](file:///home/l2okii/Documents/money-superapp/README.md) lines 3–4: *"no build step, no server, 100% client-side privacy"*
- [`index.html`](file:///home/l2okii/Documents/money-superapp/index.html) lines 318–322: Privacy banner notice

---

### ADR-002 — Modular Multi-Tool Iframe App Shell Architecture

**Status:** Accepted

**Context:**
The application comprises seven specialized tools (Dashboard, Rebalance, Payslips, Income Tax, PVD Tax, Remaining Money, Debt Payoff). Combining all tools into a single monolithic DOM page causes CSS class conflicts, bloated memory footprints, and complex multi-page lifecycle bugs.

**Decision:**
Use `index.html` as a lightweight host shell containing desktop tabs, mobile bottom navigation, and global language/theme toggles, hosting each individual calculator within a centered `<iframe>`.

**Reason:**
- Enforces strict process and CSS style isolation between tools.
- Allows each tool to be run and tested standalone (e.g. `open debt-calculator.html`) without the shell.
- Prevents DOM bloat and keeps execution lightweight on mobile devices.

**Consequences:**
- **Positive:** Modular codebase; independent development and refactoring of individual calculators; clean DOM separation.
- **Negative:** Requires `postMessage` event passing for cross-frame tab switching and keyboard shortcut forwarding.

**Evidence:**
- [`index.html`](file:///home/l2okii/Documents/money-superapp/index.html) line 316: `<iframe id="app" src="dashboard.html"></iframe>`
- [`README.md`](file:///home/l2okii/Documents/money-superapp/README.md) line 36: *"Each tool also works standalone"*

---

### ADR-003 — Replacement of External CDN with Offline Tailwind-Lite CSS

**Status:** Accepted

**Context:**
Early versions of the application imported Tailwind CSS from an external CDN (`cdn.tailwindcss.com`). This broke offline PWA functionality when network connections were unavailable and violated the zero-external-dependency requirement.

**Decision:**
Extract all used Tailwind utility classes into a local, lightweight stylesheet ([`css/tailwind-lite.css`](file:///home/l2okii/Documents/money-superapp/css/tailwind-lite.css)) and bundle it directly into the Service Worker precache.

**Reason:**
- Guarantees full offline capability without network dependencies.
- Drastically reduces asset payload size compared to full CDN builds.
- Protects user privacy by preventing third-party CDN tracking.

**Consequences:**
- **Positive:** 100% offline reliability; zero external HTTP requests; instant rendering.
- **Negative:** New utility classes must be explicitly added to `css/tailwind-lite.css` if new styles are required.

**Evidence:**
- Commit `6fc3668`: *"fix: sanitize attribute inputs, remove external tailwind cdn, add a11y"*
- [`css/tailwind-lite.css`](file:///home/l2okii/Documents/money-superapp/css/tailwind-lite.css)
- [`sw.js`](file:///home/l2okii/Documents/money-superapp/sw.js) lines 12: `'./css/tailwind-lite.css'` in `ASSETS_TO_CACHE`

---

### ADR-004 — Decoupling Automatic Cross-Page Data Synchronization in Favor of Explicit User Actions

**Status:** Accepted

**Context:**
Previously, a shared profile (`moneySuperapp.sharedProfile`) automatically synchronized changes to salary, bonus, and PVD percentages across all open calculators in real time via `storage` event listeners. Users reported that testing "what-if" scenarios or salary changes in one tool (such as the Payslip simulator or PVD calculator) unintentionally overwrote realistic baseline inputs in other calculators.

**Decision:**
Completely decouple automatic cross-page background data syncing. Keep each calculator's state strictly isolated in its own dedicated `localStorage` key. Inter-calculator data transfer must be triggered by explicit user interaction (e.g., clicking "Import Savings", "Send to Remaining Money", or "Send to DCA").

**Reason:**
- Eliminates destructive side-effects and accidental data loss during exploratory financial modeling.
- Gives the user complete control over when and what information moves between tools.
- Preserves the read-only integrity of the consolidated Dashboard.

**Consequences:**
- **Positive:** Predictable user experience; zero unexpected state overwrites.
- **Negative:** Users must click explicit transfer buttons when they want data to propagate from one tool to another.

**Evidence:**
- Commit `84b16d5`: *"fix(sync): decouple automatic cross-page data synchronization, require explicit button click, bump v1.3.15"*
- [`debt-calculator.html`](file:///home/l2okii/Documents/money-superapp/debt-calculator.html) lines 758–794 (`importFromRemainingMoney` explicit handler)
- Removal of `PROFILE_KEY` listeners in [`tax-calculator-base.html`](file:///home/l2okii/Documents/money-superapp/tax-calculator-base.html)

---

### ADR-005 — Automated Semantic Version Bumping & Service Worker Cache Invalidation

**Status:** Accepted

**Context:**
Offline-first PWAs heavily cache static assets. When updates or bug fixes were deployed, browsers continued serving stale HTML and JS files from Service Worker caches, confusing users and developers.

**Decision:**
Implement an automated semantic version bumper ([`scripts/bump.mjs`](file:///home/l2okii/Documents/money-superapp/scripts/bump.mjs)). Running `node scripts/bump.mjs [patch|minor|major]` atomically increments the version in:
1. `<meta name="version">` and badges in `index.html`
2. `CACHE_NAME` in `sw.js`
3. All 7 calculator tool footers and meta tags
4. Query-string cache-busters `?v=<version>` applied dynamically by `index.html` to iframe URLs
5. `README.md` header title

**Reason:**
- Guarantees synchronized cache invalidation across the Service Worker and iframe embeds.
- Automates tedious manual updates across 10+ files.

**Consequences:**
- **Positive:** Fast, reliable releases; prevents stale cache bugs; clear version audit trail.
- **Negative:** Developers/agents must remember to run `node scripts/bump.mjs` before concluding releases.

**Evidence:**
- [`scripts/bump.mjs`](file:///home/l2okii/Documents/money-superapp/scripts/bump.mjs)
- Commit `320437e`: *"fix(sw): bypass stale cache with cache reload, query param busting, and bump to v1.3.12"*
- Commit `e9b3983`: *"Add rule to always bump version after fixes/updates"*
