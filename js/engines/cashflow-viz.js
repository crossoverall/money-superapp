/**
 * @typedef {Object} Budget503020Params
 * @property {number} [totalIncome] - Monthly gross/net income base in THB
 * @property {Array<{ name: string, value: number|string, budgetType?: string }>} [expenses] - Itemized monthly expenses
 * @property {Array<{ name: string, value: number|string }>} [savings] - Monthly savings / investment allocations
 * @property {number} [remaining] - Net monthly surplus or deficit in THB
 */

/**
 * @typedef {Object} BudgetRuleDonutArcs
 * @property {number} radius - SVG circle radius
 * @property {number} circumference - Perimeter length (2 * PI * r)
 * @property {number} needsArc - Arc length for Needs portion
 * @property {number} wantsArc - Arc length for Wants portion
 * @property {number} savingsArc - Arc length for Savings portion
 * @property {number} needsOffset - Stroke dashoffset for Needs arc
 * @property {number} wantsOffset - Stroke dashoffset for Wants arc
 * @property {number} savingsOffset - Stroke dashoffset for Savings arc
 */

/**
 * @typedef {Object} BudgetRule503020Result
 * @property {number} needsTotal - Total Needs expenditure in THB
 * @property {number} wantsTotal - Total Wants expenditure in THB
 * @property {number} savingsTotal - Total Savings allocation in THB
 * @property {number} totalBudget - Combined expenditure + savings
 * @property {number} base - Denominator base used for ratio calculation
 * @property {number} needsPct - Needs ratio percentage (0-100)
 * @property {number} wantsPct - Wants ratio percentage (0-100)
 * @property {number} savingsPct - Savings ratio percentage (0-100)
 * @property {string} status - Health assessment tier code
 * @property {BudgetRuleDonutArcs} donut - SVG donut arc geometry
 */

/**
 * @typedef {Object} EmergencyRunwayResult
 * @property {number} reserve - Current emergency fund reserve in THB
 * @property {number} monthlyExpenses - Monthly essential/total expenditure in THB
 * @property {number} months - Calculated runway duration in months
 * @property {'unspecified'|'danger'|'healthy'|'solid'} tier - Runway health classification
 * @property {number} target3M - Minimum 3-month survival benchmark in THB
 * @property {number} target6M - Recommended 6-month resilience benchmark in THB
 * @property {number} deficit6M - Shortfall required to reach 6-month safety buffer in THB
 */

/**
 * @typedef {Object} SankeyNode
 * @property {string} id - Node identifier
 * @property {string} name - Thai label
 * @property {string} nameEn - English label
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} width - Node bar width
 * @property {number} height - Node bar height
 * @property {number} value - Flow volume amount in THB
 * @property {string} color - Hex/CSS color code
 */

/**
 * @typedef {Object} SankeyLink
 * @property {string} source - Source node ID
 * @property {string} target - Target node ID
 * @property {number} value - Transferred volume in THB
 * @property {string} color - Ribbon fill color
 * @property {string} path - SVG cubic bezier path string
 */

/**
 * @typedef {Object} SankeyFlowResult
 * @property {boolean} hasData - Whether inputs contain non-zero cashflow
 * @property {boolean} isDeficit - Whether budget runs a net negative cash deficit
 * @property {number} deficitAmount - Deficit amount if negative
 * @property {number} totalVolume - Maximum scaling volume used for vertical layout
 * @property {SankeyNode[]} nodes - Calculated layout nodes
 * @property {SankeyLink[]} links - Calculated connection ribbons
 */

