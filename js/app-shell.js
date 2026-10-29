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
    btnGdriveSync: '🔄 ตรวจสอบ & ซิงค์ข้อมูล',
    gdriveConflictTitle: 'จัดการการซิงค์ข้อมูล Google Drive',
    gdriveConflictDesc: 'พบข้อมูลสำรองใน Google Drive แตกต่างจากข้อมูลในเครื่องนี้ กรุณาเลือกวิธีจัดการข้อมูลที่ต้องการ:',
    gdriveLocalTitle: 'ข้อมูลในเครื่อง',
    gdriveCloudTitle: 'Google Drive',
    gdriveTimeLabel: 'บันทึกล่าสุด:',
    gdriveKeysLabel: 'ชุดข้อมูล:',
    gdriveDiffTitle: 'รายการความเปลี่ยนแปลงที่ตรวจพบ:',
    btnGdriveResolveMerge: '🔀 ผสานข้อมูลทั้งสอง (Smart Merge - แนะนำ)',
    btnGdriveResolveCloud: '📥 กู้คืนจาก Cloud',
    btnGdriveResolveLocal: '📤 แทนที่ด้วยเครื่องนี้',
    btnCancel: 'ยกเลิก',
    gdriveSyncedMsg: '✓ ข้อมูลในเครื่องตรงกับ Google Drive เรียบร้อยแล้ว',
    gdriveMergeSuccess: '✓ ผสานข้อมูลกับ Google Drive สำเร็จแล้ว!',
    gdriveNeverSynced: 'สำรองล่าสุด: ยังไม่เคยสำรอง',
    gdriveLastSync: (t) => `สำรองล่าสุด: ${t}`,
    gdriveAdvanced: '⚙️ การตั้งค่าขั้นสูง (Client ID)',
    btnSaveClientId: 'บันทึก',
    gdriveClientIdNote: 'ค่าเริ่มต้น: ผูกกับ https://crossoverall.github.io',
    helpBtn: 'คู่มือการใช้งาน (Quick Tour)',
    onboardingTitle: 'เริ่มต้นใช้งาน Money Superapp',
    onboardingSubtitle: 'คู่มือ 5 ขั้นตอนจัดระเบียบการเงินแบบครบวงจร ปลอดภัย 100% บนเครื่องของคุณ',
    archetypeSelectorTitle: 'เลือกแนวทางการเงินเริ่มต้นของคุณ:',
    archetypeSalariedTitle: '💼 พนักงานประจำ',
    archetypeSalariedDesc: 'สลิปเงินเดือน & ภาษี',
    archetypeFreelanceTitle: '🚀 ฟรีแลนซ์ / ธุรกิจ',
    archetypeFreelanceDesc: 'เงินคงเหลือ & กระแสเงินสด',
    archetypeInvestorTitle: '📈 นักลงทุน / ปลดหนี้',
    archetypeInvestorDesc: 'ปรับพอร์ต & แผนปลดหนี้',
    btnStartWithArchetype: (name) => `🚀 เริ่มต้นด้วยเส้นทาง${name}`,
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
    pwaInstallBtn: 'ติดตั้งแอป',
    pwaInstallTitle: 'ติดตั้ง Money Superapp ลงในอุปกรณ์',
    pwaOfflineReady: 'พร้อมใช้งานออฟไลน์',
    pwaOfflineMode: 'โหมดออฟไลน์',
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
    qrBtnSwitchCamera: '🔄 สลับกล้อง',
    qrBtnTorch: '💡 ไฟฉาย',
    qrBtnPickImage: '🖼️ เลือกรูปภาพ QR',
    qrImageDecodeError: '⚠️ ไม่พบ QR Code ในรูปภาพที่เลือก กรุณาลองใหม่อีกครั้ง',
    cacheQuotaTitle: 'โควต้าพื้นที่และแคชออฟไลน์ (Storage & Cache Quota)',
    cacheQuotaDesc: 'ตรวจสอบขนาดพื้นที่จัดเก็บในอุปกรณ์และสถานะแคชออฟไลน์ของระบบ',
    cacheVersionLabel: 'เวอร์ชันแคชที่ใช้งาน:',
    cacheUsageLabel: 'พื้นที่ใช้งาน / โควต้าทั้งหมด:',
    btnRefreshCache: '🔄 อัปเดตแคช',
    btnPurgeStale: '🧹 ล้างแคชเก่า',
    cacheStatusReady: 'พร้อมใช้งานออฟไลน์สมบูรณ์',
    cacheRefreshing: 'กำลังอัปเดตไฟล์แคช...',
    cacheRefreshed: 'อัปเดตแคชออฟไลน์เรียบร้อยแล้ว',
    cachePurged: 'ล้างแคชเก่าที่ตกค้างเรียบร้อยแล้ว',
    pullToRefreshText: '🔄 เลื่อนลงเพื่อซิงค์ข้อมูล (Pull to refresh)',
    pullToRefreshRelease: '🔄 ปล่อยเพื่อซิงค์ข้อมูล (Release to refresh)',
    pullToRefreshSyncing: '🔄 กำลังซิงค์ข้อมูล... (Syncing...)',
    profileMgrTitle: 'โปรไฟล์การเงิน & แยกข้อมูล',
    profileMgrDesc: 'แยกข้อมูลการเงินอย่างสมบูรณ์ระหว่าง ส่วนตัว, ครอบครัว, และธุรกิจฟรีแลนซ์',
    btnAddProfile: 'เพิ่มโปรไฟล์',
    createProfileHeader: 'สร้างโปรไฟล์ใหม่',
    btnCancelProfile: 'ยกเลิก',
    btnSaveProfile: 'บันทึก',
    profileSwitchSuccess: 'สลับไปยังโปรไฟล์ {name} เรียบร้อยแล้ว',
    profileClonedSuccess: 'คัดลอกโปรไฟล์ {name} เรียบร้อยแล้ว',
    profileDeletedSuccess: 'ลบโปรไฟล์เรียบร้อยแล้ว',
    profileDeleteConfirm: 'คุณแน่ใจหรือไม่ว่าต้องการลบโปรไฟล์ {name} และข้อมูลทั้งหมดในโปรไฟล์นี้?',
    profileDefaultBadge: 'ค่าเริ่มต้น',
    profileActiveBadge: 'ใช้งานอยู่',
    btnProfileSwitch: 'สลับใช้',
    btnProfileClone: 'คัดลอก',
    btnProfileDelete: 'ลบ',
    btnProfileExport: 'ส่งออก',
    profileItemKeys: 'รายการข้อมูล',
    profileManageBtn: '⚙️ จัดการโปรไฟล์',
    profileSwitcherTitle: 'โปรไฟล์การเงิน (Profile Switcher)',
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
    btnGdriveSync: '🔄 Check & Sync',
    gdriveConflictTitle: 'Google Drive Cloud Sync Resolution',
    gdriveConflictDesc:
      'Found differences between your Google Drive cloud backup and local device. Please choose how to proceed:',
    gdriveLocalTitle: 'Local Device',
    gdriveCloudTitle: 'Google Drive',
    gdriveTimeLabel: 'Last modified:',
    gdriveKeysLabel: 'Data sets:',
    gdriveDiffTitle: 'Detected Differences:',
    btnGdriveResolveMerge: '🔀 Merge Both (Smart Merge - Recommended)',
    btnGdriveResolveCloud: '📥 Use Cloud Backup',
    btnGdriveResolveLocal: '📤 Keep Local Data',
    btnCancel: 'Cancel',
    gdriveSyncedMsg: '✓ Local data is already in sync with Google Drive.',
    gdriveMergeSuccess: '✓ Successfully merged data with Google Drive!',
    gdriveNeverSynced: 'Last backup: Never',
    gdriveLastSync: (t) => `Last backup: ${t}`,
    gdriveAdvanced: '⚙️ Advanced Settings (Client ID)',
    btnSaveClientId: 'Save',
    gdriveClientIdNote: 'Default: Configured for https://crossoverall.github.io',
    helpBtn: 'Quick Tour & Guide',
    onboardingTitle: 'Welcome to Money Superapp',
    onboardingSubtitle: '5 Steps to Financial Freedom with 100% Client-Side Privacy',
    archetypeSelectorTitle: 'Choose your primary financial focus:',
    archetypeSalariedTitle: '💼 Salaried Employee',
    archetypeSalariedDesc: 'Payslips & Tax',
    archetypeFreelanceTitle: '🚀 Freelancer / Creator',
    archetypeFreelanceDesc: 'Cash Flow & Runway',
    archetypeInvestorTitle: '📈 Investor / Debt-Free',
    archetypeInvestorDesc: 'Rebalance & Debt',
    btnStartWithArchetype: (name) => `🚀 Start with ${name}`,
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
    pwaInstallBtn: 'Install App',
    pwaInstallTitle: 'Install Money Superapp to your device',
    pwaOfflineReady: 'Offline Ready',
    pwaOfflineMode: 'Offline Mode',
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
    qrBtnSwitchCamera: '🔄 Flip Camera',
    qrBtnTorch: '💡 Flashlight',
    qrBtnPickImage: '🖼️ Pick QR Image',
    qrImageDecodeError: '⚠️ No valid QR code detected in the selected image. Please try again.',
    cacheQuotaTitle: 'Storage Quota & Offline Cache',
    cacheQuotaDesc: 'Monitor device storage quota usage and offline cache health',
    cacheVersionLabel: 'Active Cache Version:',
    cacheUsageLabel: 'Used Storage / Total Quota:',
    btnRefreshCache: '🔄 Refresh Cache',
    btnPurgeStale: '🧹 Purge Stale Caches',
    cacheStatusReady: 'Offline cache ready',
    cacheRefreshing: 'Refreshing cache assets...',
    cacheRefreshed: 'Offline cache refreshed successfully',
    cachePurged: 'Stale caches purged successfully',
    pullToRefreshText: '🔄 Pull down to sync data',
    pullToRefreshRelease: '🔄 Release to refresh',
    pullToRefreshSyncing: '🔄 Syncing data...',
    profileMgrTitle: 'Multi-Profile & Data Partitioning',
    profileMgrDesc: 'Complete financial data isolation across Personal, Family, and Business domains',
    btnAddProfile: 'Add Profile',
    createProfileHeader: 'Create New Profile',
    btnCancelProfile: 'Cancel',
    btnSaveProfile: 'Save',
    profileSwitchSuccess: 'Switched to {name} profile successfully',
    profileClonedSuccess: 'Cloned profile {name} successfully',
    profileDeletedSuccess: 'Profile deleted successfully',
    profileDeleteConfirm: 'Are you sure you want to delete profile {name} and all its data?',
    profileDefaultBadge: 'Default',
    profileActiveBadge: 'Active',
    btnProfileSwitch: 'Switch',
    btnProfileClone: 'Clone',
    btnProfileDelete: 'Delete',
    btnProfileExport: 'Export',
    profileItemKeys: 'records',
    profileManageBtn: '⚙️ Manage Profiles',
    profileSwitcherTitle: 'Financial Profile Switcher',
  },
};

