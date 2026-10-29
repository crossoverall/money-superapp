---
task_id: "phase-144-savings-goals-engine"
status: "in_progress"
current_stage: "coding"
iteration_count: 0
pipeline:
  - stage: "spec"
    status: "completed"
  - stage: "planning"
    status: "completed"
  - stage: "human_approval"
    status: "approved_by_user"
  - stage: "coding"
    status: "in_progress"
  - stage: "qa_verification"
    status: "pending"
  - stage: "code_review"
    status: "pending"
  - stage: "release"
    status: "pending"
---

### Feature Specification: Phase 144 — Goal-Based Savings Planner Engine (Pillar 2.1 / v2.6.5)

#### 1. Goal & Requirements
- Build `js/engines/savings-goals.js` (`MoneyApp.SavingsGoals`):
  - Goal schema validation, creation, cloning, and serialization (`moneySuperapp.savingsGoals.v1`).
  - Required monthly contribution calculation using annuity sinking-fund compounding formula and 0% interest fallback.
  - Multi-goal monthly surplus allocation with `'priority'`, `'proportional'`, and `'balanced'` strategies.
  - Month-by-month compound balance trajectory simulation (principal vs interest earned).
- Add full unit test suite `tests/savings-goals.test.mjs`.
- Register in `sw.js` (`ASSETS_TO_CACHE`), `index.html`, and `tests/smoke.test.mjs`.
- Maintain strict ADR-001 zero-dependency compliance and conservation of capital invariants.

#### 2. Acceptance Criteria
- Unit test suite covers sinking fund math, surplus allocation conservation, and trajectory simulation.
- `npm run lint` and `npm run test:budget` pass with 0 errors.
- Version bumped to `v2.6.5`.
