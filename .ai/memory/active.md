---
task_id: "none"
status: "idle"
current_stage: "idle"
complexity: "none"
iteration_count: 0
pipeline: []
---

### Feature / Task Specification: Phase 127 — Financial Math Invariant & Fuzz Testing Suite (v2.5.68)

#### 1. Goal & Scope Limits
- **Objective:**
  Implement an enterprise-grade, zero-dependency financial math invariant and fuzz testing suite (`tests/fuzz-math.test.mjs`) executing 10,000 randomized permutations across core financial engines to mathematically guarantee:
  1. Zero `NaN`, `Infinity`, `-0`, or uncontrolled float rounding anomalies across PIT tax brackets, debt payoff amortization, and portfolio rebalancing.
  2. Mathematical Monotonicity Invariants: Higher taxable income never produces lower tax liability; avalanche strategy never costs more interest than snowball under identical conditions; remaining debt strictly decreases monotonically to zero.
  3. Conservation of Capital Invariants: In rebalancing, total portfolio target equals sum of asset targets + cash delta; in debt amortization, Total Paid = Principal + Interest; tax deductions never exceed statutory statutoryCap ceilings regardless of input magnitude.
  4. Extreme Boundary & Stress Testing: Fuzzing zero, negative values, fractional satang/cents, and mega-wealth inputs (100M+ THB).
- **Target Files (<= 5 files, ~200 lines):**
  1. `tests/fuzz-math.test.mjs` (New comprehensive math fuzz & invariant test suite)
- **Explicit Out of Scope:**
  - Zero external NPM fuzzing libraries (ADR-001); use pure Node.js native math and `node:test` / `node:assert`.
  - Must execute fast (under 2.5s) to preserve test suite velocity.

#### 2. Architecture & Decision Alignment
- **Affected Components:** `tests/fuzz-math.test.mjs`, `js/engines/thai-pit.js`, `js/engines/debt-sim.js`, `js/engines/rebalance-engine.js`.
- **Relevant ADRs:**
  - ADR-001 (Zero runtime dependencies, 100% offline-first privacy)
  - ADR-002 (Modular domain engine architecture)

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Create `tests/fuzz-math.test.mjs`.
  - Implement pseudo-random seeded fuzz generator for deterministic repeatability.
  - Implement PIT Progressive Bracket Fuzzer (2,500 iterations).
  - Implement ThaiESG & Tax Deductions Invariant Fuzzer (2,500 iterations).
  - Implement Debt Amortization Invariant Fuzzer (2,500 iterations).
  - Implement Portfolio Rebalancing Invariant Fuzzer (2,500 iterations).
  - Total: 10,000 fuzz permutations.
- **Step 2:** Run `npm run lint` and `npm test` to verify zero failures and benchmark runtime speed.
- **Step 3:** QA & Debugger verification.
- **Step 4:** Code & Security Reviewer adversarial audit.
- **Step 5:** Release & Docs (bump v2.5.68, lessons.md, commit, and push).

#### 4. Acceptance Criteria
- [x] `tests/fuzz-math.test.mjs` executes 10,000 fuzz permutations across 4 financial domains.
- [x] Confirms zero `NaN`, `Infinity`, or negative zero output across all permutations.
- [x] Confirms capital conservation and mathematical monotonicity invariants.
- [x] Execution completes in under 3.5 seconds.
- [x] Zero Biome lint errors/warnings.
- [x] All tests pass in `npm test`.
- [x] Released, bumped to v2.5.68, and pushed to `origin/master`.
