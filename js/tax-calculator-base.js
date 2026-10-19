// Language: read once from localStorage (shared origin with the shell nav's toggle).
const translations = {
  th: {
    'lbl-title': 'ประมาณการภาษี 📊',
    'lbl-tab-monthly': 'รายได้รายเดือน',
    'lbl-tab-yearly': 'รายได้ทั้งปี / รายได้ไม่แน่นอน',
    'lbl-salary': 'เงินเดือน (บาท/เดือน)',
    'lbl-bonus': 'โบนัส (บาท/ปี)',
    'lbl-yearly-income': 'รายได้รวมทั้งปี (บาท/ปี)',
    'lbl-yearly-income-tag': 'มาตรา 40(1), 40(2)',
    'lbl-yearly-hint': 'สำหรับฟรีแลนซ์, คอมมิชชัน, สัญญาจ้าง หรือรายได้ต่อเดือนไม่แน่นอน',
    'lbl-yearly-bonus': 'โบนัสทั้งปี / รายได้พิเศษอื่นๆ (บาท/ปี)',
    'lbl-months-helper': '➕ ตัวช่วยแจกแจงรายได้รายเดือน (12 เดือน)',
    'lbl-months-subhint': 'กรอกรายได้แต่ละเดือนด้านล่าง ยอดรวมทั้งปีจะคำนวณให้อัตโนมัติ',
    'lbl-months-total': 'รวม 12 เดือน:',
    'lbl-m-1': 'ม.ค.',
    'lbl-m-2': 'ก.พ.',
    'lbl-m-3': 'มี.ค.',
    'lbl-m-4': 'เม.ย.',
    'lbl-m-5': 'พ.ค.',
    'lbl-m-6': 'มิ.ย.',
    'lbl-m-7': 'ก.ค.',
    'lbl-m-8': 'ส.ค.',
    'lbl-m-9': 'ก.ย.',
    'lbl-m-10': 'ต.ค.',
    'lbl-m-11': 'พ.ย.',
    'lbl-m-12': 'ธ.ค.',
    'lbl-yearly-pvd': 'เงินสะสมสำรองเลี้ยงชีพ (PVD) รวมทั้งปี (บาท/ปี)',
    'lbl-yearly-pvd-tag': 'สูงสุด 15% ของเงินได้',
    'lbl-yearly-sso': 'เงินสมทบประกันสังคม (SSO) รวมทั้งปี (บาท/ปี)',
    'lbl-yearly-sso-tag': 'สูงสุด 13,800 บาท',
    'opt-sso-0': '0 บาท (ไม่มี / ฟรีแลนซ์)',
    'lbl-pvdPercent': 'กองทุนสำรองเลี้ยงชีพ (%)',
    'lbl-sso-ceiling': 'เพดานเงินสมทบประกันสังคม',
    'opt-sso-750': '750 บาท (เพดานค่าจ้างเดิม 15,000)',
    'opt-sso-875': '875 บาท (เพดานใหม่ 17,500)',
    'opt-sso-1000': '1,000 บาท (เพดานใหม่ 20,000)',
    'opt-sso-1150': '1,150 บาท (เพดานใหม่ 23,000)',
    'lbl-more-deduct': '+ ลดหย่อนเพิ่มเติม (SSF, RMF, ThaiESG, Easy E-Receipt, ดอกเบี้ยบ้าน)',
    'lbl-fund-deduct': 'กองทุนเพื่อการเกษียณ: SSF / RMF (รวม PVD ไม่เกิน 5 แสนบาท/ปี)',
    'lbl-thaiesg-deduct': 'กองทุนรวมไทยเพื่อความยั่งยืน ThaiESG (ไม่เกิน 300,000 บาท/ปี)',
    'lbl-easyreceipt-deduct': 'โครงการ Easy E-Receipt (สูงสุด 50,000 บาท/ปี)',
    'lbl-ins-deduct': 'เบี้ยประกันชีวิตและสุขภาพ (ไม่เกิน 100,000 บาท/ปี)',
    'lbl-mortgage-deduct': 'ดอกเบี้ยเงินกู้ยืมเพื่อซื้อที่อยู่อาศัย (ไม่เกิน 100,000 บาท/ปี)',
    'lbl-other-deduct': 'ลดหย่อนอื่นๆ เช่น บิดามารดา บุตร เงินบริจาค (บาท/ปี)',
    'lbl-totalIncome': 'รายได้รวมทั้งปี:',
    'lbl-expenseDeduct': 'หักค่าใช้จ่าย (สูงสุด 100,000):',
    'lbl-personalDeduct': 'หักค่าลดหย่อนส่วนตัว:',
    'lbl-pvdDeduct': 'หักกองทุนสำรองเลี้ยงชีพ (PVD):',
    'lbl-ssoDeduct': 'หักประกันสังคม (ทั้งปี):',
    'lbl-moreDeduct': 'หักลดหย่อนอื่นๆ เพิ่มเติม:',
    'lbl-netIncome': 'เงินได้สุทธิ:',
    'lbl-taxAmount': 'ภาษีที่ต้องชำระโดยประมาณ',
    'lbl-breakdownTitle': 'รายละเอียดภาษีตามขั้นบันได (Waterfall)',
    'txt-advisor-title': 'คำแนะนำและโอกาสประหยัดภาษี (Optimization Room)',
    'lbl-capacity-title': '📊 สิทธิ์ลดหย่อนและโควตาคงเหลือ (Deduction Capacity)',
    'lbl-sim-title': '⚡ จำลองผลภาษีเมื่อลงทุนเพิ่ม (What-If Simulation)',
    'lbl-sim-pills': 'เลือกลงทุนเพิ่ม:',
    'btn-apply-sim': '✓ นำยอดจำลองนี้ไปกรอกจริง',
    'btn-advisor-drop': '🎯 ลด 1 ขั้นบันได',
    'btn-advisor-max': '🌟 ใช้สิทธิ์สูงสุด',
    'btn-advisor-revert': '↺ คืนค่าเดิม',
    'lbl-copy-tax': '📋 คัดลอกสรุปภาษี',
    'lbl-print-tax': '🖨️ พิมพ์ / PDF',
    'lbl-undo-tax': 'เลิกทำ (Undo)',
    'lbl-undo-tax-top': 'เลิกทำ',
    'lbl-reset-tax': 'ล้างข้อมูล',
    'lbl-reset-taxbase-layout': 'รีเซ็ตเลย์เอาต์',
    'lbl-panel-income': '1. ข้อมูลรายได้',
    'lbl-panel-deductions': '2. ค่าลดหย่อนและการหักภาษี',
    'lbl-panel-results': '3. สรุปผลภาษีและเงินคืน (Tax Results & Refund)',
    'print-doc-sub': 'เอกสารสรุปประมาณการคำนวณภาษีและรายการหักลดหย่อน เพื่อใช้ประกอบการยื่นแบบชำระภาษี',
    'print-lbl-sec1': 'ส่วนที่ 1: เงินได้พึงประเมิน (Assessable Income)',
    'print-lbl-income-main': 'เงินเดือน / ค่าจ้างประจำ (มาตรา 40(1))',
    'print-lbl-income-bonus': 'โบนัสและเงินได้พิเศษอื่นๆ (มาตรา 40(2))',
    'print-lbl-income-total': 'รวมเงินได้พึงประเมินทั้งปี',
    'print-lbl-sec2': 'ส่วนที่ 2: รายการหักค่าใช้จ่ายและค่าลดหย่อน (Deductions & Allowances)',
    'print-lbl-deduct-expense': 'ค่าใช้จ่ายตามกฎหมาย (50% ของเงินได้ แต่ไม่เกิน 100,000 บาท)',
    'print-lbl-deduct-personal': 'ค่าลดหย่อนส่วนตัวผู้มีเงินได้',
    'print-lbl-deduct-sso': 'เงินสมทบกองทุนประกันสังคม (SSO)',
    'print-lbl-deduct-pvd': 'เงินสะสมกองทุนสำรองเลี้ยงชีพ (PVD)',
    'print-lbl-deduct-fund': 'กองทุนเพื่อการเกษียณ (SSF / RMF)',
    'print-lbl-deduct-thaiesg': 'กองทุนรวมไทยเพื่อความยั่งยืน (ThaiESG)',
    'print-lbl-deduct-ins': 'เบี้ยประกันชีวิตและสุขภาพ',
    'print-lbl-deduct-mortgage': 'ดอกเบี้ยเงินกู้ยืมเพื่อซื้อที่อยู่อาศัย',
    'print-lbl-deduct-easyreceipt': 'โครงการ Easy E-Receipt',
    'print-lbl-deduct-other': 'ค่าลดหย่อนอื่นๆ / เงินบริจาค',
    'print-lbl-deduct-total': 'รวมรายการหักค่าใช้จ่ายและค่าลดหย่อนทั้งสิ้น',
    'print-lbl-sec3': 'ส่วนที่ 3: การคำนวณภาษีตามขั้นบันได (Tax Calculation Waterfall)',
    'print-th-tier': 'ขั้นเงินได้สุทธิ',
    'print-th-taxable': 'เงินได้ในขั้น',
    'print-th-rate': 'อัตราภาษี',
    'print-th-tax': 'ภาษีแต่ละขั้น',
    'print-lbl-netincome': 'เงินได้สุทธิ: ',
    'print-lbl-toprate': 'ฐานภาษีสูงสุด: ',
    'print-lbl-effrate': 'อัตราภาษีเฉลี่ย: ',
    'print-lbl-totaltax': 'ภาษีที่ต้องชำระ: ',
    'print-lbl-notes-title': '📌 หมายเหตุและข้อแนะนำในการยื่นแบบแสดงรายการภาษี (ภ.ง.ด.91/90):',
    'print-note-1': 'กำหนดยื่นแบบกระดาษภายใน 31 มีนาคม หรือยื่นแบบผ่านอินเทอร์เน็ต (E-Filing กรมสรรพากร) ภายใน 8 เมษายน ของทุกปี',
    'print-note-2':
      'กรุณาจัดเตรียมเอกสารหลักฐาน: หนังสือรับรองการหักภาษี ณ ที่จ่าย (ใบ 50 ทวิ), หนังสือรับรองเบี้ยประกันชีวิต/สุขภาพ, เอกสารรับรองการซื้อหน่วยลงทุน SSF/RMF/ThaiESG, และหนังสือรับรองดอกเบี้ยเงินกู้ยืมเพื่อที่อยู่อาศัย',
    'print-note-3':
      'คำนวณและประมวลผลด้วย Money Superapp ภายในเบราว์เซอร์ของผู้ใช้ 100% ไม่มีการส่งข้อมูลทางการเงินออกสู่เครือข่ายภายนอก',
    'txt-withheld-label': 'ภาษีหัก ณ ที่จ่ายสะสมทั้งปี (ใบ 50 ทวิ)',
    'txt-import-payslip': 'ดึงจากสลิปเงินเดือน',
    'lbl-withheld-hint':
      'ยอดรวมภาษีที่ถูกหักไว้แล้วจากเงินเดือน โบนัส หรือค่าจ้างฟรีแลนซ์ (ระบุในหนังสือรับรอง 50 ทวิ) เพื่อเทียบยอดขอคืนหรือชำระเพิ่ม',
    'lbl-withheld-unit': 'บาท',
    'lbl-net-balance-headline': 'ผลการยื่นภาษีสุทธิ',
    'lbl-card-calc-tax': 'ภาษีที่คำนวณได้:',
    'lbl-card-withheld-tax': 'หักไว้แล้ว (50 ทวิ):',
    'print-lbl-withheld': 'ภาษีหัก ณ ที่จ่ายสะสม (50 ทวิ): ',
    'print-lbl-netbalance': 'ผลลัพธ์สุทธิ: ',
    'lbl-panel-scenario': '4. เปรียบเทียบ Scenario & ทดสอบเงินเฟ้อ',
    'lbl-compare-header': 'เปรียบเทียบ Scenario A (ปัจจุบัน) vs Scenario B (เปรียบเทียบ)',
    'lbl-copy-curr-b': '📋 คัดลอกค่าปัจจุบันไป B',
    'lbl-scen-income': 'รายได้รวม B (บาท/ปี):',
    'lbl-scen-ded': 'ลดหย่อนอื่นๆ B (บาท/ปี):',
    'lbl-scen-infl': 'อัตราเงินเฟ้อ / Inflation (%):',
    'lbl-panel-calendar': '5. ปฏิทินภาษี & วันครบกำหนด (Tax Planning Calendar)',
    'lbl-tax-calendar-header': 'กำหนดการยื่นแบบและชำระภาษีสำคัญ (Statutory Tax Deadlines)',
    'lbl-reset-tax-calendar': '↺ รีเซ็ตเช็คลิสต์',
    'lbl-next-deadline-title': 'วันครบกำหนดที่ใกล้ที่สุด:',
    'lbl-tax-calendar-tip-title': 'ข้อแนะนำการวางแผนลดหย่อนภาษี',
    'lbl-tax-calendar-tip-desc':
      'การลงทุนลดหย่อนภาษี (SSF, RMF, ThaiESG และเบี้ยประกันชีวิต/สุขภาพ) ต้องดำเนินการและชำระเงินให้แล้วเสร็จภายใน 31 ธ.ค. ของปีภาษีนั้นๆ พร้อมทั้งกดยินยอมให้ บลจ./บริษัทประกัน ส่งข้อมูลให้กรมสรรพากรผ่านระบบ e-Donation / Data Transfer',
    'lbl-div-credit-title': 'เครดิตภาษีเงินปันผลหุ้นไทย (ม.47 ทวิ)',
    'lbl-div-credit-sub': 'จำลองสิทธิ์ขอคืนภาษีเงินปันผลหุ้นไทย หรือเลือก Final Tax 10%',
    'lbl-div-amount': 'เงินปันผลรับรวมทั้งปี (บาท)',
    'lbl-div-amount-sub': 'ก่อนหัก ณ ที่จ่าย 10%',
    'lbl-cit-rate': 'อัตราภาษีเงินได้นิติบุคคลของบริษัท (CIT Rate)',
    'opt-cit-20': '20% (บริษัทจดทะเบียน SET / mai ทั่วไป - เครดิต 25%)',
    'opt-cit-25': '25% (อัตราภาษีนิติบุคคลเดิม / กิจการพิเศษ - เครดิต 33.33%)',
    'opt-cit-15': '15% (SME / กิจการลดหย่อนพิเศษ - เครดิต 17.65%)',
    'opt-cit-0': '0% (กิจการยกเว้นภาษี BOI / ไม่ได้รับเครดิตภาษี)',
    'lbl-opt-final-tax': 'ทางเลือก 1: หัก 10% จบ (Final Tax)',
    'desc-opt-final-tax': 'หัก ณ ที่จ่าย 10% ไม่ต้องนำเงินปันผลไปยื่นรวม',
    'lbl-opt-claim-credit': 'ทางเลือก 2: ยื่นเครดิตภาษี (ม.47 ทวิ)',
    'desc-opt-claim-credit': 'รวมเงินปันผล + เครดิตเพื่อขอคืนภาษี',
    'lbl-apply-div-tax': 'นำไปคำนวณในแบบภาษีรวมทันที',
    'lbl-panel-efiling': '📋 ใบกรอก ภ.ง.ด. 90/91 e-Filing (Revenue Dept. Worksheet)',
    lblBtnCopyAllEFiling: 'คัดลอกสรุปทั้งหมด',
    lblEFilingPortalDesc:
      'ตัวเลขจัดเรียงตรงตามหน้าจอระบบยื่นแบบออนไลน์ของกรมสรรพากร (efiling.rd.go.th) กดปุ่มคัดลอกเพื่อนำไปวางได้ทันที',
    linkRdOnline: 'เปิดเว็บสรรพากร ➔',
    lblEfStep1Title: 'ขั้นที่ 1: รายการเงินได้ (Assessable Income)',
    lblEf401: 'มาตรา 40(1) เงินเดือน / โบนัส',
    subEf401: 'เงินเดือนรวมทั้งปี + โบนัส',
    lblEf402: 'มาตรา 40(2) ค่าจ้าง / ฟรีแลนซ์',
    subEf402: 'ค่านายหน้า / เบี้ยประชุม',
    lblEf404b: 'มาตรา 40(4)(ข) เงินปันผลหุ้นไทย',
    subEf404b: 'พร้อมเครดิตภาษีเงินปันผล',
    lblEfExpense: 'หักค่าใช้จ่ายตามกฎหมาย (50% สูงสุด 1 แสน)',
    lblEfStep2Title: 'ขั้นที่ 2: ค่าลดหย่อน (Deductions)',
    lblEfGroupA: 'กลุ่ม A: ตนเองและครอบครัว',
    subEfGroupA: 'ตนเอง 60k + คู่สมรส/บุตร/บิดามารดา',
    lblEfGroupB: 'กลุ่ม B: ประกัน & กองทุนเกษียณ',
    subEfGroupB: 'SSO + PVD + SSF + RMF + ThaiESG + ประกัน',
    lblEfGroupC: 'กลุ่ม C: ดอกเบี้ยกู้ยืมบ้าน',
    subEfGroupC: 'ดอกเบี้ยเงินกู้ซื้อที่อยู่อาศัย (สูงสุด 100k)',
    lblEfGroupD: 'กลุ่ม D: เงินบริจาค',
    subEfGroupD: 'e-Donation การศึกษา/กีฬา (2x) + ทั่วไป',
    lblEfNetBalanceTitle: 'สรุปยอดภาษีสุทธิ (Net Tax Outcome):',
    descEfNetBalance: 'คำนวณหักภาษี ณ ที่จ่าย 50 ทวิ และเครดิตภาษีเงินปันผลแล้ว',
    lblBridgeTaxAccrualMonthly: 'ตั้งสำรองจ่ายภาษีรายเดือนในงบประมาณ (Remaining Money)',
    lblBridgeTaxAccrualInstallments: 'ตั้งงบผ่อนชำระ 3 งวด (0%) ในงบประมาณ',
    lblBridgeTaxRefundToDebt: 'นำเงินคืนภาษีไปโปะหนี้ก้อนใหญ่ (Debt Payoff)',
    lblBridgeTaxRefundToRebalance: 'นำไปเพิ่มงบลงทุน Rebalance',
    lblStepDownTitle: 'วิเคราะห์การลดฐานภาษี (Bracket Step-Down Analyzer)',
    lblMetricStepDownNeed: 'ลดหย่อนเพิ่มเพื่อลดฐาน',
    lblMetricStepDownSaved: 'ประหยัดภาษีทันที',
    lblMetricStepDownRoi: 'ผลตอบแทนภาษี (ROI)',
    lblMetricToTaxFree: 'ลดหย่อนสู่ภาษี 0 บาท',
    lblBtnCopyStepDown: 'คัดลอกยอดลดหย่อนเป้าหมาย',
    lblBtnBridgeStepDownRebalance: 'ส่งยอดไปวางแผน DCA กองทุน',
    lblPreflightTitle: 'รายการตรวจสอบก่อนยื่นแบบออนไลน์ (Pre-Flight Checklist)',
    btnCheckAllPreflight: '✓ ตรวจทั้งหมด',
    btnResetPreflight: 'รีเซ็ต',
    'lbl-chk-50tawi': '1. ตรวจสอบหนังสือรับรองหัก ณ ที่จ่าย (ใบ 50 ทวิ) ครบทุกที่',
    'sub-chk-50tawi': 'รวมยอดเงินเดือน โบนัส และฟรีแลนซ์ตรงกับเอกสารจริงทุกบริษัท',
    'lbl-chk-pool500k': '2. ยอดกลุ่มกองทุนเกษียณ (PVD + SSF + RMF) ไม่เกินเพดาน 500,000 บาท',
    'sub-chk-pool500k': 'ผ่านเกณฑ์มาตรา 47 แห่งประมวลรัษฎากร ไม่มียอดส่วนเกินตกหล่น',
    'lbl-chk-thaiesg': '3. กองทุนรวมไทยเพื่อความยั่งยืน (ThaiESG) ถูกต้องตามเกณฑ์',
    'sub-chk-thaiesg': 'ไม่เกิน 300,000 บาท (และไม่เกิน 30% ของเงินได้) พร้อมถือครองครบ 5 ปีวันชนวัน',
    'lbl-chk-consent': '4. ยืนยันการให้ความยินยอม (Consent) ส่งข้อมูลลดหย่อนสู่สรรพากร',
    'sub-chk-consent': 'กดยินยอมในแอปพลิเคชัน บลจ. หรือบริษัทประกัน ให้ส่งข้อมูลภาษีออนไลน์อัตโนมัติ',
    'lbl-chk-promptpay': '5. ผูกบัญชีพร้อมเพย์ด้วยเลขบัตรประชาชน 13 หลัก',
    'sub-chk-promptpay': 'สำหรับการรับเงินภาษีคืนเข้าบัญชีธนาคารโดยตรงจากกรมสรรพากรโดยไม่ต้องรอเช็ค',
    btnCopyNetBalance: '📋 คัดลอกยอดสุทธิ',
    btnBridgeTaxAccrualMonthly: 'ตั้งสำรองจ่ายภาษีรายเดือนในงบประมาณ (Remaining Money)',
    btnBridgeTaxAccrualInstallments: 'ตั้งงบผ่อนชำระ 3 งวด (0%) ในงบประมาณ',
    lblPool500kTitle: 'เพดานลดหย่อนกลุ่มเกษียณ 500,000 บาท (ม.47 แห่งประมวลรัษฎากร)',
    lblPoolExcessTitle: 'มียอดเงินสะสม/ลงทุนเกินเพดานที่กฎหมายกำหนด',
    lblPoolExcessDesc:
      'คุณมียอดรวม PVD + SSF + RMF เกินเพดาน 500,000 บาท ตาม ม.47 อยู่เป็นจำนวน <strong id="valPoolExcessAmount" class="font-mono">0</strong> บาท สรรพากรจะตัดส่วนเกินนี้ออกอัตโนมัติในการยื่นแบบ ภ.ง.ด. 90/91',
  },
  en: {
    'lbl-title': 'Tax Estimate 📊',
    'lbl-tab-monthly': 'Monthly Income',
    'lbl-tab-yearly': 'Annual / Variable Income',
    'lbl-salary': 'Salary (THB/month)',
    'lbl-bonus': 'Bonus (THB/year)',
    'lbl-yearly-income': 'Total Annual Income (THB/year)',
    'lbl-yearly-income-tag': 'Section 40(1), 40(2)',
    'lbl-yearly-hint': 'For freelancers, commissions, contract, or variable monthly earnings',
    'lbl-yearly-bonus': 'Annual Bonus / Other Income (THB/year)',
    'lbl-months-helper': '➕ 12-Month Income Breakdown Calculator',
    'lbl-months-subhint': 'Enter monthly earnings below; annual total will auto-calculate',
    'lbl-months-total': '12-Month Total:',
    'lbl-m-1': 'Jan',
    'lbl-m-2': 'Feb',
    'lbl-m-3': 'Mar',
    'lbl-m-4': 'Apr',
    'lbl-m-5': 'May',
    'lbl-m-6': 'Jun',
    'lbl-m-7': 'Jul',
    'lbl-m-8': 'Aug',
    'lbl-m-9': 'Sep',
    'lbl-m-10': 'Oct',
    'lbl-m-11': 'Nov',
    'lbl-m-12': 'Dec',
    'lbl-yearly-pvd': 'Provident Fund (PVD) Total (THB/year)',
    'lbl-yearly-pvd-tag': 'Max 15% of income',
    'lbl-yearly-sso': 'Social Security (SSO) Total (THB/year)',
    'lbl-yearly-sso-tag': 'Max 13,800 THB',
    'opt-sso-0': '0 THB (None / Freelance)',
    'lbl-pvdPercent': 'Provident Fund (%)',
    'lbl-sso-ceiling': 'Social Security (SSO) Cap',
    'opt-sso-750': '750 THB (15k wage cap)',
    'opt-sso-875': '875 THB (17.5k new cap)',
    'opt-sso-1000': '1,000 THB (20k wage cap)',
    'opt-sso-1150': '1,150 THB (23k wage cap)',
    'lbl-more-deduct': '+ Additional Deductions (SSF, RMF, ThaiESG, Easy E-Receipt, Loan)',
    'lbl-fund-deduct': 'Retirement Funds: SSF / RMF (incl. PVD max 500k THB/yr)',
    'lbl-thaiesg-deduct': 'ThaiESG Fund (max 300k THB/yr)',
    'lbl-easyreceipt-deduct': 'Easy E-Receipt Scheme (max 50,000 THB/yr)',
    'lbl-ins-deduct': 'Life & Health Insurance (max 100k THB/yr)',
    'lbl-mortgage-deduct': 'Mortgage loan interest (max 100k THB/yr)',
    'lbl-other-deduct': 'Other deductions (parents, children, donation) (THB/yr)',
    'lbl-totalIncome': 'Total annual income:',
    'lbl-expenseDeduct': 'Expense deduction (up to 100,000):',
    'lbl-personalDeduct': 'Personal allowance:',
    'lbl-pvdDeduct': 'Provident Fund (PVD) deduction:',
    'lbl-ssoDeduct': 'Social Security deduction (annual):',
    'lbl-moreDeduct': 'Additional deductions:',
    'lbl-netIncome': 'Net taxable income:',
    'lbl-taxAmount': 'Estimated tax payable',
    'lbl-breakdownTitle': 'Tax breakdown by bracket (Waterfall)',
    'txt-advisor-title': 'Tax Optimization & Deduction Capacity',
    'lbl-capacity-title': '📊 Deduction Capacity & Remaining Quota',
    'lbl-sim-title': '⚡ Simulated Tax Savings (What-If)',
    'lbl-sim-pills': 'Invest extra:',
    'btn-apply-sim': '✓ Apply to Deductions',
    'btn-advisor-drop': '🎯 Drop 1 Bracket',
    'btn-advisor-max': '🌟 Maximize Deductions',
    'btn-advisor-revert': '↺ Revert Changes',
    'lbl-copy-tax': '📋 Copy Tax Summary',
    'lbl-print-tax': '🖨️ Print / Save PDF',
    'lbl-undo-tax': 'Undo',
    'lbl-undo-tax-top': 'Undo',
    'lbl-reset-tax': 'Clear Form',
    'lbl-reset-taxbase-layout': 'Reset Layout',
    'lbl-panel-income': '1. Income Details',
    'lbl-panel-deductions': '2. Deductions & Withholding',
    'lbl-panel-results': '3. Tax Summary & Refund',
    'print-doc-sub': 'Tax Return Estimate & Allowances Statement for Annual Filing',
    'print-lbl-sec1': 'Part 1: Assessable Income',
    'print-lbl-income-main': 'Salary & Wages (Section 40(1))',
    'print-lbl-income-bonus': 'Bonus & Other Income (Section 40(2))',
    'print-lbl-income-total': 'Total Assessable Income',
    'print-lbl-sec2': 'Part 2: Deductions & Allowances',
    'print-lbl-deduct-expense': 'Statutory expense deduction (50% max 100k THB)',
    'print-lbl-deduct-personal': 'Personal taxpayer allowance',
    'print-lbl-deduct-sso': 'Social Security Fund (SSO)',
    'print-lbl-deduct-pvd': 'Provident Fund (PVD)',
    'print-lbl-deduct-fund': 'Retirement Funds (SSF / RMF)',
    'print-lbl-deduct-thaiesg': 'Thai ESG Fund',
    'print-lbl-deduct-ins': 'Life & Health Insurance',
    'print-lbl-deduct-mortgage': 'Mortgage loan interest',
    'print-lbl-deduct-easyreceipt': 'Easy E-Receipt scheme',
    'print-lbl-deduct-other': 'Other deductions & donations',
    'print-lbl-deduct-total': 'Total Deductions & Allowances',
    'print-lbl-sec3': 'Part 3: Progressive Tax Computation Waterfall',
    'print-th-tier': 'Net Income Bracket',
    'print-th-taxable': 'Taxable in Tier',
    'print-th-rate': 'Rate',
    'print-th-tax': 'Tax in Tier',
    'print-lbl-netincome': 'Net Taxable Income: ',
    'print-lbl-toprate': 'Top Marginal Rate: ',
    'print-lbl-effrate': 'Effective Rate: ',
    'print-lbl-totaltax': 'Total Tax Payable: ',
    'print-lbl-notes-title': '📌 Filing Notes & Checklist (P.N.D.91/90):',
    'print-note-1': 'Paper filing deadline: March 31 / Online E-Filing deadline: April 8 annually.',
    'print-note-2':
      'Prepare supporting documents: 50 Tawi withholding tax cert, insurance certs, SSF/RMF/ThaiESG confirmations, and mortgage certs.',
    'print-note-3':
      '100% private and computed locally in your browser by Money Superapp. No financial data leaves your device.',
    'txt-withheld-label': 'Annual Tax Withheld to Date (50 Tawi)',
    'txt-import-payslip': 'Import from Payslips',
    'lbl-withheld-hint':
      'Total tax already withheld from monthly salaries, bonus, or freelance income (stated on 50 Tawi withholding certificate) to determine refund or additional payable.',
    'lbl-withheld-unit': 'THB',
    'lbl-net-balance-headline': 'Net Filing Outcome',
    'lbl-card-calc-tax': 'Calculated Tax:',
    'lbl-card-withheld-tax': 'Withheld (50 Tawi):',
    'print-lbl-withheld': 'Tax Withheld to Date (50 Tawi): ',
    'print-lbl-netbalance': 'Net Return Balance: ',
    'lbl-panel-scenario': '4. ⚖️ Tax Scenario & Inflation Stress-Tester (Bracket Creep)',
    'lbl-compare-header': '📊 Scenario A (Current) vs Scenario B (Comparison)',
    'lbl-copy-curr-b': '📋 Copy Current to B',
    'lbl-scen-income': 'Scenario B Gross Income (THB/yr):',
    'lbl-scen-ded': 'Scenario B Other Deductions (THB/yr):',
    'lbl-scen-infl': 'Annual Inflation Rate (%):',
    'lbl-panel-calendar': '5. 🗓️ Tax Planning Calendar & Deadlines (P.N.D. 90/91/94)',
    'lbl-tax-calendar-header': 'Statutory Tax Deadlines & Compliance Checklist',
    'lbl-reset-tax-calendar': '↺ Reset Checklist',
    'lbl-next-deadline-title': 'Upcoming Statutory Deadline:',
    'lbl-tax-calendar-tip-title': 'Year-End Deduction Planning Advice',
    'lbl-tax-calendar-tip-desc':
      'Tax-deductible investments (SSF, RMF, ThaiESG, and eligible life/health insurance) must be fully executed and paid by December 31 of the tax year. Ensure you provide electronic disclosure consent to fund managers/insurers for automated Revenue Department verification.',
    'lbl-div-credit-title': 'Thai Stock Dividend Tax Credit (Section 47 bis)',
    'lbl-div-credit-sub': 'Simulate tax refund via Section 47 bis credit vs 10% Final Tax',
    'lbl-div-amount': 'Annual Total Dividends Received (THB)',
    'lbl-div-amount-sub': 'Before 10% withholding tax',
    'lbl-cit-rate': 'Paying Company Corporate Income Tax Rate (CIT)',
    'opt-cit-20': '20% (Standard Thai Listed Companies - 25% credit)',
    'opt-cit-25': '25% (Concessionary / Legacy Corporate Rate - 33.33% credit)',
    'opt-cit-15': '15% (SME / Reduced Concession Rate - 17.65% credit)',
    'opt-cit-0': '0% (BOI Tax Exempt / Non-Creditable Distributions)',
    'lbl-opt-final-tax': 'Option 1: 10% Final Tax (Separate)',
    'desc-opt-final-tax': '10% deducted at source, omitted from annual tax return',
    'lbl-opt-claim-credit': 'Option 2: Claim Tax Credit (Sec 47 bis)',
    'desc-opt-claim-credit': 'Gross-up dividend & claim refund credit',
    'lbl-apply-div-tax': 'Include in total annual tax computation',
    'lbl-panel-efiling': '📋 P.N.D. 90/91 e-Filing Worksheet (Revenue Dept.)',
    lblBtnCopyAllEFiling: 'Copy Full Summary',
    lblEFilingPortalDesc:
      'Ordered to match the Revenue Department e-Filing screen (efiling.rd.go.th). Click copy icons to paste into RD online.',
    linkRdOnline: 'Open RD Online ➔',
    lblEfStep1Title: 'Step 1: Assessable Income (RD Step 2)',
    lblEf401: 'Section 40(1) Salary & Bonus',
    subEf401: 'Annual salary + bonus total',
    lblEf402: 'Section 40(2) Freelance & Commission',
    subEf402: 'Commissions & service fees',
    lblEf404b: 'Section 40(4)(b) Thai Share Dividends',
    subEf404b: 'With dividend tax credit',
    lblEfExpense: 'Statutory expense deduction (50% max 100k)',
    lblEfStep2Title: 'Step 2: Tax Deductions (RD Step 3)',
    lblEfGroupA: 'Group A: Personal & Family',
    subEfGroupA: 'Self 60k + spouse/children/parents',
    lblEfGroupB: 'Group B: Insurance & Retirement',
    subEfGroupB: 'SSO + PVD + SSF + RMF + ThaiESG + Life Ins',
    lblEfGroupC: 'Group C: Mortgage Interest',
    subEfGroupC: 'Home loan interest (max 100k)',
    lblEfGroupD: 'Group D: Donations',
    subEfGroupD: 'e-Donation (2x) + General donation',
    lblEfNetBalanceTitle: 'Net Tax Outcome:',
    descEfNetBalance: 'Reconciled with 50 Tawi withholding and dividend tax credit',
    lblBridgeTaxAccrualMonthly: 'Reserve Monthly Tax in Budget (Remaining Money)',
    lblBridgeTaxAccrualInstallments: 'Reserve 3-Installment Plan (0%) in Budget',
    lblBridgeTaxRefundToDebt: 'Send Tax Refund to Lump-Sum Debt Payoff',
    lblBridgeTaxRefundToRebalance: 'Send Refund to Rebalance Portfolio',
    lblStepDownTitle: 'Tax Bracket Step-Down Analyzer',
    lblMetricStepDownNeed: 'Deductions to Step Down',
    lblMetricStepDownSaved: 'Instant Tax Savings',
    lblMetricStepDownRoi: 'Tax Return (ROI)',
    lblMetricToTaxFree: 'Deductions to Tax-Free',
    lblBtnCopyStepDown: 'Copy Target Deduction',
    lblBtnBridgeStepDownRebalance: 'Send Target to Rebalance DCA',
    lblPreflightTitle: 'Pre-Flight E-Filing Checklist (Revenue Dept)',
    btnCheckAllPreflight: '✓ Check All',
    btnResetPreflight: 'Reset',
    'lbl-chk-50tawi': '1. Verify all 50 Tawi withholding tax certificates',
    'sub-chk-50tawi': 'Reconcile salary, bonus, and freelance income with actual company certificates',
    'lbl-chk-pool500k': '2. Retirement group (PVD + SSF + RMF) does not exceed 500,000 THB cap',
    'sub-chk-pool500k': 'Complies with Revenue Code Section 47 without unallowable excess',
    'lbl-chk-thaiesg': '3. Thai ESG fund complies with statutory limits',
    'sub-chk-thaiesg': 'Up to 300,000 THB (and max 30% of income) with full 5-year holding period',
    'lbl-chk-consent': '4. Confirm electronic consent for automated tax data transfer',
    'sub-chk-consent': 'Authorize asset management and insurance companies to submit data to the Revenue Department',
    'lbl-chk-promptpay': '5. Link PromptPay with 13-digit National Citizen ID',
    'sub-chk-promptpay': 'For direct refund deposit from Revenue Dept without postal check delays',
    btnCopyNetBalance: '📋 Copy Net Balance',
    btnBridgeTaxAccrualMonthly: 'Reserve Monthly Tax in Budget (Remaining Money)',
    btnBridgeTaxAccrualInstallments: 'Reserve 3-Installment Plan (0%) in Budget',
    lblPool500kTitle: 'Retirement Deduction Group 500,000 THB Statutory Ceiling (Sec. 47)',
    lblPoolExcessTitle: 'Retirement Fund Contributions Exceed Statutory 500k Ceiling',
    lblPoolExcessDesc:
      'Your combined PVD + SSF + RMF contributions exceed the 500,000 THB Section 47 ceiling by <strong id="valPoolExcessAmount" class="font-mono">0</strong> THB. The Revenue Department will automatically cap your deduction at 500,000 THB.',
  },
};

