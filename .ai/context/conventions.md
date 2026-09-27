# Coding and Project Conventions

> Verified conventions and idioms from the existing Money Superapp codebase.
> AI agents must follow these patterns to maintain consistency.

---

## 1. Project & Directory Structure

```
money-superapp/
├── index.html                # App shell, navigation, global settings & backup modal
├── dashboard.html            # Tool 1: Aggregated dashboard & historical SVG chart
├── rebalance.html            # Tool 2: Monthly DCA & portfolio rebalance calculator
├── months-slips.html         # Tool 3: Payslip simulator & PDF/print exporter
├── tax-calculator-base.html  # Tool 4: Thai personal income tax & deduction advisor
├── tax-calculator.html       # Tool 5: Severance & PVD Section 48(5) tax calculator
├── remaining-money.html      # Tool 6: Cash flow, savings, emergency runway calculator
├── debt-calculator.html       # Tool 7: Debt payoff simulator (Snowball vs Avalanche)
├── css/
│   └── tailwind-lite.css     # Lightweight offline utility CSS stylesheet
├── scripts/
│   └── bump.mjs              # Node.js automated semantic version bumping script
├── manifest.json             # Progressive Web App manifest
├── sw.js                     # Offline Service Worker cache implementation
├── icon.svg                  # Application vector icon
├── README.md                 # User documentation & feature reference
└── .ai/                      # AI context, agents, memory, and ADRs
```

