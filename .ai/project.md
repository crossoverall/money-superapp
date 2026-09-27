# Project Context: Money Superapp

> High-level entry point for AI agents. Source code is the ultimate source of truth.

## Project
- **Name:** Money Superapp
- **Archetype:** Client-Side Single-Page Application (SPA) / Progressive Web App (PWA) / Financial Toolkit
- **Purpose:** Lightweight, offline-first personal finance toolkit for Thailand covering Net Worth tracking, DCA portfolio rebalancing, payslip simulation, personal income tax (PIT), severance/PVD tax (Section 48(5)), cash flow runway, and debt payoff planning.
- **Privacy Model:** 100% Client-Side Privacy — zero server-side storage, no backend, no telemetry.

## Technology Stack
- **Languages:** HTML5, CSS3, Vanilla JavaScript (ES6+ in browser, Node.js ESM in maintenance scripts)
- **Frameworks / Libraries:** None (Zero NPM runtime dependencies; Vanilla DOM & native SVG rendering)
- **Styling:** Custom offline utility CSS (`css/tailwind-lite.css`) + CSS Custom Properties (Light/Dark themes)
- **Build System / Toolchain:** None (No build step, no bundler; runs directly in browser or static host)
- **Persistence:** Browser `localStorage` (JSON-serialized key-value stores)
- **Offline / PWA:** Service Worker (`sw.js`) with Cache API (`stale-while-revalidate`), Web App Manifest (`manifest.json`)
- **Version Automation:** Node.js script (`scripts/bump.mjs`)

## Major Components
- **App Shell (`index.html`):** Navigation tabs, mobile bottom nav bar, language (TH/EN) & theme toggles, JSON backup/restore modal, and iframe host container.
- **Dashboard (`dashboard.html`):** Aggregates KPIs (Net Worth, Savings Rate, Runway, Debt, Tax Bracket) and historical trend SVG charting.
- **Rebalance Calculator (`rebalance.html`):** DCA monthly asset allocation, shortfall calculations, and portfolio allocation donut chart.
- **Payslip Simulator (`months-slips.html`):** Monthly salary, tax withholding, SSO (with configurable cap), and PVD calculation.
- **Income Tax Estimation (`tax-calculator-base.html`):** Thai PIT bracket calculation, monthly/yearly modes, and Tax Optimization Advisor (ThaiESG/SSF/RMF).
- **PVD & Severance Tax (`tax-calculator.html`):** Thai Labor Act severance tiers and Section 48(5) lump-sum tax calculation.
- **Remaining Money (`remaining-money.html`):** Monthly cash flow budget, emergency fund runway, and DCA investment bridging.
- **Debt Payoff Planner (`debt-calculator.html`):** Snowball vs Avalanche payoff comparison, rollover amortization schedule, and debt-free milestones.

## Runtime Overview
- Static client-side app served via `file://` or any static HTTP server.
- Tab routing runs via `index.html` hosting each tool in an `<iframe>`, synchronizing URL hash (`#dashboard`, `#rebalance`, etc.) and keyboard shortcuts (`Alt+1`..`Alt+7`).
- Tool state is decoupled per calculator in `localStorage`; cross-tool data bridges require explicit user actions.

## Essential Development Commands

### Install / Setup
```bash
# None required (zero npm dependencies)
```

### Run / Dev
```bash
# Option 1: Direct file open
open index.html         # macOS
xdg-open index.html     # Linux

# Option 2: Static HTTP server
python3 -m http.server 8000
```

### Test & Lint
```bash
# UNKNOWN (no test runner or linter configured in repository)
```

### Release / Version Bumping
```bash
node scripts/bump.mjs [patch|minor|major|<version>]
```

---

## Detailed Context References
- Architecture & System Design: [`context/architecture.md`](context/architecture.md)
- Coding Conventions & Idioms: [`context/conventions.md`](context/conventions.md)
- Architectural Decisions (ADRs): [`context/decisions.md`](context/decisions.md)
- Active Task State: [`memory/active.md`](memory/active.md)
- Lessons & Quirks: [`memory/lessons.md`](memory/lessons.md)