if (typeof window !== 'undefined' && window.MoneyApp?.I18n) {
  MoneyApp.I18n.register('th', translations.th);
  MoneyApp.I18n.register('en', translations.en);
  MoneyApp.I18n.applyLocalization(document, LANG);
}

const EN = translations.en;

if (LANG === 'en') {
  document.title = 'Personal Income Tax Calculator';
  Object.keys(EN).forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      if (id === 'lblPoolExcessDesc') el.innerHTML = EN[id];
      else el.textContent = EN[id];
    }
  });
  const printPersonalVal = document.getElementById('print-val-deduct-personal');
  if (printPersonalVal) printPersonalVal.textContent = '- 60,000 THB';
  const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 1; i <= 12; i++) {
    const mEl = document.getElementById(`lbl-m-${i}`);
    if (mEl) mEl.textContent = enMonths[i - 1];
  }
  document.getElementById('personalDeductVal').textContent = '- 60,000 THB';
  document.getElementById('unitLabel').textContent = ' THB';
  document.getElementById('totalIncome').textContent = '0 THB';
  document.getElementById('expenseDeduct').textContent = '- 0 THB';
  document.getElementById('pvdDeduct').textContent = '- 0 THB';
  document.getElementById('ssoDeduct').textContent = '- 0 THB';
  document.getElementById('netIncome').textContent = '0 THB';
  if (document.getElementById('moreDeduct')) {
    document.getElementById('moreDeduct').textContent = '- 0 THB';
  }
  if (document.getElementById('badgeEfPreflightStatus')) {
    document.getElementById('badgeEfPreflightStatus').textContent = '0/5 Not Ready';
  }
  if (document.getElementById('months-breakdown-total')) {
    document.getElementById('months-breakdown-total').textContent = '0 THB';
  }
  const placeholders = {
    salary: 'e.g. 50000',
    bonus: 'e.g. 100000',
    pvd: 'e.g. 5',
    yearlyIncome: 'e.g. 600000',
    yearlyBonus: 'e.g. 50000',
    yearlyPvd: 'e.g. 30000 (0 if none)',
    yearlySso: 'e.g. 9000 (0 if freelance/uninsured)',
    withheldTax: 'e.g. 25000',
    scenIncome: 'e.g. 600000',
    scenDeductions: 'e.g. 100000',
    scenInflation: 'e.g. 4',
  };
  Object.keys(placeholders).forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = placeholders[id];
  });
}

