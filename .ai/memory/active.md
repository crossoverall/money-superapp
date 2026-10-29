---
task_id: "phase-143-onboarding-wizard-archetypes"
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
    status: "completed"
  - stage: "qa_verification"
    status: "pending"
  - stage: "code_review"
    status: "pending"
  - stage: "release"
    status: "pending"
---

### Feature Specification: Phase 143 — First-Time Onboarding Wizard & Quick-Start Templates (Pillar 3.1 / v2.6.4)

#### 1. Goal & Requirements
- Add an interactive Financial Archetype Quick-Start Selector to `#onboardingModal`:
  1. `Salaried Employee` (Focus: Payslip & Tax)
  2. `Freelancer / Creator` (Focus: Cash Flow & ภ.ง.ด. 90 Tax)
  3. `Investor & Debt-Free` (Focus: Portfolio Rebalance & Debt Elimination)
- Selection dynamically focuses recommended starting tools, updates primary action button, and announces changes to assistive technology via `MoneyApp.announce`.
- Store `moneySuperapp.onboardingComplete = 'true'` upon completion.
- Maintain 100% bilingual symmetry between `translations.th` and `translations.en`.
- Maintain strict mobile layout constraints (max-height, overflow-y: auto, zero horizontal blowout on 320px–375px viewports).

#### 2. Acceptance Criteria
- User can toggle between the 3 archetype templates interactively.
- Primary CTA navigates directly to the chosen archetype's recommended entry tool.
- Bilingual parity verified across all new keys in Thai and English.
- All 808+ tests pass, 0 Biome warnings, budget gate passes.
