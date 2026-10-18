const frame = document.getElementById('app');
const topNavButtons = document.querySelectorAll('.top-nav button');
const bottomNavButtons = document.querySelectorAll('.bottom-nav button');
const allNavButtons = document.querySelectorAll('button[data-tab]');
const langButtons = document.querySelectorAll('.lang-toggle button');
const themeButtons = document.querySelectorAll('.theme-toggle button');

const translations = {
  th: {
    skipLink: 'ข้ามไปยังเนื้อหาหลัก (Skip to content)',
    settingsBtn: 'ข้อมูล',
    privacyFooter: '🔒 100% Client-Side Privacy — ทุกการคำนวณและข้อมูลถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีการส่งข้อมูลสู่เซิร์ฟเวอร์',
    modalTitle: 'จัดการข้อมูล & ความเป็นส่วนตัว',
    modalPrivacyTitle: '🔒 ความเป็นส่วนตัว 100% ปลอดภัยบนเครื่องของคุณ',
    modalPrivacyDesc:
      'ข้อมูลการเงินและผลการคำนวณทั้งหมดได้รับการบันทึกและประมวลผลภายในเบราว์เซอร์ของคุณเท่านั้น (Client-Side Storage) ไม่มีการส่งข้อมูลใดๆ ไปยังเซิร์ฟเวอร์ภายนอก',
    exportTitle: 'สำรองข้อมูลทั้งหมด (JSON / Vault)',
    exportDesc: 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON หรือไฟล์เข้ารหัส (.vault)',
    btnExport: '📤 ส่งออก (JSON)',
    btnExportVault: '🔐 ส่งออก Vault',
    importTitle: 'กู้คืนข้อมูลจากไฟล์สำรอง',
    importDesc: 'นำเข้าไฟล์ JSON หรือไฟล์เข้ารหัส (.vault) เพื่อกู้คืนข้อมูล',
    btnImport: '📥 นำเข้า',
    resetTitle: 'ล้างข้อมูลทั้งหมด (Master Reset)',
    resetDesc: 'ลบข้อมูลในเครื่องมือทั้งหมดและคืนค่าเริ่มต้น',
    btnReset: '🗑️ ล้างทั้งหมด',
    gdriveTitle: 'Google Drive Cloud Sync',
    gdriveDesc: 'สำรองและกู้คืนข้อมูลผ่าน Google Drive ส่วนตัวของคุณ (AppData Folder)',
    gdriveNotConnected: 'ยังไม่ได้เชื่อมต่อบัญชี Google',
    btnGoogleSignin: 'เข้าสู่ระบบด้วย Google',
    btnGoogleSignout: 'ออกจากระบบ',
    btnGdriveUpload: '📤 สำรองขึ้น Drive',
    btnGdriveDownload: '📥 กู้คืนจาก Drive',
    gdriveNeverSynced: 'สำรองล่าสุด: ยังไม่เคยสำรอง',
    gdriveLastSync: (t) => `สำรองล่าสุด: ${t}`,
    gdriveAdvanced: '⚙️ การตั้งค่าขั้นสูง (Client ID)',
    btnSaveClientId: 'บันทึก',
    gdriveClientIdNote: 'ค่าเริ่มต้น: ผูกกับ https://crossoverall.github.io',
    helpBtn: 'คู่มือการใช้งาน (Quick Tour)',
    onboardingTitle: 'เริ่มต้นใช้งาน Money Superapp',
    onboardingSubtitle: 'คู่มือ 5 ขั้นตอนจัดระเบียบการเงินแบบครบวงจร ปลอดภัย 100% บนเครื่องของคุณ',
    step1Title: '1. 💵 สลิปเงินเดือน (Payslip)',
    step1Desc: 'จำลองรายได้สุทธิ, ภาษีหัก ณ ที่จ่าย, ปกส., และเงินสะสมกองทุนสำรองเลี้ยงชีพ (PVD)',
    step2Title: '2. 💰 เงินคงเหลือ (Remaining Money)',
    step2Desc: 'วางแผนงบรายจ่าย จัดสรรเงินออมฉุกเฉิน และส่งเงินส่วนเกินไปลงทุน',
    step3Title: '3. ⚖️ ปรับพอร์ต (Rebalance)',
    step3Desc: 'จัดสรรเงินลงทุนตามสัดส่วนเป้าหมาย คำนวณ DCA ขั้นต่ำแบบ Zero-Drift',
    step4Title: '4. 📉 วางแผนปลดหนี้ (Debt Payoff)',
    step4Desc: 'เปรียบเทียบวิธี Snowball และ Avalanche พร้อมกราฟ Timeline ปลดหนี้',
    step5Title: '5. 📊 ภาพรวม & แดชบอร์ด (Dashboard)',
    step5Desc: 'บันทึกประวัติความมั่งคั่งสุทธิ (Net Worth) และติดตามเป้าหมายการเงินระยะยาว',
    btnTryStep: 'เปิดใช้',
    btnGetStarted: '🚀 เริ่มต้นใช้งานเลย',
    onboardingFooterNote: '💡 สามารถกดเปิดคู่มือนี้ได้ตลอดเวลาจากปุ่ม ❓ บนแถบเมนูด้านบน',
    settingsGuideTitle: '📖 คู่มือเริ่มต้นใช้งาน (Quick Tour)',
    settingsGuideDesc: 'ดูภาพรวมขั้นตอนการทำงานของเครื่องมือทั้งหมด',
    btnOpenGuide: 'เปิดคู่มือ',
    storageHealthTitle: 'สุขภาพข้อมูล & พื้นที่จัดเก็บ (Storage Health)',
    storageHealthDesc: 'ตรวจสอบความสมบูรณ์และขนาดของข้อมูลในเครื่อง (Client-Side)',
    btnDiagnose: '🔍 ตรวจเช็ค',
    storageUsageText: 'พื้นที่ที่ใช้งาน:',
    storageDetailsSummary: '📋 ดูรายละเอียดข้อมูลแต่ละส่วน (Key Inventory)',
    btnRepairStorage: '🛠️ ซ่อมแซมข้อมูลที่เสียหาย',
    qrSyncTitle: '📲 ซิงค์ข้ามเครื่องออฟไลน์ (Offline QR P2P Sync)',
    qrSyncDesc: 'ส่ง-รับข้อมูลข้ามเครื่องด้วย QR Code แบบเข้ารหัส ไม่ต้องต่อเน็ต',
    btnOpenQrExport: '📲 ส่งออก QR',
    btnOpenQrImport: '📷 สแกน QR',
    qrExportModalTitle: 'ส่งออกข้อมูลผ่าน QR Code (Offline P2P)',
    qrExportModalDesc: 'ข้อมูลถูกเข้ารหัส AES-GCM แล้วแปลงเป็น Animated QR Code ให้สแกนรับทีละชิ้น',
    qrBtnPrev: '◀ ก่อนหน้า',
    qrBtnNext: 'ถัดไป ▶',
    qrBtnAutoPlay: '▶ เล่นวนอัตโนมัติ',
    qrBtnPause: '⏸ พักการวน',
    qrBtnCopyChunk: '📋 คัดลอกชิ้นส่วน',
    qrImportModalTitle: 'สแกน / นำเข้า QR Code (Offline P2P)',
    qrImportModalDesc: 'สแกน QR Code จากเครื่องต้นทาง หรือวางโค้ดชิ้นส่วนเพื่อประกอบข้อมูลและถอดรหัส',
    qrBtnProcessChunk: '📥 บันทึกชิ้นส่วนนี้',
    appLockTitle: 'การล็อกแอป & ความเป็นส่วนตัว (App Lock)',
    appLockDesc: 'ล็อกหน้าจอด้วยรหัส PIN หรือสแกนลายนิ้วมือ / ใบหน้า (Biometrics)',
    autoLockTimeout: 'ระยะเวลาล็อกอัตโนมัติ:',
    btnChangePin: '🔑 เปลี่ยนรหัส PIN',
    btnLockNow: '🔒 ล็อกเดี๋ยวนี้',
    biometricToggle: 'สแกนใบหน้า / ลายนิ้วมือ (Biometrics):',
    btnBiometricStatusOn: 'เปิดใช้งานอยู่',
    btnBiometricStatusOff: 'เปิดใช้งาน',
    lockScreenTitle: 'Money Superapp',
    lockScreenSubtitle: 'กรุณากรอกรหัส PIN 6 หลักเพื่อปลดล็อก',
    btnBiometricUnlock: 'ปลดล็อกด้วย Face ID / Touch ID',
    pwaUpdateText: 'มีเวอร์ชันใหม่พร้อมใช้งาน',
    pwaUpdateBtn: 'อัปเดตเลย ➔',
    gdriveWorking: '⏳ กำลังทำงาน...',
    autoLockOpt0: 'ล็อกทันทีเมื่อสลับหน้าต่าง',
    autoLockOpt1: '1 นาที',
    autoLockOpt5: '5 นาที (แนะนำ)',
    autoLockOpt15: '15 นาที',
    autoLockOptNever: 'ไม่ล็อกอัตโนมัติ',
    badgeOnboardSafe: '🔒 ปลอดภัย 100% บนเครื่อง',
    badgeOnboardDrive: '☁️ ซิงค์ Google Drive ได้',
    badgeOnboardKeys: '⌨️ คีย์ลัด Alt+1..7',
    qrCameraFallback: '📷 กล้องไม่พร้อมใช้งาน หรือเบราว์เซอร์ไม่รองรับ BarcodeDetector คุณสามารถวางโค้ด JSON ชิ้นส่วนด้านล่าง',
  },
  en: {
    skipLink: 'Skip to main content',
    settingsBtn: 'Data',
    privacyFooter:
      '🔒 100% Client-Side Privacy — All calculations and data are stored locally on your device only. No data is sent to any server.',
    modalTitle: 'Data & Privacy Management',
    modalPrivacyTitle: '🔒 100% Privacy — Secure on Your Device',
    modalPrivacyDesc:
      'All financial data and calculation results are saved and processed entirely within your browser (Client-Side Storage). No data is sent to external servers.',
    exportTitle: 'Backup All Data (JSON / Vault)',
    exportDesc: 'Download backup JSON or AES-GCM encrypted vault (.vault)',
    btnExport: '📤 Export (JSON)',
    btnExportVault: '🔐 Export Vault',
    importTitle: 'Restore Data from Backup',
    importDesc: 'Import JSON file or encrypted (.vault) to restore data',
    btnImport: '📥 Import',
    resetTitle: 'Master Reset (Clear All Data)',
    resetDesc: 'Delete data across all tools and reset to defaults',
    btnReset: '🗑️ Reset All',
    gdriveTitle: 'Google Drive Cloud Sync',
    gdriveDesc: 'Backup and restore data via your private Google Drive (AppData Folder)',
    gdriveNotConnected: 'Google Account not connected',
    btnGoogleSignin: 'Sign in with Google',
    btnGoogleSignout: 'Sign out',
    btnGdriveUpload: '📤 Save to Drive',
    btnGdriveDownload: '📥 Restore from Drive',
    gdriveNeverSynced: 'Last backup: Never',
    gdriveLastSync: (t) => `Last backup: ${t}`,
    gdriveAdvanced: '⚙️ Advanced Settings (Client ID)',
    btnSaveClientId: 'Save',
    gdriveClientIdNote: 'Default: Configured for https://crossoverall.github.io',
    helpBtn: 'Quick Tour & Guide',
    onboardingTitle: 'Welcome to Money Superapp',
    onboardingSubtitle: '5 Steps to Financial Freedom with 100% Client-Side Privacy',
    step1Title: '1. 💵 Payslip Simulator',
    step1Desc: 'Calculate net income, withholding tax, SSO, and Provident Fund (PVD) contributions.',
    step2Title: '2. 💰 Remaining Money',
    step2Desc: 'Budget monthly expenses, build emergency reserves, and calculate investable surplus.',
    step3Title: '3. ⚖️ Rebalance & DCA',
    step3Desc: 'Target asset allocation and zero-drift DCA minimum budget projections.',
    step4Title: '4. 📉 Debt Payoff',
    step4Desc: 'Snowball vs Avalanche comparison with interactive amortization payoff curve.',
    step5Title: '5. 📊 Financial Dashboard',
    step5Desc: 'Save monthly net worth snapshots and monitor long-term financial health.',
    btnTryStep: 'Open',
    btnGetStarted: '🚀 Get Started',
    onboardingFooterNote: '💡 You can reopen this tour anytime by clicking the ❓ button in the top bar.',
    settingsGuideTitle: '📖 Quick Tour & Guide',
    settingsGuideDesc: 'Explore the interconnected financial workflow',
    btnOpenGuide: 'Open Guide',
    storageHealthTitle: 'Storage Health & Usage Inspector',
    storageHealthDesc: 'Check local data integrity and storage consumption',
    btnDiagnose: '🔍 Diagnose',
    storageUsageText: 'Storage used:',
    storageDetailsSummary: '📋 View Data Key Inventory',
    btnRepairStorage: '🛠️ Repair Corrupted Data',
    qrSyncTitle: '📲 Offline QR P2P Sync',
    qrSyncDesc: 'Transfer encrypted data between devices via QR codes completely offline.',
    btnOpenQrExport: '📲 Export QR',
    btnOpenQrImport: '📷 Scan QR',
    qrExportModalTitle: 'Export Data via QR Code (Offline P2P)',
    qrExportModalDesc: 'Data is AES-GCM encrypted and transformed into animated QR code slices.',
    qrBtnPrev: '◀ Previous',
    qrBtnNext: 'Next ▶',
    qrBtnAutoPlay: '▶ Auto Play',
    qrBtnPause: '⏸ Pause',
    qrBtnCopyChunk: '📋 Copy Slice',
    qrImportModalTitle: 'Scan / Import QR Code (Offline P2P)',
    qrImportModalDesc: 'Scan QR codes from source device or paste slices manually to assemble and decrypt.',
    qrBtnProcessChunk: '📥 Process Slice',
    appLockTitle: 'App Lock & Privacy Guard',
    appLockDesc: 'Lock screen with 6-digit PIN or biometrics (Face ID / Touch ID).',
    autoLockTimeout: 'Auto-Lock Inactivity Timeout:',
    btnChangePin: '🔑 Change PIN',
    btnLockNow: '🔒 Lock Now',
    biometricToggle: 'Face ID / Fingerprint (Biometrics):',
    btnBiometricStatusOn: 'Enabled',
    btnBiometricStatusOff: 'Enable',
    lockScreenTitle: 'Money Superapp',
    lockScreenSubtitle: 'Enter 6-digit PIN to unlock',
    btnBiometricUnlock: 'Unlock with Face ID / Touch ID',
    pwaUpdateText: 'New version available',
    pwaUpdateBtn: 'Update Now ➔',
    gdriveWorking: '⏳ Working...',
    autoLockOpt0: 'Lock immediately on blur',
    autoLockOpt1: '1 minute',
    autoLockOpt5: '5 minutes (Recommended)',
    autoLockOpt15: '15 minutes',
    autoLockOptNever: 'Never lock automatically',
    badgeOnboardSafe: '🔒 100% On-device Safe',
    badgeOnboardDrive: '☁️ Optional Google Drive Sync',
    badgeOnboardKeys: '⌨️ Shortcuts Alt+1..7',
    qrCameraFallback: '📷 Camera unavailable or BarcodeDetector not supported. You can paste slice JSON below.',
  },
};