let incomeMode = 'monthly';

function switchIncomeMode(mode) {
  incomeMode = mode;
  const tabMonthly = document.getElementById('tab-mode-monthly');
  const tabYearly = document.getElementById('tab-mode-yearly');
  const secMonthly = document.getElementById('section-monthly');
  const secYearly = document.getElementById('section-yearly');

  if (mode === 'yearly') {
    tabYearly.classList.add('active');
    tabYearly.setAttribute('aria-selected', 'true');
    tabMonthly.classList.remove('active');
    tabMonthly.setAttribute('aria-selected', 'false');
    secYearly.style.display = 'block';
    secMonthly.style.display = 'none';

    // If yearlyIncome is empty but salary exists, prefill yearly = salary * 12
    const curSalary = parseNum(document.getElementById('salary').value);
    const curYearly = document.getElementById('yearlyIncome').value;
    if (curSalary > 0 && !curYearly) {
      document.getElementById('yearlyIncome').value = curSalary * 12;
    }
    const curBonus = document.getElementById('bonus').value;
    if (curBonus && !document.getElementById('yearlyBonus').value) {
      document.getElementById('yearlyBonus').value = curBonus;
    }

    // If yearlyPvd is empty but pvd% and salary exist, prefill yearlyPvd
    const curPvdPct = parseNum(document.getElementById('pvd').value);
    if (curPvdPct > 0 && !document.getElementById('yearlyPvd').value && curSalary > 0) {
      document.getElementById('yearlyPvd').value = Math.round(curSalary * 12 * (curPvdPct / 100));
    }

    // If yearlySso is empty, prefill from ssoCap
    const curSsoCap = parseNum(document.getElementById('ssoCap').value);
    if (!document.getElementById('yearlySso').value) {
      if (document.getElementById('ssoCap').value === '0') {
        document.getElementById('yearlySso').value = '0';
      } else if (curSalary > 0) {
        const monthlySso = Math.min(curSalary * 0.05, curSsoCap || 875);
        document.getElementById('yearlySso').value = Math.round(monthlySso * 12);
      }
    }
  } else {
    tabMonthly.classList.add('active');
    tabMonthly.setAttribute('aria-selected', 'true');
    tabYearly.classList.remove('active');
    tabYearly.setAttribute('aria-selected', 'false');
    secMonthly.style.display = 'block';
    secYearly.style.display = 'none';

    const curYInc = parseNum(document.getElementById('yearlyIncome').value);
    if (curYInc > 0 && !document.getElementById('salary').value) {
      document.getElementById('salary').value = Math.round(curYInc / 12);
    }

    const curYBonus = document.getElementById('yearlyBonus').value;
    if (curYBonus && !document.getElementById('bonus').value) {
      document.getElementById('bonus').value = curYBonus;
    }

    const curYPvd = parseNum(document.getElementById('yearlyPvd').value);
    if (curYPvd > 0 && curYInc > 0 && !document.getElementById('pvd').value) {
      document.getElementById('pvd').value = Math.min(15, Math.round((curYPvd / curYInc) * 100));
    }

    const curYSso = parseNum(document.getElementById('yearlySso').value);
    if (document.getElementById('yearlySso').value !== '') {
      if (curYSso === 0) {
        document.getElementById('ssoCap').value = '0';
      }
    }
  }
  calculateTax();
}

function calcMonthlyBreakdown() {
  let sum = 0;
  for (let i = 1; i <= 12; i++) {
    const val = parseNum(document.getElementById(`m-income-${i}`).value);
    sum += val;
  }
  document.getElementById('months-breakdown-total').textContent = `${formatMoney(sum)} ${unit}`;
  if (sum > 0) {
    document.getElementById('yearlyIncome').value = sum;
  }
  calculateTax();
}

function formatMoney(amount) {
  return amount.toLocaleString(LANG === 'en' ? 'en-US' : 'th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const STORAGE_KEY = 'moneySuperapp.taxBase';

function saveState() {
  const data = {
    incomeMode: incomeMode,
    salary: document.getElementById('salary').value,
    bonus: document.getElementById('bonus').value,
    yearlyIncome: document.getElementById('yearlyIncome') ? document.getElementById('yearlyIncome').value : '',
    yearlyBonus: document.getElementById('yearlyBonus') ? document.getElementById('yearlyBonus').value : '',
    yearlyPvd: document.getElementById('yearlyPvd') ? document.getElementById('yearlyPvd').value : '',
    yearlySso: document.getElementById('yearlySso') ? document.getElementById('yearlySso').value : '',
    pvd: document.getElementById('pvd').value,
    ssoCap: document.getElementById('ssoCap').value,
    fundDeduct: document.getElementById('fundDeduct').value,
    thaiEsgDeduct: document.getElementById('thaiEsgDeduct') ? document.getElementById('thaiEsgDeduct').value : '',
    easyReceiptDeduct: document.getElementById('easyReceiptDeduct')
      ? document.getElementById('easyReceiptDeduct').value
      : '',
    insuranceDeduct: document.getElementById('insuranceDeduct').value,
    mortgageDeduct: document.getElementById('mortgageDeduct').value,
    otherDeduct: document.getElementById('otherDeduct').value,
    withheldTax: document.getElementById('withheldTax') ? document.getElementById('withheldTax').value : '',
    dividendAmount: document.getElementById('inpDividendAmount')
      ? document.getElementById('inpDividendAmount').value
      : '',
    dividendCitRate: document.getElementById('selCitRate') ? document.getElementById('selCitRate').value : '0.20',
    applyDividendToTax: document.getElementById('chkApplyDividendToTax')
      ? document.getElementById('chkApplyDividendToTax').checked
      : false,
    monthsBreakdown: Array.from({ length: 12 }, (_, i) =>
      document.getElementById(`m-income-${i + 1}`) ? document.getElementById(`m-income-${i + 1}`).value : '',
    ),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_e) {}
}

function computeTaxWaterfall(netIncome) {
  const brackets = [
    { limit: 150000, rate: 0, color: '#10b981', labelTh: '0 - 150,000', labelEn: '0 - 150,000' },
    { limit: 150000, rate: 0.05, color: '#06b6d4', labelTh: '150,001 - 300,000', labelEn: '150,001 - 300,000' },
    { limit: 200000, rate: 0.1, color: '#3b82f6', labelTh: '300,001 - 500,000', labelEn: '300,001 - 500,000' },
    { limit: 250000, rate: 0.15, color: '#6366f1', labelTh: '500,001 - 750,000', labelEn: '500,001 - 750,000' },
    { limit: 250000, rate: 0.2, color: '#8b5cf6', labelTh: '750,001 - 1,000,000', labelEn: '750,001 - 1,000,000' },
    {
      limit: 1000000,
      rate: 0.25,
      color: '#f59e0b',
      labelTh: '1,000,001 - 2,000,000',
      labelEn: '1,000,001 - 2,000,000',
    },
    { limit: 3000000, rate: 0.3, color: '#f97316', labelTh: '2,000,001 - 5,000,000', labelEn: '2,000,001 - 5,000,000' },
    { limit: Infinity, rate: 0.35, color: '#ef4444', labelTh: '5,000,001 ขึ้นไป', labelEn: 'Over 5,000,000' },
  ];

  let remaining = Math.max(0, netIncome);
  let totalTax = 0;
  const tiers = [];
  let topMarginalRate = 0;
  let headroom = 0;
  let nextBracketRate = 0;

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i];
    if (remaining <= 0 && tiers.length > 0) break;

    const taxable = Math.min(remaining, b.limit);
    const tax = taxable * b.rate;
    totalTax += tax;
    remaining -= taxable;

    const isFull = taxable === b.limit;
    const pctOfTier = b.limit === Infinity ? 100 : Math.min(100, Math.round((taxable / b.limit) * 100));
    const pctOfNet = netIncome > 0 ? (taxable / netIncome) * 100 : 0;

    topMarginalRate = Math.round(b.rate * 100);
    headroom = b.limit === Infinity ? Infinity : Math.max(0, b.limit - taxable);
    nextBracketRate = i + 1 < brackets.length ? Math.round(brackets[i + 1].rate * 100) : 35;

    tiers.push({
      index: i,
      rate: b.rate,
      ratePct: Math.round(b.rate * 100),
      labelTh: b.labelTh,
      labelEn: b.labelEn,
      color: b.color,
      limit: b.limit,
      taxable,
      tax,
      isFull,
      pctOfTier,
      pctOfNet,
      headroom,
    });
  }

  return {
    netIncome,
    totalTax,
    topMarginalRate,
    headroom,
    nextBracketRate,
    tiers,
  };
}

function calculateTaxRefundOrPayable({ calculatedTax = 0, withheldTax = 0 } = {}) {
  const calc = Math.max(0, Number(calculatedTax) || 0);
  const withheld = Math.max(0, Number(withheldTax) || 0);
  const netBalance = withheld - calc;
  const amount = Math.abs(netBalance);

  let status = 'exact';
  if (netBalance > 0) {
    status = 'refund';
  } else if (netBalance < 0) {
    status = 'payable';
  }

  const canInstallment = status === 'payable' && amount >= 3000;
  const installmentCount = canInstallment ? 3 : 1;
  const installmentAmount = canInstallment ? Math.ceil(amount / 3) : amount;

  return {
    calculatedTax: calc,
    withheldTax: withheld,
    netBalance,
    amount,
    status,
    canInstallment,
    installmentCount,
    installmentAmount,
    headlineTh: status === 'refund' ? 'ขอคืนภาษีได้' : status === 'payable' ? 'ต้องชำระภาษีเพิ่ม' : 'ภาษีพอดี (ไม่ต้องจ่ายเพิ่ม)',
    headlineEn:
      status === 'refund'
        ? 'Tax Refund Eligible'
        : status === 'payable'
          ? 'Additional Tax Payable'
          : 'Exact Balance (No Tax Due)',
  };
}

function updateTaxRefundView(metrics) {
  const cardEl = document.getElementById('taxRefundCard');
  if (!cardEl) return;
  const isEn = LANG === 'en';
  const badgeEl = document.getElementById('refundVerdictBadge');
  const subEl = document.getElementById('refundComparisonSub');
  const amountEl = document.getElementById('refundNetBalanceAmount');
  const calcValEl = document.getElementById('cardCalcTaxVal');
  const withheldValEl = document.getElementById('cardWithheldVal');
  const actionBoxEl = document.getElementById('refundActionBox');

  if (calcValEl) calcValEl.textContent = `${formatMoney(metrics.calculatedTax)} ${unit}`;
  if (withheldValEl) withheldValEl.textContent = `${formatMoney(metrics.withheldTax)} ${unit}`;

  if (metrics.status === 'refund') {
    cardEl.className = 'mt-4 p-4 rounded-xl border space-y-3 transition-all duration-300';
    cardEl.style.background = 'var(--ok-dim)';
    cardEl.style.borderColor = 'var(--ok)';
    if (badgeEl) {
      badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs';
      badgeEl.style.background = 'var(--ok)';
      badgeEl.style.color = '#FFFFFF';
      badgeEl.innerHTML = `<span>🎉</span> <span>${isEn ? 'Tax Refund Eligible' : 'ขอคืนภาษีได้'}</span>`;
    }
    if (subEl) subEl.textContent = isEn ? 'Withholding exceeds PIT liability' : 'ภาษีที่หักไว้เกินกว่าภาษีจริง';
    if (amountEl) {
      amountEl.className = 'text-2xl sm:text-3xl font-black tracking-tight';
      amountEl.style.color = 'var(--ok)';
      amountEl.textContent = `+ ${formatMoney(metrics.amount)} ${unit}`;
    }
    if (actionBoxEl) {
      actionBoxEl.className = 'p-2.5 rounded-lg text-xs leading-relaxed border';
      actionBoxEl.style.background = 'var(--panel)';
      actionBoxEl.style.borderColor = 'var(--line)';
      actionBoxEl.style.color = 'var(--ink)';
      actionBoxEl.innerHTML = isEn
        ? '💡 <strong>Refund Ready:</strong> Ensure your PromptPay is linked to your 13-digit National ID or provide verified bank account details during e-Filing for the quickest direct deposit refund.'
        : '💡 <strong>คำแนะนำการรับเงินคืน:</strong> แนะนำให้ผูกพร้อมเพย์ด้วยเลขบัตรประชาชน 13 หลัก หรือระบุเลขที่บัญชีธนาคารในระบบ E-Filing กรมสรรพากร เพื่อรับเงินคืนภาษีได้อย่างรวดเร็วที่สุด';
    }
  } else if (metrics.status === 'payable') {
    cardEl.className = 'mt-4 p-4 rounded-xl border space-y-3 transition-all duration-300';
    cardEl.style.background = 'var(--warn-dim)';
    cardEl.style.borderColor = 'var(--warn)';
    if (badgeEl) {
      badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs';
      badgeEl.style.background = 'var(--warn)';
      badgeEl.style.color = '#FFFFFF';
      badgeEl.innerHTML = `<span>⚠️</span> <span>${isEn ? 'Additional Tax Payable' : 'ต้องชำระภาษีเพิ่ม'}</span>`;
    }
    if (subEl) subEl.textContent = isEn ? 'PIT liability exceeds withholding' : 'ภาษีจริงสูงกว่ายอดที่ถูกหักไว้';
    if (amountEl) {
      amountEl.className = 'text-2xl sm:text-3xl font-black tracking-tight';
      amountEl.style.color = 'var(--warn)';
      amountEl.textContent = `- ${formatMoney(metrics.amount)} ${unit}`;
    }
    if (actionBoxEl) {
      actionBoxEl.className = 'p-2.5 rounded-lg text-xs leading-relaxed border';
      actionBoxEl.style.background = 'var(--panel)';
      actionBoxEl.style.borderColor = 'var(--line)';
      actionBoxEl.style.color = 'var(--ink)';
      if (metrics.canInstallment) {
        actionBoxEl.innerHTML = isEn
          ? `💡 <strong>3-Month Installment Available:</strong> You owe ${formatMoney(metrics.amount)} ${unit} (≥ 3,000 THB threshold). You can opt to split into 3 monthly 0% installments of <strong>${formatMoney(metrics.installmentAmount)} ${unit}/month</strong> via Revenue Dept e-Filing.`
          : `💡 <strong>สิทธิผ่อนชำระ 3 งวด:</strong> มียอดภาษีชำระเพิ่ม ${formatMoney(metrics.amount)} ${unit} (ตั้งแต่ 3,000 บาทขึ้นไป) สามารถเลือกผ่อนชำระ 3 งวด งวดละ <strong>${formatMoney(metrics.installmentAmount)} บาท/งวด</strong> โดยไม่มีดอกเบี้ย ผ่านระบบ E-Filing`;
      } else {
        actionBoxEl.innerHTML = isEn
          ? `💡 <strong>Payment Reminder:</strong> Settle the outstanding tax of <strong>${formatMoney(metrics.amount)} ${unit}</strong> via QR Code, credit card, or bank transfer before the annual filing deadline.`
          : `💡 <strong>ข้อแนะนำ:</strong> ชำระภาษีส่วนที่ขาดจำนวน <strong>${formatMoney(metrics.amount)} บาท</strong> ผ่าน QR Code, บัตรเครดิต หรือเคาน์เตอร์ธนาคาร ก่อนครบกำหนดยื่นแบบเพื่อเลี่ยงเบี้ยปรับเงินเพิ่ม`;
      }
    }
  } else {
    cardEl.className = 'mt-4 p-4 rounded-xl border space-y-3 transition-all duration-300';
    cardEl.style.background = 'var(--panel-2)';
    cardEl.style.borderColor = 'var(--line)';
    if (badgeEl) {
      badgeEl.className = 'px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-xs';
      badgeEl.style.background = 'var(--core)';
      badgeEl.style.color = '#FFFFFF';
      badgeEl.innerHTML = `<span>✓</span> <span>${isEn ? 'Exact Balance' : 'ภาษีพอดี'}</span>`;
    }
    if (subEl) subEl.textContent = isEn ? 'Calculated tax matches withholding' : 'ภาษีคำนวณตรงกับยอดหัก ณ ที่จ่าย';
    if (amountEl) {
      amountEl.className = 'text-2xl sm:text-3xl font-black tracking-tight';
      amountEl.style.color = 'var(--core)';
      amountEl.textContent = `0 ${unit}`;
    }
    if (actionBoxEl) {
      actionBoxEl.className = 'p-2.5 rounded-lg text-xs leading-relaxed border';
      actionBoxEl.style.background = 'var(--panel)';
      actionBoxEl.style.borderColor = 'var(--line)';
      actionBoxEl.style.color = 'var(--ink)';
      actionBoxEl.innerHTML = isEn
        ? '💡 <strong>Balanced Tax:</strong> Your withheld tax matches your calculated liability exactly. File your annual return normally with zero additional balance.'
        : '💡 <strong>ยอดภาษีพอดี:</strong> ภาษีที่ถูกหักไว้ตรงกับยอดที่ต้องชำระพอดี ยื่นแบบแสดงรายการตามปกติโดยไม่ต้องชำระเพิ่มและไม่มีเงินภาษีคืน';
    }
  }

  // Phase 76: Action Bridges for Payable Accrual and Refund Deployment
  lastTaxRefundMetrics = metrics;
  const payableBridgeGroup = document.getElementById('taxPayableBridgeGroup');
  const refundBridgeGroup = document.getElementById('taxRefundBridgeGroup');
  const btnMonthlyAccrual = document.getElementById('btnBridgeTaxAccrualMonthly');
  const lblMonthlyAccrual = document.getElementById('lblBridgeTaxAccrualMonthly');
  const btnInstallments = document.getElementById('btnBridgeTaxAccrualInstallments');
  const lblInstallments = document.getElementById('lblBridgeTaxAccrualInstallments');
  const lblRefundToDebt = document.getElementById('lblBridgeTaxRefundToDebt');
  const lblRefundToRebalance = document.getElementById('lblBridgeTaxRefundToRebalance');

  if (metrics.status === 'payable' && metrics.amount > 0) {
    if (payableBridgeGroup) payableBridgeGroup.style.display = 'flex';
    if (refundBridgeGroup) refundBridgeGroup.style.display = 'none';

    const monthlyVal = Math.round(metrics.amount / 12);
    if (lblMonthlyAccrual) {
      lblMonthlyAccrual.textContent = isEn
        ? `Reserve Monthly Tax (${formatMoney(monthlyVal)} ${unit}/mo) in Budget`
        : `ตั้งสำรองจ่ายภาษีรายเดือน (${formatMoney(monthlyVal)} บาท/เดือน) ในงบประมาณ`;
    }

    if (btnInstallments) {
      if (metrics.canInstallment) {
        btnInstallments.style.display = 'inline-flex';
        if (lblInstallments) {
          lblInstallments.textContent = isEn
            ? `Reserve 3-Installment Plan (${formatMoney(metrics.installmentAmount)} ${unit}/mo) in Budget`
            : `ตั้งงบผ่อนชำระ 3 งวด (งวดละ ${formatMoney(metrics.installmentAmount)} บาท/เดือน) ในงบประมาณ`;
        }
      } else {
        btnInstallments.style.display = 'none';
      }
    }
  } else if (metrics.status === 'refund' && metrics.amount > 0) {
    if (payableBridgeGroup) payableBridgeGroup.style.display = 'none';
    if (refundBridgeGroup) refundBridgeGroup.style.display = 'flex';

    if (lblRefundToDebt) {
      lblRefundToDebt.textContent = isEn
        ? `Send Tax Refund (${formatMoney(metrics.amount)} ${unit}) to Debt Payoff Windfall 💳`
        : `นำเงินคืนภาษี (${formatMoney(metrics.amount)} บาท) ไปเร่งโปะหนี้ก้อนใหญ่ (Windfall) 💳`;
    }
    if (lblRefundToRebalance) {
      lblRefundToRebalance.textContent = isEn
        ? `Send Refund (${formatMoney(metrics.amount)} ${unit}) to Rebalance Portfolio`
        : `นำเงินคืนภาษี (${formatMoney(metrics.amount)} บาท) ไปเพิ่มงบลงทุน Rebalance`;
    }
  } else {
    if (payableBridgeGroup) payableBridgeGroup.style.display = 'none';
    if (refundBridgeGroup) refundBridgeGroup.style.display = 'none';
  }
}

