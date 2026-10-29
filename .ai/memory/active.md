---
task_id: "phase-141-native-test-coverage"
status: "in_progress"
current_stage: "qa_verification"
iteration_count: 0
pipeline:
  - stage: "spec"
    status: "completed"
  - stage: "planning"
    status: "completed"
  - stage: "human_approval"
    status: "approved_by_user"
  - stage: "coding"
    status: "completed"
  - stage: "qa_verification"
    status: "pending"
  - stage: "code_review"
    status: "pending"
  - stage: "release"
    status: "pending"
---

### Feature Specification: Phase 141 — Native Zero-Dependency Code Coverage Reporting (Pillar 6.1 / v2.6.2)

#### 1. Goal & Requirements
- Add `"test:coverage": "node --test --experimental-test-coverage tests/**/*.test.mjs"` to `package.json` scripts.
- Ensure zero external npm dependencies are introduced, strictly adhering to ADR-001 and `tests/asset-budget.test.mjs`.
- Add an automated assertion in `tests/smoke.test.mjs` verifying that `package.json` declares the `test:coverage` command and runs via native Node.js test runner.

#### 2. Acceptance Criteria
- `npm run test:coverage` runs cleanly and prints line, branch, and function coverage percentages.
- `npm run test:budget` passes with 0 violations.
- `npm run lint` passes with 0 errors/warnings.
- All tests pass (806+ passing).