function getLang() {
  try {
    return localStorage.getItem('moneySuperapp.lang') || 'th';
  } catch (e) {
    return 'th';
  }
}
function getTheme() {
  try {
    return localStorage.getItem('moneySuperapp.theme') || 'light';
  } catch (e) {
    return 'light';
  }
}
function applyLang(lang) {
  langButtons.forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  topNavButtons.forEach((b) => {
    if (b.dataset[lang]) b.textContent = b.dataset[lang];
  });
  bottomNavButtons.forEach((b) => {
    const label = b.querySelector('.b-label');
    if (label && b.dataset[lang]) label.textContent = b.dataset[lang];
  });
  themeButtons.forEach((b) => {
    b.title =
      b.dataset.themeBtn === 'light'
        ? lang === 'en'
          ? '☀ Light Theme'
          : '☀ ธีมสว่าง'
        : lang === 'en'
          ? '☾ Dark Theme'
          : '☾ ธีมมืด';
  });
  document.documentElement.lang = lang;
  const activeBtn =
    document.querySelector('.top-nav button.active') || document.querySelector('.bottom-nav button.active');
  if (activeBtn) {
    const desktopBtn = document.querySelector(`.top-nav button[data-tab="${activeBtn.dataset.tab}"]`);
    const titleText = desktopBtn?.dataset[lang] || activeBtn.dataset[lang] || activeBtn.textContent;
    document.title = `Money Superapp — ${titleText}`;
  }
  const t = translations[lang] || translations.th;
  if (document.getElementById('skipLink') && t.skipLink) document.getElementById('skipLink').textContent = t.skipLink;
  if (document.getElementById('btn-settings-modal')) {
    document.getElementById('btn-settings-modal').title =
      lang === 'en' ? 'Data & Backup Management' : 'จัดการข้อมูล & ความเป็นส่วนตัว';
  }
  if (document.getElementById('lbl-privacy-footer'))
    document.getElementById('lbl-privacy-footer').textContent = t.privacyFooter;
  if (document.getElementById('lbl-modal-title')) document.getElementById('lbl-modal-title').textContent = t.modalTitle;
  if (document.getElementById('lbl-modal-privacy-title'))
    document.getElementById('lbl-modal-privacy-title').textContent = t.modalPrivacyTitle;
  if (document.getElementById('lbl-modal-privacy-desc'))
    document.getElementById('lbl-modal-privacy-desc').textContent = t.modalPrivacyDesc;
  if (document.getElementById('lbl-export-title'))
    document.getElementById('lbl-export-title').textContent = t.exportTitle;
  if (document.getElementById('lbl-export-desc')) document.getElementById('lbl-export-desc').textContent = t.exportDesc;
  if (document.getElementById('lbl-btn-export')) document.getElementById('lbl-btn-export').textContent = t.btnExport;
  if (document.getElementById('lbl-btn-export-vault'))
    document.getElementById('lbl-btn-export-vault').textContent = t.btnExportVault;
  if (document.getElementById('lbl-import-title'))
    document.getElementById('lbl-import-title').textContent = t.importTitle;
  if (document.getElementById('lbl-import-desc')) document.getElementById('lbl-import-desc').textContent = t.importDesc;
  if (document.getElementById('lbl-btn-import')) document.getElementById('lbl-btn-import').textContent = t.btnImport;
  if (document.getElementById('lbl-reset-title')) document.getElementById('lbl-reset-title').textContent = t.resetTitle;
  if (document.getElementById('lbl-reset-desc')) document.getElementById('lbl-reset-desc').textContent = t.resetDesc;
  if (document.getElementById('lbl-btn-reset')) document.getElementById('lbl-btn-reset').textContent = t.btnReset;

  if (document.getElementById('lbl-storage-health-title'))
    document.getElementById('lbl-storage-health-title').textContent = t.storageHealthTitle;
  if (document.getElementById('lbl-storage-health-desc'))
    document.getElementById('lbl-storage-health-desc').textContent = t.storageHealthDesc;
  if (document.getElementById('lbl-btn-diagnose'))
    document.getElementById('lbl-btn-diagnose').textContent = t.btnDiagnose;
  if (document.getElementById('lbl-storage-usage-text'))
    document.getElementById('lbl-storage-usage-text').textContent = t.storageUsageText;
  if (document.getElementById('lbl-storage-details-summary'))
    document.getElementById('lbl-storage-details-summary').textContent = t.storageDetailsSummary;
  if (document.getElementById('lbl-btn-repair-storage'))
    document.getElementById('lbl-btn-repair-storage').textContent = t.btnRepairStorage;

  if (document.getElementById('lbl-gdrive-title'))
    document.getElementById('lbl-gdrive-title').textContent = t.gdriveTitle;
  if (document.getElementById('lbl-gdrive-desc')) document.getElementById('lbl-gdrive-desc').textContent = t.gdriveDesc;
  if (document.getElementById('lbl-gdrive-not-connected'))
    document.getElementById('lbl-gdrive-not-connected').textContent = t.gdriveNotConnected;
  if (document.getElementById('lbl-btn-google-signin'))
    document.getElementById('lbl-btn-google-signin').textContent = t.btnGoogleSignin;
  if (document.getElementById('lbl-btn-google-signout'))
    document.getElementById('lbl-btn-google-signout').textContent = t.btnGoogleSignout;
  if (document.getElementById('lbl-btn-gdrive-upload'))
    document.getElementById('lbl-btn-gdrive-upload').textContent = t.btnGdriveUpload;
  if (document.getElementById('lbl-btn-gdrive-download'))
    document.getElementById('lbl-btn-gdrive-download').textContent = t.btnGdriveDownload;
  if (document.getElementById('lbl-gdrive-advanced'))
    document.getElementById('lbl-gdrive-advanced').textContent = t.gdriveAdvanced;
  if (document.getElementById('lbl-btn-save-client-id'))
    document.getElementById('lbl-btn-save-client-id').textContent = t.btnSaveClientId;
  if (document.getElementById('lbl-gdrive-client-id-note'))
    document.getElementById('lbl-gdrive-client-id-note').textContent = t.gdriveClientIdNote;

  if (document.getElementById('btn-help-modal')) {
    document.getElementById('btn-help-modal').title = t.helpBtn;
  }
  if (document.getElementById('lbl-onboarding-title'))
    document.getElementById('lbl-onboarding-title').textContent = t.onboardingTitle;
  if (document.getElementById('lbl-onboarding-subtitle'))
    document.getElementById('lbl-onboarding-subtitle').textContent = t.onboardingSubtitle;
  if (document.getElementById('lbl-step1-title')) document.getElementById('lbl-step1-title').textContent = t.step1Title;
  if (document.getElementById('lbl-step1-desc')) document.getElementById('lbl-step1-desc').textContent = t.step1Desc;
  if (document.getElementById('lbl-step2-title')) document.getElementById('lbl-step2-title').textContent = t.step2Title;
  if (document.getElementById('lbl-step2-desc')) document.getElementById('lbl-step2-desc').textContent = t.step2Desc;
  if (document.getElementById('lbl-step3-title')) document.getElementById('lbl-step3-title').textContent = t.step3Title;
  if (document.getElementById('lbl-step3-desc')) document.getElementById('lbl-step3-desc').textContent = t.step3Desc;
  if (document.getElementById('lbl-step4-title')) document.getElementById('lbl-step4-title').textContent = t.step4Title;
  if (document.getElementById('lbl-step4-desc')) document.getElementById('lbl-step4-desc').textContent = t.step4Desc;
  if (document.getElementById('lbl-step5-title')) document.getElementById('lbl-step5-title').textContent = t.step5Title;
  if (document.getElementById('lbl-step5-desc')) document.getElementById('lbl-step5-desc').textContent = t.step5Desc;
  document.querySelectorAll('.lbl-btn-try-step').forEach((el) => {
    el.textContent = t.btnTryStep;
  });
  if (document.getElementById('lbl-btn-get-started'))
    document.getElementById('lbl-btn-get-started').textContent = t.btnGetStarted;
  if (document.getElementById('lbl-onboarding-footer-note'))
    document.getElementById('lbl-onboarding-footer-note').textContent = t.onboardingFooterNote;
  if (document.getElementById('lbl-settings-guide-title'))
    document.getElementById('lbl-settings-guide-title').textContent = t.settingsGuideTitle;
  if (document.getElementById('lbl-settings-guide-desc'))
    document.getElementById('lbl-settings-guide-desc').textContent = t.settingsGuideDesc;
  if (document.getElementById('lbl-btn-open-guide'))
    document.getElementById('lbl-btn-open-guide').textContent = t.btnOpenGuide;

  const cmdInput = document.getElementById('cmdPaletteInput');
  if (cmdInput) {
    cmdInput.placeholder =
      lang === 'en'
        ? 'Type a command, tool, or feature... (e.g. tax, rmf, fire)'
        : 'พิมพ์ค้นหาเครื่องมือ คำสั่ง หรือฟีเจอร์... (เช่น ภาษี, rmf, เกษียณ, หนี้)';
  }
  const btnCmd = document.getElementById('btn-cmd-palette');
  if (btnCmd) {
    btnCmd.title = lang === 'en' ? 'Command Palette & Omnisearch (Ctrl+K)' : 'ค้นหาด่วน & คำสั่งระบบ (Ctrl+K)';
  }

  if (document.getElementById('lbl-qr-sync-title'))
    document.getElementById('lbl-qr-sync-title').textContent = t.qrSyncTitle;
  if (document.getElementById('lbl-qr-sync-desc'))
    document.getElementById('lbl-qr-sync-desc').textContent = t.qrSyncDesc;
  if (document.getElementById('lbl-btn-open-qr-export'))
    document.getElementById('lbl-btn-open-qr-export').textContent = t.btnOpenQrExport;
  if (document.getElementById('lbl-btn-open-qr-import'))
    document.getElementById('lbl-btn-open-qr-import').textContent = t.btnOpenQrImport;
  if (document.getElementById('lbl-qr-export-title'))
    document.getElementById('lbl-qr-export-title').textContent = t.qrExportModalTitle;
  if (document.getElementById('lbl-qr-export-desc'))
    document.getElementById('lbl-qr-export-desc').textContent = t.qrExportModalDesc;
  if (document.getElementById('lbl-qr-counter-text'))
    document.getElementById('lbl-qr-counter-text').textContent = lang === 'en' ? 'Slice' : 'ชิ้นส่วน';
  if (document.getElementById('lbl-qr-btn-prev')) document.getElementById('lbl-qr-btn-prev').textContent = t.qrBtnPrev;
  if (document.getElementById('lbl-qr-btn-autoplay'))
    document.getElementById('lbl-qr-btn-autoplay').textContent = qrAutoPlayTimer ? t.qrBtnPause : t.qrBtnAutoPlay;
  if (document.getElementById('lbl-qr-btn-next')) document.getElementById('lbl-qr-btn-next').textContent = t.qrBtnNext;
  if (document.getElementById('lbl-qr-btn-copy-chunk'))
    document.getElementById('lbl-qr-btn-copy-chunk').textContent = t.qrBtnCopyChunk;
  if (document.getElementById('lbl-qr-import-title'))
    document.getElementById('lbl-qr-import-title').textContent = t.qrImportModalTitle;
  if (document.getElementById('lbl-qr-import-desc'))
    document.getElementById('lbl-qr-import-desc').textContent = t.qrImportModalDesc;
  if (document.getElementById('lbl-qr-import-status'))
    document.getElementById('lbl-qr-import-status').textContent =
      lang === 'en' ? 'Data Reception Progress:' : 'ความคืบหน้าการรับข้อมูล:';
  if (document.getElementById('lbl-qr-manual-summary'))
    document.getElementById('lbl-qr-manual-summary').textContent =
      lang === 'en' ? '⌨️ Paste Slices Manually (Fallback)' : '⌨️ วางโค้ดชิ้นส่วนด้วยตนเอง (Manual Fallback)';
  if (document.getElementById('lbl-btn-process-qr-chunk'))
    document.getElementById('lbl-btn-process-qr-chunk').textContent = t.qrBtnProcessChunk;

  if (document.getElementById('lbl-app-lock-title'))
    document.getElementById('lbl-app-lock-title').textContent = t.appLockTitle;
  if (document.getElementById('lbl-app-lock-desc'))
    document.getElementById('lbl-app-lock-desc').textContent = t.appLockDesc;
  if (document.getElementById('lbl-autolock-timeout'))
    document.getElementById('lbl-autolock-timeout').textContent = t.autoLockTimeout;
  if (document.getElementById('lbl-btn-change-pin'))
    document.getElementById('lbl-btn-change-pin').textContent = t.btnChangePin;
  if (document.getElementById('lbl-btn-lock-now'))
    document.getElementById('lbl-btn-lock-now').textContent = t.btnLockNow;
  if (document.getElementById('lbl-biometric-toggle'))
    document.getElementById('lbl-biometric-toggle').textContent = t.biometricToggle;
  if (document.getElementById('lbl-lock-screen-title'))
    document.getElementById('lbl-lock-screen-title').textContent = t.lockScreenTitle;
  if (document.getElementById('lbl-lock-screen-subtitle'))
    document.getElementById('lbl-lock-screen-subtitle').textContent = t.lockScreenSubtitle;
  if (document.getElementById('lbl-btn-biometric-unlock'))
    document.getElementById('lbl-btn-biometric-unlock').textContent = t.btnBiometricUnlock;

  if (document.getElementById('lbl-pwa-update-text'))
    document.getElementById('lbl-pwa-update-text').textContent = t.pwaUpdateText;
  if (document.getElementById('lbl-pwa-update-btn'))
    document.getElementById('lbl-pwa-update-btn').textContent = t.pwaUpdateBtn;

  if (document.getElementById('gdrive-sync-spinner'))
    document.getElementById('gdrive-sync-spinner').textContent = t.gdriveWorking;

  const selAutoLock = document.getElementById('selAutoLockTimeout');
  if (selAutoLock?.options && selAutoLock.options.length >= 5) {
    selAutoLock.options[0].text = t.autoLockOpt0;
    selAutoLock.options[1].text = t.autoLockOpt1;
    selAutoLock.options[2].text = t.autoLockOpt5;
    selAutoLock.options[3].text = t.autoLockOpt15;
    selAutoLock.options[4].text = t.autoLockOptNever;
  }

  if (document.getElementById('badge-onboard-safe'))
    document.getElementById('badge-onboard-safe').textContent = t.badgeOnboardSafe;
  if (document.getElementById('badge-onboard-drive'))
    document.getElementById('badge-onboard-drive').textContent = t.badgeOnboardDrive;
  if (document.getElementById('badge-onboard-keys'))
    document.getElementById('badge-onboard-keys').textContent = t.badgeOnboardKeys;
  if (document.getElementById('qrCameraFallbackNotice'))
    document.getElementById('qrCameraFallbackNotice').textContent = t.qrCameraFallback;

  if (typeof updateQrImportUI === 'function') {
    updateQrImportUI();
  }
  if (typeof runStorageHealthCheck === 'function') {
    runStorageHealthCheck(false);
  }

  updateGoogleUI();
  try {
    if (frame?.contentDocument?.documentElement) {
      frame.contentDocument.documentElement.lang = lang;
    }
  } catch (_e) {}
  try {
    if (frame?.contentWindow) {
      frame.contentWindow.postMessage({ type: 'LANG_CHANGE', lang: lang }, '*');
    }
  } catch (_e) {}
}

