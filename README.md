# Money Superapp (v1.1.1)

A lightweight, offline-first personal finance toolkit for Thailand — five calculators in one unified PWA, no build step, no server, 100% client-side privacy.

## What's inside

| Tool | File | Description (TH) | Description (EN) |
|---|---|---|---|
| Rebalance Calculator | `rebalance.html` | คำนวณ Rebalance รายเดือน พร้อมกราฟสัดส่วนพอร์ต | DCA Monthly Top-up & Portfolio Rebalance |
| Payslip Simulator | `months-slips.html` | จำลองสลิปเงินเดือน (หัก ณ ที่จ่าย, ประกันสังคม, กองทุน) พร้อมพิมพ์ PDF | Payslip Simulator with Print/PDF export |
| Income Tax Estimation | `tax-calculator-base.html` | ประมาณการภาษีเงินได้บุคคลธรรมดา (เช็คเพดานลดหย่อนอัตโนมัติ) | Personal Income Tax Estimation with deduction caps |
| PVD Tax Calculator | `tax-calculator.html` | คำนวณภาษีเงินชดเชย & PVD (มาตรา 48(5)) พร้อมเครื่องคิดเงินชดเชยตามอายุงาน | Severance & PVD Tax Calculator with tenure brackets |
| Remaining Money | `remaining-money.html` | คำนวณเงินคงเหลือ (รายได้ - ค่าใช้จ่าย) พร้อมส่งต่อเข้างบลงทุน | Remaining Money (Cash Flow) with DCA bridge |

The shell (`index.html`) is a responsive tabbed interface that hosts each tool. Language (TH / EN) and theme (Light / Dark) are persisted in `localStorage` and synchronized across all tools.

## Getting started

No installation needed — open any file directly in a browser or install as a PWA.

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

## Features in v1.1

- **PWA & 100% Offline Capability**: Installable on iOS, Android, macOS, and Windows. Service Worker precaches all core assets for full offline operation.
- **Privacy First & Data Portability**:
  - 100% Client-side privacy — zero data sent to external servers.
  - Full Backup Export & Import as JSON to safely migrate or archive your data.
  - Master Reset button with confirmation dialog.
- **Intelligent Cross-Tool Synchronization**:
  - Live shared profile (Salary, Bonus, PVD %, SSO Cap) synced bi-directionally across tabs.
  - Bridge Net Severance/PVD Payouts directly into Remaining Money.
  - Bridge Net Monthly Salary & Deductions directly from Payslips into Remaining Money.
  - Bridge Remaining Cash Balance directly into the Rebalance DCA investment budget.
- **Financial & Tax Engine Precision**:
  - Statutory deduction caps enforced with inline warnings (ThaiESG ≤ 300k/30%, Combined Retirement ≤ 500k, Insurance ≤ 100k, Mortgage ≤ 100k).
  - Thai Labor Protection Act tenure-based severance calculator (up to 400 days statutory pay) with tenure bracket auto-suggest.
  - Section 48(5) tax engine without the standard 150k PIT bracket exemption.
- **Portfolio & DCA Analytics**:
  - Interactive SVG Donut Chart visualizing Core, Ballast, and Satellite allocation proportions.
  - Asset Allocation Drift Badges (`+X% 🔼`, `-X% 🔽`, `✓ OK`) showing variance from target weights.
  - Minimum Trade Cutoff setting to prevent fee drag on small rebalance transactions.
- **Print & PDF Support**: Clean payslip printable format (`@media print`) hiding input controls for direct PDF generation.
- **Bilingual & Dark Mode**: Full Thai and English localization with instant Light/Dark theme switching.
- **Zero Build Step**: Native Web standards (ES modules, Vanilla JS, CSS variables, SVG).

## Project structure

```
money-superapp/
├── index.html              # App shell / router & backup modal
├── rebalance.html          # Rebalance Calculator & Portfolio Donut
├── months-slips.html       # Payslip Simulator & Print Export
├── tax-calculator-base.html  # Income Tax Estimation with deduction caps
├── tax-calculator.html     # PVD & Severance Tax Calculator
├── remaining-money.html    # Remaining Money & Budget Bridge
├── manifest.json           # Progressive Web App manifest
├── sw.js                   # Offline Service Worker cache
├── icon.svg                # Vector PWA application icon
└── css/
    └── tailwind-lite.css   # Offline utility classes
```

## License

This project is provided as-is. See the repository for license details (none set yet — add one if you plan to share or distribute).

## Author

[crossoverall](https://github.com/crossoverall)