- Each tool is self-contained in a single HTML file containing its specific UI layout, inline styles, and embedded JavaScript.
- All tools share [`css/tailwind-lite.css`](file:///home/l2okii/Documents/money-superapp/css/tailwind-lite.css) for standard utility layout classes.

---

## 2. Naming Conventions

- **Files:** Kebab-case for HTML pages (`debt-calculator.html`, `tax-calculator-base.html`), lower-case for scripts and assets (`bump.mjs`, `icon.svg`).
- **DOM Element IDs:** CamelCase or kebab-case prefixed with purpose:
  - Text labels: `lbl-[purpose]` (e.g. `lbl-subtitle`, `lbl-extra-pay`)
  - Input fields: `txt-[purpose]` or simple name (e.g. `txtExtraPayment`, `salary`, `pvd`)
  - Buttons: `btn-[purpose]` (e.g. `btn-reset-debts`, `btn-export-backup`)
  - KPI displays: `kpi-[metric]` (e.g. `kpi-total-debt`, `kpi-debtfree-date`)
- **Variables & Constants:**
  - Constants: `UPPER_SNAKE_CASE` (e.g. `STORAGE_KEY`, `LANG`, `CACHE_NAME`)
  - State & variables: `camelCase` (e.g. `portfolioVal`, `emergencyReserve`, `debtList`)
- **Functions:** `camelCase` starting with action verbs (e.g. `formatMoney`, `parseNum`, `renderTable`, `computePayoff`, `saveState`, `loadState`).

---

## 3. Architecture & Code Patterns

### 3.1 Self-Contained Tool Initialization
Every tool file reads language and theme immediately upon script execution to prevent flash of unstyled content or wrong locale:

```javascript
// Verified in dashboard.html, debt-calculator.html, rebalance.html
const LANG = (function(){ try { return localStorage.getItem('moneySuperapp.lang') || 'th'; } catch(e){ return 'th'; } })();
document.documentElement.lang = LANG;
document.documentElement.dataset.theme = (function(){ try { return localStorage.getItem('moneySuperapp.theme') || 'light'; } catch(e){ return 'light'; } })();
const unit = LANG === 'en' ? 'THB' : 'บาท';
```

### 3.2 Dual-Language Dictionary Pattern
Each tool contains an internal dictionary for Thai (`th`) and English (`en`):

```javascript
// Verified in debt-calculator.html lines 263-358
const translations = {
    th: {
        title: 'วางแผนปลดหนี้ (Debt Payoff)',
        subtitle: 'เปรียบเทียบวิธี Snowball และ Avalanche เพื่อปลดหนี้เร็วที่สุด',
        // ...
    },
    en: {
        title: 'Debt Payoff Calculator',
        subtitle: 'Compare Snowball and Avalanche to become debt-free fastest',
        // ...
    }
};

if (LANG === 'en') {
    const t = translations.en;
    // Map textContent to element IDs
}
```

### 3.3 Numeric Formatting and Sanitization
Because numbers are displayed with comma separators in user inputs and tables, always use the canonical `parseNum` and `formatMoney` helpers:

```javascript
// Verified in debt-calculator.html lines 421-430
function formatMoney(amount) {
    return amount.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function parseNum(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/,/g, '').trim();
    return parseFloat(clean) || 0;
}
```

### 3.4 HTML Sanitization
Always escape dynamic strings (e.g., custom user account names) before interpolating into template literals:

```javascript
// Verified in debt-calculator.html lines 508-512
function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
}
```

### 3.5 State Isolation & Decoupled Bridging
Never mutate another calculator's primary state directly in the background. Follow the decoupled bridge pattern:
1. Exporting tool writes an ephemeral bridge key (e.g. `moneySuperapp.pendingBudget`).
2. Receiving tool checks for the key on initialization, processes the payload, and deletes the key (`localStorage.removeItem(...)`).
3. For read-only tools like `debt-calculator.html`, provide an explicit button (e.g. "Import Savings") that pulls data only when clicked by the user.

### 3.6 Cross-Frame Keyboard Shortcut Forwarding
All child tools forward `Alt+1`..`Alt+7` to the parent window so global tab switching works regardless of iframe focus:

```javascript
// Verified in debt-calculator.html lines 827-833
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key >= '1' && e.key <= '7') {
        try {
            window.parent.postMessage({ action: 'shortcutKey', key: e.key }, '*');
        } catch(err){}
    }
});
```

---

## 4. Error Handling & Edge Cases

- **LocalStorage Quota / Private Browsing:** Wrap all `localStorage.setItem` and `getItem` calls in `try { ... } catch(e) {}`. Silently fail or ignore in private mode if storage is restricted.
- **Division by Zero:** Always check if divisors (e.g. total monthly expense, monthly income) are $> 0$ before computing percentages or runway months (`monthlyIncome > 0 ? (totalSaved / monthlyIncome) * 100 : 0`).
- **Safety Loop Limit:** In financial simulation loops (e.g., debt amortization), always set an upper bound to prevent infinite loops:
  ```javascript
  const MAX_MONTHS = 360; // 30-year simulation cutoff
  while (debts.some(d => d.balance > 0.01) && months < MAX_MONTHS) { ... }
  ```

---

## 5. CSS Theming & Design Tokens

Theme colors are declared via CSS custom properties on `:root` and `:root[data-theme="dark"]`:

```css
:root {
  --bg: #F5F7F6;
  --panel: #FFFFFF;
  --panel-2: #EEF2F0;
  --line: #DCE4E0;
  --ink: #14201B;
  --ink-dim: #57685F;
  --ink-faint: #8B9A92;
  --warn: #A9762F;
  --warn-dim: rgba(169,118,47,0.12);
  --danger: #C97D5A;
  --ok: #2F8B76;
  --ok-dim: rgba(47,139,118,0.10);
  --blue: #2563eb;
  --purple: #7e22ce;
}

:root[data-theme="dark"] {
  --bg: #0E1512;
  --panel: #131E19;
  --panel-2: #16221C;
  --line: #24352C;
  --ink: #EAF2EE;
  --ink-dim: #8FA69C;
  --ink-faint: #5B7168;
  --warn: #C9A15A;
  --warn-dim: rgba(201,161,90,0.14);
  --danger: #C97D5A;
  --ok: #4FA894;
  --ok-dim: rgba(79,168,148,0.14);
  --blue: #60a5fa;
  --purple: #a855f7;
}
```

- Body font: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Prompt", Helvetica, Arial, sans-serif`
- Max mobile/desktop container width for tools: `520px` (centered via `margin-inline: auto`)
- Border radius: `16px` for primary panels, `12px` for inner cards/rows, `8px` for inputs/buttons

---

## 6. Git & Release Workflow

1. **Commit Messages:** Follow Conventional Commits format:
   - `feat(tool): description`
   - `fix(sync): description`
   - `style(tax): description`
   - `chore(version): bump version to vX.Y.Z`
2. **Version Bumping Rule:**
   - Any functional fix, feature, or UI modification that impacts cached files must trigger a version bump using:
     ```bash
     node scripts/bump.mjs patch
     ```
   - This automatically updates `index.html` meta tags and badges, `sw.js` cache name, the 7 tool files, and `README.md`.

---

## 7. Token Optimization & Tooling Conventions (RTK First)

To minimize context window saturation and cut command output tokens by 60–90%, always use **RTK (Rust Token Killer)** proxies first:

- **File Reading:** `rtk read <file>` (filters repetitive tokens)
- **Code Search:** `rtk grep <pattern>` (grouped compact search results)
- **File Discovery:** `rtk find <pattern>` (directory-grouped search)
- **Directory Listing:** `rtk ls <path>` (compact tree view)
- **Version Control:** `rtk git <subcmd>` (ultra-compact git status, diff, log, commit)
- **Savings Analytics:** `rtk gain` and `rtk gain --history`