if (typeof window !== 'undefined' && window.MoneyApp?.I18n) {
  window.MoneyApp.I18n.register('th', translations.th);
  window.MoneyApp.I18n.register('en', translations.en);
}

let currentAppBadgeCount = 0;

function applyDocumentTitleWithBadge(baseTitle) {
  if (typeof document === 'undefined') return;
  const cleanTitle = (baseTitle || document.title || 'Money Superapp').replace(/^\(\d+\)\s*/, '');
  if (currentAppBadgeCount > 0) {
    document.title = `(${currentAppBadgeCount}) ${cleanTitle}`;
  } else {
    document.title = cleanTitle;
  }
}

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
    applyDocumentTitleWithBadge(`Money Superapp — ${titleText}`);
  }
  const t = translations[lang] || translations.th;
  if (typeof window !== 'undefined' && window.MoneyApp?.I18n) {
    window.MoneyApp.I18n.setLanguage(lang);
    window.MoneyApp.I18n.applyLocalization(document, lang);
  }
  if (document.getElementById('skipLink') && t.skipLink) document.getElementById('skipLink').textContent = t.skipLink;
  if (document.getElementById('btn-settings-modal')) {
    document.getElementById('btn-settings-modal').title =
      lang === 'en' ? 'Data & Backup Management' : 'จัดการข้อมูล & ความเป็นส่วนตัว';
  }
  if (document.getElementById('lbl-privacy-footer'))
    document.getElementById('lbl-privacy-footer').textContent = t.privacyFooter;
  if (document.getElementById('pullToRefreshText') && t.pullToRefreshText) {
    document.getElementById('pullToRefreshText').textContent = t.pullToRefreshText;
  }
  if (document.getElementById('lbl-modal-title')) document.getElementById('lbl-modal-title').textContent = t.modalTitle;
  const qrInput = document.getElementById('qrManualChunkInput');
  if (qrInput) {
    qrInput.placeholder =
      lang === 'en'
        ? 'Paste JSON slice chunk here (e.g. {"c":1,"t":3,"d":"..."})'
        : 'วางข้อมูลชิ้นส่วน JSON ที่นี่ (เช่น {"c":1,"t":3,"d":"..."})';
  }
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

  if (document.getElementById('lbl-cache-quota-title'))
    document.getElementById('lbl-cache-quota-title').textContent = t.cacheQuotaTitle;
  if (document.getElementById('lbl-cache-quota-desc'))
    document.getElementById('lbl-cache-quota-desc').textContent = t.cacheQuotaDesc;
  if (document.getElementById('lbl-btn-refresh-cache'))
    document.getElementById('lbl-btn-refresh-cache').textContent = t.btnRefreshCache;
  if (document.getElementById('lbl-btn-purge-stale'))
    document.getElementById('lbl-btn-purge-stale').textContent = t.btnPurgeStale;
  if (document.getElementById('lbl-cache-version-label'))
    document.getElementById('lbl-cache-version-label').textContent = t.cacheVersionLabel;
  if (document.getElementById('lbl-cache-usage-label'))
    document.getElementById('lbl-cache-usage-label').textContent = t.cacheUsageLabel;
  if (document.getElementById('lbl-cache-status-text') && !cacheOperationInProgress) {
    document.getElementById('lbl-cache-status-text').textContent = t.cacheStatusReady;
  }

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
  if (document.getElementById('lbl-btn-gdrive-sync'))
    document.getElementById('lbl-btn-gdrive-sync').textContent = t.btnGdriveSync;
  if (document.getElementById('lbl-btn-gdrive-resolve-merge'))
    document.getElementById('lbl-btn-gdrive-resolve-merge').textContent = t.btnGdriveResolveMerge;
  if (document.getElementById('lbl-btn-gdrive-resolve-cloud'))
    document.getElementById('lbl-btn-gdrive-resolve-cloud').textContent = t.btnGdriveResolveCloud;
  if (document.getElementById('lbl-btn-gdrive-resolve-local'))
    document.getElementById('lbl-btn-gdrive-resolve-local').textContent = t.btnGdriveResolveLocal;
  if (document.getElementById('lbl-btn-gdrive-resolve-cancel'))
    document.getElementById('lbl-btn-gdrive-resolve-cancel').textContent = t.btnCancel;
  if (document.getElementById('lbl-gdrive-local-title'))
    document.getElementById('lbl-gdrive-local-title').textContent = t.gdriveLocalTitle;
  if (document.getElementById('lbl-gdrive-cloud-title'))
    document.getElementById('lbl-gdrive-cloud-title').textContent = t.gdriveCloudTitle;
  if (document.getElementById('lbl-gdrive-diff-title'))
    document.getElementById('lbl-gdrive-diff-title').textContent = t.gdriveDiffTitle;
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
  if (document.getElementById('lbl-archetype-selector-title'))
    document.getElementById('lbl-archetype-selector-title').textContent = t.archetypeSelectorTitle;
  if (document.getElementById('lbl-archetype-salaried-title'))
    document.getElementById('lbl-archetype-salaried-title').textContent = t.archetypeSalariedTitle;
  if (document.getElementById('lbl-archetype-salaried-desc'))
    document.getElementById('lbl-archetype-salaried-desc').textContent = t.archetypeSalariedDesc;
  if (document.getElementById('lbl-archetype-freelance-title'))
    document.getElementById('lbl-archetype-freelance-title').textContent = t.archetypeFreelanceTitle;
  if (document.getElementById('lbl-archetype-freelance-desc'))
    document.getElementById('lbl-archetype-freelance-desc').textContent = t.archetypeFreelanceDesc;
  if (document.getElementById('lbl-archetype-investor-title'))
    document.getElementById('lbl-archetype-investor-title').textContent = t.archetypeInvestorTitle;
  if (document.getElementById('lbl-archetype-investor-desc'))
    document.getElementById('lbl-archetype-investor-desc').textContent = t.archetypeInvestorDesc;
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
  if (typeof updateOnboardingCtaLabel === 'function') {
    updateOnboardingCtaLabel();
  } else if (document.getElementById('lbl-btn-get-started')) {
    document.getElementById('lbl-btn-get-started').textContent = t.btnGetStarted;
  }
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
  if (document.getElementById('lbl-btn-qr-switch-camera'))
    document.getElementById('lbl-btn-qr-switch-camera').textContent = t.qrBtnSwitchCamera;
  if (document.getElementById('lbl-btn-qr-torch'))
    document.getElementById('lbl-btn-qr-torch').textContent = t.qrBtnTorch;
  if (document.getElementById('lbl-btn-qr-pick-image'))
    document.getElementById('lbl-btn-qr-pick-image').textContent = t.qrBtnPickImage;

  if (document.getElementById('lbl-pwa-install'))
    document.getElementById('lbl-pwa-install').textContent = t.pwaInstallBtn;
  if (document.getElementById('btn-pwa-install')) {
    document.getElementById('btn-pwa-install').title = t.pwaInstallTitle;
    document.getElementById('btn-pwa-install').setAttribute('aria-label', t.pwaInstallTitle);
  }
  if (typeof updateNetworkStatus === 'function') {
    updateNetworkStatus();
  }

  if (typeof updateQrImportUI === 'function') {
    updateQrImportUI();
  }
  if (typeof runStorageHealthCheck === 'function') {
    runStorageHealthCheck(false);
  }
  if (typeof updateProfileUI === 'function') {
    updateProfileUI(lang);
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

let pendingGdriveConflictState = null;

async function fetchGoogleDriveBackupFile(token) {
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
  return listData.files && listData.files.length > 0 ? listData.files[0] : null;
}

async function uploadGoogleDriveBackup(token, backupSnapshot, existingFileId = null) {
  const backupJson = JSON.stringify(backupSnapshot, null, 2);
  let saveRes;
  if (existingFileId) {
    saveRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`, {
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
  return saveRes;
}

async function downloadGoogleDriveBackup(token, fileId) {
  const getRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!getRes.ok) throw new Error(`Download failed (${getRes.status})`);
  return await getRes.json();
}

function openGdriveConflictModal(state) {
  pendingGdriveConflictState = state;
  const modal = document.getElementById('gdriveConflictModal');
  if (!modal) return;

  const lang = getLang();
  const GDrive = window.MoneyApp?.GoogleDrive;

  const localTimeEl = document.getElementById('gdrive-local-time');
  const localKeysEl = document.getElementById('gdrive-local-keys');
  const cloudTimeEl = document.getElementById('gdrive-cloud-time');
  const cloudKeysEl = document.getElementById('gdrive-cloud-keys');
  const diffSummaryEl = document.getElementById('gdrive-diff-summary');

  const localTime = state.localSnapshot?.exportedAt || localStorage.getItem('moneySuperapp.lastGoogleSync');
  const remoteTime = state.remoteSnapshot?.exportedAt || state.remoteFile?.modifiedTime;

  if (localTimeEl)
    localTimeEl.textContent = GDrive?.formatSyncTimestamp
      ? GDrive.formatSyncTimestamp(localTime, lang)
      : localTime || '-';
  if (localKeysEl)
    localKeysEl.textContent = `${state.comparison?.totalLocalKeys ?? Object.keys(state.localSnapshot?.data || {}).length} ${lang === 'en' ? 'items' : 'รายการ'}`;

  if (cloudTimeEl)
    cloudTimeEl.textContent = GDrive?.formatSyncTimestamp
      ? GDrive.formatSyncTimestamp(remoteTime, lang)
      : remoteTime || '-';
  if (cloudKeysEl)
    cloudKeysEl.textContent = `${state.comparison?.totalRemoteKeys ?? Object.keys(state.remoteSnapshot?.data || {}).length} ${lang === 'en' ? 'items' : 'รายการ'}`;

  if (diffSummaryEl) {
    const diffs = [];
    if (state.comparison?.modifiedKeys?.length > 0) {
      diffs.push(
        `• ${lang === 'en' ? 'Modified in both' : 'แก้ไขทั้งสองฝั่ง'}: ${state.comparison.modifiedKeys.length} ${lang === 'en' ? 'items' : 'รายการ'} (${state.comparison.modifiedKeys.slice(0, 3).join(', ')}${state.comparison.modifiedKeys.length > 3 ? '...' : ''})`,
      );
    }
    if (state.comparison?.localOnlyKeys?.length > 0) {
      diffs.push(
        `• ${lang === 'en' ? 'Local device only' : 'มีเฉพาะในเครื่องนี้'}: ${state.comparison.localOnlyKeys.length} ${lang === 'en' ? 'items' : 'รายการ'}`,
      );
    }
    if (state.comparison?.remoteOnlyKeys?.length > 0) {
      diffs.push(
        `• ${lang === 'en' ? 'Google Drive only' : 'มีเฉพาะบน Google Drive'}: ${state.comparison.remoteOnlyKeys.length} ${lang === 'en' ? 'items' : 'รายการ'}`,
      );
    }
    if (diffs.length === 0) {
      diffs.push(`• ${lang === 'en' ? 'Timestamp differences detected' : 'ตรวจพบเวลาแก้ไขต่างกัน'}`);
    }
    diffSummaryEl.innerHTML = diffs.map((d) => `<div style="margin-bottom:2px;">${d}</div>`).join('');
  }

  modal.style.display = 'flex';
  if (window.MoneyApp?.announce) {
    window.MoneyApp.announce(
      lang === 'en' ? 'Google Drive conflict dialog opened' : 'เปิดหน้าต่างจัดการข้อมูลซิงค์ Google Drive',
    );
  }
}

function closeGdriveConflictModal() {
  const modal = document.getElementById('gdriveConflictModal');
  if (modal) modal.style.display = 'none';
  pendingGdriveConflictState = null;
}

async function resolveGdriveConflict(strategy) {
  if (!pendingGdriveConflictState) return;
  const state = pendingGdriveConflictState;
  const lang = getLang();
  const GDrive = window.MoneyApp?.GoogleDrive;

  try {
    const mergedResult = GDrive?.mergeSnapshots
      ? GDrive.mergeSnapshots(state.localSnapshot, state.remoteSnapshot, strategy)
      : { strategy, data: strategy === 'local' ? state.localSnapshot.data : state.remoteSnapshot.data };

    if (strategy === 'cloud') {
      if (GDrive?.applySnapshot) {
        GDrive.applySnapshot(mergedResult.data, localStorage);
      } else {
        Object.keys(mergedResult.data).forEach((k) => {
          localStorage.setItem(k, mergedResult.data[k]);
        });
      }
      localStorage.setItem(
        'moneySuperapp.lastGoogleSync',
        state.remoteSnapshot?.exportedAt || new Date().toISOString(),
      );
      updateGoogleUI();
      closeGdriveConflictModal();
      alert(
        lang === 'en' ? '✓ Backup restored from Google Drive successfully!' : '✓ กู้คืนข้อมูลจาก Google Drive สำเร็จแล้ว!',
      );
      reloadFrame();
      closeSettingsModal();
    } else if (strategy === 'local') {
      await uploadGoogleDriveBackup(state.token, state.localSnapshot, state.remoteFile?.id);
      localStorage.setItem('moneySuperapp.lastGoogleSync', state.localSnapshot.exportedAt || new Date().toISOString());
      updateGoogleUI();
      closeGdriveConflictModal();
      alert(
        lang === 'en'
          ? '✓ Local backup saved to Google Drive successfully!'
          : '✓ สำรองข้อมูลจากเครื่องขึ้น Google Drive เรียบร้อยแล้ว!',
      );
    } else {
      // 'merge'
      if (GDrive?.applySnapshot) {
        GDrive.applySnapshot(mergedResult.data, localStorage);
      } else {
        Object.keys(mergedResult.data).forEach((k) => {
          localStorage.setItem(k, mergedResult.data[k]);
        });
      }
      const mergedSnapshot = {
        version: '1.1.0',
        appName: 'Money Superapp',
        exportedAt: mergedResult.exportedAt || new Date().toISOString(),
        data: mergedResult.data,
      };
      await uploadGoogleDriveBackup(state.token, mergedSnapshot, state.remoteFile?.id);
      localStorage.setItem('moneySuperapp.lastGoogleSync', mergedSnapshot.exportedAt);
      updateGoogleUI();
      closeGdriveConflictModal();
      alert(lang === 'en' ? '✓ Successfully merged data with Google Drive!' : '✓ ผสานข้อมูลกับ Google Drive สำเร็จแล้ว!');
      reloadFrame();
      closeSettingsModal();
    }
  } catch (err) {
    console.error('Google Drive Conflict Resolution Error:', err);
    alert((lang === 'en' ? 'Resolution failed: ' : 'จัดการข้อมูลไม่สำเร็จ: ') + err.message);
  }
}

async function saveToGoogleDrive() {
  const spinner = document.getElementById('gdrive-sync-spinner');
  const btnUpload = document.getElementById('btn-gdrive-upload');
  if (spinner) spinner.style.display = 'inline';
  if (btnUpload) btnUpload.disabled = true;

  try {
    const token = await ensureValidGoogleToken();
    if (!token) throw new Error('No Google token available');

    const GDrive = window.MoneyApp?.GoogleDrive;
    const localSnapshot = GDrive?.createSnapshot
      ? GDrive.createSnapshot(localStorage)
      : {
          version: '1.1.0',
          appName: 'Money Superapp',
          exportedAt: new Date().toISOString(),
          data: {},
        };

    if (!GDrive?.createSnapshot) {
      const allowedPrefixes = ['moneySuperapp.', 'remainingMoneyCalculator.', 'rebalanceCalculator.'];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && allowedPrefixes.some((p) => key.startsWith(p))) {
          localSnapshot.data[key] = localStorage.getItem(key);
        }
      }
    }

    const existingFile = await fetchGoogleDriveBackupFile(token);
    await uploadGoogleDriveBackup(token, localSnapshot, existingFile ? existingFile.id : null);

    const nowIso = localSnapshot.exportedAt || new Date().toISOString();
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

    const file = await fetchGoogleDriveBackupFile(token);
    if (!file) {
      alert(
        getLang() === 'en'
          ? 'No backup file found in your Google Drive AppData.'
          : 'ไม่พบไฟล์สำรองข้อมูลใน Google Drive AppData ของคุณ',
      );
      return;
    }

    const remoteBackup = await downloadGoogleDriveBackup(token, file.id);
    if (!remoteBackup || typeof remoteBackup !== 'object' || !remoteBackup.data) {
      alert(getLang() === 'en' ? 'Invalid backup data from Google Drive' : 'ข้อมูลสำรองจาก Google Drive ไม่ถูกต้อง');
      return;
    }

    const GDrive = window.MoneyApp?.GoogleDrive;
    const localSnapshot = GDrive?.createSnapshot
      ? GDrive.createSnapshot(localStorage)
      : {
          version: '1.1.0',
          appName: 'Money Superapp',
          exportedAt: new Date().toISOString(),
          data: {},
        };

    const comparison = GDrive?.compareSnapshots
      ? GDrive.compareSnapshots(localSnapshot, remoteBackup)
      : { isIdentical: false, status: 'conflict' };

    // If identical, inform user
    if (comparison.isIdentical) {
      alert(
        getLang() === 'en'
          ? '✓ Local data is already in sync with Google Drive.'
          : '✓ ข้อมูลในเครื่องตรงกับ Google Drive เรียบร้อยแล้ว',
      );
      return;
    }

    // Open Conflict Resolution Modal with side-by-side comparison
    openGdriveConflictModal({
      token,
      remoteFile: file,
      localSnapshot,
      remoteSnapshot: remoteBackup,
      comparison,
    });
  } catch (err) {
    console.error('Google Drive Restore Error:', err);
    alert((getLang() === 'en' ? 'Restore failed: ' : 'กู้คืนข้อมูลไม่สำเร็จ: ') + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
    if (btnDownload) btnDownload.disabled = false;
  }
}

async function syncWithGoogleDrive() {
  const spinner = document.getElementById('gdrive-sync-spinner');
  const btnSync = document.getElementById('btn-gdrive-sync');
  if (spinner) spinner.style.display = 'inline';
  if (btnSync) btnSync.disabled = true;

  try {
    const token = await ensureValidGoogleToken();
    if (!token) throw new Error('No Google token available');

    const file = await fetchGoogleDriveBackupFile(token);
    const GDrive = window.MoneyApp?.GoogleDrive;
    const localSnapshot = GDrive?.createSnapshot
      ? GDrive.createSnapshot(localStorage)
      : {
          version: '1.1.0',
          appName: 'Money Superapp',
          exportedAt: new Date().toISOString(),
          data: {},
        };

    if (!file) {
      const confirmUpload = confirm(
        getLang() === 'en'
          ? 'No existing backup found on Google Drive. Would you like to upload your local data now?'
          : 'ยังไม่มีไฟล์สำรองบน Google Drive ต้องการอัปโหลดข้อมูลในเครื่องนี้ขึ้นทันทีหรือไม่?',
      );
      if (confirmUpload) {
        await saveToGoogleDrive();
      }
      return;
    }

    const remoteBackup = await downloadGoogleDriveBackup(token, file.id);
    const comparison = GDrive?.compareSnapshots
      ? GDrive.compareSnapshots(localSnapshot, remoteBackup)
      : { isIdentical: false, status: 'conflict' };

    if (comparison.isIdentical) {
      alert(
        getLang() === 'en'
          ? '✓ Local data is completely in sync with Google Drive.'
          : '✓ ข้อมูลในเครื่องตรงกับ Google Drive เรียบร้อยแล้ว',
      );
      return;
    }

    openGdriveConflictModal({
      token,
      remoteFile: file,
      localSnapshot,
      remoteSnapshot: remoteBackup,
      comparison,
    });
  } catch (err) {
    console.error('Google Drive Sync Error:', err);
    alert((getLang() === 'en' ? 'Sync failed: ' : 'ซิงค์ข้อมูลไม่สำเร็จ: ') + err.message);
  } finally {
    if (spinner) spinner.style.display = 'none';
    if (btnSync) btnSync.disabled = false;
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
  'moneySuperapp.onboardingComplete': { label: 'สถานะจบคู่มือ (Onboarding Complete)', isJson: false, defaultVal: 'true' },
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

// Phase 112: Advanced Service Worker Cache Lifecycle & Storage Quota Management
let cacheOperationInProgress = false;

function formatStorageBytes(bytes) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) return '0 B';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const unitIndex = Math.min(Math.max(0, i), units.length - 1);
  const val = (bytes / k ** unitIndex).toFixed(unitIndex === 0 ? 0 : 1);
  return `${val} ${units[unitIndex]}`;
}

async function updateStorageQuotaDisplay() {
  const lang = typeof getLang === 'function' ? getLang() : 'th';
  const t = translations[lang] || translations.th;

  let usage = 0;
  let quota = 0;
  let percent = 0;

  // 1. Storage quota estimation via StorageManager API
  if (typeof navigator !== 'undefined' && navigator.storage && typeof navigator.storage.estimate === 'function') {
    try {
      const estimate = await navigator.storage.estimate();
      usage = typeof estimate.usage === 'number' ? estimate.usage : 0;
      quota = typeof estimate.quota === 'number' ? estimate.quota : 0;
      if (quota > 0) {
        percent = Math.min(100, Math.max(0, (usage / quota) * 100));
      }
    } catch (_err) {
      // Fallback
    }
  }

  // Update DOM readouts for quota
  const readoutEl = document.getElementById('lbl-cache-quota-readout');
  if (readoutEl) {
    const formattedUsage = formatStorageBytes(usage);
    const formattedQuota = formatStorageBytes(quota);
    const pctStr = percent.toFixed(1);
    readoutEl.textContent = `${formattedUsage} / ${formattedQuota} (${pctStr}%)`;
  }
  const barEl = document.getElementById('cache-quota-bar');
  if (barEl) {
    barEl.style.width = `${percent.toFixed(1)}%`;
  }

  // 2. Query Service Worker for active cache status & stale cache count
  let cacheStatus = null;
  if (typeof navigator !== 'undefined' && navigator.serviceWorker && navigator.serviceWorker.controller) {
    try {
      cacheStatus = await new Promise((resolve) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => resolve(null), 1500);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          resolve(event.data);
        };
        navigator.serviceWorker.controller.postMessage({ type: 'GET_CACHE_STATUS' }, [channel.port2]);
      });
    } catch (_err) {}
  }

  // Fallback to direct caches API if no SW controller response
  if (!cacheStatus && typeof window !== 'undefined' && window.caches && typeof window.caches.keys === 'function') {
    try {
      const metaVer = document.querySelector?.('meta[name="version"]')?.content;
      const defaultActive = metaVer ? `money-superapp-v${metaVer}` : 'money-superapp-v2.5.55';
      const keys = await window.caches.keys();
      const activeName = keys.find((k) => k.startsWith('money-superapp-v')) || defaultActive;
      const versionMatch = activeName.match(/v(\d+\.\d+\.\d+)/);
      const stale = keys.filter((k) => k !== activeName && k !== 'money-superapp-shared-payload');
      cacheStatus = {
        cacheName: activeName,
        version: versionMatch ? versionMatch[1] : metaVer || activeName,
        allCaches: keys,
        staleCaches: stale,
      };
    } catch (_err) {}
  }

  const versionBadge = document.getElementById('cache-version-badge');
  if (versionBadge && cacheStatus) {
    const metaVer = document.querySelector?.('meta[name="version"]')?.content;
    const defaultVer = metaVer ? `v${metaVer}` : 'v2.5.55';
    const vStr = cacheStatus.version
      ? cacheStatus.version.startsWith('v')
        ? cacheStatus.version
        : `v${cacheStatus.version}`
      : defaultVer;
    versionBadge.textContent = vStr;
  }

  const staleBadge = document.getElementById('cache-stale-badge');
  const staleCount = cacheStatus?.staleCaches?.length || 0;
  if (staleBadge) {
    if (staleCount > 0) {
      staleBadge.style.display = 'inline-block';
      staleBadge.textContent = `${staleCount} Stale`;
    } else {
      staleBadge.style.display = 'none';
    }
  }

  const statusText = document.getElementById('lbl-cache-status-text');
  if (statusText && !cacheOperationInProgress) {
    statusText.textContent = t.cacheStatusReady;
  }

  return {
    usage,
    quota,
    percent,
    version: cacheStatus?.version || '2.5.54',
    staleCount,
  };
}

async function refreshAppCache() {
  const lang = typeof getLang === 'function' ? getLang() : 'th';
  const t = translations[lang] || translations.th;
  const statusEl = document.getElementById('lbl-cache-status-text');
  const btn = document.getElementById('btn-refresh-cache');

  cacheOperationInProgress = true;
  if (statusEl) statusEl.textContent = t.cacheRefreshing;
  if (btn) btn.disabled = true;

  try {
    // 1. SW message contract
    if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
      try {
        await new Promise((resolve) => {
          const channel = new MessageChannel();
          const timer = setTimeout(() => resolve(null), 3000);
          channel.port1.onmessage = (event) => {
            clearTimeout(timer);
            resolve(event.data);
          };
          navigator.serviceWorker.controller.postMessage({ type: 'REFRESH_CACHE' }, [channel.port2]);
        });
      } catch (_e) {}
    }

    // 2. SW registration update
    if (typeof navigator !== 'undefined' && navigator.serviceWorker?.getRegistration) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.update();
      }
    }

    await updateStorageQuotaDisplay();
    if (statusEl) statusEl.textContent = t.cacheRefreshed;
    setTimeout(() => {
      cacheOperationInProgress = false;
      if (statusEl) statusEl.textContent = t.cacheStatusReady;
    }, 2500);

    return { success: true };
  } catch (err) {
    cacheOperationInProgress = false;
    if (statusEl) statusEl.textContent = t.cacheStatusReady;
    return { success: false, error: err.message };
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function purgeStaleCaches() {
  const lang = typeof getLang === 'function' ? getLang() : 'th';
  const t = translations[lang] || translations.th;
  const statusEl = document.getElementById('lbl-cache-status-text');
  const btn = document.getElementById('btn-purge-stale');

  cacheOperationInProgress = true;
  if (btn) btn.disabled = true;

  try {
    let purgedCount = 0;
    // 1. Send PURGE_STALE_CACHES to SW controller
    if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
      try {
        const result = await new Promise((resolve) => {
          const channel = new MessageChannel();
          const timer = setTimeout(() => resolve(null), 3000);
          channel.port1.onmessage = (event) => {
            clearTimeout(timer);
            resolve(event.data);
          };
          navigator.serviceWorker.controller.postMessage({ type: 'PURGE_STALE_CACHES' }, [channel.port2]);
        });
        if (result?.purgedCaches) {
          purgedCount = result.purgedCaches.length;
        }
      } catch (_e) {}
    } else if (typeof window !== 'undefined' && window.caches && typeof window.caches.keys === 'function') {
      // Direct caches API fallback
      const keys = await window.caches.keys();
      const activeName = keys.find((k) => k.startsWith('money-superapp-v')) || '';
      for (const key of keys) {
        if (key !== activeName && key !== 'money-superapp-shared-payload') {
          try {
            const deleted = await window.caches.delete(key);
            if (deleted) purgedCount++;
          } catch (_e) {}
        }
      }
    }

    await updateStorageQuotaDisplay();
    if (statusEl) statusEl.textContent = t.cachePurged;
    setTimeout(() => {
      cacheOperationInProgress = false;
      if (statusEl) statusEl.textContent = t.cacheStatusReady;
    }, 2500);

    return { success: true, purgedCount };
  } catch (err) {
    cacheOperationInProgress = false;
    if (statusEl) statusEl.textContent = t.cacheStatusReady;
    return { success: false, error: err.message };
  } finally {
    if (btn) btn.disabled = false;
  }
}

if (typeof window !== 'undefined') {
  window.formatStorageBytes = formatStorageBytes;
  window.updateStorageQuotaDisplay = updateStorageQuotaDisplay;
  window.refreshAppCache = refreshAppCache;
  window.purgeStaleCaches = purgeStaleCaches;

  window.saveToGoogleDrive = saveToGoogleDrive;
  window.restoreFromGoogleDrive = restoreFromGoogleDrive;
  window.syncWithGoogleDrive = syncWithGoogleDrive;
  window.openGdriveConflictModal = openGdriveConflictModal;
  window.closeGdriveConflictModal = closeGdriveConflictModal;
  window.resolveGdriveConflict = resolveGdriveConflict;

  window.MoneyApp = window.MoneyApp || {};
  window.MoneyApp.formatStorageBytes = formatStorageBytes;
  window.MoneyApp.updateStorageQuotaDisplay = updateStorageQuotaDisplay;
  window.MoneyApp.refreshAppCache = refreshAppCache;
  window.MoneyApp.purgeStaleCaches = purgeStaleCaches;

  window.MoneyApp.GoogleDrive = window.MoneyApp.GoogleDrive || {};
  window.MoneyApp.GoogleDrive.save = saveToGoogleDrive;
  window.MoneyApp.GoogleDrive.restore = restoreFromGoogleDrive;
  window.MoneyApp.GoogleDrive.sync = syncWithGoogleDrive;
  window.MoneyApp.GoogleDrive.openConflictModal = openGdriveConflictModal;
  window.MoneyApp.GoogleDrive.closeConflictModal = closeGdriveConflictModal;
  window.MoneyApp.GoogleDrive.resolveConflict = resolveGdriveConflict;
}

// Phase 139: Multi-Profile & Partition UI Controller
function getPartitionEngine() {
  return (
    window.MoneyApp?.ProfilePartition ||
    (typeof globalThis !== 'undefined' ? globalThis.MoneyApp?.ProfilePartition : null)
  );
}

function updateProfileUI(currentLang) {
  const partition = getPartitionEngine();
  if (!partition) return;

  const lang = currentLang || getLang();
  const t = translations[lang] || translations.th;

  try {
    const { activeProfile, profiles } = partition.initProfiles();

    // Topbar Icon and Label
    const iconEl = document.getElementById('activeProfileIcon');
    if (iconEl) iconEl.textContent = activeProfile.icon || '👤';

    const nameEl = document.getElementById('activeProfileName');
    if (nameEl) {
      nameEl.textContent = lang === 'th' ? activeProfile.nameTh || activeProfile.name : activeProfile.name;
    }

    const switcherBtn = document.getElementById('btn-profile-switcher');
    if (switcherBtn) {
      switcherBtn.title = t.profileSwitcherTitle || 'Financial Profile Switcher';
      switcherBtn.setAttribute('aria-label', `${t.profileSwitcherTitle || 'Profile'}: ${activeProfile.name}`);
    }

    // Topbar Dropdown Menu
    const dropdownMenu = document.getElementById('profileDropdownMenu');
    if (dropdownMenu) {
      let html = '';
      for (const p of profiles) {
        const isActive = p.id === activeProfile.id;
        const displayName = lang === 'th' ? p.nameTh || p.name : p.name;
        html += `
          <button class="profile-menu-item ${isActive ? 'active' : ''}" onclick="switchAppProfile('${p.id}')" role="menuitem">
            <span class="profile-item-meta">
              <span>${p.icon || '📁'}</span>
              <span>${displayName}</span>
            </span>
            ${isActive ? '<span style="font-size:12px; font-weight:700;">✓</span>' : ''}
          </button>
        `;
      }
      html += `
        <div class="profile-menu-divider"></div>
        <button class="profile-menu-item" onclick="openProfileManagerFromDropdown()" role="menuitem">
          <span class="profile-item-meta">
            <span>⚙️</span>
            <span>${t.profileManageBtn || 'Manage Profiles'}</span>
          </span>
        </button>
      `;
      dropdownMenu.innerHTML = html;
    }

    // Update Settings Modal list if visible
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal && settingsModal.style.display !== 'none') {
      updateProfileSettingsUI(lang);
    }
  } catch (_e) {}
}

function toggleProfileMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('profileDropdownMenu');
  const btn = document.getElementById('btn-profile-switcher');
  if (!menu) return;

  const isHidden = menu.style.display === 'none' || !menu.style.display;
  if (isHidden) {
    updateProfileUI();
    menu.style.display = 'flex';
    if (btn) btn.setAttribute('aria-expanded', 'true');
  } else {
    menu.style.display = 'none';
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

function openProfileManagerFromDropdown() {
  const menu = document.getElementById('profileDropdownMenu');
  if (menu) menu.style.display = 'none';
  const btn = document.getElementById('btn-profile-switcher');
  if (btn) btn.setAttribute('aria-expanded', 'false');

  openSettingsModal();
  const card = document.getElementById('profileManagerCard');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function updateProfileSettingsUI(currentLang) {
  const partition = getPartitionEngine();
  const container = document.getElementById('profileListContainer');
  if (!partition || !container) return;

  const lang = currentLang || getLang();
  const t = translations[lang] || translations.th;
  const profiles = partition.listProfiles();
  const activeProfile = partition.getActiveProfile();

  let html = '';
  for (const p of profiles) {
    const isActive = p.id === activeProfile.id;
    const displayName = lang === 'th' ? p.nameTh || p.name : p.name;
    const desc = lang === 'th' ? p.descriptionTh || p.description || '' : p.description || '';
    const metrics = partition.getProfileMetrics(p.id);

    html += `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid ${isActive ? 'var(--core, #2F8B76)' : '#24352C'}; border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px; line-height: 1;">${p.icon || '📁'}</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #EAF2EE; display: flex; align-items: center; gap: 6px;">
                <span>${displayName}</span>
                ${p.isDefault ? `<span style="font-size: 10px; padding: 1px 6px; border-radius: 999px; background: rgba(255,255,255,0.08); color: #8FA69C;">${t.profileDefaultBadge || 'Default'}</span>` : ''}
                ${isActive ? `<span style="font-size: 10px; padding: 1px 6px; border-radius: 999px; background: rgba(47, 139, 118, 0.25); color: #4FA894; font-weight: 700;">${t.profileActiveBadge || 'Active'}</span>` : ''}
              </div>
              <div style="font-size: 11px; color: #8FA69C; margin-top: 1px;">
                ${desc ? `<span>${desc} • </span>` : ''}<span>${metrics.keyCount} ${t.profileItemKeys || 'records'} (${metrics.formattedSize})</span>
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 4px; align-items: center;">
            ${
              !isActive
                ? `
              <button onclick="switchAppProfile('${p.id}')" style="background: var(--core, #2F8B76); color: #fff; border: none; padding: 4px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; cursor: pointer;">
                ${t.btnProfileSwitch || 'Switch'}
              </button>
            `
                : ''
            }
            <button onclick="cloneAppProfile('${p.id}')" title="${t.btnProfileClone || 'Clone'}" style="background: none; border: 1px solid #24352C; color: #8FA69C; padding: 4px 8px; border-radius: 5px; font-size: 11px; cursor: pointer;">
              ${t.btnProfileClone || 'Clone'}
            </button>
            ${
              !p.isDefault && !isActive
                ? `
              <button onclick="deleteAppProfile('${p.id}')" title="${t.btnProfileDelete || 'Delete'}" style="background: none; border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; padding: 4px 7px; border-radius: 5px; font-size: 11px; cursor: pointer;">
                ${t.btnProfileDelete || 'Delete'}
              </button>
            `
                : ''
            }
          </div>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function switchAppProfile(profileId) {
  const partition = getPartitionEngine();
  if (!partition) return;

  const lang = getLang();
  const t = translations[lang] || translations.th;

  try {
    partition.switchProfile(profileId);
    const target = partition.getProfileById(profileId);
    const name = target ? (lang === 'th' ? target.nameTh || target.name : target.name) : profileId;

    // Close menu
    const menu = document.getElementById('profileDropdownMenu');
    if (menu) menu.style.display = 'none';
    const btn = document.getElementById('btn-profile-switcher');
    if (btn) btn.setAttribute('aria-expanded', 'false');

    updateProfileUI(lang);

    const msg = (t.profileSwitchSuccess || 'Switched profile to {name}').replace('{name}', name);
    if (typeof MoneyApp !== 'undefined' && MoneyApp.announce) {
      MoneyApp.announce(msg);
    }

    // Reload active child tool iframe to reflect newly activated partition
    const appFrame = document.getElementById('app');
    if (appFrame?.contentWindow) {
      try {
        appFrame.contentWindow.location.reload();
      } catch (_e) {
        const curSrc = appFrame.getAttribute('src');
        if (curSrc) appFrame.setAttribute('src', curSrc);
      }
    }
  } catch (err) {
    alert(err.message);
  }
}

function toggleNewProfileForm() {
  const form = document.getElementById('newProfileFormContainer');
  if (!form) return;
  const isHidden = form.style.display === 'none' || !form.style.display;
  form.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    const input = document.getElementById('newProfileName');
    if (input) {
      input.value = '';
      input.focus();
    }
  }
}

function handleCreateProfileSubmit() {
  const partition = getPartitionEngine();
  if (!partition) return;

  const nameInput = document.getElementById('newProfileName');
  const iconInput = document.getElementById('newProfileIcon');
  const name = nameInput ? nameInput.value.trim() : '';
  const icon = iconInput ? iconInput.value : '📁';

  if (!name) {
    if (nameInput) nameInput.focus();
    return;
  }

  try {
    partition.createProfile({
      name,
      nameTh: name,
      icon,
      type: 'custom',
    });
    toggleNewProfileForm();
    updateProfileUI();
  } catch (err) {
    alert(err.message);
  }
}

function cloneAppProfile(sourceProfileId) {
  const partition = getPartitionEngine();
  if (!partition) return;

  const lang = getLang();
  const t = translations[lang] || translations.th;
  const source = partition.getProfileById(sourceProfileId);
  if (!source) return;

  try {
    const cloned = partition.cloneProfile(sourceProfileId, {
      name: `${source.name} (Copy)`,
      nameTh: `${source.nameTh || source.name} (สำเนา)`,
    });
    updateProfileUI(lang);
    const msg = (t.profileClonedSuccess || 'Cloned profile {name}').replace('{name}', cloned.name);
    if (typeof MoneyApp !== 'undefined' && MoneyApp.announce) {
      MoneyApp.announce(msg);
    }
  } catch (err) {
    alert(err.message);
  }
}

function deleteAppProfile(profileId) {
  const partition = getPartitionEngine();
  if (!partition) return;

  const lang = getLang();
  const t = translations[lang] || translations.th;
  const target = partition.getProfileById(profileId);
  if (!target) return;

  const displayName = lang === 'th' ? target.nameTh || target.name : target.name;
  const confirmMsg = (t.profileDeleteConfirm || 'Delete profile {name}?').replace('{name}', displayName);

  if (typeof window !== 'undefined' && window.confirm && !window.confirm(confirmMsg)) {
    return;
  }

  try {
    partition.deleteProfile(profileId);
    updateProfileUI(lang);
    const msg = t.profileDeletedSuccess || 'Profile deleted successfully';
    if (typeof MoneyApp !== 'undefined' && MoneyApp.announce) {
      MoneyApp.announce(msg);
    }
  } catch (err) {
    alert(err.message);
  }
}

if (typeof window !== 'undefined') {
  window.toggleProfileMenu = toggleProfileMenu;
  window.updateProfileUI = updateProfileUI;
  window.updateProfileSettingsUI = updateProfileSettingsUI;
  window.switchAppProfile = switchAppProfile;
  window.toggleNewProfileForm = toggleNewProfileForm;
  window.handleCreateProfileSubmit = handleCreateProfileSubmit;
  window.cloneAppProfile = cloneAppProfile;
  window.deleteAppProfile = deleteAppProfile;
  window.openProfileManagerFromDropdown = openProfileManagerFromDropdown;

  document.addEventListener('click', (e) => {
    const container = document.getElementById('profileSwitcherContainer');
    const menu = document.getElementById('profileDropdownMenu');
    if (menu && container && !container.contains(e.target)) {
      menu.style.display = 'none';
      const btn = document.getElementById('btn-profile-switcher');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  });
}

function openSettingsModal() {
  updateGoogleUI();
  if (typeof updateAppLockSettingsUI === 'function') updateAppLockSettingsUI();
  if (typeof updateProfileSettingsUI === 'function') updateProfileSettingsUI();
  runStorageHealthCheck(false);
  if (typeof updateStorageQuotaDisplay === 'function') updateStorageQuotaDisplay();
  document.getElementById('settingsModal').style.display = 'flex';
}
function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

let currentOnboardingArchetype = 'salaried';
let currentOnboardingTargetTab = 'months-slips';

const ARCHETYPE_CONFIG = {
  salaried: {
    btnId: 'btn-archetype-salaried',
    titleId: 'lbl-archetype-salaried-title',
    stepId: 'onboarding-step-1',
    targetTab: 'months-slips',
    names: { th: 'พนักงานประจำ', en: 'Salaried Employee' },
  },
  freelance: {
    btnId: 'btn-archetype-freelance',
    titleId: 'lbl-archetype-freelance-title',
    stepId: 'onboarding-step-2',
    targetTab: 'remaining-money',
    names: { th: 'ฟรีแลนซ์ / ธุรกิจ', en: 'Freelancer / Creator' },
  },
  investor: {
    btnId: 'btn-archetype-investor',
    titleId: 'lbl-archetype-investor-title',
    stepId: 'onboarding-step-3',
    targetTab: 'rebalance',
    names: { th: 'นักลงทุน / ปลดหนี้', en: 'Investor / Debt-Free' },
  },
};

function updateOnboardingCtaLabel() {
  const ctaLabel = document.getElementById('lbl-btn-get-started');
  if (!ctaLabel) return;
  const cfg = ARCHETYPE_CONFIG[currentOnboardingArchetype] || ARCHETYPE_CONFIG.salaried;
  const lang = typeof getLang === 'function' ? getLang() : typeof currentLang !== 'undefined' ? currentLang : 'th';
  const t = typeof translations !== 'undefined' ? translations[lang] : null;
  const archName = cfg.names?.[lang] || cfg.names.th;
  if (t && typeof t.btnStartWithArchetype === 'function') {
    ctaLabel.textContent = t.btnStartWithArchetype(archName);
  } else {
    ctaLabel.textContent = lang === 'en' ? `🚀 Start with ${archName}` : `🚀 เริ่มต้นด้วยเส้นทาง${archName}`;
  }
}

function selectOnboardingArchetype(type, announce = true) {
  const archetype = ARCHETYPE_CONFIG[type] ? type : 'salaried';
  currentOnboardingArchetype = archetype;
  const activeCfg = ARCHETYPE_CONFIG[archetype];
  currentOnboardingTargetTab = activeCfg.targetTab;

  // 1. Update button styling & aria-selected
  Object.keys(ARCHETYPE_CONFIG).forEach((k) => {
    const cfg = ARCHETYPE_CONFIG[k];
    const btn = document.getElementById(cfg.btnId);
    const titleEl = document.getElementById(cfg.titleId);
    if (!btn) return;
    const isSelected = k === archetype;
    btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    if (isSelected) {
      btn.style.background = 'rgba(47, 139, 118, 0.15)';
      btn.style.borderColor = '#2F8B76';
      if (titleEl) titleEl.style.color = '#4FA894';
    } else {
      btn.style.background = '#0E1512';
      btn.style.borderColor = '#24352C';
      if (titleEl) titleEl.style.color = '#EAF2EE';
    }
  });

  // 2. Highlight recommended step card in workflow list
  const stepIds = [
    'onboarding-step-1',
    'onboarding-step-2',
    'onboarding-step-3',
    'onboarding-step-4',
    'onboarding-step-5',
  ];
  stepIds.forEach((id) => {
    const card = document.getElementById(id);
    if (!card) return;
    if (id === activeCfg.stepId) {
      card.style.background = 'rgba(47, 139, 118, 0.1)';
      card.style.borderColor = '#2F8B76';
    } else {
      card.style.background = '#0E1512';
      card.style.borderColor = '#24352C';
    }
  });

  // 3. Update primary CTA button text
  updateOnboardingCtaLabel();

  // 4. Announce via MoneyApp.announce
  if (announce) {
    const lang = typeof getLang === 'function' ? getLang() : typeof currentLang !== 'undefined' ? currentLang : 'th';
    const archName = activeCfg.names?.[lang] || activeCfg.names.th;
    const announceMsg = lang === 'en' ? `Selected focus: ${archName}` : `เลือกแนวทางการเงิน: ${archName}`;
    const announcer =
      typeof MoneyApp !== 'undefined' && typeof MoneyApp.announce === 'function'
        ? MoneyApp.announce
        : typeof window !== 'undefined' && window.MoneyApp && typeof window.MoneyApp.announce === 'function'
          ? window.MoneyApp.announce
          : null;
    if (announcer) {
      announcer(announceMsg);
    }
  }
}

function startOnboardingWithArchetype() {
  const targetTab = currentOnboardingTargetTab || 'months-slips';
  closeOnboardingModal();
  if (typeof activateTab === 'function') {
    activateTab(targetTab);
  }
}

function openOnboardingModal() {
  const modal = document.getElementById('onboardingModal');
  if (modal) modal.style.display = 'flex';
  selectOnboardingArchetype(currentOnboardingArchetype || 'salaried', false);
}
function closeOnboardingModal() {
  const modal = document.getElementById('onboardingModal');
  if (modal) modal.style.display = 'none';
  try {
    localStorage.setItem('moneySuperapp.hasSeenOnboarding', 'true');
    localStorage.setItem('moneySuperapp.onboardingComplete', 'true');
  } catch (_e) {}
}
window.openOnboardingModal = openOnboardingModal;
window.closeOnboardingModal = closeOnboardingModal;
window.selectOnboardingArchetype = selectOnboardingArchetype;
window.startOnboardingWithArchetype = startOnboardingWithArchetype;
window.updateOnboardingCtaLabel = updateOnboardingCtaLabel;

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

let qrCameraFacing = 'environment';
let qrTorchEnabled = false;

async function initQrCamera() {
  const video = document.getElementById('qrScanVideo');
  const fallback = document.getElementById('qrCameraFallbackNotice');
  const btnSwitch = document.getElementById('btn-qr-switch-camera');
  const btnTorch = document.getElementById('btn-qr-torch');

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
  qrTorchEnabled = false;
  if (btnTorch) {
    btnTorch.style.background = '#1e293b';
    btnTorch.style.color = '#e2e8f0';
  }

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
        video: { facingMode: qrCameraFacing },
      });
      qrScanStream = stream;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      if (btnSwitch) btnSwitch.style.display = 'inline-block';

      const track = stream.getVideoTracks()[0];
      const caps = track?.getCapabilities ? track.getCapabilities() : null;
      if (btnTorch) {
        btnTorch.style.display = caps?.torch ? 'inline-block' : 'none';
      }

      startBarcodeScannerLoop(video);
    } catch (_err) {
      if (fallback) fallback.style.display = 'block';
      if (video) video.style.display = 'none';
      if (btnSwitch) btnSwitch.style.display = 'none';
      if (btnTorch) btnTorch.style.display = 'none';
    }
  } else {
    if (fallback) fallback.style.display = 'block';
    if (video) video.style.display = 'none';
    if (btnSwitch) btnSwitch.style.display = 'none';
    if (btnTorch) btnTorch.style.display = 'none';
  }
}

