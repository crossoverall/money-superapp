---
task_id: "phase-132-mobile-settings-modal-overflow-fix"
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

### Feature / Bugfix Specification: Phase 132 — Mobile Settings Modal Viewport Overflow Fix

#### 1. Problem Statement & Root Cause Diagnosis
- **Reported Bug:** On mobile viewports (e.g. 375x667, 320x568), opening the Settings & Data Management modal (`#settingsModal`) results in the modal being pushed out of the screen.
- **Root Cause Analysis (Verified via Headless Chrome Measurement):**
  - `#settingsModal` contains 9 comprehensive sections (Privacy banner, Google Drive sync, Export JSON/Vault, Import, Offline QR P2P, App Lock & Biometrics, Quick Tour, Storage Health, Cache Quota, Master Reset), resulting in an intrinsic content height of **1,595px** (and **1,854px** at 320px width).
  - `#settingsModal` has `position: fixed; display: flex; align-items: center; justify-content: center; padding: 16px;`.
  - The inner dialog card `div` lacked `max-height` (it was `none`) and lacked `overflow-y` (it was `visible`).
  - Because Flexbox centers an overflowing item within the viewport, on a 667px high screen:
    - `cardTop: -463.8px` (top 464px, including the header and close button, pushed above the screen).
    - `cardBottom: 1130.8px` (bottom 464px pushed below the screen).
    - The modal has no scrollbar and cannot be scrolled, completely trapping the user.
    - Backdrop click-to-close handler was also missing (`onclick="if(event.target===this)closeSettingsModal()"`).

#### 2. Scope of Changes
- **Target Files (<= 2 files, < 50 lines):**
  1. `index.html`:
     - Add `max-height: calc(100vh - 32px); max-height: calc(100dvh - 32px); overflow-y: auto; -webkit-overflow-scrolling: touch;` to `#settingsModal > div`.
     - Make the modal header (`#lbl-modal-title` & close button row) `position: sticky; top: -22px; background: #131E19; z-index: 10; padding-top: 4px;` so the close button and title remain anchored and accessible while scrolling through settings.
     - Add backdrop click-to-close handler on `#settingsModal`: `onclick="if(event.target===this)closeSettingsModal()"`.
     - Apply same preventive `max-height` and `overflow-y: auto` safeguards to `#qrExportModal` and `#qrImportModal`.
  2. `tests/visual-regression.test.mjs`:
     - Add automated layout invariant test asserting `#settingsModal` on mobile viewports (375x667 and 320x568):
       - `rect.top >= 0`
       - `rect.bottom <= window.innerHeight`
       - `card.clientHeight <= window.innerHeight`
       - `computedOverflowY === 'auto'`
       - Zero horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).

#### 3. Step-by-Step Implementation Plan
- **Step 1:** Edit `index.html` to update modal container styles and backdrop click handlers.
- **Step 2:** Add automated mobile modal test assertions to `tests/visual-regression.test.mjs`.
- **Step 3:** Run `npm test` and `npm run lint` to verify zero regressions.
- **Step 4:** Perform independent code and security review.
- **Step 5:** Record lessons in `.ai/memory/lessons.md` and bump version if needed.
