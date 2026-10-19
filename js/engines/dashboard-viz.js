/**
 * Financial Visualizations & Coordinate Calculation Engine
 * 100% Offline & Client-Side Private — Money Superapp
 *
 * Provides pure coordinate geometry, spline smoothing, Donut arc stroke calculations,
 * Monte Carlo confidence fan geometries, and SVG chart rendering.
 */

/**
 * @typedef {Object} SmoothPoint
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 * @property {number} [val] - Associated numeric data value
 * @property {string} [date] - Associated date timestamp
 */

/**
 * @typedef {Object} DonutSegment
 * @property {string} dasharray - SVG stroke-dasharray attribute value
 * @property {string} dashoffset - SVG stroke-dashoffset attribute value
 */

/**
 * @typedef {Object} DonutSegmentsResult
 * @property {number} circumference - Outer perimeter length (2 * PI * radius)
 * @property {DonutSegment} cash - Cash asset segment geometry
 * @property {DonutSegment} invest - Investment asset segment geometry
 * @property {DonutSegment} gold - Gold & physical asset segment geometry
 */

/**
 * @typedef {Object} TrajectoryPercentilePoint
 * @property {number} p10 - 10th percentile conservative threshold
 * @property {number} p50 - 50th percentile median benchmark
 * @property {number} p90 - 90th percentile optimistic threshold
 */

/**
 * @typedef {Object} FanChartGeometryOptions
 * @property {number} [width=400] - Canvas width
 * @property {number} [height=130] - Canvas height
 * @property {number} [padL=35] - Left margin padding
 * @property {number} [padR=15] - Right margin padding
 * @property {number} [padT=15] - Top margin padding
 * @property {number} [padB=25] - Bottom margin padding
 */

/**
 * @typedef {Object} FanChartGeometryResult
 * @property {number} width - SVG canvas width
 * @property {number} height - SVG canvas height
 * @property {number} chartW - Inner plot width
 * @property {number} chartH - Inner plot height
 * @property {number} n - Final year index (cohort length - 1)
 * @property {number} maxVal - Peak upper percentile value across trajectory
 * @property {string} maxValLabel - Formatted string (e.g. '1.5M' or '500k')
 * @property {number} zeroY - Y coordinate of zero solvency baseline
 * @property {string} fanAreaPath - SVG polygon points for 10th-90th percentile fan
 * @property {string} medianPath - SVG polyline points for 50th percentile median line
 * @property {string} svgHtml - Pre-rendered inner SVG string
 */

/**
 * @typedef {Object} GrowthMetricsResult
 * @property {number} firstVal - Initial baseline value
 * @property {number} lastVal - Latest snapshot value
 * @property {number} totalDelta - Absolute total change
 * @property {number} totalPct - Percentage total change (0-100)
 * @property {number} momDelta - Absolute month-over-month change
 * @property {number} momPct - Percentage month-over-month change
 * @property {number} count - Total data point count
 */

/**
 * @typedef {Object} HistoricalSnapshot
 * @property {string} date - ISO date string
 * @property {number} [netWorth] - Net worth amount in THB
 * @property {number} [savingsRate] - Savings rate percentage (0-100)
 * @property {number} [totalDebt] - Total debt amount in THB
 * @property {number} [emergencyReserve] - Emergency reserve liquid cash in THB
 */

/**
 * @typedef {Object} HistoricalChartRenderParams
 * @property {SVGElement|Object} svg - Target SVG DOM element
 * @property {HTMLElement|Object} [legend] - Target legend container DOM element
 * @property {HistoricalSnapshot[]} [snapshots=[]] - Snapshot historical records
 * @property {'networth'|'savings'|'debt'|'emergency'} [chartMode='networth'] - Metric series mode
 * @property {string} [unit='THB'] - Currency or unit denomination string
 * @property {boolean} [isEn=false] - True if English localization active
 * @property {(amount: number) => string} [formatMoney] - Number formatter callback
 * @property {(str: string) => string} [escapeHtml] - HTML sanitization helper
 * @property {(event: any, date: string, valStr: string) => void} [showTooltip] - Tooltip activate callback
 * @property {() => void} [hideTooltip] - Tooltip dismiss callback
 * @property {(metrics: GrowthMetricsResult|null, mode: string, isCurrency: boolean) => void} [updateTrajectoryUI] - Trajectory header callback
 */