async function openQrImportModal() {
  qrImportedChunks = {};
  qrImportExpectedTotal = 0;
  qrImportSessionId = null;
  updateQrImportUI();

  const modal = document.getElementById('qrImportModal');
  if (modal) modal.style.display = 'flex';

  await initQrCamera();
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
  qrTorchEnabled = false;
  const btnTorch = document.getElementById('btn-qr-torch');
  if (btnTorch) {
    btnTorch.style.display = 'none';
    btnTorch.style.background = '#1e293b';
    btnTorch.style.color = '#e2e8f0';
  }
  const btnSwitch = document.getElementById('btn-qr-switch-camera');
  if (btnSwitch) btnSwitch.style.display = 'none';

  const modal = document.getElementById('qrImportModal');
  if (modal) modal.style.display = 'none';
}

async function toggleQrCameraFacing() {
  qrCameraFacing = qrCameraFacing === 'environment' ? 'user' : 'environment';
  await initQrCamera();
}

async function toggleQrCameraTorch() {
  const track = qrScanStream?.getVideoTracks?.()[0];
  if (!track) return;
  try {
    qrTorchEnabled = !qrTorchEnabled;
    await track.applyConstraints({
      advanced: [{ torch: qrTorchEnabled }],
    });
    const btnTorch = document.getElementById('btn-qr-torch');
    if (btnTorch) {
      btnTorch.style.background = qrTorchEnabled ? '#f59e0b' : '#1e293b';
      btnTorch.style.color = qrTorchEnabled ? '#000000' : '#e2e8f0';
    }
  } catch (_e) {}
}

