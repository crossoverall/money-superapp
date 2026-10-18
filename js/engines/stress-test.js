/**
 * Money Superapp - Income Shock Stress-Tester & Child Education Sinking Fund Engine
 * - Emergency Fund & Income Shock Stress-Tester: simulates sudden loss of income (layoff, resignation, illness, total shock),
 *   models Section 33 SSO benefits, severance buffers, and calculates survival runways.
 * - Child Education Sinking Fund Planner: models education tuition inflation, major Thai education tracks,
 *   compounds existing savings, and computes required monthly DCA.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  var formatMoney = (val) => {
    if (global.MoneyApp && typeof global.MoneyApp.formatMoney === 'function') {
      return global.MoneyApp.formatMoney(val);
    }
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  /**
   * Phase 67: Emergency Fund & Income Shock Stress-Tester.
   * Simulates sudden loss of income (layoff, resignation, illness, or total shock),
   * compares Barebones survival vs Standard lifestyle drain, and models Section 33
   * Social Security unemployment benefit offsets and severance buffers.
   */
  function calculateIncomeShockStressTest(params) {
    var p = params || {};
    var liquidReserve = Math.max(0, Number(p.liquidReserve) || 0);
    var severanceBuffer = Math.max(0, Number(p.severanceBuffer) || 0);
    var totalLiquidity = liquidReserve + severanceBuffer;

    var monthlyNeeds = Math.max(0, Number(p.monthlyNeeds) || 0);
    var monthlyWants = Math.max(0, Number(p.monthlyWants) || 0);
    var monthlyDebt = Math.max(0, Number(p.monthlyDebtService) || 0);

    var barebonesMonthly = monthlyNeeds + monthlyDebt;
    var standardMonthly = monthlyNeeds + monthlyWants + monthlyDebt;

    var shockType = p.shockType || 'layoff';
    var ssoMonthly = 0;
    var ssoDurationMonths = 0;

    if (shockType === 'layoff') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 7500;
      ssoDurationMonths = 6;
    } else if (shockType === 'resignation') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 4500;
      ssoDurationMonths = 3;
    } else if (shockType === 'medical') {
      ssoMonthly = typeof p.customSsoMonthly === 'number' ? p.customSsoMonthly : 7500;
      ssoDurationMonths = 3;
    } else {
      // total_shock
      ssoMonthly = 0;
      ssoDurationMonths = 0;
    }

    // Calculate Barebones Runway without SSO
    var barebonesRunway = barebonesMonthly > 0 ? totalLiquidity / barebonesMonthly : totalLiquidity > 0 ? 999 : 0;

    // Calculate Standard Runway without SSO
    var standardRunway = standardMonthly > 0 ? totalLiquidity / standardMonthly : totalLiquidity > 0 ? 999 : 0;

    // Calculate Runway with SSO offset (month-by-month simulation)
    var rem = totalLiquidity;
    var ssoRunway = 0;
    var m;
    var maxMonths = 360; // 30 years cap
    var benefit = 0;
    var netDrain = 0;
    if (barebonesMonthly <= 0) {
      ssoRunway = totalLiquidity > 0 ? 999 : 0;
    } else {
      for (m = 1; m <= maxMonths; m++) {
        benefit = m <= ssoDurationMonths ? ssoMonthly : 0;
        netDrain = Math.max(0, barebonesMonthly - benefit);
        if (netDrain === 0) {
          ssoRunway += 1;
          continue;
        }
        if (rem >= netDrain) {
          rem -= netDrain;
          ssoRunway += 1;
        } else {
          ssoRunway += rem / netDrain;
          rem = 0;
          break;
        }
      }
    }

    var extendedMonths = Math.max(0, ssoRunway - barebonesRunway);

    // Risk Level Verdict
    var riskLevel = 'critical';
    if (ssoRunway >= 12) {
      riskLevel = 'safe';
    } else if (ssoRunway >= 6) {
      riskLevel = 'moderate';
    } else if (ssoRunway >= 3) {
      riskLevel = 'high_risk';
    } else {
      riskLevel = 'critical';
    }

    var ladder = [
      {
        step: 1,
        titleTh: 'เงินสดและเงินฝากออมทรัพย์ฉุกเฉิน (Cash First)',
        titleEn: 'Emergency Cash & Liquid Savings (Cash First)',
        amount: liquidReserve,
        noteTh: 'ใช้สภาพคล่องส่วนนี้ก่อนเป็นลำดับแรกเพื่อหลีกเลี่ยงการขายสินทรัพย์ขาดทุน',
        noteEn: 'Draw down pure liquid cash first to prevent forced asset fire-sales.',
      },
      {
        step: 2,
        titleTh: 'สิทธิประโยชน์ว่างงาน ปกส. ม.33 และเงินชดเชยเลิกจ้าง',
        titleEn: 'Section 33 SSO Unemployment & Severance Buffer',
        amount: severanceBuffer + ssoMonthly * ssoDurationMonths,
        noteTh:
          ssoMonthly > 0
            ? 'ยื่นเงินชดเชยว่างงาน ปกส. ม.33 ภายใน 30 วัน ได้รับ ' +
              formatMoney(ssoMonthly) +
              ' บ./ด. นาน ' +
              ssoDurationMonths +
              ' เดือน'
            : 'ไม่ได้รับเงินชดเชยว่างงานในสถานการณ์นี้',
        noteEn:
          ssoMonthly > 0
            ? 'Claim SSO benefit within 30 days: ' +
              formatMoney(ssoMonthly) +
              ' THB/mo for ' +
              ssoDurationMonths +
              ' months.'
            : 'No unemployment offset available under this scenario.',
      },
      {
        step: 3,
        titleTh: 'กองทุนรวมตลาดเงิน (MMF) และทองคำแท่งสภาพคล่องสูง',
        titleEn: 'Money Market Funds (MMF) & High-Liquidity Gold',
        noteTh: 'แปลงสินทรัพย์ความเสี่ยงต่ำเป็นเงินสดเมื่อเงินสำรองหลักเหลือน้อยกว่า 2 เดือน',
        noteEn: 'Liquidate low-risk defensive holdings when cash buffer drops below 2 months.',
      },
      {
        step: 4,
        titleTh: 'มาตรการพักชำระหนี้หรือเจรจาปรับโครงสร้างหนี้ฉุกเฉิน',
        titleEn: 'Debt Moratorium & Emergency Restructuring',
        noteTh: 'ติดต่อสถาบันการเงินทันทีก่อนเกิดการค้างชำระเพื่อขอลดค่างวดหรือพักเงินต้น',
        noteEn: 'Proactively contact lenders for loan restructuring or interest pause before default.',
      },
    ];

    return {
      totalAvailableLiquidity: totalLiquidity,
      liquidReserve: liquidReserve,
      severanceBuffer: severanceBuffer,
      barebonesMonthlyExpense: barebonesMonthly,
      standardMonthlyExpense: standardMonthly,
      shockType: shockType,
      ssoMonthlyBenefit: ssoMonthly,
      ssoBenefitMonths: ssoDurationMonths,
      scenarios: {
        barebones: {
          monthlyDrain: barebonesMonthly,
          runwayMonths: Math.round(barebonesRunway * 10) / 10,
          survivalDays: Math.round(barebonesRunway * 30),
        },
        standard: {
          monthlyDrain: standardMonthly,
          runwayMonths: Math.round(standardRunway * 10) / 10,
          survivalDays: Math.round(standardRunway * 30),
        },
        withSsoOffset: {
          runwayMonths: Math.round(ssoRunway * 10) / 10,
          survivalDays: Math.round(ssoRunway * 30),
          extendedMonths: Math.round(extendedMonths * 10) / 10,
        },
      },
      riskLevel: riskLevel,
      liquidityLadder: ladder,
    };
  }

  /**
   * Phase 68: Child Education & Higher Learning Sinking Fund Planner.
   * Models education tuition inflation (typically 4-7% p.a., exceeding headline CPI),
   * evaluates future values across major Thai education pathways (Government, Bilingual,
   * Private, Inter-Thai, and Overseas Degrees), factors existing dedicated savings,
   * and computes required monthly investment DCA to bridge the education gap.
   */
  function calculateChildEducationFund(params) {
    var p = params || {};
    var currentAge = Math.max(0, Math.min(25, Number(p.currentAge) || 0));
    var targetAge = Math.max(currentAge, Math.min(30, Number(p.targetAge) || 18));
    var yearsToCollege = Math.max(0, targetAge - currentAge);
    var degreeDuration = Math.max(1, Math.min(10, Number(p.degreeDurationYears) || 4));

    // Preset base annual tuition estimates (present value THB)
    var trackTuitionDefaults = {
      thai_public: 60000, // Thai Government University ~60,000 THB/yr
      bilingual: 200000, // Thai English Program / Bilingual ~200,000 THB/yr
      private: 120000, // Private Thai University ~120,000 THB/yr
      inter_thai: 650000, // International University in Thailand ~650,000 THB/yr
      inter_overseas: 1800000, // Overseas University (Tuition + Living) ~1,800,000 THB/yr
    };

    var track = p.educationTrack || 'thai_public';
    var baseTuition =
      typeof p.customAnnualTuition === 'number' && p.customAnnualTuition > 0
        ? p.customAnnualTuition
        : trackTuitionDefaults[track] || trackTuitionDefaults.thai_public;

    var inflationRate =
      typeof p.tuitionInflationRate === 'number' && p.tuitionInflationRate >= 0 ? p.tuitionInflationRate / 100 : 0.05; // default 5.0% annual tuition inflation

    var returnRate =
      typeof p.expectedInvestmentReturn === 'number' && p.expectedInvestmentReturn >= 0
        ? p.expectedInvestmentReturn / 100
        : 0.06; // default 6.0% expected annual portfolio growth

    var existingSavings = Math.max(0, Number(p.existingEducationSavings) || 0);

    // Sum inflated tuition over degree duration
    var totalFutureTuitionNeeded = 0;
    var y;
    var elapsed = 0;
    var tuitionInYear = 0;
    var yearlyProjections = [];

    for (y = 0; y < degreeDuration; y++) {
      elapsed = yearsToCollege + y;
      tuitionInYear = Math.round(baseTuition * (1 + inflationRate) ** elapsed);
      totalFutureTuitionNeeded += tuitionInYear;
      yearlyProjections.push({
        degreeYear: y + 1,
        childAge: targetAge + y,
        tuitionCost: tuitionInYear,
      });
    }

    // Future value of existing dedicated savings at the start of college (compounded over yearsToCollege)
    var fvExistingSavings = Math.round(existingSavings * (1 + returnRate) ** yearsToCollege);

    // Net education shortfall needed in future
    var netFundShortfall = Math.max(0, totalFutureTuitionNeeded - fvExistingSavings);

    // Monthly DCA investment needed:
    var monthlyDcaNeeded = 0;
    var totalMonths = yearsToCollege * 12;
    var monthlyRate = 0;
    var compoundFactor = 0;

    if (netFundShortfall > 0 && totalMonths > 0) {
      if (returnRate > 0) {
        monthlyRate = returnRate / 12;
        // Sinking Fund Annuity Formula: PMT = FV * (r / ((1 + r)^n - 1))
        compoundFactor = (1 + monthlyRate) ** totalMonths;
        monthlyDcaNeeded = Math.round(netFundShortfall * (monthlyRate / (compoundFactor - 1)));
      } else {
        monthlyDcaNeeded = Math.round(netFundShortfall / totalMonths);
      }
    } else if (netFundShortfall > 0 && totalMonths === 0) {
      monthlyDcaNeeded = netFundShortfall;
    }

    // Progress percentage
    var fundedRatio =
      totalFutureTuitionNeeded > 0
        ? Math.min(100, Math.round((fvExistingSavings / totalFutureTuitionNeeded) * 1000) / 10)
        : 100;

    return {
      currentAge: currentAge,
      targetAge: targetAge,
      yearsToCollege: yearsToCollege,
      degreeDurationYears: degreeDuration,
      educationTrack: track,
      baseAnnualTuition: baseTuition,
      tuitionInflationRate: Math.round(inflationRate * 1000) / 10,
      expectedInvestmentReturn: Math.round(returnRate * 1000) / 10,
      existingSavings: existingSavings,
      fvExistingSavings: fvExistingSavings,
      totalFutureTuitionNeeded: totalFutureTuitionNeeded,
      netFundShortfall: netFundShortfall,
      monthlyDcaNeeded: monthlyDcaNeeded,
      fundedRatioPct: fundedRatio,
      yearlyProjections: yearlyProjections,
    };
  }

  // Export on MoneyApp namespace
  global.MoneyApp = global.MoneyApp || {};
  var MoneyApp = global.MoneyApp;
  MoneyApp.calculateIncomeShockStressTest = calculateIncomeShockStressTest;
  MoneyApp.calculateChildEducationFund = calculateChildEducationFund;

  if (typeof global !== 'undefined') {
    if (typeof global.calculateIncomeShockStressTest === 'undefined') {
      global.calculateIncomeShockStressTest = calculateIncomeShockStressTest;
    }
    if (typeof global.calculateChildEducationFund === 'undefined') {
      global.calculateChildEducationFund = calculateChildEducationFund;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
