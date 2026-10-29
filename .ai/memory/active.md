---
task_id: "phase-142-unified-github-actions-ci"
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

### Feature Specification: Phase 142 — Unified GitHub Actions CI Pipeline (Pillar 6.2 / v2.6.3)

#### 1. Goal & Requirements
- Update `.github/workflows/ci.yml` to include:
  1. `npm run test:budget` (Automated Asset Size & Zero-Dependency Budget Gate)
  2. `npm run test:coverage` (Native Node.js Test Coverage Reporting)
- Add contract assertion in `tests/smoke.test.mjs` verifying `.github/workflows/ci.yml` runs all 4 gates (`lint`, `test`, `test:budget`, `test:coverage`).
- Update `plan.md` status.

#### 2. Acceptance Criteria
- `.github/workflows/ci.yml` contains clear steps for all 4 gates across Node 20 and Node 22 matrix.
- `tests/smoke.test.mjs` passes contract assertions.
- `npm run lint`, `npm run test:budget`, `npm test` all pass cleanly.
