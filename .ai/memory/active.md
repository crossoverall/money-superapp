---
task_id: "feat-thai-fund-nav-and-set-stocks"
complexity: "level_2"
current_stage: "plan"
assigned_agent: "release"
iteration_count: 0
max_iterations: 2
status: "completed"
target_files:
  - "rebalance.html"
  - "sw.js"
---

# Active Task State Bus

> This file is the centralized state machine and working scratchpad for the Multi-Agent SDLC pipeline.

## 1. Task Objective & Context
- **Description:** Clarify and enhance price loading for Thai Assets in `rebalance.html`:
  1. Address user inquiry regarding why Thai mutual fund (`K-WORLDX`) and Thai stock (`GULF`) prices do not load automatically out of the box without keys.
  2. Thai Mutual Funds (`K-WORLDX`, `SCBCE`) lack public open-CORS browser APIs (protected by SEC/Cloudflare firewalls), so they are designed for direct **NAV entry in THB (฿)**.
  3. Thai SET Stocks (`GULF`, `PTT`, etc.) can be fetched automatically if the user adds a Twelve Data API key.
- **Improvements to Implement:**
  1. **UI Badges & Guidance:** On asset rows, clearly differentiate between:
     - Live fetched assets (`✓ สด $...` / `✓ สด ... ฿`).
     - Thai Mutual Funds requiring NAV (`[ระบุ NAV]` / `[Enter NAV]`), so users immediately understand why they don't auto-fetch.
     - Stocks requiring API key (`[ใส่ API Key ในตั้งค่า]` / `[Requires API Key]`).
  2. **Enhanced SET Stock Queries:** If Twelve Data API key is present, automatically support SET tickers like `GULF`, `GULF.BK`, `GULF:SET` with currency auto-set to `THB`.
  3. **Realistic Default NAVs:** Provide sensible default NAVs (`K-WORLDX`: 12.50 ฿, `SCBCE`: 7.85 ฿) so default portfolios display calculated values instead of 0.00.
  4. **Transparent Modal Guidance:** Update the API Settings modal with clear explanations of Thai mutual funds (manual NAV) vs Thai SET stocks (Twelve Data / manual).

## 2. Working Plan & Acceptance Criteria

### Phase 1: Planning & Architecture
- [x] Analyze CORS constraints of Thai mutual fund endpoints and Twelve Data SET support.
- [x] Design UI status badge enhancements and SET ticker querying.

### Phase 2: Implementation (`coder`)
- [x] Add SET stock detection and Twelve Data symbol normalization (`sym + ':SET'` / `sym + '.BK'`).
- [x] Add informative status badges (`(สด ฿/$)`, `(ระบุ NAV)`, `(ต้องใช้ API Key)`).
- [x] Set realistic default starting NAVs for `K-WORLDX` and `SCBCE`.
- [x] Update modal descriptions and help texts in EN and TH.

### Phase 3: QA Verification (`qa_debugger`)
- [x] Verify raw `<script>` compilation with `new vm.Script()`.
- [x] Verify headless Chrome CDP runtime execution with 0 exceptions and accurate badges.
- [x] Run all automated test suites in `scratch/test_thai_assets.mjs`.

### Phase 4: Adversarial Security & Code Review (`security_reviewer`)
- [x] Audit XSS escaping on all status badges and API responses.
- [x] Verify API keys remain strictly local in `localStorage`.

### Phase 5: Release & Version Bump (`release`)
- [x] Bump version to `v1.3.23`, update `sw.js` cache, update `README.md` and `.ai/memory/lessons.md`.
- [x] Commit, push branch, open PR, and merge into master.
