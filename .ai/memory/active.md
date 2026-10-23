---
task_id: "phase-137-native-barcode-qr-scanner"
status: "completed"
current_stage: "release"
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

### Feature Specification: Phase 137 — Native Barcode / QR Camera Scanner for P2P Sync (Pillar 1.3)

#### 1. Goal & Requirements
- **Goal:** Elevate the offline P2P sync system in `index.html` and `js/app-shell.js` into an instant, native camera and file-based scanning workflow:
  1. **Native Barcode / QR Engine (`js/engines/p2p-sync.js`):**
     - Provide `createBarcodeDetector()` returning a standards-compliant BarcodeDetector instance configured for QR codes.
     - Implement `scanQrFromSource(detector, source)` to detect barcodes on video frames, canvas elements, Image elements, and ImageBitmaps.
     - Implement `playScanFeedbackChime()` using Web Audio API (`AudioContext`, oscillator beep) with zero external audio assets.
     - Implement `isBarcodeDetectorSupported()` detection helper.
  2. **Camera Controls & Sensory Feedback (`js/app-shell.js`):**
     - Switch camera facing mode button (`environment` rear camera vs `user` front camera).
     - Torch / Flash toggle if supported (`track.applyConstraints({ advanced: [{ torch: true }] })`).
     - Real-time slice capture feedback: green flash border on `#qrCameraOverlay`, audio chime, and optional vibration (`navigator.vibrate?.(60)`).
  3. **Image File Picker QR Ingestion (`index.html` & `js/app-shell.js`):**
     - Add file upload button to `#qrImportModal` allowing users to select an image / screenshot of a QR slice.
     - Decodes the selected image via `createImageBitmap` and `BarcodeDetector`, feeding the chunk into `handleScannedChunkString`.
  4. **Bilingual Parity:**
     - 100% key symmetry between Thai and English in `translations.th` and `translations.en` in `js/app-shell.js`.
  5. **Automated Verification:**
     - Author `tests/p2p-scanner.test.mjs` verifying scanner engine, image/bitmap detection, chunk assembly integration, and audio chime fallback.

#### 2. Affected Files
- `js/engines/p2p-sync.js`: Add `isBarcodeDetectorSupported`, `createBarcodeDetector`, `scanQrFromSource`, and `playScanFeedbackChime`.
- `index.html`: Add camera switch button, torch button, image upload button in `#qrImportModal`.
- `js/app-shell.js`: Wire up camera switching, torch toggling, file picker decoder, audio chime feedback, and update translations.
- `tests/p2p-scanner.test.mjs`: Test engine APIs, chunk processing, and mock detection.
- `package.json` & `sw.js`: Bump version to `v2.5.78`.

#### 3. Step-by-Step Implementation Plan
- **Step 1:** In `js/engines/p2p-sync.js`, implement scanner helpers and Web Audio chime.
- **Step 2:** In `index.html`, add camera switch, torch, and image file picker buttons with `data-i18n`.
- **Step 3:** In `js/app-shell.js`, implement camera switching, torch, image file decoding, audio/visual chime, and bilingual keys.
- **Step 4:** Author `tests/p2p-scanner.test.mjs` unit assertions.
- **Step 5:** Run `npm run lint` and `npm test` across all 788+ tests.
- **Step 6:** Review security, record lessons, bump version to `v2.5.78`, and git push.