// --- Google Drive Cloud Sync Integration ---
const DEFAULT_GOOGLE_CLIENT_ID = '1070703131970-ujtq2m3ea48f0f632c2adc7e8caq5cao.apps.googleusercontent.com';
let googleTokenClient = null;
let googleAccessToken = null;
let googleTokenExpiry = 0;

function getGoogleClientId() {
  try {
    return localStorage.getItem('moneySuperapp.googleClientId') || DEFAULT_GOOGLE_CLIENT_ID;
  } catch (e) {
    return DEFAULT_GOOGLE_CLIENT_ID;
  }
}

function saveCustomClientId() {
  const input = document.getElementById('inputGoogleClientId');
  if (!input) return;
  const val = input.value.trim();
  try {
    if (val) {
      localStorage.setItem('moneySuperapp.googleClientId', val);
    } else {
      localStorage.removeItem('moneySuperapp.googleClientId');
    }
    alert(getLang() === 'en' ? 'Client ID updated.' : 'บันทึก Client ID เรียบร้อย');
    googleTokenClient = null;
    updateGoogleUI();
  } catch (_e) {}
}

function initGoogleTokenClient(onSuccessCallback) {
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    alert(
      getLang() === 'en'
        ? 'Google Identity Services is loading or unavailable. Please check your internet connection.'
        : 'ไม่สามารถโหลดบริการ Google Identity ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
    );
    return false;
  }
  const clientId = getGoogleClientId();
  try {
    googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/drive.appdata email profile',
      callback: async (resp) => {
        if (resp.error !== undefined) {
          console.error('Google Auth Error:', resp);
          alert(
            (getLang() === 'en' ? 'Google authentication failed: ' : 'การยืนยันตัวตนกับ Google ล้มเหลว: ') +
              (resp.error_description || resp.error),
          );
          updateGoogleUI();
          return;
        }
        googleAccessToken = resp.access_token;
        googleTokenExpiry = Date.now() + (resp.expires_in || 3599) * 1000;
        try {
          sessionStorage.setItem('moneySuperapp.googleToken', googleAccessToken);
          sessionStorage.setItem('moneySuperapp.googleTokenExpiry', String(googleTokenExpiry));
        } catch (_e) {}
        await fetchGoogleUserInfo();
        updateGoogleUI();
        if (typeof onSuccessCallback === 'function') {
          onSuccessCallback();
        }
      },
    });
    return true;
  } catch (err) {
    console.error('initTokenClient error:', err);
    alert(
      (getLang() === 'en' ? 'Failed to initialize Google Login: ' : 'ไม่สามารถเริ่มต้นระบบ Google Login ได้: ') +
        err.message,
    );
    return false;
  }
}

async function fetchGoogleUserInfo() {
  if (!googleAccessToken) return;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    if (res.ok) {
      const info = await res.json();
      localStorage.setItem(
        'moneySuperapp.googleUser',
        JSON.stringify({
          email: info.email || '',
          name: info.name || '',
          picture: info.picture || '',
        }),
      );
    }
  } catch (_e) {}
}

function handleGoogleSignIn(afterSignInCallback) {
  if (!initGoogleTokenClient(afterSignInCallback)) return;
  // Check if we already have an active valid token in memory or sessionStorage
  try {
    const savedToken = sessionStorage.getItem('moneySuperapp.googleToken');
    const savedExp = parseInt(sessionStorage.getItem('moneySuperapp.googleTokenExpiry') || '0', 10);
    if (savedToken && savedExp > Date.now() + 60000) {
      googleAccessToken = savedToken;
      googleTokenExpiry = savedExp;
      updateGoogleUI();
      if (typeof afterSignInCallback === 'function') afterSignInCallback();
      return;
    }
  } catch (_e) {}
  // Trigger standard Google OAuth popup
  googleTokenClient.requestAccessToken({ prompt: '' });
}

function handleGoogleSignOut() {
  if (googleAccessToken && typeof google !== 'undefined' && google.accounts?.oauth2) {
    try {
      google.accounts.oauth2.revoke(googleAccessToken, () => {});
    } catch (_e) {}
  }
  googleAccessToken = null;
  googleTokenExpiry = 0;
  try {
    sessionStorage.removeItem('moneySuperapp.googleToken');
    sessionStorage.removeItem('moneySuperapp.googleTokenExpiry');
    localStorage.removeItem('moneySuperapp.googleUser');
  } catch (_e) {}
  updateGoogleUI();
  alert(getLang() === 'en' ? 'Signed out of Google.' : 'ออกจากระบบ Google แล้ว');
}

function getStoredGoogleUser() {
  try {
    const raw = localStorage.getItem('moneySuperapp.googleUser');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateGoogleUI() {
  const user = getStoredGoogleUser();
  const signedOutEl = document.getElementById('gdrive-signed-out');
  const signedInEl = document.getElementById('gdrive-signed-in');
  const emailEl = document.getElementById('gdrive-user-email');
  const avatarEl = document.getElementById('gdrive-user-avatar');
  const lastSyncEl = document.getElementById('lbl-gdrive-last-sync');
  const inputClientEl = document.getElementById('inputGoogleClientId');

  if (inputClientEl && (!inputClientEl.value || inputClientEl.value === DEFAULT_GOOGLE_CLIENT_ID)) {
    inputClientEl.value = getGoogleClientId();
  }

  if (user?.email) {
    if (signedOutEl) signedOutEl.style.display = 'none';
    if (signedInEl) signedInEl.style.display = 'flex';
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) {
      avatarEl.innerHTML = '';
      if (user.picture) {
        const img = document.createElement('img');
        img.src = user.picture;
        img.alt = 'avatar';
        img.style.cssText = 'width:100%;height:100%;border-radius:50%;object-fit:cover;';
        avatarEl.appendChild(img);
      } else {
        avatarEl.textContent = (user.name || user.email || 'U').charAt(0).toUpperCase();
      }
    }
  } else {
    if (signedOutEl) signedOutEl.style.display = 'flex';
    if (signedInEl) signedInEl.style.display = 'none';
  }

  if (lastSyncEl) {
    try {
      const lastSync = localStorage.getItem('moneySuperapp.lastGoogleSync');
      const t = translations[getLang()] || translations.th;
      if (lastSync) {
        const d = new Date(lastSync);
        const timeStr = d.toLocaleDateString(getLang() === 'en' ? 'en-US' : 'th-TH', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        lastSyncEl.textContent =
          typeof t.gdriveLastSync === 'function' ? t.gdriveLastSync(timeStr) : `สำรองล่าสุด: ${timeStr}`;
      } else {
        lastSyncEl.textContent = t.gdriveNeverSynced || 'สำรองล่าสุด: ยังไม่เคยสำรอง';
      }
    } catch (_e) {}
  }
}

async function ensureValidGoogleToken() {
  if (googleAccessToken && googleTokenExpiry > Date.now() + 60000) {
    return googleAccessToken;
  }
  try {
    const savedToken = sessionStorage.getItem('moneySuperapp.googleToken');
    const savedExp = parseInt(sessionStorage.getItem('moneySuperapp.googleTokenExpiry') || '0', 10);
    if (savedToken && savedExp > Date.now() + 60000) {
      googleAccessToken = savedToken;
      googleTokenExpiry = savedExp;
      return googleAccessToken;
    }
  } catch (_e) {}

  return new Promise((resolve) => {
    handleGoogleSignIn(() => {
      resolve(googleAccessToken);
    });
  });
}

async function saveToGoogleDrive() {
  const spinner = document.getElementById('gdrive-sync-spinner');
  const btnUpload = document.getElementById('btn-gdrive-upload');
  if (spinner) spinner.style.display = 'inline';
  if (btnUpload) btnUpload.disabled = true;

  try {
    const token = await ensureValidGoogleToken();
    if (!token) throw new Error('No Google token available');

    const backup = {
      version: '1.0.0',
      appName: 'Money Superapp',
      exportedAt: new Date().toISOString(),
      data: {},
    };
    const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && allowedPrefixes.some((p) => key.startsWith(p))) {
        backup.data[key] = localStorage.getItem(key);
      }
    }
    const backupJson = JSON.stringify(backup, null, 2);

    const q = encodeURIComponent(
      "name = 'money-superapp-backup.json' and 'appDataFolder' in parents and trashed = false",
    );
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,modifiedTime)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!listRes.ok) throw new Error(`Drive API error (${listRes.status})`);
    const listData = await listRes.json();
    const existingFile = listData.files && listData.files.length > 0 ? listData.files[0] : null;

    let saveRes;
    if (existingFile) {
      saveRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: backupJson,
      });
    } else {
      const metadata = {
        name: 'money-superapp-backup.json',
        parents: ['appDataFolder'],
        mimeType: 'application/json',
      };
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;
      const body =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        backupJson +
        closeDelimiter;

      saveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: body,
      });
    }

    if (!saveRes.ok) throw new Error(`Upload failed (${saveRes.status})`);

    const nowIso = new Date().toISOString();
    localStorage.setItem('moneySuperapp.lastGoogleSync', nowIso);
    updateGoogleUI();
    alert(
      getLang() === 'en' ? '✓ Backup saved to Google Drive successfully!' : '✓ สำรองข้อมูลขึ้น Google Drive เรียบร้อยแล้ว!',
    );
  } catch (err) {
    console.error('Google Drive Backup Error:', err);
    alert((getLang() === 'en' ? 'Backup failed: ' : 'สำรองข้อมูลไม่สำเร็จ: ') + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
    if (btnUpload) btnUpload.disabled = false;
  }
}

