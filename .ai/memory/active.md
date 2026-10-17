---
task_id: "FEAT-TAX-REFUND-01"
status: "in_progress"
current_stage: "approval_gate"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Completed Feature: Financial Independence & Early Retirement (FIRE) Safe Withdrawal & Target Net Worth Visualizer (Phase 31 / v2.1.4)
- **Status:** Completed & Verified (117 automated tests passing, 0 linter errors).
- **Summary:**
  1. Built `calculateFIREMetrics()` engine computing target FIRE wealth thresholds: $\text{FIRE Number} = \text{Annual Expenses} / \text{SWR}$, auto-linking annual living expenses from `remainingMoneyCalculator.state.v1` ($12 \times \text{monthlyExpense}$) with optional manual override in `#goalsModal`.
  2. Defined clear milestone spectrum tiers (`accumulating`, `halfway_fire`, `lean_fire`, `standard_fire`, `fat_fire`) with visual status badges and color gradients.
  3. Integrated interactive SWR selection pills (3.0%, 3.5%, 4.0%) with live recalculation, dual-gradient progress bar, Safe Annual Passive Income readout ($NW \times \text{SWR}$), and projected years-to-freedom timeline (ETA) calculated via logarithmic compound growth.
  4. Added 5 comprehensive automated unit tests in `tests/financial-math.test.mjs` verifying milestone brackets, SWR sensitivity, compound horizon solver, and zero-expense edge cases.

---

### Proposed Feature Specification: Annual Tax Withholding (50 Tawi) vs PIT Liability Refund / Additional Payable Estimator (Phase 32 / Roadmap Item 3.2)

#### 1. Goal & Scope Limits
- **Objective:** Add an interactive **Annual Tax Withholding (50 Tawi) vs PIT Liability Refund / Additional Payable Estimator & Breakdown Visualizer** to [`tax-calculator-base.html`](file:///home/l2okii/Document/money-superapp/tax-calculator-base.html).
- **Key Capabilities & Benefits:**
  1. **Tax Refund vs Additional Tax Payable Calculation:**
     - Compares calculated annual Personal Income Tax (PIT) liability against total tax withheld at source (ภาษีหัก ณ ที่จ่าย / ใบ 50 ทวิ):
       $$\text{Net Tax Balance} = \text{Withheld Tax to Date (50 Tawi)} - \text{Calculated PIT}$$
     - If $\text{Net Balance} > 0$: **Tax Refund (ขอคืนภาษี)** 🎉.
     - If $\text{Net Balance} < 0$: **Additional Tax Due (ต้องชำระภาษีเพิ่ม)** ⚠️.
     - If $\text{Net Balance} = 0$: **Exact Balance (พอดี ไม่ต้องจ่ายเพิ่ม/ขอคืน)**.
  2. **Inter-Tool Bridge with `months-slips.html`:**
     - One-click import button: "ดึงภาษีหัก ณ ที่จ่ายจากสลิปเงินเดือน (Import from Payslips)" reading cumulative 12-month withholding tax calculated by `months-slips.html`.
     - Manual input field for freelance/custom 50 Tawi withholding tax certificates (มาตรา 40(1), 40(2), 40(8)).
  3. **Visual Refund Gauge & Document Checklist:**
     - High-visibility bilingual verdict card (Refund Amount, Refund Timeline estimate, PromptPay national ID readiness tip).
     - Print report parity (integrates seamlessly into the print-ready P.N.D.90/91 summary).
  4. **Zero External Dependencies (ADR-001):**
     - Pure client-side arithmetic, 100% offline privacy, zero third-party APIs.
- **Target Files (<= 5 files, ~160-200 lines total):**
  1. `tax-calculator-base.html` (Withholding input, refund card, payslip bridge)
  2. `tests/financial-math.test.mjs` (Unit tests for net tax balance, refund/payable states, and payslip integration)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Direct integration with Thai Revenue Department (e-Filing API) (preserves 100% offline client-side privacy).

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** All tax math runs locally; zero network transmission.
- **Conventions:** Follows existing patterns in `tax-calculator-base.html` (`formatMoney()`, `parseNum()`, bilingual `t()`).

#### 3. Step-by-Step Implementation Plan
1. **Mathematical Verification (`tests/financial-math.test.mjs`):**
   - Implement and test `calculateTaxRefundOrPayable()`: net tax delta, refund/payable classifications, and zero-liability edge cases.
2. **Withholding Input & Visual Refund Engine (`tax-calculator-base.html`):**
   - Add 50 Tawi Withholding input with payslip auto-import button.
   - Render dynamic Refund/Payable verdict banner and breakdown.
3. **Verification & Quality Gate:**
   - Run `npm test` (verify 120+ passing tests).
   - Run `npm run lint` (0 errors).
4. **Release & Bump:**
   - Log lessons in `.ai/memory/lessons.md`.
   - Bump version to `v2.1.5` via `node scripts/bump.mjs patch`.
