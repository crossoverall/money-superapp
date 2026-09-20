# Money Superapp (v1.3.0)

A lightweight, offline-first personal finance toolkit for Thailand — seven tools in one unified PWA, no build step, no server, 100% client-side privacy.

## What's inside

| Tool | File | Description (TH) | Description (EN) |
|---|---|---|---|
| Financial Dashboard | `dashboard.html` | ภาพรวมความมั่งคั่งสุทธิ, สภาพคล่อง, ภาษี, หนี้สิน และกราฟแนวโน้ม | Unified Financial Dashboard & Historical Tracking |
| Rebalance Calculator | `rebalance.html` | คำนวณ Rebalance รายเดือน พร้อมกราฟสัดส่วนพอร์ต | DCA Monthly Top-up & Portfolio Rebalance |
| Payslip Simulator | `months-slips.html` | จำลองสลิปเงินเดือน (หัก ณ ที่จ่าย, ประกันสังคม, กองทุน) พร้อมพิมพ์ PDF | Payslip Simulator with Print/PDF export |
| Income Tax Estimation | `tax-calculator-base.html` | ประมาณการภาษีเงินได้บุคคลธรรมดา พร้อมที่ปรึกษาลดหย่อน ThaiESG/SSF | Personal Income Tax & Optimization Advisor |
| PVD Tax Calculator | `tax-calculator.html` | คำนวณภาษีเงินชดเชย & PVD (มาตรา 48(5)) พร้อมเครื่องคิดเงินชดเชยตามอายุงาน | Severance & PVD Tax Calculator with tenure brackets |
| Remaining Money | `remaining-money.html` | คำนวณเงินคงเหลือ (รายได้ - ค่าใช้จ่าย - เงินออม) พร้อมส่งต่อเข้างบลงทุน | Remaining Money (Cash Flow) with DCA bridge & Runway |
| Debt Payoff Calculator | `debt-calculator.html` | วางแผนปลดหนี้เร็วที่สุดด้วยวิธี Snowball & Avalanche พร้อมเปรียบเทียบดอกเบี้ย | Debt Payoff Calculator (Snowball vs Avalanche) |

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

Each tool also works standalone: open `dashboard.html`, `rebalance.html`, `months-slips.html`, `tax-calculator-base.html`, `tax-calculator.html`, `remaining-money.html`, or `debt-calculator.html` directly.

## Key Features

- **Unified Financial Dashboard & Historical Tracking (v1.3.0)**:
  - Birds-eye view of Total Net Worth (`Portfolio + Liquid Reserve - Debt`).
  - Monthly Cash Flow, Savings Rate %, Emergency Runway buffer, and Top Marginal Tax Bracket.
  - End-of-month financial snapshots with offline SVG trend charts (Net Worth, Savings Rate, Emergency Reserve).
- **Proactive Tax Optimization Advisor (v1.3.0)**:
  - Smart bracket analysis: calculates exact investment needed in ThaiESG / SSF / RMF to drop down a tax bracket.
  - One-click "Drop 1 Bracket" and "Maximize Deductions" simulation buttons with instant tax ROI calculations.
- **Debt Payoff Calculator (v1.3.0)**:
  - Compare **Snowball** (lowest balance first) and **Avalanche** (highest APR first) strategies.
  - Import monthly savings directly from the Remaining Money calculator to simulate extra payoff power.
  - Interactive debt-free date timeline, total interest saved, and month-by-month amortization schedule.
- **PWA & 100% Offline Capability**: Installable on iOS, Android, macOS, and Windows. Service Worker precaches all assets for full offline operation.
- **100% Client-Side Privacy & Data Portability**: All calculations and data stay in browser `localStorage`. Complete backup export/import as JSON and master reset.
- **Bi-directional Bridge Synchronization**:
  - Live shared profile across tabs (Salary, Bonus, PVD %, SSO Cap).
  - Bridge Net Severance/PVD Payouts directly into Remaining Money.
  - Bridge Net Monthly Salary from Payslips into Remaining Money.
  - Bridge Remaining Cash Balance directly into the Rebalance DCA investment budget.
  - Bridge Monthly Savings from Remaining Money into Debt Payoff extra payments.

## Project structure

```
money-superapp/
├── index.html              # App shell / router & backup modal
├── dashboard.html          # Unified Dashboard & Historical Tracking
├── rebalance.html          # Rebalance Calculator & Portfolio Donut
├── months-slips.html       # Payslip Simulator & Print Export
├── tax-calculator-base.html  # Income Tax Estimation & Optimization Advisor
├── tax-calculator.html     # PVD & Severance Tax Calculator
├── remaining-money.html    # Remaining Money, Savings & Runway
├── debt-calculator.html     # Debt Payoff Planner (Snowball & Avalanche)
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
