/**
 * Money Superapp - Target Date Fund (TDF) Glidepath Engine
 * Dynamic asset allocation across Core (Equities), Ballast (Fixed Income/Bonds),
 * and Satellite (Physical Gold / Alternatives) based on years to retirement and risk profile,
 * modeled after Thai GPF (กบข. แผนสมดุลตามอายุ) and international target-date standards.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  /**
   * @typedef {Object} TargetDateGlidepathSplit
   * @property {number} core - Equities percentage allocation (0-100)
   * @property {number} ballast - Fixed income & bonds percentage allocation (0-100)
   * @property {number} satellite - Gold & alternative assets percentage allocation (0-100)
   */

  /**
   * @typedef {Object} TargetDateAssetBreakdown
   * @property {string} coreDescriptionTh - Thai asset description for core equities
   * @property {string} coreDescriptionEn - English asset description for core equities
   * @property {string} ballastDescriptionTh - Thai asset description for ballast fixed income
   * @property {string} ballastDescriptionEn - English asset description for ballast fixed income
   * @property {string} satelliteDescriptionTh - Thai asset description for satellite assets
   * @property {string} satelliteDescriptionEn - English asset description for satellite assets
   */

  /**
   * @typedef {Object} TargetDateGlidepathParams
   * @property {number|string} [currentAge=30] - Investor's current age
   * @property {number|string} [targetRetirementAge=60] - Target retirement age
   * @property {number|string} [targetYear] - Explicit target retirement year
   * @property {number|string} [currentYear] - Override current reference year
   * @property {'conservative'|'moderate'|'aggressive'} [riskTolerance='moderate'] - Investor risk profile
   */

  /**
   * @typedef {Object} TargetDateGlidepathResult
   * @property {number} currentAge - Evaluated investor age
   * @property {number} targetRetirementAge - Evaluated target retirement age
   * @property {number} yearsToRetire - Net investment horizon years remaining
   * @property {number} targetYear - Computed retirement calendar year
   * @property {'conservative'|'moderate'|'aggressive'} riskTolerance - Evaluated risk tolerance
   * @property {TargetDateGlidepathSplit} split - Recommended percentage allocation split
   * @property {'early_accumulation'|'mid_transition'|'pre_retirement'|'distribution'} phaseKey - Lifecycle phase
   * @property {string} phaseNameTh - Thai lifecycle phase title
   * @property {string} phaseNameEn - English lifecycle phase title
   * @property {string} adviceTh - Thai strategic portfolio guidance
   * @property {string} adviceEn - English strategic portfolio guidance
   * @property {TargetDateAssetBreakdown} assetBreakdown - Descriptive asset classes
   */

  /**
   * Target Date Fund (TDF) Glidepath Allocation Engine
   *
   * @param {TargetDateGlidepathParams} [params]
   * @returns {TargetDateGlidepathResult} Target allocation split, phase narrative, and asset class descriptions
   */
  function calculateTargetDateGlidepath(params) {
    if (!params) params = {};

    var currentAge = parseInt(params.currentAge, 10);
    var targetRetirementAge = parseInt(params.targetRetirementAge, 10);
    var targetYear = parseInt(params.targetYear, 10);
    var currentYear = parseInt(params.currentYear, 10);
    var riskTolerance = params.riskTolerance || 'moderate';

    var nowYear = !Number.isNaN(currentYear) && currentYear > 1900 ? currentYear : new Date().getFullYear();

    if (Number.isNaN(currentAge) || currentAge < 15) currentAge = 30;
    if (Number.isNaN(targetRetirementAge) || targetRetirementAge < 40) targetRetirementAge = 60;

    var yearsToRetire;
    if (!Number.isNaN(targetYear) && targetYear > nowYear) {
      yearsToRetire = targetYear - nowYear;
      targetRetirementAge = currentAge + yearsToRetire;
    } else {
      yearsToRetire = targetRetirementAge - currentAge;
      targetYear = nowYear + yearsToRetire;
    }

    var youngCore;
    var youngBallast;
    var youngSat;
    var matureCore;
    var matureBallast;
    var matureSat;

    if (riskTolerance === 'aggressive') {
      youngCore = 85;
      youngBallast = 5;
      youngSat = 10;
      matureCore = 35;
      matureBallast = 60;
      matureSat = 5;
    } else if (riskTolerance === 'conservative') {
      youngCore = 70;
      youngBallast = 25;
      youngSat = 5;
      matureCore = 20;
      matureBallast = 75;
      matureSat = 5;
    } else {
      youngCore = 80;
      youngBallast = 15;
      youngSat = 5;
      matureCore = 25;
      matureBallast = 70;
      matureSat = 5;
    }

    var t;
    if (yearsToRetire >= 25) {
      t = 1.0;
    } else if (yearsToRetire <= 0) {
      t = 0.0;
    } else {
      t = yearsToRetire / 25.0;
    }

    var corePct = Math.round(matureCore + t * (youngCore - matureCore));
    var satPct = Math.round(matureSat + t * (youngSat - matureSat));
    var ballastPct = 100 - corePct - satPct;

    var phaseKey;
    var phaseNameTh;
    var phaseNameEn;
    var adviceTh;
    var adviceEn;

    if (yearsToRetire > 20) {
      phaseKey = 'early_accumulation';
      phaseNameTh = 'ระยะสะสมความมั่งคั่งเชิงรุก (Early Accumulation)';
      phaseNameEn = 'Early Wealth Accumulation';
      adviceTh =
        'ระยะเวลาลงทุนมากกว่า 20 ปี ควรเน้นสินทรัพย์เติบโตสูง (หุ้นไทย/หุ้นโลก) เป็นหลักเพื่อพลังผลตอบแทนทบต้น ความผันผวนระยะสั้นมีเวลาฟื้นตัวได้เต็มที่';
      adviceEn =
        'With 20+ years until retirement, maximize exposure to growth assets (Global/Thai equities) for compounding growth. Short-term market dips have ample time to recover.';
    } else if (yearsToRetire > 10) {
      phaseKey = 'mid_transition';
      phaseNameTh = 'ระยะเติบโตสมดุล (Mid-Career Transition)';
      phaseNameEn = 'Mid-Career Balanced Growth';
      adviceTh =
        'เหลือเวลา 10-20 ปี ควรเริ่มสร้างกันชนพอร์ต (Ballast) ด้วยตราสารหนี้คุณภาพดีและพันธบัตรรัฐบาล ควบคู่กับหุ้นแกนหลัก เพื่อลดความเสี่ยงก่อนถึงช่วงเปลี่ยนผ่าน';
      adviceEn =
        'With 10-20 years remaining, introduce fixed-income stabilizers (Ballast) alongside core equities to smooth portfolio volatility as retirement nears.';
    } else if (yearsToRetire > 0) {
      phaseKey = 'pre_retirement';
      phaseNameTh = 'ระยะเตรียมพร้อมเกษียณ (Pre-Retirement Capital Preservation)';
      phaseNameEn = 'Pre-Retirement Capital Preservation';
      adviceTh =
        'เหลือเวลาไม่ถึง 10 ปี ต้องเน้นรักษาเงินต้น (Capital Preservation) เพิ่มสัดส่วนตราสารหนี้และสภาพคล่องเป็นหลัก เพื่อป้องกันความเสี่ยง Sequence of Returns Risk';
      adviceEn =
        'Within 10 years of retirement, prioritize capital preservation. Increase high-quality fixed income to protect against Sequence of Returns Risk.';
    } else {
      phaseKey = 'distribution';
      phaseNameTh = 'ระยะเกษียณอายุ/สร้างกระแสเงินสด (Retirement Distribution)';
      phaseNameEn = 'Retirement Distribution & Income';
      adviceTh =
        'เข้าสู่วัยเกษียณแล้ว พอร์ตเน้นสร้างกระแสเงินสดสม่ำเสมอ (พันธบัตร/เงินฝากดอกเบี้ยสูง) 65-75% และคงหุ้นปันผลคุณภาพดี 20-25% เพื่อสู้กับเงินเฟ้อ';
      adviceEn =
        'In retirement: focus on steady income and capital protection (65-75% fixed income) while retaining 20-25% dividend growth equities to hedge inflation.';
    }

    return {
      currentAge: currentAge,
      targetRetirementAge: targetRetirementAge,
      yearsToRetire: yearsToRetire,
      targetYear: targetYear,
      riskTolerance: riskTolerance,
      split: {
        core: corePct,
        ballast: ballastPct,
        satellite: satPct,
      },
      phaseKey: phaseKey,
      phaseNameTh: phaseNameTh,
      phaseNameEn: phaseNameEn,
      adviceTh: adviceTh,
      adviceEn: adviceEn,
      assetBreakdown: {
        coreDescriptionTh: 'หุ้นโลก (Global Equities), หุ้นไทย (SET50/100), กองทุนอสังหาฯ/REITs',
        coreDescriptionEn: 'Global Equities, Thai Equities, REITs & Infrastructure',
        ballastDescriptionTh: 'พันธบัตรรัฐบาล, กองทุนตราสารหนี้ระยะกลาง, เงินฝากประจำ/สภาพคล่อง',
        ballastDescriptionEn: 'Govt Bonds, High-Quality Corporate Bonds, Liquid Cash',
        satelliteDescriptionTh: 'ทองคำแท่ง (96.5%), สินทรัพย์ดิจิทัล, ธีมการลงทุนเฉพาะตัว',
        satelliteDescriptionEn: 'Physical Gold, Digital Assets, Thematic Opportunities',
      },
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateTargetDateGlidepath = calculateTargetDateGlidepath;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateTargetDateGlidepath === 'undefined') {
      global.calculateTargetDateGlidepath = calculateTargetDateGlidepath;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