((global) => {
  /**
   * Generates a smooth SVG path coordinate string with Catmull-Rom cubic bezier curves.
   * @param {SmoothPoint[]} points - Sequence of coordinate points
   * @returns {string} SVG path data string ('d' attribute)
   */
  function buildSmoothSvgPath(points) {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${Math.round(cp1x * 10) / 10} ${Math.round(cp1y * 10) / 10}, ${Math.round(cp2x * 10) / 10} ${Math.round(cp2y * 10) / 10}, ${p2.x} ${p2.y}`;
    }
    return path;
  }

  /**
   * Computes stroke-dasharray and stroke-dashoffset geometry for a 3-segment SVG Donut chart.
   * @param {number} cashPct - Cash allocation percentage (0-100)
   * @param {number} investPct - Investment allocation percentage (0-100)
   * @param {number} goldPct - Gold & physical asset allocation percentage (0-100)
   * @param {number} [radius=60] - Circle radius in SVG units
   * @returns {DonutSegmentsResult} SVG donut stroke parameters
   */
  function calculateDonutSegments(cashPct = 0, investPct = 0, goldPct = 0, radius = 60) {
    const r = typeof radius === 'number' && radius > 0 ? radius : 60;
    const C = 2 * Math.PI * r;

    const cPct = Math.max(0, Number(cashPct) || 0);
    const iPct = Math.max(0, Number(investPct) || 0);
    const gPct = Math.max(0, Number(goldPct) || 0);

    if (cPct <= 0 && iPct <= 0 && gPct <= 0) {
      const emptyArray = `0 ${C.toFixed(2)}`;
      return {
        circumference: C,
        cash: { dasharray: emptyArray, dashoffset: '0' },
        invest: { dasharray: emptyArray, dashoffset: '0' },
        gold: { dasharray: emptyArray, dashoffset: '0' },
      };
    }

    const segCash = (cPct / 100) * C;
    const segInvest = (iPct / 100) * C;
    const segGold = (gPct / 100) * C;

    return {
      circumference: C,
      cash: {
        dasharray: `${segCash.toFixed(2)} ${(C - segCash).toFixed(2)}`,
        dashoffset: '0',
      },
      invest: {
        dasharray: `${segInvest.toFixed(2)} ${(C - segInvest).toFixed(2)}`,
        dashoffset: (-segCash).toFixed(2) === '-0.00' ? '0' : (-segCash).toFixed(2),
      },
      gold: {
        dasharray: `${segGold.toFixed(2)} ${(C - segGold).toFixed(2)}`,
        dashoffset: (-(segCash + segInvest)).toFixed(2) === '-0.00' ? '0' : (-(segCash + segInvest)).toFixed(2),
      },
    };
  }

  /**
   * Generates coordinate geometries and SVG paths for a Monte Carlo confidence fan chart.
   * @param {TrajectoryPercentilePoint[]} trajectoryPercentiles - Annual projection percentiles
   * @param {FanChartGeometryOptions} [options={}] - Viewport and padding configuration
   * @returns {FanChartGeometryResult|null} Calculated geometric coordinates and inner SVG markup
   */
  function generateFanChartGeometry(trajectoryPercentiles, options = {}) {
    if (!trajectoryPercentiles || trajectoryPercentiles.length === 0) {
      return null;
    }

    const width = typeof options.width === 'number' ? options.width : 400;
    const height = typeof options.height === 'number' ? options.height : 130;
    const padL = typeof options.padL === 'number' ? options.padL : 35;
    const padR = typeof options.padR === 'number' ? options.padR : 15;
    const padT = typeof options.padT === 'number' ? options.padT : 15;
    const padB = typeof options.padB === 'number' ? options.padB : 25;

    const chartW = width - padL - padR;
    const chartH = height - padT - padB;
    const n = trajectoryPercentiles.length - 1;

    let maxVal = 1000;
    for (let i = 0; i <= n; i++) {
      const pt = trajectoryPercentiles[i];
      if (pt && typeof pt.p90 === 'number' && pt.p90 > maxVal) {
        maxVal = pt.p90;
      }
    }

    function getX(yr) {
      return padL + (n > 0 ? (yr / n) * chartW : chartW / 2);
    }

    function getY(val) {
      const clamped = Math.max(0, Math.min(maxVal, Number(val) || 0));
      return padT + chartH - (clamped / maxVal) * chartH;
    }

    const upperPoints = [];
    const lowerPoints = [];
    const medianPoints = [];

    for (let yr = 0; yr <= n; yr++) {
      const pt = trajectoryPercentiles[yr] || { p10: 0, p50: 0, p90: 0 };
      const x = Math.round(getX(yr) * 10) / 10;
      const yP90 = Math.round(getY(pt.p90) * 10) / 10;
      const yP10 = Math.round(getY(pt.p10) * 10) / 10;
      const yP50 = Math.round(getY(pt.p50) * 10) / 10;

      upperPoints.push(`${x},${yP90}`);
      lowerPoints.unshift(`${x},${yP10}`);
      medianPoints.push(`${x},${yP50}`);
    }

    const fanAreaPath = `${upperPoints.join(' ')} ${lowerPoints.join(' ')}`;
    const medianPath = medianPoints.join(' ');
    const zeroY = Math.round(getY(0) * 10) / 10;
    const maxValLabel = maxVal >= 1000000 ? `${(maxVal / 1000000).toFixed(1)}M` : `${Math.round(maxVal / 1000)}k`;

    const svgHtml = `
    <!-- Zero Line -->
    <line x1="${padL}" y1="${zeroY}" x2="${padL + chartW}" y2="${zeroY}" stroke="var(--danger, #ef4444)" stroke-width="1.2" stroke-dasharray="3,3" opacity="0.6" />
    <text x="${padL - 4}" y="${zeroY + 3}" font-size="9" fill="var(--danger, #ef4444)" text-anchor="end" font-weight="600">0</text>
    
    <!-- Max label -->
    <text x="${padL - 4}" y="${padT + 8}" font-size="9" fill="var(--ink-faint)" text-anchor="end">${maxValLabel}</text>

    <!-- Year 0 and Year N labels -->
    <text x="${padL}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="start">Yr 0</text>
    <text x="${padL + chartW / 2}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="middle">Yr ${Math.round(n / 2)}</text>
    <text x="${padL + chartW}" y="${height - 8}" font-size="9" fill="var(--ink-faint)" text-anchor="end">Yr ${n}</text>

    <!-- 10th-90th Percentile Confidence Fan Area -->
    <polygon points="${fanAreaPath}" fill="rgba(59, 130, 246, 0.18)" stroke="rgba(59, 130, 246, 0.4)" stroke-width="0.8" />

    <!-- 50th Percentile Median Path -->
    <polyline points="${medianPath}" fill="none" stroke="var(--accent, #3b82f6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  `;

    return {
      width,
      height,
      chartW,
      chartH,
      n,
      maxVal,
      maxValLabel,
      zeroY,
      fanAreaPath,
      medianPath,
      svgHtml,
    };
  }

  /**
   * Renders the Monte Carlo longevity confidence fan chart into an SVG element.
   * @param {SVGElement|Object} svg - Target SVG DOM element
   * @param {TrajectoryPercentilePoint[]} trajectoryPercentiles - Annual projection percentiles
   * @param {FanChartGeometryOptions} [options={}] - Optional layout configuration
   */
  function renderMonteCarloFanChart(svg, trajectoryPercentiles, options = {}) {
    if (!svg || !trajectoryPercentiles || trajectoryPercentiles.length === 0) return;
    const geom = generateFanChartGeometry(trajectoryPercentiles, options);
    if (!geom) return;
    svg.innerHTML = geom.svgHtml;
  }

  /**
   * Computes trajectory growth metrics (total and month-over-month deltas).
   * @param {HistoricalSnapshot[]} snapshots - Historical snapshot records
   * @param {'networth'|'savings'|'debt'|'emergency'} [mode='networth'] - Metric series mode
   * @returns {GrowthMetricsResult} Calculated growth and trajectory metrics
   */
  function calculateGrowthMetrics(snapshots, mode = 'networth') {
    if (!snapshots || snapshots.length === 0) {
      return { firstVal: 0, lastVal: 0, totalDelta: 0, totalPct: 0, momDelta: 0, momPct: 0, count: 0 };
    }

    const values = snapshots.map((s) => {
      if (mode === 'savings') return s.savingsRate || 0;
      if (mode === 'emergency') return s.emergencyReserve || 0;
      if (mode === 'debt') return s.totalDebt || 0;
      return s.netWorth || 0;
    });

    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const totalDelta = lastVal - firstVal;
    const totalPct = firstVal !== 0 ? parseFloat(((totalDelta / Math.abs(firstVal)) * 100).toFixed(1)) : 0;

    let momDelta = 0;
    let momPct = 0;
    if (values.length >= 2) {
      const prevVal = values[values.length - 2];
      momDelta = lastVal - prevVal;
      momPct = prevVal !== 0 ? parseFloat(((momDelta / Math.abs(prevVal)) * 100).toFixed(1)) : 0;
    }

    return {
      firstVal,
      lastVal,
      totalDelta,
      totalPct,
      momDelta,
      momPct,
      count: values.length,
    };
  }

  /**
   * Renders an offline historical SVG spline chart with gradients, axis ticks, and interactive dots.
   * @param {HistoricalChartRenderParams} params - Chart rendering parameters and callbacks
   * @returns {Object|null} Rendered coordinates and metrics or null if SVG element missing
   */
  function renderHistoricalSvgChart(params = {}) {
    const {
      svg,
      legend,
      snapshots = [],
      chartMode = 'networth',
      unit = 'THB',
      isEn = false,
      formatMoney = (amt) => Number(amt).toLocaleString(isEn ? 'en-US' : 'th-TH', { maximumFractionDigits: 0 }),
      escapeHtml = (str) =>
        String(str ?? '').replace(
          /[&<>"']/g,
          (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m],
        ),
      showTooltip,
      hideTooltip,
      updateTrajectoryUI,
    } = params;

    if (!svg) return null;

    if (!snapshots || snapshots.length === 0) {
      svg.innerHTML = `<text x="300" y="110" text-anchor="middle" fill="var(--ink-faint)" font-size="14">${isEn ? 'No snapshot data available yet' : 'ยังไม่มีข้อมูลประวัติสแนปช็อต'}</text>`;
      if (legend) legend.innerHTML = '';
      if (typeof updateTrajectoryUI === 'function') {
        updateTrajectoryUI(null, chartMode, true);
      }
      return { points: [], values: [], count: 0 };
    }

    const width = 600;
    const height = 220;
    const padding = { top: 25, right: 30, bottom: 35, left: 65 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    let values = [];
    let strokeColor = '#2563eb';
    let gradientColor = '#2563eb';
    let valueLabel = isEn ? 'Net Worth' : 'ความมั่งคั่งสุทธิ';
    let isCurrency = true;

    if (chartMode === 'networth') {
      values = snapshots.map((s) => s.netWorth || 0);
      strokeColor = '#2563eb';
      gradientColor = '#2563eb';
      valueLabel = isEn ? 'Net Worth (THB)' : 'ความมั่งคั่งสุทธิ (บาท)';
      isCurrency = true;
    } else if (chartMode === 'savings') {
      values = snapshots.map((s) => s.savingsRate || 0);
      strokeColor = '#2F8B76';
      gradientColor = '#2F8B76';
      valueLabel = isEn ? 'Savings Rate (%)' : 'อัตราการออม (%)';
      isCurrency = false;
    } else if (chartMode === 'debt') {
      values = snapshots.map((s) => s.totalDebt || 0);
      strokeColor = '#A9762F';
      gradientColor = '#A9762F';
      valueLabel = isEn ? 'Total Debt (THB)' : 'หนี้คงค้าง (บาท)';
      isCurrency = true;
    } else {
      values = snapshots.map((s) => s.emergencyReserve || 0);
      strokeColor = '#7e22ce';
      gradientColor = '#7e22ce';
      valueLabel = isEn ? 'Emergency Reserve (THB)' : 'เงินสำรองฉุกเฉิน (บาท)';
      isCurrency = true;
    }

    // Trajectory banner callback
    const metrics = calculateGrowthMetrics(snapshots, chartMode);
    if (typeof updateTrajectoryUI === 'function') {
      updateTrajectoryUI(metrics, chartMode, isCurrency);
    }

    // Check if all values are zero
    const nonZero = values.some((v) => v !== 0);
    if (!nonZero && values.every((v) => v === 0)) {
      svg.innerHTML = `<text x="300" y="110" text-anchor="middle" fill="var(--ink-faint)" font-size="14">${isEn ? 'No data to display — save a snapshot to see trends' : 'ยังไม่มีข้อมูลสำหรับแสดง — บันทึกสแนปช็อตเพื่อดูแนวโน้ม'}</text>`;
      if (legend) legend.innerHTML = '';
      return { points: [], values, count: values.length, metrics };
    }

    let minVal = Math.min(...values);
    let maxVal = Math.max(...values);
    if (minVal === maxVal) {
      minVal = Math.max(0, minVal * 0.8);
      maxVal = maxVal * 1.2 || 100;
    }
    const range = maxVal - minVal || 1;

    const points = snapshots.map((s, idx) => {
      const x = padding.left + (snapshots.length === 1 ? plotWidth / 2 : (idx / (snapshots.length - 1)) * plotWidth);
      const y = padding.top + plotHeight - ((values[idx] - minVal) / range) * plotHeight;
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        val: values[idx],
        date: s.date,
      };
    });

    // Grid lines & Y-axis labels
    let gridHtml = '';
    const gridSteps = 4;
    for (let i = 0; i <= gridSteps; i++) {
      const yVal = minVal + range * (i / gridSteps);
      const yPos = padding.top + plotHeight - (i / gridSteps) * plotHeight;
      const labelStr = isCurrency ? formatMoney(yVal) : `${yVal.toFixed(0)}%`;
      gridHtml += `
        <line x1="${padding.left}" y1="${yPos}" x2="${width - padding.right}" y2="${yPos}" stroke="var(--line)" stroke-dasharray="3,3" />
        <text x="${padding.left - 8}" y="${yPos + 4}" text-anchor="end" fill="var(--ink-faint)" font-size="10">${labelStr}</text>
      `;
    }

    // X-axis dates
    let xHtml = '';
    points.forEach((p, i) => {
      if (points.length <= 6 || i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 5) === 0) {
        const shortDate = String(p.date || '').slice(5);
        xHtml += `<text x="${p.x}" y="${height - 12}" text-anchor="middle" fill="var(--ink-faint)" font-size="10">${shortDate}</text>`;
      }
    });

    // Defs for smooth gradient fill
    const defsHtml = `
      <defs>
        <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${gradientColor}" stop-opacity="0.32" />
          <stop offset="100%" stop-color="${gradientColor}" stop-opacity="0.0" />
        </linearGradient>
      </defs>
    `;

    // Smooth spline path
    const linePath = buildSmoothSvgPath(points);
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + plotHeight} L ${points[0].x} ${padding.top + plotHeight} Z`;

    // Interactive point dots
    let dotsHtml = '';
    points.forEach((p) => {
      const valStr = isCurrency ? `${formatMoney(p.val)} ${unit}` : `${p.val}%`;
      dotsHtml += `
        <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="${strokeColor}" stroke="var(--panel)" stroke-width="2.5" class="cursor-pointer chart-dot"
          data-date="${escapeHtml(p.date)}" data-val="${escapeHtml(valStr)}" />
      `;
    });

    svg.innerHTML = `
      ${defsHtml}
      ${gridHtml}
      ${xHtml}
      <path d="${areaPath}" fill="url(#chartAreaGrad)" />
      <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      ${dotsHtml}
    `;

    // Delegated tooltip listeners
    svg.onmouseover = (e) => {
      if (typeof showTooltip !== 'function') return;
      const dot = e.target && typeof e.target.closest === 'function' ? e.target.closest('.chart-dot') : null;
      if (dot?.dataset) {
        showTooltip(e, dot.dataset.date, dot.dataset.val);
      }
    };
    svg.onmouseout = (e) => {
      if (typeof hideTooltip !== 'function') return;
      if (e.target && typeof e.target.closest === 'function' && e.target.closest('.chart-dot')) {
        hideTooltip();
      }
    };

    if (legend) {
      const latestVal = values[values.length - 1];
      const latestStr = isCurrency ? `${formatMoney(latestVal)} ${unit}` : `${latestVal}%`;
      legend.innerHTML = `
        <div class="flex items-center gap-1.5">
          <span class="inline-block w-3 h-3 rounded-full" style="background:${strokeColor};"></span>
          <span class="font-medium" style="color:var(--ink)">${escapeHtml(valueLabel)}</span>
        </div>
        <span style="color:var(--ink-faint); margin-left:8px;">|</span>
        <span style="font-size:11px; color:var(--ink-dim);">${isEn ? 'Latest: ' : 'ล่าสุด: '} <strong>${latestStr}</strong></span>
      `;
    }

    return {
      points,
      values,
      minVal,
      maxVal,
      linePath,
      areaPath,
      metrics,
    };
  }

  const DashboardViz = {
    buildSmoothSvgPath,
    calculateDonutSegments,
    generateFanChartGeometry,
    renderMonteCarloFanChart,
    calculateGrowthMetrics,
    renderHistoricalSvgChart,
  };

  // Attach to MoneyApp and global scope
  global.MoneyApp = global.MoneyApp || {};
  global.MoneyApp.DashboardViz = DashboardViz;
  global.MoneyApp.buildSmoothSvgPath = buildSmoothSvgPath;
  global.MoneyApp.calculateDonutSegments = calculateDonutSegments;
  global.MoneyApp.generateFanChartGeometry = generateFanChartGeometry;
  global.MoneyApp.renderHistoricalSvgChart = renderHistoricalSvgChart;

  if (typeof global !== 'undefined') {
    if (typeof global.DashboardViz === 'undefined') {
      global.DashboardViz = DashboardViz;
    }
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardViz;
  }
})(typeof window !== 'undefined' ? window : globalThis);