async function handleQrImageUpload(input) {
  if (!input?.files || input.files.length === 0) return;
  const file = input.files[0];
  input.value = '';
  const isEn = getLang() === 'en';
  try {
    const detector =
      MoneyApp.createBarcodeDetector?.() ||
      (typeof window.BarcodeDetector !== 'undefined' ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null);
    if (!detector) {
      alert(isEn ? 'BarcodeDetector API is not supported on this browser.' : 'เบราว์เซอร์ไม่รองรับระบบตรวจจับ Barcode / QR');
      return;
    }
    const bitmap = await createImageBitmap(file);
    const barcodes = await detector.detect(bitmap);
    if (barcodes && barcodes.length > 0) {
      let captured = false;
      for (const code of barcodes) {
        if (code.rawValue) {
          const ok = handleScannedChunkString(code.rawValue);
          if (ok) captured = true;
        }
      }
      if (captured) {
        if (MoneyApp.playScanFeedbackChime) {
          MoneyApp.playScanFeedbackChime({ frequency: 1046, duration: 0.1 });
        }
      } else {
        alert(
          isEn ? 'Detected QR code does not contain a valid sync chunk.' : 'ตรวจพบ QR Code แต่ข้อมูลไม่ใช่ชิ้นส่วนซิงค์ของแอป',
        );
      }
    } else {
      alert(t.qrImageDecodeError || (isEn ? 'No QR code detected in this image.' : 'ไม่พบ QR Code ในรูปภาพนี้'));
    }
  } catch (err) {
    console.error('QR image decode failed:', err);
    alert(isEn ? 'Failed to process image file.' : 'ไม่สามารถอ่านไฟล์รูปภาพได้');
  }
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

    // Trigger visual, audio, and haptic feedback
    const overlay = document.getElementById('qrCameraOverlay');
    if (overlay) {
      overlay.style.borderColor = '#10b981';
      setTimeout(() => {
        if (overlay) overlay.style.borderColor = '#4FA894';
      }, 250);
    }
    if (typeof MoneyApp !== 'undefined' && MoneyApp.playScanFeedbackChime) {
      MoneyApp.playScanFeedbackChime({ frequency: 880, duration: 0.08 });
    }
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(50);
      } catch (_v) {}
    }

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
window.toggleQrCameraFacing = toggleQrCameraFacing;
window.toggleQrCameraTorch = toggleQrCameraTorch;
window.handleQrImageUpload = handleQrImageUpload;
window.handleScannedChunkString = handleScannedChunkString;
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
  applyDocumentTitleWithBadge(`Money Superapp — ${titleText}`);

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
  if (e.data && e.data.action === 'updateBadge') {
    if (typeof MoneyApp !== 'undefined' && typeof MoneyApp.updateAppBadge === 'function') {
      MoneyApp.updateAppBadge(e.data.count);
    } else if (typeof updateAppBadge === 'function') {
      updateAppBadge(e.data.count);
    }
  }
  if (e.data && e.data.action === 'clearBadge') {
    if (typeof MoneyApp !== 'undefined' && typeof MoneyApp.clearAppBadge === 'function') {
      MoneyApp.clearAppBadge();
    } else if (typeof clearAppBadge === 'function') {
      clearAppBadge();
    }
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

// Phase 109: Speculative Navigation Prefetching
const prefetchedUrls = new Set();
function prefetchTabUrl(src) {
  if (!src || prefetchedUrls.has(src)) return;
  prefetchedUrls.add(src);
  try {
    if (typeof document !== 'undefined' && document.createElement && document.head) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = src;
      document.head.appendChild(link);
    }
  } catch (_e) {}
}