let lastTaxRefundMetrics = null;

function sendTaxPayableToBudget(type) {
  if (!lastTaxRefundMetrics || lastTaxRefundMetrics.amount <= 0) return;
  const isInstallment = type === 'installment';
  const monthlyAmount = isInstallment
    ? lastTaxRefundMetrics.installmentAmount
    : Math.round(lastTaxRefundMetrics.amount / 12);
  const totalTax = lastTaxRefundMetrics.amount;
  const payload = {
    plan: isInstallment ? 'installment' : 'monthly',
    monthlyAmount: monthlyAmount,
    totalTax: totalTax,
    months: isInstallment ? 3 : 12,
    nameTh: isInstallment ? 'ผ่อนชำระภาษี 3 งวด (ภ.ง.ด. 90/91)' : 'สำรองจ่ายภาษี ภ.ง.ด. 90/91 (12 เดือน)',
    nameEn: isInstallment ? 'Tax 3-Installment Plan (0%)' : 'Annual Tax Provision (12 Mo)',
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem('moneySuperapp.pendingTaxAccrual', JSON.stringify(payload));
  } catch (_e) {}
  jumpToTab('remaining');
}

function sendTaxRefundToDebt() {
  if (!lastTaxRefundMetrics || lastTaxRefundMetrics.amount <= 0) return;
  const payload = {
    amount: lastTaxRefundMetrics.amount,
    month: 3, // March / April filing windfall
    source: 'tax_refund',
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem('moneySuperapp.pendingDebtWindfall', JSON.stringify(payload));
  } catch (_e) {}
  jumpToTab('debt');
}

function sendTaxRefundToRebalance() {
  if (!lastTaxRefundMetrics || lastTaxRefundMetrics.amount <= 0) return;
  try {
    localStorage.setItem('moneySuperapp.pendingBudget', String(Math.round(lastTaxRefundMetrics.amount)));
  } catch (_e) {}
  jumpToTab('rebalance');
}

function jumpToTab(tabId) {
  if (window.parent && typeof window.parent.switchToTab === 'function') {
    window.parent.switchToTab(tabId);
  } else {
    const targetOrigin = window.location.origin && window.location.origin !== 'null' ? window.location.origin : '*';
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'switchToTab', target: tabId }, targetOrigin);
    } else {
      const fileMap = {
        remaining: 'remaining-money.html',
        debt: 'debt-calculator.html',
        rebalance: 'rebalance.html',
        dashboard: 'dashboard.html',
      };
      if (fileMap[tabId]) {
        window.location.href = fileMap[tabId];
      }
    }
  }
}
window.sendTaxPayableToBudget = sendTaxPayableToBudget;
window.sendTaxRefundToDebt = sendTaxRefundToDebt;
window.sendTaxRefundToRebalance = sendTaxRefundToRebalance;
window.jumpToTab = jumpToTab;

// Phase 79: Thai PIT Bracket Boundary & Step-Down Headroom Analyzer
let lastTaxStepDownMetrics = null;

function renderTaxBracketStepDown(netIncome) {
  const container = document.getElementById('boxTaxBracketStepDown');
  if (!container) return;

  const stepDown =
    typeof MoneyApp !== 'undefined' && MoneyApp.calculateTaxBracketStepDown
      ? MoneyApp.calculateTaxBracketStepDown(netIncome)
      : null;
  lastTaxStepDownMetrics = stepDown;
  if (!stepDown) return;

  const isEn = typeof LANG !== 'undefined' && LANG === 'en';
  const unit = isEn ? 'THB' : 'บาท';

  // Badges
  const badgeCur = document.getElementById('badgeCurrentBracket');
  const badgeTarget = document.getElementById('badgeTargetBracket');
  if (badgeCur) {
    badgeCur.textContent = isEn ? `Current: ${stepDown.currentRatePct}%` : `ฐานปัจจุบัน: ${stepDown.currentRatePct}%`;
  }
  if (badgeTarget) {
    if (stepDown.isTaxFree) {
      badgeTarget.textContent = isEn ? 'Goal: Tax-Exempt (0%)' : 'เป้าหมาย: ยกเว้นภาษี (0%)';
      badgeTarget.style.background = 'var(--ok-dim)';
      badgeTarget.style.borderColor = 'var(--ok)';
      badgeTarget.style.color = 'var(--ok)';
    } else {
      badgeTarget.textContent = isEn
        ? `Target: Step down to ${stepDown.nextLowerRatePct}%`
        : `เป้าหมายลดลงเหลือ: ${stepDown.nextLowerRatePct}%`;
      badgeTarget.style.background = 'var(--core-dim)';
      badgeTarget.style.borderColor = 'var(--core)';
      badgeTarget.style.color = 'var(--core)';
    }
  }

  // Metric values
  const valNeed = document.getElementById('valMetricStepDownNeed');
  const valSaved = document.getElementById('valMetricStepDownSaved');
  const valRoi = document.getElementById('valMetricStepDownRoi');
  const valTaxFree = document.getElementById('valMetricToTaxFree');

  if (valNeed) {
    valNeed.textContent = stepDown.isTaxFree ? `0 ${unit}` : `${formatMoney(stepDown.amountToStepDown)} ${unit}`;
  }
  if (valSaved) {
    valSaved.textContent = stepDown.isTaxFree ? `0 ${unit}` : `${formatMoney(stepDown.taxSavedAtStepDown)} ${unit}`;
  }
  if (valRoi) {
    valRoi.textContent = stepDown.isTaxFree ? '0%' : `${stepDown.stepDownRoiPct}%`;
  }
  if (valTaxFree) {
    valTaxFree.textContent = stepDown.isTaxFree
      ? isEn
        ? 'Tax-free reached'
        : 'ภาษี 0 บาทแล้ว'
      : `${formatMoney(stepDown.amountToTaxFree)} ${unit}`;
  }

  // Progress Bar
  const trackStart = document.getElementById('lblStepDownTrackStart');
  const trackProgress = document.getElementById('valStepDownTrackProgress');
  const trackEnd = document.getElementById('lblStepDownTrackEnd');
  const barProgress = document.getElementById('barStepDownProgress');

  if (trackStart) {
    trackStart.textContent = isEn
      ? `Lower: ${formatMoney(stepDown.lowerThreshold)}`
      : `ขั้นต่ำ: ${formatMoney(stepDown.lowerThreshold)}`;
  }
  if (trackProgress) {
    trackProgress.textContent = `${stepDown.progressInCurrentTierPct}% ${isEn ? 'in bracket' : 'ในขั้นนี้'}`;
  }
  if (trackEnd) {
    const pitTiers = (typeof MoneyApp !== 'undefined' && MoneyApp.THAI_PIT_TIERS) || [];
    const tier = pitTiers[stepDown.currentTierIndex];
    const maxVal = tier && tier.max !== Infinity ? `${formatMoney(tier.max)}` : isEn ? 'Max' : 'ไม่จำกัด';
    trackEnd.textContent = isEn ? `Cap: ${maxVal}` : `เพดาน: ${maxVal}`;
  }
  if (barProgress) {
    barProgress.style.width = `${stepDown.progressInCurrentTierPct}%`;
    barProgress.style.background = stepDown.isTaxFree
      ? 'var(--ok)'
      : stepDown.currentRatePct >= 25
        ? 'var(--warn)'
        : 'var(--core)';
  }

  // Callout Description
  const callout = document.getElementById('stepDownCalloutDesc');
  if (callout) {
    if (stepDown.isTaxFree) {
      const rem = Math.max(0, 150000 - stepDown.netTaxableIncome);
      callout.innerHTML = `🎉 <strong>${isEn ? 'Exempt Bracket:' : 'อยู่ในเกณฑ์ยกเว้นภาษี:'}</strong> ${isEn ? `Your taxable net income is within the 0% bracket. You still have ${formatMoney(rem)} THB of tax-free headroom before paying tax.` : `เงินได้สุทธิของคุณไม่เกิน 150,000 บาท อยู่ในเกณฑ์ยกเว้นภาษี 100% ยังมีโควตาเงินได้ปลอดภาษีเหลืออีก ${formatMoney(rem)} บาท`}`;
    } else {
      callout.innerHTML = `💡 <strong>${isEn ? 'Tax Step-Down Strategy:' : 'กลยุทธ์ลดฐานภาษี:'}</strong> ${
        isEn
          ? `Investing an additional <strong>${formatMoney(stepDown.amountToStepDown)} ${unit}</strong> in deductions (ThaiESG, SSF, RMF, or Insurance) drops your taxable income to <strong>${formatMoney(stepDown.lowerThreshold)} ${unit}</strong>, stepping down from the <strong>${stepDown.currentRatePct}%</strong> bracket to <strong>${stepDown.nextLowerRatePct}%</strong> and securing an instant guaranteed tax saving of <strong>${formatMoney(stepDown.taxSavedAtStepDown)} ${unit}</strong> (${stepDown.stepDownRoiPct}% immediate ROI).`
          : `หากลงทุนในค่าลดหย่อนเพิ่มเติม (ThaiESG, SSF, RMF หรือประกัน) อีก <strong>${formatMoney(stepDown.amountToStepDown)} ${unit}</strong> จะช่วยลดเงินได้สุทธิลงมาแตะที่ <strong>${formatMoney(stepDown.lowerThreshold)} ${unit}</strong> หลุดจากฐานภาษี <strong>${stepDown.currentRatePct}%</strong> ลงมาสู่ฐาน <strong>${stepDown.nextLowerRatePct}%</strong> ทันที พร้อมรับเงินคืนภาษีทันที <strong>${formatMoney(stepDown.taxSavedAtStepDown)} ${unit}</strong> (ผลตอบแทนภาษีเทียบเท่า ${stepDown.stepDownRoiPct}%)`
      }`;
    }
  }

  // Action buttons
  const btnRebalance = document.getElementById('btnBridgeStepDownToRebalance');
  if (btnRebalance) {
    if (stepDown.isTaxFree || stepDown.amountToStepDown <= 0) {
      btnRebalance.style.display = 'none';
    } else {
      btnRebalance.style.display = '';
    }
  }
}

function copyStepDownTarget(btn) {
  if (!lastTaxStepDownMetrics || lastTaxStepDownMetrics.amountToStepDown <= 0) return;
  const isEn = typeof LANG !== 'undefined' && LANG === 'en';
  navigator.clipboard.writeText(String(Math.round(lastTaxStepDownMetrics.amountToStepDown))).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = `<span>✓</span> <span>${isEn ? 'Copied!' : 'คัดลอกแล้ว!'}</span>`;
    setTimeout(() => {
      btn.innerHTML = orig;
    }, 1800);
  });
}

function sendStepDownToRebalance() {
  if (!lastTaxStepDownMetrics || lastTaxStepDownMetrics.amountToStepDown <= 0) return;
  const targetAnnual = Math.round(lastTaxStepDownMetrics.amountToStepDown);
  const monthlyDCA = Math.round(targetAnnual / 12);
  try {
    localStorage.setItem('moneySuperapp.pendingBudget', String(monthlyDCA));
    localStorage.setItem('moneySuperapp.pendingRebalanceSource', 'tax_stepdown');
  } catch (_e) {}
  jumpToTab('rebalance');
}

window.renderTaxBracketStepDown = renderTaxBracketStepDown;
window.copyStepDownTarget = copyStepDownTarget;
window.sendStepDownToRebalance = sendStepDownToRebalance;

