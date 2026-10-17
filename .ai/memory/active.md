---
task_id: "FEAT-ENCRYPTED-BACKUP-VAULT-01"
status: "in_progress"
current_stage: "coder"
complexity: "level_2"
iteration_count: 0
pipeline: ["orchestrator", "planner", "approval_gate", "coder", "debugger", "reviewer", "release"]
---

### Active Task: AES-GCM Encrypted Offline Backup Vault (.superapp.vault) (Phase 41 / v2.2.4)
- **Goal:** Provide military-grade, 100% offline client-side encrypted backup & restore using standard W3C Web Cryptography API (`crypto.subtle`).
- **Cryptographic Specifications:**
  - Key Derivation: PBKDF2 (SHA-256, 100,000 iterations, 16-byte cryptographically secure random salt).
  - Cipher: AES-GCM (256-bit key, 12-byte random IV, AEAD authenticated integrity).
  - File Format: `.superapp.vault` envelope containing format version, creation timestamp, Base64 salt, Base64 IV, and Base64 ciphertext.
- **Workflow & UI:**
  - In `index.html` Settings modal: Export button for `.superapp.vault` with passphrase confirmation modal.
  - File import handler auto-detects `.vault` format and prompts for decryption passphrase.
  - Automated unit tests in `tests/financial-math.test.mjs` verifying encryption, decryption, tampered payload rejection, and wrong password protection.
- **Compliance:** 100% offline-first PWA, zero runtime CDNs, zero telemetry, zero build step (ADR-001).

