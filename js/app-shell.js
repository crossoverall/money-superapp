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
    const desktopBtn = document.querySelector('.top-nav button[data-tab="' + activeBtn.dataset.tab + '"]');
    const titleText = (desktopBtn && desktopBtn.dataset[lang]) || activeBtn.dataset[lang] || activeBtn.textContent;
    document.title = 'Money Superapp — ' + titleText;
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

  updateGoogleUI();
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
  } catch (e) {}
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
        } catch (e) {}
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
  } catch (e) {}
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
  } catch (e) {}
  // Trigger standard Google OAuth popup
  googleTokenClient.requestAccessToken({ prompt: '' });
}

function handleGoogleSignOut() {
  if (googleAccessToken && typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
    try {
      google.accounts.oauth2.revoke(googleAccessToken, () => {});
    } catch (e) {}
  }
  googleAccessToken = null;
  googleTokenExpiry = 0;
  try {
    sessionStorage.removeItem('moneySuperapp.googleToken');
    sessionStorage.removeItem('moneySuperapp.googleTokenExpiry');
    localStorage.removeItem('moneySuperapp.googleUser');
  } catch (e) {}
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

  if (user && user.email) {
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
    } catch (e) {}
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
  } catch (e) {}

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
      const schema = schemas && schemas[k];
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
  } catch (e) {}
}
window.openOnboardingModal = openOnboardingModal;
window.closeOnboardingModal = closeOnboardingModal;

function exportBackupData() {
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `money-superapp-backup-${d}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `money-superapp-${d}.superapp.vault`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(isEn ? '✓ Encrypted vault exported successfully!' : '✓ ส่งออกไฟล์เข้ารหัส (.vault) สำเร็จ!');
  } catch (err) {
    alert((isEn ? 'Encryption failed: ' : 'การเข้ารหัสผิดพลาด: ') + err.message);
  }
}

function handleImportFile(input) {
  if (!input.files || !input.files[0]) return;
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
      alert(isEn ? 'Error reading backup file: ' + err.message : 'เกิดข้อผิดพลาดในการอ่านไฟล์สำรอง: ' + err.message);
    }
  };
  reader.readAsText(file);
  input.value = '';
}

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
  const versionQuery = versionMeta ? '?v=' + encodeURIComponent(versionMeta) : '';
  const fullTargetSrc = targetSrc + versionQuery;

  if (frame.getAttribute('src') !== fullTargetSrc) {
    showSkeleton();
    frame.src = fullTargetSrc;
  }

  triggerHaptic(10);

  const lang = getLang();
  const desktopBtn = document.querySelector('.top-nav button[data-tab="' + activeTab + '"]');
  const titleText = (desktopBtn && desktopBtn.dataset[lang]) || target.dataset[lang] || activeTab;
  document.title = 'Money Superapp — ' + titleText;

  try {
    localStorage.setItem('moneySuperapp.activeTab', activeTab);
  } catch (e) {}
  if (updateHash && window.location.hash !== '#' + activeTab) {
    history.replaceState(null, '', '#' + activeTab);
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
    : (function () {
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

window.switchToTab = function (target) {
  activateTab(target, true);
};

window.addEventListener('message', (e) => {
  if (e.source !== frame.contentWindow) return;
  if (e.data && e.data.action === 'switchToTab') {
    if (e.data.target) {
      activateTab(e.data.target, true);
    } else if (e.data.key) {
      const tabIndex = parseInt(e.data.key) - 1;
      const btn = topNavButtons[tabIndex];
      if (btn) activateTab(btn.dataset.tab, true);
    }
  }
  if (e.data && e.data.action === 'shortcutKey') {
    const tabIndex = parseInt(e.data.key) - 1;
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

// Global keyboard shortcuts: Alt+1..7 to switch tabs
window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key >= '1' && e.key <= '7') {
    e.preventDefault();
    const tabIndex = parseInt(e.key) - 1;
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
    } catch (e) {}
    applyLang(lang);
    reloadFrame();
  });
});

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const theme = btn.dataset.themeBtn;
    try {
      localStorage.setItem('moneySuperapp.theme', theme);
    } catch (e) {}
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
const savedTab = (function () {
  try {
    return localStorage.getItem('moneySuperapp.activeTab');
  } catch (e) {
    return null;
  }
})();
activateTab(initialHash || savedTab || 'dashboard', false);

// Check for first-time user onboarding
try {
  if (!localStorage.getItem('moneySuperapp.hasSeenOnboarding')) {
    setTimeout(openOnboardingModal, 350);
  }
} catch (e) {}

// Register Service Worker for PWA and offline access
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    reloadFrame();
  });
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((reg) => {
        reg.update();
        console.log('PWA ServiceWorker registered with scope: ', reg.scope);
      })
      .catch((err) => {
        console.warn('PWA ServiceWorker registration failed: ', err);
      });
  });
}