function importWithholdingFromPayslip() {
  try {
    const raw = localStorage.getItem('moneySuperapp.monthsSlips');
    const feedbackEl = document.getElementById('payslip-import-feedback');
    const isEn = LANG === 'en';
    if (!raw) {
      if (feedbackEl) {
        feedbackEl.style.display = 'flex';
        feedbackEl.className =
          'p-2 rounded bg-amber-100 text-[11px] text-amber-900 font-medium flex items-center justify-between';
        feedbackEl.innerHTML = `<span>⚠️ ${isEn ? 'No payslip data found. Please calculate in Payslip tab first.' : 'ยังไม่พบข้อมูลสลิปเงินเดือน กรุณาเข้าใช้งานแท็บจำลองสลิปเงินเดือนก่อน'}</span><button type="button" onclick="this.parentElement.style.display='none'" class="text-amber-700 font-bold ml-2">✕</button>`;
      }
      return;
    }
    const slip = JSON.parse(raw);
    const salary = parseNum(slip.salary);
    const allowance = parseNum(slip.allowance);
    const bonus = parseNum(slip.bonus);
    const pvd = parseNum(slip.pvd);
    const ssoCap = parseNum(slip.ssoCap) || 875;

    const annualIncome = (salary + allowance) * 12 + bonus;
    const ssoMonthly = Math.min(salary * 0.05, ssoCap);
    const annualSso = ssoMonthly * 12;
    const annualPvd = salary * (pvd / 100) * 12;
    const expenseDeduction = Math.min(annualIncome * 0.5, 100000);
    const personalDeduction = 60000;
    const netAnnualIncome = Math.max(0, annualIncome - (expenseDeduction + personalDeduction + annualSso + annualPvd));

    const wf = computeTaxWaterfall(netAnnualIncome);
    const withheld = wf.totalTax;

    const inputEl = document.getElementById('withheldTax');
    if (inputEl) {
      undoMgr.push(captureSnapshot());
      inputEl.value = withheld;
      calculateTax();
      if (feedbackEl) {
        feedbackEl.style.display = 'flex';
        feedbackEl.className = 'p-2 rounded text-[11px] font-medium flex items-center justify-between';
        feedbackEl.style.background = 'var(--panel-2)';
        feedbackEl.style.border = '1px solid var(--core)';
        feedbackEl.style.color = 'var(--ink)';
        feedbackEl.innerHTML = `<span>✓ ${isEn ? `Imported ${formatMoney(withheld)} THB withholding from payslips` : `ดึงภาษีหัก ณ ที่จ่ายสำเร็จ: ${formatMoney(withheld)} บาท`}</span><button type="button" onclick="this.parentElement.style.display='none'" style="color:var(--core); font-weight:700; margin-left:8px; background:none; border:none; cursor:pointer;">✕</button>`;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function toggleDividendTaxCredit() {
  if (taxBaseLayoutManager?.toggleCard) {
    taxBaseLayoutManager.toggleCard('dividendTaxCreditCard');
    return;
  }
  const panel =
    document.getElementById('dividendTaxCreditCardBody') || document.getElementById('div-credit-panel-body');
  if (!panel) return;

  const isHidden = panel.classList.contains('card-collapsed-hidden') || panel.style.display === 'none';
  if (isHidden) {
    panel.classList.remove('card-collapsed-hidden');
    panel.style.display = 'block';
    updateDividendTaxCreditUI();
  } else {
    panel.classList.add('card-collapsed-hidden');
  }
}

function setDividendPreset(amt) {
  const inp = document.getElementById('inpDividendAmount');
  if (inp) {
    inp.value = amt;
    updateDividendTaxCreditUI();
  }
}

function toggleApplyDividendToTax() {
  const chk = document.getElementById('chkApplyDividendToTax');
  const badge = document.getElementById('badge-applied-status');
  const isEn = LANG === 'en';
  if (badge) {
    if (chk?.checked) {
      badge.textContent = isEn ? 'ACTIVE' : 'เปิดใช้งาน';
      badge.style.color = 'var(--ok)';
    } else {
      badge.textContent = isEn ? 'OFF' : 'ปิดอยู่';
      badge.style.color = 'var(--ink-dim)';
    }
  }
  calculateTax();
}

function updateDividendTaxCreditUI() {
  if (window.MoneyApp?.TaxWorksheet?.updateDividendTaxCreditUI) {
    window.MoneyApp.TaxWorksheet.updateDividendTaxCreditUI({
      LANG,
      calculateTax,
      formatMoney,
      parseNum,
    });
  }
}

window.toggleDividendTaxCredit = toggleDividendTaxCredit;
window.setDividendPreset = setDividendPreset;
window.toggleApplyDividendToTax = toggleApplyDividendToTax;
window.updateDividendTaxCreditUI = updateDividendTaxCreditUI;

function calculateTax() {
  saveState();

  let totalIncome = 0;
  let pvdDeduction = 0;
  let ssoDeduction = 0;

  if (incomeMode === 'yearly') {
    const yearlyIncome = parseNum(document.getElementById('yearlyIncome').value);
    const yearlyBonus = parseNum(document.getElementById('yearlyBonus').value);
    totalIncome = yearlyIncome + yearlyBonus;

    // PVD in yearly mode: total amount input in THB (statutory cap at 15% of annual income)
    const yearlyPvdInput = document.getElementById('yearlyPvd');
    const yearlyPvdVal =
      yearlyPvdInput && yearlyPvdInput.value !== ''
        ? parseNum(yearlyPvdInput.value)
        : parseNum(document.getElementById('pvd')?.value) > 0
          ? yearlyIncome * (parseNum(document.getElementById('pvd')?.value) / 100)
          : 0;
    const maxYearlyPvd = yearlyIncome > 0 ? yearlyIncome * 0.15 : Infinity;
    pvdDeduction = Math.min(yearlyPvdVal, maxYearlyPvd);

    const warnYearlyPvdEl = document.getElementById('warn-yearly-pvd');
    if (warnYearlyPvdEl) {
      if (yearlyPvdVal > maxYearlyPvd && yearlyIncome > 0) {
        warnYearlyPvdEl.textContent =
          LANG === 'en'
            ? `⚠️ Capped at 15% of annual income (${formatMoney(maxYearlyPvd)} THB)`
            : `⚠️ ใช้สิทธิ์ได้ไม่เกิน 15% ของเงินได้ทั้งปี (${formatMoney(maxYearlyPvd)} บาท)`;
        warnYearlyPvdEl.style.display = 'block';
      } else {
        warnYearlyPvdEl.style.display = 'none';
      }
    }

    // SSO in yearly mode: total amount input in THB (dynamic statutory cap based on active ssoCap)
    const yearlySsoInput = document.getElementById('yearlySso');
    const ssoCapVal = parseNum(document.getElementById('ssoCap')?.value);
    let yearlySsoVal = 0;
    if (yearlySsoInput && yearlySsoInput.value !== '') {
      yearlySsoVal = parseNum(yearlySsoInput.value);
    } else {
      if (ssoCapVal > 0) {
        yearlySsoVal = Math.min((yearlyIncome / 12) * 0.05, ssoCapVal) * 12;
      } else {
        yearlySsoVal = 0;
      }
    }
    const maxYearlySso = (ssoCapVal > 0 ? ssoCapVal : 875) * 12;
    ssoDeduction = Math.min(yearlySsoVal, maxYearlySso);

    const warnYearlySsoEl = document.getElementById('warn-yearly-sso');
    if (warnYearlySsoEl) {
      if (yearlySsoVal > maxYearlySso) {
        warnYearlySsoEl.textContent =
          LANG === 'en'
            ? `⚠️ Capped at statutory maximum of ${formatMoney(maxYearlySso)} THB/year`
            : `⚠️ ใช้สิทธิ์ได้สูงสุดไม่เกินเพดานกฎหมาย ${formatMoney(maxYearlySso)} บาท/ปี`;
        warnYearlySsoEl.style.display = 'block';
      } else {
        warnYearlySsoEl.style.display = 'none';
      }
    }
  } else {
    const salary = parseNum(document.getElementById('salary').value);
    const bonus = parseNum(document.getElementById('bonus').value);
    totalIncome = salary * 12 + bonus;

    const pvdPercent = parseNum(document.getElementById('pvd').value);
    pvdDeduction = salary * 12 * (pvdPercent / 100);

    const ssoCapVal = parseNum(document.getElementById('ssoCap').value);
    if (ssoCapVal > 0) {
      let ssoMonthly = salary * 0.05;
      if (ssoMonthly > ssoCapVal) ssoMonthly = ssoCapVal;
      ssoDeduction = ssoMonthly * 12;
    }
  }

  const fundDeduct = parseNum(document.getElementById('fundDeduct').value);
  const thaiEsgDeduct = parseNum(document.getElementById('thaiEsgDeduct')?.value);
  const easyReceiptDeduct = parseNum(document.getElementById('easyReceiptDeduct')?.value);
  const insuranceDeduct = parseNum(document.getElementById('insuranceDeduct').value);
  const mortgageDeduct = parseNum(document.getElementById('mortgageDeduct').value);
  const otherDeduct = parseNum(document.getElementById('otherDeduct').value);

  // Dividend Tax Credit Integration (ม.47 ทวิ แห่งประมวลรัษฎากร)
  const chkApplyDividend = document.getElementById('chkApplyDividendToTax');
  const inpDividend = document.getElementById('inpDividendAmount');
  const selCit = document.getElementById('selCitRate');
  const isDividendApplied = chkApplyDividend?.checked && inpDividend && parseNum(inpDividend.value) > 0;

  let dividendGrossedUp = 0;
  let dividendCredit = 0;
  let dividendWht = 0;
  if (isDividendApplied) {
    const rawDiv = parseNum(inpDividend.value);
    const citRate = selCit ? parseNum(selCit.value) : 0.2;
    const factor = citRate > 0 && citRate < 1 ? citRate / (1 - citRate) : 0;
    dividendCredit = Math.round(rawDiv * factor);
    dividendGrossedUp = rawDiv + dividendCredit;
    dividendWht = Math.round(rawDiv * 0.1);
  }

  // คำนวณค่าลดหย่อน (Section 40(1)/(2) standard 50% max 100k cap applies to earned income)
  const expenseDeduction = Math.min(totalIncome * 0.5, 100000);
  const personalDeduction = 60000;

  if (isDividendApplied) {
    totalIncome += dividendGrossedUp;
  }

  // กฎหมายภาษี: ตรวจสอบและบังคับใช้เพดานลดหย่อนตามประมวลรัษฎากร
  // 1. ดอกเบี้ยกู้บ้าน: สูงสุด 100,000 บาท
  const effectiveMortgage = Math.min(mortgageDeduct, 100000);
  const warnMortgageEl = document.getElementById('warn-mortgage');
  if (warnMortgageEl) {
    if (mortgageDeduct > 100000) {
      warnMortgageEl.textContent =
        LANG === 'en'
          ? `⚠️ Capped at 100,000 THB (excess of ${formatMoney(mortgageDeduct - 100000)} THB not deductible)`
          : `⚠️ ใช้สิทธิ์ได้สูงสุด 100,000 บาท (ส่วนเกิน ${formatMoney(mortgageDeduct - 100000)} บาท ไม่นำมาลดหย่อน)`;
      warnMortgageEl.style.display = 'block';
    } else {
      warnMortgageEl.style.display = 'none';
    }
  }

  // 2. ประกันชีวิต + สุขภาพ: รวมสูงสุด 100,000 บาท
  const effectiveInsurance = Math.min(insuranceDeduct, 100000);
  const warnInsEl = document.getElementById('warn-insurance');
  if (warnInsEl) {
    if (insuranceDeduct > 100000) {
      warnInsEl.textContent =
        LANG === 'en'
          ? `⚠️ Capped at 100,000 THB (excess of ${formatMoney(insuranceDeduct - 100000)} THB not deductible)`
          : `⚠️ ใช้สิทธิ์ได้สูงสุด 100,000 บาท (ส่วนเกิน ${formatMoney(insuranceDeduct - 100000)} บาท ไม่นำมาลดหย่อน)`;
      warnInsEl.style.display = 'block';
    } else {
      warnInsEl.style.display = 'none';
    }
  }

  // 3. กองทุน ThaiESG: สูงสุด 300,000 บาท หรือ 30% ของเงินได้ (เงื่อนไขปี 2024+)
  const esgEval =
    typeof MoneyApp !== 'undefined' && MoneyApp.evaluateThaiEsgDeduction
      ? MoneyApp.evaluateThaiEsgDeduction(thaiEsgDeduct, totalIncome, 2024)
      : {
          effectiveDeduction: Math.min(thaiEsgDeduct, Math.min(300000, totalIncome > 0 ? totalIncome * 0.3 : 300000)),
          statutoryCap: 300000,
          maxAllowed: Math.min(300000, totalIncome > 0 ? totalIncome * 0.3 : 300000),
          isExceeded: thaiEsgDeduct > Math.min(300000, totalIncome > 0 ? totalIncome * 0.3 : 300000) && totalIncome > 0,
          excessAmount: 0,
          holdingYears: 5,
        };
  const maxThaiEsg = esgEval.maxAllowed;
  const effectiveThaiEsg = esgEval.effectiveDeduction;
  const warnEsgEl = document.getElementById('warn-thaiesg');
  if (warnEsgEl) {
    if (esgEval.isExceeded) {
      warnEsgEl.textContent =
        LANG === 'en'
          ? `⚠️ Capped at ${formatMoney(maxThaiEsg)} THB (max 30% of income or ${formatMoney(esgEval.statutoryCap)} THB)`
          : `⚠️ ใช้สิทธิ์ได้สูงสุด ${formatMoney(maxThaiEsg)} บาท (ไม่เกิน 30% ของรายได้ หรือ ${formatMoney(esgEval.statutoryCap)} บาท)`;
      warnEsgEl.style.display = 'block';
    } else {
      warnEsgEl.style.display = 'none';
    }
  }

  // 4. กองทุนเกษียณ (SSF + RMF + PVD): เพดานรวมกันไม่เกิน 500,000 บาท
  const maxFundAllowed = Math.max(0, 500000 - pvdDeduction);
  const effectiveFund = Math.min(fundDeduct, maxFundAllowed);
  const warnFundEl = document.getElementById('warn-fund');
  if (warnFundEl) {
    if (fundDeduct + pvdDeduction > 500000) {
      warnFundEl.textContent =
        LANG === 'en'
          ? `⚠️ Combined with PVD (${formatMoney(pvdDeduction)} THB), max retirement pool is 500,000 THB (allowed: ${formatMoney(effectiveFund)} THB)`
          : `⚠️ เมื่อรวมกับ PVD (${formatMoney(pvdDeduction)} บาท) แล้วเกินเพดาน 500,000 บาท ใช้สิทธิ์กองทุนได้ ${formatMoney(effectiveFund)} บาท`;
      warnFundEl.style.display = 'block';
    } else {
      warnFundEl.style.display = 'none';
    }
  }

  // 5. Easy E-Receipt: สูงสุด 50,000 บาท
  const effectiveEasyReceipt = Math.min(easyReceiptDeduct, 50000);
  const warnEasyReceiptEl = document.getElementById('warn-easyreceipt');
  if (warnEasyReceiptEl) {
    if (easyReceiptDeduct > 50000) {
      warnEasyReceiptEl.textContent =
        LANG === 'en'
          ? `⚠️ Capped at 50,000 THB (excess of ${formatMoney(easyReceiptDeduct - 50000)} THB not deductible)`
          : `⚠️ ใช้สิทธิ์ได้สูงสุด 50,000 บาท (ส่วนเกิน ${formatMoney(easyReceiptDeduct - 50000)} บาท ไม่นำมาลดหย่อน)`;
      warnEasyReceiptEl.style.display = 'block';
    } else {
      warnEasyReceiptEl.style.display = 'none';
    }
  }

  const additionalDeductions =
    effectiveFund + effectiveThaiEsg + effectiveEasyReceipt + effectiveInsurance + effectiveMortgage + otherDeduct;

  // คำนวณเงินได้สุทธิ
  const totalDeductions = expenseDeduction + personalDeduction + pvdDeduction + ssoDeduction + additionalDeductions;
  let netIncome = totalIncome - totalDeductions;
  if (netIncome < 0) netIncome = 0;

  const wf = computeTaxWaterfall(netIncome);
  const tax = wf.totalTax;
  const isEn = LANG === 'en';

  // 1. Effective Tax Rate
  const effEl = document.getElementById('txt-effective-tax-rate');
  if (effEl) {
    const effRate = totalIncome > 0 ? ((tax / totalIncome) * 100).toFixed(1) : '0.0';
    effEl.textContent = `${isEn ? 'Effective rate: ' : 'อัตราภาษีเฉลี่ย: '}${effRate}%`;
  }

  // 2. Segmented Waterfall Bar
  const barEl = document.getElementById('waterfallBarContainer');
  if (barEl) {
    if (netIncome <= 0) {
      barEl.innerHTML = `<div class="h-full w-full bg-emerald-500 flex items-center justify-center text-[10px] text-white font-medium">${isEn ? 'Tax Exempt (0 THB)' : 'ยกเว้นภาษี (0 บาท)'}</div>`;
    } else {
      barEl.innerHTML = wf.tiers
        .map((t) => {
          const width = t.pctOfNet.toFixed(1);
          if (t.taxable <= 0) return '';
          const title = `${t.ratePct}%: ${formatMoney(t.taxable)} ${unit} (${isEn ? 'Tax ' : 'ภาษี '}${formatMoney(t.tax)} ${unit})`;
          return `<div style="width:${width}%; background:${t.color};" class="h-full transition-all duration-300 relative" title="${escapeHtml(title)}" aria-label="${escapeHtml(title)}"></div>`;
        })
        .join('');
    }
  }

  // 3. Headroom Banner
  const headroomEl = document.getElementById('bracketHeadroomBanner');
  if (headroomEl) {
    headroomEl.style.display = 'flex';
    headroomEl.className = 'p-2.5 rounded-lg text-xs mb-3 border flex items-center justify-between';
    if (netIncome <= 150000) {
      headroomEl.style.background = 'var(--ok-dim)';
      headroomEl.style.borderColor = 'var(--ok)';
      headroomEl.style.color = 'var(--ok)';
      const remExempt = Math.max(0, 150000 - netIncome);
      headroomEl.innerHTML = `<span>🎉 ${isEn ? 'Net income is within the tax-exempt bracket (0-150k THB).' : 'เงินได้สุทธิอยู่ในเกณฑ์ยกเว้นภาษี (0 - 150,000 บาท)'} ${remExempt > 0 ? (isEn ? `(${formatMoney(remExempt)} THB room remaining)` : `(เหลือโควตายกเว้นอีก ${formatMoney(remExempt)} บาท)`) : ''}</span>`;
    } else if (wf.topMarginalRate === 35) {
      headroomEl.style.background = 'var(--danger-dim)';
      headroomEl.style.borderColor = 'var(--danger)';
      headroomEl.style.color = 'var(--danger)';
      headroomEl.innerHTML = `<span>🔥 ${isEn ? 'Income has reached the highest bracket (35%).' : 'เงินได้อยู่ในขั้นบันไดสูงสุด (35%)'}</span>`;
    } else if (wf.headroom === 0) {
      headroomEl.style.background = 'var(--warn-dim)';
      headroomEl.style.borderColor = 'var(--warn)';
      headroomEl.style.color = 'var(--warn)';
      headroomEl.innerHTML = `<span>⚠️ ${isEn ? `Maxed out the ${wf.topMarginalRate}% tier. Excess income enters ${wf.nextBracketRate}%.` : `เงินได้เต็มเพดานขั้น ${wf.topMarginalRate}% พอดี เงินได้ส่วนเพิ่มจะเริ่มเสียที่ ${wf.nextBracketRate}%`}</span>`;
    } else {
      headroomEl.style.background = 'var(--core-dim)';
      headroomEl.style.borderColor = 'var(--core)';
      headroomEl.style.color = 'var(--core)';
      headroomEl.innerHTML = `<span>💡 ${isEn ? `<strong>${formatMoney(wf.headroom)} ${unit}</strong> headroom left at <strong>${wf.topMarginalRate}%</strong> before stepping into <strong>${wf.nextBracketRate}%</strong>` : `เหลือเงินได้อีก <strong>${formatMoney(wf.headroom)} ${unit}</strong> ในขั้น <strong>${wf.topMarginalRate}%</strong> ก่อนก้าวขึ้นสู่ขั้น <strong>${wf.nextBracketRate}%</strong>`}</span>`;
    }
  }

  // 3.5 Phase 79: Thai PIT Bracket Boundary & Step-Down Headroom Analyzer
  renderTaxBracketStepDown(netIncome);

  // 4. Detailed Tiers Cards
  const breakdownEl = document.getElementById('taxBreakdown');
  if (breakdownEl) {
    if (netIncome <= 0) {
      breakdownEl.innerHTML = `<div class="p-3 border rounded-lg text-center font-medium" style="background:var(--ok-dim); border-color:var(--ok); color:var(--ok);">${isEn ? '🎉 No taxable net income — 0 THB tax payable' : '🎉 ไม่มีเงินได้สุทธิที่ต้องเสียภาษี — ภาษี 0 บาท'}</div>`;
    } else {
      breakdownEl.innerHTML = wf.tiers
        .map((t) => {
          const label = isEn ? t.labelEn : t.labelTh;
          const isExempt = t.rate === 0;
          const rateBadge = isExempt ? (isEn ? 'Exempt' : 'ยกเว้น') : `${t.ratePct}%`;
          return `
                        <div class="p-2.5 rounded-lg border transition-colors" style="background:var(--panel-2); border-color:var(--line);">
                            <div class="flex justify-between items-center mb-1">
                                <div class="flex items-center gap-1.5">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-xs" style="background:${t.color}">${rateBadge}</span>
                                    <span class="font-medium text-gray-700">${label}</span>
                                </div>
                                <span class="font-bold ${t.tax > 0 ? 'text-gray-900' : 'text-emerald-600'}">${formatMoney(t.tax)} ${unit}</span>
                            </div>
                            <div class="w-full h-1.5 rounded-full overflow-hidden my-1.5" style="background:var(--line);">
                                <div class="h-full rounded-full transition-all duration-300" style="width:${t.pctOfTier}%; background:${t.color}"></div>
                            </div>
                            <div class="flex justify-between text-[11px] text-gray-500">
                                <span>${isEn ? 'Taxable: ' : 'เงินได้ในขั้น: '}${formatMoney(t.taxable)} ${unit}</span>
                                <span>${t.isFull ? (isEn ? 'Full' : 'เต็มขั้น') : t.limit === Infinity ? '' : isEn ? `Room: ${formatMoney(t.headroom)}` : `เหลืออีก: ${formatMoney(t.headroom)}`}</span>
                            </div>
                        </div>`;
        })
        .join('');
    }
  }

  // แสดงผลลัพธ์
  document.getElementById('totalIncome').innerText = `${formatMoney(totalIncome)} ${unit}`;
  document.getElementById('expenseDeduct').innerText = `- ${formatMoney(expenseDeduction)} ${unit}`;
  document.getElementById('pvdDeduct').innerText = `- ${formatMoney(pvdDeduction)} ${unit}`;
  document.getElementById('ssoDeduct').innerText = `- ${formatMoney(ssoDeduction)} ${unit}`;

  const moreRow = document.getElementById('row-more-deduct');
  if (additionalDeductions > 0) {
    moreRow.style.display = 'flex';
    document.getElementById('moreDeduct').innerText = `- ${formatMoney(additionalDeductions)} ${unit}`;
  } else {
    moreRow.style.display = 'none';
  }

  document.getElementById('netIncome').innerText = `${formatMoney(netIncome)} ${unit}`;
  document.getElementById('taxAmount').innerText = formatMoney(tax);

  const withheldTaxVal = parseNum(document.getElementById('withheldTax')?.value);
  const totalTaxCredits = withheldTaxVal + (isDividendApplied ? dividendWht + dividendCredit : 0);
  const refundMetrics = calculateTaxRefundOrPayable({
    calculatedTax: tax,
    withheldTax: totalTaxCredits,
  });
  updateTaxRefundView(refundMetrics);

  // Update proactive tax optimization advisor and deduction room
  updateTaxAdvisor(
    netIncome,
    totalIncome,
    pvdDeduction,
    effectiveFund,
    effectiveThaiEsg,
    effectiveInsurance,
    effectiveEasyReceipt,
    tax,
  );

  // Update printable annual tax filing report
  updatePrintReportView({
    totalIncome,
    salary:
      incomeMode === 'yearly'
        ? parseNum(document.getElementById('yearlyIncome')?.value)
        : parseNum(document.getElementById('salary')?.value) * 12,
    bonus:
      incomeMode === 'yearly'
        ? parseNum(document.getElementById('yearlyBonus')?.value)
        : parseNum(document.getElementById('bonus')?.value),
    isDividendApplied,
    dividendGrossedUp,
    dividendCredit,
    dividendWht,
    expenseDeduction,
    personalDeduction,
    pvdDeduction,
    ssoDeduction,
    effectiveFund,
    effectiveThaiEsg,
    effectiveInsurance,
    effectiveMortgage,
    effectiveEasyReceipt,
    otherDeduct,
    totalDeductions,
    netIncome,
    tax,
    effRate: totalIncome > 0 ? ((tax / totalIncome) * 100).toFixed(1) : '0.0',
    wf,
    withheldTax: totalTaxCredits,
    refundMetrics,
  });

  lastCalculatedDeductions = {
    pvd: pvdDeduction,
    sso: ssoDeduction,
    rawFund: fundDeduct,
    fund: effectiveFund,
    thaiEsg: effectiveThaiEsg,
    insurance: effectiveInsurance,
    mortgage: effectiveMortgage,
    other: otherDeduct,
  };

  updateEFilingWorksheetView(lastCalculatedDeductions);
}

// Phase 74: Statutory Pre-Flight Checklist State
let lastCalculatedDeductions = null;
let preflightState = {
  doc50Tawi: false,
  pool500k: false,
  thaiEsg: false,
  consentRd: false,
  promptPayCitizen: false,
};

function loadPreflightState() {
  try {
    const raw = localStorage.getItem('moneySuperapp.efilingPreflight.v1');
    if (raw) preflightState = Object.assign(preflightState, JSON.parse(raw));
  } catch (_e) {}
}

function savePreflightState() {
  try {
    localStorage.setItem('moneySuperapp.efilingPreflight.v1', JSON.stringify(preflightState));
  } catch (_e) {}
}

function togglePreflightItem(key, checked) {
  preflightState[key] = Boolean(checked);
  savePreflightState();
  updateEFilingWorksheetView(lastCalculatedDeductions);
}

function checkAllPreflight() {
  preflightState.doc50Tawi = true;
  preflightState.pool500k = true;
  preflightState.thaiEsg = true;
  preflightState.consentRd = true;
  preflightState.promptPayCitizen = true;
  savePreflightState();
  updateEFilingWorksheetView(lastCalculatedDeductions);
}

function resetPreflightChecklist() {
  preflightState = {
    doc50Tawi: false,
    pool500k: false,
    thaiEsg: false,
    consentRd: false,
    promptPayCitizen: false,
  };
  savePreflightState();
  updateEFilingWorksheetView(lastCalculatedDeductions);
}

window.togglePreflightItem = togglePreflightItem;
window.checkAllPreflight = checkAllPreflight;
window.resetPreflightChecklist = resetPreflightChecklist;

function updateEFilingWorksheetView(deductionsArg) {
  if (window.MoneyApp?.TaxWorksheet?.updateEFilingWorksheetView) {
    window.MoneyApp.TaxWorksheet.updateEFilingWorksheetView({
      deductionsArg,
      formatMoney,
      incomeMode,
      lang: LANG,
      lastCalculatedDeductions,
      preflightState,
    });
  }
}

function copyEFilingField(valElementId, btnEl) {
  if (window.MoneyApp?.TaxWorksheet?.copyEFilingField) {
    window.MoneyApp.TaxWorksheet.copyEFilingField(valElementId, btnEl);
  }
}
window.copyEFilingField = copyEFilingField;

function copyAllEFilingSummary() {
  if (window.MoneyApp?.TaxWorksheet?.copyAllEFilingSummary) {
    window.MoneyApp.TaxWorksheet.copyAllEFilingSummary({
      formatMoney,
    });
  }
}
window.copyAllEFilingSummary = copyAllEFilingSummary;

function showCopyFeedback(btn) {
  if (window.MoneyApp?.TaxWorksheet?.showCopyFeedback) {
    window.MoneyApp.TaxWorksheet.showCopyFeedback(btn);
  }
}

function formatReportDate(d, lang) {
  if (window.MoneyApp?.TaxWorksheet?.formatReportDate) {
    return window.MoneyApp.TaxWorksheet.formatReportDate(d, lang);
  }
  return '';
}

function updatePrintReportView(data) {
  if (window.MoneyApp?.TaxWorksheet?.updatePrintReportView) {
    window.MoneyApp.TaxWorksheet.updatePrintReportView(data, {
      escapeHtml,
      formatMoney,
      incomeMode,
      lang: LANG,
      unit,
    });
  }
}

function printTaxReport() {
  calculateTax();
  window.print();
}

let advisorState = {
  originalFund: null,
  originalThaiEsg: null,
  originalInsurance: null,
  originalEasyReceipt: null,
  isApplied: false,
  selectedSimAmt: 50000,
  dropAmount: 0,
  maxAmount: 0,
  thaiEsgDrop: 0,
  fundDrop: 0,
  thaiEsgMax: 0,
  fundMax: 0,
  currentRoom: null,
  simResult: null,
};

function computeTaxForNet(net) {
  if (net <= 0) return 0;
  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 150000, rate: 0.05 },
    { limit: 200000, rate: 0.1 },
    { limit: 250000, rate: 0.15 },
    { limit: 250000, rate: 0.2 },
    { limit: 1000000, rate: 0.25 },
    { limit: 3000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];
  let tax = 0;
  let rem = net;
  for (const b of brackets) {
    if (rem <= 0) break;
    const taxable = Math.min(rem, b.limit);
    tax += taxable * b.rate;
    rem -= taxable;
  }
  return tax;
}

function calculateTaxOptimizationRoom({
  totalIncome = 0,
  netIncome = 0,
  pvdDeduction = 0,
  currentFund = 0,
  currentThaiEsg = 0,
  currentInsurance = 0,
  currentEasyReceipt = 0,
} = {}) {
  const totInc = Math.max(0, Number(totalIncome) || 0);
  const net = Math.max(0, Number(netIncome) || 0);
  const pvd = Math.max(0, Number(pvdDeduction) || 0);
  const fund = Math.max(0, Number(currentFund) || 0);
  const esg = Math.max(0, Number(currentThaiEsg) || 0);
  const ins = Math.max(0, Number(currentInsurance) || 0);
  const receipt = Math.max(0, Number(currentEasyReceipt) || 0);

  const brackets = [
    { upper: 150000, lower: 0, rate: 0 },
    { upper: 300000, lower: 150000, rate: 0.05 },
    { upper: 500000, lower: 300000, rate: 0.1 },
    { upper: 750000, lower: 500000, rate: 0.15 },
    { upper: 1000000, lower: 750000, rate: 0.2 },
    { upper: 2000000, lower: 1000000, rate: 0.25 },
    { upper: 5000000, lower: 2000000, rate: 0.3 },
    { upper: Infinity, lower: 5000000, rate: 0.35 },
  ];

  let curBracket = brackets[0];
  for (const b of brackets) {
    if (net > b.lower) {
      curBracket = b;
    }
  }

  // 1. ThaiESG: up to 300k, capped at 30% of total income (evaluated via evaluateThaiEsgDeduction)
  const esgEval =
    typeof MoneyApp !== 'undefined' && MoneyApp.evaluateThaiEsgDeduction
      ? MoneyApp.evaluateThaiEsgDeduction(esg, totInc, 2024)
      : {
          maxAllowed: Math.min(300000, totInc > 0 ? totInc * 0.3 : 300000),
          effectiveDeduction: Math.min(esg, Math.min(300000, totInc > 0 ? totInc * 0.3 : 300000)),
        };
  const maxEsg = esgEval.maxAllowed;
  const usedEsg = esgEval.effectiveDeduction;
  const remEsg = Math.max(0, maxEsg - usedEsg);
  const pctEsg = maxEsg > 0 ? (usedEsg / maxEsg) * 100 : 0;

  // 2. Retirement Bundle: SSF + RMF + PVD combined max 500,000 THB
  const usedPvd = Math.min(pvd, 500000);
  const maxFund = Math.max(0, 500000 - usedPvd);
  const usedFund = Math.min(fund, maxFund);
  const usedRetirement = usedPvd + usedFund;
  const remRetirement = Math.max(0, 500000 - usedRetirement);
  const pctRetirement = (usedRetirement / 500000) * 100;

  // 3. Life & Health Insurance: combined max 100,000 THB
  const usedIns = Math.min(ins, 100000);
  const remIns = Math.max(0, 100000 - usedIns);
  const pctIns = (usedIns / 100000) * 100;

  // 4. Easy E-Receipt: max 50,000 THB
  const usedReceipt = Math.min(receipt, 50000);
  const remReceipt = Math.max(0, 50000 - usedReceipt);
  const pctReceipt = (usedReceipt / 50000) * 100;

  const totalRemainingRoom = remEsg + remRetirement + remIns + remReceipt;
  const currentTax = computeTaxForNet(net);

  function simulateExtraInvestment(extraAmt) {
    const extra = Math.max(0, Number(extraAmt) || 0);
    const effectiveExtra = Math.min(extra, totalRemainingRoom);
    const newNet = Math.max(0, net - effectiveExtra);
    const newTax = computeTaxForNet(newNet);
    const taxSaved = Math.max(0, currentTax - newTax);
    const effectiveRoiPct = effectiveExtra > 0 ? (taxSaved / effectiveExtra) * 100 : 0;

    let simBracket = brackets[0];
    for (const b of brackets) {
      if (newNet > b.lower) {
        simBracket = b;
      }
    }

    return {
      extraInvested: extra,
      effectiveExtra,
      newNetIncome: newNet,
      currentTax,
      newTax,
      taxSaved,
      effectiveRoiPct: Math.round(effectiveRoiPct * 10) / 10,
      newMarginalRate: simBracket.rate,
    };
  }

  return {
    marginalRate: curBracket.rate,
    marginalRatePct: Math.round(curBracket.rate * 100),
    currentTax,
    curBracket,
    totalRemainingRoom,
    categories: {
      thaiEsg: {
        limit: maxEsg,
        used: usedEsg,
        remaining: remEsg,
        pctUsed: Math.min(100, Math.round(pctEsg * 10) / 10),
      },
      retirement: {
        limit: 500000,
        used: usedRetirement,
        pvdUsed: usedPvd,
        fundUsed: usedFund,
        remaining: remRetirement,
        pctUsed: Math.min(100, Math.round(pctRetirement * 10) / 10),
      },
      insurance: {
        limit: 100000,
        used: usedIns,
        remaining: remIns,
        pctUsed: Math.min(100, Math.round(pctIns * 10) / 10),
      },
      easyReceipt: {
        limit: 50000,
        used: usedReceipt,
        remaining: remReceipt,
        pctUsed: Math.min(100, Math.round(pctReceipt * 10) / 10),
      },
    },
    simulateExtraInvestment,
  };
}

function renderCapacityMeters(categories) {
  const container = document.getElementById('capacityMetersList');
  if (!container) return;
  const isEn = LANG === 'en';
  const cats = [
    {
      name: isEn ? 'ThaiESG Fund' : 'กองทุน ThaiESG',
      tag: isEn ? '5-yr hold' : 'ถือครอง 5 ปี',
      color: '#10b981',
      data: categories.thaiEsg,
    },
    {
      name: isEn ? 'Retirement Pool (SSF/RMF/PVD)' : 'กลุ่มเกษียณ (SSF + RMF + PVD)',
      tag: isEn ? 'Max 500k' : 'รวมไม่เกิน 5 แสน',
      color: '#06b6d4',
      data: categories.retirement,
    },
    {
      name: isEn ? 'Life & Health Insurance' : 'ประกันชีวิต + สุขภาพ',
      tag: isEn ? 'Max 100k' : 'สูงสุด 1 แสน',
      color: '#6366f1',
      data: categories.insurance,
    },
    {
      name: isEn ? 'Easy E-Receipt Scheme' : 'มาตรการ Easy E-Receipt',
      tag: isEn ? 'Max 50k' : 'สูงสุด 5 หมื่น',
      color: '#f59e0b',
      data: categories.easyReceipt,
    },
  ];

  container.innerHTML = cats
    .map((c) => {
      const d = c.data;
      const usedStr = formatMoney(d.used);
      const limitStr = formatMoney(d.limit);
      const remStr = formatMoney(d.remaining);
      const isMaxed = d.remaining <= 0;
      const badgeText = isMaxed ? (isEn ? 'Maxed' : 'เต็มเพดาน') : isEn ? `+${remStr} room` : `เหลืออีก ${remStr}`;
      const badgeStyle = isMaxed
        ? 'background:var(--panel-2); color:var(--ink-dim); border:1px solid var(--line);'
        : 'background:var(--core-dim); color:var(--core);';

      return `
                    <div class="space-y-1">
                        <div class="flex justify-between items-center text-[11px]">
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="font-medium text-gray-800 dark:text-gray-200">${c.name}</span>
                                <span class="text-[10px] text-gray-400">(${c.tag})</span>
                            </div>
                            <div class="text-[11px] font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                                <span>${usedStr} / ${limitStr} ${unit}</span>
                                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold" style="${badgeStyle}">${badgeText}</span>
                            </div>
                        </div>
                        <div class="w-full h-1.5 rounded-full overflow-hidden" style="background:var(--line);">
                            <div class="h-full rounded-full transition-all duration-300" style="width:${Math.min(100, d.pctUsed)}%; background:${c.color};"></div>
                        </div>
                    </div>
                `;
    })
    .join('');
}

function selectSimExtra(amt) {
  if (!advisorState.currentRoom) return;
  if (amt === 'max') {
    advisorState.selectedSimAmt = advisorState.currentRoom.totalRemainingRoom;
  } else {
    advisorState.selectedSimAmt = Number(amt) || 0;
  }
  renderSimCallout();
}

function renderSimCallout() {
  const simBox = document.getElementById('advisor-sim-box');
  const callout = document.getElementById('sim-result-callout');
  const roiBadge = document.getElementById('txt-sim-roi-badge');
  const applyBtn = document.getElementById('btn-apply-sim');
  if (!simBox || !callout || !advisorState.currentRoom) return;

  const room = advisorState.currentRoom;
  if (room.totalRemainingRoom <= 0 || room.currentTax <= 0) {
    simBox.style.display = 'none';
    return;
  }
  simBox.style.display = 'block';

  // Highlight active pill
  document.querySelectorAll('.sim-pill').forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    const curAmt = advisorState.selectedSimAmt;
    let match = false;
    if (text.includes('10k') && curAmt === 10000) match = true;
    else if (text.includes('30k') && curAmt === 30000) match = true;
    else if (text.includes('50k') && curAmt === 50000) match = true;
    else if (text.includes('100k') && curAmt === 100000) match = true;
    else if (text.includes('max') && curAmt === room.totalRemainingRoom) match = true;
    btn.classList.toggle('active', match);
    btn.classList.toggle('border-emerald-500', match);
    btn.classList.toggle('bg-emerald-100', match);
  });

  const sim = room.simulateExtraInvestment(advisorState.selectedSimAmt);
  advisorState.simResult = sim;
  const isEn = LANG === 'en';

  if (roiBadge) {
    roiBadge.textContent = `${isEn ? 'Tax ROI: ' : 'ผลตอบแทนภาษี: '}${sim.effectiveRoiPct}%`;
  }

  if (isEn) {
    callout.innerHTML = `
                    <div class="flex justify-between items-center font-semibold mb-1">
                        <span>Investing +${formatMoney(sim.effectiveExtra)} ${unit}:</span>
                        <span class="text-emerald-700 dark:text-emerald-300 font-bold">Tax Saved: -${formatMoney(sim.taxSaved)} ${unit}</span>
                    </div>
                    <div class="text-[10px] text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>Tax liability drops from ${formatMoney(sim.currentTax)} to ${formatMoney(sim.newTax)} ${unit}</span>
                        <span>Marginal rate becomes ${Math.round(sim.newMarginalRate * 100)}%</span>
                    </div>
                `;
    if (applyBtn) {
      applyBtn.textContent = `✓ Apply +${formatMoney(sim.effectiveExtra)} ${unit} to Deductions`;
    }
  } else {
    callout.innerHTML = `
                    <div class="flex justify-between items-center font-semibold mb-1">
                        <span>หากลงทุนเพิ่ม +${formatMoney(sim.effectiveExtra)} ${unit}:</span>
                        <span class="text-emerald-700 dark:text-emerald-300 font-bold">ประหยัดภาษีได้: -${formatMoney(sim.taxSaved)} ${unit}</span>
                    </div>
                    <div class="text-[10px] text-gray-500 dark:text-gray-400 flex justify-between">
                        <span>ภาษีที่ต้องจ่ายลดจาก ${formatMoney(sim.currentTax)} เหลือ ${formatMoney(sim.newTax)} ${unit}</span>
                        <span>ฐานภาษีใหม่กลายเป็น ${Math.round(sim.newMarginalRate * 100)}%</span>
                    </div>
                `;
    if (applyBtn) {
      applyBtn.textContent = `✓ นำยอด +${formatMoney(sim.effectiveExtra)} ${unit} ไปกรอกลดหย่อน`;
    }
  }
}

function applyCurrentSimulation() {
  if (!advisorState.simResult || !advisorState.currentRoom) return;
  const effAmt = advisorState.simResult.effectiveExtra;
  if (effAmt <= 0) return;

  undoMgr.push(captureSnapshot());
  if (!advisorState.isApplied) {
    advisorState.originalFund = document.getElementById('fundDeduct').value;
    advisorState.originalThaiEsg = document.getElementById('thaiEsgDeduct')?.value || '';
    advisorState.originalInsurance = document.getElementById('insuranceDeduct')?.value || '';
    advisorState.originalEasyReceipt = document.getElementById('easyReceiptDeduct')?.value || '';
  }
  advisorState.isApplied = true;

  let remToApply = effAmt;
  const room = advisorState.currentRoom;

  // 1. ThaiESG first
  const curEsg = parseNum(document.getElementById('thaiEsgDeduct')?.value);
  const addEsg = Math.min(remToApply, room.categories.thaiEsg.remaining);
  if (document.getElementById('thaiEsgDeduct') && addEsg > 0) {
    document.getElementById('thaiEsgDeduct').value = Math.round(curEsg + addEsg);
    remToApply -= addEsg;
  }

  // 2. Fund next
  const curFund = parseNum(document.getElementById('fundDeduct')?.value);
  const addFund = Math.min(remToApply, room.categories.retirement.remaining);
  if (addFund > 0) {
    document.getElementById('fundDeduct').value = Math.round(curFund + addFund);
    remToApply -= addFund;
  }

  // 3. Insurance next
  const curIns = parseNum(document.getElementById('insuranceDeduct')?.value);
  const addIns = Math.min(remToApply, room.categories.insurance.remaining);
  if (addIns > 0) {
    document.getElementById('insuranceDeduct').value = Math.round(curIns + addIns);
    remToApply -= addIns;
  }

  // 4. Easy E-Receipt next
  const curReceipt = parseNum(document.getElementById('easyReceiptDeduct')?.value);
  const addReceipt = Math.min(remToApply, room.categories.easyReceipt.remaining);
  if (addReceipt > 0) {
    document.getElementById('easyReceiptDeduct').value = Math.round(curReceipt + addReceipt);
    remToApply -= addReceipt;
  }

  calculateTax();
  updateUndoUI();
}

function updateTaxAdvisor(netIncome, totalIncome, pvdDeduction, currentFund, currentThaiEsg, ...extraArgs) {
  const [arg6, arg7, arg8] = extraArgs;
  const card = document.getElementById('taxAdvisorCard');
  if (!card) return;

  if (totalIncome <= 0) {
    card.style.display = 'none';
    return;
  }
  card.style.display = 'block';

  let currentInsurance = 0;
  let currentEasyReceipt = 0;
  let currentTax = 0;

  if (extraArgs.length <= 1) {
    currentTax = Number(arg6) || 0;
    currentInsurance = parseNum(document.getElementById('insuranceDeduct')?.value) || 0;
    currentEasyReceipt = parseNum(document.getElementById('easyReceiptDeduct')?.value) || 0;
  } else {
    currentInsurance = Number(arg6) || 0;
    currentEasyReceipt = Number(arg7) || 0;
    currentTax = Number(arg8) || 0;
  }

  const room = calculateTaxOptimizationRoom({
    totalIncome,
    netIncome,
    pvdDeduction,
    currentFund,
    currentThaiEsg,
    currentInsurance,
    currentEasyReceipt,
  });
  advisorState.currentRoom = room;

  const badgeMarginal = document.getElementById('badge-marginal-rate');
  const summaryEl = document.getElementById('advisor-summary');
  const totalRoomBadge = document.getElementById('txt-total-room-badge');
  const simBox = document.getElementById('advisor-sim-box');
  const dropBtn = document.getElementById('btn-advisor-drop');
  const maxBtn = document.getElementById('btn-advisor-max');
  const revertBtn = document.getElementById('btn-advisor-revert');
  const isEn = LANG === 'en';

  if (advisorState.isApplied) {
    revertBtn.style.display = 'inline-block';
  } else {
    revertBtn.style.display = 'none';
  }

  if (totalRoomBadge) {
    totalRoomBadge.textContent = isEn
      ? `Total Room: ${formatMoney(room.totalRemainingRoom)} ${unit}`
      : `โควตารวมคงเหลือ: ${formatMoney(room.totalRemainingRoom)} ${unit}`;
  }

  renderCapacityMeters(room.categories);

  if (netIncome <= 150000 || room.marginalRate === 0) {
    badgeMarginal.textContent = isEn ? 'Marginal Rate: 0%' : 'ฐานภาษี: 0%';
    summaryEl.textContent = isEn
      ? '🎉 Your net income is within the 0-150,000 THB tax-exempt bracket. You have 0 THB tax liability!'
      : '🎉 รายได้สุทธิของคุณไม่เกิน 150,000 บาท ได้รับการยกเว้นภาษี (0%) ไม่มีภาระภาษีที่ต้องชำระ';
    if (simBox) simBox.style.display = 'none';
    dropBtn.style.display = 'none';
    maxBtn.style.display = 'none';
    return;
  }

  badgeMarginal.textContent = isEn ? `Marginal Rate: ${room.marginalRatePct}%` : `ฐานภาษีสูงสุด: ${room.marginalRatePct}%`;

  const returnPer10k = formatMoney(10000 * room.marginalRate);
  summaryEl.innerHTML = isEn
    ? `Your assessable net income is taxed at the <strong>${room.marginalRatePct}%</strong> bracket. Every <strong>10,000 ${unit}</strong> added to deductions immediately saves <strong>${returnPer10k} ${unit}</strong> in tax (guaranteed <strong>${room.marginalRatePct}%</strong> tax return)!`
    : `คุณมีเงินได้สุทธิอยู่ในฐาน <strong>${room.marginalRatePct}%</strong> โดยทุกๆ <strong>10,000 ${unit}</strong> ที่ลงทุนเพิ่มในหมวดลดหย่อน จะช่วยประหยัดภาษีทันที <strong>${returnPer10k} ${unit}</strong> (ผลตอบแทนภาษีทันที <strong>${room.marginalRatePct}%</strong>)`;

  renderSimCallout();

  const excessIncome = netIncome - room.curBracket.lower;
  const dropDeduction = Math.min(excessIncome, room.totalRemainingRoom);
  const thaiEsgDrop = Math.min(dropDeduction, room.categories.thaiEsg.remaining);
  const fundDrop = Math.min(dropDeduction - thaiEsgDrop, room.categories.retirement.remaining);
  const newNetDrop = Math.max(0, netIncome - dropDeduction);
  const newTaxDrop = computeTaxForNet(newNetDrop);
  const taxSavedDrop = Math.max(0, currentTax - newTaxDrop);

  const newNetMax = Math.max(0, netIncome - room.totalRemainingRoom);
  const newTaxMax = computeTaxForNet(newNetMax);
  const taxSavedMax = Math.max(0, currentTax - newTaxMax);

  advisorState.dropAmount = dropDeduction;
  advisorState.thaiEsgDrop = thaiEsgDrop;
  advisorState.fundDrop = fundDrop;
  advisorState.maxAmount = room.totalRemainingRoom;
  advisorState.thaiEsgMax = room.categories.thaiEsg.remaining;
  advisorState.fundMax = room.categories.retirement.remaining;

  if (room.totalRemainingRoom <= 0) {
    dropBtn.style.display = 'none';
    maxBtn.style.display = 'none';
    if (simBox) simBox.style.display = 'none';
  } else {
    dropBtn.style.display = 'inline-block';
    maxBtn.style.display = 'inline-block';
    if (isEn) {
      dropBtn.textContent = `🎯 Drop 1 Bracket (-${formatMoney(taxSavedDrop)} ${unit})`;
      maxBtn.textContent = `🌟 Maximize All (-${formatMoney(taxSavedMax)} ${unit})`;
    } else {
      dropBtn.textContent = `🎯 ลด 1 ขั้นบันได (-${formatMoney(taxSavedDrop)} ${unit})`;
      maxBtn.textContent = `🌟 ใช้สิทธิ์เต็มเพดาน (-${formatMoney(taxSavedMax)} ${unit})`;
    }
  }
}

function applyAdvisorDropOne() {
  undoMgr.push(captureSnapshot());
  if (!advisorState.isApplied) {
    advisorState.originalFund = document.getElementById('fundDeduct').value;
    advisorState.originalThaiEsg = document.getElementById('thaiEsgDeduct')?.value || '';
    advisorState.originalInsurance = document.getElementById('insuranceDeduct')?.value || '';
    advisorState.originalEasyReceipt = document.getElementById('easyReceiptDeduct')?.value || '';
  }
  advisorState.isApplied = true;
  const curThaiEsg = parseNum(document.getElementById('thaiEsgDeduct')?.value);
  const curFund = parseNum(document.getElementById('fundDeduct')?.value);
  if (document.getElementById('thaiEsgDeduct')) {
    document.getElementById('thaiEsgDeduct').value = Math.round(curThaiEsg + advisorState.thaiEsgDrop);
  }
  document.getElementById('fundDeduct').value = Math.round(curFund + advisorState.fundDrop);
  calculateTax();
  updateUndoUI();
}

function applyAdvisorMax() {
  undoMgr.push(captureSnapshot());
  if (!advisorState.isApplied) {
    advisorState.originalFund = document.getElementById('fundDeduct').value;
    advisorState.originalThaiEsg = document.getElementById('thaiEsgDeduct')?.value || '';
    advisorState.originalInsurance = document.getElementById('insuranceDeduct')?.value || '';
    advisorState.originalEasyReceipt = document.getElementById('easyReceiptDeduct')?.value || '';
  }
  advisorState.isApplied = true;
  const curThaiEsg = parseNum(document.getElementById('thaiEsgDeduct')?.value);
  const curFund = parseNum(document.getElementById('fundDeduct')?.value);
  if (document.getElementById('thaiEsgDeduct')) {
    document.getElementById('thaiEsgDeduct').value = Math.round(curThaiEsg + advisorState.thaiEsgMax);
  }
  document.getElementById('fundDeduct').value = Math.round(curFund + advisorState.fundMax);
  calculateTax();
  updateUndoUI();
}

function revertAdvisorOptimization() {
  if (advisorState.originalFund !== null) {
    document.getElementById('fundDeduct').value = advisorState.originalFund;
  }
  if (advisorState.originalThaiEsg !== null && document.getElementById('thaiEsgDeduct')) {
    document.getElementById('thaiEsgDeduct').value = advisorState.originalThaiEsg;
  }
  if (advisorState.originalInsurance !== null && document.getElementById('insuranceDeduct')) {
    document.getElementById('insuranceDeduct').value = advisorState.originalInsurance;
  }
  if (advisorState.originalEasyReceipt !== null && document.getElementById('easyReceiptDeduct')) {
    document.getElementById('easyReceiptDeduct').value = advisorState.originalEasyReceipt;
  }
  advisorState.isApplied = false;
  calculateTax();
  updateUndoUI();
}

function toggleTaxScenarioComparator() {
  if (taxBaseLayoutManager?.toggleCard) {
    taxBaseLayoutManager.toggleCard('panelTaxScenario');
    return;
  }
  const panel = document.getElementById('taxScenarioComparePanel');
  if (!panel) return;
  const isHidden = panel.classList.contains('card-collapsed-hidden') || panel.style.display === 'none';
  if (isHidden) {
    panel.classList.remove('card-collapsed-hidden');
    panel.style.display = 'block';
    const scenIncInput = document.getElementById('scenIncome');
    if (scenIncInput && !scenIncInput.value) {
      copyCurrentToScenarioB();
    } else {
      runTaxScenarioComparison();
    }
  } else {
    panel.classList.add('card-collapsed-hidden');
  }
}

function copyCurrentToScenarioB() {
  const totInc = parseNum(document.getElementById('totalIncome')?.innerText || 0);
  const netInc = parseNum(document.getElementById('netIncome')?.innerText || 0);
  const standardDed = Math.min(totInc * 0.5, 100000) + 60000;
  const otherDed = Math.max(0, totInc - standardDed - netInc);

  const scenInc = document.getElementById('scenIncome');
  const scenDed = document.getElementById('scenDeductions');
  if (scenInc) scenInc.value = totInc > 0 ? Math.round(totInc) : '';
  if (scenDed) scenDed.value = otherDed > 0 ? Math.round(otherDed) : '';
  runTaxScenarioComparison();
}

function runTaxScenarioComparison() {
  const resultsBox = document.getElementById('scenCompareResults');
  const calloutBox = document.getElementById('scenBracketCreepCallout');
  if (!resultsBox) return;

  const baseIncome = parseNum(document.getElementById('totalIncome')?.innerText || 0);
  const baseTax = parseNum(document.getElementById('taxAmount')?.innerText || 0);
  const baseTakeHome = Math.max(0, baseIncome - baseTax);
  const baseEffectiveRate = baseIncome > 0 ? (baseTax / baseIncome) * 100 : 0;

  const scenIncomeVal = parseNum(document.getElementById('scenIncome')?.value || 0);
  const scenDedVal = parseNum(document.getElementById('scenDeductions')?.value || 0);
  const scenInflVal = parseNum(document.getElementById('scenInflation')?.value || 0);

  const scenExpDed = Math.min(scenIncomeVal * 0.5, 100000);
  const scenPersonalDed = 60000;
  const scenTotalDed = scenExpDed + scenPersonalDed + scenDedVal;
  const scenNetTaxable = Math.max(0, scenIncomeVal - scenTotalDed);
  const scenTax = computeTaxForNet(scenNetTaxable);
  const scenTakeHome = Math.max(0, scenIncomeVal - scenTax);
  const scenEffectiveRate = scenIncomeVal > 0 ? (scenTax / scenIncomeVal) * 100 : 0;

  const incomeDelta = scenIncomeVal - baseIncome;
  const taxDelta = scenTax - baseTax;
  const takeHomeDelta = scenTakeHome - baseTakeHome;
  const isEn = LANG === 'en';
  const unit = isEn ? 'THB' : 'บาท';

  const inflFactor = 1 + Math.max(0, scenInflVal) / 100;
  const realTakeHome = Math.round(scenTakeHome / inflFactor);
  const realTakeHomeDelta = realTakeHome - baseTakeHome;
  const hasBracketCreep = scenIncomeVal >= baseIncome && realTakeHomeDelta < 0 && scenInflVal > 0;

  const signStr = (n) => (n > 0 ? `+${formatMoney(n)}` : n < 0 ? `-${formatMoney(Math.abs(n))}` : '0');
  const taxSignColor = taxDelta > 0 ? 'text-red-600' : taxDelta < 0 ? 'text-emerald-600' : 'text-gray-600';
  const thSignColor = takeHomeDelta > 0 ? 'text-emerald-600' : takeHomeDelta < 0 ? 'text-red-600' : 'text-gray-600';

  resultsBox.innerHTML = `
                <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div class="text-[10px] text-gray-500">${isEn ? 'Scenario B Income' : 'รายได้รวม B'}</div>
                    <div class="font-bold text-gray-800 text-xs mt-0.5">${formatMoney(scenIncomeVal)} ${unit}</div>
                    <div class="text-[10px] ${incomeDelta >= 0 ? 'text-emerald-600' : 'text-red-500'} font-semibold mt-0.5">${signStr(incomeDelta)}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div class="text-[10px] text-gray-500">${isEn ? 'Scenario B Tax' : 'ภาษีที่ต้องจ่าย B'}</div>
                    <div class="font-bold text-gray-800 text-xs mt-0.5">${formatMoney(scenTax)} ${unit}</div>
                    <div class="text-[10px] ${taxSignColor} font-semibold mt-0.5">${taxDelta > 0 ? '+' : ''}${formatMoney(taxDelta)} (${(scenEffectiveRate - baseEffectiveRate).toFixed(1)}%)</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div class="text-[10px] text-gray-500">${isEn ? 'Net Take-Home B' : 'เงินได้สุทธิเข้ากระเป๋า B'}</div>
                    <div class="font-bold text-gray-800 text-xs mt-0.5">${formatMoney(scenTakeHome)} ${unit}</div>
                    <div class="text-[10px] ${thSignColor} font-semibold mt-0.5">${signStr(takeHomeDelta)}</div>
                </div>
                <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                    <div class="text-[10px] text-gray-500">${isEn ? 'Effective Rate' : 'อัตราภาษีเฉลี่ย'}</div>
                    <div class="font-bold text-gray-800 text-xs mt-0.5">${scenEffectiveRate.toFixed(2)}%</div>
                    <div class="text-[10px] text-gray-500 font-semibold mt-0.5">Base: ${baseEffectiveRate.toFixed(2)}%</div>
                </div>
            `;

  if (calloutBox) {
    if (scenInflVal > 0) {
      calloutBox.style.display = 'block';
      if (hasBracketCreep) {
        calloutBox.className =
          'p-2.5 rounded-lg border border-red-200 bg-red-50 text-[11px] text-red-800 leading-relaxed';
        calloutBox.innerHTML = `⚠️ <strong>${isEn ? 'Bracket Creep Alert!' : 'เตือนภัยเงินเฟ้อ & ขั้นบันไดภาษี (Bracket Creep)!'}</strong> ${isEn ? `Even though nominal income increased, after ${scenInflVal}% inflation and higher tax bracket deductions, your real purchasing power decreases by <strong>${formatMoney(Math.abs(realTakeHomeDelta))} ${unit}/year</strong> (Real Take-Home: ${formatMoney(realTakeHome)} ${unit}).` : `แม้รายได้ตัวเลขจะเพิ่มขึ้น แต่เมื่อหักภาษีในขั้นที่สูงขึ้นร่วมกับเงินเฟ้อ ${scenInflVal}% กำลังซื้อที่แท้จริงของคุณลดลง <strong>${formatMoney(Math.abs(realTakeHomeDelta))} ${unit}/ปี</strong> (เหลือมูลค่าแท้จริง ${formatMoney(realTakeHome)} ${unit})`}`;
      } else {
        calloutBox.className =
          'p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-800 leading-relaxed';
        calloutBox.innerHTML = `✅ <strong>${isEn ? 'Real Purchasing Power Protected:' : 'กำลังซื้อที่แท้จริงยังคงเพิ่มขึ้น:'}</strong> ${isEn ? `After ${scenInflVal}% inflation, your real take-home purchasing power is <strong>${formatMoney(realTakeHome)} ${unit}</strong> (${signStr(realTakeHomeDelta)} vs baseline).` : `เมื่อหักเงินเฟ้อ ${scenInflVal}% แล้ว มูลค่าเงินได้สุทธิที่แท้จริงอยู่ที่ <strong>${formatMoney(realTakeHome)} ${unit}</strong> (${signStr(realTakeHomeDelta)} เมื่อเทียบกับฐานเดิม)`}`;
      }
    } else {
      calloutBox.style.display = 'none';
    }
  }
}

function copyTaxSummary() {
  const income = document.getElementById('totalIncome').innerText;
  const net = document.getElementById('netIncome').innerText;
  const tax = `${document.getElementById('taxAmount').innerText} ${unit}`;

  const text =
    LANG === 'en'
      ? `Income Tax Estimate:\nTotal Annual Income: ${income}\nNet Taxable Income: ${net}\nEstimated Tax: ${tax}`
      : `สรุปประมาณการภาษีเงินได้:\nรายได้รวมทั้งปี: ${income}\nเงินได้สุทธิ: ${net}\nภาษีที่ต้องชำระ: ${tax}`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      const btn = document.getElementById('lbl-copy-tax');
      const orig = btn.innerText;
      btn.innerText = LANG === 'en' ? '✓ Copied!' : '✓ คัดลอกแล้ว!';
      setTimeout(() => {
        btn.innerText = orig;
      }, 1800);
    })
    .catch(() => {});
}