if (typeof window !== 'undefined') {
  window.MoneyApp = window.MoneyApp || {};
  window.MoneyApp.prefetchTabUrl = prefetchTabUrl;
}

allNavButtons.forEach((btn) => {
  btn.addEventListener(
    'pointerenter',
    () => {
      if (btn.dataset.src) prefetchTabUrl(btn.dataset.src);
    },
    { passive: true },
  );
  btn.addEventListener(
    'touchstart',
    () => {
      if (btn.dataset.src) prefetchTabUrl(btn.dataset.src);
    },
    { passive: true },
  );
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
        if (typeof updateNetworkStatus === 'function') {
          updateNetworkStatus();
        }
      })
      .catch((err) => {
        console.warn('PWA ServiceWorker registration failed: ', err);
      });
  });
}

// Phase 110: PWA Installation Handling & Offline Status Monitor
let deferredInstallPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent browser default mini-infobar
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('btn-pwa-install');
    if (btn) {
      btn.style.display = 'inline-flex';
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    const btn = document.getElementById('btn-pwa-install');
    if (btn) {
      btn.style.display = 'none';
    }
    console.log('Money Superapp PWA was installed successfully');
  });

  window.addEventListener('online', () => {
    updateNetworkStatus();
  });

  window.addEventListener('offline', () => {
    updateNetworkStatus();
  });
}