async function restoreFromGoogleDrive() {
  const spinner = document.getElementById('gdrive-sync-spinner');
  const btnDownload = document.getElementById('btn-gdrive-download');
  if (spinner) spinner.style.display = 'inline';
  if (btnDownload) btnDownload.disabled = true;

  try {
    const token = await ensureValidGoogleToken();
    if (!token) throw new Error('No Google token available');

    const q = encodeURIComponent(
      "name = 'money-superapp-backup.json' and 'appDataFolder' in parents and trashed = false",
    );
    const listRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=${q}&fields=files(id,name,modifiedTime)`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!listRes.ok) throw new Error(`Drive API error (${listRes.status})`);
    const listData = await listRes.json();
    if (!listData.files || listData.files.length === 0) {
      alert(
        getLang() === 'en'
          ? 'No backup file found in your Google Drive AppData.'
          : 'ไม่พบไฟล์สำรองข้อมูลใน Google Drive AppData ของคุณ',
      );
      return;
    }

    const file = listData.files[0];
    const modDate = file.modifiedTime
      ? new Date(file.modifiedTime).toLocaleString(getLang() === 'en' ? 'en-US' : 'th-TH')
      : '';
    const confirmMsg =
      getLang() === 'en'
        ? `Found backup saved on ${modDate}.\n\nRestore this data? Current calculator data will be replaced.`
        : `พบไฟล์สำรองข้อมูลบันทึกเมื่อ ${modDate}\n\nต้องการกู้คืนข้อมูลนี้หรือไม่? ข้อมูลปัจจุบันในเครื่องจะถูกแทนที่`;
    if (!confirm(confirmMsg)) return;

    const getRes = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!getRes.ok) throw new Error(`Download failed (${getRes.status})`);
    const backup = await getRes.json();

    if (!backup || typeof backup !== 'object' || !backup.data) {
      alert(getLang() === 'en' ? 'Invalid backup data from Google Drive' : 'ข้อมูลสำรองจาก Google Drive ไม่ถูกต้อง');
      return;
    }

    const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
    Object.keys(backup.data).forEach((key) => {
      if (allowedPrefixes.some((p) => key.startsWith(p)) && typeof backup.data[key] === 'string') {
        localStorage.setItem(key, backup.data[key]);
      }
    });

    alert(
      getLang() === 'en' ? '✓ Backup restored from Google Drive successfully!' : '✓ กู้คืนข้อมูลจาก Google Drive สำเร็จแล้ว!',
    );
    reloadFrame();
    closeSettingsModal();
  } catch (err) {
    console.error('Google Drive Restore Error:', err);
    alert((getLang() === 'en' ? 'Restore failed: ' : 'กู้คืนข้อมูลไม่สำเร็จ: ') + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
    if (btnDownload) btnDownload.disabled = false;
  }
}

// --- Storage Health & Diagnostic Subsystem ---
const CANONICAL_STORAGE_SCHEMAS = {
  'rebalanceCalculator.state.v1': { label: 'พอร์ต Rebalance', isJson: true, defaultVal: '{}' },
  'remainingMoneyCalculator.state.v1': { label: 'งบประมาณรายเดือน', isJson: true, defaultVal: '{}' },
  'moneySuperapp.debtCalculator.state.v1': { label: 'แผนปลดหนี้', isJson: true, defaultVal: '{}' },
  'moneySuperapp.monthsSlips': { label: 'ประวัติสลิปเงินเดือน', isJson: true, defaultVal: '[]' },
  'moneySuperapp.taxBase': { label: 'คำนวณภาษีเงินได้', isJson: true, defaultVal: '{}' },
  'moneySuperapp.financialGoals.v1': { label: 'เป้าหมายการเงิน (Goals)', isJson: true, defaultVal: '{}' },
  'moneySuperapp.budgetTemplates.v1': { label: 'แม่แบบงบประมาณ (Templates)', isJson: true, defaultVal: '[]' },
  'moneySuperapp.dashboardSnapshots.v1': { label: 'ภาพรวม Dashboard (Snapshots)', isJson: true, defaultVal: '[]' },
  'moneySuperapp.apiSettings': { label: 'ตั้งค่า API Key', isJson: true, defaultVal: '{}' },
  'moneySuperapp.lang': { label: 'ภาษา (Language)', isJson: false, defaultVal: 'th' },
  'moneySuperapp.theme': { label: 'ธีม (Theme)', isJson: false, defaultVal: 'light' },
  'moneySuperapp.hasSeenOnboarding': { label: 'สถานะคู่มือ (Onboarding)', isJson: false, defaultVal: 'true' },
  'moneySuperapp.googleUser': { label: 'ข้อมูลผู้ใช้ Google', isJson: true, defaultVal: '{}' },
  'moneySuperapp.lastGoogleSync': { label: 'ประวัติ Sync Drive', isJson: false, defaultVal: '' },
  'moneySuperapp.pendingBudget': { label: 'งบประมาณข้ามเครื่องมือ', isJson: false, defaultVal: '0' },
  'moneySuperapp.appLock.v1': { label: 'ระบบล็อกแอป (App Lock)', isJson: true, defaultVal: '{}' },
};

function inspectStorageHealth(storageMap, schemas) {
  let totalBytes = 0;
  let appBytes = 0;
  let corruptedCount = 0;
  const items = [];
  const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];

  const keys = Object.keys(storageMap);
  for (const k of keys) {
    const rawVal = storageMap[k] != null ? String(storageMap[k]) : '';
    const keySize = k.length + rawVal.length;
    totalBytes += keySize;

    const isAppKey = allowedPrefixes.some((p) => k.startsWith(p));
    if (isAppKey) {
      appBytes += keySize;
      const schema = schemas?.[k];
      const shouldBeJson = schema ? schema.isJson : rawVal.trim().startsWith('{') || rawVal.trim().startsWith('[');
      let isCorrupted = false;

      if (shouldBeJson) {
        try {
          JSON.parse(rawVal);
        } catch (e) {
          isCorrupted = true;
          corruptedCount++;
        }
      }

      items.push({
        key: k,
        label: schema ? schema.label : k,
        sizeBytes: keySize,
        isCorrupted,
      });
    }
  }

  items.sort((a, b) => {
    if (a.isCorrupted !== b.isCorrupted) return a.isCorrupted ? -1 : 1;
    return b.sizeBytes - a.sizeBytes;
  });

  return {
    totalBytes,
    appBytes,
    appKb: parseFloat((appBytes / 1024).toFixed(2)),
    percentUsed: parseFloat(Math.min(100, (appBytes / (5 * 1024 * 1024)) * 100).toFixed(2)),
    corruptedCount,
    items,
  };
}

function runStorageHealthCheck(shouldNotify = false) {
  const isEN = getLang() === 'en';
  const storageMap = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) storageMap[k] = localStorage.getItem(k);
  }

  const report = inspectStorageHealth(storageMap, CANONICAL_STORAGE_SCHEMAS);

  const badgeEl = document.getElementById('storage-usage-badge');
  const barEl = document.getElementById('storage-usage-bar');
  const statusTextEl = document.getElementById('lbl-storage-integrity-status');
  const pillEl = document.getElementById('storage-health-pill');
  const listEl = document.getElementById('storage-keys-list');
  const repairBoxEl = document.getElementById('storage-repair-container');

  if (badgeEl) badgeEl.textContent = `${report.appKb} KB / ~5,120 KB (${report.percentUsed}%)`;
  if (barEl) barEl.style.width = `${Math.max(1, Math.min(100, report.percentUsed * 10))}%`;

  if (report.corruptedCount === 0) {
    if (statusTextEl)
      statusTextEl.textContent = isEN ? 'Data Status: 100% Healthy (0 issues)' : 'สถานะข้อมูล: สมบูรณ์ปกติ (ไม่พบข้อผิดพลาด)';
    if (pillEl) {
      pillEl.textContent = isEN ? '✓ Healthy' : '✓ ปกติ';
      pillEl.style.background = 'rgba(47,139,118,0.2)';
      pillEl.style.color = '#4FA894';
    }
    if (repairBoxEl) repairBoxEl.style.display = 'none';
    if (shouldNotify)
      alert(
        isEN
          ? `✓ Storage health check passed! All ${report.items.length} items are healthy.`
          : `✓ ตรวจเช็คเรียบร้อย! ข้อมูลทั้งหมด ${report.items.length} รายการสมบูรณ์ปกติ`,
      );
  } else {
    if (statusTextEl)
      statusTextEl.textContent = isEN
        ? `⚠️ ${report.corruptedCount} corrupted item(s) detected`
        : `⚠️ พบข้อมูลเสียหาย ${report.corruptedCount} รายการ`;
    if (pillEl) {
      pillEl.textContent = isEN ? '⚠️ Corrupted' : '⚠️ เสียหาย';
      pillEl.style.background = 'rgba(201,125,90,0.2)';
      pillEl.style.color = '#C97D5A';
    }
    if (repairBoxEl) repairBoxEl.style.display = 'block';
    const detailsEl = document.getElementById('storage-details-accordion');
    if (detailsEl) detailsEl.open = true;
    if (shouldNotify)
      alert(
        isEN
          ? `⚠️ Found ${report.corruptedCount} corrupted item(s). Click 'Repair' to restore safe defaults.`
          : `⚠️ พบข้อมูลเสียหาย ${report.corruptedCount} รายการ สามารถกดปุ่มซ่อมแซมเพื่อคืนค่าปลอดภัยได้`,
      );
  }

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.estimate) {
    navigator.storage
      .estimate()
      .then((est) => {
        const idbInfoEl = document.getElementById('storage-idb-info');
        if (idbInfoEl) {
          const usedMb = ((est.usage || 0) / (1024 * 1024)).toFixed(1);
          const totalMb = ((est.quota || 0) / (1024 * 1024)).toFixed(0);
          idbInfoEl.textContent = isEN
            ? `IndexedDB Engine: Active (Device quota: ${usedMb} MB used / ~${totalMb} MB total)`
            : `ระบบ IndexedDB: พร้อมใช้งาน (โควต้าเครื่อง: ใช้ไป ${usedMb} MB / ประมาณ ${totalMb} MB)`;
          idbInfoEl.style.display = 'block';
        }
      })
      .catch(() => {});
  }

  if (listEl) {
    listEl.innerHTML = '';
    if (report.items.length === 0) {
      listEl.innerHTML = `<div style="color:#5B7168; font-size:10px; padding:4px;">${isEN ? 'No data stored yet' : 'ยังไม่มีข้อมูลถูกบันทึก'}</div>`;
    } else {
      report.items.forEach((item) => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.fontSize = '10px';
        row.style.padding = '3px 4px';
        row.style.borderRadius = '4px';
        row.style.background = item.isCorrupted ? 'rgba(201,125,90,0.15)' : 'rgba(255,255,255,0.02)';
        row.innerHTML = `
            <div style="display:flex; align-items:center; gap:6px; overflow:hidden;">
              <span>${item.isCorrupted ? '⚠️' : '📄'}</span>
              <span style="font-family:monospace; color:${item.isCorrupted ? '#C97D5A' : '#EAF2EE'}; font-weight:${item.isCorrupted ? '700' : '400'}; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${item.key}">${item.key}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
              <span style="color:#8FA69C;">${(item.sizeBytes / 1024).toFixed(1)} KB</span>
              <span style="color:${item.isCorrupted ? '#C97D5A' : '#4FA894'}; font-weight:700;">${item.isCorrupted ? (isEN ? 'Corrupted' : 'เสียหาย') : 'OK'}</span>
            </div>
          `;
        listEl.appendChild(row);
      });
    }
  }
  return report;
}

function repairCorruptedStorage() {
  const isEN = getLang() === 'en';
  const storageMap = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k) storageMap[k] = localStorage.getItem(k);
  }
  const repairedKeys = [];
  const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];

  Object.keys(storageMap).forEach((k) => {
    const isAppKey = allowedPrefixes.some((p) => k.startsWith(p));
    if (!isAppKey) return;
    const rawVal = storageMap[k] || '';
    const schema = CANONICAL_STORAGE_SCHEMAS[k];
    const shouldBeJson = schema ? schema.isJson : rawVal.trim().startsWith('{') || rawVal.trim().startsWith('[');
    if (shouldBeJson) {
      try {
        JSON.parse(rawVal);
      } catch (e) {
        if (schema && schema.defaultVal !== undefined) {
          localStorage.setItem(k, schema.defaultVal);
        } else {
          localStorage.removeItem(k);
        }
        repairedKeys.push(k);
      }
    }
  });

  runStorageHealthCheck(false);
  alert(
    isEN
      ? `✓ Repaired ${repairedKeys.length} corrupted item(s) successfully!`
      : `✓ ซ่อมแซมข้อมูลที่เสียหายเรียบร้อยแล้ว (${repairedKeys.length} รายการ)!`,
  );
  reloadFrame();
}

window.runStorageHealthCheck = runStorageHealthCheck;
window.repairCorruptedStorage = repairCorruptedStorage;
window.inspectStorageHealth = inspectStorageHealth;

function openSettingsModal() {
  updateGoogleUI();
  if (typeof updateAppLockSettingsUI === 'function') updateAppLockSettingsUI();
  runStorageHealthCheck(false);
  document.getElementById('settingsModal').style.display = 'flex';
}
function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

function openOnboardingModal() {
  const modal = document.getElementById('onboardingModal');
  if (modal) modal.style.display = 'flex';
}
function closeOnboardingModal() {
  const modal = document.getElementById('onboardingModal');
  if (modal) modal.style.display = 'none';
  try {
    localStorage.setItem('moneySuperapp.hasSeenOnboarding', 'true');
  } catch (_e) {}
}
window.openOnboardingModal = openOnboardingModal;
window.closeOnboardingModal = closeOnboardingModal;

async function shareOrDownloadFile(blob, fileName, title, text) {
  if (typeof navigator !== 'undefined' && typeof File !== 'undefined' && typeof navigator.canShare === 'function') {
    try {
      const file = new File([blob], fileName, { type: blob.type || 'application/octet-stream' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: title || fileName,
          text: text || '',
          files: [file],
        });
        return true;
      }
    } catch (shareErr) {
      if (shareErr.name === 'AbortError') return true;
    }
  }

  // Fallback to classic anchor click download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return false;
}

async function exportBackupData() {
  const backup = {
    version: '1.0.0',
    appName: 'Money Superapp',
    exportedAt: new Date().toISOString(),
    data: {},
  };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('moneySuperapp.') ||
        key.startsWith('remainingMoneyCalculator.') ||
        key.startsWith('rebalanceCalculator.'))
    ) {
      backup.data[key] = localStorage.getItem(key);
    }
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const d = new Date().toISOString().slice(0, 10);
  const fileName = `money-superapp-backup-${d}.json`;
  await shareOrDownloadFile(blob, fileName, 'Money Superapp Backup', 'Money Superapp Offline JSON Backup');
  return backup;
}

async function exportEncryptedVault() {
  const isEn = getLang() === 'en';
  const promptMsg = isEn
    ? 'Enter a secure passphrase to encrypt your backup vault (.vault):'
    : 'กรุณากำหนดรหัสผ่านเพื่อเข้ารหัสไฟล์สำรองข้อมูล (.vault):';
  const passphrase = prompt(promptMsg);
  if (!passphrase || passphrase.trim() === '') {
    if (passphrase !== null) {
      alert(isEn ? 'Passphrase cannot be empty.' : 'รหัสผ่านต้องไม่เว้นว่าง');
    }
    return;
  }

  const backup = {
    version: '1.0.0',
    appName: 'Money Superapp',
    exportedAt: new Date().toISOString(),
    data: {},
  };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('moneySuperapp.') ||
        key.startsWith('remainingMoneyCalculator.') ||
        key.startsWith('rebalanceCalculator.'))
    ) {
      backup.data[key] = localStorage.getItem(key);
    }
  }

  try {
    const plainJson = JSON.stringify(backup, null, 2);
    const encryptFn = (typeof MoneyApp !== 'undefined' && MoneyApp.encryptVaultData) || window.encryptVaultData;
    if (!encryptFn) throw new Error('Encryption module not loaded');
    const encryptedVaultJson = await encryptFn(plainJson, passphrase);
    const blob = new Blob([encryptedVaultJson], { type: 'application/octet-stream' });
    const d = new Date().toISOString().slice(0, 10);
    const fileName = `money-superapp-${d}.superapp.vault`;
    await shareOrDownloadFile(blob, fileName, 'Money Superapp Vault', 'Money Superapp Encrypted Backup Vault');
    alert(isEn ? '✓ Encrypted vault exported successfully!' : '✓ ส่งออกไฟล์เข้ารหัส (.vault) สำเร็จ!');
  } catch (err) {
    alert((isEn ? 'Encryption failed: ' : 'การเข้ารหัสผิดพลาด: ') + err.message);
  }
}

function handleImportFile(input) {
  if (!input.files?.[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  const isEn = getLang() === 'en';
  reader.onload = async (e) => {
    try {
      let contentStr = e.target.result;
      let isVault = file.name.endsWith('.vault');

      try {
        const preliminary = JSON.parse(contentStr);
        if (preliminary && preliminary.format === 'money-superapp-vault-v1') {
          isVault = true;
        }
      } catch (_ignore) {}

      if (isVault) {
        const pass = prompt(isEn ? 'Enter vault passphrase to decrypt:' : 'กรุณากรอกรหัสผ่านเพื่อถอดรหัสไฟล์ Vault:');
        if (!pass) {
          input.value = '';
          return;
        }
        try {
          const decryptFn = (typeof MoneyApp !== 'undefined' && MoneyApp.decryptVaultData) || window.decryptVaultData;
          if (!decryptFn) throw new Error('Decryption module not loaded');
          contentStr = await decryptFn(contentStr, pass);
        } catch (_decryptErr) {
          alert(
            isEn
              ? '❌ Decryption failed: Incorrect passphrase or corrupted vault file.'
              : '❌ ถอดรหัสไม่สำเร็จ: รหัสผ่านไม่ถูกต้อง หรือไฟล์เสียหาย',
          );
          input.value = '';
          return;
        }
      }

      const backup = JSON.parse(contentStr);
      if (!backup || typeof backup !== 'object' || !backup.data) {
        alert(isEn ? 'Invalid backup file format' : 'รูปแบบไฟล์สำรองข้อมูลไม่ถูกต้อง');
        input.value = '';
        return;
      }
      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
      Object.keys(backup.data).forEach((key) => {
        if (allowedPrefixes.some((p) => key.startsWith(p)) && typeof backup.data[key] === 'string') {
          localStorage.setItem(key, backup.data[key]);
        }
      });
      alert(isEn ? '✓ Backup restored successfully!' : '✓ นำเข้าข้อมูลสำรองเรียบร้อยแล้ว!');
      reloadFrame();
      closeSettingsModal();
    } catch (err) {
      alert(isEn ? `Error reading backup file: ${err.message}` : `เกิดข้อผิดพลาดในการอ่านไฟล์สำรอง: ${err.message}`);
    }
  };
  reader.readAsText(file);
  input.value = '';
}

// --- Phase 69: Offline QR Code P2P Device Sync Subsystem ---
let qrExportChunks = [];
let qrExportIndex = 0;
let qrAutoPlayTimer = null;
let qrScanStream = null;
let qrScanInterval = null;
let qrImportedChunks = {};
let qrImportExpectedTotal = 0;
let qrImportSessionId = null;

async function openQrExportModal() {
  const isEn = getLang() === 'en';
  const promptMsg = isEn
    ? 'Enter a secure passphrase to encrypt your QR backup vault:'
    : 'กรุณากำหนดรหัสผ่านเพื่อเข้ารหัสข้อมูลสำรอง QR Code:';
  const passphrase = prompt(promptMsg);
  if (!passphrase || passphrase.trim() === '') {
    if (passphrase !== null) {
      alert(isEn ? 'Passphrase cannot be empty.' : 'รหัสผ่านต้องไม่เว้นว่าง');
    }
    return;
  }

  const backup = {
    version: '1.0.0',
    appName: 'Money Superapp',
    exportedAt: new Date().toISOString(),
    data: {},
  };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('moneySuperapp.') ||
        key.startsWith('remainingMoneyCalculator.') ||
        key.startsWith('rebalanceCalculator.'))
    ) {
      backup.data[key] = localStorage.getItem(key);
    }
  }

  try {
    const plainJson = JSON.stringify(backup);
    const encryptFn = (typeof MoneyApp !== 'undefined' && MoneyApp.encryptVaultData) || window.encryptVaultData;
    if (!encryptFn) throw new Error('Encryption module not loaded');
    const encryptedVaultJson = await encryptFn(plainJson, passphrase);

    const chunkFn = (typeof MoneyApp !== 'undefined' && MoneyApp.chunkPayload) || window.chunkPayload;
    const transferId = `tx_${Math.random().toString(36).slice(2, 8)}`;
    qrExportChunks = chunkFn
      ? chunkFn(encryptedVaultJson, 180, transferId)
      : [{ c: 1, t: 1, d: encryptedVaultJson, id: transferId }];
    qrExportIndex = 0;

    renderQrExportFrame(0);

    const modal = document.getElementById('qrExportModal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    alert((isEn ? 'Failed to prepare QR export: ' : 'เตรียมส่งออก QR ไม่สำเร็จ: ') + err.message);
  }
}

function closeQrExportModal() {
  if (qrAutoPlayTimer) {
    clearInterval(qrAutoPlayTimer);
    qrAutoPlayTimer = null;
  }
  const btnAuto = document.getElementById('btn-qr-autoplay');
  const t = translations[getLang()] || translations.th;
  if (btnAuto) {
    btnAuto.innerHTML = `<span id="lbl-qr-btn-autoplay">${t.qrBtnAutoPlay}</span>`;
  }
  const modal = document.getElementById('qrExportModal');
  if (modal) modal.style.display = 'none';
}

function renderQrExportFrame(idx) {
  if (!qrExportChunks || qrExportChunks.length === 0) return;
  let targetIdx = idx;
  if (targetIdx < 0) targetIdx = 0;
  if (targetIdx >= qrExportChunks.length) targetIdx = qrExportChunks.length - 1;
  qrExportIndex = targetIdx;

  const chunk = qrExportChunks[targetIdx];
  const chunkJson = JSON.stringify(chunk);
  const genSvgFn = (typeof MoneyApp !== 'undefined' && MoneyApp.generateQrSvg) || window.generateQrSvg;
  const container = document.getElementById('qrExportSvgContainer');
  if (container && genSvgFn) {
    container.innerHTML = genSvgFn(chunkJson, { size: 240, margin: 2 });
  }

  const counterEl = document.getElementById('qrExportCounter');
  if (counterEl) {
    counterEl.textContent = `${targetIdx + 1} / ${qrExportChunks.length}`;
  }
  const fillEl = document.getElementById('qrExportProgressFill');
  if (fillEl) {
    fillEl.style.width = `${((targetIdx + 1) / qrExportChunks.length) * 100}%`;
  }
}

function nextQrExportFrame() {
  if (!qrExportChunks.length) return;
  const nextIdx = (qrExportIndex + 1) % qrExportChunks.length;
  renderQrExportFrame(nextIdx);
}

function prevQrExportFrame() {
  if (!qrExportChunks.length) return;
  const prevIdx = (qrExportIndex - 1 + qrExportChunks.length) % qrExportChunks.length;
  renderQrExportFrame(prevIdx);
}

function toggleQrExportAutoPlay() {
  const btnAuto = document.getElementById('btn-qr-autoplay');
  const t = translations[getLang()] || translations.th;
  if (qrAutoPlayTimer) {
    clearInterval(qrAutoPlayTimer);
    qrAutoPlayTimer = null;
    if (btnAuto) btnAuto.innerHTML = `<span id="lbl-qr-btn-autoplay">${t.qrBtnAutoPlay}</span>`;
  } else {
    qrAutoPlayTimer = setInterval(() => {
      nextQrExportFrame();
    }, 1600);
    if (btnAuto) btnAuto.innerHTML = `<span id="lbl-qr-btn-autoplay">${t.qrBtnPause}</span>`;
  }
}

function copyQrCurrentChunk() {
  if (!qrExportChunks?.[qrExportIndex]) return;
  const chunkJson = JSON.stringify(qrExportChunks[qrExportIndex]);
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(chunkJson).then(() => {
      const isEn = getLang() === 'en';
      alert(isEn ? 'Copied QR slice JSON to clipboard!' : 'คัดลอกโค้ดชิ้นส่วนลง Clipboard แล้ว!');
    });
  }
}

async function openQrImportModal() {
  qrImportedChunks = {};
  qrImportExpectedTotal = 0;
  qrImportSessionId = null;
  updateQrImportUI();

  const modal = document.getElementById('qrImportModal');
  if (modal) modal.style.display = 'flex';

  const video = document.getElementById('qrScanVideo');
  const fallback = document.getElementById('qrCameraFallbackNotice');

  if (
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.BarcodeDetector !== 'undefined'
  ) {
    try {
      if (fallback) fallback.style.display = 'none';
      if (video) video.style.display = 'block';
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      qrScanStream = stream;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      startBarcodeScannerLoop(video);
    } catch (_err) {
      if (fallback) fallback.style.display = 'block';
      if (video) video.style.display = 'none';
    }
  } else {
    if (fallback) fallback.style.display = 'block';
    if (video) video.style.display = 'none';
  }
}

function closeQrImportModal() {
  if (qrScanInterval) {
    clearInterval(qrScanInterval);
    qrScanInterval = null;
  }
  if (qrScanStream) {
    qrScanStream.getTracks().forEach((track) => {
      track.stop();
    });
    qrScanStream = null;
  }
  const modal = document.getElementById('qrImportModal');
  if (modal) modal.style.display = 'none';
}

function startBarcodeScannerLoop(video) {
  if (typeof window.BarcodeDetector === 'undefined') return;
  const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
  qrScanInterval = setInterval(async () => {
    if (!video || video.readyState < 2) return;
    try {
      const barcodes = await detector.detect(video);
      if (barcodes && barcodes.length > 0) {
        for (const code of barcodes) {
          if (code.rawValue) {
            handleScannedChunkString(code.rawValue);
          }
        }
      }
    } catch (_e) {}
  }, 300);
}

function handleScannedChunkString(rawStr) {
  try {
    const chunk = typeof rawStr === 'string' ? JSON.parse(rawStr) : rawStr;
    if (!chunk || typeof chunk !== 'object' || !chunk.c || !chunk.t || !chunk.d) {
      return false;
    }

    if (chunk.id) {
      if (qrImportSessionId && qrImportSessionId !== chunk.id) {
        qrImportedChunks = {};
      }
      qrImportSessionId = chunk.id;
    }

    qrImportExpectedTotal = chunk.t;
    qrImportedChunks[chunk.c] = chunk;
    updateQrImportUI();

    const assembleFn = (typeof MoneyApp !== 'undefined' && MoneyApp.assembleChunks) || window.assembleChunks;
    const chunkList = Object.values(qrImportedChunks);
    const res = assembleFn
      ? assembleFn(chunkList)
      : { complete: chunkList.length === chunk.t, payload: chunkList.map((c) => c.d).join('') };

    if (res.complete && res.payload) {
      finalizeQrImport(res.payload);
      return true;
    }
    return true;
  } catch (_e) {
    return false;
  }
}

function updateQrImportUI() {
  const isEn = getLang() === 'en';
  const progressText = document.getElementById('qrImportProgressText');
  const progressBar = document.getElementById('qrImportProgressBar');
  const notice = document.getElementById('qrImportMissingNotice');

  const receivedCount = Object.keys(qrImportedChunks).length;
  const total = qrImportExpectedTotal || 0;

  if (progressText) {
    progressText.textContent = `${receivedCount} / ${total} ${isEn ? 'slices' : 'ชิ้นส่วน'}`;
  }
  if (progressBar) {
    const pct = total > 0 ? (receivedCount / total) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
  if (notice) {
    if (total === 0) {
      notice.textContent = isEn ? 'Waiting for first QR slice...' : 'รอสแกนชิ้นส่วนแรก...';
    } else if (receivedCount < total) {
      const missing = [];
      for (let i = 1; i <= total; i++) {
        if (!qrImportedChunks[i]) missing.push(i);
      }
      notice.textContent = isEn ? `Missing slices: [${missing.join(', ')}]` : `ชิ้นส่วนที่ยังขาด: [${missing.join(', ')}]`;
    } else {
      notice.textContent = isEn ? '✓ All slices received! Decrypting...' : '✓ ได้รับชิ้นส่วนครบถ้วน! กำลังเตรียมถอดรหัส...';
    }
  }
}

function processManualQrChunk() {
  const input = document.getElementById('qrManualChunkInput');
  if (!input) return;
  const str = input.value.trim();
  const isEn = getLang() === 'en';
  if (!str) {
    alert(isEn ? 'Please paste chunk JSON string.' : 'กรุณาวางโค้ด JSON ชิ้นส่วน');
    return;
  }
  const ok = handleScannedChunkString(str);
  if (ok) {
    input.value = '';
    alert(isEn ? '✓ Chunk recorded!' : '✓ บันทึกชิ้นส่วนเรียบร้อย!');
  } else {
    alert(isEn ? 'Invalid chunk JSON format.' : 'รูปแบบโค้ด JSON ชิ้นส่วนไม่ถูกต้อง');
  }
}

async function finalizeQrImport(payloadCiphertext) {
  closeQrImportModal();
  const isEn = getLang() === 'en';
  const passPrompt = isEn
    ? 'All slices received! Enter passphrase to decrypt:'
    : 'ได้รับข้อมูลครบทุกชิ้นแล้ว! กรุณากรอกรหัสผ่านเพื่อถอดรหัส:';
  const passphrase = prompt(passPrompt);
  if (!passphrase) {
    alert(isEn ? 'Import cancelled: Passphrase required.' : 'ยกเลิกการนำเข้า: จำเป็นต้องระบุรหัสผ่าน');
    return;
  }

  try {
    const decryptFn = (typeof MoneyApp !== 'undefined' && MoneyApp.decryptVaultData) || window.decryptVaultData;
    if (!decryptFn) throw new Error('Decryption module not loaded');
    const plainJson = await decryptFn(payloadCiphertext, passphrase);
    const backup = JSON.parse(plainJson);

    if (!backup || typeof backup !== 'object' || !backup.data) {
      throw new Error('Invalid restored backup structure');
    }

    const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
    let restoredKeys = 0;
    Object.keys(backup.data).forEach((key) => {
      if (allowedPrefixes.some((p) => key.startsWith(p)) && typeof backup.data[key] === 'string') {
        localStorage.setItem(key, backup.data[key]);
        restoredKeys++;
      }
    });

    alert(
      isEn
        ? `✓ Restored ${restoredKeys} items via Offline QR Sync successfully!`
        : `✓ กู้คืนข้อมูลสำเร็จ (${restoredKeys} รายการ) ผ่าน Offline QR Sync เรียบร้อยแล้ว!`,
    );
    reloadFrame();
    closeSettingsModal();
  } catch (err) {
    alert(
      isEn
        ? `❌ Decryption failed: Incorrect passphrase or corrupted QR data (${err.message})`
        : `❌ ถอดรหัสไม่สำเร็จ: รหัสผ่านไม่ถูกต้อง หรือข้อมูล QR เสียหาย (${err.message})`,
    );
  }
}

window.openQrExportModal = openQrExportModal;
window.closeQrExportModal = closeQrExportModal;
window.renderQrExportFrame = renderQrExportFrame;
window.nextQrExportFrame = nextQrExportFrame;
window.prevQrExportFrame = prevQrExportFrame;
window.toggleQrExportAutoPlay = toggleQrExportAutoPlay;
window.copyQrCurrentChunk = copyQrCurrentChunk;
window.openQrImportModal = openQrImportModal;
window.closeQrImportModal = closeQrImportModal;
window.processManualQrChunk = processManualQrChunk;
window.handleScannedChunkString = handleScannedChunkString;

// --- Phase 70: Biometric / PIN App Lock & Session Privacy Guard Subsystem ---
const APP_LOCK_STORAGE_KEY = 'moneySuperapp.appLock.v1';
let appLockConfig = {
  enabled: false,
  salt: '',
  pinHash: '',
  timeout: 300, // seconds (5 min default)
  biometricEnabled: false,
  biometricCredId: null,
};
let isAppLocked = false;
let currentEnteredPin = '';
let appLockFailedAttempts = 0;
let appLockLockoutUntil = 0;
let appLastActivityTimestamp = Date.now();
let appInactivityInterval = null;

function loadAppLockConfig() {
  try {
    const raw = localStorage.getItem(APP_LOCK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      appLockConfig = Object.assign(appLockConfig, parsed);
    }
  } catch (_e) {}
}

function saveAppLockConfig() {
  try {
    localStorage.setItem(APP_LOCK_STORAGE_KEY, JSON.stringify(appLockConfig));
  } catch (_e) {}
  updateAppLockSettingsUI();
}

function updateAppLockSettingsUI() {
  const chk = document.getElementById('chkAppLockEnabled');
  const panel = document.getElementById('appLockConfigPanel');
  const selTimeout = document.getElementById('selAutoLockTimeout');
  const bioRow = document.getElementById('biometricEnrollRow');
  const bioBtn = document.getElementById('lbl-btn-biometric-status');
  const t = translations[getLang()] || translations.th;

  if (chk) chk.checked = Boolean(appLockConfig.enabled);
  if (panel) panel.style.display = appLockConfig.enabled ? 'flex' : 'none';
  if (selTimeout) selTimeout.value = String(appLockConfig.timeout);

  if (bioRow && typeof window !== 'undefined' && window.PublicKeyCredential) {
    bioRow.style.display = 'flex';
    if (bioBtn) {
      bioBtn.textContent = appLockConfig.biometricEnabled ? t.btnBiometricStatusOn : t.btnBiometricStatusOff;
    }
  }
}

async function toggleAppLockSetting(enable) {
  const isEn = getLang() === 'en';
  if (enable) {
    const pin = prompt(isEn ? 'Create a 6-digit PIN to lock your app:' : 'กรุณากำหนดรหัส PIN 6 หลักเพื่อล็อกแอป:');
    if (!pin || pin.trim().length < 4) {
      alert(isEn ? 'PIN must be at least 4 digits.' : 'รหัส PIN ต้องมีความยาวอย่างน้อย 4 หลัก');
      const chk = document.getElementById('chkAppLockEnabled');
      if (chk) chk.checked = false;
      return;
    }
    const confirmPin = prompt(isEn ? 'Confirm your PIN:' : 'ยืนยันรหัส PIN อีกครั้ง:');
    if (pin !== confirmPin) {
      alert(isEn ? 'PINs do not match.' : 'รหัส PIN ไม่ตรงกัน');
      const chk = document.getElementById('chkAppLockEnabled');
      if (chk) chk.checked = false;
      return;
    }

    const saltFn = (typeof MoneyApp !== 'undefined' && MoneyApp.generateSalt) || window.generateSalt;
    const hashFn = (typeof MoneyApp !== 'undefined' && MoneyApp.hashPin) || window.hashPin;
    const salt = saltFn ? saltFn(16) : 'default_salt';
    const hash = hashFn ? await hashFn(pin, salt) : pin;

    appLockConfig.enabled = true;
    appLockConfig.salt = salt;
    appLockConfig.pinHash = hash;
    saveAppLockConfig();
    alert(isEn ? '✓ App Lock enabled successfully!' : '✓ เปิดใช้งานการล็อกแอปเรียบร้อยแล้ว!');
  } else {
    const isConfirmed = confirm(
      isEn
        ? 'Disable App Lock? Anyone with access to this device will be able to view your data.'
        : 'ต้องการปิดการล็อกแอปหรือไม่? ทุกคนที่ใช้อุปกรณ์นี้จะสามารถดูข้อมูลได้',
    );
    if (!isConfirmed) {
      updateAppLockSettingsUI();
      return;
    }
    appLockConfig.enabled = false;
    saveAppLockConfig();
    unlockApp();
  }
}

async function promptChangePin() {
  const isEn = getLang() === 'en';
  const currentPin = prompt(isEn ? 'Enter current PIN:' : 'กรุณากรอกรหัส PIN ปัจจุบัน:');
  if (!currentPin) return;

  const verifyFn = (typeof MoneyApp !== 'undefined' && MoneyApp.verifyPin) || window.verifyPin;
  const isMatch = verifyFn ? await verifyFn(currentPin, appLockConfig.salt, appLockConfig.pinHash) : false;
  if (!isMatch) {
    alert(isEn ? 'Incorrect PIN.' : 'รหัส PIN ไม่ถูกต้อง');
    return;
  }

  const newPin = prompt(isEn ? 'Enter new 6-digit PIN:' : 'กรุณากรอกรหัส PIN 6 หลักใหม่:');
  if (!newPin || newPin.trim().length < 4) {
    alert(isEn ? 'PIN must be at least 4 digits.' : 'รหัส PIN ต้องมีความยาวอย่างน้อย 4 หลัก');
    return;
  }
  const confirmPin = prompt(isEn ? 'Confirm new PIN:' : 'ยืนยันรหัส PIN ใหม่อีกครั้ง:');
  if (newPin !== confirmPin) {
    alert(isEn ? 'PINs do not match.' : 'รหัส PIN ไม่ตรงกัน');
    return;
  }

  const saltFn = (typeof MoneyApp !== 'undefined' && MoneyApp.generateSalt) || window.generateSalt;
  const hashFn = (typeof MoneyApp !== 'undefined' && MoneyApp.hashPin) || window.hashPin;
  const salt = saltFn ? saltFn(16) : 'default_salt';
  const hash = hashFn ? await hashFn(newPin, salt) : newPin;

  appLockConfig.salt = salt;
  appLockConfig.pinHash = hash;
  saveAppLockConfig();
  alert(isEn ? '✓ PIN changed successfully!' : '✓ เปลี่ยนรหัส PIN เรียบร้อยแล้ว!');
}

function updateAutoLockTimeout(val) {
  appLockConfig.timeout = parseInt(val, 10);
  saveAppLockConfig();
}

async function toggleBiometricsEnrollment() {
  const isEn = getLang() === 'en';
  if (!window.PublicKeyCredential) {
    alert(isEn ? 'Biometrics (WebAuthn) is not supported in this browser.' : 'เบราว์เซอร์นี้ไม่รองรับการสแกนลายนิ้วมือ/ใบหน้า');
    return;
  }

  if (appLockConfig.biometricEnabled) {
    appLockConfig.biometricEnabled = false;
    appLockConfig.biometricCredId = null;
    saveAppLockConfig();
    alert(isEn ? 'Biometrics disabled.' : 'ปิดการใช้งาน Biometrics แล้ว');
    return;
  }

  try {
    const challenge = new Uint8Array(32);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(userId);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: challenge,
        rp: { name: 'Money Superapp' },
        user: {
          id: userId,
          name: 'user@moneysuperapp.local',
          displayName: 'Money Superapp Owner',
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: { userVerification: 'preferred' },
        timeout: 60000,
      },
    });

    if (credential?.id) {
      appLockConfig.biometricEnabled = true;
      appLockConfig.biometricCredId = credential.id;
      saveAppLockConfig();
      alert(isEn ? '✓ Biometrics enrolled successfully!' : '✓ ลงทะเบียน Biometrics เรียบร้อยแล้ว!');
    }
  } catch (err) {
    console.warn('WebAuthn enrollment error:', err);
    alert(
      (isEn ? 'Biometrics setup cancelled or failed: ' : 'การลงทะเบียน Biometrics ล้มเหลวหรือถูกยกเลิก: ') + err.message,
    );
  }
}

function lockAppNow() {
  if (!appLockConfig.enabled) {
    alert(getLang() === 'en' ? 'App Lock is not enabled.' : 'ยังไม่ได้เปิดใช้งานการล็อกแอป');
    return;
  }
  closeSettingsModal();
  isAppLocked = true;
  currentEnteredPin = '';
  refreshPinDots();
  const notice = document.getElementById('pinErrorNotice');
  if (notice) notice.textContent = '';

  const overlay = document.getElementById('appLockOverlay');
  if (overlay) overlay.style.display = 'flex';

  const bioBtn = document.getElementById('btnBiometricUnlock');
  if (bioBtn) {
    bioBtn.style.display = appLockConfig.biometricEnabled ? 'inline-flex' : 'none';
  }
}

function unlockApp() {
  isAppLocked = false;
  currentEnteredPin = '';
  appLockFailedAttempts = 0;
  appLastActivityTimestamp = Date.now();
  const overlay = document.getElementById('appLockOverlay');
  if (overlay) overlay.style.display = 'none';
}

function refreshPinDots() {
  for (let i = 0; i < 6; i++) {
    const dot = document.getElementById(`pindot-${i}`);
    if (dot) {
      if (i < currentEnteredPin.length) {
        dot.style.background = '#2F8B76';
        dot.style.borderColor = '#2F8B76';
      } else {
        dot.style.background = 'transparent';
        dot.style.borderColor = '#2F8B76';
      }
    }
  }
}

function enterPinDigit(digit) {
  if (Date.now() < appLockLockoutUntil) {
    const waitSec = Math.ceil((appLockLockoutUntil - Date.now()) / 1000);
    const notice = document.getElementById('pinErrorNotice');
    if (notice) {
      notice.textContent = getLang() === 'en' ? `Locked out. Try again in ${waitSec}s.` : `กรุณารออีก ${waitSec} วินาที`;
    }
    return;
  }

  if (currentEnteredPin.length < 6) {
    currentEnteredPin += String(digit);
    refreshPinDots();
  }

  if (currentEnteredPin.length === 6) {
    verifyEnteredPin(currentEnteredPin);
  }
}

function clearPinInput() {
  currentEnteredPin = '';
  refreshPinDots();
  const notice = document.getElementById('pinErrorNotice');
  if (notice) notice.textContent = '';
}

function deletePinDigit() {
  if (currentEnteredPin.length > 0) {
    currentEnteredPin = currentEnteredPin.slice(0, -1);
    refreshPinDots();
  }
}

async function verifyEnteredPin(pin) {
  const verifyFn = (typeof MoneyApp !== 'undefined' && MoneyApp.verifyPin) || window.verifyPin;
  const isMatch = verifyFn ? await verifyFn(pin, appLockConfig.salt, appLockConfig.pinHash) : false;

  if (isMatch) {
    unlockApp();
  } else {
    appLockFailedAttempts++;
    const notice = document.getElementById('pinErrorNotice');
    if (appLockFailedAttempts >= 5) {
      appLockLockoutUntil = Date.now() + 30000;
      if (notice) {
        notice.textContent =
          getLang() === 'en' ? 'Too many failed attempts. Locked for 30s.' : 'ใส่รหัสผิดเกิน 5 ครั้ง ระงับการลอง 30 วินาที';
      }
    } else {
      const remaining = 5 - appLockFailedAttempts;
      if (notice) {
        notice.textContent =
          getLang() === 'en'
            ? `Incorrect PIN (${remaining} attempts left)`
            : `รหัส PIN ไม่ถูกต้อง (เหลืออีก ${remaining} ครั้ง)`;
      }
    }
    currentEnteredPin = '';
    setTimeout(() => {
      refreshPinDots();
    }, 200);
  }
}

async function triggerBiometricUnlock() {
  if (!appLockConfig.biometricEnabled) return;
  const isEn = getLang() === 'en';
  try {
    const challenge = new Uint8Array(32);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(challenge);
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'preferred',
      },
    });
    if (assertion) {
      unlockApp();
    }
  } catch (_err) {
    const notice = document.getElementById('pinErrorNotice');
    if (notice) {
      notice.textContent = isEn ? 'Biometric verification failed.' : 'การสแกนไม่สำเร็จ กรุณาใช้รหัส PIN';
    }
  }
}

function initAppLockGuard() {
  loadAppLockConfig();
  updateAppLockSettingsUI();

  if (appLockConfig.enabled) {
    lockAppNow();
  }

  window.addEventListener('keydown', (e) => {
    if (!isAppLocked) return;
    if (e.key >= '0' && e.key <= '9') {
      enterPinDigit(e.key);
    } else if (e.key === 'Backspace') {
      deletePinDigit();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
      clearPinInput();
    }
  });

  const recordActivity = () => {
    appLastActivityTimestamp = Date.now();
  };
  window.addEventListener('pointerdown', recordActivity, { passive: true });
  window.addEventListener('keydown', recordActivity, { passive: true });
  window.addEventListener('touchstart', recordActivity, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (!appLockConfig.enabled || isAppLocked) return;
    if (document.visibilityState === 'hidden') {
      if (appLockConfig.timeout === 0) {
        lockAppNow();
      }
    } else if (document.visibilityState === 'visible') {
      if (appLockConfig.timeout > 0) {
        const elapsedSec = (Date.now() - appLastActivityTimestamp) / 1000;
        if (elapsedSec >= appLockConfig.timeout) {
          lockAppNow();
        }
      }
    }
  });

  if (appInactivityInterval) clearInterval(appInactivityInterval);
  appInactivityInterval = setInterval(() => {
    if (!appLockConfig.enabled || isAppLocked) return;
    if (appLockConfig.timeout > 0) {
      const elapsedSec = (Date.now() - appLastActivityTimestamp) / 1000;
      if (elapsedSec >= appLockConfig.timeout) {
        lockAppNow();
      }
    }
  }, 10000);
}

window.toggleAppLockSetting = toggleAppLockSetting;
window.promptChangePin = promptChangePin;
window.updateAutoLockTimeout = updateAutoLockTimeout;
window.toggleBiometricsEnrollment = toggleBiometricsEnrollment;
window.lockAppNow = lockAppNow;
window.unlockApp = unlockApp;
window.enterPinDigit = enterPinDigit;
window.clearPinInput = clearPinInput;
window.deletePinDigit = deletePinDigit;
window.triggerBiometricUnlock = triggerBiometricUnlock;
window.initAppLockGuard = initAppLockGuard;
window.updateAppLockSettingsUI = updateAppLockSettingsUI;

function resetAllData() {
  const msg =
    getLang() === 'en'
      ? 'Are you sure you want to reset ALL data across all calculators? This action cannot be undone.'
      : 'คุณแน่ใจหรือไม่ว่าต้องการล้างข้อมูลทั้งหมดในทุกเครื่องมือคำนวณ? การกระทำนี้ไม่สามารถยกเลิกได้';
  if (!confirm(msg)) return;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('moneySuperapp.') ||
        key.startsWith('remainingMoneyCalculator.') ||
        key.startsWith('rebalanceCalculator.'))
    ) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => {
    localStorage.removeItem(k);
  });
  alert(getLang() === 'en' ? '✓ All data has been reset to defaults.' : '✓ ล้างข้อมูลทั้งหมดเรียบร้อยแล้ว');
  reloadFrame();
  closeSettingsModal();
}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButtons.forEach((b) => {
    b.classList.toggle('active', b.dataset.themeBtn === theme);
  });
  try {
    if (frame?.contentDocument?.documentElement) {
      frame.contentDocument.documentElement.dataset.theme = theme;
    }
  } catch (_e) {}
  try {
    if (frame?.contentWindow) {
      frame.contentWindow.postMessage({ type: 'THEME_CHANGE', theme: theme }, '*');
    }
  } catch (_e) {}
}
function reloadFrame() {
  try {
    frame.contentWindow.location.reload();
  } catch (_e) {
    const cur = frame.getAttribute('src');
    frame.setAttribute('src', cur);
  }
}

let skeletonTimer = null;
const frameSkeleton = document.getElementById('frameSkeleton');

function showSkeleton() {
  if (!frameSkeleton) return;
  if (skeletonTimer) clearTimeout(skeletonTimer);
  frameSkeleton.classList.remove('fade-out');
  frameSkeleton.style.display = 'flex';
}

function hideSkeleton() {
  if (!frameSkeleton) return;
  frameSkeleton.classList.add('fade-out');
  skeletonTimer = setTimeout(() => {
    frameSkeleton.style.display = 'none';
    frameSkeleton.classList.remove('fade-out');
  }, 200);
}

function triggerHaptic(ms = 10) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && typeof navigator.vibrate === 'function') {
      navigator.vibrate(ms);
    }
  } catch (_e) {}
}

if (frame) {
  frame.addEventListener('load', () => {
    hideSkeleton();
    try {
      const curTheme = getTheme();
      const curLang = getLang();
      if (frame.contentDocument?.documentElement) {
        frame.contentDocument.documentElement.dataset.theme = curTheme;
        frame.contentDocument.documentElement.lang = curLang;
      }
      if (frame.contentWindow) {
        frame.contentWindow.postMessage({ type: 'THEME_CHANGE', theme: curTheme }, '*');
        frame.contentWindow.postMessage({ type: 'LANG_CHANGE', lang: curLang }, '*');
      }
    } catch (_e) {}
  });
}

function activateTab(tabIdOrSrc, updateHash = true) {
  const target =
    Array.from(allNavButtons).find((b) => b.dataset.tab === tabIdOrSrc || b.dataset.src === tabIdOrSrc) ||
    allNavButtons[0];
  const activeTab = target.dataset.tab;
  const targetSrc = target.dataset.src;

  allNavButtons.forEach((b) => {
    const isActive = b.dataset.tab === activeTab;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const versionMeta = document.querySelector('meta[name="version"]')?.content || '';
  const versionQuery = versionMeta ? `?v=${encodeURIComponent(versionMeta)}` : '';
  const fullTargetSrc = targetSrc + versionQuery;

  if (frame.getAttribute('src') !== fullTargetSrc) {
    showSkeleton();
    frame.src = fullTargetSrc;
  }

  triggerHaptic(10);

  const lang = getLang();
  const desktopBtn = document.querySelector(`.top-nav button[data-tab="${activeTab}"]`);
  const titleText = desktopBtn?.dataset[lang] || target.dataset[lang] || activeTab;
  document.title = `Money Superapp — ${titleText}`;

  try {
    localStorage.setItem('moneySuperapp.activeTab', activeTab);
  } catch (_e) {}
  if (updateHash && window.location.hash !== `#${activeTab}`) {
    history.replaceState(null, '', `#${activeTab}`);
  }
}