const defaultTaxState = {
  incomeMode: 'monthly',
  salary: '30000',
  bonus: '0',
  yearlyIncome: '',
  yearlyBonus: '',
  yearlyPvd: '',
  yearlySso: '',
  pvd: '0',
  ssoCap: '750',
  fundDeduct: '',
  thaiEsgDeduct: '',
  easyReceiptDeduct: '',
  insuranceDeduct: '',
  mortgageDeduct: '',
  otherDeduct: '',
  withheldTax: '',
  monthsBreakdown: Array(12).fill(''),
};

function captureSnapshot() {
  return {
    incomeMode: incomeMode,
    salary: document.getElementById('salary')?.value || '',
    bonus: document.getElementById('bonus')?.value || '',
    yearlyIncome: document.getElementById('yearlyIncome')?.value || '',
    yearlyBonus: document.getElementById('yearlyBonus')?.value || '',
    yearlyPvd: document.getElementById('yearlyPvd')?.value || '',
    yearlySso: document.getElementById('yearlySso')?.value || '',
    pvd: document.getElementById('pvd')?.value || '',
    ssoCap: document.getElementById('ssoCap')?.value || '',
    fundDeduct: document.getElementById('fundDeduct')?.value || '',
    thaiEsgDeduct: document.getElementById('thaiEsgDeduct')?.value || '',
    easyReceiptDeduct: document.getElementById('easyReceiptDeduct')?.value || '',
    insuranceDeduct: document.getElementById('insuranceDeduct')?.value || '',
    mortgageDeduct: document.getElementById('mortgageDeduct')?.value || '',
    otherDeduct: document.getElementById('otherDeduct')?.value || '',
    withheldTax: document.getElementById('withheldTax')?.value || '',
    monthsBreakdown: Array.from({ length: 12 }, (_, i) => document.getElementById(`m-income-${i + 1}`)?.value || ''),
  };
}

