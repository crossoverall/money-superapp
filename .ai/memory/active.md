---
task_id: "phase-134-asset-size-zero-dep-budget-gate"
status: "completed"
current_stage: "idle"
iteration_count: 1
pipeline:
  - stage: "spec"
    status: "completed"
  - stage: "planning"
    status: "completed"
  - stage: "human_approval"
    status: "completed"
  - stage: "coding"
    status: "completed"
  - stage: "qa_verification"
    status: "completed"
  - stage: "code_review"
    status: "completed"
  - stage: "release"
    status: "completed"
---

### Feature Specification: Phase 134 — Automated Asset Size & Zero-Dependency Budget Gate (Pillar 6.2)

#### 1. Goal & Requirements
- **Goal:** Provide automated continuous verification that:
  1. `package.json` contains strictly 0 runtime dependencies (`dependencies` is empty or undefined), enforcing ADR-001 permanent client-side autonomy.
  2. The standalone bundle for every HTML tool (HTML + inline scripts + linked JS/CSS entry points) stays within strict performance budgets (<250KB per entry point uncompressed, and total critical shell assets stay lean).
  3. No external script or stylesheet CDNs (`https://`, `http://`, `//`) are referenced anywhere across all 8 HTML tools, guaranteeing 100% offline-first PWA compliance.
  4. Service worker `sw.js` cache manifest stays 100% synchronized with actual disk assets so zero 404s or stale references can ever be shipped.
  5. Add `npm run test:budget` script or integrate directly into the automated CI test suite.

#### 2. Architecture & Decision Alignment
- **Affected Files:**
  - `tests/asset-budget.test.mjs`: New dedicated test suite testing runtime dependency absence, per-tool payload budgets, zero external CDN link invariants, and SW cache manifest integrity.
  - `package.json`: Add `"test:budget": "node --test tests/asset-budget.test.mjs"`.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Author `tests/asset-budget.test.mjs` verifying ADR-001 zero dependencies, per-page payload budgets, offline self-containment, and SW sync.
- **Step 2:** Update `package.json` with `test:budget` script.
- **Step 3:** Run `npm run lint` and `npm test` across all 756+ tests to verify green baseline.
- **Step 4:** Execute Code & Security Review.
- **Step 5:** Record lessons in `.ai/memory/lessons.md`, bump patch version, and git push.
