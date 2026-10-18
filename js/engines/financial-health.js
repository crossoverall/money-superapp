/**
 * Money Superapp - Financial Health & Advisor Engine
 * Calculates 5-pillar composite health scores (Runway, Savings, Debt, Wealth, Tax),
 * priority-ranked Next Best Move action recommendations, Net Worth composition,
 * and 5-axis Radar / Spider chart trigonometry.
 * 100% offline & client-side compatible (file:// and http(s)://).
 */

((global) => {
  /**
   * Calculates comprehensive 5-pillar financial health score.
   * @param {Object} options
   * @returns {{ compositeScore: number, tier: string, pillars: { runway: number, savings: number, debt: number, wealth: number, tax: number } }}
   */
  function calculateFinancialHealthScore({
    runwayMonths = 0,
    savingsRatePct = 0,
    debt = 0,
    assets = 0,
    netWorth = 0,
    fireTarget = 0,
    targetNetWorth = 0,
    annualExpenses = 0,
    taxDeductionsUtilizedPct = null,
  } = {}) {
    const safeRunway = Math.max(0, runwayMonths || 0);
    const runwayScore = Math.min(100, Math.round((safeRunway / 6.0) * 100));

    const safeSavingsRate = Math.max(0, savingsRatePct || 0);
    const savingsScore = Math.min(100, Math.round((safeSavingsRate / 50.0) * 100));

    const safeDebt = Math.max(0, debt || 0);
    const safeAssets = Math.max(0, assets || 0);
    let debtScore = 100;
    if (safeDebt > 0) {
      if (safeAssets <= 0) {
        debtScore = 0;
      } else {
        const daRatio = safeDebt / safeAssets;
        debtScore = Math.max(0, Math.min(100, Math.round((1 - Math.min(1, daRatio)) * 100)));
      }
    }

    const safeNetWorth = Math.max(0, netWorth || 0);
    let wealthScore = 50;
    if (fireTarget > 0) {
      wealthScore = Math.min(100, Math.round((safeNetWorth / fireTarget) * 100));
    } else if (targetNetWorth > 0) {
      wealthScore = Math.min(100, Math.round((safeNetWorth / targetNetWorth) * 100));
    } else if (annualExpenses > 0) {
      wealthScore = Math.min(100, Math.round((safeNetWorth / (annualExpenses * 25)) * 100));
    } else if (safeAssets > 0) {
      wealthScore = Math.min(100, Math.max(10, Math.round((safeAssets / 5000000) * 100)));
    }

    let taxScore = 75;
    if (typeof taxDeductionsUtilizedPct === 'number' && !Number.isNaN(taxDeductionsUtilizedPct)) {
      taxScore = Math.max(0, Math.min(100, Math.round(taxDeductionsUtilizedPct)));
    }

    const pillars = {
      runway: runwayScore,
      savings: savingsScore,
      debt: debtScore,
      wealth: wealthScore,
      tax: taxScore,
    };

    const compositeScore = Math.round(
      (pillars.runway + pillars.savings + pillars.debt + pillars.wealth + pillars.tax) / 5,
    );

    let tier = 'moderate';
    if (compositeScore >= 80) tier = 'excellent';
    else if (compositeScore >= 65) tier = 'solid';
    else if (compositeScore < 50) tier = 'critical';

    return {
      compositeScore,
      tier,
      pillars,
    };
  }

  /**
   * Generates prioritized Next Best Move action recommendations based on financial profile and health score.
   * @param {Object} p Financial profile
   * @param {Object} h Health score output
   * @param {boolean} [isEn=false]
   * @param {Function} [formatMoney]
   * @returns {Array<Object>}
   */
  function generateNextBestMoves(p = {}, h = {}, isEn = false, formatMoney = (v) => String(v)) {
    const runwayMonths = typeof p.runwayMonths === 'number' ? p.runwayMonths : 0;
    const totalDebt = typeof p.totalDebt === 'number' ? p.totalDebt : 0;
    const savingsRate = typeof p.savingsRate === 'number' ? p.savingsRate : 0;
    const topMarginalRate = typeof p.topMarginalRate === 'number' ? p.topMarginalRate : 0;
    const monthlyInvest = typeof p.monthlyInvest === 'number' ? p.monthlyInvest : 0;
    const debtPillar = h.pillars ? h.pillars.debt : 100;
    const runwayPillar = h.pillars ? h.pillars.runway : 0;
    const taxPillar = h.pillars ? h.pillars.tax : 75;

    const candidates = [];

    // Priority 1: Emergency Runway Shortfall
    if (runwayMonths < 3.0 || runwayPillar < 50) {
      candidates.push({
        id: 'runway-shortfall',
        priority: 1,
        badge: isEn ? 'Priority 1 (Defense)' : 'เร่งด่วนระดับ 1 (สภาพคล่อง)',
        title: isEn ? 'Build Emergency Liquid Reserve' : 'เติมสภาพคล่องเงินสำรองฉุกเฉิน',
        description: isEn
          ? `Runway is currently ${runwayMonths.toFixed(1)} months. Aim for at least 3-6 months to protect against unexpected disruption.`
          : `เงินสำรองฉุกเฉินครอบคลุมค่าใช้จ่ายเพียง ${runwayMonths.toFixed(1)} เดือน ควรสะสมอย่างน้อย 3-6 เดือนเพื่อเป็นกันชนความเสี่ยง`,
        impact: isEn ? 'Shields against financial shocks' : 'เป้าหมายความปลอดภัย: 3-6 เดือน',
        actionLabel: isEn ? 'Allocate Cash Flow ➔' : 'จัดสรรงบเงินสด ➔',
        targetTab: 'remaining-money',
      });
    }

    // Priority 1: High Debt Burden Drag
    if (totalDebt > 0 && debtPillar < 70) {
      const formattedDebt = typeof formatMoney === 'function' ? formatMoney(totalDebt) : totalDebt.toLocaleString();
      candidates.push({
        id: 'debt-drag',
        priority: 1,
        badge: isEn ? 'Priority 1 (Debt)' : 'เร่งด่วนระดับ 1 (ภาระหนี้)',
        title: isEn ? 'Accelerate Debt Payoff' : 'เร่งปลดภาระหนี้สินคงค้าง',
        description: isEn
          ? `Outstanding debt is ${formattedDebt}. Prioritize high-interest balances with Avalanche or Snowball to reduce interest drag.`
          : `มียอดหนี้คงค้าง ${formattedDebt} บาท ควรวางแผนทยอยปิดหนี้ดอกเบี้ยสูงเพื่อหยุดการไหลออกของกระแสเงินสด`,
        impact: isEn ? 'Frees up net cash flow' : 'ลดภาระดอกเบี้ยจ่ายสะสม',
        actionLabel: isEn ? 'Plan Debt Payoff ➔' : 'วางแผนปลดหนี้ ➔',
        targetTab: 'debt-calculator',
      });
    }

    // Priority 2: Savings Rate Under 20%
    if (savingsRate < 20) {
      candidates.push({
        id: 'savings-boost',
        priority: 2,
        badge: isEn ? 'Priority 2 (Savings)' : 'สำคัญระดับ 2 (การออม)',
        title: isEn ? 'Boost Net Savings Rate to 20%+' : 'เร่งเพิ่มอัตราการออมสุทธิแตะ 20%+',
        description: isEn
          ? `Your current savings rate is ${savingsRate.toFixed(1)}%. Reviewing variable expenses can push your monthly wealth accumulation past 20%.`
          : `อัตราการออมปัจจุบันอยู่ที่ ${savingsRate.toFixed(1)}% การทบทวนและลดรายจ่ายผันแปรจะช่วยผลักดันให้แตะเกณฑ์ 20% เพื่อความมั่นคง`,
        impact: isEn ? 'Target savings rate: 20-30%' : 'เกณฑ์แนะนำขั้นต่ำ: 20%',
        actionLabel: isEn ? 'Review Daily Expenses ➔' : 'ทบทวนรายจ่ายประจำเดือน ➔',
        targetTab: 'remaining-money',
      });
    }

    // Priority 2: Tax Bracket Optimization (Marginal Rate >= 15% with unutilized tax score)
    if (topMarginalRate >= 15 && taxPillar < 85) {
      candidates.push({
        id: 'tax-bracket',
        priority: 2,
        badge: isEn ? 'Priority 2 (Tax)' : 'สำคัญระดับ 2 (วางแผนภาษี)',
        title: isEn ? 'Optimize Tax Allowances (ThaiESG / RMF)' : 'ใช้สิทธิลดหย่อนภาษี (ThaiESG / RMF)',
        description: isEn
          ? `Your top tax bracket is ${topMarginalRate}%. Deductible contributions directly yield an instant ${topMarginalRate}% tax return.`
          : `คุณอยู่ในฐานภาษี ${topMarginalRate}% การลงทุนใน ThaiESG, RMF หรือประกันชีวิตจะได้รับผลตอบแทนทันทีในรูปของเงินภาษีที่ประหยัดได้`,
        impact: isEn ? `Instant ${topMarginalRate}% tax relief` : `ประหยัดภาษีตามฐาน ${topMarginalRate}%`,
        actionLabel: isEn ? 'Plan Tax Deductions ➔' : 'วางแผนลดหย่อนภาษี ➔',
        targetTab: 'tax-calculator-base',
      });
    }

    // Priority 3: Deploy Monthly DCA Surplus
    if (runwayMonths >= 3.0 && monthlyInvest > 0) {
      const formattedInvest =
        typeof formatMoney === 'function' ? formatMoney(monthlyInvest) : monthlyInvest.toLocaleString();
      candidates.push({
        id: 'deploy-dca',
        priority: 3,
        badge: isEn ? 'Priority 3 (Growth)' : 'เสริมแกร่งระดับ 3 (ลงทุน DCA)',
        title: isEn ? 'Execute Monthly DCA & Rebalancing' : 'จัดสรรเงินลงทุน DCA ตามเป้าหมาย',
        description: isEn
          ? `You have ${formattedInvest} monthly investable surplus with a protected cash reserve. Rebalance to keep your asset allocation on target.`
          : `คุณมีเงินเหลือลงทุน ${formattedInvest} บาท/เดือน พร้อมเงินสำรองปลอดภัย จัดสรรเข้าพอร์ตเป้าหมายตามหลัก DCA`,
        impact: isEn ? 'Compounds long-term wealth' : 'สร้างผลตอบแทนทบต้นระยะยาว',
        actionLabel: isEn ? 'Rebalance Portfolio ➔' : 'ปรับสัดส่วนพอร์ต ➔',
        targetTab: 'rebalance',
      });
    }

    // Priority 3: Wealth Resilience & Retirement Readiness
    if (candidates.length < 3 || (h.compositeScore && h.compositeScore >= 80)) {
      candidates.push({
        id: 'wealth-resilience',
        priority: 3,
        badge: isEn ? 'Priority 3 (Freedom)' : 'เสริมแกร่งระดับ 3 (อิสรภาพการเงิน)',
        title: isEn ? 'Review Retirement 3-Bucket & Asset Protection' : 'ตรวจสอบแผนเกษียณ 3-Bucket & สินทรัพย์ทางเลือก',
        description: isEn
          ? 'Your overall financial foundations are resilient. Simulate retirement cash flow and stress-test your wealth safety.'
          : 'สุขภาพทางการเงินโดยรวมแข็งแกร่งมาก ทดสอบจำลองกระแสเงินสดหลังเกษียณ หรือตรวจสอบการกระจายความเสี่ยงในสินทรัพย์ทางเลือก',
        impact: isEn ? 'Sustainable retirement peace of mind' : 'ความยั่งยืนทางการเงินระยะยาว',
        actionLabel: isEn ? 'Simulate Retirement ➔' : 'ตรวจสอบแผนเกษียณ ➔',
        targetTab: 'dashboard',
      });
    }

    candidates.sort((a, b) => a.priority - b.priority);
    return candidates.slice(0, 3);
  }

  /**
   * Calculates 5-axis Radar / Spider chart polygon vertices and grid paths.
   * @param {Object} pillars { runway, savings, debt, wealth, tax }
   * @param {Object} [options]
   * @returns {{ dataPointsString: string, pointCoordinates: Array<{ x: number, y: number, score: number, key: string, label: string }>, gridRings: Array<string>, spokes: Array<{ x1: number, y1: number, x2: number, y2: number, labelX: number, labelY: number, label: string }> }}
   */
  function calculateRadarCoordinates(pillars = {}, options = {}) {
    const centerX = options.centerX || 150;
    const centerY = options.centerY || 130;
    const maxR = options.maxR || 85;
    const isEn = options.isEn || false;

    const axes = [
      { key: 'runway', label: isEn ? 'Runway' : 'สำรอง' },
      { key: 'savings', label: isEn ? 'Savings' : 'การออม' },
      { key: 'debt', label: isEn ? 'Debt-Free' : 'ภาระหนี้' },
      { key: 'wealth', label: isEn ? 'Wealth' : 'มั่งคั่ง' },
      { key: 'tax', label: isEn ? 'Tax Opt' : 'ภาษี' },
    ];

    const rings = [0.25, 0.5, 0.75, 1.0];
    const gridRings = rings.map((k) => {
      const r = maxR * k;
      const pts = [];
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
      return pts.join(' ');
    });

    const spokes = axes.map((ax, i) => {
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
      const xOuter = centerX + maxR * Math.cos(angle);
      const yOuter = centerY + maxR * Math.sin(angle);
      const labelX = centerX + (maxR + 20) * Math.cos(angle);
      const labelY = centerY + (maxR + 18) * Math.sin(angle) + 4;
      return {
        x1: centerX,
        y1: centerY,
        x2: Number(xOuter.toFixed(1)),
        y2: Number(yOuter.toFixed(1)),
        labelX: Number(labelX.toFixed(1)),
        labelY: Number(labelY.toFixed(1)),
        label: ax.label,
      };
    });

    const pointCoordinates = axes.map((ax, i) => {
      const score = Math.max(5, Math.min(100, pillars[ax.key] || 0));
      const r = maxR * (score / 100);
      const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return {
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        score,
        key: ax.key,
        label: ax.label,
      };
    });

    const dataPointsString = pointCoordinates.map((p) => `${p.x},${p.y}`).join(' ');

    return {
      dataPointsString,
      pointCoordinates,
      gridRings,
      spokes,
    };
  }

  /**
   * Renders the interactive Radar Chart SVG in the provided DOM container groups.
   */
  function renderRadarChartSVG(elements, pillars, options = {}) {
    if (!elements) return;
    const { gridGroup, spokesGroup, polyEl, pointsGroup, labelsGroup } = elements;
    if (!gridGroup || !spokesGroup || !polyEl || !pointsGroup || !labelsGroup) return;

    const coords = calculateRadarCoordinates(pillars, options);

    gridGroup.innerHTML = coords.gridRings.map((pts) => `<polygon points="${pts}" />`).join('');
    spokesGroup.innerHTML = coords.spokes
      .map((s) => `<line x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" />`)
      .join('');
    labelsGroup.innerHTML = coords.spokes
      .map((s) => `<text x="${s.labelX}" y="${s.labelY}">${s.label}</text>`)
      .join('');
    polyEl.setAttribute('points', coords.dataPointsString);
    pointsGroup.innerHTML = coords.pointCoordinates
      .map(
        (p) => `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="var(--panel)" stroke="var(--core)" stroke-width="2" />`,
      )
      .join('');
  }

  /**
   * Calculates net worth composition proportions and solvency ratios.
   * @param {Object} p
   * @returns {{ grossAssets: number, cashPct: number, investPct: number, goldPct: number, debtRatio: number, solvencyRatio: number }}
   */
  function calculateNetWorthComposition(p = {}) {
    const c = Math.max(0, p.emergencyReserve || 0);
    const inv = Math.max(0, p.portfolioVal || 0);
    const gold = Math.max(0, p.goldVal || 0);
    const d = Math.max(0, p.totalDebt || 0);
    const grossAssets = c + inv + gold;
    const nw = typeof p.netWorth === 'number' ? p.netWorth : grossAssets - d;

    let cashPct = 0;
    let investPct = 0;
    let goldPct = 0;
    let debtRatio = 0;
    let solvencyRatio = 100;

    if (grossAssets > 0) {
      cashPct = (c / grossAssets) * 100;
      investPct = (inv / grossAssets) * 100;
      goldPct = (gold / grossAssets) * 100;
      debtRatio = (d / grossAssets) * 100;
      solvencyRatio = (nw / grossAssets) * 100;
    } else if (d > 0) {
      debtRatio = 100;
      solvencyRatio = -100;
    }

    return {
      grossAssets,
      cashPct: Math.round(cashPct * 10) / 10,
      investPct: Math.round(investPct * 10) / 10,
      goldPct: Math.round(goldPct * 10) / 10,
      debtRatio: Math.round(debtRatio * 10) / 10,
      solvencyRatio: Math.round(solvencyRatio * 10) / 10,
    };
  }

  const FinancialHealth = {
    calculateFinancialHealthScore,
    generateNextBestMoves,
    calculateRadarCoordinates,
    renderRadarChartSVG,
    calculateNetWorthComposition,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.FinancialHealth = FinancialHealth;
  global.MoneyApp.calculateFinancialHealthScore = calculateFinancialHealthScore;
  global.MoneyApp.generateNextBestMoves = generateNextBestMoves;

  if (typeof global !== 'undefined') {
    if (typeof global.FinancialHealth === 'undefined') {
      global.FinancialHealth = FinancialHealth;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