function restoreSnapshot(data) {
  if (!data) return;
  if (document.getElementById('salary')) document.getElementById('salary').value = data.salary || '';
  if (document.getElementById('bonus')) document.getElementById('bonus').value = data.bonus || '';
  if (document.getElementById('yearlyIncome')) document.getElementById('yearlyIncome').value = data.yearlyIncome || '';
  if (document.getElementById('yearlyBonus')) document.getElementById('yearlyBonus').value = data.yearlyBonus || '';
  if (document.getElementById('yearlyPvd')) document.getElementById('yearlyPvd').value = data.yearlyPvd || '';
  if (document.getElementById('yearlySso')) document.getElementById('yearlySso').value = data.yearlySso || '';
  if (document.getElementById('pvd')) document.getElementById('pvd').value = data.pvd || '';
  if (document.getElementById('ssoCap')) document.getElementById('ssoCap').value = data.ssoCap || '';

  if (Array.isArray(data.monthsBreakdown)) {
    let sum = 0;
    data.monthsBreakdown.forEach((val, idx) => {
      const input = document.getElementById(`m-income-${idx + 1}`);
      if (input) {
        input.value = val || '';
        sum += parseNum(val);
      }
    });
    if (document.getElementById('months-breakdown-total')) {
      document.getElementById('months-breakdown-total').textContent = `${formatMoney(sum)} ${unit}`;
    }
  }

  if (document.getElementById('fundDeduct')) document.getElementById('fundDeduct').value = data.fundDeduct || '';
  if (document.getElementById('thaiEsgDeduct'))
    document.getElementById('thaiEsgDeduct').value = data.thaiEsgDeduct || '';
  if (document.getElementById('easyReceiptDeduct'))
    document.getElementById('easyReceiptDeduct').value = data.easyReceiptDeduct || '';
  if (document.getElementById('insuranceDeduct'))
    document.getElementById('insuranceDeduct').value = data.insuranceDeduct || '';
  if (document.getElementById('mortgageDeduct'))
    document.getElementById('mortgageDeduct').value = data.mortgageDeduct || '';
  if (document.getElementById('otherDeduct')) document.getElementById('otherDeduct').value = data.otherDeduct || '';
  if (document.getElementById('withheldTax')) document.getElementById('withheldTax').value = data.withheldTax || '';

  if (data.incomeMode && (data.incomeMode === 'yearly' || data.incomeMode === 'monthly')) {
    switchIncomeMode(data.incomeMode);
  } else {
    calculateTax();
  }
  saveState();
  updateUndoUI();
}

