/**
 * Money Superapp - Thai Statutory Tax Planning Calendar Engine
 * Calculates statutory deadlines, countdowns, and filing compliance milestones.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var TAX_DEADLINE_MILESTONES = [
    {
      id: 'pnd90_paper',
      titleTh: 'ภ.ง.ด. 90/91 (ยื่นแบบกระดาษ)',
      titleEn: 'P.N.D. 90/91 (Paper Filing)',
      descTh: 'ภาษีเงินได้บุคคลธรรมดาประจำปี สำหรับผู้มีเงินได้ทุกประเภท',
      descEn: 'Annual Personal Income Tax Return for all assessable income types',
      targetDateTh: '31 มี.ค.',
      targetDateEn: 'March 31',
      month: 3,
      day: 31,
      audienceTh: 'พนักงานประจำ, ฟรีแลนซ์, ค้าขาย (ม.40(1)-(8))',
      audienceEn: 'Salaried employees, freelancers, business owners',
      badgeTh: 'ยื่นภาษีประจำปี',
      badgeEn: 'Annual PIT',
    },
    {
      id: 'pnd90_online',
      titleTh: 'ภ.ง.ด. 90/91 (ออนไลน์ e-Filing)',
      titleEn: 'P.N.D. 90/91 (Online e-Filing)',
      descTh: 'ยื่นผ่านระบบ e-Filing กรมสรรพากร ได้สิทธิขยายเวลา 8 วัน ขอคืนภาษีผ่านพร้อมเพย์',
      descEn: 'File online via RD e-Filing (+8 days extension) with PromptPay refund',
      targetDateTh: '8 เม.ย.',
      targetDateEn: 'April 8',
      month: 4,
      day: 8,
      audienceTh: 'ผู้ยื่นแบบออนไลน์ทุกคน (แนะนำ สะดวกและรวดเร็ว)',
      audienceEn: 'All online taxpayers (recommended, fastest refunds)',
      badgeTh: 'e-Filing แนะนำ',
      badgeEn: 'Recommended',
    },
    {
      id: 'land_tax',
      titleTh: 'ภาษีที่ดินและสิ่งปลูกสร้าง',
      titleEn: 'Land and Building Tax',
      descTh: 'ชำระภาษีตามหนังสือแจ้งประเมิน (ภ.ด.ส.6/7/8) ณ เทศบาล / อบต. / สนง.เขต',
      descEn: 'Pay annual property assessment at local district office / municipality / TAO',
      targetDateTh: '30 เม.ย.',
      targetDateEn: 'April 30',
      month: 4,
      day: 30,
      audienceTh: 'เจ้าของที่ดิน บ้าน คอนโด หรือสิ่งปลูกสร้างที่เข้าเกณฑ์ประเมิน',
      audienceEn: 'Owners of taxable land, residences, condos, or buildings',
      badgeTh: 'ภาษีทรัพย์สิน',
      badgeEn: 'Property Tax',
    },
    {
      id: 'pnd94_paper',
      titleTh: 'ภ.ง.ด. 94 ครึ่งปี (ยื่นแบบกระดาษ)',
      titleEn: 'P.N.D. 94 Mid-Year (Paper Filing)',
      descTh: 'ยื่นภาษีเงินได้ครึ่งปีแรก (ม.ค. - มิ.ย.) สำหรับผู้มีเงินได้ตาม ม.40(5) ถึง (8)',
      descEn: 'Mid-year PIT return on income earned Jan-Jun under Sections 40(5)-(8)',
      targetDateTh: '30 ก.ย.',
      targetDateEn: 'September 30',
      month: 9,
      day: 30,
      audienceTh: 'ผู้มีรายได้ค่าเช่า (40(5)), วิชาชีพอิสระ (40(6)), รับเหมา (40(7)), พาณิชย์ (40(8))',
      audienceEn: 'Rental income (40(5)), liberal professions (40(6)), contract work, commercial',
      badgeTh: 'ภาษีครึ่งปี',
      badgeEn: 'Mid-Year PIT',
    },
    {
      id: 'pnd94_online',
      titleTh: 'ภ.ง.ด. 94 ครึ่งปี (ออนไลน์ e-Filing)',
      titleEn: 'P.N.D. 94 Mid-Year (Online e-Filing)',
      descTh: 'ยื่นแบบครึ่งปีออนไลน์ผ่านระบบ e-Filing กรมสรรพากร ได้สิทธิขยายเวลาถึง 8 ต.ค.',
      descEn: 'Online mid-year e-Filing with statutory extension to October 8',
      targetDateTh: '8 ต.ค.',
      targetDateEn: 'October 8',
      month: 10,
      day: 8,
      audienceTh: 'ฟรีแลนซ์/ธุรกิจ ม.40(5)-(8) ยื่นออนไลน์สะดวกและปลอดภัย',
      audienceEn: 'Freelance & business taxpayers filing online',
      badgeTh: 'e-Filing ครึ่งปี',
      badgeEn: 'Online Mid-Year',
    },
    {
      id: 'deduction_window',
      titleTh: 'วันสุดท้ายลงทุนลดหย่อนภาษีปีปัจจุบัน',
      titleEn: 'Year-End Deduction Investment Deadline',
      descTh: 'ซื้อกองทุน SSF, RMF, ThaiESG และประกันชีวิต/สุขภาพ ให้เสร็จสิ้นเพื่อลดหย่อนภาษีปีนี้',
      descEn: 'Deadline to purchase SSF, RMF, ThaiESG funds & qualifying insurance for this tax year',
      targetDateTh: '31 ธ.ค.',
      targetDateEn: 'December 31',
      month: 12,
      day: 31,
      audienceTh: 'ผู้เสียภาษีทุกคนที่ต้องการลดหย่อนภาษีและประหยัดเงิน',
      audienceEn: 'All taxpayers looking to reduce tax liability and maximize savings',
      badgeTh: 'โค้งสุดท้ายลดหย่อน',
      badgeEn: 'Deduction Window',
    },
  ];

  function calculateThaiTaxDeadlines(refDate) {
    var current = refDate ? new Date(refDate) : new Date();
    var currentYear = current.getFullYear();
    var startOfDay = new Date(current.getFullYear(), current.getMonth(), current.getDate());

    var computedEvents = TAX_DEADLINE_MILESTONES.map((ev) => {
      var targetYear = currentYear;
      var targetDate = new Date(targetYear, ev.month - 1, ev.day);
      if (targetDate < startOfDay) {
        targetYear += 1;
        targetDate = new Date(targetYear, ev.month - 1, ev.day);
      }
      var diffMs = targetDate.getTime() - startOfDay.getTime();
      var daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return {
        id: ev.id,
        titleTh: ev.titleTh,
        titleEn: ev.titleEn,
        descTh: ev.descTh,
        descEn: ev.descEn,
        targetDateTh: ev.targetDateTh,
        targetDateEn: ev.targetDateEn,
        audienceTh: ev.audienceTh,
        audienceEn: ev.audienceEn,
        badgeTh: ev.badgeTh,
        badgeEn: ev.badgeEn,
        targetYear: targetYear,
        targetDate: targetDate,
        daysRemaining: daysRemaining,
        isPassedThisYear: targetDate.getFullYear() > currentYear,
      };
    });

    computedEvents.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return {
      referenceDate: current,
      nextDeadline: computedEvents[0],
      deadlines: computedEvents,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.TAX_DEADLINE_MILESTONES = TAX_DEADLINE_MILESTONES;
  MoneyApp.calculateThaiTaxDeadlines = calculateThaiTaxDeadlines;

  if (typeof global !== 'undefined') {
    if (typeof global.TAX_DEADLINE_MILESTONES === 'undefined') {
      global.TAX_DEADLINE_MILESTONES = TAX_DEADLINE_MILESTONES;
    }
    if (typeof global.calculateThaiTaxDeadlines === 'undefined') {
      global.calculateThaiTaxDeadlines = calculateThaiTaxDeadlines;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