async function installPwa() {
  if (!deferredInstallPrompt) return;
  try {
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;
    if (choiceResult && choiceResult.outcome === 'accepted') {
      console.log('User accepted PWA installation');
    }
  } catch (err) {
    console.warn('PWA install prompt error:', err);
  }
  deferredInstallPrompt = null;
  const btn = document.getElementById('btn-pwa-install');
  if (btn) {
    btn.style.display = 'none';
  }
}

function updateNetworkStatus() {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  const badge = document.getElementById('pwaOfflineBadge');
  const dot = document.getElementById('pwaStatusDot');
  const label = document.getElementById('lbl-pwa-offline-badge');
  const lang = typeof getLang === 'function' ? getLang() : 'th';
  const t = translations[lang] || translations.th;

  if (dot) {
    dot.className = `pwa-status-dot ${isOnline ? 'online' : 'offline'}`;
  }
  if (label) {
    label.textContent = isOnline ? t.pwaOfflineReady : t.pwaOfflineMode;
  }
  if (badge) {
    badge.title = isOnline
      ? lang === 'en'
        ? 'PWA Ready & Cached Offline'
        : 'ระบบแคชออฟไลน์พร้อมใช้งาน 100%'
      : lang === 'en'
        ? 'Currently Offline — Operating from Cache'
        : 'กำลังใช้งานออฟไลน์ — ข้อมูลและระบบทำงานจากแคช';
  }
}

