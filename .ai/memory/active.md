---
task_id: "phase-145-savings-goals-ui-and-bridge"
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

### Feature Specification: Phase 145 — Goal-Based Savings Planner UI & Cross-Tool Surplus Bridge (Pillar 2.1 / v2.6.6)

#### 1. Goal & Requirements
- **Dashboard UI (`dashboard.html` & `js/dashboard.js`):**
  - Add `#savingsGoalsSection` in `panelGoals` rendering active sinking-fund goals from `MoneyApp.SavingsGoals`.
  - Display progress bars, required monthly contributions, and allocation strategy switcher (`priority`, `proportional`, `balanced`).
  - Add goal editor modal `#goalEditorModal` for adding/editing/deleting custom goals.
  - Ingest bridged monthly surplus via `Bridge.receive('savings_goals_budget')` or `moneySuperapp.pendingGoalsBudget`.
- **Remaining Money Bridge (`remaining-money.html` & `js/remaining-money.js`):**
  - Add `#btnBridgeSurplusGoals` in the surplus simulator section.
  - Sends available cash flow surplus to Dashboard savings goals and navigates to Dashboard.
- **Bilingual & Accessibility Parity:**
  - 100% dictionary key symmetry between Thai and English.
  - Full WCAG 2.1 AA keyboard support and screen reader announcements.
- **Automated Tests:**
  - Test bridge execution in `tests/integration-bridges.test.mjs`.
  - Smoke tests in `tests/smoke.test.mjs`.

#### 2. Acceptance Criteria
- User can add, view, and allocate monthly surplus across savings goals.
- Clicking "Send Surplus to Goals" in Remaining Money successfully bridges surplus and displays allocation in Dashboard.
- All tests pass (842+ passing). Version bumped to `v2.6.6`.