const TAB_ORDER = [
  'dashboard',
  'rebalance',
  'months-slips',
  'tax-calculator-base',
  'tax-calculator',
  'remaining-money',
  'debt-calculator',
];

function handleSwipeTab(direction) {
  const active =
    document.querySelector('.bottom-nav button.active') || document.querySelector('.top-nav button.active');
  const currentTab = active
    ? active.dataset.tab
    : (() => {
        try {
          return localStorage.getItem('moneySuperapp.activeTab') || 'dashboard';
        } catch (_e) {
          return 'dashboard';
        }
      })();
  const currentIndex = TAB_ORDER.indexOf(currentTab);
  if (currentIndex === -1) return;

  let targetIndex = currentIndex;
  if (direction === 'next') {
    targetIndex = currentIndex + 1;
  } else if (direction === 'prev') {
    targetIndex = currentIndex - 1;
  }

  if (targetIndex >= 0 && targetIndex < TAB_ORDER.length && targetIndex !== currentIndex) {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(10);
      } catch (_e) {}
    }
    activateTab(TAB_ORDER[targetIndex], true);
  }
}

window.switchToTab = (target) => {
  activateTab(target, true);
};

window.addEventListener('message', (e) => {
  if (e.source !== frame.contentWindow) return;
  if (e.data && e.data.action === 'switchToTab') {
    if (e.data.target) {
      activateTab(e.data.target, true);
    } else if (e.data.key) {
      const tabIndex = parseInt(e.data.key, 10) - 1;
      const btn = topNavButtons[tabIndex];
      if (btn) activateTab(btn.dataset.tab, true);
    }
  }
  if (e.data && e.data.action === 'shortcutKey') {
    const tabIndex = parseInt(e.data.key, 10) - 1;
    const btn = topNavButtons[tabIndex];
    if (btn) activateTab(btn.dataset.tab, true);
  }
  if (e.data && e.data.action === 'swipeTab' && e.data.direction) {
    handleSwipeTab(e.data.direction);
  }
});

