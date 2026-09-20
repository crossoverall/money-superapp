# Money Superapp

A lightweight, client-side personal finance toolkit — four calculators in one page, no build step, no server, no dependencies beyond a CDN.

## What's inside

| Tool | File | Description (TH) | Description (EN) |
|---|---|---|---|
| Rebalance Calculator | `rebalance.html` | คำนวณ Rebalance | Rebalance Calculator |
| Payslip Simulator | `months-slips.html` | จำลองสลิปเงินเดือน (รวมโบนัส) | Months Slips Calculator |
| Income Tax Estimation | `tax-calculator-base.html` | ประมาณการภาษีเงินได้ | Income Tax Estimation |
| PVD Tax Calculator | `tax-calculator.html` | คำนวณภาษี PVD | PVD Tax Calculator |
| Remaining Money | `remaining-money.html` | คำนวณเงินคงเหลือ (รายได้ - ค่าใช้จ่าย) | Remaining Money Calculator |

The shell (`index.html`) is a tabbed top bar that loads each tool into an iframe. Language (TH / EN) and theme (Light / Dark) are persisted in `localStorage` and applied across all five tools.

## Getting started

No installation needed — open any file directly in a browser.

### Run locally

```bash
# Option 1 — open the shell (recommended)
open index.html         # macOS
xdg-open index.html     # Linux
start index.html        # Windows

# Option 2 — serve with a static server (if you prefer http:// over file://)
python3 -m http.server 8000
# then open http://localhost:8000
```

Each tool also works standalone: open `rebalance.html`, `months-slips.html`, `tax-calculator-base.html`, `tax-calculator.html`, or `remaining-money.html` directly.

## Features

- **Five calculators** in one navigation bar — switch between them without leaving the page.
- **Bilingual UI** — Thai and English, toggle in the top-right of the top bar.
- **Light / Dark theme** — toggle in the top-right; preference saved to `localStorage`.
- **Zero build step** — all files are self-contained HTML; edit and refresh.
- **Responsive** — tabs scroll horizontally on narrow screens; iframe fills the remaining height.
- **Standalone-capable** — each tool reads lang/theme from `localStorage` on its own, so it can be opened outside the shell.

## Tech

- Plain HTML + CSS + vanilla JavaScript — no framework, no bundler.
- Tailwind CSS (CDN) used in `months-slips.html`, `tax-calculator-base.html`.
- Google Fonts (Prompt) loaded in `tax-calculator-base.html`.
- Theme implemented via `data-theme` attribute on `<html>` / `:root` CSS variables and Tailwind `!important` overrides.

## Project structure

```
money-superapp/
├── index.html              # App shell / router (top bar + iframe)
├── rebalance.html          # Rebalance Calculator
├── months-slips.html       # Payslip Simulator (Thai)
├── tax-calculator-base.html  # Income Tax Estimation
├── tax-calculator.html     # PVD Tax Calculator
└── remaining-money.html    # Remaining Money Calculator
```

## License

This project is provided as-is. See the repository for license details (none set yet — add one if you plan to share or distribute).

## Author

[crossoverall](https://github.com/crossoverall)