// --- Phase 128: Mobile Pull-to-Refresh Gesture & Web App Badging API ---

/**
 * Computes ambient financial notification badge count:
 * 1. Days remaining in annual tax filing deadline (if in Jan–Apr and <= 30 days until April 8)
 * 2. Budget deficit warning (if remaining budget < 0)
 * @returns {number}
 */
function computeBadgeCount() {
  let badgeCount = 0;

  // 1. Annual tax filing deadline (April 8th e-Filing)
  try {
    const now = new Date();
    const month = now.getMonth(); // 0 = Jan, 1 = Feb, 2 = Mar, 3 = Apr
    if (month >= 0 && month <= 3) {
      const year = now.getFullYear();
      const deadline = new Date(year, 3, 8, 23, 59, 59, 999);
      const diffMs = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 30) {
        badgeCount++;
      }
    }
  } catch (_e) {}

  // 2. Budget deficit warning from localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const directRemaining = localStorage.getItem('moneySuperapp.remaining');
      if (directRemaining !== null && Number.parseFloat(directRemaining) < 0) {
        badgeCount++;
      } else {
        const rawState = localStorage.getItem('remainingMoneyCalculator.state.v1');
        if (rawState) {
          const parsed = JSON.parse(rawState);
          if (typeof parsed?.remaining === 'number' && parsed.remaining < 0) {
            badgeCount++;
          } else if (Array.isArray(parsed?.incomes) && Array.isArray(parsed?.expenses)) {
            const inc = parsed.incomes.reduce((s, i) => s + (Number(i.amount) || 0), 0);
            const exp = parsed.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
            if (inc > 0 && inc - exp < 0) {
              badgeCount++;
            }
          }
        }
      }
    }
  } catch (_e) {}

  return badgeCount;
}