// Mobile touch swipe listener on parent shell
(function initShellSwipe() {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let isIgnored = false;

  window.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches?.length !== 1) {
        isIgnored = true;
        return;
      }
      const target = e.target;
      if (target?.closest?.('#settingsModal, #onboardingModal, input, select, textarea')) {
        isIgnored = true;
        return;
      }
      isIgnored = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    },
    { passive: true },
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (isIgnored || !e.changedTouches?.length) return;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      const duration = Date.now() - startTime;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (duration <= 550 && absX >= 60 && absY <= 50 && absX / (absY + 1) >= 1.7) {
        handleSwipeTab(deltaX < 0 ? 'next' : 'prev');
      }
    },
    { passive: true },
  );
})();

// --- Command Palette & Omnisearch Engine ---
const COMMAND_PALETTE_ITEMS = [
  {
    id: 'nav-dashboard',
    type: 'tab',
    targetTab: 'dashboard',
    titleTh: '🏠 ภาพรวม & แดชบอร์ด (Financial Dashboard)',
    titleEn: '🏠 Financial Dashboard',
    descTh: 'สรุปความมั่งคั่งสุทธิ (Net Worth), อัตราการออม และแบบจำลอง Monte Carlo',
    descEn: 'Net worth overview, savings rate, and Monte Carlo simulator',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['dashboard', 'net worth', 'fire', 'monte carlo', 'ภาพรวม', 'ความมั่งคั่ง', 'เกษียณ'],
  },
  {
    id: 'nav-rebalance',
    type: 'tab',
    targetTab: 'rebalance',
    titleTh: '⚖️ ปรับพอร์ตลงทุน (Portfolio Rebalance)',
    titleEn: '⚖️ Portfolio Rebalance & DCA',
    descTh: 'ปรับสัดส่วนสินทรัพย์ คำนวณ Zero-Drift DCA และ Correlation Matrix',
    descEn: 'Target asset allocation, zero-drift DCA, and asset correlation matrix',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['rebalance', 'dca', 'portfolio', 'asset allocation', 'ปรับพอร์ต', 'ลงทุน'],
  },
  {
    id: 'nav-months-slips',
    type: 'tab',
    targetTab: 'months-slips',
    titleTh: '💵 สลิปเงินเดือนรายเดือน (Payslip & 50 Tawi)',
    titleEn: '💵 Monthly Payslip Simulator',
    descTh: 'จำลองสลิปรายได้ 12 เดือน ภาษีหัก ณ ที่จ่าย ปกส. และกระทบยอด 50 ทวิ',
    descEn: '12-month payslip forecasting, withholding tax, SSO, and 50 Tawi audit',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['payslip', 'salary', '50 tawi', 'sso', 'เงินเดือน', 'ภาษี', 'สลิป'],
  },
  {
    id: 'nav-tax-base',
    type: 'tab',
    targetTab: 'tax-calculator-base',
    titleTh: '🧾 ภาษีเงินได้บุคคลธรรมดา (Thai Personal Income Tax)',
    titleEn: '🧾 Thai Personal Income Tax (PIT)',
    descTh: 'คำนวณภาษี ภ.ง.ด.91/90 หักค่าลดหย่อน SSF/RMF/ThaiESG และเงินบริจาค',
    descEn: 'PIT computation, deduction planning (SSF, RMF, ThaiESG), step tax brackets',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['tax', 'pit', 'deductions', 'rmf', 'ssf', 'thaiesg', 'ภาษี', 'ลดหย่อน'],
  },
  {
    id: 'nav-tax-pvd',
    type: 'tab',
    targetTab: 'tax-calculator',
    titleTh: '📈 ภาษีเงินชดเชย & PVD (Severance & PVD Tax)',
    titleEn: '📈 Severance & PVD Retirement Tax',
    descTh: 'คำนวณภาษี ม.48(5) ใบแนบแยกยื่น และเปรียบเทียบโอนย้ายเข้า RMF',
    descEn: 'Section 48(5) tax schedule and PVD vs RMF rollover optimizer',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['pvd', 'severance', 'rmf', '48(5)', 'ชดเชย', 'เลิกจ้าง', 'กองทุนสำรองเลี้ยงชีพ'],
  },
  {
    id: 'nav-remaining-money',
    type: 'tab',
    targetTab: 'remaining-money',
    titleTh: '💰 เงินคงเหลือ & งบประมาณ (Remaining Money & Budget)',
    titleEn: '💰 Remaining Money & Budget Flow',
    descTh: 'วางแผนรายจ่ายประจำ จัดสรรเงินออมฉุกเฉิน และแผนภูมิกระแสเงิน Sankey',
    descEn: 'Monthly budgeting, emergency fund buffer, and interactive Sankey cashflow',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['remaining', 'budget', 'emergency fund', 'sankey', 'เงินคงเหลือ', 'งบประมาณ', 'ออม'],
  },
  {
    id: 'nav-debt',
    type: 'tab',
    targetTab: 'debt-calculator',
    titleTh: '📉 วางแผนปลดหนี้ (Debt Payoff & Prepayment)',
    titleEn: '📉 Debt Payoff & Prepayment',
    descTh: 'เปรียบเทียบ Snowball vs Avalanche แผนภาพไทม์ไลน์ และลดหย่อนดอกเบี้ยบ้าน',
    descEn: 'Snowball vs Avalanche comparison, payoff roadmap, and loan prepayment',
    categoryTh: 'เครื่องมือ',
    categoryEn: 'Tools',
    keywords: ['debt', 'snowball', 'avalanche', 'prepayment', 'mortgage', 'หนี้', 'ปลดหนี้', 'บ้าน'],
  },
  {
    id: 'feat-monte-carlo',
    type: 'tab',
    targetTab: 'dashboard',
    titleTh: '🎲 แบบจำลอง Monte Carlo เกษียณอายุ',
    titleEn: '🎲 Monte Carlo Retirement Longevity Simulator',
    descTh: 'จำลองสภาวะตลาด 1,000 รอบ คำนวณ Ruin Probability & Fan Chart',
    descEn: '1,000-run stochastic sequence-of-returns ruin probability and confidence fan chart',
    categoryTh: 'ฟีเจอร์เด่น',
    categoryEn: 'Features',
    keywords: ['monte carlo', 'ruin', 'retirement', 'simulation', 'fire', 'พอร์ตเกษียณ', 'ความเสี่ยง'],
  },
  {
    id: 'feat-pvd-rmf',
    type: 'tab',
    targetTab: 'tax-calculator',
    titleTh: '🔄 เปรียบเทียบโอน PVD ไปยัง RMF (Rollover)',
    titleEn: '🔄 PVD to RMF Rollover Strategy',
    descTh: 'วิเคราะห์ความคุ้มค่าระหว่างคงเงินไว้ใน PVD หรือโอนเข้า RMF เพื่อชะลอภาษี',
    descEn: 'Optimize tax deferral between keeping funds in PVD vs transferring to RMF',
    categoryTh: 'ฟีเจอร์เด่น',
    categoryEn: 'Features',
    keywords: ['rmf', 'rollover', 'pvd', 'โอน', 'ชะลอภาษี'],
  },
  {
    id: 'feat-sankey',
    type: 'tab',
    targetTab: 'remaining-money',
    titleTh: '🌊 แผนภูมิกระแสเงินสด (Sankey Diagram)',
    titleEn: '🌊 Cashflow Sankey Diagram',
    descTh: 'มองเห็นเส้นทางการไหลของเงินจากรายได้สู่งบรายจ่ายและเงินออม',
    descEn: 'Visual distribution flow from total income into fixed/variable costs and savings',
    categoryTh: 'ฟีเจอร์เด่น',
    categoryEn: 'Features',
    keywords: ['sankey', 'cashflow', 'กระแสเงินสด', 'แผนภูมิ'],
  },
  {
    id: 'feat-correlation',
    type: 'tab',
    targetTab: 'rebalance',
    titleTh: '📊 สหสัมพันธ์สินทรัพย์ (Correlation Matrix)',
    titleEn: '📊 Asset Correlation Matrix',
    descTh: 'ตรวจจับการกระจุกตัวของความเสี่ยงในพอร์ตการลงทุน',
    descEn: 'Cross-asset covariance and correlation heat matrix for risk diversification',
    categoryTh: 'ฟีเจอร์เด่น',
    categoryEn: 'Features',
    keywords: ['correlation', 'matrix', 'diversification', 'สหสัมพันธ์', 'ความเสี่ยง'],
  },
  {
    id: 'act-theme',
    type: 'action',
    action: () => {
      const current = getTheme();
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('moneySuperapp.theme', next);
      } catch (_e) {}
      applyTheme(next);
      reloadFrame();
    },
    titleTh: '🌓 สลับธีม (Toggle Light/Dark Theme)',
    titleEn: '🌓 Toggle Light/Dark Theme',
    descTh: 'สลับระหว่างโหมดสว่างและโหมดมืด',
    descEn: 'Toggle between light and dark UI themes',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['theme', 'dark', 'light', 'mode', 'ธีม', 'สว่าง', 'มืด'],
  },
  {
    id: 'act-lang',
    type: 'action',
    action: () => {
      const current = getLang();
      const next = current === 'th' ? 'en' : 'th';
      try {
        localStorage.setItem('moneySuperapp.lang', next);
      } catch (_e) {}
      applyLang(next);
      reloadFrame();
    },
    titleTh: '🌐 สลับภาษา (Switch Language TH / EN)',
    titleEn: '🌐 Switch Language (TH / EN)',
    descTh: 'เปลี่ยนภาษาระหว่าง ภาษาไทย และ English',
    descEn: 'Toggle language between Thai and English',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['language', 'english', 'thai', 'ภาษา', 'แปล'],
  },
  {
    id: 'act-vault',
    type: 'action',
    action: () => {
      openSettingsModal();
      setTimeout(() => {
        const btn = document.getElementById('lbl-btn-export-vault');
        if (btn) btn.click();
      }, 150);
    },
    titleTh: '🔐 ส่งออกคลังนิรภัยเข้ารหัส (Export Encrypted Vault)',
    titleEn: '🔐 Export Encrypted Vault (AES-GCM)',
    descTh: 'สำรองข้อมูลทั้งหมดด้วยการเข้ารหัส Client-Side AES-GCM 100% ปลอดภัย',
    descEn: 'Client-side AES-GCM encrypted backup of all application data',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['vault', 'export', 'encrypt', 'security', 'backup', 'ส่งออก', 'เข้ารหัส', 'สำรอง'],
  },
  {
    id: 'act-backup-json',
    type: 'action',
    action: () => {
      exportBackupData();
    },
    titleTh: '📤 ส่งออกข้อมูลสำรอง (Export JSON Backup)',
    titleEn: '📤 Export JSON Backup',
    descTh: 'ดาวน์โหลดไฟล์สำรองข้อมูล JSON สำหรับทุกเครื่องมือ',
    descEn: 'Download raw JSON backup file containing all local data',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['export', 'json', 'backup', 'ดาวน์โหลด', 'สำรอง'],
  },
  {
    id: 'act-storage-health',
    type: 'action',
    action: () => {
      openSettingsModal();
      setTimeout(() => {
        runStorageHealthCheck(true);
      }, 200);
    },
    titleTh: '🩺 ตรวจสุขภาพข้อมูล (Storage Health Inspector)',
    titleEn: '🩺 Inspect Storage Health',
    descTh: 'ตรวจสอบขนาด ความสมบูรณ์ และแก้ไขปัญหาข้อมูลค้างในเครื่อง',
    descEn: 'Check localStorage quota usage, corrupted keys, and data health',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['health', 'storage', 'diagnose', 'repair', 'ตรวจสุขภาพ', 'ซ่อมแซม'],
  },
  {
    id: 'act-onboarding',
    type: 'action',
    action: () => {
      openOnboardingModal();
    },
    titleTh: '❓ คู่มือการใช้งาน (Quick Tour & Guide)',
    titleEn: '❓ Quick Tour & User Guide',
    descTh: 'เปิดดูคู่มือขั้นตอนการใช้งาน 5 เครื่องมือหลักแบบกระชับ',
    descEn: 'Open interactive 5-step quick tour guide',
    categoryTh: 'คำสั่งด่วน',
    categoryEn: 'Actions',
    keywords: ['tour', 'guide', 'help', 'คู่มือ', 'วิธีใช้'],
  },
];

