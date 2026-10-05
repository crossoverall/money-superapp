---
task_id: "fix-rebalance-frozen-zero-weight-assets"
complexity: "Level 2 (Standard Bug — core calculation algorithm)"
status: "in_progress"
current_stage: "Gate 7: Release"
iteration_count: 0
assigned_files:
  - rebalance.html
created_at: "2026-10-05T13:54:34+07:00"
---

## Task Summary

**Request:** When a fixed (frozen) asset in a bucket has a 0% target weight (e.g. cash already in port, no further top-up desired), the asset's existing value must still be included in the bucket's total portfolio value for all percentage calculations. Other assets in the same bucket (e.g. Gold 50%, SGOV 50%) should receive top-up allocations computed relative to the full bucket total, not an artificially reduced sub-total that excludes the frozen asset.

## Affected Component

- `rebalance.html` — `allocate()` function (water-filling algorithm, ~lines 627–654)
- `rebalance.html` — `compute()` function (drift badge & cappedCount display, ~lines 1040–1057)

## Root Cause (verified by code inspection)

In `allocate()`, the water-fill loop:
1. All assets start in `active`.
2. Zero-weight assets have `w[i] = 0`, so `target[i] = 0`.
3. Since `target[i] < assets[i].value` (frozen asset has value but 0% target), it is ejected to `over`, removed from `active`, and `x[i] = 0` — correct.
4. **BUG:** On ejection, the asset's value disappears from `sumVActive` in subsequent iterations. `T = sumVActive + remaining` no longer includes the frozen asset's value. Gold and SGOV now compute targets as if the bucket has less total value — they over-allocate relative to the full bucket.

Secondary display issues:
- Frozen assets show a false `🔼 over target` drift badge.
- `cappedCount` fires for frozen assets, polluting the "X assets over target" note.

## Acceptance Criteria

- [ ] AC-1: When a bucket has 3 assets (Gold 50%, SGOV 50%, Cash 0% frozen with value $2000), and a budget of $1000 is added, the allocation to Gold/SGOV is computed against the full bucket value ($6000 current + $1000 budget = $7000 total after).
- [ ] AC-2: The "after top-up %" shown for each asset is relative to the full bucket total (including frozen assets).
- [ ] AC-3: Frozen (zero-weight) assets show `🔒 frozen` badge, not a drift indicator.
- [ ] AC-4: `cappedCount` (the "X assets over target" capped note) excludes zero-weight frozen assets.
- [ ] AC-5: Regression — normal assets (no zero-weight) still allocate correctly (existing water-fill behavior preserved).
- [ ] AC-6: Edge case — budget = 0 with frozen asset produces no errors and correct percentages.
- [ ] AC-7: Edge case — all assets in bucket are frozen (weight=0) produces no allocation and no crash.

## Plan (atomic steps)

### Step 1 — Fix `allocate()` function
- Introduce `lockedValue` accumulator (starts at 0).
- Pre-eject zero-weight assets before the loop: add their value to `lockedValue`, exclude from `active`.
- In each loop iteration, compute `T = sumVActive + lockedValue + remaining`.
- Active asset targets: `target[i] = (w[i] / sumWActive) * (T - lockedValue)` (only active portion is distributable).
- When an active asset is ejected mid-loop (it's over target), add its value to `lockedValue` before removing from `active`.

### Step 2 — Fix drift badge in `compute()`
- Add guard: if `a.weight === 0`, set `driftClass = 'drift-ok'` and `driftText = '🔒 frozen'` (EN) / `'🔒 ตรึง'` (TH).
- Else: existing drift logic unchanged.

### Step 3 — Fix `cappedCount` in `compute()`
- Change condition from `add <= 0.5 && a.value > 0` to `add <= 0.5 && a.value > 0 && a.weight > 0`.

## Files to Modify

1. `rebalance.html` — Steps 1, 2, 3 (single file, ~40 lines changed)

## Stage Hand-offs

- [x] Gate 1: Intake & state init
- [ ] Gate 2: Plan (this doc)
- [ ] Gate 3: Human approval ← WAITING
- [ ] Gate 4: Coder
- [ ] Gate 5: QA & Debugger
- [ ] Gate 6: Security Reviewer
- [ ] Gate 7: Release