/**
 * Sets Web App Badge via Badging API with title fallback and status dot indicator.
 * @param {number} [count] - Optional specific badge count
 * @returns {number} Active badge count
 */
function updateAppBadge(count) {
  let badgeCount;
  if (count === undefined || count === null) {
    badgeCount = computeBadgeCount();
  } else {
    const parsed = Number.parseInt(count, 10);
    badgeCount = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
  }

  currentAppBadgeCount = badgeCount;

  if (typeof navigator !== 'undefined') {
    if (badgeCount > 0 && typeof navigator.setAppBadge === 'function') {
      navigator.setAppBadge(badgeCount).catch(() => {});
    } else if (badgeCount === 0 && typeof navigator.clearAppBadge === 'function') {
      navigator.clearAppBadge().catch(() => {});
    }
  }

  // Fallback: document.title and #pwaStatusDot
  if (typeof document !== 'undefined') {
    applyDocumentTitleWithBadge(document.title);
    const dot = document.getElementById('pwaStatusDot');
    if (dot) {
      dot.classList.toggle('has-badge', badgeCount > 0);
    }
  }

  return badgeCount;
}

/**
 * Clears Web App Badge via Badging API and resets fallback indicators.
 * @returns {number} 0
 */
function clearAppBadge() {
  currentAppBadgeCount = 0;
  if (typeof navigator !== 'undefined' && typeof navigator.clearAppBadge === 'function') {
    navigator.clearAppBadge().catch(() => {});
  }
  if (typeof document !== 'undefined') {
    applyDocumentTitleWithBadge(document.title);
    const dot = document.getElementById('pwaStatusDot');
    if (dot) {
      dot.classList.remove('has-badge');
    }
  }
  return 0;
}

/**
 * Mobile Pull-to-Refresh Gesture Controller.
 * Expands #pullToRefreshBar dynamically on top pull and triggers cross-frame sync.
 */
function initPullToRefresh() {
  if (typeof document === 'undefined') return;
  const bar = document.getElementById('pullToRefreshBar');
  const text = document.getElementById('pullToRefreshText');
  if (!bar || !text) return;

  let startX = 0;
  let startY = 0;
  let isTracking = false;
  let isRefreshing = false;

  const resetBar = (delay = 0) => {
    setTimeout(() => {
      bar.style.height = '0px';
      bar.style.opacity = '0';
      setTimeout(() => {
        if (!isRefreshing) {
          bar.style.display = 'none';
          const lang = typeof getLang === 'function' ? getLang() : 'th';
          const t = translations[lang] || translations.th;
          text.textContent = t.pullToRefreshText || '🔄 เลื่อนลงเพื่อซิงค์ข้อมูล (Pull to refresh)';
        }
      }, 200);
      isRefreshing = false;
    }, delay);
  };

  window.addEventListener(
    'touchstart',
    (e) => {
      if (isRefreshing) return;
      if (e.touches?.length !== 1) {
        isTracking = false;
        return;
      }
      const target = e.target;
      if (target?.closest?.('#settingsModal, #onboardingModal, input, select, textarea')) {
        isTracking = false;
        return;
      }
      const scrollY = window.scrollY || document.documentElement?.scrollTop || 0;
      const touchY = e.touches[0].clientY;
      if (scrollY <= 0 || touchY <= 80) {
        isTracking = true;
        startX = e.touches[0].clientX;
        startY = touchY;
      } else {
        isTracking = false;
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'touchmove',
    (e) => {
      if (!isTracking || isRefreshing || !e.touches?.length) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (deltaY > 15 && Math.abs(deltaX) < 40) {
        bar.style.display = 'block';
        bar.style.opacity = '1';
        const height = Math.min(42, Math.round(deltaY * 0.5));
        bar.style.height = `${height}px`;

        const lang = typeof getLang === 'function' ? getLang() : 'th';
        const t = translations[lang] || translations.th;
        if (deltaY > 65) {
          text.textContent = t.pullToRefreshRelease || '🔄 ปล่อยเพื่อซิงค์ข้อมูล (Release to refresh)';
        } else {
          text.textContent = t.pullToRefreshText || '🔄 เลื่อนลงเพื่อซิงค์ข้อมูล (Pull to refresh)';
        }
      }
    },
    { passive: true },
  );

  window.addEventListener(
    'touchend',
    (e) => {
      if (!isTracking || isRefreshing) return;
      isTracking = false;

      const touch = e.changedTouches?.[0];
      if (!touch) {
        resetBar(0);
        return;
      }
      const deltaY = touch.clientY - startY;

      if (deltaY > 65) {
        isRefreshing = true;
        bar.style.height = '42px';
        const lang = typeof getLang === 'function' ? getLang() : 'th';
        const t = translations[lang] || translations.th;
        text.textContent = t.pullToRefreshSyncing || '🔄 กำลังซิงค์ข้อมูล... (Syncing...)';
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          try {
            navigator.vibrate(15);
          } catch (_e) {}
        }

        try {
          if (frame?.contentWindow) {
            frame.contentWindow.postMessage({ action: 'pullToRefreshSync' }, '*');
          }
        } catch (_e) {}

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('moneySuperapp:refresh'));
        }

        updateAppBadge();
        resetBar(600);
      } else {
        resetBar(0);
      }
    },
    { passive: true },
  );
}

const shellGlobal = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : global;
shellGlobal.MoneyApp = shellGlobal.MoneyApp || {};
shellGlobal.MoneyApp.computeBadgeCount = computeBadgeCount;
shellGlobal.MoneyApp.updateAppBadge = updateAppBadge;
shellGlobal.MoneyApp.clearAppBadge = clearAppBadge;
shellGlobal.MoneyApp.initPullToRefresh = initPullToRefresh;
shellGlobal.MoneyApp.selectOnboardingArchetype = selectOnboardingArchetype;
shellGlobal.MoneyApp.startOnboardingWithArchetype = startOnboardingWithArchetype;
shellGlobal.MoneyApp.openOnboardingModal = openOnboardingModal;
shellGlobal.MoneyApp.closeOnboardingModal = closeOnboardingModal;

if (typeof window !== 'undefined') {
  window.installPwa = installPwa;
  window.updateNetworkStatus = updateNetworkStatus;
  window.computeBadgeCount = computeBadgeCount;
  window.updateAppBadge = updateAppBadge;
  window.clearAppBadge = clearAppBadge;
  window.initPullToRefresh = initPullToRefresh;
  window.selectOnboardingArchetype = selectOnboardingArchetype;
  window.startOnboardingWithArchetype = startOnboardingWithArchetype;

  const initShellPwaAndBadges = () => {
    updateNetworkStatus();
    initPullToRefresh();
    updateAppBadge();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShellPwaAndBadges);
  } else {
    initShellPwaAndBadges();
  }
}