let paletteSelectedIndex = 0;
let paletteFilteredItems = [...COMMAND_PALETTE_ITEMS];

function openCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  const input = document.getElementById('cmdPaletteInput');
  if (!modal || !input) return;
  modal.style.display = 'flex';
  input.value = '';
  paletteSelectedIndex = 0;
  filterCommandPalette();
  setTimeout(() => {
    input.focus();
  }, 50);
}

function closeCommandPalette() {
  const modal = document.getElementById('cmdPaletteModal');
  if (modal) modal.style.display = 'none';
}

function filterCommandPalette() {
  const input = document.getElementById('cmdPaletteInput');
  const query = (input?.value || '').trim().toLowerCase();
  const lang = getLang();

  if (!query) {
    paletteFilteredItems = [...COMMAND_PALETTE_ITEMS];
  } else {
    paletteFilteredItems = COMMAND_PALETTE_ITEMS.filter((item) => {
      const title = (lang === 'en' ? item.titleEn : item.titleTh).toLowerCase();
      const desc = (lang === 'en' ? item.descEn : item.descTh).toLowerCase();
      const matchTitle = title.includes(query);
      const matchDesc = desc.includes(query);
      const matchKeyword = item.keywords.some((kw) => kw.toLowerCase().includes(query));
      return matchTitle || matchDesc || matchKeyword;
    });
  }

  if (paletteSelectedIndex >= paletteFilteredItems.length) {
    paletteSelectedIndex = Math.max(0, paletteFilteredItems.length - 1);
  }
  renderCommandPaletteResults();
}

