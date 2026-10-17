---
task_id: "FEAT-ONBOARDING-01"
status: "completed"
current_stage: "release"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Feature / Task Specification: First-Run Onboarding Guide & Inter-Tool Workflow Tour (Phase 6 Item 2.3)

#### 1. Goal & Scope Limits
- **Objective:** Add an intuitive, lightweight first-run onboarding tour modal in `index.html` explaining the 7 tools, privacy model, and recommended financial flow (`Payslip` -> `Remaining` -> `Rebalance` -> `Dashboard`).
- **Target Files (<= 5 files):**
  1. `index.html` (Onboarding modal dialog, topbar `❓` guide button, settings modal guide link, first-run detection)
  2. `tests/shared.test.mjs` (Add test for onboarding localStorage state helper)
  3. `.ai/memory/active.md`
- **Explicit Out of Scope:**
  - Heavy multi-step walkthrough libraries (remains 100% vanilla JS and CSS).
  - Disruptive popups on recurring sessions.

#### 2. Architecture & Decision Alignment
- **ADR-001 (Zero-Build Static PWA / Privacy):** 100% client-side, zero tracking, pure HTML/CSS/JS.
- **ADR-002 (Iframe Isolation):** Lives in the parent `index.html` shell.
- **Theme & Design Consistency:** Matches `#131E19` dark topbar aesthetic, fully responsive, keyboard accessible.

#### 3. Step-by-Step Implementation Summary
1. **Top Bar & Navigation Integration:**
   - Added `❓` help button (`#btn-help-modal`) next to settings (`⚙️`) in topbar.
   - Added "📖 คู่มือเริ่มต้นใช้งาน (Quick Tour)" shortcut inside `#settingsModal`.
2. **Onboarding Tour Modal (`#onboardingModal`):**
   - 5-step recommended financial workflow with direct "เปิดใช้ (Open)" action buttons:
     1. 💵 **สลิปเงินเดือน (Payslip)**: Net pay, tax/SSO/PVD deductions.
     2. 💰 **เงินคงเหลือ (Remaining Money)**: Living expenses, emergency reserve, investable surplus.
     3. ⚖️ **ปรับพอร์ต (Rebalance)**: Multi-asset allocation & zero-drift DCA projections.
     4. 📉 **วางแผนปลดหนี้ (Debt Payoff)**: Snowball & Avalanche payoff timeline simulations.
     5. 📊 **แดชบอร์ด (Dashboard)**: Monthly net worth snapshots & milestones.
   - Highlights 100% offline privacy, Google Drive sync, and keyboard shortcuts (`Alt+1..7`).
3. **First-Run Trigger & Persistence:**
   - Detects `moneySuperapp.hasSeenOnboarding` in `localStorage`.
   - Opens automatically on first visit after 350ms.
   - Marks flag when closed or on "🚀 เริ่มต้นใช้งานเลย (Get Started)".
4. **Bilingual Localization:**
   - Complete Thai and English copy wired into `translations` and updated live via `applyLang()`.
5. **Verification & Tests:**
   - Added unit test `Onboarding State Management` in `tests/shared.test.mjs`.
   - 31 unit tests pass in 72ms.
   - Biome linter passes with 0 errors.
   - Bumped to `v1.8.9` via `node scripts/bump.mjs patch`.

#### 4. Acceptance Criteria
- [x] First-time users are greeted with the onboarding tour modal automatically.
- [x] Users can reopen the guide anytime using the `❓` button or via Settings (`⚙️`).
- [x] Step buttons directly navigate to the respective tool iframe.
- [x] Both Thai and English languages are fully supported.
- [x] Passes all automated tests and Biome linting checks.