((global) => {
  const NEEDS_KEYWORDS = [
    'บ้าน',
    'เช่า',
    'หอ',
    'คอนโด',
    'ผ่อน',
    'ไฟ',
    'น้ำ',
    'เน็ต',
    'โทร',
    'เดินทาง',
    'น้ำมัน',
    'รถ',
    'bts',
    'mrt',
    'อาหาร',
    'กับข้าว',
    'ยา',
    'ประกัน',
    'ดอกเบี้ย',
    'กู้',
    'บัตร',
    'rent',
    'mortgage',
    'utility',
    'electric',
    'water',
    'internet',
    'phone',
    'transport',
    'fuel',
    'grocery',
    'food',
    'insurance',
    'loan',
    'bill',
  ];

  const WANTS_KEYWORDS = [
    'เที่ยว',
    'กาแฟ',
    'คาเฟ่',
    'กินนอก',
    'ช้อป',
    'เสื้อผ้า',
    'เกม',
    'หนัง',
    'สตรีมมิ่ง',
    'ปาร์ตี้',
    'บุฟเฟต์',
    'ของเล่น',
    'dining',
    'coffee',
    'cafe',
    'shopping',
    'entertainment',
    'netflix',
    'game',
    'travel',
    'vacation',
    'hobby',
    'party',
  ];

  /**
   * Classifies budget item into Needs, Wants, or Savings based on keywords or budgetType metadata.
   * @param {{ name?: string, budgetType?: string }} item - Item object
   * @param {'expense'|'saving'} [defaultType='expense'] - Fallback category type
   * @returns {'need'|'want'|'saving'}
   */
  function classifyBudgetType(item, defaultType = 'expense') {
    if (!item) return 'want';
    if (item.budgetType === 'need' || item.budgetType === 'want' || item.budgetType === 'saving') {
      return item.budgetType;
    }
    if (defaultType === 'saving') return 'saving';
    const name = String(item.name || '').toLowerCase();
    if (name.includes('tax') || name.includes('ภาษี') || name.includes('sso') || name.includes('ประกันสังคม')) {
      return 'need';
    }
    if (name.includes('pvd') || name.includes('สำรองเลี้ยงชีพ') || name.includes('ออม') || name.includes('ลงทุน')) {
      return 'saving';
    }
    if (WANTS_KEYWORDS.some((kw) => name.includes(kw))) {
      return 'want';
    }
    if (NEEDS_KEYWORDS.some((kw) => name.includes(kw)) && !name.includes('นอกบ้าน')) {
      return 'need';
    }
    return 'want';
  }

  /**
   * Evaluates 50/30/20 budget rule compliance and computes SVG donut geometry.
   * @param {Budget503020Params} [params]
   * @returns {BudgetRule503020Result}
   */
  function calculateBudgetRule503020({ totalIncome = 0, expenses = [], savings = [], remaining = 0 } = {}) {
    let needsTotal = 0;
    let wantsTotal = 0;
    let savingsTotal = 0;

    for (const item of expenses) {
      const val = Math.max(0, Number(item.value) || 0);
      const bType = classifyBudgetType(item, 'expense');
      if (bType === 'need') needsTotal += val;
      else if (bType === 'saving') savingsTotal += val;
      else wantsTotal += val;
    }

    for (const item of savings) {
      const val = Math.max(0, Number(item.value) || 0);
      savingsTotal += val;
    }

    if (remaining > 0) {
      savingsTotal += remaining;
    }

    const totalBudget = needsTotal + wantsTotal + savingsTotal;
    const base = Math.max(Number(totalIncome) || 0, totalBudget, 0.0001);

    const needsPct = Math.round((needsTotal / base) * 100 * 10) / 10;
    const wantsPct = Math.round((wantsTotal / base) * 100 * 10) / 10;
    const savingsPct = Math.round((savingsTotal / base) * 100 * 10) / 10;

    let status = 'moderate';
    if (savingsPct >= 30) {
      status = 'excellent_savings';
    } else if (needsPct <= 55 && wantsPct <= 35 && savingsPct >= 18) {
      status = 'balanced';
    } else if (needsPct > 60) {
      status = 'high_needs';
    } else if (wantsPct > 40) {
      status = 'high_wants';
    } else if (savingsPct < 10) {
      status = 'low_savings';
    }

    const radius = 70;
    const circumference = 2 * Math.PI * radius; // ~439.82
    const needsArc = (needsPct / 100) * circumference;
    const wantsArc = (wantsPct / 100) * circumference;
    const savingsArc = (savingsPct / 100) * circumference;

    return {
      needsTotal,
      wantsTotal,
      savingsTotal,
      totalBudget,
      base,
      needsPct,
      wantsPct,
      savingsPct,
      status,
      donut: {
        radius,
        circumference: Math.round(circumference * 100) / 100,
        needsArc: Math.round(needsArc * 100) / 100,
        wantsArc: Math.round(wantsArc * 100) / 100,
        savingsArc: Math.round(savingsArc * 100) / 100,
        needsOffset: 0,
        wantsOffset: -Math.round(needsArc * 100) / 100,
        savingsOffset: -Math.round((needsArc + wantsArc) * 100) / 100,
      },
    };
  }

  /**
   * Calculates liquid cash emergency runway duration in months and benchmark deficits.
   * @param {{ reserve?: number, monthlyExpenses?: number }} [params]
   * @returns {EmergencyRunwayResult}
   */
  function calculateEmergencyRunway({ reserve = 0, monthlyExpenses = 0 } = {}) {
    const res = Math.max(0, Number(reserve) || 0);
    const exp = Math.max(0, Number(monthlyExpenses) || 0);

    const months = exp > 0 ? res / exp : 0;
    const monthsClamped = Math.round(months * 10) / 10;

    let tier = 'danger';
    if (res <= 0 || exp <= 0) {
      tier = 'unspecified';
    } else if (monthsClamped < 3) {
      tier = 'danger';
    } else if (monthsClamped <= 6) {
      tier = 'healthy';
    } else {
      tier = 'solid';
    }

    const target3M = exp * 3;
    const target6M = exp * 6;
    const deficit6M = Math.max(0, target6M - res);

    return {
      reserve: res,
      monthlyExpenses: exp,
      months: monthsClamped,
      tier,
      target3M,
      target6M,
      deficit6M,
    };
  }

  /**
   * Generates cubic SVG ribbon path connecting two vertical bars.
   * @param {number} x0 - Start X
   * @param {number} y0Top - Start Y top
   * @param {number} y0Bottom - Start Y bottom
   * @param {number} x1 - End X
   * @param {number} y1Top - End Y top
   * @param {number} y1Bottom - End Y bottom
   * @returns {string} SVG path string
   */
  function generateSankeyRibbonPath(x0, y0Top, y0Bottom, x1, y1Top, y1Bottom) {
    const dx = x1 - x0;
    const cpX1 = x0 + dx * 0.45;
    const cpX2 = x1 - dx * 0.45;

    return `
      M ${x0.toFixed(1)} ${y0Top.toFixed(1)}
      C ${cpX1.toFixed(1)} ${y0Top.toFixed(1)}, ${cpX2.toFixed(1)} ${y1Top.toFixed(1)}, ${x1.toFixed(1)} ${y1Top.toFixed(1)}
      L ${x1.toFixed(1)} ${y1Bottom.toFixed(1)}
      C ${cpX2.toFixed(1)} ${y1Bottom.toFixed(1)}, ${cpX1.toFixed(1)} ${y0Bottom.toFixed(1)}, ${x0.toFixed(1)} ${y0Bottom.toFixed(1)}
      Z
    `.trim();
  }

  /**
   * Computes multi-stage Sankey stream flow diagram nodes and linking ribbons.
   * @param {{ totalIncome?: number, deductions?: number, needs?: number, wants?: number, savings?: number, remaining?: number, width?: number, height?: number }} [params]
   * @returns {SankeyFlowResult}
   */
  function calculateSankeyFlows({
    totalIncome = 0,
    deductions = 0,
    needs = 0,
    wants = 0,
    savings = 0,
    remaining = 0,
    width = 600,
    height = 240,
  } = {}) {
    const nodeWidth = 14;
    const colX = [Math.round(width * 0.11666666666666667), Math.round(width * 0.4), Math.round(width * 0.7)];
    const nodeGap = 10;
    const padding = { top: 22, bottom: 25 };
    const plotHeight = height - padding.top - padding.bottom;

    const outFlowSum = deductions + needs + wants + savings;
    const hasData = totalIncome > 0 || outFlowSum > 0;

    const takeHome = Math.max(0, totalIncome - deductions);
    const surplus = Math.max(0, remaining);
    const isDeficit = remaining < 0;
    const deficitAmount = isDeficit ? Math.abs(remaining) : 0;

    const totalVolume = Math.max(totalIncome, outFlowSum, 1);
    const h = (val) => (val > 0 ? (val / totalVolume) * plotHeight : 0);

    const hGross = h(totalIncome);
    const nodeGross = {
      id: 'gross',
      name: 'รายได้รวม',
      nameEn: 'Gross Income',
      x: colX[0],
      y: padding.top,
      width: nodeWidth,
      height: Math.max(hGross, 6),
      value: totalIncome,
      color: '#10b981',
    };

    const hDed = h(deductions);
    const hTakeHome = h(takeHome);

    const nodeDed = {
      id: 'deductions',
      name: 'หักตามกฎหมาย',
      nameEn: 'Deductions',
      x: colX[1],
      y: padding.top,
      width: nodeWidth,
      height: Math.max(hDed, deductions > 0 ? 4 : 0),
      value: deductions,
      color: '#8b5cf6',
    };

    const nodeTakeHome = {
      id: 'takeHome',
      name: 'รับสุทธิ',
      nameEn: 'Take-Home Pay',
      x: colX[1],
      y: nodeDed.y + nodeDed.height + (deductions > 0 ? nodeGap : 0),
      width: nodeWidth,
      height: Math.max(hTakeHome, takeHome > 0 ? 4 : 0),
      value: takeHome,
      color: '#0ea5e9',
    };

    const destSpecs = [
      {
        id: 'statutory',
        name: 'ภาษี & สังคม',
        nameEn: 'Tax & SSO',
        val: deductions,
        color: '#8b5cf6',
        from: 'deductions',
      },
      { id: 'needs', name: 'จำเป็น (Needs)', nameEn: 'Needs', val: needs, color: '#f43f5e', from: 'takeHome' },
      { id: 'wants', name: 'ตามใจ (Wants)', nameEn: 'Wants', val: wants, color: '#ec4899', from: 'takeHome' },
      {
        id: 'savings',
        name: 'ออม & ลงทุน',
        nameEn: 'Savings & Invest',
        val: savings,
        color: '#0284c7',
        from: 'takeHome',
      },
      { id: 'surplus', name: 'คงเหลือลงทุน', nameEn: 'Net Surplus', val: surplus, color: '#059669', from: 'takeHome' },
    ];

    let currDestY = padding.top;
    const rightNodes = [];
    for (const spec of destSpecs) {
      if (spec.val > 0) {
        const nodeH = Math.max(h(spec.val), 4);
        rightNodes.push({
          id: spec.id,
          name: spec.name,
          nameEn: spec.nameEn,
          x: colX[2],
          y: currDestY,
          width: nodeWidth,
          height: nodeH,
          value: spec.val,
          color: spec.color,
          from: spec.from,
        });
        currDestY += nodeH + nodeGap;
      }
    }

    const links = [];
    let grossSourceY = nodeGross.y;

    if (deductions > 0) {
      const linkH = nodeDed.height;
      links.push({
        source: 'gross',
        target: 'deductions',
        path: generateSankeyRibbonPath(
          nodeGross.x + nodeGross.width,
          grossSourceY,
          grossSourceY + linkH,
          nodeDed.x,
          nodeDed.y,
          nodeDed.y + nodeDed.height,
        ),
        color: '#8b5cf6',
        value: deductions,
      });
      grossSourceY += linkH;
    }

    if (takeHome > 0) {
      const linkH = Math.min(nodeTakeHome.height, nodeGross.y + nodeGross.height - grossSourceY);
      links.push({
        source: 'gross',
        target: 'takeHome',
        path: generateSankeyRibbonPath(
          nodeGross.x + nodeGross.width,
          grossSourceY,
          grossSourceY + linkH,
          nodeTakeHome.x,
          nodeTakeHome.y,
          nodeTakeHome.y + nodeTakeHome.height,
        ),
        color: '#0ea5e9',
        value: takeHome,
      });
    }

    const statutoryNode = rightNodes.find((n) => n.id === 'statutory');
    if (statutoryNode && deductions > 0) {
      links.push({
        source: 'deductions',
        target: 'statutory',
        path: generateSankeyRibbonPath(
          nodeDed.x + nodeDed.width,
          nodeDed.y,
          nodeDed.y + nodeDed.height,
          statutoryNode.x,
          statutoryNode.y,
          statutoryNode.y + statutoryNode.height,
        ),
        color: '#8b5cf6',
        value: deductions,
      });
    }

    let takeHomeSourceY = nodeTakeHome.y;
    for (const rNode of rightNodes.filter((n) => n.from === 'takeHome')) {
      const linkH = Math.min(rNode.height, nodeTakeHome.y + nodeTakeHome.height - takeHomeSourceY);
      links.push({
        source: 'takeHome',
        target: rNode.id,
        path: generateSankeyRibbonPath(
          nodeTakeHome.x + nodeTakeHome.width,
          takeHomeSourceY,
          takeHomeSourceY + linkH,
          rNode.x,
          rNode.y,
          rNode.y + rNode.height,
        ),
        color: rNode.color,
        value: rNode.value,
      });
      takeHomeSourceY += linkH;
    }

    const nodes = [nodeGross, nodeDed, nodeTakeHome, ...rightNodes];

    return {
      hasData,
      isDeficit,
      deficitAmount,
      totalVolume,
      nodes,
      links,
    };
  }

  /**
   * Calculates 3-way strategic distribution of monthly cash surplus.
   * Guarantees exact conservation of surplus down to integer baht.
   *
   * @param {{ surplus?: number, reservePct?: number, debtPct?: number, dcaPct?: number }} [params]
   * @returns {{ surplus: number, reservePct: number, debtPct: number, dcaPct: number, reserveAmount: number, debtAmount: number, dcaAmount: number, totalDistributed: number }}
   */
  function calculateSurplusDistribution({ surplus = 0, reservePct = 40, debtPct = 30, dcaPct = 30 } = {}) {
    const s = Math.max(0, Math.round(Number(surplus) || 0));
    if (s <= 0) {
      return {
        surplus: 0,
        reservePct: 40,
        debtPct: 30,
        dcaPct: 30,
        reserveAmount: 0,
        debtAmount: 0,
        dcaAmount: 0,
        totalDistributed: 0,
      };
    }

    const rPct = Math.max(0, Number(reservePct) || 0);
    const dbPct = Math.max(0, Number(debtPct) || 0);
    const dPct = Math.max(0, Number(dcaPct) || 0);
    const sumPct = rPct + dbPct + dPct || 100;

    const normRPct = Math.round((rPct / sumPct) * 100);
    const normDbPct = Math.round((dbPct / sumPct) * 100);
    const normDPct = Math.max(0, 100 - normRPct - normDbPct);

    const reserveAmount = Math.round((s * normRPct) / 100);
    const debtAmount = Math.round((s * normDbPct) / 100);
    const dcaAmount = Math.max(0, s - reserveAmount - debtAmount);

    return {
      surplus: s,
      reservePct: normRPct,
      debtPct: normDbPct,
      dcaPct: normDPct,
      reserveAmount,
      debtAmount,
      dcaAmount,
      totalDistributed: reserveAmount + debtAmount + dcaAmount,
    };
  }

  /**
   * Generates itemized drill-down data for a selected cashflow waterfall category.
   *
   * @param {{ category?: string, totalIncome?: number, deductions?: number, deductionItems?: Array<{ name: string, value: number }>, expenses?: Array<{ name: string, value: number, budgetType?: string }>, savings?: Array<{ name: string, value: number }>, remaining?: number, isEN?: boolean }} params
   * @returns {Object}
   */
  function getCategoryDrilldown({
    category = 'expenses',
    totalIncome = 0,
    deductions = 0,
    deductionItems = [],
    expenses = [],
    savings = [],
    remaining = 0,
    isEN = false,
  } = {}) {
    const inc = Math.max(totalIncome, 1);
    const cat = (category || 'expenses').toLowerCase().trim();

    if (cat === 'income') {
      return {
        category: 'income',
        titleTh: 'รายได้รวม (Gross Inflow)',
        titleEn: 'Gross Inflow',
        totalAmount: totalIncome,
        pctOfIncome: 100,
        items: [
          {
            name: isEN ? 'Gross Monthly Income' : 'รายได้รวมต่อเดือน',
            value: totalIncome,
            pctOfIncome: 100,
            type: 'inflow',
          },
        ],
      };
    }

    if (cat === 'deductions') {
      const items =
        Array.isArray(deductionItems) && deductionItems.length > 0
          ? deductionItems.map((d) => ({
              name: d.name,
              value: Number(d.value) || 0,
              pctOfIncome: parseFloat((((Number(d.value) || 0) / inc) * 100).toFixed(1)),
              type: 'statutory',
            }))
          : [
              {
                name: isEN ? 'Statutory Deductions (Tax/SSO/PVD)' : 'รายการหักตามกฎหมาย (ภาษี/ประกันสังคม/PVD)',
                value: deductions,
                pctOfIncome: parseFloat(((deductions / inc) * 100).toFixed(1)),
                type: 'statutory',
              },
            ];
      return {
        category: 'deductions',
        titleTh: 'หักตามกฎหมาย (Deductions)',
        titleEn: 'Statutory Deductions',
        totalAmount: deductions,
        pctOfIncome: parseFloat(((deductions / inc) * 100).toFixed(1)),
        items,
      };
    }

    if (cat === 'savings') {
      const items = (savings || []).map((s) => ({
        name: s.name || (isEN ? 'Savings / Investment' : 'เงินออม / ลงทุน'),
        value: Number(s.value) || 0,
        pctOfIncome: parseFloat((((Number(s.value) || 0) / inc) * 100).toFixed(1)),
        type: 'saving',
      }));
      const totalSavings = items.reduce((sum, item) => sum + item.value, 0);
      return {
        category: 'savings',
        titleTh: 'เงินออมและลงทุน (Savings & Investments)',
        titleEn: 'Savings & Investments',
        totalAmount: totalSavings,
        pctOfIncome: parseFloat(((totalSavings / inc) * 100).toFixed(1)),
        items,
      };
    }

    if (cat === 'remaining') {
      const isSurplus = remaining >= 0;
      return {
        category: 'remaining',
        titleTh: isSurplus ? 'คงเหลือสุทธิ (Net Surplus)' : 'ขาดดุลสุทธิ (Net Deficit)',
        titleEn: isSurplus ? 'Net Surplus' : 'Net Deficit',
        totalAmount: remaining,
        pctOfIncome: parseFloat(((remaining / inc) * 100).toFixed(1)),
        items: [
          {
            name: isSurplus
              ? isEN
                ? 'Unallocated Cashflow Surplus'
                : 'กระแสเงินสดคงเหลือสำหรับจัดสรร'
              : isEN
                ? 'Monthly Cashflow Deficit'
                : 'เงินไม่พอใช้จ่ายรายเดือน (ขาดดุล)',
            value: remaining,
            pctOfIncome: parseFloat(((remaining / inc) * 100).toFixed(1)),
            type: 'surplus',
          },
        ],
        meta: {
          isSurplus,
        },
      };
    }

    // Default: 'expenses'
    let needsTotal = 0;
    let wantsTotal = 0;
    const items = (expenses || []).map((e) => {
      const val = Number(e.value) || 0;
      const bType = e.budgetType || classifyBudgetType(e, 'expense');
      if (bType === 'need') needsTotal += val;
      else wantsTotal += val;
      return {
        name: e.name || (isEN ? 'Expense' : 'ค่าใช้จ่าย'),
        value: val,
        pctOfIncome: parseFloat(((val / inc) * 100).toFixed(1)),
        type: bType,
      };
    });
    const totalExp = needsTotal + wantsTotal;

    return {
      category: 'expenses',
      titleTh: 'ค่าใช้จ่ายทั่วไป (Living Expenses)',
      titleEn: 'Living Expenses',
      totalAmount: totalExp,
      pctOfIncome: parseFloat(((totalExp / inc) * 100).toFixed(1)),
      items,
      meta: {
        needsTotal,
        wantsTotal,
        needsPct: totalExp > 0 ? parseFloat(((needsTotal / totalExp) * 100).toFixed(1)) : 0,
        wantsPct: totalExp > 0 ? parseFloat(((wantsTotal / totalExp) * 100).toFixed(1)) : 0,
      },
    };
  }

  function renderCashflowWaterfall(
    svgEl,
    {
      totalIncome = 0,
      deductions = 0,
      generalExpenses = 0,
      totalSavings = 0,
      remaining = 0,
      selectedCategory = null,
      isEN = false,
      fmtCurrency = (v) => String(v),
    } = {},
  ) {
    if (!svgEl) return;

    const hasData = totalIncome > 0 || deductions > 0 || generalExpenses > 0 || totalSavings > 0;
    if (!hasData) {
      const msg = isEN
        ? 'Enter income and expenses to visualize cashflow waterfall'
        : 'ระบุรายได้และค่าใช้จ่ายเพื่อดูกระแสเงินสดสายธารน้ำตก';
      svgEl.innerHTML = `<text x="300" y="115" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="inherit">${msg}</text>`;
      return;
    }

    const steps = [
      {
        id: 'income',
        name: isEN ? 'Gross Income' : 'รายได้รวม',
        sub: isEN ? 'Inflow' : 'รับเข้า',
        start: 0,
        end: totalIncome,
        delta: totalIncome,
        type: 'inflow',
        color: '#10b981',
      },
      {
        id: 'deductions',
        name: isEN ? 'Deductions' : 'หักกฎหมาย',
        sub: isEN ? 'Tax/SSO/PVD' : 'ภาษี/SSO/PVD',
        start: totalIncome,
        end: totalIncome - deductions,
        delta: -deductions,
        type: 'outflow',
        color: '#8b5cf6',
      },
      {
        id: 'expenses',
        name: isEN ? 'Expenses' : 'ค่าใช้จ่าย',
        sub: isEN ? 'Living cost' : 'ค่าใช้จ่ายทั่วไป',
        start: totalIncome - deductions,
        end: totalIncome - deductions - generalExpenses,
        delta: -generalExpenses,
        type: 'outflow',
        color: '#f43f5e',
      },
      {
        id: 'savings',
        name: isEN ? 'Savings' : 'เงินออม',
        sub: isEN ? 'Invest/Fund' : 'ออม/ลงทุน',
        start: totalIncome - deductions - generalExpenses,
        end: remaining,
        delta: -totalSavings,
        type: 'outflow',
        color: '#0284c7',
      },
      {
        id: 'remaining',
        name: remaining >= 0 ? (isEN ? 'Net Surplus' : 'คงเหลือสุทธิ') : isEN ? 'Deficit' : 'ขาดดุล (ติดลบ)',
        sub: remaining >= 0 ? (isEN ? 'Investable' : 'ส่วนเกินลงทุน') : isEN ? 'Negative' : 'เงินไม่พอ',
        start: 0,
        end: remaining,
        delta: remaining,
        type: 'net',
        color: remaining > 0 ? '#059669' : remaining === 0 ? '#64748b' : '#dc2626',
      },
    ];

    const valMax = Math.max(totalIncome, deductions + generalExpenses + totalSavings, 1);
    const valMin = Math.min(0, remaining);
    const valRange = Math.max(valMax - valMin, 1);

    const width = 600;
    const height = 230;
    const padding = { top: 32, right: 25, bottom: 42, left: 60 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const mapY = (v) => padding.top + plotHeight - ((v - valMin) / valRange) * plotHeight;
    const zeroY = mapY(0);

    let svgHtml = '';

    // 1. Gridlines
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const ratio = i / gridSteps;
      const v = valMin + ratio * valRange;
      const y = mapY(v);
      svgHtml += `<line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" stroke="var(--line, rgba(148,163,184,0.22))" stroke-width="1" stroke-dasharray="3,3" />`;

      let lbl = '';
      const absV = Math.abs(v);
      if (absV >= 1000000) lbl = `${(v / 1000000).toFixed(1)}M`;
      else if (absV >= 1000) lbl = `${(v / 1000).toFixed(0)}K`;
      else lbl = Math.round(v).toString();

      svgHtml += `<text x="${padding.left - 8}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" fill="var(--ink-faint, #94a3b8)" font-size="10" font-family="inherit">${lbl}</text>`;
    }

    // 2. Zero Baseline (if valMin < 0)
    if (valMin < 0) {
      svgHtml += `<line x1="${padding.left}" y1="${zeroY.toFixed(1)}" x2="${width - padding.right}" y2="${zeroY.toFixed(1)}" stroke="var(--ink-faint, #64748b)" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.8" />`;
    }

    // 3. Connectors & Bars
    const colWidth = plotWidth / steps.length;
    const barWidth = 54;

    steps.forEach((step, idx) => {
      const cx = padding.left + (idx + 0.5) * colWidth;
      const bx = cx - barWidth / 2;
      const yTop = mapY(Math.max(step.start, step.end));
      const yBottom = mapY(Math.min(step.start, step.end));
      const rawHeight = Math.abs(yBottom - yTop);
      const barHeight = rawHeight === 0 ? 2 : Math.max(2, rawHeight);
      const drawY = Math.min(yTop, height - padding.bottom - barHeight);

      // Connecting bridge line to next step
      if (idx < steps.length - 1) {
        const nextCx = padding.left + (idx + 1.5) * colWidth;
        const nextBx = nextCx - barWidth / 2;
        const bridgeLevel = idx === 3 ? remaining : step.end;
        const bridgeY = mapY(bridgeLevel);
        svgHtml += `<line x1="${(bx + barWidth).toFixed(1)}" y1="${bridgeY.toFixed(1)}" x2="${nextBx.toFixed(1)}" y2="${bridgeY.toFixed(1)}" stroke="var(--line, rgba(148,163,184,0.45))" stroke-width="1.5" stroke-dasharray="3,3" />`;
      }

      // Bar Rect
      const incBase = totalIncome > 0 ? totalIncome : valMax;
      const pctVal = Math.abs((step.delta / incBase) * 100);
      const tip = `${step.name}: ${step.delta >= 0 ? '+' : ''}${fmtCurrency(step.delta)} (${pctVal.toFixed(1)}%)`;
      const isSelected = selectedCategory === step.id;
      const barOpacity = selectedCategory ? (isSelected ? '1' : '0.35') : '0.9';
      const strokeAttr = isSelected
        ? `stroke="var(--core, #10b981)" stroke-width="2.5"`
        : `stroke="none" stroke-width="0"`;

      svgHtml += `
        <g class="waterfall-bar${isSelected ? ' selected' : ''}" data-category="${step.id}" style="cursor:pointer;" tabindex="0" role="button" aria-label="${tip}">
          <rect x="${bx.toFixed(1)}" y="${drawY.toFixed(1)}" width="${barWidth}" height="${barHeight.toFixed(1)}" rx="4" fill="${step.color}" opacity="${barOpacity}" ${strokeAttr}>
            <title>${tip}</title>
          </rect>
        </g>
      `;

      // Value label
      const pctStr = pctVal > 0 ? `${pctVal.toFixed(0)}%` : '0%';
      const valSign = step.delta > 0 ? '+' : step.delta < 0 ? '-' : '';
      const absAmt = Math.abs(step.delta);
      let shortAmt = '';
      if (absAmt >= 1000000) shortAmt = `${(absAmt / 1000000).toFixed(1)}M`;
      else if (absAmt >= 1000) shortAmt = `${(absAmt / 1000).toFixed(0)}K`;
      else shortAmt = Math.round(absAmt).toString();

      const lblY = step.delta < 0 && step.type === 'net' ? drawY + barHeight + 13 : drawY - 6;
      svgHtml += `<text x="${cx.toFixed(1)}" y="${lblY.toFixed(1)}" text-anchor="middle" fill="var(--ink, #1e293b)" font-size="10.5" font-weight="700" font-family="inherit">${valSign}${shortAmt} <tspan font-weight="400" fill="var(--ink-dim, #64748b)" font-size="9.5">(${pctStr})</tspan></text>`;

      // Category X-axis labels
      svgHtml += `<text x="${cx.toFixed(1)}" y="${(height - padding.bottom + 16).toFixed(1)}" text-anchor="middle" fill="var(--ink, #334155)" font-size="11" font-weight="600" font-family="inherit">${step.name}</text>`;
      svgHtml += `<text x="${cx.toFixed(1)}" y="${(height - padding.bottom + 29).toFixed(1)}" text-anchor="middle" fill="var(--ink-dim, #94a3b8)" font-size="9" font-family="inherit">${step.sub}</text>`;
    });

    svgEl.innerHTML = svgHtml;
  }

  function renderCashflowSankey(
    svgEl,
    {
      totalIncome = 0,
      deductions = 0,
      livingNeeds = 0,
      lifestyleWants = 0,
      totalSavings = 0,
      remaining = 0,
      isEN = false,
      fmtCurrency = (v) => String(v),
    } = {},
  ) {
    if (!svgEl) return;

    const flow = calculateSankeyFlows({
      totalIncome,
      deductions,
      needs: livingNeeds,
      wants: lifestyleWants,
      savings: totalSavings,
      remaining,
      width: 600,
      height: 240,
    });

    if (!flow.hasData) {
      const msg = isEN
        ? 'Enter income and expenses to visualize cashflow Sankey stream'
        : 'ระบุรายได้และค่าใช้จ่ายเพื่อดูแผนผังสายธารการเงิน (Sankey)';
      svgEl.innerHTML = `<text x="300" y="120" text-anchor="middle" fill="#94a3b8" font-size="13" font-family="inherit">${msg}</text>`;
      return;
    }

    let html = '';

    // 1. Defs: Linear Gradients for Ribbons
    html += '<defs>';
    flow.links.forEach((link, idx) => {
      const gradId = `sankeyGrad_${idx}`;
      html += `
        <linearGradient id="${gradId}" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${link.color}" stop-opacity="0.38" />
          <stop offset="100%" stop-color="${link.color}" stop-opacity="0.38" />
        </linearGradient>
      `;
    });
    html += '</defs>';

    // 2. Ribbons (Links)
    flow.links.forEach((link, idx) => {
      const gradId = `sankeyGrad_${idx}`;
      const pct = flow.totalVolume > 0 ? ((link.value / flow.totalVolume) * 100).toFixed(1) : 0;
      const titleVal = `${fmtCurrency(link.value)} (${pct}%)`;
      html += `
        <path d="${link.path}" fill="url(#${gradId})" class="sankey-ribbon" style="cursor:pointer;">
          <title>${link.source} → ${link.target}: ${titleVal}</title>
        </path>
      `;
    });

    // 3. Nodes (Rectangles) & Text Labels
    const incBase = flow.totalVolume > 0 ? flow.totalVolume : 1;
    const pctStr = (v) => `${((v / incBase) * 100).toFixed(1)}%`;

    flow.nodes.forEach((node) => {
      html += `
        <rect x="${node.x.toFixed(1)}" y="${node.y.toFixed(1)}" width="${node.width}" height="${node.height.toFixed(1)}" rx="3" ry="3" fill="${node.color}" style="cursor:pointer;">
          <title>${isEN ? node.nameEn : node.name}: ${fmtCurrency(node.value)} (${pctStr(node.value)})</title>
        </rect>
      `;

      const nodeMidY = node.y + node.height / 2;
      if (node.id === 'gross') {
        const labelText = isEN ? node.nameEn : node.name;
        html += `
          <text x="${(node.x - 8).toFixed(1)}" y="${(nodeMidY - 3).toFixed(1)}" text-anchor="end" fill="var(--ink)" font-size="11" font-weight="700" font-family="inherit">${labelText}</text>
          <text x="${(node.x - 8).toFixed(1)}" y="${(nodeMidY + 11).toFixed(1)}" text-anchor="end" fill="#059669" font-size="11" font-weight="700" font-family="inherit">${fmtCurrency(node.value)}</text>
        `;
      } else if (node.id === 'deductions' || node.id === 'takeHome') {
        const labelText = isEN ? node.nameEn : node.name;
        const textX = node.x + node.width / 2;
        const displayVal = fmtCurrency(node.value);

        if (node.height < 18) {
          html += `
            <text x="${textX.toFixed(1)}" y="${(node.y - 4).toFixed(1)}" text-anchor="middle" fill="var(--ink-dim)" font-size="10" font-weight="600" font-family="inherit">${labelText} (${displayVal})</text>
          `;
        } else {
          html += `
            <text x="${textX.toFixed(1)}" y="${(nodeMidY - 3).toFixed(1)}" text-anchor="middle" fill="var(--ink)" font-size="10" font-weight="700" font-family="inherit">${labelText}</text>
            <text x="${textX.toFixed(1)}" y="${(nodeMidY + 10).toFixed(1)}" text-anchor="middle" fill="${node.color}" font-size="10" font-weight="700" font-family="inherit">${displayVal}</text>
          `;
        }
      } else {
        const labelText = isEN ? node.nameEn : node.name;
        const textX = (node.x + node.width + 8).toFixed(1);
        html += `
          <text x="${textX}" y="${(nodeMidY - 2).toFixed(1)}" text-anchor="start" fill="var(--ink)" font-size="10.5" font-weight="600" font-family="inherit">${labelText}</text>
          <text x="${textX}" y="${(nodeMidY + 10).toFixed(1)}" text-anchor="start" fill="${node.color}" font-size="10" font-weight="700" font-family="inherit">${fmtCurrency(node.value)} <tspan fill="var(--ink-faint)" font-weight="400">(${pctStr(node.value)})</tspan></text>
        `;
      }
    });

    if (flow.isDeficit) {
      const defMsg = isEN
        ? `⚠️ Overspending Deficit: -${fmtCurrency(flow.deficitAmount)}`
        : `⚠️ ขาดดุล / ค่าใช้จ่ายเกินรายได้: -${fmtCurrency(flow.deficitAmount)}`;
      html += `
        <g>
          <rect x="230" y="218" width="240" height="18" rx="4" fill="rgba(239,68,68,0.12)" stroke="rgba(239,68,68,0.3)" />
          <text x="350" y="231" text-anchor="middle" fill="#dc2626" font-size="10" font-weight="700" font-family="inherit">${defMsg}</text>
        </g>
      `;
    }

    svgEl.innerHTML = html;
  }

  const CashflowViz = {
    NEEDS_KEYWORDS,
    WANTS_KEYWORDS,
    classifyBudgetType,
    calculateBudgetRule503020,
    calculateEmergencyRunway,
    generateSankeyRibbonPath,
    calculateSankeyFlows,
    calculateSurplusDistribution,
    getCategoryDrilldown,
    renderCashflowWaterfall,
    renderCashflowSankey,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.CashflowViz = CashflowViz;
  global.MoneyApp.calculateBudgetRule503020 = calculateBudgetRule503020;
  global.MoneyApp.calculateEmergencyRunway = calculateEmergencyRunway;
  global.MoneyApp.calculateSankeyFlows = calculateSankeyFlows;
  global.MoneyApp.calculateSurplusDistribution = calculateSurplusDistribution;
  global.MoneyApp.getCategoryDrilldown = getCategoryDrilldown;

  if (typeof global !== 'undefined') {
    if (typeof global.CashflowViz === 'undefined') {
      global.CashflowViz = CashflowViz;
    }
  }
})(typeof window !== 'undefined' ? window : globalThis);