function renderCommandPaletteResults() {
  const container = document.getElementById('cmdPaletteResults');
  if (!container) return;
  const lang = getLang();

  if (paletteFilteredItems.length === 0) {
    container.innerHTML = `
      <div style="padding:24px 16px; text-align:center; color:#94a3b8; font-size:13px;">
        ${lang === 'en' ? 'No matching commands or tools found' : 'ไม่พบคำสั่งหรือเครื่องมือที่ตรงกัน'}
      </div>
    `;
    return;
  }

  let html = '';
  paletteFilteredItems.forEach((item, idx) => {
    const isSelected = idx === paletteSelectedIndex;
    const title = lang === 'en' ? item.titleEn : item.titleTh;
    const desc = lang === 'en' ? item.descEn : item.descTh;
    const category = lang === 'en' ? item.categoryEn : item.categoryTh;
    const bgStyle = isSelected
      ? 'background:rgba(59, 130, 246, 0.18); border-color:#3b82f6;'
      : 'background:transparent; border-color:transparent;';

    html += `
      <div class="cmd-item" data-index="${idx}" onclick="executeCommand(${idx})"
           style="display:flex; justify-content:space-between; align-items:center; padding:9px 12px; margin-bottom:4px; border-radius:8px; border:1px solid; ${bgStyle} cursor:pointer; transition:all 0.12s ease;"
           onmouseenter="paletteSelectedIndex=${idx}; renderCommandPaletteResults();">
        <div style="display:flex; flex-direction:column; gap:2px; text-align:left; overflow:hidden;">
          <div style="font-size:13px; font-weight:600; color:${isSelected ? '#60a5fa' : '#f1f5f9'}; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">
            ${title}
          </div>
          <div style="font-size:11px; color:#94a3b8; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">
            ${desc}
          </div>
        </div>
        <div style="font-size:10px; color:#cbd5e1; background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; white-space:nowrap; margin-left:8px;">
          ${category}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  const activeEl = container.querySelector(`[data-index="${paletteSelectedIndex}"]`);
  if (activeEl) {
    activeEl.scrollIntoView({ block: 'nearest' });
  }
}

function handleCommandPaletteKey(e) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (paletteFilteredItems.length > 0) {
      paletteSelectedIndex = (paletteSelectedIndex + 1) % paletteFilteredItems.length;
      renderCommandPaletteResults();
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (paletteFilteredItems.length > 0) {
      paletteSelectedIndex = (paletteSelectedIndex - 1 + paletteFilteredItems.length) % paletteFilteredItems.length;
      renderCommandPaletteResults();
    }
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (paletteFilteredItems.length > 0 && paletteFilteredItems[paletteSelectedIndex]) {
      executeCommand(paletteSelectedIndex);
    }
  } else if (e.key === 'Escape') {
    e.preventDefault();
    closeCommandPalette();
  }
}

function executeCommand(index) {
  const item = paletteFilteredItems[index];
  if (!item) return;
  closeCommandPalette();

  if (item.type === 'tab') {
    activateTab(item.targetTab, true);
  } else if (item.type === 'action' && typeof item.action === 'function') {
    item.action();
  }
}

window.openCommandPalette = openCommandPalette;
window.closeCommandPalette = closeCommandPalette;
window.filterCommandPalette = filterCommandPalette;
window.handleCommandPaletteKey = handleCommandPaletteKey;
window.executeCommand = executeCommand;

// Global keyboard shortcuts: Alt+1..7 to switch tabs, Ctrl+K / Cmd+K for Command Palette
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const modal = document.getElementById('cmdPaletteModal');
    if (modal && modal.style.display === 'flex') {
      closeCommandPalette();
    } else {
      openCommandPalette();
    }
    return;
  }
  if (e.key === 'Escape') {
    const modal = document.getElementById('cmdPaletteModal');
    if (modal && modal.style.display === 'flex') {
      e.preventDefault();
      closeCommandPalette();
      return;
    }
  }
  if (e.altKey && e.key >= '1' && e.key <= '7') {
    e.preventDefault();
    const tabIndex = parseInt(e.key, 10) - 1;
    const btn = topNavButtons[tabIndex];
    if (btn) activateTab(btn.dataset.tab, true);
  }
});

allNavButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    activateTab(btn.dataset.tab, true);
  });
});

langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    try {
      localStorage.setItem('moneySuperapp.lang', lang);
    } catch (_e) {}
    applyLang(lang);
    reloadFrame();
  });
});

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.themeBtn;
    try {
      localStorage.setItem('moneySuperapp.theme', theme);
    } catch (_e) {}
    applyTheme(theme);
    reloadFrame();
  });
});

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash) activateTab(hash, false);
});

applyLang(getLang());
applyTheme(getTheme());

// Restore initial tab from URL hash or localStorage
const initialHash = window.location.hash.replace(/^#/, '');
const savedTab = (() => {
  try {
    return localStorage.getItem('moneySuperapp.activeTab');
  } catch (e) {
    return null;
  }
})();
activateTab(initialHash || savedTab || 'dashboard', false);

// Initialize App Lock and Session Privacy Guard
if (typeof initAppLockGuard === 'function') {
  initAppLockGuard();
}

// Check for first-time user onboarding
try {
  if (!localStorage.getItem('moneySuperapp.hasSeenOnboarding')) {
    setTimeout(openOnboardingModal, 350);
  }
} catch (_e) {}

// Phase 73: PWA Cache Update Toast Controls
let waitingServiceWorker = null;

function showPwaUpdateToast(worker) {
  waitingServiceWorker = worker;
  const toast = document.getElementById('pwaUpdateToast');
  if (toast) {
    toast.style.display = 'flex';
  }
}

function dismissPwaUpdateToast() {
  const toast = document.getElementById('pwaUpdateToast');
  if (toast) {
    toast.style.display = 'none';
  }
}

function applyPwaUpdate() {
  if (waitingServiceWorker) {
    try {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    } catch (_e) {}
  }
  setTimeout(() => {
    window.location.reload();
  }, 400);
}

window.showPwaUpdateToast = showPwaUpdateToast;
window.dismissPwaUpdateToast = dismissPwaUpdateToast;
window.applyPwaUpdate = applyPwaUpdate;

// --- Phase 80: PWA Web Share Target Inbound Consumer ---
async function checkIncomingShareTarget() {
  if (typeof window === 'undefined') return;
  const urlParams = new URLSearchParams(window.location.search);
  const isIncoming = urlParams.get('incoming_share') === '1';
  if (!isIncoming) return;

  try {
    const cleanUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
  } catch (_e) {}

  if (typeof caches === 'undefined') return;

  try {
    const cache = await caches.open('money-superapp-shared-payload');
    const cachedResp = await cache.match('./api/shared-target-payload');
    if (!cachedResp) return;

    const payload = await cachedResp.json();
    await cache.delete('./api/shared-target-payload');

    if (!payload?.content) return;

    const fileName = payload.name || 'shared_statement.csv';
    const content = payload.content;
    const isEn = getLang() === 'en';

    const validator =
      (typeof MoneyApp !== 'undefined' && MoneyApp.validateShareTargetPayload) || window.validateShareTargetPayload;
    const validation = validator
      ? validator(payload)
      : { isValid: true, kind: fileName.endsWith('.vault') ? 'vault' : 'statement' };

    if (validation.kind === 'vault' || validation.kind === 'backup') {
      const confirmMsg = isEn
        ? `📥 Received shared backup file: "${fileName}". Do you want to restore it now?`
        : `📥 ตรวจพบไฟล์สำรองข้อมูลที่แชร์เข้ามา: "${fileName}" ต้องการนำเข้าข้อมูลตอนนี้หรือไม่?`;
      if (confirm(confirmMsg)) {
        if (validation.kind === 'vault') {
          const pass = prompt(isEn ? 'Enter vault passphrase to decrypt:' : 'กรุณากรอกรหัสผ่านเพื่อถอดรหัสไฟล์ Vault:');
          if (pass) {
            try {
              const decryptFn =
                (typeof MoneyApp !== 'undefined' && MoneyApp.decryptVaultData) || window.decryptVaultData;
              if (!decryptFn) throw new Error('Decryption module not loaded');
              const decryptedStr = await decryptFn(content, pass);
              const backupObj = JSON.parse(decryptedStr);
              if (backupObj?.data) {
                const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
                Object.keys(backupObj.data).forEach((k) => {
                  if (allowedPrefixes.some((p) => k.startsWith(p)) && typeof backupObj.data[k] === 'string') {
                    localStorage.setItem(k, backupObj.data[k]);
                  }
                });
                alert(isEn ? '✓ Vault restored successfully!' : '✓ กู้คืนข้อมูลจาก Vault สำเร็จ!');
                if (typeof reloadFrame === 'function') reloadFrame();
                return;
              }
            } catch (err) {
              alert((isEn ? '❌ Decryption failed: ' : '❌ ถอดรหัสไม่สำเร็จ: ') + err.message);
              return;
            }
          }
        } else {
          try {
            const backupObj = JSON.parse(content);
            if (backupObj?.data) {
              const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
              Object.keys(backupObj.data).forEach((k) => {
                if (allowedPrefixes.some((p) => k.startsWith(p)) && typeof backupObj.data[k] === 'string') {
                  localStorage.setItem(k, backupObj.data[k]);
                }
              });
              alert(isEn ? '✓ Backup restored successfully!' : '✓ นำเข้าข้อมูลสำรองเรียบร้อยแล้ว!');
              if (typeof reloadFrame === 'function') reloadFrame();
              return;
            }
          } catch (err) {
            alert((isEn ? 'Invalid backup: ' : 'ข้อมูลสำรองไม่ถูกต้อง: ') + err.message);
            return;
          }
        }
      }
      return;
    }

    // Statement / CSV / TXT
    try {
      localStorage.setItem(
        'moneySuperapp.pendingBankStatement',
        JSON.stringify({
          fileName: fileName,
          csvText: content,
          timestamp: Date.now(),
        }),
      );
    } catch (_storageErr) {}

    // Navigate to remaining-money tool
    const navRemainingBtn = document.querySelector('[data-page="remaining-money"]');
    if (navRemainingBtn && typeof navigateTo === 'function') {
      navigateTo('remaining-money');
    } else {
      window.location.hash = 'remaining-money';
      const frame = document.getElementById('app');
      if (frame) frame.src = 'remaining-money.html';
    }
  } catch (err) {
    console.warn('Error processing incoming share target:', err);
  }
}

window.checkIncomingShareTarget = checkIncomingShareTarget;
checkIncomingShareTarget();

// Register Service Worker for PWA and offline access
if ('serviceWorker' in navigator) {
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        // 1. Check if there is already an installed worker waiting
        if (reg.waiting) {
          showPwaUpdateToast(reg.waiting);
        }

        // 2. Listen for future updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showPwaUpdateToast(newWorker);
            }
          });
        });

        reg.update();
        console.log('PWA ServiceWorker registered with scope: ', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA ServiceWorker registration failed: ', err);
      });
  });
}