const undoMgr = MoneyApp.createUndoManager({
  maxDepth: 15,
  enableShortcuts: true,
  onUndo: (previous) => {
    restoreSnapshot(previous);
  },
});

function updateUndoUI() {
  const can = undoMgr.canUndo();
  const btnUndo = document.getElementById('btn-undo-tax');
  if (btnUndo) btnUndo.style.display = can ? 'inline-flex' : 'none';
  const btnUndoTop = document.getElementById('btn-undo-tax-top');
  if (btnUndoTop) btnUndoTop.style.display = can ? 'inline-flex' : 'none';
}

function undoTaxChange() {
  undoMgr.undo();
}

function resetTaxForm() {
  const confirmMsg = LANG === 'en' ? 'Clear form data and reset to defaults?' : 'ล้างข้อมูลที่กรอกทั้งหมดและกลับไปใช้ค่าเริ่มต้น?';
  if (!confirm(confirmMsg)) return;
  undoMgr.push(captureSnapshot());
  restoreSnapshot(defaultTaxState);
  saveState();
  updateUndoUI();
}

function loadState() {
  try {
    const data = MoneyApp.safeJsonParse(STORAGE_KEY, null);
    if (!data) return;

    if (data.salary !== undefined && data.salary !== '') document.getElementById('salary').value = data.salary;
    if (data.bonus !== undefined && data.bonus !== '') document.getElementById('bonus').value = data.bonus;
    if (data.yearlyIncome && document.getElementById('yearlyIncome'))
      document.getElementById('yearlyIncome').value = data.yearlyIncome;
    if (data.yearlyBonus && document.getElementById('yearlyBonus'))
      document.getElementById('yearlyBonus').value = data.yearlyBonus;
    if (data.yearlyPvd && document.getElementById('yearlyPvd'))
      document.getElementById('yearlyPvd').value = data.yearlyPvd;
    if (data.yearlySso && document.getElementById('yearlySso'))
      document.getElementById('yearlySso').value = data.yearlySso;
    if (data.pvd !== undefined && data.pvd !== '') document.getElementById('pvd').value = data.pvd;
    if (data.ssoCap !== undefined && data.ssoCap !== '') document.getElementById('ssoCap').value = data.ssoCap;

    if (Array.isArray(data.monthsBreakdown)) {
      let sum = 0;
      data.monthsBreakdown.forEach((val, idx) => {
        const input = document.getElementById(`m-income-${idx + 1}`);
        if (input && val !== undefined) {
          input.value = val;
          sum += parseNum(val);
        }
      });
      if (document.getElementById('months-breakdown-total')) {
        document.getElementById('months-breakdown-total').textContent = `${formatMoney(sum)} ${unit}`;
      }
    }

    if (data.fundDeduct) document.getElementById('fundDeduct').value = data.fundDeduct;
    if (data.thaiEsgDeduct && document.getElementById('thaiEsgDeduct'))
      document.getElementById('thaiEsgDeduct').value = data.thaiEsgDeduct;
    if (data.easyReceiptDeduct && document.getElementById('easyReceiptDeduct'))
      document.getElementById('easyReceiptDeduct').value = data.easyReceiptDeduct;
    if (data.insuranceDeduct) document.getElementById('insuranceDeduct').value = data.insuranceDeduct;
    if (data.mortgageDeduct) document.getElementById('mortgageDeduct').value = data.mortgageDeduct;
    if (data.otherDeduct) document.getElementById('otherDeduct').value = data.otherDeduct;
    if (data.withheldTax !== undefined && data.withheldTax !== '' && document.getElementById('withheldTax')) {
      document.getElementById('withheldTax').value = data.withheldTax;
    }

    if (
      data.dividendAmount !== undefined &&
      data.dividendAmount !== '' &&
      document.getElementById('inpDividendAmount')
    ) {
      document.getElementById('inpDividendAmount').value = data.dividendAmount;
    }
    if (data.dividendCitRate && document.getElementById('selCitRate')) {
      document.getElementById('selCitRate').value = data.dividendCitRate;
    }
    if (data.applyDividendToTax !== undefined && document.getElementById('chkApplyDividendToTax')) {
      document.getElementById('chkApplyDividendToTax').checked = !!data.applyDividendToTax;
      const badge = document.getElementById('badge-applied-status');
      if (badge) {
        const isEn = LANG === 'en';
        badge.textContent = data.applyDividendToTax ? (isEn ? 'ACTIVE' : 'เปิดใช้งาน') : isEn ? 'OFF' : 'ปิดอยู่';
        badge.style.color = data.applyDividendToTax ? 'var(--ok)' : 'var(--ink-dim)';
      }
    }
    if (data.dividendAmount && typeof updateDividendTaxCreditUI === 'function') {
      updateDividendTaxCreditUI();
    }

    if (data.incomeMode && (data.incomeMode === 'yearly' || data.incomeMode === 'monthly')) {
      switchIncomeMode(data.incomeMode);
    } else if (parseFloat(document.getElementById('salary').value) > 0) {
      calculateTax();
    }
  } catch (_e) {}
}

const TAX_CALENDAR_STORAGE_KEY = 'moneySuperapp.taxCalendar.state.v1';

function getTaxCalendarState() {
  return MoneyApp.safeJsonParse(TAX_CALENDAR_STORAGE_KEY, { checked: {} });
}

function saveTaxCalendarState(calState) {
  try {
    localStorage.setItem(TAX_CALENDAR_STORAGE_KEY, JSON.stringify(calState));
  } catch (_e) {}
}

function toggleTaxCalendar() {
  if (taxBaseLayoutManager?.toggleCard) {
    taxBaseLayoutManager.toggleCard('panelTaxCalendar');
    return;
  }
  const panel = document.getElementById('taxCalendarPanel');
  if (!panel) return;
  const isHidden = panel.classList.contains('card-collapsed-hidden') || panel.style.display === 'none';
  if (isHidden) {
    panel.classList.remove('card-collapsed-hidden');
    panel.style.display = 'block';
    renderTaxCalendar();
  } else {
    panel.classList.add('card-collapsed-hidden');
  }
}

function toggleCalendarItem(id, isChecked) {
  const calState = getTaxCalendarState();
  if (!calState.checked) calState.checked = {};
  calState.checked[id] = Boolean(isChecked);
  saveTaxCalendarState(calState);
  renderTaxCalendar();
}

function resetTaxCalendarChecklist() {
  const isEn = LANG === 'en';
  const msg = isEn ? 'Reset tax calendar checklist items?' : 'รีเซ็ตรายการเช็คลิสต์ปฏิทินภาษีทั้งหมดหรือไม่?';
  if (!confirm(msg)) return;
  saveTaxCalendarState({ checked: {} });
  renderTaxCalendar();
}

function renderTaxCalendar() {
  if (typeof MoneyApp.calculateThaiTaxDeadlines !== 'function') return;

  const { nextDeadline, deadlines } = MoneyApp.calculateThaiTaxDeadlines();
  const calState = getTaxCalendarState();
  const checkedMap = calState.checked || {};
  const isEn = LANG === 'en';

  const titleEl = document.getElementById('lbl-next-deadline-title');
  const descEl = document.getElementById('val-next-deadline-desc');
  const badgeEl = document.getElementById('val-next-deadline-badge');

  if (nextDeadline && descEl && badgeEl) {
    const name = isEn ? nextDeadline.titleEn : nextDeadline.titleTh;
    const dateStr = isEn
      ? `${nextDeadline.targetDateEn}, ${nextDeadline.targetYear}`
      : `${nextDeadline.targetDateTh} ${nextDeadline.targetYear + 543}`;
    const days = nextDeadline.daysRemaining;

    if (titleEl) {
      titleEl.textContent = isEn ? 'Upcoming Statutory Deadline:' : 'วันครบกำหนดที่ใกล้ที่สุด:';
    }
    descEl.textContent = `${name} (${dateStr})`;

    if (days === 0) {
      badgeEl.textContent = isEn ? 'Today!' : 'วันนี้วันสุดท้าย!';
      badgeEl.style.background = 'var(--alert)';
    } else if (days <= 7) {
      badgeEl.textContent = isEn ? `${days} days left (Urgent)` : `เหลือ ${days} วัน (ด่วน)`;
      badgeEl.style.background = 'var(--alert)';
    } else if (days <= 30) {
      badgeEl.textContent = isEn ? `${days} days left` : `เหลืออีก ${days} วัน`;
      badgeEl.style.background = 'var(--warn)';
    } else {
      badgeEl.textContent = isEn ? `${days} days left` : `เหลืออีก ${days} วัน`;
      badgeEl.style.background = 'var(--core)';
    }
  }

  const listEl = document.getElementById('taxCalendarMilestonesList');
  if (!listEl) return;

  let html = '';
  deadlines.forEach((item) => {
    const isChecked = Boolean(checkedMap[item.id]);
    const name = isEn ? item.titleEn : item.titleTh;
    const desc = isEn ? item.descEn : item.descTh;
    const audience = isEn ? item.audienceEn : item.audienceTh;
    const dateStr = isEn ? `${item.targetDateEn}, ${item.targetYear}` : `${item.targetDateTh} ${item.targetYear + 543}`;
    const days = item.daysRemaining;

    let countdownBadgeHtml = '';
    if (isChecked) {
      countdownBadgeHtml = `<span style="font-size:10px; font-weight:700; color:var(--ok); background:rgba(16, 185, 129, 0.12); padding:2px 8px; border-radius:999px;">✓ ${isEn ? 'Completed' : 'ดำเนินการแล้ว'}</span>`;
    } else if (days === 0) {
      countdownBadgeHtml = `<span style="font-size:10px; font-weight:700; color:var(--alert); background:rgba(239, 68, 68, 0.12); padding:2px 8px; border-radius:999px;">🔥 ${isEn ? 'Today' : 'วันนี้'}</span>`;
    } else if (days <= 7) {
      countdownBadgeHtml = `<span style="font-size:10px; font-weight:700; color:var(--alert); background:rgba(239, 68, 68, 0.12); padding:2px 8px; border-radius:999px;">⚠️ ${days} ${isEn ? 'days left' : 'วันสุดท้าย'}</span>`;
    } else {
      countdownBadgeHtml = `<span style="font-size:10px; font-weight:600; color:var(--ink-faint); background:var(--panel-2); padding:2px 8px; border-radius:999px;">⏳ ${days} ${isEn ? 'days' : 'วัน'}</span>`;
    }

    const itemStyle = isChecked
      ? 'opacity:0.65; background:var(--panel-2); border:1px solid var(--line);'
      : 'background:var(--panel); border:1px solid var(--line);';
    const textStyle = isChecked ? 'text-decoration:line-through;' : '';

    html += `
      <div style="padding:10px 12px; border-radius:8px; display:flex; gap:10px; align-items:flex-start; transition:all 0.15s ease; ${itemStyle}">
        <input type="checkbox" id="chk-cal-${MoneyApp.escapeAttr(item.id)}" ${isChecked ? 'checked' : ''} onchange="toggleCalendarItem('${MoneyApp.escapeAttr(item.id)}', this.checked)" style="margin-top:3px; cursor:pointer;" aria-label="${MoneyApp.escapeAttr(name)}">
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
            <div style="font-weight:700; color:var(--ink); ${textStyle}">${MoneyApp.escapeHtml(name)}</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:10px; font-weight:600; padding:1px 6px; border-radius:4px; background:var(--panel-2); border:1px solid var(--line); color:var(--ink-faint);">${MoneyApp.escapeHtml(dateStr)}</span>
              ${countdownBadgeHtml}
            </div>
          </div>
          <div style="font-size:11px; color:var(--ink-dim); margin-top:2px;">${MoneyApp.escapeHtml(desc)}</div>
          <div style="font-size:10px; color:var(--ink-faint); margin-top:3px;">
            <span>👥 <strong>${isEn ? 'Audience:' : 'กลุ่มเป้าหมาย:'}</strong> ${MoneyApp.escapeHtml(audience)}</span>
          </div>
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html;
}

// Global window exports
window.toggleTaxCalendar = toggleTaxCalendar;
window.toggleCalendarItem = toggleCalendarItem;
window.resetTaxCalendarChecklist = resetTaxCalendarChecklist;
window.renderTaxCalendar = renderTaxCalendar;

loadPreflightState();
loadState();
calculateTax();
updateDividendTaxCreditUI();
renderTaxCalendar();

// Universal Card Layout Manager
const taxBaseLayoutManager =
  typeof MoneyApp !== 'undefined' && MoneyApp.initCardLayoutManager
    ? MoneyApp.initCardLayoutManager({
        container: document.getElementById('taxCardsContainer'),
        cardSelector: '.reorder-card',
        storageKey: 'moneySuperapp.layout.taxbase.v1',
        defaultCollapsed: ['dividendTaxCreditCard', 'panelTaxScenario', 'panelTaxCalendar'],
        defaultOrder: [
          'panelTaxIncome',
          'panelTaxDeductions',
          'dividendTaxCreditCard',
          'panelTaxResults',
          'taxAdvisorCard',
          'panelEFilingWorksheet',
          'panelTaxScenario',
          'panelTaxCalendar',
        ],
        onToggle: (cardId, isCollapsed) => {
          if (!isCollapsed) {
            if (cardId === 'panelTaxScenario') {
              const scenIncInput = document.getElementById('scenIncome');
              if (scenIncInput && !scenIncInput.value) {
                copyCurrentToScenarioB();
              } else {
                runTaxScenarioComparison();
              }
            } else if (cardId === 'panelTaxCalendar') {
              renderTaxCalendar();
            } else if (cardId === 'dividendTaxCreditCard') {
              updateDividendTaxCreditUI();
            }
          }
        },
      })
    : null;

window.taxBaseLayoutManager = taxBaseLayoutManager;

window.resetTaxBaseLayout = () => {
  if (taxBaseLayoutManager) {
    taxBaseLayoutManager.resetLayout();
  }
};
